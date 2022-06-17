---
title: 配置 Pod 以使用 PersistentVolume 作為儲存
content_type: task
weight: 60
---

<!--
title: Configure a Pod to Use a PersistentVolume for Storage
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page shows how to configure a Pod to use a
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
本文介紹如何配置 Pod 使用 
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
作為儲存。
以下是該過程的總結：

1. 你作為叢集管理員建立由物理儲存支援的 PersistentVolume。你不會將卷與任何 Pod 關聯。

1. 你現在以開發人員或者叢集使用者的角色建立一個 PersistentVolumeClaim，
   它將自動繫結到合適的 PersistentVolume。

1. 你建立一個使用 PersistentVolumeClaim 作為儲存的 Pod。

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster that has only one Node, and the kubectl
command-line tool must be configured to communicate with your cluster. If you
do not already have a single-node cluster, you can create one by using
[Minikube](https://minikube.sigs.k8s.io/docs/).

* Familiarize yourself with the material in
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
-->

* 你需要一個包含單個節點的 Kubernetes 叢集，並且必須配置 kubectl 命令列工具以便與叢集互動。
  如果還沒有單節點叢集，可以使用
  [Minikube](https://minikube.sigs.k8s.io/docs/) 建立一個。
.
* 熟悉[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)中的材料。

<!-- steps -->

<!--
## Create an index.html file on your Node

Open a shell to the Node in your cluster. How you open a shell depends on how
you set up your cluster. For example, if you are using Minikube, you can open a
shell to your Node by entering `minikube ssh`.

In your shell, create a `/mnt/data` directory:
-->
## 在你的節點上建立一個 index.html 檔案

開啟叢集中節點的一個 Shell。
如何開啟 Shell 取決於叢集的設定。
例如，如果你正在使用 Minikube，那麼可以透過輸入 `minikube ssh` 來開啟節點的 Shell。

在 Shell 中，建立一個 `/mnt/data` 目錄：

<!--
# This assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 這裡假定你的節點使用 "sudo" 來以超級使用者角色執行命令
sudo mkdir /mnt/data
```

<!--
In the `/mnt/data` directory, create an `index.html` file:
-->
在 `/mnt/data` 目錄中建立一個 index.html 檔案：

<!--
# This again assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```
# 這裡再次假定你的節點使用 "sudo" 來以超級使用者角色執行命令
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

<!--
If your Node uses a tool for superuser access other than `sudo`, you can
usually make this work if you replace `sudo` with the name of the other tool.
-->
{{< note >}}
如果你的節點使用某工具而不是 `sudo` 來完成超級使用者訪問，你可以將上述命令
中的 `sudo` 替換為該工具的名稱。
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
## 建立 PersistentVolume

在本練習中，你將建立一個 *hostPath* 型別的 PersistentVolume。
Kubernetes 支援用於在單節點叢集上開發和測試的 hostPath 型別的 PersistentVolume。
hostPath 型別的 PersistentVolume 使用節點上的檔案或目錄來模擬網路附加儲存。

<!--
In a production cluster, you would not use hostPath. Instead a cluster administrator
would provision a network resource like a Google Compute Engine persistent disk,
an NFS share, or an Amazon Elastic Block Store volume. Cluster administrators can also
use [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage)
to set up
[dynamic provisioning](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes).

Here is the configuration file for the hostPath PersistentVolume:
-->
在生產叢集中，你不會使用 hostPath。
叢集管理員會提供網路儲存資源，比如 Google Compute Engine 持久盤卷、NFS 共享卷或 Amazon Elastic Block Store 卷。
叢集管理員還可以使用 [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage) 來設定[動態提供儲存](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes)。

下面是 hostPath PersistentVolume 的配置檔案：

{{< codenew file="pods/storage/pv-volume.yaml" >}}

<!--
Create the PersistentVolume:
-->
建立 PersistentVolume：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

<!--
View information about the PersistentVolume:
-->
檢視 PersistentVolume 的資訊：

```shell
kubectl get pv task-pv-volume
```

<!--
The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.
-->
輸出結果顯示該 PersistentVolume 的`狀態（STATUS）` 為 `Available`。
這意味著它還沒有被繫結給 PersistentVolumeClaim。

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

<!--
## Create a PersistentVolumeClaim

The next step is to create a PersistentVolumeClaim. Pods use PersistentVolumeClaims
to request physical storage. In this exercise, you create a PersistentVolumeClaim
that requests a volume of at least three gibibytes that can provide read-write
access for at least one Node.

Here is the configuration file for the PersistentVolumeClaim:
-->
## 建立 PersistentVolumeClaim

下一步是建立一個 PersistentVolumeClaim。
Pod 使用 PersistentVolumeClaim 來請求物理儲存。
在本練習中，你將建立一個 PersistentVolumeClaim，它請求至少 3 GB 容量的卷，
該卷至少可以為一個節點提供讀寫訪問。

下面是 PersistentVolumeClaim 的配置檔案：

{{< codenew file="pods/storage/pv-claim.yaml" >}}

<!--
Create the PersistentVolumeClaim:
-->
建立 PersistentVolumeClaim：

```shell
kubectl create -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

<!--
After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:
-->
建立 PersistentVolumeClaim 之後，Kubernetes 控制平面將查詢滿足申領要求的 PersistentVolume。
如果控制平面找到具有相同 StorageClass 的適當的 PersistentVolume，
則將 PersistentVolumeClaim 繫結到該 PersistentVolume 上。

再次檢視 PersistentVolume 資訊：

```shell
kubectl get pv task-pv-volume
```

<!--
Now the output shows a `STATUS` of `Bound`.
-->
現在輸出的 `STATUS` 為 `Bound`。

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

<!--
Look at the PersistentVolumeClaim:
-->
檢視 PersistentVolumeClaim：

```
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
## 建立 Pod

下一步是建立一個 Pod， 該 Pod 使用你的 PersistentVolumeClaim 作為儲存卷。

下面是 Pod 的 配置檔案：

{{< codenew file="pods/storage/pv-pod.yaml" >}}

<!--
Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Create the Pod:
-->
注意 Pod 的配置檔案指定了 PersistentVolumeClaim，但沒有指定 PersistentVolume。
對 Pod 而言，PersistentVolumeClaim 就是一個儲存卷。

建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

<!--
Verify that the Container in the Pod is running;
-->
檢查 Pod 中的容器是否執行正常：

```shell
kubectl get pod task-pv-pod
```

<!--
Get a shell to the Container running in your Pod:
-->
開啟一個 Shell 訪問 Pod 中的容器：

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:
-->
在 Shell 中，驗證 nginx 是否正在從 hostPath 卷提供 `index.html` 檔案：

<!--
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
-->
```
# 一定要在上一步 "kubectl exec" 所返回的 Shell 中執行下面三個命令
root@task-pv-pod:/# apt-get update
root@task-pv-pod:/# apt-get install curl
root@task-pv-pod:/# curl localhost
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
如果你看到此訊息，則證明你已經成功地配置了 Pod 使用 PersistentVolumeClaim
的儲存。

<!--
## Clean up

Delete the Pod,  the PersistentVolumeClaim and the PersistentVolume:
-->
## 清理    {#clean-up}

刪除 Pod、PersistentVolumeClaim 和 PersistentVolume 物件：

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

<!--
If you don't already have a shell open to the Node in your cluster,
open a new shell the same way that you did earlier.

In the shell on your Node, remove the file and directory that you created:
-->
如果你還沒有連線到叢集中節點的 Shell，可以按之前所做操作，開啟一個新的 Shell。

在節點的 Shell 上，刪除你所建立的目錄和檔案：


```shell
# 這裡假定你使用 "sudo" 來以超級使用者的角色執行命令
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

<!--
You can now close the shell to your Node.
-->
你現在可以關閉連線到節點的 Shell。

<!--
## Mounting the same persistentVolume in two places
-->

## 在兩個地方掛載相同的 persistentVolume

{{< codenew file="pods/storage/pv-duplicate.yaml" >}}

<!--
You can perform 2 volume mounts on your nginx container:

`/usr/share/nginx/html` for the static website
`/etc/nginx/nginx.conf` for the default config
-->
你可以在 nginx 容器上執行兩個卷掛載:

`/usr/share/nginx/html` 用於靜態網站
`/etc/nginx/nginx.conf` 作為預設配置

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

使用組 ID（GID）配置的儲存僅允許 Pod 使用相同的 GID 進行寫入。
GID 不匹配或缺失將會導致無權訪問錯誤。
為了減少與使用者的協調，管理員可以對 PersistentVolume 新增 GID 註解。
這樣 GID 就能自動新增到使用 PersistentVolume 的任何 Pod 中。

使用 `pv.beta.kubernetes.io/gid` 註解的方法如下所示：

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

<!--
When a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID
is applied to all Containers in the Pod in the same way that GIDs specified in the
Pod's security context are. Every GID, whether it originates from a PersistentVolume
annotation or the Pod's specification, is applied to the first process run in
each Container.
-->
當 Pod 使用帶有 GID 註解的 PersistentVolume 時，註解的 GID 會被應用於 Pod 中的所有容器，
應用的方法與 Pod 的安全上下文中指定的 GID 相同。
每個 GID，無論是來自 PersistentVolume 註解還是來自 Pod 規約，都會被應用於每個容器中
執行的第一個程序。

<!--
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
-->
{{< note >}}
當 Pod 使用 PersistentVolume 時，與 PersistentVolume 關聯的 GID 不會在 Pod
資源本身的物件上出現。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Read the [Persistent Storage design document](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md).
-->
* 進一步瞭解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* 閱讀[持久儲存設計文件](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md)

<!--
### Reference
-->
### 參考

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)


