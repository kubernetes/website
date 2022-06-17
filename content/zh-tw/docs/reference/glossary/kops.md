---
title: Kops
id: kops
date: 2018-04-12
full_link: /docs/getting-started-guides/kops/
short_description: >
  kops 是一個命令列工具，可以幫助您建立、銷燬、升級和維護生產級，高可用性的 Kubernetes 叢集。
  
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

kops 是一個命令列工具，可以幫助您建立、銷燬、升級和維護生產級，高可用性的 Kubernetes 叢集。

<!--more--> 

<!--
{{< note >}}
kops has general availability support only for AWS.
Support for using kops with GCE and VMware vSphere are in alpha.
{{< /note >}}
-->												   
注意：官方僅支援 AWS，GCE 和 VMware vSphere 的支援還處於 alpha* 階段。																
			 

<!--
`kops` provisions your cluster with&#58;

  * Fully automated installation
  * DNS-based cluster identification
  * Self-healing&#58; everything runs in Auto-Scaling Groups
  * Limited OS support (Debian preferred, Ubuntu 16.04 supported, early support for CentOS & RHEL)
  * High availability (HA) support
  * The ability to directly provision, or to generate Terraform manifests
-->

`kops` 為你的叢集提供了：

  * 全自動化安裝
  * 基於 DNS 的叢集標識
  * 自愈功能：所有元件都在自動伸縮組（Auto-Scaling Groups）中執行
  * 有限的作業系統支援 (推薦使用 Debian，支援 Ubuntu 16.04，試驗性支援 CentOS & RHEL)
  * 高可用 (HA) 支援
  * 直接提供或者生成 Terraform 清單檔案的能力

<!--
You can also build your own cluster using {{< glossary_tooltip term_id="kubeadm" >}} as a building block. `kops` builds on the kubeadm work.
-->

你也可以將自己的叢集作為一個構造塊，使用 {{< glossary_tooltip term_id="kubeadm" >}} 構造叢集。
`kops` 是建立在 kubeadm 之上的。
