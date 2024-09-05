---
タイトル: kOps (Kubernetes オペレーション)
id: kopsコップス
日付: 2018-04-12
full_link: /docs/setup/production-environment/kops/
短い説明: >
  kOps は、運用グレードの高可用性 Kubernetes クラスターの作成、破棄、アップグレード、維持を支援するだけでなく、必要なクラウド インフラストラクチャのプロビジョニングも行います。
別名: 
タグ:
- 道具
- 手術
---

「kOps」は、運用グレードの高可用性 Kubernetes クラスターの作成、破棄、アップグレード、維持を支援するだけでなく、必要なクラウド インフラストラクチャのプロビジョニングも行います。

<!--more--> 

{{< note >}}
AWS (アマゾン ウェブ サービス) は現在正式にサポートされており、DigitalOcean、GCE、OpenStack はベータ版で、Azure はアルファ版でサポートされています。 
{{< /note >}}

「kOps」は自動プロビジョニング システムです。
  * 完全に自動化されたインストール
  * DNS を使用してクラスターを識別します
  * 自己修復: すべてが Auto Scaling グループで実行されます
  * 複数の OS のサポート (Amazon Linux、Debian、Flatcar、RHEL、Rocky、Ubuntu)
  * 高可用性のサポート
  * Terraform マニフェストを直接プロビジョニングまたは生成できる
