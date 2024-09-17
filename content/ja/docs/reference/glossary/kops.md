---
title: kOps (Kubernetesオペレーション)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOpsは、プロダクション・グレードで可用性の高いKubernetesクラスタの作成、破棄、アップグレード、保守を支援するだけでなく、必要なクラウド・インフラストラクチャのプロビジョニングも行います。
aka: 
tags:
- tool
- operation
---

`kOps`は、プロダクショングレードで可用性の高いKubernetesクラスタの作成、破棄、アップグレード、保守を支援するだけでなく、必要なクラウドインフラストラクチャのプロビジョニングも行います。

<!--more--> 

{{< note >}}
現在、AWS（Amazon Web Services）が正式にサポートされており、DigitalOcean、GCE、OpenStackはベータ版、Azureはアルファ版でサポートされています。
{{< /note >}}

`kOps`は自動化されたプロビジョニング・システムです:
* 完全に自動化されたインストール
* クラスタの識別にDNSを使用
* セルフヒーリング：すべてがAuto-Scaling Groupsで実行されます。
* 複数のOSをサポート（Amazon Linux、Debian、Flatcar、RHEL、Rocky、Ubuntu）
* 高可用性サポート
* 直接プロビジョニングまたはテラフォームマニフェストの生成が可能
