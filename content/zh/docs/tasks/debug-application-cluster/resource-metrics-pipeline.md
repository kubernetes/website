---
reviewers:
- fgrzadkowski
- piosz
title: 资源指标管道
content_template: templates/concept
---
<!--
---
reviewers:
- fgrzadkowski
- piosz
title: Resource metrics pipeline
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
从 Kubernetes 1.8开始，资源使用指标，例如容器 CPU 和内存使用率，可通过 Metrics API 在 Kubernetes 中获得。这些指标可以直接被用户访问，比如使用`kubectl top`命令行，或者这些指标由集群中的控制器使用，例如，Horizontal Pod Autoscaler，使用这些指标来做决策。

{{% /capture %}}


{{% capture body %}}

<!--
## The Metrics API
-->
## Metrics API

<!--
Through the Metrics API you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible for example to get the amount of resources used by a
given node 10 minutes ago.
-->
通过 Metrics API，您可以获得指定节点或 pod 当前使用的资源量。此 API 不存储指标值，因此想要获取某个指定节点10分钟前的资源使用量是不可能的。

<!--
The API is no different from any other API:
-->
此 API 与其他 API 没有区别：

<!--
- it is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path
- it offers the same security, scalability and reliability guarantees
-->
- 此 API 和其它 Kubernetes API 一起位于同一端点（endpoint）之下，是可发现的，路径为`/apis/metrics.k8s.io/` 
- 它提供相同的安全性、可扩展性和可靠性保证

<!--
The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.
-->
Metrics API 在[k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
仓库中定义。您可以在那里找到有关 Metrics API 的更多信息。

<!--
The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.
-->
{{< note >}}
Metrics API 需要在集群中部署 Metrics Server。否则它将不可用。
{{< /note >}}

<!--
## Metrics Server
-->
## Metrics Server

<!--
[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
Starting from Kubernetes 1.8 it's deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).
It's supported in Kubernetes 1.7+ (see details below).
-->
[Metrics Server](https://github.com/kubernetes-incubator/metrics-server)是集群范围资源使用数据的聚合器。
从 Kubernetes 1.8开始，它作为 Deployment 对象，被默认部署在由`kube-up.sh`脚本创建的集群中。
如果您使用不同的 Kubernetes 安装方法，则可以使用提供的[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy)来部署。它在 Kubernetes 1.7+中得到支持（详见下文）。

<!--
Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.
-->
Metric server 从每个节点上的 [Kubelet](/docs/admin/kubelet/) 公开的 Summary API 中采集指标信息。

<!--
Metrics Server registered in the main API server through
[Kubernetes aggregator](/docs/concepts/api-extension/apiserver-aggregation/),
which was introduced in Kubernetes 1.7.
-->
通过在主 API server 中注册的 Metrics Server [Kubernetes 聚合器](/docs/concepts/api-extension/apiserver-aggregation/) 来采集指标信息， 这是在 Kubernetes 1.7 中引入的。

<!--
Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
-->
在[设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md)中可以了解到有关 Metrics Server 的更多信息。

{{% /capture %}}
