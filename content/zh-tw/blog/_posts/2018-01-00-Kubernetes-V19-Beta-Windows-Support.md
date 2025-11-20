---
title: Kubernetes 1.9 對 Windows Server 容器提供 Beta 版本支持
date: 2018-01-09
slug: kubernetes-v19-beta-windows-support
---
<!--
title: Kubernetes v1.9 releases beta support for Windows Server Containers
date: 2018-01-09
slug: kubernetes-v19-beta-windows-support
url: /blog/2018/01/Kubernetes-V19-Beta-Windows-Support
--->

<!--
With the release of Kubernetes v1.9, our mission of ensuring Kubernetes works well everywhere and for everyone takes a great step forward. We’ve advanced support for Windows Server to beta along with continued feature and functional advancements on both the Kubernetes and Windows platforms. SIG-Windows has been working since March of 2016 to open the door for many Windows-specific applications and workloads to run on Kubernetes, significantly expanding the implementation scenarios and the enterprise reach of Kubernetes.  
--->
隨着 Kubernetes v1.9 的發佈，我們確保所有人在任何地方都能正常運行 Kubernetes 的使命前進了一大步。我們的 Beta 版本對 Windows Server 的支持進行了升級，並且在 Kubernetes 和 Windows 平臺上都提供了持續的功能改進。爲了在 Kubernetes 上運行許多特定於 Windows 的應用程式和工作負載，SIG-Windows 自2016年3月以來一直在努力，大大擴展了 Kubernetes 的實現場景和企業適用範圍。

<!--
Enterprises of all sizes have made significant investments in .NET and Windows based applications. Many enterprise portfolios today contain .NET and Windows, with Gartner claiming that [80%](http://www.gartner.com/document/3446217) of enterprise apps run on Windows. According to StackOverflow Insights, 40% of professional developers use the .NET programming languages (including .NET Core).  
--->
各種規模的企業都在 .NET 和基於 Windows 的應用程式上進行了大量投資。如今許多企業產品組合都包含 .NET 和 Windows，Gartner 聲稱 [80%](http://www.gartner.com/document/3446217) 的企業應用都在 Windows 上運行。根據 StackOverflow Insights，40% 的專業開發人員使用 .NET 編程語言（包括 .NET Core）。

<!--
But why is all this information important? It means that enterprises have both legacy and new born-in-the-cloud (microservice) applications that utilize a wide array of programming frameworks. There is a big push in the industry to modernize existing/legacy applications to containers, using an approach similar to “lift and shift”. Modernizing existing applications into containers also provides added flexibility for new functionality to be introduced in additional Windows or Linux containers. Containers are becoming the de facto standard for packaging, deploying, and managing both existing and microservice applications. IT organizations are looking for an easier and homogenous way to orchestrate and manage containers across their Linux and Windows environments. Kubernetes v1.9 now offers beta support for Windows Server containers, making it the clear choice for orchestrating containers of any kind.  
--->
但爲什麼這些資訊都很重要？這意味着企業既有傳統的，也有新生的雲（microservice）應用程式，利用了大量的編程框架。業界正在大力推動將現有/遺留應用程式現代化到容器中，使用類似於“提升和轉移”的方法。同時，也能靈活地向其他 Windows 或 Linux 容器引入新功能。容器正在成爲打包、部署和管理現有程式和微服務應用程式的業界標準。IT 組織正在尋找一種更簡單且一致的方法來跨 Linux 和 Windows 環境進行協調和管理容器。Kubernetes v1.9 現在對 Windows Server 容器提供了 Beta 版本支持，使之成爲策劃任何類型容器的明確選擇。



<!--
### Features
Alpha support for Windows Server containers in Kubernetes was great for proof-of-concept projects and visualizing the road map for support of Windows in Kubernetes. The alpha release had significant drawbacks, however, and lacked many features, especially in networking. SIG-Windows, Microsoft, Cloudbase Solutions, Apprenda, and other community members banded together to create a comprehensive beta release, enabling Kubernetes users to start evaluating and using Windows.  
--->
### 特點
Kubernetes 中對 Windows Server 容器的 Alpha 支持是非常有用的，尤其是對於概念項目和可視化 Kubernetes 中 Windows 支持的路線圖。然而，Alpha 版本有明顯的缺點，並且缺少許多特性，特別是在網路方面。SIG Windows、Microsoft、Cloudbase Solutions、Apprenda 和其他社區成員聯合創建了一個全面的 Beta 版本，使 Kubernetes 使用者能夠開始評估和使用 Windows。

<!--
Some key feature improvements for Windows Server containers on Kubernetes include:  

- Improved support for pods! Multiple Windows Server containers in a pod can now share the network namespace using network compartments in Windows Server. This feature brings the concept of a pod to parity with Linux-based containers
- Reduced network complexity by using a single network endpoint per pod
- Kernel-Based load-balancing using the Virtual Filtering Platform (VFP) Hyper-v Switch Extension (analogous to Linux iptables)
- Container Runtime Interface (CRI) pod and node level statistics. Windows Server containers can now be profiled for Horizontal Pod Autoscaling using performance metrics gathered from the pod and the node
--->
Kubernetes 對 Windows 伺服器容器的一些關鍵功能改進包括：

- 改進了對 Pod 的支持！Pod 中多個 Windows Server 容器現在可以使用 Windows Server 中的網路隔離專區共享網路命名空間。此功能中 Pod 的概念相當於基於 Linux 的容器
- 可通過每個 Pod 使用單個網路端點來降低網路複雜性
- 可以使用 Virtual Filtering Platform（VFP）的 Hyper-v Switch Extension（類似於 Linux iptables）達到基於內核的負載平衡
- 具備 Container Runtime Interface（CRI）的 Pod 和 Node 級別的統計資訊。可以使用從 Pod 和節點收集的性能指標設定 Windows Server 容器的 Horizontal Pod Autoscaling
<!--
- Support for kubeadm commands to add Windows Server nodes to a Kubernetes environment. Kubeadm simplifies the provisioning of a Kubernetes cluster, and with the support for Windows Server, you can use a single tool to deploy Kubernetes in your infrastructure
- Support for ConfigMaps, Secrets, and Volumes. These are key features that allow you to separate, and in some cases secure, the configuration of the containers from the implementation
The crown jewels of Kubernetes 1.9 Windows support, however, are the networking enhancements. With the release of Windows Server 1709, Microsoft has enabled key networking capabilities in the operating system and the Windows Host Networking Service (HNS) that paved the way to produce a number of CNI plugins that work with Windows Server containers in Kubernetes. The Layer-3 routed and network overlay plugins that are supported with Kubernetes 1.9 are listed below:  
--->
- 支持 kubeadm 命令將 Windows Server 的 Node 添加到 Kubernetes 環境。Kubeadm 簡化了 Kubernetes 叢集的設定，通過對 Windows Server 的支持，您可以在您的基礎設定中使用單一的工具部署 Kubernetes              
- 支持 ConfigMaps, Secrets, 和 Volumes。這些是非常關鍵的特性，您可以將容器的設定從實施體系中分離出來，並且在大部分情況下是安全的              
然而，kubernetes 1.9 windows 支持的最大亮點是網路增強。隨着 Windows 伺服器 1709 的發佈，微軟在操作系統和 Windows Host Networking Service（HNS）中啓用了關鍵的網路功能，這爲創造大量與 Kubernetes 中的 Windows 伺服器容器一起工作的 CNI 插件鋪平了道路。Kubernetes 1.9 支持的第三層路由和網路覆蓋插件如下所示：

<!--
1. Upstream L3 Routing - IP routes configured in upstream ToR
2. Host-Gateway - IP routes configured on each host
3. Open vSwitch (OVS) & Open Virtual Network (OVN) with Overlay - Supports STT and Geneve tunneling types
You can read more about each of their [configuration, setup, and runtime capabilities](/docs/getting-started-guides/windows/) to make an informed selection for your networking stack in Kubernetes.  
--->
1. 上游 L3 路由 - 上游 ToR 中設定的 IP 路由
2. Host-Gateway - 在每個主機上設定的 IP 路由
3. 具有 Overlay 的 Open vSwitch（OVS）和 Open Virtual Network（OVN） - 支持 STT 和 Geneve 的 tunneling 類型
您可以閱讀更多有關 [設定、設置和運行時功能](/docs/getting-started-guides/windows/) 的資訊，以便在 Kubernetes 中爲您的網路堆棧做出明智的選擇。

<!--
Even though you have to continue running the Kubernetes Control Plane and Master Components in Linux, you are now able to introduce Windows Server as a Node in Kubernetes. As a community, this is a huge milestone and achievement. We will now start seeing .NET, .NET Core, ASP.NET, IIS, Windows Services, Windows executables and many more windows-based applications in Kubernetes.  
--->
如果您需要繼續在 Linux 中運行 Kubernetes Control Plane 和 Master Components，現在也可以將 Windows Server 作爲 Kubernetes 中的一個節點引入。對一個社區來說，這是一個巨大的里程碑和成就。現在，我們將會在 Kubernetes 中看到 .NET，.NET Core，ASP.NET，IIS，Windows 服務，Windows 可執行檔案以及更多基於 Windows 的應用程式。

<!--
### What’s coming next
A lot of work went into this beta release, but the community realizes there are more areas of investment needed before we can release Windows support as GA (General Availability) for production workloads. Some keys areas of focus for the first two quarters of 2018 include:  
--->
### 接下來還會有什麼
這個 Beta 版本進行了大量工作，但是社區意識到在將 Windows 支持作爲生產工作負載發佈爲 GA（General Availability）之前，我們需要更多領域的投資。2018年前兩個季度的重點關注領域包括：

<!--
1. Continue to make progress in the area of networking. Additional CNI plugins are under development and nearing completion
- Overlay - win-overlay (vxlan or IP-in-IP encapsulation using Flannel)&nbsp;
- Win-l2bridge (host-gateway)&nbsp;
- OVN using cloud networking - without overlays
- Support for Kubernetes network policies in ovn-kubernetes
- Support for Hyper-V Isolation
- Support for StatefulSet functionality for stateful applications
- Produce installation artifacts and documentation that work on any infrastructure and across many public cloud providers like Microsoft Azure, Google Cloud, and Amazon AWS
- Continuous Integration/Continuous Delivery (CI/CD) infrastructure for SIG-Windows
- Scalability and Performance testing
Even though we have not committed to a timeline for GA, SIG-Windows estimates a GA release in the first half of 2018.
--->
1. 繼續在網路領域取得更多進展。其他 CNI 插件正在開發中，並且即將完成              
- Overlay - win-Overlay（vxlan 或 IP-in-IP 使用 Flannel 封裝）
- Win-l2bridge（host-gateway）
- 使用雲網路的 OVN - 不再依賴 Overlay
- 在 ovn-Kubernetes 中支持 Kubernetes 網路策略
- 支持 Hyper-V Isolation
- 支持有狀態應用程式的 StatefulSet 功能
- 生成適用於任何基礎架構以及跨多公共雲提供商（例如 Microsoft Azure，Google Cloud 和 Amazon AWS）的安裝工具和文檔
- SIG-Windows 的 Continuous Integration/Continuous Delivery（CI/CD）基礎結構
- 可伸縮性和性能測試
儘管我們尚未承諾正式版的具體時間線，但估計 SIG-Windows 將於2018年上半年正式發佈。



<!--
### Get Involved
As we continue to make progress towards General Availability of this feature in Kubernetes, we welcome you to get involved, contribute code, provide feedback, deploy Windows Server containers to your Kubernetes cluster, or simply join our community.  
--->
### 加入我們
隨着我們在 Kubernetes 的普遍可用性方向不斷取得進展，我們歡迎您參與進來，貢獻代碼、提供反饋，將 Windows 伺服器容器部署到 Kubernetes 叢集，或者乾脆加入我們的社區。

<!--
- If you want to get started on deploying Windows Server containers in Kubernetes, read our getting started guide at [/docs/getting-started-guides/windows/](/docs/getting-started-guides/windows/)
- We meet every other Tuesday at 12:30 Eastern Standard Time (EST) at [https://zoom.us/my/sigwindows](https://zoom.us/my/sigwindows). All our meetings are recorded on youtube and referenced at [https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4](https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4)
- Chat with us on Slack at [https://kubernetes.slack.com/messages/sig-windows](https://kubernetes.slack.com/messages/sig-windows)
- Find us on GitHub at [https://github.com/kubernetes/community/tree/master/sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)
--->
- 如果你想要開始在 Kubernetes 中部署 Windows Server 容器，請閱讀我們的開始導覽 [/docs/getting-started-guides/windows/](/docs/getting-started-guides/windows/)
- 我們每隔一個星期二在美國東部標準時間（EST）的12:30在 [https://zoom.us/my/sigwindows](https://zoom.us/my/sigwindows) 開會。所有會議內容都記錄在 Youtube 並附上了參考材料 [https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4](https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4)
- 通過 Slack 聯繫我們 [https://kubernetes.slack.com/messages/sig-windows](https://kubernetes.slack.com/messages/sig-windows)
- 在 Github 上找到我們 [https://github.com/kubernetes/community/tree/master/sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)



<!--
Thank you,  

Michael Michael (@michmike77)  
SIG-Windows Lead  
Senior Director of Product Management, Apprenda
--->
謝謝大家，

Michael Michael (@michmike77)  
SIG-Windows 領導人  
Apprenda 產品管理高級總監
