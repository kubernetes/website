---
title: 變更性准入策略
content_type: concept
---
<!--
reviewers:
- deads2k
- sttts
- cici37
title: Mutating Admission Policy
content_type: concept
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}
<!-- due to feature gate history, use manual version specification here -->

<!--
This page provides an overview of _MutatingAdmissionPolicies_.
-->
本頁概要介紹 **MutatingAdmissionPolicy（變更性准入策略）**。

<!-- body -->

<!--
## What are MutatingAdmissionPolicies?

Mutating admission policies offer a declarative, in-process alternative to mutating admission webhooks.
-->
## 什麼是 MutatingAdmissionPolicy？   {#what-are-mutatingadmissionpolicies}

變更性准入策略（Mutating Admission Policy）提供了一種聲明式的、進程內的方案，
可以用來替代變更性准入 Webhook。

<!--
Mutating admission policies use the Common Expression Language (CEL) to declare mutations to resources.
Mutations can be defined either with an *apply configuration* that is merged using the
[server side apply merge strategy](/docs/reference/using-api/server-side-apply/#merge-strategy),
or a [JSON patch](https://jsonpatch.com/).

Mutating admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.
-->
變更性准入策略使用通用表達語言（Common Expression Language，CEL）來聲明對資源的變更。
變更操作可以通過使用[服務器端應用合併策略](/zh-cn/docs/reference/using-api/server-side-apply/#merge-strategy)所合併的**應用配置**來定義，
也可以使用 [JSON 補丁](https://jsonpatch.com/)來定義。

變更性准入策略的可配置能力很強，策略的編寫者可以根據集羣管理員的需要，定義參數化的策略以及限定到某類資源的策略。

<!--
## What resources make a policy

A policy is generally made up of three resources:

- The MutatingAdmissionPolicy describes the abstract logic of a policy
  (think: "this policy sets a particular label to a particular value").
-->
## 策略包含哪些資源   {#what-resources-make-a-policy}

策略通常由三種資源組成：

- MutatingAdmissionPolicy 描述策略的抽象邏輯（可以理解爲：“此策略將特定標籤設置爲特定值”）。

<!--
- A _parameter resource_ provides information to a MutatingAdmissionPolicy to make it a concrete
  statement (think "set the `owner` label to something like `company.example.com`").
  Parameter resources refer to Kubernetes resources, available in the Kubernetes API. They can be built-in types or extensions,
  such as a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD). For example, you can use a ConfigMap as a parameter.
- A MutatingAdmissionPolicyBinding links the above (MutatingAdmissionPolicy and parameter) resources together and provides scoping.
  If you only want to set an `owner` label for `Pods`, and not other API kinds, the binding is where you
  specify this mutation.
-->
- 爲 MutatingAdmissionPolicy 提供信息的一個**參數資源（parameter resource）**，
  有了參數之後，策略成爲一條具體的語句
 （假想：“將 `owner` 標籤設置爲類似 `company.example.com` 的值”）。
  參數資源引用 Kubernetes API 中可用的 Kubernetes 某種資源。被引用的資源可以是內置類別或類似
  {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}（CRD）這種擴展資源。
  例如，你可以使用 ConfigMap 作爲參數。

- MutatingAdmissionPolicyBinding 將上述兩種資源（MutatingAdmissionPolicy 和參數）關聯在一起，
  並提供作用域限定。如果你只想爲 `Pods` 設置 `owner` 標籤，而不想爲其他 API 類別設置標籤，
  則綁定就是你用來限定此變更的地方。

<!--
At least a MutatingAdmissionPolicy and a corresponding MutatingAdmissionPolicyBinding
must be defined for a policy to have an effect.

If a MutatingAdmissionPolicy does not need to be configured via parameters, simply leave
`spec.paramKind` in  MutatingAdmissionPolicy not specified.
-->
你必須定義至少一個 MutatingAdmissionPolicy 和一個相應的 MutatingAdmissionPolicyBinding，
才能使策略生效。

如果 MutatingAdmissionPolicy 不需要通過參數進行配置，在
MutatingAdmissionPolicy 中不指定 `spec.paramKind` 即可。

<!--
## Getting Started with MutatingAdmissionPolicies

Mutating admission policy is part of the cluster control-plane. You should write
and deploy them with great caution. The following describes how to quickly
experiment with Mutating admission policy.
-->
## 開始使用 MutatingAdmissionPolicy   {#getting-started-with-mutatingadmissionpolicies}

變更性准入策略是集羣控制平面的一部分。你在編寫和部署這些策略時要非常謹慎。
下文描述如何快速試用變更性准入策略。

<!--
### Create a MutatingAdmissionPolicy

The following is an example of a MutatingAdmissionPolicy. This policy mutates newly created Pods to have a sidecar container if it does not exist.
-->
### 創建 MutatingAdmissionPolicy   {#create-a-mutatingadmissionpolicy}

以下是一個 MutatingAdmissionPolicy 的示例。
此策略會將變更新建的 Pod，爲其添加一個邊車容器（如果以前沒有邊車容器的話）。

{{% code_sample language="yaml" file="mutatingadmissionpolicy/applyconfiguration-example.yaml" %}}

<!--
The `.spec.mutations` field consists of a list of expressions that evaluate to resource patches.
The emitted patches may be either [apply configurations](#patch-type-apply-configuration) or [JSON Patch](#patch-type-json-patch)
patches. You cannot specify an empty list of mutations. After evaluating all the
expressions, the API server applies those changes to the resource that is
passing through admission.
-->
`.spec.mutations` 字段由一系列表達式組成，這些表達式求值後將形成資源補丁。
所生成的補丁可以是[應用配置](#patch-type-apply-configuration)或 [JSON 補丁](#patch-type-json-patch)。
你不能將 mutations 設置爲空列表。在對所有表達式求值後，API 服務器將所得到的變更應用到正在通過准入階段的資源。

<!--
To configure a mutating admission policy for use in a cluster, a binding is
required. The MutatingAdmissionPolicy will only be active if a corresponding
binding exists with the referenced `spec.policyName` matching the `spec.name` of
a policy.

Once the binding and policy are created, any resource request that matches the
`spec.matchConditions` of a policy will trigger the set of mutations defined.

In the example above, creating a Pod will add the `mesh-proxy` initContainer mutation:
-->
要配置變更准入策略以便用於某個集羣中，需要先創建綁定。
只有存在 `spec.policyName` 字段值與某策略的 `spec.name` 相匹配的綁定時，該策略纔會生效。

一旦創建了綁定和策略，策略的 `spec.matchConditions` 相匹配的所有資源請求都會觸發已定義的所有變更集合。

在上面的示例中，創建 Pod 將觸發添加 `mesh-proxy` initContainer 這一變更：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
spec:
  ...
  initContainers:
  - name: mesh-proxy
    image: mesh/proxy:v1.0.0
    args: ["proxy", "sidecar"]
    restartPolicy: Always
  - name: myapp-initializer
    image: example/initializer:v1.0.0
  ...
```

<!--
#### Parameter resources

Parameter resources allow a policy configuration to be separate from its
definition. A policy can define `paramKind`, which outlines GVK of the parameter
resource, and then a policy binding ties a policy by name (via `policyName`) to a
particular parameter resource via `paramRef`.

Please refer to [parameter resources](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) for more information.
-->
#### 參數資源   {#parameter-resources}

使用參數資源，我們可以將策略配置與其定義分隔開。策略可以定義 `paramKind`，劃定參數資源的 GVK，
隨後的策略綁定操作會通過 `paramRef` 按名稱（通過 `policyName`）將某個策略綁定到特定參數資源。

有關細節參閱[參數資源](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources)。

#### `ApplyConfiguration` {#patch-type-apply-configuration}

<!--
MutatingAdmissionPolicy expressions are always CEL. Each apply configuration
`expression` must evaluate to a CEL object (declared using `Object()`
initialization).

Apply configurations may not modify atomic structs, maps or arrays due to the risk of accidental deletion of
values not included in the apply configuration.
-->
MutatingAdmissionPolicy 表達式始終是 CEL 格式的。
每個應用配置 `expression` 必須求值爲（使用 `Object()` 初始化聲明的）CEL 對象。

這些應用配置不能修改原子結構、映射或數組，因爲這類修改可能導致意外刪除未包含在應用配置中的值。

<!--
CEL expressions have access to the object types needed to create apply configurations:

- `Object` - CEL type of the resource object.
- `Object.<fieldName>` - CEL type of object field (such as `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - CEL type of nested field (such as `Object.spec.containers`)
-->
CEL 表達式可以訪問以 CEL 變量組織起來的 API 請求內容及一些其他有用變量：

- `Object` - 資源對象的 CEL 類型。
- `Object.<fieldName>` - 對象字段的 CEL 類型（例如 `Object.spec`）
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - 嵌套字段的 CEL 類型（例如 `Object.spec.containers`）

<!--
CEL expressions have access to the contents of the API request, organized into CEL variables as well as some other useful variables:

- `object` - The object from the incoming request. The value is null for DELETE requests.
- `oldObject` - The existing object. The value is null for CREATE requests.
- `request` - Attributes of the API request.
- `params` - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind.
-->
CEL 表達式可以訪問以 CEL 變量組織起來的 API 請求內容及一些其他有用變量：

- `object` - 來自傳入請求的對象。對於 DELETE 請求，取值爲 null。
- `oldObject` - 現有對象。對於 CREATE 請求，取值爲 null。
- `request` - API 請求的屬性。
- `params` - 正被評估的策略綁定所引用到的參數資源。僅在策略設置了 `paramKind` 時填充。
<!--
- `namespaceObject` - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources.
- `variables` - Map of composited variables, from its name to its lazily evaluated value.
  For example, a variable named `foo` can be accessed as `variables.foo`.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - A CEL ResourceCheck constructed from the `authorizer` and configured with the
  request resource.
-->
- `namespaceObject` - 傳入對象所屬的命名空間對象。對於集羣範圍的資源，取值爲 null。
- `variables` - 組合變量的映射，包含從變量名稱到其惰性評估值的映射。
  例如，名爲 `foo` 的變量可以以 `variables.foo` 的方式訪問。
- `authorizer` - 一個 CEL 鑑權器。可用於對請求的主體（用戶或服務賬戶）進行鑑權檢查。
  參閱 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - 從 `authorizer` 構建並使用請求資源配置的 CEL ResourceCheck。

<!--
The `apiVersion`, `kind`, `metadata.name`, `metadata.generateName` and `metadata.labels` are always accessible from the root of the  
object. No other metadata properties are accessible.
-->
`apiVersion`、`kind`、`metadata.name`、`metadata.generateName` 和 `metadata.labels`
始終可以從對象的根進行訪問。其他元數據屬性不可訪問。

#### `JSONPatch` {#patch-type-json-patch}

<!--
The same mutation can be written as a [JSON Patch](https://jsonpatch.com/) as follows:
-->
相同的變更可以被寫成以下的 [JSON 補丁](https://jsonpatch.com/)：

{{% code_sample language="yaml" file="mutatingadmissionpolicy/json-patch-example.yaml" %}}

<!--
The expression will be evaluated by CEL to create a [JSON patch](https://jsonpatch.com/).
ref: https://github.com/google/cel-spec

Each evaluated `expression` must return an array of `JSONPatch` values. The  
`JSONPatch` type represents one operation from a JSON patch.

For example, this CEL expression returns a JSON patch to conditionally modify a value:
-->
表達式將通過 CEL 求值，以創建 [JSON 補丁](https://jsonpatch.com/)。
參閱 https://github.com/google/cel-spec

每個被求值的 `expression` 必須返回 `JSONPatch` 值形成的數組。
`JSONPatch` 類型表示 JSON 補丁中的一個操作。

例如，下面的 CEL 表達式返回 JSON 補丁，用於有條件地修改某個值：

```
  [
    JSONPatch{op: "test", path: "/spec/example", value: "Red"},
    JSONPatch{op: "replace", path: "/spec/example", value: "Green"}
  ]
```

<!--
To define a JSON object for the patch operation `value`, use CEL `Object` types. For example:
-->
要爲補丁操作 `value` 定義 JSON 對象，可以使用 CEL `Object` 類型。例如：

```
  [
    JSONPatch{
      op: "add",
      path: "/spec/selector",
      value: Object.spec.selector{matchLabels: {"environment": "test"}}
    }
  ]
```

<!--
To use strings containing '/' and '~' as JSONPatch path keys, use `jsonpatch.escapeKey()`. For example:
-->
要使用包含 '/' 和 '~' 的字符串作爲 JSONPatch 路徑鍵，可以使用 `jsonpatch.escapeKey()`。例如：

```
  [
    JSONPatch{
      op: "add",
      path: "/metadata/labels/" + jsonpatch.escapeKey("example.com/environment"),
      value: "test"
    },
  ]
```

<!--
CEL expressions have access to the types needed to create JSON patches and objects:

- `JSONPatch` - CEL type of JSON Patch operations. JSONPatch has the fields `op`, `from`, `path` and `value`.
  See [JSON patch](https://jsonpatch.com/) for more details. The `value` field may be set to any of: string,
  integer, array, map or object.  If set, the `path` and `from` fields must be set to a
  [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901/) string, where the `jsonpatch.escapeKey()` CEL
  function may be used to escape path keys containing `/` and `~`.
-->
CEL 表達式可以訪問創建 JSON 補丁和對象所需的類型：

- `JSONPatch` - JSON 補丁操作的 CEL 類型。JSONPatch 具有 `op`、`from`、`path` 和 `value` 字段。
  有關細節參閱 [JSON 補丁](https://jsonpatch.com/)。
  `value` 字段可以設置爲字符串、整數、數組、映射或對象。
  如果設置，`path` 和 `from` 字段的值必須爲
  [JSON 指針](https://datatracker.ietf.org/doc/html/rfc6901/)字符串，
  可以在指針中使用 `jsonpatch.escapeKey()` CEL 函數來轉義包含 `/` 和 `~` 的路徑鍵。
<!--
- `Object` - CEL type of the resource object.
- `Object.<fieldName>` - CEL type of object field (such as `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - CEL type of nested field (such as `Object.spec.containers`)
-->
- `Object` - 資源對象的 CEL 類型。
- `Object.<fieldName>` - 對象字段的 CEL 類型（例如 `Object.spec`）
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - 嵌套字段的 CEL 類型（例如 `Object.spec.containers`）

<!--
CEL expressions have access to the contents of the API request, organized into CEL variables as well as some other useful variables:

- `object` - The object from the incoming request. The value is null for DELETE requests.
- `oldObject` - The existing object. The value is null for CREATE requests.
- `request` - Attributes of the API request.
- `params` - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind.
-->
CEL 表達式可以訪問以 CEL 變量組織的 API 請求的內容及一些其他有用變量：

- `object` - 來自傳入請求的對象。對於 DELETE 請求，取值爲 null。
- `oldObject` - 現有對象。對於 CREATE 請求，取值爲 null。
- `request` - API 請求的屬性。
- `params` - 正被評估的策略綁定所引用的參數資源。僅在策略具有 `paramKind` 時填充。
<!--
- `namespaceObject` - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources.
- `variables` - Map of composited variables, from its name to its lazily evaluated value.
  For example, a variable named `foo` can be accessed as `variables.foo`.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - A CEL ResourceCheck constructed from the `authorizer` and configured with the
  request resource.
-->
- `namespaceObject` - 傳入對象所屬的命名空間對象。對於集羣範圍的資源，取值爲 null。
- `variables` - 組合變量的映射，包含從變量名稱到其惰性評估值的映射。
  例如，名爲 `foo` 的變量可以以 `variables.foo` 的形式訪問。
- `authorizer` - 一個 CEL 鑑權組件。可用於對請求的主體（用戶或服務賬戶）執行鑑權檢查。
  參閱 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - 從 `authorizer` 構建並以請求資源配置的 CEL ResourceCheck。

<!--
CEL expressions have access to [Kubernetes CEL function libraries](/docs/reference/using-api/cel/#cel-options-language-features-and-libraries)
as well as:

- `jsonpatch.escapeKey` - Performs JSONPatch key escaping. `~` and  `/` are escaped as `~0` and `~1` respectively.

Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible.
-->
CEL 表達式可以訪問
[Kubernetes CEL 函數庫](/zh-cn/docs/reference/using-api/cel/#cel-options-language-features-and-libraries)以及：

- `jsonpatch.escapeKey` - 執行 JSONPatch 鍵轉義。`~` 和 `/` 分別被轉義爲 `~0` 和 `~1`。

只有格式爲 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的屬性名稱是可訪問的。

<!--
## API kinds exempt from mutating admission

There are certain API kinds that are exempt from admission-time mutation. For example, you can't create a MutatingAdmissionPolicy that changes a MutatingAdmissionPolicy.

The list of exempt API kinds is:
-->
## 豁免變更性准入的 API 類別   {#api-kinds-exempt-from-mutating-admission}

某些 API 類別可以豁免准入時變更。例如，你無法創建更改 MutatingAdmissionPolicy
的 MutatingAdmissionPolicy。

豁免變更性准入的 API 類別列表如下：

* [ValidatingAdmissionPolicies]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-v1/" >}})
* [ValidatingAdmissionPolicyBindings]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-binding-v1/" >}})
* MutatingAdmissionPolicies
* MutatingAdmissionPolicyBindings
* [TokenReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/token-review-v1/" >}})
* [LocalSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/local-subject-access-review-v1/" >}})
* [SelfSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/" >}})
* [SelfSubjectReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/" >}})
