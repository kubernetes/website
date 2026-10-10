---
layout: blog
title: "SIG Cloud Providerの取り組みの紹介"
slug: sig-cloud-provider-spotlight-2024
date: 2024-03-01
canonicalUrl: https://www.k8s.dev/blog/2024/03/01/sig-cloud-provider-spotlight-2024/
author: >
  Arujjwal Negi
translator: >
  Takuya Kitamura
---

Kubernetes関連のサービスは、開発者にとってクラウドプロバイダー経由で利用するのが最も人気な方法の一つです。では、クラウドプロバイダーがどのようにしてKubernetesと連携しているのか、不思議に思ったことはありませんか？Kubernetesがさまざまなクラウドプロバイダーと統合される過程は、どのように実現されているのでしょうか？この疑問に答えるために、[SIG
Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md)にスポットライトを当ててみましょう。

SIG Cloud Providerは、Kubernetesとさまざまなクラウドプロバイダーとのシームレスな統合を実現するために活動しています。彼らの使命は、Kubernetesエコシステムを誰にとっても公平かつオープンなものに保つことです。
明確な基準と要件を定めることで、どのクラウドプロバイダーもKubernetesと適切に連携できるようにしています。
クラウドプロバイダーとの連携を可能にするために、クラスター内の各コンポーネントを適切に構成することも彼らの重要な責務です。

SIG Spotlightシリーズの本記事では、[Arujjwal Negi](https://twitter.com/arujjval)が[Michael McCune](https://github.com/elmiko)(Red Hat)にインタビューを行いました。McCune氏は _elmiko_ の名でも知られており、SIG Cloud Providerの共同チェアを務めています。このインタビューを通じて、本SIGの活動の実態に迫ります。

## はじめに

**Arujjwal**: まずは、あなた自身について知るところから始めたいと思います。簡単に自己紹介をしていただけますか？また、どのようにしてKubernetesに関わるようになったのかも教えてください。

**Michael**:こんにちは、Michael McCuneです。コミュニティでは、多くの人が私のハンドルネームである _elmiko_ と呼んでいます。私は長年ソフトウェア開発に携わっており(私が開発を始めた頃は、Windows 3.1が流行していました！)、キャリアのほとんどをオープンソースソフトウェアとともに歩んできました。Kubernetesに関わるようになったのは、機械学習やデータサイエンスのアプリケーション開発に取り組んでいたときです。当時所属していたチームでは、Apache Sparkなどの技術をKubernetes上で活用するチュートリアルやサンプルを作成していました。それとは別に、私は以前から分散システム全般に強い関心を持っており、Kubernetesの開発に直接取り組むチームに参加できるチャンスが訪れたときには、すぐに飛び込みました！

## 活動内容と運営体制
**Arujjwal**: SIG Cloud Providerがどのような活動を行っていて、どのように機能しているのか教えていただけますか？

**Michael**: SIG Cloud Providerは、Kubernetesがすべてのインフラプロバイダーに対して中立的な統合ポイントを提供できるようにすることを目的として設立されました。これまでで最大の取り組みは、Kubernetes本体(in-tree)に組み込まれていたクラウドコントローラーを、外部コンポーネント(out-of-tree)として切り出し、移行する作業です。SIGでは定期的にミーティングを行い、進捗状況や今後の作業について議論しています。あわせて、報告された質問やバグへの対応も行っています。さらに、クラウドプロバイダー向けのフレームワークや各種クラウドコントローラーの実装、[Konnectivity proxy
project](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/)など、クラウド関連サブプロジェクトの調整窓口としての役割も担っています。

**Arujjwal**: プロジェクトの[README](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md)を拝見し、SIG Cloud ProviderがKubernetesとクラウドプロバイダーとの統合に関わっていることを知りました。この統合プロセスは、具体的にどのように進められているのでしょうか？

**Michael**: Kubernetesを実行する最も一般的な方法の一つは、クラウド環境(AWS、Azure、GCPなど)にデプロイすることです。これらのクラウドインフラには、Kubernetesのパフォーマンスを高めるための機能が備わっていることがよくあります。例えば、Serviceオブジェクト向けのエラスティックロードバランシングを提供する機能などです。Kubernetesからクラウド固有のサービスを一貫して利用できるようにするために、Kubernetesコミュニティではクラウドコントローラーという仕組みを導入し、これらの統合ポイントに対応しています。クラウドプロバイダーは、SIGが管理しているフレームワークを利用するか、あるいはKubernetesのコードやドキュメントで定義されているAPIガイドラインに従うことで、独自のコントローラーを作成できます。ここでひとつ強調しておきたいのは、SIG Cloud ProviderはKubernetesクラスター内のノードのライフサイクル管理は担当していないという点です。このようなトピックについては、SIG Cluster Lifecycleや Cluster APIプロジェクトが適切な議論の場となります。

## 重要なサブプロジェクト
**Arujjwal**:このSIGには多くのサブプロジェクトが存在しています。その中でも特に重要なものと、それぞれが担っている役割について教えていただけますか？

**Michael:** 現在、最も重要だと考えているサブプロジェクトは[cloud provider
framework](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#kubernetes-cloud-provider)と、[extraction/migration
project](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#cloud-provider-extraction-migration)の2つです。cloud provider framework は、インフラ統合を担当する開発者が、自身のインフラ環境に対応したクラウドコントローラーを構築する際に役立つ共通ライブラリです。このプロジェクトは、新しくSIGに参加する人たちが最初に触れることの多い入り口でもあります。もう一つのextraction and migration projectは、このフレームワークの存在理由にも関わる、非常に大きなサブプロジェクトです。少し背景を説明すると、Kubernetesでは長い間、基盤となるインフラとの統合が必要とされてきました。その目的は、必ずしも機能を追加することではなく、たとえばインスタンスの終了といったクラウド上のイベントを把握するためでした。当初、クラウドプロバイダーとの統合機能はKubernetes本体のコードツリー内に直接組み込まれていました。これがいわゆる"in-tree"と呼ばれる形式の由来です(詳しくは[こちらの記事](https://kaslin.rocks/out-of-tree/)をご覧ください)。しかし、プロバイダー固有のコードを Kubernetesのメインソースツリーで管理することは、コミュニティにとって望ましくないと見なされていました。そのため、"in-tree"のクラウドコントローラーを取り除き、"out-of-tree"で管理可能な独立コンポーネントへと移行するために、このextraction and migration projectが立ち上げられました。

**Arujjwal**: [cloud provider framework]が、新しく関わる人にとって良い出発点になるのはなぜでしょうか？初心者向けのタスクが継続的に用意されているのですか？あるとすれば、どのような内容ですか？

**Michael**: cloud provider frameworkは、クラウドコントローラーマネージャーに関するコミュニティの推奨される実装方法を反映しているため、新しく参加する人にとっては良い出発点だと思います。このフレームワークに取り組むことで、マネージャーが何を、どのように行っているのかをしっかりと理解できるはずです。ただ残念ながら、このコンポーネントに関しては、初心者向けのタスクが常に継続的に用意されているわけではありません。その理由の一つは、フレームワーク自体がすでに成熟していること、また各クラウドプロバイダー側の実装も同様に安定していることです。この分野にもっと関わってみたいという方には、[Go言語](https://go.dev/)の基本的な知識があると良いと思います。加えて、少なくとも1つのクラウドAPI(AWS、Azure、GCPなど)についての理解があると、なお良いです。個人的な意見ですが、SIG Cloud Providerに新しく参加することは簡単ではないと思います。というのも、このプロジェクトに関わるコードの多くは、特定のクラウドプロバイダーとの統合処理を直接扱っているからです。クラウドプロバイダー周りでより積極的に活動したいと考えている方への私のアドバイスは、まず1つか2つのクラウドAPIに慣れ親しむことです。その上で、該当するクラウド向けのコントローラーマネージャーにあるopen issueを探し、他のコントリビューターとできるだけ多くコミュニケーションを取るようにするのが良いでしょう。

## 成果
**Arujjwal**: SIG Cloud Providerの活動の中で、特に誇りに思っている成果があれば教えてくれますか？

**Michael**: 私がSIGに参加してから1年以上が経ちますが、その間にextraction and migrationサブプロジェクトを大きく前進させることができました。
当初は、定義された[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)はアルファ版の段階でしたが、現在ではベータ版へと進み、Kubernetesのソースツリーから古いプロバイダーコードを削除するところまで近づいています。コミュニティのメンバーが積極的に関与してくれている様子を見ることができ、とても誇らしく感じています。クラウドコントローラーの切り出しに向けて、私たちが着実に前進してきたことを実感しています。おそらく、あと数回のリリースのうちに、in-treeのクラウドコントローラーは完全に削除され、このサブプロジェクトも完了するだろうと感じています。

## 新しいコントリビューターへのアドバイス
**Arujjwal**: SIG Cloud Providerに参加したいと考えている新しいコントリビューターに向けて、何か提案やアドバイスはありますか？

**Michael**: 個人的には、これは難しい質問だと思います。SIG Cloud Providerは、Kubernetesと基盤インフラとの間を統合するコード部分に焦点を当てたグループです。SIGのメンバーは、クラウドプロバイダーの公式な立場を代表していることが多いですが、必ずしもそうである必要はありません。Kubernetesのこの分野に関心がある方には、まずSIGのミーティングに参加して、私たちがどのように活動しているかを見てみることをおすすめします。あわせて、cloud provider frameworkプロジェクトを学ぶのも良いスタートになります。また、今後に向けた興味深いアイデアもいくつかあります。たとえば、すべてのクラウドプロバイダーに共通するテストフレームワークの構想です。これは、Kubernetesへの関与を広げたい方にとって、大きなチャンスになるでしょう。


**Arujjwal**: 現在、SIG Cloud Providerとして求めているスキルの中で、私たちが特に強調すべきものはありますか？私たちが所属する[SIG ContribEx](https://github.com/kubernetes/community/blob/master/sig-contributor-experience/README.md)から例を挙げると、たとえば[Hugo](https://gohugo.io/)の専門知識がある方であれば、k8s.devの改善で常に力をお借りしたいと考えています！

**Michael**: 現在、SIGはextraction and migrationプロセスの最終段階に取り組んでいます。一方で、今後に向けた計画もすでに始めており、次に何を進めていくかを検討しています。その中でも大きな話題の一つがテストです。現時点では、各クラウドプロバイダーが自分たちのコントローラーマネージャーの動作を確認するために使える、汎用的で共通なテスト群は存在していません。もし、GinkgoやKubetestフレームワークに詳しい方がいれば、新しいテストの設計や実装にあたって、ぜひ力をお借りしたいと思います。

---

これでインタビューは終了です。SIG Cloud Providerの目的や活動内容について、少しでも理解を深めていただけたなら幸いです。今回ご紹介したのは、あくまでその一端に過ぎません。より詳しく知りたい方や実際に関わってみたい方は、[こちら](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#meetings)のミーティングに参加してみてください。
