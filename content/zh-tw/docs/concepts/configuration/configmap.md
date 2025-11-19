---
title: ConfigMap
api_metadata:
- apiVersion: "v1"
  kind: "ConfigMap"
content_type: concept
weight: 20
---
<!--
title: ConfigMaps
api_metadata:
- apiVersion: "v1"
  kind: "ConfigMap"
content_type: concept
weight: 20
-->

<!-- overview -->

{{< glossary_definition term_id="configmap" length="all" >}}

{{< caution >}}
<!--
ConfigMap does not provide secrecy or encryption.
If the data you want to store are confidential, use a
{{< glossary_tooltip text="Secret" term_id="secret" >}} rather than a ConfigMap,
or use additional (third party) tools to keep your data private.
-->
ConfigMap 並不提供保密或者加密功能。
如果你想存儲的數據是機密的，請使用 {{< glossary_tooltip text="Secret" term_id="secret" >}}，
或者使用其他第三方工具來保證你的數據的私密性，而不是用 ConfigMap。
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
## 動機   {#motivation}

使用 ConfigMap 來將你的設定數據和應用程序代碼分開。

比如，假設你正在開發一個應用，它可以在你自己的電腦上（用於開發）和在雲上
（用於實際流量）運行。
你的代碼裏有一段是用於查看環境變量 `DATABASE_HOST`，在本地運行時，
你將這個變量設置爲 `localhost`，在雲上，你將其設置爲引用 Kubernetes 叢集中的
公開數據庫組件的 {{< glossary_tooltip text="服務" term_id="service" >}}。

這讓你可以獲取在雲中運行的容器映像檔，並且如果有需要的話，在本地調試完全相同的代碼。

{{< note >}}
<!--
A ConfigMap is not designed to hold large chunks of data. The data stored in a
ConfigMap cannot exceed 1 MiB. If you need to store settings that are
larger than this limit, you may want to consider mounting a volume or use a
separate database or file service.
-->
ConfigMap 在設計上不是用來保存大量數據的。在 ConfigMap 中保存的數據不可超過
1 MiB。如果你需要保存超出此尺寸限制的數據，你可能希望考慮掛載存儲卷
或者使用獨立的數據庫或者文件服務。
{{< /note >}}
<!--
## ConfigMap object

A ConfigMap is an {{< glossary_tooltip text="API object" term_id="object" >}}
that lets you store configuration for other objects to use. Unlike most
Kubernetes objects that have a `spec`, a ConfigMap has `data` and `binaryData`
fields. These fields accept key-value pairs as their values.  Both the `data`
field and the `binaryData` are optional. The `data` field is designed to
contain UTF-8 strings while the `binaryData` field is designed to
contain binary data as base64-encoded strings.

The name of a ConfigMap must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## ConfigMap 對象

ConfigMap 是一個讓你可以存儲其他對象所需要使用的設定的 {{< glossary_tooltip text="API 對象" term_id="object" >}}。
和其他 Kubernetes 對象都有一個 `spec` 不同的是，ConfigMap 使用 `data` 和
`binaryData` 字段。這些字段能夠接收鍵-值對作爲其取值。`data` 和 `binaryData`
字段都是可選的。`data` 字段設計用來保存 UTF-8 字符串，而 `binaryData`
則被設計用來保存二進制數據作爲 base64 編碼的字串。

ConfigMap 的名字必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Each key under the `data` or the `binaryData` field must consist of
alphanumeric characters, `-`, `_` or `.`. The keys stored in `data` must not
overlap with the keys in the `binaryData` field.

Starting from v1.19, you can add an `immutable` field to a ConfigMap
definition to create an [immutable ConfigMap](#configmap-immutable).
-->
`data` 或 `binaryData` 字段下面的每個鍵的名稱都必須由字母數字字符或者
`-`、`_` 或 `.` 組成。在 `data` 下保存的鍵名不可以與在 `binaryData`
下出現的鍵名有重疊。

從 v1.19 開始，你可以添加一個 `immutable` 字段到 ConfigMap 定義中，
創建[不可變更的 ConfigMap](#configmap-immutable)。

<!--
## ConfigMaps and Pods

You can write a Pod `spec` that refers to a ConfigMap and configures the container(s)
in that Pod based on the data in the ConfigMap. The Pod and the ConfigMap must be in
the same {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
-->
## ConfigMap 和 Pod   {#configmaps-and-pods}

你可以寫一個引用 ConfigMap 的 Pod 的 `spec`，並根據 ConfigMap 中的數據在該
Pod 中設定容器。這個 Pod 和 ConfigMap 必須要在同一個
{{< glossary_tooltip text="名字空間" term_id="namespace" >}} 中。

{{< note >}}
<!--
The `spec` of a {{< glossary_tooltip text="static Pod" term_id="static-pod" >}} cannot refer to a ConfigMap
or any other API objects.
-->
{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 中的 `spec`
字段不能引用 ConfigMap 或任何其他 API 對象。
{{< /note >}}

<!--
Here's an example ConfigMap that has some keys with single values,
and other keys where the value looks like a fragment of a configuration
format.
-->
這是一個 ConfigMap 的示例，它的一些鍵只有一個值，其他鍵的值看起來像是
設定的片段格式。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # 類屬性鍵；每一個鍵都映射到一個簡單的值
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # 類文件鍵
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
你可以使用四種方式來使用 ConfigMap 設定 Pod 中的容器：

1. 在容器命令和參數內
1. 容器的環境變量
1. 在只讀卷裏面添加一個文件，讓應用來讀取
1. 編寫代碼在 Pod 中運行，使用 Kubernetes API 來讀取 ConfigMap

這些不同的方法適用於不同的數據使用方式。
對前三個方法，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用 ConfigMap 中的數據在 Pod 中啓動容器。

<!--
The fourth method means you have to write code to read the ConfigMap and its data.
However, because you're using the Kubernetes API directly, your application can
subscribe to get updates whenever the ConfigMap changes, and react
when that happens. By accessing the Kubernetes API directly, this
technique also lets you access a ConfigMap in a different namespace.

Here's an example Pod that uses values from `game-demo` to configure a Pod:
-->
第四種方法意味着你必須編寫代碼才能讀取 ConfigMap 和它的數據。然而，
由於你是直接使用 Kubernetes API，因此只要 ConfigMap 發生更改，
你的應用就能夠通過訂閱來獲取更新，並且在這樣的情況發生的時候做出反應。
通過直接進入 Kubernetes API，這個技術也可以讓你能夠獲取到不同的名字空間裏的 ConfigMap。

下面是一個 Pod 的示例，它通過使用 `game-demo` 中的值來設定一個 Pod：

{{% code_sample file="configmap/configure-pod.yaml" %}}

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
ConfigMap 不會區分單行屬性值和多行類似文件的值，重要的是 Pods
和其他對象如何使用這些值。

上面的例子定義了一個卷並將它作爲 `/config` 文件夾掛載到 `demo` 容器內，
創建兩個文件，`/config/game.properties` 和
`/config/user-interface.properties`，
儘管 ConfigMap 中包含了四個鍵。
這是因爲 Pod 定義中在 `volumes` 節指定了一個 `items` 數組。
如果你完全忽略 `items` 數組，則 ConfigMap 中的每個鍵都會變成一個與該鍵同名的文件，
因此你會得到四個文件。

<!--
## Using ConfigMaps

ConfigMaps can be mounted as data volumes. ConfigMaps can also be used by other
parts of the system, without being directly exposed to the Pod. For example,
ConfigMaps can hold data that other parts of the system should use for configuration.
-->
## 使用 ConfigMap   {#using-configmaps}

ConfigMap 可以作爲數據卷掛載。ConfigMap 也可被系統的其他組件使用，
而不一定直接暴露給 Pod。例如，ConfigMap 可以保存系統中其他組件要使用的設定數據。

<!--
The most common way to use ConfigMaps is to configure settings for
containers running in a Pod in the same namespace. You can also use a
ConfigMap separately.

For example, you
might encounter {{< glossary_tooltip text="addons" term_id="addons" >}}
or {{< glossary_tooltip text="operators" term_id="operator-pattern" >}} that
adjust their behavior based on a ConfigMap.
-->
ConfigMap 最常見的用法是爲同一命名空間裏某 Pod 中運行的容器執行設定。
你也可以單獨使用 ConfigMap。

比如，你可能會遇到基於 ConfigMap 來調整其行爲的
{{< glossary_tooltip text="插件" term_id="addons" >}} 或者
{{< glossary_tooltip text="operator" term_id="operator-pattern" >}}。

<!--
### Using ConfigMaps as files from a Pod

To consume a ConfigMap in a volume in a Pod:
-->
### 在 Pod 中將 ConfigMap 當做文件使用

要在一個 Pod 的存儲卷中使用 ConfigMap:

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
1. 創建一個 ConfigMap 對象或者使用現有的 ConfigMap 對象。多個 Pod 可以引用同一個
   ConfigMap。
1. 修改 Pod 定義，在 `spec.volumes[]` 下添加一個卷。
   爲該卷設置任意名稱，之後將 `spec.volumes[].configMap.name` 字段設置爲對你的
   ConfigMap 對象的引用。
1. 爲每個需要該 ConfigMap 的容器添加一個 `.spec.containers[].volumeMounts[]`。
   設置 `.spec.containers[].volumeMounts[].readOnly=true` 並將
   `.spec.containers[].volumeMounts[].mountPath` 設置爲一個未使用的目錄名，
   ConfigMap 的內容將出現在該目錄中。
1. 更改你的映像檔或者命令列，以便程序能夠從該目錄中查找文件。ConfigMap 中的每個
   `data` 鍵會變成 `mountPath` 下面的一個文件名。

<!--
This is an example of a Pod that mounts a ConfigMap in a volume:
-->
下面是一個將 ConfigMap 以卷的形式進行掛載的 Pod 示例：

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
你希望使用的每個 ConfigMap 都需要在 `spec.volumes` 中被引用到。

如果 Pod 中有多個容器，則每個容器都需要自己的 `volumeMounts` 塊，但針對每個
ConfigMap，你只需要設置一個 `spec.volumes` 塊。

<!--
#### Mounted ConfigMaps are updated automatically

When a ConfigMap currently consumed in a volume is updated, projected keys are eventually updated as well.
The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync.
However, the kubelet uses its local cache for getting the current value of the ConfigMap.
The type of the cache is configurable using the `configMapAndSecretChangeDetectionStrategy` field in
the [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
#### 被掛載的 ConfigMap 內容會被自動更新

當卷中使用的 ConfigMap 被更新時，所投射的鍵最終也會被更新。
kubelet 組件會在每次週期性同步時檢查所掛載的 ConfigMap 是否爲最新。
不過，kubelet 使用的是其本地的高速緩存來獲得 ConfigMap 的當前值。
高速緩存的類型可以通過
[KubeletConfiguration 結構](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/).
的 `configMapAndSecretChangeDetectionStrategy` 字段來設定。

<!--
A ConfigMap can be either propagated by watch (default), ttl-based, or by redirecting
all requests directly to the API server.
As a result, the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(it equals to watch propagation delay, ttl of cache, or zero correspondingly).
-->
ConfigMap 既可以通過 watch 操作實現內容傳播（默認形式），也可實現基於 TTL
的緩存，還可以直接經過所有請求重定向到 API 伺服器。
因此，從 ConfigMap 被更新的那一刻算起，到新的主鍵被投射到 Pod 中去，
這一時間跨度可能與 kubelet 的同步週期加上高速緩存的傳播延遲相等。
這裏的傳播延遲取決於所選的高速緩存類型
（分別對應 watch 操作的傳播延遲、高速緩存的 TTL 時長或者 0）。

<!--
ConfigMaps consumed as environment variables are not updated automatically and require a pod restart.
-->
以環境變量方式使用的 ConfigMap 數據不會被自動更新。
更新這些數據需要重新啓動 Pod。

{{< note >}}
<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes#using-subpath) volume mount will not receive ConfigMap updates.
-->
使用 ConfigMap 作爲 [subPath](/zh-cn/docs/concepts/storage/volumes#using-subpath)
卷掛載的容器將不會收到 ConfigMap 的更新。
{{< /note >}}

<!--
### Using Configmaps as environment variables

To use a Configmap in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a Pod:
-->
### 使用 Configmap 作爲環境變量  {#using-configmaps-as-environment-variables}

使用 Configmap 在 Pod 中設置{{< glossary_tooltip text="環境變量" term_id="container-env-variables" >}}：

<!--
1. For each container in your Pod specification, add an environment variable
   for each Configmap key that you want to use to the
   `env[].valueFrom.configMapKeyRef` field.
1. Modify your image and/or command line so that the program looks for values
   in the specified environment variables.
-->
1. 對於 Pod 規約中的每個容器，爲要使用的每個 ConfigMap 鍵添加一個環境變量到
   `env[].valueFrom.configMapKeyRef` 字段。
2. 修改你的映像檔和/或命令列，以便程序查找指定環境變量中的值。

<!--
This is an example of defining a ConfigMap as a pod environment variable:

The following ConfigMap (myconfigmap.yaml) stores two properties: username and access_level:
-->
下面是一個將 ConfigMap 定義爲 Pod 環境變量的示例：

以下 ConfigMap (myconfigmap.yaml) 存儲兩個屬性：username 和 access_level：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myconfigmap
data:
  username: k8s-admin
  access_level: "1"
```

<!--
The following command will create the ConfigMap object:
-->
以下命令將創建 ConfigMap 對象：

```shell
kubectl apply -f myconfigmap.yaml
```

<!--
The following Pod consumes the content of the ConfigMap as environment variables:
-->
以下 Pod 將 ConfigMap 的內容用作環境變量：

{{% code_sample file="configmap/env-configmap.yaml" %}}

<!--
The `envFrom` field instructs Kubernetes to create environment variables from the sources nested within it.
The inner `configMapRef` refers to a ConfigMap by its name and selects all its key-value pairs.
Add the Pod to your cluster, then retrieve its logs to see the output from the printenv command.
This should confirm that the two key-value pairs from the ConfigMap have been set as environment variables:
-->
`envFrom` 字段指示 Kubernetes 使用其中嵌套的源創建環境變量。
內部的 `configMapRef` 通過 ConfigMap 的名稱引用之，並選擇其所有鍵值對。
將 Pod 添加到你的叢集中，然後檢索其日誌以查看 printenv 命令的輸出。
此操作可確認來自 ConfigMap 的兩個鍵值對已被設置爲環境變量：

```shell
kubectl apply -f env-configmap.yaml
```

```shell
kubectl logs pod/ env-configmap
```

<!--
The output is similar to this:
-->
輸出類似於：

```console
...
username: "k8s-admin"
access_level: "1"
...
```

<!--
Sometimes a Pod won't require access to all the values in a ConfigMap.
For example, you could have another Pod which only uses the username value from the ConfigMap.
For this use case, you can use the `env.valueFrom` syntax instead, which lets you select individual keys in
a ConfigMap. The name of the environment variable can also be different from the key within the ConfigMap.
For example:
-->
有時 Pod 不需要訪問 ConfigMap 中的所有值。
例如，你可以有另一個 Pod 只使用 ConfigMap 中的 username 值。
在這種使用場景中，你可以轉爲使用 `env.valueFrom` 語法，這樣可以讓你選擇 ConfigMap 中的單個鍵。
環境變量的名稱也可以不同於 ConfigMap 中的鍵。例如：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
  - name: envars-test-container
    image: nginx
    env:
    - name: CONFIGMAP_USERNAME
      valueFrom:
        configMapKeyRef:
          name: myconfigmap
          key: username
```

<!--
In the Pod created from this manifest, you will see that the environment variable
`CONFIGMAP_USERNAME` is set to the value of the `username` value from the ConfigMap.
Other keys from the ConfigMap data are not copied into the environment.
-->
在從此清單創建的 Pod 中，你將看到環境變量 `CONFIGMAP_USERNAME` 被設置爲 ConfigMap 中 `username` 的取值。
來自 ConfigMap 數據中的其他鍵不會被複制到環境中。

<!--
It's important to note that the range of characters allowed for environment
variable names in pods is [restricted](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config).
If any keys do not meet the rules, those keys are not made available to your container, though
the Pod is allowed to start.
-->
需要注意的是，Pod 中環境變量名稱允許的字符範圍是[有限的](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config)。
如果某些變量名稱不滿足這些規則，則即使 Pod 可以被啓動，你的容器也無法訪問這些環境變量。

<!--
## Immutable ConfigMaps {#configmap-immutable}
-->
## 不可變更的 ConfigMap     {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
The Kubernetes feature _Immutable Secrets and ConfigMaps_ provides an option to set
individual Secrets and ConfigMaps as immutable. For clusters that extensively use ConfigMaps
(at least tens of thousands of unique ConfigMap to Pod mounts), preventing changes to their
data has the following advantages:
-->
Kubernetes 特性 **Immutable Secret 和 ConfigMap** 提供了一種將各個
Secret 和 ConfigMap 設置爲不可變更的選項。對於大量使用 ConfigMap 的叢集
（至少有數萬個各不相同的 ConfigMap 給 Pod 掛載）而言，禁止更改
ConfigMap 的數據有以下好處：

<!--
- protects you from accidental (or unwanted) updates that could cause applications outages
- improves performance of your cluster by significantly reducing load on kube-apiserver, by
  closing watches for ConfigMaps marked as immutable.
-->
- 保護應用，使之免受意外（不想要的）更新所帶來的負面影響。
- 通過大幅降低對 kube-apiserver 的壓力提升叢集性能，
  這是因爲系統會關閉對已標記爲不可變更的 ConfigMap 的監視操作。

<!--
You can create an immutable ConfigMap by setting the `immutable` field to `true`.
For example:
-->
你可以通過將 `immutable` 字段設置爲 `true` 創建不可變更的 ConfigMap。
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
一旦某 ConfigMap 被標記爲不可變更，則 **無法** 逆轉這一變化，也無法更改
`data` 或 `binaryData` 字段的內容。你只能刪除並重建 ConfigMap。
因爲現有的 Pod 會維護一個已被刪除的 ConfigMap 的掛載點，建議重新創建這些 Pods。

## {{% heading "whatsnext" %}}

<!--
* Read about [Secrets](/docs/concepts/configuration/secret/).
* Read [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Read about [changing a ConfigMap (or any other Kubernetes object)](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
* Read [The Twelve-Factor App](https://12factor.net/) to understand the motivation for
  separating code from configuration.
-->
* 閱讀 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
* 閱讀[設定 Pod 使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。
* 閱讀[修改 ConfigMap（或任何其他 Kubernetes 對象）](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)。
* 閱讀 [Twelve-Factor 應用](https://12factor.net/zh_cn/)來了解將代碼和設定分開的動機。
