---
title: kubefed join
notitle: true
cn-approvers:
- xiaosuiba
cn-reviewers:
- chentao1596
---
## kubefed join

<!--
Join a cluster to a federation
-->
将集群加入 federation 

<!--
### Synopsis
-->
### 概览


<!--
Join adds a cluster to a federation. 

    Current context is assumed to be a federation API
    server. Please use the --context flag otherwise.
-->
Join 操作将一个集群加入 federation。

    本操作假设当前上下文（current context）为 federation API
    server。如有不同请通过 --context 参数设置。
```
kubefed join CLUSTER_NAME --host-cluster-context=HOST_CONTEXT
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
  # 通过指定集群名称和 federation 控制平面主集群 context 名称，将
  # 集群加入 federation。集群名称必须为一个合法的 RFC 1123 子域名。
  # 如果集群名称与本地 kubeconfig 中的集群 context 不同，则必须指定
  # 集群 context。
  kubefed join foo --host-cluster-context=bar
```

<!--
### Options
-->
### 选项

```
<!--
      --allow-missing-template-keys          If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      -->
      --allow-missing-template-keys          如果为 true，忽略模板中的任何错误，如字段或键值的缺失。仅用于 golang 和 jsonpath 输出格式。（默认为 true）
      <!--
      --cluster-context string               Name of the cluster's context in the local kubeconfig. Defaults to cluster name if unspecified.
      -->
      --cluster-context string               本地 kubeconfig 中的集群 context 名。如未指定则默认为集群名。
      <!--
      --dry-run                              If true, only print the object that would be sent, without sending it.
      -->
      --dry-run                              如果为 true，则仅打印将要发送的对象而不真正发送它们。
      <!--
      --federation-system-namespace string   Namespace in the host cluster where the federation system components are installed (default "federation-system")
      -->
      --federation-system-namespace string   主集群中安装 federation 系统组件的 namespace。（默认为 "federation-system"）
      <!--
      --generator string                     The name of the API generator to use. (default "cluster/v1beta1")
      -->
      --generator string                     使用的 API generator 名称。（默认为 "cluster/v1beta1"）
      <!--
      --host-cluster-context string          Host cluster context
      -->
      --host-cluster-context string          主集群 context。
      <!--
      --kubeconfig string                    Path to the kubeconfig file to use for CLI requests.
      -->
      --kubeconfig string                    CLI 请求使用的 kubeconfig 配置文件路径。
      <!--
      --no-headers                           When using the default or custom-column output format, don't print headers (default print headers).
      -->
      --no-headers                           使用默认或自定义列输出格式时，不打印表头。（默认打印表头）
      <!--
  -o, --output string                        Output format. One of: json|yaml|wide|name|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath].
  -->
  -o, --output string                        输出格式。以下选项之一： json|yaml|wide|name|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=... 参见自定义列 [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns]， golang 模板 [http://golang.org/pkg/text/template/#pkg-overview] 和 jsonpath 模板 [http://kubernetes.io/docs/user-guide/jsonpath]。
  <!--
      --save-config                          If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
      -->
      --save-config                          如果为 true，当前对象的配置将被保存在它的注解中。否则注解不发生改变。如您将来希望在此对象上执行 kubectl apply 时，这个参数会有帮助。
      <!--
      --schema-cache-dir string              If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' (default "~/.kube/schema")
      -->
      --schema-cache-dir string              如不为空，将在这个目录中加载/存储缓存的 API schemas，默认为 '$HOME/.kube/schema'。（默认为 "~/.kube/schema"）
      <!--
  -a, --show-all                             When printing, show all resources (default hide terminated pods.)
  -->
  -a, --show-all                             打印时显示所有资源。 （默认隐藏所有已结束的 pod。）
  <!--
      --show-labels                          When printing, show all labels as the last column (default hide labels column)
      -->
      --show-labels                          打印时在最后一列显示所有 label。（默认隐藏 label 列）
      <!--
      --sort-by string                       If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
      -->
      --sort-by string                       如不为空，使用这个 field 规范（field specification）对列表类型排序。此 field 规范表现为一个 JSONPath 表达式（例如 '{.metadata.name}'）。API 资源中通过这个 JSONPath 表达式指定的域必须为整数或字符串。
      <!--
      --template string                      Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      -->
      --template string                      当设置 -o=go-template，-o=go-template-file 时，指定模板字符串或模板文件路径。模板格式为 golang 模板 [http://golang.org/pkg/text/template/#pkg-overview]。
      <!--
      --validate                             If true, use a schema to validate the input before sending it (default true)
      -->
      --validate                             如果为 true，在发送请求前使用 schema 进行验证。（默认为 true）
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
-->
### 请参阅
<!--
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation
  -->
* [kubefed](kubefed.md) - 使用 kubefed 控制 Kubernetes Cluster Federation

###### Auto generated by spf13/cobra on 30-Jul-2017
