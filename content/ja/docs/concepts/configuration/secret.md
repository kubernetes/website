---
title: Secret
content_type: concept
feature:
  title: Secretと構成管理
  description: >
    Secretやアプリケーションの構成情報を、イメージの再ビルドや機密情報を晒すことなくデプロイ、更新します
weight: 30
---

<!-- overview -->


Secretとは、パスワードやトークン、キーなどの少量の機密データを含むオブジェクトのことです。
このような情報は、Secretを用いないと{{< glossary_tooltip term_id="pod" >}}の定義や{{< glossary_tooltip text="コンテナイメージ" term_id="image" >}}に直接記載することになってしまうかもしれません。
Secretを使用すれば、アプリケーションコードに機密データを含める必要がなくなります。

なぜなら、Secretは、それを使用するPodとは独立して作成することができ、
Podの作成、閲覧、編集といったワークフローの中でSecret(およびそのデータ)が漏洩する危険性が低くなるためです。
また、Kubernetesやクラスター内で動作するアプリケーションは、不揮発性ストレージに機密データを書き込まないようにするなど、Secretで追加の予防措置を取ることができます。

Secretsは、{{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}に似ていますが、機密データを保持するために用います。


{{< caution >}}
KubernetesのSecretは、デフォルトでは、APIサーバーの基礎となるデータストア(etcd)に暗号化されずに保存されます。APIにアクセスできる人は誰でもSecretを取得または変更でき、etcdにアクセスできる人も同様です。
さらに、名前空間でPodを作成する権限を持つ人は、そのアクセスを使用して、その名前空間のあらゆるSecretを読むことができます。これには、Deploymentを作成する能力などの間接的なアクセスも含まれます。

Secretsを安全に使用するには、以下の手順を推奨します。

1. Secretsを[安全に暗号化する](/docs/tasks/administer-cluster/encrypt-data/)
2. Secretsのデータの読み取りを制限する[RBACルール](/docs/reference/access-authn-authz/authorization/)の有効化または設定 
3. 適切な場合には、RBACなどのメカニズムを使用して、どの原則が新しいSecretの作成や既存のSecretの置き換えを許可されるかを制限します。

{{< /caution >}}

<!-- body -->

## Secretの概要

Secretを使うには、PodはSecretを参照することが必要です。
PodがSecretを使う方法は3種類あります。

- {{< glossary_tooltip text="ボリューム" term_id="volume" >}}内の[ファイル](#using-secrets-as-files-from-a-pod)として、Podの単一または複数のコンテナにマウントする
- [コンテナの環境変数](#using-secrets-as-environment-variables)として利用する
- Podを生成するために[kubeletがイメージをpullする](#using-imagepullsecrets)ときに使用する

KubernetesのコントロールプレーンでもSecretsは使われています。例えば、[bootstrap token Secrets](#bootstrap-token-secrets)は、ノード登録を自動化するための仕組みです。

Secretオブジェクトの名称は正当な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要があります。
シークレットの構成ファイルを作成するときに、`data`および/または`stringData`フィールドを指定できます。`data`フィールドと`stringData`フィールドはオプションです。
`data`フィールドのすべてのキーの値は、base64でエンコードされた文字列である必要があります。
base64文字列への変換が望ましくない場合は、代わりに`stringData`フィールドを指定することを選択できます。これは任意の文字列を値として受け入れます。


`data`と`stringData`のキーは、英数字、`-`、`_`、または`.`で構成されている必要があります。
`stringData`フィールドのすべてのキーと値のペアは、内部で`data`フィールドにマージされます。
キーが`data`フィールドと`stringData`フィールドの両方に表示される場合、`stringData`フィールドで指定された値が優先されます。

## Secretの種類 {#secret-types}

Secretを作成するときは、[`Secret`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)の`type`フィールド、または特定の同等の`kubectl`コマンドラインフラグ（使用可能な場合）を使用して、その型を指定できます。
Secret型は、Secret dataのプログラムによる処理を容易にするために使用されます。

Kubernetesは、いくつかの一般的な使用シナリオに対応するいくつかの組み込み型を提供します。
これらの型は、実行される検証とKubernetesが課す制約の点で異なります。

| Builtin Type | Usage |
|--------------|-------|
| `Opaque`     |  arbitrary user-defined data |
| `kubernetes.io/service-account-token` | service account token |
| `kubernetes.io/dockercfg` | serialized `~/.dockercfg` file |
| `kubernetes.io/dockerconfigjson` | serialized `~/.docker/config.json` file |
| `kubernetes.io/basic-auth` | credentials for basic authentication |
| `kubernetes.io/ssh-auth` | credentials for SSH authentication |
| `kubernetes.io/tls` | data for a TLS client or server |
| `bootstrap.kubernetes.io/token` | bootstrap token data |

Secretオブジェクトの`type`値として空でない文字列を割り当てることにより、独自のSecret型を定義して使用できます。空の文字列は`Opaque`型として扱われます。Kubernetesは型名に制約を課しません。ただし、組み込み型の1つを使用している場合は、その型に定義されているすべての要件を満たす必要があります。

### Opaque secrets

`Opaque`は、Secret構成ファイルから省略された場合のデフォルトのSecret型です。
`kubectl`を使用してSecretを作成する場合、`generic`サブコマンドを使用して`Opaque`Secret型を示します。 たとえば、次のコマンドは、`Opaque`型の空のSecretを作成します。

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

出力は次のようになります。

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

`DATA`列には、Secretに保存されているデータ項目の数が表示されます。
この場合、`0`は空のSecretを作成したことを意味します。

###  Service account token Secrets

`kubernetes.io/service-account-token`型のSecretは、サービスアカウントを識別するトークンを格納するために使用されます。 このSecret型を使用する場合は、`kubernetes.io/service-account.name`アノテーションが既存のサービスアカウント名に設定されていることを確認する必要があります。Kubernetesコントローラーは、`kubernetes.io/service-account.uid`アノテーションや実際のトークンコンテンツに設定された`data`フィールドの`token`キーなど、他のいくつかのフィールドに入力します。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # You can include additional key value pairs as you do with Opaque Secrets
  extra: YmFyCg==
```

`Pod`を作成すると、Kubernetesはservice account Secretを自動的に作成し、このSecretを使用するようにPodを自動的に変更します。service account token Secretには、APIにアクセスするための資格情報が含まれています。

API証明の自動作成と使用は、必要に応じて無効にするか、上書きすることができます。 ただし、API Serverに安全にアクセスするだけの場合は、これが推奨されるワークフローです。

ServiceAccountの動作の詳細については、[ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)のドキュメントを参照してください。
PodからServiceAccountを参照する方法については、[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)の`automountServiceAccountToken`フィールドと`serviceAccountName`フィールドを確認することもできます。

### Docker config Secrets

次の`type`値のいずれかを使用して、イメージのDockerレジストリにアクセスするための資格情報を格納するSecretを作成できます。

- `kubernetes.io/dockercfg`
- `kubernetes.io/dockerconfigjson`


`kubernetes.io/dockercfg`型は、Dockerコマンドラインを構成するためのレガシー形式であるシリアル化された`~/.dockercfg`を保存するために予約されています。
このSecret型を使用する場合は、Secretの`data`フィールドに`.dockercfg`キーが含まれていることを確認する必要があります。このキーの値は、base64形式でエンコードされた`~/.dockercfg`ファイルの内容です。

`kubernetes.io/dockerconfigjson`型は、`~/.dockercfg`の新しいフォーマットである`~/.docker/config.json`ファイルと同じフォーマットルールに従うシリアル化されたJSONを保存するために設計されています。
このSecret型を使用する場合、Secretオブジェクトの`data`フィールドには`.dockerconfigjson`キーが含まれている必要があります。このキーでは、`~/.docker/config.json`ファイルのコンテンツがbase64でエンコードされた文字列として提供されます。

以下は、`kubernetes.io/dockercfg`型のSecretの例です。

```yaml
apiVersion: v1
kind: Secret
  name: secret-dockercfg
type: kubernetes.io/dockercfg
data:
  .dockercfg: |
    "<base64 encoded ~/.dockercfg file>"
```

{{< note >}}
base64エンコーディングを実行したくない場合は、代わりに`stringData`フィールドを使用することを選択できます。
{{< /note >}}

マニフェストを使用してこれらの型のSecretを作成すると、APIserverは期待されるキーが`data`フィールドに存在するかどうかを確認し、提供された値を有効なJSONとして解析できるかどうかを確認します。APIサーバーは、JSONが実際にDocker configファイルであるかどうかを検証しません。


Docker configファイルがない場合、または`kubectl`を使用してDockerレジストリSecretを作成する場合は、次の操作を実行できます。

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-username=tiger \
  --docker-password=pass113 \
  --docker-email=tiger@acme.com \
  --docker-server=my-registry.example:5000
```

このコマンドは、`kubernetes.io/dockerconfigjson`型のSecretを作成します。
`data`フィールドから`.dockerconfigjson`コンテンツをダンプすると、その場で作成された有効なDocker configである次のJSONコンテンツを取得します。

```json
{
    "apiVersion": "v1",
    "data": {
        ".dockerconfigjson": "eyJhdXRocyI6eyJteS1yZWdpc3RyeTo1MDAwIjp7InVzZXJuYW1lIjoidGlnZXIiLCJwYXNzd29yZCI6InBhc3MxMTMiLCJlbWFpbCI6InRpZ2VyQGFjbWUuY29tIiwiYXV0aCI6ImRHbG5aWEk2Y0dGemN6RXhNdz09In19fQ=="
    },
    "kind": "Secret",
    "metadata": {
        "creationTimestamp": "2021-07-01T07:30:59Z",
        "name": "secret-tiger-docker",
        "namespace": "default",
        "resourceVersion": "566718",
        "uid": "e15c1d7b-9071-4100-8681-f3a7a2ce89ca"
    },
    "type": "kubernetes.io/dockerconfigjson"
}

```

### Basic authentication Secret

`kubernetes.io/basic-auth`型は、Basic認証に必要な認証を保存するために提供されています。このSecret型を使用する場合、Secretの`data`フィールドには次の2つのキーが含まれている必要があります。

- `username`: 認証のためのユーザー名
- `password`: 認証のためのパスワードかトークン

上記の2つのキーの両方の値は、base64でエンコードされた文字列です。もちろん、Secretの作成に`stringData`を使用してクリアテキストコンテンツを提供することもできます。

次のYAMLは、Basic authentication Secretの設定例です。


```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
stringData:
  username: admin
  password: t0p-Secret
```


Basic認証Secret型は、ユーザーの便宜のためにのみ提供されています。Basic認証に使用される資格情報の`Opaque`を作成できます。
ただし、組み込みのSecret型を使用すると、認証の形式を統一するのに役立ち、APIserverは必要なキーがSecret configurationで提供されているかどうかを確認します。


### SSH authentication secrets

組み込みのタイプ`kubernetes.io/ssh-auth`は、SSH認証で使用されるデータを保存するために提供されています。このSecret型を使用する場合、使用するSSH認証として`data`（または`stringData`）フィールドに`ssh-privatekey`キーと値のペアを指定する必要があります。

次のYAMLはSSH authentication Secretの設定例です：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # the data is abbreviated in this example
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```

SSH authentication Secret型は、ユーザーの便宜のためにのみ提供されています。
SSH認証に使用される資格情報の`Opaque`を作成できます。
ただし、組み込みのSecret型を使用すると、認証の形式を統一するのに役立ち、APIserverは必要なキーがSecret configurationで提供されているかどうかを確認します。

### TLS secrets

Kubernetesは、TLSに通常使用される証明書とそれに関連付けられたキーを保存するための組み込みのSecret型`kubernetes.io/tls`を提供します。このデータは、主にIngressリソースのTLS terminationで使用されますが、他のリソースで使用されることも、ワークロードによって直接使用されることもあります。
このSecret型を使用する場合、APIサーバーは各キーの値を実際には検証しませんが、`tls.key`および`tls.crt`キーをSecret configurationの`data`（または`stringData`）フィールドに指定する必要があります。


次のYAMLはTLS Secretの設定例です：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # the data is abbreviated in this example
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```

TLS Secret型は、ユーザーの便宜のために提供されています。 TLSサーバーやクライアントに使用される資格情報の`Opaque`を作成できます。ただし、組み込みのSecret型を使用すると、プロジェクトでSecret形式の一貫性を確保できます。APIserverは、必要なキーがSecret configurationで提供されているかどうかを確認します。

`kubectl`を使用してTLS Secretを作成する場合、次の例に示すように`tls`サブコマンドを使用できます。

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```


公開鍵と秘密鍵のペアは、事前に存在している必要があります。`--cert`の公開鍵証明書は.PEMエンコード（Base64エンコードDER形式）であり、`--key`の指定された秘密鍵と一致する必要があります。
秘密鍵は、一般にPEM秘密鍵形式と呼ばれる暗号化されていない形式である必要があります。どちらの場合も、PEMの最初と最後の行（たとえば、`-------- BEGIN CERTIFICATE -----`と`------- END CERTIFICATE ----`）は含まれて*いません*。

### Bootstrap token Secrets

Bootstrap token Secretは、Secretの`type`を`bootstrap.kubernetes.io/token`に明示的に指定することで作成できます。このタイプのSecretは、ノードのブートストラッププロセス中に使用されるトークン用に設計されています。よく知られているConfigMapに署名するために使用されるトークンを格納します。

Bootstrap token Secretは通常、`kube-system`namespaceで作成され`bootstrap-token-<token-id>`の形式で名前が付けられます。ここで`<token-id>`はトークンIDの6文字の文字列です。

Kubernetesマニフェストとして、Bootstrap token Secretは次のようになります。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```


Bootstrap type Secretには、`data`で指定された次のキーがあります。

- `token_id`：トークン識別子としてのランダムな6文字の文字列。必須。
- `token-secret`：実際のtoken secretとしてのランダムな16文字の文字列。必須。
- `description`：トークンの使用目的を説明する人間が読める文字列。オプション。
- `expiration`：トークンの有効期限を指定する[RFC3339](https://datatracker.ietf.org/doc/html/rfc3339)を使用した絶対UTC時間。オプション。
- `usage-bootstrap-<usage>`：Bootstrap tokenの追加の使用法を示すブールフラグ。
- `auth-extra-groups`：`system：bootstrappers`グループに加えて認証されるグループ名のコンマ区切りのリスト。

上記のYAMLは、値がすべてbase64でエンコードされた文字列であるため、分かりづらく見えるかもしれません。実際には、次のYAMLを使用して同一のSecretを作成できます。

```yaml
apiVersion: v1
kind: Secret
metadata:
  # Note how the Secret is named
  name: bootstrap-token-5emitj
  # A bootstrap token Secret usually resides in the kube-system namespace
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # This token ID is used in the name
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # This token can be used for authentication
  usage-bootstrap-authentication: "true"
  # and it can be used for signing
  usage-bootstrap-signing: "true"
```

## Secretの作成

Secretを作成するには、いくつかのオプションがあります。

- [create Secret using `kubectl` command](/ja/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [create Secret from config file](/ja/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [create Secret using kustomize](/ja/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

## Secretの編集

既存のSecretは次のコマンドで編集することができます。

```shell
kubectl edit secrets mysecret
```

デフォルトに設定されたエディターが開かれ、`data`フィールドのBase64でエンコードされたSecretの値を編集することができます。

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

## Secretの使用

Podの中のコンテナがSecretを使うために、データボリュームとしてマウントしたり、{{< glossary_tooltip text="環境変数" term_id="container-env-variables" >}}として値を参照できるようにできます。
Secretは直接Podが参照できるようにはされず、システムの別の部分に使われることもあります。
例えば、Secretはあなたに代わってシステムの他の部分が外部のシステムとやりとりするために使う機密情報を保持することもあります。

### SecretをファイルとしてPodから利用する

PodのボリュームとしてSecretを使うには、

1. Secretを作成するか既存のものを使用します。複数のPodが同一のSecretを参照することができます。
1. ボリュームを追加するため、Podの定義の`.spec.volumes[]`以下を書き換えます。ボリュームに命名し、`.spec.volumes[].secret.secretName`フィールドはSecretオブジェクトの名称と同一にします。
1. Secretを必要とするそれぞれのコンテナに`.spec.containers[].volumeMounts[]`を追加します。`.spec.containers[].volumeMounts[].readOnly = true`を指定して`.spec.containers[].volumeMounts[].mountPath`をSecretをマウントする未使用のディレクトリ名にします。
1. イメージやコマンドラインを変更し、プログラムがそのディレクトリを参照するようにします。連想配列`data`のキーは`mountPath`以下のファイル名になります。

これはSecretをボリュームとしてマウントするPodの例です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

使用したいSecretはそれぞれ`.spec.volumes`の中で参照されている必要があります。

Podに複数のコンテナがある場合、それぞれのコンテナが`volumeMounts`ブロックを必要としますが、`.spec.volumes`はSecret1つあたり1つで十分です。

多くのファイルを一つのSecretにまとめることも、多くのSecretを使うことも、便利な方を採ることができます。

#### Secretのキーの特定のパスへの割り当て

Secretのキーが割り当てられるパスを制御することができます。
それぞれのキーがターゲットとするパスは`.spec.volumes[].secret.items`フィールドによって指定できます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

次のような挙動をします。

* `username`は`/etc/foo/username`の代わりに`/etc/foo/my-group/my-username`の元に格納されます。
* `password`は現れません。

`.spec.volumes[].secret.items`が使われるときは、`items`の中で指定されたキーのみが現れます。
Secretの中の全てのキーを使用したい場合は、`items`フィールドに全て列挙する必要があります。
列挙されたキーは対応するSecretに存在する必要があり、そうでなければボリュームは生成されません。

#### Secretファイルのパーミッション

単一のSecretキーに対して、ファイルアクセスパーミッションビットを指定することができます。
パーミッションを指定しない場合、デフォルトで`0644`が使われます。
Secretボリューム全体のデフォルトモードを指定し、必要に応じてキー単位で上書きすることもできます。

例えば、次のようにしてデフォルトモードを指定できます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

Secretは`/etc/foo`にマウントされ、Secretボリュームが生成する全てのファイルはパーミッション`0400`に設定されます。

JSONの仕様は8進数の記述に対応していないため、パーミッション0400を示す値として256を使用することに注意が必要です。
Podの定義にJSONではなくYAMLを使う場合は、パーミッションを指定するためにより自然な8進表記を使うことができます。

`kubectl exec`を使ってPodに入るときは、期待したファイルモードを知るためにシンボリックリンクを辿る必要があることに注意してください。

例として、PodのSecretのファイルモードを確認します。
```
kubectl exec mypod -it sh

cd /etc/foo
ls -l
```

出力は次のようになります。
```
total 0
lrwxrwxrwx 1 root root 15 May 18 00:18 password -> ..data/password
lrwxrwxrwx 1 root root 15 May 18 00:18 username -> ..data/username
```

正しいファイルモードを知るためにシンボリックリンクを辿ります。

```
cd /etc/foo/..data
ls -l
```

出力は次のようになります。
```
total 8
-r-------- 1 root root 12 May 18 00:18 password
-r-------- 1 root root  5 May 18 00:18 username
```

前の例のようにマッピングを使い、ファイルごとに異なるパーミッションを指定することができます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
        mode: 0777
```

この例では、ファイル`/etc/foo/my-group/my-username`のパーミッションは`0777`になります。
JSONを使う場合は、JSONの制約により10進表記の`511`と記述する必要があります。

後で参照する場合、このパーミッションの値は10進表記で表示されることがあることに注意してください。

#### Secretの値のボリュームによる利用

Secretのボリュームがマウントされたコンテナからは、Secretのキーはファイル名として、Secretの値はBase64デコードされ、それらのファイルに格納されます。
上記の例のコンテナの中でコマンドを実行した結果を示します。

```shell
ls /etc/foo/
```

出力は次のようになります。

```
username
password
```

```shell
cat /etc/foo/username
```

出力は次のようになります。

```
admin
```

```shell
cat /etc/foo/password
```

出力は次のようになります。

```
1f2d1e2e67df
```

コンテナ内のプログラムはファイルからSecretの内容を読み取る責務を持ちます。

#### マウントされたSecretの自動更新

ボリュームとして使用されているSecretが更新されると、やがて割り当てられたキーも同様に更新されます。
kubeletは定期的な同期のたびにマウントされたSecretが新しいかどうかを確認します。
しかしながら、kubeletはSecretの現在の値の取得にローカルキャッシュを使用します。
このキャッシュは[KubeletConfiguration struct](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/kubelet/config/v1beta1/types.go)内の`ConfigMapAndSecretChangeDetectionStrategy`フィールドによって設定可能です。
Secretはwatch（デフォルト）、TTLベース、単に全てのリクエストをAPIサーバーへリダイレクトすることのいずれかによって伝搬します。
結果として、Secretが更新された時点からPodに新しいキーが反映されるまでの遅延時間の合計は、kubeletの同期間隔 + キャッシュの伝搬遅延となります。
キャッシュの遅延は、キャッシュの種別により、それぞれwatchの伝搬遅延、キャッシュのTTL、0になります。

{{< note >}}
Secretを[subPath](/docs/concepts/storage/volumes#using-subpath)を指定してボリュームにマウントしているコンテナには、Secretの更新が反映されません。
{{< /note >}}

### Secretを環境変数として使用する {#using-secrets-as-environment-variables}

SecretをPodの{{< glossary_tooltip text="環境変数" term_id="container-env-variables" >}}として使用するには、

1. Secretを作成するか既存のものを使います。複数のPodが同一のSecretを参照することができます。
1. Podの定義を変更し、Secretを使用したいコンテナごとにSecretのキーと割り当てたい環境変数を指定します。Secretキーを利用する環境変数は`env[].valueFrom.secretKeyRef`にSecretの名前とキーを指定すべきです。
1. イメージまたはコマンドライン（もしくはその両方）を変更し、プログラムが指定した環境変数を参照するようにします。

Secretを環境変数で参照するPodの例を示します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

#### 環境変数からのSecretの値の利用

Secretを環境変数として利用するコンテナの内部では、Secretのキーは一般の環境変数名として現れ、値はBase64デコードされた状態で保持されます。

上記の例のコンテナの内部でコマンドを実行した結果の例を示します。

```shell
echo $SECRET_USERNAME
```

出力は次のようになります。

```
admin
```

```shell
echo $SECRET_PASSWORD
```

出力は次のようになります。

```
1f2d1e2e67df
```

## Immutable Secrets {#secret-immutable}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

Kubernetesベータ機能*ImmutableSecrets and ConfigMaps*は、個々のSecretsとConfigMapsをimutableとして設定するオプションを提供します。Secret（少なくとも数万の、SecretからPodへの一意のマウント）を広範囲に使用するクラスターの場合、データの変更を防ぐことには次の利点があります。

- アプリケーションの停止を引き起こす可能性のある偶発的な（または不要な）更新からユーザーを保護します
- imutableとしてマークされたSecretのウォッチを閉じることで、kube-apiserverの負荷を大幅に削減することができ、クラスターのパフォーマンスを向上させます。

この機能は、`ImmutableEphemeralVolumes`[feature gate](/ja/docs/reference/command-line-tools-reference/feature-gates/)によって制御されます。これは、v1.19以降デフォルトで有効になっています。`immutable`フィールドを`true`に設定することで、imutableのSecretを作成できます。例えば、
```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```
{{< note >}}
SecretまたはConfigMapがimutableとしてマークされると、この変更を元に戻したり、`data`フィールドの内容を変更したりすることは*できません*。Secretを削除して再作成することしかできません。
既存のPodは、削除されたSecretへのマウントポイントを維持します。これらのPodを再作成することをお勧めします。
{{< /note >}}



### imagePullSecretsを使用する {#using-imagepullsecrets}

`imagePullSecrets`フィールドは同一のネームスペース内のSecretの参照のリストです。
kubeletにDockerやその他のイメージレジストリのパスワードを渡すために、`imagePullSecrets`にそれを含むSecretを指定することができます。
kubeletはこの情報をPodのためにプライベートイメージをpullするために使います。
`imagePullSecrets`の詳細は[PodSpec API](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#podspec-v1-core)を参照してください。

#### imagePullSecretを手動で指定する

`ImagePullSecrets`の指定の方法は[コンテナイメージのドキュメント](/ja/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)に記載されています。

### imagePullSecretsが自動的にアタッチされるようにする

`imagePullSecrets`を手動で作成し、サービスアカウントから参照することができます。
サービスアカウントが指定されるまたはデフォルトでサービスアカウントが設定されたPodは、サービスアカウントが持つ`imagePullSecrets`フィールドを得ます。
詳細な手順の説明は[サービスアカウントへのImagePullSecretsの追加](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)を参照してください。

### 手動で作成されたSecretの自動的なマウント

手動で作成されたSecret（例えばGitHubアカウントへのアクセスに使うトークンを含む）はサービスアカウントを基に自動的にアタッチすることができます。
詳細な説明は[PodPresetを使ったPodへの情報の注入](/docs/tasks/inject-data-application/podpreset/)を参照してください。

## 詳細

### 制限事項

Secretボリュームは指定されたオブジェクト参照が実際に存在するSecretオブジェクトを指していることを保証するため検証されます。
そのため、Secretはそれを必要とするPodよりも先に作成する必要があります。

Secretリソースは{{< glossary_tooltip text="namespace" term_id="namespace" >}}に属します。
Secretは同一のnamespaceに属するPodからのみ参照することができます。

各Secretは1MiBの容量制限があります。
これはAPIサーバーやkubeletのメモリーを枯渇するような非常に大きなSecretを作成することを避けるためです。
しかしながら、小さなSecretを多数作成することも同様にメモリーを枯渇させます。
Secretに起因するメモリー使用量をより網羅的に制限することは、将来計画されています。

kubeletがPodに対してSecretを使用するとき、APIサーバーから取得されたSecretのみをサポートします。
これには`kubectl`を利用して、またはレプリケーションコントローラーによって間接的に作成されたPodが含まれます。
kubeletの`--manifest-url`フラグ、`--config`フラグ、またはREST APIにより生成されたPodは含まれません
（これらはPodを生成するための一般的な方法ではありません）。

環境変数として使われるSecretは任意と指定されていない限り、それを使用するPodよりも先に作成される必要があります。
存在しないSecretへの参照はPodの起動を妨げます。

Secretに存在しないキーへの参照（`secretKeyRef`フィールド）はPodの起動を妨げます。

Secretを`envFrom`フィールドによって環境変数へ設定する場合、環境変数の名称として不適切なキーは飛ばされます。
Podは起動することを認められます。
このとき、reasonが`InvalidVariableNames`であるイベントが発生し、メッセージに飛ばされたキーのリストが含まれます。
この例では、Podは2つの不適切なキー`1badkey`と`2alsobad`を含むdefault/mysecretを参照しています。

```shell
kubectl get events
```

出力は次のようになります。

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

### SecretとPodの相互作用

Kubernetes APIがコールされてPodが生成されるとき、参照するSecretの存在は確認されません。
Podがスケジューリングされると、kubeletはSecretの値を取得しようとします。
Secretが存在しない、または一時的にAPIサーバーへの接続が途絶えたことにより取得できない場合、kubeletは定期的にリトライします。
kubeletはPodがまだ起動できない理由に関するイベントを報告します。
Secretが取得されると、kubeletはそのボリュームを作成しマウントします。
Podのボリュームが全てマウントされるまでは、Podのコンテナは起動することはありません。

## ユースケース

### ユースケース: コンテナの環境変数として

Secretの作成
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```

```shell
kubectl apply -f mysecret.yaml
```

`envFrom`を使ってSecretの全てのデータをコンテナの環境変数として定義します。
SecretのキーはPod内の環境変数の名称になります。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

### ユースケース: SSH鍵を持つPod

SSH鍵を含むSecretを作成します。

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

出力は次のようになります。

```
secret "ssh-key-secret" created
```

SSH鍵を含む`secretGenerator`フィールドを持つ`kustomization.yaml`を作成することもできます。

{{< caution >}}
自身のSSH鍵を送る前に慎重に検討してください。クラスターの他のユーザーがSecretにアクセスできる可能性があります。
Kubernetesクラスターを共有しているユーザー全員がアクセスできるようにサービスアカウントを使用し、ユーザーが安全でない状態になったらアカウントを無効化することができます。
{{< /caution >}}

SSH鍵のSecretを参照し、ボリュームとして使用するPodを作成することができます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

コンテナのコマンドを実行するときは、下記のパスにて鍵が利用可能です。

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

コンテナはSecretのデータをSSH接続を確立するために使用することができます。

### ユースケース: 本番、テスト用の認証情報を持つPod

あるPodは本番の認証情報のSecretを使用し、別のPodはテスト環境の認証情報のSecretを使用する例を示します。

`secretGenerator`フィールドを持つ`kustomization.yaml`を作成するか、`kubectl create secret`を実行します。

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

出力は次のようになります。

```
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

出力は次のようになります。

```
secret "test-db-secret" created
```

{{< note >}}
`$`、`\`、`*`、`=`、`!`のような特殊文字は[シェル](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%82%A7%E3%83%AB)に解釈されるので、エスケープする必要があります。
ほとんどのシェルではパスワードをエスケープする最も簡単な方法はシングルクォート(`'`)で囲むことです。
例えば、実際のパスワードが`S!B\*d$zDsb=`だとすると、実行すべきコマンドは下記のようになります。

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

`--from-file`によってファイルを指定する場合は、そのパスワードに含まれる特殊文字をエスケープする必要はありません。
{{< /note >}}

Podを作成します。

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

同じkustomization.yamlにPodを追記します。

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

下記のコマンドを実行して、APIサーバーにこれらのオブジェクト群を適用します。

```shell
kubectl apply -k .
```

両方のコンテナはそれぞれのファイルシステムに下記に示すファイルを持ちます。ファイルの値はそれぞれのコンテナの環境ごとに異なります。

```
/etc/secret-volume/username
/etc/secret-volume/password
```

2つのPodの仕様の差分は1つのフィールドのみである点に留意してください。
これは共通のPodテンプレートから異なる能力を持つPodを作成することを容易にします。

2つのサービスアカウントを使用すると、ベースのPod仕様をさらに単純にすることができます。

1. `prod-user`と`prod-db-secret`
1. `test-user`と`test-db-secret`

簡略化されたPod仕様は次のようになります。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### ユースケース: Secretボリューム内のdotfile

キーをドットから始めることで、データを「隠す」ことができます。
このキーはdotfileまたは「隠し」ファイルを示します。例えば、次のSecretは`secret-volume`ボリュームにマウントされます。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: registry.k8s.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

このボリュームは`.secret-file`という単一のファイルを含み、`dotfile-test-container`はこのファイルを`/etc/secret-volume/.secret-file`のパスに持ちます。

{{< note >}}
ドットから始まるファイルは`ls -l`の出力では隠されるため、ディレクトリの内容を参照するときには`ls -la`を使わなければなりません。
{{< /note >}}

### ユースケース: Podの中の単一コンテナのみが参照できるSecret

HTTPリクエストを扱い、複雑なビジネスロジックを処理し、メッセージにHMACによる認証コードを付与する必要のあるプログラムを考えます。
複雑なアプリケーションロジックを持つため、サーバーにリモートのファイルを読み出せる未知の脆弱性がある可能性があり、この脆弱性は攻撃者に秘密鍵を晒してしまいます。

このプログラムは2つのコンテナに含まれる2つのプロセスへと分割することができます。
フロントエンドのコンテナはユーザーとのやりとりやビジネスロジックを扱い、秘密鍵を参照することはできません。
署名コンテナは秘密鍵を参照することができて、単にフロントエンドからの署名リクエストに応答します。例えば、localhostの通信によって行います。

この分割する手法によって、攻撃者はアプリケーションサーバーを騙して任意の処理を実行させる必要があるため、ファイルの内容を読み出すより困難になります。

<!-- TODO: explain how to do this while still using automation. -->

## ベストプラクティス

### Secret APIを使用するクライアント

Secret APIとやりとりするアプリケーションをデプロイするときには、[RBAC](
/ja/docs/reference/access-authn-authz/rbac/)のような[認可ポリシー](
/docs/reference/access-authn-authz/authorization/)を使用して、アクセスを制限すべきです。
Secretは様々な種類の重要な値を保持することが多く、サービスアカウントのトークンのようにKubernetes内部や、外部のシステムで昇格できるものも多くあります。個々のアプリケーションが、Secretの能力について推論することができたとしても、同じネームスペースの別のアプリケーションがその推定を覆すこともあります。

これらの理由により、ネームスペース内のSecretに対する`watch`や`list`リクエストはかなり強力な能力であり、避けるべきです。Secretのリストを取得することはクライアントにネームスペース内の全てのSecretの値を調べさせることを認めるからです。クラスター内の全てのSecretに対する`watch`、`list`権限は最も特権的な、システムレベルのコンポーネントに限って認めるべきです。

Secret APIへのアクセスが必要なアプリケーションは、必要なSecretに対する`get`リクエストを発行すべきです。管理者は全てのSecretに対するアクセスは制限しつつ、アプリケーションが必要とする[個々のインスタンスに対するアクセス許可](/docs/reference/access-authn-authz/rbac/#referring-to-resources)を与えることができます。

`get`リクエストの繰り返しに対するパフォーマンスを向上するために、クライアントはSecretを参照するリソースを設計し、それを`watch`して、参照が変更されたときにSecretを再度リクエストすることができます。加えて、個々のリソースを`watch`することのできる["bulk watch" API](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)が提案されており、将来のKubernetesリリースにて利用可能になる可能性があります。

## セキュリティ特性

### 保護

Secretはそれを使用するPodとは独立に作成されるので、Podを作ったり、参照したり、編集したりするワークフローにおいてSecretが晒されるリスクは軽減されています。
システムは、可能であればSecretの内容をディスクに書き込まないような、Secretについて追加の考慮も行っています。

Secretはノード上のPodが必要とした場合のみ送られます。
kubeletはSecretがディスクストレージに書き込まれないよう、`tmpfs`に保存します。
Secretを必要とするPodが削除されると、kubeletはSecretのローカルコピーも同様に削除します。

同一のノードにいくつかのPodに対する複数のSecretが存在することもあります。
しかし、コンテナから参照できるのはPodが要求したSecretのみです。
そのため、あるPodが他のPodのためのSecretにアクセスすることはできません。

Podに複数のコンテナが含まれることもあります。しかし、Podの各コンテナはコンテナ内からSecretを参照するために`volumeMounts`によってSecretボリュームを要求する必要があります。
これは[Podレベルでのセキュリティ分離](#use-case-secret-visible-to-one-container-in-a-pod)を実装するのに便利です。

ほとんどのKubernetesディストリビューションにおいては、ユーザーとAPIサーバー間やAPIサーバーからkubelet間の通信はSSL/TLSで保護されています。
そのような経路で伝送される場合、Secretは保護されています。

{{< feature-state for_k8s_version="v1.13" state="beta" >}}


[保存データの暗号化](/docs/tasks/administer-cluster/encrypt-data/)を有効にして、Secretが{{< glossary_tooltip term_id="etcd" >}}に平文で保存されないようにすることができます。

### リスク

 - APIサーバーでは、機密情報は{{< glossary_tooltip term_id="etcd" >}}に保存されます。
   そのため、
   - 管理者はクラスターデータの保存データの暗号化を有効にすべきです（v1.13以降が必要）。
   - 管理者はetcdへのアクセスを管理ユーザに限定すべきです。
   - 管理者はetcdで使用していたディスクを使用しなくなったときにはそれをワイプするか完全消去したくなるでしょう。
   - クラスターの中でetcdが動いている場合、管理者はetcdのピアツーピア通信がSSL/TLSを利用していることを確認すべきです。
 - Secretをマニフェストファイル（JSONまたはYAML）を介して設定する場合、それはBase64エンコードされた機密情報を含んでいるので、ファイルを共有したりソースリポジトリに入れることは秘密が侵害されることを意味します。Base64エンコーディングは暗号化手段では _なく_ 、平文と同様であると判断すべきです。
 - アプリケーションはボリュームからSecretの値を読み取った後も、その値を保護する必要があります。例えば意図せずログに出力する、信用できない相手に送信するようなことがないようにです。
 - Secretを利用するPodを作成できるユーザーはSecretの値を見ることができます。たとえAPIサーバーのポリシーがユーザーにSecretの読み取りを許可していなくても、ユーザーはSecretを晒すPodを実行することができます。
 - 現在、任意のノードでルート権限を持つ人は誰でも、kubeletに偽装することで _任意の_ SecretをAPIサーバーから読み取ることができます。
 単一のノードのルート権限を不正に取得された場合の影響を抑えるため、実際に必要としているノードに対してのみSecretを送る機能が計画されています。


## {{% heading "whatsnext" %}}

- [`kubectl`を使用してSecretを管理する](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)方法を学ぶ
- [config fileを使用してSecretを管理する](/docs/tasks/configmap-secret/managing-secret-using-config-file/)方法を学ぶ
- [kustomizeを使用してSecretを管理する](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)方法を学ぶ
- [SecretのAPIリファレンス](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)を読む
