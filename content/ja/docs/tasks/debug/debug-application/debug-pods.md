---
title: Podのデバッグ
content_type: concept
weight: 10
---

<!-- overview -->

このガイドは、Kubernetesにデプロイされ、正しく動作しないアプリケーションをユーザーがデバッグするためのものです。
これは、自分のクラスターをデバッグしたい人のためのガイドでは *ありません*。
そのためには、[debug-cluster](/ja/docs/tasks/debug/debug-cluster)を確認する必要があります。

<!-- body -->

## 問題の診断

トラブルシューティングの最初のステップは切り分けです。何が問題なのでしょうか？
Podなのか、レプリケーションコントローラーなのか、それともサービスなのか？

   * [Podのデバッグ](#debugging-pods)
   * [レプリケーションコントローラーのデバッグ](#debugging-replication-controllers)
   * [Serviceのデバッグ](#debugging-services)

### Podのデバッグ {#debugging-pods}

デバッグの第一歩は、Podを見てみることです。
以下のコマンドで、Podの現在の状態や最近のイベントを確認します。

```shell
kubectl describe pods ${POD_NAME}
```

Pod内のコンテナの状態を見てください。
すべて`Running`ですか？ 最近、再起動がありましたか？
Podの状態に応じてデバッグを続けます。

#### PodがPendingのまま

Podが`Pending`で止まっている場合、それはノードにスケジュールできないことを意味します。
一般に、これはある種のリソースが不十分で、スケジューリングできないことが原因です。
上の`kubectl describe ...`コマンドの出力を見てください。

なぜあなたのPodをスケジュールできないのか、スケジューラーからのメッセージがあるはずです。
理由は以下の通りです。

* **リソースが不足しています。** クラスターのCPUまたはメモリーを使い果たしている可能性があります。Podを削除するか、リソースの要求値を調整するか、クラスターに新しいノードを追加する必要があります。詳しくは[Compute Resources document](/ja/docs/concepts/configuration/manage-resources-containers/)を参照してください。

* **あなたが使用しているのは`hostPort`です。** Podを`hostPort`にバインドすると、そのPodがスケジュールできる場所が限定されます。ほとんどの場合、`hostPort`は不要なので、Serviceオブジェクトを使ってPodを公開するようにしてください。もし`hostPort` が必要な場合は、Kubernetesクラスターのノード数だけPodをスケジュールすることができます。


#### Podがwaitingのまま

Podが`Waiting`状態で止まっている場合、ワーカーノードにスケジュールされていますが、そのノード上で実行することができません。この場合も、`kubectl describe ...`の情報が参考になるはずです。`Waiting`状態のPodの最も一般的な原因は、コンテナイメージのプルに失敗することです。

確認すべきことは3つあります。

* イメージの名前が正しいかどうか確認してください。
* イメージをレジストリにプッシュしましたか？
* あなたのマシンで手動で`docker pull <image>`を実行し、イメージをプルできるかどうか確認してください。

#### Podがクラッシュするなどの不健全な状態

Podがスケジュールされると、[実行中のPodのデバッグ](/ja/docs/tasks/debug/debug-application/debug-running-pod/)で説明されている方法がデバッグに利用できるようになります。

#### Podが期待する通りに動きません

Podが期待した動作をしない場合、ポッドの記述(ローカルマシンの `mypod.yaml` ファイルなど)に誤りがあり、Pod作成時にその誤りが黙って無視された可能性があります。Pod記述のセクションのネストが正しくないか、キー名が間違って入力されていることがよくあり、そのようなとき、そのキーは無視されます。たとえば、`command`のスペルを`commnd`と間違えた場合、Podは作成されますが、あなたが意図したコマンドラインは使用されません。

まずPodを削除して、`--validate` オプションを付けて再度作成してみてください。
例えば、`kubectl apply --validate -f mypod.yaml`と実行します。
`command`のスペルを`commnd`に間違えると、以下のようなエラーになります。

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

次に確認することは、apiserver上のPodが、作成しようとしたPod(例えば、ローカルマシンのyamlファイル)と一致しているかどうかです。
例えば、`kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` を実行して、元のポッドの説明である`mypod.yaml`とapiserverから戻ってきた`mypod-on-apiserver.yaml`を手動で比較してみてください。
通常、"apiserver" バージョンには、元のバージョンにはない行がいくつかあります。これは予想されることです。
しかし、もし元のバージョンにある行がapiserverバージョンにない場合、これはあなたのPod specに問題があることを示している可能性があります。

### レプリケーションコントローラーのデバッグ {#debugging-replication-controllers}

レプリケーションコントローラーはかなり単純なものです。
彼らはPodを作ることができるか、できないか、どちらかです。
もしPodを作成できないのであれば、[上記の説明](#debugging-pods)を参照して、Podをデバッグしてください。
また、`kubectl describe rc ${CONTROLLER_NAME}`を使用すると、レプリケーションコントローラーに関連するイベントを確認することができます。

### Serviceのデバッグ {#debugging-services}

Serviceは、Podの集合全体でロードバランシングを提供します。
Serviceが正しく動作しない原因には、いくつかの一般的な問題があります。

以下の手順は、Serviceの問題をデバッグするのに役立つはずです。

まず、Serviceに対応するEndpointが存在することを確認します。
全てのServiceオブジェクトに対して、apiserverは `endpoints` リソースを利用できるようにします。
このリソースは次のようにして見ることができます。

```shell
kubectl get endpoints ${SERVICE_NAME}
```

EndpointがServiceのメンバーとして想定されるPod数と一致していることを確認してください。
例えば、3つのレプリカを持つnginxコンテナ用のServiceであれば、ServiceのEndpointには3つの異なるIPアドレスが表示されるはずです。

#### Serviceに対応するEndpointがありません

Endpointが見つからない場合は、Serviceが使用しているラベルを使用してPodをリストアップしてみてください。
ラベルがあるところにServiceがあると想像してください。

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

セレクタに一致するPodを一覧表示するには、次のコマンドを使用します。

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

リストがServiceを提供する予定のPodと一致することを確認します。
Podの`containerPort`がServiceの`targetPort`と一致することを確認します。

#### ネットワークトラフィックが転送されません

詳しくは[Serviceのデバッグ](/ja/docs/tasks/debug/debug-application/debug-service/)を参照してください。

## {{% heading "whatsnext" %}}

上記のいずれの方法でも問題が解決しない場合は、以下の手順に従ってください。
[Serviceのデバッグに関するドキュメント](/ja/docs/tasks/debug/debug-application/debug-service/)で、`Service`が実行されていること、`Endpoints`があること、`Pods`が実際にサービスを提供していること、DNSが機能していること、IPtablesルールがインストールされていること、kube-proxyが誤作動を起こしていないようなことを確認してください。

[トラブルシューティングドキュメント](/ja/docs/tasks/debug/)に詳細が記載されています。

