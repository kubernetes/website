---
layout: blog
title: "Headlamp AI 助手簡介"
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
**本文是 [Headlamp AI 助手介紹](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant)這篇博客的中文譯稿。**

爲了簡化 Kubernetes 的管理和故障排除，我們非常高興地推出
[Headlamp AI 助手](https://github.com/headlamp-k8s/plugins/tree/main/ai-assistant#readme)：
這是 Headlamp 的一個強大的新插件，可以幫助你更清晰、更輕鬆地理解和操作你的 Kubernetes 集羣和應用程序。

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
無論你是經驗豐富的工程師還是初學者，AI 助手都能提供：
* **快速實現價值**：無需深入瞭解 Kubernetes 知識即可提出問題，例如 “我的應用程序健康嗎？” 或 “我如何修復這個問題？”
* **深入洞察**：從高層次查詢開始，並通過提示深入挖掘，如 “列出所有有問題的 Pod” 或者 “我如何修復這個 Pod？”
* **專注且相關**：根據你在 UI 中查看的內容提問，比如 “這裏有什麼問題？”
* **面向行動**：讓 AI 在獲得你的許可後爲你採取行動，例如 “重啓那個部署”。

<!--
Here is a demo of the AI Assistant in action as it helps troubleshoot an
application running with issues in a Kubernetes cluster:
-->
在這裏，我們展示 AI 助手在 Kubernetes 集羣中處理應用程序問題時的工作方式：

以下是 AI 助手幫助排查 Kubernetes 集羣中運行有問題的應用程序的演示：

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
## 搭上 AI 列車

大型語言模型（LLM）不僅改變了我們訪問數據的方式，也改變了我們與其交互的方式。
像 ChatGPT 這樣的工具的興起開啓了一個充滿可能性的世界，激發了一波新的應用浪潮。
用自然語言提問或給出命令是直觀的，特別是對於非技術用戶而言。現在每個人都可以快速詢問如何做 X 或 Y，
而不會感到尷尬，也不必像以前那樣遍歷一頁又一頁的文檔。

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
因此，Headlamp AI Assistant 將對話式 UI 帶入 [Headlamp](https://headlamp.dev)，
由 LLM 驅動，Headlamp 用戶可以使用自己的 API 密鑰進行配置。它作爲一個 Headlamp 插件提供，
易於集成到你的現有設置中。用戶可以通過安裝插件並用自己的 LLM API 密鑰進行配置來啓用它，
這使他們能夠控制哪個模型爲助手提供動力。一旦啓用，助手就會成爲 Headlamp UI 的一部分，
準備好響應上下文查詢，並直接從界面執行操作。

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

正如預期的那樣，AI 助手專注於幫助用戶理解 Kubernetes 概念。然而，儘管從
Headlamp 的 UI 回答與 Kubernetes 相關的問題有很多價值，
但我們認爲這種集成的最大好處在於它能夠使用用戶在應用程序中體驗到的上下文信息。
因此，Headlamp AI 助手知道你當前在 Headlamp 中查看的內容，
這讓交互感覺更像是在與人類助手一起工作。

<!--
For example, if a pod is failing, users can simply ask _"What's wrong here?"_
and the AI Assistant will respond with the root cause, like a missing
environment variable or a typo in the image name. Follow-up prompts like
_"How can I fix this?"_ allow the AI Assistant to suggest a fix, streamlining
what used to take multiple steps into a quick, conversational flow.

Sharing the context from Headlamp is not a trivial task though, so it's
something we will keep working on perfecting.
-->
例如，如果一個 Pod 出現故障，用戶只需問 **“這裏出了什麼問題？”**，
AI 助手就會回答根本原因，如缺少環境變量或鏡像名稱中的拼寫錯誤。
後續的問題如 **“我該如何修復？”** 能讓 AI 助手建議一個解決方案，
將原本需要多個步驟的過程簡化爲快速的對話流。

然而，從 Headlamp 共享上下文並非易事，因此這是我們將會繼續努力完善的工作。

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

UI 中的上下文很有幫助，但有時還需要額外的功能。如果用戶正在查看 Pod 列表並想要識別有問題的 Deployment，
切換視圖不應是必要的。爲此，AI 助手包含了對 Kubernetes 工具的支持。
這允許提出諸如 **“獲取所有有問題的 Deployment”** 的問題，促使助手從當前集羣中獲取並顯示相關數據。
同樣，如果用戶在 AI 指出哪個部署需要重啓後請求執行類似 **“重啓那個 Deployment”** 的操作，
它也可以做到。對於寫操作，AI 助手確實會向用戶檢查是否獲得運行權限。

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

儘管 AI 助手的初始版本已經對 Kubernetes 用戶很有用，但未來的迭代將進一步擴展其功能。
目前，助手僅支持 Kubernetes 工具，但與 Headlamp 插件的進一步集成正在進行中。
類似於，通過 Flux 插件我們可以獲得更豐富的 GitOps 見解、通過 Prometheus 進行監控、
使用 Helm 進行包管理等。

隨着 MCP 的流行度增長，我們也在研究如何以更即插即用的方式集成它。

<!--
## Try it out!

We hope this first version of the AI Assistant helps users manage Kubernetes
clusters more effectively and assist newcomers in navigating the learning
curve. We invite you to try out this early version and give us your feedback.
The AI Assistant plugin can be installed from Headlamp's Plugin Catalog in the
desktop version, or by using the container image when deploying Headlamp.
Stay tuned for the future versions of the Headlamp AI Assistant!
-->
## 試用一下！

我們希望 AI 助手的第一個版本能夠幫助用戶更有效地管理 Kubernetes 集羣，
並幫助新用戶應對學習曲線。我們邀請你試用這個早期版本，並向我們提供反饋。
AI 助手插件可以從桌面版的 Headlamp 插件目錄中安裝，或者在部署 Headlamp 時使用容器鏡像安裝。
敬請期待 Headlamp AI 助手的未來版本！
