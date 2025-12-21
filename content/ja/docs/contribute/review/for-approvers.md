---
title: approverとreviewer向けのレビュー
linktitle: approverとreviewer向け
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docsの[Reviewer(レビュアー)](/docs/contribute/participate/#reviewers)と[Approver(承認者)](/docs/contribute/participate/#approvers)は、変更をレビューする時にいくつか追加の作業を行います。

毎週、docsのメンバーの特定のapproverのボランティアは、pull requestのトリアージとレビューを担当します。この担当者は、その週の「PR Wrangler(PRの世話人)」と呼ばれます。詳しい情報は、[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)を参照してください。PR Wranglerになるには、週次のSIG Docsミーティングに参加し、ボランティアをします。もしその週にスケジュールされていなくても、活発なレビューが行われていないpull request(PR)をレビューすることは問題ありません。

このローテーションに加えて、変更されたファイルのオーナーに基づいて、botがPRにreviewerとapproverを割り当てます。

<!-- body -->

## PRをレビューする {#reviewing-a-pr}

Kubernetesのドキュメントは[Kubernetesコードレビュープロセス](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)に従います。

[pull requestのレビュー](/docs/contribute/review/reviewing-prs/)に書かれているすべてのことが適用されますが、ReviewerとApproverはそれに加えて次のことも行います。

- 必要に応じて、`/assign` Prowコマンドを使用して、特定のreviewerにPRを割り当てます。これは、コードのコントリビューターからの技術的なレビューが必要な場合には特に重要です。

  {{< note >}}
  技術的なレビューを行える人物を知るには、Markdownファイル上部にあるfront-matterの`reviewers`フィールドを確認してください。
  {{< /note >}}

- PRが[コンテンツ](/docs/contribute/style/content-guide/)および[スタイル](/docs/contribute/style/style-guide/)のガイドに従っていることを確認してください。従っていない場合は、作者にガイドの該当箇所へのリンクを示してください。
- PRの作者に変更を提案できるときは、GitHubの**Request Changes**(変更をリクエスト)オプションを利用してください。
- 提案したことが反映されたら、`/approve`や`/lgtm`コマンドを使用して、GitHubのレビューステータスを変更してください。

## 他の作者のPRにコミットを追加する {#commit-into-another-persons-pr}

PRにコメントを残すのは助けになりますが、まれに他の作者のPRに代わりにコミットを追加する必要がある場合があります。

あなたが明示的に作者から頼まれたり、長い間放置されたPRを蘇らせるような場合でない限り、他の作者のPRを「乗っ取る」ようなことはしないでください。短期的に見ればそのほうが短時間で終わるかもしれませんが、そのようなことをするとその人が貢献するチャンスを奪ってしまうことになります。

あなたが取る方法は、編集する必要のあるファイルがすでにPRのスコープに入っているか、あるいはPRがまだ触れていないファイルであるかによって変わります。

以下のいずれかが当てはまる場合、他の作者のPRにあなたがコミットを追加することはできません。

- PRの作者が自分のブランチを直接[https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)リポジトリにpushした場合。この場合、pushアクセス権限を持つreviewerしか他のユーザーのPRにコミットを追加することはできません。

  {{< note >}}
  次回PRを作成するとき、自分のブランチを自分のforkに対してpushするように作者に促してください。
  {{< /note >}}

- PRの作者が明示的にapproverからの編集を禁止している場合。

## レビュー向けのProwコマンド {#prow-commands-for-reviewing}

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)は、pull request(PR)に対してジョブを実行するKubernetesベースのCI/CDシステムです。Prowは、Kubernetes organization全体でチャットボットスタイルのコマンドを利用してGitHub actionsを扱えるようにします。たとえば、[ラベルの追加と削除](#adding-and-removing-issue-labels)、issueのクローズ、approverの割り当てなどが行なえます。Prowコマンドは、GitHubのコメントに`/<command-name>`という形式で入力します。

reviewerとapproverが最もよく使うprowコマンドには、以下のようなものがあります。

{{< table caption="Prow commands for reviewing" >}}
Prowコマンド | Roleの制限 | 説明
:------------|:------------------|:-----------
`/lgtm` | Organizationメンバー | PRのレビューが完了し、変更に納得したことを知らせる。
`/approve` | Approver | PRをマージすることを承認する。
`/assign` | 誰でも | PRのレビューまたは承認するひとを割り当てる。
`/close` | Organizationメンバー | issueまたはPRをクローズする。
`/hold` | 誰でも | `do-not-merge/hold`ラベルを追加して、自動的にマージできないPRであることを示す。
`/hold cancel` | 誰でも | `do-not-merge/hold`ラベルを削除する。
{{< /table >}}

PRで利用できるすべてのコマンドを確認するには、[Prowコマンドリファレンス](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite)を参照してください。

## issueのトリアージとカテゴリー分類 {#triage-and-categorize-issues}

一般に、SIG Docsは[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)のプロセスに従い、同じラベルを使用しています。

このGitHub issueの[フィルター](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)は、トリアージが必要な可能性があるissueを表示します。

### issueをトリアージする {#triaging-an-issue}

1. issueを検証する

   - issueがドキュメントのウェブサイトに関係するものであることを確かめる。質問に答えたりリソースの場所を報告者に教えることですぐに閉じられるissueもあります。詳しくは、[サポートリクエストまたはコードのバグレポート](#support-requests-or-code-bug-reports)のセクションを読んでください。
   - issueにメリットがあるかどうか評価します。
   - issueに行動を取るのに十分な詳細情報がない場合や、テンプレートが十分埋められていない場合は、`triage/needs-information`ラベルを追加します。
   - `lifecycle/stale`と`triage/needs-information`の両方のラベルがあるときは、issueをクローズします。

2. 優先度(priority)ラベルを追加する([issueトリアージガイドライン](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)は、priorityラベルについて詳しく定義しています。)

  {{< table caption="issueのラベル" >}}
  ラベル | 説明
  :------------|:------------------
  `priority/critical-urgent` | 今すぐに作業する。
  `priority/important-soon` | 3ヶ月以内に取り組む。
  `priority/important-longterm` | 6ヶ月以内に取り組む。
  `priority/backlog` | 無期限に延期可能。リソースに余裕がある時に取り組む。
  `priority/awaiting-more-evidence` | よいissueの可能性があるissueを見失わないようにするためのプレースホルダー。
  `help`または`good first issue` | KubernetesまたはSIG Docsでほとんど経験がない人に適したissue。より詳しい情報は、[Help WantedとGood First Issueラベル](https://kubernetes.dev/docs/guide/help-wanted/)を読んでください。

  {{< /table >}}

  あなたの裁量で、issueのオーナーシップを取り、issueに対するPRを提出してください(簡単なissueや、自分がすでに行った作業に関連するissueである場合は特に)。

issueのトリアージについて質問があるときは、Slackの`#sig-docs`か[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)で質問してください。

## issueラベルの追加と削除 {#adding-and-removing-issue-labels}

ラベルを追加するには、以下のいずれかの形式でコメントします。

- `/<label-to-add>`(たとえば、`/good-first-issue`)
- `/<label-category> <label-to-add>`(たとえば、`/triage needs-information`や`/language ja`)

ラベルを削除するには、以下のいずれかの形式でコメントします。

- `/remove-<label-to-remove>`(たとえば、`/remove-help`)
- `/remove-<label-category> <label-to-remove>`(たとえば、`/remove-triage needs-information`)

いずれの場合でも、ラベルは既存のものでなければなりません。存在しないラベルを追加しようとした場合、コマンドは無視されます。

すべてのラベル一覧は、[websiteリポジトリのラベルセクション](https://github.com/kubernetes/website/labels)で確認できます。
SIG Docsですべてのラベルが使われているわけではありません。

### issueのライフサイクルに関するラベル {#issue-lifecycle-labels}

issueは一般にオープン後に短期間でクローズされます。しかし、オープンされたものの非アクティブになるissueもあります。逆に、90日以上オープンのままにしておく必要があるissueもあります。

{{< table caption="issueのライブラリに関するラベル" >}}
ラベル | 説明
:------------|:------------------
`lifecycle/stale` | 90日間活動がない場合、issueは自動的にstaleとラベル付けされます。`/remove-lifecycle stale`コマンドを使って手動でlifecycleをリバートしない限り、issueは自動的にクローズされます。
`lifecycle/frozen` | このラベルが付けられたissueは、90日間活動がなくてもstaleになりません。`priority/important-longterm`ラベルを付けたissueなど、90日以上オープンにしておく必要があるissueには、このラベルを手動で追加します。
{{< /table >}}

## 特別な種類のissueに対処する {#handling-special-issue-types}

SIG Docsでは、対処方法をドキュメントに書いても良いくらい頻繁に、以下のような種類のissueに出会います。

### 重複したissue {#duplicate-issues}

1つの問題に対して1つ以上のissueがオープンしている場合、1つのissueに統合します。あなたはどちらのissueをオープンにしておくか(あるいは新しいissueを作成するか)を決断して、すべての関連する情報を移動し、関連するすべてのissueにリンクしなければなりません。最後に、同じ問題について書かれたすべての他のissueに`triage/duplicate`ラベルを付けて、それらをクローズします。作業対象のissueを1つだけにすることで、混乱を減らし、同じ問題に対して作業が重複することを避けられます。

### リンク切れに関するissue {#dead-link-issues}

リンク切れのissueがAPIまたは`kubectl`のドキュメントにあるものは、問題が完全に理解されるまでは`/priority critical-urgent`を割り当ててください。その他のすべてのリンク切れに関するissueには、手動で修正が必要であるため、`/priority important-longterm`を付けます。

### ブログに関するissue {#blog-issues}

[Kubernetesブログ](/blog/)のエントリは時間が経つと情報が古くなるものだと考えています。そのため、ブログのエントリは1年以内のものだけをメンテナンスします。1年以上前のブログエントリに関するissueは修正せずにクローズします。

PRをクローズするときに送信するメッセージの一部として、[記事の更新とメンテナンス](/docs/contribute/blog/#maintenance)へのリンクを含めて案内しても構いません。

関連する正当な理由がある場合には、例外を設けても問題ありません。

### サポートリクエストまたはコードのバグレポート {#support-requests-or-code-bug-reports}

一部のドキュメントのissueは、実際には元になっているコードの問題や、何か(たとえば、チュートリアル)がうまく動かないときにサポートをリクエストするものです。ドキュメントに関係のない問題は、`kind/support`ラベルを付け、サポートチャンネル(SlackやStack Overflowなど)へ報告者を導くコメントをして、もし関連があれば機能のバグに対するissueを報告するリポジトリ(`kubernetes/kubernetes`は始めるのに最適な場所です)を教えて、クローズします。

サポートリクエストに対する返答の例を示します。(リクエストを行うときは英語で行うことが想定されるため、英文とその日本語訳を記載しています)

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

```none
このissueは特定のドキュメントに関するissueではなく、サポートリクエストのようです。
Kubernetesに関する質問については、[Kubernetes slack](https://slack.k8s.io/)の
`#kubernetes-users`チャンネルに投稿することをおすすめします。同様の質問に対する回答を
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)などの
リソースで検索することもできます。

Kubernetesの機能に関するissueについては、https://github.com/kubernetes/kubernetes
でissueを作成できます。

もしこれがドキュメントに関するissueの場合、このissueを再びオープンしてください。
```

コードのバグに対する返答の例を示します。

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

```none
こちらのissueは、ドキュメントではなくコードに関係するissueのようです。
https://github.com/kubernetes/kubernetes/issues でissueを作成してください。

もしこれがドキュメントに関するissueの場合、このissueを再びオープンしてください。
```

### スカッシュを行う {#squashing}

approverとして、pull request(PR)をレビューするときに、次のような場合があります。

- コントリビューターにコミットをスカッシュするように伝えます。
- コントリビューターの代わりにコミットをスカッシュします。
- コントリビューターにまだスカッシュしないように伝えます。
- スカッシュができないようにします。

**コントリビューターにスカッシュを行うように伝える**: 新しいコントリビューターは、pull request(PR)でコミットをスカッシュする必要があることを知らない場合があります。このような場合は、スカッシュするように案内し、役立つ情報へのリンクを表示し、必要であればサポートを手配できることを伝えます。以下は役立つリンクの例です。

- ドキュメントコントリビューター向けの[pull requestを作成しコミットをスカッシュする](/docs/contribute/new-content/open-a-pr#squashing-commits)。
- 開発者向けのダイアグラムを含む[GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/)。

**コントリビューターの代わりにコミットをスカッシュする**: コントリビューターがコミットのスカッシュに困っている場合やPRをマージするまでに時間的に制約がある場合は、代わりにスカッシュを行うことができます。

- kubernetes/websiteリポジトリは[pull requestマージのためスカッシュを許可するように設定](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)されています。
  単純に*Squash commit*ボタンを選択します。
- PRの中でコントリビューターがメンテナーによるPR管理を有効にしている場合、メンテナーはコミットをスカッシュし、その結果をフォークに反映させることができます。スカッシュする前に、最新の変更を保存してPRにプッシュするように伝えます。スカッシュ後は、スカッシュされたコミットをローカルクローンにプルするように伝えます。
- GitHubにコミットをスカッシュさせるには、TideやGitHubがスカッシュを行うラベルを使うか、PRをマージするときに*Squash commit*ボタンをクリックします。

**コントリビューターにスカッシュを避けるように伝える**

- もし1つのコミットが不具合や望ましくない変更を含み、最後のコミットでそのエラーを元に戻している場合は、コミットをスカッシュしないでください。GitHubのPRの「Files changed」タブやNetlifyのプレビューでは問題がないように見えても、このPRをマージすると他の人に対してリベースやマージのコンフリクトを発生させる可能性があります。他のコントリビューターにリスクを与えないように適切に介入してください。

**決してスカッシュしないようにする**
- 翻訳を開始する場合や、新しいバージョンのドキュメントをリリースする場合など、ユーザーのフォークではないブランチをマージするときは、_決してコミットをスカッシュしないでください_。
これらのファイルについてはコミット履歴を保持する必要があるため、スカッシュしないことが重要です。