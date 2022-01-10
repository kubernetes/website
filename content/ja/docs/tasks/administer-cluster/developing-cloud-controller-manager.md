---
title: クラウドコントローラーマネージャーの開発
content_type: concept
---

<!-- overview -->

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="cloud-controller-managerは">}}

<!-- body -->

## 背景

クラウドプロバイダーはKubernetesプロジェクトとは異なる速度で開発しリリースすることから、プロバイダー特有なコードを`cloud-controller-manager`バイナリから抽象化することで、クラウドベンダーはコアKubernetesコードから独立して発展することができます。

Kubernetesプロジェクトは、(クラウドプロバイダーの)独自実装を組み込めるGoインターフェースを備えたcloud-controller-managerのスケルトンコードを提供しています。これは、クラウドプロバイダーがKubernetesコアからパッケージをインポートすることでcloud-controller-managerを実装できることを意味します。各クラウドプロバイダーは利用可能なクラウドプロバイダーのグローバル変数を更新するために`cloudprovider.RegisterCloudProvider`を呼び出し、独自のコードを登録します。

## 開発

### Kubernetesには登録されていない独自クラウドプロバイダー

Kubernetesには登録されていない独自のクラウドプロバイダーのクラウドコントローラーマネージャーを構築するには、

1. [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)を満たす go パッケージを実装します。
2. Kubernetesのコアにある[cloud-controller-managerの`main.go`](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go)をあなたの`main.go`のテンプレートとして利用します。上で述べたように、唯一の違いはインポートされるクラウドパッケージのみです。
3. クラウドパッケージを `main.go` にインポートし、パッケージに [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go) を実行するための `init` ブロックがあることを確認します。

多くのクラウドプロバイダーはオープンソースとしてコントローラーマネージャーのコードを公開しています。新たにcloud-controller-managerをスクラッチから開発する際には、既存のKubernetesには登録されていない独自クラウドプロバイダーのコントローラーマネージャーを開始地点とすることができます。

### Kubernetesに登録されているクラウドプロバイダー

Kubernetesに登録されているクラウドプロバイダーであれば、{{< glossary_tooltip term_id="daemonset" >}}を使ってあなたのクラスターで動かすことができます。詳細については[Kubernetesクラウドコントローラーマネージャー](/ja/docs/tasks/administer-cluster/running-cloud-controller/)を参照してください。

