<!--
---
title: kubectl
---
kubectl controls the Kubernetes cluster manager.

Find more information at [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

```
kubectl
```
-->
---
标题: kubectl
---
kubectl 用来管理 Kubernetes 集群。

可以在 [https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 找到更多相关信息。

```
kubectl
```
<!--
### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --password string                  Password for basic authentication to the API server
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
      --username string                  Username for basic authentication to the API server
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```
-->
### 选项

```
      --alsologtostderr                  同时输出日志到标准错误控制台和文件中
      --as string                        设置执行操作的用户名
      --certificate-authority string     用于进行认证授权的cert文件路径
      --client-certificate string        TLS 使用的客户端证书路径
      --client-key string                TLS 使用的客户端密钥路径
      --cluster string                   指定使用的 kubeconfig 配置文件中的集群名
      --context string                   指定使用的 kubeconfig 配置文件中的环境名
      --insecure-skip-tls-verify         如果为 true ，将不会检查服务器凭证的有效性，这会导你的 HTTPS 链接不安全
      --kubeconfig string                指定命令行请求使用的 kubeconfig 配置文件路径
      --log-backtrace-at traceLocation   每当记录日志到文件的 N 行，输出堆栈轨迹，默认 N 为0
      --log-dir string                   如果不为空，将日志文件写入此目录
      --logtostderr                      输出日志到标准错误控制台，不输出到文件
      --match-server-version             要求服务器版本与客户端版本匹配
  -n, --namespace string                 如果存在，请求命令行将使用此命名空间
      --password string                  指定 API server 进行简单认证使用的密码
      --request-timeout string           指定单个服务请求的最大等待时间。如果值不为0时，应该包括一个符合格式的时间单元（例如 1 s ，2 m ，3 h）,值为0时表示无超时请求 （默认为0）
  -s, --server string                    指定 Kubernetes API server 的地址和端口
      --stderrthreshold severity         指定标准错误输出阈值，高于此阈值将被输出到错误控制台 (默认为2)
      --token string                     设置访问 API server 的安全令牌
      --user string                      指定使用的 kubeconfig 配置文件中的用户名
      --username string                  指定 API server 进行简单认证使用的用户名
  -v, --v Level                          指定输出日志级别
      --vmodule moduleSpec               指定输出日志的模块，格式如下：pattern=N，使用逗号分隔
```
<!--
### SEE ALSO

* [kubectl annotate](/docs/user-guide/kubectl/v1.7/#annotate)     - Update the annotations on a resource
* [kubectl api-versions](/docs/user-guide/kubectl/v1.7/#api-versions)     - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](/docs/user-guide/kubectl/v1.7/#apply)     - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/user-guide/kubectl/v1.7/#attach)     - Attach to a running container
* [kubectl autoscale](/docs/user-guide/kubectl/v1.7/#autoscale)     - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/user-guide/kubectl/v1.7/#certificate)     - Modify certificate resources.
* [kubectl cluster-info](/docs/user-guide/kubectl/v1.7/#cluster-info)     - Display cluster info
* [kubectl completion](/docs/user-guide/kubectl/v1.7/#completion)     - Output shell completion code for the given shell (bash or zsh)
* [kubectl config](/docs/user-guide/kubectl/v1.7/#config)     - Modify kubeconfig files
* [kubectl convert](/docs/user-guide/kubectl/v1.7/#convert)     - Convert config files between different API versions
* [kubectl cordon](/docs/user-guide/kubectl/v1.7/#cordon)     - Mark node as unschedulable
* [kubectl cp](/docs/user-guide/kubectl/v1.7/#cp)     - Copy files and directories to and from containers.
* [kubectl create](/docs/user-guide/kubectl/v1.7/#create)     - Create a resource by filename or stdin
* [kubectl delete](/docs/user-guide/kubectl/v1.7/#delete)     - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](/docs/user-guide/kubectl/v1.7/#describe)     - Show details of a specific resource or group of resources
* [kubectl drain](/docs/user-guide/kubectl/v1.7/#drain)     - Drain node in preparation for maintenance
* [kubectl edit](/docs/user-guide/kubectl/v1.7/#edit)     - Edit a resource on the server
* [kubectl exec](/docs/user-guide/kubectl/v1.7/#exec)     - Execute a command in a container
* [kubectl explain](/docs/user-guide/kubectl/v1.7/#explain)     - Documentation of resources
* [kubectl expose](/docs/user-guide/kubectl/v1.7/#expose)     - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](/docs/user-guide/kubectl/v1.7/#get)     - Display one or many resources
* [kubectl label](/docs/user-guide/kubectl/v1.7/#label)     - Update the labels on a resource
* [kubectl logs](/docs/user-guide/kubectl/v1.7/#logs)     - Print the logs for a container in a pod
* [kubectl options](/docs/user-guide/kubectl/v1.7/#options)     -
* [kubectl patch](/docs/user-guide/kubectl/v1.7/#patch)     - Update field(s) of a resource using strategic merge patch
* [kubectl port-forward](/docs/user-guide/kubectl/v1.7/#port-forward)     - Forward one or more local ports to a pod
* [kubectl proxy](/docs/user-guide/kubectl/v1.7/#proxy)     - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/user-guide/kubectl/v1.7/#replace)     - Replace a resource by filename or stdin
* [kubectl rolling-update](/docs/user-guide/kubectl/v1.7/#rolling-update)     - Perform a rolling update of the given ReplicationController
* [kubectl rollout](/docs/user-guide/kubectl/v1.7/#rollout)     - Manage a deployment rollout
* [kubectl run](/docs/user-guide/kubectl/v1.7/#run)     - Run a particular image on the cluster
* [kubectl scale](/docs/user-guide/kubectl/v1.7/#scale)     - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](/docs/user-guide/kubectl/v1.7/#set)     - Set specific features on objects
* [kubectl taint](/docs/user-guide/kubectl/v1.7/#taint)     - Update the taints on one or more nodes
* [kubectl top](/docs/user-guide/kubectl/v1.7/#top)     - Display Resource (CPU/Memory/Storage) usage
* [kubectl uncordon](/docs/user-guide/kubectl/v1.7/#uncordon)     - Mark node as schedulable
* [kubectl version](/docs/user-guide/kubectl/v1.7/#version)     - Print the client and server version information
-->
### 参阅

* [kubectl annotate](/docs/user-guide/kubectl/v1.7/#annotate)     - 更新资源的注释
* [kubectl api-versions](/docs/user-guide/kubectl/v1.7/#api-versions)     - 以“组/版本”的格式输出服务端支持的API版本
* [kubectl apply](/docs/user-guide/kubectl/v1.7/#apply)     - 通过文件名或标准输入，对资源进行配置
* [kubectl attach](/docs/user-guide/kubectl/v1.7/#attach)     - 连接到一个正在运行的容器
* [kubectl autoscale](/docs/user-guide/kubectl/v1.7/#autoscale)     - 对一个资源对象（ Deployment, ReplicaSet, 或者 ReplicationController ）进行扩缩容
* [kubectl certificate](/docs/user-guide/kubectl/v1.7/#certificate)     - 修改认证资源
* [kubectl cluster-info](/docs/user-guide/kubectl/v1.7/#cluster-info)     - 显示集群信息
* [kubectl completion](/docs/user-guide/kubectl/v1.7/#completion)     - 根据已经给出的 shell 代码输出补全后的 shell 代码 (bash 或者 zsh)
* [kubectl config](/docs/user-guide/kubectl/v1.7/#config)     - 修改 kubeconfig 配置文件
* [kubectl convert](/docs/user-guide/kubectl/v1.7/#convert)     - 在不同的 API 版本之间转换配置
* [kubectl cordon](/docs/user-guide/kubectl/v1.7/#cordon)     - 标记节点为不可调度资源
* [kubectl cp](/docs/user-guide/kubectl/v1.7/#cp)     - 复制文件和目录到容器中或者从容器中复制出文件和目录
* [kubectl create](/docs/user-guide/kubectl/v1.7/#create)     - 通过文件名或标准输入创建一个资源
* [kubectl delete](/docs/user-guide/kubectl/v1.7/#delete)     - 通过文件名，标准输入，资源和名字删除资源，或者通过资源和标签选择器删除资源
* [kubectl describe](/docs/user-guide/kubectl/v1.7/#describe)     - 显示一个特定的资源或资源组的详细说明
* [kubectl drain](/docs/user-guide/kubectl/v1.7/#drain)     - 耗尽节点资源，为维护做准备
* [kectl edit](/docs/user-guide/kubectl/v1.7/#edit)     - 在 server 上编辑一个资源
* [kubectl exec](/docs/user-guide/kubectl/v1.7/#exec)     - 在容器中执行命令
* [kubectl explain](/docs/user-guide/kubectl/v1.7/#explain)     - 资源文献
* [kubectl expose](/docs/user-guide/kubectl/v1.7/#expose)     - 输入 replication controller，service，deployment 或者 pod，并将其暴露为新的 kubernetes 服务。
* [kubectl get](/docs/user-guide/kubectl/v1.7/#get)     - 显示一个或者多个资源信息
* [kubectl label](/docs/user-guide/kubectl/v1.7/#label)     - 更新资源的标签
* [kubectl logs](/docs/user-guide/kubectl/v1.7/#logs)     - 输出 pod 中一个容器的日志
* [kubectl options](/docs/user-guide/kubectl/v1.7/#options)     -
* [kubectl patch](/docs/user-guide/kubectl/v1.7/#patch)     - 使用重要兼容的补丁来更新一个资源中的字段信息
* [kubectl port-forward](/docs/user-guide/kubectl/v1.7/#port-forward)     - 将一个或者多个本地端口转发到 Pod
* [kubectl proxy](/docs/user-guide/kubectl/v1.7/#proxy)     - 运行一个 kubernetes API server 代理
* [kubectl replace](/docs/user-guide/kubectl/v1.7/#replace)     - 通过文件名或控制台标准输入替换资源
* [kubectl rolling-update](/docs/user-guide/kubectl/v1.7/#rolling-update)     - 给指定的 ReplicationController 执行一个滚动升级
* [kubectl rollout](/docs/user-guide/kubectl/v1.7/#rollout)     - 完成一个 deployment 的部署
* [kubectl run](/docs/user-guide/kubectl/v1.7/#run)     - 在集群中使用指定镜像启动容器
* [kubectl scale](/docs/user-guide/kubectl/v1.7/#scale)     - 为一个 Deployment, ReplicaSet, ReplicationController, 或者 Job 设置一个新的规格
* [kubectl set](/docs/user-guide/kubectl/v1.7/#set)     - 在资源对象设置特定的功能
* [kubectl taint](/docs/user-guide/kubectl/v1.7/#taint)     - 在一个或者多个节点上更新污点配置
* [kubectl top](/docs/user-guide/kubectl/v1.7/#top)     - 显示资源（ CPU /内存/存储）使用率
* [kubectl uncordon](/docs/user-guide/kubectl/v1.7/#uncordon)     - 标记节点为可调度
* [kubectl version](/docs/user-guide/kubectl/v1.7/#version)     - 输出客户端和服务器的版本信息

###### Auto generated by spf13/cobra on 13-Dec-2016

<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/user-guide/kubectl/kubectl.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
