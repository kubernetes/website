## kubefed join

<!--
Join a cluster to a federation
-->

将集群加入联邦

<!--
### Synopsis
-->

### 概要

<!--
Join adds a cluster to a federation. 
-->

Join 将集群加入联邦。

<!--
    Current context is assumed to be a federation API
    server. Please use the --context flag otherwise.
-->

    假设当前上下文是联邦 API 服务器。否则请使用 --context 参数。

```
kubefed join CLUSTER_NAME --host-cluster-context=HOST_CONTEXT [flags]
```

<!--
### Examples
-->

### 示例

<!--
```
  # Join a cluster to a federation by specifying the
  # cluster name and the context name of the federation
  # control plane's host cluster. Cluster name must be
  # a valid RFC 1123 subdomain name. Cluster context
  # must be specified if the cluster name is different
  # than the cluster's context in the local kubeconfig.
  kubefed join foo --host-cluster-context=bar
```
-->

```
  # 通过指定集群名称和联邦控制平面的主机集群上下文名称，将集群添加到联邦。集群名称必须是符合 RFC 1123 规范的可用子域名。
  # 如果集群名称和本地 kubeconfig 中的集群上下文不同，就必须指定集群上下文。
  kubefed join foo --host-cluster-context=bar
```

<!--
### Options
-->

### 选项

<!--
```
      --allow-missing-template-keys          If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      --cluster-context string               Name of the cluster's context in the local kubeconfig. Defaults to cluster name if unspecified.
      --credentials-kubeconfig string        Kubeconfig file path on local file system, which should be used to authenticate with host cluster or the joining cluster (instead of the default kubeconfig).This can be used to override the RBAC based authentication while initialising the federation control plane or joining a cluster to one, even when the cluster exposes the RBAC API.
      --dry-run                              If true, only print the object that would be sent, without sending it.
      --federation-system-namespace string   Namespace in the host cluster where the federation system components are installed (default "federation-system")
      --generator string                     The name of the API generator to use. (default "cluster/v1beta1")
  -h, --help                                 help for join
      --host-cluster-context string          Host cluster context
      --no-headers                           When using the default or custom-column output format, don't print headers (default print headers).
  -o, --output string                        Output format. One of: json|yaml|wide|name|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See custom columns [/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [/docs/user-guide/jsonpath].
      --save-config                          If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
  -a, --show-all                             When printing, show all resources (default hide terminated pods.)
      --show-labels                          When printing, show all labels as the last column (default hide labels column)
      --sort-by string                       If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      --template string                      Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --validate                             If true, use a schema to validate the input before sending it (default true)
```
-->

```
      --allow-missing-template-keys          如果为 true，当模版中的字段或者映射键缺失时，将忽略模版中的任何错误。仅应用于 golang 和 jsonpath 输出格式。（默认值为 true）
      --cluster-context string               本地 kubeconfig 中的集群上下文名称。如果未指定，默认为集群名称。
      --credentials-kubeconfig string        本地文件系统上的 kubeconfig 的文件路径，应用于对主机集群或加入集群（而不是默认的 kubeconfig）进行身份验证。这可用于在初始化联合控制平面或将集群加入到其中时覆盖基于 RBAC 的身份验证，即使在集群公开 RBAC API 时也是如此。
      --dry-run                              如果为 true，只打印将要发送的对象，实际上并没有发送出去。
      --federation-system-namespace string   安装联邦系统组件的主机集群命名空间（默认值为 "federation-system"）。
      --generator string                     要使用的 API 生成器的名称（默认值为 "cluster/v1beta1"）。
  -h, --help                                 join 的帮助信息。
      --host-cluster-context string          主机集群上下文。
      --no-headers                           当使用默认或者定制列输出格式时，不打印头信息（默认打印头信息）。
  -o, --output string                        输出格式。下列之一： json|yaml|wide|name|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... 参考定制列 [/docs/user-guide/kubectl-overview/#custom-columns]，golang 模版 [http://golang.org/pkg/text/template/#pkg-overview] 和 jsonpath 模版 [/docs/user-guide/jsonpath]。
      --save-config                          如果为 true，当前对象的配置将保存到它的注解中。否则将不会改变注解。 当你将来对此对象执行 kubectl apply 时，会用到该参数。
  -a, --show-all                             打印时，显示所有资源。（默认隐藏已终止的 pod）
      --show-labels                          打印时，将所有标签显示在最后一列。 (默认隐藏标签列）
      --sort-by string                       如果非空， 使用此字段的指定项对列表类型进行排序。此字段的指定项使用 JSONPath 表达式（例如 '{.metadata.name}'）。 此 JSONPath 表达式指定的 API 资源中的字段必须是整数或字符串。
      --template string                       当设置 -o=go-template，-o=go-template-file 时， 要使用的模板文件的模板字符串或路径。模版格式为 golang 模版 [http://golang.org/pkg/text/template/#pkg-overview]。
      --validate                             如果为 true，在发送输入信息之前先进行语法检查（默认值为 true）。
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
      --alsologtostderr                              同时将日志输出到标准错误输出（stderr）。
      --as string                                    用户名模拟操作。
      --as-group stringArray                         要模拟操作的组，可以重复使用此参数来指定多个组。
      --cache-dir string                             默认 HTTP 缓存目录（默认值为 "/Users/jrondeau/.kube/http-cache"）。
      --certificate-authority string                 证书创建的证书机构的的路径。
      --client-certificate string                    TLS 客户端证书的路径。
      --client-key string                            TLS 客户端秘钥的路径。
      --cloud-provider-gce-lb-src-cidrs cidrs        在 GCE 防火墙中放开的 CIDRs，用于 LB 流量代理和检查是否正常（默认 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16）。
      --cluster string                               使用的 kubeconfig 集群的名称。
      --context string                               使用的 kubeconfig 上下文名称。
      --default-not-ready-toleration-seconds int     对于未添加 notReady:NoExecute 容忍度设置的所有 Pod，为其设置此参数值作为对 notReady:NoExecute 容忍度的容忍秒数（tolerationSeconds）；默认值为 300 秒。
      --default-unreachable-toleration-seconds int   对于未设置 unreachable:NoExecute 容忍度的所有 Pod，设置其对 unreachable:NoExecute 的容忍度秒数（tolerationSeconds）；默认值为 300 秒。
      --insecure-skip-tls-verify                     如果是 true，将不检查服务器证书的有效性。这将使您的 HTTPS 连接不安全。
      --ir-data-source string                        由 InitialResources 使用的数据源；支持的选项有：influxdb 和 gcm（默认值为 "influxdb"）。
      --ir-dbname string                             数据库名，其中包含 InitialResources 所需的指标（默认值为 "k8s"）。
      --ir-hawkular string                           Hawkular 配置 URL。
      --ir-influxdb-host string                      包含 InitialResources 需要的指标的 InfluxDB 的地址（默认值为 "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy"）。
      --ir-namespace-only                            是否仅根据来自相同命名空间的数据进行估算。
      --ir-password string                           用于连接到 InfluxDB 的密码（默认值为 "root"）。
      --ir-percentile int                            在估算资源时，InitialResoruces 要使用的样本百分比。仅用于实验目的。默认值为 90。 
      --ir-user string                               用于连接到 InfluxDB 的用户（默认值为 "root"）。
      --kubeconfig string                            用于 CLI 请求的 kubeconfig 文件的路径。
      --log-backtrace-at traceLocation               当日志机制遇到文件行 file:N 时，打印堆栈轨迹；默认值为：0。
      --log-dir string                               如果非空，在此目录中写入日志文件。
      --log-flush-frequency duration                 日志刷新的最大秒数（默认值为 5s）。
      --logtostderr                                  记录日志到标准错误输出（stderr）而不是文件中；默认值为 true。
      --match-server-version                         要求服务器版本与客户端版本匹配。
  -n, --namespace string                             若给定，用来设置 CLI 请求的命名空间范围。
      --password string                              用来对 API 服务器进行基本身份验证的密码。
      --request-timeout string                       放弃单个服务器请求前等待的时间长度。非零值应包含相应的时间单位（如 1s、2m 或 3h）。值为 0 表示请求不超时；默认值为 "0"。
  -s, --server string                                Kubernetes API 服务器的地址和端口。
      --stderrthreshold severity                     在此阈值或以上的日志将转到 stderr（默认值为 2）。
      --token string                                 向 API 服务器进行身份验证的持有者令牌。
      --user string                                  使用的 kubeconfig 用户的名称。
      --username string                              用户名，用于对 API 服务器的基本身份验证。
  -v, --v Level                                      V 日志的日志级别。
      --vmodule moduleSpec                           基于文件的日志过滤，取值为逗号分隔的列表，列表中每项的格式为 "pattern=N"。
```

<!--
### SEE ALSO
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation
-->

### 其他参考
* [kubefed](kubefed.md)  - 使用 kubefed 控制集群联邦

<!--
###### Auto generated by spf13/cobra on 24-Sep-2018
-->

###### 由 spf13/cobra 自动生成于 2018-9-24
