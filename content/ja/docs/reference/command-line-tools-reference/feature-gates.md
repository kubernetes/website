---
title: フィーチャーゲート
weight: 10
content_template: templates/concept
---

{{% capture overview %}}
このページでは管理者がそれぞれのKubernetesコンポーネントで指定できるさまざまなフィーチャーゲートの概要について説明しています。
{{% /capture %}}

{{% capture body %}}

## 概要

フィーチャーゲートはアルファ機能または実験的機能を記述するkey=valueのペアのセットです。

管理者は各コンポーネントで`--feature-gates`コマンドラインフラグを使用することで機能をオンまたはオフにできます。各コンポーネントはそれぞれのコンポーネント固有のフィーチャーゲートの設定をサポートします。
すべてのコンポーネントのフィーチャーゲートの全リストを表示するには`-h`フラグを使用します。
kubeletなどのコンポーネントにフィーチャーゲートを設定するには以下のようにリストの機能ペアを`--feature-gates`フラグを使用して割り当てます。

```shell
--feature-gates="...,DynamicKubeletConfig=true"
```

次の表は各Kubernetesコンポーネントに設定できるフィーチャーゲートの概要です。

- 「導入開始バージョン」列は機能が導入されたとき、またはリリース段階が変更されたときのKubernetesリリースバージョンとなります。
- 「最終利用可能バージョン」列は空ではない場合はフィーチャーゲートを使用できる最後のKubernetesリリースバージョンとなります。

| 機能名 | デフォルト値 | ステージ | 導入開始バージョン | 最終利用可能バージョン |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | 1.10 |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | 1.7 |
| `AdvancedAuditing` | `true` | Beta | 1.8 | 1.11 |
| `AdvancedAuditing` | `true` | GA | 1.12 | - |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | - |
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `AttachVolumeLimit` | `true` | Alpha | 1.11 | 1.11 |
| `AttachVolumeLimit` | `true` | Beta | 1.12 | |
| `BlockVolume` | `false` | Alpha | 1.9 | |
| `BlockVolume` | `true` | Beta | 1.13 | - |
| `BoundServiceAccountTokenVolume` | `false` | Alpha | 1.13 | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | |
| `CRIContainerLogRotation` | `false` | Alpha | 1.10 | 1.10 |
| `CRIContainerLogRotation` | `true` | Beta| 1.11 | |
| `CSIBlockVolume` | `false` | Alpha | 1.11 | 1.13 |
| `CSIBlockVolume` | `true` | Beta | 1.14 | |
| `CSIDriverRegistry` | `false` | Alpha | 1.12 | 1.13 |
| `CSIDriverRegistry` | `true` | Beta | 1.14 | |
| `CSIInlineVolume` | `false` | Alpha | 1.15 | - |
| `CSIMigration` | `false` | Alpha | 1.14 | |
| `CSIMigrationAWS` | `false` | Alpha | 1.14 | |
| `CSIMigrationAzureDisk` | `false` | Alpha | 1.15 | |
| `CSIMigrationAzureFile` | `false` | Alpha | 1.15 | |
| `CSIMigrationGCE` | `false` | Alpha | 1.14 | |
| `CSIMigrationOpenStack` | `false` | Alpha | 1.14 | |
| `CSINodeInfo` | `false` | Alpha | 1.12 | 1.13 |
| `CSINodeInfo` | `true` | Beta | 1.14 | |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | 1.9 |
| `CSIPersistentVolume` | `true` | Beta | 1.10 | 1.12 |
| `CSIPersistentVolume` | `true` | GA | 1.13 | - |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | 1.9 |
| `CustomPodDNS` | `true` | Beta| 1.10 | 1.13 |
| `CustomPodDNS` | `true` | GA | 1.14 | - |
| `CustomResourcePublishOpenAPI` | `false` | Alpha| 1.14 | 1.14 |
| `CustomResourcePublishOpenAPI` | `true` | Beta| 1.15 | |
| `CustomResourceSubresources` | `false` | Alpha | 1.10 | 1.11 |
| `CustomResourceSubresources` | `true` | Beta | 1.11 | - |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | |
| `CustomResourceWebhookConversion` | `false` | Alpha | 1.13 | 1.14 |
| `CustomResourceWebhookConversion` | `true` | Beta | 1.15 | |
| `DebugContainers` | `false` | Alpha | 1.10 | |
| `DevicePlugins` | `false` | Alpha | 1.8 | 1.9 |
| `DevicePlugins` | `true` | Beta | 1.10 | |
| `DryRun` | `true` | Beta | 1.13 | |
| `DynamicAuditing` | `false` | Alpha | 1.13 | |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | 1.10 |
| `DynamicKubeletConfig` | `true` | Beta | 1.11 | |
| `DynamicProvisioningScheduling` | `false` | Alpha | 1.11 | 1.11 |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | |
| `ExpandCSIVolumes` | `false` | Alpha | 1.14 | |
| `ExpandInUsePersistentVolumes` | `false` | Alpha | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | Beta | 1.15 | |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | Beta | 1.11 | |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `GCERegionalPersistentDisk` | `true` | Beta | 1.10 | 1.12 |
| `GCERegionalPersistentDisk` | `true` | GA | 1.13 | - |
| `HugePages` | `false` | Alpha | 1.8 | 1.9 |
| `HugePages` | `true` | Beta| 1.10 | 1.13 |
| `HugePages` | `true` | GA | 1.14 | |
| `HyperVContainer` | `false` | Alpha | 1.10 | |
| `Initializers` | `false` | Alpha | 1.7 | 1.13 |
| `Initializers` | - | Deprecated | 1.14 | |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | 1.9 |
| `KubeletPluginsWatcher` | `false` | Alpha | 1.11 | 1.11 |
| `KubeletPluginsWatcher` | `true` | Beta | 1.12 | 1.12 |
| `KubeletPluginsWatcher` | `true` | GA | 1.13 | - |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | Beta| 1.10 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha| 1.15 | |
| `MountContainers` | `false` | Alpha | 1.9 | |
| `MountPropagation` | `false` | Alpha | 1.8 | 1.9 |
| `MountPropagation` | `true` | Beta | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | |
| `NodeLease` | `false` | Alpha | 1.12 | 1.13 |
| `NodeLease` | `true` | Beta | 1.14 | |
| `NonPreemptingPriority` | `false` | Alpha | 1.15 | |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | Beta | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | |
| `PodPriority` | `false` | Alpha | 1.8 | 1.10 |
| `PodPriority` | `true` | Beta | 1.11 | 1.13 |
| `PodPriority` | `true` | GA | 1.14 | |
| `PodReadinessGates` | `false` | Alpha | 1.11 | 1.11 |
| `PodReadinessGates` | `true` | Beta | 1.12 | 1.13 |
| `PodReadinessGates` | `true` | GA | 1.14 | - |
| `PodShareProcessNamespace` | `false` | Alpha | 1.10 | |
| `PodShareProcessNamespace` | `true` | Beta | 1.12 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `PVCProtection` | `false` | Alpha | 1.9 | 1.9 |
| `RemainingItemCount` | `false` | Alpha | 1.15 | |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | |
| `RequestManagement` | `false` | Alpha | 1.15 | |
| `ResourceQuotaScopeSelectors` | `false` | Alpha | 1.11 | 1.11 |
| `ResourceQuotaScopeSelectors` | `true` | Beta | 1.12 | |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.8 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `RunAsGroup` | `true` | Beta | 1.14 | |
| `RuntimeClass` | `true` | Beta | 1.14 | |
| `SCTPSupport` | `false` | Alpha | 1.12 | |
| `ServerSideApply` | `false` | Alpha | 1.14 | |
| `ServiceLoadBalancerFinalizer` | `false` | Alpha | 1.15 | |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | |
| `StorageObjectInUseProtection` | `true` | Beta | 1.10 | 1.10 |
| `StorageObjectInUseProtection` | `true` | GA | 1.11 | |
| `StorageVersionHash` | `false` | Alpha | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | Beta | 1.15 | |
| `StreamingProxyRedirects` | `true` | Beta | 1.5 | |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | 1.8 |
| `SupportIPVSProxyMode` | `false` | Beta | 1.9 | 1.9 |
| `SupportIPVSProxyMode` | `true` | Beta | 1.10 | 1.10 |
| `SupportIPVSProxyMode` | `true` | GA | 1.11 | |
| `SupportNodePidsLimit` | `false` | Alpha | 1.14 | 1.14 |
| `SupportNodePidsLimit` | `true` | Beta | 1.15 | |
| `SupportPodPidsLimit` | `false` | Alpha | 1.10 | 1.13 |
| `SupportPodPidsLimit` | `true` | Beta | 1.14 | |
| `Sysctls` | `true` | Beta | 1.11 | |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | 1.12 |
| `TaintBasedEvictions` | `true` | Beta | 1.13 | |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | 1.11 |
| `TaintNodesByCondition` | `true` | Beta | 1.12 | |
| `TokenRequest` | `false` | Alpha | 1.10 | 1.11 |
| `TokenRequest` | `true` | Beta | 1.12 | |
| `TokenRequestProjection` | `false` | Alpha | 1.11 | 1.11 |
| `TokenRequestProjection` | `true` | Beta | 1.12 | |
| `TTLAfterFinished` | `false` | Alpha | 1.12 | |
| `VolumePVCDataSource` | `false` | Alpha | 1.15 | |
| `VolumeScheduling` | `false` | Alpha | 1.9 | 1.9 |
| `VolumeScheduling` | `true` | Beta | 1.10 | 1.12 |
| `VolumeScheduling` | `true` | GA | 1.13 | |
| `VolumeSubpathEnvExpansion` | `false` | Alpha | 1.14 | 1.14 |
| `VolumeSubpathEnvExpansion` | `true` | Beta | 1.15 | |
| `VolumeSnapshotDataSource` | `false` | Alpha | 1.12 | - |
| `ScheduleDaemonSetPods` | `false` | Alpha | 1.11 | 1.11 |
| `ScheduleDaemonSetPods` | `true` | Beta | 1.12 | |
| `WatchBookmark` | `false` | Alpha | 1.15 | |
| `WindowsGMSA` | `false` | Alpha | 1.14 | |

## 機能を使用する

### 機能ステージ

機能には *Alpha* 、 *Beta* 、 *GA* の段階があります。
*Alpha* 機能とは：

* デフォルトでは無効になっています。
* バグがあるかもしれません。機能を有効にするとバグが発生する可能性があります。
* 機能のサポートは予告無しにいつでも削除される場合があります。
* APIは今後のソフトウェアリリースで予告なく互換性の無い変更が行われる場合があります。
* バグが発生するリスクが高く長期的なサポートはないため、短期間のテストクラスターでのみ使用することをお勧めします。

*Beta* 機能とは：

* デフォルトで有効になっています。
* この機能は十分にテストされていて、有効にすることは安全と考えられます。
* 詳細は変更される可能性がありますが、機能全体のサポートは削除されません。
* オブジェクトのスキーマやセマンティックは、その後のベータ版または安定版リリースで互換性の無い変更が行われる場合があります。互換性の無い変更が行われた場合には次のバージョンへの移行手順を提供します。これにはAPIオブジェクトの削除、編集、および再作成が必要になる場合があります。バージョンアップにはいくつかの対応が必要な場合があります。これには機能に依存するアプリケーションのダウンタイムが発生する場合があります。
* 今後のリリースで互換性の無い変更が行われる可能性があるため、ビジネスクリティカルでない使用のみが推奨されます。個別にアップグレードできる複数のクラスターがある場合はこの制限を緩和できる場合があります。

{{< note >}}
*ベータ版* の機能を試してフィードバックをお寄せください！
GAになってからさらなる変更を加えることは現実的ではない場合があります。
{{< /note >}}

*GA* 機能とは(*GA* 機能は *安定版* 機能とも呼ばれます):

* フィーチャーゲートの設定は不要になります。
* 機能の安定版は後続バージョンでリリースされたソフトウェアで使用されます。

### フィーチャーゲート

各フィーチャーゲートは特定の機能を有効/無効にするように設計されています。

- `Accelerators`: DockerでのNvidia GPUのサポートを有効にします。
- `AdvancedAuditing`: [高度な監査機能](/docs/tasks/debug-application-cluster/audit/#advanced-audit)を有効にします。
- `AffinityInAnnotations`(*非推奨*): [Podのアフィニティまたはアンチアフィニティ](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)を有効にします。
- `AllowExtTrafficLocalEndpoints`: サービスが外部へのリクエストをノードのローカルエンドポイントにルーティングできるようにします。
- `APIListChunking`: APIクライアントがAPIサーバーからチャンク単位で（`LIST`や`GET`の）リソースを取得できるようにします。
- `APIResponseCompression`:`LIST`や`GET`リクエストのAPIレスポンスを圧縮します。
- `AppArmor`: Dockerを使用する場合にLinuxノードでAppArmorによる強制アクセスコントロールを有効にします。詳細は[AppArmorチュートリアル](/docs/tutorials/clusters/apparmor/)で確認できます。
- `AttachVolumeLimit`: ボリュームプラグインを有効にすることでノードにアタッチできるボリューム数の制限を設定できます。
- `BlockVolume`: PodでRawブロックデバイスの定義と使用を有効にします。詳細は[Rawブロックボリュームのサポート](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)で確認できます。
- `BoundServiceAccountTokenVolume`: ServiceAccountTokenVolumeProjectionによって構成される計画ボリュームを使用するにはServiceAccountボリュームを移行します。詳細は[Service Account Token Volumes](https://git.k8s.io/community/contributors/design-proposals/storage/svcacct-token-volume-source.md)で確認できます。
- `CPUManager`: コンテナレベルのCPUアフィニティサポートを有効します。[CPUマネジメントポリシー](/docs/tasks/administer-cluster/cpu-management-policies/)を見てください。
- `CRIContainerLogRotation`: criコンテナランタイムのコンテナログローテーションを有効にします。
- `CSIBlockVolume`: 外部CSIボリュームドライバーを有効にしてブロックストレージをサポートします。詳細は[`csi`Rawブロックボリュームのサポート](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)で確認できます。
- `CSIDriverRegistry`: csi.storage.k8s.ioのCSIDriver APIオブジェクトに関連するすべてのロジックを有効にします。
- `CSIInlineVolume`: PodのCSIインラインボリュームサポートを有効にします。
- `CSIMigration`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のプラグインから対応した事前インストール済みのCSIプラグインにルーティングします。
- `CSIMigrationAWS`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAWS-EBSプラグインからEBS CSIプラグインにルーティングします。
- `CSIMigrationAzureDisk`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAzure-DiskプラグインからAzure Disk CSIプラグインにルーティングします。
- `CSIMigrationAzureFile`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAzure-FileプラグインからAzure File CSIプラグインにルーティングします。
- `CSIMigrationGCE`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のGCE-PDプラグインからPD CSIプラグインにルーティングします。
- `CSIMigrationOpenStack`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のCinderプラグインからCinder CSIプラグインにルーティングします。
- `CSINodeInfo`: csi.storage.k8s.ioのCSINodeInfo APIオブジェクトに関連するすべてのロジックを有効にします。
- `CSIPersistentVolume`: [CSI(Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)互換のボリュームプラグインを通してプロビジョニングされたボリュームの検出とマウントを有効にします。
  詳細については[`csi`ボリュームタイプ](/docs/concepts/storage/volumes/#csi)ドキュメントを確認してください。
- `CustomCPUCFSQuotaPeriod`: ノードがCPUCFSQuotaPeriodを変更できるようにします。
- `CustomPodDNS`: `dnsConfig`プロパティを使用したPodのDNS設定のカスタマイズを有効にします。詳細は[PodのDNS構成](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)で確認できます。
- `CustomResourcePublishOpenAPI`: CRDのOpenAPI仕様での公開を有効にします。
- `CustomResourceSubresources`: [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/)から作成されたリソースの`/status`および`/scale`サブリソースを有効にします。
- `CustomResourceValidation`: [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/)から作成されたリソースのスキーマによる検証を有効にする。
- `CustomResourceWebhookConversion`: [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/)から作成されたリソースのWebhookベースの変換を有効にします。
- `DebugContainers`: Podのネームスペースで「デバッグ」コンテナを実行できるようにして実行中のPodのトラブルシューティングを行います。
- `DevicePlugins`: [device-plugins](/docs/concepts/cluster-administration/device-plugins/)によるノードでのリソースプロビジョニングを有効にします。
- `DryRun`: サーバーサイドでの[dry run](/docs/reference/using-api/api-concepts/#dry-run)リクエストを有効にします。
- `DynamicAuditing`: [動的監査](/docs/tasks/debug-application-cluster/audit/#dynamic-backend)を有効にします。
- `DynamicKubeletConfig`: kubeletの動的構成を有効にします。[kubeletの再設定](/docs/tasks/administer-cluster/reconfigure-kubelet/)を参照してください。
- `DynamicProvisioningScheduling`: デフォルトのスケジューラーを拡張してボリュームトポロジーを認識しPVプロビジョニングを処理します。この機能は、v1.12の`VolumeScheduling`機能に完全に置き換えられました。
- `DynamicVolumeProvisioning`(*非推奨*): Podへの永続ボリュームの[動的プロビジョニング](/docs/concepts/storage/dynamic-provisioning/)を有効にします。
- `EnableEquivalenceClassCache`: Podをスケジュールするときにスケジューラーがノードの同等をキャッシュできるようにします。
- `ExpandInUsePersistentVolumes`: 使用中のPVCのボリューム拡張を有効にします。[使用中のPersistentVolumeClaimのサイズ変更](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim)を参照してください。
- `ExpandPersistentVolumes`: 永続ボリュームの拡張を有効にします。[永続ボリューム要求の拡張](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)を参照してください。
- `ExperimentalCriticalPodAnnotation`: [スケジューリングが保証されるよう](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)に特定のpodへの *クリティカル* の注釈を加える設定を有効にします。
- `ExperimentalHostUserNamespaceDefaultingGate`: ホストするデフォルトのユーザー名前空間を有効にします。これは他のホストの名前空間やホストのマウントを使用しているコンテナ、特権を持つコンテナ、または名前空間のない特定の機能（たとえば`MKNODE`、`SYS_MODULE`など）を使用しているコンテナ用です。これはDockerデーモンでユーザー名前空間の再マッピングが有効になっている場合にのみ有効にすべきです。
- `GCERegionalPersistentDisk`: GCEでリージョナルPD機能を有効にします。
- `HugePages`: 事前に割り当てられた[huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/)の割り当てと消費を有効にします。
- `HyperVContainer`: Windowsコンテナの[Hyper-Vによる分離](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)を有効にします。
- `KubeletConfigFile`: 設定ファイルを使用して指定されたファイルからのkubelet設定の読み込みを有効にします。詳細は[設定ファイルによるkubeletパラメーターの設定](/docs/tasks/administer-cluster/kubelet-config-file/)で確認できます。
- `KubeletPluginsWatcher`: 調査ベースのプラグイン監視ユーティリティを有効にしてkubeletが[CSIボリュームドライバー](/docs/concepts/storage/volumes/#csi)などのプラグインを検出できるようにします。
- `KubeletPodResources`: kubeletのpodのリソースgrpcエンドポイントを有効にします。詳細は[デバイスモニタリングのサポート](https://git.k8s.io/community/keps/sig-node/compute-device-assignment.md)で確認できます。
- `LocalStorageCapacityIsolation`: [ローカルの一時ストレージ](/docs/concepts/configuration/manage-compute-resources-container/)の消費を有効にして、[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)の`sizeLimit`プロパティも有効にします。
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: `LocalStorageCapacityIsolation`が[ローカルの一時ストレージ](/docs/concepts/configuration/manage-compute-resources-container/)で有効になっていて、[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)のbacking filesystemがプロジェクトクォータをサポートし有効になっている場合、プロジェクトクォータを使用して、パフォーマンスと精度を向上させるために、ファイルシステムへのアクセスではなく[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)ストレージ消費を監視します。
- `MountContainers`: ホスト上のユーティリティコンテナをボリュームマウンターとして使用できるようにします。
- `MountPropagation`: あるコンテナによってマウントされたボリュームを他のコンテナまたはpodに共有できるようにします。詳細は[マウントの伝播](/docs/concepts/storage/volumes/#mount-propagation)で確認できます。
- `NodeLease`: 新しいLease APIを有効にしてノードヘルスシグナルとして使用できるノードのハートビートをレポートします。
- `NonPreemptingPriority`: PriorityClassとPodのNonPreemptingオプションを有効にします。
- `PersistentLocalVolumes`: Podで`local`ボリュームタイプの使用を有効にします。`local`ボリュームを要求する場合、podアフィニティを指定する必要があります。
- `PodPriority`: [優先度](/docs/concepts/configuration/pod-priority-preemption/)に基づいてPodの再スケジューリングとプリエンプションを有効にします。
- `PodReadinessGates`: Podのreadinessの評価を拡張するために`PodReadinessGate`フィールドの設定を有効にします。詳細は[Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)で確認できます。
- `ProcMountType`: コンテナのProcMountTypeの制御を有効にします。
- `PVCProtection`: 永続ボリューム要求（PVC）がPodでまだ使用されているときに削除されないようにします。詳細は[ここ](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `ResourceLimitsPriorityFunction`: 入力したPodのCPU制限とメモリ制限の少なくとも1つを満たすノードに対して最低スコアを1に割り当てるスケジューラー優先機能を有効にします。その目的は同じスコアを持つノード間の関係を断つことです。
- `RequestManagement`: 各サーバーで優先順位付けと公平性を備えたリクエストの並行性の管理機能を有効にしました。
- `ResourceQuotaScopeSelectors`: リソース割当のスコープセレクターを有効にします。
- `RotateKubeletClientCertificate`: kubeletでクライアントTLS証明書のローテーションを有効にします。詳細は[kubeletの設定](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `RotateKubeletServerCertificate`: kubeletでサーバーTLS証明書のローテーションを有効にします。詳細は[kubeletの設定](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `RunAsGroup`: コンテナの初期化プロセスで設定されたプライマリグループIDの制御を有効にします。
- `RuntimeClass`: コンテナのランタイム構成を選択するには[RuntimeClass](/docs/concepts/containers/runtime-class/)機能を有効にします。
- `ScheduleDaemonSetPods`: DaemonSetのPodをDaemonSetコントローラーではなく、デフォルトのスケジューラーによってスケジュールされるようにします。
- `SCTPSupport`: `Service`、`Endpoint`、`NetworkPolicy`、`Pod`の定義で`protocol`の値としてSCTPを使用できるようにします
- `ServerSideApply`: APIサーバーで[サーバーサイドApply(SSA)](/docs/reference/using-api/api-concepts/#server-side-apply)のパスを有効にします。
- `ServiceLoadBalancerFinalizer`: サービスロードバランサーのファイナライザー保護を有効にします。
- `ServiceNodeExclusion`: クラウドプロバイダーによって作成されたロードバランサーからのノードの除外を有効にします。"`alpha.service-controller.kubernetes.io/exclude-balancer`"キーでラベル付けされている場合ノードは除外の対象となります。
- `StorageObjectInUseProtection`: PersistentVolumeまたはPersistentVolumeClaimオブジェクトがまだ使用されている場合、それらの削除を延期します。
- `StorageVersionHash`: apiserversがディスカバリーでストレージのバージョンハッシュを公開できるようにします。
- `StreamingProxyRedirects`: ストリーミングリクエストのバックエンド(kubelet)からのリダイレクトをインターセプト（およびフォロー）するようAPIサーバーに指示します。ストリーミングリクエストの例には`exec`、`attach`、`port-forward`リクエストが含まれます。
- `SupportIPVSProxyMode`: IPVSを使用したクラスター内サービスの負荷分散の提供を有効にします。詳細は[サービスプロキシ](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)で確認できます。
- `SupportPodPidsLimit`: PodのPID制限のサポートを有効にします。
- `Sysctls`: 各podに設定できる名前空間付きのカーネルパラメーター(sysctl)のサポートを有効にします。詳細は[sysctls](/docs/tasks/administer-cluster/sysctl-cluster/)で確認できます。
- `TaintBasedEvictions`: ノードの汚染とpodの許容に基づいてノードからpodを排除できるようにします。。詳細は[汚染と許容](/docs/concepts/configuration/taint-and-toleration/)で確認できます。
- `TaintNodesByCondition`: [ノードの条件](/docs/concepts/architecture/nodes/#condition)に基づいてノードの自動汚染を有効にします。
- `TokenRequest`: サービスアカウントリソースで`TokenRequest`エンドポイントを有効にします。
- `TokenRequestProjection`: [投影ボリューム](/docs/concepts/storage/volumes/#projected)を使用したpodへのサービスアカウントのトークンの注入を有効にします。
- `TTLAfterFinished`: [TTLコントローラー](/docs/concepts/workloads/controllers/ttlafterfinished/)が実行終了後にリソースをクリーンアップできるようにします。
- `VolumePVCDataSource`: 既存のPVCをデータソースとして指定するサポートを有効にします。
- `VolumeScheduling`: ボリュームトポロジー対応のスケジューリングを有効にし、PersistentVolumeClaim（PVC）バインディングにスケジューリングの決定を認識させます。また`PersistentLocalVolumes`フィーチャーゲートと一緒に使用すると[`local`](/docs/concepts/storage/volumes/#local)ボリュームタイプの使用が可能になります。
- `VolumeSnapshotDataSource`: ボリュームスナップショットのデータソースサポートを有効にします。
- `VolumeSubpathEnvExpansion`: 環境変数を`subPath`に展開するための`subPathExpr`フィールドを有効にします。
- `WatchBookmark`: ブックマークイベントの監視サポートを有効にします。
- `WindowsGMSA`: GMSA資格仕様をpodからコンテナランタイムに渡せるようにします。

{{% /capture %}}
