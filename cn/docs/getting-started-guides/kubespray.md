---
title: 使用 Kubespray 在基础设施或云平台上安装 Kubernetes
---



## 概述



本文介绍了如何使用 [`Kubespray`](https://github.com/kubernetes-incubator/kubespray)
工具在 GCE, Azure, OpenStack, AWS 托管的主机或者裸机上安装 Kubernetes 集群。



Kubespray 由一系列的 [Ansible](http://docs.ansible.com/) playbook、生成 [inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md) 的命令行工具以及生成 OS/Kubernetes 集群配置管理任务的专业知识构成。Kubespray 提供：



* 一个高可用集群
* 可组合的属性
* 支持主流的 Linux 发行版
* 持续集成测试



为了选择更适合项目的工具，您可以参考它跟 [kubeadm](../kubeadm) 以及 [kops](../kops) 的[对比说明](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md)。



## 创建集群



### (1/5) 确保满足承载[要求](https://github.com/kubernetes-incubator/kubespray#requirements)



配置服务器有以下要求：



* `Ansible v2.3` (或更新版本) 
* `Jinja 2.9` (或更新版本) 



* `python-netaddr`  需要安装在可以运行命令行的机器上



* 目标服务器必须能够访问互联网，才能拉取 docker 境像



* 目标服务器配置为允许 IPv4 发送



* 目标服务器通过 SSH 连接（tcp / 22）直接连接到您的节点或通过 bastion host/ssh 跳转框



* 目标服务器需要有特权用户



* 您的 SSH 密钥必须复制到您 inventory 上的所有服务器



* 正确配置防火墙规则，保证让 Ansible 和 Kubernetes 组件可以通信



* 如果使用云，则必须具有相应的可用凭据并导出为环境变量



Kubespray 提供了以下工具来帮助准备环境：



* 以下云平台提供的 [Terraform](https://www.terraform.io/) 脚本:
  * [AWS](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
* [kubespray-cli](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md)



**注意:** kubespray-cli 不再积极维护。
{. :note}



### (2/5) 编写 inventory 文件



配置服务器后，为 [Ansible 创建 inventory 文件](http://docs.ansible.com/ansible/intro_inventory.html)。您可以手动或通过动态 inventory 脚本来执行此操作。更多详细信息，请参阅"[创建您自己的 inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)"。



### (3/5) 规划集群部署



Kubespray 允许自定义部署以下方面:



* CNI (网络)插件
* DNS 配置
* 控制面板的选择：本机/二进制或通过 docker 或 rkt 集装箱
* 组件控制
* Calico 路由反射器
* 组件运行时选项
* 证书生成方式



可以对 [variable 文件](http://docs.ansible.com/ansible/playbooks_variables.html)使用 Kubespray 自定义。如果您刚刚开始使用 Kubespray ，请考虑使用 Kubespray 默认配置来部署集群更多了解 Kubernetes 。



### (4/5) 部署集群



接下来，使用以下两种方法之一部署群集：



* 方法一：[ansible-playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)
* 方法二：[kubespray-cli 工具](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md) 



**注意:** kubespray-cli 不再积极维护。
{. :note}



两种方法都运行默认的[集群定义文件](https://github.com/kubernetes-incubator/kubespray/blob/master/cluster.yml)。



大型部署（100个以上节点）可能需要进行[特定调整](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md) 优化配置。



### (5/5) 验证部署



Kubespray 提供了通过 [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md) 验证 inter-pod 连通性 与 DNS 解析的方法。Netchecker 可以确保 netchecker-agents 的 pod 可以解析 DNS 请求，并在默认命名空间内 ping 通。这些 pod 模仿其他工作负载的类似行为，并充当群集健康指标。



## 集群操作



Kubespray 提供了一些脚本来管理集群：_scale_  和  _upgrade_ 。



### 扩展集群



可以通过运行扩展脚本来扩展集群。更多信息，请参考"[扩展节点](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#Adding-nodes)"。



### 升级集群



可以通过运行 upgrade-cluster 脚本升级集群。更多信息，请参考[升级手册](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/upgrades.md)"。



## 下一步

检查 Kubespray [roadmap](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md) 上的计划工作.



## 清理集群

可以使用 [reset 命令](https://github.com/kubernetes-incubator/kubespray/blob/master/reset.yml)重置节点和清除使用 Kubespray 安装的所有组件。

**注意:** 使用 reset 命令时，确保不是生产集群！
{. :caution}



## 反馈

* Slack 通道: [kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub 问题](https://github.com/kubernetes-incubator/kubespray/issues)
