---
title: kube-proxy
notitle: true
weight: 60
---
## kube-proxy



### Synopsis


The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP and UDP stream forwarding or round robin TCP and UDP forwarding across a set of backends.
Service cluster IPs and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.

```
kube-proxy
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;">
    <col span="1">
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file container Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address for the proxy server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--cleanup</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true cleanup iptables and ipvs rules and exit.</td>
    </tr>

    <tr>
      <td colspan="2">--cleanup-ipvs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true make kube-proxy cleanup ipvs rules before running.  Default is true</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The path to the configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">How often configuration from the apiserver is refreshed.  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 32768</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min).</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 131072</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is).</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">NAT timeout for TCP connections in the CLOSE_WAIT state</td>
    </tr>

    <tr>
      <td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Idle timeout for established TCP connections (0 to leave as-is)</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>Accelerators=true|false (ALPHA - default=false)<br/>AdvancedAuditing=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllowExtTrafficLocalEndpoints=true|false (default=true)<br/>AppArmor=true|false (BETA - default=true)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CSIPersistentVolume=true|false (ALPHA - default=false)<br/>CustomPodDNS=true|false (ALPHA - default=false)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (ALPHA - default=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (ALPHA - default=false)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HugePages=true|false (BETA - default=true)<br/>Initializers=true|false (ALPHA - default=false)<br/>KubeletConfigFile=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>MountPropagation=true|false (ALPHA - default=false)<br/>PVCProtection=true|false (ALPHA - default=false)<br/>PersistentLocalVolumes=true|false (ALPHA - default=false)<br/>PodPriority=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportIPVSProxyMode=true|false (BETA - default=false)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (ALPHA - default=false)<br/>VolumeScheduling=true|false (ALPHA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">--google-json-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The Google Cloud Platform Service Account JSON Key to use for authentication.</td>
    </tr>

    <tr>
      <td colspan="2">--healthz-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0:10256</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address and port for the health check server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10256</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port to bind the health check server. Use 0 to disable.</td>
    </tr>

    <tr>
      <td colspan="2">--hostname-override string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If non-empty, will use this string as identification instead of the actual hostname.</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 14</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31].</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-min-sync-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    </tr>

    <tr>
      <td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-min-sync-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-scheduler string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The ipvs scheduler type when proxy mode is ipvs</td>
    </tr>

    <tr>
      <td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Burst to use while talking with kubernetes apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Content type of requests sent to apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">QPS to use while talking with kubernetes apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to kubeconfig file with authorization information (the master location is set by the master flag).</td>
    </tr>

    <tr>
      <td colspan="2">--masquerade-all</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The address of the Kubernetes API server (overrides any value in kubeconfig)</td>
    </tr>

    <tr>
      <td colspan="2">--metrics-bind-address 0.0.0.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 127.0.0.1:10249</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address and port for the metrics server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -999</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000]</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true enables profiling via web interface on /debug/pprof handler.</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-mode ProxyMode</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs'(experimental)'. If blank, use the best-available proxy (currently iptables).  If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-port-range port-range</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Range of host ports (beginPort-endPort, inclusive) that may be consumed in order to proxy service traffic. If unspecified (0-0) then ports will be randomly chosen.</td>
    </tr>

    <tr>
      <td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Print version information and quit</td>
    </tr>

    <tr>
      <td colspan="2">--write-config-to string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, write the default configuration values to this file and exit.</td>
    </tr>
