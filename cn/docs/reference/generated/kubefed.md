---
title: kubefed
notitle: true
---
## kubefed

<!-- 
kubefed controls a Kubernetes Cluster Federation
-->
kubefed 对 Kubernetes 集群集合进行管理

<!-- 
### Synopsis
-->
### 概要


<!-- 
kubefed controls a Kubernetes Cluster Federation
-->
kubefed 对 Kubernetes 集群集合进行管理

<!-- 
Find more information at [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
-->
更多信息请见[https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)。

```
kubefed
```

<!-- 
### Options
-->
### 选项

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
      --kubeconfig string                       Path to the kubeconfig file to use for CLI requests.
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
      --alsologtostderr                         标准错误日志及文件日志
      --as string                               模仿操作的 Username
      --as-group stringArray                    模仿操作的 Group, 这个标签可以重复用于指定多个 group
      --certificate-authority string            授权机构发布的证书文件路径
      --client-certificate string               TLS 客户端证书文件路径
      --client-key string                       TLS 客户端密钥文件路径
      --cloud-provider-gce-lb-src-cidrs cidrs   GCE 防火墙中为负载均衡代理和健康检查开放的 CIDRS (默认 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16)
      --cluster string                          kubeconfig 使用的主机名
      --context string                          kubeconfig 使用的context名
      --insecure-skip-tls-verify                如果设置为真，服务器证书将不会被验证，这将会使您的HTTPS连接不安全
      --kubeconfig string                       用于 CLI 请求的 kubeconfig 文件
      --log-backtrace-at traceLocation          when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                          如果非空，在此路径下写入日志文件
      --log-flush-frequency duration            日志最大清理间隔，单位为秒（默认 5s）
      --logtostderr                             标准 error 而不是文件的日志 (默认 true)
      --match-server-version                    是否需要服务器和客户端版本同步
  -n, --namespace string                        如果有，指定 CLI 请求作用的 namespace 范围
      --password string                         API 服务器的基础验证密码
      --request-timeout string                  对于单个服务器请求的最长等待时间。非零值需要指定相应的时间单位（例如：1s, 2m, 3h）如果为零，表示不设定请求超时。 (默认 "0")
  -s, --server string                           Kubernetes API 服务器的地址和端口
      --stderrthreshold severity                超过此阈值的 stderrlogs 将被发送到stderr (默认 2)
      --token string                            不记名 token，用于向API服务器进行身份验证
      --user string                             kubeconfig 用户名
      --username string                         API 服务器基础验证时使用的用户名
  -v, --v Level                                 V 日志的日志级别
      --vmodule moduleSpec                      comma-separated list of pattern=N settings for file-filtered logging
```

<!-- 
### SEE ALSO
-->
### 请参阅
* [kubefed init](kubefed_init.md)	 - federation 层的初始化
* [kubefed join](kubefed_join.md)	 - 向 federation 新增一个集群
* [kubefed options](kubefed_options.md)	 - 所有命令的标志位清单
* [kubefed unjoin](kubefed_unjoin.md)	 - 从 federation 中移出一个集群
* [kubefed version](kubefed_version.md)	 - 打印客户端和服务器的版本信息

<!--
###### Auto generated by spf13/cobra on 30-Jul-2017
-->
###### spf13/cobra 自动生成于 2017/07/30
