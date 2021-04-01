---
title: Ingress
content_type: concept
weight: 40
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}


<!-- body -->

## 用語

簡単のために、このガイドでは次の用語を定義します。

* ノード: Kubernetes内のワーカーマシンで、クラスターの一部です。
* クラスター: Kubernetesによって管理されているコンテナ化されたアプリケーションを実行させるノードの集合です。この例や、多くのKubernetesによるデプロイでは、クラスター内のノードはインターネットに公開されていません。
* エッジルーター: クラスターでファイアウォールのポリシーを強制するルーターです。クラウドプロバイダーが管理するゲートウェイや、物理的なハードウェアの一部である場合もあります。
* クラスターネットワーク: 物理的または論理的な繋がりの集合で、Kubernetesの[ネットワークモデル](/docs/concepts/cluster-administration/networking/)によって、クラスター内でのコミュニケーションを司るものです。
* Service: {{< glossary_tooltip text="ラベル" term_id="label" >}}セレクターを使ったPodの集合を特定するKubernetes {{< glossary_tooltip term_id="service" >}}です。特に指定がない限り、Serviceはクラスターネットワーク内でのみ疎通可能な仮想IPを持つものとして扱われます。

## Ingressとは何か

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)はクラスター外からクラスター内{{< link text="Service" url="/ja/docs/concepts/services-networking/service/" >}}へのHTTPとHTTPSのルートを公開します。トラフィックのルーティングはIngressリソース上で定義されるルールによって制御されます。

全てのトラフィックを単一のServiceに送る単純なIngressの例を示します。

{{< mermaid >}}
graph LR;
  client([クライアント])-. Ingress管理下の <br> ロードバランサー .->ingress[Ingress];
  ingress-->|ルーティングルール|service[Service];
  subgraph cluster[クラスター]
  ingress;
  service-->pod1[Pod];
  service-->pod2[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service,pod1,pod2 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

IngressはServiceに対して、外部疎通できるURL、負荷分散トラフィック、SSL/TLS終端の機能や、名前ベースの仮想ホスティングを提供するように設定できます。[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)は通常はロードバランサーを使用してIngressの機能を実現しますが、エッジルーターや、追加のフロントエンドを構成してトラフィックの処理を支援することもできます。

Ingressは任意のポートやプロトコルを公開しません。HTTPやHTTPS以外のServiceをインターネットに公開する場合、[Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#nodeport)や[Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)のServiceタイプを一般的には使用します。

## Ingressを使用する上での前提条件

Ingressを提供するためには[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)が必要です。Ingressリソースを作成するのみでは何の効果もありません。

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)のようなIngressコントローラーのデプロイが必要な場合があります。いくつかの[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)の中から選択してください。

理想的には、全てのIngressコントローラーはリファレンスの仕様を満たすはずです。しかし実際には、各Ingressコントローラーは微妙に異なる動作をします。

{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点について理解してください。
{{< /note >}}

## Ingressリソース

Ingressリソースの最小構成の例は以下のとおりです。

{{< codenew file="service/networking/minimal-ingress.yaml" >}}

他の全てのKubernetesリソースと同様に、Ingressには`apiVersion`、`kind`や`metadata`フィールドが必要です。Ingressオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。設定ファイルに関する一般的な情報は、[アプリケーションのデプロイ](/ja/docs/tasks/run-application/run-stateless-application-deployment/)、[コンテナの設定](/docs/tasks/configure-pod-container/configure-pod-configmap/)、[リソースの管理](/docs/concepts/cluster-administration/manage-deployment/)を参照してください。Ingressでは、Ingressコントローラーに依存しているいくつかのオプションの設定をするためにアノテーションを一般的に使用します。例としては、[rewrite-targetアノテーション](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)などがあります。[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)の種類が異なれば、サポートするアノテーションも異なります。サポートされているアノテーションについて学ぶためには、使用するIngressコントローラーのドキュメントを確認してください。

Ingress [Spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)は、ロードバランサーやプロキシーサーバーを設定するために必要な全ての情報を持っています。最も重要なものとして、外部からくる全てのリクエストに対して一致したルールのリストを含みます。IngressリソースはHTTP(S)トラフィックに対してのルールのみサポートしています。

### Ingressのルール

各HTTPルールは以下の情報を含みます。

* オプションで設定可能なホスト名。上記のリソースの例では、ホスト名が指定されていないと、そのルールは指定されたIPアドレスを経由する全てのインバウンドHTTPトラフィックに適用されます。ホスト名が指定されていると(例: foo.bar.com)、そのルールはホストに対して適用されます。
* パスのリスト(例: `/testpath`)。各パスには`serviceName`と`servicePort`で定義されるバックエンドが関連づけられます。ロードバランサーがトラフィックを関連づけられたServiceに転送するために、外部からくるリクエストのホスト名とパスが条件と一致させる必要があります。
* [Serviceドキュメント](/ja/docs/concepts/services-networking/service/)または{{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}による[カスタムリソースバックエンド](#resource-backend)に書かれているように、バックエンドはServiceとポート名の組み合わせとなります。Ingressで設定されたホスト名とパスのルールに一致するHTTP(とHTTPS)のリクエストは、リスト内のバックエンドに対して送信されます。

Ingressコントローラーでは、`defaultBackend`が設定されていることがあります。これはSpec内で指定されているパスに一致しないようなリクエストのためのバックエンドです。

### デフォルトのバックエンド {#default-backend}

ルールが設定されていないIngressは、全てのトラフィックをデフォルトのバックエンドに転送します。`defaultBackend`は、[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)のオプション設定であり、Ingressリソースでは指定されていません。

HTTPリクエストがIngressオブジェクトのホスト名とパスの条件に1つも一致しない時、そのトラフィックはデフォルトのバックエンドに転送されます。

### リソースバックエンド {#resource-backend}

`Resource`バックエンドはIngressオブジェクトと同じnamespaceにある他のKubernetesリソースを指すObjectRefです。
`Resource`はServiceの設定とは排他であるため、両方を指定するとバリデーションに失敗します。
`Resource`バックエンドのよくある用途は、静的なアセットが入ったオブジェクトストレージを設定することです。

{{< codenew file="service/networking/ingress-resource-backend.yaml" >}}

上記のIngressを作成した後に、次のコマンドで参照することができます。

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### パスのタイプ

Ingressのそれぞれのパスは対応するパスのタイプを持ちます。`pathType`が明示的に指定されていないパスはバリデーションに通らないでしょう。サポートされているパスのタイプは3種類あります。

* `ImplementationSpecific`: このパスタイプでは、パスとの一致はIngressClassに依存します。Ingressの実装はこれを独立した`pathType`と扱うことも、`Prefix`や`Exact`と同一のパスタイプと扱うこともできます。

* `Exact`: 大文字小文字を区別して完全に一致するURLパスと一致します。

* `Prefix`: `/`で分割されたURLと前方一致で一致します。大文字小文字は区別され、パスの要素対要素で比較されます。パス要素は`/`で分割されたパスの中のラベルのリストを参照します。リクエストがパス _p_ に一致するのは、Ingressのパス _p_ がリクエストパス _p_ と要素単位で前方一致する場合です。
  
  {{< note >}}
  パスの最後の要素がリクエストパスの最後の要素の部分文字列である場合、これは一致しません（例えば、`/foo/bar`は`/foo/bar/baz`と一致しますが、`/foo/barbaz`とは一致しません）。
  {{< /note >}}

### 例

| タイプ | パス                            | リクエストパス                | 一致するか                           |
|--------|---------------------------------|-------------------------------|--------------------------------------|
| Prefix | `/`                             | （全てのパス）                | はい                                 |
| Exact  | `/foo`                          | `/foo`                        | はい                                 |
| Exact  | `/foo`                          | `/bar`                        | いいえ                               |
| Exact  | `/foo`                          | `/foo/`                       | いいえ                               |
| Exact  | `/foo/`                         | `/foo`                        | いいえ                               |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | はい                                 |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | はい                                 |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | いいえ                               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | はい                                 |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | はい、末尾のスラッシュは無視         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | はい、末尾のスラッシュと一致         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | はい、パスの一部と一致               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | いいえ、接頭辞と一致しない           |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | はい、接頭辞`/aaa`と一致             |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | はい、接頭辞`/aaa/bbb`と一致         |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | はい、接頭辞`/`と一致                |
| Prefix | `/aaa`                          | `/ccc`                        | いいえ、デフォルトバックエンドを使用 |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | はい、Exactが優先                    |

#### 複数のパスとの一致

リクエストがIngressの複数のパスと一致することがあります。そのような場合は、最も長くパスが一致したものが優先されます。2つのパスが同等に一致した場合は、完全一致が前方一致よりも優先されます。

## ホスト名のワイルドカード

ホストは正確に一致する（例えば`foo.bar.com`）かワイルドカード（例えば`*.foo.com`）とすることができます。
正確な一致ではHTTPヘッダーの`host`が`host`フィールドと一致することが必要です。
ワイルドカードによる一致では、HTTPヘッダーの`host`がワイルドカードルールに沿って後方一致することが必要です。

| Host        | Hostヘッダー      | 一致するか                                                  |
| ----------- |-------------------| ------------------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | 共通の接尾辞により一致                                      |
| `*.foo.com` | `baz.bar.foo.com` | 一致しない。ワイルドカードは単一のDNSラベルのみを対象とする |
| `*.foo.com` | `foo.com`         | 一致しない。ワイルドカードは単一のDNSラベルのみを対象とする |

{{< codenew file="service/networking/ingress-wildcard-host.yaml" >}}

## Ingress Class

Ingressは異なったコントローラーで実装されうるため、しばしば異なった設定を必要とします。
IngressClassリソースは、この種別のIngressを実装すべきコントローラーの名称を含む追加の設定情報を含みます。各IngressはIngressClassリソースへの参照によって種別を指定すべきです。

{{< codenew file="service/networking/external-lb.yaml" >}}

IngressClassリソースは任意のパラメータフィールドを含むことができます。これは追加の設定情報を参照するために利用することができます。

### 非推奨のアノテーション

Kubernetes 1.18でIngressClassリソースと`ingressClassName`フィールドが追加される前は、Ingressの種別はIngressの`kubernetes.io/ingress.class`アノテーションにより指定されていました。
このアノテーションは正式に定義されたことはありませんが、Ingressコントローラーに広くサポートされています。

Ingressの新しい`ingressClassName`フィールドはこのアノテーションを置き換えるものですが、完全に等価ではありません。
アノテーションは一般にIngressを実装すべきIngressのコントローラーの名称を示していましたが、フィールドはIngressClassリソースを示しており、これはIngressのコントローラーの名称を含む追加のIngressの設定情報を持ちます。

### デフォルトのIngressClass {#default-ingress-class}

特定のIngressClassをクラスターでのデフォルトとすることができます。
IngressClassリソースの`ingressclass.kubernetes.io/is-default-class`アノテーションを`true`に設定すると、`ingressClassName`フィールドが指定されないIngressにはこのデフォルトIngressClassが割り当てられるようになります。

{{< caution >}}
複数のIngressClassをクラスターのデフォルトに設定すると、アドミッションコントローラーは`ingressClassName`が指定されていないIngressオブジェクトの作成を防ぐようになります。クラスターのデフォルトのIngressClassを1つ以下にすることで、これを解消することができます。
{{< /caution >}}

## Ingressのタイプ

### 単一ServiceのIngress {#single-service-ingress}

Kubernetesには、単一のServiceを公開できるようにする既存の概念があります（[Ingressの代替案](#alternatives)を参照してください）。ルールなしで*デフォルトのバックエンド* を指定することにより、Ingressでこれを実現することもできます。

{{< codenew file="service/networking/test-ingress.yaml" >}}

`kubectl apply -f`を実行してIngressを作成すると、その作成したIngressの状態を確認することができます。

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

`203.0.113.123`はIngressコントローラーによって割り当てられたIPで、作成したIngressを利用するためのものです。

{{< note >}}
IngressコントローラーとロードバランサーがIPアドレス割り当てるのに1、2分ほどかかります。この間、ADDRESSの情報は`<pending>`となっているのを確認できます。
{{< /note >}}

### リクエストのシンプルなルーティング

ファンアウト設定では単一のIPアドレスのトラフィックを、リクエストされたHTTP URIに基づいて1つ以上のServiceに転送します。Ingressによってロードバランサーの数を少なくすることができます。例えば、以下のように設定します。

{{< mermaid >}}
graph LR;
  client([クライアント])-. Ingress管理下の <br> ロードバランサー .->ingress[Ingress, 178.91.123.132];
  ingress-->|/foo|service1[Service service1:4200];
  ingress-->|/bar|service2[Service service2:8080];
  subgraph cluster[クラスター]
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

Ingressを以下のように設定します。

{{< codenew file="service/networking/simple-fanout-example.yaml" >}}

Ingressを`kubectl apply -f`によって作成したとき:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

IngressコントローラーはService(`service1`、`service2`)が存在する限り、Ingressの条件を満たす実装固有のロードバランサーを構築します。
構築が完了すると、ADDRESSフィールドでロードバランサーのアドレスを確認できます。

{{< note >}}
使用する[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)に依存しますが、default-http-backend[Service](/ja/docs/concepts/services-networking/service/)の作成が必要な場合があります。
{{< /note >}}

### 名前ベースのバーチャルホスティング

名前ベースのバーチャルホストは、HTTPトラフィックを同一のIPアドレスの複数のホスト名に転送することをサポートしています。

{{< mermaid >}}
graph LR;
  client([クライアント])-. Ingress管理下の <br> ロードバランサー .->ingress[Ingress, 178.91.123.132];
  ingress-->|Host: foo.bar.com|service1[Service service1:80];
  ingress-->|Host: bar.foo.com|service2[Service service2:80];
  subgraph cluster[クラスター]
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

以下のIngress設定は、ロードバランサーに対して、[Hostヘッダー](https://tools.ietf.org/html/rfc7230#section-5.4)に基づいてリクエストを転送するように指示するものです。

{{< codenew file="service/networking/name-virtual-host-ingress.yaml" >}}

rules項目でのホストの設定がないIngressを作成すると、IngressコントローラーのIPアドレスに対するwebトラフィックは、要求されている名前ベースのバーチャルホストなしにマッチさせることができます。

例えば、以下のIngressは`first.bar.com`に対するトラフィックを`service1`へ、`second.foo.com`に対するトラフィックを`service2`へ、リクエストにおいてホスト名が指定されていない(リクエストヘッダーがないことを意味します)トラフィックは`service3`へ転送します。

{{< codenew file="service/networking/name-virtual-host-ingress-no-third-host.yaml" >}}

### TLS

TLSの秘密鍵と証明書を含んだ{{< glossary_tooltip term_id="secret" >}}を指定することにより、Ingressをセキュアにできます。Ingressは単一のTLSポートである443番ポートのみサポートし、IngressでTLS終端を行うことを想定しています。IngressからServiceやPodへのトラフィックは平文です。IngressのTLS設定のセクションで異なるホストを指定すると、それらのホストはSNI TLSエクステンション(IngressコントローラーがSNIをサポートしている場合)を介して指定されたホスト名に対し、同じポート上で多重化されます。TLSのSecretは`tls.crt`と`tls.key`というキーを含む必要があり、TLSを使用するための証明書と秘密鍵を含む値となります。以下がその例です。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

IngressでこのSecretを参照すると、クライアントとロードバランサー間の通信にTLSを使用するようIngressコントローラーに指示することになります。作成したTLS Secretは、`https-example.foo.com`の完全修飾ドメイン名(FQDN)とも呼ばれる共通名(CN)を含む証明書から作成したものであることを確認する必要があります。

{{< note >}}
デフォルトルールではTLSが機能しない可能性があることに注意してください。
これは取り得る全てのサブドメインに対する証明書を発行する必要があるからです。
そのため、`tls`セクションの`hosts`は`rules`セクションの`host`と明示的に一致する必要があります。
{{< /note >}}

{{< codenew file="service/networking/tls-example-ingress.yaml" >}}

{{< note >}}
サポートされるTLSの機能はIngressコントローラーによって違いがあります。利用する環境でTLSがどのように動作するかを理解するためには、[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)や、[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)、他のプラットフォーム固有のIngressコントローラーのドキュメントを確認してください。
{{< /note >}}

### 負荷分散 {#load-balancing}

Ingressコントローラーは、負荷分散アルゴリズムやバックエンドの重みスキームなど、すべてのIngressに適用されるいくつかの負荷分散ポリシーの設定とともにブートストラップされます。発展した負荷分散のコンセプト(例: セッションの永続化、動的重み付けなど)はIngressによってサポートされていません。代わりに、それらの機能はService用のロードバランサーを介して利用できます。

Ingressによってヘルスチェックの機能が直接に公開されていない場合でも、Kubernetesにおいて、同等の機能を提供する[Readiness Probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)のようなコンセプトが存在することは注目に値します。コントローラーがどのようにヘルスチェックを行うかについては、コントローラーのドキュメントを参照してください(例えば[nginx](https://git.k8s.io/ingress-nginx/README.md)、または[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))。

## Ingressの更新

リソースを編集することで、既存のIngressに対して新しいホストを追加することができます。

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

このコマンドを実行すると既存の設定をYAMLフォーマットで編集するエディターが表示されます。新しいホストを追加するために、リソースを修正してください。

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

変更を保存した後、kubectlはAPIサーバー内のリソースを更新し、Ingressコントローラーに対してロードバランサーの再設定を指示します。

変更内容を確認してください。

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

修正されたIngressのYAMLファイルに対して`kubectl replace -f`を実行することで、同様の結果を得られます。

## アベイラビリティーゾーンをまたいだ障害について

障害のあるドメインをまたいでトラフィックを分散する手法は、クラウドプロバイダーによって異なります。詳細に関して、[Ingress コントローラー](/ja/docs/concepts/services-networking/ingress-controllers)のドキュメントを参照してください。

## Ingressの代替案 {#alternatives}

Ingressリソースを直接含まない複数の方法でサービスを公開できます。

* [Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)
* [Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#nodeport)


## {{% heading "whatsnext" %}}
* [Ingress API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io)について学ぶ
* [Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)について学ぶ
* [MinikubeとNGINXコントローラーでIngressのセットアップを行う](/docs/tasks/access-application-cluster/ingress-minikube/)
