---
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.1" state="beta" >}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}

## 用語

まずわかりやすくするために、このガイドでは次の用語を定義します。

- ノード: Kubernetes内のワーカーマシンで、クラスターの一部です。

- クラスター: Kubernetesによって管理されているコンテナ化されたアプリケーションを実行させるノードのセットです。この例や、多くのKubernetesによるデプロイでは、クラスター内のノードはパブリックインターネットとして公開されていません。  
  
- エッジルーター: クラスターでファイアウォールのポリシーを強制するルーターです。エッジルーターはクラウドプロバイダーやハードウェアの物理的な一部として管理されたゲートウェイとなります。

- クラスターネットワーク: 物理的または論理的なリンクのセットで、Kubernetesの[ネットワークモデル](/docs/concepts/cluster-administration/networking/)によって、クラスター内でのコミュニケーションを司るものです。

- Service: {{< glossary_tooltip text="ラベル" term_id="label" >}}セレクターを使ったPodのセットを特定するKubernetes {{< glossary_tooltip term_id="service" >}}です。特に言及がない限り、Serviceはクラスターネットワーク内でのみ疎通可能な仮想IPを持つと想定されます。

## Ingressとは何か

Ingressはクラスター外からクラスター内{{< link text="Service" url="/ja/docs/concepts/services-networking/service/" >}}へのHTTPとHTTPSのルートを公開します。トラフィックのルーティングはIngressリソース上で定義されるルールによって制御されます。

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

IngressはServiceに対して、外部疎通できるURL、負荷分散トラフィック、SSL/TLS終端の機能や、名前ベースの仮想ホスティングを提供するように構成できます。[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)は通常はロードバランサーを使用してIngressの機能を実現しますが、エッジルーターや、追加のフロントエンドを構成してトラフィックの処理を支援することもできます。

Ingressは任意のポートやプロトコルを公開しません。HTTPやHTTPS以外のServiceをインターネットに公開するときは、[Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#nodeport)や[Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)のServiceタイプを使用することが多いです。

## Ingressを使用する上での前提条件

Ingressの機能を提供するために[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)を用意する必要があります。Ingressリソースを作成するのみでは何の効果もありません。

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)のようなIngressコントローラーのデプロイが必要な場合があります。ユーザーはいくつかの[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)の中から選択できます。

理想的には、全てのIngressコントローラーはリファレンスの仕様を満たすべきです。しかし実際には、いくつかのIngressコントローラーは微妙に異なる動作をします。

{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点について理解してください。
{{< /note >}}

## Ingressリソース

Ingressリソースの最小構成の例は下記のとおりです。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

他の全てのKubernetesリソースと同様に、Ingressは`apiVersion`、`kind`や`metadata`フィールドが必要です。設定ファイルの利用に関する一般的な情報は、[アプリケーションのデプロイ](/docs/tasks/run-application/run-stateless-application-deployment/)、[コンテナーの設定](/docs/tasks/configure-pod-container/configure-pod-configmap/)、[リソースの管理](/docs/concepts/cluster-administration/manage-deployment/)を参照してください。  
Ingressでは、Ingressコントローラーに依存しているいくつかのオプションの設定をするためにアノテーションを使うことが多いです。その例としては、[rewrite-targetアノテーション](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)などがあります。  
[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)の種類が異なれば、サポートするアノテーションも異なります。サポートされているアノテーションについて学ぶために、ユーザーが使用するIngressコントローラーのドキュメントを確認してください。

Ingress [Spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)は、ロードバランサーやプロキシーサーバーを設定するために必要な全ての情報を持っています。最も重要なものとして、外部からくる全てのリクエストに対して一致したルールのリストを含みます。IngressリソースはHTTPトラフィックに対してのルールのみサポートしています。

### Ingressのルール

各HTTPルールは下記の情報を含みます。

* オプションで設定可能なホスト名。上記のリソースの例では、ホスト名が指定されていないと、そのルールは指定されたIPアドレスを経由する全てのインバウンドHTTPトラフィックに適用されます。ホスト名が指定されていると(例: foo.bar.com)、そのルールはホストに対して適用されます。
* パスのリスト(例: `/testpath`)。各パスには`serviceName`と`servicePort`で定義されるバックエンドが関連づけられます。ロードバランサーがトラフィックを関連づけられたServiceに転送するために、外部からくるリクエストのホスト名とパスが条件と一致させる必要があります。
* [Serviceドキュメント](/ja/docs/concepts/services-networking/service/)に書かれているように、バックエンドはServiceとポート名の組み合わせとなります。Ingressで設定されたホスト名とパスのルールに一致するHTTP(とHTTPS)のリクエストは、リスト内のバックエンドに対して送信されます。

Ingressコントローラーでは、デフォルトのバックエンドが設定されていることがあります。これはSpec内で指定されているパスに一致しないようなリクエストのためのバックエンドです。

### デフォルトのバックエンド

ルールが設定されていないIngressは、全てのトラフィックをデフォルトのバックエンドに転送します。このデフォルトのバックエンドは、[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)のオプション設定であり、Ingressリソースでは指定されていません。

IngressオブジェクトでHTTPリクエストが1つもホスト名とパスの条件に一致しない時、そのトラフィックはデフォルトのバックエンドに転送されます。

## Ingressのタイプ

### 単一ServiceのIngress
ユーザーは単一のServiceを公開できるという、Kubernetesのコンセプトがあります([Ingressの代替案](#alternatives)を参照してください)。
また、Ingressでこれを実現できます。それはルールを設定せずに*デフォルトのバックエンド* を指定することにより可能です。

{{< codenew file="service/networking/ingress.yaml" >}}

`kubectl apply -f`を実行してIngressを作成し、その作成したIngressの状態を確認することができます。

```shell
kubectl get ingress test-ingress
```

```
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

`107.178.254.228`はIngressコントローラーによって割り当てられたIPで、このIngressを利用するためのものです。

{{< note >}}
IngressコントローラーとロードバランサーがIPアドレス割り当てるのに1、2分ほどかかります。この間、ADDRESSの情報は`<pending>`となっているのを確認できます。
{{< /note >}}

### リクエストのシンプルなルーティング

ファンアウト設定では単一のIPアドレスのトラフィックを、リクエストされたHTTP URIに基づいて1つ以上のServiceに転送します。Ingressによって、ユーザーはロードバランサーの数を少なくできます。例えば、下記のように設定します。

```none
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

Ingressを下記のように設定します。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

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
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

IngressコントローラーはService(`service1`、`service2`)が存在する限り、Ingressの条件を満たす実装固有のロードバランサーを構築します。
構築が完了すると、ADDRESSフィールドでロードバランサーのアドレスを確認できます。

{{< note >}}
ユーザーが使用している[Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers)に依存しますが、ユーザーはdefault-http-backend[Service](/ja/docs/concepts/services-networking/service/)の作成が必要な場合があります。
{{< /note >}}

### 名前ベースの仮想ホスティング

名前ベースの仮想ホストは、HTTPトラフィックを同一のIPアドレスの複数のホスト名に転送することをサポートしています。

```none
foo.bar.com --|                 |-> foo.bar.com service1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com service2:80
```

下記のIngress設定は、ロードバランサーに対して、[Hostヘッダー](https://tools.ietf.org/html/rfc7230#section-5.4)に基づいてリクエストを転送するように指示するものです。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

rules項目でのホストの設定がないIngressを作成すると、IngressコントローラーのIPアドレスに対するwebトラフィックは、要求されている名前ベースの仮想ホストなしにマッチさせることができます。

例えば、下記のIngressリソースは`first.bar.com`に対するトラフィックを`service1`へ、`second.foo.com`に対するトラフィックを`service2`へ、リクエストにおいてホスト名が指定されていない(リクエストヘッダーがないことを意味します)トラフィックは`service3`へ転送します。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS

TLSの秘密鍵と証明書を含んだ{{< glossary_tooltip term_id="secret" >}}を指定することにより、Ingressをセキュアにできます。現在Ingressは単一のTLSポートである443番ポートのみサポートし、TLS終端を行うことを想定しています。IngressのTLS設定のセクションで異なるホストを指定すると、それらのホストはSNI TLSエクステンション(IngressコントローラーがSNIをサポートしている場合)を介して指定されたホスト名に対し、同じポート上で多重化されます。TLSのSecretは`tls.crt`と`tls.key`というキーを含む必要があり、TLSを使用するための証明書と秘密鍵を含む値となります。下記が例となります。

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

IngressでこのSecretを参照すると、クライアントとロードバランサー間の通信にTLSを使用するようIngressコントローラーに指示することになります。作成したTLS Secretは、`sslexample.foo.com`の完全修飾ドメイン名(FQDN)とも呼ばれる共通名(CN)を含む証明書から作成したものであることを確認する必要があります。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< note >}}
Ingressコントローラーによって、サポートされるTLSの機能に違いがあります。利用する環境でTLSがどのように動作するかを理解するために、[nginx](https://git.k8s.io/ingress-nginx/README.md#https)や、[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)、他のプラットフォーム固有のIngressコントローラーのドキュメントを確認してください。
{{< /note >}}

### 負荷分散

Ingressコントローラーは、負荷分散アルゴリズムやバックエンドの重みスキームなど、すべてのIngressに適用されるいくつかの負荷分散ポリシーの設定とともにブートストラップされます。発展した負荷分散のコンセプト(例: セッションの永続化、動的重み付けなど)はIngressによってサポートされていません。代わりに、それらの機能はService用のロードバランサーを介して利用できます。

Ingressによってヘルスチェックの機能が直接に公開されていない場合でも、Kubernetesにおいて、同等の機能を提供する[Readiness Probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)のようなコンセプトが存在することは注目に値します。コントローラーがどのようにヘルスチェックを行うかについては、コントローラーのドキュメントを参照してください([nginx](https://git.k8s.io/ingress-nginx/README.md)、[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))。

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
          serviceName: service1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
        path: /foo
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

障害のあるドメインをまたいでトラフィックを分散する手法は、クラウドプロバイダーによって異なります。詳細に関して、[Ingress コントローラー](/docs/concepts/services-networking/ingress-controllers)のドキュメントを参照してください。複数のクラスターにおいてIngressをデプロイする方法の詳細に関しては[Kubernetes Cluster Federationのドキュメント](https://github.com/kubernetes-sigs/federation-v2)を参照してください。

## 将来追加予定の内容

Ingressと関連するリソースの今後の開発については[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)で行われている議論を確認してください。様々なIngressコントローラーの開発については[Ingress リポジトリー](https://github.com/kubernetes/ingress/tree/master)を確認してください。

## Ingressの代替案 {#alternatives}

Ingressリソースに直接関与しない複数の方法でServiceを公開できます。

下記の2つの使用を検討してください。
* [Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)
* [Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#nodeport)

{{% /capture %}}

{{% capture whatsnext %}}
* [Ingressコントローラー](/docs/concepts/services-networking/ingress-controllers/)について学ぶ
* [MinikubeとNGINXコントローラーでIngressのセットアップを行う](/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}
