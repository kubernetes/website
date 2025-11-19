---
layout: blog
title: "警告: 有用的預警"
date: 2020-09-03
slug: warnings
evergreen: true
---

<!--
layout: blog
title: "Warning: Helpful Warnings Ahead"
date: 2020-09-03
slug: warnings
evergreen: true
-->

<!--
**Author**: [Jordan Liggitt](https://github.com/liggitt) (Google)
-->
**作者**: [Jordan Liggitt](https://github.com/liggitt) (Google)

<!--
As Kubernetes maintainers, we're always looking for ways to improve usability while preserving compatibility.
As we develop features, triage bugs, and answer support questions, we accumulate information that would be helpful for Kubernetes users to know.
In the past, sharing that information was limited to out-of-band methods like release notes, announcement emails, documentation, and blog posts.
Unless someone knew to seek out that information and managed to find it, they would not benefit from it.
-->
作爲 Kubernetes 維護者，我們一直在尋找在保持兼容性的同時提高可用性的方法。
在開發功能、分類 Bug、和回答支持問題的過程中，我們積累了有助於 Kubernetes 使用者瞭解的信息。
過去，共享這些信息僅限於發佈說明、公告電子郵件、文檔和博客文章等帶外方法。
除非有人知道需要尋找這些信息併成功找到它們，否則他們不會從中受益。

<!--
In Kubernetes v1.19, we added a feature that allows the Kubernetes API server to
[send warnings to API clients](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1693-warnings).
The warning is sent using a [standard `Warning` response header](https://tools.ietf.org/html/rfc7234#section-5.5),
so it does not change the status code or response body in any way.
This allows the server to send warnings easily readable by any API client, while remaining compatible with previous client versions.
-->
在 Kubernetes v1.19 中，我們添加了一個功能，允許 Kubernetes API
伺服器[向 API 客戶端發送警告](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1693-warnings)。
警告信息使用[標準 `Warning` 響應頭](https://tools.ietf.org/html/rfc7234#section-5.5)發送，
因此它不會以任何方式更改狀態代碼或響應體。
這一設計使得服務能夠發送任何 API 客戶端都可以輕鬆讀取的警告，同時保持與以前的客戶端版本兼容。

<!--
Warnings are surfaced by `kubectl` v1.19+ in `stderr` output, and by the `k8s.io/client-go` client library v0.19.0+ in log output.
The `k8s.io/client-go` behavior can be [overridden per-process or per-client](#customize-client-handling).
-->
警告在 `kubectl` v1.19+ 的 `stderr` 輸出中和 `k8s.io/client-go` v0.19.0+ 客戶端庫的日誌中出現。
`k8s.io/client-go` 行爲可以[在進程或客戶端層面重載](#customize-client-handling)。

<!--
## Deprecation Warnings
-->
## 棄用警告    {#deprecation-warnings}

<!--
The first way we are using this new capability is to send warnings for use of deprecated APIs.
-->
我們第一次使用此新功能是針對已棄用的 API 調用發送警告。

<!--
Kubernetes is a [big, fast-moving project](https://www.cncf.io/cncf-kubernetes-project-journey/#development-velocity).
Keeping up with the [changes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md#changelog-since-v1180)
in each release can be daunting, even for people who work on the project full-time. One important type of change is API deprecations.
As APIs in Kubernetes graduate to GA versions, pre-release API versions are deprecated and eventually removed.
-->
Kubernetes 是一個[大型、快速發展的項目](https://www.cncf.io/cncf-kubernetes-project-journey/#development-velocity)。
跟上每個版本的[變更](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md#changelog-since-v1180)可能是令人生畏的，
即使對於全職從事該項目的人來說也是如此。一種重要的變更是 API 棄用。
隨着 Kubernetes 中的 API 升級到 GA 版本，預發佈的 API 版本會被棄用並最終被刪除。

<!--
Even though there is an [extended deprecation period](/docs/reference/using-api/deprecation-policy/),
and deprecations are [included in release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md#deprecation),
they can still be hard to track. During the deprecation period, the pre-release API remains functional,
allowing several releases to transition to the stable API version. However, we have found that users often don't even realize
they are depending on a deprecated API version until they upgrade to the release that stops serving it.
-->
即使有[延長的棄用期](/zh-cn/docs/reference/using-api/deprecation-policy/)，
並且[在發佈說明中](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md#deprecation)也包含了棄用信息，
他們仍然很難被追蹤。在棄用期內，預發佈 API 仍然有效，
允許多個版本過渡到穩定的 API 版本。
然而，我們發現使用者往往甚至沒有意識到他們依賴於已棄用的 API 版本，
直到升級到不再提供相應服務的新版本。

<!--
Starting in v1.19, whenever a request is made to a deprecated REST API, a warning is returned along with the API response.
This warning includes details about the release in which the API will no longer be available, and the replacement API version.
-->
從 v1.19 開始，系統每當收到針對已棄用的 REST API 的請求時，都會返回警告以及 API 響應。
此警告包括有關 API 將不再可用的版本以及替換 API 版本的詳細信息。

<!--
Because the warning originates at the server, and is intercepted at the client level, it works for all kubectl commands,
including high-level commands like `kubectl apply`, and low-level commands like `kubectl get --raw`:

<img alt="kubectl applying a manifest file, then displaying a warning message 'networking.k8s.io/v1beta1 Ingress is deprecated in v1.19+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress'."
     src="kubectl-warnings.png"
     style="width:637px;max-width:100%;">
-->
因爲警告源自伺服器端，並在客戶端層級被攔截，所以它適用於所有 kubectl 命令，
包括像 `kubectl apply` 這樣的高級命令，以及像 `kubectl get --raw` 這樣的低級命令：

<img alt="kubectl 執行一個清單文件, 然後顯示警告信息 'networking.k8s.io/v1beta1 Ingress is deprecated in v1.19+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress'。"
     src="kubectl-warnings.png"
     style="width:637px;max-width:100%;">

<!--
This helps people affected by the deprecation to know the request they are making is deprecated,
how long they have to address the issue, and what API they should use instead.
This is especially helpful when the user is applying a manifest they didn't create,
so they have time to reach out to the authors to ask for an updated version.
-->
這有助於受棄用影響的人們知道他們所請求的API已被棄用，
他們有多長時間來解決這個問題，以及他們應該使用什麼 API。
這在使用者應用不是由他們創建的清單文件時特別有用，
所以他們有時間聯繫作者要一個更新的版本。

<!--
We also realized that the person *using* a deprecated API is often not the same person responsible for upgrading the cluster,
so we added two administrator-facing tools to help track use of deprecated APIs and determine when upgrades are safe.
-->
我們還意識到**使用**已棄用的 API 的人通常不是負責升級叢集的人，
因此，我們添加了兩個面向管理員的工具來幫助跟蹤已棄用的 API 的使用情況並確定何時升級安全。

<!--
### Metrics
-->

### 度量指標    {#metrics}

<!--
Starting in Kubernetes v1.19, when a request is made to a deprecated REST API endpoint,
an `apiserver_requested_deprecated_apis` gauge metric is set to `1` in the kube-apiserver process.
This metric has labels for the API `group`, `version`, `resource`, and `subresource`,
and a `removed_release` label that indicates the Kubernetes release in which the API will no longer be served.
-->
從 Kubernetes v1.19 開始，當向已棄用的 REST API 端點發出請求時，
在 kube-apiserver 進程中，`apiserver_requested_deprecated_apis` 度量指標會被設置爲 `1`。
該指標具有 API `group`、`version`、`resource` 和 `subresource` 的標籤，
和一個 `removed_release` 標籤，表明不再提供 API 的 Kubernetes 版本。

<!--
This is an example query using `kubectl`, [prom2json](https://github.com/prometheus/prom2json),
and [jq](https://stedolan.github.io/jq/) to determine which deprecated APIs have been requested
from the current instance of the API server:
-->
下面是一個使用 `kubectl` 的查詢示例，[prom2json](https://github.com/prometheus/prom2json)
和 [jq](https://stedolan.github.io/jq/) 用來確定當前 API
伺服器實例上收到了哪些對已棄用的 API 請求：

```sh
kubectl get --raw /metrics | prom2json | jq '
  .[] | select(.name=="apiserver_requested_deprecated_apis").metrics[].labels
'
```

<!--
Output:
-->
輸出：

```json
{
  "group": "extensions",
  "removed_release": "1.22",
  "resource": "ingresses",
  "subresource": "",
  "version": "v1beta1"
}
{
  "group": "rbac.authorization.k8s.io",
  "removed_release": "1.22",
  "resource": "clusterroles",
  "subresource": "",
  "version": "v1beta1"
}
```

<!--
This shows the deprecated `extensions/v1beta1` Ingress and `rbac.authorization.k8s.io/v1beta1` ClusterRole APIs
have been requested on this server, and will be removed in v1.22.

We can join that information with the `apiserver_request_total` metrics to get more details about the requests being made to these APIs:
-->
輸出展示在此伺服器上請求了已棄用的 `extensions/v1beta1` Ingress 和 `rbac.authorization.k8s.io/v1beta1`
ClusterRole API，這兩個 API 都將在 v1.22 中被刪除。

我們可以將該信息與 `apiserver_request_total` 指標結合起來，以獲取有關這些 API 請求的更多詳細信息：

```sh
kubectl get --raw /metrics | prom2json | jq '
  # set $deprecated to a list of deprecated APIs
  [
    .[] | 
    select(.name=="apiserver_requested_deprecated_apis").metrics[].labels |
    {group,version,resource}
  ] as $deprecated 
  
  |
  
  # select apiserver_request_total metrics which are deprecated
  .[] | select(.name=="apiserver_request_total").metrics[] |
  select(.labels | {group,version,resource} as $key | $deprecated | index($key))
'
```

<!--
Output:
-->
輸出：

```json
{
  "labels": {
    "code": "0",
    "component": "apiserver",
    "contentType": "application/vnd.kubernetes.protobuf;stream=watch",
    "dry_run": "",
    "group": "extensions",
    "resource": "ingresses",
    "scope": "cluster",
    "subresource": "",
    "verb": "WATCH",
    "version": "v1beta1"
  },
  "value": "21"
}
{
  "labels": {
    "code": "200",
    "component": "apiserver",
    "contentType": "application/vnd.kubernetes.protobuf",
    "dry_run": "",
    "group": "extensions",
    "resource": "ingresses",
    "scope": "cluster",
    "subresource": "",
    "verb": "LIST",
    "version": "v1beta1"
  },
  "value": "1"
}
{
  "labels": {
    "code": "200",
    "component": "apiserver",
    "contentType": "application/json",
    "dry_run": "",
    "group": "rbac.authorization.k8s.io",
    "resource": "clusterroles",
    "scope": "cluster",
    "subresource": "",
    "verb": "LIST",
    "version": "v1beta1"
  },
  "value": "1"
}
```

<!--
The output shows that only read requests are being made to these APIs, and the most requests have been made to watch the deprecated Ingress API.

You can also find that information through the following Prometheus query,
which returns information about requests made to deprecated APIs which will be removed in v1.22:
-->
上面的輸出展示，對這些 API 發出的都只是讀請求，並且大多數請求都用來監測已棄用的 Ingress API。

你還可以通過以下 Prometheus 查詢獲取這一信息，
該查詢返回關於已棄用的、將在 v1.22 中刪除的 API 請求的信息：

```promql
apiserver_requested_deprecated_apis{removed_release="1.22"} * on(group,version,resource,subresource)
group_right() apiserver_request_total
```

<!--
### Audit Annotations
-->
### 審計註解    {#audit-annotations}

<!--
Metrics are a fast way to check whether deprecated APIs are being used, and at what rate,
but they don't include enough information to identify particular clients or API objects.
Starting in Kubernetes v1.19, [audit events](/docs/tasks/debug/debug-cluster/audit/)
for requests to deprecated APIs include an audit annotation of `"k8s.io/deprecated":"true"`.
Administrators can use those audit events to identify specific clients or objects that need to be updated.
-->
度量指標是檢查是否正在使用已棄用的 API 以及使用率如何的快速方法，
但它們沒有包含足夠的信息來識別特定的客戶端或 API 對象。
從 Kubernetes v1.19 開始，
對已棄用的 API 的請求進行審計時，[審計事件](/zh-cn/docs/tasks/debug/debug-cluster/audit/)中會包括
審計註解 `"k8s.io/deprecated":"true"`。
管理員可以使用這些審計事件來識別需要更新的特定客戶端或對象。

<!--
## Custom Resource Definitions
-->
## 自定義資源定義    {#custom-resource-definitions}

<!--
Along with the API server ability to warn about deprecated API use, starting in v1.19, a CustomResourceDefinition can indicate a 
[particular version of the resource it defines is deprecated](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#version-deprecation).
When API requests to a deprecated version of a custom resource are made, a warning message is returned, matching the behavior of built-in APIs.

The author of the CustomResourceDefinition can also customize the warning for each version if they want to.
This allows them to give a pointer to a migration guide or other information if needed.
-->
除了 API 伺服器對已棄用的 API 使用發出警告的能力外，從 v1.19 開始，CustomResourceDefinition
可以指示[它定義的資源的特定版本已被棄用](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#version-deprecation)。
當對自定義資源的已棄用的版本發出 API 請求時，將返回一條警告消息，與內置 API 的行爲相匹配。

CustomResourceDefinition 的作者還可以根據需要自定義每個版本的警告。
這允許他們在需要時提供指向遷移指南的信息或其他信息。

<!--
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  versions:
  - name: v1alpha1
    # This indicates the v1alpha1 version of the custom resource is deprecated.
    # API requests to this version receive a warning in the server response.
    deprecated: true
    # This overrides the default warning returned to clients making v1alpha1 API requests.
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; use example.com/v1 CronTab (see http://example.com/v1alpha1-v1)"
    ...

  - name: v1beta1
    # This indicates the v1beta1 version of the custom resource is deprecated.
    # API requests to this version receive a warning in the server response.
    # A default warning message is returned for this version.
    deprecated: true
    ...

  - name: v1
    ...
```
-->
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  versions:
  - name: v1alpha1
    # 這表示 v1alpha1 版本的自定義資源已經廢棄了。
    # 對此版本的 API 請求會在伺服器響應中收到警告。
    deprecated: true
    # 這會把返回給發出 v1alpha1 API 請求的客戶端的默認警告覆蓋。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; use example.com/v1 CronTab (see http://example.com/v1alpha1-v1)"
    ...

  - name: v1beta1
    # 這表示 v1beta1 版本的自定義資源已經廢棄了。
    # 對此版本的 API 請求會在伺服器響應中收到警告。
    # 此版本返回默認警告消息。
    deprecated: true
    ...

  - name: v1
    ...
```

<!--
## Admission Webhooks
-->
## 准入 Webhook    {#admission-webhooks}

<!--
[Admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers)
are the primary way to integrate custom policies or validation with Kubernetes.
Starting in v1.19, admission webhooks can [return warning messages](/docs/reference/access-authn-authz/extensible-admission-controllers/#response)
that are passed along to the requesting API client. Warnings can be returned with allowed or rejected admission responses.

As an example, to allow a request but warn about a configuration known not to work well, an admission webhook could send this response:
-->
[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers)是將自定義策略或驗證與
Kubernetes 集成的主要方式。
從 v1.19 開始，Admission Webhook 可以[返回警告消息](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#response)，
傳遞給發送請求的 API 客戶端。警告可以與允許或拒絕的響應一起返回。

例如，允許請求但警告已知某個設定無法正常運行時，准入 Webhook 可以發送以下響應：

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "warnings": [
      ".spec.memory: requests >1GB do not work on Fridays"
    ]
  }
}
```

<!--
If you are implementing a webhook that returns a warning message, here are some tips:

* Don't include a "Warning:" prefix in the message (that is added by clients on output)
* Use warning messages to describe problems the client making the API request should correct or be aware of
* Be brief; limit warnings to 120 characters if possible
-->
如果你在實現一個返回警告消息的 Webhook，這裏有一些提示：

* 不要在消息中包含 “Warning:” 前綴（由客戶端在輸出時添加）
* 使用警告消息來正確描述能被髮出 API 請求的客戶端糾正或瞭解的問題
* 保持簡潔；如果可能，將警告限制爲 120 個字符以內

<!--
There are many ways admission webhooks could use this new feature, and I'm looking forward to seeing what people come up with.
Here are a couple ideas to get you started:

* webhook implementations adding a "complain" mode, where they return warnings instead of rejections,
  to allow trying out a policy to verify it is working as expected before starting to enforce it
* "lint" or "vet"-style webhooks, inspecting objects and surfacing warnings when best practices are not followed
-->
准入 Webhook 可以通過多種方式使用這個新功能，我期待看到大家想出來的方法。
這裏有一些想法可以幫助你入門：

* 添加 “complain” 模式的 Webhook 實現，它們返回警告而不是拒絕，
  允許在開始執行之前嘗試策略以驗證它是否按預期工作
* “lint” 或 “vet” 風格的 Webhook，檢查對象並在未遵循最佳實踐時顯示警告

<!--
## Customize Client Handling
-->
## 自定義客戶端處理方式    {#customize-client-handling}

<!--
Applications that use the `k8s.io/client-go` library to make API requests can customize
how warnings returned from the server are handled. By default, warnings are logged to
stderr as they are received, but this behavior can be customized 
[per-process](https://godoc.org/k8s.io/client-go/rest#SetDefaultWarningHandler)
or [per-client](https://godoc.org/k8s.io/client-go/rest#Config).
-->
使用 `k8s.io/client-go` 庫發出 API 請求的應用程序可以定製如何處理從伺服器返回的警告。
默認情況下，收到的警告會以日誌形式輸出到 stderr，
但[在進程層面](https://godoc.org/k8s.io/client-go/rest#SetDefaultWarningHandler)或[客戶端層面]
(https://godoc.org/k8s.io/client-go/rest#Config)均可定製這一行爲。

<!--
This example shows how to make your application behave like `kubectl`,
overriding message handling process-wide to deduplicate warnings 
and highlighting messages using colored output where supported:
-->
這個例子展示瞭如何讓你的應用程序表現得像 `kubectl`，
在進程層面重載整個消息處理邏輯以刪除重複的警告，
並在支持的情況下使用彩色輸出突出顯示消息：

```go
import (
  "os"
  "k8s.io/client-go/rest"
  "k8s.io/kubectl/pkg/util/term"
  ...
)

func main() {
  rest.SetDefaultWarningHandler(
    rest.NewWarningWriter(os.Stderr, rest.WarningWriterOptions{
        // only print a given warning the first time we receive it
        Deduplicate: true,
        // highlight the output with color when the output supports it
        Color: term.AllowsColorOutput(os.Stderr),
      },
    ),
  )

  ...
```

<!--
The next example shows how to construct a client that ignores warnings.
This is useful for clients that operate on metadata for all resource types
(found dynamically at runtime using the discovery API)
and do not benefit from warnings about a particular resource being deprecated.
Suppressing deprecation warnings is not recommended for clients that require use of particular APIs.
-->
下一個示例展示如何構建一個忽略警告的客戶端。
這對於那些操作所有資源類型（使用發現 API 在運行時動態發現）
的元數據並且不會從已棄用的特定資源的警告中受益的客戶端很有用。
對於需要使用特定 API 的客戶端，不建議抑制棄用警告。

```go
import (
  "k8s.io/client-go/rest"
  "k8s.io/client-go/kubernetes"
)

func getClientWithoutWarnings(config *rest.Config) (kubernetes.Interface, error) {
  // copy to avoid mutating the passed-in config
  config = rest.CopyConfig(config)
  // set the warning handler for this client to ignore warnings
  config.WarningHandler = rest.NoWarnings{}
  // construct and return the client
  return kubernetes.NewForConfig(config)
}
```

<!--
## Kubectl Strict Mode
-->
## Kubectl 強制模式    {#kubectl-strict-mode}

<!--
If you want to be sure you notice deprecations as soon as possible and get a jump start on addressing them,
`kubectl` added a `--warnings-as-errors` option in v1.19. When invoked with this option,
`kubectl` treats any warnings it receives from the server as errors and exits with a non-zero exit code:

<img alt="kubectl applying a manifest file with a --warnings-as-errors flag, displaying a warning message and exiting with a non-zero exit code."
     src="kubectl-warnings-as-errors.png"
     style="width:637px;max-width:100%;">

This could be used in a CI job to apply manifests to a current server,
and required to pass with a zero exit code in order for the CI job to succeed.
-->
如果你想確保及時注意到棄用問題並立即着手解決它們，
`kubectl` 在 v1.19 中添加了 `--warnings-as-errors` 選項。使用此選項調用時，
`kubectl` 將從伺服器收到的所有警告視爲錯誤，並以非零碼退出：

<img alt="kubectl 在設置 --warnings-as-errors 標記的情況下執行一個清單文件, 返回警告消息和非零退出碼。"
     src="kubectl-warnings-as-errors.png"
     style="width:637px;max-width:100%;">

這可以在 CI 作業中用於將清單文件應用到當前伺服器，
其中要求通過零退出碼才能使 CI 作業成功。

<!--
## Future Possibilities
-->
## 未來的可能性    {#future-possibilities}

<!--
Now that we have a way to communicate helpful information to users in context,
we're already considering other ways we can use this to improve people's experience with Kubernetes.
A couple areas we're looking at next are warning about [known problematic values](http://issue.k8s.io/64841#issuecomment-395141013)
we cannot reject outright for compatibility reasons, and warning about use of deprecated fields or field values
(like selectors using beta os/arch node labels, [deprecated in v1.14](/docs/reference/labels-annotations-taints/#beta-kubernetes-io-arch-deprecated)).
I'm excited to see progress in this area, continuing to make it easier to use Kubernetes.
-->
現在我們有了一種在上下文中向使用者傳達有用信息的方法，
我們已經在考慮使用其他方法來改善人們使用 Kubernetes 的體驗。
我們接下來要研究的幾個領域是關於[已知有問題的值](http://issue.k8s.io/64841#issuecomment-395141013)的警告。
出於兼容性原因，我們不能直接拒絕，而應就使用已棄用的字段或字段值
（例如使用 beta os/arch 節點標籤的選擇器，
[在 v1.14 中已棄用](/zh-cn/docs/reference/labels-annotations-taints/#beta-kubernetes-io-arch-deprecated)）
給出警告。
我很高興看到這方面的進展，繼續讓 Kubernetes 更容易使用。
