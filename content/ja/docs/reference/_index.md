---
title: リファレンス
linkTitle: "リファレンス"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

本セクションには、Kubernetesのドキュメントのリファレンスが含まれています。

<!-- body -->

## APIリファレンス

* [標準化用語集](/ja/docs/reference/glossary) - Kubernetesの用語の包括的で標準化されたリストです。

* [Kubernetes APIリファレンス](/docs/reference/using-api/)
* [Kubernetes {{< param "version" >}}の単一ページのAPIリファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Kubernetes APIの使用](/ja/docs/reference/using-api/) - KubernetesのAPIの概要です。
* [API アクセスコントロール](/docs/reference/access-authn-authz/) - KubernetesがAPIアクセスをどのように制御するかの詳細です。
* [よく知られたラベル、アノテーション、テイント](/docs/reference/labels-annotations-taints/)

## 公式にサポートされているクライアントライブラリ

プログラミング言語からKubernetesのAPIを呼ぶためには、[クライアントライブラリ](/docs/reference/using-api/client-libraries/)を使うことができます。公式にサポートしているクライアントライブラリ:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)

## CLIリファレンス

* [kubectl](/ja/docs/reference/kubectl/) - コマンドの実行やKubernetesクラスターの管理に使う主要なCLIツールです。
  * [JSONPath](/ja/docs/reference/kubectl/jsonpath/) - kubectlで[JSONPath記法](https://goessner.net/articles/JsonPath/)を使うための構文ガイドです。
* [kubeadm](/ja/docs/reference/setup-tools/kubeadm/) - セキュアなKubernetesクラスターを簡単にプロビジョニングするためのCLIツールです。

## コンポーネントリファレンス

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - 各ノード上で動作する最も重要なノードエージェントです。kubeletは一通りのPodSpecを受け取り、コンテナが実行中で正常であることを確認します。
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - Pod、Service、Replication Controller等、APIオブジェクトのデータを検証・設定するREST APIサーバーです。
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Kubernetesに同梱された、コアのコントロールループを埋め込むデーモンです。
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - 単純なTCP/UDPストリームのフォワーディングや、一連のバックエンド間でTCP/UDPのラウンドロビンでのフォワーディングを実行できます。
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - 可用性、パフォーマンス、およびキャパシティを管理するスケジューラーです。
  * [kube-schedulerポリシー](/ja/docs/reference/scheduling/policies)
  * [Schedulerプロファイル](/ja/docs/reference/scheduling/config#プロファイル)

* コントロールプレーンとワーカーノードで開いておくべき[ポートとプロトコル](/ja/docs/reference/networking/ports-and-protocols/)の一覧

## 設定APIリファレンス

このセクションでは、Kubernetesのコンポーネントやツールを設定するのに使われている「未公開」のAPIのドキュメントをまとめています。
クラスターを使ったり管理したりするユーザーやオペレーターにとって必要不可欠ではありますが、これらのAPIの大半はRESTful方式のAPIサーバーでは提供されません。

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)および
* [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/)および
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver encryption (v1)](/docs/reference/config-api/apiserver-encryption.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/)および
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)、
  [kubelet credential providers (v1beta1)](/docs/reference/config-api/kubelet-credentialprovider.v1beta1/)および
  [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/)、
  [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)および
  [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)および
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
## kubeadmの設定APIリファレンス

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)

## 設計のドキュメント

Kubernetesの機能に関する設計ドキュメントのアーカイブです。[Kubernetesアーキテクチャ](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) と[Kubernetesデザイン概要](https://git.k8s.io/design-proposals-archive)から読み始めると良いでしょう。
