---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: セットアップ
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

このページを使い、ご自身のニーズに最も適したソリューションを見つけてください。

Kubernetesをどこで実行するかは、利用可能なリソースと必要な柔軟性によって異なります。ノートPCからクラウドプロバイダのVM、ベアメタルのラックまで、ほぼどのような場所でもKubernetesを実行できます。単一のコマンドを実行して完全に管理されたクラスタを設定したり、ベアメタルで独自にカスタマイズしたクラスタを作成したりすることもできます。

{{% /capture %}}

{{% capture body %}}

## ローカルマシンのソリューション

ローカルマシンソリューションは、Kubernetesを使い始めるための簡単な方法です。クラウドリソースと、割当量の消費を気にせずにKubernetesクラスタを作成してテストできます。

もし以下のようなことを実現したいのであれば、ローカルマシンソリューションを選ぶべきです:

* Kubernetesの検証や勉強
* ローカルでのクラスタの開発やテスト

[ローカルマシンソリューション](/docs/setup/pick-right-solution/#local-machine-solutions)を選ぶ。

## Hosted Solutions

Hosted solutions are a convenient way to create and maintain Kubernetes clusters. They 
manage and operate your clusters so you don’t have to.  

You should pick a hosted solution if you:

* Want a fully-managed solution
* Want to focus on developing your apps or services  
* Don’t have dedicated site reliability engineering (SRE) team but want high availability
* Don't have resources to host and monitor your clusters 

Pick a [hosted solution](/docs/setup/pick-right-solution/#hosted-solutions).

## Turnkey – Cloud Solutions


These solutions allow you to create Kubernetes clusters with only a few commands and 
are actively developed and have active community support. They can also be hosted on 
a range of Cloud IaaS providers, but they offer more freedom and flexibility in 
exchange for effort. 

You should pick a turnkey cloud solution if you:

* Want more control over your clusters than the hosted solutions allow
* Want to take on more operations ownership 

Pick a [turnkey cloud solution](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)

## Turnkey – On-Premises Solutions

These solutions allow you to create Kubernetes clusters on your internal, secure,
cloud network with only a few commands.

You should pick a on-prem turnkey cloud solution if you:

* Want to deploy clusters on your private cloud network
* Have a dedicated SRE team
* Have the resources to host and monitor your clusters

Pick an [on-prem turnkey cloud solution](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).

## Custom Solutions

Custom solutions give you the most freedom over your clusters but require the 
most expertise. These solutions range from bare-metal to cloud providers on 
different operating systems.

Pick a [custom solution](/docs/setup/pick-right-solution/#custom-solutions).

{{% /capture %}}

{{% capture whatsnext %}}
Go to [Picking the Right Solution](/docs/setup/pick-right-solution/) for a complete
list of solutions.
{{% /capture %}}
