---
title: 監控、日誌和調試
description: 設置監控和日誌記錄以對叢集進行故障排除或調試容器化應用程式。
weight: 40
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: 尋求幫助
---
<!--
title: "Monitoring, Logging, and Debugging"
description: Set up monitoring and logging to troubleshoot a cluster, or debug a containerized application.
weight: 40
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Getting help
-->

<!-- overview -->

<!--
Sometimes things go wrong. This guide helps you gather the relevant information and resolve issues. It has four sections:
-->
有時候事情會出錯。本指南可幫助你收集相關資訊並解決這些問題。它包含兩個部分：

<!--
* [Debugging your application](/docs/tasks/debug/debug-application/) - Useful
  for users who are deploying code into Kubernetes and wondering why it is not working.
* [Debugging your cluster](/docs/tasks/debug/debug-cluster/) - Useful
  for cluster administrators and operators troubleshooting issues with the Kubernetes cluster itself.
* [Logging in Kubernetes](/docs/tasks/debug/logging/) - Useful
  for cluster administrators who want to set up and manage logging in Kubernetes.
* [Monitoring in Kubernetes](/docs/tasks/debug/monitoring/) - Useful
  for cluster administrators who want to enable monitoring in a Kubernetes cluster.
-->
* [應用排錯](/zh-cn/docs/tasks/debug/debug-application/) -
  針對部署代碼到 Kubernetes 並想知道代碼爲什麼不能正常運行的使用者。
* [叢集排錯](/zh-cn/docs/tasks/debug/debug-cluster/) -
  供叢集管理員和操作員解決 Kubernetes 叢集本身的問題。
* [日誌記錄](/zh-cn/docs/tasks/debug/logging/) -
  針對想要在 Kubernetes 中設置和管理日誌記錄的叢集管理員。
* [監控](/zh-cn/docs/tasks/debug/monitoring/) -
  針對想要在 Kubernetes 叢集中啓用監控的叢集管理員。

<!--
You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.
-->
你也應該查看所用[發行版本](https://github.com/kubernetes/kubernetes/releases)的已知問題。

<!-- body -->

<!--
## Getting help

If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes team.
-->
## 獲取幫助  {#getting-help}

如果你的問題在上述指南中沒有得到答案，你還有另外幾種方式從 Kubernetes 團隊獲得幫助。

<!--
### Questions

The documentation on this site has been structured to provide answers to a wide
range of questions. [Concepts](/docs/concepts/) explain the Kubernetes
architecture and how each component works, while [Setup](/docs/setup/) provides
practical instructions for getting started. [Tasks](/docs/tasks/) show how to
accomplish commonly used tasks, and [Tutorials](/docs/tutorials/) are more
comprehensive walkthroughs of real-world, industry-specific, or end-to-end
development scenarios. The [Reference](/docs/reference/) section provides
detailed documentation on the [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
and command-line interfaces (CLIs), such as [`kubectl`](/docs/reference/kubectl/).
-->
### 問題  {#questions}

本網站上的文檔針對回答各類問題進行了結構化組織和分類。
[概念](/zh-cn/docs/concepts/)部分解釋 Kubernetes 體系結構以及每個組件的工作方式，
[安裝](/zh-cn/docs/setup/)部分提供了安裝的實用說明。
[任務](/zh-cn/docs/tasks/)部分展示瞭如何完成常用任務，
[教程](/zh-cn/docs/tutorials/)部分則提供對現實世界、特定行業或端到端開發場景的更全面的演練。
[參考](/zh-cn/docs/reference/)部分提供了詳細的
[Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 文檔
和命令列 (CLI) 介面的文檔，例如[`kubectl`](/zh-cn/docs/reference/kubectl/)。

<!--
## Help! My question isn't covered!  I need help now!
-->
## 求救！我的問題還沒有解決！我現在需要幫助！

<!--
### Stack Exchange, Stack Overflow, or Server Fault {#stack-exchange}

If you have questions related to *software development* for your containerized app,
you can ask those on [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

If you have Kubernetes questions related to *cluster management* or *configuration*,
you can ask those on
[Server Fault](https://serverfault.com/questions/tagged/kubernetes).
-->
### Stack Exchange、Stack Overflow 或 Server Fault {#stack-exchange}

若你對容器化應用有**軟體開發**相關的疑問，你可以在
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 上詢問。

若你有**叢集管理**或**設定**相關的疑問，你可以在
[Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上詢問。

<!--
There are also several more specific Stack Exchange network sites which might
be the right place to ask Kubernetes questions in areas such as
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), 
[Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes),
or [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Someone else from the community may have already asked a similar question or 
may be able to help with your problem.
-->
還有幾個更專業的 Stack Exchange 網站，很適合在這些地方詢問有關
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes)、
[軟體工程](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes)或[資訊安全 (InfoSec)](https://security.stackexchange.com/questions/tagged/kubernetes)
領域中 Kubernetes 的問題。

社區中的其他人可能已經問過和你類似的問題，也可能能夠幫助解決你的問題。

<!--
The Kubernetes team will also monitor
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, **please ensure that your question 
is [on-topic on Stack Overflow](https://stackoverflow.com/help/on-topic),
[Server Fault](https://serverfault.com/help/on-topic), or the Stack Exchange 
Network site you're asking on**, and read through the guidance on 
[how to ask a new question](https://stackoverflow.com/help/how-to-ask),
before asking a new one!
-->
Kubernetes 團隊還會監視[帶有 Kubernetes 標籤的帖子](https://stackoverflow.com/questions/tagged/kubernetes)。
如果現有的問題對你沒有幫助，**請在問一個新問題之前，確保你的問題切合
[Stack Overflow](https://stackoverflow.com/help/on-topic)、
[Server Fault](https://serverfault.com/help/on-topic) 或 Stack Exchange 的主題**，
並通讀[如何提出新問題](https://stackoverflow.com/help/how-to-ask)的指導說明！

<!--
### Slack

Many people from the Kubernetes community hang out on Kubernetes Slack in the `#kubernetes-users` channel.
Slack requires registration; you can [request an invitation](https://slack.kubernetes.io),
and registration is open to everyone). Feel free to come and ask any and all questions.
Once registered, access the [Kubernetes organisation in Slack](https://kubernetes.slack.com)
via your web browser or via Slack's own dedicated app.
-->
### Slack

Kubernetes 社區中有很多人在 `#kubernetes-users` 這一 Slack 頻道聚集。
Slack 需要註冊；你可以[請求一份邀請](https://slack.kubernetes.io)，
並且註冊是對所有人開放的。歡迎你隨時來問任何問題。
一旦註冊了，就可以訪問通過 Web 瀏覽器或者 Slack 專用的應用訪問
[Slack 上的 Kubernetes 組織](https://kubernetes.slack.com)。

<!--
Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors) channel.
-->
一旦你完成了註冊，就可以瀏覽各種感興趣主題的頻道列表（一直在增長）。
例如，Kubernetes 新人可能還想加入
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice)
頻道。又比如，開發人員應該加入
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors)
頻道。

<!--
There are also many country specific/local language channels. Feel free to join
these channels for localized support and info:
-->
還有許多國家/地區語言頻道。請隨時加入這些頻道以獲得本地化支持和資訊：

{{< table caption="Country / language specific Slack channels" >}}
<!--
Country | Channels
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
-->
國家   | 頻道
:------|:------------
中國   | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users)、[`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
芬蘭   | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
法國   | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users)、[`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
德國   | [`#de-users`](https://kubernetes.slack.com/messages/de-users)、[`#de-events`](https://kubernetes.slack.com/messages/de-events)
印度   | [`#in-users`](https://kubernetes.slack.com/messages/in-users)、[`#in-events`](https://kubernetes.slack.com/messages/in-events)
意大利 | [`#it-users`](https://kubernetes.slack.com/messages/it-users)、[`#it-events`](https://kubernetes.slack.com/messages/it-events)
日本   | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users)、[`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
韓國   | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
荷蘭   | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
挪威   | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
波蘭   | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
俄羅斯 | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
西班牙 | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
瑞典   | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
土耳其 | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users)、[`#tr-events`](https://kubernetes.slack.com/messages/tr-events)

{{< /table >}}

<!--
### Forum

You're welcome to join the official Kubernetes Forum: [discuss.kubernetes.io](https://discuss.kubernetes.io).
-->
### 論壇  {#forum}

歡迎你加入 Kubernetes 官方論壇
[discuss.kubernetes.io](https://discuss.kubernetes.io)。

<!--
### Bugs and Feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues).
-->
### Bug 和功能請求   {#bugs-and-feature-requests}

如果你發現一個看起來像 Bug 的問題，或者你想提出一個功能請求，請使用
[GitHub 問題跟蹤系統](https://github.com/kubernetes/kubernetes/issues)。

<!--
Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:
-->
在提交問題之前，請搜索現有問題列表以查看是否其中已涵蓋你的問題。

如果提交 Bug，請提供如何重現問題的詳細資訊，例如：

<!--
* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem
-->
* Kubernetes 版本：`kubectl version`
* 雲平臺、OS 發行版、網路設定和 Docker 版本
* 重現問題的步驟
