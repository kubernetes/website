---
title: リファレンス
linkTitle: "リファレンス"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

本セクションには、Kubernetesのドキュメントのリファレンスが含まれています。

{{% /capture %}}

{{% capture body %}}

## APIリファレンス

* [Kubernetes API概要](/docs/reference/using-api/api-overview/) - Kubernetes APIの概要です。
* Kubernetes APIバージョン
  * [1.17](/docs/reference/generated/kubernetes-api/v1.17/)
  * [1.16](/docs/reference/generated/kubernetes-api/v1.16/)
  * [1.15](/docs/reference/generated/kubernetes-api/v1.15/)
  * [1.14](/docs/reference/generated/kubernetes-api/v1.14/)
  * [1.13](/docs/reference/generated/kubernetes-api/v1.13/)

## APIクライアントライブラリー

プログラミング言語からKubernetesのAPIを呼ぶためには、[クライアントライブラリー](/docs/reference/using-api/client-libraries/)を使うことができます。公式にサポートしているクライアントライブラリー:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## CLIリファレンス

* [kubectl](/docs/user-guide/kubectl-overview) - コマンドの実行やKubernetesクラスターの管理に使う主要なCLIツールです。
    * [JSONPath](/docs/user-guide/jsonpath/) - kubectlで[JSONPath記法](http://goessner.net/articles/JsonPath/)を使うための構文ガイドです。
* [kubeadm](/docs/admin/kubeadm/) - セキュアなKubernetesクラスターを簡単にプロビジョニングするためのCLIツールです。
* [kubefed](/docs/admin/kubefed/) - 連合型クラスターを管理するのに役立つCLIツールです。

## 設定リファレンス

* [kubelet](/docs/admin/kubelet/) - 各ノード上で動作する最も重要なノードエージェントです。kubeletは一通りのPodSpecを受け取り、コンテナーが実行中で正常であることを確認します。
* [kube-apiserver](/docs/admin/kube-apiserver/) - Pod、Service、Replication Controller等、APIオブジェクトのデータを検証・設定するREST APIサーバーです。
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Kubernetesに同梱された、コアのコントロールループを埋め込むデーモンです。
* [kube-proxy](/docs/admin/kube-proxy/) - 単純なTCP/UDPストリームのフォワーディングや、一連のバックエンド間でTCP/UDPのラウンドロビンでのフォワーディングを実行できます。
* [kube-scheduler](/docs/admin/kube-scheduler/) - 可用性、パフォーマンス、およびキャパシティを管理するスケジューラーです。

## 設計のドキュメント

Kubernetesの機能に関する設計ドキュメントのアーカイブです。[Kubernetesアーキテクチャ](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) と[Kubernetesデザイン概要](https://git.k8s.io/community/contributors/design-proposals)から読み始めると良いでしょう。

{{% /capture %}}
