---
layout: blog
title: "Kubernetesブッククラブを覗く"
slug: k8s-book-club
date: 2024-02-22
author: >
  Frederico Muñoz (SAS Institute)
---

Kubernetesとそれを取り巻く技術のエコシステム全体を学ぶことは、課題がないわけではありません。
このインタビューでは、[AWSのCarlos Santana](https://www.linkedin.com/in/csantanapr/)さんに、コミュニティベースの学習体験を利用するために、彼がどのようにして[Kubernetesブッククラブ](https://community.cncf.io/kubernetes-virtual-book-club/)を作ったのか、その会がどのような活動をするのか、そしてどのようにして参加するのかについて伺います。

![KubeCon NA 2023で話すCarlos Santanaさん](csantana_k8s_book_club.jpg)

**Frederico Muñoz (FSM)**: こんにちはCarlosさん、時間をとってくれてありがとう。
まずはじめに、ご自身のことを少し教えていただけますか？

**Carlos Santana (CS)**: もちろんです。
6年前に本番環境でKubernetesをデプロイした経験が、[Knative](https://knative.dev/)に参加するきっかけとなり、その後リリースチームを通じてKubernetesに貢献しました。
アップストリームのKubernetesでの作業は、私がオープンソースで得た最高の経験のひとつです。
過去2年間、AWSのシニア・スペシャリスト・ソリューション・アーキテクトとしての役割で、私は大企業がKubernetes上に内部開発者プラットフォーム(IDP)を構築することを支援してきました。
今後、私のオープンソースへの貢献は、[Argo](https://github.com/argoproj)や[Crossplane](https://www.crossplane.io/)、[Backstage](https://www.cncf.io/projects/backstage/)のようなCNCFのプロジェクトや[CNOE](https://cnoe.io/)を対象にしています。

## ブッククラブの創設

**FSM**: それであなたがKubernetesに辿り着いたわけですが、その時点でブッククラブを始めた動機は何だったのでしょうか？


**CS**: Kubernetesブッククラブのアイデアは、[TGIK](https://github.com/vmware-archive/tgik)のライブ配信での何気ない提案から生まれました。
私にとって、それは単に本を読むということ以上に、学習コミュニティを作るということでした。
このプラットフォームは知識の源であるだけでなく、特にパンデミックの困難な時期にはサポートシステムでもありました。
この取り組みが、メンバーたちの対処と成長に役立っていることを目の当たりにして、喜ばしいと思っています。
最初の本[Production Kubernetes](https://www.oreilly.com/library/view/production-kubernetes/9781492092292/)は、2021年3月5日に始めて36週間かかりました。
現在は、1冊の本をカバーするのにそれほど時間はかからず、1週間に1章か2章です。

**FSM**: Kubernetesブッククラブの仕組みについて教えてください。どのように本を選び、どのように読み進めるのですか？

**CS**: 私たちは、グループの関心とニーズに基づいて本を共同で選んでいます。
この実践的なアプローチは、メンバー、とくに初心者が複雑な概念をより簡単に理解するのに役立ちます。
毎週2つのシリーズがあり、EMEAのタイムゾーンのものと、私がUSで組織しているものです。
各オーガナイザーは共同ホストと協力してSlack上で本を選び、各章の議論するために、数週間に渡りホストのラインナップを整えます。


**FSM**: 私の記憶が間違っていなければ、Kubernetesブッククラブは17冊目に突入しています。
物事を活発に保つための秘密のレシピがあるのですか？

**CS**: ブッククラブを活発で魅力的なものに保つ秘訣は、いくつかの重要な要素にあります。

まず、一貫性が重要です。
休みの日やKubeConのような大きなイベントの時だけミーティングをキャンセルして、定期的なスケジュールを維持するよう努力しています。
この規則性は、メンバーの参加を維持し、信頼できるコミュニティを築くのに役立っています。

次に、セッションを面白く、対話式のものにすることが重要です。
たとえば、ミートアップ中にポップアップ・クイズを頻繁に導入します。これはメンバーの理解度をテストするだけでなく、楽しみの要素も加えています。
このアプローチによって内容の関連性が維持され、理論的な概念が実社会のシナリオでどのように適用されるかをメンバーが理解するのに役立ちます。

## ブッククラブで扱うトピック

**FSM**: 書籍の主なトピックは、Kubernetes、GitOps、セキュリティ、SRE、オブザーバビリティになっています。
これはとくに人気という観点で、Cloud Native Landscapeの反映でしょうか？

**CS**: 私たちの旅は『Production Kubernetes』から始まり、実用的な本番環境向けのソリューションに焦点を当てる方向性を設定しました。
それ以来、私たちはCNCF Landscapeのさまざまな側面を掘り下げ、異なるテーマに沿って本を揃えています。
各テーマは、それがセキュリティであれ、オブザーバビリティであれ、サービスメッシュであれ、コミュニティ内の関連性と需要にもとづいて選択されています。
たとえば、Kubernetes認定に関する最近のテーマでは、書籍の著者を積極的なホストとして参加させ、彼らの専門知識で議論を充実させました。

**FSM**: プロジェクトに最近変化があったことは知っています。[Cloud Native Community Group](https://community.cncf.io/)としてCNCFに統合されたことです。
この変更について少しお話いただけますか？

**CS**: CNCFはブッククラブをCloud Native Community Groupとして快く受け入れてくれました。
これは私たちの運営を合理化し、影響範囲を拡大する重要な進展です。
この連携はKubernetes Community Days (KCD)のミートアップで使用されているものと同様に、管理機能の強化に役立っています。
現在では、メンバーシップ、イベントのスケジューリング、メーリングリスト、Webカンファレンスの開催、セッションの記録など、より強固な体制が整っています。

**FSM**: CNCFとの関わりは、この半年間のKubernetesブッククラブの成長やエンゲージメントにどのような影響を与えましたか？

**CS**: 半年前にCNCFコミュニティの一員になって以来、Kubernetesブッククラブでは大きな定量的な変化を目の当たりにしてきました。
会員数は600人以上に急増し、この間に40以上のイベントを企画・実施することに成功しました。
さらに期待されるのは、1回のイベントに平均30人が参加するという安定した動員数です。
この成長とエンゲージメントは、コミュニティにおける影響やKubernetesブッククラブの影響範囲に関して、私たちのCNCF加盟が肯定的な影響である明確な指標です。

## ブッククラブに参加する

**FSM**: 参加を希望する人は、どうすればいいのでしょうか？

**CS**: 参加するためには3つの段階があります。

- まず、[Kubernetesブッククラブコミュニティ](https://community.cncf.io/kubernetes-virtual-book-club/)に参加します
- 次に、コミュニティページ上の[イベント](https://community.cncf.io/kubernetes-virtual-book-club/)に出欠連絡をします
- 最後に、CNCFのSlackチャンネル[#kubernetes-book-club](https://cloud-native.slack.com/archives/C05EYA14P37)に参加します

**FSM**: 素晴らしい、ありがとうございます！最後に何かコメントをお願いします。

**CS**: Kubernetesブッククラブは、単に本について議論する専門家のグループというだけではなく、それ以上です。
それは、[Neependra Khare](https://www.linkedin.com/in/neependra/)さん、[Eric Smalling](https://www.linkedin.com/in/ericsmalling/)さん、[Sevi Karakulak](https://www.linkedin.com/in/sevikarakulak/)さん、[Chad M. Crowell](https://www.linkedin.com/in/chadmcrowell/)さん、そして[Walid (CNJ) Shaari](https://www.linkedin.com/in/walidshaari/)さんの主催と企画を手伝ってくれる素晴らしいボランティアであり、活気のあるコミュニティです。
KubeConで私たちを見て、Kubernetesブッククラブのステッカーをゲットしてください！
