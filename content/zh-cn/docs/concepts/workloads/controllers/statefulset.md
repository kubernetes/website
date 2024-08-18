---
title: StatefulSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  StatefulSet 运行一组 Pod，并为每个 Pod 保留一个稳定的标识。
  这可用于管理需要持久化存储或稳定、唯一网络标识的应用。
weight: 30
hide_summary: true # 在章节索引中单独列出
---
<!--
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSets
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  A StatefulSet runs a group of Pods, and maintains a sticky identity for each of those Pods. This is useful for managing
  applications that need persistent storage or a stable, unique network identity.
weight: 30
hide_summary: true # Listed separately in section index
-->

<!-- overview -->

<!--
StatefulSet is the workload API object used to manage stateful applications.
-->
StatefulSet 是用来管理有状态应用的工作负载 API 对象。

{{< glossary_definition term_id="statefulset" length="all" >}}

<!-- body -->

<!--
## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the
following.
-->
## 使用 StatefulSet   {#using-statefulsets}

StatefulSet 对于需要满足以下一个或多个需求的应用程序很有价值：

<!--
* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, automated rolling updates.
-->
* 稳定的、唯一的网络标识符。
* 稳定的、持久的存储。
* 有序的、优雅的部署和扩缩。
* 有序的、自动的滚动更新。

<!--
In the above, stable is synonymous with persistence across Pod (re)scheduling.
If an application doesn't require any stable identifiers or ordered deployment,
deletion, or scaling, you should deploy your application using a workload object
that provides a set of stateless replicas.
[Deployment](/docs/concepts/workloads/controllers/deployment/) or
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) may be better suited to your stateless needs.
-->
在上面描述中，“稳定的”意味着 Pod 调度或重调度的整个过程是有持久性的。
如果应用程序不需要任何稳定的标识符或有序的部署、删除或扩缩，
则应该使用由一组无状态的副本控制器提供的工作负载来部署应用程序，比如
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 或者
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
可能更适用于你的无状态应用部署需要。

<!--
## Limitations
-->
## 限制  {#limitations}

<!--
* The storage for a given Pod must either be provisioned by a
  [PersistentVolume Provisioner](/docs/concepts/storage/dynamic-provisioning/) ([examples here](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md))
  based on the requested _storage class_, or pre-provisioned by an admin.
* Deleting and/or scaling a StatefulSet down will *not* delete the volumes associated with the
  StatefulSet. This is done to ensure data safety, which is generally more valuable than an
  automatic purge of all related StatefulSet resources.
* StatefulSets currently require a [Headless Service](/docs/concepts/services-networking/service/#headless-services)
  to be responsible for the network identity of the Pods. You are responsible for creating this
  Service.
* StatefulSets do not provide any guarantees on the termination of pods when a StatefulSet is
  deleted. To achieve ordered and graceful termination of the pods in the StatefulSet, it is
  possible to scale the StatefulSet down to 0 prior to deletion.
* When using [Rolling Updates](#rolling-updates) with the default
  [Pod Management Policy](#pod-management-policies) (`OrderedReady`),
  it's possible to get into a broken state that requires
  [manual intervention to repair](#forced-rollback).
-->
* 给定 Pod 的存储必须由
  [PersistentVolume Provisioner](/zh-cn/docs/concepts/storage/dynamic-provisioning/)
  （[例子在这里](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md)）
  基于所请求的 **storage class** 来制备，或者由管理员预先制备。
* 删除或者扩缩 StatefulSet 并**不会**删除它关联的存储卷。
  这样做是为了保证数据安全，它通常比自动清除 StatefulSet 所有相关的资源更有价值。
* StatefulSet 当前需要[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)来负责 Pod
  的网络标识。你需要负责创建此服务。
* 当删除一个 StatefulSet 时，该 StatefulSet 不提供任何终止 Pod 的保证。
  为了实现 StatefulSet 中的 Pod 可以有序且体面地终止，可以在删除之前将 StatefulSet
  缩容到 0。
* 在默认 [Pod 管理策略](#pod-management-policies)(`OrderedReady`) 时使用[滚动更新](#rolling-updates)，
  可能进入需要[人工干预](#forced-rollback)才能修复的损坏状态。

<!--
## Components
The example below demonstrates the components of a StatefulSet.
-->
## 组件  {#components}

下面的示例演示了 StatefulSet 的组件。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # 必须匹配 .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # 默认值是 1
  minReadySeconds: 10 # 默认值是 0
  template:
    metadata:
      labels:
        app: nginx # 必须匹配 .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

{{< note >}}
<!--
This example uses the `ReadWriteOnce` access mode, for simplicity. For
production use, the Kubernetes project recommends using the `ReadWriteOncePod`
access mode instead.
-->
这个示例出于简化考虑使用了 `ReadWriteOnce` 访问模式。但对于生产环境，
Kubernetes 项目建议使用 `ReadWriteOncePod` 访问模式。
{{< /note >}}

<!--
In the above example:

* A Headless Service, named `nginx`, is used to control the network domain.
* The StatefulSet, named `web`, has a Spec that indicates that 3 replicas of the nginx container will be launched in unique Pods.
* The `volumeClaimTemplates` will provide stable storage using
  [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) provisioned by a
  PersistentVolume Provisioner.

The name of a StatefulSet object must be a valid
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
-->
上述例子中：

* 名为 `nginx` 的 Headless Service 用来控制网络域名。
* 名为 `web` 的 StatefulSet 有一个 Spec，它表明将在独立的 3 个 Pod 副本中启动 nginx 容器。
* `volumeClaimTemplates` 将通过 PersistentVolume 制备程序所准备的
  [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/) 来提供稳定的存储。

StatefulSet 的命名需要遵循
[DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)规范。

<!--
### Pod Selector
-->
### Pod 选择算符     {#pod-selector}

<!--
You must set the `.spec.selector` field of a StatefulSet to match the labels of its
`.spec.template.metadata.labels`. Failing to specify a matching Pod Selector will result in a
validation error during StatefulSet creation.
-->
你必须设置 StatefulSet 的 `.spec.selector` 字段，使之匹配其在
`.spec.template.metadata.labels` 中设置的标签。
未指定匹配的 Pod 选择算符将在创建 StatefulSet 期间导致验证错误。

<!--
### Volume Claim Templates

You can set the `.spec.volumeClaimTemplates` field to create a
[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
This will provide stable storage to the StatefulSet if either
-->
### 卷申领模板  {#volume-claim-templates}

你可以设置 `.spec.volumeClaimTemplates` 字段来创建
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)。
这将为 StatefulSet 提供稳定的存储，如果：

<!--
* The StorageClass specified for the volume claim is set up to use [dynamic
  provisioning](/docs/concepts/storage/dynamic-provisioning/), or
* The cluster already contains a PersistentVolume with the correct StorageClass
  and sufficient available storage space.
-->
* 为卷申领指定的 StorageClass 配置使用[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，或
* 集群已包含具有正确 StorageClass 和足够可用存储空间的 PersistentVolume。

<!--
### Minimum ready seconds
-->
### 最短就绪秒数 {#minimum-ready-seconds}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
`.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be running and ready without any of its containers crashing, for it to be considered available.
This is used to check progression of a rollout when using a [Rolling Update](#rolling-updates) strategy.
This field defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
`.spec.minReadySeconds` 是一个可选字段。
它指定新创建的 Pod 应该在没有任何容器崩溃的情况下运行并准备就绪，才能被认为是可用的。
这用于在使用[滚动更新](#rolling-updates)策略时检查滚动的进度。
该字段默认为 0（Pod 准备就绪后将被视为可用）。
要了解有关何时认为 Pod 准备就绪的更多信息，
请参阅[容器探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
## Pod Identity

StatefulSet Pods have a unique identity that consists of an ordinal, a
stable network identity, and stable storage. The identity sticks to the Pod,
regardless of which node it's (re)scheduled on.
-->
## Pod 标识   {#pod-identity}

StatefulSet Pod 具有唯一的标识，该标识包括顺序标识、稳定的网络标识和稳定的存储。
该标识和 Pod 是绑定的，与该 Pod 调度到哪个节点上无关。

<!--
### Ordinal Index

For a StatefulSet with N [replicas](#replicas), each Pod in the StatefulSet
will be assigned an integer ordinal, that is unique over the Set. By default,
pods will be assigned ordinals from 0 up through N-1. The StatefulSet controller
will also add a pod label with this index: `apps.kubernetes.io/pod-index`.
-->
### 序号索引   {#ordinal-index}

对于具有 N 个[副本](#replicas)的 StatefulSet，该 StatefulSet 中的每个 Pod 将被分配一个整数序号，
该序号在此 StatefulSet 中是唯一的。默认情况下，这些 Pod 将被赋予从 0 到 N-1 的序号。
StatefulSet 的控制器也会添加一个包含此索引的 Pod 标签：`apps.kubernetes.io/pod-index`。

<!--
### Start ordinal
-->
### 起始序号   {#start-ordinal}

{{< feature-state feature_gate_name="StatefulSetStartOrdinal" >}}

<!--
`.spec.ordinals` is an optional field that allows you to configure the integer
ordinals assigned to each Pod. It defaults to nil. Within the field, you can
configure the following options:
-->
`.spec.ordinals` 是一个可选的字段，允许你配置分配给每个 Pod 的整数序号。
该字段默认为 nil 值。在该字段内，你可以配置以下选项：

<!--
* `.spec.ordinals.start`: If the `.spec.ordinals.start` field is set, Pods will
  be assigned ordinals from `.spec.ordinals.start` up through
  `.spec.ordinals.start + .spec.replicas - 1`.
-->
* `.spec.ordinals.start`：如果 `.spec.ordinals.start` 字段被设置，则 Pod 将被分配从
  `.spec.ordinals.start` 到 `.spec.ordinals.start + .spec.replicas - 1` 的序号。

<!--
### Stable Network ID

Each Pod in a StatefulSet derives its hostname from the name of the StatefulSet
and the ordinal of the Pod. The pattern for the constructed hostname
is `$(statefulset name)-$(ordinal)`. The example above will create three Pods
named `web-0,web-1,web-2`.
A StatefulSet can use a [Headless Service](/docs/concepts/services-networking/service/#headless-services)
to control the domain of its Pods. The domain managed by this Service takes the form:
`$(service name).$(namespace).svc.cluster.local`, where "cluster.local" is the
cluster domain.
As each Pod is created, it gets a matching DNS subdomain, taking the form:
`$(podname).$(governing service domain)`, where the governing service is defined
by the `serviceName` field on the StatefulSet.
-->
### 稳定的网络 ID   {#stable-network-id}

StatefulSet 中的每个 Pod 根据 StatefulSet 的名称和 Pod 的序号派生出它的主机名。
组合主机名的格式为`$(StatefulSet 名称)-$(序号)`。
上例将会创建三个名称分别为 `web-0、web-1、web-2` 的 Pod。
StatefulSet 可以使用[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)控制它的
Pod 的网络域。管理域的这个服务的格式为：
`$(服务名称).$(名字空间).svc.cluster.local`，其中 `cluster.local` 是集群域。
一旦每个 Pod 创建成功，就会得到一个匹配的 DNS 子域，格式为：
`$(pod 名称).$(所属服务的 DNS 域名)`，其中所属服务由 StatefulSet 的 `serviceName` 域来设定。

<!--
Depending on how DNS is configured in your cluster, you may not be able to look up the DNS
name for a newly-run Pod immediately. This behavior can occur when other clients in the
cluster have already sent queries for the hostname of the Pod before it was created.
Negative caching (normal in DNS) means that the results of previous failed lookups are
remembered and reused, even after the Pod is running, for at least a few seconds.

If you need to discover Pods promptly after they are created, you have a few options:

- Query the Kubernetes API directly (for example, using a watch) rather than relying on DNS lookups.
- Decrease the time of caching in your Kubernetes DNS provider (typically this means editing the
  config map for CoreDNS, which currently caches for 30 seconds).

As mentioned in the [limitations](#limitations) section, you are responsible for
creating the [Headless Service](/docs/concepts/services-networking/service/#headless-services)
responsible for the network identity of the pods.
-->
取决于集群域内部 DNS 的配置，有可能无法查询一个刚刚启动的 Pod 的 DNS 命名。
当集群内其他客户端在 Pod 创建完成前发出 Pod 主机名查询时，就会发生这种情况。
负缓存 (在 DNS 中较为常见) 意味着之前失败的查询结果会被记录和重用至少若干秒钟，
即使 Pod 已经正常运行了也是如此。

如果需要在 Pod 被创建之后及时发现它们，可使用以下选项：

- 直接查询 Kubernetes API（比如，利用 watch 机制）而不是依赖于 DNS 查询
- 缩短 Kubernetes DNS 驱动的缓存时长（通常这意味着修改 CoreDNS 的 ConfigMap，目前缓存时长为 30 秒）

正如[限制](#limitations)中所述，
你需要负责创建[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)以便为 Pod 提供网络标识。

<!--
Here are some examples of choices for Cluster Domain, Service name,
StatefulSet name, and how that affects the DNS names for the StatefulSet's Pods.

Cluster Domain | Service (ns/name) | StatefulSet (ns/name)  | StatefulSet Domain  | Pod DNS | Pod Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

-->
下面给出一些选择集群域、服务名、StatefulSet 名、及其怎样影响 StatefulSet 的 Pod 上的 DNS 名称的示例：

集群域名       | 服务（名字空间/名字）| StatefulSet（名字空间/名字） | StatefulSet 域名 | Pod DNS | Pod 主机名   |
-------------- | -------------------- | ---------------------------- | ---------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
<!--
Cluster Domain will be set to `cluster.local` unless
[otherwise configured](/docs/concepts/services-networking/dns-pod-service/).
-->
集群域会被设置为 `cluster.local`，除非有[其他配置](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
{{< /note >}}

<!--
### Stable Storage

For each VolumeClaimTemplate entry defined in a StatefulSet, each Pod receives one
PersistentVolumeClaim. In the nginx example above, each Pod receives a single PersistentVolume
with a StorageClass of `my-storage-class` and 1 GiB of provisioned storage. If no StorageClass
is specified, then the default StorageClass will be used. When a Pod is (re)scheduled
onto a node, its `volumeMounts` mount the PersistentVolumes associated with its
PersistentVolume Claims. Note that, the PersistentVolumes associated with the
Pods' PersistentVolume Claims are not deleted when the Pods, or StatefulSet are deleted.
This must be done manually.
-->
### 稳定的存储  {#stable-storage}

对于 StatefulSet 中定义的每个 VolumeClaimTemplate，每个 Pod 接收到一个 PersistentVolumeClaim。
在上面的 nginx 示例中，每个 Pod 将会得到基于 StorageClass `my-storage-class` 制备的
1 GiB 的 PersistentVolume。如果没有指定 StorageClass，就会使用默认的 StorageClass。
当一个 Pod 被调度（重新调度）到节点上时，它的 `volumeMounts` 会挂载与其
PersistentVolumeClaims 相关联的 PersistentVolume。
请注意，当 Pod 或者 StatefulSet 被删除时，与 PersistentVolumeClaims 相关联的
PersistentVolume 并不会被删除。要删除它必须通过手动方式来完成。

<!--
### Pod Name Label

When the StatefulSet {{<glossary_tooltip text="controller" term_id="controller">}} creates a Pod,
it adds a label, `statefulset.kubernetes.io/pod-name`, that is set to the name of
the Pod. This label allows you to attach a Service to a specific Pod in
the StatefulSet.
-->
### Pod 名称标签   {#pod-name-label}

当 StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}创建 Pod 时，
它会添加一个标签 `statefulset.kubernetes.io/pod-name`，该标签值设置为 Pod 名称。
这个标签允许你给 StatefulSet 中的特定 Pod 绑定一个 Service。

<!--
### Pod index label
-->
### Pod 索引标签  {#pod-index-label}

{{< feature-state for_k8s_version="v1.28" state="beta" >}}

<!--
When the StatefulSet {{<glossary_tooltip text="controller" term_id="controller">}} creates a Pod,
the new Pod is labelled with `apps.kubernetes.io/pod-index`. The value of this label is the ordinal index of
the Pod. This label allows you to route traffic to a particular pod index, filter logs/metrics
using the pod index label, and more. Note the feature gate `PodIndexLabel` must be enabled for this
feature, and it is enabled by default.
-->
当 StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}创建一个 Pod 时，
新的 Pod 会被打上 `apps.kubernetes.io/pod-index` 标签。标签的取值为 Pod 的序号索引。
此标签使你能够将流量路由到特定索引值的 Pod、使用 Pod 索引标签来过滤日志或度量值等等。
注意要使用这一特性需要启用特性门控 `PodIndexLabel`，而该门控默认是被启用的。

<!--
## Deployment and Scaling Guarantees

* For a StatefulSet with N replicas, when Pods are being deployed, they are created sequentially, in order from {0..N-1}.
* When Pods are being deleted, they are terminated in reverse order, from {N-1..0}.
* Before a scaling operation is applied to a Pod, all of its predecessors must be Running and Ready.
* Before a Pod is terminated, all of its successors must be completely shutdown.
-->
## 部署和扩缩保证   {#deployment-and-scaling-guarantees}

* 对于包含 N 个 副本的 StatefulSet，当部署 Pod 时，它们是依次创建的，顺序为 `0..N-1`。
* 当删除 Pod 时，它们是逆序终止的，顺序为 `N-1..0`。
* 在将扩缩操作应用到 Pod 之前，它前面的所有 Pod 必须是 Running 和 Ready 状态。
* 在一个 Pod 终止之前，所有的继任者必须完全关闭。

<!--
The StatefulSet should not specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. This practice
is unsafe and strongly discouraged. For further explanation, please refer to
[force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
StatefulSet 不应将 `pod.Spec.TerminationGracePeriodSeconds` 设置为 0。
这种做法是不安全的，要强烈阻止。
更多的解释请参考[强制删除 StatefulSet Pod](/zh-cn/docs/tasks/run-application/force-delete-stateful-set-pod/)。

<!--
When the nginx example above is created, three Pods will be deployed in the order
web-0, web-1, web-2. web-1 will not be deployed before web-0 is
[Running and Ready](/docs/concepts/workloads/pods/pod-lifecycle/), and web-2 will not be deployed until
web-1 is Running and Ready. If web-0 should fail, after web-1 is Running and Ready, but before
web-2 is launched, web-2 will not be launched until web-0 is successfully relaunched and
becomes Running and Ready.
-->
在上面的 nginx 示例被创建后，会按照 web-0、web-1、web-2 的顺序部署三个 Pod。
在 web-0 进入 [Running 和 Ready](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)
状态前不会部署 web-1。在 web-1 进入 Running 和 Ready 状态前不会部署 web-2。
如果 web-1 已经处于 Running 和 Ready 状态，而 web-2 尚未部署，在此期间发生了
web-0 运行失败，那么 web-2 将不会被部署，要等到 web-0 部署完成并进入 Running 和
Ready 状态后，才会部署 web-2。

<!--
If a user were to scale the deployed example by patching the StatefulSet such that
`replicas=1`, web-2 would be terminated first. web-1 would not be terminated until web-2
is fully shutdown and deleted. If web-0 were to fail after web-2 has been terminated and
is completely shutdown, but prior to web-1's termination, web-1 would not be terminated
until web-0 is Running and Ready.
-->
如果用户想将示例中的 StatefulSet 扩缩为 `replicas=1`，首先被终止的是 web-2。
在 web-2 没有被完全停止和删除前，web-1 不会被终止。
当 web-2 已被终止和删除、web-1 尚未被终止，如果在此期间发生 web-0 运行失败，
那么就不会终止 web-1，必须等到 web-0 进入 Running 和 Ready 状态后才会终止 web-1。

<!--
### Pod Management Policies

StatefulSet allows you to relax its ordering guarantees while
preserving its uniqueness and identity guarantees via its `.spec.podManagementPolicy` field.
-->
### Pod 管理策略 {#pod-management-policies}

StatefulSet 允许你放宽其排序保证，
同时通过它的 `.spec.podManagementPolicy` 域保持其唯一性和身份保证。

<!--
#### OrderedReady Pod Management

`OrderedReady` pod management is the default for StatefulSets. It implements the behavior
described [above](#deployment-and-scaling-guarantees).
-->
#### OrderedReady Pod 管理   {#orderedready-pod-management}

`OrderedReady` Pod 管理是 StatefulSet 的默认设置。
它实现了[上面](#deployment-and-scaling-guarantees)描述的功能。

<!--
#### Parallel Pod Management

`Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and to not wait for Pods to become Running
and Ready or completely terminated prior to launching or terminating another
Pod. This option only affects the behavior for scaling operations. Updates are not
affected.
-->
#### 并行 Pod 管理   {#parallel-pod-management}

`Parallel` Pod 管理让 StatefulSet 控制器并行的启动或终止所有的 Pod，
启动或者终止其他 Pod 前，无需等待 Pod 进入 Running 和 Ready 或者完全停止状态。
这个选项只会影响扩缩操作的行为，更新则不会被影响。

<!--
## Update strategies

A StatefulSet's `.spec.updateStrategy` field allows you to configure
and disable automated rolling updates for containers, labels, resource request/limits, and
annotations for the Pods in a StatefulSet. There are two possible values:
-->
## 更新策略  {#update-strategies}

StatefulSet 的 `.spec.updateStrategy` 字段让你可以配置和禁用掉自动滚动更新 Pod
的容器、标签、资源请求或限制、以及注解。有两个允许的值：

<!--
`OnDelete`
: When a StatefulSet's `.spec.updateStrategy.type` is set to `OnDelete`,
  the StatefulSet controller will not automatically update the Pods in a
  StatefulSet. Users must manually delete Pods to cause the controller to
  create new Pods that reflect modifications made to a StatefulSet's `.spec.template`.

`RollingUpdate`
: The `RollingUpdate` update strategy implements automated, rolling updates for the Pods in a
  StatefulSet. This is the default update strategy.
-->
`OnDelete`
: 当 StatefulSet 的 `.spec.updateStrategy.type` 设置为 `OnDelete` 时，
  它的控制器将不会自动更新 StatefulSet 中的 Pod。
  用户必须手动删除 Pod 以便让控制器创建新的 Pod，以此来对 StatefulSet 的
  `.spec.template` 的变动作出反应。

`RollingUpdate`
: `RollingUpdate` 更新策略对 StatefulSet 中的 Pod 执行自动的滚动更新。这是默认的更新策略。

<!--
## Rolling Updates

When a StatefulSet's `.spec.updateStrategy.type` is set to `RollingUpdate`, the
StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed
in the same order as Pod termination (from the largest ordinal to the smallest), updating
each Pod one at a time.

The Kubernetes control plane waits until an updated Pod is Running and Ready prior
to updating its predecessor. If you have set `.spec.minReadySeconds` (see
[Minimum Ready Seconds](#minimum-ready-seconds)), the control plane additionally waits that
amount of time after the Pod turns ready, before moving on.
-->
## 滚动更新 {#rolling-updates}

当 StatefulSet 的 `.spec.updateStrategy.type` 被设置为 `RollingUpdate` 时，
StatefulSet 控制器会删除和重建 StatefulSet 中的每个 Pod。
它将按照与 Pod 终止相同的顺序（从最大序号到最小序号）进行，每次更新一个 Pod。

Kubernetes 控制平面会等到被更新的 Pod 进入 Running 和 Ready 状态，然后再更新其前身。
如果你设置了 `.spec.minReadySeconds`（查看[最短就绪秒数](#minimum-ready-seconds)），
控制平面在 Pod 就绪后会额外等待一定的时间再执行下一步。

<!--
### Partitioned rolling updates {#partitions}

The `RollingUpdate` update strategy can be partitioned, by specifying a
`.spec.updateStrategy.rollingUpdate.partition`. If a partition is specified, all Pods with an
ordinal that is greater than or equal to the partition will be updated when the StatefulSet's
`.spec.template` is updated. All Pods with an ordinal that is less than the partition will not
be updated, and, even if they are deleted, they will be recreated at the previous version. If a
StatefulSet's `.spec.updateStrategy.rollingUpdate.partition` is greater than its `.spec.replicas`,
updates to its `.spec.template` will not be propagated to its Pods.
In most cases you will not need to use a partition, but they are useful if you want to stage an
update, roll out a canary, or perform a phased roll out.
-->
### 分区滚动更新   {#partitions}

通过声明 `.spec.updateStrategy.rollingUpdate.partition` 的方式，`RollingUpdate`
更新策略可以实现分区。
如果声明了一个分区，当 StatefulSet 的 `.spec.template` 被更新时，
所有序号大于等于该分区序号的 Pod 都会被更新。
所有序号小于该分区序号的 Pod 都不会被更新，并且，即使它们被删除也会依据之前的版本进行重建。
如果 StatefulSet 的 `.spec.updateStrategy.rollingUpdate.partition` 大于它的
`.spec.replicas`，则对它的 `.spec.template` 的更新将不会传递到它的 Pod。
在大多数情况下，你不需要使用分区，但如果你希望进行阶段更新、执行金丝雀或执行分阶段上线，则这些分区会非常有用。

<!--
### Maximum unavailable Pods
-->
### 最大不可用 Pod   {#maximum-unavailable-pods}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

<!--
You can control the maximum number of Pods that can be unavailable during an update
by specifying the `.spec.updateStrategy.rollingUpdate.maxUnavailable` field.
The value can be an absolute number (for example, `5`) or a percentage of desired
Pods (for example, `10%`). Absolute number is calculated from the percentage value
by rounding it up. This field cannot be 0. The default setting is 1.
-->
你可以通过指定 `.spec.updateStrategy.rollingUpdate.maxUnavailable`
字段来控制更新期间不可用的 Pod 的最大数量。
该值可以是绝对值（例如，“5”）或者是期望 Pod 个数的百分比（例如，`10%`）。
绝对值是根据百分比值四舍五入计算的。
该字段不能为 0。默认设置为 1。

<!--
This field applies to all Pods in the range `0` to `replicas - 1`. If there is any
unavailable Pod in the range `0` to `replicas - 1`, it will be counted towards
`maxUnavailable`.
-->
该字段适用于 `0` 到 `replicas - 1` 范围内的所有 Pod。
如果在 `0` 到 `replicas - 1` 范围内存在不可用 Pod，这类 Pod 将被计入 `maxUnavailable` 值。

{{< note >}}
<!--
The `maxUnavailable` field is in Alpha stage and it is honored only by API servers
that are running with the `MaxUnavailableStatefulSet`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled.
-->
`maxUnavailable` 字段处于 Alpha 阶段，仅当 API 服务器启用了 `MaxUnavailableStatefulSet`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才起作用。
{{< /note >}}

<!--
### Forced rollback

When using [Rolling Updates](#rolling-updates) with the default
[Pod Management Policy](#pod-management-policies) (`OrderedReady`),
it's possible to get into a broken state that requires manual intervention to repair.

If you update the Pod template to a configuration that never becomes Running and
Ready (for example, due to a bad binary or application-level configuration error),
StatefulSet will stop the rollout and wait.
-->
### 强制回滚 {#forced-rollback}

在默认 [Pod 管理策略](#pod-management-policies)(`OrderedReady`) 下使用[滚动更新](#rolling-updates)，
可能进入需要人工干预才能修复的损坏状态。

如果更新后 Pod 模板配置进入无法运行或就绪的状态（例如，
由于错误的二进制文件或应用程序级配置错误），StatefulSet 将停止回滚并等待。

<!--
In this state, it's not enough to revert the Pod template to a good configuration.
Due to a [known issue](https://github.com/kubernetes/kubernetes/issues/67250),
StatefulSet will continue to wait for the broken Pod to become Ready
(which never happens) before it will attempt to revert it back to the working
configuration.

After reverting the template, you must also delete any Pods that StatefulSet had
already attempted to run with the bad configuration.
StatefulSet will then begin to recreate the Pods using the reverted template.
-->
在这种状态下，仅将 Pod 模板还原为正确的配置是不够的。
由于[已知问题](https://github.com/kubernetes/kubernetes/issues/67250)，StatefulSet
将继续等待损坏状态的 Pod 准备就绪（永远不会发生），然后再尝试将其恢复为正常工作配置。

恢复模板后，还必须删除 StatefulSet 尝试使用错误的配置来运行的 Pod。这样，
StatefulSet 才会开始使用被还原的模板来重新创建 Pod。

<!--
## PersistentVolumeClaim retention
-->
## PersistentVolumeClaim 保留  {#persistentvolumeclaim-retention}

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

<!--
The optional `.spec.persistentVolumeClaimRetentionPolicy` field controls if
and how PVCs are deleted during the lifecycle of a StatefulSet. You must enable the
`StatefulSetAutoDeletePVC` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the API server and the controller manager to use this field.
Once enabled, there are two policies you can configure for each StatefulSet:
-->
在 StatefulSet 的生命周期中，可选字段
`.spec.persistentVolumeClaimRetentionPolicy` 控制是否删除以及如何删除 PVC。
使用该字段，你必须在 API 服务器和控制器管理器启用 `StatefulSetAutoDeletePVC`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
启用后，你可以为每个 StatefulSet 配置两个策略：

<!--
`whenDeleted`
: configures the volume retention behavior that applies when the StatefulSet is deleted

`whenScaled`
: configures the volume retention behavior that applies when the replica count of
  the StatefulSet   is reduced; for example, when scaling down the set.

For each policy that you can configure, you can set the value to either `Delete` or `Retain`.
-->
`whenDeleted`
: 配置删除 StatefulSet 时应用的卷保留行为。

`whenScaled`
: 配置当 StatefulSet 的副本数减少时应用的卷保留行为；例如，缩小集合时。

对于你可以配置的每个策略，你可以将值设置为 `Delete` 或 `Retain`。

<!--
`Delete`
: The PVCs created from the StatefulSet `volumeClaimTemplate` are deleted for each Pod
  affected by the policy. With the `whenDeleted` policy all PVCs from the
  `volumeClaimTemplate` are deleted after their Pods have been deleted. With the
  `whenScaled` policy, only PVCs corresponding to Pod replicas being scaled down are
  deleted, after their Pods have been deleted.
-->
`Delete`
: 对于受策略影响的每个 Pod，基于 StatefulSet 的 `volumeClaimTemplate` 字段创建的 PVC 都会被删除。
  使用 `whenDeleted` 策略，所有来自 `volumeClaimTemplate` 的 PVC 在其 Pod 被删除后都会被删除。
  使用 `whenScaled` 策略，只有与被缩减的 Pod 副本对应的 PVC 在其 Pod 被删除后才会被删除。

<!--
`Retain` (default)
: PVCs from the `volumeClaimTemplate` are not affected when their Pod is
  deleted. This is the behavior before this new feature.
-->
`Retain`（默认）
: 来自 `volumeClaimTemplate` 的 PVC 在 Pod 被删除时不受影响。这是此新功能之前的行为。

<!--
Bear in mind that these policies **only** apply when Pods are being removed due to the
StatefulSet being deleted or scaled down. For example, if a Pod associated with a StatefulSet
fails due to node failure, and the control plane creates a replacement Pod, the StatefulSet
retains the existing PVC.  The existing volume is unaffected, and the cluster will attach it to
the node where the new Pod is about to launch.

The default for policies is `Retain`, matching the StatefulSet behavior before this new feature.

Here is an example policy.
-->
请记住，这些策略**仅**适用于由于 StatefulSet 被删除或被缩小而被删除的 Pod。
例如，如果与 StatefulSet 关联的 Pod 由于节点故障而失败，
并且控制平面创建了替换 Pod，则 StatefulSet 保留现有的 PVC。
现有卷不受影响，集群会将其附加到新 Pod 即将启动的节点上。

策略的默认值为 `Retain`，与此新功能之前的 StatefulSet 行为相匹配。

这是一个示例策略。

```yaml
apiVersion: apps/v1
kind: StatefulSet
...
spec:
  persistentVolumeClaimRetentionPolicy:
    whenDeleted: Retain
    whenScaled: Delete
...
```

<!--
The StatefulSet {{<glossary_tooltip text="controller" term_id="controller">}} adds
[owner references](/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications)
to its PVCs, which are then deleted by the {{<glossary_tooltip text="garbage collector"
term_id="garbage-collection">}} after the Pod is terminated. This enables the Pod to
cleanly unmount all volumes before the PVCs are deleted (and before the backing PV and
volume are deleted, depending on the retain policy).  When you set the `whenDeleted`
policy to `Delete`, an owner reference to the StatefulSet instance is placed on all PVCs
associated with that StatefulSet.
-->
StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}为其 PVC
添加了[属主引用](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications)，
这些 PVC 在 Pod 终止后被{{<glossary_tooltip text="垃圾回收器" term_id="garbage-collection">}}删除。
这使 Pod 能够在删除 PVC 之前（以及在删除后备 PV 和卷之前，取决于保留策略）干净地卸载所有卷。
当你设置 `whenDeleted` 删除策略，对 StatefulSet 实例的属主引用放置在与该 StatefulSet 关联的所有 PVC 上。

<!--
The `whenScaled` policy must delete PVCs only when a Pod is scaled down, and not when a
Pod is deleted for another reason. When reconciling, the StatefulSet controller compares
its desired replica count to the actual Pods present on the cluster. Any StatefulSet Pod
whose id greater than the replica count is condemned and marked for deletion. If the
`whenScaled` policy is `Delete`, the condemned Pods are first set as owners to the
associated StatefulSet template PVCs, before the Pod is deleted. This causes the PVCs
to be garbage collected after only the condemned Pods have terminated.
-->
`whenScaled` 策略必须仅在 Pod 缩减时删除 PVC，而不是在 Pod 因其他原因被删除时删除。
执行协调操作时，StatefulSet 控制器将其所需的副本数与集群上实际存在的 Pod 进行比较。
对于 StatefulSet 中的所有 Pod 而言，如果其 ID 大于副本数，则将被废弃并标记为需要删除。
如果 `whenScaled` 策略是 `Delete`，则在删除 Pod 之前，
首先将已销毁的 Pod 设置为与 StatefulSet 模板对应的 PVC 的属主。
这会导致 PVC 仅在已废弃的 Pod 终止后被垃圾收集。

<!--
This means that if the controller crashes and restarts, no Pod will be deleted before its
owner reference has been updated appropriate to the policy. If a condemned Pod is
force-deleted while the controller is down, the owner reference may or may not have been
set up, depending on when the controller crashed. It may take several reconcile loops to
update the owner references, so some condemned Pods may have set up owner references and
others may not. For this reason we recommend waiting for the controller to come back up,
which will verify owner references before terminating Pods. If that is not possible, the
operator should verify the owner references on PVCs to ensure the expected objects are
deleted when Pods are force-deleted.
-->
这意味着如果控制器崩溃并重新启动，在其属主引用更新到适合策略的 Pod 之前，不会删除任何 Pod。
如果在控制器关闭时强制删除了已废弃的 Pod，则属主引用可能已被设置，也可能未被设置，具体取决于控制器何时崩溃。
更新属主引用可能需要几个协调循环，因此一些已废弃的 Pod 可能已经被设置了属主引用，而其他可能没有。
出于这个原因，我们建议等待控制器恢复，控制器将在终止 Pod 之前验证属主引用。
如果这不可行，则操作员应验证 PVC 上的属主引用，以确保在强制删除 Pod 时删除预期的对象。

<!--
### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.

Should you manually scale a deployment, example via `kubectl scale
statefulset statefulset --replicas=X`, and then you update that StatefulSet
based on a manifest (for example: by running `kubectl apply -f
statefulset.yaml`), then applying that manifest overwrites the manual scaling
that you previously did.
-->
### 副本数 {#replicas}

`.spec.replicas` 是一个可选字段，用于指定所需 Pod 的数量。它的默认值为 1。

如果你手动扩缩已部署的负载，例如通过 `kubectl scale statefulset statefulset --replicas=X`，
然后根据清单更新 StatefulSet（例如：通过运行 `kubectl apply -f statefulset.yaml`），
那么应用该清单的操作会覆盖你之前所做的手动扩缩。

<!--
If a [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
(or any similar API for horizontal scaling) is managing scaling for a
Statefulset, don't set `.spec.replicas`. Instead, allow the Kubernetes
{{<glossary_tooltip text="control plane" term_id="control-plane" >}} to manage
the `.spec.replicas` field automatically.
-->
如果 [HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
（或任何类似的水平扩缩 API）正在管理 StatefulSet 的扩缩，
请不要设置 `.spec.replicas`。
相反，允许 Kubernetes 控制平面自动管理 `.spec.replicas` 字段。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* Find out how to use StatefulSets
  * Follow an example of [deploying a stateful application](/docs/tutorials/stateful-application/basic-stateful-set/).
  * Follow an example of [deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/).
  * Follow an example of [running a replicated stateful application](/docs/tasks/run-application/run-replicated-stateful-application/).
  * Learn how to [scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
  * Learn what's involved when you [delete a StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
  * Learn how to [configure a Pod to use a volume for storage](/docs/tasks/configure-pod-container/configure-volume-storage/).
  * Learn how to [configure a Pod to use a PersistentVolume for storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).
* `StatefulSet` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/stateful-set-v1" >}}
  object definition to understand the API for stateful sets.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how
  you can use it to manage application availability during disruptions.
-->
* 了解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 了解如何使用 StatefulSet
  * 跟随示例[部署有状态应用](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/)。
  * 跟随示例[使用 StatefulSet 部署 Cassandra](/zh-cn/docs/tutorials/stateful-application/cassandra/)。
  * 跟随示例[运行多副本的有状态应用程序](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)。
  * 了解如何[扩缩 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)。
  * 了解[删除 StatefulSet](/zh-cn/docs/tasks/run-application/delete-stateful-set/)涉及到的操作。
  * 了解如何[配置 Pod 以使用卷进行存储](/zh-cn/docs/tasks/configure-pod-container/configure-volume-storage/)。
  * 了解如何[配置 Pod 以使用 PersistentVolume 作为存储](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。
* `StatefulSet` 是 Kubernetes REST API 中的顶级资源。阅读 {{< api-reference page="workload-resources/stateful-set-v1" >}}
   对象定义理解关于该资源的 API。
* 阅读 [Pod 干扰预算（Disruption Budget）](/zh-cn/docs/concepts/workloads/pods/disruptions/)，了解如何在干扰下运行高度可用的应用。

