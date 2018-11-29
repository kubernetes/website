---
title: kubectl
notitle: true
---

## kubectl
<!--
kubectl controls the Kubernetes cluster manager
-->
kubectl 用来控制 Kubernetes 集群管理器

<!--
### Synopsis

kubectl controls the Kubernetes cluster manager.

Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/
-->
### 摘要

kubectl 用来控制 Kubernetes 集群管理器。

更多信息参见 https://kubernetes.io/docs/reference/kubectl/overview/

```
kubectl [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--allow-verification-with-non-compliant-keys</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Allow a SignatureVerifier to use keys which are technically non-compliant with RFC6962.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">允许 `SignatureVerifier` 使用和 RFC6962 技术上不兼容的键值。</td>
    </tr>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">log 到标准输出以及文件上</td>
    </tr>

    <tr>
      <td colspan="2">--as string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Username to impersonate for the operation</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">以某人名义进行操作</td>
    </tr>

    <tr>
      <td colspan="2">--as-group stringArray</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Group to impersonate for the operation, this flag can be repeated to specify multiple groups.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">以某个群组的名义进行操作，可以重复使用这个参数来声明多个群组。</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">包含容器仓库配置信息的文件路径。</td>
    </tr>

    <tr>
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/Users/zarnold/.kube/http-cache"</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Default HTTP cache directory</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">默认的 HTTP 缓存路径</td>
    </tr>

    <tr>
      <td colspan="2">--certificate-authority string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Path to a cert file for the certificate authority</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">CA 验证的数字证书的文件路径</td>
    </tr>

    <tr>
      <td colspan="2">--client-certificate string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Path to a client certificate file for TLS</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">TLS 的客户端证书的文件路径</td>
    </tr>

    <tr>
      <td colspan="2">--client-key string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Path to a client key file for TLS</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">TLS 客户端秘钥文件的路径</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for LB traffic proxy & health checks</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">在 GCE 防火墙中声明 CIDRs 用于负载均衡和健康检查。</td>
    </tr>

    <tr>
      <td colspan="2">--cluster string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig cluster to use</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">所要使用的 kubeconfig 集群名</td>
    </tr>

    <tr>
      <td colspan="2">--context string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig context to use</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">所要使用的 kubeconfig 上下文名</td>
    </tr>

    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">指明 `notReady:NoExecute` 的容忍时间（`tolerationSeconds`），将默认添加到各个没有这个容忍设置的 pod 上。</td>
    </tr>

    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">指明 `unreachable:NoExecute` 的容忍时间（`tolerationSeconds`），将默认添加到各个没有这个容忍设置的 pod 上。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">help for kubectl</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">kubectl 帮助选项</td>
    </tr>

    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">如果选中，将不会验证服务器的电子证书。这也意味着，HTTPS 链接将不安全。</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubeconfig file to use for CLI requests.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig 的文件路径，供 CLI 请求之用。</td>
    </tr>

    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">when logging hits line file:N, emit a stack trace</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">当日志达到文件 N 行，打印栈跟踪。</td>
    </tr>

    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">如果路径存在，日志将保存在该路径下。</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">日志导出的最大时间间隔。</td>
    </tr>

    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">log 到标准错误输出，而非文件上。</td>
    </tr>

    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Require server version to match client version</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">要求服务器的版本和客户端版本一致</td>
    </tr>

    <tr>
      <td colspan="2">-n, --namespace string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">If present, the namespace scope for this CLI request</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">如果指明命名空间，将供 CLI 请求之用</td>
    </tr>

    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">放弃单个服务请求前的等待时间。非零数值必须要包含时间单位（例如，1s，2m，3h）。零值意味着不会发生请求超时。</td>
    </tr>

    <tr>
      <td colspan="2">-s, --server string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">The address and port of the Kubernetes API server</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">Kubernetes API 服务器的地址和端口</td>
    </tr>

    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">日志等级，等于或高于这个等级的日志都将会打印到标准错误输出上</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Bearer token for authentication to the API server</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">Bearer 令牌，供 API 服务器验证之用</td>
    </tr>

    <tr>
      <td colspan="2">--user string</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig user to use</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">所要使用的 kubeconfig 用户名</td>
    </tr>

    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">log level for V logs</td>
      related issue: https://github.com/kubernetes/kubernetes/issues/35054
      -->
      <td style="line-height: 130%; word-wrap: break-word;">设定日志输出的等级</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">打印版本信息，然后退出</td>
    </tr>

    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td>
      <!-- <td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td> -->
      <td style="line-height: 130%; word-wrap: break-word;">指定输出日志的模块，格式如下：pattern=N，使用逗号分隔</td>
    </tr>

  </tbody>
</table>


<!-- ### SEE ALSO -->
### 更多资源

<!-- * [kubectl alpha](kubectl_alpha.md)	 - Commands for features in alpha -->
* [kubectl alpha](kubectl_alpha.md)	 - kubectl alpha 功能
<!-- * [kubectl annotate](kubectl_annotate.md)	 - Update the annotations on a resource -->
* [kubectl annotate](kubectl_annotate.md)	 - 更新资源上注释
<!-- * [kubectl api-resources](kubectl_api-resources.md)	 - Print the supported API resources on the server -->
* [kubectl api-resources](kubectl_api-resources.md)	 - 打印服务器上所支持的 API 资源
<!-- * [kubectl api-versions](kubectl_api-versions.md)	 - Print the supported API versions on the server, in the form of "group/version" -->
* [kubectl api-versions](kubectl_api-versions.md)	 - 以“组/版本”的格式输出服务端支持的API版本
<!-- * [kubectl apply](kubectl_apply.md)	 - Apply a configuration to a resource by filename or stdin -->
* [kubectl apply](kubectl_apply.md)	 - 通过文件名或标准输入，对资源进行配置
<!-- * [kubectl attach](kubectl_attach.md)	 - Attach to a running container -->
* [kubectl attach](kubectl_attach.md)	 - 连接到一个正在运行的容器
<!-- * [kubectl auth](kubectl_auth.md)	 - Inspect authorization -->
* [kubectl auth](kubectl_auth.md)	 - Inspect authorization
<!-- * [kubectl autoscale](kubectl_autoscale.md)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController -->
* [kubectl autoscale](kubectl_autoscale.md)	 -  对一个资源对象（ Deployment, ReplicaSet, 或者 ReplicationController ）进行扩缩
<!-- * [kubectl certificate](kubectl_certificate.md)	 - Modify certificate resources. -->
* [kubectl certificate](kubectl_certificate.md)	 - 修改证书资源
<!-- * [kubectl cluster-info](kubectl_cluster-info.md)	 - Display cluster info -->
* [kubectl cluster-info](kubectl_cluster-info.md)	 - 显示集群信息
<!-- * [kubectl completion](kubectl_completion.md)	 - Output shell completion code for the specified shell (bash or zsh) -->
* [kubectl completion](kubectl_completion.md)	 - 根据已经给出的 shell 代码输出补全后的 shell 代码 (bash 或者 zsh)
<!-- * [kubectl config](kubectl_config.md)	 - Modify kubeconfig files -->
* [kubectl config](kubectl_config.md)	 - 修改 kubeconfig 配置文件
<!-- * [kubectl convert](kubectl_convert.md)	 - Convert config files between different API versions -->
* [kubectl convert](kubectl_convert.md)	 - 在不同的 API 版本之间转换配置文件
<!-- * [kubectl cordon](kubectl_cordon.md)	 - Mark node as unschedulable -->
* [kubectl cordon](kubectl_cordon.md)	 - 标记节点为不可调度的
<!-- * [kubectl cp](kubectl_cp.md)	 - Copy files and directories to and from containers. -->
* [kubectl cp](kubectl_cp.md)	 - 将文件和路径拷入/拷出容器。
<!-- * [kubectl create](kubectl_create.md)	 - Create a resource from a file or from stdin. -->
* [kubectl create](kubectl_create.md)	 - 通过文件或标准输入来创建资源
<!-- * [kubectl delete](kubectl_delete.md)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector -->
* [kubectl delete](kubectl_delete.md)	 - 通过文件名、标准输入、资源和名字删除资源，或者通过资源和标签选择器来删除资源
<!-- * [kubectl describe](kubectl_describe.md)	 - Show details of a specific resource or group of resources -->
* [kubectl describe](kubectl_describe.md)	 - 显示某个资源或某组资源的详细信息
<!-- * [kubectl drain](kubectl_drain.md)	 - Drain node in preparation for maintenance -->
* [kubectl drain](kubectl_drain.md)	 - 耗尽节点资源，为维护做准备
<!-- * [kubectl edit](kubectl_edit.md)	 - Edit a resource on the server -->
* [kubectl edit](kubectl_edit.md)	 - 在服务器上修改一个资源
<!-- * [kubectl exec](kubectl_exec.md)	 - Execute a command in a container -->
* [kubectl exec](kubectl_exec.md)	 - 在容器中执行命令
<!-- * [kubectl explain](kubectl_explain.md)	 - Documentation of resources -->
* [kubectl explain](kubectl_explain.md)	 - 资源文献
<!-- * [kubectl expose](kubectl_expose.md)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service -->
* [kubectl expose](kubectl_expose.md)	 - 输入 replication controller，service，deployment 或者 pod，并将其暴露为新的 kubernetes 服务。
<!-- * [kubectl get](kubectl_get.md)	 - Display one or many resources -->
* [kubectl get](kubectl_get.md)	 - 显示一个或者多个资源信息
<!-- * [kubectl label](kubectl_label.md)	 - Update the labels on a resource -->
* [kubectl label](kubectl_label.md)	 - 更新资源的标签
<!-- * [kubectl logs](kubectl_logs.md)	 - Print the logs for a container in a pod -->
* [kubectl logs](kubectl_logs.md)	 - 输出 pod 中一个容器的所有日志
<!-- * [kubectl options](kubectl_options.md)	 - Print the list of flags inherited by all commands -->
* [kubectl options](kubectl_options.md)	 - 打印所有命令行共有的参数
<!-- * [kubectl patch](kubectl_patch.md)	 - Update field(s) of a resource using strategic merge patch -->
* [kubectl patch](kubectl_patch.md)	 - 使用重要兼容的补丁来更新一个资源中的字段信息
<!-- * [kubectl plugin](kubectl_plugin.md)	 - Runs a command-line plugin -->
* [kubectl plugin](kubectl_plugin.md)	 - 运行命令行插件
<!-- * [kubectl port-forward](kubectl_port-forward.md)	 - Forward one or more local ports to a pod -->
* [kubectl port-forward](kubectl_port-forward.md)	 - 将一个或者多个本地端口转发到 pod
<!-- * [kubectl proxy](kubectl_proxy.md)	 - Run a proxy to the Kubernetes API server -->
* [kubectl proxy](kubectl_proxy.md)	 - 运行一个 kubernetes API server 代理
<!-- * [kubectl replace](kubectl_replace.md)	 - Replace a resource by filename or stdin -->
* [kubectl replace](kubectl_replace.md)	 - 通过文件名或控制台标准输入替换资源
<!-- * [kubectl rollout](kubectl_rollout.md)	 - Manage the rollout of a resource -->
* [kubectl rollout](kubectl_rollout.md)	 - 完成一个 deployment 的部署
<!-- * [kubectl run](kubectl_run.md)	 - Run a particular image on the cluster -->
* [kubectl run](kubectl_run.md)	 - 在集群中使用指定镜像启动容器
<!-- * [kubectl scale](kubectl_scale.md)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job -->
* [kubectl scale](kubectl_scale.md)	 - 为一个 Deployment, ReplicaSet, ReplicationController, 或者 Job 设置一个新的规格
<!-- * [kubectl set](kubectl_set.md)	 - Set specific features on objects -->
* [kubectl set](kubectl_set.md)	 - 在资源对象设置特定的功能
<!-- * [kubectl taint](kubectl_taint.md)	 - Update the taints on one or more nodes -->
* [kubectl taint](kubectl_taint.md)	 - 在一个或者多个节点上更新污点配置
<!-- * [kubectl top](kubectl_top.md)	 - Display Resource (CPU/Memory/Storage) usage. -->
* [kubectl top](kubectl_top.md)	 - 显示资源（CPU /内存/存储）使用率
<!-- * [kubectl uncordon](kubectl_uncordon.md)	 - Mark node as schedulable -->
* [kubectl uncordon](kubectl_uncordon.md)	 - 标记节点为可调度的
<!-- * [kubectl version](kubectl_version.md)	 - Print the client and server version information -->
* [kubectl version](kubectl_version.md)	 - 打印客户端和服务器的版本信息
<!-- * [kubectl wait](kubectl_wait.md)	 - Experimental: Wait for one condition on one or many resources -->
* [kubectl wait](kubectl_wait.md)	 - 实验性：等待一个或多个资源达到某种状态
