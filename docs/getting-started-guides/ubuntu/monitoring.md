<!--
---
title: Monitoring
---
-->
---
title: 监控
---
<!--
{% capture overview %}
This page shows how to connect various logging solutions to a Juju deployed cluster.
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}
-->
{% capture overview %}
本文介绍了怎样将各种日志分析解决方案对接集成到已经用Juju部署好的Kubernetes集群.
{% endcapture %}
{% capture prerequisites %}
本文前提假设你已经通过Juju部署好了一个Kubernetes集群.

<!--
{% endcapture %}
{% capture steps %}
## Connecting Datadog

Datadog is a SaaS offering which includes support for a range of integrations, including Kubernetes and ETCD. While the solution is SAAS/Commercial, they include a Free tier which is supported with the following method. To deploy a full Kubernetes stack with Datadog out of the box, do: `juju deploy canonical-kubernetes-datadog`
-->
{% endcapture %}
{% capture steps %}
## 对接 Datadog

Datadog是一个可集成多种应用包括Kubernetes和ETCD的监控应用服务，其提供商业版本的同时也支持用如下方式免费试用，在box之外创建一个部署一个完整的Kubernetes stack：`juju deploy canonical-kubernetes-datadog`

<!--
### Installation of Datadog

To start, deploy the latest version Datadog from the Charm Store:
-->
### 安装 Datadog

首先, 从Juju的应用商店下载部署最新版本的Datadog:

```
juju deploy datadog
```

<!--
Configure Datadog with your api-key, found in the [Datadog dashboard](). Replace `XXXX` with your API key.
-->
用api-key配置Datadog, 在 [Datadog 主页](). 将 `XXXX` 替换成 API key.

```
juju configure datadog api-key=XXXX
```

<!--
Finally, attach `datadog` to all applications you wish to monitor. For example, kubernetes-master, kubernetes-worker, and etcd:
-->
最后, 将 `datadog` 绑定到需要监控的所有应用上. 例如, kubernetes-master, kubernetes-worker, and etcd:

```
juju add-relation datadog kubernetes-worker
juju add-relation datadog kubernetes-master
juju add-relation datadog etcd
```

<!--
## Connecting Elastic stack

The Elastic stack, formally "ELK" stack, refers to Elastic Search and the suite of tools to facilitate log aggregation, monitoring, and dashboarding. To deploy a full Kubernetes stack with elastic out of the box, do: `juju deploy canonical-kubernetes-elastic`

### New install of ElasticSearch

To start, deploy the latest version of ElasticSearch, Kibana, Filebeat, and Topbeat from the Charm Store:

This can be done in one command as:
-->
## 对接 Elastic stack

Elastic stack,正规的说是 "ELK" stack, 是指 Elastic Search 和日志收集，监控，界面展示的一套工具. 在box之外部署完整的Kubernetes stack: `juju deploy canonical-kubernetes-elastic`

### 初始化安装 ElasticSearch

首先, 从Juju的应用商店下载部署最新版本的ElasticSearch, Kibana, Filebeat, and Topbeat:

如下一行命令即可完成:

```
juju deploy beats-core
```

<!--
However, if you wish to customize the deployment, or proceed manually, the following commands can be issued:
-->
如果你要定制化部署或手工安装，如下命令可解决：

```
juju deploy elasticsearch
juju deploy kibana
juju deploy filebeat
juju deploy topbeat

juju add-relation elasticsearch kibana
juju add-relation elasticsearch topbeat
juju add-relation elasticsearch filebeat
```

<!--
Finally, connect filebeat and topbeat to all applications you wish to monitor. For example, kubernetes-master and kubernetes-worker:
-->
最后, 将 `datadog` 绑定到需要监控的所有应用上. 例如, kubernetes-master and kubernetes-worker:

```
juju add-relation kubernetes-master topbeat
juju add-relation kubernetes-master filebeat
juju add-relation kubernetes-worker topbeat
juju add-relation kubernetes-worker filebeat
```

<!--
### Existing ElasticSearch cluster

In the event an ElasticSearch cluster already exists, the following can be used to connect and leverage it instead of creating a new, separate, cluster. First deploy the two beats, filebeat and topbeat
-->
### 扩展原有ElasticSearch集群

如果ElasticSearch集群在项目中已经原有存在, 如下方式可实现集成监控的filebeat，topbeat等其他组件，而不是创建另外一个的新的集群. 首先部署两个组件, filebeat and topbeat：

```
juju deploy filebeat
juju deploy topbeat
```

<!--
Configure both filebeat and topbeat to connect to your ElasticSearch cluster, replacing `255.255.255.255` with the IP address in your setup.
-->
按照如下方式可配置filebeat和topbeat对接ElasticSearch集群，根据实际情况可将`255.255.255.255`替换成自己配置的IP。
```
juju configure filebeat elasticsearch=255.255.255.255
juju configure topbeat elasticsearch=255.255.255.255
```

<!--
Follow the above instructions on connect topbeat and filebeat to the applications you wish to monitor.
-->
再按照之前的步骤实现将topbeat和filebeat对接到需要监控的应用上。

<!--
## Connecting Nagios

Nagios utilizes the Nagions Remote Execution Protocol (NRPE) as an agent on each node to derive machine level details of the health and applications.

### New install of Nagios

To start, deploy the latest version of the Nagios and NRPE charms from the store:
-->
## 对接 Nagios

Nagios 将 Nagions 远程执行协议(NRPE)优化处理成在各个节点的agent，实现采集节点的健康检查和应用检查的详细结果。

<!--
### New install of Nagios

To start, deploy the latest version of the Nagios and NRPE charms from the store:
-->
### 初始化安装Nagios

首先, 从Juju应用下载部署最新版本的Nagois和NRPE:

```
juju deploy nagios
juju deploy nrpe
```

<!--
Connect Nagios to NRPE
-->
将Nagois和NRPE对接

```
juju add-relation nagios nrpe
```

<!--
Finally, add NRPE to all applications deployed that you wish to monitor, for example `kubernetes-master`, `kubernetes-worker`, `etcd`, `easyrsa`, and `kubeapi-load-balancer`.
-->
最后，将NRPE添加到所有需要部署的应用，例如`kubernetes-master`, `kubernetes-worker`, `etcd`, `easyrsa`, and `kubeapi-load-balancer`。

```
juju add-relation nrpe kubernetes-master
juju add-relation nrpe kubernetes-worker
juju add-relation nrpe etcd
juju add-relation nrpe easyrsa
juju add-relation nrpe kubeapi-load-balancer
```

<!--
### Existing install of Nagios

If you already have an existing Nagios installation, the `nrpe-external-master` charm can be used instead. This will allow you to supply configuration options that map your existing external Nagios installation to NRPE. Replace `255.255.255.255` with the IP address of the nagios instance.
-->
### 扩展安装原有的Nagios

如果Nagios已经原有存在, 可以使用`nrpe-external-master`用做Nagios扩展. 它支持将原有的Nagios和NRPE对接.  根据实际情况可将`255.255.255.255` 替换成nagois实例IP。

```
juju deploy nrpe-external-master
juju configure nrpe-external-master nagios_master=255.255.255.255
```
<!--
Once configured, connect nrpe-external-master as outlined above.
-->
配置完后，像上面一样添加nrpe-external-master到所有需要部署的应用。
{% endcapture %}

{% include templates/task.md %}