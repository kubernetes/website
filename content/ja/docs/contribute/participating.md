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

After you have successfully submitted at least 5 substantive pull requests, you
can request [membership](https://github.com/kubernetes/community/blob/master/community-membership.md#member)
in the Kubernetes organization. Follow these steps:

1.  Find two reviewers or approvers to [sponsor](/docs/contribute/advanced#sponsor-a-new-contributor)
    your membership.

      Ask for sponsorship in the [#sig-docs channel on the
      Kubernetes Slack instance](https://kubernetes.slack.com) or on the
      [SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

      {{< note >}}
      Don't send a direct email or Slack direct message to an individual
      SIG Docs member.
      {{< /note >}}

2.  Open a GitHub issue in the `kubernetes/org` repository to request membership.
    Fill out the template using the guidelines at
    [Community membership](https://github.com/kubernetes/community/blob/master/community-membership.md).

3.  Let your sponsors know about the GitHub issue, either by at-mentioning them
    in the GitHub issue (adding a comment with `@<GitHub-username>`) or by sending them the link directly,
    so that they can add a `+1` vote.

4.  When your membership is approved, the github admin team member assigned to your request updates the
    GitHub issue to show approval and then closes the GitHub issue.
    Congratulations, you are now a member!

If your membership request is not accepted, the
membership committee provides information or steps to take before applying
again.

## Reviewers

Reviewers are members of the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. Reviewers review documentation pull requests and provide feedback on proposed
changes. Reviewers can:

- Do everything listed under [Anyone](#anyone) and [Members](#members)
- Document new features
- Triage and categorize issues
- Review pull requests and provide binding feedback
- Create diagrams, graphics assets, and embeddable screencasts and videos
- Edit user-facing strings in code
- Improve code comments

### Assigning reviewers to pull requests

Automation assigns reviewers to all pull requests. You can request a
review from a specific reviewer with a comment on the pull request: `/assign
[@_github_handle]`. To indicate that a pull request is technically accurate and
requires no further changes, a reviewer adds a `/lgtm` comment to the pull
request.

If the assigned reviewer has not yet reviewed the content, another reviewer can
step in. In addition, you can assign technical reviewers and wait for them to
provide a `/lgtm` comment.

For a trivial change or one that needs no technical review, SIG Docs
[approvers](#approvers) can provide the `/lgtm` as well.

An `/approve` comment from a reviewer is ignored by automation.

### Becoming a reviewer

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer),
you can become a SIG Docs reviewer. Reviewers in other SIGs must apply
separately for reviewer status in SIG Docs.

To apply, open a pull request to add yourself to the `reviewers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.

If your pull request is approved, you are now a SIG Docs reviewer.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.

If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.

## Approvers

Approvers are members of the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. See [SIG Docs teams and automation](#sig-docs-teams-and-automation) for details.

Approvers can do the following:

- Everything listed under [Anyone](#anyone), [Members](#members) and [Reviewers](#reviewers)
- Publish contributor content by approving and merging pull requests using the `/approve` comment.
  If someone who is not an approver leaves the approval comment, automation ignores it.
- Participate in a Kubernetes release team as a docs representative
- Propose improvements to the style guide
- Propose improvements to docs tests
- Propose improvements to the Kubernetes website or other tooling

If the PR already has a `/lgtm`, or if the approver also comments with `/lgtm`,
the PR merges automatically. A SIG Docs approver should only leave a `/lgtm` on
a change that doesn't need additional technical review.

### Becoming an approver

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#approver),
you can become a SIG Docs approver. Approvers in other SIGs must apply
separately for approver status in SIG Docs.

To apply, open a pull request to add yourself to the `approvers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.

If your pull request is approved, you are now a SIG Docs approver.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.

If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.

### Approver responsibilities

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
