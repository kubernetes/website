---
title: federation-apiserver
notitle: true
---
## federation-apiserver


<!--
### Synopsis


The Kubernetes federation API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```
federation-apiserver
```

-->
### 摘要


Kubernetes federation API 服务为api对象验证和配置数据，包括pods,services,
replicationcontrollers和其它组件。API服务通过各种组件的交互提供了REST操作
和集群状态的共享前端。


```
federation-apiserver
``` 
<!--
### Options

```
      --admission-control stringSlice                           Ordered list of plug-ins to do admission control of resources into cluster. Comma-delimited list of: NamespaceLifecycle. (default [AlwaysAdmit])
      --admission-control-config-file string                    File with admission control configuration.
      --advertise-address ip                                    The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.
      --anonymous-auth                                          Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true)
      --audit-log-maxage int                                    The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
      --audit-log-maxbackup int                                 The maximum number of old audit log files to retain.
      --audit-log-maxsize int                                   The maximum size in megabytes of the audit log file before it gets rotated.
      --audit-log-path string                                   If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.
      --audit-policy-file string                                Path to the file that defines the audit policy configuration. Requires the 'AdvancedAuditing' feature gate. With AdvancedAuditing, a profile is required to enable auditing.
      --audit-webhook-config-file string                        Path to a kubeconfig formatted file that defines the audit webhook configuration. Requires the 'AdvancedAuditing' feature gate.
	  
-->

### 参数列表

```
	  --admission-control stringSlice                           用于集群资源控制管理的插件列表，以逗号隔开。(默认是 [AlwaysAdmit])
	  --admission-control-config-file string                    用于管理控制的配置文件。
	  --advertise-address ip                                    用于向集群成员开放API服务的IP地址。该地址必须可以被集群其他成员访问，如果为空，则 --bind-address 需要指定，如果--bind-address为空，则使用host的默认地址。
	  --anonymous-auth                                          允许API服务安全端口的匿名请求。匿名请求就是没有被其他验证机制拒绝的请求，它拥有系统用户名：anonymous和系统组：unauthenticated 。(默认 true)
      --audit-log-maxage int                                    最大的audit日志保存天数，以文件名包含的timestamp为准。
      --audit-log-maxbackup int                                 最多的audit日志保存数量。
      --audit-log-maxsize int                                   日志大小限制，达到这个数字将会被自动转储。
      --audit-log-path string                                   如果设置了这个参数，所有API服务收到的请求都会记录到这个文件。  '-' 表示标准输出.
      --audit-policy-file string                                定义audit策略配置的文件路径。需要AdvancedAuditing，当AdvancedAuditing为true 时，需要一个配置文件来启用auditing.
      --audit-webhook-config-file string                        定义webhook配置的kubeconfig格式的文件路径，要求'AdvancedAuditing'。


<!--
      --audit-webhook-mode string                               Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the webhook to buffer and send events asynchronously. Known modes are batch,blocking. (default "batch")
      --authentication-token-webhook-cache-ttl duration         The duration to cache responses from the webhook token authenticator. (default 2m0s)
      --authentication-token-webhook-config-file string         File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.
      --authorization-mode string                               Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node. (default "AlwaysAllow")
-->

	  --audit-webhook-mode string                               发送审计事务策略的规则。Blocking表示发送的事务会禁止服务响应。Batch导致webhook异步缓存和发送事务。可选模式为：batch,blocking. (默认 "batch")
      --authentication-token-webhook-cache-ttl duration         缓存来自webhook口令验证的时间 (默认 2m0s)
      --authentication-token-webhook-config-file string         webhook用于口令验证的配置以kubeconfig格式保存的文件。API服务会向远程服务校验口令。
      --authorization-mode string                               用于在安全端口验证的plug-ins列表。以逗号隔开AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node. (默认 "AlwaysAllow")

<!--
      --authorization-policy-file string                        File with authorization policy in csv format, used with --authorization-mode=ABAC, on the secure port.
      --authorization-webhook-cache-authorized-ttl duration     The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s)
      --authorization-webhook-cache-unauthorized-ttl duration   The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s)
      --authorization-webhook-config-file string                File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.
-->
	  
	  --authorization-policy-file string                        CSV格式的基于安全端口的验证策略文件，和--authorization-mode=ABAC一起使用。
      --authorization-webhook-cache-authorized-ttl duration     缓存来自webhook验证'authorized'的回应周期 (默认 5m0s)
      --authorization-webhook-cache-unauthorized-ttl duration   缓存来自webhook验证'unauthorized'的回应周期。(默认 30s)
      --authorization-webhook-config-file string                kubeconfig格式的webhook配置文件, 和--authorization-mode=Webhook一起使用. API服务会通过API的安全端口向远程服务校验。

<!--	  
      --basic-auth-file string                                  If set, the file that will be used to admit requests to the secure port of the API server via http basic authentication.
      --bind-address ip                                         The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0). (default 0.0.0.0)
      --cert-dir string                                         The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/run/kubernetes")
      --client-ca-file string                                   If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
-->

	  --basic-auth-file string                                  这个文件会被用来处理通过http验证发到API服务安全端口的请求。
      --bind-address ip                                         用来监听--secure-port端口的IP地址。这个地址应该可以被集群和CLI或者网页客户端访问。如果这个地址为空，这所有的网口都会被监听，默认0.0.0.0。
      --cert-dir string                                         存放TLS证书的目录。如果配置了--tls-cert-file 和 --tls-private-key-file 则这个参数会被忽略 (默认 "/var/run/kubernetes")
      --client-ca-file string                                   任何代表由CA签名的客户证书请求将会对应客户证书的CommonName来验证。


<!--
      --cloud-config string                                     The path to the cloud provider configuration file. Empty string for no configuration file.
      --cloud-provider string                                   The provider for cloud services. Empty string for no provider.
      --contention-profiling                                    Enable lock contention profiling, if profiling is enabled
      --cors-allowed-origins stringSlice                        List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.
-->

	  --cloud-config string                                     云服务的配置文件。空代表没有使用云服务
      --cloud-provider string                                   云服务提供商的配置文件。空代表没有使用云服务
      --contention-profiling                                    启用contention profiling, 前提是profiling启用
      --cors-allowed-origins stringSlice                        逗号隔开的允许的CORS列表，可以使用正则表达式来支持子域名，如果该列表为空则CORS不启用。

<!--
      --delete-collection-workers int                           Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup. (default 1)
      --deserialization-cache-size int                          Number of deserialized json objects to cache in memory.
      --enable-garbage-collector                                Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager. (default true)
      --enable-swagger-ui                                       Enables swagger ui on the apiserver at /swagger-ui
      --etcd-cafile string                                      SSL Certificate Authority file used to secure etcd communication.
      --etcd-certfile string                                    SSL certification file used to secure etcd communication.
      --etcd-keyfile string                                     SSL key file used to secure etcd communication.
      --etcd-prefix string                                      The prefix to prepend to all resource paths in etcd. (default "/registry")
      --etcd-quorum-read                                        If true, enable quorum read.
      --etcd-servers stringSlice                                List of etcd servers to connect with (scheme://ip:port), comma separated.
      --etcd-servers-overrides stringSlice                      Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are http://ip:port, semicolon separated.
-->

      --delete-collection-workers int                           为了DeleteCollection启用的工作进程数目，用来加速清理namespace.(默认 1)
      --deserialization-cache-size int                          内存中缓存的JSON对象数量
      --enable-garbage-collector                                启用垃圾回收机制，必须跟kube-controller-manager的corresponding标志同步。(默认 true)
      --enable-swagger-ui                                       在apiserver启动swagger-ui,路径为/swagger-ui
      --etcd-cafile string                                      SSL CA列表，用于保护etcd通讯。
      --etcd-certfile string                                    SSL 证书文件路径
      --etcd-keyfile string                                     SSL 钥匙路径
      --etcd-prefix string                                      etcd里所有资源路径的前缀(默认 "/registry")
      --etcd-quorum-read                                        如果为true则启用quorum read.
      --etcd-servers stringSlice                                连接的etcd服务列表，逗号隔开 (scheme://ip:port)
      --etcd-servers-overrides stringSlice                      etcd服务资源覆盖列表, 逗号隔开。 覆盖格式为: group/resource#servers, servers格式为 http://ip:port, 逗号隔开.

<!--
      --event-ttl duration                                      Amount of time to retain events. (default 1h0m0s)
      --experimental-bootstrap-token-auth                       Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.
      --experimental-encryption-provider-config string          The file containing configuration for encryption providers to be used for storing secrets in etcd
      --experimental-keystone-ca-file string                    If set, the Keystone server's certificate will be verified by one of the authorities in the experimental-keystone-ca-file, otherwise the host's root CA set will be used.
      --experimental-keystone-url string                        If passed, activates the keystone authentication plugin.
      --external-hostname string                                The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs).
      --feature-gates mapStringBool                             A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (ALPHA - default=false)
AffinityInAnnotations=true|false (ALPHA - default=false)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
DynamicVolumeProvisioning=true|false (ALPHA - default=true)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (ALPHA - default=false)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
TaintBasedEvictions=true|false (ALPHA - default=false)
-->

      --event-ttl duration                                      保留事务的时间。 (默认 1h0m0s)
      --experimental-bootstrap-token-auth                       允许启用kube-system命名空间的'bootstrap.kubernetes.io/token'类型的secret，用于TLS bootstrapping验证。
      --experimental-encryption-provider-config string          该文件保存了加密配置用于etcd保存secret。
      --experimental-keystone-ca-file string                    该文件提供了CA列表，用于Keystone服务的证书验证。如果没有配置，则使用host的根CA。
      --experimental-keystone-url string                        启用keystone验证插件。
      --external-hostname string                                用于生成对外URL的hostname. (e.g. Swagger API Docs).
      --feature-gates mapStringBool                             描述测试或实验功能的键值对，可选项为：
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (ALPHA - default=false)
AffinityInAnnotations=true|false (ALPHA - default=false)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
DynamicVolumeProvisioning=true|false (ALPHA - default=true)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (ALPHA - default=false)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
TaintBasedEvictions=true|false (ALPHA - default=false)

<!--
      --insecure-allow-any-token username/group1,group2         If set, your server will be INSECURE.  Any token will be allowed and user information will be parsed from the token as username/group1,group2
      --insecure-bind-address ip                                The IP address on which to serve the --insecure-port (set to 0.0.0.0 for all interfaces). (default 127.0.0.1)
      --insecure-port int                                       The port on which to serve unsecured, unauthenticated access. It is assumed that firewall rules are set up such that this port is not reachable from outside of the cluster and that port 443 on the cluster's public address is proxied to this port. This is performed by nginx in the default setup. (default 8080)
      --master-service-namespace string                         DEPRECATED: the namespace from which the kubernetes master services should be injected into pods. (default "default")
      --max-mutating-requests-inflight int                      The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 200)
      --max-requests-inflight int                               The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 400)
      --min-request-timeout int                                 An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load. (default 1800)
      --oidc-ca-file string                                     If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.
      --oidc-client-id string                                   The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.
      --oidc-groups-claim string                                If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.
      --oidc-issuer-url string                                  The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).
      --oidc-username-claim string                              The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details. (default "sub")
-->

      --insecure-allow-any-token username/group1,group2         配置这个，你的服务器将变得不安全。允许任何token，而用户信息则会以username/group1,group2这样的token来解释。
      --insecure-bind-address ip                                监听--insecure-port端口的IP地址 (设置为0.0.0.0 监听所有网络接口). (默认 127.0.0.1)
      --insecure-port int                                       这个端口用于服务不安全没验证的访问。防火墙规则阻止这个端口被集群外访问，而集群的公共地址上的443端口则被转发到该端口，这在默认配置中由nginx完成。(默认 8080)
      --master-service-namespace string                         已弃用: 用于指定运行pod的kubernetes主服务器上的命名空间(默认 "default")
      --max-mutating-requests-inflight int                      指定时间内转换的请求数目，超出此数会拒绝请求，0表示没有限制。(默认 200)
      --max-requests-inflight int                               指定时间内非转换请求，超出此数会拒绝请求，0表示没有限制。(默认 400)
      --min-request-timeout int                                 非必要参数，表示一个handler保持的request的秒数。当前只用于监控request handler， 会随机挑选一个比该值大的数字作为timeout时间，来分散负载。(默认 1800)
      --oidc-ca-file string                                     如果配置了这个参数，OpenID服务的证书将由oidc-ca-file里的CA来验证，否则使用host的根CA。
      --oidc-client-id string                                   OIDC客户端ID，如果配置了oidc-issuer-url，则该值也需要配置。
      --oidc-groups-claim string                                OIDC的用户组，这个值将会是一个字符串或者字符串列。该功能正在实验当中，若需更仔细资料请查看验证文档。
      --oidc-issuer-url string                                  OpenID签发者地址，仅接受HTTPS格式，如果配置了这个参数，则会被用于验证OIDC的JSON网页口令（JWT）。
      --oidc-username-claim string                              用于OIDC的用户名，注意除了默认的（'sub'）之外不保证其唯一性，如需更多资料，请查看验证文档。
	  
<!--
      --profiling                                               Enable profiling via web interface host:port/debug/pprof/ (default true)
      --requestheader-allowed-names stringSlice                 List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.
      --requestheader-client-ca-file string                     Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers
      --requestheader-extra-headers-prefix stringSlice          List of request header prefixes to inspect. X-Remote-Extra- is suggested.
      --requestheader-group-headers stringSlice                 List of request headers to inspect for groups. X-Remote-Group is suggested.
      --requestheader-username-headers stringSlice              List of request headers to inspect for usernames. X-Remote-User is common.
      --runtime-config mapStringString                          A set of key=value pairs that describe runtime configuration that may be passed to apiserver. apis/<groupVersion> key can be used to turn on/off specific api versions. apis/<groupVersion>/<resource> can be used to turn on/off specific resources. api/all and api/legacy are special keys to control all and legacy api versions respectively.
      --secure-port int                                         The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all. (default 6443)
      --service-account-key-file stringArray                    File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. If unspecified, --tls-private-key-file is used. The specified file can contain multiple keys, and the flag can be specified multiple times with different files.
      --service-account-lookup                                  If true, validate ServiceAccount tokens exist in etcd as part of authentication. (default true)
      --storage-backend string                                  The storage backend for persistence. Options: 'etcd3' (default), 'etcd2'.
      --storage-media-type string                               The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting. (default "application/vnd.kubernetes.protobuf")
-->	  
	
      --profiling                                               通过网页接口 host:port/debug/pprof/启用profiling (默认 true)
      --requestheader-allowed-names stringSlice                 允许--requestheader-username-headers指定的客户证书头文件，如果为空，则--requestheader-client-ca-file里CA验证的客户证书都接受。
      --requestheader-client-ca-file string                     在信任--requestheader-username-headers指定的用户名之前，使用来验证客户证书的根证书群。
      --requestheader-extra-headers-prefix stringSlice          请求头文件的前缀，建议使用X-Remote-Extra-.
      --requestheader-group-headers stringSlice                 请求头文件的组，建议使用X-Remote-Group.
      --requestheader-username-headers stringSlice              请求头文件的用户名，普遍使用X-Remote-User.
      --runtime-config mapStringString                          可能会传送给API服务的描述运行时环境的键值对。apis/<groupVersion>键可以用来开关对应的api版本。apis/<groupVersion>/<resource> 这个则用来开关对应的资源配置。api/all和api/legacy分别对应所有和主要的api版本控制。
      --secure-port int                                         提供HTTPS验证和授权的端口号，为0，则不提供HTTPS功能。(默认 6443)
      --service-account-key-file stringArray                    该文件保存了PEM编码格式x509 RSA和ECDSA的公钥或私钥，用于验证ServiceAccount口令。如果没有指定，则使用--tls-private-key-file 该文件可以包含多个钥匙，因此这个参数可以多次指定不同的文件。
      --service-account-lookup                                  如果为true,则验证过程会验证etcd里的ServiceAccount口令。 (默认 true)
      --storage-backend string                                  存储后端，可选项为: 'etcd3' (默认), 'etcd2'.
      --storage-media-type string                               存储里保存的对象格式，有些资源或者存储后端可能只支持有限的格式类型。
	  
<!--	
      --storage-versions string                                 The per-group version to store resources in. Specified in the format "group1/version1,group2/version2,...". In the case where objects are moved from one group to the other, you may specify the format "group1=group2/v1beta1,group3/v1beta1,...". You only need to pass the groups you wish to change from the defaults. It defaults to a list of preferred versions of all registered groups, which is derived from the KUBE_API_VERSIONS environment variable. (default "admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")
      --target-ram-mb int                                       Memory limit for apiserver in MB (used to configure sizes of caches, etc.)
      --tls-ca-file string                                      If set, this certificate authority will used for secure access from Admission Controllers. This must be a valid PEM-encoded CA bundle. Altneratively, the certificate authority can be appended to the certificate provided by --tls-cert-file.
      --tls-cert-file string                                    File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to /var/run/kubernetes.
      --tls-private-key-file string                             File containing the default x509 private key matching --tls-cert-file.
      --tls-sni-cert-key namedCertKey                           A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". (default [])
      --token-auth-file string                                  If set, the file that will be used to secure the secure port of the API server via token authentication.
      --watch-cache                                             Enable watch caching in the apiserver (default true)
      --watch-cache-sizes stringSlice                           List of watch cache sizes for every resource (pods, nodes, etc.), comma separated. The individual override format: resource#size, where size is a number. It takes effect when watch-cache is enabled.
-->

	  --storage-versions string                              分组保存资源的版本。格式："group1/version1,group2/version2,...",当对象转移到另外一组时，只需要这样指定"group1=group2/v1beta1,group3/v1beta1,...",只需要修改变动的资源，默认是衍生自KUBE_API_VERSIONS环境变量 (默认 "admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")
      --target-ram-mb int                                       api服务的内存限制 (比如用于限制缓存大小)
      --tls-ca-file string                                      该文件保存的CA会用于Admission Controllers的安全验证，文件内容必须是PEM编码的CA群，也可以在--tls-cert-file提供的证书后添加CA内容。
      --tls-cert-file string                                    该文件保存了默认的x509证书。如果HTTPS启用而--tls-cert-file and --tls-private-key-file没有配置，则会自动生成一对自签名的证书和钥匙对，并保存在/var/run/kubernetes.
      --tls-private-key-file string                             该文件保存了默认的x509私钥，对应--tls-cert-file.
      --tls-sni-cert-key namedCertKey                           x509证书和私钥路径，可选后缀是完整域名，也可能是通配符格式。如果没有提供域名，则必须提供证书名字。多个证书对，则可以多次指定--tls-sni-cert-key.比如: "example.crt,example.key" 或 "foo.crt,foo.key:*.foo.com,foo.com". (默认 [])
      --token-auth-file string                                  如果配置了这个参数，则该文件会通过口令验证来保障API服务的安全端口。
      --watch-cache                                             启用api服务的监控缓存 (默认 true)
      --watch-cache-sizes stringSlice                           每种资源的健康缓存大小，逗号隔开。格式为：resource#size, 这里size 是一个数字. 仅当watch-cache启用时该值生效。
```

###### Auto generated by spf13/cobra on 11-Jul-2017
