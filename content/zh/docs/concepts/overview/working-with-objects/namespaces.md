---
title: 命名空间
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Kubernetes 支持多个虚拟集群，它们底层依赖于同一个物理集群。
这些虚拟集群被称为命名空间。
<!--
Kubernetes supports multiple virtual clusters backed by the same physical cluster.
These virtual clusters are called namespaces.
-->

{{% /capture %}}


{{% capture body %}}

## 何时使用多个命名空间
<!--
## When to Use Multiple Namespaces
-->

命名空间适用于存在很多跨多个团队或项目的用户的场景。
对于只有几到几十个用户的集群，根本不需要创建或考虑命名空间。当您需要命名空间提供的特性时，请开始使用它们。
<!--
Namespaces are intended for use in environments with many users spread across multiple
teams, or projects.  For clusters with a few to tens of users, you should not
need to create or think about namespaces at all.  Start using namespaces when you
need the features they provide.
-->

命名空间为名称提供了一个范围。
资源的名称需要在命名空间内是惟一的，但不能跨命名空间。命名空间不能嵌套在另外一个命名空间内，而且每个 Kubernetes 
资源只能属于一个命名空间。

<!--
Namespaces provide a scope for names.  Names of resources need to be unique within a namespace,
but not across namespaces. Namespaces can not be nested inside one another and each Kubernetes 
resource can only be in one namespace.
-->

命名空间是在多个用户之间划分集群资源的一种方法（通过[资源配额](/docs/concepts/policy/resource-quotas/)）。
<!--
Namespaces are a way to divide cluster resources between multiple users (via [resource quota](/docs/concepts/policy/resource-quotas/)).
-->

在 Kubernetes 未来版本中，相同命名空间中的对象默认将具有相同的访问控制策略。
<!--
In future versions of Kubernetes, objects in the same namespace will have the same
access control policies by default.
-->

不需要使用多个命名空间来分隔轻微不同的资源，例如同一软件的不同版本：
使用[标签](/docs/user-guide/labels)来区分同一命名空间中的不同资源。
<!--
It is not necessary to use multiple namespaces just to separate slightly different
resources, such as different versions of the same software: use [labels](/docs/user-guide/labels) to distinguish
resources within the same namespace.
-->

## 使用命名空间
<!--
## Working with Namespaces
-->

命名空间的创建和删除已在[命名空间的管理指南文档](/docs/admin/namespaces)中进行了描述。
<!--
Creation and deletion of namespaces are described in the [Admin Guide documentation
for namespaces](/docs/admin/namespaces).
-->

### 查看命名空间
<!--
### Viewing namespaces
-->

您可以使用以下命令列出集群中现存的命名空间：
<!--
You can list the current namespaces in a cluster using:
-->

```shell
kubectl get namespace
```
```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```

Kubernetes 会创建三个初始命名空间：
<!--
Kubernetes starts with three initial namespaces:

   * `default` The default namespace for objects with no other namespace
   * `kube-system` The namespace for objects created by the Kubernetes system
   * `kube-public` This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement.
-->
   
   * `default` 没有指明使用其它命名空间的对象所使用的默认命名空间
   * `kube-system` Kubernetes 系统创建对象所使用的命名空间
   * `kube-public` 这个命名空间是自动创建的，所有用户（包括未经过身份验证的用户）都可以读取它。这个命名空间主要用于集群使用，以防某些资源在整个集群中应该是可见和可读的。这个命名空间的公共方面只是一种约定，而不是要求。

### 为请求设置命名空间
<!--
### Setting the namespace for a request
-->

要为当前的请求设定一个命名空间，请使用 `--namespace` 参数。
<!--
To set the namespace for a current request, use the `--namespace` flag.
-->

例如：
<!--
For example:
-->

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### 设置命名空间首选项
<!--
### Setting the namespace preference
-->

您可以永久保存该上下文中所有后续 kubectl 命令使用的命名空间。
<!--
You can permanently save the namespace for all subsequent kubectl commands in that
context.
-->

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view | grep namespace:
```

## 命名空间和 DNS
<!--
## Namespaces and DNS
-->

当您创建一个[服务](/docs/user-guide/services)时，Kubernetes 会创建一个相应的[DNS 条目](/docs/concepts/services-networking/dns-pod-service/)。
<!--
When you create a [Service](/docs/user-guide/services), it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
-->

该条目的形式是 `<service-name>.<namespace-name>.svc.cluster.local`，
这意味着如果容器只使用 `<service-name>`，它将被解析到本地命名空间的服务。
这对于跨多个命名空间（如开发、分级和生产）使用相同的配置非常有用。
如果您希望跨命名空间访问，则需要使用完全限定域名（FQDN）。
<!--
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>`, it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->

## 并非所有对象都在命名空间中
<!--
## Not All Objects are in a Namespace
-->

大多数 kubernetes 资源（例如 Pod、服务、副本控制器等）都位于某些命名空间中。
但是命名空间资源本身并不在命名空间中。
<!--
Most Kubernetes resources (e.g. pods, services, replication controllers, and others) are
in some namespaces.  However namespace resources are not themselves in a namespace.
-->

而且底层资源，例如[节点](/docs/admin/node)和持久化卷不属于任何命名空间。
<!--
And low-level resources, such as [nodes](/docs/admin/node) and
persistentVolumes, are not in any namespace.
-->

查看哪些 Kubernetes 资源在命名空间中，哪些不在命名空间中：
<!--
To see which Kubernetes resources are and aren't in a namespace:
-->

```shell
# In a namespace
kubectl api-resources --namespaced=true

# Not in a namespace
kubectl api-resources --namespaced=false
```

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* Learn more about [creating a new namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* Learn more about [deleting a namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
-->

* 了解相关内容 [创建一个新的命名空间](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* 了解相关内容 [删除一个命名空间](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
{{% /capture %}}

