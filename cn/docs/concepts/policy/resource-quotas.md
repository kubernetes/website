<!--
---
assignees:
- derekwaynecarr
title: Resource Quotas
redirect_from:
- "/docs/admin/resourcequota/"
- "/docs/admin/resourcequota/index.html"
---
-->
---
assignees:
- derekwaynecarr  

title: 资源配额  
redirect_from:
- "/docs/admin/resourcequota/"
- "/docs/admin/resourcequota/index.html"
---
<!--
When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

Resource quotas are a tool for administrators to address this concern.

A resource quota, defined by a `ResourceQuota` object, provides constraints that limit
aggregate resource consumption per namespace.  It can limit the quantity of objects that can
be created in a namespace by type, as well as the total amount of compute resources that may
be consumed by resources in that project.
-->
当一个固定节点数的集群中存在多个用户或者团队时，就会产生某个团队使用的资源超出公平份额的问题。  
资源配额就是为管理员解决此问题的一个工具。  
通过`ResourceQuota`对象来定义一个资源配额，提供了对每个命名空间下限制资源消耗总数的约束条件。它可以按照类型限制一个命名空间下对象的数量，也可以按照资源消耗来限制计算资源总量。
<!--
Resource quotas work like this:

- Different teams work in different namespaces.  Currently this is voluntary, but
  support for making this mandatory via ACLs is planned.
- The administrator creates one or more Resource Quota objects for each namespace.
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a Resource Quota.
- If creating or updating a resource violates a quota constraint, the request will fail with HTTP
  status code `403 FORBIDDEN` with a message explaining the constraint that would have been violated.
- If quota is enabled in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the quota system may reject pod creation.  Hint: Use
  the LimitRange admission controller to force defaults for pods that make no compute resource requirements.
  See the [walkthrough](/docs/tasks/configure-pod-container/apply-resource-quota-limit/) for an example to avoid this problem.
-->  
资源配额工作如下：
* 不同的团队在不同的命名空间下工作。目前这是自发的，但是通过ACLs实现强制性已在计划内。
* 管理员为每个命名空间创建一个或多个资源配额。
* 用户在命名空间下创建资源对象（pods, services 等），这个配额系统跟踪使用率来确保它不会超出在资源配额中定义的限制。
* 如果在创建或者更新一个资源时违反了配额的限制，这个请求将会失败，并返回`403 FORBIDDEN`HTTP状态码，以及超出限制条件的信息。
* 如果在命名空间下开启了计算资源的配额，比如`cpu`和内存，用户必须为这些资源指定请求和限制；否则，配额系统将拒绝创建pod。提示： 可以使用`LimitRanger`准入控制组件来创建默认的资源请求。参考  [walkthrough](https://kubernetes.io/docs/tasks/administer-cluster/apply-resource-quota-limit/) 这个示例来解决此问题。

<!--
Examples of policies that could be created using namespaces and quotas are:

- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 Gib and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM.  Let the "production" namespace
  use any amount.

In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources.  This is handled on a first-come-first-served basis.

Neither contention nor changes to quota will affect already created resources.
-->
使用命名空间和配额的一些例子：
* 在一个内存总量为32G，cpu为16核的集群中，给A团队内存20G，cpu 10核，给B团队内存10G，cpu 4核心， 保留2G内存和2核cpu。
* 限制`testing`命名空间使用1G内存和1核cpu, 让`production`命名空间随意使用。

如果集群的总容量小于命名空间的配额总额，可能会产生资源竞争。这时会按照先到先得来处理。  
资源竞争和配额的更新都不会影响已经创建好的资源。  

<!--
## Enabling Resource Quota

Resource Quota support is enabled by default for many Kubernetes distributions.  It is
enabled when the apiserver `--admission-control=` flag has `ResourceQuota` as
one of its arguments.

Resource Quota is enforced in a particular namespace when there is a
`ResourceQuota` object in that namespace.  There should be at most one
`ResourceQuota` object in a namespace.
-->
#### 启用资源配额
Kubernetes 的众多发行版本默认开启了资源配额的支持。当在apiserver的`--admission-control`配置中添加`ResourceQuota`参数后，便启用了。
当一个命名空间中含有`ResourceQuota`对象时，资源配额强制执行。一个命名空间最多只能有一个`ResourceQuota`对象。

<!--
## Compute Resource Quota

You can limit the total sum of [compute resources](/docs/user-guide/compute-resources) that can be requested in a given namespace.
 
The following resource types are supported:

| Resource Name | Description |
| --------------------- | ----------------------------------------------------------- |
| `cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
-->
#### 计算资源的配额
你可以在一个给定的命名空间中限制可以请求的计算资源（[compute resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)）的总量。
支持以下的资源类型：

|资源名称  | 描述 |
| ------ | ------ |
| cpu | 非终止态的所有pod, cpu请求总量不能超出此值。
| limits.cpu | 非终止态的所有pod， cpu限制总量不能超出此值。
| limits.memory | 非终止态的所有pod, 内存限制总量不能超出此值。
| memory | 非终止态的所有pod, 内存请求总量不能超出此值。
| requests.cpu | 非终止态的所有pod, cpu请求总量不能超出此值。
| requests.memory | 非终止态的所有pod, 内存请求总量不能超出此值。

<!--
## Storage Resource Quota

You can limit the total sum of [storage resources](/docs/user-guide/persistent-volumes) that can be requested in a given namespace. 

In addition, you can limit consumption of storage resources based on associated storage-class.

| Resource Name | Description |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [persistent volume claims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the storage-class-name, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the storage-class-name, the total number of [persistent volume claims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |

For example, if an operator wants to quota storage with `gold` storage class separate from `bronze` storage class, the operator can
define a quota as follows:

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`
-->
#### 存储资源的配额
你可以在一个给定的命名空间中限制可以请求的存储资源（[storage resources](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)）的总量。
总之，你可以根据关联的存储类来限制存储资源的消耗量。

| 资源名称 | 描述 |
| ------ | ------ |
| requests.storage | 所有PVC, 存储请求总量不能超出此值。
| persistentvolumeclaims | 命名空间中可以存在的PVC（[persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)）总数。
| <storage-class-name>.storageclass.storage.k8s.io/requests.storage | 和该存储类关联的所有PVC, 存储请求总和不能超出此值。
| <storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims | 和该存储类关联的所有PVC，命名空间中可以存在的PVC（[persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)）总数。

例如，如果一个操作人员想要分别定额`gold`存储类和`bronze`存储类，则这个操作人员可以按照下面这样定义配额：
* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

<!--
## Object Count Quota

The number of objects of a given type can be restricted.  The following types
are supported:

| Resource Name | Description |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | The total number of config maps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [persistent volume claims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of replication controllers that can exist in the namespace. |
| `resourcequotas` | The total number of [resource quotas](/docs/admin/admission-controllers/#resourcequota) that can exist in the namespace. |
| `services` | The total number of services that can exist in the namespace. |
| `services.loadbalancers` | The total number of services of type load balancer that can exist in the namespace. |
| `services.nodeports` | The total number of services of type node port that can exist in the namespace. |
| `secrets` | The total number of secrets that can exist in the namespace. |

For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace.

You might want to set a pods quota on a namespace
to avoid the case where a user creates many small pods and exhausts the cluster's
supply of Pod IPs.
-->
#### 对象数量的配额
一个给定类型的对象的数量可以被限制。支持以下类型：

| 资源名称 | 描述 |
| ------ | ------ |
| congfigmaps | 命名空间中可以存在的配置映射的总数。
| persistentvolumeclaims | 命名空间中可以存在的PVC总数。
| pods | 命名空间中可以存在的非终止态的pod总数。如果一个pod的`status.phase` 是 `Failed, Succeeded`, 则该pod处于终止态。
| replicationcontrollers | 命名空间中可以存在的`rc`总数。
| resourcequotas | 命名空间中可以存在的资源配额（[resource quotas](https://kubernetes.io/docs/admin/admission-controllers/#resourcequota)）总数。
| services | 命名空间中可以存在的服务总数量。
| services.loadbalancers | 命名空间中可以存在的服务的负载均衡的总数量。 
| services.nodeports | 命名空间中可以存在的服务的主机接口的总数量。
| secrets | 命名空间中可以存在的`secrets`的总数量。

例如，pod 数量配额，则表示在单个命名空间中可以创建的pod的最大值。
你可能想要在一个命名空间中定义一个pod限额来避免一个用户创建了许多小的pod从而耗光这个集群Pod IPs 的情况。

<!--
## Quota Scopes

Each quota can have an associated set of scopes.  A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.

When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.

| Scope | Description |
| ----- | ----------- |
| `Terminating` | Match pods where `spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Match pods where `spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Match pods that have best effort quality of service. |
| `NotBestEffort` | Match pods that do not have best effort quality of service. |

The `BestEffort` scope restricts a quota to tracking the following resource: `pods`

The `Terminating`, `NotTerminating`, and `NotBestEffort` scopes restrict a quota to tracking the following resources:

* `cpu`
* `limits.cpu`
* `limits.memory`
* `memory`
* `pods`
* `requests.cpu`
* `requests.memory`
-->
#### 限额的作用域
每个配额可以有一组关联的作用域。如果一个限额匹配枚举的作用的交集，它将只衡量一个资源的利用率。
当一个作用域被添加到配额时，它将会限制它支持的涉及到该作用域的资源的数量。在不允许设置的限额上指定资源将会导致一个验证错误。

| 作用域 | 描述 |
| ------ | ------ |
| Terminating | 匹配 `spec.activeDeadlineSeconds >= 0` 的pod
| NotTerminating | 匹配 `spec.activeDeadlineSeconds is nil` 的pod
| BestEffort | 匹配具有最佳服务质量的pod
| NotBestEffort | 匹配具有非最佳服务质量的pod

`BestEffort`作用域禁止限额跟踪以下的资源：
* pods

`Terminating` 、`NotTerminating`和`NotBestEffort`作用域禁止限额跟踪以下的资源：
* cpu
* limits.cpu
* limits.memory
* memory
* pods
* requests.cpu
* requests.memory

<!--
## Requests vs Limits

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.

If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources.  If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.
-->
#### 请求 vs 限度
当分配计算资源时，每个容器可以为cpu或者内存指定一个请求值和一个限度值。可以配置限额值来限制它们中的任何一个值。  
如果指定了`requests.cpu` 或者 `requests.memory`的限额值，那么就要求传入的每一个容器显式的指定这些资源的请求。如果指定了`limits.cpu`或者`limits.memory`，那么就要求传入的每一个容器显式的指定这些资源的限度。
 
 <!--
 ## Viewing and Setting Quotas

Kubectl supports creating, updating, and viewing quotas:

```shell
$ kubectl create namespace myspace

$ cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    pods: "4"
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
EOF
$ kubectl create -f ./compute-resources.yaml --namespace=myspace

$ cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
$ kubectl create -f ./object-counts.yaml --namespace=myspace

$ kubectl get quota --namespace=myspace
NAME                    AGE
compute-resources       30s
object-counts           32s

$ kubectl describe quota compute-resources --namespace=myspace
Name:                  compute-resources
Namespace:             myspace
Resource               Used Hard
--------               ---- ----
limits.cpu             0    2
limits.memory          0    2Gi
pods                   0    4
requests.cpu           0    1
requests.memory        0    1Gi

$ kubectl describe quota object-counts --namespace=myspace
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```
 -->
#### 查看和设置配额
Kubectl 支持创建，更新和查看配额：
```
$ kubectl create namespace myspace

$ cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    pods: "4"
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
EOF
$ kubectl create -f ./compute-resources.yaml --namespace=myspace

$ cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
$ kubectl create -f ./object-counts.yaml --namespace=myspace

$ kubectl get quota --namespace=myspace
NAME                    AGE
compute-resources       30s
object-counts           32s

$ kubectl describe quota compute-resources --namespace=myspace
Name:                  compute-resources
Namespace:             myspace
Resource               Used Hard
--------               ---- ----
limits.cpu             0    2
limits.memory          0    2Gi
pods                   0    4
requests.cpu           0    1
requests.memory        0    1Gi

$ kubectl describe quota object-counts --namespace=myspace
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```
<!--
## Quota and Cluster Capacity

Resource Quota objects are independent of the Cluster Capacity. They are
expressed in absolute units.  So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.

Sometimes more complex policies may be desired, such as:

  - proportionally divide total cluster resources among several teams.
  - allow each tenant to grow resource usage as needed, but have a generous
    limit to prevent accidental resource exhaustion.
  - detect demand from one namespace, add nodes, and increase quota.

Such policies could be implemented using ResourceQuota as a building-block, by
writing a 'controller' which watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.

Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.
-->
#### 配额和集群容量
资源配额对象与集群容量无关。它们以绝对单位表示。因此，如果在集群中新增加节点，也不会给每个命名空间自动增加消耗更多资源的能力。
有时可能需要更复杂的策略，例如：
* 在几个团队之间按比例划分集群总体资源。
* 允许每个租户根据需要增加资源使用，但有一个宽松的限制来防止意外的资源枯竭。
* 从命名空间检测需求，添加节点并增加配额。
使用`ResourceQuota`作为一个构建模块，编写一个`controller`监听配额使用率和根据其它信号调整每个命名空间下的配额的硬性限制可以实现这些策略。
注意资源配额分割集群的总资源，但是它不能对节点创建限制：来自多个命名空间下的pod可以在同一个节点上运行。
<!--
## Example

See a [detailed example for how to use resource quota](/docs/tasks/configure-pod-container/apply-resource-quota-limit/).
-->
#### 范例
参考如何使用资源配额的[详细案例](https://kubernetes.io/docs/tasks/administer-cluster/apply-resource-quota-limit/)。
<!--
## Read More

See [ResourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/admission_control_resource_quota.md) for more information.
-->
#### 了解更多
参阅资[源配额设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/admission_control_resource_quota.md)来了解更多信息。
