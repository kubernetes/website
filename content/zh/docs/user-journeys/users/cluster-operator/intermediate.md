---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: 中级
track: "USERS > CLUSTER OPERATOR > INTERMEDIATE"
content_template: templates/user-journey-content
---
<!--
---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Intermediate
track: "USERS > CLUSTER OPERATOR > INTERMEDIATE"
content_template: templates/user-journey-content
---
-->

{{% capture overview %}}

<!--
If you are a cluster operator looking to expand your grasp of Kubernetes, this page and its linked topics extend the information provided on the [foundational cluster operator page](/docs/user-journeys/users/cluster-operator/foundational). From this page you can get information on key Kubernetes tasks needed to manage a complete production cluster.
-->
如果您是一个集群操作者，希望扩展对 Kubernetes 的理解，本页及其相关主题会扩展[基础集群操作者页面](/docs/user-journeys/users/cluster-operator/foundational)上提供的信息。在本页中，你可以获得如何管理一个完整生产集群的关键 Kubernetes 任务的信息。

{{% /capture %}}

{{% capture body %}}
<!--
## Work with ingress, networking, storage, and workloads
-->
## 使用 ingress，网络，存储和工作负载

<!--
Introductions to Kubernetes typically discuss simple stateless applications. As you move into more complex development, testing, and production environments, you need to consider more complex cases:
-->
Kubernetes 的介绍通常讨论简单的无状态应用程序。当您进入更复杂的开发，测试和生产环境时，您需要考虑更复杂的情况：

<!--
Communication: Ingress and Networking

* [Ingress](/docs/concepts/services-networking/ingress/)
-->
通信： Ingress 和网络

* [Ingress](/docs/concepts/services-networking/ingress/)

<!--
Storage: Volumes and PersistentVolumes

* [Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
-->
存储：Volumes 和 PersistentVolumes

* [Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

<!--
Workloads

* [DaemonSets](/docs/concepts/workloads/controllers/daemonset/)
* [Stateful Sets](/docs/concepts/workloads/controllers/statefulset/)
* [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)
-->
工作负载

* [DaemonSets](/docs/concepts/workloads/controllers/daemonset/)
* [Stateful Sets](/docs/concepts/workloads/controllers/statefulset/)
* [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)

<!--
Pods

* [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [Init Containers](/docs/concepts/workloads/pods/init-containers/)
  * [Pod Presets](/docs/concepts/workloads/pods/podpreset/)
  * [Container Lifecycle Hooks](/docs/concepts/containers/container-lifecycle-hooks/)
-->
Pods

* [Pod 生命周期](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [初始化容器](/docs/concepts/workloads/pods/init-containers/)
  * [Pod 预置](/docs/concepts/workloads/pods/podpreset/)
  * [容器生命周期挂钩](/docs/concepts/containers/container-lifecycle-hooks/)

<!--
And how Pods work with scheduling, priority, disruptions:

* [Taints and Tolerations](/docs/concepts/configuration/taint-and-toleration/)
* [Pods and Priority](/docs/concepts/configuration/pod-priority-preemption/)
* [Disruptions](/docs/concepts/workloads/pods/disruptions/)
* [Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/)
* [Managing Compute Resources for Containers](/docs/concepts/configuration/manage-compute-resources-container/)
* [Configuration Best Practices](/docs/concepts/configuration/overview/)
-->
以及 Pod 如何处理调度，优先级，中断：

* [污点和容忍度](/docs/concepts/configuration/taint-and-toleration/)
* [Pod 和优先级](/docs/concepts/configuration/pod-priority-preemption/)
* [中断](/docs/concepts/workloads/pods/disruptions/)
* [分配 Pod 到工作节点](/docs/concepts/configuration/assign-pod-node/)
* [管理容器的计算资源](/docs/concepts/configuration/manage-compute-resources-container/)
* [配置最佳实践](/docs/concepts/configuration/overview/)

<!--
## Implement security best practices
-->
## 实施安全最佳实践

<!--
Securing your cluster includes work beyond the scope of Kubernetes itself.

In Kubernetes, you configure access control:

* [Controlling Access to the Kubernetes API](/docs/reference/access-authn-authz/controlling-access/)
* [Authenticating](/docs/reference/access-authn-authz/authentication/)
* [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
-->
保护集群的工作超出了 Kubernetes 本身的范围。

在Kubernetes中，你可以配置访问的控制：

* [控制对 Kubernetes API 的访问](/docs/reference/access-authn-authz/controlling-access/)
* [身份认证](/docs/reference/access-authn-authz/authentication/)
* [使用准入控制](/docs/reference/access-authn-authz/admission-controllers/)

<!--
You also configure authorization. That is, you determine not just how users and services authenticate to the API server, or whether they have access, but also what resources they have access to. Role-based access control (RBAC) is the recommended mechanism for controlling authorization to Kubernetes resources. Other authorization modes are available for more specific use cases.

* [Authorization Overview](/docs/reference/access-authn-authz/authorization/)
* [Using RBAC Authorization](/docs/reference/access-authn-authz/rbac/)

You should create Secrets to hold sensitive data such as passwords, tokens, or keys. Be aware, however, that there are limitations to the protections that a Secret can provide. See [the Risks section of the Secrets documentation](/docs/concepts/configuration/secret/#risks).
-->
您还可以配置授权。也就是说，您不仅可以决定用户和服务如何向 API 服务器进行身份认证，或者确定他们是否可以访问，还可以决定他们有权访问哪些资源。基于角色的访问控制（RBAC）是控制对 Kubernetes 资源授权的推荐机制。其他授权模式可以用于更具体的使用场景。

* [授权概述](/docs/reference/access-authn-authz/authorization/)
* [使用 RBAC 授权](/docs/reference/access-authn-authz/rbac/)

您应该创建 Secrets 来保存敏感数据，例如密码，令牌或者密钥。但请注意，Secret 可以提供的保护存在限制。请参阅 [Secrets 文档中的风险部分](/docs/concepts/configuration/secret/#risks)。

<!-- TODO: Other security content? -->

<!--
## Implement custom logging and monitoring
-->
## 实现自定义日志和监控

<!--
Monitoring the health and state of your cluster is important. Collecting metrics, logging, and providing access to that information are common needs. Kubernetes provides some basic logging structure, and you may want to use additional tools to help aggregate and analyze log data.
-->
监控集群的健康和状态非常重要。收集指标，日志，并提供对这些信息的访问是常见的需求。Kubernetes 提供了一些基本的日志记录结构，您可能需要使用其他工具来帮助汇总和分析日志数据。

<!--
Start with the [basics on Kubernetes logging](/docs/concepts/cluster-administration/logging/) to understand how containers do logging and common patterns. Cluster operators often want to add something to gather and aggregate those logs. See the following topics:

* [Logging Using Elasticsearch and Kibana](/docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/)
* [Logging Using Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/)
-->
从 [Kubernetes 日志基础知识](/docs/concepts/cluster-administration/logging/) 开始，了解容器如何执行日志记录和常见模式。集群运维人员通常希望添加一些东西来收集和聚合这些日志。请参阅以下主题：

* [使用 Elasticsearch 和 Kibana 记录日志](/docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/)
* [使用 Stackdriver 记录日志](/docs/tasks/debug-application-cluster/logging-stackdriver/)

<!--
Like log aggregation, many clusters utilize additional software to help capture metrics and display them. There is an overview of tools at [Tools for Monitoring Compute, Storage, and Network Resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/).
Kubernetes also supports a [resource metrics pipeline](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/) which can be used by Horizontal Pod Autoscaler with custom metrics.
-->
与日志聚合一样，许多集群使用其他软件来帮助捕获 metrics 并显示它们。这里是相关工具的概述：[用于监视计算，存储和网络资源的工具](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)。Kubernetes 还支持[资源指标管道](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)，还可以在水平 Pod 自动伸缩器（Horizontal Pod Autoscaler）中使用自定义 metrics。

<!--
[Prometheus](https://prometheus.io/), another {{< glossary_tooltip text="CNCF" term_id="cncf" >}} project, is a common choice to support capture and temporary collection of metrics. There are several options for installing Prometheus, including using the [stable/prometheus](https://github.com/kubernetes/charts/tree/master/stable/prometheus) [helm](https://helm.sh/) chart, and CoreOS provides a [prometheus operator](https://github.com/coreos/prometheus-operator) and [kube-prometheus](https://github.com/coreos/prometheus-operator/tree/master/contrib/kube-prometheus), which adds on Grafana dashboards and common configurations.
-->
[Prometheus](https://prometheus.io/), 是另一个 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 项目, 它是支持捕获和临时收集指标的常用选择。安装 Prometheus 有几种方式，包括使用 [stable/prometheus](https://github.com/kubernetes/charts/tree/master/stable/prometheus) [helm](https://helm.sh/) chart, and CoreOS provides a [prometheus operator](https://github.com/coreos/prometheus-operator) and [kube-prometheus](https://github.com/coreos/prometheus-operator/tree/master/contrib/kube-prometheus), 增加了 Grafana 仪表板和常用配置。

<!--
A common configuration on [Minikube](https://github.com/kubernetes/minikube) and some Kubernetes clusters uses [Heapster](https://github.com/kubernetes/heapster)
[along with InfluxDB and Grafana](https://github.com/kubernetes/heapster/blob/master/docs/influxdb.md).
There is a [walkthrough of how to install this configuration in your cluster](https://blog.kublr.com/how-to-utilize-the-heapster-influxdb-grafana-stack-in-kubernetes-for-monitoring-pods-4a553f4d36c9).
As of Kubernetes 1.11, Heapster is deprecated, as per [sig-instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation).  See [Prometheus vs. Heapster vs. Kubernetes Metrics APIs](https://brancz.com/2018/01/05/prometheus-vs-heapster-vs-kubernetes-metrics-apis/) for more information alternatives.
-->
[Minikube](https://github.com/kubernetes/minikube) 和某些 Kubernetes 集群的通常配置是[与 InfluxDB 和 Grafana 一起](https://github.com/kubernetes/heapster/blob/master/docs/influxdb.md)使用[Heapster](https://github.com/kubernetes/heapster)。这里有一个[如何在集群中安装这个配置的参考](https://blog.kublr.com/how-to-utilize-the-heapster-influxdb-grafana-stack-in-kubernetes-for-monitoring-pods-4a553f4d36c9)。截止 Kubernetes 1.11，根据[sig-instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation)，Heapster 已经弃用。更多信息，请参阅 [Prometheus vs. Heapster vs. Kubernetes Metrics APIs](https://brancz.com/2018/01/05/prometheus-vs-heapster-vs-kubernetes-metrics-apis/) 。

<!--
Hosted monitoring, APM, or data analytics services such as [Datadog](https://docs.datadoghq.com/integrations/kubernetes/) or [Instana](https://www.instana.com/supported-integrations/kubernetes-monitoring/) also offer Kubernetes integration.
-->
托管监控，APM 或数据分析服务，例如[Datadog](https://docs.datadoghq.com/integrations/kubernetes/) 或者 [Instana](https://www.instana.com/supported-integrations/kubernetes-monitoring/) 也提供 Kubernetes 集成。

<!--
## Additional resources
-->
## 其他资源

<!--
Cluster Administration:

* [Troubleshoot Clusters](/docs/tasks/debug-application-cluster/debug-cluster/)
* [Debug Pods and Replication Controllers](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/)
* [Debug Init Containers](/docs/tasks/debug-application-cluster/debug-init-containers/)
* [Debug Stateful Sets](/docs/tasks/debug-application-cluster/debug-stateful-set/)
* [Debug Applications](/docs/tasks/debug-application-cluster/debug-application/)
* [Using explorer to investigate your cluster](https://github.com/kubernetes/examples/blob/master/staging/explorer/README.md)
-->
集群管理：

* [集群故障排除](/docs/tasks/debug-application-cluster/debug-cluster/)
* [调试 Pod 和 Replication Controller](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/)
* [调试初始化容器](/docs/tasks/debug-application-cluster/debug-init-containers/)
* [调试 Stateful Set](/docs/tasks/debug-application-cluster/debug-stateful-set/)
* [调试应用程序](/docs/tasks/debug-application-cluster/debug-application/)
* [使用资源管理器来调查您的集群](https://github.com/kubernetes/examples/blob/master/staging/explorer/README.md)

{{% /capture %}}
