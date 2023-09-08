---
title: ストレージクラス
content_type: concept
weight: 40
---

<!-- overview -->

このドキュメントでは、KubernetesにおけるStorageClassの概念について説明します。[ボリューム](/ja/docs/concepts/storage/volumes/)と[永続ボリューム](/ja/docs/concepts/storage/persistent-volumes)に精通していることをお勧めします。

<!-- body -->

## 概要

StorageClassは、管理者が提供するストレージの「クラス」を記述する方法を提供します。さまざまなクラスが、サービス品質レベル、バックアップポリシー、またはクラスター管理者によって決定された任意のポリシーにマップされる場合があります。Kubernetes自体は、クラスが何を表すかについて意見を持っていません。この概念は、他のストレージシステムでは「プロファイル」と呼ばれることがあります。

## StorageClassリソース

各StorageClassには、クラスに属するPersistentVolumeを動的にプロビジョニングする必要がある場合に使用されるフィールド`provisioner`、`parameters`、および`reclaimPolicy`が含まれています。

StorageClassオブジェクトの名前は重要であり、ユーザーが特定のクラスを要求する方法です。管理者は、最初にStorageClassオブジェクトを作成するときにクラスの名前とその他のパラメーターを設定します。オブジェクトは、作成後に更新することはできません。

管理者は、バインドする特定のクラスを要求しないPVCに対してのみ、デフォルトのStorageClassを指定できます。詳細については、[PersistentVolumeClaimセクション](/ja/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)を参照してください。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: Immediate
```

### プロビジョナー

各StorageClassには、PVのプロビジョニングに使用するボリュームプラグインを決定するプロビジョナーがあります。このフィールドを指定する必要があります。

| Volume Plugin        | Internal Provisioner| Config Example                       |
| :---                 |     :---:           |    :---:                             |
| AWSElasticBlockStore | &#x2713;            | [AWS EBS](#aws-ebs)                  |
| AzureFile            | &#x2713;            | [Azure File](#azure-file)            |
| AzureDisk            | &#x2713;            | [Azure Disk](#azure-disk)            |
| CephFS               | -                   | -                                    |
| Cinder               | &#x2713;            | [OpenStack Cinder](#openstack-cinder)|
| FC                   | -                   | -                                    |
| FlexVolume           | -                   | -                                    |
| GCEPersistentDisk    | &#x2713;            | [GCE PD](#gce-pd)                    |
| Glusterfs            | &#x2713;            | [Glusterfs](#glusterfs)              |
| iSCSI                | -                   | -                                    |
| NFS                  | -                   | [NFS](#nfs)                          |
| RBD                  | &#x2713;            | [Ceph RBD](#ceph-rbd)                |
| VsphereVolume        | &#x2713;            | [vSphere](#vsphere)                  |
| PortworxVolume       | &#x2713;            | [Portworx Volume](#portworx-volume)  |
| Local                | -                   | [Local](#local)                      |

ここにリストされている「内部」プロビジョナー(名前には「kubernetes.io」というプレフィックスが付いており、Kubernetesと共に出荷されます)を指定することに制限はありません。Kubernetesによって定義された[仕様](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)に従う独立したプログラムである外部プロビジョナーを実行して指定することもできます。外部プロビジョナーの作成者は、コードの保存場所、プロビジョナーの出荷方法、実行方法、使用するボリュームプラグイン(Flexを含む)などについて完全な裁量権を持っています。リポジトリ[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)には、仕様の大部分を実装する外部プロビジョナーを作成するためのライブラリが含まれています。一部の外部プロビジョナーは、リポジトリ[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)の下にリストされています。

たとえば、NFSは内部プロビジョナーを提供しませんが、外部プロビジョナーを使用できます。サードパーティのストレージベンダーが独自の外部プロビジョナーを提供する場合もあります。

### 再利用ポリシー

StorageClassによって動的に作成されるPersistentVolumeには、クラスの`reclaimPolicy`フィールドで指定された再利用ポリシーがあり、`Delete`または`Retain`のいずれかになります。StorageClassオブジェクトの作成時に`reclaimPolicy`が指定されていない場合、デフォルトで`Delete`になります。

手動で作成され、StorageClassを介して管理されるPersistentVolumeには、作成時に割り当てられた再利用ポリシーが適用されます。

### ボリューム拡張の許可

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

PersistentVolumeは、拡張可能になるように構成できます。この機能を`true`に設定すると、ユーザーは対応するPVCオブジェクトを編集してボリュームのサイズを変更できます。

次のタイプのボリュームは、基になるStorageClassのフィールド`allowVolumeExpansion`がtrueに設定されている場合に、ボリュームの拡張をサポートします。

{{< table caption = "Table of Volume types and the version of Kubernetes they require"  >}}

Volume type | Required Kubernetes version
:---------- | :--------------------------
gcePersistentDisk | 1.11
awsElasticBlockStore | 1.11
Cinder | 1.11
glusterfs | 1.11
rbd | 1.11
Azure File | 1.11
Azure Disk | 1.11
Portworx | 1.11
FlexVolume | 1.13
CSI | 1.14 (alpha), 1.16 (beta)

{{< /table >}}


{{< note >}}
ボリューム拡張機能を使用してボリュームを拡張することはできますが、縮小することはできません。
{{< /note >}}

### マウントオプション

StorageClassによって動的に作成されるPersistentVolumeには、クラスの`mountOptions`フィールドで指定されたマウントオプションがあります。

ボリュームプラグインがマウントオプションをサポートしていないにもかかわらず、マウントオプションが指定されている場合、プロビジョニングは失敗します。マウントオプションは、クラスまたはPVのいずれでも検証されません。マウントオプションが無効な場合、PVマウントは失敗します。

### ボリュームバインディングモード

`volumeBindingMode`フィールドは、[ボリュームバインディングと動的プロビジョニング](/ja/docs/concepts/storage/persistent-volumes/#provisioning)が発生するタイミングを制御します。設定を解除すると、デフォルトで"Immediate"モードが使用されます。

`Immediate`モードは、PersistentVolumeClaimが作成されると、ボリュームバインディングと動的プロビジョニングが発生することを示します。トポロジに制約があり、クラスター内のすべてのノードからグローバルにアクセスできないストレージバックエンドの場合、PersistentVolumeはPodのスケジューリング要件を知らなくてもバインドまたはプロビジョニングされます。これにより、Podがスケジュール不能になる可能性があります。

クラスター管理者は、PersistentVolumeClaimを使用するPodが作成されるまでPersistentVolumeのバインドとプロビジョニングを遅らせる`WaitForFirstConsumer`モードを指定することで、この問題に対処できます。
PersistentVolumeは、Podのスケジュール制約によって指定されたトポロジに準拠して選択またはプロビジョニングされます。これらには、[リソース要件](/ja/docs/concepts/configuration/manage-resources-containers/)、[ノードセレクター](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)、[ポッドアフィニティとアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)、および[taints and tolerations](/ja/docs/concepts/scheduling-eviction/taint-and-toleration)が含まれますが、これらに限定されません。

次のプラグインは、動的プロビジョニングで`WaitForFirstConsumer`をサポートしています。

* [AWSElasticBlockStore](#aws-ebs)
* [GCEPersistentDisk](#gce-pd)
* [AzureDisk](#azure-disk)

次のプラグインは、事前に作成されたPersistentVolumeバインディングで`WaitForFirstConsumer`をサポートします。

* 上記のすべて
* [Local](#local)

{{< feature-state state="stable" for_k8s_version="v1.17" >}}
[CSIボリューム](/ja/docs/concepts/storage/volumes/#csi)も動的プロビジョニングと事前作成されたPVでサポートされていますが、サポートされているトポロジーキーと例を確認するには、特定のCSIドライバーのドキュメントを参照する必要があります。

{{< note >}}
   `WaitForFirstConsumer`の使用を選択した場合は、Pod仕様で`nodeName`を使用してノードアフィニティを指定しないでください。この場合にnodeNameを使用すると、スケジューラはバイパスされ、PVCは保留状態のままになります。

   代わりに、以下に示すように、この場合はホスト名にノードセレクターを使用できます。
{{< /note >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: task-pv-pod
spec:
  nodeSelector:
    kubernetes.io/hostname: kube-01
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
        claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
```

### 許可されたトポロジー {#allowed-topologies}

クラスターオペレーターが`WaitForFirstConsumer`ボリュームバインディングモードを指定すると、ほとんどの状況でプロビジョニングを特定のトポロジに制限する必要がなくなります。ただし、それでも必要な場合は、`allowedTopologies`を指定できます。

この例は、プロビジョニングされたボリュームのトポロジを特定のゾーンに制限する方法を示しており、サポートされているプラグインの`zone`および`zones`パラメーターの代わりとして使用する必要があります。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
- matchLabelExpressions:
  - key: failure-domain.beta.kubernetes.io/zone
    values:
    - us-central-1a
    - us-central-1b
```

## パラメーター

ストレージクラスには、ストレージクラスに属するボリュームを記述するパラメーターがあります。`プロビジョナー`に応じて、異なるパラメーターが受け入れられる場合があります。たとえば、パラメーター`type`の値`io1`とパラメーター`iopsPerGB`はEBSに固有です。パラメーターを省略すると、デフォルトが使用されます。

StorageClassに定義できるパラメーターは最大512個です。
キーと値を含むパラメーターオブジェクトの合計の長さは、256KiBを超えることはできません。

### AWS EBS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

* `type`:`io1`、`gp2`、`sc1`、`st1`。詳細については、[AWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)を参照してください。デフォルト:`gp2`。
* `zone`(非推奨):AWS zone。`zone`も`zones`も指定されていない場合、ボリュームは通常、Kubernetesクラスターにノードがあるすべてのアクティブなゾーンにわたってラウンドロビン方式で処理されます。`zone`パラメーターと`zones`パラメーターを同時に使用することはできません。
* `zones`(非推奨):AWS zoneのコンマ区切りリスト。`zone`も`zones`も指定されていない場合、ボリュームは通常、Kubernetesクラスターにノードがあるすべてのアクティブなゾーンにわたってラウンドロビン方式で処理されます。`zone`パラメーターと`zones`パラメーターを同時に使用することはできません。
* `iopsPerGB`:`io1`ボリュームのみ。GiBごとの1秒あたりのI/O操作。AWSボリュームプラグインは、これを要求されたボリュームのサイズで乗算して、ボリュームのIOPSを計算し、上限を20,000IOPSに設定します(AWSでサポートされる最大値については、[AWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)を参照してください)。ここでは文字列が必要です。つまり、`10`ではなく`"10"`です。
* `fsType`:kubernetesでサポートされているfsType。デフォルト:`"ext4"`。
* `encrypted`:EBSボリュームを暗号化するかどうかを示します。有効な値は`"true"`または`"false"`です。ここでは文字列が必要です。つまり、`true`ではなく`"true"`です。
* `kmsKeyId`:オプション。ボリュームを暗号化するときに使用するキーの完全なAmazonリソースネーム。何も指定されていなくても`encrypted`がtrueの場合、AWSによってキーが生成されます。有効なARN値については、AWSドキュメントを参照してください。

{{< note >}}
`zone`および`zones`パラメーターは廃止され、[allowedTopologies](#allowed-topologies)に置き換えられました。
{{< /note >}}

### GCE PD

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fstype: ext4
  replication-type: none
```

* `type`:`pd-standard`または`pd-ssd`。デフォルト:`pd-standard`
* `zone`(非推奨):GCE zone。`zone`も`zones`も指定されていない場合、ボリュームは通常、Kubernetesクラスターにノードがあるすべてのアクティブなゾーンにわたってラウンドロビン方式で処理されます。`zone`パラメーターと`zones`パラメーターを同時に使用することはできません。
* `zones`(非推奨):GCE zoneのコンマ区切りリスト。`zone`も`zones`も指定されていない場合、ボリュームは通常、Kubernetesクラスターにノードがあるすべてのアクティブなゾーンにわたってラウンドロビン方式で処理されます。`zone`パラメーターと`zones`パラメーターを同時に使用することはできません。
* `fstype`:`ext4`または`xfs`。デフォルト:`ext4`。定義されたファイルシステムタイプは、ホストオペレーティングシステムでサポートされている必要があります。
* `replication-type`:`none`または`regional-pd`。デフォルト:`none`。

`replication-type`が`none`に設定されている場合、通常の(ゾーン)PDがプロビジョニングされます。

`replication-type`が`regional-pd`に設定されている場合、[Regional Persistent Disk](https://cloud.google.com/compute/docs/disks/#repds)がプロビジョニングされます。`volumeBindingMode: WaitForFirstConsumer`を設定することを強くお勧めします。この場合、このStorageClassを使用するPersistentVolumeClaimを使用するPodを作成すると、Regional Persistent Diskが2つのゾーンでプロビジョニングされます。1つのゾーンは、Podがスケジュールされているゾーンと同じです。もう1つのゾーンは、クラスターで使用可能なゾーンからランダムに選択されます。ディスクゾーンは、`allowedTopologies`を使用してさらに制限できます。

{{< note >}}
`zone`および`zones`パラメーターは廃止され、[allowedTopologies](#allowed-topologies)に置き換えられました。
{{< /note >}}

### Glusterfs(非推奨) {#glusterfs}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://127.0.0.1:8081"
  clusterid: "630372ccdc720a92c681fb928f27b53f"
  restauthenabled: "true"
  restuser: "admin"
  secretNamespace: "default"
  secretName: "heketi-secret"
  gidMin: "40000"
  gidMax: "50000"
  volumetype: "replicate:3"
```

* `resturl`:glusterボリュームをオンデマンドでプロビジョニングするGluster RESTサービス/HeketiサービスのURL。一般的な形式は`IPaddress:Port`である必要があり、これはGlusterFS動的プロビジョナーの必須パラメーターです。Heketiサービスがopenshift/kubernetesセットアップでルーティング可能なサービスとして公開されている場合、これは`http://heketi-storage-project.cloudapps.mystorage.com`のような形式になる可能性があります。ここで、fqdnは解決可能なHeketiサービスURLです。
* `restauthenabled`:RESTサーバーへの認証を有効にするGluster RESTサービス認証ブール値。この値が`"true"`の場合、`restuser`と`restuserkey`または`secretNamespace`+`secretName`を入力する必要があります。このオプションは非推奨です。`restuser`、`restuserkey`、`secretName`、または`secretNamespace`のいずれかが指定されている場合、認証が有効になります。
* `restuser`:Gluster Trusted Poolでボリュームを作成するためのアクセス権を持つGluster RESTサービス/Heketiユーザー。
* `restuserkey`:RESTサーバーへの認証に使用されるGluster RESTサービス/Heketiユーザーのパスワード。このパラメーターは、`secretNamespace`+`secretName`を優先されて廃止されました。
* `secretNamespace`、`secretName`:Gluster RESTサービスと通信するときに使用するユーザーパスワードを含むSecretインスタンスの識別。これらのパラメーターはオプションです。`secretNamespace`と`secretName`の両方が省略された場合、空のパスワードが使用されます。提供されたシークレットには、タイプ`kubernetes.io/glusterfs`が必要です。たとえば、次のように作成されます。
    ```
    kubectl create secret generic heketi-secret \
      --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
      --namespace=default
    ```

    シークレットの例は[glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml)にあります。

* `clusterid`:`630372ccdc720a92c681fb928f27b53f`は、ボリュームのプロビジョニング時にHeketiによって使用されるクラスターのIDです。また、クラスターIDのリストにすることもできます。これはオプションのパラメーターです。
* `gidMin`、`gidMax`:StorageClassのGID範囲の最小値と最大値。この範囲内の一意の値(GID)(gidMin-gidMax)が、動的にプロビジョニングされたボリュームに使用されます。これらはオプションの値です。指定しない場合、ボリュームは、それぞれgidMinとgidMaxのデフォルトである2000から2147483647の間の値でプロビジョニングされます。
* `volumetype`:ボリュームタイプとそのパラメーターは、このオプションの値で構成できます。ボリュームタイプが記載されていない場合、プロビジョニング担当者がボリュームタイプを決定します。
    例えば、
    * レプリカボリューム:`volumetype: replica:3`ここで、'3'はレプリカ数です。
    * Disperse/ECボリューム:`volumetype: disperse:4:2`ここで、'4'はデータ、'2'は冗長数です。
    * ボリュームの分配:`volumetype: none`

    利用可能なボリュームタイプと管理オプションについては、[管理ガイド](https://access.redhat.com/documentation/en-us/red_hat_gluster_storage/)を参照してください。

    詳細な参考情報については、[Heketiの設定方法](https://github.com/heketi/heketi/wiki/Setting-up-the-topology)を参照してください。

    永続ボリュームが動的にプロビジョニングされると、Glusterプラグインはエンドポイントとヘッドレスサービスを`gluster-dynamic-<claimname>`という名前で自動的に作成します。永続ボリューム要求が削除されると、動的エンドポイントとサービスは自動的に削除されます。

### NFS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-nfs
provisioner: example.com/external-nfs
parameters:
  server: nfs-server.example.com
  path: /share
  readOnly: "false"
```

* `server`:サーバーは、NFSサーバーのホスト名またはIPアドレスです。
* `path`:NFSサーバーによってエクスポートされるパス。
* `readOnly`:ストレージが読み取り専用としてマウントされるかどうかを示すフラグ(デフォルトはfalse)。

Kubernetesには、内部NFSプロビジョナーは含まれていません。NFS用のStorageClassを作成するには、外部プロビジョナーを使用する必要があります。
ここではいくつかの例を示します。
* [NFS Ganeshaサーバーと外部プロビジョナー](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
* [NFSサブディレクトリ外部プロビジョナー](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### OpenStack Cinder

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gold
provisioner: kubernetes.io/cinder
parameters:
  availability: nova
```

* `availability`:アベイラビリティゾーン。指定されていない場合、ボリュームは通常、Kubernetesクラスターにノードがあるすべてのアクティブなゾーンにわたってラウンドロビン方式で処理されます。

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
このOpenStackの内部プロビジョナーは非推奨です。[OpenStackの外部クラウドプロバイダー](https://github.com/kubernetes/cloud-provider-openstack)をご利用ください。
{{< /note >}}

### vSphere

vSphereストレージクラスのプロビジョナーには2つのタイプがあります。

- [CSIプロビジョナー](#vsphere-provisioner-csi):`csi.vsphere.vmware.com`
- [vCPプロビジョナー](#vcp-provisioner):`kubernetes.io/vsphere-volume`

インツリープロビジョナーは[非推奨です](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi)。CSIプロビジョナーの詳細については、[Kubernetes vSphere CSIドライバー](https://vsphere-csi-driver.sigs.k8s.io/)および[vSphereVolume CSI移行](/ja/docs/concepts/storage/volumes/#vsphere-csi-migration)を参照してください。

#### CSIプロビジョナー {#vsphere-provisioner-csi}

vSphere CSI StorageClassプロビジョナーは、Tanzu Kubernetesクラスターと連携します。例については、[vSphere CSIリポジトリ](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml)を参照してください。

#### vCPプロビジョナー {#vcp-provisioner}

次の例では、VMware Cloud Provider(vCP) StorageClassプロビジョナーを使用しています。

1. ユーザー指定のディスク形式でStorageClassを作成します。

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: fast
    provisioner: kubernetes.io/vsphere-volume
    parameters:
      diskformat: zeroedthick
    ```

    `diskformat`:`thin`、`zeroedthick`、`eagerzeroedthick`。デフォルト:`"thin"`.

2. ユーザー指定のデータストアにディスクフォーマットのStorageClassを作成します。

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: fast
    provisioner: kubernetes.io/vsphere-volume
    parameters:
        diskformat: zeroedthick
        datastore: VSANDatastore
    ```

    `datastore`:ユーザーはStorageClassでデータストアを指定することもできます。
    ボリュームは、StorageClassで指定されたデータストア(この場合は`VSANDatastore`)に作成されます。このフィールドはオプションです。データストアが指定されていない場合、vSphere Cloud Providerの初期化に使用されるvSphere構成ファイルで指定されたデータストアにボリュームが作成されます。

3. kubernetes内のストレージポリシー管理

    * 既存のvCenter SPBMポリシーを使用

        vSphere for Storage Managementの最も重要な機能の1つは、ポリシーベースの管理です。Storage Policy Based Management(SPBM)は、幅広いデータサービスとストレージソリューションにわたって単一の統合コントロールプレーンを提供するストレージポリシーフレームワークです。SPBMにより、vSphere管理者は、キャパシティプランニング、差別化されたサービスレベル、キャパシティヘッドルームの管理など、事前のストレージプロビジョニングの課題を克服できます。SPBMポリシーは、`storagePolicyName`パラメーターを使用してStorageClassで指定できます。

    * Kubernetes内でのVirtual SANポリシーのサポート

        Vsphere Infrastructure(VI)管理者は、動的ボリュームプロビジョニング中にカスタムVirtual SANストレージ機能を指定できます。動的なボリュームプロビジョニング時に、パフォーマンスや可用性などのストレージ要件をストレージ機能の形で定義できるようになりました。ストレージ機能の要件はVirtual SANポリシーに変換され、永続ボリューム(仮想ディスク)の作成時にVirtual SANレイヤーにプッシュダウンされます。仮想ディスクは、要件を満たすためにVirtual SANデータストア全体に分散されます。

        永続的なボリューム管理にストレージポリシーを使用する方法の詳細については、[ボリュームの動的プロビジョニングのためのストレージポリシーベースの管理](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)を参照してください。

[vSphereの例](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) では、Kubernetes for vSphere内で永続的なボリューム管理を試すことができます。

### Ceph RBD

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/rbd
parameters:
  monitors: 10.16.153.105:6789
  adminId: kube
  adminSecretName: ceph-secret
  adminSecretNamespace: kube-system
  pool: kube
  userId: kube
  userSecretName: ceph-secret-user
  userSecretNamespace: default
  fsType: ext4
  imageFormat: "2"
  imageFeatures: "layering"
```

* `monitors`:カンマ区切りのCephモニター。このパラメーターは必須です。
* `adminId`:プールにイメージを作成できるCephクライアントID。デフォルトは"admin"です。
* `adminSecretName`:`adminId`のシークレット名。このパラメーターは必須です。指定されたシークレットのタイプは"kubernetes.io/rbd"である必要があります。
* `adminSecretNamespace`:`adminSecretName`の名前空間。デフォルトは"default"です。
* `pool`:Ceph RBDプール。デフォルトは"rbd"です。
* `userId`:RBDイメージのマッピングに使用されるCephクライアントID。デフォルトは`adminId`と同じです。
* `userSecretName`:RBDイメージをマップするための`userId`のCephシークレットの名前。PVCと同じ名前空間に存在する必要があります。このパラメーターは必須です。提供されたシークレットのタイプは"kubernetes.io/rbd"である必要があります。たとえば、次のように作成されます。

    ```shell
    kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
      --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
      --namespace=kube-system
    ```
* `userSecretNamespace`:`userSecretName`の名前空間。
* `fsType`:kubernetesでサポートされているfsType。デフォルト:`"ext4"`。
* `imageFormat`:Ceph RBDイメージ形式、"1"または"2"。デフォルトは"2"です。
* `imageFeatures`:このパラメーターはオプションであり、`imageFormat`を"2"に設定した場合にのみ使用する必要があります。現在サポートされている機能は`layering`のみです。デフォルトは""で、オンになっている機能はありません。

### Azure Disk

#### Azure Unmanaged Disk storage class {#azure-unmanaged-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

* `skuName`:AzureストレージアカウントのSku層。デフォルトは空です。
* `location`:Azureストレージアカウントの場所。デフォルトは空です。
* `storageAccount`:Azureストレージアカウント名。ストレージアカウントを指定する場合、それはクラスターと同じリソースグループに存在する必要があり、`location`は無視されます。ストレージアカウントが指定されていない場合、クラスターと同じリソースグループに新しいストレージアカウントが作成されます。

#### Azure Disk storage class (starting from v1.7.2) {#azure-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Standard_LRS
  kind: managed
```

* `storageaccounttype`:AzureストレージアカウントのSku層。デフォルトは空です。
* `kind`:可能な値は、`shared`、`dedicated`、および`managed`(デフォルト)です。`kind`が`shared`の場合、すべてのアンマネージドディスクは、クラスターと同じリソースグループ内のいくつかの共有ストレージアカウントに作成されます。`kind`が`dedicated`の場合、新しい専用ストレージアカウントが、クラスターと同じリソースグループ内の新しいアンマネージドディスク用に作成されます。`kind`が`managed`の場合、すべてのマネージドディスクはクラスターと同じリソースグループに作成されます。
* `resourceGroup`:Azureディスクが作成されるリソースグループを指定します。これは、既存のリソースグループ名である必要があります。指定しない場合、ディスクは現在のKubernetesクラスターと同じリソースグループに配置されます。

- Premium VMはStandard_LRSディスクとPremium_LRSディスクの両方を接続できますが、Standard VMはStandard_LRSディスクのみを接続できます。
- マネージドVMはマネージドディスクのみをアタッチでき、アンマネージドVMはアンマネージドディスクのみをアタッチできます。

### Azure File

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

* `skuName`:AzureストレージアカウントのSku層。デフォルトは空です。
* `location`:Azureストレージアカウントの場所。デフォルトは空です。
* `storageAccount`:Azureストレージアカウント名。デフォルトは空です。ストレージアカウントが指定されていない場合は、リソースグループに関連付けられているすべてのストレージアカウントが検索され、`skuName`と`location`に一致するものが見つかります。ストレージアカウントを指定する場合は、クラスターと同じリソースグループに存在する必要があり、`skuName`と`location`は無視されます。
* `secretNamespace`:Azureストレージアカウント名とキーを含むシークレットの名前空間。デフォルトはPodと同じです。
* `secretName`:Azureストレージアカウント名とキーを含むシークレットの名前。デフォルトは`azure-storage-account-<accountName>-secret`です
* `readOnly`:ストレージが読み取り専用としてマウントされるかどうかを示すフラグ。デフォルトはfalseで、読み取り/書き込みマウントを意味します。この設定は、VolumeMountsの`ReadOnly`設定にも影響します。

ストレージのプロビジョニング中に、`secretName`という名前のシークレットがマウント資格証明用に作成されます。クラスターで[RBAC](/ja/docs/reference/access-authn-authz/rbac/)と[Controller Roles](/ja/docs/reference/access-authn-authz/rbac/#controller-roles)の両方が有効になっている場合は、追加します。clusterrole`system:controller:persistent-volume-binder`に対するリソース`secret`の`create`パーミッション。

マルチテナンシーコンテキストでは、`secretNamespace`の値を明示的に設定することを強くお勧めします。そうしないと、ストレージアカウントの資格情報が他のユーザーに読み取られる可能性があります。


### Portworx Volume

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: portworx-io-priority-high
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "1"
  snap_interval:   "70"
  priority_io:  "high"

```

* `fs`:配置するファイルシステム:`none/xfs/ext4`(デフォルト:`ext4`)。
* `block_size`:キロバイト単位のブロックサイズ(デフォルト:`32`)。
* `repl`:レプリケーション係数`1..3`の形式で提供される同期レプリカの数(デフォルト:`1`)。ここでは文字列が期待されます。つまり、`1`ではなく`"1"`です。
* `priority_io`:ボリュームがパフォーマンスの高いストレージから作成されるか、優先度の低いストレージ`high/medium/low`(デフォルト:`low`)から作成されるかを決定します。
* `snap_interval`:スナップショットをトリガーするクロック/時間間隔(分単位)。スナップショットは、前のスナップショットとの差分に基づいて増分されます。0はスナップを無効にします(デフォルト:`0`)。ここでは文字列が必要です。つまり、`70`ではなく`"70"`です。
* `aggregation_level`:ボリュームが分散されるチャンクの数を指定します。0は非集約ボリュームを示します(デフォルト:`0`)。ここには文字列が必要です。つまり、`0`ではなく`"0"`です。
* `ephemeral`:アンマウント後にボリュームをクリーンアップするか、永続化するかを指定します。`emptyDir`ユースケースではこの値をtrueに設定でき、Cassandraなどのデータベースのような`persistent volumes`ユースケースではfalse、`true/false`(デフォルトは`false`)に設定する必要があります。ここでは文字列が必要です。つまり、`true`ではなく`"true"`です。

### Local

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

ローカルボリュームは現在、動的プロビジョニングをサポートしていませんが、Podのスケジューリングまでボリュームバインドを遅らせるには、引き続きStorageClassを作成する必要があります。これは、`WaitForFirstConsumer`ボリュームバインディングモードによって指定されます。

ボリュームバインディングを遅延させると、PersistentVolumeClaimに適切なPersistentVolumeを選択するときに、スケジューラはPodのスケジューリング制約をすべて考慮することができます。
