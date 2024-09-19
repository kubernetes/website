---
title: kubectl annotate
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl annotate
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Update the annotations on one or more resources.

 All Kubernetes objects support the ability to store additional data with the object as annotations. Annotations are key/value pairs that can be larger than labels and include arbitrary string values such as structured JSON. Tools and system extensions may use annotations to store their own data.

 Attempting to set an annotation that already exists will fail unless --overwrite is set. If --resource-version is specified and does not match the current resource version on the server the command will fail.

Use "kubectl api-resources" for a complete list of supported resources.
-->
更新一个或多个资源上的注解。

所有 Kubernetes 对象都支持以注解（Annotation）的形式为对象存储额外的数据。
注解是一些键/值对，可以比标签的数据量更大，可以包含诸如结构化 JSON 这类任意字符串值。
各种工具和系统扩展可以使用注解来存储自己的数据。

尝试设置已存在的注解的操作将会失败，除非设置了 --overwrite 选项。
如果 --resource-version 被指定且与服务器上当前资源版本不匹配，命令将会失败。

使用 "kubectl api-resources" 获取可支持的资源完整列表。

```shell
kubectl annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]
```

## {{% heading "examples" %}}

<!--
```
  # Update pod 'foo' with the annotation 'description' and the value 'my frontend'
  # If the same annotation is set multiple times, only the last value will be applied
  kubectl annotate pods foo description='my frontend'
  
  # Update a pod identified by type and name in "pod.json"
  kubectl annotate -f pod.json description='my frontend'
  
  # Update pod 'foo' with the annotation 'description' and the value 'my frontend running nginx', overwriting any existing value
  kubectl annotate --overwrite pods foo description='my frontend running nginx'
  
  # Update all pods in the namespace
  kubectl annotate pods --all description='my frontend running nginx'
  
  # Update pod 'foo' only if the resource is unchanged from version 1
  kubectl annotate pods foo description='my frontend running nginx' --resource-version=1
  
  # Update pod 'foo' by removing an annotation named 'description' if it exists
  # Does not require the --overwrite flag
  kubectl annotate pods foo description-
```
-->
```shell
# 使用注解 'description' 和值 'my frontend' 更新 Pod 'foo'
# 如果同一注解被设置多次，则只使用最后一个值
kubectl annotate pods foo description='my frontend'

# 更新在 "pod.json" 中指定 type 和 name 的 Pod
kubectl annotate -f pod.json description='my frontend'

# 更新 Pod 'foo'，设置注解 'description' 和值 'my frontend running nginx'，覆盖其当前值
kubectl annotate --overwrite pods foo description='my frontend running nginx'

# 更新命名空间中的所有 Pod
kubectl annotate pods --all description='my frontend running nginx'

# 仅在资源版本仍为 1 时更新 Pod 'foo'
kubectl annotate pods foo description='my frontend running nginx' --resource-version=1

# 通过删除名为 'description' 的注解（如果存在）来更新 Pod 'foo'
# 不需要 --overwrite 标志
kubectl annotate pods foo description-
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
Select all resources, in the namespace of the specified resource types.
-->
在指定资源类型的命名空间中，选择所有资源。
</p></td>
</tr>

<tr>
<td colspan="2">-A, --all-namespaces</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, check the specified action in all namespaces.
-->
如果为 true，则在所有命名空间中执行指定的操作。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: true-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果为 true，在模板中字段或映射键缺失时忽略模板中的错误。
仅适用于 golang 和 jsonpath 输出格式。
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "none"-->默认值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Must be &quot;none&quot;, &quot;server&quot;, or &quot;client&quot;. If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource.
-->
必须是 "none"、"server" 或 "client"。如果是 client 策略，仅打印将要发送的对象，而不实际发送。
如果是 server 策略，提交服务器端请求而不持久化资源。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "kubectl-annotate"-->默认值："kubectl-annotate"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the manager used to track field ownership.
-->
用于跟踪字段属主关系的管理器的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--field-selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.
-->
过滤所用的选择算符（字段查询），支持 '='、'==' 和 '!='。
（例如 --field-selector key1=value1,key2=value2）。服务器针对每种类型仅支持有限数量的字段查询。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Filename, directory, or URL to files identifying the resource to update the annotation
-->
文件名、目录或文件 URL，用于标识要更新注解的资源。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for annotate
-->
annotate 的帮助命令。
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
<td colspan="2">--list</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, display the annotations for a given resource.
-->
如果为 true，则显示给定资源的注解。
</p></td>
</tr>

<tr>
<td colspan="2">--local</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, annotation will NOT contact api-server but run locally.
-->
如果为 true，则注解不会与 api-server 通信，而是在本地运行。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
-->
输出格式。可选值为：
json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、jsonpath-as-json、jsonpath-file。
</p></td>
</tr>

<tr>
<td colspan="2">--overwrite</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, allow annotations to be overwritten, otherwise reject annotation updates that overwrite existing annotations.
-->
如果为 true，则允许注解被覆盖，否则拒绝覆盖现有注解的更新。
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
<td colspan="2">--resource-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If non-empty, the annotation update will only succeed if this is the current resource-version for the object. Only valid when specifying a single resource.
-->
如果非空，则只有在所给值是对象的当前资源版本时，注解更新才会成功。仅在指定单个资源时有效。
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
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果为 true，在以 JSON 或 YAML 格式打印对象时保留 managedFields。
</p></td>
</tr>

<tr>
<td colspan="2">--template string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
-->
当 -o=go-template、-o=go-template-file 时使用的模板字符串或模板文件路径。
模板格式为 golang 模板 [http://golang.org/pkg/text/template/#pkg-overview]。
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
kubeconfig 中要使用的集群的名称。
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
kubeconfig 要使用的上下文的名称。
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
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 集群管理器
