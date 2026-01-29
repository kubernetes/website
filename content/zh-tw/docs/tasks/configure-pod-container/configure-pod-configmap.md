---
title: 設定 Pod 使用 ConfigMap
content_type: task
weight: 190
card:
  name: tasks
  weight: 50
---
<!--
title: Configure a Pod to Use a ConfigMap
content_type: task
weight: 190
card:
  name: tasks
  weight: 50
-->

<!-- overview -->
<!--
Many applications rely on configuration which is used during either application initialization or runtime.
Most times, there is a requirement to adjust values assigned to configuration parameters.
ConfigMaps are a Kubernetes mechanism that let you inject configuration data into application
{{< glossary_tooltip text="pods" term_id="pod" >}}.
-->
很多應用在其初始化或運行期間要依賴一些設定資訊。
大多數時候，存在要調整設定參數所設置的數值的需求。
ConfigMap 是 Kubernetes 的一種機制，可讓你將設定資料注入到應用的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 內部。

<!--
The ConfigMap concept allow you to decouple configuration artifacts from image content to
keep containerized applications portable. For example, you can download and run the same
{{< glossary_tooltip text="container image" term_id="image" >}} to spin up containers for 
the purposes of local development, system test, or running a live end-user workload.
-->
ConfigMap 概念允許你將設定清單與映像檔內容分離，以保持容器化的應用程式的可移植性。
例如，你可以下載並運行相同的{{< glossary_tooltip text="容器映像檔" term_id="image" >}}來啓動容器，
用於本地開發、系統測試或運行實時終端使用者工作負載。

<!--
This page provides a series of usage examples demonstrating how to create ConfigMaps and
configure Pods using data stored in ConfigMaps.
-->
本頁提供了一系列使用示例，這些示例演示瞭如何創建 ConfigMap 以及設定 Pod
使用儲存在 ConfigMap 中的資料。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need to have the `wget` tool installed. If you have a different tool
such as `curl`, and you do not have `wget`, you will need to adapt the
step that downloads example data.
-->
你需要安裝 `wget` 工具。如果你有不同的工具，例如 `curl`，而沒有 `wget`，
則需要調整下載示例資料的步驟。

<!-- steps -->

<!--
## Create a ConfigMap

You can use either `kubectl create configmap` or a ConfigMap generator in `kustomization.yaml`
to create a ConfigMap.
-->
## 創建 ConfigMap    {#create-a-configmap}

你可以使用 `kubectl create configmap` 或者在 `kustomization.yaml` 中的 ConfigMap
生成器來創建 ConfigMap。

<!--
### Create a ConfigMap using `kubectl create configmap`

Use the `kubectl create configmap` command to create ConfigMaps from
[directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files),
or [literal values](#create-configmaps-from-literal-values):
-->
### 使用 `kubectl create configmap` 創建 ConfigMap    {#create-a-configmap-using-kubectl-create-configmap}

你可以使用 `kubectl create configmap` 命令基於[目錄](#create-configmaps-from-directories)、
[檔案](#create-configmaps-from-files)或者[字面值](#create-configmaps-from-literal-values)來創建
ConfigMap：

<!--
```shell
kubectl create configmap <map-name> <data-source>
```
-->
```shell
kubectl create configmap <映射名稱> <數據源>
```

<!--
where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the
directory, file, or literal value to draw the data from.
The name of a ConfigMap object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
其中，`<映射名稱>` 是爲 ConfigMap 指定的名稱，`<數據源>` 是要從中提取資料的目錄、
檔案或者字面值。ConfigMap 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
When you are creating a ConfigMap based on a file, the key in the \<data-source> defaults to
the basename of the file, and the value defaults to the file content.
-->
在你基於檔案來創建 ConfigMap 時，`<數據源>` 中的鍵名預設取自檔案的基本名，
而對應的值則預設爲檔案的內容。

<!--
You can use [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) or
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to retrieve information
about a ConfigMap.
-->
你可以使用 [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) 或者
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) 獲取有關 ConfigMap 的資訊。

<!--
#### Create a ConfigMap from a directory {#create-configmaps-from-directories}

You can use `kubectl create configmap` to create a ConfigMap from multiple files in the same
directory. When you are creating a ConfigMap based on a directory, kubectl identifies files
whose filename is a valid key in the directory and packages each of those files into the new
ConfigMap. Any directory entries except regular files are ignored (for example: subdirectories,
symlinks, devices, pipes, and more).
-->
#### 基於一個目錄來創建 ConfigMap     {#create-configmaps-from-directories}

你可以使用 `kubectl create configmap` 基於同一目錄中的多個檔案創建 ConfigMap。
當你基於目錄來創建 ConfigMap 時，kubectl 識別目錄下檔案名可以作爲合法鍵名的檔案，
並將這些檔案打包到新的 ConfigMap 中。普通檔案之外的所有目錄項都會被忽略
（例如：子目錄、符號鏈接、設備、管道等等）。

{{< note >}}
<!--
Each filename being used for ConfigMap creation must consist of only acceptable characters,
which are: letters (`A` to `Z` and `a` to `z`), digits (`0` to `9`), '-', '_', or '.'.
If you use `kubectl create configmap` with a directory where any of the file names contains
an unacceptable character, the `kubectl` command may fail.
-->
用於創建 ConfigMap 的每個檔案名必須由可接受的字符組成，即：字母（`A` 到 `Z` 和
`a` 到 `z`）、數字（`0` 到 `9`）、'-'、'_' 或 '.'。
如果在一個目錄中使用 `kubectl create configmap`，而其中任一檔案名包含不可接受的字符，
則 `kubectl` 命令可能會失敗。

<!--
The `kubectl` command does not print an error when it encounters an invalid filename.
-->
`kubectl` 命令在遇到不合法的檔案名時不會打印錯誤。

{{< /note >}}

<!--
Create the local directory:
-->
創建本地目錄：

```shell
mkdir -p configure-pod-container/configmap/
```

<!--
Now, download the sample configuration and create the ConfigMap:
-->
現在，下載示例的設定並創建 ConfigMap：

<!--
```shell
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Create the ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```
-->
```shell
# 將示例文件下載到 `configure-pod-container/configmap/` 目錄
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# 創建 ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

<!--
The above command packages each file, in this case, `game.properties` and `ui.properties`
in the `configure-pod-container/configmap/` directory into the game-config ConfigMap. You can
display details of the ConfigMap using the following command:
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
The `game.properties` and `ui.properties` files in the `configure-pod-container/configmap/`
directory are represented in the `data` section of the ConfigMap.
-->
`configure-pod-container/configmap/` 目錄中的 `game.properties` 和 `ui.properties`
檔案出現在 ConfigMap 的 `data` 部分。

```shell
kubectl get configmaps game-config -o yaml
```

<!--
The output is similar to this:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:52:05Z
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

You can use `kubectl create configmap` to create a ConfigMap from an individual file, or from
multiple files.

For example,
-->
#### 基於檔案創建 ConfigMap   {#create-configmaps-from-files}

你可以使用 `kubectl create configmap` 基於單個檔案或多個檔案創建 ConfigMap。

例如：

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap：

```shell
kubectl describe configmaps game-config-2
```

<!--
where the output is similar to this:
-->
輸出類似以下內容：

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
You can pass in the `--from-file` argument multiple times to create a ConfigMap from multiple
data sources.
-->
你可以多次使用 `--from-file` 參數，從多個資料源創建 ConfigMap。

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
輸出類似以下內容：

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
Use the option `--from-env-file` to create a ConfigMap from an env-file, for example:
-->
使用 `--from-env-file` 選項基於 env 檔案創建 ConfigMap，例如：

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
```shell
# Env 文件包含環境變量列表。其中適用以下語法規則:
# 這些語法規則適用：
#   Env 文件中的每一行必須爲 VAR=VAL 格式。
#   以＃開頭的行（即註釋）將被忽略。
#   空行將被忽略。
#   引號不會被特殊處理（即它們將成爲 ConfigMap 值的一部分）。

# 將示例文件下載到 `configure-pod-container/configmap/` 目錄
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Env 文件 `game-env-file.properties` 如下所示
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# 此註釋和上方的空行將被忽略
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

<!--
would produce a ConfigMap. View the ConfigMap:
-->
將產生以下 ConfigMap。查看 ConfigMap：

```shell
kubectl get configmap game-config-env-file -o yaml
```

<!--
the output is similar to:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
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
從 Kubernetes 1.23 版本開始，`kubectl` 支持多次指定 `--from-env-file` 參數來從多個資料源創建
ConfigMap。

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap：

```shell
kubectl get configmap config-multi-env-files -o yaml
```

<!--
where the output is similar to this:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
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

You can define a key other than the file name to use in the `data` section of your ConfigMap
when using the `--from-file` argument:
-->
#### 定義從檔案創建 ConfigMap 時要使用的鍵    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在使用 `--from-file` 參數時，你可以定義在 ConfigMap 的 `data` 部分出現鍵名，
而不是按預設行爲使用檔案名：

<!--
```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```
-->
```shell
kubectl create configmap game-config-3 --from-file=<我的鍵名>=<文件路徑>
```

<!--
where `<my-key-name>` is the key you want to use in the ConfigMap and `<path-to-file>` is the
location of the data source file you want the key to represent.
-->
`<我的鍵名>` 是你要在 ConfigMap 中使用的鍵名，`<文件路徑>` 是你想要鍵所表示的資料源檔案的位置。

<!--
For example:
-->
例如：

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
將產生以下 ConfigMap：

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
  creationTimestamp: 2022-02-18T18:54:22Z
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

You can use `kubectl create configmap` with the `--from-literal` argument to define a literal
value from the command line:
-->
#### 根據字面值創建 ConfigMap         {#create-configmaps-from-literal-values}

你可以將 `kubectl create configmap` 與 `--from-literal` 參數一起使用，
通過命令列定義文字值：

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

<!--
You can pass in multiple key-value pairs. Each pair provided on the command line is represented
as a separate entry in the `data` section of the ConfigMap.
-->
你可以傳入多個鍵值對。命令列中提供的每對鍵值在 ConfigMap 的 `data` 部分中均表示爲單獨的條目。

```shell
kubectl get configmaps special-config -o yaml
```

<!--
The output is similar to this:
-->
輸出類似以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T19:14:38Z
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

You can also create a ConfigMap from generators and then apply it to create the object
in the cluster's API server.
You should specify the generators in a `kustomization.yaml` file within a directory.
-->
### 基於生成器創建 ConfigMap    {#create-a-configmap-from-generator}

你還可以基於生成器（Generators）創建 ConfigMap，然後將其應用於叢集的 API 伺服器上創建對象。
生成器應在目錄內的 `kustomization.yaml` 中指定。

<!--
#### Generate ConfigMaps from files

For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
-->
#### 基於檔案生成 ConfigMap    {#generate-configmaps-from-files}

例如，要基於 `configure-pod-container/configmap/game.properties`
檔案生成一個 ConfigMap：

<!--
# Create a kustomization.yaml file with ConfigMapGenerator
-->
```shell
# 創建包含 ConfigMapGenerator 的 kustomization.yaml 文件
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  options:
    labels:
      game-config: config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object:
-->
應用（Apply）kustomization 目錄創建 ConfigMap 對象：

```shell
kubectl apply -k .
```

```
configmap/game-config-4-m9dm2f92bt created
```

<!--
You can check that the ConfigMap was created like this:
-->
你可以像這樣檢查 ConfigMap 已經被創建：

```shell
kubectl get configmap
```
```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s
```

<!-- and also: -->
也可以這樣：

```shell
kubectl describe configmaps/game-config-4-m9dm2f92bt
```
```
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       game-config=config-4
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
Notice that the generated ConfigMap name has a suffix appended by hashing the contents. This
ensures that a new ConfigMap is generated each time the content is modified.
-->
請注意，生成的 ConfigMap 名稱具有通過對內容進行散列而附加的後綴，
這樣可以確保每次修改內容時都會生成新的 ConfigMap。

<!--
#### Define the key to use when generating a ConfigMap from a file

You can define a key other than the file name to use in the ConfigMap generator.
For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
with the key `game-special-key`
-->
#### 定義從檔案生成 ConfigMap 時要使用的鍵    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在 ConfigMap 生成器中，你可以定義一個非檔案名的鍵名。
例如，從 `configure-pod-container/configmap/game.properties` 檔案生成 ConfigMap，
但使用 `game-special-key` 作爲鍵名：

<!--
```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  options:
    labels:
      game-config: config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```
-->
```shell
# 創建包含 ConfigMapGenerator 的 kustomization.yaml 文件
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  options:
    labels:
      game-config: config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
應用 Kustomization 目錄創建 ConfigMap 對象。

```shell
kubectl apply -k .
```
```
configmap/game-config-5-m67dt67794 created
```

<!--
#### Generate ConfigMaps from literals

This example shows you how to create a `ConfigMap` from two literal key/value pairs:
`special.type=charm` and `special.how=very`, using Kustomize and kubectl. To achieve
this, you can specify the `ConfigMap` generator. Create (or replace)
`kustomization.yaml` so that it has the following contents:
-->
#### 基於字面值生成 ConfigMap    {#generate-configmaps-from-literals}

此示例向你展示如何使用 Kustomize 和 kubectl，基於兩個字面鍵/值對
`special.type=charm` 和 `special.how=very` 創建一個 `ConfigMap`。
爲了實現這一點，你可以設定 `ConfigMap` 生成器。
創建（或替換）`kustomization.yaml`，使其具有以下內容。

<!--
# kustomization.yaml contents for creating a ConfigMap from literals
-->
```yaml
---
# 基於字面創建 ConfigMap 的 kustomization.yaml 內容
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object:
-->
應用 Kustomization 目錄創建 ConfigMap 對象。

```shell
kubectl apply -k .
```
```
configmap/special-config-2-c92b5mmcf2 created
```

<!--
## Interim cleanup

Before proceeding, clean up some of the ConfigMaps you made:
-->
## 臨時清理    {#interim-cleanup}

在繼續之前，清理你創建的一些 ConfigMap：

```bash
kubectl delete configmap special-config
kubectl delete configmap env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

<!--
Now that you have learned to define ConfigMaps, you can move on to the next
section, and learn how to use these objects with Pods.
-->
現在你已經學會了定義 ConfigMap，你可以繼續下一節，學習如何將這些對象與 Pod 一起使用。

---

<!--
## Define container environment variables using ConfigMap data

### Define a container environment variable with data from a single ConfigMap
-->
## 使用 ConfigMap 資料定義容器環境變量    {#define-container-environment-variables-using-configmap-data}

### 使用單個 ConfigMap 中的資料定義容器環境變量    {#define-a-container-environment-variable-with-data-from-a-single-configmap}

<!--
1. Define an environment variable as a key-value pair in a ConfigMap:
-->
1. 在 ConfigMap 中將環境變量定義爲鍵值對：

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

<!--
2. Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY`
   environment variable in the Pod specification.
-->
2. 將 ConfigMap 中定義的 `special.how` 賦值給 Pod 規約中的 `SPECIAL_LEVEL_KEY` 環境變量。

   {{% code_sample file="pods/pod-single-configmap-env-variable.yaml" %}}

   <!--
   Create the Pod:
   -->
   創建 Pod：

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   <!--
   Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`.
   -->
   現在，Pod 的輸出包含環境變量 `SPECIAL_LEVEL_KEY=very`。

<!--
### Define container environment variables with data from multiple ConfigMaps
-->
### 使用來自多個 ConfigMap 的資料定義容器環境變量    {#define-container-environment-variables-with-data-from-multiple-configmaps}

<!--
As with the previous example, create the ConfigMaps first.
Here is the manifest you will use:
-->
與前面的示例一樣，首先創建 ConfigMap。
這是你將使用的清單：

{{% code_sample file="configmap/configmaps.yaml" %}}

<!--
* Create the ConfigMap:
-->
* 創建 ConfigMap：

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

<!--
* Define the environment variables in the Pod specification.
-->
* 在 Pod 規約中定義環境變量。

  {{% code_sample file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  <!--
  Create the Pod:
  -->
  創建 Pod：

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`.
  -->
  現在，Pod 的輸出包含環境變量 `SPECIAL_LEVEL_KEY=very` 和 `LOG_LEVEL=INFO`。

  <!--
  Once you're happy to move on, delete that Pod and ConfigMap:
  -->
  一旦你樂意繼續前進，刪除此 Pod 和 ConfigMap：

  ```shell
  kubectl delete pod dapi-test-pod --now
  kubectl delete configmap special-config
  kubectl delete configmap env-config
  ```

<!--
## Configure all key-value pairs in a ConfigMap as container environment variables
-->
## 將 ConfigMap 中的所有鍵值對設定爲容器環境變量    {#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables}

<!--
* Create a ConfigMap containing multiple key-value pairs.
-->
* 創建一個包含多個鍵值對的 ConfigMap。

  {{% code_sample file="configmap/configmap-multikeys.yaml" %}}

  <!--
  Create the ConfigMap:
  -->
  創建 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

<!--
* Use `envFrom` to define all of the ConfigMap's data as container environment variables. The
  key from the ConfigMap becomes the environment variable name in the Pod.
-->
* 使用 `envFrom` 將所有 ConfigMap 的資料定義爲容器環境變量，ConfigMap
  中的鍵成爲 Pod 中的環境變量名稱。

  {{% code_sample file="pods/pod-configmap-envFrom.yaml" %}}

  <!--
  Create the Pod:
  -->
  創建 Pod：

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL=very` and
  `SPECIAL_TYPE=charm`.

  Once you're happy to move on, delete that Pod:
  -->
  現在，Pod 的輸出包含環境變量 `SPECIAL_LEVEL=very` 和 `SPECIAL_TYPE=charm`。

  一旦你樂意繼續前進，刪除該 Pod：

  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

<!--
## Use ConfigMap-defined environment variables in Pod commands
-->
## 在 Pod 命令中使用 ConfigMap 定義的環境變量    {#use-configmap-defined-environment-variables-in-pod-commands}

<!--
You can use ConfigMap-defined environment variables in the `command` and `args` of a container
using the `$(VAR_NAME)` Kubernetes substitution syntax.
-->
你可以使用 `$(VAR_NAME)` Kubernetes 替換語法在容器的 `command` 和 `args`
屬性中使用 ConfigMap 定義的環境變量。

<!--
For example, the following Pod manifest:

-->
例如，以下 Pod 清單：

{{% code_sample file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

<!--
Create that Pod, by running:
-->
通過運行下面命令創建該 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

<!--
That pod produces the following output from the `test-container` container:
-->
此 Pod 在 `test-container` 容器中產生以下輸出：

```shell
kubectl logs dapi-test-pod
```

```
very charm
```

<!--
Once you're happy to move on, delete that Pod:
-->
一旦你樂意繼續前進，刪除該 Pod：

```shell
kubectl delete pod dapi-test-pod --now
```

<!--
## Add ConfigMap data to a Volume

As explained in [Create ConfigMaps from files](#create-configmaps-from-files), when you create
a ConfigMap using `--from-file`, the filename becomes a key stored in the `data` section of
the ConfigMap. The file contents become the key's value.
-->
## 將 ConfigMap 資料添加到一個卷中    {#add-configmap-data-to-a-volume}

如基於檔案創建 [ConfigMap](#create-configmaps-from-files) 中所述，當你使用
`--from-file` 創建 ConfigMap 時，檔案名成爲儲存在 ConfigMap 的 `data` 部分中的鍵，
檔案內容成爲鍵對應的值。

<!--
The examples in this section refer to a ConfigMap named `special-config`:
-->
本節中的示例引用了一個名爲 `special-config` 的 ConfigMap：

{{% code_sample file="configmap/configmap-multikeys.yaml" %}}

<!--
Create the ConfigMap:
-->
創建 ConfigMap：

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

<!--
### Populate a Volume with data stored in a ConfigMap

Add the ConfigMap name under the `volumes` section of the Pod specification.
This adds the ConfigMap data to the directory specified as `volumeMounts.mountPath` (in this
case, `/etc/config`). The `command` section lists directory files with names that match the
keys in ConfigMap.
-->
### 使用儲存在 ConfigMap 中的資料填充卷    {#populate-a-volume-with-data-stored-in-a-configmap}

在 Pod 規約的 `volumes` 部分下添加 ConfigMap 名稱。
這會將 ConfigMap 資料添加到 `volumeMounts.mountPath` 所指定的目錄
（在本例中爲 `/etc/config`）。
`command` 部分列出了名稱與 ConfigMap 中的鍵匹配的目錄檔案。

{{% code_sample file="pods/pod-configmap-volume.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

<!--
When the pod runs, the command `ls /etc/config/` produces the output below:
-->
Pod 運行時，命令 `ls /etc/config/` 產生下面的輸出：

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

<!--
Text data is exposed as files using the UTF-8 character encoding. To use some other
character encoding, use `binaryData`
(see [ConfigMap object](/docs/concepts/configuration/configmap/#configmap-object) for more details).
-->
文本資料會展現爲 UTF-8 字符編碼的檔案。如果使用其他字符編碼，
可以使用 `binaryData`（詳情參閱 [ConfigMap 對象](/zh-cn/docs/concepts/configuration/configmap/#configmap-object)）。

{{< note >}}

<!--
If there are any files in the `/etc/config` directory of that container image, the volume
mount will make those files from the image inaccessible.
-->
如果該容器映像檔的 `/etc/config`
目錄中有一些檔案，卷掛載將使該映像檔中的這些檔案無法訪問。
{{< /note >}}

<!--
Once you're happy to move on, delete that Pod:
-->
一旦你樂意繼續前進，刪除該 Pod：

```shell
kubectl delete pod dapi-test-pod --now
```

<!--
### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.
-->
### 將 ConfigMap 資料添加到卷中的特定路徑    {#add-configmap-data-to-a-specific-path-in-the-volume}

使用 `path` 字段爲特定的 ConfigMap 項目指定預期的檔案路徑。
在這裏，ConfigMap 中鍵 `SPECIAL_LEVEL` 的內容將掛載在 `config-volume`
卷中 `/etc/config/keys` 檔案中。

{{% code_sample file="pods/pod-configmap-volume-specific-key.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

<!--
When the pod runs, the command `cat /etc/config/keys` produces the output below:
-->
當 Pod 運行時，命令 `cat /etc/config/keys` 產生以下輸出：

```
very
```

{{< caution >}}
<!--
Like before, all previous files in the `/etc/config/` directory will be deleted.
-->
如前，`/etc/config/` 目錄中所有先前的檔案都將被刪除。
{{< /caution >}}

<!--
Delete that Pod:
-->
刪除該 Pod：

```shell
kubectl delete pod dapi-test-pod --now
```

<!--
### Project keys to specific paths and file permissions

You can project keys to specific paths.
Refer to the corresponding section in the
[Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths)
guide for the syntax.  
You can set POSIX permissions for keys.
Refer to the corresponding section in the
[Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys)
guide for the syntax.
-->
你可以將密鑰投射到特定路徑，語法請參閱
[Secret](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths)
指南中的相應部分。
你可以設置密鑰的 POSIX 權限，語法請參閱
[Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys)
指南中的相應部分。

### 映射鍵到指定路徑並設置檔案訪問權限    {#project-keys-to-specific-paths-and-file-permissions}

你可以將指定鍵名投射到特定目錄，也可以逐個檔案地設定訪問權限。
[Secret](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
指南中爲這一語法提供瞭解釋。

<!--
### Optional references

A ConfigMap reference may be marked _optional_. If the ConfigMap is non-existent, the mounted
volume will be empty. If the ConfigMap exists, but the referenced key is non-existent, the path
will be absent beneath the mount point. See [Optional ConfigMaps](#optional-configmaps) for more
details.
-->
### 可選引用    {#optional-references}

ConfigMap 引用可以被標記爲**可選**。
如果 ConfigMap 不存在，則掛載的卷將爲空。
如果 ConfigMap 存在，但引用的鍵不存在，則掛載點下的路徑將不存在。
有關更多資訊，請參閱[可選 ConfigMap](#optional-configmaps) 細節。

<!--
### Mounted ConfigMaps are updated automatically

When a mounted ConfigMap is updated, the projected content is eventually updated too.
This applies in the case where an optionally referenced ConfigMap comes into
existence after a pod has started.
-->
### 掛載的 ConfigMap 會被自動更新    {#mounted-configMaps-are-updated-automatically}

當已掛載的 ConfigMap 被更新時，所投射的內容最終也會被更新。
這適用於 Pod 啓動後可選引用的 ConfigMap 重新出現的情況。

<!--
Kubelet checks whether the mounted ConfigMap is fresh on every periodic sync. However,
it uses its local TTL-based cache for getting the current value of the ConfigMap. As a
result, the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the pod can be as long as kubelet sync period (1
minute by default) + TTL of ConfigMaps cache (1 minute by default) in kubelet. You
can trigger an immediate refresh by updating one of the pod's annotations.
-->
Kubelet 在每次定期同步時都會檢查所掛載的 ConfigMap 是否是最新的。
然而，它使用其基於 TTL 機制的本地緩存來獲取 ConfigMap 的當前值。
因此，從 ConfigMap 更新到新鍵映射到 Pod 的總延遲可能與 kubelet
同步週期（預設爲 1 分鐘）+ kubelet 中 ConfigMap 緩存的 TTL（預設爲 1 分鐘）一樣長。
你可以通過更新 Pod 的一個註解來觸發立即刷新。

{{< note >}}
<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath)
volume will not receive ConfigMap updates.
-->
使用 ConfigMap 作爲 [subPath](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
卷的容器將不會收到 ConfigMap 更新。
{{< /note >}}

<!-- discussion -->

<!--
## Understanding ConfigMaps and Pods

The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed
in pods or provide the configurations for system components such as controllers. ConfigMap is
similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working
with strings that don't contain sensitive information. Users and system components alike can
store configuration data in ConfigMap.
-->
## 瞭解 ConfigMap 和 Pod    {#understanding-configmaps-and-pods}

ConfigMap API 資源將設定資料儲存爲鍵值對。
資料可以在 Pod 中使用，也可以用來提供系統組件（如控制器）的設定。
ConfigMap 與 [Secret](/zh-cn/docs/concepts/configuration/secret/) 類似，
但是提供的是一種處理不含敏感資訊的字符串的方法。
使用者和系統組件都可以在 ConfigMap 中儲存設定資料。

{{< note >}}
<!--
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as
representing something similar to the Linux `/etc` directory and its contents. For example,
if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each
data item in the ConfigMap is represented by an individual file in the volume.
-->
ConfigMap 應該引用屬性檔案，而不是替換它們。可以將 ConfigMap 理解爲類似於 Linux
`/etc` 目錄及其內容的東西。例如，如果你基於 ConfigMap 創建
[Kubernetes 卷](/zh-cn/docs/concepts/storage/volumes/)，則 ConfigMap
中的每個資料項都由該資料卷中的某個獨立的檔案表示。
{{< /note >}}

<!--
The ConfigMap's `data` field contains the configuration data. As shown in the example below,
this can be simple (like individual properties defined using `--from-literal`) or complex
(like configuration files or JSON blobs defined using `--from-file`).
-->
ConfigMap 的 `data` 字段包含設定資料。如下例所示，它可以簡單
（如用 `--from-literal` 的單個屬性定義）或複雜
（如用 `--from-file` 的設定檔案或 JSON blob 定義）。

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
When `kubectl` creates a ConfigMap from inputs that are not ASCII or UTF-8, the tool puts
these into the `binaryData` field of the ConfigMap, and not in `data`. Both text and binary
data sources can be combined in one ConfigMap.
-->
當 `kubectl` 從非 ASCII 或 UTF-8 編碼的輸入創建 ConfigMap 時，
該工具將這些輸入放入 ConfigMap 的 `binaryData` 字段，而不是 `data` 字段。
文本和二進制資料源都可以組合在一個 ConfigMap 中。

<!--
If you want to view the `binaryData` keys (and their values) in a ConfigMap, you can run
`kubectl get configmap -o jsonpath='{.binaryData}' <name>`.
-->
如果你想查看 ConfigMap 中的 `binaryData` 鍵（及其值），
可以運行 `kubectl get configmap -o jsonpath='{.binaryData}' <name>`。

<!--
Pods can load data from a ConfigMap that uses either `data` or `binaryData`.
-->
Pod 可以從使用 `data` 或 `binaryData` 的 ConfigMap 中加載資料。

<!--
## Optional ConfigMaps
-->
### 可選的 ConfigMap {#optional-configmaps}

<!--
You can mark a reference to a ConfigMap as _optional_ in a Pod specification.
If the ConfigMap doesn't exist, the configuration for which it provides data in the Pod
(for example: environment variable, mounted volume) will be empty.
If the ConfigMap exists, but the referenced key is non-existent the data is also empty.
-->
你可以在 Pod 規約中將對 ConfigMap 的引用標記爲**可選（optional）**。
如果 ConfigMap 不存在，那麼它在 Pod 中爲其提供資料的設定（例如：環境變量、掛載的卷）將爲空。
如果 ConfigMap 存在，但引用的鍵不存在，那麼資料也是空的。

<!--
For example, the following Pod specification marks an environment variable from a ConfigMap
as optional:
-->
例如，以下 Pod 規約將 ConfigMap 中的環境變量標記爲可選：

<!--
              optional: true # mark the variable as optional
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "env"]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: a-config
              key: akey
              optional: true # 將環境變量標記爲可選
  restartPolicy: Never
```

<!--
If you run this pod, and there is no ConfigMap named `a-config`, the output is empty.
If you run this pod, and there is a ConfigMap named `a-config` but that ConfigMap doesn't have
a key named `akey`, the output is also empty. If you do set a value for `akey` in the `a-config`
ConfigMap, this pod prints that value and then terminates.
-->
當你運行這個 Pod 並且名稱爲 `a-config` 的 ConfigMap 不存在時，輸出空值。
當你運行這個 Pod 並且名稱爲 `a-config` 的 ConfigMap 存在，
但是在 ConfigMap 中沒有名稱爲 `akey` 的鍵時，控制檯輸出也會爲空。
如果你確實在名爲 `a-config` 的 ConfigMap 中爲 `akey` 設置了鍵值，
那麼這個 Pod 會打印該值，然後終止。

<!--
You can also mark the volumes and files provided by a ConfigMap as optional. Kubernetes always
creates the mount paths for the volume, even if the referenced ConfigMap or key doesn't exist. For
example, the following Pod specification marks a volume that references a ConfigMap as optional:
-->
你也可以在 Pod 規約中將 ConfigMap 提供的卷和檔案標記爲可選。
此時 Kubernetes 將總是爲卷創建掛載路徑，即使引用的 ConfigMap 或鍵不存在。
例如，以下 Pod 規約將所引用得 ConfigMap 的卷標記爲可選：

<!--
        optional: true # mark the source ConfigMap as optional
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "ls /etc/config"]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: no-config
        optional: true # 將引用的 ConfigMap 的卷標記爲可選
  restartPolicy: Never
```

<!--
## Restrictions
-->
### 限制   {#restrictions}

<!--
- You must create the `ConfigMap` object before you reference it in a Pod
  specification. Alternatively, mark the ConfigMap reference as `optional` in the Pod spec (see
  [Optional ConfigMaps](#optional-configmaps)). If you reference a ConfigMap that doesn't exist
  and you don't mark the reference as `optional`, the Pod won't start. Similarly, references
  to keys that don't exist in the ConfigMap will also prevent the Pod from starting, unless
  you mark the key references as `optional`.
-->
- 在 Pod 規約中引用某個 `ConfigMap` 之前，必須先創建這個對象，
  或者在 Pod 規約中將 ConfigMap 標記爲 `optional`（請參閱[可選的 ConfigMaps](#optional-configmaps)）。
  如果所引用的 ConfigMap 不存在，並且沒有將應用標記爲 `optional` 則 Pod 將無法啓動。
  同樣，引用 ConfigMap 中不存在的主鍵也會令 Pod 無法啓動，除非你將 Configmap 標記爲 `optional`。

<!--
- If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered
  invalid will be skipped. The pod will be allowed to start, but the invalid names will be
  recorded in the event log (`InvalidVariableNames`). The log message lists each skipped
  key. For example:
-->
- 如果你使用 `envFrom` 來基於 ConfigMap 定義環境變量，那麼無效的鍵將被忽略。
  Pod 可以被啓動，但無效名稱將被記錄在事件日誌中（`InvalidVariableNames`）。
  日誌消息列出了每個被跳過的鍵。例如：

  ```shell
  kubectl get events
  ```

  <!--
  The output is similar to this:
  -->
  輸出與此類似：

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

<!--
- ConfigMaps reside in a specific {{< glossary_tooltip term_id="namespace" >}}.
  Pods can only refer to ConfigMaps that are in the same namespace as the Pod.
-->
- ConfigMap 位於確定的{{< glossary_tooltip term_id="namespace" text="名字空間" >}}中。
  每個 ConfigMap 只能被同一名字空間中的 Pod 引用。

<!--
- You can't use ConfigMaps for
  {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, because the
  kubelet does not support this.
-->
- 你不能將 ConfigMap 用於{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}，
  因爲 Kubernetes 不支持這種用法。

## {{% heading "cleanup" %}}

<!--
Delete the ConfigMaps and Pods that you made:
-->
刪除你創建那些的 ConfigMap 和 Pod：

<!--
# You might already have removed the next set
-->
```bash
kubectl delete configmaps/game-config configmaps/game-config-2 configmaps/game-config-3 \
               configmaps/game-config-env-file
kubectl delete pod dapi-test-pod --now

# 你可能已經刪除了下一組內容
kubectl delete configmaps/special-config configmaps/env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

<!--
Remove the `kustomization.yaml` file that you used to generate the ConfigMap:
-->
刪除用於生成 ConfigMap 的 `kustomization.yaml` 檔案：

```bash
rm kustomization.yaml
```

<!--
If you created a directory `configure-pod-container` and no longer need it, you should remove that too,
or move it into the trash can / deleted files location.
-->
如果你創建了一個目錄 `configure-pod-container` 並且不再需要它，你也應該刪除這個目錄，
或者將該目錄移動到回收站/刪除檔案的位置。

```bash
rm -r configure-pod-container
```

## {{% heading "whatsnext" %}}

<!--
* Follow a real world example of
  [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
-->
* 瀏覽[使用 ConfigMap 設定 Redis](/zh-cn/docs/tutorials/configuration/configure-redis-using-configmap/)
  真實示例。
* 參照一個[通過 ConfigMap 更新設定](/zh-cn/docs/tutorials/configuration/updating-configuration-via-a-configmap/)
  的示例.
