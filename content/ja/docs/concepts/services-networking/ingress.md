---
title: Ingress
content_type: concept
weight: 30
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
* クラスターネットワーク: 物理的または論理的な繋がりの集合で、Kubernetesの[ネットワークモデル](/ja/docs/concepts/cluster-administration/networking/)によって、クラスター内でのコミュニケーションを司るものです。
* Service: {{< glossary_tooltip text="ラベル" term_id="label" >}}セレクターを使ったPodの集合を特定するKubernetes {{< glossary_tooltip term_id="service" >}}です。特に指定がない限り、Serviceはクラスターネットワーク内でのみ疎通可能な仮想IPを持つものとして扱われます。

## Ingressとは何か

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)はクラスター外からクラスター内{{< link text="Service" url="/ja/docs/concepts/services-networking/service/" >}}へのHTTPとHTTPSのルートを公開します。トラフィックのルーティングはIngressリソース上で定義されるルールによって制御されます。

全てのトラフィックを単一のServiceに送る単純なIngressの例を示します。

{{< figure src="/ja/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="図. Ingress" link="https://mermaid.live/edit#pako:eNqNkstKAzEUhl8lpBuFGan1gqTSlS4EF6LLTheZScaGzo0k4wV14QyI4qav4GUjYhVEUBB8mAh9DTNNalvcuEnCn_P95-TknMAgJRQi6CX7HGddsL3b9BIAgojRRM61VfGsygdV3KviVpWvqrzszLsLYEtHUyGGg5th_-L7_VqdD8C6z1tAlU-q_FTllSr7FaiR4k0rYMFtMQO1LdwZJbKi67ZOVfk4Yi9UcTcCX8bK46mg_IAFtL1ndsOK3DdFB1EuJOW_1X6o4kuDnakEBjC0TpalZLG9k5LOX70x0WlCTDOwEBs0BFmEWQJCFkWoRghxhORpj6JaGIb27B4yIrtoOTtygjRKOarV6_XmjElvTViLpcZqQFf-5aLvZl3sk63TBEU13_dnbRoTG5Nx4jTujmM74FR9qZZGVeZUnJkH04AZ2VRhd33jJdCBMeUxZkSP1UkV60HZpTH1INJHQkOcR9LTE3emQ3Eu073jJIBI8pw6MM8IlnSDYf2zMUQhjsSvukmYTLkVz34Au18T9A" >}}

IngressはServiceに対して、外部疎通できるURL、負荷分散トラフィック、SSL/TLS終端の機能や、名前ベースの仮想ホスティングを提供するように設定できます。[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)は通常はロードバランサーを使用してIngressの機能を実現しますが、エッジルーターや、追加のフロントエンドを構成してトラフィックの処理を支援することもできます。

Ingressは任意のポートやプロトコルを公開しません。HTTPやHTTPS以外のServiceをインターネットに公開する場合、[Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#type-nodeport)や[Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)のServiceタイプを一般的には使用します。

## Ingressを使用する上での前提条件

Ingressを提供するためには[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)が必要です。Ingressリソースを作成するのみでは何の効果もありません。

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)のようなIngressコントローラーのデプロイが必要な場合があります。いくつかの[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)の中から選択してください。

理想的には、全てのIngressコントローラーはリファレンスの仕様を満たすはずです。しかし実際には、各Ingressコントローラーは微妙に異なる動作をします。

{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点について理解してください。
{{< /note >}}

## Ingressリソース

Ingressリソースの最小構成の例は以下のとおりです。

{{% codenew file="service/networking/minimal-ingress.yaml" %}}

Ingressには`apiVersion`、`kind`、`metadata`や`spec`フィールドが必要です。Ingressオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。設定ファイルに関する一般的な情報は、[アプリケーションのデプロイ](/ja/docs/tasks/run-application/run-stateless-application-deployment/)、[コンテナの設定](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)、[リソースの管理](/ja/docs/concepts/cluster-administration/manage-deployment/)を参照してください。Ingressでは、Ingressコントローラーに依存しているいくつかのオプションの設定をするためにアノテーションを一般的に使用します。例としては、[rewrite-targetアノテーション](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md)などがあります。[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)の種類が異なれば、サポートするアノテーションも異なります。サポートされているアノテーションについて学ぶためには、使用するIngressコントローラーのドキュメントを確認してください。

Ingress [Spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)は、ロードバランサーやプロキシサーバーを設定するために必要な全ての情報を持っています。最も重要なものとして、外部からくる全てのリクエストに対して一致したルールのリストを含みます。IngressリソースはHTTP(S)トラフィックに対してのルールのみサポートしています。

`ingressClassName`が省略された場合、[デフォルトのIngressClass](#default-ingress-class)を定義する必要があります。

デフォルトの`IngressClass`を定義しなくても動作するIngressコントローラーがいくつかあります。例えば、Ingress-NGINXコントローラーは[フラグ](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`で設定できます。ただし、[下記](#default-ingress-class)のようにデフォルトの`IngressClass`を指定することを[推奨します](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)。

### Ingressのルール

各HTTPルールは以下の情報を含みます。

* オプションで設定可能なホスト名。上記のリソースの例では、ホスト名が指定されていないので、そのルールは指定されたIPアドレスを経由する全てのインバウンドHTTPトラフィックに適用されます。ホスト名が指定されていると(例: foo.bar.com)、そのルールは指定されたホストに対して適用されます。
* パスのリスト(例: `/testpath`)。各パスには`service.name`と`service.port.name`または`service.port.number`で定義されるバックエンドが関連づけられます。ロードバランサーがトラフィックを関連づけられたServiceに転送するために、外部からくるリクエストのホスト名とパスが条件と一致させる必要があります。
* バックエンドは[Serviceドキュメント](/ja/docs/concepts/services-networking/service/)に書かれているようなService名とポート名の組み合わせ、または{{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}による[カスタムリソースバックエンド](#resource-backend)です。Ingressで設定されたホスト名とパスのルールに一致するHTTP(とHTTPS)のリクエストは、リスト内のバックエンドに対して送信されます。

Ingressコントローラーでは、`defaultBackend`が設定されていることがあります。これはSpec内で指定されているパスに一致しないようなリクエストのためのバックエンドです。

### デフォルトのバックエンド {#default-backend}

ルールが設定されていないIngressは、全てのトラフィックを単一のデフォルトのバックエンドに転送します。`.spec.defaultBackend`はその場合にリクエストを処理するバックエンドになります。`defaultBackend`は、[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers)のオプション設定であり、Ingressリソースでは指定されていません。`.spec.rules`を設定しない場合、`.spec.defaultBackend`の設定は必須です。`defaultBackend`が設定されていない場合、どのルールにもマッチしないリクエストの処理は、Ingressコントローラーに任されます(このケースをどう処理するかは、お使いのIngressコントローラーのドキュメントを参照してください)。

HTTPリクエストがIngressオブジェクトのホスト名とパスの条件に1つも一致しない時、そのトラフィックはデフォルトのバックエンドに転送されます。

### リソースバックエンド {#resource-backend}

`Resource`バックエンドはIngressオブジェクトと同じnamespaceにある他のKubernetesリソースを指すObjectRefです。
`Resource`はServiceの設定とは排他であるため、両方を指定するとバリデーションに失敗します。
`Resource`バックエンドの一般的な用途は、静的なアセットが入ったオブジェクトストレージバックエンドにデータを導入することです。

{{% codenew file="service/networking/ingress-resource-backend.yaml" %}}

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

Ingressのそれぞれのパスは対応するパスのタイプを持ちます。`pathType`が明示的に指定されていないパスはバリデーションに通りません。サポートされているパスのタイプは3種類あります。

* `ImplementationSpecific`(実装に特有): このパスタイプでは、パスとの一致はIngressClassに依存します。Ingressの実装はこれを独立した`pathType`と扱うことも、`Prefix`や`Exact`と同一のパスタイプと扱うこともできます。

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

{{% codenew file="service/networking/ingress-wildcard-host.yaml" %}}

## Ingress Class

Ingressは異なったコントローラーで実装されうるため、しばしば異なった設定を必要とします。
各Ingressはクラス、つまりIngressClassリソースへの参照を指定する必要があります。IngressClassリソースには、このクラスを実装するコントローラーの名前などの追加設定が含まれています。

{{% codenew file="service/networking/external-lb.yaml" %}}

IngressClassの`.spec.parameters`フィールドを使って、そのIngressClassに関連する設定を持っている別のリソースを参照することができます。

使用するパラメーターの種類は、IngressClassの`.spec.controller`フィールドで指定したIngressコントローラーに依存します。

### IngressClassスコープ

Ingressコントローラーによっては、クラスター全体で設定したパラメーターを使用できる場合もあれば、1つのNamespaceに対してのみ設定したパラメーターを使用できる場合もあります。

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="クラスタースコープ" %}}
IngressClassパラメーターのデフォルトのスコープは、クラスター全体です。

`.spec.parameters`フィールドを設定して`.spec.parameters.scope`フィールドを設定しなかった場合、または`.spec.parameters.scope`を`Cluster`に設定した場合、IngressClassはクラスタースコープのリソースを参照します。
パラーメーターの`kind`(および`apiGroup`)はクラスタースコープのAPI(カスタムリソースの場合もあり)を指し、パラメーターの`name`はそのAPIの特定のクラスタースコープのリソースを特定します。

例えば:
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # このIngressClassのパラメーターは「external-config-1」という名前の
    # ClusterIngressParameter(APIグループk8s.example.net)で指定されています。この定義は、Kubernetesに
    # クラスタースコープのパラメーターリソースを探すように指示しています。
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```
{{% /tab %}}
{{% tab name="Namespaceスコープ" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

`.spec.parameters`フィールドを設定して`.spec.parameters.scope`フィールドを`Namespace`に設定した場合、IngressClassはNamespaceスコープのリソースを参照します。また`.spec.parameters`内の`namespace`フィールドには、使用するパラメーターが含まれているNamespaceを設定する必要があります。

パラメーターの`kind`(および`apiGroup`)はNamespaceスコープのAPI(例えば:ConfigMap)を指し、パラメーターの`name`は`namespace`で指定したNamespace内の特定のリソースを特定します。

Namespaceスコープのパラメーターはクラスターオペレーターがワークロードに使用される設定(例えば:ロードバランサー設定、APIゲートウェイ定義)に対する制御を委譲するのに役立ちます。クラスタースコープパラメーターを使用した場合は以下のいずれかになります:

- クラスターオペレーターチームは、新しい設定変更が適用されるたびに、別のチームの変更内容を承認する必要があります。
- クラスターオペレーターは、アプリケーションチームがクラスタースコープのパラメーターリソースに変更を加えることができるように、[RBAC](/ja/docs/reference/access-authn-authz/rbac/)のRoleやRoleBindingといった、特定のアクセス制御を定義する必要があります。

IngressClass API自体は常にクラスタースコープです。

以下はNamespaceスコープのパラメーターを参照しているIngressClassの例です:
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # このIngressClassのパラメーターは「external-config」という名前の
    # IngressParameter(APIグループk8s.example.com)で指定されています。
    # このリソースは「external-configuration」というNamespaceにあります。
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### 非推奨のアノテーション

Kubernetes 1.18でIngressClassリソースと`ingressClassName`フィールドが追加される前は、Ingressの種別はIngressの`kubernetes.io/ingress.class`アノテーションにより指定されていました。
このアノテーションは正式に定義されたことはありませんが、Ingressコントローラーに広くサポートされています。

Ingressの新しい`ingressClassName`フィールドはこのアノテーションを置き換えるものですが、完全に等価ではありません。
アノテーションは一般にIngressを実装すべきIngressのコントローラーの名称を示していましたが、フィールドはIngressClassリソースへの参照であり、Ingressのコントローラーの名称を含む追加のIngressの設定情報を含んでいます。

### デフォルトのIngressClass {#default-ingress-class}

特定のIngressClassをクラスターのデフォルトとしてマークすることができます。
IngressClassリソースの`ingressclass.kubernetes.io/is-default-class`アノテーションを`true`に設定すると、`ingressClassName`フィールドが指定されないIngressにはこのデフォルトIngressClassが割り当てられるようになります。

{{< caution >}}
複数のIngressClassをクラスターのデフォルトに設定すると、アドミッションコントローラーは`ingressClassName`が指定されていない新しいIngressオブジェクトを作成できないようにします。クラスターのデフォルトIngressClassを1つ以下にすることで、これを解消することができます。
{{< /caution >}}

Ingressコントローラーの中には、デフォルトの`IngressClass`を定義しなくても動作するものがあります。 例えば、Ingress-NGINXコントローラーは[フラグ](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`で設定することができます。ただし、デフォルト`IngressClass`を指定することを[推奨します](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do):

{{% codenew file="service/networking/default-ingressclass.yaml" %}}

## Ingressのタイプ

### 単一ServiceのIngress {#single-service-ingress}

Kubernetesには、単一のServiceを公開できるようにする既存の概念があります（[Ingressの代替案](#alternatives)を参照してください）。ルールなしで*デフォルトのバックエンド* を指定することにより、Ingressでこれを実現することもできます。

{{% codenew file="service/networking/test-ingress.yaml" %}}

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

{{< figure src="/ja/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="図. Ingressファンアウト" link="https://mermaid.live/edit#pako:eNqNUk1v1DAQ_SuW9wJSEhJngcWL9lQOSBwQPW724MRO12o2jmyHD7U9kEgIxKV_AcSFA-WAkEBC4scYqX8Dp3a6XQoSF3s0b96bmac5goWgDGJ4IEmzBo-ezLMagKLirNY3lqb7bPqPpvtguvem_2L616ubYQQe1geSKXV-9u789NWvb2_NyzNwP5cLYPpPpv9h-jemPx2IltJ9tRkQhQvuSEtPDkBydxbdS6IEpVGSotVFY18UhovjW6UQx4rJp7xgyXLfBWBM4CmK4-ucnMiRg_7kIDyLZ56j2twtXFSt0kxebvrddD_twKsrwo7g-9oujaDJ8rGgq78A6BqAHJD-C5huAVZTZz5Rao-VoKkIr0HJqwpPKKWB0lIcMjwpy9LH4TNO9RpPm-dBISoh8SSO4_mOyOFMeYkU3SnY7f9SsdiuirfJK22peJLn-a4M2sq4jlul0dFgNG0MUDCYOjwXUTo802H0K1x3k86UnbSbzP9zGMANkxvCqT3qo6Eug3rNNiyD2IaUlaStdAaz-sSWklaL_Rd1AbGWLQtg21Ci2R4n9jo2EJekUpfZB5RrIX3y5DdQxjHm" >}}

Ingressを以下のように設定します。

{{% codenew file="service/networking/simple-fanout-example.yaml" %}}

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

{{< figure src="/ja/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="図. Ingress名前ベースのバーチャルホスティング" link="https://mermaid.live/edit#pako:eNqNks1u1DAQx1_F8l5ASqKNs8Dioj0VCSQOiB43e3Bip2s1iSPb4UNtDyQSAnHpK4B66YFyQEggIfEwRupr4NTeL6ASF2c0__n9ZzzxMcwFZRDDQ0maJXjybC-tAchLzmp9a266z6a_MN256T6a_ovp3y5uhxF4XB9KptTV5Yersze_vr03ry_Bg0zOgOk_mf6H6d-Z_mwALdJ9tRkQhTPuoLmHAxDfm0b34yhGSRQnaHHd2BeF4ezkkVAag0KIKCMyykV1oph8znMWzw9cAFYJPB3fgA_oYLGFoz9xtMZVm7k15GWrNJPr-3833U97jcVWDwf4AWzDRtB4_lTQxT8E9JeAnJDcJEw2Aqup-yVEqX1WgKYkvAYFL0s8opQGSktxxPCoKAofhy841Us8aV4GuSiFxKPxeLy3Y3I0Vd4iQXdzdue_XKy26-LX5J02KB5lWbZrgzY2ruPGabXRYLW0VYCCYanDcR0lwzEZRt9i3Ut1S9lJu8n81yowgBWTFeHUPvbjoTKFeskqlkJsQ8oK0pY6hWl9aktJq8XBqzqHWMuWBbBtKNFsnxP7PiqIC1KqdfYh5VpInzz9DRXUOys" >}}

以下のIngress設定は、ロードバランサーに対して、[Hostヘッダー](https://tools.ietf.org/html/rfc7230#section-5.4)に基づいてリクエストを転送するように指示するものです。

{{% codenew file="service/networking/name-virtual-host-ingress.yaml" %}}

rules項目でのホストの設定がないIngressを作成すると、IngressコントローラーのIPアドレスに対するwebトラフィックは、要求されている名前ベースのバーチャルホストなしにマッチさせることができます。

例えば、以下のIngressは`first.bar.com`に対するトラフィックを`service1`へ、`second.foo.com`に対するトラフィックを`service2`へ、リクエストにおいてホスト名が指定されていない(リクエストヘッダーがないことを意味します)トラフィックは`service3`へ転送します。

{{% codenew file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

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

{{% codenew file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
サポートされるTLSの機能はIngressコントローラーによって違いがあります。利用する環境でTLSがどのように動作するかを理解するためには、[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)や、[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)、または他のプラットフォーム固有のIngressコントローラーのドキュメントを確認してください。
{{< /note >}}

### 負荷分散 {#load-balancing}

Ingressコントローラーは、負荷分散アルゴリズムやバックエンドの重みスキームなど、すべてのIngressに適用されるいくつかの負荷分散ポリシーの設定とともにブートストラップされます。発展した負荷分散のコンセプト(例: セッションの永続化、動的重み付けなど)はIngressによってサポートされていません。代わりに、それらの機能はService用のロードバランサーを介して利用できます。

ヘルスチェックの機能はIngressによって直接には公開されていませんが、Kubernetesにおいて、同等の機能を提供する[Readiness Probe](/ja/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)のようなコンセプトが存在することは注目に値します。コントローラーがどのようにヘルスチェックを行うかについては、コントローラーのドキュメントを参照してください(例えば[nginx](https://git.k8s.io/ingress-nginx/README.md)、または[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))。

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

このコマンドを実行すると既存の設定をYAMLフォーマットで編集するエディターが表示されます。新しいホストを追加するには、リソースを修正してください。

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

Ingressリソースを直接含まずにサービスを公開する方法は複数あります。

* [Service.Type=LoadBalancer](/ja/docs/concepts/services-networking/service/#loadbalancer)
* [Service.Type=NodePort](/ja/docs/concepts/services-networking/service/#type-nodeport)


## {{% heading "whatsnext" %}}
* [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)APIについて学ぶ
* [Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)について学ぶ
* [MinikubeにNGINXコントローラーでIngressのセットアップを行う](/ja/docs/tasks/access-application-cluster/ingress-minikube/)
