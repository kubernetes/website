---
layout: blog
title: "SIG etcdの取り組みの紹介"
slug: sig-etcd-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2025/02/19/sig-etcd-spotlight
date: 2025-03-04
author: "Frederico Muñoz (SAS Institute)"
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

今回のSIG etcd spotlightでは、このKubernetesのSpecial Interest Groupについてさらに理解を深めるため、[James Blair](https://github.com/jmhbnz)氏、[Marek Siarkowicz](https://github.com/serathius)氏、[Wenjia Zhang](https://github.com/wenjiaswe)氏、[Benjamin Wang](https://github.com/ahrtr)氏にお話を伺いました。

## SIG etcdの紹介
**Frederico: こんにちは、お時間をいただきありがとうございます！まずは自己紹介から始めましょう。ご自身のこと、現在の役割、そしてKubernetesに関わるようになった経緯について教えてください。**

**Benjamin**: こんにちは、Benjaminと申します。私はSIG etcdのテックリードであり、etcdのメンテナーのひとりです。私はBroadcomグループの一部であるVMwareに勤めています。Kubernetes、etcd、そしてCSI([Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md))には、仕事を通じて、またオープンソースへの大きな情熱から関わるようになりました。2020年からKubernetes、etcd、(およびCSI)に取り組んでいます。

**James**: こんにちは、チームの皆さん。私はJamesです。SIG etcdの共同チェアであり、etcdのメンテナーを務めています。Red Hatに勤めており、スペシャリストアーキテクトとしてクラウドネイティブ技術の導入支援を行っています。Kubernetesエコシステムには2019年から関わるようになりました。2022年末頃、etcdコミュニティとプロジェクトが支援を必要としていることに気付き、できる限り頻繁に貢献を始めました。
私たちのコミュニティには「技術がきっかけで参加し、人とのつながりで留まる」という言葉がありますが、私にとってこれはまさにその通りです。
これまで素晴らしい旅路であり、これからもコミュニティを支えていけることを楽しみにしています。

**Marek**: 皆さんこんにちは、私はMarekです。SIG etcdのリードを務めています。Googleでは、GKEのetcdチームを率いており、すべてのGKEユーザーに対して安定かつ信頼性の高い体験を提供することを目指しています。
私のKubernetesとの関わりは、[SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation)から始まりました。
そこでは、[Kubernetes Structured Logging effort](https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/)を立ち上げ、主導しました。
現在も、[Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/)の主要なプロジェクトリードを務めており、Kubernetesにおけるオートスケーリングに必要な重要なシグナルを提供しています。
etcdには3年前、バージョン3.5のリリース時期から関わり始めました。
当初はいくつかの課題に直面しましたが、今ではetcdはこれまでで最もスケーラブルで信頼性の高い状態にあり、プロジェクト史上最多のコントリビューション数を記録しています。
このことに非常に興奮しています。
私は分散システム、エクストリーム・プログラミング、テストに情熱を持っています。

**Wenjia**: こんにちは、Wenjiaと申します。SIG etcdの共同チェアであり、etcdのメンテナーのひとりです。Googleでエンジニアリングマネージャーとして、GKE(Google Kubernetes Engine)およびGDC(Google Distributed Cloud)に取り組んでいます。
Kubernetes v1.10およびetcd v3.1のリリース時期から、オープンソースのKubernetesおよびetcdの分野で活動しています。
Kubernetesに関わるようになったきっかけは仕事でしたが、私をこの分野にとどめているのは、コンテナオーケストレーション技術の魅力、そしてさらに重要なことに、素晴らしいオープンソースコミュニティの存在です。

## KubernetesのSpecial Interest Group(SIG)になるまで
**Frederico: 素晴らしいです、ありがとうございます。まずはSIG自体の起源についてお聞きしたいと思います。SIG etcdは非常に新しいSIGですが、その設立の経緯と背景について簡単に教えていただけますか？**

Marek: もちろんです！SIG etcdは、etcdがKubernetesのデータストアとして重要なコンポーネントであることから設立されました。しかし当時、etcdはメンテナーの入れ替わりや信頼性の問題など、いくつかの課題を抱えていました。[専用のSIGを設立する](https://etcd.io/blog/2023/introducing-sig-etcd/)ことで、これらの問題に集中して取り組み、開発・保守プロセスを改善し、クラウドネイティブの環境と連動してetcdを発展させていく体制が整いました。

**Frederico: SIGになったことで、期待どおりの成果は得られましたか？さらに言えば、先ほど挙げられた動機は実際に解消されつつありますか？その達成度についても教えてください。**

**Marek**: 全体的に見て非常にポジティブな変化でした。SIGになることで、etcdの開発により明確な構造と透明性がもたらされました。私たちは、KEP([Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/blob/master/keps/README.md))やPRR([Production Readiness Reviews](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md))といったKubernetesのプロセスを取り入れ、それにより機能開発やリリースサイクルが改善されています。

**Frederico: それらに加えて、SIGになったことによって得られた最大のメリットを一つ選ぶならなんでしょうか？**

**Marek**: 私にとって最大の利点は、[Prow](https://docs.prow.k8s.io/)や[TestGrid](https://testgrid.k8s.io/)といったツールのようなKubernetesのテスト基盤を採用できたことです。etcdのような大規模プロジェクトの場合、GitHub標準のツールとは到底比較になりません。使い慣れた、明確で扱いやすいツールがあることは、etcdにとって大きな強化となり、Kubernetesのコントリビューターがetcdにも貢献しやすくなります。

**Wenjia**: まったく同感です。課題は依然として残っていますが、SIGという枠組みがそれらに取り組むための確かな基盤を提供しており、etcdがKubernetesエコシステムの重要なコンポーネントとして今後も成功し続けることを確かなものにしてくれています。

コミュニティへのポジティブな影響もまた、SIG etcdの成功において強調しておきたい重要な側面です。
KubernetesのSIGという枠組みによって、etcdのコントリビューターを受け入れやすい環境が整い、より広いKubernetesコミュニティからの参加が増加しました。
また、[SIG API Machinery](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md)、[SIG Scalability](https://github.com/kubernetes/community/tree/master/sig-scalability)、[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-scalability)、[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle)など、他のSIGとの連携も強化されています。

このような連携のおかげで、etcdの開発が、より広いKubernetesエコシステムのニーズと確実に整合するようになっています。SIG etcdとSIG Cluster Lifecycleの共同の取り組みにより設立された[etcd Operator Working Group](https://github.com/kubernetes/community/blob/master/wg-etcd-operator/README.md)は、このような成功した連携の好例であり、Kubernetesにおけるetcdの運用面を改善しようとする共通の取り組み姿勢を示しています。

**Frederico: コラボレーションについて言及がありましたが、ここ数か月でコントリビューターやコミュニティの関与に変化は見られましたか？**

**James**: はい、[ユニークなPR作成者のデータ](https://etcd.devstats.cncf.io/d/23/prs-authors-repository-groups?orgId=1&var-period=m&var-repogroup_name=All&from=1422748800000&to=1738454399000)にも示されているとおり、私たちは最近3月に過去最高を記録し、ポジティブな傾向が続いています。

{{< figure src="stats.png" alt="Unique PR author data stats" >}}

さらに、[etcdプロジェクトの全リポジトリにおける全体的なコントリビューション](https://etcd.devstats.cncf.io/d/74/contributions-chart?orgId=1&from=1422748800000&to=1738454399000&var-period=m&var-metric=contributions&var-repogroup_name=All&var-country_name=All&var-company_name=All&var-company=all)を見ても、etcdプロジェクトの活動が再び活発化していることを示すポジティブな傾向を確認しています。

{{< figure src="stats2.png" alt="Overall contributions stats" >}}

## 今後の展望

**Frederico: 大変興味深い話でした、ありがとうございます。直近の話として、SIG etcdの現在の優先事項にはどのようなものがありますか？**

**Marek**: 信頼性は常に最重要課題です。etcdが堅牢であることを確実にしなければなりません。また、オペレーターにとってetcdをより使いやすく、管理しやすくするための取り組みも進めています。さらに、etcdをKubernetesに限らず、インフラ管理のための現実的に利用可能なスタンドアロンの選択肢とすることも視野に入れています。そしてもちろん、スケーラビリティも重要です。クラウドネイティブの世界で拡大し続ける要求に対応できるようにする必要があります。

**Benjamin**: 信頼性を最優先の原則とすべきだという点には私も同意します。正確性だけでなく、互換性も確保する必要があります。加えて、etcdの理解しやすさと保守性を継続的に改善していくべきです。私たちが注力すべきは、コミュニティが最も関心を寄せているペインポイントの解消です。

**Frederico: 特に緊密に連携しているSIGはありますか？**

**Marek**: SIG API Machineryは間違いなく緊密に連携している相手です。彼らはetcdが保存するデータの構造を保有しているため、私たちは常に連携して取り組んでいます。また、SIG Cluster Lifecycleも重要です。etcdはKubernetesクラスターの重要な構成要素であるため、新たに設立されたetcd operator Working groupでも協働しています。

**Wenjia**: Marekが挙げたSIG API MachineryとSIG Cluster Lifecycle以外にも、SIG ScalabilityやSIG Testingとも密接に連携しています。

**Frederico: より一般的な観点でお聞きしますが、クラウドネイティブ環境が進化する中で、SIG etcdにとっての主な課題は何だとお考えですか？**

**Marek**: そうですね、重要なデータを扱っている以上、信頼性は常に課題です。クラウドネイティブの世界は非常に速いペースで進化しており、その要求に応えられるようなスケーラビリティを確保するには継続的な努力が必要です。

## 参加方法

**Frederico: そろそろお話も終わりに近づいてきましたが、etcdに関心のある方はどのように関わることができますか？**

**Marek**: ぜひ参加していただきたいです！最も良い始め方は、[SIG etcdミーティング](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md#meetings)に参加し、[etcd-devメーリングリスト](https://groups.google.com/g/etcd-dev)での議論を追い、[GitHubのIssue](https://github.com/etcd-io/etcd/issues)を確認することです。提案のレビュー、コードのテスト、ドキュメントの貢献など、常に協力してくださる方を歓迎しています。

**Wenjia**: この質問はとても嬉しいですね😀。SIG etcdへの貢献に関心のある方が関わり、影響を与える方法は数多くあります。以下は、皆さんが貢献できる主な分野の一部です。

**コードでの貢献**:
- _バグ修正_: etcdのコードベースの既知の問題に取り組みます。初心者に適したタスクを見つけるには、「good first issue」や「help wanted」とラベル付けされたIssueから始めるのが良いでしょう。
- _機能開発_: 新機能や機能強化の開発に貢献します。etcdのロードマップやディスカッションを確認し、計画中の内容や自身のスキルが活かせる領域を探してください。
- _テストとコードレビュー_: テストの作成、コード変更のレビュー、フィードバックの提供を通じて、etcdの品質確保に貢献します。
- _ドキュメント_: 新しいコンテンツの追加、既存情報の明確化、誤記の修正などを通じて、[etcdのドキュメント](https://etcd.io/docs/)を改善します。明確で包括的なドキュメントは、ユーザーおよびコントリビューターの双方にとって不可欠です。
- _コミュニティサポート_: フォーラム、メーリングリスト、または[Slackチャンネル](https://kubernetes.slack.com/archives/C3HD8ARJ5)で質問に回答します。etcdの理解と利用を支援することも、価値のある貢献です。

**参加方法**:
- _コミュニティに参加する_: まずはSlack上のetcdコミュニティに参加し、SIGのミーティングに出席し、メーリングリストをフォローしましょう。プロジェクト、そのプロセス、関わっている人々について理解を深めることができます。
- _メンターを見つける_: オープンソースやetcdに不慣れな場合は、ガイド役として支援してくれるメンターを見つけることを検討してください。続報にご注目ください！第1期のメンタープログラムは大変成功を収めました。次回のメンタープログラムも近日開始予定です。
- _小さく始める_: 小さな貢献から始めることを恐れないでください。たとえば、ドキュメントの誤字を修正したり、簡単なバグ修正を提案したりするだけでも、プロジェクトに参加するための素晴らしい第一歩となります。

etcdに貢献することで、クラウドネイティブエコシステムの重要な要素を改善する手助けとなるだけでなく、貴重な経験とスキルも得ることができます。
ぜひ飛び込んで、貢献を始めてみてください！

**Frederico: 素晴らしいお話をありがとうございました。最後に、設立されたばかりの他のSIGに向けて、アドバイスをひとついただけますか？**

**Marek**: もちろんです！私からのアドバイスは、Kubernetes全体のコミュニティで確立されているプロセスを積極的に取り入れ、他のSIGとの連携を優先し、強固なコミュニティの構築に注力することです。

**Wenjia**: 私自身のOSS活動の中でとても役立ったポイントをいくつか紹介します。
- _忍耐強くあること_: オープンソース開発には時間がかかることがあります。貢献がすぐに受け入れられなかったり、困難に直面しても気落ちしないでください。
- _敬意を持つこと_: etcdコミュニティでは協調と敬意が重視されています。他の人の意見に配慮し、共通の目標に向かって協力しましょう。
- _楽しむこと_: オープンソースへの貢献は楽しいものであるべきです。自分の興味のある分野を見つけて、やりがいを感じられる方法で貢献してください。

**Frederico: 素晴らしい締めくくりですね。皆さん、本日はありがとうございました！**

---

詳細情報や各種リソースについては、以下をご覧ください。

1. etcdの公式ウェブサイト: https://etcd.io/
2. etcdのGitHubリポジトリ: https://github.com/etcd-io/etcd
3. etcdコミュニティページ: https://etcd.io/community/
