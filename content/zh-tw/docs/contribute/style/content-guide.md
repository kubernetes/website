---
title: 文件內容指南
linktitle: 內容指南
content_type: concept
weight: 10
---
<!--
title: Documentation Content Guide
linktitle: Content guide
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This page contains guidelines for Kubernetes documentation.

If you have questions about what's allowed, join the #sig-docs channel in
[Kubernetes Slack](https://slack.k8s.io/) and ask!

You can register for Kubernetes Slack at https://slack.k8s.io/.

For information on creating new content for the Kubernetes
docs, follow the [style guide](/docs/contribute/style/style-guide).
-->
本頁包含 Kubernetes 文件的一些指南。

如果你不清楚哪些事情是可以做的，請加入到
[Kubernetes Slack](https://slack.k8s.io/) 的 `#sig-docs` 頻道提問！
你可以在 https://slack.k8s.io 註冊到 Kubernetes Slack。

關於為 Kubernetes 文件建立新內容的更多資訊，可參考
[樣式指南](/zh-cn/docs/contribute/style/style-guide)。

<!-- body -->

<!--
## Overview

Source for the Kubernetes website, including the docs, resides in the
[kubernetes/website](https://github.com/kubernetes/website) repository.

Located in the `kubernetes/website/content/<language_code>/docs` folder, the
majority of Kubernetes documentation is specific to the [Kubernetes
project](https://github.com/kubernetes/kubernetes).

## What's allowed

Kubernetes docs allow content for third-party projects only when:

- Content documents software in the Kubernetes project
- Content documents software that's out of project but necessary for Kubernetes to function
- Content is canonical on kubernetes.io, or links to canonical content elsewhere
-->
## 概述  {#overview}

Kubernetes 網站（包括其文件）原始碼位於
[kubernetes/website](https://github.com/kubernetes/website) 倉庫中。

在 `kubernetes/website/content/<語言程式碼>/docs` 目錄下, 絕大多數 Kubernetes
文件都是特定於 [Kubernetes 專案](https://github.com/kubernetes/kubernetes)的。

## 可以釋出的內容  {#what-s-allowed}

只有當以下條件滿足時，Kubernetes 文件才允許第三方專案的內容：

- 內容所描述的軟體在 Kubernetes 專案內
- 內容所描述的軟體不在 Kubernetes 專案內，卻是讓 Kubernetes 正常工作所必需的
- 內容是被 kubernetes.io 域名收編的，或者是其他位置的標準典型內容

<!--
### Third party content

Kubernetes documentation includes applied examples of projects in the Kubernetes project&mdash;projects that live in the [kubernetes](https://github.com/kubernetes) and
[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub organizations.

Links to active content in the Kubernetes project are always allowed.

Kubernetes requires some third party content to function. Examples include container runtimes (containerd, CRI-O, Docker),
[networking policy](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (CNI plugins), [Ingress controllers](/docs/concepts/services-networking/ingress-controllers/), and [logging](/docs/concepts/cluster-administration/logging/).

Docs can link to third-party open source software (OSS) outside the Kubernetes project only if it's necessary for Kubernetes to function.
-->
### 第三方內容 {#third-party-content}

Kubernetes 文件包含 Kubernetes 專案下的多個專案的應用示例。
這裡的 Kubernetes 專案指的是 [kubernetes](https://github.com/kubernetes) 和
[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub 組織
下的專案。

連結到 Kubernetes 專案中活躍的內容是一直允許的。

Kubernetes 需要某些第三方內容才能正常工作。例如
容器執行時（containerd、CRI-O、Docker），
[聯網策略](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
（CNI 外掛），[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
以及[日誌](/zh-cn/docs/concepts/cluster-administration/logging/)等。

只有對應的第三方開源軟體（OSS）是執行 Kubernetes 所必需的，才可以在文件中包含
指向這些 Kubernetes 專案之外的軟體的連結。

<!--
### Dual sourced content

Wherever possible, Kubernetes docs link to canonical sources instead of hosting
dual-sourced content.

Dual-sourced content requires double the effort (or more!) to maintain
and grows stale more quickly.

{{< note >}}

If you're a maintainer for a Kubernetes project and need help hosting your own docs,
ask for help in [#sig-docs on Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/).
{{< /note >}}
-->
### 雙重來源的內容  {#dual-sourced-content}

只要有可能，Kubernetes 文件應該指向標準典型的資訊源而不是直接託管多重來源的內容。

雙重來源的內容需要雙倍（甚至更多）的投入才能維護，而且通常很快就會變得停滯不前。

{{< note >}}
如果你是一個 Kubernetes 專案的維護者，需要幫忙託管你的文件，
請在 Kubernetes 的 [#sig-docs 頻道](https://kubernetes.slack.com/messages/C1J0BPD2M/)
提出請求。
{{< /note >}}

<!--
### More information

If you have questions about allowed content, join the [Kubernetes Slack](https://slack.k8s.io/) #sig-docs channel and ask!
-->
### 更多資訊  {#more-information}

如果你對允許出現的內容有疑問，請加入到 [Kubernetes Slack](https://slack.k8s.io/)
的 `#sig-docs` 頻道提問！

## {{% heading "whatsnext" %}}

* 閱讀[樣式指南](/zh-cn/docs/contribute/style/style-guide)。
