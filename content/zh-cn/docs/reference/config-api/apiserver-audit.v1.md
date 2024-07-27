---
title: kube-apiserver Audit 配置（v1）
content_type: tool-reference
package: audit.k8s.io/v1
---
<!---
title: kube-apiserver Audit Configuration (v1)
content_type: tool-reference
package: audit.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types 
-->
## 资源类型  {#resource-types}

- [Event](#audit-k8s-io-v1-Event)
- [EventList](#audit-k8s-io-v1-EventList)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyList](#audit-k8s-io-v1-PolicyList)
  
## `Event`     {#audit-k8s-io-v1-Event}

<!--
**Appears in:**
-->
**出现在：**

- [EventList](#audit-k8s-io-v1-EventList)

<!--
Event captures all the information that can be included in an API audit log.
-->
<p>
Event 结构包含可出现在 API 审计日志中的所有信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Event</code></td></tr>
  
<tr><td><code>level</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
</td>
<td>
   <!--
   AuditLevel at which event was generated
   -->
   <p>
   生成事件所对应的审计级别。
   </p>
</td>
</tr>
    
<tr><td><code>auditID</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <!--
   Unique audit ID, generated for each request.
   -->
   <p>
   为每个请求所生成的唯一审计 ID。
   </p>
</td>
</tr>
    
<tr><td><code>stage</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Stage"><code>Stage</code></a>
</td>
<td>
   <p>
   <!--
   Stage of the request handling when this event instance was generated.
   -->
   生成此事件时请求的处理阶段。
   </p>
</td>
</tr>
    
<tr><td><code>requestURI</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   RequestURI is the request URI as sent by the client to a server.
   -->
   requestURI 是客户端发送到服务器端的请求 URI。
   </p>
</td>
</tr>
    
  
<tr><td><code>verb</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Verb is the kubernetes verb associated with the request.
   For non-resource requests, this is the lower-cased HTTP method.
   -->
   verb 是与请求对应的 Kubernetes 动词。对于非资源请求，此字段为 HTTP 方法的小写形式。
   </p>
</td>
</tr>
    
<tr><td><code>user</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>
   <!--
   Authenticated user information.
   -->
   关于认证用户的信息。
   </p>
</td>
</tr>

<tr><td><code>impersonatedUser</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>
   <!--
   Impersonated user information.
   -->
   关于所伪装（impersonated）的用户的信息。
   </p>
</td>
</tr>

<tr><td><code>sourceIPs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   Source IPs, from where the request originated and intermediate proxies.
   The source IPs are listed from (in order):
   -->
   发起请求和中间代理的源 IP 地址。
   源 IP 从以下（按顺序）列出：
   </p>
<ol>
<li>
<!--
X-Forwarded-For request header IPs
-->
X-Forwarded-For 请求标头 IP
</li>
<li>
<!--
X-Real-Ip header, if not present in the X-Forwarded-For list
-->
X-Real-Ip 标头，如果 X-Forwarded-For 列表中不存在
</li>
<li>
<!--
The remote address for the connection, if it doesn't match the last
IP in the list up to here (X-Forwarded-For or X-Real-Ip).
Note: All but the last IP can be arbitrarily set by the client.
-->
连接的远程地址，如果它无法与此处列表中的最后一个 IP（X-Forwarded-For 或 X-Real-Ip）匹配。
注意：除最后一个 IP 外的所有 IP 均可由客户端任意设置。
</li>
</ol>
</td>
</tr>

<tr><td><code>userAgent</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   UserAgent records the user agent string reported by the client.
   Note that the UserAgent is provided by the client, and must not be trusted.
   -->
   userAgent 中记录客户端所报告的用户代理（User Agent）字符串。
   注意 userAgent 信息是由客户端提供的，一定不要信任。
   </p>
</td>
</tr>

<tr><td><code>objectRef</code><br/>
<a href="#audit-k8s-io-v1-ObjectReference"><code>ObjectReference</code></a>
</td>
<td>
   <p>
   <!--
   Object reference this request is targeted at.
   Does not apply for List-type requests, or non-resource requests.
   -->
   此请求所指向的对象引用。对于 List 类型的请求或者非资源请求，此字段可忽略。
   </p>
</td>
</tr>

<tr><td><code>responseStatus</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#status-v1-meta"><code>meta/v1.Status</code></a>
</td>
<td>
   <p>
   <!--
   The response status, populated even when the ResponseObject is not a Status type.
   For successful responses, this will only include the Code and StatusSuccess.
   For non-status type error responses, this will be auto-populated with the error Message.
   -->
   响应的状态，当 responseObject 不是 Status 类型时被赋值。
   对于成功的请求，此字段仅包含 code 和 statusSuccess。
   对于非 Status 类型的错误响应，此字段会被自动赋值为出错信息。
   </p>
</td>
</tr>

<tr><td><code>requestObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>
   <!--
   API object from the request, in JSON format. The RequestObject is recorded as-is in the request
   (possibly re-encoded as JSON), prior to version conversion, defaulting, admission or
   merging. It is an external versioned object type, and may not be a valid object on its own.
    Omitted for non-resource requests.  Only logged at Request Level and higher.
   -->
   来自请求的 API 对象，以 JSON 格式呈现。requestObject 在请求中按原样记录
   （可能会采用 JSON 重新编码），之后会进入版本转换、默认值填充、准入控制以及配置信息合并等阶段。
   此对象为外部版本化的对象类型，甚至其自身可能并不是一个合法的对象。对于非资源请求，此字段被忽略。
   只有当审计级别为 Request 或更高的时候才会记录。
   </p>  
</td>
</tr>

<tr><td><code>responseObject</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>
   <!--
   API object returned in the response, in JSON. The ResponseObject is recorded after conversion
   to the external type, and serialized as JSON.  Omitted for non-resource requests.  Only logged
   at Response Level.
   -->
   响应中包含的 API 对象，以 JSON 格式呈现。responseObject 是在被转换为外部类型并序列化为
   JSON 格式之后才被记录的。对于非资源请求，此字段会被忽略。
   只有审计级别为 Response 时才会记录。
   </p>
</td>
</tr>

<tr><td><code>requestReceivedTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <!--
   Time the request reached the apiserver.
   -->
   <p>
   请求到达 API 服务器时的时间。
   </p>
</td>
</tr>

<tr><td><code>stageTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <p>
   <!--
   Time the request reached current audit stage.
   -->
   请求到达当前审计阶段时的时间。
   </p>
</td>
</tr>

<tr><td><code>annotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>
   <!--
   Annotations is an unstructured key value map stored with an audit event that may be set by
   plugins invoked in the request serving chain, including authentication, authorization and
   admission plugins. Note that these annotations are for the audit event, and do not correspond
   to the metadata.annotations of the submitted object. Keys should uniquely identify the informing
   component to avoid name collisions (e.g. podsecuritypolicy.admission.k8s.io/policy). Values
   should be short. Annotations are included in the Metadata level.
   -->
   annotations 是一个无结构的键-值映射，其中保存的是一个审计事件。
   该事件可以由请求处理链路上的插件来设置，包括身份认证插件、鉴权插件以及准入控制插件等。
   注意这些注解是针对审计事件本身的，与所提交的对象中的 metadata.annotations
   之间不存在对应关系。
   映射中的键名应该唯一性地标识生成该事件的组件，从而避免名字上的冲突
   （例如 podsecuritypolicy.admission.k8s.io/policy）。
   映射中的键值应该比较简洁。
   当审计级别为 Metadata 时会包含 annotations 字段。
   </p>
</td>
</tr>
</tbody>
</table>

## `EventList`     {#audit-k8s-io-v1-EventList}

<p>
<!--    
EventList is a list of audit Events.
-->
EventList 是审计事件（Event）的列表。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EventList</code></td></tr>

<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->列表结构元数据</span>
   </td>
</tr>

<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Event"><code>[]Event</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->事件对象列表</span>
   </td>
</tr>
</tbody>
</table>

## `Policy`     {#audit-k8s-io-v1-Policy}

<!--
**Appears in:**
-->
**出现在：**

- [PolicyList](#audit-k8s-io-v1-PolicyList)

<p>
<!--
Policy defines the configuration of audit logging, and the rules for how different request
categories are logged.
-->
Policy 定义的是审计日志的配置以及不同类型请求的日志记录规则。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Policy</code></td></tr>
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <p>
   <!--
   ObjectMeta is included for interoperability with API infrastructure.
   -->
   包含 <code>metadata</code> 字段是为了便于与 API 基础设施之间实现互操作。
   </p>
   <!--Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.-->
   参考 Kubernetes API 文档了解 <code>metadata</code> 字段的详细信息。
</td>
</tr>

<tr><td><code>rules</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-PolicyRule"><code>[]PolicyRule</code></a>
</td>
<td>
   <p>
   <!--
   Rules specify the audit Level a request should be recorded at.
A request may match multiple rules, in which case the FIRST matching rule is used.
The default audit level is None, but can be overridden by a catch-all rule at the end of the list.
PolicyRules are strictly ordered.
   -->
   字段 rules 设置请求要被记录的审计级别（level）。
   每个请求可能会与多条规则相匹配；发生这种状况时遵从第一条匹配规则。
   默认的审计级别是 None，不过可以在列表的末尾使用一条全抓（catch-all）规则重载其设置。
   列表中的规则（PolicyRule）是严格有序的。
   </p>
</td>
</tr>

<tr><td><code>omitStages</code><br/>
<a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
</td>
<td>
   <p>
   <!--
   OmitStages is a list of stages for which no events are created. Note that this can also
   be specified per rule in which case the union of both are omitted.
   -->
   字段 omitStages 是一个阶段（Stage）列表，其中包含无须生成事件的阶段。
   注意这一选项也可以通过每条规则来设置。
   审计组件最终会忽略出现在 omitStages 中阶段，也会忽略规则中的阶段。
   </p>
</td>
</tr>

<tr>
<td>
<code>omitManagedFields</code><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
OmitManagedFields indicates whether to omit the managed fields of the request
and response bodies from being written to the API audit log.
This is used as a global default - a value of 'true' will omit the managed fileds,
otherwise the managed fields will be included in the API audit log.
Note that this can also be specified per rule in which case the value specified
in a rule will override the global default.
-->
omitManagedFields 标明将请求和响应主体写入 API 审计日志时，是否省略其托管字段。
此字段值用作全局默认值 - 'true' 值将省略托管字段，否则托管字段将包含在 API 审计日志中。
请注意，也可以按规则指定此值，在这种情况下，规则中指定的值将覆盖全局默认值。
</p>
</td>
</tr>
</tbody>
</table>

## `PolicyList`     {#audit-k8s-io-v1-PolicyList}

<!--
PolicyList is a list of audit Policies.
-->
<p>
PolicyList 是由审计策略（Policy）组成的列表。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PolicyList</code></td></tr>

<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->列表结构元数据。</span>
   </td>
</tr>

<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Policy"><code>[]Policy</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->策略（Policy）对象列表。</span>
   </td>
</tr>
</tbody>
</table>

## `GroupResources`     {#audit-k8s-io-v1-GroupResources}

<!--
**Appears in:**
-->
**出现在：**

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<!--
GroupResources represents resource kinds in an API group.
-->
<p>
GroupResources 代表的是某 API 组中的资源类别。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>group</code><br/>
<code>string</code>
</td>
<td>
   <!--
   Group is the name of the API group that contains the resources.
   The empty string represents the core API group.
   -->
   字段 group 给出包含资源的 API 组的名称。
   空字符串代表 <code>core</code> API 组。
</td>
</tr>

<tr><td><code>resources</code><br/>
<code>[]string</code>
</td>
<td>
<!--
   <p>Resources is a list of resources this rule applies to.</p>
<p>For example:</p>
<ul>
<li><code>pods</code> matches pods.</li>
<li><code>pods/log</code> matches the log subresource of pods.</li>
<li><code>*</code> matches all resources and their subresources.</li>
<li><code>pods/*</code> matches all subresources of pods.</li>
<li><code>*/scale</code> matches all scale subresources.</li>
</ul>
-->
<p><code>resources</code> 是此规则所适用的资源的列表。</p>
<p>例如：</p>
<ul>
  <li><code>pods</code> 匹配 Pod。</li>
  <li><code>pods/log</code> 匹配 Pod 的 log 子资源。</li>
  <li><code>&ast;<code> 匹配所有资源及其子资源。</li>
  <li><code>pods/&ast;</code> 匹配 Pod 的所有子资源。</li>
  <li><code>&ast;/scale</code> 匹配所有的 scale 子资源。</li>
</ul>

<!--
<p>If wildcard is present, the validation rule will ensure resources do not
overlap with each other.</p>
<p>An empty list implies all resources and subresources in this API groups apply.</p>
-->
<p>如果存在通配符，则合法性检查逻辑会确保 resources 中的条目不会彼此重叠。</p>
<p>空的列表意味着规则适用于该 API 组中的所有资源及其子资源。</p>
</td>
</tr>

<tr><td><code>resourceNames</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   ResourceNames is a list of resource instance names that the policy matches.
   Using this field requires Resources to be specified.
   An empty list implies that every instance of the resource is matched.
   -->
   字段 resourceNames 是策略将匹配的资源实例名称列表。
   使用此字段时，<code>resources</code> 必须指定。
   空的 resourceNames 列表意味着资源的所有实例都会匹配到此策略。
   </p>
</td>
</tr>
</tbody>
</table>

## `Level`     {#audit-k8s-io-v1-Level}

<!--    
(Alias of `string`)
-->
<code>string</code> 数据类型的别名。

<!--
**Appears in:**
-->
**出现在：**

- [Event](#audit-k8s-io-v1-Event)
- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<!--
Level defines the amount of information logged during auditing
-->
<p>
Level 定义的是审计过程中在日志内记录的信息量。
</p>

## `ObjectReference`     {#audit-k8s-io-v1-ObjectReference}

<!--    
**Appears in:**
-->
**出现在：**

- [Event](#audit-k8s-io-v1-Event)

<!--
ObjectReference contains enough information to let you inspect or modify the referred object.
-->
<p>
ObjectReference 包含的是用来检查或修改所引用对象时将需要的全部信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>resource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->资源类别。</span>
   </td>
</tr>

<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->资源对象所在名字空间。</span>
   </td>
</tr>

<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->资源对象名称。</span>
   </td>
</tr>

<tr><td><code>uid</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->资源对象的唯一标识（UID）。</span>
   </td>
</tr>

<tr><td><code>apiGroup</code><br/>
<code>string</code>
</td>
<td>
   <!--
   APIGroup is the name of the API group that contains the referred object.
   The empty string represents the core API group.
   -->
   <p>
   字段 apiGroup 给出包含所引用对象的 API 组的名称。
   空字符串代表 <code>core</code> API 组。
   </p>
</td>
</tr>

<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <!--
   APIVersion is the version of the API group that contains the referred object.
   -->
   <p>
   字段 apiVersion 是包含所引用对象的 API 组的版本。
   </p>
</td>
</tr>

<tr><td><code>resourceVersion</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->资源对象自身的版本值。</span>
   </td>
</tr>

<tr><td><code>subresource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->子资源的类别。</span>
   </td>
</tr>
</tbody>
</table>
    
## `PolicyRule`     {#audit-k8s-io-v1-PolicyRule}
    
<!--
**Appears in:**
-->
**出现在：**

- [Policy](#audit-k8s-io-v1-Policy)

<p>
<!--
PolicyRule maps requests based off metadata to an audit Level.
Requests must match the rules of every field (an intersection of rules).
-->
PolicyRule 包含一个映射，基于元数据将请求映射到某审计级别。
请求必须与每个字段所定义的规则都匹配（即 rules 的交集）才被视为匹配。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>level</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
</td>
<td>
   <!--
   The Level that requests matching this rule are recorded at.
   -->
   <p>
   与此规则匹配的请求所对应的日志记录级别（Level）。
   </p>
</td>
</tr>

<tr><td><code>users</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   The users (by authenticated user name) this rule applies to.
   An empty list implies every user.
   -->
   根据身份认证所确定的用户名的列表，给出此规则所适用的用户。
   空列表意味着适用于所有用户。
   </p>
</td>
</tr>

<tr><td><code>userGroups</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   The user groups this rule applies to. A user is considered matching
   if it is a member of any of the UserGroups.
   An empty list implies every user group.
   -->
   此规则所适用的用户组的列表。如果用户是所列用户组中任一用户组的成员，则视为匹配。
   空列表意味着适用于所有用户组。
   </p>
</td>
</tr>

<tr><td><code>verbs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   The verbs that match this rule.
   An empty list implies every verb.
   -->
   此规则所适用的动词（verb）列表。
   空列表意味着适用于所有动词。
   </p>
</td>
</tr>

<tr><td><code>resources</code><br/>
<a href="#audit-k8s-io-v1-GroupResources"><code>[]GroupResources</code></a>
</td>
<td>
   <!--
   Resources that this rule matches. An empty list implies all kinds in all API groups.
   -->
   <p>
   此规则所适用的资源类别列表。
   空列表意味着适用于 API 组中的所有资源类别。
   </p>
</td>
</tr>

<tr><td><code>namespaces</code><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   Namespaces that this rule matches.
   The empty string &quot;&quot; matches non-namespaced resources.
   An empty list implies every namespace.
   -->
   此规则所适用的名字空间列表。
   空字符串（&quot;&quot;）意味着适用于非名字空间作用域的资源。
   空列表意味着适用于所有名字空间。
   </p>
</td>
</tr>

<tr><td><code>nonResourceURLs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>NonResourceURLs is a set of URL paths that should be audited.
   <code>*</code>s are allowed, but only as the full, final step in the path.
   Examples:</p>
   <ul>
   <li><code>/metrics</code> - Log requests for apiserver metrics</li>
   <li><code>/healthz*</code> - Log all health checks</li>
   </ul>
   -->
   <p>
   <code>nonResourceURLs</code> 是一组需要被审计的 URL 路径。
   允许使用 <code>&ast;<code>，但只能作为路径中最后一个完整分段。
   例如：</p>
   <ul>
     <li>&quot;/metrics&quot; - 记录对 API 服务器度量值（metrics）的所有请求；</li>
     <li>&quot;/healthz&ast;&quot; - 记录所有健康检查。</li>
   </ul>
</td>
</tr>

<tr><td><code>omitStages</code><br/>
<a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
</td>
<td>
   <p>
   <!--
   OmitStages is a list of stages for which no events are created. Note that this can also
   be specified policy wide in which case the union of both are omitted.
   An empty list means no restrictions will apply.
   -->
   字段 omitStages 是一个阶段（Stage）列表，针对所列的阶段服务器不会生成审计事件。
   注意这一选项也可以在策略（Policy）级别指定。服务器审计组件会忽略
   omitStages 中给出的阶段，也会忽略策略中给出的阶段。
   空列表意味着不对阶段作任何限制。
   </p>
</td>
</tr>

<tr>
<td><code>omitManagedFields</code><br/>
<code>bool</code>
</td>
<td>
<!--
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
-->
<p>
<code>omitManagedFields</code> 决定将请求和响应主体写入 API 审计日志时，是否省略其托管字段。
</p>
<ul>
  <li>值为 'true' 将从 API 审计日志中删除托管字段</li>
  <li>
  值为 'false' 表示托管字段应包含在 API 审计日志中
  请注意，如果指定此规则中的值将覆盖全局默认值。
  如果未指定，则使用 policy.omitManagedFields 中指定的全局默认值。
  </li>
</ul>
</td>
</tr>

</tbody>
</table>

## `Stage`     {#audit-k8s-io-v1-Stage}

<!--    
(Alias of `string`)
-->
<code>string</code> 数据类型的别名。

<!--
**Appears in:**
-->
**出现在：**

- [Event](#audit-k8s-io-v1-Event)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<p>
<!--
Stage defines the stages in request handling that audit events may be generated.
-->
Stage 定义在请求处理过程中可以生成审计事件的阶段。
</p>
