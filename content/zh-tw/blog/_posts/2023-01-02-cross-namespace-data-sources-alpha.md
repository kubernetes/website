---
layout: blog
title: "Kubernetes v1.26：對跨名字空間存儲數據源的 Alpha 支持"
date: 2023-01-02
slug: cross-namespace-data-sources-alpha
---
<!--
layout: blog
title: "Kubernetes v1.26: Alpha support for cross-namespace storage data sources"
date: 2023-01-02
slug: cross-namespace-data-sources-alpha
-->

<!--
**Author:** Takafumi Takahashi (Hitachi Vantara)
-->
**作者：** Takafumi Takahashi (Hitachi Vantara)

**譯者：** Michael Yao (DaoCloud)

<!--
Kubernetes v1.26, released last month, introduced an alpha feature that
lets you specify a data source for a PersistentVolumeClaim, even where the source
data belong to a different namespace.
With the new feature enabled, you specify a namespace in the `dataSourceRef` field of
a new PersistentVolumeClaim. Once Kubernetes checks that access is OK, the new
PersistentVolume can populate its data from the storage source specified in that other
namespace.
Before Kubernetes v1.26, provided your cluster had the `AnyVolumeDataSource` feature enabled,
you could already provision new volumes from a data source in the **same**
namespace.
However, that only worked for the data source in the same namespace,
therefore users couldn't provision a PersistentVolume with a claim
in one namespace from a data source in other namespace.
To solve this problem, Kubernetes v1.26 added a new alpha `namespace` field
to `dataSourceRef` field in PersistentVolumeClaim the API.
-->
上個月發佈的 Kubernetes v1.26 引入了一個 Alpha 特性，允許你在源數據屬於不同的名字空間時爲
PersistentVolumeClaim 指定數據源。啓用這個新特性後，你在新 PersistentVolumeClaim 的
`dataSourceRef` 字段中指定名字空間。一旦 Kubernetes 發現訪問權限正常，新的 PersistentVolume
就可以從其他名字空間中指定的存儲源填充其數據。在 Kubernetes v1.26 之前，如果集羣已啓用了
`AnyVolumeDataSource` 特性，你可能已經從**相同的**名字空間中的數據源製備新卷。
但這僅適用於同一名字空間中的數據源，因此用戶無法基於一個名字空間中的數據源使用另一個名字空間中的聲明來製備
PersistentVolume。爲了解決這個問題，Kubernetes v1.26 在 PersistentVolumeClaim API 的
`dataSourceRef` 字段中添加了一個新的 Alpha `namespace` 字段。

<!--
## How it works

Once the csi-provisioner finds that a data source is specified with a `dataSourceRef` that
has a non-empty namespace name,
it checks all reference grants within the namespace that's specified by the`.spec.dataSourceRef.namespace`
field of the PersistentVolumeClaim, in order to see if access to the data source is allowed.
If any ReferenceGrant allows access, the csi-provisioner provisions a volume from the data source.
-->
## 工作原理   {#how-it-works}

一旦 csi-provisioner 發現數據源是使用具有非空名字空間名稱的 `dataSourceRef` 指定的，
它就會檢查由 PersistentVolumeClaim 的 `.spec.dataSourceRef.namespace`
字段指定的名字空間內所授予的所有引用，以便確定可以訪問數據源。
如果有 ReferenceGrant 允許訪問，則 csi-provisioner 會基於數據源來製備卷。

<!--
## Trying it out

The following things are required to use cross namespace volume provisioning:

* Enable the `AnyVolumeDataSource` and `CrossNamespaceVolumeDataSource` [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) for the kube-apiserver and kube-controller-manager
* Install a CRD for the specific `VolumeSnapShot` controller
* Install the CSI Provisioner controller and enable the `CrossNamespaceVolumeDataSource` feature gate
* Install the CSI driver
* Install a CRD for ReferenceGrants
-->
## 試用   {#trying-it-out}

使用跨名字空間卷製備時以下事項是必需的：

* 爲 kube-apiserver 和 kube-controller-manager 啓用 `AnyVolumeDataSource` 和
  `CrossNamespaceVolumeDataSource` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
* 爲特定的 `VolumeSnapShot` 控制器安裝 CRD
* 安裝 CSI Provisioner 控制器並啓用 `CrossNamespaceVolumeDataSource` 特性門控
* 安裝 CSI 驅動程序
* 爲 ReferenceGrants 安裝 CRD

<!--
## Putting it all together

To see how this works, you can install the sample and try it out.
This sample do to create PVC in dev namespace from VolumeSnapshot in prod namespace.
That is a simple example. For real world use, you might want to use a more complex approach.
-->
## 完整演練  {#putting-it-all-together}

要查看其工作方式，你可以安裝樣例並進行試用。
此樣例使用 prod 名字空間中的 VolumeSnapshot 在 dev 名字空間中創建 PVC。
這是一個簡單的例子。想要在真實世界中使用，你可能要用更復雜的方法。

<!--
### Assumptions for this example {#example-assumptions}

* Your Kubernetes cluster was deployed with `AnyVolumeDataSource` and `CrossNamespaceVolumeDataSource` feature gates enabled
* There are two namespaces, dev and prod
* CSI driver is being deployed
* There is an existing VolumeSnapshot named `new-snapshot-demo` in the _prod_ namespace
* The ReferenceGrant CRD (from the Gateway API project) is already deployed
-->
### 這個例子的假設  {#example-assumptions}

* 部署你的 Kubernetes 集羣時啓用 `AnyVolumeDataSource` 和 `CrossNamespaceVolumeDataSource` 特性門控
* 有兩個名字空間：dev 和 prod
* CSI 驅動程序被部署
* 在 **prod** 名字空間中存在一個名爲 `new-snapshot-demo` 的 VolumeSnapshot
* ReferenceGrant CRD（源於 Gateway API 項目）已被部署

<!--
### Grant ReferenceGrants read permission to the CSI Provisioner

Access to ReferenceGrants is only needed when the CSI driver
has the `CrossNamespaceVolumeDataSource` controller capability.
For this example, the external-provisioner needs **get**, **list**, and **watch**
permissions for `referencegrants` (API group `gateway.networking.k8s.io`).
-->
### 爲 CSI Provisioner 授予 ReferenceGrants 讀取權限  {#grant-referencegrants-read-permission-to-csi-provisioner}

僅當 CSI 驅動程序具有 `CrossNamespaceVolumeDataSource` 控制器功能時才需要訪問 ReferenceGrants。
對於此示例，外部製備器對於 `referencegrants`（API 組 `gateway.networking.k8s.io`）需要
**get**、**list** 和 **watch** 權限。

```yaml
  - apiGroups: ["gateway.networking.k8s.io"]
    resources: ["referencegrants"]
    verbs: ["get", "list", "watch"]
```

<!--
### Enable the CrossNamespaceVolumeDataSource feature gate for the CSI Provisioner

Add `--feature-gates=CrossNamespaceVolumeDataSource=true` to the csi-provisioner command line.
For example, use this manifest snippet to redefine the container:
-->
### 爲 CSI Provisioner 啓用 CrossNamespaceVolumeDataSource 特性門控   {#enable-cnvds-feature-for-csi-provisioner}

將 `--feature-gates=CrossNamespaceVolumeDataSource=true` 添加到 csi-provisioner 命令行。
例如，使用此清單片段重新定義容器：

```yaml
      - args:
        - -v=5
        - --csi-address=/csi/csi.sock
        - --feature-gates=Topology=true
        - --feature-gates=CrossNamespaceVolumeDataSource=true
        image: csi-provisioner:latest
        imagePullPolicy: IfNotPresent
        name: csi-provisioner
```

<!--
### Create a ReferenceGrant

Here's a manifest for an example ReferenceGrant.
-->
### 創建 ReferenceGrant   {#create-a-referencegrant}

以下是 ReferenceGrant 示例的清單。

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-prod-pvc
  namespace: prod
spec:
  from:
  - group: ""
    kind: PersistentVolumeClaim
    namespace: dev
  to:
  - group: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
```

<!--
### Create a PersistentVolumeClaim by using cross namespace data source

Kubernetes creates a PersistentVolumeClaim on dev and the CSI driver populates
the PersistentVolume used on dev from snapshots on prod.
-->
### 通過使用跨名字空間數據源創建 PersistentVolumeClaim   {#create-a-pvc-by-using-cross-ns-data-source}

Kubernetes 在 dev 上創建 PersistentVolumeClaim，CSI 驅動程序從 prod 上的快照填充在
dev 上使用的 PersistentVolume。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: example-pvc
  namespace: dev
spec:
  storageClassName: example
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: prod
  volumeMode: Filesystem
```

<!--
## How can I learn more?

The enhancement proposal,
[Provision volumes from cross-namespace snapshots](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3294-provision-volumes-from-cross-namespace-snapshots), includes lots of detail about the history and technical implementation of this feature.

Please get involved by joining the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage)
to help us enhance this feature.
There are a lot of good ideas already and we'd be thrilled to have more!
-->
## 怎樣瞭解更多   {#how-can-i-learn-more}

增強提案
[Provision volumes from cross-namespace snapshots](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3294-provision-volumes-from-cross-namespace-snapshots)
包含了此特性的歷史和技術實現的大量細節。

若想參與，請加入
[Kubernetes 存儲特別興趣小組 (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage)
幫助我們增強此特性。SIG 內有許多好點子，我們很高興能有更多！

<!--
## Acknowledgments

It takes a wonderful group to make wonderful software.
Special thanks to the following people for the insightful reviews,
thorough consideration and valuable contribution to the CrossNamespaceVolumeDataSouce feature:
-->
## 致謝   {#acknowledgments}

製作出色的軟件需要優秀的團隊。
特別感謝以下人員對 CrossNamespaceVolumeDataSouce 特性的深刻見解、周密考量和寶貴貢獻：

* Michelle Au (msau42)
* Xing Yang (xing-yang)
* Masaki Kimura (mkimuram)
* Tim Hockin (thockin)
* Ben Swartzlander (bswartz)
* Rob Scott (robscott)
* John Griffith (j-griffith)
* Michael Henriksen (mhenriks)
* Mustafa Elbehery (Elbehery)

<!--
It’s been a joy to work with y'all on this.
-->
很高興與大家一起工作。
