---
title: kubectl expose
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl expose
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Expose a resource as a new Kubernetes service.

 Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the resource it exposes.
-->
将资源公开为新的 Kubernetes 服务。

基于名称查找 Deployment、Service、ReplicaSet、ReplicationController 或 Pod，
并将该资源的选择算符用作指定端口上新服务的选择算符。
只有当 Deployment 或 ReplicaSet 的选择算符可转换为服务支持的选择算符
（即选择算符仅包含 matchLabels 部分）时，才会将其公开为服务。
请注意，如果未通过 --port 指定端口且所公开的资源有多个端口，
则新服务将重用所有这些端口。此外，如果未指定标签，新服务将重用它所公开的资源的标签。

<!--
Possible resources include (case insensitive):

 pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)
-->
可能的资源包括（不区分大小写）：

```
pod (po)，service (svc)，replicationcontroller (rc)，deployment (deploy)，replicaset (rs)
```

kubectl expose 命令的格式为：

```shell
kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

## {{% heading "examples" %}}

<!--
```
  # Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
  # Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000
  # Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
  # Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
  # Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
  # Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000
  # Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000
```
-->
```shell
# 为多副本的 nginx 创建一个服务，服务端口为 80，通过端口 8000 连接到容器
kubectl expose rc nginx --port=80 --target-port=8000

# 为在 "nginx-controller.yaml" 中以 type 和 name 指定的 ReplicationController 创建一个服务
# 服务端口为 80，通过端口 8000 连接到容器
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000

# 为名为 valid-pod 的 Pod 创建一个服务，服务端口为 444，名称为 "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# 基于上述服务创建第二个服务，将容器端口 8443 公开为端口 443，名称为 "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https

# 为在端口 4100 上平衡 UDP 流量的多副本流应用创建一个服务，名称为 “video-stream”
kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream

# 为使用 ReplicaSet 的多副本 nginx 创建一个服务，服务端口为 80，通过端口 8000 连接到容器
kubectl expose rs nginx --port=80 --target-port=8000

# 为 nginx Deployment 创建一个服务，服务端口为 80，通过端口 8000 连接到容器
kubectl expose deployment nginx --port=80 --target-port=8000
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

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
<td colspan="2">--cluster-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless service.
-->
要指派给服务的 ClusterIP。留空表示自动分配，或设置为 “None” 以创建无头服务。
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
<td colspan="2">--external-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP.
-->
服务要接受的附加外部 IP 地址（不由 Kubernetes 管理）。
如果此 IP 被路由到某个节点，则除了生成的服务 IP 之外，还可以通过此 IP 访问服务。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："kubectl-expose"</td>
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
Filename, directory, or URL to files identifying the resource to expose a service
-->
文件名、目录或文件 URL 列表，用于标识要公开服务的资源。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for expose
-->
expose 操作的帮助命令。
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
<td colspan="2">-l, --labels string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Labels to apply to the service created by this call.
-->
要应用到此子命令所创建的服务上的标签。
</p></td>
</tr>

<tr>
<td colspan="2">--load-balancer-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
IP to assign to the LoadBalancer. If empty, an ephemeral IP will be created and used (cloud-provider specific).
-->
要指派给负载均衡器的 IP。如果为空，将创建并使用一个临时 IP（具体取决于云提供商）。
</p></td>
</tr>

<tr>
<td colspan="2">--name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name for the newly created object.
-->
新建对象的名称。
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
<td colspan="2">--override-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："merge"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The method used to override the generated object: json, merge, or strategic.
-->
用于覆盖已生成对象的方法：json、merge 或 strategic。
</p></td>
</tr>

<tr>
<td colspan="2">--overrides string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.
-->
用于覆盖已生成对象的内联 JSON。如果此字段非空，它将用于覆盖已生成的对象。
要求对象提供一个有效的 apiVersion 字段。
</p></td>
</tr>

<tr>
<td colspan="2">--port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The port that the service should serve on. Copied from the resource being exposed, if unspecified
-->
应该用于提供服务的端口。如果不指定，则从正被公开的资源复制。
</p></td>
</tr>

<tr>
<td colspan="2">--protocol string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The network protocol for the service to be created. Default is 'TCP'.
-->
要创建的服务的网络协议。默认是 “TCP”。
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
以递归方式处理在 -f、--filename 中给出的目录。当你想要管理位于同一目录中的相关清单时很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--save-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
-->
如果为 true，则当前对象的配置将被保存在其注解中。否则，注解将保持不变。
当你希望后续对此对象执行 `kubectl apply` 操作时，此标志很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set.)
-->
指定服务所用的标签选择算符。仅支持基于等式的选择算符需求。
如果为空（默认值），则从 ReplicationController 或 ReplicaSet 中推断选择算符。
</p></td>
</tr>

<tr>
<td colspan="2">--session-affinity string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'
-->
如果非空，将服务的会话亲和性设置为此值；有效值为：“None”、“ClientIP”。
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
<td colspan="2">--target-port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name or number for the port on the container that the service should direct traffic to. Optional.
-->
容器上服务应将流量导向的端口名称或端口号。可选。
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

<tr>
<td colspan="2">--type string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Type for this service: ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.
-->
此服务的类别：ClusterIP、NodePort、LoadBalancer 或 ExternalName。默认是 “ClusterIP”。
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
要使用的 kubeconfig 集群的名称。
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
向 API 服务器进行基本身份验证所用的密码。
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
向 API 服务器进行基本身份验证时所用的用户名。
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
