---
title: Pull Requestのレビュー
content_type: concept
main_menu: true
weight: 10
---

<!-- overview -->

ドキュメントのPull Requestは誰でもレビューすることができます。Kubernetesのwebsiteリポジトリで[pull requests](https://github.com/kubernetes/website/pulls)のセクションに移動し、open状態のPull Requestを確認してください。

ドキュメントのPull Requestのレビューは、Kubernetesコミュニティに自分を知ってもらうためのよい方法の1つです。コードベースについて学んだり、他のコントリビューターとの信頼関係を築く助けともなるはずです。

レビューを行う前には、以下のことを理解しておくとよいでしょう。

- [コンテンツガイド](/docs/contribute/style/content-guide/)と[スタイルガイド](/docs/contribute/style/style-guide/)を読んで、有益なコメントを残せるようにする。
- Kubernetesのドキュメントコミュニティにおける[役割と責任](/docs/contribute/participate/roles-and-responsibilities/)の違いを理解する。

<!-- body -->

## はじめる前に

レビューを始める前に、以下のことを心に留めてください。

- [CNCFの行動規範](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)を読み、いかなる時にも行動規範にしたがって行動するようにする。
- 礼儀正しく、思いやりを持ち、助け合う気持ちを持つ。
- 変更点だけでなく、PRのポジティブな側面についてもコメントする。
- 相手の気持ちに共感して、自分のレビューが相手にどのように受け取られるのかをよく意識する。
- 相手の善意を前提として、疑問点を明確にする質問をする。
- 経験を積んだコントリビューターの場合、コンテンツに大幅な変更が必要な作業を行う新規のコントリビューターとペアを組んで取り組むことを考える。

## レビューのプロセス

一般に、コンテンツや文体に対するPull Requestは、英語でレビューを行います。図1は、レビュープロセスについて手順の概要を示しています。 各ステップの詳細は次のとおりです。

**(訳注:SIG Docs jaでは、日本語でも対応しています。日本語の翻訳に対するレビューは、日本語でも構いません。ただし、Pull Requestの作成者や他のコントリビューターが必ずしも日本語を理解できるとは限りませんので、注意して発言してください。)**

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[レビューの開始]
    direction TB
    S[ ] -.-
    M[コメントを追加] --> N[変更の確認]
    N --> O[Commentを選択]
    end
    subgraph third[PRの選択]
    direction TB
    T[ ] -.-
    J[説明とコメントを読む]--> K[Netlifyプレビューで<br>変更点を表示]
    end

  A[オープン状態の<br>PR一覧を確認]--> B[オープン状態のPRを<br>ラベルで絞り込む]
  B --> third --> fourth


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

図1. レビュープロセスの手順

1.  [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)に移動します。Kubernetesのウェブサイトとドキュメントに対するopen状態のPull Request一覧が表示されます。

2.  open状態のPRに、以下に示すラベルを1つ以上使って絞り込みます。

    - `cncf-cla: yes` (推奨): CLAにサインしていないコントリビューターが提出したPRはマージできません。詳しい情報は、[CLAの署名](/docs/contribute/new-content/#sign-the-cla)を読んでください。
    - `language/en` (推奨): 英語のPRだけに絞り込みます。
    - `size/<size>`: 特定の大きさのPRだけに絞り込みます。レビューを始めたばかりの人は、小さなPRから始めてください。

    さらに、PRがwork in progressとしてマークされていないことも確認してください。`work in progress`ラベルの付いたPRは、まだレビューの準備ができていない状態です。

3.  レビューするPRを選んだら、以下のことを行い、変更点について理解します。
    - PRの説明を読み、行われた変更について理解し、関連するissueがあればそれも読みます。
    - 他のレビュアのコメントがあれば読みます。
    - **Files changed**タブをクリックし、変更されたファイルと行を確認します。
    - **Conversation**タブの下にあるPRのbuild checkセクションまでスクロールし、Netlifyのプレビュービルドで変更点をプレビューします。これはスクリーンショットです(これは、GitHubのデスクトップサイトを見せています。タブレットやスマートフォンデバイスでレビューしている場合は、GitHubウェブのUIは少し異なります):
      {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub pull request details including link to Netlify preview" >}}
      プレビューを開くには、チェックリストの**deploy/netlify**行の**Details**リンクをクリックします。

4.  **Files changed**タブに移動してレビューを始めます。
    1. コメントしたい場合は行の横の`+`マークをクリックします。
    2. その行に関するコメントを書き、**Add single comment**(1つのコメントだけを残したい場合)または**Start a review**(複数のコメントを行いたい場合)のいずれかをクリックします。
    3. コメントをすべて書いたら、ページ上部の**Review changes**をクリックします。ここでは、レビューの要約を追加できます(コントリビューターにポジティブなコメントも書きましょう！)。常に「Comment」を使用してください。

        - レビューの終了時、「Request changes」ボタンをクリックしないでください。さらに変更される前にマージされるのをブロックしたい場合、「/hold」コメントを残すことができます。Holdを設定する理由を説明し、必要に応じて、自分や他のレビューアがHoldを解除できる条件を指定してください。
        - レビューの終了時、「Approve」ボタンをクリックしないでください。大抵の場合、「/approve」コメントを残すことが推奨されます。

## レビューのチェックリスト

レビューするときは、最初に以下の点を確認してみてください。

### 言語と文法

- 言語や文法に明らかな間違いはないですか？ もっとよい言い方はないですか？
  - 作成者が変更している箇所の用語や文法に注目してください。作成者がページ全体の変更を目的として明確にしていない限り、そのページのすべての問題を修正する義務はありません。
  - 既存のページを変更するPRである場合、変更されている箇所に注目してレビューしてください。その変更されたコンテンツは、技術的および編集の正確性についてレビューしてください。PRの作成者が対処しようとしている内容と直接関係のない間違いを見つけた場合、それは別のIssueとして扱うべきです(既存のIssueが無いことを確認してください)。
  - コンテンツを*移動*するPull Requestに注意してください。作成者がページの名前を変更したり、2つのページを結合したりする場合、通常、私たち(Kubernetes SIG Docs)は、その移動されたコンテンツ内で見つけられるすべての文法やスペルの間違いを修正することを作成者に要求することを避けています。
- もっと簡単な単語に置き換えられる複雑な単語や古い単語はありませんか？
- 使われている単語や専門用語や言い回しで差別的ではない別の言葉に置き換えられるものはありませんか？
- 言葉選びや大文字の使い方は[style guide](/docs/contribute/style/style-guide/)に従っていますか？
- もっと短くしたり単純な文に書き換えられる長い文はありませんか？
- 箇条書きやテーブルでもっとわかりやすく表現できる長いパラグラフはありませんか？

### コンテンツ

- 同様のコンテンツがKubernetesのサイト上のどこかに存在しませんか？
- コンテンツが外部サイト、特定のベンダー、オープンソースではないドキュメントなどに過剰にリンクを張っていませんか？

### ウェブサイト

- PRはページ名、slug/alias、アンカーリンクの変更や削除をしていますか？ その場合、このPRの変更の結果、リンク切れは発生しませんか？ ページ名を変更してslugはそのままにするなど、他の選択肢はありませんか？
- PRは新しいページを作成するものですか？ その場合、次の点に注意してください。
  - ページは正しい[page content type](/docs/contribute/style/page-content-types/)と関係するHugoのshortcodeを使用していますか？
  - セクションの横のナビゲーションにページは正しく表示されますか(または表示されませんか)？
  - ページは[Docs Home](/docs/home/)に一覧されますか？
- Netlifyのプレビューで変更は確認できますか？ 特にリスト、コードブロック、テーブル、備考、画像などに注意してください。

### その他

- [些細な編集](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)に注意してください。些細な編集だと思われる変更を見つけた場合は、そのポリシーを指摘してください (それが本当に改善である場合は、変更を受け入れても問題ありません)。
- 空白の修正を行っている作成者には、PRの最初のコミットでそれを行い、その後に他の変更を加えるよう促してください。これにより、マージとレビューの両方が容易になります。特に、大量の空白文字の整理と共に1回のコミットで発生する些細な変更に注意してください(もしそれを見つけたら、作成者に修正を促してください)。

レビュアーが誤字や不適切な空白など、PRの本質でない小さな問題を発見した場合は、コメントの先頭に`nit:`を付けてください。これにより、作成者はこのフィードバックが重要でないことを知ることができます。

Pull Requestの承認を検討する際、残りのすべてのフィードバックがnitとしてマークされていれば、残っていたとしてもPRをマージできます。その場合、残っているnitに関するIssueをオープンすると役立つことがよくあります。その新しいIssueを[Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue)としてマークするための条件を満たすことができるかどうか検討してください。それができたら、これらは良い情報源になります。

