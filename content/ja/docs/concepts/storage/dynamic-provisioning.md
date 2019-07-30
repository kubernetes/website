---
reviewers:
title: ボリュームの動的プロビジョニング(Dynamic Volume Provisioning)
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

ボリュームの動的プロビジョニングにより、ストレージ用のボリュームをオンデマンドに作成することができます。
動的プロビジョニングなしでは、クラスター管理者はクラウドプロバイダーまたはストレージプロバイダーに対して新規のストレージ用のボリュームと[`PersistentVolume`オブジェクト](/docs/concepts/storage/persistent-volumes/)を作成するように手動で指示しなければなりません。動的プロビジョニングの機能によって、クラスター管理者がストレージを事前にプロビジョンする必要がなくなります。その代わりに、ユーザーによってリクエストされたときに自動でストレージをプロビジョンします。

{{% /capture %}}


{{% capture body %}}

## バックグラウンド

ボリュームの動的プロビジョニングの実装は`storage.k8s.io`というAPIグループ内の`StorageClass`というAPIオブジェクトに基づいています。クラスター管理者は`StorageClass`オブジェクトを必要に応じていくつでも定義でき、各オブジェクトはボリュームをプロビジョンする*Volumeプラグイン* (別名*プロビジョナー*)と、プロビジョンされるときにプロビジョナーに渡されるパラメータを指定します。
クラスター管理者はクラスター内で複数の種類のストレージ(同一または異なるストレージシステム)を定義し、さらには公開でき、それらのストレージはパラメータのカスタムセットを持ちます。この仕組みにおいて、エンドユーザーはストレージがどのようにプロビジョンされるか心配する必要がなく、それでいて複数のストレージオプションから選択できることを保証します。

StorageClassに関するさらなる情報は[Storage Class](/docs/concepts/storage/persistent-volumes/#storageclasses)を参照ください。

## 動的プロビジョニングを有効にする

動的プロビジョニングを有効にするために、クラスター管理者はユーザーのために1つまたはそれ以上のStorageClassを事前に作成する必要があります。StorageClassオブジェクトは、動的プロビジョニングが実行されるときに、どのプロビジョナーが使用されるべきか、またどのようなパラメーターをプロビジョナーに渡すべきか定義します。  
下記のマニフェストでは標準的な永続化ディスクをプロビジョンする"slow"というStorageClassを作成します。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

下記のマニフェストではSSDを使った永続化ディスクをプロビジョンする"fast"というStorageClassを作成します。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## 動的プロビジョニングの使用

ユーザーは`PersistentVolumeClaim`リソース内でStorageClassを含むことで、動的にプロビジョンされたStorageをリクエストできます。Kubernetes v1.6以前では、この機能は`volume.beta.kubernetes.io/storage-class`アノテーションを介して使うことができました。しかしこのアノテーションではv1.6から廃止になりました。その代わりユーザーは現在では`PersistentVolumeClaim`オブジェクトの`storageClassName`を使う必要があります。このフィールドの値は、管理者によって設定された`StorageClass`の名前と一致しなければなりません([下記](#enabling-dynamic-provisioning)のセクションも参照ください)。

"fast"というStorageClassを選択するために、例としてユーザーは下記の`PersistentVolumeClaim`を作成します。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

このリソースによってSSDのような永続化ディスクが自動的にプロビジョンされます。このリソースが削除された時、そのボリュームは削除されます。

## デフォルトの挙動

動的プロビジョニングは、もしStorageClassが1つも指定されていないときに全てのPersistentVolumeClaimが動的にプロビジョンされるようにクラスター上で有効にできます。クラスター管理者は、下記を行うことによりこのふるまいを有効にできます。

- 1つの`StorageClass`オブジェクトを*default* としてマーキングする
- API Server上で[`DefaultStorageClass`管理コントローラー](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)を有効にする。

管理者は`StorageClass`に対して`storageclass.kubernetes.io/is-default-class`アノテーションをつけることで、デフォルトのStorageClassとしてマーキングできます。
デフォルトの`StorageClass`がクラスター内で存在し、かつユーザーが`PersistentVolumeClaim`リソースで`storageClassName`を指定しなかった場合、`DefaultStorageClass`という管理コントローラーは`storageClassName`フィールドの値をデフォルトのStorageClassを指し示すように自動で追加します。

注意点として、クラスター上では最大1つしか*デフォルト* のStorageClassが指定できず、`storageClassName`を明示的に指定しない`PersistentVolumeClaim`は作成することもできません。

## トポロジーに関する注意

[マルチゾーン](/docs/setup/multiple-zones)クラスター内では、Podは単一のリージョン内のゾーンをまたいでしか稼働できません。シングルゾーンのStorageバックエンドはPodがスケジュールされるゾーン内でプロビジョンされる必要があります。これは[Volume割り当てモード](/docs/concepts/storage/storage-classes/#volume-binding-mode)を設定することにより可能となります。

{{% /capture %}}
