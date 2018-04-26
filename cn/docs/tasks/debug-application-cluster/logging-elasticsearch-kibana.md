<!--
---
assignees:
- crassirostris
- piosz
title: Logging Using Elasticsearch and Kibana
redirect_from:
- "/docs/user-guide/logging/elasticsearch/"
- "/docs/user-guide/logging/elasticsearch.html"
---
-->

---
assignees:
- crassirostris
- piosz
title: 使用 Elasticsearch 和 Kibana 查看日志
redirect_from:
- "/docs/user-guide/logging/elasticsearch/"
- "/docs/user-guide/logging/elasticsearch.html"
---

<!--
On the Google Compute Engine (GCE) platform, the default logging support targets
[Stackdriver Logging](https://cloud.google.com/logging/), which is described in detail
in the [Logging With Stackdriver Logging](/docs/user-guide/logging/stackdriver).
-->

在 Google Compute Engine (GCE) 平台上，默认支持[Stackdriver 日志](https://cloud.google.com/logging/)，更多详细信息可以查看[使用 Stackdriver 查看日志](/docs/user-guide/logging/stackdriver)。

<!--
This article describes how to set up a cluster to ingest logs into
[Elasticsearch](https://www.elastic.co/products/elasticsearch) and view
them using [Kibana](https://www.elastic.co/products/kibana), as an alternative to
Stackdriver Logging when running on GCE. Note that Elasticsearch and Kibana
cannot be setup automatically in the Kubernetes cluster hosted on
Google Container Engine, you have to deploy it manually.
-->

本文介绍如何创建一个将日志输出到[Elasticsearch](https://www.elastic.co/products/elasticsearch)，并用[Kibana](https://www.elastic.co/products/kibana)进行展示的集群。把它作为 GCE 平台上 Stackdriver 的替代品。在 Google Container Engine 中，部署 Kubernetes 集群时并不会自动安装 Elasticsearch 和 Kibana ，需要手动安装。

<!--
To use Elasticsearch and Kibana for cluster logging, you should set the
following environment variable as shown below when creating your cluster with
kube-up.sh:

```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```
-->

为了在集群日志中使用 Elasticsearch 和 Kibana ，需要在创建集群时设置 kube-up.sh 如下的环境变量：

```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

<!--
You should also ensure that `KUBE_ENABLE_NODE_LOGGING=true` (which is the default for the GCE platform).

Now, when you create a cluster, a message will indicate that the Fluentd log
collection daemons that run on each node will target Elasticsearch:
-->

你需要设置 `KUBE_ENABLE_NODE_LOGGING=true`（在GCE平台上默认已经设置）

现在，当创建一个集群时，每个节点上运行的 Fluentd 日志收集进程会将消息发往 Elasticsearch ：

<!--
```shell
$ cluster/kube-up.sh
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
-->

```shell
$ cluster/kube-up.sh
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

每个节点的 Fluentd pod 、 Elasticsearch pod 和 Kibana pod 都应该在集群启动后，运行在 kube-system 命名空间中。

<!--
```shell
$ kubectl get pods --namespace=kube-system
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
-->

```shell
$ kubectl get pods --namespace=kube-system
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

每个节点上的 `fluentd-elasticsearch` pod 从每个节点上收集日志，并把他们发往 `elasticsearch-logging` pod （具有 `elasticsearch-logging` 的 [service](/docs/concepts/services-networking/service/) 名）。这些 Elasticsearch pod 存储日志，并通过 REST API 对外暴露接口。`kibana-logging` pod 为 Elasticsearch 中存储的日志提供访问界面，它具有 `kibana-logging` 服务名。

<!--
The Elasticsearch and Kibana services are both in the `kube-system` namespace
and are not directly exposed via a publicly reachable IP address. To reach them,
follow the instructions for [Accessing services running in a cluster](/docs/concepts/cluster-administration/access-cluster/#accessing-services-running-on-the-cluster).
-->

Elasticsearch 和 Kibana 服务都在 `kube-system` 命名空间，并且无法通过对外可达 IP 地址进行访问。如果想访问它们，可以查看[访问集群中的服务](/docs/concepts/cluster-administration/access-cluster/#accessing-services-running-on-the-cluster) 。

<!--
If you try accessing the `elasticsearch-logging` service in your browser, you'll
see a status page that looks something like this:

![Elasticsearch Status](/images/docs/es-browser.png)
-->

如果在浏览器中访问 `elasticsearch-logging` 服务，你将得到如下状态的界面：

![Elasticsearch Status](/images/docs/es-browser.png)

<!--
You can now type Elasticsearch queries directly into the browser, if you'd
like. See [Elasticsearch's documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html)
for more details on how to do so.
-->

如果你喜欢，可以在浏览器中直接输入 Elasticsearch 查询命令。可以在[Elasticsearch 文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html)查看更详细的信息。

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

或者可以使用 Kibana （[访问集群中运行的服务的操作指南](/docs/user-guide/accessing-the-cluster/#accessing-services-running-on-the-cluster)） 查看集群的日志。当第一访问 Kibana URL 时，会出现配置提取日志的视图的界面。选择时间序列选项，然后选择 `@timestamp` 。在接下来的界面中选择 `Discover` 选项卡，然后应该可以看到收集的日志。通过设置5秒刷新间隔，使得日志定期刷新。

<!--
Here is a typical view of ingested logs from the Kibana viewer:

![Kibana logs](/images/docs/kibana-logs.png)

Kibana opens up all sorts of powerful options for exploring your logs! For some
ideas on how to dig into it, check out [Kibana's documentation](https://www.elastic.co/guide/en/kibana/current/discover.html).
-->

下面是使用 Kibana 展示收集日志的界面：

![Kibana logs](/images/docs/kibana-logs.png)

Kibana 开放很多强大的选项用于扫描日志。有关如何深入的一些想法，可以查看[Kibana 文档](https://www.elastic.co/guide/en/kibana/current/discover.html)。

