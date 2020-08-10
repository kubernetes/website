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
ConfigMap 并不提供保密或者加密功能。如果你想存储的数据是机密的，请使用 {{< glossary_tooltip text="Secret" term_id="secret" >}} ，或者使用其他第三方工具来保证你的数据的私密性，而不是用 ConfigMap。
{{< /caution >}}


<!-- body -->
<!--
## Motivation

Use a ConfigMap for setting configuration data separately from application code.

For example, imagine that you are developing an application that you can run on your
own computer (for development) and in the cloud (to handle real traffic).
You write the code to
look in an environment variable named `DATABASE_HOST`. Locally, you set that variable
to `localhost`. In the cloud, you set it to refer to a Kubernetes
{{< glossary_tooltip text="Service" term_id="service" >}} that exposes the database
component to your cluster.

This lets you fetch a container image running in the cloud and
debug the exact same code locally if needed.
-->

## 动机

使用 ConfigMap 来将你的配置数据和应用程序代码分开。

比如，假设你正在开发一个应用，它可以在你自己的电脑上（用于开发）和在云上（用于实际流量）运行。你的代码里有一段是用于查看环境变量 `DATABASE_HOST`，在本地运行时，你将这个变量设置为 `localhost`，在云上，你将其设置为引用 Kubernetes 集群中的公开数据库 {{< glossary_tooltip text="Service" term_id="service" >}} 中的组件。

这让您可以获取在云中运行的容器镜像，并且如果有需要的话，在本地调试完全相同的代码。

<!--
## ConfigMap object

A ConfigMap is an API [object](/docs/concepts/overview/working-with-objects/kubernetes-objects/)
that lets you store configuration for other objects to use. Unlike most
Kubernetes objects that have a `spec`, a ConfigMap has a `data` section to
store items (keys) and their values.

The name of a ConfigMap must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## ConfigMap 对象

ConfigMap 是一个 API [对象](/zh/docs/concepts/overview/working-with-objects/kubernetes-objects/)，
让你可以存储其他对象所需要使用的配置。
和其他 Kubernetes 对象都有一个 `spec` 不同的是，ConfigMap 使用 `data` 块来存储元素（键名）和它们的值。

ConfigMap 的名字必须是一个合法的 [DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

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

您可以写一个引用 ConfigMap 的 Pod 的 `spec`，并根据 ConfigMap 中的数据在该 Pod 中配置容器。这个 Pod 和 ConfigMap 必须要在同一个 {{< glossary_tooltip text="命名空间" term_id="namespace" >}} 中。

这是一个 ConfigMap 的示例，它的一些键只有一个值，其他键的值看起来像是配置的片段格式。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # 类属性键；每一个键都映射到一个简单的值
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
  #
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

1. Command line arguments to the entrypoint of a container
1. Environment variables for a container
1. Add a file in read-only volume, for the application to read
1. Write code to run inside the Pod that uses the Kubernetes API to read a ConfigMap

These different methods lend themselves to different ways of modeling
the data being consumed.
For the first three methods, the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} uses the data from
the ConfigMap when it launches container(s) for a Pod.
-->
您可以使用四种方式来使用 ConfigMap 配置 Pod 中的容器：

1. 容器 entrypoint 的命令行参数
1. 容器的环境变量
1. 在只读卷里面添加一个文件，让应用来读取
1. 编写代码在 Pod 中运行，使用 Kubernetes API 来读取 ConfigMap

这些不同的方法适用于不同的数据使用方式。对前三个方法，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 使用 ConfigMap 中的数据在 Pod 中启动容器。

<!--
The fourth method means you have to write code to read the ConfigMap and its data.
However, because you're using the Kubernetes API directly, your application can
subscribe to get updates whenever the ConfigMap changes, and react
when that happens. By accessing the Kubernetes API directly, this
technique also lets you access a ConfigMap in a different namespace.

Here's an example Pod that uses values from `game-demo` to configure a Pod:
-->
第四种方法意味着你必须编写代码才能读取 ConfigMap 和它的数据。然而，由于您是直接使用 Kubernetes API，因此只要 ConfigMap 发生更改，您的应用就能够通过订阅来获取更新，并且在这样的情况发生的时候做出反应。通过直接进入 Kubernetes API，这个技术也可以让你能够获取到不同的命名空间里的 ConfigMap。

这是一个 Pod 的示例，它通过使用 `game-demo` 中的值来配置一个 Pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: game.example/demo-game
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
    # 您可以在 Pod 级别设置卷，然后将其挂载到 Pod 内的容器中
    - name: config
      configMap:
        # 提供你想要挂载的 ConfigMap 的名字
        name: game-demo
```

<!--
A ConfigMap doesn't differentiate between single line property values and
multi-line file-like values.
What matters how Pods and other objects consume those values.
For this example, defining a volume and mounting it inside the `demo`
container as `/config` creates four files:

- `/config/player_initial_lives`
- `/config/ui_properties_file_name`
- `/config/game.properties`
- `/config/user-interface.properties`

If you want to make sure that `/config` only contains files with a
`.properties` extension, use two different ConfigMaps, and refer to both
ConfigMaps in the `spec` for a Pod. The first ConfigMap defines
`player_initial_lives` and `ui_properties_file_name`. The second
ConfigMap defines the files that the kubelet places into `/config`.
-->
ConfigMap 不会区分单行属性值和多行类似文件的值，重要的是 Pods 和其他对象如何使用这些值。比如，定义一个卷，并将它作为 `/config` 文件夹安装到 `demo` 容器内，并创建四个文件：

- `/config/player_initial_lives`
- `/config/ui_properties_file_name`
- `/config/game.properties`
- `/config/user-interface.properties`

如果您要确保 `/config` 只包含带有 `.properties` 扩展名的文件，可以使用两个不同的 ConfigMaps，并在 `spec` 中同时引用这两个 ConfigMaps 来创建 Pod。第一个 ConfigMap 定义了 `player_initial_lives` 和 `ui_properties_file_name`，第二个 ConfigMap 定义了 kubelet 放进 `/config` 的文件。

{{< note >}}
<!--
The most common way to use ConfigMaps is to configure settings for
containers running in a Pod in the same namespace. You can also use a
ConfigMap separately.

For example, you
might encounter {{< glossary_tooltip text="addons" term_id="addons" >}}
or {{< glossary_tooltip text="operators" term_id="operator-pattern" >}} that
adjust their behavior based on a ConfigMap.
-->
ConfigMap 最常见的用法是为同一命名空间里某 Pod 中运行的容器执行配置。您也可以单独使用 ConfigMap。

比如，您可能会遇到基于 ConfigMap 来调整其行为的 {{< glossary_tooltip text="插件" term_id="addons" >}} 或者 {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}。
{{< /note >}}



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


