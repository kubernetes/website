---
title: 管理工作負載
content_type: concept
weight: 40
---
<!--
title: Managing Workloads
content_type: concept
reviewers:
- janetkuo
weight: 40
-->

<!-- overview -->

<!-- 
You've deployed your application and exposed it via a Service. Now what? Kubernetes provides a
number of tools to help you manage your application deployment, including scaling and updating. 
-->
你已經部署了你的應用並且通過 Service 將其暴露出來。現在要做什麼？
Kubernetes 提供了一系列的工具幫助你管理應用的部署，包括擴縮和更新。

<!-- body -->

<!--
## Organizing resource configurations
-->
## 組織資源設定
<!--
Many applications require multiple resources to be created, such as a Deployment along with a Service.
Management of multiple resources can be simplified by grouping them together in the same file
(separated by `---` in YAML). For example: 
-->
一些應用需要創建多個資源，例如 Deployment 和 Service。
將多個資源歸入同一個文件（在 YAML 中使用 `---` 分隔）可以簡化對多個資源的管理。例如：

{{% code_sample file="application/nginx-app.yaml" %}}

<!--
Multiple resources can be created the same way as a single resource:
-->
創建多個資源的方法與創建單個資源的方法相同：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

<!--
The resources will be created in the order they appear in the manifest. Therefore, it's best to
specify the Service first, since that will ensure the scheduler can spread the pods associated
with the Service as they are created by the controller(s), such as Deployment.
-->
資源會按照在清單中出現的順序創建。
因此，最好先指定 Service，這樣可以確保調度器能在控制器（如 Deployment）創建 Pod 時對
Service 相關的 Pod 作分佈。

<!--
`kubectl apply` also accepts multiple `-f` arguments:
-->
`kubectl apply` 還可以接收多個 `-f` 參數：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```


<!--
It is a recommended practice to put resources related to the same microservice or application tier
into the same file, and to group all of the files associated with your application in the same
directory. If the tiers of your application bind to each other using DNS, you can deploy all of
the components of your stack together.
-->
建議將同一個微服務或應用相關的資源放到同一個文件中，
並將與應用相關的所有文件歸類到同一目錄中。
如果應用各層使用 DNS 相互綁定，你可以同時部署工作棧中的所有組件。

<!--
A URL can also be specified as a configuration source, which is handy for deploying directly from
manifests in your source control system:
-->
URL 鏈接也可以被指定爲設定源，這對於直接基於源碼控制系統的清單進行部署來說非常方便：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

<!--
If you need to define more manifests, such as adding a ConfigMap, you can do that too.
-->
如果你需要定義更多清單，例如添加一個 ConfigMap，你也可以這樣做。

<!--
### External tools
-->
### 外部工具 {#external-tools}

<!--
This section lists only the most common tools used for managing workloads on Kubernetes. To see a larger list, view
[Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)
in the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} Landscape.
-->
這一節列出了在 Kubernetes 中管理工作負載最常用的一些工具。
如果想要查看完整的清單，參閱 {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
文章 [Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)。

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

<!--
[Helm](https://helm.sh/) is a tool for managing packages of pre-configured
Kubernetes resources. These packages are known as _Helm charts_.
-->
[Helm](https://helm.sh/) 是一種管理預設定 Kubernetes 資源包的工具。
這些資源包被稱爲 **Helm chart**。

#### Kustomize {#external-tool-kustomize}

<!--
[Kustomize](https://kustomize.io/) traverses a Kubernetes manifest to add, remove or update configuration options.
It is available both as a standalone binary and as a [native feature](/docs/tasks/manage-kubernetes-objects/kustomization/)
of kubectl.
-->
[Kustomize](https://kustomize.io/) 遍歷 Kubernetes 清單以添加、刪除或更新設定選項。
它既可以作爲獨立的二級制文件使用，也可以作爲 kubectl
的[原生功能](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/) 使用。

<!--
## Bulk operations in kubectl
-->
## kubectl 中的批量操作 {#bulk-operations-in-kubectl}

<!--
Resource creation isn't the only operation that `kubectl` can perform in bulk. It can also extract
resource names from configuration files in order to perform other operations, in particular to
delete the same resources you created:
-->
資源創建並不是 `kubectl` 可以批量執行的唯一操作。
它還能提取設定文件中的資源名稱來執行其他操作，尤其是刪除已經創建的相同資源：

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
In the case of two resources, you can specify both resources on the command line using the
resource/name syntax:
-->
如果有兩個資源，你可以使用 `resource/name` 語法在命令列中指定這兩個資源：

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

<!--
For larger numbers of resources, you'll find it easier to specify the selector (label query)
specified using `-l` or `--selector`, to filter resources by their labels:
-->
對於數量衆多的資源，使用 `-l` 或 `--selector` 指定選擇算符（標籤查詢）會更方便，
可以根據標籤來過濾資源：

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
### Chaining and filtering
-->
### 鏈式操作和過濾 {#chaining-and-filtering}

<!--
Because `kubectl` outputs resource names in the same syntax it accepts, you can chain operations
using `$()` or `xargs`:
-->
因爲 `kubectl` 輸出的資源名稱與接收的語法相同，你可以使用 `$()` 或 `xargs` 進行鏈式操作：

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

<!--
The output might be similar to:
-->
輸出類似這樣：

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

<!--
With the above commands, first you create resources under `docs/concepts/cluster-administration/nginx/` and print
the resources created with `-o name` output format (print each resource as resource/name).
Then you `grep` only the Service, and then print it with [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/).
-->
使用上面的命令，首先會創建 `docs/concepts/cluster-administration/nginx/` 目錄下的資源，
然後使用 `-o name` 輸出格式打印創建的資源（以 resource/name 格式打印）。
然後 `grep` 篩選出 Service，再用 [`kubectl get`](/zh-cn/docs/reference/kubectl/generated/kubectl_get/) 打印。

<!--
### Recursive operations on local files
-->
### 對本地文件的遞歸操作 {#recursive-operations-on-local-files}

<!--
If you happen to organize your resources across several subdirectories within a particular
directory, you can recursively perform the operations on the subdirectories also, by specifying
`--recursive` or `-R` alongside the `--filename`/`-f` argument.
-->
如果你碰巧在一個特定目錄下跨多個子目錄中組織資源，
你也可以通過在指定 `--filename`/`-f` 的同時指定 `--recursive` 或
`-R` 參數對子目錄執行遞歸操作。

<!--
For instance, assume there is a directory `project/k8s/development` that holds all of the
{{< glossary_tooltip text="manifests" term_id="manifest" >}} needed for the development environment,
organized by resource type:
-->
例如，假設有一個目錄 `project/k8s/development` 包含了開發環境所需的所有{{< glossary_tooltip text="清單文件" term_id="manifest" >}}，
並按資源類型進行了分類：

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

<!--
By default, performing a bulk operation on `project/k8s/development` will stop at the first level
of the directory, not processing any subdirectories. If you had tried to create the resources in
this directory using the following command, we would have encountered an error:
-->
默認情況下，在 `project/k8s/development` 下執行批量操作會在目錄的第一層終止，不會處理任何子目錄。
如果你在這個目錄下使用如下命令嘗試創建資源，會得到如下錯誤：

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

<!--
Instead, specify the `--recursive` or `-R` command line argument along with the `--filename`/`-f` argument:
-->
在命令列參數中與 `--filename`/`-f` 一起指定 `--recursive` 或 `-R`：

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
The `--recursive` argument works with any operation that accepts the `--filename`/`-f` argument such as:
`kubectl create`, `kubectl get`, `kubectl delete`, `kubectl describe`, or even `kubectl rollout`.

The `--recursive` argument also works when multiple `-f` arguments are provided:
-->
參數 `--recursive` 可以處理任何可以接收 `--filename`/`-f` 參數的操作，
例如： `kubectl create`、`kubectl get`、`kubectl delete`、`kubectl describe`，甚至是 `kubectl rollout`。

當指定了多個 `-f` 參數時，`--recursive` 仍然可以生效。

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
If you're interested in learning more about `kubectl`, go ahead and read
[Command line tool (kubectl)](/docs/reference/kubectl/).
-->
如果你對了解更多 `kubectl` 有興趣，請閱讀[命令列工具 (kubectl)](/zh-cn/docs/reference/kubectl/)。

<!--
## Updating your application without an outage
-->
## 無中斷更新應用 {#updating-your-application-without-an-outage}

<!--
At some point, you'll eventually need to update your deployed application, typically by specifying
a new image or image tag. `kubectl` supports several update operations, each of which is applicable
to different scenarios.
-->
有時候，你需要更新你所部署的應用，通常是指定新的映像檔或映像檔標籤。
`kubectl` 支持多種更新操作，每一種都適用於不同的場景。

<!--
You can run multiple copies of your app, and use a _rollout_ to gradually shift the traffic to
new healthy Pods. Eventually, all the running Pods would have the new software.
-->
你可以運行應用的多個副本，並使用 **上線（rollout）** 操作將流量逐漸轉移到新的健康 Pod 上。
最終，所有正在運行的 Pod 都將擁有新的應用。 

<!--
This section of the page guides you through how to create and update applications with Deployments.
-->
本節將指導你如何使用 Deployment 創建和更新應用。

<!--
Let's say you were running version 1.14.2 of nginx:
-->
假設你運行了 Nginx 1.14.2 版本。

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

<!--
Ensure that there is 1 replica:
-->
確保只有一個副本:

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

<!--
and allow Kubernetes to add more temporary replicas during a rollout, by setting a _surge maximum_ of
100%:
-->
允許 Kubernetes 在上線過程中添加更多的臨時副本，方法是設置最大漲幅爲 100%。

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

<!--
To update to version 1.16.1, change `.spec.template.spec.containers[0].image` from `nginx:1.14.2`
to `nginx:1.16.1` using `kubectl edit`:
-->
要更新到版本 1.61.1，使用 `kubectl edit` 將 `.spec.template.spec.containers[0].image`
值從 `nginx:1.14.2` 修改爲 `nginx:1.16.1`。

```shell
kubectl edit deployment/my-nginx
# 修改清單文件以使用新的容器鏡像，然後保存你所作的更改
```

<!--
That's it! The Deployment will declaratively update the deployed nginx application progressively
behind the scene. It ensures that only a certain number of old replicas may be down while they are
being updated, and only a certain number of new replicas may be created above the desired number
of pods. To learn more details about how this happens,
visit [Deployment](/docs/concepts/workloads/controllers/deployment/).
-->
就是這樣！Deployment 會逐步聲明式地更新已部署的 Nginx 應用。
它確保只有一定數量的舊副本會在更新時處於宕機狀態，
並且超過所需的 Pod 數量的新副本個數在創建期間可控。
要了解更多關於如何實現的詳細信息，參照 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

<!--
You can use rollouts with DaemonSets, Deployments, or StatefulSets.
-->
你可以使用 DaemonSet、Deployment 或 StatefulSet 來完成上線。

<!--
### Managing rollouts
-->
### 管理上線 {#managing-rollouts}

<!--
You can use [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) to manage a
progressive update of an existing application.
-->
你可以使用 [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)
管理現有應用的逐步更新。

<!--
For example:
-->
例如：

<!--
```shell
kubectl apply -f my-deployment.yaml

# wait for rollout to finish
kubectl rollout status deployment/my-deployment --timeout 10m # 10 minute timeout
```
-->
```shell
kubectl apply -f my-deployment.yaml

# 等待上線完成
kubectl rollout status deployment/my-deployment --timeout 10m # 超時時長爲 10 分鐘
```

<!-- or -->
或者

<!--
```shell
kubectl apply -f backing-stateful-component.yaml

# don't wait for rollout to finish, just check the status
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```
-->
```shell
kubectl apply -f backing-stateful-component.yaml

# 不用等待上線完成，只需要檢查狀態
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

<!--
You can also pause, resume or cancel a rollout.
Visit [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) to learn more.
-->
你也可以暫停、恢復或取消上線。
參閱 [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) 以深入瞭解。

<!--
## Canary deployments
-->
## 金絲雀部署 {#canary-deployments}

<!--TODO: make a task out of this for canary deployment, ref #42786-->

<!--
Another scenario where multiple labels are needed is to distinguish deployments of different
releases or configurations of the same component. It is common practice to deploy a *canary* of a
new application release (specified via image tag in the pod template) side by side with the
previous release so that the new release can receive live production traffic before fully rolling
it out.
-->
另一種需要使用多個標籤的情況是區分部署的是同一組件的不同版本或不同設定。
通常的做法是將新應用版本的**金絲雀**（在 Pod 模板中的映像檔標籤中指定）與之前發佈的版本並排部署，
這樣新發布的版本可以在完全上線前接收實時生產流量。


<!--
For instance, you can use a `track` label to differentiate different releases.

The primary, stable release would have a `track` label with value as `stable`:
-->
例如，你可以使用 `track` 標籤來區分不同的版本。

主版本、穩定版本會存在 `track` 標籤，值爲 `stable`。

```none
name: frontend
replicas: 3
...
labels:
   app: guestbook
   tier: frontend
   track: stable
...
image: gb-frontend:v3
```

<!--
and then you can create a new release of the guestbook frontend that carries the `track` label
with different value (i.e. `canary`), so that two sets of pods would not overlap:
-->
然後你可以創建一個 guestbook 前端項目的新版本，該版本使用不同值的 `track` 標籤（例如：`canary`），
這樣兩組 Pod 就不會重疊。

```none
name: frontend-canary
replicas: 1
...
labels:
   app: guestbook
   tier: frontend
   track: canary
...
image: gb-frontend:v4
```

<!--
The frontend service would span both sets of replicas by selecting the common subset of their
labels (i.e. omitting the `track` label), so that the traffic will be redirected to both
applications:
-->
這個前端服務將通過選擇標籤的相同子集（例如：忽略 `track` 標籤）來覆蓋兩套副本，
這樣，流量會被轉發到兩個應用：

```yaml
selector:
   app: guestbook
   tier: frontend
```

<!--
You can tweak the number of replicas of the stable and canary releases to determine the ratio of
each release that will receive live production traffic (in this case, 3:1).
Once you're confident, you can update the stable track to the new application release and remove
the canary one.
-->
你可以調整穩定版本和金絲雀版本的副本數量，
以確定每個版本接收實時生產流量的比例（本例中爲 3：1）。
一旦有把握，你可以更新所有 track 標籤爲 stable 的應用爲新版本並且移除金絲雀標籤。

<!--
## Updating annotations
-->
## 更新註解 {#updating-annotations}

<!--
Sometimes you would want to attach annotations to resources. Annotations are arbitrary
non-identifying metadata for retrieval by API clients such as tools or libraries.
This can be done with `kubectl annotate`. For example:
-->
有時候你想要爲資源附加註解。
註解是任意的非標識性元數據，供 API 客戶端例如工具或庫檢索。
這可以通過 `kubectl annotate` 來完成。例如：

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```yaml
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

<!--
For more information, see [annotations](/docs/concepts/overview/working-with-objects/annotations/)
and [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/).
-->
更多信息，參閱[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)
和 [kubectl annotate](/zh-cn/docs/reference/kubectl/generated/kubectl_annotate/)。

<!--
## Scaling your application
-->
## 擴縮應用 {#scaling-your-application}

<!--
When load on your application grows or shrinks, use `kubectl` to scale your application.
For instance, to decrease the number of nginx replicas from 3 to 1, do:
-->
當應用的負載增長或收縮時，使用 `kubectl` 擴縮你的應用。
例如，將 Nginx 的副本數量從 3 減少到 1，這樣做：

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

<!--
Now you only have one pod managed by the deployment.
-->
現在，你的 Deployment 只管理一個 Pod。

```shell
kubectl get pods -l app=my-nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

<!--
To have the system automatically choose the number of nginx replicas as needed,
ranging from 1 to 3, do:
-->
爲了讓系統按需從 1 到 3 自動選擇 Nginx 副本數量，這樣做：

<!--
```shell
# This requires an existing source of container and Pod metrics
kubectl autoscale deployment/my-nginx --min=1 --max=3
```
-->
```shell
# 需要存在容器和 Pod 指標數據源
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

<!--
Now your nginx replicas will be scaled up and down as needed, automatically.
-->
現在你的 Nginx 副本數量將會按需自動擴縮。

<!--
For more information, please see [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/),
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) and
[horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) document.
-->
更多信息請參閱文檔 [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/)，
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) 和
[Pod 水平自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) 。

<!--
## In-place updates of resources
-->
## 就地更新資源 {#in-place-updates-of-resources}

<!--
Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.
-->
有時需要對創建的資源進行小範圍、非破壞性的更新。

### kubectl apply

<!--
It is suggested to maintain a set of configuration files in source control
(see [configuration as code](https://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/)
to push your configuration changes to the cluster.
-->
建議參照 ([configuration as code](https://martinfowler.com/bliki/InfrastructureAsCode.html))，
在源碼控制系統中維護設定文件集合，
這樣它們就能與所設定資源的代碼一起得到維護和版本控制。
然後，你可以使用 [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/) 
將設定集更新推送到叢集中。

<!--
This command will compare the version of the configuration that you're pushing with the previous
version and apply the changes you've made, without overwriting any automated changes to properties
you haven't specified.
-->
這個命令會將你推送的設定的版本和之前的版本進行比較，並應用你所作的更改，
而不會覆蓋任何你沒有指定的屬性。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

<!--
To learn more about the underlying mechanism, read [server-side apply](/docs/reference/using-api/server-side-apply/).
-->
要進一步瞭解底層原理，參閱[伺服器端應用](/zh-cn/docs/reference/using-api/server-side-apply/)。

### kubectl edit

<!--
Alternatively, you may also update resources with [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/):
-->
或者，你也可以使用 [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/) 來更新資源：

```shell
kubectl edit deployment/my-nginx
```

<!--
This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the
resource with the updated version:
-->
等價於先對資源進行 `get` 操作，在文本編輯器中進行編輯，
然後對更新後的版本進行 `apply` 操作：
<!-- 
```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```
-->

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# 編輯，然後保存

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

<!--
This allows you to do more significant changes more easily. Note that you can specify the editor
with your `EDITOR` or `KUBE_EDITOR` environment variables.
-->
這樣，你就可以輕鬆的進行更重要的修改。
注意，你可以使用 `EDITOR` 或 `KUBE_EDITOR` 環境變量來指定編輯器。

<!--
For more information, please see [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/).
-->
更多信息參閱 [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/)。

### kubectl patch

<!--
You can use [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) to update API objects in place.
This subcommand supports JSON patch,
JSON merge patch, and strategic merge patch.
-->
你可以使用 [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) 來就地更新 API 對象。
該子命令支持 JSON 補丁、JSON 合併補丁和策略合併補丁。

<!--
See
[Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
for more details.
-->
參閱[使用 kubectl patch 更新 API 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
獲取更多細節。

<!--
## Disruptive updates
-->
## 破壞性更新 {#disruptive-updates}

<!--
In some cases, you may need to update resource fields that cannot be updated once initialized, or
you may want to make a recursive change immediately, such as to fix broken pods created by a
Deployment. To change such fields, use `replace --force`, which deletes and re-creates the
resource. In this case, you can modify your original configuration file:
-->
某些場景下，你可能需要更新那些一旦被初始化就無法被更新的資源字段，
或者希望立刻進行遞歸修改，例如修復被 Deployment 創建的異常 Pod。
要更改此類字段，使用 `replace --force` 來刪除並且重新創建資源。
這種情況下，你可以修改原始設定文件。

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```


## {{% heading "whatsnext" %}}

<!--
- Learn about [how to use `kubectl` for application introspection and debugging](/docs/tasks/debug/debug-application/debug-running-pod/).
-->
進一步學習[如何調試運行中的 Pod](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)。
