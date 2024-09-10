---
title: ボリューム
content_type: concept
weight: 10
---

<!-- overview -->

コンテナ内のディスク上のファイルは一時的なものであり、コンテナ内で実行する場合、重要なアプリケーションでいくつかの問題が発生します。1つの問題は、コンテナがクラッシュしたときにファイルが失われることです。kubeletはコンテナを再起動しますが、クリーンな状態です。
2番目の問題は、`Pod`で一緒に実行されているコンテナ間でファイルを共有するときに発生します。
Kubernetes{{< glossary_tooltip text="ボリューム" term_id="volume" >}}の抽象化は、これらの問題の両方を解決します。
[Pod](/ja/docs/concepts/workloads/pods/)に精通していることをお勧めします。

<!-- body -->

## 背景

Dockerには[ボリューム](https://docs.docker.com/storage/)の概念がありますが、多少緩く、管理も不十分です。Dockerボリュームは、ディスク上または別のコンテナ内のディレクトリです。Dockerはボリュームドライバーを提供しますが、機能は多少制限されています。

Kubernetesは多くの種類のボリュームをサポートしています。
{{< glossary_tooltip term_id="pod" text="Pod" >}}は任意の数のボリュームタイプを同時に使用できます。
エフェメラルボリュームタイプにはPodの存続期間がありますが、永続ボリュームはPodの存続期間を超えて存在します。
Podが存在しなくなると、Kubernetesはエフェメラルボリュームを破棄します。ただしKubernetesは永続ボリュームを破棄しません。
特定のPod内のあらゆる種類のボリュームについて、データはコンテナの再起動後も保持されます。

コアとなるボリュームはディレクトリであり、Pod内のコンテナからアクセスできるデータが含まれている可能性があります。
ディレクトリがどのように作成されるか、それをバックアップするメディア、およびそのコンテンツは、使用する特定のボリュームタイプによって決まります。

ボリュームを使用するには、`.spec.volumes`でPodに提供するボリュームを指定し、`.spec.containers[*].volumeMounts`でそれらのボリュームをコンテナにマウントする場所を宣言します。
コンテナ内のプロセスは{{< glossary_tooltip text="コンテナイメージ" term_id="image" >}}の初期コンテンツと、コンテナ内にマウントされたボリューム(定義されている場合)で構成されるファイルシステムビューを確認します。
プロセスは、コンテナイメージのコンテンツと最初に一致するルートファイルシステムを確認します。
そのファイルシステム階層内への書き込みは、もし許可されている場合、後続のファイルシステムアクセスを実行するときにそのプロセスが表示する内容に影響します。
ボリュームはイメージ内の[指定されたパス](#using-subpath)へマウントされます。
Pod内で定義されたコンテナごとに、コンテナが使用する各ボリュームをマウントする場所を個別に指定する必要があります。


ボリュームは他のボリューム内にマウントできません(ただし、関連するメカニズムについては、[subPathの使用](#using-subpath)を参照してください)。
またボリュームには、別のボリューム内の何かへのハードリンクを含めることはできません。

## ボリュームの種類 {#volume-types}

Kubernetesはいくつかのタイプのボリュームをサポートしています。

### awsElasticBlockStore {#awselasticblockstore}

`awsElasticBlockStore`ボリュームは、Amazon Web Services(AWS)[EBSボリューム](https://aws.amazon.com/ebs/)をPodにマウントします。
Podを削除すると消去される`emptyDir`とは異なり、EBSボリュームのコンテンツは保持されたままボリュームはアンマウントされます。
これは、EBSボリュームにデータを事前入力でき、データをPod間で共有できることを意味します。

{{< note >}}
使用する前に、`aws ec2 create-volume`またはAWSAPIを使用してEBSボリュームを作成する必要があります。
{{< /note >}}

`awsElasticBlockStore`ボリュームを使用する場合、いくつかの制限があります。

* Podが実行されているノードはAWS EC2インスタンスである必要があります
* これらのインスタンスは、EBSボリュームと同じリージョンおよびアベイラビリティーゾーンにある必要があります
* EBSは、ボリュームをマウントする単一のEC2インスタンスのみをサポートします

#### AWS EBSボリュームの作成

PodでEBSボリュームを使用する前に作成する必要があります。

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

ゾーンがクラスターを立ち上げたゾーンと一致していることを確認してください。サイズとEBSボリュームタイプが使用に適していることを確認してください。

#### AWS EBS設定例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # This AWS EBS volume must already exist.
    awsElasticBlockStore:
      volumeID: "<volume id>"
      fsType: ext4
```

EBSボリュームがパーティション化されている場合は、オプションのフィールド`partition: "<partition number>"`を指定して、マウントするパーティションを指定できます。

#### AWS EBS CSIの移行

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

`awsElasticBlockStore`の`CSIMigration`機能を有効にすると、すべてのプラグイン操作が既存のツリー内プラグインから`ebs.csi.aws.com`Container Storage Interface(CSI)ドライバーにリダイレクトされます。
この機能を使用するには、[AWS EBS CSIドライバー](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)がクラスターにインストールされ、`CSIMigration`と`CSIMigrationAWS`のbeta機能が有効になっている必要があります。

#### AWS EBS CSIの移行の完了

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

`awsElasticBlockStore`ストレージプラグインがコントローラーマネージャーとkubeletによって読み込まれないようにするには、`InTreePluginAWSUnregister`フラグを`true`に設定します。

### azureDisk {#azuredisk}

`azureDisk`ボリュームタイプは、MicrosoftAzure[データディスク](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers)をPodにマウントします。

詳細については、[`azureDisk`ボリュームプラグイン](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md)を参照してください。

#### azureDisk CSIの移行

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

`azureDisk`の`CSIMigration`機能を有効にすると、すべてのプラグイン操作が既存のツリー内プラグインから`disk.csi.azure.com`Container Storage Interface(CSI)ドライバーにリダイレクトされます。
この機能を利用するには、クラスターに[Azure Disk CSI Driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver)をインストールし、`CSIMigration`および`CSIMigrationAzureDisk`機能を有効化する必要があります。

### azureFile {#azurefile}

`azureFile`ボリュームタイプは、Microsoft Azureファイルボリューム(SMB 2.1および3.0)をPodにマウントします。

詳細については[`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md)を参照してください。

#### azureFile CSIの移行

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

`zureFile`の`CSIMigration`機能を有効にすると、既存のツリー内プラグインから`file.csi.azure.com`Container Storage Interface(CSI)Driverへすべてのプラグイン操作がリダイレクトされます。
この機能を利用するには、クラスターに[Azure File CSI Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)をインストールし、`CSIMigration`および`CSIMigrationAzureFile`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効化する必要があります。

Azure File CSIドライバーは、異なるfsgroupで同じボリュームを使用することをサポートしていません。AzurefileCSIの移行が有効になっている場合、異なるfsgroupで同じボリュームを使用することはまったくサポートされません。

### cephfs

`cephfs`ボリュームを使用すると、既存のCephFSボリュームをPodにマウントすることができます。
Podを取り外すと消去される`emptyDir`とは異なり、`cephfs`ボリュームは内容を保持したまま単にアンマウントされるだけです。
つまり`cephfs`ボリュームにあらかじめデータを入れておき、そのデータをPod間で共有することができます。
`cephfs`ボリュームは複数の書き込み元によって同時にマウントすることができます。


{{< note >}}
事前に共有をエクスポートした状態で、自分のCephサーバーを起動しておく必要があります。
{{< /note >}}

詳細については[CephFSの例](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/)を参照してください。

### cinder

{{< note >}}
KubernetesはOpenStackクラウドプロバイダーで構成する必要があります。
{{< /note >}}

`cinder`ボリュームタイプは、PodにOpenStackのCinderのボリュームをマウントするために使用されます。

#### Cinderボリュームの設定例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # This OpenStack volume must already exist.
    cinder:
      volumeID: "<volume id>"
      fsType: ext4
```

#### OpenStack CSIの移行

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

Cinderの`CSIMigration`機能は、Kubernetes1.21ではデフォルトで有効になっています。
既存のツリー内プラグインからのすべてのプラグイン操作を`cinder.csi.openstack.org`Container Storage Interface(CSI) Driverへリダイレクトします。
[OpenStack Cinder CSIドライバー](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)をクラスターにインストールする必要があります。
`CSIMigrationOpenStack`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を`false`に設定すると、クラスターのCinder CSIマイグレーションを無効化することができます。
`CSIMigrationOpenStack`機能を無効にすると、ツリー内のCinderボリュームプラグインがCinderボリュームのストレージ管理のすべての側面に責任を持つようになります。

### configMap

[ConfigMap](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)は構成データをPodに挿入する方法を提供します。
ConfigMapに格納されたデータは、タイプ`configMap`のボリュームで参照され、Podで実行されているコンテナ化されたアプリケーションによって使用されます。

ConfigMapを参照するときは、ボリューム内のConfigMapの名前を指定します。
ConfigMapの特定のエントリに使用するパスをカスタマイズできます。
次の設定は、`log-config` ConfigMapを`configmap-pod`というPodにマウントする方法を示しています。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

`log-config`ConfigMapはボリュームとしてマウントされ、その`log_level`エントリに格納されているすべてのコンテンツは、パス`/etc/config/log_level`のPodにマウントされます。
このパスはボリュームの`mountPath`と`log_level`をキーとする`path`から派生することに注意してください。


{{< note >}}
* 使用する前に[ConfigMap](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)を作成する必要があります。

* [`subPath`](#using-subpath)ボリュームマウントとしてConfigMapを使用するコンテナはConfigMapの更新を受信しません。

* テキストデータはUTF-8文字エンコードを使用してファイルとして公開されます。その他の文字エンコードには`binaryData`を使用します。
{{< /note >}}

### downwardAPI {#downwardapi}

`downwardAPI`ボリュームは、アプリケーションへのdownward APIデータを利用できるようになります。ディレクトリをマウントし、要求されたデータをプレーンテキストファイルに書き込みます。

{{< note >}}
[`subPath`](#using-subpath)ボリュームマウントとしてdownward APIを使用するコンテナは、downward APIの更新を受け取りません。
{{< /note >}}

詳細については[downward API example](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)を参照してください。

### emptyDir {#emptydir}

`emptyDir`ボリュームはPodがノードに割り当てられたときに最初に作成され、そのPodがそのノードで実行されている限り存在します。
名前が示すように`emptyDir`ボリュームは最初は空です。
Pod内のすべてのコンテナは`emptyDir`ボリューム内の同じファイルを読み書きできますが、そのボリュームは各コンテナで同じパスまたは異なるパスにマウントされることがあります。
何らかの理由でPodがノードから削除されると、`emptyDir`内のデータは永久に削除されます。

{{< note >}}
コンテナがクラッシュしても、ノードからPodが削除されることは*ありません*。`emptyDir`ボリューム内のデータは、コンテナのクラッシュしても安全です。

{{< /note >}}

`emptyDir`のいくつかの用途は次の通りです。

* ディスクベースのマージソートなどのスクラッチスペース
* クラッシュからの回復のための長い計算のチェックポイント
* Webサーバーコンテナがデータを提供している間にコンテンツマネージャコンテナがフェッチするファイルを保持する

環境に応じて、`emptyDir`ボリュームは、ディスクやSSD、ネットワークストレージなど、ノードをバックアップするあらゆる媒体に保存されます。
ただし、`emptyDir.medium`フィールドを`"Memory"`に設定すると、Kubernetesは代わりにtmpfs(RAMベースのファイルシステム)をマウントします。
tmpfsは非常に高速ですが、ディスクと違ってノードのリブート時にクリアされ、書き込んだファイルはコンテナのメモリー制限にカウントされることに注意してください。

{{< note >}}
`SizeMemoryBackedVolumes`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効な場合、メモリーバックアップボリュームにサイズを指定することができます。
サイズが指定されていない場合、メモリーでバックアップされたボリュームは、Linuxホストのメモリーの50％のサイズになります。
{{< /note>}}

#### emptyDirの設定例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### fc (fibre channel) {#fc}

`fc`ボリュームタイプを使用すると、既存のファイバーチャネルブロックストレージボリュームをPodにマウントできます。
`targetWWNs`ボリューム構成のパラメーターを使用して、単一または複数のターゲットWorld Wide Name(WWN)を指定できます。
複数のWWNが指定されている場合、targetWWNは、それらのWWNがマルチパス接続からのものであると想定します。

{{< note >}}
Kubernetesホストがアクセスできるように、事前にこれらのLUN(ボリューム)をターゲットWWNに割り当ててマスクするようにFCSANゾーニングを構成する必要があります。
{{< /note >}}

詳細については[fibre channelの例](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)を参照してください。

### flocker (非推奨) {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker)はオープンソースのクラスター化されたコンテナデータボリュームマネージャーです。
Flockerは、さまざまなストレージバックエンドに支えられたデータボリュームの管理とオーケストレーションを提供します。

`flocker`ボリュームを使用すると、FlockerデータセットをPodにマウントできます。
もしデータセットがまだFlockerに存在しない場合は、まずFlocker CLIかFlocker APIを使ってデータセットを作成する必要があります。
データセットがすでに存在する場合は、FlockerによってPodがスケジュールされているノードに再アタッチされます。
これは、必要に応じてPod間でデータを共有できることを意味します。

{{< note >}}
使用する前に、独自のFlockerインストールを実行する必要があります。
{{< /note >}}

詳細については[Flocker example](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker)を参照してください。

### gcePersistentDisk

`gcePersistentDisk`ボリュームは、Google Compute Engine (GCE)の[永続ディスク](https://cloud.google.com/compute/docs/disks)(PD)をPodにマウントします。
Podを取り外すと消去される`emptyDir`とは異なり、PDの内容は保持されボリュームは単にアンマウントされるだけです。これはPDにあらかじめデータを入れておくことができ、そのデータをPod間で共有できることを意味します。

{{< note >}}
`gcloud`を使用する前に、またはGCE APIまたはUIを使用してPDを作成する必要があります。
{{< /note >}}

`gcePersistentDisk`を使用する場合、いくつかの制限があります。

* Podが実行されているノードはGCE VMである必要があります
* これらのVMは、永続ディスクと同じGCEプロジェクトおよびゾーンに存在する必要があります

GCE永続ディスクの機能の1つは、永続ディスクへの同時読み取り専用アクセスです。`gcePersistentDisk`ボリュームを使用すると、複数のコンシューマーが永続ディスクを読み取り専用として同時にマウントできます。
これはPDにデータセットを事前入力してから、必要な数のPodから並行して提供できることを意味します。
残念ながらPDは読み取り/書き込みモードで1つのコンシューマーのみがマウントできます。同時書き込みは許可されていません。

PDが読み取り専用であるか、レプリカ数が0または1でない限り、ReplicaSetによって制御されるPodでGCE永続ディスクを使用すると失敗します。

#### GCE永続ディスクの作成 {#gce-create-persistent-disk}

PodでGCE永続ディスクを使用する前に、それを作成する必要があります。

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### GCE永続ディスクの設定例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # This GCE PD must already exist.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

#### リージョン永続ディスク

[リージョン永続ディスク](https://cloud.google.com/compute/docs/disks/#repds)機能を使用すると、同じリージョン内の2つのゾーンで使用できる永続ディスクを作成できます。
この機能を使用するには、ボリュームをPersistentVolumeとしてプロビジョニングする必要があります。Podから直接ボリュームを参照することはサポートされていません。

#### リージョンPD PersistentVolumeを手動でプロビジョニングする

[GCE PDのStorageClass](/docs/concepts/storage/storage-classes/#gce-pd)を使用して動的プロビジョニングが可能です。
SPDPersistentVolumeを作成する前に、永続ディスクを作成する必要があります。

```shell
gcloud compute disks create --size=500GB my-data-disk
  --region us-central1
  --replica-zones us-central1-a,us-central1-b
```

#### リージョン永続ディスクの設定例

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        # failure-domain.beta.kubernetes.io/zone should be used prior to 1.21
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-central1-a
          - us-central1-b
```

#### GCE CSIの移行

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

GCE PDの`CSIMigration`機能を有効にすると、すべてのプラグイン操作が既存のツリー内プラグインから`pd.csi.storage.gke.io`Container Storage Interface (CSI) Driverにリダイレクトされるようになります。
この機能を使用するには、クラスターに[GCE PD CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)がインストールされ、`CSIMigration`と`CSIMigrationGCE`のbeta機能が有効になっている必要があります。

#### GCE CSIの移行の完了

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

`gcePersistentDisk`ストレージプラグインがコントローラーマネージャーとkubeletによって読み込まれないようにするには、`InTreePluginGCEUnregister`フラグを`true`に設定します。

### gitRepo(非推奨) {#gitrepo}

{{< warning >}}
`gitRepo`ボリュームタイプは非推奨です。gitリポジトリを使用してコンテナをプロビジョニングするには、Gitを使用してリポジトリのクローンを作成するInitContainerに[EmptyDir](#emptydir)をマウントしてから、Podのコンテナに[EmptyDir](#emptydir)をマウントします。
{{< /warning >}}

`gitRepo`ボリュームは、ボリュームプラグインの一例です。このプラグインは空のディレクトリをマウントし、そのディレクトリにgitリポジトリをクローンしてPodで使えるようにします。

`gitRepo`ボリュームの例を次に示します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs

`glusterfs`ボリュームは[Glusterfs](https://www.gluster.org)(オープンソースのネットワークファイルシステム)ボリュームをPodにマウントできるようにするものです。
Podを取り外すと消去される`emptyDir`とは異なり、`glusterfs`ボリュームの内容は保持され、単にアンマウントされるだけです。
これは、glusterfsボリュームにデータを事前に入力でき、データをPod間で共有できることを意味します。
GlusterFSは複数のライターが同時にマウントすることができます。

{{< note >}}
GlusterFSを使用するためには、事前にGlusterFSのインストールを実行しておく必要があります。
{{< /note >}}

詳細については[GlusterFSの例](https://github.com/kubernetes/examples/tree/master/volumes/glusterfs)を参照してください。

### hostPath {#hostpath}

{{< warning >}}
HostPathボリュームには多くのセキュリティリスクがあり、可能な場合はHostPathの使用を避けることがベストプラクティスです。HostPathボリュームを使用する必要がある場合は、必要なファイルまたはディレクトリのみにスコープを設定し、読み取り専用としてマウントする必要があります。

AdmissionPolicyによって特定のディレクトリへのHostPathアクセスを制限する場合、ポリシーを有効にするために`volumeMounts`は`readOnly`マウントを使用するように要求されなければなりません。
{{< /warning >}}

`hostPath`ボリュームは、ファイルまたはディレクトリをホストノードのファイルシステムからPodにマウントします。
これはほとんどのPodに必要なものではありませんが、一部のアプリケーションには強力なエスケープハッチを提供します。

たとえば`hostPath`のいくつかの使用法は次のとおりです。

* Dockerの内部にアクセスする必要があるコンテナを実行する場合:`hostPath`に`/var/lib/docker`を使用します。
* コンテナ内でcAdvisorを実行する場合:`hostPath`に`/sys`を指定します。
* Podが実行される前に、与えられた`hostPath`が存在すべきかどうか、作成すべきかどうか、そして何として存在すべきかを指定できるようにします。

必須の`path`プロパティに加えて、オプションで`hostPath`ボリュームに`type`を指定することができます。

フィールド`type`でサポートされている値は次のとおりです。

| 値 | ふるまい |
|:------|:---------|
| | 空の文字列(デフォルト)は下位互換性のためです。つまり、hostPathボリュームをマウントする前にチェックは実行されません。 |
| `DirectoryOrCreate` | 指定されたパスに何も存在しない場合、必要に応じて、権限を0755に設定し、Kubeletと同じグループと所有権を持つ空のディレクトリが作成されます。 |
| `Directory` | 指定されたパスにディレクトリが存在する必要があります。 |
| `FileOrCreate` | 指定されたパスに何も存在しない場合、必要に応じて、権限を0644に設定し、Kubeletと同じグループと所有権を持つ空のファイルが作成されます。 |
| `File` | 指定されたパスにファイルが存在する必要があります。 |
| `Socket` | UNIXソケットは、指定されたパスに存在する必要があります。 |
| `CharDevice` | キャラクターデバイスは、指定されたパスに存在する必要があります。 |
| `BlockDevice` | ブロックデバイスは、指定されたパスに存在する必要があります。 |

このタイプのボリュームを使用するときは、以下の理由のため注意してください。

* HostPath は、特権的なシステム認証情報(Kubeletなど)や特権的なAPI(コンテナランタイムソケットなど)を公開する可能性があり、コンテナのエスケープやクラスターの他の部分への攻撃に利用される可能性があります。
* 同一構成のPod(PodTemplateから作成されたものなど)は、ノード上のファイルが異なるため、ノードごとに動作が異なる場合があります。
* ホスト上に作成されたファイルやディレクトリは、rootでしか書き込みができません。[特権コンテナ](/docs/tasks/configure-pod-container/security-context/)内でrootとしてプロセスを実行するか、ホスト上のファイルのパーミッションを変更して`hostPath`ボリュームに書き込みができるようにする必要があります。

#### hostPathの設定例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # directory location on host
      path: /data
      # this field is optional
      type: Directory
```

{{< caution >}}
`FileOrCreate`モードでは、ファイルの親ディレクトリは作成されません。マウントされたファイルの親ディレクトリが存在しない場合、Podは起動に失敗します。
このモードが確実に機能するようにするには、[`FileOrCreate`構成](＃hostpath-fileorcreate-example)に示すように、ディレクトリとファイルを別々にマウントしてみてください。
{{< /caution >}}

#### hostPath FileOrCreateの設定例 {#hostpath-fileorcreate-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # Ensure the file directory is created.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### iscsi

`iscsi`ボリュームは、既存のiSCSI(SCSI over IP)ボリュームをPodにマウントすることができます。
Podを取り外すと消去される`emptyDir`とは異なり、`iscsi`ボリュームの内容は保持され、単にアンマウントされるだけです。
つまり、iscsiボリュームにはあらかじめデータを入れておくことができ、そのデータをPod間で共有することができるのです。


{{< note >}}
使用する前に、ボリュームを作成したiSCSIサーバーを起動する必要があります。

{{< /note >}}

iSCSIの特徴として、複数のコンシューマーから同時に読み取り専用としてマウントできることが挙げられます。
つまり、ボリュームにあらかじめデータセットを入れておき、必要な数のPodから並行してデータを提供することができます。
残念ながら、iSCSIボリュームは1つのコンシューマによってのみ読み書きモードでマウントすることができます。
同時に書き込みを行うことはできません。

詳細については[iSCSIの例](https://github.com/kubernetes/examples/tree/master/volumes/iscsi)を参照してください。

### local

`local`ボリュームは、ディスク、パーティション、ディレクトリなど、マウントされたローカルストレージデバイスを表します。

ローカルボリュームは静的に作成されたPersistentVolumeとしてのみ使用できます。動的プロビジョニングはサポートされていません。

`hostPath`ボリュームと比較して、`local`ボリュームは手動でノードにPodをスケジューリングすることなく、耐久性と移植性に優れた方法で使用することができます。
システムはPersistentVolume上のノードアフィニティーを見ることで、ボリュームのノード制約を認識します。

ただし、`local`ボリュームは、基盤となるノードの可用性に左右されるため、すべてのアプリケーションに適しているわけではありません。
ノードが異常になると、Podは`local`ボリュームにアクセスできなくなります。
このボリュームを使用しているPodは実行できません。`local`ボリュームを使用するアプリケーションは、基盤となるディスクの耐久性の特性に応じて、この可用性の低下と潜在的なデータ損失に耐えられる必要があります。

次の例では、`local`ボリュームと`nodeAffinity`を使用したPersistentVolumeを示しています。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

ローカルボリュームを使用する場合は、PersistentVolume `nodeAffinity`を設定する必要があります。
KubernetesのスケジューラはPersistentVolume `nodeAffinity`を使用して、これらのPodを正しいノードにスケジューリングします。

PersistentVolume `volumeMode`を(デフォルト値の「Filesystem」ではなく)「Block」に設定して、ローカルボリュームをrawブロックデバイスとして公開できます。

ローカルボリュームを使用する場合、`volumeBindingMode`を`WaitForFirstConsumer`に設定したStorageClassを作成することをお勧めします。
詳細については、local [StorageClass](/docs/concepts/storage/storage-classes/#local)の例を参照してください。
ボリュームバインディングを遅延させると、PersistentVolumeClaimバインディングの決定が、ノードリソース要件、ノードセレクター、Podアフィニティ、Podアンチアフィニティなど、Podが持つ可能性のある他のノード制約も含めて評価されるようになります。

ローカルボリュームのライフサイクルの管理を改善するために、外部の静的プロビジョナーを個別に実行できます。
このプロビジョナーはまだ動的プロビジョニングをサポートしていないことに注意してください。
外部ローカルプロビジョナーの実行方法の例については、[ローカルボリュームプロビジョナーユーザーガイド](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)を参照してください。

{{< note >}}
ボリュームのライフサイクルを管理するために外部の静的プロビジョナーが使用されていない場合、ローカルのPersistentVolumeは、ユーザーによる手動のクリーンアップと削除を必要とします。
{{< /note >}}

### nfs

`nfs`ボリュームは、既存のNFS(Network File System)共有をPodにマウントすることを可能にします。Podを取り外すと消去される`emptyDir`とは異なり、`nfs`ボリュームのコンテンツは保存され、単にアンマウントされるだけです。
つまり、NFSボリュームにはあらかじめデータを入れておくことができ、そのデータをPod間で共有することができます。
NFSは複数のライターによって同時にマウントすることができます。

{{< note >}}
使用する前に、共有をエクスポートしてNFSサーバーを実行する必要があります。
{{< /note >}}

詳細については[NFSの例](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)を参照してください。

### persistentVolumeClaim {#persistentvolumeclaim}

`PersistentVolumeClaim`ボリュームは[PersistentVolume](/ja/docs/concepts/storage/persistent-volumes/)をPodにマウントするために使用されます。
PersistentVolumeClaimは、ユーザが特定のクラウド環境の詳細を知らなくても、耐久性のあるストレージ(GCE永続ディスクやiSCSIボリュームなど)を「要求」するための方法です。

詳細については[PersistentVolume](/ja/docs/concepts/storage/persistent-volumes/)を参照してください。

### portworxVolume {#portworxvolume}

`portworxVolume`は、Kubernetesとハイパーコンバージドで動作するエラスティックブロックストレージレイヤーです。
[Portworx](https://portworx.com/use-case/kubernetes-storage/)は、サーバー内のストレージをフィンガープリントを作成し、機能に応じて階層化し、複数のサーバーにまたがって容量を集約します。
Portworxは、仮想マシンまたはベアメタルのLinuxノードでゲスト内動作します。


`portworxVolume`はKubernetesを通して動的に作成することができますが、事前にプロビジョニングしてPodの中で参照することもできます。
以下は、事前にプロビジョニングされたPortworxボリュームを参照するPodの例です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # This Portworx volume must already exist.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
Podで使用する前に、`pxvol`という名前の既存のPortworxVolumeがあることを確認してください。
{{< /note >}}

詳細については[Portworxボリューム](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md)の例を参照してください。

### 投影

投影ボリュームは、複数の既存のボリュームソースを同じディレクトリにマッピングします。
詳細については[投影ボリューム](/docs/concepts/storage/projected-volumes/)を参照してください。

### quobyte(非推奨) {#quobyte}

`quobyte`ボリュームは、既存の[Quobyte](https://www.quobyte.com)ボリュームをPodにマウントすることができます。


{{< note >}}
使用する前にQuobyteをセットアップして、ボリュームを作成した状態で動作させる必要があります。
{{< /note >}}

CSIは、Kubernetes内部でQuobyteボリュームを使用するための推奨プラグインです。
QuobyteのGitHubプロジェクトには、CSIを使用してQuobyteをデプロイするための[手順](https://github.com/quobyte/quobyte-csi#quobyte-csi)と例があります

### rbd

`rbd`ボリュームは[Rados Block Device](https://docs.ceph.com/en/latest/rbd/)(RBD)ボリュームをPodにマウントすることを可能にします。
Podを取り外すと消去される`emptyDir`とは異なり、`rbd`ボリュームの内容は保存され、ボリュームはアンマウントされます。つまり、RBDボリュームにはあらかじめデータを入れておくことができ、そのデータをPod間で共有することができるのです。

{{< note >}}
RBDを使用する前に、Cephのインストールが実行されている必要があります。
{{< /note >}}

RBDの特徴として、複数のコンシューマーから同時に読み取り専用としてマウントできることが挙げられます。
つまり、ボリュームにあらかじめデータセットを入れておき、必要な数のPodから並行して提供することができるのです。
残念ながら、RBDボリュームは1つのコンシューマーによってのみ読み書きモードでマウントすることができます。
同時に書き込みを行うことはできません。

詳細については[RBDの例](https://github.com/kubernetes/examples/tree/master/volumes/rbd)を参照してください。

#### RBD CSIの移行 {#rbd-csi-migration}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

`RBD`の`CSIMigration`機能を有効にすると、既存のツリー内プラグインから`rbd.csi.ceph.com`{{< glossary_tooltip text="CSI" term_id="csi" >}}ドライバーにすべてのプラグイン操作がリダイレクトされます。
この機能を使用するには、クラスターに[Ceph CSIドライバー](https://github.com/ceph/ceph-csi)をインストールし、`CSIMigration`および`csiMigrationRBD`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にしておく必要があります。


{{< note >}}

ストレージを管理するKubernetesクラスターオペレーターとして、RBD CSIドライバーへの移行を試みる前に完了する必要のある前提条件は次のとおりです。

* Ceph CSIドライバー(`rbd.csi.ceph.com`)v3.5.0以降をKubernetesクラスターにインストールする必要があります。
* CSIドライバーの動作に必要なパラメーターとして`clusterID`フィールドがありますが、ツリー内StorageClassには`monitors`フィールドがあるため、Kubernetesストレージ管理者はCSI config mapでモニターハッシュ(例：`#echo -n '<monitors_string>' | md5sum`)に基づいたclusterIDを作成し、モニターをこのclusterID設定の下に保持しなければなりません。
* また、ツリー内Storageclassの`adminId`の値が`admin`と異なる場合、ツリー内Storageclassに記載されている`adminSecretName`に`adminId`パラメーター値のbase64値をパッチしなければなりませんが、それ以外はスキップすることが可能です。
{{< /note >}}

### secret

`secret`ボリュームは、パスワードなどの機密情報をPodに渡すために使用します。
Kubernetes APIにsecretを格納し、Kubernetesに直接結合することなくPodが使用するファイルとしてマウントすることができます。
`secret`ボリュームはtmpfs(RAM-backed filesystem)によってバックアップされるため、不揮発性ストレージに書き込まれることはありません。

{{< note >}}
使用する前にKubernetes APIでSecretを作成する必要があります。
{{< /note >}}

{{< note >}}
[`SubPath`](#using-subpath)ボリュームマウントとしてSecretを使用しているコンテナは、Secretの更新を受け取りません。
{{< /note >}}

詳細については[Secretの設定](/ja/docs/concepts/configuration/secret/)を参照してください。

### storageOS(非推奨) {#storageos}

`storageos`ボリュームを使用すると、既存の[StorageOS](https://www.storageos.com)ボリュームをPodにマウントできます。

StorageOSは、Kubernetes環境内でコンテナとして実行され、Kubernetesクラスター内の任意のノードからローカルストレージまたは接続されたストレージにアクセスできるようにします。
データを複製してノードの障害から保護することができます。シンプロビジョニングと圧縮により使用率を向上させ、コストを削減できます。

根本的にStorageOSは、コンテナにブロックストレージを提供しファイルシステムからアクセスできるようにします。

StorageOS Containerは64ビットLinuxを必要とし、追加の依存関係はありません。
無償の開発者ライセンスが利用可能です。


{{< caution >}}
StorageOSボリュームにアクセスする、またはプールにストレージ容量を提供する各ノードでStorageOSコンテナを実行する必要があります。
インストール手順については、[StorageOSドキュメント](https://docs.storageos.com)を参照してください。
{{< /caution >}}

次の例は、StorageOSを使用したPodの設定です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # The `redis-vol01` volume must already exist within StorageOS in the `default` namespace.
        volumeName: redis-vol01
        fsType: ext4
```

StorageOS、動的プロビジョニング、およびPersistentVolumeClaimの詳細については、[StorageOSの例](https://github.com/kubernetes/examples/blob/master/volumes/storageos)を参照してください。


### vsphereVolume {#vspherevolume}

{{< note >}}
KubernetesvSphereクラウドプロバイダーを設定する必要があります。クラウドプロバイダーの設定については、[vSphere入門ガイド](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)を参照してください。
{{< /note >}}

`vsphereVolume`は、vSphereVMDKボリュームをPodにマウントするために使用されます。
ボリュームの内容は、マウント解除されたときに保持されます。VMFSとVSANの両方のデータストアをサポートします。

{{< note >}}
Podで使用する前に、次のいずれかの方法を使用してvSphereVMDKボリュームを作成する必要があります。
{{< /note >}}

#### Creating a VMDK volume {#creating-vmdk-volume}

次のいずれかの方法を選択して、VMDKを作成します。

{{< tabs name="tabs_volumes" >}}
{{% tab name="vmkfstoolsを使用して作成する" %}}
最初にESXにSSHで接続し、次に以下のコマンドを使用してVMDKを作成します。

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```

{{% /tab %}}
{{% tab name="vmware-vdiskmanagerを使用して作成する" %}}
次のコマンドを使用してVMDKを作成します。

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```

{{% /tab %}}

{{< /tabs >}}

#### vSphere VMDKの設定例 {#vsphere-vmdk-configuration}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # This VMDK volume must already exist.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

詳細については[vSphereボリューム](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)の例を参照してください。

#### vSphere CSIの移行 {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

`vsphereVolume`の`CSIMigration`機能を有効にすると、既存のツリー内プラグインから`csi.vsphere.vmware.com`{{< glossary_tooltip text="CSI" term_id="csi" >}}ドライバーにすべてのプラグイン操作がリダイレクトされます。
この機能を使用するには、クラスターに[vSphere CSIドライバー](https://github.com/kubernetes-sigs/vsphere-csi-driver)がインストールされ、`CSIMigration`および`CSIMigrationvSphere`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっていなければなりません。

また、vSphere vCenter/ESXiのバージョンが7.0u1以上、HWのバージョンがVM version 15以上であることが条件です。


{{< note >}}
組み込みの`vsphereVolume`プラグインの次のStorageClassパラメーターは、vSphere CSIドライバーでサポートされていません。

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

これらのパラメーターを使用して作成された既存のボリュームはvSphere CSIドライバーに移行されますが、vSphere CSIドライバーで作成された新しいボリュームはこれらのパラメーターに従わないことに注意してください。

{{< /note >}}

#### vSphere CSIの移行の完了 {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

`vsphereVolume`プラグインがコントローラーマネージャーとkubeletによって読み込まれないようにするには、`InTreePluginvSphereUnregister`機能フラグを`true`に設定する必要があります。すべてのワーカーノードに`csi.vsphere.vmware.com`{{< glossary_tooltip text="CSI" term_id="csi" >}}ドライバーをインストールする必要があります。

#### Portworx CSIの移行
{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

Portworxの`CSIMigration`機能が追加されましたが、Kubernetes 1.23ではAlpha状態であるため、デフォルトで無効になっています。
すべてのプラグイン操作を既存のツリー内プラグインから`pxd.portworx.com`Container Storage Interface(CSI)ドライバーにリダイレクトします。
[Portworx CSIドライバー](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)をクラスターにインストールする必要があります。
この機能を有効にするには、kube-controller-managerとkubeletで`CSIMigrationPortworx=true`を設定します。

## subPathの使用 {#using-subpath}

1つのPodで複数の用途に使用するために1つのボリュームを共有すると便利な場合があります。
`volumeMounts[*].subPath`プロパティは、ルートではなく、参照されるボリューム内のサブパスを指定します。

次の例は、単一の共有ボリュームを使用してLAMPスタック(Linux Apache MySQL PHP)でPodを構成する方法を示しています。
このサンプルの`subPath`構成は、プロダクションでの使用にはお勧めしません。

PHPアプリケーションのコードとアセットはボリュームの`html`フォルダーにマップされ、MySQLデータベースはボリュームの`mysql`フォルダーに保存されます。例えば:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### 拡張された環境変数でのsubPathの使用{#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

`subPathExpr`フィールドを使用して、downwart API環境変数から`subPath`ディレクトリ名を作成します。
`subPath`プロパティと`subPathExpr`プロパティは相互に排他的です。

この例では、`Pod`が`subPathExpr`を使用して、`hostPath`ボリューム`/var/log/pods`内に`pod1`というディレクトリを作成します。
`hostPath`ボリュームは`downwardAPI`から`Pod`名を受け取ります。
ホストディレクトリ`/var/log/pods/pod1`は、コンテナ内の`/logs`にマウントされます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # The variable expansion uses round brackets (not curly brackets).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## リソース

`emptyDir`ボリュームの記憶媒体(DiskやSSDなど)は、kubeletのルートディレクトリ(通常は`/var/lib/kubelet`)を保持するファイルシステムの媒体によって決定されます。
`emptyDir`または`hostPath`ボリュームが消費する容量に制限はなく、コンテナ間またはPod間で隔離されることもありません。

リソース仕様を使用したスペースの要求については、[リソースの管理方法](/ja/docs/concepts/configuration/manage-resources-containers/)を参照してください。

## ツリー外のボリュームプラグイン

ツリー外ボリュームプラグインには{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}(CSI)、およびFlexVolume(非推奨)があります。
これらのプラグインによりストレージベンダーは、プラグインのソースコードをKubernetesリポジトリに追加することなく、カスタムストレージプラグインを作成することができます。

以前は、すべてのボリュームプラグインが「ツリー内」にありました。
「ツリー内」のプラグインは、Kubernetesのコアバイナリとともにビルド、リンク、コンパイルされ、出荷されていました。
つまり、Kubernetesに新しいストレージシステム(ボリュームプラグイン)を追加するには、Kubernetesのコアコードリポジトリにコードをチェックインする必要があったのです。

CSIとFlexVolumeはどちらも、ボリュームプラグインをKubernetesコードベースとは独立して開発し、拡張機能としてKubernetesクラスターにデプロイ(インストール)することを可能にします。

ツリー外のボリュームプラグインの作成を検討しているストレージベンダーについては、[ボリュームプラグインのFAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)を参照してください。

### csi

[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)(CSI)は、コンテナオーケストレーションシステム(Kubernetesなど)の標準インターフェースを定義して、任意のストレージシステムをコンテナワークロードに公開します。

詳細については[CSI design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)を参照してください。

{{< note >}}
CSI仕様バージョン0.2および0.3のサポートは、Kubernetes v1.13で非推奨になり、将来のリリースで削除される予定です。
{{< /note >}}

{{< note >}}
CSIドライバーは、すべてのKubernetesリリース間で互換性があるとは限りません。各Kubernetesリリースでサポートされているデプロイ手順と互換性マトリックスについては、特定のCSIドライバーのドキュメントを確認してください。
{{< /note >}}

CSI互換のボリュームドライバーがKubernetesクラスター上に展開されると、ユーザーは`csi`ボリュームタイプを使用して、CSIドライバーによって公開されたボリュームをアタッチまたはマウントすることができます。

`csi`ボリュームはPodで3つの異なる方法によって使用することができます。

* [PersistentVolumeClaim](#persistentvolumeclaim)の参照を通して
* [一般的なエフェメラルボリューム](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)(alpha機能)で
* ドライバーがそれをサポートしている場合は、[CSIエフェメラルボリューム](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)(beta機能)を使って

ストレージ管理者は、CSI永続ボリュームを構成するために次のフィールドを使用できます。

* `driver`: 使用するボリュームドライバーの名前を指定する文字列。
  この値は[CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)で定義されたCSIドライバーが`GetPluginInfoResponse`で返す値に対応していなければなりません。
  これはKubernetesが呼び出すCSIドライバーを識別するために使用され、CSIドライバーコンポーネントがCSIドライバーに属するPVオブジェクトを識別するために使用されます。
* `volumeHandle`: ボリュームを一意に識別する文字列。この値は、[CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)で定義されたCSIドライバーが`CreateVolumeResponse`の`volume.id`フィールドに返す値に対応していなければなりません。この値はCSIボリュームドライバーのすべての呼び出しで、ボリュームを参照する際に`volume_id`として渡されます。
* `readOnly`: ボリュームを読み取り専用として「ControllerPublished」(添付)するかどうかを示すオプションのブール値。デフォルトはfalseです。この値は、`ControllerPublishVolumeRequest`の`readonly`フィールドを介してCSIドライバーに渡されます。
* `fsType`: PVの`VolumeMode`が`Filesystem`の場合、このフィールドを使用して、ボリュームのマウントに使用する必要のあるファイルシステムを指定できます。ボリュームがフォーマットされておらず、フォーマットがサポートされている場合、この値はボリュームのフォーマットに使用されます。この値は、`ControllerPublishVolumeRequest`、`NodeStageVolumeRequest`、および`NodePublishVolumeRequest`の`VolumeCapability`フィールドを介してCSIドライバーに渡されます。
* `volumeAttributes`: ボリュームの静的プロパティを指定する、文字列から文字列へのマップ。このマップは、[CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)で定義されているように、CSIドライバーが`CreateVolumeResponse`の`volume.attributes`フィールドで返すマップと一致しなければなりません。このマップは`ControllerPublishVolumeRequest`,`NodeStageVolumeRequest`,`NodePublishVolumeRequest`の`volume_context`フィールドを介してCSIドライバーに渡されます。
* `controllerPublishSecretRef`: CSI`ControllerPublishVolume`および`ControllerUnpublishVolume`呼び出しを完了するためにCSIドライバーに渡す機密情報を含むsecretオブジェクトへの参照。このフィールドはオプションで、secretが必要ない場合は空にすることができます。secretに複数のsecretが含まれている場合は、すべてのsecretが渡されます。
* `nodeStageSecretRef`: CSI`NodeStageVolume`呼び出しを完了するために、CSIドライバーに渡す機密情報を含むsecretオブジェクトへの参照。このフィールドはオプションで、secretが必要ない場合は空にすることができます。secretに複数のsecretが含まれている場合、すべてのsecretが渡されます。
* `nodePublishSecretRef`: CSI`NodePublishVolume`呼び出しを完了するために、CSIドライバーに渡す機密情報を含むsecretオブジェクトへの参照。このフィールドはオプションで、secretが必要ない場合は空にすることができます。secretオブジェクトが複数のsecretを含んでいる場合、すべてのsecretが渡されます。

#### CSI rawブロックボリュームのサポート

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

外部のCSIドライバーを使用するベンダーは、Kubernetesワークロードでrawブロックボリュームサポートを実装できます。

CSI固有の変更を行うことなく、通常どおり、[rawブロックボリュームをサポートするPersistentVolume/PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)を設定できます。

#### CSIエフェメラルボリューム

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Pod仕様内でCSIボリュームを直接構成できます。この方法で指定されたボリュームは一時的なものであり、Podを再起動しても持続しません。詳細については[エフェメラルボリューム](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)を参照してください。

CSIドライバーの開発方法の詳細については[kubernetes-csiドキュメント](https://kubernetes-csi.github.io/docs/)を参照してください。

#### ツリー内プラグインからCSIドライバーへの移行

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

`CSIMigration`機能を有効にすると、既存のツリー内プラグインに対する操作が、対応するCSIプラグイン(インストールおよび構成されていることが期待されます)に転送されます。
その結果、オペレーターは、ツリー内プラグインに取って代わるCSIドライバーに移行するときに、既存のストレージクラス、PersistentVolume、またはPersistentVolumeClaim(ツリー内プラグインを参照)の構成を変更する必要がありません。

サポートされている操作と機能には、プロビジョニング/削除、アタッチ/デタッチ、マウント/アンマウント、およびボリュームのサイズ変更が含まれます。

`CSIMigration`をサポートし、対応するCSIドライバーが実装されているツリー内プラグインは、[ボリュームのタイプ](＃volume-types)にリストされています。

### flexVolume

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolumeは、ストレージドライバーとのインターフェースにexecベースのモデルを使用するツリー外プラグインインターフェースです。FlexVolumeドライバーのバイナリは、各ノード、場合によってはコントロールプレーンノードにも、あらかじめ定義されたボリュームプラグインパスにインストールする必要があります。

Podは`flexVolume`ツリー内ボリュームプラグインを通してFlexVolumeドライバーと対話します。

詳細については[FlexVolumeのREADME](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme)を参照してください。

{{< note >}}
FlexVolumeは非推奨です。ツリー外のCSIドライバーを使用することは、外部ストレージをKubernetesと統合するための推奨される方法です。

FlexVolumeドライバーのメンテナーは、CSIドライバーを実装し、FlexVolumeドライバーのユーザーをCSIに移行するのを支援する必要があります。FlexVolumeのユーザーは、同等のCSIドライバーを使用するようにワークロードを移動する必要があります。
{{< /note >}}

## マウントの伝播

マウントの伝播により、コンテナによってマウントされたボリュームを、同じPod内の他のコンテナ、または同じノード上の他のPodに共有できます。

ボリュームのマウント伝播は、`containers[*].volumeMounts`の`mountPropagation`フィールドによって制御されます。その値は次のとおりです。

* `None` - このボリュームマウントは、ホストによってこのボリュームまたはそのサブディレクトリにマウントされる後続のマウントを受け取りません。同様に、コンテナによって作成されたマウントはホストに表示されません。これがデフォルトのモードです。

  このモードは[Linuxカーネルドキュメント](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)で説明されている`private`マウント伝播と同じです。

* `HostToContainer` - このボリュームマウントは、このボリュームまたはそのサブディレクトリのいずれかにマウントされる後続のすべてのマウントを受け取ります。

  つまりホストがボリュームマウント内に何かをマウントすると、コンテナはそこにマウントされていることを確認します。

  同様に同じボリュームに対して`Bidirectional`マウント伝搬を持つPodが何かをマウントすると、`HostToContainer`マウント伝搬を持つコンテナはそれを見ることができます。

  このモードは[Linuxカーネルドキュメント](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)で説明されている`rslave`マウント伝播と同じです。

* `Bidirectional` - このボリュームマウントは、`HostToContainer`マウントと同じように動作します。さらに、コンテナによって作成されたすべてのボリュームマウントは、ホストと、同じボリュームを使用するすべてのPodのすべてのコンテナに伝播されます。

  このモードの一般的な使用例は、FlexVolumeまたはCSIドライバーを備えたPod、または`hostPath`ボリュームを使用してホストに何かをマウントする必要があるPodです。

  このモードは[Linuxカーネルドキュメント](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)で説明されている`rshared`マウント伝播と同じです。

  {{< warning >}}
  `Bidirectional`マウント伝搬は危険です。ホストオペレーティングシステムにダメージを与える可能性があるため、特権的なコンテナでのみ許可されています。
  Linuxカーネルの動作に精通していることが強く推奨されます。
  また、Pod内のコンテナによって作成されたボリュームマウントは、終了時にコンテナによって破棄(アンマウント)される必要があります。
  {{< /warning >}}

### 構成

一部のデプロイメント(CoreOS、RedHat/Centos、Ubuntu)でマウント伝播が正しく機能する前に、以下に示すように、Dockerでマウント共有を正しく構成する必要があります。

Dockerの`systemd`サービスファイルを編集します。以下のように`MountFlags`を設定します。


```shell
MountFlags=shared
```

または、`MountFlags=slave`があれば削除してください。その後、Dockerデーモンを再起動します。


```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}

[永続ボリュームを使用してWordPressとMySQLをデプロイする例](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)に従ってください。

