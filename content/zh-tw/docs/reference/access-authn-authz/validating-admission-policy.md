---
title: 驗證准入策略（ValidatingAdmissionPolicy）
content_type: concept
---
<!--
reviewers:
- liggitt
- jpbetz
- cici37
title: Validating Admission Policy
content_type: concept
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.30" >}}

<!--
This page provides an overview of Validating Admission Policy.
-->
本頁面提供驗證准入策略（Validating Admission Policy）的概述。

<!-- body -->

<!--
## What is Validating Admission Policy?

Validating admission policies offer a declarative, in-process alternative to validating admission webhooks.

Validating admission policies use the Common Expression Language (CEL) to declare the validation
rules of a policy.
Validation admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.
-->
## 什麼是驗證准入策略？ {#what-is-validating-admission-policy}

驗證准入策略提供一種聲明式的、進程內的替代方案來驗證准入 Webhook。

驗證准入策略使用通用表達語言 (Common Expression Language，CEL) 來聲明策略的驗證規則。
驗證准入策略是高度可設定的，使設定策略的作者能夠根據叢集管理員的需要，
定義可以參數化並限定到資源的策略。

<!--
## What Resources Make a Policy

A policy is generally made up of three resources:
-->
## 哪些資源構成策略  {#what-resources-make-a-policy}

策略通常由三種資源構成：

<!--
- The `ValidatingAdmissionPolicy` describes the abstract logic of a policy
  (think: "this policy makes sure a particular label is set to a particular value").

- A parameter resource provides information to a ValidatingAdmissionPolicy to make it a concrete
  statement (think "the `owner` label must be set to something that ends in `.company.com`").
  A native type such as ConfigMap or a CRD defines the schema of a parameter resource.
  `ValidatingAdmissionPolicy` objects specify what Kind they are expecting for their parameter resource.

- A `ValidatingAdmissionPolicyBinding` links the above resources together and provides scoping.
  If you only want to require an `owner` label to be set for `Pods`, the binding is where you would
  specify this restriction.
-->
- `ValidatingAdmissionPolicy` 描述策略的抽象邏輯（想想看：“這個策略確保一個特定標籤被設置爲一個特定值”）。

- 參數資源爲 `ValidatingAdmissionPolicy` 提供資訊，使其成爲一個具體的聲明
  （想想看：“`owner` 標籤必須被設置爲以 `.company.com` 結尾的形式"）。
  參數資源的模式（Schema）使用諸如 ConfigMap 或 CRD 這類原生類型定義。
  `ValidatingAdmissionPolicy` 對象指定它們期望參數資源所呈現的類型。

- 一個 `ValidatingAdmissionPolicyBinding` 將上述資源聯繫在一起，並提供作用域。
  如果你只想爲 `Pods` 設置一個 `owner` 標籤，你就需要在這個綁定中指定這個限制。

<!--
At least a `ValidatingAdmissionPolicy` and a corresponding `ValidatingAdmissionPolicyBinding`
must be defined for a policy to have an effect.

If a `ValidatingAdmissionPolicy` does not need to be configured via parameters, simply leave
`spec.paramKind` in  `ValidatingAdmissionPolicy` not specified.
-->
至少要定義一個 `ValidatingAdmissionPolicy` 和一個相對應的 `ValidatingAdmissionPolicyBinding` 才能使策略生效。

如果 `ValidatingAdmissionPolicy` 不需要參數設定，不設置 `ValidatingAdmissionPolicy` 中的
`spec.paramKind` 即可。

<!--
## Getting Started with Validating Admission Policy

Validating Admission Policy is part of the cluster control-plane. You should write and deploy them
with great caution. The following describes how to quickly experiment with Validating Admission Policy.
-->
## 開始使用驗證准入策略  {#getting-started-with-validating-admission-policy}

驗證准入策略是叢集控制平面的一部分。你應該非常謹慎地編寫和部署它們。下面介紹如何快速試驗驗證准入策略。

<!--
### Creating a ValidatingAdmissionPolicy

The following is an example of a ValidatingAdmissionPolicy.
-->
### 創建一個 ValidatingAdmissionPolicy

以下是一個 ValidatingAdmissionPolicy 的示例：

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-policy.yaml" %}}

<!--
`spec.validations` contains CEL expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. If an expression evaluates to false, the validation check is enforced
according to the `spec.failurePolicy` field.
-->
`spec.validations` 包含使用[通用表達式語言 (CEL)](https://github.com/google/cel-spec)
來驗證請求的 CEL 表達式。
如果表達式的計算結果爲 false，則根據 `spec.failurePolicy` 字段強制執行驗證檢查處理。

{{< note >}}
<!--
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
-->
你可以在 [CEL Playground](https://playcel.undistro.io) 中快速驗證 CEL 表達式。
{{< /note >}}

<!--
To configure a validating admission policy for use in a cluster, a binding is required.
The following is an example of a ValidatingAdmissionPolicyBinding:
-->
要設定一個在某叢集中使用的驗證准入策略，需要一個綁定。
以下是一個 ValidatingAdmissionPolicyBinding 的示例：

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-binding.yaml" %}}

<!--
When trying to create a deployment with replicas set not satisfying the validation expression, an
error will return containing message:
-->
嘗試創建副本集合不滿足驗證表達式的 Deployment 時，將返回包含以下消息的錯誤：

```none
ValidatingAdmissionPolicy 'demo-policy.example.com' with binding 'demo-binding-test.example.com' denied request: failed expression: object.spec.replicas <= 5
```

<!--
The above provides a simple example of using ValidatingAdmissionPolicy without a parameter configured.
-->
上面提供的是一個簡單的、無設定參數的 ValidatingAdmissionPolicy。

<!--
#### Validation actions

Each `ValidatingAdmissionPolicyBinding` must specify one or more
`validationActions` to declare how `validations` of a policy are enforced.
-->
#### 驗證操作

每個 `ValidatingAdmissionPolicyBinding` 必須指定一個或多個
`validationActions` 來聲明如何執行策略的 `validations`。

<!--
The supported `validationActions` are:
-->
支持的 `validationActions` 包括：

<!--
- `Deny`: Validation failure results in a denied request.
- `Warn`: Validation failure is reported to the request client
  as a [warning](/blog/2020/09/03/warnings/).
- `Audit`: Validation failure is included in the audit event for the API request.
-->
- `Deny`：驗證失敗會導致請求被拒絕。
- `Warn`：驗證失敗會作爲[警告](/zh-cn/blog/2020/09/03/warnings/)報告給請求客戶端。
- `Audit`：驗證失敗會包含在 API 請求的審計事件中。

<!--
For example, to both warn clients about a validation failure and to audit the
validation failures, use:
-->
例如，要同時向客戶端發出驗證失敗的警告並記錄驗證失敗的審計記錄，請使用以下設定：

```yaml
validationActions: [Warn, Audit]
```

<!--
`Deny` and `Warn` may not be used together since this combination
needlessly duplicates the validation failure both in the
API response body and the HTTP warning headers.
-->
`Deny` 和 `Warn` 不能一起使用，因爲這種組合會不必要地將驗證失敗重複輸出到
API 響應體和 HTTP 警告頭中。

<!--
A `validation` that evaluates to false is always enforced according to these
actions. Failures defined by the `failurePolicy` are enforced
according to these actions only if the `failurePolicy` is set to `Fail` (or not specified),
otherwise the failures are ignored.
-->
如果 `validation` 求值爲 false，則始終根據這些操作執行。
由 `failurePolicy` 定義的失敗僅在 `failurePolicy` 設置爲 `Fail`（或未指定）時根據這些操作執行，
否則這些失敗將被忽略。

<!-- 
See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about the validation failure audit annotation.
-->
有關驗證失敗審計註解的詳細資訊，
請參見[審計註解：驗證失敗](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation_failure)。

<!--
### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define paramKind, which outlines GVK of the parameter resource,
and then a policy binding ties a policy by name (via policyName) to a particular parameter resource via paramRef.

If parameter configuration is needed, the following is an example of a ValidatingAdmissionPolicy
with parameter configuration.
-->
### 參數資源    {#parameter-resources}

參數資源允許策略設定與其定義分開。
一個策略可以定義 paramKind，給出參數資源的 GVK，
然後一個策略綁定可以通過名稱（通過 policyName）將某策略與某特定的參數資源（通過 paramRef）聯繫起來。

如果需要參數設定，下面是一個帶有參數設定的 ValidatingAdmissionPolicy 的例子：

{{% code_sample language="yaml" file="validatingadmissionpolicy/policy-with-param.yaml" %}}

<!--
The `spec.paramKind` field of the ValidatingAdmissionPolicy specifies the kind of resources used
to parameterize this policy. For this example, it is configured by ReplicaLimit custom resources.
Note in this example how the CEL expression references the parameters via the CEL params variable,
e.g. `params.maxReplicas`. `spec.matchConstraints` specifies what resources this policy is
designed to validate. Note that the native types such like `ConfigMap` could also be used as
parameter reference.
-->
ValidatingAdmissionPolicy 的 `spec.paramKind` 字段指定用於參數化此策略的資源類型。
在這個例子中，它是由自定義資源 ReplicaLimit 設定的。
在這個例子中請注意 CEL 表達式是如何通過 CEL params 變量引用參數的，如：`params.maxReplicas`。
`spec.matchConstraints` 指定此策略要檢查哪些資源。
請注意，諸如 `ConfigMap` 之類的原生類型也可以用作參數引用。

<!--
The `spec.validations` fields contain CEL expressions. If an expression evaluates to false, the
validation check is enforced according to the `spec.failurePolicy` field.

The validating admission policy author is responsible for providing the ReplicaLimit parameter CRD.

To configure an validating admission policy for use in a cluster, a binding and parameter resource
are created. The following is an example of a ValidatingAdmissionPolicyBinding
that uses a **cluster-wide** param - the same param will be used to validate
every resource request that matches the binding:
-->
`spec.validations` 字段包含 CEL 表達式。
如果表達式的計算結果爲 false，則根據 `spec.failurePolicy` 字段強制執行驗證檢查操作。

驗證准入策略的作者負責提供 ReplicaLimit 參數 CRD。

要設定一個在某叢集中使用的驗證准入策略，需要創建綁定和參數資源。
以下是 ValidatingAdmissionPolicyBinding **叢集範圍**參數的示例 - 相同的參數將用於驗證與綁定匹配的每個資源請求：

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param.yaml" %}}

<!--
Notice this binding applies a parameter to the policy for all resources which
are in the `test` environment.
-->
請注意，此綁定將參數應用於 `test` 環境中所有資源的策略中。

<!--
The parameter resource could be as following:
-->
參數資源可以如下：

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param.yaml" %}}

<!--
This policy parameter resource limits deployments to a max of 3 replicas.

An admission policy may have multiple bindings. To bind all other environments
to have a maxReplicas limit of 100, create another ValidatingAdmissionPolicyBinding:
-->
此策略參數資源將限制 Deployment 最多有 3 個副本。

一個准入策略可以有多個綁定。
要綁定所有的其他環境，限制 maxReplicas 爲 100，請創建另一個 ValidatingAdmissionPolicyBinding：

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param-prod.yaml" %}}

<!--
Notice this binding applies a different parameter to resources which
are not in the `test` environment.
-->
請注意，此綁定將不同的參數應用於不在 `test` 環境中的資源。

<!--
And have a parameter resource:
-->
並有一個參數資源：

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param-prod.yaml" %}}

<!--
For each admission request, the API server evaluates CEL expressions of each 
(policy, binding, param) combination that match the request. For a request
to be admitted it must pass **all** evaluations.

If multiple bindings match the request, the policy will be evaluated for each,
and they must all pass evaluation for the policy to be considered passed.
-->
對於每個准入請求，API 伺服器都會評估與請求匹配的每個（策略、綁定、參數）組合的 CEL 表達式。
要獲得准入資格，必須通過**所有**評估。

如果多個綁定與請求匹配，則將爲每個綁定評估策略，並且它們必須全部通過評估，策略纔會被視爲通過。

<!--
If multiple parameters match a single binding, the policy rules will be evaluated
for each param, and they too must all pass for the binding to be considered passed.
Bindings can have overlapping match criteria. The policy is evaluated for each 
matching binding-parameter combination. A policy may even be evaluated multiple
times if multiple bindings match it, or a single binding that matches multiple 
parameters.
-->
如果多個參數與同一個綁定匹配，則系統將爲每個參數評估策略規則，並且這些規則也必須全部通過才能認爲該綁定通過。
多個綁定之間可以在匹配條件存在重疊。系統針對匹配的綁定參數所有組合來評估策略。如果多個綁定與其匹配，
或者同一個綁定與多個參數匹配，則策略甚至可以被多次評估。

<!--
The params object representing a parameter resource will not be set if a parameter resource has
not been bound, so for policies requiring a parameter resource, it can be useful to add a check to
ensure one has been bound. A parameter resource will not be bound and `params` will be null
if `paramKind` of the policy, or `paramRef` of the binding are not specified.

For the use cases requiring parameter configuration, we recommend to add a param check in
`spec.validations[0].expression`:
-->
如果參數資源尚未被綁定，代表參數資源的 params 對象將不會被設置，
所以對於需要參數資源的策略，添加一個檢查來確保參數資源被綁定，這會很有用。
如果策略的 `paramKind` 未指定或綁定的 `paramRef` 未指定，則不會綁定參數資源，
並且 `params` 將爲空。

對於需要參數設定的場景，我們建議在 `spec.validations[0].expression` 中添加一個參數檢查：

```yaml
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

<!--
#### Optional parameters

It can be convenient to be able to have optional parameters as part of a parameter resource, and
only validate them if present. CEL provides `has()`, which checks if the key passed to it exists.
CEL also implements Boolean short-circuiting. If the first half of a logical OR evaluates to true,
it won’t evaluate the other half (since the result of the entire OR will be true regardless).

Combining the two, we can provide a way to validate optional parameters:
-->
#### 可選參數

將可選參數作爲參數資源的一部分，並且只在參數存在時執行檢查操作，這樣做會比較方便。
CEL 提供了 `has()` 方法，它檢查傳遞給它的鍵是否存在。CEL 還實現了布爾短路邏輯。
如果邏輯 OR 的前半部分計算爲 true，則不會計算另一半（因爲無論如何整個 OR 的結果都爲真）。

結合這兩者，我們可以提供一種驗證可選參數的方法：

```
!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)
```

<!--
Here, we first check that the optional parameter is present with `!has(params.optionalNumber)`.
- If `optionalNumber` hasn’t been defined, then the expression short-circuits since
  `!has(params.optionalNumber)` will evaluate to true.
- If `optionalNumber` has been defined, then the latter half of the CEL expression will be
  evaluated, and optionalNumber will be checked to ensure that it contains a value between 5 and
  10 inclusive.
-->
在這裏，我們首先用 `!has(params.optionalNumber)` 檢查可選參數是否存在。

- 如果 `optionalNumber` 沒有被定義，那麼表達式就會短路，因爲 `!has(params.optionalNumber)` 的計算結果爲 true。
- 如果 `optionalNumber` 被定義了，那麼將計算 CEL 表達式的後半部分，
  並且 `optionalNumber` 將被檢查以確保它包含一個 5 到 10 之間的值（含 5 到 10）。

<!--
#### Per-namespace Parameters

As the author of a ValidatingAdmissionPolicy and its ValidatingAdmissionPolicyBinding, 
you can choose to specify cluster-wide, or per-namespace parameters. 
If you specify a `namespace` for the binding's `paramRef`, the control plane only
searches for parameters in that namespace.
-->
#### 按命名空間設置的參數

作爲 ValidatingAdmissionPolicy 及其 ValidatingAdmissionPolicyBinding 的作者，
你可以選擇指定其作用於叢集範圍還是某個命名空間。如果你爲綁定的 `paramRef` 指定 `namespace`，
則控制平面僅在該命名空間中搜索參數。

<!--
However, if `namespace` is not specified in the ValidatingAdmissionPolicyBinding, the
API server can search for relevant parameters in the namespace that a request is against.
For example, if you make a request to modify a ConfigMap in the `default` namespace and
there is a relevant ValidatingAdmissionPolicyBinding with no `namespace` set, then the
API server looks for a parameter object in `default`.
This design enables policy configuration that depends on the namespace
of the resource being manipulated, for more fine-tuned control.
-->
但是，如果 ValidatingAdmissionPolicyBinding 中未指定 `namespace`，則 API
伺服器可以在請求所針對的命名空間中搜索相關參數。
例如，如果你請求修改 `default` 命名空間中的 ConfigMap，並且存在未設置 `namespace` 的相關
ValidatingAdmissionPolicyBinding，則 API 伺服器在 `default` 命名空間中查找參數對象。
此設計支持依賴於所操作資源的命名空間的策略設定，以實現更精細的控制。

<!--
#### Parameter selector

In addition to specify a parameter in a binding by `name`, you may
choose instead to specify label selector, such that all resources of the
policy's `paramKind`, and the param's `namespace` (if applicable) that match the
label selector are selected for evaluation. See {{< glossary_tooltip text="selector" term_id="selector">}} for more information on how label selectors match resources.
-->
#### 參數選擇算符

除了在綁定中用 `name` 來指定參數之外，你還可以選擇設置標籤選擇算符，
這樣對於與策略的 `paramKind` 參數匹配，且位於參數的 `namespace`（如果適用）內的所有資源，
如果與標籤選擇算符匹配，都會被評估。有關標籤選擇算符如何匹配資源的更多資訊，
請參閱{{<glossary_tooltip text="選擇算符" term_id="selector">}}。

<!--
If multiple parameters are found to meet the condition, the policy's rules are
evaluated for each parameter found and the results will be ANDed together.

If `namespace` is provided, only objects of the `paramKind` in the provided
namespace are eligible for selection. Otherwise, when `namespace` is empty and 
`paramKind` is namespace-scoped, the `namespace` used in the request being 
admitted will be used.
-->
如果發現多個參數滿足條件，則會針對所找到的每個參數來評估策略規則，並將結果進行“與”運算。

如果設置了 `namespace`，則只有所提供的命名空間中類別爲 `paramKind` 的對象纔會被匹配。
否則，當 `namespace` 爲空且 `paramKind` 爲命名空間作用域的資源時，使用被准入請求中指定的 `namespace`。

<!--
#### Authorization checks {#authorization-check} 

We introduced the authorization check for parameter resources.
User is expected to have `read` access to the resources referenced by `paramKind` in
`ValidatingAdmissionPolicy` and `paramRef` in `ValidatingAdmissionPolicyBinding`.

Note that if a resource in `paramKind` fails resolving via the restmapper, `read` access to all
resources of groups is required.
-->
#### 鑑權檢查

我們爲參數資源引入了鑑權檢查。
使用者應該對 `ValidatingAdmissionPolicy` 中的 `paramKind`
和 `ValidatingAdmissionPolicyBinding` 中的 `paramRef` 所引用的資源有 `read` 權限。

請注意，如果 `paramKind` 中的資源沒能通過 restmapper 解析，則使用者需要擁有對組的所有資源的
`read` 訪問權限。

<!--
#### `paramRef`

The `paramRef` field specifies the parameter resource used by the policy. It has the following fields:
-->
#### `paramRef`

`paramRef` 字段用於指定策略所使用的參數資源。它包含以下字段：

<!--
- **name**: The name of the parameter resource.
- **namespace**: The namespace of the parameter resource.
- **selector**: A label selector to match multiple parameter resources.
- **parameterNotFoundAction**: (Required) Controls the behavior when the specified parameters are not found.
-->
- **name**：參數資源的名稱。
- **namespace**：參數資源所在的命名空間。
- **selector**：用於匹配多個參數資源的標籤選擇算符。
- **parameterNotFoundAction**：（必需項）控制在未找到指定參數時的行爲。

  <!--
  - **Allowed Values**:
    - **`Allow`**: The absence of matched parameters is treated as a successful validation by the binding.
    - **`Deny`**: The absence of matched parameters is subject to the `failurePolicy` of the policy.
  -->

  - **允許的取值**：
    - **`Allow`**：如果未匹配到參數，綁定會將其視爲驗證成功。
    - **`Deny`**：如果未匹配到參數，則取決於策略的 `failurePolicy`。

<!--
One of `name` or `selector` must be set, but not both.
-->
`name` 和 `selector` 必須設置其中之一，但不能同時設置。

{{< note >}}

<!--
The `parameterNotFoundAction` field in `paramRef` is **required**. It specifies the action to take when no parameters are found matching the `paramRef`. If not specified, the policy binding may be considered invalid and will be ignored or could lead to unexpected behavior.
-->
`paramRef` 中的 `parameterNotFoundAction` 字段是**必需項**。
它指定在沒有參數與 `paramRef` 匹配時應採取的操作。
如果未指定此字段，策略綁定可能被視爲無效，進而被忽略，或可能導致意料之外的行爲。

<!--
- **`Allow`**: If set to `Allow`, and no parameters are found, the binding treats the absence of parameters as a successful validation, and the policy is considered to have passed.
- **`Deny`**: If set to `Deny`, and no parameters are found, the binding enforces the `failurePolicy` of the policy. If the `failurePolicy` is `Fail`, the request is rejected.

Make sure to set `parameterNotFoundAction` according to the desired behavior when parameters are missing.
-->
- **`Allow`**：如果設置爲 `Allow`，且未找到參數，綁定會將參數缺失視爲驗證成功，
  此策略被認爲是通過的。
- **`Deny`**：如果設置爲 `Deny`，且未找到參數，綁定將執行策略的 `failurePolicy`。
  如果 `failurePolicy` 設置爲 `Fail`，則該請求會被拒絕。

請根據在參數缺失時期望的行爲，正確設置 `parameterNotFoundAction`。

{{< /note >}}

<!--
#### Handling Missing Parameters with `parameterNotFoundAction`

When using `paramRef` with a selector, it's possible that no parameters match the selector. The `parameterNotFoundAction` field determines how the binding behaves in this scenario.

**Example:**
-->
#### 使用 `parameterNotFoundAction` 處理缺失的參數

當在 `paramRef` 中使用 `selector` 時，有可能不會匹配到任何參數。
在這種情況下，`parameterNotFoundAction` 字段決定綁定的行爲。

**示例：**

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: example-binding
spec:
  policyName: example-policy
  paramRef:
    selector:
      matchLabels:
        environment: test
    parameterNotFoundAction: Allow
  validationActions:
  - Deny
```  

<!--
### Failure Policy

`failurePolicy` defines how mis-configurations and CEL expressions evaluating to error from the
admission policy are handled. Allowed values are `Ignore` or `Fail`.

- `Ignore` means that an error calling the ValidatingAdmissionPolicy is ignored and the API
  request is allowed to continue.
- `Fail` means that an error calling the ValidatingAdmissionPolicy causes the admission to fail
  and the API request to be rejected.

Note that the `failurePolicy` is defined inside `ValidatingAdmissionPolicy`:
-->
### 失效策略   {#failure-policy}

`failurePolicy` 定義瞭如何處理錯誤設定和准入策略的 CEL 表達式取值爲 error 的情況。

允許的值是 `Ignore` 或 `Fail`。

- `Ignore` 意味着調用 ValidatingAdmissionPolicy 的錯誤被忽略，允許 API 請求繼續。
- `Fail` 意味着調用 ValidatingAdmissionPolicy 的錯誤導致准入失敗並拒絕 API 請求。

請注意，`failurePolicy` 是在 `ValidatingAdmissionPolicy` 中定義的：

{{% code_sample language="yaml" file="validatingadmissionpolicy/failure-policy-ignore.yaml" %}}

<!--
### Validation Expression

`spec.validations[i].expression` represents the expression which will be evaluated by CEL.
To learn more, see the [CEL language specification](https://github.com/google/cel-spec)
CEL expressions have access to the contents of the Admission request/response, organized into CEL
variables as well as some other useful variables:
-->
### 檢查表達式   {#validation-expression}

`spec.validations[i].expression` 代表將使用 CEL 來計算表達式。
要了解更多資訊，請參閱 [CEL 語言規範](https://github.com/google/cel-spec)。
CEL 表達式可以訪問按 CEL 變量來組織的 Admission 請求/響應的內容，以及其他一些有用的變量：

<!--
- 'object' - The object from the incoming request. The value is null for DELETE requests.
- 'oldObject' - The existing object. The value is null for CREATE requests.
- 'request' - Attributes of the [admission request](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest).
- 'params' - Parameter resource referred to by the policy binding being evaluated. The value is
  null if `ParamKind` is not specified.
- `namespaceObject` - The namespace, as a Kubernetes resource, that the incoming object belongs to.
  The value is null if the incoming object is cluster-scoped.
-->
- 'object' - 來自傳入請求的對象。對於 DELETE 請求，該值爲 null。
- 'oldObject' - 現有對象。對於 CREATE 請求，該值爲 null。
- 'request' - [准入請求](/zh-cn/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest)的屬性。
- 'params' - 被計算的策略綁定引用的參數資源。如果未設置 `paramKind`，該值爲 null。
- `namespaceObject` - 作爲 Kubernetes 資源的、傳輸對象所在的名字空間。
  如果傳入對象是叢集作用域的，則此值爲 null。

<!--
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal
  (authenticated user) of the request. See
  [AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) and
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) in the Kubernetes CEL library
  documentation for more details.
- `authorizer.requestResource` - A shortcut for an authorization check configured with the request
  resource (group, resource, (subresource), namespace, name).
-->
- `authorizer` - 一個 CEL 鑑權組件。可以用來爲請求的主體（經過身份驗證的使用者）執行鑑權檢查。
  更多細節可以參考 [AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)
  和 Kubernetes CEL 庫的文檔中的 [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)。
- `authorizer.requestResource` - 針對請求資源（組、資源、（子資源）、命名空間、名稱）所設定的鑑權檢查的快捷方式。

<!--
The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from
the root of the object. No other metadata properties are accessible.
-->
總是可以從對象的根訪問的屬性有 `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName`。
其他元資料屬性不能訪問。

<!--
Equality on arrays with list type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1].
Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:

- 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
  non-intersecting elements in `Y` are appended, retaining their partial order.
- 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
  are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
  non-intersecting keys are appended, retaining their partial order.
-->
列表類型爲 "set" 或 "map" 的數組上的等價關係比較會忽略元素順序，即 [1, 2] == [2, 1]。
使用 x-kubernetes-list-type 連接數組時使用列表類型的語義：

- 'set'：`X + Y` 執行並集，其中 `X` 中所有元素的數組位置被保留，`Y` 中不相交的元素被追加，保留其元素的偏序關係。
- 'map'：`X + Y` 執行合併，保留 `X` 中所有鍵的數組位置，但是當 `X` 和 `Y` 的鍵集相交時，其值被 `Y` 的值覆蓋。
  `Y` 中鍵值不相交的元素被追加，保留其元素之間的偏序關係。

<!--
#### Validation expression examples

| Expression                                                                                   | Purpose                                                                           |
|----------------------------------------------------------------------------------------------| ------------                                                                      |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`             | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in object.stateCounts`                                                          | Validate that an entry with the 'Available' key exists in a map                   |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                     | Validate that one of two lists is non-empty, but not both                         |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]*$')</code> | Validate the value of a map for a specific key, if it is in the map               |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`          | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(object.expired) && object.created + object.ttl < object.expired`                        | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `object.health.startsWith('ok')`                                                             | Validate a 'health' string field has the prefix 'ok'                              |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                       | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(object) == string ? object == '100%' : object == 1000`                                 | Validate an int-or-string field for both the int and string cases             |
| `object.metadata.name.startsWith(object.prefix)`                                             | Validate that an object's name has the prefix of another field value              |
| `object.set1.all(e, !(e in object.set2))`                                                    | Validate that two listSets are disjoint                                           |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`     | Validate the 'details' map is keyed by the items in the 'names' listSet           |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                             | Validate that the 'primary' property has one and only one occurrence in the 'clusters' listMap           |
-->
#### 檢查表達式示例

| 表達式                                                                                        | 目的                                                                     |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`              | 檢查定義副本的三個字段是否大小關係正確                                   |
| `'Available' in object.stateCounts`                                                           | 檢查映射中是否存在鍵爲 `Available` 的條目                                |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                      | 檢查兩個列表是否有且只有一個非空                                         |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]\*$')</code> | 檢查映射中存在特定的鍵時其取值符合某規則                                 |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`           | 驗證 listMap 中所有鍵名爲 "MY_ENV" 的條目的 “value” 字段，確保其符合規則 |
| `has(object.expired) && object.created + object.ttl < object.expired`                         | 檢查 expired 日期在 create 日期加上 ttl 時長之後                         |
| `object.health.startsWith('ok')`                                                              | 檢查 health 字符串字段的取值有 “ok” 前綴                                 |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                        | 對於 listMap 中鍵爲 “x” 的條目，檢查該條目的 "foo" 屬性的值是否小於 10   |
| `type(object) == string ? object == '100%' : object == 1000`                                  | 對於 int-or-string 字段，分別處理類型爲 int 或 string 的情況             |
| `object.metadata.name.startsWith(object.prefix)`                                              | 檢查對象名稱是否以另一個字段值爲前綴                                     |
| `object.set1.all(e, !(e in object.set2))`                                                     | 檢查兩個 listSet 是否不相交                                              |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`      | 檢查映射 “details” 所有的鍵和 listSet “names” 中的條目是否一致           |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                              | 檢查 “primary” 字段的值在 listMap “clusters” 中只出現一次                |

<!--
Read [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)
for more information about CEL rules.
-->
瞭解關於 CEL 規則的更多資訊, 請閱讀
[CEL 支持的求值表達式](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)。

<!--
`spec.validation[i].reason` represents a machine-readable description of why this validation failed.
If this is the first validation in the list to fail, this reason, as well as the corresponding
HTTP response code, are used in the HTTP response to the client.
The currently supported reasons are: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`.
If not set, `StatusReasonInvalid` is used in the response to the client.
-->
`spec.validation[i].reason` 表示一個機器可讀的描述，說明爲什麼這次檢查失敗。
如果這是列表中第一個失敗的檢查，其原因以及相應的 HTTP 響應代碼會被用在給客戶端的 HTTP 響應中。
目前支持的原因有：`Unauthorized`、`Forbidden`、`Invalid`、`RequestEntityTooLarge`。
如果未設置，將在對客戶端的響應中使用 `StatusReasonInvalid`。

<!--
### Matching requests: `matchConditions`

You can define _match conditions_ for a `ValidatingAdmissionPolicy` if you need fine-grained request filtering. These
conditions are useful if you find that match rules, `objectSelectors` and `namespaceSelectors` still
doesn't provide the filtering you want. Match conditions are
[CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the
resource to be evaluated.
-->
### 匹配請求：`matchConditions`

如果需要進行精細的請求過濾，可以爲 `ValidatingAdmissionPolicy` 定義 **匹配條件（match conditions）**。
如果發現匹配規則、`objectSelectors` 和 `namespaceSelectors` 仍無法提供所需的過濾功能，則使用這些條件非常有用。
匹配條件是 [CEL 表達式](/zh-cn/docs/reference/using-api/cel/)。
所有匹配條件必須求值爲 true 時纔會對資源進行評估。

<!--
Here is an example illustrating a few different uses for match conditions:
-->
以下示例說明了匹配條件的幾個不同用法：

{{% code_sample file="access/validating-admission-policy-match-conditions.yaml" %}}

<!--
Match conditions have access to the same CEL variables as validation expressions.

In the event of an error evaluating a match condition the policy is not evaluated. Whether to reject
the request is determined as follows:

1. If **any** match condition evaluated to `false` (regardless of other errors), the API server skips the policy.
2. Otherwise:
   - for [`failurePolicy: Fail`](#failure-policy), reject the request (without evaluating the policy).
   - for [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the policy.
-->
這些匹配條件可以訪問與驗證表達式相同的 CEL 變量。

在評估匹配條件時出現錯誤時，將不會評估策略。根據以下方式確定是否拒絕請求：

1. 如果**任何一個**匹配條件求值結果爲 `false`（不管其他錯誤），API 伺服器將跳過 Webhook。
2. 否則：

   - 對於 [`failurePolicy: Fail`](#failure-policy)，拒絕請求（不調用 Webhook）。
   - 對於 [`failurePolicy: Ignore`](#failure-policy)，繼續處理請求但跳過 Webhook。

<!--
### Audit annotations

`auditAnnotations` may be used to include audit annotations in the audit event of the API request.

For example, here is an admission policy with an audit annotation:
-->
### 審計註解   {#audit-annotations}

`auditAnnotations` 可用於在 API 請求的審計事件中包括審計註解。

例如，以下是帶有審計註解的准入策略：

{{% code_sample file="access/validating-admission-policy-audit-annotation.yaml" %}}

<!--
When an API request is validated with this admission policy, the resulting audit event will look like:
-->
當使用此准入策略驗證 API 請求時，生成的審計事件將如下所示：

<!--
```
# the audit event recorded
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        # other annotations
        ...
    }
    # other fields
    ...
}
```
-->
```
# 記錄的審計事件
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        # 其他註解
        ...
    }
    # 其他字段
    ...
}
```

<!--
In this example the annotation will only be included if the `spec.replicas` of the Deployment is more than
50, otherwise the CEL expression evaluates to null and the annotation will not be included.

Note that audit annotation keys are prefixed by the name of the `ValidatingAdmissionPolicy` and a `/`. If
another admission controller, such as an admission webhook, uses the exact same audit annotation key, the 
value of the first admission controller to include the audit annotation will be included in the audit
event and all other values will be ignored.
-->
在此示例中，只有 Deployment 的 `spec.replicas` 大於 50 時纔會包含註解，
否則 CEL 表達式將求值爲 null，並且不會包含註解。

請注意，審計註解鍵以 `ValidatingAdmissionPolicy` 的名稱和 `/` 爲前綴。
如果另一個准入控制器（例如准入 Webhook）使用完全相同的審計註解鍵，
則第一個包括審計註解值的准入控制器將出現在審計事件中，而所有其他值都將被忽略。

<!--
### Message expression

To return a more friendly message when the policy rejects a request, we can use a CEL expression
to composite a message with `spec.validations[i].messageExpression`. Similar to the validation expression,
a message expression has access to `object`, `oldObject`, `request`, and `params`. Unlike validations,
message expression must evaluate to a string.

For example, to better inform the user of the reason of denial when the policy refers to a parameter,
we can have the following validation:
-->
### 消息表達式   {#message-expression}

爲了在策略拒絕請求時返回更友好的消息，我們在 `spec.validations[i].messageExpression`
中使用 CEL 表達式來構造消息。
與驗證表達式類似，消息表達式可以訪問 `object`、`oldObject`、`request` 和 `params`。
但是，與驗證不同，消息表達式必須求值爲字符串。

例如，爲了在策略引用參數時更好地告知使用者拒絕原因，我們可以有以下驗證：

{{% code_sample file="access/deployment-replicas-policy.yaml" %}}

<!--
After creating a params object that limits the replicas to 3 and setting up the binding,
when we try to create a deployment with 5 replicas, we will receive the following message.
-->
在創建限制副本爲 3 的 Params 對象並設置綁定之後，當我們嘗試創建具有 5 個副本的 Deployment
時，我們將收到以下消息：

```shell
$ kubectl create deploy --image=nginx nginx --replicas=5
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

<!--
This is more informative than a static message of "too many replicas".

The message expression takes precedence over the static message defined in `spec.validations[i].message` if both are defined.
However, if the message expression fails to evaluate, the static message will be used instead.
Additionally, if the message expression evaluates to a multi-line string,
the evaluation result will be discarded and the static message will be used if present.
Note that static message is validated against multi-line strings.
-->
這比靜態消息 "too many replicas" 更具說明性。

如果既定義了消息表達式，又在 `spec.validations[i].message` 中定義了靜態消息，
則消息表達式優先於靜態消息。但是，如果消息表達式求值失敗，則將使用靜態消息。
此外，如果消息表達式求值爲多行字符串，則會丟棄求值結果並使用靜態消息（如果存在）。
請注意，靜態消息也要檢查是否存在多行字符串。

<!--
### Type checking

When a policy definition is created or updated, the validation process parses the expressions it contains
and reports any syntax errors, rejecting the definition if any errors are found. 
Afterward, the referred variables are checked for type errors, including missing fields and type confusion,
against the matched types of `spec.matchConstraints`.
The result of type checking can be retrieved from `status.typeChecking`.
The presence of `status.typeChecking` indicates the completion of type checking,
and an empty `status.typeChecking` means that no errors were detected.

For example, given the following policy definition:
-->
### 類型檢查   {#type-checking}

創建或更新策略定義時，驗證過程將解析它包含的表達式，在發現錯誤時報告語法錯誤並拒絕該定義。
之後，引用的變量將根據 `spec.matchConstraints` 的匹配類型檢查類型錯誤，包括缺少字段和類型混淆。
類型檢查的結果可以從 `status.typeChecking` 中獲得。
`status.typeChecking` 的存在表示類型檢查已完成，而空的 `status.typeChecking` 表示未發現錯誤。

例如，給定以下策略定義：

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking.yaml" %}}

<!--
The status will yield the following information:
-->
status 字段將提供以下資訊：

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```

<!--
If multiple resources are matched in `spec.matchConstraints`, all of matched resources will be checked against.
For example, the following policy definition
-->
如果在 `spec.matchConstraints` 中匹配了多個資源，則所有匹配的資源都將進行檢查。
例如，以下策略定義：

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking-multiple-match.yaml" %}}

<!--
will have multiple types and type checking result of each type in the warning message.
-->
將具有多個類型，並在警告消息中提供每種類型的類型檢查結果。

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
        apps/v1, Kind=ReplicaSet: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```
<!--
Type Checking has the following limitation:

- No wildcard matching. If `spec.matchConstraints.resourceRules` contains `"*"` in any of `apiGroups`, `apiVersions` or `resources`,
  the types that `"*"` matches will not be checked.
- The number of matched types is limited to 10. This is to prevent a policy that manually specifying too many types.
  to consume excessive computing resources. In the order of ascending group, version, and then resource, 11th combination and beyond are ignored.
- Type Checking does not affect the policy behavior in any way. Even if the type checking detects errors, the policy will continue
  to evaluate. If errors do occur during evaluate, the failure policy will decide its outcome.
- Type Checking does not apply to CRDs, including matched CRD types and reference of paramKind. The support for CRDs will come in future release.
-->
類型檢查具有以下限制：

- 沒有通配符匹配。
  如果 `spec.matchConstraints.resourceRules` 中的任何一個 `apiGroups`、`apiVersions`
  或 `resources` 包含 `"\*"`，則不會檢查與 `"\*"` 匹配的類型。
- 匹配的類型數量最多爲 10 種。這是爲了防止手動指定過多類型的策略消耗過多計算資源。
  按升序處理組、版本，然後是資源，忽略第 11 個及其之後的組合。
- 類型檢查不會以任何方式影響策略行爲。即使類型檢查檢測到錯誤，策略也將繼續評估。
  如果在評估期間出現錯誤，則失敗策略將決定其結果。
- 類型檢查不適用於 CRD（自定義資源定義），包括匹配的 CRD 類型和 paramKind 的引用。
  對 CRD 的支持將在未來發布中推出。

<!--
### Variable composition

If an expression grows too complicated, or part of the expression is reusable and computationally expensive to evaluate,
you can extract some part of the expressions into variables. A variable is a named expression that can be referred later
in `variables` in other expressions.
-->
### 變量組合   {#variable-composition}

如果表達式變得太複雜，或者表達式的一部分可重用且進行評估時計算開銷較大，可以將表達式的某些部分提取爲變量。
變量是一個命名表達式，後期可以在其他表達式中的 `variables` 中引用。

```yaml
spec:
  variables:
    - name: foo
      expression: "'foo' in object.spec.metadata.labels ? object.spec.metadata.labels['foo'] : 'default'"
  validations:
    - expression: variables.foo == 'bar'
```

<!--
A variable is lazily evaluated when it is first referred. Any error that occurs during the evaluation will be
reported during the evaluation of the referring expression. Both the result and potential error are memorized and
count only once towards the runtime cost.

The order of variables are important because a variable can refer to other variables that are defined before it.
This ordering prevents circular references.

The following is a more complex example of enforcing that image repo names match the environment defined in its namespace.
-->
變量在首次引用時會被延遲求值。評估期間發生的任何錯誤都將在評估引用表達式期間報告，
結果和可能的錯誤都會被記錄下來，且在運行時開銷中僅計爲一次。

變量的順序很重要，因爲一個變量可以引用在它之前定義的其他變量。
對順序的要求可以防止循環引用。

以下是強制映像檔倉庫名稱與其命名空間中定義的環境相匹配的一個較複雜示例。

{{< code_sample file="access/image-matches-namespace-environment.policy.yaml" >}}

<!--
With the policy bound to the namespace `default`, which is labeled `environment: prod`,
the following attempt to create a deployment would be rejected.
-->
在此策略被綁定到 `default` 命名空間（標籤爲 `environment: prod`）的情況下，
以下創建 Deployment 的嘗試將被拒絕。

```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```

<!--
The error message is similar to this.
-->
錯誤資訊類似於：

```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```

<!--
## API kinds exempt from admission validation

There are certain API kinds that are exempt from admission-time validation checks. For example, you can't create a ValidatingAdmissionPolicy that prevents changes to ValidatingAdmissionPolicyBindings.

The list of exempt API kinds is:
-->
## 免於准入驗證的 API 類別   {#api-kinds-exempt-from-admission-validation}

某些 API 類別可以豁免准入時驗證檢查。例如，你無法創建阻止更改 ValidatingAdmissionPolicyBindings
的 ValidatingAdmissionPolicy。

豁免准入驗證的 API 類別列表如下：

* [ValidatingAdmissionPolicies]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-v1/" >}})
* [ValidatingAdmissionPolicyBindings]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-binding-v1/" >}})
* MutatingAdmissionPolicies
* MutatingAdmissionPolicyBindings
* [TokenReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/token-review-v1/" >}})
* [LocalSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/local-subject-access-review-v1/" >}})
* [SelfSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/" >}})
* [SelfSubjectReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/" >}})
