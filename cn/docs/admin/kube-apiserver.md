---
title: kube-apiserver
notitle: true
---
## kube-apiserver


<!--
### Synopsis


The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```
kube-apiserver
```
-->

### 概要


Kubernetes API server 为 api 对象验证并配置数据，包括 pods、 services、 replicationcontrollers和其它 api 对象。API Server 提供 REST 操作和到集群共享状态的前端，所有其他组件通过它进行交互。

```
kube-apiserver
```
<!--
### Options
-->
### 选项
```
<!--
      --admission-control stringSlice                           Ordered list of plug-ins to do admission control of resources into cluster. Comma-delimited list of: NamespaceLifecycle. (default [AlwaysAdmit])
-->
      --admission-control stringSlice                           控制资源进入集群的准入控制插件的顺序列表。逗号分隔的NamespaceLifecycle列表。(默认值[AlwaysAdmit])
<!--
      --admission-control-config-file string                    File with admission control configuration.
-->
      --admission-control-config-file string                    包含准入控制配置的文件。
<!--
      --advertise-address ip                                    The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.
-->
      --advertise-address ip                                    向集群成员通知apiserver消息的IP地址。这个地址必须能够被集群中其他成员访问。如果IP地址为空，将会使用--bind-address，如果未指定--bind-address，将会使用主机的默认接口地址。
<!--      
      --allow-privileged                                        If true, allow privileged containers.
-->
      --allow-privileged                                        如果为true, 将允许特权容器.
<!--
      --anonymous-auth                                          Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true)
-->
      --anonymous-auth                                          启用到API server的安全端口的匿名请求。未被其他认证方法拒绝的请求被当做匿名请求。匿名请求的用户名为system:anonymous，用户组名为system:unauthenticated。（默认值true）
<!--
      --apiserver-count int                                     The number of apiservers running in the cluster, must be a positive number. (default 1)
-->
      --apiserver-count int                                     集群中运行的apiserver数量，必须为正数。（默认值1）
<!--
      --audit-log-maxage int                                    The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
-->
      --audit-log-maxage int                                    基于文件名中的时间戳，旧审计日志文件的最长保留天数。
<!--
      --audit-log-maxbackup int                                 The maximum number of old audit log files to retain.
-->
      --audit-log-maxbackup int                                 旧审计日志文件的最大保留个数.
<!--
      --audit-log-maxsize int                                   The maximum size in megabytes of the audit log file before it gets rotated.
-->
      --audit-log-maxsize int                                   审计日志被轮转前的最大兆字节数。
<!--
      --audit-log-path string                                   If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.
-->
      --audit-log-path string                                   如果设置该值，所有到apiserver的请求都将会被记录到这个文件。'-'表示记录到标准输出。
<!--
      --audit-policy-file string                                Path to the file that defines the audit policy configuration. Requires the 'AdvancedAuditing' feature gate. With AdvancedAuditing, a profile is required to enable auditing.
-->
      --audit-policy-file string                                定义审计策略配置的文件的路径。需要打开'AdvancedAuditing'特性开关。AdvancedAuditing需要一个配置来启用审计功能。
<!--
      --audit-webhook-config-file string                        Path to a kubeconfig formatted file that defines the audit webhook configuration. Requires the 'AdvancedAuditing' feature gate.
-->
      --audit-webhook-config-file string                        一个具有kubeconfig格式文件的路径，该文件定义了审计的webhook配置。需要打开'AdvancedAuditing'特性开关。
<!--
      --audit-webhook-mode string                               Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the webhook to buffer and send events asynchronously. Known modes are batch,blocking. (default "batch")
-->
      --audit-webhook-mode string                               发送审计事件的策略。 Blocking模式表示正在发送事件时应该阻塞服务器的响应。 Batch模式使webhook异步缓存和发送事件。 Known模式为batch,blocking。 （默认值"batch")
<!--
      --authentication-token-webhook-cache-ttl duration         The duration to cache responses from the webhook token authenticator. (default 2m0s)
-->
      --authentication-token-webhook-cache-ttl duration         从webhook令牌认证者获取的响应的缓存时长。(默认值2m0s)
<!--
      --authentication-token-webhook-config-file string         File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.
-->
      --authentication-token-webhook-config-file string         包含webhook配置的文件，用于令牌认证，具有kubeconfig格式。API server将查询远程服务来决定对bearer令牌的认证。
<!--
      --authorization-mode string                               Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node. (default "AlwaysAllow")
-->
      --authorization-mode string                               在安全端口上进行权限验证的插件的顺序列表。以逗号分隔的列表，包括：AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.（默认值"AlwaysAllow"）
 <!--
      --authorization-policy-file string                        File with authorization policy in csv format, used with --authorization-mode=ABAC, on the secure port.
 -->
      --authorization-policy-file string                        包含权限验证策略的csv文件，和--authorization-mode=ABAC一起使用，作用在安全端口上。
 <!--
      --authorization-webhook-cache-authorized-ttl duration     The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s)
 -->
      --authorization-webhook-cache-authorized-ttl duration     从webhook授权者获得的'authorized'响应的缓存时长。（默认值5m0s） 
 <!--
      --authorization-webhook-cache-unauthorized-ttl duration   The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s)
 -->
      --authorization-webhook-cache-unauthorized-ttl duration   从webhook授权者获得的'unauthorized'响应的缓存时长。（默认值30s）
 <!--
      --authorization-webhook-config-file string                File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.
 -->
      --authorization-webhook-config-file string                包含webhook配置的kubeconfig格式文件，和--authorization-mode=Webhook一起使用。API server将查询远程服务来决定对API server安全端口的访问。
 <!--
      --azure-container-registry-config string                  Path to the file container Azure container registry configuration information.
 -->
      --azure-container-registry-config string                  包含Azure容器注册表配置信息的文件的路径。
<!--      
      --basic-auth-file string                                  If set, the file that will be used to admit requests to the secure port of the API server via http basic authentication.
-->
      --basic-auth-file string                                  如果设置该值，这个文件将会被用于准许通过http基本认证到API server安全端口的请求。
<!--
      --bind-address ip                                         The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0). (default 0.0.0.0)
-->
      --bind-address ip                                         监听--secure-port的IP地址。被关联的接口必须能够被集群其它节点和CLI/web客户端访问。如果为空，则将使用所有接口（0.0.0.0）。（默认值0.0.0.0）
<!--
      --cert-dir string                                         The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/run/kubernetes")
-->
      --cert-dir string                                         存放TLS证书的目录。如果提供了--tls-cert-file和--tls-private-key-file选项，该标志将被忽略。（默认值 "/var/run/kubernetes"）
<!--
      --client-ca-file string                                   If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
 -->
      --client-ca-file string                                   如果设置此标志，对于任何请求，如果存包含client-ca-file中的authorities签名的客户端证书，将会使用客户端证书中的CommonName对应的身份进行认证。
 <!--
      --cloud-config string                                     The path to the cloud provider configuration file. Empty string for no configuration file.
 -->
      --cloud-config string                                     云服务提供商配置文件路径。空字符串表示无配置文件.
 <!--
      --cloud-provider string                                   The provider for cloud services. Empty string for no provider.
  -->
      --cloud-provider string                                   云服务提供商，空字符串表示无提供商。
 <!--
      --contention-profiling                                    Enable lock contention profiling, if profiling is enabled
 -->
      --contention-profiling                                    如果已经启用profiling，则启用锁竞争profiling。
<!--
      --cors-allowed-origins stringSlice                        List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.
-->
      --cors-allowed-origins stringSlice                        CORS的域列表，以逗号分隔。合法的域可以是一个匹配子域名的正则表达式。如果这个列表为空则不会启用CORS.
<!--
      --delete-collection-workers int                           Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup. (default 1)
-->
      --delete-collection-workers int                           用于DeleteCollection调用的工作者数量。这被用于加速namespace的清理。(默认值1)
<!--
      --deserialization-cache-size int                          Number of deserialized json objects to cache in memory.
-->
      --deserialization-cache-size int                          在内存中缓存的反序列化json对象的数量。
<!--
      --enable-aggregator-routing                               Turns on aggregator routing requests to endoints IP rather than cluster IP.
-->
      --enable-aggregator-routing                               打开到endpoints IP的aggregator路由请求，替换cluster IP。
<!--
      --enable-garbage-collector                                Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager. (default true)
-->
      --enable-garbage-collector                                启用通用垃圾回收器. 必须与kube-controller-manager对应的标志保持同步。 （默认值true）
<!--
      --enable-logs-handler                                     If true, install a /logs handler for the apiserver logs. (default true)
-->
      --enable-logs-handler                                     如果为true，则为apiserver日志功能安装一个/logs处理器。（默认值true）
<!--
      --enable-swagger-ui                                       Enables swagger ui on the apiserver at /swagger-ui
-->
      --enable-swagger-ui                                       在apiserver的/swagger-ui路径启用swagger ui。
<!--
      --etcd-cafile string                                      SSL Certificate Authority file used to secure etcd communication.
-->
      --etcd-cafile string                                      用于保护etcd通信的SSL CA文件。
<!--
      --etcd-certfile string                                    SSL certification file used to secure etcd communication.
-->
      --etcd-certfile string                                    用于保护etcd通信的的SSL证书文件。
<!--
      --etcd-keyfile string                                     SSL key file used to secure etcd communication.
-->
      --etcd-keyfile string                                     用于保护etcd通信的SSL密钥文件.
<!--
      --etcd-prefix string                                      The prefix to prepend to all resource paths in etcd. (default "/registry")
-->
      --etcd-prefix string                                      附加到所有etcd中资源路径的前缀。 （默认值"/registry"）
<!--
      --etcd-quorum-read                                        If true, enable quorum read.
-->
      --etcd-quorum-read                                        如果为true, 启用quorum读。
<!--
      --etcd-servers stringSlice                                List of etcd servers to connect with (scheme://ip:port), comma separated.
-->
      --etcd-servers stringSlice                                连接的etcd服务器列表,形式为（scheme://ip:port)，使用逗号分隔。
<!--
      --etcd-servers-overrides stringSlice                      Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are http://ip:port, semicolon separated.
-->
      --etcd-servers-overrides stringSlice                      针对单个资源的etcd服务器覆盖配置, 以逗号分隔。 单个配置覆盖格式为: group/resource#servers, 其中servers形式为http://ip:port, 以分号分隔。
<!--
      --event-ttl duration                                      Amount of time to retain events. (default 1h0m0s)
-->
      --event-ttl duration                                      事件驻留时间。（默认值1h0m0s)
<!--
      --experimental-bootstrap-token-auth                       Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.
-->
      --experimental-bootstrap-token-auth                       启用此选项以允许'kube-system'命名空间中的'bootstrap.kubernetes.io/token'类型密钥可以被用于TLS的启动认证。
<!--
      --experimental-encryption-provider-config string          The file containing configuration for encryption providers to be used for storing secrets in etcd
-->
      --experimental-encryption-provider-config string          包含加密提供程序的配置的文件，该加密提供程序被用于在etcd中保存密钥。
<!--
      --experimental-keystone-ca-file string                    If set, the Keystone server's certificate will be verified by one of the authorities in the experimental-keystone-ca-file, otherwise the host's root CA set will be used.
-->
      --experimental-keystone-ca-file string                    如果设置该值，将会使用experimental-keystone-ca-file中的一个authority对Keystone服务的证书进行验证，否则将会使用主机的根CA进行验证。
<!--
      --experimental-keystone-url string                        If passed, activates the keystone authentication plugin.
-->
      --experimental-keystone-url string                        如果设置了该值，将启用keystone认证插件。
<!--
      --external-hostname string                                The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs).
-->
      --external-hostname string                                为此master生成外部URL时使用的主机名(例如Swagger API文档)。
<!--
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
      --feature-gates mapStringBool                             一个描述alpha/experimental特性开关的键值对列表。 选项包括:
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
      --google-json-key string                                  The Google Cloud Platform Service Account JSON Key to use for authentication.
-->
      --google-json-key string                                  用于认证的Google Cloud Platform服务账号的JSON密钥。
<!--
      --insecure-allow-any-token username/group1,group2         If set, your server will be INSECURE.  Any token will be allowed and user information will be parsed from the token as username/group1,group2
-->
      --insecure-allow-any-token username/group1,group2         如果设置该值, 你的服务将处于非安全状态。任何令牌都将会被允许，并将从令牌中把用户信息解析成为username/group1,group2。
<!--
      --insecure-bind-address ip                                The IP address on which to serve the --insecure-port (set to 0.0.0.0 for all interfaces). (default 127.0.0.1)
-->
      --insecure-bind-address ip                                用于监听--insecure-port的IP地址 (设置成0.0.0.0表示监听所有接口)。（默认值127.0.0.1)
<!--
      --insecure-port int                                       The port on which to serve unsecured, unauthenticated access. It is assumed that firewall rules are set up such that this port is not reachable from outside of the cluster and that port 443 on the cluster's public address is proxied to this port. This is performed by nginx in the default setup. (default 8080)
-->
      --insecure-port int                                       用于监听不安全和为认证访问的端口。这个配置假设你已经设置了防火墙规则，使得这个端口不能从集群外访问。对集群的公共地址的443端口的访问将被代理到这个端口。默认设置中使用nginx实现。（默认值8080）
<!--
      --kubelet-certificate-authority string                    Path to a cert file for the certificate authority.
-->
      --kubelet-certificate-authority string                    证书authority的文件路径。
<!--
      --kubelet-client-certificate string                       Path to a client cert file for TLS.
-->
      --kubelet-client-certificate string                       用于TLS的客户端证书文件路径。
<!--
      --kubelet-client-key string                               Path to a client key file for TLS.
-->
      --kubelet-client-key string                               用于TLS的客户端证书密钥文件路径.
<!--
      --kubelet-https                                           Use https for kubelet connections. (default true)
-->
      --kubelet-https                                           为kubelet启用https。 （默认值true）
<!--
      --kubelet-preferred-address-types stringSlice             List of the preferred NodeAddressTypes to use for kubelet connections. (default [Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP])
-->
      --kubelet-preferred-address-types stringSlice             用于kubelet连接的首选NodeAddressTypes列表。 (默认值[Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP])
<!--
      --kubelet-read-only-port uint                             DEPRECATED: kubelet port. (default 10255)
-->
      --kubelet-read-only-port uint                             已废弃: kubelet端口. （默认值10255）
<!--
      --kubelet-timeout duration                                Timeout for kubelet operations. (default 5s)
-->
      --kubelet-timeout duration                                kubelet操作超时时间。（默认值 
      5s）
<!--
      --kubernetes-service-node-port int                        If non-zero, the Kubernetes master service (which apiserver creates/maintains) will be of type NodePort, using this as the value of the port. If zero, the Kubernetes master service will be of type ClusterIP.
-->
      --kubernetes-service-node-port int                        如果不为0，Kubernetes master服务（用于创建/管理apiserver）将会使用NodePort类型，并将这个值作为端口号。如果为0，Kubernetes master服务将会使用ClusterIP类型。
<!--      
      --master-service-namespace string                         DEPRECATED: the namespace from which the kubernetes master services should be injected into pods. (default "default")
-->
      --master-service-namespace string                         已废弃: 注入到pod中的kubernetes master服务的命名空间。（默认值"default"） 
<!--      
      --max-connection-bytes-per-sec int                        If non-zero, throttle each user connection to this number of bytes/sec. Currently only applies to long-running requests.
-->
      --max-connection-bytes-per-sec int                        如果不为0，每个用户连接将会被限速为该值（bytes/sec）。当前只应用于长时间运行的请求。
<!--      
      --max-mutating-requests-inflight int                      The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 200)
-->
      --max-mutating-requests-inflight int                      在给定时间内进行中可变请求的最大数量。当超过该值时，服务将拒绝所有请求。0值表示没有限制。（默认值200）
<!--      
      --max-requests-inflight int                               The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit. (default 400)
-->
      --max-requests-inflight int                               在给定时间内进行中不可变请求的最大数量。当超过该值时，服务将拒绝所有请求。0值表示没有限制。（默认值400）
<!--        
      --min-request-timeout int                                 An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load. (default 1800)
-->
      --min-request-timeout int                                 一个可选字段，表示一个handler在一个请求超时前，必须保持它处于打开状态的最小秒数。当前只对监听请求handler有效，它基于这个值选择一个随机数作为连接超时值，以达到分散负载的目的（默认值1800）。
<!--      
      --oidc-ca-file string                                     If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.
-->      
      --oidc-ca-file string                                    如果设置该值，将会使用oidc-ca-file中的任意一个authority对OpenID服务的证书进行验证，否则将会使用主机的根CA对其进行验证。
<!--      
      --oidc-client-id string                                   The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.
-->      
      --oidc-client-id string                                   使用OpenID连接的客户端的ID，如果设置了oidc-issuer-url，则必须设置这个值。
<!--       
      --oidc-groups-claim string                                If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.
-->       
      --oidc-groups-claim string                                如果提供该值，这个自定义OpenID连接名将指定给特定的用户组。该声明值需要是一个字符串或字符串数组。此标志为实验性的，请查阅验证相关文档进一步了解详细信息。
<!--      
      --oidc-issuer-url string                                  The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).
-->
      --oidc-issuer-url string                                  OpenID颁发者URL，只接受HTTPS方案。如果设置该值，它将被用于验证OIDC JSON Web Token(JWT)。
<!--      
      --oidc-username-claim string                              The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details. (default "sub")
-->      
      --oidc-username-claim string                              用作用户名的OpenID声明值。注意，不保证除默认 ('sub')外的其他声明值的唯一性和不变性。此标志为实验性的，请查阅验证相关文档进一步了解详细信息。
 <!--      
      --profiling                                               Enable profiling via web interface host:port/debug/pprof/ (default true)
-->      
      --profiling                                               在web接口host:port/debug/pprof/上启用profiling。（默认值true）
 <!--      
      --proxy-client-cert-file string                           Client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins. It is expected that this cert includes a signature from the CA in the --requestheader-client-ca-file flag. That CA is published in the 'extension-apiserver-authentication' configmap in the kube-system namespace. Components recieving calls from kube-aggregator should use that CA to perform their half of the mutual TLS verification.
-->      
      --proxy-client-cert-file string                           当必须调用外部程序时，用于证明aggregator或者kube-apiserver的身份的客户端证书。包括代理到用户api-server的请求和调用webhook准入控制插件的请求。它期望这个证书包含一个来自于CA中的--requestheader-client-ca-file标记的签名。该CA在kube-system命名空间的'extension-apiserver-authentication' configmap中发布。从Kube-aggregator收到调用的组件应该使用该CA进行他们部分的双向TLS验证。
<!--      
      --proxy-client-key-file string                            Private key for the client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins.
--> 
      --proxy-client-key-file string                            当必须调用外部程序时，用于证明aggregator或者kube-apiserver的身份的客户端证书密钥。包括代理到用户api-server的请求和调用webhook准入控制插件的请求。
<!--      
      --repair-malformed-updates                                If true, server will do its best to fix the update request to pass the validation, e.g., setting empty UID in update request to its existing value. This flag can be turned off after we fix all the clients that send malformed updates. (default true)
-->      
      --repair-malformed-updates                                如果为true，服务将会尽力修复更新请求以通过验证，例如：将更新请求UID的当前值设置为空。在我们修复了所有发送错误格式请求的客户端后，可以关闭这个标志。
<!--      
      --requestheader-allowed-names stringSlice                 List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.
-->
      --requestheader-allowed-names stringSlice                 使用--requestheader-username-headers指定的，允许在头部提供用户名的客户端证书通用名称列表。如果为空，任何通过--requestheader-client-ca-file中authorities验证的客户端证书都是被允许的。
<!--      
      --requestheader-client-ca-file string                     Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers
-->      
      --requestheader-client-ca-file string                     在信任请求头中以--requestheader-username-headers指示的用户名之前，用于验证接入请求中客户端证书的根证书捆绑。
<!--      
      --requestheader-extra-headers-prefix stringSlice          List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->      
      --requestheader-extra-headers-prefix stringSlice          用于检查的请求头的前缀列表。建议使用X-Remote-Extra-。
<!--       
      --requestheader-group-headers stringSlice                 List of request headers to inspect for groups. X-Remote-Group is suggested.
 -->
      --requestheader-group-headers stringSlice                 用于检查群组的请求头列表。建议使用X-Remote-Group.
 <!--      
      --requestheader-username-headers stringSlice              List of request headers to inspect for usernames. X-Remote-User is common.
 -->      
      --requestheader-username-headers stringSlice              用于检查用户名的请求头列表。建议使用X-Remote-User。
 <!--      
      --runtime-config mapStringString                          A set of key=value pairs that describe runtime configuration that may be passed to apiserver. apis/<groupVersion> key can be used to turn on/off specific api versions. apis/<groupVersion>/<resource> can be used to turn on/off specific resources. api/all and api/legacy are special keys to control all and legacy api versions respectively.
 -->      
      --runtime-config mapStringString                          传递给apiserver用于描述运行时配置的键值对集合。 apis/<groupVersion>键可以被用来打开/关闭特定的api版本。apis/<groupVersion>/<resource>键被用来打开/关闭特定的资源. api/all和api/legacy键分别用于控制所有的和遗留的api版本.
 <!--       
      --secure-port int                                         The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all. (default 6443)
 -->       
      --secure-port int                                         用于监听具有认证授权功能的HTTPS协议的端口。如果为0，则不会监听HTTPS协议。 （默认值6443)
 <!--      
      --service-account-key-file stringArray                    File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. If unspecified, --tls-private-key-file is used. The specified file can contain multiple keys, and the flag can be specified multiple times with different files.
 -->      
      --service-account-key-file stringArray                    包含PEM加密的x509 RSA或ECDSA私钥或公钥的文件，用于验证ServiceAccount令牌。如果设置该值，--tls-private-key-file将会被使用。指定的文件可以包含多个密钥，并且这个标志可以和不同的文件一起多次使用。
<!--      
      --service-account-lookup                                  If true, validate ServiceAccount tokens exist in etcd as part of authentication. (default true)
      --service-account-lookup                                  如果为true，将验证etcd中存在的ServiceAccount令牌作为部分的认证过程. (default true)
<!--      
      --service-cluster-ip-range ipNet                          A CIDR notation IP range from which to assign service cluster IPs. This must not overlap with any IP ranges assigned to nodes for pods.
 -->      
      --service-cluster-ip-range ipNet                          CIDR表示的IP范围，服务的cluster ip将从中分配。 一定不要和分配给nodes和pods的IP范围产生重叠。
<!--      
      --service-node-port-range portRange                       A port range to reserve for services with NodePort visibility. Example: '30000-32767'. Inclusive at both ends of the range. (default 30000-32767)
      --service-node-port-range portRange                       为使用NodePort模式访问服务而保留的端口范围。例如：'30000-32767'。包括范围的两端。（默认值30000-32767）
<!--      
      --ssh-keyfile string                                      If non-empty, use secure SSH proxy to the nodes, using this user keyfile
 -->      
      --ssh-keyfile string                                      如果不为空，在使用安全的SSH代理访问节点时，将这个文件作为用户密钥文件。
<!--      
      --ssh-user string                                         If non-empty, use secure SSH proxy to the nodes, using this user name
      --ssh-user string                                         如果不为空，在使用安全的SSH代理访问节点时，将使用这个用户名。
<!--      
      --storage-backend string                                  The storage backend for persistence. Options: 'etcd3' (default), 'etcd2'.
 -->      
      --storage-backend string                                  持久化存储后端。 选项为: 'etcd3' (默认), 'etcd2'.
<!--     
      --storage-media-type string                               The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting. (default "application/vnd.kubernetes.protobuf")
  -->     
      --storage-media-type string                               在存储中保存对象的媒体类型。某些资源或者存储后端可能仅支持特定的媒体类型，并且忽略该配置项。（默认值 "application/vnd.kubernetes.protobuf")
<!--      
      --storage-versions string                                 The per-group version to store resources in. Specified in the format "group1/version1,group2/version2,...". In the case where objects are moved from one group to the other, you may specify the format "group1=group2/v1beta1,group3/v1beta1,...". You only need to pass the groups you wish to change from the defaults. It defaults to a list of preferred versions of all registered groups, which is derived from the KUBE_API_VERSIONS environment variable. (default "admission.k8s.io/v1alpha1,admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,imagepolicy.k8s.io/v1alpha1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")
 -->      
      --storage-versions string                                 按组划分资源存储的版本。 以"group1/version1,group2/version2,..."的格式指定。当对象从一组移动到另一组时, 你可以指定"group1=group2/v1beta1,group3/v1beta1,..."的格式。你只需要传入你希望从结果中改变的组的列表。默认为从KUBE_API_VERSIONS环境变量集成而来，所有注册组的首选版本列表。 （默认值"admission.k8s.io/v1alpha1,admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,imagepolicy.k8s.io/v1alpha1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")
<!--      
      --target-ram-mb int                                       Memory limit for apiserver in MB (used to configure sizes of caches, etc.)
-->      
      --target-ram-mb int                                       apiserver内存限制，单位为MB(用于配置缓存大小等)。
<!--      
      --tls-ca-file string                                      If set, this certificate authority will used for secure access from Admission Controllers. This must be a valid PEM-encoded CA bundle. Altneratively, the certificate authority can be appended to the certificate provided by --tls-cert-file.
-->      
      --tls-ca-file string                                      如果设置该值，这个证书authority将会被用于从Admission Controllers过来的安全访问。它必须是一个PEM加密的合法CA捆绑包。此外, 该证书authority可以被添加到以--tls-cert-file提供的证书文件中.
<!--      
      --tls-cert-file string                                    File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to /var/run/kubernetes.
-->      
      --tls-cert-file string                                    包含用于HTTPS的默认x509证书的文件。（如果有CA证书，则附加于server证书之后）。如果启用了HTTPS服务，并且没有提供--tls-cert-file和--tls-private-key-file，则将为公共地址生成一个自签名的证书和密钥并保存于/var/run/kubernetes目录。
<!--      
      --tls-private-key-file string                             File containing the default x509 private key matching --tls-cert-file.
-->      
      --tls-private-key-file string                             包含匹配--tls-cert-file的x509证书私钥的文件。
<!--      
      --tls-sni-cert-key namedCertKey                           A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". (default [])
-->      
      --tls-sni-cert-key namedCertKey                           一对x509证书和私钥的文件路径, 可以使用符合正式域名的域形式作为后缀。 如果没有提供域形式后缀, 则将提取证书名。 非通配符版本优先于通配符版本, 显示的域形式优先于证书中提取的名字。 对于多个密钥/证书对, 请多次使用--tls-sni-cert-key。例如: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". （默认值[])
<!--      
      --token-auth-file string                                  If set, the file that will be used to secure the secure port of the API server via token authentication.
-->      
      --token-auth-file string                                  如果设置该值，这个文件将被用于通过令牌认证来保护API服务的安全端口。
<!--      
      --version version[=true]                                  Print version information and quit
-->      
      --version version[=true]                                  打印版本信息并退出。
<!--      
      --watch-cache                                             Enable watch caching in the apiserver (default true)
-->      
      --watch-cache                                             启用apiserver的监视缓存。（默认值true）
<!--      
      --watch-cache-sizes stringSlice                           List of watch cache sizes for every resource (pods, nodes, etc.), comma separated. The individual override format: resource#size, where size is a number. It takes effect when watch-cache is enabled.
-->      
      --watch-cache-sizes stringSlice                           每种资源（pods, nodes等）的监视缓存大小列表，以逗号分隔。每个缓存配置的形式为：resource#size，size是一个数字。在watch-cache启用时生效。
```

###### Auto generated by spf13/cobra on 11-Jul-2017
