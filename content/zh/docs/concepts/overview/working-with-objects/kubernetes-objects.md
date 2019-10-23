---
title: 理解 Kubernetes 对象

redirect_from:
- "/docs/concepts/abstractions/overview/"
- "/docs/concepts/abstractions/overview.html"
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

本页说明了 Kubernetes 对象在 Kubernetes API 中是如何表示的，以及如何在 `.yaml` 格式的文件中表示。
{{% /capture %}}

{{% capture body %}}




## 理解 Kubernetes 对象

在 Kubernetes 系统中，*Kubernetes 对象* 是持久化的实体。Kubernetes 使用这些实体去表示整个集群的状态。特别地，它们描述了如下信息：

* 哪些容器化应用在运行（以及在哪个 Node 上）
* 可以被应用使用的资源
* 关于应用运行时表现的策略，比如重启策略、升级策略，以及容错策略



Kubernetes 对象是 “目标性记录” —— 一旦创建对象，Kubernetes 系统将持续工作以确保对象存在。通过创建对象，本质上是在告知 Kubernetes 系统，所需要的集群工作负载看起来是什么样子的，这就是 Kubernetes 集群的 **期望状态（Desired State）**。

操作 Kubernetes 对象 —— 无论是创建、修改，或者删除 —— 需要使用 [Kubernetes API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。比如，当使用 `kubectl` 命令行接口时，CLI 会执行必要的 Kubernetes API 调用，也可以在程序中直接调用 Kubernetes API。为了实现该目标，Kubernetes 当前提供了一个 `golang` [客户端库](https://github.com/kubernetes/client-go)
，其它语言库（例如[Python](https://github.com/kubernetes-incubator/client-python)）也正在开发中。



### 对象规约（Spec）与状态（Status）

每个 Kubernetes 对象包含两个嵌套的对象字段，它们负责管理对象的配置：对象 *spec* 和 对象 *status* 。
*spec* 是必需的，它描述了对象的 *期望状态（Desired State）* —— 希望对象所具有的特征。
*status* 描述了对象的 *实际状态（Actual State）* ，它是由 Kubernetes 系统提供和更新的。在任何时刻，Kubernetes 控制面一直努力地管理着对象的实际状态以与期望状态相匹配。



例如，Kubernetes Deployment 对象能够表示运行在集群中的应用。
当创建 Deployment 时，可能需要设置 Deployment 的规约，以指定该应用需要有 3 个副本在运行。
Kubernetes 系统读取 Deployment 规约，并启动我们所期望的该应用的 3 个实例 —— 更新状态以与规约相匹配。
如果那些实例中有失败的（一种状态变更），Kubernetes 系统通过修正来响应规约和状态之间的不一致 —— 这种情况，会启动一个新的实例来替换。

关于对象 spec、status 和 metadata 的更多信息，查看 [Kubernetes API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。



### 描述 Kubernetes 对象

当创建 Kubernetes 对象时，必须提供对象的规约，用来描述该对象的期望状态，以及关于对象的一些基本信息（例如名称）。
当使用 Kubernetes API 创建对象时（或者直接创建，或者基于`kubectl`），API 请求必须在请求体中包含 JSON 格式的信息。
**大多数情况下，需要在 .yaml 文件中为 `kubectl` 提供这些信息**。
`kubectl` 在发起 API 请求时，将这些信息转换成 JSON 格式。

这里有一个 `.yaml` 示例文件，展示了 Kubernetes Deployment 的必需字段和对象规约：

{{< code file="nginx-deployment.yaml" >}}

使用类似于上面的 `.yaml` 文件来创建 Deployment，一种方式是使用 `kubectl` 命令行接口（CLI）中的 [`kubectl create`](/docs/user-guide/kubectl/v1.7/#create) 命令，将 `.yaml` 文件作为参数。下面是一个示例：

```shell
$ kubectl create -f docs/user-guide/nginx-deployment.yaml --record
```


输出类似如下这样：

```shell
deployment "nginx-deployment" created
```



### 必需字段

在想要创建的 Kubernetes 对象对应的 `.yaml` 文件中，需要配置如下的字段：

* `apiVersion` - 创建该对象所使用的 Kubernetes API 的版本
* `kind` - 想要创建的对象的类型
* `metadata` - 帮助识别对象唯一性的数据，包括一个 `name` 字符串、UID 和可选的 `namespace`



也需要提供对象的 `spec` 字段。对象 `spec` 的精确格式对每个 Kubernetes 对象来说是不同的，包含了特定于该对象的嵌套字段。[Kubernetes API 参考](/docs/api/)能够帮助我们找到任何我们想创建的对象的 spec 格式。

{{% /capture %}}

{{% capture whatsnext %}}

* 了解最重要的基本 Kubernetes 对象，例如 [Pod](/docs/concepts/abstractions/pod/)。
{{% /capture %}}
