---
title: 资源指标管道
content_type: concept
---
<!--
reviewers:
- fgrzadkowski
- piosz
title: Resource metrics pipeline
content_type: concept
-->

<!-- overview -->

<!--
Resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be either accessed directly
by user, for example by using `kubectl top` command, or used by a controller in the cluster, e.g.
Horizontal Pod Autoscaler, to make decisions.
-->
资源使用指标，例如容器 CPU 和内存使用率，可通过 Metrics API 在 Kubernetes 中获得。
这些指标可以直接被用户访问，比如使用 `kubectl top` 命令行，或者这些指标由集群中的控制器使用，
例如，Horizontal Pod Autoscaler，使用这些指标来做决策。

<!-- body -->

<!--
## The Metrics API

Through the Metrics API you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible for example to get the amount of resources used by a
given node 10 minutes ago.
-->
## Metrics API   {#the-metrics-api}

通过 Metrics API，你可以获得指定节点或 Pod 当前使用的资源量。
此 API 不存储指标值，因此想要获取某个指定节点 10 分钟前的资源使用量是不可能的。

<!--
The API is no different from any other API:
-->
此 API 与其他 API 没有区别：

<!--
- it is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path
- it offers the same security, scalability and reliability guarantees
-->
- 此 API 和其它 Kubernetes API 一起位于同一端点（endpoint）之下，是可发现的，
  路径为 `/apis/metrics.k8s.io/` 
- 它提供相同的安全性、可扩展性和可靠性保证

<!--
The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.
-->
Metrics API 在 [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
仓库中定义。你可以在那里找到有关 Metrics API 的更多信息。

<!--
The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.
-->
{{< note >}}
Metrics API 需要在集群中部署 Metrics Server。否则它将不可用。
{{< /note >}}

<!--
## Measuring Resource Usage

### CPU

CPU is reported as the average usage, in [CPU cores](/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu), over a period of time. This value is derived by taking a rate over a cumulative CPU counter provided by the kernel (in both Linux and Windows kernels). The kubelet chooses the window  for the rate calculation.
-->
## 度量资源用量   {#measuring-resource-usage}

### CPU

CPU 用量按其一段时间内的平均值统计，单位为
[CPU 核](/zh/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。
此度量值通过在内核（包括 Linux 和 Windows）提供的累积 CPU 计数器乘以一个系数得到。
`kubelet` 组件负责选择计算系数所使用的窗口大小。

### 内存  {#memory}

内存用量按工作集（Working Set）的大小字节数统计，其数值为收集度量值的那一刻的内存用量。
如果一切都很理想化，“工作集” 是任务在使用的内存总量，该内存是不可以在内存压力较大
的情况下被释放的。
不过，具体的工作集计算方式取决于宿主 OS，有很大不同，且通常都大量使用启发式
规则来给出一个估计值。
其中包含所有匿名内存使用（没有后台文件提供存储者），因为 Kubernetes 不支持交换分区。
度量值通常包含一些高速缓存（有后台文件提供存储）内存，因为宿主操作系统并不是总能
回收这些页面。

<!--
## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
Starting from Kubernetes 1.8 it's deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).
It's supported in Kubernetes 1.7+ (see details below).
-->
## Metrics 服务器    {#metrics-server}

[Metrics 服务器](https://github.com/kubernetes-incubator/metrics-server)是集群范围资源使用数据的聚合器。
在由 `kube-up.sh` 脚本创建的集群中默认会以 Deployment 的形式被部署。
如果你使用其他 Kubernetes 安装方法，则可以使用提供的
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy)
来部署。

<!--
Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.
-->
Metric server 从每个节点上的 [Kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/)
公开的 Summary API 中采集指标信息。

<!--
Metrics Server registered in the main API server through
[Kubernetes aggregator](/docs/concepts/api-extension/apiserver-aggregation/),
which was introduced in Kubernetes 1.7.
-->
Metrics 服务器通过
[Kubernetes 聚合器](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 
注册到主 API 服务器。

<!--
Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
-->
在[设计文档](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md)中可以了解到有关 Metrics 服务器的更多信息。

