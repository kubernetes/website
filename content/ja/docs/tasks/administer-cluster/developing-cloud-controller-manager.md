---
title: クラウドコントローラーマネージャーの開発
content_type: concept
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}
今後のリリースで、クラウドコントローラーマネージャーはKubernetesを任意のクラウドと統合するための良い方法となります。これによりクラウドプロバイダーはKubernetesのコアリリースサイクルから独立して機能を開発できるようになります。

{{< feature-state for_k8s_version="1.8" state="alpha" >}}

独自のクラウドコントローラーマネージャーを構築する方法を説明する前に、クラウドコントローラーマネージャーがKubernetesの内部でどのように機能するかに関する背景を知っておくと役立ちます。
クラウドコントローラーマネージャーはGoインターフェースを利用する`kube-controller-manager`のコードで、任意のクラウドの実装をプラグインとして利用できるようになっています。スキャフォールディングと汎用のコントローラー実装の大部分はKubernetesのコアになりますが、[クラウドプロバイダーのインターフェイス](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go#L42-L62)が満たされていれば提供されているクラウドプロバイダーのインターフェイスが実行されるようになります。

実装の詳細をもう少し掘り下げてみましょう。すべてのクラウドコントローラーマネージャーはKubernetesコアからパッケージをインポートします。唯一の違いは、各プロジェクトが利用可能なクラウドプロバイダーの情報(グローバル変数)が更新される場所である[cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/6371aabbd7a7726f4b358444cca40def793950c2/plugins.go#L55-L63)を呼び出すことによって独自のクラウドプロバイダーを登録する点です。




<!-- body -->

## 開発

### Kubernetesには登録されていない独自クラウドプロバイダー

Kubernetesには登録されていない独自のクラウドプロバイダーのクラウドコントローラーマネージャーを構築するには、次の3つのステップに従ってください。

1. [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)を満たす go パッケージを実装します。
2. Kubernetesのコアにある[cloud-controller-managerのmain.go](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go)をあなたのmain.goのテンプレートとして利用します。上で述べたように、唯一の違いはインポートされるクラウドパッケージのみです。
3. クラウドパッケージを `main.go` にインポートし、パッケージに [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go) を実行するための `init` ブロックがあることを確認します。

既存の独自クラウドプロバイダーの実装例を利用すると役立つでしょう。独自クラウドプロバイダーの実装例のリストは[こちら](/docs/tasks/administer-cluster/running-cloud-controller.md#examples)にあります。

### Kubernetesに登録されているクラウドプロバイダー

Kubernetesに登録されているクラウドプロバイダーであれば、[Daemonset](https://kubernetes.io/examples/admin/cloud/ccm-example.yaml) を使ってあなたのクラスターで動かすことができます。詳細については[Kubernetesクラウドコントローラーマネージャードキュメント](/docs/tasks/administer-cluster/running-cloud-controller/)を参照してください。


