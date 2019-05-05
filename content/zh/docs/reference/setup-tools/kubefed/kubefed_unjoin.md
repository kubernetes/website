## kubefed unjoin

<!--
Unjoin a cluster from a federation
-->

从联邦中移除一个集群

<!--
### Synopsis
-->

### 概要

<!--
Unjoin a cluster from a federation. 
-->
从联邦中移除一个集群

<!--
    Current context is assumed to be a federation endpoint.
    Please use the --context flag otherwise.
-->
    假定当前上下文是联邦端点。
    否则请使用 --context 参数。    

```
kubefed unjoin CLUSTER_NAME --host-cluster-context=HOST_CONTEXT [flags]
```

<!--
### Examples
-->

### 示例

<!--
```
  # Unjoin the specified cluster from a federation.
  # Federation control plane's host cluster context name
  # must be specified via the --host-cluster-context flag
  # to properly cleanup the credentials.
  kubectl unjoin foo --host-cluster-context=bar --cluster-context=baz
```
-->

```
  # 从联邦中移除指定集群。必须通过 --host-cluster-context 参数指定联邦控制平面所在群集的上下文名称，以便正确清理凭证。
  kubectl unjoin foo --host-cluster-context=bar --cluster-context=baz
```

<!--
### Options
-->

### 选项

<!--
```
      --cluster-context string               Name of the cluster's context in the local kubeconfig. Defaults to cluster name if unspecified.
      --credentials-kubeconfig string        Kubeconfig file path on local file system, which should be used to authenticate with host cluster or the joining cluster (instead of the default kubeconfig).This can be used to override the RBAC based authentication while initialising the federation control plane or joining a cluster to one, even when the cluster exposes the RBAC API.
      --federation-system-namespace string   Namespace in the host cluster where the federation system components are installed (default "federation-system")
  -h, --help                                 help for unjoin
      --host-cluster-context string          Host cluster context
```
-->

```
      --cluster-context string               本地 kubeconfig 中的集群上下文名称。 如果未指定，默认为集群名称。
      --credentials-kubeconfig string        本地文件系统上的 kubeconfig 文件路径，应用于与主机群集或加入群集（而不是默认的 kubeconfig）进行身份验证。这可用于在初始化联邦控制平面或将群集加入到一个群集时覆盖基于 RBAC 的身份验证，即使在群集公开 RBAC API 时也是如此。
      --federation-system-namespace string   主机集群上用来安装联邦系统组件的命名空间（默认 "federation-system"）
  -h, --help                                 unjoin 的帮助信息
      --host-cluster-context string          宿主集群的上下文
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
      --cache-dir string                             Default HTTP cache directory (default "/Users/zarnold/.kube/http-cache")
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
      --client-key string                            TLS 客户端密钥的路径
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
      --log-flush-frequency duration                 日志刷新的最大秒数 (默认 5s)
      --logtostderr                                  记录日志到标准错误输出（stderr）而不是文件中； 默认值为 true
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
* [kubefed](kubefed.md)  - kubefed controls a Kubernetes Cluster Federation
-->

### 其他参考
* [kubefed](kubefed.md)  - 用 kubefed 控制 Kubernetes 集群联邦

<!--
###### Auto generated by spf13/cobra on 24-Sep-2018
-->
###### 原文由 spf13/cobra 自动生成于 2018-9-24
