---
layout: blog
title: "Kubernetes v1.37: Storage Version Migration Enabled by Default"
slug: kubernetes-v1-37-storage-version-migration-ga
date: 2026-08-31T10:30:00-08:00
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
---

I am excited that *storage version migration* (SVM) has graduated to General Availability (GA) in Kubernetes v1.37!

After a number of releases of work and testing, the built-in StorageVersionMigration API (`storagemigration.k8s.io/v1`)
and control plane controller are now fully stable and enabled by default across all v1.37 Kubernetes clusters.

## The problem with stale storage versions

In Kubernetes, stored API resources are written using a specific *storage version* (schema representation). The way Kubernetes interacts with object storage fundamentally requires mutation of a resource in order to ensure that the latest storage version is used for all resources. This creates problems when you want to change the storage version of a resource.

One example of a scenario where you may want to change the storage version of a resource is when you are promoting a CRD to drop an older API version (such as `v1alpha1`) to a newer version (leaving just `v1beta1` and `v1`). It's a problem to drop the older API version whilst there are still resources stored with the old alpha version.

To avoid problems, you designate `v1` as the new storage version; but, on it's own, that's not enough.  While new writes are stored as `v1`, any existing resource could remain stored as `v1alpha1` or `v1beta1` in storage. You cannot safely remove `v1alpha1` from the CRD's `.status.storedVersions` or drop serving support until every single resource in storage has been re-written to not be serialized and stored with the alpha version.

Another relevant example is *encryption at rest* and, related, *key rotation*.
When you configure encryption at rest or rotate encryption keys, existing resources in storage remain **unencrypted** (or encrypted under old keys) until they are actively
re-written through the Kubernetes API server.

Historically, cluster administrators and CRD authors had to rely on manual
`kubectl get` / `kubectl replace` scripts, or to deploy the out-of-tree `kube-storage-version-migrator` component to force re-writes.
These approaches were often tedious, error-prone, and difficult to monitor.

## How storage version migration works

Initiating a storage version migration is as simple as creating a declarative StorageVersionMigration object.
The built-in StorageVersionMigrator controller in the Kubernetes control plane watches for these objects, and automatically migrates existing resources to the default storage version for that API.

### Example: Migrating a custom resource API {#example-custom-resources}

Suppose you have updated a CustomResourceDefinition (`crontabs.example.com`) to use `v1` as its storage version.
To migrate all existing stored resources off older versions, create a StorageVersionMigration:

```yaml
apiVersion: storagemigration.k8s.io/v1
kind: StorageVersionMigration
metadata:
  name: crontabs-migration
spec:
  resource:
    group: example.com
    resource: crontabs
```

Apply the manifest using `kubectl`:

```shell
kubectl apply -f crontabs-migration.yaml
```

## Monitoring and verifying migrations

The StorageVersionMigrator controller updates the `status` of the StorageVersionMigration object as migration progresses.
You can inspect the migration status using `kubectl`:

```shell
kubectl get storageversionmigration.storagemigration.k8s.io/crontabs-migration -o yaml
```

A successful migration will report a `Succeeded` condition set to True:

```yaml
status:
  conditions:
    - type: Running
      status: "False"
      lastUpdateTime: "2026-08-02T10:05:00Z"
      reason: StorageVersionMigrationInProgress
    - type: Succeeded
      status: "True"
      lastUpdateTime: "2026-08-02T10:05:00Z"
      reason: StorageVersionMigrationSucceeded
```

Once the migration has succeeded, you can be confident that all instances of the resource in storage are stored in the current storage version. For
CRDs, the stored version should be updated in the CRD's `.status.storedVersions` to only contain the preferred version. If the
`.status.storedVersions` is not updated following a successful migration then that means that the CRD was updated during the migration. In
that case, the migration should be retried in order to safely deprecate an older storage version.

## Including migrations in your CRD manifests

Because StorageVersionMigration is a standard declarative Kubernetes API, CRD authors can bundle or trigger migrations directly
alongside CRD upgrades. For example, you can include the migration in the same manifest as your updated CustomResourceDefinition:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  # Updated versions list where v1 has storage: true
  ...
---
apiVersion: storagemigration.k8s.io/v1
kind: StorageVersionMigration
metadata:
  name: crontabs-migration
spec:
  resource:
    group: example.com
    resource: crontabs
```

## What's next?

* Learn more about the concepts behind [Storage Versions](/docs/concepts/overview/working-with-objects/storage-version/).
* Read the step-by-step task guide: [Migrate Kubernetes Objects Using Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/).

SIG API Machinery would love to hear your feedback as you adopt built-in Storage Version Migration in your clusters. Reach out to us on the [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) Slack channel or participate in our community discussions!