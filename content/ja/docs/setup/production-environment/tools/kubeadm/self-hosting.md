---
title: コントロールプレーンをセルフホストするようにkubernetesクラスターを構成する
content_type: concept
weight: 100
---

<!-- overview -->

### コントロールプレーンのセルフホスティング {#self-hosting}

kubeadmを使用すると、セルフホスト型のKubernetesコントロールプレーンを実験的に作成できます。これはAPIサーバー、コントローラーマネージャー、スケジューラーなどの主要コンポーネントは、静的ファイルを介してkubeletで構成された[static pods](/docs/tasks/configure-pod-container/static-pod/)ではなく、Kubernetes APIを介して構成された[DaemonSet pods](/ja/docs/concepts/workloads/controllers/daemonset/)として実行されることを意味します。

セルフホスト型クラスターを作成する場合は[kubeadm alpha selfhosting pivot](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-selfhosting)を参照してください。



<!-- body -->

#### 警告

{{< caution >}}
この機能により、クラスターがサポートされていない状態になり、kubeadmがクラスターを管理できなくなります。これには`kubeadm upgrade`が含まれます。
{{< /caution >}}

1. 1.8以降のセルフホスティングには、いくつかの重要な制限があります。特に、セルフホスト型クラスタは、手動の介入なしにコントロールプレーンのノード再起動から回復することはできません。

1. デフォルトでは、セルフホスト型のコントロールプレーンのポッドは、[`hostPath`](/docs/concepts/storage/volumes/#hostpath)ボリュームからロードされた資格情報に依存しています。最初の作成を除いて、これらの資格情報はkubeadmによって管理されません。

1. コントロールプレーンのセルフホストされた部分にはetcdが含まれていませんが、etcdは静的ポッドとして実行されます。

#### プロセス

セルフホスティングのブートストラッププロセスは、[kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting)に記載されています。

要約すると、`kubeadm alpha selfhosting`は次のように機能します。

  1. 静的コントロールプレーンのブートストラップが起動し、正常になるのを待ちます。これは`kubeadm init`のセルフホスティングを使用しないプロセスと同じです。

  1. 静的コントロールプレーンのポッドのマニフェストを使用して、セルフホスト型コントロールプレーンを実行する一連のDaemonSetのマニフェストを構築します。また、必要に応じてこれらのマニフェストを変更します。たとえば、シークレット用の新しいボリュームを追加します。

  1. `kube-system`のネームスペースにDaemonSetを作成し、ポッドの結果が起動されるのを待ちます。

  1. セルフホスト型のポッドが操作可能になると、関連する静的ポッドが削除され、kubeadmは次のコンポーネントのインストールに進みます。これによりkubeletがトリガーされて静的ポッドが停止します。

  1. 元の静的なコントロールプレーンが停止すると、新しいセルフホスト型コントロールプレーンはリスニングポートにバインドしてアクティブになります。


