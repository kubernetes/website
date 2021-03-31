---
title: SIG Docsへの参加
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docsは、Kubernetesプロジェクト内の 
[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)の1つであり、
Kubernetes全体のドキュメントの作成、更新、および保守に重点を置いています。 
SIGの詳細については、[SIG DocsのGithubリポジトリ](https://github.com/kubernetes/community/blob/master/sig-list.md)を参照してください。

SIG Docsは、すべての寄稿者からのコンテンツとレビューを歓迎します。
誰でもPull Request（PR）を開くことができ、コンテンツに関するissueを提出したり、進行中のPull Requestにコメントしたりできます。

あなたは、[member](/docs/contribute/participate/roles-and-responsibilities/#members)や、
[reviewer](/docs/contribute/participate/roles-and-responsibilities/#reviewers)、
[approver](/docs/contribute/participate/roles-and-responsibilities/#approvers)になることもできます。
これらの役割にはより多くのアクセスが必要であり、変更を承認およびコミットするための特定の責任が伴います。
Kubernetesコミュニティ内でメンバーシップがどのように機能するかについての詳細は、
[community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
をご覧ください。

このドキュメントの残りの部分では、kubernetesの中で最も広く公開されている
Kubernetesのウェブサイトとドキュメントの管理を担当しているSIG Docsの中で、これらの役割がどのように機能するのかを概説します。


<!-- body -->

## SIG Docs chairperson

SIG Docsを含む各SIGは、議長として機能する1人以上のSIGメンバーを選択します。
これらは、SIGDocsとKubernetes organizationの他の部分との連絡先です。
それらには、Kubernetesプロジェクト全体の構造と、SIG Docsがその中でどのように機能するかについての広範な知識が必要です。
現在のchairpersonのリストについては、
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
を参照してください。

## SIG Docs teamsと自動化

SIG Docsの自動化は、GitHub teamsとOWNERSファイルの2つの異なるメカニズムに依存しています。

### GitHub teams

GitHubには、SIG Docs 
[teams](https://github.com/orgs/kubernetes/teams?query=sig-docs)
の二つのカテゴリがあります:

- `@sig-docs-{language}-owners`は承認者かつリードです。
- `@sig-docs-{language}-reviewers` はレビュアーです。

それぞれをGitHubコメントの`@name`で参照して、そのグループの全員とコミュニケーションできます。

ProwチームとGitHub teamsが完全に一致せずに重複する場合があります。
問題の割り当て、Pull Request、およびPR承認のサポートのために、自動化ではOWNERSファイルからの情報を使用します。

### OWNERSファイルとfront-matter

Kubernetesプロジェクトは、GitHubのissueとPull Requestに関連する自動化のためにprowと呼ばれる自動化ツールを使用します。 
[Kubernetes Webサイトリポジトリ](https://github.com/kubernetes/website) 
は、2つの[prowプラグイン](https://github.com/kubernetes/test-infra/tree/master/prow/plugins)を使用します：

- blunderbuss
- approve

これらの2つのプラグインは`kubernetes.website`のGithubリポジトリのトップレベルにある
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS)ファイルと、
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES)ファイルを使用して、
リポジトリ内でのprowの動作を制御します。

OWNERSファイルには、SIG Docsのレビュー担当者および承認者であるユーザーのリストが含まれています。 
OWNERSファイルはサブディレクトリに存在することもでき、そのサブディレクトリとその子孫のファイルのレビュー担当者または承認者として機能できるユーザーを上書きできます。
一般的なOWNERSファイルの詳細については、
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md)を参照してください。

さらに、個々のMarkdownファイルは、個々のGitHubユーザー名またはGitHubグループを一覧表示することにより、そのfront-matterでレビュー担当者と承認者を一覧表示できます。

OWNERSファイルとMarkdownファイルのfront-matterの組み合わせにより、PRの技術的および編集上のレビューを誰に依頼するかについてPRの所有者が自動化システムから得るアドバイスが決まります。

## マージの仕組み

Pull Requestがコンテンツの公開に使用されるブランチにマージされると、そのコンテンツは http://kubernetes.io に公開されます。
公開されたコンテンツの品質を高くするために、Pull RequestのマージはSIG Docsの承認者に限定しています。仕組みは次のとおりです。

- Pull Requestに`lgtm`ラベルと`approve`ラベルの両方があり、`hold`ラベルがなく、すべてのテストに合格すると、Pull Requestは自動的にマージされます。
- Kubernetes organizationのメンバーとSIG Docsの承認者はコメントを追加して、特定のPull Requestが自動的にマージされないようにすることができます（`/hold`コメントを追加するか、`/lgtm`コメントを保留します）。
- Kubernetesメンバーは誰でも、`/lgtm`コメントを追加することで`lgtm`ラベルを追加できます。
- `/approve`コメントを追加してPull Requestをマージできるのは、SIG Docsの承認者だけです。一部の承認者は、[PR Wrangler](/docs/contribute/participate/pr-wranglers/)や[SIG Docsのchairperson](#sig-docs-chairperson)など、追加の特定の役割も実行します。



## {{% heading "whatsnext" %}}

Kubernetesドキュメントへの貢献の詳細については、以下を参照してください：

- [Contributing new content](/docs/contribute/new-content/overview/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [ドキュメントスタイルの概要](/ja/docs/contribute/style/)
