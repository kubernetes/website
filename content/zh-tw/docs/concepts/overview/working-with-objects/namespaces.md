---
title: 名字空間
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
在 Kubernetes 中，**名字空間（Namespace）** 提供一種機制，將同一叢集中的資源劃分爲相互隔離的組。
同一名字空間內的資源名稱要唯一，但跨名字空間時沒有這個要求。
名字空間作用域僅針對帶有名字空間的{{< glossary_tooltip text="對象" term_id="object" >}}，
（例如 Deployment、Service 等），這種作用域對叢集範圍的對象
（例如 StorageClass、Node、PersistentVolume 等）不適用。

<!-- body -->

<!--
## When to Use Multiple Namespaces
-->
## 何時使用多個名字空間    {#when-to-use-multiple-namespaces}

<!--
Namespaces are intended for use in environments with many users spread across multiple
teams, or projects.  For clusters with a few to tens of users, you should not
need to create or think about namespaces at all.  Start using namespaces when you
need the features they provide.
-->
名字空間適用於存在很多跨多個團隊或項目的使用者的場景。對於只有幾到幾十個使用者的叢集，根本不需要創建或考慮名字空間。當需要名字空間提供的功能時，請開始使用它們。

<!--
Namespaces provide a scope for names.  Names of resources need to be unique within a namespace,
but not across namespaces. Namespaces cannot be nested inside one another and each Kubernetes
resource can only be in one namespace.
-->
名字空間爲名稱提供了一個範圍。資源的名稱需要在名字空間內是唯一的，但不能跨名字空間。
名字空間不能相互嵌套，每個 Kubernetes 資源只能在一個名字空間中。

<!--
Namespaces are a way to divide cluster resources between multiple users (via [resource quota](/docs/concepts/policy/resource-quotas/)).
-->
名字空間是在多個使用者之間劃分叢集資源的一種方法（通過[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)）。

<!--
It is not necessary to use multiple namespaces to separate slightly different
resources, such as different versions of the same software: use
{{< glossary_tooltip text="labels" term_id="label" >}} to distinguish
resources within the same namespace.
-->
不必使用多個名字空間來分隔僅僅輕微不同的資源，例如同一軟體的不同版本：
應該使用{{< glossary_tooltip text="標籤" term_id="label" >}}來區分同一名字空間中的不同資源。

{{< note >}}
<!--
For a production cluster, consider _not_ using the `default` namespace. Instead, make other namespaces and use those.
-->
對於生產叢集，請考慮**不要**使用 `default` 名字空間，而是創建其他名字空間來使用。
{{< /note >}}

<!--
## Initial namespaces
-->
## 初始名字空間   {#initial-namespaces}

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
Kubernetes 啓動時會創建四個初始名字空間：

`default`
: Kubernetes 包含這個名字空間，以便於你無需創建新的名字空間即可開始使用新叢集。

`kube-node-lease`
: 該名字空間包含用於與各個節點關聯的 [Lease（租約）](/zh-cn/docs/concepts/architecture/leases/)對象。
  節點租約允許 kubelet 發送[心跳](/zh-cn/docs/concepts/architecture/nodes/#node-heartbeats)，
  由此控制面能夠檢測到節點故障。

`kube-public`
: **所有**的客戶端（包括未經身份驗證的客戶端）都可以讀取該名字空間。
  該名字空間主要預留爲叢集使用，以便某些資源需要在整個叢集中可見可讀。
  該名字空間的公共屬性只是一種約定而非要求。

`kube-system`
: 該名字空間用於 Kubernetes 系統創建的對象。

<!--
## Working with Namespaces

Creation and deletion of namespaces are described in the
[Admin Guide documentation for namespaces](/docs/tasks/administer-cluster/namespaces).
-->
## 使用名字空間    {#working-with-namespaces}

名字空間的創建和刪除在[名字空間的管理指南文檔](/zh-cn/docs/tasks/administer-cluster/namespaces/)描述。

{{< note >}}
<!--
Avoid creating namespaces with the prefix `kube-`, since it is reserved for Kubernetes system namespaces.
-->
避免使用前綴 `kube-` 創建名字空間，因爲它是爲 Kubernetes 系統名字空間保留的。
{{< /note >}}

<!--
### Viewing namespaces

You can list the current namespaces in a cluster using:
-->
### 查看名字空間    {#viewing-namespaces}

你可以使用以下命令列出叢集中現存的名字空間：

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
### 爲請求設置名字空間    {#setting-the-namespace-for-a-request}

要爲當前請求設置名字空間，請使用 `--namespace` 參數。

例如：

```shell
kubectl run nginx --image=nginx --namespace=<名字空間名稱>
kubectl get pods --namespace=<名字空間名稱>
```

<!--
### Setting the namespace preference

You can permanently save the namespace for all subsequent kubectl commands in that
context.
-->
### 設置名字空間偏好    {#setting-the-namespace-preference}

你可以永久保存名字空間，以用於對應上下文中所有後續 kubectl 命令。

```shell
kubectl config set-context --current --namespace=<名字空間名稱>
# 驗證
kubectl config view --minify | grep namespace:
```

<!--
## Namespaces and DNS

When you create a [Service](/docs/concepts/services-networking/service/),
it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
-->
## 名字空間和 DNS   {#namespaces-and-dns}

當你創建一個[服務](/zh-cn/docs/concepts/services-networking/service/)時，
Kubernetes 會創建一個相應的 [DNS 條目](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!--
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container only uses `<service-name>`, it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
該條目的形式是 `<服務名稱>.<名字空間名稱>.svc.cluster.local`，這意味着如果容器只使用
`<服務名稱>`，它將被解析到本地名字空間的服務。這對於跨多個名字空間（如開發、測試和生產）
使用相同的設定非常有用。如果你希望跨名字空間訪問，則需要使用完全限定域名（FQDN）。

<!--
As a result, all namespace names must be valid
[RFC 1123 DNS labels](/docs/concepts/overview/working-with-objects/names/#dns-label-names).
-->
因此，所有的名字空間名稱都必須是合法的
[RFC 1123 DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-label-names)。

{{< warning >}}
<!--
By creating namespaces with the same name as [public top-level
domains](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), Services in these
namespaces can have short DNS names that overlap with public DNS records.
Workloads from any namespace performing a DNS lookup without a [trailing dot](https://datatracker.ietf.org/doc/html/rfc1034#page-8) will
be redirected to those services, taking precedence over public DNS.
-->
通過創建與[公共頂級域名](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)同名的名字空間，
這些名字空間中的服務可以擁有與公共 DNS 記錄重疊的、較短的 DNS 名稱。
所有名字空間中的負載在執行 DNS 查找時，
如果查找的名稱沒有[尾部句點](https://datatracker.ietf.org/doc/html/rfc1034#page-8)，
就會被重定向到這些服務上，因此呈現出比公共 DNS 更高的優先序。

<!--
To mitigate this, limit privileges for creating namespaces to trusted users. If
required, you could additionally configure third-party security controls, such
as [admission
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/),
to block creating any namespace with the name of [public
TLDs](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
-->
爲了緩解這類問題，需要將創建名字空間的權限授予可信的使用者。
如果需要，你可以額外部署第三方的安全控制機制，
例如以[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
的形式，阻止使用者創建與公共 [TLD](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)
同名的名字空間。
{{< /warning >}}

<!--
## Not all objects are in a namespace
-->
## 並非所有對象都在名字空間中    {#not-all-objects-are-in-a-namespace}

<!--
Most Kubernetes resources (e.g. pods, services, replication controllers, and others) are
in some namespaces.  However namespace resources are not themselves in a namespace.
And low-level resources, such as
[nodes](/docs/concepts/architecture/nodes/) and
[persistentVolumes](/docs/concepts/storage/persistent-volumes/), are not in any namespace.
-->
大多數 kubernetes 資源（例如 Pod、Service、副本控制器等）都位於某些名字空間中。
但是名字空間資源本身並不在名字空間中。而且底層資源，
例如[節點](/zh-cn/docs/concepts/architecture/nodes/)和[持久化卷](/zh-cn/docs/concepts/storage/persistent-volumes/)不屬於任何名字空間。

<!--
To see which Kubernetes resources are and aren't in a namespace:
-->
查看哪些 Kubernetes 資源在名字空間中，哪些不在名字空間中：

```shell
# 位於名字空間中的資源
kubectl api-resources --namespaced=true

# 不在名字空間中的資源
kubectl api-resources --namespaced=false
```

<!--
## Automatic labelling
-->
## 自動打標籤   {#automatic-labelling}

{{< feature-state for_k8s_version="1.22" state="stable" >}}

<!--
The Kubernetes control plane sets an immutable {{< glossary_tooltip text="label" term_id="label" >}}
`kubernetes.io/metadata.name` on all namespaces.
The value of the label is the namespace name.
-->
Kubernetes 控制面會爲所有名字空間設置一個不可變更的{{< glossary_tooltip text="標籤" term_id="label" >}}
`kubernetes.io/metadata.name`。
標籤的值是名字空間的名稱。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [creating a new namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Learn more about [deleting a namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
-->
* 進一步瞭解[建立新的名字空間](/zh-cn/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)。
* 進一步瞭解[刪除名字空間](/zh-cn/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace)。
