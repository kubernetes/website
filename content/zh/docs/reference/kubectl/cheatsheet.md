---
title: kubectl Cheat Sheet
reviewers:
- bgrant0607
- erictune
- krousey
- clove
content_template: templates/concept
---

{{% capture overview %}}

<!--
See also: [Kubectl Overview](/docs/reference/kubectl/overview/) and [JsonPath Guide](/docs/reference/kubectl/jsonpath).
-->
也可以看下：[Kubectl 概述](/docs/reference/kubectl/overview/) 和 [JsonPath 指南](/docs/reference/kubectl/jsonpath)。

<!--
This page is an overview of the `kubectl` command.
-->
本页面是 `kubectl` 命令的概述。

{{% /capture %}}

{{% capture body %}}

# kubectl - Cheat Sheet

<!--
## Kubectl Autocomplete
-->
## Kubectl 自动补全

### BASH

<!--
```bash
source <(kubectl completion bash) # setup autocomplete in bash into the current shell, bash-completion package should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # add autocomplete permanently to your bash shell.
```
-->
```bash
source <(kubectl completion bash) # 在 bash 中设置当前 shell 的自动补全，要先安装 bash-completion 包。
echo "source <(kubectl completion bash)" >> ~/.bashrc # 在您的 bash shell 中永久的添加自动补全
```

### ZSH

<!--
```bash
source <(kubectl completion zsh)  # setup autocomplete in zsh into the current shell
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # add autocomplete permanently to your zsh shell
```
-->
```bash
source <(kubectl completion zsh)  # 在 zsh 中设置当前 shell 的自动补全
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # 在您的 zsh shell 中永久的添加自动补全
```

<!--
## Kubectl Context and Configuration

Set which Kubernetes cluster `kubectl` communicates with and modifies configuration
information. See [Authenticating Across Clusters with kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation for
detailed config file information.
-->
##  Kubectl 上下文和配置

设置 `kubectl` 与哪个 Kubernetes 集群进行通信并修改配置信息。查看 [使用 kubeconfig 跨集群授权访问
](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 文档获取详情配置文件信息。

<!--
```bash
kubectl config view # Show Merged kubeconfig settings.

# use multiple kubeconfig files at the same time and view merged config
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# Get the password for the e2e user
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config current-context              # Display the current-context
kubectl config use-context my-cluster-name  # set the default context to my-cluster-name

# add a new cluster to your kubeconf that supports basic auth
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# set a context utilizing a specific username and namespace.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
```
-->
```bash
kubectl config view # 显示合并的 kubeconfig 配置。

# 同时使用多个 kubeconfig 文件并查看合并的配置
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# 获取 e2e 用户的密码
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config current-context              # 展示当前所处的上下文
kubectl config use-context my-cluster-name  # 设置默认的上下文为 my-cluster-name

# 添加新的集群配置到 kubeconf 中，使用 basic auth 进行鉴权
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 使用特定的用户名和命名空间设置上下文。
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
```

<!--
## Creating Objects

Kubernetes manifests can be defined in json or yaml. The file extension `.yaml`,
`.yml`, and `.json` can be used.
-->
## 创建对象

Kubernetes 配置可以用 json 或 yaml 定义。可以使用的文件扩展名有 `.yaml`，
`.yml` 和 `.json` 。

<!--
```bash
kubectl create -f ./my-manifest.yaml           # create resource(s)
kubectl create -f ./my1.yaml -f ./my2.yaml     # create from multiple files
kubectl create -f ./dir                        # create resource(s) in all manifest files in dir
kubectl create -f https://git.io/vPieo         # create resource(s) from url
kubectl run nginx --image=nginx                # start a single instance of nginx
kubectl explain pods,svc                       # get the documentation for pod and svc manifests

# Create multiple YAML objects from stdin
cat <<EOF | kubectl create -f -
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
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```
-->
```bash
kubectl create -f ./my-manifest.yaml           # 创建资源
kubectl create -f ./my1.yaml -f ./my2.yaml     # 使用多个文件创建
kubectl create -f ./dir                        # 从目录下的全部配置文件创建资源
kubectl create -f https://git.io/vPieo         # 从 url 中创建资源
kubectl run nginx --image=nginx                # 启动单实例 nginx
kubectl explain pods,svc                       # 获取 pod，svc 配置的文档说明

# 从标准输入中的多个 YAML 对象中创建
cat <<EOF | kubectl create -f -
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

# 创建有多个 key 的 Secret
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```
<!--
## Viewing, Finding Resources
-->
## 获取和查找资源

<!--
```bash
# Get commands with basic output
kubectl get services                          # List all services in the namespace
kubectl get pods --all-namespaces             # List all pods in all namespaces
kubectl get pods -o wide                      # List all pods in the namespace, with more details
kubectl get deployment my-dep                 # List a particular deployment
kubectl get pods --include-uninitialized      # List all pods in the namespace, including uninitialized ones

# Describe commands with verbose output
kubectl describe nodes my-node
kubectl describe pods my-pod

kubectl get services --sort-by=.metadata.name # List Services Sorted by Name

# List pods Sorted by Restart Count
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Get the version label of all pods with label app=cassandra
kubectl get pods --selector=app=cassandra rc -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Get all running pods in the namespace
kubectl get pods --field-selector=status.phase=Running

# Get ExternalIPs of all nodes
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# List Names of Pods that belong to Particular RC
# "jq" command useful for transformations that are too complex for jsonpath, it can be found at https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Check which nodes are ready
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# List all Secrets currently in use by a pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# List Events sorted by timestamp
kubectl get events --sort-by=.metadata.creationTimestamp
```
-->
```bash
# 使用 get 命令获取基本输出
kubectl get services                          # 列出当前命名空间下的所有 services
kubectl get pods --all-namespaces             # 列出所有命名空间下的全部的 pods
kubectl get pods -o wide                      # 列出当前命名空间下的全部 pods，有更多的详细信息
kubectl get deployment my-dep                 # 列出某个特定的 deployment
kubectl get pods --include-uninitialized      # 列出当前命名空间下的全部 pods，包含未初始化的

# 使用 describe 命令获取详细输出
kubectl describe nodes my-node
kubectl describe pods my-pod

kubectl get services --sort-by=.metadata.name # 列出当前命名空间下所有 services，按照名称排序

# 列出 pods 按照重启次数进行排序
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# 获取包含 app=cassandra 标签全部 pods 的 version 标签
kubectl get pods --selector=app=cassandra rc -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 获取当前命名空间中正在运行的 pods
kubectl get pods --field-selector=status.phase=Running

# 获取全部 node 的 ExternalIP 地址
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 列出属于某个特定 RC 的 pods 的名称
# "jq" 命令对于 jsonpath 过于复杂的转换非常有用，可以在 https://stedolan.github.io/jq/ 找到它。
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# 检查哪些节点处于 ready
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# 列出被一个 pod 使用的全部 secret
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# 列出 events，按照创建时间排序
kubectl get events --sort-by=.metadata.creationTimestamp
```

<!--
## Updating Resources

As of version 1.11 `rolling-update` have been deprecated (see [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md)), use `rollout` instead.
-->
## 更新资源

从版本 1.11 开始，`rolling-update` 已被弃用（参见[CHANGELOG-1.11.md]（https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md）），请使用 `rollout` 代替。

<!--
```bash
kubectl set image deployment/frontend www=image:v2               # Rolling update "www" containers of "frontend" deployment, updating the image
kubectl rollout undo deployment/frontend                         # Rollback to the previous deployment
kubectl rollout status -w deployment/frontend                    # Watch rolling update status of "frontend" deployment until completion

# deprecated starting version 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (deprecated) Rolling update pods of frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (deprecated) Change the name of the resource and update the image
kubectl rolling-update frontend --image=image:v2                 # (deprecated) Update the pods image of frontend
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (deprecated) Abort existing rollout in progress

cat pod.json | kubectl replace -f -                              # Replace a pod based on the JSON passed into std

# Force replace, delete and then re-create the resource. Will cause a service outage.
kubectl replace --force -f ./pod.json

# Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Update a single-container pod's image version (tag) to v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Add a Label
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Add an annotation
kubectl autoscale deployment foo --min=2 --max=10                # Auto scale a deployment "foo"
```
-->
```bash
kubectl set image deployment/frontend www=image:v2               # 滚动更新 "frontend" deployment 的 "www" 容器镜像
kubectl rollout undo deployment/frontend                         # 回滚到上次部署
kubectl rollout status -w deployment/frontend                    # Watch "frontend" deployment 的滚动升级状态直到完成

# 从 1.11 版本开始弃用
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (弃用) 滚动升级 frontend-v1 的 pods
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (弃用) 修改资源的名称并更新镜像
kubectl rolling-update frontend --image=image:v2                 # (弃用) 更新 frontend 的 pods 的镜像
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (弃用) 终止已经进行中的 rollout

cat pod.json | kubectl replace -f -                              # 通过传入到标准输入的 JSON 来替换 pod

# 强制进行替换，会删除然后再创建资源，会导致服务不可用。
kubectl replace --force -f ./pod.json

# 为多副本的 nginx 创建服务，使用 80 端口提供服务，连接到容器的 8000 端口。
kubectl expose rc nginx --port=80 --target-port=8000

# 更新单容器 pod 的镜像标签到 v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # 添加标签
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # 添加注解
kubectl autoscale deployment foo --min=2 --max=10                # 使 "foo" deployment 自动伸缩容
```

<!--
## Patching Resources
-->
## 局部更新资源

<!--
```bash
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # Partially update a node

# Update a container's image; spec.containers[*].name is required because it's a merge key
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Update a container's image using a json patch with positional arrays
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Disable a deployment livenessProbe using a json patch with positional arrays
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Add a new element to a positional array 
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```
-->
```bash
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # 部分更新 node 

# 更新容器的镜像；spec.containers[*].name 是必须的因为它是一个合并 key。
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# 使用带位置数组的 json patch 更新容器的镜像
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# 使用带位置数组的 json patch 禁用 deployment 的 livenessProbe
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# 在带位置数组中添加元素
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

<!--
## Editing Resources
The edit any API resource in an editor.

```bash
kubectl edit svc/docker-registry                      # Edit the service named docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Use an alternative editor
```
-->
## 编辑资源
在编辑器中编辑任何 API 资源

```bash
kubectl edit svc/docker-registry                      # 编辑名为 docker-registry 的 service
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # 使用其他编辑器
```

<!--
## Scaling Resources

```bash
kubectl scale --replicas=3 rs/foo                                 # Scale a replicaset named 'foo' to 3
kubectl scale --replicas=3 -f foo.yaml                            # Scale a resource specified in "foo.yaml" to 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # If the deployment named mysql's current size is 2, scale mysql to 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Scale multiple replication controllers
```
-->
## 对资源进行伸缩

```bash
kubectl scale --replicas=3 rs/foo                                 # 将名为 'foo' 的副本集伸缩到 3 副本
kubectl scale --replicas=3 -f foo.yaml                            # 将在 "foo.yaml" 中的特定资源伸缩到 3 个副本
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # 如果名为 mysql 的 deployment 的副本当前是 2，那么将它伸缩到 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 伸缩多个 replication controllers
```

<!--
## Deleting Resources

```bash
kubectl delete -f ./pod.json                                              # Delete a pod using the type and name specified in pod.json
kubectl delete pod,service baz foo                                        # Delete pods and services with same names "baz" and "foo"
kubectl delete pods,services -l name=myLabel                              # Delete pods and services with label name=myLabel
kubectl delete pods,services -l name=myLabel --include-uninitialized      # Delete pods and services, including uninitialized ones, with label name=myLabel
kubectl -n my-ns delete po,svc --all                                      # Delete all pods and services, including uninitialized ones, in namespace my-ns,
```
-->
## 删除资源

```bash
kubectl delete -f ./pod.json                                              # 删除在 pod.json 中指定的类型和名称的 pod
kubectl delete pod,service baz foo                                        # 删除名称为 "baz" 和 "foo" 的 pod 和 service
kubectl delete pods,services -l name=myLabel                              # 删除包含 name=myLabel 标签的 pods 和 services
kubectl delete pods,services -l name=myLabel --include-uninitialized      # 删除包含 label name=myLabel 标签的 pods 和 services，包括未初始化的
kubectl -n my-ns delete po,svc --all                                      # 删除在 my-ns 命名空间中全部的 pods 和 services ，包括未初始化的
```

<!--
## Interacting with running Pods

```bash
kubectl logs my-pod                                 # dump pod logs (stdout)
kubectl logs my-pod --previous                      # dump pod logs (stdout) for a previous instantiation of a container
kubectl logs my-pod -c my-container                 # dump pod container logs (stdout, multi-container case)
kubectl logs my-pod -c my-container --previous      # dump pod container logs (stdout, multi-container case) for a previous instantiation of a container
kubectl logs -f my-pod                              # stream pod logs (stdout)
kubectl logs -f my-pod -c my-container              # stream pod container logs (stdout, multi-container case)
kubectl run -i --tty busybox --image=busybox -- sh  # Run pod as interactive shell
kubectl attach my-pod -i                            # Attach to Running Container
kubectl port-forward my-pod 5000:6000               # Listen on port 5000 on the local machine and forward to port 6000 on my-pod
kubectl exec my-pod -- ls /                         # Run command in existing pod (1 container case)
kubectl exec my-pod -c my-container -- ls /         # Run command in existing pod (multi-container case)
kubectl top pod POD_NAME --containers               # Show metrics for a given pod and its containers
```
-->
## 与运行中的 Pods 进行交互

```bash
kubectl logs my-pod                                 # 获取 pod 日志(标准输出)
kubectl logs my-pod --previous                      # 获取上个容器实例的 pod 日志(标准输出)
kubectl logs my-pod -c my-container                 # 获取 pod 的容器日志 (标准输出, 多容器的场景)
kubectl logs my-pod -c my-container --previous      # 获取 pod 的上个容器实例日志 (标准输出, 多容器的场景)
kubectl logs -f my-pod                              # 流式输出 pod 的日志 (标准输出)
kubectl logs -f my-pod -c my-container              # 流式输出 pod 容器的日志 (标准输出, 多容器的场景)
kubectl run -i --tty busybox --image=busybox -- sh  # 以交互式 shell 运行 Pod
kubectl attach my-pod -i                            # 进入到一个运行中的容器中
kubectl port-forward my-pod 5000:6000               # 在本地计算机上侦听端口 5000 并转发到 my-pod 上的端口 6000
kubectl exec my-pod -- ls /                         # 在已有的 pod 中运行命令(单容器的场景)
kubectl exec my-pod -c my-container -- ls /         # 在已有的 pod 中运行命令(多容器的场景)
kubectl top pod POD_NAME --containers               # 显示给定 pod 和容器的监控数据
```

<!--
## Interacting with Nodes and Cluster

```bash
kubectl cordon my-node                                                # Mark my-node as unschedulable
kubectl drain my-node                                                 # Drain my-node in preparation for maintenance
kubectl uncordon my-node                                              # Mark my-node as schedulable
kubectl top node my-node                                              # Show metrics for a given node
kubectl cluster-info                                                  # Display addresses of the master and services
kubectl cluster-info dump                                             # Dump current cluster state to stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Dump current cluster state to /path/to/cluster-state

# If a taint with that key and effect already exists, its value is replaced as specified.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```
-->
## 与节点和集群进行交互

```bash
kubectl cordon my-node                                                # 设置 my-node 节点为不可调度
kubectl drain my-node                                                 # 对 my-node 节点进行驱逐操作，为节点维护做准备
kubectl uncordon my-node                                              # 设置 my-node 节点为可以调度
kubectl top node my-node                                              # 显示指定节点的监控数据
kubectl cluster-info                                                  # 限制 master 和 services 的地址
kubectl cluster-info dump                                             # 将当前集群状态输出到标准输出
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 将当前集群状态输出到 /path/to/cluster-state

# 如果已存在具有该键和效果的污点，则其值将按指定替换
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

<!--
### Resource types

List all supported resource types along with their shortnames, [API group](/docs/concepts/overview/kubernetes-api/#api-groups), whether they are [namespaced](/docs/concepts/overview/working-with-objects/namespaces), and [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Other operations for exploring API resources:

```bash
kubectl api-resources --namespaced=true      # All namespaced resources
kubectl api-resources --namespaced=false     # All non-namespaced resources
kubectl api-resources -o name                # All resources with simple output (just the resource name)
kubectl api-resources -o wide                # All resources with expanded (aka "wide") output
kubectl api-resources --verbs=list,get       # All resources that support the "list" and "get" request verbs
kubectl api-resources --api-group=extensions # All resources in the "extensions" API group
```
-->
### 资源类型

列出全部支持的资源类型和它们的简称, [API group](/docs/concepts/overview/kubernetes-api/#api-groups), 无论它们是否是 [namespaced](/docs/concepts/overview/working-with-objects/namespaces), [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

用于探索 API 资源的其他操作：

```bash
kubectl api-resources --namespaced=true      # 所有在命名空间中的资源
kubectl api-resources --namespaced=false     # 所有不在命名空间中的资源
kubectl api-resources -o name                # 输出简单的所有资源（只是资源名称）
kubectl api-resources -o wide                # 具有扩展（又称 "wide"）输出的所有资源
kubectl api-resources --verbs=list,get       # 支持"list"和"get"请求动词的所有资源
kubectl api-resources --api-group=extensions # "extensions" API组中的所有资源
```

<!--
### Formatting output

To output details to your terminal window in a specific format, you can add either the `-o` or `--output` flags to a supported `kubectl` command.

Output format | Description
--------------| -----------
`-o=custom-columns=<spec>` | Print a table using a comma separated list of custom columns
`-o=custom-columns-file=<filename>` | Print a table using the custom columns template in the `<filename>` file
`-o=json`     | Output a JSON formatted API object
`-o=jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/reference/kubectl/jsonpath) expression
`-o=jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/reference/kubectl/jsonpath) expression in the `<filename>` file
`-o=name`     | Print only the resource name and nothing else
`-o=wide`     | Output in the plain-text format with any additional information, and for pods, the node name is included
`-o=yaml`     | Output a YAML formatted API object
-->
### 格式化输出

要以特定格式将详细信息输出到终端窗口，可以将 `-o` 或 `--output` 参数添加到支持的 `kubectl` 命令.

输出格式 | 描述
--------------| -----------
`-o=custom-columns=<spec>` | 使用逗号分隔的自定义列列表打印表格
`-o=custom-columns-file=<filename>` | 使用 `<filename>` 文件中的自定义列模板打印表格
`-o=json`     | 输出 JSON 格式的 API 对象
`-o=jsonpath=<template>` | 打印 [jsonpath](/docs/reference/kubectl/jsonpath) 表达式中定义的字段
`-o=jsonpath-file=<filename>` | 打印 `<filename>` 文件中 [jsonpath](/docs/reference/kubectl/jsonpath) 表达式定义的字段
`-o=name`     | 仅打印资源名称而不打印任何其他内容
`-o=wide`     | 使用任何其他信息以纯文本格式输出，对于 pod 来说，包含了节点名称
`-o=yaml`     | 输出 YAML 格式的 API 对象

<!--
### Kubectl output verbosity and debugging

Kubectl verbosity is controlled with the `-v` or `--v` flags followed by an integer representing the log level. General Kubernetes logging conventions and the associated log levels are described [here](https://github.com/kubernetes/community/blob/master/contributors/devel/logging.md).

Verbosity | Description
--------------| -----------
`--v=0` | Generally useful for this to ALWAYS be visible to an operator.
`--v=1` | A reasonable default log level if you don't want verbosity.
`--v=2` | Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level for most systems.
`--v=3` | Extended information about changes.
`--v=4` | Debug level verbosity.
`--v=6` | Display requested resources.
`--v=7` | Display HTTP request headers.
`--v=8` | Display HTTP request contents.
`--v=9` | Display HTTP request contents without truncation of contents.
-->
### Kubectl 日志输出详细程度和调试

Kubectl 日志输出详细程度是通过 `-v` 或者 `--v` 来控制的，参数后跟了一个数字表示日志的级别。Kubernetes 通用的日志习惯和相关的日志级别在 [这里](https://github.com/kubernetes/community/blob/master/contributors/devel/logging.md) 有相应的描述。

详细程度 | 描述
--------------| -----------
`--v=0` | 通常对此有用，始终对运维人员可见。
`--v=1` | 如果您不想要详细程度，则为合理的默认日志级别。
`--v=2` | 有关服务的有用稳定状态信息以及可能与系统中的重大更改相关的重要日志消息。这是大多数系统的建议默认日志级别。
`--v=3` | 有关更改的扩展信息。
`--v=4` | Debug 级别。
`--v=6` | 显示请求的资源。
`--v=7` | 显示 HTTP 请求头。
`--v=8` | 显示 HTTP 请求内容。
`--v=9` | 显示 HTTP 请求内容而不截断内容。


{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Learn more about [Overview of kubectl](/docs/reference/kubectl/overview/).

* See [kubectl](/docs/reference/kubectl/kubectl/) options.

* Also [kubectl Usage Conventions](/docs/reference/kubectl/conventions/) to understand how to use it in reusable scripts.

* See more community [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).
-->
* 学习更多关于 [kubectl 概述](/docs/reference/kubectl/overview/)。

* 查看 [kubectl](/docs/reference/kubectl/kubectl/) 的参数。

* 也可以查看 [kubectl 使用约定](/docs/reference/kubectl/conventions/) 来理解如果在可以复用的脚本中使用它。

* 查看更多社区的 [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4)。
{{% /capture %}}
