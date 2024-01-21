---
title: Kubernetes 1.9 对 Windows Server 容器提供 Beta 版本支持
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
随着 Kubernetes v1.9 的发布，我们确保所有人在任何地方都能正常运行 Kubernetes 的使命前进了一大步。我们的 Beta 版本对 Windows Server 的支持进行了升级，并且在 Kubernetes 和 Windows 平台上都提供了持续的功能改进。为了在 Kubernetes 上运行许多特定于 Windows 的应用程序和工作负载，SIG-Windows 自2016年3月以来一直在努力，大大扩展了 Kubernetes 的实现场景和企业适用范围。

<!--
Enterprises of all sizes have made significant investments in .NET and Windows based applications. Many enterprise portfolios today contain .NET and Windows, with Gartner claiming that [80%](http://www.gartner.com/document/3446217) of enterprise apps run on Windows. According to StackOverflow Insights, 40% of professional developers use the .NET programming languages (including .NET Core).  
--->
各种规模的企业都在 .NET 和基于 Windows 的应用程序上进行了大量投资。如今许多企业产品组合都包含 .NET 和 Windows，Gartner 声称 [80%](http://www.gartner.com/document/3446217) 的企业应用都在 Windows 上运行。根据 StackOverflow Insights，40% 的专业开发人员使用 .NET 编程语言（包括 .NET Core）。

<!--
But why is all this information important? It means that enterprises have both legacy and new born-in-the-cloud (microservice) applications that utilize a wide array of programming frameworks. There is a big push in the industry to modernize existing/legacy applications to containers, using an approach similar to “lift and shift”. Modernizing existing applications into containers also provides added flexibility for new functionality to be introduced in additional Windows or Linux containers. Containers are becoming the de facto standard for packaging, deploying, and managing both existing and microservice applications. IT organizations are looking for an easier and homogenous way to orchestrate and manage containers across their Linux and Windows environments. Kubernetes v1.9 now offers beta support for Windows Server containers, making it the clear choice for orchestrating containers of any kind.  
--->
但为什么这些信息都很重要？这意味着企业既有传统的，也有新生的云（microservice）应用程序，利用了大量的编程框架。业界正在大力推动将现有/遗留应用程序现代化到容器中，使用类似于“提升和转移”的方法。同时，也能灵活地向其他 Windows 或 Linux 容器引入新功能。容器正在成为打包、部署和管理现有程序和微服务应用程序的业界标准。IT 组织正在寻找一种更简单且一致的方法来跨 Linux 和 Windows 环境进行协调和管理容器。Kubernetes v1.9 现在对 Windows Server 容器提供了 Beta 版本支持，使之成为策划任何类型容器的明确选择。



<!--
### Features
Alpha support for Windows Server containers in Kubernetes was great for proof-of-concept projects and visualizing the road map for support of Windows in Kubernetes. The alpha release had significant drawbacks, however, and lacked many features, especially in networking. SIG-Windows, Microsoft, Cloudbase Solutions, Apprenda, and other community members banded together to create a comprehensive beta release, enabling Kubernetes users to start evaluating and using Windows.  
--->
### 特点
Kubernetes 中对 Windows Server 容器的 Alpha 支持是非常有用的，尤其是对于概念项目和可视化 Kubernetes 中 Windows 支持的路线图。然而，Alpha 版本有明显的缺点，并且缺少许多特性，特别是在网络方面。SIG Windows、Microsoft、Cloudbase Solutions、Apprenda 和其他社区成员联合创建了一个全面的 Beta 版本，使 Kubernetes 用户能够开始评估和使用 Windows。

<!--
Some key feature improvements for Windows Server containers on Kubernetes include:  

- Improved support for pods! Multiple Windows Server containers in a pod can now share the network namespace using network compartments in Windows Server. This feature brings the concept of a pod to parity with Linux-based containers
- Reduced network complexity by using a single network endpoint per pod
- Kernel-Based load-balancing using the Virtual Filtering Platform (VFP) Hyper-v Switch Extension (analogous to Linux iptables)
- Container Runtime Interface (CRI) pod and node level statistics. Windows Server containers can now be profiled for Horizontal Pod Autoscaling using performance metrics gathered from the pod and the node
--->
Kubernetes 对 Windows 服务器容器的一些关键功能改进包括：

- 改进了对 Pod 的支持！Pod 中多个 Windows Server 容器现在可以使用 Windows Server 中的网络隔离专区共享网络命名空间。此功能中 Pod 的概念相当于基于 Linux 的容器
- 可通过每个 Pod 使用单个网络端点来降低网络复杂性
- 可以使用 Virtual Filtering Platform（VFP）的 Hyper-v Switch Extension（类似于 Linux iptables）达到基于内核的负载平衡
- 具备 Container Runtime Interface（CRI）的 Pod 和 Node 级别的统计信息。可以使用从 Pod 和节点收集的性能指标配置 Windows Server 容器的 Horizontal Pod Autoscaling
<!--
- Support for kubeadm commands to add Windows Server nodes to a Kubernetes environment. Kubeadm simplifies the provisioning of a Kubernetes cluster, and with the support for Windows Server, you can use a single tool to deploy Kubernetes in your infrastructure
- Support for ConfigMaps, Secrets, and Volumes. These are key features that allow you to separate, and in some cases secure, the configuration of the containers from the implementation
The crown jewels of Kubernetes 1.9 Windows support, however, are the networking enhancements. With the release of Windows Server 1709, Microsoft has enabled key networking capabilities in the operating system and the Windows Host Networking Service (HNS) that paved the way to produce a number of CNI plugins that work with Windows Server containers in Kubernetes. The Layer-3 routed and network overlay plugins that are supported with Kubernetes 1.9 are listed below:  
--->
- 支持 kubeadm 命令将 Windows Server 的 Node 添加到 Kubernetes 环境。Kubeadm 简化了 Kubernetes 集群的配置，通过对 Windows Server 的支持，您可以在您的基础配置中使用单一的工具部署 Kubernetes              
- 支持 ConfigMaps, Secrets, 和 Volumes。这些是非常关键的特性，您可以将容器的配置从实施体系中分离出来，并且在大部分情况下是安全的              
然而，kubernetes 1.9 windows 支持的最大亮点是网络增强。随着 Windows 服务器 1709 的发布，微软在操作系统和 Windows Host Networking Service（HNS）中启用了关键的网络功能，这为创造大量与 Kubernetes 中的 Windows 服务器容器一起工作的 CNI 插件铺平了道路。Kubernetes 1.9 支持的第三层路由和网络覆盖插件如下所示：

<!--
1. Upstream L3 Routing - IP routes configured in upstream ToR
2. Host-Gateway - IP routes configured on each host
3. Open vSwitch (OVS) & Open Virtual Network (OVN) with Overlay - Supports STT and Geneve tunneling types
You can read more about each of their [configuration, setup, and runtime capabilities](/docs/getting-started-guides/windows/) to make an informed selection for your networking stack in Kubernetes.  
--->
1. 上游 L3 路由 - 上游 ToR 中配置的 IP 路由
2. Host-Gateway - 在每个主机上配置的 IP 路由
3. 具有 Overlay 的 Open vSwitch（OVS）和 Open Virtual Network（OVN） - 支持 STT 和 Geneve 的 tunneling 类型
您可以阅读更多有关 [配置、设置和运行时功能](/docs/getting-started-guides/windows/) 的信息，以便在 Kubernetes 中为您的网络堆栈做出明智的选择。

<!--
Even though you have to continue running the Kubernetes Control Plane and Master Components in Linux, you are now able to introduce Windows Server as a Node in Kubernetes. As a community, this is a huge milestone and achievement. We will now start seeing .NET, .NET Core, ASP.NET, IIS, Windows Services, Windows executables and many more windows-based applications in Kubernetes.  
--->
如果您需要继续在 Linux 中运行 Kubernetes Control Plane 和 Master Components，现在也可以将 Windows Server 作为 Kubernetes 中的一个节点引入。对一个社区来说，这是一个巨大的里程碑和成就。现在，我们将会在 Kubernetes 中看到 .NET，.NET Core，ASP.NET，IIS，Windows 服务，Windows 可执行文件以及更多基于 Windows 的应用程序。

<!--
### What’s coming next
A lot of work went into this beta release, but the community realizes there are more areas of investment needed before we can release Windows support as GA (General Availability) for production workloads. Some keys areas of focus for the first two quarters of 2018 include:  
--->
### 接下来还会有什么
这个 Beta 版本进行了大量工作，但是社区意识到在将 Windows 支持作为生产工作负载发布为 GA（General Availability）之前，我们需要更多领域的投资。2018年前两个季度的重点关注领域包括：

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
1. 继续在网络领域取得更多进展。其他 CNI 插件正在开发中，并且即将完成              
- Overlay - win-Overlay（vxlan 或 IP-in-IP 使用 Flannel 封装）
- Win-l2bridge（host-gateway）
- 使用云网络的 OVN - 不再依赖 Overlay
- 在 ovn-Kubernetes 中支持 Kubernetes 网络策略
- 支持 Hyper-V Isolation
- 支持有状态应用程序的 StatefulSet 功能
- 生成适用于任何基础架构以及跨多公共云提供商（例如 Microsoft Azure，Google Cloud 和 Amazon AWS）的安装工具和文档
- SIG-Windows 的 Continuous Integration/Continuous Delivery（CI/CD）基础结构
- 可伸缩性和性能测试
尽管我们尚未承诺正式版的具体时间线，但估计 SIG-Windows 将于2018年上半年正式发布。



<!--
### Get Involved
As we continue to make progress towards General Availability of this feature in Kubernetes, we welcome you to get involved, contribute code, provide feedback, deploy Windows Server containers to your Kubernetes cluster, or simply join our community.  
--->
### 加入我们
随着我们在 Kubernetes 的普遍可用性方向不断取得进展，我们欢迎您参与进来，贡献代码、提供反馈，将 Windows 服务器容器部署到 Kubernetes 集群，或者干脆加入我们的社区。

<!--
- If you want to get started on deploying Windows Server containers in Kubernetes, read our getting started guide at [/docs/getting-started-guides/windows/](/docs/getting-started-guides/windows/)
- We meet every other Tuesday at 12:30 Eastern Standard Time (EST) at [https://zoom.us/my/sigwindows](https://zoom.us/my/sigwindows). All our meetings are recorded on youtube and referenced at [https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4](https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4)
- Chat with us on Slack at [https://kubernetes.slack.com/messages/sig-windows](https://kubernetes.slack.com/messages/sig-windows)
- Find us on GitHub at [https://github.com/kubernetes/community/tree/master/sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)
--->
- 如果你想要开始在 Kubernetes 中部署 Windows Server 容器，请阅读我们的开始导览 [/docs/getting-started-guides/windows/](/docs/getting-started-guides/windows/)
- 我们每隔一个星期二在美国东部标准时间（EST）的12:30在 [https://zoom.us/my/sigwindows](https://zoom.us/my/sigwindows) 开会。所有会议内容都记录在 Youtube 并附上了参考材料 [https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4](https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4)
- 通过 Slack 联系我们 [https://kubernetes.slack.com/messages/sig-windows](https://kubernetes.slack.com/messages/sig-windows)
- 在 Github 上找到我们 [https://github.com/kubernetes/community/tree/master/sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)



<!--
Thank you,  

Michael Michael (@michmike77)  
SIG-Windows Lead  
Senior Director of Product Management, Apprenda
--->
谢谢大家，

Michael Michael (@michmike77)  
SIG-Windows 领导人  
Apprenda 产品管理高级总监
