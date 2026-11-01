---
layout: blog
title: 'Kubernetes史上最大の移行作業を完了'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
translator: >
  Taisuke Okamoto (IDCフロンティア),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

Kubernetes v1.7以降、Kubernetesプロジェクトは、クラウドプロバイダーとの統合機能をKubernetesのコアコンポーネントから分離するという野心的な目標を追求してきました([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md))。
この統合機能はKubernetesの初期の開発と成長に重要な役割を果たしつつも、２つの重要な要因によってその分離が推進されました。
1つは、何百万行ものGoコードにわたってすべてのクラウドプロバイダーのネイティブサポートを維持することの複雑さが増大していたこと、もう1つは、Kubernetesを真にベンダーニュートラルなプラットフォームとして確立したいという願望です。

多くのリリースを経て、すべてのクラウドプロバイダー統合が、Kubernetesのコアリポジトリから外部プラグインに正常に移行されたことを喜ばしく思います。
当初の目的を達成したことに加えて、約150万行のコードを削除し、コアコンポーネントのバイナリサイズを約40%削減することで、Kubernetesを大幅に合理化しました。

この移行は、影響を受けるコンポーネントが多数あり、Google Cloud、AWS、Azure、OpenStack、vSphereの5つの初期クラウドプロバイダーの組み込み統合に依存していた重要なコードパスがあったため、複雑で長期にわたる作業となりました。
この移行を成功させるために、私たちは4つの新しいサブシステムを一から構築する必要がありました。

1. **クラウドコントローラーマネージャー** ([KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md))
2. **APIサーバーネットワークプロキシ** ([KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy))
3. **kubeletクレデンシャルプロバイダープラグイン** ([KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers))
4. **[CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)を使用するストレージの移行** ([KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md))

各サブシステムは、組み込み機能と同等の機能を実現するために不可欠であり、安全で信頼できる移行パスを使用して各サブシステムをGAレベルの成熟度にするために、いくつかのリリースが必要でした。
以下に、各サブシステムの詳細を説明します。

### クラウドコントローラーマネージャー

クラウドコントローラーマネージャーは、この取り組みで導入された最初の外部コンポーネントであり、`kube-controller-manager`と`kubelet`のうち、クラウドAPIと直接やり取りする機能を置き換えるものです。
この重要なコンポーネントは、ノードが実行されているクラウドのリージョンとゾーンを示すメタデータラベルや、クラウドプロバイダーのみが知っているIPアドレスを適用することにより、ノードを初期化する役割を担っています。
さらに、LoadBalancerタイプのServiceに対してクラウドロードバランサーをプロビジョニングするサービスコントローラーも実行します。

![Kubernetesのコンポーネント](/images/docs/components-of-kubernetes.svg)

詳細については、Kubernetesドキュメントの[クラウドコントローラーマネージャー](/ja/docs/concepts/architecture/cloud-controller/)を参照してください。

### APIサーバーネットワークプロキシ

2018年にSIG API Machineryと共同で開始されたAPIサーバーネットワークプロキシプロジェクトは、`kube-apiserver`内のSSHトンネラー機能を置き換えることを目的としていました。
このトンネラーは、Kubernetesのコントロールプレーンとノードとのトラフィックを安全にプロキシするために使用されていましたが、これらのSSHトンネルを確立するために、`kube-apiserver`内に組み込まれたプロバイダー固有の実装の詳細に大きく依存していました。

現在、APIサーバーネットワークプロキシは、`kube-apiserver`内のGAレベルの拡張ポイントとなっています。
これは、APIサーバーからノードへのトラフィックを安全なプロキシを介してルーティングできる汎用的なプロキシメカニズムを提供し、APIサーバーが実行されているクラウドプロバイダーを認識する必要がなくなりました。
このプロジェクトでは、本番環境での採用が進んでいるKonnectivityプロジェクトも導入されました。

APIサーバーネットワークプロキシの詳細については、[README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme)を参照してください。

### kubeletのクレデンシャルプロバイダープラグイン

`kubelet`のクレデンシャルプロバイダープラグインは、Google Cloud、AWS、またはAzureでホストされているイメージレジストリのクレデンシャルを動的に取得する`kubelet`の組み込み機能を置き換えるために開発されました。
従来の機能は便利で、`kubelet`がGCR、ECR、またはACRからイメージを取得するための短期間のトークンをシームレスに取得できるようにしていました。
しかし、Kubernetesの他の領域と同様に、これをサポートするには、`kubelet`が異なるクラウド環境とAPIについて特定の知識を持つ必要がありました。

2019年に導入されたクレデンシャルプロバイダープラグインメカニズムは、`kubelet`が様々なクラウドでホストされているイメージのクレデンシャルを動的に提供するプラグインバイナリを実行するための汎用的な拡張ポイントを提供します。
この拡張性により、`kubelet`の短期間のトークンを取得する機能が、最初の3つのクラウドプロバイダーを超えて拡張されました。

詳細については、[認証されたイメージプルのためのkubeletクレデンシャルプロバイダー](/ja/docs/concepts/containers/images/#kubelet-credential-provider)を参照してください。

### ストレージプラグインのKubernetesコアからCSIへの移行

Container Storage Interface(CSI)は、Kubernetesやそのほかのコンテナオーケストレーターにおいてブロックおよびファイルストレージシステムを管理するためのコントロールプレーン標準であり、1.13でGAになりました。
これは、Kubernetesに直接組み込まれていたボリュームプラグインを、Kubernetesクラスター内のPodとして実行できるドライバーに置き換えるために設計されました。
これらのドライバーは、Kubernetes APIを介して`kube-controller-manager`ストレージコントローラーと通信し、ローカルのgRPCエンドポイントを介して`kubelet`と通信します。
現在、すべての主要なクラウドとストレージベンダーにわたって100以上のCSIドライバーが利用可能であり、Kubernetesでステートフルなワークロードが現実のものとなっています。

ただし、KubernetesコアのボリュームAPIの既存のすべてのユーザーをどのように扱うかという大きな課題が残っていました。
APIの後方互換性を維持するために、Kubernetesコアのボリューム APIを同等のCSI APIに変換するAPIトランスレーション層をコントローラーに組み込みました。
これにより、すべてのストレージ操作をCSIドライバーにリダイレクトすることができ、APIを削除せずにKubernetesコアのボリュームプラグインのコードを削除する道が開けました。

Kubernetesコアのストレージの移行の詳細については、[Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/)を参照してください。

## 今後の展望

この移行は、ここ数年のSIG Cloud Providerがもっとも注力してきたことでした。
この重要なマイルストーンを達成したことで、これまでに構築してきた外部サブシステムを活用して、Kubernetesとクラウドプロバイダーをより良く統合するための新しい革新的な方法を模索する取り組みにシフトしていきます。
これには、クラスター内のノードがパブリッククラウドとプライベートクラウドの両方で実行できるハイブリッド環境でKubernetesをより賢くすることや、外部プロバイダーの開発者が統合の取り組みを簡素化・合理化するためのより良いツールとフレームワークを提供することが含まれます。

新機能やツール、フレームワークの開発が進む一方で、SIG Cloud Providerはテストの重要性も忘れてはいません。
SIGの将来の活動のもう1つの重点分野は、より多くのプロバイダーを含めるためのクラウドコントローラーテストの改善です。
この取り組みの最終目標は、できるだけ多くのプロバイダーを含むテストフレームワークを作成し、Kubernetesコミュニティに対して、Kubernetes環境に関する最高レベルの信頼性を提供することです。

v1.29より前のバージョンのKubernetesを使用していて、まだ外部クラウドプロバイダーに移行していない場合は、以前のブログ記事[Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components](/blog/2023/12/14/cloud-provider-integration-changes/)を確認することをおすすめします。
この記事では、私たちが行った変更について詳細な情報を提供し、外部プロバイダーへの移行方法についてガイダンスを提供しています。
v1.31以降、Kubernetesコアのクラウドプロバイダーは永続的に無効化され、Kubernetesのコアコンポーネントから削除されます。

貢献に興味がある方は、[隔週のSIGミーティング](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)にぜひご参加ください！
