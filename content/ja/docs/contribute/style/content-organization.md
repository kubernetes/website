---
title: コンテンツの構造化
content_type: concept
weight: 90
---

<!-- overview -->

このサイトではHugoを使用しています。Hugoでは、[コンテンツの構造化](https://gohugo.io/content-management/organization/)がコアコンセプトとなっています。

<!-- body -->

{{% note %}}
**Hugoのヒント:** コンテンツの編集を始めるときは、`hugo server --navigateToChanged`コマンドを使用してHugoを実行してください。
{{% /note %}}

## ページの一覧

### ページの順序

ドキュメントのサイドメニューやページブラウザーなどでは、Hugoのデフォルトのソート順序を使用して一覧を作成しています。デフォルトでは、weight(1から開始)、日付(最新のものが1番目)、最後にリンクのタイトルの順でソートされます。

そのため、特定のページやセッションを上に移動したい場合には、ページのフロントマター内のweightを設定します。

```yaml
title: My Page
weight: 10
```

{{% note %}}
ページのweightについては、1、2、3…などの値を使用せず、10、20、30…のように一定の間隔を空けた方が賢明です。こうすることで、後で別のページを間に挿入できるようになります。さらに、同じディレクトリ(セクション)内の各ページのweightは、重複しないようにする必要があります。これにより、特にローカライズされたコンテンツでは、コンテンツが常に正しく整列されるようになります。
{{% /note %}}

### ドキュメントのメインメニュー

ドキュメントのメインメニューは、`docs/`以下に置かれたセクションのコンテンツファイル`_index.md`のフロントマター内に`main_menu`フラグが設定されたものから生成されます。

```yaml
main_menu: true
```

リンクのタイトルは、ページの`linkTitle`から取得されることに注意してください。そのため、ページのタイトルとは異なるリンクテキストにしたい場合、コンテンツファイル内の値を以下のように設定します。

```yaml
main_menu: true
title: ページタイトル
linkTitle: リンク内で使われるタイトル
```

{{% note %}}
上記の設定は言語ごとに行う必要があります。メニュー上にセクションが表示されないときは、Hugoからセクションとして認識されていないためである可能性が高いです。セクションフォルダー内に`_index.md`コンテンツファイルを作成してください。
{{% /note %}}

### ドキュメントのサイドメニュー

ドキュメントのサイドバーメニューは、`docs/`以下の*現在のセクションツリー*から生成されます。

セクションと、そのセクション内のページがすべて表示されます。

特定のセクションやページをリストに表示したくない場合、フロントマター内の`toc_hide`フラグを`true`に設定してください。

```yaml
toc_hide: true
```

コンテンツが存在するセクションに移動すると、特定のセクションまたはページ(例:`index.md`)が表示されます。それ以外の場合、そのセクションの最初のページが表示されます。

### ドキュメントのブラウザー

ドキュメントのホームページのページブラウザーは、`docs`セクション直下のすべてのセクションとページを使用して生成されています。

特定のセクションやページを表示したくない場合、フロントマターの`toc_hide`フラグを`true`に設定してください。

```yaml
toc_hide: true
```

### メインメニュー

右上のメニュー(およびフッター)にあるサイトリンクは、page-lookupの機能を使用して実装されています。これにより、ページが実際に存在することを保証しています。そのため、たとえば`case-studies`のセクションが特定の言語のサイトに存在しない場合、メニューにはケーススタディのリンクが表示されません。

## Page Bundle

スタンドアローンのコンテンツページ(Markdownファイル)に加えて、Hugoでは、[Page Bundles](https://gohugo.io/content-management/page-bundles/)がサポートされています。

Page Bundleの1つの例は、[カスタムのHugo Shortcode](/docs/contribute/style/hugo-shortcodes/)です。これは、`leaf bundle`であると見做されます。ディレクトリ内のすべてのファイルは、`index.md`を含めてバンドルの一部となります。これには、ページからの相対リンク、処理可能な画像なども含まれます。

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

もう1つのPage Bundleがよく使われる例は、`includes`バンドルです。フロントマターに`headless: true`を設定すると、自分自身のURLを持たなくなり、他のページ内でのみ使用されるようになります。

```bash
en/includes
├── default-storage-class-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

バンドル内のファイルに関して、いくつか重要な注意点があります。

* 翻訳されたバンドルに対しては、コンテンツ以外の見つからなかったファイルは上位の言語から継承されます。これにより重複が回避できます。
* バンドル内のすべてのファイルは、Hugoが`Resources`と呼ぶファイルになり、フロントマター(YAMLファイルなど)をサポートしていない場合であっても、言語ごとにパラメーターやタイトルなどのメタデータを提供できます。詳しくは、[Page Resourcesメタデータ](https://gohugo.io/content-management/page-resources/#page-resources-metadata)を参照してください。
* `Resource`の`.RelPermalink`から取得した値は、ページからの相対的なものとなっています。詳しくは、[Permalinks](https://gohugo.io/content-management/urls/#permalinks)を参照してください。

## スタイル

このサイトのスタイルシートの[SASS](https://sass-lang.com/)のソースは、`assets/sass`に置かれていて、Hugoによって自動的にビルドされます。

## {{% heading "whatsnext" %}}

* [カスタムのHugo shortcode](/docs/contribute/style/hugo-shortcodes/)について学ぶ
* [スタイルガイド](/docs/contribute/style/style-guide)について学ぶ
* [コンテンツガイド](/docs/contribute/style/content-guide)について学ぶ
