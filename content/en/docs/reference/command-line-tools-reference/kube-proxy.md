---
title: kube-proxy
content_template: templates/tool-reference
weight: 28
---

{{% capture synopsis %}}


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

{{% /capture %}}

{{% capture options %}}

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the proxy server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--cleanup</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true cleanup iptables and ipvs rules and exit.</td>
    </tr>

    <tr>
      <td colspan="2">--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true and --cleanup is specified, kube-proxy will also flush IPVS rules, in addition to normal cleanup.</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How often configuration from the apiserver is refreshed.  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">NAT timeout for TCP connections in the CLOSE_WAIT state</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Idle timeout for established TCP connections (0 to leave as-is)</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (BETA - default=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (BETA - default=true)<br/>CSIDriverRegistry=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (ALPHA - default=false)<br/>CSIMigrationAWS=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceDefaulting=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NodeLease=true|false (BETA - default=true)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (ALPHA - default=false)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>RequestManagement=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (BETA - default=true)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (ALPHA - default=false)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumePVCDataSource=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - default=true)<br/>WatchBookmark=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)<br/>WindowsGMSA=true|false (BETA - default=true)<br/>WindowsRunAsUserName=true|false (ALPHA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the health check server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10256</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port to bind the health check server. Use 0 to disable.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kube-proxy</td>
    </tr>

    <tr>
      <td colspan="2">--hostname-override string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, will use this string as identification instead of the actual hostname.</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-min-sync-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-exclude-cidrs stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list of CIDR's which the ipvs proxier should not touch when cleaning up IPVS rules.</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-min-sync-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-scheduler string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The ipvs scheduler type when proxy mode is ipvs</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-strict-arp</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable strict ARP by setting arp_ignore to 1 and arp_announce to 2</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeconfig file with authorization information (the master location is set by the master flag).</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    </tr>

    <tr>
      <td colspan="2">--masquerade-all</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address of the Kubernetes API server (overrides any value in kubeconfig)</td>
    </tr>

    <tr>
      <td colspan="2">--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the metrics server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--metrics-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10249</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port to bind the metrics server. Use 0 to disable.</td>
    </tr>

    <tr>
      <td colspan="2">--nodeport-addresses stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A string slice of values which specify the addresses to use for NodePorts. Values may be valid IP blocks (e.g. 1.2.3.0/24, 1.2.3.4/32). The default empty string slice ([]) means to use all local addresses.</td>
    </tr>

    <tr>
      <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true enables profiling via web interface on /debug/pprof handler.</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-mode ProxyMode</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs'. If blank, use the best-available proxy (currently iptables).  If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-port-range port-range</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Range of host ports (beginPort-endPort, single port or beginPort+offset, inclusive) that may be consumed in order to proxy service traffic. If (unspecified, 0, or 0-0) then ports will be randomly chosen.</td>
    </tr>

    <tr>
      <td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    </tr>

    <tr>
      <td colspan="2">--write-config-to string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, write the default configuration values to this file and exit.</td>
    </tr>

  </tbody>
</table>



{{% /capture %}}

