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
ConfigMap 並不提供保密或者加密功能。
如果你想儲存的資料是機密的，請使用 {{< glossary_tooltip text="Secret" term_id="secret" >}}，
或者使用其他第三方工具來保證你的資料的私密性，而不是用 ConfigMap。
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

使用 ConfigMap 來將你的配置資料和應用程式程式碼分開。

比如，假設你正在開發一個應用，它可以在你自己的電腦上（用於開發）和在雲上
（用於實際流量）執行。
你的程式碼裡有一段是用於檢視環境變數 `DATABASE_HOST`，在本地執行時，
你將這個變數設定為 `localhost`，在雲上，你將其設定為引用 Kubernetes 叢集中的
公開資料庫元件的 {{< glossary_tooltip text="服務" term_id="service" >}}。

這讓你可以獲取在雲中執行的容器映象，並且如果有需要的話，在本地除錯完全相同的程式碼。

<!--
A ConfigMap is not designed to hold large chunks of data. The data stored in a
ConfigMap cannot exceed 1 MiB. If you need to store settings that are
larger than this limit, you may want to consider mounting a volume or use a
separate database or file service.
-->
ConfigMap 在設計上不是用來儲存大量資料的。在 ConfigMap 中儲存的資料不可超過
1 MiB。如果你需要儲存超出此尺寸限制的資料，你可能希望考慮掛載儲存卷
或者使用獨立的資料庫或者檔案服務。

<!--
## ConfigMap object

A ConfigMap is an API [object](/docs/concepts/overview/working-with-objects/kubernetes-objects/)
that lets you store configuration for other objects to use. Unlike most
Kubernetes objects that have a `spec`, a ConfigMap has `data` and `binaryData`
fields. These fields accept key-value pairs as their values.  Both the `data`
field and the `binaryData` are optional. The `data` field is designed to
contain UTF-8 strings while the `binaryData` field is designed to
contain binary data as base64-encoded strings.

The name of a ConfigMap must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## ConfigMap 物件

ConfigMap 是一個 API [物件](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/)，
讓你可以儲存其他物件所需要使用的配置。
和其他 Kubernetes 物件都有一個 `spec` 不同的是，ConfigMap 使用 `data` 和
`binaryData` 欄位。這些欄位能夠接收鍵-值對作為其取值。`data` 和 `binaryData`
欄位都是可選的。`data` 欄位設計用來儲存 UTF-8 字串，而 `binaryData`
則被設計用來儲存二進位制資料作為 base64 編碼的字串。

ConfigMap 的名字必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
Each key under the `data` or the `binaryData` field must consist of
alphanumeric characters, `-`, `_` or `.`. The keys stored in `data` must not
overlap with the keys in the `binaryData` field.

Starting from v1.19, you can add an `immutable` field to a ConfigMap
definition to create an [immutable ConfigMap](#configmap-immutable).
-->
`data` 或 `binaryData` 欄位下面的每個鍵的名稱都必須由字母數字字元或者
`-`、`_` 或 `.` 組成。在 `data` 下儲存的鍵名不可以與在 `binaryData`
下出現的鍵名有重疊。

從 v1.19 開始，你可以新增一個 `immutable` 欄位到 ConfigMap 定義中，
建立[不可變更的 ConfigMap](#configmap-immutable)。

<!--
## ConfigMaps and Pods

You can write a Pod `spec` that refers to a ConfigMap and configures the container(s)
in that Pod based on the data in the ConfigMap. The Pod and the ConfigMap must be in
the same {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
-->
## ConfigMaps 和 Pods

你可以寫一個引用 ConfigMap 的 Pod 的 `spec`，並根據 ConfigMap 中的資料在該
Pod 中配置容器。這個 Pod 和 ConfigMap 必須要在同一個
{{< glossary_tooltip text="名字空間" term_id="namespace" >}} 中。

<!--
The `spec` of a {{< glossary_tooltip text="static Pod" term_id="static-pod" >}} cannot refer to a ConfigMap
or any other API objects.
-->
{{< note >}}
{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 中的 `spec`
欄位不能引用 ConfigMap 或任何其他 API 物件。
{{< /note >}}

<!--
Here's an example ConfigMap that has some keys with single values,
and other keys where the value looks like a fragment of a configuration
format.
-->
這是一個 ConfigMap 的示例，它的一些鍵只有一個值，其他鍵的值看起來像是
配置的片段格式。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # 類屬性鍵；每一個鍵都對映到一個簡單的值
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # 類檔案鍵
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
你可以使用四種方式來使用 ConfigMap 配置 Pod 中的容器：

1. 在容器命令和引數內
1. 容器的環境變數
1. 在只讀卷裡面新增一個檔案，讓應用來讀取
1. 編寫程式碼在 Pod 中執行，使用 Kubernetes API 來讀取 ConfigMap

這些不同的方法適用於不同的資料使用方式。
對前三個方法，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用 ConfigMap 中的資料在 Pod 中啟動容器。

<!--
The fourth method means you have to write code to read the ConfigMap and its data.
However, because you're using the Kubernetes API directly, your application can
subscribe to get updates whenever the ConfigMap changes, and react
when that happens. By accessing the Kubernetes API directly, this
technique also lets you access a ConfigMap in a different namespace.

Here's an example Pod that uses values from `game-demo` to configure a Pod:
-->
第四種方法意味著你必須編寫程式碼才能讀取 ConfigMap 和它的資料。然而，
由於你是直接使用 Kubernetes API，因此只要 ConfigMap 發生更改，
你的應用就能夠透過訂閱來獲取更新，並且在這樣的情況發生的時候做出反應。
透過直接進入 Kubernetes API，這個技術也可以讓你能夠獲取到不同的名字空間裡的 ConfigMap。

下面是一個 Pod 的示例，它透過使用 `game-demo` 中的值來配置一個 Pod：

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
        # 定義環境變數
        - name: PLAYER_INITIAL_LIVES # 請注意這裡和 ConfigMap 中的鍵名是不一樣的
          valueFrom:
            configMapKeyRef:
              name: game-demo           # 這個值來自 ConfigMap
              key: player_initial_lives # 需要取值的鍵
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
    # 你可以在 Pod 級別設定卷，然後將其掛載到 Pod 內的容器中
    - name: config
      configMap:
        # 提供你想要掛載的 ConfigMap 的名字
        name: game-demo
        # 來自 ConfigMap 的一組鍵，將被建立為檔案
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
ConfigMap 不會區分單行屬性值和多行類似檔案的值，重要的是 Pods
和其他物件如何使用這些值。

上面的例子定義了一個卷並將它作為 `/config` 資料夾掛載到 `demo` 容器內，
建立兩個檔案，`/config/game.properties` 和
`/config/user-interface.properties`，
儘管 ConfigMap 中包含了四個鍵。
這是因為 Pod 定義中在 `volumes` 節指定了一個 `items` 陣列。
如果你完全忽略 `items` 陣列，則 ConfigMap 中的每個鍵都會變成一個與該鍵同名的檔案，
因此你會得到四個檔案。

<!--
## Using ConfigMaps

ConfigMaps can be mounted as data volumes. ConfigMaps can also be used by other
parts of the system, without being directly exposed to the Pod. For example,
ConfigMaps can hold data that other parts of the system should use for configuration.
-->
## 使用 ConfigMap   {#using-configmaps}

ConfigMap 可以作為資料卷掛載。ConfigMap 也可被系統的其他元件使用，
而不一定直接暴露給 Pod。例如，ConfigMap 可以儲存系統中其他元件要使用的配置資料。

<!--
The most common way to use ConfigMaps is to configure settings for
containers running in a Pod in the same namespace. You can also use a
ConfigMap separately.

For example, you
might encounter {{< glossary_tooltip text="addons" term_id="addons" >}}
or {{< glossary_tooltip text="operators" term_id="operator-pattern" >}} that
adjust their behavior based on a ConfigMap.
-->
ConfigMap 最常見的用法是為同一命名空間裡某 Pod 中執行的容器執行配置。
你也可以單獨使用 ConfigMap。

比如，你可能會遇到基於 ConfigMap 來調整其行為的
{{< glossary_tooltip text="外掛" term_id="addons" >}} 或者
{{< glossary_tooltip text="operator" term_id="operator-pattern" >}}。

<!--
### Using ConfigMaps as files from a Pod

To consume a ConfigMap in a volume in a Pod:
-->
### 在 Pod 中將 ConfigMap 當做檔案使用

要在一個 Pod 的儲存卷中使用 ConfigMap:

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
1. 建立一個 ConfigMap 物件或者使用現有的 ConfigMap 物件。多個 Pod 可以引用同一個
   ConfigMap。
1. 修改 Pod 定義，在 `spec.volumes[]` 下新增一個卷。
   為該卷設定任意名稱，之後將 `spec.volumes[].configMap.name` 欄位設定為對你的
   ConfigMap 物件的引用。
1. 為每個需要該 ConfigMap 的容器新增一個 `.spec.containers[].volumeMounts[]`。
   設定 `.spec.containers[].volumeMounts[].readOnly=true` 並將
   `.spec.containers[].volumeMounts[].mountPath` 設定為一個未使用的目錄名，
   ConfigMap 的內容將出現在該目錄中。
1. 更改你的映象或者命令列，以便程式能夠從該目錄中查詢檔案。ConfigMap 中的每個
   `data` 鍵會變成 `mountPath` 下面的一個檔名。

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
ConfigMap，你只需要設定一個 `spec.volumes` 塊。

<!--
#### Mounted ConfigMaps are updated automatically

When a ConfigMap currently consumed in a volume is updated, projected keys are eventually updated as well.
The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync.
However, the kubelet uses its local cache for getting the current value of the ConfigMap.
The type of the cache is configurable using the `ConfigMapAndSecretChangeDetectionStrategy` field in
the [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
#### 被掛載的 ConfigMap 內容會被自動更新

當卷中使用的 ConfigMap 被更新時，所投射的鍵最終也會被更新。
kubelet 元件會在每次週期性同步時檢查所掛載的 ConfigMap 是否為最新。
不過，kubelet 使用的是其本地的快取記憶體來獲得 ConfigMap 的當前值。
快取記憶體的型別可以透過
[KubeletConfiguration 結構](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/).
的 `ConfigMapAndSecretChangeDetectionStrategy` 欄位來配置。

<!--
A ConfigMap can be either propagated by watch (default), ttl-based, or by redirecting
all requests directly to the API server.
As a result, the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(it equals to watch propagation delay, ttl of cache, or zero correspondingly).
-->
ConfigMap 既可以透過 watch 操作實現內容傳播（預設形式），也可實現基於 TTL
的快取，還可以直接經過所有請求重定向到 API 伺服器。
因此，從 ConfigMap 被更新的那一刻算起，到新的主鍵被投射到 Pod 中去，
這一時間跨度可能與 kubelet 的同步週期加上快取記憶體的傳播延遲相等。
這裡的傳播延遲取決於所選的快取記憶體型別
（分別對應 watch 操作的傳播延遲、快取記憶體的 TTL 時長或者 0）。

<!--
ConfigMaps consumed as environment variables are not updated automatically and require a pod restart.
-->
以環境變數方式使用的 ConfigMap 資料不會被自動更新。
更新這些資料需要重新啟動 Pod。

<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes#using-subpath) volume mount will not receive ConfigMap updates.
-->
{{< note >}}
使用 ConfigMap 作為 [subPath](/zh-cn/docs/concepts/storage/volumes#using-subpath) 卷掛載的容器將不會收到 ConfigMap 的更新。
{{< /note >}}

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
Kubernetes 特性 _Immutable Secret 和 ConfigMaps_ 提供了一種將各個
Secret 和 ConfigMap 設定為不可變更的選項。對於大量使用 ConfigMap 的叢集
（至少有數萬個各不相同的 ConfigMap 給 Pod 掛載）而言，禁止更改
ConfigMap 的資料有以下好處：

<!--
- protects you from accidental (or unwanted) updates that could cause applications outages
- improves performance of your cluster by significantly reducing load on kube-apiserver, by
  closing watches for ConfigMaps marked as immutable.
-->
- 保護應用，使之免受意外（不想要的）更新所帶來的負面影響。
- 透過大幅降低對 kube-apiserver 的壓力提升叢集效能，
  這是因為系統會關閉對已標記為不可變更的 ConfigMap 的監視操作。

<!--
This feature is controlled by the `ImmutableEphemeralVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
You can create an immutable ConfigMap by setting the `immutable` field to `true`.
For example:
-->
此功能特性由 `ImmutableEphemeralVolumes`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來控制。
你可以透過將 `immutable` 欄位設定為 `true` 建立不可變更的 ConfigMap。
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
一旦某 ConfigMap 被標記為不可變更，則 _無法_ 逆轉這一變化，，也無法更改
`data` 或 `binaryData` 欄位的內容。你只能刪除並重建 ConfigMap。
因為現有的 Pod 會維護一個已被刪除的 ConfigMap 的掛載點，建議重新建立這些 Pods。

## {{% heading "whatsnext" %}}

<!--
* Read about [Secrets](/docs/concepts/configuration/secret/).
* Read [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Read about [changing a ConfigMap (or any other Kubernetes object)](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
* Read [The Twelve-Factor App](https://12factor.net/) to understand the motivation for
  separating code from configuration.
-->
* 閱讀 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
* 閱讀[配置 Pod 使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。
* 閱讀[修改 ConfigMap（或任何其他 Kubernetes 物件）](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)。
* 閱讀 [Twelve-Factor 應用](https://12factor.net/zh_cn/)來了解將程式碼和配置分開的動機。
