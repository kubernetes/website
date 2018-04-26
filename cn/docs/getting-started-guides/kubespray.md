---
title: 使用 Kubespray 在基础设施或云平台上安装 Kubernetes
---

<!--
## Overview
-->

## 概述

<!--
This quickstart helps to install a Kubernetes cluster hosted on GCE, Azure, OpenStack, AWS, or Baremetal with [Kubespray](https://github.com/kubernetes-incubator/kubespray).
-->

本文介绍了如何使用 [`Kubespray`](https://github.com/kubernetes-incubator/kubespray)
工具在 GCE, Azure, OpenStack, AWS 托管的主机或者裸机上安装 Kubernetes 集群。

<!--
Kubespray is a composition of [Ansible](http://docs.ansible.com/) playbooks, [inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md), provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration management tasks. Kubespray provides:
-->

Kubespray 由一系列的 [Ansible](http://docs.ansible.com/) playbook、生成 [inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md) 的命令行工具以及生成 OS/Kubernetes 集群配置管理任务的专业知识构成。Kubespray 提供：

<!--
* a highly available cluster
* composable attributes
* support for most popular Linux distributions
* continuous integration tests
-->

* 一个高可用集群
* 可组合的属性
* 支持主流的 Linux 发行版
* 持续集成测试

<!--
To choose a tool which best fits your use case, read [this comparison](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md) to [kubeadm](../kubeadm) and [kops](../kops).
-->

为了选择更适合项目的工具，您可以参考它跟 [kubeadm](../kubeadm) 以及 [kops](../kops) 的[对比说明](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md)。

<!--
## Creating a cluster
-->

## 创建集群

<!--
### (1/5) Meet the underlay [requirements](https://github.com/kubernetes-incubator/kubespray#requirements)
-->

### (1/5) 确保满足承载[要求](https://github.com/kubernetes-incubator/kubespray#requirements)

<!--
Provision servers with the following requirements:
-->

配置服务器有以下要求：

<!--
* `Ansible v2.3` (or newer) 
* `Jinja 2.9` (or newer) 
-->

* `Ansible v2.3` (或更新版本) 
* `Jinja 2.9` (或更新版本) 

<!--
* `python-netaddr` installed on the machine that running Ansible commands
-->

* `python-netaddr`  需要安装在可以运行命令行的机器上

<!--
* Target servers must have access to the Internet in order to pull docker images
-->

* 目标服务器必须能够访问互联网，才能拉取 docker 境像

<!--
* Target servers are configured to allow IPv4 forwarding
-->

* 目标服务器配置为允许 IPv4 发送

<!--
* Target servers have SSH connectivity ( tcp/22 ) directly to your nodes or through a bastion host/ssh jump box
-->

* 目标服务器通过 SSH 连接（tcp / 22）直接连接到您的节点或通过 bastion host/ssh 跳转框

<!--
* Target servers have a privileged user
-->

* 目标服务器需要有特权用户

<!--
* Your SSH key must be copied to all the servers that are part of your inventory
-->

* 您的 SSH 密钥必须复制到您 inventory 上的所有服务器

<!--
* Firewall rules configured properly to allow Ansible and Kubernetes components to communicate 
-->

* 正确配置防火墙规则，保证让 Ansible 和 Kubernetes 组件可以通信

<!--
* If using a cloud provider, you must have the appropriate credentials available and exported as environment variables
-->

* 如果使用云，则必须具有相应的可用凭据并导出为环境变量

<!--
Kubespray provides the following utilities to help provision your environment:
-->

Kubespray 提供了以下工具来帮助准备环境：

<!--
* [Terraform](https://www.terraform.io/) scripts for the following cloud providers:
  * [AWS](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
* [kubespray-cli](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md)
-->

* 以下云平台提供的 [Terraform](https://www.terraform.io/) 脚本:
  * [AWS](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
* [kubespray-cli](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md)

<!--
**Note:** kubespray-cli is no longer actively maintained.
{. :note}
-->

**注意:** kubespray-cli 不再积极维护。
{. :note}

<!--
### (2/5) Compose an inventory file
-->

### (2/5) 编写 inventory 文件

<!--
After you provision your servers, create an [inventory file for Ansible](http://docs.ansible.com/ansible/intro_inventory.html). You can do this manually or via a dynamic inventory script. For more information, see "[Building your own inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)". 
-->

配置服务器后，为 [Ansible 创建 inventory 文件](http://docs.ansible.com/ansible/intro_inventory.html)。您可以手动或通过动态 inventory 脚本来执行此操作。更多详细信息，请参阅"[创建您自己的 inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)"。

<!--
### (3/5) Plan your cluster deployment
-->

### (3/5) 规划集群部署

<!--
Kubespray provides the ability to customize many aspects of the deployment:
-->

Kubespray 允许自定义部署以下方面:

<!--
* CNI (networking) plugins
* DNS configuration
* Choice of control plane: native/binary or containerized with docker or rkt)
* Component versions
* Calico route reflectors
* Component runtime options
* Certificate generation methods
-->

* CNI (网络)插件
* DNS 配置
* 控制面板的选择：本机/二进制或通过 docker 或 rkt 集装箱
* 组件控制
* Calico 路由反射器
* 组件运行时选项
* 证书生成方式

<!--
Kubespray customizations can be made to a [variable file](http://docs.ansible.com/ansible/playbooks_variables.html). If you are just getting started with Kubespray, consider using the Kubespray defaults to deploy your cluster and explore Kubernetes.
-->

可以对 [variable 文件](http://docs.ansible.com/ansible/playbooks_variables.html)使用 Kubespray 自定义。如果您刚刚开始使用 Kubespray ，请考虑使用 Kubespray 默认配置来部署集群更多了解 Kubernetes 。

<!--
### (4/5) Deploy a Cluster
-->

### (4/5) 部署集群

<!--
Next, deploy your cluster with one of two methods:
-->

接下来，使用以下两种方法之一部署群集：

<!--
* [ansible-playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).
* [kubespray-cli tool](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md) 
-->

* 方法一：[ansible-playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)
* 方法二：[kubespray-cli 工具](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md) 

<!--
**Note:** kubespray-cli is no longer actively maintained.
{. :note}
-->

**注意:** kubespray-cli 不再积极维护。
{. :note}

<!--
Both methods run the default [cluster definition file](https://github.com/kubernetes-incubator/kubespray/blob/master/cluster.yml).
-->

两种方法都运行默认的[集群定义文件](https://github.com/kubernetes-incubator/kubespray/blob/master/cluster.yml)。

<!--
Large deployments (100+ nodes) may require [specific adjustments](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md) for best results.
-->

大型部署（100个以上节点）可能需要进行[特定调整](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md) 优化配置。

<!--
### (5/5) Verify the deployment
-->

### (5/5) 验证部署

<!--
Kubespray provides a way to verify inter-pod connectivity and DNS resolve with [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md). Netchecker ensures the netchecker-agents pods can resolve DNS requests and ping each over within the default namespace. Those pods mimic similar behavior of the rest of the workloads and serve as cluster health indicators.
-->

Kubespray 提供了通过 [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md) 验证 inter-pod 连通性 与 DNS 解析的方法。Netchecker 可以确保 netchecker-agents 的 pod 可以解析 DNS 请求，并在默认命名空间内 ping 通。这些 pod 模仿其他工作负载的类似行为，并充当群集健康指标。

<!--
## Cluster operations
-->

## 集群操作

<!--
Kubespray provides additional playbooks to manage your cluster: _scale_ and _upgrade_.
-->

Kubespray 提供了一些脚本来管理集群：_scale_  和  _upgrade_ 。

<!--
### Scale your cluster
-->

### 扩展集群

<!--
You can scale your cluster by running the scale playbook. For more information, see "[Adding nodes](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#Adding-nodes)". 
-->

可以通过运行扩展脚本来扩展集群。更多信息，请参考"[扩展节点](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#Adding-nodes)"。

<!--
### Upgrade your cluster
-->

### 升级集群

<!--
You can upgrade your cluster by running the upgrade-cluster playbook. For more information, see "[Upgrades](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/upgrades.md)". 
-->

可以通过运行 upgrade-cluster 脚本升级集群。更多信息，请参考[升级手册](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/upgrades.md)"。

<!--
## What's next

Check out planned work on Kubespray's [roadmap](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md).
-->

## 下一步

检查 Kubespray [roadmap](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md) 上的计划工作.

<!--
## Cleanup

You can reset your nodes and wipe out all components installed with Kubespray via the [reset playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/reset.yml).

**Caution:** When running the reset playbook, be sure not to accidentally target your production cluster!
{. :caution}
-->

## 清理集群

可以使用 [reset 命令](https://github.com/kubernetes-incubator/kubespray/blob/master/reset.yml)重置节点和清除使用 Kubespray 安装的所有组件。

**注意:** 使用 reset 命令时，确保不是生产集群！
{. :caution}

<!--
## Feedback

* Slack Channel: [#kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub Issues](https://github.com/kubernetes-incubator/kubespray/issues)
-->

## 反馈

* Slack 通道: [kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub 问题](https://github.com/kubernetes-incubator/kubespray/issues)
