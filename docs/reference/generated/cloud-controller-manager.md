---
title: cloud-controller-manager
notitle: true
---
## cloud-controller-manager



### Synopsis


The Cloud controller manager is a daemon that embeds
the cloud specific control loops shipped with Kubernetes.

```
cloud-controller-manager
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;">
    <col span="1">
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address to serve on (set to 0.0.0.0 for all interfaces).</td>
    </tr>

    <tr>
      <td colspan="2">--allocate-node-cidrs</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Should CIDRs for Pods be allocated and set on the cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file container Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "RangeAllocator"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Type of CIDR allocator to use</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The path to the cloud provider configuration file. Empty string for no configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The provider of cloud services. Cannot be empty.</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">CIDR Range for Pods in cluster. Requires --allocate-node-cidrs to be true</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The instance prefix for the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load</td>
    </tr>

    <tr>
      <td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable lock contention profiling, if profiling is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--controller-start-interval duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Interval between starting controller managers.</td>
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
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Burst to use while talking with kubernetes apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Content type of requests sent to apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 20</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">QPS to use while talking with kubernetes apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to kubeconfig file with authorization and master location information.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "endpoints"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The address of the Kubernetes API server (overrides any value in kubeconfig).</td>
    </tr>

    <tr>
      <td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 12h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod.</td>
    </tr>

    <tr>
      <td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The period for syncing NodeStatus in NodeController.</td>
    </tr>

    <tr>
      <td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Specifies how often the controller updates nodes' status.</td>
    </tr>

    <tr>
      <td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10253</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port that the controller-manager's http service runs on.</td>
    </tr>

    <tr>
      <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable profiling via web interface host:port/debug/pprof/</td>
    </tr>

    <tr>
      <td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The period for reconciling routes created for Nodes by cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--use-service-account-credentials</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true, use individual service account credentials for each controller.</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Print version information and quit</td>
    </tr>


