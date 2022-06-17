---
title: API 概述
weight: 10
no_list: true
card:
   name: reference
   weight: 50
---

<!-- overview -->

<!--
This section provides reference information for the Kubernetes API.
-->
本文提供了 Kubernetes API 的參考資訊。

<!--
The REST API is the fundamental fabric of Kubernetes. All operations and
communications between components, and external user commands are REST API
calls that the API Server handles. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
REST API 是 Kubernetes 的基本結構。
所有操作和元件之間的通訊及外部使用者命令都是呼叫 API 伺服器處理的 REST API。
因此，Kubernetes 平臺視一切皆為 API 物件，
且它們在 [API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 中有相應的定義。

<!--
The [Kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
lists the API for Kubernetes version {{< param "version" >}}.
-->
[Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)列
出了 Kubernetes {{< param "version" >}} 版本的 API。

<!--
For general background information, read
[The Kubernetes API](/docs/concepts/overview/kubernetes-api/).
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
describes how clients can authenticate to the Kubernetes API server, and how their
requests are authorized.
-->
如需瞭解一般背景資訊，請查閱 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)。
[Kubernetes API 控制訪問](/zh-cn/docs/concepts/security/controlling-access/)描述了客戶端如何
向 Kubernetes API 伺服器進行身份認證以及他們的請求如何被鑑權。


<!--
## API versioning
-->
## API 版本控制

<!--
The JSON and Protobuf serialization schemas follow the same guidelines for
schema changes. The following descriptions cover both formats.
-->
JSON 和 Protobuf 序列化模式遵循相同的模式更改原則。
以下描述涵蓋了這兩種格式。

<!--
The API versioning and software versioning are indirectly related.
The [API and release versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
describes the relationship between API versioning and software versioning.
-->
API 版本控制和軟體版本控制是間接相關的。
[API 和釋出版本控制提案](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
描述了 API 版本控制和軟體版本控制間的關係。

<!--
Different API versions indicate different levels of stability and support. You
can find more information about the criteria for each level in the
[API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).
-->
不同的 API 版本代表著不同的穩定性和支援級別。
你可以在 [API 變更文件](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
中檢視到更多的不同級別的判定標準。

<!--
Here's a summary of each level:
-->
下面是每個級別的摘要：

<!--
- Alpha:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - The software may contain bugs. Enabling a feature may expose bugs. A
    feature may be disabled by default.
  - The support for a feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters,
    due to increased risk of bugs and lack of long-term support.
-->
- Alpha:
  - 版本名稱包含 `alpha`（例如，`v1alpha1`）。
  - 軟體可能會有 Bug。啟用某個特性可能會暴露出 Bug。
    某些特性可能預設禁用。
  - 對某個特性的支援可能會隨時被刪除，恕不另行通知。
  - API 可能在以後的軟體版本中以不相容的方式更改，恕不另行通知。
  - 由於缺陷風險增加和缺乏長期支援，建議該軟體僅用於短期測試叢集。

<!--
- Beta:
  - The version names contain `beta` (for example, `v2beta3`).
  - The software is well tested. Enabling a feature is considered safe.
    Features are enabled by default.
  - The support for a feature will not be dropped, though the details may change.
-->
- Beta:
  - 版本名稱包含 `beta` （例如， `v2beta3`）。
  - 軟體被很好的測試過。啟用某個特性被認為是安全的。
    特性預設開啟。
  - 儘管一些特性會發生細節上的變化，但它們將會被長期支援。

  <!--
  - The schema and/or semantics of objects may change in incompatible ways in
    a subsequent beta or stable release. When this happens, migration
    instructions are provided. Schema changes may require deleting, editing, and
    re-creating API objects. The editing process may not be straightforward.
    The migration may require downtime for applications that rely on the feature.
  - The software is not recommended for production uses. Subsequent releases
    may introduce incompatible changes. If you have multiple clusters which
    can be upgraded independently, you may be able to relax this restriction.
  -->
  - 在隨後的 Beta 版或穩定版中，物件的模式和（或）語義可能以不相容的方式改變。
    當這種情況發生時，將提供遷移說明。
     模式更改可能需要刪除、編輯和重建 API 物件。
    編輯過程可能並不簡單。
    對於依賴此功能的應用程式，可能需要停機遷移。
  - 該版本的軟體不建議生產使用。
    後續釋出版本可能會有不相容的變動。
    如果你有多個叢集可以獨立升級，可以放寬這一限制。

  <!--
  Please try beta features and provide feedback. After the features exit beta, it
  may not be practical to make more changes.
  -->
  {{< note >}}
  請試用測試版特性時並提供反饋。特性完成 Beta 階段測試後，
  就可能不會有太多的變更了。
  {{< /note >}}

<!--
- Stable:
  - The version name is `vX` where `X` is an integer.
  - The stable versions of features appear in released software for many subsequent versions.
-->
- Stable:
  - 版本名稱如 `vX`，其中 `X` 為整數。
  - 特性的穩定版本會出現在後續很多版本的釋出軟體中。

<!--## API groups-->
## API 組

<!--
[API groups](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)
make it easier to extend the Kubernetes API.
The API group is specified in a REST path and in the `apiVersion` field of a
serialized object.
-->
[API 組](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)
能夠簡化對 Kubernetes API 的擴充套件。
API 組資訊出現在REST 路徑中，也出現在序列化物件的 `apiVersion` 欄位中。

<!--
There are several API groups in Kubernetes:

*  The *core* (also called *legacy*) group is found at REST path `/api/v1`.
   The core group is not specified as part of the `apiVersion` field, for
   example, `apiVersion: v1`.
*  The named groups are at REST path `/apis/$GROUP_NAME/$VERSION` and use
   `apiVersion: $GROUP_NAME/$VERSION` (for example, `apiVersion: batch/v1`).
   You can find the full list of supported API groups in
   [Kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-).
-->
以下是 Kubernetes 中的幾個組：
*  *核心*（也叫 *legacy*）組的 REST 路徑為 `/api/v1`。
   核心組並不作為 `apiVersion` 欄位的一部分，例如， `apiVersion: v1`。
*  指定的組位於 REST 路徑 `/apis/$GROUP_NAME/$VERSION`，
   並且使用 `apiVersion: $GROUP_NAME/$VERSION` （例如， `apiVersion: batch/v1`）。
   你可以在 [Kubernetes API 參考文件](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-)
   中檢視全部的 API 組。

<!--
## Enabling or disabling API groups   {#enabling-or-disabling}

Certain resources and API groups are enabled by default. You can enable or
disable them by setting `--runtime-config` on the API server.  The
`--runtime-config` flag accepts comma separated `<key>[=<value>]` pairs
describing the runtime configuration of the API server. If the `=<value>`
part is omitted, it is treated as if `=true` is specified. For example:

 - to disable `batch/v1`, set `--runtime-config=batch/v1=false`
 - to enable `batch/v2alpha1`, set `--runtime-config=batch/v2alpha1`
 - to enable a specific version of an API, such as `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities` 
-->
## 啟用或禁用 API 組   {#enabling-or-disabling}
資源和 API 組是在預設情況下被啟用的。
你可以透過在 API 伺服器上設定 `--runtime-config` 引數來啟用或禁用它們。
`--runtime-config` 引數接受逗號分隔的 `<key>[=<value>]` 對，
來描述 API 伺服器的執行時配置。如果省略了 `=<value>` 部分，那麼視其指定為 `=true`。
例如：
 - 禁用 `batch/v1`， 對應引數設定 `--runtime-config=batch/v1=false`
 - 啟用 `batch/v2alpha1`， 對應引數設定 `--runtime-config=batch/v2alpha1`
 - 要啟用特定版本的 API，如 `storage.k8s.io/v1beta1/csistoragecapacities`，可以設定
   `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`

<!--
When you enable or disable groups or resources, you need to restart the API
server and controller manager to pick up the `--runtime-config` changes.
-->
{{< note >}}
啟用或禁用組或資源時，
你需要重啟 API 伺服器和控制器管理器來使 `--runtime-config` 生效。
{{< /note >}}

<!--
## Persistence
-->
## 持久化

<!--
Kubernetes stores its serialized state in terms of the API resources by writing them into
-->
Kubernetes 透過 API 資源來將序列化的狀態寫到 {{< glossary_tooltip term_id="etcd" >}} 中儲存。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- Read the design documentation for
  [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)
-->
- 進一步瞭解 [API 慣例](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- 閱讀 [聚合器](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)
