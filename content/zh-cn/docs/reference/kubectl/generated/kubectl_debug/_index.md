---
title: kubectl debug
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl debug
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Debug cluster resources using interactive debugging containers.

 'debug' provides automation for common debugging tasks for cluster objects identified by resource and name. Pods will be used by default if no resource is specified.

 The action taken by 'debug' varies depending on what resource is specified. Supported actions include:
-->
使用交互式调试容器调试集群资源。

“debug” 针对按资源和名称标识的集群对象为常用的调试任务提供自动化操作。如果不指定资源，则默认使用 Pod。

“debug” 采取的操作因指定的资源而异。支持的操作包括：

<!--
*  Workload: Create a copy of an existing pod with certain attributes changed, for example changing the image tag to a new version.
  *  Workload: Add an ephemeral container to an already running pod, for example to add debugging utilities without restarting the pod.
  *  Node: Create a new pod that runs in the node's host namespaces and can access the node's filesystem.
-->
* 工作负载：创建现有 Pod 的副本并更改某些属性，例如将镜像标签更改为新版本。
* 工作负载：向已运行的 Pod 中添加临时容器，例如在不重启 Pod 的情况下添加调试工具。
* 节点：新建一个在节点的主机命名空间中运行并可以访问节点文件系统的 Pod。

```shell
kubectl debug (POD | TYPE[[.VERSION].GROUP]/NAME) [ -- COMMAND [args...] ]
```

## {{% heading "examples" %}}

<!--
```
# Create an interactive debugging session in pod mypod and immediately attach to it.
# Create an interactive debugging session for the pod in the file pod.yaml and immediately attach to it.
# (requires the EphemeralContainers feature to be enabled in the cluster)
# Create a debug container named debugger using a custom automated debugging image.
# Create a copy of mypod adding a debug container and attach to it
# Create a copy of mypod changing the command of mycontainer
# Create a copy of mypod changing all container images to busybox
# Create a copy of mypod adding a debug container and changing container images
# Create an interactive debugging session on a node and immediately attach to it.
# The container will run in the host namespaces and the host's filesystem will be mounted at /host
```
-->
```shell
# 在名为 mypod 的 Pod 中创建一个交互式调试会话并立即挂接到此会话
kubectl debug mypod -it --image=busybox

# 为文件 pod.yaml 中的 Pod 创建一个交互式调试会话并立即挂接到此会话
# （需要在集群中启用 EphemeralContainers 特性）
kubectl debug -f pod.yaml -it --image=busybox

# 使用特定的自动调试镜像创建一个名为 debugger 的调试容器
kubectl debug --image=myproj/debug-tools -c debugger mypod

# 创建 mypod 的副本，添加调试容器并挂接到此容器
kubectl debug mypod -it --image=busybox --copy-to=my-debugger

# 创建 mypod 的副本，更改 mycontainer 的命令
kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh

# 创建 mypod 的副本，将所有容器镜像更改为 busybox
kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox

# 创建 mypod 的副本，添加调试容器并更改容器镜像
kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug

# 在节点上创建一个交互式调试会话并立即挂接到此会话
# 容器将在主机命名空间中运行，主机的文件系统将被挂载到 /host
kubectl debug node/mynode -it --image=busybox
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--arguments-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If specified, everything after -- will be passed to the new container as Args instead of Command.
-->
如果指定，`--` 之后的所有内容将作为 Args 而不是作为 Command 传递给新容器。
</p></td>
</tr>

<tr>
<td colspan="2">--attach</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, wait for the container to start running, and then attach as if 'kubectl attach ...' were called.  Default false, unless '-i/--stdin' is set, in which case the default is true.
-->
如果为 true，则等待容器开始运行，然后就像以前调用 “kubectl attach ...” 一样执行挂接操作。
默认为 false，如果设置了 “-i/--stdin”，则默认为 true。
</p></td>
</tr>

<tr>
<td colspan="2">-c, --container string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Container name to use for debug container.
-->
调试容器要使用的容器名称。
</p></td>
</tr>

<tr>
<td colspan="2">--copy-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Create a copy of the target Pod with this name.
-->
创建目标 Pod 的副本，并将副本命名为指定名称。
</p></td>
</tr>

<tr>
<td colspan="2">--custom string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a JSON or YAML file containing a partial container spec to customize built-in debug profiles.
-->
包含部分容器规约的 JSON 或 YAML 文件的路径，用于自定义内置调试配置文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--env stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Environment variables to set in the container.
-->
要在容器中设置的环境变量。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
identifying the resource to debug
-->
标识要调试的资源。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for debug
-->
debug 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--image string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Container image to use for debug container.
-->
调试容器要使用的容器镜像。
</p></td>
</tr>

<tr>
<td colspan="2">--image-pull-policy string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The image pull policy for the container. If left empty, this value will not be specified by the client and defaulted by the server.
-->
容器的镜像拉取策略。如果留空，此值将不会由客户端指定，而是默认由服务器指定。
</p></td>
</tr>

<tr>
<td colspan="2">--keep-annotations</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod annotations.(This flag only works when used with '--copy-to')
-->
如果为真，则保留原始 Pod 的注解。
（此标志仅与 '--copy-to' 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-init-containers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Run the init containers for the pod. Defaults to true.(This flag only works when used with '--copy-to')
-->
运行 Pod 的初始化容器，默认为 true。
（此标志仅与 '--copy-to' 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-labels</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod labels.(This flag only works when used with '--copy-to')
-->
如果为真，则保留原始 Pod 的标签。
（此标志仅与 '--copy-to' 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-liveness</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod liveness probes.(This flag only works when used with '--copy-to')
-->
如果为真，则保留原始 Pod 的存活性检测。
（此标志仅与 '--copy-to' 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-readiness</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod readiness probes.(This flag only works when used with '--copy-to')
-->
如果为真，则保留原始 Pod 的就绪性探测。
（此标志仅与 '--copy-to; 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-startup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original startup probes.(This flag only works when used with '--copy-to')
-->
如果为真，则保留原始 Pod 的启动性检测。
（此标志仅与 '--copy-to' 一起使用时才有效）
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："legacy"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Options are &quot;legacy&quot;, &quot;general&quot;, &quot;baseline&quot;, &quot;netadmin&quot;, &quot;restricted&quot; or &quot;sysadmin&quot;.
-->
可选项包括 "legacy"、"general"、"baseline"、"netadmin"、"restricted" 或 "sysadmin"。
</p></td>
</tr>

<tr>
<td colspan="2">-q, --quiet</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, suppress informational messages.
-->
如果为 true，则抑制资讯类消息。
</p></td>
</tr>

<tr>
<td colspan="2">--replace</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used with '--copy-to', delete the original Pod.
-->
当与 “--copy-to” 一起使用时，删除原来的 Pod。
</p></td>
</tr>

<tr>
<td colspan="2">--same-node</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used with '--copy-to', schedule the copy of target Pod on the same node.
-->
当与 “--copy-to” 一起使用时，将目标 Pod 的副本调度到同一个节点上。
</p></td>
</tr>

<tr>
<td colspan="2">--set-image stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used with '--copy-to', a list of name=image pairs for changing container images, similar to how 'kubectl set image' works.
-->
当与 “--copy-to” 一起使用时，提供一个 name=image 对的列表以更改容器镜像，类似于 `kubectl set image` 的工作方式。
</p></td>
</tr>

<tr>
<td colspan="2">--share-processes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used with '--copy-to', enable process namespace sharing in the copy.
-->
当与 “--copy-to” 一起使用时，在副本中启用进程命名空间共享。
</p></td>
</tr>

<tr>
<td colspan="2">-i, --stdin</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Keep stdin open on the container(s) in the pod, even if nothing is attached.
-->
即使什么都没挂接，也要保持 Pod 中容器上的标准输入处于打开状态。
</p></td>
</tr>

<tr>
<td colspan="2">--target string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When using an ephemeral container, target processes in this container name.
-->
当使用临时容器时，将目标锁定为名称所指定的容器中的进程。
</p></td>
</tr>

<tr>
<td colspan="2">-t, --tty</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Allocate a TTY for the debugging container.
-->
为调试容器分配 TTY。
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
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 集群管理器
