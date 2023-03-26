---
title: カスタムHugoショートコード
content_type: concept
weight: 120
---

<!-- overview -->
このページではKubernetesのマークダウンドキュメント内で使用できるHugoショートコードについて説明します。

ショートコードについての詳細は[Hugoのドキュメント](https://gohugo.io/content-management/shortcodes)を読んでください。

<!-- body -->

## 機能の状態

このサイトのマークダウンページ(`.md`ファイル)内では、説明されている機能のバージョンや状態を表示するためにショートコードを使用することができます。

### 機能の状態のデモ

最新のKubernetesバージョンで機能をstableとして表示するためのデモスニペットを次に示します。

```
{{</* feature-state state="stable" */>}}
```

これは次の様に表示されます:

{{< feature-state state="stable" >}}

`state`の値として妥当な値は次のいずれかです:

* alpha
* beta
* deprecated
* stable

### 機能の状態コード

表示されるKubernetesのバージョンのデフォルトはそのページのデフォルトまたはサイトのデフォルトです。
`for_k8s_version`パラメーターを渡すことにより、機能の状態バージョンを変更することができます。
例えば:

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

これは次の様に表示されます:

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

## 用語集

用語集に関連するショートコードとして、`glossary_tooltip`と`glossary_definition`の二つがあります。

コンテンツを自動的に更新し、[用語集](/ja/docs/reference/glossary/)へのリンクを付与する挿入を使用して、用語を参照することができます。
用語がマウスオーバーされると、用語集の内容がツールチップとして表示されます。
また、用語はリンクとして表示されます。

ツールチップの挿入と同様に、用語集の定義も再利用することができます。


用語集の用語データは[glossaryディレクトリ](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary)に、それぞれの用語のファイルとして保存されています。

### 用語集のデモ

例えば、マークダウン内でツールチップ付きの{{< glossary_tooltip text="cluster" term_id="cluster" >}}を表示するには、次の挿入を使用します:

```
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```

用語集の定義はこのようにします:

```
{{</* glossary_definition prepend="A cluster is" term_id="cluster" length="short" */>}}
```

これは次の様に表示されます:
{{< glossary_definition prepend="A cluster is" term_id="cluster" length="short" >}}

完全な用語定義を挿入することもできます:

```
{{</* glossary_definition term_id="cluster" length="all" */>}}
```

これは次の様に表示されます:
{{< glossary_definition term_id="cluster" length="all" >}}

## APIリファレンスへのリンク

`api-reference`ショートコードを使用することで、Kubernetes APIリファレンスへのリンクを作成することができます。
例えば、{{< api-reference page="workload-resources/pod-v1" >}}への参照方法は次の通りです:

```
{{</* api-reference page="workload-resources/pod-v1" */>}}
```

`page`パラメーターの値はAPIリファレンスページのURLの末尾です。

`anchor`パラメーターを指定することでページ内の特定の場所へリンクすることもできます。
例えば、{{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}}や{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}へのリンクは次の様に書きます:

```
{{</* api-reference page="workload-resources/pod-v1" anchor="PodSpec" */>}}
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" */>}}
```

`text`パラメーターを指定することでリンクテキストを変更することもできます。
例えば、{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="Environment Variables">}}へのリンクは次の様に書きます:

```
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="Environment Variable" */>}}
```

## テーブルキャプション

テーブルキャプションを追加することで、表をスクリーンリーダーにとってよりアクセスしやすいものにする事ができます。
表へ[キャプション](https://www.w3schools.com/tags/tag_caption.asp)を追加するには、表を`table`ショートコードで囲い、`caption`パラメーターにキャプションを指定します。

{{< note >}}
テーブルキャプションはスクリーンリーダーからは読むことができますが、標準的なHTMLでは読むことができません。
{{< /note >}}

例えば、次の様に書きます:

```go-html-template
{{</* table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table */>}}
```

これは次の様に表示されます:

{{< table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table >}}

この表に対するHTMLを検査すると、次の要素が`<table>`要素のすぐ次にあるのを見ることができるでしょう:

```html
<caption style="display: none;">Configuration parameters</caption>
```

## タブ

このサイトのマークダウンページ(`.md`ファイル)内では、あるソリューションに対する複数のフレーバーを表示するためのタブセットを追加することができます。

`tabs`ショートコードはこれらのパラメーターを受けとります:

* `name`: タブに表示される名前
* `codelang`: 内側の`tab`ショートコードにこれを指定した場合、Hugoはハイライトに使用するコード言語を知ることができます。
* `include`: タブ内で挿入するファイル。Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles)内にタブがある場合そのファイル(HugoがサポートしているどのMIMEタイプでも良い)はそのbundle自身によって探されます。
  もしそうでない場合、そのコンテントページは現在のページから相対的に探されます。
  `include`を使う場合、ショートコードの内部コンテンツはなく、自己終了構文を使用する必要があることに注意してください。
  例えば、`{{</* tab name="Content File #1" include="example1" /*/>}}`の様にします。
  `codelang`を指定するか、ファイル名から言語が特定される必要があります。
  非コンテンツファイルはデフォルトでコードが強調表示されます。
* もし内部コンテンツがマークダウンの場合、タブの周りに`%`デリミターを使用する必要があります。
  例えば、`{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`の様にします。
* タブセット内で、上記で説明したバリエーションを組み合わせることができます。

タブショートコードの例を次に示します。

{{< note >}}
`tabs`定義内の**name**はコンテンツページ内でユニークである必要があります。
{{< /note >}}

### タブのデモ: コードハイライト

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{{< tab name="Tab 1" codelang="bash" >}}
echo "これはタブ1です。"
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "これはタブ2です。"
{{< /tab >}}}
{{< /tabs */>}}
```

これは次の様に表示されます:

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "これはタブ1です。"
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "これはタブ2です。"
{{< /tab >}}
{{< /tabs >}}

### タブのデモ: インラインマークダウンとHTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
これは**なにがしかのマークダウン**です。
{{< note >}}
ショートコードを含むこともできます。
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>プレーンHTML</h3>
	<p>これはなにがしかの<i>プレーン</i>HTMLです。</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

これは次の様に表示されます。

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
これは**なにがしかのマークダウン**です。
{{< note >}}
ショートコードを含むこともできます。
{{< /note >}}

{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>プレーンHTML</h3>
	<p>これはなにがしかの<i>プレーン</i>HTMLです。</p>
</div>
{{< /tab >}}
{{< /tabs >}}

### タブのデモ: ファイルの読み込み

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

これは次の様に表示されます:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate.json" />}}
{{< /tabs >}}

## サードパーティーコンテンツマーカー

Kubernetesの実行にはサードパーティーのソフトウェアが必要です。
例えば、名前解決を行うためにはクラスターに[DNSサーバー](/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)を追加する必要があります。

私たちがサードパーティーソフトウェアにリンクするときや言及するときは、[コンテンツガイド](/ja/docs/contribute/style/content-guide/)に従い、サードパーティーのものに印をつけます。

これらのショートコードを使用すると、それらを使用しているドキュメントページに免責事項が追加されます。

### リスト {#third-party-content-list}

サードパーティーのリストには、
```
{{%/* thirdparty-content */%}}
```

をすべてのアイテムを含むセクションのヘッダーのすぐ下に追加します。

### アイテム {#third-party-content-item}

ほとんどのアイテムがプロジェクト内ソフトウェア(例えばKubernetes自体や[Descheduler](https://github.com/kubernetes-sigs/descheduler)コンポーネント)を参照している場合、違う形を使用することができます。


次のショートコードをアイテムの前か、特定のアイテムのヘッダーのすぐ下に追加します:
```
{{%/* thirdparty-content single="true" */%}}
```


## バージョン文字列

ドキュメント内でバージョン文字列を生成して挿入するために、いくつかのバージョンショートコードから選んで使用することができます。
それぞれのバージョンショートコードはサイトの設定ファイル(`hugo.toml`)から取得したバージョンパラメーターの値を使用してバージョン文字列を表示します。
最もよく使われる二つのバージョンパラメーターは`latest`と`version`です。

### `{{</* param "version" */>}}`

`{{</* param "version" */>}}`ショートコードはサイトの`version`パラメーターに設定されたKubernetesドキュメントの現在のバージョンを生成します。
`param`ショートコードはサイトパラメーターの名前の一つを受けとり、この場合は`version`を渡しています。

{{< note >}}
以前にリリースされたドキュメントでは`latest`と`version`の値は同じではありません。
新しいバージョンがリリースされると、`latest`はインクリメントされ、`version`は変更されません。
例えば、以前にリリースされたドキュメントは`version`を`v1.19`として表示し、`latest`を`v1.20`として表示します。
{{< /note >}}

これは次の様に表示されます:

{{< param "version" >}}

### `{{</* latest-version */>}}`

`{{</* latest-version */>}}`ショートコードはサイトの`latest`パラメーターの値を返します。
サイトの`latest`パラメーターは新しいドキュメントのバージョンがリリースされた時に更新されます。
このパラメーターは必ずしも`version`の値と一致しません。

これは次の様に表示されます:

{{< latest-version >}}

### `{{</* latest-semver */>}}`

`{{</* latest-semver */>}}`ショートコードは`latest`から"v"接頭辞を取り除いた値を生成します。

これは次の様に表示されます。

{{< latest-semver >}}

### `{{</* version-check */>}}`

`{{</* version-check */>}}`ショートコードはページに`min-kubernetes-server-version`パラメーターがあるかどうか確認し、`version`と比較するために使用します。

これは次の様に表示されます:

{{< version-check >}}

### `{{</* latest-release-notes */>}}`

`{{</* latest-release-notes */>}}`ショートコードは`latest`からバージョン文字列を生成し、"v"接頭辞を取り除きます。
このショートコードはバージョン文字列に対応したリリースノートCHANGELOGページのURLを表示します。

これは次の様に表示されます:

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}}

* [Hugo](https://gohugo.io/)について学ぶ。
* [新しいトピックの書き方](/docs/contribute/style/write-new-topic/)について学ぶ。
* [ページコンテンツタイプ](/docs/contribute/style/page-content-types/)について学ぶ。
* [Pull Requestの作り方](/docs/contribute/new-content/open-a-pr/)について学ぶ。
* [発展的コントリビュート](/docs/contribute/advanced/)について学ぶ。

