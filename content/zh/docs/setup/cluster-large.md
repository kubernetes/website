---
approvers:
- davidopp
- lavalamp
title: 创建大规模集群
---

## 支持规格

在 {{< param "version" >}}，Kubernetes支持最多5000节点规模的集群。 更具体地说，我们支持满足以下 *所有* 标准的配置：

* 不超过5000节点
* 总共不超过15000个pod
* 总共不超过300000个容器
* 每个节点不超过100个pod

<br>

* TOC
{{< toc >}}

## 创建

集群是一组运行Kubernetes代理组件的节点(物理或虚拟机)，它们被 "master" (集群管理平面)所管理。

一般来说，集群的节点数量通过平台相关的 `config-default.sh` 文件中的 `NUM_NODES` 值来控制，(例如，详见 [GCE's `config-default.sh`](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh))。

对很多云提供商来说，单纯地修改`NUM_NODES` 为一个非常大的值，可能会导致集群的创建脚本失败。 例如，在GCE中部署时，会因配额不足，导致集群启动失败。

当建立一个大型的Kubernetes集群，以下几个问题必须考虑。

### 配额问题

为了避免出现配额问题，当创建包含大量节点的集群时，考虑：

* 提高相关配额，如CPU，IP等。
  * 如，在 [GCE](https://cloud.google.com/compute/docs/resource-quotas)中，你可能需要提高以下资源的配额：
    * CPU
    * 虚机实例
    * 磁盘
    * 使用的IP地址
    * 防火墙规则
    * 转发规则
    * 路由
    * 对象池
* 设置创建脚本，使其以较小的规模分批次拉起新的节点，并在其间设置一定的等待时间，因为一些云供应商可能对虚机的创建速率进行了限制。

### Etcd存储

为了提升大规模集群的性能，我们将事件对象存储到独立的etcd实例中。

创建集群时，当前的salt脚本：

* 启动并配置额外的etcd实例
* 配置api-server，将该etcd实例用于事件对象的存储

### 管理节点和组件的规格

在 GCE/Google Kubernetes Engine 或 AWS平台中， `kube-up` 会根据集群的节点规模合理地设置管理节点的规格。 在其他云平台上，用户需要手动配置。 作为参考，GCE使用的规格为：

* 1-5 节点： n1-standard-1
* 6-10 节点： n1-standard-2
* 11-100 节点： n1-standard-4
* 101-250 节点： n1-standard-8
* 251-500 节点： n1-standard-16
* 500节点以上： n1-standard-32

AWS使用的规格为：

* 1-5 节点： m3.medium
* 6-10 节点： m3.large
* 11-100 节点： m3.xlarge
* 101-250 节点： m3.2xlarge
* 251-500 节点： c4.4xlarge
* 500节点以上： c4.8xlarge

注意，管理节点的规格只会在集群创建时进行设置，后续集群规模发生变化 (如 手动增删节点或集群自动扩缩容)后不会再调整。

### 插件的资源占用

为防止 [集群插件](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons) 耗尽节点资源引起内存泄漏或其他资源问题， Kubernetes 设置了插件容器资源的上限，来限制其对CPU和内存资源的占用 (参考 PR [#10653](http://pr.k8s.io/10653/files) 和 [#10778](http://pr.k8s.io/10778/files))。

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

除 Heapster 外，这些限制是静态的，基于4个节点规模的集群上运行的插件所采集的数据 (详见 [#10335](http://issue.k8s.io/10335#issuecomment-117861225))。 而实际大规模集群中插件所消耗的资源要多得多 (详见 [#5880](http://issue.k8s.io/5880#issuecomment-113984085))。 所以如果部署大规模集群时不对这些值进行调整，插件可能会因为资源占用达到上限而不断被杀死。

为了避免集群插件的资源问题，创建多节点的集群时，考虑以下几点：

* 当扩大集群规模时，如果涉及，相应扩大以下插件的内存和CPU限制 (通过一个实例处理整个集群，因此其内存和CPU使用量往往与集群的大小/负载成比例增长)：
  * [InfluxDB 和 Grafana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns, dnsmasq, 和 sidecar](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kubedns-controller.yaml.in)
  * [Kibana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-controller.yaml)
* 当扩大集群规模时，如果涉及，相应扩大以下插件副本数 (每个组件有多个副本，因此增加副本将有助于处理增加的负载，但是，由于每个副本的负载也略有增加，也应考虑提高CPU /内存上限)：
  * [elasticsearch](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-controller.yaml)
* 当扩大集群规模时，如果涉及，略微扩大以下插件的内存和CPU限制 (每个节点一个副本， 但是CPU/内存使用随集群的大小/负载增长变化不明显)：
  * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [FluentD with GCP Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

Heapster的资源限制是基于集群的初始规模动态设置的 (参考 [#16185](http://issue.k8s.io/16185)
和 [#22940](http://issue.k8s.io/22940))。 当发现Heapster资源耗尽，应考虑调整计算Heapster内存请求的公式 (参考上述PR)。

关于如何检测插件是否达到资源上限 参考 [计算资源的故障排除章节](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting)。

[将来](http://issue.k8s.io/13048)，我们期望基于集群规模来设置集群插件的资源限制，并且在集群规模增长或缩小时能够动态调整。
欢迎提出PR来实现这些特性。

### 启动时允许部分失败

因为种种原因 (详见 [#18969](https://github.com/kubernetes/kubernetes/issues/18969))，在 `NUM_NODES` 值很大的情况下执行
`kube-up.sh`， 可能因为其中一小部分节点没有正常启动而失败。
这时我们有两种选择：重启集群 (`kube-down.sh` 然后再 `kube-up.sh`），或者在执行 `kube-up.sh`之前，
将环境变量 `ALLOWED_NOTREADY_NODES` 设置为合适的值。 这将允许 `kube-up.sh` 以少于 `NUM_NODES` 的节点数量启动集群。 依据失败的具体原因，另外的节点可能在后面加入集群，或者集群节点数量将保持在 `NUM_NODES - ALLOWED_NOTREADY_NODES`。
