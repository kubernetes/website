---
title: cloud-controller-manager
content_template: templates/tool-reference
weight: 28
---

{{% capture synopsis %}}


The Cloud controller manager is a daemon that embeds
the cloud specific control loops shipped with Kubernetes.

```
cloud-controller-manager [flags]
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
      <td colspan="2">--add-dir-header</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, adds the file directory to the header</td>
    </tr>

    <tr>
      <td colspan="2">--allocate-node-cidrs</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Should CIDRs for Pods be allocated and set on the cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenaccessreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-skip-lookup</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache responses from the webhook token authenticator.</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-tolerate-lookup-failure</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [/healthz]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'authorized' responses from the webhook authorizer.</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'unauthorized' responses from the webhook authorizer.</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces).</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</td>
    </tr>

    <tr>
      <td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "RangeAllocator"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Type of CIDR allocator to use</td>
    </tr>

    <tr>
      <td colspan="2">--client-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the cloud provider configuration file. Empty string for no configuration file.</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The provider for cloud services. Empty string for no provider.</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for LB traffic proxy & health checks</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDR Range for Pods in cluster. Requires --allocate-node-cidrs to be true</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The instance prefix for the cluster.</td>
    </tr>

    <tr>
      <td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load</td>
    </tr>

    <tr>
      <td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable lock contention profiling, if profiling is enabled</td>
    </tr>

    <tr>
      <td colspan="2">--controller-start-interval duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between starting controller managers.</td>
    </tr>

    <tr>
      <td colspan="2">--controllers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [*]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of controllers to enable. '*' enables all on-by-default controllers, 'foo' enables the controller named 'foo', '-foo' disables the controller named 'foo'.<br/>All controllers: cloud-node, cloud-node-lifecycle, route, service<br/>Disabled-by-default controllers: </td>
    </tr>

    <tr>
      <td colspan="2">--external-cloud-volume-plugin string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The plugin to use when cloud provider is set to external. Can be empty, should only be set when cloud-provider is external. Currently used to allow node and volume controllers to work for in tree cloud providers.</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (BETA - default=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (BETA - default=true)<br/>CSIDriverRegistry=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (ALPHA - default=false)<br/>CSIMigrationAWS=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceDefaulting=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NodeLease=true|false (BETA - default=true)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (ALPHA - default=false)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>RequestManagement=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (BETA - default=true)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (ALPHA - default=false)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumePVCDataSource=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - default=true)<br/>WatchBookmark=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)<br/>WindowsGMSA=true|false (BETA - default=true)<br/>WindowsRunAsUserName=true|false (ALPHA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for cloud-controller-manager</td>
    </tr>

    <tr>
      <td colspan="2">--http2-max-streams-per-connection int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 20</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes apiserver.</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeconfig file with authorization and master location information.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "endpoints"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cloud-controller-manager"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of resource object that is used for locking during leader election.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The namespace of resource object that is used for locking during leader election.</td>
    </tr>

    <tr>
      <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.</td>
    </tr>

    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">when logging hits line file:N, emit a stack trace</td>
    </tr>

    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td>
    </tr>

    <tr>
      <td colspan="2">--log-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, use this log file</td>
    </tr>

    <tr>
      <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    </tr>

    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address of the Kubernetes API server (overrides any value in kubeconfig).</td>
    </tr>

    <tr>
      <td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 12h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod.</td>
    </tr>

    <tr>
      <td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The period for syncing NodeStatus in NodeController.</td>
    </tr>

    <tr>
      <td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies how often the controller updates nodes' status.</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable profiling via web interface host:port/debug/pprof/</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-allowed-names stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-client-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-extra-]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request header prefixes to inspect. X-Remote-Extra- is suggested.</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-group]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request headers to inspect for groups. X-Remote-Group is suggested.</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-user]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request headers to inspect for usernames. X-Remote-User is common.</td>
    </tr>

    <tr>
      <td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The period for reconciling routes created for Nodes by cloud provider.</td>
    </tr>

    <tr>
      <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10258</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port on which to serve HTTPS with authentication and authorization.If 0, don't serve HTTPS at all.</td>
    </tr>

    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid header prefixes in the log messages</td>
    </tr>

    <tr>
      <td colspan="2">--skip-log-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid headers when opening log files</td>
    </tr>

    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td>
    </tr>

    <tr>
      <td colspan="2">--tls-cert-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</td>
    </tr>

    <tr>
      <td colspan="2">--tls-cipher-suites stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be use.  Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA</td>
    </tr>

    <tr>
      <td colspan="2">--tls-min-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</td>
    </tr>

    <tr>
      <td colspan="2">--tls-private-key-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 private key matching --tls-cert-file.</td>
    </tr>

    <tr>
      <td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".</td>
    </tr>

    <tr>
      <td colspan="2">--use-service-account-credentials</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, use individual service account credentials for each controller.</td>
    </tr>

    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">number for the log level verbosity</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    </tr>

    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td>
    </tr>

  </tbody>
</table>



{{% /capture %}}

