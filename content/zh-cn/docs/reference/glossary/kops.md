---
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps 不仅会帮助你创建、销毁、升级和维护生产级、高可用性的 Kubernetes 集群，
  还会提供必要的云基础设施。

aka: 
tags:
- tool
- operation
---
<!--
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps will not only help you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes cluster, but it will also provision the necessary cloud infrastructure.

aka: 
tags:
- tool
- operation
-->

<!--
`kOps` will not only help you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes cluster, but it will also provision the necessary cloud infrastructure.
-->
`kOps` 不仅会帮助你创建、销毁、升级和维护生产级、高可用性的 Kubernetes 集群，
还会提供必要的云基础设施。

<!--more--> 

{{< note >}}
<!--
AWS (Amazon Web Services) is currently officially supported, with DigitalOcean, GCE and OpenStack in beta support, and Azure in alpha.
-->	
目前正式支持 AWS（Amazon Web Services），DigitalOcean、GCE 和 OpenStack
处于 beta 支持阶段，Azure 处于 alpha 阶段。
{{< /note >}}

<!--
`kOps` is an automated provisioning system:
  * Fully automated installation
  * Uses DNS to identify clusters
  * Self-healing: everything runs in Auto-Scaling Groups
  * Multiple OS support (Amazon Linux, Debian, Flatcar, RHEL, Rocky and Ubuntu)
  * High-Availability support
  * Can directly provision, or generate terraform manifests
-->
`kOps` 是一个自动化的制备系统：
  * 全自动安装流程
  * 使用 DNS 识别集群
  * 自我修复：一切都在自动扩缩组中运行
  * 支持多种操作系统（Amazon Linux、Debian、Flatcar、RHEL、Rocky 和 Ubuntu）
  * 支持高可用
  * 可以直接提供或者生成 terraform 清单