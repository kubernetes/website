---
title: kubefed init
notitle: true
cn-approvers:
- xiaosuiba
cn-reviewers:
- zhangqx2010
---

## kubefed init

<!--
Initialize a federation control plane
-->
初始化 federation 控制平面

<!--
### Synopsis
-->
### 概览


<!--
Initialize a federation control plane. 
-->
初始化 federation 控制平面

<!--
    Federation control plane is hosted inside a Kubernetes
    cluster. The host cluster must be specified using the
    --host-cluster-context flag.
-->
    Federation 控制平面托管于一个 Kubernetes 集群中。必须通过 
    --host-cluster-context 参数指定主集群。

```
kubefed init FEDERATION_NAME --host-cluster-context=HOST_CONTEXT
```

<!--
### Examples

```
# Initialize federation control plane for a federation
# named foo in the host cluster whose local kubeconfig
# context is bar.
kubefed init foo --host-cluster-context=bar
```
-->
### 示例

```
# 在主集群中为名为 foo 的 federation 初始化控制平面，其本地 kubeconfig context # 为 bar。
kubefed init foo --host-cluster-context=bar
```

<!--
### Options
-->
### 选项

```
<!--
      --api-server-advertise-address string      Preferred address to advertise api server nodeport service. Valid only if 'api-server-service-type=NodePort'.
      -->
      --api-server-advertise-address string      用于公开 api server nodeport service 的首选地址。仅在 'api-server-service-type=NodePort' 时有效。
      <!--
      --api-server-service-type string           The type of service to create for federation API server. Options: 'LoadBalancer' (default), 'NodePort'. (default "LoadBalancer")
      -->
      --api-server-service-type string           为 federation API server 创建的 service 类型。选项有：'LoadBalancer' （默认）, 'NodePort'。（默认为 "LoadBalancer"）
      <!--
      --apiserver-arg-overrides string           comma separated list of federation-apiserver arguments to override: Example "--arg1=value1,--arg2=value2..."
      -->
      --apiserver-arg-overrides string           需要覆盖的 federation-apiserver 参数，以逗号分隔。示例："--arg1=value1,--arg2=value2..."
      <!--
      --apiserver-enable-basic-auth              Enables HTTP Basic authentication for the federation-apiserver. Defaults to false.
      -->
      --apiserver-enable-basic-auth              为 federation-apiserver 启用 HTTP 基础认证（Basic authenticatio）。默认为 false。
      <!--
      --apiserver-enable-token-auth              Enables token authentication for the federation-apiserver. Defaults to false.
      -->
      --apiserver-enable-token-auth              为 federation-apiserver 启用令牌认证（token authentication）。默认为 false。
      <!--
      --controllermanager-arg-overrides string   comma separated list of federation-controller-manager arguments to override: Example "--arg1=value1,--arg2=value2..."
      -->
      --controllermanager-arg-overrides string   需要覆盖的 federation-controller-manager 参数，以逗号分隔。示例："--arg1=value1,--arg2=value2..."
      <!--
      --dns-provider string                      Dns provider to be used for this deployment.
      -->
      --dns-provider string                      本次部署使用的 Dns provider。
      <!--
      --dns-provider-config string               Config file path on local file system for configuring DNS provider.
      -->
      --dns-provider-config string               DNS provider 本地配置文件路径。
      <!--
      --dns-zone-name string                     DNS suffix for this federation. Federated Service DNS names are published with this suffix.
      -->
      --dns-zone-name string                     federation 的 DNS 后缀。Federated Service 的 DNS 名将使用此后缀发布。
      <!--
      --dry-run                                  dry run without sending commands to server.
      -->
      --dry-run                                  执行模拟运行测试（dry run），不向 server 发送命令。
      <!--
      --etcd-image string                        Image to use for etcd server. (default "gcr.io/google_containers/etcd:3.0.17")
      -->
      --etcd-image string                        etcd server 使用的镜像。（默认为 "gcr.io/google_containers/etcd:3.0.17"）
      <!--
      --etcd-persistent-storage                  Use persistent volume for etcd. Defaults to 'true'. (default true)
      -->
      --etcd-persistent-storage                  为 etcd 使用持久化卷（persistent volume）。 （默认为 true）
      <!--
      --etcd-pv-capacity string                  Size of persistent volume claim to be used for etcd. (default "10Gi"
      -->
      --etcd-pv-capacity string                  etcd 使用的 persistent volume claim 大小。（默认为 "10Gi"）
      <!--
      --etcd-pv-storage-class string             The storage class of the persistent volume claim used for etcd.   Must be provided if a default storage class is not enabled for the host cluster.
      -->
      --etcd-pv-storage-class string             etcd 使用的 persistent volume claim 的 storage class。主集群未启用默认 storage class 时必须提供此项。
      <!--
      --federation-system-namespace string       Namespace in the host cluster where the federation system components are installed (default "federation-system")
      -->
      --federation-system-namespace string       主集群中 federation 系统组件安装的 namespace。（默认为 "federation-system"）
      <!--
      --host-cluster-context string              Host cluster context
      -->
      --host-cluster-context string              主集群 context。
      <!--
      --image string                             Image to use for federation API server and controller manager binaries. (default "gcr.io/google_containers/hyperkube-amd64:v0.0.0-master+$Format:%h$")
      -->
      --image string                             Federation API server 和 controller manager 的镜像。（默认为 "gcr.io/google_containers/hyperkube-amd64:v0.0.0-master+$Format:%h$"）
      <!--
      --kubeconfig string                        Path to the kubeconfig file to use for CLI requests.
      -->
      --kubeconfig string                        CLI 请求使用的 kubeconfig 文件路径。
```

<!--
### Options inherited from parent command
-->
### 从父命令继承的选项

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
      <!--
      --cloud-provider-gce-lb-src-cidrs cidrs   CIDRS opened in GCE firewall for LB traffic proxy & health checks (default 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16)
      -->
      --cloud-provider-gce-lb-src-cidrs cidrs   在 GCE 防火墙中开放的，用于负载均衡流量代理和健康检查的 CIDR（默认为 209.85.152.0/22,209.85.204.0/22,130.211.0.0/22,35.191.0.0/16）
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
      --insecure-skip-tls-verify                如果为 true，则不会对 server 的证书进行有效性验证。这将导致 HTTPS 连接变得不安全。
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
      --log-flush-frequency duration            日志刷新的最大间隔秒数。（默认为 5s）
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
      --stderrthreshold severity                高于或等于此级别阈值的日志将输出到 stderr （默认为 2）。
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
-->
### 请参阅
<!--
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation
  -->
* [kubefed](kubefed.md) - 使用 kubefed 控制 Kubernetes Cluster Federation


###### Auto generated by spf13/cobra on 30-Jul-2017
