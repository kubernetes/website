---
title: CustomResourceDefinition 的版本
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
---
<!--
title: Versions in CustomResourceDefinitions
reviewers:
- sttts
- liggitt
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
-->

<!-- overview -->
<!--
This page explains how to add versioning information to
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.
-->
本頁介紹如何新增版本資訊到
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions)。
目的是標明 CustomResourceDefinitions 的穩定級別或者服務於 API 升級。
API 升級時需要在不同 API 表示形式之間進行轉換。
本頁還描述如何將物件從一個版本升級到另一個版本。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You should have a initial understanding of [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
你應該對[定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
有一些初步瞭解。

{{< version-check >}}

<!-- steps -->

<!--
## Overview

The CustomResourceDefinition API provides a workflow for introducing and upgrading
to new versions of a CustomResourceDefinition.

When a CustomResourceDefinition is created, the first version is set in the
CustomResourceDefinition `spec.versions` list to an appropriate stability level
and a version number. For example `v1beta1` would indicate that the first
version is not yet stable. All custom resource objects will initially be stored
at this version.

Once the CustomResourceDefinition is created, clients may begin using the
`v1beta1` API.

Later it might be necessary to add new version such as `v1`.
-->
## 概覽

CustomResourceDefinition API 提供了用於引入和升級的工作流程到 CustomResourceDefinition
的新版本。

建立 CustomResourceDefinition 時，會在 CustomResourceDefinition `spec.versions`
列表設定適當的穩定級別和版本號。例如，`v1beta1` 表示第一個版本尚未穩定。
所有定製資源物件將首先用這個版本儲存。

建立 CustomResourceDefinition 後，客戶端可以開始使用 `v1beta1` API。

稍後可能需要新增新版本，例如 `v1`。

<!--
Adding a new version:

1. Pick a conversion strategy. Since custom resource objects need to be able to
   be served at both versions, that means they will sometimes be served at a
   different version than their storage version. In order for this to be
   possible, the custom resource objects must sometimes be converted between the
   version they are stored at and the version they are served at. If the
   conversion involves schema changes and requires custom logic, a conversion
   webhook should be used. If there are no schema changes, the default `None`
   conversion strategy may be used and only the `apiVersion` field will be
   modified when serving different versions.
2. If using conversion webhooks, create and deploy the conversion webhook. See
   the [Webhook conversion](#webhook-conversion) for more details.
3. Update the CustomResourceDefinition to include the new version in the
   `spec.versions` list with `served:true`.  Also, set `spec.conversion` field
   to the selected conversion strategy. If using a conversion webhook, configure
   `spec.conversion.webhookClientConfig` field to call the webhook.
-->
新增新版本：

1. 選擇一種轉化策略。由於定製資源物件需要能夠兩種版本都可用，
   這意味著它們有時會以與儲存版本不同的版本來提供服務。為了能夠做到這一點，
   有時必須在它們儲存的版本和提供的版本之間進行轉換。如果轉換涉及模式變更，
   並且需要自定義邏輯，則應該使用 Webhook 來完成。如果沒有模式變更，
   則可使用預設的 `None` 轉換策略，為不同版本提供服務時只有 `apiVersion` 欄位
   會被改變。
2. 如果使用轉換 Webhook，請建立並部署轉換 Webhook。更多詳細資訊請參見
   [Webhook conversion](#webhook-conversion)。
3. 更新 CustomResourceDefinition，將新版本設定為 `served：true`，加入到
   `spec.versions` 列表。另外，還要設定 `spec.conversion` 欄位
   為所選的轉換策略。如果使用轉換 Webhook，請配置
   `spec.conversion.webhookClientConfig` 來呼叫 Webhook。

<!--
Once the new version is added, clients may incrementally migrate to the new
version. It is perfectly safe for some clients to use the old version while
others use the new version.

Migrate stored objects to the new version:
-->
新增新版本後，客戶端可以逐步遷移到新版本。讓某些客戶使用舊版本的同時
支援其他人使用新版本是相當安全的。

將儲存的物件遷移到新版本：

<!--
1. See the [upgrade existing objects to a new stored version](#upgrade-existing-objects-to-a-new-stored-version) section.

It is safe for clients to use both the old and new version before, during and
after upgrading the objects to a new stored version.
-->

1. 請參閱[將現有物件升級到新的儲存版本](#upgrade-existing-objects-to-a-new-stored-version)節。

對於客戶來說，在將物件升級到新的儲存版本之前、期間和之後使用舊版本和新版本都是安全的。

<!--
Removing an old version:

1. Ensure all clients are fully migrated to the new version. The kube-apiserver
   logs can be reviewed to help identify any clients that are still accessing via
   the old version.
1. Set `served` to `false` for the old version in the `spec.versions` list. If
   any clients are still unexpectedly using the old version they may begin reporting
   errors attempting to access the custom resource objects at the old version.
   If this occurs, switch back to using `served:true` on the old version, migrate the 
   remaining clients to the new version and repeat this step.
1. Ensure the [upgrade of existing objects to the new stored version](#upgrade-existing-objects-to-a-new-stored-version) step has been completed.
    1. Verify that the `storage` is set to `true` for the new version in the `spec.versions` list in the CustomResourceDefinition.
    1. Verify that the old version is no longer listed in the CustomResourceDefinition `status.storedVersions`.
1. Remove the old version from the CustomResourceDefinition `spec.versions` list.
1. Drop conversion support for the old version in conversion webhooks.
-->
刪除舊版本：

1. 確保所有客戶端都已完全遷移到新版本。
   可以檢視 kube-apiserver 的日誌以識別仍透過舊版本進行訪問的所有客戶端。
1. 在 `spec.versions` 列表中將舊版本的 `served` 設定為 `false`。
   如果仍有客戶端意外地使用舊版本，他們可能開始會報告採用舊版本嘗試訪
   定製資源的錯誤訊息。
   如果發生這種情況，請將舊版本的`served：true` 恢復，然後遷移餘下的客戶端
   使用新版本，然後重複此步驟。
1. 確保已完成[將現有物件升級到新儲存版本](#upgrade-existing-objects-to-a-new-stored-version)
   的步驟。
   1. 在 CustomResourceDefinition 的 `spec.versions` 列表中，確認新版本的
      `storage` 已被設定為 `true`。
   2. 確認舊版本不在 CustomResourceDefinition `status.storedVersions` 中。
1. 從 CustomResourceDefinition `spec.versions` 列表中刪除舊版本。
1. 在轉換 Webhooks 中放棄對舊版本的轉換支援。

<!--
## Specify multiple versions

The CustomResourceDefinition API `versions` field can be used to support multiple versions of custom resources that you
have developed. Versions can have different schemas, and conversion webhooks can convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) for a set of useful gotchas and suggestions.
-->
## 指定多個版本  {#specify-multiple-versions}

CustomResourceDefinition API 的 `versions` 欄位可用於支援你所開發的
定製資源的多個版本。版本可以具有不同的模式，並且轉換 Webhooks
可以在多個版本之間轉換定製資源。
在適當的情況下，Webhook 轉換應遵循
[Kubernetes API 約定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)。
尤其是，請查閱
[API 變更文件](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
以瞭解一些有用的常見錯誤和建議。

<!--
In `apiextensions.k8s.io/v1beta1`, there was a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
-->
{{< note >}}
在 `apiextensions.k8s.io/v1beta1` 版本中曾經有一個 `version` 欄位，
名字不叫做 `versions`。該 `version` 欄位已經被廢棄，成為可選項。
不過如果該欄位不是空，則必須與 `versions` 欄位中的第一個條目匹配。
{{< /note >}}

<!--
This example shows a CustomResourceDefinition with two versions. For the first
example, the assumption is all versions share the same schema with no conversion
between them. The comments in the YAML provide more context.
-->
下面的示例顯示了兩個版本的 CustomResourceDefinition。
第一個例子中假設所有的版本使用相同的模式而它們之間沒有轉換。
YAML 中的註釋提供了更多背景資訊。

{{< tabs name="CustomResourceDefinition_versioning_example_1" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name 必須匹配後面 spec 中的欄位，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支援的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以透過 served 標誌啟用或禁止
    served: true
    # 有且只能有一個 version 必須被標記為儲存版本
    storage: true
    # schema 是必需欄位
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  # conversion 節是 Kubernetes 1.13+ 版本引入的，其預設值為無轉換，即
  # strategy 子欄位設定為 None。
  conversion:
    # None 轉換假定所有版本採用相同的模式定義，僅僅將定製資源的 apiVersion
    # 設定為合適的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令列介面和顯示時作為其別名
    singular: crontab
    # kind 通常是駝峰編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令列介面中使用更短的字串來匹配你的資源
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# 在 v1.16 中被棄用以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name 必須匹配後面 spec 中的欄位，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支援的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以透過 served 標誌啟用或禁止
    served: true
    # 有且只能有一個 version 必須被標記為儲存版本
    storage: true
  - name: v1
    served: true
    storage: false
  validation:
    openAPIV3Schema:
      type: object
      properties:
        host:
          type: string
        port:
          type: string
  # conversion 節是 Kubernetes 1.13+ 版本引入的，其預設值為無轉換，即
  # strategy 子欄位設定為 None。
  conversion:
    # None 轉換假定所有版本採用相同的模式定義，僅僅將定製資源的 apiVersion
    # 設定為合適的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令列介面和顯示時作為其別名
    singular: crontab
    # kind 通常是大駝峰編碼（PascalCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令列介面中使用更短的字串來匹配你的資源
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to create it.
-->
你可以將 CustomResourceDefinition 儲存在 YAML 檔案中，然後使用
`kubectl apply` 來建立它。

```shell
kubectl apply -f my-versioned-crontab.yaml
```

<!--
After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.
-->
在建立之後，API 伺服器開始在 HTTP REST 端點上為每個已啟用的版本提供服務。
在上面的示例中，API 版本可以在 `/apis/example.com/v1beta1` 和
`/apis/example.com/v1` 處獲得。

<!--
### Version priority

Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.
-->
### 版本優先順序

不考慮 CustomResourceDefinition 中版本被定義的順序，kubectl 使用
具有最高優先順序的版本作為訪問物件的預設版本。
透過解析 _name_ 欄位確定優先順序來決定版本號，穩定性（GA、Beta 或 Alpha）
級別及該穩定性級別內的序列。

<!--
The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:
-->
用於對版本進行排序的演算法在設計上與 Kubernetes 專案對 Kubernetes 版本進行排序的方式相同。
版本以 `v` 開頭跟一個數字，一個可選的 `beta` 或者 `alpha` 和一個可選的附加數字
作為版本資訊。
從廣義上講，版本字串可能看起來像 `v2` 或者 `v2beta1`。
使用以下演算法對版本進行排序：

<!--
- Entries that follow Kubernetes version patterns are sorted before those that
  do not.
- For entries that follow Kubernetes version patterns, the numeric portions of
  the version string is sorted largest to smallest.
- If the strings `beta` or `alpha` follow the first numeric portion, they sorted
  in that order, after the equivalent string without the `beta` or `alpha`
  suffix (which is presumed to be the GA version).
- If another number follows the `beta`, or `alpha`, those numbers are also
  sorted from largest to smallest.
- Strings that don't fit the above format are sorted alphabetically and the
  numeric portions are not treated specially. Notice that in the example below,
  `foo1` is sorted above `foo10`. This is different from the sorting of the
  numeric portion of entries that do follow the Kubernetes version patterns.
-->
- 遵循 Kubernetes 版本模式的條目在不符合條件的條目之前進行排序。
- 對於遵循 Kubernetes 版本模式的條目，版本字串的數字部分從最大到最小排序。
- 如果第一個數字後面有字串 `beta` 或 `alpha`，它們首先按去掉 `beta` 或
  `alpha` 之後的版本號排序（相當於 GA 版本），之後按 `beta` 先、`alpha` 後的順序排序，
- 如果 `beta` 或 `alpha` 之後還有另一個數字，那麼也會針對這些數字
  從大到小排序。
- 不符合上述格式的字串按字母順序排序，數字部分不經過特殊處理。
  請注意，在下面的示例中，`foo1` 排在 `foo10` 之前。
  這與遵循 Kubernetes 版本模式的條目的數字部分排序不同。

<!--
This might make sense if you look at the following sorted version list:
-->
如果檢視以下版本排序列表，這些規則就容易懂了：

```none
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10
```

<!--
For the example in [Specify multiple versions](#specify-multiple-versions), the
version sort order is `v1`, followed by `v1beta1`. This causes the kubectl
command to use `v1` as the default version unless the provided object specifies
the version.
-->
對於[指定多個版本](#specify-multiple-versions)中的示例，版本排序順序為
`v1`，後跟著 `v1beta1`。
這導致了 kubectl 命令使用 `v1` 作為預設版本，除非所提供的物件指定了版本。

<!--
### Version deprecation
-->
### 版本廢棄

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

<!--
Starting in v1.19, a CustomResourceDefinition can indicate a particular version of the resource it defines is deprecated.
When API requests to a deprecated version of that resource are made, a warning message is returned in the API response as a header.
The warning message for each deprecated version of the resource can be customized if desired.
-->
從 v1.19 開始，CustomResourceDefinition 可用來標明所定義的資源的特定版本
被廢棄。當發起對已廢棄的版本的 API 請求時，會在 API 響應中以 HTTP 頭部
的形式返回警告訊息。
如果需要，可以對資源的每個廢棄版本定製該警告訊息。

<!--
A customized warning message should indicate the deprecated API group, version, and kind,
and should indicate what API group, version, and kind should be used instead, if applicable.
-->
定製的警告訊息應該標明廢棄的 API 組、版本和類別（kind），並且應該標明
應該使用（如果有的話）哪個 API 組、版本和類別作為替代。

{{< tabs name="CustomResourceDefinition_versioning_deprecated" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1alpha1
    served: true
    # 此屬性標明此定製資源的 v1alpha1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告訊息頭。
    deprecated: true
    # 此屬性設定用來覆蓋返回給傳送 v1alpha1 API 請求的客戶端的預設警告資訊。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
    schema: ...
  - name: v1beta1
    served: true
    # 此屬性標明該定製資源的 v1beta1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告訊息頭。
    # 針對此版本的請求所返回的是預設的警告訊息。
    deprecated: true
    schema: ...
  - name: v1
    served: true
    storage: true
    schema: ...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中棄用以推薦使用  apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  validation: ...
  versions:
  - name: v1alpha1
    served: true
    # 此屬性標明此定製資源的 v1alpha1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告訊息頭。
    deprecated: true
    # 此屬性設定用來覆蓋返回給傳送 v1alpha1 API 請求的客戶端的預設警告資訊。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # 此屬性標明該定製資源的 v1beta1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告訊息頭。
    # 針對此版本的請求所返回的是預設的警告訊息。
    deprecated: true
  - name: v1
    served: true
    storage: true
```
{{% /tab %}}
{{< /tabs >}}


<!--
## Webhook conversion

Webhook conversion is available as beta since 1.15, and as alpha since Kubernetes 1.13. The
`CustomResourceWebhookConversion` feature should be enabled. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
## Webhook 轉換   {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
Webhook 轉換在 Kubernetes 1.13 版本引入，在 Kubernetes 1.15 中成為 Beta 功能。
要使用此功能，應啟用 `CustomResourceWebhookConversion` 特性。
在大多數叢集上，這類 Beta 特性應該是自動啟用的。
請參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
文件以獲得更多資訊。
{{< /note >}}

<!--
The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:
-->
上面的例子在版本之間有一個 None 轉換，它只在轉換時設定 `apiVersion` 欄位
而不改變物件的其餘部分。API 伺服器還支援在需要轉換時呼叫外部服務的 webhook 轉換。
例如：

<!--
* custom resource is requested in a different version than stored version.
* Watch is created in one version but the changed object is stored in another version.
* custom resource PUT request is in a different version than storage version.
-->
* 定製資源的請求版本與其儲存版本不同。
* 使用某版本建立了 Watch 請求，但所更改物件以另一版本儲存。
* 定製資源的 PUT 請求所針對版本與儲存版本不同。

<!--
To cover all of these cases and to optimize conversion by the API server,
the conversion requests may contain multiple objects in order to minimize the external calls.
The webhook should perform these conversions independently.
-->
為了涵蓋所有這些情況並最佳化 API 伺服器所作的轉換，轉換請求可以包含多個物件，
以便減少外部呼叫。Webhook 應該獨立執行各個轉換。

<!--
### Write a conversion webhook server

Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions.
Most of the common code are located in the
[framework file](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/converter/framework.go)
that leaves only
[one function](https://github.com/kubernetes/kubernetes/blob/v1.15.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80)
to be implemented for different conversions.
-->
### 編寫一個轉換 Webhook 伺服器

請參考[定製資源轉換 Webhook 伺服器](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/main.go)
的實現；該實現在 Kubernetes e2e 測試中得到驗證。
Webhook 處理由 API 伺服器傳送的 `ConversionReview` 請求，並在
`ConversionResponse` 中封裝發回轉換結果。
請注意，請求包含需要獨立轉換的定製資源列表，這些物件在被轉換之後不能改變其
在列表中的順序。該示例伺服器的組織方式使其可以複用於其他轉換。
大多數常見程式碼都位於
[framework 檔案](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/converter/framework.go)
中，只留下
[一個函式](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80)
用於實現不同的轉換。

<!--
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
-->
{{< note >}}
轉換 Webhook 伺服器示例中將 `ClientAuth` 欄位設定為
[空](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48)，
預設為 `NoClientCert`。
這意味著 webhook 伺服器沒有驗證客戶端（也就是 API 伺服器）的身份。
如果你需要雙向 TLS 或者其他方式來驗證客戶端，請參閱如何
[驗證 API 服務](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)。
{{< /note >}}

<!--
#### Permissible mutations

A conversion webhook must not mutate anything inside of `metadata` of the converted object
other than `labels` and `annotations`.
Attempted changes to `name`, `UID` and `namespace` are rejected and fail the request
which caused the conversion. All other changes are ignored. 
-->
#### 被允許的變更

轉換 Webhook 不可以更改被轉換物件的 `metadata` 中除 `labels` 和 `annotations`
之外的任何屬性。
嘗試更改 `name`、`UID` 和 `namespace` 時都會導致引起轉換的請求失敗。
所有其他變更都被忽略。

<!--
### Deploy the conversion webhook service

Documentation for deploying the conversion webhook is the same as for the [admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service).
The assumption for next sections is that the conversion webhook server is deployed to a service named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.
-->
### 部署轉換 Webhook 服務

用於部署轉換 webhook 的文件與
[准入 Webhook 服務示例](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service)相同。
這裡的假設是轉換 Webhook 伺服器被部署為 `default` 名字空間中名為
`example-conversion-webhook-server` 的服務，並在路徑 `/crdconvert`
上處理請求。

<!--
When the webhook server is deployed into the Kubernetes cluster as a
service, it has to be exposed via a service on port 443 (The server
itself can have an arbitrary port but the service object should map it to port 443).
The communication between the API server and the webhook service may fail
if a different port is used for the service.
-->
{{< note >}}
當 Webhook 伺服器作為一個服務被部署到 Kubernetes 叢集中時，它必須
透過埠 443 公開其服務（伺服器本身可以使用任意埠，但是服務物件
應該將它對映到埠 443）。
如果為伺服器使用不同的埠，則 API 伺服器和 Webhook 伺服器之間的通訊
可能會失敗。
{{< /note >}}

<!--
### Configure CustomResourceDefinition to use conversion webhooks

The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:
-->
### 配置 CustomResourceDefinition 以使用轉換 Webhook

透過修改 `spec` 中的 `conversion` 部分，可以擴充套件 `None` 轉換示例來
使用轉換 Webhook。

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name 必須匹配後面 spec 中的欄位，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支援的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以透過 served 標誌啟用或禁止
    served: true
    # 有且只能有一個 version 必須被標記為儲存版本
    storage: true
    # 當不存在頂級模式定義時，每個版本（version）可以定義其自身的模式
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhook strategy 告訴 API 伺服器呼叫外部 Webhook 來完成定製資源
    # 之間的轉換
    strategy: Webhook
    # 當 strategy 為 "Webhook" 時，webhook 屬性是必需的
    # 該屬性配置將被 API 伺服器呼叫的 Webhook 端點
    webhook:
      # conversionReviewVersions 標明 Webhook 所能理解或偏好使用的
      # ConversionReview 物件版本。
      # API 伺服器所能理解的列表中的第一個版本會被髮送到 Webhook
      # Webhook 必須按所接收到的版本響應一個 ConversionReview 物件
      conversionReviewVersions: ["v1","v1beta1"]
      clientConfig:
        service:
          namespace: default
          name: example-conversion-webhook-server
          path: /crdconvert
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令列介面和顯示時作為其別名
    singular: crontab
    # kind 通常是駝峰編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令列介面中使用更短的字串來匹配你的資源
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中被棄用以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name 必須匹配後面 spec 中的欄位，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 裁剪掉下面的 OpenAPI 模式中未曾定義的物件欄位
  preserveUnknownFields: false
  # 此 CustomResourceDefinition 所支援的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以透過 served 標誌啟用或禁止
    served: true
    # 有且只能有一個 version 必須被標記為儲存版本
    storage: true
    # 當不存在頂級模式定義時，每個版本（version）可以定義其自身的模式
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhook strategy 告訴 API 伺服器呼叫外部 Webhook 來完成定製資源
    strategy: Webhook
    # 當 strategy 為 "Webhook" 時，webhookClientConfig 屬性是必需的
    # 該屬性配置將被 API 伺服器呼叫的 Webhook 端點
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令列介面和顯示時作為其別名
    singular: crontab
    # kind 通常是駝峰編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令列介面中使用更短的字串來匹配你的資源
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to apply it.
-->
你可以將 CustomResourceDefinition 儲存在 YAML 檔案中，然後使用
`kubectl apply` 來應用它。

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

<!--
Make sure the conversion service is up and running before applying new changes.
-->
在應用新更改之前，請確保轉換伺服器已啟動並正在執行。

<!--
### Contacting the webhook

Once the API server has determined a request should be sent to a conversion webhook,
it needs to know how to contact the webhook. This is specified in the `webhookClientConfig`
stanza of the webhook configuration.

Conversion webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
### 呼叫 Webhook

API 伺服器一旦確定請求應傳送到轉換 Webhook，它需要知道如何呼叫 Webhook。
這是在 `webhookClientConfig` 中指定的 Webhook 配置。

轉換 Webhook 可以透過 URL 或服務引用來呼叫，並且可以選擇包含自定義 CA 包，
以用於驗證 TLS 連線。

### URL

<!--
`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`). 

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(i.e., `kube-apiserver` cannot resolve in-cluster DNS as that would
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installations are likely to be non-portable or not readily run in a new cluster.
-->
url 以標準 URL 形式給出 Webhook 的位置（`scheme://host:port/path`）。
`host` 不應引用叢集中執行的服務，而應透過指定 `service` 欄位來提供
服務引用。
在某些 API 伺服器中，`host` 可以透過外部 DNS 進行解析（即
`kube-apiserver` 無法解析叢集內 DNS，那樣會違反分層規則）。
`host` 也可以是 IP 地址。

請注意，除非你非常小心地在所有執行著可能呼叫 Webhook 的 API 伺服器的
主機上執行此 Webhook，否則將 `localhost` 或 `127.0.0.1` 用作 `host`
是風險很大的。這樣的安裝可能是不可移植的，或者不容易在一個新的叢集中執行。
<!--
The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a conversion webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
HTTP 協議必須為 `https`；URL 必須以 `https://` 開頭。

嘗試使用使用者或基本身份驗證（例如，使用`user:password@`）是不允許的。
URL 片段（`#...`）和查詢引數（`?...`）也是不允許的。

下面是為呼叫 URL 來執行轉換 Webhook 的示例，其中期望使用系統信任根
來驗證 TLS 證書，因此未指定 caBundle：

{{< tabs name="CustomResourceDefinition_versioning_example_3" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中已棄用以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Service Reference

The `service` stanza inside `webhookClientConfig` is a reference to the service for a conversion webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a webhook that is configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.
-->
### 服務引用

`webhookClientConfig` 內部的 `service` 段是對轉換 Webhook 服務的引用。
如果 Webhook 在叢集中執行，則應使用 `service` 而不是 `url`。
服務的名字空間和名稱是必需的。埠是可選的，預設為 443。
路徑是可選的，預設為`/`。

下面配置中，服務配置為在埠 `1234`、子路徑 `/my-path` 上被呼叫。
例子中針對 ServerName `my-service-name.my-service-namespace.svc`，
使用自定義 CA 包驗證 TLS 連線。

{{< tabs name="CustomResourceDefinition_versioning_example_4" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        service:
          namespace: my-service-namespace
          name: my-service-name
          path: /my-path
          port: 1234
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
#  v1.16 中被棄用以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Webhook request and response

### Request

Webhooks are sent a POST request, with `Content-Type: application/json`,
with a `ConversionReview` API object in the `apiextensions.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `ConversionReview` objects they accept
with the `conversionReviewVersions` field in their CustomResourceDefinition:
-->
## Webhook 請求和響應

### 請求

向 Webhooks 發起請求的動詞是 POST，請求的 `Content-Type` 為 `application/json`。
請求的主題為 JSON 序列化形式的
apiextensions.k8s.io API 組的 ConversionReview API 物件。

Webhooks 可以在其 CustomResourceDefinition 中使用`conversionReviewVersions` 欄位
設定它們接受的 `ConversionReview` 物件的版本：

{{< tabs name="conversionReviewVersions" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      conversionReviewVersions: ["v1", "v1beta1"]
      ...
```

<!--
`conversionReviewVersions` is a required field when creating 
`apiextensions.k8s.io/v1` custom resource definitions.
Webhooks are required to support at least one `ConversionReview`
version understood by the current and previous API server.
-->
建立 `apiextensions.k8s.io/v1` 版本的自定義資源定義時，
`conversionReviewVersions`是必填欄位。
Webhooks 要求支援至少一個 `ConversionReview` 當前和以前的 API 伺服器
可以理解的版本。

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# v1.16 已棄用以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    conversionReviewVersions: ["v1", "v1beta1"]
    ...
```
<!--
If no `conversionReviewVersions` are specified, the default when creating 
`apiextensions.k8s.io/v1beta1` custom resource definitions is `v1beta1`.
-->
建立 apiextensions.k8s.io/v1beta1 定製資源定義時若未指定
`conversionReviewVersions`，則預設值為 v1beta1。

{{% /tab %}}
{{< /tabs >}}

<!--
API servers send the first `ConversionReview` version in the `conversionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the custom resource definition will not be allowed to be created.
If an API server encounters a conversion webhook configuration that was previously created and does not support any of the `ConversionReview`
versions the API server knows how to send, attempts to call to the webhook will fail.
-->
API 伺服器將 `conversionReviewVersions` 列表中他們所支援的第一個
`ConversionReview` 資源版本傳送給 Webhook。
如果列表中的版本都不被 API 伺服器支援，則無法建立自定義資源定義。
如果某 API 伺服器遇到之前建立的轉換 Webhook 配置，並且該配置不支援
API 伺服器知道如何傳送的任何 `ConversionReview` 版本，呼叫 Webhook
的嘗試會失敗。

<!--
This example shows the data contained in an `ConversionReview` object
for a request to convert `CronTab` objects to `example.com/v1`:
-->
下面的示例顯示了包含在 `ConversionReview` 物件中的資料，
該請求意在將 `CronTab` 物件轉換為 `example.com/v1`：

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: ConversionReview
request:
  # 用來唯一標識此轉換呼叫的隨機 UID
  uid: 705ab4f5-6393-11e8-b7cc-42010a800002
  
  # 物件要轉換到的目標 API 組和版本
  desiredAPIVersion: example.com/v1
  
  # 要轉換的物件列表
  # 其中可能包含一個或多個物件，版本可能相同也可能不同
  objects:
    - kind: CronTab
      apiVersion: example.com/v1beta1
      metadata:
        creationTimestamp: "2019-09-04T14:03:02Z"
        name: local-crontab
        namespace: default
        resourceVersion: "143"
        uid: "3415a7fc-162b-4300-b5da-fd6083580d66"
      hostPort: "localhost:1234"
    - kind: CronTab
      apiVersion: example.com/v1beta1
      metadata:
        creationTimestamp: "2019-09-03T13:02:01Z"
        name: remote-crontab
        resourceVersion: "12893",
        uid: "359a83ec-b575-460d-b553-d859cedde8a0"
      hostPort: example.com:2345
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# v1.16 中已廢棄以推薦使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: ConversionReview
request:
  # 用來唯一標識此轉換呼叫的隨機 UID
  uid: 705ab4f5-6393-11e8-b7cc-42010a800002
  
  # 物件要轉換到的目標 API 組和版本
  desiredAPIVersion: example.com/v1
  
  # 要轉換的物件列表
  # 其中可能包含一個或多個物件，版本可能相同也可能不同
  objects:
    - kind: CronTab
      apiVersion: example.com/v1beta1
      metadata:
        creationTimestamp: "2019-09-04T14:03:02Z"
        name: local-crontab
        namespace: default
        resourceVersion: "143"
        uid: "3415a7fc-162b-4300-b5da-fd6083580d66"
      hostPort: "localhost:1234"
    - kind: CronTab
      apiVersion: example.com/v1beta1
      metadata:
        creationTimestamp: "2019-09-03T13:02:01Z"
        name: remote-crontab
        resourceVersion: "12893",
        uid: "359a83ec-b575-460d-b553-d859cedde8a0"
      hostPort: example.com:2345
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Response

Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing a `ConversionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.

If conversion succeeds, a webhook should return a `response` stanza containing the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `result`, set to `{"status":"Success"}`
* `convertedObjects`, containing all of the objects from `request.objects`, converted to `request.desiredVersion`

Example of a minimal successful response from a webhook:
-->
### 響應

Webhooks 響應包含 200 HTTP 狀態程式碼、`Content-Type: application/json`，
在主體中包含 JSON 序列化形式的資料，在 `response` 節中給出
 ConversionReview 物件（與傳送的版本相同）。

如果轉換成功，則 Webhook 應該返回包含以下欄位的 `response` 節：

* `uid`，從傳送到 webhook 的 `request.uid` 複製而來
* `result`，設定為 `{"status":"Success"}}`
* `convertedObjects`，包含來自 `request.objects` 的所有物件，均已轉換為
  `request.desiredVersion`

Webhook 的最簡單成功響應示例：

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: ConversionReview
response:
  # 必須與 <request.uid> 匹配
  uid: "705ab4f5-6393-11e8-b7cc-42010a800002"
  result:
    status: Success
  # 這裡的物件必須與 request.objects 中的物件順序相同並且其 apiVersion
  # 被設定為 <request.desiredAPIVersion>。
  # kind、metadata.uid、metadata.name 和 metadata.namespace 等欄位都不可
  # 被 Webhook 修改。
  # Webhook 可以更改 metadata.labels 和 metadata.annotations 欄位值
  # Webhook 對 metadata 中其他欄位的更改都會被忽略
  convertedObjects:
    - kind: CronTab
      apiVersion: example.com/v1
      metadata:
        creationTimestamp: "2019-09-04T14:03:02Z"
        name: local-crontab
        namespace: default
        resourceVersion: "143",
        uid: "3415a7fc-162b-4300-b5da-fd6083580d66"
      host: localhost
      port: "1234"
    - kind: CronTab
      apiVersion: example.com/v1
      metadata:
        creationTimestamp: "2019-09-03T13:02:01Z",
        name: remote-crontab
        resourceVersion: "12893",
        uid: "359a83ec-b575-460d-b553-d859cedde8a0"
      host: example.com
      port: "2345"
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# v1.16 中已棄用以推薦使用  apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: ConversionReview
response:
  # 必須與 <request.uid> 匹配
  uid: "705ab4f5-6393-11e8-b7cc-42010a800002"
  result:
    status: Failed
  # 這裡的物件必須與 request.objects 中的物件順序相同並且其 apiVersion
  # 被設定為 <request.desiredAPIVersion>。
  # kind、metadata.uid、metadata.name 和 metadata.namespace 等欄位都不可
  # 被 Webhook 修改。
  # Webhook 可以更改 metadata.labels 和 metadata.annotations 欄位值
  # Webhook 對 metadata 中其他欄位的更改都會被忽略
  convertedObjects:
    - kind: CronTab
      apiVersion: example.com/v1
      metadata:
        creationTimestamp: "2019-09-04T14:03:02Z"
        name: local-crontab
        namespace: default
        resourceVersion: "143",
        uid: "3415a7fc-162b-4300-b5da-fd6083580d66"
      host: localhost
      port: "1234"
    - kind: CronTab
      apiVersion: example.com/v1
      metadata:
        creationTimestamp: "2019-09-03T13:02:01Z",
        name: remote-crontab
        resourceVersion: "12893",
        uid: "359a83ec-b575-460d-b553-d859cedde8a0"
      host: example.com
      port: "2345"
```
{{% /tab %}}
{{< /tabs >}}

<!--
If conversion fails, a webhook should return a `response` stanza containing the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `result`, set to `{"status":"Failed"}`
-->
如果轉換失敗，則 Webhook 應該返回包含以下欄位的 `response` 節：

* `uid`，從傳送到 Webhook 的 `request.uid` 複製而來
* `result`，設定為 `{"status": "Failed"}`

{{< warning >}}
<!--
Failing conversion can disrupt read and write access to the custom resources,
including the ability to update or delete the resources. Conversion failures 
should be avoided whenever possible, and should not be used to enforce validation
 constraints (use validation schemas or webhook admission instead).
-->
轉換失敗會破壞對定製資源的讀寫訪問，包括更新或刪除資源的能力。
轉換失敗應儘可能避免，並且不可用於實施合法性檢查約束
（應改用驗證模式或 Webhook 准入外掛）。
{{< /warning >}}

<!--
Example of a response from a webhook indicating a conversion request failed, with an optional message:
-->
來自 Webhook 的響應示例，指示轉換請求失敗，並帶有可選訊息：

{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: ConversionReview
  response:
    uid: <value from request.uid>
    result: {
      status: Failed
      message: hostPort could not be parsed into a separate host and port
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
  # v1.16 中棄用以推薦使用 apiextensions.k8s.io/v1
  apiVersion: apiextensions.k8s.io/v1beta1
  kind: ConversionReview
  response:
    uid: <value from request.uid>
    result:
      status: Failed
      message: hostPort could not be parsed into a separate host and port
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Writing, reading, and updating versioned CustomResourceDefinition objects
-->
## 編寫、讀取和更新版本化的 CustomResourceDefinition 物件

<!--
When an object is written, it is persisted at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.
-->
寫入物件時，將使用寫入時指定的儲存版本來儲存。如果儲存版本發生變化，
現有物件永遠不會被自動轉換。然而，新建立或被更新的物件將以新的儲存版本寫入。
物件寫入的版本不再被支援是有可能的。

<!--
When you read an object, you specify the version as part of the path. If you
specify a version that is different from the object's persisted version,
Kubernetes returns the object to you at the version you requested, but the
persisted object is neither changed on disk, nor converted in any way
(other than changing the `apiVersion` string) while serving the request.
You can request an object at any version that is currently served.
-->
當讀取物件時，作為路徑的一部分，你需要指定版本。
如果所指定的版本與物件的持久版本不同，Kubernetes 會按所請求的版本將物件返回，
但是在滿足服務請求時，被持久化的物件既不會在磁碟上更改，也不會以任何方式進行
轉換（除了 `apiVersion` 字串被更改之外）。你可以以當前提供的任何版本
來請求物件。

<!--
If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.
-->
如果你更新一個現有物件，它將以當前的儲存版本被重寫。
這是可以將物件從一個版本改到另一個版本的唯一辦法。

<!--
To illustrate this, consider the following hypothetical series of events:
-->
為了說明這一點，請考慮以下假設的一系列事件：

<!--
1.  The storage version is `v1beta1`. You create an object. It is persisted in
    storage at version `v1beta1`
2.  You add version `v1` to your CustomResourceDefinition and designate it as
    the storage version.
3.  You read your object at version `v1beta1`, then you read the object again at
    version `v1`. Both returned objects are identical except for the apiVersion
    field.
4.  You create a new object. It is persisted in storage at version `v1`. You now
    have two objects, one of which is at `v1beta1`, and the other of which is at
    `v1`.
5.  You update the first object. It is now persisted at version `v1` since that
    is the current storage version.
-->
1.  儲存版本是 `v1beta1`。你建立一個物件。該物件以版本 `v1beta1` 儲存。
2.  你將為 CustomResourceDefinition 新增版本 `v1`，並將其指定為儲存版本。
3.  你使用版本 `v1beta1` 來讀取你的物件，然後你再次用版本 `v1` 讀取物件。
    除了 apiVersion 欄位之外，返回的兩個物件是完全相同的。
4.  你建立一個新物件。物件以版本 `v1` 儲存在儲存中。
    你現在有兩個物件，其中一個是 `v1beta1`，另一個是 `v1`。
5.  你更新第一個物件。該物件現在以版本 `v1` 儲存，因為 `v1` 是當前的儲存版本。

<!--
### Previous storage versions
-->
### 以前的儲存版本

<!--
The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been persisted
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.
-->
API 伺服器在狀態欄位 `storedVersions` 中記錄曾被標記為儲存版本的每個版本。
物件可能以任何曾被指定為儲存版本的版本儲存。
儲存中不會出現從未成為儲存版本的版本的物件。

<!--
## Upgrade existing objects to a new stored version
-->
## 將現有物件升級到新的儲存版本     {#upgrade-existing-objects-to-a-new-stored-version} 

<!--
When deprecating versions and dropping support, devise a storage upgrade
procedure.
-->
棄用版本並刪除其支援時，請設計儲存升級過程。

<!--
*Option 1:* Use the Storage Version Migrator

1.  Run the [storage Version migrator](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2.  Remove the old version from the CustomResourceDefinition `status.storedVersions` field.
-->

*選項 1：* 使用儲存版本遷移程式（Storage Version Migrator）

1. 執行[儲存版本遷移程式](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2. 從 CustomResourceDefinition 的 `status.storedVersions` 欄位中去掉
   老的版本。

<!--
*Option 2:* Manually upgrade the existing objects to a new stored version

The following is an example procedure to upgrade from `v1beta1` to `v1`.
-->
*選項 2：* 手動將現有物件升級到新的儲存版本

以下是從 `v1beta1` 升級到 `v1` 的示例過程。

<!--
1.  Set `v1` as the storage in the CustomResourceDefinition file and apply it
    using kubectl. The `storedVersions` is now `v1beta1, v1`.
2.  Write an upgrade procedure to list all existing objects and write them with
    the same content. This forces the backend to write objects in the current
    storage version, which is `v1`.
3.  Remove `v1beta1` from the CustomResourceDefinition `status.storedVersions` field.
-->
1.  在 CustomResourceDefinition 檔案中將 `v1` 設定為儲存版本，並使用 kubectl 應用它。
    `storedVersions`現在是`v1beta1, v1`。
2.  編寫升級過程以列出所有現有物件並使用相同內容將其寫回儲存。
    這會強制後端使用當前儲存版本（即 `v1`）寫入物件。
3.  從 CustomResourceDefinition  的 `status.storedVersions` 欄位中刪除 `v1beta1`。

<!--
The `kubectl` tool currently cannot be used to edit or patch the `status` subresource on a CRD: see the [Kubectl Subresource Support KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cli/2590-kubectl-subresource) for more details.

The easier way to patch the status subresource from the CLI is directly interacting with the API server using the `curl` tool, in this example:
-->
{{< note >}}
`kubectl` 工具目前不能用於編輯或修補 CRD 上的 `status` 子資源：請參閱
[kubectl Subresource Support KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cli/2590-kubectl-subresource)
瞭解更多細節。

從 CLI 給 `status` 子資源打補丁的更簡單的方法是使用 `curl` 工具直接與 API 伺服器互動，示例:
```bash
kubectl proxy &
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/<your CRD name here>/status \
  --data '[{"op": "replace", "path": "/status/storedVersions", "value":["v1"]}]'
```
{{< /note >}}