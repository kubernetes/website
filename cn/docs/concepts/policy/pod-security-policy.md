---
approvers:
- pweil-
title: Pod安全策略
---

`PodSecurityPolicy`（Pod安全策略）类型的对象对Pod中影响 `SecurityContext` 的能力进行管控，这些能力会应用于pod和容器。

查看 [Pod安全策略提议](https://git.k8s.io/community/contributors/design-proposals/auth/security-context-constraints.md) 了解更多信息。

* TOC
{:toc}

## 什么是Pod安全策略？

_Pod安全策略_ 是一种控制Pod行为和访问能力的集群级别的资源。 
`PodSecurityPolicy` 对象定义一组Pod运行所必须的条件，以便（这些条件）被系统所接受。 
它们允许管理员控制以下内容：

| 控制的层面                                                     | 字段名称                     |
| ------------------------------------------------------------- | --------------------------------- |
| 特权容器的运行                                                  | `privileged`                      |
| 添加到容器中的默认功能集                                         | `defaultAddCapabilities`          |
| 从容器中去掉的功能                                              | `requiredDropCapabilities`        |
| 容器能够请求添加的功能                                           | `allowedCapabilities`             |
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

_Pod安全策略_ 由设置和Pod访问安全特性的控制策略组成。
这些设置分为三类：

- *由布尔型值控制*: 这类字段默认为最大限制值。
- *由一个允许集合控制*：这类字段对集合进行检查，以确保它们的值被允许。
- *由策略控制*: 这类选项中具有策略，策略提供生成值的机制和确保指定值落在允许值集合内的机制。


## 策略

### RunAsUser

- *MustRunAs* - 需要配置一个"区间"。 使用其中的首个值作为默认值。 对配置区间进行验证。
- *MustRunAsNonRoot* - 要求提交的Pod具有一个非零的 `runAsUser` 值，或在镜像中定义`USER`。
  没有默认设置。
- *RunAsAny* - 没有默认设置。 允许指定任意 `runAsUser` 值。

### SELinux

- *MustRunAs* - 如果不使用预分配值， 则需要对 ` selinuxoptions `进行配置。 
  使用` selinuxoptions `作为默认值。 对 ` selinuxoptions ` 进行验证。
- *RunAsAny* - 没有默认设置。 允许指定任意 `seLinuxOptions` 值。

### SupplementalGroups

- *MustRunAs* - 至少需要指定一个区间。 以第一个区间的最小值作为默认值。 对所有区间进行验证。
- *RunAsAny* - 没有默认设置。 允许指定任意 `supplementalGroups` 值。

### FSGroup

- *MustRunAs* - 至少需要指定一个区间。 以第一个区间的最小值作为默认值。 对第一个区间中的首个ID进行验证。
- *RunAsAny* - 没有默认设置。 允许指定任意 `fsGroup` ID。

### 卷的控制

通过设置Pod安全策略（PSP）的 `volumes` 字段，可以对指定的卷类型使用进行控制。
该字段的允许值如下，它们对应于创建卷时的卷来源：

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

推荐的允许卷的最小集为
configMap、 downwardAPI、 emptyDir、 persistentVolumeClaim、 secret和projected。

### 主机网络
 - *HostPorts*，默认为 `empty`。 是 `HostPortRange` 的列表。 `HostPortRange` 是通过 `min`(包含) 和 `max`(包含)来定义的， 它定义了允许的主机端口。
 
## 准入

 通过 `PodSecurityPolicy` 进行 _准入控制_ 能够基于集群中允许的能力，来控制资源的创建和修改。

准入使用以下方法来为Pod创建最终的安全上下文：

1. 检索所有的可用PSP(Pod安全策略)。
1. 为请求未指定的安全上下文设置生成字段值。
1. 根据可用的策略验证最终设置。

如果找到匹配的策略，那么pod会被接受。 如果请求找不到对应的PSP(Pod安全策略)，
pod会被拒绝。

须根据PSP，对pod的每个字段进行验证。

## 创建Pod安全策略

这里是一个 Pod安全策略的示例。 它允许设置所有字段。

{% include code.html language="yaml" file="psp.yaml" ghlink="/docs/concepts/policy/psp.yaml" %}

下载示例文件并运行以下命令来创建策略:

```shell
$ kubectl create -f ./psp.yaml
podsecuritypolicy "permissive" created
```

## 查看Pod安全策略列表

要获取现有策略的列表，使用 `kubectl get`:

```shell
$ kubectl get psp
NAME        PRIV   CAPS  SELINUX   RUNASUSER         FSGROUP   SUPGROUP  READONLYROOTFS  VOLUMES
permissive  false  []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
privileged  true   []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
restricted  false  []    RunAsAny  MustRunAsNonRoot  RunAsAny  RunAsAny  false           [emptyDir secret downwardAPI configMap persistentVolumeClaim projected]
```

## 编辑Pod安全策略

以交互方式修改策略， 使用 `kubectl edit`:

```shell
$ kubectl edit psp permissive
```

此命令将打开一个默认的文本编辑器，用户可以在其中修改策略。

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

注意：[Controller Manager](/docs/admin/kube-controller-manager/) 必须通过 [安全API端口](/docs/admin/accessing-the-api/)来运行， 且不得有超级用户的权限。 否则请求将绕过认证和授权模块。 所有的Pod安全策略对象都将被允许。 用户将能够创建特权容器。

Pod安全策略授权使用针对创建pod的用户和[pod上指定的服务账户](/docs/tasks/configure-pod-container/configure-service-account/)的所有可用策略的并集。
.

只有在用户直接创建Pod时，针对用户的Pod安全策略的访问才会生效。

对于代表用户创建的Pod（大多数情况下由Controller Manager创建），应该在pod的spec模板
中为特定服务账户赋予访问权限。 代表用户创建pod的资源例子包括Deployments、ReplicaSets等。

更多详情，请参考创建pod时，基于角色和组，应用Pod安全策略来控制特权容器的访问的
[Pod安全策略 RBAC 示例](https://git.k8s.io/examples/staging/podsecuritypolicy/rbac/README.md)。

