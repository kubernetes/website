---
cn-approvers:
- zhangqx2010
title: 在 CenturyLink Cloud 上运行 Kubernetes
---
<!--
---
title: Running Kubernetes on CenturyLink Cloud
---
-->

* TOC
{: toc}

<!--
These scripts handle the creation, deletion and expansion of Kubernetes clusters on CenturyLink Cloud.
 -->
这些脚本处理 CenturyLink Cloud 上 Kubernetes 集群的创建，删除和扩展。

<!--
You can accomplish all these tasks with a single command. We have made the Ansible playbooks used to perform these tasks available [here](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md).
 -->
您可以使用单个命令完成所有这些任务。我们已经可以使用 Ansible playbooks 执行这些任务，请参考 [这里](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)。

<!--
## Find Help
 -->
## 寻求帮助

<!--
If you run into any problems or want help with anything, we are here to help. Reach out to use via any of the following ways:

- Submit a github issue
- Send an email to Kubernetes AT ctl DOT io
- Visit [http://info.ctl.io/kubernetes](http://info.ctl.io/kubernetes)
 -->
如果遇到任何问题或需要任何帮助，我们都会帮助您。您可以通过以下任何方式联系我们：

- 提交一个 github 问题
- 发送电子邮件给 Kubernetes@ctl.io
- 访问 [http://info.ctl.io/kubernetes](http://info.ctl.io/kubernetes)

<!--
## Clusters of VMs or Physical Servers, your choice.
 -->
## 您可以任意选择虚拟机或物理服务器组成集群

<!--
- We support Kubernetes clusters on both Virtual Machines or Physical Servers. If you want to use physical servers for the worker nodes (minions), simple use the --minion_type=bareMetal flag.
- For more information on physical servers, visit: [https://www.ctl.io/bare-metal/](https://www.ctl.io/bare-metal/)
- Physical serves are only available in the VA1 and GB3 data centers.
- VMs are available in all 13 of our public cloud locations
 -->
- 无论虚拟机还是物理服务器均支持 Kubernetes 集群。如果工作节点（minion）使用物理服务器，请使用 --minion_type=bareMetal 标志。
- 有关物理服务器的更多信息，请访问：[https://www.ctl.io/bare-metal/](https://www.ctl.io/bare-metal/)
- 物理服务仅在 VA1 和 GB3 数据中心提供。
- 所有13个公有云位置均提供虚拟机

<!--
## Requirements
 -->
## 要求

<!--
The requirements to run this script are:

- A linux administrative host (tested on ubuntu and OSX)
- python 2 (tested on 2.7.11)
  - pip (installed with python as of 2.7.9)
- git
- A CenturyLink Cloud account with rights to create new hosts
- An active VPN connection to the CenturyLink Cloud from your linux host
-->

运行这个脚本的要求是：
- 一个 Linux 管理主机（在 Ubuntu 和 OSX 测试过）
- python 2（在 2.7.11 上测试过）
  - pip（安装 Python 2.7.9）
- git
- 具有创建新主机权限的 CenturyLink Cloud 帐户
- 从您的 Linux 主机到 CenturyLink Cloud 的 VPN 连接

<!--
## Script Installation
 -->
## 脚本安装

<!--
After you have all the requirements met, please follow these instructions to install this script.
 -->
满足所有要求后，请按照以下说明运行安装脚本。

<!--
1) Clone this repository and cd into it.
 -->
1) 克隆这个仓库，并 cd 到这个目录中。

```shell
git clone https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc
```

<!--
2) Install all requirements, including

  * Ansible
  * CenturyLink Cloud SDK
  * Ansible Modules
 -->
2) 安装所有要求，包括

  * Ansible
  * CenturyLink Cloud SDK
  * Ansible模块

```shell
sudo pip install -r ansible/requirements.txt
```

<!--
3) Create the credentials file from the template and use it to set your ENV variables
 -->
3) 从模板创建凭证文件，并使用它来设置您的ENV变量

```shell
cp ansible/credentials.sh.template ansible/credentials.sh
vi ansible/credentials.sh
source ansible/credentials.sh

```

<!--
4) Grant your machine access to the CenturyLink Cloud network by using a VM inside the network or [ configuring a VPN connection to the CenturyLink Cloud network.](https://www.ctl.io/knowledge-base/network/how-to-configure-client-vpn/)
 -->
4) 使用网络内的虚拟机或 [配置连接到 CenturyLink Cloud 网络的 VPN](https://www.ctl.io/knowledge-base/network/how-to-configure-client-vpn/) 来从您的机器访问 CenturyLink Cloud 网络。

<!--
#### Script Installation Example: Ubuntu 14 Walkthrough
 -->
#### 脚本安装示例：Ubuntu 14 演练

<!--
If you use an ubuntu 14, for your convenience we have provided a step by step
guide to install the requirements and install the script.
 -->
如果您使用的是 Ubuntu 14，方便起见，我们已经提供了一个安装依赖和脚本的分步指导。

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
 -->
## 集群创建

<!--
To create a new Kubernetes cluster, simply run the ```kube-up.sh``` script. A complete
list of script options and some examples are listed below.
 -->
要创建一个新的 Kubernetes 集群，只需运行 ```kube-up.sh``` 脚本。以下列出了脚本选项和一些示例的完整列表。

```shell
CLC_CLUSTER_NAME=[name of kubernetes cluster]
cd ./adm-kubernetes-on-clc
bash kube-up.sh -c="$CLC_CLUSTER_NAME"
```

<!--
It takes about 15 minutes to create the cluster. Once the script completes, it
will output some commands that will help you setup kubectl on your machine to
point to the new cluster.
 -->
大约需要15分钟来创建集群。一旦脚本完成，它会输出一些命令来帮助您在机器上设置 kubectl 以指向新的集群。

<!--
When the cluster creation is complete, the configuration files for it are stored
locally on your administrative host, in the following directory
 -->
集群创建完成后，会将其配置文件本地保存在您管理主机的以下目录中

```shell
> CLC_CLUSTER_HOME=$HOME/.clc_kube/$CLC_CLUSTER_NAME/
```


<!--
#### Cluster Creation: Script Options
 -->
#### 集群创建：脚本选项

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
 -->
## 集群扩展

<!--
To expand an existing Kubernetes cluster, run the ```add-kube-node.sh```
script. A complete list of script options and some examples are listed [below](#cluster-expansion-script-options).
This script must be run from the same host that created the cluster (or a host
that has the cluster artifact files stored in ```~/.clc_kube/$cluster_name```).
 -->
要扩展现有的 Kubernetes 集群，运行 ```add-kube-node.sh``` 脚本。脚本选项和一些例子的完整列表在 [下面](#cluster-expansion-script-options) 列出。
此脚本必须从创建集群的同一台主机（或者在 ~/.clc_kube/$cluster_name 路径保存了集群 artifact 文件的主机）运行。

```shell
cd ./adm-kubernetes-on-clc
bash add-kube-node.sh -c="name_of_kubernetes_cluster" -m=2
```

<!--
#### Cluster Expansion: Script Options
 -->
#### 集群扩展：脚本选项

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
 -->
## 集群删除

<!--
There are two ways to delete an existing cluster:
 -->
有两种方法可以删除现有的集群：

<!--
1) Use our python script:
 -->
1) 使用我们的 Python 脚本：

```shell
python delete_cluster.py --cluster=clc_cluster_name --datacenter=DC1
```

<!--
2) Use the CenturyLink Cloud UI. To delete a cluster, log into the CenturyLink
Cloud control portal and delete the parent server group that contains the
Kubernetes Cluster. We hope to add a scripted option to do this soon.
 -->
2) 使用 CenturyLink Cloud 用户界面。
要删除集群，请登录到 CenturyLink Cloud 控制门户并删除包含该父服务器组的 Kubernetes 集群。
我们希望添加一个脚本化的选项来尽快做到这一点。

<!--
## Examples
 -->
## 例子

<!--
Create a cluster with name of k8s_1, 1 master node and 3 worker minions (on physical machines), in VA1
 -->
在 VA1 中创建名称为 k8s_1，1个 master 节点和3个 worker（在物理机上）的集群

```shell
bash kube-up.sh --clc_cluster_name=k8s_1 --minion_type=bareMetal --minion_count=3 --datacenter=VA1
```

<!--
Create a cluster with name of k8s_2, an ha etcd cluster on 3 VMs and 6 worker minions (on VMs), in VA1
 -->
在 VA1 中创建一个名为 k8s_2 的集群，一个在3个虚拟机和6个 worker minion（在虚拟机上）的 HA etcd 集群

```shell
bash kube-up.sh --clc_cluster_name=k8s_2 --minion_type=standard --minion_count=6 --datacenter=VA1 --etcd_separate_cluster=yes
```

<!--
Create a cluster with name of k8s_3, 1 master node, and 10 worker minions (on VMs) with higher mem/cpu, in UC1:
 -->
在 UC1 中创建一个名为 k8s_3，1个 master 节点和10个具有更高 mem/cpu 的 worker minion（在VM上）的集群：

```shell
bash kube-up.sh --clc_cluster_name=k8s_3 --minion_type=standard --minion_count=10 --datacenter=VA1 -mem=6 -cpu=4
```



<!--
## Cluster Features and Architecture
 -->
## 集群功能和体系结构

<!--
We configure the Kubernetes cluster with the following features:
 -->
我们使用以下功能配置 Kubernetes 集群：

<!--
* KubeDNS: DNS resolution and service discovery
* Heapster/InfluxDB: For metric collection. Needed for Grafana and auto-scaling.
* Grafana: Kubernetes/Docker metric dashboard
* KubeUI: Simple web interface to view Kubernetes state
* Kube Dashboard: New web interface to interact with your cluster
 -->
* KubeDNS：DNS 解析和服务发现
* Heapster/InfluxDB：用于 metric 收集。需要 Grafana 和 auto-scaling。
* Grafana：Kubernetes/Docker metric 面板
* KubeUI：简单的界面来查看 Kubernetes 状态
* Kube Dashboard：新的用于与您的集群交互的 Web 界面

<!--
We use the following to create the Kubernetes cluster:
 -->
我们使用这些组件创建 Kubernetes 集群：

* Kubernetes 1.1.7
* Ubuntu 14.04
* Flannel 0.5.4
* Docker 1.9.1-0~trusty
* Etcd 2.2.2

<!--
## Optional add-ons
 -->
## 可选插件

<!--
* Logging: We offer an integrated centralized logging ELK platform so that all
  Kubernetes and docker logs get sent to the ELK stack. To install the ELK stack
  and configure Kubernetes to send logs to it, follow [the log
  aggregation documentation](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/log_aggregration.md). Note: We don't install this by default as
  the footprint isn't trivial.
 -->
* 日志记录：我们提供一个集成的集中日志记录 ELK 平台，以便所有 Kubernetes 和 docker 日志被发送到 ELK 堆栈。要安装 ELK 堆栈并配置 Kubernetes 发送日志，
  遵循 [日志聚合文档](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/log_aggregration.md)。
  注意：我们不会默认安装这个，因为它占用的空间并不小。

<!--
## Cluster management
 -->
## 集群管理

<!--
The most widely used tool for managing a Kubernetes cluster is the command-line
utility ```kubectl```.  If you do not already have a copy of this binary on your
administrative machine, you may run the script ```install_kubectl.sh``` which will
download it and install it in ```/usr/bin/local```.
 -->
管理 Kubernetes 集群的最广泛使用的工具是命令行 ```kubectl```。
如果您的管理主机上还没有这个二进制文件，可以运行 ```install_kubectl.sh```，这个脚本会将它下载并安装到 ```/usr/bin/local``` 中。

<!--
The script requires that the environment variable ```CLC_CLUSTER_NAME``` be defined
 -->
该脚本要求定义环境变量 ```CLC_CLUSTER_NAME```

<!--
```install_kubectl.sh``` also writes a configuration file which will embed the necessary
authentication certificates for the particular cluster.  The configuration file is
written to the  ```${CLC_CLUSTER_HOME}/kube``` directory
 -->
```install_kubectl.sh``` 也写一个配置文件，它将嵌入必要的特定集群的身份验证证书。
配置文件会写到 ```${CLC_CLUSTER_HOME}/kube``` 目录

```shell
export KUBECONFIG=${CLC_CLUSTER_HOME}/kube/config
kubectl version
kubectl cluster-info
```

<!--
### Accessing the cluster programmatically
 -->
### 以编程方式访问集群

<!--
It's possible to use the locally stored client certificates to access the apiserver. For example, you may want to use any of the [Kubernetes API client libraries](/docs/reference/client-libraries/) to program against your Kubernetes cluster in the programming language of your choice.
 -->
可以使用本地存储的客户端证书来访问 apiserver。例如，您可能希望使用任何 [Kubernetes API 客户端库](/docs/reference/client-libraries/) ，并以您选择的编程语言对您的 Kubernetes 集群进行编程。

<!--
To demonstrate how to use these locally stored certificates, we provide the following example of using ```curl``` to communicate to the master apiserver via https:
 -->
为了演示如何使用这些本地存储的证书，我们提供了以下例子，使用 ```curl`` 通过 https 与主 apiserver 进行通信：

```shell
curl \
   --cacert ${CLC_CLUSTER_HOME}/pki/ca.crt  \
   --key ${CLC_CLUSTER_HOME}/pki/kubecfg.key \
   --cert ${CLC_CLUSTER_HOME}/pki/kubecfg.crt  https://${MASTER_IP}:6443
```

<!--
But please note, this *does not* work out of the box with the ```curl``` binary
distributed with OSX.
 -->
但请注意，这*不*适用于 OSX 版本的 curl 二进制文件。

<!--
### Accessing the cluster with a browser
 -->
### 使用浏览器访问集群

<!--
We install two UIs on Kubernetes. The original KubeUI and [the newer kube
dashboard](/docs/tasks/web-ui-dashboard/). When you create a cluster, the script should output URLs for these
interfaces like this:
 -->
我们在 Kubernetes 上安装两个 UI。原来的 KubeUI 和 [新的 Kube dashboard](/docs/tasks/web-ui-dashboard/)。
当你创建一个集群时，脚本应该输出这些接口 URL ，像这样：

KubeUI is running at ```https://${MASTER_IP}:6443/api/v1/namespaces/kube-system/services/kube-ui/proxy```.

kubernetes-dashboard is running at ```https://${MASTER_IP}:6443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy```.

<!--
Note on Authentication to the UIs: The cluster is set up to use basic
authentication for the user _admin_.   Hitting the url at
```https://${MASTER_IP}:6443``` will require accepting the self-signed certificate
from the apiserver, and then presenting the admin password written to file at:
 -->
关于用户界面身份验证的注意事项：集群设置为使用基本用户 _admin_ 的身份验证。打在网址 ```https://${MASTER_IP}:6443``` 需要接受 apiserver 的自签名证书，然后提交管理员密码文件，位于：

```> _${CLC_CLUSTER_HOME}/kube/admin_password.txt_```


<!--
### Configuration files
 -->
### 配置文件

<!--
Various configuration files are written into the home directory *CLC_CLUSTER_HOME* under
```.clc_kube/${CLC_CLUSTER_NAME}``` in several subdirectories. You can use these files
to access the cluster from machines other than where you created the cluster from.
 -->
各种配置文件被写入主目录 *CLC_CLUSTER_HOME* 下的 ```.clc_kube/${CLC_CLUSTER_NAME}``` 几个子目录中。
你可以使用这些文件从您创建集群的位置以外的机器访问集群。

<!--
* ```config/```: Ansible variable files containing parameters describing the master and minion hosts
* ```hosts/```: hosts files listing access information for the ansible playbooks
* ```kube/```: ```kubectl``` configuration files, and the basic-authentication password for admin access to the Kubernetes API
* ```pki/```: public key infrastructure files enabling TLS communication in the cluster
* ```ssh/```: SSH keys for root access to the hosts
 -->
* ```config/```: Ansible变量文件，包含描述主控和主控主机的参数
* ```hosts/```: 主机文件列出了可靠的剧本的访问信息
* ```kube/```: ```kubectl``` 配置文件，以及管理员访问 Kubernetes API 的基本认证密码
* ```pki/```: 在集群中启用 TLS 通信的公共基础设施文件
* ```ssh/```: 用于 root 访问主机的 SSH 密钥

<!--
## ```kubectl``` usage examples
 -->
## ```kubectl``` 使用例子

<!--
There are a great many features of _kubectl_.  Here are a few examples
 -->
_kubectl_ 有很多功能。下面是一些例子

<!--
List existing nodes, pods, services and more, in all namespaces, or in just one:
 -->
列出所有名称空间中的现有 node、Pod、service 等等，或者只列出一个：

```shell
kubectl get nodes
kubectl get --all-namespaces services
kubectl get --namespace=kube-system replicationcontrollers
```

<!--
The Kubernetes API server exposes services on web URLs, which are protected by requiring
client certificates.  If you run a kubectl proxy locally, ```kubectl``` will provide
the necessary certificates and serve locally over http.
 -->
Kubernetes API 服务器在 web URL 上提供服务，通过校验客户证书保护这些 URL 。
如果你在本地运行一个 kubectl 代理，```kubectl``` 将会提供必要的证书并通过 http 服务于本地。

```shell
kubectl proxy -p 8001
```

<!--
Then, you can access urls like ```http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kube-ui/proxy/``` without the need for client certificates in your browser.
 -->
然后，您可以在浏览器中访问像 ```http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kube-ui/proxy/``` 这样的 URL 而不需要客户端证书。


<!--
## What Kubernetes features do not work on CenturyLink Cloud
 -->
## 哪些 Kubernetes 特性在 CenturyLink Cloud 上不起作用

<!--
These are the known items that don't work on CenturyLink cloud but do work on other cloud providers:
 -->
这些是在 CenturyLink Cloud 上不起作用的已知项，但可以在其他云上工作：

<!--
- At this time, there is no support services of the type [LoadBalancer](/docs/tasks/access-application-cluster/create-external-load-balancer/). We are actively working on this and hope to publish the changes sometime around April 2016.

- At this time, there is no support for persistent storage volumes provided by
  CenturyLink Cloud. However, customers can bring their own persistent storage
  offering. We ourselves use Gluster.
 -->
- 目前没有 [LoadBalancer](/docs/tasks/access-application-cluster/create-external-load-balancer/) 类型的支持服务。我们正在积极努力，希望在2016年4月左右发布这些变化。

- 目前，CenturyLink Cloud 不支持持久性存储卷。但是，客户可以使用自己选中的持久存储。我们自己使用 Gluster。

<!--
## Ansible Files
 -->
## Ansible 文件

<!--
If you want more information about our Ansible files, please [read this file](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)
 -->
如果你想了解更多有关我们 Ansible 文件的信息，请 [阅读此文件](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)

<!--
## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
 -->
## 更多信息

有关管理和使用 Kubernetes 集群的更多详细信息，请参阅 [Kubernetes 文档](/docs/)。
