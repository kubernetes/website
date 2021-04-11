---
title: 新しいコンテンツの貢献の概要
linktitle: 概要
content_type: concept
main_menu: true
weight: 5
---

<!-- overview -->

このセクションでは、新しいコンテンツの貢献を行う前に知っておくべき情報を説明します。

<!-- body -->

## 貢献の基本

- KubernetesのドキュメントはMarkdownで書き、Kubernetesのウェブサイトは[Hugo](https://gohugo.io/)を使ってビルドします。
- ソースは[GitHub](https://github.com/kubernetes/website)にあります。Kubernetesのドキュメントは`/content/en/docs/`にあります。リファレンスドキュメントの一部は、`update-imported-docs/`ディレクトリ内のスクリプトから自動的に生成されます。
- [Page content types](/docs/contribute/style/page-content-types/)はHugo内のドキュメントのコンテンツの見え方を？指定します？
- 標準のHugoのshortcodeに加えて、多数の[カスタムのHugo shortcode](/docs/contribute/style/hugo-shortcodes/)を使用してコンテンツの見え方をコントロールしています。
- ドキュメントのソースは`/content/`内にある複数の言語で利用できます。各言語はそれぞれ[ISO 639-1標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)で定義された2文字のコードの名前のフォルダを持ちます。たとえば、英語のドキュメントのソースは`/content/en/docs/`内に置かれています。
- 複数言語でのドキュメントへの貢献や新しい翻訳の開始に関する情報については、[ローカライゼーション](/docs/contribute/localization)を参照してください。

## 始める前に {#before-you-begin}

### CNCF CLAに署名する {#sign-the-cla}

すべてのKubernetesのコントリビューターは、[コントリビューターガイド](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)を読み、[Contributor License Agreement(コントリビューターライセンス契約、CLA)への署名](https://github.com/kubernetes/community/blob/master/CLA.md)を**必ず行わなければなりません**。

CLAへの署名が完了していないコントリビューターからのpull requestは、自動化されたテストで失敗します。名前とメールアドレスは`git config`コマンドで表示されるものに一致し、gitの名前とメールアドレスはCNCF CLAで使われたものに一致しなければなりません。

### どのGitブランチを使用するかを選ぶ

pull requestをオープンするときは、どのブランチをベースにして作業するかをあらかじめ知っておく必要があります。

シナリオ | ブランチ
:---------|:------------
現在のリリースに対する既存または新しい英語のコンテンツ | `master`
機能変更のリリースに対するコンテンツ | 機能変更が含まれるメジャーおよびマイナーバージョンに対応する、`dev-<version>`というパターンのブランチを使います。たとえば、機能変更が`v{{< skew nextMinorVersion >}}`に含まれる場合、ドキュメントの変更は``dev-{{< skew nextMinorVersion >}}``ブランチに追加します。
他の言語内のコンテンツ(翻訳) | 各翻訳対象の言語のルールに従います。詳しい情報は、[翻訳のブランチ戦略](/docs/contribute/localization/#branching-strategy)を読んでください。

それでも選ぶべきブランチがわからないときは、Slack上の`#sig-docs`チャンネルで質問してください。

{{< note >}}
すでにpull requestを作成していて、ベースブランチが間違っていたことに気づいた場合は、作成者であるあなただけがベースブランチを変更できます。
{{< /note >}}

### 言語ごとのPR

pull requestはPRごとに1つの言語に限定してください。複数の言語に同一の変更を行う必要がある場合は、言語ごとに別々のPRを作成してください。

## コントリビューターのためのツール

`kubernetes/website`リポジトリ内の[doc contributors tools](https://github.com/kubernetes/website/tree/master/content/en/docs/doc-contributor-tools)ディレクトリには、コントリビューターとしての旅を楽にしてくれるツールがあります。
