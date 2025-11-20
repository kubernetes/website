---
title: 設定 Pod 以使用 PersistentVolume 作爲儲存
content_type: task
weight: 90
---
<!--
title: Configure a Pod to Use a PersistentVolume for Storage
content_type: task
weight: 90
-->

<!-- overview -->

<!--
This page shows you how to configure a Pod to use a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
for storage.
Here is a summary of the process:

1. You, as cluster administrator, create a PersistentVolume backed by physical
   storage. You do not associate the volume with any Pod.

1. You, now taking the role of a developer / cluster user, create a
   PersistentVolumeClaim that is automatically bound to a suitable
   PersistentVolume.

1. You create a Pod that uses the above PersistentVolumeClaim for storage.
-->
本文將向你介紹如何設定 Pod 使用
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
作爲儲存。
以下是該過程的總結：

1. 你作爲叢集管理員創建由物理儲存支持的 PersistentVolume。你不會將該卷與任何 Pod 關聯。

1. 你現在以開發人員或者叢集使用者的角色創建一個 PersistentVolumeClaim，
   它將自動綁定到合適的 PersistentVolume。

1. 你創建一個使用以上 PersistentVolumeClaim 作爲儲存的 Pod。

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster that has only one Node, and the
  {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
  command-line tool must be configured to communicate with your cluster. If you
  do not already have a single-node cluster, you can create one by using
  [Minikube](https://minikube.sigs.k8s.io/docs/).

* Familiarize yourself with the material in
  [Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
-->
* 你需要一個包含單個節點的 Kubernetes 叢集，並且必須設定
  {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 命令列工具以便與叢集交互。
  如果還沒有單節點叢集，可以使用
  [Minikube](https://minikube.sigs.k8s.io/docs/) 創建一個。

* 熟悉[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)文檔。

<!-- steps -->

<!--
## Create an index.html file on your Node

Open a shell to the single Node in your cluster. How you open a shell depends
on how you set up your cluster. For example, if you are using Minikube, you
can open a shell to your Node by entering `minikube ssh`.

In your shell on that Node, create a `/mnt/data` directory:
-->
## 在你的節點上創建一個 index.html 檔案  {#create-an-index-file-on-your-node}

打開叢集中的某個節點的 Shell。
如何打開 Shell 取決於叢集的設置。
例如，如果你正在使用 Minikube，那麼可以通過輸入 `minikube ssh` 來打開節點的 Shell。

在該節點的 Shell 中，創建一個 `/mnt/data` 目錄：

<!--
# This assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 這裏假定你的節點使用 "sudo" 來以超級用戶角色執行命令
sudo mkdir /mnt/data
```

<!--
In the `/mnt/data` directory, create an `index.html` file:
-->
在 `/mnt/data` 目錄中創建一個 index.html 檔案：

<!--
# This again assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 這裏再次假定你的節點使用 "sudo" 來以超級用戶角色執行命令
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
<!--
If your Node uses a tool for superuser access other than `sudo`, you can
usually make this work if you replace `sudo` with the name of the other tool.
-->
如果你的節點使用某工具而不是 `sudo` 來完成超級使用者訪問，你可以將上述命令中的 `sudo` 替換爲該工具的名稱。
{{< /note >}}

<!--
Test that the `index.html` file exists:
-->
測試 `index.html` 檔案確實存在：

```shell
cat /mnt/data/index.html
```

<!-- 
The output should be:
-->
輸出應該是：

```
Hello from Kubernetes storage
```

<!--
You can now close the shell to your Node.
-->
現在你可以關閉節點的 Shell 了。

<!--
## Create a PersistentVolume

In this exercise, you create a *hostPath* PersistentVolume. Kubernetes supports
hostPath for development and testing on a single-node cluster. A hostPath
PersistentVolume uses a file or directory on the Node to emulate network-attached storage.
-->
## 創建 PersistentVolume   {#create-a-pv}

在本練習中，你將創建一個 **hostPath** 類型的 PersistentVolume。
Kubernetes 支持用於在單節點叢集上開發和測試的 hostPath 類型的 PersistentVolume。
hostPath 類型的 PersistentVolume 使用節點上的檔案或目錄來模擬網路附加儲存。

<!--
In a production cluster, you would not use hostPath. Instead a cluster administrator
would provision a network resource like a Google Compute Engine persistent disk,
an NFS share, or an Amazon Elastic Block Store volume. Cluster administrators can also
use [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
to set up
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/).

Here is the configuration file for the hostPath PersistentVolume:
-->
在生產叢集中，你不會使用 hostPath。
叢集管理員會提供網路儲存資源，比如 Google Compute Engine 持久盤卷、NFS 共享卷或 Amazon Elastic Block Store 卷。
叢集管理員還可以使用
[StorageClass](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
來設置[動態製備儲存](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。

下面是 hostPath PersistentVolume 的設定檔案：

{{% code_sample file="pods/storage/pv-volume.yaml" %}}

<!--
The configuration file specifies that the volume is at `/mnt/data` on the
cluster's Node. The configuration also specifies a size of 10 gibibytes and
an access mode of `ReadWriteOnce`, which means the volume can be mounted as
read-write by a single Node. It defines the [StorageClass name](/docs/concepts/storage/persistent-volumes/#class)
`manual` for the PersistentVolume, which will be used to bind
PersistentVolumeClaim requests to this PersistentVolume.
-->
此設定檔案指定卷位於叢集節點上的 `/mnt/data` 路徑。
其設定還指定了卷的容量大小爲 10 GB，訪問模式爲 `ReadWriteOnce`，
這意味着該卷可以被單個節點以讀寫方式安裝。
此設定檔案還在 PersistentVolume 中定義了
[StorageClass 的名稱](/zh-cn/docs/concepts/storage/persistent-volumes/#class)爲 `manual`。
它將用於將 PersistentVolumeClaim 的請求綁定到此 PersistentVolume。

{{< note >}}
<!--
This example uses the `ReadWriteOnce` access mode, for simplicity. For
production use, the Kubernetes project recommends using the `ReadWriteOncePod`
access mode instead.
-->
爲了簡化，本示例採用了 `ReadWriteOnce` 訪問模式。然而對於生產環境，
Kubernetes 項目建議改用 `ReadWriteOncePod` 訪問模式。
{{< /note >}}

<!--
Create the PersistentVolume:
-->
創建 PersistentVolume：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

<!--
View information about the PersistentVolume:
-->
查看 PersistentVolume 的資訊：

```shell
kubectl get pv task-pv-volume
```

<!--
The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.
-->
輸出結果顯示該 PersistentVolume 的`狀態（STATUS）`爲 `Available`。
這意味着它還沒有被綁定給 PersistentVolumeClaim。

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s
```

<!--
## Create a PersistentVolumeClaim

The next step is to create a PersistentVolumeClaim. Pods use PersistentVolumeClaims
to request physical storage. In this exercise, you create a PersistentVolumeClaim
that requests a volume of at least three gibibytes that can provide read-write
access for at most one Node at a time.

Here is the configuration file for the PersistentVolumeClaim:
-->
## 創建 PersistentVolumeClaim   {#create-a-pvc}

下一步是創建一個 PersistentVolumeClaim。
Pod 使用 PersistentVolumeClaim 來請求物理儲存。
在本練習中，你將創建一個 PersistentVolumeClaim，它請求至少 3 GB 容量的卷，
該卷一次最多可以爲一個節點提供讀寫訪問。

下面是 PersistentVolumeClaim 的設定檔案：

{{% code_sample file="pods/storage/pv-claim.yaml" %}}

<!--
Create the PersistentVolumeClaim:
-->
創建 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

<!--
After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:
-->
創建 PersistentVolumeClaim 之後，Kubernetes 控制平面將查找滿足申領要求的 PersistentVolume。
如果控制平面找到具有相同 StorageClass 的適當的 PersistentVolume，
則將 PersistentVolumeClaim 綁定到該 PersistentVolume 上。

再次查看 PersistentVolume 資訊：

```shell
kubectl get pv task-pv-volume
```

<!--
Now the output shows a `STATUS` of `Bound`.
-->
現在輸出的 `STATUS` 爲 `Bound`。

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

<!--
Look at the PersistentVolumeClaim:
-->
查看 PersistentVolumeClaim：

```shell
kubectl get pvc task-pv-claim
```

<!--
The output shows that the PersistentVolumeClaim is bound to your PersistentVolume,
`task-pv-volume`.
-->
輸出結果表明該 PersistentVolumeClaim 綁定了你的 PersistentVolume `task-pv-volume`。

```
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

<!--
## Create a Pod

The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.

Here is the configuration file for the Pod:
-->
## 創建 Pod   {#create-a-pod}

下一步是創建一個使用你的 PersistentVolumeClaim 作爲儲存卷的 Pod。

下面是此 Pod 的設定檔案：

{{% code_sample file="pods/storage/pv-pod.yaml" %}}

<!--
Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Create the Pod:
-->
注意 Pod 的設定檔案指定了 PersistentVolumeClaim，但沒有指定 PersistentVolume。
對 Pod 而言，PersistentVolumeClaim 就是一個儲存卷。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

<!--
Verify that the container in the Pod is running:
-->
檢查 Pod 中的容器是否運行正常：

```shell
kubectl get pod task-pv-pod
```

<!--
Get a shell to the container running in your Pod:
-->
打開一個 Shell 訪問 Pod 中的容器：

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:
-->
在 Shell 中，驗證 Nginx 是否正在從 hostPath 卷提供 `index.html` 檔案：

<!--
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
-->
```shell
# 一定要在上一步 "kubectl exec" 所返回的 Shell 中執行下面三個命令
apt update
apt install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->
輸出結果是你之前寫到 hostPath 卷中的 `index.html` 檔案中的內容：

```
Hello from Kubernetes storage
```

<!--
If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.
-->
如果你看到此消息，則證明你已經成功地設定了 Pod 使用 PersistentVolumeClaim
的儲存。

<!--
## Clean up

Delete the Pod:
-->
## 清理    {#clean-up}

刪除 Pod：

```shell
kubectl delete pod task-pv-pod
```

<!--
## Mounting the same PersistentVolume in two places

You have understood how to create a PersistentVolume & PersistentVolumeClaim, and how to mount
the volume to a single location in a container. Let's explore how you can mount the same PersistentVolume
at two different locations in a container. Below is an example:
-->
## 在兩個位置掛載同一個 PersistentVolume   {#mounting-the-same-persistentvolume-in-two-places}

你已經瞭解瞭如何創建 PersistentVolume 和 PersistentVolumeClaim，也瞭解瞭如何將卷掛載到容器中的單個位置。  
接下來我們探索如何在容器中的兩個不同位置掛載同一個 PersistentVolume。以下是一個示例：

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

<!--
Here:

- `subPath`: This field allows specific files or directories from the mounted PersistentVolume to be exposed at
  different locations within the container.  In this example:
  - `subPath: html` mounts the html directory.
  - `subPath: nginx.conf` mounts a specific file, nginx.conf.
-->
其中：

- `subPath`：此字段允許將掛載的 PersistentVolume 中的特定檔案或目錄暴露到容器內的不同位置。在本例中：
  - `subPath: html` 掛載 `html` 目錄。
  - `subPath: nginx.conf` 掛載一個特定檔案 `nginx.conf`。

<!--
Since the first subPath is `html`, an `html` directory has to be created within `/mnt/data/`
on the node.

The second subPath `nginx.conf` means that a file within the `/mnt/data/` directory will be used. No other directory
needs to be created.
-->
由於第一個 subPath 是 `html`，所以你需要在節點上的 `/mnt/data/` 下創建一個 `html` 目錄。

第二個 subPath 是 `nginx.conf`，意味着會使用 `/mnt/data/` 目錄下的一個檔案。無需創建額外的目錄。

<!--
Two volume mounts will be made on your nginx container:

- `/usr/share/nginx/html` for the static website
- `/etc/nginx/nginx.conf` for the default config
-->
你的 nginx 容器中會掛載兩個路徑：

- `/usr/share/nginx/html`：用於靜態網站
- `/etc/nginx/nginx.conf`：用於預設設定

<!--
### Move the index.html file on your Node to a new folder

The `index.html` file mentioned here refers to the one created in the "[Create an index.html file on your Node](#create-an-index-html-file-on-your-node)" section.

Open a shell to the single Node in your cluster. How you open a shell depends on how you set up your cluster.
For example, if you are using Minikube, you can open a shell to your Node by entering `minikube ssh`.
-->
### 將節點上的 index.html 檔案移動到新的檔案夾

這裏提到的 `index.html` 檔案指的是
“[在你的節點上創建 index.html 檔案](#create-an-index-html-file-on-your-node)”一節中所創建的檔案。

打開一個 Shell 連接到叢集中的節點。如何打開 Shell 取決於你是如何搭建叢集的。  
例如，如果你使用的是 Minikube，可以通過執行 `minikube ssh` 打開節點的 Shell。

<!--
Create a `/mnt/data/html` directory:

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo mkdir /mnt/data/html
```
-->
創建 `/mnt/data/html` 目錄：

```shell
# 此命令假設你的節點使用 "sudo" 執行超級用戶命令
sudo mkdir /mnt/data/html
```

<!--
Move index.html into the directory:

```shell
# Move index.html from its current location to the html sub-directory
sudo mv /mnt/data/index.html html
```

### Create a new nginx.conf file
-->
將 index.html 移動到此目錄下：

```shell
# 將 index.html 從當前目錄移動到 html 子目錄
sudo mv /mnt/data/index.html /mnt/data/html
```

### 新建 nginx.conf 檔案   {#create-a-new-nginx-conf-file}

{{% code_sample file="pods/storage/nginx.conf" %}}

<!--
This is a modified version of the default `nginx.conf` file. Here, the default `keepalive_timeout` has been
modified to `60`

Create the nginx.conf file:
-->
這是對預設 `nginx.conf` 檔案經過修改的版本。這裏將預設的 `keepalive_timeout` 設置爲 `60`。

創建 `nginx.conf` 檔案：

```shell
cat <<EOF > /mnt/data/nginx.conf
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  60;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
EOF
```

<!--
### Create a Pod

Here we will create a pod that uses the existing persistentVolume and persistentVolumeClaim.
However, the pod mounts only a specific file, `nginx.conf`, and directory, `html`, to the container.

Create the Pod:
-->
### 創建 Pod   {#create-a-pod}

現在我們創建一個 Pod，使用已有的 PersistentVolume 和 PersistentVolumeClaim。  
不過，這個 Pod 只將特定的檔案 `nginx.conf` 和目錄 `html` 掛載到容器中。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-duplicate.yaml
```

<!--
Verify that the container in the Pod is running:
-->
驗證 Pod 中的容器是否正在運行：

```shell
kubectl get pod test
```

<!--
Get a shell to the container running in your Pod:
-->
進入 Pod 中運行的容器的 Shell：

```shell
kubectl exec -it test -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:

```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```
-->
在 Shell 中，驗證 nginx 是否從 hostPath 卷中提供 `index.html`：

```shell
# 確保以下三條命令在上一步通過運行 "kubectl exec" 進入的 root shell 中運行
apt update
apt install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->
輸出顯示了你在 hostPath 捲上寫入 `index.html` 檔案中的文本：

```
Hello from Kubernetes storage
```

<!--
In your shell, also verify that nginx is serving the `nginx.conf` file from the
hostPath volume:

```shell
# Be sure to run these commands inside the root shell that comes from
# running "kubectl exec" in the previous step
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```
-->
在 Shell 中，還可以驗證 nginx 是否從 hostPath 卷中加載了 `nginx.conf` 檔案：

```shell
# 確保以下命令在上一步通過運行 "kubectl exec" 所進入的 root shell 中運行
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```

<!--
The output shows the modified text that you wrote to the `nginx.conf` file on the
hostPath volume:
-->
輸出顯示你在 hostPath 捲上寫入 `nginx.conf` 檔案中經修改的文本：

```
keepalive_timeout  60;
```

<!--
If you see these messages, you have successfully configured a Pod to
use a specific file and directory in a storage from a PersistentVolumeClaim.

## Clean up

Delete the Pod:
-->
如果你看到了這些消息，說明你已經成功將 Pod 設定爲使用 PersistentVolumeClaim 儲存中的特定檔案和目錄。

## 清理

刪除 Pod：

```shell
kubectl delete pod test
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

<!--
If you don't already have a shell open to the Node in your cluster,
open a new shell the same way that you did earlier.

In the shell on your Node, remove the file and directory that you created:
-->
如果你還沒有連接到叢集中節點的 Shell，可以按之前所做操作，打開一個新的 Shell。

在節點的 Shell 上，刪除你所創建的目錄和檔案：

<!--
# This assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 這裏假定你使用 "sudo" 來以超級用戶的角色執行命令
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

<!--
You can now close the shell to your Node.
-->
你現在可以關閉連接到節點的 Shell。

<!-- discussion -->

<!--
## Access control

Storage configured with a group ID (GID) allows writing only by Pods using the same
GID. Mismatched or missing GIDs cause permission denied errors. To reduce the
need for coordination with users, an administrator can annotate a PersistentVolume
with a GID. Then the GID is automatically added to any Pod that uses the
PersistentVolume.

Use the `pv.beta.kubernetes.io/gid` annotation as follows:
-->
## 訪問控制  {#access-control}

使用組 ID（GID）設定的儲存僅允許 Pod 使用相同的 GID 進行寫入。
GID 不匹配或缺失將會導致無權訪問錯誤。
爲了減少與使用者的協調，管理員可以對 PersistentVolume 添加 GID 註解。
這樣 GID 就能自動添加到使用 PersistentVolume 的任何 Pod 中。

使用 `pv.beta.kubernetes.io/gid` 註解的方法如下所示：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

<!--
When a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID
is applied to all containers in the Pod in the same way that GIDs specified in the
Pod's security context are. Every GID, whether it originates from a PersistentVolume
annotation or the Pod's specification, is applied to the first process run in
each container.
-->
當 Pod 使用帶有 GID 註解的 PersistentVolume 時，註解的 GID 會被應用於 Pod 中的所有容器，
應用的方法與 Pod 的安全上下文中指定的 GID 相同。
每個 GID，無論是來自 PersistentVolume 註解還是來自 Pod 規約，都會被應用於每個容器中運行的第一個進程。

{{< note >}}
<!--
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
-->
當 Pod 使用 PersistentVolume 時，與 PersistentVolume 關聯的 GID 不會在 Pod
資源本身的對象上出現。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Read the [Persistent Storage design document](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).
-->
* 進一步瞭解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* 閱讀[持久儲存設計文檔](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md)

<!--
### Reference
-->
### 參考   {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
