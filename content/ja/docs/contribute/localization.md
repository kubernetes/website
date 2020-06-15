---
title: Kubernetesのドキュメントを翻訳する
content_type: concept
card:
  name: contribute
  weight: 30
  title: Translating the docs
---

{{% capture overview %}}

このページでは、ドキュメントを異なる言語に[ローカライズ](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)する方法について紹介します。

{{% /capture %}}

<!-- body -->

## はじめる

コントリビューターが自分自身のプルリクエストを承認することはできないため、ローカライゼーションを始めるには、最低でも2人が必要です。

すべてのローカライゼーションチームは、自分たちのリソースを継続的に自己管理しなければいけません。私たちはドキュメントを喜んでホストしますが、あなたの代わりに翻訳することはできないからです。

### 2文字の言語コードを探す

まず最初に、[ISO 639-1標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)のドキュメントから、ローカライゼーションの2文字の国コードを探してください。たとえば、韓国語のための国コードは`ko`です。

### リポジトリをフォーク・クローンする {#fork-and-clone-the-repo}

初めに、[kubernetes/website](https://github.com/kubernetes/website)リポジトリの[自分用のフォークを作成](/docs/contribute/start/#improve-existing-content)します。

そして、フォークをクローンして、ディレクトリに`cd`します。

```shell
git clone https://github.com/<username>/website
cd website
```

### プルリクエストを開く

次に、`kubernetes/website`リポジトリにローカライゼーションを追加するための[プルリクエスト(PR)を開きます](/docs/contribute/start/#submit-a-pull-request)。

このPRが承認されるためには、[最低限必要なコンテンツ](#minimum-required-content)が含まれていなければなりません。

新しいローカライゼーションを追加する例としては、[フランス語版ドキュメントを追加するPR](https://github.com/kubernetes/website/pull/12548)を参考にしてください。

### Kubernetes GitHub organizationに参加する

ローカライゼーションのPRを作ると、Kubernetes GitHub organizationのメンバーになることができます。チームの各個人は、それぞれ`kubernetes/org`リポジトリに[Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose)を作成する必要があります。

### ローカライゼーションチームをGitHubに追加する {#add-your-localization-team-in-github}

次に、Kubernetesのローカライゼーションチームを[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml)に追加します。ローカライゼーションチームを追加する例として、[スペイン語のローカライゼーションチーム](https://github.com/kubernetes/org/pull/685)を追加するPRを見てください。

`@kubernetes/sig-docs-**-owners`のメンバーは、ローカライゼーションのディレクトリ`/content/**/`以下のコンテンツのみを変更するPRを承認できます。

各ローカライゼーションごとに、新しいPRに対して`@kubernetes/sig-docs-**-reviews`チームがレビューに自動的にアサインされます。

`@kubernetes/website-maintainers`のメンバーは、翻訳作業を調整するために新しい開発ブランチを作ることができます。

`@kubernetes/website-milestone-maintainers`のメンバーは、issueやPRにマイルストーンをアサインするために、`/milestone`[Prowコマンド](https://prow.k8s.io/command-help)が使用できます。

### ワークフローを設定する {#configure-the-workflow}

次に、`kubernetes/test-infra`リポジトリに新しいローカライゼーション用のGitHubラベルを追加します。ラベルを利用すると、issueやプルリクエストを特定の言語のものだけにフィルタできます。

ラベルを追加する例としては、[イタリア語の言語ラベル](https://github.com/kubernetes/test-infra/pull/11316)を追加するPRを見てください。

### コミュニティを見つける

Kubernetes SIG Docsに、ローカライゼーションを作りたいと思っていることを知らせてください！[SIG Docs Slackチャンネル](https://kubernetes.slack.com/messages/C1J0BPD2M/)に参加してください。他のローカライゼーションメンバーが、あなたがローカライゼーションを始めるのを喜んで助けてくれ、どんな疑問にも答えてくれます。

`kubernetes/community`リポジトリ内で、ローカライゼーション用のSlackチャンネルを作ることもできます。Slackチャンネルを追加する例としては、[インドネシア語とポルトガル語用のチャンネルを追加する](https://github.com/kubernetes/community/pull/3605)ためのPRを見てください。

## 最低限必要なコンテンツ {#minimum-required-content}

### サイトの設定を修正する

Kubernetesのウェブサイトでは、Hugoをウェブフレームワークとして使用しています。ウェブサイトのHugoの設定は、[`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml)ファイルの中に書かれています。新しいローカライゼーションをサポートするには、`config.toml`を修正する必要があります。

`config.toml`の既存の`[languages]`ブロックの下に、新しい言語の設定ブロックを追加してください。たとえば、ドイツ語のブロックの場合、次のようになります。

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

ブロックの`weight`パラメーターの設定では、最も高い重みを持つ言語ブロックを探し、その値に1を加えた値を指定してください。

Hugoの多言語サポートについての詳しい情報は、「[多言語モード](https://gohugo.io/content-management/multilingual/)」を参照してください。

### 新しいローカライゼーションのディレクトリを追加する

[`content`](https://github.com/kubernetes/website/tree/master/content)フォルダーに、言語用のサブディレクトリを追加してください。2文字の言語コードが`de`であるドイツ語の場合、次のようにディレクトリを作ります。

```shell
mkdir content/de
```

### Community Code of Conductをローカライズする

あなたの言語のcode of conductを追加するために、PRを[`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages)リポジトリに対して開いてください。

### ローカライズしたREADMEを追加する

他のローカライゼーションのコントリビューターをガイドするために、kubernetes/websiteのトップレベルに新しい[`README-**.md`](https://help.github.com/articles/about-readmes/)を追加してください。ここで、`**`は2文字の言語コードです。たとえば、ドイツ語のREADMEファイルは`README-de.md`です。

ローカライズされた`README-**.md`ファイルの中で、ローカライゼーションのコントリビューターにガイダンスを提供してください。`README.md`に含まれているのと同じ情報に加えて、以下の情報も追加してください。

- ローカライゼーションプロジェクトのための連絡先
- ローカライゼーション固有の情報

ローカライズされたREADMEを作成したら、メインの英語の`README.md`からそのファイルへのリンクを追加し、英語で連絡先情報も書いてください。GitHub ID、メールアドレス、[Slackチャンネル](https://slack.com)、その他の連絡手段を提供できます。ローカライズされたCommunity Code of Conductへのリンクも必ず提供してください。

### OWNERSファイルを設定する

ローカライゼーションにコントリビュートする各ユーザーのロールを設定するには、言語用のサブディレクトリの中に`OWNERS`ファイルを作成し、以下の項目を設定します。

- **レビュアー**: レビュアーのロールを持つkubernetesチームのリストです。この場合は、[GitHubでローカライゼーションチームを追加](#add-your-localization-team-in-github)で作成した`sig-docs-**-reviews`チームです。
- **承認者**: 承認者のロールを持つkubernetesチームのリストです。この場合は、[GitHubでローカライゼーションチームを追加](#add-your-localization-team-in-github)で追加した`sig-docs-**-owners`チームです。
- **ラベル**: PRに自動的に適用されるGitHub上のラベルのリストです。この場合は、[ワークフローを設定する](#configure-the-workflow)で作成した言語ラベルです。

`OWNERS`ファイルに関するより詳しい情報は、[go.k8s.io/owners](https://go.k8s.io/owners)を参照してください。

言語コードが`es`の[スペイン語のOWNERSファイル](https://git.k8s.io/website/content/es/OWNERS)は次のようになります。

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```

特定の言語用の`OWNERS`ファイルを追加したら、[ルートの`OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES)ファイルを、ローカライゼーションのための新しいKuerbetesチーム、`sig-docs-**-owners`および`sig-docs-**-reviews`で更新します。

各チームごとに、[ローカライゼーションチームをGitHubに追加する](#add-your-localization-team-in-github)でリクエストしたGitHubユーザーのリストをアルファベット順で追加してください。

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

## コンテンツを翻訳する

Kubernetesのドキュメントの *すべて* をローカライズするのは、非常に大きな作業です。小さく始めて、時間をかけて拡大していけば大丈夫です。

最低限、すべてのローカライゼーションには以下のコンテンツが必要です。

説明 | URL
-----|-----
ホーム | [すべての見出しと小見出しのURL](/docs/home/)
セットアップ | [すべての見出しと小見出しのURL](/docs/setup/)
チュートリアル | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/)、[Hello Minikube](/docs/tutorials/hello-minikube/)
サイト文字列 | [ローカライズされた新しいTOMLファイル内のすべてのサイト文字列](https://github.com/kubernetes/website/tree/master/i18n)

翻訳されたドキュメントは、言語ごとに`content/**/`サブディレクトリに置き、英語のソースと同じURLパスに従うようにしなければいけません。たとえば、[Kubernetes Basics](/docs/tutorials/kubernetes-basics/)のチュートリアルをドイツ語に翻訳する準備をするには、次のように、`content/de/`フォルダ以下にサブディレクトリを作り、英語のソースをコピーします。

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

翻訳ツールを使えば、翻訳のプロセスをスピードアップできます。たとえば、エディタによってはテキストを高速に翻訳してくれるプラグインがあります。

{{< caution >}}
機械生成された翻訳は、そのままでは最低限の品質基準を満たしません。基準を満たすためには、人間による十分なレビューが必要です。
{{< /caution >}}

文法と意味の正確さを保証するために、公開する前にローカライゼーションチームのメンバーが機械生成されたすべての翻訳を注意深くレビューしなければいけません。

### ソースファイル

ローカライゼーションは、最新のリリース{{< latest-version >}}の英語のファイルをベースにしなければなりません。

最新のリリースのソースファイルを見つけるには、次のように探してください。

1. Kubernetesのウェブサイトのリポジトリ https://github.com/kubernetes/website に移動する。
2. 最新バージョンの`release-1.X`ブランチを選択する。

最新バージョンは{{< latest-version >}}であるため、最新のリリースブランチは[`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}})です。

### i18n/内のサイト文字列

ローカライゼーションには、[`i18n/en.toml`](https://github.com/kubernetes/website/blob/master/i18n/en.toml)の内容を新しい言語用のファイル内に含める必要があります。ドイツ語を例に取ると、ファイル名は`i18n/de.toml`です。

新しいローカライゼーションファイルを`i18n/`に追加します。たとえば、ドイツ語(`de`)であれば次のようになります。

```shell
cp i18n/en.toml i18n/de.toml
```

そして、各文字列の値を翻訳します。

```TOML
[docs_label_i_am]
other = "ICH BIN..."
```

サイト文字列をローカライズすることで、サイト全体で使われるテキストや機能をカスタマイズできます。たとえば、各ページのフッターにある著作権のテキストなどです。

### 言語固有のスタイルガイドと用語集

一部の言語チームでは、言語固有のスタイルガイドや用語集を持っています。たとえば、[韓国語のローカライゼーションガイド](/ko/docs/contribute/localization_ko/)を見てください。

## ブランチの戦略

ローカライゼーションプロジェクトは非常に協力的な活動であるため、チームでは共有の開発ブランチで作業することを推奨します。

開発ブランチ上で共同作業するためには、以下の手順を行います。

1. [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)のチームメンバーが https://github.com/kubernetes/website のソースブランチから開発ブランチを作る。

    [`kubernetes/org`](https://github.com/kubernetes/org)リポジトリに[ローカライゼーションチームを追加](#add-your-localization-team-in-github)したとき、チームの承認者は`@kubernetes/website-maintainers`チームに参加します。

    次のようなブランチの命名規則に従うことを推奨します。

    `dev-<ソースのバージョン>-<言語コード>.<チームのマイルストーン>`

    たとえば、ドイツ語のローカライゼーションチームの承認者は、Kubernetes v1.12のソースブランチをベースに、k/websiteリポジトリから直接開発ブランチ`dev-1.12-de.1`を作ります。

2. 各コントリビューターが、開発ブランチをベースにフィーチャーブランチを作る。

    たとえば、ドイツ語のコントリビューターは、`username:local-branch-name`から`kubernetes:dev-1.12-de.1`に対して、変更を含むプルリクエストを開きます。

3. 承認者がフィーチャーブランチをレビューして、開発ブランチにマージする。

4. 定期的に新しいプルリクエストを開いて承認することで、承認者が開発ブランチをソースブランチにマージする。プルリクエストを承認する前にコミットをsquashするようにしてください。

ローカライゼーションが完了するまで、1-4のステップを必要なだけ繰り返します。たとえば、ドイツ語のブランチは、`dev-1.12-de.2`、`dev-1.12-de.3`と続きます。

チームは、ローカライズしたコンテンツを元となったリリースブランチにマージする必要があります。たとえば、{{< release-branch >}}から作られた開発ブランチは、必ず{{< release-branch >}}にマージしなければなりません。

承認者は、ソースブランチを最新の状態に保ち、マージのコンフリクトを解決することで、開発ブランチをメンテナンスしなければなりません。開発ブランチが長く開いたままであるほど、一般により多くのメンテナンスが必要になります。そのため、非常に長い期間に渡って開発ブランチを維持するよりは、定期的に開発ブランチをマージして、新しいブランチを作ることを考えてください。

各チームマイルストーンの最初には、1つ前の開発ブランチと現在の開発ブランチの間のアップストリームの変更を比較するissueを開くと役に立ちます。

新しい開発ブランチを開いたりプルリクエストをマージできるのは承認者だけですが、新しい開発ブランチには誰でもプルリクエストを開くことができます。特別な許可は必要ありません。

フォークやリポジトリから直接行う作業についての詳しい情報は、「[リポジトリをフォーク・クローンする](#fork-and-clone-the-repo)」を読んでください。

## アップストリームのコントリビューター

SIG Docsでは、英語のソースに対する[アップストリームへのコントリビュートや誤りの訂正](/docs/contribute/intermediate#localize-content)を歓迎しています。

## 既存のローカライゼーションを助ける

コンテンツの追加や改善により既存のローカライゼーションを助けることもできます。ローカライゼーションのための[Slackチャンネル](https://kubernetes.slack.com/messages/C1J0BPD2M/)に参加して、助けとなるPRを開くことを始めましょう。

{{% /capture %}}

## {{% heading "whatsnext" %}}

ローカライゼーションがワークフローと最小限のコンテンツの要件を満たしたら、SIG docsは次の作業を行います。

- ウェブサイト上で言語の選択を有効にする。
- [Kubernetesブログ](https://kubernetes.io/blog/)を含む[Cloud Native Computing Foundation](https://www.cncf.io/about/)(CNCF)のチャンネルで、ローカライゼーションが利用できるようになったことを公表する。

{{% /capture %}}
