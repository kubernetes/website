---
layout: blog
title: "更新: dockershimの削除に関するFAQ"
linkTitle: "dockershimの削除に関するFAQ"
date: 2022-02-17
slug: dockershim-faq
aliases: [ '/ja/dockershim' ]
evergreen: true
---

**この記事は2020年の後半に投稿されたオリジナルの記事[Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/)の更新版です。
この記事にはv1.24のリリースに関する更新を含みます。**

---

この文書では、Kubernetesからの _dockershim_ の削除に関するよくある質問について説明します。
この削除はKubernetes v1.20リリースの一部としてはじめて[発表](/blog/2020/12/08/kubernetes-1-20-release-announcement/)されたものです。
Kubernetes [v1.24のリリース](/releases/#release-v1-24)においてdockershimは実際にKubernetesから削除されました。

これが何を意味するかについては、ブログ記事[Don't Panic: Kubernetes and Docker](/ja/blog/2020/12/02/dont-panic-kubernetes-and-docker/)をご覧ください。

[dockershim削除の影響範囲を確認する](/ja/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)をお読みいただくことで、
dockershimの削除があなたやあなたの組織に与える影響をご判断いただけます。

Kubernetes 1.24リリースに至るまでの間、Kubernetesコントリビューターはこの移行を円滑に行えるようにするために尽力してきました。

- 私たちの[コミットメントと次のステップ](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)を詳述したブログ記事。
- [他のコンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/#container-runtimes)への移行に大きな障害があるかどうかのチェック。
- [dockershimからの移行](/ja/docs/tasks/administer-cluster/migrating-from-dockershim/)ガイドの追加。
- [dockershimの削除とCRI互換ランタイムの使用に関する記事一覧](/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/)の作成。
  このリストには、上に示した文書の一部が含まれており、また、厳選された外部の情報(ベンダーによるガイドを含む)もカバーしています。

### dockershimはなぜKubernetesから削除されたのですか？

Kubernetesの初期のバージョンは、特定のコンテナランタイム上でのみ動作しました。
Docker Engineです。その後、Kubernetesは他のコンテナランタイムと連携するためのサポートを追加しました。
オーケストレーター(Kubernetesなど)と多くの異なるコンテナランタイムの間の相互運用を可能にするため、
CRI標準が[作成](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)されました。
Docker Engineはそのインターフェース(CRI)を実装していないため、Kubernetesプロジェクトは移行を支援する特別なコードを作成し、
その _dockershim_ コードをKubernetes自身の一部としました。

dockershimコードは常に一時的な解決策であることを意図されていました(このためshimと名付けられています)。
コミュニティでの議論や計画については、[dockershimの削除によるKubernetes改良の提案][drkep]にてお読みいただけます。

実際、dockershimのメンテナンスはKubernetesメンテナーにとって大きな負担になっていました。

さらに、dockershimとほとんど互換性のなかった機能、たとえばcgroups v2やユーザーネームスペースなどが、
これらの新しいCRIランタイムに実装されています。Kubernetesからdockershimを削除することで、これらの分野でのさらなる開発が可能になります。

[drkep]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim

### Dockerとコンテナは同じものですか？

DockerはLinuxのコンテナパターンを普及させ、その基盤技術の発展に寄与してきましたが、
Linuxのコンテナ技術そのものはかなり以前から存在しています。
また、コンテナエコシステムはDockerを超えてより広範に発展してきました。
OCIやCRIのような標準は、Dockerの機能の一部を置き換えたり、既存の機能を強化したりすることで、
私達のエコシステムの多くのツールの成長と繁栄を助けてきました。

### 既存のコンテナイメージは引き続き使えるのですか？

はい、`docker build`から生成されるイメージは、全てのCRI実装で動作します。
既存のイメージも全く同じように動作します。

### プライベートイメージについてはどうでしょうか？

はい、すべてのCRIランタイムはKubernetesで使われているものと同一のpull secretsをサポートしており、
PodSpecまたはService Accountを通して利用できます。

### Kubernetes 1.23でDocker Engineを引き続き使用できますか？

はい、1.20で変更されたのは、Docker Engineランタイムを使用している場合に警告ログが[kubelet]起動時に出るようになったことだけです。
この警告は、1.23までのすべてのバージョンで表示されます。
dockershimの削除はKubernetes 1.24で行われました。

Kubernetes v1.24以降を実行している場合は、[Docker Engineを引き続きコンテナランタイムとして利用できますか？](#can-i-still-use-docker-engine-as-my-container-runtime)をご覧ください。
(CRIがサポートされているKubernetesリリースを使用している場合、dockershimから切り替えることができることを忘れないでください。
リリースv1.24からはKubernetesにdockershimが含まれなくなったため、**必ず**切り替えなければなりません)。

[kubelet]: /docs/reference/command-line-tools-reference/kubelet/

### どのCRIの実装を使うべきでしょうか？

これは難しい質問で、様々な要素に依存します。
もしDocker Engineがうまく動いているのであれば、containerdに移行するのは比較的簡単で、
性能もオーバーヘッドも確実に改善されるでしょう。
しかし、他の選択のほうがあなたの環境により適合する場合もありますので、
[CNCF landscape]にあるすべての選択肢を検討されることをおすすめします。

[CNCF landscape]: https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime

#### Docker Engineを引き続きコンテナランタイムとして利用できますか？ {#can-i-still-use-docker-engine-as-my-container-runtime}

第一に、ご自身のPCで開発やテスト用途でDockerを使用している場合、何も変わることはありません。
Kubernetesでどのコンテナランタイムを使っていても、Dockerをローカルで使い続けることができます。
コンテナではこのような相互運用性を実現できます。

MirantisとDockerは、Kubernetesから内蔵のdockershimが削除された後も、
Docker Engineの代替アダプターを維持することに[コミット][mirantis]しています。
代替アダプターの名前は[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)です。

`cri-dockerd`をインストールして、kubeletをDocker Engineに接続するために使用することができます。
詳細については、[Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)を読んでください。

[mirantis]: https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/

### 今現在でプロダクション環境に他のランタイムを使用している例はあるのでしょうか？

Kubernetesプロジェクトが生み出したすべての成果物(Kubernetesバイナリ)は、リリースごとに検証されています。

また、[kind]プロジェクトは以前からcontainerdを使っており、プロジェクトのユースケースにおいて安定性が向上してきています。
kindとcontainerdは、Kubernetesコードベースの変更を検証するために毎日何回も利用されています。
他の関連プロジェクトも同様のパターンを追っており、他のコンテナランタイムの安定性と使いやすさが示されています。
例として、OpenShift 4.xは2019年6月以降、CRI-Oランタイムをプロダクション環境で使っています。

他の事例や参考資料はについては、
containerdとCRI-O(Cloud Native Computing Foundation ([CNCF])の2つのコンテナランタイム)の採用例をご覧ください。

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

[CRI-O]: https://cri-o.io/
[kind]: https://kind.sigs.k8s.io/
[CNCF]: https://cncf.io

### OCIという単語をよく見るのですが、これは何ですか？

OCIは[Open Container Initiative]の略で、コンテナツールとテクノロジー間の数多くのインターフェースの標準化を行った団体です。
彼らはコンテナイメージをパッケージするための標準仕様(OCI image-spec)と、
コンテナを実行するための標準仕様(OCI runtime-spec)をメンテナンスしています。
また、[runc]という形でruntime-specの実装もメンテナンスしており、
これは[containerd]と[CRI-O]の両方でデフォルトの下位ランタイムとなっています。
CRIはこれらの低レベル仕様に基づいて、コンテナを管理するためのエンドツーエンドの標準を提供します。

[Open Container Initiative]: https://opencontainers.org/about/overview/
[runc]: https://github.com/opencontainers/runc
[containerd]: https://containerd.io/

### CRI実装を変更する際に注意すべきことは何ですか？

DockerとほとんどのCRI(containerdを含む)において、下位で使用されるコンテナ化コードは同じものですが、
いくつかの細かい違いが存在します。移行する際に考慮すべき一般的な事項は次のとおりです。

- ログ設定
- ランタイムリソースの制限
- ノード構成スクリプトでdockerコマンドやコントロールソケット経由でDocker Engineを使用しているもの
- `kubectl`のプラグインで`docker` CLIまたはDocker Engineコントロールソケットが必要なもの
- KubernetesプロジェクトのツールでDocker Engineへの直接アクセスが必要なもの(例:廃止された`kube-imagepuller`ツール)
- `registry-mirrors`やinsecureレジストリなどの機能の設定
- その他の支援スクリプトやデーモンでDocker Engineが利用可能であることを想定していてKubernetes外で実行されるもの(モニタリング・セキュリティエージェントなど)
- GPUまたは特別なハードウェア、そしてランタイムおよびKubernetesとそれらハードウェアの統合方法

あなたがKubernetesのリソース要求/制限やファイルベースのログ収集DaemonSetを使用しているのであれば、それらは問題なく動作し続けますが、
`dockerd`の設定をカスタマイズしていた場合は、それを新しいコンテナランタイムに適合させる必要があるでしょう。

他に注意することとしては、システムメンテナンスを実行するようなものや、コンテナ内でイメージをビルドするようなものが動作しなくなります。
前者の場合は、[`crictl`][cr]ツールをdrop-inの置き換えとして使用できます([docker cliからcrictlへのマッピング](https://kubernetes.io/ja/docs/tasks/debug/debug-cluster/crictl/#docker-cli%E3%81%8B%E3%82%89crictl%E3%81%B8%E3%81%AE%E3%83%9E%E3%83%83%E3%83%94%E3%83%B3%E3%82%B0)を参照)。
後者の場合は、[img]、[buildah]、[kaniko]、[buildkit-cli-for-kubectl]のようなDockerを必要としない新しいコンテナビルドの選択肢を使用できます。

[cr]: https://github.com/kubernetes-sigs/cri-tools
[img]: https://github.com/genuinetools/img
[buildah]: https://github.com/containers/buildah
[kaniko]: https://github.com/GoogleContainerTools/kaniko
[buildkit-cli-for-kubectl]: https://github.com/vmware-tanzu/buildkit-cli-for-kubectl

containerdを使っているのであれば、[ドキュメント]を参照して、移行するのにどのような構成が利用可能かを確認するところから始めるといいでしょう。

[ドキュメント]: https://github.com/containerd/cri/blob/master/docs/registry.md

containerdとCRI-OをKubernetesで使用する方法に関しては、[コンテナランタイム]に関するKubernetesのドキュメントを参照してください。

[コンテナランタイム]: /ja/docs/setup/production-environment/container-runtimes/

### さらに質問がある場合どうすればいいでしょうか？

ベンダーサポートのKubernetesディストリビューションを使用している場合、彼らの製品に対するアップグレード計画について尋ねることができます。
エンドユーザーの質問に関しては、[エンドユーザーコミュニティフォーラム](https://discuss.kubernetes.io/)に投稿してください。

dockershimの削除に関する決定については、専用の[GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)で議論することができます。

変更点に関するより詳細な技術的な議論は、[待ってください、DockerはKubernetesで非推奨になったのですか？][dep]という素晴らしいブログ記事も参照してください。

[dep]: https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m

### dockershimを使っているかどうかを検出できるツールはありますか？

はい！[Detector for Docker Socket (DDS)][dds]というkubectlプラグインをインストールすることであなたのクラスターを確認していただけます。
DDSは、アクティブなKubernetesワークロードがDocker Engineソケット(`docker.sock`)をボリュームとしてマウントしているかを検出できます。
さらなる詳細と使用パターンについては、DDSプロジェクトの[README][dds]を参照してください。

[dds]: https://github.com/aws-containers/kubectl-detector-for-docker-socket

### ハグしていただけますか？

はい、私達は引き続きいつでもハグに応じています。🤗🤗🤗
