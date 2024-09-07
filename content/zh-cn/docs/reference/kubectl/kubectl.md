---
title: kubectl
content_type: tool-reference
weight: 30
---
<!--
title: kubectl
content_type: tool-reference
weight: 30
-->

## {{% heading "synopsis" %}}

<!--
kubectl controls the Kubernetes cluster manager.
-->
kubectl 管理控制 Kubernetes 集群。

<!--
Find more information in [Command line tool](/docs/reference/kubectl/) (`kubectl`).
-->
更多信息请查阅[命令行工具](/zh-cn/docs/reference/kubectl/)（`kubectl`）。

```shell
kubectl [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>
    <tr>
      <td colspan="2">--add-dir-header</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, adds the file directory to the header of the log messages
      -->
      设置为 true 表示添加文件目录到日志信息头中
      </td>
    </tr>
    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      log to standard error as well as files
      -->
      表示将日志输出到文件的同时输出到 stderr
      </td>
    </tr>
    <tr>
      <td colspan="2">--as string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Username to impersonate for the operation
      -->
      以指定用户的身份执行操作
      </td>
    </tr>
    <tr>
      <td colspan="2">--as-group stringArray</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      -->
      模拟指定的组来执行操作，可以使用这个标志来指定多个组。
      </td>
    </tr>
    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to the file containing Azure container registry configuration information.
      -->
      包含 Azure 容器仓库配置信息的文件的路径。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："$HOME/.kube/cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Default cache directory
      -->
      默认缓存目录
      </td>
    </tr>
    <tr>
      <td colspan="2">--certificate-authority string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a cert file for the certificate authority
      -->
      指向证书机构的 cert 文件路径
      </td>
    </tr>
    <tr>
      <td colspan="2">--client-certificate string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a client certificate file for TLS
      -->
      TLS 使用的客户端证书路径
      </td>
    </tr>
    <tr>
      <td colspan="2">--client-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a client key file for TLS
      -->
      TLS 使用的客户端密钥文件路径
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：130.211.0.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
        <!--CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks-->
        在 GCE 防火墙中开放的 CIDR，用来进行 L7 LB 流量代理和健康检查。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      CIDRs opened in GCE firewall for L4 LB traffic proxy & health checks
      -->
      在 GCE 防火墙中开放的 CIDR，用来进行 L4 LB 流量代理和健康检查。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cluster string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig cluster to use
      -->
      要使用的 kubeconfig 集群的名称
      </td>
    </tr>
    <tr>
      <td colspan="2">--context string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig context to use
      -->
      要使用的 kubeconfig 上下文的名称
      </td>
    </tr>
    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `notReady` 状态的容忍度秒数：默认情况下，`NoExecute` 被添加到尚未具有此容忍度的每个 Pod 中。
      </td>
    </tr>
    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `unreachable` 状态的容忍度秒数：默认情况下，`NoExecute` 被添加到尚未具有此容忍度的每个 Pod 中。
      </td>
    </tr>
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for kubectl
      -->
      kubectl 操作的帮助命令
      </td>
    </tr>
    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      -->
      设置为 true，则表示不会检查服务器证书的有效性。这样会导致你的 HTTPS 连接不安全。
      </td>
    </tr>
    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to the kubeconfig file to use for CLI requests.
      -->
      CLI 请求使用的 kubeconfig 配置文件的路径。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      when logging hits line file:N, emit a stack trace
      -->
      当日志机制运行到指定文件的指定行（file:N）时，打印调用堆栈信息
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If non-empty, write log files in this directory
      -->
      如果不为空，则将日志文件写入此目录
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If non-empty, use this log file
      -->
      如果不为空，则将使用此日志文件
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.
      -->
      定义日志文件的最大尺寸。单位为兆字节。如果值设置为 0，则表示日志文件大小不受限制。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Maximum number of seconds between log flushes
      -->
      两次日志刷新操作之间的最长时间（秒）
      </td>
    </tr>
    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      log to standard error instead of files
      -->
      日志输出到 stderr 而不是文件中
      </td>
    </tr>
    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Require server version to match client version
      -->
      要求客户端版本和服务端版本相匹配
      </td>
    </tr>
    <tr>
      <td colspan="2">-n, --namespace string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If present, the namespace scope for this CLI request
      -->
      如果存在，CLI 请求将使用此命名空间
      </td>
    <tr>
      <td colspan="2">--one-output</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, only write logs to their native severity level (vs also writing to each lower severity level)
      -->
      如果为 true，则只将日志写入初始严重级别（而不是同时写入所有较低的严重级别）。
      </td>
    </tr>
    </tr>
    <tr>
      <td colspan="2">--password string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Password for basic authentication to the API server
      -->
      API 服务器进行基本身份验证的密码
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
      -->
      要记录的性能指标的名称。可取（none|cpu|heap|goroutine|threadcreate|block|mutex）其中之一。
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of the file to write the profile to
      -->
      用于转储所记录的性能信息的文件名
      </td>
    </tr>
    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      -->
      放弃单个服务器请求之前的等待时间，非零值需要包含相应时间单位（例如：1s、2m、3h）。零值则表示不做超时要求。
      </td>
    </tr>
    <tr>
      <td colspan="2">-s, --server string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The address and port of the Kubernetes API server
      -->
      Kubernetes API 服务器的地址和端口
      </td>
    </tr>
    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, avoid header prefixes in the log messages
      -->
      设置为 true 则表示跳过在日志消息中出现 header 前缀信息
      </td>
    </tr>
    <tr>
      <td colspan="2">--skip-log-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, avoid headers when opening log files
      -->
      设置为 true 则表示在打开日志文件时跳过 header 信息
      </td>
    </tr>
    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      logs at or above this threshold go to stderr
      -->
      等于或高于此阈值的日志将输出到标准错误输出（stderr）
      </td>
    </tr>
    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Bearer token for authentication to the API server
      -->
      用于对 API 服务器进行身份认证的持有者令牌
      </td>
    </tr>
    <tr>
      <td colspan="2">--user string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig user to use
      -->
      指定使用 kubeconfig 配置文件中的用户名
      </td>
    </tr>
    <tr>
      <td colspan="2">--username string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Username for basic authentication to the API server
      -->
      用于 API 服务器的基本身份验证的用户名
      </td>
    </tr>
    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      number for the log level verbosity
      -->
      指定输出日志的日志详细级别
      </td>
    </tr>
    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Print version information and quit
      -->
      打印 kubectl 版本信息并退出
      </td>
    </tr>
    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      comma-separated list of pattern=N settings for file-filtered logging
      -->
      以逗号分隔的 pattern=N 设置列表，用于过滤文件的日志记录
      </td>
    </tr>
  </tbody>
</table>

## {{% heading "envvars" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">KUBECONFIG</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the kubectl configuration ("kubeconfig") file. Default: "$HOME/.kube/config"
-->
kubectl 的配置 ("kubeconfig") 文件的路径。默认值："$HOME/.kube/config"
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_COMMAND_HEADERS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to false, turns off extra HTTP headers detailing invoked kubectl command (Kubernetes version v1.22 or later)
-->
设置为 false 时，将关闭额外的 HTTP 标头，不再详细说明被调用的 kubectl 命令（此变量适用于 Kubernetes v1.22 或更高版本）
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_DEBUG_CUSTOM_PROFILE</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, custom flag will be enabled in kubectl debug. This flag is used to customize the pre-defined profiles.
-->
设置为 true 时，将在 kubectl 调试中启用自定义标志，该标志用于自定义预定义的配置文件。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_EXPLAIN_OPENAPIV3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Toggles whether calls to `kubectl explain` use the new OpenAPIv3 data source available. OpenAPIV3 is enabled by default since Kubernetes 1.24.
-->
切换对 `kubectl explain` 的调用是否使用可用的新 OpenAPIv3 数据源。OpenAPIV3 自 Kubernetes 1.24 起默认被启用。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_ENABLE_CMD_SHADOW</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, external plugins can be used as subcommands for builtin commands if subcommand does not exist. In alpha stage, this feature can only be used for create command(e.g. kubectl create networkpolicy).
-->
当设置为 true 时，如果子命令不存在，外部插件可以用作内置命令的子命令。
此功能处于 alpha 阶段，只能用于 create 命令（例如 kubectl create networkpolicy）。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_PORT_FORWARD_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, the kubectl port-forward command will attempt to stream using the websockets protocol.
If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
-->
当设置为 true 时，`kubectl port-forward` 命令将尝试使用 WebSocket 协议进行流式传输。
如果升级到 WebSocket 失败，命令将回退到使用当前的 SPDY 协议。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_REMOTE_COMMAND_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, the kubectl exec, cp, and attach commands will attempt to stream using the websockets protocol. If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
-->
当设置为 true 时，kubectl exec、cp 和 attach 命令将尝试使用 WebSocket 协议进行流式传输。
如果升级到 WebSocket 失败，这些命令将回退为使用当前的 SPDY 协议。
</td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) - Print the supported API versions on the server,
  in the form of "group/version"
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) - Attach to a running container
-->
* [kubectl annotate](/zh-cn/docs/reference/kubectl/generated/kubectl_annotate/) - 更新资源所关联的注解
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) - 打印服务器上所支持的 API 资源
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) - 以“组/版本”的格式输出服务端所支持的 API 版本
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) - 基于文件名或标准输入，将新的配置应用到资源上
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) - 挂接到一个正在运行的容器
<!--
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) - Inspect authorization
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) - Display cluster info
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) - Modify kubeconfig files
-->
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) - 检查授权信息
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) - 对一个资源对象
  （Deployment、ReplicaSet 或 ReplicationController）进行自动扩缩
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) - 修改证书资源
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) - 显示集群信息
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) - 根据已经给出的 Shell（bash 或 zsh），
  输出 Shell 补全后的代码
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) - 修改 kubeconfig 配置文件
<!--
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) - Mark node as unschedulable
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) - Create a resource from a file or from stdin.
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) - Delete resources by filenames,
  stdin, resources and names, or by resources and label selector
-->
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) - 标记节点为不可调度的
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) - 将文件和目录拷入/拷出容器
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) - 通过文件或标准输入来创建资源
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) - 创建用于排查工作负载和节点故障的调试会话
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) - 通过文件名、标准输入、资源和名字删除资源，
  或者通过资源和标签选择算符来删除资源
<!--
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) - Edit a resource on the server
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)  - List events
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) - Execute a command in a container
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) - Documentation of resources
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) - Take a replication controller,
  service, deployment or pod and expose it as a new Kubernetes Service
-->
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) - 显示某个资源或某组资源的详细信息
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) - 显示目前版本与将要应用的版本之间的差异
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) - 腾空节点，准备维护
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) - 修改服务器上的某资源
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)  - 列举事件
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) - 在容器中执行相关命令
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) - 显示资源文档说明
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) - 给定副本控制器、服务、Deployment 或 Pod，
  将其暴露为新的 kubernetes Service
<!--
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) - Display one or many resources
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) - Build a kustomization
  target from a directory or a remote url.
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) - Update the labels on a resource
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) - Print the logs for a container in a pod
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) - Update field(s) of a resource
-->
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) - 显示一个或者多个资源信息
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) - 从目录或远程 URL 中构建 kustomization
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) - 更新资源的标签
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) - 输出 Pod 中某容器的日志
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) - 打印所有命令都支持的共有参数列表
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) - 更新某资源中的字段
<!--
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) - Manage the rollout of a resource
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) - Run a particular image on the cluster
-->
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) - 运行命令行插件
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) - 将一个或者多个本地端口转发到 Pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) - 运行一个 kubernetes API 服务器代理
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) - 基于文件名或标准输入替换资源
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) - 管理资源的上线
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) - 在集群中使用指定镜像启动容器
<!--
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) - Set a new size for a Deployment, ReplicaSet or Replication Controller
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) - Set specific features on objects
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) - Update the taints on one or more nodes
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) - Mark node as schedulable
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) - Print the client and server version information
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) - Experimental: Wait for a specific condition on one or many resources.
-->
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) - 为一个 Deployment、ReplicaSet 或
  ReplicationController 设置一个新的规模值
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) - 为对象设置功能特性
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) - 在一个或者多个节点上更新污点配置
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) - 显示资源（CPU/内存/存储）使用率
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) - 标记节点为可调度的
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) - 打印客户端和服务器的版本信息
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) - 实验级特性：等待一个或多个资源达到某种状态
