---
title: federation-apiserver
notitle: true
weight: 100
---
## federation-apiserver



### Synopsis


The Kubernetes federation API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```
federation-apiserver [flags]
```

### Options

```
      --admission-control-config-file string                    File with admission control configuration.
      --advertise-address ip                                    The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.
      --anonymous-auth                                          Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true)
      --audit-log-format string                                 Format of saved audits. "legacy" indicates 1-line text format for each event. "json" indicates structured json format. Requires the 'AdvancedAuditing' feature gate. Known formats are legacy,json. (default "json")
      --audit-log-maxage int                                    The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
      --audit-log-maxbackup int                                 The maximum number of old audit log files to retain.
      --audit-log-maxsize int                                   The maximum size in megabytes of the audit log file before it gets rotated.
      --audit-log-path string                                   If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.
      --audit-policy-file string                                Path to the file that defines the audit policy configuration. Requires the 'AdvancedAuditing' feature gate. With AdvancedAuditing, a profile is required to enable auditing.
      --audit-webhook-batch-buffer-size int                     The size of the buffer to store events before batching and sending to the webhook. Only used in batch mode. (default 10000)
      --audit-webhook-batch-initial-backoff duration            The amount of time to wait before retrying the first failed requests. Only used in batch mode. (default 10s)
      --audit-webhook-batch-max-size int                        The maximum size of a batch sent to the webhook. Only used in batch mode. (default 400)
      --audit-webhook-batch-max-wait duration                   The amount of time to wait before force sending the batch that hadn't reached the max size. Only used in batch mode. (default 30s)
      --audit-webhook-batch-throttle-burst int                  Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode. (default 15)
      --audit-webhook-batch-throttle-qps float32                Maximum average number of requests per second. Only used in batch mode. (default 10)
      --audit-webhook-config-file string                        Path to a kubeconfig formatted file that defines the audit webhook configuration. Requires the 'AdvancedAuditing' feature gate.
      --audit-webhook-mode string                               Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the webhook to buffer and send events asynchronously. Known modes are batch,blocking. (default "batch")
      --authentication-token-webhook-cache-ttl duration         The duration to cache responses from the webhook token authenticator. (default 2m0s)
      --authentication-token-webhook-config-file string         File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.
      --authorization-mode string                               Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node. (default "AlwaysAllow")
      --authorization-policy-file string                        File with authorization policy in csv format, used with --authorization-mode=ABAC, on the secure port.
      --authorization-webhook-cache-authorized-ttl duration     The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s)
      --authorization-webhook-cache-unauthorized-ttl duration   The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s)
      --authorization-webhook-config-file string                File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.
      --basic-auth-file string                                  If set, the file that will be used to admit requests to the secure port of the API server via http basic authentication.
      --bind-address ip                                         The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0). (default 0.0.0.0)
      --cert-dir string                                         The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/run/kubernetes")
      --client-ca-file string                                   If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
      --contention-profiling                                    Enable lock contention profiling, if profiling is enabled
      --cors-allowed-origins strings                            List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.
      --default-watch-cache-size int                            Default watch cache size. If zero, watch cache will be disabled for resources that do not have a default watch size set. (default 100)
      --delete-collection-workers int                           Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup. (default 1)
      --deserialization-cache-size int                          Number of deserialized json objects to cache in memory.
      --disable-admission-plugins strings                       admission plugins that should be disabled although they are in the default enabled plugins list. Comma-delimited list of admission plugins: Initializers, MutatingAdmissionWebhook, NamespaceLifecycle, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.
      --enable-admission-plugins strings                        admission plugins that should be enabled in addition to default enabled ones. Comma-delimited list of admission plugins: Initializers, MutatingAdmissionWebhook, NamespaceLifecycle, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.
      --enable-bootstrap-token-auth                             Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.
      --enable-garbage-collector                                Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager. (default true)
      --enable-swagger-ui                                       Enables swagger ui on the apiserver at /swagger-ui
      --etcd-cafile string                                      SSL Certificate Authority file used to secure etcd communication.
      --etcd-certfile string                                    SSL certification file used to secure etcd communication.
      --etcd-compaction-interval duration                       The interval of compaction requests. If 0, the compaction request from apiserver is disabled. (default 5m0s)
      --etcd-keyfile string                                     SSL key file used to secure etcd communication.
      --etcd-prefix string                                      The prefix to prepend to all resource paths in etcd. (default "/registry")
      --etcd-servers strings                                    List of etcd servers to connect with (scheme://ip:port), comma separated.
      --etcd-servers-overrides strings                          Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are http://ip:port, semicolon separated.
      --event-ttl duration                                      Amount of time to retain events. (default 1h0m0s)
      --experimental-encryption-provider-config string          The file containing configuration for encryption providers to be used for storing secrets in etcd
      --experimental-keystone-ca-file string                    If set, the Keystone server's certificate will be verified by one of the authorities in the experimental-keystone-ca-file, otherwise the host's root CA set will be used.
      --experimental-keystone-url string                        If passed, activates the keystone authentication plugin.
      --external-hostname string                                The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs).
      --feature-gates mapStringBool                             A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
APIListChunking=true|false (BETA - default=true)
APIResponseCompression=true|false (ALPHA - default=false)
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (BETA - default=true)
AllAlpha=true|false (ALPHA - default=false)
AppArmor=true|false (BETA - default=true)
BlockVolume=true|false (ALPHA - default=false)
CPUManager=true|false (BETA - default=true)
CSIPersistentVolume=true|false (ALPHA - default=false)
CustomPodDNS=true|false (ALPHA - default=false)
CustomResourceValidation=true|false (BETA - default=true)
DebugContainers=true|false (ALPHA - default=false)
DevicePlugins=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
EnableEquivalenceClassCache=true|false (ALPHA - default=false)
ExpandPersistentVolumes=true|false (ALPHA - default=false)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
HugePages=true|false (BETA - default=true)
HyperVContainer=true|false (ALPHA - default=false)
Initializers=true|false (ALPHA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
MountContainers=true|false (ALPHA - default=false)
MountPropagation=true|false (ALPHA - default=false)
PVCProtection=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
PodPriority=true|false (ALPHA - default=false)
PodShareProcessNamespace=true|false (ALPHA - default=false)
ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (BETA - default=true)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
ServiceNodeExclusion=true|false (ALPHA - default=false)
ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
SupportIPVSProxyMode=true|false (BETA - default=false)
SupportPodPidsLimit=true|false (ALPHA - default=false)
TaintBasedEvictions=true|false (ALPHA - default=false)
TaintNodesByCondition=true|false (ALPHA - default=false)
VolumeScheduling=true|false (ALPHA - default=false)
  -h, --help                                                    help for federation-apiserver
      --log-flush-frequency duration                            Maximum number of seconds between log flushes (default 5s)
      --master-service-namespace string                         DEPRECATED: the namespace from which the kubernetes master services should be injected into pods. (default "default")
      --max-mutating-requests-inflight int                      The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 200)
      --max-requests-inflight int                               The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 400)
      --min-request-timeout int                                 An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load. (default 1800)
      --oidc-ca-file string                                     If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.
      --oidc-client-id string                                   The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.
      --oidc-groups-claim string                                If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.
      --oidc-groups-prefix string                               If provided, all groups will be prefixed with this value to prevent conflicts with other authentication strategies.
      --oidc-issuer-url string                                  The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).
      --oidc-username-claim string                              The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details. (default "sub")
      --oidc-username-prefix string                             If provided, all usernames will be prefixed with this value. If not provided, username claims other than 'email' are prefixed by the issuer URL to avoid clashes. To skip any prefixing, provide the value '-'.
      --profiling                                               Enable profiling via web interface host:port/debug/pprof/ (default true)
      --request-timeout duration                                An optional field indicating the duration a handler must keep a request open before timing it out. This is the default request timeout for requests but may be overridden by flags such as --min-request-timeout for specific types of requests. (default 1m0s)
      --requestheader-allowed-names strings                     List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.
      --requestheader-client-ca-file string                     Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers
      --requestheader-extra-headers-prefix strings              List of request header prefixes to inspect. X-Remote-Extra- is suggested.
      --requestheader-group-headers strings                     List of request headers to inspect for groups. X-Remote-Group is suggested.
      --requestheader-username-headers strings                  List of request headers to inspect for usernames. X-Remote-User is common.
      --runtime-config mapStringString                          A set of key=value pairs that describe runtime configuration that may be passed to apiserver. <group>/<version> (or <version> for the core group) key can be used to turn on/off specific api versions. api/all is special key to control all api versions, be careful setting it false, unless you know what you do. api/legacy is deprecated, we will remove it in the future, so stop using it.
      --secure-port int                                         The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all. (default 6443)
      --service-account-key-file stringArray                    File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. If unspecified, --tls-private-key-file is used. The specified file can contain multiple keys, and the flag can be specified multiple times with different files.
      --service-account-lookup                                  If true, validate ServiceAccount tokens exist in etcd as part of authentication. (default true)
      --storage-backend string                                  The storage backend for persistence. Options: 'etcd3' (default), 'etcd2'.
      --storage-media-type string                               The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting. (default "application/vnd.kubernetes.protobuf")
      --storage-versions string                                 The per-group version to store resources in. Specified in the format "group1/version1,group2/version2,...". In the case where objects are moved from one group to the other, you may specify the format "group1=group2/v1beta1,group3/v1beta1,...". You only need to pass the groups you wish to change from the defaults. It defaults to a list of preferred versions of all registered groups, which is derived from the KUBE_API_VERSIONS environment variable. (default "admissionregistration.k8s.io/v1beta1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,events.k8s.io/v1beta1,extensions/v1beta1,federation/v1beta1,imagepolicy.k8s.io/v1alpha1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1,scheduling.k8s.io/v1alpha1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")
      --target-ram-mb int                                       Memory limit for apiserver in MB (used to configure sizes of caches, etc.)
      --tls-cert-file string                                    File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.
      --tls-cipher-suites strings                               Comma-separated list of cipher suites for the server. Values are from tls package constants (https://golang.org/pkg/crypto/tls/#pkg-constants). If omitted, the default Go cipher suites will be used
      --tls-min-version string                                  Minimum TLS version supported. Value must match version names from https://golang.org/pkg/crypto/tls/#pkg-constants.
      --tls-private-key-file string                             File containing the default x509 private key matching --tls-cert-file.
      --tls-sni-cert-key namedCertKey                           A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". (default [])
      --token-auth-file string                                  If set, the file that will be used to secure the secure port of the API server via token authentication.
      --watch-cache                                             Enable watch caching in the apiserver (default true)
      --watch-cache-sizes strings                               List of watch cache sizes for every resource (pods, nodes, etc.), comma separated. The individual override format: resource[.group]#size, where resource is lowercase plural (no version), group is optional, and size is a number. It takes effect when watch-cache is enabled. Some resources (replicationcontrollers, endpoints, nodes, pods, services, apiservices.apiregistration.k8s.io) have system defaults set by heuristics, others default to default-watch-cache-size
```

###### Auto generated by spf13/cobra on 25-Mar-2018
