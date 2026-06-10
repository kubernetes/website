---
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: システムデーモン用のコンピュートリソースの予約
content_type: task
weight: 290
---

<!-- overview -->

KubernetesのノードはCapacityまでスケジュールできます。デフォルトでは、PodはノードのCapacityをすべて使用できます。ノードは通常、OSやKubernetes自体を動かすための多くのシステムデーモンを実行しているため、これは問題となります。これらのシステムデーモンのためにリソースが確保されていない場合、Podとシステムデーモンがリソースをめぐって競合し、ノード上でリソース枯渇の問題が引き起こされます。

`kubelet`は、システムデーモン用のコンピュートリソースを予約するために役立つ「Node Allocatable」という機能を公開しています。Kubernetesは、クラスター管理者が各ノードのワークロード密度に基づいて「Node Allocatable」を設定することを推奨しています。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

以下のkubeletの[設定項目](/docs/reference/config-api/kubelet-config.v1beta1/)は、[kubelet設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file/)を使用して設定できます。

<!-- steps -->

## Node Allocatable

![node capacity](/images/docs/node-capacity.svg)

KubernetesノードにおけるAllocatableとは、Podが利用できるコンピュートリソースの量として定義されます。スケジューラーはAllocatableを超えてリソースを割り当てません。現時点では、`CPU`、`memory`、`ephemeral-storage`がサポートされています。

Node AllocatableはAPIの`v1.Node`オブジェクトの一部として公開されており、CLIの`kubectl describe node`でも確認できます。

`kubelet`では、2つのカテゴリのシステムデーモンのためにリソースを予約できます。

### QoSとPodレベルのcgroupの有効化

ノード上でNode Allocatableの制約を適切に強制するには、`cgroupsPerQOS`設定を使用して新しいcgroup階層を有効にする必要があります。この設定はデフォルトで有効になっています。有効にすると、`kubelet`はすべてのエンドユーザーPodを`kubelet`が管理するcgroup階層の下に配置します。

### cgroupドライバーの設定

`kubelet`は、cgroupドライバーを使用してホスト上のcgroup階層を操作することをサポートしています。ドライバーは`cgroupDriver`設定を通じて設定されます。

サポートされている値は以下の通りです:

* `cgroupfs`はデフォルトのドライバーで、cgroupサンドボックスを管理するためにホスト上のcgroupファイルシステムを直接操作します。
* `systemd`は代替ドライバーで、そのinitシステムがサポートするリソースのためにトランジェントスライスを使用してcgroupサンドボックスを管理します。

関連するコンテナランタイムの設定に応じて、オペレーターは適切なシステム動作を確保するために特定のcgroupドライバーを選択する必要がある場合があります。たとえば、オペレーターが`containerd`ランタイムが提供する`systemd` cgroupドライバーを使用する場合、`kubelet`は`systemd` cgroupドライバーを使用するように設定する必要があります。

### Kube Reserved

- **KubeletConfiguration設定**: `kubeReserved: {}`。設定例:`{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration設定**: `kubeReservedCgroup: ""`

`kubeReserved`は、`kubelet`、`container runtime`などのKubernetesシステムデーモン向けのリソース予約に使用されます。
Podとして実行されるシステムデーモンのリソースを予約するためのものではありません。
`kubeReserved`は通常、ノード上の`pod density`の関数です。

`cpu`、`memory`、`ephemeral-storage`に加えて、Kubernetesシステムデーモン用に指定された数のプロセスIDを予約するために`pid`を指定できます。

オプションでKubernetesシステムデーモンに`kubeReserved`を強制するには、kubeデーモンの親コントロールグループを`kubeReservedCgroup`設定の値として指定し、[`enforceNodeAllocatable`に`kube-reserved`を追加してください](#enforcing-node-allocatable)。

Kubernetesシステムデーモンは、トップレベルのコントロールグループ（例: systemdマシンの`runtime.slice`）に配置することが推奨されます。各システムデーモンは、理想的には独自の子コントロールグループ内で実行されるべきです。推奨されるコントロールグループ階層の詳細については、[設計提案](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)を参照してください。

Kubeletは、`kubeReservedCgroup`が存在しない場合、これを作成**しません**。無効なcgroupが指定された場合、kubeletは起動に失敗します。`systemd` cgroupドライバーを使用する場合、定義するcgroupの名前には特定のパターンに従う必要があります。名前は`kubeReservedCgroup`に設定した値に`.slice`を付加したものである必要があります。

### System Reserved

- **KubeletConfiguration設定**: `systemReserved: {}`。設定例:`{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration設定**: `systemReservedCgroup: ""`

`systemReserved`は、`sshd`、`udev`などのOSシステムデーモン向けのリソース予約に使用されます。現時点でKubernetesでは`kernel`メモリがPodに対して計上されないため、`systemReserved`は`kernel`の`memory`も予約する必要があります。
ユーザーログインセッションのリソース予約も推奨されます（systemdでは`user.slice`）。

`cpu`、`memory`、`ephemeral-storage`に加えて、OSシステムデーモン用に指定された数のプロセスIDを予約するために`pid`を指定できます。

オプションでシステムデーモンに`systemReserved`を強制するには、OSシステムデーモンの親コントロールグループを`systemReservedCgroup`設定の値として指定し、[`enforceNodeAllocatable`に`system-reserved`を追加してください](#enforcing-node-allocatable)。

OSシステムデーモンは、トップレベルのコントロールグループ（例: systemdマシンの`system.slice`）に配置することが推奨されます。

`kubelet`は、`systemReservedCgroup`が存在しない場合、これを作成**しません**。無効なcgroupが指定された場合、`kubelet`は失敗します。`systemd` cgroupドライバーを使用する場合、定義するcgroupの名前には特定のパターンに従う必要があります。名前は`systemReservedCgroup`に設定した値に`.slice`を付加したものである必要があります。

### 明示的に予約されたCPUリスト

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

**KubeletConfiguration設定**: `reservedSystemCPUs:`。設定例:`0-3`

`reservedSystemCPUs`は、OSシステムデーモンおよびKubernetesシステムデーモン用の明示的なCPUセットを定義するためのものです。`reservedSystemCPUs`は、cpusetリソースに関してOSシステムデーモンとKubernetesシステムデーモンに対して別々のトップレベルcgroupを定義しないシステム向けです。
KubeletがKubeletの`kubeReservedCgroup`と`systemReservedCgroup`を持っていない場合、`reservedSystemCPUs`が提供する明示的なcpusetは`kubeReservedCgroup`と`systemReservedCgroup`オプションで定義されたCPUより優先されます。

このオプションは、制御されていない割り込み/タイマーがワークロードのパフォーマンスに影響を与える可能性がある通信/NFVのユースケースのために特別に設計されています。このオプションを使用して、システム/Kubernetesデーモンや割り込み/タイマー向けの明示的なcpusetを定義し、システム上の残りのCPUをワークロード専用に使用できるようにし、制御されていない割り込み/タイマーからの影響を減らすことができます。このオプションで定義された明示的なcpusetにシステムデーモン、Kubernetesデーモン、割り込み/タイマーを移行するには、Kubernetes外の他のメカニズムを使用する必要があります。
例: Centosでは、tunedツールセットを使用してこれを行うことができます。

### エビクションのしきい値

**KubeletConfiguration設定**: `evictionHard: {memory.available: "100Mi", nodefs.available: "10%", nodefs.inodesFree: "5%", imagefs.available: "15%"}`。設定例:`{memory.available: "<500Mi"}`

ノードレベルのメモリ圧迫はSystem OOMを引き起こし、ノード全体とその上で実行されているすべてのPodに影響します。メモリが回収されるまで、ノードは一時的にオフラインになる可能性があります。System OOMを回避（または発生確率を低減）するために、kubeletは[リソース不足](/docs/concepts/scheduling-eviction/node-pressure-eviction/)管理を提供しています。エビクションは`memory`と`ephemeral-storage`のみサポートされています。`evictionHard`設定を通じていくらかのメモリを予約することで、ノード上のメモリ利用可能量が予約値を下回るたびに、`kubelet`はPodのエビクションを試みます。仮に、システムデーモンがノードに存在しない場合、Podは`capacity - eviction-hard`を超えて使用することはできません。このため、エビクションのために予約されたリソースはPodには使用できません。

### Node Allocatableの強制 {#enforcing-node-allocatable}

**KubeletConfiguration設定**: `enforceNodeAllocatable: [pods]`。設定例:`[pods,system-reserved,kube-reserved]`

スケジューラーはAllocatableをPodが利用可能な`capacity`として扱います。

`kubelet`はデフォルトでPod全体にAllocatableを強制します。すべてのPod全体の使用量がAllocatableを超えるたびにPodをエビクションすることで強制が行われます。エビクションポリシーの詳細については、[ノードの圧迫によるエビクション](/docs/concepts/scheduling-eviction/node-pressure-eviction/)のページを参照してください。この強制は、KubeletConfiguration設定の`enforceNodeAllocatable`に`pods`値を指定することで制御されます。

オプションとして、同じ設定に`kube-reserved`と`system-reserved`の値を指定することで、`kubelet`が`kubeReserved`と`systemReserved`を強制するようにすることができます。さらに、`kube-reserved-compressible`と`system-reserved-compressible`を指定することで、圧縮可能なリソースのみを強制することもできます。`kubeReserved`または`systemReserved`を強制するには、それぞれ`kubeReservedCgroup`または`systemReservedCgroup`を指定する必要があることに注意してください。

## 一般的なガイドライン

システムデーモンは[QoSクラスがGuaranteedに割り当てられたPod](/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed)と同様に扱われることが期待されています。システムデーモンは、その境界コントロールグループ内でバーストでき、この動作はKubernetesデプロイメントの一部として管理する必要があります。例えば、`kubelet`は独自のコントロールグループを持ち、コンテナランタイムと`kubeReserved`リソースを共有する必要があります。ただし、`kubeReserved`が強制されている場合、Kubeletはバーストしてすべての利用可能なNodeリソースを使い尽くすことはできません。

`systemReserved`の予約を強制する際は特に注意が必要です。これにより、重要なシステムサービスがCPUリソース不足に陥り、OOMキルされたり、ノード上でforkできなくなる可能性があります。推奨事項は、ユーザーがノードを徹底的にプロファイリングして精確な見積もりを出し、そのグループ内のプロセスがoom-killされた場合に回復できる自信がある場合にのみ`systemReserved`を強制することです。

`kubeReserved`と`systemReserved`に対して圧縮可能なリソースのみを強制することは、コンテンションが発生した際にリソースが適切に割り当てられることを確保しながら、障害を引き起こす可能性が低くなります。

* まず`pods`にAllocatableを強制します。
* kubeとシステムデーモンを追跡するための適切なモニタリングとアラートが整ったら、`kubeReserved`と`systemReserved`に対して圧縮可能なリソースの強制を試みます。
* 使用状況のヒューリスティクスに基づいて、非圧縮`kubeReserved`リソースの強制を試みます。
* 絶対に必要な場合は、時間をかけて非圧縮`systemReserved`リソースを強制します。

kubeシステムデーモンのリソース要件は、機能が追加されるにつれて時間とともに増加する可能性があります。Kubernetesプロジェクトは、時間をかけてノードシステムデーモンの使用量を削減しようと試みますが、現時点ではそれが優先事項ではありません。そのため、将来のリリースでは`Allocatable`キャパシティの低下が予想されます。

<!-- discussion -->

## シナリオ例

以下は、Node Allocatableの計算を説明する例です:

* ノードは`32Gi`の`memory`、`16 CPUs`、`100Gi`の`Storage`を持っています
* `kubeReserved`は`{cpu: 1000m, memory: 2Gi, ephemeral-storage: 1Gi}`に設定されています
* `systemReserved`は`{cpu: 500m, memory: 1Gi, ephemeral-storage: 1Gi}`に設定されています
* `evictionHard`は`{memory.available: "<500Mi", nodefs.available: "<10%"}`に設定されています

このシナリオでは、AllocatableはCPU 14.5個、メモリ28.5Gi、ローカルストレージ`88Gi`となります。
スケジューラーは、このノード上のすべてのPodの合計メモリ`requests`が28.5Giを超えず、ストレージが88Giを超えないことを保証します。
Kubeletは、Pod全体の合計メモリ使用量が28.5Giを超えるか、ディスク使用量が88Giを超えるたびにPodをエビクションします。ノード上のすべてのプロセスが可能な限りCPUを使用した場合、Pod全体でCPU 14.5個を超えて消費することはできません。

`kubeReserved`および/または`systemReserved`が強制されておらず、システムデーモンが予約量を超えた場合、`kubelet`はノード全体のメモリ使用量が31.5Giを超えるか、`storage`が90Giを超えるたびにPodをエビクションします。
