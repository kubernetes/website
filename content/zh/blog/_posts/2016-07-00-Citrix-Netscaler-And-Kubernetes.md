---
title: " Citrix + Kubernetes = A Home Run "
date: 2016-07-14
slug: citrix-netscaler-and-kubernetes
url: /blog/2016/07/Citrix-Netscaler-And-Kubernetes
---

<!--
---
title: " Citrix + Kubernetes = A Home Run "
date: 2016-07-14
slug: citrix-netscaler-and-kubernetes
url: /blog/2016/07/Citrix-Netscaler-And-Kubernetes
---
-->

<!--
_Editor’s note: today’s guest post is by Mikko Disini, a Director of Product Management at Citrix Systems, sharing their collaboration experience on a Kubernetes integration.&nbsp;_  
-->
作者：今天的嘉宾是 Citrix Systems 的产品管理总监 Mikko Disini，他分享了他们在 Kubernetes 集成上的合作经验。&nbsp;_ 

<!--
Technical collaboration is like sports. If you work together as a team, you can go down the homestretch and pull through for a win. That’s our experience with the Google Cloud Platform team.  
-->
技术合作就像体育运动。如果你能像一个团队一样合作，你就能在最后关头取得胜利。这就是我们对谷歌云平台团队的经验。

<!--
Recently, we approached Google Cloud Platform (GCP) to collaborate on behalf of Citrix customers and the broader enterprise market looking to migrate workloads.&nbsp;This migration required including the [NetScaler Docker load balancer](https://www.citrix.com/blogs/2016/06/20/the-best-docker-load-balancer-at-dockercon-in-seattle-this-week/), CPX, into Kubernetes nodes and resolving any issues with getting traffic into the CPX proxies. &nbsp;  
-->
最近，我们与 Google 云平台（GCP）联系，代表 Citrix 客户以及希望迁移工作负载的更广泛的企业市场进行协作。此迁移需要将 [NetScaler Docker 负载均衡器]https://www.citrix.com/blogs/2016/06/20/the-best-docker-load-balancer-at-dockercon-in-seattle-this-week/) CPX 包含到 Kubernetes 节点中，并解决将流量引入 CPX 代理的任何问题。  

<!--
**Why NetScaler and Kubernetes?**  
-->

**为什么是 NetScaler 和 Kubernetes**

<!--
1. Citrix customers want the same Layer 4 to Layer 7 capabilities from NetScaler that they have on-prem as they move to the cloud as they begin deploying their container and microservices architecture with Kubernetes&nbsp;
2. Kubernetes provides a proven infrastructure for running containers and VMs with automated workload delivery
3. NetScaler CPX provides Layer 4 to Layer 7 services and highly efficient telemetry data to a logging and analytics platform, [NetScaler Management and Analytics System](https://www.citrix.com/blogs/2016/05/24/introducing-the-next-generation-netscaler-management-and-analytics-system/)
-->

1. Citrix 的客户希望从 NetScaler 获得与他们在迁移到云计算时相同的第4层到第7层功能，因为他们开始使用 Kubernetes 部署他们的容器和微服务体系结构&nbsp;
2. Kubernetes 为运行带有自动化工作负载交付的容器和 vm 提供了一个经过验证的基础设施 
3. NetScaler CPX 为日志和分析平台 [NetScaler 管理和分析系统](https://www.citrix.com/blogs/2016/05/24/introducing-the-next-generation-netscaler-management-and-analytics-system/) 提供了第4层到第7层的服务和高效的遥测数据。

<!--
I wish all our experiences working together with a technical partner were as good as working with GCP. We had a list of issues to enable our use cases and were able to collaborate swiftly on a solution. To resolve these, GCP team offered in depth technical assistance, working with Citrix such that NetScaler CPX can spin up and take over as a client-side proxy running on each host.&nbsp;  
-->
我希望我们所有与技术合作伙伴一起工作的经验都能像与 GCP 一起工作一样好。我们有一个问题列表来支持我们的用例，并且能够在解决方案上快速协作。为了解决这些问题，GCP 团队提供了深入的技术支持，与 Citrix 合作，这样 NetScaler CPX 就可以在每个主机上作为客户端代理运行。

<!--
Next, NetScaler CPX needed to be inserted in the data path of GCP ingress load balancer so that NetScaler CPX can spread traffic to front end web servers. The NetScaler team made modifications so that NetScaler CPX listens to API server events and configures itself to create a VIP, IP table rules and server rules to take ingress traffic and load balance across front end applications. Google Cloud Platform team provided feedback and assistance to verify modifications made to overcome the technical hurdles. Done!  
-->
接下来，需要在 GCP 入口负载均衡器的数据路径中插入 NetScaler CPX，使 NetScaler CPX 能够将流量分散到前端 web 服务器。NetScaler 团队进行了修改，以便 NetScaler CPX 监听 API 服务器事件，并配置自己来创建 VIP、IP 表规则和服务器规则，以便跨前端应用程序接收流量和负载均衡。谷歌云平台团队提供反馈和帮助，验证为克服技术障碍所做的修改。完成了!

<!--
NetScaler CPX use case is supported in [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads). Citrix customers and the broader enterprise market will have the opportunity to leverage NetScaler with Kubernetes, thereby lowering the friction to move workloads to the cloud.&nbsp;  
-->
NetScaler CPX 用例支持 [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernets-1.3 - bridge -cloud-native-and-enterprise-workload)。Citrix 的客户和更广泛的企业市场将有机会利用 NetScaler 和 Kubernetes，从而降低将工作负载转移到云计算的阻力。&nbsp;

<!--
You can learn more about&nbsp;NetScaler CPX [here](https://www.citrix.com/networking/microservices.html).  
-->
您可以[在此处](https://www.citrix.com/networking/microservices.html)了解有关 NetScaler CPX 的更多信息。

<!--
_&nbsp;-- Mikko Disini, Director of Product Management - NetScaler, Citrix Systems_
-->
_&nbsp;-- Citrix Systems NetScaler 产品管理总监 Mikko Disini

