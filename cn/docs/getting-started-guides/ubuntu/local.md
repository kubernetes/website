---
cn-approvers:
- tianshapjq
title: 通过 LXD 实现 Kubernetes 本地开发
---
<!--
---
title: Local Kubernetes development with LXD
---
-->

{% capture overview %}
<!--
Running Kubernetes locally has obvious development advantages, such as lower cost and faster iteration than constantly deploying and tearing down clusters on a public cloud. Ideally, a Kubernetes developer can spawn all necessary nodes inside local containers and test new configurations as they are committed. This page will show you how to deploy a cluster to LXD containers on a local machine.
-->
在本地运行 Kubernetes 比在公有云上部署和移除集群具有明显的开发优势，如更低的成本和更快的迭代。 理想情况下，Kubernetes 开发人员可以在本地容器内产生所有必需的节点，并在提交时测试新的配置。本文将向您展示如何将集群部署到本地机器上的 LXD 容器。
{% endcapture %}

<!--
The purpose of using [LXD](https://linuxcontainers.org/lxd/) on a local machine is to emulate the same deployment that a user would use in a cloud or bare metal. Each node is treated as a machine, with the same characteristics as production. Each node is a separate container, which runs Docker containers and `kubectl` inside (see [Cluster Intro](/docs/tutorials/kubernetes-basics/cluster-intro/) for more info).
-->
在本地机器上使用 [LXD](https://linuxcontainers.org/lxd/) 的目的是为了模拟用户在云或裸机中部署的环境。每个节点都被视为一台机器，具有与生产环境相同的特性。 每个节点都是一个单独的容器，它在里面运行 Docker 容器和 `kubectl`（更多信息请参阅 [集群简介](/docs/tutorials/kubernetes-basics/cluster-intro/)）。

{% capture prerequisites %}
<!--
Install [conjure-up](http://conjure-up.io/), a tool for deploying big software.
Add the current user to the `lxd` user group.
-->
安装 [conjure-up](http://conjure-up.io/)，这是一个用来部署大型软件的工具。
将当前用户添加到 `lxd` 用户组中。
    
```
sudo snap install conjure-up --classic
sudo usermod -a -G lxd $(whoami)
```

<!--
Note: If conjure-up asks you to "Setup an ipv6 subnet" with LXD, answer NO. ipv6 with Juju/LXD is currently unsupported.
-->
注意：如果 conjure-up 要求您在 LXD 上 "配置一个 ipv6 子网"，请选择 NO。目前还不支持在 Juju/LXD 上使用 ipv6。
{% endcapture %}

{% capture steps %}
<!--
## Deploying Kubernetes

Start the deployment with:
-->
## 部署 Kubernetes

通过以下命令启动部署：

    conjure-up kubernetes

<!--
For this walkthrough we are going to create a new controller - select the `localhost` Cloud type:

![Select Cloud](/images/docs/ubuntu/00-select-cloud.png)
-->
对于本教程我们将会创建一个新的控制器 - 选择 `localhost` 云类型：

![选择云类型](/images/docs/ubuntu/00-select-cloud.png)

<!--
Deploy the applications:

![Deploy Applications](/images/docs/ubuntu/01-deploy.png)
-->
部署应用：

![部署应用](/images/docs/ubuntu/01-deploy.png)

<!--
Wait for Juju bootstrap to finish:

![Bootstrap](/images/docs/ubuntu/02-bootstrap.png)
-->
等待 Juju 引导结束：

![引导](/images/docs/ubuntu/02-bootstrap.png)

<!--
Wait for our Applications to be fully deployed:

![Waiting](/images/docs/ubuntu/03-waiting.png)
-->
等待应用被完全部署：

![等待](/images/docs/ubuntu/03-waiting.png)

<!--
Run the final post-processing steps to automatically configure your Kubernetes environment:

![Postprocessing](/images/docs/ubuntu/04-postprocessing.png)
-->
执行最终的后处理步骤来自动配置 Kubernetes 环境：

![后处理](/images/docs/ubuntu/04-postprocessing.png)

<!--
Review the final summary screen:

![Final Summary](/images/docs/ubuntu/05-final-summary.png)
-->
查看最终的摘要信息：

![最终的摘要](/images/docs/ubuntu/05-final-summary.png)

<!--
## Accessing the Cluster 

You can access your Kubernetes cluster by running the following:
-->
## 访问集群

您可以通过运行以下命令来访问 Kubernetes 集群：    
    
    kubectl --kubeconfig=~/.kube/config
    
<!--
Or if you've already run this once it'll create a new config file as shown in the summary screen.
-->
或者如果您已经运行过一次，它将创建一个新的配置文件，如摘要信息所示。    
    
    kubectl --kubeconfig=~/.kube/config.conjure-up
    
{% endcapture %}

{% include templates/task.md %}

