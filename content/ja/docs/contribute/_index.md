---
content_type: concept
title: K8sのドキュメントに貢献する
linktitle: 貢献
main_menu: true
no_list: true
weight: 80
card:
  name: 貢献
  weight: 10
  title: K8sへの貢献を始める
---

<!-- overview -->

*Kubernetesは初心者でも経験者でも、全てのコントリビューターからの改善を歓迎しています！*

{{< note >}}
Kubernetesへの貢献について総合的に知りたい場合は、[contributor documentation](https://www.kubernetes.dev/docs/)を参照してください。

You can also read the
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}
[page](https://contribute.cncf.io/contributors/projects/#kubernetes)
about contributing to Kubernetes.
{{< /note >}}

---

このウェブサイトは[Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs)が管理しています。

Kubernetesドキュメントコントリビューターは

- 既存のコンテンツを改善します
- 新しいコンテンツを作成します
- ドキュメントを翻訳します
- Kubernetesリリースサイクルの一部としてドキュメントを管理・公開します

<!-- body -->

## はじめに

どなたでも、問題を説明するissueや、ドキュメントの改善を求めるissueを作成し、[`kubernetes/website` GitHub リポジトリ](https://github.com/kubernetes/website)に対するプルリクエスト(PR)を用いて変更に貢献することができます。
Kubernetesコミュニティで効果的に働くためには、[git](https://git-scm.com/)と[GitHub](https://lab.github.com/)を基本的に使いこなせる必要があります。

ドキュメンテーションに関わるには:

1. CNCFの[Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md)にサインしてください。
2. [ドキュメンテーションのリポジトリー](https://github.com/kubernetes/website)と、ウェブサイトの[静的サイトジェネレーター](https://gohugo.io)に慣れ親しんでください。
3. [プルリクエストのオープン](/docs/contribute/new-content/open-a-pr/)と[変更レビュー](/ja/docs/contribute/review/reviewing-prs/)の基本的なプロセスを理解していることを確認してください。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[Open PR]
direction TB
U[ ] -.-
Q[Improve content] --- N[Create content]
N --- O[Translate docs]
O --- P[Manage/publish docs parts<br>of K8s release cycle]

end

subgraph second[Review]
direction TB
   T[ ] -.-
   D[Look over the<br>kubernetes/website<br>repository] --- E[Check out the<br>Hugo static site<br>generator]
   E --- F[Understand basic<br>GitHub commands]
   F --- G[Review open PR<br>and change review <br>processes]
end

subgraph first[Sign up]
    direction TB
    S[ ] -.-
    B[Sign the CNCF<br>Contributor<br>License Agreement] --- C[Join sig-docs<br>Slack channel]
    C --- V[Join kubernetes-sig-docs<br>mailing list]
    V --- M[Attend weekly<br>sig-docs calls<br>or slack meetings]
end

A([fa:fa-user New<br>Contributor]) --> first
A --> second
A --> third
A --> H[Ask Questions!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Figure 1. Getting started for a new contributor.

Figure 1 outlines a roadmap for new contributors. You can follow some or all of the steps for `Sign up` and `Review`. Now you are ready to open PRs that achieve your contribution objectives with some listed under `Open PR`. Again, questions are always welcome!

一部のタスクでは、Kubernetes organizationで、より多くの信頼とアクセス権限が必要です。
役割と権限についての詳細は、[SIG Docsへの参加](/ja/docs/contribute/participate/)を参照してください。

## はじめての貢献

You can prepare for your first contribution by reviewing several steps beforehand. Figure 2 outlines the steps and the details follow.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[First Contribution]
    direction TB
    S[ ] -.-
    G[Review PRs from other<br>K8s members] -->
    A[Check kubernetes/website<br>issues list for<br>good first PRs] --> B[Open a PR!!]
    end
    subgraph first[Suggested Prep]
    direction TB
       T[ ] -.-
       D[Read contribution overview] -->E[Read K8s content<br>and style guides]
       E --> F[Learn about Hugo page<br>content types<br>and shortcodes]
    end


    first ----> second


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Figure 2. Preparation for your first contribution.

- 貢献のための複数の方法について学ぶために[貢献の概要](/ja/docs/contribute/new-content/overview/)を読んでください。
- 良い開始地点を探すために[`kubernetes/website` issueリスト](https://github.com/kubernetes/website/issues/)を確認してください。
- 既存のドキュメントに対して[GitHubを使ってプルリクエストをオープン](/docs/contribute/new-content/open-a-pr/#changes-using-github)し、GitHubへのissueの登録について学んでください。
- 正確さと言語の校正のため、他のKubernetesコミュニティメンバーから[プルリクエストのレビュー](/docs/contribute/review/reviewing-prs/)を受けてください。
- 見識のあるコメントを残せるようにするため、Kubernetesの[コンテンツ](/ja/docs/contribute/style/content-guide/)と[スタイルガイド](/docs/contribute/style/style-guide/)を読んでください。
- [ページコンテンツの種類](/docs/contribute/style/page-content-types/)と[Hugoショートコード](/docs/contribute/style/hugo-shortcodes/)について勉強してください。

## Getting help when contributing

Making your first contribution can be overwhelming. The [New Contributor Ambassadors](https://github.com/kubernetes/website#new-contributor-ambassadors) are there to walk you through making your first few contributions. You can reach out to them in the [Kubernetes Slack](https://slack.k8s.io/) preferably in the `#sig-docs` channel. There is also the [New Contributors Meet and Greet call](https://www.kubernetes.dev/resources/calendar/) that happens on the first Tuesday of every month. You can interact with the New Contributor Ambassadors and get your queries resolved here.

## 次のステップ

- リポジトリの[ローカルクローンでの作業](/docs/contribute/new-content/open-a-pr/#fork-the-repo)について学んでください。
- [リリース機能](/docs/contribute/new-content/new-features/)について記載してください。
- [SIG Docs](/ja/docs/contribute/participate/)に参加し、[memberやreviewer](/docs/contribute/participate/roles-and-responsibilities/)になってください。
- [国際化](/ja/docs/contribute/localization/)を始めたり、支援したりしてください。

## SIG Docsに参加する

[SIG Docs](/ja/docs/contribute/participate/)はKubernetesのドキュメントとウェブサイトを公開・管理するコントリビューターのグループです。SIG Docsに参加することはKubernetesコントリビューター（機能開発でもそれ以外でも）にとってKubernetesプロジェクトに大きな影響を与える素晴らしい方法の一つです。

SIG Docsは複数の方法でコミュニケーションをとっています。

- [Kubernetes Slackインスタンスの`#sig-docs`に参加してください](https://slack.k8s.io/)。自己紹介を忘れずに！
- [`kubernetes-sig-docs`メーリングリストに参加してください](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)。ここでは幅広い議論が起こり、公式な決定が記録されます。
- [毎週のSIG Docsビデオミーティング](https://github.com/kubernetes/community/tree/master/sig-docs)に参加してください。ミーティングは `#sig-docs`でアナウンスされ、[Kubernetesコミュニティミーティングカレンダー](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)に追加されます。[Zoomクライアント](https://zoom.us/download)をダウンロードするか、電話を使って通話する必要があります。

## その他の貢献方法

- [Kubernetesコミュニティサイト](/community/)を訪問してください。TwitterやStack Overflowに参加したり、Kubernetesの集会やイベントについて学んだりしてください。
- 機能開発に貢献したい方は、まずはじめに[Kubernetesコントリビューターチートシート](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)を読んでください。
- Visit the contributor site to learn more about [Kubernetes Contributors](https://www.kubernetes.dev/) and [additional contributor resources](https://www.kubernetes.dev/resources/).
- [ブログ記事やケーススタディ](/docs/contribute/new-content/blogs-case-studies/)を投稿してください。
