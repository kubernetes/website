---
title: API 概述
content_type: concept
weight: 20
no_list: true
card:
  name: reference
  weight: 50
  title: API 概述
---

<!--
title: API Overview
reviewers:
- erictune
- lavalamp
- jbeda
content_type: concept
weight: 20
no_list: true
card:
  name: reference
  weight: 50
  title: Overview of API
-->

<!-- overview -->

<!--
This section provides reference information for the Kubernetes API.
-->
本文提供了 Kubernetes API 的參考信息。

<!--
The REST API is the fundamental fabric of Kubernetes. All operations and
communications between components, and external user commands are REST API
calls that the API Server handles. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
REST API 是 Kubernetes 的基本結構。
所有操作和組件之間的通信及外部用戶命令都是調用 API 服務器處理的 REST API。
因此，Kubernetes 平臺視一切皆爲 API 對象，
且它們在 [API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 中有相應的定義。

<!--
The [Kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
lists the API for Kubernetes version {{< param "version" >}}.
-->
[Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
列出了 Kubernetes {{< param "version" >}} 版本的 API。

<!--
For general background information, read
[The Kubernetes API](/docs/concepts/overview/kubernetes-api/).
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
describes how clients can authenticate to the Kubernetes API server, and how their
requests are authorized.
-->
如需瞭解一般背景信息，請查閱 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)。
[Kubernetes API 控制訪問](/zh-cn/docs/concepts/security/controlling-access/)描述了客戶端如何向
Kubernetes API 服務器進行身份認證以及他們的請求如何被鑑權。

<!--
## API versioning
-->
## API 版本控制   {#api-versioning}

<!--
The JSON and Protobuf serialization schemas follow the same guidelines for
schema changes. The following descriptions cover both formats.
-->
JSON 和 Protobuf 序列化模式遵循相同的模式更改原則。
以下描述涵蓋了這兩種格式。

<!--
The API versioning and software versioning are indirectly related.
The [API and release versioning proposal](https://git.k8s.io/sig-release/release-engineering/versioning.md)
describes the relationship between API versioning and software versioning.
-->
API 版本控制和軟件版本控制是間接相關的。
[API 和發佈版本控制提案](https://git.k8s.io/sig-release/release-engineering/versioning.md)描述了
API 版本控制和軟件版本控制間的關係。

<!--
Different API versions indicate different levels of stability and support. You
can find more information about the criteria for each level in the
[API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).
-->
不同的 API 版本代表着不同的穩定性和支持級別。
你可以在 [API 變更文檔](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
中查看到更多的不同級別的判定標準。

<!--
Here's a summary of each level:
-->
下面是每個級別的摘要：

<!--
- Alpha:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - Built-in alpha API versions are disabled by default and must be explicitly enabled in the `kube-apiserver` configuration to be used.
  - The software may contain bugs. Enabling a feature may expose bugs.
  - Support for an alpha API may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters,
    due to increased risk of bugs and lack of long-term support.
-->
- Alpha：
  - 版本名稱包含 `alpha`（例如：`v1alpha1`）。
  - 內置的 Alpha API 版本默認被禁用且必須在 `kube-apiserver` 配置中顯式啓用才能使用。
  - 軟件可能會有 Bug。啓用某個特性可能會暴露出 Bug。
  - 對某個 Alpha API 特性的支持可能會隨時被刪除，恕不另行通知。
  - API 可能在以後的軟件版本中以不兼容的方式更改，恕不另行通知。
  - 由於缺陷風險增加和缺乏長期支持，建議該軟件僅用於短期測試集羣。

<!--
- Beta:
  - The version names contain `beta` (for example, `v2beta3`).
  - Built-in beta API versions are disabled by default and must be explicitly enabled in the `kube-apiserver` configuration to be used
    (**except** for beta versions of APIs introduced prior to Kubernetes 1.22, which were enabled by default).
  - Built-in beta API versions have a maximum lifetime of 9 months or 3 minor releases (whichever is longer) from introduction
    to deprecation, and 9 months or 3 minor releases (whichever is longer) from deprecation to removal.
  - The software is well tested. Enabling a feature is considered safe.
  - The support for a feature will not be dropped, though the details may change.
-->
- Beta：
  - 版本名稱包含 `beta`（例如：`v2beta3`）。
  - 內置的 Beta API 版本默認被禁用且必須在 `kube-apiserver` 配置中顯式啓用才能使用
    （例外情況是 Kubernetes 1.22 之前引入的 Beta 版本的 API，這些 API 默認被啓用）。
  - 內置 Beta API 版本從引入到棄用的最長生命週期爲 9 個月或 3 個次要版本（以較長者爲準），
    從棄用到移除的最長生命週期爲 9 個月或 3 個次要版本（以較長者爲準）。
  - 軟件被很好的測試過。啓用某個特性被認爲是安全的。
  - 儘管一些特性會發生細節上的變化，但它們將會被長期支持。

  <!--
  - The schema and/or semantics of objects may change in incompatible ways in
    a subsequent beta or stable API version. When this happens, migration
    instructions are provided. Adapting to a subsequent beta or stable API version
    may require editing or re-creating API objects, and may not be straightforward.
    The migration may require downtime for applications that rely on the feature.
  - The software is not recommended for production uses. Subsequent releases
    may introduce incompatible changes. Use of beta API versions is
    required to transition to subsequent beta or stable API versions
    once the beta API version is deprecated and no longer served.
  -->
  - 在隨後的 Beta 版或 Stable 版中，對象的模式和（或）語義可能以不兼容的方式改變。
    當這種情況發生時，將提供遷移說明。
    適配後續的 Beta 或 Stable API 版本可能需要編輯或重新創建 API 對象，這可能並不簡單。
    對於依賴此功能的應用程序，可能需要停機遷移。
  - 該版本的軟件不建議生產使用。
    後續發佈版本可能會有不兼容的變動。
    一旦 Beta API 版本被棄用且不再提供服務，
    則使用 Beta API 版本的用戶需要轉爲使用後續的 Beta 或 Stable API 版本。

  {{< note >}}
  <!--
  Please try beta features and provide feedback. After the features exit beta, it
  may not be practical to make more changes.
  -->
  請嘗試 Beta 版時特性時並提供反饋。
  特性完成 Beta 階段測試後，就可能不會有太多的變更了。
  {{< /note >}}

<!--
- Stable:
  - The version name is `vX` where `X` is an integer.
  - Stable API versions remain available for all future releases within a Kubernetes major version,
    and there are no current plans for a major version revision of Kubernetes that removes stable APIs.
-->
- Stable：
  - 版本名稱如 `vX`，其中 `X` 爲整數。
  - 特性的 Stable 版本會出現在後續很多版本的發佈軟件中。
    Stable API 版本仍然適用於 Kubernetes 主要版本範圍內的所有後續發佈，
    並且 Kubernetes 的主要版本當前沒有移除 Stable API 的修訂計劃。

<!--
## API groups
-->
## API 組 {#api-groups}

<!--
[API groups](https://git.k8s.io/design-proposals-archive/api-machinery/api-group.md)
make it easier to extend the Kubernetes API.
The API group is specified in a REST path and in the `apiVersion` field of a
serialized object.
-->
[API 組](https://git.k8s.io/design-proposals-archive/api-machinery/api-group.md)能夠簡化對
Kubernetes API 的擴展。API 組信息出現在 REST 路徑中，也出現在序列化對象的 `apiVersion` 字段中。

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
*  **核心（core）**（也被稱爲 **legacy**）組的 REST 路徑爲 `/api/v1`。
   核心組並不作爲 `apiVersion` 字段的一部分，例如， `apiVersion: v1`。
*  指定的組位於 REST 路徑 `/apis/$GROUP_NAME/$VERSION`，
   並且使用 `apiVersion: $GROUP_NAME/$VERSION` （例如，`apiVersion: batch/v1`）。
   你可以在 [Kubernetes API 參考文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#-strong-api-groups-strong-)
   中查看全部的 API 組。

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
## 啓用或禁用 API 組   {#enabling-or-disabling}

資源和 API 組是在默認情況下被啓用的。
你可以通過在 API 服務器上設置 `--runtime-config` 參數來啓用或禁用它們。
`--runtime-config` 參數接受逗號分隔的 `<key>[=<value>]` 對，
來描述 API 服務器的運行時配置。如果省略了 `=<value>` 部分，那麼視其指定爲 `=true`。
例如：

- 禁用 `batch/v1`，對應參數設置 `--runtime-config=batch/v1=false`
- 啓用 `batch/v2alpha1`，對應參數設置 `--runtime-config=batch/v2alpha1`
- 要啓用特定版本的 API，如 `storage.k8s.io/v1beta1/csistoragecapacities`，可以設置
  `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`

{{< note >}}
<!--
When you enable or disable groups or resources, you need to restart the API
server and controller manager to pick up the `--runtime-config` changes.
-->
啓用或禁用組或資源時，
你需要重啓 API 服務器和控制器管理器來使 `--runtime-config` 生效。
{{< /note >}}

<!--
## Persistence
-->
## 持久化 {#persistence}

<!--
Kubernetes stores its serialized state in terms of the API resources by writing them into
{{< glossary_tooltip term_id="etcd" >}}.
-->
Kubernetes 通過 API 資源來將序列化的狀態寫到 {{< glossary_tooltip term_id="etcd" >}} 中存儲。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- Read the design documentation for
  [aggregator](https://git.k8s.io/design-proposals-archive/api-machinery/aggregated-api-servers.md)
- Learn about [Declarative API Validation](/docs/reference/using-api/declarative-validation/).
-->
- 進一步瞭解 [API 慣例](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
- 閱讀[聚合器](https://git.k8s.io/design-proposals-archive/api-machinery/aggregated-api-servers.md)
- 詳細瞭解[聲明式 API 校驗](/zh-cn/docs/reference/using-api/declarative-validation/)。
