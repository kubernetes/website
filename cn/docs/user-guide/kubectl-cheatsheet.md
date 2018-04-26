---
approvers:
- bgrant0607
- erictune
- krousey
- clove
title: kubectl Cheat Sheet
---

<!--

See also: [Kubectl Overview](/docs/user-guide/kubectl-overview/) and [JsonPath Guide](/docs/user-guide/jsonpath).

-->

更多内容请参考： [Kubectl 概览](/docs/user-guide/kubectl-overview/) 和 [JsonPath 手册](/docs/user-guide/jsonpath)。

<!--

## Kubectl Autocomplete

```console
$ source <(kubectl completion bash) # setup autocomplete in bash, bash-completion package should be installed first.
$ source <(kubectl completion zsh)  # setup autocomplete in zsh
```

-->

## Kubectl 自动补全

```console
$ source <(kubectl completion bash) # setup autocomplete in bash, bash-completion package should be installed first.
$ source <(kubectl completion zsh)  # setup autocomplete in zsh
```

<!--

## Kubectl Context and Configuration

Set which Kubernetes cluster `kubectl` communicates with and modifies configuration
information. See [Authenticating Across Clusters with kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation for
detailed config file information.

```console
$ kubectl config view # 显示合并后的 kubeconfig 配置

# use multiple kubeconfig files at the same time and view merged config
$ KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# Get the password for the e2e user
$ kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

$ kubectl config current-context              # Display the current-context
$ kubectl config use-context my-cluster-name  # set the default context to my-cluster-name

# add a new cluster to your kubeconf that supports basic auth
$ kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# set a context utilizing a specific username and namespace.
$ kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
```

-->

## Kubectl 上下文和配置

设置 `kubectl` 命令交互的 Kubernetes 集群并修改配置信息。参阅 [使用 kubeconfig 文件进行跨集群验证](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 获取关于配置文件的详细信息。

```console
$ kubectl config view # 显示合并后的 kubeconfig 配置

# 同时使用多个 kubeconfig 文件并查看合并后的配置
$ KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# 获取 e2e 用户的密码
$ kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

$ kubectl config current-context              # 显示当前的上下文
$ kubectl config use-context my-cluster-name  # 设置默认上下文为 my-cluster-name

# 向 kubeconf 中增加支持基本认证的新集群
$ kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 使用指定的用户名和 namespace 设置上下文
$ kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
```

<!--

## Creating Objects

Kubernetes manifests can be defined in json or yaml. The file extension `.yaml`, `.yml`, and `.json` can be used.

```console
$ kubectl create -f ./my-manifest.yaml           # create resource(s)
$ kubectl create -f ./my1.yaml -f ./my2.yaml     # create from multiple files
$ kubectl create -f ./dir                        # create resource(s) in all manifest files in dir
$ kubectl create -f https://git.io/vPieo         # create resource(s) from url
$ kubectl run nginx --image=nginx                # start a single instance of nginx
$ kubectl explain pods,svc                       # get the documentation for pod and svc manifests

# Create multiple YAML objects from stdin
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# Create a secret with several keys
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo "s33msi4" | base64)
  username: $(echo "jane" | base64)
EOF

```

-->

## 创建对象

Kubernetes 的清单文件可以使用 json 或 yaml 格式定义。可以以 `.yaml`、`.yml`、或者 `.json` 为扩展名。

```console
$ kubectl create -f ./my-manifest.yaml           # 创建资源
$ kubectl create -f ./my1.yaml -f ./my2.yaml     # 使用多个文件创建资源
$ kubectl create -f ./dir                        # 使用目录下的所有清单文件来创建资源
$ kubectl create -f https://git.io/vPieo         # 使用 url 来创建资源
$ kubectl run nginx --image=nginx                # 启动一个 nginx 实例
$ kubectl explain pods,svc                       # 获取 pod 和 svc 的文档

# 从 stdin 输入中创建多个 YAML 对象
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# 创建包含几个 key 的 Secret
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo "s33msi4" | base64)
  username: $(echo "jane" | base64)
EOF

```

<!--

## Viewing, Finding Resources

```console
# Get commands with basic output
$ kubectl get services                          # List all services in the namespace
$ kubectl get pods --all-namespaces             # List all pods in all namespaces
$ kubectl get pods -o wide                      # List all pods in the namespace, with more details
$ kubectl get deployment my-dep                 # List a particular deployment
$ kubectl get pods --include-uninitialized      # List all pods in the namespace, including uninitialized ones

# Describe commands with verbose output
$ kubectl describe nodes my-node
$ kubectl describe pods my-pod

$ kubectl get services --sort-by=.metadata.name # List Services Sorted by Name

# List pods Sorted by Restart Count
$ kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Get the version label of all pods with label app=cassandra
$ kubectl get pods --selector=app=cassandra rc -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Get ExternalIPs of all nodes
$ kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# List Names of Pods that belong to Particular RC
# "jq" command useful for transformations that are too complex for jsonpath, it can be found at https://stedolan.github.io/jq/
$ sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
$ echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Check which nodes are ready
$ JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# List all Secrets currently in use by a pod
$ kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq
```

-->

## 显示和查找资源

```console
# Get commands with basic output
$ kubectl get services                          # 列出所有 namespace 中的所有 service
$ kubectl get pods --all-namespaces             # 列出所有 namespace 中的所有 pod
$ kubectl get pods -o wide                      # 列出所有 pod 并显示详细信息
$ kubectl get deployment my-dep                 # 列出指定 deployment
$ kubectl get pods --include-uninitialized      # 列出该 namespace 中的所有 pod 包括未初始化的

# 使用详细输出来描述命令
$ kubectl describe nodes my-node
$ kubectl describe pods my-pod

$ kubectl get services --sort-by=.metadata.name # List Services Sorted by Name

# 根据重启次数排序列出 pod
$ kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# 获取所有具有 app=cassandra 的 pod 中的 version 标签
$ kubectl get pods --selector=app=cassandra rc -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 获取所有节点的 ExternalIP
$ kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 列出属于某个 PC 的 Pod 的名字
# “jq”命令用于转换复杂的 jsonpath，参考 https://stedolan.github.io/jq/
$ sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
$ echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# 查看哪些节点已就绪
$ JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# 列出当前 Pod 中使用的 Secret
$ kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq
```

<!--

## Updating Resources

```console
$ kubectl rolling-update frontend-v1 -f frontend-v2.json           # Rolling update pods of frontend-v1
$ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # Change the name of the resource and update the image
$ kubectl rolling-update frontend --image=image:v2                 # Update the pods image of frontend
$ kubectl rolling-update frontend-v1 frontend-v2 --rollback        # Abort existing rollout in progress
$ cat pod.json | kubectl replace -f -                              # Replace a pod based on the JSON passed into stdin

# Force replace, delete and then re-create the resource. Will cause a service outage.
$ kubectl replace --force -f ./pod.json

# Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
$ kubectl expose rc nginx --port=80 --target-port=8000

# Update a single-container pod's image version (tag) to v4
$ kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

$ kubectl label pods my-pod new-label=awesome                      # Add a Label
$ kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Add an annotation
$ kubectl autoscale deployment foo --min=2 --max=10                # Auto scale a deployment "foo"
```

-->

## 更新资源

```console
$ kubectl rolling-update frontend-v1 -f frontend-v2.json           # 滚动更新 pod frontend-v1
$ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # 更新资源名称并更新镜像
$ kubectl rolling-update frontend --image=image:v2                 # 更新 frontend pod 中的镜像
$ kubectl rolling-update frontend-v1 frontend-v2 --rollback        # 退出已存在的进行中的滚动更新
$ cat pod.json | kubectl replace -f -                              # 基于 stdin 输入的 JSON 替换 pod

# 强制替换，删除后重新创建资源。会导致服务中断。
$ kubectl replace --force -f ./pod.json

# 为 nginx RC 创建服务，启用本地 80 端口连接到容器上的 8000 端口
$ kubectl expose rc nginx --port=80 --target-port=8000

# 更新单容器 pod 的镜像版本（tag）到 v4
$ kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

$ kubectl label pods my-pod new-label=awesome                      # 添加标签
$ kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # 添加注解
$ kubectl autoscale deployment foo --min=2 --max=10                # 自动扩展 deployment “foo”
```

<!--

## Patching Resources

Patch a resource(s) with a strategic merge patch.

```console
$ kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # Partially update a node

# Update a container's image; spec.containers[*].name is required because it's a merge key
$ kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Update a container's image using a json patch with positional arrays
$ kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Disable a deployment livenessProbe using a json patch with positional arrays
$ kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'
```

-->

## 修补资源

使用策略合并补丁并修补资源。

```console
$ kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # 部分更新节点

# 更新容器镜像； spec.containers[*].name 是必须的，因为这是合并的关键字
$ kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# 使用具有位置数组的 json 补丁更新容器镜像
$ kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# 使用具有位置数组的 json 补丁禁用 deployment 的 livenessProbe
$ kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'
```

<!--

## Editing Resources

The edit any API resource in an editor.

```console
$ kubectl edit svc/docker-registry                      # Edit the service named docker-registry
$ KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Use an alternative editor
```

-->

## 编辑资源

在编辑器中编辑任何 API 资源。

```console
$ kubectl edit svc/docker-registry                      # 编辑名为 docker-registry 的 service
$ KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # 使用其它编辑器
```

<!--

## Scaling Resources

```console
$ kubectl scale --replicas=3 rs/foo                                 # Scale a replicaset named 'foo' to 3
$ kubectl scale --replicas=3 -f foo.yaml                            # Scale a resource specified in "foo.yaml" to 3
$ kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # If the deployment named mysql's current size is 2, scale mysql to 3
$ kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Scale multiple replication controllers
```

-->

## Scale资源

```console
$ kubectl scale --replicas=3 rs/foo                                 # 扩容名为 “foo” 的 replicatset 到 3 个副本
$ kubectl scale --replicas=3 -f foo.yaml                            # 扩容“foo.yaml” 中定义的资源到 3 个副本
$ kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # 如果名为 mysql 的 Deployment 的当前副本是2，则扩容到 3
$ kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 扩容多个 replication controller
```

<!--

## Deleting Resources

```console
$ kubectl delete -f ./pod.json                                              # Delete a pod using the type and name specified in pod.json
$ kubectl delete pod,service baz foo                                        # Delete pods and services with same names "baz" and "foo"
$ kubectl delete pods,services -l name=myLabel                              # Delete pods and services with label name=myLabel
$ kubectl delete pods,services -l name=myLabel --include-uninitialized      # Delete pods and services, including uninitialized ones, with label name=myLabel
$ kubectl -n my-ns delete po,svc --all                                      # Delete all pods and services, including uninitialized ones, in namespace my-ns,
```

-->

## 删除资源

```console
$ kubectl delete -f ./pod.json                                              # 删除 pod.json 文件中定义的类型和名称的 pod
$ kubectl delete pod,service baz foo                                        # 删除名为“baz”的 pod 和名为“foo”的 service
$ kubectl delete pods,services -l name=myLabel                              # 删除具有 name=myLabel 标签的 pod 和 serivce
$ kubectl delete pods,services -l name=myLabel --include-uninitialized      # 删除具有 name=myLabel 标签的 pod 和 service，包括尚未初始化的
$ kubectl -n my-ns delete po,svc --all                                      # 删除 my-ns namespace 下的所有 pod 和 serivce，包括尚未初始化的
```

<!--

## Interacting with running Pods

```console
$ kubectl logs my-pod                                 # dump pod logs (stdout)
$ kubectl logs my-pod -c my-container                 # dump pod container logs (stdout, multi-container case)
$ kubectl logs -f my-pod                              # stream pod logs (stdout)
$ kubectl logs -f my-pod -c my-container              # stream pod container logs (stdout, multi-container case)
$ kubectl run -i --tty busybox --image=busybox -- sh  # Run pod as interactive shell
$ kubectl attach my-pod -i                            # Attach to Running Container
$ kubectl port-forward my-pod 5000:6000               # Forward port 6000 of Pod to your to 5000 on your local machine
$ kubectl exec my-pod -- ls /                         # Run command in existing pod (1 container case)
$ kubectl exec my-pod -c my-container -- ls /         # Run command in existing pod (multi-container case)
$ kubectl top pod POD_NAME --containers               # Show metrics for a given pod and its containers
```

-->

## 与运行中的 Pod 交互

```console
$ kubectl logs my-pod                                 # dump 输出 pod 的日志（stdout）
$ kubectl logs my-pod -c my-container                 # dump 输出 pod 中容器的日志（stdout，pod 中有多个容器的情况下使用）
$ kubectl logs -f my-pod                              # 流式输出 pod 的日志（stdout）
$ kubectl logs -f my-pod -c my-container              # 流式输出 pod 中容器的日志（stdout，pod 中有多个容器的情况下使用）
$ kubectl run -i --tty busybox --image=busybox -- sh  # 交互式 shell 的方式运行 pod
$ kubectl attach my-pod -i                            # 连接到运行中的容器
$ kubectl port-forward my-pod 5000:6000               # 转发 pod 中的 6000 端口到本地的 5000 端口
$ kubectl exec my-pod -- ls /                         # 在已存在的容器中执行命令（只有一个容器的情况下）
$ kubectl exec my-pod -c my-container -- ls /         # 在已存在的容器中执行命令（pod 中有多个容器的情况下）
$ kubectl top pod POD_NAME --containers               # 显示指定 pod 和容器的指标度量
```

<!--

## Interacting with Nodes and Cluster

```console
$ kubectl cordon my-node                                                # Mark my-node as unschedulable
$ kubectl drain my-node                                                 # Drain my-node in preparation for maintenance
$ kubectl uncordon my-node                                              # Mark my-node as schedulable
$ kubectl top node my-node                                              # Show metrics for a given node
$ kubectl cluster-info                                                  # Display addresses of the master and services
$ kubectl cluster-info dump                                             # Dump current cluster state to stdout
$ kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Dump current cluster state to /path/to/cluster-state

# If a taint with that key and effect already exists, its value is replaced as specified.
$ kubectl taint nodes foo dedicated=special-user:NoSchedule
```

-->

## 与节点和集群交互

```console
$ kubectl cordon my-node                                                # 标记 my-node 不可调度
$ kubectl drain my-node                                                 # 清空 my-node 以待维护
$ kubectl uncordon my-node                                              # 标记 my-node 可调度
$ kubectl top node my-node                                              # 显示 my-node 的指标度量
$ kubectl cluster-info                                                  # 显示 master 和服务的地址
$ kubectl cluster-info dump                                             # 将当前集群状态输出到 stdout                                    
$ kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 将当前集群状态输出到 /path/to/cluster-state

# 如果该键和影响的污点（taint）已存在，则使用指定的值替换
$ kubectl taint nodes foo dedicated=special-user:NoSchedule
```

<!--

## Resource types

The following table includes a list of all the supported resource types and their abbreviated aliases:

-->

## 资源类型

下表列出的是 Kubernetes 中所有支持的类型和缩写的别名。

| 资源类型                       | 缩写别名     |
| -------------------------- | -------- |
| `clusters`                 |          |
| `componentstatuses`        | `cs`     |
| `configmaps`               | `cm`     |
| `daemonsets`               | `ds`     |
| `deployments`              | `deploy` |
| `endpoints`                | `ep`     |
| `event`                    | `ev`     |
| `horizontalpodautoscalers` | `hpa`    |
| `ingresses`                | `ing`    |
| `jobs`                     |          |
| `limitranges`              | `limits` |
| `namespaces`               | `ns`     |
| `networkpolicies`          |          |
| `nodes`                    | `no`     |
| `statefulsets`             |          |
| `persistentvolumeclaims`   | `pvc`    |
| `persistentvolumes`        | `pv`     |
| `pods`                     | `po`     |
| `podsecuritypolicies`      | `psp`    |
| `podtemplates`             |          |
| `replicasets`              | `rs`     |
| `replicationcontrollers`   | `rc`     |
| `resourcequotas`           | `quota`  |
| `cronjob`                  |          |
| `secrets`                  |          |
| `serviceaccount`           | `sa`     |
| `services`                 | `svc`    |
| `storageclasses`           |          |
| `thirdpartyresources`      |          |

<!--

### Formatting output

To output details to your terminal window in a specific format, you can add either the `-o` or `-output` flags to a supported `kubectl` command.

| Output format                       | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `-o=custom-columns=<spec>`          | Print a table using a comma separated list of custom columns |
| `-o=custom-columns-file=<filename>` | Print a table using the custom columns template in the `<filename>` file |
| `-o=json`                           | Output a JSON formatted API object       |
| `-o=jsonpath=<template>`            | Print the fields defined in a [jsonpath](/docs/user-guide/jsonpath) expression |
| `-o=jsonpath-file=<filename>`       | Print the fields defined by the [jsonpath](/docs/user-guide/jsonpath) expression in the `<filename>` file |
| `-o=name`                           | Print only the resource name and nothing else |
| `-o=wide`                           | Output in the plain-text format with any additional information, and for pods, the node name is included |
| `-o=yaml`                           | Output a YAML formatted API object       |

-->

### 格式化输出

要以特定的格式向终端窗口输出详细信息，可以在 `kubectl` 命令中添加 `-o` 或者 `-output` 标志。

| 输出格式                                | 描述                                       |
| ----------------------------------- | ---------------------------------------- |
| `-o=custom-columns=<spec>`          | 使用逗号分隔的自定义列列表打印表格                        |
| `-o=custom-columns-file=<filename>` | 使用 <filename> 文件中的自定义列模板打印表格             |
| `-o=json`                           | 输出 JSON 格式的 API 对象                       |
| `-o=jsonpath=<template>`            | 打印 [jsonpath](/docs/user-guide/jsonpath) 表达式中定义的字段 |
| `-o=jsonpath-file=<filename>`       | 打印由 <filename> 文件中的 [jsonpath](/docs/user-guide/jsonpath) 表达式定义的字段 |
| `-o=name`                           | 仅打印资源名称                                  |
| `-o=wide`                           | 以纯文本格式输出任何附加信息，对于 Pod ，包含节点名称            |
| `-o=yaml`                           | 输出 YAML 格式的 API 对象                       |

<!--

### Kubectl output verbosity and debugging

Kubectl verbosity is controlled with the `-v` or `--v` flags followed by an integer representing the log level. General Kubernetes logging conventions and the associated log levels are described [here](https://github.com/kubernetes/community/blob/master/contributors/devel/logging.md).

| Verbosity | Description                              |
| --------- | ---------------------------------------- |
| `--v=0`   | Generally useful for this to ALWAYS be visible to an operator. |
| `--v=1`   | A reasonable default log level if you don't want verbosity. |
| `--v=2`   | Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level for most systems. |
| `--v=3`   | Extended information about changes.      |
| `--v=4`   | Debug level verbosity.                   |
| `--v=6`   | Display requested resources.             |
| `--v=7`   | Display HTTP request headers.            |
| `--v=8`   | Display HTTP request contents.           |

-->

### Kubectl 详细输出与调试

使用 `-v` 或 `--v` 标志跟着一个整数来指定日志级别。[这里](https://github.com/kubernetes/community/blob/master/contributors/devel/logging.md) 描述了通用的 kubernetes 日志约定和相关的日志级别。

| 详细等级    | 描述                                       |
| ------- | ---------------------------------------- |
| `--v=0` | 总是对操作人员可见。                               |
| `--v=1` | 合理的默认日志级别，如果您不需要详细输出。                    |
| `--v=2` | 可能与系统的重大变化相关的，有关稳定状态的信息和重要的日志信息。这是对大多数系统推荐的日志级别。 |
| `--v=3` | 有关更改的扩展信息。                               |
| `--v=4` | 调试级别详细输出。                                |
| `--v=6` | 显示请求的资源。                                 |
| `--v=7` | 显示HTTP请求的header。                         |
| `--v=8` | 显示HTTP请求的内容。                             |
