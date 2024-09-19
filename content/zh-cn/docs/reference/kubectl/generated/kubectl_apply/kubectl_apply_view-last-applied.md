---
title: kubectl apply view-last-applied
content_type: tool-reference
weight: 30
---
<!--
title: kubectl apply view-last-applied
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
View the latest last-applied-configuration annotations by type/name or file.

 The default output will be printed to stdout in YAML format. You can use the -o option to change the output format.
-->
根据所给类别/名称或文件来查看最新的 last-applied-configuration 注解。

默认输出将以 YAML 格式打印到标准输出。你可以使用 -o 选项来更改输出格式。

```shell
kubectl apply view-last-applied (TYPE [NAME | -l label] | TYPE/NAME | -f FILENAME)
```

## {{% heading "examples" %}}

<!--
```
  # View the last-applied-configuration annotations by type/name in YAML
  kubectl apply view-last-applied deployment/nginx
  
  # View the last-applied-configuration annotations by file in JSON
  kubectl apply view-last-applied -f deploy.yaml -o json
```
-->
```shell
# 根据所给类别/名称以 YAML 格式查看 last-applied-configuration 注解
kubectl apply view-last-applied deployment/nginx
  
# 根据所给文件以 JSON 格式查看 last-applied-configuration 注解
kubectl apply view-last-applied -f deploy.yaml -o json
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Select all resources in the namespace of the specified resource types
-->
选择指定资源类型的命名空间中的所有资源。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Filename, directory, or URL to files that contains the last-applied-configuration annotations
-->
包含 last-applied-configuration 注解的文件的文件名、目录或 URL 的列表。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for view-last-applied
-->
view-last-applied 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">-k, --kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process the kustomization directory. This flag can't be used together with -f or -R.
-->
处理 kustomization 目录。此标志不能与 -f 或 -R 一起使用。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Output format. Must be one of (yaml, json)
-->
输出格式。必须是 yaml 或 json 之一。
</p></td>
</tr>

<tr>
<td colspan="2">-R, --recursive</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
-->
递归处理在 -f、--filename 中给出的目录。当你想要管理位于同一目录中的相关清单时很有用。
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
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "$HOME/.kube/cache"-->默认值："$HOME/.kube/cache"</td>
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
要使用的 kubeconfig 中集群的名称。
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
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 300-->默认值：300</td>
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
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 300-->默认值：300</td>
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
如果存在，则是此 CLI 请求的命名空间范围。
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
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "none"-->默认值："none"</td>
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
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "profile.pprof"-->默认值："profile.pprof"</td>
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
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "0"-->默认值："0"</td>
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
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1m0s-->默认值：1m0s</td>
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
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "cadvisor"-->默认值："cadvisor"</td>
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
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "localhost:8086"-->默认值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
数据库 host:port。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默认值："root"</td>
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
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "stats"-->默认值："stats"</td>
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
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默认值："root"</td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
-->
服务器证书验证所用的服务器名称。如果未提供，则使用与服务器通信所用的主机名。
</p>
</td>
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
* [kubectl apply](../)	 - Apply a configuration to a resource by file name or stdin
-->
* [kubectl apply](../) - 基于文件名或标准输入将配置应用于资源
