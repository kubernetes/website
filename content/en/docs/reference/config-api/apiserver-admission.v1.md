---
title: kube-apiserver Admission (v1)
content_type: tool-reference
package: admission.k8s.io/v1
auto_generated: true
---


## Resource Types 


- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)
  

## `AdmissionReview`     {#admission-k8s-io-v1-AdmissionReview}
    


<p>AdmissionReview describes an admission review request/response.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>admission.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionReview</code></td></tr>
    
  
<tr><td><code>request</code><br/>
<a href="#admission-k8s-io-v1-AdmissionRequest"><code>AdmissionRequest</code></a>
</td>
<td>
   <p>Request describes the attributes for the admission request.</p>
</td>
</tr>
<tr><td><code>response</code><br/>
<a href="#admission-k8s-io-v1-AdmissionResponse"><code>AdmissionResponse</code></a>
</td>
<td>
   <p>Response describes the attributes for the admission response.</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionRequest`     {#admission-k8s-io-v1-AdmissionRequest}
    

**Appears in:**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)


<p>AdmissionRequest describes the admission.Attributes for the admission request.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <p>UID is an identifier for the individual request/response. It allows us to distinguish instances of requests which are
otherwise identical (parallel requests, requests when earlier requests did not modify etc)
The UID is meant to track the round trip (request/response) between the KAS and the WebHook, not the user request.
It is suitable for correlating log entries between the webhook and apiserver, for either auditing or debugging.</p>
</td>
</tr>
<tr><td><code>kind</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
</td>
<td>
   <p>Kind is the fully-qualified type of object being submitted (for example, v1.Pod or autoscaling.v1.Scale)</p>
</td>
</tr>
<tr><td><code>resource</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
</td>
<td>
   <p>Resource is the fully-qualified resource being requested (for example, v1.pods)</p>
</td>
</tr>
<tr><td><code>subResource</code><br/>
<code>string</code>
</td>
<td>
   <p>SubResource is the subresource being requested, if any (for example, &quot;status&quot; or &quot;scale&quot;)</p>
</td>
</tr>
<tr><td><code>requestKind</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
</td>
<td>
   <p>RequestKind is the fully-qualified type of the original API request (for example, v1.Pod or autoscaling.v1.Scale).
If this is specified and differs from the value in &quot;kind&quot;, an equivalent match and conversion was performed.</p>
<p>For example, if deployments can be modified via apps/v1 and apps/v1beta1, and a webhook registered a rule of
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> and <code>matchPolicy: Equivalent</code>,
an API request to apps/v1beta1 deployments would be converted and sent to the webhook
with <code>kind: {group:&quot;apps&quot;, version:&quot;v1&quot;, kind:&quot;Deployment&quot;}</code> (matching the rule the webhook registered for),
and <code>requestKind: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, kind:&quot;Deployment&quot;}</code> (indicating the kind of the original API request).</p>
<p>See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type for more details.</p>
</td>
</tr>
<tr><td><code>requestResource</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
</td>
<td>
   <p>RequestResource is the fully-qualified resource of the original API request (for example, v1.pods).
If this is specified and differs from the value in &quot;resource&quot;, an equivalent match and conversion was performed.</p>
<p>For example, if deployments can be modified via apps/v1 and apps/v1beta1, and a webhook registered a rule of
<code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> and <code>matchPolicy: Equivalent</code>,
an API request to apps/v1beta1 deployments would be converted and sent to the webhook
with <code>resource: {group:&quot;apps&quot;, version:&quot;v1&quot;, resource:&quot;deployments&quot;}</code> (matching the resource the webhook registered for),
and <code>requestResource: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, resource:&quot;deployments&quot;}</code> (indicating the resource of the original API request).</p>
<p>See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type.</p>
</td>
</tr>
<tr><td><code>requestSubResource</code><br/>
<code>string</code>
</td>
<td>
   <p>RequestSubResource is the name of the subresource of the original API request, if any (for example, &quot;status&quot; or &quot;scale&quot;)
If this is specified and differs from the value in &quot;subResource&quot;, an equivalent match and conversion was performed.
See documentation for the &quot;matchPolicy&quot; field in the webhook configuration type.</p>
</td>
</tr>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p>Name is the name of the object as presented in the request.  On a CREATE operation, the client may omit name and
rely on the server to generate the name.  If that is the case, this field will contain an empty string.</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <p>Namespace is the namespace associated with the request (if any).</p>
</td>
</tr>
<tr><td><code>operation</code> <B>[Required]</B><br/>
<a href="#admission-k8s-io-v1-Operation"><code>Operation</code></a>
</td>
<td>
   <p>Operation is the operation being performed. This may be different than the operation
requested. e.g. a patch can result in either a CREATE or UPDATE Operation.</p>
</td>
</tr>
<tr><td><code>userInfo</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>UserInfo is information about the requesting user</p>
</td>
</tr>
<tr><td><code>object</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Object is the object from the incoming request.</p>
</td>
</tr>
<tr><td><code>oldObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>OldObject is the existing object. Only populated for DELETE and UPDATE requests.</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p>DryRun indicates that modifications will definitely not be persisted for this request.
Defaults to false.</p>
</td>
</tr>
<tr><td><code>options</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Options is the operation option structure of the operation being performed.
e.g. <code>meta.k8s.io/v1.DeleteOptions</code> or <code>meta.k8s.io/v1.CreateOptions</code>. This may be
different than the options the caller provided. e.g. for a patch request the performed
Operation might be a CREATE, in which case the Options will a
<code>meta.k8s.io/v1.CreateOptions</code> even though the caller provided <code>meta.k8s.io/v1.PatchOptions</code>.</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionResponse`     {#admission-k8s-io-v1-AdmissionResponse}
    

**Appears in:**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)


<p>AdmissionResponse describes an admission response.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <p>UID is an identifier for the individual request/response.
This must be copied over from the corresponding AdmissionRequest.</p>
</td>
</tr>
<tr><td><code>allowed</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Allowed indicates whether or not the admission request was permitted.</p>
</td>
</tr>
<tr><td><code>status</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#status-v1-meta"><code>meta/v1.Status</code></a>
</td>
<td>
   <p>Result contains extra details into why an admission request was denied.
This field IS NOT consulted in any way if &quot;Allowed&quot; is &quot;true&quot;.</p>
</td>
</tr>
<tr><td><code>patch</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>The patch body. Currently we only support &quot;JSONPatch&quot; which implements RFC 6902.</p>
</td>
</tr>
<tr><td><code>patchType</code><br/>
<a href="#admission-k8s-io-v1-PatchType"><code>PatchType</code></a>
</td>
<td>
   <p>The type of Patch. Currently we only allow &quot;JSONPatch&quot;.</p>
</td>
</tr>
<tr><td><code>auditAnnotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>AuditAnnotations is an unstructured key value map set by remote admission controller (e.g. error=image-blacklisted).
MutatingAdmissionWebhook and ValidatingAdmissionWebhook admission controller will prefix the keys with
admission webhook name (e.g. imagepolicy.example.com/error=image-blacklisted). AuditAnnotations will be provided by
the admission webhook to add additional context to the audit log for this request.</p>
</td>
</tr>
<tr><td><code>warnings</code><br/>
<code>[]string</code>
</td>
<td>
   <p>warnings is a list of warning messages to return to the requesting API client.
Warning messages describe a problem the client making the API request should correct or be aware of.
Limit warnings to 120 characters if possible.
Warnings over 256 characters and large numbers of warnings may be truncated.</p>
</td>
</tr>
</tbody>
</table>

## `Operation`     {#admission-k8s-io-v1-Operation}
    
(Alias of `string`)

**Appears in:**

- [AdmissionRequest](#admission-k8s-io-v1-AdmissionRequest)


<p>Operation is the type of resource operation being checked for admission control</p>




## `PatchType`     {#admission-k8s-io-v1-PatchType}
    
(Alias of `string`)

**Appears in:**

- [AdmissionResponse](#admission-k8s-io-v1-AdmissionResponse)


<p>PatchType is the type of patch being used to represent the mutated object</p>



  