---
layout: blog
title: "比较本地 Kubernetes 开发工具：Telepresence、Gefyra 和 mirrord"
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

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The Kubernetes development cycle is an evolving landscape with a myriad of tools seeking to streamline the process. Each tool has its unique approach, and the choice often comes down to individual project requirements, the team's expertise, and the preferred workflow.
-->
Kubernetes 的开发周期是一个不断演化的领域，有许多工具在寻求简化这个过程。
每个工具都有其独特的方法，具体选择通常取决于各个项目的要求、团队的专业知识以及所偏好的工作流。

<!--
Among the various solutions, a category we dubbed “Local K8S Development tools” has emerged, which seeks to enhance the Kubernetes development experience by connecting locally running components to the Kubernetes cluster. This facilitates rapid testing of new code in cloud conditions, circumventing the traditional cycle of Dockerization, CI, and deployment.

In this post, we compare three solutions in this category: Telepresence, Gefyra, and our own contender, mirrord.
-->
在各种解决方案中，我们称之为“本地 K8S 开发工具”的一个类别已渐露端倪，
这一类方案通过将本地运行的组件连接到 Kubernetes 集群来提升 Kubernetes 开发体验。
这样可以在云环境中快速测试新代码，避开了 Docker 化、CI 和部署这样的传统周期。

在本文中，我们将比较这个类别中的三个解决方案：Telepresence、Gefyra 和我们自己的挑战者 mirrord。

## Telepresence

<!--
The oldest and most well-established solution in the category, [Telepresence](https://www.telepresence.io/) uses a VPN (or more specifically, a `tun` device) to connect the user's machine (or a locally running container) and the cluster's network. It then supports the interception of incoming traffic to a specific service in the cluster, and its redirection to a local port. The traffic being redirected can also be filtered to avoid completely disrupting the remote service. It also offers complementary features to support file access (by locally mounting a volume mounted to a pod) and importing environment variables.
Telepresence requires the installation of a local daemon on the user's machine (which requires root privileges) and a Traffic Manager component on the cluster. Additionally, it runs an Agent as a sidecar on the pod to intercept the desired traffic.
-->
[Telepresence](https://www.telepresence.io/) 是这类工具中最早也最成熟的解决方案，
它使用 VPN（或更具体地说，一个 `tun` 设备）将用户的机器（或本地运行的容器）与集群的网络相连。
它支持拦截发送到集群中特定服务的传入流量，并将其重定向到本地端口。
被重定向的流量还可以被过滤，以避免完全破坏远程服务。
它还提供了一些补充特性，如支持文件访问（通过本地挂载卷将其挂载到 Pod 上）和导入环境变量。
Telepresence 需要在用户的机器上安装一个本地守护进程（需要 root 权限），并在集群上运行一个
Traffic Manager 组件。此外，它在 Pod 上以边车的形式运行一个 Agent 来拦截所需的流量。

## Gefyra

<!--
[Gefyra](https://gefyra.dev/), similar to Telepresence, employs a VPN to connect to the cluster. However, it only supports connecting locally running Docker containers to the cluster. This approach enhances portability across different OSes and local setups. However, the downside is that it does not support natively run uncontainerized code.
-->
[Gefyra](https://gefyra.dev/) 与 Telepresence 类似，也采用 VPN 连接到集群。
但 Gefyra 只支持将本地运行的 Docker 容器连接到集群。
这种方法增强了在不同操作系统和本地设置环境之间的可移植性。
然而，它的缺点是不支持原生运行非容器化的代码。

<!--
Gefyra primarily focuses on network traffic, leaving file access and environment variables unsupported. Unlike Telepresence, it doesn't alter the workloads in the cluster, ensuring a straightforward clean-up process if things go awry.
-->
Gefyra 主要关注网络流量，不支持文件访问和环境变量。
与 Telepresence 不同，Gefyra 不会改变集群中的工作负载，
因此如果发生意外情况，清理过程更加简单明了。

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
作为这三个工具中最新的工具，[mirrord](https://mirrord.dev/)采用了一种不同的方法，
它通过将自身注入到本地二进制文件中（在 Linux 上利用 `LD_PRELOAD`，在 macOS 上利用 `DYLD_INSERT_LIBRARIES`），
并重写 libc 函数调用，然后代理到在集群中运行的临时代理。
例如，当本地进程尝试读取一个文件时，mirrord 会拦截该调用并将其发送到该代理，
该代理再从远程 Pod 读取文件。这种方法允许 mirrord 覆盖进程的所有输入和输出，统一处理网络访问、文件访问和环境变量。

<!--
By working at the process level, mirrord supports running multiple local processes simultaneously, each in the context of their respective pod in the cluster, without requiring them to be containerized and without needing root permissions on the user’s machine.
-->
通过在进程级别工作，mirrord 支持同时运行多个本地进程，每个进程都在集群中的相应 Pod 上下文中运行，
无需将这些进程容器化，也无需在用户机器上获取 root 权限。

<!--
## Summary
-->
## 摘要   {#summary}

<table>
<!--
<caption>Comparison of Telepresence, Gefyra, and mirrord</caption>
-->
<caption>比较 Telepresence、Gefyra 和 mirrord</caption>
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
<th scope="row">集群连接作用域</th>
<td>整台机器或容器</td>
<td>容器</td>
<td>进程</td>
</tr>
<tr>
<!--
<th scope="row">Developer OS support</th>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows (WSL)</td>
-->
<th scope="row">开发者操作系统支持</th>
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
<th scope="row">传入的流量特性</th>
<td>拦截</td>
<td>拦截</td>
<td>拦截或镜像</td>
</tr>
<tr>
<!--
<th scope="row">File access</th>
<td>Supported</td>
<td>Unsupported</td>
<td>Supported</td>
-->
<th scope="row">文件访问</th>
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
<th scope="row">环境变量</th>
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
<td><ul><li>CLI</li><li>Docker Desktop 扩展</li></ul></td>
<td><ul><li>CLI</li><li>Docker Desktop 扩展</li></ul></td>
<td><ul><li>CLI</li><li>Visual Studio Code 扩展</li><li>IntelliJ 插件</li></ul></td>
</tr>
</tbody>
</table>

<!--
## Conclusion

Telepresence, Gefyra, and mirrord each offer unique approaches to streamline the Kubernetes development cycle, each having its strengths and weaknesses. Telepresence is feature-rich but comes with complexities, mirrord offers a seamless experience and supports various functionalities, while Gefyra aims for simplicity and robustness.
-->
## 结论   {#conclusion}

Telepresence、Gefyra 和 mirrord 各自提供了独特的方法来简化 Kubernetes 开发周期，
每个工具都有其优缺点。Telepresence 功能丰富但复杂，mirrord 提供无缝体验并支持各种功能，
而 Gefyra 则追求简单和稳健。

<!--
Your choice between them should depend on the specific requirements of your project, your team's familiarity with the tools, and the desired development workflow. Whichever tool you choose, we believe the local Kubernetes development approach can provide an easy, effective, and cheap solution to the bottlenecks of the Kubernetes development cycle, and will become even more prevalent as these tools continue to innovate and evolve.
-->
你的选择应取决于项目的具体要求、团队对工具的熟悉程度以及所需的开发工作流。
无论你选择哪个工具，我们相信本地 Kubernetes 开发方法都可以提供一种简单、有效和低成本的解决方案，
来应对 Kubernetes 开发周期中的瓶颈，并且随着这些工具的不断创新和发展，这种本地方法将变得更加普遍。
