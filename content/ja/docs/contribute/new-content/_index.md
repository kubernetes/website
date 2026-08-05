---
title: 新しいコンテンツの貢献
content_type: concept
main_menu: true
weight: 20
---

<!-- overview -->

このセクションでは、新しいコンテンツの貢献を行う前に知っておくべき情報を説明します。
<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->
{{< mermaid >}}
flowchart LR 
    subgraph second[始める前に]
    direction TB
    S[ ] -.-
    A[CNCF CLAに署名] --> B[Gitブランチを選択]
    B --> C[言語ごとにPR]
    C --> F[コントリビューターのための<br>ツールをチェックアウト]
    end
    subgraph first[貢献の基本]
    direction TB
       T[ ] -.-
       D[ドキュメントをMarkdownで書き<br>Hugoでサイトをビルド] --- E[GitHubにあるソース]
       E --- G[複数の言語のドキュメントを含む<br>'/content/../docs'フォルダー]
       G --- H[Hugoのpage content<br>typesやshortcodeをレビュー]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***図 - 新しいコンテンツ提供の貢献方法***

上記の図は新しいコンテンツを申請する前に知っておくべき情報を示しています。
詳細については以下で説明します。

<!-- body -->

## 貢献の基本

- KubernetesのドキュメントはMarkdownで書き、Kubernetesのウェブサイトは[Hugo](https://gohugo.io/)を使ってビルドします。
- Kubernetesのドキュメントは、Markdownのスタイルとして[CommonMark](https://commonmark.org)を使用しています。
- ソースは[GitHub](https://github.com/kubernetes/website)にあります。Kubernetesのドキュメントは`/content/en/docs/`にあります。リファレンスドキュメントの一部は、`update-imported-docs/`ディレクトリ内のスクリプトから自動的に生成されます。
- [Page content types](/docs/contribute/style/page-content-types/)にHugoによるドキュメントのコンテンツの見え方を記述しています。
- Kubernetesのドキュメントに貢献するのに[Docsy shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/)や[カスタムのHugo shortcode](/docs/contribute/style/hugo-shortcodes/)が使えます。
- 標準のHugoのshortcodeに加えて、多数の[カスタムのHugo shortcode](/docs/contribute/style/hugo-shortcodes/)を使用してコンテンツの見え方をコントロールしています。
- ドキュメントのソースは`/content/`内にある複数の言語で利用できます。各言語はそれぞれ[ISO 639-1標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)で定義された2文字のコードの名前のフォルダを持ちます。たとえば、英語のドキュメントのソースは`/content/en/docs/`内に置かれています。
- 複数言語でのドキュメントへの貢献や新しい翻訳の開始に関する情報については、[Kubernetesのドキュメントを翻訳する](/docs/contribute/localization)を参照してください。

## 始める前に {#before-you-begin}

### CNCF CLAに署名する {#sign-the-cla}

すべてのKubernetesのコントリビューターは、[コントリビューターガイド](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)を読み、[Contributor License Agreement(コントリビューターライセンス契約、CLA)への署名](https://github.com/kubernetes/community/blob/master/CLA.md)を**必ず行わなければなりません**。

CLAへの署名が完了していないコントリビューターからのpull requestは、自動化されたテストで失敗します。名前とメールアドレスは`git config`コマンドで表示されるものに一致し、gitの名前とメールアドレスはCNCF CLAで使われたものに一致しなければなりません。

### どのGitブランチを使用するかを選ぶ

pull requestをオープンするときは、どのブランチをベースにして作業するかをあらかじめ知っておく必要があります。

シナリオ | ブランチ
:---------|:------------
現在のリリースに対する既存または新しい英語のコンテンツ | `main`
機能変更のリリースに対するコンテンツ | 機能変更が含まれるメジャーおよびマイナーバージョンに対応する、`dev-<version>`というパターンのブランチを使います。たとえば、機能変更が`v{{< skew nextMinorVersion >}}`に含まれる場合、ドキュメントの変更は``dev-{{< skew nextMinorVersion >}}``ブランチに追加します。
他の言語内のコンテンツ(翻訳) | 各翻訳対象の言語のルールに従います。詳しい情報は、[翻訳のブランチ戦略](/docs/contribute/localization/#branching-strategy)を読んでください。

それでも選ぶべきブランチがわからないときは、Slack上の`#sig-docs`チャンネルで質問してください。

{{< note >}}
すでにpull requestを作成していて、ベースブランチが間違っていたことに気づいた場合は、作成者であるあなただけがベースブランチを変更できます。
{{< /note >}}

### 言語ごとのPR

pull requestはPRごとに1つの言語に限定してください。複数の言語に同一の変更を行う必要がある場合は、言語ごとに別々のPRを作成してください。

## コントリビューターのためのツール

`kubernetes/website`リポジトリ内の[doc contributors tools](https://github.com/kubernetes/website/tree/master/content/en/docs/doc-contributor-tools)ディレクトリには、コントリビューターとしての旅を楽にしてくれるツールがあります。
