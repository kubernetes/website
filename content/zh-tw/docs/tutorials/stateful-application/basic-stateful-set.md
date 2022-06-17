---
title: StatefulSet 基礎
content_type: tutorial
approvers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton

---

<!-- overview -->

<!--
This tutorial provides an introduction to managing applications with
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/). It
demonstrates how to create, delete, scale, and update the Pods of StatefulSets.
-->

本教程介紹瞭如何使用 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 來管理應用。
演示瞭如何建立、刪除、擴容/縮容和更新 StatefulSets 的 Pods。



## {{% heading "prerequisites" %}}


<!--
Before you begin this tutorial, you should familiarize yourself with the
following Kubernetes concepts.
-->

在開始本教程之前，你應該熟悉以下 Kubernetes 的概念：

* [Pods](/zh-cn/docs/concepts/workloads/pods/)
* [Cluster DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/zh-cn/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* [PersistentVolume Provisioning](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
* [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
* [kubectl CLI](/zh-cn/docs/user-guide/kubectl/)

<!--
This tutorial assumes that your cluster is configured to dynamically provision
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision two 1 GiB volumes prior to starting this
tutorial.
-->

本教程假設你的叢集被配置為動態的提供 PersistentVolumes。如果沒有這樣配置，在開始本教程之前，你需要手動準備 2 個 1 GiB 的儲存卷。



## {{% heading "objectives" %}}


<!--
StatefulSets are intended to be used with stateful applications and distributed
systems. However, the administration of stateful applications and
distributed systems on Kubernetes is a broad, complex topic. In order to
demonstrate the basic features of a StatefulSet, and not to conflate the former
topic with the latter, you will deploy a simple web application using a StatefulSet.

After this tutorial, you will be familiar with the following.

* How to create a StatefulSet
* How a StatefulSet manages its Pods
* How to delete a StatefulSet
* How to scale a StatefulSet
* How to update a StatefulSet's Pods
-->

StatefulSets 旨在與有狀態的應用及分散式系統一起使用。然而在 Kubernetes 上管理有狀態應用和分散式系統是一個寬泛而複雜的話題。
為了演示 StatefulSet 的基本特性，並且不使前後的主題混淆，你將會使用 StatefulSet 部署一個簡單的 web 應用。

在閱讀本教程後，你將熟悉以下內容：

* 如何建立 StatefulSet
* StatefulSet 怎樣管理它的 Pods
* 如何刪除 StatefulSet
* 如何對 StatefulSet 進行擴容/縮容
* 如何更新一個 StatefulSet 的 Pods




<!-- lessoncontent -->

<!--
## Creating a StatefulSet

Begin by creating a StatefulSet using the example below. It is similar to the
example presented in the
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) concept.
It creates a [headless Service](/docs/concepts/services-networking/service/#headless-services),
`nginx`, to publish the IP addresses of Pods in the StatefulSet, `web`.
-->

## 建立 StatefulSet


作為開始，使用如下示例建立一個 StatefulSet。它和 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中的示例相似。
它建立了一個 [Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services) `nginx` 用來發布 StatefulSet `web` 中的 Pod 的 IP 地址。

{{< codenew file="application/web/web.yaml" >}}

<!--
Download the example above, and save it to a file named `web.yaml`

You will need to use two terminal windows. In the first terminal, use
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to watch the creation
of the StatefulSet's Pods.
-->

下載上面的例子並儲存為檔案 `web.yaml`。


你需要使用兩個終端視窗。 在第一個終端中，使用 [`kubectl get`](/zh-cn/docs/user-guide/kubectl/{{< param "version" >}}/#get)  來檢視 StatefulSet 的 Pods 的建立情況。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In the second terminal, use
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to create the
Headless Service and StatefulSet defined in `web.yaml`.
-->

在另一個終端中，使用 [`kubectl apply`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#apply) 來建立定義在 `web.yaml` 中的 Headless Service 和 StatefulSet。

```shell
kubectl apply -f web.yaml
```
```
service/nginx created
statefulset.apps/web created
```

<!--
The command above creates two Pods, each running an
[NGINX](https://www.nginx.com) webserver. Get the `nginx` Service and the
`web` StatefulSet to verify that they were created successfully.
-->

上面的命令建立了兩個 Pod，每個都運行了一個 [NGINX](https://www.nginx.com) web 伺服器。
獲取 `nginx` Service 和 `web` StatefulSet 來驗證是否成功的建立了它們。

```shell
kubectl get service nginx
```
```
NAME      TYPE         CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     ClusterIP    None         <none>        80/TCP    12s
```
<!--
...then get the `web` StatefulSet, to verify that both were created successfully:
-->
...然後獲取 `web` StatefulSet，以驗證兩者均已成功建立：
```shell
kubectl get statefulset web
```
```
NAME      DESIRED   CURRENT   AGE
web       2         1         20s
```

<!--

### Ordered Pod Creation

For a StatefulSet with N replicas, when Pods are being deployed, they are
created sequentially, in order from {0..N-1}. Examine the output of the
`kubectl get` command in the first terminal. Eventually, the output will
look like the example below.
-->

### 順序建立 Pod


對於一個擁有 N 個副本的 StatefulSet，Pod 被部署時是按照 {0 …… N-1} 的序號順序建立的。
在第一個終端中使用 `kubectl get` 檢查輸出。這個輸出最終將看起來像下面的樣子。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

<!--
Notice that the `web-1` Pod is not launched until the `web-0` Pod is
[Running and Ready](/docs/user-guide/pod-states).
-->
請注意在 `web-0` Pod 處於 [Running和Ready](/zh-cn/docs/user-guide/pod-states) 狀態後 `web-1` Pod 才會被啟動。

<!--
## Pods in a StatefulSet


Pods in a StatefulSet have a unique ordinal index and a stable network identity.

### Examining the Pod's Ordinal Index

Get the StatefulSet's Pods.
-->

## StatefulSet 中的 Pod


StatefulSet 中的 Pod 擁有一個唯一的順序索引和穩定的網路身份標識。


### 檢查 Pod 的順序索引


獲取 StatefulSet 的 Pod。

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

<!--
As mentioned in the [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
concept, the Pods in a StatefulSet have a sticky, unique identity. This identity
is based on a unique ordinal index that is assigned to each Pod by the
StatefulSet controller. The Pods' names take the form
`<statefulset name>-<ordinal index>`. Since the `web` StatefulSet has two
replicas, it creates two Pods, `web-0` and `web-1`.

### Using Stable Network Identities

Each Pod has a stable hostname based on its ordinal index. Use
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) to execute the
`hostname` command in each Pod.
-->

如同 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中所提到的， 
StatefulSet 中的 Pod 擁有一個具有黏性的、獨一無二的身份標誌。
這個標誌基於 StatefulSet 控制器分配給每個 Pod 的唯一順序索引。
Pod 的名稱的形式為`<statefulset name>-<ordinal index>`。
`web`StatefulSet 擁有兩個副本，所以它建立了兩個 Pod：`web-0`和`web-1`。

### 使用穩定的網路身份標識

每個 Pod 都擁有一個基於其順序索引的穩定的主機名。使用[`kubectl exec`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#exec)在每個 Pod 中執行`hostname`。

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'hostname'; done
```
```
web-0
web-1
```

<!--
Use [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) to execute
a container that provides the `nslookup` command from the `dnsutils` package.
Using `nslookup` on the Pods' hostnames, you can examine their in-cluster DNS
addresses.
-->

使用 [`kubectl run`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#run) 
執行一個提供 `nslookup` 命令的容器，該命令來自於 `dnsutils` 包。
透過對 Pod 的主機名執行 `nslookup`，你可以檢查他們在叢集內部的 DNS 地址。

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```
<!--
which starts a new shell. In that new shell, run:
-->
這將啟動一個新的 shell。在新 shell 中，執行：
```shell
# Run this in the dns-test container shell
nslookup web-0.nginx
```
<!--
The output is similar to:
-->
輸出類似於：
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.6

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.6
```

<!--
The CNAME of the headless service points to SRV records (one for each Pod that
is Running and Ready). The SRV records point to A record entries that
contain the Pods' IP addresses.

In one terminal, watch the StatefulSet's Pods.
-->

headless service 的 CNAME 指向 SRV 記錄（記錄每個 Running 和 Ready 狀態的 Pod）。
SRV 記錄指向一個包含 Pod IP 地址的記錄表項。

在一個終端中檢視 StatefulSet 的 Pod。

```shell
kubectl get pod -w -l app=nginx
```
<!--
In a second terminal, use
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete all
the Pods in the StatefulSet.
-->

在另一個終端中使用 [`kubectl delete`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#delete) 刪除 StatefulSet 中所有的 Pod。

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Wait for the StatefulSet to restart them, and for both Pods to transition to
Running and Ready.
-->

等待 StatefulSet 重啟它們，並且兩個 Pod 都變成 Running 和 Ready 狀態。

```shell
kubectl get pod -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

<!--
Use `kubectl exec` and `kubectl run` to view the Pods hostnames and in-cluster
DNS entries.
-->

使用 `kubectl exec` 和 `kubectl run` 檢視 Pod 的主機名和叢集內部的 DNS 表項。

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
```
```
web-0
web-1
```
<!--
then, run:
-->
然後，執行：
```
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm /bin/sh
```
<!--
which starts a new shell.  
In that new shell, run:
-->
這將啟動一個新的 shell。在新 shell 中，執行：
```shell
# Run this in the dns-test container shell
nslookup web-0.nginx
```
<!--
The output is similar to:
-->
輸出類似於：
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.7

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.8
```
<!--
The Pods' ordinals, hostnames, SRV records, and A record names have not changed,
but the IP addresses associated with the Pods may have changed. In the cluster
used for this tutorial, they have. This is why it is important not to configure
other applications to connect to Pods in a StatefulSet by IP address.


If you need to find and connect to the active members of a StatefulSet, you
should query the CNAME of the Headless Service
(`nginx.default.svc.cluster.local`). The SRV records associated with the
CNAME will contain only the Pods in the StatefulSet that are Running and
Ready.

If your application already implements connection logic that tests for
liveness and readiness, you can use the SRV records of the Pods (
`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`), as they are stable, and your
application will be able to discover the Pods' addresses when they transition
to Running and Ready.
-->

Pod 的序號、主機名、SRV 條目和記錄名稱沒有改變，但和 Pod 相關聯的 IP 地址可能發生了改變。
在本教程中使用的叢集中它們就改變了。這就是為什麼不要在其他應用中使用 StatefulSet 中的 Pod 的 IP 地址進行連線，這點很重要。


如果你需要查詢並連線一個 StatefulSet 的活動成員，你應該查詢 Headless Service 的 CNAME。
和 CNAME 相關聯的 SRV 記錄只會包含 StatefulSet 中處於 Running 和 Ready 狀態的 Pod。


如果你的應用已經實現了用於測試 liveness 和 readiness 的連線邏輯，你可以使用 Pod 的 SRV 記錄（`web-0.nginx.default.svc.cluster.local`，
`web-1.nginx.default.svc.cluster.local`）。因為他們是穩定的，並且當你的 Pod 的狀態變為 Running 和 Ready 時，你的應用就能夠發現它們的地址。


<!--
### Writing to Stable Storage

Get the PersistentVolumeClaims for `web-0` and `web-1`.
-->

### 寫入穩定的儲存

獲取 `web-0` 和 `web-1` 的 PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
```
<!--
The output is similar to:
-->
輸出類似於：
```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

<!--
The StatefulSet controller created two PersistentVolumeClaims that are
bound to two [PersistentVolumes](/docs/concepts/storage/persistent-volumes/). As the cluster used in this tutorial is configured to dynamically provision
PersistentVolumes, the PersistentVolumes were created and bound automatically.

The NGINX webservers, by default, will serve an index file at
`/usr/share/nginx/html/index.html`. The `volumeMounts` field in the
StatefulSets `spec` ensures that the `/usr/share/nginx/html` directory is
backed by a PersistentVolume.

Write the Pods' hostnames to their `index.html` files and verify that the NGINX
webservers serve the hostnames.
-->

StatefulSet 控制器建立了兩個 PersistentVolumeClaims，繫結到兩個 [PersistentVolumes](/zh-cn/docs/concepts/storage/volumes/)。由於本教程使用的叢集配置為動態提供 PersistentVolume，所有的 PersistentVolume 都是自動建立和繫結的。


NGINX web 伺服器預設會載入位於 `/usr/share/nginx/html/index.html` 的 index 檔案。
StatefulSets `spec` 中的 `volumeMounts` 欄位保證了 `/usr/share/nginx/html` 資料夾由一個 PersistentVolume 支援。


將 Pod 的主機名寫入它們的`index.html`檔案並驗證 NGINX web 伺服器使用該主機名提供服務。

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'echo "$(hostname)" > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

{{< note >}}
<!--
If you instead see **403 Forbidden** responses for the above curl command,
you will need to fix the permissions of the directory mounted by the `volumeMounts`
(due to a [bug when using hostPath volumes](https://github.com/kubernetes/kubernetes/issues/2630)),
by running:
-->

請注意，如果你看見上面的 curl 命令返回了 **403 Forbidden** 的響應，你需要像這樣修復使用 `volumeMounts`
（原因歸咎於[使用 hostPath 卷時存在的缺陷](https://github.com/kubernetes/kubernetes/issues/2630)）
掛載的目錄的許可權
執行：

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

<!--
before retrying the `curl` command above.
-->

在你重新嘗試上面的 `curl` 命令之前。
{{< /note >}}

<!--
In one terminal, watch the StatefulSet's Pods.
-->

在一個終端檢視 StatefulSet 的 Pod。

```shell
kubectl get pod -w -l app=nginx
```

<!--
In a second terminal, delete all of the StatefulSet's Pods.
-->

在另一個終端刪除 StatefulSet 所有的 Pod。

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```
<!--
Examine the output of the `kubectl get` command in the first terminal, and wait
for all of the Pods to transition to Running and Ready.
-->

在第一個終端裡檢查 `kubectl get` 命令的輸出，等待所有 Pod 變成 Running 和 Ready 狀態。

```shell
kubectl get pod -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

<!--
Verify the web servers continue to serve their hostnames.
-->

驗證所有 web 伺服器在繼續使用它們的主機名提供服務。

```
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

<!--
Even though `web-0` and `web-1` were rescheduled, they continue to serve their
hostnames because the PersistentVolumes associated with their
PersistentVolumeClaims are remounted to their `volumeMounts`. No matter what
node `web-0`and `web-1` are scheduled on, their PersistentVolumes will be
mounted to the appropriate mount points.

## Scaling a StatefulSet
Scaling a StatefulSet refers to increasing or decreasing the number of replicas.
This is accomplished by updating the `replicas` field. You can use either
[`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale) or
[`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch) to scale a StatefulSet.

### Scaling Up

In one terminal window, watch the Pods in the StatefulSet.
-->

雖然 `web-0` 和 `web-1` 被重新排程了，但它們仍然繼續監聽各自的主機名，因為和它們的 PersistentVolumeClaim 相關聯的 PersistentVolume 被重新掛載到了各自的 `volumeMount` 上。
不管 `web-0` 和 `web-1` 被排程到了哪個節點上，它們的 PersistentVolumes 將會被掛載到合適的掛載點上。


## 擴容/縮容 StatefulSet

擴容/縮容 StatefulSet 指增加或減少它的副本數。這透過更新 `replicas` 欄位完成。
你可以使用[`kubectl scale`](/zh-cn/docs/user-guide/kubectl/{{< param "version" >}}/#scale) 
或者[`kubectl patch`](/zh-cn/docs/user-guide/kubectl/{{< param "version" >}}/#patch)來擴容/縮容一個 StatefulSet。


### 擴容


在一個終端視窗觀察 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal window, use `kubectl scale` to scale the number of replicas
to 5.-->

在另一個終端視窗使用 `kubectl scale` 擴充套件副本數為 5。

```shell
kubectl scale sts web --replicas=5
```
```
statefulset.apps/web scaled
```
<!--
Examine the output of the `kubectl get` command in the first terminal, and wait
for the three additional Pods to transition to Running and Ready.
-->

在第一個 終端中檢查 `kubectl get` 命令的輸出，等待增加的 3 個 Pod 的狀態變為 Running 和 Ready。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0          0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

<!--
The StatefulSet controller scaled the number of replicas. As with
[StatefulSet creation](#ordered-pod-creation), the StatefulSet controller
created each Pod sequentially with respect to its ordinal index, and it
waited for each Pod's predecessor to be Running and Ready before launching the
subsequent Pod.

### Scaling Down

In one terminal, watch the StatefulSet's Pods.
-->

StatefulSet 控制器擴充套件了副本的數量。
如同[建立 StatefulSet](#順序建立pod) 所述，StatefulSet 按序號索引順序的建立每個 Pod，並且會等待前一個 Pod 變為 Running 和 Ready 才會啟動下一個 Pod。

### 縮容


在一個終端觀察 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, use `kubectl patch` to scale the StatefulSet back down to
three replicas.
-->

在另一個終端使用 `kubectl patch` 將 StatefulSet 縮容回三個副本。

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for `web-4` and `web-3` to transition to Terminating.
-->

等待 `web-4` 和 `web-3` 狀態變為 Terminating。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3h
web-1     1/1       Running             0          3h
web-2     1/1       Running             0          55s
web-3     1/1       Running             0          36s
web-4     0/1       ContainerCreating   0          18s
NAME      READY     STATUS    RESTARTS   AGE
web-4     1/1       Running   0          19s
web-4     1/1       Terminating   0         24s
web-4     1/1       Terminating   0         24s
web-3     1/1       Terminating   0         42s
web-3     1/1       Terminating   0         42s
```

<!--
### Ordered Pod Termination

The controller deleted one Pod at a time, in reverse order with respect to its
ordinal index, and it waited for each to be completely shutdown before
deleting the next.

Get the StatefulSet's PersistentVolumeClaims.
-->

### 順序終止 Pod


控制器會按照與 Pod 序號索引相反的順序每次刪除一個 Pod。在刪除下一個 Pod 前會等待上一個被完全關閉。


獲取 StatefulSet 的 PersistentVolumeClaims。

```shell
kubectl get pvc -l app=nginx
```
```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```

<!--
There are still five PersistentVolumeClaims and five PersistentVolumes.
When exploring a Pod's [stable storage](#writing-to-stable-storage), we saw that the PersistentVolumes mounted to the Pods of a StatefulSet are not deleted when the StatefulSet's Pods are deleted. This is still true when Pod deletion is caused by scaling the StatefulSet down.

## Updating StatefulSets

In Kubernetes 1.7 and later, the StatefulSet controller supports automated updates.  The
strategy used is determined by the `spec.updateStrategy` field of the
StatefulSet API Object. This feature can be used to upgrade the container
images, resource requests and/or limits, labels, and annotations of the Pods in a
StatefulSet. There are two valid update strategies, `RollingUpdate` and
`OnDelete`.

`RollingUpdate` update strategy is the default for StatefulSets.
-->

五個 PersistentVolumeClaims 和五個 PersistentVolumes 仍然存在。
檢視 Pod 的 [穩定儲存](#stable-storage)，我們發現當刪除 StatefulSet 的 Pod 時，掛載到 StatefulSet 的 Pod 的 PersistentVolumes 不會被刪除。
當這種刪除行為是由 StatefulSet 縮容引起時也是一樣的。


## 更新 StatefulSet


Kubernetes 1.7 版本的 StatefulSet 控制器支援自動更新。
更新策略由 StatefulSet API Object 的`spec.updateStrategy` 欄位決定。這個特效能夠用來更新一個 StatefulSet 中的 Pod 的 container images，resource requests，以及 limits，labels 和 annotations。
`RollingUpdate`滾動更新是 StatefulSets 預設策略。


<!--
The `RollingUpdate` update strategy will update all Pods in a StatefulSet, in
reverse ordinal order, while respecting the StatefulSet guarantees.

Patch the `web` StatefulSet to apply the `RollingUpdate` update strategy.
-->

### Rolling Update 策略


`RollingUpdate` 更新策略會更新一個 StatefulSet 中所有的 Pod，採用與序號索引相反的順序並遵循 StatefulSet 的保證。


Patch `web` StatefulSet 來執行 `RollingUpdate` 更新策略。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
```
```
statefulset.apps/web patched
```
<!--
In one terminal window, patch the `web` StatefulSet to change the container
image again.
-->

在一個終端視窗中 patch `web` StatefulSet 來再次的改變容器映象。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"gcr.io/google_containers/nginx-slim:0.8"}]'
```
```
statefulset.apps/web patched
```

<!--
In another terminal, watch the Pods in the StatefulSet.
-->

在另一個終端監控 StatefulSet 中的 Pod。

```shell
kubectl get po -l app=nginx -w
```
<!--
The output is similar to:
-->
輸出類似於：
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          7m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          8m
web-2     1/1       Terminating   0         8m
web-2     1/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-1     1/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         6s
web-0     1/1       Terminating   0         7m
web-0     1/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
```

<!--
The Pods in the StatefulSet are updated in reverse ordinal order. The
StatefulSet controller terminates each Pod, and waits for it to transition to Running and
Ready prior to updating the next Pod. Note that, even though the StatefulSet
controller will not proceed to update the next Pod until its ordinal successor
is Running and Ready, it will restore any Pod that fails during the update to
its current version. Pods that have already received the update will be
restored to the updated version, and Pods that have not yet received the
update will be restored to the previous version. In this way, the controller
attempts to continue to keep the application healthy and the update consistent
in the presence of intermittent failures.

Get the Pods to view their container images.
-->

StatefulSet 裡的 Pod 採用和序號相反的順序更新。在更新下一個 Pod 前，StatefulSet 控制器終止每個 Pod 並等待它們變成 Running 和 Ready。
請注意，雖然在順序後繼者變成 Running 和 Ready 之前 StatefulSet 控制器不會更新下一個 Pod，但它仍然會重建任何在更新過程中發生故障的 Pod，使用的是它們當前的版本。
已經接收到更新請求的 Pod 將會被恢復為更新的版本，沒有收到請求的 Pod 則會被恢復為之前的版本。
像這樣，控制器嘗試繼續使應用保持健康並在出現間歇性故障時保持更新的一致性。

獲取 Pod 來檢視他們的容器映象。

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
k8s.gcr.io/nginx-slim:0.8
k8s.gcr.io/nginx-slim:0.8
k8s.gcr.io/nginx-slim:0.8

```

<!--
All the Pods in the StatefulSet are now running the previous container image.

**Tip** You can also use `kubectl rollout status sts/<name>` to view
the status of a rolling update.

#### Staging an Update
You can stage an update to a StatefulSet by using the `partition` parameter of
the `RollingUpdate` update strategy. A staged update will keep all of the Pods
in the StatefulSet at the current version while allowing mutations to the
StatefulSet's `.spec.template`.

Patch the `web` StatefulSet to add a partition to the `updateStrategy` field.
-->

StatefulSet 中的所有 Pod 現在都在執行之前的容器映象。


**小竅門**：你還可以使用 `kubectl rollout status sts/<name>` 來檢視 rolling update 的狀態。


#### 分段更新

你可以使用 `RollingUpdate` 更新策略的 `partition` 引數來分段更新一個 StatefulSet。
分段的更新將會使 StatefulSet 中的其餘所有 Pod 保持當前版本的同時僅允許改變 StatefulSet 的  `.spec.template`。


Patch `web` StatefulSet 來對 `updateStrategy` 欄位新增一個分割槽。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
```
```
statefulset.apps/web patched
```

<!--
Patch the StatefulSet again to change the container's image.
-->

再次 Patch StatefulSet 來改變容器映象。

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"k8s.gcr.io/nginx-slim:0.7"}]'
```
```
statefulset.apps/web patched
```

<!--
Delete a Pod in the StatefulSet.
-->

刪除 StatefulSet 中的 Pod。

```shell
kubectl delete pod web-2
```
```
pod "web-2" deleted
```

<!--
Wait for the Pod to be Running and Ready.
-->

等待 Pod 變成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container.
-->

獲取 Pod 的容器。

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
k8s.gcr.io/nginx-slim:0.8
```

<!--
Notice that, even though the update strategy is `RollingUpdate` the StatefulSet
controller restored the Pod with its original container. This is because the
ordinal of the Pod is less than the `partition` specified by the
`updateStrategy`.

#### Rolling Out a Canary
You can roll out a canary to test a modification by decrementing the `partition`
you specified [above](#staging-an-update).

Patch the StatefulSet to decrement the partition.
-->

請注意，雖然更新策略是 `RollingUpdate`，StatefulSet 控制器還是會使用原始的容器恢復 Pod。
這是因為 Pod 的序號比 `updateStrategy` 指定的 `partition` 更小。


#### 灰度釋出

你可以透過減少 [上文](#分段更新)指定的 `partition` 來進行灰度釋出，以此來測試你的程式的改動。


透過 patch 命令修改 StatefulSet 來減少分割槽。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for `web-2` to be Running and Ready.
-->

等待 `web-2` 變成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container.
-->

獲取 Pod 的容器。

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
k8s.gcr.io/nginx-slim:0.7

```

<!--
When you changed the `partition`, the StatefulSet controller automatically
updated the `web-2` Pod because the Pod's ordinal was greater than or equal to
the `partition`.

Delete the `web-1` Pod.
-->

當你改變 `partition` 時，StatefulSet 會自動的更新 `web-2` Pod，這是因為 Pod 的序號大於或等於 `partition`。


刪除 `web-1` Pod。

```shell
kubectl delete pod web-1
```
```
pod "web-1" deleted
```

<!--
Wait for the `web-1` Pod to be Running and Ready.
-->

等待 `web-1` 變成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
<!--
The output is similar to:
-->
輸出類似於：
```
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Running       0          6m
web-1     0/1       Terminating   0          6m
web-2     1/1       Running       0          2m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

<!--
Get the `web-1` Pods container.
-->

獲取 `web-1` Pod 的容器。

```shell
kubectl get pod web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
k8s.gcr.io/nginx-slim:0.8
```

<!--
`web-1` was restored to its original configuration because the Pod's ordinal
was less than the partition. When a partition is specified, all Pods with an
ordinal that is greater than or equal to the partition will be updated when the
StatefulSet's `.spec.template` is updated. If a Pod that has an ordinal less
than the partition is deleted or otherwise terminated, it will be restored to
its original configuration.

#### Phased Roll Outs
You can perform a phased roll out (e.g. a linear, geometric, or exponential
roll out) using a partitioned rolling update in a similar manner to how you
rolled out a [canary](#rolling-out-a-canary). To perform a phased roll out, set
the `partition` to the ordinal at which you want the controller to pause the
update.

The partition is currently set to `2`. Set the partition to `0`.
-->

`web-1` 被按照原來的配置恢復，因為 Pod 的序號小於分割槽。當指定了分割槽時，如果更新了 StatefulSet 的 `.spec.template`，則所有序號大於或等於分割槽的 Pod 都將被更新。
如果一個序號小於分割槽的 Pod 被刪除或者終止，它將被按照原來的配置恢復。


#### 分階段的釋出

你可以使用類似[灰度釋出](#灰度釋出)的方法執行一次分階段的釋出（例如一次線性的、等比的或者指數形式的釋出）。
要執行一次分階段的釋出，你需要設定 `partition` 為希望控制器暫停更新的序號。


分割槽當前為`2`。請將分割槽設定為`0`。

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for all of the Pods in the StatefulSet to become Running and Ready.
-->

等待 StatefulSet 中的所有 Pod 變成 Running 和 Ready。

```shell
kubectl get pod -l app=nginx -w
```
<!--
The output is similar to:
-->
輸出類似於：
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3m
web-1     0/1       ContainerCreating   0          11s
web-2     1/1       Running             0          2m
web-1     1/1       Running   0         18s
web-0     1/1       Terminating   0         3m
web-0     1/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```
<!--
Get the Pod's containers.
-->

獲取 Pod 的容器。

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
k8s.gcr.io/nginx-slim:0.7
k8s.gcr.io/nginx-slim:0.7
k8s.gcr.io/nginx-slim:0.7
```

<!--
By moving the `partition` to `0`, you allowed the StatefulSet controller to
continue the update process.

### On Delete

The `OnDelete` update strategy implements the legacy (1.6 and prior) behavior,
When you select this update strategy, the StatefulSet controller will not
automatically update Pods when a modification is made to the StatefulSet's
`.spec.template` field. This strategy can be selected by setting the
`.spec.template.updateStrategy.type` to `OnDelete`.


## Deleting StatefulSets

StatefulSet supports both Non-Cascading and Cascading deletion. In a
Non-Cascading Delete, the StatefulSet's Pods are not deleted when the StatefulSet is deleted. In a Cascading Delete, both the StatefulSet and its Pods are
deleted.

### Non-Cascading Delete

In one terminal window, watch the Pods in the StatefulSet.
-->

將 `partition` 改變為 `0` 以允許 StatefulSet 控制器繼續更新過程。

### On Delete 策略

`OnDelete` 更新策略實現了傳統（1.7 之前）行為，它也是預設的更新策略。
當你選擇這個更新策略並修改 StatefulSet 的 `.spec.template` 欄位時，StatefulSet 控制器將不會自動的更新 Pod。

## 刪除 StatefulSet


StatefulSet 同時支援級聯和非級聯刪除。使用非級聯方式刪除 StatefulSet 時，StatefulSet 的 Pod 不會被刪除。使用級聯刪除時，StatefulSet 和它的 Pod 都會被刪除。


### 非級聯刪除


在一個終端視窗檢視 StatefulSet 中的 Pod。

```
kubectl get pods -w -l app=nginx
```

<!--
Use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete the
StatefulSet. Make sure to supply the `--cascade=orphan` parameter to the
command. This parameter tells Kubernetes to only delete the StatefulSet, and to
not delete any of its Pods.
-->

使用 [`kubectl delete`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#delete) 刪除 StatefulSet。
請確保提供了 `--cascade=orphan` 引數給命令。這個引數告訴 Kubernetes 只刪除 StatefulSet 而不要刪除它的任何 Pod。

```shell
kubectl delete statefulset web --cascade=orphan
```
```
statefulset.apps "web" deleted
```

<!--
Get the Pods to examine their status.
-->

獲取 Pod 來檢查他們的狀態。

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

<!--
Even though `web` has been deleted, all of the Pods are still Running and Ready.
Delete `web-0`.
-->

雖然 `web`  已經被刪除了，但所有 Pod 仍然處於 Running 和 Ready 狀態。
刪除 `web-0`。

```shell
kubectl delete pod web-0
```
```
pod "web-0" deleted
```

<!--
Get the StatefulSet's Pods.
-->

獲取 StatefulSet 的 Pod。

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

<!--
As the `web` StatefulSet has been deleted, `web-0` has not been relaunched.

In one terminal, watch the StatefulSet's Pods.
-->

由於 `web` StatefulSet 已經被刪除，`web-0`沒有被重新啟動。


在一個終端監控 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In a second terminal, recreate the StatefulSet. Note that, unless
you deleted the `nginx` Service ( which you should not have ), you will see
an error indicating that the Service already exists.
-->
在另一個終端裡重新建立 StatefulSet。請注意，除非你刪除了 `nginx` Service （你不應該這樣做），你將會看到一個錯誤，提示 Service 已經存在。

```shell
kubectl apply -f web.yaml
```
```
statefulset.apps/web created
service/nginx unchanged
```
<!--
Ignore the error. It only indicates that an attempt was made to create the nginx
Headless Service even though that Service already exists.

Examine the output of the `kubectl get` command running in the first terminal.
-->

請忽略這個錯誤。它僅表示 kubernetes 進行了一次建立 nginx Headless Service 的嘗試，儘管那個 Service 已經存在。


在第一個終端中執行並檢查 `kubectl get` 命令的輸出。

```shell
kubectl get pods -w -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          16m
web-2     1/1       Running   0          2m
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         18s
web-2     1/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
```

<!--
When the `web` StatefulSet was recreated, it first relaunched `web-0`.
Since `web-1` was already Running and Ready, when `web-0` transitioned to
Running and Ready, it adopted this Pod. Since you recreated the StatefulSet
with `replicas` equal to 2, once `web-0` had been recreated, and once
`web-1` had been determined to already be Running and Ready, `web-2` was
terminated.

Let's take another look at the contents of the `index.html` file served by the
Pods' webservers:
-->

當重新建立 `web` StatefulSet 時，`web-0` 被第一個重新啟動。
由於 `web-1` 已經處於 Running 和 Ready 狀態，當 `web-0` 變成 Running 和 Ready 時，
StatefulSet 會接收這個 Pod。由於你重新建立的 StatefulSet 的 `replicas` 等於 2，
一旦 `web-0` 被重新建立並且 `web-1` 被認為已經處於 Running 和 Ready 狀態時，`web-2` 將會被終止。


讓我們再看看被 Pod 的 web 伺服器載入的 `index.html` 的內容：

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

<!--
Even though you deleted both the StatefulSet and the `web-0` Pod, it still
serves the hostname originally entered into its `index.html` file. This is
because the StatefulSet never deletes the PersistentVolumes associated with a
Pod. When you recreated the StatefulSet and it relaunched `web-0`, its original
PersistentVolume was remounted.

### Cascading Delete

In one terminal window, watch the Pods in the StatefulSet.
-->

儘管你同時刪除了 StatefulSet 和 `web-0` Pod，但它仍然使用最初寫入 `index.html` 檔案的主機名進行服務。
這是因為 StatefulSet 永遠不會刪除和一個 Pod 相關聯的 PersistentVolumes。
當你重建這個 StatefulSet 並且重新啟動了 `web-0` 時，它原本的 PersistentVolume 會被重新掛載。


### 級聯刪除


在一個終端視窗觀察 StatefulSet 裡的 Pod。

```shell
kubectl get pods -w -l app=nginx
```

<!--
In another terminal, delete the StatefulSet again. This time, omit the
`--cascade=orphan` parameter.
-->

在另一個視窗中再次刪除這個 StatefulSet。這次省略 `--cascade=orphan` 引數。

```shell
kubectl delete statefulset web
```

```
statefulset.apps "web" deleted
```

<!--
Examine the output of the `kubectl get` command running in the first terminal,
and wait for all of the Pods to transition to Terminating.
-->

在第一個終端檢查 `kubectl get` 命令的輸出，並等待所有的 Pod 變成 Terminating 狀態。

```shell
kubectl get pods -w -l app=nginx
```

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          11m
web-1     1/1       Running   0          27m
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0         29m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m

```

<!--
As you saw in the [Scaling Down](#scaling-down) section, the Pods
are terminated one at a time, with respect to the reverse order of their ordinal
indices. Before terminating a Pod, the StatefulSet controller waits for
the Pod's successor to be completely terminated.

Note that, while a cascading delete will delete the StatefulSet and its Pods,
it will not delete the Headless Service associated with the StatefulSet. You
must delete the `nginx` Service manually.
-->

如同你在[縮容](#ordered-pod-termination)一節看到的，Pod 按照和他們序號索引相反的順序每次終止一個。
在終止一個 Pod 前，StatefulSet 控制器會等待 Pod 後繼者被完全終止。


請注意，雖然級聯刪除會刪除 StatefulSet 和它的 Pod，但它並不會刪除和 StatefulSet 關聯的 Headless Service。你必須手動刪除`nginx` Service。

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

<!--
Recreate the StatefulSet and Headless Service one more time.
-->

再一次重新建立 StatefulSet 和 Headless Service。

```shell
kubectl apply -f web.yaml
```

```
service/nginx created
statefulset.apps/web created
```

<!--
When all of the StatefulSet's Pods transition to Running and Ready, retrieve
the contents of their `index.html` files.
-->

當 StatefulSet 所有的 Pod 變成 Running 和 Ready 時，獲取它們的 `index.html` 檔案的內容。

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

<!--
Even though you completely deleted the StatefulSet, and all of its Pods, the
Pods are recreated with their PersistentVolumes mounted, and `web-0` and
`web-1` will still serve their hostnames.

Finally delete the `web` StatefulSet and the `nginx` service.
-->

即使你已經刪除了 StatefulSet 和它的全部 Pod，這些 Pod 將會被重新建立並掛載它們的 PersistentVolumes，並且 `web-0` 和 `web-1` 將仍然使用它們的主機名提供服務。


最後刪除 `nginx` service...

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

... 並且刪除 `web` StatefulSet:

```shell
kubectl delete statefulset web
```

```
statefulset "web" deleted
```

<!--
## Pod Management Policy

For some distributed systems, the StatefulSet ordering guarantees are
unnecessary and/or undesirable. These systems require only uniqueness and
identity. To address this, in Kubernetes 1.7, we introduced
`.spec.podManagementPolicy` to the StatefulSet API Object.

### OrderedReady Pod Management

`OrderedReady` pod management is the default for StatefulSets. It tells the
StatefulSet controller to respect the ordering guarantees demonstrated
above.

### Parallel Pod Management

`Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and not to wait for Pods to become Running
and Ready or completely terminated prior to launching or terminating another
Pod. This option only affects the behavior for scaling operations. Updates are not affected.
-->

## Pod 管理策略



對於某些分散式系統來說，StatefulSet 的順序性保證是不必要和/或者不應該的。
這些系統僅僅要求唯一性和身份標誌。為了解決這個問題，在 Kubernetes 1.7 中
我們針對 StatefulSet API 物件引入了 `.spec.podManagementPolicy`。
此選項僅影響擴縮操作的行為。更新不受影響。

### OrderedReady Pod 管理策略


`OrderedReady` pod 管理策略是 StatefulSets 的預設選項。它告訴 StatefulSet 控制器遵循上文展示的順序性保證。


### Parallel Pod 管理策略


`Parallel` pod 管理策略告訴 StatefulSet 控制器並行的終止所有 Pod，
在啟動或終止另一個 Pod 前，不必等待這些 Pod 變成 Running 和 Ready 或者完全終止狀態。

{{< codenew file="application/web/web-parallel.yaml" >}}

<!--
Download the example above, and save it to a file named `web-parallel.yaml`

This manifest is identical to the one you downloaded above except that the `.spec.podManagementPolicy`
of the `web` StatefulSet is set to `Parallel`.

In one terminal, watch the Pods in the StatefulSet.
-->

下載上面的例子並儲存為 `web-parallel.yaml`。


這份清單和你在上文下載的完全一樣，只是 `web` StatefulSet 的 `.spec.podManagementPolicy` 設定成了 `Parallel`。


在一個終端視窗檢視 StatefulSet 中的 Pod。

```shell
kubectl get po -lapp=nginx -w
```

<!--
In another terminal, create the StatefulSet and Service in the manifest:
-->

在另一個終端視窗建立清單中的 StatefulSet 和 Service：

```shell
kubectl apply -f web-parallel.yaml
```
```
service/nginx created
statefulset.apps/web created
```

<!--
Examine the output of the `kubectl get` command that you executed in the first terminal.
-->

檢視你在第一個終端中執行的 `kubectl get` 命令的輸出。

```shell
kubectl get pod -l app=nginx -w
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-1     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
web-1     1/1       Running   0         10s
```

<!--
The StatefulSet controller launched both `web-0` and `web-1` at the same time.

Keep the second terminal open, and, in another terminal window scale the
StatefulSet.
-->

StatefulSet 控制器同時啟動了 `web-0` 和 `web-1`。

保持第二個終端開啟，並在另一個終端視窗中擴容 StatefulSet。

```shell
kubectl scale statefulset/web --replicas=4
```
```
statefulset.apps/web scaled
```

<!--
Examine the output of the terminal where the `kubectl get` command is running.
-->

在 `kubectl get` 命令執行的終端裡檢查它的輸出。

```
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     1/1       Running   0         10s
web-3     1/1       Running   0         26s
```

<!--
The StatefulSet launched two new Pods, and it did not wait for
the first to become Running and Ready prior to launching the second.

## {{% heading "cleanup" %}}

You should have two terminals open, ready for you to run `kubectl` commands as
part of cleanup.
-->

StatefulSet 啟動了兩個新的 Pod，而且在啟動第二個之前並沒有等待第一個變成 Running 和 Ready 狀態。

## {{% heading "cleanup" %}}

你應該開啟兩個終端，準備在清理過程中執行 `kubectl` 命令。

```shell
kubectl delete sts web
# sts is an abbreviation for statefulset
```

<!--
You can watch `kubectl get` to see those Pods being deleted.
-->

你可以監測 `kubectl get` 來檢視那些 Pod 被刪除

```shell
kubectl get pod -l app=nginx -w
```
```
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-1     1/1       Terminating   0         44m
web-0     1/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
```

<!--
The StatefulSet controller deletes all Pods concurrently, it does not wait for
a Pod's ordinal successor to terminate prior to deleting that Pod.

Close the terminal where the `kubectl get` command is running and delete the `nginx`
Service.
-->

StatefulSet 控制器將併發的刪除所有 Pod，在刪除一個 Pod 前不會等待它的順序後繼者終止。


關閉 `kubectl get` 命令執行的終端並刪除`nginx` Service。

```shell
kubectl delete svc nginx
```



## {{% heading "cleanup" %}}


<!--
You also need to delete the persistent storage media for the PersistentVolumes
used in this tutorial.


Follow the necessary steps, based on your environment, storage configuration,
and provisioning method, to ensure that all storage is reclaimed.
-->

你需要刪除本教程中用到的 PersistentVolumes 的持久化儲存介質。基於你的環境、儲存配置和提供方式，按照必須的步驟保證回收所有的儲存。



