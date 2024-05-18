---
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "常用参数"
weight: 11
---
<!--
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "Common Parameters"
weight: 11
auto_generated: true
-->

## allowWatchBookmarks {#allowWatchBookmarks}

<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.
-->
allowWatchBookmarks 字段请求类型为 BOOKMARK 的监视事件。
没有实现书签的服务器可能会忽略这个标志，并根据服务器的判断发送书签。
客户端不应该假设书签会在任何特定的时间间隔返回，也不应该假设服务器会在会话期间发送任何书签事件。
如果当前请求不是 watch 请求，则忽略该字段。

<hr>

## continue {#continue}

<!--
The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".
-->
当需要从服务器检索更多结果时，应该设置 continue 选项。由于这个值是服务器定义的，
客户端只能使用先前查询结果中具有相同查询参数的 continue 值（continue 值除外），
服务器可能拒绝它识别不到的 continue 值。
如果指定的 continue 值不再有效，无论是由于过期（通常是 5 到 15 分钟）
还是服务器上的配置更改，服务器将响应 "410 ResourceExpired" 错误和一个 continue 令牌。
如果客户端需要一个一致的列表，它必须在没有 continue 字段的情况下重新发起 list 请求。
否则，客户端可能会发送另一个带有 410 错误令牌的 list 请求，服务器将响应从下一个键开始的列表，
但列表数据来自最新的快照，这与之前的列表结果不一致。
第一个列表请求之后被创建、修改或删除的对象将被包含在响应中，只要它们的键是在“下一个键”之后。

<!--
This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.
-->
当 watch 字段为 true 时，不支持此字段。客户端可以从服务器返回的最后一个 resourceVersion
值开始监视，就不会错过任何修改。

<hr>

## dryRun {#dryRun}

<!--
When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
表示不应该持久化所请求的修改。无效或无法识别的 dryRun 指令将导致错误响应，
并且服务器不再对请求进行进一步处理。有效值为:

- All: 将处理所有的演练阶段

<hr>

## fieldManager {#fieldManager}

<!--
fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://pkg.go.dev/unicode#IsPrint
-->
fieldManager 是与进行这些更改的参与者或实体相关联的名称。
长度小于或128个字符且仅包含可打印字符，如 https://pkg.go.dev/unicode#IsPrint 所定义。

<hr>

## fieldSelector {#fieldSelector}

<!--
A selector to restrict the list of returned objects by their fields. Defaults to everything.
-->
限制所返回对象的字段的选择器。默认为返回所有字段。

<hr>

## fieldValidation {#fieldValidation}

<!--
fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.
-->
fieldValidation 指示服务器如何处理请求（POST/PUT/PATCH）中包含未知或重复字段的对象。
有效值为：

- Ignore：这将忽略从对象中默默删除的所有未知字段，并将忽略除解码器遇到的最后一个重复字段之外的所有字段。
  这是在 v1.23 之前的默认行为。
- Warn：这将针对从对象中删除的各个未知字段以及所遇到的各个重复字段，分别通过标准警告响应头发出警告。
  如果没有其他错误，请求仍然会成功，并且只会保留所有重复字段中的最后一个。
  这是 v1.23+ 版本中的默认设置。
- Strict：如果从对象中删除任何未知字段，或者存在任何重复字段，将使请求失败并返回 BadRequest 错误。

从服务器返回的错误将包含所有遇到的未知和重复的字段。

<hr>

## force {#force}

<!--
Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.
-->
Force 将“强制”应用请求。这意味着用户将重新获得他人拥有的冲突领域。
对于非应用补丁请求，Force 标志必须不设置。

<hr>

## gracePeriodSeconds {#gracePeriodSeconds}

<!--
The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
删除对象前的持续时间（秒数）。值必须为非负整数。取值为 0 表示立即删除。
如果该值为 nil，将使用指定类型的默认宽限期。如果没有指定，默认为每个对象的设置值。
0 表示立即删除。

<hr>

## labelSelector {#labelSelector}

<!--
A selector to restrict the list of returned objects by their labels. Defaults to everything.
-->
通过标签限制返回对象列表的选择器。默认为返回所有对象。

<hr>

## limit {#limit}

<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.
-->
limit 是一个列表调用返回的最大响应数。如果有更多的条目，服务器会将列表元数据上的
'continue' 字段设置为一个值，该值可以用于相同的初始查询来检索下一组结果。
设置 limit 可能会在所有请求的对象被过滤掉的情况下返回少于请求的条目数量（下限为零），
并且客户端应该只根据 continue 字段是否存在来确定是否有更多的结果可用。
服务器可能选择不支持 limit 参数，并将返回所有可用的结果。
如果指定了 limit 并且 continue 字段为空，客户端可能会认为没有更多的结果可用。
如果 watch 为 true，则不支持此字段。

<!--
The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.
-->
服务器保证在使用 continue 时返回的对象将与不带 limit 的列表调用相同，
也就是说，在发出第一个请求后所创建、修改或删除的对象将不包含在任何后续的继续请求中。
这有时被称为一致性快照，确保使用 limit 的客户端在分块接收非常大的结果的客户端能够看到所有可能的对象。
如果对象在分块列表期间被更新，则返回计算第一个列表结果时存在的对象版本。

<hr>

## namespace {#namespace}

<!--
object name and auth scope, such as for teams and projects
-->
对象名称和身份验证范围，例如用于团队和项目。

<hr>

## pretty {#pretty}

<!--
If 'true', then the output is pretty printed.
-->
如果设置为 'true'，那么输出是规范的打印。

<hr>

## propagationPolicy {#propagationPolicy}

<!--
Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
该字段决定是否以及如何执行垃圾收集。可以设置此字段或 OrphanDependents，但不能同时设置。
默认策略由 metadata.finalizers 和特定资源的默认策略设置决定。可接受的值是：

- 'Orphan'：孤立依赖项；
- 'Background'：允许垃圾回收器后台删除依赖；
- 'Foreground'：一个级联策略，前台删除所有依赖项。

<hr>

## resourceVersion {#resourceVersion}

<!--
resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
-->
resourceVersion 对请求所针对的资源版本设置约束。
详情请参见 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#resource-versions

默认不设置。

<hr>

## resourceVersionMatch {#resourceVersionMatch}

<!--
resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset
-->
resourceVersionMatch 字段决定如何将 resourceVersion 应用于列表调用。
强烈建议对设置了 resourceVersion 的列表调用设置 resourceVersion 匹配，
具体请参见 https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#resource-versions

默认不设置。

<hr>

## sendInitialEvents {#sendInitialEvents}

<!--
`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.
-->
`sendInitialEvents=true` 可以和 `watch=true` 一起设置。
在这种情况下，监视通知流将从合成事件开始，以生成集合中对象的当前状态。
一旦发送了所有此类事件，将发送合成的 "Bookmark" 事件。"bookmark" 将报告对象集合对应的
ResourceVersion（RV），并标有 `"k8s.io/initial-events-end": "true"` 注解。
之后，监视通知流将照常进行，发送与所监视的对象的变更（在 RV 之后）对应的监视事件。

<!--
When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan
  is interpreted as "data at least as new as the provided `resourceVersion`"
  and the bookmark event is send when the state is synced
  to a `resourceVersion` at least as fresh as the one provided by the ListOptions.
  If `resourceVersion` is unset, this is interpreted as "consistent read" and the
  bookmark event is send when the state is synced at least to the moment
  when request started being processed.
- `resourceVersionMatch` set to any other value or unset
  Invalid error is returned.
-->
当设置了 sendInitialEvents 选项时，我们还需要设置 resourceVersionMatch
选项。watch 请求的语义如下：

- `resourceVersionMatch` = NotOlderThan
  被解释为"数据至少与提供的 `resourceVersion` 一样新"，
  最迟当状态同步到与 ListOptions 提供的版本一样新的 `resourceVersion` 时，
  发送 bookmark 事件。如果 `resourceVersion` 未设置，这将被解释为"一致读取"，
  最迟当状态同步到开始处理请求的那一刻时，发送 bookmark 事件。
- `resourceVersionMatch` 设置为任何其他值或返回 unsetInvalid 错误。

<!--
Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.
-->
如果 `resourceVersion=""` 或 `resourceVersion="0"`（出于向后兼容性原因），默认为
true，否则默认为 false。

<hr>

## timeoutSeconds {#timeoutSeconds}

<!--
Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.
-->
list/watch 调用的超时秒数。这选项限制调用的持续时间，无论是否有活动。

<hr>

## watch {#watch}

<!--
Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.
-->
监视对所述资源的更改，并将其这类变更以添加、更新和删除通知流的形式返回。指定 resourceVersion。

<hr>
