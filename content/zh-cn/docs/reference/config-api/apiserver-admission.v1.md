---
title: kube-apiserver Admission (v1)
content_type: tool-reference
package: admission.k8s.io/v1
---
<!--
title: kube-apiserver Admission (v1)
content_type: tool-reference
package: admission.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types
-->
## 资源类型

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)
  
## `AdmissionReview`     {#admission-k8s-io-v1-AdmissionReview}

<!--
<p>AdmissionReview describes an admission review request/response.</p>
-->
<p><code>AdmissionReview</code> 描述准入评审请求/响应。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>admission.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionReview</code></td></tr>
    
  
<tr><td><code>request</code><br/>
<a href="#admission-k8s-io-v1-AdmissionRequest"><code>AdmissionRequest</code></a>
</td>
<td>
   <!--
   <p>Request describes the attributes for the admission request.</p>
   -->
   <p><code>request</code> 描述准入请求的属性。</p>
</td>
</tr>
<tr><td><code>response</code><br/>
<a href="#admission-k8s-io-v1-AdmissionResponse"><code>AdmissionResponse</code></a>
</td>
<td>
   <!--
   <p>Response describes the attributes for the admission response.</p>
   -->
   <p><code>response</code> 描述准入响应的属性。</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionRequest`     {#admission-k8s-io-v1-AdmissionRequest}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)

<!--
<p>AdmissionRequest describes the admission.Attributes for the admission request.</p>
-->
<p><code>AdmissionRequest</code> 描述准入请求的 admission.Attributes。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <!--
   <p>UID is an identifier for the individual request/response. It allows us to distinguish instances of requests which are
otherwise identical (parallel requests, requests when earlier requests did not modify etc)
The UID is meant to track the round trip (request/response) between the KAS and the WebHook, not the user request.
It is suitable for correlating log entries between the webhook and apiserver, for either auditing or debugging.</p>
   -->
   <p><code>uid</code> 是用于标识单个请求/响应的标识符。它允许我们区分在其他情况下完全相同的请求实例（并行请求、在先前请求未修改时的请求等）。
<code>uid</code> 的目的是跟踪 KAS（Kubernetes Admission Server）和 WebHook 之间的轮询（请求/响应），而不是用户请求。
它适用于在 WebHook 和 API 服务器之间建立日志条目上的关联，从而服务于审计或调试目的。</p>

</td>
</tr>
<tr><td><code>kind</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
</td>
<td>
   <!--
   <p>Kind is the fully-qualified type of object being submitted (for example, v1.Pod or autoscaling.v1.Scale)</p>
   -->
   <p><code>kind</code> 是正被提交的对象的全限定类别名称（例如 v1.Pod 或 autoscaling.v1.Scale）。</p>
</td>
</tr>
<tr><td><code>resource</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
</td>
<td>
   <!--
   <p>Resource is the fully-qualified resource being requested (for example, v1.pods)</p>
   -->
   <p><code>resource</code> 是正被请求的资源的全限定名称（例如 v1.pods）。</p>
</td>
</tr>
<tr><td><code>subResource</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>SubResource is the subresource being requested, if any (for example, &quot;status&quot; or &quot;scale&quot;)</p>
   -->
   <p><code>subResource</code> 是正被请求的子资源——如果存在的话（例如 &quot;status&quot; 或 &quot;scale&quot;）。</p>
</td>
</tr>
<tr><td><code>requestKind</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
</td>
<td>
   <!--
   <p>RequestKind is the fully-qualified type of the original API request (for example, v1.Pod or autoscaling.v1.Scale).
If this is specified and differs from the value in &quot;kind&quot;, an equivalent match and conversion was performed.</p>
<p>For example, if deployments can be modified via apps/v1 and apps/v1beta1, and a webhook registered a rule of
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> and <code>matchPolicy: Equivalent</code>,
an API request to apps/v1beta1 deployments would be converted and sent to the webhook
with <code>kind: {group:&quot;apps&quot;, version:&quot;v1&quot;, kind:&quot;Deployment&quot;}</code> (matching the rule the webhook registered for),
and <code>requestKind: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, kind:&quot;Deployment&quot;}</code> (indicating the kind of the original API request).</p>
<p>See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type for more details.</p>
   -->
   <p><code>requestKind</code> 是原始 API 请求的完全限定类别名称（例如 v1.Pod 或 autoscaling.v1.Scale）。
如果此字段被指定且不同于 &quot;kind&quot; 中的值，则执行等效的匹配和转换。</p>
<p>例如，如果 Deployment 可以通过 apps/v1 和 apps/v1beta1 进行修改，并且 Webhook 注册了
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code>
和 <code>matchPolicy: Equivalent</code> 的规则，那么指向 apps/v1beta1 Deployment 的 API 请求将被转换并发送到 Webhook，
其中 <code>kind: {group:&quot;apps&quot;, version:&quot;v1&quot;, kind:&quot;Deployment&quot;}</code>
（与 Webhook 注册的规则匹配）并且 <code>requestKind: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, kind:&quot;Deployment&quot;}</code>（指示原始 API 请求的类别）。</p>
<p>参阅文档了解 Webhook 配置类型中 &quot;matchPolicy&quot; 字段的更多细节。</p>

</td>
</tr>
<tr><td><code>requestResource</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
</td>
<td>
   <!--
   <p>RequestResource is the fully-qualified resource of the original API request (for example, v1.pods).
If this is specified and differs from the value in &quot;resource&quot;, an equivalent match and conversion was performed.</p>
<p>For example, if deployments can be modified via apps/v1 and apps/v1beta1, and a webhook registered a rule of
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> and <code>matchPolicy: Equivalent</code>,
an API request to apps/v1beta1 deployments would be converted and sent to the webhook
with <code>resource: {group:&quot;apps&quot;, version:&quot;v1&quot;, resource:&quot;deployments&quot;}</code> (matching the resource the webhook registered for),
and <code>requestResource: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, resource:&quot;deployments&quot;}</code> (indicating the resource of the original API request).</p>
<p>See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type.</p>
   -->
   <p><code>requestResource</code> 是原始 API 请求的全限定资源名称（例如 v1.pods）。
如果此字段被指定且不同于 &quot;resource&quot; 中的值，则执行等效的匹配和转换。</p>
<p>例如，如果 Deployment 可以通过 apps/v1 和 apps/v1beta1 修改，并且 Webhook 注册了
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> 和
<code>matchPolicy: Equivalent</code> 的规则，那么指向 apps/v1beta1 Deployment 的 API 请求将被转换并发送到 Webhook，
其中 <code>resource: {group:&quot;apps&quot;, version:&quot;v1&quot;, resource:&quot;deployments&quot;}</code>
（与 Webhook 注册的资源匹配）以及 <code>requestResource: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, resource:&quot;deployments&quot;}</code>（指示原始 API 请求的资源）。</p>
<p>参阅文档了解 Webhook 配置类型中 &quot;matchPolicy&quot; 字段的更多细节。</p>
</td>
</tr>
<tr><td><code>requestSubResource</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>RequestSubResource is the name of the subresource of the original API request, if any (for example, &quot;status&quot; or &quot;scale&quot;)
If this is specified and differs from the value in &quot;subResource&quot;, an equivalent match and conversion was performed.
See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type.</p>
   -->
   <p><code>requestSubResource</code> 是可能存在的、原始 API 所请求的子资源（例如 &quot;status&quot; 或 &quot;scale&quot;）。
如果此字段被指定且不同于 &quot;subResource&quot; 中的值，则执行等效的匹配和转换。
参阅文档了解 Webhook 配置类型中的 &quot;matchPolicy&quot; 字段。</p>
</td>
</tr>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>Name is the name of the object as presented in the request.  On a CREATE operation, the client may omit name and
rely on the server to generate the name.  If that is the case, this field will contain an empty string.</p>
   -->
   <p><code>name</code> 是出现在请求中的对象的名称。客户端在执行 CREATE 操作时，可以忽略此命令并依赖服务器生成此名称。
   如果是这种情况，此字段将包含一个空白字符串。</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>Namespace is the namespace associated with the request (if any).</p>
   -->
   <p><code>namespace</code> 是与请求（如果有的话）关联的命名空间。</p>
</td>
</tr>
<tr><td><code>operation</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#admission-k8s-io-v1-Operation"><code>Operation</code></a>
</td>
<td>
   <!--
   <p>Operation is the operation being performed. This may be different than the operation
requested. e.g. a patch can result in either a CREATE or UPDATE Operation.</p>
   -->
   <p><code>operation</code> 是正在执行的操作。这可能不同于请求的操作，
   例如 patch 可以造成 CREATE 或 UPDATE 操作。</p>
</td>
</tr>
<tr><td><code>userInfo</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <!--
   <p>UserInfo is information about the requesting user</p>
   -->
   <p><code>userInfo</code> 是发出请求的用户的相关信息。</p>
</td>
</tr>
<tr><td><code>object</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   <p>Object is the object from the incoming request.</p>
   -->
   <p><code>object</code> 是来自传入请求的对象。</p>
</td>
</tr>
<tr><td><code>oldObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   <p>OldObject is the existing object. Only populated for DELETE and UPDATE requests.</p>
   -->
   <p><code>oldObject</code> 是现有的对象。只有 DELETE 和 UPDATE 请求中此字段会有值。</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   <p>DryRun indicates that modifications will definitely not be persisted for this request.
Defaults to false.</p>
   -->
   <p><code>dryRun</code> 表示此请求的修改绝对不会被持久化。默认为 false。</p>
</td>
</tr>
<tr><td><code>options</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--
   <p>Options is the operation option structure of the operation being performed.
e.g. <code>meta.k8s.io/v1.DeleteOptions</code> or <code>meta.k8s.io/v1.CreateOptions</code>. This may be
different than the options the caller provided. e.g. for a patch request the performed
Operation might be a CREATE, in which case the Options will a
<code>meta.k8s.io/v1.CreateOptions</code> even though the caller provided <code>meta.k8s.io/v1.PatchOptions</code>.</p>
   -->
   <p><code>options</code> 是正在执行的操作的操作选项结构。
例如 <code>meta.k8s.io/v1.DeleteOptions</code> 或 <code>meta.k8s.io/v1.CreateOptions</code>。
所设置的值可能不同于调用方所提供的选项。例如 patch 请求执行的操作可能是 CREATE，那这种情况下即使调用方提供了
<code>meta.k8s.io/v1.PatchOptions</code>，<code>options</code> 也将是 <code>meta.k8s.io/v1.CreateOptions</code>。</p></p>
</td>
</tr>
</tbody>
</table>

## `AdmissionResponse`     {#admission-k8s-io-v1-AdmissionResponse}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)

<!--
<p>AdmissionResponse describes an admission response.</p>
-->
<p><code>AdmissionResponse</code> 描述准入响应。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <!--
   <p>UID is an identifier for the individual request/response.
This must be copied over from the corresponding AdmissionRequest.</p>
   -->
   <p><code>uid</code> 是标识单独请求/响应的标识符。
它必须从相应的 AdmissionRequest 复制过来。</p>
</td>
</tr>
<tr><td><code>allowed</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--
   <p>Allowed indicates whether or not the admission request was permitted.</p>
   -->
   <p><code>allowed</code> 表示准入请求是否被允许。</p>
</td>
</tr>
<tr><td><code>status</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#status-v1-meta"><code>meta/v1.Status</code></a>
</td>
<td>
   <!--
   <p>Result contains extra details into why an admission request was denied.
This field IS NOT consulted in any way if &quot;Allowed&quot; is &quot;true&quot;.</p>
   -->
   <p><code>status</code> 包含为什么准入请求被拒绝的额外细节。
如果 &quot;Allowed&quot; 的值为 &quot;true&quot;，则不会以任何方式使用此字段。</p>

</td>
</tr>
<tr><td><code>patch</code><br/>
<code>[]byte</code>
</td>
<td>
   <!--
   <p>The patch body. Currently we only support &quot;JSONPatch&quot; which implements RFC 6902.</p>
   -->
   <p><code>patch</code> 操作的主体。目前 Kubernetes 仅支持实现了 RFC 6902 的 &quot;JSONPatch&quot;。</p>
</td>
</tr>
<tr><td><code>patchType</code><br/>
<a href="#admission-k8s-io-v1-PatchType"><code>PatchType</code></a>
</td>
<td>
   <!--
   <p>The type of Patch. Currently we only allow &quot;JSONPatch&quot;.</p>
   -->
   <p><code>patch</code> 的类型。目前 Kubernetes 仅允许 &quot;JSONPatch&quot;。</p>
</td>
</tr>
<tr><td><code>auditAnnotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--
   <p>AuditAnnotations is an unstructured key value map set by remote admission controller (e.g. error=image-blacklisted).
MutatingAdmissionWebhook and ValidatingAdmissionWebhook admission controller will prefix the keys with
admission webhook name (e.g. imagepolicy.example.com/error=image-blacklisted). AuditAnnotations will be provided by
the admission webhook to add additional context to the audit log for this request.</p>
   -->
   <p><code>auditAnnotations</code> 是由远程准入控制器设置的非结构化键值映射（例如 error=image-blacklisted）。
MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook 准入控制器将在键前缀中使用准入 Webhook 名称
（例如 imagepolicy.example.com/error=image-blacklisted）。<code>auditAnnotations</code> 将由准入
Webhook 提供，向此请求的审计日志添加额外的上下文。</p>

</td>
</tr>
<tr><td><code>warnings</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>warnings is a list of warning messages to return to the requesting API client.
Warning messages describe a problem the client making the API request should correct or be aware of.
Limit warnings to 120 characters if possible.
Warnings over 256 characters and large numbers of warnings may be truncated.</p>
   -->
   <p><code>warnings</code> 是警告消息的列表，返回给发出请求的 API 客户端。
这些警告消息描述客户端在进行 API 请求时应该纠正或注意的问题。
如果可能的话，将 <code>warnings</code> 限制在 120 个字符以内。
如果 <code>warnings</code> 中的消息超过 256 个字符，或 <code>warnings</code> 数量过多，可能会被截断。</p>

</td>
</tr>
</tbody>
</table>

## `Operation`     {#admission-k8s-io-v1-Operation}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 的别名）

**出现在：**

- [AdmissionRequest](#admission-k8s-io-v1-AdmissionRequest)

<!--
<p>Operation is the type of resource operation being checked for admission control</p>
-->
<p><code>Operation</code> 是正在检查准入控制时资源操作的类型。</p>

## `PatchType`     {#admission-k8s-io-v1-PatchType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 的别名）

**出现在：**

- [AdmissionResponse](#admission-k8s-io-v1-AdmissionResponse)

<!--
<p>PatchType is the type of patch being used to represent the mutated object</p>
-->
<p><code>PatchType</code> 是用于表示所变更对象的补丁类型。</p>
