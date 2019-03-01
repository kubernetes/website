---
title："Kubernetes遇见高性能计算"
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

编者的话：今天的文章由是 Univa 的总经理 Robert Lalonde 撰写，内容是关于支持混合高性能计算和容器化应用程序 &nbsp;

<!--
Anyone who has worked with Docker can appreciate the enormous gains in efficiency achievable with containers. While Kubernetes excels at orchestrating containers, high-performance computing (HPC) applications can be tricky to deploy on Kubernetes.
-->

任何与 Docker 合作过的人都能体会到容器在效率方面的巨大提升。虽然 Kubernetes 擅长编排容器，但在 Kubernetes 上部署高性能计算(HPC) 应用程序可能会非常棘手。

<!--
In this post, I discuss some of the challenges of running HPC workloads with Kubernetes, explain how organizations approach these challenges today, and suggest an approach for supporting mixed workloads on a shared Kubernetes cluster. We will also provide information and links to a case study on a customer, IHME, showing how Kubernetes is extended to service their HPC workloads seamlessly while retaining scalability and interfaces familiar to HPC users.
-->

在本文中，我将讨论使用 Kubernetes 运行 HPC 工作负载的一些挑战，解释组织如何应对当前的这些挑战，并提出一种在共享 Kubernetes 集群上支持混合工作负载的方法。我们还将提供有关客户 IHME 案例研究的信息和链接，展示如何扩展 Kubernetes 以无缝地为其 HPC 工作负载提供服务，同时保留 HPC 用户熟悉的可扩展性和界面。

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

<!--
## Blurring the lines between containers and HPC
-->
## 模糊容器和 HPC 之间的界限

<!--
HPC users believe containers are valuable for the same reasons as other organizations. Packaging logic in a container to make it portable, insulated from environmental dependencies, and easily exchanged with other containers clearly has value. However, making the switch to containers can be difficult.
-->
HPC 用户认为容器的价值与其他组织相同。容器中的封装逻辑使其便于携带，不受环境依赖，并且易于与其他容器交换，这显然具有价值。但是，切换到容器可能很困难。

<!--
HPC workloads are often integrated at the command line level. Rather than requiring coding, jobs are submitted to queues via the command line as binaries or simple shell scripts that act as wrappers. There are literally hundreds of engineering, scientific and analytic applications used by HPC sites that take this approach and have mature and certified integrations with popular workload schedulers.
-->
HPC 工作负载通常在命令行级别集成。作业不是要求编码，而是通过命令行作为二进制文件或作为包装器的简单 shell 脚本提交给队列。 HPC 站点使用了数百种工程，科学和分析应用程序，这些应用程序采用这种方法，并且与流行的工作负载调度程序进行了成熟且经过认证的集成。

<!--
While the notion of packaging a workload into a Docker container, publishing it to a registry, and submitting a YAML description of the workload is second nature to users of Kubernetes, this is foreign to most HPC users. An analyst running models in R, MATLAB or Stata simply wants to submit their simulation quickly, monitor their execution, and get a result as quickly as possible.
-->
虽然将工作负载打包到 Docker 容器，将其发布到注册表以及提交工作负载的 YAML 描述的概念是 Kubernetes 用户的第二天性，但这对于大多数 HPC 用户来说是陌生的。在 R，MATLAB 或 Stata 中运行模型的分析师只想快速提交模拟，监控其执行情况，并尽快获得结果。

<!--
## Existing approaches
-->
## 现有方法

<!--
To deal with the challenges of migrating to containers, organizations running container and HPC workloads have several options:
-->
为了应对迁移到容器的挑战，运行容器和 HPC 工作负载的组织有以下几种选择：

<!--
- Maintain separate infrastructures
-->
- 维护独立的基础设施

<!--
For sites with sunk investments in HPC, this may be a preferred approach. Rather than disrupt existing environments, it may be easier to deploy new containerized applications on a separate cluster and leave the HPC environment alone. The challenge is that this comes at the cost of siloed clusters, increasing infrastructure and management cost.
-->
对于在 HPC 中投资较少的站点，这可能是首选方法。与其破坏现有环境，可能更容易在单独的群集上部署新的容器化应用程序，并使 HPC 环境独立。挑战在于，这是以孤岛集群为代价的，增加了基础设施和管理成本。

<!--
- Run containerized workloads under an existing HPC workload manager
-->
- 在现有 HPC 工作负载管理器下运行容器化工作负载

<!--
For sites running traditional HPC workloads, another approach is to use existing job submission mechanisms to launch jobs that in turn instantiate Docker containers on one or more target hosts. Sites using this approach can introduce containerized workloads with minimal disruption to their environment. Leading HPC workload managers such as [Univa Grid Engine Container Edition](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) and [IBM Spectrum LSF](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) are adding native support for Docker containers. [Shifter](https://github.com/NERSC/shifter) and [Singularity](http://singularity.lbl.gov/) are important open source tools supporting this type of deployment also. While this is a good solution for sites with simple requirements that want to stick with their HPC scheduler, they will not have access to native Kubernetes features, and this may constrain flexibility in managing long-running services where Kubernetes excels.
-->
对于运行传统 HPC 工作负载的站点，另一种方法是使用现有作业提交机制来启动作业，然后在一个或多个目标主机上实例化 Docker 容器。使用此方法的站点可以引入容器化工作负载，同时将对环境的干扰降至最低。领先的 HPC 工作负载管理器，如 [Univa Grid Engine Container Edition](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) 和 [IBM Spectrum LSF](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) 正在为 Docker 容器添加本机支持。 [Shifter](https://github.com/NERSC/shifter) 和 [Singularity](http://singularity.lbl.gov/) 也是支持此类部署的重要开源工具。虽然对于需要坚持使用 HPC 调度程序的简单需求的站点来说这是一个很好的解决方案，但是他们无法访问本地 Kubernetes 功能，这可能会限制管理 Kubernetes 擅长的长期运行服务的灵活性。

<!--
- Use native job scheduling features in Kubernetes
-->
- 使用Kubernetes中的本机作业调度功能

<!--
Sites less invested in existing HPC applications can use existing scheduling facilities in Kubernetes for [jobs that run to completion](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). While this is an option, it may be impractical for many HPC users. HPC applications are often either optimized towards massive throughput or large scale parallelism. In both cases startup and teardown latencies have a discriminating impact. Latencies that appear to be acceptable for containerized microservices today would render such applications unable to scale to the required levels.
-->
在现有 HPC 应用程序上投资较少的站点可以使用 Kubernetes 中的现有调度工具来[完成运行的作业](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)。虽然这是一种选择，但对于许多 HPC 用户来说可能是不切实际的。 HPC 应用程序通常针对大规模吞吐量或大规模并行性进行优化。在这两种情况下，启动和拆卸延迟都会产生歧视性影响。今天容器化微服务似乎可以接受的延迟会使这些应用无法扩展到所需的水平。

<!--
All of these solutions involve tradeoffs. The first option doesn’t allow resources to be shared (increasing costs) and the second and third options require customers to pick a single scheduler, constraining future flexibility.
-->
所有这些解决方案都涉及权衡。第一个选项不允许共享资源(增加成本)，第二个和第三个选项要求客户选择单个调度程序，从而限制未来的灵活性。

<!--
## Mixed workloads on Kubernetes
-->
## Kubernetes 的混合工作负载

<!--
A better approach is to support HPC and container workloads natively in the same shared environment. Ideally, users should see the environment appropriate to their workload or workflow type.
-->
更好的方法是在同一共享环境中本地支持 HPC 和容器工作负载。理想情况下，用户应该看到适合其工作负载或工作流类型的环境。

<!--
One approach to supporting mixed workloads is to allow Kubernetes and the HPC workload manager to co-exist on the same cluster, throttling resources to avoid conflicts. While simple, this means that neither workload manager can fully utilize the cluster.
-->
支持混合工作负载的一种方法是允许 Kubernetes 和 HPC 工作负载管理器共存于同一个集群上，限制资源以避免冲突。虽然简单，但这意味着工作负载管理器都无法充分利用群集。

<!--
Another approach is to use a peer scheduler that coordinates with the Kubernetes scheduler. Navops Command by Univa is a solution that takes this third approach, augmenting the functionality of the Kubernetes scheduler. Navops Command provides its own web interface and CLI and allows additional scheduling policies to be enabled on Kubernetes without impacting the operation of the Kubernetes scheduler and existing containerized applications. Navops Command plugs into the Kubernetes architecture via the 'schedulerName' attribute in the pod spec as a peer scheduler that workloads can choose to use instead of the Kubernetes stock scheduler as shown below.
-->
另一种方法是使用与 Kubernetes 调度程序协调的对等调度程序。 Univa 的 Navops Command 是一种采用第三种方法的解决方案，增强了 Kubernetes 调度程序的功能。 Navops Command 提供了自己的 Web 界面和 CLI，允许在 Kubernetes 上启用其他调度策略，而不会影响 Kubernetes 调度程序和现有容器化应用程序的运行。 Navops Command 通过 pod 规范中的 'schedulerName' 属性作为对等调度程序插入 Kubernetes 体系结构，工作负载可以选择使用而不是 Kubernetes stock 调度程序，如下所示。

<!--
![Screen Shot 2017-08-15 at 9.15.45 AM.png](https://lh6.googleusercontent.com/nKTtfQVVmL4qBoSR0lBmBuLt8KOrVEyjn9YcAu7hrhhV-rwnxRY3p-Y5Qfddf7BI6u1KN85VKfeaaU74xDl-oDk5NzybdIxAp0SJ42x14gwzpmwLwjVy5nIng6K8Ih-bRDlOmA9j)
-->
 ![屏幕截图2017-08-15 at 9.15.45 AM.png](https://lh6.googleusercontent.com/nKTtfQVVmL4qBoSR0lBmBuLt8KOrVEyjn9YcAu7hrhhV-rwnxRY3p-Y5Qfddf7BI6u1KN85VKfeaaU74xDl-oDk5NzybdIxAp0SJ42x14gwzpmwLwjVy5nIng6K8Ih-bRDlOmA9j)

<!--
With this approach, Kubernetes acts as a resource manager, making resources available to a separate HPC scheduler. Cluster administrators can use a visual interface to allocate resources based on policy or simply drag sliders via a web UI to allocate different proportions of the Kubernetes environment to non-container (HPC) workloads, and native Kubernetes applications and services.
-->
通过这种方法，Kubernetes 充当资源管理器，使资源可用于单独的 HPC 调度程序。群集管理员可以使用可视界面根据策略分配资源，或者只需通过 Web UI 拖动滑块，即可将不同比例的 Kubernetes 环境分配给非容器 (HPC) 工作负载和本机 Kubernetes 应用程序和服务。

<!--
 ![](https://lh6.googleusercontent.com/wSBBl5d-YL4_UCYgvHpE_XzijtqftSi6PTHJLGfHr5nAxmTj945jQB-pMNIGLovWwKWGnEsPjCkCPrUMWZEs9UHnQPPDSWPEl-Gl76Yczd-Yn65pEE8mKC-Asj3zP5xyfZc-r2qU-YmmOyBhLQ)
-->
 ![](https://lh6.googleusercontent.com/wSBBl5d-YL4_UCYgvHpE_XzijtqftSi6PTHJLGfHr5nAxmTj945jQB-pMNIGLovWwKWGnEsPjCkCPrUMWZEs9UHnQPPDSWPEl-Gl76Yczd-Yn65pEE8mKC-Asj3zP5xyfZc-r2qU-YmmOyBhLQ)

<!--
From a client perspective, the HPC scheduler runs as a service deployed in Kubernetes pods, operating just as it would on a bare metal cluster. Navops Command provides additional scheduling features including things like resource reservation, run-time quotas, workload preemption and more. This environment works equally well for on-premise, cloud-based or hybrid deployments.
-->
从客户端的角度来看，HPC 调度程序作为部署在 Kubernetes pod 中的服务运行，就像在裸机群集上一样运行。 Navops Command 提供其他调度功能，包括资源预留，运行时配额，工作负载抢占等。此环境同样适用于内部部署，基于云或混合部署。

<!--
## Deploying mixed workloads at IHME
-->
## 在 IHME 部署混合工作负载

<!--
One client having success with mixed workloads is the Institute for Health Metrics & Evaluation (IHME), an independent health research center at the University of Washington. In support of their globally recognized Global Health Data Exchange (GHDx), IHME operates a significantly sized environment comprised of 500 nodes and 20,000 cores running a mix of analytic, HPC, and container-based applications on Kubernetes. [This case study](http://navops.io/ihme-case-study.html) describes IHME’s success hosting existing HPC workloads on a shared Kubernetes cluster using Navops Command.
-->
一个在混合工作负载方面取得成功的客户是华盛顿大学独立的健康研究中心健康指标与评估研究所 (IHME)。为支持其全球公认的全球健康数据交换 (GHDx)，IHME 运营着一个规模相当大的环境，包括500个节点和20,000个核心，在 Kubernetes 上运行分析，HPC 和基于容器的应用程序。 [案例研究](http://navops.io/ihme-case-study.html) 描述了 IHME 使用 Navops Command 在共享 Kubernetes 集群上托管现有 HPC 工作负载的成功。

<!--
![](https://lh5.googleusercontent.com/GJeP6e89r6drl72yzZM_OsZ81MYDp7Zm5xEFpItpmioian3lOp535H4jy1_eELKrzGMYr_wnjGwpK3Uku9dwg2-vqmMC1A1GrMtJc-PZR6GR6Z-fAZNJMEr_Uw3HqvWvi86mF_63XTozysaLpg)
-->
 ![](https://lh5.googleusercontent.com/GJeP6e89r6drl72yzZM_OsZ81MYDp7Zm5xEFpItpmioian3lOp535H4jy1_eELKrzGMYr_wnjGwpK3Uku9dwg2-vqmMC1A1GrMtJc-PZR6GR6Z-fAZNJMEr_Uw3HqvWvi86mF_63XTozysaLpg)

<!--
For sites deploying new clusters that want access to the rich capabilities in Kubernetes but need the flexibility to run non-containerized workloads, this approach is worth a look. It offers the opportunity for sites to share infrastructure between Kubernetes and HPC workloads without disrupting existing applications and businesses processes. It also allows them to migrate their HPC workloads to use Docker containers at their own pace.
-->
对于部署需要访问 Kubernetes 中的丰富功能但需要灵活运行非容器化工作负载的新集群的站点，这种方法值得一看。它为站点提供了在 Kubernetes 和 HPC 工作负载之间共享基础架构的机会，而不会中断现有的应用程序和业务流程。它还允许他们按照自己的节奏迁移 HPC 工作负载以使用 Docker 容器。
