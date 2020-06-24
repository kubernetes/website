---
title: SIG Docsに参加する
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG DocsはKubernetesプロジェクトにおける[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)の1つで、Kubernetes全体のドキュメントを書いたり、更新したり、維持したりすることに焦点を当てています。
SIG Docsの詳細を知りたい場合、[GitHub上のcommunityリポジトリー](https://github.com/kubernetes/community/tree/master/sig-docs)を参照して下さい。

SIG Docsはすべてのコントリビューターからのコンテンツやレビューを歓迎します。
誰でもPull Request (PR)を作ることができますし、誰でもコンテンツについてのIssueを作ることができますし、進行中のPull Requestにコメントをすることができます。

[メンバー](#members)や[レビュアー](#reviewer)、[承認者](#approver)になることもできます。
これらの役割はより大きな権限を持ち、変更を承認したりコミットする責任があります。
Kubernetesコミュニティー内でどのようにメンバーシップが機能しているかについての詳細は[コミュニティーメンバーシップ](https://github.com/kubernetes/community/blob/master/community-membership.md)を参照して下さい。

このドキュメントの残りの部分では、Kubernetesの、最も外部公開された側面の1つであるウェブサイトとドキュメンテーションの管理を担当しているSIG Docsの中で、これらの役割がどのように機能しているのかについて説明しています。

<!-- body -->

## 役割と責任 {#roles and responsibilities}

- **だれでも**Kubernetesのドキュメンテーションにコントリビュートすることができます。コントリビュートするには、[CLAにサインする](/docs/contribute/new-content/overview/#sign-the-cla)こととGitHubアカウントを持つことが必要です。.
- Kubernetesオーガニゼーションの**メンバー**はKubernetesプロジェクトに承認された変更を含むPull Requestを作成することで時間と努力を割いたコントリビューターです。 メンバーシップの基準については[コミュニティーメンバーシップ](https://github.com/kubernetes/community/blob/master/community-membership.md)を参照して下さい。
- SIG Docsの**レビュアー**はドキュメントに対するPull Requestをレビューすることに興味を示し、適切なGitHubグループに追加され、SIG Docsの承認者によってGitHubリポジトリ内の`OWNERS`ファイルに記名された、Kubernetesオーガニゼーションのメンバーです。
- SIG Docsの**承認者**はプロジェクトに継続的に参加し、資格を得たメンバーです。承認者はPull Requestをマージし、Kubernetesオーガニゼーションの一部としてコンテンツを公開することができます。承認者はより大きなKubernetesコミュニティーにおいて、SIG Docsを代表することもできます。リリースを調整するような、SIG Docs承認者の職務のいくつかはより多くの時間を割く必要があります。

## 誰でも {#anyone}

誰でも、以下のことができます:

- ドキュメントを含むKubernetesの一部に対してGitHub Issueを作成すること
- Pull Requestにフィードバックを送ること。
- 既存のコンテンツの翻訳作業を助けること。
- [Slack](http://slack.k8s.io/)や[SIG Docsのメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)で改善のアイデアを出すこと。
- Pull Requestをマージすることを勧めるために`/lgtm` Prowコマンド("looks good to me"の略です)を使用すること。
  {{< note >}}
  もしあなたがKubernetesオーガニゼーションのメンバーではない場合、`/lgtm`を使うことはシステム上では何の効果もありません。
  {{< /note >}}


[CLAにサインした](/docs/contribute/new-content/overview/#sign-the-cla)あとはさらに以下のことができます:
- 既存のコンテンツを改善したり、新しいコンテンツを追加したり、ブログ記事やケーススタディーを書いたりして、Pull Requestを作成すること。
- Open a pull request to improve existing content, add new content, or write a blog post or case study.

## メンバー {#members}

メンバーは[メンバーシップの基準](https://github.com/kubernetes/community/blob/master/community-membership.md#member)に適合したKubernetesプロジェクトのコントリビューターです。
SIG DocsはKubernetesコミュニティーにおけるすべてのメンバーからのコントリビューションを歓迎していますし、技術的な正確性のタメに他のSIGメンバーにレビューを頻繁に依頼しています。

[Kubernetesオーガニゼーション](https://github.com/kubernetes)のメンバーは以下のことができます。

- [Anyone](#anyone)で説明されたすべてのこと
- Pull RequestへLGTM (looks good to me)ラベルを追加するために`/lgtm`コメントを使用すること。
- Pull RequestへすでにLGTMとapproveラベルがつけられていた場合でもマージされないように`/hold`コマンドを使用すること。
- Pull Requestへレビュアーをアサインするために`assign`コメントを使用すること。

### メンバーになる

最低5つのPull Requestを投稿した後、Kubernetesオーガニゼーションの[メンバーシップ](https://github.com/kubernetes/community/blob/master/community-membership.md#member)を要求することができます。そのためには、以下の手順に従って下さい:

1.  あなたのメンバーシップを[スポンサー](/docs/contribute/advanced#sponsor-a-new-contributor)してくれる2人のレビュアーまたは承認者を見つけてください。

      [Kubernetes Slackの#sig-docsチャンネル](https://kubernetes.slack.com)か[SIG Docsのメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)でスポンサーをしてもらえないか聞いてみてください。

      {{< note >}}
      SIG Docsのメンバー個人に直接メールしたり、Slackのダイレクトメッセージを送ったりしないでください。
      {{< /note >}}

2.  メンバーシップを要求するためにGitHubの`kubernetes/org`リポジトリーにIssueを作成してください。
    [コミュニティーメンバーシップ](https://github.com/kubernetes/community/blob/master/community-membership.md)のページにあるガイドラインを見て、テンプレートを埋めてください。

3.  `+1`と投票できるように、GitHub Issueでメンションする(`@<GitHubのユーザー名>`を含んだコメントを追加する)、またはリンクを直接送るといった方法であなたのスポンサーへとGitHub Issueのことを伝えてください。

4.  メンバーシップが承認されると、あなたの要求にアサインされたGitHub管理メンバーがGitHub Issueを更新して承認し、GitHub Issueを閉じます。
    メンバーになれました。おめでとうございます！

メンバーシップ要求が承認されなかった場合、メンバーシップ委員会は、承認までに必要な手順を提供します。

## レビュアー {#reviewers}

レビュアーは[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews) GitHubグループのメンバーです。レビュアーはドキュメンテーションへのPull Requestをレビューし、提案された変更へのフィードバックを送ります。レビュアーは以下のことができます:

- [誰でも](#anyone)と[メンバー](#members)で説明されたすべてのこと
- 新しい機能についてのドキュメントを書くこと
- Issueをカテゴライズし、優先順位を付けること
- Pull Requestをレビューし、フィードバックを送ること
- 図や画像、埋め込み可能なスクリーンキャストや映像を作成すること
- コード中の、ユーザーに表示される文字列を編集すること
- コードのコメントを改善すること

### レビュアーをPull Requestにアサインする

すべてのPull Requestへのレビュアー割り当ては自動化されています。Pull Requestに`/assing [@GitHubのユーザー名]`とコメントをすることで、特定のレビュアーにレビューを依頼することができます。Pull Requestの内容が技術的に正確で、それ以上の変更が必要ないということを示すために、レビュアーは`/lgtm`というコメントをPull Requestにつけます。

アサインされたレビュアーが内容をまだレビューしていない場合、他のレビュアーが参加することもできます。これに加えて、技術的なレビュアーを追加し、彼らが`/lgtm`コメントをつけてくれることを待つこともできます。

ささいな変更の場合や、技術的なレビューが必要無い場合には、SIG Docsの[承認者](#approvers)が`/lgtm`を付けることもできます。

レビュアーからの`/approve`コメントは自動化システムには無視されます。

### レビュアーになる

[要件](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)を満たしている場合、SIG Docsのレビュアーになることができます。他のSIGのレビュアーであっても、SIG Docsでレビュアーになるには別途申請が必要です。

申請するには、`Kubernetes/website`リポジトリーの[トップレベルにあるOWNERSファイル](https://github.com/kubernetes/website/blob/master/OWNERS)の`reviewers`セクションにあなたのユーザー名を追加するPull Requestを作成してください。現在のSIG Docsの承認者を一人以上アサインしてください。

Pull Requestが承認されたら、SIG Docsのレビュアーになることができます。[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)が新しいPull Requestに対して、あなたをレビュアーとしてアサインしたり提案したりします。

承認されたなら、現在のSIG Docsの承認者に、[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews) GitHubグループへ追加するよう依頼してください。`kubernetes-website-admins` GitHubグループのメンバーのみが新しいメンバーを追加することができます。

## 承認者

承認者は[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers) GitHubグループのメンバーです。詳細は[SIG Docsのチームと自動化](#sig-docs-teams-and-automation)を見てください。

承認者は以下のことができます:

- [誰でも](#anyone)、[メンバー](#members)、[レビュアー](#reviewers)で説明されたすべてのこと
- `/approve`コメントを使用し、Pull Requestを承認・マージすることでコンテンツを公開すること。
  承認者ではない誰かが承認コメントをしても、自動化システムは無視します。
- ドキュメントチームの代表としてKubernetesリリースチームに参加すること
- スタイルガイドへの改善を提案すること
- ドキュメントのテストへの改善を提案すること
- Kubernetesのウェブサイトやその他のツールについて改善を提案すること

PRに対してすでに`/lgtm`コメントがついているか、承認者が`/lgtm`と一緒に承認コメントをした場合、そのPRは自動的にマージされます。SIG Docsの承認者は、追加の技術的なレビューが必要無い場合に限り`/lgtm`コメントをつけるべきです。

### 承認者になる

When you meet the
[要件](https://github.com/kubernetes/community/blob/master/community-membership.md#approver)を満たしている場合、SIG Docsの承認者になることができます。他のSIGの承認者であっても、SIG Docsで承認者になるには別途申請が必要です。

申請するには、`Kubernetes/website`リポジトリーの[トップレベルにあるOWNERSファイル](https://github.com/kubernetes/website/blob/master/OWNERS)の`approvers`セクションにあなたのユーザー名を追加するPull Requestを作成してください。現在のSIG Docsの承認者を一人以上アサインしてください。

Pull Requestが承認されたら、SIG Docsのレビュアーになることができます。[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)が新しいPull Requestに対して、あなたをレビュアーとしてアサインしたり提案したりします。

承認されたなら、現在のSIG Docsの承認者に、[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers) GitHubグループへ追加するよう依頼してください。`kubernetes-website-admins` GitHubグループのメンバーのみが新しいメンバーを追加することができます。

### 承認者の責任

Approvers improve the documentation by reviewing and merging pull requests into the website repository. Because this role carries additional privileges, approvers have additional responsibilities:

- Approvers can use the `/approve` command, which merges PRs into the repo.

    A careless merge can break the site, so be sure that when you merge something, you mean it.

- Make sure that proposed changes meet the [contribution guidelines](/docs/contribute/style/content-guide/#contributing-content).

    If you ever have a question, or you're not sure about something, feel free to call for additional review.

- Verify that Netlify tests pass before you `/approve` a PR.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlify tests must pass before approving" />

- Visit the Netlify page preview for a PR to make sure things look good before approving.

- Participate in the [PR Wrangler rotation schedule](https://github.com/kubernetes/website/wiki/PR-Wranglers) for weekly rotations. SIG Docs expects all approvers to participate in this
rotation. See [Be the PR Wrangler for a week](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week)
for more details.

## SIG Docs chairperson

Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.

## SIG Docs teams and automation

Automation in SIG Docs relies on two different mechanisms for automation:
GitHub groups and OWNERS files.

### GitHub groups

The SIG Docs group defines two teams on GitHub:

 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.

These teams overlap, but do not exactly match, the groups used by the automation
tooling. For assignment of issues, pull requests, and to support PR approvals,
the automation uses information from OWNERS files.

### OWNERS files and front-matter

The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes/test-infra/tree/master/prow/plugins):

- blunderbuss
- approve

These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.

An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendents. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.

The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.

## How merging works

When a pull request is merged to the branch used to publish content (currently
`master`), that content is published and available to the world. To ensure that
the quality of our published content is high, we limit merging pull requests to
SIG Docs approvers. Here's how it works.

- When a pull request has both the `lgtm` and `approve` labels, has no `hold`
  labels, and all tests are passing, the pull request merges automatically.
- Kubernetes organization members and SIG Docs approvers can add comments to
  prevent automatic merging of a given pull request (by adding a `/hold` comment
  or withholding a `/lgtm` comment).
- Any Kubernetes member can add the `lgtm` label by adding a `/lgtm` comment.
- Only SIG Docs approvers can merge a pull request
  by adding an `/approve` comment. Some approvers also perform additional
  specific roles, such as [PR Wrangler](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week) or
  [SIG Docs chairperson](#sig-docs-chairperson).



## {{% heading "whatsnext" %}}


For more information about contributing to the Kubernetes documentation, see:

- [Contributing new content](/docs/contribute/overview/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [Documentation style guide](/docs/contribute/style/)
