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
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Azure 컨테이너 레지스트리 구성 정보가 들어 있는 파일의 경로.</p></td>
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
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>true인 경우 iptables 및 ipvs 규칙을 제거하고 종료한다.</p></td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>클러스터에 있는 파드의 CIDR 범위. 구성 후에는 이 범위 밖에서 서비스 클러스터 IP로 전송되는 트래픽은 마스커레이드되고 파드에서 외부 LoadBalancer IP로 전송된 트래픽은 대신 해당 클러스터 IP로 전송된다</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로컬 트래픽을 탐지하는 데 사용할 모드</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>알파/실험 기능에 대한 기능 게이트를 설명하는 키=값 쌍 집합. 옵션은 다음과 같다.<br/>APIListChunking=true|false (BETA - 기본값=true)<br/>APIPriorityAndFairness=true|false (ALPHA - 기본값=false)<br/>APIResponseCompression=true|false (BETA - 기본값=true)<br/>AllAlpha=true|false (ALPHA - 기본값=false)<br/>AllBeta=true|false (BETA - 기본값=false)<br/>AllowInsecureBackendProxy=true|false (BETA - 기본값=true)<br/>AnyVolumeDataSource=true|false (ALPHA - 기본값=false)<br/>AppArmor=true|false (BETA - 기본값=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 기본값=false)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - 기본값=false)<br/>CPUManager=true|false (BETA - 기본값=true)<br/>CRIContainerLogRotation=true|false (BETA - 기본값=true)<br/>CSIInlineVolume=true|false (BETA - 기본값=true)<br/>CSIMigration=true|false (BETA - 기본값=true)<br/>CSIMigrationAWS=true|false (BETA - 기본값=false)<br/>CSIMigrationAWSComplete=true|false (ALPHA - 기본값=false)<br/>CSIMigrationAzureDisk=true|false (BETA - 기본값=false)<br/>CSIMigrationAzureDiskComplete=true|false (ALPHA - 기본값=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - 기본값=false)<br/>CSIMigrationAzureFileComplete=true|false (ALPHA - 기본값=false)<br/>CSIMigrationGCE=true|false (BETA - 기본값=false)<br/>CSIMigrationGCEComplete=true|false (ALPHA - 기본값=false)<br/>CSIMigrationOpenStack=true|false (BETA - 기본값=false)<br/>CSIMigrationOpenStackComplete=true|false (ALPHA - 기본값=false)<br/>CSIMigrationvSphere=true|false (BETA - 기본값=false)<br/>CSIMigrationvSphereComplete=true|false (BETA - 기본값=false)<br/>CSIStorageCapacity=true|false (ALPHA - 기본값=false)<br/>CSIVolumeFSGroupPolicy=true|false (ALPHA - 기본값=false)<br/>ConfigurableFSGroupPolicy=true|false (ALPHA - 기본값=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - 기본값=false)<br/>DefaultPodTopologySpread=true|false (ALPHA - 기본값=false)<br/>DevicePlugins=true|false (BETA - 기본값=true)<br/>DisableAcceleratorUsageMetrics=true|false (ALPHA - 기본값=false)<br/>DynamicKubeletConfig=true|false (BETA - 기본값=true)<br/>EndpointSlice=true|false (BETA - 기본값=true)<br/>EndpointSliceProxying=true|false (BETA - 기본값=true)<br/>EphemeralContainers=true|false (ALPHA - 기본값=false)<br/>ExpandCSIVolumes=true|false (BETA - 기본값=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - 기본값=true)<br/>ExpandPersistentVolumes=true|false (BETA - 기본값=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 기본값=false)<br/>GenericEphemeralVolume=true|false (ALPHA - 기본값=false)<br/>HPAScaleToZero=true|false (ALPHA - 기본값=false)<br/>HugePageStorageMediumSize=true|false (BETA - 기본값=true)<br/>HyperVContainer=true|false (ALPHA - 기본값=false)<br/>IPv6DualStack=true|false (ALPHA - 기본값=false)<br/>ImmutableEphemeralVolumes=true|false (BETA - 기본값=true)<br/>KubeletPodResources=true|false (BETA - 기본값=true)<br/>LegacyNodeRoleBehavior=true|false (BETA - 기본값=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - 기본값=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 기본값=false)<br/>NodeDisruptionExclusion=true|false (BETA - 기본값=true)<br/>NonPreemptingPriority=true|false (BETA - 기본값=true)<br/>PodDisruptionBudget=true|false (BETA - 기본값=true)<br/>PodOverhead=true|false (BETA - 기본값=true)<br/>ProcMountType=true|false (ALPHA - 기본값=false)<br/>QOSReserved=true|false (ALPHA - 기본값=false)<br/>RemainingItemCount=true|false (BETA - 기본값=true)<br/>RemoveSelfLink=true|false (ALPHA - 기본값=false)<br/>RotateKubeletServerCertificate=true|false (BETA - 기본값=true)<br/>RunAsGroup=true|false (BETA - 기본값=true)<br/>RuntimeClass=true|false (BETA - 기본값=true)<br/>SCTPSupport=true|false (BETA - 기본값=true)<br/>SelectorIndex=true|false (BETA - 기본값=true)<br/>ServerSideApply=true|false (BETA - 기본값=true)<br/>ServiceAccountIssuerDiscovery=true|false (ALPHA - 기본값=false)<br/>ServiceAppProtocol=true|false (BETA - 기본값=true)<br/>ServiceNodeExclusion=true|false (BETA - 기본값=true)<br/>ServiceTopology=true|false (ALPHA - 기본값=false)<br/>SetHostnameAsFQDN=true|false (ALPHA - 기본값=false)<br/>StartupProbe=true|false (BETA - 기본값=true)<br/>StorageVersionHash=true|false (BETA - 기본값=true)<br/>SupportNodePidsLimit=true|false (BETA - 기본값=true)<br/>SupportPodPidsLimit=true|false (BETA - 기본값=true)<br/>Sysctls=true|false (BETA - 기본값=true)<br/>TTLAfterFinished=true|false (ALPHA - 기본값=false)<br/>TokenRequest=true|false (BETA - 기본값=true)<br/>TokenRequestProjection=true|false (BETA - 기본값=true)<br/>TopologyManager=true|false (BETA - 기본값=true)<br/>ValidateProxyRedirects=true|false (BETA - 기본값=true)<br/>VolumeSnapshotDataSource=true|false (BETA - 기본값=true)<br/>WarningHeaders=true|false (BETA - 기본값=true)<br/>WinDSR=true|false (ALPHA - 기본값=false)<br/>WinOverlay=true|false (ALPHA - 기본값=false)<br/>WindowsEndpointSliceProxying=true|false (ALPHA - 기본값=false)</p></td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 0.0.0.0:10256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>헬스 체크 서버가 서비스할 포트가 있는 IP 주소(모든 IPv4의 인터페이스의 경우 '0.0.0.0:10256', 모든 IPv6의 인터페이스인 경우 '[::]:10256'로 설정). 사용 안 할 경우 빈칸으로 둠.</p></td>
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
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>로그 플러시 사이의 최대 시간</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>메트릭 서버가 서비스할 포트가 있는 IP 주소(모든 IPv4 인터페이스의 경우 '0.0.0.0:10249', 모든 IPv6 인터페이스의 경우 '[::]:10249'로 설정됨). 사용하지 않으려면 비워둘 것.</p></td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>NodePort에 사용할 주소를 지정하는 값의 문자열 조각. 값은 유효한 IP 블록(예: 1.2.3.0/24, 1.2.3.4/32). 기본값인 빈 문자열 조각값은([]) 모든 로컬 주소를 사용하는 것을 의미한다.</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: -999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kube-proxy 프로세스에 대한 oom-score-adj 값. 값은 [-1000, 1000] 범위 내에 있어야 한다.</p></td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>값이 true이면 /debug/pprof 핸들러에서 웹 인터페이스를 통한 프로파일링을 활성화한다.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>사용할 프록시 모드: 'userspace' (이전) or 'iptables' (빠름) or 'ipvs' or 'kernelspace' (윈도우). 공백인 경우 가장 잘 사용할 수 있는 프록시(현재는 iptables)를 사용한다. iptables 프록시를 선택했지만, 시스템의 커널 또는 iptables 버전이 맞지 않으면, 항상 userspace 프록시로 변경된다.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>숨겨진 메트릭을 표시할 이전 버전. </p></td>
</tr>

<tr>
<td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기본값: 250ms</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>유휴 UDP 연결이 열린 상태로 유지되는 시간(예: '250ms', '2s'). 값은 0보다 커야 한다. 프록시 모드 userspace에만 적용 가능함.</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>버전 정보를 인쇄하고 종료.</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>기본 구성 값을 이 파일에 옮겨쓰고 종료한다.</p></td>
</tr>

</tbody>
</table>



