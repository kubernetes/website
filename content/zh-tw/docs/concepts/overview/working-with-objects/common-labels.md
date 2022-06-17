---
title: 推薦使用的標籤
content_type: concept
---
<!--
---
title: Recommended Labels
content_type: concept
---
-->

<!-- overview -->
<!--
You can visualize and manage Kubernetes objects with more tools than kubectl and
the dashboard. A common set of labels allows tools to work interoperably, describing
objects in a common manner that all tools can understand.
-->
除了 kubectl 和 dashboard 之外，你可以使用其他工具來視覺化和管理 Kubernetes 物件。
一組通用的標籤可以讓多個工具之間相互操作，用所有工具都能理解的通用方式描述物件。

<!--
In addition to supporting tooling, the recommended labels describe applications
in a way that can be queried.
-->
除了支援工具外，推薦的標籤還以一種可以查詢的方式描述了應用程式。



<!-- body -->
<!--
The metadata is organized around the concept of an _application_. Kubernetes is not
a platform as a service (PaaS) and doesn't have or enforce a formal notion of an application.
Instead, applications are informal and described with metadata. The definition of
what an application contains is loose.
-->
元資料圍繞 _應用（application）_ 的概念進行組織。Kubernetes 不是
平臺即服務（PaaS），沒有或強制執行正式的應用程式概念。
相反，應用程式是非正式的，並使用元資料進行描述。應用程式包含的定義是鬆散的。

{{< note >}}
<!--
These are recommended labels. They make it easier to manage applications
but aren't required for any core tooling.
-->
這些是推薦的標籤。它們使管理應用程式變得更容易但不是任何核心工具所必需的。
{{< /note >}}

<!--
Shared labels and annotations share a common prefix: `app.kubernetes.io`. Labels
without a prefix are private to users. The shared prefix ensures that shared labels
do not interfere with custom user labels.
-->
共享標籤和註解都使用同一個字首：`app.kubernetes.io`。沒有字首的標籤是使用者私有的。共享字首可以確保共享標籤不會干擾使用者自定義的標籤。

<!--
## Labels

In order to take full advantage of using these labels, they should be applied
on every resource object.
-->
## 標籤
為了充分利用這些標籤，應該在每個資源物件上都使用它們。

<!--
| Key                                 | Description           | Example  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | The name of the application | `mysql` | string |
| `app.kubernetes.io/instance`        | A unique name identifying the instance of an application | `mysql-abcxzy` | string |
| `app.kubernetes.io/version`         | The current version of the application (e.g., a semantic version, revision hash, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | The component within the architecture | `database` | string |
| `app.kubernetes.io/part-of`         | The name of a higher level application this one is part of | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | The tool being used to manage the operation of an application | `helm` | string |
| `app.kubernetes.io/created-by`      | The controller/user who created this resource | `controller-manager` | string |
-->
| 鍵                                 | 描述           | 示例  | 型別 |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | 應用程式的名稱 | `mysql` | 字串 |
| `app.kubernetes.io/instance`        | 用於唯一確定應用例項的名稱 | `mysql-abcxzy` | 字串 |
| `app.kubernetes.io/version`         | 應用程式的當前版本（例如，語義版本，修訂版雜湊等） | `5.7.21` | 字串 |
| `app.kubernetes.io/component`       | 架構中的元件 | `database` | 字串 |
| `app.kubernetes.io/part-of`         | 此級別的更高級別應用程式的名稱 | `wordpress` | 字串 |
| `app.kubernetes.io/managed-by`      | 用於管理應用程式的工具 | `helm` | 字串 |
| `app.kubernetes.io/created-by`      | 建立該資源的控制器或者使用者 | `controller-manager` | 字串 |
<!--
To illustrate these labels in action, consider the following {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} object:
-->
為說明這些標籤的實際使用情況，請看下面的 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} 物件：

```yaml
# 這是一段節選
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/created-by: controller-manager
```

<!--
## Applications And Instances Of Applications

An application can be installed one or more times into a Kubernetes cluster and,
in some cases, the same namespace. For example, WordPress can be installed more
than once where different websites are different installations of WordPress.

The name of an application and the instance name are recorded separately. For
example, WordPress has a `app.kubernetes.io/name` of `wordpress` while it has
an instance name, represented as `app.kubernetes.io/instance` with a value of
`wordpress-abcxzy`. This enables the application and instance of the application
to be identifiable. Every instance of an application must have a unique name.
-->
## 應用和應用例項

應用可以在 Kubernetes 叢集中安裝一次或多次。在某些情況下，可以安裝在同一名稱空間中。例如，可以不止一次地為不同的站點安裝不同的 WordPress。

應用的名稱和例項的名稱是分別記錄的。例如，WordPress 應用的 
`app.kubernetes.io/name` 為 `wordpress`，而其例項名稱 
`app.kubernetes.io/instance` 為 `wordpress-abcxzy`。
這使得應用和應用的例項均可被識別，應用的每個例項都必須具有唯一的名稱。

<!--
## Examples
-->
## 示例

<!--
To illustrate different ways to use these labels the following examples have varying complexity.
-->
為了說明使用這些標籤的不同方式，以下示例具有不同的複雜性。

<!--
### A Simple Stateless Service
-->
### 一個簡單的無狀態服務

<!--
Consider the case for a simple stateless service deployed using `Deployment` and `Service` objects. The following two snippets represent how the labels could be used in their simplest form.
-->
考慮使用 `Deployment` 和 `Service` 物件部署的簡單無狀態服務的情況。以下兩個程式碼段表示如何以最簡單的形式使用標籤。

<!--
The `Deployment` is used to oversee the pods running the application itself.
-->
下面的 `Deployment` 用於監督執行應用本身的 pods。
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
下面的 `Service` 用於暴露應用。
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
### 帶有一個數據庫的 Web 應用程式

<!--
Consider a slightly more complicated application: a web application (WordPress)
using a database (MySQL), installed using Helm. The following snippets illustrate
the start of objects used to deploy this application.

The start to the following `Deployment` is used for WordPress:
-->
考慮一個稍微複雜的應用：一個使用 Helm 安裝的 Web 應用（WordPress），其中
使用了資料庫（MySQL）。以下程式碼片段說明用於部署此應用程式的物件的開始。

以下 `Deployment` 的開頭用於 WordPress：

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
這個 `Service` 用於暴露 WordPress：

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
MySQL 作為一個 `StatefulSet` 暴露，包含它和它所屬的較大應用程式的元資料：
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

<!--
The `Service` is used to expose MySQL as part of WordPress:
-->
`Service` 用於將 MySQL 作為 WordPress 的一部分暴露：
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

<!--
With the MySQL `StatefulSet` and `Service` you'll notice information about both MySQL and Wordpress, the broader application, are included.
-->
使用 MySQL `StatefulSet` 和 `Service`，你會注意到有關 MySQL 和 Wordpress 的資訊，包括更廣泛的應用程式。
