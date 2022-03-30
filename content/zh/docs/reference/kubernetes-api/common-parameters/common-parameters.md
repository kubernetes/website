---
api_metadata:
  apiVersion: ""
  import: ""
  kind: "Common Parameters"
content_type: "api_reference"
description: ""
title: "Common Parameters"
weight: 10
auto_generated: true
---

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




## allowWatchBookmarks {#allowWatchBookmarks}
<!--
allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.

<hr>
-->

allowWatchBookmarks字段请求监视类型为BOOKMARK的事件。没有定义书签的服务器可能会忽略这个标志，并根据服务器的判断发送书签。客户端不应该假设书签会在任何特定的时间间隔返回，也不应该假设服务器会在会话期间发送任何书签事件。如果这不是监视事件，则忽略该字段。

<hr>



## continue {#continue}
<!--

The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".

This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.

<hr>
-->
当需要从服务器检索更多结果时，应该设置continue选项。由于这个值是服务器定义的，客户端只能使用先前查询结果中具有相同查询参数的continue值(continue值除外)，并且服务器可能拒绝它识别不到的continue值。如果指定的continue值不再有效，无论是由于过期(通常是5到15分钟)还是服务器上的配置更改，服务器将响应 "410 ResourceExpired" 错误和一个continue令牌。如果客户端需要一个一致的列表，它必须在没有continue字段的情况下重新启动列表。否则，客户端可能会发送另一个带有410错误令牌的列表请求，服务器将响应从下一个键开始的列表，但从最新的快照，这与之前的列表结果不一致-对象创建，修改，或删除后的第一个列表请求将包含在响应中，只要他们的键是在“下一个键”之后。

当watch字段为true时，不支持此字段。客户端可以从服务器返回的最后一个resourceVersion值开始监视，就不会错过任何修改。

<hr>



## dryRun {#dryRun}
<!--

When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed

<hr>
-->
表示不应该持久化修改。无效或无法识别的dryRun指令将导致错误响应，并且不再对请求进行进一步处理。有效值为:—All:将处理所有的演练阶段

<hr>


## fieldManager {#fieldManager}
<!--

fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.

<hr>
-->

fieldManager是与进行这些更改的参与者或实体相关联的名称。长度小于或128个字符，且仅包含可打印字符，如https://golang.org/pkg/unicode/#IsPrint所定义。

<hr>


## fieldSelector {#fieldSelector}
<!--

A selector to restrict the list of returned objects by their fields. Defaults to everything.

<hr>
-->

根据返回对象的字段限制返回对象列表的选择器。默认为所有。
<hr>


## force {#force}
<!--

Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.

<hr>
-->

Force将“强制”应用请求。这意味着用户将重新获得他人拥有的冲突领域。对于非应用补丁请求，Force标志必须取消设置。

<hr>

## gracePeriodSeconds {#gracePeriodSeconds}
<!--

The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.

<hr>
-->

删除对象前的持续时间(秒)。值必须为非负整数。取值为0表示立即删除。如果该值为nil，将使用指定类型的默认宽限期。如果没有指定，默认为每个对象的值。0表示立即删除。

<hr>

## labelSelector {#labelSelector}
<!--

A selector to restrict the list of returned objects by their labels. Defaults to everything.

<hr>
-->

通过标签限制返回对象列表的选择器。默认为所有。
<hr>

## limit {#limit}
<!--
limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.

The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.

<hr>
-->
Limit是一个列表调用返回的最大响应数。如果有更多的条目，服务器会将列表元数据上的' continue '字段设置为一个值，该值可以用于相同的初始查询来检索下一组结果。设置一个限制可能会在所有请求的对象被过滤掉的情况下返回少于请求的条目数量(最多为零)，并且客户端应该只使用continue字段的存在来确定是否有更多的结果可用。服务器可能选择不支持limit参数，并将返回所有可用的结果。如果指定了limit并且continue字段为空，客户端可能会认为没有更多的结果可用。如果watch为true，则不支持此字段。

服务器保证在使用continue时返回的对象将与发出单一列表调用相同，没有限制——也就是说，在发出第一个请求后，创建、修改或删除的对象将不包含在任何后续的继续请求中。这有时被称为一致快照，并确保使用limit接收非常大的结果的较小块的客户端可以确保他们看到所有可能的对象。如果对象在分块列表中更新，则返回计算第一个列表结果时出现的对象版本。


## namespace {#namespace}
<!--

object name and auth scope, such as for teams and projects

<hr>
-->

对象名称和身份验证范围，例如用于团队和项目。
<hr>

## pretty {#pretty}
<!--

If 'true', then the output is pretty printed.

<hr>
-->

如果'true'，那么输出是规范的打印。

<hr>

## propagationPolicy {#propagationPolicy}
<!--

Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.

<hr>
-->

该字段决定是否以及如何执行垃圾收集。可以设置此字段或OrphanDependents，但不能同时设置。默认策略由元数据中的现有终结器设置决定。终结器和特定于资源的默认策略。可接受的值是:“孤儿”——受抚养人的孤儿;'Background'——允许垃圾回收器删除后台的依赖;“前景”—一个级联策略，删除前景中的所有依赖项。
<hr>



## resourceVersion {#resourceVersion}
<!--

resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset

<hr>
-->

resourceVersion对请求的资源版本设置了一个约束。详情请参见https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。

默认设置

<hr>



## resourceVersionMatch {#resourceVersionMatch}
<!--

resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.

Defaults to unset

<hr>
-->


resourceVersionMatch字段决定如何将resourceVersion应用于列表调用。强烈建议对设置了resourceVersion的列表调用设置resourceVersion匹配，具体请参见https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions。

默认设置

<hr>


## timeoutSeconds {#timeoutSeconds}
<!--

Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.

<hr>

-->

列表/观察呼叫超时。这限制了调用的持续时间，无论是否有活动。

<hr>



## watch {#watch}
<!--

Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

<hr>
-->

监视对所述资源的更改，并将其作为添加、更新和删除通知流返回。指定resourceVersion。

<hr>




