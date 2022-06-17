---
title: 配置最佳實踐
content_type: concept
weight: 10
---
<!--
title: Configuration Best Practices
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This document highlights and consolidates configuration best practices that are introduced throughout the user guide, Getting Started documentation, and examples.
-->
本文件重點介紹並整合了整個使用者指南、入門文件和示例中介紹的配置最佳實踐。

<!--
This is a living document. If you think of something that is not on this list but might be useful to others, please don't hesitate to file an issue or submit a PR.
-->
這是一份不斷改進的檔案。
如果你認為某些內容缺失但可能對其他人有用，請不要猶豫，提交 Issue 或提交 PR。

<!-- body -->
<!--
## General Configuration Tips
-->
## 一般配置提示  {#general-configuration-tips}

<!--
- When defining configurations, specify the latest stable API version.
-->
- 定義配置時，請指定最新的穩定 API 版本。

<!--
- Configuration files should be stored in version control before being pushed to the cluster. This allows you to quickly roll back a configuration change if necessary. It also aids cluster re-creation and restoration.
-->
- 在推送到叢集之前，配置檔案應儲存在版本控制中。
 這允許你在必要時快速回滾配置更改。
 它還有助於叢集重新建立和恢復。 

<!--
- Write your configuration files using YAML rather than JSON. Though these formats can be used interchangeably in almost all scenarios, YAML tends to be more user-friendly.
-->
- 使用 YAML 而不是 JSON 編寫配置檔案。雖然這些格式幾乎可以在所有場景中互換使用，但 YAML 往往更加使用者友好。

<!--
- Group related objects into a single file whenever it makes sense. One file is often easier to manage than several. See the [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml) file as an example of this syntax.
-->
- 只要有意義，就將相關物件分組到一個檔案中。
 一個檔案通常比幾個檔案更容易管理。
 請參閱 [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml) 檔案作為此語法的示例。

<!--
- Note also that many `kubectl` commands can be called on a directory. For example, you can call `kubectl apply` on a directory of config files.
-->
- 另請注意，可以在目錄上呼叫許多`kubectl`命令。
 例如，你可以在配置檔案的目錄中呼叫`kubectl apply`。

<!--
- Don't specify default values unnecessarily: simple, minimal configuration will make errors less likely.
-->
- 除非必要，否則不指定預設值：簡單的最小配置會降低錯誤的可能性。

<!--
- Put object descriptions in annotations, to allow better introspection.
-->
- 將物件描述放在註釋中，以便更好地進行內省。


<!--
## "Naked" Pods vs ReplicaSets, Deployments, and Jobs
-->
## “Naked” Pods 與 ReplicaSet，Deployment 和 Jobs

<!--
- Don't use naked Pods (that is, Pods not bound to a [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) or [Deployment](/docs/concepts/workloads/controllers/deployment/)) if you can avoid it. Naked Pods will not be rescheduled in the event of a node failure.
-->
- 如果可能，不要使用獨立的 Pods（即，未繫結到
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 或
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 的 Pod）。
 如果節點發生故障，將不會重新排程獨立的 Pods。

<!--
  A Deployment, which both creates a ReplicaSet to ensure that the desired number of Pods is always available, and specifies a strategy to replace Pods (such as [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), is almost always preferable to creating Pods directly, except for some explicit [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) scenarios. A [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/) may also be appropriate.
-->

Deployment 既可以建立一個 ReplicaSet 來確保預期個數的 Pod 始終可用，也可以指定替換 Pod 的策略（例如
[RollingUpdate](/zh-cn/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)）。
除了一些顯式的 [`restartPolicy: Never`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
場景外，Deployment 通常比直接建立 Pod 要好得多。[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 也可能是合適的選擇。

<!--
## Services
-->
## 服務   {#services}

<!--
- Create a [Service](/docs/concepts/services-networking/service/) before its corresponding backend workloads (Deployments or ReplicaSets), and before any workloads that need to access it. When Kubernetes starts a container, it provides environment variables pointing to all the Services which were running when the container was started. For example, if a Service named `foo` exists, all containers will get the following variables in their initial environment:
-->
- 在建立相應的後端工作負載（Deployment 或 ReplicaSet），以及在需要訪問它的任何工作負載之前建立
  [服務](/zh-cn/docs/concepts/services-networking/service/)。
  當 Kubernetes 啟動容器時，它提供指向啟動容器時正在執行的所有服務的環境變數。
  例如，如果存在名為 `foo` 的服務，則所有容器將在其初始環境中獲得以下變數。

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

<!--
  *This does imply an ordering requirement* - any `Service` that a `Pod` wants to access must be created before the `Pod` itself, or else the environment variables will not be populated.  DNS does not have this restriction.
-->
  *這確實意味著在順序上的要求* - 必須在 `Pod` 本身被建立之前建立 `Pod` 想要訪問的任何 `Service`，
  否則將環境變數不會生效。DNS 沒有此限制。

<!--
- An optional (though strongly recommended) [cluster add-on](/docs/concepts/cluster-administration/addons/) is a DNS server.  The
DNS server watches the Kubernetes API for new `Services` and creates a set of DNS records for each.  If DNS has been enabled throughout the cluster then all `Pods` should be able to do name resolution of `Services` automatically.
-->
- 一個可選（儘管強烈推薦）的[叢集外掛](/zh-cn/docs/concepts/cluster-administration/addons/)
  是 DNS 伺服器。DNS 伺服器為新的 `Services` 監視 Kubernetes API，併為每個建立一組 DNS 記錄。
  如果在整個叢集中啟用了 DNS，則所有 `Pods` 應該能夠自動對 `Services` 進行名稱解析。

<!--
- Don't specify a `hostPort` for a Pod unless it is absolutely necessary. When you bind a Pod to a `hostPort`, it limits the number of places the Pod can be scheduled, because each <`hostIP`, `hostPort`, `protocol`> combination must be unique. If you don't specify the `hostIP` and `protocol` explicitly, Kubernetes will use `0.0.0.0` as the default `hostIP` and `TCP` as the default `protocol`.
-->
- 除非絕對必要，否則不要為 Pod 指定 `hostPort`。
  將 Pod 繫結到`hostPort`時，它會限制 Pod 可以排程的位置數，因為每個
  `<hostIP, hostPort, protocol>`組合必須是唯一的。
  如果你沒有明確指定 `hostIP` 和 `protocol`，Kubernetes 將使用 `0.0.0.0` 作為預設
  `hostIP` 和 `TCP` 作為預設 `protocol`。

<!--
  If you only need access to the port for debugging purposes, you can use the [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls) or [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).
-->
  如果你只需要訪問埠以進行除錯，則可以使用
  [apiserver proxy](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)或
  [`kubectl port-forward`](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)。

<!--
  If you explicitly need to expose a Pod's port on the node, consider using a [NodePort](/docs/concepts/services-networking/service/#type-nodeport) Service before resorting to `hostPort`.
-->
  如果你明確需要在節點上公開 Pod 的埠，請在使用 `hostPort` 之前考慮使用
  [NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport) 服務。

<!--
- Avoid using `hostNetwork`, for the same reasons as `hostPort`.
-->
- 避免使用 `hostNetwork`，原因與 `hostPort` 相同。

<!--
- Use [headless Services](/docs/concepts/services-networking/service/#headless-
services) (which have a `ClusterIP` of `None`) for service discovery when you don't need `kube-proxy` load balancing.
-->
- 當你不需要 `kube-proxy` 負載均衡時，使用
  [無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)  
  (`ClusterIP` 被設定為 `None`)以便於服務發現。

<!--
## Using Labels
-->
## 使用標籤   {#using-labels}

<!--
- Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify __semantic attributes__ of your application or Deployment, such as `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. You can use these labels to select the appropriate Pods for other resources; for example, a Service that selects all `tier: frontend` Pods, or all `phase: test` components of `app: myapp`. See the [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/) app for examples of this approach.
-->
- 定義並使用[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)來識別應用程式
  或 Deployment 的 __語義屬性__，例如`{ app: myapp, tier: frontend, phase: test, deployment: v3 }`。
  你可以使用這些標籤為其他資源選擇合適的 Pod；
  例如，一個選擇所有 `tier: frontend` Pod 的服務，或者 `app: myapp` 的所有 `phase: test` 元件。
  有關此方法的示例，請參閱 [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/) 。

<!--
A Service can be made to span multiple Deployments by omitting release-specific labels from its selector. [Deployments](/docs/concepts/workloads/controllers/deployment/) make it easy to update a running service without downtime.
-->
透過從選擇器中省略特定發行版的標籤，可以使服務跨越多個 Deployment。
當你需要不停機的情況下更新正在執行的服務，可以使用[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

<!--
A desired state of an object is described by a Deployment, and if changes to that spec are _applied_, the deployment controller changes the actual state to the desired state at a controlled rate.
-->
Deployment 描述了物件的期望狀態，並且如果對該規範的更改被成功應用，
則 Deployment 控制器以受控速率將實際狀態改變為期望狀態。

<!--
- Use the [Kubernetes common labels](/docs/concepts/overview/working-with-objects/common-labels/) for common use cases. These standardized labels enrich the metadata in a way that allows tools, including `kubectl` and [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard), to work in an interoperable way.
-->

- 對於常見場景，應使用 [Kubernetes 通用標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)。
  這些標準化的標籤豐富了物件的元資料，使得包括 `kubectl` 和
  [儀表板（Dashboard）](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard)
  這些工具能夠以可互操作的方式工作。

<!--
- You can manipulate labels for debugging. Because Kubernetes controllers (such as ReplicaSet) and Services match to Pods using selector labels, removing the relevant labels from a Pod will stop it from being considered by a controller or from being served traffic by a Service. If you remove the labels of an existing Pod, its controller will create a new Pod to take its place. This is a useful way to debug a previously "live" Pod in a "quarantine" environment. To interactively remove or add labels, use [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).
-->
- 你可以操縱標籤進行除錯。
  由於 Kubernetes 控制器（例如 ReplicaSet）和服務使用選擇器標籤來匹配 Pod，
  從 Pod 中刪除相關標籤將阻止其被控制器考慮或由服務提供服務流量。
  如果刪除現有 Pod 的標籤，其控制器將建立一個新的 Pod 來取代它。
  這是在"隔離"環境中除錯先前"活躍"的 Pod 的有用方法。
  要以互動方式刪除或新增標籤，請使用 [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label)。

<!--
## Using kubectl
-->
## 使用 kubectl   {#using-kubectl}

<!--
- Use `kubectl apply -f <directory>`. This looks for Kubernetes configuration in all `.yaml`, `.yml`, and `.json` files in `<directory>` and passes it to `apply`.
-->
- 使用 `kubectl apply -f <directory>`。
  它在 `<directory>` 中的所有` .yaml`、`.yml` 和 `.json` 檔案中查詢 Kubernetes 配置，並將其傳遞給 `apply`。

<!--
- Use label selectors for `get` and `delete` operations instead of specific object names. See the sections on [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) and [using labels effectively](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).
-->
- 使用標籤選擇器進行 `get` 和 `delete` 操作，而不是特定的物件名稱。
- 請參閱[標籤選擇器](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)和
  [有效使用標籤](/zh-cn/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)部分。

<!--
- Use `kubectl run` and `kubectl expose` to quickly create single-container Deployments and Services. See [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) for an example.
-->
- 使用`kubectl run`和`kubectl expose`來快速建立單容器部署和服務。
  有關示例，請參閱[使用服務訪問叢集中的應用程式](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)。


