---
title: クラスターのネットワーク
content_type: concept
weight: 50
---

<!-- overview -->
ネットワークはKubernetesにおける中心的な部分ですが、どのように動作するかを正確に理解することは難解な場合もあります。
Kubernetesには、4つの異なる対応すべきネットワークの問題があります:

1. 高度に結合されたコンテナ間の通信: これは、{{< glossary_tooltip text="Pod" term_id="pod" >}}および`localhost`通信によって解決されます。
2. Pod間の通信: 本ドキュメントの主な焦点です。
3. Podからサービスへの通信: これは[Service](/ja/docs/concepts/services-networking/service/)でカバーされています。
4. 外部からサービスへの通信: これは[Service](/ja/docs/concepts/services-networking/service/)でカバーされています。

<!-- body -->

Kubernetesは、言ってしまえばアプリケーション間でマシンを共有するためのものです。通常、マシンを共有するには、2つのアプリケーションが同じポートを使用しないようにする必要があります。
複数の開発者間でのポートの調整は、大規模に行うことが非常に難しく、ユーザーが制御できないクラスターレベルの問題に直面することになります。

動的ポート割り当てはシステムに多くの複雑さをもたらします。すべてのアプリケーションはポートをフラグとして受け取らなければならない、APIサーバーは設定ブロックに動的ポート番号を挿入する方法を知っていなければならない、各サービスは互いを見つける方法を知らなければならない、などです。Kubernetesはこれに対処するのではなく、別のアプローチを取ります。

Kubernetesネットワークモデルについては、[こちら](/ja/docs/concepts/services-networking/)を参照してください。

## Kubernetesネットワークモデルの実装方法 {#how-to-implement-the-kubernetes-network-model}

ネットワークモデルは、各ノード上のコンテナランタイムによって実装されます。最も一般的なコンテナランタイムは、[Container Network Interface](https://github.com/containernetworking/cni) (CNI)プラグインを使用して、ネットワークとセキュリティ機能を管理します。CNIプラグインは、さまざまなベンダーから多数提供されています。これらの中には、ネットワークインターフェースの追加と削除という基本的な機能のみを提供するものもあれば、他のコンテナオーケストレーションシステムとの統合、複数のCNIプラグインの実行、高度なIPAM機能など、より洗練されたソリューションを提供するものもあります。

Kubernetesがサポートするネットワークアドオンの非網羅的なリストについては、[このページ](/ja/docs/concepts/cluster-administration/addons/#networking-and-network-policy)を参照してください。

## {{% heading "whatsnext" %}}

ネットワークモデルの初期設計とその根拠、および将来の計画については、[ネットワーク設計ドキュメント](https://git.k8s.io/design-proposals-archive/network/networking.md)で詳細に説明されています。
