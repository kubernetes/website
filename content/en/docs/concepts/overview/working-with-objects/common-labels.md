---
title: Recommended Labels
content_type: concept
---

<!-- overview -->
You can visualize and manage Kubernetes objects with more tools than kubectl and
the dashboard. A common set of labels allows tools to work interoperably, describing
objects in a common manner that all tools can understand.

In addition to supporting tooling, the recommended labels describe applications
in a way that can be queried.


<!-- body -->
The metadata is organized around the concept of an _application_. Kubernetes is not
a platform as a service (PaaS) and doesn't have or enforce a formal notion of an application.
Instead, applications are informal and described with metadata. The definition of
what an application contains is loose.

{{< note >}}
These are recommended labels. They make it easier to manage applications
but aren't required for any core tooling.
{{< /note >}}

Shared labels and annotations share a common prefix: `app.kubernetes.io`. Labels
without a prefix are private to users. The shared prefix ensures that shared labels
do not interfere with custom user labels.

## Labels

In order to take full advantage of using these labels, they should be applied
on every resource object.

| Key                                 | Description           | Example  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | The name of the application | `mysql` | string |
| `app.kubernetes.io/instance`        | A unique name identifying the instance of an application | `mysql-abcxzy` | string |
| `app.kubernetes.io/version`         | The current version of the application (e.g., a semantic version, revision hash, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | The component within the architecture | `database` | string |
| `app.kubernetes.io/part-of`         | The name of a higher level application this one is part of | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | The tool being used to manage the operation of an application | `helm` | string |
| `app.kubernetes.io/created-by`      | The controller/user who created this resource | `controller-manager` | string |

To illustrate these labels in action, consider the following StatefulSet object:

```yaml
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

## Applications And Instances Of Applications

An application can be installed one or more times into a Kubernetes cluster and,
in some cases, the same namespace. For example, WordPress can be installed more
than once where different websites are different installations of WordPress.

The name of an application and the instance name are recorded separately. For
example, WordPress has a `app.kubernetes.io/name` of `wordpress` while it has
an instance name, represented as `app.kubernetes.io/instance` with a value of
`wordpress-abcxzy`. This enables the application and instance of the application
to be identifiable. Every instance of an application must have a unique name.

## Examples

To illustrate different ways to use these labels the following examples have varying complexity.

### A Simple Stateless Service

Consider the case for a simple stateless service deployed using `Deployment` and `Service` objects. The following two snippets represent how the labels could be used in their simplest form.

The `Deployment` is used to oversee the pods running the application itself.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

The `Service` is used to expose the application.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### Web Application With A Database

Consider a slightly more complicated application: a web application (WordPress)
using a database (MySQL), installed using Helm. The following snippets illustrate
the start of objects used to deploy this application.

The start to the following `Deployment` is used for WordPress:

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

The `Service` is used to expose WordPress:

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

MySQL is exposed as a `StatefulSet` with metadata for both it and the larger application it belongs to:

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

The `Service` is used to expose MySQL as part of WordPress:

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

With the MySQL `StatefulSet` and `Service` you'll notice information about both MySQL and WordPress, the broader application, are included.

