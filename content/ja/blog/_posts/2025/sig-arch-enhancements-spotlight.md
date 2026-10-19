---
layout: blog
title: "SIG Architecture: Enhancementsの取り組みの紹介"
slug: sig-architecture-enhancements
canonicalUrl: https://www.kubernetes.dev/blog/2025/01/21/sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

_これは、SIG Architecture Spotlightシリーズの第4回目のインタビューであり、今後もさまざまなサブプロジェクトを取り上げる予定です。
今回は、[SIG Architecture:
Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)を特集します。_

このSIG Architecture Spotlightでは、Enhancementsサブプロジェクトのリードである[Kirsten
Garrison](https://github.com/kikisdeliveryservice)さんにお話を伺いました。

## Enhancementsサブプロジェクト

**Frederico(FSM): Kirstenさん、Enhancementsサブプロジェクトについてお話しできる機会をいただき、とてもうれしく思います。
まずは簡単に自己紹介とご自身の役割について教えてください。**

**Kirsten Garrison(KG)**: 私はSIG-ArchitectureのEnhancementsサブプロジェクトのリードを務めており、現在はGoogleに勤務しています。
最初は[Carolyn Van Slyck](https://github.com/carolynvs)さんの助けを借りながら、service-catalogプロジェクトへのコントリビュートを通じて関わり始めました。
その後、[リリースチームに参加し](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)、最終的にEnhancementsのリードおよびRelease Leadの補佐を務めることになりました。
リリースチームでは、私のチームの経験に基づき、各SIGやEnhancementsチームにとってより良いプロセスとなるよう(オプトインプロセスなどの)いくつかのアイデアに取り組みました。
最終的には、サブプロジェクトのミーティングに参加し、その作業にも貢献するようになりました。

**FSM: Enhancementsサブプロジェクトについて言及されていましたが、その主な目的や関与する領域について説明していただけますか？**

**KG**: [Enhancementsサブプロジェクト](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)は、主に[Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)(略して _KEP_)を扱っています。
KEPは、Kubernetesプロジェクトにおけるすべての新機能および重要な変更に必要となる「設計」ドキュメントです。

## KEPとその影響

**FSM: KEPプロセスの改善は、かつてから(そして現在も)、SIG Architectureが深く関与している取り組みの一つです。
このプロセスについて知らない方のために、説明していただけますか？**

**KG**: [各リリース](https://kubernetes.io/releases/release/#the-release-cycle)において、各SIGはそのリリースに含めたいと考えている機能をリリースチームに共有します。
先ほど述べたとおり、これらの変更の前提となるのがKEPです。
KEPは標準化された設計ドキュメントであり、すべての作成者がリリースサイクルの最初の数週間で記入し、承認されなければなりません。
ほとんどの機能は、alpha、beta、最終的にはGAという[3つのフェーズを経て進行します](https://kubernetes.io/ja/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)。
そのため、機能を承認するということは、SIGにとって大きな責任を伴う決定となります。

KEPは、ある機能に関する唯一の信頼できる情報源としての役割があります。
[KEPテンプレート](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)には、機能がどの段階にいるかに応じて異なる要件がありますが、一般的には設計や影響についての詳細な議論、安定性やパフォーマンスに関する成果物の提示が求められます。
KEPが承認されるまでには、作成者、SIGのレビュアー、APIレビューチーム、Production Readiness Reviewチーム[^1]との間でかなりの反復的なやり取りが必要となります。
各レビュアーチームは、Kubernetesリリースが安定し、パフォーマンスに優れたものとなるよう、その提案が自分たちの基準を満たしているかを確認します。
すべての承認が得られて初めて作成者は次に進むことができ、Kubernetesのコードベースに自身の機能をマージすることができます。

**FSM: なるほど、かなり多くの枠組みが追加されたのですね。
振り返ってみて、そのアプローチによる最も重要な改善点は何だったと思いますか？**

**KG**: 概して、最も大きな影響を与えた改善点は、KEPの本来の意図に焦点を当てたことだと考えています。
KEPは単に設計を記録するために存在するのではなく、変更のさまざまな側面について議論し、合意に至るための構造化された手段を提供するものです。
KEPプロセスの中心にあるのは、コミュニケーションと配慮です。

その目的のために、いくつかの重要な変更は、より詳細でアクセスしやすいKEPテンプレートを中心に行われています。
現在の[k/enhancements](https://github.com/kubernetes/enhancements)リポジトリの形になるまでには、多くの時間をかけてかなりの作業が行われてきました。
具体的には、SIGごとに整理されたディレクトリ構成と、現行のKEPテンプレート(Proposal/Motivation/Design Detailsのサブセクションを含む)の枠組みが整えられました。
今では、この基本的な構造は当たり前のように感じられるかもしれませんが、実際にはこのプロセスの基盤を整えるために、多くの人々が長年にわたって取り組んできた成果を反映したものです。

Kubernetesが成熟するにつれて、単に1つの機能をマージするという最終的な目標だけでなく、安定性やパフォーマンス、ユーザーの期待の設定とそれに応えることなど、さらに多くの要素を考慮する必要が出てきました。
こうした点を意識する中で、テンプレートもより詳細なものへと発展してきました。
Production Readiness Reviewの追加や改善されたテスト要件(KEPのライフサイクルの段階ごとに異なります)も、大きな変更点でした。

## 現在の注力分野

**FSM: 成熟の話といえば、[最近Kubernetes v1.31をリリースし](https://kubernetes.io/ja/blog/2024/08/13/kubernetes-v1-31-release/)、v1.32の作業も[すでに始まっています](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32)。Enhancementsサブプロジェクトが現在取り組んでいる内容の中で、今後の進め方に影響を与える可能性があるものはありますか？**

**KG**: 現在、2つの取り組みを進めています。

1) _プロセス用KEPテンプレートの作成_: 機能指向ではなくプロセス指向の重要な変更に対してもKEPプロセスを活用したいと考える人がいます。
   私たちはこのような取り組みを支援したいと考えています。
   というのも、変更を記録として残すことは重要であり、それを実現するためのより優れたツールを提供することで、さらなる議論と透明性の向上が促されるからです。
2) _KEPのバージョン管理_: テンプレートの変更は可能な限り非破壊的に行うことを目指していますが、KEPテンプレートにバージョンを設け、バージョンに対応するポリシーを整備することで、変更をより適切に追跡・共有できるようになると考えています。

これらの機能はいずれも、正しく設計し、完全に展開するまでに時間を要しますが(まさにKEPの機能と同様です)、どちらもコミュニティ全体にとって有益な改善につながると信じています。

**FSM: 改善点について言及されましたが、最近のリリースでEnhancementのトラッキング用にプロジェクトボードが導入され、非常に効果的で、リリースチームのメンバーからも満場一致で称賛されていたのを思い出します。
これは、サブプロジェクトとして特に注力していた分野だったのでしょうか？**

**KG**: このサブプロジェクトは、リリースチームのEnhancementチームによるスプレッドシートからプロジェクトボードへの移行を支援しました。
Enhancementの収集とトラッキングは、常に運用上の課題でした。
私がリリースチームに所属していた頃には、SIGのリードがリリーストラッキングの対象とするKEPを「オプトイン」する方式への移行を支援しました。
これにより、KEPに対して重要な作業を開始する前に、作成者とSIGの間でより良いコミュニケーションが取れるようになり、Enhancementsチームの手間も軽減されました。
この変更では、コミュニティに一度に多くの変更を導入することを避けるため、既存のツールを活用しました。
その後、リリースチームが、Enhancementの収集プロセスをさらに改善するため、GitHubのプロジェクトボードを活用するというアイデアをこのサブプロジェクトに提案しました。
これは、複雑なスプレッドシートの使用をやめ、[k/enhancement](https://github.com/kubernetes/enhancements)のIssueに付与されたリポジトリネイティブなラベルとプロジェクトボードを用いる方向への転換でした。

**FSM: それは、間違いなくワークフローの簡素化に大きな影響を与えたことでしょうね…。**

**KG**: 摩擦の原因を取り除き、明確なコミュニケーションを促進することは、Enhancementsサブプロジェクトにとって非常に重要です。
同時に、コミュニティ全体に影響を及ぼす意思決定については慎重に検討することも重要です。
変更によって利点が得られる一方で、展開時に後退や混乱を一切引き起こさないように、バランスの取れた対応となることを私たちは確実にしたいと考えています。
私たちは、アイデア出しからプロジェクトボードへの実際の移行作業に至るまで、リリースチームを支援しました。
これは大成功を収め、KEPプロセスに関わるすべての人々を助けるような高い影響を持つ変更をチームが実現するのを見るのは、とても刺激的なことでした！

## 参加方法

**FSM: 興味を持って参加を検討している読者に向けて、このサブプロジェクトに関わるために必要なスキルについて教えていただけますか？**

**KG**: KEPに関する知識があると役立ちます。
それは実際の経験から得たものであっても、kubernetes/enhancementsリポジトリを時間をかけて読み込んだ結果であっても構いません。
興味がある方は誰でも歓迎です。そこから一緒に進めていきましょう。

**FSM: 素晴らしいです！お時間と貴重なお話を本当にありがとうございました。
最後に読者の皆さんに伝えたいことはありますか？**

**KG**: Enhancementsプロセスは、Kubernetesにおける最も重要な要素の一つであり、それを成功させるためには、プロジェクト全体にわたる多くの人々やチームによる膨大な調整と協力が必要です。
プロジェクトをより良いものにするために、皆さんが継続的に努力し、尽力していることに心から感謝し、また大いに励まされています。
このコミュニティは本当に素晴らしいものです。

[^1]: 詳細については、このシリーズの[Production Readiness Review spotlight
    interview](https://kubernetes.io/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)を確認してみてください。
