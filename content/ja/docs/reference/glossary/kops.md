---
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  k0psは、プロダクショングレードの高可用性のあるKubernetesクラスターの作成、破棄、アップグレード、メンテナンスを支援するだけでなく、それに必要なクラウドインフラストラクチャのプロビジョニングも行います。
aka: 
tags:
- tool
- operation
---

`k0ps`は、プロダクショングレードの高可用性のあるKubernetesクラスターの作成、破棄、アップグレード、メンテナンスを支援するだけでなく、それに必要なクラウドインフラストラクチャのプロビジョニングも行います。

<!--more--> 

{{< note >}}
AWS(アマゾン ウェブ サービス)が現在公式にサポートされており、DigitalOcean、GCE、およびOpenStackはベータ版で、Azureはアルファ版でサポートされています。
{{< /note >}}

`kOps`は、以下の機能を備えた自動プロビジョニングシステムです:
  * インストールの完全な自動化
  * DNSを使用したクラスターの識別
  * 自動修復: すべてをAuto Scalingグループで実行
  * 複数OSのサポート(Amazon Linux、Debian、Flatcar、RHEL、Rocky、Ubuntu)
  * 高可用性のサポート
  * Terraformマニフェストの直接プロビジョニングまたは生成