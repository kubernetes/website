---
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps 不僅會幫助你創建、銷燬、升級和維護生產級、高可用性的 Kubernetes 叢集，
  還會提供必要的雲基礎設施。

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
`kOps` 不僅會幫助你創建、銷燬、升級和維護生產級、高可用性的 Kubernetes 叢集，
還會提供必要的雲基礎設施。

<!--more--> 

{{< note >}}
<!--
AWS (Amazon Web Services) is currently officially supported, with DigitalOcean, GCE and OpenStack in beta support, and Azure in alpha.
-->	
目前正式支持 AWS（Amazon Web Services），DigitalOcean、GCE 和 OpenStack
處於 beta 支持階段，Azure 處於 alpha 階段。
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
`kOps` 是一個自動化的製備系統：
  * 全自動安裝流程
  * 使用 DNS 識別叢集
  * 自我修復：一切都在自動擴縮組中運行
  * 支持多種操作系統（Amazon Linux、Debian、Flatcar、RHEL、Rocky 和 Ubuntu）
  * 支持高可用
  * 可以直接提供或者生成 terraform 清單