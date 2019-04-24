---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: 设置
main_menu: true
weight: 30
content_template: templates/concept
---

<!--
---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Setup
main_menu: true
weight: 30
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
Use this page to find the type of solution that best fits your needs.
-->
在这个页面可以找到最适合您以及您需要的解决方案类型。

<!--
Deciding where to run Kubernetes depends on what resources you have available
and how much flexibility you need. You can run Kubernetes almost anywhere,
from your laptop to VMs on a cloud provider to a rack of bare metal servers.
You can also set up a fully-managed cluster by running a single command or craft
your own customized cluster on your bare metal servers.
-->
Kubernetes 在何处运行取决于您拥有什么资源以及您需要多大的灵活性。您几乎可以在任何地方运行 Kubernetes，
从笔记本电脑到云服务提供商的虚拟机，再到一排裸金属服务器。您还可以通过运行单个命令来设置完全
托管的集群，或者在裸金属服务器上创建您自己的定制集群。

{{% /capture %}}

{{% capture body %}}

<!--
## Local-machine Solutions
-->

## 本地机器解决方案

<!--
A local-machine solution is an easy way to get started with Kubernetes. You
can create and test Kubernetes clusters without worrying about consuming cloud
resources and quotas.
-->
本地机器解决方案是开始使用 Kubernetes 的一种简单的方法。您可以创建和测试 Kubernetes 集群，而不必担心消耗云资源和配额。

<!--
You should pick a local solution if you want to:
-->
你应该选择一个本地解决方案，如果您想：

<!--
* Try or start learning about Kubernetes
* Develop and test clusters locally
-->

* 尝试或开始了解 Kubernetes
* 在本地开发和测试集群

<!--
Pick a [local-machine solution](/docs/setup/pick-right-solution/#local-machine-solutions).
-->
选择[本地机器解决方案](/docs/setup/pick-right-solution/#local-machine-solutions)。

<!--
## Hosted Solutions
-->
## 托管解决方案

<!--
Hosted solutions are a convenient way to create and maintain Kubernetes clusters. They
manage and operate your clusters so you don’t have to.
-->
托管解决方案是创建和维护 Kubernetes 集群的一种实用的方法。他们管理和操作您的集群，所以您不需要。

<!--
You should pick a hosted solution if you:
-->
您应该选择一个托管解决方案，如果您需要：

<!--
* Want a fully-managed solution
* Want to focus on developing your apps or services
* Don’t have dedicated site reliability engineering (SRE) team but want high availability
* Don't have resources to host and monitor your clusters 
-->

* 想要一个完全托管的解决方案
* 希望专注于开发您的应用或者服务
* 没有专门的可靠的工程(SRE)团队，但需要高可用
* 没有资源来托管和监视集群

<!--
Pick a [hosted solution](/docs/setup/pick-right-solution/#hosted-solutions).
-->
选择[托管解决方案](/docs/setup/pick-right-solution/#hosted-solutions)。

<!--
## Turnkey – Cloud Solutions
-->

## 一站式云解决方案

<!--
These solutions allow you to create Kubernetes clusters with only a few commands and 
are actively developed and have active community support. They can also be hosted on 
a range of Cloud IaaS providers, but they offer more freedom and flexibility in 
exchange for effort. 
-->
这些解决方案允许您仅使用几个命令创建 Kubernetes 集群，这些集群是积极开发的，并且得到了社区的支持。
它们也可以托管在一系列云服务 IaaS 提供商上，它们提供了更多的自由和灵活性来换取工作量。

<!--
You should pick a turnkey cloud solution if you
-->
您应该选择一个一站式云服务解决方案，如果您需要：

<!--
* Want more control over your clusters than the hosted solutions allow
* Want to take on more operations ownership
-->

* 希望对集群拥有比托管解决方案更多的控制
* 希望拥有更多的运营所有权

<!--
Pick a [turnkey cloud solution](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)
-->
选择[一站式云服务解决方案](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)。

<!--
## Turnkey – On-Premises Solutions
-->

## 一站式本地解决方案

<!--
These solutions allow you to create Kubernetes clusters on your internal, secure,
cloud network with only a few commands.
-->
这些解决方案允许您在您的内部、安全的云网络上创建 Kubernetes 集群，只需要几个命令。

<!--
You should pick a on-prem turnkey cloud solution-
-->

您应该选择一个一站式本地解决方案，如果您需要：

<!--
* Want to deploy clusters on your private cloud network
* Have a dedicated SRE team
* Have the resources to host and monitor your clusters
-->

* 希望在您的私有云网络上部署集群
* 有一个专门的 SRE 团队
* 拥有托管和监视集群的资源

<!--
Pick an [on-prem turnkey cloud solution](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).
-->
选择[一站式本地云服务解决方案](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions)。

<!--
## Custom Solutions
-->

## 定制解决方案

<!--
Custom solutions give you the most freedom over your clusters but require the
most expertise. These solutions range from bare-metal to cloud providers on
different operating systems.
-->
定制解决方案为您的集群提供了最大的自由度，但需要最多的专业知识。这些解决方案涵盖了从裸金属到不同操作系统上的云服务提供商。

<!--
Pick a [custom solution](/docs/setup/pick-right-solution/#custom-solutions).
-->
选择[定制解决方案](/docs/setup/pick-right-solution/#custom-solutions)。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
Go to [Picking the Right Solution](/docs/setup/pick-right-solution/) for a complete
list of solutions.
-->

转到完整的解决方案列表选择[正确的解决方案](/docs/setup/pick-right-solution/)。
{{% /capture %}}




