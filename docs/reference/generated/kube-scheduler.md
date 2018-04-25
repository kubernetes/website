---
title: kube-scheduler
notitle: true
---
## kube-scheduler



### Synopsis


The Kubernetes scheduler is a policy-rich, topology-aware,
workload-specific function that significantly impacts availability, performance,
and capacity. The scheduler needs to take into account individual and collective
resource requirements, quality of service requirements, hardware/software/policy
constraints, affinity and anti-affinity specifications, data locality, inter-workload
interference, deadlines, and so on. Workload-specific requirements will be exposed
through the API as necessary.

```
kube-scheduler
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;">
    <col span="1">
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address to serve on (set to 0.0.0.0 for all interfaces)</td>
    </tr>

    <tr>
      <td colspan="2">--algorithm-provider string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The scheduling algorithm provider to use, one of: ClusterAutoscalerProvider | DefaultProvider</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file container Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The path to the configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable lock contention profiling, if profiling is enabled</td>
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
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
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
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">QPS to use while talking with kubernetes apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to kubeconfig file with authorization and master location information.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect</td>
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
      <td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Define the name of the lock object.</td>
    </tr>

    <tr>
      <td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Define the namespace of the lock object.</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The address of the Kubernetes API server (overrides any value in kubeconfig)</td>
    </tr>

    <tr>
      <td colspan="2">--policy-config-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config==true</td>
    </tr>

    <tr>
      <td colspan="2">--policy-configmap string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config==false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'</td>
    </tr>

    <tr>
      <td colspan="2">--policy-configmap-namespace string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The namespace where policy ConfigMap is located. The system namespace will be used if this is not provided or is empty.</td>
    </tr>

    <tr>
      <td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10251</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port that the scheduler's http service runs on</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable profiling via web interface host:port/debug/pprof/</td>
    </tr>

    <tr>
      <td colspan="2">--scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default-scheduler"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.SchedulerName".</td>
    </tr>

    <tr>
      <td colspan="2">--use-legacy-policy-config</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">When set to true, scheduler will ignore policy ConfigMap and uses policy config file</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Print version information and quit</td>
    </tr>


