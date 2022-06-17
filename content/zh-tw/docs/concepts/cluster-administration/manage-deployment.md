---
title: 管理資源
content_type: concept
weight: 40
---

<!-- overview -->

<!--
You've deployed your application and exposed it via a service. Now what? Kubernetes provides a number of tools to help you manage your application deployment, including scaling and updating. Among the features that we will discuss in more depth are [configuration files](/docs/concepts/configuration/overview/) and [labels](/docs/concepts/overview/working-with-objects/labels/).
 -->
你已經部署了應用並透過服務暴露它。然後呢？
Kubernetes 提供了一些工具來幫助管理你的應用部署，包括擴縮容和更新。
我們將更深入討論的特性包括
[配置檔案](/zh-cn/docs/concepts/configuration/overview/)和
[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。

<!-- body -->

<!--
## Organizing resource configurations

Many applications require multiple resources to be created, such as a Deployment and a Service. Management of multiple resources can be simplified by grouping them together in the same file (separated by  in YAML). For example:
 -->
## 組織資源配置

許多應用需要建立多個資源，例如 Deployment 和 Service。
可以透過將多個資源組合在同一個檔案中（在 YAML 中以 `---` 分隔）
來簡化對它們的管理。例如：

{{< codenew file="application/nginx-app.yaml" >}}

<!--
Multiple resources can be created the same way as a single resource:
 -->
可以用建立單個資源相同的方式來建立多個資源：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```
service/my-nginx-svc created
deployment.apps/my-nginx created
```

<!--
The resources will be created in the order they appear in the file. Therefore, it's best to specify the service first, since that will ensure the scheduler can spread the pods associated with the service as they are created by the controller(s), such as Deployment.
 -->
資源將按照它們在檔案中的順序建立。
因此，最好先指定服務，這樣在控制器（例如 Deployment）建立 Pod 時能夠
確保排程器可以將與服務關聯的多個 Pod 分散到不同節點。

<!--
`kubectl apply` also accepts multiple `-f` arguments:
 -->
`kubectl create` 也接受多個 `-f` 引數:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

<!--
And a directory can be specified rather than or in addition to individual files:
 -->
還可以指定目錄路徑，而不用新增多個單獨的檔案：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

<!--
`kubectl` will read any files with suffixes `.yaml`, `.yml`, or `.json`.

It is a recommended practice to put resources related to the same microservice or application tier into the same file, and to group all of the files associated with your application in the same directory. If the tiers of your application bind to each other using DNS, then you can deploy all of the components of your stack together.

A URL can also be specified as a configuration source, which is handy for deploying directly from configuration files checked into Github:
 -->
`kubectl` 將讀取任何字尾為 `.yaml`、`.yml` 或者 `.json` 的檔案。

建議的做法是，將同一個微服務或同一應用層相關的資源放到同一個檔案中，
將同一個應用相關的所有檔案按組存放到同一個目錄中。
如果應用的各層使用 DNS 相互繫結，那麼你可以將堆疊的所有元件一起部署。

還可以使用 URL 作為配置源，便於直接使用已經提交到 Github 上的配置檔案進行部署：

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/zh-cn/examples/application/nginx/nginx-deployment.yaml
```

```
deployment.apps/my-nginx created
```

<!--
## Bulk operations in kubectl

Resource creation isn't the only operation that `kubectl` can perform in bulk. It can also extract resource names from configuration files in order to perform other operations, in particular to delete the same resources you created:
 -->
## kubectl 中的批次操作

資源建立並不是 `kubectl` 可以批次執行的唯一操作。
`kubectl` 還可以從配置檔案中提取資源名，以便執行其他操作，
特別是刪除你之前建立的資源：

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
In the case of two resources, it's also easy to specify both on the command line using the resource/name syntax:
 -->
在僅有兩種資源的情況下，可以使用"資源型別/資源名"的語法在命令列中
同時指定這兩個資源：

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

<!--
For larger numbers of resources, you'll find it easier to specify the selector (label query) specified using `-l` or `--selector`, to filter resources by their labels:
-->
對於資源數目較大的情況，你會發現使用 `-l` 或 `--selector` 
指定篩選器（標籤查詢）能很容易根據標籤篩選資源：

```shell
kubectl delete deployment,services -l app=nginx
```

```
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
Because `kubectl` outputs resource names in the same syntax it accepts, you can chain operations using `$()` or `xargs`:
-->
由於 `kubectl` 用來輸出資源名稱的語法與其所接受的資源名稱語法相同，
你可以使用 `$()` 或 `xargs` 進行鏈式操作：

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service | xargs -i kubectl get {}
```

```
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

<!--
With the above commands, we first create resources under `examples/application/nginx/` and print the resources created with `-o name` output format
(print each resource as resource/name). Then we `grep` only the "service", and then print it with `kubectl get`.
 -->
上面的命令中，我們首先使用 `examples/application/nginx/` 下的配置檔案建立資源，
並使用 `-o name` 的輸出格式（以"資源/名稱"的形式列印每個資源）列印所建立的資源。
然後，我們透過 `grep` 來過濾 "service"，最後再列印 `kubectl get` 的內容。

<!--
If you happen to organize your resources across several subdirectories within a particular directory, you can recursively perform the operations on the subdirectories also, by specifying `--recursive` or `-R` alongside the `--filename,-f` flag.
 -->
如果你碰巧在某個路徑下的多個子路徑中組織資源，那麼也可以遞迴地在所有子路徑上
執行操作，方法是在 `--filename,-f` 後面指定 `--recursive` 或者 `-R`。

<!--
For instance, assume there is a directory `project/k8s/development` that holds all of the manifests needed for the development environment, organized by resource type:
 -->
例如，假設有一個目錄路徑為 `project/k8s/development`，它儲存開發環境所需的
所有清單，並按資源型別組織：

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

<!--
By default, performing a bulk operation on `project/k8s/development` will stop at the first level of the directory, not processing any subdirectories. If we had tried to create the resources in this directory using the following command, we would have encountered an error:
 -->
預設情況下，對 `project/k8s/development` 執行的批次操作將停止在目錄的第一級，
而不是處理所有子目錄。
如果我們試圖使用以下命令在此目錄中建立資源，則會遇到一個錯誤：

```shell
kubectl apply -f project/k8s/development
```

```
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

<!--
Instead, specify the `--recursive` or `-R` flag with the `--filename,-f` flag as such:
 -->
正確的做法是，在 `--filename,-f` 後面標明 `--recursive` 或者 `-R` 之後：

```shell
kubectl apply -f project/k8s/development --recursive
```

```
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
The `--recursive` flag works with any operation that accepts the `--filename,-f` flag such as: `kubectl {create,get,delete,describe,rollout} etc.`

The `--recursive` flag also works when multiple `-f` arguments are provided:
 -->
`--recursive` 可以用於接受 `--filename,-f` 引數的任何操作，例如：
`kubectl {create,get,delete,describe,rollout}` 等。

有多個 `-f` 引數出現的時候，`--recursive` 引數也能正常工作：

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
If you're interested in learning more about `kubectl`, go ahead and read [Command line tool (kubectl)](/docs/reference/kubectl/).
-->
如果你有興趣進一步學習關於 `kubectl` 的內容，請閱讀
[命令列工具（kubectl）](/zh-cn/docs/reference/kubectl/)。

<!--
## Using labels effectively

The examples we've used so far apply at most a single label to any resource. There are many scenarios where multiple labels should be used to distinguish sets from one another.
-->
## 有效地使用標籤

到目前為止我們使用的示例中的資源最多使用了一個標籤。
在許多情況下，應使用多個標籤來區分集合。

<!--
For instance, different applications would use different values for the `app` label, but a multi-tier application, such as the [guestbook example](https://github.com/kubernetes/examples/tree/master/guestbook/), would additionally need to distinguish each tier. The frontend could carry the following labels:
-->
例如，不同的應用可能會為 `app` 標籤設定不同的值。
但是，類似 [guestbook 示例](https://github.com/kubernetes/examples/tree/master/guestbook/)
這樣的多層應用，還需要區分每一層。前端可以帶以下標籤：

```yaml
     labels:
        app: guestbook
        tier: frontend
```

<!--
while the Redis master and slave would have different `tier` labels, and perhaps even an additional `role` label:
 -->
Redis 的主節點和從節點會有不同的 `tier` 標籤，甚至還有一個額外的 `role` 標籤：

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

<!-- and -->
以及

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

<!--
The labels allow us to slice and dice our resources along any dimension specified by a label:
 -->
標籤允許我們按照標籤指定的任何維度對我們的資源進行切片和切塊：

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```

```
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

<!--
## Canary deployments

Another scenario where multiple labels are needed is to distinguish deployments of different releases or configurations of the same component. It is common practice to deploy a *canary* of a new application release (specified via image tag in the pod template) side by side with the previous release so that the new release can receive live production traffic before fully rolling it out.
 -->
## 金絲雀部署（Canary Deployments）   {#canary-deployments}

另一個需要多標籤的場景是用來區分同一組件的不同版本或者不同配置的多個部署。
常見的做法是部署一個使用*金絲雀釋出*來部署新應用版本
（在 Pod 模板中透過映象標籤指定），保持新舊版本應用同時執行。
這樣，新版本在完全釋出之前也可以接收實時的生產流量。

<!--
For instance, you can use a `track` label to differentiate different releases.

The primary, stable release would have a `track` label with value as `stable`:
 -->
例如，你可以使用 `track` 標籤來區分不同的版本。

主要穩定的發行版將有一個 `track` 標籤，其值為 `stable`：

```yaml
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
and then you can create a new release of the guestbook frontend that carries the `track` label with different value (i.e. `canary`), so that two sets of pods would not overlap:
 -->
然後，你可以建立 guestbook 前端的新版本，讓這些版本的 `track` 標籤帶有不同的值
（即 `canary`），以便兩組 Pod 不會重疊：

```yaml
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
The frontend service would span both sets of replicas by selecting the common subset of their labels (i.e. omitting the `track` label), so that the traffic will be redirected to both applications:
 -->
前端服務透過選擇標籤的公共子集（即忽略 `track` 標籤）來覆蓋兩組副本，
以便流量可以轉發到兩個應用：

```yaml
  selector:
     app: guestbook
     tier: frontend
```

<!--
You can tweak the number of replicas of the stable and canary releases to determine the ratio of each release that will receive live production traffic (in this case, 3:1).
Once you're confident, you can update the stable track to the new application release and remove the canary one.
 -->
你可以調整 `stable` 和 `canary` 版本的副本數量，以確定每個版本將接收
實時生產流量的比例（在本例中為 3:1）。
一旦有信心，你就可以將新版本應用的 `track` 標籤的值從
`canary` 替換為 `stable`，並且將老版本應用刪除。

<!--
For a more concrete example, check the [tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).
 -->
想要了解更具體的示例，請檢視
[Ghost 部署教程](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)。

<!--
## Updating labels

Sometimes existing pods and other resources need to be relabeled before creating new resources. This can be done with `kubectl label`.
For example, if you want to label all your nginx pods as frontend tier, run:
 -->
## 更新標籤  {#updating-labels}

有時，現有的 pod 和其它資源需要在建立新資源之前重新標記。
這可以用 `kubectl label` 完成。
例如，如果想要將所有 nginx pod 標記為前端層，執行：

```shell
kubectl label pods -l app=nginx tier=fe
```

```
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

<!--
This first filters all pods with the label "app=nginx", and then labels them with the "tier=fe".
To see the pods you labeled, run:
 -->
首先用標籤 "app=nginx" 過濾所有的 Pod，然後用 "tier=fe" 標記它們。
想要檢視你剛才標記的 Pod，請執行：

```shell
kubectl get pods -l app=nginx -L tier
```

```
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

<!--
This outputs all "app=nginx" pods, with an additional label column of pods' tier (specified with `-L` or `--label-columns`).

For more information, please see [labels](/docs/concepts/overview/working-with-objects/labels/) and [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).
 -->
這將輸出所有 "app=nginx" 的 Pod，並有一個額外的描述 Pod 的 tier 的標籤列
（用引數 `-L` 或者 `--label-columns` 標明）。

想要了解更多資訊，請參考
[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/) 和
[`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands/#label)
命令文件。

<!--
## Updating annotations

Sometimes you would want to attach annotations to resources. Annotations are arbitrary non-identifying metadata for retrieval by API clients such as tools, libraries, etc. This can be done with `kubectl annotate`. For example:
 -->
## 更新註解   {#updating-annotations}

有時，你可能希望將註解附加到資源中。註解是 API 客戶端（如工具、庫等）
用於檢索的任意非標識元資料。這可以透過 `kubectl annotate` 來完成。例如：

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```
```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

<!--
For more information, please see [annotations](/docs/concepts/overview/working-with-objects/annotations/) and [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate) document.
 -->
想要了解更多資訊，請參考
[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)和
[`kubectl annotate`](/docs/reference/generated/kubectl/kubectl-commands/#annotate)
命令文件。

<!--
## Scaling your application

When load on your application grows or shrinks, use `kubectl` to scale you application. For instance, to decrease the number of nginx replicas from 3 to 1, do:
 -->
## 擴縮你的應用

當應用上的負載增長或收縮時，使用 `kubectl` 能夠實現應用規模的擴縮。
例如，要將 nginx 副本的數量從 3 減少到 1，請執行以下操作：

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```
deployment.extensions/my-nginx scaled
```

<!--
Now you only have one pod managed by the deployment.
 -->
現在，你的 Deployment 管理的 Pod 只有一個了。

```shell
kubectl get pods -l app=nginx
```

```
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

<!--
To have the system automatically choose the number of nginx replicas as needed, ranging from 1 to 3, do:
 -->
想要讓系統自動選擇需要 nginx 副本的數量，範圍從 1 到 3，請執行以下操作：

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

<!--
Now your nginx replicas will be scaled up and down as needed, automatically.

For more information, please see [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) and [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) document.
 -->
現在，你的 nginx 副本將根據需要自動地增加或者減少。

想要了解更多資訊，請參考
[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale)命令文件、
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 命令文件和
[水平 Pod 自動伸縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) 文件。

<!--
## In-place updates of resources

Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.
 -->
## 就地更新資源  {#in-place-updates-of-resources}

有時，有必要對你所建立的資源進行小範圍、無干擾地更新。

### kubectl apply

<!--
It is suggested to maintain a set of configuration files in source control (see [configuration as code](http://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to push your configuration changes to the cluster.
 -->
建議在原始碼管理中維護一組配置檔案
（參見[配置即程式碼](https://martinfowler.com/bliki/InfrastructureAsCode.html)），
這樣，它們就可以和應用程式碼一樣進行維護和版本管理。
然後，你可以用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)
將配置變更應用到叢集中。

<!--
This command will compare the version of the configuration that you're pushing with the previous version and apply the changes you've made, without overwriting any automated changes to properties you haven't specified.
 -->
這個命令將會把推送的版本與以前的版本進行比較，並應用你所做的更改，
但是不會自動覆蓋任何你沒有指定更改的屬性。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

<!--
Note that `kubectl apply` attaches an annotation to the resource in order to determine the changes to the configuration since the previous invocation. When it's invoked, `kubectl apply` does a three-way diff between the previous configuration, the provided input and the current configuration of the resource, in order to determine how to modify the resource.
 -->
注意，`kubectl apply` 將為資源增加一個額外的註解，以確定自上次呼叫以來對配置的更改。
執行時，`kubectl apply` 會在以前的配置、提供的輸入和資源的當前配置之間
找出三方差異，以確定如何修改資源。

<!--
Currently, resources are created without this annotation, so the first invocation of `kubectl apply` will fall back to a two-way diff between the provided input and the current configuration of the resource. During this first invocation, it cannot detect the deletion of properties set when the resource was created. For this reason, it will not remove them.
 -->
目前，新建立的資源是沒有這個註解的，所以，第一次呼叫 `kubectl apply` 時
將使用提供的輸入和資源的當前配置雙方之間差異進行比較。
在第一次呼叫期間，它無法檢測資源建立時屬性集的刪除情況。
因此，kubectl 不會刪除它們。

<!--
All subsequent calls to `kubectl apply`, and other commands that modify the configuration, such as `kubectl replace` and `kubectl edit`, will update the annotation, allowing subsequent calls to `kubectl apply` to detect and perform deletions using a three-way diff.
 -->
所有後續的 `kubectl apply` 操作以及其他修改配置的命令，如 `kubectl replace`
和 `kubectl edit`，都將更新註解，並允許隨後呼叫的 `kubectl apply`
使用三方差異進行檢查和執行刪除。

<!--
To use apply, always create resource initially with either `kubectl apply` or `kubectl create --save-config`.
 -->
{{< note >}}
想要使用 apply，請始終使用 `kubectl apply` 或 `kubectl create --save-config` 建立資源。
{{< /note >}}

### kubectl edit

<!--
Alternatively, you may also update resources with `kubectl edit`:
 -->
或者，你也可以使用 `kubectl edit` 更新資源：

```shell
kubectl edit deployment/my-nginx
```

<!--
This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the resource with the updated version:
 -->
這相當於首先 `get` 資源，在文字編輯器中編輯它，然後用更新的版本 `apply` 資源：

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

<!--
This allows you to do more significant changes more easily. Note that you can specify the editor with your `EDITOR` or `KUBE_EDITOR` environment variables.

For more information, please see [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit) document.
 -->
這使你可以更加容易地進行更重大的更改。
請注意，可以使用 `EDITOR` 或 `KUBE_EDITOR` 環境變數來指定編輯器。

想要了解更多資訊，請參考
[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit) 文件。

### kubectl patch

<!--
You can use `kubectl patch` to update API objects in place. This command supports JSON patch,
JSON merge patch, and strategic merge patch. See
[Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
and
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).
 -->
你可以使用 `kubectl patch` 來更新 API 物件。此命令支援 JSON patch、
JSON merge patch、以及 strategic merge patch。 請參考
[使用 kubectl patch 更新 API 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
和
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).

<!--
## Disruptive updates

In some cases, you may need to update resource fields that cannot be updated once initialized, or you may want to make a recursive change immediately, such as to fix broken pods created by a Deployment. To change such fields, use `replace --force`, which deletes and re-creates the resource. In this case, you can modify your original configuration file:
 -->
## 破壞性的更新  {#disruptive-updates}

在某些情況下，你可能需要更新某些初始化後無法更新的資源欄位，或者你可能只想立即進行遞迴更改，
例如修復 Deployment 建立的不正常的 Pod。若要更改這些欄位，請使用 `replace --force`，
它將刪除並重新建立資源。在這種情況下，你可以修改原始配置檔案：

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

<!--
## Updating your application without a service outage
 -->
## 在不中斷服務的情況下更新應用

<!--
At some point, you'll eventually need to update your deployed application, typically by specifying a new image or image tag, as in the canary deployment scenario above. `kubectl` supports several update operations, each of which is applicable to different scenarios.
 -->
在某些時候，你最終需要更新已部署的應用，通常都是透過指定新的映象或映象標籤，
如上面的金絲雀釋出的場景中所示。`kubectl` 支援幾種更新操作，
每種更新操作都適用於不同的場景。

<!--
We'll guide you through how to create and update applications with Deployments.
 -->
我們將指導你透過 Deployment 如何建立和更新應用。

<!--
Let's say you were running version 1.14.2 of nginx:
 -->
假設你正執行的是 1.14.2 版本的 nginx：

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```
```
deployment.apps/my-nginx created
```

<!--
To update to version 1.16.1, change `.spec.template.spec.containers[0].image` from `nginx:1.14.2` to `nginx:1.16.1`, with the previous kubectl commands.
 -->
要更新到 1.16.1 版本，只需使用我們前面學到的 kubectl 命令將
`.spec.template.spec.containers[0].image` 從 `nginx:1.14.2` 修改為 `nginx:1.16.1`。

```shell
kubectl edit deployment/my-nginx
```

<!--
That's it! The Deployment will declaratively update the deployed nginx application progressively behind the scene. It ensures that only a certain number of old replicas may be down while they are being updated, and only a certain number of new replicas may be created above the desired number of pods. To learn more details about it, visit [Deployment page](/docs/concepts/workloads/controllers/deployment/).
 -->
沒錯，就是這樣！Deployment 將在後臺逐步更新已經部署的 nginx 應用。
它確保在更新過程中，只有一定數量的舊副本被開閉，並且只有一定基於所需 Pod 數量的新副本被建立。
想要了解更多細節，請參考 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

## {{% heading "whatsnext" %}}

<!--
- [Learn about how to use `kubectl` for application introspection and debugging.](/docs/tasks/debug/debug-application/debug-running-pod/)
- [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)
 -->
- 學習[如何使用 `kubectl` 觀察和除錯應用](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)
- 閱讀[配置最佳實踐和技巧](/zh-cn/docs/concepts/configuration/overview/)
