---
layout: blog
title: "使用 Headlamp 更快地检查 Volcano 工作负载"
draft: true
slug: visual-context-volcano-headlamp-plugin
author: >
  [Mahmoud Magdy](https://github.com/mahmoudmagdy1-1) (independent)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---

<!--
layout: blog
title: "Inspecting Volcano Workloads Faster with Headlamp"
draft: true
slug: visual-context-volcano-headlamp-plugin
author: >
  [Mahmoud Magdy](https://github.com/mahmoudmagdy1-1) (independent)
-->

<!--
[Volcano](https://volcano.sh/) is a cloud native batch scheduler for Kubernetes, built for high-performance computing, AI/ML, and other batch workloads.
-->
[Volcano](https://volcano.sh/) 是 Kubernetes 的云原生批处理调度器，专为高性能计算、AI/ML 和其他批处理工作负载而构建。

<!--
[Headlamp](https://headlamp.dev/) is an extensible Kubernetes web UI. With its plugin system, Headlamp can surface APIs and workflows beyond the built-in Kubernetes resources. The Volcano plugin brings core Volcano resources into Headlamp so you can inspect workload state, queue behavior, and gang scheduling details in one place.
-->
[Headlamp](https://headlamp.dev/) 是一个可扩展的 Kubernetes Web UI。
通过其插件系统，Headlamp 可以展示内置 Kubernetes 资源之外的 API 和工作流。
Volcano 插件将核心 Volcano 资源引入 Headlamp，让你可以在一个地方检查工作负载状态、队列行为和组调度详情。

<!--
Kubernetes was originally designed around long-running services, where applications are expected to start and remain available over time. Batch, AI/ML, and HPC workloads often behave differently: jobs arrive dynamically, compete for limited resources, and may need multiple workers to start together before useful work can begin.
-->
Kubernetes 最初围绕长期运行的服务设计，应用被期望启动后持续保持可用。
批处理、AI/ML 和 HPC 工作负载通常表现不同：作业动态到达，争夺有限资源，可能需要多个工作节点同时启动才能开始有效工作。

<!--
Volcano extends Kubernetes with concepts such as queues, priorities, quotas, and gang scheduling. Instead of treating every Pod independently, Volcano schedules workloads with awareness of the job as a whole and the resources it needs to make progress.
-->
Volcano 通过队列、优先级、配额和组调度等概念扩展了 Kubernetes。
Volcano 不再独立对待每个 Pod，而是以感知整个作业及其所需资源的方式来调度工作负载。

<!--
To make these workloads easier to operate and troubleshoot, the Volcano plugin brings that scheduling context directly into Headlamp.
-->
为了使这些工作负载更易于操作和故障排查，Volcano 插件将调度上下文直接引入 Headlamp。

<!--
Watch this short walkthrough to see the Volcano plugin in Headlamp:
-->
观看这段简短的演示视频，了解 Headlamp 中的 Volcano 插件：

{{< youtube id="Mqm1EyAa7TY" title="Volcano plugin for Headlamp walkthrough" >}}

<!--
## Visual context helps teams understand Volcano jobs, queues, and PodGroups faster
-->
## 可视化上下文帮助团队更快地理解 Volcano 作业、队列和 PodGroup {#visual-context-helps-teams-understand-volcano-jobs-queues-and-podgroups-faster}

<!--
Working with Volcano often means moving across several related resources while trying to understand a batch workload. You might start with a Job, then look at the related PodGroup, inspect the Pods behind it, check the Queue, and finally return to the Job again. All of that is possible with CLI tools like `kubectl` and the Volcano CLI, but it can become fragmented very quickly.
-->
使用 Volcano 时，理解批处理工作负载通常意味着在多个相关资源之间来回切换。
你可能从一个 Job 开始，然后查看相关的 PodGroup，检查其背后的 Pod，查看 Queue，最后再回到 Job。
这些都可以通过 `kubectl` 和 Volcano CLI 等命令行工具完成，但操作很快就会变得碎片化。

<!--
The Volcano plugin for Headlamp makes that workflow easier by bringing the key resources together in a single UI. Instead of reconstructing relationships manually, you can move directly between Jobs, Queues, PodGroups, Pods, and events from the same interface.
-->
Headlamp 的 Volcano 插件通过将关键资源汇聚在单一 UI 中简化了这一工作流。
你无需手动重建资源关系，而是可以在同一界面中直接在 Job、Queue、PodGroup、Pod 和事件之间切换。

<!--
Volcano introduces its own resources on top of core Kubernetes objects:

Job
: Describes a batch workload as a set of tasks and the Pods they create.

Queue
: Divides cluster capacity between teams or workloads using quotas and priorities.

PodGroup
: Ties a group of Pods together so the scheduler can treat them as a single unit for gang scheduling.
-->
Volcano 在核心 Kubernetes 对象之上引入了自己的资源：

Job
: 将批处理工作负载描述为一组任务及其创建的 Pod。

Queue
: 使用配额和优先级在团队或工作负载之间划分集群容量。

PodGroup
: 将一组 Pod 绑定在一起，使调度器可以将它们作为组调度的单个单元来处理。

<!--
The plugin surfaces all three resource types directly in Headlamp, providing dedicated list and detail views for each of them under a Volcano section in the sidebar.
-->
该插件在 Headlamp 中直接展示所有三种资源类型，在侧边栏的 Volcano 部分下为每种资源提供专用的列表和详情视图。

<!--
## Jobs: workload status, actions, and logs
-->
## Job：工作负载状态、操作和日志 {#jobs-workload-status-actions-and-logs}

<!--
The Job view is the center of the plugin experience. In the list view, you can quickly understand the basics of a workload, including its status, queue, running versus minimum-available values, task count, and age.
-->
Job 视图是插件体验的核心。在列表视图中，你可以快速了解工作负载的基本信息，包括其状态、队列、运行数与最小可用数的对比、任务计数和创建时间。

{{< figure src="volcano-jobs-list.png" alt="Headlamp 中的 Volcano Job 列表" >}}

<!--
The detail view goes further by surfacing the information you usually need while debugging a Job: task details, Pod status, related Queue and PodGroup links, conditions, events, and more. Instead of forcing you to jump between several CLI commands, the plugin keeps that context together in a single page.
-->
详情视图进一步展示了调试 Job 时通常需要的信息：任务详情、Pod 状态、相关的 Queue 和 PodGroup 链接、状况、事件等。
插件将这些上下文集中在单一页面中，而无需在多个 CLI 命令之间来回切换。

<!--
The Job page also adds supported lifecycle actions for appropriate states, including **Suspend** and **Resume**, so you can act on a Job directly from the UI.
-->
Job 页面还为适当的状态添加了支持的生命周期操作，包括**暂停**和**恢复**，使你可以直接从 UI 操作 Job。

<!--
Another useful addition is direct **Job logs** access. You can open logs for Pods created by a Volcano Job without leaving the Job detail page. The logs viewer supports both single-Pod and all-Pods views, along with container selection and common log controls such as line count, previous logs, timestamps, and follow.
-->
另一个有用的功能是直接访问 **Job 日志**。你可以在不离开 Job 详情页面的情况下打开 Volcano Job 创建的 Pod 的日志。
日志查看器支持单 Pod 和全部 Pod 视图，以及容器选择和常用日志控制，如行数、先前日志、时间戳和跟踪。

{{< figure src="volcano-job-logs.png" alt="Headlamp 中的 Volcano Job 日志" >}}

<!--
## Queues: scheduling capacity and resource context
-->
## Queue：调度容量和资源上下文 {#queues-scheduling-capacity-and-resource-context}

<!--
The Queue view provides much more than a small set of top-level fields. It helps you understand how resources are being allocated and constrained by surfacing capacity, allocated resources, deserved and guaranteed resources, reservation details, child queues, and more.
-->
Queue 视图提供的远不止一小组顶层字段。
它通过展示容量、已分配资源、应得和保证资源、预留详情、子队列等信息，帮助你理解资源是如何被分配和约束的。

<!--
This makes the Queue page much more useful when trying to understand how resources are being shared and limited across queues.
-->
这使得 Queue 页面在理解资源如何在队列之间共享和限制时更加有用。

{{< figure src="volcano-queue-detail.png" alt="Headlamp 中的 Volcano Queue 详情" >}}

<!--
## PodGroups: gang scheduling state and blockers
-->
## PodGroup：组调度状态和阻塞因素 {#podgroups-gang-scheduling-state-and-blockers}

<!--
PodGroups are central to understanding gang scheduling in Volcano, and the plugin makes that state easier to inspect. The PodGroup view highlights progress, conditions, minimum resource requirements, and more.
-->
PodGroup 是理解 Volcano 中组调度的核心，该插件使这些状态更易于检查。
PodGroup 视图突出显示进度、状况、最低资源需求等信息。

<!--
This also gives you a clearer picture of whether a workload is blocked because it has not yet met the scheduling conditions required to run as a group.
-->
这也让你更清楚地了解工作负载是否因尚未满足作为一组运行所需的调度条件而被阻塞。

{{< figure src="volcano-podgroup-detail.png" alt="Headlamp 中的 Volcano PodGroup 详情" >}}

<!--
## Map view: jobs, queues, PodGroups, and pods in one place
-->
## 地图视图：Job、Queue、PodGroup 和 Pod 一目了然 {#map-view-jobs-queues-podgroups-and-pods-in-one-place}

<!--
The map view shows how Volcano resources are connected. Instead of inspecting each resource separately, you can see how Jobs, PodGroups, Queues, and Pods relate to one another.
-->
地图视图展示了 Volcano 资源之间的关联。你无需单独检查每个资源，而是可以查看 Job、PodGroup、Queue 和 Pod 之间的关系。

<!--
This is especially useful when a workload is pending or not progressing as expected. The map can show the Job, its related PodGroup, the Pods created for the workload, and the Queue context around it. Warning and error states also make it easier to spot resources that need attention.
-->
当工作负载处于 Pending 状态或未按预期推进时，这尤其有用。
地图可以显示 Job、其相关的 PodGroup、为工作负载创建的 Pod 以及周围的 Queue 上下文。
警告和错误状态也使得发现需要关注的资源变得更加容易。

{{< figure src="volcano-map-view.png" alt="Headlamp 地图视图中的 Volcano 资源" >}}

<!--
## Why use this alongside CLI tools
-->
## 为什么要与 CLI 工具配合使用 {#why-use-this-alongside-cli-tools}

<!--
The plugin is not trying to replace `kubectl` or the Volcano CLI. Those remain important for automation, scripting, and raw object inspection. What the plugin improves is the interactive troubleshooting experience: discovering related resources more quickly, understanding structured detail pages, and moving from scheduling state to runtime output without switching tools constantly.
-->
该插件并非要取代 `kubectl` 或 Volcano CLI。这些工具在自动化、脚本和原始对象检查方面仍然很重要。
插件改进的是交互式故障排查体验：更快地发现相关资源、理解结构化详情页面，以及从调度状态切换到运行时输出而无需不断切换工具。

<!--
## What's next
-->
## 下一步计划 {#whats-next}

<!--
This work brings the main Volcano workflow into Headlamp, including Jobs, Queues, PodGroups, and the map view. Possible future work includes Prometheus integration, richer scheduling insights, and more workflow-oriented visibility across Volcano workloads.
-->
这项工作将主要的 Volcano 工作流引入了 Headlamp，包括 Job、Queue、PodGroup 和地图视图。
未来可能的工作包括 Prometheus 集成、更丰富的调度洞察，以及跨 Volcano 工作负载的更多面向工作流的可见性。

<!--
## Try it and share feedback
-->
## 试用并分享反馈 {#try-it-and-share-feedback}

<!--
To try the plugin:

1. Install Headlamp.
2. Open the Plugin Catalog from the Headlamp UI.
3. Search for Volcano.
4. Install the Volcano plugin.
5. Connect Headlamp to a Kubernetes cluster where Volcano is already installed.
-->
要试用该插件：

1. 安装 Headlamp。
2. 从 Headlamp UI 打开插件目录。
3. 搜索 Volcano。
4. 安装 Volcano 插件。
5. 将 Headlamp 连接到已安装 Volcano 的 Kubernetes 集群。

{{< figure src="volcano-plugin-catalog.png" alt="Headlamp 插件目录中的 Volcano 插件" >}}

<!--
If you have ideas, feature requests, or bug reports, open an issue in the [Headlamp plugins repository](https://github.com/headlamp-k8s/plugins). Feedback from real Volcano users will help shape what comes next.
-->
如果你有想法、功能需求或缺陷报告，请在 [Headlamp 插件仓库](https://github.com/headlamp-k8s/plugins)中提交 Issue。
来自真实 Volcano 用户的反馈将帮助塑造未来的发展方向。
