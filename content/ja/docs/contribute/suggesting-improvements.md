---
title: コンテンツの改善を提案する
slug: suggest-improvements
content_type: concept
weight: 10
card:
  name: contribute
  weight: 20
---

<!-- overview -->

Kubernetesのドキュメントに何か問題を見つけたり、新しいコンテンツに関してアイデアを思い付いたときは、issueを作ってください。必要なものは、[GitHubアカウント](https://github.com/join)とウェブブラウザーだけです。

Kubernetesのドキュメント上の新しい作業は、ほとんどの場合、GitHubのissueから始まります。Kubernetesのコントリビューターは、必要に応じてレビュー、分類、タグ付けを行います。次に、あなたやKubernetesコミュニティの他のメンバーが、そのissueを解決するための変更を加えるpull requestを開きます。

<!-- body -->

## issueを作る

既存のコンテンツに対して改善を提案したい場合や、間違いを発見した場合は、issueを作ってください。

1. ページの右側のサイドバーにある**ドキュメントのissueを作成**ボタンをクリックします。GitHubのissueページにリダイレクトし、一部のヘッダーが自動的に挿入されます。
2. 問題や改善の提案について書きます。できる限り多くの詳細情報を提供するようにしてください。
3. **Submit new issue**ボタンをクリックします。

送信後、定期的にissueを確認するか、GitHubの通知を設定してください。レビュアや他のコミュニティメンバーが、issueに対して作業を行うために、あなたに何か質問をするかもしれません。

## 新しいコンテンツの提案

新しいコンテンツに関するアイデアがあるものの、どの場所に追加すればわからないときでも、issueを作ることができます。次のいずれかを選択して行ってください。

- コンテンツが追加されるべきだと思う既存のページを選択し、**ドキュメントのissueを作成**ボタンをクリックする。
- [GitHub](https://github.com/kubernetes/website/issues/new/)に移動し、直接issueを作る。

## よいissueを作るには

issueを作るときは、以下のことを心に留めてください。

- 明確なissueの説明を書く。不足している点、古くなっている点、誤っている点、改善が必要な点など、どの点がそうであるか明確に書く。
- issueがユーザーに与える具体的な影響を説明する。
- 合理的な作業単位になるように、特定のissueのスコープを制限する。スコープの大きな問題については、小さな複数のissueに分割する。たとえば、"Fix the security docs"(セキュリティのドキュメントを修正する)というのはスコープが大きすぎますが、"Add details to the 'Restricting network access' topic"(トピック「ネットワークアクセスの制限」に詳細情報を追加する)であれば十分に作業可能な大きさです。
- すでにあるissueを検索し、関連または同様のissueがないかどうか確認する。
- 新しいissueがほかのissueやpull requestと関係する場合は、完全なURLを参照するか、issueやpull requestの数字の前に`#`の文字を付けて参照する。例えば、`Introduced by #987654`のように書きます。
- [行動規範](/ja/community/code-of-conduct/)に従って、仲間のコントリビューターに敬意を払いましょう。たとえば、"The docs are terrible"(このドキュメントは最悪だ)のようなコメントは、役に立つ敬意のあるフィードバックではありません。
