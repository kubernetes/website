---
title: Secrets
content_type: concept
feature:
  title: Secretと構成管理
  description: >
    Secretやアプリケーションの構成情報を、イメージの再ビルドや機密情報を晒すことなくデプロイ、更新します
weight: 30
---

<!-- overview -->

KubernetesのSecretはパスワード、OAuthトークン、SSHキーのような機密情報を保存し、管理できるようにします。
Secretに機密情報を保存することは、それらを{{< glossary_tooltip text="Pod" term_id="pod" >}}の定義や{{< glossary_tooltip text="コンテナイメージ" term_id="image" >}}に直接記載するより、安全で柔軟です。詳しくは[Secretの設計文書](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md)を参照してください。



<!-- body -->

## Secretの概要

Secretはパスワード、トークン、キーのような小容量の機密データを含むオブジェクトです。
他の方法としては、そのような情報はPodの定義やイメージに含めることができます。
ユーザーはSecretを作ることができ、またシステムが作るSecretもあります。

Secretを使うには、PodはSecretを参照することが必要です。
PodがSecretを使う方法は3種類あります。

- {{< glossary_tooltip text="ボリューム" term_id="volume" >}}内の[ファイル](#using-secrets-as-files-from-a-pod)として、Podの単一または複数のコンテナにマウントする
- [コンテナの環境変数](#using-secrets-as-environment-variables)として利用する
- Podを生成するために[kubeletがイメージをpullする](#using-imagepullsecrets)ときに使用する

### 内蔵のSecret

#### 自動的にサービスアカウントがAPIの認証情報のSecretを生成し、アタッチする

KubernetesはAPIにアクセスするための認証情報を含むSecretを自動的に生成し、この種のSecretを使うように自動的にPodを改変します。

必要であれば、APIの認証情報が自動生成され利用される機能は無効化したり、上書きしたりすることができます。しかし、安全にAPIサーバーでアクセスすることのみが必要なのであれば、これは推奨されるワークフローです。

サービスアカウントがどのように機能するのかについては、[サービスアカウント](/docs/tasks/configure-pod-container/configure-service-account/)
のドキュメントを参照してください。

### Secretを作成する

#### `kubectl`を利用してSecretを作成する

SecretにはPodがデータベースにアクセスするために必要な認証情報を含むことができます。
例えば、ユーザー名とパスワードからなる接続文字列です。
ローカルマシンのファイル`./username.txt`にユーザー名を、ファイル`./password.txt`にパスワードを保存することができます。

```shell
# この後の例で使用するファイルを作成します
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

`kubectl create secret`コマンドはそれらのファイルをSecretに格納して、APIサーバー上でオブジェクトを作成します。
Secretオブジェクトの名称は正当な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要があります。

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

次のように出力されます:

```
secret "db-user-pass" created
```

デフォルトのキー名はファイル名です。`[--from-file=[key=]source]`を使って任意でキーを指定することができます。

```shell
kubectl create secret generic db-user-pass --from-file=username=./username.txt --from-file=password=./password.txt
```

{{< note >}}
`$`、`\`、`*`、`=`、`!`のような特殊文字は[シェル](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%82%A7%E3%83%AB)に解釈されるので、エスケープする必要があります。
ほとんどのシェルではパスワードをエスケープする最も簡単な方法はシングルクォート(`'`)で囲むことです。
例えば、実際のパスワードが`S!B\*d$zDsb=`だとすると、実行すべきコマンドは下記のようになります。

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

`--from-file`を使ってファイルからパスワードを読み込む場合、ファイルに含まれるパスワードの特殊文字をエスケープする必要はありません。
{{< /note >}}

Secretが作成されたことを確認できます。

```shell
kubectl get secrets
```

出力は次のようになります。

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

Secretの説明を参照することができます。

```shell
kubectl describe secrets/db-user-pass
```

出力は次のようになります。

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
`kubectl get`や`kubectl describe`コマンドはデフォルトではSecretの内容の表示を避けます。
これはSecretを誤って盗み見られたり、ターミナルのログへ記録されてしまったりすることがないよう保護するためです。
{{< /note >}}

Secretの内容を参照する方法は[Secretのデコード](#decoding-a-secret)を参照してください。

#### 手動でSecretを作成する

SecretをJSONまたはYAMLフォーマットのファイルで作成し、その後オブジェクトを作成することができます。
Secretオブジェクトの名称は正当な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要があります。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)は、`data`と`stringData`の2つの連想配列を持ちます。
`data`フィールドは任意のデータの保存に使われ、Base64でエンコードされています。
`stringData`は利便性のために存在するもので、機密データをエンコードされない文字列で扱えます。

例えば、`data`フィールドを使って1つのSecretに2つの文字列を保存するには、次のように文字列をBase64エンコードします。

```shell
echo -n 'admin' | base64
```

出力は次のようになります。

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

出力は次のようになります。

```
MWYyZDFlMmU2N2Rm
```

このようなSecretを書きます。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

これでSecretを[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)コマンドで作成できるようになりました。

```shell
kubectl apply -f ./secret.yaml
```

出力は次のようになります。

```
secret "mysecret" created
```

状況によっては、代わりに`stringData`フィールドを使いたいときもあるでしょう。
このフィールドを使えばBase64でエンコードされていない文字列を直接Secretに書くことができて、その文字列はSecretが作られたり更新されたりするときにエンコードされます。

実用的な例として、設定ファイルの格納にSecretを使うアプリケーションをデプロイすることを考えます。
デプロイプロセスの途中で、この設定ファイルの一部のデータを投入したいとしましょう。

例えば、アプリケーションは次のような設定ファイルを使用するとします。

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

次のような定義を使用して、この設定ファイルをSecretに保存することができます。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

デプロイツールは`kubectl apply`を実行する前に`{{username}}`と`{{password}}`のテンプレート変数を置換することができます。

`stringData`フィールドは利便性のための書き込み専用フィールドです。
Secretを取得するときに出力されることは決してありません。
例えば、次のコマンドを実行すると、

```shell
kubectl get secret mysecret -o yaml
```

出力は次のようになります。

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

`username`のようなフィールドを`data`と`stringData`の両方で指定すると、`stringData`の値が使用されます。
例えば、次のSecret定義からは

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

次のようなSecretが生成されます。

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

`YWRtaW5pc3RyYXRvcg==`をデコードすると`administrator`になります。

`data`や`stringData`のキーは英数字または'-'、'_'、'.'からなる必要があります。

{{< note >}}
シリアライズされたJSONやYAMLの機密データはBase64エンコードされています。
文字列の中の改行は不正で、含まれていてはなりません。
Darwin/macOSの`base64`ユーティリティーを使うときは、長い行を分割する`-b`オプションを指定するのは避けるべきです。
反対に、Linuxユーザーは`base64`コマンドに`-w 0`オプションを指定するか、`-w`オプションが使えない場合は`base64 | tr -d '\n'`のようにパイプ*すべき*です。
{{< /note >}}

#### ジェネレーターからSecretを作成する

Kubernetes v1.14から、`kubectl`は[Kustomizeを使ったオブジェクトの管理](/docs/tasks/manage-kubernetes-objects/kustomization/)に対応しています。
KustomizeはSecretやConfigMapを生成するリソースジェネレーターを提供します。
Kustomizeのジェネレーターはディレクトリの中の`kustomization.yaml`ファイルにて指定されるべきです。
Secretが生成された後には、`kubectl apply`コマンドを使用してAPIサーバー上にSecretを作成することができます。

#### ファイルからのSecretの生成

./username.txtと./password.txtのファイルから生成するように`secretGenerator`を定義することで、Secretを生成することができます。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```

Secretを生成するには、`kustomization.yaml`を含むディレクトリをapplyします。

```shell
kubectl apply -k .
```

出力は次のようになります。

```
secret/db-user-pass-96mffmfh4k created
```

Secretが生成されたことを確認できます。

```shell
kubectl get secrets
```

出力は次のようになります。

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

出力は次のようになります。

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

#### 文字列リテラルからのSecretの生成

リテラル`username=admin`と`password=secret`から生成するように`secretGenerator`を定義して、Secretを生成することができます。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```

Secretを生成するには、`kustomization.yaml`を含むディレクトリをapplyします。

```shell
kubectl apply -k .
```

出力は次のようになります。

```
secret/db-user-pass-dddghtt9b5 created
```

{{< note >}}
Secretが生成されるとき、Secretのデータからハッシュ値が算出され、Secretの名称にハッシュ値が加えられます。
これはデータが更新されたときに毎回新しいSecretが生成されることを保証します。
{{< /note >}}

#### Secretのデコード

Secretは`kubectl get secret`を実行することで取得可能です。
例えば、前のセクションで作成したSecretは次のコマンドを実行することで参照できます。

```shell
kubectl get secret mysecret -o yaml
```

出力は次のようになります。

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

`password`フィールドをデコードします。

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

出力は次のようになります。

```
1f2d1e2e67df
```

#### Secretの編集

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
それぞれのキーがターゲットとするパスは`.spec.volumes[].secret.items`フィールドによって指定てきます。

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
このキャッシュは[KubeletConfiguration struct](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)内の`ConfigMapAndSecretChangeDetectionStrategy`フィールドによって設定可能です。
Secretはwatch（デフォルト）、TTLベース、単に全てのリクエストをAPIサーバーへリダイレクトすることのいずれかによって伝搬します。
結果として、Secretが更新された時点からPodに新しいキーが反映されるまでの遅延時間の合計は、kubeletの同期間隔 + キャッシュの伝搬遅延となります。
キャッシュの遅延は、キャッシュの種別により、それぞれwatchの伝搬遅延、キャッシュのTTL、0になります。

{{< note >}}
Secretを[subPath](/docs/concepts/storage/volumes#using-subpath)を指定してボリュームにマウントしているコンテナには、Secretの更新が反映されません。
{{< /note >}}

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Kubernetesのアルファ機能である _Immutable Secrets and ConfigMaps_ は各SecretやConfigMapが不変であると設定できるようにします。
Secretを広範に利用しているクラスター（PodにマウントされているSecretが1万以上）においては、データが変更されないようにすることで次のような利点が得られます。

- 意図しない（または望まない）変更によってアプリケーションの停止を引き起こすことを防ぎます
- 不変であると設定されたSecretの監視を停止することにより、kube-apiserverの負荷が著しく軽減され、クラスターのパフォーマンスが改善されます

この機能を利用するには、`ImmutableEphemeralVolumes`[feature gate](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にして、SecretまたはConfigMapの`immutable`フィールドに`true`を指定します。例えば、次のようにします。

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
一度SecretやConfigMapを不変であると設定すると、この変更を戻すことや`data`フィールドの内容を書き換えることは _できません_ 。
Secretを削除して、再生成することだけができます。
既存のPodは削除されたSecretへのマウントポイントを持ち続けるため、Podを再生成することが推奨されます。
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

### imagePullSecretsを使用する {#using-imagepullsecrets}

`imagePullSecrets`フィールドは同一のネームスペース内のSecretの参照のリストです。
kubeletにDockerやその他のイメージレジストリのパスワードを渡すために、`imagePullSecrets`にそれを含むSecretを指定することができます。
kubeletはこの情報をPodのためにプライベートイメージをpullするために使います。
`imagePullSecrets`の詳細は[PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)を参照してください。

#### imagePullSecretを手動で指定する

`ImagePullSecrets`の指定の方法は[コンテナイメージのドキュメント](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)に記載されています。

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
      image: k8s.gcr.io/busybox
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

コンテナーはSecretのデータをSSH接続を確立するために使用することができます。

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

1. `prod-user` と `prod-db-secret`
1. `test-user` と `test-db-secret`

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
    image: k8s.gcr.io/busybox
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
/docs/reference/access-authn-authz/rbac/)のような[認可ポリシー](
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
