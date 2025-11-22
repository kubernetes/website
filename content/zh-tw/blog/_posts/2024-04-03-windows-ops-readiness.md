---
layout: blog
title: "Windows 操作就緒規範簡介"
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
自從 2019 年 Kubernetes 1.14 將對 Windows
的支持[升級爲穩定版](/zh-cn/blog/2019/03/25/kubernetes-1-14-release-announcement/)以來，
能夠運行 Windows 工作負載的能力一直深受最終使用者社區的認可。對於大型企業來說，
對 Windows 工作負載支持的水平和可用性一直是各大企業選擇 Kubernetes 發行版的重要差異化因素。
然而，隨着越來越多的 Windows 工作負載遷移到 Kubernetes，以及新的 Windows 特性不斷髮布，
要高效且標準化地測試 Windows 工作節點變得越來越具有挑戰性。

<!--
The Kubernetes project values the ability to certify conformance without requiring a 
closed-source license for a certified distribution or service that has no intention 
of offering Windows.

Some notable examples brought to the attention of SIG Windows were:
-->
對於那些無意提供 Windows 支持的、經過認證的發行版或服務，
Kubernetes 項目非常重視它們無需閉源授權即可通過一致性認證的能力。

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
- 負載均衡器源地址範圍功能在 Windows 節點上無法正常運行的問題，詳情見 GitHub 討論：
  [kubernetes/kubernetes#120033](https://github.com/kubernetes/kubernetes/issues/120033)。
- 有關 Windows 功能異常的報告，例如
  “[GMSA](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)
  無法與 containerd 協同工作”，相關討論見
  [microsoft/Windows-Containers#44](https://github.com/microsoft/Windows-Containers/issues/44)。
- 在開發網路策略測試時遇到的挑戰，這類測試需要能夠在不同操作系統設定下客觀評估容器網路介面
  （CNI）插件，相關討論見[kubernetes/kubernetes#97751](https://github.com/kubernetes/kubernetes/issues/97751)。  

<!--
SIG Windows therefore recognized the need for a tailored solution to ensure Windows
nodes' operational readiness *before* their deployment into production environments.
Thus, the idea to develop a [Windows Operational Readiness Specification](https://kep.k8s.io/2578)
was born.
-->
因此，SIG Windows 認識到需要一個定製化的解決方案，以確保 Windows
節點在進入生產環境**之前** 就達到操作就緒狀態。 於是，
[Windows 操作就緒規範](https://kep.k8s.io/2578)的想法就此產生。

<!--
## Can’t we just run the official Conformance tests?

The Kubernetes project contains a set of [conformance tests](https://www.cncf.io/training/certification/software-conformance/#how), 
which are standardized tests designed to ensure that a Kubernetes cluster meets 
the required Kubernetes specifications.
-->
## 我們不能直接運行官方的一致性測試嗎？   {#cant-we-just-run-the-official-conformance-tests}

Kubernetes 項目中提供了一套[一致性測試](https://www.cncf.io/training/certification/software-conformance/#how)，
這是一套標準化測試，旨在確保 Kubernetes 叢集滿足規定的 Kubernetes 規範。

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
然而，這些測試最初設計時，Linux 是 **唯一** 與 Kubernetes 兼容的操作系統，
因此很難直接擴展應用於 Windows。雖然 Windows 工作負載十分重要，
但它在 Kubernetes 社區中只佔較小的份額。因此必須確保主要的一致性測試套件
不會因爲 Windows 特定功能或增強（例如 GMSA 或跨操作系統的 kube-proxy 行爲）而變得負擔過重，
許多 Kubernetes 發行版依賴它來認證 Linux 的一致性。

<!--
Therefore, since there was a specialized need for Windows conformance testing, 
SIG Windows went down the path of offering Windows specific conformance tests 
through the Windows Operational Readiness Specification.

## Can’t we just run the Kubernetes end-to-end test suite?
-->
因此，由於對 Windows 一致性測試有特殊需求，SIG Windows 走上了通過 Windows 操作就緒規範提供
特定於 Windows 的一致性測試的路線。

## 難道我們不能只運行 Kubernetes 的端到端測試套件嗎？   {#cant-we-just-run-the-kubernetes-end-to-end-test-suite}  

<!--
In the Linux world, tools such as [Sonobuoy](https://sonobuoy.io/) simplify execution of the 
conformance suite, relieving users from needing to be aware of Kubernetes' 
compilation paths or the semantics of [Ginkgo](https://onsi.github.io/ginkgo) tags.
-->
在 Linux 生態中，[Sonobuoy](https://sonobuoy.io/) 這樣的工具簡化了一致性測試套件的執行，
使使用者無需瞭解 Kubernetes 的編譯路徑或 [Ginkgo](https://onsi.github.io/ginkgo) 標籤的語義。

<!--
Regarding needing to compile the Kubernetes tests, we realized that Windows 
users might similarly find the process of compiling and running the Kubernetes 
e2e suite from scratch similarly undesirable, hence, there was a clear need to 
provide a user-friendly, "push-button" solution that is ready to go. Moreover, 
regarding Ginkgo tags, applying conformance tests to Windows nodes through a set 
of [Ginkgo](https://onsi.github.io/ginkgo/) tags would also be burdensome for 
any user, including Linux enthusiasts or experienced Windows system admins alike.
-->
在需要編譯 Kubernetes 測試這件事上，我們意識到 Windows 使用者同樣會覺得從零開始編譯並運行
Kubernetes e2e 套件同樣不受歡迎，因此很明顯需要一個使用者友好的、“一鍵式”的開箱即用解決方案。
另外，在 Ginkgo 標籤方面，把一致性測試通過一組 [Ginkgo](https://onsi.github.io/ginkgo/)
標籤應用到 Windows 節點，對所有使用者來說都很繁瑣，不管是Linux 愛好者還是經驗豐富的
Windows 系統管理員。

<!--
To bridge the gap and give users a straightforward way to confirm their clusters 
support a variety of features, the Kubernetes SIG for Windows found it necessary to 
therefore create the Windows Operational Readiness application. This application 
written in Go, simplifies the process to run the necessary Windows specific tests 
while delivering results in a clear, accessible format.
-->
爲了填補這個空白，爲使用者提供一種直接的方法來確認他們的叢集是否支持多種功能，
Kubernetes 社區的 Windows SIG 認爲有必要開發 Windows 操作就緒應用。
這個應用由 Go 語言編寫，可以簡化運行特定於 Windows 的必要測試，並以清晰、易於獲取的格式提供結果。

<!--
This initiative has been a collaborative effort, with contributions from different 
cloud providers and platforms, including Amazon, Microsoft, SUSE, and Broadcom.

## A closer look at the Windows Operational Readiness Specification {#specification}
-->
這項工作是多方協作的成果，亞馬遜 (Amazon)、微軟 (Microsoft)、SUSE 和 Broadcom
等多家雲服務商和平臺都爲此做出了貢獻。

## 更深入地瞭解 Windows 操作就緒規範    {#specification}  

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
相對於以往單純通過 [Ginkgo](https://onsi.github.io/ginkgo) 標籤的方式，
Windows 操作就緒規範專門用於執行 Kubernetes 倉庫中的測試，這種新方法更爲使用者友好。
它引入了一個結構化的測試套件，分爲核心測試和擴展測試，每組測試又包含針對特定領域的類別，
例如網路。核心測試聚焦於 Kubernetes 規範定義的 Windows 節點應支持的基本和關鍵功能。
而擴展測試則覆蓋更復雜的功能，更側重於深入考察 Windows 特有的功能，例如與 Active Directory 的集成。
這些測試的目標是確保全面覆蓋，涵蓋廣泛的 Windows 特有的功能，以確保與各種工作負載和設定兼容，
其範圍也超出了基本要求。下面是當前的類別列表。

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
| 類別名字                 |  類別描述                  	                                                                                                 |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `Core.Network`           | 測試最小網路功能（訪問各個 Pod 的 IP 地址）。 | 
| `Core.Storage`           | 測試最小儲存功能（能夠掛載 hostPath 儲存卷）。 |
| `Core.Scheduling`        | 測試最小調度功能（能夠調度帶有 CPU 限制的 Pod）。 |
| `Core.Concurrent`        | 測試最小併發功能（節點能夠併發處理多個 Pod 的流量）。 |
| `Extend.HostProcess`     | 測試與 Windows `HostProcess` Pod 功能相關的特性。 |
| `Extend.ActiveDirectory` | 測試與 Active Directory 功能相關的特性。 |
| `Extend.NetworkPolicy`   | 測試與網路策略功能相關的功能。 |
| `Extend.Network`         | 測試高級網路功能（支持 IPv6）。 |
| `Extend.Worker`          | 測試與 Windows 工作節點功能相關的功能（節點能夠訪問同一叢集中的 TCP 和 UDP 服務）。 |


<!--
## How to conduct operational readiness tests for Windows nodes

To run the Windows Operational Readiness test suite, refer to the test suite's
[`README`](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md), which explains how to set it up and run it. The test suite offers 
flexibility in how you can execute tests, either using a compiled binary or a 
Sonobuoy plugin. You also have the choice to run the tests against the entire 
test suite or by specifying a list of categories. Cloud providers have the 
choice of uploading their conformance results, enhancing transparency and reliability.
-->
## 如何對 Windows 節點做操作就緒測試   {#how-to-conduct-operational-readiness-tests-for-windows-nodes}

要運行 Windows 操作就緒測試套件，可以查看它的
[`README`](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md)，
其中解釋瞭如何安裝和運行它。這個測試套件提供了靈活的執行方式，你可以使用編譯好的二進制檔案或
Sonobuoy 插件來運行。你還可以選擇運行整個測試套件，或者只運行指定類別的測試。
雲服務商也可以選擇上傳他們的一致性測試結果，從而提升透明度和可靠性。

<!--
Once you have checked out that code, you can run a test. For example, this sample 
command runs the tests from the `Core.Concurrent` category:
-->
一旦你檢出代碼，就可以運行測試。例如，這個示例命令運行來自 `Core.Concurrent` 類別的測試：

```shell
./op-readiness --kubeconfig $KUBE_CONFIG --category Core.Concurrent
```

<!--
As a contributor to Kubernetes, if you want to test your changes against a specific pull 
request using the Windows Operational Readiness Specification, use the following bot 
command in the new pull request.
-->
作爲 Kubernetes 的貢獻者，如果你想使用 Windows 操作就緒規範來針對某個特定
Pull Request 測試你的更改，請在新的 Pull Request 中使用以下機器人命令。


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
## 展望未來   {#looking-ahead}

我們希望通過在 Kubernetes 倉庫中添加新的測試，以及識別可被納入的現有測試用例，
來改進我們整理的 Windows 特定測試列表。這個規範的長期目標是持續擴大對
Windows 工作節點的測試覆蓋範圍，並提升 Windows 支持的穩健性，從而在不同雲環境中帶來無縫的體驗。
我們還計劃把 Windows 操作就緒測試集成到官方的 Kubernetes 一致性測試套件裏。

<!--
If you are interested in helping us out, please reach out to us! We welcome help 
in any form, from giving once-off feedback to making a code contribution, 
to having long-term owners to help us drive changes. The Windows Operational 
Readiness specification is owned by the SIG Windows team. You can reach out 
to the team on the [Kubernetes Slack workspace](https://slack.k8s.io/) **#sig-windows** 
channel. You can also explore the [Windows Operational Readiness test suite](https://github.com/kubernetes-sigs/windows-operational-readiness/#readme) 
and make contributions directly to the GitHub repository.
-->
如果你有興趣幫助我們，歡迎與我們聯繫！我們歡迎任何形式的幫助，
不管是一次性的反饋、提交代碼，還是成爲長期負責人來幫助我們推動變更。
Windows 操作就緒規範由 SIG Windows 團隊負責。
你可以在 [Kubernetes Slack 工作區](https://slack.k8s.io/) 的
**#sig-windows** 頻道聯繫團隊。你也可以查看
[Windows 操作就緒測試套件](https://github.com/kubernetes-sigs/windows-operational-readiness/#readme)，
直接在 GitHub 倉庫中參與貢獻。 

<!--
Special thanks to Kulwant Singh (AWS), Pramita Gautam Rana (VMWare), Xinqi Li 
(Google) and Marcio Morales (AWS) for their help in making notable contributions to the specification. Additionally, 
appreciation goes to James Sturtevant (Microsoft), Mark Rossetti (Microsoft), 
Claudiu Belu (Cloudbase Solutions) and Aravindh Puthiyaparambil 
(Softdrive Technologies Group Inc.) from the SIG Windows team for their guidance and support.
-->
特別感謝 Kulwant Singh（AWS）、Pramita Gautam Rana（VMWare）、Xinqi Li（Google）和 Marcio Morales（AWS），
感謝他們爲本規範做出的重要貢獻。同時，也要感謝 SIG Windows 團隊的 James Sturtevant（Microsoft）、
Mark Rossetti（Microsoft）、Claudiu Belu（Cloudbase Solutions）和
Aravindh Puthiyaparambil（Softdrive Technologies Group Inc.），感謝他們的指導和支持。  
