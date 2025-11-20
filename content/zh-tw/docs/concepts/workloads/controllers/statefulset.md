---
title: StatefulSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  StatefulSet 運行一組 Pod，併爲每個 Pod 保留一個穩定的標識。
  這可用於管理需要持久化儲存或穩定、唯一網路標識的應用。
weight: 30
hide_summary: true # 在章節索引中單獨列出
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
StatefulSet 是用來管理有狀態應用的工作負載 API 對象。

{{< glossary_definition term_id="statefulset" length="all" >}}

<!-- body -->

<!--
## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the
following.
-->
## 使用 StatefulSet   {#using-statefulsets}

StatefulSet 對於需要滿足以下一個或多個需求的應用程式很有價值。

<!--
* Stable, unique network identifiers.
* Stable, persistent storage.
* Ordered, graceful deployment and scaling.
* Ordered, automated rolling updates.
-->
* 穩定的、唯一的網路標識符。
* 穩定的、持久的儲存。
* 有序的、優雅的部署和擴縮。
* 有序的、自動的滾動更新。

<!--
In the above, stable is synonymous with persistence across Pod (re)scheduling.
If an application doesn't require any stable identifiers or ordered deployment,
deletion, or scaling, you should deploy your application using a workload object
that provides a set of stateless replicas.
[Deployment](/docs/concepts/workloads/controllers/deployment/) or
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) may be better suited to your stateless needs.
-->
在上面描述中，“穩定的”意味着 Pod 調度或重調度的整個過程是有持久性的。
如果應用程式不需要任何穩定的標識符或有序的部署、刪除或擴縮，
則應該使用由一組無狀態的副本控制器提供的工作負載來部署應用程式，比如
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 或者
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
可能更適用於你的無狀態應用部署需要。

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
* 給定 Pod 的儲存必須由
  [PersistentVolume Provisioner](/zh-cn/docs/concepts/storage/dynamic-provisioning/)
  （[例子在這裏](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md)）
  基於所請求的 **storage class** 來製備，或者由管理員預先製備。
* 刪除或者擴縮 StatefulSet 並**不會**刪除它關聯的儲存卷。
  這樣做是爲了保證資料安全，它通常比自動清除 StatefulSet 所有相關的資源更有價值。
* StatefulSet 當前需要[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)來負責 Pod
  的網路標識。你需要負責創建此服務。
* 當刪除一個 StatefulSet 時，該 StatefulSet 不提供任何終止 Pod 的保證。
  爲了實現 StatefulSet 中的 Pod 可以有序且體面地終止，可以在刪除之前將 StatefulSet
  縮容到 0。
* 在預設 [Pod 管理策略](#pod-management-policies)(`OrderedReady`) 時使用[滾動更新](#rolling-updates)，
  可能進入需要[人工干預](#forced-rollback)才能修復的損壞狀態。

<!--
## Components
The example below demonstrates the components of a StatefulSet.
-->
## 組件  {#components}

下面的示例演示了 StatefulSet 的組件。

<!--
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
      app: nginx # has to match .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # by default is 1
  minReadySeconds: 10 # by default is 0
  template:
    metadata:
      labels:
        app: nginx # has to match .spec.selector.matchLabels
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
-->
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
      app: nginx # 必須匹配 .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # 默認值是 1
  minReadySeconds: 10 # 默認值是 0
  template:
    metadata:
      labels:
        app: nginx # 必須匹配 .spec.selector.matchLabels
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
這個示例出於簡化考慮使用了 `ReadWriteOnce` 訪問模式。但對於生產環境，
Kubernetes 項目建議使用 `ReadWriteOncePod` 訪問模式。
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

* 名爲 `nginx` 的 Headless Service 用來控制網路域名。
* 名爲 `web` 的 StatefulSet 有一個 Spec，它表明將在獨立的 3 個 Pod 副本中啓動 nginx 容器。
* `volumeClaimTemplates` 將通過 PersistentVolume 製備程式所準備的
  [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/) 來提供穩定的儲存。

StatefulSet 的命名需要遵循
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)規範。

<!--
### Pod Selector
-->
### Pod 選擇算符     {#pod-selector}

<!--
You must set the `.spec.selector` field of a StatefulSet to match the labels of its
`.spec.template.metadata.labels`. Failing to specify a matching Pod Selector will result in a
validation error during StatefulSet creation.
-->
你必須設置 StatefulSet 的 `.spec.selector` 字段，使之匹配其在
`.spec.template.metadata.labels` 中設置的標籤。
未指定匹配的 Pod 選擇算符將在創建 StatefulSet 期間導致驗證錯誤。

<!--
### Volume Claim Templates

You can set the `.spec.volumeClaimTemplates` field to create a
[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
This will provide stable storage to the StatefulSet if either
-->
### 卷申領模板  {#volume-claim-templates}

你可以設置 `.spec.volumeClaimTemplates` 字段來創建
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)。
這將爲 StatefulSet 提供穩定的儲存，如果：

<!--
* The StorageClass specified for the volume claim is set up to use [dynamic
  provisioning](/docs/concepts/storage/dynamic-provisioning/), or
* The cluster already contains a PersistentVolume with the correct StorageClass
  and sufficient available storage space.
-->
* 爲卷申領指定的 StorageClass 設定使用[動態製備](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，或
* 叢集已包含具有正確 StorageClass 和足夠可用儲存空間的 PersistentVolume。

<!--
### Minimum ready seconds
-->
### 最短就緒秒數 {#minimum-ready-seconds}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
`.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be running and ready without any of its containers crashing, for it to be considered available.
This is used to check progression of a rollout when using a [Rolling Update](#rolling-updates) strategy.
This field defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
`.spec.minReadySeconds` 是一個可選字段。
它指定新創建的 Pod 應該在沒有任何容器崩潰的情況下運行並準備就緒，才能被認爲是可用的。
這用於在使用[滾動更新](#rolling-updates)策略時檢查滾動的進度。
該字段預設爲 0（Pod 準備就緒後將被視爲可用）。
要了解有關何時認爲 Pod 準備就緒的更多資訊，
請參閱[容器探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
## Pod Identity

StatefulSet Pods have a unique identity that consists of an ordinal, a
stable network identity, and stable storage. The identity sticks to the Pod,
regardless of which node it's (re)scheduled on.
-->
## Pod 標識   {#pod-identity}

StatefulSet Pod 具有唯一的標識，該標識包括順序標識、穩定的網路標識和穩定的儲存。
該標識和 Pod 是綁定的，與該 Pod 調度到哪個節點上無關。

<!--
### Ordinal Index

For a StatefulSet with N [replicas](#replicas), each Pod in the StatefulSet
will be assigned an integer ordinal, that is unique over the Set. By default,
pods will be assigned ordinals from 0 up through N-1. The StatefulSet controller
will also add a pod label with this index: `apps.kubernetes.io/pod-index`.
-->
### 序號索引   {#ordinal-index}

對於具有 N 個[副本](#replicas)的 StatefulSet，該 StatefulSet 中的每個 Pod 將被分配一個整數序號，
該序號在此 StatefulSet 中是唯一的。預設情況下，這些 Pod 將被賦予從 0 到 N-1 的序號。
StatefulSet 的控制器也會添加一個包含此索引的 Pod 標籤：`apps.kubernetes.io/pod-index`。

<!--
### Start ordinal
-->
### 起始序號   {#start-ordinal}

{{< feature-state feature_gate_name="StatefulSetStartOrdinal" >}}

<!--
`.spec.ordinals` is an optional field that allows you to configure the integer
ordinals assigned to each Pod. It defaults to nil. Within the field, you can
configure the following options:
-->
`.spec.ordinals` 是一個可選的字段，允許你設定分配給每個 Pod 的整數序號。
該字段預設爲 nil 值。在該字段內，你可以設定以下選項：

<!--
* `.spec.ordinals.start`: If the `.spec.ordinals.start` field is set, Pods will
  be assigned ordinals from `.spec.ordinals.start` up through
  `.spec.ordinals.start + .spec.replicas - 1`.
-->
* `.spec.ordinals.start`：如果 `.spec.ordinals.start` 字段被設置，則 Pod 將被分配從
  `.spec.ordinals.start` 到 `.spec.ordinals.start + .spec.replicas - 1` 的序號。

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
### 穩定的網路 ID   {#stable-network-id}

StatefulSet 中的每個 Pod 根據 StatefulSet 的名稱和 Pod 的序號派生出它的主機名。
組合主機名的格式爲`$(StatefulSet 名稱)-$(序號)`。
上例將會創建三個名稱分別爲 `web-0、web-1、web-2` 的 Pod。
StatefulSet 可以使用[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)控制它的
Pod 的網路域。管理域的這個服務的格式爲：
`$(服務名稱).$(名字空間).svc.cluster.local`，其中 `cluster.local` 是叢集域。
一旦每個 Pod 創建成功，就會得到一個匹配的 DNS 子域，格式爲：
`$(pod 名稱).$(所屬服務的 DNS 域名)`，其中所屬服務由 StatefulSet 的 `serviceName` 域來設定。

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
取決於叢集域內部 DNS 的設定，有可能無法查詢一個剛剛啓動的 Pod 的 DNS 命名。
當叢集內其他客戶端在 Pod 創建完成前發出 Pod 主機名查詢時，就會發生這種情況。
負緩存 (在 DNS 中較爲常見) 意味着之前失敗的查詢結果會被記錄和重用至少若干秒鐘，
即使 Pod 已經正常運行了也是如此。

如果需要在 Pod 被創建之後及時發現它們，可使用以下選項：

- 直接查詢 Kubernetes API（比如，利用 watch 機制）而不是依賴於 DNS 查詢
- 縮短 Kubernetes DNS 驅動的緩存時長（通常這意味着修改 CoreDNS 的 ConfigMap，目前緩存時長爲 30 秒）

正如[限制](#limitations)中所述，
你需要負責創建[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)以便爲 Pod 提供網路標識。

<!--
Here are some examples of choices for Cluster Domain, Service name,
StatefulSet name, and how that affects the DNS names for the StatefulSet's Pods.

Cluster Domain | Service (ns/name) | StatefulSet (ns/name)  | StatefulSet Domain  | Pod DNS | Pod Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

-->
下面給出一些選擇叢集域、服務名、StatefulSet 名、及其怎樣影響 StatefulSet 的 Pod 上的 DNS 名稱的示例：

叢集域名       | 服務（名字空間/名字）| StatefulSet（名字空間/名字） | StatefulSet 域名 | Pod DNS | Pod 主機名   |
-------------- | -------------------- | ---------------------------- | ---------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
<!--
Cluster Domain will be set to `cluster.local` unless
[otherwise configured](/docs/concepts/services-networking/dns-pod-service/).
-->
叢集域會被設置爲 `cluster.local`，除非有[其他設定](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
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
### 穩定的儲存  {#stable-storage}

對於 StatefulSet 中定義的每個 VolumeClaimTemplate，每個 Pod 接收到一個 PersistentVolumeClaim。
在上面的 nginx 示例中，每個 Pod 將會得到基於 StorageClass `my-storage-class` 製備的
1 GiB 的 PersistentVolume。如果沒有指定 StorageClass，就會使用預設的 StorageClass。
當一個 Pod 被調度（重新調度）到節點上時，它的 `volumeMounts` 會掛載與其
PersistentVolumeClaims 相關聯的 PersistentVolume。
請注意，當 Pod 或者 StatefulSet 被刪除時，與 PersistentVolumeClaims 相關聯的
PersistentVolume 並不會被刪除。要刪除它必須通過手動方式來完成。

<!--
### Pod Name Label

When the StatefulSet {{<glossary_tooltip text="controller" term_id="controller">}} creates a Pod,
it adds a label, `statefulset.kubernetes.io/pod-name`, that is set to the name of
the Pod. This label allows you to attach a Service to a specific Pod in
the StatefulSet.
-->
### Pod 名稱標籤   {#pod-name-label}

當 StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}創建 Pod 時，
它會添加一個標籤 `statefulset.kubernetes.io/pod-name`，該標籤值設置爲 Pod 名稱。
這個標籤允許你給 StatefulSet 中的特定 Pod 綁定一個 Service。

<!--
### Pod index label
-->
### Pod 索引標籤  {#pod-index-label}

{{< feature-state feature_gate_name="PodIndexLabel" >}}

<!--
When the StatefulSet {{<glossary_tooltip text="controller" term_id="controller">}} creates a Pod,
the new Pod is labelled with `apps.kubernetes.io/pod-index`. The value of this label is the ordinal index of
the Pod. This label allows you to route traffic to a particular pod index, filter logs/metrics
using the pod index label, and more. Note the feature gate `PodIndexLabel` is enabled and locked by default for this
feature, in order to disable it, users will have to use server emulated version v1.31.
-->
當 StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}創建一個 Pod 時，
新的 Pod 會被打上 `apps.kubernetes.io/pod-index` 標籤。標籤的取值爲 Pod 的序號索引。
此標籤使你能夠將流量路由到特定索引值的 Pod、使用 Pod 索引標籤來過濾日誌或度量值等等。
請注意，預設情況下，特性門 `PodIndexLabel` 已啓用並鎖定。要禁用它，
使用者需要使用伺服器模擬版本 v1.31。

<!--
## Deployment and Scaling Guarantees

* For a StatefulSet with N replicas, when Pods are being deployed, they are created sequentially, in order from {0..N-1}.
* When Pods are being deleted, they are terminated in reverse order, from {N-1..0}.
* Before a scaling operation is applied to a Pod, all of its predecessors must be Running and Ready.
* Before a Pod is terminated, all of its successors must be completely shutdown.
-->
## 部署和擴縮保證   {#deployment-and-scaling-guarantees}

* 對於包含 N 個 副本的 StatefulSet，當部署 Pod 時，它們是依次創建的，順序爲 {0..N-1}。
* 當刪除 Pod 時，它們是逆序終止的，順序爲 {N-1..0}。
* 在將擴縮操作應用到 Pod 之前，它前面的所有 Pod 必須是 Running 和 Ready 狀態。
* 在一個 Pod 終止之前，所有的繼任者必須完全關閉。

<!--
The StatefulSet should not specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. This practice
is unsafe and strongly discouraged. For further explanation, please refer to
[force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
StatefulSet 不應將 `pod.Spec.TerminationGracePeriodSeconds` 設置爲 0。
這種做法是不安全的，要強烈阻止。
更多的解釋請參考[強制刪除 StatefulSet Pod](/zh-cn/docs/tasks/run-application/force-delete-stateful-set-pod/)。

<!--
When the nginx example above is created, three Pods will be deployed in the order
web-0, web-1, web-2. web-1 will not be deployed before web-0 is
[Running and Ready](/docs/concepts/workloads/pods/pod-lifecycle/), and web-2 will not be deployed until
web-1 is Running and Ready. If web-0 should fail, after web-1 is Running and Ready, but before
web-2 is launched, web-2 will not be launched until web-0 is successfully relaunched and
becomes Running and Ready.
-->
在上面的 nginx 示例被創建後，會按照 web-0、web-1、web-2 的順序部署三個 Pod。
在 web-0 進入 [Running 和 Ready](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)
狀態前不會部署 web-1。在 web-1 進入 Running 和 Ready 狀態前不會部署 web-2。
如果 web-1 已經處於 Running 和 Ready 狀態，而 web-2 尚未部署，在此期間發生了
web-0 運行失敗，那麼 web-2 將不會被部署，要等到 web-0 部署完成並進入 Running 和
Ready 狀態後，纔會部署 web-2。

<!--
If a user were to scale the deployed example by patching the StatefulSet such that
`replicas=1`, web-2 would be terminated first. web-1 would not be terminated until web-2
is fully shutdown and deleted. If web-0 were to fail after web-2 has been terminated and
is completely shutdown, but prior to web-1's termination, web-1 would not be terminated
until web-0 is Running and Ready.
-->
如果使用者想將示例中的 StatefulSet 擴縮爲 `replicas=1`，首先被終止的是 web-2。
在 web-2 沒有被完全停止和刪除前，web-1 不會被終止。
當 web-2 已被終止和刪除、web-1 尚未被終止，如果在此期間發生 web-0 運行失敗，
那麼就不會終止 web-1，必須等到 web-0 進入 Running 和 Ready 狀態後纔會終止 web-1。

<!--
### Pod Management Policies

StatefulSet allows you to relax its ordering guarantees while
preserving its uniqueness and identity guarantees via its `.spec.podManagementPolicy` field.
-->
### Pod 管理策略 {#pod-management-policies}

StatefulSet 允許你放寬其排序保證，
同時通過它的 `.spec.podManagementPolicy` 域保持其唯一性和身份保證。

<!--
#### OrderedReady Pod Management

`OrderedReady` pod management is the default for StatefulSets. It implements the behavior
described [above](#deployment-and-scaling-guarantees).
-->
#### OrderedReady Pod 管理   {#orderedready-pod-management}

`OrderedReady` Pod 管理是 StatefulSet 的預設設置。
它實現了[上面](#deployment-and-scaling-guarantees)描述的功能。

<!--
#### Parallel Pod Management

`Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and to not wait for Pods to become Running
and Ready or completely terminated prior to launching or terminating another
Pod. This option only affects the behavior for scaling operations. Updates are not
affected.
-->
#### 並行 Pod 管理   {#parallel-pod-management}

`Parallel` Pod 管理讓 StatefulSet 控制器並行的啓動或終止所有的 Pod，
啓動或者終止其他 Pod 前，無需等待 Pod 進入 Running 和 Ready 或者完全停止狀態。
這個選項只會影響擴縮操作的行爲，更新則不會被影響。

<!--
## Update strategies

A StatefulSet's `.spec.updateStrategy` field allows you to configure
and disable automated rolling updates for containers, labels, resource request/limits, and
annotations for the Pods in a StatefulSet. There are two possible values:
-->
## 更新策略  {#update-strategies}

StatefulSet 的 `.spec.updateStrategy` 字段讓你可以設定和禁用掉自動滾動更新 Pod
的容器、標籤、資源請求或限制、以及註解。有兩個允許的值：

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
: 當 StatefulSet 的 `.spec.updateStrategy.type` 設置爲 `OnDelete` 時，
  它的控制器將不會自動更新 StatefulSet 中的 Pod。
  使用者必須手動刪除 Pod 以便讓控制器創建新的 Pod，以此來對 StatefulSet 的
  `.spec.template` 的變動作出反應。

`RollingUpdate`
: `RollingUpdate` 更新策略對 StatefulSet 中的 Pod 執行自動的滾動更新。這是預設的更新策略。

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
## 滾動更新 {#rolling-updates}

當 StatefulSet 的 `.spec.updateStrategy.type` 被設置爲 `RollingUpdate` 時，
StatefulSet 控制器會刪除和重建 StatefulSet 中的每個 Pod。
它將按照與 Pod 終止相同的順序（從最大序號到最小序號）進行，每次更新一個 Pod。

Kubernetes 控制平面會等到被更新的 Pod 進入 Running 和 Ready 狀態，然後再更新其前身。
如果你設置了 `.spec.minReadySeconds`（查看[最短就緒秒數](#minimum-ready-seconds)），
控制平面在 Pod 就緒後會額外等待一定的時間再執行下一步。

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
### 分區滾動更新   {#partitions}

通過聲明 `.spec.updateStrategy.rollingUpdate.partition` 的方式，`RollingUpdate`
更新策略可以實現分區。
如果聲明瞭一個分區，當 StatefulSet 的 `.spec.template` 被更新時，
所有序號大於等於該分區序號的 Pod 都會被更新。
所有序號小於該分區序號的 Pod 都不會被更新，並且，即使它們被刪除也會依據之前的版本進行重建。
如果 StatefulSet 的 `.spec.updateStrategy.rollingUpdate.partition` 大於它的
`.spec.replicas`，則對它的 `.spec.template` 的更新將不會傳遞到它的 Pod。
在大多數情況下，你不需要使用分區，但如果你希望進行階段更新、執行金絲雀或執行分階段上線，則這些分區會非常有用。

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
你可以通過指定 `.spec.updateStrategy.rollingUpdate.maxUnavailable`
字段來控制更新期間不可用的 Pod 的最大數量。
該值可以是絕對值（例如，`"5"`）或者是期望 Pod 個數的百分比（例如，`"10%"`）。
絕對值是根據百分比值四捨五入計算的。
該字段不能爲 0。預設設置爲 1。

<!--
This field applies to all Pods in the range `0` to `replicas - 1`. If there is any
unavailable Pod in the range `0` to `replicas - 1`, it will be counted towards
`maxUnavailable`.
-->
該字段適用於 `0` 到 `replicas - 1` 範圍內的所有 Pod。
如果在 `0` 到 `replicas - 1` 範圍內存在不可用 Pod，這類 Pod 將被計入 `maxUnavailable` 值。

{{< note >}}
<!--
The `maxUnavailable` field is in Alpha stage and it is honored only by API servers
that are running with the `MaxUnavailableStatefulSet`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled.
-->
`maxUnavailable` 字段處於 Alpha 階段，僅當 API 伺服器啓用了 `MaxUnavailableStatefulSet`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)時才起作用。
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
### 強制回滾 {#forced-rollback}

在預設 [Pod 管理策略](#pod-management-policies)(`OrderedReady`) 下使用[滾動更新](#rolling-updates)，
可能進入需要人工干預才能修復的損壞狀態。

如果更新後 Pod 模板設定進入無法運行或就緒的狀態（例如，
由於錯誤的二進制檔案或應用程式級設定錯誤），StatefulSet 將停止回滾並等待。

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
在這種狀態下，僅將 Pod 模板還原爲正確的設定是不夠的。
由於[已知問題](https://github.com/kubernetes/kubernetes/issues/67250)，StatefulSet
將繼續等待損壞狀態的 Pod 準備就緒（永遠不會發生），然後再嘗試將其恢復爲正常工作設定。

恢復模板後，還必須刪除 StatefulSet 嘗試使用錯誤的設定來運行的 Pod。這樣，
StatefulSet 纔會開始使用被還原的模板來重新創建 Pod。

<!--
## Revision history

ControllerRevision is a Kubernetes API resource used by controllers, such as the StatefulSet controller, to track historical configuration changes. 

StatefulSets use ControllerRevisions to maintain a revision history, enabling rollbacks and version tracking.
-->
## 修訂版本歷史  {#revision-history}

ControllerRevision 是 Kubernetes 的一種 API 資源，由控制器（例如 StatefulSet 控制器）使用，用於跟蹤設定變更歷史。

StatefulSet 使用 ControllerRevision 來維護修訂版本歷史，從而支持回滾和版本跟蹤。

<!--
### How StatefulSets track changes using ControllerRevisions

When you update a StatefulSet's Pod template (`spec.template`), the StatefulSet controller:

1. Prepares a new ControllerRevision object
2. Stores a snapshot of the Pod template and metadata
3. Assigns an incremental revision number
-->
### StatefulSet 如何通過 ControllerRevision 跟蹤變更

當你更新 StatefulSet 的 Pod 模板 (`spec.template`) 時，StatefulSet 控制器：

1. 準備新的 ControllerRevision 對象
2. 儲存 Pod 模板和元資料的快照
3. 分配一個遞增的修訂版本號

<!--
#### Key Properties

ControllerRevision key properties and other details can be checked [here](/docs/reference/kubernetes-api/workload-resources/controller-revision-v1/)
-->
#### 關鍵屬性

ControllerRevision 的關鍵屬性和其他細節，
請查閱[這裏](/zh-cn/docs/reference/kubernetes-api/workload-resources/controller-revision-v1/)。

---

<!--
### Managing Revision History

Control retained revisions with `.spec.revisionHistoryLimit`:
-->
### 管理修訂版本歷史

通過 `.spec.revisionHistoryLimit` 控制保留的修訂版本：

<!--
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  revisionHistoryLimit: 5  # Keep last 5 revisions
  # ... other spec fields ...
```
-->
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  revisionHistoryLimit: 5  # 保留最近 5 個修訂版本
  # ... 其他 spec 字段 ...
```

<!--
- **Default**: 10 revisions retained if unspecified
- **Cleanup**: Oldest revisions are garbage-collected when exceeding the limit

#### Performing Rollbacks

You can revert to a previous configuration using:
-->
- **預設**：如果未指定，保留 10 個修訂版本
- **清理**：超過限制時，最早的修訂版本會被垃圾回收

#### 執行回滾

你可以通過以下方式恢復到前一個設定：

<!--
```bash
# View revision history
kubectl rollout history statefulset/webapp

# Rollback to a specific revision
kubectl rollout undo statefulset/webapp --to-revision=3
```
-->
```bash
# 查看修訂版本歷史
kubectl rollout history statefulset/webapp

# 回滾到特定的修訂版本
kubectl rollout undo statefulset/webapp --to-revision=3
```

<!--
This will:

- Apply the Pod template from revision 3
- Create a new ControllerRevision with an updated revision number

#### Inspecting ControllerRevisions

To view associated ControllerRevisions:
-->
這將會：

- 應用來自修訂版本 3 的 Pod 模板
- 使用更新的修訂版本號創建新的 ControllerRevision

#### 檢查 ControllerRevision

查看關聯的 ControllerRevision：

<!--
```bash
# List all revisions for the StatefulSet
kubectl get controllerrevisions -l app.kubernetes.io/name=webapp

# View detailed configuration of a specific revision
kubectl get controllerrevision/webapp-3 -o yaml
```
-->
```bash
# 列出 StatefulSet 的所有修訂版本
kubectl get controllerrevisions -l app.kubernetes.io/name=webapp

# 查看特定修訂版本的詳細配置
kubectl get controllerrevision/webapp-3 -o yaml
```

<!--
#### Best Practices

##### Retention Policy

- Set `revisionHistoryLimit` between **5–10** for most workloads
- Increase only if **deep rollback history** is required
-->
#### 最佳實踐

##### 保留策略

- 對大多數工作負載，將 `revisionHistoryLimit` 設置爲 **5–10**

- 僅在需要**深度回滾歷史**時才增加

<!--
##### Monitoring

- Regularly check revisions with:
-->
##### 監控

- 定期檢查修訂版本：

  ```bash
  kubectl get controllerrevisions
  ```

<!--
- Alert on **rapid revision count growth**

##### Avoid

- Manual edits to ControllerRevision objects.
- Using revisions as a backup mechanism (use actual backup tools).
- Setting `revisionHistoryLimit: 0` (disables rollback capability).
-->
- 針對**修訂版本數量快速增長**發出告警

##### 避免

- 手動編輯 ControllerRevision 對象。
- 將修訂版本用作備份機制（使用實際的備份工具）。
- 設置 revisionHistoryLimit: 0（禁用回滾功能）。

<!--
## PersistentVolumeClaim retention
-->
## PersistentVolumeClaim 保留  {#persistentvolumeclaim-retention}

{{< feature-state feature_gate_name="StatefulSetAutoDeletePVC" >}}

<!--
The optional `.spec.persistentVolumeClaimRetentionPolicy` field controls if
and how PVCs are deleted during the lifecycle of a StatefulSet. You must enable the
`StatefulSetAutoDeletePVC` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the API server and the controller manager to use this field.
Once enabled, there are two policies you can configure for each StatefulSet:
-->
在 StatefulSet 的生命週期中，可選字段
`.spec.persistentVolumeClaimRetentionPolicy` 控制是否刪除以及如何刪除 PVC。
使用該字段，你必須在 API 伺服器和控制器管理器啓用 `StatefulSetAutoDeletePVC`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
啓用後，你可以爲每個 StatefulSet 設定兩個策略：

<!--
`whenDeleted`
: configures the volume retention behavior that applies when the StatefulSet is deleted

`whenScaled`
: configures the volume retention behavior that applies when the replica count of
  the StatefulSet   is reduced; for example, when scaling down the set.

For each policy that you can configure, you can set the value to either `Delete` or `Retain`.
-->
`whenDeleted`
: 設定刪除 StatefulSet 時應用的卷保留行爲。

`whenScaled`
: 設定當 StatefulSet 的副本數減少時應用的卷保留行爲；例如，縮小集合時。

對於你可以設定的每個策略，你可以將值設置爲 `Delete` 或 `Retain`。

<!--
`Delete`
: The PVCs created from the StatefulSet `volumeClaimTemplate` are deleted for each Pod
  affected by the policy. With the `whenDeleted` policy all PVCs from the
  `volumeClaimTemplate` are deleted after their Pods have been deleted. With the
  `whenScaled` policy, only PVCs corresponding to Pod replicas being scaled down are
  deleted, after their Pods have been deleted.
-->
`Delete`
: 對於受策略影響的每個 Pod，基於 StatefulSet 的 `volumeClaimTemplate` 字段創建的 PVC 都會被刪除。
  使用 `whenDeleted` 策略，所有來自 `volumeClaimTemplate` 的 PVC 在其 Pod 被刪除後都會被刪除。
  使用 `whenScaled` 策略，只有與被縮減的 Pod 副本對應的 PVC 在其 Pod 被刪除後纔會被刪除。

<!--
`Retain` (default)
: PVCs from the `volumeClaimTemplate` are not affected when their Pod is
  deleted. This is the behavior before this new feature.
-->
`Retain`（預設）
: 來自 `volumeClaimTemplate` 的 PVC 在 Pod 被刪除時不受影響。這是此新功能之前的行爲。

<!--
Bear in mind that these policies **only** apply when Pods are being removed due to the
StatefulSet being deleted or scaled down. For example, if a Pod associated with a StatefulSet
fails due to node failure, and the control plane creates a replacement Pod, the StatefulSet
retains the existing PVC.  The existing volume is unaffected, and the cluster will attach it to
the node where the new Pod is about to launch.

The default for policies is `Retain`, matching the StatefulSet behavior before this new feature.

Here is an example policy.
-->
請記住，這些策略**僅**適用於由於 StatefulSet 被刪除或被縮小而被刪除的 Pod。
例如，如果與 StatefulSet 關聯的 Pod 由於節點故障而失敗，
並且控制平面創建了替換 Pod，則 StatefulSet 保留現有的 PVC。
現有卷不受影響，叢集會將其附加到新 Pod 即將啓動的節點上。

策略的預設值爲 `Retain`，與此新功能之前的 StatefulSet 行爲相匹配。

這是一個示例策略。

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
StatefulSet {{<glossary_tooltip text="控制器" term_id="controller">}}爲其 PVC
添加了[屬主引用](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications)，
這些 PVC 在 Pod 終止後被{{<glossary_tooltip text="垃圾回收器" term_id="garbage-collection">}}刪除。
這使 Pod 能夠在刪除 PVC 之前（以及在刪除後備 PV 和卷之前，取決於保留策略）乾淨地卸載所有卷。
當你設置 `whenDeleted` 刪除策略，對 StatefulSet 實例的屬主引用放置在與該 StatefulSet 關聯的所有 PVC 上。

<!--
The `whenScaled` policy must delete PVCs only when a Pod is scaled down, and not when a
Pod is deleted for another reason. When reconciling, the StatefulSet controller compares
its desired replica count to the actual Pods present on the cluster. Any StatefulSet Pod
whose id greater than the replica count is condemned and marked for deletion. If the
`whenScaled` policy is `Delete`, the condemned Pods are first set as owners to the
associated StatefulSet template PVCs, before the Pod is deleted. This causes the PVCs
to be garbage collected after only the condemned Pods have terminated.
-->
`whenScaled` 策略必須僅在 Pod 縮減時刪除 PVC，而不是在 Pod 因其他原因被刪除時刪除。
執行協調操作時，StatefulSet 控制器將其所需的副本數與叢集上實際存在的 Pod 進行比較。
對於 StatefulSet 中的所有 Pod 而言，如果其 ID 大於副本數，則將被廢棄並標記爲需要刪除。
如果 `whenScaled` 策略是 `Delete`，則在刪除 Pod 之前，
首先將已銷燬的 Pod 設置爲與 StatefulSet 模板對應的 PVC 的屬主。
這會導致 PVC 僅在已廢棄的 Pod 終止後被垃圾收集。

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
這意味着如果控制器崩潰並重新啓動，在其屬主引用更新到適合策略的 Pod 之前，不會刪除任何 Pod。
如果在控制器關閉時強制刪除了已廢棄的 Pod，則屬主引用可能已被設置，也可能未被設置，具體取決於控制器何時崩潰。
更新屬主引用可能需要幾個協調循環，因此一些已廢棄的 Pod 可能已經被設置了屬主引用，而其他可能沒有。
出於這個原因，我們建議等待控制器恢復，控制器將在終止 Pod 之前驗證屬主引用。
如果這不可行，則操作員應驗證 PVC 上的屬主引用，以確保在強制刪除 Pod 時刪除預期的對象。

<!--
### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.

Should you manually scale a deployment, example via `kubectl scale
statefulset statefulset --replicas=X`, and then you update that StatefulSet
based on a manifest (for example: by running `kubectl apply -f
statefulset.yaml`), then applying that manifest overwrites the manual scaling
that you previously did.
-->
### 副本數 {#replicas}

`.spec.replicas` 是一個可選字段，用於指定所需 Pod 的數量。它的預設值爲 1。

如果你手動擴縮已部署的負載，例如通過 `kubectl scale statefulset statefulset --replicas=X`，
然後根據清單更新 StatefulSet（例如：通過運行 `kubectl apply -f statefulset.yaml`），
那麼應用該清單的操作會覆蓋你之前所做的手動擴縮。

<!--
If a [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
(or any similar API for horizontal scaling) is managing scaling for a
Statefulset, don't set `.spec.replicas`. Instead, allow the Kubernetes
{{<glossary_tooltip text="control plane" term_id="control-plane" >}} to manage
the `.spec.replicas` field automatically.
-->
如果 [HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
（或任何類似的水平擴縮 API）正在管理 StatefulSet 的擴縮，
請不要設置 `.spec.replicas`。
相反，允許 Kubernetes {{<glossary_tooltip text="控制平面" term_id="control-plane" >}}自動管理 `.spec.replicas` 字段。

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
* 瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 瞭解如何使用 StatefulSet
  * 跟隨示例[部署有狀態應用](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/)。
  * 跟隨示例[使用 StatefulSet 部署 Cassandra](/zh-cn/docs/tutorials/stateful-application/cassandra/)。
  * 跟隨示例[運行多副本的有狀態應用程式](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)。
  * 瞭解如何[擴縮 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)。
  * 瞭解[刪除 StatefulSet](/zh-cn/docs/tasks/run-application/delete-stateful-set/)涉及到的操作。
  * 瞭解如何[設定 Pod 以使用捲進行儲存](/zh-cn/docs/tasks/configure-pod-container/configure-volume-storage/)。
  * 瞭解如何[設定 Pod 以使用 PersistentVolume 作爲儲存](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。
* `StatefulSet` 是 Kubernetes REST API 中的頂級資源。閱讀 {{< api-reference page="workload-resources/stateful-set-v1" >}}
   對象定義理解關於該資源的 API。
* 閱讀 [Pod 干擾預算（Disruption Budget）](/zh-cn/docs/concepts/workloads/pods/disruptions/)，瞭解如何在干擾下運行高度可用的應用。

