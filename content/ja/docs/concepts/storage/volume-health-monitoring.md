---
title: ボリュームヘルスモニタリング
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

{{< glossary_tooltip text="CSI" term_id="csi" >}}ボリュームヘルスモニタリングにより、CSIドライバーは、基盤となるストレージシステムから異常なボリューム状態を検出し、それらを{{< glossary_tooltip text="PVC" term_id= "persistent-volume-claim" >}}または{{< glossary_tooltip text="Pod" term_id="pod" >}}のイベントとして報告できます。
<!-- body -->

## ボリュームヘルスモニタリング

Kubernetes _volume health monitoring_ は、KubernetesがContainerStorageInterface(CSI)を実装する方法の一部です。ボリュームヘルスモニタリング機能は、外部のヘルスモニターコントローラーと{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}の2つのコンポーネントで実装されます。

CSIドライバーがコントローラー側からのボリュームヘルスモニタリング機能をサポートしている場合、CSIボリュームで異常なボリューム状態が検出されると、関連する{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}(PVC)でイベントが報告されます。

外部ヘルスモニター{{< glossary_tooltip text="コントローラー" term_id="controller" >}}も、ノード障害イベントを監視します。`enable-node-watcher`フラグをtrueに設定することで、ノード障害の監視を有効にできます。外部ヘルスモニターがノード障害イベントを検出すると、コントローラーは、このPVCを使用するポッドが障害ノード上にあることを示すために、PVCでイベントが報告されることを報告します。

CSIドライバーがノード側からのボリュームヘルスモニタリング機能をサポートしている場合、CSIボリュームで異常なボリューム状態が検出されると、PVCを使用するすべてのPodでイベントが報告されます。さらに、ボリュームヘルス情報はKubelet VolumeStatsメトリクスとして公開されます。新しいメトリックkubelet_volume_stats_health_status_abnormalが追加されました。このメトリックには`namespace`と`persistentvolumeclaim`の2つのラベルが含まれます。カウントは1または0です。1はボリュームが異常であることを示し、0はボリュームが正常であることを示します。詳細については、[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes)を確認してください。

{{< note >}}
ノード側からこの機能を使用するには、`CSIVolumeHealth`[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)を有効にする必要があります。
{{< /note >}}

## {{% heading "whatsnext" %}}

[CSIドライバーのドキュメント](https://kubernetes-csi.github.io/docs/drivers.html)を参照して、この機能を実装しているCSIドライバーを確認してください。
