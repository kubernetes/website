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
ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable. This page provides a series of usage examples demonstrating how to create ConfigMaps and configure Pods using data stored in ConfigMaps. 
-->
ConfigMap 允许你将配置文件与镜像文件分离，以使容器化的应用程序具有可移植性。
本页提供了一系列使用示例，这些示例演示了如何创建 ConfigMap 以及配置 Pod
使用存储在 ConfigMap 中的数据。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->
<!--
## Create a ConfigMap

You can use either `kubectl create configmap` or a ConfigMap generator in `kustomization.yaml` to create a ConfigMap. Note that `kubectl` starts to support `kustomization.yaml` since 1.14.
-->
## 创建 ConfigMap

你可以使用 `kubectl create configmap` 或者在 `kustomization.yaml` 中的 ConfigMap 生成器
来创建 ConfigMap。注意，`kubectl` 从 1.14 版本开始支持 `kustomization.yaml`。

<!--
### Create a ConfigMap Using kubectl create configmap

Use the `kubectl create configmap` command to create configmaps from [directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files), or [literal values](#create-configmaps-from-literal-values):
-->
### 使用 kubectl create configmap 创建 ConfigMap

你可以使用 `kubectl create configmap` 命令基于
[目录](#create-configmaps-from-directories)、[文件](#create-configmaps-from-files) 
或者[字面值](#create-configmaps-from-literal-values)来创建 ConfigMap：

```shell
kubectl create configmap <map-name> <data-source>
```

<!--
where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the directory, file, or literal value to draw the data from.
The name of a ConfigMap object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
其中，\<map-name\> 是要设置的 ConfigMap 名称，\<data-source\> 是要从中提取数据的目录、
文件或者字面值。
ConfigMap 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

<!--
When you are creating a ConfigMap based on a file, the key in the \<data-source> defaults to the basename of the file, and the value defaults to the file content.
-->
在你基于文件来创建 ConfigMap 时，\<data-source\> 中的键名默认取自
文件的基本名，而对应的值则默认为文件的内容。

<!--
You can use [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) or
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to retrieve information
about a ConfigMap.
-->
你可以使用[`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) 或者
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) 获取有关 ConfigMap 的信息。

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
#### 基于目录创建 ConfigMap     {#create-configmaps-from-directories}
你可以使用 `kubectl create configmap` 基于同一目录中的多个文件创建 ConfigMap。
当你基于目录来创建 ConfigMap 时，kubectl 识别目录下基本名可以作为合法键名的
文件，并将这些文件打包到新的 ConfigMap 中。普通文件之外的所有目录项都会被
忽略（例如，子目录、符号链接、设备、管道等等）。

例如：

```shell
# 创建本地目录
mkdir -p configure-pod-container/configmap/

# 将实例文件下载到 `configure-pod-container/configmap/` 目录
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# 创建 configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

<!--
The above command packages each file, in this case, `game.properties` and
`ui.properties` in the `configure-pod-container/configmap/` directory into the
game-config ConfigMap. You can display details of the ConfigMap using the
following command:
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
The `game.properties` and `ui.properties` files in the `configure-pod-container/configmap/` directory are represented in the `data` section of the ConfigMap.
-->
`configure-pod-container/configmap/` 目录中的 `game.properties` 和 `ui.properties`
文件出现在 ConfigMap 的 `data` 部分。

```shell
kubectl get configmaps game-config -o yaml
```

<!--
The output is similar to this:
-->
输出类似以下内容:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  selfLink: /api/v1/namespaces/default/configmaps/game-config
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
#### 基于文件创建 ConfigMap   {#create-configmaps-from-files}

你可以使用 `kubectl create configmap` 基于单个文件或多个文件创建 ConfigMap。

例如：

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
将产生以下 ConfigMap:

```shell
kubectl describe configmaps game-config-2
```

<!--
where the output is similar to this:
-->
输出类似以下内容:

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
你可以多次使用 `--from-file` 参数，从多个数据源创建 ConfigMap。

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

<!--
Describe the above `game-config-2` configmap created
-->
描述上面创建的 `game-config-2` configmap

```shell
kubectl describe configmaps game-config-2
```

<!--
The output is similar to this:
-->
输出类似以下内容:

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
使用 `--from-env-file` 选项从环境文件创建 ConfigMap，例如：

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

# The env-file `game-env-file.properties` looks like below
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"
-->

Env 文件包含环境变量列表。
其中适用以下语法规则:

- Env 文件中的每一行必须为 VAR=VAL 格式。
- 以＃开头的行（即注释）将被忽略。
- 空行将被忽略。
- 引号不会被特殊处理（即它们将成为 ConfigMap 值的一部分）。

将示例文件下载到 `configure-pod-container/configmap/` 目录

```shell
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
```

env 文件 `game-env-file.properties` 如下所示：

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
将产生以下 ConfigMap：

```shell
kubectl get configmap game-config-env-file -o yaml
```

<!--
where the output is similar to this:
-->
输出类似以下内容：

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
When passing `--from-env-file` multiple times to create a ConfigMap from multiple data sources, only the last env-file is used:
-->
{{< caution >}}
当多次使用 `--from-env-file` 来从多个数据源创建 ConfigMap 时，仅仅最后一个 env 文件有效。
{{< /caution >}}

<!--
The behavior of passing `--from-env-file` multiple times is demonstrated by:
-->
下面是一个多次使用 `--from-env-file` 参数的示例：

<!--
```shell
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://k8s.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Create the configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```
-->
```shell
# 将样本文件下载到 `configure-pod-container/configmap/` 目录
wget https://k8s.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# 创建 configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
将产生以下 ConfigMap:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

<!--
where the output is similar to this:
-->
输出类似以下内容:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  selfLink: /api/v1/namespaces/default/configmaps/config-multi-env-files
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  color: purple
  how: fairlyNice
  textmode: "true"
```

<!--
#### Define the key to use when creating a ConfigMap from a file

You can define a key other than the file name to use in the `data` section of your ConfigMap when using the `--from-file` argument:
-->
#### 定义从文件创建 ConfigMap 时要使用的键

在使用 `--from-file` 参数时，你可以定义在 ConfigMap 的 `data` 部分出现键名，
而不是按默认行为使用文件名：

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

<!--
where <my-key-name> is the key you want to use in the ConfigMap and `<path-to-file>` is the location of the data source file you want the key to represent.
-->
`<my-key-name>` 是你要在 ConfigMap 中使用的键名，`<path-to-file>` 是你想要键表示数据源文件的位置。

<!-- For example: -->
例如:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
将产生以下 ConfigMap:

```
kubectl get configmaps game-config-3 -o yaml
```

<!-- where the output is similar to this: -->
输出类似以下内容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  selfLink: /api/v1/namespaces/default/configmaps/game-config-3
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
#### 根据字面值创建 ConfigMap         {#create-configmaps-from-literal-values}
你可以将 `kubectl create configmap` 与 `--from-literal` 参数一起使用，从命令行定义文字值:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

<!--
You can pass in multiple key-value pairs. Each pair provided on the command line is represented as a separate entry in the `data` section of the ConfigMap.
-->
你可以传入多个键值对。命令行中提供的每对键值在 ConfigMap 的 `data` 部分中均表示为单独的条目。

```shell
kubectl get configmaps special-config -o yaml
```

<!--
The output is similar to this:
-->
输出类似以下内容:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  selfLink: /api/v1/namespaces/default/configmaps/special-config
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
### 基于生成器创建 ConfigMap

自 1.14 开始，`kubectl` 开始支持 `kustomization.yaml`。
你还可以基于生成器创建 ConfigMap，然后将其应用于 API 服务器上创建对象。
生成器应在目录内的 `kustomization.yaml` 中指定。

<!--
#### Generate ConfigMaps from files

For example, to generate a ConfigMap from files `configure-pod-container/configmap/kubectl/game.properties`
-->
#### 基于文件生成 ConfigMap

例如，要从 `configure-pod-container/configmap/kubectl/game.properties` 文件生成一个 ConfigMap：

```shell
# 创建包含 ConfigMapGenerator 的 kustomization.yaml 文件
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/kubectl/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
使用 kustomization 目录创建 ConfigMap 对象：

```shell
kubectl apply -k .
```
```
configmap/game-config-4-m9dm2f92bt created
```

<!--
You can check that the ConfigMap was created like this:
-->
你可以检查 ConfigMap 是这样创建的:

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
请注意，生成的 ConfigMap 名称具有通过对内容进行散列而附加的后缀，
这样可以确保每次修改内容时都会生成新的 ConfigMap。

<!--
#### Define the key to use when generating a ConfigMap from a file

You can define a key other than the file name to use in the ConfigMap generator.
For example, to generate a ConfigMap from files `configure-pod-container/configmap/kubectl/game.properties`
with the key `game-special-key`
-->
#### 定义从文件生成 ConfigMap 时要使用的键

在 ConfigMap 生成器，你可以定义一个非文件名的键名。
例如，从 `configure-pod-container/configmap/game.properties` 文件生成 ConfigMap，
但使用 `game-special-key` 作为键名：

```shell
# 创建包含 ConfigMapGenerator 的 kustomization.yaml 文件
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/kubectl/game.properties
EOF
```

<!--
Apply the kustomization directory to create the ConfigMap object.
-->
使用 Kustomization 目录创建 ConfigMap 对象。

```shell
kubectl apply -k .
```
```
configmap/game-config-5-m67dt67794 created
```

<!--
#### Generate ConfigMaps from Literals

To generate a ConfigMap from literals `special.type=charm` and `special.how=very`,
you can specify the ConfigMap generator in `kusotmization.yaml` as
-->
#### 从字面值生成 ConfigMap

要基于字符串 `special.type=charm` 和 `special.how=very` 生成 ConfigMap，
可以在 `kusotmization.yaml` 中配置 ConfigMap 生成器：

```shell
# 创建带有 ConfigMapGenerator 的 kustomization.yaml 文件
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
应用 Kustomization 目录创建 ConfigMap 对象。

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
## 使用 ConfigMap 数据定义容器环境变量

### 使用单个 ConfigMap 中的数据定义容器环境变量

<!--
1.  Define an environment variable as a key-value pair in a ConfigMap:
-->
1. 在 ConfigMap 中将环境变量定义为键值对:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

<!--
2.  Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY` environment variable in the Pod specification.
-->
2. 将 ConfigMap 中定义的 `special.how` 值分配给 Pod 规范中的 `SPECIAL_LEVEL_KEY` 环境变量。

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   <!-- Create the Pod: -->
   创建 Pod:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   <!-- Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`. -->
   现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL_KEY=very`。

<!--
### Define container environment variables with data from multiple ConfigMaps
-->
### 使用来自多个 ConfigMap 的数据定义容器环境变量

<!-- * As with the previous example, create the ConfigMaps first. -->
* 与前面的示例一样，首先创建 ConfigMap。

  {{< codenew file="configmap/configmaps.yaml" >}}

  <!-- Create the ConfigMap: -->
  创建 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

<!--
* Define the environment variables in the Pod specification.
-->
* 在 Pod 规范中定义环境变量。

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  <!-- Create the Pod: -->
  创建 Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  <!-- Now, the Pod's output includes environment variables `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`. -->
  现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL_KEY=very` 和 `LOG_LEVEL=INFO`。

<!--
## Configure all key-value pairs in a ConfigMap as container environment variables
-->
## 将 ConfigMap 中的所有键值对配置为容器环境变量

<!--
This functionality is available in Kubernetes v1.6 and later.
-->
{{< note >}}
Kubernetes v1.6 和更高版本支持此功能。
{{< /note >}}

<!--
* Create a ConfigMap containing multiple key-value pairs.
-->
* 创建一个包含多个键值对的 ConfigMap。

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  <!-- Create the ConfigMap: -->
  创建 ConfigMap:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

<!--
* Use `envFrom` to define all of the ConfigMap's data as container environment variables. The key from the ConfigMap becomes the environment variable name in the Pod.
-->
* 使用 `envFrom` 将所有 ConfigMap 的数据定义为容器环境变量，ConfigMap 中的键成为 Pod 中的环境变量名称。

  {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

  <!-- Create the Pod: -->
  创建 Pod:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```

  <!-- Now, the Pod's output includes environment variables `SPECIAL_LEVEL=very` and `SPECIAL_TYPE=charm`.  -->
  现在，Pod 的输出包含环境变量 `SPECIAL_LEVEL=very` 和 `SPECIAL_TYPE=charm`。

<!--
## Use ConfigMap-defined environment variables in Pod commands
-->
## 在 Pod 命令中使用 ConfigMap 定义的环境变量

<!--
You can use ConfigMap-defined environment variables in the `command` and `args` of a container using the `$(VAR_NAME)` Kubernetes substitution syntax.
-->
你可以使用 `$(VAR_NAME)` Kubernetes 替换语法在容器的 `command` 和 `args` 部分中使用 ConfigMap 定义的环境变量。

<!--
For example, the following Pod specification
-->
例如，以下 Pod 规范

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

<!--
created by running
-->
通过运行下面命令创建 Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

<!--
produces the following output in the `test-container` container:
-->
在 `test-container` 容器中产生以下输出:

```
very charm
```

<!--
## Add ConfigMap data to a Volume

As explained in [Create ConfigMaps from files](#create-configmaps-from-files), when you create a ConfigMap using ``--from-file``, the filename becomes a key stored in the `data` section of the ConfigMap. The file contents become the key's value.
-->
## 将 ConfigMap 数据添加到一个卷中

如基于文件创建 [ConfigMap](#create-configmaps-from-files) 中所述，当你使用 
`--from-file` 创建 ConfigMap 时，文件名成为存储在 ConfigMap 的 `data` 部分中的键，
文件内容成为键对应的值。

<!--
The examples in this section refer to a ConfigMap named special-config, shown below.
-->
本节中的示例引用了一个名为 special-config 的 ConfigMap，如下所示：

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

<!--
Create the ConfigMap:
-->
创建 ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

<!--
### Populate a Volume with data stored in a ConfigMap

Add the ConfigMap name under the `volumes` section of the Pod specification.
This adds the ConfigMap data to the directory specified as `volumeMounts.mountPath` (in this case, `/etc/config`).
The `command` section references the `special.level` item stored in the ConfigMap.
-->
### 使用存储在 ConfigMap 中的数据填充数据卷

在 Pod 规约的 `volumes` 部分下添加 ConfigMap 名称。
这会将 ConfigMap 数据添加到指定为 `volumeMounts.mountPath` 的目录（在本例中为 `/etc/config`）。
`command` 部分引用存储在 ConfigMap 中的 `special.level`。

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

<!-- Create the Pod: -->
创建 Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

<!--
When the pod runs, the command `ls /etc/config/` produces the output below:
-->
Pod 运行时，命令 `ls /etc/config/` 产生下面的输出：

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```
<!--
If there are some files in the `/etc/config/` directory, they will be deleted.
-->
{{< caution >}}
如果在 `/etc/config/` 目录中有一些文件，它们将被删除。
{{< /caution >}}

<!--
Text data is exposed as files using the UTF-8 character encoding. To use some other character encoding, use binaryData.
-->
{{< note >}}
文本数据会使用 UTF-8 字符编码的形式展现为文件。如果使用其他字符编码，
可以使用 `binaryData`。
{{< /note >}}

<!--
### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.
-->
### 将 ConfigMap 数据添加到数据卷中的特定路径

使用 `path` 字段为特定的 ConfigMap 项目指定预期的文件路径。
在这里，ConfigMap中，键值 `SPECIAL_LEVEL` 的内容将挂载在 `config-volume` 数据卷中 `/etc/config/keys` 文件下。

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

<!--
Create the Pod:
-->
创建Pod：

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

<!--
When the pod runs, the command `cat /etc/config/keys` produces the output below:
-->
当 pod 运行时，命令 `cat /etc/config/keys` 产生以下输出：

```
very
```
<!--
Like before, all previous files in the `/etc/config/` directory will be deleted.
-->
{{< caution >}}
如前，`/etc/config/` 目录中所有先前的文件都将被删除。
{{< /caution >}}

<!--
### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) user guide explains the syntax.
-->
### 映射键以指定路径和文件权限

你可以通过指定键名到特定目录的投射关系，也可以逐个文件地设定访问权限。
[Secret 用户指南](/zh/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
中对这一语法提供了解释。

<!--
### Mounted ConfigMaps are updated automatically
-->
### 挂载的 ConfigMap 将自动更新

<!--
When a ConfigMap already being consumed in a volume is updated, projected keys
are eventually updated as well. Kubelet is checking whether the mounted
ConfigMap is fresh on every periodic sync. However, it is using its local
ttl-based cache for getting the current value of the ConfigMap. As a result,
the total delay from the moment when the ConfigMap is updated to the moment
when new keys are projected to the pod can be as long as kubelet sync period
(1 minute by default) + ttl of ConfigMaps cache (1 minute by default) in
kubelet. You can trigger an immediate refresh by updating one of the pod's
annotations.
-->
更新已经在数据卷中使用的 ConfigMap 时，已映射的键最终也会被更新。
`kubelet` 在每次定期同步时都会检查已挂载的 ConfigMap 是否是最新的。
但是，它使用其本地的基于 TTL 的缓存来获取 ConfigMap 的当前值。
因此，从更新 ConfigMap 到将新键映射到 Pod 的总延迟可能与
kubelet 同步周期 + ConfigMap 在 kubelet 中缓存的 TTL 一样长。

<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath) volume will not receive ConfigMap updates.
-->
{{< note >}}
使用 ConfigMap 作为 [subPath](/zh/docs/concepts/storage/volumes/#using-subpath)
的数据卷将不会收到 ConfigMap 更新。
{{< /note >}}

<!-- discussion -->

<!--
## Understanding ConfigMaps and Pods

The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.
-->
## 了解 ConfigMap 和 Pod

ConfigMap API 资源将配置数据存储为键值对。
数据可以在 Pod 中使用，也可以提供系统组件（如控制器）的配置。
ConfigMap 与 [Secret](/zh/docs/concepts/configuration/secret/) 类似，
但是提供了一种使用不包含敏感信息的字符串的方法。
用户和系统组件都可以在 ConfigMap 中存储配置数据。

<!--
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.
-->
{{< note >}}
ConfigMap 应该引用属性文件，而不是替换它们。可以将 ConfigMap 理解为类似于 Linux
`/etc` 目录及其内容的东西。例如，如果你从 ConfigMap 创建
[Kubernetes 卷](/zh/docs/concepts/storage/volumes/)，则 ConfigMap
中的每个数据项都由该数据卷中的单个文件表示。
{{< /note >}}

<!--
The ConfigMap's `data` field contains the configuration data. As shown in the example below, this can be simple -- like individual properties defined using `--from-literal` -- or complex -- like configuration files or JSON blobs defined using `--from-file`.
-->
ConfigMap 的 `data` 字段包含配置数据。如下例所示，它可以简单
（如用 `--from-literal` 的单个属性定义）或复杂
（如用 `--from-file` 的配置文件或 JSON blob定义）。

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
### Restrictions

- You must create a ConfigMap before referencing it in a Pod specification (unless you mark the ConfigMap as "optional"). If you reference a ConfigMap that doesn't exist, the Pod won't start. Likewise, references to keys that don't exist in the ConfigMap will prevent the pod from starting.
-->
### 限制

- 在 Pod 规范中引用之前，必须先创建一个 ConfigMap（除非将 ConfigMap 标记为"可选"）。
  如果引用的 ConfigMap 不存在，则 Pod 将不会启动。同样，引用 ConfigMap 中不存在的键也会阻止 Pod 启动。

<!--
- If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered invalid will be skipped. The pod will be allowed to start, but the invalid names will be recorded in the event log (`InvalidVariableNames`). The log message lists each skipped key. For example:
-->
- 如果你使用 `envFrom` 基于 ConfigMap 定义环境变量，那么无效的键将被忽略。
  可以启动 Pod，但无效名称将记录在事件日志中（`InvalidVariableNames`）。
  日志消息列出了每个跳过的键。例如:

  ```shell
  kubectl get events
  ```

  <!-- The output is similar to this: -->
  输出与此类似:

  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

<!--
- ConfigMaps reside in a specific {{< glossary_tooltip term_id="namespace" >}}. A ConfigMap can only be referenced by pods residing in the same namespace.
-->
- ConfigMap 位于特定的{{< glossary_tooltip term_id="namespace" text="名字空间" >}}
  中。每个 ConfigMap 只能被同一名字空间中的 Pod 引用.

<!--
- You can't use ConfigMaps for {{< glossary_tooltip text="static pods" term_id="static-pod" >}}, because the Kubelet does not support this.
-->
- 你不能将 ConfigMap 用于 {{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}， 
  因为 Kubernetes 不支持这种用法。

## {{% heading "whatsnext" %}}

<!--
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
-->
* 浏览[使用 ConfigMap 配置 Redis](/zh/docs/tutorials/configuration/configure-redis-using-configmap/)
  真实实例

