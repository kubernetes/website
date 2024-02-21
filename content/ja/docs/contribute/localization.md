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
- 記号類は感嘆符と疑問符だけ全角、それ以外は半角で表記
- 英単語と日本語の間に半角スペースは不要

### 用語の表記 {#terminology}

Kubernetesのリソース名や技術用語などは、原則としてそのままの表記を使用します。
例えば、PodやService、Deploymentなどは翻訳せずにそのままの表記を使用します。

ただし、ノード(Node)に関しては明確にKubernetesとしてのNodeリソース(例: `kind: Node`や`kubectl get nodes`)を指していないのであれば、「ノード」と表記してください。

またこれらの単語は、単数系を用いてください。
例えば、原文に"pods"と表記されている場合でも、日本語訳では"Pod"と表記してください。

### 頻出単語 {#frequent-words}

英語 | 日本語
--------- | ---------
Addon/Add-on|アドオン
Aggregation Layer | アグリゲーションレイヤー
architecture | アーキテクチャ
binary | バイナリ
cluster|クラスター
computer | コンピューター
community | コミュニティ
container | コンテナ
controller | コントローラー
Deployment/Deploy|KubernetesリソースとしてのDeploymentはママ表記、一般的な用語としてのdeployの場合は、デプロイ
directory | ディレクトリ
For more information|さらなる情報(一時的)
GitHub | GitHub (ママ表記)
interface | インターフェース
Issue | Issue (ママ表記)
memory | メモリー
operator | オペレーター
orchestrate(動詞)|オーケストレーションする
Persistent Volume|KubernetesリソースとしてのPersistentVolumeはママ表記、一般的な用語としての場合は、永続ボリューム
prefix | プレフィックス
proxy | プロキシ
Pull Request | Pull Request (ママ表記)
Quota|クォータ
registry | レジストリ
repository | リポジトリー
secure | セキュア
a set of ~ | ～の集合
stacked | 積層(例: stacked etcd clusterは積層etcdクラスター)

### 頻出表記(日本語) {#frequent-phrases}

よくある表記 | あるべき形
--------- | ---------
〜ので、〜から、〜だから| 〜のため 、〜ため
(あいうえお。)| (あいうえお)。
〇,〇,〇|〇、〇、〇(※今回列挙はすべて読点で統一)

### 長音の有無 {#long-vowel}

カタカナ語に長音を表記するべきかは、以下の原則に従ってください。

参考: [mozilla-japan/translation Editorial Guideline#カタカナ語の表記](https://github.com/mozilla-japan/translation/wiki/Editorial-Guideline#カタカナ語の表記)

> - 長音表記は次のとおりとする。
>   - -er、-or、-ar、-cy、-ry、-gy、-xy で終わる単語はすべて長音を付加する。
>     - 例: 「コンピューター」「ブラウザー」「ユーザー」「サーバー」「カレンダー」「プライバシー」「ディレクトリー」「プロキシー」
>     - Microsoft のような例外はなし。
>   - -ear、-eer、-re、-ty、-dy で終わる単語は長音を付加しない。
>     - 例: 「ボランティア」「エンジニア」「ソフトウェア」「アクセシビリティ」「セキュリティ」「ボディ」

ただし、以下の単語については上記の原則に従わず、長音を付加しない表記を用いてください。

- コンテナ
- バイナリ
- プロキシ
- リポジトリ

### cron jobの訳し方に関して {#cron-job}

混同を避けるため、cron jobはcronジョブと訳し、CronJobはリソース名としてのままにする。
cron「の」ジョブは、「の」が続く事による解釈の難から基本的にはつけないものとする。

### その他基本方針など {#other-basic-policy}

- 意訳と直訳で迷った場合は「直訳」で訳す
- 訳で難しい・わからないと感じたらSlackの#kubernetes-docs-jaでみんなに聞く
- できることを挙手制で、できないときは早めに報告

## アップストリームのコントリビューター {#upstream-contributor}

SIG Docsでは、英語のソースに対する[アップストリームへのコントリビュートや誤りの訂正](/docs/contribute/intermediate#localize-content)を歓迎しています。
