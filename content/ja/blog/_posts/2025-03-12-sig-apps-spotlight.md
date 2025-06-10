---
layout: blog
title: "SIG Appsの取り組みの紹介"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

SIG Spotlightシリーズでは、さまざまなSpecial Interest Group(SIG)のリーダーへのインタビューを通じて、Kubernetesプロジェクトの核心に迫ります。
今回は、Kubernetes上におけるアプリケーションの開発、デプロイ、運用に関連するすべてを担当するグループである **[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)** を取り上げます。
[Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)([DevZero](https://www.devzero.io/))は、SIG Appsのチェアおよびテックリードである[Maciej
Szulik](https://github.com/soltysh)([Defense Unicorns](https://defenseunicorns.com/))と[Janet
Kuo](https://github.com/janetkuo)([Google](https://about.google/))にインタビューする機会を得ることができました。
彼らは、Kubernetesエコシステムにおけるアプリケーション管理の経験、課題、そして将来のビジョンについて共有してくれました。

## はじめに

**Sandipan: こんにちは。まずはご自身について、現在の役割や、SIG Appsにおける現在の役職に至るまでのKubernetesコミュニティでの歩みについて教えていただけますか？**

**Maciej**: こんにちは。SIG Appsのリードを務めるMaciejです。この役割に加えて、[SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme)でも活動しており、Steering Committeeメンバーのひとりでもあります。私は2014年後半から、コントローラー、apiserver、kubectlを含むさまざまな領域でKubernetesに貢献してきました。

**Janet**: もちろんです！私はJanetです。Googleでスタッフソフトウェアエンジニアを務めており、Kubernetesプロジェクトには初期の段階、2015年のバージョン1.0のリリース以前から深く関わってきました。これまでの道のりは本当に素晴らしいものでした！

Kubernetesコミュニティにおける私の現在の役割は、SIG Appsのチェア兼テックリードの一人です。SIG Appsとの関わりは自然な流れで始まりました。
私はまず、Deployment APIの構築やローリングアップデート機能の追加に取り組みました。
その中で自然とSIG Appsに引き寄せられ、次第に関与を深めていきました。
時が経つにつれて、より多くの責任を担うようになり、現在のリーダーシップの役割を務めるに至りました。

## SIG Appsについて

*以下の回答はすべてMaciejとJanetの共同によるものです。*

**Sandipan: ご存じない方のために、SIG Appsの使命と目的について概要を教えていただけますか？Kubernetesエコシステムの中で、どのような主要な課題の解決を目指しているのでしょうか？**

[charter](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope)に記載されているとおり、私たちはKubernetes上でアプリケーションを開発、デプロイ、運用することに関連する幅広い領域をカバーしています。
簡単に言えば、隔週で開催しているミーティングには誰でも自由に参加でき、Kubernetes上でアプリケーションを記述・デプロイする際の良かった点や困った点について議論することができます。

**Sandipan: 現在、SIG Appsが取り組んでいる最も重要なプロジェクトやイニシアチブにはどのようなものがありますか？**

現時点において、私たちのコントローラー開発を推進している主な要素は、さまざまなAI関連のワークロードを実行する際に生じる課題です。
ここで、私たちが過去数年間に渡って支援してきた2つのワーキンググループについて言及する価値があります。

1. [The Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch): Kubernetes上でHPC、AI/ML、データ分析ジョブを実行することに取り組んでいます。

2. [The Serving Working Group](https://github.com/kubernetes/community/tree/master/wg-serving): ハードウェアアクセラレーションを用いたAI/ML推論に焦点を当てています。

## ベストプラクティスと課題

**Sandipan: SIG Appsは、Kubernetesにおけるアプリケーション管理のベストプラクティスの策定において重要な役割を担っています。これらのベストプラクティスの一部と、それがアプリケーションのライフサイクル管理にどのように役立つかを教えていただけますか？**

1. [ヘルスチェックとReadiness Probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)を実装することで、アプリケーションが正常であり、トラフィックを処理する準備ができていることを確認できます。これにより、信頼性と稼働時間が向上します。これらに加えて、包括的なログ出力、モニタリング、トレーシングのソリューションを組み合わせることで、アプリケーションの動作に関するインサイトを得ることができ、問題の特定と解決を迅速に行うことが可能になります。

2. リソース使用量やカスタムメトリクスに基づいて[アプリケーションをオートスケール](/ja/docs/concepts/workloads/autoscaling/)することで、リソースの使用を最適化し、変動する負荷に対応できるようにします。

3. ステートレスなアプリケーションにはDeploymentを、ステートフルなアプリケーションにはStatefulSetを、バッチワークロードにはJobやCronJobを、各ノードでデーモンを実行するにはDaemonSetを使用してください。また、OperatorやCRDを活用してKubernetes APIを拡張することで、複雑なアプリケーションのデプロイ・管理・ライフサイクルを自動化でき、運用が容易になり、手動による介入を減らすことができます。

**Sandipan: SIG Appsが直面している一般的な課題にはどのようなものがありますか？また、それに対してどのように対処していますか？**

私たちが常に直面している最大の課題は、多くの機能、アイデア、改善提案を却下しなければならないという点です。こうした判断の背景にある理由を説明するには、多くの規律と忍耐が必要となります。

**Sandipan: Kubernetesの進化はSIG Appsの活動にどのような影響を与えましたか？最近の変更や今後の機能の中で、SIG Appsにとって特に関連性が高い、あるいは有益だと考えるものはありますか？**

SIG Appsに関わる私たち自身、そしてコミュニティ全体にとっての主な利点は、[カスタムリソース](https://kubernetes.io/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)によってKubernetesを拡張できることです。
また、ユーザーが組み込みのコントローラーを活用して独自のカスタムコントローラーを構築し、私たちコアメンテナーが考慮していなかった、あるいはKubernetes内で効率的に対応できなかった高度なユースケースを実現できる点も重要です。

## SIG Appsへの貢献

**Sandipan: SIG Appsに関わりたいと考えている新しいコントリビューターには、どのような機会がありますか？また、どのようなアドバイスがありますか？**

「最初に取り組むのにおすすめのissueはありますか？」という質問はとてもよく寄せられます:-)
しかし、残念ながら簡単に答えられるものではありません。
私たちはいつも、「コアコントローラーへの貢献を始める最善の方法は、しばらく時間をかけて取り組みたいと思えるコントローラーを見つけることです」と皆さんに伝えています。
そのコントローラーのコードを読み、ユニットテストや統合テストを実行してみてください。
一度、全体の仕組みを理解できたら、あえて壊してみて、テストが失敗することを確認するのもよいでしょう。
その特定のコントローラーについて理解が深まり、自信がついてきたら、そのコントローラーに関連するオープンなissueを探してみるとよいでしょう。ユーザーが直面している問題について説明を加えたり、改善案を提案したり、あるいは最初の修正に挑戦してみるのも良いかもしれません。

先ほど述べたとおり、この道に近道はありません。
私たちが現在の状態に至るまでに徐々に積み重ねてきたすべてのエッジケースを理解するためには、コードベースと向き合って時間をかける必要があります。
1つのコントローラーでうまくいったら、そのプロセスを他のコントローラーでも再び繰り返す必要があります。

**Sandipan: SIG Appsはコミュニティからどのようにフィードバックを収集しており、それをどのように活動へ反映しているのでしょうか？**

私たちは常に、隔週で開催している[ミーティング](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)に参加し、ご自身の課題や解決策を発表していただくよう、皆さんに奨励しています。
Kubernetes上で興味深い問題に取り組んでおり、コアコントローラーに関する有用なフィードバックを提供できるのであれば、どなたからの声でも常に歓迎しています。

## 今後の展望

**Sandipan: 今後を見据えたとき、Kubernetesにおけるアプリケーション管理に関して、SIG Appsが注目している主要な注力領域や今後のトレンドにはどのようなものがありますか？SIGはそれらのトレンドにどのように適応しているのでしょうか？**

間違いなく、現在のAIブームが最大の推進要因です。
前述のとおり、私たちはそれぞれ異なる側面を扱う2つのワーキンググループを有しています。

**Sandipan: このSIGに関して、気に入っている点があれば教えてください。**

間違いなく、ミーティングや[Slack](https://kubernetes.slack.com/messages/sig-apps)に参加してくれている人々です。
彼らは、課題のトリアージやプルリクエストに絶え間なく貢献し、Kubernetesを素晴らしいものにするために(非常に頻繁に私的な時間を使って)多くの時間を費やしてくれています！

---

SIG Appsは、Kubernetesコミュニティにおける必要不可欠な構成要素であり、大規模なアプリケーションのデプロイと管理のあり方を形成する役割を担っています。
KubernetesのワークロードAPIの改善から、AI/MLアプリケーション管理におけるイノベーションの推進まで、SIG Appsは絶え間なく現代のアプリケーション開発者および運用者のニーズに応え続けています。
新しいコントリビューターであっても、経験豊富な開発者であっても、関与し、貢献する機会は常に存在します。

SIG Appsについてさらに学びたい方や、貢献に関心のある方は、[SIG README](https://github.com/kubernetes/community/tree/master/sig-apps)をご確認のうえ、隔週で開催されている[ミーティング](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)にぜひご参加ください。

- [SIG Appsメーリングリスト](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG AppsのSlackチャンネル](https://kubernetes.slack.com/messages/sig-apps)
