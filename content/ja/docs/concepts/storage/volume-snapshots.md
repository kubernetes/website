---
title: ボリュームのスナップショット
content_type: concept
weight: 60
---

<!-- overview -->

Kubernetesでは、*VolumeSnapshot*はストレージシステム上のボリュームのスナップショットを表します。このドキュメントは、Kubernetes[永続ボリューム](/ja/docs/concepts/storage/persistent-volumes/)に既に精通していることを前提としています。

<!-- body -->

## 概要 {#introduction}

APIリソース`PersistentVolume`と`PersistentVolumeClaim`を使用してユーザーと管理者にボリュームをプロビジョニングする方法と同様に、`VolumeSnapshotContent`と`VolumeSnapshot`APIリソースは、ユーザーと管理者のボリュームスナップショットを作成するために提供されます。

`VolumeSnapshotContent`は、管理者によってプロビジョニングされたクラスター内のボリュームから取得されたスナップショットです。PersistentVolumeがクラスターリソースであるように、これはクラスターのリソースです。

`VolumeSnapshot`は、ユーザーによるボリュームのスナップショットの要求です。PersistentVolumeClaimに似ています。

`VolumeSnapshotClass`を使用すると、`VolumeSnapshot`に属するさまざまな属性を指定できます。これらの属性は、ストレージシステム上の同じボリュームから取得されたスナップショット間で異なる場合があるため、`PersistentVolumeClaim`の同じ`StorageClass`を使用して表現することはできません。

ボリュームスナップショットは、完全に新しいボリュームを作成することなく、特定の時点でボリュームの内容をコピーするための標準化された方法をKubernetesユーザーに提供します。この機能により、たとえばデータベース管理者は、編集または削除の変更を実行する前にデータベースをバックアップできます。

この機能を使用する場合、ユーザーは次のことに注意する必要があります。

- APIオブジェクト`VolumeSnapshot`、`VolumeSnapshotContent`、および`VolumeSnapshotClass`は{{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}であり、コアAPIの一部ではありません。
- `VolumeSnapshot`のサポートは、CSIドライバーでのみ利用できます。
- `VolumeSnapshot`の展開プロセスの一環として、Kubernetesチームは、コントロールプレーンに展開されるスナップショットコントローラーと、CSIドライバーと共に展開されるcsi-snapshotterと呼ばれるサイドカーヘルパーコンテナを提供します。スナップショットコントローラーは、`VolumeSnapshot`および`VolumeSnapshotContent`オブジェクトを管理し、`VolumeSnapshotContent`オブジェクトの作成と削除を担当します。サイドカーcsi-snapshotterは、`VolumeSnapshotContent`オブジェクトを監視し、CSIエンドポイントに対して`CreateSnapshot`および`DeleteSnapshot`操作をトリガーします。
- スナップショットオブジェクトの厳密な検証を提供するvalidation Webhookサーバーもあります。これは、CSIドライバーではなく、スナップショットコントローラーおよびCRDと共にKubernetesディストリビューションによってインストールする必要があります。スナップショット機能が有効になっているすべてのKubernetesクラスターにインストールする必要があります。
- CSIドライバーは、ボリュームスナップショット機能を実装している場合と実装していない場合があります。ボリュームスナップショットのサポートを提供するCSIドライバーは、csi-snapshotterを使用する可能性があります。詳細については、[CSIドライバーのドキュメント](https://kubernetes-csi.github.io/docs/)を参照してください。
- CRDとスナップショットコントローラーのインストールは、Kubernetesディストリビューションの責任です。

## ボリュームスナップショットとボリュームスナップショットのコンテンツのライフサイクル

`VolumeSnapshotContents`はクラスター内のリソースです。`VolumeSnapshots`は、これらのリソースに対するリクエストです。`VolumeSnapshotContents`と`VolumeSnapshots`の間の相互作用は、次のライフサイクルに従います。

### プロビジョニングボリュームのスナップショット

スナップショットをプロビジョニングするには、事前プロビジョニングと動的プロビジョニングの2つの方法があります。

#### 事前プロビジョニング{#static}

クラスター管理者は、多数の`VolumeSnapshotContents`を作成します。それらは、クラスターユーザーが使用できるストレージシステム上の実際のボリュームスナップショットの詳細を保持します。それらはKubernetesAPIに存在し、消費することができます。

#### 動的プロビジョニング

既存のスナップショットを使用する代わりに、スナップショットをPersistentVolumeClaimから動的に取得するように要求できます。[VolumeSnapshotClass](/ja/docs/concepts/storage/volume-snapshot-classes/)は、スナップショットを作成するときに使用するストレージプロバイダー固有のパラメーターを指定します。

### バインディング

スナップショットコントローラーは、事前プロビジョニングされたシナリオと動的にプロビジョニングされたシナリオの両方で、適切な`VolumeSnapshotContent`オブジェクトを使用した`VolumeSnapshot`オブジェクトのバインディングを処理します。バインディングは1対1のマッピングです。

事前プロビジョニングされたバインディングの場合、要求されたVolumeSnapshotContentオブジェクトが作成されるまで、VolumeSnapshotはバインドされないままになります。

### スナップショットソース保護としてのPersistentVolumeClaim

この保護の目的は、スナップショットがシステムから取得されている間、使用中の{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}APIオブジェクトがシステムから削除されないようにすることです(これにより、データが失われる可能性があります）。

PersistentVolumeClaimのスナップショットが作成されている間、そのPersistentVolumeClaimは使用中です。スナップショットソースとしてアクティブに使用されているPersistentVolumeClaim APIオブジェクトを削除しても、PersistentVolumeClaimオブジェクトはすぐには削除されません。代わりに、PersistentVolumeClaimオブジェクトの削除は、スナップショットがReadyToUseになるか中止されるまで延期されます。

### 削除

削除は`VolumeSnapshot`オブジェクトの削除によってトリガーされ、`DeletionPolicy`に従います。`DeletionPolicy`が`Delete`の場合、基になるストレージスナップショットは`VolumeSnapshotContent`オブジェクトとともに削除されます。`DeletionPolicy`が`Retain`の場合、基になるスナップショットと`VolumeSnapshotContent`の両方が残ります。

## ボリュームスナップショット

各VolumeSnapshotには、仕様とステータスが含まれています。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName`は、スナップショットのPersistentVolumeClaimデータソースの名前です。このフィールドは、スナップショットを動的にプロビジョニングするために必要です。

ボリュームスナップショットは、属性`volumeSnapshotClassName`を使用して[VolumeSnapshotClass](/ja/docs/concepts/storage/volume-snapshot-classes/)の名前を指定することにより、特定のクラスを要求できます。何も設定されていない場合、利用可能な場合はデフォルトのクラスが使用されます。

事前プロビジョニングされたスナップショットの場合、次の例に示すように、スナップショットのソースとして`volumeSnapshotContentName`を指定する必要があります。事前プロビジョニングされたスナップショットには、`volumeSnapshotContentName`ソースフィールドが必要です。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## ボリュームスナップショットコンテンツ

各VolumeSnapshotContentには、仕様とステータスが含まれています。動的プロビジョニングでは、スナップショット共通コントローラーが`VolumeSnapshotContent`オブジェクトを作成します。以下に例を示します。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle`は、ストレージバックエンドで作成され、ボリュームの作成中にCSIドライバーによって返されるボリュームの一意の識別子です。このフィールドは、スナップショットを動的にプロビジョニングするために必要です。これは、スナップショットのボリュームソースを指定します。
事前プロビジョニングされたスナップショットの場合、(クラスター管理者として)次のように`VolumeSnapshotContent`オブジェクトを作成する必要があります。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle`は、ストレージバックエンドで作成されたボリュームスナップショットの一意の識別子です。このフィールドは、事前プロビジョニングされたスナップショットに必要です。この`VolumeSnapshotContent`が表すストレージシステムのCSIスナップショットIDを指定します。

`sourceVolumeMode`は、スナップショットが作成されるボリュームのモードです。`sourceVolumeMode`フィールドの値は、`Filesystem`または`Block`のいずれかです。ソースボリュームモードが指定されていない場合、Kubernetesはスナップショットをソースボリュームのモードが不明であるかのように扱います。

`volumeSnapshotRef`は、対応する`VolumeSnapshot`の参照です。`VolumeSnapshotContent`が事前プロビジョニングされたスナップショットとして作成されている場合、`volumeSnapshotRef`で参照される`VolumeSnapshot`がまだ存在しない可能性があることに注意してください。

## スナップショットのボリュームモードの変換 {#convert-volume-mode}

クラスターにインストールされている`VolumeSnapshots`APIが`sourceVolumeMode`フィールドをサポートしている場合、APIには、権限のないユーザーがボリュームのモードを変換するのを防ぐ機能があります。

クラスターにこの機能の機能があるかどうかを確認するには、次のコマンドを実行します。

```yaml
$ kubectl get crd volumesnapshotcontent -o yaml
```

ユーザーが既存の`VolumeSnapshot`から`PersistentVolumeClaim`を作成できるようにしたいが、ソースとは異なるボリュームモードを使用する場合は、`VolumeSnapshot`に対応する`VolumeSnapshotContent`にアノテーション`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`を追加する必要があります。

事前プロビジョニングされたスナップショットの場合、クラスター管理者が`spec.sourceVolumeMode`を入力する必要があります。

この機能を有効にした`VolumeSnapshotContent`リソースの例は次のようになります。

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
  annotations:
    - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

## スナップショットからのボリュームのプロビジョニング

`PersistentVolumeClaim`オブジェクトの*dataSource*フィールドを使用して、スナップショットからのデータが事前に取り込まれた新しいボリュームをプロビジョニングできます。

詳細については、[ボリュームのスナップショットとスナップショットからのボリュームの復元](/ja/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support)を参照してください。
