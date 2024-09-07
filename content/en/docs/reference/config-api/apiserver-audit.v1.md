---
title: kube-apiserver Audit Configuration (v1)
content_type: tool-reference
package: audit.k8s.io/v1
auto_generated: true
---


## Resource Types 


- [Event](#audit-k8s-io-v1-Event)
- [EventList](#audit-k8s-io-v1-EventList)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyList](#audit-k8s-io-v1-PolicyList)
  

## `Event`     {#audit-k8s-io-v1-Event}
    

**Appears in:**

- [EventList](#audit-k8s-io-v1-EventList)


<p>Event captures all the information that can be included in an API audit log.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Event</code></td></tr>
    
  
<tr><td><code>level</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
</td>
<td>
   <p>AuditLevel at which event was generated</p>
</td>
</tr>
<tr><td><code>auditID</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <p>Unique audit ID, generated for each request.</p>
</td>
</tr>
<tr><td><code>stage</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-Stage"><code>Stage</code></a>
</td>
<td>
   <p>Stage of the request handling when this event instance was generated.</p>
</td>
</tr>
<tr><td><code>requestURI</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>RequestURI is the request URI as sent by the client to a server.</p>
</td>
</tr>
<tr><td><code>verb</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Verb is the kubernetes verb associated with the request.
For non-resource requests, this is the lower-cased HTTP method.</p>
</td>
</tr>
<tr><td><code>user</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>Authenticated user information.</p>
</td>
</tr>
<tr><td><code>impersonatedUser</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>Impersonated user information.</p>
</td>
</tr>
<tr><td><code>sourceIPs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Source IPs, from where the request originated and intermediate proxies.
The source IPs are listed from (in order):</p>
<ol>
<li>X-Forwarded-For request header IPs</li>
<li>X-Real-Ip header, if not present in the X-Forwarded-For list</li>
<li>The remote address for the connection, if it doesn't match the last
IP in the list up to here (X-Forwarded-For or X-Real-Ip).
Note: All but the last IP can be arbitrarily set by the client.</li>
</ol>
</td>
</tr>
<tr><td><code>userAgent</code><br/>
<code>string</code>
</td>
<td>
   <p>UserAgent records the user agent string reported by the client.
Note that the UserAgent is provided by the client, and must not be trusted.</p>
</td>
</tr>
<tr><td><code>objectRef</code><br/>
<a href="#audit-k8s-io-v1-ObjectReference"><code>ObjectReference</code></a>
</td>
<td>
   <p>Object reference this request is targeted at.
Does not apply for List-type requests, or non-resource requests.</p>
</td>
</tr>
<tr><td><code>responseStatus</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#status-v1-meta"><code>meta/v1.Status</code></a>
</td>
<td>
   <p>The response status, populated even when the ResponseObject is not a Status type.
For successful responses, this will only include the Code and StatusSuccess.
For non-status type error responses, this will be auto-populated with the error Message.</p>
</td>
</tr>
<tr><td><code>requestObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>API object from the request, in JSON format. The RequestObject is recorded as-is in the request
(possibly re-encoded as JSON), prior to version conversion, defaulting, admission or
merging. It is an external versioned object type, and may not be a valid object on its own.
Omitted for non-resource requests.  Only logged at Request Level and higher.</p>
</td>
</tr>
<tr><td><code>responseObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>API object returned in the response, in JSON. The ResponseObject is recorded after conversion
to the external type, and serialized as JSON.  Omitted for non-resource requests.  Only logged
at Response Level.</p>
</td>
</tr>
<tr><td><code>requestReceivedTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <p>Time the request reached the apiserver.</p>
</td>
</tr>
<tr><td><code>stageTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <p>Time the request reached current audit stage.</p>
</td>
</tr>
<tr><td><code>annotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>Annotations is an unstructured key value map stored with an audit event that may be set by
plugins invoked in the request serving chain, including authentication, authorization and
admission plugins. Note that these annotations are for the audit event, and do not correspond
to the metadata.annotations of the submitted object. Keys should uniquely identify the informing
component to avoid name collisions (e.g. podsecuritypolicy.admission.k8s.io/policy). Values
should be short. Annotations are included in the Metadata level.</p>
</td>
</tr>
</tbody>
</table>

## `EventList`     {#audit-k8s-io-v1-EventList}
    


<p>EventList is a list of audit Events.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EventList</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>items</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-Event"><code>[]Event</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `Policy`     {#audit-k8s-io-v1-Policy}
    

**Appears in:**

- [PolicyList](#audit-k8s-io-v1-PolicyList)


<p>Policy defines the configuration of audit logging, and the rules for how different request
categories are logged.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Policy</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <p>ObjectMeta is included for interoperability with API infrastructure.</p>
Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>rules</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-PolicyRule"><code>[]PolicyRule</code></a>
</td>
<td>
   <p>Rules specify the audit Level a request should be recorded at.
A request may match multiple rules, in which case the FIRST matching rule is used.
The default audit level is None, but can be overridden by a catch-all rule at the end of the list.
PolicyRules are strictly ordered.</p>
</td>
</tr>
<tr><td><code>omitStages</code><br/>
<a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
</td>
<td>
   <p>OmitStages is a list of stages for which no events are created. Note that this can also
be specified per rule in which case the union of both are omitted.</p>
</td>
</tr>
<tr><td><code>omitManagedFields</code><br/>
<code>bool</code>
</td>
<td>
   <p>OmitManagedFields indicates whether to omit the managed fields of the request
and response bodies from being written to the API audit log.
This is used as a global default - a value of 'true' will omit the managed fileds,
otherwise the managed fields will be included in the API audit log.
Note that this can also be specified per rule in which case the value specified
in a rule will override the global default.</p>
</td>
</tr>
</tbody>
</table>

## `PolicyList`     {#audit-k8s-io-v1-PolicyList}
    


<p>PolicyList is a list of audit Policies.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PolicyList</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>items</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-Policy"><code>[]Policy</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `GroupResources`     {#audit-k8s-io-v1-GroupResources}
    

**Appears in:**

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)


<p>GroupResources represents resource kinds in an API group.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>group</code><br/>
<code>string</code>
</td>
<td>
   <p>Group is the name of the API group that contains the resources.
The empty string represents the core API group.</p>
</td>
</tr>
<tr><td><code>resources</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Resources is a list of resources this rule applies to.</p>
<p>For example:</p>
<ul>
<li><code>pods</code> matches pods.</li>
<li><code>pods/log</code> matches the log subresource of pods.</li>
<li><code>*</code> matches all resources and their subresources.</li>
<li><code>pods/*</code> matches all subresources of pods.</li>
<li><code>*/scale</code> matches all scale subresources.</li>
</ul>
<p>If wildcard is present, the validation rule will ensure resources do not
overlap with each other.</p>
<p>An empty list implies all resources and subresources in this API groups apply.</p>
</td>
</tr>
<tr><td><code>resourceNames</code><br/>
<code>[]string</code>
</td>
<td>
   <p>ResourceNames is a list of resource instance names that the policy matches.
Using this field requires Resources to be specified.
An empty list implies that every instance of the resource is matched.</p>
</td>
</tr>
</tbody>
</table>

## `Level`     {#audit-k8s-io-v1-Level}
    
(Alias of `string`)

**Appears in:**

- [Event](#audit-k8s-io-v1-Event)

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)


<p>Level defines the amount of information logged during auditing</p>




## `ObjectReference`     {#audit-k8s-io-v1-ObjectReference}
    

**Appears in:**

- [Event](#audit-k8s-io-v1-Event)


<p>ObjectReference contains enough information to let you inspect or modify the referred object.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>resource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>uid</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>apiGroup</code><br/>
<code>string</code>
</td>
<td>
   <p>APIGroup is the name of the API group that contains the referred object.
The empty string represents the core API group.</p>
</td>
</tr>
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>APIVersion is the version of the API group that contains the referred object.</p>
</td>
</tr>
<tr><td><code>resourceVersion</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>subresource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `PolicyRule`     {#audit-k8s-io-v1-PolicyRule}
    

**Appears in:**

- [Policy](#audit-k8s-io-v1-Policy)


<p>PolicyRule maps requests based off metadata to an audit Level.
Requests must match the rules of every field (an intersection of rules).</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>level</code> <B>[Required]</B><br/>
<a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
</td>
<td>
   <p>The Level that requests matching this rule are recorded at.</p>
</td>
</tr>
<tr><td><code>users</code><br/>
<code>[]string</code>
</td>
<td>
   <p>The users (by authenticated user name) this rule applies to.
An empty list implies every user.</p>
</td>
</tr>
<tr><td><code>userGroups</code><br/>
<code>[]string</code>
</td>
<td>
   <p>The user groups this rule applies to. A user is considered matching
if it is a member of any of the UserGroups.
An empty list implies every user group.</p>
</td>
</tr>
<tr><td><code>verbs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>The verbs that match this rule.
An empty list implies every verb.</p>
</td>
</tr>
<tr><td><code>resources</code><br/>
<a href="#audit-k8s-io-v1-GroupResources"><code>[]GroupResources</code></a>
</td>
<td>
   <p>Resources that this rule matches. An empty list implies all kinds in all API groups.</p>
</td>
</tr>
<tr><td><code>namespaces</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Namespaces that this rule matches.
The empty string &quot;&quot; matches non-namespaced resources.
An empty list implies every namespace.</p>
</td>
</tr>
<tr><td><code>nonResourceURLs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>NonResourceURLs is a set of URL paths that should be audited.
<code>*</code>s are allowed, but only as the full, final step in the path.
Examples:</p>
<ul>
<li><code>/metrics</code> - Log requests for apiserver metrics</li>
<li><code>/healthz*</code> - Log all health checks</li>
</ul>
</td>
</tr>
<tr><td><code>omitStages</code><br/>
<a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
</td>
<td>
   <p>OmitStages is a list of stages for which no events are created. Note that this can also
be specified policy wide in which case the union of both are omitted.
An empty list means no restrictions will apply.</p>
</td>
</tr>
<tr><td><code>omitManagedFields</code><br/>
<code>bool</code>
</td>
<td>
   <p>OmitManagedFields indicates whether to omit the managed fields of the request
and response bodies from being written to the API audit log.</p>
<ul>
<li>a value of 'true' will drop the managed fields from the API audit log</li>
<li>a value of 'false' indicates that the managed fileds should be included
in the API audit log
Note that the value, if specified, in this rule will override the global default
If a value is not specified then the global default specified in
Policy.OmitManagedFields will stand.</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `Stage`     {#audit-k8s-io-v1-Stage}
    
(Alias of `string`)

**Appears in:**

- [Event](#audit-k8s-io-v1-Event)

- [Policy](#audit-k8s-io-v1-Policy)

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)


<p>Stage defines the stages in request handling that audit events may be generated.</p>



  