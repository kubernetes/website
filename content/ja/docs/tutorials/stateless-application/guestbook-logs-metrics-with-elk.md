---
title: "例: PHP / Redisを使用したゲストブックの例にロギングとメトリクスを追加する"
content_type: tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "例: PHP / Redisを使用したゲストブックの例にロギングとメトリクスを追加する"
---

<!-- overview -->
このチュートリアルは、[Redisを使用したPHPのゲストブック](/ja/docs/tutorials/stateless-application/guestbook)のチュートリアルを前提に作られています。Elasticが開発したログ、メトリクス、ネットワークデータを転送するオープンソースの軽量データシッパーである*Beats*を、ゲストブックと同じKubernetesクラスターにデプロイします。BeatsはElasticsearchに対してデータの収集、分析、インデックス作成を行うため、結果の運用情報をKibana上で表示・分析できるようになります。この例は、以下のコンポーネントから構成されます。

* [Redisを使用したPHPのゲストブック](/ja/docs/tutorials/stateless-application/guestbook)の実行中のインスタンス
* ElasticsearchとKibana
* Filebeat
* Metricbeat
* Packetbeat



## {{% heading "objectives" %}}

* Redisを使用したPHPのゲストブックを起動する。
* kube-state-metricsをインストールする。
* KubernetesのSecretを作成する。
* Beatsをデプロイする。
* ログとメトリクスのダッシュボードを表示する。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}

追加で以下の作業が必要です。

* [Redisを使用したPHPのゲストブック](/ja/docs/tutorials/stateless-application/guestbook)チュートリアルの実行。

* ElasticsearchとKibanaのdeploymentの実行。[Elastic Cloud上のElasticsearchサービス](https://cloud.elastic.co)を使用するか、[ファイルをダウンロード](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html)してワークステーションやサーバー上で実行するか、または[Elastic Helm Chart](https://github.com/elastic/helm-charts)が使用できます。



<!-- lessoncontent -->

## Redisを使用したPHPのゲストブックを起動する

このチュートリアルは、[Redisを使用したPHPのゲストブック](/ja/docs/tutorials/stateless-application/guestbook)のチュートリアルを前提に作られています。もしゲストブックアプリケーションが実行中なら、そのアプリケーションを監視できます。もしまだ実行中のアプリケーションがなければ、ゲストブックのデプロイの手順を行い、**クリーンアップ**のステップは実行しないでください。ゲストブックが起動したら、このページに戻ってきてください。

## Cluster role bindingを追加する

[クラスターレベルのrole binding](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding)を作成して、kube-state-metricsとBeatsをクラスターレベルで(kube-system内に)デプロイできるようにします。

```shell
kubectl create clusterrolebinding cluster-admin-binding \
 --clusterrole=cluster-admin --user=<k8sのプロバイダーアカウントと紐付いたあなたのメールアドレス>
```

## kube-state-metricsをインストールする

Kubernetesの[*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics)は、Kubernetes APIサーバーをlistenして、オブジェクトの状態に関するメトリクスを生成する単純なサービスです。Metricbeatはこれらのメトリクスを報告します。kube-state-metricsをゲストブックが実行されているKubernetesクラスターに追加しましょう。

### kube-state-metricsが起動しているか確認する

```shell
kubectl get pods --namespace=kube-system | grep kube-state
```

### 必要に応じてkube-state-metricsをインストールする

```shell
git clone https://github.com/kubernetes/kube-state-metrics.git kube-state-metrics
kubectl apply -f kube-state-metrics/examples/standard
kubectl get pods --namespace=kube-system | grep kube-state-metrics
```

kube-state-metricsがRunningかつreadyの状態になっていることを確認します。

```shell
kubectl get pods -n kube-system -l app.kubernetes.io/name=kube-state-metrics
```

結果は次のようになります。

```shell
NAME                                 READY   STATUS    RESTARTS   AGE
kube-state-metrics-89d656bf8-vdthm   1/1     Running     0          21s
```

## GitHubリポジトリのElasticの例をクローンする

```shell
git clone https://github.com/elastic/examples.git
```

これ以降のコマンドは`examples/beats-k8s-send-anywhere`ディレクトリ内のファイルを参照するため、カレントディレクトリを変更します。

```shell
cd examples/beats-k8s-send-anywhere
```

## KubernetesのSecretを作成する

Kubernetesの{{< glossary_tooltip text="Secret" term_id="secret" >}}とは、パスワード、トークン、または鍵などの小さなサイズの機密データを含んだオブジェクトのことです。このような機密情報はPodのspecやイメージの中に置くことも不可能ではありませんが、Secretオブジェクトの中に置くことで、情報の使用方法を適切に制御したり、誤って公開してしまうリスクを減らすことができます。

{{< note >}}
ここでは2種類の手順を紹介します。1つは*セルフマネージド*な(自分のサーバーで実行中またはElastic Helm Chartを使用して構築された)ElasticsearchおよびKibanaのためのもので、もう1つは*マネージドサービス*のElastic CloudのElasticsearch Serviceのための別の手順です。このチュートリアルで使う種類のElasticsearchおよびKibanaのシステムのためのSecretだけを作成してください。
{{< /note >}}

{{< tabs name="tab_with_md" >}}
{{% tab name="セルフマネージド" %}}

### セルフマネージド

Elastic Cloud上のElasticsearch Serviceに接続する場合は、**マネージドサービス**タブに切り替えてください。

### クレデンシャルを設定する

セルフマネージドのElasticsearchとKibanaへ接続する場合、KubernetesのSecretを作成するために編集するべきファイルは4つあります(セルフマネージドとは、事実上Elastic Cloud以外で実行されているElasticsearch Serviceを指します)。ファイルは次の4つです。

1. ELASTICSEARCH_HOSTS
1. ELASTICSEARCH_PASSWORD
1. ELASTICSEARCH_USERNAME
1. KIBANA_HOST

これらのファイルにElasticsearchクラスターとKibanaホストの情報を設定してください。ここでは例をいくつか示します([*こちらの設定*](https://stackoverflow.com/questions/59892896/how-to-connect-from-minikube-to-elasticsearch-installed-on-host-local-developme/59892897#59892897)も参照してください)。

#### `ELASTICSEARCH_HOSTS`

1. Elastic Elasticsearch Helm Chartで作成したnodeGroupの場合。

    ```shell
    ["http://elasticsearch-master.default.svc.cluster.local:9200"]
    ```

1. Mac上で単一のElasticsearchノードが実行されており、BeatsがDocker for Macで実行中の場合。

    ```shell
    ["http://host.docker.internal:9200"]
    ```

1. 2ノードのElasticsearchがVM上または物理ハードウェア上で実行中の場合。

    ```shell
    ["http://host1.example.com:9200", "http://host2.example.com:9200"]
    ```

`ELASTICSEARCH_HOSTS`を編集します。

```shell
vi ELASTICSEARCH_HOSTS
```

#### `ELASTICSEARCH_PASSWORD`

パスワードだけを書きます。空白、クォート、<>などの文字は書かないでください。

    <yoursecretpassword>

`ELASTICSEARCH_PASSWORD`を編集します。

```shell
vi ELASTICSEARCH_PASSWORD
```

#### `ELASTICSEARCH_USERNAME`

ユーザー名だけを書きます。空白、クォート、<>などの文字は書かないでください。

    <Elasticsearchに追加するユーザー名>

`ELASTICSEARCH_USERNAME`を編集します。

```shell
vi ELASTICSEARCH_USERNAME
```

#### `KIBANA_HOST`

1. Elastic Kibana Helm Chartで作成したKibanaインスタンスが実行中の場合。`default`というサブドメインは、default Namespaceを指します。もしHelm Chartを別のNamespaceにデプロイした場合、サブドメインは異なります。

    ```shell
    "kibana-kibana.default.svc.cluster.local:5601"
    ```

1. Mac上でKibanaインスタンスが実行中で、BeatsがDocker for Macで実行中の場合。

    ```shell
    "host.docker.internal:5601"
    ```

1. 2つのElasticsearchノードが、VMまたは物理ハードウェア上で実行中の場合。

    ```shell
    "host1.example.com:5601"
    ```

`KIBANA_HOST`を編集します。

```shell
vi KIBANA_HOST
```

### KubernetesのSecretを作成する

次のコマンドを実行すると、KubernetesのシステムレベルのNamespace(kube-system)に、たった今編集したファイルを元にSecretが作成されます。

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTICSEARCH_HOSTS \
      --from-file=./ELASTICSEARCH_PASSWORD \
      --from-file=./ELASTICSEARCH_USERNAME \
      --from-file=./KIBANA_HOST \
      --namespace=kube-system

{{% /tab %}}
{{% tab name="マネージドサービス" %}}

## マネージドサービス

このタブは、Elastic Cloud上のElasticsearch Serviceの場合のみ必要です。もしセルフマネージドのElasticsearchとKibanaのDeployment向けにSecretをすでに作成した場合、[Beatsをデプロイする](#deploy-the-beats)に進んでください。

### クレデンシャルを設定する

Elastic Cloud上のマネージドElasticsearch Serviceに接続する場合、KubernetesのSecretを作成するために編集する必要があるのは、次の2つのファイルです。

1. ELASTIC_CLOUD_AUTH
1. ELASTIC_CLOUD_ID

Deploymentを作成するときに、Elasticsearch Serviceのコンソールから提供された情報を設定してください。以下に例を示します。

#### ELASTIC_CLOUD_ID

```shell
devk8s:ABC123def456ghi789jkl123mno456pqr789stu123vwx456yza789bcd012efg345hijj678klm901nop345zEwOTJjMTc5YWQ0YzQ5OThlN2U5MjAwYTg4NTIzZQ==
```

#### ELASTIC_CLOUD_AUTH

ユーザー名、コロン(`:`)、パスワードだけを書きます。空白やクォートは書かないでください。

```shell
elastic:VFxJJf9Tjwer90wnfTghsn8w
```

### 必要なファイルを編集する

```shell
vi ELASTIC_CLOUD_ID
vi ELASTIC_CLOUD_AUTH
```

### KubernetesのSecretを作成する

次のコマンドを実行すると、KubernetesのシステムレベルのNamespace(kube-system)に、たった今編集したファイルを元にSecretが作成されます。

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTIC_CLOUD_ID \
      --from-file=./ELASTIC_CLOUD_AUTH \
      --namespace=kube-system

  {{% /tab %}}
{{< /tabs >}}

## Beatsをデプロイする {#deploy-the-beats}

マニフェストファイルはBeatごとに提供されます。これらのマニフェストファイルは、上で作成したSecretを使用して、BeatsをElasticsearchおよびKibanaサーバーに接続するように設定します。

### Filebeatについて

Filebeatは、Kubernetesのノードと、ノード上で実行している各Pod内のコンテナから、ログを収集します。Filebeatは{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}としてデプロイされます。FilebeatはKubernetesクラスター上で実行されているアプリケーションを自動検出することもできます。起動時にFilebeatは既存のコンテナをスキャンし、それらに対して適切な設定を立ち上げ、その後、新しいstart/stopイベントを監視します。

Filebeatが、ゲストブックアプリケーションでデプロイしたRedisコンテナからRedisのログを特定・解析できるように自動検出を設定する例を示します。この設定は`filebeat-kubernetes.yaml`ファイル内にあります。

```yaml
- condition.contains:
    kubernetes.labels.app: redis
  config:
    - module: redis
      log:
        input:
          type: docker
          containers.ids:
            - ${data.kubernetes.container.id}
      slowlog:
        enabled: true
        var.hosts: ["${data.host}:${data.port}"]
```

この設定により、Filebeatは、`app`ラベルに`redis`という文字列が含まれるコンテナを検出したときに`redis` Filebeatモジュールを適用するようになります。redisモジュールには、input typeとしてdockerを使用することで(このRedisコンテナの標準出力のストリームと関連付けられた、Kubernetesノード上のファイルを読み取ることで)コンテナから`log`ストリームを収集する機能があります。さらに、このモジュールには、コンテナのメタデータとして提供された適切なPodのホストとポートと接続することにより、Redisの`slowlog`エントリーを収集する機能もあります。

### Filebeatをデプロイする

```shell
kubectl create -f filebeat-kubernetes.yaml
```

#### 検証する

```shell
kubectl get pods -n kube-system -l k8s-app=filebeat-dynamic
```

### Metricbeatについて

Metricbeatの自動検出はFilebeatと同じ方法で設定します。以下にMetricbeatにおけるRedisコンテナの自動検出の設定を示します。この設定は`metricbeat-kubernetes.yaml`ファイル内にあります。

```yaml
- condition.equals:
    kubernetes.labels.tier: backend
  config:
    - module: redis
      metricsets: ["info", "keyspace"]
      period: 10s

      # Redis hosts
      hosts: ["${data.host}:${data.port}"]
```

この設定により、Metricbeatは、`tier`ラベルに`backend`という文字列が含まれるコンテナを検出したときに`redis` Metricbeatモジュールを適用するようになります。redisモジュールには、コンテナのメタデータとして提供された適切なPodのホストとポートと接続することにより、コンテナから`info`および`keyspace`メトリクスを収集する機能があります。

### Metricbeatをデプロイする

```shell
kubectl create -f metricbeat-kubernetes.yaml
```

#### 検証する

```shell
kubectl get pods -n kube-system -l k8s-app=metricbeat
```

### Packetbeatについて

Packetbeatの設定は、FilebeatやMetricbeatとは異なります。コンテナのラベルに対するパターンマッチを指定する代わりに、関連するプロトコルとポート番号に基づいた設定を書きます。以下に示すのは、ポート番号のサブセットです。

{{< note >}}
サービスを標準ポート以外で実行している場合、そのポート番号を`filebeat.yaml`内の適切なtypeに追加し、PacketbeatのDaemonSetを削除・再作成してください。
{{< /note >}}

```yaml
packetbeat.interfaces.device: any

packetbeat.protocols:
- type: dns
  ports: [53]
  include_authorities: true
  include_additionals: true

- type: http
  ports: [80, 8000, 8080, 9200]

- type: mysql
  ports: [3306]

- type: redis
  ports: [6379]

packetbeat.flows:
  timeout: 30s
  period: 10s
```

#### Packetbeatをデプロイする

```shell
kubectl create -f packetbeat-kubernetes.yaml
```

#### 検証する

```shell
kubectl get pods -n kube-system -l k8s-app=packetbeat-dynamic
```

## Kibanaで表示する

ブラウザでKibanaを開き、**Dashboard**アプリケーションを開きます。検索バーでKubernetesと入力して、KubernetesのためのMetricbeatダッシュボードを開きます。このダッシュボードでは、NodeやDeploymentなどの状態のレポートが表示されます。

DashboardページでPacketbeatと検索し、Packetbeat overviewを表示します。

同様に、ApacheおよびRedisのためのDashboardを表示します。それぞれに対してログとメトリクスのDashboardが表示されます。Apache Metricbeat dashboardには何も表示されていないはずです。Apache Filebeat dashboardを表示して、ページの最下部までスクロールしてApacheのエラーログを確認します。ログを読むと、Apacheのメトリクスが表示されない理由が分かります。

Metricbeatを有効にしてApacheのメトリクスを取得するには、mod-status設定ファイルを含んだConfigMapを追加してゲストブックを再デプロイすることで、server-statusを有効にします。

## Deploymentをスケールして新しいPodが監視されるのを確認する

存在するDeploymentを一覧します。

```shell
kubectl get deployments
```

出力は次のようになります。

```shell
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
frontend        3/3     3            3           3h27m
redis-master    1/1     1            1           3h27m
redis-slave     2/2     2            2           3h27m
```

frontendのPodを2つにスケールダウンします。

```shell
kubectl scale --replicas=2 deployment/frontend
```

出力は次のようになります。

```shell
deployment.extensions/frontend scaled
```

frontendのPodを再び3つにスケールアップします。

```shell
kubectl scale --replicas=3 deployment/frontend
```

## Kibana上で変更を表示する

スクリーンショットを確認し、指定されたフィルターを追加して、ビューにカラムを追加します。赤い枠の右下を見ると、ScalingReplicaSetというエントリーが確認できます。そこからリストを上に見てゆくと、イメージのpull、ボリュームのマウント、Podのスタートなどのイベントが確認できます。

![Kibana Discover](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-up.png)

## {{% heading "cleanup" %}}

DeploymentとServiceを削除すると、実行中のすべてのPodも削除されます。ラベルを使って複数のリソースを1つのコマンドで削除します。

1. 次のコマンドを実行して、すべてのPod、Deployment、Serviceを削除します。

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      kubectl delete -f filebeat-kubernetes.yaml
      kubectl delete -f metricbeat-kubernetes.yaml
      kubectl delete -f packetbeat-kubernetes.yaml
      kubectl delete secret dynamic-logging -n kube-system
      ```

1. Podの一覧を問い合わせて、実行中のPodがなくなったことを確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```
      No resources found.
      ```

## {{% heading "whatsnext" %}}

* [リソースを監視するためのツール](/ja/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)について学ぶ。
* [ロギングのアーキテクチャ](/docs/concepts/cluster-administration/logging/)についてもっと読む。
* [アプリケーションのイントロスペクションとデバッグ](/ja/docs/tasks/debug/debug-application/)についてもっと読む。
* [アプリケーションのトラブルシューティング](/ja/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)についてもっと読む。
