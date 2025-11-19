---
title: 配置最佳實踐
content_type: concept
weight: 10
---
<!--
reviewers:
- mikedanese
title: Configuration Best Practices
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This document highlights and consolidates configuration best practices that are introduced
throughout the user guide, Getting Started documentation, and examples.
-->
本文檔重點介紹並整合了整個用戶指南、入門文檔和示例中介紹的配置最佳實踐。

<!--
This is a living document. If you think of something that is not on this list but might be useful
to others, please don't hesitate to file an issue or submit a PR.
-->
這是一份不斷改進的文件。
如果你認爲某些內容缺失但可能對其他人有用，請不要猶豫，提交 Issue 或提交 PR。

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
- Configuration files should be stored in version control before being pushed to the cluster. This
  allows you to quickly roll back a configuration change if necessary. It also aids cluster
  re-creation and restoration.
-->
- 在推送到集羣之前，配置文件應存儲在版本控制中。
  這允許你在必要時快速回滾配置更改。
  它還有助於集羣重新創建和恢復。

<!--
- Write your configuration files using YAML rather than JSON. Though these formats can be used
  interchangeably in almost all scenarios, YAML tends to be more user-friendly.
-->
- 使用 YAML 而不是 JSON 編寫配置文件。雖然這些格式幾乎可以在所有場景中互換使用，但 YAML 往往更加用戶友好。

<!--
- Group related objects into a single file whenever it makes sense. One file is often easier to
  manage than several. See the
  [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml)
  file as an example of this syntax.
-->
- 只要有意義，就將相關對象分組到一個文件中。一個文件通常比幾個文件更容易管理。
  請參閱 [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml)
  文件作爲此語法的示例。

<!--
- Note also that many `kubectl` commands can be called on a directory. For example, you can call
  `kubectl apply` on a directory of config files.
-->
- 另請注意，可以在目錄上調用許多 `kubectl` 命令。
  例如，你可以在配置文件的目錄中調用 `kubectl apply`。

<!--
- Don't specify default values unnecessarily: simple, minimal configuration will make errors less likely.
-->
- 除非必要，否則不指定默認值：簡單的最小配置會降低錯誤的可能性。

<!--
- Put object descriptions in annotations, to allow better introspection.
-->
- 將對象描述放在註釋中，以便更好地進行內省。

{{< note >}}
<!--
There is a breaking change introduced in the [YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744)
boolean values specification with respect to [YAML 1.1](https://yaml.org/spec/1.1/#id864510).
This is a known [issue](https://github.com/kubernetes/kubernetes/issues/34146) in Kubernetes.
YAML 1.2 only recognizes **true** and **false** as valid booleans, while YAML 1.1 also accepts
**yes**, **no**, **on**, and  **off** as booleans. However, Kubernetes uses YAML
[parsers](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024) that are
mostly compatible with YAML 1.1, which means that using **yes** or **no** instead of **true** or
**false** in a YAML manifest may cause unexpected errors or behaviors. To avoid this issue, it is
recommended to always use **true** or **false** for boolean values in YAML manifests, and to quote
any strings that may be confused with booleans, such as **"yes"** or **"no"**.
-->
相較於 [YAML 1.1](https://yaml.org/spec/1.1/#id864510)，
[YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744) 在布爾值規範中引入了一個破壞性的變更。
這是 Kubernetes 中的一個已知[問題](https://github.com/kubernetes/kubernetes/issues/34146)。
YAML 1.2 僅識別 **true** 和 **false** 作爲有效的布爾值，而 YAML 1.1 還可以接受 
**yes**、**no**、**on** 和 **off** 作爲布爾值。
然而，Kubernetes 正在使用的 YAML [解析器](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024)
與 YAML 1.1 基本兼容，
這意味着在 YAML 清單中使用 **yes** 或 **no** 而不是 **true** 或 **false** 可能會導致意外的錯誤或行爲。
爲避免此類問題，建議在 YAML 清單中始終使用 **true** 或 **false** 作爲布爾值，
並對任何可能與布爾值混淆的字符串進行引號標記，例如 **"yes"** 或 **"no"**。

<!--
Besides booleans, there are additional specifications changes between YAML versions. Please refer
to the [YAML Specification Changes](https://spec.yaml.io/main/spec/1.2.2/ext/changes) documentation
for a comprehensive list.
-->
除了布爾值之外，YAML 版本之間還存在其他的規範變化。
請參考 [YAML 規範變更](https://spec.yaml.io/main/spec/1.2.2/ext/changes)文檔來獲取完整列表。
{{< /note >}}

<!--
## "Naked" Pods versus ReplicaSets, Deployments, and Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}
-->
## “獨立的“ Pod 與 ReplicaSet、Deployment 和 Job {#naked-pods-vs-replicasets-deployments-and-jobs}

<!--
- Don't use naked Pods (that is, Pods not bound to a [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) or
  [Deployment](/docs/concepts/workloads/controllers/deployment/)) if you can avoid it. Naked Pods
  will not be rescheduled in the event of a node failure.

  A Deployment, which both creates a ReplicaSet to ensure that the desired number of Pods is
  always available, and specifies a strategy to replace Pods (such as
  [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), is
  almost always preferable to creating Pods directly, except for some explicit
  [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) scenarios.
  A [Job](/docs/concepts/workloads/controllers/job/) may also be appropriate.
-->
- 如果可能，不要使用獨立的 Pod（即，未綁定到
  [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 或
  [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 的 Pod）。
  如果節點發生故障，將不會重新調度這些獨立的 Pod。

  Deployment 既可以創建一個 ReplicaSet 來確保預期個數的 Pod 始終可用，也可以指定替換 Pod 的策略（例如
  [RollingUpdate](/zh-cn/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)）。
  除了一些顯式的 [`restartPolicy: Never`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
  場景外，Deployment 通常比直接創建 Pod 要好得多。
  [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 也可能是合適的選擇。

<!--
## Services
-->
## 服務   {#services}

<!--
- Create a [Service](/docs/concepts/services-networking/service/) before its corresponding backend
  workloads (Deployments or ReplicaSets), and before any workloads that need to access it.
  When Kubernetes starts a container, it provides environment variables pointing to all the Services
  which were running when the container was started. For example, if a Service named `foo` exists,
  all containers will get the following variables in their initial environment:
-->
- 在創建相應的後端工作負載（Deployment 或 ReplicaSet），以及在需要訪問它的任何工作負載之前創建
  [服務](/zh-cn/docs/concepts/services-networking/service/)。
  當 Kubernetes 啓動容器時，它提供指向啓動容器時正在運行的所有服務的環境變量。
  例如，如果存在名爲 `foo` 的服務，則所有容器將在其初始環境中獲得以下變量。

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  <!--
  *This does imply an ordering requirement* - any `Service` that a `Pod` wants to access must be
  created before the `Pod` itself, or else the environment variables will not be populated.
  DNS does not have this restriction.
  -->
  **這確實意味着在順序上的要求** - 必須在 `Pod` 本身被創建之前創建 `Pod` 想要訪問的任何 `Service`，
  否則將環境變量不會生效。DNS 沒有此限制。

<!--
- An optional (though strongly recommended) [cluster add-on](/docs/concepts/cluster-administration/addons/)
  is a DNS server. The DNS server watches the Kubernetes API for new `Services` and creates a set
  of DNS records for each. If DNS has been enabled throughout the cluster then all `Pods` should be
  able to do name resolution of `Services` automatically.
-->
- 一個可選（儘管強烈推薦）的[集羣插件](/zh-cn/docs/concepts/cluster-administration/addons/)
  是 DNS 服務器。DNS 服務器爲新的 `Services` 監視 Kubernetes API，併爲每個創建一組 DNS 記錄。
  如果在整個集羣中啓用了 DNS，則所有 `Pod` 應該能夠自動對 `Services` 進行名稱解析。

<!--
- Don't specify a `hostPort` for a Pod unless it is absolutely necessary. When you bind a Pod to a
  `hostPort`, it limits the number of places the Pod can be scheduled, because each <`hostIP`,
  `hostPort`, `protocol`> combination must be unique. If you don't specify the `hostIP` and
  `protocol` explicitly, Kubernetes will use `0.0.0.0` as the default `hostIP` and `TCP` as the
  default `protocol`.

  If you only need access to the port for debugging purposes, you can use the
  [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)
  or [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  If you explicitly need to expose a Pod's port on the node, consider using a
  [NodePort](/docs/concepts/services-networking/service/#type-nodeport) Service before resorting to
  `hostPort`.
-->
- 不要爲 Pod 指定 `hostPort`，除非非常有必要這樣做。
  當你爲 Pod 綁定了 `hostPort`，那麼能夠運行該 Pod 的節點就有限了，因爲每個 `<hostIP, hostPort, protocol>` 組合必須是唯一的。
  如果你沒有明確指定 `hostIP` 和 `protocol`，
  Kubernetes 將使用 `0.0.0.0` 作爲默認的 `hostIP`，使用 `TCP` 作爲默認的 `protocol`。

  如果你只需要訪問端口以進行調試，則可以使用
  [apiserver proxy](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)
  或
  [`kubectl port-forward`](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)。

  如果你明確需要在節點上公開 Pod 的端口，請在使用 `hostPort` 之前考慮使用
  [NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport) 服務。

<!--
- Avoid using `hostNetwork`, for the same reasons as `hostPort`.
-->
- 避免使用 `hostNetwork`，原因與 `hostPort` 相同。

<!--
- Use [headless Services](/docs/concepts/services-networking/service/#headless-services)
  (which have a `ClusterIP` of `None`) for service discovery when you don't need `kube-proxy`
  load balancing.
-->
- 當你不需要 `kube-proxy` 負載均衡時，
  使用[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)
  （`ClusterIP` 被設置爲 `None`）進行服務發現。

<!--
## Using Labels
-->
## 使用標籤   {#using-labels}

<!--
- Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify
  __semantic attributes__ of your application or Deployment, such as `{ app.kubernetes.io/name:
  MyApp, tier: frontend, phase: test, deployment: v3 }`. You can use these labels to select the
  appropriate Pods for other resources; for example, a Service that selects all `tier: frontend`
  Pods, or all `phase: test` components of `app.kubernetes.io/name: MyApp`.
  See the [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) app
  for examples of this approach.

  A Service can be made to span multiple Deployments by omitting release-specific labels from its
  selector. When you need to update a running service without downtime, use a
  [Deployment](/docs/concepts/workloads/controllers/deployment/).

  A desired state of an object is described by a Deployment, and if changes to that spec are
  _applied_, the deployment controller changes the actual state to the desired state at a controlled
  rate.
-->
- 定義並使用[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)來識別應用程序
  或 Deployment 的**語義屬性**，例如 `{ app.kubernetes.io/name: MyApp, tier: frontend, phase: test, deployment: v3 }`。
  你可以使用這些標籤爲其他資源選擇合適的 Pod；
  例如，一個選擇所有 `tier: frontend` Pod 的服務，或者 `app.kubernetes.io/name: MyApp` 的所有 `phase: test` 組件。
  有關此方法的示例，請參閱 [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) 。

  通過從選擇器中省略特定發行版的標籤，可以使服務跨越多個 Deployment。
  當你需要不停機的情況下更新正在運行的服務，可以使用 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

  Deployment 描述了對象的期望狀態，並且如果對該規約的更改被成功應用，則 Deployment
  控制器以受控速率將實際狀態改變爲期望狀態。

<!--
- Use the [Kubernetes common labels](/docs/concepts/overview/working-with-objects/common-labels/)
  for common use cases. These standardized labels enrich the metadata in a way that allows tools,
  including `kubectl` and [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard), to
  work in an interoperable way.
-->
- 對於常見場景，應使用 [Kubernetes 通用標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)。
  這些標準化的標籤豐富了對象的元數據，使得包括 `kubectl` 和
  [儀表板（Dashboard）](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard)
  這些工具能夠以可互操作的方式工作。

<!--
- You can manipulate labels for debugging. Because Kubernetes controllers (such as ReplicaSet) and
  Services match to Pods using selector labels, removing the relevant labels from a Pod will stop
  it from being considered by a controller or from being served traffic by a Service. If you remove
  the labels of an existing Pod, its controller will create a new Pod to take its place. This is a
  useful way to debug a previously "live" Pod in a "quarantine" environment. To interactively remove
  or add labels, use [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).
-->
- 你可以操縱標籤進行調試。
  由於 Kubernetes 控制器（例如 ReplicaSet）和服務使用選擇器標籤來匹配 Pod，
  從 Pod 中刪除相關標籤將阻止其被控制器考慮或由服務提供服務流量。
  如果刪除現有 Pod 的標籤，其控制器將創建一個新的 Pod 來取代它。
  這是在“隔離“環境中調試先前“活躍“的 Pod 的有用方法。
  要以交互方式刪除或添加標籤，請使用 [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label)。

<!--
## Using kubectl
-->
## 使用 kubectl   {#using-kubectl}

<!--
- Use `kubectl apply -f <directory>`. This looks for Kubernetes configuration in all `.yaml`,
  `.yml`, and `.json` files in `<directory>` and passes it to `apply`.
-->
- 使用 `kubectl apply -f <目錄>`。
  它在 `<目錄>` 中的所有 `.yaml`、`.yml` 和 `.json` 文件中查找 Kubernetes 配置，並將其傳遞給 `apply`。

<!--
- Use label selectors for `get` and `delete` operations instead of specific object names. See the
  sections on [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  and [using labels effectively](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively).
-->
- 使用標籤選擇器進行 `get` 和 `delete` 操作，而不是特定的對象名稱。
- 請參閱[標籤選擇器](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)和
  [有效使用標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)部分。

<!--
- Use `kubectl create deployment` and `kubectl expose` to quickly create single-container
  Deployments and Services.
  See [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
  for an example.
-->
- 使用 `kubectl create deployment` 和 `kubectl expose` 來快速創建單容器 Deployment 和 Service。
  有關示例，請參閱[使用服務訪問集羣中的應用程序](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)。
