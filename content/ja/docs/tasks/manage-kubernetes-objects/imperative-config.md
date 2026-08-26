---
title: 設定ファイルを使用したKubernetesオブジェクトの命令的管理
content_type: task
weight: 40
---

<!-- overview -->
Kubernetesオブジェクトは、YAMLやJSONで書かれたオブジェクト設定ファイルと`kubectl`コマンドラインツールを使用して作成、更新、削除できます。
このドキュメントでは、設定ファイルを使用したオブジェクトの定義と管理の方法を説明します。

## {{% heading "prerequisites" %}}


[`kubectl`](/docs/tasks/tools/)をインストールしてください。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## トレードオフ

`kubectl`ツールは3種類のオブジェクト管理をサポートしています:

* 命令型コマンド
* 命令型オブジェクト設定
* 宣言型オブジェクト設定

オブジェクト管理の各手法におけるメリットとデメリットについては、[Kubernetesオブジェクトの管理](/docs/concepts/overview/working-with-objects/object-management/)を参照してください。

## オブジェクトの作成方法

`kubectl create -f`を使用して、設定ファイルからオブジェクトを作成できます。
詳細については、[Kubernetes APIリファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)を参照してください。

* `kubectl create -f <filename|url>`

## オブジェクトの更新方法

{{< warning >}}
`replace`コマンドを使用してオブジェクトを更新すると、設定ファイルに指定されていないspecの記述はすべて破棄されます。
そのため、`LoadBalancer`タイプのServiceのように、`externalIPs`フィールドが設定ファイルとは無関係にクラスターによって管理されているような、specの一部がクラスター側で管理されているオブジェクトには`replace`を使用すべきではありません。
`replace`によるフィールドの削除を防ぐには、独立して管理されているフィールドを設定ファイルへコピーしておく必要があります。
{{< /warning >}}

`kubectl replace -f`を使用すると、設定ファイルの内容に従って稼働中のオブジェクトを更新できます。

* `kubectl replace -f <filename|url>`

## オブジェクトの削除方法

`kubectl delete -f`を使用して、設定ファイルに記述されたオブジェクトを削除できます。

* `kubectl delete -f <filename|url>`

{{< note >}}
設定ファイルの`metadata`セクションで`name`フィールドではなく`generateName`フィールドが指定されている場合、`kubectl delete -f <filename|url>`でオブジェクトを削除することはできません。
オブジェクトを削除するには、別のフラグを使用する必要があります。例えば:

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```
{{< /note >}}

## オブジェクトの確認方法

`kubectl get -f`を使用して、設定ファイルに記述されているオブジェクトの情報を確認できます。

* `kubectl get -f <filename|url> -o yaml`

`-o yaml`フラグを指定すると、完全なオブジェクト設定が出力されます。
利用可能なオプションの一覧を確認するには、`kubectl get -h`を使用してください。

## 制限事項

`create`、`replace`、および`delete`コマンドは、各オブジェクトの設定が設定ファイル内に完全に定義・記録されている場合には問題なく動作します。
しかし、稼働中のオブジェクトに対して加えられた変更が設定ファイルに統合されていない場合、次回`replace`を実行したタイミングでそれらの変更は失われます。
これは、HorizontalPodAutoscalerなどのコントローラーが稼働中のオブジェクトに直接変更を加えた場合などに発生します。
以下はその一例です。

1. 設定ファイルを使用してオブジェクトを作成します。
1. 別の変更元(コントローラーなど)が一部のフィールドを変更し、オブジェクトを更新します。
1. 設定ファイルを使ってオブジェクトを置換(`replace`)します。このとき、ステップ2で別の変更元によって加えられた変更は失われます。

同一オブジェクトに対する複数の書き込み元をサポートする必要がある場合は、`kubectl apply`を使用してオブジェクトを管理できます。

## 設定ファイルを保存せずにURLからオブジェクトを作成・編集する

オブジェクト設定ファイルのURLがある場合、`kubectl create --edit`を使用すると、オブジェクトが作成される前に設定を変更できます。
これは、読者が内容を変更して適用するようなチュートリアルやタスクで特に便利です。

```shell
kubectl create -f <url> --edit
```

## 命令型コマンドから命令型オブジェクト設定への移行

命令型コマンドから命令型オブジェクト設定へ移行するには、いくつか手動での手順が必要です。

1. 稼働中のオブジェクトをローカルのオブジェクト設定ファイルにエクスポートします:

    ```shell
    kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
    ```

1. オブジェクト設定ファイルから`status`フィールドを手動で削除します。

1. 以降のオブジェクト管理には、`replace`のみを使用します。

    ```shell
    kubectl replace -f <kind>_<name>.yaml
    ```

## コントローラーセレクターとPodテンプレートラベルの定義

{{< warning >}}
コントローラーのセレクターを更新することは強く非推奨です。
{{< /warning >}}

推奨されるアプローチは、単一の不変なPodテンプレートラベルを定義することです。
このラベルはコントローラーセレクター専用とし、他の意味を持たせないようにします。

ラベルの例:

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```



## {{% heading "whatsnext" %}}


* [命令型コマンドを使用したKubernetesオブジェクトの管理](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [設定ファイルを使用したKubernetesオブジェクトの宣言的管理](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectlコマンドリファレンス](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes APIリファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
