---
layout: blog
title: "Kubernetes 1.29 中的上下文日志生成：更好的故障排除和增强的日志记录"
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

**译者**：[Mengjiao Liu](https://github.com/mengjiao-liu/) (DaoCloud)

<!--
On behalf of the [Structured Logging Working Group](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md) 
and [SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation#readme), 
we are pleased to announce that the contextual logging feature
introduced in Kubernetes v1.24 has now been successfully migrated to
two components (kube-scheduler and kube-controller-manager)
as well as some directories. This feature aims to provide more useful logs 
for better troubleshooting of Kubernetes and to empower developers to enhance Kubernetes.
-->
代表[结构化日志工作组](https://github.com/kubernetes/community/blob/master/wg-structed-logging/README.md)和
[SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation#readme)，
我们很高兴地宣布在 Kubernetes v1.24 中引入的上下文日志记录功能现已成功迁移了两个组件（kube-scheduler 和 kube-controller-manager）
以及一些目录。该功能旨在为 Kubernetes 提供更多有用的日志以更好地进行故障排除，并帮助开发人员增强 Kubernetes。

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
## 上下文日志记录是什么？  {#what-is-contextual-logging}

[上下文日志记录](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)基于
[go-logr](https://github.com/go-logr/logr#a-minimal-logging-api-for-go) API。
关键思想是调用者将一个日志生成器实例传递给库，并使用它进行日志记录而不是访问全局日志生成器。
二进制文件而不是库负责选择日志记录的实现。go-logr API 围绕结构化日志记录而设计，并支持向日志生成器提供额外信息。

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
这一设计可以支持某些额外的使用场景：

- 调用者可以为日志生成器提供额外的信息：
  - [WithName](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName>) 添加一个 “logger” 键，
    并用句点（.）将名称的各个部分串接起来作为取值
  - [WithValues](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues>) 添加键/值对

  当将此经过扩展的日志生成器传递到函数中，并且该函数使用它而不是全局日志生成器时，
  所有日志条目中都会包含所给的额外信息，而无需修改生成日志条目的代码。
  这一特点在高度并行的应用中非常有用。在这类应用中，很难辨识某操作的所有日志条目，因为不同操作的输出是交错的。

- 运行单元测试时，日志输出可以与当前测试相关联。且当测试失败时，go test 仅显示失败测试的日志输出。
  默认情况下，该输出也可能更详细，因为它不会在成功的测试中显示。测试可以并行运行，而无需交错输出。

<!--
One of the design decisions for contextual logging was to allow attaching a logger as value to a `context.Context`.
Since the logger encapsulates all aspects of the intended logging for the call,
it is *part* of the context, and not just *using* it. A practical advantage is that many APIs
already have a `ctx` parameter or can add one. This provides additional advantages, like being able to
get rid of `context.TODO()` calls inside the functions.
-->
上下文日志记录的设计决策之一是允许将日志生成器作为值附加到 `context.Context` 之上。
由于日志生成器封装了调用所预期的、与日志记录相关的所有元素，
因此它是 context 的**一部分**，而不仅仅是**使用**它。这一设计的一个比较实际的优点是，
许多 API 已经有一个 `ctx` 参数，或者可以添加一个 `ctx` 参数。
进而产生的额外好处还包括比如可以去掉函数内的 `context.TODO()` 调用。

<!--
## How to use it

The contextual logging feature is alpha starting from Kubernetes v1.24,
so it requires the `ContextualLogging` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled.
If you want to test the feature while it is alpha, you need to enable this feature gate
on the `kube-controller-manager` and the `kube-scheduler`.
-->
## 如何使用它  {#how-to-use-it}

从 Kubernetes v1.24 开始，上下文日志记录功能处于 Alpha 状态，因此它需要启用
`ContextualLogging` [特性门控](/docs/reference/command-line-tools-reference/feature-gates/)。
如果你想在该功能处于 Alpha 状态时对其进行测试，则需要在 `kube-controller-manager` 和 `kube-scheduler` 上启用此特性门控。

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
对于 `kube-scheduler`，有一点需要注意，除了启用 `ContextualLogging` 特性门控之外，
插桩行为还取决于日志的详细程度设置。
为了避免因 1.29 添加的上下文日志记录工具而降低调度程序的速度，请务必仔细选择何时添加额外的信息：
- 在 `-v3` 或更低日志级别中，每个调度周期仅使用一次 `WithValues("pod")`。
  这样做可以达到预期效果，即该周期的所有日志消息都包含 Pod 信息。
  一旦上下文日志记录特性到达 GA 阶段，就可以从所有日志调用中删除 “pod” 键值对。
- 在 `-v4` 或更高日志级别中，会生成更丰富的日志条目，其中 `WithValues` 也用于节点（如果适用），`WithName` 用于当前操作和插件。

<!--
Here is an example that demonstrates the effect:
-->
下面的示例展示了这一效果：
> I1113 08:43:37.029524   87144 default_binder.go:53] "Attempting to bind pod to node" **logger="Bind.DefaultBinder"** **pod**="kube-system/coredns-69cbfb9798-ms4pq" **node**="127.0.0.1"

<!--
The immediate benefit is that the operation and plugin name are visible in `logger`.
`pod` and `node` are already logged as parameters in individual log calls in `kube-scheduler` code.
Once contextual logging is supported by more packages outside of `kube-scheduler`, 
they will also be visible there (for example, client-go). Once it is GA,
log calls can be simplified to avoid repeating those values.
-->
这一设计的直接好处是在 `logger` 中可以看到操作和插件名称。`pod` 和 `node` 已作为参数记录在
`kube-scheduler` 代码中的各个日志调用中。一旦 `kube-scheduler` 之外的其他包也支持上下文日志记录，
在这些包（例如，client-go）中也可以看到操作和插件名称。
一旦上下文日志记录特性到达 GA 阶段，就可以简化日志调用以避免重复这些值。

<!--
In `kube-controller-manager`, `WithName` is used to add the user-visible controller name to log output, 
for example:
-->
在 `kube-controller-manager` 中，`WithName` 被用来在日志中输出用户可见的控制器名称，例如：

> I1113 08:43:29.284360   87141 graph_builder.go:285] "garbage controller monitor not synced: no monitors" **logger="garbage-collector-controller"**

<!--
The `logger=”garbage-collector-controller”` was added by the `kube-controller-manager` core
when instantiating that controller and appears in all of its log entries - at least as long as the code
that it calls supports contextual logging. Further work is needed to convert shared packages like client-go.
-->
`logger=”garbage-collector-controller”` 是由 `kube-controller-manager`
核心代码在实例化该控制器时添加的，会出现在其所有日志条目中——只要它所调用的代码支持上下文日志记录。
转换像 client-go 这样的共享包还需要额外的工作。

<!--
## Performance impact

Supporting contextual logging in a package, i.e. accepting a logger from a caller, is cheap. 
No performance impact was observed for the `kube-scheduler`. As noted above, 
adding `WithName` and `WithValues` needs to be done more carefully.
-->
## 性能影响  {#performance-impact}

在包中支持上下文日志记录，即接受来自调用者的记录器，成本很低。
没有观察到 `kube-scheduler` 的性能影响。如上所述，添加 `WithName` 和 `WithValues` 需要更加小心。

<!--
In Kubernetes 1.29, enabling contextual logging at production verbosity (`-v3` or lower)
caused no measurable slowdown for the `kube-scheduler` and is not expected for the `kube-controller-manager` either.
At debug levels, a 28% slowdown for some test cases is still reasonable given that the resulting logs make debugging easier. 
For details, see the [discussion around promoting the feature to beta](https://github.com/kubernetes/enhancements/pull/4219#issuecomment-1807811995).
-->
在 Kubernetes 1.29 中，以生产环境日志详细程度（`-v3` 或更低）启用上下文日志不会导致 `kube-scheduler` 速度出现明显的减慢，
并且 `kube-controller-manager` 速度也不会出现明显的减慢。在 debug 级别，考虑到生成的日志使调试更容易，某些测试用例减速 28% 仍然是合理的。
详细信息请参阅[有关将该特性升级为 Beta 版的讨论](https://github.com/kubernetes/enhancements/pull/4219#issuecomment-1807811995)。

<!--
## Impact on downstream users
Log output is not part of the Kubernetes API and changes regularly in each release,
whether it is because developers work on the code or because of the ongoing conversion
to structured and contextual logging.

If downstream users have dependencies on specific logs, 
they need to be aware of how this change affects them.
-->
## 对下游用户的影响  {#impact-on-downstream-users}

日志输出不是 Kubernetes API 的一部分，并且经常在每个版本中都会出现更改，
无论是因为开发人员修改代码还是因为不断转换为结构化和上下文日志记录。

如果下游用户对特定日志有依赖性，他们需要了解此更改如何影响他们。

<!--
## Further reading

- Read the [Contextual Logging in Kubernetes 1.24](https://www.kubernetes.dev/blog/2022/05/25/contextual-logging/) article.
- Read the [KEP-3077: contextual logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).
-->
## 进一步阅读  {#further-reading}

- 参阅 [Kubernetes 1.24 中的上下文日志记录](https://www.kubernetes.dev/blog/2022/05/25/contextual-logging/) 。
- 参阅 [KEP-3077：上下文日志记录](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)。

<!--
## Get involved

If you're interested in getting involved, we always welcome new contributors to join us.
Contextual logging provides a fantastic opportunity for you to contribute to Kubernetes development and make a meaningful impact.
By joining [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging),
you can actively participate in the development of Kubernetes and make your first contribution.
It's a great way to learn and engage with the community while gaining valuable experience.
-->
## 如何参与  {#get-involved}

如果你有兴趣参与，我们始终欢迎新的贡献者加入我们。上下文日志记录为你参与
Kubernetes 开发做出贡献并产生有意义的影响提供了绝佳的机会。
通过加入 [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging)，
你可以积极参与 Kubernetes 的开发并做出你的第一个贡献。这是学习和参与社区并获得宝贵经验的好方法。

<!--
We encourage you to explore the repository and familiarize yourself with the ongoing discussions and projects. 
It's a collaborative environment where you can exchange ideas, ask questions, and work together with other contributors.
-->
我们鼓励你探索存储库并熟悉正在进行的讨论和项目。这是一个协作环境，你可以在这里交流想法、提出问题并与其他贡献者一起工作。

<!--
If you have any questions or need guidance, don't hesitate to reach out to us 
and you can do so on our [public Slack channel](https://kubernetes.slack.com/messages/wg-structured-logging). 
If you're not already part of that Slack workspace, you can visit [https://slack.k8s.io/](https://slack.k8s.io/)
for an invitation.
-->
如果你有任何疑问或需要指导，请随时与我们联系，你可以通过我们的[公共 Slack 频道](https://kubernetes.slack.com/messages/wg-structured-logging)联系我们。
如果你尚未加入 Slack 工作区，可以访问 [https://slack.k8s.io/](https://slack.k8s.io/) 获取邀请。

<!--
We would like to express our gratitude to all the contributors who provided excellent reviews, 
shared valuable insights, and assisted in the implementation of this feature (in alphabetical order):
-->
我们要向所有提供精彩评论、分享宝贵见解并协助实施此功能的贡献者表示感谢（按字母顺序排列）：

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
