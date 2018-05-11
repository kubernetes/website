---
title: kube-apiserver
notitle: true
weight: 40
---
## kube-apiserver

### Synopsis

The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```
kube-apiserver [flags]
```

### Options

<table style="width: 100%;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>
    <tr>
      <td colspan="2">--admission-control-config-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File with admission control configuration.</td>
    </tr>
    <tr>
      <td colspan="2">--advertise-address ip</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.</td>
    </tr>
    <tr>
      <td colspan="2">--allow-privileged</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true, allow privileged containers. [default=false]</td>
    </tr>
    <tr>
      <td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated.</td>
    </tr>
    <tr>
      <td colspan="2">--apiserver-count int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The number of apiservers running in the cluster, must be a positive number.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The size of the buffer to store events before batching and writing. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum size of a batch. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-throttle-enable</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Whether batching throttling is enabled. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum average number of batches per second. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "json"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Format of saved audits. "legacy" indicates 1-line text format for each event. "json" indicates structured json format. Requires the 'AdvancedAuditing' feature gate. Known formats are legacy,json.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-maxage int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-maxbackup int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum number of old audit log files to retain.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-maxsize int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum size in megabytes of the audit log file before it gets rotated.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "blocking"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-log-path string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-policy-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file that defines the audit policy configuration. Requires the 'AdvancedAuditing' feature gate. With AdvancedAuditing, a profile is required to enable auditing.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The size of the buffer to store events before batching and writing. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum size of a batch. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Whether batching throttling is enabled. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum average number of batches per second. Only used in batch mode.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-config-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to a kubeconfig formatted file that defines the audit webhook configuration. Requires the 'AdvancedAuditing' feature gate.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The amount of time to wait before retrying the first failed request.</td>
    </tr>
    <tr>
      <td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "batch"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking.</td>
    </tr>
    <tr>
      <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration to cache responses from the webhook token authenticator.</td>
    </tr>
    <tr>
      <td colspan="2">--authentication-token-webhook-config-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.</td>
    </tr>
    <tr>
      <td colspan="2">--authorization-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "AlwaysAllow"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.</td>
    </tr>
    <tr>
      <td colspan="2">--authorization-policy-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File with authorization policy in csv format, used with --authorization-mode=ABAC, on the secure port.</td>
    </tr>
    <tr>
      <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration to cache 'authorized' responses from the webhook authorizer.</td>
    </tr>
    <tr>
      <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The duration to cache 'unauthorized' responses from the webhook authorizer.</td>
    </tr>
    <tr>
      <td colspan="2">--authorization-webhook-config-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.</td>
    </tr>
    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file containing Azure container registry configuration information.</td>
    </tr>
    <tr>
      <td colspan="2">--basic-auth-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, the file that will be used to admit requests to the secure port of the API server via http basic authentication.</td>
    </tr>
    <tr>
      <td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces).</td>
    </tr>
    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</td>
    </tr>
    <tr>
      <td colspan="2">--client-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</td>
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
      <td></td><td style="line-height: 130%">The provider for cloud services. Empty string for no provider.</td>
    </tr>
    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable lock contention profiling, if profiling is enabled</td>
    </tr>
    <tr>
      <td colspan="2">--cors-allowed-origins stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.</td>
    </tr>
    <tr>
      <td colspan="2">--default-watch-cache-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Default watch cache size. If zero, watch cache will be disabled for resources that do not have a default watch size set.</td>
    </tr>
    <tr>
      <td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.</td>
    </tr>
    <tr>
      <td colspan="2">--deserialization-cache-size int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Number of deserialized json objects to cache in memory.</td>
    </tr>
    <tr>
      <td colspan="2">--disable-admission-plugins stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">admission plugins that should be disabled although they are in the default enabled plugins list. Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, DefaultStorageClass, DefaultTolerationSeconds, DenyEscalatingExec, DenyExecOnPrivileged, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, InitialResources, Initializers, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodPreset, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-admission-plugins stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">admission plugins that should be enabled in addition to default enabled ones. Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, DefaultStorageClass, DefaultTolerationSeconds, DenyEscalatingExec, DenyExecOnPrivileged, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, InitialResources, Initializers, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodPreset, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-aggregator-routing</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Turns on aggregator routing requests to endoints IP rather than cluster IP.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-bootstrap-token-auth</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-logs-handler&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true, install a /logs handler for the apiserver logs.</td>
    </tr>
    <tr>
      <td colspan="2">--enable-swagger-ui</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enables swagger ui on the apiserver at /swagger-ui</td>
    </tr>
    <tr>
      <td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "master-count"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Use an endpoint reconciler (master-count, lease, none)</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-cafile string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">SSL Certificate Authority file used to secure etcd communication.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-certfile string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">SSL certification file used to secure etcd communication.</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The interval of compaction requests. If 0, the compaction request from apiserver is disabled.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Frequency of polling etcd for number of resources per type. 0 disables the metric collection.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-keyfile string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">SSL key file used to secure etcd communication.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/registry"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The prefix to prepend to all resource paths in etcd.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-servers stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of etcd servers to connect with (scheme://ip:port), comma separated.</td>
    </tr>
    <tr>
      <td colspan="2">--etcd-servers-overrides stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are http://ip:port, semicolon separated.</td>
    </tr>
    <tr>
      <td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Amount of time to retain events.</td>
    </tr>
    <tr>
      <td colspan="2">--experimental-encryption-provider-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The file containing configuration for encryption providers to be used for storing secrets in etcd</td>
    </tr>
    <tr>
      <td colspan="2">--external-hostname string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs).</td>
    </tr>
    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>Accelerators=true|false (ALPHA - default=false)<br/>AdvancedAuditing=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (ALPHA - default=false)<br/>CSIPersistentVolume=true|false (BETA - default=true)<br/>CustomPodDNS=true|false (BETA - default=true)<br/>CustomResourceSubresources=true|false (ALPHA - default=false)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DynamicKubeletConfig=true|false (ALPHA - default=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (ALPHA - default=false)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GCERegionalPersistentDisk=true|false (BETA - default=true)<br/>HugePages=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>Initializers=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - default=false)<br/>MountPropagation=true|false (BETA - default=true)<br/>PersistentLocalVolumes=true|false (BETA - default=true)<br/>PodPriority=true|false (ALPHA - default=false)<br/>PodShareProcessNamespace=true|false (ALPHA - default=false)<br/>ReadOnlyAPIDataVolumes=true|false (DEPRECATED - default=true)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - default=false)<br/>RunAsGroup=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)<br/>StorageObjectInUseProtection=true|false (BETA - default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportIPVSProxyMode=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (ALPHA - default=false)<br/>VolumeScheduling=true|false (BETA - default=true)<br/>VolumeSubpath=true|false (default=true)</td>
    </tr>
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">help for kube-apiserver</td>
    </tr>
    <tr>
      <td colspan="2">--http2-max-streams-per-connection int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-certificate-authority string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to a cert file for the certificate authority.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-client-certificate string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to a client cert file for TLS.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-client-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to a client key file for TLS.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-https&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Use https for kubelet connections.</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-preferred-address-types stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of the preferred NodeAddressTypes to use for kubelet connections.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-read-only-port uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10255</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">DEPRECATED: kubelet port.</td>
    </tr>
    <tr>
      <td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Timeout for kubelet operations.</td>
    </tr>
    <tr>
      <td colspan="2">--kubernetes-service-node-port int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If non-zero, the Kubernetes master service (which apiserver creates/maintains) will be of type NodePort, using this as the value of the port. If zero, the Kubernetes master service will be of type ClusterIP.</td>
    </tr>
    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Maximum number of seconds between log flushes</td>
    </tr>
    <tr>
      <td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">DEPRECATED: the namespace from which the kubernetes master services should be injected into pods.</td>
    </tr>
    <tr>
      <td colspan="2">--max-connection-bytes-per-sec int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If non-zero, throttle each user connection to this number of bytes/sec. Currently only applies to long-running requests.</td>
    </tr>
    <tr>
      <td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 200</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</td>
    </tr>
    <tr>
      <td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</td>
    </tr>
    <tr>
      <td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-client-id string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-groups-claim string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-groups-prefix string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If provided, all groups will be prefixed with this value to prevent conflicts with other authentication strategies.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-issuer-url string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-signing-algs stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [RS256]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Comma-separated list of allowed JOSE asymmetric signing algorithms. JWTs with a 'alg' header value not in this list will be rejected. Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "sub"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details.</td>
    </tr>
    <tr>
      <td colspan="2">--oidc-username-prefix string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If provided, all usernames will be prefixed with this value. If not provided, username claims other than 'email' are prefixed by the issuer URL to avoid clashes. To skip any prefixing, provide the value '-'.</td>
    </tr>
    <tr>
      <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable profiling via web interface host:port/debug/pprof/</td>
    </tr>
    <tr>
      <td colspan="2">--proxy-client-cert-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins. It is expected that this cert includes a signature from the CA in the --requestheader-client-ca-file flag. That CA is published in the 'extension-apiserver-authentication' configmap in the kube-system namespace. Components receiving calls from kube-aggregator should use that CA to perform their half of the mutual TLS verification.</td>
    </tr>
    <tr>
      <td colspan="2">--proxy-client-key-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Private key for the client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins.</td>
    </tr>
    <tr>
      <td colspan="2">--repair-malformed-updates&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true, server will do its best to fix the update request to pass the validation, e.g., setting empty UID in update request to its existing value. This flag can be turned off after we fix all the clients that send malformed updates.</td>
    </tr>
    <tr>
      <td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">An optional field indicating the duration a handler must keep a request open before timing it out. This is the default request timeout for requests but may be overridden by flags such as --min-request-timeout for specific types of requests.</td>
    </tr>
    <tr>
      <td colspan="2">--requestheader-allowed-names stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</td>
    </tr>
    <tr>
      <td colspan="2">--requestheader-client-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers</td>
    </tr>
    <tr>
      <td colspan="2">--requestheader-extra-headers-prefix stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of request header prefixes to inspect. X-Remote-Extra- is suggested.</td>
    </tr>
    <tr>
      <td colspan="2">--requestheader-group-headers stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of request headers to inspect for groups. X-Remote-Group is suggested.</td>
    </tr>
    <tr>
      <td colspan="2">--requestheader-username-headers stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of request headers to inspect for usernames. X-Remote-User is common.</td>
    </tr>
    <tr>
      <td colspan="2">--runtime-config mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A set of key=value pairs that describe runtime configuration that may be passed to apiserver. &lt;group&gt;/&lt;version&gt; (or &lt;version&gt; for the core group) key can be used to turn on/off specific api versions. &lt;group&gt;/&lt;version&gt;/&lt;resource&gt; (or &lt;version&gt;/&lt;resource&gt; for the core group) can be used to turn on/off specific resources. api/all and api/legacy are special keys to control all and legacy api versions respectively.</td>
    </tr>
    <tr>
      <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.</td>
    </tr>
    <tr>
      <td colspan="2">--service-account-api-audiences stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Identifiers of the API. The service account token authenticator will validate that tokens used against the API are bound to at least one of these audiences.</td>
    </tr>
    <tr>
      <td colspan="2">--service-account-issuer string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Identifier of the service account token issuer. The issuer will assert this identifier in "iss" claim of issued tokens. This value is a string or URI.</td>
    </tr>
    <tr>
      <td colspan="2">--service-account-key-file stringArray</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. The specified file can contain multiple keys, and the flag can be specified multiple times with different files. If unspecified, --tls-private-key-file is used. Must be specified when --service-account-signing-key is provided</td>
    </tr>
    <tr>
      <td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If true, validate ServiceAccount tokens exist in etcd as part of authentication.</td>
    </tr>
    <tr>
      <td colspan="2">--service-account-signing-key-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Path to the file that contains the current private key of the service account token issuer. The issuer will sign issued ID tokens with this private key. (Ignored unless alpha TokenRequest is enabled</td>
    </tr>
    <tr>
      <td colspan="2">--service-cluster-ip-range ipNet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10.0.0.0/24</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A CIDR notation IP range from which to assign service cluster IPs. This must not overlap with any IP ranges assigned to nodes for pods.</td>
    </tr>
    <tr>
      <td colspan="2">--service-node-port-range portRange&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30000-32767</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A port range to reserve for services with NodePort visibility. Example: '30000-32767'. Inclusive at both ends of the range.</td>
    </tr>
    <tr>
      <td colspan="2">--storage-backend string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The storage backend for persistence. Options: 'etcd3' (default), 'etcd2'.</td>
    </tr>
    <tr>
      <td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting.</td>
    </tr>
    <tr>
      <td colspan="2">--storage-versions string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "admission.k8s.io/v1beta1,<br />admissionregistration.k8s.io/v1beta1,<br />apps/v1,<br />authentication.k8s.io/v1,<br />authorization.k8s.io/v1,<br />autoscaling/v1,<br />batch/v1,<br />certificates.k8s.io/v1beta1,<br />componentconfig/v1alpha1,<br />events.k8s.io/v1beta1,<br />extensions/v1beta1,<br />imagepolicy.k8s.io/v1alpha1,<br />kubeadm.k8s.io/v1alpha1,<br />networking.k8s.io/v1,<br />policy/v1beta1,<br />rbac.authorization.k8s.io/v1,<br />scheduling.k8s.io/v1alpha1,<br />settings.k8s.io/v1alpha1,<br />storage.k8s.io/v1,<br />v1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">The per-group version to store resources in. Specified in the format "group1/version1,group2/version2,...". In the case where objects are moved from one group to the other, you may specify the format "group1=group2/v1beta1,group3/v1beta1,...". You only need to pass the groups you wish to change from the defaults. It defaults to a list of preferred versions of all registered groups, which is derived from the KUBE_API_VERSIONS environment variable.</td>
    </tr>
    <tr>
      <td colspan="2">--target-ram-mb int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Memory limit for apiserver in MB (used to configure sizes of caches, etc.)</td>
    </tr>
    <tr>
      <td colspan="2">--tls-cert-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</td>
    </tr>
    <tr>
      <td colspan="2">--tls-cipher-suites stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Comma-separated list of cipher suites for the server. Values are from tls package constants (https://golang.org/pkg/crypto/tls/#pkg-constants). If omitted, the default Go cipher suites will be used</td>
    </tr>
    <tr>
      <td colspan="2">--tls-min-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Minimum TLS version supported. Value must match version names from https://golang.org/pkg/crypto/tls/#pkg-constants.</td>
    </tr>
    <tr>
      <td colspan="2">--tls-private-key-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">File containing the default x509 private key matching --tls-cert-file.</td>
    </tr>
    <tr>
      <td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".</td>
    </tr>
    <tr>
      <td colspan="2">--token-auth-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">If set, the file that will be used to secure the secure port of the API server via token authentication.</td>
    </tr>
    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Print version information and quit</td>
    </tr>
    <tr>
      <td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">Enable watch caching in the apiserver</td>
    </tr>
    <tr>
      <td colspan="2">--watch-cache-sizes stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%">List of watch cache sizes for every resource (pods, nodes, etc.), comma separated. The individual override format: resource[.group]#size, where resource is lowercase plural (no version), group is optional, and size is a number. It takes effect when watch-cache is enabled. Some resources (replicationcontrollers, endpoints, nodes, pods, services, apiservices.apiregistration.k8s.io) have system defaults set by heuristics, others default to default-watch-cache-size</td>
    </tr>
  </tbody>
</table>
