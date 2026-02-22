---
title: ストレージ容量
content_type: concept
weight: 80
---

<!-- overview -->

ストレージ容量は、Podが実行されるノードごとに制限があったり、大きさが異なる可能性があります。たとえば、NASがすべてのノードからはアクセスできなかったり、初めからストレージがノードローカルでしか利用できない可能性があります。

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

このページでは、Kubernetesがストレージ容量を追跡し続ける方法と、スケジューラーがその情報を利用して、残りの未作成のボリュームのために十分なストレージ容量へアクセスできるノード上にどのようにPodをスケジューリングするかについて説明します。もしストレージ容量の追跡がなければ、スケジューラーは、ボリュームをプロビジョニングするために十分な容量のないノードを選択してしまい、スケジューリングの再試行が複数回行われてしまう恐れがあります。

ストレージ容量の追跡は、{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}(CSI)向けにサポートされており、CSIドライバーのインストール時に[有効にする必要があります](#enabling-storage-capacity-tracking)。

<!-- body -->

## API

この機能には、以下の2つのAPI拡張があります。

- [CSIStorageCapacity](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#csistoragecapacity-v1alpha1-storage-k8s-io)オブジェクト: このオブジェクトは、CSIドライバーがインストールされた名前空間に生成されます。各オブジェクトには1つのストレージクラスに対する容量の情報が含まれ、そのストレージに対してどのノードがアクセス権を持つかが定められています。

- [`CSIDriverSpec.StorageCapacity`フィールド](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#csidriverspec-v1-storage-k8s-io): `true`に設定すると、Kubernetesのスケジューラーが、CSIドライバーを使用するボリュームに対してストレージ容量を考慮するようになります。

## スケジューリング

ストレージ容量の情報がKubernetesのスケジューラーで利用されるのは、以下のすべての条件を満たす場合です。

- `CSIStorageCapacity`フィーチャーゲートがtrueである
- Podがまだ作成されていないボリュームを使用する時
- そのボリュームが、CSIドライバーを参照し、[volume binding mode](/docs/concepts/storage/storage-classes/#volume-binding-mode)に`WaitForFirstConsumer`を使う{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}を使用している
- ドライバーに対する`CSIDriver`オブジェクトの`StorageCapacity`がtrueに設定されている

その場合、スケジューラーはPodに対して、十分なストレージ容量が利用できるノードだけを考慮するようになります。このチェックは非常に単純で、ボリュームのサイズと、`CSIStorageCapacity`オブジェクトに一覧された容量を、ノードを含むトポロジーで比較するだけです。

volume binding modeが`Immediate`のボリュームの場合、ストレージドライバーはボリュームを使用するPodとは関係なく、ボリュームを作成する場所を決定します。次に、スケジューラーはボリュームが作成された後、Podをボリュームが利用できるノードにスケジューリングします。

[CSI ephemeral volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)の場合、スケジューリングは常にストレージ容量を考慮せずに行われます。このような動作になっているのは、このボリュームタイプはノードローカルな特別なCSIドライバーでのみ使用され、そこでは特に大きなリソースが必要になることはない、という想定に基づいています。

## 再スケジューリング

`WaitForFirstConsumer`ボリュームがあるPodに対してノードが選択された場合は、その決定はまだ一時的なものです。次のステップで、CSIストレージドライバーに対して、選択されたノード上でボリュームが利用可能になることが予定されているというヒントを使用してボリュームの作成を要求します。

Kubernetesは古い容量の情報をもとにノードを選択する場合があるため、実際にはボリュームが作成できないという可能性が存在します。その場合、ノードの選択がリセットされ、KubernetesスケジューラーはPodに割り当てるノードを再び探します。

## 制限

ストレージ容量を追跡することで、1回目の試行でスケジューリングが成功する可能性が高くなります。しかし、スケジューラーは潜在的に古い情報に基づいて決定を行う可能性があるため、成功を保証することはできません。通常、ストレージ容量の情報が存在しないスケジューリングと同様のリトライの仕組みによって、スケジューリングの失敗に対処します。

スケジューリングが永続的に失敗する状況の1つは、Podが複数のボリュームを使用する場合で、あるトポロジーのセグメントで1つのボリュームがすでに作成された後、もう1つのボリュームのために十分な容量が残っていないような場合です。この状況から回復するには、たとえば、容量を増加させたり、すでに作成されたボリュームを削除するなどの手動での対応が必要です。この問題に自動的に対処するためには、まだ[追加の作業](https://github.com/kubernetes/enhancements/pull/1703)が必要となっています。

## ストレージ容量の追跡を有効にする {#enabling-storage-capacity-tracking}

ストレージ容量の追跡は*アルファ機能*であり、`CSIStorageCapacity`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)と`storage.k8s.io/v1alpha1` {{< glossary_tooltip text="API group" term_id="api-group" >}}を有効にした場合にのみ、有効化されます。詳細については、`--feature-gates`および`--runtime-config` [kube-apiserverパラメーター](/docs/reference/command-line-tools-reference/kube-apiserver/)を参照してください。

Kubernetesクラスターがこの機能をサポートしているか簡単に確認するには、以下のコマンドを実行して、CSIStorageCapacityオブジェクトを一覧表示します。

```shell
kubectl get csistoragecapacities --all-namespaces
```

クラスターがCSIStorageCapacityをサポートしていれば、CSIStorageCapacityのリストが表示されるか、次のメッセージが表示されます。
```
No resources found
```

もしサポートされていなければ、代わりに次のエラーが表示されます。

```
error: the server doesn't have a resource type "csistoragecapacities"
```

クラスター内で機能を有効化することに加えて、CSIドライバーもこの機能をサポートしている必要があります。詳細については、各ドライバーのドキュメントを参照してください。

## {{% heading "whatsnext" %}}

 - 設計に関するさらなる情報について知るために、[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md)を読む。
- この機能の今後の開発に関する情報について知るために、[enhancement tracking issue #1472](https://github.com/kubernetes/enhancements/issues/1472)を参照する。
- [Kubernetesのスケジューラー](/ja/docs/concepts/scheduling-eviction/kube-scheduler/)についてもっと学ぶ。
