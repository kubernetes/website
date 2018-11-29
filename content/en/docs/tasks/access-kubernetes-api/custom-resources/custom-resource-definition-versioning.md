---
title: Versions of CustomResourceDefinitions
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
weight: 30
---

{{% capture overview %}}
This page explains how to add versioning information to
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions), to indicate the stability
level of your CustomResourceDefinitions. It also describes how to upgrade an
object from one version to another.

{{< note >}}
All specified versions must use the same schema. There is no schema conversion
between versions.
{{< /note >}}

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure your Kubernetes cluster has a master version of 1.11.0 or higher.

* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).

{{% /capture %}}

{{% capture steps %}}

## Overview

The CustomResourceDefinition API supports a `versions` field that you can use to
support multiple versions of custom resources that you have developed, and
indicate the stability of a given custom resource. All versions must currently
use the same schema, so if you need to add a field, you must add it to all
versions.

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
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
  - name: v1
    served: true
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
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.

### Version priority

Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.

The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:
  
- Entries that follow Kubernetes version patterns are sorted before those that
  do not.
- For entries that follow Kubernetes version patterns, the numeric portions of
  the version string is sorted largest to smallest.
- If the strings `beta` or `alpha` follow the first numeric portion, they sorted
  in that order, after the equivalent string without the `beta` or `alpha`
  suffix (which is presumed to be the GA version).
- If another number follows the `beta`, or `alpha`, those numbers are also
  sorted from largest to smallest.
- Strings that don't fit the above format are sorted alphabetically and the
  numeric portions are not treated specially. Notice that in the example below,
  `foo1` is sorted above `foo10`. This is different from the sorting of the
  numeric portion of entries that do follow the Kubernetes version patterns.

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
- foo10
```

For the example in [Specify multiple versions](#specify-multiple-versions), the
version sort order is `v1`, followed by `v1beta1`. This causes the kubectl
command to use `v1` as the default version unless the provided object specifies
the version.

## Writing, reading, and updating versioned CustomResourceDefinition objects

When an object is written, it is persisted at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.

When you read an object, you specify the version as part of the path. If you
specify a version that is different from the object's persisted version,
Kubernetes returns the object to you at the version you requested, but the
persisted object is neither changed on disk, nor converted in any way
(other than changing the `apiVersion` string) while serving the request.
You can request an object at any version that is currently served.

If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.

To illustrate this, consider the following hypothetical series of events:

1.  The storage version is `v1beta1`. You create an object. It is persisted in
    storage at version `v1beta1`
2.  You add version `v1` to your CustomResourceDefinition and designate it as
    the storage version.
3.  You read your object at version `v1beta1`, then you read the object again at
    version `v1`. Both returned objects are identical except for the apiVersion
    field.
4.  You create a new object. It is persisted in storage at version `v1`. You now
    have two objects, one of which is at `v1beta1`, and the other of which is at
    `v1`.
5.  You update the first object. It is now persisted at version `v1` since that
    is the current storage version.

### Previous storage versions

The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been persisted
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.

## Upgrade existing objects to a new stored version

When deprecating versions and dropping support, devise a storage upgrade
procedure. The following is an example procedure to upgrade from `v1beta1`
to `v1`.

1.  Set `v1` as the storage in the CustomResourceDefinition file and apply it
    using kubectl. The `storedVersions` is now `v1beta1, v1`.
2.  Write an upgrade procedure to list all existing objects and write them with
    the same content. This forces the backend to write objects in the current
    storage version, which is `v1`.
3.  Update the CustomResourceDefinition `Status` by removing `v1beta1` from
    `storedVersions` field.

{{% /capture %}}
