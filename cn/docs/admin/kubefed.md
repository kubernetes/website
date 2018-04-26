---
title: kubefed
notitle: true
cn-approvers:
- xiaosuiba
---
## kubefed

<!--
kubefed controls a Kubernetes Cluster Federation
-->
kubefed 用于控制 Kubernetes Cluster Federation。

<!--
### Synopsis
-->
### 概览


<!--
kubefed controls a Kubernetes Cluster Federation. 
-->
kubefed 用于控制 Kubernetes Cluster Federation

<!--
Find more information at [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
-->
更多信息请参考  [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 。

```
kubefed
```

<!--
### Options
-->
### 选项

```
<!--
      --alsologtostderr                         log to standard error as well as files
      -->
      --alsologtostderr                         记录日志到标准错误流和文件中。
      <!--
      --as string                               Username to impersonate for the operation
      -->
      --as string                               执行操作的用户的用户名。
      <!--
      --as-group stringArray                    Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      -->
      --as-group stringArray                    执行操作的用户的用户组，可以多次重复此参数以指定多个组。 
      <!--
      --certificate-authority string            Path to a cert file for the certificate authority
      -->
      --certificate-authority string            用于证书认证的证书文件路径。
      <!--
      --client-certificate string               Path to a client certificate file for TLS
      -->
      --client-certificate string               用于 TLS 的客户端证书文件路径。
      <!--
      --client-key string                       Path to a client key file for TLS
      -->
      --client-key string                       用于 TLS 的客户端证书密钥文件路径。
      <!00
      --cloud-provider-gce-lb-src-cidrs cidrs   CIDRS opened in GCE firewall for LB traffic proxy & health checks (default 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16)
      -->
      --cloud-provider-gce-lb-src-cidrs cidrs   在 GCE 防火墙中打开，用于负载均衡流量代理和健康检查的 CIDR（默认为 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16）
      <!--
      --cluster string                          The name of the kubeconfig cluster to use
      -->
      --cluster string                          使用的 kubeconfig cluster 名称。
      <!--
      --context string                          The name of the kubeconfig context to use
      -->
      --context string                          使用的 kubeconfig context 名称。
      <!--
      --insecure-skip-tls-verify                If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      -->
      --insecure-skip-tls-verify                如果为 true，则不会对 server 的证书进行有效性验证。这将导致不安全的 HTTPS 连接。
      <!--
      --kubeconfig string                       Path to the kubeconfig file to use for CLI requests.
      -->
      --kubeconfig string                       CLI 请求使用的 kubeconfig 文件路径。
      <!--
      --log-backtrace-at traceLocation          when logging hits line file:N, emit a stack trace (default :0)
      -->
      --log-backtrace-at traceLocation          当日志达到 file:N 行时，添加一次堆栈跟踪。（默认为 :0）
      <!--
      --log-dir string                          If non-empty, write log files in this directory
      -->
      --log-dir string                          如果不为空，则将日志文件写入此文件夹下。
      <!--
      --log-flush-frequency duration            Maximum number of seconds between log flushes (default 5s)
      -->
      --log-flush-frequency duration            log flush 的最大秒数。（默认为 5s）
      <!--
      --logtostderr                             log to standard error instead of files (default true)
      -->
      --logtostderr                             记录日志到标准错误流而不记录到文件中。（默认为 true）
      <!--
      --match-server-version                    Require server version to match client version
      -->
      --match-server-version                    要求 server 版本匹配 client 版本。
<!--
  -n, --namespace string                        If present, the namespace scope for this CLI request
  -->
  -n, --namespace string                        如果存在，则表示此 CLI 请求的 namespace 范围。
  <!--
      --password string                         Password for basic authentication to the API server
      -->
      --password string                         用于 API server 基础认证的密码。
      <!--
      --request-timeout string                  The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
      -->
      --request-timeout string                  放弃单次请求前需要等待的时长。非零值应该包含对应的时间单位（例如 1s, 2m, 3h）。0 表示不设置请求超时时间。 （默认为 "0"）
      <!--
  -s, --server string                           The address and port of the Kubernetes API server
  -->
  -s, --server string                           Kubernetes API server 的地址和端口。
  <!--
      --stderrthreshold severity                logs at or above this threshold go to stderr (default 2)
      -->
      --stderrthreshold severity                高于或等于此级别门限的日志将输出到 stderr （默认为 2）。
      <!--
      --token string                            Bearer token for authentication to the API server
      -->
      --token string                            用于 API server 认证的 Bearer 令牌。
      <!--
      --user string                             The name of the kubeconfig user to use
      -->
      --user string                             使用的 kubeconfig user 名称。
      <!--
      --username string                         Username for basic authentication to the API server
      -->
      --username string                         用于 API server 基本认证的用户名。
      <!--
  -v, --v Level                                 log level for V logs
  -->
  -v, --v Level                                 用于 V log 的日志级别。
  <!--
      --vmodule moduleSpec                      comma-separated list of pattern=N settings for file-filtered logging
      -->
      --vmodule moduleSpec                      以逗号分隔的 pattern=N 配置列表，用于基于文件过滤的日志。
```

<!--
### SEE ALSO
--
### 参见
<!--
* [kubefed init](kubefed_init.md)	 - Initialize a federation control plane
  * [kubefed join](kubefed_join.md) - Join a cluster to a federation
  * [kubefed options](kubefed_options.md) - Print the list of flags inherited by all commands
  * [kubefed unjoin](kubefed_unjoin.md) - Unjoin a cluster from a federation
  * [kubefed version](kubefed_version.md) - Print the client and server version information
    -->
* [kubefed init](kubefed_init.md) - 初始化 federation 控制平面
* [kubefed join](kubefed_join.md) - 将集群加入 federation
* [kubefed options](kubefed_options.md) - 打印所有命令继承的参数列表
* [kubefed unjoin](kubefed_unjoin.md) - 将集群退出 federation
* [kubefed version](kubefed_version.md) - 打印客户端和服务端版本信息

###### Auto generated by spf13/cobra on 30-Jul-2017
