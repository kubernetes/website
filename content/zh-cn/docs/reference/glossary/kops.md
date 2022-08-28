---
title: Kops
id: kops
date: 2018-04-12
full_link: /docs/getting-started-guides/kops/
short_description: >
  kops 是一个命令行工具，可以帮助您创建、销毁、升级和维护生产级，高可用性的 Kubernetes 集群。
  
aka: 
tags:
- tool
- operation
---

<!--
---
title: Kops
id: kops
date: 2018-04-12
full_link: /docs/getting-started-guides/kops/
short_description: >
  A CLI tool that helps you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes clusters.

aka: 
tags:
- tool
- operation
---
-->

<!--
 A CLI tool that helps you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes clusters.
-->

kops 是一个命令行工具，可以帮助您创建、销毁、升级和维护生产级，高可用性的 Kubernetes 集群。

<!--more--> 

<!--
kops has general availability support only for AWS.
Support for using kops with GCE and VMware vSphere are in alpha.
-->	
{{< note >}}
注意：官方仅支持 AWS。对 GCE 和 VMware vSphere 的支持还处于 Alpha 阶段。
{{< /note >}}

<!--
`kops` provisions your cluster with&#58;

  * Fully automated installation
  * DNS-based cluster identification
  * Self-healing&#58; everything runs in Auto-Scaling Groups
  * Limited OS support (Debian preferred, Ubuntu 16.04 supported, early support for CentOS & RHEL)
  * High availability (HA) support
  * The ability to directly provision, or to generate Terraform manifests
-->

`kops` 为你的集群提供了：

  * 全自动化安装
  * 基于 DNS 的集群标识
  * 自愈功能：所有组件都在自动扩缩组（Auto-Scaling Groups）中运行
  * 有限的操作系统支持 (推荐使用 Debian，支持 Ubuntu 16.04，试验性支持 CentOS & RHEL)
  * 高可用 (HA) 支持
  * 直接提供或者生成 Terraform 清单文件的能力

<!--
You can also build your own cluster using {{< glossary_tooltip term_id="kubeadm" >}} as a building block. `kops` builds on the kubeadm work.
-->

你也可以将自己的集群作为一个构造块，使用 {{< glossary_tooltip term_id="kubeadm" >}} 构造集群。
`kops` 是建立在 kubeadm 之上的。
