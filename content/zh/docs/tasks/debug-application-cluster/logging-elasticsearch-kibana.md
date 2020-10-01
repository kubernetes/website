---
content_type: concept
title: 使用 ElasticSearch 和 Kibana 进行日志管理
---

<!--
reviewers:
- piosz
- x13n
content_type: concept
title: Logging Using Elasticsearch and Kibana
-->

<!-- overview -->

<!--
On the Google Compute Engine (GCE) platform, the default logging support targets
[Stackdriver Logging](https://cloud.google.com/logging/), which is described in detail
in the [Logging With Stackdriver Logging](/docs/user-guide/logging/stackdriver).
-->
在 Google Compute Engine (GCE) 平台上，默认的日志管理支持目标是
[Stackdriver Logging](https://cloud.google.com/logging/)，
在[使用 Stackdriver Logging 管理日志](/docs/tasks/debug-application-cluster/logging-stackdriver/)
中详细描述了这一点。

<!--
This article describes how to set up a cluster to ingest logs into
[Elasticsearch](https://www.elastic.co/products/elasticsearch) and view
them using [Kibana](https://www.elastic.co/products/kibana), as an alternative to
Stackdriver Logging when running on GCE.
-->
本文介绍了如何设置一个集群，将日志导入
[Elasticsearch](https://www.elastic.co/products/elasticsearch)，并使用
[Kibana](https://www.elastic.co/products/kibana) 查看日志，作为在 GCE 上
运行应用时使用 Stackdriver Logging 管理日志的替代方案。

<!--
You cannot automatically deploy Elasticsearch and Kibana in the Kubernetes cluster hosted on Google Kubernetes Engine. You have to deploy them manually.
-->
{{< note >}}
你不能在 Google Kubernetes Engine 平台运行的 Kubernetes 集群上自动部署
Elasticsearch 和 Kibana。你必须手动部署它们。
{{< /note >}}

<!-- body -->

<!--
To use Elasticsearch and Kibana for cluster logging, you should set the
following environment variable as shown below when creating your cluster with
kube-up.sh:
-->
要使用 Elasticsearch 和 Kibana 处理集群日志，你应该在使用 kube-up.sh 脚本创建集群时设置下面所示的环境变量：

```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

<!--
You should also ensure that `KUBE_ENABLE_NODE_LOGGING=true` (which is the default for the GCE platform).
-->
你还应该确保设置了 `KUBE_ENABLE_NODE_LOGGING=true` （这是 GCE 平台的默认设置）。

<!--
Now, when you create a cluster, a message will indicate that the Fluentd log
collection daemons that run on each node will target Elasticsearch:
-->
现在，当你创建集群时，将有一条消息将指示每个节点上运行的 fluentd 日志收集守护进程
以 ElasticSearch 为日志输出目标：

```shell
cluster/kube-up.sh
```

```
...
Project: kubernetes-satnam
Zone: us-central1-b
... calling kube-up
Project: kubernetes-satnam
Zone: us-central1-b
+++ Staging server tars to Google Storage: gs://kubernetes-staging-e6d0e81793/devel
+++ kubernetes-server-linux-amd64.tar.gz uploaded (sha1 = 6987c098277871b6d69623141276924ab687f89d)
+++ kubernetes-salt.tar.gz uploaded (sha1 = bdfc83ed6b60fa9e3bff9004b542cfc643464cd0)
Looking for already existing resources
Starting master and configuring firewalls
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/zones/us-central1-b/disks/kubernetes-master-pd].
NAME                 ZONE          SIZE_GB TYPE   STATUS
kubernetes-master-pd us-central1-b 20      pd-ssd READY
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/regions/us-central1/addresses/kubernetes-master-ip].
+++ Logging using Fluentd to elasticsearch
```

<!--
The per-node Fluentd pods, the Elasticsearch pods, and the Kibana pods should
all be running in the kube-system namespace soon after the cluster comes to
life.
-->
每个节点的 Fluentd Pod、Elasticsearch Pod 和 Kibana Pod 都应该在集群启动后不久运行在
kube-system 命名空间中。

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS   AGE
elasticsearch-logging-v1-78nog                 1/1       Running   0          2h
elasticsearch-logging-v1-nj2nb                 1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-5oq0     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-6896     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-l1ds     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-lz9j     1/1       Running   0          2h
kibana-logging-v1-bhpo8                        1/1       Running   0          2h
kube-dns-v3-7r1l9                              3/3       Running   0          2h
monitoring-heapster-v4-yl332                   1/1       Running   1          2h
monitoring-influx-grafana-v1-o79xf             2/2       Running   0          2h
```

<!--
The `fluentd-elasticsearch` pods gather logs from each node and send them to
the `elasticsearch-logging` pods, which are part of a
[service](/docs/concepts/services-networking/service/) named `elasticsearch-logging`. These
Elasticsearch pods store the logs and expose them via a REST API.
The `kibana-logging` pod provides a web UI for reading the logs stored in
Elasticsearch, and is part of a service named `kibana-logging`.
-->
`fluentd-elasticsearch` Pod 从每个节点收集日志并将其发送到 `elasticsearch-logging` Pod，
该 Pod 是名为 `elasticsearch-logging` 的
[服务](/zh/docs/concepts/services-networking/service/)的一部分。
这些 ElasticSearch pod 存储日志，并通过 REST API 将其公开。
`kibana-logging` pod 提供了一个用于读取 ElasticSearch 中存储的日志的 Web UI，
它是名为 `kibana-logging` 的服务的一部分。

<!--
The Elasticsearch and Kibana services are both in the `kube-system` namespace
and are not directly exposed via a publicly reachable IP address. To reach them,
follow the instructions for [Accessing services running in a cluster](/docs/concepts/cluster-administration/access-cluster/#accessing-services-running-on-the-cluster).
-->

Elasticsearch 和 Kibana 服务都位于 `kube-system` 命名空间中，并且没有通过可公开访问的 IP 地址直接暴露。
要访问它们，请参照
[访问集群中运行的服务](/zh/docs/tasks/access-application-cluster/access-cluster/#accessing-services-running-on-the-cluster)
的说明进行操作。

<!--
If you try accessing the `elasticsearch-logging` service in your browser, you'll
see a status page that looks something like this:
-->
如果你想在浏览器中访问 `elasticsearch-logging` 服务，你将看到类似下面的状态页面：

![Elasticsearch Status](/images/docs/es-browser.png)

<!--
You can now type Elasticsearch queries directly into the browser, if you'd
like. See [Elasticsearch's documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html)
for more details on how to do so.
-->
现在你可以直接在浏览器中输入 Elasticsearch 查询，如果你愿意的话。
请参考 [Elasticsearch 的文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html) 以了解这样做的更多细节。

<!--
Alternatively, you can view your cluster's logs using Kibana (again using the
[instructions for accessing a service running in the cluster](/docs/user-guide/accessing-the-cluster/#accessing-services-running-on-the-cluster)).
The first time you visit the Kibana URL you will be presented with a page that
asks you to configure your view of the ingested logs. Select the option for
timeseries values and select `@timestamp`. On the following page select the
`Discover` tab and then you should be able to see the ingested logs.
You can set the refresh interval to 5 seconds to have the logs
regularly refreshed.
-->

或者，你可以使用 Kibana 查看集群的日志（再次使用
[访问集群中运行的服务的说明](/zh/docs/tasks/access-application-cluster/access-cluster/#accessing-services-running-on-the-cluster)）。
第一次访问 Kibana URL 时，将显示一个页面，要求你配置所接收日志的视图。
选择时间序列值的选项，然后选择 `@timestamp`。
在下面的页面中选择 `Discover` 选项卡，然后你应该能够看到所摄取的日志。
你可以将刷新间隔设置为 5 秒，以便定期刷新日志。

<!--
Here is a typical view of ingested logs from the Kibana viewer:
-->

以下是从 Kibana 查看器中摄取日志的典型视图：

![Kibana logs](/images/docs/kibana-logs.png)

## {{% heading "whatsnext" %}}

<!--
Kibana opens up all sorts of powerful options for exploring your logs! For some
ideas on how to dig into it, check out [Kibana's documentation](https://www.elastic.co/guide/en/kibana/current/discover.html).
-->
Kibana 为浏览你的日志提供了各种强大的选项！有关如何深入研究它的一些想法，
请查看 [Kibana 的文档](https://www.elastic.co/guide/en/kibana/current/discover.html)。
