---
assignees:
- davidopp
- lavalamp
<!-- title: Building Large Clusters -->
title: 搭建大型集群
---

<!-- ## Support -->
## 支持

<!-- At {{page.version}}, Kubernetes supports clusters with up to 1000 nodes. More specifically, we support configurations that meet *all* of the following criteria: -->
在 {{page.version}} 版本中，Kubernetes 支持集群节点（node）数可达1000个。更具体地说，我们配置能够支持*所有*如下条件：

<!-- * No more than 2000 nodes
* No more than 60000 total pods
* No more than 120000 total containers
* No more than 100 pods per node -->
* 不超过2000个节点
* 不超过总共6000个 pod
* 不超过总共12000个 container
* 单节点不超过100个 pod

<br>

* TOC
{:toc}

<!-- ## Setup -->
## 安装

<!-- A cluster is a set of nodes (physical or virtual machines) running Kubernetes agents, managed by a "master" (the cluster-level control plane). -->
集群是一组运行着 Kubernetes 代理的节点（物理或者虚机），被 "主服务器" （集群层面的控制台）所管理。

<!-- Normally the number of nodes in a cluster is controlled by the the value NUM_NODES` in the platform-specific `config-default.sh` file (for example, see [GCE's `config-default.sh`](http://releases.k8s.io/{{page.githubbranch}}/cluster/gce/config-default.sh)). -->
通常来说，集群中的节点数是通过平台特定的 `config-default.sh` 文件（例子参考 [GCE's `config-default.sh`](http://releases.k8s.io/{{page.githubbranch}}/cluster/gce/config-default.sh) ）中的 `NUM_NODES` 值控制的。

<!-- Simpl changing that value to something very large, however, may cause the setup script to fail for many cloud providers. A GCE deployment, for example, will run in to quota issues and fail to bring the cluster up. -->
然而，单单把这个值更改到很大的数值会导致安装脚本在许多云服务商平台上运行失败。例如 GCE 部署，会有配额问题导致集群启动失败。

<!-- When setting up a large Kubernetes cluster, the following issues must be considered. -->
当需要建立大规模 Kubernetes 集群时，必须考虑下列问题：

<!-- ### Quota Issues -->
### 配额问题

<!-- To avoid running into cloud provider quota issues, when creating a cluster with many nodes, consider: -->
为了避免在云服务商平台上发生配额问题，当创建一个许多节点的集群时，要考虑：

<!-- * Increase the quota for things like CPU, IPs, etc.
  * In [GCE, for example,](https://cloud.google.com/compute/docs/resource-quotas) you'll want to increase the quota for:
    * CPUs
    * VM instances
    * Total persistent disk reserved
    * In-use IP addresses
    * Firewall Rules
    * Forwarding rules
    * Routes
    * Target pools
* Gating the setup script so that it brings up new node VMs in smaller batches with waits in between, because some cloud providers rate limit the creation of VMs. -->
* 增加这些资源的配额，比如 CPU ，IP 地址等等。
  * 在 [GCE 中，举个例子](https://cloud.google.com/compute/docs/resource-quotas) 你会需要增加：
    * CPU
    * 虚拟机实例
    * 永久磁盘的预留总量
    * 在使用的 IP 地址
    * 防火墙规则
    * 转发规则
    * 路由
    * 目标池
* 调整好安装脚本，让它能够在创建虚拟机节点的批处理中有等待时间，因为很多云服务商平台对于虚拟机的创建频率有限制。

<!-- ### Etcd storage -->
### Etcd 存储

<!-- To improve performance of large clusters, we store events in a separate dedicated etcd instance. -->
为了提高大规模集群的性能，我们将 event 存储在一个独立的 etcd 实例中。

<!-- When creating a cluster, existing salt scripts: -->
当创建一个集群时，现有的 salt 脚本会：

<!-- * start and configure additional etcd instance -->
<!-- * configure api-server to use it for storing events -->
* 启动并配置额外的 etcd 实例
* 配置 api-server 用于储存 event

<!-- ### Size of master and master components -->
### 主服务器和主服务器组件的规格

<!-- On GCE/GKE and AWS, `kube-up` automatically configures the proper VM size for your master depending on the number of nodes
in your cluster. On other providers, you will need to configure it manually. For reference, the sizes we use on GCE are -->
在 GCE/GKE 和 AWS 上，`kube-up` 自动为你的主服务器配置合适的虚拟机规格，规格取决于集群中的节点数量。
对于其他云服务商平台，你需要手工配置。作为参考，我们在 GCE 上使用的规格是：

<!-- * 1-5 nodes: n1-standard-1
* 6-10 nodes: n1-standard-2
* 11-100 nodes: n1-standard-4
* 101-250 nodes: n1-standard-8
* 251-500 nodes: n1-standard-16
* more than 500 nodes: n1-standard-32 -->
* 1-5 节点: n1-standard-1
* 6-10 节点: n1-standard-2
* 11-100 节点: n1-standard-4
* 101-250 节点: n1-standard-8
* 251-500 节点: n1-standard-16
* 超过 500 节点: n1-standard-32

<!-- And the sizes we use on AWS are -->
在 AWS 上我们使用的规格：

<!-- * 1-5 nodes: m3.medium
* 6-10 nodes: m3.large
* 11-100 nodes: m3.xlarge
* 101-250 nodes: m3.2xlarge
* 251-500 nodes: c4.4xlarge
* more than 500 nodes: c4.8xlarge -->
* 1-5 节点: m3.medium
* 6-10 节点: m3.large
* 11-100 节点: m3.xlarge
* 101-250 节点: m3.2xlarge
* 251-500 节点: c4.4xlarge
* 超过 500 节点: c4.8xlarge

<!-- Note that these master node sizes are currently only set at cluster startup time, and are not adjusted if you later scale your cluster up or down (e.g. manually removing or adding nodes, or using a cluster autoscaler). -->
注意，主服务器节点规格只能在集群启动时设置，如果后续对于集群扩容或者缩容（比如，使用手工或集群自动扩展器进行增加或删除节点），规格是不会调整的。

<!-- ### Addon Resources -->
### 插件（Addon）资源

<!-- To prevent memory leaks or other resource issues in [cluster addons](https://releases.k8s.io/{{page.githubbranch}}/cluster/addons) from consuming all the resources available on a node, Kubernetes sets resource limits on addon containers to limit the CPU and Memory resources they can consume (See PR [#10653](http://pr.k8s.io/10653/files) and [#10778](http://pr.k8s.io/10778/files)). -->
为了防止 [集群插件](https://releases.k8s.io/{{page.githubbranch}}/cluster/addons) 内存泄漏或者其他资源问题导致消耗完节点的所有资源，Kubernetes 对插件容器设定了资源限制，以限制他们使用 CPU 和内存资源。（参见 PR [#10653](http://pr.k8s.io/10653/files) 和 [#10778](http://pr.k8s.io/10778/files)）

<!-- For example:

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: gcr.io/google_containers/fluentd-gcp:1.16
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
``` -->
举例:

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: gcr.io/google_containers/fluentd-gcp:1.16
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

<!-- Except for Heapster, these limits are static and are based on data we collected from addons running on 4-node clusters (see [#10335](http://issue.k8s.io/10335#issuecomment-117861225)). The addons consume a lot more resources when running on large deployment clusters (see [#5880](http://issue.k8s.io/5880#issuecomment-113984085)). So, if a large cluster is deployed without adjusting these values, the addons may continuously get killed because they keep hitting the limits. -->
除了 Heapster 之外，这些限制是固定的，并且是基于我们对于插件运行在4节点集群的采样数据（见 [#10335](http://issue.k8s.io/10335#issuecomment-117861225)）。运行在大规模集群上时，插件会消耗更多的资源（见 [#5880](http://issue.k8s.io/5880#issuecomment-113984085)）。所以，如果大规模集群没有调整这些参数时，插件容器可能会被持续杀死，因为他们总是达到限制。

<!-- To avoid running into cluster addon resource issues, when creating a cluster with many nodes, consider the following: -->
为了避免集群的插件资源问题出现，当创建一个许多节点的集群时，考虑如下问题：

<!--   * Scale memory and CPU limits for each of the following addons, if used, as you scale up the size of cluster (there is one replica of each handling the entire cluster so memory and CPU usage tends to grow proportionally with size/load on cluster):
     * [InfluxDB and Grafana](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
     * [kubedns, dnsmasq, and sidecar](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/kubedns-controller.yaml.in)
     * [Kibana](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/kibana-controller.yaml)
   * Scale number of replicas for the following addons, if used, along with the size of cluster (there are multiple replicas of each so increasing replicas should help handle increased load, but, since load per replica also increases slightly, also consider increasing CPU/memory limits):
     * [elasticsearch](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/es-controller.yaml)
   * Increase memory and CPU limits slightly for each of the following addons, if used, along with the size of cluster (there is one replica per node but CPU/memory usage increases slightly along with cluster load/size as well):
     * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
     * [FluentD with GCP Plugin](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml) -->
 * 为以下每个插件调整内存和 CPU 限制，使用时，随着你的集群扩容（每个插件有一个 replica 来处理整个集群，所以 CPU/内存 使用量会随着集群的 规模/负载 按比例增加）:
    * [InfluxDB and Grafana](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
    * [kubedns, dnsmasq, and sidecar](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/kubedns-controller.yaml.in)
    * [Kibana](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/kibana-controller.yaml)
 * 为以下这些插件调整 replicas 数量, 使用时, 随着集群规模数量一起调整（每个插件会有多个 replicas, 所以增加 replicas 应该能帮助处理增加的负载，但是，由于每个 replica 的负载也稍稍增加, 同时需要考虑增加 CPU/内存 限制）:
    * [elasticsearch](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/es-controller.yaml)
 * 为以下这些插件稍稍增加内存和 CPU 使用限制, 使用时, 随着集群规模数量一起调整（每个节点有一个 replica，但是 CPU/内存 使用量随着集群的 负载/规模 会稍稍增加）:
    * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
    * [FluentD with GCP Plugin](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

<!-- Heapster's resource limits are set dynamically based on the initial size of your cluster (see [#16185](http://issue.k8s.io/16185)
and [#22940](http://issue.k8s.io/22940)). If you find that Heapster is running
out of resources, you should adjust the formulas that compute heapster memory request (see those PRs for details). -->
Heapster 的资源限制是基于集群的初始规模动态配置的（见 [#16185](http://issue.k8s.io/16185) 和 [#22940](http://issue.k8s.io/22940)）。
如果你发现 Heapster 的资源不够，你应该调整 Heapster 对于内存的请求的计算公式（详见这些 PRs）。

<!-- For directions on how to detect if addon containers are hitting resource limits, see the [Troubleshooting section of Compute Resources](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting). -->
对于如何检查插件容器是否达到了资源使用限制，参考 [计算资源的问题排查章节](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting)。

<!-- In the [future](http://issue.k8s.io/13048), we anticipate to set all cluster addon resource limits based on cluster size, and to dynamically adjust them if you grow or shrink your cluster.
We welcome PRs that implement those features. -->
在 [未来](http://issue.k8s.io/13048)，我们预期会基于集群规模来设置所有集群插件的资源限制，并且会在你的集群扩容或缩容时进行动态调整。
我们欢迎致力于实现这些功能的 PR 。

<!-- ### Allowing minor node failure at startup -->
### 允许少数节点在启动时失败

<!-- For various reasons (see [#18969](https://github.com/kubernetes/kubernetes/issues/18969) for more details) running
`kube-up.sh` with a very large `NUM_NODES` may fail due to a very small number of nodes not coming up properly.
Currently you have two choices: restart the cluster (`kube-down.sh` and then `kube-up.sh` again), or before
running `kube-up.sh` set the environment variable `ALLOWED_NOTREADY_NODES` to whatever value you feel comfortable
with. This will allow `kube-up.sh` to succeed with fewer than `NUM_NODES` coming up. Depending on the
reason for the failure, those additional nodes may join later or the cluster may remain at a size of
`NUM_NODES - ALLOWED_NOTREADY_NODES`. -->
由于各种原因 (详细信息见 [#18969](https://github.com/kubernetes/kubernetes/issues/18969))，运行 `kube-up.sh` 建立非常大
的 `NUM_NODES` 数量的集群会由于个别的节点的启动失败而失败。目前你有两个选择：重启集群（再次运行 `kube-down.sh` 和 `kube-up.sh`），
或者，在运行 `kube-up.sh` 之前，将 `ALLOWED_NOTREADY_NODES` 环境变量设置成合适的值。这会让 `kube-up.sh` 在少于 `NUM_NODES`
节点启动的时候成功完成。根据不同的失败原因，这些额外的节点可以在稍后再加入集群，或者集群可以保持在 `NUM_NODES - ALLOWED_NOTREADY_NODES` 的规模。