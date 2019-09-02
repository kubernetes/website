---
title: 配置一个 Pod 来使用 ConfigMap
content_template: templates/task
weight: 150
card:
  name: tasks
  weight: 50
---

<!--
title: Configure a Pod to Use a ConfigMap
content_template: templates/task
weight: 150
card:
  name: tasks
  weight: 50
-->

{{% capture overview %}}
<!--
ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable. This page provides a series of usage examples demonstrating how to create ConfigMaps and configure Pods using data stored in ConfigMaps.
-->
ConfigMaps 允许你将配置构件与镜像内容解耦，保持容器化应用程序的可移植性，
这个页面提供了一系列使用示例，演示如何使用 configmap 存储的数据创建 configmap 和配置 pod。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Create a ConfigMap
You can use either `kubectl create configmap` or a ConfigMap generator in `kustomization.yaml` to create a ConfigMap. Note that `kubectl` starts to support `kustomization.yaml` since 1.14.
-->

## 创建 ConfigMap
您可以使用 `kubectl create configmap` 或 `kustomization` 中的 configmap 生成器。创建一个 ConfigMap。注意自 1.14 `kubectl` 开始支持 `kustomization.yaml。

<!--
### Create a ConfigMap Using kubectl create configmap
-->

### 使用 kubectl 创建 ConfigMap

<!--
Use the `kubectl create configmap` command to create configmaps from [directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files), or [literal values](#create-configmaps-from-literal-values):
-->
使用 `kubectl create configmap` 命令从[目录](#create-configmaps-from-directories)、[文件](#create-configmaps-from-files)或[文字值](#create-configmaps-from-literal-values)创建 configmap:

```shell
kubectl create configmap <map-name> <data-source>
```

<!--
where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the directory, file, or literal value to draw the data from.
-->
其中 \<map-name> 是要分配给 ConfigMap 的名称，\<data-source> 是用来绘制数据的目录、文件或文字值。

<!--
The data source corresponds to a key-value pair in the ConfigMap, where
-->
数据源对应 ConfigMap 中的键值对，其中

<!--
* key = the file name or the key you provided on the command line, and
* value = the file contents or the literal value you provided on the command line.
-->

* 键 = 你在命令行上提供的文件名或密钥，以及
* 值 = 你在命令行上提供的文件内容或文字值。

<!--
You can use [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) or
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to retrieve information
about a ConfigMap.
-->
你可以使用 [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) 或者
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) 来获取关于 ConfigMap 的信息。

<!--
#### Create ConfigMaps from directories
-->

#### 从目录创建一个 ConfigMaps

<!--
You can use `kubectl create configmap` to create a ConfigMap from multiple files in the same directory.
-->
您可以使用 `kubectl create configmap` 从同一个目录中的多个文件创建 configmap。

<!--
For example:
-->
例如：

```shell
# Create the local directory
mkdir -p configure-pod-container/configmap/

# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Create the configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

<!--
combines the contents of the `configure-pod-container/configmap/` directory
-->
组合 `configure-pod-container/configmap/` 目录的内容

```shell
game.properties
ui.properties
```

<!--
into the following ConfigMap:
-->
进入下面的 ConfigMap：

```shell
kubectl describe configmaps game-config
```
<!--
where the output is similar to this:
-->
其中输出与此类似：
```
Name:           game-config
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

<!--
The `game.properties` and `ui.properties` files in the `configure-pod-container/configmap/` directory are represented in the `data` section of the ConfigMap.
-->
`configure-pod-container/configmap/` 目录中的 `game.properties` 和 `ui.properties` 文件在 ConfigMap 的 `data` 部分中表示。

```shell
kubectl get configmaps game-config -o yaml
```
<!--
The output is similar to this:
-->
输出类似如下：
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
-->

### 从文件创建一个 ConfigMap

<!--
You can use `kubectl create configmap` to create a ConfigMap from an individual file, or from multiple files.
-->
您可以使用 `kubectl create configmap` 从单个文件或多个文件创建 configmap。

<!--
For example,
-->
例如：

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

<!--
would produce the following ConfigMap:
-->
将生成以下 ConfigMap：

```shell
kubectl describe configmaps game-config-2
```

<!--
where the output is similar to this:
-->
其中输出与此类似：

```
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
```

<!--
You can pass in the `--from-file` argument multiple times to create a ConfigMap from multiple data sources.
-->
你可以多次传入 `--from-file` 参数，从多个数据源创建 ConfigMap。

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
输出类似如下：

```
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```
<!--
Use the option `--from-env-file` to create a ConfigMap from an env-file, for example:
-->
使用选项 `--from-env-file` 从一个 env-file 创建一个 ConfigMap，例如：

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

# This comment and the empty line above it are ignored
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
会生成下面的 ConfigMap：

```shell
kubectl get configmap game-config-env-file -o yaml
```
<!--
where the output is similar to this:
-->
其中输出与此类似：

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
当多次传递 `--from-env-file` 从多个数据源创建 ConfigMap 时，只使用最后一个 env-file：

```shell
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://k8s.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Create the configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

<!--
would produce the following ConfigMap:
-->
将生成以下 ConfigMap：

```shell
kubectl get configmap config-multi-env-files -o yaml
```

<!--
where the output is similar to this:
-->
其中输出与此类似：

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
-->

### 定义从文件创建 ConfigMap 时要使用的键

<!--
You can define a key other than the file name to use in the `data` section of your ConfigMap when using the `--from-file` argument:
-->
当使用 `--from-file` 参数时，可以在 ConfigMap 的 `data` 部分定义一个键，而不是文件名：

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

<!--
where `<my-key-name>` is the key you want to use in the ConfigMap and `<path-to-file>` is the location of the data source file you want the key to represent.
-->
其中 `<my-key-name>` 是你希望在 ConfigMap 中使用的键，而 `<path-to-file>` 是你希望键表示的数据源文件的位置。

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
将生成以下 ConfigMap：

```
kubectl get configmaps game-config-3 -o yaml
```

<!--
where the output is similar to this:
-->
其中输出与此类似：

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
-->

### 从文字值创建 ConfigMap

<!--
You can use `kubectl create configmap` with the `--from-literal` argument to define a literal value from the command line:
-->
您可以使用 `kubectl create configmap` 和 `--from-literal` 参数从命令行定义一个文字值：

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

<!--
You can pass in multiple key-value pairs. Each pair provided on the command line is represented as a separate entry in the `data` section of the ConfigMap.
-->
你可以传入多个键值对。命令行中提供的每一对都表示为 ConfigMap 的 `data` 部分中的一个单独条目。

```shell
kubectl get configmaps special-config -o yaml
```

<!--
The output is similar to this:
-->
输出类似如下：

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
-->

### 从生成器创建一个 ConfigMap

<!--
`kubectl` supports `kustomization.yaml` since 1.14.
You can also create a ConfigMap from generators and then apply it to create the object on the Apiserver. 
The generators should be specified in a `kustomization.yaml` inside a directory.
-->
`kubectl` 自 1.14 开始支持 `kustomization.yaml`。
你还可以从生成器创建一个 ConfigMap，然后应用它在 Apiserver 上创建对象。
生成器应该在目录中的 `kustomization.yaml` 中指定。

<!--
#### Generate ConfigMaps from files
-->

### 从文件生成 configmap

<!--
For example, to generate a ConfigMap from files `configure-pod-container/configmap/kubectl/game.properties`
-->
例如，要从文件 `configure-pod-container/configmap/kubectl/game.properties 生成 ConfigMap

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
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
应用 kustomization 目录创建 ConfigMap 对象。

```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

<!--
You can check that the ConfigMap was created like this:
-->
你可以检查 ConfigMap 是这样创建的：

```shell
kubectl get configmap
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
注意，生成的 ConfigMap 名称通过散列内容来添加后缀。这确保每次修改内容时都会生成一个新的 ConfigMap。

#### Define the key to use when generating a ConfigMap from a file
You can define a key other than the file name to use in the ConfigMap generator.
For example, to generate a ConfigMap from files `configure-pod-container/configmap/kubectl/game.properties`
with the key `game-special-key`

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/kubectl/game.properties
EOF
```

Apply the kustomization directory to create the ConfigMap object.
```shell
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### Generate ConfigMaps from Literals
To generate a ConfigMap from literals `special.type=charm` and `special.how=very`,
you can specify the ConfigMap generator in `kusotmization.yaml` as
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
Apply the kustomization directory to create the ConfigMap object.
```shell
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## Define container environment variables using ConfigMap data

### Define a container environment variable with data from a single ConfigMap

1.  Define an environment variable as a key-value pair in a ConfigMap:

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very
    ```

2.  Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY` environment variable in the Pod specification.

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   Create the Pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
 ```

   Now, the Pod's output includes environment variable `SPECIAL_LEVEL_KEY=very`.

### Define container environment variables with data from multiple ConfigMaps

 * As with the previous example, create the ConfigMaps first.

   {{< codenew file="configmap/configmaps.yaml" >}}

   Create the ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
 ```

* Define the environment variables in the Pod specification.

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  Create the Pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
 ```

  Now, the Pod's output includes environment variables `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`.

## Configure all key-value pairs in a ConfigMap as container environment variables

{{< note >}}
This functionality is available in Kubernetes v1.6 and later.
{{< /note >}}

* Create a ConfigMap containing multiple key-value pairs.

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  Create the ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
 ```

* Use `envFrom` to define all of the ConfigMap's data as container environment variables. The key from the ConfigMap becomes the environment variable name in the Pod.

 {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

 Create the Pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
 ```

 Now, the Pod's output includes environment variables `SPECIAL_LEVEL=very` and `SPECIAL_TYPE=charm`.


## Use ConfigMap-defined environment variables in Pod commands

You can use ConfigMap-defined environment variables in the `command` section of the Pod specification using the `$(VAR_NAME)` Kubernetes substitution syntax.

For example, the following Pod specification

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

created by running

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

produces the following output in the `test-container` container:

```shell
very charm
```

## Add ConfigMap data to a Volume

As explained in [Create ConfigMaps from files](#create-configmaps-from-files), when you create a ConfigMap using ``--from-file``, the filename becomes a key stored in the `data` section of the ConfigMap. The file contents become the key's value.

The examples in this section refer to a ConfigMap named special-config, shown below.

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

Create the ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Populate a Volume with data stored in a ConfigMap

Add the ConfigMap name under the `volumes` section of the Pod specification.
This adds the ConfigMap data to the directory specified as `volumeMounts.mountPath` (in this case, `/etc/config`).
The `command` section references the `special.level` item stored in the ConfigMap.

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

When the pod runs, the command `ls /etc/config/` produces the output below:

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
If there are some files in the `/etc/config/` directory, they will be deleted.
{{< /caution >}}

### Add ConfigMap data to a specific path in the Volume

Use the `path` field to specify the desired file path for specific ConfigMap items.
In this case, the `SPECIAL_LEVEL` item will be mounted in the `config-volume` volume at `/etc/config/keys`.

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

When the pod runs, the command `cat /etc/config/keys` produces the output below:

```shell
very
```

{{< caution >}}
Like before, all previous files in the `/etc/config/` directory will be deleted.
{{< /caution >}}

### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) user guide explains the syntax.

### Mounted ConfigMaps are updated automatically

When a ConfigMap already being consumed in a volume is updated, projected keys are eventually updated as well. Kubelet is checking whether the mounted ConfigMap is fresh on every periodic sync. However, it is using its local ttl-based cache for getting the current value of the ConfigMap. As a result, the total delay from the moment when the ConfigMap is updated to the moment when new keys are projected to the pod can be as long as kubelet sync period + ttl of ConfigMaps cache in kubelet.

{{< note >}}

<!--
A container using a ConfigMap as a [subPath](/docs/concepts/storage/volumes/#using-subpath) volume will not receive ConfigMap updates.
-->
使用 ConfigMap 作为[子路径]](/docs/concepts/storage/volumes/#using-subpath)卷的容器将不会接收 ConfigMap 更新。

{{< /note >}}

{{% /capture %}}

{{% capture discussion %}}

<!--
## Understanding ConfigMaps and Pods

The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.
-->

## 理解 configmap 和 Pod

ConfigMap API 资源将配置数据存储为键值对。数据可以在 pod 中使用，也可以为系统组件（如控制器）提供配置。ConfigMap 类似于 [Secrets](/docs/concepts/configuration/secret/)，但是它提供了一种处理不包含敏感信息的字符串的方法，用户和系统组件都可以在 ConfigMap 中存储配置数据。

{{< note >}}

<<!--
ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.
-->
ConfigMap 应该引用属性文件，不是替换它们，可以将 ConfigMap 看作表示类似于 Linux `/etc` 目录及其内容的东西。
例如，如果你从一个 ConfigMap 创建一个 [Kubernetes 卷](/docs/concepts/storage/volumes/)， ConfigMap 中的每个数据项都由卷中的一个单独的文件表示。

{{< /note >}}

<!--
The ConfigMap's `data` field contains the configuration data. As shown in the example below, this can be simple -- like individual properties defined using `--from-literal` -- or complex -- like configuration files or JSON blobs defined using `--from-file`.
-->
ConfigMap 的 `data` 字段包含配置数据。如下面的示例所示，这可以是简单的 -- 比如使用 `--from-literal` 定义的单个属性 -- 也可以是复杂的 -- 比如使用 `--from-file` 定义的配置文件或 JSON blob。

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

<!--
### Restrictions
-->

## 限制

<!--
- You must create a ConfigMap before referencing it in a Pod specification (unless you mark the ConfigMap as "optional"). If you reference a ConfigMap that doesn't exist, the Pod won't start. Likewise, references to keys that don't exist in the ConfigMap will prevent the pod from starting.

- If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered invalid will be skipped. The pod will be allowed to start, but the invalid names will be recorded in the event log (`InvalidVariableNames`). The log message lists each skipped key. For example:
-->

- 在 Pod 规范中引用 ConfigMap 之前，必须创建一个 ConfigMap（除非将 ConfigMap 标记为 “optional”）。如果引用不存在的 ConfigMap, Pod 将不会启动。同样，对 ConfigMap 中不存在的键的引用将阻止 pod 启动。

- 如果使用 `envFrom` 来定义 ConfigMaps 中的环境变量，则会跳过被认为无效的键。pod 将被允许启动，但是无效的名称将记录在事件日志中（“InvalidVariableNames”）。日志消息列出了每个跳过的键。例如：

   ```shell
   kubectl get events
   ```

   The output is similar to this:
   ```
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

<!--
- ConfigMaps reside in a specific [namespace](/docs/concepts/overview/working-with-objects/namespaces/). A ConfigMap can only be referenced by pods residing in the same namespace.

- Kubelet doesn't support the use of ConfigMaps for pods not found on the API server. This includes pods created via the Kubelet's `--manifest-url` flag, `--config` flag, or the Kubelet REST API.
-->

- ConfigMap 属于在一个指定的[命名空间]中。ConfigMap 只能由属于在相同命名空间中的 pod 引用。

- Kubelet 不支持 API 服务器上没有找到的 pod 使用 configmap。这包括 Kubelet `--manifest-url` 参数、`--config` 参数或 Kubelet REST API 创建的 pod。

   {{< note >}}
   <!--
   These are not commonly-used ways to create pods.
   -->
   这些不是创建 pod 的常用方法。
   {{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
-->
* 遵循一个真实的示例[使用 ConfigMap 配置 Redis](/docs/tutorials/configuration/configure-redis-using-configmap/)。

{{% /capture %}}

