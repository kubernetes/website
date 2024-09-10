---
title: "概述"
description: >
  Kubernetes 是一个可移植、可扩展的开源平台，用于管理容器化的工作负载和服务，方便进行声明式配置和自动化。Kubernetes 拥有一个庞大且快速增长的生态系统，其服务、支持和工具的使用范围广泛。
content_type: concept
weight: 20
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#why-you-need-kubernetes-and-what-can-it-do"
    title: 为什么选择 Kubernetes?
no_list: true
---
<!--
reviewers:
- bgrant0607
- mikedanese
title: "Overview"
description: >
  Kubernetes is a portable, extensible, open source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation. It has a large, rapidly growing ecosystem. Kubernetes services, support, and tools are widely available.
content_type: concept
weight: 20
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#why-you-need-kubernetes-and-what-can-it-do"
    title: Why Kubernetes?
no_list: true
-->

<!-- overview -->
<!--
This page is an overview of Kubernetes.
-->
此页面是 Kubernetes 的概述。

<!-- body -->
<!--
Kubernetes is a portable, extensible, open source platform for managing containerized
workloads and services, that facilitates both declarative configuration and automation.
It has a large, rapidly growing ecosystem. Kubernetes services, support, and tools are widely available.

-->
Kubernetes 是一个可移植、可扩展的开源平台，用于管理容器化的工作负载和服务，可促进声明式配置和自动化。
Kubernetes 拥有一个庞大且快速增长的生态，其服务、支持和工具的使用范围相当广泛。

<!--
The name Kubernetes originates from Greek, meaning helmsman or pilot. K8s as an abbreviation
results from counting the eight letters between the "K" and the "s". Google open-sourced the
Kubernetes project in 2014. Kubernetes combines
[over 15 years of Google's experience](/blog/2015/04/borg-predecessor-to-kubernetes/) running
production workloads at scale with best-of-breed ideas and practices from the community.
-->
**Kubernetes** 这个名字源于希腊语，意为“舵手”或“飞行员”。K8s 这个缩写是因为 K 和 s 之间有 8 个字符的关系。
Google 在 2014 年开源了 Kubernetes 项目。
Kubernetes 建立在 [Google 大规模运行生产工作负载十几年经验](https://research.google/pubs/pub43438)的基础上，
结合了社区中最优秀的想法和实践。

<!--
## Why you need Kubernetes and what it can do {#why-you-need-kubernetes-and-what-can-it-do}
-->
## 为什么需要 Kubernetes，它能做什么？   {#why-you-need-kubernetes-and-what-can-it-do}

<!--
Containers are a good way to bundle and run your applications. In a production
environment, you need to manage the containers that run the applications and
ensure that there is no downtime. For example, if a container goes down, another
container needs to start. Wouldn't it be easier if this behavior was handled by a system?
-->
容器是打包和运行应用程序的好方式。在生产环境中，
你需要管理运行着应用程序的容器，并确保服务不会下线。
例如，如果一个容器发生故障，则你需要启动另一个容器。
如果此行为交由给系统处理，是不是会更容易一些？

<!--
That's how Kubernetes comes to the rescue! Kubernetes provides you with a framework
to run distributed systems resiliently. It takes care of scaling and failover for
your application, provides deployment patterns, and more. For example: Kubernetes
can easily manage a canary deployment for your system.
-->
这就是 Kubernetes 要来做的事情！
Kubernetes 为你提供了一个可弹性运行分布式系统的框架。
Kubernetes 会满足你的扩展要求、故障转移你的应用、提供部署模式等。
例如，Kubernetes 可以轻松管理系统的 Canary (金丝雀) 部署。

<!--
Kubernetes provides you with:
-->
Kubernetes 为你提供：

<!--
* **Service discovery and load balancing**
  Kubernetes can expose a container using the DNS name or using their own IP address.
  If traffic to a container is high, Kubernetes is able to load balance and distribute
  the network traffic so that the deployment is stable.
-->
* **服务发现和负载均衡**

  Kubernetes 可以使用 DNS 名称或自己的 IP 地址来暴露容器。
  如果进入容器的流量很大，
  Kubernetes 可以负载均衡并分配网络流量，从而使部署稳定。

<!--
* **Storage orchestration**
  Kubernetes allows you to automatically mount a storage system of your choice, such as
  local storages, public cloud providers, and more.
-->
* **存储编排**

  Kubernetes 允许你自动挂载你选择的存储系统，例如本地存储、公共云提供商等。

<!--
* **Automated rollouts and rollbacks**
  You can describe the desired state for your deployed containers using Kubernetes,
  and it can change the actual state to the desired state at a controlled rate.
  For example, you can automate Kubernetes to create new containers for your
  deployment, remove existing containers and adopt all their resources to the new container.
-->
* **自动部署和回滚**

  你可以使用 Kubernetes 描述已部署容器的所需状态，
  它可以以受控的速率将实际状态更改为期望状态。
  例如，你可以自动化 Kubernetes 来为你的部署创建新容器，
  删除现有容器并将它们的所有资源用于新容器。

<!--
* **Automatic bin packing**
  You provide Kubernetes with a cluster of nodes that it can use to run containerized tasks.
  You tell Kubernetes how much CPU and memory (RAM) each container needs. Kubernetes can fit
  containers onto your nodes to make the best use of your resources.
-->
* **自动完成装箱计算**

  你为 Kubernetes 提供许多节点组成的集群，在这个集群上运行容器化的任务。
  你告诉 Kubernetes 每个容器需要多少 CPU 和内存 (RAM)。
  Kubernetes 可以将这些容器按实际情况调度到你的节点上，以最佳方式利用你的资源。

<!--
* **Self-healing**
  Kubernetes restarts containers that fail, replaces containers, kills containers that don't
  respond to your user-defined health check, and doesn't advertise them to clients until they
  are ready to serve.
-->
* **自我修复**

  Kubernetes 将重新启动失败的容器、替换容器、杀死不响应用户定义的运行状况检查的容器，
  并且在准备好服务之前不将其通告给客户端。

<!--
* **Secret and configuration management**
  Kubernetes lets you store and manage sensitive information, such as passwords, OAuth tokens,
  and SSH keys. You can deploy and update secrets and application configuration without
  rebuilding your container images, and without exposing secrets in your stack configuration.
-->
* **密钥与配置管理**

  Kubernetes 允许你存储和管理敏感信息，例如密码、OAuth 令牌和 SSH 密钥。
  你可以在不重建容器镜像的情况下部署和更新密钥和应用程序配置，也无需在堆栈配置中暴露密钥。

<!--
* **Batch execution**
  In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.
* **Horizontal scaling**
  Scale your application up and down with a simple command, with a UI, or automatically based on CPU usage.
* **IPv4/IPv6 dual-stack**
  Allocation of IPv4 and IPv6 addresses to Pods and Services
* **Designed for extensibility**
  Add features to your Kubernetes cluster without changing upstream source code.
-->
* **批处理执行**
  除了服务外，Kubernetes 还可以管理你的批处理和 CI（持续集成）工作负载，如有需要，可以替换失败的容器。
* **水平扩缩**
  使用简单的命令、用户界面或根据 CPU 使用率自动对你的应用进行扩缩。
* **IPv4/IPv6 双栈**
  为 Pod（容器组）和 Service（服务）分配 IPv4 和 IPv6 地址。
* **为可扩展性设计**
  在不改变上游源代码的情况下为你的 Kubernetes 集群添加功能。

<!--
## What Kubernetes is not
-->
## Kubernetes 不是什么   {#what-kubernetes-is-not}

<!--
Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system.
Since Kubernetes operates at the container level rather than at the hardware level,
it provides some generally applicable features common to PaaS offerings, such as
deployment, scaling, load balancing, and lets users integrate their logging, monitoring,
and alerting solutions. However, Kubernetes is not monolithic, and these default solutions
are optional and pluggable. Kubernetes provides the building blocks for building developer
platforms, but preserves user choice and flexibility where it is important.
-->
Kubernetes 不是传统的、包罗万象的 PaaS（平台即服务）系统。
由于 Kubernetes 是在容器级别运行，而非在硬件级别，它提供了 PaaS 产品共有的一些普遍适用的功能，
例如部署、扩展、负载均衡，允许用户集成他们的日志记录、监控和警报方案。
但是，Kubernetes 不是单体式（monolithic）系统，那些默认解决方案都是可选、可插拔的。
Kubernetes 为构建开发人员平台提供了基础，但是在重要的地方保留了用户选择权，能有更高的灵活性。

<!--
Kubernetes:
-->
Kubernetes：

<!--
* Does not limit the types of applications supported. Kubernetes aims to support an
  extremely diverse variety of workloads, including stateless, stateful, and data-processing
  workloads. If an application can run in a container, it should run great on Kubernetes.
* Does not deploy source code and does not build your application. Continuous Integration,
  Delivery, and Deployment (CI/CD) workflows are determined by organization cultures and
  preferences as well as technical requirements.
* Does not provide application-level services, such as middleware (for example, message buses),
  data-processing frameworks (for example, Spark), databases (for example, MySQL), caches, nor
  cluster storage systems (for example, Ceph) as built-in services. Such components can run on
  Kubernetes, and/or can be accessed by applications running on Kubernetes through portable
  mechanisms, such as the [Open Service Broker](https://openservicebrokerapi.org/).
-->
* 不限制支持的应用程序类型。
  Kubernetes 旨在支持极其多种多样的工作负载，包括无状态、有状态和数据处理工作负载。
  如果应用程序可以在容器中运行，那么它应该可以在 Kubernetes 上很好地运行。
* 不部署源代码，也不构建你的应用程序。
  持续集成（CI）、交付和部署（CI/CD）工作流取决于组织的文化和偏好以及技术要求。
* 不提供应用程序级别的服务作为内置服务，例如中间件（例如消息中间件）、
  数据处理框架（例如 Spark）、数据库（例如 MySQL）、缓存、集群存储系统
  （例如 Ceph）。这样的组件可以在 Kubernetes 上运行，并且/或者可以由运行在
  Kubernetes 上的应用程序通过可移植机制（例如[开放服务代理](https://openservicebrokerapi.org/)）来访问。
<!--
* Does not dictate logging, monitoring, or alerting solutions. It provides some integrations
  as proof of concept, and mechanisms to collect and export metrics.
* Does not provide nor mandate a configuration language/system (for example, Jsonnet). It provides
  a declarative API that may be targeted by arbitrary forms of declarative specifications.
* Does not provide nor adopt any comprehensive machine configuration, maintenance, management,
  or self-healing systems.
* Additionally, Kubernetes is not a mere orchestration system. In fact, it eliminates the need
  for orchestration. The technical definition of orchestration is execution of a defined workflow:
  first do A, then B, then C. In contrast, Kubernetes comprises a set of independent, composable
  control processes that continuously drive the current state towards the provided desired state.
  It shouldn't matter how you get from A to C. Centralized control is also not required. This
  results in a system that is easier to use and more powerful, robust, resilient, and extensible.
-->
* 不是日志记录、监视或警报的解决方案。
  它集成了一些功能作为概念证明，并提供了收集和导出指标的机制。
* 不提供也不要求配置用的语言、系统（例如 jsonnet），它提供了声明性 API，
  该声明性 API 可以由任意形式的声明性规范所构成。
* 不提供也不采用任何全面的机器配置、维护、管理或自我修复系统。
* 此外，Kubernetes 不仅仅是一个编排系统，实际上它消除了编排的需要。
  编排的技术定义是执行已定义的工作流程：首先执行 A，然后执行 B，再执行 C。
  而 Kubernetes 包含了一组独立可组合的控制过程，可以持续地将当前状态驱动到所提供的预期状态。
  你不需要在乎如何从 A 移动到 C，也不需要集中控制，这使得系统更易于使用且功能更强大、
  系统更健壮，更为弹性和可扩展。

<!--
## Historical context for Kubernetes {#going-back-in-time}

Let's take a look at why Kubernetes is so useful by going back in time.
-->
## Kubernetes 的历史背景   {#going-back-in-time}

让我们回顾一下为何 Kubernetes 能够裨益四方。

<!--
![Deployment evolution](/images/docs/Container_Evolution.svg)
-->
![部署演进](/zh-cn/docs/images/Container_Evolution.svg)

<!--
**Traditional deployment era:**

Early on, organizations ran applications on physical servers. There was no way to define
resource boundaries for applications in a physical server, and this caused resource
allocation issues. For example, if multiple applications run on a physical server, there
can be instances where one application would take up most of the resources, and as a result,
the other applications would underperform. A solution for this would be to run each application
on a different physical server. But this did not scale as resources were underutilized, and it
was expensive for organizations to maintain many physical servers.
-->
**传统部署时代：**

早期，各个组织是在物理服务器上运行应用程序。
由于无法限制在物理服务器中运行的应用程序资源使用，因此会导致资源分配问题。
例如，如果在同一台物理服务器上运行多个应用程序，
则可能会出现一个应用程序占用大部分资源的情况，而导致其他应用程序的性能下降。
一种解决方案是将每个应用程序都运行在不同的物理服务器上，
但是当某个应用程序资源利用率不高时，剩余资源无法被分配给其他应用程序，
而且维护许多物理服务器的成本很高。

<!--
**Virtualized deployment era:**

As a solution, virtualization was introduced. It allows you
to run multiple Virtual Machines (VMs) on a single physical server's CPU. Virtualization
allows applications to be isolated between VMs and provides a level of security as the
information of one application cannot be freely accessed by another application.
-->
**虚拟化部署时代：**

因此，虚拟化技术被引入了。虚拟化技术允许你在单个物理服务器的 CPU 上运行多台虚拟机（VM）。
虚拟化能使应用程序在不同 VM 之间被彼此隔离，且能提供一定程度的安全性，
因为一个应用程序的信息不能被另一应用程序随意访问。

<!--
Virtualization allows better utilization of resources in a physical server and allows
better scalability because an application can be added or updated easily, reduces
hardware costs, and much more. With virtualization you can present a set of physical
resources as a cluster of disposable virtual machines.

Each VM is a full machine running all the components, including its own operating
system, on top of the virtualized hardware.
-->
虚拟化技术能够更好地利用物理服务器的资源，并且因为可轻松地添加或更新应用程序，
而因此可以具有更高的可扩缩性，以及降低硬件成本等等的好处。
通过虚拟化，你可以将一组物理资源呈现为可丢弃的虚拟机集群。

每个 VM 是一台完整的计算机，在虚拟化硬件之上运行所有组件，包括其自己的操作系统。

<!--
**Container deployment era:**

Containers are similar to VMs, but they have relaxed
isolation properties to share the Operating System (OS) among the applications.
Therefore, containers are considered lightweight. Similar to a VM, a container
has its own filesystem, share of CPU, memory, process space, and more. As they
are decoupled from the underlying infrastructure, they are portable across clouds
and OS distributions.
-->
**容器部署时代：**

容器类似于 VM，但是更宽松的隔离特性，使容器之间可以共享操作系统（OS）。
因此，容器比起 VM 被认为是更轻量级的。且与 VM 类似，每个容器都具有自己的文件系统、CPU、内存、进程空间等。
由于它们与基础架构分离，因此可以跨云和 OS 发行版本进行移植。

<!--
Containers have become popular because they provide extra benefits, such as:
-->
容器因具有许多优势而变得流行起来，例如：

<!--
* Agile application creation and deployment: increased ease and efficiency of
  container image creation compared to VM image use.
* Continuous development, integration, and deployment: provides for reliable
  and frequent container image build and deployment with quick and efficient
  rollbacks (due to image immutability).
* Dev and Ops separation of concerns: create application container images at
  build/release time rather than deployment time, thereby decoupling
  applications from infrastructure.
* Observability: not only surfaces OS-level information and metrics, but also
  application health and other signals.
-->
* 敏捷应用程序的创建和部署：与使用 VM 镜像相比，提高了容器镜像创建的简便性和效率。
* 持续开发、集成和部署：通过快速简单的回滚（由于镜像不可变性），
  提供可靠且频繁的容器镜像构建和部署。
* 关注开发与运维的分离：在构建、发布时创建应用程序容器镜像，而不是在部署时，
  从而将应用程序与基础架构分离。
* 可观察性：不仅可以显示 OS 级别的信息和指标，还可以显示应用程序的运行状况和其他指标信号。
<!--
* Environmental consistency across development, testing, and production: runs
  the same on a laptop as it does in the cloud.
* Cloud and OS distribution portability: runs on Ubuntu, RHEL, CoreOS, on-premises,
  on major public clouds, and anywhere else.
* Application-centric management: raises the level of abstraction from running an
  OS on virtual hardware to running an application on an OS using logical resources.
* Loosely coupled, distributed, elastic, liberated micro-services: applications are
  broken into smaller, independent pieces and can be deployed and managed dynamically –
  not a monolithic stack running on one big single-purpose machine.
* Resource isolation: predictable application performance.
* Resource utilization: high efficiency and density.
-->
* 跨开发、测试和生产的环境一致性：在笔记本计算机上也可以和在云中运行一样的应用程序。
* 跨云和操作系统发行版本的可移植性：可在 Ubuntu、RHEL、CoreOS、本地、
  Google Kubernetes Engine 和其他任何地方运行。
* 以应用程序为中心的管理：提高抽象级别，从在虚拟硬件上运行 OS 到使用逻辑资源在 OS 上运行应用程序。
* 松散耦合、分布式、弹性、解放的微服务：应用程序被分解成较小的独立部分，
  并且可以动态部署和管理 - 而不是在一台大型单机上整体运行。
* 资源隔离：可预测的应用程序性能。
* 资源利用：高效率和高密度。

## {{% heading "whatsnext" %}}

<!--
* Take a look at the [Kubernetes Components](/docs/concepts/overview/components/)
* Take a look at the [The Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* Take a look at the [Cluster Architecture](/docs/concepts/architecture/)
* Ready to [Get Started](/docs/setup/)?
-->
* 查阅 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)
* 查阅 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)
* 查阅 [Cluster 架构](/zh-cn/docs/concepts/architecture/)
* 开始 [Kubernetes 的建置](/zh-cn/docs/setup/)吧！
