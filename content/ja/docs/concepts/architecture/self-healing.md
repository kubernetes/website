---
title: Kubernetesの自己修復機能
content_type: concept
weight: 50
feature:
  title: 自己修復
  anchor: 障害からの自動回復
  description: >
    Kubernetesは、クラッシュしたコンテナを再起動し、必要に応じてPod全体を置き換え、広範な障害に対してストレージを再アタッチし、ノードレベルでも自己修復を行うためにノードオートスケーラーと統合することができます。
---
<!-- overview -->
Kubernetesは、ワークロードの健全性と可用性を維持するための自己修復機能を備えています。
ノードが使用不能になった際にはワークロードを再スケジュールし、障害の発生したコンテナを自動的に置き換え、システムの望ましい状態が維持されるようにします。

<!-- body -->

## 自己修復機能 {#self-healing-capabilities}

- **コンテナレベルの再起動:** Pod内のコンテナが失敗した場合、Kubernetesは[`restartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)に基づいてコンテナを再起動します。

- **レプリカの置換:** [Deployment](/ja/docs/concepts/workloads/controllers/deployment/)や[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)に属するPodが失敗した場合、Kubernetesは指定されたレプリカ数を維持するために代替のPodを作成します。[DaemonSet](/ja/docs/concepts/workloads/controllers/daemonset/)に属するPodが失敗した場合、コントロールプレーンが同じノード上で実行するための代替Podを作成します。

- **永続ストレージの復旧:** PersistentVolume(PV)をアタッチしたPodが実行されているノードが障害を起こした場合、Kubernetesはそのボリュームを別のノード上の新しいPodに再アタッチできます。

- **Serviceにおける負荷分散:** [Service](/ja/docs/concepts/services-networking/service/)の背後にあるPodが失敗した場合、KubernetesはそのPodをServiceのエンドポイントから自動的に除外し、正常なPodのみにトラフィックをルーティングします。

Kubernetesの自己修復を実現する主なコンポーネントには、次のようなものがあります:

- **[kubelet](/docs/concepts/architecture/#kubelet):** コンテナが実行されていることを確認し、失敗したコンテナを再起動します。

- **ReplicaSet、StatefulSet、DaemonSetコントローラー:** Podの望ましいレプリカ数を維持します。

- **PersistentVolumeコントローラー:** ステートフルなワークロードに対してボリュームのアタッチおよびデタッチを管理します。

## 考慮事項 {#considerations}

- **ストレージの障害:** 永続ボリュームが利用不能になった場合、復旧のための手順が必要になることがあります。

- **アプリケーションのエラー:** Kubernetesはコンテナを再起動できますが、アプリケーション内部の問題は別途対処する必要があります。

## {{% heading "whatsnext" %}}

- [Pod](/ja/docs/concepts/workloads/pods/)について詳しく読む
- [Kubernetesコントローラー](/ja/docs/concepts/architecture/controller/)について学ぶ
- [PersistentVolume](/ja/docs/concepts/storage/persistent-volumes/)を探る
- [ノードオートスケーリング](/docs/concepts/cluster-administration/node-autoscaling/)について読む。ノードのオートスケーリングは、クラスター内のノードが障害を起こした場合にも、自動的な修復を提供します。