---
title: 资源配额
content_type: concept
weight: 20
---

<!--
reviewers:
- derekwaynecarr
title: Resource Quotas
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

Resource quotas are a tool for administrators to address this concern.
-->
当多个用户或团队共享具有固定节点数目的集群时，人们会担心有人使用超过其基于公平原则所分配到的资源量。

资源配额是帮助管理员解决这一问题的工具。

<!-- body -->

<!--
A resource quota, defined by a `ResourceQuota` object, provides constraints that limit
aggregate resource consumption per namespace.  It can limit the quantity of objects that can
be created in a namespace by type, as well as the total amount of compute resources that may
be consumed by resources in that namespace.
-->
资源配额，通过 `ResourceQuota` 对象来定义，对每个命名空间的资源消耗总量提供限制。
它可以限制命名空间中某种类型的对象的总数目上限，也可以限制命令空间中的 Pod 可以使用的计算资源的总上限。

<!--
Resource quotas work like this:
-->
资源配额的工作方式如下：

<!--
- Different teams work in different namespaces.  Currently this is voluntary, but
  support for making this mandatory via ACLs is planned.
- The administrator creates one ResourceQuota for each namespace.
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a ResourceQuota.
- If creating or updating a resource violates a quota constraint, the request will fail with HTTP
  status code `403 FORBIDDEN` with a message explaining the constraint that would have been violated.
- If quota is enabled in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the quota system may reject pod creation.  Hint: Use
  the `LimitRanger` admission controller to force defaults for pods that make no compute resource requirements.
  See the [walkthrough](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/) for an example of how to avoid this problem.
-->
- 不同的团队可以在不同的命名空间下工作，目前这是非约束性的，在未来的版本中可能会通过
  ACL (Access Control List 访问控制列表) 来实现强制性约束。
- 集群管理员可以为每个命名空间创建一个或多个 ResourceQuota 对象。
- 当用户在命名空间下创建资源（如 Pod、Service 等）时，Kubernetes 的配额系统会
  跟踪集群的资源使用情况，以确保使用的资源用量不超过 ResourceQuota 中定义的硬性资源限额。
- 如果资源创建或者更新请求违反了配额约束，那么该请求会报错（HTTP 403 FORBIDDEN），
  并在消息中给出有可能违反的约束。
- 如果命名空间下的计算资源 （如 `cpu` 和 `memory`）的配额被启用，则用户必须为
  这些资源设定请求值（request）和约束值（limit），否则配额系统将拒绝 Pod 的创建。
  提示: 可使用 `LimitRanger` 准入控制器来为没有设置计算资源需求的 Pod 设置默认值。
  
  若想避免这类问题，请参考
  [演练](/zh/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)示例。

<!--
The name of a ResourceQuota object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
ResourceQuota 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Examples of policies that could be created using namespaces and quotas are:
-->
下面是使用命名空间和配额构建策略的示例：

<!--
- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 GiB and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM.  Let the "production" namespace
  use any amount.
-->
- 在具有 32 GiB 内存和 16 核 CPU 资源的集群中，允许 A 团队使用 20 GiB 内存 和 10 核的 CPU 资源，
  允许 B 团队使用 10 GiB 内存和 4 核的 CPU 资源，并且预留 2 GiB 内存和 2 核的 CPU 资源供将来分配。
- 限制 "testing" 命名空间使用 1 核 CPU 资源和 1GiB 内存。允许 "production" 命名空间使用任意数量。

<!--
In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources.  This is handled on a first-come-first-served basis.

Neither contention nor changes to quota will affect already created resources.
-->
在集群容量小于各命名空间配额总和的情况下，可能存在资源竞争。资源竞争时，Kubernetes 系统会遵循先到先得的原则。

不管是资源竞争还是配额的修改，都不会影响已经创建的资源使用对象。

<!--
## Enabling Resource Quota

Resource Quota support is enabled by default for many Kubernetes distributions.  It is
enabled when the API server `--enable-admission-plugins=` flag has `ResourceQuota` as
one of its arguments.
-->
## 启用资源配额

资源配额的支持在很多 Kubernetes 版本中是默认开启的。当 API 服务器的 `--enable-admission-plugins=`
参数中包含 `ResourceQuota` 时，资源配额会被启用。

<!--
A resource quota is enforced in a particular namespace when there is a
ResourceQuota in that namespace.
-->
当命名空间中存在一个 ResourceQuota 对象时，对于该命名空间而言，资源配额就是开启的。

<!--
## Compute Resource Quota

You can limit the total sum of [compute resources](/docs/concepts/configuration/manage-resources-containers/) that can be requested in a given namespace.
-->
## 计算资源配额

用户可以对给定命名空间下的可被请求的
[计算资源](/zh/docs/concepts/configuration/manage-resources-containers/)
总量进行限制。

<!--
The following resource types are supported:
-->
配额机制所支持的资源类型：

<!--
| Resource Name | Description |
| --------------------- | --------------------------------------------------------- |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `hugepages-<size>` | Across all pods in a non-terminal state, the number of huge page requests of the specified size cannot exceed this value. |
| `cpu` | Same as `requests.cpu` |
| `memory` | Same as `requests.memory` |
-->
| 资源名称 | 描述 |
| --------------------- | --------------------------------------------- |
| `limits.cpu` | 所有非终止状态的 Pod，其 CPU 限额总量不能超过该值。 |
| `limits.memory` | 所有非终止状态的 Pod，其内存限额总量不能超过该值。 |
| `requests.cpu` | 所有非终止状态的 Pod，其 CPU 需求总量不能超过该值。 |
| `requests.memory` | 所有非终止状态的 Pod，其内存需求总量不能超过该值。 |
| `hugepages-<size>` | 对于所有非终止状态的 Pod，针对指定尺寸的巨页请求总数不能超过此值。 |
| `cpu` | 与 `requests.cpu` 相同。 |
| `memory` | 与 `requests.memory` 相同。 |

<!--
### Resource Quota For Extended Resources

In addition to the resources mentioned above, in release 1.10, quota support for
[extended resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources) is added.
-->
### 扩展资源的资源配额

除上述资源外，在 Kubernetes 1.10 版本中，还添加了对
[扩展资源](/zh/docs/concepts/configuration/manage-resources-containers/#extended-resources)
的支持。

<!--
As overcommit is not allowed for extended resources, it makes no sense to specify both `requests`
and `limits` for the same extended resource in a quota. So for extended resources, only quota items
with prefix `requests.` is allowed for now.
-->
由于扩展资源不可超量分配，因此没有必要在配额中为同一扩展资源同时指定 `requests` 和 `limits`。
对于扩展资源而言，目前仅允许使用前缀为 `requests.` 的配额项。

<!--
Take the GPU resource as an example, if the resource name is `nvidia.com/gpu`, and you want to
limit the total number of GPUs requested in a namespace to 4, you can define a quota as follows:
-->
以 GPU 拓展资源为例，如果资源名称为 `nvidia.com/gpu`，并且要将命名空间中请求的 GPU
资源总数限制为 4，则可以如下定义配额：

* `requests.nvidia.com/gpu: 4`

<!--
See [Viewing and Setting Quotas](#viewing-and-setting-quotas) for more detail information.
-->
有关更多详细信息，请参阅[查看和设置配额](#viewing-and-setting-quotas)。

<!--
## Storage Resource Quota

You can limit the total sum of [storage resources](/docs/concepts/storage/persistent-volumes/) that can be requested in a given namespace.

In addition, you can limit consumption of storage resources based on associated storage-class.
-->
## 存储资源配额

用户可以对给定命名空间下的[存储资源](/zh/docs/concepts/storage/persistent-volumes/)
总量进行限制。

此外，还可以根据相关的存储类（Storage Class）来限制存储资源的消耗。

<!--
| Resource Name | Description |
| --------------------- | --------------------------------------------------------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the `<storage-class-name>`, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the storage-class-name, the total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
-->
| 资源名称 | 描述 |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | 所有 PVC，存储资源的需求总量不能超过该值。 |
| `persistentvolumeclaims` | 在该命名空间中所允许的 [PVC](/zh/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 总量。 |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | 在所有与 `<storage-class-name>` 相关的持久卷申领中，存储请求的总和不能超过该值。 |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` |  在与 storage-class-name 相关的所有持久卷申领中，命名空间中可以存在的[持久卷申领](/zh/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)总数。 |

<!--
For example, if an operator wants to quota storage with `gold` storage class separate from `bronze` storage class, the operator can
define a quota as follows:
-->
例如，如果一个操作人员针对 `gold` 存储类型与 `bronze` 存储类型设置配额，
操作人员可以定义如下配额：

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

<!--
In release 1.8, quota support for local ephemeral storage is added as an alpha feature:
-->
在 Kubernetes 1.8 版本中，本地临时存储的配额支持已经是 Alpha 功能：

<!--
| Resource Name | Description |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage requests cannot exceed this value. |
| `limits.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage limits cannot exceed this value. |
| `ephemeral-storage` | Same as `requests.ephemeral-storage`. |
-->
| 资源名称 | 描述 |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | 在命名空间的所有 Pod 中，本地临时存储请求的总和不能超过此值。 |
| `limits.ephemeral-storage` | 在命名空间的所有 Pod 中，本地临时存储限制值的总和不能超过此值。 |
| `ephemeral-storage` | 与 `requests.ephemeral-storage` 相同。 |

<!--
## Object Count Quota

You can set quota for the total number of certain resources of all standard,
namespaced resource types using the following syntax:

* `count/<resource>.<group>` for resources from non-core groups
* `count/<resource>` for resources from the core group
-->
## 对象数量配额

你可以使用以下语法对所有标准的、命名空间域的资源类型进行配额设置：

* `count/<resource>.<group>`：用于非核心（core）组的资源
* `count/<resource>`：用于核心组的资源

<!--
Here is an example set of resources users may want to put under object count quota:
-->
这是用户可能希望利用对象计数配额来管理的一组资源示例。

* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/replicationcontrollers`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`

<!--
The same syntax can be used for custom resources.
For example, to create a quota on a `widgets` custom resource in the `example.com` API group, use `count/widgets.example.com`.
-->
相同语法也可用于自定义资源。
例如，要对 `example.com` API 组中的自定义资源 `widgets` 设置配额，请使用
`count/widgets.example.com`。

<!--
When using `count/*` resource quota, an object is charged against the quota if it exists in server storage.
These types of quotas are useful to protect against exhaustion of storage resources.  For example, you may
want to limit the number of Secrets in a server given their large size. Too many Secrets in a cluster can
actually prevent servers and controllers from starting. You can set a quota for Jobs to protect against
a poorly configured CronJob. CronJobs that create too many Jobs in a namespace can lead to a denial of service.
-->
当使用 `count/*` 资源配额时，如果对象存在于服务器存储中，则会根据配额管理资源。
这些类型的配额有助于防止存储资源耗尽。例如，用户可能想根据服务器的存储能力来对服务器中
Secret 的数量进行配额限制。
集群中存在过多的 Secret 实际上会导致服务器和控制器无法启动。
用户可以选择对 Job 进行配额管理，以防止配置不当的 CronJob 在某命名空间中创建太多
Job 而导致集群拒绝服务。

<!--
It is possible to do generic object count quota on a limited set of resources.
In addition, it is possible to further constrain quota for particular resources by their type.

The following types are supported:
-->
对有限的一组资源上实施一般性的对象数量配额也是可能的。
此外，还可以进一步按资源的类型设置其配额。

支持以下类型：

<!--
| Resource Name | Description |
| ----------------------------|--------------------------------------------- |
| `configmaps` | The total number of ConfigMaps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of Pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `.status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of ReplicationControllers that can exist in the namespace. |
| `resourcequotas` | The total number of ResourceQuotas that can exist in the namespace. |
| `services` | The total number of Services that can exist in the namespace. |
| `services.loadbalancers` | The total number of Services of type `LoadBalancer` that can exist in the namespace. |
| `services.nodeports` | The total number of Services of type `NodePort` that can exist in the namespace. |
| `secrets` | The total number of Secrets that can exist in the namespace. |
-->
| 资源名称 | 描述 |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | 在该命名空间中允许存在的 ConfigMap 总数上限。 |
| `persistentvolumeclaims` | 在该命名空间中允许存在的 [PVC](/zh/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) 的总数上限。 |
| `pods` | 在该命名空间中允许存在的非终止状态的 Pod 总数上限。Pod 终止状态等价于 Pod 的 `.status.phase in (Failed, Succeeded)` 为真。 |
| `replicationcontrollers` | 在该命名空间中允许存在的 ReplicationController 总数上限。 |
| `resourcequotas` | 在该命名空间中允许存在的 ResourceQuota 总数上限。 |
| `services` | 在该命名空间中允许存在的 Service 总数上限。 |
| `services.loadbalancers` | 在该命名空间中允许存在的 LoadBalancer 类型的 Service 总数上限。 |
| `services.nodeports` | 在该命名空间中允许存在的 NodePort 类型的 Service 总数上限。 |
| `secrets` | 在该命名空间中允许存在的 Secret 总数上限。 |

<!--
For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace that are not terminal. You might want to set a `pods`
quota on a namespace to avoid the case where a user creates many small pods and
exhausts the cluster's supply of Pod IPs.
-->
例如，`pods` 配额统计某个命名空间中所创建的、非终止状态的 `Pod` 个数并确保其不超过某上限值。
用户可能希望在某命名空间中设置 `pods` 配额，以避免有用户创建很多小的 Pod，
从而耗尽集群所能提供的 Pod IP 地址。

<!--
## Quota Scopes

Each quota can have an associated set of `scopes`. A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.
-->
## 配额作用域   {#quota-scopes}

每个配额都有一组相关的 `scope`（作用域），配额只会对作用域内的资源生效。
配额机制仅统计所列举的作用域的交集中的资源用量。

<!--
When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.
-->
当一个作用域被添加到配额中后，它会对作用域相关的资源数量作限制。
如配额中指定了允许（作用域）集合之外的资源，会导致验证错误。

<!--
| Scope | Description |
| ----- | ------------ |
| `Terminating` | Match pods where `.spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Match pods where `.spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Match pods that have best effort quality of service. |
| `NotBestEffort` | Match pods that do not have best effort quality of service. |
| `PriorityClass` | Match pods that references the specified [priority class](/docs/concepts/configuration/pod-priority-preemption). |
-->
| 作用域 | 描述 |
| ----- | ----------- |
| `Terminating` | 匹配所有 `spec.activeDeadlineSeconds` 不小于 0 的 Pod。 |
| `NotTerminating` | 匹配所有 `spec.activeDeadlineSeconds` 是 nil 的 Pod。 |
| `BestEffort` | 匹配所有 Qos 是 BestEffort 的 Pod。 |
| `NotBestEffort` | 匹配所有 Qos 不是 BestEffort 的 Pod。 |
| `PriorityClass` | 匹配所有引用了所指定的[优先级类](/zh/docs/concepts/configuration/pod-priority-preemption)的 Pods。 |

<!--
The `BestEffort` scope restricts a quota to tracking the following resource:

* `pods`

The `Terminating`, `NotTerminating`, `NotBestEffort` and `PriorityClass`
scopes restrict a quota to tracking the following resources:
-->
`BestEffort` 作用域限制配额跟踪以下资源：

* `pods`

`Terminating`、`NotTerminating`、`NotBestEffort` 和 `PriorityClass` 这些作用域限制配额跟踪以下资源：

* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

<!--
Note that you cannot specify both the `Terminating` and the `NotTerminating`
scopes in the same quota, and you cannot specify both the `BestEffort` and
`NotBestEffort` scopes in the same quota either.

The `scopeSelector` supports the following values in the `operator` field:
-->
需要注意的是，你不可以在同一个配额对象中同时设置 `Terminating` 和 `NotTerminating`
作用域，你也不可以在同一个配额中同时设置 `BestEffort` 和 `NotBestEffort`
作用域。

`scopeSelector` 支持在 `operator` 字段中使用以下值：

* `In`
* `NotIn`
* `Exists`
* `DoesNotExist`

<!--
When using one of the following values as the `scopeName` when defining the
`scopeSelector`, the `operator` must be `Exists`. 
-->
定义 `scopeSelector` 时，如果使用以下值之一作为 `scopeName` 的值，则对应的
`operator` 只能是 `Exists`。

* `Terminating`
* `NotTerminating`
* `BestEffort`
* `NotBestEffort`

<!--
If the `operator` is `In` or `NotIn`, the `values` field must have at least
one value. For example:
-->
如果 `operator` 是 `In` 或 `NotIn` 之一，则 `values` 字段必须至少包含一个值。
例如：

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

<!--
If the `operator` is `Exists` or `DoesNotExist`, the `values field must *NOT* be
specified.
-->
如果 `operator` 为 `Exists` 或 `DoesNotExist`，则*不*可以设置 `values` 字段。

<!--
### Resource Quota Per PriorityClass
-->
### 基于优先级类（PriorityClass）来设置资源配额

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Pods can be created at a specific [priority](/docs/concepts/configuration/pod-priority-preemption/#pod-priority).
You can control a pod's consumption of system resources based on a pod's priority, by using the `scopeSelector`
field in the quota spec.
-->
Pod 可以创建为特定的[优先级](/zh/docs/concepts/configuration/pod-priority-preemption/#pod-priority)。
通过使用配额规约中的 `scopeSelector` 字段，用户可以根据 Pod 的优先级控制其系统资源消耗。

<!--
A quota is matched and consumed only if `scopeSelector` in the quota spec selects the pod.
-->
仅当配额规范中的 `scopeSelector` 字段选择到某 Pod 时，配额机制才会匹配和计量 Pod 的资源消耗。

<!--
When quota is scoped for priority class using `scopeSelector` field, quota object is restricted to track only following resources:
-->
如果配额对象通过 `scopeSelector` 字段设置其作用域为优先级类，则配额对象只能
跟踪以下资源：

* `pods`
* `cpu`
* `memory`
* `ephemeral-storage`
* `limits.cpu`
* `limits.memory`
* `limits.ephemeral-storage`
* `requests.cpu`
* `requests.memory`
* `requests.ephemeral-storage`

<!--
This example creates a quota object and matches it with pods at specific priorities. The example
works as follows:
-->
本示例创建一个配额对象，并将其与具有特定优先级的 Pod 进行匹配。
该示例的工作方式如下：

<!--
- Pods in the cluster have one of the three priority classes, "low", "medium", "high".
- One quota object is created for each priority.
-->
- 集群中的 Pod 可取三个优先级类之一，即 "low"、"medium"、"high"。
- 为每个优先级创建一个配额对象。

<!-- Save the following YAML to a file `quota.yml`.  -->
将以下 YAML 保存到文件 `quota.yml` 中。

```yaml
apiVersion: v1
kind: List
items:
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-high
  spec:
    hard:
      cpu: "1000"
      memory: 200Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["high"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-medium
  spec:
    hard:
      cpu: "10"
      memory: 20Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["medium"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-low
  spec:
    hard:
      cpu: "5"
      memory: 10Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["low"]
```

<!--
Apply the YAML using `kubectl create`.
-->
使用 `kubectl create` 命令运行以下操作。

```shell
kubectl create -f ./quota.yml
```

```
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

<!--
Verify that `Used` quota is `0` using `kubectl describe quota`.
-->
使用 `kubectl describe quota` 操作验证配额的 `Used` 值为 `0`。

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

<!--
Create a pod with priority "high". Save the following YAML to a
file `high-priority-pod.yml`.
-->
创建优先级为 "high" 的 Pod。
将以下 YAML 保存到文件 `high-priority-pod.yml` 中。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority
spec:
  containers:
  - name: high-priority
    image: ubuntu
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo hello; sleep 10;done"]
    resources:
      requests:
        memory: "10Gi"
        cpu: "500m"
      limits:
        memory: "10Gi"
        cpu: "500m"
  priorityClassName: high
```

<!--
Apply it with `kubectl create`.
-->
使用 `kubectl create` 运行以下操作。

```shell
kubectl create -f ./high-priority-pod.yml
```

<!--
Verify that "Used" stats for "high" priority quota, `pods-high`, has changed and that
the other two quotas are unchanged.
-->
确认 "high" 优先级配额 `pods-high` 的 "Used" 统计信息已更改，并且其他两个配额未更改。

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

<!--
## Requests vs Limits

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.
-->
## 请求与限制   {#requests-vs-limits}

分配计算资源时，每个容器可以为 CPU 或内存指定请求和约束。
配额可以针对二者之一进行设置。

<!--
If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources.  If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.
-->
如果配额中指定了 `requests.cpu` 或 `requests.memory` 的值，则它要求每个容器都显式给出对这些资源的请求。
同理，如果配额中指定了 `limits.cpu` 或 `limits.memory` 的值，那么它要求每个容器都显式设定对应资源的限制。

<!--
## Viewing and Setting Quotas

Kubectl supports creating, updating, and viewing quotas:
-->
## 查看和设置配额 {#viewing-and-setting-quotas}

Kubectl 支持创建、更新和查看配额：

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

<!--
Kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:
-->
kubectl 还使用语法 `count/<resource>.<group>` 支持所有标准的、命名空间域的资源的对象计数配额：

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.apps=2,count/replicasets.apps=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

```shell
kubectl describe quota --namespace=myspace
```

```
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.apps        1     2
count/pods                    2     3
count/replicasets.apps        1     4
count/secrets                 1     4
```

<!--
## Quota and Cluster Capacity

ResourceQuotas are independent of the cluster capacity. They are
expressed in absolute units.  So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.
-->
## 配额和集群容量   {#quota-and-cluster-capacity}

ResourceQuota 与集群资源总量是完全独立的。它们通过绝对的单位来配置。
所以，为集群添加节点时，资源配额*不会*自动赋予每个命名空间消耗更多资源的能力。

<!--
Sometimes more complex policies may be desired, such as:

- Proportionally divide total cluster resources among several teams.
- Allow each tenant to grow resource usage as needed, but have a generous
  limit to prevent accidental resource exhaustion.
- Detect demand from one namespace, add nodes, and increase quota.
-->
有时可能需要资源配额支持更复杂的策略，比如：

- 在几个团队中按比例划分总的集群资源。
- 允许每个租户根据需要增加资源使用量，但要有足够的限制以防止资源意外耗尽。
- 探测某个命名空间的需求，添加物理节点并扩大资源配额值。

<!--
Such policies could be implemented using `ResourceQuotas` as building blocks, by
writing a "controller" that watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.
-->
这些策略可以通过将资源配额作为一个组成模块、手动编写一个控制器来监控资源使用情况，
并结合其他信号调整命名空间上的硬性资源配额来实现。

<!--
Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.
-->
注意：资源配额对集群资源总体进行划分，但它对节点没有限制：来自不同命名空间的 Pod 可能在同一节点上运行。

<!--
## Limit Priority Class consumption by default

It may be desired that pods at a particular priority, eg. "cluster-services",
should be allowed in a namespace, if and only if, a matching quota object exists.
-->
## 默认情况下限制特定优先级的资源消耗

有时候可能希望当且仅当某名字空间中存在匹配的配额对象时，才可以创建特定优先级
（例如 "cluster-services"）的 Pod。

<!--
With this mechanism, operators will be able to restrict usage of certain high
priority classes to a limited number of namespaces and not every namespace
will be able to consume these priority classes by default.
-->
通过这种机制，操作人员能够将限制某些高优先级类仅出现在有限数量的命名空间中，
而并非每个命名空间默认情况下都能够使用这些优先级类。

<!--
To enforce this, kube-apiserver flag `-admission-control-config-file` should be
used to pass path to the following configuration file:
-->
要实现此目的，应设置 kube-apiserver 的标志 `--admission-control-config-file` 
指向如下配置文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

<!--
Now, "cluster-services" pods will be allowed in only those namespaces where a quota object with a matching `scopeSelector` is present.

For example:
-->
现在，仅当命名空间中存在匹配的 `scopeSelector` 的配额对象时，才允许使用 "cluster-services" Pod。

示例：

```yaml
    scopeSelector:
      matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

## {{% heading "whatsnext" %}}

<!--
- See [ResourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) for more information.
- See a [detailed example for how to use resource quota](/docs/tasks/administer-cluster/quota-api-object/).
- Read [Quota support for priority class design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md).
- See [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765)
-->
- 查看[资源配额设计文档](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md)
- 查看[如何使用资源配额的详细示例](/zh/docs/tasks/administer-cluster/quota-api-object/)。
- 阅读[优先级类配额支持的设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md)。
  了解更多信息。
- 参阅 [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765)

