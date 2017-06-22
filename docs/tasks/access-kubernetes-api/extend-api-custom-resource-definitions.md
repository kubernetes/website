---
title: Extend the Kubernetes API with CustomResourceDefinitions
assignees:
- deads2k
- enisoc
---

{% capture overview %}
This page shows how to install a [custom resource](/docs/concepts/api-extension/custom-resources/)
into the Kubernetes API by creating a CustomResourceDefinition.
{% endcapture %}

{% capture prerequisites %}
* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).
* Make sure your Kubernetes cluster has a master version of 1.7.0 or higher.
{% endcapture %}

{% capture steps %}
## Create a CustomResourceDefinition

When you create a new *CustomResourceDefinition* (CRD), the Kubernetes API Server
reacts by creating a new RESTful resource path, either namespaced or cluster-scoped,
as specified in the CRD's `scope` field. As with existing built-in objects, deleting a
namespace deletes all custom objects in that namespace.
CustomResourceDefinitions themselves are non-namespaced and are available to all namespaces.

For example, if you save the following CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
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
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```

And create it:

```shell
kubectl create -f resourcedefinition.yaml
```

Then a new namespaced RESTful API endpoint is created at:

```
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` from the spec of the
CustomResourceDefinition object you created above.


## Create custom objects

After the CustomResourceDefinition object has been created, you can create
custom objects. Custom objects can contain custom fields. These fields can
contain arbitrary JSON.
In the following example, the `cronSpec` and `image` custom fields are set in a
custom object of kind `CronTab`.  The kind `CronTab` comes from the spec of the
CustomResourceDefinition object you created above.

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
kubectl create -f my-crontab.yaml
```

You can then manage your CronTab objects using kubectl. For example:

```shell
kubectl get crontab
```

Should print a list like this:

```console
NAME                 KIND
my-new-cron-object   CronTab.v1.stable.example.com
```

Note that resource names are not case-sensitive when using kubectl,
and you can use either the singular or plural forms defined in the CRD,
as well as any short names.

You can also view the raw JSON data:

```shell
kubectl get ct -o yaml
```

You should see that it contains the custom `cronSpec` and `image` fields
from the yaml you used to create it:

```console
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
{% endcapture %}

{% capture discussion %}
## Advanced topics

### Finalizers

*Finalizers* allow controllers to implement asynchronous pre-delete hooks.
Custom objects support finalizers just like built-in objects.

You can add a finalizer to a custom object like this:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - finalizer.stable.example.com
```

The first delete request on an object with finalizers merely sets a value for the
`metadata.deletionTimestamp` field instead of deleting it.
This triggers controllers watching the object to execute any finalizers they handle.

Each controller then removes its finalizer from the list and issues the delete request again.
This request only deletes the object if the list of finalizers is now empty,
meaning all finalizers are done.
{% endcapture %}

{% capture whatsnext %}
* Learn how to [Migrate a ThirdPartyResource to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/).
{% endcapture %}

{% include templates/task.md %}




