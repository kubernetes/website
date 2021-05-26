---
title: kube-proxy
content_type: tool-reference
weight: 30
auto_generated: true
---


<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


## {{% heading "synopsis" %}}


The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP, UDP, and SCTP stream forwarding or round robin TCP, UDP, and SCTP forwarding across a set of backends.
Service cluster IPs and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.

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
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, adds the file directory to the header of the log messages</p></td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error as well as files</p></td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to the file containing Azure container registry configuration information.</p></td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address for the proxy server to serve on (set to '0.0.0.0' for all IPv4 interfaces and '::' for all IPv6 interfaces)</p></td>
</tr>

<tr>
<td colspan="2">--bind-address-hard-fail</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true kube-proxy will treat failure to bind to a port as fatal and exit</p></td>
</tr>

<tr>
<td colspan="2">--boot-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of files to check for boot-id. Use the first one that exists.</p></td>
</tr>

<tr>
<td colspan="2">--cleanup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true cleanup iptables and ipvs rules and exit.</p></td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CIDRs opened in GCE firewall for L7 LB traffic proxy &amp; health checks</p></td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CIDRs opened in GCE firewall for L4 LB traffic proxy &amp; health checks</p></td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the configuration file.</p></td>
</tr>

<tr>
<td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How often configuration from the apiserver is refreshed.  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>NAT timeout for TCP connections in the CLOSE_WAIT state</p></td>
</tr>

<tr>
<td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Idle timeout for established TCP connections (0 to leave as-is)</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.</p></td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.</p></td>
</tr>

<tr>
<td colspan="2">--detect-local-mode LocalMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Mode to use to detect local traffic</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (BETA - default=true)<br/>CPUManager=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>CSIMigrationAzureFile=true|false (BETA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=true)<br/>CSIMigrationvSphere=true|false (BETA - default=false)<br/>CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>CSIServiceAccountToken=true|false (BETA - default=true)<br/>CSIStorageCapacity=true|false (BETA - default=true)<br/>CSIVolumeFSGroupPolicy=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (BETA - default=true)<br/>ControllerManagerLeaderMigration=true|false (ALPHA - default=false)<br/>CronJobControllerV2=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DaemonSetUpdateSurge=true|false (ALPHA - default=false)<br/>DefaultPodTopologySpread=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>DownwardAPIHugePages=true|false (BETA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EfficientWatchResumption=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (BETA - default=true)<br/>EndpointSliceTerminatingCondition=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GenericEphemeralVolume=true|false (BETA - default=true)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (BETA - default=true)<br/>IPv6DualStack=true|false (BETA - default=true)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>IndexedJob=true|false (ALPHA - default=false)<br/>IngressClassNamespacedParams=true|false (ALPHA - default=false)<br/>KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesGetAllocatable=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (ALPHA - default=false)<br/>MixedProtocolLBService=true|false (ALPHA - default=false)<br/>NamespaceDefaultLabelName=true|false (BETA - default=true)<br/>NetworkPolicyEndPort=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (BETA - default=true)<br/>PodAffinityNamespaceSelector=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (BETA - default=true)<br/>PreferNominatedNode=true|false (ALPHA - default=false)<br/>ProbeTerminationGracePeriod=true|false (ALPHA - default=false)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceInternalTrafficPolicy=true|false (ALPHA - default=false)<br/>ServiceLBNodePortControl=true|false (ALPHA - default=false)<br/>ServiceLoadBalancerClass=true|false (ALPHA - default=false)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>SetHostnameAsFQDN=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (ALPHA - default=false)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SuspendJob=true|false (ALPHA - default=false)<br/>TTLAfterFinished=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (ALPHA - default=false)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WarningHeaders=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsEndpointSliceProxying=true|false (BETA - default=true)</p></td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address with port for the health check server to serve on (set to '0.0.0.0:10256' for all IPv4 interfaces and '[::]:10256' for all IPv6 interfaces). Set empty to disable.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kube-proxy</p></td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, will use this string as identification instead of the actual hostname.</p></td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</p></td>
</tr>

<tr>
<td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-exclude-cidrs strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-min-sync-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-scheduler string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The ipvs scheduler type when proxy mode is ipvs</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-strict-arp</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable strict ARP by setting arp_ignore to 1 and arp_announce to 2</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for idle IPVS TCP connections, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-tcpfin-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for IPVS TCP connections after receiving a FIN packet, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--ipvs-udp-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout for IPVS UDP packets, 0 to leave as-is. (e.g. '5s', '1m', '2h22m').</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Burst to use while talking with kubernetes apiserver</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Content type of requests sent to apiserver.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>QPS to use while talking with kubernetes apiserver</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to kubeconfig file with authorization information (the master location can be overridden by the master flag).</p></td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at &lt;a string in the form 'file:N'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>when logging hits line file:N, emit a stack trace</p></td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, write log files in this directory</p></td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, use this log file</p></td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</p></td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of seconds between log flushes</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error instead of files</p></td>
</tr>

<tr>
<td colspan="2">--machine-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of files to check for machine-id. Use the first one that exists.</p></td>
</tr>

<tr>
<td colspan="2">--masquerade-all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The address of the Kubernetes API server (overrides any value in kubeconfig)</p></td>
</tr>

<tr>
<td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address with port for the metrics server to serve on (set to '0.0.0.0:10249' for all IPv4 interfaces and '[::]:10249' for all IPv6 interfaces). Set empty to disable.</p></td>
</tr>

<tr>
<td colspan="2">--nodeport-addresses strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses.</p></td>
</tr>

<tr>
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, only write logs to their native severity level (vs also writing to each lower severity level)</p></td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]</p></td>
</tr>

<tr>
<td colspan="2">--profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true enables profiling via web interface on /debug/pprof handler.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-mode ProxyMode</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs' or 'kernelspace' (windows). If blank, use the best-available proxy (currently iptables). If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-port-range port-range</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is <!-- raw HTML omitted -->.<!-- raw HTML omitted -->, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.</p></td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid header prefixes in the log messages</p></td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid headers when opening log files</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>logs at or above this threshold go to stderr</p></td>
</tr>

<tr>
<td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>number for the log level verbosity</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Print version information and quit</p></td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;comma-separated 'pattern=N' settings&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>comma-separated list of pattern=N settings for file-filtered logging</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the default configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



