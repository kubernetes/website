---
title: kube-proxy
content_type: tool-reference
weight: 30
auto_generated: true
---


<!--
파일은 일반 [생성기](https://github.com/kubernetes-sigs/reference-docs/)를
사용해서 컴포넌트의 Go 소스 코드를 통해 자동 생성된다.
참조 문서의 생성에 대해 배우려면
[참조 문서에 기여하기](/ko/docs/contribute/generate-ref-docs/)를 읽는다.
참조 컨텐츠를 업데이트하려면,
[업스트림에 기여하기](/docs/contribute/generate-ref-docs/contribute-upstream/) 가이드를 따른다.
[참조 문서](https://github.com/kubernetes-sigs/reference-docs/) 프로젝트에
대해 문서 서식의 버그를 신고할 수 있다.
-->


## {{% heading "synopsis" %}}


쿠버네티스 네트워크 프록시는 각 노드에서 실행된다.
이는 각 노드의 쿠버네티스 API에 정의된 서비스를 반영하며 단순한
TCP, UDP 및 SCTP 스트림 포워딩 또는 라운드 로빈 TCP, UDP 및 SCTP 포워딩을 백엔드 셋에서 수행 할 수 있다.
서비스 클러스트 IP 및 포트는 현재 서비스 프록시에 의해 열린 포트를 지정하는
Docker-links-compatible 환경 변수를 통해 찾을 수 있다.
이러한 클러스터 IP에 클러스터 DNS를 제공하는 선택적 애드온이 있다. 유저는 apiserver API로
서비스를 생성하여 프록시를 구성해야 한다.

```
kube-proxy [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add_dir_header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true인 경우 파일 경로를 로그 메시지의 헤더에 추가한다.</p></td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>파일과 함께, 표준 에러에도 로그를 출력한다.</p></td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>프록시 서버가 서비스할 IP 주소(모든 IPv4 인터페이스의 경우 '0.0.0.0'으로 설정, 모든 IPv6 인터페이스의 경우 '::'로 설정)</p></td>
</tr>

<tr>
<td colspan="2">--bind-address-hard-fail</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true인 경우 kube-proxy는 포트 바인딩 실패를 치명적인 것으로 간주하고 종료한다.</p></td>
</tr>

<tr>
<td colspan="2">--boot-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: "/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>boot-id를 위해 확인할 파일 목록(쉼표로 분리). 가장 먼저 발견되는 항목을 사용한다.</p></td>
</tr>

<tr>
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true인 경우 iptables 및 ipvs 규칙을 제거하고 종료한다.</p></td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>클러스터에 있는 파드의 CIDR 범위. 구성 후에는 이 범위 밖에서 서비스 클러스터 IP로 전송되는 트래픽은 마스커레이드되고 파드에서 외부 LoadBalancer IP로 전송된 트래픽은 대신 해당 클러스터 IP로 전송된다. 듀얼-스택(dual-stack) 클러스터의 경우, 각 IP 체계(IPv4와 IPv6)별로 최소한 하나의 CIDR을 포함하는 목록(쉼표로 분리)을 가진다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>설정 파일의 경로.</p></td>
</tr>

<tr>
<td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 15m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>apiserver의 설정이 갱신되는 빈도. 0보다 커야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 32768</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CPU 코어당 추적할 최대 NAT 연결 수(한도(limit)를 그대로 두고 contrack-min을 무시하려면 0으로 설정한다)(</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 131072</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>conntrack-max-per-core와 관계없이 할당할 최소 conntrack 항목 수(한도를 그대로 두려면 conntrack-max-per-core값을 0으로 설정).</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CLOSE_WAIT 상태의 TCP 연결에 대한 NAT 시간 초과</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>설정된 TCP 연결에 대한 유휴시간 초과(값이 0이면 그대로 유지)</p></td>
</tr>

<tr>
<td colspan="2">--detect-local-mode LocalMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로컬 트래픽을 탐지하는 데 사용할 모드. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;쉼표로 구분된 'key=True|False' 쌍들&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>알파/실험적 기능의 기능 게이트를 나타내는 `key=value` 쌍의 집합. 사용 가능한 옵션은 다음과 같다:<br/><br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (ALPHA - default=false)<br/>APIServerTracing=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (BETA - default=true)<br/>AppArmor=true|false (BETA - default=true)<br/>CPUManager=true|false (BETA - default=true)<br/>CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>CSIMigrationAzureFile=true|false (BETA - default=true)<br/>CSIMigrationPortworx=true|false (BETA - default=false)<br/>CSIMigrationRBD=true|false (ALPHA - default=false)<br/>CSIMigrationvSphere=true|false (BETA - default=true)<br/>CSINodeExpandSecret=true|false (ALPHA - default=false)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>ContainerCheckpoint=true|false (ALPHA - default=false)<br/>CronJobTimeZone=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceValidationExpressions=true|false (BETA - default=true)<br/>DelegateFSGroupToCSIDriver=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableCloudProviders=true|false (ALPHA - default=false)<br/>DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>DownwardAPIHugePages=true|false (BETA - default=true)<br/>EndpointSliceTerminatingCondition=true|false (BETA - default=true)<br/>ExpandedDNSConfig=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GRPCContainerProbe=true|false (BETA - default=true)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>IPTablesOwnershipCleanup=true|false (ALPHA - default=false)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>JobMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>JobPodFailurePolicy=true|false (ALPHA - default=false)<br/>JobReadyPods=true|false (BETA - default=true)<br/>JobTrackingWithFinalizers=true|false (BETA - default=true)<br/>KMSv2=true|false (ALPHA - default=false)<br/>KubeletCredentialProviders=true|false (BETA - default=true)<br/>KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>KubeletTracing=true|false (ALPHA - default=false)<br/>LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=true)<br/>LogarithmicScaleDown=true|false (BETA - default=true)<br/>MatchLabelKeysInPodTopologySpread=true|false (ALPHA - default=false)<br/>MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (BETA - default=true)<br/>MemoryQoS=true|false (ALPHA - default=false)<br/>MinDomainsInPodTopologySpread=true|false (BETA - default=false)<br/>MixedProtocolLBService=true|false (BETA - default=true)<br/>MultiCIDRRangeAllocator=true|false (ALPHA - default=false)<br/>NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>NodeInclusionPolicyInPodTopologySpread=true|false (ALPHA - default=false)<br/>NodeOutOfServiceVolumeDetach=true|false (ALPHA - default=false)<br/>NodeSwap=true|false (ALPHA - default=false)<br/>OpenAPIEnums=true|false (BETA - default=true)<br/>OpenAPIV3=true|false (BETA - default=true)<br/>PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (BETA - default=true)<br/>PodDisruptionConditions=true|false (ALPHA - default=false)<br/>PodHasNetworkCondition=true|false (ALPHA - default=false)<br/>ProbeTerminationGracePeriod=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>ProxyTerminatingEndpoints=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ReadWriteOncePod=true|false (ALPHA - default=false)<br/>RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RetroactiveDefaultStorageClass=true|false (ALPHA - default=false)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>SELinuxMountReadWriteOncePod=true|false (ALPHA - default=false)<br/>SeccompDefault=true|false (BETA - default=true)<br/>ServerSideFieldValidation=true|false (BETA - default=true)<br/>ServiceIPStaticSubrange=true|false (BETA - default=true)<br/>ServiceInternalTrafficPolicy=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (BETA - default=true)<br/>TopologyManager=true|false (BETA - default=true)<br/>UserNamespacesStatelessPodsSupport=true|false (ALPHA - default=false)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsHostProcessContainers=true|false (BETA - default=true)<br/><br/>--config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 0.0.0.0:10256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>헬스 체크 서버가 서비스할 포트가 있는 IP 주소(모든 IPv4의 인터페이스의 경우 '0.0.0.0:10256', 모든 IPv6의 인터페이스인 경우 '[::]:10256'로 설정)이며, 사용 안 할 경우 빈칸으로 둔다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kube-proxy에 대한 도움말.</p></td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>문자열 값이 있으면, 이 값을 실제 호스트네임 대신에 ID로 사용한다.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>순수 iptable 프록시를 사용하는 경우 SNAT가 필요한 패킷을 표시하는 fwmark 스페이스 비트. [0, 31] 범위 안에 있어야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>엔드포인트 및 서비스가 변경될 때 iptable 규칙을 새로 고칠 수 있는 빈도의 최소 간격(예: '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>iptable 규칙을 새로 고치는 빈도의 최대 간격(예: '5s', '1m', '2h22m'). 0 보다 커야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>IPVS 규칙을 정리할 때 ipvs 프록시가 건드리지 않아야 하는 쉼표로 구분된 CIDR 목록.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>엔드포인트 및 서비스가 변경될 때 ipvs 규칙을 새로 고칠 수 있는 빈도의 최소 간격(예: '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-scheduler string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>프록시 모드가 ipvs인 경우 ipvs 스케줄러 유형.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-strict-arp</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>arp_ignore를 1로 설정하고 arp_annotes를 2로 설정하여 엄격한 ARP를 사용.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ipvs 규칙이 새로 갱신되는 빈도의 최대 간격(예: '5s', '1m', '2h22m'). 0 보다 커야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>유휴 IPVS TCP 연결에 대한 시간 초과. 0이면 그대로 유지(예: '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcpfin-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>FIN 패킷을 수신한 후 IPVS TCP 연결에 대한 시간 초과. 0이면 그대로 유지(예: '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>IPVS UDP 패킷에 대한 시간 초과. 0이면 그대로 유지(예: '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>쿠버네티스 api 서버와 통신하는 동안 사용할 burst.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>api 서버에 보낸 요청의 내용 유형.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>쿠버네티스 api 서버와 통신할 때 사용할 QPS.</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>인증 정보가 있는 kubeconfig 파일의 경로(마스터 위치는 마스터 플래그로 설정됨).</p></td>
</tr>

<tr>
<td colspan="2">--log_backtrace_at &lt;'file:N' 형식의 문자열&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>파일의 N개 줄만큼 로그를 남기게 되면, 스택 트레이스를 출력한다.</p></td>
</tr>

<tr>
<td colspan="2">--log_dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로그 파일을 지정된 경로 아래에 쓰며, 비어있을 경우 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--log_file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>지정된 로그 파일을 사용하며, 비어있을 경우 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로그 파일의 최대 크기를 MB 단위로 지정하며, 값이 0일 경우는 최대 크기에 제한이 없다.</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로그를 파일 대신 표준 에러에 출력한다.</p></td>
</tr>

<tr>
<td colspan="2">--machine-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>machine-id를 위해 확인할 파일 목록(쉼표로 분리). 가장 먼저 발견되는 항목을 사용한다.</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>순수 iptables 프록시를 사용하는 경우 서비스 클러스터 IP를 통해 전송된 모든 트래픽을 SNAT함(일반적으로 필요하지 않음).</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>쿠버네티스 API 서버의 주소(kubeconfig의 모든 값 덮어쓰기).</p></td>
</tr>

<tr>
<td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 127.0.0.1:10249</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>메트릭 서버가 서비스할 포트가 있는 IP 주소(모든 IPv4 인터페이스의 경우 '0.0.0.0:10249', 모든 IPv6 인터페이스의 경우 '[::]:10249'로 설정됨)로, 사용하지 않으려면 비워둔다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>NodePort에 사용할 주소를 지정하는 값의 문자열 조각. 값은 유효한 IP 블록(예: 1.2.3.0/24, 1.2.3.4/32). 기본값인 빈 문자열 조각값은([]) 모든 로컬 주소를 사용하는 것을 의미한다.</p></td>
</tr>

<tr>
<td colspan="2">--one_output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true일 경우, 심각도 기본 레벨에서만 로그를 쓴다(false일 경우 크게 심각하지 않은 단계에서도 로그를 쓴다).</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: -999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kube-proxy 프로세스에 대한 oom-score-adj 값. 값은 [-1000, 1000] 범위 내에 있어야 한다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--pod-bridge-interface string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>클러스터 내의 브리지 인터페이스 이름으로, kube-proxy는 지정된 인터페이스로부터 발생한 트래픽을 로컬로 간주한다. DetectLocalMode가 BridgeInterface로 설정되어 있을 경우, 해당 인자도 같이 설정되어야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--pod-interface-name-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>클러스터 내에서 인터페이스의 접두사로, kube-proxy는 지정된 접두사가 붙은 인터페이스로부터 발생한 트래픽을 로컬로 간주한다. DetectLocalMode가 InterfaceNamePrefix로 설정되어 있을 경우, 해당 인자도 같이 설정되어야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>값이 true이면 /debug/pprof 핸들러에서 웹 인터페이스를 통한 프로파일링을 활성화한다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>사용할 프록시 모드: 'iptables' (리눅스), 'ipvs' (리눅스), 'kernelspace' (윈도우), 또는 'userspace' (리눅스/윈도우, 지원 중단). 리눅스에서의 기본값은 'iptables'이며, 윈도우에서의 기본값은 'userspace'(추후 'kernelspace'로 변경될 예정)이다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-port-range port-range</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>서비스 트래픽을 프록시하기 위해 사용할 수 있는 호스트 포트 범위(beginPort-endPort, single port 또는 beginPort+offset 포함). 만약 범위가 0, 0-0, 혹은 지정되지 않으면, 포트는 무작위로 선택된다.</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>숨겨진 메트릭을 표시하려는 이전 버전. 이전 마이너 버전만 인식하며, 다른 값은 허용하지 않는다. 포멧은 &lt;메이저&gt;.&lt;마이너&gt; 와 같으며, 예를 들면 '1.16' 과 같다. 이 포멧의 목적은, 다음 릴리스가 숨길 추가적인 메트릭을 사용자에게 공지하여, 그 이후 릴리스에서 메트릭이 영구적으로 삭제됐을 때 사용자가 놀라지 않도록 하기 위함이다. --config를 통해 설정 파일이 명시될 경우 이 파라미터는 무시된다.</p></td>
</tr>

<tr>
<td colspan="2">--skip_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true일 경우, 로그 메시지에 헤더를 쓰지 않는다.</p></td>
</tr>

<tr>
<td colspan="2">--skip_log_headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true일 경우, 로그 파일을 열 때 헤더를 보여주지 않는다.</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>해당 임계값 이상의 로그를 표준에러로 보낸다.</p></td>
</tr>

<tr>
<td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 250ms</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>유휴 UDP 연결이 열린 상태로 유지되는 시간(예: '250ms', '2s'). 값은 0보다 커야 한다. 프록시 모드 userspace에만 적용 가능함.</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로그 상세 레벨(verbosity) 값</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>버전 정보를 출력하고 종료</p></td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;쉼표로 구분된 'pattern=N' 설정들&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>파일 필터 로깅을 위한 pattern=N 설정 목록(쉼표로 분리).</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>기본 구성 값을 이 파일에 옮겨쓰고 종료한다.</p></td>
</tr>

</tbody>
</table>
