---
approvers:
- k8s-merge-robot

title: 认识 Kubernetes?
weight: 10
---

Kubernetes 是一个跨主机集群的 [开源的容器调度平台，它可以自动化应用容器的部署、扩展和操作](http://www.slideshare.net/BrianGrant11/wso2con-us-2015-kubernetes-a-platform-for-automating-deployment-scaling-and-operations) , 提供以容器为中心的基础架构。

使用 Kubernetes, 您可以快速高效地响应客户需求:

 - 快速、可预测地部署您的应用程序
 - 拥有即时扩展应用程序的能力
 - 不影响现有业务的情况下，无缝地发布新功能
 - 优化硬件资源，降低成本

我们的目标是构建一个软件和工具的生态系统，以减轻您在公共云或私有云运行应用程序的负担。

#### Kubernetes 具有如下特点:

* **便携性**: 无论公有云、私有云、混合云还是多云架构都全面支持
* **可扩展**: 它是模块化、可插拔、可挂载、可组合的，支持各种形式的扩展
* **自修复**: 它可以自保持应用状态、可自重启、自复制、自缩放的，通过声明式语法提供了强大的自修复能力

Kubernetes 项目由 Google 公司在 2014 年启动。Kubernetes 建立在 [Google 公司超过十余年的运维经验基础之上，Google 所有的应用都运行在容器上](https://research.google.com/pubs/pub43438.html), 再与社区中最好的想法和实践相结合，也许它是最受欢迎的容器平台。

##### 准备好 [开始](/docs/getting-started-guides/)?

## 为什么是容器?

查看此文，可以了解为什么您要使用容器 [容器](http://aucouranton.com/2014/06/13/linux-containers-parallels-lxc-openvz-docker-and-more/)?

![为什么是容器?](/images/docs/why_containers.svg)

*传统* 部署应用程序的方式，一般是使用操作系统自带的包管理器在主机上安装应用依赖，之后再安装应用程序。这无疑将应用程序的可执行文件、应用的配置、应用依赖库和应用的生命周期与宿主机操作系统进行了紧耦合。在此情境下，可以通过构建不可改变的虚拟机镜像版本，通过镜像版本实现可预测的发布和回滚，但是虚拟机实在是太重量级了，且镜像体积太庞大，便捷性差。

*新方式* 是基于操作系统级虚拟化而不是硬件级虚拟化方法来部署容器。容器之间彼此隔离并与主机隔离：它们具有自己的文件系统，不能看到彼此的进程，并且它们所使用的计算资源是可以被限制的。它们比虚拟机更容易构建，并且因为它们与底层基础架构和主机文件系统隔离，所以它们可以跨云和操作系统快速分发。

由于容器体积小且启动快，因此可以在每个容器镜像中打包一个应用程序。这种一对一的应用镜像关系拥有很多好处。使用容器，不需要与外部的基础架构环境绑定, 因为每一个应用程序都不需要外部依赖，更不需要与外部的基础架构环境依赖。完美解决了从开发到生产环境的一致性问题。

容器同样比虚拟机更加透明，这有助于监测和管理。尤其是容器进程的生命周期由基础设施管理，而不是由容器内的进程对外隐藏时更是如此。最后，每个应用程序用容器封装，管理容器部署就等同于管理应用程序部署。

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

#### 为什么我们需要 Kubernetes，它能做什么?

最基础的，Kubernetes 可以在物理或虚拟机集群上调度和运行应用程序容器。然而，Kubernetes 还允许开发人员从物理和虚拟机'脱离'，从以**主机为中心**的基础架构转移到以**容器为中心**的基础架构，这样可以提供容器固有的全部优点和益处。Kubernetes 提供了基础设施来构建一个真正以**容器为中心**的开发环境。

Kubernetes 满足了生产中运行应用程序的许多常见的需求，例如：

* [Pod](/docs/user-guide/pods/) 提供复合应用并保留一个应用一个容器的容器模型,
* [挂载外部存储](/docs/user-guide/volumes/),
* [Secret管理](/docs/user-guide/secrets/),
* [应用健康检查](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/),
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

有关详细信息，请参阅 [用户指南](/docs/user-guide/).

#### 为什么 Kubernetes 是一个平台?

Kubernetes 提供了很多的功能，总会有新的场景受益于新特性。它可以简化应用程序的工作流，加快开发速度。被大家认可的应用编排通常需要有较强的自动化能力。这就是为什么 Kubernetes 被设计作为构建组件和工具的生态系统平台，以便更轻松地部署、扩展和管理应用程序。

[Label](/docs/user-guide/labels/) 允许用户按照自己的方式组织管理对应的资源。 [注解](/docs/user-guide/annotations/) 使用户能够以自定义的描述信息来修饰资源，以适用于自己的工作流，并为管理工具提供检查点状态的简单方法。

此外，[Kubernetes 控制面 (Control Plane)](/docs/admin/cluster-components) 是构建在相同的 [APIs](/docs/api/) 上面，开发人员和用户都可以用。用户可以编写自己的控制器， [调度器](https://github.com/kubernetes/kubernetes/tree/{{< param "githubbranch" >}}/docs/devel/scheduler.md)等等，如果这么做，根据新加的[自定义 API](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/design/extending-api.md) ，可以扩展当前的通用 [CLI 命令行工具](/docs/user-guide/kubectl-overview/)。

这种 [设计](https://git.k8s.io/community/contributors/design-proposals/architecture/principles.md) 使得许多其他系统可以构建在 Kubernetes 之上。

#### Kubernetes 不是什么:

Kubernetes 不是一个传统意义上，包罗万象的 PaaS (平台即服务) 系统。我们保留用户选择的自由，这非常重要。

* Kubernetes 不限制支持的应用程序类型。 它不插手应用程序框架 (例如 [Wildfly](http://wildfly.org/)), 不限制支持的语言运行时 (例如 Java, Python, Ruby)，只迎合符合 [12种因素的应用程序](http://12factor.net/)，也不区分"应用程序"与"服务"。Kubernetes 旨在支持极其多样化的工作负载，包括无状态、有状态和数据处理工作负载。如果应用可以在容器中运行，它就可以在 Kubernetes 上运行。
* Kubernetes 不提供作为内置服务的中间件 (例如 消息中间件)、数据处理框架 (例如 Spark)、数据库 (例如 mysql)或集群存储系统 (例如 Ceph)。这些应用可以运行在 Kubernetes 上。
* Kubernetes 没有提供点击即部署的服务市场
* Kubernetes 从源代码到镜像都是非垄断的。 它不部署源代码且不构建您的应用程序。 持续集成 (CI) 工作流是一个不同用户和项目都有自己需求和偏好的领域。 所以我们支持在 Kubernetes 分层的 CI 工作流，但不指定它应该如何工作。
* Kubernetes 允许用户选择其他的日志记录，监控和告警系统 (虽然我们提供一些集成作为概念验证)
* Kubernetes 不提供或授权一个全面的应用程序配置语言/系统 (例如 [jsonnet](https://github.com/google/jsonnet)).
* Kubernetes 不提供也不采用任何全面机器配置、保养、管理或自我修复系统

另一方面，许多 PaaS 系统*运行* 在 Kubernetes 上面，例如  [Openshift](https://github.com/openshift/origin), [Deis](http://deis.io/), and [Eldarion](http://eldarion.cloud/)。 您也可以自定义您自己的 PaaS, 与您选择的 CI 系统集成，或与 Kubernetes 一起使用: 将您的容器镜像部署到 Kubernetes。

由于 Kubernetes 在应用级别而不仅仅在硬件级别上运行，因此它提供 PaaS 产品通用的一些功能，例如部署、扩展、负载均衡、日志记录、监控等。但是，Kubernetes 不是单一的，默认解决方案是可选和可插拔的。

此处，Kubernetes 不仅仅是一个 "编排系统"；它消除了编排的需要。 "编排"技术定义的是工作流的执行: 从 A 到 B，然后到 C。相反，Kubernetes 是包括一套独立、可组合的控制过程，通过声明式语法使其连续地朝着期望状态驱动当前状态。 不需要告诉它具体从 A 到 C 的过程，只要告诉到 C 的状态即可。 也不需要集中控制；该方法更类似于"编舞"。这使得系统更容易使用并且更强大、更可靠、更具弹性和可扩展性。

#### *Kubernetes* 是什么意思? K8s?

名称 **Kubernetes** 源于希腊语，意为 "舵手" 或 "飞行员"， 且是英文 "governor" 和 ["cybernetic"](http://www.etymonline.com/index.php?term=cybernetics)的词根。 **K8s** 是通过将 8 个字母 "ubernete" 替换为 8 而导出的缩写。另外，在中文里，k8s 的发音与 Kubernetes 的发音比较接近。
