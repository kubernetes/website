---
title: 建立靜態 Pod
weight: 170
content_type: task
---

<!-- overview -->

<!--
*Static Pods* are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
instead, the kubelet watches each static Pod (and restarts it if it crashes).
-->

*靜態 Pod* 在指定的節點上由 kubelet 守護程序直接管理，不需要
{{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}} 監管。
與由控制面管理的 Pod（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
不同；kubelet 監視每個靜態 Pod（在它崩潰之後重新啟動）。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.

{{< note >}}
If you are running clustered Kubernetes and are using static
Pods to run a Pod on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
instead.
{{< /note >}}
-->
靜態 Pod 永遠都會繫結到一個指定節點上的 {{< glossary_tooltip term_id="kubelet" >}}。

kubelet 會嘗試透過 Kubernetes API 伺服器為每個靜態 Pod 自動建立一個
{{< glossary_tooltip text="映象 Pod" term_id="mirror-pod" >}}。
這意味著節點上執行的靜態 Pod 對 API 服務來說是可見的，但是不能透過 API 伺服器來控制。
Pod 名稱將把以連字元開頭的節點主機名作為字尾。

{{< note >}}
如果你在執行一個 Kubernetes 叢集，並且在每個節點上都執行一個靜態 Pod，
就可能需要考慮使用 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} 替代這種方式。
{{< /note >}}

<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->

{{< note >}}
靜態 Pod 的 `spec` 不能引用其他 API 物件
（如：{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、
{{< glossary_tooltip text="Secret" term_id="secret" >}} 等）。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This page assumes you're using {{< glossary_tooltip term_id="cri-o" >}} to run Pods,
and that your nodes are running the Fedora operating system.
Instructions for other distributions or Kubernetes installations may vary.
-->
本文假定你在使用 {{< glossary_tooltip term_id="docker" >}} 來執行 Pod，
並且你的節點是執行著 Fedora 作業系統。
其它發行版或者 Kubernetes 部署版本上操作方式可能不一樣。

<!-- steps -->

<!--
## Create a static pod {#static-pod-creation}

You can configure a static Pod with either a [file system hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#configuration-files) or a [web hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).
-->
## 建立靜態 Pod {#static-pod-creation}

可以透過[檔案系統上的配置檔案](/zh-cn/docs/tasks/configure-pod-container/static-pod/#configuration-files)
或者 [web 網路上的配置檔案](/zh-cn/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http)
來配置靜態 Pod。

<!--
### Filesystem-hosted static Pod manifest {#configuration-files}

Manifests are standard Pod definitions in JSON or YAML format in a specific directory. Use the `staticPodPath: <the directory>` field in the
[kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/),
which periodically scans the directory and creates/deletes static Pods as YAML/JSON files appear/disappear there.
Note that the kubelet will ignore files starting with dots when scanning the specified directory.

For example, this is how to start a simple web server as a static Pod:
-->
### 檔案系統上的靜態 Pod 宣告檔案 {#configuration-files}

宣告檔案是標準的 Pod 定義檔案，以 JSON 或者 YAML 格式儲存在指定目錄。路徑設定在
[Kubelet 配置檔案](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
的 `staticPodPath: <目錄>` 欄位，kubelet 會定期的掃描這個資料夾下的 YAML/JSON
檔案來建立/刪除靜態 Pod。
注意 kubelet 掃描目錄的時候會忽略以點開頭的檔案。

例如：下面是如何以靜態 Pod 的方式啟動一個簡單 web 服務：

<!--
1. Choose a node where you want to run the static Pod. In this example, it's `my-node1`.
-->

1. 選擇一個要執行靜態 Pod 的節點。在這個例子中選擇 `my-node1`。

   ```shell
   ssh my-node1
   ```
<!--
2. Choose a directory, say `/etc/kubelet.d` and place a web server Pod definition there, e.g. `/etc/kubelet.d/static-web.yaml`:

   ```shell
    # Run this command on the node where kubelet is running
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
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
-->
2. 選擇一個目錄，比如在 `/etc/kubelet.d` 目錄來儲存 web 服務 Pod 的定義檔案，
   `/etc/kubelet.d/static-web.yaml`：

   ```shell
   # 在 kubelet 執行的節點上執行以下命令
   mkdir /etc/kubelet.d/
   cat <<EOF >/etc/kubelet.d/static-web.yaml
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
3. Configure your kubelet on the node to use this directory by running it with `--pod-manifest-path=/etc/kubelet.d/` argument. On Fedora edit `/etc/kubernetes/kubelet` to include this line:

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
   ```
   or add the `staticPodPath: <the directory>` field in the
   [kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
3. 配置這個節點上的 kubelet，使用這個引數執行 `--pod-manifest-path=/etc/kubelet.d/`。
在 Fedora 上編輯 `/etc/kubernetes/kubelet` 以包含下行：

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
   ```
   或者在 [Kubelet 配置檔案](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
   中新增 `staticPodPath: <目錄>`欄位。

<!--
4. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```
-->
4. 重啟 kubelet。Fedora 上使用下面的命令：

   ```shell
   # 在 kubelet 執行的節點上執行以下命令
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
### Web 網上的靜態 Pod 宣告檔案 {#pods-created-via-http}

Kubelet 根據 `--manifest-url=<URL>` 引數的配置定期的下載指定檔案，並且轉換成
JSON/YAML 格式的 Pod 定義檔案。
與[檔案系統上的清單檔案](#configuration-files)使用方式類似，kubelet 排程獲取清單檔案。
如果靜態 Pod 的清單檔案有改變，kubelet 會應用這些改變。

按照下面的方式來：

<!--
1. Create a YAML file and store it on a web server so that you can pass the URL of that file to the kubelet.
-->
1. 建立一個 YAML 檔案，並儲存在 web 服務上，為 kubelet 生成一個 URL。

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
2. Configure the kubelet on your selected node to use this web manifest by running it with `--manifest-url=<manifest-url>`. On Fedora, edit `/etc/kubernetes/kubelet` to include this line:
-->
2. 透過在選擇的節點上使用 `--manifest-url=<manifest-url>` 配置執行 kubelet。
   在 Fedora 新增下面這行到 `/etc/kubernetes/kubelet` ：

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
   ```
<!--
3. Restart the kubelet. On Fedora, you would run:

    ```shell
    # Run this command on the node where the kubelet is running
    systemctl restart kubelet
    ```
-->
3. 重啟 kubelet。在 Fedora 上執行如下命令：

   ```shell
   # 在 kubelet 執行的節點上執行以下命令
   systemctl restart kubelet
   ```

<!--
## Observe static pod behavior {#behavior-of-static-pods}

When the kubelet starts, it automatically starts all defined static Pods. As you have
defined a static Pod and restarted the kubelet, the new static Pod should
already be running.

You can view running containers (including static Pods) by running (on the node):
```shell
# Run this command on the node where kubelet is running
crictl ps
```

The output might be something like:
-->
## 觀察靜態 pod 的行為 {#behavior-of-static-pods}

當 kubelet 啟動時，會自動啟動所有定義的靜態 Pod。
當定義了一個靜態 Pod 並重新啟動 kubelet 時，新的靜態 Pod 就應該已經在運行了。

可以在節點上執行下面的命令來檢視正在執行的容器（包括靜態 Pod）：

```shell
# 在 kubelet 執行的節點上執行以下命令
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

<!--
`crictl` outputs the image URI and SHA-256 checksum. `NAME` will look more like:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
-->
{{< note >}}
`crictl` 會輸出映象 URI 和 SHA-256 校驗和。 `NAME` 看起來像：
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`。
{{< /note >}}

<!--
You can see the mirror Pod on the API server:
-->
可以在 API 服務上看到映象 Pod：

```shell
kubectl get pods
```

```
NAME         READY   STATUS    RESTARTS        AGE
static-web   1/1     Running   0               2m
```

<!--
Make sure the kubelet has permission to create the mirror Pod in the API server. If not, the creation request is rejected by the API server. See
[Pod Security admission](/docs/concepts/security/pod-security-admission) and [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/).
-->
{{< note >}}
要確保 kubelet 在 API 服務上有建立映象 Pod 的許可權。如果沒有，建立請求會被 API 服務拒絕。
可以看 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)和 [Pod 安全策略](/zh-cn/docs/concepts/security/pod-security-policy/)。
{{< /note >}}

<!--
{{< glossary_tooltip term_id="label" text="Labels" >}} from the static Pod are
propagated into the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.
-->
靜態 Pod 上的{{< glossary_tooltip term_id="label" text="標籤" >}} 被傳到映象 Pod。
你可以透過 {{< glossary_tooltip term_id="selector" text="選擇算符" >}} 使用這些標籤。

<!--
If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _doesn't_ remove the static Pod:
-->
如果你用 `kubectl` 從 API 服務上刪除映象 Pod，kubelet _不會_ 移除靜態 Pod：

```shell
kubectl delete pod static-web
```
```
pod "static-web" deleted
```

<!--
You can see that the Pod is still running:
-->
可以看到 Pod 還在執行：

```shell
kubectl get pods
```

```
NAME         READY   STATUS    RESTARTS   AGE
static-web   1/1     Running   0          4s
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
回到 kubelet 執行的節點上，你可以手動停止容器。
可以看到過了一段時間後 kubelet 會發現容器停止了並且會自動重啟 Pod：

```shell
# 在 kubelet 執行的節點上執行以下命令
# 把 ID 換為你的容器的 ID
crictl stop 129fd7d382018
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

<!--
## Dynamic addition and removal of static pods

The running kubelet periodically scans the configured directory (`/etc/kubelet.d` in our example) for changes and adds/removes Pods as files appear/disappear in this directory.

```shell
# This assumes you are using filesystem-hosted static Pod configuration
# Run these commands on the node where the kubelet is running
#
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
crictl ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
crictl ps
```
-->
## 動態增加和刪除靜態 pod

執行中的 kubelet 會定期掃描配置的目錄(比如例子中的 `/etc/kubelet.d` 目錄)中的變化，
並且根據檔案中出現/消失的 Pod 來新增/刪除 Pod。

```shell
# 前提是你在用主機檔案系統上的靜態 Pod 配置檔案
# 在 kubelet 執行的節點上執行以下命令
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
crictl ps
# 可以看到沒有 nginx 容器在執行
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```



