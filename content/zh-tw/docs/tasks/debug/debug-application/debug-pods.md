---
title: 除錯 Pod
content_type: concept
weight: 10
---

<!-- 
reviewers:
- mikedanese
- thockin
title: Debug Pods
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
This guide is to help users debug applications that are deployed into Kubernetes and not behaving correctly.
This is *not* a guide for people who want to debug their cluster.  For that you should check out
[this guide](/docs/tasks/debug/debug-cluster).
-->

本指南幫助使用者除錯那些部署到 Kubernetes 上後沒有正常執行的應用。
本指南 **並非** 指導使用者如何除錯叢集。
如果想除錯叢集的話，請參閱[這裡](/zh-cn/docs/tasks/debug/debug-cluster)。


<!-- body -->

<!--
## Diagnosing the problem

The first step in troubleshooting is triage.  What is the problem?  Is it your Pods, your Replication Controller or
your Service?

   * [Debugging Pods](#debugging-pods)
   * [Debugging Replication Controllers](#debugging-replication-controllers)
   * [Debugging Services](#debugging-services)
-->
## 診斷問題   {#diagnosing-the-problem}

故障排查的第一步是先給問題分類。問題是什麼？是關於 Pod、Replication Controller 還是 Service？

* [除錯 Pod](#debugging-pods)
* [除錯 Replication Controller](#debugging-replication-controllers)
* [除錯 Service](#debugging-services)

<!--
### Debugging Pods

The first step in debugging a Pod is taking a look at it.  Check the current state of the Pod and recent events with the following command:
-->
### 除錯 Pod   {#debugging-pods}

除錯 Pod 的第一步是檢視 Pod 資訊。用如下命令檢視 Pod 的當前狀態和最近的事件：

```shell
kubectl describe pods ${POD_NAME}
```

<!--
Look at the state of the containers in the pod.  Are they all `Running`?  Have there been recent restarts?

Continue debugging depending on the state of the pods.
-->
檢視一下 Pod 中的容器所處的狀態。這些容器的狀態都是 `Running` 嗎？最近有沒有重啟過？

後面的除錯都是要依靠 Pod 的狀態的。

<!--
#### My pod stays pending

If a Pod is stuck in `Pending` it means that it can not be scheduled onto a node.  Generally this is because
there are insufficient resources of one type or another that prevent scheduling.  Look at the output of the
`kubectl describe ...` command above.  There should be messages from the scheduler about why it can not schedule
your pod.  Reasons include:
-->
#### Pod 停滯在 Pending 狀態

如果一個 Pod 停滯在 `Pending` 狀態，表示 Pod 沒有被排程到節點上。通常這是因為
某種型別的資源不足導致無法排程。
檢視上面的 `kubectl describe ...` 命令的輸出，其中應該顯示了為什麼沒被排程的原因。
常見原因如下：

<!--
* **You don't have enough resources**:  You may have exhausted the supply of CPU or Memory in your cluster, in this case
you need to delete Pods, adjust resource requests, or add new nodes to your cluster. See
[Compute Resources document](/docs/concepts/configuration/manage-resources-containers/) for more information.

* **You are using `hostPort`**:  When you bind a Pod to a `hostPort` there are a limited number of places that pod can be
scheduled.  In most cases, `hostPort` is unnecessary, try using a Service object to expose your Pod.  If you do require
`hostPort` then you can only schedule as many Pods as there are nodes in your Kubernetes cluster.
-->
* **資源不足**:
  你可能耗盡了叢集上所有的 CPU 或記憶體。此時，你需要刪除 Pod、調整資源請求或者為叢集新增節點。
  更多資訊請參閱[計算資源文件](/zh-cn/docs/concepts/configuration/manage-resources-containers/)

* **使用了 `hostPort`**:
  如果繫結 Pod 到 `hostPort`，那麼能夠執行該 Pod 的節點就有限了。
  多數情況下，`hostPort` 是非必要的，而應該採用 Service 物件來暴露 Pod。
  如果確實需要使用 `hostPort`，那麼叢集中節點的個數就是所能建立的 Pod
  的數量上限。

<!--
#### My pod stays waiting

If a Pod is stuck in the `Waiting` state, then it has been scheduled to a worker node, but it can't run on that machine.
Again, the information from `kubectl describe ...` should be informative.  The most common cause of `Waiting` pods is a failure to pull the image.  There are three things to check:

* Make sure that you have the name of the image correct.
* Have you pushed the image to the registry?
* Try to manually pull the image to see if the image can be pulled. For example,
  if you use Docker on your PC, run `docker pull <image>`.
-->
#### Pod 停滯在 Waiting 狀態

如果 Pod 停滯在 `Waiting` 狀態，則表示 Pod 已經被排程到某工作節點，但是無法在該節點上執行。
同樣，`kubectl describe ...` 命令的輸出可能很有用。
`Waiting` 狀態的最常見原因是拉取映象失敗。要檢查的有三個方面：

* 確保映象名字拼寫正確
* 確保映象已被推送到映象倉庫
* 嘗試手動是否能拉取映象。例如，如果你在你的 PC 上使用 Docker，請執行 `docker pull <映象>`。

<!--
#### My pod is crashing or otherwise unhealthy

Once your pod has been scheduled, the methods described in [Debug Running Pods](
/docs/tasks/debug/debug-application/debug-running-pod/) are available for debugging.
-->
#### Pod 處於 Crashing 或別的不健康狀態

一旦 Pod 被排程，就可以採用
[除錯執行中的 Pod](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)
中的方法來進一步除錯。

<!--
#### My pod is running but not doing what I told it to do

If your pod is not behaving as you expected, it may be that there was an error in your
pod description (e.g. `mypod.yaml` file on your local machine), and that the error
was silently ignored when you created the pod.  Often a section of the pod description
is nested incorrectly, or a key name is typed incorrectly, and so the key is ignored.
For example, if you misspelled `command` as `commnd` then the pod will be created but
will not use the command line you intended it to use.
-->
#### Pod 處於 Running 態但是沒有正常工作

如果 Pod 行為不符合預期，很可能 Pod 描述（例如你本地機器上的 `mypod.yaml`）中有問題，
並且該錯誤在建立 Pod 時被忽略掉，沒有報錯。
通常，Pod 的定義中節區巢狀關係錯誤、欄位名字拼錯的情況都會引起對應內容被忽略掉。
例如，如果你誤將 `command` 寫成 `commnd`，Pod 雖然可以建立，但它不會執行
你期望它執行的命令列。

<!--
The first thing to do is to delete your pod and try creating it again with the `--validate` option.
For example, run `kubectl apply --validate -f mypod.yaml`.
If you misspelled `command` as `commnd` then will give an error like this:
-->
可以做的第一件事是刪除你的 Pod，並嘗試帶有 `--validate` 選項重新建立。
例如，執行 `kubectl apply --validate -f mypod.yaml`。
如果 `command`  被誤拼成 `commnd`，你將會看到下面的錯誤資訊：

```
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

<!--
The next thing to check is whether the pod on the apiserver
matches the pod you meant to create (e.g. in a yaml file on your local machine).
For example, run `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` and then
manually compare the original pod description, `mypod.yaml` with the one you got
back from apiserver, `mypod-on-apiserver.yaml`.  There will typically be some
lines on the "apiserver" version that are not on the original version.  This is
expected.  However, if there are lines on the original that are not on the apiserver
version, then this may indicate a problem with your pod spec.
-->
接下來就要檢查的是 API 伺服器上的 Pod 與你所期望建立的是否匹配
（例如，你原本使用本機上的一個 YAML 檔案來建立 Pod）。
例如，執行 `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml`，之後
手動比較 `mypod.yaml` 與從 API 伺服器取回的 Pod 描述。
從 API 伺服器處獲得的 YAML 通常包含一些建立 Pod 所用的 YAML 中不存在的行，這是正常的。
不過，如果如果原始檔中有些行在 API 伺服器版本中不存在，則意味著
Pod 規約是有問題的。

<!--
### Debugging Replication Controllers

Replication controllers are fairly straightforward.  They can either create Pods or they can't.  If they can't
create pods, then please refer to the [instructions above](#debugging-pods) to debug your pods.

You can also use `kubectl describe rc ${CONTROLLER_NAME}` to introspect events related to the replication
controller.
-->
### 除錯副本控制器  {#debugging-replication-controllers}

副本控制器相對比較簡單直接。它們要麼能建立 Pod，要麼不能。
如果不能建立 Pod，請參閱[上述說明](#debugging-pods)除錯 Pod。

你也可以使用 `kubectl describe rc ${CONTROLLER_NAME}` 命令來檢視副本控制器相關的事件。

<!--
### Debugging Services

Services provide load balancing across a set of pods.  There are several common problems that can make Services
not work properly.  The following instructions should help debug Service problems.

First, verify that there are endpoints for the service. For every Service object, the apiserver makes an `endpoints` resource available.

You can view this resource with:
-->
### 除錯 Service   {#debugging-services}

服務支援在多個 Pod 間負載均衡。
有一些常見的問題可以造成服務無法正常工作。
以下說明將有助於除錯服務的問題。

首先，驗證服務是否有端點。對於每一個 Service 物件，API 伺服器為其提供
對應的 `endpoints` 資源。

透過如下命令可以檢視 endpoints 資源：

```shell
kubectl get endpoints ${SERVICE_NAME}
```

<!--
Make sure that the endpoints match up with the number of pods that you expect to be members of your service.
For example, if your Service is for an nginx container with 3 replicas, you would expect to see three different
IP addresses in the Service's endpoints.
-->
確保 Endpoints 與服務成員 Pod 個數一致。
例如，如果你的 Service 用來執行 3 個副本的 nginx 容器，你應該會在 Service 的 Endpoints
中看到 3 個不同的 IP 地址。

<!--
#### My service is missing endpoints

If you are missing endpoints, try listing pods using the labels that Service uses.  Imagine that you have
a Service where the labels are:
-->
#### 服務缺少 Endpoints

如果沒有 Endpoints，請嘗試使用 Service 所使用的標籤列出 Pod。
假定你的服務包含如下標籤選擇算符：

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

<!--
You can use:
```shell
kubectl get pods --selector=name=nginx,type=frontend
```

to list pods that match this selector.  Verify that the list matches the Pods that you expect to provide your Service.
-->

你可以使用如下命令列出與選擇算符相匹配的 Pod，並驗證這些 Pod 是否歸屬於建立的服務：

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

<!--
Verify that the pod's `containerPort` matches up with the Service's `targetPort`
-->
驗證 Pod 的 `containerPort` 與服務的 `targetPort` 是否匹配。

<!--
#### Network traffic is not forwarded

Please see [debugging service](/docs/tasks/debug/debug-applications/debug-service/) for more information.
-->
#### 網路流量未被轉發

請參閱[除錯 Service](/zh-cn/docs/tasks/debug/debug-applications/debug-service/) 瞭解更多資訊。

## {{% heading "whatsnext" %}}

<!--
If none of the above solves your problem, follow the instructions in
[Debugging Service document](/docs/tasks/debug/debug-applications/debug-service/)
to make sure that your `Service` is running, has `Endpoints`, and your `Pods` are
actually serving; you have DNS working, iptables rules installed, and kube-proxy
does not seem to be misbehaving.

You may also visit [troubleshooting document](/docs/tasks/debug/) for more information.
-->
如果上述方法都不能解決你的問題，
請按照[除錯 Service 文件](/zh-cn/docs/tasks/debug/debug-applications/debug-service/)中的介紹，
確保你的 `Service` 處於 Running 態，有 `Endpoints` 被建立，`Pod` 真的在提供服務；
DNS 服務已配置並正常工作，iptables 規則也以安裝並且 `kube-proxy` 也沒有異常行為。

你也可以訪問[故障排查文件](/zh-cn/docs/tasks/debug/)來獲取更多資訊。
