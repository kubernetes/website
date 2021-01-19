---
title: リファレンス
linkTitle: "リファレンス"
main_menu: true
weight: 70
content_type: concept
---

<!-- overview -->

本セクションには、Kubernetesのドキュメントのリファレンスが含まれています。



<!-- body -->

## APIリファレンス

* [Kubernetes API概要](/docs/reference/using-api/api-overview/) - Kubernetes APIの概要です。
* [Kubernetes APIリファレンス {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)

## APIクライアントライブラリー

プログラミング言語からKubernetesのAPIを呼ぶためには、[クライアントライブラリー](/docs/reference/using-api/client-libraries/)を使うことができます。公式にサポートしているクライアントライブラリー:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## CLIリファレンス

* [kubectl](/docs/reference/kubectl/overview/) - コマンドの実行やKubernetesクラスターの管理に使う主要なCLIツールです。
    * [JSONPath](/ja/docs/reference/kubectl/jsonpath/) - kubectlで[JSONPath記法](https://goessner.net/articles/JsonPath/)を使うための構文ガイドです。
* [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) - セキュアなKubernetesクラスターを簡単にプロビジョニングするためのCLIツールです。

## コンポーネントリファレンス

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - 各ノード上で動作する最も重要なノードエージェントです。kubeletは一通りのPodSpecを受け取り、コンテナーが実行中で正常であることを確認します。
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - Pod、Service、Replication Controller等、APIオブジェクトのデータを検証・設定するREST APIサーバーです。
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Kubernetesに同梱された、コアのコントロールループを埋め込むデーモンです。
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - 単純なTCP/UDPストリームのフォワーディングや、一連のバックエンド間でTCP/UDPのラウンドロビンでのフォワーディングを実行できます。
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - 可用性、パフォーマンス、およびキャパシティを管理するスケジューラーです。
  * [kube-schedulerポリシー](/docs/reference/scheduling/policies)
  * [kube-schedulerプロファイル](/docs/reference/scheduling/profiles)

## 設計のドキュメント

Kubernetesの機能に関する設計ドキュメントのアーカイブです。[Kubernetesアーキテクチャ](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) と[Kubernetesデザイン概要](https://git.k8s.io/community/contributors/design-proposals)から読み始めると良いでしょう。


