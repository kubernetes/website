---
title: Extend the Kubernetes API with CustomResourceDefinitions
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
---

{{% capture overview %}}
This page explains how
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions) versioning works and how to upgrade from one version to another. 
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure your Kubernetes cluster has a master version of 1.11.0 or higher.

* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).

{{% /capture %}}

{{% capture body %}}
Kubernetes standard API types has versioning to let developers evolve APIs without breaking backwards compatibility. To extend kubernetes with Custom Resources, you should be able to do the same by supporting multiple versions of Custom Resources. CustomResourceDefinition API supports a `versions` field that can be used to list all versions for that object. Note that previous `version` field is deprecated and optional but if it is not empty, it must be the first item in the `versions` field.

For example, a CustomResourceDefinition with two versions looks like this:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - Name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    Served: true
    # One and only one version must be marked as storage version.
    storage: true
  - Name: v1
    Served: true
    storage: false
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

If you save the above definition to `my-versioned-crontab.yaml` and create it:

```shell
kubectl create -f my-versioned-crontab.yaml
```

By creating this CustomResourceDefinition, API server will start serving each enabled version (e.g. /apis/example.com/v1beta1 and /apis/example.com/v1).

## Version order
The order of the version defines a priority for each version. Most importantly the version that comes first in term of priority
will be used by kubectl as the default version to access objects. 

The version name in the CustomResourceDefiniton version list is used to compute the order of versions. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered
lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version),
then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first
by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing
major version, then minor version. This is an example of sorted versions list:

```
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10.
```

For `my-versioned-crontab.yaml` example, the version order would be v1, v1beta1. That means any kubectl command will use v1 as default version unless the version can be infered from the provided object.

## Conversion
Currently API Server does not do any conversions on CustomResourceDefinition other than fixing apiVersion of the object. The objects are stored in etcd in the storage version, while the returned objects for the API use the version of the request.

If you save the following YAML to `my-crontab-v1.yaml`:

```yaml
apiVersion: "example.com/v1beta1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

and create it:

```shell
kubectl create -f my-crontab.yaml
```

it will store the object with `example.com/v1beta1` API version. However when you access the object:

```shell
kubectl get my-new-cron-object -o yaml
```

you will see the object with `example.com/v1` API version as `v1` is the preferred version:

```yaml
apiVersion: example.com/v1
kind: CronTab
metadata:
  clusterName: ""
  creationTimestamp: 2017-05-31T12:56:35Z
  deletionGracePeriodSeconds: null
  deletionTimestamp: null
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  selfLink: /apis/example.com/v1/namespaces/default/crontabs/my-new-cron-object
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

You can also query the object with a non-preferred version (e.g. `v1beta1`):

```shell
kubectl get crontabs.v1beta1.stable.example.com my-new-cron-object
```

Which returns the object in `example.com/v1beta1` API Version:

```yaml
apiVersion: example.com/v1beta1
kind: CronTab
metadata:
  clusterName: ""
  creationTimestamp: 2017-05-31T12:56:35Z
  deletionGracePeriodSeconds: null
  deletionTimestamp: null
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  selfLink: /apis/example.com/v1/namespaces/default/crontabs/my-new-cron-object
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

## Stored Versions
It is possible to have different versions of Custom Resources in the storage at the same time. When changing the storage version in the CustomResourceDefinition you only affect new and updated objects. There is no automatic upgrade of your persisted data! Existing old object are still stored in their old version.

The API server records every version which was marked as storage version ever in the status field storedVersions. In other words: expect old versioned objects in etcd for all versions in status.storedVersions. Note that we may not actually have objects with all versions listed in storedVersions stored in etcd, because the list has any version that has the storage flag set at some time, independently whether object were actually written during that time.

When deprecating versions and dropping support, make sure to have a storage upgrade procedure in place. For example to upgrade from `v1beta1` to `v1`:

1. Set the `v1` as storage in the CustomResourceDefinition file and apply it using kubectl. The `storedVersions` would be `v1beta1, v1` after this step.
2. Write an upgrade procedure to list all existing objects and touch them (write them with the same content). This will force the backend to write objects in `v1` (storage) version.
3. Update CustomResourceDefinition `Status` by removing `v1beta1` from `storedVersions` field.

{{% /capture %}}
