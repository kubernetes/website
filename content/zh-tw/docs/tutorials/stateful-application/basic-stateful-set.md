---
title: StatefulSet 基礎
content_type: tutorial
weight: 10
---
<!--
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: StatefulSet Basics
content_type: tutorial
weight: 10
-->

<!-- overview -->

<!--
This tutorial provides an introduction to managing applications with
{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
It demonstrates how to create, delete, scale, and update the Pods of StatefulSets.
-->
本教程介紹瞭如何使用
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
來管理應用。
演示瞭如何創建、刪除、擴容/縮容和更新 StatefulSet 的 Pod。

## {{% heading "prerequisites" %}}

<!--
Before you begin this tutorial, you should familiarize yourself with the
following Kubernetes concepts:
-->
在開始本教程之前，你應該熟悉以下 Kubernetes 的概念：

<!--
* [Pods](/docs/concepts/workloads/pods/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
* The [kubectl](/docs/reference/kubectl/kubectl/) command line tool
-->
* [Pod](/zh-cn/docs/concepts/workloads/pods/)
* [Cluster DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
* [Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 命令列工具

{{% include "task-tutorial-prereqs.md" %}}
<!--
You should configure `kubectl` to use a context that uses the `default`
namespace.
If you are using an existing cluster, make sure that it's OK to use that
cluster's default namespace to practice. Ideally, practice in a cluster
that doesn't run any real workloads.

It's also useful to read the concept page about [StatefulSets](/docs/concepts/workloads/controllers/statefulset/).
-->
你應該設定 `kubectl` 的上下文使用 `default` 命名空間。
如果你使用的是現有叢集，請確保可以使用該叢集的 `default` 命名空間進行練習。
理想情況下，在沒有運行任何實際工作負載的叢集中進行練習。

閱讀有關 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
的概念頁面也很有用。

{{< note >}}
<!--
This tutorial assumes that your cluster is configured to dynamically provision
PersistentVolumes. You'll also need to have a [default StorageClass](/docs/concepts/storage/storage-classes/#default-storageclass).
If your cluster is not configured to provision storage dynamically, you
will have to manually provision two 1 GiB volumes prior to starting this
tutorial and
set up your cluster so that those PersistentVolumes map to the
PersistentVolumeClaim templates that the StatefulSet defines.
-->
本教程假設你的叢集被設定爲動態製備 PersistentVolume 卷，
且有一個[預設 StorageClass](/zh-cn/docs/concepts/storage/storage-classes/#default-storageclass)。
如果沒有這樣設定，在開始本教程之前，你需要手動準備 2 個 1 GiB 的儲存卷，
以便這些 PersistentVolume 可以映射到 StatefulSet 定義的 PersistentVolumeClaim 模板。
{{< /note >}}

## {{% heading "objectives" %}}

<!--
StatefulSets are intended to be used with stateful applications and distributed
systems. However, the administration of stateful applications and
distributed systems on Kubernetes is a broad, complex topic. In order to
demonstrate the basic features of a StatefulSet, and not to conflate the former
topic with the latter, you will deploy a simple web application using a StatefulSet.
-->
StatefulSet 旨在與有狀態的應用及分佈式系統一起使用。然而在 Kubernetes
上管理有狀態應用和分佈式系統是一個寬泛而複雜的話題。
爲了演示 StatefulSet 的基本特性，並且不使前後的主題混淆，你將會使用 StatefulSet 部署一個簡單的 Web 應用。

<!--
After this tutorial, you will be familiar with the following.
-->
在閱讀本教程後，你將熟悉以下內容：

<!--
* How to create a StatefulSet
* How a StatefulSet manages its Pods
* How to delete a StatefulSet
* How to scale a StatefulSet
* How to update a StatefulSet's Pods
-->
* 如何創建 StatefulSet
* StatefulSet 怎樣管理它的 Pod
* 如何刪除 StatefulSet
* 如何對 StatefulSet 進行擴容/縮容
* 如何更新一個 StatefulSet 的 Pod

<!-- lessoncontent -->

<!--
## Creating a StatefulSet
-->
## 創建 StatefulSet   {#creating-a-statefulset}

<!--
Begin by creating a StatefulSet (and the Service that it relies upon) using
the example below. It is similar to the example presented in the
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) concept.
It creates a [headless Service](/docs/concepts/services-networking/service/#headless-services),
`nginx`, to publish the IP addresses of Pods in the StatefulSet, `web`.
-->
作爲開始，使用如下示例創建一個 StatefulSet（以及它所依賴的 Service）。它和
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中的示例相似。
它創建了一個 [Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
`nginx` 用來發布 StatefulSet `web` 中的 Pod 的 IP 地址。

{{% code_sample file="application/web/web.yaml" %}}

<!--
You will need to use at least two terminal windows. In the first terminal, use
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to {{< glossary_tooltip text="watch" term_id="watch" >}} the creation
of the StatefulSet's Pods.
-->
你需要使用至少兩個終端窗口。在第一個終端中，使用
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)
來{{< glossary_tooltip text="監視" term_id="watch" >}} StatefulSet 的 Pod 的創建情況。

<!--
```shell
# use this terminal to run commands that specify --watch
# end this watch when you are asked to start a new watch
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 使用此終端運行指定 --watch 的命令
# 當你被要求開始一個新的 watch 時結束這個 watch
kubectl get pods --watch -l app=nginx
```

<!--
In the second terminal, use
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to create the
headless Service and StatefulSet.
-->
在另一個終端中，使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)
來創建 Headless Service 和 StatefulSet。

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```
```
service/nginx created
statefulset.apps/web created
```

<!--
The command above creates two Pods, each running an
[NGINX](https://www.nginx.com) webserver. Get the `nginx` Service...
-->
上面的命令創建了兩個 Pod，每個都運行了一個 [NGINX](https://www.nginx.com) Web 伺服器。
獲取 `nginx` Service：

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
然後獲取 `web` StatefulSet，以驗證兩者均已成功創建：

```shell
kubectl get statefulset web
```
```
NAME   READY   AGE
web    2/2     37s
```

<!--
### Ordered Pod creation
-->
### 順序創建 Pod   {#ordered-pod-creation}

<!--
A StatefulSet defaults to creating its Pods in a strict order.
-->
StatefulSet 預設以嚴格的順序創建其 Pod。

<!--
For a StatefulSet with _n_ replicas, when Pods are being deployed, they are
created sequentially, ordered from _{0..n-1}_. Examine the output of the
`kubectl get` command in the first terminal. Eventually, the output will
look like the example below.
-->
對於一個擁有 **n** 個副本的 StatefulSet，Pod 被部署時是按照 **{0..n-1}** 的序號順序創建的。
在第一個終端中使用 `kubectl get` 檢查輸出。這個輸出最終將看起來像下面的樣子。

<!--
```shell
# Do not start a new watch;
# this should already be running
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 不要開始一個新的 watch
# 這應該已經處於 Running 狀態
kubectl get pods --watch -l app=nginx
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
_Running_ (see [Pod Phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase))
and _Ready_ (see `type` in [Pod Conditions](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)).

Later in this tutorial you will practice [parallel startup](#parallel-pod-management).
-->
請注意，直到 `web-0` Pod 處於 **Running**（請參閱
[Pod 階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）
並 **Ready**（請參閱 [Pod 狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)中的
`type`）狀態後，`web-1` Pod 纔會被啓動。

在本教程的後面部分，你將練習[並行啓動](#parallel-pod-management)。

{{< note >}}
<!--
To configure the integer ordinal assigned to each Pod in a StatefulSet, see
[Start ordinal](/docs/concepts/workloads/controllers/statefulset/#start-ordinal).
-->
要設定分配給 StatefulSet 中每個 Pod 的整數序號，
請參閱[起始序號](/zh-cn/docs/concepts/workloads/controllers/statefulset/#start-ordinal)。
{{< /note >}}

<!--
## Pods in a StatefulSet
-->
## StatefulSet 中的 Pod   {#pods-in-a-statefulset}

<!--
Pods in a StatefulSet have a unique ordinal index and a stable network identity.
-->
StatefulSet 中的每個 Pod 擁有一個唯一的順序索引和穩定的網路身份標識。

<!--
### Examining the Pod's ordinal Index
-->
### 檢查 Pod 的順序索引   {#examining-the-pod-s-ordinal-index}

<!--
Get the StatefulSet's Pods:
-->
獲取 StatefulSet 的 Pod：

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
StatefulSet {{< glossary_tooltip term_id="controller" text="controller">}}.  
The Pods' names take the form `<statefulset name>-<ordinal index>`.
Since the `web` StatefulSet has two replicas, it creates two Pods, `web-0` and `web-1`.
-->
如同 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/) 概念中所提到的，
StatefulSet 中的每個 Pod 擁有一個具有黏性的、獨一無二的身份標誌。
這個標誌基於 StatefulSet
{{< glossary_tooltip term_id="controller" text="控制器">}}分配給每個
Pod 的唯一順序索引。
Pod 名稱的格式爲 `<statefulset 名稱>-<序號索引>`。
`web` StatefulSet 擁有兩個副本，所以它創建了兩個 Pod：`web-0` 和 `web-1`。

<!--
### Using Stable network Identities
-->
### 使用穩定的網路身份標識   {#using-stable-network-identities}

<!--
Each Pod has a stable hostname based on its ordinal index. Use
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) to execute the
`hostname` command in each Pod:
-->
每個 Pod 都擁有一個基於其順序索引的穩定的主機名。使用
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)
在每個 Pod 中執行 `hostname`：

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
addresses:
-->
使用 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run)
運行一個提供 `nslookup` 命令的容器，該命令來自於 `dnsutils` 包。
通過對 Pod 的主機名執行 `nslookup`，你可以檢查這些主機名在叢集內部的 DNS 地址：

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

<!--
which starts a new shell. In that new shell, run:
-->
這將啓動一個新的 Shell。在新 Shell 中運行：

```shell
# 在 dns-test 容器 Shell 中運行以下命令
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
(and now exit the container shell: `exit`)
-->
（現在可以退出容器 Shell：`exit`）

<!--
The CNAME of the headless service points to SRV records (one for each Pod that
is Running and Ready). The SRV records point to A record entries that
contain the Pods' IP addresses.
-->
Headless service 的 CNAME 指向 SRV 記錄（記錄每個 Running 和 Ready 狀態的 Pod）。
SRV 記錄指向一個包含 Pod IP 地址的記錄表項。

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一個終端中監視 StatefulSet 的 Pod：

<!--
```shell
# Start a new watch
# End this watch when you've seen that the delete is finished
kubectl get pod --watch -l app=nginx
```
-->
```shell
# 啓動一個新的 watch
# 當你看到刪除完成後結束這個 watch
kubectl get pod --watch -l app=nginx
```

<!--
In a second terminal, use
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete all
the Pods in the StatefulSet:
-->
在另一個終端中使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)
刪除 StatefulSet 中所有的 Pod：

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Wait for the StatefulSet to restart them, and for both Pods to transition to
Running and Ready:
-->
等待 StatefulSet 重啓它們，並且兩個 Pod 都變成 Running 和 Ready 狀態：

<!--
```shell
# This should already be running
kubectl get pod --watch -l app=nginx
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod --watch -l app=nginx
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
Use `kubectl exec` and `kubectl run` to view the Pods' hostnames and in-cluster
DNS entries. First, view the Pods' hostnames:
-->
使用 `kubectl exec` 和 `kubectl run` 查看 Pod 的主機名和叢集內部的 DNS 表項。
首先，查看 Pod 的主機名：

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
然後，運行：

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

<!--
which starts a new shell.  
In that new shell, run:
-->
這將啓動一個新的 Shell。在新 Shell 中，運行：

<!--
```shell
# Run this in the dns-test container shell
nslookup web-0.nginx
```
-->
```shell
# 在 dns-test 容器 Shell 中運行以下命令
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
(and now exit the container shell: `exit`)
-->
（現在可以退出容器 Shell：`exit`）

<!--
The Pods' ordinals, hostnames, SRV records, and A record names have not changed,
but the IP addresses associated with the Pods may have changed. In the cluster
used for this tutorial, they have. This is why it is important not to configure
other applications to connect to Pods in a StatefulSet by the IP address
of a particular Pod (it is OK to connect to Pods by resolving their hostname).
-->
Pod 的序號、主機名、SRV 條目和記錄名稱沒有改變，但和 Pod 相關聯的 IP 地址可能發生了改變。
在本教程中使用的叢集中它們就改變了。這就是爲什麼不要在其他應用中使用
StatefulSet 中特定 Pod 的 IP 地址進行連接，這點很重要
（可以通過解析 Pod 的主機名來連接到 Pod）。

<!--
#### Discovery for specific Pods in a StatefulSet
-->
#### 發現 StatefulSet 中特定的 Pod   {#discovery-for-specific-pods-in-a-statefulset}

<!--
If you need to find and connect to the active members of a StatefulSet, you
should query the CNAME of the headless Service
(`nginx.default.svc.cluster.local`). The SRV records associated with the
CNAME will contain only the Pods in the StatefulSet that are Running and
Ready.
-->
如果你需要查找並連接一個 StatefulSet 的活動成員，你應該查詢 Headless Service 的 CNAME。
和 CNAME 相關聯的 SRV 記錄只會包含 StatefulSet 中處於 Running 和 Ready 狀態的 Pod。

<!--
If your application already implements connection logic that tests for
liveness and readiness, you can use the SRV records of the Pods (
`web-0.nginx.default.svc.cluster.local`,
`web-1.nginx.default.svc.cluster.local`), as they are stable, and your
application will be able to discover the Pods' addresses when they transition
to Running and Ready.
-->
如果你的應用已經實現了用於測試是否已存活（liveness）並就緒（readiness）的連接邏輯，
你可以使用 Pod 的 SRV 記錄（`web-0.nginx.default.svc.cluster.local`、
`web-1.nginx.default.svc.cluster.local`）。因爲它們是穩定的，並且當你的
Pod 的狀態變爲 Running 和 Ready 時，你的應用就能夠發現它們的地址。

<!--
If your application wants to find any healthy Pod in a StatefulSet,
and therefore does not need to track each specific Pod,
you could also connect to the IP address of a `type: ClusterIP` Service,
backed by the Pods in that StatefulSet. You can use the same Service that
tracks the StatefulSet (specified in the `serviceName` of the StatefulSet)
or a separate Service that selects the right set of Pods.
-->
如果你的應用程式想要在 StatefulSet 中找到任一健康的 Pod，
且不需要跟蹤每個特定的 Pod，你還可以連接到由該 StatefulSet 中的 Pod 關聯的
`type: ClusterIP` Service 的 IP 地址。
你可以使用跟蹤 StatefulSet 的同一 Service
（StatefulSet 中 `serviceName` 所指定的）或選擇正確的 Pod 集的單獨 Service。

<!--
### Writing to stable Storage
-->
### 寫入穩定的儲存   {#writing-to-stable-storage}

<!--
Get the PersistentVolumeClaims for `web-0` and `web-1`:
-->
獲取 `web-0` 和 `web-1` 的 PersistentVolumeClaims：

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
The StatefulSet controller created two
{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}
that are bound to two
{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}.
-->
StatefulSet 控制器創建了兩個
{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}，
綁定到兩個
{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}。

<!--
As the cluster used in this tutorial is configured to dynamically provision PersistentVolumes,
the PersistentVolumes were created and bound automatically.
-->
由於本教程使用的叢集設定爲動態製備
PersistentVolume 卷，所有的 PersistentVolume 卷都是自動創建和綁定的。

<!--
The NGINX webserver, by default, serves an index file from
`/usr/share/nginx/html/index.html`. The `volumeMounts` field in the
StatefulSet's `spec` ensures that the `/usr/share/nginx/html` directory is
backed by a PersistentVolume.
-->
NginX Web 伺服器預設會加載位於 `/usr/share/nginx/html/index.html` 的 index 檔案。
StatefulSet `spec` 中的 `volumeMounts` 字段保證了 `/usr/share/nginx/html`
檔案夾由一個 PersistentVolume 卷支持。

<!--
Write the Pods' hostnames to their `index.html` files and verify that the NGINX
webservers serve the hostnames:
-->
將 Pod 的主機名寫入它們的 `index.html` 檔案並驗證 NginX Web 伺服器使用該主機名提供服務：

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
掛載的目錄的權限，先運行：

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

<!--
before retrying the `curl` command above.
-->
再重新嘗試上面的 `curl` 命令。
{{< /note >}}

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一個終端監視 StatefulSet 的 Pod：

```shell
kubectl get pod -w -l app=nginx
```

<!--
In a second terminal, delete all of the StatefulSet's Pods:
-->
在另一個終端刪除 StatefulSet 所有的 Pod：

<!--
```shell
# End this watch when you've reached the end of the section.
# At the start of "Scaling a StatefulSet" you'll start a new watch.
kubectl get pod --watch -l app=nginx
```
-->
-->
```shell
# 當你到達該部分的末尾時結束此 watch
# 在開始“擴展 StatefulSet” 時，你將啓動一個新的 watch。
kubectl get pod --watch -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

<!--
Examine the output of the `kubectl get` command in the first terminal, and wait
for all of the Pods to transition to Running and Ready.
-->
在第一個終端裏檢查 `kubectl get` 命令的輸出，等待所有 Pod 變成 Running 和 Ready 狀態。

<!--
```shell
# This should already be running
kubectl get pod --watch -l app=nginx
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod --watch -l app=nginx
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
Verify the web servers continue to serve their hostnames:
-->
驗證所有 Web 伺服器在繼續使用它們的主機名提供服務：

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
node `web-0` and `web-1` are scheduled on, their PersistentVolumes will be
mounted to the appropriate mount points.
-->
雖然 `web-0` 和 `web-1` 被重新調度了，但它們仍然繼續監聽各自的主機名，因爲和它們的
PersistentVolumeClaim 相關聯的 PersistentVolume 卷被重新掛載到了各自的 `volumeMount` 上。
不管 `web-0` 和 `web-1` 被調度到了哪個節點上，它們的 PersistentVolume 卷將會被掛載到合適的掛載點上。

<!--
## Scaling a StatefulSet
-->
## 擴容/縮容 StatefulSet   {#scaling-a-statefulset}

<!--
Scaling a StatefulSet refers to increasing or decreasing the number of replicas
(horizontal scaling).
This is accomplished by updating the `replicas` field. You can use either
[`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale) or
[`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch) to scale a StatefulSet.
-->
擴容/縮容 StatefulSet 指增加或減少它的副本數。這通過更新 `replicas` 字段完成（水平縮放）。
你可以使用 [`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale)
或者 [`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch)
來擴容/縮容一個 StatefulSet。

<!--
### Scaling up
-->
### 擴容   {#scaling-up}

<!--
Scaling up means adding more replicas.
Provided that your app is able to distribute work across the StatefulSet, the new
larger set of Pods can perform more of that work.
-->
擴容意味着添加更多副本。
如果你的應用程式能夠在整個 StatefulSet 範圍內分派工作，則新的更大的 Pod 集可以執行更多的工作。

<!--
In one terminal window, watch the Pods in the StatefulSet:
-->
在一個終端窗口監視 StatefulSet 的 Pod：

<!--
```shell
# If you already have a watch running, you can continue using that.
# Otherwise, start one.
# End this watch when there are 5 healthy Pods for the StatefulSet
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 如果你已經有一個正在運行的 wach，你可以繼續使用它。
# 否則，就啓動一個。
# 當 StatefulSet 有 5 個健康的 Pod 時結束此 watch
kubectl get pods --watch -l app=nginx
```

<!--
In another terminal window, use `kubectl scale` to scale the number of replicas
to 5:
-->
在另一個終端窗口使用 `kubectl scale` 擴展副本數爲 5：

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
在第一個 終端中檢查 `kubectl get` 命令的輸出，等待增加的 3 個 Pod 的狀態變爲 Running 和 Ready。

<!--
```shell
# This should already be running
kubectl get pod --watch -l app=nginx
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod --watch -l app=nginx
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
-->
StatefulSet 控制器擴展了副本的數量。
如同[創建 StatefulSet](#ordered-pod-creation) 所述，StatefulSet 按序號索引順序創建各個
Pod，並且會等待前一個 Pod 變爲 Running 和 Ready 纔會啓動下一個 Pod。

<!--
### Scaling down
-->
### 縮容   {#scaling-down}

<!--
Scaling down means reducing the number of replicas. For example, you
might do this because the level of traffic to a service has decreased,
and at the current scale there are idle resources.
-->
縮容意味着減少副本數量。
例如，你可能因爲服務的流量水平已降低並且在當前規模下存在空閒資源的原因執行縮容操作。

<!--
In one terminal, watch the StatefulSet's Pods:
-->
在一個終端監視 StatefulSet 的 Pod：

<!--
```shell
kubectl get pods -w -l app=nginx
# End this watch when there are only 3 Pods for the StatefulSet
kubectl get pod --watch -l app=nginx
```
-->
```shell
kubectl get pods -w -l app=nginx
# 當 StatefulSet 只有 3 個 Pod 時結束此 watch
kubectl get pod --watch -l app=nginx
```

<!--
In another terminal, use `kubectl patch` to scale the StatefulSet back down to
three replicas:
-->
在另一個終端使用 `kubectl patch` 將 StatefulSet 縮容回三個副本：

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```
```
statefulset.apps/web patched
```

<!--
Wait for `web-4` and `web-3` to transition to Terminating.
-->
等待 `web-4` 和 `web-3` 狀態變爲 Terminating。

<!--
```shell
kubectl get pods -w -l app=nginx
# This should already be running
kubectl get pods --watch -l app=nginx
```
-->
```shell
kubectl get pods -w -l app=nginx
# 這應該已經處於 Running 狀態
kubectl get pods --watch -l app=nginx
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
### Ordered Pod termination
-->
### 順序終止 Pod   {#ordered-pod-termination}

<!--
The controller plane deleted one Pod at a time, in reverse order with respect
to its ordinal index, and it waited for each Pod to be completely shut down
before deleting the next one.
-->
控制器會按照與 Pod 序號索引相反的順序每次刪除一個 Pod。在刪除下一個 Pod 前會等待上一個被完全關閉。

<!--
Get the StatefulSet's PersistentVolumeClaims:
-->
獲取 StatefulSet 的 PersistentVolumeClaims：

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
When exploring a Pod's [stable storage](#writing-to-stable-storage), you saw that
the PersistentVolumes mounted to the Pods of a StatefulSet are not deleted when the
StatefulSet's Pods are deleted. This is still true when Pod deletion is caused by
scaling the StatefulSet down.
-->
五個 PersistentVolumeClaims 和五個 PersistentVolume 卷仍然存在。
查看 Pod 的[穩定儲存](#stable-storage)，你會發現當刪除 StatefulSet 的
Pod 時，掛載到 StatefulSet 的 Pod 的 PersistentVolume 卷不會被刪除。
當這種刪除行爲是由 StatefulSet 縮容引起時也是一樣的。

<!--
## Updating StatefulSets
-->
## 更新 StatefulSet   {#updating-statefulsets}

<!--
The StatefulSet controller supports automated updates.  The
strategy used is determined by the `spec.updateStrategy` field of the
StatefulSet API object. This feature can be used to upgrade the container
images, resource requests and/or limits, labels, and annotations of the Pods in a
StatefulSet.
-->
StatefulSet 控制器支持自動更新。
更新策略由 StatefulSet API 對象的 `spec.updateStrategy` 字段決定。這個特性能夠用來更新一個
StatefulSet 中 Pod 的容器映像檔、資源請求和限制、標籤和註解。

<!--
There are two valid update strategies, `RollingUpdate` (the default) and
`OnDelete`.
-->
有兩個有效的更新策略：`RollingUpdate`（預設）和 `OnDelete`。

<!--
### RollingUpdate {#rolling-update}
-->
### 滾動更新   {#rolling-update}

<!--
The `RollingUpdate` update strategy will update all Pods in a StatefulSet, in
reverse ordinal order, while respecting the StatefulSet guarantees.
-->
`RollingUpdate` 更新策略會更新一個 StatefulSet 中的所有
Pod，採用與序號索引相反的順序並遵循 StatefulSet 的保證。

<!--
You can split updates to a StatefulSet that uses the `RollingUpdate` strategy
into _partitions_, by specifying `.spec.updateStrategy.rollingUpdate.partition`.
You'll practice that later in this tutorial.

First, try a simple rolling update.
-->
你可以通過指定 `.spec.updateStrategy.rollingUpdate.partition` 將使用 `RollingUpdate`
策略的 StatefulSet 的更新拆分爲多個**分區**。你將在本教程中稍後練習此操作。

首先，嘗試一個簡單的滾動更新。

<!--
In one terminal window, patch the `web` StatefulSet to change the container
image again:
-->
在一個終端窗口中對 `web` StatefulSet 執行 patch 操作來再次改變容器映像檔：

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.24"}]'
```
```
statefulset.apps/web patched
```

<!--
In another terminal, watch the Pods in the StatefulSet:
-->
在另一個終端監控 StatefulSet 中的 Pod：

<!--
```shell
# End this watch when the rollout is complete
#
# If you're not sure, leave it running one more minute
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 滾動完成後結束此 watch
#
# 如果你不確定，請讓它再運行一分鐘
kubectl get pod -l app=nginx --watch
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
that Pod's existing version.
-->
StatefulSet 裏的 Pod 採用和序號相反的順序更新。在更新下一個 Pod 前，StatefulSet
控制器終止每個 Pod 並等待它們變成 Running 和 Ready。
請注意，雖然在順序後繼者變成 Running 和 Ready 之前 StatefulSet 控制器不會更新下一個
Pod，但它仍然會重建任何在更新過程中發生故障的 Pod，使用的是它們現有的版本。

<!--
Pods that have already received the update will be restored to the updated version,
and Pods that have not yet received the update will be restored to the previous
version. In this way, the controller attempts to continue to keep the application
healthy and the update consistent in the presence of intermittent failures.
-->
已經接收到更新請求的 Pod 將會被恢復爲更新的版本，沒有收到請求的 Pod 則會被恢復爲之前的版本。
像這樣，控制器嘗試繼續使應用保持健康並在出現間歇性故障時保持更新的一致性。

<!--
Get the Pods to view their container images:
-->
獲取 Pod 來查看它們的容器映像檔：

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24
```

<!--
All the Pods in the StatefulSet are now running the previous container image.
-->
StatefulSet 中的所有 Pod 現在都在運行之前的容器映像檔。

{{< note >}}
<!--
You can also use `kubectl rollout status sts/<name>` to view
the status of a rolling update to a StatefulSet
-->
你還可以使用 `kubectl rollout status sts/<名稱>` 來查看
StatefulSet 的滾動更新狀態。
{{< /note >}}

<!--
#### Staging an update
-->
#### 分段更新   {#staging-an-update}

<!--
You can split updates to a StatefulSet that uses the `RollingUpdate` strategy
into _partitions_, by specifying `.spec.updateStrategy.rollingUpdate.partition`.
-->
你可以通過指定 `.spec.updateStrategy.rollingUpdate.partition` 將使用 `RollingUpdate` 策略的
StatefulSet 的更新拆分爲多個**分區**。

<!--
For more context, you can read [Partitioned rolling updates](/docs/concepts/workloads/controllers/statefulset/#partitions)
in the StatefulSet concept page.
-->
有關更多上下文，你可以閱讀 StatefulSet
概念頁面中的[分區滾動更新](/zh-cn/docs/concepts/workloads/controllers/statefulset/#partitions)。

<!--
You can stage an update to a StatefulSet by using the `partition` field within
`.spec.updateStrategy.rollingUpdate`.
For this update, you will keep the existing Pods in the StatefulSet
unchanged whilst you change the pod template for the StatefulSet.
Then you - or, outside of a tutorial, some external automation - can
trigger that prepared update.
-->
你可以使用 `.spec.updateStrategy.rollingUpdate` 中的 `partition` 字段對 StatefulSet 執行更新的分段操作。
對於此更新，你將保持 StatefulSet 中現有 Pod 不變，同時更改 StatefulSet 的 Pod 模板。
然後，你（或通過教程之外的一些外部自動化工具）可以觸發準備好的更新。

<!--
First, patch the `web` StatefulSet to add a partition to the `updateStrategy` field:
-->
對 `web` StatefulSet 執行 Patch 操作，爲 `updateStrategy` 字段添加一個分區：

<!--
```shell
# The value of "partition" determines which ordinals a change applies to
# Make sure to use a number bigger than the last ordinal for the
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```
-->
```shell
# "partition" 的值決定更改適用於哪些序號
# 確保使用比 StatefulSet 的最後一個序號更大的數字
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```
```
statefulset.apps/web patched
```

<!--
Patch the StatefulSet again to change the container image that this
StatefulSet uses:
-->
再次 Patch StatefulSet 來改變此 StatefulSet 使用的容器映像檔：

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.21"}]'
```
```
statefulset.apps/web patched
```

<!--
Delete a Pod in the StatefulSet:
-->
刪除 StatefulSet 中的 Pod：

```shell
kubectl delete pod web-2
```
```
pod "web-2" deleted
```

<!--
Wait for the replacement `web-2` Pod to be Running and Ready:
-->
等待替代的 Pod 變成 Running 和 Ready。

<!--
```shell
# End the watch when you see that web-2 is healthy
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 當你看到 web-2 運行正常時結束 watch
kubectl get pod -l app=nginx --watch
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container image:
-->
獲取 Pod 的容器映像檔：

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.24
```

<!--
Notice that, even though the update strategy is `RollingUpdate` the StatefulSet
restored the Pod with the original container image. This is because the
ordinal of the Pod is less than the `partition` specified by the
`updateStrategy`.
-->
請注意，雖然更新策略是 `RollingUpdate`，StatefulSet 還是會使用原始的容器映像檔恢復 Pod。
這是因爲 Pod 的序號比 `updateStrategy` 指定的 `partition` 更小。

<!--
#### Rolling Out a canary
-->
#### 金絲雀發佈   {#rolling-out-a-canary}

<!--
You're now going to try a [canary rollout](https://glossary.cncf.io/canary-deployment/)
of that staged change.
-->
現在，你將嘗試對分段的變更進行[金絲雀發佈](https://glossary.cncf.io/canary-deployment/)。

<!--
You can roll out a canary (to test the modified template) by decrementing the `partition`
you specified [above](#staging-an-update).
-->
你可以通過減少[上文](#staging-an-update)指定的 `partition` 來進行金絲雀發佈，以測試修改後的模板。

<!--
Patch the StatefulSet to decrement the partition:
-->
通過 patch 命令修改 StatefulSet 來減少分區：

<!--
```shell
# The value of "partition" should match the highest existing ordinal for
# the StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```
-->
```shell
# “partition” 的值應與 StatefulSet 現有的最高序號相匹配
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```
```
statefulset.apps/web patched
```

<!--
The control plane triggers replacement for `web-2` (implemented by
a graceful **delete** followed by creating a new Pod once the deletion
is complete).
Wait for the new `web-2` Pod to be Running and Ready.
-->
控制平面會觸發 `web-2` 的替換（先優雅地**刪除**現有 Pod，然後在刪除完成後創建一個新的 Pod）。
等待新的 `web-2` Pod 變成 Running 和 Ready。

<!--
# This should already be running
kubectl get pod -l app=nginx --watch
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod -l app=nginx --watch
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

<!--
Get the Pod's container:
-->
獲取 Pod 的容器：

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.21
```

<!--
When you changed the `partition`, the StatefulSet controller automatically
updated the `web-2` Pod because the Pod's ordinal was greater than or equal to
the `partition`.
-->
當你改變 `partition` 時，StatefulSet 會自動更新 `web-2`
Pod，這是因爲 Pod 的序號大於或等於 `partition`。

<!--
Delete the `web-1` Pod:
-->
刪除 `web-1` Pod：

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

<!--
```shell
# This should already be running
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod -l app=nginx --watch
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
Get the `web-1` Pod's container image:
-->
獲取 `web-1` Pod 的容器映像檔：

```shell
kubectl get pod web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.24
```

<!--
`web-1` was restored to its original configuration because the Pod's ordinal
was less than the partition. When a partition is specified, all Pods with an
ordinal that is greater than or equal to the partition will be updated when the
StatefulSet's `.spec.template` is updated. If a Pod that has an ordinal less
than the partition is deleted or otherwise terminated, it will be restored to
its original configuration.
-->
`web-1` 被按照原來的設定恢復，因爲 Pod 的序號小於分區。當指定了分區時，如果更新了
StatefulSet 的 `.spec.template`，則所有序號大於或等於分區的 Pod 都將被更新。
如果一個序號小於分區的 Pod 被刪除或者終止，它將被按照原來的設定恢復。

<!--
#### Phased Roll outs
-->
#### 分階段的發佈   {#phased-roll-outs}

<!--
You can perform a phased roll out (e.g. a linear, geometric, or exponential
roll out) using a partitioned rolling update in a similar manner to how you
rolled out a [canary](#rolling-out-a-canary). To perform a phased roll out, set
the `partition` to the ordinal at which you want the controller to pause the
update.
-->
你可以使用類似[金絲雀發佈](#rolling-out-a-canary)的方法執行一次分階段的發佈
（例如一次線性的、等比的或者指數形式的發佈）。
要執行一次分階段的發佈，你需要設置 `partition` 爲希望控制器暫停更新的序號。

<!--
The partition is currently set to `2`. Set the partition to `0`:
-->
分區當前爲 `2`，請將其設置爲 `0`：

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

<!--
```shell
# This should already be running
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pod -l app=nginx --watch
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
Get the container image details for the Pods in the StatefulSet:
-->
獲取 StatefulSet 中 Pod 的容器映像檔詳細資訊：

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
```

<!--
By moving the `partition` to `0`, you allowed the StatefulSet to
continue the update process.
-->
將 `partition` 改變爲 `0` 以允許 StatefulSet 繼續更新過程。

<!--
### OnDelete {#on-delete}
-->
### OnDelete 策略   {#on-delete}

<!--
You select this update strategy for a StatefulSet by setting the
`.spec.template.updateStrategy.type` to `OnDelete`.

Patch the `web` StatefulSet to use the `OnDelete` update strategy:
-->
通過將 `.spec.template.updateStrategy.type` 設置爲 `OnDelete`，你可以爲 StatefulSet 選擇此更新策略。

對 `web` StatefulSet 執行 patch 操作，以使用 `OnDelete` 更新策略：

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```
```
statefulset.apps/web patched
```

<!--
When you select this update strategy, the StatefulSet controller does not
automatically update Pods when a modification is made to the StatefulSet's
`.spec.template` field. You need to manage the rollout yourself - either
manually, or using separate automation.
-->
當你選擇這個更新策略並修改 StatefulSet 的 `.spec.template` 字段時，StatefulSet 控制器將不會自動更新 Pod。
你需要自己手動管理發佈，或使用單獨的自動化工具來管理發佈。

<!--
## Deleting StatefulSets
-->
## 刪除 StatefulSet   {#deleting-statefulsets}

<!--
StatefulSet supports both _non-cascading_ and _cascading_ deletion. In a
non-cascading **delete**, the StatefulSet's Pods are not deleted when the
StatefulSet is deleted. In a cascading **delete**, both the StatefulSet and
its Pods are deleted.
-->
StatefulSet 同時支持**非級聯**和**級聯**刪除。使用非級聯方式**刪除** StatefulSet 時，StatefulSet
的 Pod 不會被刪除。使用級聯**刪除**時，StatefulSet 和它的 Pod 都會被刪除。

<!--
Read [Use Cascading Deletion in a Cluster](/docs/tasks/administer-cluster/use-cascading-deletion/)
to learn about cascading deletion generally.
-->
閱讀[在叢集中使用級聯刪除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/)，
以瞭解通用的級聯刪除。

<!--
### Non-cascading delete
-->
### 非級聯刪除   {#non-cascading-delete}

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一個終端窗口監視 StatefulSet 中的 Pod。

<!--
```
# End this watch when there are no Pods for the StatefulSet
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 當 StatefulSet 沒有 Pod 時結束此 watch
kubectl get pods --watch -l app=nginx
```

<!--
Use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) to delete the
StatefulSet. Make sure to supply the `--cascade=orphan` parameter to the
command. This parameter tells Kubernetes to only delete the StatefulSet, and to
**not** delete any of its Pods.
-->
使用 [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)
刪除 StatefulSet。請確保提供了 `--cascade=orphan` 參數給命令。這個參數告訴
Kubernetes 只刪除 StatefulSet 而**不要**刪除它的任何 Pod。

```shell
kubectl delete statefulset web --cascade=orphan
```
```
statefulset.apps "web" deleted
```

<!--
Get the Pods, to examine their status:
-->
獲取 Pod 來檢查它們的狀態：

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
Delete `web-0`:
-->
雖然 `web` 已經被刪除了，但所有 Pod 仍然處於 Running 和 Ready 狀態。
刪除 `web-0`：

```shell
kubectl delete pod web-0
```
```
pod "web-0" deleted
```

<!--
Get the StatefulSet's Pods:
-->
獲取 StatefulSet 的 Pod：

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
-->
由於 `web` StatefulSet 已經被刪除，`web-0` 沒有被重新啓動。

<!--
In one terminal, watch the StatefulSet's Pods.
-->
在一個終端監控 StatefulSet 的 Pod。

<!--
```shell
# Leave this watch running until the next time you start a watch
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 讓 watch 一直運行到你下次啓動 watch 爲止
kubectl get pods --watch -l app=nginx
```

<!--
In a second terminal, recreate the StatefulSet. Note that, unless
you deleted the `nginx` Service (which you should not have), you will see
an error indicating that the Service already exists.
-->
在另一個終端裏重新創建 StatefulSet。請注意，除非你刪除了 `nginx`
Service（你不應該這樣做），你將會看到一個錯誤，提示 Service 已經存在。

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```
```
statefulset.apps/web created
service/nginx unchanged
```

<!--
Ignore the error. It only indicates that an attempt was made to create the _nginx_
headless Service even though that Service already exists.
-->
請忽略這個錯誤。它僅表示 kubernetes 進行了一次創建 **nginx** Headless Service
的嘗試，儘管那個 Service 已經存在。

<!--
Examine the output of the `kubectl get` command running in the first terminal.
-->
在第一個終端中運行並檢查 `kubectl get` 命令的輸出。

<!--
```shell
# This should already be running
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pods --watch -l app=nginx
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
-->
當重新創建 `web` StatefulSet 時，`web-0` 被第一個重新啓動。
由於 `web-1` 已經處於 Running 和 Ready 狀態，當 `web-0` 變成 Running 和 Ready 時，
StatefulSet 會接收這個 Pod。由於你重新創建的 StatefulSet 的 `replicas` 等於 2，
一旦 `web-0` 被重新創建並且 `web-1` 被認爲已經處於 Running 和 Ready 狀態時，`web-2` 將會被終止。

<!--
Now take another look at the contents of the `index.html` file served by the
Pods' webservers:
-->
現在再看看被 Pod 的 Web 伺服器加載的 `index.html` 的內容：

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
-->
儘管你同時刪除了 StatefulSet 和 `web-0` Pod，但它仍然使用最初寫入 `index.html` 檔案的主機名進行服務。
這是因爲 StatefulSet 永遠不會刪除和一個 Pod 相關聯的 PersistentVolume 卷。
當你重建這個 StatefulSet 並且重新啓動了 `web-0` 時，它原本的 PersistentVolume 卷會被重新掛載。

<!--
### Cascading delete
-->
### 級聯刪除   {#cascading-delete}

<!--
In one terminal window, watch the Pods in the StatefulSet.
-->
在一個終端窗口監視 StatefulSet 裏的 Pod。

<!--
# Leave this running until the next page section
-->
```shell
# 讓它運行直到下一頁部分
kubectl get pods --watch -l app=nginx
```

<!--
In another terminal, delete the StatefulSet again. This time, omit the
`--cascade=orphan` parameter.
-->
在另一個窗口中再次刪除這個 StatefulSet，這次省略 `--cascade=orphan` 參數。

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

<!--
```shell
# This should already be running
kubectl get pods --watch -l app=nginx
```
-->
```shell
# 這應該已經處於 Running 狀態
kubectl get pods --watch -l app=nginx
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
-->
如同你在[縮容](#scaling-down)章節看到的，這些 Pod 按照與其序號索引相反的順序每次終止一個。
在終止一個 Pod 前，StatefulSet 控制器會等待 Pod 後繼者被完全終止。

{{< note >}}
<!--
Although a cascading delete removes a StatefulSet together with its Pods,
the cascade does **not** delete the headless Service associated with the StatefulSet.
You must delete the `nginx` Service manually.
-->
儘管級聯刪除會刪除 StatefulSet 及其 Pod，但級聯**不會**刪除與 StatefulSet
關聯的 Headless Service。你必須手動刪除 `nginx` Service。
{{< /note >}}

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

<!--
Recreate the StatefulSet and headless Service one more time:
-->
再一次重新創建 StatefulSet 和 Headless Service：

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```
service/nginx created
statefulset.apps/web created
```

<!--
When all of the StatefulSet's Pods transition to Running and Ready, retrieve
the contents of their `index.html` files:
-->
當 StatefulSet 所有的 Pod 變成 Running 和 Ready 時，獲取它們的 `index.html` 檔案的內容：

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
`web-1` continue to serve their hostnames.
-->
即使你已經刪除了 StatefulSet 和它的全部 Pod，這些 Pod 將會被重新創建並掛載它們的
PersistentVolume 卷，並且 `web-0` 和 `web-1` 將繼續使用它的主機名提供服務。

<!--
Finally, delete the `nginx` Service...
-->
最後刪除 `nginx` Service：

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

<!--
...and the `web` StatefulSet:
-->
並且刪除 `web` StatefulSet：

```shell
kubectl delete statefulset web
```

```
statefulset "web" deleted
```

<!--
## Pod Management policy
-->
## Pod 管理策略   {#pod-management-policy}

<!--
For some distributed systems, the StatefulSet ordering guarantees are
unnecessary and/or undesirable. These systems require only uniqueness and
identity.
-->
對於某些分佈式系統來說，StatefulSet 的順序性保證是不必要和/或者不應該的。
這些系統僅僅要求唯一性和身份標誌。

<!--
You can specify a [Pod management policy](/docs/concepts/workloads/controllers/statefulset/#pod-management-policies)
to avoid this strict ordering; either `OrderedReady` (the default), or `Parallel`.
-->
你可以指定 [Pod 管理策略](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-management-policies)
以避免這個嚴格的順序；
你可以選擇 `OrderedReady`（預設）或 `Parallel`。

<!--
### OrderedReady Pod management
-->
### OrderedReady Pod 管理策略   {#orderedready-pod-management}

<!--
`OrderedReady` pod management is the default for StatefulSets. It tells the
StatefulSet controller to respect the ordering guarantees demonstrated
above.
-->
`OrderedReady` Pod 管理策略是 StatefulSet 的預設選項。它告訴
StatefulSet 控制器遵循上文展示的順序性保證。

<!--
Use this when your application requires or expects that changes, such as rolling out a new
version of your application, happen in the strict order of the ordinal (pod number) that the StatefulSet provides.
In other words, if you have Pods `app-0`, `app-1` and `app-2`, Kubernetes will update `app-0` first and check it.
Once the checks are good, Kubernetes updates `app-1` and finally `app-2`.
-->
當你的應用程式需要或期望變更（例如推出應用程式的新版本）按照 StatefulSet
提供的序號（Pod 編號）的嚴格順序發生時，請使用此選項。
換句話說，如果你已經有了 Pod `app-0`、`app-1` 和 `app-2`，Kubernetes 將首先更新 `app-0` 並檢查它。
一旦檢查良好，Kubernetes 就會更新 `app-1`，最後更新 `app-2`。

<!--
If you added two more Pods, Kubernetes would set up `app-3` and wait for that to become healthy before deploying
`app-4`.

Because this is the default setting, you've already practised using it.
-->
如果你再添加兩個 Pod，Kubernetes 將設置 `app-3` 並等待其正常運行，然後再部署 `app-4`。

因爲這是預設設置，所以你已經在練習使用它，本教程不會讓你再次執行類似的步驟。

<!--
### Parallel Pod management
-->
### Parallel Pod 管理策略   {#parallel-pod-management}

<!--
The alternative, `Parallel` pod management tells the StatefulSet controller to launch or
terminate all Pods in parallel, and not to wait for Pods to become `Running`
and `Ready` or completely terminated prior to launching or terminating another
Pod.
-->
另一種選擇，`Parallel` Pod 管理策略告訴 StatefulSet 控制器並行的終止所有 Pod，
在啓動或終止另一個 Pod 前，不必等待這些 Pod 變成 Running 和 Ready 或者完全終止狀態。

<!--
The `Parallel` pod management option only affects the behavior for scaling operations. Updates are not affected;
Kubernetes still rolls out changes in order. For this tutorial, the application is very simple: a webserver that
tells you its hostname (because this is a StatefulSet, the hostname for each Pod is different and predictable).
-->
`Parallel` Pod 管理選項僅影響擴縮容操作的行爲。
變更操作不受其影響；Kubernetes 仍然按順序推出變更。
對於本教程，應用本身非常簡單：它是一個告訴你其主機名的網路伺服器（因爲這是一個
StatefulSet，每個 Pod 的主機名都是不同的且可預測的）。

{{% code_sample file="application/web/web-parallel.yaml" %}}

<!--
This manifest is identical to the one you downloaded above except that the `.spec.podManagementPolicy`
of the `web` StatefulSet is set to `Parallel`.
-->
這份清單和你在上文下載的完全一樣，只是 `web` StatefulSet 的
`.spec.podManagementPolicy` 設置成了 `Parallel`。

<!--
In one terminal, watch the Pods in the StatefulSet.
-->
在一個終端窗口監視 StatefulSet 中的 Pod。

<!--
```shell
# Leave this watch running until the end of the section
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 讓 watch 一直運行直到本節結束
kubectl get pod -l app=nginx --watch
```

<!--
In another terminal, reconfigure the StatefulSet for `Parallel` Pod management:
-->
在另一個終端中，重新設定 StatefulSet 以進行 `Parallel` Pod 管理：

```shell
kubectl apply -f https://k8s.io/examples/application/web/web-parallel.yaml
```
```
service/nginx updated
statefulset.apps/web updated
```

<!--
Keep the terminal open where you're running the watch. In another terminal window, scale the
StatefulSet:
-->
保持你運行監視進程的終端爲打開狀態，並在另一個終端窗口中擴容 StatefulSet：

```shell
kubectl scale statefulset/web --replicas=5
```
```
statefulset.apps/web scaled
```

<!--
Examine the output of the terminal where the `kubectl get` command is running. It may look something like
-->
在 `kubectl get` 命令運行的終端裏檢查它的輸出。它可能看起來像：

```
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-2     1/1       Running   0         8s
web-4     0/1       ContainerCreating   0         4s
web-3     1/1       Running   0         26s
web-4     1/1       Running   0         2s
```

<!--
The StatefulSet launched three new Pods, and it did not wait for
the first to become Running and Ready prior to launching the second and third Pods.
-->
StatefulSet 啓動了三個新的 Pod，而且在啓動第二和第三個之前並沒有等待第一個變成 Running 和 Ready 狀態。

<!--
This approach is useful if your workload has a stateful element, or needs Pods to be able to identify each other
with predictable naming, and especially if you sometimes need to provide a lot more capacity quickly. If this
simple web service for the tutorial suddenly got an extra 1,000,000 requests per minute then you would want to run
some more Pods - but you also would not want to wait for each new Pod to launch. Starting the extra Pods in parallel
cuts the time between requesting the extra capacity and having it available for use.
-->
如果你的工作負載具有有狀態元素，或者需要 Pod 能夠通過可預測的命名來相互識別，
特別是當你有時需要快速提供更多容量時，此方法非常有用。
如果本教程的這個簡單 Web 服務突然每分鐘收到額外 1,000,000 個請求，
那麼你可能會想要運行更多 Pod，但你也不想等待每個新 Pod 啓動。
並行啓動額外的 Pod 可以縮短請求額外容量和使其可供使用之間的時間。

## {{% heading "cleanup" %}}

<!--
You should have two terminals open, ready for you to run `kubectl` commands as
part of cleanup.
-->
你應該打開兩個終端，準備在清理過程中運行 `kubectl` 命令。

<!--
```shell
kubectl delete sts web
# sts is an abbreviation for statefulset
```
-->
```shell
kubectl delete sts web
# sts 是 statefulset 的縮寫
```

<!--
You can watch `kubectl get` to see those Pods being deleted.
-->
你可以監視 `kubectl get` 來查看那些 Pod 被刪除：

<!--
```shell
# end the watch when you've seen what you need to
kubectl get pod -l app=nginx --watch
```
-->
```shell
# 當你看到需要的內容後結束 watch
kubectl get pod -l app=nginx --watch
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
During deletion, a StatefulSet removes all Pods concurrently; it does not wait for
a Pod's ordinal successor to terminate prior to deleting that Pod.
-->
在刪除過程中，StatefulSet 將併發的刪除所有 Pod，在刪除一個
Pod 前不會等待它的順序後繼者終止。

<!--
Close the terminal where the `kubectl get` command is running and delete the `nginx`
Service:
-->
關閉 `kubectl get` 命令運行的終端並刪除 `nginx` Service：

```shell
kubectl delete svc nginx
```

<!--
Delete the persistent storage media for the PersistentVolumes used in this tutorial.
-->

刪除本教程中用到的 PersistentVolume 卷的持久化儲存介質：

```shell
kubectl get pvc
```
```
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
www-web-0   Bound    pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            standard       25m
www-web-1   Bound    pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            standard       24m
www-web-2   Bound    pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            standard       15m
www-web-3   Bound    pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            standard       15m
www-web-4   Bound    pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            standard       14m
```

```shell
kubectl get pv
```
```
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            Delete           Bound    default/www-web-3   standard                15m
pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            Delete           Bound    default/www-web-0   standard                25m
pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            Delete           Bound    default/www-web-4   standard                14m
pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            Delete           Bound    default/www-web-1   standard                24m
pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            Delete           Bound    default/www-web-2   standard                15m
```

```shell
kubectl delete pvc www-web-0 www-web-1 www-web-2 www-web-3 www-web-4
```

```
persistentvolumeclaim "www-web-0" deleted
persistentvolumeclaim "www-web-1" deleted
persistentvolumeclaim "www-web-2" deleted
persistentvolumeclaim "www-web-3" deleted
persistentvolumeclaim "www-web-4" deleted
```

```shell
kubectl get pvc
```

```
No resources found in default namespace.
```
{{< note >}}
<!--
You also need to delete the persistent storage media for the PersistentVolumes
used in this tutorial.
-->
你需要刪除本教程中用到的 PersistentVolume 卷的持久化儲存介質。

<!--
Follow the necessary steps, based on your environment, storage configuration,
and provisioning method, to ensure that all storage is reclaimed.
-->
基於你的環境、儲存設定和製備方式，按照必需的步驟保證回收所有的儲存。
{{< /note >}}
