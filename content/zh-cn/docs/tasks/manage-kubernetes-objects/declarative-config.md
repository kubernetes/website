---
title: 使用配置文件对 Kubernetes 对象进行声明式管理
content_type: task
weight: 10
---
<!--
title: Declarative Management of Kubernetes Objects Using Configuration Files
content_type: task
weight: 10
-->
<!-- overview -->

<!--
Kubernetes objects can be created, updated, and deleted by storing multiple
object configuration files in a directory and using `kubectl apply` to
recursively create and update those objects as needed. This method
retains writes made to live objects without merging the changes
back into the object configuration files. `kubectl diff` also gives you a
preview of what changes `apply` will make.
-->
你可以通过在一个目录中存储多个对象配置文件、并使用 `kubectl apply`
来递归地创建和更新对象来创建、更新和删除 Kubernetes 对象。
这种方法会保留对现有对象已作出的修改，而不会将这些更改写回到对象配置文件中。
`kubectl diff` 也会给你呈现 `apply` 将作出的变更的预览。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安装 [`kubectl`](/zh-cn/docs/tasks/tools/)。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Trade-offs

The `kubectl` tool supports three kinds of object management:

* Imperative commands
* Imperative object configuration
* Declarative object configuration

See [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
## 权衡取舍   {#trade-offs}

`kubectl` 工具能够支持三种对象管理方式：

* 指令式命令
* 指令式对象配置
* 声明式对象配置

关于每种对象管理的优缺点的讨论，可参见
[Kubernetes 对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## Overview

Declarative object configuration requires a firm understanding of
the Kubernetes object definitions and configuration. Read and complete
the following documents if you have not already:

* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
-->
## 概览  {#overview}

声明式对象管理需要用户对 Kubernetes 对象定义和配置有比较深刻的理解。
如果你还没有这方面的知识储备，请先阅读下面的文档：

* [使用指令式命令管理 Kubernetes 对象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置文件对 Kubernetes 对象进行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)

<!--
Following are definitions for terms used in this document:

- *object configuration file / configuration file*: A file that defines the
  configuration for a Kubernetes object. This topic shows how to pass configuration
  files to `kubectl apply`. Configuration files are typically stored in source control, such as Git.
- *live object configuration / live configuration*: The live configuration
  values of an object, as observed by the Kubernetes cluster. These are kept in the Kubernetes
  cluster storage, typically etcd.
- *declarative configuration writer / declarative writer*: A person or software component
  that makes updates to a live object. The live writers referred to in this topic make changes
  to object configuration files and run `kubectl apply` to write the changes.
-->
以下是本文档中使用的术语的定义：

- **对象配置文件/配置文件**：一个定义 Kubernetes 对象的配置的文件。
  本主题展示如何将配置文件传递给 `kubectl apply`。
  配置文件通常存储于类似 Git 这种源码控制系统中。  
- **现时对象配置/现时配置**：由 Kubernetes 集群所观测到的对象的现时配置值。
  这些配置保存在 Kubernetes 集群存储（通常是 etcd）中。
- **声明式配置写者/声明式写者**：负责更新现时对象的人或者软件组件。
  本主题中的声明式写者负责改变对象配置文件并执行 `kubectl apply` 命令以写入变更。

<!--
## How to create objects

Use `kubectl apply` to create all objects, except those that already exist,
defined by configuration files in a specified directory:

```shell
kubectl apply -f <directory>
```

This sets the `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
annotation on each object. The annotation contains the contents of the object
configuration file that was used to create the object.
-->
## 如何创建对象 {#how-to-create-objects}

使用 `kubectl apply` 来创建指定目录中配置文件所定义的所有对象，除非对应对象已经存在：

```shell
kubectl apply -f <目录>
```

此操作会在每个对象上设置 `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
注解。注解值中包含了用来创建对象的配置文件的内容。

{{< note >}}
<!--
Add the `-R` flag to recursively process directories.
-->
添加 `-R` 标志可以递归地处理目录。
{{< /note >}}

<!--
Here's an example of an object configuration file:
-->
下面是一个对象配置文件示例：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Run `kubectl diff` to print the object that will be created:
-->
执行 `kubectl diff` 可以打印出将被创建的对象：

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
<!--
`diff` uses [server-side dry-run](/docs/reference/using-api/api-concepts/#dry-run),
which needs to be enabled on `kube-apiserver`.

Since `diff` performs a server-side apply request in dry-run mode,
it requires granting `PATCH`, `CREATE`, and `UPDATE` permissions.
See [Dry-Run Authorization](/docs/reference/using-api/api-concepts#dry-run-authorization)
for details.
-->
`diff` 使用[服务器端试运行（Server-side Dry-run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)
功能特性；而该功能特性需要在 `kube-apiserver` 上启用。

由于 `diff` 操作会使用试运行模式执行服务器端 apply 请求，因此需要为用户配置
`PATCH`、`CREATE` 和 `UPDATE` 操作权限。
参阅[试运行授权](/zh-cn/docs/reference/using-api/api-concepts#dry-run-authorization)了解详情。
{{< /note >}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 来创建对象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印其现时配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
输出显示注解 `kubectl.kubernetes.io/last-applied-configuration`
被写入到现时配置中，并且其内容与配置文件相同：

<!--
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
```
-->
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # 此为 simple_deployment.yaml 的 JSON 表示
    # 在对象创建时由 kubectl apply 命令写入
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
## How to update objects

You can also use `kubectl apply` to update all objects defined in a directory, even
if those objects already exist. This approach accomplishes the following:

1. Sets fields that appear in the configuration file in the live configuration.
2. Clears fields removed from the configuration file in the live configuration.

```shell
kubectl diff -f <directory>
kubectl apply -f <directory>
```
-->
## 如何更新对象   {#how-to-update-objects}

你也可以使用 `kubectl apply` 来更新某个目录中定义的所有对象，即使那些对象已经存在。
这一操作会隐含以下行为：

1. 在现时配置中设置配置文件中出现的字段；
2. 在现时配置中清除配置文件中已删除的字段。

```shell
kubectl diff -f <目录>
kubectl apply -f <目录>
```

{{< note >}}
<!--
Add the `-R` flag to recursively process directories.
-->
使用 `-R` 标志递归处理目录。
{{< /note >}}

<!--
Here's an example configuration file:
-->
下面是一个配置文件示例：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 来创建对象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
<!--
For purposes of illustration, the preceding command refers to a single
configuration file instead of a directory.
-->
出于演示的目的，上面的命令引用的是单个文件而不是整个目录。
{{< /note >}}

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印现时配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
输出显示，注解 `kubectl.kubernetes.io/last-applied-configuration`
被写入到现时配置中，并且其取值与配置文件内容相同。

<!--
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
```
-->
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # 此为 simple_deployment.yaml 的 JSON 表示
    # 在对象创建时由 kubectl apply 命令写入
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
Directly update the `replicas` field in the live configuration by using `kubectl scale`.
This does not use `kubectl apply`:
-->
通过 `kubectl scale` 命令直接更新现时配置中的 `replicas` 字段。
这一命令没有使用 `kubectl apply`：

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 来打印现时配置：

```shell
kubectl get deployment nginx-deployment -o yaml
```

<!--
The output shows that the `replicas` field has been set to 2, and the `last-applied-configuration`
annotation does not contain a `replicas` field:
-->
输出显示，`replicas` 字段已经被设置为 2，而 `last-applied-configuration`
注解中并不包含 `replicas` 字段。

<!--
# note that the annotation does not contain replicas
# because it was not updated through apply
# written by scale
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注意注解中并不包含 replicas
    # 这是因为更新并不是通过 kubectl apply 来执行的
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # 由 scale 命令填写
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

<!--
Update the `simple_deployment.yaml` configuration file to change the image from
`nginx:1.14.2` to `nginx:1.16.1`, and delete the `minReadySeconds` field:
-->
现在更新 `simple_deployment.yaml` 配置文件，将镜像文件从
`nginx:1.14.2` 更改为 `nginx:1.16.1`，同时删除`minReadySeconds` 字段：

{{% code_sample file="application/update_deployment.yaml" %}}

<!--
Apply the changes made to the configuration file:
-->
应用对配置文件所作更改：

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印现时配置：

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

<!--
The output shows the following changes to the live configuration:

* The `replicas` field retains the value of 2 set by `kubectl scale`.
  This is possible because it is omitted from the configuration file.
* The `image` field has been updated to `nginx:1.16.1` from `nginx:1.14.2`.
* The `last-applied-configuration` annotation has been updated with the new image.
* The `minReadySeconds` field has been cleared.
* The `last-applied-configuration` annotation no longer contains the `minReadySeconds` field.
-->
输出显示现时配置中发生了以下更改：

* 字段 `replicas` 保留了 `kubectl scale` 命令所设置的值：2；
  之所以该字段被保留是因为配置文件中并没有设置 `replicas`。
* 字段 `image` 的内容已经从 `nginx:1.14.2` 更改为 `nginx:1.16.1`。
* 注解 `last-applied-configuration` 内容被更改为新的镜像名称。
* 字段 `minReadySeconds` 被移除。
* 注解 `last-applied-configuration` 中不再包含 `minReadySeconds` 字段。

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.16.1,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Set by `kubectl apply`
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注解中包含更新后的镜像 nginx 1.16.1
    # 但是其中并不包含更改后的 replicas 值 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # 由 `kubectl scale` 设置，被 `kubectl apply` 命令忽略
  # minReadySeconds 被 `kubectl apply` 清除
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # 由 `kubectl apply` 设置
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
<!--
Mixing `kubectl apply` with the imperative object configuration commands
`create` and `replace` is not supported. This is because `create`
and `replace` do not retain the `kubectl.kubernetes.io/last-applied-configuration`
that `kubectl apply` uses to compute updates.
-->
将 `kubectl apply` 与指令式对象配置命令 `kubectl create` 或 `kubectl replace`
混合使用是不受支持的。这是因为 `create` 和 `replace` 命令都不会保留
`kubectl apply` 用来计算更新内容所使用的
`kubectl.kubernetes.io/last-applied-configuration` 注解值。
{{< /warning >}}

<!--
## How to delete objects

There are two approaches to delete objects managed by `kubectl apply`.

### Recommended: `kubectl delete -f <filename>`

Manually deleting objects using the imperative command is the recommended
approach, as it is more explicit about what is being deleted, and less likely
to result in the user deleting something unintentionally:

```shell
kubectl delete -f <filename>
```
-->
## 如何删除对象  {#how-to-delete-objects}

有两种方法来删除 `kubectl apply` 管理的对象。

### 建议操作：`kubectl delete -f <文件名>`

使用指令式命令来手动删除对象是建议的方法，因为这种方法更为明确地给出了要删除的内容是什么，
且不容易造成用户不小心删除了其他对象的情况。

```shell
kubectl delete -f <文件名>
```

<!--
### Alternative: `kubectl apply -f <directory> --prune`

As an alternative to `kubectl delete`, you can use `kubectl apply` to identify objects to be deleted after
their manifests have been removed from a directory in the local filesystem.
-->
### 替代方式：`kubectl apply -f <目录> --prune`

作为 `kubectl delete` 操作的替代方式，你可以在本地文件系统的目录中的清单文件被删除之后，
使用 `kubectl apply` 来辩识要删除的对象。

<!--
In Kubernetes {{< skew currentVersion >}}, there are two pruning modes available in kubectl apply:

- Allowlist-based pruning: This mode has existed since kubectl v1.5 but is still
  in alpha due to usability, correctness and performance issues with its design.
  The ApplySet-based mode is designed to replace it.
- ApplySet-based pruning: An _apply set_ is a server-side object (by default, a Secret)
  that kubectl can use to accurately and efficiently track set membership across **apply**
  operations. This mode was introduced in alpha in kubectl v1.27 as a replacement for allowlist-based pruning.
-->
在 Kubernetes {{< skew currentVersion >}} 中，`kubectl apply` 可使用两种剪裁模式：

- 基于 Allowlist 的剪裁：这种模式自 kubectl v1.5 版本开始就存在，
  但由于其设计存在易用性、正确性和性能问题，因此仍处于 Alpha 阶段。
  基于 ApplySet 的模式设计用于取代这种模式。
- 基于 ApplySet 的剪裁：**apply set** 是一个服务器端对象（默认是一个 Secret），
  kubectl 可以使用它来在 **apply** 操作中准确高效地跟踪集合成员。
  这种模式在 kubectl v1.27 中以 Alpha 引入，作为基于 Allowlist 剪裁的替代方案。

{{< tabs name="kubectl_apply_prune" >}}
{{% tab name="Allow list" %}}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

{{< warning >}}
<!--
Take care when using `--prune` with `kubectl apply` in allow list mode. Which
objects are pruned depends on the values of the `--prune-allowlist`, `--selector`
and `--namespace` flags, and relies on dynamic discovery of the objects in scope.
Especially if flag values are changed between invocations, this can lead to objects
being unexpectedly deleted or retained.
-->
在 Allowlist 模式下使用 `kubectl apply` 命令时要小心使用 `--prune` 标志。
哪些对象被剪裁取决于 `--prune-allowlist`、`--selector` 和 `--namespace` 标志的值，
并且依赖于作用域中对象的动态发现。特别是在调用之间更改标志值时，这可能会导致对象被意外删除或保留。
{{< /warning >}}

<!--
To use allowlist-based pruning, add the following flags to your `kubectl apply` invocation:

- `--prune`: Delete previously applied objects that are not in the set passed to the current invocation.
- `--prune-allowlist`: A list of group-version-kinds (GVKs) to consider for pruning.
  This flag is optional but strongly encouraged, as its default value is a partial
  list of both namespaced and cluster-scoped types, which can lead to surprising results.
- `--selector/-l`: Use a label selector to constrain the set of objects selected
  for pruning. This flag is optional but strongly encouraged.
- `--all`: use instead of `--selector/-l` to explicitly select all previously
  applied objects of the allowlisted types.
-->
要使用基于 Allowlist 的剪裁，可以添加以下标志到你的 `kubectl apply` 调用：

- `--prune`：删除之前应用的、不在当前调用所传递的集合中的对象。
- `--prune-allowlist`：一个需要考虑进行剪裁的组-版本-类别（group-version-kind, GVK）列表。
  这个标志是可选的，但强烈建议使用，因为它的默认值是同时作用于命名空间和集群的部分类型列表，
  这可能会产生令人意外的结果。
- `--selector/-l`：使用标签选择算符以约束要剪裁的对象的集合。此标志是可选的，但强烈建议使用。
- `--all`：用于替代 `--selector/-l` 以显式选择之前应用的类型为 Allowlist 的所有对象。

<!--
Allowlist-based pruning queries the API server for all objects of the allowlisted GVKs that match the given labels (if any), and attempts to match the returned live object configurations against the object
manifest files. If an object matches the query, and it does not have a
manifest in the directory, and it has a `kubectl.kubernetes.io/last-applied-configuration` annotation,
it is deleted.
-->
基于 Allowlist 的剪裁会查询 API 服务器以获取与给定标签（如果有）匹配的所有允许列出的 GVK 对象，
并尝试将返回的活动对象配置与对象清单文件进行匹配。如果一个对象与查询匹配，并且它在目录中没有对应的清单，
但它有一个 `kubectl.kubernetes.io/last-applied-configuration` 注解，则它将被删除。

<!--
```shell
kubectl apply -f <directory> --prune -l <labels> --prune-allowlist=<gvk-list>
```
-->
```shell
kubectl apply -f <目录> --prune -l <标签> --prune-allowlist=<gvk 列表>
```

{{< warning >}}
<!--
Apply with prune should only be run against the root directory
containing the object manifests. Running against sub-directories
can cause objects to be unintentionally deleted if they were previously applied, 
have the labels given (if any), and do not appear in the subdirectory.
-->
带剪裁（prune）行为的 `apply` 操作应在包含对象清单的根目录运行。
如果对象之前被执行了 `apply` 操作，具有给定的标签（如果有）且未出现在子目录中，
在其子目录中运行可能导致对象被不小心删除。
{{< /warning >}}

{{% /tab %}}

{{% tab name="Apply set" %}}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< caution >}}
<!--
`kubectl apply --prune --applyset` is in alpha, and backwards incompatible
changes might be introduced in subsequent releases.
-->
`kubectl apply --prune --applyset` 目前处于 Alpha 阶段，在后续的版本中可能引入向后不兼容的变更。
{{< /caution >}}

<!--
To use ApplySet-based pruning, set the `KUBECTL_APPLYSET=true` environment variable,
and add the following flags to your `kubectl apply` invocation:
- `--prune`: Delete previously applied objects that are not in the set passed
  to the current invocation.
- `--applyset`: The name of an object that kubectl can use to accurately and
  efficiently track set membership across `apply` operations.
-->
要使用基于 ApplySet 的剪裁，请设置 `KUBECTL_APPLYSET=true` 环境变量，
并添加以下标志到你的 `kubectl apply` 调用中：

- `--prune`：删除之前应用的、不在当前调用所传递的集合中的对象。
- `--applyset`：是 kubectl 可以使用的对象的名称，用于在 `apply` 操作中准确高效地跟踪集合成员。

<!--
```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory> --prune --applyset=<name>
```
-->
```shell
KUBECTL_APPLYSET=true kubectl apply -f <目录> --prune --applyset=<名称>
```

<!--
By default, the type of the ApplySet parent object used is a Secret. However,
ConfigMaps can also be used in the format: `--applyset=configmaps/<name>`.
When using a Secret or ConfigMap, kubectl will create the object if it does not already exist.
-->
默认情况下，所使用的 ApplySet 父对象的类别是 Secret。
不过也可以按格式 `--applyset=configmaps/<name>` 使用 ConfigMap。
使用 Secret 或 ConfigMap 时，如果对应对象尚不存在，kubectl 将创建这些对象。

<!--
It is also possible to use custom resources as ApplySet parent objects. To enable
this, label the Custom Resource Definition (CRD) that defines the resource you want
to use with the following: `applyset.kubernetes.io/is-parent-type: true`. Then, create
the object you want to use as an ApplySet parent (kubectl does not do this automatically
for custom resources). Finally, refer to that object in the applyset flag as follows:
`--applyset=<resource>.<group>/<name>` (for example, `widgets.custom.example.com/widget-name`).
-->
还可以使用自定义资源作为 ApplySet 父对象。
要启用此功能，请为定义目标资源的 CRD 打上标签：`applyset.kubernetes.io/is-parent-type: true`。
然后，创建你想要用作 ApplySet 父级的对象（kubectl 不会自动为自定义资源执行此操作）。
最后，按以下方式在 applyset 标志中引用该对象： `--applyset=<resource>.<group>/<name>`
（例如 `widgets.custom.example.com/widget-name`）。

<!--
With ApplySet-based pruning, kubectl adds the `applyset.kubernetes.io/part-of=<parentID>`
label to each object in the set before they are sent to the server. For performance reasons,
it also collects the list of resource types and namespaces that the set contains and adds
these in annotations on the live parent object. Finally, at the end of the apply operation,
it queries the API server for objects of those types in those namespaces
(or in the cluster scope, as applicable) that belong to the set, as defined by the
`applyset.kubernetes.io/part-of=<parentID>` label.
-->
使用基于 ApplySet 的剪裁时，kubectl 会在将集合中的对象发送到服务器之前将标签
`applyset.kubernetes.io/part-of=<parentID>` 添加到集合中的每个对象上。
出于性能原因，它还会将该集合包含的资源类型和命名空间列表收集到当前父对象上的注解中。
最后，在 apply 操作结束时，它会在 API 服务器上查找由 `applyset.kubernetes.io/part-of=<parentID>`
标签定义的、属于此集合所对应命名空间（或适用的集群作用域）中对应类型的对象。

<!--
Caveats and restrictions:

- Each object may be a member of at most one set.
- The `--namespace` flag is required when using any namespaced parent, including
  the default Secret.  This means that ApplySets spanning multiple namespaces must
  use a cluster-scoped custom resource as the parent object.
- To safely use ApplySet-based pruning with multiple directories,
  use a unique ApplySet name for each.
-->
注意事项和限制：

- 每个对象最多可以是一个集合的成员。
- 当使用任何名命名空间的父级（包括默认的 Secret）时，
  `--namespace` 标志是必需的。这意味着跨越多个命名空间的
  ApplySet 必须使用集群作用域的自定义资源作为父对象。
- 要安全地在多个目录中使用基于 ApplySet 的剪裁，请为每个目录使用唯一的 ApplySet 名称。

{{% /tab %}}

{{< /tabs >}}

<!--
## How to view an object

You can use `kubectl get` with `-o yaml` to view the configuration of a live object:

```shell
kubectl get -f <filename|url> -o yaml
```
-->
## 如何查看对象  {#how-to-view-an-object}

你可以使用 `kubectl get` 并指定 `-o yaml` 选项来查看现时对象的配置：

```shell
kubectl get -f <文件名 | URL> -o yaml
```

<!--
## How apply calculates differences and merges changes
-->
## apply 操作是如何计算配置差异并合并变更的？   {#how-apply-diffs-and-merge-changes}

{{< caution >}}
<!--
A *patch* is an update operation that is scoped to specific fields of an object
instead of the entire object. This enables updating only a specific set of fields
on an object without reading the object first.
-->
**patch** 是一种更新操作，其作用域为对象的一些特定字段而不是整个对象。
这使得你可以更新对象的特定字段集合而不必先要读回对象。
{{< /caution >}}

<!--
When `kubectl apply` updates the live configuration for an object,
it does so by sending a patch request to the API server. The
patch defines updates scoped to specific fields of the live object
configuration. The `kubectl apply` command calculates this patch request
using the configuration file, the live configuration, and the
`last-applied-configuration` annotation stored in the live configuration.
-->
`kubectl apply` 更新对象的现时配置，它是通过向 API 服务器发送一个 patch
请求来执行更新动作的。所提交的补丁中定义了对现时对象配置中特定字段的更新。
`kubectl apply` 命令会使用当前的配置文件、现时配置以及现时配置中保存的
`last-applied-configuration` 注解内容来计算补丁更新内容。

<!--
### Merge patch calculation

The `kubectl apply` command writes the contents of the configuration file to the
`kubectl.kubernetes.io/last-applied-configuration` annotation. This
is used to identify fields that have been removed from the configuration
file and need to be cleared from the live configuration. Here are the steps used
to calculate which fields should be deleted or set:
-->
### 合并补丁计算  {#merge-patch-calculation}

`kubectl apply` 命令将配置文件的内容写入到
`kubectl.kubernetes.io/last-applied-configuration` 注解中。
这些内容用来识别配置文件中已经移除的、因而也需要从现时配置中删除的字段。
用来计算要删除或设置哪些字段的步骤如下：

<!--
1. Calculate the fields to delete. These are the fields present in
   `last-applied-configuration` and missing from the configuration file.
2. Calculate the fields to add or set. These are the fields present in
   the configuration file whose values don't match the live configuration.

Here's an example. Suppose this is the configuration file for a Deployment object:
-->
1. 计算要删除的字段，即在 `last-applied-configuration`
   中存在但在配置文件中不再存在的字段。
2. 计算要添加或设置的字段，即在配置文件中存在但其取值与现时配置不同的字段。

下面是一个例子。假定此文件是某 Deployment 对象的配置文件：

{{% code_sample file="application/update_deployment.yaml" %}}

<!--
Also, suppose this is the live configuration for the same Deployment object:
-->
同时假定同一 Deployment 对象的现时配置如下：

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # note that the annotation does not contain replicas
    # because it was not updated through apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注意注解中并不包含 replicas
    # 这是因为更新并不是通过 kubectl apply 来执行的
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # 按规模填写
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

<!--
Here are the merge calculations that would be performed by `kubectl apply`:

1. Calculate the fields to delete by reading values from
   `last-applied-configuration` and comparing them to values in the
   configuration file.
   Clear fields explicitly set to null in the local object configuration file
   regardless of whether they appear in the `last-applied-configuration`.
   In this example, `minReadySeconds` appears in the
   `last-applied-configuration` annotation, but does not appear in the configuration file.
   **Action:** Clear `minReadySeconds` from the live configuration.
2. Calculate the fields to set by reading values from the configuration
   file and comparing them to values in the live configuration. In this example,
   the value of `image` in the configuration file does not match
   the value in the live configuration. **Action:** Set the value of `image` in the live configuration.
3. Set the `last-applied-configuration` annotation to match the value
   of the configuration file.
4. Merge the results from 1, 2, 3 into a single patch request to the API server.

Here is the live configuration that is the result of the merge:
-->
下面是 `kubectl apply` 将执行的合并计算：

1. 通过读取 `last-applied-configuration` 并将其与配置文件中的值相比较，
   计算要删除的字段。
   对于本地对象配置文件中显式设置为空的字段，清除其在现时配置中的设置，
   无论这些字段是否出现在 `last-applied-configuration` 中。
   在此例中，`minReadySeconds` 出现在 `last-applied-configuration` 注解中，
   但并不存在于配置文件中。
   **动作：** 从现时配置中删除 `minReadySeconds` 字段。
2. 通过读取配置文件中的值并将其与现时配置相比较，计算要设置的字段。
   在这个例子中，配置文件中的 `image` 值与现时配置中的 `image` 不匹配。
   **动作**：设置现时配置中的 `image` 值。
3. 设置 `last-applied-configuration` 注解的内容，使之与配置文件匹配。
4. 将第 1、2、3 步骤得出的结果合并，构成向 API 服务器发送的补丁请求内容。

下面是此合并操作之后形成的现时配置：

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.16.1,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注解中包含更新后的镜像 nginx 1.16.1,
    # 但是其中并不包含更改后的 replicas 值 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # 由 `kubectl scale` 设置，被 `kubectl apply` 命令忽略
  # minReadySeconds  此字段被 `kubectl apply` 清除
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # 由 `kubectl apply` 设置
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
### How different types of fields are merged

How a particular field in a configuration file is merged with
the live configuration depends on the
type of the field. There are several types of fields:
-->
### 不同类型字段的合并方式

配置文件中的特定字段与现时配置合并时，合并方式取决于字段类型。
字段类型有几种：

<!--
- *primitive*: A field of type string, integer, or boolean.
  For example, `image` and `replicas` are primitive fields. **Action:** Replace.

- *map*, also called *object*: A field of type map or a complex type that contains subfields. For example, `labels`,
  `annotations`,`spec` and `metadata` are all maps. **Action:** Merge elements or subfields.

- *list*: A field containing a list of items that can be either primitive types or maps.
  For example, `containers`, `ports`, and `args` are lists. **Action:** Varies.
-->
- **基本类型**：字段类型为 `string`、`integer` 或 `boolean` 之一。
  例如：`image` 和 `replicas` 字段都是基本类型字段。

  **动作：** 替换。

- **map**：也称作 *object*。类型为 `map` 或包含子域的复杂结构。例如，`labels`、
  `annotations`、`spec` 和 `metadata` 都是 map。

  **动作：** 合并元素或子字段。

- **list**：包含元素列表的字段，其中每个元素可以是基本类型或 map。
  例如，`containers`、`ports` 和 `args` 都是 list。

  **动作：** 不一定。

<!--
When `kubectl apply` updates a map or list field, it typically does
not replace the entire field, but instead updates the individual subelements.
For instance, when merging the `spec` on a Deployment, the entire `spec` is
not replaced. Instead the subfields of `spec`, such as `replicas`, are compared
and merged.
-->
当 `kubectl apply` 更新某个 map 或 list 字段时，它通常不会替换整个字段，
而是会更新其中的各个子元素。例如，当合并 Deployment 的 `spec` 时，`kubectl`
并不会将其整个替换掉。相反，实际操作会是对 `replicas` 这类 `spec`
的子字段来执行比较和更新。

<!--
### Merging changes to primitive fields

Primitive fields are replaced or cleared.
-->
### 合并对基本类型字段的更新

基本类型字段会被替换或清除。

{{< note >}}
<!--
`-` is used for "not applicable" because the value is not used.
-->
`-` 表示的是“不适用”，因为指定数值未被使用。
{{< /note >}}

<!--
| Field in object configuration file  | Field in live object configuration | Field in last-applied-configuration | Action                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| Yes                                 | Yes                                | -                                   | Set live to configuration file value.  |
| Yes                                 | No                                 | -                                   | Set live to local configuration.           |
| No                                  | -                                  | Yes                                 | Clear from live configuration.            |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.             |
-->
| 字段在对象配置文件中  | 字段在现时对象配置中 | 字段在 `last-applied-configuration` 中 | 动作 |
|-----------------------|----------------------|----------------------------------------|------|
| 是 | 是 | -  | 将配置文件中值设置到现时配置上。 |
| 是 | 否 | -  | 将配置文件中值设置到现时配置上。 |
| 否 | -  | 是 | 从现时配置中移除。 |
| 否 | -  | 否 | 什么也不做。保持现时值。 |

<!--
### Merging changes to map fields

Fields that represent maps are merged by comparing each of the subfields or elements of the map:
-->
### 合并对 map 字段的变更

用来表示映射的字段在合并时会逐个子字段或元素地比较：

{{< note >}}
<!--
`-` is used for "not applicable" because the value is not used.
-->
`-` 表示的是“不适用”，因为指定数值未被使用。
{{< /note >}}

<!--
| Key in object configuration file    | Key in live object configuration   | Field in last-applied-configuration | Action                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| Yes                                 | Yes                                | -                                   | Compare sub fields values.        |
| Yes                                 | No                                 | -                                   | Set live to local configuration.  |
| No                                  | -                                  | Yes                                 | Delete from live configuration.   |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.     |
-->
| 键存在于对象配置文件中 | 键存在于现时对象配置中 | 键存在于 `last-applied-configuration` 中 | 动作 |
|------------------------|------------------------|------------------------------------------|------|
| 是 | 是 | -  | 比较子域取值。 |
| 是 | 否 | -  | 将现时配置设置为本地配置值。 |
| 否 | -  | 是 | 从现时配置中删除键。 |
| 否 | -  | 否 | 什么也不做，保留现时值。 |

<!--
### Merging changes for fields of type list

Merging changes to a list uses one of three strategies:

* Replace the list if all its elements are primitives.
* Merge individual elements in a list of complex elements.
* Merge a list of primitive elements.

The choice of strategy is made on a per-field basis.
-->
### 合并 list 类型字段的变更

对 list 类型字段的变更合并会使用以下三种策略之一：

* 如果 list 所有元素都是基本类型则替换整个 list。
* 如果 list 中元素是复合结构则逐个元素执行合并操作。
* 合并基本类型元素构成的 list。

策略的选择是基于各个字段做出的。

<!--
#### Replace the list if all its elements are primitives

Treat the list the same as a primitive field. Replace or delete the
entire list. This preserves ordering.
-->
#### 如果 list 中元素都是基本类型则替换整个 list

将整个 list 视为一个基本类型字段。或者整个替换或者整个删除。
此操作会保持 list 中元素顺序不变

<!--
**Example:** Use `kubectl apply` to update the `args` field of a Container in a Pod. This sets
the value of `args` in the live configuration to the value in the configuration file.
Any `args` elements that had previously been added to the live configuration are lost.
The order of the `args` elements defined in the configuration file is
retained in the live configuration.
-->
**示例：** 使用 `kubectl apply` 来更新 Pod 中 Container 的 `args` 字段。
此操作会将现时配置中的 `args` 值设为配置文件中的值。
所有之前添加到现时配置中的 `args` 元素都会丢失。
配置文件中的 `args` 元素的顺序在被添加到现时配置中时保持不变。

<!--
```yaml
# last-applied-configuration value
    args: ["a", "b"]

# configuration file value
    args: ["a", "c"]

# live configuration
    args: ["a", "b", "d"]

# result after merge
    args: ["a", "c"]
```
-->
```yaml
# last-applied-configuration 值
    args: ["a", "b"]

# 配置文件值
    args: ["a", "c"]

# 现时配置
    args: ["a", "b", "d"]

# 合并结果
    args: ["a", "c"]
```

<!--
**Explanation:** The merge used the configuration file value as the new list value.
-->
**解释：** 合并操作将配置文件中的值当做新的 list 值。

<!--
#### Merge individual elements of a list of complex elements:

Treat the list as a map, and treat a specific field of each element as a key.
Add, delete, or update individual elements. This does not preserve ordering.
-->
#### 如果 list 中元素为复合类型则逐个执行合并

此操作将 list 视为 map，并将每个元素中的特定字段当做其主键。
逐个元素地执行添加、删除或更新操作。结果顺序无法得到保证。

<!--
This merge strategy uses a special tag on each field called a `patchMergeKey`. The
`patchMergeKey` is defined for each field in the Kubernetes source code:
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)
When merging a list of maps, the field specified as the `patchMergeKey` for a given element
is used like a map key for that element.

**Example:** Use `kubectl apply` to update the `containers` field of a PodSpec.
This merges the list as though it was a map where each element is keyed
by `name`.
-->
此合并策略会使用每个字段上的一个名为 `patchMergeKey` 的特殊标签。
Kubernetes 源代码中为每个字段定义了 `patchMergeKey`：
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)。
当合并由 map 组成的 list 时，给定元素中被设置为 `patchMergeKey`
的字段会被当做该元素的 map 键值来使用。

**例如：** 使用 `kubectl apply` 来更新 Pod 规约中的 `containers` 字段。
此操作会将 `containers` 列表视作一个映射来执行合并，每个元素的主键为 `name`。

<!--
```yaml
# last-applied-configuration value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; will be retained
      image: helper:1.3

# configuration file value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; will be added in result
      image: helper:1.3

# live configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field will be retained
    - name: nginx-helper-d # key: nginx-helper-d; will be retained
      image: helper:1.3

# result after merge
    containers:
    - name: nginx
      image: nginx:1.16
      # Element nginx-helper-a was deleted
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field was retained
    - name: nginx-helper-c # Element was added
      image: helper:1.3
    - name: nginx-helper-d # Element was ignored
      image: helper:1.3
```
-->
```yaml
# last-applied-configuration 值
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # 键 nginx-helper-a 会被删除
      image: helper:1.3
    - name: nginx-helper-b # 键 nginx-helper-b 会被保留
      image: helper:1.3

# 配置文件值
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # 键 nginx-helper-c 会被添加
      image: helper:1.3

# 现时配置
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 字段会被保留
    - name: nginx-helper-d # 键 nginx-helper-d 会被保留
      image: helper:1.3

# 合并结果
    containers:
    - name: nginx
      image: nginx:1.16
      # 元素 nginx-helper-a 被删除
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 字段被保留
    - name: nginx-helper-c # 新增元素
      image: helper:1.3
    - name: nginx-helper-d # 此元素被忽略（保留）
      image: helper:1.3
```

<!--
**Explanation:**

- The container named "nginx-helper-a" was deleted because no container
  named "nginx-helper-a" appeared in the configuration file.
- The container named "nginx-helper-b" retained the changes to `args`
  in the live configuration. `kubectl apply` was able to identify
  that "nginx-helper-b" in the live configuration was the same
  "nginx-helper-b" as in the configuration file, even though their fields
  had different values (no `args` in the configuration file). This is
  because the `patchMergeKey` field value (name) was identical in both.
- The container named "nginx-helper-c" was added because no container
  with that name appeared in the live configuration, but one with
  that name appeared in the configuration file.
- The container named "nginx-helper-d" was retained because
  no element with that name appeared in the last-applied-configuration.
-->
**解释：**

- 名为 "nginx-helper-a" 的容器被删除，因为配置文件中不存在同名的容器。
- 名为 "nginx-helper-b" 的容器的现时配置中的 `args` 被保留。
  `kubectl apply` 能够辩识出现时配置中的容器 "nginx-helper-b" 与配置文件
  中的容器 "nginx-helper-b" 相同，即使它们的字段值有些不同（配置文件中未给定
  `args` 值）。这是因为 `patchMergeKey` 字段（name）的值在两个版本中都一样。
- 名为 "nginx-helper-c" 的容器是新增的，因为在配置文件中的这个容器尚不存在于现时配置中。
- 名为 "nginx-helper-d" 的容器被保留下来，因为在 last-applied-configuration
  中没有与之同名的元素。

<!--
#### Merge a list of primitive elements

As of Kubernetes 1.5, merging lists of primitive elements is not supported.
-->
#### 合并基本类型元素 list

在 Kubernetes 1.5 中，尚不支持对由基本类型元素构成的 list 进行合并。

{{< note >}}
<!--
Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.
-->
选择上述哪种策略是由源码中给定字段的 `patchStrategy` 标记来控制的：
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)。
如果 list 类型字段未设置 `patchStrategy`，则整个 list 会被替换掉。
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{{< /comment >}}

<!--
## Default field values

The API server sets certain fields to default values in the live configuration if they are
not specified when the object is created.

Here's a configuration file for a Deployment. The file does not specify `strategy`:
-->
## 默认字段值  {#default-field-values}

API 服务器会在对象创建时其中某些字段未设置的情况下在现时配置中为其设置默认值。

下面是一个 Deployment 的配置文件。文件未设置 `strategy`：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 创建对象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印现时配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the API server set several fields to default values in the live
configuration. These fields were not specified in the configuration file.
-->
输出显示 API 在现时配置中为某些字段设置了默认值。
这些字段在配置文件中并未设置。

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # defaulted by apiserver
  strategy:
    rollingUpdate: # defaulted by apiserver - derived from strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # defaulted by apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # defaulted by apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # defaulted by apiserver
        resources: {} # defaulted by apiserver
        terminationMessagePath: /dev/termination-log # defaulted by apiserver
      dnsPolicy: ClusterFirst # defaulted by apiserver
      restartPolicy: Always # defaulted by apiserver
      securityContext: {} # defaulted by apiserver
      terminationGracePeriodSeconds: 30 # defaulted by apiserver
# ...
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1           # API 服务器所设默认值
  strategy:
    rollingUpdate:      # API 服务器基于 strategy.type 所设默认值
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # API 服务器所设默认值
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent    # API 服务器所设默认值
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP       # API 服务器所设默认值
        resources: {}         # API 服务器所设默认值
        terminationMessagePath: /dev/termination-log    # API 服务器所设默认值
      dnsPolicy: ClusterFirst       # API 服务器所设默认值
      restartPolicy: Always         # API 服务器所设默认值
      securityContext: {}           # API 服务器所设默认值
      terminationGracePeriodSeconds: 30        # API 服务器所设默认值
# ...
```

<!--
In a patch request, defaulted fields are not re-defaulted unless they are explicitly cleared
as part of a patch request. This can cause unexpected behavior for
fields that are defaulted based
on the values of other fields. When the other fields are later changed,
the values defaulted from them will not be updated unless they are
explicitly cleared.
-->
在补丁请求中，已经设置了默认值的字段不会被重新设回其默认值，
除非在补丁请求中显式地要求清除。对于默认值取决于其他字段的某些字段而言，
这可能会引发一些意想不到的行为。当所依赖的其他字段后来发生改变时，
基于它们所设置的默认值只能在显式执行清除操作时才会被更新。

<!--
For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the configuration file, even
if the desired values match the server defaults. This makes it
easier to recognize conflicting values that will not be re-defaulted
by the server.

**Example:**
-->
为此，建议在配置文件中为服务器设置默认值的字段显式提供定义，
即使所给的定义与服务器端默认值设定相同。
这样可以使得辩识无法被服务器重新基于默认值来设置的冲突字段变得容易。

**示例：**

<!--
```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# configuration file
spec:
  strategy:
    type: Recreate # updated value
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# live configuration
spec:
  strategy:
    type: RollingUpdate # defaulted value
    rollingUpdate: # defaulted value derived from type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# result after merge - ERROR!
spec:
  strategy:
    type: Recreate # updated value: incompatible with rollingUpdate
    rollingUpdate: # defaulted value: incompatible with "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
-->
```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 配置文件
spec:
  strategy:
    type: Recreate   # 更新的值
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 现时配置
spec:
  strategy:
    type: RollingUpdate    # 默认设置的值
    rollingUpdate:         # 基于 type 设置的默认值
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 合并后的结果 - 出错！
spec:
  strategy:
    type: Recreate     # 更新的值：与 rollingUpdate 不兼容
    rollingUpdate:     # 默认设置的值：与 "type: Recreate" 冲突
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

<!--
**Explanation:**

1. The user creates a Deployment without defining `strategy.type`.
2. The server defaults `strategy.type` to `RollingUpdate` and defaults the
   `strategy.rollingUpdate` values.
3. The user changes `strategy.type` to `Recreate`. The `strategy.rollingUpdate`
   values remain at their defaulted values, though the server expects them to be cleared.
   If the `strategy.rollingUpdate` values had been defined initially in the configuration file,
   it would have been more clear that they needed to be deleted.
4. Apply fails because `strategy.rollingUpdate` is not cleared. The `strategy.rollingupdate`
   field cannot be defined with a `strategy.type` of `Recreate`.
-->
**解释：**

1. 用户创建 Deployment，未设置 `strategy.type`。
2. 服务器为 `strategy.type` 设置默认值 `RollingUpdate`，并为 `strategy.rollingUpdate`
   设置默认值。
3. 用户改变 `strategy.type` 为 `Recreate`。字段 `strategy.rollingUpdate`
   仍会取其默认设置值，尽管服务器期望该字段被清除。
   如果 `strategy.rollingUpdate` 值最初于配置文件中定义，
   则它们需要被清除这一点就更明确一些。
4. `apply` 操作失败，因为 `strategy.rollingUpdate` 未被清除。
   `strategy.rollingupdate` 在 `strategy.type` 为 `Recreate` 不可被设定。

<!--
Recommendation: These fields should be explicitly defined in the object configuration file:

- Selectors and PodTemplate labels on workloads, such as Deployment, StatefulSet, Job, DaemonSet,
  ReplicaSet, and ReplicationController
- Deployment rollout strategy
-->
建议：以下字段应该在对象配置文件中显式定义：

- 如 Deployment、StatefulSet、Job、DaemonSet、ReplicaSet 和 ReplicationController
  这类负载的选择算符和 `PodTemplate` 标签
- Deployment 的上线策略

<!--
### How to clear server-defaulted fields or fields set by other writers

Fields that do not appear in the configuration file can be cleared by
setting their values to `null` and then applying the configuration file.
For fields defaulted by the server, this triggers re-defaulting
the values.
-->
### 如何清除服务器端按默认值设置的字段或者被其他写者设置的字段

没有出现在配置文件中的字段可以通过将其值设置为 `null` 并应用配置文件来清除。
对于由服务器按默认值设置的字段，清除操作会触发重新为字段设置新的默认值。

<!--
## How to change ownership of a field between the configuration file and direct imperative writers

These are the only methods you should use to change an individual object field:

- Use `kubectl apply`.
- Write directly to the live configuration without modifying the configuration file:
for example, use `kubectl scale`.
-->
## 如何将字段的属主在配置文件和直接指令式写者之间切换

更改某个对象字段时，应该采用下面的方法：

- 使用 `kubectl apply`.
- 直接写入到现时配置，但不更改配置文件本身，例如使用 `kubectl scale`。

<!--
### Changing the owner from a direct imperative writer to a configuration file

Add the field to the configuration file. For the field, discontinue direct updates to
the live configuration that do not go through `kubectl apply`.
-->
### 将属主从直接指令式写者更改为配置文件

将字段添加到配置文件。针对该字段，不再直接执行对现时配置的修改。
修改均通过 `kubectl apply` 来执行。

<!--
### Changing the owner from a configuration file to a direct imperative writer

As of Kubernetes 1.5, changing ownership of a field from a configuration file to
an imperative writer requires manual steps:

- Remove the field from the configuration file.
- Remove the field from the `kubectl.kubernetes.io/last-applied-configuration` annotation on the live object.
-->
### 将属主从配置文件改为直接指令式写者

在 Kubernetes 1.5 中，将字段的属主从配置文件切换到某指令式写者需要手动执行以下步骤：

- 从配置文件中删除该字段；
- 将字段从现时对象的 `kubectl.kubernetes.io/last-applied-configuration`
  注解中删除。

<!--
## Changing management methods

Kubernetes objects should be managed using only one method at a time.
Switching from one method to another is possible, but is a manual process.
-->
## 更改管理方法  {#changing-management-methods}

Kubernetes 对象在同一时刻应该只用一种方法来管理。
从一种方法切换到另一种方法是可能的，但这一切换是一个手动过程。

{{< note >}}
<!--
It is OK to use imperative deletion with declarative management.
-->
在声明式管理方法中使用指令式命令来删除对象是可以的。
{{< /note >}}

{{< comment >}}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{{< /comment >}}

<!--
### Migrating from imperative command management to declarative object configuration

Migrating from imperative command management to declarative object
configuration involves several manual steps:
-->
### 从指令式命令管理切换到声明式对象配置

从指令式命令管理切换到声明式对象配置管理的切换包含以下几个手动步骤：

<!--
1. Export the live object to a local configuration file:

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

1. Manually remove the `status` field from the configuration file.
-->
1. 将现时对象导出到本地配置文件：

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

2. 手动移除配置文件中的 `status` 字段。

   {{< note >}}
   <!--
   This step is optional, as `kubectl apply` does not update the status field
   even if it is present in the configuration file.
   -->
   这一步骤是可选的，因为 `kubectl apply` 并不会更新 status 字段，
   即便配置文件中包含 status 字段。
   {{< /note >}}

<!--
1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
3. 设置对象上的 `kubectl.kubernetes.io/last-applied-configuration` 注解：

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

4. 更改过程，使用 `kubectl apply` 专门管理对象。  

{{< comment >}}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{{< /comment >}}

<!--
### Migrating from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
### 从指令式对象配置切换到声明式对象配置

1. 在对象上设置 `kubectl.kubernetes.io/last-applied-configuration` 注解：

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. 自此排他性地使用 `kubectl apply` 来管理对象。

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定义控制器选择算符和 PodTemplate 标签

{{< warning >}}
<!--
Updating selectors on controllers is strongly discouraged.
-->
强烈不建议更改控制器上的选择算符。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

**Example:**
-->
建议的方法是定义一个不可变更的 PodTemplate 标签，
仅用于控制器选择算符且不包含其他语义性的含义。

**示例：**

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}}

<!--
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用指令式命令管理 Kubernetes 对象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置文件对 Kubernetes 对象执行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectl 命令参考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
