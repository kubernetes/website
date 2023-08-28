---
title: 設定のベストプラクティス
content_type: concept
weight: 10
---

<!-- overview -->
このドキュメントでは、ユーザーガイド、入門マニュアル、および例を通して紹介されている設定のベストプラクティスを中心に説明します。

このドキュメントは生ものです。このリストには載っていないが他の人に役立つかもしれない何かについて考えている場合、IssueまたはPRを遠慮なく作成してください。


<!-- body -->
## 一般的な設定のTips
- 構成を定義する際には、最新の安定したAPIバージョンを指定してください。

- 設定ファイルは、クラスターに反映される前にバージョン管理システムに保存されるべきです。これによって、必要に応じて設定変更を迅速にロールバックできます。また、クラスターの再作成や復元時にも役立ちます。

- JSONではなくYAMLを使って設定ファイルを書いてください。これらのフォーマットはほとんどすべてのシナリオで互換的に使用できますが、YAMLはよりユーザーフレンドリーになる傾向があります。

- 意味がある場合は常に、関連オブジェクトを単一ファイルにグループ化します。多くの場合、1つのファイルの方が管理が簡単です。例として[guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml)ファイルを参照してください。

- 多くの`kubectl`コマンドがディレクトリに対しても呼び出せることも覚えておきましょう。たとえば、設定ファイルのディレクトリで `kubectl apply`を呼び出すことができます。

- 不必要にデフォルト値を指定しないでください。シンプルかつ最小限の設定のほうがエラーが発生しにくくなります。

- よりよいイントロスペクションのために、オブジェクトの説明をアノテーションに入れましょう。


## "真っ裸"のPod に対する ReplicaSet、Deployment、およびJob {#naked-pods-vs-replicasets-deployments-and-jobs}

- 可能な限り、"真っ裸"のPod([ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)や[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)にバインドされていないPod)は使わないでください。Nodeに障害が発生した場合、これらのPodは再スケジュールされません。

  明示的に[`restartPolicy: Never`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)を使いたいシーンを除いて、DeploymentはPodを直接作成するよりもほとんど常に望ましい方法です。Deploymentには、希望する数のPodが常に使用可能であることを確認するためにReplicaSetを作成したり、Podを置き換えるための戦略(RollingUpdateなど)を指定したりできます。[Job](/docs/concepts/workloads/controllers/job/)のほうが適切な場合もあるかもしれません。

## Service

- 対応するバックエンドワークロード（DeploymentまたはReplicaSet）の前、およびそれにアクセスする必要があるワークロードの前に[Service](/ja/docs/concepts/services-networking/service/)を作成します。Kubernetesがコンテナを起動すると、コンテナ起動時に実行されていたすべてのServiceを指す環境変数が提供されます。たとえば、fooという名前のServiceが存在する場合、すべてのコンテナは初期環境で次の変数を取得します。

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  *これは順序付けの必要性を意味します* - `Pod`がアクセスしたい`Service`は`Pod`自身の前に作らなければならず、そうしないと環境変数は注入されません。DNSにはこの制限はありません。

- （強くお勧めしますが）[クラスターアドオン](/ja/docs/concepts/cluster-administration/addons/)の1つの選択肢はDNSサーバーです。DNSサーバーは、新しい`Service`についてKubernetes APIを監視し、それぞれに対して一連のDNSレコードを作成します。クラスター全体でDNSが有効になっている場合は、すべての`Pod`が自動的に`Services`の名前解決を行えるはずです。

- どうしても必要な場合以外は、Podに`hostPort`を指定しないでください。Podを`hostPort`にバインドすると、Podがスケジュールできる場所の数を制限します、それぞれの<`hostIP`、 `hostPort`、`protocol`>の組み合わせはユニークでなければならないからです。`hostIP`と`protocol`を明示的に指定しないと、Kubernetesはデフォルトの`hostIP`として`0.0.0.0`を、デフォルトの `protocol`として`TCP`を使います。

  デバッグ目的でのみポートにアクセスする必要がある場合は、[apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)または[`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)を使用できます。

  ノード上でPodのポートを明示的に公開する必要がある場合は、hostPortに頼る前に[NodePort](/ja/docs/concepts/services-networking/service/#nodeport)の使用を検討してください。

- `hostPort`の理由と同じくして、`hostNetwork`の使用はできるだけ避けてください。

- `kube-proxy`のロードバランシングが不要な場合は、[headless Service](/ja/docs/concepts/services-networking/service/#headless-service)（`ClusterIP`が`None`）を使用してServiceを簡単に検出できます。

## ラベルの使用

- `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`のように、アプリケーションまたはデプロイメントの __セマンティック属性__ を識別する[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)を定義して使いましょう。これらのラベルを使用して、他のリソースに適切なPodを選択できます。例えば、すべての`tier：frontend`を持つPodを選択するServiceや、`app：myapp`に属するすべての`phase：test`コンポーネント、などです。このアプローチの例を知るには、[ゲストブック](https://github.com/kubernetes/examples/tree/master/guestbook/)アプリも合わせてご覧ください。

セレクターからリリース固有のラベルを省略することで、Serviceを複数のDeploymentにまたがるように作成できます。 [Deployment](/ja/docs/concepts/workloads/controllers/deployment/)により、ダウンタイムなしで実行中のサービスを簡単に更新できます。

オブジェクトの望ましい状態はDeploymentによって記述され、その仕様への変更が _適用_ されると、Deploymentコントローラーは制御された速度で実際の状態を望ましい状態に変更します。

- デバッグ用にラベルを操作できます。Kubernetesコントローラー（ReplicaSetなど）とServiceはセレクターラベルを使用してPodとマッチするため、Podから関連ラベルを削除すると、コントローラーによって考慮されたり、Serviceによってトラフィックを処理されたりすることがなくなります。既存のPodのラベルを削除すると、そのコントローラーはその代わりに新しいPodを作成します。これは、「隔離」環境で以前の「ライブ」Podをデバッグするのに便利な方法です。対話的にラベルを削除または追加するには、[`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label)を使います。

## コンテナイメージ

[imagePullPolicy](/ja/docs/concepts/containers/images/#updating-images)とイメージのタグは、[kubelet](/docs/reference/command-line-tools-reference/kubelet/)が特定のイメージをpullしようとしたときに作用します。

- `imagePullPolicy: IfNotPresent`: ローカルでイメージが見つからない場合にのみイメージをpullします。

- `imagePullPolicy: Always`: kubeletがコンテナを起動する度に、kubeletはコンテナイメージレジストリに問い合わせて、イメージのダイジェストの名前解決を行います。もし、kubeletが同じダイジェストのコンテナイメージをローカルにキャッシュしていたら、kubeletはそのキャッシュされたイメージを利用します。そうでなければ、kubeletは解決されたダイジェストのイメージをダウンロードし、そのイメージを利用してコンテナを起動します。

- `imagePullPolicy` のタグが省略されていて、利用してるイメージのタグが`:latest`の場合や省略されている場合、`Always`が適用されます。

- `imagePullPolicy` のタグが省略されていて、利用してるイメージのタグはあるが`:latest`でない場合、`IfNotPresent`が適用されます。

- `imagePullPolicy: Never`: 常にローカルでイメージを探そうとします。ない場合にもイメージはpullしません。

{{< note >}}
コンテナが常に同じバージョンのイメージを使用するようにするためには、そのコンテナイメージの[ダイジェスト](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)を指定することができます。`<image-name>:<tag>`を`<image-name>@<digest>`で置き換えます(例:`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`)。このダイジェストはイメージの特定のバージョンを一意に識別するため、ダイジェスト値を変更しない限り、Kubernetesによって更新されることはありません。
{{< /note >}}

{{< note >}}
どのバージョンのイメージが実行されているのかを追跡するのが難しく、適切にロールバックするのが難しいため、本番環境でコンテナをデプロイするときは `：latest`タグを使用しないでください。
{{< /note >}}

{{< note >}}
ベースイメージのプロバイダーのキャッシュセマンティクスにより、`imagePullPolicy：Always`もより効率的になります。たとえば、Dockerでは、イメージがすでに存在する場合すべてのイメージレイヤーがキャッシュされ、イメージのダウンロードが不要であるため、pullが高速になります。
{{< /note >}}

## kubectlの使い方

- `kubectl apply -f <directory>`を使いましょう。これを使うと、ディレクトリ内のすべての`.yaml`、`.yml`、および`.json`ファイルが`apply`に渡されます。

- `get`や`delete`を行う際は、特定のオブジェクト名を指定するのではなくラベルセレクターを使いましょう。[ラベルセレクター](/ja/docs/concepts/overview/working-with-objects/labels/#label-selectors)と[ラベルの効果的な使い方](/ja/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)のセクションを参照してください。

- 単一コンテナのDeploymentやServiceを素早く作成するなら、`kubectl create deployment`や`kubectl expose`を使いましょう。一例として、[Serviceを利用したクラスター内のアプリケーションへのアクセス](/ja/docs/tasks/access-application-cluster/service-access-application-cluster/)を参照してください。


