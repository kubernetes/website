---
title: CSI Volume Cloning
content_type: concept
weight: 70
---

<!-- overview -->

このドキュメントではKubernetesで既存のCSIボリュームの複製についてのコンセプトを説明します。このページを読む前にあらかじめ[ボリューム](/docs/concepts/storage/volumes)についてよく理解していることが望ましいです。




<!-- body -->

## イントロダクション

{{<glossary_tooltip text = "CSI" term_id = "csi">}}のボリューム複製機能は、ユーザーが{{<glossary_tooltip text = "ボリューム" term_id = "volume">}}の複製を作成することを示す`dataSource`フィールドで既存の{{<glossary_tooltip text = "PVC" term_id = "persistent-volume-claim">}}を指定するためのサポートを追加します。

複製は既存のKubernetesボリュームの複製として定義され、標準のボリュームと同じように使用できます。唯一の違いは、プロビジョニング時に「新しい」空のボリュームを作成するのではなく、バックエンドデバイスが指定されたボリュームの正確な複製を作成することです。

複製の実装は、Kubernetes APIの観点からは新しいPVCの作成時に既存のPVCをdataSourceとして指定する機能を追加するだけです。ソースPVCはバインドされており、使用可能でなければなりません(使用中ではありません)。

この機能を使用する場合、ユーザーは次のことに注意する必要があります:

* 複製のサポート(`VolumePVCDataSource`)はCSIドライバーのみです。
* 複製のサポートは動的プロビジョニングのみです。
* CSIドライバーはボリューム複製機能を実装している場合としていない場合があります。
* PVCは複製先のPVCと同じ名前空間に存在する場合にのみ複製できます(複製元と複製先は同じ名前空間になければなりません)。
* 複製は同じストレージクラス内でのみサポートされます。
    - 宛先ボリュームは、ソースと同じストレージクラスである必要があります。
    - デフォルトのストレージクラスを使用でき、仕様ではstorageClassNameを省略できます。
* 複製は同じVolumeMode設定を使用する2つのボリューム間でのみ実行できます(ブロックモードのボリュームを要求する場合、ソースもブロックモードである必要があります)。


## プロビジョニング

複製は同じ名前空間内の既存のPVCを参照するdataSourceを追加すること以外は他のPVCと同様にプロビジョニングされます。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cloning
  resources:
    requests:
      storage: 5Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

{{< note >}}
`spec.resources.requests.storage`に容量の値を指定する必要があります。指定する値は、ソースボリュームの容量と同じかそれ以上である必要があります。
{{< /note >}}

このyamlの作成結果は指定された複製元である`pvc-1`と全く同じデータを持つ`clone-of-pvc-1`という名前の新しいPVCです。

## 使い方

新しいPVCが使用可能になると、複製されたPVCは他のPVCと同じように利用されます。またこの時点で新しく作成されたPVCは独立したオブジェクトであることが期待されます。元のdataSource PVCを考慮せず個別に利用、複製、スナップショット、削除できます。これはまた複製元が新しく作成された複製にリンクされておらず、新しく作成された複製に影響を与えずに変更または削除できることを意味します。


