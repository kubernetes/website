---
title: Recommended Labels and Annotations
content_template: templates/concept
---

{{% capture overview %}}
Many tools can be used to visualize and manage Kubernetes objects. The tools used
to manage objects goes beyond kubectl and the dashboard. To enable interoperability
between tools, a common set of labels and annotation allows objects to be described
in a common manner that all tools can understand.

In addition to supporting tooling, the recommended labels and annotations describe
applications, in a generic sense, in a way that can queried or are otherwise useful
when operating applications.
{{% /capture %}}

{{% capture body %}}
The recommended object metadata is broken apart so that some of it is labels while
other parts are annotations. Labels are shorter and can be used when querying
the Kubernetes API. Annotations allow for longer data that's not meant to be
queried.

The metadata is organized around the concept of an Application. Kubernetes is not
a Platform as a Service and doesn't have or enforce a formal notion of an application.
Instead, applications are informal, described with metadata, and the definition of what an
application contains is loose.

Note, these are recommended labels and annotations. They aid the use of managing
applications but are not required for any core tooling to work.

One common theme you'll notice about the labels and annotations is that they
contain a prefix of `app.kubernetes.io`. Labels and annotations without a prefix
are considered private to users. These are meant to be common labels that do not
interfere with existing or custom user labels. To accomplish this a prefix is
used.

## Labels

| Key                                 | Description           | Example  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | The name of the application | `mysql` | string |
| `app.kubernetes.io/version`         | The current version of the application (e.g., a semantic version, revision hash, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | The component within the architecture | `database` | string |
| `app.kubernetes.io/part-of`         | The name of a higher level application this one is part of | `wordpress` | string |
| `app.kubernetes.io/managed-by`  | The tool being used to manage the operation of an application | `helm` | string |

To illustrative these labels in action consider the following StatefulSet object
containing them:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## Annotations

| Key                     | Description           | Example  | Type |
| ----------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/usage` | The location of an applications usage information (e.g., details for how it's being run by an organization). A preference is given to version specific information | `https://example.com/foo/1.2/` | URL |
| `app.kubernetes.io/website`   | A website to find out more information about the application in general | `https://wordpress.org` | URL |

To illustrative these annotations in action consider the following StatefulSet object
containing them:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  annotations:
    app.kubernetes.io/usage: https://github.com/kubernetes/charts/tree/master/stable/mysql
    app.kubernetes.io/website: https://www.mysql.com/
```

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
...
```

The `Service` is used to expose the application.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
...
```

### Web Application With A Database

A slightly more complicated application may be a web application and a database. For this example we consider WordPress using a MySQL database. To add to the metadata complexity Helm is used to install the application. The following snippets illustrate the start of objects used to deploy this application.

The start to the following `Deployment` is used for WordPress:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
  annotations:
    app.kubernetes.io/usage: https://github.com/kubernetes/charts/tree/master/stable/wordpress
    app.kubernetes.io/website: https://wordpress.org/
...
```

The `Service` is used to expose WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
  annotations:
    app.kubernetes.io/usage: https://github.com/kubernetes/charts/tree/master/stable/wordpress
    app.kubernetes.io/website: https://wordpress.org/
...
```

MySQL is exposed as a `StatefulSet` with metadata for both it and the larger application it is apart of:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
  annotations:
    app.kubernetes.io/usage: https://github.com/kubernetes/charts/tree/master/stable/mysql
    app.kubernetes.io/website: https://mysql.org/
...
```

The `Service` is used to expose MySQL as part of WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
  annotations:
    app.kubernetes.io/usage: https://github.com/kubernetes/charts/tree/master/stable/mysql
    app.kubernetes.io/website: https://mysql.org/
...
```

With the MySQL `StatefulSet` and `Service` you'll notice information about both MySQL and Wordpress, the broader application, are included.

{{% /capture %}}