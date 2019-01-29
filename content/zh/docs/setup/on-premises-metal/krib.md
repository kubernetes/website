<!--
title: Installing Kubernetes with Digital Rebar Provision (DRP) via KRIB
krib-version: 2.4
author: Rob Hirschfeld (zehicle)
-->
---
title: 通过 KRIB 安装带有 Digital Rebar Provision（DRP）的 Kubernetes
krib-version: 2.4
author: Rob Hirschfeld (zehicle)
---

<!--
## Overview
-->
## 概览

<!--
This guide helps to install a Kubernetes cluster hosted on bare metal with [Digital Rebar Provision](https://github.com/digitalrebar/provision) using only its Content packages and *kubeadm*. 
-->
本指南帮助使用 [Digital Rebar Provision](https://github.com/digitalrebar/provision) 安装在裸机上托管的 Kubernetes 集群，且仅使用其内容包和 *kubeadm* 。

<!--
Digital Rebar Provision (DRP) is an integrated Golang DHCP, bare metal provisioning (PXE/iPXE) and workflow automation platform. While [DRP can be used to invoke](https://provision.readthedocs.io/en/tip/doc/integrations/ansible.html) [kubespray](../kubespray), it also offers a self-contained Kubernetes installation known as [KRIB (Kubernetes Rebar Integrated Bootstrap)](https://github.com/digitalrebar/provision-content/tree/master/krib).
-->
Digital Rebar Provision（DRP）是一个集成的 Golang DHCP、裸机配置（PXE/iPXE）和工作流自动化平台。 虽然 [DRP 可用于调用](https://provision.readthedocs.io/en/tip/doc/integrations/ansible.html) [kubespray](../kubespray)，但它还提供了一个独立的 Kubernetes 安装，称为 [KRIB（Kubernetes Rebar Integrated Bootstrap）](https://github.com/digitalrebar/provision-content/tree/master/krib)。

{{< note >}}
<!--
KRIB is not a _stand-alone_ installer: Digital Rebar templates drive a standard *[kubeadm](/docs/admin/kubeadm/)* configuration that manages the Kubernetes installation with the [Digital Rebar cluster pattern](https://provision.readthedocs.io/en/tip/doc/arch/cluster.html#rs-cluster-pattern) to elect leaders _without external supervision_.
-->
KRIB 不是一个 _独立的_ 安装程序：Digital Rebar 模板驱动一个标准的 *[kubeadm](/docs/admin/kubeadm/)* 配置，使用 [Digital Rebar 集群模式](https://provision.readthedocs.io/en/tip/doc/arch/cluster.html#rs-cluster-pattern) 管理 Kubernetes 安装，_在没有外部监督的情况下_ 选举领导者。
{{< /note >}}

<!--
KRIB features:

* zero-touch, self-configuring cluster without pre-configuration or inventory
* very fast, no-ssh required automation
* bare metal, on-premises focused platform
* highly available cluster options (including splitting etcd from the controllers)
* dynamic generation of a TLS infrastructure
* composable attributes and automatic detection of hardware by profile
* options for persistent, immutable and image-based deployments
* support for Ubuntu 18.04, CentOS/RHEL 7 and others
-->
KRIB特点：

* 零接触，无需预配置或组件目录的自配置集群
* 非常快，无需 ssh 的自动化
* 关注裸机和本地部署的平台
* 高度可用的集群选项（包括将 etcd 从控制节点分离）
* 动态生成 TLS 基础架构
* 可组合属性和按配置文件自动检测硬件
* 支持基于持久存储、不可变存储和映像的部署
* 支持 Ubuntu 18.04、CentOS/RHEL 7 等

<!--
## Creating a cluster
-->
## 创建集群

<!--
Review [Digital Rebar documentation](https://https://provision.readthedocs.io/en/tip/README.html) for details about installing the platform.
-->
有关安装该平台的详细信息，请查看 [Digital Rebar 文档](https://https://provision.readthedocs.io/en/tip/README.html)。

<!--
The Digital Rebar Provision Golang binary should be installed on a Linux-like system with 16 GB of RAM or larger (Packet.net Tiny and Rasberry Pi are also acceptable).
-->
Digital Rebar Provision Golang 二进制文件应该安装在类似 Linux 的系统上，内存为 16 GB 或更大（Packet.net Tiny 和 Rasberry Pi 也可以接受）。

<!--
### (1/5) Discover servers
-->
### (1/5) 发现服务器

<!--
Following the [Digital Rebar installation](https://provision.readthedocs.io/en/tip/doc/quickstart.html), allow one or more servers to boot through the _Sledgehammer_ discovery process to register with the API. This will automatically install the Digital Rebar runner and to allow for next steps.
-->
按 [Digital Rebar 安装](https://provision.readthedocs.io/en/tip/doc/quickstart.html) 文档所给的步骤执行安装，允许一个或多个服务器通过 _Sledgehammer_ 发现过程引导以向 API 注册。 这将自动安装 Digital Rebar runner 并允许后续步骤。

<!--
### (2/5) Install KRIB Content and Certificate Plugin
-->
### (2/5) 安装 KRIB 内容和证书插件

<!--
Upload the KRIB Content bundle (or build from [source](https://github.com/digitalrebar/provision-content/tree/master/krib)) and the Cert Plugin for your DRP platform (e.g.: [amd64 Linux v2.4.0](https://s3-us-west-2.amazonaws.com/rebar-catalog/certs/v2.4.0-0-02301d35f9f664d6c81d904c92a9c81d3fd41d2c/amd64/linux/certs)). Both are freely available via the [RackN UX](https://portal.rackn.io).
-->
上传与您的 DRP 平台匹配的 KRIB 软件包（或从[源代码](https://github.com/digitalrebar/provision-content/tree/master/krib)构建）和 Cert 插件（例如：[amd64 Linux v2.4.0](https://s3-us-west-2.amazonaws.com/rebar-catalog/certs/v2.4.0-0-02301d35f9f664d6c81d904c92a9c81d3fd41d2c/amd64/linux/certs)）。两者都可以通过 [RackN UX](https://portal.rackn.io) 免费获得。

<!--
### (3/5) Start your cluster deployment
-->
### (3/5) 启动集群部署

<!--
KRIB documentation is dynamically generated from the source and will be more up to date than this guide.
-->
{{< note >}}
KRIB 文档是从源代码动态生成的，并且将比本指南更新。
{{< /note >}}

<!--
Following the [KRIB documentation](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html), create a Profile for your cluster and assign your target servers into the cluster Profile. The Profile must set `krib\cluster-name` and `etcd\cluster-name` Params to be the name of the Profile. Cluster configuration choices can be made by adding additional Params to the Profile; however, safe defaults are provided for all Params.
-->
遵循 [KRIB 文档](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)，为您的集群创建配置文件，并将目标服务器分配到集群配置文件中。 配置文件必须将 `krib\cluster-name` 和 `etcd\cluster-name` 参数（Params）设置为配置文件的名称。 可以通过向配置文件添加其他参数来进行集群配置选择; 不过所有参数都有安全的默认值。

<!--
Once all target servers are assigned to the cluster Profile, start a KRIB installation Workflow by assigning one of the included Workflows to all cluster servers. For example, selecting `krib-live-cluster` will perform an immutable deployment into the Sledgehammer discovery operating system. You may use one of the pre-created read-only Workflows or choose to build your own custom variation.
-->
将所有目标服务器分配给集群配置文件后，通过将所包含的工作流程之一分配给所有集群服务器来启动 KRIB 安装工作流程。 例如，选择 `krib-live-cluster` 将在 Sledgehammer 所发现的操作系统中执行不可变的部署。您可以使用其中一个预先创建的只读工作流，也可以选择构建自己的自定义变体。

<!--
For basic installs, no further action is required. Advanced users may choose to assign the controllers, etcd servers or other configuration values in the relevant Params.
-->
对于一般安装，无需进一步操作。高级用户可以选择在相关参数中设定控制器、etcd 服务器或其他配置值。

<!--
### (4/5) Monitor your cluster deployment
-->
### (4/5) 监控集群部署

<!--
Digital Rebar Provision provides detailed logging and live updates during the installation process. Workflow events are available via a websocket connection or monitoring the Jobs list.

During the installation, KRIB writes cluster configuration data back into the cluster Profile.
-->
Digital Rebar Provision 在安装过程中提供详细的日志记录和实时更新。通过 websocket 连接或监视作业列表可以获得工作流事件。

在安装过程中，KRIB 将集群配置数据写回集群配置文件。

<!--
### (5/5) Access your cluster
-->
### (5/5) 访问您的集群

<!--
The cluster is available for access via *kubectl* once the `krib/cluster-admin-conf` Param has been set. This Param contains the `kubeconfig` information necessary to access the cluster. 

For example, if you named the cluster Profile `krib` then the following commands would allow you to connect to the installed cluster from your local terminal.
-->
一旦设置了 `krib/cluster-admin-conf` 参数，就可以通过 *kubectl* 访问集群。 该参数包含访问集群所需的 `kubeconfig` 信息。

例如，如果您将集群配置文件命名为 `krib`，则以下命令将允许您从本地终端连接到已安装的集群。

  ::

    drpcli profiles get krib params krib/cluster-admin-conf > admin.conf
    export KUBECONFIG=admin.conf
    kubectl get nodes

<!--
The installation continues after the `krib/cluster-admin-conf` is set to install the Kubernetes UI and Helm. You may interact with the cluster as soon as the `admin.conf` file is available.
-->
在 `krib/cluster-admin-conf` 设置为安装 Kubernetes UI 和 Helm 后，安装继续。只要 `admin.conf` 文件可用，您就可以与集群进行交互。

<!--
## Cluster operations
-->
## 集群操作

<!--
KRIB provides additional Workflows to manage your cluster. Please see the [KRIB documentation](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html) for an updated list of advanced cluster operations.
-->
KRIB 提供额外的工作流来管理您的集群。有关高级集群操作的更新列表，请参阅 [KRIB 文档](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)。

<!--
### Scale your cluster
-->
### 扩展您的集群

<!--
You can add servers into your cluster by adding the cluster Profile to the server and running the appropriate Workflow.
-->
您可以通过将集群配置文件添加到服务器并运行相应的工作流来将服务器添加到集群中。

<!--
### Cleanup your cluster (for developers)
-->
### 清理集群（面向开发人员）

<!--
You can reset your cluster and wipe out all configuration and TLS certificates using the `krib-reset-cluster` Workflow on any of the servers in the cluster.
-->
您可以使用集群中任何服务器上的 `krib-reset-cluster` 工作流重置您的集群并清除所有配置和 TLS 证书。

<!--
When running the reset Workflow, be sure not to accidentally target your production cluster!
-->
{{< caution >}}
运行重置工作流程时，请小心不要指向生产集群！
{{< /caution >}}

<!--
## Feedback
-->
## 反馈

<!--
* Slack Channel: [#community](https://rackn.slack.com/messages/community/)
* [GitHub Issues](https://github.com/digital/provision/issues)
-->
* Slack Channel：[#community](https://rackn.slack.com/messages/community/)
* [GitHub 问题](https://github.com/digital/provision/issues)
