---
title: 創建靜態 Pod
weight: 220
content_type: task
---
<!--
reviewers:
- jsafrane
title: Create static Pods
weight: 220
content_type: task
-->

<!-- overview -->

<!--
*Static Pods* are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
instead, the kubelet watches each static Pod (and restarts it if it fails).
-->
**靜態 Pod** 在指定的節點上由 kubelet 守護進程直接管理，不需要
{{< glossary_tooltip text="API 服務器" term_id="kube-apiserver" >}}監管。
與由控制面管理的 Pod（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
不同；kubelet 監視每個靜態 Pod（在它失敗之後重新啓動）。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.
-->
靜態 Pod 始終都會綁定到特定節點的 {{< glossary_tooltip term_id="kubelet" >}} 上。

kubelet 會嘗試通過 Kubernetes API 服務器爲每個靜態 Pod
自動創建一個{{< glossary_tooltip text="鏡像 Pod" term_id="mirror-pod" >}}。
這意味着節點上運行的靜態 Pod 對 API 服務來說是可見的，但是不能通過 API 服務器來控制。
Pod 名稱將把以連字符開頭的節點主機名作爲後綴。

{{< note >}}
<!--
If you are running clustered Kubernetes and are using static
Pods to run a Pod on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} instead.
-->
如果你在運行一個 Kubernetes 集羣，並且在每個節點上都運行一個靜態 Pod，
就可能需要考慮使用 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
替代這種方式。
{{< /note >}}

{{< note >}}
<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->
靜態 Pod 的 `spec` 不能引用其他 API 對象
（如：{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、
{{< glossary_tooltip text="Secret" term_id="secret" >}} 等）。
{{< /note >}}

{{< note >}}
<!--
Static pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
-->
靜態 Pod 不支持[臨時容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This page assumes you're using {{< glossary_tooltip term_id="cri-o" >}} to run Pods,
and that your nodes are running the Fedora operating system.
Instructions for other distributions or Kubernetes installations may vary.
-->
本文假定你在使用 {{< glossary_tooltip term_id="docker" >}} 來運行 Pod，
並且你的節點是運行着 Fedora 操作系統。
其它發行版或者 Kubernetes 部署版本上操作方式可能不一樣。

<!-- steps -->

<!--
## Create a static pod {#static-pod-creation}

You can configure a static Pod with either a
[file system hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#configuration-files)
or a [web hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).
-->
## 創建靜態 Pod {#static-pod-creation}

可以通過[文件系統上的配置文件](/zh-cn/docs/tasks/configure-pod-container/static-pod/#configuration-files)或者
[Web 網絡上的配置文件](/zh-cn/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http)來配置靜態 Pod。

<!--
### Filesystem-hosted static Pod manifest {#configuration-files}

Manifests are standard Pod definitions in JSON or YAML format in a specific directory.
Use the `staticPodPath: <the directory>` field in the
[kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/),
which periodically scans the directory and creates/deletes static Pods as YAML/JSON files appear/disappear there.
Note that the kubelet will ignore files starting with dots when scanning the specified directory.

For example, this is how to start a simple web server as a static Pod:
-->
### 文件系統上的靜態 Pod 聲明文件 {#configuration-files}

聲明文件是標準的 Pod 定義文件，以 JSON 或者 YAML 格式存儲在指定目錄。路徑設置在
[Kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)的
`staticPodPath: <目錄>` 字段，kubelet 會定期的掃描這個文件夾下的 YAML/JSON
文件來創建/刪除靜態 Pod。
注意 kubelet 掃描目錄的時候會忽略以點開頭的文件。

例如：下面是如何以靜態 Pod 的方式啓動一個簡單 web 服務：

<!--
1. Choose a node where you want to run the static Pod. In this example, it's `my-node1`.
-->
1. 選擇一個要運行靜態 Pod 的節點。在這個例子中選擇 `my-node1`。

   ```shell
   ssh my-node1
   ```

<!--
1. Choose a directory, say `/etc/kubernetes/manifests` and place a web server
   Pod definition there, for example `/etc/kubernetes/manifests/static-web.yaml`:

   # Run this command on the node where kubelet is running
-->
2. 選擇一個目錄，比如在 `/etc/kubernetes/manifests` 目錄來保存 Web 服務 Pod 的定義文件，例如
   `/etc/kubernetes/manifests/static-web.yaml`：

   ```shell
   # 在 kubelet 運行的節點上執行以下命令
   mkdir -p /etc/kubernetes/manifests/
   cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   EOF
   ```

<!--
1. Configure the kubelet on that node to set a `staticPodPath` value in the
   [kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/).  
   See [Set Kubelet Parameters Via A Configuration File](/docs/tasks/administer-cluster/kubelet-config-file/)
   for more information.

   An alternative and deprecated method is to configure the kubelet on that node
   to look for static Pod manifests locally, using a command line argument.
   To use the deprecated approach, start the kubelet with the
   `--pod-manifest-path=/etc/kubernetes/manifests/` argument.
-->
3. 在該節點上配置 kubelet，在 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中設定 `staticPodPath` 值。
   欲瞭解更多信息，請參考[通過配置文件設定 kubelet 參數](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。

   另一個已棄用的方法是，在該節點上通過命令行參數配置 kubelet，以便從本地查找靜態 Pod 清單。
   若使用這種棄用的方法，請啓動 kubelet 時加上 `--pod-manifest-path=/etc/kubernetes/manifests/` 參數。
<!--
1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```
-->
4. 重啓 kubelet。在 Fedora 上，你將使用下面的命令：

   ```shell
   # 在 kubelet 運行的節點上執行以下命令
   systemctl restart kubelet
   ```

<!--
### Web-hosted static pod manifest {#pods-created-via-http}

Kubelet periodically downloads a file specified by `--manifest-url=<URL>` argument
and interprets it as a JSON/YAML file that contains Pod definitions.
Similar to how [filesystem-hosted manifests](#configuration-files) work, the kubelet
refetches the manifest on a schedule. If there are changes to the list of static
Pods, the kubelet applies them.

To use this approach:
-->
### Web 網上的靜態 Pod 聲明文件 {#pods-created-via-http}

Kubelet 根據 `--manifest-url=<URL>` 參數的配置定期的下載指定文件，並且轉換成
JSON/YAML 格式的 Pod 定義文件。
與[文件系統上的清單文件](#configuration-files)使用方式類似，kubelet 調度獲取清單文件。
如果靜態 Pod 的清單文件有改變，kubelet 會應用這些改變。

按照下面的方式來：

<!--
1. Create a YAML file and store it on a web server so that you can pass the URL of that file to the kubelet.
-->
1. 創建一個 YAML 文件，並保存在 Web 服務器上，這樣你就可以將該文件的 URL 傳遞給 kubelet。

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   ```

<!--
1. Configure the kubelet on your selected node to use this web manifest by
   running it with `--manifest-url=<manifest-url>`.
   On Fedora, edit `/etc/kubernetes/kubelet` to include this line:
-->
2. 通過在選擇的節點上使用 `--manifest-url=<manifest-url>` 配置運行 kubelet。
   在 Fedora 添加下面這行到 `/etc/kubernetes/kubelet`：

   ```shell
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
   ```

<!--
1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```
-->
3. 重啓 kubelet。在 Fedora 上，你將運行如下命令：

   ```shell
   # 在 kubelet 運行的節點上執行以下命令
   systemctl restart kubelet
   ```

<!--
## Observe static pod behavior {#behavior-of-static-pods}

When the kubelet starts, it automatically starts all defined static Pods. As you have
defined a static Pod and restarted the kubelet, the new static Pod should
already be running.

You can view running containers (including static Pods) by running (on the node):
```shell
# Run this command on the node where the kubelet is running
crictl ps
```
-->
## 觀察靜態 Pod 的行爲 {#behavior-of-static-pods}

當 kubelet 啓動時，會自動啓動所有定義的靜態 Pod。
當定義了一個靜態 Pod 並重新啓動 kubelet 時，新的靜態 Pod 就應該已經在運行了。

可以在節點上運行下面的命令來查看正在運行的容器（包括靜態 Pod）：

```shell
# 在 kubelet 運行的節點上執行以下命令
crictl ps
```

<!--
The output might be something like:
-->
輸出可能會像這樣：

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
<!--
`crictl` outputs the image URI and SHA-256 checksum. `NAME` will look more like:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
-->
`crictl` 會輸出鏡像 URI 和 SHA-256 校驗和。`NAME` 看起來像：
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`。
{{< /note >}}

<!--
You can see the mirror Pod on the API server:
-->
可以在 API 服務上看到鏡像 Pod：

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
<!--
Make sure the kubelet has permission to create the mirror Pod in the API server.
If not, the creation request is rejected by the API server.
-->
要確保 kubelet 在 API 服務上有創建鏡像 Pod 的權限。如果沒有，創建請求會被 API 服務拒絕。
{{< /note >}}

<!--
{{< glossary_tooltip term_id="label" text="Labels" >}} from the static Pod are
propagated into the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.
-->
靜態 Pod 上的{{< glossary_tooltip term_id="label" text="標籤" >}}被傳播到鏡像 Pod。
你可以通過{{< glossary_tooltip term_id="selector" text="選擇算符" >}}使用這些標籤。

<!--
If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _doesn't_ remove the static Pod:
-->
如果你用 `kubectl` 從 API 服務上刪除鏡像 Pod，kubelet **不會**移除靜態 Pod：

```shell
kubectl delete pod static-web-my-node1
```

```console
pod "static-web-my-node1" deleted
```

<!--
You can see that the Pod is still running:
-->
可以看到 Pod 還在運行：

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

<!--
Back on your node where the kubelet is running, you can try to stop the container manually.
You'll see that, after a time, the kubelet will notice and will restart the Pod
automatically:

```shell
# Run these commands on the node where the kubelet is running
crictl stop 129fd7d382018 # replace with the ID of your container
sleep 20
crictl ps
```
-->
回到 kubelet 運行所在的節點上，你可以手動停止容器。
可以看到過了一段時間後 kubelet 會發現容器停止了並且會自動重啓 Pod：

```shell
# 在 kubelet 運行的節點上執行以下命令
# 把 ID 換爲你的容器的 ID
crictl stop 129fd7d382018
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

<!--
Once you identify the right container, you can get the logs for that container with `crictl`:

```shell
# Run these commands on the node where the container is running
crictl logs <container_id>
```
-->
一旦你找到合適的容器，你就可以使用 `crictl` 獲取該容器的日誌。

```shell
# 在容器運行所在的節點上執行以下命令
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

<!--
To find more about how to debug using `crictl`, please visit
[_Debugging Kubernetes nodes with crictl_](/docs/tasks/debug/debug-cluster/crictl/).
-->
若要找到如何使用 `crictl` 進行調試的更多信息，
請訪問[使用 crictl 對 Kubernetes 節點進行調試](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## Dynamic addition and removal of static pods

The running kubelet periodically scans the configured directory
(`/etc/kubernetes/manifests` in our example) for changes and
adds/removes Pods as files appear/disappear in this directory.
-->
## 動態增加和刪除靜態 Pod  {#dynamic-addition-and-removal-of-static-pods}

運行中的 kubelet 會定期掃描配置的目錄（比如例子中的 `/etc/kubernetes/manifests` 目錄）中的變化，
並且根據文件中出現/消失的 Pod 來添加/刪除 Pod。

<!--
```shell
# This assumes you are using filesystem-hosted static Pod configuration
# Run these commands on the node where the container is running
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```
-->
```shell
# 這裏假定你在用主機文件系統上的靜態 Pod 配置文件
# 在容器運行所在的節點上執行以下命令
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# 可以看到沒有 nginx 容器在運行
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

## {{% heading "whatsnext" %}}

<!--
* [Generate static Pod manifests for control plane components](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [Generate static Pod manifest for local etcd](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Debugging Kubernetes nodes with `crictl`](/docs/tasks/debug/debug-cluster/crictl/)
* [Learn more about `crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [Map `docker` CLI commands to `crictl`](/docs/reference/tools/map-crictl-dockercli/)
* [Set up etcd instances as static pods managed by a kubelet](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
-->
* [爲控制面組件生成靜態 Pod 清單](/zh-cn/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [爲本地 etcd 生成靜態 Pod 清單](/zh-cn/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [使用 `crictl` 對 Kubernetes 節點進行調試](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)
* 更多細節請參閱 [`crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [從 `docker` CLI 命令映射到 `crictl`](/zh-cn/docs/reference/tools/map-crictl-dockercli/)
* [將 etcd 實例設置爲由 kubelet 管理的靜態 Pod](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
