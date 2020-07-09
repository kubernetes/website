---
title: Kubernetesのドキュメントを翻訳する
content_type: concept
card:
  name: contribute
  weight: 30
  title: Kubernetesのドキュメントを翻訳する
---

<!-- overview -->

このページでは、Kubernetesドキュメントにおける日本語翻訳の方針について説明します。

<!-- body -->

## ドキュメントを日本語に翻訳するまでの流れ

翻訳を行うための基本的な流れについて説明します。不明点がある場合は[Kubernetes公式Slack](http://slack.kubernetes.io/)の`#kubernetes-docs-ja`チャンネルにてご連絡ください。

### 前提知識

翻訳作業は全て[GitHubのIssue](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+label%3Alanguage%2Fja)によって管理されています。翻訳作業を行いたい場合は、Issueの一覧をまず最初にご確認ください。

また、Kubernetes傘下のリポジトリでは`CLA`と呼ばれる同意書に署名されたGitHubユーザーのみがパッチを送ることができます。詳しくは[英語のドキュメント](https://github.com/kubernetes/community/blob/master/CLA.md)や、[Qiitaに有志の方が書いてくださった日本語のまとめ](https://qiita.com/jlandowner/items/d14d9bc8797a62b65e67)をご覧ください。

### 翻訳を始めるまで

#### 翻訳を希望するページのIssueが存在しない場合

1. [こちらのサンプル](https://github.com/kubernetes/website/issues/22340)に従う形でIssueを作成する
2. 自分自身を翻訳作業に割り当てたい場合は、Issueのメッセージまたはコメントに`/assign`と書く
3. [新規ページを翻訳する場合](#translate-new-page)のステップに進む

**分からないことがあれば上記Slackチャンネルまでご質問をお願いします。**

#### 翻訳を希望するページのIssueが存在する場合

1. 自分自身を翻訳作業に割り当てるために、Issueのコメントに`/assign`と書く
2. [新規ページを翻訳する場合](#translate-new-page)のステップに進む

### パッチを送るまで

実際に翻訳作業を行う場合、未翻訳ページの新規作成と既存ページの修正でそれぞれ手順が異なります。

既存ページへの追加修正については、後述の[マイルストーンについて](#milestones)に目を通すことをおすすめします。

#### 新規ページを翻訳する場合 {#translate-new-page}

1. `kubernetes/website`リポジトリをフォークする
2. `master`から任意の名前でブランチを作成し、翻訳する箇所を編集する
3. `master`ブランチに向けてPull Requestを作成する

#### 既存のページの誤字脱字や古い記述を修正する場合

1. `kubernetes/website`リポジトリをフォークする
2. `dev-1.18-ja.1(最新のマイルストーンブランチに適宜読み替えること)`から任意の名前でブランチを作成し、該当箇所を編集する
3. `dev-1.18-ja.1(最新のマイルストーンブランチに適宜読み替えること)`ブランチに向けてPull Requestを作成する

- masterを追随
    - 更新があり次第、次のMilestoneで追随を行う
- コントリビューション方法については[こちら](https://kubernetes-docs-ja.kibe.la/shared/entries/c5878aa5-ad1f-4f29-a5bb-25853cbc14ec)を参照
- 翻訳スタイルガイドについては[こちら](https://kubernetes-docs-ja.kibe.la/shared/entries/5efe4fa7-d2a1-4a1d-8bc3-ce7ccdc064a6)を参照

### マイルストーンについて {#milestones}

翻訳作業を集中的に管理するために、日本語を含む複数の言語ではマイルストーンを採用しています。

各マイルストーンでは、

- 最低要件のコンテンツの追加・更新(項目については[こちら](https://kubernetes.io/docs/contribute/localization/#translating-documents))
- バージョンに追従できていない翻訳済みコンテンツの更新

を行い、ドキュメントの全体的なメンテナンスを行っています。

マイルストーンのバージョンはOwner権限を持つメンバーが管理するものとします。

## 翻訳スタイルガイド

### 基本方針

- 本文を、敬体（ですます調）で統一
    - 特に、「〜になります」「〜となります」という表現は「〜です」の方が適切な場合が多いため注意
- 句読点は「、」と「。」を使用
- 漢字、ひらがな、カタカナは全角で表記
- 数字とアルファベットは半角で表記
- スペースと括弧 `()` 、コロン `:` は半角、それ以外の記号類は全角で表記
- 英単語と日本語の間に半角スペースは不要

### 頻出単語

英語 | 日本語
--------- | ---------
cluster|クラスター
orchestrate(動詞)|オーケストレーションする
Persistent Volume|KubernetesリソースとしてのPersistentVolumeはママ表記、一般的な用語としての場合は、永続ボリューム
Deployment/Deploy|KubernetesリソースとしてのDeploymentはママ表記、一般的な用語としてのdeployの場合は、デプロイ
Addon/Add-on|アドオン
Quota|クォータ
For more information|さらなる情報(一時的)
prefix | プレフィックス
container | コンテナ
directory | ディレクトリ
binary | バイナリ
controller | コントローラー
opeartor | オペレーター
Aggregation Layer | アグリゲーションレイヤー
Issue | Issue (ママ表記)
Pull Request | Pull Request (ママ表記)
GitHub | GitHub (ママ表記)
registry | レジストリ
architecture | アーキテクチャ
secure | セキュア

### 備考

ServiceやDeploymentなどのKubernetesのAPIオブジェクトや技術仕様的な固有名詞は、無理に日本語訳せずそのまま書いてください。日本語では複数形にする意味はあまりないので、原則として単数形に統一します。

- Kubernetes Service
- Node
- Pod

外部サイトへの参照の記事タイトルは翻訳しましょう。(一時的)

### 頻出表記（日本語）

よくある表記 | あるべき形
--------- | ---------
〜ので、〜から、〜だから| 〜のため 、〜ため
（あいうえお。）| （あいうえお）。
〇,〇,〇|〇、〇、〇（※今回列挙はすべて読点で統一）

### 単語末尾に長音記号(「ー」)を付けるかどうか

「サーバー」「ユーザー」など英単語をカタカナに訳すときに、末尾の「ー」を付けるかどうか。

- 「r」「re」「y」などで終わる単語については、原則付ける
- 上の頻出語のように、別途まとめたものは例外とする

参考: https://kubernetes.slack.com/archives/CAG2M83S8/p1554096635015200 辺りのやりとり

### cron jobの訳し方に関して

混同を避けるため、cron jobはcronジョブと訳し、CronJobはリソース名としてのままにする。
cron「の」ジョブは、「の」が続く事による解釈の難から基本的にはつけないものとする。

### その他基本方針など

- 意訳と直訳で迷った場合は「直訳」で訳す
- 訳で難しい・わからないと感じたらSlackの#kubernetes-docs-jaでみんなに聞く
- できることを挙手制で、できないときは早めに報告

## アップストリームのコントリビューター

SIG Docsでは、英語のソースに対する[アップストリームへのコントリビュートや誤りの訂正](/docs/contribute/intermediate#localize-content)を歓迎しています。
