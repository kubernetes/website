---
title: 推荐使用的标签
content_template: templates/concept
---
<!--
---
title: Recommended Labels
content_template: templates/concept
---
-->

{{% capture overview %}}
<!--
You can visualize and manage Kubernetes objects with more tools than kubectl and
the dashboard. A common set of labels allows tools to work interoperably, describing
objects in a common manner that all tools can understand.
-->
除了 kubectl 和 dashboard 之外，您可以其他工具来可视化和管理 Kubernetes 对象。
一组通用的标签可以让多个工具之间互操作，用所有工具都能理解的通用方式描述对象。

<!--
In addition to supporting tooling, the recommended labels describe applications
in a way that can be queried.
-->
除了支持工具外，推荐的标签还以一种可以查询的方式描述了应用程序。

{{% /capture %}}

{{% capture body %}}
<!--
The metadata is organized around the concept of an _application_. Kubernetes is not
a platform as a service (PaaS) and doesn't have or enforce a formal notion of an application.
Instead, applications are informal and described with metadata. The definition of
what an application contains is loose.
-->
元数据围绕 _应用（application）_ 的概念进行组织。Kubernetes 不是
平台即服务（PaaS），没有或强制执行正式的应用程序概念。
相反，应用程序是非正式的，并使用元数据进行描述。应用程序包含的定义是松散的。

{{< note >}}
<!--
These are recommended labels. They make it easier to manage applications
but aren't required for any core tooling.
-->
这些是推荐的标签。它们使管理应用程序变得更容易但不是任何核心工具所必需的。
{{< /note >}}

<!--
Shared labels and annotations share a common prefix: `app.kubernetes.io`. Labels
without a prefix are private to users. The shared prefix ensures that shared labels
do not interfere with custom user labels.
-->
共享标签和注解都使用同一个前缀：`app.kubernetes.io`。没有前缀的标签是用户私有的。共享前缀可以确保共享标签不会干扰用户自定义的标签。

<!--
## Labels

In order to take full advantage of using these labels, they should be applied
on every resource object.
-->
## 标签
为了充分利用这些标签，应该在每个资源对象上都使用它们。

<!--
| Key                                 | Description           | Example  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | The name of the application | `mysql` | string |
| `app.kubernetes.io/instance`        | A unique name identifying the instance of an application | `wordpress-abcxzy` | string |
| `app.kubernetes.io/version`         | The current version of the application (e.g., a semantic version, revision hash, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | The component within the architecture | `database` | string |
| `app.kubernetes.io/part-of`         | The name of a higher level application this one is part of | `wordpress` | string |
| `app.kubernetes.io/managed-by`  | The tool being used to manage the operation of an application | `helm` | string |

-->
| 键                                 | 描述           | 示例  | 类型 |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | 应用程序的名称 | `mysql` | 字符串 |
| `app.kubernetes.io/instance`        | 用于唯一确定应用实例的名称 | `wordpress-abcxzy` | 字符串 |
| `app.kubernetes.io/version`         | 应用程序的当前版本（例如，语义版本，修订版哈希等） | `5.7.21` | 字符串 |
| `app.kubernetes.io/component`       | 架构中的组件 | `database` | 字符串 |
| `app.kubernetes.io/part-of`         | 此级别的更高级别应用程序的名称 | `wordpress` | 字符串 |
| `app.kubernetes.io/managed-by`  | 用于管理应用程序的工具 | `helm` | 字符串 |
<!--
To illustrate these labels in action, consider the following StatefulSet object:
-->
为说明这些标签的实际使用情况，请看下面的 StatefulSet 对象：

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

<!--
## Applications And Instances Of Applications

An application can be installed one or more times into a Kubernetes cluster and,
in some cases, the same namespace. For example, wordpress can be installed more
than once where different websites are different installations of wordpress.

The name of an application and the instance name are recorded separately. For
example, WordPress has a `app.kubernetes.io/name` of `wordpress` while it has
an instance name, represented as `app.kubernetes.io/instance` with a value of
`wordpress-abcxzy`. This enables the application and instance of the application
to be identifiable. Every instance of an application must have a unique name.
-->
## 应用和应用实例

应用可以在 Kubernetes 集群中安装一次或多次。在某些情况下，可以安装在同一命名空间中。例如，可以不止一次地为不同的站点安装不同的 wordpress。

应用的名称和实例的名称是分别记录的。例如，某 WordPress 实例的 `app.kubernetes.io/name` 为 `wordpress`，而其实例名称表现为 `app.kubernetes.io/instance` 的属性值 `wordpress-abcxzy`。这使应用程序和应用程序的实例成为可能是可识别的。应用程序的每个实例都必须具有唯一的名称。

<!--
## Examples
-->
## 示例

<!--
To illustrate different ways to use these labels the following examples have varying complexity.
-->
为了说明使用这些标签的不同方式，以下示例具有不同的复杂性。

<!--
### A Simple Stateless Service
-->
### 一个简单的无状态服务

<!--
Consider the case for a simple stateless service deployed using `Deployment` and `Service` objects. The following two snippets represent how the labels could be used in their simplest form.
-->
考虑使用 `Deployment` 和 `Service` 对象部署的简单无状态服务的情况。以下两个代码段表示如何以最简单的形式使用标签。

<!--
The `Deployment` is used to oversee the pods running the application itself.
-->
下面的 `Deployment` 用于监督运行应用本身的 pods。
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

<!--
The `Service` is used to expose the application.
-->
下面的 `Service` 用于暴露应用。
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

<!--
### Web Application With A Database
-->
### 带有一个数据库的 Web 应用程序

<!--
Consider a slightly more complicated application: a web application (WordPress)
using a database (MySQL), installed using Helm. The following snippets illustrate
the start of objects used to deploy this application.

The start to the following `Deployment` is used for WordPress:
-->
考虑一个稍微复杂的应用：一个使用 Helm 安装的 Web 应用（WordPress），其中
使用了数据库（MySQL）。以下代码片段说明用于部署此应用程序的对象的开始。

以下 `Deployment` 的开头用于 WordPress：


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

<!--
The `Service` is used to expose WordPress:
-->
这个 `Service` 用于暴露 WordPress：

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

<!--
MySQL is exposed as a `StatefulSet` with metadata for both it and the larger application it belongs to:
-->

MySQL 作为一个 `StatefulSet` 暴露，包含它和它所属的较大应用程序的元数据：
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

<!--
The `Service` is used to expose MySQL as part of WordPress:
-->

`Service` 用于将 MySQL 作为 WordPress 的一部分暴露：
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

<!--
With the MySQL `StatefulSet` and `Service` you'll notice information about both MySQL and Wordpress, the broader application, are included.
-->
使用 MySQL `StatefulSet` 和 `Service`，您会注意到有关 MySQL 和 Wordpress 的信息，包括更广泛的应用程序。

{{% /capture %}}
