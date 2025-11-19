---
title: 使用 kubectl patch 更新 API 對象
description: 使用 kubectl patch 更新 Kubernetes API 對象。做一個策略性的合併 patch 或 JSON 合併 patch。
content_type: task
weight: 50
---

<!--
title: Update API Objects in Place Using kubectl patch
description: Use kubectl patch to update Kubernetes API objects in place. Do a strategic merge patch or a JSON merge patch.
content_type: task
weight: 50
-->

<!-- overview -->

<!--
This task shows how to use `kubectl patch` to update an API object in place. The exercises
in this task demonstrate a strategic merge patch and a JSON merge patch.
-->
這個任務展示如何使用 `kubectl patch` 就地更新 API 對象。
這個任務中的練習演示了一個策略性合併 patch 和一個 JSON 合併 patch。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Use a strategic merge patch to update a Deployment

Here's the configuration file for a Deployment that has two replicas. Each replica
is a Pod that has one container:
-->
## 使用策略合併 patch 更新 Deployment    {#use-a-strategic-merge-patch-to-update-a-deployment}

下面是具有兩個副本的 Deployment 的設定文件。每個副本是一個 Pod，有一個容器：

{{% code_sample file="application/deployment-patch.yaml" %}}

<!--
Create the Deployment:
-->
創建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
```

<!--
View the Pods associated with your Deployment:
-->
查看與 Deployment 相關的 Pod：

```shell
kubectl get pods
```

<!--
The output shows that the Deployment has two Pods. The `1/1` indicates that
each Pod has one container:
-->
輸出顯示 Deployment 有兩個 Pod。`1/1` 表示每個 Pod 有一個容器：

```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

<!--
Make a note of the names of the running Pods. Later, you will see that these Pods
get terminated and replaced by new ones.
-->
把運行的 Pod 的名字記下來。稍後，你將看到這些 Pod 被終止並被新的 Pod 替換。

<!--
At this point, each Pod has one Container that runs the nginx image. Now suppose
you want each Pod to have two containers: one that runs nginx and one that runs redis.
-->
此時，每個 Pod 都有一個運行 nginx 映像檔的容器。現在假設你希望每個 Pod 有兩個容器：一個運行 nginx，另一個運行 redis。

<!--
Create a file named `patch-file.yaml` that has this content:
-->
創建一個名爲 `patch-file.yaml` 的文件。內容如下：

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

<!--
Patch your Deployment:
-->
修補你的 Deployment：

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
```
<!--
View the patched Deployment:
-->
查看修補後的 Deployment：

```shell
kubectl get deployment patch-demo --output yaml
```

<!--
The output shows that the PodSpec in the Deployment has two Containers:
-->
輸出顯示 Deployment 中的 PodSpec 有兩個容器：

```yaml
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

<!--
View the Pods associated with your patched Deployment:
-->
查看與 patch Deployment 相關的 Pod：

```shell
kubectl get pods
```

<!--
The output shows that the running Pods have different names from the Pods that
were running previously. The Deployment terminated the old Pods and created two
new Pods that comply with the updated Deployment spec. The `2/2` indicates that
each Pod has two Containers:
-->
輸出顯示正在運行的 Pod 與以前運行的 Pod 有不同的名稱。Deployment 終止了舊的 Pod，
並創建了兩個符合更新後的 Deployment 規約的新 Pod。`2/2` 表示每個 Pod 有兩個容器:

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

<!--
Take a closer look at one of the patch-demo Pods:
-->
仔細查看其中一個 patch-demo Pod：

```shell
kubectl get pod <your-pod-name> --output yaml
```

<!--
The output shows that the Pod has two Containers: one running nginx and one running redis:
-->
輸出顯示 Pod 有兩個容器：一個運行 nginx，一個運行 redis：

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

<!--
### Notes on the strategic merge patch

The patch you did in the preceding exercise is called a *strategic merge patch*.
Notice that the patch did not replace the `containers` list. Instead it added a new
Container to the list. In other words, the list in the patch was merged with the
existing list. This is not always what happens when you use a strategic merge patch on a list.
In some cases, the list is replaced, not merged.
-->
### 策略性合併類的 patch 的說明    {#notes-on-the-strategic-merge-patch}

你在前面的練習中所做的 patch 稱爲 `策略性合併 patch（Strategic Merge Patch）`。
請注意，patch 沒有替換 `containers` 列表。相反，它向列表中添加了一個新 Container。換句話說，
patch 中的列表與現有列表合併。當你在列表中使用策略性合併 patch 時，並不總是這樣。
在某些情況下，列表是替換的，而不是合併的。

<!--
With a strategic merge patch, a list is either replaced or merged depending on its
patch strategy. The patch strategy is specified by the value of the `patchStrategy` key
in a field tag in the Kubernetes source code. For example, the `Containers` field of `PodSpec`
struct has a `patchStrategy` of `merge`:
-->
對於策略性合併 patch，列表可以根據其 patch 策略進行替換或合併。
patch 策略由 Kubernetes 源代碼中字段標記中的 `patchStrategy` 鍵的值指定。
例如，`PodSpec` 結構體的 `Containers` 字段的 `patchStrategy` 爲 `merge`：

```go
type PodSpec struct {
  ...
  Containers []Container `json:"containers" patchStrategy:"merge" patchMergeKey:"name" ...`
  ...
}
```

<!--
You can also see the patch strategy in the
[OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):
-->
你還可以在
[OpenApi 規範](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json)中看到
patch 策略：

```yaml
"io.k8s.api.core.v1.PodSpec": {
    ...,
    "containers": {
        "description": "List of containers belonging to the pod.  ...."
    },
    "x-kubernetes-patch-merge-key": "name",
    "x-kubernetes-patch-strategy": "merge"
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

<!--
And you can see the patch strategy in the
[Kubernetes API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->
你可以在 [Kubernetes API 文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中看到 patch 策略。

<!--
Create a file named `patch-file-tolerations.yaml` that has this content:
-->
創建一個名爲 `patch-file-tolerations.yaml` 的文件。內容如下:

```yaml
spec:
  template:
    spec:
      tolerations:
      - effect: NoSchedule
        key: disktype
        value: ssd
```

<!--
Patch your Deployment:
-->
對 Deployment 執行 patch 操作：

```shell
kubectl patch deployment patch-demo --patch-file patch-file-tolerations.yaml
```

<!--
View the patched Deployment:
-->
查看修補後的 Deployment：

```shell
kubectl get deployment patch-demo --output yaml
```

<!--
The output shows that the PodSpec in the Deployment has only one Toleration:
-->
輸出結果顯示 Deployment 中的 PodSpec 只有一個容忍度設置：

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

<!--
Notice that the `tolerations` list in the PodSpec was replaced, not merged. This is because
the Tolerations field of PodSpec does not have a `patchStrategy` key in its field tag. So the
strategic merge patch uses the default patch strategy, which is `replace`.
-->
請注意，PodSpec 中的 `tolerations` 列表被替換，而不是合併。這是因爲 PodSpec 的 `tolerations`
的字段標籤中沒有 `patchStrategy` 鍵。所以策略合併 patch 操作使用默認的 patch 策略，也就是 `replace`。

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

<!--
## Use a JSON merge patch to update a Deployment

A strategic merge patch is different from a
[JSON merge patch](https://tools.ietf.org/html/rfc7386).
With a JSON merge patch, if you
want to update a list, you have to specify the entire new list. And the new list completely
replaces the existing list.
-->
## 使用 JSON 合併 patch 更新 Deployment    {#use-a-json-merge-patch-to-update-a-deployment}

策略性合併 patch 不同於 [JSON 合併 patch](https://tools.ietf.org/html/rfc7386)。
使用 JSON 合併 patch，如果你想更新列表，你必須指定整個新列表。新的列表完全取代現有的列表。

<!--
The `kubectl patch` command has a `type` parameter that you can set to one of these values:
-->
`kubectl patch` 命令有一個 `type` 參數，你可以將其設置爲以下值之一：

<table>
  <!--
  <tr><th>Parameter value</th><th>Merge type</th></tr>
  -->
  <tr><th>參數值</th><th>合併類型</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <!--
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
  -->
  <tr><td>strategic</td><td>策略合併 patch</td></tr>
</table>

<!--
For a comparison of JSON patch and JSON merge patch, see
[JSON Patch and JSON Merge Patch](https://erosb.github.io/post/json-patch-vs-merge-patch/).
-->
有關 JSON patch 和 JSON 合併 patch 的比較，查看
[JSON patch 和 JSON 合併 patch](https://erosb.github.io/post/json-patch-vs-merge-patch/)。

<!--
The default value for the `type` parameter is `strategic`. So in the preceding exercise, you
did a strategic merge patch.
-->
`type` 參數的默認值是 `strategic`。在前面的練習中，我們做了一個策略性的合併 patch。

<!--
Next, do a JSON merge patch on your same Deployment. Create a file named `patch-file-2.yaml`
that has this content:
-->
下一步，在相同的 Deployment 上執行 JSON 合併 patch。創建一個名爲 `patch-file-2` 的文件。內容如下：

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/hello-app:2.0
```

<!--
In your patch command, set `type` to `merge`:
-->
在 patch 命令中，將 `type` 設置爲 `merge`：

```shell
kubectl patch deployment patch-demo --type merge --patch-file patch-file-2.yaml
```

<!--
View the patched Deployment:
-->
查看修補後的 Deployment：

```shell
kubectl get deployment patch-demo --output yaml
```

<!--
The `containers` list that you specified in the patch has only one Container.
The output shows that your list of one Container replaced the existing `containers` list.
-->
patch 中指定的 `containers` 列表只有一個 Container。
輸出顯示你所給出的 Container 列表替換了現有的 `containers` 列表。

```yaml
spec:
  containers:
  - image: gcr.io/google-samples/hello-app:2.0
    ...
    name: patch-demo-ctr-3
```

<!--
List the running Pods:
-->
列出正運行的 Pod：

```shell
kubectl get pods
```

<!--
In the output, you can see that the existing Pods were terminated, and new Pods
were created. The `1/1` indicates that each new Pod is running only one Container.
-->
在輸出中，你可以看到已經終止了現有的 Pod，並創建了新的 Pod。`1/1` 表示每個新 Pod 只運行一個容器。

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

<!--
## Use strategic merge patch to update a Deployment using the retainKeys strategy

Here's the configuration file for a Deployment that uses the `RollingUpdate` strategy:
-->
## 使用帶 retainKeys 策略的策略合併 patch 更新 Deployment    {#use-strategic-merge-patch-to-update-a-deployment-using-the-retainkeys-strategy}

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

<!--
Create the deployment:
-->
創建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

<!--
At this point, the deployment is created and is using the `RollingUpdate` strategy.

Create a file named `patch-file-no-retainkeys.yaml` that has this content:
-->
這時，Deployment 被創建，並使用 `RollingUpdate` 策略。

創建一個名爲 `patch-file-no-retainkeys.yaml` 的文件，內容如下：

```yaml
spec:
  strategy:
    type: Recreate
```

<!--
Patch your Deployment:
-->
修補你的 Deployment:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-no-retainkeys.yaml
```

<!--
In the output, you can see that it is not possible to set `type` as `Recreate` when a value is defined for `spec.strategy.rollingUpdate`:
-->
在輸出中，你可以看到，當 `spec.strategy.rollingUpdate` 已經擁有取值定義時，
將其 `type` 設置爲 `Recreate` 是不可能的。

```
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

<!--
The way to remove the value for `spec.strategy.rollingUpdate` when updating the value for `type` is to use the `retainKeys` strategy for the strategic merge.

Create another file named `patch-file-retainkeys.yaml` that has this content:
-->
更新 `type` 取值的同時移除 `spec.strategy.rollingUpdate`
現有值的方法是爲策略性合併操作設置 `retainKeys` 策略：

創建另一個名爲 `patch-file-retainkeys.yaml` 的文件，內容如下：

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

<!--
With this patch, we indicate that we want to retain only the `type` key of the `strategy` object. Thus, the `rollingUpdate` will be removed during the patch operation.

Patch your Deployment again with this new patch:
-->
使用此 patch，我們表達了希望只保留 `strategy` 對象的 `type` 鍵。
這樣，在 patch 操作期間 `rollingUpdate` 會被刪除。

使用新的 patch 重新修補 Deployment：

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-retainkeys.yaml
```

<!--
Examine the content of the Deployment:
-->
檢查 Deployment 的內容：

```shell
kubectl get deployment retainkeys-demo --output yaml
```

<!--
The output shows that the strategy object in the Deployment does not contain the `rollingUpdate` key anymore:
-->
輸出顯示 Deployment 中的 `strategy` 對象不再包含 `rollingUpdate` 鍵：

```yaml
spec:
  strategy:
    type: Recreate
  template:
```

<!--
### Notes on the strategic merge patch using the retainKeys strategy

The patch you did in the preceding exercise is called a *strategic merge patch with retainKeys strategy*. This method introduces a new directive `$retainKeys` that has the following strategies:

- It contains a list of strings.
- All fields needing to be preserved must be present in the `$retainKeys` list.
- The fields that are present will be merged with live object.
- All of the missing fields will be cleared when patching.
- All fields in the `$retainKeys` list must be a superset or the same as the fields present in the patch.
-->
### 關於使用 retainKeys 策略的策略合併 patch 操作的說明    {#notes-on-the-strategic-merge-patch-using-the-retainkeys-strategy}

在前文練習中所執行的稱作 **帶 `retainKeys` 策略的策略合併 patch（Strategic Merge
Patch with retainKeys Strategy）**。
這種方法引入了一種新的 `$retainKey` 指令，具有如下策略：

- 其中包含一個字符串列表；
- 所有需要被保留的字段必須在 `$retainKeys` 列表中給出；
- 對於已有的字段，會和對象上對應的內容合併；
- 在修補操作期間，未找到的字段都會被清除；
- 列表 `$retainKeys` 中的所有字段必須 patch 操作所給字段的超集，或者與之完全一致。

<!--
The `retainKeys` strategy does not work for all objects. It only works when the value of the `patchStrategy` key in a field tag in the Kubernetes source code contains `retainKeys`. For example, the `Strategy` field of the `DeploymentSpec` struct has a `patchStrategy` of `retainKeys`:
-->
策略 `retainKeys` 並不能對所有對象都起作用。它僅對那些 Kubernetes 源碼中
`patchStrategy` 字段標誌值包含 `retainKeys` 的字段有用。
例如 `DeploymentSpec` 結構的 `Strategy` 字段就包含了 `patchStrategy` 爲
`retainKeys` 的標誌。

```go
type DeploymentSpec struct {
  ...
  // +patchStrategy=retainKeys
  Strategy DeploymentStrategy `json:"strategy,omitempty" patchStrategy:"retainKeys" ...`
  ...
}
```

<!--
You can also see the `retainKeys` strategy in the [OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):
-->
你也可以查看
[OpenAPI 規範](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json)中的
`retainKeys` 策略：

```yaml
"io.k8s.api.apps.v1.DeploymentSpec": {
    ...,
    "strategy": {
        "$ref": "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        "description": "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys"
    },
    ....
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

<!--
And you can see the `retainKeys` strategy in the
[Kubernetes API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).
-->
而且你也可以在
[Kubernetes API 文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps)中看到
`retainKey` 策略。

<!--
### Alternate forms of the kubectl patch command

The `kubectl patch` command takes YAML or JSON. It can take the patch as a file or
directly on the command line.
-->
### kubectl patch 命令的其他形式    {#alternate-forms-of-the-kubectl-patch-command}

`kubectl patch` 命令使用 YAML 或 JSON。它可以接受以文件形式提供的補丁，也可以接受直接在命令列中給出的補丁。

<!--
Create a file named `patch-file.json` that has this content:
-->
創建一個文件名稱是 `patch-file.json` 內容如下：

```json
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

<!--
The following commands are equivalent:
-->
以下命令是等價的：

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```
<!--
### Update an object's replica count using `kubectl patch` with `--subresource` {#scale-kubectl-patch}
-->
### 使用 `kubectl patch` 和 `--subresource` 更新一個對象的副本數   {#scale-kubectl-patch}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

<!--
The flag `--subresource=[subresource-name]` is used with kubectl commands like get, patch,
edit, apply and replace to fetch and update `status`, `scale` and `resize` subresource of the
resources you specify. You can specify a subresource for any of the Kubernetes API resources
(built-in and CRs) that have `status`, `scale` or `resize` subresource.

For example, a Deployment has a `status` subresource and a `scale` subresource, so you can
use `kubectl` to get or modify just the `status` subresource of a Deployment.

Here's a manifest for a Deployment that has two replicas:
-->
使用 kubectl 命令（如 get、patch、edit、apply 和 replace）時帶上 `--subresource=[subresource-name]` 標誌，
可以獲取和更新你所指定資源的 `status`、`scale` 和 `resize` 子資源。
你可以爲任何具有 `status`、`scale` 或 `resize` 子資源的 Kubernetes API 資源（內置資源和 CR 資源）
指定子資源。

例如，Deployment 具有 `status` 子資源和 `scale` 子資源，因此你可以使用 `kubectl` 來獲取或修改
Deployment 的 `status` 子資源。

以下是一個具有兩個副本的 Deployment 的清單示例：

{{% code_sample file="application/deployment.yaml" %}}

<!--
Create the Deployment:
-->
創建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

<!--
View the Pods associated with your Deployment:
-->
查看與 Deployment 關聯的 Pod：

```shell
kubectl get pods -l app=nginx
```

<!--
In the output, you can see that Deployment has two Pods. For example:
-->
在輸出中，你可以看到此 Deployment 有兩個 Pod。例如：

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

<!--
Now, patch that Deployment with `--subresource=[subresource-name]` flag:
-->
現在用 `--subresource=[subresource-name]` 標誌修補此 Deployment：

```shell
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

<!--
The output is:
-->
輸出爲：

```shell
scale.autoscaling/nginx-deployment patched
```

<!--
View the Pods associated with your patched Deployment:
-->
查看與你所修補的 Deployment 關聯的 Pod：

```shell
kubectl get pods -l app=nginx
```

<!--
In the output, you can see one new pod is created, so now you have 3 running pods.
-->
在輸出中，你可以看到一個新的 Pod 被創建，因此現在你有 3 個正在運行的 Pod。

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          107s
nginx-deployment-7fb96c846b-lxfr2   1/1     Running   0          14s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          107s
```

<!--
View the patched Deployment:
-->
查看所修補的 Deployment：

```shell
kubectl get deployment nginx-deployment -o yaml
```

```yaml
...
spec:
  replicas: 3
  ...
status:
  ...
  availableReplicas: 3
  readyReplicas: 3
  replicas: 3
```

{{< note >}}
<!--
If you run `kubectl patch` and specify `--subresource` flag for resource that doesn't support that
particular subresource, the API server returns a 404 Not Found error.
-->
如果你運行 `kubectl patch` 並指定 `--subresource` 標誌時，所針對的是不支持特定子資源的資源，
則 API 伺服器會返回一個 404 Not Found 錯誤。
{{< /note >}}

<!--
## Summary

In this exercise, you used `kubectl patch` to change the live configuration
of a Deployment object. You did not change the configuration file that you originally used to
create the Deployment object. Other commands for updating API objects include
[kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate),
[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit),
[kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace),
[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale),
and
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply).
-->
## 總結    {#summary}

在本練習中，你使用 `kubectl patch` 更改了 Deployment 對象的當前設定。
你沒有更改最初用於創建 Deployment 對象的設定文件。
用於更新 API 對象的其他命令包括
[`kubectl annotate`](/docs/reference/generated/kubectl/kubectl-commands/#annotate)、
[`kubectl edit`](/docs/reference/generated/kubectl/kubectl-commands/#edit)、
[`kubectl replace`](/docs/reference/generated/kubectl/kubectl-commands/#replace)、
[`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale) 和
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)。

{{< note >}}
<!--
Strategic merge patch is not supported for custom resources.
-->
定製資源不支持策略性合併 patch。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
-->
* [Kubernetes 對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
* [使用指令式命令管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用設定文件對 Kubernetes 對象進行命令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [使用設定文件對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
