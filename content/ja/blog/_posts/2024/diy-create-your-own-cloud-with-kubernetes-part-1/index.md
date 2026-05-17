---
layout: blog
title: "DIY: Kubernetesで自分だけのクラウドを構築しよう(パート1)"
slug: diy-create-your-own-cloud-with-kubernetes-part-1
date: 2024-04-05T07:30:00+00:00
author: >
  Andrei Kvapil (Ænix)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) (IDCフロンティア),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

Ænixでは、Kubernetesに対する深い愛着があり、近いうちにすべての最新テクノロジーがKubernetesの驚くべきパターンを活用し始めることを夢見ています。
自分だけのクラウドを構築することを考えたことはありませんか？きっと考えたことがあるでしょう。
しかし、快適なKubernetesエコシステムを離れることなく、最新のテクノロジーとアプローチのみを使ってそれを実現することは可能でしょうか？
Cozystackの開発における私たちの経験は、その点を深く掘り下げる必要がありました。
自分だけのクラウドを構築することを考えたことはありませんか？

Kubernetesはこの目的のために設計されたものではなく、ベアメタルサーバー用にOpenStackを使用し、意図したとおりにその内部でKubernetesを実行すればよいのではないかと主張する人もいるかもしれません。
しかし、そうすることで、単に責任があなたの手からOpenStack管理者の手に移っただけです。
これにより、少なくとも1つの巨大で複雑なシステムがエコシステムに追加されることになります。

なぜ物事を複雑にするのでしょうか？
結局のところ、Kubernetesにはテナント用のKubernetesクラスターを実行するために必要なものがすべて揃っています。

Kubernetesをベースにしたクラウドプラットフォームの開発における私たちの経験を共有したいと思います。
私たち自身が使用しており、あなたの注目に値すると信じているオープンソースプロジェクトを紹介します。

この一連の記事では、オープンソースのテクノロジーのみを使用して、ベアメタルから管理されたKubernetesを準備する方法についての私たちの物語をお伝えします。
データセンターの準備、仮想マシンの実行、ネットワークの分離、フォールトトレラントなストレージのセットアップといった基本的なレベルから、動的なボリュームのプロビジョニング、ロードバランサー、オートスケーリングを備えた本格的なKubernetesクラスターのプロビジョニングまでを扱います。

この記事から、いくつかのパートで構成されるシリーズを開始します:

- **パート1**: 自分のクラウドの基礎を準備する。ベアメタル上でのKubernetesの準備と運用における課題、およびインフラストラクチャをプロビジョニングするための既成のレシピ。
- **パート2**: ネットワーク、ストレージ、仮想化。Kubernetesを仮想マシン起動のためのツールにする方法とそのために必要なもの。
- **パート3**: Cluster APIと、ボタンを押すだけでKubernetesクラスターのプロビジョニングを開始する方法。オートスケーリング、ボリュームの動的プロビジョニング、ロードバランサーの仕組み。

さまざまなテクノロジーをできるだけ独立して説明しようと思いますが、同時に、私たちの経験と、なぜある解決策に至ったのかを共有します。

まず、Kubernetesの主な利点と、それがクラウドリソースの使用へのアプローチをどのように変えたかを理解しましょう。

クラウドとベアメタルでは、Kubernetesの使い方が異なることを理解することが重要です。

## クラウド上のKubernetes

クラウド上でKubernetesを運用する場合、永続ボリューム、クラウドロードバランサー、ノードのプロビジョニングプロセスを気にする必要はありません。
これらはすべて、Kubernetesオブジェクトの形式であなたのリクエストを受け入れるクラウドプロバイダーによって処理されます。
つまり、サーバー側は完全にあなたから隠されており、クラウドプロバイダーがどのように正確に実装しているかを知る必要はありません。
それはあなたの責任範囲ではないからです。

{{< figure src="cloud.svg" alt="クラウド上のKubernetesを示す図。ロードバランシングとストレージはクラスターの外部で行われています" caption="クラウド上のKubernetesを示す図。ロードバランシングとストレージはクラスターの外部で行われています" >}}

Kubernetesは、どこでも同じように機能する便利な抽象化を提供しているため、あらゆるクラウドのKubernetes上にアプリケーションをデプロイできます。

クラウドでは、Kubernetesコントロールプレーン、仮想マシン、永続ボリューム、ロードバランサーなど、いくつかの個別のエンティティを持つことが非常に一般的です。
これらのエンティティを使用することで、高度に動的な環境を作成できます。

Kubernetesのおかげで、仮想マシンは今やクラウドリソースを利用するための単なるユーティリティエンティティとしてのみ見られるようになりました。
もはや仮想マシンの中にデータを保存することはありません。
仮想マシンをすべて削除して、アプリケーションを壊すことなく再作成できます。
Kubernetesコントロールプレーンは、クラスター内で何が実行されるべきかについての情報を保持し続けます。
ロードバランサーは、新しいノードにトラフィックを送信するためにエンドポイントを変更するだけで、ワークロードにトラフィックを送信し続けます。
そして、データはクラウドが提供する外部の永続ボリュームに安全に保存されます。

このアプローチは、クラウドでKubernetesを使用する際の基本です。
その理由はかなり明白です。
システムが単純であるほど安定性が高くなり、このシンプルさのためにクラウドでKubernetesを選択するのです。

## ベアメタル上のKubernetes

クラウドでKubernetesを使用することは本当に簡単で便利ですが、ベアメタルへのインストールについては同じことが言えません。
ベアメタルの世界では、Kubernetesは逆に非常に複雑になります。
まず、ネットワーク全体、バックエンドストレージ、クラウドバランサーなどは、通常、クラスターの外部ではなく内部で実行されるためです。
その結果、このようなシステムは更新と保守がはるかに難しくなります。

{{< figure src="baremetal.svg" alt="ベアメタル上のKubernetesを示す図。ロードバランシングとストレージはクラスターの内部で行われています" caption="ベアメタル上のKubernetesを示す図。ロードバランシングとストレージはクラスターの内部で行われています" >}}

ご自身で判断してみてください。
クラウドでは、通常、ノードを更新するために仮想マシンを削除する(または`kubectl delete node`を使用する)だけで、イミュータブルなイメージに基づいて新しいノードを作成することをノード管理ツールに任せることができます。
新しいノードはクラスターに参加し、Kubernetesの世界で非常にシンプルでよく使われるパターンに従って、ノードとして「そのまま動作」します。
多くのクラスターでは、安価なスポットインスタンスを利用できるため、数分ごとに新しい仮想マシンをオーダーしています。
しかし、物理サーバーを使用している場合は、簡単に削除して再作成することはできません。
まず、物理サーバーはクラスターサービスを実行していたり、データを保存していたりすることが多いため、その更新プロセスははるかに複雑になるからです。

この問題を解決するアプローチはさまざまです。
kubeadm、kubespray、k3sが行うようなインプレースアップデートから、Cluster APIとMetal3を通じた物理ノードのプロビジョニングの完全な自動化まで幅広くあります。

私は、Talos Linuxが提供するハイブリッドアプローチが気に入っています。
このアプローチでは、システム全体が単一の設定ファイルで記述されます。
このファイルのほとんどのパラメーターは、Kubernetesコントロールプレーンコンポーネントのバージョンを含め、ノードを再起動または再作成することなく適用できます。
それでも、Kubernetesの宣言的な性質を最大限に保持しています。
このアプローチは、ベアメタルノードを更新する際のクラスターサービスへの不要な影響を最小限に抑えます。
ほとんどの場合、マイナーアップデートの際に仮想マシンを移行したり、クラスターファイルシステムを再構築したりする必要はありません。

## 将来のクラウドの基盤を準備する

さて、自分だけのクラウドを構築することに決めたとしましょう。
まずは基盤となるレイヤーが必要です。
サーバーにKubernetesをインストールする方法だけでなく、それをどのように更新し、維持していくかについても考える必要があります。
カーネルの更新、必要なモジュールのインストール、パッケージやセキュリティパッチなどについても考えなければならないことを考慮してください。
クラウド上の既製のKubernetesを使用する際に気にする必要のないことをはるかに多く考えなければなりません。

もちろん、UbuntuやDebianのような標準的なディストリビューションを使用できますし、Flatcar Container Linux、Fedora Core、Talos Linuxのような特殊なディストリビューションを検討することもできます。
それぞれに長所と短所があります。

私たちのことですか？
Ænixでは、ZFS、DRBD、OpenvSwitchなどのかなり特殊なカーネルモジュールを使用しているので、必要なモジュールをすべて事前に含んだシステムイメージを形成する方法を選びました。
この場合、Talos Linuxが私たちにとって最も便利であることがわかりました。
たとえば、次のような設定で、必要なカーネルモジュールをすべて含むシステムイメージを構築するのに十分です:

```yaml
arch: amd64
platform: metal
secureboot: false
version: v1.6.4
input:
  kernel:
    path: /usr/install/amd64/vmlinuz
  initramfs:
    path: /usr/install/amd64/initramfs.xz
  baseInstaller:
    imageRef: ghcr.io/siderolabs/installer:v1.6.4
  systemExtensions:
    - imageRef: ghcr.io/siderolabs/amd-ucode:20240115
    - imageRef: ghcr.io/siderolabs/amdgpu-firmware:20240115
    - imageRef: ghcr.io/siderolabs/bnx2-bnx2x:20240115
    - imageRef: ghcr.io/siderolabs/i915-ucode:20240115
    - imageRef: ghcr.io/siderolabs/intel-ice-firmware:20240115
    - imageRef: ghcr.io/siderolabs/intel-ucode:20231114
    - imageRef: ghcr.io/siderolabs/qlogic-firmware:20240115
    - imageRef: ghcr.io/siderolabs/drbd:9.2.6-v1.6.4
    - imageRef: ghcr.io/siderolabs/zfs:2.1.14-v1.6.4
output:
  kind: installer
  outFormat: raw
```

`docker`コマンドラインツールを使用して、OSイメージをビルドします:

```
cat config.yaml | docker run --rm -i -v /dev:/dev --privileged "ghcr.io/siderolabs/imager:v1.6.4" -
```

その結果、必要なものがすべて含まれたDockerコンテナイメージが得られます。
このイメージを使用して、サーバーにTalos Linuxをインストールできます。
同じことができます。このイメージには、必要なすべてのファームウェアとカーネルモジュールが含まれます。

しかし、新しく形成されたイメージをノードにどのように配信するかという問題が発生します。

しばらくの間、PXEブートのアイデアについて考えていました。
たとえば、2年前に[記事](/blog/2021/12/22/kubernetes-in-kubernetes-and-pxe-bootable-server-farm/)を書いた**Kubefarm**プロジェクトは、完全にこのアプローチを使用して構築されました。
しかし残念ながら、他のクラスターを保持する最初の親クラスターをデプロイするのに役立つわけではありません。
そこで今回、PXEアプローチを使用して同じことを行うのに役立つソリューションを用意しました。

基本的に必要なのは、コンテナ内で一時的な**DHCP**と**PXE**サーバーを[実行する](https://cozystack.io/docs/get-started/)ことだけです。
そうすれば、ノードはあなたのイメージから起動し、Debianベースの簡単なスクリプトを使用して、ノードのブートストラップに役立てることができます。

[![asciicast](asciicast.svg)](https://asciinema.org/a/627123)

`talos-bootstrap`スクリプトの[ソースコード](https://github.com/aenix-io/talos-bootstrap/)はGitHubで入手できます。

このスクリプトを使用すると、ベアメタル上に5分でKubernetesをデプロイし、それにアクセスするためのkubeconfigを取得できます。
しかし、まだ多くの未解決の問題が残っています。

## システムコンポーネントの配信

この段階では、さまざまなワークロードを実行できるKubernetesクラスターがすでに手に入っています。
しかし、まだ完全に機能しているわけではありません。
つまり、ネットワークとストレージを設定する必要があるだけでなく、仮想マシンを実行するためのKubeVirtや、監視スタックやその他のシステム全体のコンポーネントなど、必要なクラスター拡張機能をインストールする必要があります。

従来、これは**Helmチャート**をクラスターにインストールすることで解決されています。
ローカルで`helm install`コマンドを実行することで実現できますが、アップデートを追跡したい場合や、複数のクラスターを持っていてそれらを均一に保ちたい場合、このアプローチは不便になります。
実際には、これを宣言的に行う方法はたくさんあります。
これを解決するには、最高のGitOpsプラクティスを使用することをお勧めします。
つまり、ArgoCDやFluxCDのようなツールを指します。

ArgoCDはグラフィカルインターフェースと中央コントロールプレーンを備えているため開発目的には便利ですが、一方でFluxCDはKubernetesディストリビューションの作成により適しています。
FluxCDを使用すると、どのチャートをどのパラメーターで起動すべきかを指定し、依存関係を記述できます。
そうすれば、FluxCDがすべてを処理してくれます。

新しく作成したクラスターにFluxCDを1回インストールし、適切に設定することをお勧めします。
これにより、FluxCDは必要不可欠なコンポーネントをすべて自動的にデプロイできるようになり、クラスターを目的の状態にアップグレードできます。
たとえば、私たちのプラットフォームをインストールすると、システムコンポーネントとともに次の事前設定されたHelmチャートが表示されます:

```
NAMESPACE                        NAME                        AGE    READY   STATUS
cozy-cert-manager                cert-manager                4m1s   True    Release reconciliation succeeded
cozy-cert-manager                cert-manager-issuers        4m1s   True    Release reconciliation succeeded
cozy-cilium                      cilium                      4m1s   True    Release reconciliation succeeded
cozy-cluster-api                 capi-operator               4m1s   True    Release reconciliation succeeded
cozy-cluster-api                 capi-providers              4m1s   True    Release reconciliation succeeded
cozy-dashboard                   dashboard                   4m1s   True    Release reconciliation succeeded
cozy-fluxcd                      cozy-fluxcd                 4m1s   True    Release reconciliation succeeded
cozy-grafana-operator            grafana-operator            4m1s   True    Release reconciliation succeeded
cozy-kamaji                      kamaji                      4m1s   True    Release reconciliation succeeded
cozy-kubeovn                     kubeovn                     4m1s   True    Release reconciliation succeeded
cozy-kubevirt-cdi                kubevirt-cdi                4m1s   True    Release reconciliation succeeded
cozy-kubevirt-cdi                kubevirt-cdi-operator       4m1s   True    Release reconciliation succeeded
cozy-kubevirt                    kubevirt                    4m1s   True    Release reconciliation succeeded
cozy-kubevirt                    kubevirt-operator           4m1s   True    Release reconciliation succeeded
cozy-linstor                     linstor                     4m1s   True    Release reconciliation succeeded
cozy-linstor                     piraeus-operator            4m1s   True    Release reconciliation succeeded
cozy-mariadb-operator            mariadb-operator            4m1s   True    Release reconciliation succeeded
cozy-metallb                     metallb                     4m1s   True    Release reconciliation succeeded
cozy-monitoring                  monitoring                  4m1s   True    Release reconciliation succeeded
cozy-postgres-operator           postgres-operator           4m1s   True    Release reconciliation succeeded
cozy-rabbitmq-operator           rabbitmq-operator           4m1s   True    Release reconciliation succeeded
cozy-redis-operator              redis-operator              4m1s   True    Release reconciliation succeeded
cozy-telepresence                telepresence                4m1s   True    Release reconciliation succeeded
cozy-victoria-metrics-operator   victoria-metrics-operator   4m1s   True    Release reconciliation succeeded
```

## まとめ

結果として、誰にでも提供できる高い再現性を持つ環境を実現でき、意図したとおりに動作することがわかります。
これは、実際に[Cozystack](https://github.com/aenix-io/cozystack)プロジェクトが行っていることであり、あなた自身が無料で試すことができます。

次の記事では、[仮想マシンを実行するためのKubernetesの準備方法](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-2/)と[ボタンをクリックするだけでKubernetesクラスターを実行する方法](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-3/)について説明します。
ご期待ください。きっと面白いはずです！
