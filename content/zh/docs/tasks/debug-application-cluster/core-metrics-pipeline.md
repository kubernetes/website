---
reviewers:
- fgrzadkowski
- piosz
title: 核心指标传递管道
content_template: templates/concept
---

<!--
---
reviewers:
- fgrzadkowski
- piosz
title: Core metrics pipeline
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
Starting from Kubernetes 1.8, resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be either accessed directly
by user, for example by using `kubectl top` command, or used by a controller in the cluster, e.g.
Horizontal Pod Autoscaler, to make decisions.
-->

从 Kubernetes 1.8 版本开始，用户在 Kubernetes 中可以通过度量 API 获取资源使用度量（如容器 CPU 和内存使用率）。
这些度量可以由用户直接访问，例如使用 `kubectl top` 命令，也可以由集群中的控制器（例如 Pod 水平自动扩缩器）用来做决策。

{{% /capture %}}


{{% capture body %}}

<!--
## The Metrics API
-->

## 度量 API

<!--
Through the Metrics API you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible for example to get the amount of resources used by a
given node 10 minutes ago.
-->

通过度量 API，您可以获得给定节点或给定 Pod 当前使用的资源数量。
此 API 不存储度量值，因此不可能获得 10 分钟前给定节点使用的资源数量。

<!--
The API is no different from any other API:
-->

度量 API 和其他 API 没有什么不同：

<!--
- it is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path
- it offers the same security, scalability and reliability guarantees
-->

- 它可通过与 `/apis/metrics.k8s.io/` 路径下的其他 Kubernetes API 相同的端点来发现
- 它提供相同的安全性、可扩展性和可靠性保证


<!--
The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.
-->

度量 API 是在 [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go) 仓库进行定义的。您可以在那里找到该 API 相关的更多信息。

{{< note >}}
<!--The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.-->
度量 API 要求在集群中部署度量服务器。否则它将不可用。
{{< /note >}}

<!--
## Metrics Server 
-->

## 度量服务器

<!--
[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
Starting from Kubernetes 1.8 it's deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).
It's supported in Kubernetes 1.7+ (see details below).
-->

[指标服务器](https://github.com/kubernetes-incubator/metrics-server)是集群范围内的资源使用数据的聚合器。
从 Kubernetes 1.8 版本开始，它作为部署对象默认部署在由 `kube-up.sh` 脚本创建的集群中。
如果您使用了不同的 Kubernetes 安装机制，则可以使用提供的[部署 yaml](https://github.com/kubernetes孵化器/metrics-server/tree/master/deploy)。
它在 Kubernetes 1.7 以上版本中被支持（请参见下面的详细信息）。


<!--
Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.
-->

度量服务器通过 Summary API 获取度量值，该 API 由 [Kubelet](/docs/admin/kubelet/) 在每个节点上进行暴露。

<!--
Metrics Server registered in the main API server through
[Kubernetes aggregator](/docs/concepts/api-extension/apiserver-aggregation/),
which was introduced in Kubernetes 1.7.
-->

度量服务器通过 [Kubernetes 聚合器](/docs/concepts/api-extension/apiserver-aggregation/)在主 API 服务器中注册，该聚合器是在 Kubernetes 1.7 版本中引入的。


<!--
Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
-->

进一步了解度量服务器请参考[设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md)。

{{% /capture %}}
