---
title: 配置 Pod 使用 ConfigMap
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
很多应用在其初始化或运行期间要依赖一些配置信息。
大多数时候，存在要调整配置参数所设置的数值的需求。
ConfigMap 是 Kubernetes 的一种机制，可让你将配置数据注入到应用的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 内部。

<!--
The ConfigMap concept allow you to decouple configuration artifacts from image content to
keep containerized applications portable. For example, you can download and run the same
{{< glossary_tooltip text="container image" term_id="image" >}} to spin up containers for 
the purposes of local development, system test, or running a live end-user workload.
-->
ConfigMap 概念允许你将配置清单与镜像内容分离，以保持容器化的应用程序的可移植性。
例如，你可以下载并运行相同的{{< glossary_tooltip text="容器镜像" term_id="image" >}}来启动容器，
用于本地开发、系统测试或运行实时终端用户工作负载。

<!--
This page provides a series of usage examples demonstrating how to create ConfigMaps and
configure Pods using data stored in ConfigMaps.
-->
本页提供了一系列使用示例，这些示例演示了如何创建 ConfigMap 以及配置 Pod
使用存储在 ConfigMap 中的数据。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need to have the `wget` tool installed. If you have a different tool
such as `curl`, and you do not have `wget`, you will need to adapt the
step that downloads example data.
-->
你需要安装 `wget` 工具。如果你有不同的工具，例如 `curl`，而没有 `wget`，
则需要调整下载示例数据的步骤。

<!-- steps -->

<!--
## Create a ConfigMap

You can use either `kubectl create configmap` or a ConfigMap generator in `kustomization.yaml`
to create a ConfigMap.
-->
## 创建 ConfigMap    {#create-a-configmap}

你可以使用 `kubectl create configmap` 或者在 `kustomization.yaml` 中的 ConfigMap
生成器来创建 ConfigMap。

<!--
### Create a ConfigMap using `kubectl create configmap`

Use the `kubectl create configmap` command to create ConfigMaps from
[directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files),
or [literal values](#create-configmaps-from-literal-values):
-->
### 使用 `kubectl create configmap` 创建 ConfigMap    {#create-a-configmap-using-kubectl-create-configmap}

你可以使用 `kubectl create configmap` 命令基于[目录](#create-configmaps-from-directories)、
[文件](#create-configmaps-from-files)或者[字面值](#create-configmaps-from-literal-values)来创建
ConfigMap：

<!--
```shell
kubectl create configmap <map-name> <data-source>
```
-->
```shell
kubectl create configmap <映射名称> <数据源>
```

<!--
where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the
directory, file, or literal value to draw the data from.
The name of a ConfigMap object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
其中，`<映射名称>` 是为 ConfigMap 指定的名称，`<数据源>` 是要从中提取数据的目录、
文件或者字面值。ConfigMap 对象的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
When you are creating a ConfigMap based on a file, the key in the \<data-source> defaults to
the basename of the file, and the value defaults to the file content.
-->
在你基于文件来创建 ConfigMap 时，`<数据源>` 中的键名默认取自文件的基本名，
而对应的值则默认为文件的内容。

<!--
You can use [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) or
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to retrieve information
about a ConfigMap.
-->
你可以使用 [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) 或者
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) 获取有关 ConfigMap 的信息。

<!--
#### Create a ConfigMap from a directory {#create-configmaps-from-directories}

You can use `kubectl create configmap` to create a ConfigMap from multiple files in the same
directory. When you are creating a ConfigMap based on a directory, kubectl identifies files
whose filename is a valid key in the directory and packages each of those files into the new
ConfigMap. Any directory entries except regular files are ignored (for example: subdirectories,
symlinks, devices, pipes, and more).
-->
#### 基于一个目录来创建 ConfigMap     {#create-configmaps-from-directories}

你可以使用 `kubectl create configmap` 基于同一目录中的多个文件创建 ConfigMap。
当你基于目录来创建 ConfigMap 时，kubectl 识别目录下文件名可以作为合法键名的文件，
并将这些文件打包到新的 ConfigMap 中。普通文件之外的所有目录项都会被忽略
（例如：子目录、符号链接、设备、管道等等）。

{{< note >}}
<!--
Each filename being used for ConfigMap creation must consist of only acceptable characters,
which are: letters (`A` to `Z` and `a` to `z`), digits (`0` to `9`), '-', '_', or '.'.
If you use `kubectl create configmap` with a directory where any of the file names contains
an unacceptable character, the `kubectl` command may fail.
-->
用于创建 ConfigMap 的每个文件名必须由可接受的字符组成，即：字母（`A` 到 `Z` 和
`a` 到 `z`）、数字（`0` 到 `9`）、'-'、'_' 或 '.'。
如果在一个目录中使用 `kubectl create configmap`，而其中任一文件名包含不可接受的字符，
则 `kubectl` 命令可能会失败。

<!--
The `kubectl` command does not print an error when it encounters an invalid filename.
-->
`kubectl` 命令在遇到不合法的文件名时不会打印错误。

{{< /note >}}

<!--
Create the local directory:
-->
创建本地目录：

```shell
mkdir -p configure-pod-container/configmap/
```

<!--
Now, download the sample configuration and create the ConfigMap:
-->
现在，下载示例的配置并创建 ConfigMap：

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
# 将示例文件下载到 `configure-pod-container/configmap/` 目录
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# 创建 ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

<!--
The above command packages each file, in this case, `game.properties` and `ui.properties`
in the `configure-pod-container/configmap/` directory into the game-config ConfigMap. You can
display details of the ConfigMap using the following command:
-->
以上命令将 `configure-pod-container/configmap` 目录下的所有文件，也就是
`game.properties` 和 `ui.properties` 打包到 game-config ConfigMap
中。你可以使用下面的命令显示 ConfigMap 的详细信息：

```shell
kubectl describe configmaps game-config
```

<!--
The output is similar to this:
-->
输出类似以下内容：

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
`configure-pod-container/configmap/` 目录中的 `game.properties` 和 `ui.properties`
文件出现在 ConfigMap 的 `data` 部分。

```shell
kubectl get configmaps game-config -o yaml
```

<!--
The output is similar to this:
-->
输出类似以下内容：

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
#### 基于文件创建 ConfigMap   {#create-configmaps-from-files}

你可以使用 `kubectl create configmap` 基于单个文件或多个文件创建 ConfigMap。

例如：

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
将产生以下 ConfigMap：

```shell
kubectl describe configmaps game-config-2
```

<!--
where the output is similar to this:
-->
输出类似以下内容：

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
你可以多次使用 `--from-file` 参数，从多个数据源创建 ConfigMap。

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

<!--
You can display details of the `game-config-2` ConfigMap using the following command:
-->
你可以使用以下命令显示 `game-config-2` ConfigMap 的详细信息：

```shell
kubectl describe configmaps game-config-2
```

<!--
The output is similar to this:
-->
输出类似以下内容：

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
使用 `--from-env-file` 选项基于 env 文件创建 ConfigMap，例如：

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
# Env 文件包含环境变量列表。其中适用以下语法规则:
# 这些语法规则适用：
#   Env 文件中的每一行必须为 VAR=VAL 格式。
#   以＃开头的行（即注释）将被忽略。
#   空行将被忽略。
#   引号不会被特殊处理（即它们将成为 ConfigMap 值的一部分）。

# 将示例文件下载到 `configure-pod-container/configmap/` 目录
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Env 文件 `game-env-file.properties` 如下所示
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# 此注释和上方的空行将被忽略
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

<!--
would produce a ConfigMap. View the ConfigMap:
-->
将产生以下 ConfigMap。查看 ConfigMap：

```shell
kubectl get configmap game-config-env-file -o yaml
```

<!--
the output is similar to:
-->
输出类似以下内容：

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
从 Kubernetes 1.23 版本开始，`kubectl` 支持多次指定 `--from-env-file` 参数来从多个数据源创建
ConfigMap。

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
将产生以下 ConfigMap：

```shell
kubectl get configmap config-multi-env-files -o yaml
```

<!--
where the output is similar to this:
-->
输出类似以下内容：

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
#### 定义从文件创建 ConfigMap 时要使用的键    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在使用 `--from-file` 参数时，你可以定义在 ConfigMap 的 `data` 部分出现键名，
而不是按默认行为使用文件名：

<!--
```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```
-->
```shell
kubectl create configmap game-config-3 --from-file=<我的键名>=<文件路径>
```

<!--
where `<my-key-name>` is the key you want to use in the ConfigMap and `<path-to-file>` is the
location of the data source file you want the key to represent.
-->
`<我的键名>` 是你要在 ConfigMap 中使用的键名，`<文件路径>` 是你想要键所表示的数据源文件的位置。

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
将产生以下 ConfigMap：

```shell
kubectl get configmaps game-config-3 -o yaml
```

<!--
where the output is similar to this:
-->
输出类似以下内容：

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
#### 根据字面值创建 ConfigMap         {#create-configmaps-from-literal-values}

你可以将 `kubectl create configmap` 与 `--from-literal` 参数一起使用，
通过命令行定义文字值：

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

<!--
You can pass in multiple key-value pairs. Each pair provided on the command line is represented
as a separate entry in the `data` section of the ConfigMap.
-->
你可以传入多个键值对。命令行中提供的每对键值在 ConfigMap 的 `data` 部分中均表示为单独的条目。

```shell
kubectl get configmaps special-config -o yaml
```

<!--
The output is similar to this:
-->
输出类似以下内容：

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
### 基于生成器创建 ConfigMap    {#create-a-configmap-from-generator}

你还可以基于生成器（Generators）创建 ConfigMap，然后将其应用于集群的 API 服务器上创建对象。
生成器应在目录内的 `kustomization.yaml` 中指定。

<!--
#### Generate ConfigMaps from files

For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
-->
#### 基于文件生成 ConfigMap    {#generate-configmaps-from-files}

例如，要基于 `configure-pod-container/configmap/game.properties`
文件生成一个 ConfigMap：

<!--
# Create a kustomization.yaml file with ConfigMapGenerator
-->
```shell
# 创建包含 ConfigMapGenerator 的 kustomization.yaml 文件
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
应用（Apply）kustomization 目录创建 ConfigMap 对象：

```shell
kubectl apply -k .
```

```
configmap/game-config-4-m9dm2f92bt created
```

<!--
You can check that the ConfigMap was created like this:
-->
你可以像这样检查 ConfigMap 已经被创建：

```shell
kubectl get configmap
```
```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s
```

<!-- and also: -->
也可以这样：

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
请注意，生成的 ConfigMap 名称具有通过对内容进行散列而附加的后缀，
这样可以确保每次修改内容时都会生成新的 ConfigMap。

<!--
#### Define the key to use when generating a ConfigMap from a file

You can define a key other than the file name to use in the ConfigMap generator.
For example, to generate a ConfigMap from files `configure-pod-container/configmap/game.properties`
with the key `game-special-key`
-->
#### 定义从文件生成 ConfigMap 时要使用的键    {#define-the-key-to-use-when-generating-a-configmap-from-a-file}

在 ConfigMap 生成器中，你可以定义一个非文件名的键名。
例如，从 `configure-pod-container/configmap/game.properties` 文件生成 ConfigMap，
但使用 `game-special-key` 作为键名：

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
# 创建包含 ConfigMapGenerator 的 kustomization.yaml 文件
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
应用 Kustomization 目录创建 ConfigMap 对象。

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
#### 基于字面值生成 ConfigMap    {#generate-configmaps-from-literals}

此示例向你展示如何使用 Kustomize 和 kubectl，基于两个字面键/值对
`special.type=charm` 和 `special.how=very` 创建一个 `ConfigMap`。
为了实现这一点，你可以配置 `ConfigMap` 生成器。
创建（或替换）`kustomization.yaml`，使其具有以下内容。

<!--
# kustomization.yaml contents for creating a ConfigMap from literals
-->
```yaml
---
# 基于字面创建 ConfigMap 的 kustomization.yaml 内容
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
应用 Kustomization 目录创建 ConfigMap 对象。

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
## 临时清理    {#interim-cleanup}

在继续之前，清理你创建的一些 ConfigMap：

```bash
kubectl delete configmap special-config
kubectl delete configmap env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

<!--
Now that you have learned to define ConfigMaps, you can move on to the next
section, and learn how to use these objects with Pods.
-->
现在你已经学会了定义 ConfigMap，你可以继续下一节，学习如何将这些对象与 Pod 一起使用。

---

<!--
## Define container environment variables using ConfigMap data

### Define a container environment variable with data from a single ConfigMap
-->
## 使用 ConfigMap 数据定义容器环境变量    {#define-container-environment-variables-using-configmap-data}

### 使用单个 ConfigMap 中的数据定义容器环境变量    {#define-a-container-environment-variable-with-data-from-a-single-configmap}

<!--
1. Define an environment variable as a key-value pair in a ConfigMap:
-->
1. 在 ConfigMap 中将环境变量定义为键值对：

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

<!--
2. Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY`
   environment variable in the Pod specification.
-->
2. 将 ConfigMap 中定义的 `special.how` 赋值给 Pod 规约中的 `SPECIAL_LEVEL_KEY` 环境变量。

   {{% code_sample file="pods/pod-single-configmap-env-variable.yaml" %}}

   <!--
   Create the Pod:
   -->
   创建 Pod：

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   <!--
   Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`.
   -->
   现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL_KEY=very`。

<!--
### Define container environment variables with data from multiple ConfigMaps
-->
### 使用来自多个 ConfigMap 的数据定义容器环境变量    {#define-container-environment-variables-with-data-from-multiple-configmaps}

<!--
As with the previous example, create the ConfigMaps first.
Here is the manifest you will use:
-->
与前面的示例一样，首先创建 ConfigMap。
这是你将使用的清单：

{{% code_sample file="configmap/configmaps.yaml" %}}

<!--
* Create the ConfigMap:
-->
* 创建 ConfigMap：

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

<!--
* Define the environment variables in the Pod specification.
-->
* 在 Pod 规约中定义环境变量。

  {{% code_sample file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  <!--
  Create the Pod:
  -->
  创建 Pod：

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`.
  -->
  现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL_KEY=very` 和 `LOG_LEVEL=INFO`。

  <!--
  Once you're happy to move on, delete that Pod:
  -->
  一旦你乐意继续前进，删除该 Pod：

  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

<!--
## Configure all key-value pairs in a ConfigMap as container environment variables
-->
## 将 ConfigMap 中的所有键值对配置为容器环境变量    {#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables}

<!--
* Create a ConfigMap containing multiple key-value pairs.
-->
* 创建一个包含多个键值对的 ConfigMap。

  {{% code_sample file="configmap/configmap-multikeys.yaml" %}}

  <!--
  Create the ConfigMap:
  -->
  创建 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

<!--
* Use `envFrom` to define all of the ConfigMap's data as container environment variables. The
  key from the ConfigMap becomes the environment variable name in the Pod.
-->
* 使用 `envFrom` 将所有 ConfigMap 的数据定义为容器环境变量，ConfigMap
  中的键成为 Pod 中的环境变量名称。

  {{% code_sample file="pods/pod-configmap-envFrom.yaml" %}}

  <!--
  Create the Pod:
  -->
  创建 Pod：

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  <!--
  Now, the Pod's output includes environment variables `SPECIAL_LEVEL=very` and
  `SPECIAL_TYPE=charm`.

  Once you're happy to move on, delete that Pod:
  -->
  现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL=very` 和 `SPECIAL_TYPE=charm`。

  一旦你乐意继续前进，删除该 Pod：

  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

<!--
## Use ConfigMap-defined environment variables in Pod commands
-->
## 在 Pod 命令中使用 ConfigMap 定义的环境变量    {#use-configmap-defined-environment-variables-in-pod-commands}

<!--
You can use ConfigMap-defined environment variables in the `command` and `args` of a container
using the `$(VAR_NAME)` Kubernetes substitution syntax.
-->
你可以使用 `$(VAR_NAME)` Kubernetes 替换语法在容器的 `command` 和 `args`
属性中使用 ConfigMap 定义的环境变量。

<!--
For example, the following Pod manifest:

-->
例如，以下 Pod 清单：

{{% code_sample file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

<!--
Create that Pod, by running:
-->
通过运行下面命令创建该 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

<!--
That pod produces the following output from the `test-container` container:
-->
此 Pod 在 `test-container` 容器中产生以下输出：

```shell
kubectl logs dapi-test-pod
```

```
very charm
```

<!--
Once you're happy to move on, delete that Pod:
-->
一旦你乐意继续前进，删除该 Pod：

```shell
kubectl delete pod dapi-test-pod --now
```

<!--
## Add ConfigMap data to a Volume

As explained in [Create ConfigMaps from files](#create-configmaps-from-files), when you create
a ConfigMap using `--from-file`, the filename becomes a key stored in the `data` section of
the ConfigMap. The file contents become the key's value.
-->
## 将 ConfigMap 数据添加到一个卷中    {#add-configmap-data-to-a-volume}

如基于文件创建 [ConfigMap](#create-configmaps-from-files) 中所述，当你使用
`--from-file` 创建 ConfigMap 时，文件名成为存储在 ConfigMap 的 `data` 部分中的键，
文件内容成为键对应的值。

<!--
The examples in this section refer to a ConfigMap named `special-config`:
-->
本节中的示例引用了一个名为 `special-config` 的 ConfigMap：

{{% code_sample file="configmap/configmap-multikeys.yaml" %}}

<!--
Create the ConfigMap:
-->
创建 ConfigMap：

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
### 使用存储在 ConfigMap 中的数据填充卷    {#populate-a-volume-with-data-stored-in-a-configmap}

在 Pod 规约的 `volumes` 部分下添加 ConfigMap 名称。
这会将 ConfigMap 数据添加到 `volumeMounts.mountPath` 所指定的目录
（在本例中为 `/etc/config`）。
`command` 部分列出了名称与 ConfigMap 中的键匹配的目录文件。

{{% code_sample file="pods/pod-configmap-volume.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

<!--
When the pod runs, the command `ls /etc/config/` produces the output below:
-->
Pod 运行时，命令 `ls /etc/config/` 产生下面的输出：

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

<!--
Text data is exposed as files using the UTF-8 character encoding. To use some other
character encoding, use `binaryData`
(see [ConfigMap object](/docs/concepts/configuration/configmap/#configmap-object) for more details).
-->
文本数据会展现为 UTF-8 字符编码的文件。如果使用其他字符编码，
可以使用 `binaryData`（详情参阅 [ConfigMap 对象](/zh-cn/docs/concepts/configuration/configmap/#configmap-object)）。

{{< note >}}

<!--
If there are any files in the `/etc/config` directory of that container image, the volume
mount will make those files from the image inaccessible.
-->
如果该容器镜像的 `/etc/config`
目录中有一些文件，卷挂载将使该镜像中的这些文件无法访问。
{{< /note >}}

<!--
Once you're happy to move on, delete that Pod:
-->
一旦你乐意继续前进，删除该 Pod：

```shell
kubectl delete pod dapi-test-pod --now
```

<!--
### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.
-->
### 将 ConfigMap 数据添加到卷中的特定路径    {#add-configmap-data-to-a-specific-path-in-the-volume}

使用 `path` 字段为特定的 ConfigMap 项目指定预期的文件路径。
在这里，ConfigMap 中键 `SPECIAL_LEVEL` 的内容将挂载在 `config-volume`
卷中 `/etc/config/keys` 文件中。

{{% code_sample file="pods/pod-configmap-volume-specific-key.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

<!--
When the pod runs, the command `cat /etc/config/keys` produces the output below:
-->
当 Pod 运行时，命令 `cat /etc/config/keys` 产生以下输出：

```
very
```

{{< caution >}}
<!--
Like before, all previous files in the `/etc/config/` directory will be deleted.
-->
如前，`/etc/config/` 目录中所有先前的文件都将被删除。
{{< /caution >}}

<!--
Delete that Pod:
-->
删除该 Pod：

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
你可以将密钥投射到特定路径，语法请参阅
[Secret](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths)
指南中的相应部分。
你可以设置密钥的 POSIX 权限，语法请参阅
[Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys)
指南中的相应部分。

### 映射键到指定路径并设置文件访问权限    {#project-keys-to-specific-paths-and-file-permissions}

你可以将指定键名投射到特定目录，也可以逐个文件地设定访问权限。
[Secret](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
指南中为这一语法提供了解释。

<!--
### Optional references

A ConfigMap reference may be marked _optional_. If the ConfigMap is non-existent, the mounted
volume will be empty. If the ConfigMap exists, but the referenced key is non-existent, the path
will be absent beneath the mount point. See [Optional ConfigMaps](#optional-configmaps) for more
details.
-->
### 可选引用    {#optional-references}

ConfigMap 引用可以被标记为**可选**。
如果 ConfigMap 不存在，则挂载的卷将为空。
如果 ConfigMap 存在，但引用的键不存在，则挂载点下的路径将不存在。
有关更多信息，请参阅[可选 ConfigMap](#optional-configmaps) 细节。

<!--
### Mounted ConfigMaps are updated automatically

When a mounted ConfigMap is updated, the projected content is eventually updated too.
This applies in the case where an optionally referenced ConfigMap comes into
existence after a pod has started.
-->
### 挂载的 ConfigMap 会被自动更新    {#mounted-configMaps-are-updated-automatically}

当已挂载的 ConfigMap 被更新时，所投射的内容最终也会被更新。
这适用于 Pod 启动后可选引用的 ConfigMap 重新出现的情况。

<!--
Kubelet checks whether the mounted ConfigMap is fresh on every periodic sync. However,
it uses its local TTL-based cache for getting the current value of the ConfigMap. As a
result, the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the pod can be as long as kubelet sync period (1
minute by default) + TTL of ConfigMaps cache (1 minute by default) in kubelet. You
can trigger an immediate refresh by updating one of the pod's annotations.
-->
Kubelet 在每次定期同步时都会检查所挂载的 ConfigMap 是否是最新的。
然而，它使用其基于 TTL 机制的本地缓存来获取 ConfigMap 的当前值。
因此，从 ConfigMap 更新到新键映射到 Pod 的总延迟可能与 kubelet
同步周期（默认为 1 分钟）+ kubelet 中 ConfigMap 缓存的 TTL（默认为 1 分钟）一样长。
你可以通过更新 Pod 的一个注解来触发立即刷新。

{{< note >}}
<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath)
volume will not receive ConfigMap updates.
-->
使用 ConfigMap 作为 [subPath](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
卷的容器将不会收到 ConfigMap 更新。
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
## 了解 ConfigMap 和 Pod    {#understanding-configmaps-and-pods}

ConfigMap API 资源将配置数据存储为键值对。
数据可以在 Pod 中使用，也可以用来提供系统组件（如控制器）的配置。
ConfigMap 与 [Secret](/zh-cn/docs/concepts/configuration/secret/) 类似，
但是提供的是一种处理不含敏感信息的字符串的方法。
用户和系统组件都可以在 ConfigMap 中存储配置数据。

{{< note >}}
<!--
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as
representing something similar to the Linux `/etc` directory and its contents. For example,
if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each
data item in the ConfigMap is represented by an individual file in the volume.
-->
ConfigMap 应该引用属性文件，而不是替换它们。可以将 ConfigMap 理解为类似于 Linux
`/etc` 目录及其内容的东西。例如，如果你基于 ConfigMap 创建
[Kubernetes 卷](/zh-cn/docs/concepts/storage/volumes/)，则 ConfigMap
中的每个数据项都由该数据卷中的某个独立的文件表示。
{{< /note >}}

<!--
The ConfigMap's `data` field contains the configuration data. As shown in the example below,
this can be simple (like individual properties defined using `--from-literal`) or complex
(like configuration files or JSON blobs defined using `--from-file`).
-->
ConfigMap 的 `data` 字段包含配置数据。如下例所示，它可以简单
（如用 `--from-literal` 的单个属性定义）或复杂
（如用 `--from-file` 的配置文件或 JSON blob 定义）。

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
  # 使用 --from-literal 定义的简单属性
  example.property.1: hello
  example.property.2: world
  # 使用 --from-file 定义复杂属性的例子
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
当 `kubectl` 从非 ASCII 或 UTF-8 编码的输入创建 ConfigMap 时，
该工具将这些输入放入 ConfigMap 的 `binaryData` 字段，而不是 `data` 字段。
文本和二进制数据源都可以组合在一个 ConfigMap 中。

<!--
If you want to view the `binaryData` keys (and their values) in a ConfigMap, you can run
`kubectl get configmap -o jsonpath='{.binaryData}' <name>`.
-->
如果你想查看 ConfigMap 中的 `binaryData` 键（及其值），
可以运行 `kubectl get configmap -o jsonpath='{.binaryData}' <name>`。

<!--
Pods can load data from a ConfigMap that uses either `data` or `binaryData`.
-->
Pod 可以从使用 `data` 或 `binaryData` 的 ConfigMap 中加载数据。

<!--
## Optional ConfigMaps
-->
### 可选的 ConfigMap {#optional-configmaps}

<!--
You can mark a reference to a ConfigMap as _optional_ in a Pod specification.
If the ConfigMap doesn't exist, the configuration for which it provides data in the Pod
(for example: environment variable, mounted volume) will be empty.
If the ConfigMap exists, but the referenced key is non-existent the data is also empty.
-->
你可以在 Pod 规约中将对 ConfigMap 的引用标记为**可选（optional）**。
如果 ConfigMap 不存在，那么它在 Pod 中为其提供数据的配置（例如：环境变量、挂载的卷）将为空。
如果 ConfigMap 存在，但引用的键不存在，那么数据也是空的。

<!--
For example, the following Pod specification marks an environment variable from a ConfigMap
as optional:
-->
例如，以下 Pod 规约将 ConfigMap 中的环境变量标记为可选：

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
              optional: true # 将环境变量标记为可选
  restartPolicy: Never
```

<!--
If you run this pod, and there is no ConfigMap named `a-config`, the output is empty.
If you run this pod, and there is a ConfigMap named `a-config` but that ConfigMap doesn't have
a key named `akey`, the output is also empty. If you do set a value for `akey` in the `a-config`
ConfigMap, this pod prints that value and then terminates.
-->
当你运行这个 Pod 并且名称为 `a-config` 的 ConfigMap 不存在时，输出空值。
当你运行这个 Pod 并且名称为 `a-config` 的 ConfigMap 存在，
但是在 ConfigMap 中没有名称为 `akey` 的键时，控制台输出也会为空。
如果你确实在名为 `a-config` 的 ConfigMap 中为 `akey` 设置了键值，
那么这个 Pod 会打印该值，然后终止。

<!--
You can also mark the volumes and files provided by a ConfigMap as optional. Kubernetes always
creates the mount paths for the volume, even if the referenced ConfigMap or key doesn't exist. For
example, the following Pod specification marks a volume that references a ConfigMap as optional:
-->
你也可以在 Pod 规约中将 ConfigMap 提供的卷和文件标记为可选。
此时 Kubernetes 将总是为卷创建挂载路径，即使引用的 ConfigMap 或键不存在。
例如，以下 Pod 规约将所引用得 ConfigMap 的卷标记为可选：

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
        optional: true # 将引用的 ConfigMap 的卷标记为可选
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
- 在 Pod 规约中引用某个 `ConfigMap` 之前，必须先创建这个对象，
  或者在 Pod 规约中将 ConfigMap 标记为 `optional`（请参阅[可选的 ConfigMaps](#optional-configmaps)）。
  如果所引用的 ConfigMap 不存在，并且没有将应用标记为 `optional` 则 Pod 将无法启动。
  同样，引用 ConfigMap 中不存在的主键也会令 Pod 无法启动，除非你将 Configmap 标记为 `optional`。

<!--
- If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered
  invalid will be skipped. The pod will be allowed to start, but the invalid names will be
  recorded in the event log (`InvalidVariableNames`). The log message lists each skipped
  key. For example:
-->
- 如果你使用 `envFrom` 来基于 ConfigMap 定义环境变量，那么无效的键将被忽略。
  Pod 可以被启动，但无效名称将被记录在事件日志中（`InvalidVariableNames`）。
  日志消息列出了每个被跳过的键。例如：

  ```shell
  kubectl get events
  ```

  <!--
  The output is similar to this:
  -->
  输出与此类似：

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

<!--
- ConfigMaps reside in a specific {{< glossary_tooltip term_id="namespace" >}}.
  Pods can only refer to ConfigMaps that are in the same namespace as the Pod.
-->
- ConfigMap 位于确定的{{< glossary_tooltip term_id="namespace" text="名字空间" >}}中。
  每个 ConfigMap 只能被同一名字空间中的 Pod 引用。

<!--
- You can't use ConfigMaps for
  {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, because the
  kubelet does not support this.
-->
- 你不能将 ConfigMap 用于{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}，
  因为 Kubernetes 不支持这种用法。

## {{% heading "cleanup" %}}

<!--
Delete the ConfigMaps and Pods that you made:
-->
删除你创建那些的 ConfigMap 和 Pod：

<!--
# You might already have removed the next set
-->
```bash
kubectl delete configmaps/game-config configmaps/game-config-2 configmaps/game-config-3 \
               configmaps/game-config-env-file
kubectl delete pod dapi-test-pod --now

# 你可能已经删除了下一组内容
kubectl delete configmaps/special-config configmaps/env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

<!--
If you created a directory `configure-pod-container` and no longer need it, you should remove that too,
or move it into the trash can / deleted files location.
-->
如果你创建了一个目录 `configure-pod-container` 并且不再需要它，你也应该删除这个目录，
或者将该目录移动到回收站/删除文件的位置。

## {{% heading "whatsnext" %}}

<!--
* Follow a real world example of
  [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
-->
* 浏览[使用 ConfigMap 配置 Redis](/zh-cn/docs/tutorials/configuration/configure-redis-using-configmap/)
  真实示例。
* 参照一个[通过 ConfigMap 更新配置](/zh-cn/docs/tutorials/configuration/updating-configuration-via-a-configmap/)
  的示例.
