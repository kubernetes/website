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
<td colspan="2">--allow-dynamic-housekeeping&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to allow the housekeeping interval to be dynamic</p></td>
</tr>

<tr>
<td colspan="2">--allow_dynamic_housekeeping&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to allow the housekeeping interval to be dynamic</p></td>
</tr>

<tr>
<td colspan="2">--application-metrics-count-limit int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max number of application metrics to store (per container)</p></td>
</tr>

<tr>
<td colspan="2">--application_metrics_count_limit int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max number of application metrics to store (per container)</p></td>
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
<td colspan="2">--boot_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/proc/sys/kernel/random/boot_id"</td>
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
<td colspan="2">--container-hints string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/cadvisor/container_hints.json"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>location of the container hints file</p></td>
</tr>

<tr>
<td colspan="2">--container_hints string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/cadvisor/container_hints.json"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>location of the container hints file</p></td>
</tr>

<tr>
<td colspan="2">--containerd string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/run/containerd/containerd.sock"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>containerd endpoint</p></td>
</tr>

<tr>
<td colspan="2">--containerd-env-metadata-whitelist env_metadata_whitelist</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: this flag will be removed, please use env_metadata_whitelist. A comma-separated list of environment variable keys matched with specified prefix that needs to be collected for containerd containers</p></td>
</tr>

<tr>
<td colspan="2">--containerd-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>containerd namespace</p></td>
</tr>

<tr>
<td colspan="2">--containerd_env_metadata_whitelist env_metadata_whitelist</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: this flag will be removed, please use env_metadata_whitelist. A comma-separated list of environment variable keys matched with specified prefix that needs to be collected for containerd containers</p></td>
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
<td colspan="2">--disable-root-cgroup-stats</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Disable collecting root Cgroup stats</p></td>
</tr>

<tr>
<td colspan="2">--disable_root_cgroup_stats</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Disable collecting root Cgroup stats</p></td>
</tr>

<tr>
<td colspan="2">--docker string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "unix:///var/run/docker.sock"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>docker endpoint</p></td>
</tr>

<tr>
<td colspan="2">--docker-env-metadata-whitelist env_metadata_whitelist</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: this flag will be removed, please use env_metadata_whitelist. A comma-separated list of environment variable keys matched with specified prefix that needs to be collected for docker containers</p></td>
</tr>

<tr>
<td colspan="2">--docker-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Only report docker containers in addition to root stats</p></td>
</tr>

<tr>
<td colspan="2">--docker-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/lib/docker"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: docker root is read from docker info (this is a fallback, default: /var/lib/docker)</p></td>
</tr>

<tr>
<td colspan="2">--docker-tls</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>use TLS to connect to docker</p></td>
</tr>

<tr>
<td colspan="2">--docker-tls-ca string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "ca.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>path to trusted CA</p></td>
</tr>

<tr>
<td colspan="2">--docker-tls-cert string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cert.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>path to client certificate</p></td>
</tr>

<tr>
<td colspan="2">--docker-tls-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "key.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>path to private key</p></td>
</tr>

<tr>
<td colspan="2">--docker_env_metadata_whitelist env_metadata_whitelist</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: this flag will be removed, please use env_metadata_whitelist. A comma-separated list of environment variable keys matched with specified prefix that needs to be collected for docker containers</p></td>
</tr>

<tr>
<td colspan="2">--docker_only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Only report docker containers in addition to root stats</p></td>
</tr>

<tr>
<td colspan="2">--docker_root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/lib/docker"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: docker root is read from docker info (this is a fallback, default: /var/lib/docker)</p></td>
</tr>

<tr>
<td colspan="2">--enable-load-reader</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to enable cpu load reader</p></td>
</tr>

<tr>
<td colspan="2">--enable_load_reader</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to enable cpu load reader</p></td>
</tr>

<tr>
<td colspan="2">--event-storage-age-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max length of time for which to store events (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or &quot;default&quot; and the value is a duration. Default is applied to all non-specified event types</p></td>
</tr>

<tr>
<td colspan="2">--event-storage-event-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max number of events to store (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or &quot;default&quot; and the value is an integer. Default is applied to all non-specified event types</p></td>
</tr>

<tr>
<td colspan="2">--event_storage_age_limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max length of time for which to store events (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or &quot;default&quot; and the value is a duration. Default is applied to all non-specified event types</p></td>
</tr>

<tr>
<td colspan="2">--event_storage_event_limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Max number of events to store (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or &quot;default&quot; and the value is an integer. Default is applied to all non-specified event types</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (ALPHA - default=false)<br/>APIServerTracing=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>CPUManager=true|false (BETA - default=true)<br/>CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=true)<br/>CSIMigrationAzureDisk=true|false (BETA - default=true)<br/>CSIMigrationAzureFile=true|false (BETA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=true)<br/>CSIMigrationOpenStack=true|false (BETA - default=true)<br/>CSIMigrationPortworx=true|false (ALPHA - default=false)<br/>CSIMigrationvSphere=true|false (BETA - default=false)<br/>CSIStorageCapacity=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>CSRDuration=true|false (BETA - default=true)<br/>ControllerManagerLeaderMigration=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceValidationExpressions=true|false (ALPHA - default=false)<br/>DaemonSetUpdateSurge=true|false (BETA - default=true)<br/>DefaultPodTopologySpread=true|false (BETA - default=true)<br/>DelegateFSGroupToCSIDriver=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>DisableCloudProviders=true|false (ALPHA - default=false)<br/>DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>DownwardAPIHugePages=true|false (BETA - default=true)<br/>EfficientWatchResumption=true|false (BETA - default=true)<br/>EndpointSliceTerminatingCondition=true|false (BETA - default=true)<br/>EphemeralContainers=true|false (BETA - default=true)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExpandedDNSConfig=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GRPCContainerProbe=true|false (ALPHA - default=false)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>GracefulNodeShutdownBasedOnPodPriority=true|false (ALPHA - default=false)<br/>HPAContainerMetrics=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>IdentifyPodOS=true|false (ALPHA - default=false)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>IndexedJob=true|false (BETA - default=true)<br/>JobMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>JobReadyPods=true|false (ALPHA - default=false)<br/>JobTrackingWithFinalizers=true|false (BETA - default=true)<br/>KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (BETA - default=true)<br/>MemoryManager=true|false (BETA - default=true)<br/>MemoryQoS=true|false (ALPHA - default=false)<br/>MixedProtocolLBService=true|false (ALPHA - default=false)<br/>NetworkPolicyEndPort=true|false (BETA - default=true)<br/>NodeSwap=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (BETA - default=true)<br/>OpenAPIEnums=true|false (ALPHA - default=false)<br/>OpenAPIV3=true|false (ALPHA - default=false)<br/>PodAffinityNamespaceSelector=true|false (BETA - default=true)<br/>PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (BETA - default=true)<br/>PodOverhead=true|false (BETA - default=true)<br/>PodSecurity=true|false (BETA - default=true)<br/>PreferNominatedNode=true|false (BETA - default=true)<br/>ProbeTerminationGracePeriod=true|false (BETA - default=false)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>ProxyTerminatingEndpoints=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ReadWriteOncePod=true|false (ALPHA - default=false)<br/>RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>SeccompDefault=true|false (ALPHA - default=false)<br/>ServerSideFieldValidation=true|false (ALPHA - default=false)<br/>ServiceInternalTrafficPolicy=true|false (BETA - default=true)<br/>ServiceLBNodePortControl=true|false (BETA - default=true)<br/>ServiceLoadBalancerClass=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>StatefulSetMinReadySeconds=true|false (BETA - default=true)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SuspendJob=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (BETA - default=false)<br/>TopologyManager=true|false (BETA - default=true)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsHostProcessContainers=true|false (BETA - default=true)<br/>csiMigrationRBD=true|false (ALPHA - default=false)</p></td>
</tr>

<tr>
<td colspan="2">--global-housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between global housekeepings</p></td>
</tr>

<tr>
<td colspan="2">--global_housekeeping_interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between global housekeepings</p></td>
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
<td colspan="2">--housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between container housekeepings</p></td>
</tr>

<tr>
<td colspan="2">--housekeeping_interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between container housekeepings</p></td>
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
<td colspan="2">--log-cadvisor-usage</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to log the usage of the cAdvisor container</p></td>
</tr>

<tr>
<td colspan="2">--log_cadvisor_usage</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether to log the usage of the cAdvisor container</p></td>
</tr>

<tr>
<td colspan="2">--machine-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of files to check for machine-id. Use the first one that exists.</p></td>
</tr>

<tr>
<td colspan="2">--machine_id_file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
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
<td colspan="2">--max-housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Largest interval to allow between container housekeepings</p></td>
</tr>

<tr>
<td colspan="2">--max_housekeeping_interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Largest interval to allow between container housekeepings</p></td>
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
<td colspan="2">--referenced-reset-interval uint</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Reset interval for referenced bytes (container_referenced_bytes metric), number of measurement cycles after which referenced bytes are cleared, if set to 0 referenced bytes are never cleared (default: 0)</p></td>
</tr>

<tr>
<td colspan="2">--referenced_reset_interval uint</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Reset interval for referenced bytes (container_referenced_bytes metric), number of measurement cycles after which referenced bytes are cleared, if set to 0 referenced bytes are never cleared (default: 0)</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database name</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database host:port</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database password</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>use secure connection with database</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>table name</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database username</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_buffer_duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database name</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database host:port</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database password</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>use secure connection with database</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>table name</p></td>
</tr>

<tr>
<td colspan="2">--storage_driver_user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>database username</p></td>
</tr>

<tr>
<td colspan="2">--udp-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 250ms</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace</p></td>
</tr>

<tr>
<td colspan="2">--update-machine-info-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between machine info updates.</p></td>
</tr>

<tr>
<td colspan="2">--update_machine_info_interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Interval between machine info updates.</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Print version information and quit</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the default configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



