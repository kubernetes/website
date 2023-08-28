---
title: エフェメラルボリューム
content_type: concept
weight: 30
---

<!-- overview -->

このドキュメントでは、Kubernetesの*エフェメラルボリューム*について説明します。[ボリューム](/ja/docs/concepts/storage/volumes/)、特にPersistentVolumeClaimとPersistentVolumeに精通していることをお勧めします。

<!-- body -->

一部のアプリケーションでは追加のストレージが必要ですが、そのデータが再起動後も永続的に保存されるかどうかは気にしません。
たとえば、キャッシュサービスは多くの場合メモリサイズによって制限されており、使用頻度の低いデータを、全体的なパフォーマンスにほとんど影響を与えずに、メモリよりも低速なストレージに移動できます。

他のアプリケーションは、構成データや秘密鍵など、読み取り専用の入力データがファイルに存在することを想定しています。

*エフェメラルボリューム*は、これらのユースケース向けに設計されています。
ボリュームはPodの存続期間に従い、Podとともに作成および削除されるため、Podは、永続ボリュームが利用可能な場所に制限されることなく停止および再起動できます。

エフェメラルボリュームはPod仕様で*インライン*で指定されているため、アプリケーションの展開と管理が簡素化されます。

### エフェメラルボリュームのタイプ {#types-of-ephemeral-volumes}

Kubernetesは、さまざまな目的のためにいくつかの異なる種類のエフェメラルボリュームをサポートしています。
- [emptyDir](/ja/docs/concepts/storage/volumes/#emptydir):Podの起動時には空で、ストレージはkubeletベースディレクトリ(通常はルートディスク)またはRAMからローカルに取得されます。
- [configMap](/ja/docs/concepts/storage/volumes/#configmap)、[downwardAPI](/ja/docs/concepts/storage/volumes/#downwardapi)、[secret](/ja/docs/concepts/storage/volumes/#secret):Podにさまざまな種類のKubernetesデータを挿入します。
- [CSIエフェメラルボリューム](#csi-ephemeral-volumes):上のボリュームの種類に似ていますが、特に[この機能をサポートする](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)特別な[CSIドライバー](https://github.com/container-storage-interface/spec/blob/master/spec.md)によって提供されます。
- [汎用エフェメラルボリューム](#generic-ephemeral-volumes):これは、永続ボリュームもサポートするすべてのストレージドライバーで提供できます。

`emptyDir`、`configMap`、`downwardAPI`、`secret`は[ローカルエフェメラルストレージ](/ja/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)として提供されます。
これらは、各ノードのkubeletによって管理されます。

CSIエフェメラルボリュームは、サードパーティーのCSIストレージドライバーによって提供される*必要があります*。

汎用エフェメラルボリュームは、サードパーティーのCSIストレージドライバーによって提供される*可能性があります*が、動的プロビジョニングをサポートする他のストレージドライバーによって提供されることもあります。一部のCSIドライバーは、CSIエフェメラルボリューム用に特別に作成されており、動的プロビジョニングをサポートしていません。これらは汎用エフェメラルボリュームには使用できません。

サードパーティー製ドライバーを使用する利点は、Kubernetes自体がサポートしていない機能を提供できることです。たとえば、kubeletによって管理されるディスクとは異なるパフォーマンス特性を持つストレージや、異なるデータの挿入などです。

### CSIエフェメラルボリューム {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

{{< note >}}
CSIエフェメラルボリュームは、CSIドライバーのサブセットによってのみサポートされます。
Kubernetes CSI[ドライバーリスト](https://kubernetes-csi.github.io/docs/drivers.html)には、エフェメラルボリュームをサポートするドライバーが表示されます。
{{< /note >}}

概念的には、CSIエフェメラルボリュームは`configMap`、`downwardAPI`、および`secret`ボリュームタイプに似ています。
ストレージは各ノードでローカルに管理され、Podがノードにスケジュールされた後に他のローカルリソースと一緒に作成されます。Kubernetesには、この段階でPodを再スケジュールするという概念はもうありません。
ボリュームの作成は、失敗する可能性が低くなければなりません。さもないと、Podの起動が停止します。
特に、[ストレージ容量を考慮したPodスケジューリング](/ja/docs/concepts/storage/storage-capacity/)は、これらのボリュームではサポートされて*いません*。
これらは現在、Podのストレージリソースの使用制限の対象外です。これは、kubeletが管理するストレージに対してのみ強制できるものであるためです。

CSIエフェメラルストレージを使用するPodのマニフェストの例を次に示します。

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

`volumeAttributes`は、ドライバーによって準備されるボリュームを決定します。これらの属性は各ドライバーに固有のものであり、標準化されていません。詳細な手順については、各CSIドライバーのドキュメントを参照してください。

### CSIドライバーの制限事項 {#csi-driver-restrictions}

CSIエフェメラルボリュームを使用すると、ユーザーはPod仕様の一部として`volumeAttributes`をCSIドライバーに直接提供できます。
通常は管理者に制限されている`volumeAttributes`を許可するCSIドライバーは、インラインエフェメラルボリュームでの使用には適していません。
たとえば、通常StorageClassで定義されるパラメーターは、インラインエフェメラルボリュームを使用してユーザーに公開しないでください。

Pod仕様内でインラインボリュームとして使用できるCSIドライバーを制限する必要があるクラスター管理者は、次の方法で行うことができます。

- CSIドライバー仕様の`volumeLifecycleModes`から`Ephemeral`を削除します。これにより、ドライバーをインラインエフェメラルボリュームとして使用できなくなります。
- [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)を使用して、このドライバーの使用方法を制限します。

### 汎用エフェメラルボリューム {#generic-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

汎用エフェメラルボリュームは、プロビジョニング後に通常は空であるスクラッチデータ用のPodごとのディレクトリを提供するという意味で、`emptyDir`ボリュームに似ています。ただし、追加の機能がある場合もあります。

- ストレージは、ローカルまたはネットワークに接続できます。
- ボリュームは、Podが超えることができない固定サイズを持つことができます。
- ボリュームには、ドライバーとパラメーターによっては、いくつかの初期データがある場合があります。
- [スナップショット](/docs/concepts/storage/volume-snapshots/)、[クローン作成](/ja/docs/concepts/storage/volume-pvc-datasource/)、[サイズ変更](/ja/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)、[ストレージ容量の追跡](/ja/docs/concepts/storage/storage-capacity/)などボリュームに対する一般的な操作は、ドライバーがそれらをサポートしていることを前提としてサポートされています。

例:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/scratch"
        name: scratch-volume
      command: [ "sleep", "1000000" ]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: [ "ReadWriteOnce" ]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

### LifecycleとPersistentVolumeClaim {#lifecycle-and-persistentvolumeclaim}

設計上の重要なアイデアは、[ボリュームクレームのパラメーター](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)がPodのボリュームソース内で許可されることです。
PersistentVolumeClaimのラベル、アノテーション、および一連のフィールド全体がサポートされています。
そのようなPodが作成されると、エフェメラルボリュームコントローラーは、Podと同じ名前空間に実際のPersistentVolumeClaimオブジェクトを作成し、Podが削除されたときにPersistentVolumeClaimが確実に削除されるようにします。

これにより、ボリュームバインディングおよび/またはプロビジョニングがトリガーされます。
これは、{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}が即時ボリュームバインディングを使用する場合、またはPodが一時的にノードにスケジュールされている場合(`WaitForFirstConsumer`ボリュームバインディングモード)のいずれかです。
後者は、スケジューラーがPodに適したノードを自由に選択できるため、一般的なエフェメラルボリュームに推奨されます。即時バインディングでは、ボリュームが利用可能になった時点で、ボリュームにアクセスできるノードをスケジューラーが選択する必要があります。

[リソースの所有権](/ja/docs/concepts/architecture/garbage-collection/#owners-dependents)に関して、一般的なエフェメラルストレージを持つPodは、そのエフェメラルストレージを提供するPersistentVolumeClaimの所有者です。Podが削除されると、KubernetesガベージコレクターがPVCを削除します。これにより、通常、ボリュームの削除がトリガーされます。これは、ストレージクラスのデフォルトの再利用ポリシーがボリュームを削除することであるためです。`retain`の再利用ポリシーを持つStorageClassを使用して、準エフェメラルなローカルストレージを作成できます。ストレージはPodよりも長く存続します。この場合、ボリュームのクリーンアップが個別に行われるようにする必要があります。

これらのPVCは存在しますが、他のPVCと同様に使用できます。特に、ボリュームのクローン作成またはスナップショットでデータソースとして参照できます。PVCオブジェクトは、ボリュームの現在のステータスも保持します。

### PersistentVolumeClaimの命名 {#persistentpolumeplaim-naming}

自動的に作成されたPVCの命名は決定論的です。名前はPod名とボリューム名を組み合わせたもので、途中にハイフン(`-`)があります。上記の例では、PVC名は`my-app-scratch-volume`になります。この決定論的な命名により、Pod名とボリューム名が分かればPVCを検索する必要がないため、PVCとの対話が容易になります。

また、決定論的な命名では、異なるPod間、およびPodと手動で作成されたPVCの間で競合が発生する可能性があります(ボリュームが"scratch"のPod"pod-a"と、名前が"pod"でボリュームが"a-scratch"の別のPodは、どちらも同じPVC名"pod-a-scratch")。

次のような競合が検出されます。Pod用に作成された場合、PVCはエフェメラルボリュームにのみ使用されます。このチェックは、所有関係に基づいています。既存のPVCは上書きまたは変更されません。ただし、適切なPVCがないとPodを起動できないため、これでは競合が解決されません。

{{< caution >}}
これらの競合が発生しないように、同じ名前空間内でPodとボリュームに名前を付けるときは注意してください。
{{< /caution >}}

### セキュリティ {#security}

GenericEphemeralVolume機能を有効にすると、ユーザーは、PVCを直接作成する権限がなくても、Podを作成できる場合、間接的にPVCを作成できます。クラスター管理者はこれを認識している必要があります。これがセキュリティモデルに適合しない場合は、一般的なエフェメラルボリュームを持つPodなどのオブジェクトを拒否する[admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)を使用する必要があります。

通常の[PVCの名前空間割り当て](/ja/docs/concepts/policy/resource-quotas/#storage-resource-quota)は引き続き適用されるため、ユーザーがこの新しいメカニズムの使用を許可されたとしても、他のポリシーを回避するために使用することはできません。

## {{% heading "whatsnext" %}}

### kubeletによって管理されるエフェメラルボリューム {#ephemeral-volumes-managed-by-kubelet}

[ローカルエフェメラルボリューム](/ja/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)を参照してください。

### CSIエフェメラルボリューム {#csi-ephemeral-volumes}

- 設計の詳細については[エフェメラルインラインCSIボリュームKEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md)を参照してください。
- この機能のさらなる開発の詳細については、[KEPのトラッキングイシュー](https://github.com/kubernetes/enhancements/issues/596)を参照してください。

### 汎用エフェメラルボリューム {#generic-ephemeral-volumes}

- 設計の詳細については、[汎用インラインエフェメラルボリュームKEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md)を参照してください。

