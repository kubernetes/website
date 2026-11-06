---
title: kube-scheduler
content_type: tool-reference
weight: 30
---
<!-- 
title: kube-scheduler
content_type: tool-reference
weight: 30
auto_generated: true
-->

## 概要 {#synopsis}


Kubernetesスケジューラーは、Podをノードに割り当てるコントロールプレーンのプロセスです。
スケジューラーは、制約条件と利用可能なリソースに基づいて、スケジューリングキュー内の各Podに対して適切なノードを決定します。
その後、スケジューラーは有効な各ノードを優先順位付けし、適切なノードにPodを割り当てます。
クラスター内では複数の異なるスケジューラーを使用することが可能であり、kube-schedulerが標準実装として提供されています。
スケジューリングの詳細およびkube-schedulerコンポーネントについては、[スケジューリング](/ja/docs/concepts/scheduling-eviction/)のセクションをご覧ください。

```
kube-scheduler [flags]
```

## オプション {#options}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: []</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>メトリックラベルに対し、許可される値のリストを指定するマップです。キーは &lt;MetricName&gt;,&lt;LabelName&gt; の形式で、値は &lt;allowed_value&gt;,&lt;allowed_value&gt;... の形式となります。例えば、metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'のように指定します。</p></td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels-manifest string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>許可リストのマッピング情報を含むマニフェストファイルのパスです。ファイルの形式は--allow-metric-labelsフラグと同じであり、--allow-metric-labelsフラグが指定されている場合はファイルの設定が上書きされる点に注意してください。</p></td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>tokenreviews.authentication.k8s.ioを作成するための十分な権限を持つコアKubernetesサーバーを指すkubeconfigファイルです。省略可能であり、空の場合はすべてのトークン要求が匿名として扱われ、クラスター内でクライアント証明書の検索は行われません。</p></td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>falseに設定した場合、authentication-kubeconfigを使用してクラスターから不足している認証設定を参照します。</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>webhook token authenticatorからのレスポンスをキャッシュする期間を指定します。</p></td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueの場合、クラスターから認証設定を参照できなくても致命的な失敗とはみなされません。ただし、すべてのリクエストを匿名として扱う認証モードになる可能性があります。</p></td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>認可処理をスキップするHTTPパスのリストです。これらのパスはコアKubernetesサーバーに問い合わせることなく許可されます。</p></td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>subjectaccessreviews.authorization.k8s.io を作成するための十分な権限を持つコアKubernetesサーバーを指すkubeconfigファイルです。この設定はオプショナルです。省略した場合、認可でスキップされないすべてのリクエストは拒否されます。</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>webhook authorizerからの許可レスポンスをキャッシュする期間です。</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>webhook authorizerからの拒否レスポンスをキャッシュする期間です。</p></td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--secure-portでリッスンする際に使用するIPアドレスです。関連するインターフェースはクラスター内および CLI/Webクライアントから到達可能である必要があります。空または未指定アドレス(0.0.0.0 や ::)の場合は、すべてのインターフェースとIPアドレスファミリーを使用します。</p></td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>TLS証明書を配置するディレクトリです。--tls-cert-fileと--tls-private-key-fileが指定されている場合、このフラグは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>設定されている場合、client-ca-fileに含まれるいずれかの認証局が署名したクライアント証明書を提示したリクエストは、CommonNameに対応するIDで認証されます。</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>設定ファイルへのパスです。</p></td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: プロファイリングが有効な場合にブロックプロファイリングを有効にします。--configで設定ファイルが指定されている場合、このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--disable-http2-serving</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueの場合、HTTP2によるサービスが無効化されます。[デフォルト値=false]</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>このフラグは、異常な動作をするメトリクスに対する回避策として機能します。無効化するには完全修飾されたメトリクス名を指定する必要があります。注意: メトリクスの無効化は非表示メトリクスを表示する設定よりも優先されます。</p></td>
</tr>

<tr>
<td colspan="2">--emulated-version strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>各コンポーネントがエミュレートする機能(API、機能など)のバージョンを示します。<br/>この設定が有効になっている場合、コンポーネントは基盤となるバイナリのバージョンではなく、指定されたバージョンの動作をエミュレートします。<br/>バージョン形式はmajor.minorの組み合わせのみ指定可能です(例: '--emulated-version=wardle=1.2,kube=1.31')。<br/>オプション: kube=1.31..1.34(デフォルト値: 1.34)<br/>コンポーネントが指定されていない場合、デフォルトで&quot;kube&quot;が使用されます。</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>アルファ版/実験的機能に関するコンポーネントごとの機能ゲート設定を、カンマ区切りの「コンポーネント:キー=値」形式で指定します。<br/>コンポーネントが指定されていない場合、デフォルトで&quot;kube&quot;が使用されます。このフラグは複数回指定可能です。使用例: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true' オプションは以下の通りです:<br/>kube:APIResponseCompression=true|false (BETA - デフォルト値=true)<br/>kube:APIServerIdentity=true|false (BETA - デフォルト値=true)<br/>kube:APIServingWithRoutine=true|false (ALPHA - デフォルト値=false)<br/>kube:AllAlpha=true|false (ALPHA - デフォルト値=false)<br/>kube:AllBeta=true|false (BETA - デフォルト値=false)<br/>kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - デフォルト値=true)<br/>kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - デフォルト値=false)<br/>kube:CBORServingAndStorage=true|false (ALPHA - デフォルト値=false)<br/>kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - デフォルト値=false)<br/>kube:CPUManagerPolicyBetaOptions=true|false (BETA - デフォルト値=true)<br/>kube:CSIVolumeHealth=true|false (ALPHA - デフォルト値=false)<br/>kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - デフォルト値=false)<br/>kube:ClientsAllowCBOR=true|false (ALPHA - デフォルト値=false)<br/>kube:ClientsPreferCBOR=true|false (ALPHA - デフォルト値=false)<br/>kube:CloudControllerManagerWebhook=true|false (ALPHA - デフォルト値=false)<br/>kube:ClusterTrustBundle=true|false (BETA - デフォルト値=false)<br/>kube:ClusterTrustBundleProjection=true|false (BETA - デフォルト値=false)<br/>kube:ComponentFlagz=true|false (ALPHA - デフォルト値=false)<br/>kube:ComponentStatusz=true|false (ALPHA - デフォルト値=false)<br/>kube:ConcurrentWatchObjectDecode=true|false (BETA - デフォルト値=false)<br/>kube:ContainerCheckpoint=true|false (BETA - デフォルト値=true)<br/>kube:ContainerRestartRules=true|false (ALPHA - デフォルト値=false)<br/>kube:ContainerStopSignals=true|false (ALPHA - デフォルト値=false)<br/>kube:ContextualLogging=true|false (BETA - デフォルト値=true)<br/>kube:CoordinatedLeaderElection=true|false (BETA - デフォルト値=false)<br/>kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - デフォルト値=false)<br/>kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - デフォルト値=false)<br/>kube:DRAAdminAccess=true|false (BETA - デフォルト値=true)<br/>kube:DRAConsumableCapacity=true|false (ALPHA - デフォルト値=false)<br/>kube:DRADeviceBindingConditions=true|false (ALPHA - デフォルト値=false)<br/>kube:DRADeviceTaints=true|false (ALPHA - デフォルト値=false)<br/>kube:DRAExtendedResource=true|false (ALPHA - デフォルト値=false)<br/>kube:DRAPartitionableDevices=true|false (ALPHA - デフォルト値=false)<br/>kube:DRAPrioritizedList=true|false (BETA - デフォルト値=true)<br/>kube:DRAResourceClaimDeviceStatus=true|false (BETA - デフォルト値=true)<br/>kube:DRASchedulerFilterTimeout=true|false (BETA - デフォルト値=true)<br/>kube:DeclarativeValidation=true|false (BETA - デフォルト値=true)<br/>kube:DeclarativeValidationTakeover=true|false (BETA - デフォルト値=false)<br/>kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - デフォルト値=false)<br/>kube:DetectCacheInconsistency=true|false (BETA - デフォルト値=true)<br/>kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - デフォルト値=true)<br/>kube:EnvFiles=true|false (ALPHA - デフォルト値=false)<br/>kube:EventedPLEG=true|false (ALPHA - デフォルト値=false)<br/>kube:ExternalServiceAccountTokenSigner=true|false (BETA - デフォルト値=true)<br/>kube:GracefulNodeShutdown=true|false (BETA - デフォルト値=true)<br/>kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - デフォルト値=true)<br/>kube:HPAConfigurableTolerance=true|false (ALPHA - デフォルト値=false)<br/>kube:HPAScaleToZero=true|false (ALPHA - デフォルト値=false)<br/>kube:HostnameOverride=true|false (ALPHA - デフォルト値=false)<br/>kube:ImageMaximumGCAge=true|false (BETA - デフォルト値=true)<br/>kube:ImageVolume=true|false (BETA - デフォルト値=false)<br/>kube:InOrderInformers=true|false (BETA - デフォルト値=true)<br/>kube:InPlacePodVerticalScaling=true|false (BETA - デフォルト値=true)<br/>kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - デフォルト値=false)<br/>kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - デフォルト値=false)<br/>kube:InTreePluginPortworxUnregister=true|false (ALPHA - デフォルト値=false)<br/>kube:InformerResourceVersion=true|false (ALPHA - デフォルト値=false)<br/>kube:JobManagedBy=true|false (BETA - デフォルト値=true)<br/>kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - デフォルト値=false)<br/>kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - デフォルト値=false)<br/>kube:KubeletFineGrainedAuthz=true|false (BETA - デフォルト値=true)<br/>kube:KubeletInUserNamespace=true|false (ALPHA - デフォルト値=false)<br/>kube:KubeletPSI=true|false (BETA - デフォルト値=true)<br/>kube:KubeletPodResourcesDynamicResources=true|false (BETA - デフォルト値=true)<br/>kube:KubeletPodResourcesGet=true|false (BETA - デフォルト値=true)<br/>kube:KubeletSeparateDiskGC=true|false (BETA - デフォルト値=true)<br/>kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - デフォルト値=true)<br/>kube:ListFromCacheSnapshot=true|false (BETA - デフォルト値=true)<br/>kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - デフォルト値=false)<br/>kube:LoggingAlphaOptions=true|false (ALPHA - デフォルト値=false)<br/>kube:LoggingBetaOptions=true|false (BETA - デフォルト値=true)<br/>kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - デフォルト値=true)<br/>kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - デフォルト値=true)<br/>kube:MaxUnavailableStatefulSet=true|false (ALPHA - デフォルト値=false)<br/>kube:MemoryQoS=true|false (ALPHA - デフォルト値=false)<br/>kube:MutableCSINodeAllocatableCount=true|false (BETA - デフォルト値=false)<br/>kube:MutatingAdmissionPolicy=true|false (BETA - デフォルト値=false)<br/>kube:NodeLogQuery=true|false (BETA - デフォルト値=false)<br/>kube:NominatedNodeNameForExpectation=true|false (ALPHA - デフォルト値=false)<br/>kube:OpenAPIEnums=true|false (BETA - デフォルト値=true)<br/>kube:PodAndContainerStatsFromCRI=true|false (ALPHA - デフォルト値=false)<br/>kube:PodCertificateRequest=true|false (ALPHA - デフォルト値=false)<br/>kube:PodDeletionCost=true|false (BETA - デフォルト値=true)<br/>kube:PodLevelResources=true|false (BETA - デフォルト値=true)<br/>kube:PodLogsQuerySplitStreams=true|false (ALPHA - デフォルト値=false)<br/>kube:PodObservedGenerationTracking=true|false (BETA - デフォルト値=true)<br/>kube:PodReadyToStartContainersCondition=true|false (BETA - デフォルト値=true)<br/>kube:PodTopologyLabelsAdmission=true|false (ALPHA - デフォルト値=false)<br/>kube:PortForwardWebsockets=true|false (BETA - デフォルト値=true)<br/>kube:PreferSameTrafficDistribution=true|false (BETA - デフォルト値=true)<br/>kube:PreventStaticPodAPIReferences=true|false (BETA - デフォルト値=true)<br/>kube:ProcMountType=true|false (BETA - デフォルト値=true)<br/>kube:QOSReserved=true|false (ALPHA - デフォルト値=false)<br/>kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - デフォルト値=false)<br/>kube:RelaxedServiceNameValidation=true|false (ALPHA - デフォルト値=false)<br/>kube:ReloadKubeletServerCertificateFile=true|false (BETA - デフォルト値=true)<br/>kube:RemoteRequestHeaderUID=true|false (BETA - デフォルト値=true)<br/>kube:ResourceHealthStatus=true|false (ALPHA - デフォルト値=false)<br/>kube:RotateKubeletServerCertificate=true|false (BETA - デフォルト値=true)<br/>kube:RuntimeClassInImageCriApi=true|false (ALPHA - デフォルト値=false)<br/>kube:SELinuxChangePolicy=true|false (BETA - デフォルト値=true)<br/>kube:SELinuxMount=true|false (BETA - デフォルト値=false)<br/>kube:SELinuxMountReadWriteOncePod=true|false (BETA - デフォルト値=true)<br/>kube:SchedulerAsyncAPICalls=true|false (BETA - デフォルト値=true)<br/>kube:SchedulerAsyncPreemption=true|false (BETA - デフォルト値=true)<br/>kube:SchedulerPopFromBackoffQ=true|false (BETA - デフォルト値=true)<br/>kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - デフォルト値=true)<br/>kube:SizeBasedListCostEstimate=true|false (BETA - デフォルト値=true)<br/>kube:StorageCapacityScoring=true|false (ALPHA - デフォルト値=false)<br/>kube:StorageVersionAPI=true|false (ALPHA - デフォルト値=false)<br/>kube:StorageVersionHash=true|false (BETA - デフォルト値=true)<br/>kube:StorageVersionMigrator=true|false (ALPHA - デフォルト値=false)<br/>kube:StrictIPCIDRValidation=true|false (ALPHA - デフォルト値=false)<br/>kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - デフォルト値=true)<br/>kube:SupplementalGroupsPolicy=true|false (BETA - デフォルト値=true)<br/>kube:SystemdWatchdog=true|false (BETA - デフォルト値=true)<br/>kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - デフォルト値=true)<br/>kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - デフォルト値=false)<br/>kube:TopologyManagerPolicyBetaOptions=true|false (BETA - デフォルト値=true)<br/>kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - デフォルト値=true)<br/>kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - デフォルト値=true)<br/>kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - デフォルト値=false)<br/>kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - デフォルト値=false)<br/>kube:UserNamespacesSupport=true|false (BETA - デフォルト値=true)<br/>kube:WatchCacheInitializationPostStartHook=true|false (BETA - デフォルト値=false)<br/>kube:WatchList=true|false (BETA - デフォルト値=true)<br/>kube:WatchListClient=true|false (BETA - デフォルト値=false)<br/>kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - デフォルト値=false)<br/>kube:WindowsGracefulNodeShutdown=true|false (BETA - デフォルト値=true)</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kube-schedulerのヘルプ情報です。</p></td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>HTTP/2接続においてサーバーがクライアントに許可する最大ストリーム数の上限です。値が0の場合、Go言語のデフォルト値が使用されます。</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: Kubernetes APIサーバーと通信する際のバースト値です。--configで設定ファイルが指定されている場合、このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: APIサーバーへ送信されるリクエストのコンテンツタイプです。--configで設定ファイルが指定されている場合、このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: Kubernetes APIサーバーと通信するときに使用するQPSです。--configで設定ファイルが指定されている場合このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: 認証情報とマスターノードの位置情報を含むkubeconfigファイルのパスです。--configで設定ファイルが指定されている場合、このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダー選出クライアントを起動し、メインループを実行する前にリーダーシップを取得します。高可用性のために、コンポーネントを複数実行する場合に有効にします。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダー候補がリーダーシップの更新を確認した後、未更新のリーダースロットのリーダーシップ取得を試みるまで待機する時間です。実質的には、他の候補に交代されるまで既存リーダーが停止できる時間の上限です。リーダー選出を有効にしている場合のみ適用されます。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>現在のリーダーがリーダーシップを停止する前に更新を試みる間隔です。この時間はリース期間よりも短くなければなりません。リーダー選出が有効な場合のみ適用されます。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダー選出時のロックに使用されるリソースオブジェクトの種類です。サポートされているオプションには、 'leases'があります。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダー選出時のロックに使用されるリソースオブジェクト名です。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダー選出時のロックに使用されるリソースオブジェクトの名前空間です。</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>リーダーシップの取得や更新を試みる際にクライアントが待機すべき時間です。リーダー選出が有効な場合のみ適用されます。</p></td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ログをフラッシュする間隔の最大秒数です。</p></td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] 分割ストリームを伴うテキスト形式で、パフォーマンス向上のためinfoレベルのメッセージを一時的にバッファリングすることができます。デフォルト値の0バイトはバッファリングを無効にします。サイズはバイト数(512)、1000の倍数(1K)、1024の倍数(2Ki)、またはそのべき乗(3M、4G、5Mi、6Gi)で指定できます。使用するにはLoggingAlphaOptionsフィーチャーゲートを有効にしてください。</p></td>
</tr>

<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] テキスト形式でエラーをstderr、infoをstdoutにそれぞれ出力します。デフォルトでは単一ストリームをstdoutに書き込みます。使用するにはLoggingAlphaOptionsフィーチャーゲートを有効にしてください。</p></td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ログのフォーマットを設定します。現在使用できるフォーマットは "text" です。</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Kubernetes APIサーバーのアドレスです。kubeconfigに設定された値を上書きします。</p></td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueの場合、ポートをバインドする際にSO_REUSEADDRを使用します。0.0.0.0などのワイルドカードIPと特定IPを並行してバインドでき、カーネルがTIME_WAIT状態のソケットが解放することを待つ必要がなくなります。[デフォルト値=false]</p></td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueの場合、ポートをバインドする際にSO_REUSEPORTを使用し、同じアドレスとポートに複数のインスタンスをバインドできるようにします。[デフォルト値=false]</p></td>
</tr>

<tr>
<td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: PodがunschedulablePodsに留まれる最大時間です。この値を超えて滞留したPodは unschedulablePodsからbackoffQまたはactiveQに移動します。このフラグは非推奨であり、将来のバージョンで削除されます。</p></td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非推奨: host:port/debug/pprof/経由のWebインターフェースでプロファイリングを有効にします。--configで設定ファイルが指定されている場合、このパラメーターは無視されます。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--requestheader-username-headersで指定されたヘッダーにユーザー名を設定することを許可するクライアント証明書のCommon Nameリストです。空の場合、--requestheader-client-ca-fileで指定された認証局によって検証された任意のクライアント証明書が許可されます。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--requestheader-username-headersで指定されたヘッダー内のユーザー名を信用する前に、受信リクエストのクライアント証明書を検証するためのルート証明書バンドルです。注意: 通常、受信リクエストに対する認証処理が既に完了していることを前提としないでください。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>検査対象とするリクエストヘッダーのプレフィックスリストです。X-Remote-Extra-が推奨されます。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "x-remote-group"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>グループを判別するために検査するリクエストヘッダーのリストです。X-Remote-Groupが推奨されます。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-uid-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>UIDを確認するために検査するリクエストヘッダーのリストです。X-Remote-Uidが推奨されます。RemoteRequestHeaderUIDフィーチャーの有効化が必要です。</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ユーザー名を検証するために使用されるリクエストヘッダーのリストです。一般的にはX-Remote-Userが使用されます。</p></td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: 10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>認証および認可を伴うHTTPSを提供するポートです。0の場合、HTTPSを提供しません。</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>非表示メトリクスを表示したい直前のバージョンを指定します。直前のマイナーバージョンのみが有効で、それ以外の値は許可されていません。形式は &lt;major&gt;.&lt;minor&gt; (例: 1.16)です。このフォーマットの目的は、次のリリースで追加のメトリクスが隠されている可能性を事前に把握できるようにすることです。これにより、その次のリリースで恒久的に削除された場合に驚くことを防ぎます。</p></td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>HTTPS用のデフォルトx509証明書を含むファイルです(存在する場合はサーバー証明書の後にCA証明書を連結)。HTTPS提供が有効で、--tls-cert-fileと--tls-private-key-fileが指定されていない場合は、公開アドレス用の自己署名証明書と秘密鍵が生成され、--cert-dirで指定したディレクトリに保存されます。</p></td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>サーバーで使用する暗号スイートのカンマ区切りリストです。省略した場合、デフォルトのGo暗号スイートが適用されます。<br/>推奨値: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256<br/>非推奨値: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA</p></td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>サポートされている最小TLS バージョン。有効な値: VersionTLS10、VersionTLS11、VersionTLS12、VersionTLS13</p></td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--tls-cert-fileと対になるx509秘密鍵を含むファイルです。</p></td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>x509証明書ファイルと秘密鍵ファイルのパスを指定します。オプションで、完全修飾ドメイン名で構成されるドメイン名パターンのリストをサフィックスとして指定でき、さらにプレフィックス付きのワイルドカードセグメントを含めることも可能です。ドメインパターンにはIPアドレスも指定可能ですが、APIサーバーがクライアントから要求されたIPアドレスを認識できる場合にのみ使用してください。ドメインパターンが指定されていない場合、証明書の名称が抽出されます。ワイルドカードマッチよりも非ワイルドカードマッチが優先され、明示的に指定されたドメインパターンは抽出された名称よりも優先されます。複数のキー/証明書ペアを使用する場合は、--tls-sni-cert-keyオプションを複数回指定してください。使用例: "example.crt,example.key"、"foo.crt,foo.key:*.foo.com,foo.com"。</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ログレベルの詳細度を示す数値です。</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--versionや--version=rawを指定するとバージョン情報を表示して終了します。--version=vX.Y.Z... の形式で指定すると報告されるバージョンを設定します。</p></td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ファイルベースのログフィルタリングに使用する"pattern=N"設定のカンマ区切りリストです(テキストログ形式のみで使用可能)。</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>このパラメーターが設定されている場合、設定値をこのファイルに書き出して終了します。</p></td>
</tr>

</tbody>
</table>
