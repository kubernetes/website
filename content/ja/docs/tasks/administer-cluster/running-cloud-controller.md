---
title: Kubernetesクラウドコントローラーマネージャー
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state state="beta" >}}

Kubernetes v1.6では`cloud-controller-manager`という新しいバイナリが導入されました。`cloud-controller-manager`はクラウド固有の制御ループを組み込むデーモンです。これらのクラウド固有の制御ループはもともと`kube-controller-manager`にありました。クラウドプロバイダーはKubernetesプロジェクトとは異なるペースで開発およびリリースされるため、プロバイダー固有のコードを`cloud-controller-manager`バイナリに抽象化することでクラウドベンダーはKubernetesのコアのコードとは独立して開発が可能となりました。

`cloud-controller-manager`は、[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)を満たす任意のクラウドプロバイダーと接続できます。下位互換性のためにKubernetesのコアプロジェクトで提供される[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)は`kube-controller-manager`と同じクラウドライブラリを使用します。Kubernetesのコアリポジトリで既にサポートされているクラウドプロバイダーは、Kubernetesリポジトリにあるcloud-controller-managerを使用してKubernetesのコアから移行することが期待されています。今後のKubernetesのリリースでは、すべてのクラウドコントローラーマネージャーはsigリードまたはクラウドベンダーが管理するKubernetesのコアプロジェクトの外で開発される予定です。

{{% /capture %}}


{{% capture body %}}

## 運用

### 要件

すべてのクラウドには動作させるためにそれぞれのクラウドプロバイダーの統合を行う独自の要件があり、`kube-controller-manager`を実行する場合の要件とそれほど違わないようにする必要があります。一般的な経験則として、以下のものが必要です。

* クラウドの認証/認可: クラウドではAPIへのアクセスを許可するためにトークンまたはIAMルールが必要になる場合があります
* kubernetesの認証/認可: cloud-controller-managerは、kubernetes apiserverと通信するためにRBACルールの設定を必要とする場合があります
* 高可用性: kube-controller-managerのように、リーダー選出を使用したクラウドコントローラーマネージャーの高可用性のセットアップが必要になる場合があります（デフォルトでオンになっています）。

### cloud-controller-managerを動かす

cloud-controller-managerを正常に実行するにはクラスター構成にいくつかの変更が必要です。

* `kube-apiserver`と`kube-controller-manager`は**`--cloud-provider`フラグを指定してはいけません**。これによりクラウドコントローラーマネージャーによって実行されるクラウド固有のループが実行されなくなります。将来このフラグは非推奨になり削除される予定です。
* `kubelet`は`--cloud-provider=external`で実行する必要があります。これは作業をスケジュールする前にクラウドコントローラーマネージャーによって初期化する必要があることをkubeletが認識できるようにするためです。

クラウドコントローラーマネージャーを使用するようにクラスターを設定するとクラスターの動作がいくつか変わることに注意してください。

* `--cloud-provider=external`を指定したkubeletは、初期化時に`NoSchedule`の`node.cloudprovider.kubernetes.io/uninitialized`汚染を追加します。これによりノードは作業をスケジュールする前に外部のコントローラーからの2回目の初期化が必要であるとマークされます。クラウドコントローラーマネージャーが使用できない場合クラスター内の新しいノードはスケジュールできないままになることに注意してください。スケジューラーはリージョンやタイプ（高CPU、GPU、高メモリ、スポットインスタンスなど）などのノードに関するクラウド固有の情報を必要とする場合があるためこの汚染は重要です。
* クラスター内のノードに関するクラウド情報はローカルメタデータを使用して取得されなくなりましたが、代わりにノード情報を取得するためのすべてのAPI呼び出しはクラウドコントローラーマネージャーを経由して行われるようになります。これはセキュリティを向上させるためにkubeletでクラウドAPIへのアクセスを制限できることを意味します。大規模なクラスターではクラスター内からクラウドのほとんどすべてのAPI呼び出しを行うため、クラウドコントローラーマネージャーがレートリミットに達するかどうかを検討する必要があります。

v1.8の時点でクラウドコントローラーマネージャーは以下を実装できます。

* ノードコントローラー - クラウドAPIを使用してkubernetesノードを更新し、クラウドで削除されたkubernetesノードを削除します。
* サービスコントローラー - タイプLoadBalancerのサービスに対応してクラウド上のロードバランサーを操作します。
* ルートコントローラー - クラウド上でネットワークルートを設定します。
* Kubernetesリポジトリの外部にあるプロバイダーを実行している場合はその他の機能の実装。


## 例

現在Kubernetesのコアでサポートされているクラウドを使用していて、クラウドコントローラーマネージャーを利用する場合は、[kubernetesのコアのクラウドコントローラーマネージャー](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)を参照してください。

Kubernetesのコアリポジトリにないクラウドコントローラーマネージャーの場合、クラウドベンダーまたはsigリードが管理するリポジトリでプロジェクトを見つけることができます。

* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [keepalived](https://github.com/munnerz/keepalived-cloud-provider)
* [Oracle Cloud Infrastructure](https://github.com/oracle/oci-cloud-controller-manager)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager)


すでにKubernetesのコアリポジトリにあるプロバイダーの場合、クラスター内でデーモンセットとしてKubernetesリポジトリ内部のクラウドコントローラーマネージャーを実行できます。以下をガイドラインとして使用してください。

{{< codenew file="admin/cloud/ccm-example.yaml" >}}


## 制限

クラウドコントローラーマネージャーの実行にはいくつかの制限があります。これらの制限は今後のリリースで対処されますが、本番のワークロードにおいてはこれらの制限を認識することが重要です。

### ボリュームのサポート

ボリュームの統合にはkubeletとの調整も必要になるためクラウドコントローラーマネージャーは`kube-controller-manager`にあるボリュームコントローラーを実装しません。CSI（コンテナストレージインターフェイス）が進化してFlexボリュームプラグインの強力なサポートが追加されるにつれ、クラウドがボリュームと完全に統合できるようクラウドコントローラーマネージャーに必要なサポートが追加されます。Kubernetesリポジトリの外部にあるCSIボリュームプラグインの詳細については[こちら](https://github.com/kubernetes/features/issues/178)をご覧ください。

### スケーラビリティ

クラウドプロバイダーの以前のアーキテクチャではローカルメタデータサービスを使用して自身のノード情報を取得するkubeletに依存していました。新しいアーキテクチャではクラウドコントローラーマネージャーがすべてのノードの情報を取得します。非常に大きなクラスターの場合、リソース要件やAPIレートリミットなどのボトルネックの可能性を考慮する必要があります。

### 鶏と卵

クラウドコントローラーマネージャープロジェクトの目標はKubernetesのコアプロジェクトからクラウドに関する機能の開発を切り離すことです。残念ながら、Kubernetesプロジェクトの多くの面でクラウドプロバイダーの機能がKubernetesプロジェクトに緊密に結びついているという前提があります。そのため、この新しいアーキテクチャを採用するとクラウドプロバイダーの情報を要求する状況が発生する可能性がありますが、クラウドコントローラーマネージャーはクラウドプロバイダーへのリクエストが完了するまでその情報を返すことができない場合があります。

これの良い例は、KubeletのTLSブートストラップ機能です。現在、TLSブートストラップはKubeletがすべてのアドレスタイプ（プライベート、パブリックなど）をクラウドプロバイダー（またはローカルメタデータサービス）に要求する能力を持っていると仮定していますが、クラウドコントローラーマネージャーは最初に初期化されない限りノードのアドレスタイプを設定できないためapiserverと通信するためにはkubeletにTLS証明書が必要です。

このイニシアチブが成熟するに連れ、今後のリリースでこれらの問題に対処するための変更が行われます。

## 独自のクラウドコントローラマネージャーを開発する

独自のクラウドコントローラーマネージャーを構築および開発するには[クラウドコントローラーマネージャーの開発](/docs/tasks/administer-cluster/developing-cloud-controller-manager.md)のドキュメントを参照してください。

{{% /capture %}}
