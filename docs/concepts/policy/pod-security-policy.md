---
assignees:
- pweil-
title: Pod 安全策略
redirect_from:
- "/docs/user-guide/pod-security-policy/"
- "/docs/user-guide/pod-security-policy/index.html"
---

<!--
Objects of type `PodSecurityPolicy` govern the ability
to make requests on a pod that affect the `SecurityContext` that will be 
applied to a pod and container.

See [PodSecurityPolicy proposal](https://git.k8s.io/community/contributors/design-proposals/security-context-constraints.md) for more information.
-->

`PodSecurityPolicy` 类型的对象能够控制，是否可以向 Pod 发送请求，该 Pod 能够影响被应用到 Pod 和容器的 `SecurityContext`。
查看 [Pod 安全策略建议](https://git.k8s.io/community/contributors/design-proposals/security-context-constraints.md) 获取更多信息。

* TOC
{:toc}

<!--
## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls the 
actions that a pod can perform and what it has the ability to access. The
`PodSecurityPolicy` objects define a set of conditions that a pod must 
run with in order to be accepted into the system. They allow an 
administrator to control the following:
-->

## 什么是 Pod 安全策略？

_Pod 安全策略_ 是集群级别的资源，它能够控制 Pod 运行的行为，以及它具有访问什么的能力。
`PodSecurityPolicy` 对象定义了一组条件，指示 Pod 必须按系统所能接受的顺序运行。
它们允许管理员控制如下方面：

<!--
| Control Aspect                                                | Field Name                        |
| ------------------------------------------------------------- | --------------------------------- |
| Running of privileged containers                              | `privileged`                      |
| Default set of capabilities that will be added to a container | `defaultAddCapabilities`          |
| Capabilities that will be dropped from a container            | `requiredDropCapabilities`        |
| Capabilities a container can request to be added              | `allowedCapabilities`             |
| Controlling the usage of volume types                         | [`volumes`](#controlling-volumes) |
| The use of host networking                                    | [`hostNetwork`](#host-network)    |
| The use of host ports                                         | `hostPorts`                       |
| The use of host's PID namespace                               | `hostPID`                         |
| The use of host's IPC namespace                               | `hostIPC`                         |
| The use of host paths                                         | [`allowedHostPaths`](#allowed-host-paths)    |
| The SELinux context of the container                          | [`seLinux`](#selinux)             |
| The user ID                                                   | [`runAsUser`](#runasuser)         |
| Configuring allowable supplemental groups                     | [`supplementalGroups`](#supplementalgroups) |
| Allocating an FSGroup that owns the pod's volumes             | [`fsGroup`](#fsgroup)             |
| Requiring the use of a read only root file system             | `readOnlyRootFilesystem`          |
-->

| 控制面                                                        | 字段名称                          |
| ------------------------------------------------------------- | --------------------------------- |
| 已授权容器的运行                                              | `privileged`                      |
| 为容器添加默认的一组能力                                      | `defaultAddCapabilities`          |
| 为容器去掉某些能力                                            | `requiredDropCapabilities`        |
| 容器能够请求添加某些能力                                      | `allowedCapabilities`             |
| 控制卷类型的使用                                              | [`volumes`](#controlling-volumes) |
| 主机网络的使用                                                | [`hostNetwork`](#host-network)    |
| 主机端口的使用                                                | `hostPorts`                       |
| 主机 PID namespace 的使用                                     | `hostPID`                         |
| 主机 IPC namespace 的使用                                     | `hostIPC`                         |
| 主机路径的使用                                                | [`allowedHostPaths`](#allowed-host-paths)    |
| 容器的 SELinux 上下文                                         | [`seLinux`](#selinux)             |
| 用户 ID                                                       | [`runAsUser`](#runasuser)         |
| 配置允许的补充组                                              | [`supplementalGroups`](#supplementalgroups) |
| 分配拥有 Pod 数据卷的 FSGroup                                 | [`fsGroup`](#fsgroup)             |
| 必须使用一个只读的 root 文件系统                              | `readOnlyRootFilesystem`          |

<!--
_Pod Security Policies_ are comprised of settings and strategies that 
control the security features a pod has access to. These settings fall 
into three categories:

- *Controlled by a boolean*: Fields of this type default to the most 
restrictive value. 
- *Controlled by an allowable set*: Fields of this type are checked 
against the set to ensure their value is allowed.
- *Controlled by a strategy*: Items that have a strategy to provide
a mechanism to generate the value and a mechanism to ensure that a 
specified value falls into the set of allowable values.
-->

_Pod 安全策略_ 由设置和策略组成，它们能够控制 Pod 访问的安全特征。这些设置分为如下三类：

- *基于布尔值控制*：这种类型的字段默认为最严格限制的值。
- *基于被允许的值集合控制*：这种类型的字段会与这组值进行对比，以确认值被允许。
- *基于策略控制*：设置项通过一种策略提供的机制来生成该值，这种机制能够确保指定的值落在被允许的这组值中。

<!--
## Strategies
-->

### RunAsUser

<!--
- *MustRunAs* - Requires a `range` to be configured. Uses the first value
of the range as the default. Validates against the configured range.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
`runAsUser` or have the `USER` directive defined in the image. No default
provided.
- *RunAsAny* - No default provided. Allows any `runAsUser` to be specified.
-->

- *MustRunAs* - 必须配置一个 `range`。使用该范围内的第一个值作为默认值。验证是否不在配置的该范围内。
- *MustRunAsNonRoot* - 要求提交的 Pod 具有非零 `runAsUser` 值，或在镜像中定义了 `USER` 环境变量。不提供默认值。
- *RunAsAny* - 没有提供默认值。允许指定任何 `runAsUser` 。

<!--
### SELinux

- *MustRunAs* - Requires `seLinuxOptions` to be configured if not using
pre-allocated values. Uses `seLinuxOptions` as the default. Validates against
`seLinuxOptions`.
- *RunAsAny* - No default provided. Allows any `seLinuxOptions` to be
specified.
-->

### SELinux

- *MustRunAs* - 如果没有使用预分配的值，必须配置 `seLinuxOptions`。默认使用 `seLinuxOptions`。验证 `seLinuxOptions`。
- *RunAsAny* - 没有提供默认值。允许任意指定的 `seLinuxOptions` ID。

<!--
### SupplementalGroups

- *MustRunAs* - Requires at least one range to be specified. Uses the 
minimum value of the first range as the default. Validates against all ranges.
- *RunAsAny* - No default provided. Allows any `supplementalGroups` to be
specified.
-->

### SupplementalGroups

- *MustRunAs* - 至少需要指定一个范围。默认使用第一个范围的最小值。验证所有范围的值。
- *RunAsAny* - 没有提供默认值。允许任意指定的 `supplementalGroups` ID。

<!--
### FSGroup

- *MustRunAs* - Requires at least one range to be specified. Uses the 
minimum value of the first range as the default. Validates against the 
first ID in the first range.
- *RunAsAny* - No default provided. Allows any `fsGroup` ID to be specified.
-->

### FSGroup

- *MustRunAs* - 至少需要指定一个范围。默认使用第一个范围的最小值。验证在第一个范围内的第一个 ID。
- *RunAsAny* - 没有提供默认值。允许任意指定的 `fsGroup` ID。

<!--
### Controlling Volumes

The usage of specific volume types can be controlled by setting the 
volumes field of the PSP. The allowable values of this field correspond 
to the volume sources that are defined when creating a volume:
-->

### 控制卷

通过设置 PSP 卷字段，能够控制具体卷类型的使用。当创建一个卷的时候，与该字段相关的已定义卷可以允许设置如下值：

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
1. \* (allow all volumes)

<!--
The recommended minimum set of allowed volumes for new PSPs are 
configMap, downwardAPI, emptyDir, persistentVolumeClaim, secret, and projected.
-->

对新的 PSP，推荐允许的卷的最小集合包括：configMap、downwardAPI、emptyDir、persistentVolumeClaim、secret 和 projected。

<!--
### Host Network
 - *HostPorts*, default `empty`. List of `HostPortRange`, defined by `min`(inclusive) and `max`(inclusive), which define the allowed host ports.

### Allowed Host Paths
 - *AllowedHostPaths* is a white list of allowed host path prefixes. Empty indicates that all host paths may be used.
-->

### 主机网络
 - *HostPorts*， 默认为 `empty`。`HostPortRange` 列表通过 `min`(包含) and `max`(包含) 来定义，指定了被允许的主机端口。

### 允许的主机路径
 - *AllowedHostPaths* 是一个被允许的主机路径前缀的白名单。空值表示所有的主机路径都可以使用。

<!--
## Admission

_Admission control_ with `PodSecurityPolicy` allows for control over the
creation and modification of resources based on the capabilities allowed in the cluster.

Admission uses the following approach to create the final security context for
the pod:

1. Retrieve all PSPs available for use.
1. Generate field values for security context settings that were not specified
on the request.
1. Validate the final settings against the available policies.

If a matching policy is found, then the pod is accepted. If the
request cannot be matched to a PSP, the pod is rejected.

A pod must validate every field against the PSP.
-->

## 许可

包含 `PodSecurityPolicy` 的 _许可控制_，允许控制集群资源的创建和修改，基于这些资源在集群范围内被许可的能力。

许可使用如下的方式为 Pod 创建最终的安全上下文：
1. 检索所有可用的 PSP。
1. 生成在请求中没有指定的安全上下文设置的字段值。
1. 基于可用的策略，验证最终的设置。

如果某个策略能够匹配上，该 Pod 就被接受。如果请求与 PSP 不匹配，则 Pod 被拒绝。

Pod 必须基于 PSP 验证每个字段。

<!--
## Creating a Pod Security Policy

Here is an example Pod Security Policy. It has permissive settings for
all fields
-->

## 创建 Pod 安全策略

下面是一个 Pod 安全策略的例子，所有字段的设置都被允许：

{% include code.html language="yaml" file="psp.yaml" ghlink="/docs/concepts/policy/psp.yaml" %}

<!--
Create the policy by downloading the example file and then running this command:
-->

下载示例文件可以创建该策略，然后执行如下命令：

```shell
$ kubectl create -f ./psp.yaml
podsecuritypolicy "permissive" created
```

<!--
## Getting a list of Pod Security Policies

To get a list of existing policies, use `kubectl get`:
-->

## 获取 Pod 安全策略列表

获取已存在策略列表，使用 `kubectl get`：

```shell
$ kubectl get psp
NAME        PRIV   CAPS  SELINUX   RUNASUSER         FSGROUP   SUPGROUP  READONLYROOTFS  VOLUMES
permissive  false  []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
privileged  true   []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
restricted  false  []    RunAsAny  MustRunAsNonRoot  RunAsAny  RunAsAny  false           [emptyDir secret downwardAPI configMap persistentVolumeClaim projected]
```

<!--
## Editing a Pod Security Policy

To modify policy interactively, use `kubectl edit`:
-->

## 修改 Pod 安全策略

通过交互方式修改策略，使用 `kubectl edit`：

```shell
$ kubectl edit psp permissive
```

<!--
This command will open a default text editor where you will be able to modify policy.
-->

该命令将打开一个默认文本编辑器，在这里能够修改策略。

<!--
## Deleting a Pod Security Policy

Once you don't need a policy anymore, simply delete it with `kubectl`:
-->

## 删除 Pod 安全策略

一旦不再需要一个策略，很容易通过 `kubectl` 删除它：

```shell
$ kubectl delete psp permissive
podsecuritypolicy "permissive" deleted
```

<!--
## Enabling Pod Security Policies

In order to use Pod Security Policies in your cluster you must ensure the 
following
-->

## 启用 Pod 安全策略

为了能够在集群中使用 Pod 安全策略，必须确保如下：

<!--
1.  You have enabled the api type `extensions/v1beta1/podsecuritypolicy` (only for versions prior 1.6)
1.  You have enabled the admission controller `PodSecurityPolicy`
1.  You have defined your policies
-->

1. 启用 API 类型 `extensions/v1beta1/podsecuritypolicy`（仅对 1.6 之前的版本）
1. 启用许可控制器 `PodSecurityPolicy`
1. 定义自己的策略

<!--
## Working With RBAC

In Kubernetes 1.5 and newer, you can use PodSecurityPolicy to control access to privileged containers based on user role and groups. Access to different PodSecurityPolicy objects can be controlled via authorization. To limit access to PodSecurityPolicy objects for pods created via a Deployment, ReplicaSet, etc, the [Controller Manager](/docs/admin/kube-controller-manager/) must be run against the secured API port, and must not have superuser permissions.

PodSecurityPolicy authorization uses the union of all policies available to the user creating the pod and the service account specified on the pod. When pods are created via a Deployment, ReplicaSet, etc, it is Controller Manager that creates the pod, so if it is running against the unsecured API port, all PodSecurityPolicy objects would be allowed, and you could not effectively subdivide access. Access to given PSP policies for a user will be effective only when deploying Pods directly. For more details, see the [PodSecurityPolicy RBAC example](https://git.k8s.io/kubernetes/examples/podsecuritypolicy/rbac/README.md) of applying PodSecurityPolicy to control access to privileged containers based on role and groups when deploying Pods directly.
-->

## 使用 RBAC

在 Kubernetes 1.5 或更新版本，可以使用 PodSecurityPolicy 来控制，对基于用户角色和组的已授权容器的访问。访问不同的 PodSecurityPolicy 对象，可以基于认证来控制。基于 Deployment、ReplicaSet 等创建的 Pod，限制访问 PodSecurityPolicy 对象，[Controller Manager](/docs/admin/kube-controller-manager/) 必须基于安全 API 端口运行，并且不能够具有超级用户权限。

PodSecurityPolicy 认证使用所有可用的策略，包括创建 Pod 的用户，Pod 上指定的服务账户（service acount）。当 Pod 基于 Deployment、ReplicaSet 创建时，它是创建 Pod 的 Controller Manager，所以如果基于非安全 API 端口运行，允许所有的 PodSecurityPolicy 对象，并且不能够有效地实现细分权限。用户访问给定的 PSP 策略有效，仅当是直接部署 Pod 的情况。更多详情，查看 [PodSecurityPolicy RBAC 示例](https://git.k8s.io/kubernetes/examples/podsecuritypolicy/rbac/README.md)，当直接部署 Pod 时，应用 PodSecurityPolicy 控制基于角色和组的已授权容器的访问 。
