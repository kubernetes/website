---
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition 表示應在 API 伺服器上公開的資源。"
title: "CustomResourceDefinition"
weight: 1
---
<!--
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition represents a resource that should be exposed on the API server."
title: "CustomResourceDefinition"
weight: 1
auto_generated: true
-->

`apiVersion: apiextensions.k8s.io/v1`

`import "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"`

## CustomResourceDefinition {#CustomResourceDefinition}

<!--
CustomResourceDefinition represents a resource that should be exposed on the API server.  Its name MUST be in the format \<.spec.name>.\<.spec.group>.
-->
CustomResourceDefinition 表示應在 API 伺服器上公開的資源。其名稱必須採用 `<.spec.name>.<.spec.group>` 格式。

<hr>

- **apiVersion**：apiextensions.k8s.io/v1

- **kind**：CustomResourceDefinition

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據，更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionSpec" >}}">CustomResourceDefinitionSpec</a>)，<!--required-->必需
  <!--
  spec describes how the user wants the resources to appear
  -->
  spec 描述了使用者希望資源的呈現方式。

- **status** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionStatus" >}}">CustomResourceDefinitionStatus</a>)
  <!--
  status indicates the actual state of the CustomResourceDefinition
  -->
  status 表示 CustomResourceDefinition 的實際狀態。

## CustomResourceDefinitionSpec {#CustomResourceDefinitionSpec}

<!--
CustomResourceDefinitionSpec describes how a user wants their resource to appear
-->
CustomResourceDefinitionSpec 描述了使用者希望資源的呈現方式。

<hr>

<!--
- **group** (string), required

  group is the API group of the defined custom resource. The custom resources are served under `/apis/\<group>/...`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`).
-->
- **group** (string)，必需

  group 是自定義資源的 API 組。自定義資源在 `/apis/<group>/...` 下提供。
  必須與 CustomResourceDefinition 的名稱匹配（格式爲 `<names.plural>.<group>`）。

<!--
- **names** (CustomResourceDefinitionNames), required

  names specify the resource and kind names for the custom resource.
-->

- **names** (CustomResourceDefinitionNames)，必需

  names 表示自定義資源的資源和種類名稱。

  <a name="CustomResourceDefinitionNames"></a>
  <!--
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **names.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.
  -->
  **CustomResourceDefinitionNames 表示提供此 CustomResourceDefinition 資源的名稱。**

  - **names.kind** (string)，必需

    kind 是資源的序列化類型。它通常是駝峯命名的單數形式。自定義資源實例將使用此值作爲 API 調用中的 `kind` 屬性。

  <!--
  - **names.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.
  -->

  - **names.plural** (string)，必需

    plural 是所提供的資源的複數名稱，自定義資源在 `/apis/<group>/<version>/.../<plural>` 下提供。
    必須與 CustomResourceDefinition 的名稱匹配（格式爲 `<names.plural>.<group>`）。必須全部小寫。

  - **names.categories** ([]string)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

    <!--
    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.
    -->

    categories 是自定義資源所屬的分組資源列表（例如 'all'）。
    它在 API 發現文檔中發佈，並支持客戶端像 `kubectl get all` 這樣的調用。

  - **names.listKind** (string)

    <!--
    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".
    -->

    listKind 是此資源列表的序列化類型。默認爲 "`kind`List"。

  - **names.shortNames** ([]string)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

    <!--
    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.
    -->

    shortNames 是資源的短名稱，在 API 發現文檔中公開，並支持客戶端調用，如
    `kubectl get <shortname>`。必須全部小寫。

  - **names.singular** (string)

    <!--
    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.
    -->

    singular 是資源的單數名稱。必須全部小寫。默認爲小寫 `kind`。

<!--  
- **scope** (string), required

  scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`.
-->

- **scope** (string)，必需

  scope 表示自定義資源是叢集作用域還是命名空間作用域。允許的值爲 `Cluster` 和 `Namespaced`。

<!--
- **versions** ([]CustomResourceDefinitionVersion), required

  *Atomic: will be replaced during a merge*

  versions is the list of all API versions of the defined custom resource. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.
-->

- **versions** ([]CustomResourceDefinitionVersion)，必需

  **原子：將在合併期間被替換**

  versions 是自定義資源的所有 API 版本的列表。版本名稱用於計算服務版本在 API 發現中列出的順序。
  如果版本字符串與 Kubernetes 的版本號形式類似，則它將被排序在非 Kubernetes 形式版本字符串之前。
  Kubernetes 的版本號字符串按字典順序排列。Kubernetes 版本號以 “v” 字符開頭，
  後面是一個數字（主版本），然後是可選字符串 “alpha” 或 “beta” 和另一個數字（次要版本）。
  它們首先按 GA > beta > alpha 排序（其中 GA 是沒有 beta 或 alpha 等後綴的版本），然後比較主要版本，
  最後是比較次要版本。版本排序列表示例：v10、v2、v1、v11beta2、v10beta3、v3beta1、v12alpha1、v11alpha2、foo1、foo10。

  <a name="CustomResourceDefinitionVersion"></a>
  <!--
  *CustomResourceDefinitionVersion describes a version for CRD.*

  - **versions.name** (string), required

    name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/\<group>/\<version>/...` if `served` is true.
  -->
  **CustomResourceDefinitionVersion 描述 CRD 的一個版本。**

  - **versions.name** (string)，必需

    name 是版本名稱，例如 “v1”、“v2beta1” 等。如果 `served` 是 true，自定義資源在
    `/apis/<group>/<version>/...` 版本下提供。

  <!--
  - **versions.served** (boolean), required

    served is a flag enabling/disabling this version from being served via REST APIs
  -->

  - **versions.served** (boolean)，必需

    served 是用於啓用/禁用該版本通過 REST API 提供服務的標誌。

  <!--
  - **versions.storage** (boolean), required

    storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.
  -->

  - **versions.storage** (boolean)，必需

    storage 表示在將自定義資源持久保存到存儲時，應使用此版本。有且僅有一個版本的 storage=true。

  - **versions.additionalPrinterColumns** ([]CustomResourceColumnDefinition)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

    <!--
    additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used.
    -->

    additionalPrinterColumns 表示在表輸出中返回的附加列。
    有關詳細信息，請參閱 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#receiving-resources-as-tables。
    如果沒有指定列，則顯示自定義資源存活時間（AGE）列。

    <a name="CustomResourceColumnDefinition"></a>
    <!--
    *CustomResourceColumnDefinition specifies a column for server side printing.*

    - **versions.additionalPrinterColumns.jsonPath** (string), required

      jsonPath is a simple JSON path (i.e. with array notation) which is evaluated against each custom resource to produce the value for this column.
    -->

    **CustomResourceColumnDefinition 指定用於伺服器端打印的列。**

    - **versions.additionalPrinterColumns.jsonPath** (string)，必需

      jsonPath 是一個簡單的 JSON 路徑（使用數組表示法），它對每個自定義資源進行評估，以生成該列的值。

    <!--
    - **versions.additionalPrinterColumns.name** (string), required

      name is a human readable name for the column.
    -->

    - **versions.additionalPrinterColumns.name** (string)，必需

      name 是便於閱讀的列名稱。

    <!--
    - **versions.additionalPrinterColumns.type** (string), required

      type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.
    -->

    - **versions.additionalPrinterColumns.type** (string)，必需

      type 是此列的 OpenAPI 類型定義。有關詳細信息，
      請參閱 https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types

    - **versions.additionalPrinterColumns.description** (string)

      <!--
      description is a human readable description of this column.
      -->

      description 是該列的可讀性描述。

    - **versions.additionalPrinterColumns.format** (string)

      <!--
      format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.
      -->

      format 是這個列的可選 OpenAPI 類型定義。'name' 格式應用於主標識符列，以幫助客戶端識別列是資源名稱。
      有關詳細信息，請參閱 https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types。

    - **versions.additionalPrinterColumns.priority** (int32)

      <!--
      priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a priority greater than 0.
      -->

      priority 是一個定義此列相對於其他列的相對重要性的整數。數字越低，優先級越高。
      在空間有限的情況下，可以省略的列的優先級應大於 0。

  - **versions.deprecated** (boolean)

    <!--
    deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false.
    -->

    deprecated 表示此版本的自定義資源 API 已棄用。設置爲 true 時，對此版本的 API
    請求會在伺服器響應頭信息中帶有警告（warning）信息。此值默認爲 false。

  - **versions.deprecationWarning** (string)

    <!--
    deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists.
    -->

    deprecationWarning 會覆蓋返回給 API 客戶端的默認警告。只能在 `deprecated` 爲 true 時設置。
    默認警告表示此版本已棄用，建議使用最新的同等或更高穩定性版本（如果存在）。

  - **versions.schema** (CustomResourceValidation)

    <!--
    schema describes the schema used for validation, pruning, and defaulting of this version of the custom resource.
    -->

    schema 描述了用於驗證、精簡和默認此版本的自定義資源的模式。

    <a name="CustomResourceValidation"></a>
    <!--
    *CustomResourceValidation is a list of validation methods for CustomResources.*
    -->

    **CustomResourceValidation 是 CustomResources 的驗證方法列表。**

    - **versions.schema.openAPIV3Schema** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

      <!--
      openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning.
      -->

      openAPIV3Schema 是用於驗證和精簡的 OpenAPI v3 模式。

  - **versions.selectableFields** ([]SelectableField)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

    <!--
    selectableFields specifies paths to fields that may be used as field selectors. A maximum of 8 selectable fields are allowed. See https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors
    -->

    selectableFields 指定可用作字段選擇器的字段路徑，最多允許 8 個可選字段。
    請參閱：https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/field-selectors
  
    <a name="SelectableField"></a>
    
    <!--
    *SelectableField specifies the JSON path of a field that may be used with field selectors.*
    -->
  
    **SelectableField 指定可與字段選擇器一起使用的字段的 JSON 路徑。**

  - **versions.selectableFields.jsonPath** (string), required

    <!--
    jsonPath is a simple JSON path which is evaluated against each custom resource to produce a field selector value. Only JSON paths without the array notation are allowed. Must point to a field of type string, boolean or integer. Types with enum values and strings with formats are allowed. If jsonPath refers to absent field in a resource, the jsonPath evaluates to an empty string. Must not point to metadata fields. Required.
    -->

    jsonPath 是一個簡單的 JSON 路徑，它會根據每個自定義資源進行求值以生成字段選擇器值。
    只允許使用不帶數組符號的 JSON 路徑。必須指向字符串、布爾值或整數類型的字段。
    允許使用枚舉值類型和帶格式的字符串。如果 jsonPath 引用資源中不存在的字段，則 jsonPath
    的求值結果爲空字符串。不得指向元數據字段。必需。
  
  - **versions.subresources** (CustomResourceSubresources)

    <!--
    subresources specify what subresources this version of the defined custom resource have.
    -->

    subresources 指定此版本已定義的自定義資源具有哪些子資源。

    <a name="CustomResourceSubresources"></a>
    <!--
    *CustomResourceSubresources defines the status and scale subresources for CustomResources.*
    -->

    **CustomResourceSubresources 定義了 CustomResources 子資源的狀態和規模。**  

    - **versions.subresources.scale** (CustomResourceSubresourceScale)

      <!--
      scale indicates the custom resource should serve a `/scale` subresource that returns an `autoscaling/v1` Scale object.
      -->

      scale 表示自定義資源應該提供一個 `/scale` 子資源，該子資源返回一個 `autoscaling/v1` Scale 對象。

      <a name="CustomResourceSubresourceScale"></a>
      <!--
      *CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources.*

      - **versions.subresources.scale.specReplicasPath** (string), required

        specReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `spec.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.spec`. If there is no value under the given path in the custom resource, the `/scale` subresource will return an error on GET.
      -->

      **CustomResourceSubresourceScale 定義瞭如何爲 CustomResources 的 scale 子資源提供服務。**

      - **versions.subresources.scale.specReplicasPath** (string)，必需

        specReplicasPath 定義對應於 Scale 的自定義資源內的 JSON 路徑 `spec.replicas`。
        只允許沒有數組表示法的 JSON 路徑。必須是 `.spec` 下的 JSON 路徑。
        如果自定義資源中的給定路徑下沒有值，那麼 GET `/scale` 子資源將返回錯誤。

      <!--
      - **versions.subresources.scale.statusReplicasPath** (string), required

        statusReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `status.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status`. If there is no value under the given path in the custom resource, the `status.replicas` value in the `/scale` subresource will default to 0.
      -->

      - **versions.subresources.scale.statusReplicasPath** (string)，必需

        statusReplicasPath 定義對應於 Scale 的自定義資源內的 JSON 路徑 `status.replicas`。
        只允許不帶數組表示法的 JSON 路徑。必須是 `.status` 下的 JSON 路徑。
        如果自定義資源中給定路徑下沒有值，則 `/scale` 子資源中的 `status.replicas` 值將默認爲 0。

      - **versions.subresources.scale.labelSelectorPath** (string)

        <!--
        labelSelectorPath defines the JSON path inside of a custom resource that corresponds to Scale `status.selector`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status` or `.spec`. Must be set to work with HorizontalPodAutoscaler. The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form. More info: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource If there is no value under the given path in the custom resource, the `status.selector` value in the `/scale` subresource will default to the empty string.
        -->

        labelSelectorPath 定義對應於 Scale 的自定義資源內的 JSON 路徑 `status.selector`。
        只允許不帶數組表示法的 JSON 路徑。必須是 `.status` 或 `.spec` 下的路徑。
        必須設置爲與 HorizontalPodAutoscaler 一起使用。
        此 JSON 路徑指向的字段必須是字符串字段（不是複雜的選擇器結構），其中包含字符串形式的序列化標籤選擇器。
        更多信息： https://kubernetes.io/zh-cn/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource。
        如果自定義資源中給定路徑下沒有值，則 `/scale` 子資源中的 `status.selector` 默認值爲空字符串。

    - **versions.subresources.status** (CustomResourceSubresourceStatus)

      <!--
      status indicates the custom resource should serve a `/status` subresource. When enabled: 1. requests to the custom resource primary endpoint ignore changes to the `status` stanza of the object. 2. requests to the custom resource `/status` subresource ignore changes to anything other than the `status` stanza of the object.
      -->

      status 表示自定義資源應該爲 `/status` 子資源服務。當啓用時：

      1. 對自定義資源主端點的請求會忽略對對象 `status` 節的改變；
      2. 對自定義資源 `/status` 子資源的請求忽略對對象 `status` 節以外的任何變化。

      <a name="CustomResourceSubresourceStatus"></a>
      <!--
      *CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza*
      -->

      CustomResourceSubresourceStatus 定義瞭如何爲自定義資源提供 status 子資源。
      狀態由 CustomResource 中的 `.status` JSON 路徑表示。設置後，

      * 爲自定義資源提供一個 `/status` 子資源。
      * 向 `/status` 子資源發出的 PUT 請求時，需要提供自定義資源對象，伺服器端會忽略對 status 節以外的任何內容更改。
      * 對自定義資源的 PUT/POST/PATCH 請求會忽略對 status 節的更改。

- **conversion** (CustomResourceConversion)

  <!--
  conversion defines conversion settings for the CRD.
  -->
  conversion 定義了 CRD 的轉換設置。

  <a name="CustomResourceConversion"></a>
  <!--
  *CustomResourceConversion describes how to convert different versions of a CR.*

  - **conversion.strategy** (string), required

    strategy specifies how custom resources are converted between versions. Allowed values are: - `"None"`: The converter only change the apiVersion and would not touch any other field in the custom resource. - `"Webhook"`: API Server will call to an external webhook to do the conversion. Additional information
      is needed for this option. This requires spec.preserveUnknownFields to be false, and spec.conversion.webhook to be set.
  -->

  **CustomResourceConversion 描述瞭如何轉換不同版本的自定義資源。**

  - **conversion.strategy** (string)，必需

    strategy 指定如何在版本之間轉換自定義資源。允許的值爲：

    - `"None"`：轉換器僅更改 apiVersion 並且不會觸及自定義資源中的任何其他字段。
    - `"Webhook"`：API 伺服器將調用外部 Webhook 進行轉換。此選項需要其他信息。這要求
      spec.preserveUnknownFields 爲 false，並且設置 spec.conversion.webhook。

  - **conversion.webhook** (WebhookConversion)

    <!--
    webhook describes how to call the conversion webhook. Required when `strategy` is set to `"Webhook"`.
    -->

    webhook 描述瞭如何調用轉換 Webhook。當 `strategy` 設置爲 `"Webhook"` 時有效。

    <a name="WebhookConversion"></a>
    <!--
    *WebhookConversion describes how to call a conversion webhook*

    *Atomic: will be replaced during a merge*
    
    - **conversion.webhook.conversionReviewVersions** ([]string), required

      conversionReviewVersions is an ordered list of preferred `ConversionReview` versions the Webhook expects. The API server will use the first version in the list which it supports. If none of the versions specified in this list are supported by API server, conversion will fail for the custom resource. If a persisted Webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail.
    -->

    **WebhookConversion 描述瞭如何調用轉換 Webhook**

    **原子：將在合併期間被替換**

    - **conversion.webhook.conversionReviewVersions** ([]string)，必需

      conversionReviewVersions 是 Webhook 期望的 `ConversionReview` 版本的有序列表。
      API 伺服器將使用它支持的列表中的第一個版本。如果 API 伺服器不支持此列表中指定的版本，則自定義資源的轉換將失敗。
      如果持久化的 Webhook 設定指定了允許的版本但其中不包括 API 伺服器所瞭解的任何版本，則對 Webhook 的調用將失敗。

    - **conversion.webhook.clientConfig** (WebhookClientConfig)

      <!--
      clientConfig is the instructions for how to call the webhook if strategy is `Webhook`.
      -->

      如果 strategy 是 `Webhook`，那麼 clientConfig 是關於如何調用 Webhook 的說明。

      <a name="WebhookClientConfig"></a>
      <!--
      *WebhookClientConfig contains the information to make a TLS connection with the webhook.*
      -->

      **WebhookClientConfig 包含與 Webhook 建立 TLS 連接的信息。**

      - **conversion.webhook.clientConfig.caBundle** ([]byte)

        <!--
        caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.
        -->

        caBundle 是一個 PEM 編碼的 CA 包，用於驗證 Webhook 伺服器的服務證書。
        如果未指定，則使用 API 伺服器上的系統根證書。

      - **conversion.webhook.clientConfig.service** (ServiceReference)

        <!--
        service is a reference to the service for this webhook. Either service or url must be specified.
        
        If the webhook is running within the cluster, then you should use `service`.
        -->

        service 是對此 Webhook 服務的引用。必須指定 service 或 url 字段之一。

        如果在叢集中運行 Webhook，那麼你應該使用 `service`。

        <a name="ServiceReference"></a>
        <!--
        *ServiceReference holds a reference to Service.legacy.k8s.io*

        - **conversion.webhook.clientConfig.service.name** (string), required

          name is the name of the service. Required
        -->

        **ServiceReference 保存對 Service.legacy.k8s.io 的一個引用。**

        - **conversion.webhook.clientConfig.service.name** (string)，必需

          name 是服務的名稱。必需。

        <!--
        - **conversion.webhook.clientConfig.service.namespace** (string), required

          namespace is the namespace of the service. Required
        -->

        - **conversion.webhook.clientConfig.service.namespace** (string)，必需

          namespace 是服務的命名空間。必需。

        - **conversion.webhook.clientConfig.service.path** (string)

          <!--
          path is an optional URL path at which the webhook will be contacted.
          -->

          path 是一個可選的 URL 路徑，Webhook 將通過該路徑聯繫服務。

        - **conversion.webhook.clientConfig.service.port** (int32)

          <!--
          port is an optional service port at which the webhook will be contacted. `port` should be a valid port number (1-65535, inclusive). Defaults to 443 for backward compatibility.
          -->

          port 是 Webhook 聯繫的可選服務端口。`port` 應該是一個有效的端口號（1-65535，包含）。
          爲實現向後兼容，默認端口號爲 443。

      - **conversion.webhook.clientConfig.url** (string)

        <!--
        url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
        -->

        url 以標準 URL 的形式（`scheme://host:port/path`）給出 Webhook 的位置。`url` 或 `service` 必須指定一個且只能指定一個。

        <!--
        The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
        -->

        `host` 不應引用叢集中運行的服務；若使用叢集內服務應改爲使用 `service` 字段。
        host 值可能會通過外部 DNS 解析（例如，`kube-apiserver` 無法解析叢集內 DNS，因爲這將違反分層規則）。
        `host` 也可能是 IP 地址。

        <!--
        Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
        -->

        請注意，使用 `localhost` 或 `127.0.0.1` 作爲 `host` 是有風險的，
        除非你非常小心地在所有運行 API 伺服器的主機上運行這個 Webhook，因爲這些 API 伺服器可能需要調用這個 Webhook。
        這樣的安裝可能是不可移植的，也就是說，不容易在一個新的叢集中復現。

        <!--
        The scheme must be "https"; the URL must begin with "https://".
        
        A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
        
        Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either.
        -->

        scheme 必須是 "https"；URL 必須以 "https://" 開頭。

        路徑（path）是可選的，如果存在，則可以是 URL 中允許的任何字符串。
        你可以使用路徑傳遞一個任意字符串給 Webhook，例如，一個叢集標識符。

        不允許使用使用者或基本認證，例如 "user:password@"，是不允許的。片段（"#..."）和查詢參數（"?..."）也是不允許的。

- **preserveUnknownFields** (boolean)

  <!--
  preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. This field is deprecated in favor of setting `x-preserve-unknown-fields` to true in `spec.versions[*].schema.openAPIV3Schema`. See https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning for details.
  -->

  preserveUnknownFields 表示將對象寫入持久性存儲時應保留 OpenAPI 模式中未規定的對象字段。
  apiVersion、kind、元數據（metadata）和元數據中的已知字段始終保留。不推薦使用此字段，而建議在
  `spec.versions[*].schema.openAPIV3Schema` 中設置 `x-preserve-unknown-fields` 爲 true。
  更多詳細信息參見：
  https://kubernetes.io/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning

## JSONSchemaProps {#JSONSchemaProps}

<!--
JSONSchemaProps is a JSON-Schema following Specification Draft 4 (http://json-schema.org/).
-->
JSONSchemaProps 是JSON 模式（JSON-Schema），遵循其規範草案第 4 版（http://json-schema.org/）。

<hr>

- **$ref** (string)

- **$schema** (string)

- **additionalItems** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  <!--
  *JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.*
  -->
  **JSONSchemaPropsOrBool 表示 JSONSchemaProps 或布爾值。布爾屬性默認爲 true。**

- **additionalProperties** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  <!--
  *JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.*
  -->
  **JSONSchemaPropsOrBool 表示 JSONSchemaProps 或布爾值。布爾屬性默認爲 true。**

- **allOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

- **anyOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

    <!--
    *Atomic: will be replaced during a merge*
    -->

    **原子：將在合併期間被替換**

- **default** (JSON)

  <!--
  default is a default value for undefined object fields. Defaulting is a beta feature under the CustomResourceDefaulting feature gate. Defaulting requires spec.preserveUnknownFields to be false.
  -->
  default 是未定義對象字段的默認值。設置默認值操作是 CustomResourceDefaulting 特性門控所控制的一個 Beta 特性。
  應用默認值設置時要求 spec.preserveUnknownFields 爲 false。

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下類型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **definitions** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **dependencies** (map[string]JSONSchemaPropsOrStringArray)

  <a name="JSONSchemaPropsOrStringArray"></a>
  <!--
  *JSONSchemaPropsOrStringArray represents a JSONSchemaProps or a string array.*
  -->
  **JSONSchemaPropsOrStringArray 表示 JSONSchemaProps 或字符串數組。**

- **description** (string)

- **enum** ([]JSON)

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子：將在合併期間被替換**

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下類型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **example** (JSON)

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下類型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **exclusiveMaximum** (boolean)

- **exclusiveMinimum** (boolean)

- **externalDocs** (ExternalDocumentation)

  <a name="ExternalDocumentation"></a>
  <!--
  *ExternalDocumentation allows referencing an external resource for extended documentation.*
  -->
  **ExternalDocumentation 允許引用外部資源作爲擴展文檔。**

  - **externalDocs.description** (string)

  - **externalDocs.url** (string)

- **format** (string)

  <!--
  format is an OpenAPI v3 format string. Unknown formats are ignored. The following formats are validated:

  - bsonobjectid: a bson object ID, i.e. a 24 characters hex string - uri: an URI as parsed by Golang net/url.ParseRequestURI - email: an email address as parsed by Golang net/mail.ParseAddress - hostname: a valid representation for an Internet host name, as defined by RFC 1034, section 3.1 [RFC1034]. - ipv4: an IPv4 IP as parsed by Golang net.ParseIP - ipv6: an IPv6 IP as parsed by Golang net.ParseIP - cidr: a CIDR as parsed by Golang net.ParseCIDR - mac: a MAC address as parsed by Golang net.ParseMAC - uuid: an UUID that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid3: an UUID3 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid4: an UUID4 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - uuid5: an UUID5 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - isbn: an ISBN10 or ISBN13 number string like "0321751043" or "978-0321751041" - isbn10: an ISBN10 number string like "0321751043" - isbn13: an ISBN13 number string like "978-0321751041" - creditcard: a credit card number defined by the regex ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$ with any non digit characters mixed in - ssn: a U.S. social security number following the regex ^\\d{3}[- ]?\\d{2}[- ]?\\d{4}$ - hexcolor: an hexadecimal color code like "#FFFFFF: following the regex ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$ - rgbcolor: an RGB color code like rgb like "rgb(255,255,2559" - byte: base64 encoded binary data - password: any kind of string - date: a date string like "2006-01-02" as defined by full-date in RFC3339 - duration: a duration string like "22 ns" as parsed by Golang time.ParseDuration or compatible with Scala duration format - datetime: a date time string like "2014-12-15T19:30:20.000Z" as defined by date-time in RFC3339.
  -->
  format 是 OpenAPI v3 格式字符串。未知格式將被忽略。以下格式會被驗證合法性：

  - bsonobjectid：一個 bson 對象的 ID，即一個 24 個字符的十六進制字符串
  - uri：由 Go 語言 net/url.ParseRequestURI 解析得到的 URI
  - email：由 Go 語言 net/mail.ParseAddress 解析得到的電子郵件地址
  - hostname：互聯網主機名的有效表示，由 RFC 1034 第 3.1 節 [RFC1034] 定義
  - ipv4：由 Go 語言 net.ParseIP 解析得到的 IPv4 協議的 IP
  - ipv6：由 Go 語言 net.ParseIP 解析得到的 IPv6 協議的 IP
  - cidr：由 Go 語言 net.ParseCIDR 解析得到的 CIDR
  - mac：由 Go 語言 net.ParseMAC 解析得到的一個 MAC 地址
  - uuid：UUID，允許大寫字母，滿足正則表達式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$
  - uuid3：UUID3，允許大寫字母，滿足正則表達式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$
  - uuid4：UUID4，允許大寫字母，滿足正則表達式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$
  - uuid5：UUID5，允許大寫字母，滿足正則表達式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$
  - isbn：一個 ISBN10 或 ISBN13 數字字符串，如 "0321751043" 或 "978-0321751041"
  - isbn10：一個 ISBN10 數字字符串，如 "0321751043"
  - isbn13：一個 ISBN13 號碼字符串，如 "978-0321751041"
  - creditcard：信用卡號碼，滿足正則表達式
    ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$，
    其中混合任意非數字字符
  - ssn：美國社會安全號碼，滿足正則表達式 ^\d{3}[- ]?\d{2}[- ]?\d{4}$
  - hexcolor：一個十六進制的顏色編碼，如 "#FFFFFF"，滿足正則表達式 ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$
  - rgbcolor：一個 RGB 顏色編碼 例如 "rgb(255,255,255)"
  - byte：base64 編碼的二進制數據
  - password：任何類型的字符串
  - date：類似 "2006-01-02" 的日期字符串，由 RFC3339 中的完整日期定義
  - duration：由 Go 語言 time.ParseDuration 解析的持續時長字符串，如 "22 ns"，或與 Scala 持續時間格式兼容。
  - datetime：一個日期時間字符串，如 "2014-12-15T19:30:20.000Z"，由 RFC3339 中的 date-time 定義。

- **id** (string)

- **items** (JSONSchemaPropsOrArray)

  <a name="JSONSchemaPropsOrArray"></a>
  <!--
  *JSONSchemaPropsOrArray represents a value that can either be a JSONSchemaProps or an array of JSONSchemaProps. Mainly here for serialization purposes.*
  -->
  **JSONSchemaPropsOrArray 表示可以是 JSONSchemaProps 或 JSONSchemaProps 數組的值。這裏目的主要用於序列化。**

- **maxItems** (int64)

- **maxLength** (int64)

- **maxProperties** (int64)

- **maximum** (double)

- **minItems** (int64)

- **minLength** (int64)

- **minProperties** (int64)

- **minimum** (double)

- **multipleOf** (double)

- **not** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **nullable** (boolean)

- **oneOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子：將在合併期間被替換**

- **pattern** (string)

- **patternProperties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **properties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **required** ([]string)

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子：將在合併期間被替換**

- **title** (string)

- **type** (string)

- **uniqueItems** (boolean)

- **x-kubernetes-embedded-resource** (boolean)

  <!--
  x-kubernetes-embedded-resource defines that the value is an embedded Kubernetes runtime.Object, with TypeMeta and ObjectMeta. The type must be object. It is allowed to further restrict the embedded object. kind, apiVersion and metadata are validated automatically. x-kubernetes-preserve-unknown-fields is allowed to be true, but does not have to be if the object is fully specified (up to kind, apiVersion, metadata).
  -->
  x-kubernetes-embedded-resource 定義該值是一個嵌入式 Kubernetes runtime.Object，具有 TypeMeta 和 ObjectMeta。
  類型必須是對象。允許進一步限制嵌入對象。會自動驗證 kind、apiVersion 和 metadata 等字段值。
  x-kubernetes-preserve-unknown-fields 允許爲 true，但如果對象已完全指定
  （除 kind、apiVersion、metadata 之外），則不必爲 true。

- **x-kubernetes-int-or-string** (boolean)

  <!--
  x-kubernetes-int-or-string specifies that this value is either an integer or a string. If this is true, an empty type is allowed and type as child of anyOf is permitted if following one of the following patterns:
  -->
  x-kubernetes-int-or-string 指定此值是整數或字符串。如果爲 true，則允許使用空類型，
  並且如果遵循以下模式之一，則允許作爲 anyOf 的子類型：

  1) anyOf:
     - type: integer
     - type: string
  2) allOf:
     - anyOf:
       - type: integer
       - type: string
     <!--
     - ... zero or more
     -->

     - （可以有選擇地包含其他類型）

- **x-kubernetes-list-map-keys** ([]string)

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子：將在合併期間被替換**

  <!--
  x-kubernetes-list-map-keys annotates an array with the x-kubernetes-list-type `map` by specifying the keys used as the index of the map.

  This tag MUST only be used on lists that have the "x-kubernetes-list-type" extension set to "map". Also, the values specified for this attribute must be a scalar typed field of the child structure (no nesting is supported).

  The properties specified must either be required or have a default value, to ensure those properties are present for all list items.
  -->
  X-kubernetes-list-map-keys 通過指定用作 map 索引的鍵來使用 x-kubernetes-list-type `map` 註解數組。

  這個標籤必須只用於 "x-kubernetes-list-type" 擴展設置爲 "map" 的列表。
  而且，爲這個屬性指定的值必須是子結構的標量類型的字段（不支持嵌套）。

  指定的屬性必須是必需的或具有默認值，以確保所有列表項都存在這些屬性。

- **x-kubernetes-list-type** (string)

  <!--
  x-kubernetes-list-type annotates an array to further describe its topology. This extension must only be used on lists and may have 3 possible values:
  -->
  x-kubernetes-list-type 註解一個數組以進一步描述其拓撲。此擴展名只能用於列表，並且可能有 3 個可能的值：

  <!--
  1) `atomic`: the list is treated as a single entity, like a scalar.
       Atomic lists will be entirely replaced when updated. This extension
       may be used on any type of list (struct, scalar, ...).
  2) `set`:
       Sets are lists that must not have multiple items with the same value. Each
       value must be a scalar, an object with x-kubernetes-map-type `atomic` or an
       array with x-kubernetes-list-type `atomic`.
  3) `map`:
       These lists are like maps in that their elements have a non-index key
       used to identify them. Order is preserved upon merge. The map tag
       must only be used on a list with elements of type object.
  Defaults to atomic for arrays.
  -->

  1. `atomic`：
        列表被視爲單個實體，就像標量一樣。原子列表在更新時將被完全替換。這個擴展可以用於任何類型的列表（結構，標量，…）。
  2. `set`：
        set 是不能有多個具有相同值的列表。每個值必須是標量、具有 x-kubernetes-map-type
        `atomic` 的對象或具有 x-kubernetes-list-type `atomic` 的數組。
  3. `map`：
     這些列表類似於映射表，因爲它們的元素具有用於標識它們的非索引鍵。合併時保留順序。
     map 標記只能用於元數類型爲 object 的列表。
  數組默認爲原子數組。

- **x-kubernetes-map-type** (string)

  <!--
  x-kubernetes-map-type annotates an object to further describe its topology. This extension must only be used when type is object and may have 2 possible values:
  -->
  x-kubernetes-map-type 註解一個對象以進一步描述其拓撲。此擴展只能在 type 爲 object 時使用，並且可能有 2 個可能的值：

  <!--
  1) `granular`:
       These maps are actual maps (key-value pairs) and each fields are independent
       from each other (they can each be manipulated by separate actors). This is
       the default behaviour for all maps.
  2) `atomic`: the list is treated as a single entity, like a scalar.
       Atomic maps will be entirely replaced when updated.
  -->

  1) `granular`：
        這些 map 是真實的映射（鍵值對），每個字段都是相互獨立的（它們都可以由不同的角色來操作）。
        這是所有 map 的默認行爲。
  2) `atomic`：map 被視爲單個實體，就像標量一樣。原子 map 更新後將被完全替換。

- **x-kubernetes-preserve-unknown-fields** (boolean)

  <!--
  x-kubernetes-preserve-unknown-fields stops the API server decoding step from pruning fields which are not specified in the validation schema. This affects fields recursively, but switches back to normal pruning behaviour if nested properties or additionalProperties are specified in the schema. This can either be true or undefined. False is forbidden.
  -->

  x-kubernetes-preserve-unknown-fields 針對未在驗證模式中指定的字段，禁止 API 伺服器的解碼步驟剪除這些字段。
  這一設置對字段的影響是遞歸的，但在模式中指定了嵌套 properties 或 additionalProperties 時，會切換回正常的字段剪除行爲。
  該值可爲 true 或 undefined，不能爲 false。

- **x-kubernetes-validations** ([]ValidationRule)

  <!--
  *Patch strategy: merge on key `rule`*

  *Map: unique values on key rule will be kept during a merge*

  x-kubernetes-validations describes a list of validation rules written in the CEL expression language.
  -->

  **補丁策略：基於鍵 `rule` 合併**

  **Map：合併時將保留 rule 鍵的唯一值**

  x-kubernetes-validations 描述了用 CEL 表達式語言編寫的驗證規則列表。此字段是 Alpha 級別。

  <a name="ValidationRule"></a>
  <!--
  *ValidationRule describes a validation rule written in the CEL expression language.*

  - **x-kubernetes-validations.rule** (string), required
  -->

  **ValidationRule 描述用 CEL 表達式語言編寫的驗證規則。**

  - **x-kubernetes-validations.rule** (string)，必需

    <!--
    Rule represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec.
    The Rule is scoped to the location of the x-kubernetes-validations extension in the schema.
    The `self` variable in the CEL expression is bound to the scoped value.
    Example: - Rule scoped to the root of a resource with a status subresource: {"rule": "self.status.actual \<= self.spec.maxDesired"}
    -->

    rule 表示將由 CEL 評估的表達式。參考： https://github.com/google/cel-spec。
    rule 的作用域爲模式中的 x-kubernetes-validation 擴展所在的位置。CEL 表達式中的 `self` 與作用域值綁定。
    例子：rule 的作用域是一個具有狀態子資源的資源根：{"rule": "self.status.actual \<= self.spec.maxDesired"}。

    <!--
    If the Rule is scoped to an object with properties, the accessible properties of the object are field selectable via `self.field` and field presence can be checked via `has(self.field)`. Null valued fields are treated as absent fields in CEL expressions. If the Rule is scoped to an object with additionalProperties (i.e. a map) the value of the map are accessible via `self[mapKey]`, map containment can be checked via `mapKey in self` and all entries of the map are accessible via CEL macros and functions such as `self.all(...)`. If the Rule is scoped to an array, the elements of the array are accessible via `self[i]` and also by macros and functions. If the Rule is scoped to a scalar, `self` is bound to the scalar value. Examples: - Rule scoped to a map of objects: {"rule": "self.components['Widget'].priority \< 10"} - Rule scoped to a list of integers: {"rule": "self.values.all(value, value >= 0 && value \< 100)"} - Rule scoped to a string value: {"rule": "self.startsWith('kube')"}
    -->

    如果 rule 的作用域是一個帶有屬性的對象，那麼該對象的可訪問屬性是通過 `self` 進行字段選擇的，
    並且可以通過 `has(self.field)` 來檢查字段是否存在。在 CEL 表達式中，Null 字段被視爲不存在的字段。
    如果該 rule 的作用域是一個帶有附加屬性的對象（例如一個 map），那麼該 map 的值可以通過
    `self[mapKey]`來訪問，map 是否包含某主鍵可以通過 `mapKey in self` 來檢查。
    map 中的所有條目都可以通過 CEL 宏和函數（如 `self.all(...)`）訪問。
    如果 rule 的作用域是一個數組，數組的元素可以通過 `self[i]` 訪問，也可以通過宏和函數訪問。
    如果 rule 的作用域爲標量，`self` 綁定到標量值。舉例：

    - rule 作用域爲對象映射：{"rule": "self.components['Widget'].priority \< 10"}
    - rule 作用域爲整數列表：{"rule": "self.values.all(value, value >= 0 && value \< 100)"}
    - rule 作用域爲字符串值：{"rule": "self.startsWith('kube')"}

    <!--
    The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object and from any x-kubernetes-embedded-resource annotated objects. No other metadata properties are accessible.
    -->

    `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName` 總是可以從對象的根和任何帶
    x-kubernetes-embedded-resource 註解的對象訪問。其他元數據屬性都無法訪問。

    <!--
    Unknown data preserved in custom resources via x-kubernetes-preserve-unknown-fields is not accessible in CEL expressions. This includes: - Unknown field values that are preserved by object schemas with x-kubernetes-preserve-unknown-fields. - Object properties where the property schema is of an "unknown type". An "unknown type" is recursively defined as:
      - A schema with no type and x-kubernetes-preserve-unknown-fields set to true
      - An array where the items schema is of an "unknown type"
      - An object where the additionalProperties schema is of an "unknown type"
    -->

    在 CEL 表達式中無法訪問通過 x-kubernetes-preserve-unknown-fields 保存在自定義資源中的未知數據。
    這包括：

    - 由包含 x-kubernetes-preserve-unknown-fields 的對象模式所保留的未知字段值；
    - 屬性模式爲 "未知類型" 的對象屬性。"未知類型" 遞歸定義爲：

      - 沒有設置 type 但 x-kubernetes-preserve-unknown-fields 設置爲 true 的模式。
      - 條目模式爲"未知類型"的數組。
      - additionalProperties 模式爲"未知類型"的對象。

    <!--
    Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - '__' escapes to '__underscores__' - '.' escapes to '__dot__' - '-' escapes to '__dash__' - '/' escapes to '__slash__' - Property names that exactly match a CEL RESERVED keyword escape to '__{keyword}__'. The keywords are:
        "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",
        "import", "let", "loop", "package", "namespace", "return".
    Examples:
      - Rule accessing a property named "namespace": {"rule": "self.__namespace__ > 0"}
      - Rule accessing a property named "x-prop": {"rule": "self.x__dash__prop > 0"}
      - Rule accessing a property named "redact__d": {"rule": "self.redact__underscores__d > 0"}
    -->

    只有名稱符合正則表達式 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的屬性纔可被訪問。
    在表達式中訪問屬性時，可訪問的屬性名稱根據以下規則進行轉義：

    - '__' 轉義爲 '__underscores__'
    - '.' 轉義爲 '__dot__'
    - '-' 轉義爲 '__dash__'
    - '/' 轉義爲 '__slash__'
    - 恰好匹配 CEL 保留關鍵字的屬性名稱轉義爲 '__{keyword}__' 。這裏的關鍵字具體包括：
        "true"，"false"，"null"，"in"，"as"，"break"，"const"，"continue"，"else"，"for"，"function"，"if"，
        "import"，"let"，"loop"，"package"，"namespace"，"return"。
    舉例：

      - 規則訪問名爲 "namespace" 的屬性：`{"rule": "self.__namespace__ > 0"}`
      - 規則訪問名爲 "x-prop" 的屬性：`{"rule": "self.x__dash__prop > 0"}`
      - 規則訪問名爲 "redact__d" 的屬性：`{"rule": "self.redact__underscores__d > 0"}`

    <!--
    Equality on arrays with x-kubernetes-list-type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:
    - 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
      non-intersecting elements in `Y` are appended, retaining their partial order.
    - 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
      are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
      non-intersecting keys are appended, retaining their partial order.
    -->

    對 x-kubernetes-list-type 爲 'set' 或 'map' 的數組進行比較時忽略元素順序，如：[1, 2] == [2, 1]。
    使用 x-kubernetes-list-type 對數組進行串接使用下列類型的語義：

    - 'set'：`X + Y` 執行合併，其中 `X` 保留所有元素的數組位置，並附加不相交的元素 `Y`，保留其局部順序。
    - 'map'：`X + Y` 執行合併，保留 `X` 中所有鍵的數組位置，但當 `X` 和 `Y` 的鍵集相交時，會被 `Y` 中的值覆蓋。
      添加 `Y` 中具有不相交鍵的元素，保持其局順序。

    <!--
    If `rule` makes use of the `oldSelf` variable it is implicitly a `transition rule`.

    By default, the `oldSelf` variable is the same type as `self`. When `optionalOldSelf` is true, the `oldSelf` variable is a CEL optional
     variable whose value() is the same type as `self`.
    See the documentation for the `optionalOldSelf` field for details.

    Transition rules by default are applied only on UPDATE requests and are skipped if an old value could not be found. You can opt a transition rule into unconditional evaluation by setting `optionalOldSelf` to true.
    -->

    如果 `rule` 使用 `oldSelf` 變量，則隱式地將其視爲一個 `轉換規則（transition rule）`。

    默認情況下，`oldSelf` 變量與 `self` 類型相同。當 `optionalOldSelf` 爲 `true` 時，`oldSelf`
    變量是 CEL 可選變量，其 `value()` 與 `self` 類型相同。
    有關詳細信息，請參閱 `optionalOldSelf` 字段的文檔。

    默認情況下，轉換規則僅適用於 UPDATE 請求，如果找不到舊值，則會跳過轉換規則。
    你可以通過將 `optionalOldSelf` 設置爲 `true` 來使轉換規則進行無條件求值。

  - **x-kubernetes-validations.fieldPath** (string)

    <!--
    fieldPath represents the field path returned when the validation fails. 
    It must be a relative JSON path (i.e. with array notation) scoped to the location of this
    x-kubernetes-validations extension in the schema and refer to an existing field.
    e.g. when validation checks if a specific attribute `foo` under a map `testMap`, the fieldPath could be set to `.testMap.foo`
    If the validation checks two lists must have unique attributes, the fieldPath could be set to either of the list: e.g. `.testList`
    It does not support list numeric index. It supports child operation to refer to an existing field currently.
    Refer to [JSONPath support in Kubernetes](https://kubernetes.io/docs/reference/kubectl/jsonpath/) for more info.
    Numeric index of array is not supported. For field name which contains special characters, use `['specialName']` to refer the field name.
    e.g. for attribute `foo.34$` appears in a list `testList`, the fieldPath could be set to `.testList['foo.34$']`
    -->

    fieldPath 表示驗證失敗時返回的字段路徑。
    它必須是相對 JSON 路徑（即，支持數組表示法），範圍僅限於此 x-kubernetes-validations
    擴展在模式的位置，並引用現有字段。
    例如，當驗證檢查 `testMap` 映射下是否有 `foo` 屬性時，可以將 fieldPath 設置爲 `.testMap.foo`。
    如果驗證需要確保兩個列表具有各不相同的屬性，則可以將 fieldPath 設置到其中任一列表，例如 `.testList`。
    它支持使用子操作引用現有字段，而不支持列表的數字索引。
    有關更多信息，請參閱 [Kubernetes 中的 JSONPath 支持](https://kubernetes.io/docs/reference/kubectl/jsonpath/)。
    因爲其不支持數組的數字索引，所以對於包含特殊字符的字段名稱，請使用 `['specialName']` 來引用字段名稱。
    例如，對於出現在列表 `testList` 中的屬性 `foo.34$`，fieldPath 可以設置爲 `.testList['foo.34$']`。

  - **x-kubernetes-validations.message** (string)

    <!--
    Message represents the message displayed when validation fails. The message is required if the Rule contains line breaks.
    The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host"
    -->

    message 表示驗證失敗時顯示的消息。如果規則包含換行符，則需要該消息。消息不能包含換行符。
    如果未設置，則消息爲 "failed rule: {Rule}"，如："must be a URL with the host matching spec.host"

  - **x-kubernetes-validations.messageExpression** (string)

    <!--
    MessageExpression declares a CEL expression that evaluates to the validation failure message that
    is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string.
    If both message and messageExpression are present on a rule, then messageExpression will be used if validation fails.
    If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is
    produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string
    with only spaces, or a string that contains line breaks, then the validation failure message will also be produced
    as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string
    with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the rule;
    the only difference is the return type. Example: "x must be less than max ("+string(self.max)+")"
    -->

    messageExpression 聲明一個 CEL 表達式，其計算結果是此規則失敗時返回的驗證失敗消息。
    由於 messageExpression 用作失敗消息，因此它的值必須是一個字符串。
    如果在規則中同時存在 message 和 messageExpression，則在驗證失敗時使用 messageExpression。
    如果是 messageExpression 出現運行時錯誤，則會記錄運行時錯誤，並生成驗證失敗消息，
    就好像未設置 messageExpression 字段一樣。如果 messageExpression 求值爲空字符串、
    只包含空格的字符串或包含換行符的字符串，則驗證失敗消息也將像未設置 messageExpression 字段一樣生成，
    並記錄 messageExpression 生成空字符串/只包含空格的字符串/包含換行符的字符串的事實。
    messageExpression 可以訪問的變量與規則相同；唯一的區別是返回類型。
    例如："x must be less than max ("+string(self.max)+")"。

  - **x-kubernetes-validations.optionalOldSelf** (boolean)

    <!--
    optionalOldSelf is used to opt a transition rule into evaluation even when the object is first created, or if the old object is missing the value.

    When enabled `oldSelf` will be a CEL optional whose value will be `None` if there is no old value, or when the object is initially created.

    You may check for presence of oldSelf using `oldSelf.hasValue()` and unwrap it after checking using `oldSelf.value()`. Check the CEL documentation for Optional types for more information: https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes

    May not be set unless `oldSelf` is used in `rule`.
    -->

    即使在對象首次創建時，或者舊對象無值時，也可以使用 `optionalOldSelf` 來使用轉換規則求值。

    當啓用了 `optionalOldSelf` 時，`oldSelf` 將是 CEL 可選項，如果沒有舊值或最初創建對象時，其值將爲 `None`。

    你可以使用 `oldSelf.hasValue()` 檢查 oldSelf 是否存在，並在檢查後使用 `oldSelf.value()` 將其解包。
    更多的信息可查看 CEL 文檔中的 Optional 類型：https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes

    除非在 `rule` 中使用了 `oldSelf`，否則不可以設置。

  - **x-kubernetes-validations.reason** (string)

    <!--
    reason provides a machine-readable validation failure reason that is returned to the caller
    when a request fails this validation rule. The HTTP status code returned to the caller will
    match the reason of the reason of the first failed validation rule.
    The currently supported reasons are: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired",
    "FieldValueDuplicate". If not set, default to use "FieldValueInvalid".
    All future added reasons must be accepted by clients when reading this value and unknown
    reasons should be treated as FieldValueInvalid.
    -->

    reason 提供機器可讀的驗證失敗原因，當請求未通過此驗證規則時，該原因會返回給調用者。
    返回給調用者的 HTTP 狀態代碼將與第一個失敗的驗證規則的原因相匹配。
    目前支持的原因有：`FieldValueInvalid`、`FieldValueForbidden`、`FieldValueRequired`、`FieldValueDuplicate`。
    如果未設置，則默認使用 `FieldValueInvalid`。
    所有未來添加的原因在讀取該值時必須被客戶端接受，未知原因應被視爲 `FieldValueInvalid`。

## CustomResourceDefinitionStatus {#CustomResourceDefinitionStatus}

<!--
CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition
-->
CustomResourceDefinitionStatus 表示 CustomResourceDefinition 的狀態。

<hr>

- **acceptedNames** (CustomResourceDefinitionNames)

  <!--
  acceptedNames are the names that are actually being used to serve discovery. They may be different than the names in spec.
  -->

  acceptedNames 是實際用於服務發現的名稱。它們可能與規約（spec）中的名稱不同。

  <a name="CustomResourceDefinitionNames"></a>
  <!--
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **acceptedNames.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.
  -->

  **CustomResourceDefinitionNames 表示提供此 CustomResourceDefinition 資源的名稱。**

  - **acceptedNames.kind** (string)，必需

    kind 是資源的序列化類型。它通常是駝峯命名的單數形式。自定義資源實例將使用此值作爲 API 調用中的 `kind` 屬性。

  <!--
  - **acceptedNames.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.
  -->

  - **acceptedNames.plural** (string)，必需

    plural 是所提供的資源的複數名稱，自定義資源在 `/apis/<group>/<version>/.../<plural>` 下提供。
    必須與 CustomResourceDefinition 的名稱匹配（格式爲 `<names.plural>.<group>`）。必須全部小寫。

  - **acceptedNames.categories** ([]string)

    <!--
    *Atomic: will be replaced during a merge*

    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.
    -->

    **原子：將在合併期間被替換**

    categories 是此自定義資源所屬的分組資源列表（例如 'all'）。
    它在 API 發現文檔中發佈，並被客戶端用於支持像 `kubectl get all` 這樣的調用。

  - **acceptedNames.listKind** (string)

    <!--
    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".
    -->

    listKind 是此資源列表的序列化類型。默認爲 "`<kind>List`"。

  - **acceptedNames.shortNames** ([]string)

    <!--
    *Atomic: will be replaced during a merge*

    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.
    -->

    **原子：將在合併期間被替換**

    shortNames 是資源的短名稱，在 API 發現文檔中公開，並支持客戶端調用，如 `kubectl get <shortname>`。必須全部小寫。

  - **acceptedNames.singular** (string)

    <!--
    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.
    -->

    singular 是資源的單數名稱。必須全部小寫。默認爲小寫形式的 `kind`。

- **conditions** ([]CustomResourceDefinitionCondition)

  <!--
  *Map: unique values on key type will be kept during a merge*

  conditions indicate state for particular aspects of a CustomResourceDefinition
  -->

  **Map：合併時將保留 type 鍵的唯一值**

  conditions 表示 CustomResourceDefinition 特定方面的狀態

  <a name="CustomResourceDefinitionCondition"></a>
  <!--
  *CustomResourceDefinitionCondition contains details for the current condition of this pod.*

  - **conditions.status** (string), required

    status is the status of the condition. Can be True, False, Unknown.
  -->

  **CustomResourceDefinitionCondition 包含此 Pod 當前狀況的詳細信息。**

  - **conditions.status** (string)，必需

    status 表示狀況（Condition）的狀態，取值爲 True、False 或 Unknown 之一。

  <!--
  - **conditions.type** (string), required

    type is the type of the condition. Types include Established, NamesAccepted and Terminating.
  -->

  - **conditions.type** (string)，必需

    type 是條件的類型。類型包括：Established、NamesAccepted 和 Terminating。

  - **conditions.lastTransitionTime** (Time)

    <!--
    lastTransitionTime last time the condition transitioned from one status to another.
    -->

    lastTransitionTime 是上一次發生狀況狀態轉換的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。**

  - **conditions.message** (string)

    <!--
    message is a human-readable message indicating details about last transition.
    -->

    message 是有關上次轉換的詳細可讀信息。

  - **conditions.reason** (string)

    <!--
    reason is a unique, one-word, CamelCase reason for the condition's last transition.
    -->

    reason 表述狀況上次轉換原因的、駝峯格式命名的、唯一的一個詞。

- **storedVersions** ([]string)

  <!--
  *Atomic: will be replaced during a merge*

  storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list.
  -->

  **原子：將在合併期間被替換**

  storedVersions 列出了曾經被持久化的所有 CustomResources 版本。跟蹤這些版本可以爲 etcd 中的存儲版本提供遷移路徑。
  該字段是可變的，因此遷移控制器可以完成到另一個版本的遷移（確保存儲中沒有遺留舊對象），然後從該列表中刪除其餘版本。
  當版本在此列表中時，則不能從 `spec.versions` 中刪除。

## CustomResourceDefinitionList {#CustomResourceDefinitionList}
<!--
CustomResourceDefinitionList is a list of CustomResourceDefinition objects.
-->
CustomResourceDefinitionList 是 CustomResourceDefinition 對象的列表。

<hr>

<!--
- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>), required

  items list individual CustomResourceDefinition objects
-->

- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>)，必需

  items 列出單個 CustomResourceDefinition 對象。

- **apiVersion** (string)

  <!--
  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  -->

  apiVersion 定義對象表示的版本化模式。伺服器應將已識別的模式轉換爲最新的內部值，並可能拒絕未識別的值。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  <!--
  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  kind 是一個字符串值，表示該對象所表示的 REST 資源。伺服器可以從客戶端提交請求的端點推斷出 REST 資源。
  不能被更新。駝峯命名。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  標準的對象元數據，更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

## Operations {#Operations}

<hr>

<!--
### `get` read the specified CustomResourceDefinition

#### HTTP Request
-->
### `get` 讀取指定的 CustomResourceDefinition

#### HTTP 請求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `get` 讀取指定 CustomResourceDefinition 的狀態

#### HTTP 請求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CustomResourceDefinition

#### HTTP Request
-->
### `list` 列出或觀察 CustomResourceDefinition 類型的對象

#### HTTP 請求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters
-->
#### 參數

- **allowWatchBookmarks** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionList" >}}">CustomResourceDefinitionList</a>): OK

401: Unauthorized

<!--
### `create` create a CustomResourceDefinition

#### HTTP Request
-->
### `create` 創建一個 CustomResourceDefinition

#### HTTP 請求

POST /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 參數

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

202 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CustomResourceDefinition

#### HTTP Request
-->
### `update` 替換指定的 CustomResourceDefinition

#### HTTP 請求

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `update` 替換指定 CustomResourceDefinition 的狀態

#### HTTP 請求

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CustomResourceDefinition

#### HTTP Request
-->
### `patch` 部分更新指定的 CustomResourceDefinition

#### HTTP 請求

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**<!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `patch` 部分更新指定 CustomResourceDefinition 的狀態

#### HTTP 請求

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  CustomResourceDefinition 的名稱。

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `delete` delete a CustomResourceDefinition

#### HTTP Request
-->
### `delete` 刪除一個 CustomResourceDefinition

#### HTTP 請求

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 參數

- **name** （**路徑參數**）：string，必需
  
  CustomResourceDefinition 的名稱。

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CustomResourceDefinition

#### HTTP Request
-->
### `deletecollection` 刪除 CustomResourceDefinition 的集合

#### HTTP 請求

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters
-->
#### 參數

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
