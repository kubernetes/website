---
title: kOps(Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOpsは、プロダクショングレードの高可用性のあるKubernetesクラスターの作成、破棄、アップグレード、メンテナンスを支援するだけでなく、それに必要なクラウドインフラストラクチャのプロビジョニングも行います。
aka: 
tags:
- tool
- operation
---

`kOps`は、プロダクショングレードの高可用性のあるKubernetesクラスターの作成、破棄、アップグレード、メンテナンスを支援するだけでなく、それに必要なクラウドインフラストラクチャのプロビジョニングも行います。

<!--more--> 

{{< note >}}
AWS(アマゾンウェブサービス)が現在公式にサポートされており、DigitalOcean、GCE、およびOpenStackはベータレベル、Azureはアルファレベルでサポートされています。
{{< /note >}}

`kOps`は、以下の機能を備えた自動プロビジョニングシステムです:
  * インストールの完全な自動化
  * DNSを使用したクラスターの識別
  * 自動修復: すべてをAuto Scalingグループで実行
  * 複数OSのサポート(Amazon Linux、Debian、Flatcar、RHEL、Rocky、Ubuntu)
  * 高可用性のサポート
  * 直接プロビジョニング、またはTerraformマニフェストの生成