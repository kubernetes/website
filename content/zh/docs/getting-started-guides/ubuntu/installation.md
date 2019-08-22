---
reviewers:
- caesarxuchao
- erictune
title: 用 Juju 搭建 Kubernetes
content_template: templates/task
---

<!-- ---
reviewers:
- caesarxuchao
- erictune
title: Setting up Kubernetes with Juju
content_template: templates/task
--- -->

<!-- {{% capture overview %}}
Ubuntu 16.04 introduced the [Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes), a pure upstream distribution of Kubernetes designed for production usage. This page shows you how to deploy a cluster.
{{% /capture %}} -->

{% capture overview %}
Ubuntu 16.04 已公开 [Kubernetes 的 Canonical 发行版 ](https://www.ubuntu.com/cloud/kubernetes), 一套为生产环境设计的 Kubernetes 上游版本。本文将为您演示如何部署集群。
{% endcapture %}

<!-- {{% capture prerequisites %}}
- A working [Juju client](https://jujucharms.com/docs/2.3/reference-install); this does not have to be a Linux machine, it can also be Windows or OSX.
- A [supported cloud](#cloud-compatibility).
  - Bare Metal deployments are supported via [MAAS](http://maas.io). Refer to the [MAAS documentation](http://maas.io/docs/) for configuration instructions.
  - OpenStack deployments are currently only tested on Icehouse and newer.
- One of the following:
  - Network access to the following domains
    - *.jujucharms.com
    - gcr.io
    - github.com
    - Access to an Ubuntu mirror (public or private)
  - Offline deployment prepared with [these](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Running-CDK-in-a-restricted-environment) instructions.
{{% /capture %}} -->

{{% capture prerequisites %}}
- 一个可用的 [Juju 客户端](https://jujucharms.com/docs/2.3/reference-install)；不一定要是 Linux 机器，也可以是 Windows 或 OSX。
- 一个[受支持的云](#cloud-compatibility)。
  - 裸机部署可以通过 [MAAS](http://maas.io) 实现。 配置指南参见 [MAAS 文档](http://maas.io/docs/)。
  - OpenStack 部署目前只在 Icehouse 及更新版本上测试通过。
- 下面任一一种选项：
	- 可以网络访问以下站点
		- *.jujucharms.com
		- gcr.io
		- github.com
		- 访问 Ubuntu 镜像源（公共的或私有的）
	- 通过[这些](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Running-CDK-in-a-restricted-environment)步骤准备好离线部署。
{{% /capture %}}

<!-- {{% capture steps %}}
## Deployment overview
Out of the box the deployment comes with the following components on 9 machines:

- Kubernetes (automated deployment, operations, and scaling)
     - Four node Kubernetes cluster with one master and three worker nodes.
     - TLS used for communication between units for security.
     - Flannel Software Defined Network (SDN) plugin
     - A load balancer for HA kubernetes-master (Experimental)
     - Optional Ingress Controller (on worker)
     - Optional Dashboard addon (on master) including Heapster for cluster monitoring
- EasyRSA
     - Performs the role of a certificate authority serving self signed certificates
       to the requesting units of the cluster.
- ETCD (distributed key value store)
     - Three unit cluster for reliability. -->

{{% capture steps %}}
## 部署概述

开箱即用的部署由以下组件构成，部署在 9 台机器上：

- Kubernetes （自动化部署，运营及伸缩）
     - 具有一个主节点和三个工作节点的四节点 Kubernetes 集群。
     - 使用 TLS 实现组件间的安全通信。
     - Flannel 软件定义网络 (SDN) 插件
     - 一个负载均衡器以实现 kubernetes-master 的高可用 (实验阶段)
     - 可选的 Ingress 控制器（在工作节点上）
     - 可选的 Dashboard 插件（在主节点上），包含实现集群监控的 Heapster 插件
- EasyRSA
     - 扮演证书授权机构的角色，向集群中的组件提供自签名证书
- ETCD （分布式键值存储）
     - 三节点的集群达到高可靠性。

<!-- The Juju Kubernetes work is curated by the Big Software team at [Canonical Ltd](https://www.canonical.com/),
let us know how we are doing. If you find any problems please open an
[issue on our tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)
so we can find them. -->

Juju Kubernetes 工作由 Canonical Ltd（https://www.canonical.com/） 的 Big Software 团队整理，欢迎对我们的工作给出反馈意见。
如果发现任何问题，请提交相应的 [Issue 到跟踪系统](https://github.com/juju-solutions/bundle-canonical-kubernetes)，以便我们解决。

<!-- ## Support Level

IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Amazon Web Services (AWS)   | Juju         | Ubuntu | flannel, calico*     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
OpenStack                   | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Microsoft Azure             | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Google Compute Engine (GCE) | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Joyent                      | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Rackspace                   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
VMware vSphere              | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Bare Metal (MAAS)           | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core) -->

##  支持级别

IaaS 提供商        | 配置管理 | 系统     | 网络  | 文档                                              | 符合 | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Amazon Web Services (AWS)   | Juju         | Ubuntu | flannel, calico*     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
OpenStack                   | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Microsoft Azure             | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Google Compute Engine (GCE) | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Joyent                      | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Rackspace                   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
VMWare vSphere              | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Bare Metal (MAAS)           | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)


<!-- For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## Installation options

You can launch a cluster in one of two ways: [conjure-up](#conjure-up) or [juju deploy](#juju-deploy). Conjure-up is just a convenience wrapper over juju and simplifies the installation. As such, it is the preferred method of install.

Deployment of the cluster is [supported on a wide variety of public clouds](#cloud-compatibility), private OpenStack clouds, or raw bare metal clusters. Bare metal deployments are supported via [MAAS](http://maas.io/).

## Conjure-up
To install Kubernetes with conjure-up, you need only to run the following commands and then follow the prompts:

```
sudo snap install conjure-up --classic
conjure-up kubernetes
```
## Juju deploy

### Configure Juju to use your cloud provider

After deciding which cloud to deploy to, follow the [cloud setup page](https://jujucharms.com/docs/devel/getting-started) to configure deploying to that cloud.

Load your [cloud credentials](https://jujucharms.com/docs/2.3/credentials) for each
cloud provider you would like to use. -->

有关所有解决方案的支持级别信息，请参见[解决方案表](/docs/getting-started-guides/#table-of-solutions)。

## 安装选项

可以通过下面任一一种方式启动集群：[conjure-up](#conjure-up) or [juju 部署](#juju-deploy)。Conjure-up 只是一个对 juju 的简易封装，简化了安装的过程。正因为如此，这也是推荐的安装方法。

可以在 [众多不同的公有云](#cloud-compatibility)，私有 OpenStack 云，或者是原始的裸机集群上部署集群软件。通过 [MAAS](http://maas.io)  实现裸机部署。

## Conjure-up

通过 conjure-up 来安装 Kubernetes, 只需要运行下面的命令，然后根据提示做选择：

```
sudo snap install conjure-up --classic
conjure-up kubernetes
```

## Juju 部署

### 配置 Juju 使用您的云提供商

确定所要部署的云之后，按照[云安装界面](https://jujucharms.com/docs/devel/getting-started)来配置、部署到该云。

加载[云凭证](https://jujucharms.com/docs/2.3/credentials)来选择、使用相应的云。

<!-- In this example

```
juju add-credential aws
credential name: my_credentials
select auth-type [userpass, oauth, etc]: userpass
enter username: jorge
enter password: *******
```

You can also just auto load credentials for popular clouds with the `juju autoload-credentials` command, which will auto import your credentials from the default files and environment variables for each cloud. -->

在本例中

```
juju add-credential aws
credential name: my_credentials
select auth-type [userpass, oauth, etc]: userpass
enter username: jorge
enter password: *******
```

也可以通过 `juju autoload-credentials` 命令自动加载常用的云凭证，该命令将自动从每个云的默认文件和环境变量中导入凭据信息。

<!-- Next we need to bootstrap a controller to manage the cluster. You need to define the cloud you want to bootstrap on, the region, and then any name for your controller node:

```
juju update-clouds # This command ensures all the latest regions are up to date on your client
juju bootstrap aws/us-east-2
```
or, another example, this time on Azure:

```
juju bootstrap azure/westus2
``` -->

接下来，我们需要启动一个控制器来管理集群。您需要确定所要启动的云，地区以及控制器节点的名字：

```
juju update-clouds # 这个命令可以确保客户端上所有最新的区域是最新的
juju bootstrap aws/us-east-2
```
或者，另外一个例子，这次是在 Azure 上：

```
juju bootstrap azure/westus2
```

<!-- If you receive this error, it is likely that the default Azure VM size (Standard D1 v2 [1 vcpu, 3.5 GB memory]) is not available in the Azure location: -->

如果您看到下面的错误信息，很可能默认的 Azure VM (Standard D1 v2 [1 vcpu, 3.5 GB memory]) 并不在当前的 Azure 地区。
```
ERROR failed to bootstrap model: instance provisioning failed (Failed)
```


<!-- You will need a controller node for each cloud or region you are deploying to. See the [controller documentation](https://jujucharms.com/docs/2.3/controllers) for more information.

Note that each controller can host multiple Kubernetes clusters in a given cloud or region. -->

您需要为部署到的每个云或区域分配一个控制器节点。更多信息参见[控制器文档](https://jujucharms.com/docs/2.3/controllers)。

请注意，每个控制器可以在给定的云或区域中管理多个 Kubernetes 集群。

<!-- ### Launch a Kubernetes cluster

The following command will deploy the initial 9-node starter cluster. The speed of execution is very dependent of the performance of the cloud you're deploying to:

```
juju deploy canonical-kubernetes
```

After this command executes the cloud will then launch instances and begin the deployment process. -->

## 启动 Kubernetes 集群

以下命令将部署 9-节点的初始集群。执行速度取决于您所要部署到的云的性能：

```
juju deploy canonical-kubernetes
```

执行完此命令后，云将启动实例并开始部署过程。

<!-- ## Monitor deployment

The `juju status` command provides information about each unit in the cluster. Use the `watch -c juju status --color` command to get a real-time view of the cluster as it deploys. When all the states are green and "Idle", the cluster is ready to be used:

    juju status

Output: -->

## 监控部署

`juju status` 命令提供集群中每个单元的信息。`watch -c juju status --color` 命令可以获取集群部署的实时状态。
当所有的状态是绿色并且“空闲”时，表示集群处于待用状态：

		juju status

输出结果:

```
Model                         Controller          Cloud/Region   Version  SLA
conjure-canonical-kubern-f48  conjure-up-aws-650  aws/us-east-2  2.3.2    unsupported

App                    Version  Status  Scale  Charm                  Store       Rev  OS      Notes
easyrsa                3.0.1    active      1  easyrsa                jujucharms   27  ubuntu
etcd                   2.3.8    active      3  etcd                   jujucharms   63  ubuntu
flannel                0.9.1    active      4  flannel                jujucharms   40  ubuntu
kubeapi-load-balancer  1.10.3   active      1  kubeapi-load-balancer  jujucharms   43  ubuntu  exposed
kubernetes-master      1.9.3    active      1  kubernetes-master      jujucharms   13  ubuntu
kubernetes-worker      1.9.3    active      3  kubernetes-worker      jujucharms   81  ubuntu  exposed

Unit                      Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*                active    idle   3        18.219.190.99                   Certificate Authority connected.
etcd/0                    active    idle   5        18.219.56.23    2379/tcp        Healthy with 3 known peers
etcd/1*                   active    idle   0        18.219.212.151  2379/tcp        Healthy with 3 known peers
etcd/2                    active    idle   6        13.59.240.210   2379/tcp        Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   1        18.222.61.65    443/tcp         Loadbalancer ready.
kubernetes-master/0*      active    idle   4        18.219.105.220  6443/tcp        Kubernetes master running.
  flannel/3               active    idle            18.219.105.220                  Flannel subnet 10.1.78.1/24
kubernetes-worker/0       active    idle   2        18.219.221.98   80/tcp,443/tcp  Kubernetes worker running.
  flannel/1               active    idle            18.219.221.98                   Flannel subnet 10.1.38.1/24
kubernetes-worker/1*      active    idle   7        18.219.249.103  80/tcp,443/tcp  Kubernetes worker running.
  flannel/2               active    idle            18.219.249.103                  Flannel subnet 10.1.68.1/24
kubernetes-worker/2       active    idle   8        52.15.89.16     80/tcp,443/tcp  Kubernetes worker running.
  flannel/0*              active    idle            52.15.89.16                     Flannel subnet 10.1.73.1/24

Machine  State    DNS             Inst id              Series  AZ          Message
0        started  18.219.212.151  i-065eab4eabc691b25  xenial  us-east-2a  running
1        started  18.222.61.65    i-0b332955f028d6281  xenial  us-east-2b  running
2        started  18.219.221.98   i-0879ef1ed95b569bc  xenial  us-east-2a  running
3        started  18.219.190.99   i-08a7b364fc008fc85  xenial  us-east-2c  running
4        started  18.219.105.220  i-0f92d3420b01085af  xenial  us-east-2a  running
5        started  18.219.56.23    i-0271f6448cebae352  xenial  us-east-2c  running
6        started  13.59.240.210   i-0789ef5837e0669b3  xenial  us-east-2b  running
7        started  18.219.249.103  i-02f110b0ab042f7ac  xenial  us-east-2b  running
8        started  52.15.89.16     i-086852bf1bee63d4e  xenial  us-east-2c  running

Relation provider                    Requirer                             Interface         Type         Message
easyrsa:client                       etcd:certificates                    tls-certificates  regular
easyrsa:client                       kubeapi-load-balancer:certificates   tls-certificates  regular
easyrsa:client                       kubernetes-master:certificates       tls-certificates  regular
easyrsa:client                       kubernetes-worker:certificates       tls-certificates  regular
etcd:cluster                         etcd:cluster                         etcd              peer
etcd:db                              flannel:etcd                         etcd              regular
etcd:db                              kubernetes-master:etcd               etcd              regular
kubeapi-load-balancer:loadbalancer   kubernetes-master:loadbalancer       public-address    regular
kubeapi-load-balancer:website        kubernetes-worker:kube-api-endpoint  http              regular
kubernetes-master:cni                flannel:cni                          kubernetes-cni    subordinate
kubernetes-master:kube-api-endpoint  kubeapi-load-balancer:apiserver      http              regular
kubernetes-master:kube-control       kubernetes-worker:kube-control       kube-control      regular
kubernetes-worker:cni                flannel:cni                          kubernetes-cni    subordinate
```

<!-- ## Interacting with the cluster

After the cluster is deployed you may assume control over the cluster from any kubernetes-master, or kubernetes-worker node.

If you didn't use conjure-up, you will first need to download the credentials and client application to your local workstation:

Create the kubectl config directory.

```
mkdir -p ~/.kube
```
Copy the kubeconfig file to the default location.

```
juju scp kubernetes-master/0:/home/ubuntu/config ~/.kube/config
``` -->

## 与集群的交互

部署完集群后，您可以在任意一个 kubernetes-master 或 kubernetes-worker 节点取得集群的控制权。

如果您没有使用 conjure-up，那么您需要先将凭据和客户端程序下载到本地工作站上：

创建 kubectl 配置信息目录。

```
mkdir -p ~/.kube
```

将 kubeconfig 文件复制到默认位置。

```
juju scp kubernetes-master/0:config ~/.kube/config
```

<!-- The next step is to install the kubectl client on your local machine. The recommended way to do this on Ubuntu is using the kubectl snap ([/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu](/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu)).

The following command should be run on the machine you wish to use to control the kubernetes cluster:

```
sudo snap install kubectl --classic
```

This will install and deploy the kubectl binary. You may need to restart your terminal as your $PATH may have been updated. -->

下一步是在本地机器上安装 kubectl 客户端。在 Ubuntu 上推荐的安装方式是使用 kubectl snap ([/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu](/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu))。

可以运行下面的命令便可以控制 kubernetes 集群了：

```
sudo snap install kubectl --classic
```

这条命令会安装和部署 kubectl 程序。安装完成后，您可能需要重启命令窗口（因为 $PATH 已经被更新）。

<!-- Query the cluster:

    kubectl cluster-info

Output:

```
Kubernetes master is running at https://52.15.104.227:443
Heapster is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/kube-dns/proxy
Grafana is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
InfluxDB is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```

Congratulations, you've now set up a Kubernetes cluster! -->

查询集群：
		kubectl cluster-info

输出结果：

```
Kubernetes master is running at https://52.15.104.227:443
Heapster is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/kube-dns/proxy
Grafana is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
InfluxDB is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```

<!-- ## Scale up cluster

Want larger Kubernetes nodes? It is easy to request different sizes of cloud
resources from Juju by using **constraints**. You can increase the amount of
CPU or memory (RAM) in any of the systems requested by Juju. This allows you
to fine tune the Kubernetes cluster to fit your workload. Use flags on the
bootstrap command or as a separate `juju constraints` command. Look to the
[Juju documentation for machine](https://jujucharms.com/docs/2.3/charms-constraints)
details. -->

## 为集群垂直扩容

需要更大的 Kubernetes 节点？通过使用 Juju 的**约束**，您可以轻松地请求到不同大小的云资源。
通过 Juju 请求创建的任意系统，您都可以为它们增加 CPU 和内存（RAM）。
这使您可以对 Kubernetes 集群进行调优以适应工作负载。
藉由 bootstrap 命令的参数或使用独立的 `juju constraints` 命令都可以做到这点。详情参见[和机器相关的 Juju 文档](https://jujucharms.com/docs/2.3/charms-constraints)

<!-- ## Scale out cluster

Need more workers? We just add more units:

```shell
juju add-unit kubernetes-worker
```

Or multiple units at one time:

```shell
juju add-unit -n3 kubernetes-worker
```
You can also ask for specific instance types or other machine-specific constraints. See the [constraints documentation](https://jujucharms.com/docs/stable/reference-constraints) for more information. Here are some examples, note that generic constraints such as `cores` and `mem` are more portable between clouds. In this case we'll ask for a specific instance type from AWS:

```shell
juju set-constraints kubernetes-worker instance-type=c4.large
juju add-unit kubernetes-worker
```

You can also scale the etcd charm for more fault tolerant key/value storage:

```shell
juju add-unit -n3 etcd
```
It is strongly recommended to run an odd number of units for quorum. -->

## 为集群集群水平扩容

需要更多的工作节点？只需添加一些 unit：

```shell
juju add-unit kubernetes-worker
```

或者一次添加多个：

```shell
juju add-unit -n3 kubernetes-worker
```
您也可以为特定实例类型或者特定机器的设置约束。更多信息请参见[约束文档](https://jujucharms.com/docs/stable/reference-constraints)。
接下来举一些例子。请注意，诸如 `cores` 和 `mem` 这样的通用约束在各云之间的可移植性是比较高的。
在本例中，我们从 AWS 申请一个特定的实例类型：

```shell
juju set-constraints kubernetes-worker instance-type=c4.large
juju add-unit kubernetes-worker
```

为提升键值存储的容错能力，您也可以扩展 etcd charm：

```shell
juju add-unit -n3 etcd
```

强烈建议运行奇数个 unit 以支持法定人数票选。

<!-- ## Tear down cluster

If you used conjure-up to create your cluster, you can tear it down with `conjure-down`. If you used juju directly, you can tear it down by destroying the Juju model or the controller. Use the `juju switch` command to get the current controller name:

```shell
juju switch
juju destroy-controller $controllername --destroy-all-models
```
This will shutdown and terminate all running instances on that cloud.
{{% /capture %}}

{{% capture discussion %}} -->

## 销毁集群

如果您是使用 conjure-up 创建的集群，通过 `conjure-down` 便可以完成销毁过程。
如果是直接使用的 juju，你可以通过销毁 juju 模型或控制器来销毁集群。
使用 `juju switch` 命令获取当前控制器的名字：

```shell
juju switch
juju destroy-controller $controllername --destroy-all-models
```

这将关闭并终止该云上所有正在运行的实例。
{{% /capture %}}

{{% capture discussion %}}

<!-- ## More Info

The Ubuntu Kubernetes deployment uses open-source operations, or operations as code, known as charms. These charms are assembled from layers which keeps the code smaller and more focused on the operations of just Kubernetes and its components.

The Kubernetes layer and bundles can be found in the `kubernetes`
project on github.com:

 - [Bundle location](https://git.k8s.io/kubernetes/cluster/juju/bundles)
 - [Kubernetes charm layer location](https://git.k8s.io/kubernetes/cluster/juju/layers)
 - [Canonical Kubernetes home](https://jujucharms.com/kubernetes)
 - [Main issue tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)

Feature requests, bug reports, pull requests and feedback are appreciated.
{{% /capture %}} -->

{{% capture discussion %}}
## 更多信息

Ubuntu Kubernetes 的部署通过名为 charms 的开源运维工具实现，这类工具也称作运维即代码（Operations as Code）。
这些 charms 以层的方式组装，从而使代码更小，更专注于 Kubernetes 及其组件的操作。

Kubernetes 的层和 Bundle 可以在 github.com 的 `kubernetes` 项目中找到：

- [Bundle 的地址](https://git.k8s.io/kubernetes/cluster/juju/bundles)
- [Kubernetes charm 层的地址](https://git.k8s.io/kubernetes/cluster/juju/layers)
- [Canonical Kubernetes 主页](https://jujucharms.com/kubernetes)
- [主要的 issue tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)

欢迎提供功能需求，错误报告，pull request和反馈意见。
{{% /capture %}}
