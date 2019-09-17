---
title: kubectl
notitle: true
---

## kubectl
<!--
kubectl controls the Kubernetes cluster manager
-->
kubectl 可以操控 Kubernetes 集群。

<!--
### Synopsis

kubectl controls the Kubernetes cluster manager. 

Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/
-->
### 简介

kubectl 可以操控 Kubernetes 集群。

获取更多信息，请访问：https://kubernetes.io/docs/reference/kubectl/overview/

```
kubectl [flags]
```
<!--
### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --as-group stringArray             Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                 Default HTTP cache directory (default "/home/username/.kube/http-cache")
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
  -h, --help                             help for kubectl
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```
-->
### 选项
```
      --alsologtostderr                  同时输出日志到标准错误控制台和文件
      --as string                        以指定用户执行操作
	  --as-group stringArray             模拟操作的组，可以使用这个标识来指定多个组。
      --cache-dir string                 默认 HTTP 缓存目录（默认值 "/home/username/.kube/http-cache" ）
      --certificate-authority string     用于进行认证授权的 .cert 文件路径
      --client-certificate string        TLS 使用的客户端证书路径
      --client-key string                TLS 使用的客户端密钥文件路径
      --cluster string                   指定要使用的 kubeconfig 文件中集群名
      --context string                   指定要使用的 kubeconfig 文件中上下文
  -h, --help                             kubectl 帮助
      --insecure-skip-tls-verify         值为 true，则不会检查服务器的证书的有效性。 这将使您的HTTPS连接不安全
      --kubeconfig string                CLI 请求使用的 kubeconfig 配置文件路径。
      --log-backtrace-at traceLocation   当日志长度超出规定的行数时，忽略堆栈信息（默认值：0）
      --log-dir string                   如果不为空，则将日志文件写入此目录
      --logtostderr                      日志输出到标准错误控制台而不输出到文件
      --match-server-version             要求客户端版本和服务端版本相匹配
  -n, --namespace string                 如果存在，CLI 请求将使用此命名空间
      --request-timeout string           放弃一个简单服务请求前的等待时间，非零值需要包含相应时间单位(例如：1s, 2m, 3h)。零值则认为不做超时请求。 (默认值 "0")
  -s, --server string                    Kubernetes API server 的地址和端口
      --stderrthreshold severity         等于或高于此阈值的日志将输出标准错误控制台（默认值2）
      --token string                     用于 API server 进行身份认证的承载令牌
      --user string                      指定使用的 kubeconfig 配置文件中的用户名
  -v, --v Level                          指定输出日志的日志级别
      --vmodule moduleSpec               指定输出日志的模块，格式如下：pattern=N，使用逗号分隔
```
<!--
### SEE ALSO

* [kubectl alpha](kubectl_alpha.md)	 - Commands for features in alpha
* [kubectl annotate](kubectl_annotate.md)	 - Update the annotations on a resource
* [kubectl api-resources](kubectl_api-resources.md)	 - Print the supported API resources on the server
* [kubectl api-versions](kubectl_api-versions.md)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](kubectl_apply.md)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](kubectl_attach.md)	 - Attach to a running container
* [kubectl auth](kubectl_auth.md)	 - Inspect authorization
* [kubectl autoscale](kubectl_autoscale.md)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - Modify certificate resources.
* [kubectl cluster-info](kubectl_cluster-info.md)	 - Display cluster info
* [kubectl completion](kubectl_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](kubectl_config.md)	 - Modify kubeconfig files
* [kubectl convert](kubectl_convert.md)	 - Convert config files between different API versions
* [kubectl cordon](kubectl_cordon.md)	 - Mark node as unschedulable
* [kubectl cp](kubectl_cp.md)	 - Copy files and directories to and from containers.
* [kubectl create](kubectl_create.md)	 - Create a resource from a file or from stdin.
* [kubectl delete](kubectl_delete.md)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](kubectl_describe.md)	 - Show details of a specific resource or group of resources
* [kubectl drain](kubectl_drain.md)	 - Drain node in preparation for maintenance
* [kubectl edit](kubectl_edit.md)	 - Edit a resource on the server
* [kubectl exec](kubectl_exec.md)	 - Execute a command in a container
* [kubectl explain](kubectl_explain.md)	 - Documentation of resources
* [kubectl expose](kubectl_expose.md)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](kubectl_get.md)	 - Display one or many resources
* [kubectl label](kubectl_label.md)	 - Update the labels on a resource
* [kubectl logs](kubectl_logs.md)	 - Print the logs for a container in a pod
* [kubectl options](kubectl_options.md)	 - Print the list of flags inherited by all commands
* [kubectl patch](kubectl_patch.md)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](kubectl_plugin.md)	 - Runs a command-line plugin
* [kubectl port-forward](kubectl_port-forward.md)	 - Forward one or more local ports to a pod
* [kubectl proxy](kubectl_proxy.md)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](kubectl_replace.md)	 - Replace a resource by filename or stdin
* [kubectl rollout](kubectl_rollout.md)	 - Manage the rollout of a resource
* [kubectl run](kubectl_run.md)	 - Run a particular image on the cluster
* [kubectl scale](kubectl_scale.md)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](kubectl_set.md)	 - Set specific features on objects
* [kubectl taint](kubectl_taint.md)	 - Update the taints on one or more nodes
* [kubectl top](kubectl_top.md)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](kubectl_uncordon.md)	 - Mark node as schedulable
* [kubectl version](kubectl_version.md)	 - Print the client and server version information
* [kubectl wait](kubectl_wait.md)	 - Experimental: Wait for one condition on one or many resources
-->
### 接下来看

* [kubectl alpha](kubectl_alpha.md)	 - alpha环境上命令属性
* [kubectl annotate](kubectl_annotate.md)	 - 更新资源上注释
* [kubectl api-resources](kubectl_api-resources.md)	 - 在服务器上打印支持的 API 资源
* [kubectl api-versions](kubectl_api-versions.md)	 - 以 "group/version" 的形式在服务器上打印支持的 API 版本
* [kubectl apply](kubectl_apply.md)	 - 通过文件名或标准输入将配置添加给资源
* [kubectl attach](kubectl_attach.md)	 - 附加到正在运行的容器
* [kubectl auth](kubectl_auth.md)	 - 检查授权
* [kubectl autoscale](kubectl_autoscale.md)	 - 自动扩展 Deployment, ReplicaSet 或 ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - 修改证书资源。
* [kubectl cluster-info](kubectl_cluster-info.md)	 - 展示集群信息
* [kubectl completion](kubectl_completion.md)	 - 为给定的 shell 输出完成代码（ bash 或 zsh）
* [kubectl config](kubectl_config.md)	 - 修改 kubeconfig 配置文件
* [kubectl convert](kubectl_convert.md)	 - 在不同的 API 版本之间转换配置文件
* [kubectl cordon](kubectl_cordon.md)	 - 将 node 节点标记为不可调度
* [kubectl cp](kubectl_cp.md)	 - 从容器复制文件和目录，也可将文件和目录复制到容器。
* [kubectl create](kubectl_create.md)	 - 通过文件名或标准输入创建资源。
* [kubectl delete](kubectl_delete.md)	 - 通过文件名，标准输入，资源和名称或资源和标签选择器删除资源
* [kubectl describe](kubectl_describe.md)	 - 显示特定资源或资源组的详细信息
* [kubectl drain](kubectl_drain.md)	 - 为便于维护，需要提前驱逐node节点
* [kubectl edit](kubectl_edit.md)	 - 在服务器编辑资源
* [kubectl exec](kubectl_exec.md)	 - 容器内退出命令
* [kubectl explain](kubectl_explain.md)	 - 资源文档
* [kubectl expose](kubectl_expose.md)	 - 获取 replication controller, service, deployment 或 pod 资源，并作为新的 Kubernetes 服务暴露
* [kubectl get](kubectl_get.md)	 - 展示一个或多个资源
* [kubectl label](kubectl_label.md)	 - 升级资源标签
* [kubectl logs](kubectl_logs.md)	 - 为 pod 中的容器打印日志
* [kubectl options](kubectl_options.md)	 - 打印所有命令继承的标识列表
* [kubectl patch](kubectl_patch.md)	 - 使用战略性合并补丁更新资源字段
* [kubectl plugin](kubectl_plugin.md)	 - 运行命令行插件
* [kubectl port-forward](kubectl_port-forward.md)	 - 给 pod 开放一个或多个本地端口
* [kubectl proxy](kubectl_proxy.md)	 - 为 Kubernetes API server 运行代理
* [kubectl replace](kubectl_replace.md)	 - 通过文件或标准输入替换资源
* [kubectl rollout](kubectl_rollout.md)	 - 管理资源展示
* [kubectl run](kubectl_run.md)	 - 在集群上运行指定镜像
* [kubectl scale](kubectl_scale.md)	 - 给 Deployment, ReplicaSet, Replication Controller 或 Job 设置新副本规模
* [kubectl set](kubectl_set.md)	 - 给对象设置特定功能
* [kubectl taint](kubectl_taint.md)	 - 更新一个或多个 node 节点的污点信息
* [kubectl top](kubectl_top.md)	 - 展示资源 (CPU/Memory/Storage) 使用信息。
* [kubectl uncordon](kubectl_uncordon.md)	 - 标记 node 节点为可调度
* [kubectl version](kubectl_version.md)	 - 打印客户端和服务端版本信息
* [kubectl wait](kubectl_wait.md)	 - 试验: 在一个或多个资源上等待条件完成

<!--
###### Auto generated by spf13/cobra on 16-Jun-2018
-->
######2018年6月16日，通过spf13/cobra自动生成


