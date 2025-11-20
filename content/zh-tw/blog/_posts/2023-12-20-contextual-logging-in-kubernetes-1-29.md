---
layout: blog
title: "Kubernetes 1.29 中的上下文日誌生成：更好的故障排除和增強的日誌記錄"
slug: contextual-logging-in-kubernetes-1-29
date: 2023-12-20T09:30:00-08:00
---
<!--
layout: blog
title: "Contextual logging in Kubernetes 1.29: Better troubleshooting and enhanced logging"
slug: contextual-logging-in-kubernetes-1-29
date: 2023-12-20T09:30:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2023/12/20/contextual-logging/
-->

<!--
**Authors**: [Mengjiao Liu](https://github.com/mengjiao-liu/) (DaoCloud), [Patrick Ohly](https://github.com/pohly) (Intel)
-->
**作者**：[Mengjiao Liu](https://github.com/mengjiao-liu/) (DaoCloud), [Patrick Ohly](https://github.com/pohly) (Intel)

**譯者**：[Mengjiao Liu](https://github.com/mengjiao-liu/) (DaoCloud)

<!--
On behalf of the [Structured Logging Working Group](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md) 
and [SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation#readme), 
we are pleased to announce that the contextual logging feature
introduced in Kubernetes v1.24 has now been successfully migrated to
two components (kube-scheduler and kube-controller-manager)
as well as some directories. This feature aims to provide more useful logs 
for better troubleshooting of Kubernetes and to empower developers to enhance Kubernetes.
-->
代表[結構化日誌工作組](https://github.com/kubernetes/community/blob/master/wg-structed-logging/README.md)和
[SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation#readme)，
我們很高興地宣佈在 Kubernetes v1.24 中引入的上下文日誌記錄功能現已成功遷移了兩個組件（kube-scheduler 和 kube-controller-manager）
以及一些目錄。該功能旨在爲 Kubernetes 提供更多有用的日誌以更好地進行故障排除，並幫助開發人員增強 Kubernetes。

<!--
## What is contextual logging?

[Contextual logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
is based on the [go-logr](https://github.com/go-logr/logr#a-minimal-logging-api-for-go) API. 
The key idea is that libraries are passed a logger instance by their caller
and use that for logging instead of accessing a global logger.
The binary decides the logging implementation, not the libraries.
The go-logr API is designed around structured logging and supports attaching
additional information to a logger.
-->
## 上下文日誌記錄是什麼？  {#what-is-contextual-logging}

[上下文日誌記錄](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)基於
[go-logr](https://github.com/go-logr/logr#a-minimal-logging-api-for-go) API。
關鍵思想是調用者將一個日誌生成器實例傳遞給庫，並使用它進行日誌記錄而不是訪問全局日誌生成器。
二進制檔案而不是庫負責選擇日誌記錄的實現。go-logr API 圍繞結構化日誌記錄而設計，並支持向日誌生成器提供額外資訊。

<!--
This enables additional use cases:

- The caller can attach additional information to a logger:
  - [WithName](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName>) adds a "logger" key with the names concatenated by a dot as value
  - [WithValues](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues>) adds key/value pairs

  When passing this extended logger into a function, and the function uses it
  instead of the global logger, the additional information is then included 
  in all log entries, without having to modify the code that generates the log entries. 
  This is useful in highly parallel applications where it can become hard to identify 
  all log entries for a certain operation, because the output from different operations gets interleaved.

- When running unit tests, log output can be associated with the current test.
  Then, when a test fails, only the log output of the failed test gets shown by go test.
  That output can also be more verbose by default because it will not get shown for successful tests.
  Tests can be run in parallel without interleaving their output.
-->
這一設計可以支持某些額外的使用場景：

- 調用者可以爲日誌生成器提供額外的資訊：
  - [WithName](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName>) 添加一個 “logger” 鍵，
    並用句點（.）將名稱的各個部分串接起來作爲取值
  - [WithValues](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues>) 添加鍵/值對

  當將此經過擴展的日誌生成器傳遞到函數中，並且該函數使用它而不是全局日誌生成器時，
  所有日誌條目中都會包含所給的額外資訊，而無需修改生成日誌條目的代碼。
  這一特點在高度並行的應用中非常有用。在這類應用中，很難辨識某操作的所有日誌條目，因爲不同操作的輸出是交錯的。

- 運行單元測試時，日誌輸出可以與當前測試相關聯。且當測試失敗時，go test 僅顯示失敗測試的日誌輸出。
  預設情況下，該輸出也可能更詳細，因爲它不會在成功的測試中顯示。測試可以並行運行，而無需交錯輸出。

<!--
One of the design decisions for contextual logging was to allow attaching a logger as value to a `context.Context`.
Since the logger encapsulates all aspects of the intended logging for the call,
it is *part* of the context, and not just *using* it. A practical advantage is that many APIs
already have a `ctx` parameter or can add one. This provides additional advantages, like being able to
get rid of `context.TODO()` calls inside the functions.
-->
上下文日誌記錄的設計決策之一是允許將日誌生成器作爲值附加到 `context.Context` 之上。
由於日誌生成器封裝了調用所預期的、與日誌記錄相關的所有元素，
因此它是 context 的**一部分**，而不僅僅是**使用**它。這一設計的一個比較實際的優點是，
許多 API 已經有一個 `ctx` 參數，或者可以添加一個 `ctx` 參數。
進而產生的額外好處還包括比如可以去掉函數內的 `context.TODO()` 調用。

<!--
## How to use it

The contextual logging feature is alpha starting from Kubernetes v1.24,
so it requires the `ContextualLogging` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled.
If you want to test the feature while it is alpha, you need to enable this feature gate
on the `kube-controller-manager` and the `kube-scheduler`.
-->
## 如何使用它  {#how-to-use-it}

從 Kubernetes v1.24 開始，上下文日誌記錄功能處於 Alpha 狀態，因此它需要啓用
`ContextualLogging` [特性門控](/docs/reference/command-line-tools-reference/feature-gates/)。
如果你想在該功能處於 Alpha 狀態時對其進行測試，則需要在 `kube-controller-manager` 和 `kube-scheduler` 上啓用此特性門控。

<!--
For the `kube-scheduler`, there is one thing to note, in addition to enabling 
the `ContextualLogging` feature gate, instrumentation also depends on log verbosity.
To avoid slowing down the scheduler with the logging instrumentation for contextual logging added for 1.29,
it is important to choose carefully when to add additional information:
- At `-v3` or lower, only `WithValues("pod")` is used once per scheduling cycle.
  This has the intended effect that all log messages for the cycle include the pod information. 
  Once contextual logging is GA, "pod" key/value pairs can be removed from all log calls.
- At `-v4` or higher, richer log entries get produced where `WithValues` is also used for the node (when applicable)
  and `WithName` is used for the current operation and plugin.
-->
對於 `kube-scheduler`，有一點需要注意，除了啓用 `ContextualLogging` 特性門控之外，
插樁行爲還取決於日誌的詳細程度設置。
爲了避免因 1.29 添加的上下文日誌記錄工具而降低調度程式的速度，請務必仔細選擇何時添加額外的資訊：
- 在 `-v3` 或更低日誌級別中，每個調度週期僅使用一次 `WithValues("pod")`。
  這樣做可以達到預期效果，即該週期的所有日誌消息都包含 Pod 資訊。
  一旦上下文日誌記錄特性到達 GA 階段，就可以從所有日誌調用中刪除 “pod” 鍵值對。
- 在 `-v4` 或更高日誌級別中，會生成更豐富的日誌條目，其中 `WithValues` 也用於節點（如果適用），`WithName` 用於當前操作和插件。

<!--
Here is an example that demonstrates the effect:
-->
下面的示例展示了這一效果：
> I1113 08:43:37.029524   87144 default_binder.go:53] "Attempting to bind pod to node" **logger="Bind.DefaultBinder"** **pod**="kube-system/coredns-69cbfb9798-ms4pq" **node**="127.0.0.1"

<!--
The immediate benefit is that the operation and plugin name are visible in `logger`.
`pod` and `node` are already logged as parameters in individual log calls in `kube-scheduler` code.
Once contextual logging is supported by more packages outside of `kube-scheduler`, 
they will also be visible there (for example, client-go). Once it is GA,
log calls can be simplified to avoid repeating those values.
-->
這一設計的直接好處是在 `logger` 中可以看到操作和插件名稱。`pod` 和 `node` 已作爲參數記錄在
`kube-scheduler` 代碼中的各個日誌調用中。一旦 `kube-scheduler` 之外的其他包也支持上下文日誌記錄，
在這些包（例如，client-go）中也可以看到操作和插件名稱。
一旦上下文日誌記錄特性到達 GA 階段，就可以簡化日誌調用以避免重複這些值。

<!--
In `kube-controller-manager`, `WithName` is used to add the user-visible controller name to log output, 
for example:
-->
在 `kube-controller-manager` 中，`WithName` 被用來在日誌中輸出使用者可見的控制器名稱，例如：

> I1113 08:43:29.284360   87141 graph_builder.go:285] "garbage controller monitor not synced: no monitors" **logger="garbage-collector-controller"**

<!--
The `logger=”garbage-collector-controller”` was added by the `kube-controller-manager` core
when instantiating that controller and appears in all of its log entries - at least as long as the code
that it calls supports contextual logging. Further work is needed to convert shared packages like client-go.
-->
`logger=”garbage-collector-controller”` 是由 `kube-controller-manager`
核心代碼在實例化該控制器時添加的，會出現在其所有日誌條目中——只要它所調用的代碼支持上下文日誌記錄。
轉換像 client-go 這樣的共享包還需要額外的工作。

<!--
## Performance impact

Supporting contextual logging in a package, i.e. accepting a logger from a caller, is cheap. 
No performance impact was observed for the `kube-scheduler`. As noted above, 
adding `WithName` and `WithValues` needs to be done more carefully.
-->
## 性能影響  {#performance-impact}

在包中支持上下文日誌記錄，即接受來自調用者的記錄器，成本很低。
沒有觀察到 `kube-scheduler` 的性能影響。如上所述，添加 `WithName` 和 `WithValues` 需要更加小心。

<!--
In Kubernetes 1.29, enabling contextual logging at production verbosity (`-v3` or lower)
caused no measurable slowdown for the `kube-scheduler` and is not expected for the `kube-controller-manager` either.
At debug levels, a 28% slowdown for some test cases is still reasonable given that the resulting logs make debugging easier. 
For details, see the [discussion around promoting the feature to beta](https://github.com/kubernetes/enhancements/pull/4219#issuecomment-1807811995).
-->
在 Kubernetes 1.29 中，以生產環境日誌詳細程度（`-v3` 或更低）啓用上下文日誌不會導致 `kube-scheduler` 速度出現明顯的減慢，
並且 `kube-controller-manager` 速度也不會出現明顯的減慢。在 debug 級別，考慮到生成的日誌使調試更容易，某些測試用例減速 28% 仍然是合理的。
詳細資訊請參閱[有關將該特性升級爲 Beta 版的討論](https://github.com/kubernetes/enhancements/pull/4219#issuecomment-1807811995)。

<!--
## Impact on downstream users
Log output is not part of the Kubernetes API and changes regularly in each release,
whether it is because developers work on the code or because of the ongoing conversion
to structured and contextual logging.

If downstream users have dependencies on specific logs, 
they need to be aware of how this change affects them.
-->
## 對下游使用者的影響  {#impact-on-downstream-users}

日誌輸出不是 Kubernetes API 的一部分，並且經常在每個版本中都會出現更改，
無論是因爲開發人員修改代碼還是因爲不斷轉換爲結構化和上下文日誌記錄。

如果下游使用者對特定日誌有依賴性，他們需要了解此更改如何影響他們。

<!--
## Further reading

- Read the [Contextual Logging in Kubernetes 1.24](https://www.kubernetes.dev/blog/2022/05/25/contextual-logging/) article.
- Read the [KEP-3077: contextual logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).
-->
## 進一步閱讀  {#further-reading}

- 參閱 [Kubernetes 1.24 中的上下文日誌記錄](https://www.kubernetes.dev/blog/2022/05/25/contextual-logging/) 。
- 參閱 [KEP-3077：上下文日誌記錄](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)。

<!--
## Get involved

If you're interested in getting involved, we always welcome new contributors to join us.
Contextual logging provides a fantastic opportunity for you to contribute to Kubernetes development and make a meaningful impact.
By joining [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging),
you can actively participate in the development of Kubernetes and make your first contribution.
It's a great way to learn and engage with the community while gaining valuable experience.
-->
## 如何參與  {#get-involved}

如果你有興趣參與，我們始終歡迎新的貢獻者加入我們。上下文日誌記錄爲你參與
Kubernetes 開發做出貢獻併產生有意義的影響提供了絕佳的機會。
通過加入 [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging)，
你可以積極參與 Kubernetes 的開發並做出你的第一個貢獻。這是學習和參與社區並獲得寶貴經驗的好方法。

<!--
We encourage you to explore the repository and familiarize yourself with the ongoing discussions and projects. 
It's a collaborative environment where you can exchange ideas, ask questions, and work together with other contributors.
-->
我們鼓勵你探索儲存庫並熟悉正在進行的討論和項目。這是一個協作環境，你可以在這裏交流想法、提出問題並與其他貢獻者一起工作。

<!--
If you have any questions or need guidance, don't hesitate to reach out to us 
and you can do so on our [public Slack channel](https://kubernetes.slack.com/messages/wg-structured-logging). 
If you're not already part of that Slack workspace, you can visit [https://slack.k8s.io/](https://slack.k8s.io/)
for an invitation.
-->
如果你有任何疑問或需要指導，請隨時與我們聯繫，你可以通過我們的[公共 Slack 頻道](https://kubernetes.slack.com/messages/wg-structured-logging)聯繫我們。
如果你尚未加入 Slack 工作區，可以訪問 [https://slack.k8s.io/](https://slack.k8s.io/) 獲取邀請。

<!--
We would like to express our gratitude to all the contributors who provided excellent reviews, 
shared valuable insights, and assisted in the implementation of this feature (in alphabetical order):
-->
我們要向所有提供精彩評論、分享寶貴見解並協助實施此功能的貢獻者表示感謝（按字母順序排列）：

- Aldo Culquicondor ([alculquicondor](https://github.com/alculquicondor))
- Andy Goldstein ([ncdc](https://github.com/ncdc))
- Feruzjon Muyassarov ([fmuyassarov](https://github.com/fmuyassarov))
- Freddie ([freddie400](https://github.com/freddie400))
- JUN YANG ([yangjunmyfm192085](https://github.com/yangjunmyfm192085))
- Kante Yin ([kerthcet](https://github.com/kerthcet))
- Kiki ([carlory](https://github.com/carlory))
- Lucas Severo Alve ([knelasevero](https://github.com/knelasevero))
- Maciej Szulik ([soltysh](https://github.com/soltysh))
- Mengjiao Liu ([mengjiao-liu](https://github.com/mengjiao-liu))
- Naman Lakhwani ([Namanl2001](https://github.com/Namanl2001))
- Oksana Baranova ([oxxenix](https://github.com/oxxenix))
- Patrick Ohly ([pohly](https://github.com/pohly))
- songxiao-wang87 ([songxiao-wang87](https://github.com/songxiao-wang87))
- Tim Allclai ([tallclair](https://github.com/tallclair))
- ZhangYu ([Octopusjust](https://github.com/Octopusjust))
- Ziqi Zhao ([fatsheep9146](https://github.com/fatsheep9146))
- Zac ([249043822](https://github.com/249043822))
