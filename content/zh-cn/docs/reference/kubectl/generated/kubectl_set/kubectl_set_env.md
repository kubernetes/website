---
title: kubectl set env
content_type: tool-reference
weight: 30
---
<!--
title: kubectl set env
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
Update environment variables on a pod template.

 List environment variable definitions in one or more pods, pod templates. Add, update, or remove container environment variable definitions in one or more pod templates (within replication controllers or deployment configurations). View or modify the environment variable definitions on all containers in the specified pods or pod templates, or just those that match a wildcard.
-->
更新 Pod 模板中的环境变量。

列举一个或多个 Pod 和 Pod 模板中的环境变量定义。
添加、更新或移除（在副本控制器或 Deployment 配置中的）一个或多个 Pod 模板中的容器环境变量定义。
查看或修改指定 Pod 或 Pod 模板中所有容器的环境变量定义，或者只查看与通配符匹配的那些环境变量定义。

<!--
If "--env -" is passed, environment variables can be read from STDIN using the standard env syntax.

 Possible resources include (case insensitive):

        pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), statefulset (sts), cronjob (cj), replicaset (rs)
-->
如果在命令行上设置了 "--env -"，则可以使用标准的 env 语法从标准输入中读取环境变量。

可能的资源包括（不区分大小写）：

```
pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), statefulset (sts), cronjob (cj), replicaset (rs)
```

```shell
kubectl set env RESOURCE/NAME KEY_1=VAL_1 ... KEY_N=VAL_N
```

## {{% heading "examples" %}}

<!--
```
# Update deployment 'registry' with a new environment variable
# List the environment variables defined on a deployments 'sample-build'
# List the environment variables defined on all pods
# Output modified deployment in YAML, and does not alter the object on the server
# Update all containers in all replication controllers in the project to have ENV=prod
# Import environment from a secret
# Import environment from a config map with a prefix
# Import specific keys from a config map
# Remove the environment variable ENV from container 'c1' in all deployment configs
# Remove the environment variable ENV from a deployment definition on disk and
# update the deployment config on the server
# Set some of the local shell environment into a deployment config on the server
```
-->
```shell
# 使用新的环境变量更新 Deployment “registry”
kubectl set env deployment/registry STORAGE_DIR=/local
  
# 列举 Deployment “sample-build” 中定义的环境变量
kubectl set env deployment/sample-build --list
  
# 列举所有 Pod 中定义的环境变量
kubectl set env pods --all --list
  
# 以 YAML 格式输出修改后的 Deployment，但不更改服务器上的对象
kubectl set env deployment/sample-build STORAGE_DIR=/data -o yaml
  
# 更新项目中所有副本控制器中的所有容器，为之添加 ENV=prod
kubectl set env rc --all ENV=prod
  
# 从 Secret 导入环境变量
kubectl set env --from=secret/mysecret deployment/myapp
  
# 从带前缀的 ConfigMap 中导入环境变量
kubectl set env --from=configmap/myconfigmap --prefix=MYSQL_ deployment/myapp
  
# 从 ConfigMap 中导入特定键
kubectl set env --keys=my-example-key --from=configmap/myconfigmap deployment/myapp
  
# 从所有 Deployment 配置中的容器 “c1” 中移除环境变量 ENV
kubectl set env deployments --all --containers="c1" ENV-
  
# 从磁盘上的 Deployment 定义中移除环境变量 ENV 并更新服务器上的 Deployment 配置
kubectl set env -f deploy.json ENV-
  
# 将某些本地 Shell 环境变量设置到服务器上的 Deployment 配置中
env | grep RAILS_ | kubectl set env -e - deployment/registry
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
If true, select all resources in the namespace of the specified resource types
-->
如果为真，则选择指定资源类型的命名空间中的所有资源。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
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
<td colspan="2">-c, --containers string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："*"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The names of containers in the selected pod templates to change - may use wildcards
-->
所选 Pod 模板中要更改的容器名称 - 可以使用通配符。
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："none"</td>
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
<td colspan="2">-e, --env strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify a key-value pair for an environment variable to set into each container.
-->
为某个环境变量指定一个键值对列表，以设置到每个容器中。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kubectl-set"</td>
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
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Filename, directory, or URL to files the resource to update the env
-->
文件名、目录或文件 URL 组成的列表，用于标识要更新环境的资源。
</p></td>
</tr>

<tr>
<td colspan="2">--from string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of a resource from which to inject environment variables
-->
要从中注入环境变量的资源的名称。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for env
-->
env 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--keys strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of keys to import from specified resource
-->
要从指定的资源中导入的、以英文逗号分隔的键的列表。
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
If true, display the environment and any changes in the standard format. this flag will removed when we have kubectl view env.
-->
如果为真，则以标准格式显示环境及所有变更。
当我们使用 `kubectl view env` 命令时，此标志将被移除。
</p></td>
</tr>

<tr>
<td colspan="2">--local</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, set env will NOT contact api-server but run locally.
-->
如果为真，`set env` 将不会与 API 服务器通信，而是在本地运行。
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
<td colspan="2">--overwrite&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, allow environment to be overwritten, otherwise reject updates that overwrite existing environment.
-->
如果为真，允许环境被覆盖，否则拒绝要覆盖现有环境的更新。
</p></td>
</tr>

<tr>
<td colspan="2">--prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix to append to variable names
-->
要追加到变量名上的前缀。
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
<td colspan="2">--resolve</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, show secret or configmap references when listing variables
-->
如果为真，则在列出变量时显示 Secret 或 ConfigMap 引用。
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
如果为真，在以 JSON 或 YAML 格式打印对象时保留 managedFields。
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
* [kubectl set](../)	 - Set specific features on objects
-->
* [kubectl set](../) - 为对象设置功能特性
