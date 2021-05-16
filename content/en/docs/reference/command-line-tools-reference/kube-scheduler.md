---
title: kube-scheduler
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


The Kubernetes scheduler is a control plane process which assigns
Pods to Nodes. The scheduler determines which Nodes are valid placements for
each Pod in the scheduling queue according to constraints and available
resources. The scheduler then ranks each valid Node and binds the Pod to a
suitable Node. Multiple different schedulers may be used within a cluster;
kube-scheduler is the reference implementation.
See [scheduling](https://kubernetes.io/docs/concepts/scheduling-eviction/)
for more information about scheduling and the kube-scheduler component.

```
kube-scheduler [flags]
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
<td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0.0.0.0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the IP address on which to listen for the --port port (set to 0.0.0.0 or :: for listening in all interfaces and IP families). See --bind-address instead. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--algorithm-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the scheduling algorithm provider to use, this sets the default plugins for component config profiles. Choose one of: ClusterAutoscalerProvider | DefaultProvider</p></td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The map from metric-label to value allow-list of this label. The key's format is <!-- raw HTML omitted -->,<!-- raw HTML omitted -->. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error as well as files</p></td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache responses from the webhook token authenticator.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'authorized' responses from the webhook authorizer.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'unauthorized' responses from the webhook authorizer.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.</p></td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</p></td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the configuration file. The following flags can overwrite fields in this file:<br/>--algorithm-provider<br/>--policy-config-file<br/>--policy-configmap<br/>--policy-configmap-namespace</p></td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: enable lock contention profiling, if profiling is enabled. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.</p></td>
</tr>

<tr>
<td colspan="2">--experimental-logging-sanitization</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Experimental] When enabled prevents logging of fields tagged as sensitive (passwords, keys, tokens).<br/>Runtime log sanitization may introduce significant computation overhead and therefore should not be enabled in production.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (BETA - default=true)<br/>CPUManager=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>CSIMigrationAzureFile=true|false (BETA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=true)<br/>CSIMigrationvSphere=true|false (BETA - default=false)<br/>CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>CSIServiceAccountToken=true|false (BETA - default=true)<br/>CSIStorageCapacity=true|false (BETA - default=true)<br/>CSIVolumeFSGroupPolicy=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (BETA - default=true)<br/>ControllerManagerLeaderMigration=true|false (ALPHA - default=false)<br/>CronJobControllerV2=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DaemonSetUpdateSurge=true|false (ALPHA - default=false)<br/>DefaultPodTopologySpread=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>DownwardAPIHugePages=true|false (BETA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EfficientWatchResumption=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (BETA - default=true)<br/>EndpointSliceTerminatingCondition=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GenericEphemeralVolume=true|false (BETA - default=true)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (BETA - default=true)<br/>IPv6DualStack=true|false (BETA - default=true)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>IndexedJob=true|false (ALPHA - default=false)<br/>IngressClassNamespacedParams=true|false (ALPHA - default=false)<br/>KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesGetAllocatable=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (ALPHA - default=false)<br/>MixedProtocolLBService=true|false (ALPHA - default=false)<br/>NamespaceDefaultLabelName=true|false (BETA - default=true)<br/>NetworkPolicyEndPort=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (BETA - default=true)<br/>PodAffinityNamespaceSelector=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (BETA - default=true)<br/>PreferNominatedNode=true|false (ALPHA - default=false)<br/>ProbeTerminationGracePeriod=true|false (ALPHA - default=false)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceInternalTrafficPolicy=true|false (ALPHA - default=false)<br/>ServiceLBNodePortControl=true|false (ALPHA - default=false)<br/>ServiceLoadBalancerClass=true|false (ALPHA - default=false)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>SetHostnameAsFQDN=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (ALPHA - default=false)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SuspendJob=true|false (ALPHA - default=false)<br/>TTLAfterFinished=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (ALPHA - default=false)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WarningHeaders=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsEndpointSliceProxying=true|false (BETA - default=true)</p></td>
</tr>

<tr>
<td colspan="2">--hard-pod-affinity-symmetric-weight int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: RequiredDuringScheduling affinity is not symmetric, but there is an implicit PreferredDuringScheduling affinity rule corresponding to every RequiredDuringScheduling affinity rule. --hard-pod-affinity-symmetric-weight represents the weight of implicit PreferredDuringScheduling affinity rule. Must be in the range 0-100.This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kube-scheduler</p></td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: burst to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: content type of requests sent to apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: QPS to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: path to kubeconfig file with authorization and master location information. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The type of resource object that is used for locking during leader election. Supported options are 'endpoints', 'configmaps', 'leases', 'endpointsleases' and 'configmapsleases'.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The name of resource object that is used for locking during leader election.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The namespace of resource object that is used for locking during leader election.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: define the name of the lock object. Will be removed in favor of leader-elect-resource-name. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: define the namespace of the lock object. Will be removed in favor of leader-elect-resource-namespace. This parameter is ignored if a config file is specified in --config.</p></td>
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
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Sets the log format. Permitted formats: &quot;json&quot;, &quot;text&quot;.<br/>Non-default formats don't honor these flags: --add-dir-header, --alsologtostderr, --log-backtrace-at, --log-dir, --log-file, --log-file-max-size, --logtostderr, --one-output, --skip-headers, --skip-log-headers, --stderrthreshold, --vmodule, --log-flush-frequency.<br/>Non-default choices are currently alpha and subject to change without warning.</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error instead of files</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The address of the Kubernetes API server (overrides any value in kubeconfig)</p></td>
</tr>

<tr>
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, only write logs to their native severity level (vs also writing to each lower severity level)</p></td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]</p></td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port. [default=false]</p></td>
</tr>

<tr>
<td colspan="2">--policy-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: file with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config=true. Note: The scheduler will fail if this is combined with Plugin configs</p></td>
</tr>

<tr>
<td colspan="2">--policy-configmap string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config=false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'. Note: The scheduler will fail if this is combined with Plugin configs</p></td>
</tr>

<tr>
<td colspan="2">--policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the namespace where policy ConfigMap is located. The kube-system namespace will be used if this is not provided or is empty. Note: The scheduler will fail if this is combined with Plugin configs</p></td>
</tr>

<tr>
<td colspan="2">--port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10251</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve plain HTTP at all. See --secure-port instead. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: enable profiling via web interface host:port/debug/pprof/. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request header prefixes to inspect. X-Remote-Extra- is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-group"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for groups. X-Remote-Group is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for usernames. X-Remote-User is common.</p></td>
</tr>

<tr>
<td colspan="2">--scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's &quot;spec.schedulerName&quot;. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.</p></td>
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
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</p></td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.</p></td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</p></td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File containing the default x509 private key matching --tls-cert-file.</p></td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: &quot;example.crt,example.key&quot; or &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.</p></td>
</tr>

<tr>
<td colspan="2">--use-legacy-policy-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: when set to true, scheduler will ignore policy ConfigMap and uses policy config file. Note: The scheduler will fail if this is combined with Plugin configs</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



