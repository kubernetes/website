---
title: クラスター内で実行されているサービスへのアクセス
content_type: task
weight: 140
---

<!-- overview -->
このページでは、Kubernetesクラスター内で実行されているサービスに接続する方法を説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## クラスター内で実行されているサービスへのアクセス {#accessing-services-running-on-the-cluster}

Kubernetesで[ノード](/docs/concepts/architecture/nodes/)、[Pod](/docs/concepts/workloads/pods/)、そして[Service](/docs/concepts/services-networking/service/)は、それぞれの独自のIPアドレスを持ちます。
多くの場合、クラスター内のノードIP、Pod IP、そして一部のService IPはルーティングされないため、デスクトップマシンなどのクラスター外のマシンからは到達できません。


### 接続方法 {#ways-to-connect}

クラスター外からノード、PodそしてServiceに接続するためには、いくつかのオプションがあります。

- パブリックIPを介してServiceにアクセスする。
  - クラスター外からServiceに到達できるように`NodePort`または`LoadBalancer`タイプのServiceを使用します。
    詳細は[Service](/docs/concepts/services-networking/service/)および[kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose)のドキュメントを参照してください。
  - クラスターの環境によって、Serviceが社内ネットワークのみに公開される場合もあれば、インターネットに公開される場合もあります。
    公開するServiceが安全かどうかを検討してください。
    そのServiceは独自の認証機能を備えていますか？
  - PodはServiceの背後に配置します。
    デバッグなどの目的で、複数のレプリカの中から特定のPodにアクセスするためには、そのPodにユニークなラベルを付与し、そのラベルを選択する新しいServiceを作成します。
  - ほとんどの場合、アプリケーション開発者がnodeIPを使用してノードに直接アクセスする必要はありません。
- Proxy Verbを使用してService、ノード、Podにアクセスする。
  - リモートのServiceにアクセスする前に、APIサーバーによる認証および認可が行われます。
    Serviceをインターネットに公開するほど安全ではない場合や、ノードIP上のポートにアクセスしたい場合、またはデバッグ目的で使用します。
  - プロキシは、一部のWebアプリケーションで問題を引き起こす可能性があります。
  - HTTP/HTTPSのみで動作します。
  - 詳細は[こちら](#manually-constructing-apiserver-proxy-urls)を参照してください。
- クラスター内のノードまたはPodからアクセスする。
  - Podを起動し、[kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)を使用してそのPodのシェルに接続します。
    そのシェルから、ほかのノード、Pod、Serviceに接続できます。
  - 一部のクラスターは、ノードへのSSHアクセスを許可する場合があります。
    その場合、そこからクラスターのServiceにアクセスできる可能性があります。
    ただし、これは標準的な方法ではなく、クラスターによっては動作しないことがあります。
    ブラウザやほかのツールがインストールされていない場合もあります。
    クラスターDNSが動作しないこともあります。

### 組み込みServiceの検出 {#discovering-builtin-services}

通常、kube-systemによってクラスター内で起動されるServiceがいくつか存在します。
これらは、`kubectl cluster-info`コマンドを通して一覧表示ができます。

```shell
kubectl cluster-info
```

出力は次のとおりです。

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

これは、各Serviceにアクセスするためのproxy-verb URLを示しています。
たとえば、このクラスターでは(Elasticsearchを使用した)クラスター単位のログ収集が有効で、適切な認証情報を渡すことで、`https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`からアクセスできます。
または、たとえば次のようにkubectl proxyを介して`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`からアクセスすることも可能です。

{{< note >}}
認証情報の渡し方やkubectl proxyの使用方法については、[Kubernetes APIを使用してクラスターにアクセスする](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api)を参照してください。
{{< /note >}}

#### APIサーバーのプロキシURLを手動で構築する方法 {#manually-constructing-apiserver-proxy-urls}

前述のとおり、ServiceのプロキシURLを取得するには`kubectl cluster-info`コマンドを使用します。
Serviceのエンドポイント、サフィックス、パラメータを含むプロキシURLを作成するには、次の形式でServiceのプロキシURLに追記します。
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

ポートに名前を指定していない場合、URLに*port_name*を指定する必要はありません。
また、名前付きポート、名前なしポートのいずれの場合でも、*port_name*の代わりにポート番号を使用することもできます。

デフォルトでは、APIサーバーはHTTPを使用してServiceにプロキシします。
HTTPSを使用する場合は、Service名の前に`https:`を付与します。
`http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`

URLの`<service_name>`部分では、次の形式がサポートされています。

* `<service_name>` - HTTPを使用して、デフォルトまたは名前なしのポートにプロキシします
* `<service_name>:<port_name>` - HTTPを使用して、指定したポート名またはポート番号にプロキシします
* `https:<service_name>:` - httpsを使用して、デフォルトまたは名前なしのポートにプロキシします(末尾のコロンに注意してください)
* `https:<service_name>:<port_name>` - httpsを使用して、指定したポート名またはポート番号にプロキシします

##### 例 {#examples}

* Elasticsearchサービスのエンドポイント`_search?q=user:kimchy`にアクセスするには、次のURLを使用します。

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

* Elasticsearchクラスターのヘルス情報`_cluster/health?pretty=true`にアクセスするには、次のURLを使用します。

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  ヘルス情報は次のような内容です。

  ```json
  {
    "cluster_name" : "kubernetes_logging",
    "status" : "yellow",
    "timed_out" : false,
    "number_of_nodes" : 1,
    "number_of_data_nodes" : 1,
    "active_primary_shards" : 5,
    "active_shards" : 5,
    "relocating_shards" : 0,
    "initializing_shards" : 0,
    "unassigned_shards" : 5
  }
  ```

* *https*を経由してElasticsearchサービスのヘルス情報`_cluster/health?pretty=true`にアクセスするには、次のURLを使用します。

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### クラスター内で実行されているサービスにWebブラウザからアクセスする {#using-web-browsers-to-access-services-running-on-the-cluster}

ブラウザのアドレスバーにAPIサーバーのプロキシURLを直接入力してアクセスできる場合があります。ただし、以下の点に注意してください。

- Webブラウザのアドレスバーは通常トークンを送信できないため、Basic認証(パスワード)を使用する必要があります。
  APIサーバーはBasic認証を受け付けるように設定できますが、クラスターがその設定になっていない場合もあります。
- 一部のWebアプリケーションは正しく動作しないことがあります。特に、プロキシのパスプレフィックスを考慮せずにURLを生成するクライアントサイドJavaScriptを使用している場合です。