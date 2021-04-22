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
イメージにはレジストリのホスト名も含めることができ（例：`fictional.registry.example/imagename`）、さらにポート番号も含めることが可能です（例：`fictional.registry.example:10443/imagename`）。

レジストリのホスト名を指定しない場合は、KubernetesはDockerパブリックレジストリを意味していると見なします。

イメージ名の後に、_タグ_ を追加することができます（`docker`や`podman`のようなコマンドを利用した場合と同様）。
タグによって同じイメージの異なるバージョンを識別できます。

イメージタグは大文字と小文字、数値、アンダースコア(`_`)、ピリオド(`.`)とマイナス(`-`)で構成されます。
イメージタグでは区切り記号(`_`、`-`、`.`)を指定できる追加ルールがあります。
タグを指定しない場合は、Kubernetesは`latest`タグを指定したと見なします。

{{< caution >}}
本番環境でコンテナをデプロイする場合は、`latest`タグの使用を避けるべきです。
実行中のイメージのバージョンを追跡するのが難しく、機能しているバージョンへのロールバックがより困難になるためです。

かわりに、`v1.42.0`のような特定できるタグを指定してください。
{{< /caution >}}


## イメージの更新

デフォルトのpull policyでは、{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}はイメージを既に取得済みの場合、イメージのPullをスキップさせる`IfNotPresent`が設定されています。
常にPullを強制させたい場合は、次のいずれかの方法で実行できます。

- コンテナの`imagePullPolicy`に`Always`を設定する
- `imagePullPolicy`を省略し、使用するイメージに`:latest`タグを使用する
- `imagePullPolicy`と使用するイメージのタグを省略する
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)アドミッションコントローラーを有効にする

`imagePullPolicy`が値なしで定義された場合、この場合も`Always`が設定されます。

## イメージインデックスを使ったマルチアーキテクチャイメージ

コンテナレジストリはバイナリイメージの提供だけでなく、[コンテナイメージインデックス](https://github.com/opencontainers/image-spec/blob/master/image-index.md)も提供する事ができます。
イメージインデックスはコンテナのアーキテクチャ固有バージョンに関する複数の[イメージマニフェスト](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を指すことができます。イメージインデックスの目的はイメージの名前(例:`pause`、`example/mycontainer`、`kube-apiserver`)をもたせ、様々なシステムが使用しているマシンアーキテクチャにあう適切なバイナリイメージを取得できることです。

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

Node上でDockerを実行している場合、プライベートコンテナレジストリへの認証をDockerコンテナランタイムに設定できます。

Node構成を制御できる場合は、この方法が適しています。

{{< note >}}
KubernetesはDocker構成の`auths`と`HttpHeaders`セクションのみをサポートしています。
Docker認証情報ヘルパー(`credHelpers`または`credsStore`)はサポートされていません。
{{< /note >}}


Dockerは、`$HOME/.dockercfg`または`$HOME/.docker/config.json`ファイルの中に、プライベートレジストリのキーを保持します。
下記リストの検索パスに同じファイルを配置した場合、kubeletはイメージをPullする時に認証情報プロバイダーとして利用します。


* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{cwd of kubelet}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{cwd of kubelet}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`

{{< note >}}
kubeletプロセスの環境では、明示的に`HOME=/root`を設定する必要がある場合があります。
{{< /note >}}

以下は、プライベートレジストリを使用する為にNodeを構成する推奨の手順です。この例では、デスクトップ/ノートPC上で実行します。

   1. 使用したい認証情報のセット毎に `docker login [server]`を実行する。これであなたのPC上の`$HOME/.docker/config.json`が更新される
   1. 使用したい認証情報が含まれているかを確認するため、エディターで`$HOME/.docker/config.json`を見る
   1. Nodeの一覧を取得 例:
      - 名称が必要な場合: `nodes=$( kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}' )`
      - IPアドレスを取得したい場合: `nodes=$( kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}' )`
   1. ローカルの`.docker/config.json`を上記の検索パスのいずれかにコピーする
      - 例えば、これでテストを実施する: `for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`

{{< note >}}
本番環境用クラスターでは、構成管理ツールを使用して必要なすべてのNodeに設定を反映してください。
{{< /note >}}

プライベートイメージを使用するPodを作成し確認します。
例:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
```
```
pod/private-image-test-1 created
```

すべてが機能している場合は、しばらくしてから以下のコマンドを実行します。

```shell
kubectl logs private-image-test-1
```
コマンドの結果を確認してください。
```
SUCCESS
```

コマンドが失敗したと思われる場合には、以下を実行します。
```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```
失敗している場合、結果が次のようになります。
```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


クラスターのすべてのNodeが同じ`.docker/config.json`になっているかを確認する必要があります。
そうでない場合、Podは一部のNodeで実行できますが他のNodeでは実行に失敗します。
例えば、Nodeのオートスケールを使用している場合、各インスタンスのテンプレートに`.docker/config.json`が含まれている、またはこのファイルが含まれているドライブをマウントする必要があります。

プライベートレジストリキーを`.docker/config.json`に追加した時点で、すべてのPodがプライベートレジストリのイメージに読み取りアクセス権も持つようになります。

### 事前にPullしたイメージ

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

#### Docker configを利用してSecretを作成する。

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
   - Docker hubのパブリックイメージを利用する
     - 設定は必要ない
     - クラウドプロバイダーによっては、可用性の向上とイメージをPullする時間を短くする為に、自動的にキャッシュやミラーされたパプリックイメージが提供される
1. 社外には非公開の必要があるが、すべてのクラスター利用者には見せてよい独自仕様のイメージをクラスターで実行している
   - ホストされたプライペートな [Dockerレジストリ](https://docs.docker.com/registry/)を使用
     - [Docker Hub](https://hub.docker.com/signup)または他の場所の上でホストされている場合がある
     - 上記のように各Node上のdocker/config.jsonを手動で構成する
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
Kubeletは複数の`imagePullSecrets`を単一の仮想的な`.docker/config.json`にマージします。

## {{% heading "whatsnext" %}}

* [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)を読みます。
