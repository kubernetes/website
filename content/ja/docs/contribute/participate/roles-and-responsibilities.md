---
title: ロールと責任
content_type: concept
weight: 10
---

<!-- overview -->

誰もがKubernetesに貢献することができます。
SIG Docs へのコントリビューションが増えると、コミュニティ内で異なるレベルのメンバーシップに申請することができます。
これらの役割により、コミュニティ内でより多くの責任を担うことができます。
各役割にはより多くの時間とコミットメントが必要です。
役割は以下の通りです:

- Anyone: Kubernetesドキュメントへの定期的なコントリビューター
- Member: Issueの割り当てとトリアージができ、Pull Requestに対する非公式なレビューができる
- Reviewer: ドキュメントのPull Requestのレビューをリードし、変更の品質を保証する
- Approver: ドキュメントのレビューをリードし、変更をマージできる

<!-- body -->

## Anyone {#anyone}

GitHubのアカウントを持っている人なら誰もがKubernetesに貢献することができます。
SIG Docs はすべての新たなコントリビューターを歓迎します。

誰もが以下のことをできます:

- [`kubernetes/website`](https://github.com/kubernetes/website)を含む、どの[Kubernetes](https://github.com/kubernetes/)リポジトリでもIssueを作成する
- Pull Requestに非公式なフィードバックを提供する
- ローカライゼーションに貢献する
- [Slack](https://slack.k8s.io/)や[SIG Docsのメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)で改善の提案をする

[CLA に署名](https://github.com/kubernetes/community/blob/master/CLA.md)した後は、誰もが以下のことをできます:

- 既存のコンテンツを改善するためのPull Requestを開く、新しいコンテンツを追加する、ブログ記事やケーススタディを書く
- 図表やグラフィックアセット、埋め込み可能なスクリーンキャストやビデオを作成する

詳細については、[新しいコンテンツの貢献](/ja/docs/contribute/new-content/)を参照してください。

## Member {#members}

Memberは、`kubernetes/website`に複数のPull Requestを作成した人です。
Memberは[Kubernetes GitHub organization](https://github.com/kubernetes)の一員です。

Memberは以下のことをできます:

- [Anyone](#anyone)に列挙されているすべてのことを行う
- `/lgtm`コメントを使用して、Pull RequestにLGTM (looks good to me)ラベルを追加する

  {{< note >}}
  `/lgtm`を使用すると、自動化がトリガーされます。
  非公式に承認したい場合は、"LGTM"とコメントするだけでも大丈夫です！
  {{< /note >}}

- `/hold`コメントを使用して、Pull Requestのマージをブロックする
- `/assign`コメントを使用して、Pull RequestにReviewerを割り当てる
- Pull Requestに非公式なレビューを提供する
- 自動化を使用してIssueをトリアージし、分類する
- 新機能をドキュメント化する

### Memberになる {#becoming-a-member}

少なくとも5つの実質的なPull Requestを作成し、その他の[要件](https://github.com/kubernetes/community/blob/master/community-membership.md#member)を満たした後に以下のようにしてMemberになることができます:

1. 2人の[Reviewer](#reviewers)または[Approver](#approvers)にあなたのメンバーシップを[スポンサー](/docs/contribute/advanced#sponsor-a-new-contributor)してもらいます。

   [Slackの#sig-docsチャンネル](https://kubernetes.slack.com)や[SIG Docsのメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)でスポンサーを依頼してください。

   {{< note >}}
   個別のSIG Docsメンバーに直接メールやSlackのダイレクトメッセージを送らないでください。
   また申請する前にスポンサーを依頼する必要があります。
   {{< /note >}}

2. [`kubernetes/org`](https://github.com/kubernetes/org/)リポジトリにIssueを作成します。**Organization Membership Request**のissueテンプレートを使用してください。

3. スポンサーにGitHub Issueのことを知らせます。以下の方法があります:
   - Issue内でGitHubユーザー名に言及する（`@<GitHub-username>`）
   - Slackやメールを使ってIssueのリンクを送る

     スポンサーは`+1`の投票でリクエストを承認します。
     スポンサーがリクエストを承認すると、Kubernetes GitHubの管理者があなたをメンバーとして追加します。
     おめでとうございます！

     メンバーシップリクエストが承認されない場合はフィードバックを受け取ります。
     フィードバックに対応した後、再度申請してください。

4. メールアカウントでKubernetes GitHub organizationの招待を受け入れます。

   {{< note >}}
   GitHubはアカウントのデフォルトメールアドレスに招待を送信します。
   {{< /note >}}

## Reviewer {#reviewers}

ReviewerはオープンなPull Requestのレビューを担当します。
Memberのフィードバックとは異なり、PRを作成した人はReviewerのフィードバックに対応する必要があります。
Reviewerは[@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs) GitHubチームのメンバーです。

Reviewerは以下のことをできます:

- [Anyone](#anyone)および[Member](#members)に列挙されているすべてのことを行う
- Pull Requestをレビューし、拘束力のあるフィードバックを提供する

  {{< note >}}
  拘束力のないフィードバックを提供する場合、コメントの前に"Optionally: "などのフレーズを付けてください。
  {{< /note >}}

- コード内のユーザー向けの文字列を編集する
- コードコメントを改善する

SIG DocsのReviewer、あるいは特定の領域に関するドキュメントのReviewerになることができます。

### Pull RequestへのReviewerの割り当て

自動化により、すべてのPull RequestにReviewerが割り当てられます。
特定の人物にレビューを依頼するには、`/assign [@_github_handle]`とコメントします。

割り当てられたReviewerがPRにコメントしていない場合、他のReviewerが代わりにレビューできます。
また、必要に応じて技術的なReviewerを割り当てることもできます。

### `/lgtm`の使用

LGTMは"Looks good to me"の略で、Pull Requestが技術的に正確でマージの準備が整っていることを示します。
すべてのPRには、マージするためにReviewerからの`/lgtm`コメントとApproverからの`/approve`コメントが必要です。

Reviewerからの`/lgtm`コメントは拘束力があり、自動化により`lgtm`ラベルが追加されます。

### Reviewerになる

[要件](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)を満たすと、SIG DocsのReviewerになることができます。他のSIGのReviewerは、SIG DocsでのReviewerステータスを別途申請する必要があります。

申請方法は以下の通りです:

1. `kubernetes/website`リポジトリの[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)ファイルのセクションに、GitHubユーザー名を追加するPull Requestを開きます。

   {{< note >}}
   どこに追加すればよいかわからない場合は、`sig-docs-en-reviews`に追加してください。

   訳注: `sig-docs-en-reviews`は英語版のReviewerチームです。日本語ローカライゼーションのReviewerチームに参加する場合は、`sig-docs-ja-reviews`に追加してください。
   {{< /note >}}

2. PRを1人以上のSIG Docs Approverに割り当てます(ユーザー名は`sig-docs-{language}-owners`に記載されています)。

承認されると、SIG Docsのリードが適切なGitHubチームに追加します。
追加されると、[k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)が新しいPull RequestのReviewerとしてあなたを割り当て、提案します。

## Approver {#approvers}

ApproverはPull Requestをレビューし、マージするために承認します。
Approverは[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs) GitHubチームのメンバーです。

Approverは以下のことをできます:

- [Anyone](#anyone)、[Member](#members)、および[Reviewer](#reviewers)に列挙されているすべてのことを行う
- `/approve`コメントを使用してPull Requestを承認およびマージすることで、コントリビューターのコンテンツを公開する
- スタイルガイドの改善を提案する
- ドキュメントテストの改善を提案する
- Kubernetesのウェブサイトや他のツールの改善を提案する

PRに既に`/lgtm`が付いている場合、またはApprover自身が`/lgtm`コメントを付けた場合、PRは自動的にマージされます。
SIG DocsのApproverは、追加の技術的なレビューが不要な変更にのみ`/lgtm`を付けるべきです。

### Pull Requestの承認

ApproverとSIG DocsのリードだけがPull Requestをwebsiteリポジトリにマージすることができます。
これには一定の責任が伴います。

- Approverは`/approve`コマンドを使用して、PRをリポジトリにマージできます。

  {{< warning >}}
  不注意なマージはサイトを壊す可能性があるため、マージする際には慎重に行ってください。
  {{< /warning >}}

- 提案された変更が[ドキュメントコンテンツガイド](/docs/contribute/style/content-guide/)に準拠していることを確認してください。

  もし疑問がある場合や何か不明な点がある場合は、遠慮なく追加のレビューを依頼してください。

- PRを`/approve`する前に、Netlifyのテストに通っていることを確認してください。

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlifyテストは承認する前に通っている必要があります" />

- 承認する前に、PRのNetlifyのページプレビューをクリックして内容が正しいことを確認してください。

- 週ごとのローテーションである[PR Wranglerローテーションスケジュール](https://github.com/kubernetes/website/wiki/PR-Wranglers)に参加してください。SIG DocsはすべてのApproverにこのローテーションへの参加を期待しています。詳細については[PR wranglers](/docs/contribute/participate/pr-wranglers/)を参照してください。

### Approverになる

[要件](https://github.com/kubernetes/community/blob/master/community-membership.md#approver)を満たすと、SIG DocsのApproverになることができます。
他のSIGのApproverは、SIG DocsでのApproverステータスを別途申請する必要があります。

申請方法は以下の通りです:

1. `kubernetes/website`リポジトリの[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)ファイルのセクションに、自分自身を追加するPull Requestを開きます。

    {{< note >}}
    どこに追加すればよいかわからない場合は、`sig-docs-en-owners`に追加してください。

    訳注: `sig-docs-en-owners`は英語版のApproverチームです。
    日本語ローカライゼーションのApproverチームに参加する場合は、`sig-docs-ja-owners`に追加してください。
    {{< /note >}}

2. PRを1人以上の現在のSIG Docs Approversに割り当てます。

承認されると、SIG Docsのリードが適切なGitHubチームに追加します。
追加されると、[k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)が新しいPull RequestのReviewerとしてあなたを割り当て、提案します。

## {{% heading "whatsnext" %}}

- すべてのApproverがローテーションで担当する役割である[PR wrangling](/docs/contribute/participate/pr-wranglers/)について読む。
