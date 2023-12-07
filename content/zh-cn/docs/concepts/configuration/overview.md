---
title: 配置最佳实践
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
本文档重点介绍并整合了整个用户指南、入门文档和示例中介绍的配置最佳实践。

<!--
This is a living document. If you think of something that is not on this list but might be useful
to others, please don't hesitate to file an issue or submit a PR.
-->
这是一份不断改进的文件。
如果你认为某些内容缺失但可能对其他人有用，请不要犹豫，提交 Issue 或提交 PR。

<!-- body -->
<!--
## General Configuration Tips
-->
## 一般配置提示  {#general-configuration-tips}

<!--
- When defining configurations, specify the latest stable API version.
-->
- 定义配置时，请指定最新的稳定 API 版本。

<!--
- Configuration files should be stored in version control before being pushed to the cluster. This
  allows you to quickly roll back a configuration change if necessary. It also aids cluster
  re-creation and restoration.
-->
- 在推送到集群之前，配置文件应存储在版本控制中。
  这允许你在必要时快速回滚配置更改。
  它还有助于集群重新创建和恢复。

<!--
- Write your configuration files using YAML rather than JSON. Though these formats can be used
  interchangeably in almost all scenarios, YAML tends to be more user-friendly.
-->
- 使用 YAML 而不是 JSON 编写配置文件。虽然这些格式几乎可以在所有场景中互换使用，但 YAML 往往更加用户友好。

<!--
- Group related objects into a single file whenever it makes sense. One file is often easier to
  manage than several. See the
  [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml)
  file as an example of this syntax.
-->
- 只要有意义，就将相关对象分组到一个文件中。一个文件通常比几个文件更容易管理。
  请参阅 [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml)
  文件作为此语法的示例。

<!--
- Note also that many `kubectl` commands can be called on a directory. For example, you can call
  `kubectl apply` on a directory of config files.
-->
- 另请注意，可以在目录上调用许多 `kubectl` 命令。
  例如，你可以在配置文件的目录中调用 `kubectl apply`。

<!--
- Don't specify default values unnecessarily: simple, minimal configuration will make errors less likely.
-->
- 除非必要，否则不指定默认值：简单的最小配置会降低错误的可能性。

<!--
- Put object descriptions in annotations, to allow better introspection.
-->
- 将对象描述放在注释中，以便更好地进行内省。

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
相较于 [YAML 1.1](https://yaml.org/spec/1.1/#id864510)，
[YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744) 在布尔值规范中引入了一个破坏性的变更。
这是 Kubernetes 中的一个已知[问题](https://github.com/kubernetes/kubernetes/issues/34146)。
YAML 1.2 仅识别 **true** 和 **false** 作为有效的布尔值，而 YAML 1.1 还可以接受 
**yes**、**no**、**on** 和 **off** 作为布尔值。
然而，Kubernetes 正在使用的 YAML [解析器](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024)
与 YAML 1.1 基本兼容，
这意味着在 YAML 清单中使用 **yes** 或 **no** 而不是 **true** 或 **false** 可能会导致意外的错误或行为。
为避免此类问题，建议在 YAML 清单中始终使用 **true** 或 **false** 作为布尔值，
并对任何可能与布尔值混淆的字符串进行引号标记，例如 **"yes"** 或 **"no"**。

<!--
Besides booleans, there are additional specifications changes between YAML versions. Please refer
to the [YAML Specification Changes](https://spec.yaml.io/main/spec/1.2.2/ext/changes) documentation
for a comprehensive list.
-->
除了布尔值之外，YAML 版本之间还存在其他的规范变化。
请参考 [YAML 规范变更](https://spec.yaml.io/main/spec/1.2.2/ext/changes)文档来获取完整列表。
{{< /note >}}

<!--
## "Naked" Pods versus ReplicaSets, Deployments, and Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}
-->
## “独立的“ Pod 与 ReplicaSet、Deployment 和 Job {#naked-pods-vs-replicasets-deployments-and-jobs}

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
- 如果可能，不要使用独立的 Pod（即，未绑定到
  [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 或
  [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 的 Pod）。
  如果节点发生故障，将不会重新调度这些独立的 Pod。

  Deployment 既可以创建一个 ReplicaSet 来确保预期个数的 Pod 始终可用，也可以指定替换 Pod 的策略（例如
  [RollingUpdate](/zh-cn/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)）。
  除了一些显式的 [`restartPolicy: Never`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
  场景外，Deployment 通常比直接创建 Pod 要好得多。
  [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 也可能是合适的选择。

<!--
## Services
-->
## 服务   {#services}

<!--
- Create a [Service](/docs/concepts/services-networking/service/) before its corresponding backend
  workloads (Deployments or ReplicaSets), and before any workloads that need to access it.
  When Kubernetes starts a container, it provides environment variables pointing to all the Services
  which were running when the container was started. For example, if a Service named `foo` exists,
  all containers will get the following variables in their initial environment:
-->
- 在创建相应的后端工作负载（Deployment 或 ReplicaSet），以及在需要访问它的任何工作负载之前创建
  [服务](/zh-cn/docs/concepts/services-networking/service/)。
  当 Kubernetes 启动容器时，它提供指向启动容器时正在运行的所有服务的环境变量。
  例如，如果存在名为 `foo` 的服务，则所有容器将在其初始环境中获得以下变量。

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  <!--
  *This does imply an ordering requirement* - any `Service` that a `Pod` wants to access must be
  created before the `Pod` itself, or else the environment variables will not be populated.
  DNS does not have this restriction.
  -->
  **这确实意味着在顺序上的要求** - 必须在 `Pod` 本身被创建之前创建 `Pod` 想要访问的任何 `Service`，
  否则将环境变量不会生效。DNS 没有此限制。

<!--
- An optional (though strongly recommended) [cluster add-on](/docs/concepts/cluster-administration/addons/)
  is a DNS server. The DNS server watches the Kubernetes API for new `Services` and creates a set
  of DNS records for each. If DNS has been enabled throughout the cluster then all `Pods` should be
  able to do name resolution of `Services` automatically.
-->
- 一个可选（尽管强烈推荐）的[集群插件](/zh-cn/docs/concepts/cluster-administration/addons/)
  是 DNS 服务器。DNS 服务器为新的 `Services` 监视 Kubernetes API，并为每个创建一组 DNS 记录。
  如果在整个集群中启用了 DNS，则所有 `Pod` 应该能够自动对 `Services` 进行名称解析。

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
- 不要为 Pod 指定 `hostPort`，除非非常有必要这样做。
  当你为 Pod 绑定了 `hostPort`，那么能够运行该 Pod 的节点就有限了，因为每个 `<hostIP, hostPort, protocol>` 组合必须是唯一的。
  如果你没有明确指定 `hostIP` 和 `protocol`，
  Kubernetes 将使用 `0.0.0.0` 作为默认的 `hostIP`，使用 `TCP` 作为默认的 `protocol`。

  如果你只需要访问端口以进行调试，则可以使用
  [apiserver proxy](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)
  或
  [`kubectl port-forward`](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)。

  如果你明确需要在节点上公开 Pod 的端口，请在使用 `hostPort` 之前考虑使用
  [NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport) 服务。

<!--
- Avoid using `hostNetwork`, for the same reasons as `hostPort`.
-->
- 避免使用 `hostNetwork`，原因与 `hostPort` 相同。

<!--
- Use [headless Services](/docs/concepts/services-networking/service/#headless-services)
  (which have a `ClusterIP` of `None`) for service discovery when you don't need `kube-proxy`
  load balancing.
-->
- 当你不需要 `kube-proxy` 负载均衡时，
  使用[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)
  （`ClusterIP` 被设置为 `None`）进行服务发现。

<!--
## Using Labels
-->
## 使用标签   {#using-labels}

<!--
- Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify
  __semantic attributes__ of your application or Deployment, such as `{ app.kubernetes.io/name:
  MyApp, tier: frontend, phase: test, deployment: v3 }`. You can use these labels to select the
  appropriate Pods for other resources; for example, a Service that selects all `tier: frontend`
  Pods, or all `phase: test` components of `app.kubernetes.io/name: MyApp`.
  See the [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/) app
  for examples of this approach.

  A Service can be made to span multiple Deployments by omitting release-specific labels from its
  selector. When you need to update a running service without downtime, use a
  [Deployment](/docs/concepts/workloads/controllers/deployment/).

  A desired state of an object is described by a Deployment, and if changes to that spec are
  _applied_, the deployment controller changes the actual state to the desired state at a controlled
  rate.
-->
- 定义并使用[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)来识别应用程序
  或 Deployment 的**语义属性**，例如 `{ app.kubernetes.io/name: MyApp, tier: frontend, phase: test, deployment: v3 }`。
  你可以使用这些标签为其他资源选择合适的 Pod；
  例如，一个选择所有 `tier: frontend` Pod 的服务，或者 `app.kubernetes.io/name: MyApp` 的所有 `phase: test` 组件。
  有关此方法的示例，请参阅 [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/) 。

  通过从选择器中省略特定发行版的标签，可以使服务跨越多个 Deployment。
  当你需要不停机的情况下更新正在运行的服务，可以使用 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

  Deployment 描述了对象的期望状态，并且如果对该规约的更改被成功应用，则 Deployment
  控制器以受控速率将实际状态改变为期望状态。

<!--
- Use the [Kubernetes common labels](/docs/concepts/overview/working-with-objects/common-labels/)
  for common use cases. These standardized labels enrich the metadata in a way that allows tools,
  including `kubectl` and [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard), to
  work in an interoperable way.
-->
- 对于常见场景，应使用 [Kubernetes 通用标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)。
  这些标准化的标签丰富了对象的元数据，使得包括 `kubectl` 和
  [仪表板（Dashboard）](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard)
  这些工具能够以可互操作的方式工作。

<!--
- You can manipulate labels for debugging. Because Kubernetes controllers (such as ReplicaSet) and
  Services match to Pods using selector labels, removing the relevant labels from a Pod will stop
  it from being considered by a controller or from being served traffic by a Service. If you remove
  the labels of an existing Pod, its controller will create a new Pod to take its place. This is a
  useful way to debug a previously "live" Pod in a "quarantine" environment. To interactively remove
  or add labels, use [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).
-->
- 你可以操纵标签进行调试。
  由于 Kubernetes 控制器（例如 ReplicaSet）和服务使用选择器标签来匹配 Pod，
  从 Pod 中删除相关标签将阻止其被控制器考虑或由服务提供服务流量。
  如果删除现有 Pod 的标签，其控制器将创建一个新的 Pod 来取代它。
  这是在“隔离“环境中调试先前“活跃“的 Pod 的有用方法。
  要以交互方式删除或添加标签，请使用 [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label)。

<!--
## Using kubectl
-->
## 使用 kubectl   {#using-kubectl}

<!--
- Use `kubectl apply -f <directory>`. This looks for Kubernetes configuration in all `.yaml`,
  `.yml`, and `.json` files in `<directory>` and passes it to `apply`.
-->
- 使用 `kubectl apply -f <目录>`。
  它在 `<目录>` 中的所有 `.yaml`、`.yml` 和 `.json` 文件中查找 Kubernetes 配置，并将其传递给 `apply`。

<!--
- Use label selectors for `get` and `delete` operations instead of specific object names. See the
  sections on [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  and [using labels effectively](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively).
-->
- 使用标签选择器进行 `get` 和 `delete` 操作，而不是特定的对象名称。
- 请参阅[标签选择器](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)和
  [有效使用标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)部分。

<!--
- Use `kubectl create deployment` and `kubectl expose` to quickly create single-container
  Deployments and Services.
  See [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
  for an example.
-->
- 使用 `kubectl create deployment` 和 `kubectl expose` 来快速创建单容器 Deployment 和 Service。
  有关示例，请参阅[使用服务访问集群中的应用程序](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)。
