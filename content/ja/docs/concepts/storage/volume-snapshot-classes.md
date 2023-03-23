---
reviewers:
title: VolumeSnapshotClass
content_type: concept
weight: 61 # just after volume snapshots
---

<!-- overview -->

このドキュメントでは、Kubernetesにおける`VolumeSnapshotClass`のコンセプトについて説明します。  
関連する項目として、[Volumeのスナップショット](/docs/concepts/storage/volume-snapshots/)と[ストレージクラス](/docs/concepts/storage/storage-classes)も参照してください。




<!-- body -->

## イントロダクション

`StorageClass`はVolumeをプロビジョンするときに、ストレージの"クラス"に関する情報を記述する方法を提供します。それと同様に、`VolumeSnapshotClass`ではVolumeSnapshotをプロビジョンするときに、ストレージの"クラス"に関する情報を記述する方法を提供します。

## VolumeSnapshotClass リソース

各`VolumeSnapshotClass`は`driver`、`deletionPolicy`と`parameters`フィールドを含み、それらは、そのクラスに属する`VolumeSnapshot`が動的にプロビジョンされるときに使われます。

`VolumeSnapshotClass`オブジェクトの名前は重要であり、それはユーザーがどのように特定のクラスをリクエストできるかを示したものです。管理者は初めて`VolumeSnapshotClass`オブジェクトを作成するときに、その名前と他のパラメーターをセットし、そのオブジェクトは一度作成されるとそのあと更新することができません。

管理者は、バインド対象のクラスを1つもリクエストしないようなVolumeSnapshotのために、デフォルトの`VolumeSnapshotClass`を指定することができます。

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

### Driver

VolumeSnapshotClassは、VolumeSnapshotをプロビジョンするときに何のCSIボリュームプラグインを使うか決定するための`driver`フィールドを持っています。このフィールドは必須となります。

### DeletionPolicy

VolumeSnapshotClassにはdeletionPolicyがあります。これにより、バインドされている `VolumeSnapshot`オブジェクトが削除されるときに、`VolumeSnapshotContent`がどうなるかを設定することができます。VolumeSnapshotのdeletionPolicyは、`Retain`または`Delete`のいずれかです。このフィールドは指定しなければなりません。

deletionPolicyが`Delete`の場合、元となるストレージスナップショットは `VolumeSnapshotContent`オブジェクトとともに削除されます。deletionPolicyが`Retain`の場合、元となるスナップショットと`VolumeSnapshotContent`の両方が残ります。

## Parameters

VolumeSnapshotClassは、そのクラスに属するVolumeSnapshotを指定するパラメーターを持っています。
`driver`に応じて様々なパラメーターを使用できます。


