---
title: kubectl
content_type: tool-reference
weight: 30
---
<!--
title: kubectl
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/
-->
kubectl 用于控制 Kubernetes 集群管理器。

参阅更多细节：
https://kubernetes.io/zh-cn/docs/reference/kubectl/

```bash
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for kubectl
-->
kubectl 操作的帮助命令。
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
* [kubectl annotate](../kubectl_annotate/) - Update the annotations on a resource
* [kubectl api-resources](../kubectl_api-resources/) - Print the supported API resources on the server
* [kubectl api-versions](../kubectl_api-versions/) - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](../kubectl_apply/) - Apply a configuration to a resource by file name or stdin
* [kubectl attach](../kubectl_attach/) - Attach to a running container
-->
* [kubectl annotate](../kubectl_annotate/) - 更新资源上的注解
* [kubectl api-resources](../kubectl_api-resources/) - 打印服务器上所支持的 API 资源
* [kubectl api-versions](../kubectl_api-versions/) - 以“组/版本”的格式输出服务端所支持的 API 版本
* [kubectl apply](../kubectl_apply/) - 基于文件名或标准输入，将新的配置应用到资源上
* [kubectl attach](../kubectl_attach/) - 挂接到一个正在运行的容器
<!--
* [kubectl auth](../kubectl_auth/) - Inspect authorization
* [kubectl autoscale](../kubectl_autoscale/) - Auto-scale a deployment, replica set, stateful set, or replication controller
* [kubectl certificate](../kubectl_certificate/) - Modify certificate resources
* [kubectl cluster-info](../kubectl_cluster-info/) - Display cluster information
* [kubectl completion](../kubectl_completion/) - Output shell completion code for the specified shell (bash, zsh, fish, or powershell)
* [kubectl config](../kubectl_config/) - Modify kubeconfig files
-->
* [kubectl auth](../kubectl_auth/) - 检查授权信息
* [kubectl autoscale](../kubectl_autoscale/) - 对一个资源对象
  （Deployment、ReplicaSet 或 ReplicationController）进行自动扩缩
* [kubectl certificate](../kubectl_certificate/) - 修改证书资源
* [kubectl cluster-info](../kubectl_cluster-info/) - 显示集群信息
* [kubectl completion](../kubectl_completion/) - 根据已经给出的 Shell（bash 或 zsh），输出 Shell 补全后的代码
* [kubectl config](../kubectl_config/) - 修改 kubeconfig 配置文件
<!--
* [kubectl cordon](../kubectl_cordon/) - Mark node as unschedulable
* [kubectl cp](../kubectl_cp/) - Copy files and directories to and from containers
* [kubectl create](../kubectl_create/) - Create a resource from a file or from stdin
* [kubectl debug](../kubectl_debug/) - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](../kubectl_delete/) - Delete resources by file names, stdin, resources and names, or by resources and label selector
-->
* [kubectl cordon](../kubectl_cordon/) - 标记节点为不可调度的
* [kubectl cp](../kubectl_cp/) - 将文件和目录拷入/拷出容器
* [kubectl create](../kubectl_create/) - 通过文件或标准输入来创建资源
* [kubectl debug](../kubectl_debug/) - 创建用于排查工作负载和节点故障的调试会话
* [kubectl delete](../kubectl_delete/) - 通过文件名、标准输入、资源和名字删除资源，
  或者通过资源和标签选择算符来删除资源
<!--
* [kubectl describe](../kubectl_describe/) - Show details of a specific resource or group of resources
* [kubectl diff](../kubectl_diff/) - Diff the live version against a would-be applied version
* [kubectl drain](../kubectl_drain/) - Drain node in preparation for maintenance
* [kubectl edit](../kubectl_edit/) - Edit a resource on the server
* [kubectl events](../kubectl_events/) - List events
* [kubectl exec](../kubectl_exec/) - Execute a command in a container
* [kubectl explain](../kubectl_explain/) - Get documentation for a resource
* [kubectl expose](../kubectl_expose/) - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
-->
* [kubectl describe](../kubectl_describe/) - 显示某个资源或某组资源的详细信息
* [kubectl diff](../kubectl_diff/) - 显示目前版本与将要应用的版本之间的差异
* [kubectl drain](../kubectl_drain/) - 腾空节点，准备维护
* [kubectl edit](../kubectl_edit/) - 修改服务器上的某资源
* [kubectl events](../kubectl_events/) - 列举事件
* [kubectl exec](../kubectl_exec/) - 在容器中执行命令
* [kubectl explain](../kubectl_explain/) - 显示资源文档说明
* [kubectl expose](../kubectl_expose/) - 给定 ReplicationController、Service、Deployment 或 Pod，
  将其暴露为新的 kubernetes Service
<!--
* [kubectl get](../kubectl_get/) - Display one or many resources
* [kubectl kustomize](../kubectl_kustomize/) - Build a kustomization target from a directory or URL
* [kubectl label](../kubectl_label/) - Update the labels on a resource
* [kubectl logs](../kubectl_logs/) - Print the logs for a container in a pod
* [kubectl options](../kubectl_options/) - Print the list of flags inherited by all commands
* [kubectl patch](../kubectl_patch/) - Update fields of a resource
-->
* [kubectl get](../kubectl_get/) - 显示一个或者多个资源
* [kubectl kustomize](../kubectl_kustomize/) - 基于目录或远程 URL 内容构建 kustomization 目标
* [kubectl label](../kubectl_label/) - 更新资源的标签
* [kubectl logs](../kubectl_logs/) - 输出 Pod 中某容器的日志
* [kubectl options](../kubectl_options/) - 打印所有命令都支持的共有参数列表
* [kubectl patch](../kubectl_patch/) - 更新某资源中的字段
<!--
* [kubectl plugin](../kubectl_plugin/) - Provides utilities for interacting with plugins
* [kubectl port-forward](../kubectl_port-forward/) - Forward one or more local ports to a pod
* [kubectl proxy](../kubectl_proxy/) - Run a proxy to the Kubernetes API server
* [kubectl replace](../kubectl_replace/) - Replace a resource by file name or stdin
* [kubectl rollout](../kubectl_rollout/) - Manage the rollout of a resource
* [kubectl run](../kubectl_run/) - Run a particular image on the cluster
-->
* [kubectl plugin](../kubectl_plugin/) - 提供与插件交互的工具
* [kubectl port-forward](../kubectl_port-forward/) - 将一个或者多个本地端口转发到 Pod
* [kubectl proxy](../kubectl_proxy/) - 运行一个 kubernetes API 服务器代理
* [kubectl replace](../kubectl_replace/) - 基于文件名或标准输入替换资源
* [kubectl rollout](../kubectl_rollout/) - 管理资源的上线
* [kubectl run](../kubectl_run/) - 在集群中使用指定镜像启动容器
<!--
* [kubectl scale](../kubectl_scale/) - Set a new size for a deployment, replica set, or replication controller
* [kubectl set](../kubectl_set/) - Set specific features on objects
* [kubectl taint](../kubectl_taint/) - Update the taints on one or more nodes
* [kubectl top](../kubectl_top/) - Display resource (CPU/memory) usage
* [kubectl uncordon](../kubectl_uncordon/) - Mark node as schedulable
* [kubectl version](../kubectl_version/) - Print the client and server version information
* [kubectl wait](../kubectl_wait/) - Experimental: Wait for a specific condition on one or many resources
-->
* [kubectl scale](../kubectl_scale/) - 为一个 Deployment、ReplicaSet 或
  ReplicationController 设置一个新的规模值
* [kubectl set](../kubectl_set/) - 为对象设置功能特性
* [kubectl taint](../kubectl_taint/) - 在一个或者多个节点上更新污点配置
* [kubectl top](../kubectl_top/) - 显示资源（CPU/内存/存储）使用率
* [kubectl uncordon](../kubectl_uncordon/) - 标记节点为可调度的
* [kubectl version](../kubectl_version/) - 打印客户端和服务器的版本信息
* [kubectl wait](../kubectl_wait/) - 实验级特性：等待一个或多个资源达到某种状态
