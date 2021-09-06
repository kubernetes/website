---
title: 使用 Kustomize 对 Kubernetes 对象进行声明式管理
content_type: task
weight: 20
---
<!--
title: Declarative Management of Kubernetes Objects Using Kustomize
content_type: task
weight: 20
-->
<!-- overview -->

<!--
[Kustomize](https://github.com/kubernetes-sigs/kustomize) is a standalone tool
to customize Kubernetes objects
through a [kustomization file](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization).
-->
[Kustomize](https://github.com/kubernetes-sigs/kustomize) 是一个独立的工具，用来通过
[kustomization 文件](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization)
定制 Kubernetes 对象。

<!--
Since 1.14, Kubectl also
supports the management of Kubernetes objects using a kustomization file.
To view Resources found in a directory containing a kustomization file, run the following command:
-->
从 1.14 版本开始，`kubectl` 也开始支持使用 kustomization 文件来管理 Kubernetes 对象。
要查看包含 kustomization 文件的目录中的资源，执行下面的命令：

```shell
kubectl kustomize <kustomization_directory>
```

<!--
To apply those Resources, run `kubectl apply` with `- -kustomize` or `-k` flag:
-->
要应用这些资源，使用参数 `--kustomize` 或 `-k` 标志来执行 `kubectl apply`：

```shell
kubectl apply -k <kustomization_directory>
```

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/install-kubectl/).
-->
安装 [`kubectl`](/zh/docs/tasks/tools/install-kubectl/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Overview of Kustomize

Kustomize is a tool for customizing Kubernetes configurations. It has the following features to manage application configuration files:

* generating resources from other sources
* setting cross-cutting fields for resources
* composing and customizing collections of resources
-->
## Kustomize 概述    {#overview-of-kustomize}

Kustomize 是一个用来定制 Kubernetes 配置的工具。它提供以下功能特性来管理
应用配置文件：

* 从其他来源生成资源
* 为资源设置贯穿性（Cross-Cutting）字段
* 组织和定制资源集合

<!--
### Generating Resources

ConfigMaps and Secrets hold configuration or sensitive data that are used by other Kubernetes objects, such as Pods. The source of truth of ConfigMaps or Secrets are usually external to a cluster, such as a `.properties` file or an SSH keyfile.
Kustomize has `secretGenerator` and `configMapGenerator`, which generate Secret and ConfigMap from files or literals.
-->
### 生成资源   {#generating-resources}

ConfigMap 和 Secret 包含其他 Kubernetes 对象（如 Pod）所需要的配置或敏感数据。
ConfigMap 或 Secret 中数据的来源往往是集群外部，例如某个 `.properties`
文件或者 SSH 密钥文件。
Kustomize 提供 `secretGenerator` 和 `configMapGenerator`，可以基于文件或字面
值来生成 Secret 和 ConfigMap。

<!--
#### configMapGenerator

To generate a ConfigMap from a file, add an entry to the `files` list in `configMapGenerator`. Here is an example of generating a ConfigMap with a data item from a `.properties` file:
-->
#### configMapGenerator

要基于文件来生成 ConfigMap，可以在 `configMapGenerator` 的 `files`
列表中添加表项。
下面是一个根据 `.properties` 文件中的数据条目来生成 ConfigMap 的示例：

```shell
# 生成一个  application.properties 文件
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

<!--
The generated ConfigMap can be examined with the following command:
-->
所生成的 ConfigMap 可以使用下面的命令来检查：

```shell
kubectl kustomize ./
```

<!--
The generated ConfigMap is:
-->
所生成的 ConfigMap 为：

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```

<!--
ConfigMaps can also be generated from literal key-value pairs. To generate a ConfigMap from a literal key-value pair, add an entry to the `literals` list in configMapGenerator. Here is an example of generating a ConfigMap with a data item from a key-value pair:
-->
ConfigMap 也可基于字面的键值偶对来生成。要基于键值偶对来生成 ConfigMap，
在 `configMapGenerator` 的 `literals` 列表中添加表项。下面是一个例子，展示
如何使用键值偶对中的数据条目来生成 ConfigMap 对象：

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

<!--
The generated ConfigMap can be checked by the following command:
-->
可以用下面的命令检查所生成的 ConfigMap：

```shell
kubectl kustomize ./
```

<!--
The generated ConfigMap is:
-->
所生成的 ConfigMap 为：

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

#### secretGenerator

<!--
You can generate Secrets from files or literal key-value pairs. To generate a Secret from a file, add an entry to the `files` list in `secretGenerator`. Here is an example of generating a Secret with a data item from a file:
-->
你可以基于文件或者键值偶对来生成 Secret。要使用文件内容来生成 Secret，
在 `secretGenerator` 下面的 `files` 列表中添加表项。
下面是一个根据文件中数据来生成 Secret 对象的示例：

```shell
# 创建一个 password.txt 文件
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

<!--
The generated Secret is as follows:
-->
所生成的 Secret 如下：

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

<!--
To generate a Secret from a literal key-value pair, add an entry to `literals` list in `secretGenerator`. Here is an example of generating a Secret with a data item from a key-value pair:
-->
要基于键值偶对字面值生成 Secret，先要在 `secretGenerator` 的 `literals`
列表中添加表项。下面是基于键值偶对中数据条目来生成 Secret 的示例：

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

<!--
The generated Secret is as follows:
-->
所生成的 Secret 如下：

```yaml
apiVersion: v1
data:
  password: c2VjcmV0
  username: YWRtaW4=
kind: Secret
metadata:
  name: example-secret-2-t52t6g96d8
type: Opaque
```

#### generatorOptions

<!--
The generated ConfigMaps and Secrets have a content hash suffix appended. This ensures that a new ConfigMap or Secret is generated when the contents are changed. To disable the behavior of appending a suffix, one can use `generatorOptions`. Besides that, it is also possible to specify cross-cutting options for generated ConfigMaps and Secrets.
-->
所生成的 ConfigMap 和 Secret 都会包含内容哈希值后缀。
这是为了确保内容发生变化时，所生成的是新的 ConfigMap 或 Secret。
要禁止自动添加后缀的行为，用户可以使用 `generatorOptions`。
除此以外，为生成的 ConfigMap 和 Secret 指定贯穿性选项也是可以的。

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-3
  literals:
  - FOO=Bar
generatorOptions:
  disableNameSuffixHash: true
  labels:
    type: generated
  annotations:
    note: generated
EOF
```

<!--
Run`kubectl kustomize ./` to view the generated ConfigMap:
-->
运行 `kubectl kustomize ./` 来查看所生成的 ConfigMap：

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  annotations:
    note: generated
  labels:
    type: generated
  name: example-configmap-3
```

<!--
### Setting cross-cutting fields

It is quite common to set cross-cutting fields for all Kubernetes resources in a project.
Some use cases for setting cross-cutting fields:

* setting the same namespace for all Resources
* adding the same name prefix or suffix
* adding the same set of labels
* adding the same set of annotations

Here is an example:
-->
### 设置贯穿性字段  {#setting-cross-cutting-fields}

在项目中为所有 Kubernetes 对象设置贯穿性字段是一种常见操作。
贯穿性字段的一些使用场景如下：

* 为所有资源设置相同的名字空间
* 为所有对象添加相同的前缀或后缀
* 为对象添加相同的标签集合
* 为对象添加相同的注解集合

下面是一个例子：

```shell
# 创建一个 deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to view those fields are all set in the Deployment Resource:
-->
执行 `kubectl kustomize ./` 查看这些字段都被设置到 Deployment 资源上：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```

<!--
### Composing and Customizing Resources

It is common to compose a set of Resources in a project and manage them inside
the same file or directory.
Kustomize offers composing Resources from different files and applying patches or other customization to them.
-->
### 组织和定制资源    {#composing-and-customizing-resources}

一种常见的做法是在项目中构造资源集合并将其放到同一个文件或目录中管理。
Kustomize 提供基于不同文件来组织资源并向其应用补丁或者其他定制的能力。

<!--
#### Composing

Kustomize supports composition of different resources. The `resources` field, in the `kustomization.yaml` file, defines the list of resources to include in a configuration. Set the path to a resource's configuration file in the `resources` list.
Here is an example of an NGINX application comprised of a Deployment and a Service:
-->
#### 组织    {#composing}

Kustomize 支持组合不同的资源。`kustomization.yaml` 文件的 `resources` 字段
定义配置中要包含的资源列表。你可以将 `resources` 列表中的路径设置为资源配置文件
的路径。下面是由 Deployment 和 Service 构成的 NGINX 应用的示例：


```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建 service.yaml 文件
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# 创建 kustomization.yaml 来组织以上两个资源
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

<!--
The Resources from `kubectl kustomize ./` contain both the Deployment and the Service objects.
-->
`kubectl kustomize ./` 所得到的资源中既包含 Deployment 也包含 Service 对象。

<!--
#### Customizing

Patches can be used to apply different customizations to Resources. Kustomize supports different patching
mechanisms through `patchesStrategicMerge` and `patchesJson6902`. `patchesStrategicMerge` is a list of file paths. Each file should be resolved to a [strategic merge patch](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md). The names inside the patches must match Resource names that are already loaded. Small patches that do one thing are recommended. For example, create one patch for increasing the deployment replica number and another patch for setting the memory limit.
-->
#### 定制   {#customizing}

补丁文件（Patches）可以用来对资源执行不同的定制。
Kustomize 通过 `patchesStrategicMerge` 和 `patchesJson6902` 支持不同的打补丁
机制。`patchesStrategicMerge` 的内容是一个文件路径的列表，其中每个文件都应可解析为
[策略性合并补丁（Strategic Merge Patch）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md)。
补丁文件中的名称必须与已经加载的资源的名称匹配。
建议构造规模较小的、仅做一件事情的补丁。
例如，构造一个补丁来增加 Deployment
的副本个数；构造另外一个补丁来设置内存限制。

```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 生成一个补丁 increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# 生成另一个补丁 set_memory.yaml
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
          limits:
            memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patchesStrategicMerge:
- increase_replicas.yaml
- set_memory.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to view the Deployment:
-->
执行 `kubectl kustomize ./` 来查看 Deployment：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 512Mi
```

<!--
Not all Resources or fields support strategic merge patches. To support modifying arbitrary fields in arbitrary Resources,
Kustomize offers applying [JSON patch](https://tools.ietf.org/html/rfc6902) through `patchesJson6902`.
To find the correct Resource for a Json patch, the group, version, kind and name of that Resource need to be
specified in `kustomization.yaml`. For example, increasing the replica number of a Deployment object can also be done
through `patchesJson6902`.
-->
并非所有资源或者字段都支持策略性合并补丁。为了支持对任何资源的任何字段进行修改，
Kustomize 提供通过 `patchesJson6902` 来应用 [JSON 补丁](https://tools.ietf.org/html/rfc6902)
的能力。为了给 JSON 补丁找到正确的资源，需要在 `kustomization.yaml` 文件中指定资源的
组（group）、版本（version）、类别（kind）和名称（name）。
例如，为某 Deployment 对象增加副本个数的操作也可以通过 `patchesJson6902`
来完成：

```shell
# 创建一个 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建一个 JSON 补丁文件
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# 创建一个 kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to see the `replicas` field is updated:
-->
执行 `kubectl kustomize ./` 以查看 `replicas` 字段被更新：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```

<!--
In addition to patches, Kustomize also offers customizing container images or injecting field values from other objects into containers
without creating patches. For example, you can change the image used inside containers by specifying the new image in `images` field in `kustomization.yaml`.
-->
除了补丁之外，Kustomize 还提供定制容器镜像或者将其他对象的字段值注入到容器
中的能力，并且不需要创建补丁。
例如，你可以通过在 `kustomization.yaml` 文件的 `images` 字段设置新的镜像来
更改容器中使用的镜像。

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: 1.4.0
EOF
```

<!--
Run `kubectl kustomize ./` to see that the image being used is updated:
-->
执行 `kubectl kustomize ./` 以查看所使用的镜像已被更新：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```

<!--
Sometimes, the application running in a Pod may need to use configuration values from other objects. For example,
a Pod from a Deployment object need to read the corresponding Service name from Env or as a command argument.
Since the Service name may change as `namePrefix` or `nameSuffix` is added in the `kustomization.yaml` file. It is
not recommended to hard code the Service name in the command argument. For this usage, Kustomize can inject the Service name into containers through `vars`.
-->
有些时候，Pod 中运行的应用可能需要使用来自其他对象的配置值。
例如，某 Deployment 对象的 Pod 需要从环境变量或命令行参数中读取读取
Service 的名称。
由于在 `kustomization.yaml` 文件中添加 `namePrefix` 或 `nameSuffix` 时
Service 名称可能发生变化，建议不要在命令参数中硬编码 Service 名称。
对于这种使用场景，Kustomize 可以通过 `vars` 将 Service 名称注入到容器中。

```shell
# 创建一个 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "$(MY_SERVICE_NAME)"]
EOF

# 创建一个 service.yaml 文件
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

vars:
- name: MY_SERVICE_NAME
  objref:
    kind: Service
    name: my-nginx
    apiVersion: v1
EOF
```

<!--
Run `kubectl kustomize ./` to see that the Service name injected into containers is `dev-my-nginx-001`:
-->
执行 `kubectl kustomize ./` 以查看注入到容器中的 Service 名称是 `dev-my-nginx-001`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

<!--
## Bases and Overlays

Kustomize has the concepts of **bases** and **overlays**. A **base** is a directory with a `kustomization.yaml`, which contains a
set of resources and associated customization. A base could be either a local directory or a directory from a remote repo,
as long as a `kustomization.yaml` is present inside. An **overlay** is a directory with a `kustomization.yaml` that refers to other
kustomization directories as its `bases`. A **base** has no knowledge of an overlay and can be used in multiple overlays.
An overlay may have multiple bases and it composes all resources
from bases and may also have customization on top of them.

Here is an example of a base:
-->
## 基准（Bases）与覆盖（Overlays）

Kustomize 中有 **基准（bases）** 和 **覆盖（overlays）** 的概念区分。
**基准** 是包含 `kustomization.yaml` 文件的一个目录，其中包含一组资源及其相关的定制。
基准可以是本地目录或者来自远程仓库的目录，只要其中存在 `kustomization.yaml` 文件即可。
**覆盖** 也是一个目录，其中包含将其他 kustomization 目录当做 `bases` 来引用的
`kustomization.yaml` 文件。
**基准**不了解覆盖的存在，且可被多个覆盖所使用。
覆盖则可以有多个基准，且可针对所有基准中的资源执行组织操作，还可以在其上执行定制。

```shell
# 创建一个包含基准的目录 
mkdir base
# 创建 base/deployment.yaml
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# 创建 base/service.yaml 文件
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# 创建 base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

<!--
This base can be used in multiple overlays. You can add different `namePrefix` or other cross-cutting fields
in different overlays. Here are two overlays using the same base.
-->
此基准可在多个覆盖中使用。你可以在不同的覆盖中添加不同的 `namePrefix` 或
其他贯穿性字段。下面是两个使用同一基准的覆盖：

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
bases:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
bases:
- ../base
namePrefix: prod-
EOF
```

<!--
## How to apply/view/delete objects using Kustomize

Use `--kustomize` or `-k` in `kubectl` commands to recognize Resources managed by `kustomization.yaml`.
Note that `-k` should point to a kustomization directory, such as
-->
## 如何使用 Kustomize 来应用、查看和删除对象

在 `kubectl` 命令中使用 `--kustomize` 或 `-k` 参数来识别被 `kustomization.yaml` 所管理的资源。
注意 `-k` 要指向一个 kustomization 目录。例如：

```shell
kubectl apply -k <kustomization 目录>/
```

<!--
Given the following `kustomization.yaml`,
-->
假定使用下面的 `kustomization.yaml`，

```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建 kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
commonLabels:
  app: my-nginx
resources:
- deployment.yaml
EOF
```

<!--
Run the following command to apply the Deployment object `dev-my-nginx`:
-->
执行下面的命令来应用 Deployment 对象 `dev-my-nginx`：

```shell
kubectl apply -k ./
```
```
deployment.apps/dev-my-nginx created
```

<!--
Run one of the following commands to view the Deployment object `dev-my-nginx`:
-->
运行下面的命令之一来查看 Deployment 对象 `dev-my-nginx`：

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

<!--
Run the following command to compare the Deployment object `dev-my-nginx` against the state that the cluster would be in if the manifest was applied:
-->
执行下面的命令来比较 Deployment 对象 `dev-my-nginx` 与清单被应用之后
集群将处于的状态：

```shell
kubectl diff -k ./
```

<!--
Run the following command to delete the Deployment object `dev-my-nginx`:
-->
执行下面的命令删除 Deployment 对象 `dev-my-nginx`：

```shell
kubectl delete -k ./
```
```
deployment.apps "dev-my-nginx" deleted
```

<!--
## Kustomize Feature List
-->
## Kustomize 功能特性列表

<!--
| Field                 | Type                                                                                                         | Explanation                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | add namespace to all resources                                                     |
| namePrefix            | string                                                                                                       | value of this field is prepended to the names of all resources                     |
| nameSuffix            | string                                                                                                       | value of this field is appended to the names of all resources                      |
| commonLabels          | map[string]string                                                                                            | labels to add to all resources and selectors                                       |
| commonAnnotations     | map[string]string                                                                                            | annotations to add to all resources                                                |
| resources             | []string                                                                                                     | each entry in this list must resolve to an existing resource configuration file    |
| configmapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L99)  | Each entry in this list generates a ConfigMap                                      |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L106)     | Each entry in this list generates a Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L109) | Modify behaviors of all ConfigMap and Secret generator                             |
| bases                 | []string                                                                                                     | Each entry in this list should resolve to a directory containing a kustomization.yaml file |
| patchesStrategicMerge | []string                                                                                                     | Each entry in this list should resolve a strategic merge patch of a Kubernetes object |
| patchesJson6902       | [][Json6902](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/patchjson6902.go#L8)             | Each entry in this list should resolve to a Kubernetes object and a Json Patch     |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L31)                       | Each entry is to capture text from one resource's field                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/tree/master/api/types/image.go#L23)                   | Each entry is to modify the name, tags and/or digest for one image without creating patches |
| configurations        | []string                                                                                                     | Each entry in this list should resolve to a file containing [Kustomize transformer configurations](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds                  | []string                                                                                                     | Each entry in this list should resolve to an OpenAPI definition file for Kubernetes types |
-->

| 字段                  | 类型                                                                                                         | 解释                                                                               |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | 为所有资源添加名字空间                                                     |
| namePrefix            | string                                                                                                       | 此字段的值将被添加到所有资源名称前面                     |
| nameSuffix            | string                                                                                                       | 此字段的值将被添加到所有资源名称后面                      |
| commonLabels          | map[string]string                                                                                            | 要添加到所有资源和选择算符的标签                                       |
| commonAnnotations     | map[string]string                                                                                            | 要添加到所有资源的注解                                                |
| resources             | []string                                                                                                     | 列表中的每个条目都必须能够解析为现有的资源配置文件    |
| configmapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L99)  | 列表中的每个条目都会生成一个 ConfigMap                                      |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L106)     | 列表中的每个条目都会生成一个 Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L109) | 更改所有 ConfigMap 和 Secret 生成器的行为 |
| bases                 | []string                                                                                                     | 列表中每个条目都应能解析为一个包含 kustomization.yaml 文件的目录 |
| patchesStrategicMerge | []string                                                                                                     | 列表中每个条目都能解析为某 Kubernetes 对象的策略性合并补丁 |
| patchesJson6902       | [][Json6902](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/patchjson6902.go#L8)             | 列表中每个条目都能解析为一个 Kubernetes 对象和一个 JSON 补丁 |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L31)                       | 每个条目用来从某资源的字段来析取文字                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/tree/master/api/types/image.go#L23)                   | 每个条目都用来更改镜像的名称、标记与/或摘要，不必生成补丁 |
| configurations        | []string                                                                                                     | 列表中每个条目都应能解析为一个包含 [Kustomize 转换器配置](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) 的文件 |
| crds                  | []string                                                                                                     | 列表中每个条目都赢能够解析为 Kubernetes 类别的 OpenAPI 定义文件 |

## {{% heading "whatsnext" %}}

<!--
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Kubectl 命令参考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

