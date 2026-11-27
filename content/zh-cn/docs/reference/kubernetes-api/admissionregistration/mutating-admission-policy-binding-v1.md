---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingAdmissionPolicyBinding"
content_type: "api_reference"
description: "MutatingAdmissionPolicyBinding 将 MutatingAdmissionPolicy 与参数化资源绑定在一起。MutatingAdmissionPolicyBinding 和可选的参数资源共同定义了集群管理员如何为集群配置策略。\n\n对于给定的准入请求，每个绑定将导致其策略被评估 N 次，其中对于不使用参数的策略/绑定，N 为 1，否则 N 是绑定选择的参数数量。每次评估都受[运行时成本预算](/zh-cn/docs/reference/using-api/cel/#runtime-cost-budget)约束。\n\n添加/删除策略、绑定或参数不会影响给定（策略、绑定、参数）组合是否在其自身的 CEL 预算内。"
title: "MutatingAdmissionPolicyBinding"
weight: 20
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingAdmissionPolicyBinding"
content_type: "api_reference"
description: "MutatingAdmissionPolicyBinding binds the MutatingAdmissionPolicy with parametrized resources. MutatingAdmissionPolicyBinding and the optional parameter resource together define how cluster administrators configure policies for clusters.\n\nFor a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don&#39;t use params, otherwise N is the number of parameters selected by the binding. Each evaluation is constrained by a [runtime cost budget](https://kubernetes.io/docs/reference/using-api/cel/#runtime-cost-budget).\n\nAdding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget."
title: "MutatingAdmissionPolicyBinding"
weight: 20
auto_generated: true
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->
<!--
此文件由组件的 Go 源代码使用通用[生成器](https://github.com/kubernetes-sigs/reference-docs/)自动生成。
要了解如何生成参考文档，请阅读[为参考文档做贡献](/zh-cn/docs/contribute/generate-ref-docs/)。
要更新参考内容，请遵循[向上游贡献](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstrea
m/)指南。你可以向[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) 
项目提交文档格式相关的问题。
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## MutatingAdmissionPolicyBinding {#MutatingAdmissionPolicyBinding}

<!--
MutatingAdmissionPolicyBinding binds the MutatingAdmissionPolicy with parametrized resources. MutatingAdmissionPolicyBinding and the optional parameter resource together define how cluster administrators configure policies for clusters.

For a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don&#39;t use params, otherwise N is the number of parameters selected by the binding. Each evaluation is constrained by a [runtime cost budget](https://kubernetes.io/docs/reference/using-api/cel/#runtime-cost-budget).

Adding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget.
-->
MutatingAdmissionPolicyBinding 将 MutatingAdmissionPolicy 与参数化资源绑定在一起。
MutatingAdmissionPolicyBinding 和可选的参数资源共同定义了集群管理员如何为集群配置策略。

对于给定的准入请求，每个绑定将导致其策略被评估 N 次，其中对于不使用参数的策略/绑定，N 为 1，否则 N 是绑定选择的参数数量。
每次评估都受[运行时成本预算](/zh-cn/docs/reference/using-api/cel/#runtime-cost-budget)约束。

添加/删除策略、绑定或参数不会影响给定（策略、绑定、参数）组合是否在其自身的 CEL 预算内。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
<!--
APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
APIVersion 定义了对象的版本化 schema。服务器应将已识别的 schema 转换为最新的内部值，并可能拒绝无法识别的值。更多信息：
 https://git.k8s.io/community/contributors/devel/sig-architecture/api-conve
ntions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
<!--
Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
kind 是一个字符串值，表示对象所代表的 REST 资源。服务器可以从客户端提交请求的端点推断此字段。无法更新。格式为 CamelCase。
更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-con
ventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>
<!--
metadata is the standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.
-->
metadata 是标准的对象元数据；更多信息： https://git.k8s.io/community/contributors/devel/sig-a
rchitecture/api-conventions.md#metadata.
      </td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#MutatingAdmissionPolicyBindingSpec" >}}">MutatingAdmissionPolicyBindingSpec</a></em></td>
      <td>
<!--
spec defines the desired behavior of the MutatingAdmissionPolicyBinding.
-->
spec 定义了 MutatingAdmissionPolicyBinding 的期望行为。
      </td>
    </tr>
  </tbody>
</table>


## MutatingAdmissionPolicyBindingSpec {#MutatingAdmissionPolicyBindingSpec}

<!--
MutatingAdmissionPolicyBindingSpec defines the specification of the MutatingAdmissionPolicyBinding.
-->
MutatingAdmissionPolicyBindingSpec 定义了 MutatingAdmissionPolicyBinding 的规约。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>matchResources</code><br/><em><a href="{{< ref "../definitions/match-resources-v1-admissionregistration#MatchResources" >}}">MatchResources</a></em></td>
      <td>
<!--
matchResources limits what resources match this binding and may be mutated by it. Note that if matchResources matches a resource, the resource must also match a policy's matchConstraints and matchConditions before the resource may be mutated. When matchResources is unset, it does not constrain resource matching, and only the policy's matchConstraints and matchConditions must match for the resource to be mutated. Additionally, matchResources.resourceRules are optional and do not constraint matching when unset. Note that this is differs from MutatingAdmissionPolicy matchConstraints, where resourceRules are required. The CREATE, UPDATE and CONNECT operations are allowed.  The DELETE operation may not be matched. '\*' matches CREATE, UPDATE and CONNECT.
-->
matchResources 限制了哪些资源匹配此绑定并可能被其变更。请注意，如果 matchResources 匹配某个资源，
该资源还必须匹配策略的 matchConstraints 和 matchConditions，才能被变更。
当 matchResources 未设置时，它不会限制资源匹配，只有策略的 matchConstraints 和 matchConditions 必须匹配，
资源才能被变更。此外，matchResources.resourceRules 是可选的，未设置时不会限制匹配。
请注意，这与 MutatingAdmissionPolicy
 的 matchConstraints 不同，后者要求 resourceRules。允许 CREATE、UPDATE 和 CONNECT 操作。
DELETE 操作可能不被匹配。'\*' 匹配 CREATE、UPDATE 和 CONNECT。
      </td>
    </tr>
    <tr>
      <td><code>paramRef</code><br/><em><a href="{{< ref "../definitions/param-ref-v1-admissionregistration#ParamRef" >}}">ParamRef</a></em></td>
      <td>
<!--
paramRef specifies the parameter resource used to configure the admission control policy. It should point to a resource of the type specified in spec.ParamKind of the bound MutatingAdmissionPolicy. If the policy specifies a ParamKind and the resource referred to by ParamRef does not exist, this binding is considered mis-configured and the FailurePolicy of the MutatingAdmissionPolicy applied. If the policy does not specify a ParamKind then this field is ignored, and the rules are evaluated without a param.
-->
paramRef 指定用于配置准入控制策略的参数资源。它应指向绑定的 MutatingAdmissionPolicy 的 spec.ParamKind
 中指定类型的资源。如果策略指定了 ParamKind，而 ParamRef 引用的资源不存在，则该绑定被视为配置错误，
并将应用 MutatingAdmissionPolicy 的 FailurePolicy。
如果策略未指定 ParamKind，则忽略此字段，并且在没有参数的情况下评估规则。
      </td>
    </tr>
    <tr>
      <td><code>policyName</code><br/><em>string</em></td>
      <td>
<!--
policyName references a MutatingAdmissionPolicy name which the MutatingAdmissionPolicyBinding binds to. If the referenced resource does not exist, this binding is considered invalid and will be ignored Required.
-->
policyName 引用 MutatingAdmissionPolicyBinding 绑定到的 MutatingAdmissionPolicy 名称。
如果引用的资源不存在，该绑定被视为无效并将被忽略。必填项。
      </td>
    </tr>
  </tbody>
</table>


## MutatingAdmissionPolicyBindingList {#MutatingAdmissionPolicyBindingList}

<!--
MutatingAdmissionPolicyBindingList is a list of MutatingAdmissionPolicyBinding.
-->
MutatingAdmissionPolicyBindingList 是 MutatingAdmissionPolicyBinding 的列表。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
<!--
APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
APIVersion 定义了对象的版本化 schema。服务器应将已识别的 schema 转换为最新的内部值，并可能拒绝无法识别的值。更多信息：
 https://git.k8s.io/community/contributors/devel/sig-architecture/api-conve
ntions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding array</a></em></td>
      <td>
<!--
List of PolicyBinding.
-->
PolicyBinding 列表。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
<!--
Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
kind 是一个字符串值，表示对象所代表的 REST 资源。服务器可以从客户端提交请求的端点推断此字段。无法更新。格式为 CamelCase。
更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-con
ventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>
<!--
metadata is the standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
metadata 是标准的列表元数据。更多信息：
https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
  </tbody>
</table>


## 操作 {#Operations}

<hr>


### <!--`post` Create-->`post` 创建

#### <!--HTTP Request-->HTTP 请求

POST /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings



#### <!--Query Parameters-->查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
存在时，表示修改不应持久化。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
有效值为：- All：所有 dry run 阶段都将被处理
      </td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.
-->
fieldManager 是与进行这些更改的参与者或实体关联的名称。该值必须少于或等于 128 个字符，并且只能包含可打印字符，
如 https://golang.org/pkg/unicode/#IsPrint 所定义。
      </td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
fieldValidation 指示服务器如何处理请求（POST/PUT/PATCH）中包含未知或重复字段的对象。
有效值为：- Ignore：这将忽略从对象中静默删除的任何未知字段，并忽略解码器遇到的除最后一个重复字段之外的所有字段。这是 v1.23 之前的默认行为。
- Warn：这将通过标准警告响应头为对象中删除的每个未知字段以及遇到的每个重复字段发送警告。如果没有其他错误，请求仍然会成功，并且只会保留最后一个重复字段。
这是 v1.23+ 中的默认值。- Strict：如果任何未知字段将从对象中删除，或存在任何重复字段，这将导致请求因 BadRequest 错误而失败。
服务器返回的错误将包含所有遇到的未知和重复字段。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Body Parameters
-->
#### 请求体参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `patch` Patch

#### HTTP Request
-->
### `patch` 部分更新

#### HTTP 请求

PATCH /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings/{name}

<!--
#### Path Parameters
-->
#### 路径参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>
<!--
name of the MutatingAdmissionPolicyBinding
-->
MutatingAdmissionPolicyBinding 的名称
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
存在时，表示修改不应持久化。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
有效值为：- All：所有 dry run 阶段都将被处理
      </td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch).
-->
fieldManager 是与进行这些更改的参与者或实体关联的名称。该值必须少于或等于 128 个字符，并且只能包含可打印字符，
如 https://golang.org/pkg/unicode/#IsPrint 所定义。
此字段对于 apply 请求（application/apply-patch）是必需的，但对于非 apply 补丁类型（JsonPatch、
MergePatch、StrategicMergePatch）是可选的。
      </td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
fieldValidation 指示服务器如何处理请求（POST/PUT/PATCH）中包含未知或重复字段的对象。
有效值为：
- Ignore：这将忽略从对象中静默删除的任何未知字段，并忽略解码器遇到的除最后一个重复字段之外的所有字段。这是 v1.23 之前的默认行为。
- Warn：这将通过标准警告响应头为对象中删除的每个未知字段以及遇到的每个重复字段发送警告。
  如果没有其他错误，请求仍然会成功，并且只会保留最后一个重复字段。
这是 v1.23+ 中的默认值。- Strict：如果任何未知字段将从对象中删除，或存在任何重复字段，
这将导致请求因 BadRequest 错误而失败。服务器返回的错误将包含所有遇到的未知和重复字段。
      </td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.
-->
Force 将"强制" Apply 请求。这意味着用户将重新获取其他人拥有的冲突字段。
对于非 apply 补丁请求，必须取消设置 Force 标志。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Body Parameters
-->
#### 请求体参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应参数

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `put` Replace

#### HTTP Request
-->
### `put` 替换

#### HTTP 请求

PUT /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings/{name}

<!--
#### Path Parameters
-->
#### 路径参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>
<!--
name of the MutatingAdmissionPolicyBinding
-->
MutatingAdmissionPolicyBinding 的名称
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
存在时，表示修改不应持久化。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
有效值为：- All：所有 dry run 阶段都将被处理
      </td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.
-->
fieldManager 是与进行这些更改的参与者或实体关联的名称。该值必须少于或等于 128 个字符，并且只能包含可打印字符，
如 https://golang.org/pkg/unicode/#IsPrint 所定义。
      </td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>
<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
fieldValidation 指示服务器如何处理请求（POST/PUT/PATCH）中包含未知或重复字段的对象。
有效值为：- Ignore：这将忽略从对象中静默删除的任何未知字段，并忽略解码器遇到的除最后一个重复字段之外的所有字段。这是 v1.23 之前的默认行为。
- Warn：这将通过标准警告响应头为对象中删除的每个未知字段以及遇到的每个重复字段发送警告。如果没有其他错误，请求仍然会成功，并且只会保留最后一个重复字段。
这是 v1.23+ 中的默认值。- Strict：如果任何未知字段将从对象中删除，或存在任何重复字段，这将导致请求因 BadRequest 错误而失败。
服务器返回的错误将包含所有遇到的未知和重复字段。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Body Parameters
-->
#### 请求体参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `delete` Delete

#### HTTP Request
-->
### `delete` 删除

#### HTTP 请求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings/{name}


<!--
#### Path Parameters
-->
#### 路径参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>
<!--
name of the MutatingAdmissionPolicyBinding
-->
MutatingAdmissionPolicyBinding 的名称
      </td>
    </tr>
  </tbody>
</table>


<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
存在时，表示修改不应持久化。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
有效值为：- All：所有 dry run 阶段都将被处理
      </td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
对象应删除前的等待秒数。值必须是非负整数。值为零表示立即删除。如果此值为 nil，将使用指定类型的默认宽限期。如果未指定，则使用每个对象的默认值。
零表示立即删除。
      </td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
-->
如果设置为 true，当正常删除流程因损坏对象错误而失败时，将触发资源的不安全删除。
如果无法从底层存储成功检索资源，因为 a) 其数据无法转换（例如解密失败），或 b) 无法解码为对象，则该资源被视为损坏。
注意：不安全删除会忽略 finalizer 约束，跳过前置条件检查，并从存储中移除对象。
警告：如果与不安全删除的资源关联的工作负载依赖于正常删除流程，这可能会破坏集群。仅在你**确实**知道自己在做什么时才使用。
默认值为 false，用户必须选择启用它。
      </td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
-->
已弃用：请使用 PropagationPolicy，此字段将在 1.7 中弃用。是否应孤立依赖对象。
如果为 true/false，"orphan" finalizer 将被添加到/从对象的 finalizers 列表中。
可以设置此字段或 PropagationPolicy，但不能同时设置两者。
      </td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>
<!--
Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
是否以及如何执行垃圾回收。可以设置此字段或 OrphanDependents，但不能同时设置两者。
默认策略由 metadata.finalizers 中设置的现有 finalizer 和资源特定的默认策略决定。可接受的值为：'Orphan' - 孤立依赖项；
'Background' - 允许垃圾收集器在后台删除依赖项；'Foreground' - 级联策略，在前台删除所有依赖项。
      </td>
    </tr>
  </tbody>
</table>


<!--
#### Body Parameters
-->
#### 请求体参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `delete` Delete Collection

#### HTTP Request
-->
### `delete` 删除集合

#### HTTP 请求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>
<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
当从服务器检索更多结果时，应设置 continue 选项。由于此值由服务器定义，
客户端只能使用来自具有相同查询参数（continue 值除外）的先前查询结果的 continue 值，服务器可能会拒绝无法识别的 continue 值。
如果指定的 continue 值由于过期（通常五到十五分钟）或服务器上的配置变更而不再有效，
服务器将返回 410 ResourceExpired 错误以及 continue 令牌。
如果客户端需要一致的列表，必须在没有 continue 字段的情况下重新开始列表。
否则，客户端可以发送带有 410 错误中收到的令牌的另一个列表请求，服务器将返回从下一个键开始的列表，但从最新的快照开始，
这与之前的列表结果不一致 - 在第一个列表请求之后创建、修改或删除的对象将包含在响应中，只要它们的键在"下一个键"之后。
当 watch 为 true 时，不支持此字段。客户端可以从服务器返回的最后一个 resourceVersion 值开始 watch，而不会错过任何修改。
      </td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>
<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
存在时，表示修改不应持久化。无效或无法识别的 dryRun 指令将导致错误响应，并且不会进一步处理请求。
有效值为：- All：所有 dry run 阶段都将被处理
      </td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
按字段限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
对象应删除前的等待秒数。值必须是非负整数。值为零表示立即删除。
如果此值为 nil，将使用指定类型的默认宽限期。如果未指定，则使用每个对象的默认值。
零表示立即删除。
      </td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
-->
如果设置为 true，当正常删除流程因损坏对象错误而失败时，将触发资源的不安全删除。
如果无法从底层存储成功检索资源，因为
a) 其数据无法转换（例如解密失败），或
b) 无法解码为对象，则该资源被视为损坏。
注意：不安全删除会忽略 finalizer 约束，跳过前置条件检查，并从存储中移除对象。
警告：如果与不安全删除的资源关联的工作负载依赖于正常删除流程，这可能会破坏集群。仅在你**确实**知道自己在做什么时才使用。
默认值为 false，用户必须选择启用它。
      </td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
按标签限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
limit 是列表调用返回的最大响应数。如果存在更多项，服务器将在列表元数据上设置 continue 字段为一个值，可用于通过相同的初始查询检索下一组结果。
设置限制可能返回少于请求数量的项（最多零项），如果所有请求的对象都被过滤掉，客户端只能使用 continue 字段的存在来确定是否还有更多结果可用。
服务器可以选择不支持 limit 参数并返回所有可用结果。如果指定了 limit 且 continue 为空，客户端可以假设没有更多结果可用。
当 watch 为 true 时，不支持此字段。服务器保证使用 continue 返回的对象与发出不带 limit 的单个列表调用相同 - 也就是说，
在第一个请求发出后创建、修改或删除的对象不会包含在任何后续继续请求中。这有时被称为一致快照，
并确保使用 limit 接收非常大结果的较小块的客户端可以确保看到所有可能的对象。
如果在分块列表期间对象被更新，则返回的是计算第一个列表结果时存在的对象版本。
      </td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
-->
已弃用：请使用 PropagationPolicy，此字段将在 1.7 中弃用。是否应孤立依赖对象。
如果为 true/false，"orphan" finalizer 将被添加到/从对象的 finalizers 列表中。
可以设置此字段或 PropagationPolicy，但不能同时设置两者。
      </td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>
<!--
Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
是否以及如何执行垃圾回收。可以设置此字段或 OrphanDependents，但不能同时设置两者。
默认策略由 metadata.finalizers 中设置的现有 finalizer 和资源特定的默认策略决定。可接受的值为：'Orphan' - 孤立依赖项；
'Background' - 允许垃圾收集器在后台删除依赖项；'Foreground' - 级联策略，在前台删除所有依赖项。
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersion 对请求可以服务的资源版本设置了约束。有关详情，请参见 
https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。
默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersionMatch 确定 resourceVersion 如何应用于列表调用。
强烈建议为设置了 resourceVersion 的列表调用设置 resourceVersionMatch。
有关详情，请参见 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource
-versions。默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
`sendInitialEvents=true` 可以与 `watch=true` 一起设置。在这种情况下，watch 流将以合成事件开始以生成集合中对象的当前状态。
一旦所有此类事件都已发送，将发送一个合成的 "Bookmark" 事件。
书签将报告与对象集合对应的 ResourceVersion (RV)，并标记有 `"k8s.io/initial-events-end": "true"` 注释。
之后，watch 流将像往常一样继续，发送与所监视对象的变更（在 RV 之后）对应的 watch 事件。
当设置 sendInitialEvents 选项时，我们要求也设置 resourceVersionMatch 选项。
watch 请求的语义如下：
<br/> - resourceVersionMatch = NotOlderThan 被解释为"至少与提供的 resourceVersion
一样新的数据"，当状态同步到至少与 ListOptions 提供的一样新的 resourceVersion 时发送书签事件。
如果 resourceVersion 未设置，这被解释为"一致读取"，当状态至少同步到请求开始处理的时刻时发送书签事件。
<br/> - resourceVersionMatch 设置为任何其他值或未设置，将返回 Invalid 错误。
如果 resourceVersion="" 或 resourceVersion="0"（出于向后兼容性原因），默认为 true，否则为 false。
      </td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.
-->
shardSelector 使用基于 CEL 的分片选择器表达式限制返回对象的列表。
该格式使用 shardRange() 函数结合 ||（逻辑或）来指定一个或多个哈希范围：
shardRange(object.metadata.uid, '0x0', '0x8000000000000000') 或
 shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange
(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')。
字段路径使用 CEL 风格的对象根语法（例如 "object.metadata.uid"），
而不是 fieldSelector 格式（"metadata.uid"）。目前支持的路径：
- object.metadata.uid - object.metadata.namespace。
hexStart 和 hexEnd 是带 '0x' 前缀的单引号 CEL 字符串字面量，定义了 64 位 FNV-1a 哈希空间上的包含性下限和排他性上限。
完整范围是 [0x0, 0x10000000000000000)，其中排他性上限等于 2^64。
示例：

2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') 

这是一个 Alpha 字段，需要启用 ShardedListAndWatch 特性门控。
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
list/watch 调用的超时时间。这限制了调用的持续时间，无论有任何活动或不活动。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Body Parameters
-->
#### 请求体参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `get` Read

#### HTTP Request
-->
### `get` 读取

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings/{name}

<!--
#### Path Parameters
-->
#### 路径参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>
<!--
name of the MutatingAdmissionPolicyBinding
-->
MutatingAdmissionPolicyBinding 的名称
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBinding" >}}">MutatingAdmissionPolicyBinding</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `get` List

#### HTTP Request
-->
### `get` 列表

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/mutatingadmissionpolicybindings

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.
-->
allowWatchBookmarks 请求类型为 "BOOKMARK" 的 watch 事件。不实现书签的服务器可能忽略此标志，书签由服务器自行决定发送。
客户端不应假设书签以任何特定间隔返回，也不应假设服务器会在会话期间发送任何 BOOKMARK 事件。如果这不是 watch，此字段将被忽略。
      </td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>
<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
当从服务器检索更多结果时，应设置 continue 选项。由于此值由服务器定义，
客户端只能使用来自具有相同查询参数（continue 值除外）的先前查询结果的 continue 值，服务器可能会拒绝无法识别的 continue 值。
如果指定的 continue 值由于过期（通常五到十五分钟）或服务器上的配置变更而不再有效，
服务器将返回 410 ResourceExpired 错误以及 continue 令牌。
如果客户端需要一致的列表，必须在没有 continue 字段的情况下重新开始列表。
否则，客户端可以发送带有 410 错误中收到的令牌的另一个列表请求，服务器将返回从下一个键开始的列表，但从最新的快照开始，
这与之前的列表结果不一致 - 在第一个列表请求之后创建、修改或删除的对象将包含在响应中，只要它们的键在"下一个键"之后。
当 watch 为 true 时，不支持此字段。客户端可以从服务器返回的最后一个 resourceVersion 值开始 watch，而不会错过任何修改。
      </td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
按字段限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
按标签限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
limit 是列表调用返回的最大响应数。如果存在更多项，服务器将在列表元数据上设置 continue
字段为一个值，可用于通过相同的初始查询检索下一组结果。
设置限制可能返回少于请求数量的项（最多零项），如果所有请求的对象都被过滤掉，
客户端只能使用 continue 字段的存在来确定是否还有更多结果可用。
服务器可以选择不支持 limit 参数并返回所有可用结果。如果指定了 limit 且 continue 为空，客户端可以假设没有更多结果可用。
当 watch 为 true 时，不支持此字段。服务器保证使用 continue 返回的对象与发出不带 limit 的单个列表调用相同 - 也就是说，
在第一个请求发出后创建、修改或删除的对象不会包含在任何后续继续请求中。这有时被称为一致快照，
并确保使用 limit 接收非常大结果的较小块的客户端可以确保看到所有可能的对象。
如果在分块列表期间对象被更新，则返回的是计算第一个列表结果时存在的对象版本。
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersion 对请求可以服务的资源版本设置了约束。有关详情，请参见 
https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。
默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersionMatch 确定 resourceVersion 如何应用于列表调用。
强烈建议为设置了 resourceVersion 的列表调用设置 resourceVersionMatch。
有关详情，请参见 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
`sendInitialEvents=true` 可以与 `watch=true` 一起设置。在这种情况下，watch 流将以合成事件开始以生成集合中对象的当前状态。一旦所有此类事件都已发送，将发送一个合成的 "Bookmark" 事件。书签将报告与对象集合对应的 ResourceVersion (RV)，并标记有 `"k8s.io/initial-events-end": "true"` 注释。之后，watch 流将像往常一样继续，发送与所监视对象的变更（在 RV 之后）对应的 watch 事件。当设置 sendInitialEvents 选项时，我们要求也设置 resourceVersionMatch 选项。watch 请求的语义如下：<br/> - resourceVersionMatch = NotOlderThan 被解释为"至少与提供的 resourceVersion 一样新的数据"，当状态同步到至少与 ListOptions 提供的一样新的 resourceVersion 时发送书签事件。如果 resourceVersion 未设置，这被解释为"一致读取"，当状态至少同步到请求开始处理的时刻时发送书签事件。<br/> - resourceVersionMatch 设置为任何其他值或未设置，将返回 Invalid 错误。如果 resourceVersion="" 或 resourceVersion="0"（出于向后兼容性原因），默认为 true，否则为 false。
      </td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.
-->
shardSelector 使用基于 CEL 的分片选择器表达式限制返回对象的列表。
该格式使用 shardRange() 函数结合 ||（逻辑或）来指定一个或多个哈希范围：
shardRange(object.metadata.uid, '0x0', '0x8000000000000000') 或
 shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange
(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')。
字段路径使用 CEL 风格的对象根语法（例如 "object.metadata.uid"），
而不是 fieldSelector 格式（"metadata.uid"）。目前支持的路径：
- object.metadata.uid - object.metadata.namespace。
hexStart 和 hexEnd 是带 '0x' 前缀的单引号 CEL 字符串字面量，定义了 64 位 FNV-1a 哈希空间上的包含性下限和排他性上限。
完整范围是 [0x0, 0x10000000000000000)，其中排他性上限等于 2^64。
示例：

 2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')

这是一个 Alpha 字段，需要启用 ShardedListAndWatch 特性门控。
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
list/watch 调用的超时时间。这限制了调用的持续时间，无论有任何活动或不活动。
      </td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
-->
监视所描述资源的变更，并以添加、更新和删除通知流的形式返回它们。指定 resourceVersion。
      </td>
    </tr>
  </tbody>
</table>


<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "mutating-admission-policy-binding-v1#MutatingAdmissionPolicyBindingList" >}}">MutatingAdmissionPolicyBindingList</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `get` Watch

#### HTTP Request
-->
### `get` 监视

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/watch/mutatingadmissionpolicybindings/{name}

<!--
#### Path Parameters
-->
#### 路径参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>
<!--
name of the MutatingAdmissionPolicyBinding
-->
MutatingAdmissionPolicyBinding 的名称
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.
-->
allowWatchBookmarks 请求类型为 "BOOKMARK" 的 watch 事件。不实现书签的服务器可能忽略此标志，书签由服务器自行决定发送。
客户端不应假设书签以任何特定间隔返回，也不应假设服务器会在会话期间发送任何 BOOKMARK 事件。如果这不是 watch，此字段将被忽略。
      </td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>
<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
当从服务器检索更多结果时，应设置 continue 选项。由于此值由服务器定义，
客户端只能使用来自具有相同查询参数（continue 值除外）的先前查询结果的 continue 值，服务器可能会拒绝无法识别的 continue 值。
如果指定的 continue 值由于过期（通常五到十五分钟）或服务器上的配置变更而不再有效，
服务器将返回 410 ResourceExpired 错误以及 continue 令牌。
如果客户端需要一致的列表，必须在没有 continue 字段的情况下重新开始列表。
否则，客户端可以发送带有 410 错误中收到的令牌的另一个列表请求，服务器将返回从下一个键开始的列表，但从最新的快照开始，
这与之前的列表结果不一致 - 在第一个列表请求之后创建、修改或删除的对象将包含在响应中，只要它们的键在"下一个键"之后。
当 watch 为 true 时，不支持此字段。客户端可以从服务器返回的最后一个 resourceVersion 值开始 watch，而不会错过任何修改。
      </td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
按字段限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
按标签限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
limit 是列表调用返回的最大响应数。如果存在更多项，服务器将在列表元数据上设置 continue
字段为一个值，可用于通过相同的初始查询检索下一组结果。
设置限制可能返回少于请求数量的项（最多零项），如果所有请求的对象都被过滤掉，
客户端只能使用 continue 字段的存在来确定是否还有更多结果可用。
服务器可以选择不支持 limit 参数并返回所有可用结果。如果指定了 limit 且 continue 为空，客户端可以假设没有更多结果可用。
当 watch 为 true 时，不支持此字段。服务器保证使用 continue 返回的对象与发出不带 limit 的单个列表调用相同 - 也就是说，
在第一个请求发出后创建、修改或删除的对象不会包含在任何后续继续请求中。这有时被称为一致快照，
并确保使用 limit 接收非常大结果的较小块的客户端可以确保看到所有可能的对象。
如果在分块列表期间对象被更新，则返回的是计算第一个列表结果时存在的对象版本。
      </td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，
除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersion 对请求可以服务的资源版本设置了约束。有关详情，请参见 
https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。
默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersionMatch 确定 resourceVersion 如何应用于列表调用。
强烈建议为设置了 resourceVersion 的列表调用设置 resourceVersionMatch。
有关详情，请参见 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
`sendInitialEvents=true` 可以与 `watch=true` 一起设置。在这种情况下，watch 流将以合成事件开始以生成集合中对象的当前状态。
一旦所有此类事件都已发送，将发送一个合成的 "Bookmark" 事件。书签将报告与对象集合对应的 ResourceVersion (RV)，
并标记有 `"k8s.io/initial-events-end": "true"` 注释。
之后，watch 流将像往常一样继续，发送与所监视对象的变更（在 RV 之后）对应的 watch 事件。
当设置 sendInitialEvents 选项时，我们要求也设置 resourceVersionMatch 选项。
watch 请求的语义如下：<br/> - resourceVersionMatch = NotOlderThan 被解释为"至少与提供的 resourceVersion
一样新的数据"，当状态同步到至少与 ListOptions 提供的一样新的 resourceVersion 时发送书签事件。
如果 resourceVersion 未设置，这被解释为"一致读取"，当状态至少同步到请求开始处理的时刻时发送书签事件。<br/> - resourceVersionMatch 设置为任何其他值或未设置，将返回 Invalid 错误。
如果 resourceVersion="" 或 resourceVersion="0"（出于向后兼容性原因），默认为 true，否则为 false。
      </td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.
-->
shardSelector 使用基于 CEL 的分片选择器表达式限制返回对象的列表。
该格式使用 shardRange() 函数结合 ||（逻辑或）来指定一个或多个哈希范围：
shardRange(object.metadata.uid, '0x0', '0x8000000000000000') 或
 shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange
(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')。
字段路径使用 CEL 风格的对象根语法（例如 "object.metadata.uid"），
而不是 fieldSelector 格式（"metadata.uid"）。目前支持的路径：
- object.metadata.uid - object.metadata.namespace。
hexStart 和 hexEnd 是带 '0x' 前缀的单引号 CEL 字符串字面量，定义了 64 位 FNV-1a 哈希空间上的包含性下限和排他性上限。
完整范围是 [0x0, 0x10000000000000000)，其中排他性上限等于 2^64。
示例：

 2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')

这是一个 Alpha 字段，需要启用 ShardedListAndWatch 特性门控。
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
list/watch 调用的超时时间。这限制了调用的持续时间，无论有任何活动或不活动。
      </td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
-->
监视所描述资源的变更，并以添加、更新和删除通知流的形式返回它们。指定 resourceVersion。
      </td>
    </tr>
  </tbody>
</table>


<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

<!--
### `get` Watch List

#### HTTP Request
-->
### `get` 监视列表

#### HTTP 请求

GET /apis/admissionregistration.k8s.io/v1/watch/mutatingadmissionpolicybindings

<!--
#### Query Parameters
-->
#### 查询参数

<table>
  <thead><tr><th>Name</th><th><!--Type-->类型</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.
-->
allowWatchBookmarks 请求类型为 "BOOKMARK" 的 watch 事件。不实现书签的服务器可能忽略此标志，书签由服务器自行决定发送。
客户端不应假设书签以任何特定间隔返回，也不应假设服务器会在会话期间发送任何 BOOKMARK 事件。如果这不是 watch，此字段将被忽略。
      </td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>
<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
当从服务器检索更多结果时，应设置 continue 选项。由于此值由服务器定义，
客户端只能使用来自具有相同查询参数（continue 值除外）的先前查询结果的 continue 值，服务器可能会拒绝无法识别的 continue 值。
如果指定的 continue 值由于过期（通常五到十五分钟）或服务器上的配置变更而不再有效，
服务器将返回 410 ResourceExpired 错误以及 continue 令牌。
如果客户端需要一致的列表，必须在没有 continue 字段的情况下重新开始列表。
否则，客户端可以发送带有 410 错误中收到的令牌的另一个列表请求，服务器将返回从下一个键开始的列表，但从最新的快照开始，
这与之前的列表结果不一致 - 在第一个列表请求之后创建、修改或删除的对象将包含在响应中，只要它们的键在"下一个键"之后。
当 watch 为 true 时，不支持此字段。客户端可以从服务器返回的最后一个 resourceVersion 值开始 watch，而不会错过任何修改。
      </td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
按字段限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
按标签限制返回对象列表的选择器。默认为全部内容。
      </td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
limit 是列表调用返回的最大响应数。如果存在更多项，服务器将在列表元数据上设置 continue
字段为一个值，可用于通过相同的初始查询检索下一组结果。
设置限制可能返回少于请求数量的项（最多零项），如果所有请求的对象都被过滤掉，
客户端只能使用 continue 字段的存在来确定是否还有更多结果可用。
服务器可以选择不支持 limit 参数并返回所有可用结果。如果指定了 limit 且 continue 为空，客户端可以假设没有更多结果可用。
当 watch 为 true 时，不支持此字段。服务器保证使用 continue 返回的对象与发出不带 limit 的单个列表调用相同 - 也就是说，
在第一个请求发出后创建、修改或删除的对象不会包含在任何后续继续请求中。这有时被称为一致快照，
并确保使用 limit 接收非常大结果的较小块的客户端可以确保看到所有可能的对象。如果在分块列表期间对象被更新，则返回的是计算第一个列表结果时存在的对象版本。
      </td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>
<!--
If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).
-->
如果为 'true'，则输出会进行美化打印。默认为 'false'，
除非用户代理指示是浏览器或命令行 HTTP 工具（curl 和 wget）。
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersion 对请求可以服务的资源版本设置了约束。有关详情，请参见 
https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。
默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>
<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset
-->
resourceVersionMatch 确定 resourceVersion 如何应用于列表调用。
强烈建议为设置了 resourceVersion 的列表调用设置 resourceVersionMatch。
有关详情，请参见 https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。默认为未设置
      </td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
`sendInitialEvents=true` 可以与 `watch=true` 一起设置。在这种情况下，watch 流将以合成事件开始以生成集合中对象的当前状态。
一旦所有此类事件都已发送，将发送一个合成的 "Bookmark" 事件。书签将报告与对象集合对应的 ResourceVersion (RV)，
并标记有 `"k8s.io/initial-events-end": "true"` 注释。
之后，watch 流将像往常一样继续，发送与所监视对象的变更（在 RV 之后）对应的 watch 事件。当设置 sendInitialEvents 选项时，
我们要求也设置 resourceVersionMatch 选项。
watch 请求的语义如下：<br/> - resourceVersionMatch = NotOlderThan 被解释为"至少与提供的 resourceVersion 一样新的数据"，当状态同步到至少与 ListOptions 提供的一样新的 resourceVersion 时发送书签事件。
如果 resourceVersion 未设置，这被解释为"一致读取"，当状态至少同步到请求开始处理的时刻时发送书签事件。<br/> - resourceVersionMatch 设置为任何其他值或未设置，将返回 Invalid 错误。
如果 resourceVersion="" 或 resourceVersion="0"（出于向后兼容性原因），默认为 true，否则为 false。
      </td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>
<!--
shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.
-->
shardSelector 使用基于 CEL 的分片选择器表达式限制返回对象的列表。
该格式使用 shardRange() 函数结合 ||（逻辑或）来指定一个或多个哈希范围：
shardRange(object.metadata.uid, '0x0', '0x8000000000000000') 或
 shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange
(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')。
字段路径使用 CEL 风格的对象根语法（例如 "object.metadata.uid"），
而不是 fieldSelector 格式（"metadata.uid"）。目前支持的路径：
- object.metadata.uid - object.metadata.namespace。
hexStart 和 hexEnd 是带 '0x' 前缀的单引号 CEL 字符串字面量，定义了 64 位 FNV-1a 哈希空间上的包含性下限和排他性上限。
完整范围是 [0x0, 0x10000000000000000)，其中排他性上限等于 2^64。
示例：

2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')

这是一个 Alpha 字段，需要启用 ShardedListAndWatch 特性门控。
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>
<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
列表/watch 调用的超时时间。这限制了调用的持续时间，无论有任何活动或不活动。
      </td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>
<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
-->
监视所描述资源的变更，并以添加、更新和删除通知流的形式返回它们。指定 resourceVersion。
      </td>
    </tr>
  </tbody>
</table>

<!--
#### Response
-->
#### 响应

<table>
  <thead><tr><th>Status</th><th><!--Description-->描述</th><th><!--Response-->响应</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>
