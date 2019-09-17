---
reviewers:
title: VolumeSnapshotClass
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

このドキュメントでは、Kubernetesにおける`VolumeSnapshotClass`のコンセプトについて説明します。  
関連する項目として、[Volumeのスナップショット](/docs/concepts/storage/volume-snapshots/)と[ストレージクラス](/docs/concepts/storage/storage-classes)も参照してください。

{{% /capture %}}


{{% capture body %}}

## イントロダクション

`StorageClass`はVolumeをプロビジョンするときに、ストレージの"クラス"に関する情報を記述する方法を提供します。それと同様に、`VolumeSnapshotClass`ではVolumeSnapshotをプロビジョンするときに、ストレージの"クラス"に関する情報を記述する方法を提供します。

## VolumeSnapshotClass リソース

各`VolumeSnapshotClass`は`snapshotter`と`parameters`フィールドを含み、それらは、そのクラスに属する`VolumeSnapshot`が動的にプロビジョンされるときに使われます。

`VolumeSnapshotClass`オブジェクトの名前は重要であり、それはユーザーがどのように特定のクラスをリクエストできるかを示したものです。管理者は初めて`VolumeSnapshotClass`オブジェクトを作成するときに、その名前と他のパラメーターをセットし、そのオブジェクトは一度作成されるとそのあと更新することができません。

管理者は、バインド対象のクラスを1つもリクエストしないようなVolumeSnapshotのために、デフォルトの`VolumeSnapshotClass`を指定することができます。

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
snapshotter: csi-hostpath
parameters:
```

### Snapshotter

VolumeSnapshotClassは、VolumeSnapshotをプロビジョンするときに何のCSIボリュームプラグインを使うか決定するための`snapshotter`フィールドを持っています。このフィールドは必須となります。

## Parameters

VolumeSnapshotClassは、そのクラスに属するVolumeSnapshotを指定するパラメータを持っています。
`snapshotter`に応じて様々なパラメータを使用できます。

{{% /capture %}}
