---
title: kubectl 備忘單
content_type: concept
weight: 10
card:
  name: reference
  weight: 30
---
<!-- ---
title: kubectl Cheat Sheet
reviewers:
- erictune
- krousey
- clove
content_type: concept
weight: 10 # highlight it
card:
  name: reference
  weight: 30
--- -->

<!-- overview -->

<!--
This page contains a list of commonly used `kubectl` commands and flags.
-->

本頁列舉了常用的 “kubectl” 命令和標誌

<!-- body -->

<!--
## Kubectl autocomplete

### BASH
-->

## Kubectl 自動補全

### BASH

<!--
```bash
source <(kubectl completion bash) # setup autocomplete in bash into the current shell, bash-completion package should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # add autocomplete permanently to your bash shell.
```

You can also use a shorthand alias for `kubectl` that also works with completion:
-->
```bash
source <(kubectl completion bash) # 在 bash 中設定當前 shell 的自動補全，要先安裝 bash-completion 包。
echo "source <(kubectl completion bash)" >> ~/.bashrc # 在您的 bash shell 中永久的新增自動補全
```

您還可以為 `kubectl` 使用一個速記別名，該別名也可以與 completion 一起使用：

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

<!--
```bash
source <(kubectl completion zsh)  # setup autocomplete in zsh into the current shell
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # add autocomplete permanently to your zsh shell
```
-->
```bash
source <(kubectl completion zsh)  # 在 zsh 中設定當前 shell 的自動補全
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # 在您的 zsh shell 中永久的新增自動補全
```

<!--
### A Note on --all-namespaces
-->
### 關於 --all-namespaces 的一點說明

<!--
Appending `--all-namespaces` happens frequently enough where you should be aware of the shorthand for `--all-namespaces`:
-->
我們經常用到 `--all-namespaces` 引數，你應該要知道它的簡寫：

```kubectl -A```

<!--
## Kubectl Context and Configuration

Set which Kubernetes cluster `kubectl` communicates with and modifies configuration
information. See [Authenticating Across Clusters with kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation for
detailed config file information.
-->
##  Kubectl 上下文和配置

設定 `kubectl` 與哪個 Kubernetes 叢集進行通訊並修改配置資訊。
檢視[使用 kubeconfig 跨叢集授權訪問](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
文件獲取配置檔案詳細資訊。

<!--
```bash
kubectl config view # Show Merged kubeconfig settings.

# use multiple kubeconfig files at the same time and view merged config
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# get the password for the e2e user
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # display the first user
kubectl config view -o jsonpath='{.users[*].name}'   # get a list of users
kubectl config get-contexts                          # display list of contexts
kubectl config current-context           # display the current-context
kubectl config use-context my-cluster-name           # set the default context to my-cluster-name

# add a new user to your kubeconf that supports basic auth
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# permanently save the namespace for all subsequent kubectl commands in that context.
kubectl config set-context --current --namespace=ggckad-s2

# set a context utilizing a specific username and namespace.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # delete user foo

# short alias to set/show context/namespace (only works for bash and bash-compatible shells, current context to be set before using kn to set namespace) 
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```
-->
```bash
kubectl config view # 顯示合併的 kubeconfig 配置。

# 同時使用多個 kubeconfig 檔案並檢視合併的配置
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# 獲取 e2e 使用者的密碼
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # 顯示第一個使用者
kubectl config view -o jsonpath='{.users[*].name}'   # 獲取使用者列表
kubectl config get-contexts                          # 顯示上下文列表
kubectl config current-context                       # 展示當前所處的上下文
kubectl config use-context my-cluster-name           # 設定預設的上下文為 my-cluster-name

# 新增新的使用者配置到 kubeconf 中，使用 basic auth 進行身份認證
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 在指定上下文中永續性地儲存名字空間，供所有後續 kubectl 命令使用
kubectl config set-context --current --namespace=ggckad-s2

# 使用特定的使用者名稱和名字空間設定上下文
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # 刪除使用者 foo

# 設定或顯示 context / namespace 的短別名
# （僅適用於 bash 和 bash 相容的 shell，在使用 kn 設定名稱空間之前要先設定 current-context）
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

<!--
## Kubectl apply
`apply` manages applications through files defining Kubernetes resources. It creates and updates resources in a cluster through running `kubectl apply`. This is the recommended way of managing Kubernetes applications on production. See [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->
## Kubectl apply
`apply` 透過定義 Kubernetes 資源的檔案來管理應用。
它透過執行 `kubectl apply` 在叢集中建立和更新資源。
這是在生產中管理 Kubernetes 應用的推薦方法。
參見 [Kubectl 文件](https://kubectl.docs.kubernetes.io)。

<!--
## Creating objects

Kubernetes manifests can be defined in YAML or JSON. The file extension `.yaml`,
`.yml`, and `.json` can be used.
-->
## 建立物件 {#creating-objects}

Kubernetes 配置可以用 YAML 或 JSON 定義。可以使用的副檔名有
`.yaml`、`.yml` 和 `.json`。

<!--
```bash
kubectl apply -f ./my-manifest.yaml            # create resource(s)
kubectl apply -f ./my1.yaml -f ./my2.yaml      # create from multiple files
kubectl apply -f ./dir                         # create resource(s) in all manifest files in dir
kubectl apply -f https://git.io/vPieo          # create resource(s) from url
kubectl create deployment nginx --image=nginx  # start a single instance of nginx

# create a Job which prints "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# create a CronJob that prints "Hello World" every minute
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"    

kubectl explain pods                           # get the documentation for pod manifests

# Create multiple YAML objects from stdin
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
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
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# Create a secret with several keys
cat <<EOF | kubectl apply -f -
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
kubectl apply -f ./my-manifest.yaml           # 建立資源
kubectl apply -f ./my1.yaml -f ./my2.yaml     # 使用多個檔案建立
kubectl apply -f ./dir                        # 基於目錄下的所有清單檔案建立資源
kubectl apply -f https://git.io/vPieo         # 從 URL 中建立資源
kubectl create deployment nginx --image=nginx # 啟動單例項 nginx

# 建立一個列印 “Hello World” 的 Job
kubectl create job hello --image=busybox:1.28 -- echo "Hello World" 

# 建立一個列印 “Hello World” 間隔1分鐘的 CronJob
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"    

kubectl explain pods                          # 獲取 pod 清單的文件說明

# 從標準輸入建立多個 YAML 物件
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
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
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# 建立有多個 key 的 Secret
cat <<EOF | kubectl apply -f -
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
## Viewing, finding resources
-->
## 檢視和查詢資源

<!--
```bash
# Get commands with basic output
kubectl get services                          # List all services in the namespace
kubectl get pods --all-namespaces             # List all pods in all namespaces
kubectl get pods -o wide                      # List all pods in the current namespace, with more details
kubectl get deployment my-dep                 # List a particular deployment
kubectl get pods                              # List all pods in the namespace
kubectl get pod my-pod -o yaml                # Get a pod's YAML

# Describe commands with verbose output
kubectl describe nodes my-node
kubectl describe pods my-pod

# List Services Sorted by Name
kubectl get services --sort-by=.metadata.name

# List pods Sorted by Restart Count
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# List PersistentVolumes sorted by capacity
kubectl get pv --sort-by=.spec.capacity.storage

# Get the version label of all pods with label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Retrieve the value of a key with dots, e.g. 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# Get all worker nodes (use a selector to exclude results that have a label
# named 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Get all running pods in the namespace
kubectl get pods --field-selector=status.phase=Running

# Get ExternalIPs of all nodes
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# List Names of Pods that belong to Particular RC
# "jq" command useful for transformations that are too complex for jsonpath, it can be found at https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Show labels for all pods (or any other Kubernetes object that supports labelling)
kubectl get pods --show-labels

# Check which nodes are ready
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Output decoded secrets without external tools
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# List all Secrets currently in use by a pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# List all containerIDs of initContainer of all pods
# Helpful when cleaning up stopped containers, while avoiding removal of initContainers.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# List Events sorted by timestamp
kubectl get events --sort-by=.metadata.creationTimestamp

# Compares the current state of the cluster against the state that the cluster would be in if the manifest was applied.
kubectl diff -f ./my-manifest.yaml

# Produce a period-delimited tree of all keys returned for nodes
# Helpful when locating a key within a complex nested JSON structure
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Produce a period-delimited tree of all keys returned for pods, etc
kubectl get pods -o json | jq -c 'paths|join(".")'

# Produce ENV for all pods, assuming you have a default container for the pods, default namespace and the `env` command is supported.
# Helpful when running any supported command across all pods, not just `env`
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Get a deployment's status subresource
kubectl get deployment nginx-deployment --subresource=status
```
-->
```bash
# get 命令的基本輸出
kubectl get services                          # 列出當前名稱空間下的所有 services
kubectl get pods --all-namespaces             # 列出所有名稱空間下的全部的 Pods
kubectl get pods -o wide                      # 列出當前名稱空間下的全部 Pods，並顯示更詳細的資訊
kubectl get deployment my-dep                 # 列出某個特定的 Deployment
kubectl get pods                              # 列出當前名稱空間下的全部 Pods
kubectl get pod my-pod -o yaml                # 獲取一個 pod 的 YAML

# describe 命令的詳細輸出
kubectl describe nodes my-node
kubectl describe pods my-pod

# 列出當前名字空間下所有 Services，按名稱排序
kubectl get services --sort-by=.metadata.name

# 列出 Pods，按重啟次數排序
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# 列舉所有 PV 持久卷，按容量排序
kubectl get pv --sort-by=.spec.capacity.storage

# 獲取包含 app=cassandra 標籤的所有 Pods 的 version 標籤
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 檢索帶有 “.” 鍵值，例： 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# 獲取所有工作節點（使用選擇器以排除標籤名稱為 'node-role.kubernetes.io/control-plane' 的結果）
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# 獲取當前名稱空間中正在執行的 Pods
kubectl get pods --field-selector=status.phase=Running

# 獲取全部節點的 ExternalIP 地址
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 列出屬於某個特定 RC 的 Pods 的名稱
# 在轉換對於 jsonpath 過於複雜的場合，"jq" 命令很有用；可以在 https://stedolan.github.io/jq/ 找到它。
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# 顯示所有 Pods 的標籤（或任何其他支援標籤的 Kubernetes 物件）
kubectl get pods --show-labels

# 檢查哪些節點處於就緒狀態
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# 不使用外部工具來輸出解碼後的 Secret
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# 列出被一個 Pod 使用的全部 Secret
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# 列舉所有 Pods 中初始化容器的容器 ID（containerID）
# 可用於在清理已停止的容器時避免刪除初始化容器
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# 列出事件（Events），按時間戳排序
kubectl get events --sort-by=.metadata.creationTimestamp

# 比較當前的叢集狀態和假定某清單被應用之後的叢集狀態
kubectl diff -f ./my-manifest.yaml

# 生成一個句點分隔的樹，其中包含為節點返回的所有鍵
# 在複雜的巢狀JSON結構中定位鍵時非常有用
kubectl get nodes -o json | jq -c 'paths|join(".")'

# 生成一個句點分隔的樹，其中包含為pod等返回的所有鍵
kubectl get pods -o json | jq -c 'paths|join(".")'

# 假設你的 Pods 有預設的容器和預設的名字空間，並且支援 'env' 命令，可以使用以下指令碼為所有 Pods 生成 ENV 變數。
# 該指令碼也可用於在所有的 Pods 裡執行任何受支援的命令，而不僅僅是 'env'。 
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# 獲取一個 Deployment 的 status 子資源
kubectl get deployment nginx-deployment --subresource=status
```

<!--
## Updating resources
-->
## 更新資源

<!--
```bash
kubectl set image deployment/frontend www=image:v2               # Rolling update "www" containers of "frontend" deployment, updating the image
kubectl rollout history deployment/frontend                      # Check the history of deployments including the revision
kubectl rollout undo deployment/frontend                         # Rollback to the previous deployment
kubectl rollout undo deployment/frontend --to-revision=2         # Rollback to a specific revision
kubectl rollout status -w deployment/frontend                    # Watch rolling update status of "frontend" deployment until completion
kubectl rollout restart deployment/frontend                      # Rolling restart of the "frontend" deployment

cat pod.json | kubectl replace -f -                              # Replace a pod based on the JSON passed into stdin

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
kubectl set image deployment/frontend www=image:v2               # 滾動更新 "frontend" Deployment 的 "www" 容器映象
kubectl rollout history deployment/frontend                      # 檢查 Deployment 的歷史記錄，包括版本
kubectl rollout undo deployment/frontend                         # 回滾到上次部署版本
kubectl rollout undo deployment/frontend --to-revision=2         # 回滾到特定部署版本
kubectl rollout status -w deployment/frontend                    # 監視 "frontend" Deployment 的滾動升級狀態直到完成
kubectl rollout restart deployment/frontend                      # 輪替重啟 "frontend" Deployment

cat pod.json | kubectl replace -f -                              # 透過傳入到標準輸入的 JSON 來替換 Pod

# 強制替換，刪除後重建資源。會導致服務不可用。
kubectl replace --force -f ./pod.json

# 為多副本的 nginx 建立服務，使用 80 埠提供服務，連線到容器的 8000 埠。
kubectl expose rc nginx --port=80 --target-port=8000

# 將某單容器 Pod 的映象版本（標籤）更新到 v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # 新增標籤
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # 添加註解
kubectl autoscale deployment foo --min=2 --max=10                # 對 "foo" Deployment 自動伸縮容
```

<!-- ## Patching resources -->
## 部分更新資源

<!--
```bash
# Partially update a node
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Update a container's image; spec.containers[*].name is required because it's a merge key
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Update a container's image using a json patch with positional arrays
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Disable a deployment livenessProbe using a json patch with positional arrays
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Add a new element to a positional array
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Update a deployment's replica count by patching it's scale subresource
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```
-->
```bash
# 部分更新某節點
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# 更新容器的映象；spec.containers[*].name 是必須的。因為它是一個合併性質的主鍵。
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# 使用帶位置陣列的 JSON patch 更新容器的映象
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# 使用帶位置陣列的 JSON patch 禁用某 Deployment 的 livenessProbe
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# 在帶位置陣列中新增元素
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# 透過修正 scale 子資源來更新 Deployment 的副本數
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

<!--
## Editing resources

Edit any API resource in your preferred editor.
-->
## 編輯資源

使用你偏愛的編輯器編輯 API 資源。

<!--
```bash
kubectl edit svc/docker-registry                      # Edit the service named docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Use an alternative editor
```
-->
```bash
kubectl edit svc/docker-registry                      # 編輯名為 docker-registry 的服務
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # 使用其他編輯器
```

<!--
## Scaling resources
-->
## 對資源進行伸縮

<!-- ```bash
kubectl scale --replicas=3 rs/foo                                 # Scale a replicaset named 'foo' to 3
kubectl scale --replicas=3 -f foo.yaml                            # Scale a resource specified in "foo.yaml" to 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # If the deployment named mysql's current size is 2, scale mysql to 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Scale multiple replication controllers
```
-->
```bash
kubectl scale --replicas=3 rs/foo                                 # 將名為 'foo' 的副本集伸縮到 3 副本
kubectl scale --replicas=3 -f foo.yaml                            # 將在 "foo.yaml" 中的特定資源伸縮到 3 個副本
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # 如果名為 mysql 的 Deployment 的副本當前是 2，那麼將它伸縮到 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 伸縮多個副本控制器
```

<!--
## Deleting resources
-->
## 刪除資源

<!-- ```bash
kubectl delete -f ./pod.json                                              # Delete a pod using the type and name specified in pod.json
kubectl delete pod,service baz foo                                        # Delete pods and services with same names "baz" and "foo"
kubectl delete pods,services -l name=myLabel                              # Delete pods and services with label name=myLabel
kubectl -n my-ns delete pod,svc --all                                      # Delete all pods and services in namespace my-ns,
# Delete all pods matching the awk pattern1 or pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```
-->
```bash
kubectl delete -f ./pod.json                                              # 刪除在 pod.json 中指定的型別和名稱的 Pod
kubectl delete pod,service baz foo                                        # 刪除名稱為 "baz" 和 "foo" 的 Pod 和服務
kubectl delete pods,services -l name=myLabel                              # 刪除包含 name=myLabel 標籤的 pods 和服務
kubectl -n my-ns delete pod,svc --all                                     # 刪除在 my-ns 名字空間中全部的 Pods 和服務
# 刪除所有與 pattern1 或 pattern2 awk 模式匹配的 Pods
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

<!--
## Interacting with running Pods
-->
## 與執行中的 Pods 進行互動

<!--
```bash
kubectl logs my-pod                                 # dump pod logs (stdout)
kubectl logs -l name=myLabel                        # dump pod logs, with label name=myLabel (stdout)
kubectl logs my-pod --previous                      # dump pod logs (stdout) for a previous instantiation of a container
kubectl logs my-pod -c my-container                 # dump pod container logs (stdout, multi-container case)
kubectl logs -l name=myLabel -c my-container        # dump pod logs, with label name=myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # dump pod container logs (stdout, multi-container case) for a previous instantiation of a container
kubectl logs -f my-pod                              # stream pod logs (stdout)
kubectl logs -f my-pod -c my-container              # stream pod container logs (stdout, multi-container case)
kubectl logs -f -l name=myLabel --all-containers    # stream all pods logs with label name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # Run pod as interactive shell
kubectl run nginx --image=nginx -n mynamespace      # Start a single instance of nginx pod in the namespace of mynamespace
kubectl run nginx --image=nginx                     # Run pod nginx and write its spec into a file called pod.yaml
--dry-run=client -o yaml > pod.yaml

kubectl attach my-pod -i                            # Attach to Running Container
kubectl port-forward my-pod 5000:6000               # Listen on port 5000 on the local machine and forward to port 6000 on my-pod
kubectl exec my-pod -- ls /                         # Run command in existing pod (1 container case)
kubectl exec --stdin --tty my-pod -- /bin/sh        # Interactive shell access to a running pod (1 container case) 
kubectl exec my-pod -c my-container -- ls /         # Run command in existing pod (multi-container case)
kubectl top pod POD_NAME --containers               # Show metrics for a given pod and its containers
kubectl top pod POD_NAME --sort-by=cpu              # Show metrics for a given pod and sort it by 'cpu' or 'memory'
```
-->
```bash
kubectl logs my-pod                                 # 獲取 pod 日誌（標準輸出）
kubectl logs -l name=myLabel                        # 獲取含 name=myLabel 標籤的 Pods 的日誌（標準輸出）
kubectl logs my-pod --previous                      # 獲取上個容器例項的 pod 日誌（標準輸出）
kubectl logs my-pod -c my-container                 # 獲取 Pod 容器的日誌（標準輸出, 多容器場景）
kubectl logs -l name=myLabel -c my-container        # 獲取含 name=myLabel 標籤的 Pod 容器日誌（標準輸出, 多容器場景）
kubectl logs my-pod -c my-container --previous      # 獲取 Pod 中某容器的上個例項的日誌（標準輸出, 多容器場景）
kubectl logs -f my-pod                              # 流式輸出 Pod 的日誌（標準輸出）
kubectl logs -f my-pod -c my-container              # 流式輸出 Pod 容器的日誌（標準輸出, 多容器場景）
kubectl logs -f -l name=myLabel --all-containers    # 流式輸出含 name=myLabel 標籤的 Pod 的所有日誌（標準輸出）
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # 以互動式 Shell 執行 Pod
kubectl run nginx --image=nginx -n mynamespace      # 在 “mynamespace” 名稱空間中執行單個 nginx Pod
kubectl run nginx --image=nginx                     # 執行 ngins Pod 並將其規約寫入到名為 pod.yaml 的檔案
  --dry-run=client -o yaml > pod.yaml

kubectl attach my-pod -i                            # 掛接到一個執行的容器中
kubectl port-forward my-pod 5000:6000               # 在本地計算機上偵聽埠 5000 並轉發到 my-pod 上的埠 6000
kubectl exec my-pod -- ls /                         # 在已有的 Pod 中執行命令（單容器場景）
kubectl exec --stdin --tty my-pod -- /bin/sh        # 使用互動 shell 訪問正在執行的 Pod (一個容器場景)
kubectl exec my-pod -c my-container -- ls /         # 在已有的 Pod 中執行命令（多容器場景）
kubectl top pod POD_NAME --containers               # 顯示給定 Pod 和其中容器的監控資料
kubectl top pod POD_NAME --sort-by=cpu              # 顯示給定 Pod 的指標並且按照 'cpu' 或者 'memory' 排序
```

<!--
## Copy files and directories to and from containers
-->
## 從容器中複製檔案和目錄

<!--
```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # Copy /tmp/foo_dir local directory to /tmp/bar_dir in a remote pod in the current namespace
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # Copy /tmp/foo local file to /tmp/bar in a remote pod in a specific container
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace my-namespace
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # Copy /tmp/foo from a remote pod to /tmp/bar locally
```
-->
```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # 將 /tmp/foo_dir 本地目錄複製到遠端當前名稱空間中 Pod 中的 /tmp/bar_dir
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # 將 /tmp/foo 本地檔案複製到遠端 Pod 中特定容器的 /tmp/bar 下
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # 將 /tmp/foo 本地檔案複製到遠端 “my-namespace” 名稱空間內指定 Pod 中的 /tmp/bar
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # 將 /tmp/foo 從遠端 Pod 複製到本地 /tmp/bar
```

<!--
`kubectl cp` requires that the 'tar' binary is present in your container image. If 'tar' is not present,`kubectl cp` will fail.
For advanced use cases, such as symlinks, wildcard expansion or file mode preservation consider using `kubectl exec`.
-->
{{< note >}}
`kubectl cp` 要求容器映象中存在 “tar” 二進位制檔案。如果 “tar” 不存在，`kubectl cp` 將失敗。
對於進階用例，例如符號連結、萬用字元擴充套件或保留檔案許可權，請考慮使用 `kubectl exec`。
{{< /note >}}

<!--
```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # Copy /tmp/foo from a remote pod to /tmp/bar locally
```
-->
```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar  # 將 /tmp/foo 本地檔案複製到遠端 “my-namespace” 名稱空間中 pod 中的 /tmp/bar
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # 將 /tmp/foo 從遠端 pod 複製到本地 /tmp/bar
<!--
## Interacting with Deployments and Services
-->
## 與 Deployments 和 Services 進行互動

<!--
```bash
kubectl logs deploy/my-deployment                         # dump Pod logs for a Deployment (single-container case)
kubectl logs deploy/my-deployment -c my-container         # dump Pod logs for a Deployment (multi-container case)

kubectl port-forward svc/my-service 5000                  # listen on local port 5000 and forward to port 5000 on Service backend
kubectl port-forward svc/my-service 5000:my-service-port  # listen on local port 5000 and forward to Service target port with name <my-service-port>

kubectl port-forward deploy/my-deployment 5000:6000       # listen on local port 5000 and forward to port 6000 on a Pod created by <my-deployment>
kubectl exec deploy/my-deployment -- ls                   # run command in first Pod and first container in Deployment (single- or multi-container cases)
```
-->
```bash
kubectl logs deploy/my-deployment                         # 獲取一個 Deployment 的 Pod 的日誌（單容器例子）
kubectl logs deploy/my-deployment -c my-container         # 獲取一個 Deployment 的 Pod 的日誌（多容器例子）

kubectl port-forward svc/my-service 5000                  # 偵聽本地埠 5000 並轉發到 Service 後端埠 5000
kubectl port-forward svc/my-service 5000:my-service-port  # 偵聽本地埠 5000 並轉發到名字為 <my-service-port> 的 Service 目標埠

kubectl port-forward deploy/my-deployment 5000:6000       # 偵聽本地埠 5000 並轉發到 <my-deployment> 建立的 Pod 裡的埠 6000
kubectl exec deploy/my-deployment -- ls                   # 在 Deployment 裡的第一個 Pod 的第一個容器裡執行命令（單容器和多容器例子）
```

<!--
## Interacting with Nodes and Cluster
-->
## 與節點和叢集進行互動

<!--
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
```bash
kubectl cordon my-node                                                # 標記 my-node 節點為不可排程
kubectl drain my-node                                                 # 對 my-node 節點進行清空操作，為節點維護做準備
kubectl uncordon my-node                                              # 標記 my-node 節點為可以排程
kubectl top node my-node                                              # 顯示給定節點的度量值
kubectl cluster-info                                                  # 顯示主控節點和服務的地址
kubectl cluster-info dump                                             # 將當前叢集狀態轉儲到標準輸出
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 將當前叢集狀態輸出到 /path/to/cluster-state

# 如果已存在具有指定鍵和效果的汙點，則替換其值為指定值。
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

<!--
### Resource types
-->
### 資源型別

<!--
List all supported resource types along with their shortnames, [API group](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), whether they are [namespaced](/docs/concepts/overview/working-with-objects/namespaces), and [Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects):
-->
列出所支援的全部資源型別和它們的簡稱、[API 組](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), 是否是[名字空間作用域](/zh-cn/docs/concepts/overview/working-with-objects/namespaces) 和 [Kind](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects)。

```bash
kubectl api-resources
```

<!--
Other operations for exploring API resources:
-->
用於探索 API 資源的其他操作：

<!--
```bash
kubectl api-resources --namespaced=true      # All namespaced resources
kubectl api-resources --namespaced=false     # All non-namespaced resources
kubectl api-resources -o name                # All resources with simple output (only the resource name)
kubectl api-resources -o wide                # All resources with expanded (aka "wide") output
kubectl api-resources --verbs=list,get       # All resources that support the "list" and "get" request verbs
kubectl api-resources --api-group=extensions # All resources in the "extensions" API group
```
-->
```bash
kubectl api-resources --namespaced=true      # 所有名稱空間作用域的資源
kubectl api-resources --namespaced=false     # 所有非名稱空間作用域的資源
kubectl api-resources -o name                # 用簡單格式列舉所有資源（僅顯示資源名稱）
kubectl api-resources -o wide                # 用擴充套件格式列舉所有資源（又稱 "wide" 格式）
kubectl api-resources --verbs=list,get       # 支援 "list" 和 "get" 請求動詞的所有資源
kubectl api-resources --api-group=extensions # "extensions" API 組中的所有資源
```

<!--
### Formatting output

To output details to your terminal window in a specific format, add the `-o` (or `--output`) flag to a supported `kubectl` command.
-->
### 格式化輸出

要以特定格式將詳細資訊輸出到終端視窗，將 `-o`（或者 `--output`）引數新增到支援的 `kubectl` 命令中。

<!--O
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
輸出格式      | 描述
--------------| -----------
`-o=custom-columns=<spec>` | 使用逗號分隔的自定義列來打印表格
`-o=custom-columns-file=<filename>` | 使用 `<filename>` 檔案中的自定義列模板打印表格
`-o=json`     | 輸出 JSON 格式的 API 物件
`-o=jsonpath=<template>` | 列印 [jsonpath](/zh-cn/docs/reference/kubectl/jsonpath) 表示式中定義的欄位
`-o=jsonpath-file=<filename>` | 列印在 `<filename>` 檔案中定義的 [jsonpath](/zh-cn/docs/reference/kubectl/jsonpath) 表示式所指定的欄位。
`-o=name`     | 僅列印資源名稱而不列印其他內容
`-o=wide`     | 以純文字格式輸出額外資訊，對於 Pod 來說，輸出中包含了節點名稱
`-o=yaml`     | 輸出 YAML 格式的 API 物件

<!--
Examples using `-o=custom-columns`:

```bash
# All images running in a cluster
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# All images running in namespace: default, grouped by Pod
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

# All images excluding "k8s.gcr.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="k8s.gcr.io/coredns:1.6.2")].image'

# All fields under metadata regardless of name
kubectl get pods -A -o=custom-columns='DATA:metadata.*'

More examples in the kubectl [reference documentation](/docs/reference/kubectl/#custom-columns).
```
-->
使用 `-o=custom-columns` 的示例：

```bash
# 叢集中執行著的所有映象
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# 列舉 default 名字空間中執行的所有映象，按 Pod 分組
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

# 除 "k8s.gcr.io/coredns:1.6.2" 之外的所有映象
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="k8s.gcr.io/coredns:1.6.2")].image'

# 輸出 metadata 下面的所有欄位，無論 Pod 名字為何
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

有關更多示例，請參看 kubectl [參考文件](/zh-cn/docs/reference/kubectl/#custom-columns)。

<!--
### Kubectl output verbosity and debugging

Kubectl verbosity is controlled with the `-v` or `--v` flags followed by an integer representing the log level. General Kubernetes logging conventions and the associated log levels are described [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).
-->
### Kubectl 日誌輸出詳細程度和除錯

Kubectl 日誌輸出詳細程度是透過 `-v` 或者 `--v` 來控制的，引數後跟一個數字表示日誌的級別。
Kubernetes 通用的日誌習慣和相關的日誌級別在
[這裡](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md) 有相應的描述。

<!--
Verbosity | Description
--------------| -----------
`--v=0` | Generally useful for this to *always* be visible to a cluster operator.
`--v=1` | A reasonable default log level if you don't want verbosity.
`--v=2` | Useful steady state information about the service and important log messages that may correlate to significant changes in the system. This is the recommended default log level for most systems.
`--v=3` | Extended information about changes.
`--v=4` | Debug level verbosity.
`--v=5` | Trace level verbosity.
`--v=6` | Display requested resources.
`--v=7` | Display HTTP request headers.
`--v=8` | Display HTTP request contents.
`--v=9` | Display HTTP request contents without truncation of contents.
-->
詳細程度      | 描述
--------------| -----------
`--v=0` | 用於那些應該 *始終* 對運維人員可見的資訊，因為這些資訊一般很有用。
`--v=1` | 如果您不想要看到冗餘資訊，此值是一個合理的預設日誌級別。
`--v=2` | 輸出有關服務的穩定狀態的資訊以及重要的日誌訊息，這些資訊可能與系統中的重大變化有關。這是建議大多數系統設定的預設日誌級別。
`--v=3` | 包含有關係統狀態變化的擴充套件資訊。
`--v=4` | 包含除錯級別的冗餘資訊。
`--v=5` | 跟蹤級別的詳細程度。
`--v=6` | 顯示所請求的資源。
`--v=7` | 顯示 HTTP 請求頭。
`--v=8` | 顯示 HTTP 請求內容。
`--v=9` | 顯示 HTTP 請求內容而且不截斷內容。

## {{% heading "whatsnext" %}}

<!--

* Read the [kubectl overview](/docs/reference/kubectl/) and learn about [JsonPath](/docs/reference/kubectl/jsonpath).

* See [kubectl](/docs/reference/kubectl/kubectl/) options.

* Also read [kubectl Usage Conventions](/docs/reference/kubectl/conventions/) to understand how to use kubectl in reusable scripts.

* See more community [kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).
-->
* 參閱 [kubectl 概述](/zh-cn/docs/reference/kubectl/)，進一步瞭解 [JsonPath](/zh-cn/docs/reference/kubectl/jsonpath)。
* 參閱 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 選項。
* 參閱 [kubectl 使用約定](/zh-cn/docs/reference/kubectl/conventions/)來理解如何在可複用的指令碼中使用它。
* 檢視社群中其他的 [kubectl 備忘單](https://github.com/dennyzhang/cheatsheet-kubernetes-A4)。
