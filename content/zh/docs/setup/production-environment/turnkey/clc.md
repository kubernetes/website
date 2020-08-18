---
title: 在 CenturyLink Cloud 上运行 Kubernetes
---
<!--
---
title: Running Kubernetes on CenturyLink Cloud
---
--->


<!--
These scripts handle the creation, deletion and expansion of Kubernetes clusters on CenturyLink Cloud.

You can accomplish all these tasks with a single command. We have made the Ansible playbooks used to perform these tasks available [here](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md).
--->
这些脚本适用于在 CenturyLink Cloud 上创建、删除和扩展 Kubernetes 集群。

您可以使用单个命令完成所有任务。我们提供了用于执行这些任务的 Ansible 手册 [点击这里](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)

<!--
## Find Help

If you run into any problems or want help with anything, we are here to help. Reach out to use via any of the following ways:

- Submit a github issue
- Send an email to Kubernetes AT ctl DOT io
- Visit [http://info.ctl.io/kubernetes](http://info.ctl.io/kubernetes)
--->
## 寻求帮助

如果运行出现问题或者想要寻求帮助，我们非常乐意帮忙。通过以下方式获取帮助：

- 提交 github issue
- 给 Kubernetes AT ctl DOT io 发送邮件
- 访问 [http://info.ctl.io/kubernetes](http://info.ctl.io/kubernetes)

<!--
## Clusters of VMs or Physical Servers, your choice.

- We support Kubernetes clusters on both Virtual Machines or Physical Servers. If you want to use physical servers for the worker nodes (minions), simple use the --minion_type=bareMetal flag.
- For more information on physical servers, visit: [https://www.ctl.io/bare-metal/](https://www.ctl.io/bare-metal/)
- Physical serves are only available in the VA1 and GB3 data centers.
- VMs are available in all 13 of our public cloud locations
--->
## 基于 VM 或物理服务器的集群可供选择

- 我们在虚拟机或物理服务器上都支持 Kubernetes 集群。如果要将物理服务器用于辅助 Node（minions），则只需使用 --minion_type=bareMetal 标志。
- 有关物理服务器的更多信息，请访问： [https://www.ctl.io/bare-metal/](https://www.ctl.io/bare-metal/)
- 仅在 VA1 和 GB3 数据中心提供物理服务。
- 13个公共云位置都可以使用虚拟机。

<!--
## Requirements

The requirements to run this script are:

- A linux administrative host (tested on ubuntu and macOS)
- python 2 (tested on 2.7.11)
  - pip (installed with python as of 2.7.9)
- git
- A CenturyLink Cloud account with rights to create new hosts
- An active VPN connection to the CenturyLink Cloud from your linux host
--->
## 要求

运行此脚本的要求有：

- Linux 管理主机（在 ubuntu 和 macOS 上测试）
- python 2（在 2.7.11 版本上测试）
   - pip（从 2.7.9 版开始与 python 一起安装）
- git
- 具有新建主机权限的 CenturyLink Cloud 帐户
- 从 Linux 主机到 CenturyLink Cloud 的有效 VPN 连接

<!--
## Script Installation

After you have all the requirements met, please follow these instructions to install this script.

1) Clone this repository and cd into it.
--->
## 脚本安装

满足所有要求后，请按照以下说明安装此脚本。

1）克隆此存储库并通过 cd 进入。

```shell
git clone https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc
```

<!--
2) Install all requirements, including
--->
2）安装所有要求的部分，包括

  * Ansible
  * CenturyLink Cloud SDK
  * Ansible Modules

```shell
sudo pip install -r ansible/requirements.txt
```

<!--
3) Create the credentials file from the template and use it to set your ENV variables
--->
3）从模板创建凭证文件，并使用它来设置您的 ENV 变量

```shell
cp ansible/credentials.sh.template ansible/credentials.sh
vi ansible/credentials.sh
source ansible/credentials.sh

```

<!--
4) Grant your machine access to the CenturyLink Cloud network by using a VM inside the network or [ configuring a VPN connection to the CenturyLink Cloud network.](https://www.ctl.io/knowledge-base/network/how-to-configure-client-vpn/)
--->
4）使用内网的虚拟机或 [ 配置与 CenturyLink Cloud 网络的 VPN 连接.](https://www.ctl.io/knowledge-base/network/how-to-configure-client-vpn/)   授予您的计算机对 CenturyLink Cloud 网络的访问权限。

<!--
#### Script Installation Example: Ubuntu 14 Walkthrough

If you use an ubuntu 14, for your convenience we have provided a step by step guide to install the requirements and install the script.
--->
#### 脚本安装示例：Ubuntu 14 演练

如果您使用 Ubuntu 14，为方便起见，我们会提供分步指导帮助安装必备条件和脚本。

```shell
# system
apt-get update
apt-get install -y git python python-crypto
curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py

# installing this repository
mkdir -p ~home/k8s-on-clc
cd ~home/k8s-on-clc
git clone https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc.git
cd adm-kubernetes-on-clc/
pip install -r requirements.txt

# getting started
cd ansible
cp credentials.sh.template credentials.sh; vi credentials.sh
source credentials.sh
```



<!--
## Cluster Creation

To create a new Kubernetes cluster, simply run the ```kube-up.sh``` script. A complete
list of script options and some examples are listed below.
--->
## 创建集群

要创建一个新的 Kubernetes 集群，只需运行 ```kube-up.sh``` 脚本即可。以下是一套完整的脚本选项列表和一些示例。

```shell
CLC_CLUSTER_NAME=[name of kubernetes cluster]
cd ./adm-kubernetes-on-clc
bash kube-up.sh -c="$CLC_CLUSTER_NAME"
```

<!--
It takes about 15 minutes to create the cluster. Once the script completes, it
will output some commands that will help you setup kubectl on your machine to
point to the new cluster.

When the cluster creation is complete, the configuration files for it are stored
locally on your administrative host, in the following directory
--->
创建集群大约需要15分钟。脚本完成后，它将输出一些命令，这些命令将帮助您在计算机上设置 kubectl 以指向新集群。

完成集群创建后，其配置文件会存储在本地管理主机的以下目录中

```shell
> CLC_CLUSTER_HOME=$HOME/.clc_kube/$CLC_CLUSTER_NAME/
```


<!--
#### Cluster Creation: Script Options
--->
#### 创建集群：脚本选项

```shell
Usage: kube-up.sh [OPTIONS]
Create servers in the CenturyLinkCloud environment and initialize a Kubernetes cluster
Environment variables CLC_V2_API_USERNAME and CLC_V2_API_PASSWD must be set in
order to access the CenturyLinkCloud API

All options (both short and long form) require arguments, and must include "="
between option name and option value.

     -h (--help)                   display this help and exit
     -c= (--clc_cluster_name=)     set the name of the cluster, as used in CLC group names
     -t= (--minion_type=)          standard -> VM (default), bareMetal -> physical]
     -d= (--datacenter=)           VA1 (default)
     -m= (--minion_count=)         number of kubernetes minion nodes
     -mem= (--vm_memory=)          number of GB ram for each minion
     -cpu= (--vm_cpu=)             number of virtual cps for each minion node
     -phyid= (--server_conf_id=)   physical server configuration id, one of
                                      physical_server_20_core_conf_id
                                      physical_server_12_core_conf_id
                                      physical_server_4_core_conf_id (default)
     -etcd_separate_cluster=yes    create a separate cluster of three etcd nodes,
                                   otherwise run etcd on the master node
```

<!--
## Cluster Expansion

To expand an existing Kubernetes cluster, run the ```add-kube-node.sh```
script. A complete list of script options and some examples are listed [below](#cluster-expansion-script-options).
This script must be run from the same host that created the cluster (or a host
that has the cluster artifact files stored in ```~/.clc_kube/$cluster_name```).
--->
## 扩展集群
 
要扩展现有的Kubernetes集群，请运行```add-kube-node.sh``` 脚本。脚本选项的完整列表和一些示例在 [下面](#cluster-expansion-script-options) 列出。该脚本必须运行在创建集群的同一个主机（或储存集群工件文件的 ```~/.clc_kube/$cluster_name``` 主机）。

```shell
cd ./adm-kubernetes-on-clc
bash add-kube-node.sh -c="name_of_kubernetes_cluster" -m=2
```

<!--
#### Cluster Expansion: Script Options
--->
#### 扩展集群：脚本选项

```shell
Usage: add-kube-node.sh [OPTIONS]
Create servers in the CenturyLinkCloud environment and add to an
existing CLC kubernetes cluster

Environment variables CLC_V2_API_USERNAME and CLC_V2_API_PASSWD must be set in
order to access the CenturyLinkCloud API

     -h (--help)                   display this help and exit
     -c= (--clc_cluster_name=)     set the name of the cluster, as used in CLC group names
     -m= (--minion_count=)         number of kubernetes minion nodes to add
```

<!--
## Cluster Deletion

There are two ways to delete an existing cluster:

1) Use our python script:
--->
## 删除集群

有两种方法可以删除集群：

1）使用 Python 脚本：

```shell
python delete_cluster.py --cluster=clc_cluster_name --datacenter=DC1
```

<!--
2) Use the CenturyLink Cloud UI. To delete a cluster, log into the CenturyLink
Cloud control portal and delete the parent server group that contains the
Kubernetes Cluster. We hope to add a scripted option to do this soon.
--->
2）使用 CenturyLink Cloud UI。要删除集群，请登录 CenturyLink Cloud 控制页面并删除包含 Kubernetes 集群的父服务器组。我们希望能够添加脚本选项以尽快完成此操作。

<!--
## Examples

Create a cluster with name of k8s_1, 1 master node and 3 worker minions (on physical machines), in VA1
--->
## 示例

在 VA1 中创建一个集群，名称为 k8s_1，具备1个主 Node 和3个辅助 Minion（在物理机上）

```shell
bash kube-up.sh --clc_cluster_name=k8s_1 --minion_type=bareMetal --minion_count=3 --datacenter=VA1
```

<!--
Create a cluster with name of k8s_2, an ha etcd cluster on 3 VMs and 6 worker minions (on VMs), in VA1
--->
在 VA1 中创建一个 ha etcd 集群，名称为 k8s_2，运行在3个虚拟机和6个辅助 Minion（在虚拟机上）

```shell
bash kube-up.sh --clc_cluster_name=k8s_2 --minion_type=standard --minion_count=6 --datacenter=VA1 --etcd_separate_cluster=yes
```

<!--
Create a cluster with name of k8s_3, 1 master node, and 10 worker minions (on VMs) with higher mem/cpu, in UC1:
--->
在 UC1 中创建一个集群，名称为k8s_3，具备1个主 Node 和10个具有更高 mem/cpu 的辅助 Minion（在虚拟机上）：

```shell
bash kube-up.sh --clc_cluster_name=k8s_3 --minion_type=standard --minion_count=10 --datacenter=VA1 -mem=6 -cpu=4
```



<!--
## Cluster Features and Architecture

We configure the Kubernetes cluster with the following features:

* KubeDNS: DNS resolution and service discovery
* Heapster/InfluxDB: For metric collection. Needed for Grafana and auto-scaling.
* Grafana: Kubernetes/Docker metric dashboard
* KubeUI: Simple web interface to view Kubernetes state
* Kube Dashboard: New web interface to interact with your cluster
--->
## 集群功能和架构

我们使用以下功能配置 Kubernetes 集群：

* KubeDNS：DNS 解析和服务发现
* Heapster / InfluxDB：用于指标收集，是 Grafana 和 auto-scaling 需要的。
* Grafana：Kubernetes/Docker 指标仪表板
* KubeUI：用于查看 Kubernetes 状态的简单 Web 界面
* Kube 仪表板：新的 Web 界面可与您的集群进行交互

<!--
We use the following to create the Kubernetes cluster:
--->
使用以下工具创建 Kubernetes 集群：

* Kubernetes 1.1.7
* Ubuntu 14.04
* Flannel 0.5.4
* Docker 1.9.1-0~trusty
* Etcd 2.2.2

<!--
## Optional add-ons

* Logging: We offer an integrated centralized logging ELK platform so that all
  Kubernetes and docker logs get sent to the ELK stack. To install the ELK stack
  and configure Kubernetes to send logs to it, follow [the log
  aggregation documentation](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/log_aggregration.md). Note: We don't install this by default as
  the footprint isn't trivial.
--->
## 可选附件
* 日志记录：我们提供了一个集成的集中式日志记录 ELK 平台，以便将所有 Kubernetes 和 docker 日志发送到 ELK 堆栈。要安装 ELK 堆栈并配置 Kubernetes 向其发送日志，请遵循 [日志聚合文档](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/log_aggregration.md)。注意：默认情况下我们不安装此程序，因为占用空间并不小。

<!--
## Cluster management

The most widely used tool for managing a Kubernetes cluster is the command-line
utility ```kubectl```. If you do not already have a copy of this binary on your
administrative machine, you may run the script ```install_kubectl.sh``` which will
download it and install it in ```/usr/bin/local```.
--->
## 管理集群

管理 Kubernetes 集群最常用工具是 command-line 实用程序 ```kubectl```。如果您的管理器上还没有此二进制文件的副本，可以运行脚本 ```install_kubectl.sh```，它将下载该脚本并将其安装在 ```/usr/bin/local``` 中。 

<!--
The script requires that the environment variable ```CLC_CLUSTER_NAME``` be defined. ```install_kubectl.sh``` also writes a configuration file which will embed the necessary
authentication certificates for the particular cluster.  The configuration file is
written to the  ```${CLC_CLUSTER_HOME}/kube``` directory
--->
该脚本要求定义环境变量 ```CLC_CLUSTER_NAME```。```install_kubectl.sh``` 还将写入一个配置文件，该文件为特定集群嵌入必要的认证证书。配置文件被写入 ```${CLC_CLUSTER_HOME}/kube``` 目录中


```shell
export KUBECONFIG=${CLC_CLUSTER_HOME}/kube/config
kubectl version
kubectl cluster-info
```

<!--
### Accessing the cluster programmatically 

It's possible to use the locally stored client certificates to access the apiserver. For example, you may want to use any of the [Kubernetes API client libraries](/docs/reference/using-api/client-libraries/) to program against your Kubernetes cluster in the programming language of your choice. 

To demonstrate how to use these locally stored certificates, we provide the following example of using ```curl``` to communicate to the master apiserver via https:
--->
### 以编程方式访问集群

可以使用本地存储的客户端证书来访问 apiserver。例如，您可以使用 [Kubernetes API 客户端库](/docs/reference/using-api/client-libraries/) 选择编程语言对 Kubernetes 集群进行编程。

为了演示如何使用这些本地存储的证书，我们提供以下示例，使用 ```curl``` 通过 https 与主 apiserver 进行通信：

```shell
curl \
   --cacert ${CLC_CLUSTER_HOME}/pki/ca.crt  \
   --key ${CLC_CLUSTER_HOME}/pki/kubecfg.key \
   --cert ${CLC_CLUSTER_HOME}/pki/kubecfg.crt  https://${MASTER_IP}:6443
```

<!--
But please note, this *does not* work out of the box with the ```curl``` binary
distributed with macOS.
--->
但是请注意，这 *不能* 与 MacOS 一起发行的 ```curl``` 二进制文件分开使用。

<!--
### Accessing the cluster with a browser

We install [the kubernetes dashboard](/docs/tasks/web-ui-dashboard/). When you
create a cluster, the script should output URLs for these interfaces like this:

kubernetes-dashboard is running at ```https://${MASTER_IP}:6443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy```.
--->
### 使用浏览器访问集群

安装 [Kubernetes 仪表板](/docs/tasks/web-ui-dashboard/)。创建集群时，脚本会为这些接口输出 URL，如下所示：

kubernetes-dashboard 在以下位置运行 ```https://${MASTER_IP}:6443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy```

<!--
Note on Authentication to the UIs: 

The cluster is set up to use basic authentication for the user _admin_.
Hitting the url at ```https://${MASTER_IP}:6443``` will 
require accepting the self-signed certificate
from the apiserver, and then presenting the admin 
password written to file at: ```> _${CLC_CLUSTER_HOME}/kube/admin_password.txt_```
--->
对 UI 进行身份验证的注意事项：

群集设置为对用户 _admin_ 使用基本的身份验证。进入 URL ```https://${MASTER_IP}:6443```  获取从 apiserver 上接收的自签名证书，然后出示管理员密码并写入文件 ```> _${CLC_CLUSTER_HOME}/kube/admin_password.txt_```


<!--
### Configuration files

Various configuration files are written into the home directory *CLC_CLUSTER_HOME* under ```.clc_kube/${CLC_CLUSTER_NAME}``` in several subdirectories. You can use these files
to access the cluster from machines other than where you created the cluster from.
--->
### 配置文件

多个配置文件被写入几个子目录，子目录在 ```.clc_kube/${CLC_CLUSTER_NAME}``` 下的主目录 *CLC_CLUSTER_HOME* 中。使用这些文件可以从创建群集的计算机之外的其他计算机访问群集。

<!--
* ```config/```: Ansible variable files containing parameters describing the master and minion hosts
* ```hosts/```: hosts files listing access information for the Ansible playbooks
* ```kube/```: ```kubectl``` configuration files, and the basic-authentication password for admin access to the Kubernetes API
* ```pki/```: public key infrastructure files enabling TLS communication in the cluster
* ```ssh/```: SSH keys for root access to the hosts
--->
* ```config/```：Ansible 变量文件，包含描述主机和从机的参数
* ```hosts/```: 主机文件，列出了 Ansible 手册的访问信息
* ```kube/```: ```kubectl``` 配置文件，包含管理员访问 Kubernetes API 所需的基本身份验证密码
* ```pki/```: 公钥基础结构文件，用于在集群中启用 TLS 通信
* ```ssh/```: 对主机进行根访问的 SSH 密钥


<!--
## ```kubectl``` usage examples

There are a great many features of _kubectl_.  Here are a few examples

List existing nodes, pods, services and more, in all namespaces, or in just one:
--->
## ```kubectl``` 使用示例

_kubectl_ 有很多功能，例如

列出所有或者一个命名空间中存在的 Node，Pod，服务等。

```shell
kubectl get nodes
kubectl get --all-namespaces pods
kubectl get --all-namespaces services
kubectl get --namespace=kube-system replicationcontrollers
```

<!--
The Kubernetes API server exposes services on web URLs, which are protected by requiring
client certificates.  If you run a kubectl proxy locally, ```kubectl``` will provide
the necessary certificates and serve locally over http.
--->
Kubernetes API 服务器在 Web URL 上公开服务，这些 URL 受客户端证书的保护。如果您在本地运行 kubectl 代理，```kubectl``` 将提供必要的证书，并通过 http 在本地提供服务。

```shell
kubectl proxy -p 8001
```

<!--
Then, you can access urls like ```http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/``` without the need for client certificates in your browser.
--->
然后，您可以访问 ```http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/``` 之类的 URL，不再需要浏览器中的客户端证书 。


<!--
## What Kubernetes features do not work on CenturyLink Cloud

These are the known items that don't work on CenturyLink cloud but do work on other cloud providers:

- At this time, there is no support services of the type [LoadBalancer](/docs/tasks/access-application-cluster/create-external-load-balancer/). We are actively working on this and hope to publish the changes sometime around April 2016.

- At this time, there is no support for persistent storage volumes provided by
  CenturyLink Cloud. However, customers can bring their own persistent storage
  offering. We ourselves use Gluster.
--->
## Kubernetes 的哪些功能无法在 CenturyLink Cloud 上使用

这些是已知的在 CenturyLink Cloud 上不能使用，但在其他云提供商中可以使用：

- 目前，没有 [LoadBalancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)类型的支持服务。我们正在为此积极努力，并希望在2016年4月左右发布更改。

- 目前，不支持 CenturyLink Cloud 提供的永久存储卷。但是，客户可以自带永久性存储产品。我们自己使用 Gluster。


<!--
## Ansible Files

If you want more information about our Ansible files, please [read this file](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)
--->
## Ansible 文件

如果您想了解有关 Ansible 文件的更多信息，请 [浏览此文件](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)

<!--
## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
--->
## 更多

有关管理和使用 Kubernetes 集群的更多详细信息，请参见 [Kubernetes 文档](/docs/) 



