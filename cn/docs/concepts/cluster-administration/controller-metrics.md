---
title: Controller manager metrics
---

{% capture overview %}
<!--Controller manager metrics provide important insight into the performance and health of
the controller manager.-->
控制管理器指标对深入了解Controller manager的运行健康状况具有重要意义。

{% endcapture %}

{% capture body %}
<!--## What are controller manager metrics-->
## 什么是控制管理器指标
<!--Controller manager metrics provide important insight into the performance and health of the controller manager.
These metrics include common Go language runtime metrics such as go_routine count and controller specific metrics such as
etcd request latencies or Cloudprovider (AWS, GCE, Openstack) API latencies that can be used
to gauge the health of a cluster.-->
控制管理器指标对深入了解控制管理器的运行健康状况具有重要意义。
监控指标包括：
1、常用的Go语言运行指标（例如go_routine的数量）
2、可以度量K8s集群运行健康状况的控制器特征指标（例如etcd请求延迟或云服务提供商AWS、GCE和OpenStack的API请求延迟）。

<!--Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations for GCE, AWS, Vsphere and Openstack.
These metrics can be used to monitor health of persistent volume operations.-->
从Kubernetes 1.7版本开始，具体的云服务提供商指标包含了GCE、AWS、vSphere和OpenStack的存储运行指标。
这些指标可用于监控持久化存储卷的运行健康状况。

<!--For example, for GCE these metrics are called:-->
以GCE为例，包括以下指标：

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

<!--## Configuration-->

## 配置

<!--In a cluster, controller-manager metrics are available from -->
在一个K8s集群中，使用者可从正在运行控制管理器的主机上获取控制管理器指标库。地址如下所示。
`http://localhost:10252/metrics`
<!--from the host where the controller-manager is running.-->

<!--The metrics are emitted in [prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) and are human readable.-->
指标以[Prometheus格式](https://prometheus.io/docs/instrumenting/exposition_formats/)发布并且可读。

<!--In a production environment you may want to configure prometheus or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.-->
在生产环境中，您需要配置Prometheus或某些其他的指标获取工具去收集特定时间段的指标并可从时序数据库中提取。

{% endcapture %}

{% include templates/concept.md %}
