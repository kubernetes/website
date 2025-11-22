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
[CustomResourceDefinitions](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.
-->
本頁介紹如何添加版本資訊到
[CustomResourceDefinitions](/zh-cn/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/)。
目的是標明 CustomResourceDefinitions 的穩定級別或者服務於 API 升級。
API 升級時需要在不同 API 表示形式之間進行轉換。
本頁還描述如何將對象從一個版本升級到另一個版本。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You should have an initial understanding of [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
你應該對[定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)有一些初步瞭解。

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
## 概覽   {#overview}

CustomResourceDefinition API 提供了引入和升級 CustomResourceDefinition 新版本所用的工作流程。

創建 CustomResourceDefinition 時，會在 CustomResourceDefinition `spec.versions`
列表設置適當的穩定級別和版本號。例如，`v1beta1` 表示第一個版本尚未穩定。
所有定製資源對象將首先用這個版本保存。

創建 CustomResourceDefinition 後，客戶端可以開始使用 `v1beta1` API。

稍後可能需要添加新版本，例如 `v1`。

<!--
Adding a new version:

1. Pick a conversion strategy. Since custom resource objects need the ability to
   be served at both versions, that means they will sometimes be served in a
   different version than the one stored. To make this possible, the custom resource objects must sometimes be converted between the
   version they are stored at and the version they are served at. If the
   conversion involves schema changes and requires custom logic, a conversion
   webhook should be used. If there are no schema changes, the default `None`
   conversion strategy may be used and only the `apiVersion` field will be
   modified when serving different versions.
1. If using conversion webhooks, create and deploy the conversion webhook. See
   the [Webhook conversion](#webhook-conversion) for more details.
1. Update the CustomResourceDefinition to include the new version in the
   `spec.versions` list with `served:true`.  Also, set `spec.conversion` field
   to the selected conversion strategy. If using a conversion webhook, configure
   `spec.conversion.webhookClientConfig` field to call the webhook.
-->
添加新版本：

1. 選擇一種轉化策略。由於定製資源對象需要能夠兩種版本都可用，
   這意味着它們有時會以與儲存版本不同的版本來提供服務。爲了能夠做到這一點，
   有時必須在它們儲存的版本和提供的版本之間進行轉換。如果轉換涉及模式變更，
   並且需要自定義邏輯，則應該使用 Webhook 來完成。如果沒有模式變更，
   則可使用預設的 `None` 轉換策略，爲不同版本提供服務時只有 `apiVersion` 字段會被改變。
2. 如果使用轉換 Webhook，請創建並部署轉換 Webhook。更多詳細資訊請參見
   [Webhook 轉換](#webhook-conversion)。
3. 更新 CustomResourceDefinition，將新版本設置爲 `served：true`，加入到
   `spec.versions` 列表。另外，還要設置 `spec.conversion` 字段爲所選的轉換策略。
   如果使用轉換 Webhook，請設定 `spec.conversion.webhookClientConfig` 來調用 Webhook。

<!--
Once the new version is added, clients may incrementally migrate to the new
version. It is perfectly safe for some clients to use the old version while
others use the new version.

Migrate stored objects to the new version:
-->
添加新版本後，客戶端可以逐步遷移到新版本。
讓某些客戶使用舊版本的同時支持其他人使用新版本是相當安全的。

將儲存的對象遷移到新版本：

<!--
1. See the [upgrade existing objects to a new stored version](#upgrade-existing-objects-to-a-new-stored-version) section.

It is safe for clients to use both the old and new version before, during and
after upgrading the objects to a new stored version.
-->

1. 請參閱[將現有對象升級到新的儲存版本](#upgrade-existing-objects-to-a-new-stored-version)節。

   對於客戶來說，在將對象升級到新的儲存版本之前、期間和之後使用舊版本和新版本都是安全的。

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
   可以查看 kube-apiserver 的日誌以識別仍通過舊版本進行訪問的所有客戶端。
1. 在 `spec.versions` 列表中將舊版本的 `served` 設置爲 `false`。
   如果仍有客戶端意外地使用舊版本，他們可能開始會報告採用舊版本嘗試訪問定製資源的錯誤消息。
   如果發生這種情況，請將舊版本的 `served：true` 恢復，然後遷移餘下的客戶端使用新版本，然後重複此步驟。
1. 確保已完成[將現有對象升級到新儲存版本](#upgrade-existing-objects-to-a-new-stored-version)的步驟。
   1. 在 CustomResourceDefinition 的 `spec.versions` 列表中，確認新版本的
      `storage` 已被設置爲 `true`。
   2. 確認舊版本不在 CustomResourceDefinition `status.storedVersions` 中。
1. 從 CustomResourceDefinition `spec.versions` 列表中刪除舊版本。
1. 在轉換 Webhooks 中放棄對舊版本的轉換支持。

<!--
## Specify multiple versions

The CustomResourceDefinition API `versions` field can be used to support multiple versions of custom resources that you
have developed. Versions can have different schemas, and conversion webhooks can convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) for a set of useful gotchas and suggestions.
-->
## 指定多個版本  {#specify-multiple-versions}

CustomResourceDefinition API 的 `versions` 字段可用於支持你所開發的定製資源的多個版本。
版本可以具有不同的模式，並且轉換 Webhook 可以在多個版本之間轉換定製資源。
在適當的情況下，Webhook 轉換應遵循
[Kubernetes API 約定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)。
具體來說，請查閱
[API 變更文檔](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
以獲取一些有用的問題和建議。

{{< note >}}
<!--
In `apiextensions.k8s.io/v1beta1`, there was a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
-->
在 `apiextensions.k8s.io/v1beta1` 版本中曾經有一個 `version` 字段，
名字不叫做 `versions`。該 `version` 字段已經被廢棄，成爲可選項。
不過如果該字段不是空，則必須與 `versions` 字段中的第一個條目匹配。
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
  # name 必須匹配後面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以通過 served 標誌啓用或禁止
    served: true
    # 有且只能有一個 version 必須被標記爲存儲版本
    storage: true
    # schema 是必需字段
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
  # conversion 節是 Kubernetes 1.13+ 版本引入的，其默認值爲無轉換，即 strategy 子字段設置爲 None。
  conversion:
    # None 轉換假定所有版本採用相同的模式定義，僅僅將定製資源的 apiVersion 設置爲合適的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令行接口和顯示時作爲其別名
    singular: crontab
    # kind 通常是駝峯編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令行接口中使用更短的字符串來匹配你的資源
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
  # name 必須匹配後面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以通過 served 標誌啓用或禁止
    served: true
    # 有且只能有一個 version 必須被標記爲存儲版本
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
  # conversion 節是 Kubernetes 1.13+ 版本引入的，其默認值爲無轉換，即 strategy 子字段設置爲 None。
  conversion:
    # None 轉換假定所有版本採用相同的模式定義，僅僅將定製資源的 apiVersion 設置爲合適的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名稱的單數形式，用於在命令行接口和顯示時作爲其別名
    singular: crontab
    # kind 通常是大駝峯編碼（PascalCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令行接口中使用更短的字符串來匹配你的資源
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
`kubectl apply` 來創建它。

```shell
kubectl apply -f my-versioned-crontab.yaml
```

<!--
After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.
-->
在創建之後，API 伺服器開始在 HTTP REST 端點上爲每個已啓用的版本提供服務。
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
### 版本優先級   {#version-priority}

不考慮 CustomResourceDefinition 中版本被定義的順序，kubectl
使用具有最高優先級的版本作爲訪問對象的預設版本。
優先級是通過解析 **name** 字段來確定版本號、穩定性（GA、Beta 或 Alpha）
以及該穩定性級別內的序列。

<!--
The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:
-->
用於對版本進行排序的算法在設計上與 Kubernetes 項目對 Kubernetes 版本進行排序的方式相同。
版本以 `v` 開頭跟一個數字，一個可選的 `beta` 或者 `alpha` 和一個可選的附加數字作爲版本資訊。
從廣義上講，版本字符串可能看起來像 `v2` 或者 `v2beta1`。
使用以下算法對版本進行排序：

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
- 對於遵循 Kubernetes 版本模式的條目，版本字符串的數字部分從最大到最小排序。
- 如果第一個數字後面有字符串 `beta` 或 `alpha`，它們首先按去掉 `beta` 或
  `alpha` 之後的版本號排序（相當於 GA 版本），之後按 `beta` 先、`alpha` 後的順序排序，
- 如果 `beta` 或 `alpha` 之後還有另一個數字，那麼也會針對這些數字從大到小排序。
- 不符合上述格式的字符串按字母順序排序，數字部分不經過特殊處理。
  請注意，在下面的示例中，`foo1` 排在 `foo10` 之前。
  這與遵循 Kubernetes 版本模式的條目的數字部分排序不同。

<!--
This might make sense if you look at the following sorted version list:
-->
如果查看以下版本排序列表，這些規則就容易懂了：

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
對於[指定多個版本](#specify-multiple-versions)中的示例，版本排序順序爲
`v1`，後跟着 `v1beta1`。
這導致了 kubectl 命令使用 `v1` 作爲預設版本，除非所提供的對象指定了版本。

<!--
### Version deprecation
-->
### 版本廢棄   {#version-deprecation}

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

<!--
Starting in v1.19, a CustomResourceDefinition can indicate a particular version of the resource it defines is deprecated.
When API requests to a deprecated version of that resource are made, a warning message is returned in the API response as a header.
The warning message for each deprecated version of the resource can be customized if desired.
-->
從 v1.19 開始，CustomResourceDefinition 可以指示其定義的資源的特定版本已廢棄。
當該資源的已廢棄版本發出 API 請求時，會在 API 響應中以報頭的形式返回警告消息。
如果需要，可以自定義每個不推薦使用的資源版本的警告消息。

<!--
A customized warning message should indicate the deprecated API group, version, and kind,
and should indicate what API group, version, and kind should be used instead, if applicable.
-->
定製的警告消息應該標明廢棄的 API 組、版本和類別（kind），
並且應該標明應該使用（如果有的話）哪個 API 組、版本和類別作爲替代。

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
    storage: false
    # 此屬性標明此定製資源的 v1alpha1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告消息頭。
    deprecated: true
    # 此屬性設置用來覆蓋返回給發送 v1alpha1 API 請求的客戶端的默認警告信息。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
    schema: ...
  - name: v1beta1
    served: true
    # 此屬性標明該定製資源的 v1beta1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告消息頭。
    # 針對此版本的請求所返回的是默認的警告消息。
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
    storage: false
    # 此屬性標明此定製資源的 v1alpha1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告消息頭。
    deprecated: true
    # 此屬性設置用來覆蓋返回給發送 v1alpha1 API 請求的客戶端的默認警告信息。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # 此屬性標明該定製資源的 v1beta1 版本已被棄用。
    # 發給此版本的 API 請求會在伺服器響應中收到警告消息頭。
    # 針對此版本的請求所返回的是默認的警告消息。
    deprecated: true
  - name: v1
    served: true
    storage: true
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Version removal

An older API version cannot be dropped from a CustomResourceDefinition manifest until existing stored data has been migrated to the newer API version for all clusters that served the older version of the custom resource, and the old version is removed from the `status.storedVersions` of the CustomResourceDefinition.
-->
### 版本刪除   {#version-removal}

在爲所有提供舊版本自定義資源的叢集將現有儲存資料遷移到新 API 版本，並且從 CustomResourceDefinition 的
`status.storedVersions` 中刪除舊版本之前，無法從 CustomResourceDefinition 清單檔案中刪除舊 API 版本。

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
  - name: v1beta1
    # 此屬性標明該自定義資源的 v1beta1 版本已不再提供。
    # 發給此版本的 API 請求會在伺服器響應中收到未找到的錯誤。
    served: false
    schema: ...
  - name: v1
    served: true
    # 新提供的版本應該設置爲存儲版本。
    storage: true
    schema: ...
```

<!--
## Webhook conversion
-->
## Webhook 轉換   {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
<!--
Webhook conversion is available as beta since 1.15, and as alpha since Kubernetes 1.13. The
`CustomResourceWebhookConversion` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
Webhook 轉換在 Kubernetes 1.13 版本作爲 Alpha 功能引入，在 Kubernetes 1.15 版本中成爲 Beta 功能。
要使用此功能，應啓用 `CustomResourceWebhookConversion` 特性。
在大多數叢集上，這類 Beta 特性應該是自動啓用的。
請參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)文檔以獲得更多資訊。
{{< /note >}}

<!--
The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:
-->
上面的例子在版本之間有一個 None 轉換，它只在轉換時設置 `apiVersion` 字段而不改變對象的其餘部分。
API 伺服器還支持在需要轉換時調用外部服務的 webhook 轉換。例如：

<!--
* custom resource is requested in a different version than stored version.
* Watch is created in one version but the changed object is stored in another version.
* custom resource PUT request is in a different version than storage version.
-->
* 定製資源的請求版本與其儲存版本不同。
* 使用某版本創建了 Watch 請求，但所更改對象以另一版本儲存。
* 定製資源的 PUT 請求所針對版本與儲存版本不同。

<!--
To cover all of these cases and to optimize conversion by the API server,
the conversion requests may contain multiple objects in order to minimize the external calls.
The webhook should perform these conversions independently.
-->
爲了涵蓋所有這些情況並優化 API 伺服器所作的轉換，轉換請求可以包含多個對象，
以便減少外部調用。Webhook 應該獨立執行各個轉換。

<!--
### Write a conversion webhook server

Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions.
Most of the common code are located in the
[framework file](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go)
that leaves only
[one function](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80)
to be implemented for different conversions.
-->
### 編寫一個轉換 Webhook 伺服器   {#write-a-conversion-webhook-server}

請參考[定製資源轉換 Webhook 伺服器](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go)的實現；
該實現在 Kubernetes e2e 測試中得到驗證。
Webhook 處理由 API 伺服器發送的 `ConversionReview` 請求，並在
`ConversionResponse` 中封裝發回轉換結果。
請注意，請求包含需要獨立轉換的定製資源列表，這些對象在被轉換之後不能改變其在列表中的順序。
該示例伺服器的組織方式使其可以複用於其他轉換。大多數常見代碼都位於
[framework 檔案](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go)中，
只留下[一個函數](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80)用於實現不同的轉換。

{{< note >}}
<!--
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
-->
轉換 Webhook 伺服器示例中將 `ClientAuth`
字段設置爲[空](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48)，
預設爲 `NoClientCert`。
這意味着 webhook 伺服器沒有驗證客戶端（也就是 API 伺服器）的身份。
如果你需要雙向 TLS 或者其他方式來驗證客戶端，
請參閱如何[驗證 API 服務](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)。
{{< /note >}}

<!--
#### Permissible mutations

A conversion webhook must not mutate anything inside of `metadata` of the converted object
other than `labels` and `annotations`.
Attempted changes to `name`, `UID` and `namespace` are rejected and fail the request
which caused the conversion. All other changes are ignored.
-->
#### 被允許的變更

轉換 Webhook 不可以更改被轉換對象的 `metadata` 中除 `labels` 和 `annotations`
之外的任何屬性。
嘗試更改 `name`、`UID` 和 `namespace` 時都會導致引起轉換的請求失敗。
所有其他變更都被忽略。

<!--
### Deploy the conversion webhook service

Documentation for deploying the conversion webhook is the same as for the
[admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service).
The assumption for next sections is that the conversion webhook server is deployed to a service
named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.
-->
### 部署轉換 Webhook 服務   {#deploy-the-conversion-webhook-service}

用於部署轉換 Webhook
的文檔與[准入 Webhook 服務示例](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service)相同。
這裏的假設是轉換 Webhook 伺服器被部署爲 `default` 名字空間中名爲
`example-conversion-webhook-server` 的服務，並在路徑 `/crdconvert`
上處理請求。

{{< note >}}
<!--
When the webhook server is deployed into the Kubernetes cluster as a
service, it has to be exposed via a service on port 443 (The server
itself can have an arbitrary port but the service object should map it to port 443).
The communication between the API server and the webhook service may fail
if a different port is used for the service.
-->
當 Webhook 伺服器作爲一個服務被部署到 Kubernetes 叢集中時，它必須通過端口 443
公開其服務（伺服器本身可以使用任意端口，但是服務對象應該將它映射到端口 443）。
如果爲伺服器使用不同的端口，則 API 伺服器和 Webhook 伺服器之間的通信可能會失敗。
{{< /note >}}

<!--
### Configure CustomResourceDefinition to use conversion webhooks

The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:
-->
### 設定 CustomResourceDefinition 以使用轉換 Webhook   {#configure-crd-to-use-conversion-webhooks}

通過修改 `spec` 中的 `conversion` 部分，可以擴展 `None` 轉換示例來使用轉換 Webhook。

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name 必須匹配後面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以通過 served 標誌啓用或禁止
    served: true
    # 有且只能有一個 version 必須被標記爲存儲版本
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
    # Webhook strategy 告訴 API 伺服器調用外部 Webhook 來完成定製資源之間的轉換
    strategy: Webhook
    # 當 strategy 爲 "Webhook" 時，webhook 屬性是必需的，該屬性配置將被 API 伺服器調用的 Webhook 端點
    webhook:
      # conversionReviewVersions 標明 Webhook 所能理解或偏好使用的
      # ConversionReview 對象版本。
      # API 伺服器所能理解的列表中的第一個版本會被髮送到 Webhook
      # Webhook 必須按所接收到的版本響應一個 ConversionReview 對象
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
    # 名稱的單數形式，用於在命令行接口和顯示時作爲其別名
    singular: crontab
    # kind 通常是駝峯編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令行接口中使用更短的字符串來匹配你的資源
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
  # name 必須匹配後面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 組名，用於 REST API: /apis/<group>/<version>
  group: example.com
  # 裁剪掉下面的 OpenAPI 模式中未曾定義的對象字段
  preserveUnknownFields: false
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每個 version 可以通過 served 標誌啓用或禁止
    served: true
    # 有且只能有一個 version 必須被標記爲存儲版本
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
    # Webhook strategy 告訴 API 伺服器調用外部 Webhook 來完成定製資源
    strategy: Webhook
    # 當 strategy 爲 "Webhook" 時，webhookClientConfig 屬性是必需的
    # 該屬性配置將被 API 伺服器調用的 Webhook 端點
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
    # 名稱的單數形式，用於在命令行接口和顯示時作爲其別名
    singular: crontab
    # kind 通常是駝峯編碼（CamelCased）的單數形式，用於資源清單中
    kind: CronTab
    # shortNames 允許你在命令行接口中使用更短的字符串來匹配你的資源
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to apply it.
-->
你可以將 CustomResourceDefinition 保存在 YAML 檔案中，然後使用
`kubectl apply` 來應用它。

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

<!--
Make sure the conversion service is up and running before applying new changes.
-->
在應用新更改之前，請確保轉換伺服器已啓動並正在運行。

<!--
### Contacting the webhook

Once the API server has determined a request should be sent to a conversion webhook,
it needs to know how to contact the webhook. This is specified in the `webhookClientConfig`
stanza of the webhook configuration.

Conversion webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
### 調用 Webhook   {#contacting-the-webhook}

API 伺服器一旦確定請求應發送到轉換 Webhook，它需要知道如何調用 Webhook。
這是在 `webhookClientConfig` 中指定的 Webhook 設定。

轉換 Webhook 可以通過 URL 或服務引用來調用，並且可以選擇包含自定義 CA 包，
以用於驗證 TLS 連接。

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
`url` 以標準 URL 形式給出 Webhook 的位置（`scheme://host:port/path`）。
`host` 不應引用叢集中運行的服務，而應通過指定 `service` 字段來提供服務引用。
在某些 API 伺服器中，`host` 可以通過外部 DNS 進行解析（即
`kube-apiserver` 無法解析叢集內 DNS，那樣會違反分層規則）。
`host` 也可以是 IP 地址。

請注意，除非你非常小心地在所有運行着可能調用 Webhook 的 API 伺服器的主機上運行此 Webhook，
否則將 `localhost` 或 `127.0.0.1` 用作 `host` 是風險很大的。
這樣的安裝可能是不可移植的，或者不容易在一個新的叢集中運行。
<!--
The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth (for example "user:password@") is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a conversion webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
HTTP 協議必須爲 `https`；URL 必須以 `https://` 開頭。

嘗試使用使用者或基本身份驗證（例如，使用 `user:password@`）是不允許的。
URL 片段（`#...`）和查詢參數（`?...`）也是不允許的。

下面是爲調用 URL 來執行轉換 Webhook 的示例，其中期望使用系統信任根來驗證
TLS 證書，因此未指定 caBundle：

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
### 服務引用   {#service-reference}

`webhookClientConfig` 內部的 `service` 段是對轉換 Webhook 服務的引用。
如果 Webhook 在叢集中運行，則應使用 `service` 而不是 `url`。
服務的名字空間和名稱是必需的。端口是可選的，預設爲 443。
路徑是可選的，預設爲`/`。

下面設定中，服務設定爲在端口 `1234`、子路徑 `/my-path` 上被調用。
例子中針對 ServerName `my-service-name.my-service-namespace.svc`，
使用自定義 CA 包驗證 TLS 連接。

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
## Webhook 請求和響應   {#webhook-request-and-response}

### 請求   {#request}

向 Webhook 發起請求的動詞是 POST，請求的 `Content-Type` 爲 `application/json`。
請求的主題爲 JSON 序列化形式的
apiextensions.k8s.io API 組的 ConversionReview API 對象。

Webhook 可以在其 CustomResourceDefinition 中使用 `conversionReviewVersions`
字段設置它們接受的 `ConversionReview` 對象的版本：

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
創建 `apiextensions.k8s.io/v1` 版本的自定義資源定義時，
`conversionReviewVersions` 是必填字段。
Webhook 要求支持至少一個 `ConversionReview` 當前和以前的 API 伺服器可以理解的版本。

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
創建 apiextensions.k8s.io/v1beta1 定製資源定義時若未指定
`conversionReviewVersions`，則預設值爲 v1beta1。

{{% /tab %}}
{{< /tabs >}}

<!--
API servers send the first `ConversionReview` version in the `conversionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the custom resource definition will not be allowed to be created.
If an API server encounters a conversion webhook configuration that was previously created and does not support any of the `ConversionReview`
versions the API server knows how to send, attempts to call to the webhook will fail.
-->
API 伺服器將 `conversionReviewVersions` 列表中他們所支持的第一個
`ConversionReview` 資源版本發送給 Webhook。
如果列表中的版本都不被 API 伺服器支持，則無法創建自定義資源定義。
如果某 API 伺服器遇到之前創建的轉換 Webhook 設定，並且該設定不支持
API 伺服器知道如何發送的任何 `ConversionReview` 版本，調用 Webhook
的嘗試會失敗。

<!--
This example shows the data contained in an `ConversionReview` object
for a request to convert `CronTab` objects to `example.com/v1`:
-->
下面的示例顯示了包含在 `ConversionReview` 對象中的資料，
該請求意在將 `CronTab` 對象轉換爲 `example.com/v1`：

<!--
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # Random uid uniquely identifying this conversion call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # The API group and version the objects should be converted to
    "desiredAPIVersion": "example.com/v1",
    
    # The list of objects to convert.
    # May contain one or more objects, in one or more versions.
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
-->
{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # 用來唯一標識此轉換調用的隨機 UID
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # 對象要轉換到的目標 API 組和版本
    "desiredAPIVersion": "example.com/v1",
    
    # 要轉換的對象列表，其中可能包含一個或多個對象，版本可能相同也可能不同
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
{{% /tab %}}
<!--
```yaml
{
  # Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # Random uid uniquely identifying this conversion call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # The API group and version the objects should be converted to
    "desiredAPIVersion": "example.com/v1",
    
    # The list of objects to convert.
    # May contain one or more objects, in one or more versions.
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
-->
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中已廢棄以推薦使用 apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # 用來唯一標識此轉換調用的隨機 UID
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # 對象要轉換到的目標 API 組和版本
    "desiredAPIVersion": "example.com/v1",
    
    # 要轉換的對象列表，其中可能包含一個或多個對象，版本可能相同也可能不同
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
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
* `convertedObjects`, containing all of the objects from `request.objects`, converted to `request.desiredAPIVersion`

Example of a minimal successful response from a webhook:
-->
### 響應   {#response}

Webhook 響應包含 200 HTTP 狀態代碼、`Content-Type: application/json`，
在主體中包含 JSON 序列化形式的資料，在 `response` 節中給出
`ConversionReview` 對象（與發送的版本相同）。

如果轉換成功，則 Webhook 應該返回包含以下字段的 `response` 節：

* `uid`，從發送到 webhook 的 `request.uid` 複製而來
* `result`，設置爲 `{"status":"Success"}}`
* `convertedObjects`，包含來自 `request.objects` 的所有對象，均已轉換爲
  `request.desiredAPIVersion`

Webhook 的最簡單成功響應示例：

<!--
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # must match <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # Objects must match the order of request.objects, and have apiVersion set to <request.desiredAPIVersion>.
    # kind, metadata.uid, metadata.name, and metadata.namespace fields must not be changed by the webhook.
    # metadata.labels and metadata.annotations fields may be changed by the webhook.
    # All other changes to metadata fields by the webhook are ignored.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
-->
{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # 必須與 <request.uid> 匹配
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # 這裏的對象必須與 request.objects 中的對象順序相同並且其 apiVersion 被設置爲 <request.desiredAPIVersion>。
    # kind、metadata.uid、metadata.name 和 metadata.namespace 等字段都不可被 Webhook 修改。
    # Webhook 可以更改 metadata.labels 和 metadata.annotations 字段值。
    # Webhook 對 metadata 中其他字段的更改都會被忽略
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
<!--
```yaml
{
  # Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # must match <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # Objects must match the order of request.objects, and have apiVersion set to <request.desiredAPIVersion>.
    # kind, metadata.uid, metadata.name, and metadata.namespace fields must not be changed by the webhook.
    # metadata.labels and metadata.annotations fields may be changed by the webhook.
    # All other changes to metadata fields by the webhook are ignored.
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
-->
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中已棄用以推薦使用  apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # 必須與 <request.uid> 匹配
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # 這裏的對象必須與 request.objects 中的對象順序相同並且其 apiVersion 被設置爲 <request.desiredAPIVersion>。
    # kind、metadata.uid、metadata.name 和 metadata.namespace 等字段都不可被 Webhook 修改。
    # Webhook 可以更改 metadata.labels 和 metadata.annotations 字段值。
    # Webhook 對 metadata 中其他字段的更改都會被忽略。
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
If conversion fails, a webhook should return a `response` stanza containing the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `result`, set to `{"status":"Failed"}`
-->
如果轉換失敗，則 Webhook 應該返回包含以下字段的 `response` 節：

* `uid`，從發送到 Webhook 的 `request.uid` 複製而來
* `result`，設置爲 `{"status": "Failed"}`

{{< warning >}}
<!--
Failing conversion can disrupt read and write access to the custom resources,
including the ability to update or delete the resources. Conversion failures
should be avoided whenever possible, and should not be used to enforce validation
 constraints (use validation schemas or webhook admission instead).
-->
轉換失敗會破壞對定製資源的讀寫訪問，包括更新或刪除資源的能力。
轉換失敗應儘可能避免，並且不可用於實施合法性檢查約束
（應改用驗證模式或 Webhook 准入插件）。
{{< /warning >}}

<!--
Example of a response from a webhook indicating a conversion request failed, with an optional message:
-->
來自 Webhook 的響應示例，指示轉換請求失敗，並帶有可選消息：

{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中棄用以推薦使用 apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Writing, reading, and updating versioned CustomResourceDefinition objects
-->
## 編寫、讀取和更新版本化的 CustomResourceDefinition 對象   {#write-read-and-update-versioned-crd-objects}

<!--
When an object is written, it is stored at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.
-->
寫入對象時，將儲存爲寫入時指定的儲存版本。如果儲存版本發生變化，
現有對象永遠不會被自動轉換。然而，新創建或被更新的對象將以新的儲存版本寫入。
對象寫入的版本不再被支持是有可能的。

<!--
When you read an object, you specify the version as part of the path.
You can request an object at any version that is currently served.
If you specify a version that is different from the object's stored version,
Kubernetes returns the object to you at the version you requested, but the
stored object is not changed on disk.
-->
當讀取對象時，你需要在路徑中指定版本。
你可以請求當前提供的任意版本的對象。
如果所指定的版本與對象的儲存版本不同，Kubernetes 會按所請求的版本將對象返回，
但磁盤上儲存的對象不會更改。

<!--
What happens to the object that is being returned while serving the read
request depends on what is specified in the CRD's `spec.conversion`:
-->
在爲讀取請求提供服務時正返回的對象會發生什麼取決於 CRD 的 `spec.conversion` 中指定的內容：

<!--
- if the default `strategy` value `None` is specified, the only modifications
  to the object are changing the `apiVersion` string and perhaps [pruning
  unknown fields](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning)
  (depending on the configuration). Note that this is unlikely to lead to good
  results if the schemas differ between the storage and requested version.
  In particular, you should not use this strategy if the same data is
  represented in different fields between versions.
- if [webhook conversion](#webhook-conversion) is specified, then this
  mechanism controls the conversion.
-->
- 如果所指定的 `strategy` 值是預設的 `None`，則針對對象的唯一修改是更改其 `apiVersion` 字符串，
  並且可能[修剪未知字段](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning)（取決於設定）。
  請注意，如果儲存和請求版本之間的模式不同，這不太可能導致好的結果。
  尤其是如果在相同的資料類不同版本中採用不同字段來表示時，不應使用此策略。
- 如果指定了 [Webhook 轉換](#webhook-conversion)，則此機制將控制轉換。

<!--
If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.
-->
如果你更新一個現有對象，它將以當前的儲存版本被重寫。
這是可以將對象從一個版本改到另一個版本的唯一辦法。

<!--
To illustrate this, consider the following hypothetical series of events:
-->
爲了說明這一點，請考慮以下假設的一系列事件：

<!--
1. The storage version is `v1beta1`. You create an object. It is stored at version `v1beta1`
2. You add version `v1` to your CustomResourceDefinition and designate it as
   the storage version. Here the schemas for `v1` and `v1beta1` are identical,
   which is typically the case when promoting an API to stable in the
   Kubernetes ecosystem.
3. You read your object at version `v1beta1`, then you read the object again at
   version `v1`. Both returned objects are identical except for the apiVersion
   field.
4. You create a new object. It is stored at version `v1`. You now
   have two objects, one of which is at `v1beta1`, and the other of which is at
   `v1`.
5. You update the first object. It is now stored at version `v1` since that
   is the current storage version.
-->
1. 儲存版本是 `v1beta1`。你創建一個對象。該對象以版本 `v1beta1` 儲存。
2. 你將爲 CustomResourceDefinition 添加版本 `v1`，並將其指定爲儲存版本。
   此處 `v1` 和 `v1beta1` 的模式是相同的，這通常是在 Kubernetes 生態系統中將 API 提升爲穩定版時的情況。
3. 你使用版本 `v1beta1` 來讀取你的對象，然後你再次用版本 `v1` 讀取對象。
   除了 apiVersion 字段之外，返回的兩個對象是完全相同的。
4. 你創建一個新對象。該對象儲存爲版本 `v1`。
   你現在有兩個對象，其中一個是 `v1beta1`，另一個是 `v1`。
5. 你更新第一個對象。該對象現在以版本 `v1` 保存，因爲 `v1` 是當前的儲存版本。

<!--
### Previous storage versions
-->
### 以前的儲存版本   {#previous-storage-versions}

<!--
The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been stored
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.
-->
API 伺服器在狀態字段 `storedVersions` 中記錄曾被標記爲儲存版本的每個版本。
對象可能以任何曾被指定爲儲存版本的版本保存。
儲存中不會出現從未成爲儲存版本的版本的對象。

<!--
## Upgrade existing objects to a new stored version
-->
## 將現有對象升級到新的儲存版本     {#upgrade-existing-objects-to-a-new-stored-version}

<!--
When deprecating versions and dropping support, select a storage upgrade
procedure.
-->
棄用版本並刪除其支持時，請選擇儲存升級過程。

<!--
*Option 1:* Use the Storage Version Migrator

1. Run the [storage Version migrator](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2. Remove the old version from the CustomResourceDefinition `status.storedVersions` field.
-->

**選項 1：** 使用儲存版本遷移程式（Storage Version Migrator）

1. 運行[儲存版本遷移程式](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2. 從 CustomResourceDefinition 的 `status.storedVersions` 字段中去掉老的版本。

<!--
*Option 2:* Manually upgrade the existing objects to a new stored version

The following is an example procedure to upgrade from `v1beta1` to `v1`.
-->
**選項 2：** 手動將現有對象升級到新的儲存版本

以下是從 `v1beta1` 升級到 `v1` 的示例過程。

<!--
1. Set `v1` as the storage in the CustomResourceDefinition file and apply it
   using kubectl. The `storedVersions` is now `v1beta1, v1`.
2. Write an upgrade procedure to list all existing objects and write them with
   the same content. This forces the backend to write objects in the current
   storage version, which is `v1`.
3. Remove `v1beta1` from the CustomResourceDefinition `status.storedVersions` field.
-->
1. 在 CustomResourceDefinition 檔案中將 `v1` 設置爲儲存版本，並使用 kubectl 應用它。
   `storedVersions`現在是 `v1beta1, v1`。
2. 編寫升級過程以列出所有現有對象並使用相同內容將其寫回儲存。
   這會強制後端使用當前儲存版本（即 `v1`）寫入對象。
3. 從 CustomResourceDefinition 的 `status.storedVersions` 字段中刪除 `v1beta1`。

{{< note >}}

<!--
Here is an example of how to patch the `status` subresource for a CRD object using `kubectl`:
-->
以下是如何使用 `kubectl` 爲一個 CRD 對象修補 `status` 子資源的示例：

```bash
kubectl patch customresourcedefinitions <CRD_Name> --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1"]}}'
```
{{< /note >}}
