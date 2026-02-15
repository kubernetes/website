---
title: デフォルトのStorageClassを変更する
content_type: task
weight: 90
---

<!-- overview -->
このページでは、特別な要件を持たないPersistentVolumeClaimのボリュームをプロビジョニングするために使用される、デフォルトのStorage Classを変更する方法を示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## なぜデフォルトのストレージクラスを変更するのか? {#why-change-the-default-storage-class}

インストール方法によっては、Kubernetesクラスターがデフォルトとしてマークされた既存のStorageClassと共にデプロイされる場合があります。このデフォルトのStorageClassは、特定のストレージクラスを必要としないPersistentVolumeClaimのストレージを動的にプロビジョニングするために使用されます。詳細は[PersistentVolumeClaimのドキュメント](/ja/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)を参照してください。

プリインストールされたデフォルトのStorageClassは、期待されるワークロードに適合しない場合があります。たとえば、高価すぎるストレージをプロビジョニングする可能性があります。このような場合、デフォルトのStorageClassを変更するか、ストレージの動的プロビジョニングを回避するために完全に無効にすることができます。

デフォルトのStorageClassを削除しても、機能しない場合があります。クラスター内で実行されているアドオンマネージャーによって自動的に再作成される可能性があるためです。アドオンマネージャーと個々のアドオンを無効にする方法の詳細については、インストールのドキュメントを参照してください。

## デフォルトのStorageClassを変更する {#changing-the-default-storageclass}

1. クラスター内のStorageClassをリストします:

   ```bash
   kubectl get storageclass
   ```

   出力は次のようになります:

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   デフォルトのStorageClassは`(default)`でマークされています。

1. デフォルトのStorageClassを非デフォルトとしてマークします:

   デフォルトのStorageClassには、`storageclass.kubernetes.io/is-default-class`アノテーションが`true`に設定されています。その他の値やアノテーションの欠如は`false`として解釈されます。

   StorageClassを非デフォルトとしてマークするには、その値を`false`に変更する必要があります:

   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   ここで、`standard`は選択したStorageClassの名前です。

1. StorageClassをデフォルトとしてマークします:

   前のステップと同様に、アノテーション`storageclass.kubernetes.io/is-default-class=true`を追加/設定する必要があります。

   ```bash
   kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   複数の`StorageClass`をデフォルトとしてマークできることに注意してください。複数の`StorageClass`がデフォルトとしてマークされている場合、`storageClassName`が明示的に定義されていない`PersistentVolumeClaim`は、最も最近作成されたデフォルトの`StorageClass`を使用して作成されます。
   `PersistentVolumeClaim`が指定された`volumeName`で作成された場合、静的ボリュームの`storageClassName`が`PersistentVolumeClaim`の`StorageClass`と一致しないと、保留状態のままになります。

1. 選択したStorageClassがデフォルトであることを確認します:

   ```bash
   kubectl get storageclass
   ```

   出力は次のようになります:

   ```bash
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1d
   gold (default)   kubernetes.io/gce-pd      1d
   ```

## {{% heading "whatsnext" %}}

* [PersistentVolumes](/ja/docs/concepts/storage/persistent-volumes/)について詳しく学びます。
