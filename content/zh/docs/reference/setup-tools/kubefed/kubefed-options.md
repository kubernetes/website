---
title: kubefed 选项
notitle: true
weight: 20
---

<!--
---
title: kubefed options
notitle: true
weight: 20
---
-->

<!--
## kubefed options
-->

## kubefed 选项

<!--
Print the list of flags inherited by all commands
-->
打印所有命令继承的参数列表

<!--
### Synopsis
-->

### 概要

<!--
Print the list of flags inherited by all commands
-->
打印所有命令继承的参数列表

```
kubefed options [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Print flags inherited by all commands
-->

```
  # 打印所有命令继承的参数
  kubefed options
```

<!--
### Options
-->

### 选项

<!--
 -h, --help   options 的帮助信息
-->

```
  -h, --help   help for options
```

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
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
-->
<!--
--insecure-skip-tls-verify                     If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --ir-data-source string                        Data source used by InitialResources. Supported options: influxdb, gcm. (default "influxdb")
      --ir-dbname string                             InfluxDB database name which contains metrics required by InitialResources (default "k8s")
      --ir-hawkular string                           Hawkular configuration URL
      --ir-influxdb-host string                      Address of InfluxDB which contains metrics required by InitialResources (default "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy")
-->

```
      --sologtostderr                                记录到标准错误以及文件
      --as string                                    用户名模拟操作
      --as-group stringArray                         要模拟操作的组，可以重复使用此参数来指定多个组。
      --cache-dir string                             默认 HTTP 缓存目录(默认 "/Users/jrondeau/.kube/http-cache")
      --certificate-authority string                 证书创建的证书文件的路径
      --client-certificate string                    TLS 客户端证书的路径
      --client-key string                            TLS 客户端秘钥的路径
      --cloud-provider-gce-lb-src-cidrs cidrs        CIDRs 在 GCE 防火墙中打开，用于 LB 流量代理和检查是否正常(默认 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16)
      --cluster string                               使用的 kubeconfig 集群的名称
      --context string                               使用的 kubeconfig 上下文名称
      --default-not-ready-toleration-seconds int     显示 notReady 的默认秒数：默认情况下 NoExecute 被添加到没有这种默认的每个 pod 中(默认 300)。
      --default-unreachable-toleration-seconds int   显示无法达到默认的默认秒：NoExecute，默认情况下添加到没有这种默认的每个 pod (默认 300)。
      
      --insecure-skip-tls-verify                     如果是 true，将不检查服务器证书的有效性。这将使您的 HTTPS 连接不安全
      --ir-data-source string                        由 InitialResources 使用的数据源支持的选项有：influxdb， gcm(默认 "influxdb")。
      --ir-dbname string                             数据库名，其中包含 InitialResources 所需的指标 (默认 "k8s")
      --ir-hawkular string                           Hawkular 配置 URL
      --ir-influxdb-host string                      包含 InitialResources 需要的指标的 InfluxDB 的地址(默认 "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy")
      --ir-namespace-only                            是否仅根据来自相同命名空间的数据进行估算。
      --ir-password string                           用于连接到 InfluxDB 的密码(默认 "root")
      --ir-percentile int   
      --ir-user string                               用于连接到 InfluxDB 的用户(默认 "root")
      --kubeconfig string                            用于 CLI 请求的 kubeconfig 文件的路径。
      --log-backtrace-at traceLocation               当日志记录到行文件: N 时，发出堆栈跟踪 (默认 :0)
      --log-dir string                               如果非空，请在此目录中写入日志文件
      --log-flush-frequency duration                 日志刷新的最大秒数 (默认 5s)
      --logtostderr                                  到标准错误，而不是文件 (默认 true)
      --match-server-version                         要求服务器版本与客户端版本匹配
  -n, --namespace string                             如果存在，CLI 请求的命名空间范围
      --password string                              API server 的基本身份验证密码
      --request-timeout string                       放弃单个服务器请求前等待的时间长度。Non-zero 值应包含相应的时间单元(如 1s, 2m, 3h)。 值为0表示不超时请求 (默认 "0")
  -s, --server string                                Kubernetes API server 的地址和端口
      --stderrthreshold severity                     在此阈值或以上的日志将转到 stderr (默认 2)
      --token string                                 向 API server 进行身份验证的承载令牌
      --user string                                  使用的 kubeconfig 用户的名称
      --username string                              用户名，API server 的基本身份验证
  -v, --v Level                                      V log 的 log 级别
      --vmodule moduleSpec                           文件过滤日志记录的模式 = N 设置逗号分隔列表
```

<!--
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
-->

<!--
### SEE ALSO
-->

### 查看其它

* [kubefed](/docs/reference/setup-tools/kubefed/kubefed/)	 - kubefed controls a Kubernetes Cluster Federation

<!--
###### Auto generated by spf13/cobra on 25-Mar-2018
-->

 


