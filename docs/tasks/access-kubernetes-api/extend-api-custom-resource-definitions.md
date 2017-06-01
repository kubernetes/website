---
assignees:
- IanLewis
title: Extending the Kubernetes API Using Custom Resource Definitions
redirect_from:
- "/docs/user-guide/customresourcedefinitions/"
- "/docs/user-guide/customresourcedefinitions.html"
- "/docs/concepts/ecosystem/customresourcedefinitions/"
- "/docs/concepts/ecosystem/customresourcedefinitions.html"
---

* TOC
{:toc}

## What is a CustomResourceDefinition?

Kubernetes comes with many built-in API objects. However, there are often times
when you might need to extend Kubernetes with your own API objects in order to do custom automation.

`CustomResourceDefinition` objects are a way to extend the Kubernetes API with
a new API object type. The new API object type will be given an API endpoint
URL and support CRUD operations, and watch API. You can then create custom
objects using this API endpoint. You can think of `CustomResourceDefinitions`
as being much like the schema for a database table. Once you have created the
table, you can then start storing rows in the table. Once created,
`CustomResourceDefinitions` can act as the data model behind custom controllers
or automation programs.

A `CustomResourceDefinition` creates the REST API for a custom resource of your chosen name.

## Creating a CustomResourceDefinition

When you create a new `CustomResourceDefinition`, the Kubernetes API Server
reacts by creating a new RESTful resource path (namespaced or cluster-scoped)
depending on your request.  As with existing built-in objects, deleting a
namespace deletes all custom objects in that namespace.
`CustomResourceDefinitions` themselves are non-namespaced and are available to all namespaces.

For example, if you save the following `CustomResourceDefinition` to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must be in the form: plural.group
  name: crontabs.stable.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: stable.example.com
  # version name to use for REST API: /apis/<group>/<version>
  version: v1
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```

And create it:

```shell
$ kubectl create -f resourcedefinition.yaml
customresourcedefinitions "crontabs.stable.example.com" created
```

Then a new RESTful API endpoint is created at:

`/apis/stable.example.com/v1/namespaces/<namespace>/crontabs/...`

This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` from the spec of the
`CustomResourceDefinition` object we created above.


## Creating Custom Objects

After the `CustomResourceDefinition` object has been created you can create
custom objects. Custom objects can contain custom fields. These fields can
contain arbitrary JSON. 
In the following example, a `cronSpec` and `image` custom fields are set to the
custom object of kind `CronTab`.  The kind `CronTab` comes from the spec of the
`CustomResourceDefinition` object we created above.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * /5"
  image: my-awesome-cron-image
```

and create it:

```shell
$ kubectl create -f my-crontab.yaml
crontab "my-new-cron-object" created
```

You can then manage our `CronTab` objects using kubectl. Note that resource
names are not case-sensitive when using kubectl:

```shell
$ kubectl get crontab
NAME                 KIND
my-new-cron-object   CronTab.v1.stable.example.com
```

You can also view the raw JSON data. Here you can see that it contains the custom `cronSpec` and `image` fields from the yaml you used to create it:

```yaml
$ kubectl get ct -o yaml
apiVersion: v1
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    clusterName: ""
    creationTimestamp: 2017-05-31T12:56:35Z
    deletionGracePeriodSeconds: null
    deletionTimestamp: null
    name: my-new-cron-object
    namespace: default
    resourceVersion: "285"
    selfLink: /apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object
    uid: 9423255b-4600-11e7-af6a-28d2447dc82b
  spec:
    cronSpec: '* * * * /5'
    image: my-awesome-cron-image
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

## Advanced Topics
### Finalizers
CustomResources (objects created in the schema defined by CustomResourceDefintions)
support finalizers.  If you add a `metadata.finalizers` stanza like

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - finalizer.stable.example.com
```

Then when the CustomResource is deleted, the `metadata.deletionTimestamp` will 
be set and update watch events will be sent to a controller which can perform
finalization steps before removing the finalizer and deleting the object again.
This allows cleanup for CustomResources like "normal" Kubernetes APIs.