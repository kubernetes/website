---
title: コンピュート、ストレージ、ネットワーキングの拡張機能
weight: 30
no_list: true
---

このセクションでは、Kubernetes自体の一部としては提供されていない、クラスターへの拡張について説明します。
これらの拡張を使用して、クラスター内のノードを強化したり、Pod同士をつなぐネットワークファブリックを提供したりすることができます。

* [CSI](/ja/docs/concepts/storage/volumes/#csi)および[FlexVolume](/ja/docs/concepts/storage/volumes/#flexvolume)ストレージプラグイン

  {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI)プラグインは、新しい種類のボリュームをサポートするためのKubernetesの拡張方法を提供します。
  これらのボリュームは、永続性のある外部ストレージにバックアップすることができます。また、一時的なストレージを提供することも、ファイルシステムのパラダイムを使用して、情報への読み取り専用のインターフェースを提供することもできます。

  Kubernetesには、Kubernetes v1.23から非推奨とされている(CSIに置き換えられる)[FlexVolume](/ja/docs/concepts/storage/volumes/#flexvolume)プラグインへのサポートも含まれています。

  FlexVolumeプラグインは、Kubernetesがネイティブにサポートしていないボリュームタイプをマウントすることをユーザーに可能にします。
  FlexVolumeストレージに依存するPodを実行すると、kubeletはバイナリプラグインを呼び出してボリュームをマウントします。
  アーカイブされた[FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)デザインの提案には、このアプローチの詳細が記載されています。

  [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)には、ストレージプラグインに関する一般的な情報が含まれています。

* [デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  デバイスプラグインは、ノードが(`cpu`や`memory`などの組み込みノードリソースに加えて)新しいNode設備を発見し、これらのカスタムなノードローカル設備を要求するPodに提供することを可能にします。

* [ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  ネットワークプラグインにより、Kubernetesはさまざまなネットワーキングのトポロジーや技術を扱うことができます。
  動作するPodネットワークを持ち、Kubernetesネットワークモデルの他の側面をサポートするためには、Kubernetesクラスターに _ネットワークプラグイン_ が必要です。

  Kubernetes {{< skew currentVersion >}}は、{{< glossary_tooltip text="CNI" term_id="cni" >}}ネットワークプラグインと互換性があります。
