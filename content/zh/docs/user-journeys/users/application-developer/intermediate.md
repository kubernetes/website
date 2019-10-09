---
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: 中级
track: "USERS › APPLICATION DEVELOPER › INTERMEDIATE"
content_template: templates/user-journey-content
---
<!-- ---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Intermediate
track: "USERS › APPLICATION DEVELOPER › INTERMEDIATE"
content_template: templates/user-journey-content
--- -->


{{% capture overview %}}

<!-- {{< note  >}}
  This page assumes that you've experimented with Kubernetes before. At this point, you should have basic experience interacting with a Kubernetes cluster (locally with Minikube, or elsewhere), and using API objects like Deployments to run your applications.<br><br>If not, you should review the {{< link text="Beginner App Developer" url="/docs/user-journeys/users/application-developer/foundational/" >}} topics first.
{{< /note  >}} -->
{{< note  >}}
阅读此文档前，假设您之前已经使用过 Kubernetes。此时，您应该拥有与 Kubernetes 集群(本地使用 Minikube 或者其他方式)交互的基本经验，并且使用如 Deployments 这样的 API 对象来运行您的应用程序。<br><br>如果没有请先首先阅读{{< link text="初级应用程序开发者" url="/docs/user-journeys/users/application-developer/foundational/" >}}
{{< /note  >}}
<!-- After checking out the current page and its linked sections, you should have a better understanding of the following: -->
阅读完该页面及其相关链接后，您会对以下方面有更好的理解:

<!-- * Additional Kubernetes workload patterns, beyond Deployments
* What it takes to make a Kubernetes application production-ready
* Community tools that can improve your development workflow -->
* 除了 Deployments 之外的其他 Kubernetes 工作负载模式
* 如何使 Kubernetes 应用生产程序就绪
* 可以改善您开发工作流程的社区工具

{{% /capture %}}


{{% capture body %}}

<!-- ## Learn additional workload patterns -->
## 学习其他的工作负载模式

<!-- As your Kubernetes use cases become more complex, you may find it helpful to familiarize yourself with more of the toolkit that Kubernetes provides. {{< link text="Basic workload" url="/docs/user-journeys/users/application-developer/foundational/#section-2" >}} objects like {{< glossary_tooltip text="Deployments" term_id="deployment" >}} make it straightforward to run, update, and scale applications, but they are not ideal for every scenario. -->
随着您的 Kubernetes 使用案例变得更加复杂，您可能会发现工作负载模式有助于您熟悉 Kubernetes 提供的更多工具包。{{< link text="基本工作负载" url="/docs/user-journeys/users/application-developer/foundational/#section-2" >}}像{{< glossary_tooltip text="Deployments" term_id="deployment" >}}这样的对象可以直接运行，更新和扩展应用程序，但它们并不适用于所有场景。

<!-- The following API objects provide functionality for additional workload types, whether they are *persistent* or *terminating*. -->
以下 API 对象为其他工作负载类型提供功能，无论它们是*持久性的*还是*终止性*的。

<!-- #### Persistent workloads -->
#### 持久性工作负载

<!-- Like Deployments, these API objects run indefinitely on a cluster until they are manually terminated. They are best for long-running applications. -->
像 Deployments 一样，这些 API 对象在集群上无限运行，直到它们被手动终止。它们最适合长期运行的应用程序。

<!-- *  **{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}** - Like Deployments, StatefulSets allow you to specify that a
   certain number of replicas should be running for your application. -->
*  **{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}** - 像 Deployments 一样, StatefulSets 允许您指定应该为您的应用程序运行一定数量的副本。
    <!-- {{< note  >}} It's misleading to say that Deployments can't handle stateful workloads. Using {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}, you can persist data beyond the lifecycle of any individual Pod in your Deployment.
    {{< /note  >}} -->
    {{< note  >}} 说 Deployments 无法处理有状态的工作负载，这是不对的。使用{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}},您可以将数据保存在部署中任何单个 Pod 的生命周期之外。
    {{< /note  >}}

    <!-- However, StatefulSets can provide stronger guarantees about "recovery" behavior than Deployments. StatefulSets maintain a sticky, stable identity for their Pods. The following table provides some concrete examples of what this might look like: -->
    但是，StatefulSets 可以提供比部署更强的“恢复”行为保证。StatefulSets 为其 Pod 保持一个粘性，稳定的身份。下表提供了一些具体示例:

    <!-- |   | Deployment | StatefulSet |
    |---|---|---|
    | **Example Pod name** | `example-b1c4` | `example-0` |
    | **When a Pod dies** | Reschedule on *any* node, with new name `example-a51z` | Reschedule on same node, as `example-0` |
    | **When a node becomes unreachable** | Pod(s) are scheduled onto new node, with new names | Pod(s) are marked as "Unknown", and aren't rescheduled unless the Node object is forcefully deleted | -->
    |   | Deployment | StatefulSet |
    |---|---|---|
    | **案例 Pod 名称** | `example-b1c4` | `example-0` |
    | **Pod 消亡** | 使用新名称 `example-a51z` 重新安排*任何*节点 | 重新安排在同一节点上，如 `example-0` |
    | **node 无法访问** | 使用新名称，将 Pod(s) 安排到新节点 | Pod(s) 被标记为"未知"，c除非强制删除 Node 对象，否则不会重新被安排 |

    <!-- In practice, this means that StatefulSets are best suited for scenarios where replicas (Pods) need to coordinate their workloads in a strongly consistent manner. Guaranteeing an identity for each Pod helps avoid {{< link text="split-brain" url="https://en.wikipedia.org/wiki/Split-brain_(computing)" >}} side effects in the case when a node becomes unreachable ({{< link text="network partition" url="https://en.wikipedia.org/wiki/Network_partition" >}}). This makes StatefulSets a great fit for distributed datastores like Cassandra or Elasticsearch. -->
    实际上，这意味着 StatefulSets 最适合副本 (Pods) 需要以强一致的方式协调其工作负载的场景。保证每个 Pod 的身份有助于避免 {{< link text="脑裂" url="https://en.wikipedia.org/wiki/Split-brain_(computing)" >}} 副作用节点变得无法访问 ({{< link text="网络分区" url="https://en.wikipedia.org/wiki/Network_partition" >}})。这使得 StatefulSets 非常适合分布式数据存储，如 Cassandra 或 Elasticsearch 。


<!-- * **{{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}** - DaemonSets run continuously on every node in your cluster, even as nodes are added or swapped in. This guarantee is particularly useful for setting up global behavior across your cluster, such as: -->
* **{{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}** - 即使添加或交换节点，DaemonSets 也会在集群中的每个节点上连续运行。该保证对于在群集中设置全局行为特别有用，例如:
  <!-- * Logging and monitoring, from applications like `fluentd`
  * Network proxy or {{< link text="service mesh" url="https://www.linux.com/news/whats-service-mesh-and-why-do-i-need-one" >}} -->
  * 从 `fluentd` 等应用程序进行记录与监控
  * 网络代理 或者 {{< link text="服务网格" url="https://www.linux.com/news/whats-service-mesh-and-why-do-i-need-one" >}}


<!-- #### Terminating workloads -->
#### 终止性工作负载

<!-- In contrast to Deployments, these API objects are finite. They stop once the specified number of Pods have completed successfully. -->
与 Deployments 相比，这些 API 对象是有限的。一旦指定数量的 Pod 成功完成，它们就会停止。

<!-- * **{{< glossary_tooltip text="Jobs" term_id="job" >}}** - You can use these for one-off tasks like running a script or setting up a work queue. These tasks can be executed sequentially or in parallel. These tasks should be relatively independent, as Jobs do not support closely communicating parallel processes. {{< link text="Read more about Job patterns" url="/docs/concepts/workloads/controllers/jobs-run-to-completion/#job-patterns" >}}. -->
* **{{< glossary_tooltip text="Jobs" term_id="job" >}}** -您可以将它们用于一次性任务，例如运行脚本或设置工作队列。这些任务可以顺序执行或并行执行。这些任务应当相对独立，因为 Jobs 不支持并行进程间密切交流。{{< link text="阅读更多关于任务模式" url="/docs/concepts/workloads/controllers/jobs-run-to-completion/#job-patterns" >}}。

<!-- * **{{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}** - These are similar to Jobs, but allow you to schedule their execution for a specific time or for periodic recurrence. You might use CronJobs to send reminder emails or to run backup jobs. They are set up with a similar syntax as *crontab*. -->
* **{{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}** - CronJobs 与 Jobs 类似，但是它们允许您在特定的时间或者定期重复计划执行。您可以使用 CronJobs 发送提醒电子邮件或运行备份任务。它们的设置语法与*crontab*类似。

<!-- #### Other resources -->
#### 其他资源

<!-- For more info, you can check out {{< link text="a list of additional Kubernetes resource types" url="/docs/reference/kubectl/overview/#resource-types" >}} as well as the {{< link text="API reference docs" url="{{ reference_docs_url }}" >}}. -->
有关详细信息，您可以查看{{< link text="其他 Kubernetes 资源类型列表" url="/docs/reference/kubectl/overview/#resource-types" >}}以及{{< link text=" API 参考文档" url="{{ reference_docs_url }}" >}}。

<!-- There may be additional features not mentioned here that you may find useful, which are covered in the {{< link text="full Kubernetes documentation" url="/docs/home/?path=browse" >}}. -->
这里没有提到您可能会觉得有用的其他功能，这些功能在{{< link text="完整的 Kubernetes 文档" url="/docs/home/?path=browse" >}} 中有所介绍。

<!-- ## Deploy a production-ready workload -->
## 部署生产就绪的工作负载

<!-- The beginner tutorials on this site, such as the {{< link text="Guestbook app" url="/docs/tutorials/stateless-application/guestbook/" >}}, are geared towards getting workloads up and running on your cluster. This prototyping is great for building your intuition around Kubernetes! However, in order to reliably and securely promote your workloads to production, you need to follow some additional best practices. -->
这个网站上的初学者教程，例如{{< link text="留言簿应用" url="/docs/tutorials/stateless-application/guestbook/" >}}, 目的是使工作负载在集群上启动并运行。这种原型设计非常适合在 Kubernetes 周围产生自己的见解！但是，为了可靠、安全地将工作负载推向生产，您需要遵循一些其他的最佳实践。

<!-- #### Declarative configuration -->
#### 声明性配置

<!-- You are likely interacting with your Kubernetes cluster via {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}. kubectl can be used to debug the current state of your cluster (such as checking the number of nodes), or to modify live Kubernetes objects (such as updating a workload's replica count with `kubectl scale`). -->
您可能通过{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}与您的 Kubernetes 集群进行通信。kubectl 可用于调试集群的当前状态(例如检查节点数)，或者修改实时 Kubernetes 对象(例如使用 `kubectl scale` 更新工作负载的副本计数)。

<!-- When using kubectl to update your Kubernetes objects, it's important to be aware that different commands correspond to different approaches: -->
使用 kubectl 更新 Kubernetes 对象时，请务必注意不同的命令对应不同的方法：

<!-- * {{< link text="Purely imperative" url="/docs/tutorials/object-management-kubectl/imperative-object-management-command/" >}}
* {{< link text="Imperative with local configuration files" url="/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/" >}} (typically YAML)
* {{< link text="Declarative with local configuration files" url="/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/" >}} (typically YAML) -->
* {{< link text="完全命令式" url="/docs/tutorials/object-management-kubectl/imperative-object-management-command/" >}}
* {{< link text="使用本地配置文件的命令式配置" url="/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/" >}} (通常为 YAML)
* {{< link text="使用本地配置文件的声明式配置" url="/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/" >}} (通常为 YAML)

<!-- There are pros and cons to each approach, though the declarative approach (such as `kubectl apply -f`) may be most helpful in production. With this approach, you rely on local YAML files as the source of truth about your desired state. This enables you to version control your configuration, which is helpful for code reviews and audit tracking. -->
虽然声明式配置(例如 `kubectl apply -f` )在生产中可能最有用，但每种方法都有利有弊。使用这种方法，您可以依赖本地 YAML 文件作为期望状态的来源。这使您可以对配置进行版本控制，这有助于代码审查和审计跟踪。

<!-- For additional configuration best practices, familiarize yourself with {{< link text="this guide" url="/docs/concepts/configuration/overview/" >}}. -->
有关其他配置最佳做法，请熟悉{{< link text="指南" url="/docs/concepts/configuration/overview/" >}}。

<!-- #### Security -->
#### 安全

<!-- You may be familiar with the *principle of least privilege*---if you are too generous with permissions when writing or using software, the negative effects of a compromise can escalate out of control. Would you be cautious handing out `sudo` privileges to software on your OS? If so, you should be just as careful when granting your workload permissions to the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} server! The API server is the gateway for your cluster's source of truth; it provides endpoints to read or modify cluster state. -->
您可能熟悉*最小特权原则* ---如果您在编写或使用软件时过于宽松，那么折衷的负面影响可能会升级失控。您是否会谨慎地将“sudo”权限分配给您的操作系统上的软件？API服务器是集群真实来源的网关; 它提供端点来读取或修改集群状态。

<!-- You (or your {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}}) can lock down API access with the following: -->
您(或您的{{< glossary_tooltip text="集群管理员" term_id="cluster-operator" >}})可以使用以下命令锁定 API 访问权限:

<!-- * **{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}** - An "identity" that your Pods can be tied to
* **{{< glossary_tooltip text="RBAC" term_id="rbac" >}}** - One way of granting your ServiceAccount explicit permissions -->
* **{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}** - 您的 Pod 可以绑定的"身份"
* **{{< glossary_tooltip text="RBAC" term_id="rbac" >}}** - 授予 ServiceAccount 显式权限的一种方式

<!-- For even more comprehensive reading about security best practices, consider checking out the following topics: -->
有关安全性最佳实践的更全面的阅读，请考虑查看以下主题:

<!-- * {{< link text="Authentication" url="/docs/reference/access-authn-authz/authentication/" >}} (Is the user who they say they are?)
* {{< link text="Authorization" url="/docs/admin/authorization/" >}} (Does the user actually have permissions to do what they're asking?) -->
* {{< link text="认证" url="/docs/reference/access-authn-authz/authentication/" >}}(他们说的用户是谁?)
* {{< link text="授权" url="/docs/admin/authorization/" >}}(用户是否真的有权做他们要求的事情?)

<!-- #### Resource isolation and management -->
#### 资源隔离与管理

<!-- If your workloads are operating in a *multi-tenant* environment with multiple teams or projects, your container(s) are not necessarily running alone on their node(s). They are sharing node resources with other containers which you do not own. -->
如果您的工作负载在具有多个团队或项目的*多租户*环境中运行，则容器不一定在其节点上单独运行。它们与您不拥有的其他容器共享节点资源。

<!-- Even if your cluster operator is managing the cluster on your behalf, it is helpful to be aware of the following: -->
即使您的集群运营者代表您管理集群，了解以下内容会对你有帮助:

<!-- * **{{< glossary_tooltip text="Namespaces" term_id="namespace" >}}**, used for isolation
* **{{< link text="Resource quotas" url="/docs/concepts/policy/resource-quotas/" >}}**, which affect what your team's workloads can use
* **{{< link text="Memory" url="/docs/tasks/configure-pod-container/assign-memory-resource/" >}} and {{< link text="CPU" url="/docs/tasks/configure-pod-container/assign-cpu-resource/" >}} requests**, for a given Pod or container
* **{{< link text="Monitoring" url="/docs/tasks/debug-application-cluster/resource-usage-monitoring/" >}}**, both on the cluster level and the app level -->
* **{{< glossary_tooltip text="命名空间" term_id="namespace" >}}**, 用于隔离
* **{{< link text="资源配额" url="/docs/concepts/policy/resource-quotas/" >}}**, 影响团队的工作负载
* **{{< link text="内存" url="/docs/tasks/configure-pod-container/assign-memory-resource/" >}} and {{< link text="CPU" url="/docs/tasks/configure-pod-container/assign-cpu-resource/" >}} requests**, 对于给定的 Pod 或容器请求
* **{{< link text="监视" url="/docs/tasks/debug-application-cluster/resource-usage-monitoring/" >}}**, 集群级和应用级

<!-- This list may not be completely comprehensive, but many teams have existing processes that take care of all this. If this is not the case, you'll find the Kubernetes documentation fairly rich in detail. -->
这个清单可能并不完全全面，但许多团队都有处理所有这些问题的现有流程。如果不是这样，您会发现 Kubernetes 文档非常详细。

<!-- ## Improve your dev workflow with tooling -->
## 使用工具改进开发工作流程

<!-- As an app developer, you'll likely encounter the following tools in your workflow. -->
作为 app 开发者，您可能会在工作流中遇到以下工具。

#### kubectl

<!-- `kubectl` is a command-line tool that allows you to easily read or modify your Kubernetes cluster. It provides convenient, short commands for common operations like scaling app instances and getting node info. How does kubectl do this? It's basically just a user-friendly wrapper for making API requests. It's written using {{< link text="client-go" url="https://github.com/kubernetes/client-go/#client-go" >}}, the Go library for the Kubernetes API. -->
`kubectl` 是一个命令行工具，它允许您轻松读取或修改 Kubernetes 集群。它为常见操作(如缩放 app 应用程序实例和获取节点信息)提供了方便快捷的命令。 kubectl 是怎么做到的？它基本上仅仅是一个用于发出 API 请求的用户友好的包装器。它是使用{{< link text="client-go" url="https://github.com/kubernetes/client-go/#client-go" >}}编写的，这是 Kubernetes API 的 go 库。

<!-- To learn about the most commonly used kubectl commands, check out the {{< link text="kubectl cheatsheet" url="/docs/reference/kubectl/cheatsheet/" >}}. It explains topics such as the following: -->
要了解最常用的 kubectl 命令，请查看{{< link text="kubectl 目录" url="/docs/reference/kubectl/cheatsheet/" >}}。它解释了以下主题:

<!-- * {{< link text="kubeconfig files" url="/docs/tasks/access-application-cluster/configure-access-multiple-clusters/" >}} - Your kubeconfig file tells kubectl what cluster to talk to, and can reference multiple clusters (such as dev and prod).
* {{< link text="The various output formats available" url="/docs/reference/kubectl/cheatsheet/#formatting-output" >}} - This is useful to know when you are using `kubectl get` to list information about certain API objects.

* {{< link text="The JSONPath output format" url="/docs/reference/kubectl/jsonpath/" >}} - This is related to the output formats above. JSONPath is especially useful for parsing specific subfields out of `kubectl get` output (such as the URL of a {{< glossary_tooltip text="Service" term_id="service" >}}).

* {{< link text="`kubectl run` vs `kubectl apply`" url="/docs/reference/kubectl/conventions/" >}} - This ties into the [declarative configuration](#declarative-configuration) discussion in the previous section.

For the full list of kubectl commands and their options, check out {{< link text="the reference guide" url="/docs/reference/generated/kubectl/kubectl-commands" >}}. -->
* {{< link text="kubeconfig 文件" url="/docs/tasks/access-application-cluster/configure-access-multiple-clusters/" >}} - kubeconfig 文件告诉 kubectl 要与哪个集群通信，并且可以引用多个集群(比如 dev 和 prod)。
* {{< link text="可用的各种输出格式" url="/docs/reference/kubectl/cheatsheet/#formatting-output" >}} - 这有助于了解何时使用 `kubectl get` 列出有关某些 API 对象的信息。

* {{< link text="JSONPath 输出格式" url="/docs/reference/kubectl/jsonpath/" >}} - 这与上面的输出格式有关。JSONPath 对于解析来自 `kubectl get` 输出的特定子字段(例如{{< glossary_tooltip text="Service" term_id="service" >}}中的 url)特别有用。

* {{< link text="`kubectl run` vs `kubectl apply`" url="/docs/reference/kubectl/conventions/" >}} - 这与上一节中的 [声明性配置](#declarative-configuration)讨论有关。

有关 kubectl 命令及其选项的完整列表，请查看 {{< link text="参考指南" url="/docs/reference/generated/kubectl/kubectl-commands" >}}。

#### Helm

<!-- To leverage pre-packaged configurations from the community, you can use **{{< glossary_tooltip text="Helm charts" term_id="helm-chart" >}}**. -->
要利用来自社区的预打包配置，可以使用 **{{< glossary_tooltip text="Helm charts" term_id="helm-chart" >}}**。

<!-- Helm charts package up YAML configurations for specific apps like Jenkins and Postgres. You can then install and run these apps on your cluster with minimal extra configuration. This approach makes the most sense for "off-the-shelf" components which do not require much custom implementation logic.

For writing your own Kubernetes app configurations, there is a {{< link text="thriving ecosystem of tools" url="https://docs.google.com/a/heptio.com/spreadsheets/d/1FCgqz1Ci7_VCz_wdh8vBitZ3giBtac_H8SBw4uxnrsE/edit?usp=drive_web" >}} that you may find useful. -->
Helm 图表为 Jenkins 和 Postgres 等特定应用 apps 打包了 YAML 配置文件。然后，您只需进行最少的额外配置，就可以在集群上安装和运行这些应用 apps。这种方法对于不需要很多自定义实现逻辑的“现成”组件最有意义。

对于编写自己的 Kubernetes 应用程序配置文件，有一个{{< link text="强大的工具生态系统" url="https://docs.google.com/a/heptio.com/spreadsheets/d/1FCgqz1Ci7_VCz_wdh8vBitZ3giBtac_H8SBw4uxnrsE/edit?usp=drive_web" >}}链接，您可能会发现它很有用。

<!-- ## Explore additional resources -->
## 探索其他资源

<!-- #### References -->
#### 参考
<!-- Now that you're fairly familiar with Kubernetes, you may find it useful to browse the following reference pages. Doing so provides a high level view of what other features may exist: -->
现在您已经相当熟悉 kubernetes，您可能会发现浏览下面的参考页很有用。这样做提供了可能存在的其他功能的高层次视图:

* {{< link text="常用的 `kubectl` 命令" url="/docs/reference/kubectl/cheatsheet/" >}}
* {{< link text="Kubernetes API 参考" url="{{ reference_docs_url }}" >}}
* {{< link text="标准化用词" url="/docs/reference/glossary/" >}}

<!-- In addition, {{< link text="the Kubernetes Blog" url="https://kubernetes.io/blog/" >}} often has helpful posts on Kubernetes design patterns and case studies. -->
此外，{{< link text="Kubernetes 博客" url="https://kubernetes.io/blog/" >}} 
经常有关于 Kubernetes 设计模式和案例研究的有用文章。

<!-- #### What's next -->
#### 接下来
<!-- If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys: -->
如果您对本页中的话题感到相当满意，并希望了解更多信息，请查看以下用户旅程:

<!-- * {{< link text="Advanced App Developer" url="/docs/user-journeys/users/application-developer/advanced/" >}} - Dive deeper, with the next level of this journey.
* {{< link text="Foundational Cluster Operator" url="/docs/user-journeys/users/cluster-operator/foundational/" >}} - Build breadth, by exploring other journeys. -->
* {{< link text="高级应用程序开发者" url="/docs/user-journeys/users/application-developer/advanced/" >}} - 更深一步，继续下一步的旅程。
* {{< link text="基础集群运营商" url="/docs/user-journeys/users/cluster-operator/foundational/" >}} - 通过探索其他的旅程来建立广度。
{{% /capture %}}


