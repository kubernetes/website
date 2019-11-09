---
title: 控制器管理器指标
content_template: templates/concept
weight: 100
---

<!--
---
title: Controller manager metrics
content_template: templates/concept
weight: 100
---
-->

{{% capture overview %}}

<!--
Controller manager metrics provide important insight into the performance and health of
the controller manager.
-->

控制器管理器指标为控制器管理器的性能和健康提供了重要的观测手段。

{{% /capture %}}

{{% capture body %}}

<!--
## What are controller manager metrics

Controller manager metrics provide important insight into the performance and health of the controller manager.
These metrics include common Go language runtime metrics such as go_routine count and controller specific metrics such as
etcd request latencies or Cloudprovider (AWS, GCE, OpenStack) API latencies that can be used
to gauge the health of a cluster.

Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations for GCE, AWS, Vsphere and OpenStack.
These metrics can be used to monitor health of persistent volume operations.

For example, for GCE these metrics are called:
-->

## 什么是控制器管理器度量

控制器管理器指标为控制器管理器的性能和健康提供了重要的观测手段。
这些度量包括常见的 Go 语言运行时度量，比如 go_routine 计数，以及控制器特定的度量，比如 etcd 请求延迟或 云提供商（AWS、GCE、OpenStack）的 API 延迟，这些参数可以用来测量集群的健康状况。

从 Kubernetes 1.7 版本开始，详细的云提供商指标可用于 GCE、AWS、Vsphere 和 OpenStack 的存储操作。
这些度量可用于监视持久卷操作的健康状况。

例如，在 GCE 中这些指标叫做：

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```



<!--
## Configuration


In a cluster, controller-manager metrics are available from `http://localhost:10252/metrics`
from the host where the controller-manager is running.

The metrics are emitted in [prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) and are human readable.

In a production environment you may want to configure prometheus or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.
-->

## 配置

在集群中，控制器管理器指标可从它所在的主机上的 `http://localhost:10252/metrics` 中获得。

这些指标是以 [prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/) 发出的，是人类可读的。

在生产环境中，您可能想配置 prometheus 或其他一些指标收集工具，以定期收集这些指标数据，并将它们应用到某种时间序列数据库中。

{{% /capture %}}


