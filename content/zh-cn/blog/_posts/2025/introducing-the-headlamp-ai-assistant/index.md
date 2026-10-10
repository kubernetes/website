---
layout: blog
title: "Headlamp AI 助手简介"
date: 2025-08-07T20:00:00+01:00
slug: introducing-headlamp-ai-assistant
author: >
  Joaquim Rocha (Microsoft)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Introducing Headlamp AI Assistant"
date: 2025-08-07T20:00:00+01:00
slug: introducing-headlamp-ai-assistant
author: >
  Joaquim Rocha (Microsoft)
canonicalUrl: "https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant"
-->

<!--
_This announcement originally [appeared](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant) on the Headlamp blog._

To simplify Kubernetes management and troubleshooting, we're thrilled to
introduce [Headlamp AI Assistant](https://github.com/headlamp-k8s/plugins/tree/main/ai-assistant#readme): a powerful new plugin for Headlamp that helps
you understand and operate your Kubernetes clusters and applications with
greater clarity and ease.
-->
**本文是 [Headlamp AI 助手介绍](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant)这篇博客的中文译稿。**

为了简化 Kubernetes 的管理和故障排除，我们非常高兴地推出
[Headlamp AI 助手](https://github.com/headlamp-k8s/plugins/tree/main/ai-assistant#readme)：
这是 Headlamp 的一个强大的新插件，可以帮助你更清晰、更轻松地理解和操作你的 Kubernetes 集群和应用程序。

<!--
Whether you're a seasoned engineer or just getting started, the AI Assistant offers:
* **Fast time to value:** Ask questions like _"Is my application healthy?"_ or
  _"How can I fix this?"_ without needing deep Kubernetes knowledge.
* **Deep insights:** Start with high-level queries and dig deeper with prompts
  like _"List all the problematic pods"_ or _"How can I fix this pod?"_
* **Focused & relevant:** Ask questions in the context of what you're viewing
  in the UI, such as _"What's wrong here?"_
* **Action-oriented:** Let the AI take action for you, like _"Restart that
  deployment"_, with your permission.
-->
无论你是经验丰富的工程师还是初学者，AI 助手都能提供：
* **快速实现价值**：无需深入了解 Kubernetes 知识即可提出问题，例如 “我的应用程序健康吗？” 或 “我如何修复这个问题？”
* **深入洞察**：从高层次查询开始，并通过提示深入挖掘，如 “列出所有有问题的 Pod” 或者 “我如何修复这个 Pod？”
* **专注且相关**：根据你在 UI 中查看的内容提问，比如 “这里有什么问题？”
* **面向行动**：让 AI 在获得你的许可后为你采取行动，例如 “重启那个部署”。

<!--
Here is a demo of the AI Assistant in action as it helps troubleshoot an
application running with issues in a Kubernetes cluster:
-->
在这里，我们展示 AI 助手在 Kubernetes 集群中处理应用程序问题时的工作方式：

以下是 AI 助手帮助排查 Kubernetes 集群中运行有问题的应用程序的演示：

{{< youtube id="GzXkUuCTcd4" title="Headlamp AI Assistant" class="youtube-quote-sm" >}}

<!--
## Hopping on the AI train

Large Language Models (LLMs) have transformed not just how we access data but
also how we interact with it. The rise of tools like ChatGPT opened a world of
possibilities, inspiring a wave of new applications. Asking questions or giving
commands in natural language is intuitive, especially for users who aren't deeply
technical. Now everyone can quickly ask how to do X or Y, without feeling awkward
or having to traverse pages and pages of documentation like before.
-->
## 搭上 AI 列车

大型语言模型（LLM）不仅改变了我们访问数据的方式，也改变了我们与其交互的方式。
像 ChatGPT 这样的工具的兴起开启了一个充满可能性的世界，激发了一波新的应用浪潮。
用自然语言提问或给出命令是直观的，特别是对于非技术用户而言。现在每个人都可以快速询问如何做 X 或 Y，
而不会感到尴尬，也不必像以前那样遍历一页又一页的文档。

<!--
Therefore, Headlamp AI Assistant brings a conversational UI to [Headlamp](https://headlamp.dev),
powered by LLMs that Headlamp users can configure with their own API keys.
It is available as a Headlamp plugin, making it easy to integrate into your
existing setup. Users can enable it by installing the plugin and configuring
it with their own LLM API keys, giving them control over which model powers
the assistant. Once enabled, the assistant becomes part of the Headlamp UI,
ready to respond to contextual queries and perform actions directly from the
interface.
-->
因此，Headlamp AI Assistant 将对话式 UI 带入 [Headlamp](https://headlamp.dev)，
由 LLM 驱动，Headlamp 用户可以使用自己的 API 密钥进行配置。它作为一个 Headlamp 插件提供，
易于集成到你的现有设置中。用户可以通过安装插件并用自己的 LLM API 密钥进行配置来启用它，
这使他们能够控制哪个模型为助手提供动力。一旦启用，助手就会成为 Headlamp UI 的一部分，
准备好响应上下文查询，并直接从界面执行操作。

<!--
## Context is everything

As expected, the AI Assistant is focused on helping users with Kubernetes
concepts. Yet, while there is a lot of value in responding to Kubernetes
related questions from Headlamp's UI, we believe that the great benefit of such
an integration is when it can use the context of what the user is experiencing
in an application. So, the Headlamp AI Assistant knows what you're currently
viewing in Headlamp, and this makes the interaction feel more like working
with a human assistant.
-->
## 上下文就是一切

正如预期的那样，AI 助手专注于帮助用户理解 Kubernetes 概念。然而，尽管从
Headlamp 的 UI 回答与 Kubernetes 相关的问题有很多价值，
但我们认为这种集成的最大好处在于它能够使用用户在应用程序中体验到的上下文信息。
因此，Headlamp AI 助手知道你当前在 Headlamp 中查看的内容，
这让交互感觉更像是在与人类助手一起工作。

<!--
For example, if a pod is failing, users can simply ask _"What's wrong here?"_
and the AI Assistant will respond with the root cause, like a missing
environment variable or a typo in the image name. Follow-up prompts like
_"How can I fix this?"_ allow the AI Assistant to suggest a fix, streamlining
what used to take multiple steps into a quick, conversational flow.

Sharing the context from Headlamp is not a trivial task though, so it's
something we will keep working on perfecting.
-->
例如，如果一个 Pod 出现故障，用户只需问 **“这里出了什么问题？”**，
AI 助手就会回答根本原因，如缺少环境变量或镜像名称中的拼写错误。
后续的问题如 **“我该如何修复？”** 能让 AI 助手建议一个解决方案，
将原本需要多个步骤的过程简化为快速的对话流。

然而，从 Headlamp 共享上下文并非易事，因此这是我们将会继续努力完善的工作。

<!--
## Tools

Context from the UI is helpful, but sometimes additional capabilities are
needed. If the user is viewing the pod list and wants to identify problematic
deployments, switching views should not be necessary. To address this, the AI
Assistant includes support for a Kubernetes tool. This allows asking questions
like "Get me all deployments with problems" prompting the assistant to fetch
and display relevant data from the current cluster. Likewise, if the user
requests an action like "Restart that deployment" after the AI points out what
deployment needs restarting, it can also do that. In case of "write"
operations, the AI Assistant does check with the user for permission to run them.
-->
## 工具

UI 中的上下文很有帮助，但有时还需要额外的功能。如果用户正在查看 Pod 列表并想要识别有问题的 Deployment，
切换视图不应是必要的。为此，AI 助手包含了对 Kubernetes 工具的支持。
这允许提出诸如 **“获取所有有问题的 Deployment”** 的问题，促使助手从当前集群中获取并显示相关数据。
同样，如果用户在 AI 指出哪个部署需要重启后请求执行类似 **“重启那个 Deployment”** 的操作，
它也可以做到。对于写操作，AI 助手确实会向用户检查是否获得运行权限。

<!--
## AI Plugins

Although the initial version of the AI Assistant is already useful for
Kubernetes users, future iterations will expand its capabilities. Currently,
the assistant supports only the Kubernetes tool, but further integration with
Headlamp plugins is underway. Similarly, we could get richer insights for
GitOps via the Flux plugin, monitoring through Prometheus, package management
with Helm, and more.

And of course, as the popularity of MCP grows, we are looking into how to
integrate it as well, for a more plug-and-play fashion.
-->
## AI 插件

尽管 AI 助手的初始版本已经对 Kubernetes 用户很有用，但未来的迭代将进一步扩展其功能。
目前，助手仅支持 Kubernetes 工具，但与 Headlamp 插件的进一步集成正在进行中。
类似于，通过 Flux 插件我们可以获得更丰富的 GitOps 见解、通过 Prometheus 进行监控、
使用 Helm 进行包管理等。

随着 MCP 的流行度增长，我们也在研究如何以更即插即用的方式集成它。

<!--
## Try it out!

We hope this first version of the AI Assistant helps users manage Kubernetes
clusters more effectively and assist newcomers in navigating the learning
curve. We invite you to try out this early version and give us your feedback.
The AI Assistant plugin can be installed from Headlamp's Plugin Catalog in the
desktop version, or by using the container image when deploying Headlamp.
Stay tuned for the future versions of the Headlamp AI Assistant!
-->
## 试用一下！

我们希望 AI 助手的第一个版本能够帮助用户更有效地管理 Kubernetes 集群，
并帮助新用户应对学习曲线。我们邀请你试用这个早期版本，并向我们提供反馈。
AI 助手插件可以从桌面版的 Headlamp 插件目录中安装，或者在部署 Headlamp 时使用容器镜像安装。
敬请期待 Headlamp AI 助手的未来版本！
