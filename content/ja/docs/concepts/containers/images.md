---
title: イメージ
content_type: concept
weight: 10
hide_summary: true
---

<!-- overview -->

コンテナイメージは、アプリケーションおよびそのすべてのソフトウェア依存関係をカプセル化したバイナリデータを表します。
コンテナイメージは、スタンドアロンで実行可能なソフトウェアバンドルで、動作するためのランタイム環境が明確に規定されているのが特徴です。

通常、アプリケーションのコンテナイメージを作成してレジストリに格納し、その後、{{< glossary_tooltip text="Pod" term_id="pod" >}}から参照します。

このページでは、コンテナイメージの概要について説明します。

{{< note >}}
Kubernetesのリリース(たとえばv{{< skew latestVersion >}}のような最新のマイナーリリース)に対応するコンテナイメージを探している場合は、[Kubernetesのダウンロード](https://kubernetes.io/releases/download/)を参照してください。
{{< /note >}}

<!-- body -->

## イメージ名 {#image-names}

コンテナイメージは通常、`pause`、`example/mycontainer`、または`kube-apiserver`のような名前がつけられます。
イメージには、レジストリのホスト名を含めることもできます。たとえば、`fictional.registry.example/imagename`のようになります。また、同じようにポート番号を含めることもでき、その場合は`fictional.registry.example:10443/imagename`のようになります。

レジストリのホスト名を指定しない場合、Kubernetesは[Dockerパブリックレジストリ](https://hub.docker.com/)を意味しているものと見なします。
この挙動は、[コンテナランタイム](/docs/setup/production-environment/container-runtimes/)の設定でデフォルトのイメージレジストリを指定することで変更できます。

イメージ名の後には、_タグ_ や _ダイジェスト_ を追加できます(これは`docker`や`podman`などのコマンドを使う場合と同様です)。
タグは、同じ系列のイメージの異なるバージョンを識別するために使用します。
ダイジェストは、イメージの特定のバージョンに対する一意の識別子です。
また、ダイジェストはイメージの内容に基づくハッシュで構成され、変更不可能です。
タグは異なるイメージを指すように移動が可能ですが、ダイジェストは固定です。

イメージタグには、小文字および大文字のアルファベット、数字、アンダースコア(`_`)、ピリオド(`.`)、ハイフン(`-`)を使用できます。
タグの長さは最大128文字で、次の正規表現パターンに従う必要があります: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`。
この仕様の詳細や検証用の正規表現については、[OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories)を参照してください。
タグを指定しない場合、Kubernetesは`latest`タグを指定したものと見なします。

イメージダイジェストは、ハッシュアルゴリズム(`sha256`など)とハッシュ値で構成されます。
たとえば、`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`のようになります。
ダイジェスト形式の詳細について詳しく知りたい場合は、[OCI Image Specification](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests)を参照してください。

Kubernetesで使用可能なイメージ名の例は次のとおりです:

- `busybox` &mdash; イメージ名のみで、タグやダイジェストは指定されていません。KubernetesはDockerパブリックレジストリとlatestタグを使用します。`docker.io/library/busybox:latest`と同等です。
- `busybox:1.32.0` &mdash; タグ付きのイメージ名。KubernetesはDockerパブリックレジストリを使用します。`docker.io/library/busybox:1.32.0`と同等です。
- `registry.k8s.io/pause:latest` &mdash; カスタムレジストリとlatestタグを指定したイメージ名。
- `registry.k8s.io/pause:3.5` &mdash; カスタムレジストリと非latestタグを指定したイメージ名。
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash; ダイジェストを含むイメージ名。
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash; タグとダイジェストの両方を含むイメージ名。取得時にはダイジェストのみが使用されます。

## イメージの更新 {#updating-images}

PodTemplateを含む{{< glossary_tooltip text="Deployment" term_id="deployment" >}}、{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod、またはその他のオブジェクトを初めて作成する際に、プルポリシーが明示的に指定されていない場合、デフォルトでそのPod内のすべてのコンテナのプルポリシーは`IfNotPresent`に設定されます。
このポリシーでは、対象のイメージがすでに存在する場合、{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}はそのイメージの取得をスキップします。

### イメージプルポリシー {#image-pull-policy}

コンテナの`imagePullPolicy`とイメージのタグの両方が、[kubelet](/docs/reference/command-line-tools-reference/kubelet/)が指定されたイメージの取得(ダウンロード)を試みる _タイミング_ に影響します。

以下は、`imagePullPolicy`に設定できる値とその効果の一覧です。

`IfNotPresent`
: イメージがローカルにまだ存在しない場合にのみ取得されます。

`Always`
: kubeletがコンテナを起動するたびに、コンテナイメージレジストリに問い合わせ、イメージ名をイメージ[ダイジェスト](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)に解決します。
  kubeletがそのダイジェストに完全一致するイメージをローカルにキャッシュしている場合は、そのキャッシュされたイメージを使用します。存在しない場合は、kubeletは解決されたダイジェストのイメージを取得し、そのイメージを使ってコンテナを起動します。

`Never`
: kubeletは、イメージを取得しようとしません。何らかの理由でローカルにイメージがすでに存在する場合、kubeletはコンテナを起動しようとします。それ以外の場合、起動に失敗します。
  詳細は、[事前に取得されたイメージ](#pre-pulled-images)を参照してください。

レジストリに確実にアクセスできるのであれば、基盤となるイメージプロバイダーのキャッシュセマンティクスにより`imagePullPolicy: Always`でも効率的です。
コンテナランタイムは、イメージレイヤーがすでにノード上に存在することを認識できるため、再度ダウンロードする必要がありません。

{{< note >}}
本番環境でコンテナをデプロイする場合は、`:latest`タグの使用を避けるべきです。
実行中のイメージのバージョンを追跡するのが難しく、正しくロールバックすることがより困難になるためです。

代わりに、`v1.42.0`のような意味のあるタグやダイジェストを指定してください。
{{< /note >}}

Podが常に同じバージョンのコンテナイメージを使用するようにするためには、イメージのダイジェストを指定します。`<image-name>:<tag>`を`<image-name>@<digest>`に置き換えてください(たとえば、`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`)。

イメージタグを使用している場合、レジストリ側でそのタグが指すコードが変更されると、古いコードと新しいコードを実行するPodが混在する可能性があります。
イメージダイジェストは特定のバージョンのイメージを一意に識別するため、Kubernetesは特定のイメージ名とダイジェストが指定されたコンテナを起動するたびに同じコードを実行します。
イメージをダイジェストで指定することで、実行するコードのバージョンが固定され、レジストリ側の変更によってバージョンが混在する事態を防ぐことができます。

サードパーティ製の[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)の中には、Pod(およびPodTemplate)の作成時にそれらを変更し、実行されるワークロードがタグではなくイメージのダイジェストに基づいて定義されるようにするものがあります。
レジストリでどのようなタグの変更があっても、すべてのワークロードが必ず同じコードを実行するようにしたい場合に有用かもしれません。

#### デフォルトのイメージプルポリシー {#imagepullpolicy-defaulting}

あなた(またはコントローラー)が新しいPodをAPIサーバーに送信すると、特定の条件が満たされた場合に、クラスターは`imagePullPolicy`フィールドを設定します。

- `imagePullPolicy`フィールドを省略し、かつコンテナイメージにダイジェストを指定した場合、`imagePullPolicy`には自動的に`IfNotPresent`に設定される。
- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグに`:latest`を指定した場合、`imagePullPolicy`には自動的に`Always`が設定される。
- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグを指定しなかった場合、`imagePullPolicy`には自動的に`Always`が設定される。
- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグに`:latest`以外を指定した場合、`imagePullPolicy`には自動的に`IfNotPresent`が設定される。

{{< note >}}
コンテナの`imagePullPolicy`の値は、そのオブジェクトが最初に _作成_ されたときに常に設定され、その後イメージのタグやダイジェストが変更されても更新されません。

たとえば、タグが`:latest` _でない_ イメージを使ってDeploymentを作成した場合、後でDeploymentのイメージを`:latest`タグに変更しても、`imagePullPolicy`は`Always`に更新 _されません_。初回作成後にプルポリシーを変更したい場合は、手動で更新しなければいけません。
{{< /note >}}

#### イメージ取得を強制する {#required-image-pull}

常に強制的に取得したい場合は、以下のいずれかを実行できます:

- コンテナの`imagePullPolicy`に`Always`を設定する。
- `imagePullPolicy`を省略し、使用するイメージのタグに`:latest`を指定する(KubernetesはPodを送信する際にポリシーを`Always`に設定します)。
- `imagePullPolicy`と使用するイメージのタグを省略する(KubernetesはPodを送信する際にポリシーを`Always`に設定します)。
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)アドミッションコントローラーを有効にする。

### ImagePullBackOff

kubeletがコンテナランタイムを使ってPodのコンテナの作成を開始するとき、`ImagePullBackOff`のためにコンテナが[Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)状態になる可能性があります。

`ImagePullBackOff`状態は、Kubernetesがコンテナイメージを取得できず、コンテナを開始できないことを意味します(イメージ名が無効である、`imagePullSecret`無しでプライベートレジストリから取得したなどの理由のため)。`BackOff`は、バックオフの遅延を増加させながらKubernetesがイメージを取得しようとし続けることを示します。

Kubernetesは、組み込まれた制限である300秒(5分)に達するまで、試行するごとに遅延を増加させます。

### ランタイムクラスごとのイメージ取得 {#image-pull-per-runtime-class}

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
Kubernetesには、PodのRuntimeClassに基づいてイメージを取得するアルファ機能のサポートが含まれています。

`RuntimeClassInImageCriApi`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を有効にすると、kubeletは単にイメージ名やダイジェストではなく、イメージ名とランタイムハンドラーのタプルでコンテナイメージを参照するようになります。
{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}は、選択されたランタイムハンドラーに基づいて動作を変更する可能性があります。
ランタイムクラスに応じたイメージ取得を行う機能は、Windows Hyper-VコンテナのようなVMベースのコンテナにおいて有用です。

### 直列・並列イメージ取得 {#serial-and-parallel-image-pulls}

デフォルトでは、kubeletはイメージを直列に取得します。
言い換えれば、kubeletはイメージサービスに対して一度に1つのイメージ取得の要求しか送信しません。
他のイメージ取得の要求は、処理中の要求が完了するまで待機する必要があります。

ノードは、イメージの取得を他のノードと独立して判断します。そのため、イメージ取得を直列で実行していても、異なるノード上では同じイメージを並列で取得することが可能です。

並列イメージ取得を有効にしたい場合は、[kubeletの設定](/docs/reference/config-api/kubelet-config.v1beta1/)で`serializeImagePulls`フィールドをfalseに設定します。
`serializeImagePulls`をfalseにすると、イメージ取得の要求は即座にイメージサービスへ送信され、複数のイメージが同時に取得されるようになります。

並列イメージ取得を有効にする場合は、使用しているコンテナランタイムのイメージサービスが並列取得に対応していることを確認してください。

なお、kubeletは1つのPodに対して複数のイメージを並列で取得することはありません。
たとえば、1つのPodがinitコンテナとアプリケーションコンテナを持つ場合、その2つのコンテナのイメージ取得は並列化されません。
しかし、異なるPodがそれぞれ異なるイメージを使用しており、並列イメージ取得機能が有効になっている場合、kubeletはその2つの異なるPodのためにイメージを並列で取得します。

### 最大並列イメージ取得数 {#maximum-parallel-image-pulls}

{{< feature-state for_k8s_version="v1.32" state="beta" >}}

`serializeImagePulls`がfalseに設定されている場合、kubeletはデフォルトで同時に取得できるイメージ数に制限を設けません。
並列で取得できるイメージ数を制限したい場合は、kubeletの設定で`maxParallelImagePulls`フィールドを指定します。
`maxParallelImagePulls`に _n_ を設定すると、同時に取得できるイメージは最大で _n_ 件となり、_n_ 件を超えるイメージ取得は、少なくとも1件のイメージ取得が完了するまで待機する必要があります。

並列イメージ取得を有効にしている場合、同時取得数を制限することで、イメージの取得によるネットワーク帯域やディスクI/Oの過剰な消費を防ぐことができます。

`maxParallelImagePulls`には1以上の正の整数を指定できます。
`maxParallelImagePulls`を2以上に設定する場合は、`serializeImagePulls`をfalseに設定する必要があります。
無効な`maxParallelImagePulls`の設定を行うと、kubeletは起動に失敗します。

## イメージインデックスを用いたマルチアーキテクチャイメージ {#multi-architecture-images-with-image-indexes}

コンテナレジストリはバイナリイメージの提供だけでなく、[コンテナイメージインデックス](https://github.com/opencontainers/image-spec/blob/master/image-index.md)も提供可能です。
イメージインデックスはコンテナのアーキテクチャ固有バージョンに関する複数の[イメージマニフェスト](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を指すことができます。
イメージには(たとえば`pause`、`example/mycontainer`、`kube-apiserver`などの)名前を付け、各システムが自身のマシンアーキテクチャに適したバイナリイメージを取得できるようにする、という考え方です。

Kubernetesプロジェクトでは、通常、リリースごとに`-$(ARCH)`というサフィックスを含む名前でコンテナイメージを作成します。
後方互換性のために、従来の形式のサフィックス付きイメージも生成されます。
たとえば、`pause`という名前のイメージは、サポートされているすべてのアーキテクチャ向けのマニフェストを含むマルチアーキテクチャ対応のイメージですが、`pause-amd64`は旧来の構成や、サフィックス付きのイメージ名をハードコードしているYAMLファイルとの互換性のために用意されたイメージです。

## プライベートレジストリの使用 {#using-a-private-registry}

プライベートレジストリでは、イメージの検索や取得を行うために認証が必要となる場合があります。
認証情報は、以下のいくつかの方法で提供できます:

- [Podの定義時に`imagePullSecrets`を指定する](#specifying-imagepullsecrets-on-a-pod)

  独自の認証情報を提供したPodのみが、プライベートレジストリへアクセスできます。

- [ノードを構成してプライベートレジストリに対して認証を行う](#configuring-nodes-to-authenticate-to-a-private-registry)
  - すべてのPodが、設定されたプライベートレジストリからイメージを読み取れます。
  - クラスター管理者によるノード構成が必要です。
- _kubelet credential provider_ プラグインを使用して[プライベートレジストリ用の認証情報を動的に取得する](#kubelet-credential-provider)

  kubeletは、それぞれのプライベートレジストリに対してcredential provider execプラグインを使用するよう構成できます。

- [事前に取得されたイメージ](#pre-pulled-images)
  - すべてのPodがノードにキャッシュされたイメージを使用できます。
  - すべてのノードに対してrootアクセスによるセットアップが必要です。
- ベンダー固有またはローカルの拡張機能

  カスタムノード構成を使用している場合、あなた自身(またはクラウドプロバイダー)が、コンテナレジストリに対するノードの認証手段を実装できます。

これらのオプションについて、以下で詳しく説明します。

### Podで`imagePullSecrets`を指定する {#specifying-imagepullsecrets-on-a-pod}

{{< note >}}
この方法がプライベートレジストリのイメージに基づいてコンテナを実行するための推奨の方法です。
{{< /note >}}

Kubernetesは、Podに対してコンテナイメージレジストリ用のキーを指定できます。
すべての`imagePullSecrets`は、そのPodと同じ{{< glossary_tooltip term_id="namespace" >}}内に存在するSecretでなければなりません。
これらのSecretは、型が`kubernetes.io/dockercfg`または`kubernetes.io/dockerconfigjson`である必要があります。

### ノードを構成してプライベートレジストリに対して認証を行う {#configuring-nodes-to-authenticate-to-a-private-registry}

認証情報の具体的な設定手順は、使用するコンテナランタイムやレジストリによって異なります。
最も正確な情報については、使用しているソリューションのドキュメントを参照してください。

プライベートコンテナイメージレジストリの構成例については、[イメージをプライベートレジストリから取得する](/docs/tasks/configure-pod-container/pull-image-private-registry)を参照してください。
この例では、Docker Hubのプライベートレジストリを使用しています。

### kubelet credential providerによる認証付きイメージ取得 {#kubelet-credential-provider}

kubeletを構成して、プラグインバイナリを呼び出し、コンテナイメージのレジストリ認証情報を動的に取得させることができます。
これは、プライベートレジストリ用の認証情報を取得するための最も堅牢かつ柔軟な方法ですが、有効化するにはkubeletレベルでの設定が必要です。

この手法は、プライベートレジストリにホストされたコンテナイメージを必要とする{{< glossary_tooltip term_id="static-pod" text="Static Pod" >}}を実行する際に特に有用です。
{{< glossary_tooltip term_id="service-account" >}}や{{< glossary_tooltip term_id="secret" >}}を使ってプライベートレジストリの認証情報を提供することは、Static Podの仕様では不可能です。
Static Podは、その仕様として他のAPIリソースへの参照を含めることが _できない_ ためです。

詳細については、[kubelet image credential providerを設定する](/docs/tasks/administer-cluster/kubelet-credential-provider/)を参照してください。

### config.jsonの解釈 {#config-json}

`config.json`の解釈は、元のDockerの実装とKubernetesにおける解釈で異なります。
Dockerでは、`auths`キーにはルートURLしか指定できませんが、Kubernetesではワイルドカード形式のURLや、プレフィックスが一致するパスも許容されます。
唯一の制約は、ワイルドカード(`*`)を使用する場合、各サブドメインに対して`.`を含める必要があるという点です。
一致するサブドメインの数は、指定されたワイルドカードパターンの数(`*.`)と一致している必要があります。
例:

- `*.kubernetes.io`は、`kubernetes.io`には一致 *しません* が、`abc.kubernetes.io`には一致します。
- `*.*.kubernetes.io`は、`abc.kubernetes.io`には一致 *しません* が、`abc.def.kubernetes.io`には一致します。
- `prefix.*.io`は、`prefix.kubernetes.io`に一致します。
- `*-good.kubernetes.io`は、`prefix-good.kubernetes.io`に一致します。

つまり、次のような`config.json`は有効です:

```json
{
    "auths": {
        "my-registry.example/images": { "auth": "…" },
        "*.my-registry.example/images": { "auth": "…" }
    }
}
```

イメージ取得操作では、すべての有効なパターンに対して、認証情報がCRIコンテナランタイムに渡されます。
たとえば、次のようなコンテナイメージ名は正常にマッチします。

- `my-registry.example/images`
- `my-registry.example/images/my-image`
- `my-registry.example/images/another-image`
- `sub.my-registry.example/images/my-image`

しかし、次のようなコンテナイメージ名はマッチ _しません_。

- `a.sub.my-registry.example/images/my-image`
- `a.b.sub.my-registry.example/images/my-image`

kubeletは、見つかった各認証情報に対してイメージ取得を順番に実行します。
つまり、`config.json`内に異なるパスに対する複数のエントリを含めることも可能です。

```json
{
    "auths": {
        "my-registry.example/images": {
            "auth": "…"
        },
        "my-registry.example/images/subpath": {
            "auth": "…"
        }
    }
}
```

このとき、コンテナが`my-registry.example/images/subpath/my-image`というイメージを取得するよう指定している場合、kubeletは、いずれかの認証元で失敗した場合でも、両方の認証情報を使ってイメージのダウンロードを試みます。

### 事前に取得されたイメージ {#pre-pulled-images}

{{< note >}}
この方法は、ノードの構成を自分で制御できる場合に適しています。
クラウドプロバイダーがノードを管理し、自動的に置き換えるような環境では、信頼性のある動作は期待できません。
{{< /note >}}

デフォルトでは、kubeletは指定されたレジストリからそれぞれのイメージを取得しようとします。
ただし、コンテナの`imagePullPolicy`プロパティが`IfNotPresent`または`Never`に設定されている場合は、ローカルのイメージが(それぞれ優先的に、あるいは専用で)使用されます。

レジストリ認証の代替として事前に取得されたイメージを利用したい場合、クラスターのすべてのノードが同じ事前に取得されたイメージを持っていることを確認する必要があります。

これは、特定のイメージをあらかじめロードしておくことで高速化したり、プライベートレジストリへの認証の代替手段として利用したりすることができます。

[kubelet credential provider](#kubelet-credential-provider)の利用と同様に、事前に取得されたイメージは、プライベートレジストリにホストされたイメージに依存する{{< glossary_tooltip text="Static Pod" term_id="static-pod" >}}を起動する場合にも適しています。

{{< note >}}
{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}
事前に取得されたイメージへのアクセスは、[イメージ取得の認証情報の検証](#ensureimagepullcredentialverification)に基づいて許可される場合があります。
{{< /note >}}

### イメージ取得の認証情報の検証を保証する {#ensureimagepullcredentialverification}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

クラスターで`KubeletEnsureSecretPulledImages`フィーチャーゲートが有効になっている場合、Kubernetesは、取得に認証が必要なすべてのイメージに対して、たとえそのイメージがノード上にすでに存在していても、認証情報を検証します。
この検証により、Podが要求するイメージのうち、指定された認証情報で正常に取得されなかったものは、レジストリから再度取得する必要があることが保証されます。
さらに、以前に成功したイメージ取得と同じ認証情報を使用する場合には、再取得は不要で、レジストリにアクセスせずローカルで検証が行われます(該当のイメージがローカルに存在する場合)。
この動作は、[kubeletの設定](/docs/reference/config-api/kubelet-config.v1beta1#ImagePullCredentialsVerificationPolicy)における`imagePullCredentialsVerificationPolicy`フィールドによって制御されます。

この設定は、イメージがすでにノード上に存在する場合に、イメージ取得の認証情報を検証する必要があるかどうかの挙動を制御します:

 * `NeverVerify`: このフィーチャーゲートが無効な場合と同じ動作を模倣します。イメージがローカルに存在する場合、イメージ取得の認証情報は検証されません。
 * `NeverVerifyPreloadedImages`: kubeletの外部で取得されたイメージは検証されませんが、それ以外のすべてのイメージについては認証情報が検証されます。これがデフォルトの動作です。
 * `NeverVerifyAllowListedImages`: kubeletの外部で取得されたイメージと、kubelet設定内で指定された`preloadedImagesVerificationAllowlist`に記載されたイメージは検証されません。
 * `AlwaysVerify`: すべてのイメージは、使用前に認証情報の検証が行われます。

この検証は、[事前に取得されたイメージ](#pre-pulled-images)、ノード全体のSecretを使用して取得されたイメージ、PodレベルのSecretを使用して取得されたイメージに適用されます。

{{< note >}}
認証情報がローテーションされた場合でも、以前にイメージの取得に使用された認証情報は、レジストリへアクセスすることなく検証に成功し続けます。
一方、新しい認証情報やローテーション後の認証情報を使用する場合には、イメージを再度レジストリから取得する必要があります。
{{< /note >}}

#### Docker設定を用いたSecretの作成 {#creating-a-secret-with-a-docker-config}

レジストリに対して認証を行うには、ユーザー名、レジストリのパスワード、クライアントのメールアドレス、およびレジストリのホスト名を把握しておく必要があります。
プレースホルダーを適切な値に置換したうえで、以下のコマンドを実行してください。

```shell
kubectl create secret docker-registry <name> \
  --docker-server=<docker-registry-server> \
  --docker-username=<docker-user> \
  --docker-password=<docker-password> \
  --docker-email=<docker-email>
```

すでにDockerの認証情報ファイルを持っている場合は、上記のコマンドを使用する代わりに、その認証情報ファイルをKubernetesの{{< glossary_tooltip text="Secret" term_id="secret" >}}としてインポートすることができます。
[既存のDocker認証情報に基づいてSecretを作成する](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)に、その設定方法が説明されています。

これは、複数のプライベートコンテナレジストリを使用している場合に特に有用です。
`kubectl create secret docker-registry`で作成されるSecretは、単一のプライベートレジストリにしか対応していないためです。

{{< note >}}
Podは自身のNamespace内にあるイメージプルシークレットしか参照できないため、この手順はNamespaceごとに1回ずつ実行する必要があります。
{{< /note >}}

#### Podで`imagePullSecrets`を参照する {#referring-to-imagepullsecrets-on-a-pod}

次に、Pod定義に`imagePullSecrets`セクションを追加することで、そのSecretを参照するPodを作成できます。
`imagePullSecrets`配列の各要素は、同じNamespace内の1つのSecretのみを参照できます。

たとえば、以下のように記述します:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

この作業は、プライベートレジストリを使用する各Podに対して実施する必要があります。

ただし、[ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)リソースの中で`imagePullSecrets`セクションを指定することで、この手順を自動化することが可能です。
詳細な手順については、[ServiceAccountにImagePullSecretsを追加する](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)を参照してください。

また、各ノードにある`.docker/config.json`と併用することもできます。
これらの認証情報はマージされて使用されます。

## ユースケース {#use-cases}

プライベートレジストリを構成するにはいくつかの手段があります。
ここでは、いくつかの一般的なユースケースと推奨される解決方法を示します。

1. 非専有(たとえば、オープンソースの)イメージだけを実行し、イメージを非公開にする必要がないクラスターの場合
   - パブリックレジストリのパブリックイメージを利用する。
     - 設定は必要ない。
     - 一部のクラウドプロバイダーは、パブリックイメージを自動的にキャッシュまたはミラーリングすることで、可用性を向上させ、イメージの取得にかかる時間を短縮する。

1. 社外には非公開にすべきだが、クラスターユーザー全員には見える必要がある専有イメージを実行しているクラスターの場合
   - ホスティング型のプライペートレジストリを使用する。
     - プライベートレジストリにアクセスする必要があるノードには、手動設定が必要となる場合がある。
   - または、ファイアウォールの内側で内部向けのプライベートレジストリを実行し、読み取りアクセスを開放して運用する。
     - Kubernetesの設定は必要ない。
   - イメージへのアクセスを制御できるホスティング型のコンテナイメージレジストリサービスを利用する。
     - ノードを手動で構成する場合よりも、ノードのオートスケーリングと組み合わせた方がうまく機能する。
   - あるいは、ノードの構成を変更するのが困難なクラスターでは、`imagePullSecrets`を使用する。

1. 一部に、より厳格なアクセス制御を必要とする専有イメージを含むクラスターの場合
   - [AlwaysPullImagesアドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)が有効化されていることを確認する。これが無効な場合、すべてのPodがすべてのイメージにアクセスできてしまう可能性がある。
   - 機密データはイメージ内に含める代わりに、Secretリソースに移行する。

1. それぞれのテナントが独自のプライベートレジストリを必要とするマルチテナントのクラスターである場合
   - [AlwaysPullImagesアドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)が有効化されていることを確認する。これが無効な場合、すべてのPodがすべてのイメージにアクセスできてしまう可能性がある。
   - 認証が必要なプライベートレジストリを運用する。
   - テナントごとにレジストリの認証情報を生成し、それをSecretに保存して、各テナントのNamespaceへ配布する。
   - テナントは、そのSecretを各Namespaceの`imagePullSecrets`に追加する。

複数のレジストリへのアクセスが必要な場合、レジストリごとに1つのSecretを作成することができます。

## レガシーな組み込みkubelet credential provider {#legacy-built-in-kubelet-credential-provider}

古いバージョンのKubernetesでは、kubeletがクラウドプロバイダーの認証情報と直接統合されていました。
これにより、イメージレジストリの認証情報を動的に取得することが可能でした。

このkubelet credential provider統合には、以下の3つの組み込み実装がありました: ACR(Azure Container Registry)、ECR(Elastic Container Registry)、GCR(Google Container Registry)です。

Kubernetesバージョン1.26以降では、このレガシーな仕組みは削除されたため、以下のいずれかの対応が必要です:
- 各ノードにkubelet image credential providerを構成する
- `imagePullSecrets`と少なくとも1つのSecretを使用して、イメージ取得の認証情報を指定する

## {{% heading "whatsnext" %}}

* [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を読む
* [コンテナイメージのガベージコレクション](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)について学ぶ
* [イメージをプライベートレジストリから取得する](/docs/tasks/configure-pod-container/pull-image-private-registry)について学ぶ
