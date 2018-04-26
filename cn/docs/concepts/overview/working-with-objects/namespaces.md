---
assignees:
- derekwaynecarr
- mikedanese
- thockin
title: Namespaces
redirect_from:
- "/docs/user-guide/namespaces/"
- "/docs/user-guide/namespaces.html"
---
<!--
Kubernetes supports multiple virtual clusters backed by the same physical cluster.
These virtual clusters are called namespaces.
-->
Kubernetes 依托于同一个物理集群提供多个虚拟集群.
这些虚拟集群被叫做命名空间.

<!--
## When to Use Multiple Namespaces

Namespaces are intended for use in environments with many users spread across multiple
teams, or projects.  For clusters with a few to tens of users, you should not
need to create or think about namespaces at all.  Start using namespaces when you
need the features they provide.

Namespaces provide a scope for names.  Names of resources need to be unique within a namespace, but not across namespaces.

Namespaces are a way to divide cluster resources between multiple uses (via [resource quota](/docs/concepts/policy/resource-quotas/)).

In future versions of Kubernetes, objects in the same namespace will have the same
access control policies by default.

It is not necessary to use multiple namespaces just to separate slightly different
resources, such as different versions of the same software: use [labels](/docs/user-guide/labels) to distinguish
resources within the same namespace.

-->

## 什么时候使用多个命名空间

命名空间被打算用于有很多用户的环境,这些用户遍布于多个团队或者项目.
对于有着一些或者几十的用户的集群,你应该完全不需要去创建或者考虑到命名空间.
当你需要他们提供的功能的时候开始去使用命名空间.

命名空间提供了命名的作用域. 资源的命名需要在此命名空间是唯一的,但是跨命名空间则不受影响.

命名空间是一种方法去区分开多个用途之间的集群资源 (通过 [资源配额](/docs/concepts/policy/resource-quotas/)).

在Kubernetes未来的版本中,同一个命名空间的对象将默认拥有相同的访问控制策略.

没有必要使用多个命名空间仅仅是为了分开有着些许不同的资源,例如同一个软件的不同版本: 可以使用 [labels](/docs/user-guide/labels) 去区分
同一个命名空间之内的资源.


<!--
## Working with Namespaces

Creation and deletion of namespaces is described in the [Admin Guide documentation
for namespaces](/docs/admin/namespaces)
-->

## 工作中使用命名空间

命名空间的创建和删除被描述在[命名空间管理指南文档](/docs/admin/namespaces) 

<!--
### Viewing namespaces

You can list the current namespaces in a cluster using:
-->
### 查看命名空间
你能够列出在一个集群中当前使用的命名空间:

```shell
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
```
<!--
Kubernetes starts with two initial namespaces:

   * `default` The default namespace for objects with no other namespace
   * `kube-system` The namespace for objects created by the Kubernetes system
-->
Kubernetes 开始自带两个初始的命名空间:
   * `default` 对于没有指定其他命名空间的对象使用default命名空间
   * `kube-system` 这个命名空间给由kubernetes系统创建的对象使用

<!--
### Setting the namespace for a request

To temporarily set the namespace for a request, use the `--namespace` flag.

For example:
-->
### 为一个请求设置命名空间

为了临时对一个请求设置命名空间,可以使用 `--namespace` 标签.
举个例子:

```shell
$ kubectl --namespace=<insert-namespace-name-here> run nginx --image=nginx
$ kubectl --namespace=<insert-namespace-name-here> get pods
```
<!--
### Setting the namespace preference

You can permanently save the namespace for all subsequent kubectl commands in that
context.
-->
### 设置命名空间的偏好

你能够永久地保存命名空间对上下文中所有随后的kubectl命令结果

```shell
$ kubectl config set-context $(kubectl config current-context) --namespace=<insert-namespace-name-here>
# Validate it 
$ kubectl config view | grep namespace:
```
<!--
## Namespaces and DNS

When you create a [Service](/docs/user-guide/services), it creates a corresponding [DNS entry](/docs/admin/dns).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
## 命名空间和域名系统

当你创建一个[Service](/docs/user-guide/services),服务会创建一个对应的[域名系统入口](/docs/admin/dns).
这个入口是这样一个形式 `<service-name>.<namespace-name>.svc.cluster.local`,这就意味着如果一个容器
仅仅使用 `<service-name>`,它将去解析这个服务基于本地所在的命名空间.这是对那些使用相同配置跨越多个命名空间,例如开发，预演,生产 来讲非常有用.
如果你想达到跨越多个命名空间,你需要去使用完全合格域名(FQDN).

<!--
## Not All Objects are in a Namespace

Most Kubernetes resources (e.g. pods, services, replication controllers, and others) are
in some namespace.  However namespace resources are not themselves in a namespace.
And low-level resources, such as [nodes](/docs/admin/node) and
persistentVolumes, are not in any namespace. Events are an exception: they may or may not
have a namespace, depending on the object the event is about.
-->
## 不是所有的对象在同一个命名空间里

大部分的Kubernetes资源 (例如 pods, services, replication controllers, and others)是存在某一个命名空间里.
然而在一个命名空间里 命名空间的资源并不是它们自己.低级别的资源,例如 [nodes](/docs/admin/node)和持久卷并不在任何命名空间.
事件是一个例外:它们可能有也可能没有一个命名空间,这个是依据这个对象的事件是关于什么的.
