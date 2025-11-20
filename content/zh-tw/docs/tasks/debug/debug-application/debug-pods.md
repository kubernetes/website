---
title: 調試 Pod
content_type: task
weight: 10
---
<!-- 
reviewers:
- mikedanese
- thockin
title: Debug Pods
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This guide is to help users debug applications that are deployed into Kubernetes
and not behaving correctly. This is *not* a guide for people who want to debug their cluster.
For that you should check out [this guide](/docs/tasks/debug/debug-cluster).
-->
本指南幫助使用者調試那些部署到 Kubernetes 上後沒有正常運行的應用。
本指南 **並非** 指導使用者如何調試叢集。
如果想調試叢集的話，請參閱[這裏](/zh-cn/docs/tasks/debug/debug-cluster)。

<!-- body -->

<!--
## Diagnosing the problem

The first step in troubleshooting is triage. What is the problem?
Is it your Pods, your Replication Controller or your Service?

   * [Debugging Pods](#debugging-pods)
   * [Debugging Replication Controllers](#debugging-replication-controllers)
   * [Debugging Services](#debugging-services)
-->
## 診斷問題   {#diagnosing-the-problem}

故障排查的第一步是先給問題分類。問題是什麼？是關於 Pod、Replication Controller 還是 Service？

* [調試 Pod](#debugging-pods)
* [調試 Replication Controller](#debugging-replication-controllers)
* [調試 Service](#debugging-services)

<!--
### Debugging Pods

The first step in debugging a Pod is taking a look at it. Check the current
state of the Pod and recent events with the following command:
-->
### 調試 Pod   {#debugging-pods}

調試 Pod 的第一步是查看 Pod 資訊。用如下命令查看 Pod 的當前狀態和最近的事件：

```shell
kubectl describe pods ${POD_NAME}
```

<!--
Look at the state of the containers in the pod. Are they all `Running`?
Have there been recent restarts?

Continue debugging depending on the state of the pods.
-->
查看一下 Pod 中的容器所處的狀態。這些容器的狀態都是 `Running` 嗎？最近有沒有重啓過？

後面的調試都是要依靠 Pod 的狀態的。

<!--
#### My pod stays pending

If a Pod is stuck in `Pending` it means that it can not be scheduled onto a node.
Generally this is because there are insufficient resources of one type or another
that prevent scheduling. Look at the output of the `kubectl describe ...` command above.
There should be messages from the scheduler about why it can not schedule your pod.
Reasons include:
-->
#### Pod 停滯在 Pending 狀態  {#my-pod-stays-pending}

如果一個 Pod 停滯在 `Pending` 狀態，表示 Pod 沒有被調度到節點上。
通常這是因爲某種類型的資源不足導致無法調度。
查看上面的 `kubectl describe ...` 命令的輸出，其中應該顯示了爲什麼沒被調度的原因。
常見原因如下：

<!--
* **You don't have enough resources**: You may have exhausted the supply of CPU
  or Memory in your cluster, in this case you need to delete Pods, adjust resource
  requests, or add new nodes to your cluster. See [Compute Resources document](/docs/concepts/configuration/manage-resources-containers/)
  for more information.

* **You are using `hostPort`**: When you bind a Pod to a `hostPort` there are a
  limited number of places that pod can be scheduled. In most cases, `hostPort`
  is unnecessary, try using a Service object to expose your Pod.  If you do require
  `hostPort` then you can only schedule as many Pods as there are nodes in your Kubernetes cluster.
-->
* **資源不足**：
  你可能耗盡了叢集上所有的 CPU 或內存。此時，你需要刪除 Pod、調整資源請求或者爲叢集添加節點。
  更多資訊請參閱[計算資源文檔](/zh-cn/docs/concepts/configuration/manage-resources-containers/)

* **使用了 `hostPort`**：
  如果綁定 Pod 到 `hostPort`，那麼能夠運行該 Pod 的節點就有限了。
  多數情況下，`hostPort` 是非必要的，而應該採用 Service 對象來暴露 Pod。
  如果確實需要使用 `hostPort`，那麼叢集中節點的個數就是所能創建的 Pod
  的數量上限。

<!--
#### My pod stays waiting

If a Pod is stuck in the `Waiting` state, then it has been scheduled to a worker node, 
but it can't run on that machine. Again, the information from `kubectl describe ...`
should be informative. The most common cause of `Waiting` pods is a failure to pull the image.
There are three things to check:

* Make sure that you have the name of the image correct.
* Have you pushed the image to the registry?
* Try to manually pull the image to see if the image can be pulled. For example,
  if you use Docker on your PC, run `docker pull <image>`.
-->
#### Pod 停滯在 Waiting 狀態  {#my-pod-stays-waiting}

如果 Pod 停滯在 `Waiting` 狀態，則表示 Pod 已經被調度到某工作節點，但是無法在該節點上運行。
同樣，`kubectl describe ...` 命令的輸出可能很有用。
`Waiting` 狀態的最常見原因是拉取映像檔失敗。要檢查的有三個方面：

* 確保映像檔名字拼寫正確。
* 確保映像檔已被推送到映像檔倉庫。
* 嘗試手動是否能拉取映像檔。例如，如果你在你的 PC 上使用 Docker，請運行 `docker pull <鏡像>`。

<!--
#### My pod stays terminating

If a Pod is stuck in the `Terminating` state, it means that a deletion has been
issued for the Pod, but the control plane is unable to delete the Pod object.

This typically happens if the Pod has a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/)
and there is an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
installed in the cluster that prevents the control plane from removing the
finalizer.
-->
#### Pod 停滯在 terminating 狀態  {#my-pod-stays-terminating}

如果 Pod 停滯在 `Terminating` 狀態，表示已發出刪除 Pod 的請求，
但控制平面無法刪除該 Pod 對象。

如果 Pod 擁有 [Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)
並且叢集中安裝了[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)，
可能會導致控制平面無法移除 Finalizer，從而導致 Pod 出現此問題。

<!--
To identify this scenario, check if your cluster has any
ValidatingWebhookConfiguration or MutatingWebhookConfiguration that target
`UPDATE` operations for `pods` resources.

If the webhook is provided by a third-party:
- Make sure you are using the latest version.
- Disable the webhook for `UPDATE` operations.
- Report an issue with the corresponding provider.
-->
要確認這種情況，請檢查你的叢集中是否有 ValidatingWebhookConfiguration 或
MutatingWebhookConfiguration 處理 `pods` 資源的 `UPDATE` 操作。

如果 Webhook 是由第三方提供的：

- 確保你使用的是最新版。
- 禁用處理 `UPDATE` 操作的 Webhook。
- 向相關供應商報告問題。

<!--
If you are the author of the webhook:
- For a mutating webhook, make sure it never changes immutable fields on
  `UPDATE` operations. For example, changes to containers are usually not allowed.
- For a validating webhook, make sure that your validation policies only apply
  to new changes. In other words, you should allow Pods with existing violations
  to pass validation. This allows Pods that were created before the validating
  webhook was installed to continue running.
-->
如果你是 Webhook 的作者：

- 對於變更性質的 Webhook，請確保在處理 `UPDATE` 操作時不要更改不可變字段。
  例如，一般不允許更改 `containers`。
- 對於驗證性質的 Webhook，請確保你的驗證策略僅被應用於新的更改之上。換句話說，
  你應該允許存在違規的現有 Pod 通過驗證。這樣可以確保在安裝驗證性質的 Webhook
  之前創建的 Pod 可以繼續運行。

<!--
#### My pod is crashing or otherwise unhealthy

Once your pod has been scheduled, the methods described in
[Debug Running Pods](/docs/tasks/debug/debug-application/debug-running-pod/)
are available for debugging.
-->
#### Pod 處於 Crashing 或別的不健康狀態   {#my-pod-is-crashing-or-otherwise-unhealthy}

一旦 Pod 被調度，
就可以採用[調試運行中的 Pod](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)
中的方法來進一步調試。

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

如果 Pod 行爲不符合預期，很可能 Pod 描述（例如你本地機器上的 `mypod.yaml`）中有問題，
並且該錯誤在創建 Pod 時被忽略掉，沒有報錯。
通常，Pod 的定義中節區嵌套關係錯誤、字段名字拼錯的情況都會引起對應內容被忽略掉。
例如，如果你誤將 `command` 寫成 `commnd`，Pod 雖然可以創建，
但它不會執行你期望它執行的命令列。

<!--
The first thing to do is to delete your pod and try creating it again with the `--validate` option.
For example, run `kubectl apply --validate -f mypod.yaml`.
If you misspelled `command` as `commnd` then will give an error like this:
-->
可以做的第一件事是刪除你的 Pod，並嘗試帶有 `--validate` 選項重新創建。
例如，運行 `kubectl apply --validate -f mypod.yaml`。
如果 `command` 被誤拼成 `commnd`，你將會看到下面的錯誤資訊：

```shell
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
back from apiserver, `mypod-on-apiserver.yaml`. There will typically be some
lines on the "apiserver" version that are not on the original version. This is
expected. However, if there are lines on the original that are not on the apiserver
version, then this may indicate a problem with your pod spec.
-->
接下來就要檢查的是 API 伺服器上的 Pod 與你所期望創建的是否匹配
（例如，你原本使用本機上的一個 YAML 檔案來創建 Pod）。
例如，運行 `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml`，
之後手動比較 `mypod.yaml` 與從 API 伺服器取回的 Pod 描述。
從 API 伺服器處獲得的 YAML 通常包含一些創建 Pod 所用的 YAML 中不存在的行，這是正常的。
不過，如果如果源檔案中有些行在 API 伺服器版本中不存在，則意味着
Pod 規約是有問題的。

<!--
### Debugging Replication Controllers

Replication controllers are fairly straightforward. They can either create Pods or they can't.
If they can't create pods, then please refer to the
[instructions above](#debugging-pods) to debug your pods.

You can also use `kubectl describe rc ${CONTROLLER_NAME}` to introspect events
related to the replication controller.
-->
### 調試副本控制器  {#debugging-replication-controllers}

副本控制器相對比較簡單直接。它們要麼能創建 Pod，要麼不能。
如果不能創建 Pod，請參閱[上述說明](#debugging-pods)調試 Pod。

你也可以使用 `kubectl describe rc ${CONTROLLER_NAME}` 命令來檢視副本控制器相關的事件。

<!--
### Debugging Services

Services provide load balancing across a set of pods. There are several common problems that can make Services
not work properly.  The following instructions should help debug Service problems.

First, verify that there are endpoints for the service. For every Service object,
the apiserver makes one or more `EndpointSlice` resources available.

You can view these resource with:
-->
### 調試 Service   {#debugging-services}

服務支持在多個 Pod 間負載均衡。
有一些常見的問題可以造成服務無法正常工作。
以下說明將有助於調試服務的問題。

首先，驗證服務是否有端點。對於每一個 Service 對象，API 伺服器爲其提供對應的一個或多個
`EndpointSlice` 資源。

通過如下命令可以查看 `EndpointSlice` 資源：

```shell
kubectl get endpointslices -l kubernetes.io/service-name=${SERVICE_NAME}

```

<!--
Make sure that the endpoints in the EndpointSlices match up with the number of pods that you expect to be members of your service.
For example, if your Service is for an nginx container with 3 replicas, you would expect to see three different
IP addresses in the Service's endpoints slices.
-->
確保 EndpointSlices 中的端點與你期望成爲服務成員的 Pod 數量相匹配。
例如，如果你的 Service 用來運行 3 個副本的 nginx 容器，你應該會在 Service 的 EndpointSlices
中看到 3 個不同的 IP 地址。

<!--
#### My service is missing endpoints

If you are missing endpoints, try listing pods using the labels that Service uses.
Imagine that you have a Service where the labels are:
-->
#### 服務缺少 Endpoints   {#my-service-is-missing-endpoints}

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

to list pods that match this selector. Verify that the list matches the Pods that you expect to provide your Service.
-->
你可以使用如下命令列出與選擇算符相匹配的 Pod，並驗證這些 Pod 是否歸屬於創建的服務：

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

<!--
Verify that the pod's `containerPort` matches up with the Service's `targetPort`
-->
驗證 Pod 的 `containerPort` 與服務的 `targetPort` 是否匹配。

<!--
#### Network traffic is not forwarded

Please see [debugging service](/docs/tasks/debug/debug-application/debug-service/) for more information.
-->
#### 網路流量未被轉發  {#network-traffic-is-not-forwarded}

請參閱[調試 Service](/zh-cn/docs/tasks/debug/debug-application/debug-service/) 瞭解更多資訊。

## {{% heading "whatsnext" %}}

<!--
If none of the above solves your problem, follow the instructions in
[Debugging Service document](/docs/tasks/debug/debug-application/debug-service/)
to make sure that your `Service` is running, has `Endpoints`, and your `Pods` are
actually serving; you have DNS working, iptables rules installed, and kube-proxy
does not seem to be misbehaving.

You may also visit [troubleshooting document](/docs/tasks/debug/) for more information.
-->
如果上述方法都不能解決你的問題，
請按照[調試 Service 文檔](/zh-cn/docs/tasks/debug/debug-application/debug-service/)中的介紹，
確保你的 `Service` 處於 Running 狀態，有 `Endpoints` 被創建，`Pod` 真的在提供服務；
DNS 服務已設定並正常工作，iptables 規則也已安裝並且 `kube-proxy` 也沒有異常行爲。

你也可以訪問[故障排查文檔](/zh-cn/docs/tasks/debug/)來獲取更多資訊。
