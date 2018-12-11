---

title: ' Kubernetes 1.11：集群内负载均衡和CoreDNS插件的普遍可用性'

cn-approvers:

- congfairy

layout: blog

title: 'Kubernetes 1.11: In-Cluster Load Balancing and CoreDNS Plugin Graduate to General Availability'

date:  2018-06-27

slug: kubernetes-1.11-release-announcement

---

 

<!--

Author: Kubernetes 1.11 Release Team

-->

 

作者: Kubernetes 1.11 发布团队

 

<!--

We’re pleased to announce the delivery of Kubernetes 1.11, our second release of 2018!

 

Today’s release continues to advance maturity, scalability, and flexibility of Kubernetes, marking significant progress on features that the team has been hard at work on over the last year. This newest version graduates key features in networking, opens up two major features from SIG-API Machinery and SIG-Node for beta testing, and continues to enhance storage features that have been a focal point of the past two releases. The features in this release make it increasingly possible to plug any infrastructure, cloud or on-premise, into the Kubernetes system.

 

Notable additions in this release include two highly-anticipated features graduating to general availability: IPVS-based In-Cluster Load Balancing and CoreDNS as a cluster DNS add-on option, which means increased scalability and flexibility for production applications.

-->

 

我们很高兴地宣布推出2018年第二个发型版本，Kubernetes 1.11！

 

今天的发布继续推进Kubernetes的成熟度，可扩展性和灵活性，标志着团队在过去一年中努力研发的功能取得了重大进展。 这个最新版本涵盖网络的关键功能，开启了SIG-API Machinery和SIG-Node的两个主要功能，用于beta测试，并继续增强存储功能，这些功能一直是过去两个版本的焦点。 此版本中的功能使得将任何基础架构，云或预置部署加入Kubernetes系统的可能性越来越大。

 

此版本中值得注意的新增功能包括两个备受期待的功能,并将逐渐被广泛使用：基于IPVS的集群内负载平衡和CoreDNS作为集群DNS附加选项，这意味着可以提高生产应用程序的可扩展性和灵活性。

 

<!--

Let’s dive into the key features of this release:

 

## IPVS-Based In-Cluster Service Load Balancing Graduates to General Availability

 

In this release, IPVS-based in-cluster service load balancing has moved to stable. IPVS (IP Virtual Server) provides high-performance in-kernel load balancing, with a simpler programming interface than iptables. This change delivers better network throughput, better programming latency, and higher scalability limits for the cluster-wide distributed load-balancer that comprises the Kubernetes Service model. IPVS is not yet the default but clusters can begin to use it for production traffic.

-->

 

让我们深入了解此版本的主要功能：

 

##基于IPVS的集群内服务负载均衡逐渐可以广泛使用

 

在此版本中，[基于IPVS的集群内服务负载均衡]（https://github.com/kubernetes/features/issues/265 ）已稳定运行。 IPVS（IP虚拟服务器）提供高性能的内核负载均衡，具有比iptables更简单的编程接口。 此更改为包含Kubernetes服务模型的集群范围的分布式负载均衡器提供了更好的网络吞吐量，更好的编程延迟和更高的可伸缩性限制。 IPVS尚未成为默认值，但集群可以开始将其用于大量流量。

 

<!--

## CoreDNS Promoted to General Availability

 

CoreDNS is now available as a cluster DNS add-on option, and is the default when using kubeadm. CoreDNS is a flexible, extensible authoritative DNS server and directly integrates with the Kubernetes API. CoreDNS has fewer moving parts than the previous DNS server, since it’s a single executable and a single process, and supports flexible use cases by creating custom DNS entries. It’s also written in Go making it memory-safe. You can learn more about CoreDNS here.

-->

 

## CoreDNS升级为一般可用性

 

[CoreDNS]（https://coredns.io ）现在可用作[集群DNS附加选项]（https://github.com/kubernetes/features/issues/427 ），并且是使用kubeadm时的默认选项。 CoreDNS是一个灵活，可扩展的权威DNS服务器，可直接与Kubernetes API集成。 CoreDNS比以前的DNS服务器具有更少的移去的部件，因为它是单个可执行文件和单个进程，并通过创建自定义DNS条目来支持灵活的用例。 它也用Go编写，使其具有内存安全性。 您可以在[这里]（https://youtu.be/dz9S7R8r5gw）了解更多有关CoreDNS的信息。

 

<!--

## Dynamic Kubelet Configuration Moves to Beta

 

This feature makes it possible for new Kubelet configurations to be rolled out in a live cluster.  Currently, Kubelets are configured via command-line flags, which makes it difficult to update Kubelet configurations in a running cluster. With this beta feature, users can configure Kubelets in a live cluster via the API server.

-->

 

##动态Kubelet配置转向Beta

 

此功能可以在实时集群中推出新的Kubelet配置。 目前，Kubelet是通过命令行标志配置的，这使得在正在运行的集群中更新Kubelet配置变得很困难。 有了这个测试版功能，[用户可以通过API服务器在实时集群中配置Kubelet]（https://kubernetes.io/docs/tasks/administer-cluster/reconfigure-kubelet/）。

 

<!--

## Custom Resource Definitions Can Now Define Multiple Versions

 

Custom Resource Definitions are no longer restricted to defining a single version of the custom resource, a restriction that was difficult to work around. Now, with this beta feature, multiple versions of the resource can be defined. In the future, this will be expanded to support some automatic conversions; for now, this feature allows custom resource authors to “promote with safe changes, e.g. v1beta1 to v1,” and to create a migration path for resources which do have changes.

 

Custom Resource Definitions now also support "status" and "scale" subresources, which integrate with monitoring and high-availability frameworks. These two changes advance the ability to run cloud-native applications in production using Custom Resource Definitions.

-->

 

##自定义资源定义现在可以定义多个版本

 

自定义资源定义不再局限于定义单个版本的自定义资源，这是一种难以解决的限制。现在，通过此beta [feature]（https://github.com/kubernetes/features/issues/544 ），可以定义多个版本的资源。将来，这将扩展到支持一些自动转换;目前，此功能允许自定义资源作者“通过安全更改进行促销，例如： v1beta1到v1，“并为有更改的资源创建迁移路径。

 

自定义资源定义现在也支持[“status”和“scale”子资源]（https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/customresources-subresources.md ），它与监控和高可用性框架集成。这两项更改提高了使用自定义资源定义在生产中运行云原生应用程序的能力。

 

<!--

## Enhancements to CSI

 

Container Storage Interface (CSI) has been a major topic over the last few releases. After moving to beta in 1.10, the 1.11 release continues enhancing CSI with a number of features. The 1.11 release adds alpha support for raw block volumes to CSI, integrates CSI with the new kubelet plugin registration mechanism, and makes it easier to pass secrets to CSI plugins.

-->

 

## CSI的增强功能

 

容器存储接口（CSI）是过去几个版本中的一个主要话题。 在转向[beta 1.10]（https://github.com/container-storage-interface/spec/blob/master/spec.md ）之后，1.11版本继续通过许多功能增强CSI。 1.11版本为CSI添加了对原始块体积的alpha支持，将CSI与新的kubelet插件注册机制集成在一起，并且更容易将秘密传递给CSI插件。

 

 

<!--

## New Storage Features

 

Support for online resizing of Persistent Volumes has been introduced as an alpha feature. This enables users to increase the size of PVs without having to terminate pods and unmount volume first. The user will update the PVC to request a new size and kubelet will resize the file system for the PVC.

 

Support for dynamic maximum volume count has been introduced as an alpha feature. This new feature enables in-tree volume plugins to specify the maximum number of volumes that can be attached to a node and allows the limit to vary depending on the type of node. Previously, these limits were hard coded or configured via an environment variable.

 

The StorageObjectInUseProtection feature is now stable and prevents the removal of both Persistent Volumes that are bound to a Persistent Volume Claim, and Persistent Volume Claims that are being used by a pod. This safeguard will help prevent issues from deleting a PV or a PVC that is currently tied to an active pod.

 

Each Special Interest Group (SIG) within the community continues to deliver the most-requested enhancements, fixes, and functionality for their respective specialty areas. For a complete list of inclusions by SIG, please visit the release notes.

-->

 

##新存储功能

 

支持[在线调整持久卷的大小]（https://github.com/kubernetes/features/issues/284 ）已作为alpha功能引入。这使用户可以增加PV的大小，而无需首先终止pod并卸载卷。用户将更新PVC以请求新的大小，并且kubelet将调整PVC的文件系统的大小。

 

支持[动态最大卷数]（https://github.com/kubernetes/features/issues/554 ）已作为alpha功能引入。此新功能使in-卷插件能够指定可附加到节点的最大卷数，并允许限制根据节点类型而变化。以前，这些限制是通过环境变量进行硬编码或配置的。

 

StorageObjectInUseProtection功能现在是稳定的，并且可以防止删除绑定到持久卷声明和[持久卷声明]的[持久卷]（https://github.com/kubernetes/features/issues/499 ） pod正在使用：（http://github.com/kubernetes/features/issues/498 ）。此安全措施有助于防止删除当前绑定到活动窗格的PV或PVC的问题。

 

社区内的每个特殊兴趣小组（SIG）继续为各自的专业领域提供最需要的增强，修复和功能。有关SIG包含的完整列表，请访问[发行说明]（https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md#111-release-notes ）。

 

<!--

## Availability

 

Kubernetes 1.11 is available for download on GitHub. To get started with Kubernetes, check out these interactive tutorials.

 

You can also install 1.11 using Kubeadm. Version 1.11.0 will be available as Deb and RPM packages, installable using the Kubeadm cluster installer sometime on June 28th.

-->

 

＃＃ 可用性

 

Kubernetes 1.11可以[在GitHub上下载]（https://github.com/kubernetes/kubernetes/releases/tag/v1.11.0 ）。 要开始使用Kubernetes，请查看这些[交互式教程]（https://kubernetes.io/docs/tutorials/）。

 

您也可以使用Kubeadm安装1.11。 版本1.11.0将作为Deb和RPM软件包提供，可以在6月28日使用[Kubeadm集群安装程序]（https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/ ）进行安装。

 

<!--

## 4 Day Features Blog Series

 

If you’re interested in exploring these features more in depth, check back in two weeks for our 4 Days of Kubernetes series where we’ll highlight detailed walkthroughs of the following features:

 

* Day 1: IPVS-Based In-Cluster Service Load Balancing Graduates to General Availability

* Day 2: CoreDNS Promoted to General Availability

* Day 3: Dynamic Kubelet Configuration Moves to Beta

* Day 4: Resizing Persistent Volumes using Kubernetes

-->

 

## 4天特色博客系列

 

如果您有兴趣深入探索这些功能，请在两周内回顾我们的4天Kubernetes系列，我们将重点介绍以下功能的详细演练：

 

*第1天：[基于IPVS的集群内服务负载均衡的普遍可用性]（/blog/2018/07/09/ipvs-based-in-cluster-load-balancing-deep-dive/）

*第2天：[CoreDNS升级至广泛可用]（/ blog / 2018/07/10 / coredns-ga-for-kubernetes-cluster-dns /）

*第3天：[动态Kubelet配置转变到Beta]（/ blog / 2018/07/11 / dynamic-kubelet-configuration /）

*第4天：[使用Kubernetes调整持久卷的大小]（/ blog / 2018/07/11 / resizing-persistent-volumes-using-kubernetes /）

 

<!--

## Release team

 

This release is made possible through the effort of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the release team led by Josh Berkus, Kubernetes Community Manager at Red Hat. The 20 individuals on the release team coordinate many aspects of the release, from documentation to testing, validation, and feature completeness.

 

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has over 20,000 individual contributors to date and an active community of more than 40,000 people.

-->

 

##发布团队

 

这一版本是通过数百名提供技术和非技术内容的个人的努力而实现的。 特别感谢红帽公司Kubernetes社区经理Josh Berkus领导的[发布团队]（https://github.com/kubernetes/sig-release/blob/master/releases/release-1.11/release_team.md ）。 发布团队中的20个人协调发布的许多方面，从文档到测试，验证和功能完整性。

 

随着Kubernetes社区的发展，我们的发布过程代表了开源软件开发中的一个惊人的协作演示。 Kubernetes继续迅速获得新用户。 这种增长创造了一个积极的反馈周期，更多的贡献者提交代码，创建一个更有活力的社区。迄今为止，Kubernetes拥有超过20,000名个人贡献者，并拥有超过40,000人的活跃社区。

 

<!--

## Project Velocity

 

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. K8s DevStats illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. On average, 250 different companies and over 1,300 individuals contribute to Kubernetes each month. Check out DevStats to learn more about the overall velocity of the Kubernetes project and community.

-->

 

## Project Velocity

 

CNCF继续完善DevStats，这是一个雄心勃勃的项目，在可视化项目中做了无数贡献。 [K8s DevStats]（https://devstats.k8s.io ）说明了主要公司贡献者的贡献细分，以及一系列令人印象深刻的预配置报告，包括从个人贡献者到拉取请求生命周期时间的所有内容。 平均每个月有250家不同的公司和1,300多人为Kubernetes做贡献。 [查看DevStats]（https://devstats.k8s.io）以了解有关Kubernetes项目和社区整体速度的更多信息。

 

<!--

## User Highlights

 

Established, global organizations are using Kubernetes in production at massive scale. Recently published user stories from the community include:

 

* The New York Times, known as the newspaper of record, moved out of its data centers and into the public cloud with the help of Google Cloud Platform and Kubernetes. This move meant a significant increase in speed of delivery, from 45 minutes to just a few seconds with Kubernetes.

* Nordstrom, a leading fashion retailer based in the U.S., began their cloud native journey by adopting Docker containers orchestrated with Kubernetes. The results included a major increase in Ops efficiency, improving CPU utilization from 5x to 12x depending on the workload.

* Squarespace, a SaaS solution for easily building and hosting websites, moved their monolithic application to microservices with the help of Kubernetes. This resulted in a deployment time reduction of almost 85%.

* Crowdfire, a leading social media management platform, moved from a monolithic application to a custom Kubernetes-based setup. This move reduced deployment time from 15 minutes to less than a minute.

 

Is Kubernetes helping your team? Share your story with the community.

-->

 

##用户亮点

 

已建立的全球性组织正在大规模地使用[Kubernetes in production]（https://kubernetes.io/case-studies/ ）。最近发布的社区用户故事包括：

 

* 纽约时报，被称为记录报纸，[移出其数据中心并进入公共云]（https://kubernetes.io/case-studies/newyorktimes/ ）借助于Google Cloud Platform和Kubernetes。此举意味着Kubernetes的交付速度显着提高，从45分钟缩短到几秒钟。

* 总部位于美国的领先时尚零售商Nordstrom 开始了他们的云原生之旅[采用与Kubernetes协调的Docker容器]（https://kubernetes.io/case-studies/nordstrom/ ）。结果包括Ops效率的大幅提升，将CPU利用率从5倍提高到12倍，具体取决于工作负载。

* ** Squarespace **，一个用于轻松构建和托管网站的SaaS解决方案，[在Kubernetes的帮助下将其整体应用程序移至微服务]（https://kubernetes.io/case-studies/squarespace/ ）。这导致部署时间减少了近85％。

* ** Crowdfire **，一个领先的社交媒体管理平台，从单一的应用程序转移到[基于Kubernetes的自定义设置]（https://kubernetes.io/case-studies/crowdfire/ ）。此举将部署时间从15分钟缩短到不到1分钟。

 

Kubernetes会帮助你的团队吗？与社区分享您的故事。

 

<!--

## Ecosystem Updates

 

* The CNCF recently expanded its certification offerings to include a Certified Kubernetes Application Developer exam. The CKAD exam certifies an individual's ability to design, build, configure, and expose cloud native applications for Kubernetes. More information can be found here.

* The CNCF recently added a new partner category, Kubernetes Training Partners (KTP). KTPs are a tier of vetted training providers who have deep experience in cloud native technology training. View partners and learn more here.

* CNCF also offers online training that teaches the skills needed to create and configure a real-world Kubernetes cluster.

* Kubernetes documentation now features user journeys: specific pathways for learning based on who readers are and what readers want to do. Learning Kubernetes is easier than ever for beginners, and more experienced users can find task journeys specific to cluster admins and application developers.  

-->

 

##生态系统更新

 

* CNCF最近扩展了其认证产品，包括认证的Kubernetes Application Developer考试。 CKAD考试证明了个人为Kubernetes设计，构建，配置和公开云原生应用程序的能力。更多信息可以在[这里]（https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/ ）找到。

* CNCF最近增加了一个新的合作伙伴类别，Kubernetes Training Partners（KTP）。 KTP是经过审核的培训提供商，他们在云本地技术培训方面拥有丰富的经验。查看合作伙伴并了解更多[此处]（https://www.cncf.io/certification/training/ ）。

* CNCF还提供[在线培训]（https://www.cncf.io/certification/training/ ），教授创建和配置真实世界Kubernetes集群所需的技能。

* Kubernetes文档现在具有[用户旅程]（https://k8s.io/docs/home/ ）：基于读者是谁以及读者想要做什么的特定学习途径。学习Kubernetes比初学者更容易，更有经验的用户可以找到特定于集群管理员和应用程序开发人员的任务旅程。

 

<!--

## KubeCon

 

The world’s largest Kubernetes gathering, KubeCon + CloudNativeCon is coming to Shanghai from November 14-15, 2018 and Seattle from December 11-13, 2018. This conference will feature technical sessions, case studies, developer deep dives, salons and more! The CFP for both event is currently open. Submit your talk and register today!

-->

 

## KubeCon

 

世界上最大的Kubernetes聚会，KubeCon + CloudNativeCon将于2018年11月14日至15日在[上海]（https://www.lfasiallc.com/events/kubecon-cloudnativecon-china-2018/ ）和2018年12月11日至13日在[西雅图]（https//events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/ ）举行。此次会议将包括技术会议，案例研究，开发者深度交流，沙龙等等！ 所有活动的CFP目前正在开放。在今天 [提交您的演讲]（https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/program/call-for-proposals-cfp/ ）和[注册]（https：// events。 linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/attend/register/）！

 

<!--

## Webinar

 

Join members of the Kubernetes 1.11 release team on July 31st at 10am PDT to learn about the major features in this release including In-Cluster Load Balancing and the CoreDNS Plugin. Register here.

 

## Get Involved

 

The simplest way to get involved with Kubernetes is by joining one of the many Special Interest Groups (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly community meeting, and through the channels below.

 

Thank you for your continued feedback and support.

 

* Post questions (or answer questions) on Stack Overflow

* Join the community portal for advocates on K8sPort

* Follow us on Twitter @Kubernetesio for latest updates

* Chat with the community on Slack

* Share your Kubernetes story

-->

 

##网络研讨会

 

7月31日上午10点，参加Kubernetes 1.11发布团队成员的会谈，了解该版本的主要功能，包括集群内负载平衡和CoreDNS插件。注册[这里]（https://www.cncf.io/event/webinar-kubernetes-1-11/）。

 

＃＃ 参与其中

 

参与Kubernetes的最简单方法是加入与您的一致的众多[特别兴趣小组]（https://github.com/kubernetes/community/blob/master/sig-list.md ）（SIG）中的一个。你有什么想要向Kubernetes社区广播的吗？在我们的每周[社区会议]（https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting ）以及以下渠道分享您的想法。

 

感谢您的持续反馈和支持。

 

*在[Stack Overflow]上发布问题（或回答问题）（http://stackoverflow.com/questions/tagged/kubernetes ）

*加入[K8sPort]（http://k8sport.org/ ）的倡导者社区门户网站

*在Twitter上关注我们[@Kubernetesio]（https://twitter.com/kubernetesio ）获取最新更新

*在[Slack]上与社区聊天（http://slack.k8s.io/）

*分享您的Kubernetes [故事]（https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform）
