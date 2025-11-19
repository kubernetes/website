---
layout: blog
title: "比較本地 Kubernetes 開發工具：Telepresence、Gefyra 和 mirrord"
date: 2023-09-12
slug: local-k8s-development-tools
---
<!--
layout: blog
title: 'Comparing Local Kubernetes Development Tools: Telepresence, Gefyra, and mirrord'
date: 2023-09-12
slug: local-k8s-development-tools
-->

<!--
**Author:** Eyal Bukchin (MetalBear)
-->
**作者:** Eyal Bukchin (MetalBear)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The Kubernetes development cycle is an evolving landscape with a myriad of tools seeking to streamline the process. Each tool has its unique approach, and the choice often comes down to individual project requirements, the team's expertise, and the preferred workflow.
-->
Kubernetes 的開發週期是一個不斷演化的領域，有許多工具在尋求簡化這個過程。
每個工具都有其獨特的方法，具體選擇通常取決於各個項目的要求、團隊的專業知識以及所偏好的工作流。

<!--
Among the various solutions, a category we dubbed “Local K8S Development tools” has emerged, which seeks to enhance the Kubernetes development experience by connecting locally running components to the Kubernetes cluster. This facilitates rapid testing of new code in cloud conditions, circumventing the traditional cycle of Dockerization, CI, and deployment.

In this post, we compare three solutions in this category: Telepresence, Gefyra, and our own contender, mirrord.
-->
在各種解決方案中，我們稱之爲“本地 K8S 開發工具”的一個類別已漸露端倪，
這一類方案通過將本地運行的組件連接到 Kubernetes 集羣來提升 Kubernetes 開發體驗。
這樣可以在雲環境中快速測試新代碼，避開了 Docker 化、CI 和部署這樣的傳統週期。

在本文中，我們將比較這個類別中的三個解決方案：Telepresence、Gefyra 和我們自己的挑戰者 mirrord。

## Telepresence

<!--
The oldest and most well-established solution in the category, [Telepresence](https://www.telepresence.io/) uses a VPN (or more specifically, a `tun` device) to connect the user's machine (or a locally running container) and the cluster's network. It then supports the interception of incoming traffic to a specific service in the cluster, and its redirection to a local port. The traffic being redirected can also be filtered to avoid completely disrupting the remote service. It also offers complementary features to support file access (by locally mounting a volume mounted to a pod) and importing environment variables.
Telepresence requires the installation of a local daemon on the user's machine (which requires root privileges) and a Traffic Manager component on the cluster. Additionally, it runs an Agent as a sidecar on the pod to intercept the desired traffic.
-->
[Telepresence](https://www.telepresence.io/) 是這類工具中最早也最成熟的解決方案，
它使用 VPN（或更具體地說，一個 `tun` 設備）將用戶的機器（或本地運行的容器）與集羣的網絡相連。
它支持攔截髮送到集羣中特定服務的傳入流量，並將其重定向到本地端口。
被重定向的流量還可以被過濾，以避免完全破壞遠程服務。
它還提供了一些補充特性，如支持文件訪問（通過本地掛載卷將其掛載到 Pod 上）和導入環境變量。
Telepresence 需要在用戶的機器上安裝一個本地守護進程（需要 root 權限），並在集羣上運行一個
Traffic Manager 組件。此外，它在 Pod 上以邊車的形式運行一個 Agent 來攔截所需的流量。

## Gefyra

<!--
[Gefyra](https://gefyra.dev/), similar to Telepresence, employs a VPN to connect to the cluster. However, it only supports connecting locally running Docker containers to the cluster. This approach enhances portability across different OSes and local setups. However, the downside is that it does not support natively run uncontainerized code.
-->
[Gefyra](https://gefyra.dev/) 與 Telepresence 類似，也採用 VPN 連接到集羣。
但 Gefyra 只支持將本地運行的 Docker 容器連接到集羣。
這種方法增強了在不同操作系統和本地設置環境之間的可移植性。
然而，它的缺點是不支持原生運行非容器化的代碼。

<!--
Gefyra primarily focuses on network traffic, leaving file access and environment variables unsupported. Unlike Telepresence, it doesn't alter the workloads in the cluster, ensuring a straightforward clean-up process if things go awry.
-->
Gefyra 主要關注網絡流量，不支持文件訪問和環境變量。
與 Telepresence 不同，Gefyra 不會改變集羣中的工作負載，
因此如果發生意外情況，清理過程更加簡單明瞭。

## mirrord

<!--
The newest of the three tools, [mirrord](https://mirrord.dev/) adopts a different approach by injecting itself
into the local binary (utilizing `LD_PRELOAD` on Linux or `DYLD_INSERT_LIBRARIES` on macOS),
and overriding libc function calls, which it then proxies a temporary agent it runs in the cluster.
For example, when the local process tries to read a file mirrord intercepts that call and sends it
to the agent, which then reads the file from the remote pod. This method allows mirrord to cover
all inputs and outputs to the process – covering network access, file access, and
environment variables uniformly.
-->
作爲這三個工具中最新的工具，[mirrord](https://mirrord.dev/)採用了一種不同的方法，
它通過將自身注入到本地二進制文件中（在 Linux 上利用 `LD_PRELOAD`，在 macOS 上利用 `DYLD_INSERT_LIBRARIES`），
並重寫 libc 函數調用，然後代理到在集羣中運行的臨時代理。
例如，當本地進程嘗試讀取一個文件時，mirrord 會攔截該調用並將其發送到該代理，
該代理再從遠程 Pod 讀取文件。這種方法允許 mirrord 覆蓋進程的所有輸入和輸出，統一處理網絡訪問、文件訪問和環境變量。

<!--
By working at the process level, mirrord supports running multiple local processes simultaneously, each in the context of their respective pod in the cluster, without requiring them to be containerized and without needing root permissions on the user’s machine.
-->
通過在進程級別工作，mirrord 支持同時運行多個本地進程，每個進程都在集羣中的相應 Pod 上下文中運行，
無需將這些進程容器化，也無需在用戶機器上獲取 root 權限。

<!--
## Summary
-->
## 摘要   {#summary}

<table>
<!--
<caption>Comparison of Telepresence, Gefyra, and mirrord</caption>
-->
<caption>比較 Telepresence、Gefyra 和 mirrord</caption>
<thead>
<tr>
<td class="empty"></td>
<th>Telepresence</th>
<th>Gefyra</th>
<th>mirrord</th>
</tr>
</thead>
<tbody>
<tr>
<!--
<th scope="row">Cluster connection scope</th>
<td>Entire machine or container</td>
<td>Container</td>
<td>Process</td>
-->
<th scope="row">集羣連接作用域</th>
<td>整臺機器或容器</td>
<td>容器</td>
<td>進程</td>
</tr>
<tr>
<!--
<th scope="row">Developer OS support</th>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows (WSL)</td>
-->
<th scope="row">開發者操作系統支持</th>
<td>Linux、macOS、Windows</td>
<td>Linux、macOS、Windows</td>
<td>Linux、macOS、Windows (WSL)</td>
</tr>
<tr>
<!--
<th scope="row">Incoming traffic features</th>
<td>Interception</td>
<td>Interception</td>
<td>Interception or mirroring</td>
-->
<th scope="row">傳入的流量特性</th>
<td>攔截</td>
<td>攔截</td>
<td>攔截或鏡像</td>
</tr>
<tr>
<!--
<th scope="row">File access</th>
<td>Supported</td>
<td>Unsupported</td>
<td>Supported</td>
-->
<th scope="row">文件訪問</th>
<td>已支持</td>
<td>不支持</td>
<td>已支持</td>
</tr>
<tr>
<!--
<th scope="row">Environment variables</th>
<td>Supported</td>
<td>Unsupported</td>
<td>Supported</td>
-->
<th scope="row">環境變量</th>
<td>已支持</td>
<td>不支持</td>
<td>已支持</td>
</tr>
<tr>
<!--
<th scope="row">Requires local root</th>
<td>Yes</td>
<td>No</td>
<td>No</td>
-->
<th scope="row">需要本地 root</th>
<td>是</td>
<td>否</td>
<td>否</td>
</tr>
<tr>
<!--
<th scope="row">How to use</th>
<td><ul><li>CLI</li><li>Docker Desktop extension</li></ul></td>
<td><ul><li>CLI</li><li>Docker Desktop extension</li></ul></td>
<td><ul><li>CLI</li><li>Visual Studio Code extension</li><li>IntelliJ plugin</li></ul></td>
-->
<th scope="row">如何使用</th>
<td><ul><li>CLI</li><li>Docker Desktop 擴展</li></ul></td>
<td><ul><li>CLI</li><li>Docker Desktop 擴展</li></ul></td>
<td><ul><li>CLI</li><li>Visual Studio Code 擴展</li><li>IntelliJ 插件</li></ul></td>
</tr>
</tbody>
</table>

<!--
## Conclusion

Telepresence, Gefyra, and mirrord each offer unique approaches to streamline the Kubernetes development cycle, each having its strengths and weaknesses. Telepresence is feature-rich but comes with complexities, mirrord offers a seamless experience and supports various functionalities, while Gefyra aims for simplicity and robustness.
-->
## 結論   {#conclusion}

Telepresence、Gefyra 和 mirrord 各自提供了獨特的方法來簡化 Kubernetes 開發週期，
每個工具都有其優缺點。Telepresence 功能豐富但複雜，mirrord 提供無縫體驗並支持各種功能，
而 Gefyra 則追求簡單和穩健。

<!--
Your choice between them should depend on the specific requirements of your project, your team's familiarity with the tools, and the desired development workflow. Whichever tool you choose, we believe the local Kubernetes development approach can provide an easy, effective, and cheap solution to the bottlenecks of the Kubernetes development cycle, and will become even more prevalent as these tools continue to innovate and evolve.
-->
你的選擇應取決於項目的具體要求、團隊對工具的熟悉程度以及所需的開發工作流。
無論你選擇哪個工具，我們相信本地 Kubernetes 開發方法都可以提供一種簡單、有效和低成本的解決方案，
來應對 Kubernetes 開發週期中的瓶頸，並且隨着這些工具的不斷創新和發展，這種本地方法將變得更加普遍。
