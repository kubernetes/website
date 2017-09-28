---
approvers:
- pweil-
title: Pod安全策略
---

`PodSecurityPolicy`（Pod安全策略）类型的对象对Pod中影响 `SecurityContext` 的能力进行管控，这些能力会应用于pod和容器。

查看 [Pod安全策略提案](https://git.k8s.io/community/contributors/design-proposals/auth/security-context-constraints.md) 了解更多信息。

* TOC
{:toc}

## 什么是Pod安全策略？

_Pod安全策略_ 是一种控制Pod行为和访问能力的集群级别的资源。 
`PodSecurityPolicy` 对象定义一组Pod运行所必须的条件，只有满足了这些条件的Pod才会被系统接受。 
使用PodSecurityPolicy对象，管理员可以控制以下事项：

| 控制的层面                                                     | 字段名称                     |
| ------------------------------------------------------------- | --------------------------------- |
| 特权容器的运行                                                  | `privileged`                      |
| 添加到容器中的默认权能字                                         | `defaultAddCapabilities`          |
| 从容器中去掉的权能字                                             | `requiredDropCapabilities`        |
| 容器能够请求添加的权能字                                         | `allowedCapabilities`             |
| 控制卷类型的使用                                                | [`volumes`](#controlling-volumes) |
| 主机网络的使用                                                  | [`hostNetwork`](#host-network)    |
| 主机端口的使用                                                  | `hostPorts`                       |
| 主机PID的namespace的使用                                        | `hostPID`                         |
| 主机IPC的namespace的使用                                        | `hostIPC`                         |
| 容器的SELinux上下文                                             | [`seLinux`](#selinux)             |
| 用户ID                                                         | [`runAsUser`](#runasuser)         |
| 配置允许的补充组                                                | [`supplementalGroups`](#supplementalgroups) |
| 为Pod的卷分配FSGroup                                           | [`fsGroup`](#fsgroup)             |
| 要求使用只读根文件系统                                           | `readOnlyRootFilesystem`          |

_Pod安全策略_ 包含一些配置和策略，用来控制Pod可以访问的有安全约束的功能特性。
这些设置分为三类：

- *由布尔型值控制*: 这类字段默认对应最严格限制的取值。
- *由一个可选值的集合控制*：Kubernetes根据可选值集合检查这类字段，确保所指定的值在集合中。
- *由策略控制*: 这类选项分别对应某种策略，并由该策略提供生成选项值的机制和确保选项值处于可选值范围内的机制。


## 策略

### RunAsUser

- *MustRunAs* - Kubernetes要求为此策略指定一个range（区间）值，使用区间中的第一个值作为默认值，并使用所配置的区间来验证给定值的合法性。
- *MustRunAsNonRoot* - 针对所提交的Pod配置，Kubernetes要求或者其中 `runAsUser` 值，字段的取值不能为零，或者所使用的映像中包含 `USER` 指令。
  没有默认设置。
- *RunAsAny* - 此策略无默认值。用户可以为 `runAsUser` 设置任意值。

### SELinux

- *MustRunAs* - 如果不使用预分配值， 则需要对 ` selinuxoptions `进行配置。 
  使用` selinuxoptions `作为默认值。 对 ` selinuxoptions ` 进行验证。
- *RunAsAny* - 此策略无默认值。用户可以为 `seLinuxOptions` 设置任意值。

### SupplementalGroups

- *MustRunAs* - 至少需要指定一个区间。 以第一个区间的最小值作为默认值。 对所有区间进行验证。
- *RunAsAny* - 此策略无默认值。用户可以为 `supplementalGroups` 设置任意值。

### FSGroup

- *MustRunAs* - 至少需要指定一个区间。 以第一个区间的最小值作为默认值。 对第一个区间中的首个ID进行验证。
- *RunAsAny* - 此策略无默认值。用户可以设置任意 `fsGroup` ID。

### 卷的控制

通过设置Pod安全策略（PSP）的 `volumes` 字段，可以对指定的卷类型使用进行控制。
该字段的可用值如下，它们对应于创建卷时的卷来源：

1. azureFile
1. azureDisk
1. flocker
1. flexVolume
1. hostPath
1. emptyDir
1. gcePersistentDisk
1. awsElasticBlockStore
1. gitRepo
1. secret
1. nfs
1. iscsi
1. glusterfs
1. persistentVolumeClaim
1. rbd
1. cinder
1. cephFS
1. downwardAPI
1. fc
1. configMap
1. vsphereVolume
1. quobyte
1. photonPersistentDisk
1. projected
1. portworxVolume
1. scaleIO
1. storageos
1. \* (允许所有卷)

推荐的合法卷类型的最小集为
configMap、 downwardAPI、 emptyDir、 persistentVolumeClaim、 secret和projected。

### 主机网络
 - *HostPorts*，默认值为 `empty`。 是 `HostPortRange` 的列表。 `HostPortRange` 是通过 `min`(包含) 和 `max`(包含)来定义的， 它定义了可用的主机端口。
 
## 准入

 通过 `PodSecurityPolicy` 进行 _准入控制_ 能够基于集群中可用的能力，来控制资源的创建和修改。

准入通过以下方式来为Pod创建最终的安全上下文：

1. 检索所有的可用PSP(Pod安全策略)。
1. 为请求中未指定的安全上下文设置项生成字段值。
1. 根据可用策略验证最终设置。

如果Kubernetes能够找到与pod相匹配的策略，那么该pod会被接受。 如果找不到请求对应的PSP(Pod安全策略)，
那么pod会被拒绝。

Kubernetes会根据PSP，对pod的每个字段进行验证。

## 创建Pod安全策略

下面是一个 Pod安全策略的示例。 它允许设置所有字段。

{% include code.html language="yaml" file="psp.yaml" ghlink="/docs/concepts/policy/psp.yaml" %}

下载示例文件并运行以下命令来创建策略:

```shell
$ kubectl create -f ./psp.yaml
podsecuritypolicy "permissive" created
```

## 查看Pod安全策略列表

要获取现有策略的列表，运行 `kubectl get`命令:

```shell
$ kubectl get psp
NAME        PRIV   CAPS  SELINUX   RUNASUSER         FSGROUP   SUPGROUP  READONLYROOTFS  VOLUMES
permissive  false  []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
privileged  true   []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
restricted  false  []    RunAsAny  MustRunAsNonRoot  RunAsAny  RunAsAny  false           [emptyDir secret downwardAPI configMap persistentVolumeClaim projected]
```

## 编辑Pod安全策略

要以交互方式修改策略， 运行 `kubectl edit`命令:

```shell
$ kubectl edit psp permissive
```

该命令会打开一个默认的文本编辑器，用户可以在其中修改策略。

## 删除Pod安全策略

一旦用户不再需要某个策略，只需要通过 `kubectl` 来删除:

```shell
$ kubectl delete psp permissive
podsecuritypolicy "permissive" deleted
```

## 启用Pod安全策略

为在集群中使用Pod安全策略，须确保：

1.  已启用 API 类型 `extensions/v1beta1/podsecuritypolicy` (只针对1.6之前的版本)
1.  已启用 `PodSecurityPolicy` 准入控制器
1.  已经定义策略

## 使用RBAC

Kubernetes 1.5或更新的版本中，用户可以使用Pod安全策略，通过用户角色和组来控制特权容器的访问。
可以通过授权对不同Pod安全策略对象的访问进行控制。

注意：[Controller Manager](/docs/admin/kube-controller-manager/) 必须通过 [安全API端口](/docs/admin/accessing-the-api/)来运行， 且不得有超级用户的权限。 否则请求将绕过认证和授权模块， 并能够访问所有Pod安全策略对象。 用户将能够创建特权容器。

Pod安全策略使用与创建pod的用户和[pod上指定的服务账户](/docs/tasks/configure-pod-container/configure-service-account/)对应的的所有可用策略的并集进行授权。

只有在用户直接创建Pod时，针对用户的Pod安全策略才会生效。

对于代表用户创建的Pod（大多数情况下由Controller Manager创建），应该为pod的spec模板
中指定的服务账户赋予对Pod安全策略的访问权限。 典型的代表用户创建pod的资源有Deployments、ReplicaSets等。

更多详情，请参考[Pod安全策略 RBAC 示例](https://git.k8s.io/examples/staging/podsecuritypolicy/rbac/README.md)，示例在创建Pod时，基于角色和组，应用Pod安全策略来控制特权容器的访问。

