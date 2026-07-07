---
layout: blog
title: "在 Kubernetes 上运行 AI/ML 工作负载：用于 Kubeflow 的 Headlamp 插件"
date: 2026-07-13T12:00:00-08:00
slug: introducing-headlamp-plugin-for-kubeflow
author: >
  [Alok Dangre](https://github.com/alokdangre) (independent)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Operating AI/ML Workloads on Kubernetes: A Headlamp Plugin for Kubeflow"
date: 2026-07-13T12:00:00-08:00
slug: introducing-headlamp-plugin-for-kubeflow
author: >
  [Alok Dangre](https://github.com/alokdangre) (independent)
-->

<!--
Kubernetes has quietly become the default platform for AI and machine learning. Whether you run notebook servers for data scientists, schedule distributed training jobs, tune hyperparameters, or orchestrate multi-step ML pipelines, those workloads increasingly land on a Kubernetes cluster. [Kubeflow](https://www.kubeflow.org/) is one of the most popular ways to assemble that stack, and it does so the Kubernetes-native way: every capability is exposed as a Custom Resource Definition (CRD).
-->
Kubernetes 已经悄然成为 AI 和机器学习的默认平台。
无论你是为数据科学家运行 Notebook 服务器、调度分布式训练作业、调优超参数，
还是编排多步骤 ML 流水线，这些工作负载越来越多地运行在 Kubernetes 集群上。
[Kubeflow](https://www.kubeflow.org/) 是组装该堆栈最流行的方式之一，它以
Kubernetes 原生方式实现：每个功能都作为自定义资源定义（CRD）暴露。

<!--
That design is a gift to cluster operators, because it means ML workloads can be observed and managed with the same primitives as everything else in the cluster. But in practice the specialized ML dashboards that ship with these platforms hide the Kubernetes layer underneath. When a notebook is stuck or a training run fails, the operator is often left dropping back to `kubectl` to find out what actually happened at the Pod level.
-->
这种设计对集群管理员来说是一个礼物，因为这意味着 ML 工作负载可以使用与集群中其他所有东西相同的原语进行观察和管理。
但实际上，这些平台附带的专业 ML 仪表板隐藏了底层的 Kubernetes 层。
当 Notebook 卡住或训练运行失败时，管理员通常不得不回到 `kubectl` 来找出 Pod 级别实际发生了什么。

<!--
This post introduces the **Headlamp Kubeflow plugin**, which closes that gap by surfacing Kubeflow's custom resources directly inside a general-purpose Kubernetes UI. It is a worked example of a pattern any CRD-heavy platform can follow: meet operators where they already work, and show them the cluster-level truth.
-->
本文介绍了 **Headlamp Kubeflow 插件**，它通过在通用 Kubernetes UI 中直接展示 Kubeflow 的自定义资源来弥合这一问题。
这是任何 CRD 密集型平台都可以遵循的模式的一个实例：在管理员已经工作的地方与他们会面，并向他们展示集群级别的真相。

<!--
Headlamp itself is an extensible Kubernetes web UI maintained under [Kubernetes SIG UI](https://github.com/kubernetes-sigs/headlamp) and licensed under Apache 2.0. It runs as a desktop app or in-cluster, and its plugin system lets anyone add first-class views for custom resources.
-->
Headlamp 本身是一个可扩展的 Kubernetes Web UI，由
[Kubernetes SIG UI](https://github.com/kubernetes-sigs/headlamp) 维护，采用 Apache 2.0 许可。
它可以作为桌面应用或在集群内运行，其插件系统允许任何人添加自定义资源的一流视图。

<!--
## Why operators need a different view
-->
## 为什么管理员需要不同的视图

<!--
Purpose-built ML dashboards help data scientists submit experiments, pipelines, and notebooks. Cluster operators and site reliability engineers (SREs) troubleshoot the Kubernetes resources underneath, and they ask different questions:
-->
专门构建的 ML 仪表板帮助数据科学家提交实验、流水线和 Notebook。
集群管理员和站点可靠性工程师（SRE）对底层的 Kubernetes 资源进行故障排除，他们会问不同的问题：

<!--
- Why is a notebook stuck? Is it `ImagePullBackOff`, `OOMKilled`, or a Pod waiting on a PersistentVolumeClaim?
- Which Run resources failed recently across namespaces?
- Which parameter set does a Katib Experiment report as optimal?
- Do TrainJob resources reference the expected TrainingRuntime resources?
- Which batch workloads are running, and what state does Kubernetes report?
-->
- 为什么 Notebook 卡住了？是 `ImagePullBackOff`、`OOMKilled`，还是 Pod 在等待 PersistentVolumeClaim？
- 最近跨命名空间有哪些 Run 资源失败了？
- Katib Experiment 报告哪个参数集是最优的？
- TrainJob 资源是否引用了预期的 TrainingRuntime 资源？
- 哪些批处理工作负载正在运行，Kubernetes 报告什么状态？

<!--
The Headlamp Kubeflow plugin helps answer these questions by reading directly from the Kubernetes API server. It shows Pod conditions, Kubernetes failure reasons, and resources across namespaces without requiring an intermediary ML service or database.
-->
Headlamp Kubeflow 插件通过直接从 Kubernetes API 服务器读取数据来帮助回答这些问题。
它显示 Pod 状况、Kubernetes 失败原因以及跨命名空间的资源，无需中间的 ML 服务或数据库。

<!--
## What the plugin covers
-->
## 插件涵盖的内容

<!--
Kubeflow is modular, and teams often install only the components they need. The plugin discovers the Kubeflow API groups on a cluster and displays only the corresponding sections.
-->
Kubeflow 是模块化的，团队通常只安装他们需要的组件。
插件会发现集群上的 Kubeflow API 组，并只显示相应的部分。

<!--
The plugin supports the following component families and API resources:
-->
插件支持以下组件系列和 API 资源：

<!--
< table caption="Kubeflow components and API resources supported by the Headlamp plugin" >

| Component | Purpose | API resources |
| :--- | :--- | :--- |
| **Notebooks** | Provides development environments such as Jupyter, VS Code, and RStudio | Notebook, Profile, PodDefault |
| **Pipelines** | Defines and tracks pipelines, versions, experiments, runs, and schedules | Pipeline, PipelineVersion, Run, RecurringRun, Experiment |
| **Katib** | Automates hyperparameter tuning and neural architecture search | Experiment, Trial, Suggestion |
| **Training** | Runs distributed training workloads such as PyTorch and TensorFlow jobs | TrainJob, TrainingRuntime, ClusterTrainingRuntime |
| **Spark** | Runs large-scale data processing with Apache Spark | SparkApplication, ScheduledSparkApplication |

-->
{{< table caption="Headlamp 插件支持的 Kubeflow 组件和 API 资源" >}}
| 组件 | 用途 | API 资源 |
| :--- | :--- | :--- |
| **Notebook** | 提供 Jupyter、VS Code 和 RStudio 等开发环境 | Notebook、Profile、PodDefault |
| **Pipeline** | 定义和跟踪流水线、版本、实验、运行和调度 | Pipeline、PipelineVersion、Run、RecurringRun、Experiment |
| **Katib** | 自动化超参数调优和神经架构搜索 | Experiment、Trial、Suggestion |
| **Training** | 运行 PyTorch 和 TensorFlow 作业等分布式训练工作负载 | TrainJob、TrainingRuntime、ClusterTrainingRuntime |
| **Spark** | 使用 Apache Spark 运行大规模数据处理 | SparkApplication、ScheduledSparkApplication |
{{< /table >}}

<!--
## What you can see

### Inspect notebook Pods
-->
## 你可以看到什么

### 检查 Notebook Pod

<!--
The Notebook detail view shows Pod conditions and their `reason` and `message` fields. It also shows CPU, memory, and GPU requests and limits; volume mounts and their backing types, such as PersistentVolumeClaim, ConfigMap, Secret, or `emptyDir`; environment variables that reference Secret or ConfigMap objects; sidecar containers; and node tolerations. This view consolidates information that would otherwise require several `kubectl describe` commands.
-->
Notebook 详情视图显示 Pod 条件及其 `reason` 和 `message` 字段。
它还显示 CPU、内存和 GPU 的请求和限制；卷挂载及其后端类型，如 PersistentVolumeClaim、ConfigMap、Secret
或 `emptyDir`；引用 Secret 或 ConfigMap 对象的环境变量；边车容器；以及节点容忍度。
这个视图整合了否则需要多个 `kubectl describe` 命令才能获得的信息。

<!--
### Inspect hyperparameter tuning
-->
### 检查超参数调优

<!--
The Katib views show the tuning algorithm, search space, every Trial with its live status, and the current best Trial with its metric values and parameter assignments. They also show the early-stopping configuration and the number of Trial resources that stopped early, so you can follow the search without leaving the cluster UI.
-->
Katib 视图显示调优算法、搜索空间、每个 Trial 及其实时状态，以及当前最佳 Trial 及其指标值和参数分配。
它们还显示早停配置和提前停止的 Trial 资源数量，因此你可以在不离开集群 UI 的情况下跟踪搜索过程。

<!--
### Inspect pipeline state without the backend database
-->
### 无需后端数据库检查流水线状态

<!--
The Pipelines views read Kubernetes API resources directly and do not query the Kubeflow Pipelines API service or backend database. You can inspect stored pipeline state even when that service is unavailable. The Pipeline detail view compares the latest and previous PipelineVersion specifications in a side-by-side YAML diff. Run views show state and duration, RecurringRun views show human-readable schedules, and the artifacts view aggregates `pipelineRoot` values from recent Run resources.
-->
Pipeline 视图直接读取 Kubernetes API 资源，不查询 Kubeflow Pipeline API 服务或后端数据库。
即使该服务不可用，你也可以检查存储的流水线状态。
Pipeline 详情视图以并排 YAML diff 方式比较最新和之前的 PipelineVersion 规约。
Run 视图显示状态和持续时间，RecurringRun 视图显示人类可读的调度，Artifact 视图汇总最近 Run 资源的 `pipelineRoot` 值。

<!--
### Map ML resources
-->
### 映射 ML 资源

<!--
The plugin registers a [Headlamp map source](https://headlamp.dev/docs/latest/development/plugins/functionality/extending-the-map/) that renders Notebook, Profile, PodDefault, Experiment, Pipeline, SparkApplication, and TrainJob resources as graph nodes. It draws edges between supported resources based on `.metadata.ownerReferences`. Headlamp also shows inline summaries for these resource types when you hover over them.
-->
插件注册了一个 [Headlamp 映射资源](https://headlamp.dev/docs/latest/development/plugins/functionality/extending-the-map/)，
将 Notebook、Profile、PodDefault、Experiment、Pipeline、SparkApplication 和 TrainJob 资源渲染为图节点。
它根据 `.metadata.ownerReferences` 在支持的资源之间绘制边。
当你悬停在这些资源类型上时，Headlamp 还会显示内联摘要。

<!--
## Try it
-->
## 试试看

<!--
The [Kubeflow plugin README](https://github.com/headlamp-k8s/plugins/blob/main/kubeflow/README.md) explains installation and local-cluster setup, including a lightweight CRD-only path for evaluation. Because the plugin discovers installed API groups, you can use it with an existing modular Kubeflow installation or create an evaluation cluster with only the CRDs and sample resources.
-->
[Kubeflow 插件 README](https://github.com/headlamp-k8s/plugins/blob/main/kubeflow/README.md)
解释了安装和本地集群设置，包括用于评估的轻量级仅 CRD 路径。
由于插件会发现已安装的 API 组，你可以将其与现有的模块化 Kubeflow 安装一起使用，
或创建一个仅包含 CRD 和示例资源的评估集群。

<!--
## Apply the pattern to other platforms
-->
## 将模式应用到其他平台

<!--
Kubeflow illustrates a broader pattern. Platforms often model domain-specific workflows with custom resources. Their dashboards focus on those workflows, while Kubernetes operators also need the state of the underlying API resources and Pods. A CRD-driven plugin in a general Kubernetes UI can expose that state without making operators switch between unrelated tools.
-->
Kubeflow 展示了一个更广泛的模式。平台通常使用自定义资源对特定领域的工作流进行建模。
它们的仪表板专注于这些工作流，而 Kubernetes 管理员也需要底层 API 资源和 Pod 的状态。
通用 Kubernetes UI 中的 CRD 驱动插件可以暴露该状态，而无需管理员在不相关的工具之间切换。

<!--
The plugin uses the Apache 2.0 license and is developed under Kubernetes SIG UI. To report a problem or contribute an improvement, use the Headlamp plugins repository's [issue tracker](https://github.com/headlamp-k8s/plugins/issues) or [pull requests](https://github.com/headlamp-k8s/plugins/pulls).
-->
该插件使用 Apache 2.0 许可，由 Kubernetes SIG UI 开发。
要报告问题或贡献改进，请使用 Headlamp 插件仓库的 [Issue Tracker](https://github.com/headlamp-k8s/plugins/issues)
或 [Pull Request](https://github.com/headlamp-k8s/plugins/pulls)。
