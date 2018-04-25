---
assignees:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet
redirect_from:
- "/docs/concepts/abstractions/controllers/statefulsets/"
- "/docs/concepts/abstractions/controllers/statefulsets.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- shidrdn
---

{% capture overview %}

<!--

**StatefulSets are a beta feature in 1.7. This feature replaces the
PetSets feature from 1.4. Users of PetSets are referred to the 1.5
[Upgrade Guide](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)
for further information on how to upgrade existing PetSets to StatefulSets.**

A StatefulSet is a Controller that provides a unique identity to its Pods. It provides
guarantees about the ordering of deployment and scaling.
-->

**StatefulSet 是 1.7 版本中的 beta 功能，用来代替 1.4 版本中的 PetSet 的功能。使用 PetSet 用户可以参考 1.5 版本的 [升级参考文档](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)，获取更多关于如何将已存在的 PetSet 升级到 SetatefulSet。**

StatefulSet 作为 Controller 为 Pod 提供唯一的标识。它可以保证部署和 scale 的顺序。

{% endcapture %}

{% capture body %}

<!--

## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the
following.

* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, graceful deletion and termination.
* Ordered, automated rolling updates.

In the above, stable is synonymous with persistence across Pod (re)scheduling.
If an application doesn't require any stable identifiers or ordered deployment,
deletion, or scaling, you should deploy your application with a controller that
provides a set of stateless replicas. Controllers such as
[Deployment](/docs/concepts/workloads/controllers/deployment/) or
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) may be better suited to your stateless needs.

-->

## 使用 StatefulSet

StatefulSet 适用于有以下某个或多个需求的应用：

- 稳定，唯一的网络标志。
- 稳定，持久化存储。
- 有序，优雅地部署和 scale。
- 有序，优雅地删除和终止。
- 有序，自动的滚动升级。

在上文中，稳定是 Pod （重新）调度中持久性的代名词。 如果应用程序不需要任何稳定的标识符、有序部署、删除和 scale，则应该使用提供一组无状态副本的 controller 来部署应用程序，例如 [Deployment](/docs/concepts/workloads/controllers/deployment/) 或 [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 可能更适合您的无状态需求。

<!--


## Limitations
* StatefulSet is a beta resource, not available in any Kubernetes release prior to 1.5.
* As with all alpha/beta resources, you can disable StatefulSet through the `--runtime-config` option passed to the apiserver.
* The storage for a given Pod must either be provisioned by a [PersistentVolume Provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/README.md) based on the requested `storage class`, or pre-provisioned by an admin.
* Deleting and/or scaling a StatefulSet down will *not* delete the volumes associated with the StatefulSet. This is done to ensure data safety, which is generally more valuable than an automatic purge of all related StatefulSet resources.
* StatefulSets currently require a [Headless Service](/docs/concepts/services-networking/service/#headless-services) to be responsible for the network identity of the Pods. You are responsible for creating this Service.

-->

## 限制

- StatefulSet 是 beta 资源，Kubernetes 1.5 以前版本不支持。
- 对于所有的 alpha/beta 的资源，您都可以通过在 apiserver 中设置  `--runtime-config` 选项来禁用。
- 给定 Pod 的存储必须由 [PersistentVolume Provisioner](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/README.md) 根据请求的 `storage class` 进行配置，或由管理员预先配置。
- 删除或 scale StatefulSet 将不会删除与 StatefulSet 相关联的 volume。 这样做是为了确保数据安全性，这通常比自动清除所有相关 StatefulSet 资源更有价值。
- StatefulSets 目前要求 [Headless Service](/docs/concepts/services-networking/service/#headless-services) 负责 Pod 的网络标识。 您有责任创建此服务。

<!--

## Components
The example below demonstrates the components of a StatefulSet.

* A Headless Service, named nginx, is used to control the network domain.

* The StatefulSet, named web, has a Spec that indicates that 3 replicas of the nginx container will be launched in unique Pods.

* The volumeClaimTemplates will provide stable storage using [PersistentVolumes](/docs/concepts/storage/volumes/) provisioned by a
   PersistentVolume Provisioner.

-->

## 组件

下面的示例中描述了 StatefulSet 中的组件。

- 一个名为 nginx 的 headless service，用于控制网络域。
- 一个名为 web 的 StatefulSet，它的 Spec 中指定在有 3 副本，每个 Pod 中运行一个 nginx 容器。
- volumeClaimTemplates 使用 PersistentVolume Provisioner 提供的 [PersistentVolumes](/docs/concepts/storage/volumes/) 作为稳定存储。

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
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: gcr.io/google_containers/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
      annotations:
        volume.beta.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

<!--

## Pod Identity
StatefulSet Pods have a unique identity that is comprised of an ordinal, a
stable network identity, and stable storage. The identity sticks to the Pod,
regardless of which node it's (re)scheduled on.

### Ordinal Index

For a StatefulSet with N replicas, each Pod in the StatefulSet will be
assigned an integer ordinal, in the range [0,N), that is unique over the Set.

-->

## Pod 标识

StatefulSet Pod 具有唯一的标识，由序数、稳定的网络标识和稳定的存储组成。 标识绑定到 Pod 上，不管它（重新）调度到哪个节点上。

### 序数

对于一个有 N 个副本的 StatefulSet，每个副本都会被指定一个整数序数，在 [0,N)之间，且唯一。

<!--

### Stable Network ID

Each Pod in a StatefulSet derives its hostname from the name of the StatefulSet
and the ordinal of the Pod. The pattern for the constructed hostname
is `$(statefulset name)-$(ordinal)`. The example above will create three Pods
named `web-0,web-1,web-2`.
A StatefulSet can use a [Headless Service](/docs/concepts/services-networking/service/#headless-services)
to control the domain of its Pods. The domain managed by this Service takes the form:
`$(service name).$(namespace).svc.cluster.local`, where "cluster.local"
is the [cluster domain](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md).
As each Pod is created, it gets a matching DNS subdomain, taking the form:
`$(podname).$(governing service domain)`, where the governing service is defined
by the `serviceName` field on the StatefulSet.

Here are some examples of choices for Cluster Domain, Service name,
StatefulSet name, and how that affects the DNS names for the StatefulSet's Pods.

-->

## 稳定的网络 ID

StatefulSet 中的每个 Pod 从 StatefulSet 的名称和 Pod 的序数派生其主机名。构造的主机名的模式是`$（statefulset名称)-$(序数)`。 上面的例子将创建三个名为`web-0，web-1，web-2`的 Pod。

StatefulSet 可以使用 [Headless Service](/docs/concepts/services-networking/service/#headless-services) 来控制其 Pod 的域。此服务管理的域的格式为：`$(服务名称).$(namespace).svc.cluster.local`，其中 “cluster.local” 是 [集群域](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)。

在创建每个Pod时，它将获取一个匹配的 DNS 子域，采用以下形式：`$(pod 名称).$(管理服务域)`，其中管理服务由 StatefulSet 上的 `serviceName` 字段定义。

对于 Cluster Domain,、Service name、StatefulSet name 的选择，以及它们如何影响 StatefulSet 的 Pod 的DNS名字，下面是一个示例：

| Cluster Domain | Service (ns/name) | StatefulSet (ns/name) | StatefulSet Domain              | Pod DNS                                  | Pod Hostname |      |
| -------------- | ----------------- | --------------------- | ------------------------------- | ---------------------------------------- | ------------ | ---- |
| cluster.local  | default/nginx     | default/web           | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |      |
| cluster.local  | foo/nginx         | foo/web               | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local | web-{0..N-1} |      |
| kube.local     | foo/nginx         | foo/web               | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local    | web-{0..N-1} |      |

<!--

Note that Cluster Domain will be set to `cluster.local` unless
[otherwise configured](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md).

-->

注意 Cluster Domain 将被设置成  `cluster.local`  除非进行了 [其他配置](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)。

<!--

### Stable Storage

Kubernetes creates one [PersistentVolume](/docs/concepts/storage/volumes/) for each
VolumeClaimTemplate. In the nginx example above, each Pod will receive a single PersistentVolume
with a storage class of `anything` and 1 Gib of provisioned storage. When a Pod is (re)scheduled
onto a node, its `volumeMounts` mount the PersistentVolumes associated with its
PersistentVolume Claims. Note that, the PersistentVolumes associated with the
Pods' PersistentVolume Claims are not deleted when the Pods, or StatefulSet are deleted.
This must be done manually.

-->

### 稳定存储

Kubernetes 为每个 VolumeClaimTemplate 创建一个 [PersistentVolume](/docs/concepts/storage/volumes/)。上面的 nginx 的例子中，每个 Pod 将具有一个由 `anything` 存储类创建的 1 GB 存储的 PersistentVolume。当该 Pod （重新）调度到节点上，`volumeMounts` 将挂载与 PersistentVolume Claim 相关联的 PersistentVolume。请注意，与 PersistentVolume Claim 相关联的 PersistentVolume 在 Pod 或 StatefulSet 的时候不会被删除。这必须手动完成。

<!--

## Deployment and Scaling Guarantees

* For a StatefulSet with N replicas, when Pods are being deployed, they are created sequentially, in order from {0..N-1}.
* When Pods are being deleted, they are terminated in reverse order, from {N-1..0}.
* Before a scaling operation is applied to a Pod, all of its predecessors must be Running and Ready.
* Before a Pod is terminated, all of its successors must be completely shutdown.

The StatefulSet should not specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. This practice is unsafe and strongly discouraged. For further explanation, please refer to [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).

When the nginx example above is created, three Pods will be deployed in the order
web-0, web-1, web-2. web-1 will not be deployed before web-0 is
[Running and Ready](/docs/user-guide/pod-states), and web-2 will not be deployed until
web-1 is Running and Ready. If web-0 should fail, after web-1 is Running and Ready, but before
web-2 is launched, web-2 will not be launched until web-0 is successfully relaunched and
becomes Running and Ready.

If a user were to scale the deployed example by patching the StatefulSet such that
`replicas=1`, web-2 would be terminated first. web-1 would not be terminated until web-2
is fully shutdown and deleted. If web-0 were to fail after web-2 has been terminated and
is completely shutdown, but prior to web-1's termination, web-1 would not be terminated
until web-0 is Running and Ready.

-->

## 部署和 Scale 保证

- 对于有 N 个副本的 StatefulSet，Pod 将按照 {0..N-1} 的顺序被创建和部署。
- 当 删除 Pod 的时候，将按照逆序来终结，从{N-1..0}
- 对 Pod 执行 scale 操作之前，它所有的前任必须处于 Running 和 Ready 状态。
- 在终止 Pod 前，它所有的继任者必须处于完全关闭状态。

不应该将 StatefulSet 的 `pod.Spec.TerminationGracePeriodSeconds` 设置为 0。这样是不安全的且强烈不建议您这样做。进一步解释，请参阅 [强制删除 StatefulSet Pod](/docs/tasks/run-application/force-delete-stateful-set-pod/)。

上面的 nginx 示例创建后，3 个 Pod 将按照如下顺序创建 web-0，web-1，web-2。在 web-0 处于 [运行并就绪](/docs/user-guide/pod-states) 状态之前，web-1 将不会被部署，同样当 web-1 处于运行并就绪状态之前 web-2也不会被部署。如果在 web-1 运行并就绪后，web-2 启动之前， web-0 失败了，web-2 将不会启动，直到 web-0 成功重启并处于运行并就绪状态。

如果用户通过修补 StatefulSet 来 scale 部署的示例，以使 `replicas=1`，则 web-2 将首先被终止。 在 web-2 完全关闭和删除之前，web-1 不会被终止。 如果 web-0 在 web-2 终止并且完全关闭之后，但是在 web-1 终止之前失败，则 web-1 将不会终止，除非 web-0 正在运行并准备就绪。

<!--

### Pod Management Policies
In Kubernetes 1.7 and later, StatefulSet allows you to relax its ordering guarantees while
preserving its uniqueness and identity guarantees via its `.spec.podManagementPolicy` field.

#### OrderedReady Pod Management

`OrderedReady` pod management is the default for StatefulSets. It implements the behavior
described [above](#deployment-and-scaling-guarantees).

#### Parallel Pod Management

`Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and to not wait for Pods to become Running
and Ready or completely terminated prior to launching or terminating another
Pod.

-->

### Pod 管理策略

在 Kubernetes 1.7 和以上版本，StatefulSet 允许您放开顺序保证，同时通过 `.spec.podManagementPolicy ` 字段保证标识的唯一性。

#### OrderedReady Pod 管理

StatefulSet 中默认使用的是 `OrderedReady`  pod 管理。它实现了 [如上](#deployment-and-scaling-guarantees) 所述的行为。

#### 并行 Pod 管理

`Parallel` pod 管理告诉 StatefulSet  controller 并行的启动和终止 Pod，在启动和终止其他 Pod 之前不会等待 Pod 变成运行并就绪或完全终止状态。

<!--

## Update Strategies

In Kubernetes 1.7 and later, StatefulSet's `.spec.updateStrategy` field allows you to configure
and disable automated rolling updates for containers, labels, resource request/limits, and
annotations for the Pods in a StatefulSet.

-->

## 更新策略

在 kubernetes 1.7 和以上版本中，StatefulSet 的  `.spec.updateStrategy`  字段允许您配置和禁用 StatefulSet 中的对容器、label、resource request/limit、annotation 的自动滚动更新。

<!--

### On Delete

The `OnDelete` update strategy implements the legacy (1.6 and prior) behavior. It is the default
strategy when `spec.updateStrategy` is left unspecified. When a StatefulSet's
`.spec.updateStrategy.type` is set to `OnDelete`, the StatefulSet controller will not automatically
update the Pods in a StatefulSet. Users must manually delete Pods to cause the controller to
create new Pods that reflect modifications made to a StatefulSet's `.spec.template`.

-->

### 删除

`OnDelete` 更新策略实现了遗留（1.6和以前）的行为。 当 `spec.updateStrategy` 未指定时，这是默认策略。 当StatefulSet 的 `.spec.updateStrategy.type` 设置为 `OnDelete` 时，StatefulSet 控制器将不会自动更新 `StatefulSet` 中的 Pod。 用户必须手动删除 Pod 以使控制器创建新的 Pod，以反映对 StatefulSet 的 `.spec.template` 进行的修改。

<!--

### Rolling Updates

The `RollingUpdate` update strategy implements automated, rolling update for the Pods in a
StatefulSet. When a StatefulSet's `.spec.updateStrategy.type` is set to `RollingUpdate`, the
StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed
in the same order as Pod termination (from the largest ordinal to the smallest), updating
each Pod one at a time. It will wait until an updated Pod is Running and Ready prior to
updating its predecessor.

-->

### 滚动更新

`RollingUpdate`  更新策略在 StatefulSet 中实现 Pod 的自动滚动更新。 当 StatefulSet 的 `.spec.updateStrategy.type`  设置为  `RollingUpdate`  时，StatefulSet 控制器将在 StatefulSet 中删除并重新创建每个 Pod。 它将以与 Pod 终止相同的顺序进行（从最大的序数到最小的序数），每次更新一个 Pod。 在更新其前身之前，它将等待正在更新的 Pod 状态变成正在运行并就绪。

<!--

#### Partitions

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

#### 分区

可以通过指定  `.spec.updateStrategy.rollingUpdate.partition`  来对  `RollingUpdate`  更新策略进行分区。如果指定了分区，则当 StatefulSet 的  `.spec.template`  更新时，具有大于或等于分区序数的所有 Pod 将被更新。具有小于分区的序数的所有 Pod 将不会被更新，即使删除它们也将被重新创建。如果 StatefulSet 的 `.spec.updateStrategy.rollingUpdate.partition` 大于其  `.spec.replicas`，则其  `.spec.template` 的更新将不会传播到 Pod。

在大多数情况下，您不需要使用分区，但如果您想要进行分阶段更新，使用金丝雀发布或执行分阶段发布，它们将非常有用。

{% endcapture %}
{% capture whatsnext %}

<!--

* Follow an example of [deploying a stateful application](/docs/tutorials/stateful-application/basic-stateful-set).

-->

- 查看 [部署有状态应用](/docs/tutorials/stateful-application/basic-stateful-set) 示例

{% endcapture %}
{% include templates/concept.md %}
