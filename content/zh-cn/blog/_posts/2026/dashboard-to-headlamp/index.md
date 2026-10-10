---
title: "从 Kubernetes Dashboard 到 Headlamp：理解过渡"
date: 2026-06-01T10:00:00-08:00
layout: blog
slug: dashboard-to-headlamp
author: "Will Case (Headlamp)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
title: "From Kubernetes Dashboard to Headlamp: Understanding the Transition"
date: 2026-06-01T10:00:00-08:00
layout: blog
slug: dashboard-to-headlamp
author: "Will Case (Headlamp)"
---
-->

<!--
For many people, Kubernetes Dashboard was their first window into Kubernetes. It offered a simple visual way to see what was running in a cluster, inspect resources, and build confidence without relying on the command line. For years, it helped developers, students, and operators make sense of Kubernetes, and it served as an important onramp into the ecosystem.
-->
对许多人来说，Kubernetes Dashboard 是他们了解 Kubernetes 的第一个窗口。
它提供了一种简单的可视化方式来查看集群中运行的内容、检查资源，并在不依赖命令行的情况下建立信心。
多年来，它帮助开发者、学生和运维人员理解 Kubernetes，并作为进入生态系统的重要入口。

<!--
The Kubernetes Dashboard project has now been archived. We deeply respect the work the team did and the role Dashboard played in making Kubernetes more approachable for so many users.
-->
Kubernetes Dashboard 项目现已归档。
我们深深尊重该团队所做的工作，以及 Dashboard 在让如此多用户更容易接触 Kubernetes 方面所发挥的作用。

<!--
Headlamp builds on that foundation and carries it forward. It keeps the clarity of a visual interface while adding capabilities that match how Kubernetes is used today. This includes multi-cluster visibility, application-centric views, extensibility through plugins, and flexible deployment options that work both in-cluster and on the desktop.
-->
Headlamp 在此基础上构建并向前发展。
它保持了可视化界面的清晰性，同时添加了与当今 Kubernetes 使用方式相匹配的功能。
这包括多集群可见性、以应用为中心的视图、通过插件实现的可扩展性，以及在集群内和桌面上都能工作的灵活部署选项。

<!--
This guide is meant to help you navigate that transition with confidence. Before diving into the mechanics of migration, we start with familiar ground by looking at how common Kubernetes Dashboard workflows map to Headlamp. We also cover what stays the same and what improves after the switch. The goal is not just to replace a tool, but to honor a user-centered legacy and help you land in a UI that can grow with you as your Kubernetes usage evolves.
-->
本指南旨在帮助你自信地完成这一过渡。
在深入探讨迁移机制之前，我们从熟悉的内容开始，
看看常见的 Kubernetes Dashboard 工作流程如何映射到 Headlamp。
我们还将介绍切换后保持不变的内容和改进的内容。
我们的目标不仅是替换工具，更是为了尊重以用户为中心的传统，
并帮助你找到一个能够随着 Kubernetes 使用方式演变而成长的 UI。

<!--
## Mapping Kubernetes Dashboard workloads to Headlamp
-->
## Kubernetes Dashboard 工作负载映射到 Headlamp

<!--
If you have used Kubernetes Dashboard before, many workflows in Headlamp will feel familiar. Headlamp does not introduce a new way of thinking. Instead, it builds on workloads users already know and extends them in practical ways. The focus is continuity. What worked before still works, with more room to grow.
-->
如果你以前使用过 Kubernetes Dashboard，Headlamp 中的许多工作流程会让你感到熟悉。
Headlamp 并没有引入新的思维方式。
相反，它建立在用户已经熟悉的工作负载之上，并以实用的方式扩展它们。
重点是连续性。以前有效的方法仍然有效，同时有更多的发展空间。

<!--
### Viewing workloads and resources
-->
### 查看工作负载和资源

<!--
In Kubernetes Dashboard, most users started by browsing workloads like pods, deployments, services, and namespaces. Headlamp keeps this same starting point. Workloads are easy to find and inspect, and moving between namespaces and clusters is simpler. Resources are still organized in familiar ways, and navigation feels smoother, especially when you work across multiple environments.

{{< figure src="view-workloads-resources-2.png" alt="Viewing Kubernetes workloads and resources in the Headlamp interface" >}}
-->
在 Kubernetes Dashboard 中，大多数用户从浏览工作负载（如 Pod、Deployment、Service 和 Namespace）开始。
Headlamp 保持这个相同的起点。工作负载易于查找和检查，在命名空间和集群之间切换更加简单。
资源仍然以熟悉的方式组织，导航感觉更流畅，尤其是在跨多个环境工作时。

{{< figure src="view-workloads-resources-2.png" alt="在 Headlamp 界面中查看 Kubernetes 工作负载和资源" >}}

<!--
### Editing and interacting with resources
-->
### 编辑和与资源交互

<!--
Like Kubernetes Dashboard, Headlamp lets you view and edit manifests directly in the UI based on your permissions. You can delete resources, scale workloads, or update configurations from the interface. All actions follow standard Kubernetes RBAC. If you could perform an action in Dashboard, you will find the same capability in Headlamp, with the same respect for access controls.

{{< figure src="editing-interacting-resources.png" alt="Editing and interacting with Kubernetes resources in the Headlamp user interface" >}}
-->
与 Kubernetes Dashboard 一样，Headlamp 允许你根据权限直接在 UI 中查看和编辑清单。
你可以从界面删除资源、缩放工作负载或更新配置。所有操作都遵循标准的 Kubernetes RBAC。
如果你能在 Dashboard 中执行某个操作，你将在 Headlamp 中找到相同的功能，并且同样尊重访问控制。

{{< figure src="editing-interacting-resources.png" alt="在 Headlamp 用户界面中编辑和与 Kubernetes 资源交互" >}}

<!--
### Understanding relationships
-->
### 理解关系

<!--
Where Headlamp begins to expand the experience is in how it presents relationships between resources. In addition to list views, Headlamp offers visual ways to see how workloads, services, and configurations connect. This helps provide context without changing the underlying workloads users already rely on.

{{< figure src="understanding-relationships.png" alt="Visualizing relationships between Kubernetes workloads and services in Headlamp" >}}
-->
Headlamp 开始扩展体验的地方在于它呈现资源之间关系的方式。
除了列表视图，Headlamp 还提供了可视化方式来查看工作负载、服务和配置之间的连接。
这有助于在不改变用户已经依赖的底层工作负载的情况下提供上下文。

{{< figure src="understanding-relationships.png" alt="在 Headlamp 中可视化 Kubernetes 工作负载和服务之间的关系" >}}

<!--
At a high level, the tasks you performed in Kubernetes Dashboard are still there. Headlamp keeps familiar workflows while making it easier to scale as clusters, teams, and applications grow.
-->
从高层次来看，你在 Kubernetes Dashboard 中执行的任务仍然存在。
Headlamp 保留了熟悉的工作流程，同时随着集群、团队和应用的增长，使其更容易扩展。

<!--
## Where Headlamp goes beyond Kubernetes Dashboard
-->
## Headlamp 超越 Kubernetes Dashboard 的地方

<!--
### Expanding from single cluster to multi-cluster workflows
-->
### 从单集群扩展到多集群工作流程

<!--
Kubernetes Dashboard was designed to work with one cluster at a time. That model worked well for simple setups, but it became limiting as teams adopted multiple environments. Headlamp expands this view by letting you work with multiple clusters from a single interface without switching tools or losing context. This makes it easier to manage development, staging, and production environments side by side.

{{< figure src="expanding-multicluster.png" alt="Expanding from single cluster to multi-cluster workflows using Headlamp" >}}
-->
Kubernetes Dashboard 设计为一次只处理一个集群。
这种模式在简单设置中效果很好，但随着团队采用多个环境，它变得有限制。
Headlamp 通过允许你从单个界面处理多个集群而无需切换工具或丢失上下文，扩展了这个视图。
这使得并排管理开发、暂存和生产环境变得更容易。

{{< figure src="expanding-multicluster.png" alt="使用 Headlamp 从单集群扩展到多集群工作流程" >}}

<!--
For teams running Kubernetes in more than one place, this shift reduces friction. You can stay oriented and move between clusters with confidence.
-->
对于在多个地方运行 Kubernetes 的团队来说，这种转变减少了摩擦。
你可以保持方向感，并自信地在集群之间移动。

<!--
### From resource lists to application context with Projects
-->
### 通过 Projects 从资源列表到应用上下文

<!--
Projects give you an application-centered way to view Kubernetes. Instead of jumping between lists, you can group related workloads, services, and supporting resources in one place. This makes applications easier to understand. You can see what belongs together, track changes in context, and troubleshoot without scanning the cluster piece by piece.
-->
Projects 为你提供了一种以应用为中心的方式来查看 Kubernetes。
你可以将相关的工作负载、服务和支持资源分组到一个地方，而不是在列表之间跳转。这使应用更容易理解。
你可以看到哪些资源属于一起，在上下文中跟踪更改，并在不逐个扫描集群的情况下进行故障排除。

<!--
Projects are built on native Kubernetes concepts. Namespaces, labels, and RBAC continue to work the same way they always have. Headlamp adds a visual layer that brings related resources together.
-->
Projects 建立在原生 Kubernetes 概念之上。
Namespaces、labels 和 RBAC 继续以它们一贯的方式工作。
Headlamp 添加了一个视觉层，将相关资源聚集在一起。

<!--
Projects are optional. You can still work at the individual resource level when that fits your task. When you need more context, Projects help you step back and see the bigger picture.

{{< figure src="application-projects.png" alt="Application Projects view in Headlamp grouping related Kubernetes resources" >}}
-->
Projects 是可选的。当适合你的任务时，你仍然可以在单个资源级别工作。
当你需要更多上下文时，Projects 帮助你退一步看到更大的图景。

{{< figure src="application-projects.png" alt="Headlamp 中的应用 Projects 视图，将相关的 Kubernetes 资源分组" >}}

<!--
### Extend the Headlamp UI with plugins {#plugins}
-->
### 使用插件扩展 Headlamp UI {#plugins}

<!--
Headlamp can be extended through plugins that bring common workflows directly into the UI. Instead of switching tools, you work in one place with the same context.

{{< figure src="add-plugin-catalog.png" alt="Adding plugins from the plugin catalog in the Headlamp interface" >}}
-->
Headlamp 可以通过插件扩展，这些插件将常见工作流程直接带入 UI。
你可以在一个地方使用相同的上下文工作，而无需切换工具。

{{< figure src="add-plugin-catalog.png" alt="在 Headlamp 界面中从插件目录添加插件" >}}

<!--
For example, the Flux plugin brings GitOps workflows into Headlamp. It allows teams to view application state alongside the Kubernetes resources that Flux manages, making it easier to understand how changes in Git relate to what is running in the cluster.

{{< figure src="add-gitops.png" alt="Viewing and managing GitOps resources in Headlamp using the Flux plugin" >}}
-->
例如，Flux 插件将 GitOps 工作流程带入 Headlamp。
它允许团队在 Flux 管理的 Kubernetes 资源旁边查看应用状态，
使理解 Git 中的更改如何与集群中运行的内容相关变得更容易。

{{< figure src="add-gitops.png" alt="使用 Flux 插件在 Headlamp 中查看和管理 GitOps 资源" >}}

<!--
The AI Assistant follows a similar pattern. It adds a conversational layer to the UI that helps users understand what they are seeing, troubleshoot issues, or take action. All of this happens in the same screen where the problem appears.

{{< figure src="add-ai-assistant.png" alt="Using the AI assistant in Headlamp to understand and troubleshoot Kubernetes resources" >}}
-->
AI Assistant 遵循类似的模式。它在 UI 中添加了一个对话层，
帮助用户理解他们所看到的内容、排除问题或采取行动。
所有这些都发生在问题出现的同一个屏幕上。

{{< figure src="add-ai-assistant.png" alt="在 Headlamp 中使用 AI 助手来理解和排除 Kubernetes 资源问题" >}}

<!--
### Building your own plugins
-->
### 构建自己的插件

<!--
Plugins are optional and not limited to community-built extensions. Platform and project teams can also create their own plugins. This allows organizations to add custom integrations that match their specific workflows and internal tooling, while keeping the user experience consistent.
-->
插件是可选的，不限于社区构建的扩展。平台和项目团队也可以创建自己的插件。
这允许组织添加符合其特定工作流程和内部工具的自定义集成，同时保持用户体验的一致性。

<!--
## Choosing how and where Headlamp runs
-->
## 选择 Headlamp 的运行方式和位置

<!--
Headlamp gives teams flexibility in how they use a Kubernetes UI. You can run it directly in a cluster, use it as a desktop application, or combine both approaches based on your needs.
-->
Headlamp 为团队提供了使用 Kubernetes UI 的灵活性。
你可以直接在集群中运行它，将其用作桌面应用，或根据需要结合两种方法。

<!--
Running Headlamp in-cluster works well for shared environments. It provides a centrally managed UI with controlled access and fits naturally into Kubernetes setups, following the same authentication and RBAC rules as other in-cluster components.

{{< figure src="browser-app.png" alt="Running Headlamp as an in-cluster browser-based application" >}}
-->
在集群内运行 Headlamp 适用于共享环境。
它提供了一个集中管理的 UI，具有受控访问权限，并自然地融入 Kubernetes 设置，
遵循与其他集群内组件相同的认证和 RBAC 规则。

{{< figure src="browser-app.png" alt="将 Headlamp 作为集群内基于浏览器的应用运行" >}}

<!--
The desktop application is often a better fit for local development and onboarding. It also works well when you need to manage multiple clusters from one place. Users can connect using their existing kubeconfig without deploying anything into the cluster.

{{< figure src="desktop-app.png" alt="Using Headlamp as a desktop application to manage Kubernetes clusters locally" >}}
-->
桌面应用通常更适合本地开发和入职培训。
当你需要从一个地方管理多个集群时，它也很有效。
用户可以使用现有的 kubeconfig 连接，而无需在集群中部署任何东西。

{{< figure src="desktop-app.png" alt="使用 Headlamp 作为桌面应用在本地管理 Kubernetes 集群" >}}

<!--
These options are not mutually exclusive. Many teams use the desktop app for day-to-day work, while relying on an in-cluster deployment for shared or production environments.
-->
这些选项不是相互排斥的。许多团队使用桌面应用进行日常工作，同时依赖集群内部署用于共享或生产环境。

<!--
## Preparing for the Migration
-->
## 准备迁移

<!--
Before moving from Kubernetes Dashboard to Headlamp, it can be helpful to pause and take stock of how you use the Dashboard today. A little reflection up front can go a long way toward making the transition feel smooth and familiar.
-->
在从 Kubernetes Dashboard 迁移到 Headlamp 之前，
停下来评估一下你今天如何使用 Dashboard 可能会有所帮助。
提前进行一些思考可以大大有助于使过渡感觉顺畅和熟悉。

<!--
Start by noting which clusters and namespaces you access and how authentication works. Headlamp relies on standard Kubernetes authentication and RBAC. In most cases, existing access models carry over without change. If users already connect using kubeconfig files or service accounts, they will be able to access the same resources in Headlamp.
-->
首先记录你访问的集群和命名空间以及认证如何工作。
Headlamp 依赖标准的 Kubernetes 认证和 RBAC。
在大多数情况下，现有的访问模型无需更改即可延续。
如果用户已经使用 kubeconfig 文件或服务账户连接，他们将能够在 Headlamp 中访问相同的资源。

<!--
It is also useful to think about the workflows that matter most to your team. Some users rely on Dashboard for quick inspection or troubleshooting, while others use it for lightweight edits or validation. Headlamp supports these same workflows and adds optional capabilities on top. Knowing what you rely on today helps the transition feel predictable and confidence building.
-->
思考对你的团队最重要的工作流程也很有用。
一些用户依赖 Dashboard 进行快速检查或故障排除，而另一些用户则用它进行轻量级编辑或验证。
Headlamp 支持这些相同的工作流程，并在此基础上添加可选功能。
了解你今天依赖什么有助于使过渡感觉可预测并建立信心。

<!--
If you would like to explore Headlamp or try it out before migrating, you can learn more at [headlamp.dev](https://headlamp.dev).
-->
如果你想在迁移前探索 Headlamp 或试用它，可以在
[headlamp.dev](https://headlamp.dev) 了解更多信息。

<!--
This blog focused on understanding the transition and what to expect. A step by step migration guide is coming soon and will walk through installation and migration in detail.
-->
这篇博客重点介绍了理解过渡和预期内容。分步迁移指南即将推出，将详细介绍安装和迁移过程。
