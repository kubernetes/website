---
title: Serve versioned CustomResourceDefinitions
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
weight: 30
---

{{% capture overview %}}
This page explains how
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions) versioning works and how
to upgrade from one version to another. 
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure your Kubernetes cluster has a master version of 1.11.0 or higher.

* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).

{{% /capture %}}

{{% capture steps %}}

## Overview

Kubernetes standard API types include a versioning mechanism, so that developers
can evolve APIs while maintaining backwards compatibility. In a similar way, the
CustomResourceDefinition API supports a `versions` field that you can use to
support multiple versions of Custom Resources that you have developed.

{{< note >}}
Earlier iterations included a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
{{< /note >}}

## Specify multiple versions

This example shows a CustomResourceDefinition with two versions. The comments in
the YAML provide more context.

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
    # One and only one version must be marked as the storage version.
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

You can save the CustomResourceDefinition in a YAML file, then use
`kubectl create` to create it.

```shell
kubectl create -f my-versioned-crontab.yaml
```

After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the APIs are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.

### Version order

The versions in a CustomResourceDefinition are automatically prioritized in the
following way, regardless of the order in which they are defined. The version
that comes first in term of priority is used by kubectl as the default version
to access objects. 

The version _name_ in the CustomResourceDefiniton version list is used to
compute the order of versions, using the following algorithm to attempt to parse
the versions by version, then stability level. 

Versions of the Kubernetes versioning scheme start with a `v` followed by a
number, `vbeta` followed by a number, or `vbeta` followed by a number. The
Kubernetes community calls this scheme "GA versions". Within GA versions, the
following rules apply:
  
- `v` is sorted before `vbeta`, which is sorted before `valpha`.
- Numbers are sorted largest to smallest.
- If the strings `beta`, `alpha` follow the number, they sorted in
  that order, after the equivalent string without the `beta` or `alpha` suffix.
- If another number follows the `beta`, or `alpha`, those numbers
  are sorted from largest to smallest.
- Strings that don't fit the above format are sorted alphabetically.

This might make sense if you look at the following sorted version list:

```none
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

For the example in [Specify multiple versions](#specify-multiple-versions), the
version sort order is `v1`, followed by `v1beta`. This causes the kubectl
command to use `v1` as the default version unless the provided object specifies
the version.

## Manage object versions

An object is stored in etcd with the storage version at the time of creation.
When the object is requested, the API server returns it in the API version of
the request. In the case of CREATE or UPDATE requests it persists the object
with the current storage version, not the request version.

To illustrate how this works, you can save the following YAML to
`my-crontab-v1.yaml`:

```yaml
apiVersion: "example.com/v1beta1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

You can create the `v1beta1` version using the following `kubectl` command.

```shell
kubectl create -f my-crontab.yaml
```

The new object is stored as `example.com/v1beta1` in etcd because `v1beta1` is
the current storage version. If you add a definition for `v1`, it will now be
first in the sort order, and a newly-created object that doesn't specify an API
version will be stored as `example.com/v1`.

```shell
kubectl get my-new-cron-object -o yaml
```

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

If you specify a version, the object is stored at that version:

```shell
kubectl get crontabs.v1beta1.stable.example.com my-new-cron-object
```

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

### Storing multiple versions

You can store different versions of Custom Resources simultaneously. When you
change the storage version in the CustomResourceDefinition, this only affects
new and updated objects. Your existing persisted data is not automatically
upgraded.

The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Expect old versioned objects in etcd for all versions in `status.storedVersions`. Versions may have existed but never been designated as
the storage version, or objects may have never been created for a given version.
In these cases, those versions are not stored in etcd.

### Upgrade objects to a new stored version

When deprecating versions and dropping support, devise a storage upgrade
procedure. The following is an example procedure to upgrade from `v1beta1`
to `v1`.

1.  Set `v1` as the storage in the CustomResourceDefinition file and apply the
    file using kubectl. The `storedVersions` is now `v1beta1, v1`.
2.  Write an upgrade procedure to list all existing objects and write them with
    the same content. This forces the backend to write objects in the current
    storage version, which is `v1`.
3.  Update the CustomResourceDefinition `Status` by removing `v1beta1` from
    `storedVersions` field.

{{% /capture %}}
