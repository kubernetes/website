---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingWebhookConfiguration"
content_type: "api_reference"
description: "MutatingWebhookConfiguration 描述准入 Webhook 的配置，该 Webhook 可在更改对象的情况下接受或拒绝对象请求"
title: "MutatingWebhookConfiguration"
weight: 2
---

<!-- 
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingWebhookConfiguration"
content_type: "api_reference"
description: "MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and object without changing it."
title: "MutatingWebhookConfiguration"
weight: 3
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## MutatingWebhookConfiguration {#MutatingWebhookConfiguration}

<!-- 
MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and may change the object.
-->
MutatingWebhookConfiguration 描述准入 Webhook 的配置，该 Webhook 可接受或拒绝对象请求，并且可能变更对象。

<hr>

- **apiVersion**：admissionregistration.k8s.io/v1

- **kind**：MutatingWebhookConfiguration
<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. 
-->

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据，更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

<!-- 
- **webhooks** ([]MutatingWebhook)

  *Patch strategy: merge on key `name`*
  
  Webhooks is a list of webhooks and the affected resources and operations.

  <a name="MutatingWebhook"></a>
  *MutatingWebhook describes an admission webhook and the resources and operations it applies to.* 
-->

- **webhooks** ([]MutatingWebhook)

  **补丁策略：根据 `name` 键执行合并操作**

  webhooks 是 Webhook 及其所影响的资源和操作的列表。

  <a name="MutatingWebhook"></a>
  **MutatingWebhook 描述了一个准入 Webhook 及其适用的资源和操作。**

  <!-- 
  - **webhooks.admissionReviewVersions** ([]string), required

    AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy. 
  -->

  - **webhooks.admissionReviewVersions** ([]string), 必需

    admissionReviewVersions 是 Webhook 期望的 `AdmissionReview` 版本的优选顺序列表。
    API 服务器将尝试使用它所支持的版本列表中的第一个版本。如果 API 服务器不支持此列表中设置的任何版本，则此对象将验证失败。
    如果持久化的 Webhook 配置指定了所允许的版本，但其中不包括 API 服务器所知道的任何版本，
    则对 Webhook 的调用将失败并根据失败策略进行处理。

  <!-- 
  - **webhooks.clientConfig** (WebhookClientConfig), required

    ClientConfig defines how to communicate with the hook. Required

    <a name="WebhookClientConfig"></a>
    *WebhookClientConfig contains the information to make a TLS connection with the webhook* 
  -->

  - **webhooks.clientConfig** (WebhookClientConfig), 必需

    clientConfig 定义了如何与 Webhook 通信。必需。

    <a name="WebhookClientConfig"></a>
    **WebhookClientConfig 包含与 Webhook 建立 TLS 连接的信息**

      <!-- 
      - **webhooks.clientConfig.caBundle** ([]byte)

        `caBundle` is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used. 
      -->

    - **webhooks.clientConfig.caBundle** ([]byte)

      `caBundle` 是一个 PEM 编码的 CA 包，将用于验证 Webhook 的服务证书。如果未指定，则使用 apiserver 上的系统信任根。

    <!-- 
    - **webhooks.clientConfig.service** (ServiceReference)

      `service` is a reference to the service for this webhook. Either `service` or `url` must be specified.
      
      If the webhook is running within the cluster, then you should use `service`.

      <a name="ServiceReference"></a>
      *ServiceReference holds a reference to Service.legacy.k8s.io* 
    -->

    - **webhooks.clientConfig.service** (ServiceReference)

      `service` 是对此 Webhook 的服务的引用。必须指定 `service` 或 `url` 之一。

      如果 Webhook 在集群中运行，那么你应该使用 `service`。

      <a name="ServiceReference"></a>
      **ServiceReference 包含对 Service.legacy.k8s.io 的引用**

        <!-- 
        - **webhooks.clientConfig.service.name** (string), required

          `name` is the name of the service. Required 
        -->

      - **webhooks.clientConfig.service.name** (string), 必需

        `name` 是服务的名称。必需。

      <!-- 
      - **webhooks.clientConfig.service.namespace** (string), required

        `namespace` is the namespace of the service. Required 
      -->

      - **webhooks.clientConfig.service.namespace** (string), 必需

        `namespace` 是服务的命名空间。必需。

      <!-- 
      - **webhooks.clientConfig.service.path** (string)

        `path` is an optional URL path which will be sent in any request to this service. 
      -->

      - **webhooks.clientConfig.service.path** (string)

        `path` 是一个可选的 URL 路径，在针对此服务的所有请求中都会发送此路径。

      <!-- 
      - **webhooks.clientConfig.service.port** (int32)

        If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). 
      -->

      - **webhooks.clientConfig.service.port** (int32)

        如果指定了，则为托管 Webhook 的服务上的端口。默认为 443 以实现向后兼容。
        `port` 应该是一个有效的端口号（包括 1-65535）。

    <!-- 
    - **webhooks.clientConfig.url** (string)

      `url` gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
      
      The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
      
      Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
      
      The scheme must be "https"; the URL must begin with "https://".
      
      A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
      
      Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either. 
    -->

    - **webhooks.clientConfig.url** (string)

      `url` 以标准 URL 形式（`scheme://host:port/path`）给出了 Webhook 的位置。必须指定 `url` 或 `service` 中的一个。

      `host` 不能用来引用集群中运行的服务；这种情况应改用 `service` 字段。在某些 API 服务器上，可能会通过外部 DNS 解析 `host` 值。
      （例如，`kube-apiserver` 无法解析集群内 DNS，因为这会违反分层原理）。`host` 也可以是 IP 地址。

      请注意，使用 `localhost` 或 `127.0.0.1` 作为 `host` 是有风险的，除非你非常小心地在运行 apiserver 的所有主机上运行此 Webhook，
      而这些 API 服务器可能需要调用此 Webhook。此类部署可能是不可移植的，即不容易在新集群中重复安装。

      该方案必须是 “https”；URL 必须以 “https://” 开头。

      路径是可选的，如果存在，可以是 URL 中允许的任何字符串。你可以使用路径将任意字符串传递给 Webhook，例如集群标识符。

      不允许使用用户或基本身份验证，例如不允许使用 “user:password@”。
      不允许使用片段（“#...”）和查询参数（“?...”）。

  <!-- 
  - **webhooks.name** (string), required

    The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required. 
  -->

  - **webhooks.name** (string), 必需

    准入 Webhook 的名称。应该是完全限定的名称，例如 imagepolicy.kubernetes.io，其中 “imagepolicy” 是 Webhook 的名称，
    kubernetes.io 是组织的名称。必需。

  <!-- 
  - **webhooks.sideEffects** (string), required

    SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some. 
  -->

  - **webhooks.sideEffects** (string), 必需

    sideEffects 说明此 Webhook 是否有副作用。可接受的值为：None、NoneOnDryRun
    （通过 v1beta1 创建的 Webhook 也可以指定 Some 或 Unknown）。
    具有副作用的 Webhook 必须实现协调系统，因为请求可能会被准入链中的未来步骤拒绝，因此需要能够撤消副作用。
    如果请求与带有 sideEffects == Unknown 或 Some 的 Webhook 匹配，则带有 dryRun 属性的请求将被自动拒绝。

  <!-- 
  - **webhooks.failurePolicy** (string)

    FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail. 
  -->

  - **webhooks.failurePolicy** (string)

    failurePolicy 定义如何处理来自准入端点的无法识别的错误 - 允许的值是 Ignore 或 Fail。默认为 Fail。

  <!--
  - **webhooks.matchConditions** ([]MatchCondition)

    *Patch strategy: merge on key `name`*
   
    *Map: unique values on key name will be kept during a merge*
  -->
  
  - **webhooks.matchConditions** ([]MatchCondition)

    **补丁策略：根据 `name` 键执行合并操作**

    **映射：键 `name` 的唯一值将在合并过程中保留**

    <!--
    MatchConditions is a list of conditions that must be met for a request to be sent to this webhook. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.
    -->
    
    matchConditions 是将请求发送到此 webhook 之前必须满足的条件列表。
    匹配条件过滤已经被 rules、namespaceSelector、objectSelector 匹配的请求。
    matchConditions 取值为空列表时匹配所有请求。最多允许 64 个匹配条件。
  
    <!--
    The exact matching logic is (in order):
      1. If ANY matchCondition evaluates to FALSE, the webhook is skipped.
      2. If ALL matchConditions evaluate to TRUE, the webhook is called.
      3. If any matchCondition evaluates to an error (but none are FALSE):
        - If failurePolicy=Fail, reject the request
        - If failurePolicy=Ignore, the error is ignored and the webhook is skipped
    -->
    
    精确匹配逻辑是（按顺序）:
    1. 如果任一 matchCondition 的计算结果为 FALSE，则跳过该 webhook。
    2. 如果所有 matchConditions 的计算结果为 TRUE，则调用该 webhook。
    3. 如果任一 matchCondition 的计算结果为错误（但都不是 FALSE）：
       - 如果 failurePolicy=Fail，拒绝该请求；
       - 如果 failurePolicy=Ignore，忽略错误并跳过该 webhook。

    <!--
    This is an beta feature and managed by the AdmissionWebhookMatchConditions feature gate.
  
    <a name="MatchCondition"></a>
    *MatchCondition represents a condition which must by fulfilled for a request to be sent to a webhook.*
    -->
    
    这是一个 Beta 功能特性，由 AdmissionWebhookMatchConditions 特性门控管理。

    <a name="MatchCondition"></a>
    **MatchCondition 表示将请求发送到 Webhook 之前必须满足的条件。**

    <!--
    - **webhooks.matchConditions.expression** (string), required

      Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:
    -->
    
    - **webhooks.matchConditions.expression** (string), 必需

      expression 表示将由 CEL 求值的表达式。求值结果必须是 bool 值。CEL 表达式可以访问
      以 CEL 变量的形式给出的 AdmissionRequest 和 Authorizer 的内容：
  
      <!--
      'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
      -->
      
      - 'object' - 来自传入请求的对象。对于 DELETE 请求，该值为 null。
      - 'oldObject' - 现有对象。对于 CREATE 请求，该值为 null。
      - 'request' - 准入请求的属性(/pkg/apis/admission/types.go#AdmissionRequest)。
      - 'authorizer' - CEL 授权者。可用于对请求的主体（用户或服务账号）执行授权检查。

        <!--
        See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
        -->
        
        参阅： https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz

      <!--
      'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the
        request resource.
      Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
  
      Required.
      -->
      
      - 'authorizer.requestResource' - CEL ResourceCheck 从"授权方"构建并配置请求资源。
  
      CEL 文档： https://kubernetes.io/zh-cn/docs/reference/using-api/cel/

      此字段为必需字段。

      <!--
      - **webhooks.matchConditions.name** (string), required

        Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')   

        Required.
      -->
      
      - **webhooks.matchConditions.name** (string), 必需

        name 是此匹配条件的标识符，用于 MatchConditions 的策略性合并，
        以及提供用于日志目的的标识符。一个好的 name 应该是对相关表达式的描述。
        name 必须是由字母数字字符 `-`、`_` 或 `.` 组成的限定名称，
        并且必须以字母、数字字符开头和结尾（例如 `MyName`、`my.name` 或 `123-abc`，
        用于验证 name 的正则表达式是 `([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]`）。
        带有可选的 DNS 子域前缀和 `/`（例如 `example.com/MyName`）

        此字段为必需字段。

  <!-- 
  - **webhooks.matchPolicy** (string)

    matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
    
    - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.
    
    - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.
    
    Defaults to "Equivalent" 
  -->

  - **webhooks.matchPolicy** (string)

    matchPolicy 定义了如何使用 “rules” 列表来匹配传入的请求。允许的值为 “Exact” 或 “Equivalent”。

    - Exact: 仅当请求与指定规则完全匹配时才匹配请求。
      例如，如果可以通过 apps/v1、apps/v1beta1 和 extensions/v1beta1 修改 deployments 资源，
      但 “rules” 仅包含 `apiGroups:["apps"]、apiVersions:["v1"]、resources:["deployments"]`，
      对 apps/v1beta1 或 extensions/v1beta1 的请求不会被发送到 Webhook。

    - Equivalent: 如果针对的资源包含在 “rules” 中，即使请求是通过另一个 API 组或版本提交，也会匹配。
      例如，如果可以通过 apps/v1、apps/v1beta1 和 extensions/v1beta1 修改 deployments 资源，
      并且 “rules” 仅包含 `apiGroups:["apps"]、apiVersions:["v1"]、resources:["deployments "]`，
      对 apps/v1beta1 或 extensions/v1beta1 的请求将被转换为 apps/v1 并发送到 Webhook。

    默认为 “Equivalent”。

  - **webhooks.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    <!-- 
    NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.

    For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {
    -->

    namespaceSelector 根据对象的命名空间是否与 selector 匹配来决定是否在该对象上运行 Webhook。
    如果对象本身是 Namespace，则针对 object.metadata.labels 执行匹配。
    如果对象是其他集群作用域资源，则永远不会跳过 Webhook 的匹配动作。

    例如，为了针对 “runlevel” 不为 “0” 或 “1” 的名字空间中的所有对象运行 Webhook；
    你可以按如下方式设置 selector :
    ```
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "runlevel",
          "operator": "NotIn",
          "values": [
            "0",
            "1"
          ]
        }
      ]
    }
    ```
    <!-- 
    If instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {
    -->
    
    相反，如果你只想针对 “environment” 为 “prod” 或 “staging” 的名字空间中的对象运行 Webhook；
    你可以按如下方式设置 selector:
    ```
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "environment",
          "operator": "In",
          "values": [
            "prod",
            "staging"
          ]
        }
      ]
    }
    ```
    <!-- 
    See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.

    Default to the empty LabelSelector, which matches everything.  
    -->

    有关标签选择算符的更多示例，请参阅
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels。

    默认为空的 LabelSelector，匹配所有对象。

  <!-- 
  - **webhooks.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything. 
  -->

  - **webhooks.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    objectSelector 根据对象是否具有匹配的标签来决定是否运行 Webhook。
    objectSelector 针对将被发送到 Webhook 的 oldObject 和 newObject 进行评估，如果任一对象与选择器匹配，则视为匹配。
    空对象（create 时为 oldObject，delete 时为 newObject）或不能有标签的对象（如 DeploymentRollback 或 PodProxyOptions 对象）
    认为是不匹配的。
    仅当 Webhook 支持时才能使用对象选择器，因为最终用户可以通过设置标签来跳过准入 Webhook。
    默认为空的 LabelSelector，匹配所有内容。
  

  - **webhooks.reinvocationPolicy** (string)

    <!-- 
    reinvocationPolicy indicates whether this webhook should be called multiple times as part of a single admission evaluation. Allowed values are "Never" and "IfNeeded".

        Never: the webhook will not be called more than once in a single admission evaluation.
    
    IfNeeded: the webhook will be called at least one additional time as part of the admission evaluation if the object being admitted is modified by other admission plugins after the initial webhook call. Webhooks that specify this option *must* be idempotent, able to process objects they previously admitted. Note: * the number of additional invocations is not guaranteed to be exactly one. * if additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again. * webhooks that use this option may be reordered to minimize the number of additional invocations. * to validate an object after all mutations are guaranteed complete, use a validating admission webhook instead.
    
    Defaults to "Never". 
    -->

    reinvocationPolicy 表示这个 Webhook 是否可以被多次调用，作为一次准入评估的一部分。可取值有 “Never” 和 “IfNeeded”。

    - Never: 在一次录取评估中，Webhook 被调用的次数不会超过一次。
    - IfNeeded：如果被录取的对象在被最初的 Webhook 调用后又被其他录取插件修改，
      那么该 Webhook 将至少被额外调用一次作为录取评估的一部分。
      指定此选项的 Webhook  **必须**是幂等的，能够处理它们之前承认的对象。
      注意：**不保证额外调用的次数正好为1。**
      如果额外的调用导致对对象的进一步修改，Webhook 不保证会再次被调用。
      **使用该选项的 Webhook 可能会被重新排序，以最小化额外调用的数量。**
      在保证所有的变更都完成后验证一个对象，使用验证性质的准入 Webhook 代替。

    默认值为 “Never” 。

  <!-- 
  - **webhooks.rules** ([]RuleWithOperations)

    Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects.

    <a name="RuleWithOperations"></a>
    *RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid.*
  -->

  - **webhooks.rules** ([]RuleWithOperations)

    rules 描述了 Webhook 关心的资源/子资源上有哪些操作。Webhook 关心操作是否匹配**任何**rules。
    但是，为了防止 ValidatingAdmissionWebhooks 和 MutatingAdmissionWebhooks 将集群置于只能完全禁用插件才能恢复的状态，
    ValidatingAdmissionWebhooks 和 MutatingAdmissionWebhooks 永远不会在处理 ValidatingWebhookConfiguration
    和 MutatingWebhookConfiguration 对象的准入请求时被调用。

    <a name="RuleWithOperations"></a>
    **RuleWithOperations 是操作和资源的元组。建议确保所有元组组合都是有效的。**

    <!-- 
    - **webhooks.rules.apiGroups** ([]string)

      *Atomic: will be replaced during a merge*

      APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.apiGroups** ([]string)

      **Atomic: 将在合并期间被替换**
      
      apiGroups 是资源所属的 API 组列表。`*` 是所有组。
      如果存在 `*`，则列表的长度必须为 1。必需。

    <!-- 
    - **webhooks.rules.apiVersions** ([]string)

      *Atomic: will be replaced during a merge*
  
      APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.apiVersions** ([]string)

      **Atomic: 将在合并期间被替换**

      apiVersions 是资源所属的 API 版本列表。`*` 是所有版本。
      如果存在 `*`，则列表的长度必须为 1。必需。

    <!-- 
    - **webhooks.rules.operations** ([]string)

      *Atomic: will be replaced during a merge*

      Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.operations** ([]string)

      **Atomic: 将在合并期间被替换**

      operations 是准入 Webhook 所关心的操作 —— CREATE、UPDATE、DELETE、CONNECT
      或用来指代所有已知操作以及将来可能添加的准入操作的 `*`。
      如果存在 `*`，则列表的长度必须为 1。必需。

    <!-- 
    - **webhooks.rules.resources** ([]string)

      *Atomic: will be replaced during a merge*

      Resources is a list of resources this rule applies to.
      
      For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
      
      If wildcard is present, the validation rule will ensure resources do not overlap with each other.
      
      Depending on the enclosing object, subresources might not be allowed. Required. 
    -->

    - **webhooks.rules.resources** ([]string)

      **Atomic: 将在合并期间被替换**

      resources 是此规则适用的资源列表。

      - `pods` 表示 pods，'pods/log' 表示 pods 的日志子资源。`*` 表示所有资源，但不是子资源。
      - `pods/*` 表示 pods 的所有子资源,
      - `*/scale` 表示所有 scale 子资源,
      - `*/*` 表示所有资源及其子资源。

      如果存在通配符，则验证规则将确保资源不会相互重叠。

      根据所指定的对象，可能不允许使用子资源。必需。

    <!-- 
    - **webhooks.rules.scope** (string)

      scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
    -->

    - **webhooks.rules.scope** (string)

      scope 指定此规则的范围。有效值为 “Cluster”, “Namespaced” 和 “*”。
      “Cluster” 表示只有集群范围的资源才会匹配此规则。
      Namespace API 对象是集群范围的。
      “Namespaced” 意味着只有命名空间作用域的资源会匹配此规则。
      “*” 表示没有范围限制。
      子资源与其父资源的作用域相同。默认为 “*”。

  <!-- 
  - **webhooks.timeoutSeconds** (int32)

    TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds. 
  -->

  - **webhooks.timeoutSeconds** (int32)

    timeoutSeconds 指定此 Webhook 的超时时间。
    超时后，Webhook 的调用将被忽略或 API 调用将根据失败策略失败。
    超时值必须在 1 到 30 秒之间。默认为 10 秒。

## MutatingWebhookConfigurationList {#MutatingWebhookConfigurationList}

<!-- 
MutatingWebhookConfigurationList is a list of MutatingWebhookConfiguration. 
-->
MutatingWebhookConfigurationList 是 MutatingWebhookConfiguration 的列表。

<hr>

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: MutatingWebhookConfigurationList

<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的对象元数据，更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!-- 
- **items** ([]<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>), required

  List of MutatingWebhookConfiguration. 
-->

- **items** ([]<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>), 必需

  MutatingWebhookConfiguration 列表。

<!-- 
## Operations {#Operations}  
-->
## 操作   {#operations}

<hr>

<!-- 
### `get` read the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `get` 读取指定的 MutatingWebhookConfiguration

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 参数

- **name**（**路径参数**）：string, 必需

  MutatingWebhookConfiguration 的名称。

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind MutatingWebhookConfiguration

#### HTTP Request
-->
### `list` 列出或观察 MutatingWebhookConfiguration 类型的对象

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a> 
-->
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!-- 
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a> 
-->

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfigurationList" >}}">MutatingWebhookConfigurationList</a>): OK

401: Unauthorized

<!-- 
### `create` create a MutatingWebhookConfiguration

#### HTTP Request
-->
### `create` 创建一个 MutatingWebhookConfiguration

#### HTTP 请求

POST /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, required
-->
#### 参数

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

202 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Accepted

401: Unauthorized

<!-- 
### `update` replace the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `update` 替换指定的 MutatingWebhookConfiguration

#### HTTP 请求

PUT /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 参数

- **name**（**路径参数**）：string, 必需

  MutatingWebhookConfiguration 的名称。

<!-- 
- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, required
-->

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `patch` 部分更新指定的 MutatingWebhookConfiguration

#### HTTP 请求

PATCH /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 参数

- **name**（**路径参数**）：string, 必需

  MutatingWebhookConfiguration 的名称。

<!-- 
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a> 
-->

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

<!-- 
### `delete` delete a MutatingWebhookConfiguration

#### HTTP Request 
-->
### `delete` 删除 MutatingWebhookConfiguration

#### HTTP 请求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 参数

- **name**（**路径参数**）：string, 必需

  MutatingWebhookConfiguration 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!-- 
### `deletecollection` delete collection of MutatingWebhookConfiguration

#### HTTP Request 
-->
### `deletecollection` 删除 MutatingWebhookConfiguration 的集合

#### HTTP 请求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!-- 
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!-- 
#### Response 
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
