---
title：“Kubernetes遇见高性能计算”
date：2017-08-22
slug: kubernetes-meets-high-performance
url: /blog/2017/08/Kubernetes-Meets-High-Performance
---

<!--
---
title: " Kubernetes Meets High-Performance Computing "
date: 2017-08-22
slug: kubernetes-meets-high-performance
url: /blog/2017/08/Kubernetes-Meets-High-Performance
---
-->

<!--
Editor's note: today's post is by Robert Lalonde, general manager at Univa, on supporting mixed HPC and containerized applications &nbsp;
-->

编者按：今天的帖子是 Univa 总经理 Robert Lalonde 关于支持混合 HPC 和容器化应用程序的帖子&nbsp;

<!--
Anyone who has worked with Docker can appreciate the enormous gains in efficiency achievable with containers. While Kubernetes excels at orchestrating containers, high-performance computing (HPC) applications can be tricky to deploy on Kubernetes.
-->

任何与Docker合作过的人都可以体会到容器可实现的效率的巨大提升。虽然Kubernetes擅长编排容器，但在Kubernetes上部署高性能计算（HPC）应用程序可能会非常棘手。

<!--
In this post, I discuss some of the challenges of running HPC workloads with Kubernetes, explain how organizations approach these challenges today, and suggest an approach for supporting mixed workloads on a shared Kubernetes cluster. We will also provide information and links to a case study on a customer, IHME, showing how Kubernetes is extended to service their HPC workloads seamlessly while retaining scalability and interfaces familiar to HPC users.
-->

在本文中，我将讨论使用Kubernetes运行HPC工作负载的一些挑战，解释组织如何应对当前的这些挑战，并提出一种在共享Kubernetes集群上支持混合工作负载的方法。我们还将提供有关客户IHME案例研究的信息和链接，展示如何扩展Kubernetes以无缝地为其HPC工作负载提供服务，同时保留HPC用户熟悉的可扩展性和界面。

<!--
## HPC workloads unique challenges
-->

## HPC 工作负载的独特挑战

<!--
In Kubernetes, the base unit of scheduling is a Pod: one or more Docker containers scheduled to a cluster host. Kubernetes assumes that workloads are containers. While Kubernetes has the notion of [Cron Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) and [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) that run to completion, applications deployed on Kubernetes are typically long-running services, like web servers, load balancers or data stores and while they are highly dynamic with pods coming and going, they differ greatly from HPC application patterns.
-->
在 Kubernetes 中，调度的基-本单位是 Pod：一个或多个计划到集群主机的 Docker 容器。 Kubernetes 假设工作负载是容器。虽然 Kubernetes 有 [Cron Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) 和 [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的概念运行完成，部署在 Kubernetes 上的应用程序通常是长期运行的服务，如 Web 服务器，负载均衡器或数据存储，虽然它们是高度动态的，随着 pod 的进出，它们与 HPC 应用程序模式有很大不同。

<!--
Traditional HPC applications often exhibit different characteristics:
-->
传统 HPC 应用程序通常具有不同的特征：

<!--
- In financial or engineering simulations, a job may be comprised of tens of thousands of short-running tasks, demanding low-latency and high-throughput scheduling to complete a simulation in an acceptable amount of time.
- A computational fluid dynamics (CFD) problem may execute in parallel across many hundred or even thousands of nodes using a message passing library to synchronize state. This requires specialized scheduling and job management features to allocate and launch such jobs and then to checkpoint, suspend/resume or backfill them.
- Other HPC workloads may require specialized resources like GPUs or require access to limited software licenses. Organizations may enforce policies around what types of resources can be used by whom to ensure projects are adequately resourced and deadlines are met.
-->
 - 在财务或工程模拟中，作业可能由数万个短期运行任务组成，要求低延迟和高吞吐量调度以在可接受的时间内完成模拟。
 - 计算流体动力学 (CFD) 问题可以使用消息传递库来同步状态，在数百个甚至数千个节点上并行执行。这需要专门的调度和作业管理功能来分配和启动此类作业，然后检查点，暂停/恢复或回填它们。
 - 其他 HPC 工作负载可能需要 GPU 等专用资源，或者需要访问有限的软件许可证。组织可以围绕谁可以使用哪些类型的资源来执行策略，以确保项目资源充足并且满足最后期限。
 
<!--
HPC workload schedulers have evolved to support exactly these kinds of workloads. Examples include [Univa Grid Engine](http://www.univa.com/products/), [IBM Spectrum LSF](https://www-03.ibm.com/systems/spectrum-computing/products/lsf/) and Altair’s [PBS Professional](http://www.pbsworks.com/PBSProduct.aspx?n=PBS-Professional&c=Overview-and-Capabilities). Sites managing HPC workloads have come to rely on capabilities like array jobs, configurable pre-emption, user, group or project based quotas and a variety of other features.  
-->
HPC 工作负载调度程序已经发展为支持这些类型的工作负载。示例包括 [Univa Grid Engine](http://www.univa.com/products/),[IBM Spectrum LSF](https://www-03.ibm.com/systems/spectrum-computing/products/lsf/) 和 Altair 的 [PBS Professional](http://www.pbsworks.com/PBSProduct.aspx?n=PBS-Professional&c=Overview-and-Capabilities)。管理 HPC 工作负载的站点已经开始依赖于阵列作业，可配置抢占，基于用户，组或项目的配额以及各种其他功能等功能。

##模糊容器和HPC之间的界限

HPC用户认为容器的价值与其他组织相同。容器中的封装逻辑使其便于携带，不受环境依赖，并且易于与其他容器交换，这显然具有价值。但是，切换到容器可能很困难。

HPC工作负载通常在命令行级别集成。作业不是要求编码，而是通过命令行作为二进制文件或作为包装器的简单shell脚本提交给队列。 HPC站点使用了数百种工程，科学和分析应用程序，这些应用程序采用这种方法，并且与流行的工作负载调度程序进行了成熟且经过认证的集成。

虽然将工作负载打包到Docker容器，将其发布到注册表以及提交工作负载的YAML描述的概念是Kubernetes用户的第二天性，但这对于大多数HPC用户来说是陌生的。在R，MATLAB或Stata中运行模型的分析师只想快速提交模拟，监控其执行情况，并尽快获得结果。

##现有方法

为了应对迁移到容器的挑战，运行容器和HPC工作负载的组织有以下几种选择：

 - 维护独立的基础设施

对于在HPC中投资较少的站点，这可能是首选方法。与其破坏现有环境，可能更容易在单独的群集上部署新的容器化应用程序，并使HPC环境独立。挑战在于，这是以孤岛集群为代价的，增加了基础设施和管理成本。
 - 在现有HPC工作负载管理器下运行容器化工作负载

对于运行传统HPC工作负载的站点，另一种方法是使用现有作业提交机制来启动作业，然后在一个或多个目标主机上实例化Docker容器。使用此方法的站点可以引入容器化工作负载，同时将对环境的干扰降至最低。领先的HPC工作负载管理器，如[Univa Grid Engine Container Edition]（http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/）和[IBM Spectrum LSF]（http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/）正在为Docker容器添加本机支持。 [Shifter]（https://github.com/NERSC/shifter）和[Singularity]（http://singularity.lbl.gov/）也是支持此类部署的重要开源工具。虽然对于需要坚持使用HPC调度程序的简单需求的站点来说这是一个很好的解决方案，但是他们无法访问本地Kubernetes功能，这可能会限制管理Kubernetes擅长的长期运行服务的灵活性。

 - 使用Kubernetes中的本机作业调度功能

在现有HPC应用程序上投资较少的站点可以使用Kubernetes中的现有调度工具来[完成运行的作业]（https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/）。虽然这是一种选择，但对于许多HPC用户来说可能是不切实际的。 HPC应用程序通常针对大规模吞吐量或大规模并行性进行优化。在这两种情况下，启动和拆卸延迟都会产生歧视性影响。今天容器化微服务似乎可以接受的延迟会使这些应用无法扩展到所需的水平。

所有这些解决方案都涉及权衡。第一个选项不允许共享资源（增加成本），第二个和第三个选项要求客户选择单个调度程序，从而限制未来的灵活性。

## Kubernetes的混合工作负载

更好的方法是在同一共享环境中本地支持HPC和容器工作负载。理想情况下，用户应该看到适合其工作负载或工作流类型的环境。

支持混合工作负载的一种方法是允许Kubernetes和HPC工作负载管理器共存于同一个集群上，限制资源以避免冲突。虽然简单，但这意味着工作负载管理器都无法充分利用群集。

另一种方法是使用与Kubernetes调度程序协调的对等调度程序。 Univa的Navops Command是一种采用第三种方法的解决方案，增强了Kubernetes调度程序的功能。 Navops Command提供了自己的Web界面和CLI，允许在Kubernetes上启用其他调度策略，而不会影响Kubernetes调度程序和现有容器化应用程序的运行。 Navops Command通过pod规范中的'schedulerName'属性作为对等调度程序插入Kubernetes体系结构，工作负载可以选择使用而不是Kubernetes stock调度程序，如下所示。

 ！[屏幕截图2017-08-15 at 9.15.45 AM.png]（https://lh6.googleusercontent.com/nKTtfQVVmL4qBoSR0lBmBuLt8KOrVEyjn9YcAu7hrhhV-rwnxRY3p-Y5Qfddf7BI6u1KN85VKfeaaU74xDl-oDk5NzybdIxAp0S​​J42x14gwzpmwLwjVy5nIng6K8Ih-bRDlOmA9j）

通过这种方法，Kubernetes充当资源管理器，使资源可用于单独的HPC调度程序。群集管理员可以使用可视界面根据策略分配资源，或者只需通过Web UI拖动滑块，即可将不同比例的Kubernetes环境分配给非容器（HPC）工作负载和本机Kubernetes应用程序和服务。

 ！[]（https://lh6.googleusercontent.com/wSBBl5d-YL4_UCYgvHpE_XzijtqftSi6PTHJLGfHr5nAxmTj945jQB-pMNIGLovWwKWGnEsPjCkCPrUMWZEs9UHnQPPDSWPEl-Gl76Yczd-Yn65pEE8mKC-Asj3zP5xyfZc-r2qU-YmmOyBhLQ）

从客户端的角度来看，HPC调度程序作为部署在Kubernetes pod中的服务运行，就像在裸机群集上一样运行。 Navops Command提供其他调度功能，包括资源预留，运行时配额，工作负载抢占等。此环境同样适用于内部部署，基于云或混合部署。
##在IHME部署混合工作负载

一个在混合工作负载方面取得成功的客户是华盛顿大学独立的健康研究中心健康指标与评估研究所（IHME）。为支持其全球公认的全球健康数据交换（GHDx），IHME运营着一个规模相当大的环境，包括500个节点和20,000个核心，在Kubernetes上运行分析，HPC和基于容器的应用程序。 [本案例研究]（http://navops.io/ihme-case-study.html）描述了IHME使用Navops Command在共享Kubernetes集群上托管现有HPC工作负载的成功。

 ！[]（https://lh5.googleusercontent.com/GJeP6e89r6drl72yzZM_OsZ81MYDp7Zm5xEFpItpmioian3lOp535H4jy1_eELKrzGMYr_wnjGwpK3Uku9dwg2-vqmMC1A1GrMtJc-PZR6GR6Z-fAZNJMEr_Uw3HqvWvi86mF_63XTozysaLpg）

对于部署需要访问Kubernetes中的丰富功能但需要灵活运行非容器化工作负载的新集群的站点，这种方法值得一看。它为站点提供了在Kubernetes和HPC工作负载之间共享基础架构的机会，而不会中断现有的应用程序和业务流程。它还允许他们按照自己的节奏迁移HPC工作负载以使用Docker容器。
