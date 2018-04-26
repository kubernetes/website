---
title: cloud-controller-manager
notitle: true
---
## cloud-controller-manager



### Synopsis

The Cloud controller manager is a daemon that embeds
the cloud specific control loops shipped with Kubernetes.

```
cloud-controller-manager [flags]
```

### Options

```
      --address ip                               DEPRECATED: the IP address on which to listen for the --port port. See --bind-address instead. (default 0.0.0.0)
      --allocate-node-cidrs                      Should CIDRs for Pods be allocated and set on the cloud provider.
      --azure-container-registry-config string   Path to the file containing Azure container registry configuration information.
      --bind-address ip                          The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces). (default 0.0.0.0)
      --cert-dir string                          The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/run/kubernetes")
      --cidr-allocator-type string               Type of CIDR allocator to use (default "RangeAllocator")
      --cloud-config string                      The path to the cloud provider configuration file. Empty string for no configuration file.
      --cloud-provider string                    The provider of cloud services. Cannot be empty.
      --cluster-cidr string                      CIDR Range for Pods in cluster. Requires --allocate-node-cidrs to be true
      --cluster-name string                      The instance prefix for the cluster. (default "kubernetes")
      --concurrent-service-syncs int32           The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load (default 1)
      --configure-cloud-routes                   Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider. (default true)
      --contention-profiling                     Enable lock contention profiling, if profiling is enabled.
      --controller-start-interval duration       Interval between starting controller managers.
      --feature-gates mapStringBool              A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
APIListChunking=true|false (BETA - default=true)
APIResponseCompression=true|false (ALPHA - default=false)
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (BETA - default=true)
AllAlpha=true|false (ALPHA - default=false)
AppArmor=true|false (BETA - default=true)
BlockVolume=true|false (ALPHA - default=false)
CPUManager=true|false (BETA - default=true)
CRIContainerLogRotation=true|false (ALPHA - default=false)
CSIPersistentVolume=true|false (BETA - default=true)
CustomPodDNS=true|false (BETA - default=true)
CustomResourceSubresources=true|false (ALPHA - default=false)
CustomResourceValidation=true|false (BETA - default=true)
DebugContainers=true|false (ALPHA - default=false)
DevicePlugins=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
EnableEquivalenceClassCache=true|false (ALPHA - default=false)
ExpandPersistentVolumes=true|false (ALPHA - default=false)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
GCERegionalPersistentDisk=true|false (BETA - default=true)
HugePages=true|false (BETA - default=true)
HyperVContainer=true|false (ALPHA - default=false)
Initializers=true|false (ALPHA - default=false)
LocalStorageCapacityIsolation=true|false (BETA - default=true)
MountContainers=true|false (ALPHA - default=false)
MountPropagation=true|false (BETA - default=true)
PersistentLocalVolumes=true|false (BETA - default=true)
PodPriority=true|false (ALPHA - default=false)
PodShareProcessNamespace=true|false (ALPHA - default=false)
ReadOnlyAPIDataVolumes=true|false (DEPRECATED - default=true)
ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (BETA - default=true)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
RunAsGroup=true|false (ALPHA - default=false)
ScheduleDaemonSetPods=true|false (ALPHA - default=false)
ServiceNodeExclusion=true|false (ALPHA - default=false)
ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)
StorageObjectInUseProtection=true|false (BETA - default=true)
StreamingProxyRedirects=true|false (BETA - default=true)
SupportIPVSProxyMode=true|false (BETA - default=true)
SupportPodPidsLimit=true|false (ALPHA - default=false)
TaintBasedEvictions=true|false (ALPHA - default=false)
TaintNodesByCondition=true|false (ALPHA - default=false)
TokenRequest=true|false (ALPHA - default=false)
VolumeScheduling=true|false (BETA - default=true)
VolumeSubpath=true|false (default=true)
  -h, --help                                     help for cloud-controller-manager
      --http2-max-streams-per-connection int     The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.
      --kube-api-burst int32                     Burst to use while talking with kubernetes apiserver. (default 30)
      --kube-api-content-type string             Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")
      --kube-api-qps float32                     QPS to use while talking with kubernetes apiserver. (default 20)
      --kubeconfig string                        Path to kubeconfig file with authorization and master location information.
      --leader-elect                             Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability. (default true)
      --leader-elect-lease-duration duration     The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 15s)
      --leader-elect-renew-deadline duration     The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 10s)
      --leader-elect-resource-lock endpoints     The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`. (default "endpoints")
      --leader-elect-retry-period duration       The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 2s)
      --log-flush-frequency duration             Maximum number of seconds between log flushes (default 5s)
      --master string                            The address of the Kubernetes API server (overrides any value in kubeconfig).
      --min-resync-period duration               The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod. (default 12h0m0s)
      --node-monitor-period duration             The period for syncing NodeStatus in NodeController. (default 5s)
      --node-status-update-frequency duration    Specifies how often the controller updates nodes' status. (default 5m0s)
      --port int                                 DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve HTTPS at all. See --secure-port instead. (default 10253)
      --profiling                                Enable profiling via web interface host:port/debug/pprof/ (default true)
      --route-reconciliation-period duration     The period for reconciling routes created for Nodes by cloud provider. (default 10s)
      --secure-port int                          The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.
      --tls-cert-file string                     File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.
      --tls-cipher-suites strings                Comma-separated list of cipher suites for the server. Values are from tls package constants (https://golang.org/pkg/crypto/tls/#pkg-constants). If omitted, the default Go cipher suites will be used
      --tls-min-version string                   Minimum TLS version supported. Value must match version names from https://golang.org/pkg/crypto/tls/#pkg-constants.
      --tls-private-key-file string              File containing the default x509 private key matching --tls-cert-file.
      --tls-sni-cert-key namedCertKey            A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". (default [])
      --use-service-account-credentials          If true, use individual service account credentials for each controller.
      --version version[=true]                   Print version information and quit
```

###### Auto generated by spf13/cobra on 25-Mar-2018
