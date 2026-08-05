---
layout: blog
title: "Headlamp 2025 年度项目亮点"
date: 2026-01-22T10:00:00+08:00
slug: headlamp-in-2025-project-highlights
author: >
  Evangelos Skopelitis (Microsoft)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
title: "Headlamp in 2025: Project Highlights"
date: 2026-01-22T10:00:00+08:00
slug: headlamp-in-2025-project-highlights
author: >
  Evangelos Skopelitis (Microsoft)
-->
<!--
_This announcement is a recap from a post originally [published](https://headlamp.dev/blog/2025/11/13/headlamp-in-2025) on the Headlamp blog._
-->
**本公告是对最初在 Headlamp 博客上[发布](https://headlamp.dev/blog/2025/11/13/headlamp-in-2025)的帖子的回顾。**

<!--
[Headlamp](https://headlamp.dev/) has come a long way in 2025. The project has continued to grow – reaching more teams across platforms, powering new workflows and integrations through plugins, and seeing increased collaboration from the broader community.
-->
[Headlamp](https://headlamp.dev/) 在 2025 年取得了长足的发展。该项目持续成长，覆盖了更多平台和团队；
通过插件机制支持了新的工作流和集成方式；同时也看到了来自更广泛社区的协作不断增强。

<!--
We wanted to take a moment to share a few updates and highlight how Headlamp has evolved over the past year.
-->
我们想借此机会分享一些最新进展，并重点介绍 Headlamp 在过去一年中的演进与变化。

<!--
## Updates
-->
## 更新 {#updates}

<!--
### Joining Kubernetes SIG UI
-->
### 加入 Kubernetes SIG UI {#joining-kubernetes-sig-ui}

<!--
This year marked a big milestone for the project: Headlamp is now officially part of Kubernetes [SIG UI](https://github.com/kubernetes/community/blob/master/sig-ui/README.md). This move brings roadmap and design discussions even closer to the core Kubernetes community and reinforces Headlamp's role as a modern, extensible UI for the project.
-->
今年标志着该项目的一个重要里程碑：Headlamp 现已成为 Kubernetes [SIG UI](https://github.com/kubernetes/community/blob/master/sig-ui/README.md)
的正式组成部分。此举使路线图和设计讨论更贴近 Kubernetes 核心社区，并强化了 Headlamp 作为该项目现代化、可扩展 UI 的角色。

{{< youtube Q5xkeoj6JiA >}}

<!--
As part of that, we've also been sharing more about making Kubernetes approachable for a wider audience, including an [appearance on Enlightening with Whitney Lee](https://www.youtube.com/watch?v=VFOSyKVOPxs) and a [talk at KCD New York 2025](https://www.youtube.com/watch?v=Q7cbT2UBfE0).
-->
作为其中的一部分，我们还分享了更多关于让 Kubernetes 面向更广泛受众的内容，
包括在 [Enlightening with Whitney Lee](https://www.youtube.com/watch?v=VFOSyKVOPxs)
上的亮相以及在 [KCD New York 2025](https://www.youtube.com/watch?v=Q7cbT2UBfE0) 上的演讲。

<!--
### Linux Foundation mentorship
-->
### Linux Foundation 导师计划 {#linux-foundation-mentorship}

<!--
This year, we were excited to work with several students through the Linux Foundation's Mentorship program, and our mentees have already left a visible mark on Headlamp:
-->
今年，我们很高兴通过 Linux Foundation 的导师计划与多名学生合作，我们的学员已经在 Headlamp 上留下了明显的印记：

<!--
- [**Adwait Godbole**](https://github.com/adwait-godbole) built the KEDA plugin, adding a UI in Headlamp to view and manage KEDA resources like ScaledObjects and ScaledJobs.
-->
- [**Adwait Godbole**](https://github.com/adwait-godbole) 构建了 KEDA 插件，
  在 Headlamp 中添加了用于查看和管理 KEDA 资源（如 ScaledObjects 和 ScaledJobs）的 UI。

<!--
- [**Dhairya Majmudar**](https://github.com/DhairyaMajmudar) set up an OpenTelemetry-based observability stack for Headlamp, wiring up metrics, logs, and traces so the project is easier to monitor and debug.
-->
- [**Dhairya Majmudar**](https://github.com/DhairyaMajmudar) 为 Headlamp 设置了基于 OpenTelemetry 的可观测性堆栈，
  连接指标、日志和追踪，使项目更易于监控和调试。

<!--
- [**Aishwarya Ghatole**](https://www.linkedin.com/in/aishwarya-ghatole-506745231/) led a UX audit of Headlamp plugins, identifying usability issues and proposing design improvements and personas for plugin users.
-->
- [**Aishwarya Ghatole**](https://www.linkedin.com/in/aishwarya-ghatole-506745231/) 领导了 Headlamp 插件的 UX 审计，
  识别可用性问题，并提出设计改进和插件用户画像。

<!--
- [**Anirban Singha**](https://github.com/SinghaAnirban005) developed the Karpenter plugin, giving Headlamp a focused view into Karpenter autoscaling resources and decisions.
-->
- [**Anirban Singha**](https://github.com/SinghaAnirban005) 开发了 Karpenter 插件，
  为 Headlamp 提供了专注于 Karpenter 自动扩缩容资源和决策的视图。

<!--
- [**Aditya Chaudhary**](https://github.com/useradityaa) improved Gateway API support, so you can see networking relationships on the resource map, as well as improved support for many of the new Gateway API resources.
-->
- [**Aditya Chaudhary**](https://github.com/useradityaa) 改进了 Gateway API 支持，
  你可以在资源映射上看到网络关系，以及对许多新的 Gateway API 资源的改进支持。

<!--
- [**Faakhir Zahid**](https://github.com/Faakhir30) completed a way to easily [manage plugin installation](https://headlamp.dev/docs/latest/installation/in-cluster/#plugin-management) with Headlamp deployed in clusters.
-->
- [**Faakhir Zahid**](https://github.com/Faakhir30) 完成了一种在集群中部署 Headlamp 时
  轻松[管理插件安装](https://headlamp.dev/docs/latest/installation/in-cluster/#plugin-management)的方法。

<!--
- [**Saurav Upadhyay**](https://github.com/upsaurav12) worked on backend caching for Kubernetes API calls, reducing load on the API server and improving performance in Headlamp.
-->
- [**Saurav Upadhyay**](https://github.com/upsaurav12) 致力于 Kubernetes API 调用的后端缓存，
  减少 API 服务器负载并提高 Headlamp 的性能。

<!--
## New changes
-->
## 新变更 {#new-changes}

<!--
### Multi-cluster view
-->
### 多集群视图 {#multi-cluster-view}

<!--
Managing multiple clusters is challenging: teams often switch between tools and lose context when trying to see what runs where. Headlamp solves this by giving you a single view to compare clusters side-by-side. This makes it easier to understand workloads across environments and reduces the time spent hunting for resources.
-->
管理多个集群具有挑战性：团队经常在工具之间切换，在尝试查看哪些内容在哪里运行时失去上下文。
Headlamp 通过提供单一视图来并排比较集群来解决这个问题。这使得跨环境理解工作负载变得更容易，
并减少了查找资源所花费的时间。

{{< figure src="multi-cluster-view.png" alt="Multi-cluster view" caption="View of multi-cluster workloads" >}}

<!--
### Projects
-->
### 项目 {#projects}

<!--
Kubernetes apps often span multiple namespaces and resource types, which makes troubleshooting feel like piecing together a puzzle. We've added **Projects** to give you an application-centric view that groups related resources across multiple namespaces – and even clusters. This allows you to reduce sprawl, troubleshoot faster, and collaborate without digging through YAML or cluster-wide lists.
-->
Kubernetes 应用通常跨越多个命名空间和资源类型，这使得故障排除感觉像是在拼拼图一样。
我们添加了**项目（Projects）**，为你提供以应用为中心的视图，将相关资源分组到多个命名空间——甚至集群中。
这使你能够减少蔓延、更快地进行故障排除，并在无需深入研究 YAML 或集群范围列表的情况下进行协作。

{{< figure src="projects-feature.png" alt="Projects feature" caption="View of the new Projects feature" >}}

<!--
Changes:
-->
变更：

<!--
- New "Projects" feature for grouping namespaces into app- or team-centric projects
-->
- 新的"项目（Projects）"特性，用于将命名空间分组为以应用或团队为中心的项目

<!--
- Extensible Projects details view that plugins can customize with their own tabs and actions
-->
- 可扩展的项目详细信息视图，插件可以使用自己的标签页和操作进行自定义

<!--
### Navigation and Activities
-->
### 导航和活动 {#navigation-and-activities}

<!--
Day-to-day ops in Kubernetes often means juggling logs, terminals, YAML, and dashboards across clusters. We redesigned Headlamp's navigation to treat these as first-class "activities" you can keep open and come back to, instead of one-off views you lose as soon as you click away.
-->
Kubernetes 中的日常运维通常意味着在集群之间处理日志、终端、YAML 和仪表板。
我们重新设计了 Headlamp 的导航，将这些视为一流的"活动"，你可以保持打开并随时返回，
而不是在点击离开后立即丢失的一次性视图。

{{< figure src="new-task-bar.png" alt="New task bar" caption="View of the new task bar" >}}

<!--
Changes:
-->
变更：

<!--
- A new task bar/activities model lets you pin logs, exec sessions, and details as ongoing activities
-->
- 新的任务栏/活动模型允许你将日志、exec 会话和详细信息固定为正在进行的活动

<!--
- An activity overview with a "Close all" action and cluster information
-->
- 活动概览，带有"全部关闭"操作和集群信息

<!--
- Multi-select and global filters in tables
-->
- 表格中的多选和全局过滤器

<!--
Thanks to [Jan Jansen](https://github.com/farodin91) and [Aditya Chaudhary](https://github.com/useradityaa).
-->
感谢 [Jan Jansen](https://github.com/farodin91) 和 [Aditya Chaudhary](https://github.com/useradityaa)。

<!--
### Search and map
-->
### 搜索和映射 {#search-and-map}

<!--
When something breaks in production, the first two questions are usually "where is it?" and "what is it connected to?" We've upgraded both search and the map view so you can get from a high-level symptom to the right set of objects much faster.
-->
当生产环境中出现问题时，前两个问题通常是"它在哪里？"和"它连接到什么？"我们升级了搜索和映射视图，
以便你可以更快地从高级症状定位到正确的对象集。

{{< figure src="advanced-search.png" alt="Advanced search" caption="View of the new Advanced Search feature" >}}

<!--
Changes:
-->
变更：

<!--
- An Advanced search view that supports rich, expression-based queries over Kubernetes objects
-->
- 高级搜索视图，支持对 Kubernetes 对象进行丰富的、基于表达式的查询

<!--
- Improved global search that understands labels and multiple search items, and can even update your current namespace based on what you find
-->
- 改进的全局搜索，理解标签和多个搜索项，甚至可以根据你找到的内容更新当前命名空间

<!--
- EndpointSlice support in the Network section
-->
- 网络部分中的 EndpointSlice 支持

<!--
- A richer map view that now includes Custom Resources and Gateway API objects
-->
- 更丰富的映射视图，现在包括自定义资源和 Gateway API 对象

<!--
Thanks to [Fabian](https://github.com/faebr), [Alexander North](https://github.com/alexandernorth), and [Victor Marcolino](https://github.com/victormarcolino) from Swisscom, and also to [Aditya Chaudhary](https://github.com/useradityaa).
-->
感谢来自 Swisscom 的 [Fabian](https://github.com/faebr)、[Alexander North](https://github.com/alexandernorth)
和 [Victor Marcolino](https://github.com/victormarcolino)，以及 [Aditya Chaudhary](https://github.com/useradityaa)。

<!--
### OIDC and authentication
-->
### OIDC 和身份认证 {#oidc-and-authentication}

<!--
We've put real work into making OIDC setup clearer and more resilient, especially for in-cluster deployments.
-->
我们在使 OIDC 设置更清晰、更具弹性方面做了实际工作，特别是对于集群内部署。

{{< figure src="user-info.png" alt="User info" caption="View of user information for OIDC clusters" >}}

<!--
Changes:
-->
变更：

<!--
- User information displayed in the top bar for OIDC-authenticated users
-->
- 在顶部栏中为 OIDC 认证用户显示用户信息

<!--
- PKCE support for more secure authentication flows, as well as hardened token refresh handling
-->
- PKCE 支持更安全的身份认证流程，以及强化的令牌刷新处理

<!--
- Documentation for using the access token using `-oidc-use-access-token=true`
-->
- 使用 `-oidc-use-access-token=true` 使用访问令牌的文档

<!--
- Improved support for public OIDC clients like AKS and EKS
-->
- 改进了对 AKS 和 EKS 等公共 OIDC 客户端的支持

<!--
- New guide for setting up Headlamp [on AKS with Azure Entra-ID using OAuth2Proxy](https://headlamp.dev/docs/latest/installation/in-cluster/aks-cluster-oauth/)
-->
- 使用 OAuth2Proxy 在 AKS 上使用 Azure Entra-ID 设置 Headlamp 的[新指南](https://headlamp.dev/docs/latest/installation/in-cluster/aks-cluster-oauth/)

<!--
Thanks to [David Dobmeier](https://github.com/daviddob) and [Harsh Srivastava](https://github.com/HarshSrivastava275).
-->
感谢 [David Dobmeier](https://github.com/daviddob) 和 [Harsh Srivastava](https://github.com/HarshSrivastava275)。

<!--
### App Catalog and Helm
-->
### 应用目录和 Helm {#app-catalog-and-helm}

<!--
We've broadened how you deploy and source apps via Headlamp, specifically supporting vanilla Helm repos.
-->
我们扩展了通过 Headlamp 部署和获取应用的方式，特别是支持原生 Helm 仓库。

<!--
Changes:
-->
变更：

<!--
- A more capable Helm chart with optional backend TLS termination, PodDisruptionBudgets, custom pod labels, and more
-->
- 功能更强大的 Helm chart，具有可选的后端 TLS 终止、PodDisruptionBudgets、自定义 Pod 标签等

<!--
- Improved formatting and added missing access token arg in the Helm chart
-->
- 改进了 Helm chart 中的格式并添加了缺失的访问令牌参数

<!--
- New in-cluster Helm support with an `--enable-helm` flag and a service proxy
-->
- 新的集群内 Helm 支持，带有 `--enable-helm` 标志和服务代理

<!--
Thanks to [Vrushali Shah](https://github.com/shahvrushali22) and [Murali Annamneni](https://github.com/muraliinformal) from Oracle, and also to [Pat Riehecky](https://github.com/jcpunk), [Joshua Akers](https://github.com/jda258), [Rostislav Stříbrný](https://github.com/rstribrn), [Rick L](https://github.com/rickliujh), and [Victor](https://github.com/vnea).
-->
感谢来自 Oracle 的 [Vrushali Shah](https://github.com/shahvrushali22) 和 [Murali Annamneni](https://github.com/muraliinformal)，
以及 [Pat Riehecky](https://github.com/jcpunk)、[Joshua Akers](https://github.com/jda258)、
[Rostislav Stříbrný](https://github.com/rstribrn)、[Rick L](https://github.com/rickliujh) 和 [Victor](https://github.com/vnea)。

<!--
### Performance, accessibility, and UX
-->
### 性能、可访问性和用户体验 {#performance-accessibility-and-ux}

<!--
Finally, we've spent a lot of time on the things you notice every day but don't always make headlines: startup time, list views, log viewers, accessibility, and small network UX details. A continuous accessibility self-audit has also helped us identify key issues and make Headlamp easier for everyone to use.
-->
最后，我们在你每天注意到但不总是成为头条的事情上花费了大量时间：启动时间、列表视图、日志查看器、可访问性以及小的网络 UX 细节。
持续的可访问性自我审计也帮助我们识别关键问题，并使 Headlamp 更易于每个人使用。

{{< figure src="learn-section.png" alt="Learn section" caption="View of the Learn section in docs" >}}

<!--
Changes:
-->
变更：

<!--
- Significant desktop improvements, with up to 60% faster app loads and much quicker dev-mode reloads for contributors
-->
- 显著的桌面改进，应用加载速度提高高达 60%，为贡献者提供更快的开发模式重载

<!--
- Numerous table and log viewer refinements: persistent sort order, consistent row actions, copy-name buttons, better tooltips, and more forgiving log inputs
-->
- 大量表格和日志查看器改进：持久排序顺序、一致的行操作、复制名称按钮、更好的工具提示以及更宽松的日志输入

<!--
- Accessibility and localization improvements, including fixes for zoom-related layout issues, better color contrast, improved screen reader support, and expanded language coverage
-->
- 可访问性和本地化改进，包括修复与缩放相关的布局问题、更好的颜色对比度、改进的屏幕阅读器支持以及扩展的语言覆盖范围

<!--
- More control over resources, with live pod CPU/memory metrics, richer pod details, and inline editing for secrets and CRD fields
-->
- 对资源的更多控制，包括实时 Pod CPU/内存指标、更丰富的 Pod 详细信息以及 Secret 和 CRD 字段的内联编辑

<!--
- A refreshed documentation and plugin onboarding experience, including a "Learn" section and plugin showcase
-->
- 刷新的文档和插件入门体验，包括"学习"部分和插件展示

<!--
- A more complete NetworkPolicy UI and network-related polish
-->
- 更完整的 NetworkPolicy UI 和网络相关的改进

<!--
- Nightly builds available for early testing
-->
- 提供夜间构建版本用于早期测试

<!--
Thanks to [Jaehan Byun](https://github.com/jaehanbyun) and [Jan Jansen](https://github.com/farodin91).
-->
感谢 [Jaehan Byun](https://github.com/jaehanbyun) 和 [Jan Jansen](https://github.com/farodin91)。

<!--
## Plugins and extensibility
-->
## 插件和可扩展性 {#plugins-and-extensibility}

<!--
Discovering plugins is simpler now – no more hopping between Artifact Hub and assorted GitHub repos. Browse our dedicated [Plugins page](https://headlamp.dev/plugins) for a curated catalog of Headlamp-endorsed plugins, along with a showcase of featured plugins.
-->
现在发现插件更简单了——不再需要在 Artifact Hub 和各种 GitHub 仓库之间跳转。浏览我们专门的[插件页面](https://headlamp.dev/plugins)，
查看 Headlamp 认可的插件精选目录以及特色插件展示。

{{< figure src="plugins-page.png" alt="Plugins page" caption="View of the Plugins showcase" >}}

<!--
### Headlamp AI Assistant
-->
### Headlamp AI 助手 {#headlamp-ai-assistant}

<!--
Managing Kubernetes often means memorizing commands and juggling tools. Headlamp's new AI Assistant changes this by adding a natural-language interface built into the UI. Now, instead of typing `kubectl` or digging through YAML you can ask, "Is my app healthy?" or "Show logs for this deployment," and get answers in context, speeding up troubleshooting and smoothing onboarding for new users. Learn more about it [here](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant/).
-->
管理 Kubernetes 通常意味着记忆命令和处理各种工具。Headlamp 的新 AI 助手通过添加内置在 UI 中的自然语言界面改变了这一点。
现在，你可以问"我的应用是否健康？"或"显示此部署的日志"，而不是输入 `kubectl` 或深入研究 YAML，并在上下文中获得答案，
加快故障排除速度并简化新用户的入门。[在此](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant/)了解更多信息。

{{< youtube GzXkUuCTcd4 >}}

<!--
### New plugins additions
-->
### 新增插件 {#new-plugins-additions}

<!--
Alongside the new AI Assistant, we've been growing Headlamp's plugin ecosystem so you can bring more of your workflows into a single UI, with integrations like Minikube, Karpenter, and more.
-->
除了新的 AI 助手，我们一直在发展 Headlamp 的插件生态系统，以便你可以将更多工作流集成到单个 UI 中，包括 Minikube、Karpenter 等集成。

<!--
Highlights from the latest plugin releases:
-->
最新插件发布的亮点：

<!--
- Minikube plugin, providing a locally stored single node Minikube cluster
-->
- Minikube 插件，提供本地存储的单节点 Minikube 集群

<!--
- Karpenter plugin, with support for Azure Node Auto-Provisioning (NAP)
-->
- Karpenter 插件，支持 Azure 节点自动预配（NAP）

<!--
- KEDA plugin, which you can learn more about [here](https://headlamp.dev/blog/2025/07/25/enabling-event-driven-autoscaling-with-the-new-keda-plugin-for-headlamp/)
-->
- KEDA 插件，你可以[在此](https://headlamp.dev/blog/2025/07/25/enabling-event-driven-autoscaling-with-the-new-keda-plugin-for-headlamp/)
  了解更多信息

<!--
- Community-maintained plugins for [Gatekeeper](https://github.com/sozercan/gatekeeper-headlamp-plugin) and [KAITO](https://github.com/kaito-project/headlamp-kaito)
-->
- 社区维护的 [Gatekeeper](https://github.com/sozercan/gatekeeper-headlamp-plugin)
  和 [KAITO](https://github.com/kaito-project/headlamp-kaito) 插件

<!--
Thanks to [Vrushali Shah](https://github.com/shahvrushali22) and [Murali Annamneni](https://github.com/muraliinformal) from Oracle, and also to [Anirban Singha](https://github.com/SinghaAnirban005), [Adwait Godbole](https://github.com/adwait-godbole), [Sertaç Özercan](https://github.com/sozercan), [Ernest Wong](https://github.com/chewong), and [Chloe Lim](https://github.com/chloe608).
-->
感谢来自 Oracle 的 [Vrushali Shah](https://github.com/shahvrushali22) 和 [Murali Annamneni](https://github.com/muraliinformal)，
以及 [Anirban Singha](https://github.com/SinghaAnirban005)、[Adwait Godbole](https://github.com/adwait-godbole)、
[Sertaç Özercan](https://github.com/sozercan)、[Ernest Wong](https://github.com/chewong) 和 [Chloe Lim](https://github.com/chloe608)。

<!--
### Other plugins updates
-->
### 其他插件更新 {#other-plugins-updates}

<!--
Alongside new additions, we've also spent time refining plugins that many of you already use, focusing on smoother workflows and better integration with the core UI.
-->
除了新增内容，我们还花时间改进了你们许多人已经在使用的插件，专注于更流畅的工作流和与核心 UI 的更好集成。

{{< figure src="backstage-plugin.png" alt="Backstage plugin" caption="View of the Backstage plugin" >}}

<!--
Changes:
-->
变更：

<!--
- **Flux plugin**: Updated for Flux v2.7, with support for newer CRDs, navigation fixes so it works smoothly on recent clusters
-->
- **Flux 插件**：更新以支持 Flux v2.7，支持更新的 CRD，导航修复使其在最近的集群上平稳运行

<!--
- **App Catalog**: Now supports Helm repos in addition to Artifact Hub, can run in-cluster via /serviceproxy, and shows both current and latest app versions
-->
- **应用目录**：现在除了 Artifact Hub 之外还支持 Helm 仓库，可以通过 /serviceproxy 在集群内运行，并显示当前和最新的应用版本

<!--
- **Plugin Catalog**: Improved card layout and accessibility, plus dependency and Storybook test updates
-->
- **插件目录**：改进了卡片布局和可访问性，以及依赖项和 Storybook 测试更新

<!--
- **Backstage plugin**: Dependency and build updates, more info [here](https://headlamp.dev/blog/2025/11/05/strengthening-backstage-and-headlamp-integration/)
-->
- **Backstage 插件**：依赖项和构建更新，[在此](https://headlamp.dev/blog/2025/11/05/strengthening-backstage-and-headlamp-integration/)
  了解更多信息

<!--
### Plugin development
-->
### 插件开发 {#plugin-development}

<!--
We've focused on making it faster and clearer to build, test, and ship Headlamp plugins, backed by improved documentation and lighter tooling.
-->
我们专注于使构建、测试和发布 Headlamp 插件更快、更清晰，并辅以改进的文档和更轻量的工具。

{{< figure src="plugin-development.png" alt="Plugin development" caption="View of the Plugin Development guide" >}}

<!--
Changes:
-->
变更：

<!--
- New and expanded guides for [plugin architecture](https://headlamp.dev/docs/latest/development/architecture#plugins) and [development](https://headlamp.dev/docs/latest/development/plugins/getting-started), including how to publish and ship plugins
-->
- 新增和扩展的[插件架构](https://headlamp.dev/docs/latest/development/architecture#plugins)
  和[开发](https://headlamp.dev/docs/latest/development/plugins/getting-started)指南，包括如何发布和交付插件

<!--
- Added [i18n support documentation](https://headlamp.dev/docs/latest/development/plugins/i18n) so plugins can be translated and localized
-->
- 添加了 [i18n 支持文档](https://headlamp.dev/docs/latest/development/plugins/i18n)，以便插件可以被翻译和本地化

<!--
- Added example plugins: [ui-panels](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/ui-panels), [resource-charts](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/resource-charts), [custom-theme](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/custom-theme), and [projects](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/projects)
-->
- 添加了示例插件：[ui-panels](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/ui-panels)、
  [resource-charts](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/resource-charts)、
  [custom-theme](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/custom-theme)
  和[projects](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples/projects)

<!--
- Improved type checking for Headlamp APIs, restored Storybook support for component testing, and reduced dependencies for faster installs and fewer updates
-->
- 改进了 Headlamp API 的类型检查，恢复了用于组件测试的 Storybook 支持，并减少了依赖项以加快安装速度并减少更新

<!--
- Documented plugin install locations, UI signifiers in Plugin Settings, and labels that differentiated shipped, UI-installed, and dev-mode plugins
-->
- 记录了插件安装位置、插件设置中的 UI 标识符，以及区分已交付、UI 安装和开发模式插件的标签

<!--
## Security upgrades
-->
## 安全升级 {#security-upgrades}

<!--
We've also been investing in keeping Headlamp secure – both by tightening how authentication works and by staying on top of upstream vulnerabilities and tooling.
-->
我们还在投资保持 Headlamp 的安全性——既通过加强身份认证的工作方式，也密切关注上游漏洞和工具的更新。

<!--
Updates:
-->
更新：

<!--
- We've been keeping up with security updates, regularly updating dependencies and addressing upstream security issues.
-->
- 我们一直在跟进安全更新，定期更新依赖项并解决上游安全问题。

<!--
- We tightened the Helm chart's default security context and fixed a regression that broke the plugin manager.
-->
- 我们加强了 Helm chart 的默认安全上下文，并修复了破坏插件管理器的回归问题。

<!--
- We've improved OIDC security with PKCE support, helping unblock more secure and standards-compliant OIDC setups when deploying Headlamp in-cluster.
-->
- 我们通过 PKCE 支持改进了 OIDC 安全性，帮助在集群中部署 Headlamp 时解除更安全和符合标准的 OIDC 设置的阻碍。

<!--
## Conclusion
-->
## 结论 {#conclusion}

<!--
Thank you to everyone who has contributed to Headlamp this year – whether through pull requests, plugins, or simply sharing how you're using the project. Seeing the different ways teams are adopting and extending the project is a big part of what keeps us moving forward. If your organization uses Headlamp, consider adding it to our [adopters list](https://github.com/kubernetes-sigs/headlamp/blob/main/ADOPTERS.md).
-->
感谢今年为 Headlamp 做出贡献的每个人——无论是通过合并请求、插件，还是简单地分享你如何使用该项目。
看到团队采用和扩展该项目的不同方式是我们继续前进的重要动力。如果你的组织使用 Headlamp，
请考虑将其添加到我们的[采用者列表](https://github.com/kubernetes-sigs/headlamp/blob/main/ADOPTERS.md)中。

<!--
If you haven't tried Headlamp recently, all these updates are available today. Check out the latest Headlamp release, explore the new views, plugins, and docs, and share your feedback with us on Slack or GitHub – your feedback helps shape where Headlamp goes next
-->
如果你最近还没有尝试过 Headlamp，所有这些更新今天都可以使用。查看最新的 Headlamp 版本，探索新的视图、插件和文档，
并在 Slack 或 GitHub 上与我们分享你的反馈——你的反馈有助于塑造 Headlamp 的未来发展方向。
