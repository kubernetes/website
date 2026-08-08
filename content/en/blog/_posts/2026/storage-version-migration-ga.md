---
layout: blog
title: "Kubernetes v1.37: Storage Version Migration Enabled by Default"
date: XXX
slug: kubernetes-v1-37-storage-version-migration-ga
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
---

I am excited to announce that **Storage Version Migration (SVM)** is graduating to **General Availability (GA)** in Kubernetes v1.37!

After a number of releases of work and testing, the built-in `StorageVersionMigration` API (`storagemigration.k8s.io/v1`) and control plane controller are now fully stable and enabled by default across all Kubernetes clusters.

## The problem with stale storage versions

In Kubernetes, stored API objects are written using a specific *storage version* (schema representation). The way Kubernetes interacts with object storage fundamentally requires mutation of an object in order to ensure that the latest storage version is used for all objects. This creates problems when you want to change the storage version of an object.

One example of a scenario where you may want to change the storage version of an object is when you are promoting a CRD from an older API version (such as `v1beta1`) to a newer version (`v1`). In this case, you designate `v1` as the new storage version. While new writes are stored as `v1`, any existing objects remain stored as `v1beta1` in storage. You cannot safely remove `v1beta1` from the CRD's `status.storedVersions` or drop serving support until every single object in storage has been re-written to `v1`.

Another example is **encryption at rest and key rotation**. When you configure encryption at rest or rotate encryption keys, existing objects in storage remain encrypted under old keys (or unencrypted) until they are actively re-written through the Kubernetes API server.

Historically, cluster administrators and CRD authors had to rely on manual `kubectl get/replace` scripts or deploy the out-of-tree `kube-storage-version-migrator` component to force re-writes. These approaches were often tedious, error-prone, and difficult to monitor.

## How Storage Version Migration works

Initiating a storage version migration is as simple as creating a declarative `StorageVersionMigration` resource. The built-in `StorageVersionMigrator` controller in the Kubernetes control plane watches for these resources and automatically migrates existing objects to their current storage version.

### Example: Migrating a Custom Resource

Suppose you have updated a CustomResourceDefinition (`crontabs.example.com`) to use `v1` as its storage version. To migrate all existing stored objects off older versions, create a `StorageVersionMigration` resource:

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
kubectl apply -f https://k8s.io/examples/admin/storageversionmigration/crontabs-migration.yaml
```

## Monitoring and verifying migrations

The `StorageVersionMigrator` controller updates the `status` of the `StorageVersionMigration` resource as it progresses. You can inspect the migration status using `kubectl`:

```shell
kubectl get storageversionmigration.storagemigration.k8s.io/crontabs-migration -o yaml
```

A successful migration will report a `Succeeded` condition set to `"True"`:

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

Once the migration has succeeded, you can be confident that all instances of the resource in storage are stored in the current storage version. For CRDs, you can then safely proceed to remove deprecated versions from `status.storedVersions` and drop old conversion code.

## Including migrations in your CRD manifests

Because `StorageVersionMigration` is a standard declarative Kubernetes API, CRD authors can bundle migrations directly alongside CRD upgrades. For example, you can include the migration in the same manifest as your updated `CustomResourceDefinition`:

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

* Learn more in the official documentation: [Migrate Kubernetes Objects Using Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/).
* Review the updated CRD versioning guidelines: [Versions in CustomResourceDefinitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#upgrade-existing-objects-to-a-new-stored-version).

SIG API Machinery would love to hear your feedback as you adopt built-in Storage Version Migration in your clusters. Reach out to us on the [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) Slack channel or participate in our community discussions!
