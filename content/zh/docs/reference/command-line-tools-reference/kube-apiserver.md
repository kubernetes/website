---
title: kube-apiserver
notitle: true
---
## kube-apiserver



### 概要


Kubernetes API server 为 api 对象验证并配置数据，包括 pods、 services、 replicationcontrollers 和其它 api 对象。API Server 提供 REST 操作和到集群共享状态的前端，所有其他组件通过它进行交互。

```
kube-apiserver
```

### 选项
```

      --admission-control stringSlice                           控制资源进入集群的准入控制插件的顺序列表。逗号分隔的 NamespaceLifecycle 列表。（默认值 [AlwaysAdmit]）

      --admission-control-config-file string                    包含准入控制配置的文件。

      --advertise-address ip                                    向集群成员通知 apiserver 消息的 IP 地址。这个地址必须能够被集群中其他成员访问。如果 IP 地址为空，将会使用 --bind-address，如果未指定 --bind-address，将会使用主机的默认接口地址。

      --allow-privileged                                        如果为 true, 将允许特权容器。

      --anonymous-auth                                          启用到 API server 的安全端口的匿名请求。未被其他认证方法拒绝的请求被当做匿名请求。匿名请求的用户名为 system:anonymous，用户组名为 system:unauthenticated。（默认值 true）

      --apiserver-count int                                     集群中运行的 apiserver 数量，必须为正数。（默认值 1）

      --audit-log-maxage int                                    基于文件名中的时间戳，旧审计日志文件的最长保留天数。

      --audit-log-maxbackup int                                 旧审计日志文件的最大保留个数。

      --audit-log-maxsize int                                   审计日志被轮转前的最大兆字节数。

      --audit-log-path string                                   如果设置该值，所有到 apiserver 的请求都将会被记录到这个文件。'-' 表示记录到标准输出。

      --audit-policy-file string                                定义审计策略配置的文件的路径。需要打开 'AdvancedAuditing' 特性开关。AdvancedAuditing 需要一个配置来启用审计功能。

      --audit-webhook-config-file string                        一个具有 kubeconfig 格式文件的路径，该文件定义了审计的 webhook 配置。需要打开 'AdvancedAuditing' 特性开关。

      --audit-webhook-mode string                               发送审计事件的策略。 Blocking 模式表示正在发送事件时应该阻塞服务器的响应。 Batch 模式使 webhook 异步缓存和发送事件。 Known 模式为 batch,blocking。（默认值 "batch")

      --authentication-token-webhook-cache-ttl duration         从 webhook 令牌认证者获取的响应的缓存时长。( 默认值 2m0s)

      --authentication-token-webhook-config-file string         包含 webhook 配置的文件，用于令牌认证，具有 kubeconfig 格式。API server 将查询远程服务来决定对 bearer 令牌的认证。

      --authorization-mode string                               在安全端口上进行权限验证的插件的顺序列表。以逗号分隔的列表，包括：AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.（默认值 "AlwaysAllow"）

      --authorization-policy-file string                        包含权限验证策略的 csv 文件，和 --authorization-mode=ABAC 一起使用，作用在安全端口上。

      --authorization-webhook-cache-authorized-ttl duration     从 webhook 授权者获得的 'authorized' 响应的缓存时长。（默认值 5m0s）

      --authorization-webhook-cache-unauthorized-ttl duration   从 webhook 授权者获得的 'unauthorized' 响应的缓存时长。（默认值 30s）

      --authorization-webhook-config-file string                包含 webhook 配置的 kubeconfig 格式文件，和 --authorization-mode=Webhook 一起使用。API server 将查询远程服务来决定对 API server 安全端口的访问。

      --azure-container-registry-config string                  包含 Azure 容器注册表配置信息的文件的路径。

      --bind-address ip                                         监听 --seure-port 的 IP 地址。被关联的接口必须能够被集群其它节点和 CLI/web 客户端访问。如果为空，则将使用所有接口（0.0.0.0）。（默认值 0.0.0.0）

      --cert-dir string                                         存放 TLS 证书的目录。如果提供了 --tls-cert-file 和 --tls-private-key-file 选项，该标志将被忽略。（默认值 "/var/run/kubernetes"）

      --client-ca-file string                                   如果设置此标志，对于任何请求，如果存包含 client-ca-file 中的 authorities 签名的客户端证书，将会使用客户端证书中的 CommonName 对应的身份进行认证。

      --cloud-config string                                     云服务提供商配置文件路径。空字符串表示无配置文件 .

      --cloud-provider string                                   云服务提供商，空字符串表示无提供商。

      --contention-profiling                                    如果已经启用 profiling，则启用锁竞争 profiling。

      --cors-allowed-origins stringSlice                        CORS 的域列表，以逗号分隔。合法的域可以是一个匹配子域名的正则表达式。如果这个列表为空则不会启用 CORS.

      --delete-collection-workers int                           用于 DeleteCollection 调用的工作者数量。这被用于加速 namespace 的清理。( 默认值 1)

      --deserialization-cache-size int                          在内存中缓存的反序列化 json 对象的数量。

      --enable-aggregator-routing                               打开到 endpoints IP 的 aggregator 路由请求，替换 cluster IP。

      --enable-garbage-collector                                启用通用垃圾回收器 . 必须与 kube-controller-manager 对应的标志保持同步。 （默认值 true）

      --enable-logs-handler                                     如果为 true，则为 apiserver 日志功能安装一个 /logs 处理器。（默认值 true）

      --enable-swagger-ui                                       在 apiserver 的 /swagger-ui 路径启用 swagger ui。

      --etcd-cafile string                                      用于保护 etcd 通信的 SSL CA 文件。

      --etcd-certfile string                                    用于保护 etcd 通信的的 SSL 证书文件。

      --etcd-keyfile string                                     用于保护 etcd 通信的 SSL 密钥文件 .

      --etcd-prefix string                                      附加到所有 etcd 中资源路径的前缀。 （默认值 "/registry"）

      --etcd-quorum-read                                        如果为 true, 启用 quorum 读。

      --etcd-servers stringSlice                                连接的 etcd 服务器列表 , 形式为（scheme://ip:port)，使用逗号分隔。

      --etcd-servers-overrides stringSlice                      针对单个资源的 etcd 服务器覆盖配置 , 以逗号分隔。 单个配置覆盖格式为 : group/resource#servers, 其中 servers 形式为 http://ip:port, 以分号分隔。

      --event-ttl duration                                      事件驻留时间。（默认值 1h0m0s)

      --enable-bootstrap-token-auth                             启用此选项以允许 'kube-system' 命名空间中的 'bootstrap.kubernetes.io/token' 类型密钥可以被用于 TLS 的启动认证。

      --experimental-encryption-provider-config string          包含加密提供程序的配置的文件，该加密提供程序被用于在 etcd 中保存密钥。

      --external-hostname string                                为此 master 生成外部 URL 时使用的主机名 ( 例如 Swagger API 文档 )。

      --feature-gates mapStringBool                             一个描述 alpha/experimental 特性开关的键值对列表。 选项包括 :
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

      --google-json-key string                                  用于认证的 Google Cloud Platform 服务账号的 JSON 密钥。

      --insecure-allow-any-token username/group1,group2         如果设置该值 , 你的服务将处于非安全状态。任何令牌都将会被允许，并将从令牌中把用户信息解析成为 username/group1,group2。

      --insecure-bind-address ip                                用于监听 --insecure-port 的 IP 地址 ( 设置成 0.0.0.0 表示监听所有接口 )。（默认值 127.0.0.1)

      --insecure-port int                                       用于监听不安全和为认证访问的端口。这个配置假设你已经设置了防火墙规则，使得这个端口不能从集群外访问。对集群的公共地址的 443 端口的访问将被代理到这个端口。默认设置中使用 nginx 实现。（默认值 8080）

      --kubelet-certificate-authority string                    证书 authority 的文件路径。

      --kubelet-client-certificate string                       用于 TLS 的客户端证书文件路径。

      --kubelet-client-key string                               用于 TLS 的客户端证书密钥文件路径 .

      --kubelet-https                                           为 kubelet 启用 https。 （默认值 true）

      --kubelet-preferred-address-types stringSlice             用于 kubelet 连接的首选 NodeAddressTypes 列表。 ( 默认值[Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP])

      --kubelet-read-only-port uint                             已废弃 : kubelet 端口 . （默认值 10255）

      --kubelet-timeout duration                                kubelet 操作超时时间。（默认值
      5s）

      --kubernetes-service-node-port int                        如果不为 0，Kubernetes master 服务（用于创建 / 管理 apiserver）将会使用 NodePort 类型，并将这个值作为端口号。如果为 0，Kubernetes master 服务将会使用 ClusterIP 类型。

      --master-service-namespace string                         已废弃 : 注入到 pod 中的 kubernetes master 服务的命名空间。（默认值 "default"）

      --max-connection-bytes-per-sec int                        如果不为 0，每个用户连接将会被限速为该值（bytes/sec）。当前只应用于长时间运行的请求。

      --max-mutating-requests-inflight int                      在给定时间内进行中可变请求的最大数量。当超过该值时，服务将拒绝所有请求。0 值表示没有限制。（默认值 200）

      --max-requests-inflight int                               在给定时间内进行中不可变请求的最大数量。当超过该值时，服务将拒绝所有请求。0 值表示没有限制。（默认值 400）

      --min-request-timeout int                                 一个可选字段，表示一个 handler 在一个请求超时前，必须保持它处于打开状态的最小秒数。当前只对监听请求 handler 有效，它基于这个值选择一个随机数作为连接超时值，以达到分散负载的目的（默认值 1800）。

      --oidc-ca-file string                                    如果设置该值，将会使用 oidc-ca-file 中的任意一个 authority 对 OpenID 服务的证书进行验证，否则将会使用主机的根 CA 对其进行验证。

      --oidc-client-id string                                   使用 OpenID 连接的客户端的 ID，如果设置了 oidc-issuer-url，则必须设置这个值。

      --oidc-groups-claim string                                如果提供该值，这个自定义 OpenID 连接名将指定给特定的用户组。该声明值需要是一个字符串或字符串数组。此标志为实验性的，请查阅验证相关文档进一步了解详细信息。

      --oidc-issuer-url string                                  OpenID 颁发者 URL，只接受 HTTPS 方案。如果设置该值，它将被用于验证 OIDC JSON Web Token(JWT)。

      --oidc-username-claim string                              用作用户名的 OpenID 声明值。注意，不保证除默认 ('sub') 外的其他声明值的唯一性和不变性。此标志为实验性的，请查阅验证相关文档进一步了解详细信息。

      --profiling                                               在 web 接口 host:port/debug/pprof/ 上启用 profiling。（默认值 true）

      --proxy-client-cert-file string                           当必须调用外部程序时，用于证明 aggregator 或者 kube-apiserver 的身份的客户端证书。包括代理到用户 api-server 的请求和调用 webhook 准入控制插件的请求。它期望这个证书包含一个来自于 CA 中的 --requestheader-client-ca-file 标记的签名。该 CA 在 kube-system 命名空间的 'extension-apiserver-authentication' configmap 中发布。从 Kube-aggregator 收到调用的组件应该使用该 CA 进行他们部分的双向 TLS 验证。

      --proxy-client-key-file string                            当必须调用外部程序时，用于证明 aggregator 或者 kube-apiserver 的身份的客户端证书密钥。包括代理到用户 api-server 的请求和调用 webhook 准入控制插件的请求。

      --repair-malformed-updates                                如果为 true，服务将会尽力修复更新请求以通过验证，例如：将更新请求 UID 的当前值设置为空。在我们修复了所有发送错误格式请求的客户端后，可以关闭这个标志。

      --requestheader-allowed-names stringSlice                 使用 --requestheader-username-headers 指定的，允许在头部提供用户名的客户端证书通用名称列表。如果为空，任何通过 --requestheader-client-ca-file 中 authorities 验证的客户端证书都是被允许的。

      --requestheader-client-ca-file string                     在信任请求头中以 --requestheader-username-headers 指示的用户名之前，用于验证接入请求中客户端证书的根证书捆绑。

      --requestheader-extra-headers-prefix stringSlice          用于检查的请求头的前缀列表。建议使用 X-Remote-Extra-。

      --requestheader-group-headers stringSlice                 用于检查群组的请求头列表。建议使用 X-Remote-Group.

      --requestheader-username-headers stringSlice              用于检查用户名的请求头列表。建议使用 X-Remote-User。

      --runtime-config mapStringString                          传递给 apiserver 用于描述运行时配置的键值对集合。 apis/<groupVersion> 键可以被用来打开 / 关闭特定的 api 版本。apis/<groupVersion>/<resource> 键被用来打开 / 关闭特定的资源 . api/all 和 api/legacy 键分别用于控制所有的和遗留的 api 版本 .

      --secure-port int                                         用于监听具有认证授权功能的 HTTPS 协议的端口。如果为 0，则不会监听 HTTPS 协议。 （默认值 6443)

      --service-account-key-file stringArray                    包含 PEM 加密的 x509 RSA 或 ECDSA 私钥或公钥的文件，用于验证 ServiceAccount 令牌。如果设置该值，--tls-private-key-file 将会被使用。指定的文件可以包含多个密钥，并且这个标志可以和不同的文件一起多次使用。

      --service-cluster-ip-range ipNet                          CIDR 表示的 IP 范围，服务的 cluster ip 将从中分配。 一定不要和分配给 nodes 和 pods 的 IP 范围产生重叠。

      --ssh-keyfile string                                      如果不为空，在使用安全的 SSH 代理访问节点时，将这个文件作为用户密钥文件。

      --storage-backend string                                  持久化存储后端。 选项为 : 'etcd3' ( 默认 ), 'etcd2'.

      --storage-media-type string                               在存储中保存对象的媒体类型。某些资源或者存储后端可能仅支持特定的媒体类型，并且忽略该配置项。（默认值 "application/vnd.kubernetes.protobuf")

      --storage-versions string                                 按组划分资源存储的版本。 以 "group1/version1,group2/version2,..." 的格式指定。当对象从一组移动到另一组时 , 你可以指定 "group1=group2/v1beta1,group3/v1beta1,..." 的格式。你只需要传入你希望从结果中改变的组的列表。默认为从 KUBE_API_VERSIONS 环境变量集成而来，所有注册组的首选版本列表。 （默认值 "admission.k8s.io/v1alpha1,admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates.k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,imagepolicy.k8s.io/v1alpha1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings.k8s.io/v1alpha1,storage.k8s.io/v1,v1")

      --target-ram-mb int                                       apiserver 内存限制，单位为 MB( 用于配置缓存大小等 )。

      --tls-ca-file string                                      如果设置该值，这个证书 authority 将会被用于从 Admission Controllers 过来的安全访问。它必须是一个 PEM 加密的合法 CA 捆绑包。此外 , 该证书 authority 可以被添加到以 --tls-cert-file 提供的证书文件中 .

      --tls-cert-file string                                    包含用于 HTTPS 的默认 x509 证书的文件。（如果有 CA 证书，则附加于 server 证书之后）。如果启用了 HTTPS 服务，并且没有提供 --tls-cert-file 和 --tls-private-key-file，则将为公共地址生成一个自签名的证书和密钥并保存于 /var/run/kubernetes 目录。

      --tls-private-key-file string                             包含匹配 --tls-cert-file 的 x509 证书私钥的文件。

      --tls-sni-cert-key namedCertKey                           一对 x509 证书和私钥的文件路径 , 可以使用符合正式域名的域形式作为后缀。 如果没有提供域形式后缀 , 则将提取证书名。 非通配符版本优先于通配符版本 , 显示的域形式优先于证书中提取的名字。 对于多个密钥 / 证书对, 请多次使用 --tls-sni-cert-key。例如 : "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". （默认值[])

      --token-auth-file string                                  如果设置该值，这个文件将被用于通过令牌认证来保护 API 服务的安全端口。

      --version version[=true]                                  打印版本信息并退出。

      --watch-cache                                             启用 apiserver 的监视缓存。（默认值 true）

      --watch-cache-sizes stringSlice                           每种资源（pods, nodes 等）的监视缓存大小列表，以逗号分隔。每个缓存配置的形式为：resource#size，size 是一个数字。在 watch-cache 启用时生效。
```

###### Auto generated by spf13/cobra on 11-Jul-2017
