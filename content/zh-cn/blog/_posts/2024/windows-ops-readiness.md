---
layout: blog
title: "Windows 操作就绪规范简介"
date: 2024-04-03
slug: intro-windows-ops-readiness
author: >
  Jay Vyas (Tesla),
  Amim Knabben (Broadcom),
  Tatenda Zifudzi (AWS)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---
<!--
layout: blog
title: "Introducing the Windows Operational Readiness Specification"
date: 2024-04-03
slug: intro-windows-ops-readiness
author: >
  Jay Vyas (Tesla),
  Amim Knabben (Broadcom),
  Tatenda Zifudzi (AWS)
-->

<!--
Since Windows support [graduated to stable](/blog/2019/03/25/kubernetes-1-14-release-announcement/)
with Kubernetes 1.14 in 2019, the capability to run Windows workloads has been much
appreciated by the end user community. The level of and availability of Windows workload
support has consistently been a major differentiator for Kubernetes distributions used by
large enterprises. However, with more Windows workloads being migrated to Kubernetes
and new Windows features being continuously released, it became challenging to test
Windows worker nodes in an effective and standardized way.
-->
自从 2019 年 Kubernetes 1.14 将对 Windows
的支持[升级为稳定版](/zh-cn/blog/2019/03/25/kubernetes-1-14-release-announcement/)以来，
能够运行 Windows 工作负载的能力一直深受最终用户社区的认可。对于大型企业来说，
对 Windows 工作负载支持的水平和可用性一直是各大企业选择 Kubernetes 发行版的重要差异化因素。
然而，随着越来越多的 Windows 工作负载迁移到 Kubernetes，以及新的 Windows 特性不断发布，
要高效且标准化地测试 Windows 工作节点变得越来越具有挑战性。

<!--
The Kubernetes project values the ability to certify conformance without requiring a 
closed-source license for a certified distribution or service that has no intention 
of offering Windows.

Some notable examples brought to the attention of SIG Windows were:
-->
对于那些无意提供 Windows 支持的、经过认证的发行版或服务，
Kubernetes 项目非常重视它们无需闭源许可证即可通过一致性认证的能力。

一些引起 SIG Windows 注意的典型示例包括：

<!--
- An issue with load balancer source address ranges functionality not operating correctly on
  Windows nodes, detailed in a GitHub issue:
  [kubernetes/kubernetes#120033](https://github.com/kubernetes/kubernetes/issues/120033).
- Reports of functionality issues with Windows features, such as
  “[GMSA](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) not working with containerd,
  discussed in [microsoft/Windows-Containers#44](https://github.com/microsoft/Windows-Containers/issues/44).
- Challenges developing networking policy tests that could objectively evaluate
  Container Network Interface (CNI) plugins across different operating system configurations,
  as discussed in [kubernetes/kubernetes#97751](https://github.com/kubernetes/kubernetes/issues/97751).
-->
- 负载均衡器源地址范围功能在 Windows 节点上无法正常运行的问题，详情见 GitHub 讨论：
  [kubernetes/kubernetes#120033](https://github.com/kubernetes/kubernetes/issues/120033)。
- 有关 Windows 功能异常的报告，例如
  “[GMSA](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)
  无法与 containerd 协同工作”，相关讨论见
  [microsoft/Windows-Containers#44](https://github.com/microsoft/Windows-Containers/issues/44)。
- 在开发网络策略测试时遇到的挑战，这类测试需要能够在不同操作系统配置下客观评估容器网络接口
  （CNI）插件，相关讨论见[kubernetes/kubernetes#97751](https://github.com/kubernetes/kubernetes/issues/97751)。  

<!--
SIG Windows therefore recognized the need for a tailored solution to ensure Windows
nodes' operational readiness *before* their deployment into production environments.
Thus, the idea to develop a [Windows Operational Readiness Specification](https://kep.k8s.io/2578)
was born.
-->
因此，SIG Windows 认识到需要一个定制化的解决方案，以确保 Windows
节点在进入生产环境**之前** 就达到操作就绪状态。 于是，
[Windows 操作就绪规范](https://kep.k8s.io/2578)的想法就此产生。

<!--
## Can’t we just run the official Conformance tests?

The Kubernetes project contains a set of [conformance tests](https://www.cncf.io/training/certification/software-conformance/#how), 
which are standardized tests designed to ensure that a Kubernetes cluster meets 
the required Kubernetes specifications.
-->
## 我们不能直接运行官方的一致性测试吗？   {#cant-we-just-run-the-official-conformance-tests}

Kubernetes 项目中提供了一套[一致性测试](https://www.cncf.io/training/certification/software-conformance/#how)，
这是一套标准化测试，旨在确保 Kubernetes 集群满足规定的 Kubernetes 规范。

<!--
However, these tests were originally defined at a time when Linux was the *only* 
operating system compatible with Kubernetes, and thus, they were not easily 
extendable for use with Windows. Given that Windows workloads, despite their 
importance, account for a smaller portion of the Kubernetes community, it was 
important to ensure that the primary conformance suite relied upon by many 
Kubernetes distributions to certify Linux conformance, didn't become encumbered 
with Windows specific features or enhancements such as GMSA or multi-operating 
system kube-proxy behavior.
-->
然而，这些测试最初设计时，Linux 是 **唯一** 与 Kubernetes 兼容的操作系统，
因此很难直接扩展应用于 Windows。虽然 Windows 工作负载十分重要，
但它在 Kubernetes 社区中只占较小的份额。因此必须确保主要的一致性测试套件
不会因为 Windows 特定功能或增强（例如 GMSA 或跨操作系统的 kube-proxy 行为）而变得负担过重，
许多 Kubernetes 发行版依赖它来认证 Linux 的一致性。

<!--
Therefore, since there was a specialized need for Windows conformance testing, 
SIG Windows went down the path of offering Windows specific conformance tests 
through the Windows Operational Readiness Specification.

## Can’t we just run the Kubernetes end-to-end test suite?
-->
因此，由于对 Windows 一致性测试有特殊需求，SIG Windows 走上了通过 Windows 操作就绪规范提供
特定于 Windows 的一致性测试的路线。

## 难道我们不能只运行 Kubernetes 的端到端测试套件吗？   {#cant-we-just-run-the-kubernetes-end-to-end-test-suite}  

<!--
In the Linux world, tools such as [Sonobuoy](https://sonobuoy.io/) simplify execution of the 
conformance suite, relieving users from needing to be aware of Kubernetes' 
compilation paths or the semantics of [Ginkgo](https://onsi.github.io/ginkgo) tags.
-->
在 Linux 生态中，[Sonobuoy](https://sonobuoy.io/) 这样的工具简化了一致性测试套件的执行，
使用户无需了解 Kubernetes 的编译路径或 [Ginkgo](https://onsi.github.io/ginkgo) 标签的语义。

<!--
Regarding needing to compile the Kubernetes tests, we realized that Windows 
users might similarly find the process of compiling and running the Kubernetes 
e2e suite from scratch similarly undesirable, hence, there was a clear need to 
provide a user-friendly, "push-button" solution that is ready to go. Moreover, 
regarding Ginkgo tags, applying conformance tests to Windows nodes through a set 
of [Ginkgo](https://onsi.github.io/ginkgo/) tags would also be burdensome for 
any user, including Linux enthusiasts or experienced Windows system admins alike.
-->
在需要编译 Kubernetes 测试这件事上，我们意识到 Windows 用户同样会觉得从零开始编译并运行
Kubernetes e2e 套件同样不受欢迎，因此很明显需要一个用户友好的、“一键式”的开箱即用解决方案。
另外，在 Ginkgo 标签方面，把一致性测试通过一组 [Ginkgo](https://onsi.github.io/ginkgo/)
标签应用到 Windows 节点，对所有用户来说都很繁琐，不管是Linux 爱好者还是经验丰富的
Windows 系统管理员。

<!--
To bridge the gap and give users a straightforward way to confirm their clusters 
support a variety of features, the Kubernetes SIG for Windows found it necessary to 
therefore create the Windows Operational Readiness application. This application 
written in Go, simplifies the process to run the necessary Windows specific tests 
while delivering results in a clear, accessible format.
-->
为了填补这个空白，为用户提供一种直接的方法来确认他们的集群是否支持多种功能，
Kubernetes 社区的 Windows SIG 认为有必要开发 Windows 操作就绪应用。
这个应用由 Go 语言编写，可以简化运行特定于 Windows 的必要测试，并以清晰、易于获取的格式提供结果。

<!--
This initiative has been a collaborative effort, with contributions from different 
cloud providers and platforms, including Amazon, Microsoft, SUSE, and Broadcom.

## A closer look at the Windows Operational Readiness Specification {#specification}
-->
这项工作是多方协作的成果，亚马逊 (Amazon)、微软 (Microsoft)、SUSE 和 Broadcom
等多家云服务商和平台都为此做出了贡献。

## 更深入地了解 Windows 操作就绪规范    {#specification}  

<!--
The Windows Operational Readiness specification specifically targets and executes 
tests found within the Kubernetes repository in a more user-friendly way than 
simply targeting [Ginkgo](https://onsi.github.io/ginkgo/) tags. It introduces a 
structured test suite that is split into sets of core and extended tests, with 
each set of tests containing categories directed at testing a specific area of 
testing, such as networking. Core tests target fundamental and critical 
functionalities that Windows nodes should support as defined by the Kubernetes 
specification. On the other hand, extended tests cover more complex features, 
more aligned with diving deeper into Windows-specific capabilities such as 
integrations with Active Directory. These goal of these tests is to be extensive, 
covering a wide array of Windows-specific capabilities to ensure compatibility 
with a diverse set of workloads and configurations, extending beyond basic 
requirements. Below is the current list of categories.
-->
相对于以往单纯通过 [Ginkgo](https://onsi.github.io/ginkgo) 标签的方式，
Windows 操作就绪规范专门用于执行 Kubernetes 仓库中的测试，这种新方法更为用户友好。
它引入了一个结构化的测试套件，分为核心测试和扩展测试，每组测试又包含针对特定领域的类别，
例如网络。核心测试聚焦于 Kubernetes 规范定义的 Windows 节点应支持的基本和关键功能。
而扩展测试则覆盖更复杂的功能，更侧重于深入考察 Windows 特有的功能，例如与 Active Directory 的集成。
这些测试的目标是确保全面覆盖，涵盖广泛的 Windows 特有的功能，以确保与各种工作负载和配置兼容，
其范围也超出了基本要求。下面是当前的类别列表。

<!--
| Category Name            | Category Description                                                                                                                |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `Core.Network`           | Tests minimal networking functionality (ability to access pod-by-pod IP.)                                                           |
| `Core.Storage`           | Tests minimal storage functionality, (ability to mount a hostPath storage volume.)                                                  |
| `Core.Scheduling`        | Tests minimal scheduling functionality, (ability to schedule a pod with CPU limits.)                                                |
| `Core.Concurrent`        | Tests minimal concurrent functionality, (the ability of a node to handle traffic to multiple pods concurrently.)                    |
| `Extend.HostProcess`     | Tests features related to Windows HostProcess pod functionality.                                                                    |
| `Extend.ActiveDirectory` | Tests features related to Active Directory functionality.                                                                           |
| `Extend.NetworkPolicy`   | Tests features related to Network Policy functionality.                                                                             |
| `Extend.Network`         | Tests advanced networking functionality, (ability to support IPv6)                                                                  |
| `Extend.Worker`          | Tests features related to Windows worker node functionality, (ability for nodes to access TCP and UDP services in the same cluster) |
-->
| 类别名字                 |  类别描述                  	                                                                                                 |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `Core.Network`           | 测试最小网络功能（访问各个 Pod 的 IP 地址）。 | 
| `Core.Storage`           | 测试最小存储功能（能够挂载 hostPath 存储卷）。 |
| `Core.Scheduling`        | 测试最小调度功能（能够调度带有 CPU 限制的 Pod）。 |
| `Core.Concurrent`        | 测试最小并发功能（节点能够并发处理多个 Pod 的流量）。 |
| `Extend.HostProcess`     | 测试与 Windows `HostProcess` Pod 功能相关的特性。 |
| `Extend.ActiveDirectory` | 测试与 Active Directory 功能相关的特性。 |
| `Extend.NetworkPolicy`   | 测试与网络策略功能相关的功能。 |
| `Extend.Network`         | 测试高级网络功能（支持 IPv6）。 |
| `Extend.Worker`          | 测试与 Windows 工作节点功能相关的功能（节点能够访问同一集群中的 TCP 和 UDP 服务）。 |


<!--
## How to conduct operational readiness tests for Windows nodes

To run the Windows Operational Readiness test suite, refer to the test suite's
[`README`](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md), which explains how to set it up and run it. The test suite offers 
flexibility in how you can execute tests, either using a compiled binary or a 
Sonobuoy plugin. You also have the choice to run the tests against the entire 
test suite or by specifying a list of categories. Cloud providers have the 
choice of uploading their conformance results, enhancing transparency and reliability.
-->
## 如何对 Windows 节点做操作就绪测试   {#how-to-conduct-operational-readiness-tests-for-windows-nodes}

要运行 Windows 操作就绪测试套件，可以查看它的
[`README`](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md)，
其中解释了如何安装和运行它。这个测试套件提供了灵活的执行方式，你可以使用编译好的二进制文件或
Sonobuoy 插件来运行。你还可以选择运行整个测试套件，或者只运行指定类别的测试。
云服务商也可以选择上传他们的一致性测试结果，从而提升透明度和可靠性。

<!--
Once you have checked out that code, you can run a test. For example, this sample 
command runs the tests from the `Core.Concurrent` category:
-->
一旦你检出代码，就可以运行测试。例如，这个示例命令运行来自 `Core.Concurrent` 类别的测试：

```shell
./op-readiness --kubeconfig $KUBE_CONFIG --category Core.Concurrent
```

<!--
As a contributor to Kubernetes, if you want to test your changes against a specific pull 
request using the Windows Operational Readiness Specification, use the following bot 
command in the new pull request.
-->
作为 Kubernetes 的贡献者，如果你想使用 Windows 操作就绪规范来针对某个特定
Pull Request 测试你的更改，请在新的 Pull Request 中使用以下机器人命令。


```shell
/test operational-tests-capz-windows-2019
```

<!--
## Looking ahead

We’re looking to improve our curated list of Windows-specific tests by adding 
new tests to the Kubernetes repository and also identifying existing test cases 
that can be targetted. The long term goal for the specification is to continually 
enhance test coverage for Windows worker nodes and improve the robustness of 
Windows support, facilitating a seamless experience across diverse cloud 
environments. We also have plans to integrate the Windows Operational Readiness 
tests into the official Kubernetes conformance suite.
-->
## 展望未来   {#looking-ahead}

我们希望通过在 Kubernetes 仓库中添加新的测试，以及识别可被纳入的现有测试用例，
来改进我们整理的 Windows 特定测试列表。这个规范的长期目标是持续扩大对
Windows 工作节点的测试覆盖范围，并提升 Windows 支持的稳健性，从而在不同云环境中带来无缝的体验。
我们还计划把 Windows 操作就绪测试集成到官方的 Kubernetes 一致性测试套件里。

<!--
If you are interested in helping us out, please reach out to us! We welcome help 
in any form, from giving once-off feedback to making a code contribution, 
to having long-term owners to help us drive changes. The Windows Operational 
Readiness specification is owned by the SIG Windows team. You can reach out 
to the team on the [Kubernetes Slack workspace](https://slack.k8s.io/) **#sig-windows** 
channel. You can also explore the [Windows Operational Readiness test suite](https://github.com/kubernetes-sigs/windows-operational-readiness/#readme) 
and make contributions directly to the GitHub repository.
-->
如果你有兴趣帮助我们，欢迎与我们联系！我们欢迎任何形式的帮助，
不管是一次性的反馈、提交代码，还是成为长期负责人来帮助我们推动变更。
Windows 操作就绪规范由 SIG Windows 团队负责。
你可以在 [Kubernetes Slack 工作区](https://slack.k8s.io/) 的
**#sig-windows** 频道联系团队。你也可以查看
[Windows 操作就绪测试套件](https://github.com/kubernetes-sigs/windows-operational-readiness/#readme)，
直接在 GitHub 仓库中参与贡献。 

<!--
Special thanks to Kulwant Singh (AWS), Pramita Gautam Rana (VMWare), Xinqi Li 
(Google) and Marcio Morales (AWS) for their help in making notable contributions to the specification. Additionally, 
appreciation goes to James Sturtevant (Microsoft), Mark Rossetti (Microsoft), 
Claudiu Belu (Cloudbase Solutions) and Aravindh Puthiyaparambil 
(Softdrive Technologies Group Inc.) from the SIG Windows team for their guidance and support.
-->
特别感谢 Kulwant Singh（AWS）、Pramita Gautam Rana（VMWare）、Xinqi Li（Google）和 Marcio Morales（AWS），
感谢他们为本规范做出的重要贡献。同时，也要感谢 SIG Windows 团队的 James Sturtevant（Microsoft）、
Mark Rossetti（Microsoft）、Claudiu Belu（Cloudbase Solutions）和
Aravindh Puthiyaparambil（Softdrive Technologies Group Inc.），感谢他们的指导和支持。  
