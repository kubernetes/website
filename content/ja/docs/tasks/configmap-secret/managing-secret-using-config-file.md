---
title: 設定ファイルを使用してSecretを管理する
content_type: task
weight: 20
description: リソース設定ファイルを使用してSecretを作成する
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 設定ファイルを作成する

あらかじめYAMLまたはJSON形式でSecretのマニフェストを作成したうえで、オブジェクトを作成することができます。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)リソースには、`data`と`stringData`の2つのマップが含まれています。
`data`フィールドは任意のデータを格納するのに使用され、base64でエンコードされます。
`stringData`フィールドは利便性のために用意されており、Secretデータをエンコードされていない文字列として提供することができます。
`data`と`stringData`のキーは、英数字、`-`、`_`、`.`で構成されている必要があります。

たとえば、`data`フィールドを使用して2つの文字列をSecretに格納するには、次のように文字列をbase64に変換します:

```shell
echo -n 'admin' | base64
```

出力は次のようになります:

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

出力は次のようになります:

```
MWYyZDFlMmU2N2Rm
```

以下のようなSecret設定ファイルを記述します:

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

なお、Secretオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

{{< note >}}
SecretデータのシリアライズされたJSONおよびYAMLの値は、base64文字列としてエンコードされます。
文字列の中の改行は不正で、含まれていてはなりません。
Darwin/macOSで`base64`ユーティリティーを使用する場合、長い行を分割するために`-b`オプションを使用するのは避けるべきです。
逆に、Linux ユーザーは、`base64` コマンドにオプション`-w 0`を追加するか、`-w`オプションが利用できない場合には、パイプライン`base64 | tr -d '\n'`を追加する*必要があります*。
{{< /note >}}

特定のシナリオでは、代わりに`stringData`フィールドを使用できます。
このフィールドでは、base64エンコードされていない文字列を直接Secretに入れることができ、Secretの作成時や更新時には、その文字列がエンコードされます。

たとえば、設定ファイルを保存するためにSecretを使用しているアプリケーションをデプロイする際に、デプロイプロセス中に設定ファイルの一部を入力したい場合などが考えられます。

たとえば、次のような設定ファイルを使用しているアプリケーションの場合:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

次のような定義でSecretに格納できます:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

## Secretを作成する

[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)でSecretを作成します:

```shell
kubectl apply -f ./secret.yaml
```

出力は次のようになります:

```
secret/mysecret created
```

## Secretを確認する

`stringData`フィールドは、書き込み専用の便利なフィールドです。Secretを取得する際には決して出力されません。たとえば、次のようなコマンドを実行した場合:

```shell
kubectl get secret mysecret -o yaml
```

出力は次のようになります:

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

`kubectl get`と`kubectl describe`コマンドはデフォルトではSecretの内容を表示しません。
これは、Secretが不用意に他人にさらされたり、ターミナルログに保存されたりしないようにするためです。
エンコードされたデータの実際の内容を確認するには、[Secretのデコード](/ja/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)を参照してください。

`username`などのフィールドが`data`と`stringData`の両方に指定されている場合は、`stringData`の値が使われます。
たとえば、以下のようなSecretの定義の場合:

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

結果は以下の通りです:

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

`YWRtaW5pc3RyYXRvcg==`をデコードすると`administrator`となります。

## クリーンアップ

作成したSecretを削除するには次のコマンドを実行します:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- [Secretのコンセプト](/ja/docs/concepts/configuration/secret/)を読む
- [kubectlを使用してSecretを管理する](/ja/docs/tasks/configmap-secret/managing-secret-using-kubectl/)方法を知る
- [kustomizeを使用してSecretを管理する](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)方法を知る
