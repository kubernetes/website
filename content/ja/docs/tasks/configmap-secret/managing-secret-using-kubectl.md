---
title: kubectlを使用してSecretを管理する
content_type: task
weight: 10
description: kubectlコマンドラインを使用してSecretを作成する
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Secretを作成する

`Secret`はデータベースにアクセスするためにPodが必要とするユーザー資格情報を含めることができます。
たとえば、データベース接続文字列はユーザー名とパスワードで構成されます。
ユーザー名はローカルマシンの`./username.txt`に、パスワードは`./password.txt`に保存します。

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

上記の2つのコマンドの`-n`フラグは、生成されたファイルにテキスト末尾の余分な改行文字が含まれないようにします。
`kubectl`がファイルを読み取り、内容をbase64文字列にエンコードすると、余分な改行文字もエンコードされるため、これは重要です。

`kubectl create secret`コマンドはこれらのファイルをSecretにパッケージ化し、APIサーバー上にオブジェクトを作成します。

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

出力は次のようになります:

```
secret/db-user-pass created
```

ファイル名がデフォルトのキー名になります。オプションで`--from-file=[key=]source`を使用してキー名を設定できます。たとえば:

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

`--from-file`に指定したファイルに含まれるパスワードの特殊文字をエスケープする必要はありません。

また、`--from-literal=<key>=<value>`タグを使用してSecretデータを提供することもできます。
このタグは、複数のキーと値のペアを提供するために複数回指定することができます。
`$`、`\`、`*`、`=`、`!`などの特殊文字は[シェル](https://en.wikipedia.org/wiki/Shell_(computing))によって解釈されるため、エスケープを必要とすることに注意してください。
ほとんどのシェルでは、パスワードをエスケープする最も簡単な方法は、シングルクォート(`'`)で囲むことです。
たとえば、実際のパスワードが`S!B\*d$zDsb=`の場合、次のようにコマンドを実行します:

```shell
kubectl create secret generic db-user-pass \
  --from-literal=username=admin \
  --from-literal=password='S!B\*d$zDsb='
```

## Secretを検証する

Secretが作成されたことを確認できます:

```shell
kubectl get secrets
```

出力は次のようになります:

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

`Secret`の説明を参照できます:

```shell
kubectl describe secrets/db-user-pass
```

出力は次のようになります:

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

`kubectl get`と`kubectl describe`コマンドはデフォルトでは`Secret`の内容を表示しません。
これは、`Secret`が不用意に他人にさらされたり、ターミナルログに保存されたりしないようにするためです。

## Secretをデコードする  {#decoding-secret}

先ほど作成したSecretの内容を見るには、以下のコマンドを実行します:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

出力は次のようになります:

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

`password`のデータをデコードします:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

出力は次のようになります:

```
1f2d1e2e67df
```

## クリーンアップ

作成したSecretを削除するには次のコマンドを実行します:

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- [Secretのコンセプト](/ja/docs/concepts/configuration/secret/)を読む
- [設定ファイルを使用してSecretを管理する](/ja/docs/tasks/configmap-secret/managing-secret-using-config-file/)方法を知る
- [kustomizeを使用してSecretを管理する](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)方法を知る
