---
title: kube-proxy
notitle: true
cn-approvers:
- chentao1596
---
## kube-proxy



<!--
### Synopsis
-->
### 摘要


<!--
The Kubernetes network proxy runs on each node. This
reflects services as defined in the Kubernetes API on each node and can do simple
TCP,UDP stream forwarding or round robin TCP,UDP forwarding across a set of backends.
Service cluster ips and ports are currently found through Docker-links-compatible
environment variables specifying ports opened by the service proxy. There is an optional
addon that provides cluster DNS for these cluster IPs. The user must create a service
with the apiserver API to configure the proxy.
-->
Kubernetes 网络代理运行在 node 上。它反映了 node 上 Kubernetes API 中定义的服务，并可以通过一组后端进行简单的 TCP、UDP 流转发或循环模式（round robin)）的 TCP、UDP 转发。目前，服务的集群 IP 和端口是通过 Docker-links 兼容的环境变量发现的，这些环境变量指定了服务代码打开的端口。有一个可选的 addon 为这些集群 IP 提供集群 DNS。用户必须使用 apiserver API 创建一个服务来配置代理。

```
kube-proxy
```

<!--
### Options
-->
### 选项

```
<!--
      --azure-container-registry-config string       Path to the file container Azure container registry configuration information.
-->
      --azure-container-registry-config string       包含 Azure 容器注册配置信息的文件路径。
<!--
      --bind-address ip                              The IP address for the proxy server to serve on (set to 0.0.0.0 for all interfaces) (default 0.0.0.0)
-->
      --bind-address ip                              代理服务器提供服务的 IP 地址（设置为 0.0.0.0 代表在所有接口上提供服务）（默认为 0.0.0.0）
<!--
      --cleanup                                      If true cleanup iptables and ipvs rules and exit.
-->
      --cleanup                                      如果为 true，退出时清理 iptables 和 ipvs 规则。
<!--
      --cluster-cidr string                          The CIDR range of pods in the cluster. When configured, traffic sent to a Service cluster IP from outside this range will be masqueraded and traffic sent from pods to an external LoadBalancer IP will be directed to the respective cluster IP instead
-->
      --cluster-cidr string                          集群中 pod 的 CIDR 范围。配置后，从此范围外发送到服务集群 IP 的流量将被伪装，从 pod 发送到外部 LoadBalancer IP 的流量将被定向到相应的集群 IP
<!--
      --config string                                The path to the configuration file.
-->
      --config string                                配置文件的路径。
<!--
      --config-sync-period duration                  How often configuration from the apiserver is refreshed.  Must be greater than 0. (default 15m0s)
-->
      --config-sync-period duration                  从 apiserver 获取数据的频率。必须大于0。（默认 15m0s）
<!--
      --conntrack-max-per-core int32                 Maximum number of NAT connections to track per CPU core (0 to leave the limit as-is and ignore conntrack-min). (default 32768)
-->
      --conntrack-max-per-core int32                 跟踪每个 CPU 核的 NAT 连接的最大数量（0 表示不配置并忽略 conntrack-min）。（默认 32768）
<!--
      --conntrack-min int32                          Minimum number of conntrack entries to allocate, regardless of conntrack-max-per-core (set conntrack-max-per-core=0 to leave the limit as-is). (default 131072)
-->
      --conntrack-min int32                          要分配的 conntrack 条目的最小数目, 不管 conntrack-max-per-core 是多少（设置 conntrack-max-per-core=0 会让该配置失效）。（默认 131072）
<!--
      --conntrack-tcp-timeout-close-wait duration    NAT timeout for TCP connections in the CLOSE_WAIT state (default 1h0m0s)
-->
      --conntrack-tcp-timeout-close-wait duration    CLOSE_WAIT 状态下 TCP 连接的 NAT 超时时间（默认 1h0m0s）
<!--
      --conntrack-tcp-timeout-established duration   Idle timeout for established TCP connections (0 to leave as-is) (default 24h0m0s)
-->
      --conntrack-tcp-timeout-established duration   已建立的 TCP 连接的空闲超时时间（0 表示不配置）（默认 24h0m0s）
<!--
      --feature-gates mapStringBool                  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
-->
      --feature-gates mapStringBool                  一组 key=value 对，用于描述 “alpha/实验特性” 的开关。可选项包括：
APIListChunking=true|false (ALPHA - default=false)
APIResponseCompression=true|false (ALPHA - default=false)
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (BETA - default=true)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
CPUManager=true|false (ALPHA - default=false)
CustomResourceValidation=true|false (ALPHA - default=false)
DebugContainers=true|false (ALPHA - default=false)
DevicePlugins=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
EnableEquivalenceClassCache=true|false (ALPHA - default=false)
ExpandPersistentVolumes=true|false (ALPHA - default=false)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
HugePages=true|false (ALPHA - default=false)
Initializers=true|false (ALPHA - default=false)
KubeletConfigFile=true|false (ALPHA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
MountPropagation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
PodPriority=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (BETA - default=true)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
TaintBasedEvictions=true|false (ALPHA - default=false)
TaintNodesByCondition=true|false (ALPHA - default=false)
<!--
      --google-json-key string                       The Google Cloud Platform Service Account JSON Key to use for authentication.
-->
      --google-json-key string                       用于身份认证的 Google 云平台服务账户 JSON 密钥。
<!--
      --healthz-bind-address ip                      The IP address and port for the health check server to serve on (set to 0.0.0.0 for all interfaces) (default 0.0.0.0:10256)
-->
      --healthz-bind-address ip                      健康检查服务提供服务的 IP 地址和端口（设置为 0.0.0.0 代表在所有接口上提供服务）（默认 0.0.0.0:10256）
<!--
      --healthz-port int32                           The port to bind the health check server. Use 0 to disable. (default 10256)
-->
      --healthz-port int32                           绑定健康检查服务的端口。使用 0 表示禁用服务（默认 10256）
<!--
      --hostname-override string                     If non-empty, will use this string as identification instead of the actual hostname.
-->
      --hostname-override string                     如果非空，将使用此字符串作为主机标识，而不是实际的主机名。
<!--
      --iptables-masquerade-bit int32                If using the pure iptables proxy, the bit of the fwmark space to mark packets requiring SNAT with.  Must be within the range [0, 31]. (default 14)
-->
      --iptables-masquerade-bit int32                如果使用纯 iptables 代理，这个 fwmark 空间的位用来标记需要 SNAT 的数据包。必须在范围 [0，31] 以内。（默认 14）
<!--
      --iptables-min-sync-period duration            The minimum interval of how often the iptables rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
      --iptables-min-sync-period duration            随着 endpoint 和 service 的变化，可以刷新 iptables 规则的最小间隔（例如 '5s'，'1m'，'2h22m'）。
<!--
      --iptables-sync-period duration                The maximum interval of how often iptables rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0. (default 30s)
-->
      --iptables-sync-period duration                iptables 规则刷新的最大间隔（例如 '5s'，'1m'，'2h22m'）。必须大于 0 （默认 30s）
<!--
      --ipvs-min-sync-period duration                The minimum interval of how often the ipvs rules can be refreshed as endpoints and services change (e.g. '5s', '1m', '2h22m').
-->
      --ipvs-min-sync-period duration                随着 endpoint 和 service 的变化，可以刷新 ipvs 规则的最小间隔（例如 '5s'，'1m'，'2h22m'）（例如 '5s'，'1m'，'2h22m'）。
<!--
      --ipvs-scheduler string                        The ipvs scheduler type when proxy mode is ipvs
-->
      --ipvs-scheduler string                        代理模式为 ipvs 时的 ipvs 调度类型
<!--
      --ipvs-sync-period duration                    The maximum interval of how often ipvs rules are refreshed (e.g. '5s', '1m', '2h22m').  Must be greater than 0.
-->
      --ipvs-sync-period duration                    ipvs 规则刷新的最大间隔（例如 '5s'，'1m'，'2h22m'）。必须大于 0。
<!--
      --kube-api-burst int                           Burst to use while talking with kubernetes apiserver (default 10)
-->
      --kube-api-burst int                           与 kubernetes apiserver 通信时使用的 Burst（默认 10）
<!--
      --kube-api-content-type string                 Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")
-->
      --kube-api-content-type string                 发送到 apiserver 的内容类型。（默认 "application/vnd.kubernetes.protobuf"）
<!--
      --kube-api-qps float32                         QPS to use while talking with kubernetes apiserver (default 5)
-->
      --kube-api-qps float32                         与 kubernetes apiserver 通信时使用的 QPS（默认 5）
<!--
      --kubeconfig string                            Path to kubeconfig file with authorization information (the master location is set by the master flag).
-->
      --kubeconfig string                            包含鉴权信息的 kubeconfig 文件路径（master 的位置由 master 标志来设定）
<!--
      --masquerade-all                               If using the pure iptables proxy, SNAT all traffic sent via Service cluster IPs (this not commonly needed)
-->
      --masquerade-all                               如果使用纯 iptables 代理，SNAT 所有流量，将它们改为通过服务集群 IP 发送 (并不常见)
<!--
      --master string                                The address of the Kubernetes API server (overrides any value in kubeconfig)
-->
      --master string                                Kubernetes API 服务的地址（会覆盖 kubeconfig 文件中设定的值）
<!--
      --metrics-bind-address ip                      The IP address and port for the metrics server to serve on (set to 0.0.0.0 for all interfaces) (default 127.0.0.1:10249)
-->
      --metrics-bind-address ip                      度量服务提供服务的 IP 地址和端口（设置为 0.0.0.0 代表在所有接口上提供服务）（默认 127.0.0.1:10249）
<!--
      --oom-score-adj int32                          The oom-score-adj value for kube-proxy process. Values must be within the range [-1000, 1000] (default -999)
-->
      --oom-score-adj int32                          kube-proxy 进程的 oom-score-adj 值。必须在 [-1000, 1000] 范围内（默认 -999）
<!--
      --profiling                                    If true enables profiling via web interface on /debug/pprof handler.
-->
      --profiling                                    如果为 true，则能够通过 /debug/pprof 处理器上的 web 接口执行 profiling。
<!--
      --proxy-mode ProxyMode                         Which proxy mode to use: 'userspace' (older) or 'iptables' (faster) or 'ipvs'(experimental)'. If blank, use the best-available proxy (currently iptables).  If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are insufficient, this always falls back to the userspace proxy.
-->
      --proxy-mode ProxyMode                         使用的代理模式：'userspace'（旧一些的方式） 或者 'iptables'（更快的方式）或者 'ipvs'（实验性的方式）。如果为空，将使用最佳可用的代理（目前是 iptables）。如果选择了 iptables 代理，但是系统的内核或 iptables 版本不够，不管怎么样都会回到使用 userspace 代理。
<!--
      --proxy-port-range port-range                  Range of host ports (beginPort-endPort, inclusive) that may be consumed in order to proxy service traffic. If unspecified (0-0) then ports will be randomly chosen.
-->
      --proxy-port-range port-range                  为了代理服务流量而使用的主机端口的范围（开始端口-结束端口，闭区间）。如果没有指定（0-0），则随机选择端口。
<!--
      --udp-timeout duration                         How long an idle UDP connection will be kept open (e.g. '250ms', '2s').  Must be greater than 0. Only applicable for proxy-mode=userspace (default 250ms)
-->
      --udp-timeout duration                         空闲的 UDP 连接将保持打开状态的时长(例如 “250 ms”、“2s”)。必须大于0。只适用于 proxy-mode=userspace（默认 250 ms）
<!--
      --version version[=true]                       Print version information and quit
-->
      --version version[=true]                       打印版本信息并退出
<!--
      --write-config-to string                       If set, write the default configuration values to this file and exit.
-->
      --write-config-to string                       如果设置了，则将默认配置值写入该文件并退出。
```

###### Auto generated by spf13/cobra on 27-Sep-2017
