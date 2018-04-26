---
title: kubelet
notitle: true
---
## kubelet



<!--
### Synopsis


The kubelet is the primary "node agent" that runs on each
node. The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided through
various mechanisms (primarily through the apiserver) and ensures that the containers
described in those PodSpecs are running and healthy. The kubelet doesn't manage
containers which were not created by Kubernetes.

Other than from an PodSpec from the apiserver, there are three ways that a container
manifest can be provided to the Kubelet.

File: Path passed as a flag on the command line. Files under this path will be monitored
periodically for updates. The monitoring period is 20s by default and is configurable
via a flag.

HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This endpoint
is checked every 20 seconds (also configurable with a flag).

HTTP server: The kubelet can also listen for HTTP and respond to a simple API
(underspec'd currently) to submit a new manifest.
-->
### 概要


kubelet 是运行在每个节点上的主要的“节点代理”，它按照 PodSpec 中的描述工作。 PodSpec 是用来描述一个 pod 的 YAML 或者 JSON 对象。kubelet 通过各种机制（主要通过 apiserver ）获取一组 PodSpec 并保证在这些 PodSpec 中描述的容器健康运行。kubelet 不管理不是由 Kubernetes 创建的容器。

除了来自 apiserver 的 PodSpec ，还有 3 种方式可以将容器清单提供给 kubelet 。

文件：在命令行指定的一个路径，在这个路径下的文件将被周期性的监视更新，默认监视周期是 20 秒并可以通过参数配置。

HTTP端点：在命令行指定的一个HTTP端点，该端点每 20 秒被检查一次并且可以通过参数配置检查周期。

HTTP服务：kubelet 还可以监听 HTTP 服务并响应一个简单的 API 来创建一个新的清单。

```
kubelet
```
<!--
### Options
-->
### 选项
<!--
```
      --address ip                                              The IP address for the Kubelet to serve on (set to 0.0.0.0 for all interfaces) (default 0.0.0.0)
      --allow-privileged                                        If true, allow containers to request privileged mode.
      --anonymous-auth                                          Enables anonymous requests to the Kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true)
      --authentication-token-webhook                            Use the TokenReview API to determine authentication for bearer tokens.
      --authentication-token-webhook-cache-ttl duration         The duration to cache responses from the webhook token authenticator. (default 2m0s)
      --authorization-mode string                               Authorization mode for Kubelet server. Valid options are AlwaysAllow or Webhook. Webhook mode uses the SubjectAccessReview API to determine authorization. (default "AlwaysAllow")
      --authorization-webhook-cache-authorized-ttl duration     The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s)
      --authorization-webhook-cache-unauthorized-ttl duration   The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s)
      --azure-container-registry-config string                  Path to the file container Azure container registry configuration information.
      --bootstrap-kubeconfig string                             Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by --kubeconfig does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by --kubeconfig. The client certificate and key file will be stored in the directory pointed by --cert-dir.
      --cadvisor-port int32                                     The port of the localhost cAdvisor endpoint (default 4194)
      --cert-dir string                                         The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/run/kubernetes")
      --cgroup-driver string                                    Driver that the kubelet uses to manipulate cgroups on the host.  Possible values: 'cgroupfs', 'systemd' (default "cgroupfs")
      --cgroup-root string                                      Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default.
      --cgroups-per-qos                                         Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (default true)
      --chaos-chance float                                      If > 0.0, introduce random client errors and latency. Intended for testing.
      --client-ca-file string                                   If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
      --cloud-config string                                     The path to the cloud provider configuration file.  Empty string for no configuration file.
      --cloud-provider string                                   The provider for cloud services. By default, kubelet will attempt to auto-detect the cloud provider. Specify empty string for running with no cloud provider. (default "auto-detect")
      --cluster-dns stringSlice                                 Comma-separated list of DNS server IP address.  This value is used for containers DNS server in case of Pods with "dnsPolicy=ClusterFirst". Note: all DNS servers appearing in the list MUST serve the same set of records otherwise name resolution within the cluster may not work correctly. There is no guarantee as to which DNS server may be contacted for name resolution.
      --cluster-domain string                                   Domain for this cluster.  If set, kubelet will configure all containers to search this domain in addition to the host's search domains
      --cni-bin-dir string                                      <Warning: Alpha feature> The full path of the directory in which to search for CNI plugin binaries. Default: /opt/cni/bin
      --cni-conf-dir string                                     <Warning: Alpha feature> The full path of the directory in which to search for CNI config files. Default: /etc/cni/net.d
      --container-runtime string                                The container runtime to use. Possible values: 'docker', 'rkt'. (default "docker")
      --container-runtime-endpoint string                       [Experimental] The endpoint of remote runtime service. Currently unix socket is supported on Linux, and tcp is supported on windows.  Examples:'unix:///var/run/dockershim.sock', 'tcp://localhost:3735' (default "unix:///var/run/dockershim.sock")
      --containerized                                           Experimental support for running kubelet in a container.  Intended for testing.
      --contention-profiling                                    Enable lock contention profiling, if profiling is enabled
      --cpu-cfs-quota                                           Enable CPU CFS quota enforcement for containers that specify CPU limits (default true)
      --docker-disable-shared-pid                               The Container Runtime Interface (CRI) defaults to using a shared PID namespace for containers in a pod when running with Docker 1.13.1 or higher. Setting this flag reverts to the previous behavior of isolated PID namespaces. This ability will be removed in a future Kubernetes release.
      --docker-endpoint string                                  Use this for the docker endpoint to communicate with (default "unix:///var/run/docker.sock")
      --enable-controller-attach-detach                         Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations (default true)
      --enable-custom-metrics                                   Support for gathering custom metrics.
      --enable-debugging-handlers                               Enables server endpoints for log collection and local running of containers and commands (default true)
      --enable-server                                           Enable the Kubelet's server (default true)
      --enforce-node-allocatable stringSlice                    A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptible options are 'pods', 'system-reserved' & 'kube-reserved'. If the latter two options are specified, '--system-reserved-cgroup' & '--kube-reserved-cgroup' must also be set respectively. See https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md for more details. (default [pods])
      --event-burst int32                                       Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding event-qps. Only used if --event-qps > 0 (default 10)
      --event-qps int32                                         If > 0, limit event creations per second to this value. If 0, unlimited. (default 5)
      --eviction-hard string                                    A set of eviction thresholds (e.g. memory.available<1Gi) that if met would trigger a pod eviction. (default "memory.available<100Mi,nodefs.available<10%,nodefs.inodesFree<5%")
      --eviction-max-pod-grace-period int32                     Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met.  If negative, defer to pod specified value.
      --eviction-minimum-reclaim string                         A set of minimum reclaims (e.g. imagefs.available=2Gi) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure.
      --eviction-pressure-transition-period duration            Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (default 5m0s)
      --eviction-soft string                                    A set of eviction thresholds (e.g. memory.available<1.5Gi) that if met over a corresponding grace period would trigger a pod eviction.
      --eviction-soft-grace-period string                       A set of eviction grace periods (e.g. memory.available=1m30s) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction.
      --exit-on-lock-contention                                 Whether kubelet should exit upon lock-file contention.
      --experimental-allocatable-ignore-eviction                When set to 'true', Hard Eviction Thresholds will be ignored while calculating Node Allocatable. See https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md for more details. [default=false]
      --experimental-allowed-unsafe-sysctls stringSlice         Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in *). Use these at your own risk.
      --experimental-bootstrap-kubeconfig string                deprecated: use --bootstrap-kubeconfig
      --experimental-check-node-capabilities-before-mount       [Experimental] if set true, the kubelet will check the underlying node for required componenets (binaries, etc.) before performing the mount
      --experimental-fail-swap-on                               Makes the Kubelet fail to start if swap is enabled on the node. This is a temporary opton to maintain legacy behavior, failing due to swap enabled will happen by default in v1.6.
      --experimental-kernel-memcg-notification                  If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling.
      --experimental-mounter-path string                        [Experimental] Path of mounter binary. Leave empty to use the default mount.
      --experimental-qos-reserved mapStringString               A set of ResourceName=Percentage (e.g. memory=50%) pairs that describe how pod resource requests are reserved at the QoS level. Currently only memory is supported. [default=none]
      --feature-gates string                                    A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
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
      --file-check-frequency duration                           Duration between checking config files for new data (default 20s)
      --google-json-key string                                  The Google Cloud Platform Service Account JSON Key to use for authentication.
      --hairpin-mode string                                     How should the kubelet setup hairpin NAT. This allows endpoints of a Service to loadbalance back to themselves if they should try to access their own Service. Valid values are "promiscuous-bridge", "hairpin-veth" and "none". (default "promiscuous-bridge")
      --healthz-bind-address ip                                 The IP address for the healthz server to serve on. (set to 0.0.0.0 for all interfaces) (default 127.0.0.1)
      --healthz-port int32                                      The port of the localhost healthz endpoint (default 10248)
      --host-ipc-sources stringSlice                            Comma-separated list of sources from which the Kubelet allows pods to use the host ipc namespace. (default [*])
      --host-network-sources stringSlice                        Comma-separated list of sources from which the Kubelet allows pods to use of host network. (default [*])
      --host-pid-sources stringSlice                            Comma-separated list of sources from which the Kubelet allows pods to use the host pid namespace. (default [*])
      --hostname-override string                                If non-empty, will use this string as identification instead of the actual hostname.
      --http-check-frequency duration                           Duration between checking http for new data (default 20s)
      --image-gc-high-threshold int32                           The percent of disk usage after which image garbage collection is always run. (default 85)
      --image-gc-low-threshold int32                            The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. (default 80)
      --image-pull-progress-deadline duration                   If no pulling progress is made before this deadline, the image pulling will be cancelled. (default 1m0s)
      --image-service-endpoint string                           [Experimental] The endpoint of remote image service. If not specified, it will be the same with container-runtime-endpoint by default. Currently unix socket is supported on Linux, and tcp is supported on windows.  Examples:'unix:///var/run/dockershim.sock', 'tcp://localhost:3735'
      --iptables-drop-bit int32                                 The bit of the fwmark space to mark packets for dropping. Must be within the range [0, 31]. (default 15)
      --iptables-masquerade-bit int32                           The bit of the fwmark space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in kube-proxy. (default 14)
      --keep-terminated-pod-volumes                             Keep terminated pod volumes mounted to the node after the pod terminates.  Can be useful for debugging volume related issues.
      --kube-api-burst int32                                    Burst to use while talking with kubernetes apiserver (default 10)
      --kube-api-content-type string                            Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")
      --kube-api-qps int32                                      QPS to use while talking with kubernetes apiserver (default 5)
      --kube-reserved mapStringString                           A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi, storage=1Gi) pairs that describe resources reserved for kubernetes system components. Currently cpu, memory and local storage for root file system are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none]
      --kube-reserved-cgroup string                             Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via '--kube-reserved' flag. Ex. '/kube-reserved'. [default='']
      --kubeconfig string                                       Path to a kubeconfig file, specifying how to connect to the API server. --api-servers will be used for the location unless --require-kubeconfig is set. (default "/var/lib/kubelet/kubeconfig")
      --kubelet-cgroups string                                  Optional absolute name of cgroups to create and run the Kubelet in.
      --lock-file string                                        <Warning: Alpha feature> The path to file for kubelet to use as a lock file.
      --make-iptables-util-chains                               If true, kubelet will ensure iptables utility rules are present on host. (default true)
      --manifest-url string                                     URL for accessing the container manifest
      --manifest-url-header string                              HTTP header to use when accessing the manifest URL, with the key separated from the value with a ':', as in 'key:value'
      --max-open-files int                                      Number of files that can be opened by Kubelet process. (default 1000000)
      --max-pods int32                                          Number of Pods that can run on this Kubelet. (default 110)
      --minimum-image-ttl-duration duration                     Minimum age for an unused image before it is garbage collected.  Examples: '300ms', '10s' or '2h45m'. (default 2m0s)
      --network-plugin string                                   <Warning: Alpha feature> The name of the network plugin to be invoked for various events in kubelet/pod lifecycle
      --network-plugin-mtu int32                                <Warning: Alpha feature> The MTU to be passed to the network plugin, to override the default. Set to 0 to use the default 1460 MTU.
      --node-ip string                                          IP address of the node. If set, kubelet will use this IP address for the node
      --node-labels mapStringString                             <Warning: Alpha feature> Labels to add when registering the node in the cluster.  Labels must be key=value pairs separated by ','.
      --node-status-update-frequency duration                   Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with nodeMonitorGracePeriod in nodecontroller. (default 10s)
      --oom-score-adj int32                                     The oom-score-adj value for kubelet process. Values must be within the range [-1000, 1000] (default -999)
      --pod-cidr string                                         The CIDR to use for pod IP addresses, only used in standalone mode.  In cluster mode, this is obtained from the master.
      --pod-infra-container-image string                        The image whose network/ipc namespaces containers in each pod will use. (default "gcr.io/google_containers/pause-amd64:3.0")
      --pod-manifest-path string                                Path to to the directory containing pod manifest files to run, or the path to a single pod manifest file. Files starting with dots will be ignored.
      --pods-per-core int32                                     Number of Pods per core that can run on this Kubelet. The total number of Pods on this Kubelet cannot exceed max-pods, so max-pods will be used if this calculation results in a larger number of Pods allowed on the Kubelet. A value of 0 disables this limit.
      --port int32                                              The port for the Kubelet to serve on. (default 10250)
      --protect-kernel-defaults                                 Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults.
      --provider-id string                                      Unique identifier for identifying the node in a machine database, i.e cloudprovider
      --read-only-port int32                                    The read-only port for the Kubelet to serve on with no authentication/authorization (set to 0 to disable) (default 10255)
      --really-crash-for-testing                                If true, when panics occur crash. Intended for testing.
      --register-node                                           Register the node with the apiserver (defaults to true if --api-servers is set) (default true)
      --register-with-taints []api.Taint                        Register the node with the given list of taints (comma separated "<key>=<value>:<effect>"). No-op if register-node is false.
      --registry-burst int32                                    Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding registry-qps. Only used if --registry-qps > 0 (default 10)
      --registry-qps int32                                      If > 0, limit registry pull QPS to this value.  If 0, unlimited. (default 5)
      --require-kubeconfig                                      If true the Kubelet will exit if there are configuration errors, and will ignore the value of --api-servers in favor of the server defined in the kubeconfig file.
      --resolv-conf string                                      Resolver configuration file used as the basis for the container DNS resolution configuration. (default "/etc/resolv.conf")
      --rkt-api-endpoint string                                 The endpoint of the rkt API service to communicate with. Only used if --container-runtime='rkt'. (default "localhost:15441")
      --rkt-path string                                         Path of rkt binary. Leave empty to use the first rkt in $PATH.  Only used if --container-runtime='rkt'.
      --root-dir string                                         Directory path for managing kubelet files (volume mounts,etc). (default "/var/lib/kubelet")
      --runonce                                                 If true, exit after spawning pods from local manifests or remote urls. Exclusive with --api-servers, and --enable-server
      --runtime-cgroups string                                  Optional absolute name of cgroups to create and run the runtime in.
      --runtime-request-timeout duration                        Timeout of all runtime requests except long running request - pull, logs, exec and attach. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (default 2m0s)
      --seccomp-profile-root string                             Directory path for seccomp profiles. (default "/var/lib/kubelet/seccomp")
      --serialize-image-pulls                                   Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version < 1.9 or an Aufs storage backend. Issue #10959 has more details. (default true)
      --streaming-connection-idle-timeout duration              Maximum time a streaming connection can be idle before the connection is automatically closed. 0 indicates no timeout. Example: '5m' (default 4h0m0s)
      --sync-frequency duration                                 Max period between synchronizing running containers and config (default 1m0s)
      --system-cgroups /                                        Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under /. Empty for no container. Rolling back the flag requires a reboot.
      --system-reserved mapStringString                         A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi) pairs that describe resources reserved for non-kubernetes components. Currently only cpu and memory are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none]
      --system-reserved-cgroup string                           Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via '--system-reserved' flag. Ex. '/system-reserved'. [default='']
      --tls-cert-file string                                    File containing x509 Certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to --cert-dir.
      --tls-private-key-file string                             File containing x509 private key matching --tls-cert-file.
      --version version[=true]                                  Print version information and quit
      --volume-plugin-dir string                                <Warning: Alpha feature> The full path of the directory in which to search for additional third party volume plugins (default "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/")
      --volume-stats-agg-period duration                        Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes.  To disable volume calculations, set to 0. (default 1m0s)
```
-->
```
      --address ip                                              kubelet 服务监听的IP地址（设置为 0.0.0.0 监听所有地址）（默认 0.0.0.0 ）
      --allow-privileged                                        如果为 true ，将允许容器请求特权模式
      --anonymous-auth                                          允许匿名请求到 kubelet 服务。未被另一个身份验证方法拒绝的请求被视为匿名请求。匿名请求包含系统的用户名: anonymous ，以及系统的组名: unauthenticated 。（默认 true ）
      --authentication-token-webhook                            使用 TokenReview API 来确定不记名令牌的身份验证
      --authentication-token-webhook-cache-ttl duration         webhook 令牌身份验证器缓存响应时间。（默认2m0s）
      --authorization-mode string                               kubelet 服务的授权模式。有效的选项是 AlwaysAllow 或 Webhook 。Webhook 模式使用 SubjectAccessReview API 来确定授权。(默认“AlwaysAllow”)
      --authorization-webhook-cache-authorized-ttl duration     来自 webhook 的已认证响应缓存时间（默认 5m0s）
      --authorization-webhook-cache-unauthorized-ttl duration   来自 webhook 的未认证响应缓存时间（默认 30s）
      --azure-container-registry-config string                  Azure 容器注册表配置信息路径
      --bootstrap-kubeconfig string                             用于获取 kubelet 客户端证书的 kubeconfig 文件路径，如果由 --kubeconfig 指定的文件不存在，将使用 bootstrap kubeconfig 从 API 服务器请求一个客户端证书，成功后，引用生成证书文件和密钥的 kubeconfig 将被写入 --kubeconfig 指定的文件，客户端证书和密钥将被保存在 --cert-dir 指定的目录。
      --cadvisor-port int32                                     本地 cAdvisor 端口（默认 4194）
      --cert-dir string                                         TLS 证书所在目录。如果 --tls-cert-file 和 --tls-private-key-file 指定的文件存在，当前配置将被忽略。（默认“/var/run/kubernetes”）
      --cgroup-driver string                                    kubelet 用来操作主机上的 cgroups 驱动，可选值有：“cgroupfs”和“systemd”（默认“cgroupfs”）
      --cgroup-root string                                      用于 pods 的可选根 cgroup  ， 这是由容器运行时在最好的工作基础上处理的，默认：''，也就是使用容器运行时的默认值。
      --cgroups-per-qos                                         开启创建 QoS cgroup 层级，如果设置为 true 将创建顶级 QoS 和容器 cgroups 。（默认 true）
      --chaos-chance float                                      如果大于 0.0 ，引入随机客户端错误及延迟，用来测试。
      --client-ca-file string                                   如果设置，任何带有 client-ca-file 中签名的客户端证书的请求都将通过与客户端证书 CommonName 对应的标识进行身份认证。
      --cloud-config string                                     云提供商的配置文件路径，没有配置文件时为空字符串。
      --cloud-provider string                                   云服务提供商。默认情况下， kubelet 将尝试自动检测云提供商，如果不使用云提供商可以指定该参数为空字符串。（默认“auto-detect”）
      --cluster-dns stringSlice                                 DNS 服务器的IP地址列表，逗号分隔。这个值是用于配置指定了“dnsPolicy=ClusterFirst”的容器 DNS 服务器。注意：列表中所有的DNS服务器必须提供相同的记录值，否则集群中的名称解析可能无法正常工作，也就是无法确保连接DNS服务器提供正确的名称解析。
      --cluster-domain string                                   集群域名。如果设置， kubelet 将配置所有容器除了主机搜索域还将搜索当前域。
      --cni-bin-dir string                                      <警告: Alpha 特性>搜索CNI插件二进制文件的完整路径。默认值：/opt/cni/bin
      --cni-conf-dir string                                     <警告: Alpha 特性> 搜索CNI插件配置文件的完整路径。默认值：/etc/cni/net.d
      --container-runtime string                                运行时使用的容器。可选值：‘docker’和‘rkt’。（默认‘docker’）
      --container-runtime-endpoint string                       [实验]远程运行服务的端点。目前在 Linux 上支持 unix 套接字，在 windows 上支持 tcp 。例如：‘unix:///var/run/dockershim.sock’，‘tcp://localhost:3735’（默认‘unix:///var/run/dockershim.sock’）
      --containerized                                           在容器中运行 kubelet 的实验支持。用于测试。
      --contention-profiling                                    如果启用了分析，启用锁争用分析。
      --cpu-cfs-quota                                           为指定 CPU 限制的容器强制限制 CPU CFS 配额(默认 true)
      --docker-disable-shared-pid                               当运行 1.13.1 或更高版本的 docker 时，容器运行时接口( CRI )默认在同一个 pod 中的容器使用一个共享的 PID 名称空间，将此标志设置为对独立的 PID 名称空间用来恢复先前的行为，这个功能将在未来的 Kubernetes 发布版本移除。
      --docker-endpoint string                                  用来通信的 docker 端点。（默认“unix:///var/run/docker.sock”）
      --enable-controller-attach-detach                         允许附加/分离控制器来管理调度到当前节点的附加/分离卷，并禁用 kubelet 执行任何附加/分离操作(默认 true)
      --enable-custom-metrics                                   支持收集自定义指标。
      --enable-debugging-handlers                               开启服务用来收集日志及本地运行的容器及命令（默认 true）
      --enable-server                                           开启 kubelet 服务（默认 true）
      --enforce-node-allocatable stringSlice                    由 kubelet 执行的节点分配执行级别列表，逗号分隔。可选项有 'pods', 'system-reserved' 和 'kube-reserved' 。如果指定后两种，必须同时指定 '--system-reserved-cgroup' 和 '--kube-reserved-cgroup'。 查看 https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md 获取更多细节。 (默认 [ pods ])
      --event-burst int32                                       一个突发事件记录的最大值。 仅当设置 --event-qps 大于0时，暂时允许该事件记录值超过设定值，但不能超过 event-qps 的值。（默认10）
      --event-qps int32                                         设置为大于0的值，将限制每秒创建的事件数目最大为当前值，设置为0则不限制。（默认为5）
      --eviction-hard string                                    一个清理阈值的集合（例如 memory.available<1Gi ），达到该阈值将触发一次容器清理，(默认“memory.available < 100 mi,nodefs.available < 10%,nodefs.inodesFree < 10%)
      --eviction-max-pod-grace-period int32                     满足清理阈值时，终止容器组的最大响应时间，如果设置为负值，将使用 pod 设定的值。.
      --eviction-minimum-reclaim string                         一个资源回收最小值的集合（例如 imagefs.available=2Gi ），即 kubelet 压力较大时 ，执行 pod 清理回收的资源最小值。
      --eviction-pressure-transition-period duration            过渡出清理压力条件前， kubelet 需要等待的时间。（默认 5m0S ）
      --eviction-soft string                                    一个清理阈值的集合（例如 memory.available<1.5Gi ），如果达到一个清理周期将触发一次容器清理。
      --eviction-soft-grace-period string                       一个清理周期的集合（例如 memory.available=1m30s ），在触发一个容器清理之前一个软清理阈值需要保持多久。
      --exit-on-lock-contention                                 kubelet 是否应该退出锁文件争用。
      --experimental-allocatable-ignore-eviction                设置为 true ，计算节点分配时硬清理阈值将被忽略。查看 https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md 获取更多细节。[默认 false] 
      --experimental-allowed-unsafe-sysctls stringSlice         不安全的 sysctls 或者 sysctl 模式（以*结尾）白名单列表，以逗号分隔。在自己的风险中使用这些。
      --experimental-bootstrap-kubeconfig string                已过时：使用 --bootstrap-kubeconfig
      --experimental-check-node-capabilities-before-mount       [实验]如果设置为 true , kubelet 将在执行 mount 之前检查基础节点所需组件(二进制文件等)。
      --experimental-fail-swap-on                               如果在节点上启用了 swap ， kubelet 将启动失败，这是一个维护遗留行为的临时选项，在 v1.6 启动失败是因为默认启用了 swap。
      --experimental-kernel-memcg-notification                  如果启用， kubelet 将集成内核 memcg 通知以确定是否达到内存清理阈值，而不是轮询。
      --experimental-mounter-path string                        [实验]二进制文件的挂载路径。保留空以使用默认。
      --experimental-qos-reserved mapStringString               一个资源占比的集合（例如 memory=50%），描述如何在QoS级别保留pod资源请求，目前仅支持内存。[默认 none]
      --feature-gates string                                    一组键值对，用来描述 alpha 或实验特性，选项有：
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
      --file-check-frequency duration                           检查新数据配置文件的周期（默认 20s）
      --google-json-key string                                  用于谷歌云平台服务帐户身份验证的 JSON 密钥。
      --hairpin-mode string                                     kubelet 如何设置 hairpin NAT（“发夹”转换）。 这使得当服务可以尝试访问自己时服务端点可以自动恢复，合法值由 "promiscuous-bridge", "hairpin-veth" 和 "none". (默认 "promiscuous-bridge")
      --healthz-bind-address ip                                 健康检查服务的IP地址。（设置 0.0.0.0 使用所有地址）（默认 127.0.0.1 ）
      --healthz-port int32                                      本地健康检查服务的端口号（默认 10248 ）
      --host-ipc-sources stringSlice                            kubelet 允许 pod 使用主机 ipc 名称空间列表，逗号分隔。（默认[*]）
      --host-network-sources stringSlice                        kubelet 允许 pod 使用主机网络列表，逗号分隔。（默认[*]）
      --host-pid-sources stringSlice                            kubelet 允许 pod 使用主机 pid 名称空间列表，逗号分隔。（默认[*]）
      --hostname-override string                                如果不是空，将使用该字符作为 hostname 而不是真实的 hostname 。
      --http-check-frequency duration                           通过 http 检查新数据的周期（默认 20s）
      --image-gc-high-threshold int32                           镜像占用磁盘比率最大值，超过此值将执行镜像垃圾回收。（默认 85）
      --image-gc-low-threshold int32                            镜像占用磁盘比率最小值，低于此值将停止镜像垃圾回收。（默认 80）
      --image-pull-progress-deadline duration                   镜像拉取进度最大时间，如果在这段时间拉取镜像没有任何进展，将取消拉取。（默认 1m0s）
      --image-service-endpoint string                           [实验]远程镜像服务端点。如果没有指定，默认情况下将与容器运行时端点相同。目前在 Linux 上支持 unix 套接字，在 windows 上支持 tcp 。  例如:'unix:///var/run/dockershim.sock', 'tcp://localhost:3735'
      --iptables-drop-bit int32                                 用于标记丢弃数据包的 fwmark 空间位，取值范围[0，31]。(默认 15)
      --iptables-masquerade-bit int32                           用于标记 SNAT 数据包的 fwmark 空间位，取值范围[0，31]，请将此参数与 kube-proxy 中的相应参数匹配。（默认 14）
      --keep-terminated-pod-volumes                             在容器停止后保持容器卷挂载在节点上，这对调试卷相关问题非常有用。
      --kube-api-burst int32                                    与 kubernetes apiserver 会话时的并发数。（默认 10）
      --kube-api-content-type string                            发送到 apiserver 的请求 Content type 。（默认“application/vnd.kubernetes.protobuf”）
      --kube-api-qps int32                                      与 kubernetes apiserver 会话时的 QPS 。（默认 15）
      --kube-reserved mapStringString                           一个资源预留量的集合（例如 cpu=200m,memory=500Mi, storage=1Gi ） ，即为 kubernetes 系统组件预留的资源，目前支持根文件系统的 cpu、内存和本地存储。查看 http://kubernetes.io/docs/user-guide/compute-resources 或许更多细节。[默认 none]
      --kube-reserved-cgroup string                             用来管理 Kubernetes 组件的顶级 cgroup 的绝对名称，这些组件用来管理那些标记‘--kube-reserved’的计算资源。 [默认'']
      --kubeconfig string                                       kubeconfig 文件的路径，用来指定如何连接到 API server ，此时将使用 --api-servers  除非设置了 --require-kubeconfig 。（默认“/var/lib/kubelet/kubeconfig”）
      --kubelet-cgroups string                                  可选的 cgroups 的绝对名称来创建和运行 kubelet 
      --lock-file string                                        <警告: Alpha 特性> kubelet 用于锁文件的路径。
      --make-iptables-util-chains                               如果为 true ， kubelet 将确保 iptables 工具规则在主机上生效。（默认 true）
      --manifest-url string                                     访问容器清单的 URL 。
      --manifest-url-header string                              访问容器清单的 URL 的 HTTP 头， key 和 value 之间用:分隔
      --max-open-files int                                      kubelet 进程可以打开的文件数目。（默认 1000000）
      --max-pods int32                                          当前 kubelet 可以运行的容器组数目。（默认 110）
      --minimum-image-ttl-duration duration                     在执行垃圾回收前未使用镜像的最小年龄。例如： '300ms', '10s' or '2h45m'. (默认 2m0s)
      --network-plugin string                                   <警告: Alpha 特性> 在 kubelet/pod 生命周期中为各种事件调用的网络插件的名称
      --network-plugin-mtu int32                                <警告: Alpha 特性> 传递给网络插件的 MTU 值以覆盖缺省值，设置为0将使用默认值 1460
      --node-ip string                                          当前节点的IP地址，如果设置， kubelet 将使用这个地址作为节点ip地址。
      --node-labels mapStringString                             <警告: Alpha 特性> 在集群中注册节点时添加的标签，标签必须为用英文逗号分隔的 key=value 对。
      --node-status-update-frequency duration                   指定 kubelet 的节点状态为 master 的频率。注意:在修改时要小心，它必须与 nodecontroller 的 nodeMonitorGracePeriod 一起工作。(默认 10s)
      --oom-score-adj int32                                     kubelet 进程的 oom-score-adj 值，范围[-1000, 1000] (默认 -999)
      --pod-cidr string                                         用于 pod IP 地址的 CIDR ，仅在单点模式下使用。在集群模式下，这是由 master 获得的。
      --pod-infra-container-image string                        每个 pod 中的 network/ipc 名称空间容器将使用的镜像。 (默认 "gcr.io/google_containers/pause-amd64:3.0")
      --pod-manifest-path string                                包含 pod 清单文件的目录或者单个 pod 清单文件的路径。从点开始的文件将被忽略。
      --pods-per-core int32                                     可以在这个 kubelet 上运行的容器组数目，在这个 kubelet 上的容器组数目不能超过 max-pods ，所以如果在这个 kubelet 上运行更多的容器组应同时使用 max-pods ，设置为 0 将禁用这个限制。
      --port int32                                              kubelet 服务的端口 (默认 10250)
      --protect-kernel-defaults                                 kubelet 的默认内核调优行为。设置之后， kubelet 将在任何可调参数与默认值不同时抛出异常。
      --provider-id string                                      在机器数据库中标识节点的唯一标识符，也就是云提供商
      --read-only-port int32                                    没有认证/授权的只读 kubelet 服务端口。 (设置为 0 以禁用) (默认 10255)
      --really-crash-for-testing                                设置为 true ，有可能出现应用崩溃。 用于测试。
      --register-node                                           用 apiserver 注册节点 (如果设置了 --api-servers 默认为 true ) (默认 true)
      --register-with-taints []api.Taint                        用给定的列表注册节点 (逗号分隔 "<key>=<value>:<effect>")。如果 register-node 为 false 将无操作
      --registry-burst int32                                    拉去镜像的最大并发数，允许同时拉取的镜像数，不能超过 registry-qps ，仅当 --registry-qps 大于 0 时使用。 (默认 10)
      --registry-qps int32                                      如果大于 0 ，将限制每秒拉去镜像个数为这个值，如果为 0 则不限制。 (默认 5)
      --require-kubeconfig                                      设置为 true ， kubelet 将在配置错误时退出并忽略 --api-servers 指定的值以使用在 kubeconfig 文件中定义的服务器。
      --resolv-conf string                                      用作容器 DNS 解析配置的解析器配置文件。 (默认 "/etc/resolv.conf")
      --rkt-api-endpoint string                                 与 rkt API 服务通信的端点，仅当设置 --container-runtime='rkt' 时有效 (默认 "localhost:15441")
      --rkt-path string                                         rkt 二进制文件的路径，设置为空将使用 $PATH 中的第一个 rkt ，仅当设置 --container-runtime='rkt' 时有效。
      --root-dir string                                         管理 kubelet 文件的目录 (卷挂载等). (默认 "/var/lib/kubelet")
      --runonce                                                 如果为 true ，将在从本地清单或者远端url生成容器组后退出，除非指定了 --api-servers 和 --enable-server
      --runtime-cgroups string                                  可选的 cgroups 的绝对名称，创建和运行时使用。
      --runtime-request-timeout duration                        除了 pull, logs, exec 和 attach 这些长运行请求之外的所有运行时请求的超时时间。 当到达超时时间，kubelet 将取消请求，抛出异常并稍后重试。 (默认 2m0s)
      --seccomp-profile-root string                             seccomp 配置文件目录。 (默认 "/var/lib/kubelet/seccomp")
      --serialize-image-pulls                                   一次拉取一个镜像。建议在安装 docker 版本低于 1.9 的节点或一个Aufs存储后端不去修改这个默认值。查看问题 #10959 获取更多细节。 (默认 true)
      --streaming-connection-idle-timeout duration              在连接自动关闭之前，流连接的最大空闲时间，0 表示永不超时。例如： '5m' (默认 4h0m0s)
      --sync-frequency duration                                 同步运行容器和配置之间的最大时间间隔 (默认 1m0s)
      --system-cgroups /                                        可选的 cgroups 的绝对名称，用于将未包含在 cgroup 内的所有非内核进程放置在根目录 / 中，回滚这个标识需要重启。
      --system-reserved mapStringString                         一个 资源名称=量 的集合(例如 cpu=200m,memory=500Mi ) 用来描述为非 kubernetes 组件保留的资源。 目前仅支持 cpu 和内存。 查看 http://kubernetes.io/docs/user-guide/compute-resources 或许更多细节。 [默认 none]
      --system-reserved-cgroup string                           顶级 cgroup 的绝对名称，用于管理计算资源的非 kubernetes 组件，这些组件通过'--system-reserved'标识保留系统资源。除了'/system-reserved'。 [默认'']
      --tls-cert-file string                                    包含用于 https 服务的 x509 证书的文件 (中间证书，如果有，在服务器认证后使用)。如果没有提供 --tls-cert-file 和 --tls-private-key-file ， 将会生产一个自签名的证书及密钥给公开地址使用，并将其保存在 --cert-dir 指定的目录。
      --tls-private-key-file string                             包含 x509 私钥匹配的文件 --tls-cert-file
      --version version[=true]                                  打印 kubelet 版本并退出。
      --volume-plugin-dir string                                <警告: Alpha 特性> 第三方卷插件的完整搜索路径。 (默认 "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/")
      --volume-stats-agg-period duration                        指定 kubelet 计算和缓存所有容器组及卷的磁盘使用量时间间隔。设置为 0 禁用卷计算。（默认 1m）
```
<!--###### Auto generated by spf13/cobra on 11-Jul-2017-->
