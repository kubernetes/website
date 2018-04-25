<!--
---
approvers:
- bgrant0607
- mikedanese
title: What is Kubernetes?
---
-->
---
approvers:
- bgrant0607
- mikedanese
title: 认识 Kubernetes?
---

{% capture overview %}
<!--This page is an overview of Kubernetes.-->
此页面是对 Kubernetes 的概要介绍。
{% endcapture %}

{% capture body %}
<!--
Kubernetes is an [open-source platform designed to automate deploying, scaling, and operating application containers](http://www.slideshare.net/BrianGrant11/wso2con-us-2015-kubernetes-a-platform-for-automating-deployment-scaling-and-operations).

With Kubernetes, you are able to quickly and efficiently respond to customer demand:

 - Deploy your applications quickly and predictably.
 - Scale your applications on the fly.
 - Roll out new features seamlessly.
 - Limit hardware usage to required resources only.

Our goal is to foster an ecosystem of components and tools that relieve the burden of running applications in public and private clouds.
-->
Kubernetes 是一个 [开源平台，旨在提供自动部署、扩展和运行应用程序容器](http://www.slideshare.net/BrianGrant11/wso2con-us-2015-kubernetes-a-platform-for-automating-deployment-scaling-and-operations)。

使用 Kubernetes, 您可以快速高效地响应客户需求:

 - 快速、可预测地部署您的应用程序
 - 拥有即时扩展应用程序的能力
 - 不影响现有业务的情况下，无缝地发布新功能
 - 优化硬件资源，降低成本

我们的目标是构建一个软件和工具的生态系统，以减轻您在公共云或私有云运行应用程序的负担。
<!--
#### Kubernetes is

* **Portable**: public, private, hybrid, multi-cloud
* **Extensible**: modular, pluggable, hookable, composable
* **Self-healing**: auto-placement, auto-restart, auto-replication, auto-scaling

Google started the Kubernetes project in 2014. Kubernetes builds upon a [decade and a half of experience that Google has with running production workloads at scale](https://research.google.com/pubs/pub43438.html), combined with best-of-breed ideas and practices from the community.
-->
#### Kubernetes 具有如下特点:

* **便携性**: 无论公有云、私有云、混合云还是多云架构都全面支持
* **可扩展**: 它是模块化、可插拔、可挂载、可组合的，支持各种形式的扩展
* **自修复**: 它可以自保持应用状态、可自重启、自复制、自缩放的，通过声明式语法提供了强大的自修复能力

Kubernetes 项目由 Google 公司在 2014 年启动。Kubernetes 建立在 [Google 公司超过十余年的运维经验基础之上，Google 所有的应用都运行在容器上](https://research.google.com/pubs/pub43438.html), 再与社区中最好的想法和实践相结合，也许它是最受欢迎的容器平台。

<!--
## Why containers?

Looking for reasons why you should be using [containers](https://aucouranton.com/2014/06/13/linux-containers-parallels-lxc-openvz-docker-and-more/)?

![Why Containers?](/images/docs/why_containers.svg)
-->
## 为什么是容器?

查看此文，可以了解为什么您要使用容器 [容器](http://aucouranton.com/2014/06/13/linux-containers-parallels-lxc-openvz-docker-and-more/)?

![为什么是容器?](/images/docs/why_containers.svg)
<!--
The *Old Way* to deploy applications was to install the applications on a host using the operating system package manager. This had the disadvantage of entangling the applications' executables, configuration, libraries, and lifecycles with each other and with the host OS. One could build immutable virtual-machine images in order to achieve predictable rollouts and rollbacks, but VMs are heavyweight and non-portable.

The *New Way* is to deploy containers based on operating-system-level virtualization rather than hardware virtualization. These containers are isolated from each other and from the host: they have their own filesystems, they can't see each others' processes, and their computational resource usage can be bounded. They are easier to build than VMs, and because they are decoupled from the underlying infrastructure and from the host filesystem, they are portable across clouds and OS distributions.
-->
*传统* 部署应用程序的方式，一般是使用操作系统自带的包管理器在主机上安装应用依赖，之后再安装应用程序。这无疑将应用程序的可执行文件、应用的配置、应用依赖库和应用的生命周期与宿主机操作系统进行了紧耦合。在此情境下，可以通过构建不可改变的虚拟机镜像版本，通过镜像版本实现可预测的发布和回滚，但是虚拟机实在是太重量级了，且镜像体积太庞大，便捷性差。

*新方式* 是基于操作系统级虚拟化而不是硬件级虚拟化方法来部署容器。容器之间彼此隔离并与主机隔离：它们具有自己的文件系统，不能看到彼此的进程，并且它们所使用的计算资源是可以被限制的。它们比虚拟机更容易构建，并且因为它们与底层基础架构和主机文件系统隔离，所以它们可以跨云和操作系统快速分发。
<!--
Because containers are small and fast, one application can be packed in each container image. This one-to-one application-to-image relationship unlocks the full benefits of containers. With containers, immutable container images can be created at build/release time rather than deployment time, since each application doesn't need to be composed with the rest of the application stack, nor married to the production infrastructure environment. Generating container images at build/release time enables a consistent environment to be carried from development into production.
Similarly, containers are vastly more transparent than VMs, which facilitates monitoring and management. This is especially true when the containers' process lifecycles are managed by the infrastructure rather than hidden by a process supervisor inside the container. Finally, with a single application per container, managing the containers becomes tantamount to managing deployment of the application.
-->
由于容器体积小且启动快，因此可以在每个容器镜像中打包一个应用程序。这种一对一的应用镜像关系拥有很多好处。使用容器，不需要与外部的基础架构环境绑定, 因为每一个应用程序都不需要外部依赖，更不需要与外部的基础架构环境依赖。完美解决了从开发到生产环境的一致性问题。

容器同样比虚拟机更加透明，这有助于监测和管理。尤其是容器进程的生命周期由基础设施管理，而不是由容器内的进程对外隐藏时更是如此。最后，每个应用程序用容器封装，管理容器部署就等同于管理应用程序部署。
<!--
Summary of container benefits:

* **Agile application creation and deployment**:
    Increased ease and efficiency of container image creation compared to VM image use.
* **Continuous development, integration, and deployment**:
    Provides for reliable and frequent container image build and deployment with quick and easy rollbacks (due to image immutability).
* **Dev and Ops separation of concerns**:
    Create application container images at build/release time rather than deployment time, thereby decoupling applications from infrastructure.
* **Environmental consistency across development, testing, and production**:
    Runs the same on a laptop as it does in the cloud.
* **Cloud and OS distribution portability**:
    Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Container Engine, and anywhere else.
* **Application-centric management**:
    Raises the level of abstraction from running an OS on virtual hardware to run an application on an OS using logical resources.
* **Loosely coupled, distributed, elastic, liberated [micro-services](https://martinfowler.com/articles/microservices.html)**:
    Applications are broken into smaller, independent pieces and can be deployed and managed dynamically -- not a fat monolithic stack running on one big single-purpose machine.
* **Resource isolation**:
    Predictable application performance.
* **Resource utilization**:
    High efficiency and density.
-->
容器优点摘要:

* **敏捷的应用程序创建和部署**:
    与虚拟机镜像相比，容器镜像更容易创建，提升了硬件的使用效率。
* **持续开发、集成和部署**:
    提供可靠与频繁的容器镜像构建和部署，可以很方便及快速的回滚 (由于镜像不可变性).
* **关注开发与运维的分离**:
    在构建/发布时创建应用程序容器镜像，从而将应用程序与基础架构分离。
* **开发、测试和生产环境的一致性**:
    在笔记本电脑上运行与云中一样。
* **云和操作系统的可移植性**:
    可运行在 Ubuntu, RHEL, CoreOS, 内部部署, Google 容器引擎和其他任何地方。
* **以应用为中心的管理**:
    提升了操作系统的抽象级别，以便在使用逻辑资源的操作系统上运行应用程序。
* **松耦合、分布式、弹性伸缩 [微服务](http://martinfowler.com/articles/microservices.html)**:
    应用程序被分成更小，更独立的部分，可以动态部署和管理 - 而不是巨型单体应用运行在专用的大型机上。
* **资源隔离**:
    通过对应用进行资源隔离，可以很容易的预测应用程序性能。
* **资源利用**:
    高效率和高密度。
<!--
#### Why do I need Kubernetes and what can it do?

At a minimum, Kubernetes can schedule and run application containers on clusters of physical or virtual machines. However, Kubernetes also allows developers to 'cut the cord' to physical and virtual machines, moving from a **host-centric** infrastructure to a **container-centric** infrastructure, which provides the full advantages and benefits inherent to containers. Kubernetes provides the infrastructure to build a truly **container-centric** development environment.
-->
#### 为什么我们需要 Kubernetes，它能做什么?

最基础的，Kubernetes 可以在物理或虚拟机集群上调度和运行应用程序容器。然而，Kubernetes 还允许开发人员从物理和虚拟机'脱离'，从以**主机为中心**的基础架构转移到以**容器为中心**的基础架构，这样可以提供容器固有的全部优点和益处。Kubernetes 提供了基础设施来构建一个真正以**容器为中心**的开发环境。
<!--
Kubernetes satisfies a number of common needs of applications running in production, such as:

* [Co-locating helper processes](/docs/concepts/workloads/pods/pod/), facilitating composite applications and preserving the one-application-per-container model
* [Mounting storage systems](/docs/concepts/storage/volumes/)
* [Distributing secrets](/docs/concepts/configuration/secret/)
* [Checking application health](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
* [Replicating application instances](/docs/concepts/workloads/controllers/replicationcontroller/)
* [Using Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
* [Naming and discovering](/docs/concepts/services-networking/connect-applications-service/)
* [Balancing loads](/docs/concepts/services-networking/service/)
* [Rolling updates](/docs/tasks/run-application/rolling-update-replication-controller/)
* [Monitoring resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Accessing and ingesting logs](/docs/concepts/cluster-administration/logging/)
* [Debugging applications](/docs/tasks/debug-application-cluster/debug-application-introspection/)
* [Providing authentication and authorization](/docs/admin/authorization/)

This provides the simplicity of Platform as a Service (PaaS) with the flexibility of Infrastructure as a Service (IaaS), and facilitates portability across infrastructure providers.
-->
Kubernetes 满足了生产中运行应用程序的许多常见的需求，例如：

* [Pod](/docs/user-guide/pods/) 提供复合应用并保留一个应用一个容器的容器模型,
* [挂载外部存储](/docs/user-guide/volumes/),
* [Secret管理](/docs/user-guide/secrets/),
* [应用健康检查](/docs/user-guide/production-pods/#liveness-and-readiness-probes-aka-health-checks),
* [副本应用实例](/docs/user-guide/replication-controller/),
* [横向自动扩缩容](/docs/user-guide/horizontal-pod-autoscaling/),
* [服务发现](/docs/user-guide/connecting-applications/),
* [负载均衡](/docs/user-guide/services/),
* [滚动更新](/docs/user-guide/update-demo/),
* [资源监测](/docs/user-guide/monitoring/),
* [日志采集和存储](/docs/user-guide/logging/overview/),
* [支持自检和调试](/docs/user-guide/introspection-and-debugging/),
* [认证和鉴权](/docs/admin/authorization/).

这提供了平台即服务 (PAAS) 的简单性以及基础架构即服务 (IAAS) 的灵活性，并促进跨基础设施供应商的可移植性。
<!--
#### How is Kubernetes a platform?

Even though Kubernetes provides a lot of functionality, there are always new scenarios that would benefit from new features. Application-specific workflows can be streamlined to accelerate developer velocity. Ad hoc orchestration that is acceptable initially often requires robust automation at scale. This is why Kubernetes was also designed to serve as a platform for building an ecosystem of components and tools to make it easier to deploy, scale, and manage applications.
-->
#### 为什么 Kubernetes 是一个平台?

Kubernetes 提供了很多的功能，总会有新的场景受益于新特性。它可以简化应用程序的工作流，加快开发速度。被大家认可的应用编排通常需要有较强的自动化能力。这就是为什么 Kubernetes 被设计作为构建组件和工具的生态系统平台，以便更轻松地部署、扩展和管理应用程序。
<!--
[Labels](/docs/concepts/overview/working-with-objects/labels/) empower users to organize their resources however they please. [Annotations](/docs/concepts/overview/working-with-objects/annotations/) enable users to decorate resources with custom information to facilitate their workflows and provide an easy way for management tools to checkpoint state.
-->
[Label](/docs/user-guide/labels/) 允许用户按照自己的方式组织管理对应的资源。
[Annotations](/docs/user-guide/annotations/) 使用户能够以自定义的描述信息来修饰资源，以适用于自己的工作流，并为管理工具提供检查点状态的简单方法。

<!--
Additionally, the [Kubernetes control plane](/docs/concepts/overview/components/) is built upon the same [APIs](/docs/reference/api-overview/) that are available to developers and users. Users can write their own controllers, such as [schedulers](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/scheduler.md), with [their own APIs](https://git.k8s.io/community/contributors/design-proposals/extending-api.md) that can be targeted by a general-purpose [command-line tool](/docs/user-guide/kubectl-overview/).

This [design](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/principles.md) has enabled a number of other systems to build atop Kubernetes.
-->
此外，[Kubernetes 控制面 (Controll Plane)](/docs/admin/cluster-components) 是构建在相同的 [APIs](/docs/api/) 上面，开发人员和用户都可以用。用户可以编写自己的控制器， [调度器](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/scheduler.md)等等，如果这么做，根据新加的[自定义 API](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/extending-api.md) ，可以扩展当前的通用 [CLI 命令行工具](/docs/user-guide/kubectl-overview/)。

这种 [设计](https://git.k8s.io/community/contributors/design-proposals/principles.md) 使得许多其他系统可以构建在 Kubernetes 之上。

<!--
#### What Kubernetes is not

Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system. It preserves user choice where it is important.
-->
#### Kubernetes 不是什么:

Kubernetes 不是一个传统意义上，包罗万象的 PaaS (平台即服务) 系统。我们保留用户选择的自由，这非常重要。

Kubernetes:
<!--
* Does not limit the types of applications supported. It does not dictate application frameworks (e.g., [Wildfly](http://wildfly.org/)), restrict the set of supported language runtimes (for example, Java, Python, Ruby), cater to only [12-factor applications](https://12factor.net/), nor distinguish *apps* from *services*. Kubernetes aims to support an extremely diverse variety of workloads, including stateless, stateful, and data-processing workloads. If an application can run in a container, it should run great on Kubernetes.
* Does not provide middleware (e.g., message buses), data-processing frameworks (for example, Spark), databases (e.g., mysql), nor cluster storage systems (e.g., Ceph) as built-in services. Such applications run on Kubernetes.
* Does not have a click-to-deploy service marketplace.
* Does not deploy source code and does not build your application. Continuous Integration (CI) workflow is an area where different users and projects have their own requirements and preferences, so it supports layering CI workflows on Kubernetes but doesn't dictate how layering should work.
* Allows users to choose their logging, monitoring, and alerting systems. (It provides some integrations as proof of concept.)
* Does not provide nor mandate a comprehensive application configuration language/system (for example, [jsonnet](https://github.com/google/jsonnet)).
* Does not provide nor adopt any comprehensive machine configuration, maintenance, management, or self-healing systems.
-->
* 不限制支持的应用程序类型。 它不插手应用程序框架 (例如 [Wildfly](http://wildfly.org/)), 不限制支持的语言运行时 (例如 Java, Python, Ruby)，只迎合符合 [12种因素的应用程序](http://12factor.net/)，也不区分"应用程序"与"服务"。Kubernetes 旨在支持极其多样化的工作负载，包括无状态、有状态和数据处理工作负载。如果应用可以在容器中运行，它就可以在 Kubernetes 上运行。
* 不提供作为内置服务的中间件 (例如 消息中间件)、数据处理框架 (例如 Spark)、数据库 (例如 mysql)或集群存储系统 (例如 Ceph)。这些应用可以运行在 Kubernetes 上。
* 没有提供点击即部署的服务市场
* 从源代码到镜像都是非垄断的。 它不部署源代码且不构建您的应用程序。 持续集成 (CI) 工作流是一个不同用户和项目都有自己需求和偏好的领域。 所以我们支持在 Kubernetes 分层的 CI 工作流，但不指定它应该如何工作。
* 允许用户选择其他的日志记录，监控和告警系统 (虽然我们提供一些集成作为概念验证)
* 不提供或授权一个全面的应用程序配置语言/系统 (例如 [jsonnet](https://github.com/google/jsonnet)).
* 不提供也不采用任何全面机器配置、保养、管理或自我修复系统
<!--
On the other hand, a number of PaaS systems run *on* Kubernetes, such as [Openshift](https://www.openshift.org/), [Deis](http://deis.io/), and [Eldarion](http://eldarion.cloud/). You can also roll your own custom PaaS, integrate with a CI system of your choice, or use only Kubernetes by deploying your container images on Kubernetes.
-->
另一方面，许多 PaaS 系统*运行*在 Kubernetes 上面，例如  [Openshift](https://github.com/openshift/origin), [Deis](http://deis.io/), and [Eldarion](http://eldarion.cloud/)。 您也可以自定义您自己的 PaaS, 与您选择的 CI 系统集成，或与 Kubernetes 一起使用: 将您的容器镜像部署到 Kubernetes。
<!--
Since Kubernetes operates at the application level rather than at the hardware level, it provides some generally applicable features common to PaaS offerings, such as deployment, scaling, load balancing, logging, and monitoring. However, Kubernetes is not monolithic, and these default solutions are optional and pluggable.-->
由于 Kubernetes 在应用级别而不仅仅在硬件级别上运行，因此它提供 PaaS 产品通用的一些功能，例如部署、扩展、负载均衡、日志记录、监控等。但是，Kubernetes 不是单一的，默认解决方案是可选和可插拔的。
<!--
Additionally, Kubernetes is not a mere *orchestration system*. In fact, it eliminates the need for orchestration. The technical definition of *orchestration* is execution of a defined workflow: first do A, then B, then C. In contrast, Kubernetes is comprised of a set of independent, composable control processes that continuously drive the current state towards the provided desired state. It shouldn't matter how you get from A to C. Centralized control is also not required; the approach is more akin to *choreography*. This results in a system that is easier to use and more powerful, robust, resilient, and extensible.
-->
此处，Kubernetes 不仅仅是一个 "编排系统"；它消除了编排的需要。 "编排"技术定义的是工作流的执行: 从 A 到 B，然后到 C。相反，Kubernetes 是包括一套独立、可组合的控制过程，通过声明式语法使其连续地朝着期望状态驱动当前状态。 不需要告诉它具体从 A 到 C 的过程，只要告诉到 C 的状态即可。 也不需要集中控制；该方法更类似于"编舞"。这使得系统更容易使用并且更强大、更可靠、更具弹性和可扩展性。
<!--
#### What does *Kubernetes* mean? K8s?

The name **Kubernetes** originates from Greek, meaning *helmsman* or *pilot*, and is the root of *governor* and [cybernetic](http://www.etymonline.com/index.php?term=cybernetics). *K8s* is an abbreviation derived by replacing the 8 letters "ubernete" with "8".
-->
#### *Kubernetes* 是什么意思? K8s?

名称 **Kubernetes** 源于希腊语，意为 "舵手" 或 "飞行员"， 且是英文 "governor" 和 ["cybernetic"](http://www.etymonline.com/index.php?term=cybernetics)的词根。 **K8s** 是通过将 8 个字母 "ubernete" 替换为 8 而导出的缩写。另外，在中文里，k8s 的发音与 Kubernetes 的发音比较接近。

{% endcapture %}

{% capture whatsnext %}
*   Ready to [Get Started](/docs/getting-started-guides/)?
*   For more details, see the [Kubernetes Documentation](/docs/home/).
{% endcapture %}
{% include templates/concept.md %}
