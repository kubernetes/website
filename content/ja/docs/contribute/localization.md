---
title: Kubernetesのドキュメントを翻訳する
content_type: concept
weight: 50
card:
  name: contribute
  weight: 30
  title: Kubernetesのドキュメントを翻訳する
---

<!-- overview -->

このページでは、Kubernetesドキュメントにおける日本語翻訳の方針について説明します。

<!-- body -->

## ドキュメントを日本語に翻訳するまでの流れ {#translate-flow}

翻訳を行うための基本的な流れについて説明します。不明点がある場合は[Kubernetes公式Slack](http://slack.kubernetes.io/)の`#kubernetes-docs-ja`チャンネルにてお気軽にご質問ください。

### 前提知識 {#prerequisite}

翻訳作業は全て[GitHubのIssue](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+label%3Alanguage%2Fja)によって管理されています。翻訳作業を行いたい場合は、Issueの一覧をまず最初にご確認ください。

また、Kubernetes傘下のリポジトリでは`CLA`と呼ばれる同意書に署名しないと、Pull Requestをマージすることができません。詳しくは[英語のドキュメント](https://github.com/kubernetes/community/blob/master/CLA.md)や、[Qiitaに有志の方が書いてくださった日本語のまとめ](https://qiita.com/jlandowner/items/d14d9bc8797a62b65e67)をご覧ください。

### 翻訳を始めるまで {#start-translation}

#### 翻訳を希望するページのIssueが存在しない場合 {#no-issue}

1. [こちらのサンプル](https://github.com/kubernetes/website/issues/22340)に従う形でIssueを作成する
2. 自分自身を翻訳作業に割り当てたい場合は、Issueのメッセージまたはコメントに`/assign`と書く
3. [新規ページを翻訳する場合](#translate-new-page)のステップに進む

**不明点がある場合は[Kubernetes公式Slack](http://slack.kubernetes.io/)の`#kubernetes-docs-ja`チャンネルにてお気軽にご質問ください。**

#### 翻訳を希望するページのIssueが存在する場合 {#exist-issue}

1. 自分自身を翻訳作業に割り当てるために、Issueのコメントに`/assign`と書く
2. [新規ページを翻訳する場合](#translate-new-page)のステップに進む

### Pull Requestを送るまで {#create-pull-request}

#### 新規ページを翻訳する場合の手順 {#translate-new-page}

1. `kubernetes/website`リポジトリをフォークする
2. `main`から任意の名前でブランチを作成する
3. `content/en`のディレクトリから必要なファイルを`content/ja`にコピーし、翻訳する
4. `main`ブランチに向けてPull Requestを作成する

#### 既存のページの誤字脱字や古い記述を修正する場合の手順 {#fix-existing-page}

1. `kubernetes/website`リポジトリをフォークする
2. `main`から任意の名前でブランチを作成する
3. `content/ja`のディレクトリから必要なファイルを編集する
4. `main`ブランチに向けてPull Requestを作成する

## 翻訳スタイルガイド {#style-guide}

### 基本方針 {#basic-policy}

- 本文を、敬体(ですます調)で統一
    - 特に、「〜になります」「〜となります」という表現は「〜です」の方が適切な場合が多いため注意
- 句読点は「、」と「。」を使用
- 漢字、ひらがな、カタカナは全角で表記
- 数字とアルファベットは半角で表記
- 記号類は感嘆符「！」と疑問符「？」のみ全角、それ以外は半角で表記
- 英単語と日本語の間に半角スペースは不要
  - また、カッコ`()`の前後にも半角スペースは不要
- 日本語文では、文章の途中で改行を行わない。句点「。」で改行する
- メタデータの`reviewer`の項目は削除する
- すでに日本語訳が存在するページにリンクを張る場合は、`/ja/`を含めたURLを使用する
  - 例: `/path/to/page/`ではなく、`/ja/path/to/page/`を使用する

### 用語の表記 {#terminology}

Kubernetesのリソース名や技術用語などは、原則としてそのままの表記を使用します。
例えば、PodやService、Deploymentなどは翻訳せずにそのまま表記してください。

ただし、ノード(Node)に関してはKubernetesとしてのNodeリソース(例: `kind: Node`や`kubectl get nodes`、Nodeコントローラーなど)を指していないのであれば、「ノード」と表記してください。

またこれらの単語は、複数形ではなく単数形を用います。
例えば、原文に"pods"と表記されている場合でも、日本語訳では"Pod"と表記してください。

### 頻出表記(日本語) {#frequent-phrases}

よくある表記 | あるべき形
--------- | ---------
〜ので、〜から、〜だから| 〜のため 、〜ため
(あいうえお。)| (あいうえお)。
〇,〇,〇|〇、〇、〇(※列挙はすべて読点で統一)

### 長音の有無 {#long-vowel}

カタカナ語に長音を付与するかどうかは、以下の原則に従ってください。

- -er、-or、-ar、-cy、-gyで終わる単語は長音を付与する
  - 例: 「クラスター」「セレクター」「サイドカー」「ポリシー」「トポロジー」
- -ear、-eer、-re、-ty、-dy、-ryで終わる単語は長音を付与しない
  - 例: 「クリア」「エンジニア」「アーキテクチャ」「セキュリティ」「スタディ」「ディレクトリ」

ただし、「コンテナ」は例外的に長音を付与しないこととします。

この原則を作成するにあたって、[mozilla-japan/translation Editorial Guideline#カタカナ語の表記](https://github.com/mozilla-japan/translation/wiki/Editorial-Guideline#カタカナ語の表記)を参考にしました。

### その他の表記 {#other-notation}

その他の表記については、以下の表を参考にしてください。

英語 | 日本語
--------- | ---------
interface | インターフェース
proxy | プロキシ
quota|クォータ
stacked | 積層

### cron jobの訳し方に関して {#cron-job}

混同を避けるため、cron jobはcronジョブと訳し、CronJobはリソース名としてそのまま表記します。
cron「の」ジョブは、「の」が続く事による解釈の難から基本的にはつけないものとします。

### その他基本方針など {#other-basic-policy}

- 意訳と直訳で迷った場合は「直訳」で訳す
- 訳で難しい・わからないと感じたらSlackの`#kubernetes-docs-ja`で相談する
- できることを挙手制で、できないときは早めに報告

## アップストリームのコントリビューター {#upstream-contributor}

SIG Docsでは、英語のソースに対する[アップストリームへのコントリビュートや誤りの訂正](/docs/contribute/intermediate#localize-content)を歓迎しています。
