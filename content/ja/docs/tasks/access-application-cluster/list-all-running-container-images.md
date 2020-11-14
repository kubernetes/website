---
title: クラスターで実行されているすべてのコンテナイメージを一覧表示する
content_type: task
weight: 100
---

<!-- overview -->

このページでは、kubectlを使用して、クラスターで実行されているPodのすべてのコンテナイメージを一覧表示する方法を説明します。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

この演習では、kubectlを使用してクラスターで実行されているすべてのPodを取得し、出力をフォーマットしてそれぞれのコンテナの一覧を取得します。

## すべての名前空間のコンテナイメージを一覧表示する {#list-all-container-images-in-all-namespaces}

- `kubectl get pods --all-namespaces`を使用して、すべての名前空間のPodを取得します
- `-o jsonpath={.. image}`を使用して、コンテナイメージ名のリストのみが含まれるように出力をフォーマットします。これは、返されたjsonの`image`フィールドを再帰的に解析します。
  - jsonpathの使い方については、[jsonpathリファレンス](/docs/reference/kubectl/jsonpath/)を参照してください。
- `tr`、`sort`、`uniq`などの標準ツールを使用して出力をフォーマットします。
  - `tr`を使用してスペースを改行に置換します。
  - `sort`を使用して結果を並べ替えます。
  - `uniq`を使用してイメージ数を集計します。

```shell
kubectl get pods --all-namespaces -o jsonpath="{..image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

上記のコマンドは、返されるすべてのアイテムについて、`image`という名前のすべてのフィールドを再帰的に返します。

別の方法として、Pod内のimageフィールドへの絶対パスを使用することができます。これにより、フィールド名が繰り返されている場合でも正しいフィールドが取得されます。多くのフィールドは与えられたアイテム内で`name`と呼ばれます:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

jsonpathは次のように解釈されます:

- `.items[*]`: 各戻り値
- `.spec`: 仕様の取得
- `.containers[*]`: 各コンテナ
- `.image`: イメージの取得

{{< note >}}
例えば`kubectl get pod nginx`のように名前を指定して単一のPodを取得する場合、アイテムのリストではなく単一のPodが返されるので、パスの`.items[*]`部分は省略してください。
{{< /note >}}

## Podごとにコンテナイメージを一覧表示する {#list-container-images-by-pod}

`range`を使用して要素を個別に繰り返し処理することにより、フォーマットをさらに制御できます。

```shell
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Podのラベルを使用してコンテナイメージ一覧をフィルタリングする {#list-container-images-filtering-by-pod-namespace}

特定のラベルに一致するPodのみを対象とするには、-lフラグを使用します。以下は、`app=nginx`に一致するラベルを持つPodのみに一致します。

```shell
kubectl get pods --all-namespaces -o=jsonpath="{..image}" -l app=nginx
```

## Podの名前空間でコンテナイメージ一覧をフィルタリングする {#list-container-images-filtering-by-pod-namespace}

特定の名前空間のPodのみを対象とするには、namespaceフラグを使用します。以下は`kube-system`名前空間のPodのみに一致します。

```shell
kubectl get pods --namespace kube-system -o jsonpath="{..image}"
```

## jsonpathの代わりにgo-templateを使用してコンテナイメージを一覧表示する {#list-container-images-using-a-go-template-instead-of-jsonpath}

jsonpathの代わりに、kubectlは[go-templates](https://golang.org/pkg/text/template/)を使用した出力のフォーマットをサポートしています:


```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```





<!-- discussion -->



## {{% heading "whatsnext" %}}


### 参照

* [jsonpath](/docs/reference/kubectl/jsonpath/)参照ガイド
* [Go template](https://golang.org/pkg/text/template/)参照ガイド




