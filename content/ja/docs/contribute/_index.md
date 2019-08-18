---
content_template: templates/concept
title: ドキュメントにのコントリビュートする
linktitle: Contribute
main_menu: true
weight: 80
---

{{% capture overview %}}

Kubernetesのドキュメントやウェブサイトにコントリビュートしていただけるのは非常に喜ばしいことです。初心者の方や久しぶりの方、エンドユーザー、typoを見て耐えられない人でも、どなたでもお手伝いいただけます。

Kubernetesドキュメントのスタイルガイドに関する詳細は、[スタイルガイド](/docs/contribute/style/style-guide/)をご覧ください。

{{% capture body %}}

## ドキュメントコントリビューターの種類

- Kubernetesオーガナイゼーションの _メンバー_ は、[CLAに署名](/docs/contribute/start#sign-the-cla)を行っていて、プロジェクトにコントリビュートを何回かしたことがある人のことです。具体的な基準については[コミュニティメンバーシップ](https://github.com/kubernetes/community/blob/master/community-membership.md)をご覧ください。
- SIG Docsの _レビュアー_ は、Kubernetesオーガナイゼーションのメンバーの中でも、ドキュメントのPull Requestへのレビューへの興味を表明し、SIG Docsの承認者によって適切なGitHubグループ内の`OWNERS`ファイル内に名前が追加されている人のことを言います。
- SIG Docsの _承認者_ は、プロジェクトに対して継続的に貢献してきた優秀なメンバーです。承認者は、KubernetesのOrganizationに代わってPull Requestをマージし、コンテンツを公開できます。また、より大きなKubernetesコミュニティにおいてSIG Docsを代表することもできます。SIG Docsにおける承認者の職務の一部は、リリースの調整など、かなりの時間を要するものもあります。

## ドキュメントへのコントリビュートの仕方

このリストでは、コントリビュートするにあたってどなたでもできること、Kubernetes Organizationのメンバーができることに加え、より高いレベルのアクセスと、SIG Docsの周辺知識を必要とすることをそれぞれ分類しています。
時間をかけて一貫してコントリビュートすることは、ツールやすでに方針が示された組織の決定の一部を理解するのに役立ちます。

こちらは、Kubernetesのドキュメントに貢献できる方法の完全なリストではありませんが、開始にあたっては役に立つはずです。

- [全員](/docs/contribute/start/)
  - 対応内容が明確なIssueを建てる
- [メンバー](/docs/contribute/start/)
  - 既存のドキュメントを改善する
  - 改善のアイデアを[Slack](http://slack.k8s.io/)や[SIG docsのメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)で提起する
  - ドキュメントのアクセシビリティを改善する
  - Pull Requestに対して提案レベルのフィードバックを提供する
  - ブログやケーススタディの記事を書く
- [レビュアー](/docs/contribute/intermediate/)
  - 新しい機能のドキュメントを作成する
  - Issueの分類と優先度を付ける
  - Pull Reqeustをレビューする
  - ダイアグラム、画像アセット、ドキュメントに組み込むスクリーンキャストや動画を作成する
  - ローカライゼーション
  - Docsの代表者として他リポジトリへのコントリビュートを行う
  - コード中のUI部分の文字列などを修正する
  - コード中のコメントやGodocなどを改善する
- [承認者](/docs/contribute/advanced/)
  - Pull Reqeustを承認、マージしてコントリビュートされたコンテンツの公開を行う
  - Docsの代表者としてKubernetesのリリースチームに参加する
  - スタイルガイドに改善の提案をする
  - Docsのテストに改善の提案をする
  - KubernetesのWebサイトや周辺ツールに改善の提案をする

## コントリビュートするための追加の方法

- TwitterやStack Overflowのようなオンラインのフォーラムを通じてKubernetesコミュニティにコントリビュートしたり、各地域のローカルミートアップやKubernetesに関するイベントについて学ぶには、[Kubernetesコミュニティサイト](/community/)をご覧ください。
- 機能開発にコントリビュートを開始する場合は、[コントリビューターチートシート](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)をご覧ください。

{{% /capture %}}
