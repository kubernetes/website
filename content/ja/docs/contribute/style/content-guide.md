---
title: ドキュメントコンテンツガイド
linktitle: コンテンツガイド
content_type: concept
weight: 10
---

<!-- overview -->

このページでは、Kubernetesのドキュメント上のコンテンツのガイドラインを説明します。

許可されるコンテンツに関して疑問がある場合は、[Kubernetes Slack](https://slack.k8s.io/)の#sig-docsチャンネルに参加して質問してください！

Kubernetes Slackには、<https://slack.k8s.io/> から参加登録ができます。

Kubernetesドキュメントの新しいコンテンツの作成に関する情報については、[スタイルガイド](/docs/contribute/style/style-guide)に従ってください。

<!-- body -->

## 概要

ドキュメントを含むKubernetesのウェブサイトのソースは、[kubernetes/website](https://github.com/kubernetes/website)リポジトリに置かれています。

Kubernetesの主要なドキュメントは`kubernetes/website/content/<language_code>/docs`フォルダに置かれており、これらは[Kubernetesプロジェクト](https://github.com/kubernetes/kubernetes)を対象としています。

## 許可されるコンテンツ

Kubernetesのドキュメントにサードパーティーのコンテンツを掲載することが許されるのは、次の場合のみです。

- コンテンツがKubernetesプロジェクト内のソフトウェアのドキュメントとなる場合
- コンテンツがプロジェクト外のソフトウェアのドキュメントとなるが、Kubernetesを機能させるために必要である場合
- コンテンツがkubernetes.ioの正規のコンテンツであるか、他の場所の正規のコンテンツへのリンクである場合

### サードパーティーのコンテンツ {#third-party-content}

Kubernetesのドキュメントには、Kubernetesプロジェクト([kubernetes](https://github.com/kubernetes)および[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub organizationsに存在するプロジェクト)の適用例が含まれています。

Kubernetesプロジェクト内のアクティブなコンテンツへのリンクは常に許可されます。

Kubernetesを機能させるためには、一部サードパーティーのコンテンツが必要です。たとえば、コンテナランタイム(containerd、CRI-O、Docker)、[ネットワークポリシー](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)(CNI plugin)、[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)、[ロギング](/docs/concepts/cluster-administration/logging/)などです。

ドキュメント内で、Kubernetesプロジェクト外のサードパーティーのオープンソースソフトウェア(OSS)にリンクすることができるのは、Kubernetesを機能させるために必要な場合のみです。

### 情報源が重複するコンテンツ

可能な限り、Kubernetesのドキュメントは正規の情報源にリンクするようにし、情報源が重複してしまうようなホスティングは行いません。

情報源が重複したコンテンツは、メンテナンスするために2倍の労力(あるいはそれ以上！)が必要になり、より早く情報が古くなってしまいます。

{{< note >}}

あなたがKubernetesのプロジェクトのメンテナーであり、ドキュメントのホスティングに関して手助けが必要なときは、[Kubernetes Slackの#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)で教えてください。

{{< /note >}}

### その他の情報

許可されるコンテンツに関して疑問がある場合は、[Kubernetes Slack](https://slack.k8s.io/)の#sig-docsチャンネルに参加して質問してください！

## {{% heading "whatsnext" %}}

* [スタイルガイド](/docs/contribute/style/style-guide)を読む
