## kubefed init

<!--
Initialize a federation control plane
-->

初始化联邦控制平面

<!--
### Synopsis
-->

### 概要

<!--
Init initializes a federation control plane. 

    Federation control plane is hosted inside a Kubernetes
    cluster. The host cluster must be specified using the
    --host-cluster-context flag.
-->

Init 用来初始化联邦控制平面

    联邦控制平面位于 Kubernetes 集群内。必须使用 --host-cluster-context 参数指定主机集群。

```
kubefed init FEDERATION_NAME --host-cluster-context=HOST_CONTEXT [flags]
```

<!--
### Examples
-->

### 示例

```
<!--
  # Initialize federation control plane for a federation
  # named foo in the host cluster whose local kubeconfig
  # context is bar.
  kubefed init foo --host-cluster-context=bar
```
-->

```
  # 为主机集群中名为 foo 的联邦初始化控制平面，该主机集群中的本地 kubeconfig 上下文为 bar。
  kubefed init foo --host-cluster-context=bar
```

<!--
### Options
-->

### 选项

<!--
```
      --api-server-advertise-address string      Preferred address to advertise api server nodeport service. Valid only if 'api-server-service-type=NodePort'.
      --api-server-port int32                    Preferred port to use for api server nodeport service (0 for random port assignment). Valid only if 'api-server-service-type=NodePort'.
      --api-server-service-type string           The type of service to create for federation API server. Options: 'LoadBalancer' (default), 'NodePort'. (default "LoadBalancer")
      --apiserver-arg-overrides string           comma separated list of federation-apiserver arguments to override: Example "--arg1=value1,--arg2=value2..."
      --apiserver-enable-basic-auth              Enables HTTP Basic authentication for the federation-apiserver. Defaults to false.
      --apiserver-enable-token-auth              Enables token authentication for the federation-apiserver. Defaults to false.
      --controllermanager-arg-overrides string   comma separated list of federation-controller-manager arguments to override: Example "--arg1=value1,--arg2=value2..."
      --credentials-kubeconfig string            Kubeconfig file path on local file system, which should be used to authenticate with host cluster or the joining cluster (instead of the default kubeconfig).This can be used to override the RBAC based authentication while initialising the federation control plane or joining a cluster to one, even when the cluster exposes the RBAC API.
      --dns-provider string                      Dns provider to be used for this deployment.
      --dns-provider-config string               Config file path on local file system for configuring DNS provider.
      --dns-zone-name string                     DNS suffix for this federation. Federated Service DNS names are published with this suffix.
      --dry-run                                  dry run without sending commands to server.
      --etcd-image string                        Image to use for etcd server. (default "gcr.io/google_containers/etcd:3.1.10")
      --etcd-persistent-storage                  Use persistent volume for etcd. Defaults to 'true'. (default true)
      --etcd-pv-capacity string                  Size of persistent volume claim to be used for etcd. (default "10Gi")
      --etcd-pv-storage-class string             The storage class of the persistent volume claim used for etcd.   Must be provided if a default storage class is not enabled for the host cluster.
      --etcd-servers string                      External pre-deployed etcd server to be used to store federation state.
      --federation-system-namespace string       Namespace in the host cluster where the federation system components are installed (default "federation-system")
  -h, --help                                     help for init
      --host-cluster-context string              Host cluster context
      --image string                             Image to use for federation API server and controller manager binaries. (default "gcr.io/k8s-jkns-e2e-gce-federation/fcp-amd64:v0.0.0-master_$Format:%h$")
      --image-pull-policy string                 PullPolicy describes a policy for if/when to pull a container image. The default pull policy is IfNotPresent which will not pull an image if it already exists. (default "IfNotPresent")
      --image-pull-secrets string                Provide secrets that can access the private registry.
      --node-selector string                     comma separated list of nodeSelector arguments: Example "arg1=value1,arg2=value2..."
```
-->

```
      --api-server-advertise-address string      公布 API 服务器的 nodeport 服务的首选地址。 只在 'api-server-service-type=NodePort' 时有效。
      --api-server-port int32                    API 服务器的 nodeport 服务的首选端口（设置为 0 将随机指定端口）。只在 'api-server-service-type=NodePort' 时有效。
      --api-server-service-type string           创建联邦 API 服务器的服务类型。 选项包括：'LoadBalancer'（默认），'NodePort'。（默认 "LoadBalancer"）
      --apiserver-arg-overrides string           要重写的联合 API 服务器参数列表，用逗号分隔， 例如 "--arg1=value1,--arg2=value2..."
      --apiserver-enable-basic-auth              为联邦 API 服务器启用 HTTP 基本身份验证。默认关闭。
      --apiserver-enable-token-auth              为联邦 API 服务器启用令牌身份验证。默认关闭。
      --controllermanager-arg-overrides string   要重写的 federation-controller-manager 参数列表，用逗号分隔，例如："--arg1=value1,--arg2=value2..."
      --credentials-kubeconfig string            本地文件系统上的 kubeconfig 文件路径，应用于与主机集群或加入集群（而不是默认的 kubeconfig）进行身份验证。这可用于在初始化联邦控制平面或将集群加入到一个集群时覆盖基于 RBAC 的身份验证，即使在集群公开 RBAC API 时也是如此。
      --dns-provider string                      此 deployment 使用的 DNS 驱动。
      --dns-provider-config string               用来配置 DNS 驱动的本地文件系统中的配置文件。
      --dns-zone-name string                     此联邦的 DNS 后缀。使用此后缀发布联邦服务 DNS 名称。
      --dry-run                                  在不向服务器发送命令的情况下进行试运行。
      --etcd-image string                        服务器使用的镜像（默认 "gcr.io/google_containers/etcd:3.1.10"）
      --etcd-persistent-storage                  etcd 使用持久卷，默认为 'true'。（默认 true）
      --etcd-pv-capacity string                  etcd 所使用的持久卷申领的大小（默认 "10Gi"）
      --etcd-pv-storage-class string             etcd 所使用的持久卷申领的存储类。如果主机集群没有配置默认存储类，就必须提供。
      --etcd-servers string                      用来存储联邦状态的外部预部署的 etcd 服务器。
      --federation-system-namespace string       主机集群上用来安装联邦系统组件的命名空间（默认 "federation-system"）
  -h, --help                                     init 的帮助信息
      --host-cluster-context string              主机集群的上下文
      --image string                             用于联邦 API 服务器和控制器管理器二进制文件的镜像。（默认 "gcr.io/k8s-jkns-e2e-gce-federation/fcp-amd64:v0.0.0-master_$Format:%h$"）
      --image-pull-policy string                 拉取策略描述了容器映像的拉取策略。默认的拉取策略是 ifNotPresent，如果镜像已存在，则不会拉它。（默认 "IfNotPresent"）
      --image-pull-secrets string                提供访问私有仓库的 secret。
      --node-selector string                     逗号分隔的 nodeSelector（节点选择器）参数列表，例如："arg1=value1,arg2=value2..."
```

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
```
      --alsologtostderr                              log to standard error as well as files
      --as string                                    Username to impersonate for the operation
      --as-group stringArray                         Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                             Default HTTP cache directory (default "/Users/jrondeau/.kube/http-cache")
      --certificate-authority string                 Path to a cert file for the certificate authority
      --client-certificate string                    Path to a client certificate file for TLS
      --client-key string                            Path to a client key file for TLS
      --cloud-provider-gce-lb-src-cidrs cidrs        CIDRs opened in GCE firewall for LB traffic proxy & health checks (default 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16)
      --cluster string                               The name of the kubeconfig cluster to use
      --context string                               The name of the kubeconfig context to use
      --default-not-ready-toleration-seconds int     Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration. (default 300)
      --default-unreachable-toleration-seconds int   Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration. (default 300)
      --insecure-skip-tls-verify                     If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --ir-data-source string                        Data source used by InitialResources. Supported options: influxdb, gcm. (default "influxdb")
      --ir-dbname string                             InfluxDB database name which contains metrics required by InitialResources (default "k8s")
      --ir-hawkular string                           Hawkular configuration URL
      --ir-influxdb-host string                      Address of InfluxDB which contains metrics required by InitialResources (default "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy")
      --ir-namespace-only                            Whether the estimation should be made only based on data from the same namespace.
      --ir-password string                           Password used for connecting to InfluxDB (default "root")
      --ir-percentile int                            Which percentile of samples should InitialResources use when estimating resources. For experiment purposes. (default 90)
      --ir-user string                               User used for connecting to InfluxDB (default "root")
      --kubeconfig string                            Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation               when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                               If non-empty, write log files in this directory
      --log-flush-frequency duration                 Maximum number of seconds between log flushes (default 5s)
      --logtostderr                                  log to standard error instead of files (default true)
      --match-server-version                         Require server version to match client version
  -n, --namespace string                             If present, the namespace scope for this CLI request
      --password string                              Password for basic authentication to the API server
      --request-timeout string                       The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                                The address and port of the Kubernetes API server
      --stderrthreshold severity                     logs at or above this threshold go to stderr (default 2)
      --token string                                 Bearer token for authentication to the API server
      --user string                                  The name of the kubeconfig user to use
      --username string                              Username for basic authentication to the API server
  -v, --v Level                                      log level for V logs
      --vmodule moduleSpec                           comma-separated list of pattern=N settings for file-filtered logging
```
-->

```
      --alsologtostderr                              同时将日志输出到标准错误输出（stderr）
      --as string                                    用户名模拟操作
      --as-group stringArray                         要模拟操作的组，可以重复使用此参数来指定多个组。
      --cache-dir string                             默认 HTTP 缓存目录（默认 "/Users/jrondeau/.kube/http-cache"）
      --certificate-authority string                 证书创建的证书机构的的路径
      --client-certificate string                    TLS 客户端证书的路径
      --client-key string                            TLS 客户端秘钥的路径
      --cloud-provider-gce-lb-src-cidrs cidrs        在 GCE 防火墙中放开的 CIDRs，用于 LB 流量代理和检查是否正常（默认 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16）
      --cluster string                               使用的 kubeconfig 集群的名称
      --context string                               使用的 kubeconfig 上下文名称
      --default-not-ready-toleration-seconds int     对于未添加 notReady:NoExecute 容忍度设置的所有 Pod，为其设置此参数值作为对 notReady:NoExecute 容忍度的容忍秒数（tolerationSeconds）；默认值为 300 秒。
      --default-unreachable-toleration-seconds int   对于未设置 unreachable:NoExecute 容忍度的所有 Pod，设置其对 unreachable:NoExecute 的容忍度秒数（tolerationSeconds）；默认值为 300 秒。
      --insecure-skip-tls-verify                     如果是 true，将不检查服务器证书的有效性。这将使您的 HTTPS 连接不安全
      --ir-data-source string                        由 InitialResources 使用的数据源；支持的选项有：influxdb 和 gcm（默认 "influxdb"）。
      --ir-dbname string                             数据库名，其中包含 InitialResources 所需的指标（默认 "k8s"）
      --ir-hawkular string                           Hawkular 配置 URL
      --ir-influxdb-host string                      包含 InitialResources 需要的指标的 InfluxDB 的地址（默认 "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy"）
      --ir-namespace-only                            是否仅根据来自相同命名空间的数据进行估算。
      --ir-password string                           用于连接到 InfluxDB 的密码（默认 "root"）
      --ir-percentile int                            在估算资源时，InitialResoruces 要使用的样本百分比。仅用于实验目的。默认值为 90。 
      --ir-user string                               用于连接到 InfluxDB 的用户（默认 "root"）
      --kubeconfig string                            用于 CLI 请求的 kubeconfig 文件的路径。
      --log-backtrace-at traceLocation               当日志机制遇到文件行 file:N 时，打印堆栈轨迹；默认值为 “:0”。
      --log-dir string                               如果非空，在此目录中写入日志文件
      --log-flush-frequency duration                 日志刷新的最大秒数（默认 5s）
      --logtostderr                                  记录日志到标准错误输出（stderr）而不是文件中；默认值为 true
      --match-server-version                         要求服务器版本与客户端版本匹配
  -n, --namespace string                             若给定，用来设置 CLI 请求的命名空间范围
      --password string                              用来对 API 服务器进行基本身份验证的密码
      --request-timeout string                       放弃单个服务器请求前等待的时间长度。非零值应包含相应的时间单位（如 1s、2m 或 3h）。值为 0 表示请求不超时；默认值为 "0"
  -s, --server string                                Kubernetes API 服务器的地址和端口
      --stderrthreshold severity                     在此阈值或以上的日志将转到 stderr（默认 2）
      --token string                                 向 API 服务器进行身份验证的持有者令牌
      --user string                                  使用的 kubeconfig 用户的名称
      --username string                              用户名，用于对 API 服务器的基本身份验证
  -v, --v Level                                      V 日志的日志级别
      --vmodule moduleSpec                           基于文件的日志过滤，取值为逗号分隔的列表，列表中每项的格式为 "pattern=N"
```

<!--
### SEE ALSO
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation
-->

### 其他参考
* [kubefed](kubefed.md)  - 用 kubefed 控制 Kubernetes 集群联邦

<!--
###### Auto generated by spf13/cobra on 24-Sep-2018
-->
###### 原文由 spf13/cobra 自动生成于 2018-9-24
