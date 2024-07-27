---
title: 名字空间
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
---
<!--
reviewers:
- derekwaynecarr
- mikedanese
- thockin
title: Namespaces
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
-->

<!-- overview -->

<!--
In Kubernetes, _namespaces_ provide a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced {{< glossary_tooltip text="objects" term_id="object" >}} _(e.g. Deployments, Services, etc)_ and not for cluster-wide objects _(e.g. StorageClass, Nodes, PersistentVolumes, etc.)_.
-->
在 Kubernetes 中，**名字空间（Namespace）** 提供一种机制，将同一集群中的资源划分为相互隔离的组。
同一名字空间内的资源名称要唯一，但跨名字空间时没有这个要求。
名字空间作用域仅针对带有名字空间的{{< glossary_tooltip text="对象" term_id="object" >}}，
（例如 Deployment、Service 等），这种作用域对集群范围的对象
（例如 StorageClass、Node、PersistentVolume 等）不适用。

<!-- body -->

<!--
## When to Use Multiple Namespaces
-->
## 何时使用多个名字空间    {#when-to-use-multiple-namespaces}

<!--
Namespaces are intended for use in environments with many users spread across multiple
teams, or projects.  For clusters with a few to tens of users, you should not
need to create or think about namespaces at all.  Start using namespaces when you
need the features they provide.
-->
名字空间适用于存在很多跨多个团队或项目的用户的场景。对于只有几到几十个用户的集群，根本不需要创建或考虑名字空间。当需要名字空间提供的功能时，请开始使用它们。

<!--
Namespaces provide a scope for names.  Names of resources need to be unique within a namespace,
but not across namespaces. Namespaces cannot be nested inside one another and each Kubernetes
resource can only be in one namespace.
-->
名字空间为名称提供了一个范围。资源的名称需要在名字空间内是唯一的，但不能跨名字空间。
名字空间不能相互嵌套，每个 Kubernetes 资源只能在一个名字空间中。

<!--
Namespaces are a way to divide cluster resources between multiple users (via [resource quota](/docs/concepts/policy/resource-quotas/)).
-->
名字空间是在多个用户之间划分集群资源的一种方法（通过[资源配额](/zh-cn/docs/concepts/policy/resource-quotas/)）。

<!--
It is not necessary to use multiple namespaces to separate slightly different
resources, such as different versions of the same software: use
{{< glossary_tooltip text="labels" term_id="label" >}} to distinguish
resources within the same namespace.
-->
不必使用多个名字空间来分隔仅仅轻微不同的资源，例如同一软件的不同版本：
应该使用{{< glossary_tooltip text="标签" term_id="label" >}}来区分同一名字空间中的不同资源。

{{< note >}}
<!--
For a production cluster, consider _not_ using the `default` namespace. Instead, make other namespaces and use those.
-->
对于生产集群，请考虑**不要**使用 `default` 名字空间，而是创建其他名字空间来使用。
{{< /note >}}

<!--
## Initial namespaces
-->
## 初始名字空间   {#initial-namespaces}

<!--
Kubernetes starts with four initial namespaces:

`default`
: Kubernetes includes this namespace so that you can start using your new cluster without first creating a namespace.

`kube-node-lease`
: This namespace holds [Lease](/docs/concepts/architecture/leases/) objects associated with each node. Node leases allow the kubelet to send [heartbeats](/docs/concepts/architecture/nodes/#node-heartbeats) so that the control plane can detect node failure.

`kube-public`
: This namespace is readable by *all* clients (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement.

`kube-system`
: The namespace for objects created by the Kubernetes system.
-->
Kubernetes 启动时会创建四个初始名字空间：

`default`
: Kubernetes 包含这个名字空间，以便于你无需创建新的名字空间即可开始使用新集群。

`kube-node-lease`
: 该名字空间包含用于与各个节点关联的 [Lease（租约）](/zh-cn/docs/concepts/architecture/leases/)对象。
  节点租约允许 kubelet 发送[心跳](/zh-cn/docs/concepts/architecture/nodes/#node-heartbeats)，
  由此控制面能够检测到节点故障。

`kube-public`
: **所有**的客户端（包括未经身份验证的客户端）都可以读取该名字空间。
  该名字空间主要预留为集群使用，以便某些资源需要在整个集群中可见可读。
  该名字空间的公共属性只是一种约定而非要求。

`kube-system`
: 该名字空间用于 Kubernetes 系统创建的对象。

<!--
## Working with Namespaces

Creation and deletion of namespaces are described in the
[Admin Guide documentation for namespaces](/docs/tasks/administer-cluster/namespaces).
-->
## 使用名字空间    {#working-with-namespaces}

名字空间的创建和删除在[名字空间的管理指南文档](/zh-cn/docs/tasks/administer-cluster/namespaces/)描述。

{{< note >}}
<!--
Avoid creating namespaces with the prefix `kube-`, since it is reserved for Kubernetes system namespaces.
-->
避免使用前缀 `kube-` 创建名字空间，因为它是为 Kubernetes 系统名字空间保留的。
{{< /note >}}

<!--
### Viewing namespaces

You can list the current namespaces in a cluster using:
-->
### 查看名字空间    {#viewing-namespaces}

你可以使用以下命令列出集群中现存的名字空间：

```shell
kubectl get namespace
```
```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

<!--
### Setting the namespace for a request

To set the namespace for a current request, use the `--namespace` flag.

For example:
-->
### 为请求设置名字空间    {#setting-the-namespace-for-a-request}

要为当前请求设置名字空间，请使用 `--namespace` 参数。

例如：

```shell
kubectl run nginx --image=nginx --namespace=<名字空间名称>
kubectl get pods --namespace=<名字空间名称>
```

<!--
### Setting the namespace preference

You can permanently save the namespace for all subsequent kubectl commands in that
context.
-->
### 设置名字空间偏好    {#setting-the-namespace-preference}

你可以永久保存名字空间，以用于对应上下文中所有后续 kubectl 命令。

```shell
kubectl config set-context --current --namespace=<名字空间名称>
# 验证
kubectl config view --minify | grep namespace:
```

<!--
## Namespaces and DNS

When you create a [Service](/docs/concepts/services-networking/service/),
it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
-->
## 名字空间和 DNS   {#namespaces-and-dns}

当你创建一个[服务](/zh-cn/docs/concepts/services-networking/service/)时，
Kubernetes 会创建一个相应的 [DNS 条目](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!--
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container only uses `<service-name>`, it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
该条目的形式是 `<服务名称>.<名字空间名称>.svc.cluster.local`，这意味着如果容器只使用
`<服务名称>`，它将被解析到本地名字空间的服务。这对于跨多个名字空间（如开发、测试和生产）
使用相同的配置非常有用。如果你希望跨名字空间访问，则需要使用完全限定域名（FQDN）。

<!--
As a result, all namespace names must be valid
[RFC 1123 DNS labels](/docs/concepts/overview/working-with-objects/names/#dns-label-names).
-->
因此，所有的名字空间名称都必须是合法的
[RFC 1123 DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-label-names)。

{{< warning >}}
<!--
By creating namespaces with the same name as [public top-level
domains](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), Services in these
namespaces can have short DNS names that overlap with public DNS records.
Workloads from any namespace performing a DNS lookup without a [trailing dot](https://datatracker.ietf.org/doc/html/rfc1034#page-8) will
be redirected to those services, taking precedence over public DNS.
-->
通过创建与[公共顶级域名](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)同名的名字空间，
这些名字空间中的服务可以拥有与公共 DNS 记录重叠的、较短的 DNS 名称。
所有名字空间中的负载在执行 DNS 查找时，
如果查找的名称没有[尾部句点](https://datatracker.ietf.org/doc/html/rfc1034#page-8)，
就会被重定向到这些服务上，因此呈现出比公共 DNS 更高的优先序。

<!--
To mitigate this, limit privileges for creating namespaces to trusted users. If
required, you could additionally configure third-party security controls, such
as [admission
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/),
to block creating any namespace with the name of [public
TLDs](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
-->
为了缓解这类问题，需要将创建名字空间的权限授予可信的用户。
如果需要，你可以额外部署第三方的安全控制机制，
例如以[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
的形式，阻止用户创建与公共 [TLD](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)
同名的名字空间。
{{< /warning >}}

<!--
## Not all objects are in a namespace
-->
## 并非所有对象都在名字空间中    {#not-all-objects-are-in-a-namespace}

<!--
Most Kubernetes resources (e.g. pods, services, replication controllers, and others) are
in some namespaces.  However namespace resources are not themselves in a namespace.
And low-level resources, such as
[nodes](/docs/concepts/architecture/nodes/) and
[persistentVolumes](/docs/concepts/storage/persistent-volumes/), are not in any namespace.
-->
大多数 kubernetes 资源（例如 Pod、Service、副本控制器等）都位于某些名字空间中。
但是名字空间资源本身并不在名字空间中。而且底层资源，
例如[节点](/zh-cn/docs/concepts/architecture/nodes/)和[持久化卷](/zh-cn/docs/concepts/storage/persistent-volumes/)不属于任何名字空间。

<!--
To see which Kubernetes resources are and aren't in a namespace:
-->
查看哪些 Kubernetes 资源在名字空间中，哪些不在名字空间中：

```shell
# 位于名字空间中的资源
kubectl api-resources --namespaced=true

# 不在名字空间中的资源
kubectl api-resources --namespaced=false
```

<!--
## Automatic labelling
-->
## 自动打标签   {#automatic-labelling}

{{< feature-state for_k8s_version="1.22" state="stable" >}}

<!--
The Kubernetes control plane sets an immutable {{< glossary_tooltip text="label" term_id="label" >}}
`kubernetes.io/metadata.name` on all namespaces.
The value of the label is the namespace name.
-->
Kubernetes 控制面会为所有名字空间设置一个不可变更的{{< glossary_tooltip text="标签" term_id="label" >}}
`kubernetes.io/metadata.name`。
标签的值是名字空间的名称。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [creating a new namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Learn more about [deleting a namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
-->
* 进一步了解[建立新的名字空间](/zh-cn/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)。
* 进一步了解[删除名字空间](/zh-cn/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace)。
