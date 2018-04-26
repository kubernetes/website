---
approvers:
- fgrzadkowski
- piosz
cn-approvers:
- pigletfly
title: 核心指标管道
---
<!--
---
approvers:
- fgrzadkowski
- piosz
title: Core metrics pipeline
---
-->
<!--
Starting from Kubernetes 1.8, resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be either accessed directly
by user, for example by using `kubectl top` command, or used by a controller in the cluster, e.g.
Horizontal Pod Autoscaler, to make decisions.
-->
从 Kubernetes 1.8 开始，资源使用指标（如容器 CPU 和内存使用率）通过 Metrics API 在 Kubernetes 中获取。这些指标可以直接被用户访问(例如通过使用 `kubectl top` 命令)，或由集群中的控制器使用(例如，Horizontal Pod Autoscale 可以使用这些指标作出决策)。

<!--
## The Metrics API

Through the Metrics API you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible for example to get the amount of resources used by a
given node 10 minutes ago.

The API no different from any other API:

- it is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path
- it offers the same security, scalability and reliability guarantees

The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.

**Note:** The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.
-->
## Metrics API

通过 Metrics API，您可以获取指定 node 或 pod 当前使用的资源量。这个 API 不存储指标值，所以例如获取某个指定 node 10 分钟前的资源使用量是不可能的。

Metrics API 和其他的 API 没有什么不同：

- 它可以通过与 `/apis/metrics.k8s.io/` 路径下的其他 Kubernetes API 相同的端点来发现
- 它提供了相同的安全性、可扩展性和可靠性保证

Metrics API 在 [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go) 仓库中定义。您可以在这里找到关于Metrics API 的更多信息。

**注意：** Metrics API 需要在集群中部署 Metrics Server。否则它将不可用。
<!--
## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
Starting from Kubernetes 1.8 it's deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).
It's supported in Kubernetes 1.7+ (see details below).

Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.

Metrics Server registered in the main API server through
[Kubernetes aggregator](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/),
which was introduced in Kubernetes 1.7.

Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
-->
## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) 是集群范围资源使用数据的聚合器。
从 Kubernetes 1.8 开始，它作为一个 Deployment 对象默认部署在由 `kube-up.sh` 脚本创建的集群中。如果您使用了其他的 Kubernetes 安装方法，您可以使用 Kubernetes 1.7+ (请参阅下面的详细信息) 中引入的 [deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy) 文件来部署。

Metrics Server 从每个节点上的 [Kubelet](/docs/admin/kubelet/) 公开的 Summary API 中采集指标信息。

通过在主 API server 中注册的 Metrics Server
[Kubernetes 聚合器](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/) 来采集指标信息，
这是在 Kubernetes 1.7 中引入的。

在 [设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md) 中可以了解到有关 Metrics Server 的更多信息。