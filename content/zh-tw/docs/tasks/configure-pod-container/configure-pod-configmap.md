---
title: 配置 Pod 使用 ConfigMap
content_type: task
weight: 150
card:
  name: tasks
  weight: 50
---
<!--
title: Configure a Pod to Use a ConfigMap
content_type: task
weight: 150
card:
  name: tasks
  weight: 50
-->

<!-- overview -->
<!--
Many applications rely on configuration which is used during either application initialization or runtime.
Most of the times there is a requirement to adjust values assigned to configuration parameters.
ConfigMaps is the kubernetes way to inject application pods with configuration data.
ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable. This page provides a series of usage examples demonstrating how to create ConfigMaps and configure Pods using data stored in ConfigMaps.
-->
很多應用在其初始化或執行期間要依賴一些配置資訊。大多數時候，
存在要調整配置引數所設定的數值的需求。
ConfigMap 是 Kubernetes 用來嚮應用 Pod 中注入配置資料的方法。

ConfigMap 允許你將配置檔案與映象檔案分離，以使容器化的應用程式具有可移植性。
本頁提供了一系列使用示例，這些示例演示瞭如何建立 ConfigMap 以及配置 Pod
使用儲存在 ConfigMap 中的資料。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->
<!--
## Create a ConfigMap

You can use either `kubectl create configmap` or a ConfigMap generator in `kustomization.yaml` to create a ConfigMap. Note that `kubectl` starts to support `kustomization.yaml` since 1.14.
-->
## 建立 ConfigMap    {#create-a-configmap}

你可以使用 `kubectl create configmap` 或者在 `kustomization.yaml` 中的 ConfigMap
生成器來建立 ConfigMap。注意，`kubectl` 從 1.14 版本開始支援 `kustomization.yaml`。

<!--
### Create a ConfigMap Using kubectl create configmap

Use the `kubectl create configmap` command to create ConfigMaps from [directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files), or [literal values](#create-configmaps-from-literal-values):
-->
### 使用 kubectl create configmap 建立 ConfigMap    {#create-a-configmap-using-kubectl-create-configmap}

你可以使用 `kubectl create configmap`
命令基於[目錄](#create-configmaps-from-directories)、
[檔案](#create-configmaps-from-files)或者[字面值](#create-configmaps-from-literal-values)來建立
ConfigMap：

<!--
```shell
kubectl create configmap <map-name> <data-source>
```
-->
```shell
kubectl create configmap <對映名稱> <資料來源>
```

<!--
where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the directory, file, or literal value to draw the data from.
The name of a ConfigMap object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
其中，`<對映名稱>` 是為 ConfigMap 指定的名稱，`<資料來源>` 是要從中提取資料的目錄、
檔案或者字面值。
ConfigMap 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

<!--
When you are creating a ConfigMap based on a file, the key in the \<data-source> defaults to the basename of the file, and the value defaults to the file content.
-->
在你基於檔案來建立 ConfigMap 時，`<資料來源>` 中的鍵名預設取自檔案的基本名，
而對應的值則預設為檔案的內容。

<!--
You can use [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) or
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to retrieve information
about a ConfigMap.
-->
你可以使用[`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) 或者
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) 獲取有關 ConfigMap 的資訊。

<!--
#### Create ConfigMaps from directories

You can use `kubectl create configmap` to create a ConfigMap from multiple
files in the same directory.
When you are creating a ConfigMap based on a directory, kubectl identifies
files whose basename is a valid key in the directory and packages each of
those files into the new ConfigMap. Any directory entries except regular files
are ignored (e.g. subdirectories, symlinks, devices, pipes, etc).

For example:
-->
#### 基於目錄建立 ConfigMap     {#create-configmaps-from-directories}

你可以使用 `kubectl create configmap` 基於同一目錄中的多個檔案建立 ConfigMap。
當你基於目錄來建立 ConfigMap 時，kubectl 識別目錄下基本名可以作為合法鍵名的檔案，
並將這些檔案打包到新的 ConfigMap 中。普通檔案之外的所有目錄項都會被忽略
（例如：子目錄、符號連結、裝置、管道等等）。

例如：

<!--
```shell
# Create the local directory
mkdir -p configure-pod-container/configmap/

# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Create the configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```
-->
```shell
# 建立本地目錄
mkdir -p configure-pod-container/configmap/

# 將示例檔案下載到 `configure-pod-container/configmap/` 目錄
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# 建立 configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

<!--
The above command packages each file, in this case, `game.properties` and
`ui.properties` in the `configure-pod-container/configmap/` directory into the
game-config ConfigMap. You can display details of the ConfigMap using the
following command:
-->
以上命令將 `configure-pod-container/configmap` 目錄下的所有檔案，也就是
`game.properties` 和 `ui.properties` 打包到 game-config ConfigMap
中。你可以使用下面的命令顯示 ConfigMap 的詳細資訊：

```shell
kubectl describe configmaps game-config
```

<!--
The output is similar to this:
-->
輸出類似以下內容：

```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

<!--
The `game.properties` and `ui.properties` files in the `configure-pod-container/configmap/` directory are represented in the `data` section of the ConfigMap.
-->
`configure-pod-container/configmap/` 目錄中的 `game.properties` 和 `ui.properties`
檔案出現在 ConfigMap 的 `data` 部分。

```shell
kubectl get configmaps game-config -o yaml
```

<!--
The output is similar to this:
-->
輸出類似以下內容:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

<!--
#### Create ConfigMaps from files

You can use `kubectl create configmap` to create a ConfigMap from an individual file, or from multiple files.

For example,
-->
#### 基於檔案建立 ConfigMap   {#create-configmaps-from-files}

你可以使用 `kubectl create configmap` 基於單個檔案或多個檔案建立 ConfigMap。

例如：

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap:

```shell
kubectl describe configmaps game-config-2
```

<!--
where the output is similar to this:
-->
輸出類似以下內容:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

<!--
You can pass in the `--from-file` argument multiple times to create a ConfigMap from multiple data sources.
-->
你可以多次使用 `--from-file` 引數，從多個數據源建立 ConfigMap。

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

<!--
You can display details of the `game-config-2` ConfigMap using the following command:
-->
你可以使用以下命令顯示 `game-config-2` ConfigMap 的詳細資訊：

```shell
kubectl describe configmaps game-config-2
```

<!--
The output is similar to this:
-->
輸出類似以下內容:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

<!--
When `kubectl` creates a ConfigMap from inputs that are not ASCII or UTF-8, the tool puts these into the `binaryData` field of the ConfigMap, and not in `data`. Both text and binary data sources can be combined in one ConfigMap.
If you want to view the `binaryData` keys (and their values) in a ConfigMap, you can run `kubectl get configmap -o jsonpath='{.binaryData}' <name>`.

Use the option `--from-env-file` to create a ConfigMap from an env-file, for example:
-->
當 `kubectl` 基於非 ASCII 或 UTF-8 的輸入建立 ConfigMap 時，
該工具將這些輸入放入 ConfigMap 的 `binaryData` 欄位，而不是 `data` 中。
同一個 ConfigMap 中可同時包含文字資料和二進位制資料來源。
如果你想檢視 ConfigMap 中的 `binaryData` 鍵（及其值），
你可以執行 `kubectl get configmap -o jsonpath='{.binaryData}' <name>`。

使用 `--from-env-file` 選項從環境檔案建立 ConfigMap，例如：

<!--
```shell
# Env-files contain a list of environment variables.
# These syntax rules apply:
#   Each line in an env file has to be in VAR=VAL format.
#   Lines beginning with # (i.e. comments) are ignored.
#   Blank lines are ignored.
#   There is no special handling of quotation marks (i.e. they will be part of the ConfigMap value)).

# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# The env-file `game-env-file.properties` looks like below
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# This comment and the empty line above it are ignored
```
-->
Env 檔案包含環境變數列表。其中適用以下語法規則:

- Env 檔案中的每一行必須為 VAR=VAL 格式。
- 以＃開頭的行（即註釋）將被忽略。
- 空行將被忽略。
- 引號不會被特殊處理（即它們將成為 ConfigMap 值的一部分）。

將示例檔案下載到 `configure-pod-container/configmap/` 目錄：

```shell
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties
```

Env 檔案 `game-env-file.properties` 如下所示：

```shell
cat configure-pod-container/configmap/game-env-file.properties
```

```
enemies=aliens
lives=3
allowed="true"
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap：

```shell
kubectl get configmap game-config-env-file -o yaml
```

<!--
where the output is similar to this:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  selfLink: /api/v1/namespaces/default/configmaps/game-config-env-file
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

<!--
Starting with Kubernetes v1.23, `kubectl` supports the `--from-env-file` argument to be
specified multiple times to create a ConfigMap from multiple data sources.
-->
從 Kubernetes 1.23 版本開始，`kubectl` 支援多次指定 `--from-env-file` 引數來從多個數據源建立 ConfigMap。

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

<!--
where the output is similar to this:
-->
輸出類似以下內容:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

<!--
#### Define the key to use when creating a ConfigMap from a file

You can define a key other than the file name to use in the `data` section of your ConfigMap when using the `--from-file` argument:
-->
#### 定義從檔案建立 ConfigMap 時要使用的鍵    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在使用 `--from-file` 引數時，你可以定義在 ConfigMap 的 `data` 部分出現鍵名，
而不是按預設行為使用檔名：

<!--
```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```
-->
```shell
kubectl create configmap game-config-3 --from-file=<我的鍵名>=<檔案路徑>
```

<!--
where `<my-key-name>` is the key you want to use in the ConfigMap and `<path-to-file>` is the location of the data source file you want the key to represent.
-->
`<我的鍵名>` 是你要在 ConfigMap 中使用的鍵名，`<檔案路徑>` 是你想要鍵所表示的資料來源檔案的位置。

<!--
For example:
-->
例如:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap:

```shell
kubectl get configmaps game-config-3 -o yaml
```

<!--
where the output is similar to this:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

<!--
#### Create ConfigMaps from literal values

You can use `kubectl create configmap` with the `--from-literal` argument to define a literal value from the command line:
-->
#### 根據字面值建立 ConfigMap         {#create-configmaps-from-literal-values}

你可以將 `kubectl create configmap` 與 `--from-literal` 引數一起使用，
透過命令列定義文字值：

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

<!--
You can pass in multiple key-value pairs. Each pair provided on the command line is represented as a separate entry in the `data` section of the ConfigMap.
-->
你可以傳入多個鍵值對。命令列中提供的每對鍵值在 ConfigMap 的 `data` 部分中均表示為單獨的條目。

```shell
kubectl get configmaps special-config -o yaml
```

<!--
The output is similar to this:
-->
輸出類似以下內容:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

<!--
### Create a ConfigMap from generator

`kubectl` supports `kustomization.yaml` since 1.14.
You can also create a ConfigMap from generators and then apply it to create the object on
the Apiserver. The generators
should be specified in a `kustomization.yaml` inside a directory.
-->
### 基於生成器建立 ConfigMap    {#create-a-configmap-from-generator}

自 1.14 開始，`kubectl` 開始支援 `kustomization.yaml`。
你還可以基於生成器（Generators）建立 ConfigMap，然後將其應用於 API 伺服器上建立物件。
生成器應在目錄內的 `kustomization.yaml` 中指定。

<!--
#### Generate ConfigMaps from files

For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
-->
#### 基於檔案生成 ConfigMap    {#generate-configmaps-from-files}

例如，要基於 `configure-pod-container/configmap/game.properties`
檔案生成一個 ConfigMap：

<!--
```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```
-->
```shell
# 建立包含 ConfigMapGenerator 的 kustomization.yaml 檔案
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
應用（Apply）kustomization 目錄建立 ConfigMap 物件：

```shell
kubectl apply -k .
```

```
configmap/game-config-4-m9dm2f92bt created
```

<!--
You can check that the ConfigMap was created like this:
-->
你可以檢查 ConfigMap 被建立如下：

```shell
kubectl get configmap
```

```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s


kubectl describe configmaps/game-config-4-m9dm2f92bt
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

<!--
Note that the generated ConfigMap name has a suffix appended by hashing the contents. This ensures that a
new ConfigMap is generated each time the content is modified.
-->
請注意，生成的 ConfigMap 名稱具有透過對內容進行雜湊而附加的字尾，
這樣可以確保每次修改內容時都會生成新的 ConfigMap。

<!--
#### Define the key to use when generating a ConfigMap from a file

You can define a key other than the file name to use in the ConfigMap generator.
For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
with the key `game-special-key`
-->
#### 定義從檔案生成 ConfigMap 時要使用的鍵    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在 ConfigMap 生成器中，你可以定義一個非檔名的鍵名。
例如，從 `configure-pod-container/configmap/game.properties` 檔案生成 ConfigMap，
但使用 `game-special-key` 作為鍵名：

<!--
```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```
-->
```shell
# 建立包含 ConfigMapGenerator 的 kustomization.yaml 檔案
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
應用 Kustomization 目錄建立 ConfigMap 物件。

```shell
kubectl apply -k .
```

```
configmap/game-config-5-m67dt67794 created
```

<!--
#### Generate ConfigMaps from Literals

To generate a ConfigMap from literals `special.type=charm` and `special.how=very`,
you can specify the ConfigMap generator in `kustomization.yaml` as
-->
#### 基於字面值生成 ConfigMap    {#generate-configmaps-from-literals}

要基於字串 `special.type=charm` 和 `special.how=very` 生成 ConfigMap，
可以在 `kustomization.yaml` 中配置 ConfigMap 生成器：

<!--
```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```
-->
```shell
# 建立帶有 ConfigMapGenerator 的 kustomization.yaml 檔案
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
應用 Kustomization 目錄建立 ConfigMap 物件。

```shell
kubectl apply -k .
```

```
configmap/special-config-2-c92b5mmcf2 created
```

<!--
## Define container environment variables using ConfigMap data

### Define a container environment variable with data from a single ConfigMap
-->
## 使用 ConfigMap 資料定義容器環境變數    {#define-container-environment-variables-using-configmap-data}

### 使用單個 ConfigMap 中的資料定義容器環境變數    {#define-a-container-environment-variable-with-data-from-a-single-configmap}

<!--
1. Define an environment variable as a key-value pair in a ConfigMap:
-->
1. 在 ConfigMap 中將環境變數定義為鍵值對:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

<!--
2. Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY` environment variable in the Pod specification.
-->
2. 將 ConfigMap 中定義的 `special.how` 賦值給 Pod 規約中的 `SPECIAL_LEVEL_KEY` 環境變數。

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   <!--
   Create the Pod:
   -->
   建立 Pod:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   <!--
   Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`.
   -->
   現在，Pod 的輸出包含環境變數 `SPECIAL_LEVEL_KEY=very`。

<!--
### Define container environment variables with data from multiple ConfigMaps
-->
### 使用來自多個 ConfigMap 的資料定義容器環境變數    {#define-container-environment-variables-with-data-from-multiple-configmaps}

<!--
* As with the previous example, create the ConfigMaps first.
-->
* 與前面的示例一樣，首先建立 ConfigMap。

  {{< codenew file="configmap/configmaps.yaml" >}}

  <!--
  Create the ConfigMap:
  -->
  建立 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

<!--
* Define the environment variables in the Pod specification.
-->
* 在 Pod 規約中定義環境變數。

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  <!--
  Create the Pod:
  -->
  建立 Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`.
  -->
  現在，Pod 的輸出包含環境變數 `SPECIAL_LEVEL_KEY=very` 和 `LOG_LEVEL=INFO`。

<!--
## Configure all key-value pairs in a ConfigMap as container environment variables
-->
## 將 ConfigMap 中的所有鍵值對配置為容器環境變數    {#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables}

<!--
This functionality is available in Kubernetes v1.6 and later.
-->
{{< note >}}
Kubernetes v1.6 和更高版本支援此功能。
{{< /note >}}

<!--
* Create a ConfigMap containing multiple key-value pairs.
-->
* 建立一個包含多個鍵值對的 ConfigMap。

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  <!--
  Create the ConfigMap:
  -->
  建立 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

<!--
* Use `envFrom` to define all of the ConfigMap's data as container environment variables. The key from the ConfigMap becomes the environment variable name in the Pod.
-->
* 使用 `envFrom` 將所有 ConfigMap 的資料定義為容器環境變數，ConfigMap
  中的鍵成為 Pod 中的環境變數名稱。

  {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

  <!--
  Create the Pod:
  -->
  建立 Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL=very` and `SPECIAL_TYPE=charm`.
  -->
  現在，Pod 的輸出包含環境變數 `SPECIAL_LEVEL=very` 和 `SPECIAL_TYPE=charm`。

<!--
## Use ConfigMap-defined environment variables in Pod commands
-->
## 在 Pod 命令中使用 ConfigMap 定義的環境變數    {#use-configmap-defined-environment-variables-in-pod-commands}

<!--
You can use ConfigMap-defined environment variables in the `command` and `args` of a container using the `$(VAR_NAME)` Kubernetes substitution syntax.
-->
你可以使用 `$(VAR_NAME)` Kubernetes 替換語法在容器的 `command` 和 `args`
屬性中使用 ConfigMap 定義的環境變數。

<!--
For example, the following Pod specification
-->
例如，以下 Pod 規約

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

<!--
created by running
-->
透過執行下面命令建立 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

<!--
produces the following output in the `test-container` container:
-->
在 `test-container` 容器中產生以下輸出:

```
very charm
```

<!--
## Add ConfigMap data to a Volume

As explained in [Create ConfigMaps from files](#create-configmaps-from-files), when you create a ConfigMap using ``--from-file``, the filename becomes a key stored in the `data` section of the ConfigMap. The file contents become the key's value.
-->
## 將 ConfigMap 資料新增到一個卷中    {#add-configmap-data-to-a-volume}

如基於檔案建立 [ConfigMap](#create-configmaps-from-files) 中所述，當你使用
`--from-file` 建立 ConfigMap 時，檔名成為儲存在 ConfigMap 的 `data` 部分中的鍵，
檔案內容成為鍵對應的值。

<!--
The examples in this section refer to a ConfigMap named special-config, shown below.
-->
本節中的示例引用了一個名為 'special-config' 的 ConfigMap，如下所示：

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

<!--
Create the ConfigMap:
-->
建立 ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

<!--
### Populate a Volume with data stored in a ConfigMap

Add the ConfigMap name under the `volumes` section of the Pod specification.
This adds the ConfigMap data to the directory specified as `volumeMounts.mountPath` (in this case, `/etc/config`).
The `command` section lists directory files with names that match the keys in ConfigMap.
-->
### 使用儲存在 ConfigMap 中的資料填充卷    {#populate-a-volume-with-data-stored-in-a-configmap}

在 Pod 規約的 `volumes` 部分下新增 ConfigMap 名稱。
這會將 ConfigMap 資料新增到 `volumeMounts.mountPath` 所指定的目錄
（在本例中為 `/etc/config`）。
`command` 部分列出了名稱與 ConfigMap 中的鍵匹配的目錄檔案。

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

<!--
When the pod runs, the command `ls /etc/config/` produces the output below:
-->
Pod 執行時，命令 `ls /etc/config/` 產生下面的輸出：

```
SPECIAL_LEVEL
SPECIAL_TYPE
```
<!--
If there are some files in the `/etc/config/` directory, they will be deleted.
-->
{{< caution >}}
如果在 `/etc/config/` 目錄中有一些檔案，這些檔案將被刪除。
{{< /caution >}}

<!--
Text data is exposed as files using the UTF-8 character encoding. To use some other character encoding, use binaryData.
-->
{{< note >}}
文字資料會展現為 UTF-8 字元編碼的檔案。如果使用其他字元編碼，
可以使用 `binaryData`。
{{< /note >}}

<!--
### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.
-->
### 將 ConfigMap 資料新增到卷中的特定路徑    {#add-configmap-data-to-a-specific-path-in-the-volume}

使用 `path` 欄位為特定的 ConfigMap 專案指定預期的檔案路徑。
在這裡，ConfigMap 中鍵 `SPECIAL_LEVEL` 的內容將掛載在 `config-volume`
卷中 `/etc/config/keys` 檔案中。

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

<!--
Create the Pod:
-->
建立Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

<!--
When the pod runs, the command `cat /etc/config/keys` produces the output below:
-->
當 Pod 執行時，命令 `cat /etc/config/keys` 產生以下輸出：

```
very
```

<!--
Like before, all previous files in the `/etc/config/` directory will be deleted.
-->
{{< caution >}}
如前，`/etc/config/` 目錄中所有先前的檔案都將被刪除。
{{< /caution >}}

<!--
### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) user guide explains the syntax.
-->
### 對映鍵到指定路徑並設定檔案訪問許可權    {#project-keys-to-specific-paths-and-file-permissions}

你可以將指定鍵名投射到特定目錄，也可以逐個檔案地設定訪問許可權。
[Secret 使用者指南](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
中為這一語法提供瞭解釋。

<!--
### Optional References

A ConfigMap reference may be marked "optional".  If the ConfigMap is non-existent, the mounted volume will be empty. If the ConfigMap exists, but the referenced
key is non-existent the path will be absent beneath the mount point.
-->
### 可選的引用   {#optional-references}

ConfigMap 引用可以被標記為 “optional（可選的）”。如果所引用的 ConfigMap 不存在，
則所掛載的卷將會是空的。如果所引用的 ConfigMap 確實存在，但是所引用的主鍵不存在，
則在掛載點下對應的路徑也會不存在。

<!--
### Mounted ConfigMaps are updated automatically
-->
### 掛載的 ConfigMap 將自動更新   {#mounted-configmaps-are-updated-automatically}

<!--
When a mounted ConfigMap is updated, the projected content is eventually updated too.  This applies in the case where an optionally referenced ConfigMap comes into
existence after a pod has started.
-->
當某個已被掛載的 ConfigMap 被更新，所投射的內容最終也會被更新。
對於 Pod 已經啟動之後所引用的、可選的 ConfigMap 才出現的情形，
這一動態更新現象也是適用的。

<!--
Kubelet checks whether the mounted ConfigMap is fresh on every periodic sync. However, it uses its local TTL-based cache for getting the current value of the
ConfigMap. As a result, the total delay from the moment when the ConfigMap is updated to the moment when new keys are projected to the pod can be as long as
kubelet sync period (1 minute by default) + TTL of ConfigMaps cache (1 minute by default) in kubelet. You can trigger an immediate refresh by updating one of
the pod's annotations.
-->
`kubelet` 在每次週期性同步時都會檢查已掛載的 ConfigMap 是否是最新的。
但是，它使用其本地的基於 TTL 的快取來獲取 ConfigMap 的當前值。
因此，從更新 ConfigMap 到將新鍵對映到 Pod 的總延遲可能與
kubelet 同步週期（預設 1 分鐘） + ConfigMap 在 kubelet 中快取的 TTL
（預設 1 分鐘）一樣長。
你可以透過更新 Pod 的某個註解來觸發立即更新。

<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath) volume will not receive ConfigMap updates.
-->
{{< note >}}
使用 ConfigMap 作為 [subPath](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
的資料卷將不會收到 ConfigMap 更新。
{{< /note >}}

<!-- discussion -->

<!--
## Understanding ConfigMaps and Pods

The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.
-->
## 瞭解 ConfigMap 和 Pod    {#understanding-configmaps-and-pods}

ConfigMap API 資源將配置資料儲存為鍵值對。
資料可以在 Pod 中使用，也可以用來提供系統元件（如控制器）的配置。
ConfigMap 與 [Secret](/zh-cn/docs/concepts/configuration/secret/) 類似，
但是提供的是一種處理不含敏感資訊的字串的方法。
使用者和系統元件都可以在 ConfigMap 中儲存配置資料。

<!--
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.
-->
{{< note >}}
ConfigMap 應該引用屬性檔案，而不是替換它們。可以將 ConfigMap 理解為類似於 Linux
`/etc` 目錄及其內容的東西。例如，如果你基於 ConfigMap 建立
[Kubernetes 卷](/zh-cn/docs/concepts/storage/volumes/)，則 ConfigMap
中的每個資料項都由該資料卷中的某個獨立的檔案表示。
{{< /note >}}

<!--
The ConfigMap's `data` field contains the configuration data. As shown in the example below, this can be simple -- like individual properties defined using `--from-literal` -- or complex -- like configuration files or JSON blobs defined using `--from-file`.
-->
ConfigMap 的 `data` 欄位包含配置資料。如下例所示，它可以簡單
（如用 `--from-literal` 的單個屬性定義）或複雜
（如用 `--from-file` 的配置檔案或 JSON blob定義）。

<!--
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # example of a simple property defined using --from-literal
  example.property.1: hello
  example.property.2: world
  # example of a complex property defined using --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```
-->
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # 使用 --from-literal 定義的簡單屬性
  example.property.1: hello
  example.property.2: world
  # 使用 --from-file 定義複雜屬性的例子
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

<!--
### Restrictions

- You must create a ConfigMap before referencing it in a Pod specification (unless you mark the ConfigMap as "optional"). If you reference a ConfigMap that doesn't exist, the Pod won't start. Likewise, references to keys that don't exist in the ConfigMap will prevent the pod from starting.
-->
### 限制   {#restrictions}

- 在 Pod 規約中引用某個 ConfigMap 之前，必須先建立它（除非將 ConfigMap 標記為
  “optional（可選）”）。如果引用的 ConfigMap 不存在，則 Pod 將不會啟動。
  同樣，引用 ConfigMap 中不存在的主鍵也會令 Pod 無法啟動。

<!--
- If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered invalid will be skipped. The pod will be allowed to start, but the invalid names will be recorded in the event log (`InvalidVariableNames`). The log message lists each skipped key. For example:
-->
- 如果你使用 `envFrom` 來基於 ConfigMap 定義環境變數，那麼無效的鍵將被忽略。
  Pod 可以被啟動，但無效名稱將被記錄在事件日誌中（`InvalidVariableNames`）。
  日誌訊息列出了每個被跳過的鍵。例如:

  ```shell
  kubectl get events
  ```

  <!--
  The output is similar to this:
  -->
  輸出與此類似:

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

<!--
- ConfigMaps reside in a specific {{< glossary_tooltip term_id="namespace" >}}. A ConfigMap can only be referenced by pods residing in the same namespace.
-->
- ConfigMap 位於確定的{{< glossary_tooltip term_id="namespace" text="名字空間" >}}中。
  每個 ConfigMap 只能被同一名字空間中的 Pod 引用.

<!--
- You can't use ConfigMaps for {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, because the Kubelet does not support this.
-->
- 你不能將 ConfigMap 用於{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}，
  因為 Kubernetes 不支援這種用法。

## {{% heading "whatsnext" %}}

<!--
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
-->
* 瀏覽[使用 ConfigMap 配置 Redis](/zh-cn/docs/tutorials/configuration/configure-redis-using-configmap/)
  真實示例。

