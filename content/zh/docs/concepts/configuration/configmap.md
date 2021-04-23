---
title: ConfigMap
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" length="all" >}}

{{< caution >}}
<!--
ConfigMap does not provide secrecy or encryption.
If the data you want to store are confidential, use a
{{< glossary_tooltip text="Secret" term_id="secret" >}} rather than a ConfigMap,
or use additional (third party) tools to keep your data private.
-->
ConfigMap 并不提供保密或者加密功能。
如果你想存储的数据是机密的，请使用 {{< glossary_tooltip text="Secret" term_id="secret" >}}，
或者使用其他第三方工具来保证你的数据的私密性，而不是用 ConfigMap。
{{< /caution >}}

<!-- body -->
<!--
## Motivation

Use a ConfigMap for setting configuration data separately from application code.

For example, imagine that you are developing an application that you can run on your
own computer (for development) and in the cloud (to handle real traffic).
You write the code to look in an environment variable named `DATABASE_HOST`.
Locally, you set that variable to `localhost`. In the cloud, you set it to
refer to a Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}}
that exposes the database component to your cluster.
This lets you fetch a container image running in the cloud and
debug the exact same code locally if needed.
-->
## 动机   {#motivation}

使用 ConfigMap 来将你的配置数据和应用程序代码分开。

比如，假设你正在开发一个应用，它可以在你自己的电脑上（用于开发）和在云上
（用于实际流量）运行。
你的代码里有一段是用于查看环境变量 `DATABASE_HOST`，在本地运行时，
你将这个变量设置为 `localhost`，在云上，你将其设置为引用 Kubernetes 集群中的
公开数据库组件的 {{< glossary_tooltip text="服务" term_id="service" >}}。

这让你可以获取在云中运行的容器镜像，并且如果有需要的话，在本地调试完全相同的代码。

<!--
A ConfigMap is not designed to hold large chunks of data. The data stored in a
ConfigMap cannot exceed 1 MiB. If you need to store settings that are
larger than this limit, you may want to consider mounting a volume or use a
separate database or file service.
-->
ConfigMap 在设计上不是用来保存大量数据的。在 ConfigMap 中保存的数据不可超过
1 MiB。如果你需要保存超出此尺寸限制的数据，你可能希望考虑挂载存储卷
或者使用独立的数据库或者文件服务。

<!--
## ConfigMap object

A ConfigMap is an API [object](/docs/concepts/overview/working-with-objects/kubernetes-objects/)
that lets you store configuration for other objects to use. Unlike most
Kubernetes objects that have a `spec`, a ConfigMap has `data` and `binaryData`
fields. These fields accept key-value pairs as their values.  Both the `data`
field and the `binaryData` are optional. The `data` field is designed to
contain UTF-8 byte sequences while the `binaryData` field is designed to
contain binary data as base64-encoded strings.

The name of a ConfigMap must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## ConfigMap 对象

ConfigMap 是一个 API [对象](/zh/docs/concepts/overview/working-with-objects/kubernetes-objects/)，
让你可以存储其他对象所需要使用的配置。
和其他 Kubernetes 对象都有一个 `spec` 不同的是，ConfigMap 使用 `data` 和
`binaryData` 字段。这些字段能够接收键-值对作为其取值。`data` 和 `binaryData`
字段都是可选的。`data` 字段设计用来保存 UTF-8 字节序列，而 `binaryData` 则
被设计用来保存二进制数据作为 base64 编码的字串。

ConfigMap 的名字必须是一个合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Each key under the `data` or the `binaryData` field must consist of
alphanumeric characters, `-`, `_` or `.`. The keys stored in `data` must not
overlap with the keys in the `binaryData` field.

Starting from v1.19, you can add an `immutable` field to a ConfigMap
definition to create an [immutable ConfigMap](#configmap-immutable).
-->
`data` 或 `binaryData` 字段下面的每个键的名称都必须由字母数字字符或者
`-`、`_` 或 `.` 组成。在 `data` 下保存的键名不可以与在 `binaryData` 下
出现的键名有重叠。

从 v1.19 开始，你可以添加一个 `immutable` 字段到 ConfigMap 定义中，创建
[不可变更的 ConfigMap](#configmap-immutable)。

<!--
## ConfigMaps and Pods

You can write a Pod `spec` that refers to a ConfigMap and configures the container(s)
in that Pod based on the data in the ConfigMap. The Pod and the ConfigMap must be in
the same {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

Here's an example ConfigMap that has some keys with single values,
and other keys where the value looks like a fragment of a configuration
format.
-->
## ConfigMaps 和 Pods

你可以写一个引用 ConfigMap 的 Pod 的 `spec`，并根据 ConfigMap 中的数据
在该 Pod 中配置容器。这个 Pod 和 ConfigMap 必须要在同一个
{{< glossary_tooltip text="名字空间" term_id="namespace" >}} 中。

这是一个 ConfigMap 的示例，它的一些键只有一个值，其他键的值看起来像是
配置的片段格式。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # 类属性键；每一个键都映射到一个简单的值
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # 类文件键
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```
<!--
There are four different ways that you can use a ConfigMap to configure
a container inside a Pod:

1. Inside a container command and args
1. Environment variables for a container
1. Add a file in read-only volume, for the application to read
1. Write code to run inside the Pod that uses the Kubernetes API to read a ConfigMap

These different methods lend themselves to different ways of modeling
the data being consumed.
For the first three methods, the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} uses the data from
the ConfigMap when it launches container(s) for a Pod.
-->
你可以使用四种方式来使用 ConfigMap 配置 Pod 中的容器：

1. 在容器命令和参数内
1. 容器的环境变量
1. 在只读卷里面添加一个文件，让应用来读取
1. 编写代码在 Pod 中运行，使用 Kubernetes API 来读取 ConfigMap

这些不同的方法适用于不同的数据使用方式。
对前三个方法，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用 ConfigMap 中的数据在 Pod 中启动容器。

<!--
The fourth method means you have to write code to read the ConfigMap and its data.
However, because you're using the Kubernetes API directly, your application can
subscribe to get updates whenever the ConfigMap changes, and react
when that happens. By accessing the Kubernetes API directly, this
technique also lets you access a ConfigMap in a different namespace.

Here's an example Pod that uses values from `game-demo` to configure a Pod:
-->
第四种方法意味着你必须编写代码才能读取 ConfigMap 和它的数据。然而，
由于你是直接使用 Kubernetes API，因此只要 ConfigMap 发生更改，你的
应用就能够通过订阅来获取更新，并且在这样的情况发生的时候做出反应。
通过直接进入 Kubernetes API，这个技术也可以让你能够获取到不同的名字空间
里的 ConfigMap。

下面是一个 Pod 的示例，它通过使用 `game-demo` 中的值来配置一个 Pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # 定义环境变量
        - name: PLAYER_INITIAL_LIVES # 请注意这里和 ConfigMap 中的键名是不一样的
          valueFrom:
            configMapKeyRef:
              name: game-demo           # 这个值来自 ConfigMap
              key: player_initial_lives # 需要取值的键
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # 你可以在 Pod 级别设置卷，然后将其挂载到 Pod 内的容器中
    - name: config
      configMap:
        # 提供你想要挂载的 ConfigMap 的名字
        name: game-demo
        # 来自 ConfigMap 的一组键，将被创建为文件
        items:
        - key: "game.properties"
          path: "game.properties"
        - key: "user-interface.properties"
          path: "user-interface.properties"
```

<!--
A ConfigMap doesn't differentiate between single line property values and
multi-line file-like values.
What matters how Pods and other objects consume those values.

For this example, defining a volume and mounting it inside the `demo`
container as `/config` creates two files,
`/config/game.properties` and `/config/user-interface.properties`,
even though there are four keys in the ConfigMap. This is because the Pod
definition specifies an `items` array in the `volumes` section.
If you omit the `items` array entirely, every key  in the ConfigMap becomes
a file with the same name as the key, and you get 4 files.
-->
ConfigMap 不会区分单行属性值和多行类似文件的值，重要的是 Pods 和其他对象
如何使用这些值。

上面的例子定义了一个卷并将它作为 `/config` 文件夹挂载到 `demo` 容器内，
创建两个文件，`/config/game.properties` 和
`/config/user-interface.properties`，
尽管 ConfigMap 中包含了四个键。
这是因为 Pod 定义中在 `volumes` 节指定了一个 `items` 数组。
如果你完全忽略 `items` 数组，则 ConfigMap 中的每个键都会变成一个与
该键同名的文件，因此你会得到四个文件。

<!--
## Using ConfigMaps

ConfigMaps can be mounted as data volumes. ConfigMaps can also be used by other
parts of the system, without being directly exposed to the Pod. For example,
ConfigMaps can hold data that other parts of the system should use for configuration.
-->
## 使用 ConfigMap   {#using-configmaps}

ConfigMap 可以作为数据卷挂载。ConfigMap 也可被系统的其他组件使用，而
不一定直接暴露给 Pod。例如，ConfigMap 可以保存系统中其他组件要使用
的配置数据。

<!--
The most common way to use ConfigMaps is to configure settings for
containers running in a Pod in the same namespace. You can also use a
ConfigMap separately.

For example, you
might encounter {{< glossary_tooltip text="addons" term_id="addons" >}}
or {{< glossary_tooltip text="operators" term_id="operator-pattern" >}} that
adjust their behavior based on a ConfigMap.
-->
ConfigMap 最常见的用法是为同一命名空间里某 Pod 中运行的容器执行配置。
你也可以单独使用 ConfigMap。

比如，你可能会遇到基于 ConfigMap 来调整其行为的
{{< glossary_tooltip text="插件" term_id="addons" >}} 或者
{{< glossary_tooltip text="operator" term_id="operator-pattern" >}}。

<!--
### Using ConfigMaps as files from a Pod

To consume a ConfigMap in a volume in a Pod:
-->
### 在 Pod 中将 ConfigMap 当做文件使用

<!--
1. Create a ConfigMap or use an existing one. Multiple Pods can reference the
   same ConfigMap.
1. Modify your Pod definition to add a volume under `.spec.volumes[]`. Name
   the volume anything, and have a `.spec.volumes[].configMap.name` field set
   to reference your ConfigMap object.
1. Add a `.spec.containers[].volumeMounts[]` to each container that needs the
   ConfigMap. Specify `.spec.containers[].volumeMounts[].readOnly = true` and
   `.spec.containers[].volumeMounts[].mountPath` to an unused directory name
   where you would like the ConfigMap to appear.
1. Modify your image or command line so that the program looks for files in
   that directory. Each key in the ConfigMap `data` map becomes the filename
   under `mountPath`.
-->
1. 创建一个 ConfigMap 对象或者使用现有的 ConfigMap 对象。多个 Pod 可以引用同一个
   ConfigMap。
1. 修改 Pod 定义，在 `spec.volumes[]` 下添加一个卷。
   为该卷设置任意名称，之后将 `spec.volumes[].configMap.name` 字段设置为对
   你的 ConfigMap 对象的引用。
1. 为每个需要该 ConfigMap 的容器添加一个 `.spec.containers[].volumeMounts[]`。
   设置 `.spec.containers[].volumeMounts[].readOnly=true` 并将
   `.spec.containers[].volumeMounts[].mountPath` 设置为一个未使用的目录名，
   ConfigMap 的内容将出现在该目录中。
1. 更改你的镜像或者命令行，以便程序能够从该目录中查找文件。ConfigMap 中的每个
   `data` 键会变成 `mountPath` 下面的一个文件名。

<!--
This is an example of a Pod that mounts a ConfigMap in a volume:
-->
下面是一个将 ConfigMap 以卷的形式进行挂载的 Pod 示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configMap:
      name: myconfigmap
```

<!--
Each ConfigMap you want to use needs to be referred to in `.spec.volumes`.

If there are multiple containers in the Pod, then each container needs its
own `volumeMounts` block, but only one `.spec.volumes` is needed per ConfigMap.
-->
你希望使用的每个 ConfigMap 都需要在 `spec.volumes` 中被引用到。

如果 Pod 中有多个容器，则每个容器都需要自己的 `volumeMounts` 块，但针对
每个 ConfigMap，你只需要设置一个 `spec.volumes` 块。

<!--
#### Mounted ConfigMaps are updated automatically

When a ConfigMap currently consumed in a volume is updated, projected keys are eventually updated as well.
The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync.
However, the kubelet uses its local cache for getting the current value of the ConfigMap.
The type of the cache is configurable using the `ConfigMapAndSecretChangeDetectionStrategy` field in
the [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
#### 被挂载的 ConfigMap 内容会被自动更新

当卷中使用的 ConfigMap 被更新时，所投射的键最终也会被更新。
kubelet 组件会在每次周期性同步时检查所挂载的 ConfigMap 是否为最新。
不过，kubelet 使用的是其本地的高速缓存来获得 ConfigMap 的当前值。
高速缓存的类型可以通过
[KubeletConfiguration 结构](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)
的 `ConfigMapAndSecretChangeDetectionStrategy` 字段来配置。

<!--
A ConfigMap can be either propagated by watch (default), ttl-based, or by redirecting
all requests directly to the API server.
As a result, the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(it equals to watch propagation delay, ttl of cache, or zero correspondingly).
-->
ConfigMap 既可以通过 watch 操作实现内容传播（默认形式），也可实现基于 TTL
的缓存，还可以直接经过所有请求重定向到 API 服务器。
因此，从 ConfigMap 被更新的那一刻算起，到新的主键被投射到 Pod 中去，这一
时间跨度可能与 kubelet 的同步周期加上高速缓存的传播延迟相等。
这里的传播延迟取决于所选的高速缓存类型
（分别对应 watch 操作的传播延迟、高速缓存的 TTL 时长或者 0）。

<!--
ConfigMaps consumed as environment variables are not updated automatically and require a pod restart. 
-->
以环境变量方式使用的 ConfigMap 数据不会被自动更新。
更新这些数据需要重新启动 Pod。

<!--
## Immutable ConfigMaps {#configmap-immutable}
-->
## 不可变更的 ConfigMap     {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
The Kubernetes feature _Immutable Secrets and ConfigMaps_ provides an option to set
individual Secrets and ConfigMaps as immutable. For clusters that extensively use ConfigMaps
(at least tens of thousands of unique ConfigMap to Pod mounts), preventing changes to their
data has the following advantages:
-->
Kubernetes 特性 _不可变更的 Secret 和 ConfigMap_ 提供了一种将各个
Secret 和 ConfigMap 设置为不可变更的选项。对于大量使用 ConfigMap 的
集群（至少有数万个各不相同的 ConfigMap 给 Pod 挂载）而言，禁止更改
ConfigMap 的数据有以下好处：

<!--
- protects you from accidental (or unwanted) updates that could cause applications outages
- improves performance of your cluster by significantly reducing load on kube-apiserver, by
  closing watches for ConfigMaps marked as immutable.
-->
- 保护应用，使之免受意外（不想要的）更新所带来的负面影响。
- 通过大幅降低对 kube-apiserver 的压力提升集群性能，这是因为系统会关闭
  对已标记为不可变更的 ConfigMap 的监视操作。

<!--
This feature is controlled by the `ImmutableEphemeralVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
You can create an immutable ConfigMap by setting the `immutable` field to `true`.
For example:
-->
此功能特性由 `ImmutableEphemeralVolumes`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
来控制。你可以通过将 `immutable` 字段设置为 `true` 创建不可变更的 ConfigMap。
例如：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

<!--
Once a ConfigMap is marked as immutable, it is _not_ possible to revert this change
nor to mutate the contents of the `data` or the `binaryData` field. You can
only delete and recreate the ConfigMap. Because existing Pods maintain a mount point
to the deleted ConfigMap, it is recommended to recreate these pods.
-->
一旦某 ConfigMap 被标记为不可变更，则 _无法_ 逆转这一变化，，也无法更改
`data` 或 `binaryData` 字段的内容。你只能删除并重建 ConfigMap。
因为现有的 Pod 会维护一个对已删除的 ConfigMap 的挂载点，建议重新创建
这些 Pods。

## {{% heading "whatsnext" %}}

<!--
* Read about [Secrets](/docs/concepts/configuration/secret/).
* Read [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Read [The Twelve-Factor App](https://12factor.net/) to understand the motivation for
  separating code from configuration.
-->
* 阅读 [Secret](/zh/docs/concepts/configuration/secret/)。
* 阅读 [配置 Pod 来使用 ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)。
* 阅读 [Twelve-Factor 应用](https://12factor.net/) 来了解将代码和配置分开的动机。

