---
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition 表示应在 API 服务器上公开的资源。"
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
CustomResourceDefinition 表示应在 API 服务器上公开的资源。其名称必须采用 `<.spec.name>.<.spec.group>` 格式。

<hr>

- **apiVersion**：apiextensions.k8s.io/v1

- **kind**：CustomResourceDefinition

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据，更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionSpec" >}}">CustomResourceDefinitionSpec</a>)，<!--required-->必需
  <!--
  spec describes how the user wants the resources to appear
  -->
  spec 描述了用户希望资源的呈现方式。

- **status** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionStatus" >}}">CustomResourceDefinitionStatus</a>)
  <!--
  status indicates the actual state of the CustomResourceDefinition
  -->
  status 表示 CustomResourceDefinition 的实际状态。

## CustomResourceDefinitionSpec {#CustomResourceDefinitionSpec}

<!--
CustomResourceDefinitionSpec describes how a user wants their resource to appear
-->
CustomResourceDefinitionSpec 描述了用户希望资源的呈现方式。

<hr>

<!--
- **group** (string), required

  group is the API group of the defined custom resource. The custom resources are served under `/apis/\<group>/...`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`).
-->
- **group** (string)，必需

  group 是自定义资源的 API 组。自定义资源在 `/apis/<group>/...` 下提供。
  必须与 CustomResourceDefinition 的名称匹配（格式为 `<names.plural>.<group>`）。

<!--
- **names** (CustomResourceDefinitionNames), required

  names specify the resource and kind names for the custom resource.
-->

- **names** (CustomResourceDefinitionNames)，必需

  names 表示自定义资源的资源和种类名称。

  <a name="CustomResourceDefinitionNames"></a>
  <!--
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **names.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.
  -->
  **CustomResourceDefinitionNames 表示提供此 CustomResourceDefinition 资源的名称。**

  - **names.kind** (string)，必需

    kind 是资源的序列化类型。它通常是驼峰命名的单数形式。自定义资源实例将使用此值作为 API 调用中的 `kind` 属性。

  <!--
  - **names.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.
  -->

  - **names.plural** (string)，必需

    plural 是所提供的资源的复数名称，自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供。
    必须与 CustomResourceDefinition 的名称匹配（格式为 `<names.plural>.<group>`）。必须全部小写。

  - **names.categories** ([]string)

    <!--
    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.
    -->

    categories 是自定义资源所属的分组资源列表（例如 'all'）。
    它在 API 发现文档中发布，并支持客户端像 `kubectl get all` 这样的调用。

  - **names.listKind** (string)

    <!--
    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".
    -->

    listKind 是此资源列表的序列化类型。默认为 "`kind`List"。

  - **names.shortNames** ([]string)

    <!--
    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.
    -->

    shortNames 是资源的短名称，在 API 发现文档中公开，并支持客户端调用，如 `kubectl get <shortname>`。必须全部小写。

  - **names.singular** (string)

    <!--
    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.
    -->

    singular 是资源的单数名称。必须全部小写。默认为小写 `kind`。

<!--  
- **scope** (string), required

  scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`.
-->

- **scope** (string)，必需
  
  scope 表示自定义资源是集群作用域还是命名空间作用域。允许的值为 `Cluster` 和 `Namespaced`。

<!--
- **versions** ([]CustomResourceDefinitionVersion), required

  versions is the list of all API versions of the defined custom resource. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.
-->

- **versions** ([]CustomResourceDefinitionVersion)，必需

  versions 是自定义资源的所有 API 版本的列表。版本名称用于计算服务版本在 API 发现中列出的顺序。
  如果版本字符串与 Kubernetes 的版本号形式类似，则它将被排序在非 Kubernetes 形式版本字符串之前。
  Kubernetes 的版本号字符串按字典顺序排列。Kubernetes 版本号以 “v” 字符开头，
  后面是一个数字（主版本），然后是可选字符串 “alpha” 或 “beta” 和另一个数字（次要版本）。
  它们首先按 GA > beta > alpha 排序（其中 GA 是没有 beta 或 alpha 等后缀的版本），然后比较主要版本，
  最后是比较次要版本。版本排序列表示例：v10、v2、v1、v11beta2、v10beta3、v3beta1、v12alpha1、v11alpha2、foo1、foo10。

  <a name="CustomResourceDefinitionVersion"></a>
  <!--
  *CustomResourceDefinitionVersion describes a version for CRD.*

  - **versions.name** (string), required

    name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/\<group>/\<version>/...` if `served` is true.
  -->
  **CustomResourceDefinitionVersion 描述 CRD 的一个版本。**

  - **versions.name** (string)，必需

    name 是版本名称，例如 “v1”、“v2beta1” 等。如果 `served` 是 true，自定义资源在
    `/apis/<group>/<version>/...` 版本下提供。

  <!--
  - **versions.served** (boolean), required

    served is a flag enabling/disabling this version from being served via REST APIs
  -->

  - **versions.served** (boolean)，必需

    served 是用于启用/禁用该版本通过 REST API 提供服务的标志。

  <!--
  - **versions.storage** (boolean), required

    storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.
  -->

  - **versions.storage** (boolean)，必需

    storage 表示在将自定义资源持久保存到存储时，应使用此版本。有且仅有一个版本的 storage=true。

  - **versions.additionalPrinterColumns** ([]CustomResourceColumnDefinition)

    <!--
    additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used.
    -->

    additionalPrinterColumns 表示在表输出中返回的附加列。
    有关详细信息，请参阅 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#receiving-resources-as-tables。
    如果没有指定列，则显示自定义资源存活时间（AGE）列。
  
    <a name="CustomResourceColumnDefinition"></a>
    <!--
    *CustomResourceColumnDefinition specifies a column for server side printing.*

    - **versions.additionalPrinterColumns.jsonPath** (string), required

      jsonPath is a simple JSON path (i.e. with array notation) which is evaluated against each custom resource to produce the value for this column.
    -->

    **CustomResourceColumnDefinition 指定用于服务器端打印的列。**

    - **versions.additionalPrinterColumns.jsonPath** (string)，必需

      jsonPath 是一个简单的 JSON 路径（使用数组表示法），它对每个自定义资源进行评估，以生成该列的值。

    <!--
    - **versions.additionalPrinterColumns.name** (string), required

      name is a human readable name for the column.
    -->

    - **versions.additionalPrinterColumns.name** (string)，必需

      name 是便于阅读的列名称。

    <!--
    - **versions.additionalPrinterColumns.type** (string), required

      type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.
    -->

    - **versions.additionalPrinterColumns.type** (string)，必需

      type 是此列的 OpenAPI 类型定义。有关详细信息，
      请参阅 https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types

    - **versions.additionalPrinterColumns.description** (string)

      <!--
      description is a human readable description of this column.
      -->

      description 是该列的可读性描述。

    - **versions.additionalPrinterColumns.format** (string)

      <!--
      format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.
      -->

      format 是这个列的可选 OpenAPI 类型定义。'name' 格式应用于主标识符列，以帮助客户端识别列是资源名称。
      有关详细信息，请参阅 https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types。

    - **versions.additionalPrinterColumns.priority** (int32)

      <!--
      priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a priority greater than 0.
      -->

      priority 是一个定义此列相对于其他列的相对重要性的整数。数字越低，优先级越高。
      在空间有限的情况下，可以省略的列的优先级应大于 0。

  - **versions.deprecated** (boolean)

    <!--
    deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false.
    -->

    deprecated 表示此版本的自定义资源 API 已弃用。设置为 true 时，对此版本的 API
    请求会在服务器响应头信息中带有警告（warning）信息。此值默认为 false。

  - **versions.deprecationWarning** (string)

    <!--
    deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists.
    -->

    deprecationWarning 会覆盖返回给 API 客户端的默认警告。只能在 `deprecated` 为 true 时设置。
    默认警告表示此版本已弃用，建议使用最新的同等或更高稳定性版本（如果存在）。

  - **versions.schema** (CustomResourceValidation)

    <!--
    schema describes the schema used for validation, pruning, and defaulting of this version of the custom resource.
    -->

    schema 描述了用于验证、精简和默认此版本的自定义资源的模式。

    <a name="CustomResourceValidation"></a>
    <!--
    *CustomResourceValidation is a list of validation methods for CustomResources.*
    -->

    **CustomResourceValidation 是 CustomResources 的验证方法列表。**  

    - **versions.schema.openAPIV3Schema** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

      <!--
      openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning.
      -->

      openAPIV3Schema 是用于验证和精简的 OpenAPI v3 模式。

  - **versions.subresources** (CustomResourceSubresources)

    <!--
    subresources specify what subresources this version of the defined custom resource have.
    -->

    subresources 指定此版本已定义的自定义资源具有哪些子资源。

    <a name="CustomResourceSubresources"></a>
    <!--
    *CustomResourceSubresources defines the status and scale subresources for CustomResources.*
    -->

    **CustomResourceSubresources 定义了 CustomResources 子资源的状态和规模。**  

    - **versions.subresources.scale** (CustomResourceSubresourceScale)

      <!--
      scale indicates the custom resource should serve a `/scale` subresource that returns an `autoscaling/v1` Scale object.
      -->

      scale 表示自定义资源应该提供一个 `/scale` 子资源，该子资源返回一个 `autoscaling/v1` Scale 对象。

      <a name="CustomResourceSubresourceScale"></a>
      <!--
      *CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources.*

      - **versions.subresources.scale.specReplicasPath** (string), required

        specReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `spec.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.spec`. If there is no value under the given path in the custom resource, the `/scale` subresource will return an error on GET.
      -->

      **CustomResourceSubresourceScale 定义了如何为 CustomResources 的 scale 子资源提供服务。**

      - **versions.subresources.scale.specReplicasPath** (string)，必需

        specReplicasPath 定义对应于 Scale 的自定义资源内的 JSON 路径 `spec.replicas`。
        只允许没有数组表示法的 JSON 路径。必须是 `.spec` 下的 JSON 路径。
        如果自定义资源中的给定路径下没有值，那么 GET `/scale` 子资源将返回错误。

      <!--
      - **versions.subresources.scale.statusReplicasPath** (string), required

        statusReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `status.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status`. If there is no value under the given path in the custom resource, the `status.replicas` value in the `/scale` subresource will default to 0.
      -->

      - **versions.subresources.scale.statusReplicasPath** (string)，必需

        statusReplicasPath 定义对应于 Scale 的自定义资源内的 JSON 路径 `status.replicas`。
        只允许不带数组表示法的 JSON 路径。必须是 `.status` 下的 JSON 路径。
        如果自定义资源中给定路径下没有值，则 `/scale` 子资源中的 `status.replicas` 值将默认为 0。

      - **versions.subresources.scale.labelSelectorPath** (string)

        <!--
        labelSelectorPath defines the JSON path inside of a custom resource that corresponds to Scale `status.selector`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status` or `.spec`. Must be set to work with HorizontalPodAutoscaler. The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form. More info: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource If there is no value under the given path in the custom resource, the `status.selector` value in the `/scale` subresource will default to the empty string.
        -->

        labelSelectorPath 定义对应于 Scale 的自定义资源内的 JSON 路径 `status.selector`。
        只允许不带数组表示法的 JSON 路径。必须是 `.status` 或 `.spec` 下的路径。
        必须设置为与 HorizontalPodAutoscaler 一起使用。
        此 JSON 路径指向的字段必须是字符串字段（不是复杂的选择器结构），其中包含字符串形式的序列化标签选择器。
        更多信息： https://kubernetes.io/zh-cn/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource。
        如果自定义资源中给定路径下没有值，则 `/scale` 子资源中的 `status.selector` 默认值为空字符串。

    - **versions.subresources.status** (CustomResourceSubresourceStatus)

      <!--
      status indicates the custom resource should serve a `/status` subresource. When enabled: 1. requests to the custom resource primary endpoint ignore changes to the `status` stanza of the object. 2. requests to the custom resource `/status` subresource ignore changes to anything other than the `status` stanza of the object.
      -->

      status 表示自定义资源应该为 `/status` 子资源服务。当启用时：

      1. 对自定义资源主端点的请求会忽略对对象 `status` 节的改变；
      2. 对自定义资源 `/status` 子资源的请求忽略对对象 `status` 节以外的任何变化。

      <a name="CustomResourceSubresourceStatus"></a>
      <!--
      *CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza*
      -->

      CustomResourceSubresourceStatus 定义了如何为自定义资源提供 status 子资源。
      状态由 CustomResource 中的 `.status` JSON 路径表示。设置后，

      * 为自定义资源提供一个 `/status` 子资源。
      * 向 `/status` 子资源发出的 PUT 请求时，需要提供自定义资源对象，服务器端会忽略对 status 节以外的任何内容更改。
      * 对自定义资源的 PUT/POST/PATCH 请求会忽略对 status 节的更改。

- **conversion** (CustomResourceConversion)

  <!--
  conversion defines conversion settings for the CRD.
  -->
  conversion 定义了 CRD 的转换设置。

  <a name="CustomResourceConversion"></a>
  <!--
  *CustomResourceConversion describes how to convert different versions of a CR.*

  - **conversion.strategy** (string), required

    strategy specifies how custom resources are converted between versions. Allowed values are: - `"None"`: The converter only change the apiVersion and would not touch any other field in the custom resource. - `"Webhook"`: API Server will call to an external webhook to do the conversion. Additional information
      is needed for this option. This requires spec.preserveUnknownFields to be false, and spec.conversion.webhook to be set.
  -->

  **CustomResourceConversion 描述了如何转换不同版本的自定义资源。**

  - **conversion.strategy** (string)，必需

    strategy 指定如何在版本之间转换自定义资源。允许的值为：

    - `"None"`：转换器仅更改 apiVersion 并且不会触及自定义资源中的任何其他字段。
    - `"Webhook"`：API 服务器将调用外部 Webhook 进行转换。此选项需要其他信息。这要求
      spec.preserveUnknownFields 为 false，并且设置 spec.conversion.webhook。

  - **conversion.webhook** (WebhookConversion)

    <!--
    webhook describes how to call the conversion webhook. Required when `strategy` is set to `"Webhook"`.
    -->

    webhook 描述了如何调用转换 Webhook。当 `strategy` 设置为 `"Webhook"` 时有效。

    <a name="WebhookConversion"></a>
    <!--
    *WebhookConversion describes how to call a conversion webhook*

    - **conversion.webhook.conversionReviewVersions** ([]string), required

      conversionReviewVersions is an ordered list of preferred `ConversionReview` versions the Webhook expects. The API server will use the first version in the list which it supports. If none of the versions specified in this list are supported by API server, conversion will fail for the custom resource. If a persisted Webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail.
    -->

    **WebhookConversion 描述了如何调用转换 Webhook**

    - **conversion.webhook.conversionReviewVersions** ([]string)，必需

      conversionReviewVersions 是 Webhook 期望的 `ConversionReview` 版本的有序列表。
      API 服务器将使用它支持的列表中的第一个版本。如果 API 服务器不支持此列表中指定的版本，则自定义资源的转换将失败。
      如果持久化的 Webhook 配置指定了允许的版本但其中不包括 API 服务器所了解的任何版本，则对 Webhook 的调用将失败。

    - **conversion.webhook.clientConfig** (WebhookClientConfig)

      <!--
      clientConfig is the instructions for how to call the webhook if strategy is `Webhook`.
      -->

      如果 strategy 是 `Webhook`，那么 clientConfig 是关于如何调用 Webhook 的说明。

      <a name="WebhookClientConfig"></a>
      <!--
      *WebhookClientConfig contains the information to make a TLS connection with the webhook.*
      -->

      **WebhookClientConfig 包含与 Webhook 建立 TLS 连接的信息。**

      - **conversion.webhook.clientConfig.caBundle** ([]byte)

        <!--
        caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.
        -->

        caBundle 是一个 PEM 编码的 CA 包，用于验证 Webhook 服务器的服务证书。
        如果未指定，则使用 API 服务器上的系统根证书。

      - **conversion.webhook.clientConfig.service** (ServiceReference)

        <!--
        service is a reference to the service for this webhook. Either service or url must be specified.
        
        If the webhook is running within the cluster, then you should use `service`.
        -->

        service 是对此 Webhook 服务的引用。必须指定 service 或 url 字段之一。

        如果在集群中运行 Webhook，那么你应该使用 `service`。

        <a name="ServiceReference"></a>
        <!--
        *ServiceReference holds a reference to Service.legacy.k8s.io*

        - **conversion.webhook.clientConfig.service.name** (string), required

          name is the name of the service. Required
        -->

        **ServiceReference 保存对 Service.legacy.k8s.io 的一个引用。**

        - **conversion.webhook.clientConfig.service.name** (string)，必需

          name 是服务的名称。必需。

        <!--
        - **conversion.webhook.clientConfig.service.namespace** (string), required

          namespace is the namespace of the service. Required
        -->

        - **conversion.webhook.clientConfig.service.namespace** (string)，必需

          namespace 是服务的命名空间。必需。

        - **conversion.webhook.clientConfig.service.path** (string)

          <!--
          path is an optional URL path at which the webhook will be contacted.
          -->

          path 是一个可选的 URL 路径，Webhook 将通过该路径联系服务。

        - **conversion.webhook.clientConfig.service.port** (int32)

          <!--
          port is an optional service port at which the webhook will be contacted. `port` should be a valid port number (1-65535, inclusive). Defaults to 443 for backward compatibility.
          -->

          port 是 Webhook 联系的可选服务端口。`port` 应该是一个有效的端口号（1-65535，包含）。
          为实现向后兼容，默认端口号为 443。

      - **conversion.webhook.clientConfig.url** (string)

        <!--
        url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
        -->

        url 以标准 URL 的形式（`scheme://host:port/path`）给出 Webhook 的位置。`url` 或 `service` 必须指定一个且只能指定一个。

        <!--
        The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
        -->

        `host` 不应引用集群中运行的服务；若使用集群内服务应改为使用 `service` 字段。
        host 值可能会通过外部 DNS 解析（例如，`kube-apiserver` 无法解析集群内 DNS，因为这将违反分层规则）。
        `host` 也可能是 IP 地址。

        <!--
        Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
        -->

        请注意，使用 `localhost` 或 `127.0.0.1` 作为 `host` 是有风险的，
        除非你非常小心地在所有运行 API 服务器的主机上运行这个 Webhook，因为这些 API 服务器可能需要调用这个 Webhook。
        这样的安装可能是不可移植的，也就是说，不容易在一个新的集群中复现。

        <!--
        The scheme must be "https"; the URL must begin with "https://".
        
        A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
        
        Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either.
        -->

        scheme 必须是 "https"；URL 必须以 "https://" 开头。

        路径（path）是可选的，如果存在，则可以是 URL 中允许的任何字符串。
        你可以使用路径传递一个任意字符串给 Webhook，例如，一个集群标识符。

        不允许使用用户或基本认证，例如 "user:password@"，是不允许的。片段（"#..."）和查询参数（"?..."）也是不允许的。

- **preserveUnknownFields** (boolean)

  <!--
  preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. This field is deprecated in favor of setting `x-preserve-unknown-fields` to true in `spec.versions[*].schema.openAPIV3Schema`. See https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning for details.
  -->

  preserveUnknownFields 表示将对象写入持久性存储时应保留 OpenAPI 模式中未规定的对象字段。
  apiVersion、kind、元数据（metadata）和元数据中的已知字段始终保留。不推荐使用此字段，而建议在
  `spec.versions[*].schema.openAPIV3Schema` 中设置 `x-preserve-unknown-fields` 为 true。
  更多详细信息参见：
  https://kubernetes.io/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning

## JSONSchemaProps {#JSONSchemaProps}

<!--
JSONSchemaProps is a JSON-Schema following Specification Draft 4 (http://json-schema.org/).
-->
JSONSchemaProps 是JSON 模式（JSON-Schema），遵循其规范草案第 4 版（http://json-schema.org/）。

<hr>

- **$ref** (string)

- **$schema** (string)

- **additionalItems** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  <!--
  *JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.*
  -->
  **JSONSchemaPropsOrBool 表示 JSONSchemaProps 或布尔值。布尔属性默认为 true。**

- **additionalProperties** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  <!--
  *JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.*
  -->
  **JSONSchemaPropsOrBool 表示 JSONSchemaProps 或布尔值。布尔属性默认为 true。**  

- **allOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **anyOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **default** (JSON)

  <!--
  default is a default value for undefined object fields. Defaulting is a beta feature under the CustomResourceDefaulting feature gate. Defaulting requires spec.preserveUnknownFields to be false.
  -->
  default 是未定义对象字段的默认值。设置默认值操作是 CustomResourceDefaulting 特性门控所控制的一个 Beta 特性。
  应用默认值设置时要求 spec.preserveUnknownFields 为 false。

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下类型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **definitions** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **dependencies** (map[string]JSONSchemaPropsOrStringArray)

  <a name="JSONSchemaPropsOrStringArray"></a>
  <!--
  *JSONSchemaPropsOrStringArray represents a JSONSchemaProps or a string array.*
  -->
  **JSONSchemaPropsOrStringArray 表示 JSONSchemaProps 或字符串数组。**

- **description** (string)

- **enum** ([]JSON)

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下类型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **example** (JSON)

  <a name="JSON"></a>
  <!--
  *JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.*
  -->
  **JSON 表示任何有效的 JSON 值。支持以下类型：bool、int64、float64、string、[]interface{}、map[string]interface{} 和 nil。**

- **exclusiveMaximum** (boolean)

- **exclusiveMinimum** (boolean)

- **externalDocs** (ExternalDocumentation)

  <a name="ExternalDocumentation"></a>
  <!--
  *ExternalDocumentation allows referencing an external resource for extended documentation.*
  -->
  **ExternalDocumentation 允许引用外部资源作为扩展文档。**

  - **externalDocs.description** (string)

  - **externalDocs.url** (string)

- **format** (string)

  <!--
  format is an OpenAPI v3 format string. Unknown formats are ignored. The following formats are validated:

  - bsonobjectid: a bson object ID, i.e. a 24 characters hex string - uri: an URI as parsed by Golang net/url.ParseRequestURI - email: an email address as parsed by Golang net/mail.ParseAddress - hostname: a valid representation for an Internet host name, as defined by RFC 1034, section 3.1 [RFC1034]. - ipv4: an IPv4 IP as parsed by Golang net.ParseIP - ipv6: an IPv6 IP as parsed by Golang net.ParseIP - cidr: a CIDR as parsed by Golang net.ParseCIDR - mac: a MAC address as parsed by Golang net.ParseMAC - uuid: an UUID that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid3: an UUID3 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid4: an UUID4 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - uuid5: an UUID5 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - isbn: an ISBN10 or ISBN13 number string like "0321751043" or "978-0321751041" - isbn10: an ISBN10 number string like "0321751043" - isbn13: an ISBN13 number string like "978-0321751041" - creditcard: a credit card number defined by the regex ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$ with any non digit characters mixed in - ssn: a U.S. social security number following the regex ^\d{3}[- ]?\d{2}[- ]?\d{4}$ - hexcolor: an hexadecimal color code like "#FFFFFF: following the regex ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$ - rgbcolor: an RGB color code like rgb like "rgb(255,255,2559" - byte: base64 encoded binary data - password: any kind of string - date: a date string like "2006-01-02" as defined by full-date in RFC3339 - duration: a duration string like "22 ns" as parsed by Golang time.ParseDuration or compatible with Scala duration format - datetime: a date time string like "2014-12-15T19:30:20.000Z" as defined by date-time in RFC3339.
  -->
  format 是 OpenAPI v3 格式字符串。未知格式将被忽略。以下格式会被验证合法性：

  - bsonobjectid：一个 bson 对象的 ID，即一个 24 个字符的十六进制字符串
  - uri：由 Go 语言 net/url.ParseRequestURI 解析得到的 URI
  - email：由 Go 语言 net/mail.ParseAddress 解析得到的电子邮件地址
  - hostname：互联网主机名的有效表示，由 RFC 1034 第 3.1 节 [RFC1034] 定义
  - ipv4：由 Go 语言 net.ParseIP 解析得到的 IPv4 协议的 IP
  - ipv6：由 Go 语言 net.ParseIP 解析得到的 IPv6 协议的 IP
  - cidr：由 Go 语言 net.ParseCIDR 解析得到的 CIDR
  - mac：由 Go 语言 net.ParseMAC 解析得到的一个 MAC 地址
  - uuid：UUID，允许大写字母，满足正则表达式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$
  - uuid3：UUID3，允许大写字母，满足正则表达式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$
  - uuid4：UUID4，允许大写字母，满足正则表达式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$
  - uuid5：UUID5，允许大写字母，满足正则表达式 (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$
  - isbn：一个 ISBN10 或 ISBN13 数字字符串，如 "0321751043" 或 "978-0321751041"
  - isbn10：一个 ISBN10 数字字符串，如 "0321751043"
  - isbn13：一个 ISBN13 号码字符串，如 "978-0321751041"
  - creditcard：信用卡号码，满足正则表达式
    ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$，
    其中混合任意非数字字符
  - ssn：美国社会安全号码，满足正则表达式 ^\d{3}[- ]?\d{2}[- ]?\d{4}$
  - hexcolor：一个十六进制的颜色编码，如 "#FFFFFF"，满足正则表达式 ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$
  - rgbcolor：一个 RGB 颜色编码 例如 "rgb(255,255,255)"
  - byte：base64 编码的二进制数据
  - password：任何类型的字符串
  - date：类似 "2006-01-02" 的日期字符串，由 RFC3339 中的完整日期定义
  - duration：由 Go 语言 time.ParseDuration 解析的持续时长字符串，如 "22 ns"，或与 Scala 持续时间格式兼容。
  - datetime：一个日期时间字符串，如 "2014-12-15T19:30:20.000Z"，由 RFC3339 中的 date-time 定义。

- **id** (string)

- **items** (JSONSchemaPropsOrArray)

  <a name="JSONSchemaPropsOrArray"></a>
  <!--
  *JSONSchemaPropsOrArray represents a value that can either be a JSONSchemaProps or an array of JSONSchemaProps. Mainly here for serialization purposes.*
  -->
  **JSONSchemaPropsOrArray 表示可以是 JSONSchemaProps 或 JSONSchemaProps 数组的值。这里目的主要用于序列化。**  

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

- **pattern** (string)

- **patternProperties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **properties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **required** ([]string)

- **title** (string)

- **type** (string)

- **uniqueItems** (boolean)

- **x-kubernetes-embedded-resource** (boolean)

  <!--
  x-kubernetes-embedded-resource defines that the value is an embedded Kubernetes runtime.Object, with TypeMeta and ObjectMeta. The type must be object. It is allowed to further restrict the embedded object. kind, apiVersion and metadata are validated automatically. x-kubernetes-preserve-unknown-fields is allowed to be true, but does not have to be if the object is fully specified (up to kind, apiVersion, metadata).
  -->
  x-kubernetes-embedded-resource 定义该值是一个嵌入式 Kubernetes runtime.Object，具有 TypeMeta 和 ObjectMeta。
  类型必须是对象。允许进一步限制嵌入对象。会自动验证 kind、apiVersion 和 metadata 等字段值。
  x-kubernetes-preserve-unknown-fields 允许为 true，但如果对象已完全指定
  （除 kind、apiVersion、metadata 之外），则不必为 true。

- **x-kubernetes-int-or-string** (boolean)

  <!--
  x-kubernetes-int-or-string specifies that this value is either an integer or a string. If this is true, an empty type is allowed and type as child of anyOf is permitted if following one of the following patterns:
  -->
  x-kubernetes-int-or-string 指定此值是整数或字符串。如果为 true，则允许使用空类型，
  并且如果遵循以下模式之一，则允许作为 anyOf 的子类型：

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

     - （可以有选择地包含其他类型）

- **x-kubernetes-list-map-keys** ([]string)

  <!--
  x-kubernetes-list-map-keys annotates an array with the x-kubernetes-list-type `map` by specifying the keys used as the index of the map.
  
  This tag MUST only be used on lists that have the "x-kubernetes-list-type" extension set to "map". Also, the values specified for this attribute must be a scalar typed field of the child structure (no nesting is supported).
  
  The properties specified must either be required or have a default value, to ensure those properties are present for all list items.
  -->
  X-kubernetes-list-map-keys 通过指定用作 map 索引的键来使用 x-kubernetes-list-type `map` 注解数组。

  这个标签必须只用于 "x-kubernetes-list-type" 扩展设置为 "map" 的列表。
  而且，为这个属性指定的值必须是子结构的标量类型的字段（不支持嵌套）。

  指定的属性必须是必需的或具有默认值，以确保所有列表项都存在这些属性。

- **x-kubernetes-list-type** (string)

  <!--
  x-kubernetes-list-type annotates an array to further describe its topology. This extension must only be used on lists and may have 3 possible values:
  -->
  x-kubernetes-list-type 注解一个数组以进一步描述其拓扑。此扩展名只能用于列表，并且可能有 3 个可能的值：

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
        列表被视为单个实体，就像标量一样。原子列表在更新时将被完全替换。这个扩展可以用于任何类型的列表（结构，标量，…）。
  2. `set`：
        set 是不能有多个具有相同值的列表。每个值必须是标量、具有 x-kubernetes-map-type
        `atomic` 的对象或具有 x-kubernetes-list-type `atomic` 的数组。
  3. `map`：
     这些列表类似于映射表，因为它们的元素具有用于标识它们的非索引键。合并时保留顺序。
     map 标记只能用于元数类型为 object 的列表。
  数组默认为原子数组。

- **x-kubernetes-map-type** (string)

  <!--
  x-kubernetes-map-type annotates an object to further describe its topology. This extension must only be used when type is object and may have 2 possible values:
  -->
  x-kubernetes-map-type 注解一个对象以进一步描述其拓扑。此扩展只能在 type 为 object 时使用，并且可能有 2 个可能的值：

  <!--
  1) `granular`:
       These maps are actual maps (key-value pairs) and each fields are independent
       from each other (they can each be manipulated by separate actors). This is
       the default behaviour for all maps.
  2) `atomic`: the list is treated as a single entity, like a scalar.
       Atomic maps will be entirely replaced when updated.
  -->

  1) `granular`：
        这些 map 是真实的映射（键值对），每个字段都是相互独立的（它们都可以由不同的角色来操作）。
        这是所有 map 的默认行为。
  2) `atomic`：map 被视为单个实体，就像标量一样。原子 map 更新后将被完全替换。

- **x-kubernetes-preserve-unknown-fields** (boolean)

  <!--
  x-kubernetes-preserve-unknown-fields stops the API server decoding step from pruning fields which are not specified in the validation schema. This affects fields recursively, but switches back to normal pruning behaviour if nested properties or additionalProperties are specified in the schema. This can either be true or undefined. False is forbidden.
  -->

  x-kubernetes-preserve-unknown-fields 针对未在验证模式中指定的字段，禁止 API 服务器的解码步骤剪除这些字段。
  这一设置对字段的影响是递归的，但在模式中指定了嵌套 properties 或 additionalProperties 时，会切换回正常的字段剪除行为。
  该值可为 true 或 undefined，不能为 false。

- **x-kubernetes-validations** ([]ValidationRule)

  <!--
  *Patch strategy: merge on key `rule`*
  
  *Map: unique values on key rule will be kept during a merge*
  
  x-kubernetes-validations describes a list of validation rules written in the CEL expression language. This field is an alpha-level. Using this field requires the feature gate `CustomResourceValidationExpressions` to be enabled.
  -->

  **补丁策略：基于键 `rule` 合并**

  **Map：合并时将保留 rule 键的唯一值**

  x-kubernetes-validations 描述了用 CEL 表达式语言编写的验证规则列表。此字段是 Alpha 级别。
  使用此字段需要启用 `CustomResourceValidationExpressions` 特性门控。

  <a name="ValidationRule"></a>
  <!--
  *ValidationRule describes a validation rule written in the CEL expression language.*

  - **x-kubernetes-validations.rule** (string), required
  -->

  **ValidationRule 描述用 CEL 表达式语言编写的验证规则。**

  - **x-kubernetes-validations.rule** (string)，必需

    <!--
    Rule represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec.
    The Rule is scoped to the location of the x-kubernetes-validations extension in the schema.
    The `self` variable in the CEL expression is bound to the scoped value.
    Example: - Rule scoped to the root of a resource with a status subresource: {"rule": "self.status.actual \<= self.spec.maxDesired"}
    -->

    rule 表示将由 CEL 评估的表达式。参考： https://github.com/google/cel-spec。
    rule 的作用域为模式中的 x-kubernetes-validation 扩展所在的位置。CEL 表达式中的 `self` 与作用域值绑定。
    例子：rule 的作用域是一个具有状态子资源的资源根：{"rule": "self.status.actual \<= self.spec.maxDesired"}。

    <!--
    If the Rule is scoped to an object with properties, the accessible properties of the object are field selectable via `self.field` and field presence can be checked via `has(self.field)`. Null valued fields are treated as absent fields in CEL expressions. If the Rule is scoped to an object with additionalProperties (i.e. a map) the value of the map are accessible via `self[mapKey]`, map containment can be checked via `mapKey in self` and all entries of the map are accessible via CEL macros and functions such as `self.all(...)`. If the Rule is scoped to an array, the elements of the array are accessible via `self[i]` and also by macros and functions. If the Rule is scoped to a scalar, `self` is bound to the scalar value. Examples: - Rule scoped to a map of objects: {"rule": "self.components['Widget'].priority \< 10"} - Rule scoped to a list of integers: {"rule": "self.values.all(value, value >= 0 && value \< 100)"} - Rule scoped to a string value: {"rule": "self.startsWith('kube')"}
    -->

    如果 rule 的作用域是一个带有属性的对象，那么该对象的可访问属性是通过 `self` 进行字段选择的，
    并且可以通过 `has(self.field)` 来检查字段是否存在。在 CEL 表达式中，Null 字段被视为不存在的字段。
    如果该 rule 的作用域是一个带有附加属性的对象（例如一个 map），那么该 map 的值可以通过
    `self[mapKey]`来访问，map 是否包含某主键可以通过 `mapKey in self` 来检查。
    map 中的所有条目都可以通过 CEL 宏和函数（如 `self.all(...)`）访问。
    如果 rule 的作用域是一个数组，数组的元素可以通过 `self[i]` 访问，也可以通过宏和函数访问。
    如果 rule 的作用域为标量，`self` 绑定到标量值。举例：

    - rule 作用域为对象映射：{"rule": "self.components['Widget'].priority \< 10"}
    - rule 作用域为整数列表：{"rule": "self.values.all(value, value >= 0 && value \< 100)"}
    - rule 作用域为字符串值：{"rule": "self.startsWith('kube')"}

    <!--
    The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object and from any x-kubernetes-embedded-resource annotated objects. No other metadata properties are accessible.
    -->

    `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName` 总是可以从对象的根和任何带
    x-kubernetes-embedded-resource 注解的对象访问。其他元数据属性都无法访问。

    <!--
    Unknown data preserved in custom resources via x-kubernetes-preserve-unknown-fields is not accessible in CEL expressions. This includes: - Unknown field values that are preserved by object schemas with x-kubernetes-preserve-unknown-fields. - Object properties where the property schema is of an "unknown type". An "unknown type" is recursively defined as:
      - A schema with no type and x-kubernetes-preserve-unknown-fields set to true
      - An array where the items schema is of an "unknown type"
      - An object where the additionalProperties schema is of an "unknown type"
    -->

    在 CEL 表达式中无法访问通过 x-kubernetes-preserve-unknown-fields 保存在自定义资源中的未知数据。
    这包括：

    - 由包含 x-kubernetes-preserve-unknown-fields 的对象模式所保留的未知字段值；
    - 属性模式为 "未知类型" 的对象属性。"未知类型" 递归定义为：

      - 没有设置 type 但 x-kubernetes-preserve-unknown-fields 设置为 true 的模式。
      - 条目模式为"未知类型"的数组。
      - additionalProperties 模式为"未知类型"的对象。

    <!--
    Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - '__' escapes to '__underscores__' - '.' escapes to '__dot__' - '-' escapes to '__dash__' - '/' escapes to '__slash__' - Property names that exactly match a CEL RESERVED keyword escape to '__{keyword}__'. The keywords are:
        "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",
        "import", "let", "loop", "package", "namespace", "return".
    Examples:
      - Rule accessing a property named "namespace": {"rule": "self.__namespace__ > 0"}
      - Rule accessing a property named "x-prop": {"rule": "self.x__dash__prop > 0"}
      - Rule accessing a property named "redact__d": {"rule": "self.redact__underscores__d > 0"}
    -->

    只有名称符合正则表达式 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`  的属性才可被访问。
    在表达式中访问属性时，可访问的属性名称根据以下规则进行转义：

    - '__' 转义为 '__underscores__'
    - '.' 转义为 '__dot__'
    - '-' 转义为 '__dash__'
    - '/' 转义为 '__slash__'
    - 恰好匹配 CEL 保留关键字的属性名称转义为 '__{keyword}__' 。这里的关键字具体包括：
        "true"，"false"，"null"，"in"，"as"，"break"，"const"，"continue"，"else"，"for"，"function"，"if"，
        "import"，"let"，"loop"，"package"，"namespace"，"return"。
    举例：

      - 规则访问名为 "namespace" 的属性：`{"rule": "self.__namespace__ > 0"}`
      - 规则访问名为 "x-prop" 的属性：`{"rule": "self.x__dash__prop > 0"}`
      - 规则访问名为 "redact__d" 的属性：`{"rule": "self.redact__underscores__d > 0"}`

    <!--
    Equality on arrays with x-kubernetes-list-type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:
    - 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
      non-intersecting elements in `Y` are appended, retaining their partial order.
    - 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
      are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
      non-intersecting keys are appended, retaining their partial order.
    -->

    对 x-kubernetes-list-type 为 'set' 或 'map' 的数组进行比较时忽略元素顺序，如：[1, 2] == [2, 1]。
    使用 x-kubernetes-list-type 对数组进行串接使用下列类型的语义：

    - 'set'：`X + Y` 执行合并，其中 `X` 保留所有元素的数组位置，并附加不相交的元素 `Y`，保留其局部顺序。
    - 'map'：`X + Y` 执行合并，保留 `X` 中所有键的数组位置，但当 `X` 和 `Y` 的键集相交时，会被 `Y` 中的值覆盖。
      添加 `Y` 中具有不相交键的元素，保持其局顺序。

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

    fieldPath 表示验证失败时返回的字段路径。
    它必须是相对 JSON 路径（即，支持数组表示法），范围仅限于此 x-kubernetes-validations
    扩展在模式的位置，并引用现有字段。
    例如，当验证检查 `testMap` 映射下是否有 `foo` 属性时，可以将 fieldPath 设置为 `.testMap.foo`。
    如果验证需要确保两个列表具有各不相同的属性，则可以将 fieldPath 设置到其中任一列表，例如 `.testList`。
    它支持使用子操作引用现有字段，而不支持列表的数字索引。
    有关更多信息，请参阅 [Kubernetes 中的 JSONPath 支持](https://kubernetes.io/docs/reference/kubectl/jsonpath/)。
    因为其不支持数组的数字索引，所以对于包含特殊字符的字段名称，请使用 `['specialName']` 来引用字段名称。
    例如，对于出现在列表 `testList` 中的属性 `foo.34$`，fieldPath 可以设置为 `.testList['foo.34$']`。

  - **x-kubernetes-validations.message** (string)

    <!--
    Message represents the message displayed when validation fails. The message is required if the Rule contains line breaks.
    The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host"
    -->

    message 表示验证失败时显示的消息。如果规则包含换行符，则需要该消息。消息不能包含换行符。
    如果未设置，则消息为 "failed rule: {Rule}"，如："must be a URL with the host matching spec.host"

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

    messageExpression 声明一个 CEL 表达式，其计算结果是此规则失败时返回的验证失败消息。
    由于 messageExpression 用作失败消息，因此它的值必须是一个字符串。
    如果在规则中同时存在 message 和 messageExpression，则在验证失败时使用 messageExpression。
    如果是 messageExpression 出现运行时错误，则会记录运行时错误，并生成验证失败消息，
    就好像未设置 messageExpression 字段一样。如果 messageExpression 求值为空字符串、
    只包含空格的字符串或包含换行符的字符串，则验证失败消息也将像未设置 messageExpression 字段一样生成，
    并记录 messageExpression 生成空字符串/只包含空格的字符串/包含换行符的字符串的事实。
    messageExpression 可以访问的变量与规则相同；唯一的区别是返回类型。
    例如："x must be less than max ("+string(self.max)+")"。

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

    reason 提供机器可读的验证失败原因，当请求未通过此验证规则时，该原因会返回给调用者。
    返回给调用者的 HTTP 状态代码将与第一个失败的验证规则的原因相匹配。
    目前支持的原因有：`FieldValueInvalid`、`FieldValueForbidden`、`FieldValueRequired`、`FieldValueDuplicate`。
    如果未设置，则默认使用 `FieldValueInvalid`。
    所有未来添加的原因在读取该值时必须被客户端接受，未知原因应被视为 `FieldValueInvalid`。

## CustomResourceDefinitionStatus {#CustomResourceDefinitionStatus}

<!--
CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition
-->
CustomResourceDefinitionStatus 表示 CustomResourceDefinition 的状态。

<hr>

- **acceptedNames** (CustomResourceDefinitionNames)

  <!--
  acceptedNames are the names that are actually being used to serve discovery. They may be different than the names in spec.
  -->

  acceptedNames 是实际用于服务发现的名称。它们可能与规约（spec）中的名称不同。

  <a name="CustomResourceDefinitionNames"></a>
  <!--
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **acceptedNames.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.
  -->

  **CustomResourceDefinitionNames 表示提供此 CustomResourceDefinition 资源的名称。**

  - **acceptedNames.kind** (string)，必需

    kind 是资源的序列化类型。它通常是驼峰命名的单数形式。自定义资源实例将使用此值作为 API 调用中的 `kind` 属性。

  <!--
  - **acceptedNames.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.
  -->

  - **acceptedNames.plural** (string)，必需

    plural 是所提供的资源的复数名称，自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供。
    必须与 CustomResourceDefinition 的名称匹配（格式为 `<names.plural>.<group>`）。必须全部小写。

  - **acceptedNames.categories** ([]string)

    <!--
    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.
    -->

    categories 是此自定义资源所属的分组资源列表（例如 'all'）。
    它在 API 发现文档中发布，并被客户端用于支持像 `kubectl get all` 这样的调用。

  - **acceptedNames.listKind** (string)

    <!--
    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".
    -->

    listKind 是此资源列表的序列化类型。默认为 "`<kind>List`"。

  - **acceptedNames.shortNames** ([]string)

    <!--
    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.
    -->

    shortNames 是资源的短名称，在 API 发现文档中公开，并支持客户端调用，如 `kubectl get <shortname>`。必须全部小写。

  - **acceptedNames.singular** (string)

    <!--
    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.
    -->

    singular 是资源的单数名称。必须全部小写。默认为小写形式的 `kind`。

- **conditions** ([]CustomResourceDefinitionCondition)

  <!--
  *Map: unique values on key type will be kept during a merge*
  
  conditions indicate state for particular aspects of a CustomResourceDefinition
  -->

  **Map：合并时将保留 type 键的唯一值**

  conditions 表示 CustomResourceDefinition 特定方面的状态

  <a name="CustomResourceDefinitionCondition"></a>
  <!--
  *CustomResourceDefinitionCondition contains details for the current condition of this pod.*

  - **conditions.status** (string), required

    status is the status of the condition. Can be True, False, Unknown.
  -->

  **CustomResourceDefinitionCondition 包含此 Pod 当前状况的详细信息。**

  - **conditions.status** (string)，必需

    status 表示状况（Condition）的状态，取值为 True、False 或 Unknown 之一。

  <!--
  - **conditions.type** (string), required

    type is the type of the condition. Types include Established, NamesAccepted and Terminating.
  -->

  - **conditions.type** (string)，必需

    type 是条件的类型。类型包括：Established、NamesAccepted 和 Terminating。

  - **conditions.lastTransitionTime** (Time)

    <!--
    lastTransitionTime last time the condition transitioned from one status to another.
    -->

    lastTransitionTime 是上一次发生状况状态转换的时间。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

  - **conditions.message** (string)

    <!--
    message is a human-readable message indicating details about last transition.
    -->

    message 是有关上次转换的详细可读信息。

  - **conditions.reason** (string)

    <!--
    reason is a unique, one-word, CamelCase reason for the condition's last transition.
    -->

    reason 表述状况上次转换原因的、驼峰格式命名的、唯一的一个词。

- **storedVersions** ([]string)

  <!--
  storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list.
  -->

  storedVersions 列出了曾经被持久化的所有 CustomResources 版本。跟踪这些版本可以为 etcd 中的存储版本提供迁移路径。
  该字段是可变的，因此迁移控制器可以完成到另一个版本的迁移（确保存储中没有遗留旧对象），然后从该列表中删除其余版本。
  当版本在此列表中时，则不能从 `spec.versions` 中删除。

## CustomResourceDefinitionList {#CustomResourceDefinitionList}
<!--
CustomResourceDefinitionList is a list of CustomResourceDefinition objects.
-->
CustomResourceDefinitionList 是 CustomResourceDefinition 对象的列表。

<hr>

<!--
- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>), required

  items list individual CustomResourceDefinition objects
-->

- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>)，必需

  items 列出单个 CustomResourceDefinition 对象。

- **apiVersion** (string)

  <!--
  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  -->

  apiVersion 定义对象表示的版本化模式。服务器应将已识别的模式转换为最新的内部值，并可能拒绝未识别的值。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  <!--
  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  kind 是一个字符串值，表示该对象所表示的 REST 资源。服务器可以从客户端提交请求的端点推断出 REST 资源。
  不能被更新。驼峰命名。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  标准的对象元数据，更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

## Operations {#Operations}

<hr>

<!--
### `get` read the specified CustomResourceDefinition

#### HTTP Request
-->
### `get` 读取指定的 CustomResourceDefinition

#### HTTP 请求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `get` 读取指定 CustomResourceDefinition 的状态

#### HTTP 请求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CustomResourceDefinition

#### HTTP Request
-->
### `list` 列出或观察 CustomResourceDefinition 类型的对象

#### HTTP 请求

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters
-->
#### 参数

- **allowWatchBookmarks** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionList" >}}">CustomResourceDefinitionList</a>): OK

401: Unauthorized

<!--
### `create` create a CustomResourceDefinition

#### HTTP Request
-->
### `create` 创建一个 CustomResourceDefinition

#### HTTP 请求

POST /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 参数

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

202 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CustomResourceDefinition

#### HTTP Request
-->
### `update` 替换指定的 CustomResourceDefinition

#### HTTP 请求

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `update` 替换指定 CustomResourceDefinition 的状态

#### HTTP 请求

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **body**：<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>，必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CustomResourceDefinition

#### HTTP Request
-->
### `patch` 部分更新指定的 CustomResourceDefinition

#### HTTP 请求

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**<!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified CustomResourceDefinition

#### HTTP Request
-->
### `patch` 部分更新指定 CustomResourceDefinition 的状态

#### HTTP 请求

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
#### 参数

- **name** （**路径参数**）：string，必需

  CustomResourceDefinition 的名称。

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

<!--
### `delete` delete a CustomResourceDefinition

#### HTTP Request
-->
### `delete` 删除一个 CustomResourceDefinition

#### HTTP 请求

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CustomResourceDefinition
-->
#### 参数

- **name** （**路径参数**）：string，必需
  
  CustomResourceDefinition 的名称。

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CustomResourceDefinition

#### HTTP Request
-->
### `deletecollection` 删除 CustomResourceDefinition 的集合

#### HTTP 请求

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions

<!--
#### Parameters
-->
#### 参数

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
