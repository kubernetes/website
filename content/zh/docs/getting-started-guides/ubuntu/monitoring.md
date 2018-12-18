---
title: 监控
content_template: templates/task
---

<!--
---
title: Monitoring
content_template: templates/task
---
-->

{{% capture overview %}}

<!-- This page shows how to connect various logging solutions to a Juju deployed cluster. -->

本文将介绍如何将不同的日志解决方案连到已经用 Juju 部署好的 Kubernetes 集群上。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- This page assumes you have a working Juju deployed cluster. -->
本文假设你有一个用 Juju 部署好了的 Kubernetes 集群。

{{% /capture %}}

{{% capture steps %}}

<!-- ## Connecting Datadog -->

## 连接 Datadog

<!-- Datadog is a SaaS offering which includes support for a range of integrations,
including Kubernetes and ETCD. While the solution is SAAS/Commercial,
they include a Free tier which is supported with the following method.
To deploy a full Kubernetes stack with Datadog out of the box, do: -->

Datadog 是一个 SaaS 方案，包含了对很多不同类型的应用集成的支持，例如，Kubernetes 和 etcd。
在提供商业版本的同时，也支持通过如下方式免费使用。
部署一个带有现成的 Databox 的 Kubernetes 集群：

```
juju deploy canonical-kubernetes-datadog
```

<!-- ### Installation of Datadog -->
### 安装 Datadog

<!-- To start, deploy the latest version Datadog from the Charm Store: -->
首先, 从 Juju 的 Charm Store 下载部署最新版本的 Datadog :

```
juju deploy datadog
```

<!-- Configure Datadog with your api-key, found in the [Datadog dashboard]().
Replace `XXXX` with your API key. -->

使用在 [Datadog dashboard]() 上的 api-key 来配置 Datadog。
将 `XXXX` 配置为你的 API 密钥。

```
juju configure datadog api-key=XXXX
```

<!-- Finally, attach `datadog` to all applications you wish to monitor.
For example, kubernetes-master, kubernetes-worker, and etcd: -->

最后, 将 `datadog` 绑定到需要监控的所有应用上。例如：kubernetes-master, kubernetes-worker, and etcd:

```
juju add-relation datadog kubernetes-worker
juju add-relation datadog kubernetes-master
juju add-relation datadog etcd
```

<!-- ## Connecting Elastic stack -->
## 连接 Elastic 栈

<!-- The Elastic stack, formally "ELK" stack, refers to Elastic Search and the suite of tools to
facilitate log aggregation, monitoring, and dashboarding.
To deploy a full Kubernetes stack with elastic out of the box, do: -->

Elastic 栈，正规地说是 "ELK" 栈, 指的是 ElasticSearch 和日志收集，监控，dashboard 的套件.
部署带有现成的 elastic 栈的 Kubernetes 集群命令如下：

```
juju deploy canonical-kubernetes-elastic
```

<!-- ### New install of ElasticSearch -->
### 初装 ElasticSearch

<!-- To start, deploy the latest version of ElasticSearch, Kibana, Filebeat, and Topbeat from the Charm Store: -->

首先, 从 Juju 的 Charm store 下载、部署最新版本的 ElasticSearch, Kibana, Filebeat 和 Topbeat：

<!-- This can be done in one command as: -->

命令行如下：

```
juju deploy beats-core
```

<!-- However, if you wish to customize the deployment, or proceed manually, the following commands can be issued: -->

此外，如果你要定制部署，或手工安装，可使用以下命令：

```
juju deploy elasticsearch
juju deploy kibana
juju deploy filebeat
juju deploy topbeat

juju add-relation elasticsearch kibana
juju add-relation elasticsearch topbeat
juju add-relation elasticsearch filebeat
```

<!-- Finally, connect filebeat and topbeat to all applications you wish to monitor.
For example, kubernetes-master and kubernetes-worker: -->

最后将 filebeat 和 topbeat 连接到所要监控的应用上。
例如：kubernetes-master 和 kubernetes-worker：

```
juju add-relation kubernetes-master topbeat
juju add-relation kubernetes-master filebeat
juju add-relation kubernetes-worker topbeat
juju add-relation kubernetes-worker filebeat
```

<!-- ### Existing ElasticSearch cluster -->
### 已装 ElasticSearch 集群

<!-- In the event an ElasticSearch cluster already exists,
the following can be used to connect and leverage it instead of creating a
new, separate, cluster.
First deploy the two beats, filebeat and topbeat -->

如果已有一个 ElasticSearch 集群已经存在的情况下，
你可以使用下面的方式来连接和使用它而不是重新创建一个单独的新集群。
首先部署 filebeat 和 topbeat 两个组件：

```
juju deploy filebeat
juju deploy topbeat
```

<!-- Configure both filebeat and topbeat to connect to your ElasticSearch cluster,
replacing `255.255.255.255` with the IP address in your setup. -->

按照如下方式可配置 filebeat 和 topbeat 对接 ElasticSearch 集群，
将 `255.255.255.255` 替换成自己配置的IP。

```
juju configure filebeat elasticsearch=255.255.255.255
juju configure topbeat elasticsearch=255.255.255.255
```

<!-- Follow the above instructions on connect topbeat and filebeat to the applications you wish to monitor. -->

使用上面的命令，将 topbeat 和 filebeat 连接到需要监控的应用上。


<!-- ## Connecting Nagios -->

## 连接 Nagios

<!-- Nagios utilizes the Nagios Remote Plugin Executor protocol (NRPE protocol)
as an agent on each node to derive machine level details of the health and applications. -->

Nagios 在每个节点上，使用 Nagions 远程执行插件协议 (NRPE 协议)作为代理
来收集节点里和健康、应用相关的详细信息。

<!-- ### New install of Nagios -->

### 初装 Nagios

<!-- To start, deploy the latest version of the Nagios and NRPE charms from the store: -->

首先, 从 Juju 的 Charm store 部署最新版本的 Nagois 和 NRPE:

```
juju deploy nagios
juju deploy nrpe
```

<!-- Connect Nagios to NRPE -->
将 Nagois 连接到 NRPE 上

```
juju add-relation nagios nrpe
```

<!-- Finally, add NRPE to all applications deployed that you wish to monitor,
for example `kubernetes-master`, `kubernetes-worker`, `etcd`, `easyrsa`, and `kubeapi-load-balancer`. -->

最后，将 NRPE 添加到所有需要部署的应用，
例如，`kubernetes-master`, `kubernetes-worker`, `etcd`, `easyrsa`, 和 `kubeapi-load-balancer`。

```
juju add-relation nrpe kubernetes-master
juju add-relation nrpe kubernetes-worker
juju add-relation nrpe etcd
juju add-relation nrpe easyrsa
juju add-relation nrpe kubeapi-load-balancer
```

<!-- ### Existing install of Nagios -->
### 已装 Nagios

<!-- If you already have an existing Nagios installation,
the `nrpe-external-master` charm can be used instead.
This will allow you to supply configuration options that map your existing
external Nagios installation to NRPE.
Replace `255.255.255.255` with the IP address of the nagios instance. -->

如果已经装有 Nagios，可以换用 `nrpe-external-master` charm 。
这样可以提供配置选项将现有的、外部 Nagios 安装映射到 NRPE上。
将 `255.255.255.255` 替换为 nagois 实例的 IP 地址。

```
juju deploy nrpe-external-master
juju configure nrpe-external-master nagios_master=255.255.255.255
```

<!-- Once configured, connect nrpe-external-master as outlined above. -->

配置完后，如上所示，连到 nrpe-external-master。

{{% /capture %}}
