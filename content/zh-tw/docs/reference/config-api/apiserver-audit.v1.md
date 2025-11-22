---
title: kube-apiserver Audit 設定（v1）
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
## 資源類型  {#resource-types}

- [Event](#audit-k8s-io-v1-Event)
- [EventList](#audit-k8s-io-v1-EventList)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyList](#audit-k8s-io-v1-PolicyList)

## `Event`     {#audit-k8s-io-v1-Event}

<!--
**Appears in:**
-->
**出現在：**

- [EventList](#audit-k8s-io-v1-EventList)

<p>
<!--
Event captures all the information that can be included in an API audit log.
-->
Event 結構包含可出現在 API 審計日誌中的所有資訊。
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
   <p>
   <!--
   AuditLevel at which event was generated
   -->
   生成事件所對應的審計級別。
   </p>
</td>
</tr>
    
<tr><td><code>auditID</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <p>
   <!--
   Unique audit ID, generated for each request.
   -->
   爲每個請求所生成的唯一審計 ID。
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
   生成此事件時請求的處理階段。
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
   requestURI 是客戶端發送到伺服器端的請求 URI。
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
   <code>verb</code> 是與請求對應的 Kubernetes 動詞。對於非資源請求，
   此字段爲 HTTP 方法的小寫形式。
   </p>
</td>
</tr>
    
<tr><td><code>user</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>
   <!--
   Authenticated user information.
   -->
   關於認證使用者的資訊。
   </p>
</td>
</tr>

<tr><td><code>impersonatedUser</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
</td>
<td>
   <p>
   <!--
   Impersonated user information.
   -->
   關於所僞裝（<code>impersonatedUser</code>）的使用者的資訊。
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
   發起請求和中間代理的源 IP 地址。
   源 IP 從以下（按順序）列出：
   </p>
<ol>
<li>
<!--
X-Forwarded-For request header IPs
-->
X-Forwarded-For 請求標頭 IP
</li>
<li>
<!--
X-Real-Ip header, if not present in the X-Forwarded-For list
-->
X-Real-Ip 標頭，如果 X-Forwarded-For 列表中不存在
</li>
<li>
<!--
The remote address for the connection, if it doesn't match the last
IP in the list up to here (X-Forwarded-For or X-Real-Ip).
Note: All but the last IP can be arbitrarily set by the client.
-->
連接的遠程地址，如果它無法與此處列表中的最後一個 IP（X-Forwarded-For 或 X-Real-Ip）匹配。
注意：除最後一個 IP 外的所有 IP 均可由客戶端任意設置。
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
   userAgent 中記錄客戶端所報告的使用者代理（User Agent）字符串。
   注意 userAgent 資訊是由客戶端提供的，一定不要信任。
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
   此請求所指向的對象引用。對於 List 類型的請求或者非資源請求，此字段可忽略。
   </p>
</td>
</tr>

<tr><td><code>responseStatus</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#status-v1-meta"><code>meta/v1.Status</code></a>
</td>
<td>
   <p>
   <!--
   The response status, populated even when the ResponseObject is not a Status type.
   For successful responses, this will only include the Code and StatusSuccess.
   For non-status type error responses, this will be auto-populated with the error Message.
   -->
   響應的狀態，當 <code>responseStatus</code> 不是 Status 類型時被賦值。
   對於成功的請求，此字段僅包含 code 和 statusSuccess。
   對於非 Status 類型的錯誤響應，此字段會被自動賦值爲出錯資訊。
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
   來自請求的 API 對象，以 JSON 格式呈現。<code>requestObject</code> 在請求中按原樣記錄
   （可能會採用 JSON 重新編碼），之後會進入版本轉換、預設值填充、准入控制以及設定資訊合併等階段。
   此對象爲外部版本化的對象類型，甚至其自身可能並不是一個合法的對象。對於非資源請求，此字段被忽略。
   只有當審計級別爲 Request 或更高的時候纔會記錄。
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
   響應中包含的 API 對象，以 JSON 格式呈現。<code>responseObject</code> 是在被轉換爲外部類型並序列化爲
   JSON 格式之後才被記錄的。對於非資源請求，此字段會被忽略。
   只有審計級別爲 Response 時纔會記錄。
   </p>
</td>
</tr>

<tr><td><code>requestReceivedTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <p>
   <!--
   Time the request reached the apiserver.
   -->
   請求到達 API 伺服器時的時間。
   </p>
</td>
</tr>

<tr><td><code>stageTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
</td>
<td>
   <p>
   <!--
   Time the request reached current audit stage.
   -->
   請求到達當前審計階段時的時間。
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
   <code>annotations</code> 是一個無結構的鍵-值映射，其中保存的是一個審計事件。
   該事件可以由請求處理鏈路上的插件來設置，包括身份認證插件、鑑權插件以及准入控制插件等。
   注意這些註解是針對審計事件本身的，與所提交的對象中的 metadata.annotations
   之間不存在對應關係。
   映射中的鍵名應該唯一性地標識生成該事件的組件，從而避免名字上的衝突
   （例如 <code>podsecuritypolicy.admission.k8s.io/policy</code>）。
   映射中的鍵值應該比較簡潔。
   當審計級別爲 Metadata 時會包含 <code>annotations</code> 字段。
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
EventList 是審計事件（Event）的列表。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EventList</code></td></tr>

<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->列表結構元資料</span>
   </td>
</tr>

<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Event"><code>[]Event</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->事件對象列表</span>
   </td>
</tr>
</tbody>
</table>

## `Policy`     {#audit-k8s-io-v1-Policy}

<!--
**Appears in:**
-->
**出現在：**

- [PolicyList](#audit-k8s-io-v1-PolicyList)

<p>
<!--
Policy defines the configuration of audit logging, and the rules for how different request
categories are logged.
-->
Policy 定義的是審計日誌的設定以及不同類型請求的日誌記錄規則。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Policy</code></td></tr>
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <p>
   <!--
   ObjectMeta is included for interoperability with API infrastructure.
   -->
   包含 <code>metadata</code> 字段是爲了便於與 API 基礎設施之間實現互操作。
   </p>
   <!--
   Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.
   -->
   參考 Kubernetes API 文檔瞭解 <code>metadata</code> 字段的詳細資訊。
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
   字段 <code>rules</code> 設置請求要被記錄的審計級別（level）。
   每個請求可能會與多條規則相匹配；發生這種狀況時遵從第一條匹配規則。
   預設的審計級別是 None，不過可以在列表的末尾使用一條全抓（catch-all）規則重載其設置。
   列表中的規則（PolicyRule）是嚴格有序的。
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
   字段 <code>omitStages</code> 是一個階段（Stage）列表，其中包含無須生成事件的階段。
   注意這一選項也可以通過每條規則來設置。
   審計組件最終會忽略出現在 <code>omitStages</code> 中階段，也會忽略規則中的階段。
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
This is used as a global default - a value of 'true' will omit the managed fields,
otherwise the managed fields will be included in the API audit log.
Note that this can also be specified per rule in which case the value specified
in a rule will override the global default.
-->
<code>omitManagedFields</code> 標明將請求和響應主體寫入 API 審計日誌時，是否省略其託管字段。
此字段值用作全局預設值 - 'true' 值將省略託管字段，否則託管字段將包含在 API 審計日誌中。
請注意，也可以按規則指定此值，在這種情況下，規則中指定的值將覆蓋全局預設值。
</p>
</td>
</tr>
</tbody>
</table>

## `PolicyList`     {#audit-k8s-io-v1-PolicyList}

<p>
<!--
PolicyList is a list of audit Policies.
-->
PolicyList 是由審計策略（Policy）組成的列表。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>audit.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>PolicyList</code></td></tr>

<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->列表結構元資料。</span>
   </td>
</tr>

<tr><td><code>items</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Policy"><code>[]Policy</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->策略（Policy）對象列表。</span>
   </td>
</tr>
</tbody>
</table>

## `GroupResources`     {#audit-k8s-io-v1-GroupResources}

<!--
**Appears in:**
-->
**出現在：**

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<p>
<!--
GroupResources represents resource kinds in an API group.
-->
GroupResources 代表的是某 API 組中的資源類別。
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
   字段 <code>group</code> 給出包含資源的 API 組的名稱。
   空字符串代表 <code>core</code> API 組。
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
<p><code>resources</code> 是此規則所適用的資源的列表。</p>
<p>例如：</p>
<ul>
  <li><code>pods</code> 匹配 Pod。</li>
  <li><code>pods/log</code> 匹配 Pod 的 log 子資源。</li>
  <li><code>&ast;<code> 匹配所有資源及其子資源。</li>
  <li><code>pods/&ast;</code> 匹配 Pod 的所有子資源。</li>
  <li><code>&ast;/scale</code> 匹配所有的 scale 子資源。</li>
</ul>

<!--
<p>If wildcard is present, the validation rule will ensure resources do not
overlap with each other.</p>
<p>An empty list implies all resources and subresources in this API groups apply.</p>
-->
<p>如果存在通配符，則合法性檢查邏輯會確保 <code>resources</code> 中的條目不會彼此重疊。</p>
<p>空的列表意味着規則適用於該 API 組中的所有資源及其子資源。</p>
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
   字段 <code>resourceNames</code> 是策略將匹配的資源實例名稱列表。
   使用此字段時，<code>resources</code> 必須指定。
   空的 <code>resourceNames</code> 列表意味着資源的所有實例都會匹配到此策略。
   </p>
</td>
</tr>
</tbody>
</table>

## `Level`     {#audit-k8s-io-v1-Level}

<!--
(Alias of `string`)
-->
`string` 資料類型的別名。

<!--
**Appears in:**
-->
**出現在：**

- [Event](#audit-k8s-io-v1-Event)
- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<p>
<!--
Level defines the amount of information logged during auditing
-->
Level 定義的是審計過程中在日誌內記錄的資訊量。
</p>

## `ObjectReference`     {#audit-k8s-io-v1-ObjectReference}

<!--
**Appears in:**
-->
**出現在：**

- [Event](#audit-k8s-io-v1-Event)

<p>
<!--
ObjectReference contains enough information to let you inspect or modify the referred object.
-->
ObjectReference 包含的是用來檢查或修改所引用對象時將需要的全部資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>resource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->資源類別。</span>
   </td>
</tr>

<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->資源對象所在名字空間。</span>
   </td>
</tr>

<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->資源對象名稱。</span>
   </td>
</tr>

<tr><td><code>uid</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->資源對象的唯一標識（UID）。</span>
   </td>
</tr>

<tr><td><code>apiGroup</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   APIGroup is the name of the API group that contains the referred object.
   The empty string represents the core API group.
   -->
   字段 <code>apiGroup</code> 給出包含所引用對象的 API 組的名稱。
   空字符串代表 <code>core</code> API 組。
   </p>
</td>
</tr>

<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   APIVersion is the version of the API group that contains the referred object.
   -->
   字段 <code>apiVersion</code> 是包含所引用對象的 API 組的版本。
   </p>
</td>
</tr>

<tr><td><code>resourceVersion</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->資源對象自身的版本值。</span>
   </td>
</tr>

<tr><td><code>subresource</code><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->子資源的類別。</span>
   </td>
</tr>
</tbody>
</table>

## `PolicyRule`     {#audit-k8s-io-v1-PolicyRule}

<!--
**Appears in:**
-->
**出現在：**

- [Policy](#audit-k8s-io-v1-Policy)

<p>
<!--
PolicyRule maps requests based off metadata to an audit Level.
Requests must match the rules of every field (an intersection of rules).
-->
PolicyRule 包含一個映射，基於元資料將請求映射到某審計級別。
請求必須與每個字段所定義的規則都匹配（即 rules 的交集）才被視爲匹配。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>level</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
</td>
<td>
   <p>
   <!--
   The Level that requests matching this rule are recorded at.
   -->
   與此規則匹配的請求所對應的日誌記錄級別（Level）。
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
   根據身份認證所確定的使用者名的列表，給出此規則所適用的使用者。
   空列表意味着適用於所有使用者。
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
   此規則所適用的使用者組的列表。如果使用者是所列使用者組中任一使用者組的成員，則視爲匹配。
   空列表意味着適用於所有使用者組。
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
   此規則所適用的動詞（verb）列表。
   空列表意味着適用於所有動詞。
   </p>
</td>
</tr>

<tr><td><code>resources</code><br/>
<a href="#audit-k8s-io-v1-GroupResources"><code>[]GroupResources</code></a>
</td>
<td>
   <p>
   <!--
   Resources that this rule matches. An empty list implies all kinds in all API groups.
   -->
   此規則所適用的資源類別列表。
   空列表意味着適用於 API 組中的所有資源類別。
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
   此規則所適用的名字空間列表。
   空字符串（&quot;&quot;）意味着適用於非名字空間作用域的資源。
   空列表意味着適用於所有名字空間。
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
   <code>nonResourceURLs</code> 是一組需要被審計的 URL 路徑。
   允許使用 <code>&ast;<code>，但只能作爲路徑中最後一個完整分段。
   例如：
   </p>
   <ul>
     <li>&quot;/metrics&quot; - 記錄對 API 伺服器度量值（metrics）的所有請求；</li>
     <li>&quot;/healthz&ast;&quot; - 記錄所有健康檢查。</li>
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
   字段 <code>omitStages</code> 是一個階段（Stage）列表，針對所列的階段伺服器不會生成審計事件。
   注意這一選項也可以在策略（Policy）級別指定。伺服器審計組件會忽略
   <code>omitStages</code> 中給出的階段，也會忽略策略中給出的階段。
   空列表意味着不對階段作任何限制。
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
<li>a value of 'false' indicates that the managed fields should be included
in the API audit log
Note that the value, if specified, in this rule will override the global default
If a value is not specified then the global default specified in
Policy.OmitManagedFields will stand.</li>
</ul>
-->
<p>
<code>omitManagedFields</code> 決定將請求和響應主體寫入 API 審計日誌時，是否省略其託管字段。
</p>
<ul>
  <li>值爲 'true' 將從 API 審計日誌中刪除託管字段</li>
  <li>
  值爲 'false' 表示託管字段應包含在 API 審計日誌中
  請注意，如果指定此規則中的值將覆蓋全局預設值。
  如果未指定，則使用 <code>policy.omitManagedFields</code> 中指定的全局預設值。
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
`string` 資料類型的別名。

<!--
**Appears in:**
-->
**出現在：**

- [Event](#audit-k8s-io-v1-Event)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

<p>
<!--
Stage defines the stages in request handling that audit events may be generated.
-->
Stage 定義在請求處理過程中可以生成審計事件的階段。
</p>
