---
layout: blog
title: "Don't Panic: Kubernetes and Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
author: >
  Jorge Castro,
  Duffie Cooley,
  Kat Cosgrove,
  Justin Garrison,
  Noah Kantrowitz,
  Bob Killen,
  Rey Lejano,
  Dan "POP" Papandrea,
  Jeffrey Sica,
  Davanum "Dims" Srinivas
---

Kubernetesはv1.20より新しいバージョンで、コンテナランタイムとして[Dockerをサポートしません](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)。

**パニックを起こす必要はありません。これはそれほど抜本的なものではないのです。**

概要: ランタイムとしてのDockerは、Kubernetesのために開発された[Container Runtime Interface(CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)を利用しているランタイムを選んだ結果としてサポートされなくなります。しかし、Dockerによって生成されたイメージはこれからも、今までもそうだったように、みなさんのクラスターで使用可能です。

もし、あなたがKubernetesのエンドユーザーであるならば、多くの変化はないでしょう。これはDockerの死を意味するものではありませんし、開発ツールとして今後Dockerを使用するべきでない、使用することは出来ないと言っているのでもありません。Dockerはコンテナを作成するのに便利なツールですし、docker buildコマンドで作成されたイメージはKubernetesクラスター上でこれからも動作可能なのです。

もし、GKE、EKS、AKSといったマネージドKubernetesサービス(それらはデフォルトで[containerdを使用しています](https://github.com/Azure/AKS/releases/tag/2020-11-16))を使っているのなら、ワーカーノードがサポート対象のランタイムを使用しているか、Dockerのサポートが将来のK8sバージョンで切れる前に確認しておく必要があるでしょう。
もし、ノードをカスタマイズしているのなら、環境やRuntimeの仕様に合わせて更新する必要があるでしょう。サービスプロバイダーと確認し、アップグレードのための適切なテストと計画を立ててください。

もし、ご自身でClusterを管理しているのなら、やはり問題が発生する前に必要な対応を行う必要があります。v1.20の時点で、Dockerの使用についての警告メッセージが表示されるようになります。将来のKubernetesリリース(現在の計画では2021年下旬のv1.22)でDockerのRuntimeとしての使用がサポートされなくなれば、containerdやCRI-Oといった他のサポート対象のRuntimeに切り替える必要があります。切り替える際、そのRuntimeが現在使用しているDocker Daemonの設定をサポートすることを確認してください。(Loggingなど)

## では、なぜ混乱が生じ、誰もが恐怖に駆られているのか。
ここで議論になっているのは2つの異なる場面についてであり、それが混乱の原因になっています。Kubernetesクラスターの内部では、Container runtimeと呼ばれるものがあり、それはImageをPullし起動する役目を持っています。Dockerはその選択肢として人気があります(他にはcontainerdやCRI-Oが挙げられます)が、しかしDockerはそれ自体がKubernetesの一部として設計されているわけではありません。これが問題の原因となっています。

お分かりかと思いますが、ここで”Docker”と呼んでいるものは、ある1つのものではなく、その技術的な体系の全体であり、その一部には"containerd"と呼ばれるものもあり、これはそれ自体がハイレベルなContainer runtimeとなっています。Dockerは素晴らしいもので、便利です。なぜなら、多くのUXの改善がされており、それは人間が開発を行うための操作を簡単にしているのです。しかし、それらはKubernetesに必要なものではありません。Kubernetesは人間ではないからです。
このhuman-friendlyな抽象化レイヤーが作られたために、結果としてはKubernetesクラスターはDockershimと呼ばれるほかのツールを使い、本当に必要な機能つまりcontainerdを利用してきました。これは素晴らしいとは言えません。なぜなら、我々がメンテする必要のあるものが増えますし、それは問題が発生する要因ともなります。今回の変更で実際に行われることというのは、Dockershimを最も早い場合でv1.23のリリースでkubeletから除外することです。その結果として、Dockerのサポートがなくなるということなのです。
ここで、containerdがDockerに含まれているなら、なぜDockershimが必要なのかと疑問に思われる方もいるでしょう。

DockerはCRI([Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/))に準拠していません。もしそうであればshimは必要ないのですが、現実はそうでありません。
しかし、これは世界の終わりでありません、心配しないでください。みなさんはContainer runtimeをDockerから他のサポート対象であるContainer runtimeに切り替えるだけでよいのです。

1つ注意すべきことは、クラスターで行われる処理のなかでDocker socket(`/var/run/docker.sock`)に依存する部分がある場合、他のRuntimeへ切り替えるとこの部分が働かなくなるでしょう。このパターンはしばしばDocker in Dockerと呼ばれます。このような場合の対応方法はたくさんあります。[kaniko](https://github.com/GoogleContainerTools/kaniko)、[img](https://github.com/genuinetools/img)、[buildah](https://github.com/containers/buildah)などです。

## では開発者にとって、この変更は何を意味するのか。これからもDockerfileを使ってよいのか。これからもDockerでビルドを行ってよいのか。

この変更は、Dockerを直接操作している多くのみなさんとは別の場面に影響を与えるでしょう。
みなさんが開発を行う際に使用しているDockerと、Kubernetesクラスターの内部で使われているDocker runtimeは関係ありません。これがわかりにくいことは理解しています。開発者にとって、Dockerはこれからも便利なものであり、このアナウンスがあった前と変わらないでしょう。DockerでビルドされたImageは、決してDockerでだけ動作するというわけではありません。それはOCI([Open Container Initiative](https://opencontainers.org/)) Imageと呼ばれるものです。あらゆるOCI準拠のImageは、それを何のツールでビルドしたかによらず、Kubernetesから見れば同じものなのです。[containerd](https://containerd.io/)も[CRI-O](https://cri-o.io/)も、そのようなImageをPullし、起動することが出来ます。
これがコンテナの仕様について、共通の仕様を策定している理由なのです。

さて、この変更は決定しています。いくつかの問題は発生するかもしてませんが、決して壊滅的なものではなく、ほとんどの場合は良い変化となるでしょう。Kubernetesをどのように使用しているかによりますが、この変更が特に何の影響も及ぼさない人もいるでしょうし、影響がとても少ない場合もあります。長期的に見れば、物事を簡単にするのに役立つものです。
もし、この問題がまだわかりにくいとしても、心配しないでください。Kubernetesでは多くのものが変化しており、その全てに完璧に精通している人など存在しません。
経験の多寡や難易度にかかわらず、どんなことでも質問してください。我々の目標は、全ての人が将来の変化について、可能な限りの知識と理解を得られることです。
このブログが多くの質問の答えとなり、不安を和らげることができればと願っています。

別の情報をお探しであれば、[dockershimの削除に関するFAQ](/ja/dockershim)を参照してください。
