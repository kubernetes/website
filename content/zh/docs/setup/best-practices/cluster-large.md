---
title: 创建大型集群
weight: 20
---

<!--
## Support
-->
## 支持

<!--
At {{< param "version" >}}, Kubernetes supports clusters with up to 5000 nodes. More specifically, we support configurations that meet *all* of the following criteria:
-->
在 {{< param "version" >}} 版本中， Kubernetes 支持的最大节点数为 5000。更具体地说，我们支持满足以下*所有*条件的配置：

<!--
* No more than 5000 nodes
* No more than 150000 total pods
* No more than 300000 total containers
* No more than 100 pods per node
-->

* 节点数不超过 5000
* Pod 总数不超过 150000
* 容器总数不超过 300000
* 每个节点的 pod 数量不超过 100

<!--
## Setup
-->
## 设定

<!--
A cluster is a set of nodes (physical or virtual machines) running Kubernetes agents, managed by a "master" (the cluster-level control plane).
-->
集群是一组运行着 Kubernetes 代理的节点（物理机或者虚拟机），这些节点由主控节点（集群级控制面）控制。

<!--
Normally the number of nodes in a cluster is controlled by the value `NUM_NODES` in the platform-specific `config-default.sh` file (for example, see [GCE's `config-default.sh`](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh)).
-->
通常，集群中的节点数由特定于云平台的配置文件 `config-default.sh`
（可以参考 [GCE 平台的 `config-default.sh`](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh)）
中的 `NUM_NODES` 参数控制。

<!--
Simply changing that value to something very large, however, may cause the setup script to fail for many cloud providers. A GCE deployment, for example, will run in to quota issues and fail to bring the cluster up.
-->
但是，在许多云供应商的平台上，仅将该值更改为非常大的值，可能会导致安装脚本运行失败。例如，在 GCE，由于配额问题，集群会启动失败。

<!--
When setting up a large Kubernetes cluster, the following issues must be considered.
-->
因此，在创建大型 Kubernetes 集群时，必须考虑以下问题。

<!--
### Quota Issues
-->
### 配额问题

<!--
To avoid running into cloud provider quota issues, when creating a cluster with many nodes, consider:
-->
为了避免遇到云供应商配额问题，在创建具有大规模节点的集群时，请考虑：

<!--
* Increase the quota for things like CPU, IPs, etc.
  * In [GCE, for example,](https://cloud.google.com/compute/docs/resource-quotas) you'll want to increase the quota for:
    * CPUs
    * VM instances
    * Total persistent disk reserved
    * In-use IP addresses
    * Firewall Rules
    * Forwarding rules
    * Routes
    * Target pools
* Gating the setup script so that it brings up new node VMs in smaller batches with waits in between, because some cloud providers rate limit the creation of VMs.
-->
* 增加诸如 CPU，IP 等资源的配额。
  * 例如，在 [GCE](https://cloud.google.com/compute/docs/resource-quotas)，您需要增加以下资源的配额：
    * CPUs
    * VM 实例
    * 永久磁盘总量
    * 使用中的 IP 地址
    * 防火墙规则
    * 转发规则
    * 路由
    * 目标池
* 由于某些云供应商会对虚拟机的创建进行流控，因此需要对设置脚本进行更改，使其以较小的批次启动新的节点，并且之间有等待时间。

<!--
### Etcd storage
-->
### Etcd 存储

<!--
To improve performance of large clusters, we store events in a separate dedicated etcd instance.
-->
为了提高大规模集群的性能，我们将事件存储在专用的 etcd 实例中。

<!--
When creating a cluster, existing salt scripts:

* start and configure additional etcd instance
* configure api-server to use it for storing events
-->
在创建集群时，现有 salt 脚本可以：

* 启动并配置其它 etcd 实例
* 配置 API 服务器以使用 etcd 存储事件

<!--
### Size of master and master components
-->
### 主控节点大小和主控组件

<!--
On GCE/Google Kubernetes Engine, and AWS, `kube-up` automatically configures the proper VM size for your master depending on the number of nodes
in your cluster. On other providers, you will need to configure it manually. For reference, the sizes we use on GCE are
-->
在 GCE/Google Kubernetes Engine 和 AWS 上，`kube-up` 会根据节点数量自动为您集群中的 master 节点配置适当的虚拟机大小。在其它云供应商的平台上，您将需要手动配置它。作为参考，我们在 GCE 上使用的规格为：

<!--
* 1-5 nodes: n1-standard-1
* 6-10 nodes: n1-standard-2
* 11-100 nodes: n1-standard-4
* 101-250 nodes: n1-standard-8
* 251-500 nodes: n1-standard-16
* more than 500 nodes: n1-standard-32
-->
* 1-5 个节点：n1-standard-1
* 6-10 个节点：n1-standard-2
* 11-100 个节点：n1-standard-4
* 101-250 个节点：n1-standard-8
* 251-500 个节点：n1-standard-16
* 超过 500 节点：n1-standard-32

<!--
And the sizes we use on AWS are

* 1-5 nodes: m3.medium
* 6-10 nodes: m3.large
* 11-100 nodes: m3.xlarge
* 101-250 nodes: m3.2xlarge
* 251-500 nodes: c4.4xlarge
* more than 500 nodes: c4.8xlarge
-->
在 AWS 上使用的规格为

* 1-5 个节点：m3.medium
* 6-10 个节点：m3.large
* 11-100 个节点：m3.xlarge
* 101-250 个节点：m3.2xlarge
* 251-500 个节点：c4.4xlarge
* 超过 500 节点：c4.8xlarge

{{< note >}}
<!--
On Google Kubernetes Engine, the size of the master node adjusts automatically based on the size of your cluster. For more information, see [this blog post](https://cloudplatform.googleblog.com/2017/11/Cutting-Cluster-Management-Fees-on-Google-Kubernetes-Engine.html).
-->
在 Google Kubernetes Engine 上，主控节点的大小会根据集群的大小自动调整。更多有关信息，请参阅 [此博客文章](https://cloudplatform.googleblog.com/2017/11/Cutting-Cluster-Management-Fees-on-Google-Kubernetes-Engine.html)。

<!--
On AWS, master node sizes are currently set at cluster startup time and do not change, even if you later scale your cluster up or down by manually removing or adding nodes or using a cluster autoscaler.
-->
在 AWS 上，主控节点的规格是在集群启动时设置的，并且，即使以后通过手动删除或添加节点的方式使集群缩容或扩容，主控节点的大小也不会更改。
{{< /note >}}

<!--
### Addon Resources
-->
### 插件资源   {#addon-resources}

<!--
To prevent memory leaks or other resource issues in [cluster addons](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons) from consuming all the resources available on a node, Kubernetes sets resource limits on addon containers to limit the CPU and Memory resources they can consume (See PR [#10653](http://pr.k8s.io/10653/files) and [#10778](http://pr.k8s.io/10778/files)).
-->
为了防止内存泄漏或 [集群插件](https://releases.k8s.io/{{<param "githubbranch" >}}/cluster/addons)
中的其它资源问题导致节点上所有可用资源被消耗，Kubernetes 限制了插件容器可以消耗的 CPU 和内存资源
（请参阅 PR [#10653](http://pr.k8s.io/10653/files) 和 [#10778](http://pr.k8s.io/10778/files)）。

例如：

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: k8s.gcr.io/fluentd-gcp:1.16
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

<!--
Except for Heapster, these limits are static and are based on data we collected from addons running on 4-node clusters (see [#10335](http://issue.k8s.io/10335#issuecomment-117861225)). The addons consume a lot more resources when running on large deployment clusters (see [#5880](http://issue.k8s.io/5880#issuecomment-113984085)). So, if a large cluster is deployed without adjusting these values, the addons may continuously get killed because they keep hitting the limits.
-->
除了 Heapster 之外，这些限制都是静态的，并且限制是基于 4 节点集群上运行的插件数据得出的（请参阅 [#10335](http://issue.k8s.io/10335#issuecomment-117861225)）。在大规模集群上运行时，插件会消耗大量资源（请参阅 [#5880](http://issue.k8s.io/5880#issuecomment-113984085)）。因此，如果在不调整这些值的情况下部署了大规模集群，插件容器可能会由于达到限制而不断被杀死。

<!--
To avoid running into cluster addon resource issues, when creating a cluster with many nodes, consider the following:
-->
为避免遇到集群插件资源问题，在创建大规模集群时，请考虑以下事项：

<!--
* Scale memory and CPU limits for each of the following addons, if used, as you scale up the size of cluster (there is one replica of each handling the entire cluster so memory and CPU usage tends to grow proportionally with size/load on cluster):
  * [InfluxDB and Grafana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns, dnsmasq, and sidecar](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/kube-dns.yaml.in)
  * [Kibana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml)
* Scale number of replicas for the following addons, if used, along with the size of cluster (there are multiple replicas of each so increasing replicas should help handle increased load, but, since load per replica also increases slightly, also consider increasing CPU/memory limits):
  * [elasticsearch](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml)
* Increase memory and CPU limits slightly for each of the following addons, if used, along with the size of cluster (there is one replica per node but CPU/memory usage increases slightly along with cluster load/size as well):
  * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [FluentD with GCP Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)
-->
* 根据集群的规模，如果使用了以下插件，提高其内存和 CPU 上限（每个插件都有一个副本处理整个群集，因此内存和 CPU 使用率往往与集群的规模/负载成比例增长） ：
  * [InfluxDB 和 Grafana](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns、dnsmasq 和 sidecar](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/kube-dns.yaml.in)
  * [Kibana](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml)
* 根据集群的规模，如果使用了以下插件，调整其副本数量（每个插件都有多个副本，增加副本数量有助于处理增加的负载，但是，由于每个副本的负载也略有增加，因此也请考虑增加 CPU/内存限制）：
  * [elasticsearch](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml)
* 根据集群的规模，如果使用了以下插件，限制其内存和 CPU 上限（这些插件在每个节点上都有一个副本，但是 CPU/内存使用量也会随集群负载/规模而略有增加）：
  * [FluentD 和 ElasticSearch 插件](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [FluentD 和 GCP 插件](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

<!--
Heapster's resource limits are set dynamically based on the initial size of your cluster (see [#16185](http://issue.k8s.io/16185)
and [#22940](http://issue.k8s.io/22940)). If you find that Heapster is running
out of resources, you should adjust the formulas that compute heapster memory request (see those PRs for details).
-->
Heapster 的资源限制与您集群的初始大小有关（请参阅 [#16185](https://issue.k8s.io/16185)
和 [#22940](http://issue.k8s.io/22940)）。如果您发现 Heapster 资源不足，您应该调整堆内存请求的计算公式（有关详细信息，请参阅相关 PR）。

<!--
For directions on how to detect if addon containers are hitting resource limits, see the [Troubleshooting section of Compute Resources](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting).
-->
关于如何检测插件容器是否达到资源限制，参见
[计算资源的故障排除](/zh/docs/concepts/configuration/manage-resources-containers/#troubleshooting) 部分。

<!--
In the [future](http://issue.k8s.io/13048), we anticipate to set all cluster addon resource limits based on cluster size, and to dynamically adjust them if you grow or shrink your cluster.
We welcome PRs that implement those features.
-->
[未来](https://issue.k8s.io/13048)，我们期望根据集群规模大小来设置所有群集附加资源限制，并在集群扩缩容时动态调整它们。
我们欢迎您来实现这些功能。

<!--
### Allowing minor node failure at startup
-->
### 允许启动时次要节点失败

<!--
For various reasons (see [#18969](https://github.com/kubernetes/kubernetes/issues/18969) for more details) running
`kube-up.sh` with a very large `NUM_NODES` may fail due to a very small number of nodes not coming up properly.
Currently you have two choices: restart the cluster (`kube-down.sh` and then `kube-up.sh` again), or before
running `kube-up.sh` set the environment variable `ALLOWED_NOTREADY_NODES` to whatever value you feel comfortable
with. This will allow `kube-up.sh` to succeed with fewer than `NUM_NODES` coming up. Depending on the
reason for the failure, those additional nodes may join later or the cluster may remain at a size of
`NUM_NODES - ALLOWED_NOTREADY_NODES`.
-->
出于各种原因（更多详细信息，请参见 [#18969](https://github.com/kubernetes/kubernetes/issues/18969)），
在 `kube-up.sh` 中设置很大的 `NUM_NODES` 时，可能会由于少数节点无法正常启动而失败。
此时，您有两个选择：重新启动集群（运行 `kube-down.sh`，然后再运行 `kube-up.sh`），或者在运行 `kube-up.sh` 之前将环境变量 `ALLOWED_NOTREADY_NODES` 设置为您认为合适的任何值。采取后者时，即使运行成功的节点数量少于 `NUM_NODES`，`kube-up.sh` 仍可以运行成功。根据失败的原因，这些节点可能会稍后加入集群，又或者群集的大小保持在 `NUM_NODES-ALLOWED_NOTREADY_NODES`。
