---
title: kubefed unjoin
notitle: true
---
## kubefed unjoin

<!--
Unjoin a cluster from a federation
-->
从联邦中剔除集群

<!--
### Synopsis
-->
### 概览

<!--
Unjoin a cluster from a federation.

    Current context is assumed to be a federation endpoint.
    Please use the --context flag otherwise.
-->
从联邦中剔除集群

    假设当前上下文是一个联邦端点。
    否则请使用 --context 标识

```
kubefed unjoin CLUSTER_NAME --host-cluster-context=HOST_CONTEXT
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
  # 从联邦中剔除指定的集群。
  # 联邦控制平面的主机群上下文名称
  # 必须通过 --host-cluster-context 标识指定
  # 以正确地清理凭证。
  kubectl unjoin foo --host-cluster-context=bar --cluster-context=baz
```

<!--
### Options
-->
### 选项

<!--
```
      --cluster-context string               Name of the cluster's context in the local kubeconfig. Defaults to cluster name if unspecified.
      --federation-system-namespace string   Namespace in the host cluster where the federation system components are installed (default "federation-system")
      --host-cluster-context string          Host cluster context
      --kubeconfig string                    Path to the kubeconfig file to use for CLI requests.
```
-->
```
      --cluster-context string               集群在本地 kubeconfig 中的集群上下文名称。未指定时默认是集群名称。
      --federation-system-namespace string   主机群中联邦系统组件安装的命名空间（默认为 "federation-system"）
      --host-cluster-context string          主机群上下文
      --kubeconfig string                    供命令行请求使用的 kubeconfig 文件路径。
```

<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

<!--
```
      --alsologtostderr                         log to standard error as well as files
      --as string                               Username to impersonate for the operation
      --as-group stringArray                    Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --certificate-authority string            Path to a cert file for the certificate authority
      --client-certificate string               Path to a client certificate file for TLS
      --client-key string                       Path to a client key file for TLS
      --cloud-provider-gce-lb-src-cidrs cidrs   CIDRS opened in GCE firewall for LB traffic proxy & health checks (default 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16)
      --cluster string                          The name of the kubeconfig cluster to use
      --context string                          The name of the kubeconfig context to use
      --insecure-skip-tls-verify                If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --log-backtrace-at traceLocation          when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                          If non-empty, write log files in this directory
      --log-flush-frequency duration            Maximum number of seconds between log flushes (default 5s)
      --logtostderr                             log to standard error instead of files (default true)
      --match-server-version                    Require server version to match client version
  -n, --namespace string                        If present, the namespace scope for this CLI request
      --password string                         Password for basic authentication to the API server
      --request-timeout string                  The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                           The address and port of the Kubernetes API server
      --stderrthreshold severity                logs at or above this threshold go to stderr (default 2)
      --token string                            Bearer token for authentication to the API server
      --user string                             The name of the kubeconfig user to use
      --username string                         Username for basic authentication to the API server
  -v, --v Level                                 log level for V logs
      --vmodule moduleSpec                      comma-separated list of pattern=N settings for file-filtered logging
```
-->
```
      --alsologtostderr                         记录日志到标准错误流和文件中。
      --as string                               执行操作的用户的用户名。
      --as-group stringArray                    执行操作的用户的用户组，可以重复此参数以指定多个组。
      --certificate-authority string            用于证书认证的证书文件路径。
      --client-certificate string               用于 TLS 的客户端证书文件路径。
      --client-key string                       用于 TLS 的客户端证书密钥文件路径。
      --cloud-provider-gce-lb-src-cidrs cidrs   在 GCE 防火墙中开放的，用于负载均衡流量代理和健康检查的 CIDR。（默认为 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16）
      --cluster string                          使用的 kubeconfig 集群名称
      --context string                          使用的 kubeconfig 上下文名称
      --insecure-skip-tls-verify                如果为 true，则不会对服务器的证书进行有效性验证。这将导致 HTTPS 连接变得不安全
      --log-backtrace-at traceLocation          当日志达到 file:N 行时，添加一次堆栈跟踪。（默认为 :0）
      --log-dir string                          如果不为空，则将日志文件写入此文件夹下
      --log-flush-frequency duration            日志刷新的最大间隔秒数。（默认为 5s）
      --logtostderr                             记录日志到标准错误流而不记录到文件中。（默认为 true）
      --match-server-version                    要求服务器版本匹配客户端版本
  -n, --namespace string                        如果存在，则表示此命令行请求的命名空间范围
      --password string                         用于 API server 基础认证的密码
      --request-timeout string                  请求超时时长。非零值应该包含对应的时间单位（例如 1s, 2m, 3h）。0 表示不设置请求超时时间。（默认为 "0"）
  -s, --server string                           Kubernetes API server 的地址和端口
      --stderrthreshold severity                高于或等于此级别阈值的日志将输出到 stderr（默认为 2）
      --token string                            用于 API server 认证的 Bearer 令牌
      --user string                             使用的 kubeconfig 用户名称
      --username string                         用于 API server 基本认证的用户名
  -v, --v Level                                 用于 V log 的日志级别
      --vmodule moduleSpec                      以逗号分隔的 pattern=N 配置列表，用于基于文件过滤的日志
```

<!--
### SEE ALSO
-->
### 请参阅
<!--
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation
-->
* [kubefed](kubefed.md)	 - 使用 kubefed 控制 Kubernetes Cluster Federation

###### Auto generated by spf13/cobra on 30-Jul-2017
