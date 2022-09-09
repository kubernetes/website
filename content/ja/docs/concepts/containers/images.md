---
reviewers:
title: イメージ
content_type: concept
weight: 10
---

<!-- overview -->
コンテナイメージはアプリケーションと依存関係のあるすべてソフトウェアをカプセル化したバイナリデータを表します。コンテナイメージはスタンドアロンで実行可能なソフトウェアをひとつにまとめ、ランタイム環境に関する想定を明確に定義しています。

アプリケーションのコンテナイメージを作成し、一般的には{{< glossary_tooltip text="Pod" term_id="pod" >}}で参照する前にレジストリへPushします。

このページではコンテナイメージの概要を説明します。

<!-- body -->

## イメージの名称

コンテナイメージは、`pause`、`example/mycontainer`、または`kube-apiserver`のような名前が通常つけられます。
イメージにはレジストリのホスト名も含めることができ(例：`fictional.registry.example/imagename`)、さらにポート番号も含めることが可能です(例：`fictional.registry.example:10443/imagename`)。

レジストリのホスト名を指定しない場合は、KubernetesはDockerパブリックレジストリを意味していると見なします。

イメージ名の後に、_タグ_ を追加することができます(`docker`や`podman`のようなコマンドを利用した場合と同様)。
タグによって同じイメージの異なるバージョンを識別できます。

イメージタグは大文字と小文字、数値、アンダースコア(`_`)、ピリオド(`.`)とマイナス(`-`)で構成されます。
イメージタグでは区切り記号(`_`、`-`、`.`)を指定できる追加ルールがあります。
タグを指定しない場合は、Kubernetesは`latest`タグを指定したと見なします。

## イメージの更新

{{< glossary_tooltip text="Deployment" term_id="deployment" >}}、{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod、またはPodテンプレートを含むその他のオブジェクトを最初に作成するとき、デフォルトでは、Pod内のすべてのコンテナのPullポリシーは、明示的に指定されていない場合、`IfNotPresent`に設定されます。

イメージがすでに存在する場合、このポリシーは{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}にイメージのPullをスキップさせます。

### イメージPullポリシー

コンテナの`imagePullPolicy`とイメージのタグは、[kubelet](/docs/reference/command-line-tools-reference/kubelet/)が指定されたイメージをPull(ダウンロード)しようとする時に影響します。

以下は、`imagePullPolicy`に設定できる値とその効果の一覧です。

`IfNotPresent`
: イメージがローカルにまだ存在しない場合のみ、イメージがPullされます。

`Always`
: kubeletがコンテナを起動するときは常にコンテナイメージレジストリに照会して、イメージ名をイメージ[ダイジェスト](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)に解決します。
  ローカルにキャッシュされた同一ダイジェストのコンテナイメージがあった場合、kubeletはキャッシュされたイメージを使用します。
  そうでない場合、kubeletは解決されたダイジェストのイメージをPullし、そのイメージを使ってコンテナを起動します。

`Never`
: kubeletは、イメージを取得しようとしません。ローカルにイメージがすでに存在する場合、kubeletはコンテナを起動しようとします。それ以外の場合、起動に失敗します。
  詳細は、[事前にPullしたイメージ](#pre-pulled-images)を参照してください。

レジストリに確実にアクセスできるのであれば、基盤となるイメージプロバイダーのキャッシュセマンティクスにより`imagePullPolicy: Always`でも効率的です。
コンテナランタイムは、イメージレイヤーが既にノード上に存在することを認識できるので、再度ダウンロードする必要がありません。

{{< note >}}
本番環境でコンテナをデプロイする場合は、`:latest`タグの使用を避けるべきです。
実行中のイメージのバージョンを追跡するのが難しく、正しくロールバックすることがより困難になるためです。

かわりに、`v1.42.0`のような特定できるタグを指定してください。
{{< /note >}}

Podがいつも同じバージョンのコンテナイメージを使用するために、イメージのダイジェストを指定することができます。`<image-name>:<tag>`を`<image-name>@<digest>`に置き換えてください(例えば、`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`)。

イメージタグを使用する場合、イメージレジストリがそのイメージのタグが表すコードを変更すると、新旧のコードを実行するPodが混在することになるかもしれません。
イメージダイジェストは特定のバージョンのイメージを一意に識別するため、Kubernetesは特定のイメージ名とダイジェストが指定されたコンテナを起動するたびに同じコードを実行します。
イメージをダイジェストで指定することは、レジストリの変更でそのようなバージョンの混在を起こさないように、実行するコードを固定します。

Pod(およびPodテンプレート)を作成する時に、実行中のワークロードがタグではなくイメージダイジェストに基づき定義されるように変化させるサードパーティーの[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)があります。
レジストリでどのようなタグの変更があっても、すべてのワークロードが必ず同じコードを実行するようにしたい場合に役立ちます。

#### デフォルトのイメージPullポリシー {#imagepullpolicy-defaulting}

新しいPodがAPIサーバに送信されると、クラスターは特定の条件が満たされたときに`imagePullPolicy`フィールドを設定します。

- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグに`:latest`を指定した場合、`imagePullPolicy`には自動的に`Always`が設定される
- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグを指定しなかった場合、`imagePullPolicy`には自動的に`Always`が設定される
- `imagePullPolicy`フィールドを省略し、コンテナイメージのタグに`:latest`以外を指定した場合、`imagePullPolicy`には自動的に`IfNotPresent`が設定される

{{< note >}}
コンテナの`imagePullPolicy`の値は、そのオブジェクトが最初に _作成_ されたときに常に設定され、イメージのタグが後で変更された場合でも更新されません。

例えば、タグが`:latest` _でない_ イメージを使ってDeploymentを生成した場合、後でDeploymentのイメージを`:latest`タグに変更しても、`imagePullPolicy`は`Always`に更新されません。オブジェクトのPullポリシーは、初期作成後に手動で変更する必要があります。
{{< /note >}}

#### 必要なイメージをPullする

常に強制的にPullしたい場合は、以下のいずれかを行ってください。

- コンテナの`imagePullPolicy`に`Always`を設定する。
- `imagePullPolicy`を省略し、使用するイメージに`:latest`タグ使用する。Pod生成時に、Kubernetesがポリシーに`Always`を設定する。
- `imagePullPolicy`と使用するイメージのタグを省略する。Pod生成時に、Kubernetesがポリシーに`Always`を設定する。
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)アドミッションコントローラーを有効にする。

### ImagePullBackOff

kubeletがコンテナランタイムを使ってPodのコンテナの生成を開始するとき、`ImagePullBackOff`のためにコンテナが[Waiting](/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)状態になる可能性があります。

`ImagePullBackOff`ステータスは、KubernetesがコンテナイメージをPullできないために、コンテナを開始できないことを意味します(イメージ名が無効である、`imagePullSecret`なしでプライベートレジストリからPullしたなどの理由のため)。`BackOff`は、バックオフの遅延を増加させながらKubernetesがイメージをPullしようとし続けることを示します。

Kubernetesは、組み込まれた制限である300秒(5分)に達するまで、試行するごとに遅延を増加させます。

## イメージインデックスを使ったマルチアーキテクチャイメージ

コンテナレジストリはバイナリイメージの提供だけでなく、[コンテナイメージインデックス](https://github.com/opencontainers/image-spec/blob/master/image-index.md)も提供する事ができます。イメージインデックスはコンテナのアーキテクチャ固有バージョンに関する複数の[イメージマニフェスト](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を指すことができます。イメージインデックスの目的はイメージの名前(例:`pause`、`example/mycontainer`、`kube-apiserver`)をもたせ、様々なシステムが使用しているマシンアーキテクチャにあう適切なバイナリイメージを取得できることです。

Kubernetes自身は、通常コンテナイメージに`-$(ARCH)`のサフィックスを持つ名前をつけます。下位互換の為にサフィックス付きの古い仕様のイメージを生成してください。その目的は、`pause`のようなすべてのアーキテクチャのマニフェストを持つイメージと、サフィックスのあるイメージをハードコードしていた可能性のある古い仕様の設定やYAMLファイルと下位互換がある`pause-amd64`のようなイメージを生成することです。

## プライベートレジストリを使用する方法

プライベートレジストリではイメージを読み込む為にキーが必要になる場合があります。  
認証情報はいくつかの方法で提供できます。

  - プライベートレジストリへの認証をNodeに設定する
    - すべてのPodがプライベートレジストリを読み取ることができる
    - クラスター管理者によるNodeの設定が必要
  - 事前にPullされたイメージ
    - すべてのPodがNode上にキャッシュされたイメージを利用できる
    - セットアップするためにはすべてのNodeに対するrootアクセスが必要
  - PodでImagePullSecretsを指定する
    - キーを提供したPodのみがプライベートレジストリへアクセスできる
  - ベンダー固有またはローカルエクステンション
    - カスタムNode構成を使っている場合、あなた(または、あなたのクラウドプロバイダー)はコンテナレジストリへの認証の仕組みを組み込むことができる

これらのオプションについて、以下で詳しく説明します。

### プライベートレジストリへの認証をNodeに設定する

認証情報を設定するための具体的な手順は、使用するコンテナランタイムとレジストリに依存します。最も正確な情報として、ソリューションのドキュメントを参照する必要があります。

プライベートなコンテナイメージレジストリを設定する例として、[プライベートレジストリからイメージをPullする](/docs/tasks/configure-pod-container/pull-image-private-registry)タスクを参照してください。その例では、Docker Hubのプライベートレジストリを使用しています。


### config.jsonの解釈 {#config-json}

`config.json`の解釈は、Dockerのオリジナルの実装とKubernetesの解釈で異なります。
Dockerでは、`auths`キーはルートURLしか指定できませんが、Kubernetesではプレフィックスのマッチしたパスだけでなく、グロブパターンのURLも指定できます。
以下のような`config.json`が有効であるということです。

```json
{
    "auths": {
        "*my-registry.io/images": {
            "auth": "…"
        }
    }
}
```

ルートURL(`*my-registry.io`)は、以下の構文でマッチングされます:

```
pattern:
    { term }

term:
    '*'         セパレーター以外の任意の文字列にマッチする
    '?'         セパレーター以外の任意の一文字にマッチする
    '[' [ '^' ] { character-range } ']'
                文字クラス (空であってはならない)
    c           文字 c とマッチする (c != '*', '?', '\\', '[')
    '\\' c      文字 c とマッチする

character-range:
    c           文字 c とマッチする (c != '\\', '-', ']')
    '\\' c      文字 c とマッチする
    lo '-' hi   lo <= c <= hi の文字 c とマッチする
```

イメージのPull操作では、有効なパターンごとに認証情報をCRIコンテナランタイムに渡すようになりました。例えば、以下のようなコンテナイメージ名は正常にマッチングされます。

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`
- `a.sub.my-registry.io/images/my-image`

kubeletは、見つかったすべての認証情報に対してイメージのPullを順次実行します。これは、次のように`config.json`に複数のエントリーを書くことも可能であることを意味します。

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

コンテナが`my-registry.io/images/subpath/my-image`をPullするイメージとして指定した場合、kubeletが認証ソースの片方からダウンロードに失敗すると、両方の認証ソースからダウンロードを試みます。

### 事前にPullしたイメージ {#pre-pulled-images}

{{< note >}}
Node構成を制御できる場合、この方法が適しています。
クラウドプロバイダーがNodeを管理し自動的に設定を置き換える場合は、確実に機能できません。
{{< /note >}}

デフォルトでは、kubeletは指定されたレジストリからそれぞれのイメージをPullしようとします。
また一方では、コンテナの`imagePullPolicy`プロパティに`IfNotPresent`や`Never`が設定されている場合、ローカルのイメージが使用されます。(それぞれに対して、優先的またはか排他的に)

レジストリ認証の代替として事前にPullしたイメージを利用したい場合、クラスターのすべてのNodeが同じ事前にPullしたイメージを持っていることを確認する必要があります。

特定のイメージをあらかじめロードしておくことは高速化やプライベートレジストリへの認証の代替として利用することができます。

すべてのPodは事前にPullしたイメージへの読み取りアクセス権をもちます。

### PodでimagePullSecretsを指定する

{{< note >}}
この方法がプライベートレジストリのイメージに基づいてコンテナを実行するための推奨の方法です。
{{< /note >}}

KubernetesはPodでのコンテナイメージレジストリキーの指定をサポートしています。

#### Dockerの設定を利用してSecretを作成する。

レジストリへの認証のためにユーザー名、レジストリのパスワード、クライアントのメールアドレス、およびそのホスト名を知っている必要があります。

適切な大文字の値を置き換えて、次のコマンドを実行します。

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

既にDocker認証情報ファイルを持っている場合は、上記のコマンドの代わりに、認証情報ファイルをKubernetes {{< glossary_tooltip text="Secrets" term_id="secret" >}}としてインポートすることができます。
[既存のDocker認証情報に基づいてSecretを作成する](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) で、この設定方法を説明します.

これは複数のプライベートコンテナレジストリを使用している場合に特に有効です。`kubectl create secret docker-registry`はひとつのプライベートレジストリにのみ機能するSecretを作成するからです。

{{< note >}}
Podは自分自身のNamespace内にあるimage pull secretsのみが参照可能であるため、この作業はNemespace毎に1回行う必要があります。
{{< /note >}}

#### PodのimagePullSecretsを参照する方法

これで、`imagePullSecrets`セクションをPod定義へ追加することでSecretを参照するPodを作成できます。

例:

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

これは、プライベートレジストリを使用する各Podで行う必要があります。

ただし、この項目の設定は[ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)リソースの中でimagePullSecretsを指定することで自動化することができます。

詳細の手順は、[ImagePullSecretsをService Accountに追加する](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)をクリックしてください。

これを各Nodeの`.docker/config.json`に組み合わせて利用できます。認証情報はマージされます。

## ユースケース

プライベートレジストリを設定するためのソリューションはいくつかあります。ここでは、いくつかの一般的なユースケースと推奨される解決方法を示します。

1. クラスターに独自仕様でない(例えば、オープンソース)イメージだけを実行する。イメージを非公開にする必要がない
   - パブリックレジストリのパブリックイメージを利用する
     - 設定は必要ない
     - クラウドプロバイダーによっては、可用性の向上とイメージをPullする時間を短くする為に、自動的にキャッシュやミラーされたパプリックイメージが提供される
1. 社外には非公開の必要があるが、すべてのクラスター利用者には見せてよい独自仕様のイメージをクラスターで実行している
   - ホストされたプライペートレジストリを使用
     - プライベートレジストリにアクセスする必要があるノードには、手動設定が必要となる場合がある
   - または、オープンな読み取りアクセスを許可したファイヤーウォールの背後で内部向けプライベートレジストリを実行する
     - Kubernetesの設定は必要ない
   - イメージへのアクセスを制御できるホストされたコンテナイメージレジストリサービスを利用する
     - Nodeを手動設定するよりもクラスターのオートスケーリングのほうがうまく機能する
   - また、Node設定変更を自由にできないクラスターでは`imagePullSecrets`を使用する
1. 独自仕様のイメージを含むクラスターで、いくつかは厳格なアクセス制御が必要である
   - [AlwaysPullImagesアドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)が有効化かを確認する必要がある。さもないと、全部のPodがすべてのイメージへのアクセスができてしまう可能性がある
   - 機密データはイメージに含めてしまうのではなく、"Secret"リソースに移行する
1. それぞれのテナントが独自のプライベートレジストリを必要とするマルチテナントのクラスターである
   - [AlwaysPullImagesアドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)が有効化を確認する必要がある。さもないと、すべてのテナントの全Podが全部のイメージにアクセスできてしまう可能性がある
   - 認証が必要なプライベートレジストリを実行する
   - それぞれのテナントでレジストリ認証を生成し、Secretへ設定し、各テナントのNamespaceに追加する
   - テナントは、Secretを各NamespaceのimagePullSecretsへ追加する

複数のレジストリへのアクセスが必要な場合、それぞれのレジストリ毎にひとつのSecretを作成する事ができます。

## {{% heading "whatsnext" %}}

* [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を読む
* [コンテナのガベージコレクション](/ja/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)について学ぶ
* [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)について学ぶ
