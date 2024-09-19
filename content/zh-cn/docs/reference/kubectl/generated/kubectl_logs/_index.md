---
title: kubectl logs
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl logs
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Print the logs for a container in a pod or specified resource. If the pod has only one container, the container name is optional.

```
kubectl logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]
```
-->
打印 Pod 或指定资源中某个容器的日志。如果 Pod 只有一个容器，则容器名称是可选的。

```shell
kubectl logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]
```

## {{% heading "examples" %}}

<!--
```
  # Return snapshot logs from pod nginx with only one container
  kubectl logs nginx
  
  # Return snapshot logs from pod nginx with multi containers
  kubectl logs nginx --all-containers=true
  
  # Return snapshot logs from all containers in pods defined by label app=nginx
  kubectl logs -l app=nginx --all-containers=true
  
  # Return snapshot of previous terminated ruby container logs from pod web-1
  kubectl logs -p -c ruby web-1
  
  # Begin streaming the logs of the ruby container in pod web-1
  kubectl logs -f -c ruby web-1
  
  # Begin streaming the logs from all containers in pods defined by label app=nginx
  kubectl logs -f -l app=nginx --all-containers=true
  
  # Display only the most recent 20 lines of output in pod nginx
  kubectl logs --tail=20 nginx
  
  # Show all logs from pod nginx written in the last hour
  kubectl logs --since=1h nginx
  
  # Show logs from a kubelet with an expired serving certificate
  kubectl logs --insecure-skip-tls-verify-backend nginx
  
  # Return snapshot logs from first container of a job named hello
  kubectl logs job/hello
  
  # Return snapshot logs from container nginx-1 of a deployment named nginx
  kubectl logs deployment/nginx -c nginx-1
```
-->
```shell
  # 返回只有一个容器的 nginx Pod 中的快照日志
  kubectl logs nginx
  
  # 返回有多个容器的 nginx Pod 中的快照日志
  kubectl logs nginx --all-containers=true
  
  # 返回带 app=nginx 标签定义的 Pod 中所有容器的快照日志
  kubectl logs -l app=nginx --all-containers=true
  
  # 返回 web-1 Pod 中之前终止的 ruby 容器日志的日志
  kubectl logs -p -c ruby web-1
  
  # 开始流式传输 web-1 Pod 中 ruby 容器的日志
  kubectl logs -f -c ruby web-1
  
  # 开始流式传输带 app=nginx 标签定义的 Pod 中所有容器的日志
  kubectl logs -f -l app=nginx --all-containers=true
  
  # 仅显示 nginx Pod 的最近 20 行输出
  kubectl logs --tail=20 nginx
  
  # 显示 nginx Pod 在过去一小时内写入的所有日志
  kubectl logs --since=1h nginx
  
  # 显示所提供证书过期的 kubelet 的日志
  kubectl logs --insecure-skip-tls-verify-backend nginx
  
  # 返回名为 hello 的 Job 的第一个容器的快照日志
  kubectl logs job/hello
  
  # 返回 nginx Deployment 的 nginx-1 容器的快照日志
  kubectl logs deployment/nginx -c nginx-1
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--all-containers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Get all containers' logs in the pod(s).
-->
获取 Pod 中所有容器的日志。
</p></td>
</tr>

<tr>
<td colspan="2">--all-pods</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Get logs from all pod(s). Sets prefix to true.
-->
从所有 Pod 获取日志。将前缀设置为 true。
</p>
</td>
</tr>

<tr>
<td colspan="2">-c, --container string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Print the logs of this container
-->
打印指定容器的日志。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --follow</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify if the logs should be streamed.
-->
指定日志是否应以流式传输。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for logs
-->
logs 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--ignore-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If watching / following pod logs, allow for any errors that occur to be non-fatal
-->
如果在监视/跟随 Pod 日志，则允许出现任何非致命的错误。
</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify-backend</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Skip verifying the identity of the kubelet that logs are requested from.  In theory, an attacker could provide invalid log content back. You might want to use this if your kubelet serving certificates have expired.
-->
跳过请求日志来源的 kubelet 的身份验证。从理论上讲，攻击者可能会提供无效的日志内容。
如果你的 kubelet 提供的证书已过期，你可能需要使用此参数。
</p></td>
</tr>

<tr>
<td colspan="2">--limit-bytes int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Maximum bytes of logs to return. Defaults to no limit.
-->
要返回的日志的最大字节数。默认为无限制。
</p></td>
</tr>

<tr>
<td colspan="2">--max-log-requests int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify maximum number of concurrent logs to follow when using by a selector. Defaults to 5.
-->
指定使用选择算符时要遵循的最大并发日志数。默认值为 5。
</p></td>
</tr>

<tr>
<td colspan="2">--pod-running-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：20s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running
-->
等待至少一个 Pod 运行的时长（例如 5s、2m 或 3h，大于零）。
</p></td>
</tr>

<tr>
<td colspan="2">--prefix</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix each log line with the log source (pod name and container name)
-->
在每行日志前添加日志来源（Pod 名称和容器名称）的前缀。
</p></td>
</tr>

<tr>
<td colspan="2">-p, --previous</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, print the logs for the previous instance of the container in a pod if it exists.
-->
如果为 true，则打印 Pod 中容器的前一个实例的日志（如果存在）。
</p></td>
</tr>

<tr>
<td colspan="2">-l, --selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
-->
过滤所用的选择算符（标签查询），支持 '='、'==' 和 '！='。
（例如 -l key1=value1,key2=value2）。匹配的对象必须满足所有指定的标签约束。
</p></td>
</tr>

<tr>
<td colspan="2">--since duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Only return logs newer than a relative duration like 5s, 2m, or 3h. Defaults to all logs. Only one of since-time / since may be used.
-->
仅返回比相对时长更新的日志，如 5s、2m 或 3h。
默认返回所有日志。只能使用 since-time 和 since 之一。
</p></td>
</tr>

<tr>
<td colspan="2">--since-time string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Only return logs after a specific date (RFC3339). Defaults to all logs. Only one of since-time / since may be used.
-->
仅返回特定日期（RFC3339）之后的日志。默认返回所有日志。
只能使用 since-time 和 since 之一。
</p></td>
</tr>

<tr>
<td colspan="2">--tail int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Lines of recent log file to display. Defaults to -1 with no selector, showing all log lines otherwise 10, if a selector is provided.
-->
要显示的最近日志文件的行数。不带选择算符时默认为 -1 将显示所有日志行。
否则如果提供了选择算符，则为 10。
</p></td>
</tr>

<tr>
<td colspan="2">--timestamps</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Include timestamps on each line in the log output
-->
在日志输出的每一行中包含时间戳。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "parentoptions" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
-->
操作所用的伪装用户名。用户可以是常规用户或命名空间中的服务账号。
</p></td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
-->
操作所用的伪装用户组，此标志可以被重复设置以指定多个组。
</p></td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
UID to impersonate for the operation.
-->
操作所用的伪装 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Default cache directory
-->
默认缓存目录。
</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a cert file for the certificate authority
-->
证书机构的证书文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client certificate file for TLS
-->
TLS 客户端证书文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client key file for TLS
-->
TLS 客户端密钥文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 中的集群名称。
</p></td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig context to use
-->
要使用的 kubeconfig 上下文的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
设置针对 notReady:NoExecute 的容忍度的 tolerationSeconds，默认添加到所有尚未设置此容忍度的 Pod。
</p></td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
设置针对 unreachable:NoExecute 的容忍度的 tolerationSeconds，默认添加到所有尚未设置此容忍度的 Pod。
</p></td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, opt-out of response compression for all requests to the server
-->
如果为 true，则对服务器所有请求的响应不再压缩。
</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
-->
如果为 true，则不检查服务器证书的有效性。这将使你的 HTTPS 连接不安全。
</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to the kubeconfig file to use for CLI requests.
-->
CLI 请求要使用的 kubeconfig 文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Require server version to match client version
-->
要求服务器版本与客户端版本匹配。
</p></td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If present, the namespace scope for this CLI request
-->
如果存在，则是此 CLI 请求所针对的命名空间范围。
</p></td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Password for basic authentication to the API server
-->
对 API 服务器进行基本身份验证所用的密码。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要记录的性能分析信息。可选值为（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the file to write the profile to
-->
性能分析信息要写入的目标文件的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
-->
在放弃某个服务器请求之前等待的时长。非零值应包含相应的时间单位（例如 1s、2m、3h）。
值为零表示请求不会超时。
</p></td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The address and port of the Kubernetes API server
-->
Kubernetes API 服务器的地址和端口。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
对存储驱动的写入操作将被缓存的时长；缓存的操作会作为一个事务提交给非内存后端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database name
-->
数据库名称。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
数据库 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database password
-->
数据库密码。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
use secure connection with database
-->
使用与数据库的安全连接。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
table name
-->
表名。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database username
-->
数据库用户名。
</p></td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
-->
服务器证书验证所用的服务器名称。如果未提供，则使用与服务器通信所用的主机名。
</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Bearer token for authentication to the API server
-->
向 API 服务器进行身份验证的持有者令牌。
</p></td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig user to use
-->
要使用的 kubeconfig 用户的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Username for basic authentication to the API server
-->
对 API 服务器进行基本身份验证时所用的用户名。
</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息并退出；--version=vX.Y.Z... 设置报告的版本。
</p></td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Treat warnings received from the server as errors and exit with a non-zero exit code
-->
将从服务器收到的警告视为错误，并以非零退出码退出。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 用于控制 Kubernetes 集群管理器
