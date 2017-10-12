---
title: 使用配置文件以声明的方式管理Kubernetes对象
---

{% capture overview %}
将多个对象配置文件存储在文件夹中，使用 `kubectl apply` 可以递归的创建和更新这些对象。
可以通过这种方式进行Kubernetes对象的创建，更新和删除操作。
这种方式保留了对活动对象的写入，而不将改动合并到对象配置文件中。
{% endcapture %}

{% capture body %}

## 权衡

`kubectl` 工具支持三种对象的管理:

* 命令式的方式
* 命令式的对象配置
* 声明式的对象配置

参见[Kubernetes对象管理](/docs/concepts/tools/kubectl/object-management-overview/)
讨论各种对象管理的优缺点.

## 前言

声明式对象管理需要对Kubernetes对象定义和配置有明确的了解。如果您还没有，
请阅读下面文档：

- [使用命令式的方式管理 Kubernetes 对象](/docs/concepts/tools/kubectl/object-management-using-imperative-commands/)
- [使用配置文件的方式管理Kubernetes对象](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)

下面是本文档中使用到的术语定义：

- *对象配置文件 / 配置文件*：一个定义Kubernetes对象配置的文件。
  本主题介绍如何将配置文件传递给 `kubectl apply`。配置文件通常保存在源控件中，
  比如Git。
- *活动对象配置 / 活动配置*：由Kubernetes集群观察到的一个对象的实时配置值。
  它被保存在Kubernetes集群存储中，通常是etcd。
- *声明式配置写入者 /  声明写入者*: 对活动对象进行更新的人员或者软件组件。
  本主题中提到的写入者对对象的配置文件进行修改，并使用`kubectl apply` 写入这些改动。

## 如何创建对象

使用 `kubectl apply` 创建所有对象（除非已经存在的对象），由指定目录中的配置文件定义。

```shell
kubectl apply -f <directory>/
```

这将在每个对象上设置 `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
注释。注释中包含用于创建对象的配置文件的内容。

**注**: 添加 `-R` 标签可以递归的处理目录。

以下是对象配置文件的示例：

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml" %}

使用 `kubectl apply` 创建对象：

```shell
kubectl apply -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml
```

使用 `kubectl get` 打印实时配置：

```shell
kubectl get -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml -o yaml
```

输出显示 `kubectl.kubernetes.io / last-applied-configuration` 注释已写入实时配置，与配置文件相匹配：

```shell
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

## 如何更新对象

您也可以使用`kubectl apply`来更新目录中定义的所有对象，即使这些对象已经存在。
这种方法完成了以下工作：

1.在实时配置中设置出现在配置文件中的字段。
2.清除实时配置中配置文件中删除的字段。

```shell
kubectl apply -f <directory>/
```

**注**: 添加 `-R` 标签可以递归的处理目录。

以下是对象配置文件的示例：

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml" %}

使用 `kubectl apply` 创建对象：

```shell
kubectl apply -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml
```

**注：**
为了演示目的，上述命令使用单个配置文件而不是一个目录。

使用 `kubectl get` 打印实时配置：

```shell
kubectl get -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml -o yaml
```

输出显示 `kubectl.kubernetes.io/last-applied-configuration`  注释已写入实时配置，与配置文件相匹配：

```shell
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

使用`kubectl scale`直接更新实时配置中的`replicas`字段。
这里不使用`kubectl apply`：

```shell
kubectl scale deployment/nginx-deployment --replicas 2
```

使用 `kubectl get` 打印实时配置：

```shell
kubectl get -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml -o yaml
```

输出显示`replicas`字段已设置为2，`last-applied-configuration`注释不包含`replicas`字段：

```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  annotations:
    # ...
    # note that the annotation does not contain replicas
    # because it was not updated through apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
  # ...
  minReadySeconds: 5
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

更新“simple_deployment.yaml”配置文件，将镜像从“nginx：1.7.9”更改为“nginx：1.11.9”，
并删除“minReadySeconds”字段：

{% include code.html language="yaml" file="update_deployment.yaml" ghlink="/cn/docs/tutorials/object-management-kubectl/update_deployment.yaml" %}

应用对配置文件所做的更改：

```shell
kubectl apply -f https://k8s.io/cn/docs/tutorials/object-management-kubectl/update_deployment.yaml
```

使用 `kubectl get` 打印实时配置：

```
kubectl get -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml -o yaml
```

输出显示对实时配置的以下更改：

- `replicas` 字段保留 `kubectl scale` 设置的值2。
  这是可能的，因为它从配置文件中省略了。
- `image`字段从`nginx:1.7.9`升级到`nginx:1.11.9`。
- `last-applied-configuration`已经使用新的镜像更新了。
- `minReadySeconds`字段被清除。
- `last-applied-configuration`注释不再包含`minReadySeconds`字段。

```shell
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.11.9,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.11.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.11.9 # Set by `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

**警告**：
不支持`kubectl apply`与命令式对象配置命令`create`和`replace`混合使用。
因为`create` 和 `replace`不保留`kubectl.kubernetes.io / last-applied-configuration`字段，
`kubectl apply`使用这个字段进行更新。

## 如何删除对象

两种方式删除`kubectl apply`管理的对象。

### 推荐： `kubectl delete -f <filename>`

推荐使用命令式方式手动删除，因为它能够更明确被删除对象，并且不大可能误删除：

```shell
kubectl delete -f <filename>
```

### 可选： `kubectl apply -f <directory/> --prune -l your=label`

如果对这条命令不够了解，请不要使用。

**警告：** `kubectl apply --prune` is in alpha, and backwards incompatible
changes might be introduced in subsequent releases.

**警告：** 请慎重使用该命令，防止无意中删除对象。

作为`kubectl delete的`替代方法，您可以使用`kubectl apply`来识别从目录中删除配置文件后要删除的对象。
应用`--prune`查询所有匹配一组标签的对象的API服务器，并尝试将返回的活动对象配置与对象配置文件进行匹配。
如果对象与查询匹配，并且目录中没有配置文件，并且没有“last-applied-configuration”注释，则会被删除。

{% comment %}
TODO(pwittrock): We need to change the behavior to prevent the user from running apply on subdirectories unintentionally.
{% endcomment %}

```shell
kubectl apply -f <directory/> --prune -l <labels>
```

**重要：** 应用修剪应该只应用于包含对象配置文件的根目录。应用于子目录可能会导致对象无意中被删除，
如果对象由标签选择器指定的标签`-l <labels>`查询返回，并且在子目录中没有的话。

## 如何查看对象

可以使用`kubectl get` 带 `-o yaml`标签查看活动对象的配置信息。

```shell
kubectl get -f <filename|url> -o yaml
```

## 如何计算差异并合并更改

**定义：** *patch*是对特定字段而不是整个对象的更改操作。
这样就可以在事先不读取对象的情况下更新对象上的一组特定字段。

当 `kubectl apply` 更新一个对象的活动配置时，它通过向API服务发送patch请求实现。
patch指定对活动对象配置的特定字段进行更新。`kubectl apply`使用配置文件，
活动配置，以及活动配置中的`last-applied-configuration`字段计算patch请求。

### 合并patch计算

`kubectl apply`将配置文件的内容写入`kubectl.kubernetes.io/last-applied-configuration`
注释。这用于标识已经从配置文件中删除并需要从活动配置中清除的字段。
以下是计算需要删除或设置哪些字段的步骤：

1. 计算要删除的字段。即在`last-applied-configuration`中存在但是在配置文件中没有的字段。
2. 计算要添加或设置的字段。即在配置文件中存在，值与实时配置不匹配的字段。

举个例子。假设这是一个Deployment对象的配置文件：

{% include code.html language="yaml" file="update_deployment.yaml" ghlink="/docs/tutorials/object-management-kubectl/update_deployment.yaml" %}

假设这是同一个Deployment对象的实时配置：

```shell
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  annotations:
    # ...
    # note that the annotation does not contain replicas
    # because it was not updated through apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
  # ...
  minReadySeconds: 5
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

`kubectl apply` 需要进行下面合并计算：

1. 从`last-applied-configuration`中读取值，并与配置文件中的值进行比较，计算需要删除的字段。
这个例子中，`minReadySeconds`出现在`last-applied-configuration`注释中，但是没有出现在配置文件中。
**动作：** 从活动配置中删除`minReadySeconds。
2. 通过从配置文件中读取值并与活动配置中的值进行比较，计算需要设置的字段。
在这次例子中，配置文件中`image`字段的值与活动配置中的值不一致。
**动作：** 设置活动配置中`image`字段的值。
3. 设置`last-applied-configuration`注释以匹配配置文件的值。
4. 将1,2,3中的结果合并成一个patch请求发送给API服务。

这是合并之后得到的活动配置：

```shell
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.11.9,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1beta1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.11.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.11.9 # Set by `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{% comment %}
TODO(1.6): For 1.6, add the following bullet point to 1.

- clear fields explicitly set to null in the local object configuration file regardless of whether they appear in the last-applied-configuration
{% endcomment %}

### 如何合并不同类型的字段

配置文件中的特定字段如何与活动配置合并取决于字段的类型，
有下面几种字段：

- *primitive*：字符串，整数或布尔型字段。
  例如，`image`和`replicas`是原始字段。 **动作：** 替换。

- *map*，也称*object*：图类型或包含子字段的复杂类型。例如，`labels`，
  `annotations`，`spec`和`metadata`都是图类型。 **动作：** 合并元素或子字段。

- *list*：包含一列元素的字段，这些元素可以是原始类型或者图类型。
  比如，`containers`、`ports`和`args`都是列表。**动作：** 多种方式。

当`kubectl apply`更新图或列表字段时，它通常不会替换整个字段，而是更新各个子元素。
例如，当在Deployment中合并`spec`时，整个`spec`不被替换。
相反，`spec`的子字段，如`replicas`，会被比较、合并。

### 将更改合并到原始字段

原始字段被替换或清除。

**注：** '-'表示"不适用"因为该值没有被使用。

| 对象配置文件中的字段  | 活动配置中的字段  | 最后应用配置中的字段 | 动作                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| 是                                 | 是                                | -                                   | 将活动配置设置为配置文件的值  |
| 是                                 | 否                                 | -                                   | 将活动配置设置为本地配置           |
| 否                                  | -                                  | 是                                 | 从活动配置中清除            |
| 否                                  | -                                  | 否                                  | 活动配置值不变             |

### 合并更改到图字段

通过比较图中每个字段和元素合并图字段：

**注：** '-'表示"不适用"因为该值没有被使用。

| 对象配置文件中的值    | 活动配置中的值   | last-applied-configuration中的值 | 动作                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| 是                                 | 是                                | -                                   | 比较子字段的值        |
| 是                                 | 否                                 | -                                   | 将活动配置设置为本地配置  |
| 否                                  | -                                  | 是                                 | 从活动配置中清除   |
| 否                                  | -                                  | 否                                  | 活动配置值不变     |

### 合并列表类型字段的更改

将更改合并到列表中使用以下三种策略之一：

* 更换列表。
* 在复杂元素列表中合并各个元素。
* 合并原始元素列表。

策略的选择是在每个字段的基础上进行。

#### 更换列表

采用与原始字段相同的方式。更换或者删除整个列表。保留列表排序。

**例：** 使用`kubectl apply`更新一个Pod中容器的`args`字段。设置活动配置中`args`的值为配置文件中的值。
所有之前添加到活动配置中的`args`元素都将丢失，`args`在配置文件中定义的元素的顺序保留在活动配置中。

```yaml
# last-applied-configuration value
    args: ["a, b"]

# configuration file value
    args: ["a", "c"]

# live configuration
    args: ["a", "b", "d"]

# result after merge
    args: ["a", "c"]
```

**说明：** 合并使用配置文件值作为新的列表值。

#### 合并复杂元素列表的各个元素：

将列表视为图，并将每个元素的特定字段视为值，添加、删除或更新单个元素，不保留元素顺序。

此合并策略在每个字段中使用一个特殊标签`patchMergeKey`。`patchMergeKey`
是在Kubernetes源码中的每个字段定义:
[types.go](https://git.k8s.io/kubernetes/pkg/api/v1/types.go#L2119)
。当合并一个图的列表时，指定元素的给定字段字段作为`patchMergeKey`，当做该元素图对象的值使用。

**例：** 使用`kubectl apply`更新一个PodSpec的`containers`字段。
本例中将列表作为一个图合并，每个元素通过使用`name`作为键值。

```yaml
# last-applied-configuration value
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; will be retained
      image: helper:1.3

# configuration file value
    containers:
    - name: nginx
      image: nginx:1.11
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; will be added in result
      image: helper:1.3

# live configuration
    containers:
    - name: nginx
      image: nginx:1.10
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
      image: nginx:1.10
      # Element nginx-helper-a was deleted
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field was retained
    - name: nginx-helper-c # Element was added
      image: helper:1.3
    - name: nginx-helper-d # Element was ignored
      image: helper:1.3
```

**说明：**

- 容器"nginx-helper-a"被刪除，因为配置文件中没有出现名为"nginx-helper-a"的容器。
- 名为"nginx-helper-b"保留对`args`做的更改到活动配置。
`kubectl`能够识别配置文件中的"nginx-helper-b"与活动配置中的"nginx-helper-b"是同一个，
即使它们的字段有不同的值（配置文件中没有`args`）。这是因为它们的`patchMergeKey`字段值（name）相同。
- 添加了名为"nginx-helper-c"的容器，因为在活动配置中没有该容器，但是在配置文件中出现了该名称。
- 名为"nginx-helper-d"的容器被保留，因为在最后一次应用配置中没有出现该名称的元素。

#### 合并原始元素列表

从Kubernetes 1.5起，不再支持合并原始元素列表。

**注：** 对于给定字段，选择以上哪种策略由[types.go](https://git.k8s.io/kubernetes/pkg/api/v1/types.go#L2119)
中的`patchStrategy`标签决定。如果列表类型的字段没有`patchStrategy`标签，则替换该列表。

**Note:** Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://git.k8s.io/kubernetes/pkg/api/v1/types.go#L2119)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.

{% comment %}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{% endcomment %}

## 默认字段值

如果创建时没有指定，API服务器设置活动配置中的某些字段为默认值。

以下是一个Deployment的配置文件，该文件没有指定`strategy`和`selector`：

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml" %}

使用`kubectl apply`创建对象：

```shell
kubectl apply -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml
```

使用`kubectl get`打印活动配置：

```shell
kubectl get -f http://k8s.io/cn/docs/tutorials/object-management-kubectl/simple_deployment.yaml -o yaml
```

输出显示API服务器在活动配置中将配置文件中没有指定的多个字段设置为默认值。

```shell
apiVersion: apps/v1beta1
kind: Deployment
# ...
spec:
  minReadySeconds: 5
  replicas: 1 # defaulted by apiserver
  selector:
    matchLabels: # defaulted by apiserver - derived from template.metadata.labels
      app: nginx
  strategy:
    rollingUpdate: # defaulted by apiserver - derived from strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # defaulted apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
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

**注：** 有些字段的默认值是从配置文件指定的其他字段派生出来的，例如`selector`字段。

在补丁请求中，默认字段不会被重置，除非它们作为请求的一部分被明确指定。
如果字段的默认值由其他字段决定，这可能会导致意外行为。当其他字段大幅度改动时，
这些字段决定默认值的字段也不会更新，除非明确指定。

因此建议在配置文件中显式定义服务器默认的某些字段，即使所需的值与服务器默认值相匹配。
这样就更容易识别不会被服务器重置的冲突值。

**例：**

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
        image: nginx:1.7.9
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
        image: nginx:1.7.9
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
        image: nginx:1.7.9
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
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

**说明：**

1. 用户不定义`strategy.type`创建Deployment。
2. 服务器默认`strategy.type`的值为`RollingUpdate`，并且默认创建`strategy.rollingUpdate`。
3. 用户将`strategy.type`值改为 `Recreate`。此时`strategy.rollingUpdate`的值还是默认值，
即使服务器期望它们被清除。如果最初在配置文件中指定了`strategy.rollingUpdate`值，
就会清楚这些字段需要删除。
4. 因为`strategy.rollingUpdate`字段没有被清除，应用失败。当`strategy.type`为`Recreate`时，不能定义`strategy.rollingupdate`。

建议：这些字段应该在对象配置文件中明确定义。

- 工作负载上的选择器和PodTemplate标签，如Deployment、StatefulSet,、Job、DaemonSet、ReplicaSet和ReplicationController。
- Deployment升级策略。

### 如何清除服务器缺省字段或由其他作者设置的字段

从Kubernetes 1.5起，不能通过合并操作清除没有在配置文件中出现的字段，下面是以下解决办法：

选项1：通过直接修改活动对象删除这些字段。

**注：** 从Kubernetes 1.5开始，`kubectl edit`不能与`kubectl apply`共用，组合使用可能导致意外情况。

选项2：通过配置文件删除这些字段。

1. 将这些字段添加到配置文件以匹配活动对象。
2. 应用配置文件；这将更新注释以包含这些字段。
3. 在配置文件中删除这些字段。
4. 应用配置文件，这些活动对象和注释中删除该字段。

{% comment %}
TODO(1.6): Update this with the following for 1.6

Fields that do not appear in the configuration file can be cleared by
setting their values to `null` and then applying the configuration file.
For fields defaulted by the server, this triggers re-defaulting
the values.
{% endcomment %}

## 如何从配置文件和直接命令写入器之间修改一个字段的所有权

这是您更改单个对象字段的唯一方法：

- 使用`kubectl apply`。
- 直接写入活动配置，无需修改配置文件。例如，使用`kubectl scale`

### 将所有者从直接命令写入器改为配置文件

添加该字段到配置文件。这些字段不经过`kubectl apply`直接更新到活动配置中。

### 将所有者从配置文件改为直接命令写入器

从Kubernetes 1.5开始，将所有者从配置文件改为直接命令写入器需要手动操作：

- 从配置文件中删除该字段。
- 从活动配置中删除`kubectl.kubernetes.io/last-applied-configuration`注释。

## 改变管理方法

Kubernetes对象一次只能使用一种方法管理。可以通过手动操作更改管理方法。

**例外：** 可以在使用声明式管理的同时使用命令删除。

{% comment %}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{% endcomment %}

### 从命令管理迁移到声明式对象配置

从命令管理迁移到声明式对象配置包含下面几个手动步骤：

1. 导出活动对象到本地配置文件：

       kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml

1. 手动删除配置文件中的`status`字段

    **注：** 此步骤是可选的。因为`kubectl apply`不会更新配置文件中的status字段。

1. 设置对象的 `kubectl.kubernetes.io/last-applied-configuration` 注释：

       kubectl replace --save-config -f <kind>_<name>.yaml

1. 改为使用`kubectl apply`管理对象。

{% comment %}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{% endcomment %}

### 从命令式对象配置迁移到声明式对象配置

1. 设置对象的`kubectl.kubernetes.io/last-applied-configuration` 注释：

       kubectl replace --save-config -f <kind>_<name>.yaml

1. 改为使用`kubectl apply`管理对象。

## 定义控制器选择器和PodTemplate标签

**警告**： 强烈建议不要更新控制器选择器。

推荐的方法是定义一个单独的不变得PodTemplate标签，只由控制器选择器使用，没有其他意义。

**例：**

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

## 一直的问题

* 在Kubernetes 1.6之前，`kubectl apply`不支持对存储在[自定义资源](/docs/concepts/api-extension/custom-resources/)
的对象进行操作。对于之前版本的Kubernetes集群，您应该使用[命令式对象配置](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/).
{% endcapture %}

{% capture whatsnext %}
- [使用命令行管理Kubernetes对象](/docs/tutorials/object-management-kubectl/imperative-object-management-command/)
- [使用配置文件管理Kubernetes对象](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
- [Kubectl命令参考](/docs/user-guide/kubectl/v1.6/)
- [Kubernetes对象模式参考](/docs/resources-reference/{{page.version}}/)
{% endcapture %}

{% include templates/concept.md %}
