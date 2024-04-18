---
content_type: concept
title: Kubernetesのドキュメントに貢献する
weight: 09
card:
  name: 貢献
  weight: 11
  title: Kubernetesのドキュメントに貢献する
---


このウェブサイトは[Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs)が管理しています。
Kubernetesプロジェクトは初心者でも経験者でも、全てのコントリビューターからの改善を歓迎しています！

Kubernetesドキュメントコントリビューターは

- 既存のコンテンツを改善します
- 新しいコンテンツを作成します
- ドキュメントを翻訳します
- Kubernetesリリースサイクルの一部としてドキュメントを管理・公開します

---

{{< note >}}
Kubernetesへの貢献について総合的に知りたい場合は、[contributor documentation](https://www.kubernetes.dev/docs/)を参照してください。
{{< /note >}}

<!-- body -->

## はじめに

どなたでも、問題を説明するissueや、ドキュメントの改善を求めるissueを作成し、[`kubernetes/website` GitHubリポジトリ](https://github.com/kubernetes/website)に対するプルリクエスト(PR)を用いて変更に貢献することができます。
Kubernetesコミュニティで効果的に働くためには、[git](https://git-scm.com/)と[GitHub](https://skills.github.com/)を基本的に使いこなせる必要があります。

ドキュメンテーションに関わるには:

1. CNCFの[Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md)にサインしてください。
2. [ドキュメンテーションのリポジトリ](https://github.com/kubernetes/website)と、ウェブサイトの[静的サイトジェネレーター](https://gohugo.io)に慣れ親しんでください。
3. [プルリクエストのオープン](/docs/contribute/new-content/open-a-pr/)と[変更レビュー](/ja/docs/contribute/review/reviewing-prs/)の基本的なプロセスを理解していることを確認してください。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[プルリクエストのオープン]
direction TB
U[ ] -.-
Q[コンテンツを改善する] --- N[コンテンツを作成する]
N --- O[ドキュメントを翻訳する]
O --- P[k8sリリースサイクルの <br>ドキュメントを管理する]

end

subgraph second[レビュー]
direction TB
   T[ ] -.-
   D[kubernetes/website <br>リポジトリを確認する] --- E[静的サイトジェネレーター <br>Hugoを確認する]
   E --- F[基本的なGitHubの <br>コマンドを理解する]
   F --- G[オープンした <br>プルリクエストを確認し <br>レビュープロセスを見直す]
end

subgraph first[サインアップ]
    direction TB
    S[ ] -.-
    B[CNCFの <br>コントリビューターライセンス <br>サインに署名する] --- C[Slackチャンネル <br>sig-docs に<br>参加する]
    C --- V[kubernetes-sig-docsの<br> メーリングリストに <br>参加する]
    V --- M[毎週開催している <br>sig-docs callsや<br> slack callsに <br>参加する]
end

A([fa:fa-user 新たな<br>コントリビューター]) --> first
A --> second
A --> third
A --> H[質問をする!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
図1. 新たなコントリビューターのためのスタートガイド。

図1は新たなコントリビューターのためのロードマップを概説しています。`サインアップ`や`レビュー`のステップのいくつか、またはその全てに従えばよいです。これで、`プルリクエストのオープン`の下にリストされているいくつかの貢献目標を達成するためのプルリクエストを開く準備が整いました。また、質問はいつでも歓迎です！

一部のタスクでは、Kubernetes organizationで、より多くの信頼とアクセス権限が必要です。
役割と権限についての詳細は、[SIG Docsへの参加](/ja/docs/contribute/participate/)を参照してください。

## はじめての貢献

あらかじめいくつかのステップを見直すことで、最初の貢献に備えることができます。図2はそれらのステップの概説で、詳細は次のとおりです。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[はじめての貢献]
    direction TB
    S[ ] -.-
    G[K8sメンバーからの <br>PRレビューを受ける] -->
    A[最初のPRを作成するための <br>良いissueを <br>kubernetes/websiteから探す] --> B[PRをオープンする!!]
    end
    subgraph first[推奨される準備]
    direction TB
       T[ ] -.-
       D[コントリビューターの概要を読む] -->E[K8sのコンテンツと<br> スタイルガイドを読む]
       E --> F[Hugoのページコンテンツタイプと <br>ショートコードについて学ぶ]
    end


    first ----> second


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
図2. はじめての貢献のための準備。

- 貢献のための複数の方法について学ぶために[貢献の概要](/ja/docs/contribute/new-content/)を読んでください。
- 良い開始地点を探すために[`kubernetes/website` のissueリスト](https://github.com/kubernetes/website/issues/)を確認してください。
- 既存のドキュメントに対して[GitHubを使ってプルリクエストを作成](/docs/contribute/new-content/open-a-pr/#changes-using-github)し、GitHubへのissueの登録について学んでください。
- 正確さと言語の校正のため、他のKubernetesコミュニティメンバーから[プルリクエストのレビュー](/docs/contribute/review/reviewing-prs/)を受けてください。
- 見識のあるコメントを残せるようにするため、Kubernetesの[コンテンツ](/ja/docs/contribute/style/content-guide/)と[スタイルガイド](/docs/contribute/style/style-guide/)を読んでください。
- [ページコンテンツの種類](/docs/contribute/style/page-content-types/)と[Hugoショートコード](/docs/contribute/style/hugo-shortcodes/)について勉強してください。

## 貢献時の支援の受け方

はじめて貢献を行うのは大変なことかもしれません。[新規コントリビューターのためのアンバサダー](https://github.com/kubernetes/website#new-contributor-ambassadors)は、最初の数回の貢献を行う手助けをしてくれます。[Kubernetes Slack](https://slack.k8s.io/)で、特に`#sig-docs`チャンネルを用いて連絡を取ることができます。また毎月第一火曜日に行われる[新規コントリビューターのための歓迎会](https://www.kubernetes.dev/resources/calendar/)もあります。ここで新規コントリビューターのアンバサダーと交流し、質問に答えてもらうことができます。

訳注: 日本語ローカライゼーションに関しては、Slackの`kubernetes-docs-ja`チャンネルを利用してください。

## 次のステップ

- リポジトリの[ローカルクローンでの作業](/docs/contribute/new-content/open-a-pr/#fork-the-repo)について学んでください。
- [リリース機能](/docs/contribute/new-content/new-features/)について記載してください。
- [SIG Docs](/ja/docs/contribute/participate/)に参加し、[memberやreviewer](/docs/contribute/participate/roles-and-responsibilities/)になってください。
- [国際化](/ja/docs/contribute/localization/)を始めたり、支援したりしてください。

## SIG Docsに参加する

[SIG Docs](/ja/docs/contribute/participate/)はKubernetesのドキュメントとウェブサイトを公開・管理するコントリビューターのグループです。SIG Docsに参加することはKubernetesコントリビューター(機能開発でもそれ以外でも)にとってKubernetesプロジェクトに大きな影響を与える素晴らしい方法の一つです。

SIG Docsは複数の方法でコミュニケーションをとっています。

- [Kubernetes Slackインスタンスの`#sig-docs`に参加してください](https://slack.k8s.io/)。自己紹介を忘れずに！
  - 訳注: 日本語ローカライゼーションに関しては、Slackの`kubernetes-docs-ja`チャンネルを利用してください。
- [`kubernetes-sig-docs`メーリングリストに参加してください](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)。ここでは幅広い議論が起こり、公式な決定が記録されます。
- [毎週のSIG Docsビデオミーティング](https://github.com/kubernetes/community/tree/master/sig-docs)に参加してください。ミーティングは `#sig-docs`でアナウンスされ、[Kubernetesコミュニティミーティングカレンダー](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)に追加されます。[Zoomクライアント](https://zoom.us/download)をダウンロードするか、電話を使って通話する必要があります。

## その他の貢献方法

- [Kubernetesコミュニティサイト](/community/)を訪問してください。TwitterやStack Overflowに参加したり、Kubernetesの集会やイベントについて学んだりしてください。
- 機能開発に貢献したい方は、まずはじめに[Kubernetesコントリビューターチートシート](https://github.com/kubernetes/community/blob/master/contributors/guide/contributor-cheatsheet/README-ja.md)を読んでください。
- [Kubernetesのコントリビューター](https://www.kubernetes.dev/)や[追加のコントリビューター向けリソース](https://www.kubernetes.dev/resources/)についてもっと学ぶために、コントリビューターサイトを読んでください。
- [ブログ記事やケーススタディ](/docs/contribute/new-content/blogs-case-studies/)を投稿してください。
