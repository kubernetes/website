---
title: Migrate Kubernetes Objects Using Storage Version Migration
reviewers:
  - deads2k
  - jpbetz
  - enj
  - nilekhc
content_type: task
min-kubernetes-server-version: v1.30
weight: 60
---

<!-- overview -->

{{< feature-state feature_gate_name="StorageVersionMigrator" >}}

Kubernetes relies on API data being actively re-written, to support some
maintenance activities related to at rest storage. Two prominent examples are
the versioned schema of stored resources (that is, the preferred storage schema
changing from v1 to v2 for a given resource) and encryption at rest
(that is, rewriting stale data based on a change in how the data should be encrypted).

## {{% heading "prerequisites" %}}

Install [`kubectl`](/docs/tasks/tools/#kubectl).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Re-encrypt Kubernetes secrets using storage version migration

- To begin with, [configure KMS provider](/docs/tasks/administer-cluster/kms-provider/) 
  to encrypt data at rest in etcd using following encryption configuration.

  ```yaml
  kind: EncryptionConfiguration
  apiVersion: apiserver.config.k8s.io/v1
  resources:
  - resources:
    - secrets
    providers:
    - aescbc:
      keys:
      - name: key1
        secret: c2VjcmV0IGlzIHNlY3VyZQ==
  ```

  Make sure to enable automatic reload of encryption
  configuration file by setting `--encryption-provider-config-automatic-reload` to true.

- Create a Secret using kubectl.

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

- [Verify](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  the serialized data for that Secret object is prefixed with `k8s:enc:aescbc:v1:key1`.

- Update the encryption configuration file as follows to rotate the encryption key.

  ```yaml
  kind: EncryptionConfiguration
  apiVersion: apiserver.config.k8s.io/v1
  resources:
  - resources:
    - secrets
    providers:
    - aescbc:
      keys:
      - name: key2
        secret: c2VjcmV0IGlzIHNlY3VyZSwgaXMgaXQ/
    - aescbc:
      keys:
      - name: key1
        secret: c2VjcmV0IGlzIHNlY3VyZQ==
  ```

- To ensure that previously created secret `my-secert` is re-encrypted
  with new key `key2`, you will use _Storage Version Migration_.

- Create a StorageVersionMigration manifest named `migrate-secret.yaml` as follows:

  {{% code language="yaml" file="storage/storage-version-migration.yaml" %}}

  Create the object using _kubectl_ as follows:

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

- Monitor migration of Secrets by checking the `.status` of the StorageVersionMigration.
  A successful migration should have its `Succeeded` condition set to true.
  Get the StorageVersionMigration object as follows:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/secrets-migration -o yaml
  ```

  The output is similar to:

  {{% code language="yaml" file="storage/storage-version-migration-status.yaml" %}}

- [Verify](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  the stored secret is now prefixed with `k8s:enc:aescbc:v1:key2`.

## Update the preferred storage schema of a CRD

Consider a scenario where a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
(CRD) is created to serve custom resources (CRs) and is set as the preferred storage schema. When it's time
to introduce v2 of the CRD, it can be added for serving only with a conversion
webhook. This enables a smoother transition where users can create CRs using
either the v1 or v2 schema, with the webhook in place to perform the necessary
schema conversion between them. Before setting v2 as the preferred storage schema
version, it's important to ensure that all existing CRs stored as v1 are migrated to v2.
This migration can be achieved through _Storage Version Migration_ to migrate all CRs from v1 to v2.

- Create a manifest for the CRD, named `test-crd.yaml`, as follows:

  {{% code language="yaml" file="storage/test-crd.yaml" %}}

  Create CRD using kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Create a manifest for an example testcrd. Name the manifest `cr1.yaml` and use these contents:

  {{% code language="yaml" file="storage/cr1.yaml" %}}

  Create CR using kubectl:

  ```shell
  kubectl apply -f cr1.yaml
  ```

- Verify that CR is written and stored as v1 by getting the object from etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  where `[...]` contains the additional arguments for connecting to the etcd server.

- Update the CRD `test-crd.yaml` to include v2 version for serving and storage
  and v1 as serving only, as follows:

  {{% code language="yaml" file="storage/test-crd-v2.yaml" %}}

  Update CRD using kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Create CR resource file with name `cr2.yaml` as follows:

  {{% code language="yaml" file="storage/cr2.yaml" %}}

- Create CR using kubectl:

  ```shell
  kubectl apply -f cr2.yaml
  ```

- Verify that CR is written and stored as v2 by getting the object from etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr2 [...] | hexdump -C
  ```

  where `[...]` contains the additional arguments for connecting to the etcd server.

- Create a StorageVersionMigration manifest named `migrate-crd.yaml`, with the contents as follows:

  {{% code language="yaml" file="storage/migrate-crd.yaml" %}}

  Create the object using _kubectl_ as follows:

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

- Monitor migration of secrets using status. Successful migration should have
  `Succeeded` condition set to "True" in the status field. Get the migration resource
  as follows:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  The output is similar to:

  {{% code language="yaml" file="storage/storage-version-migration-status02.yaml" %}}

- Verify that previously created cr1 is now written and stored as v2 by getting the object from etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  where `[...]` contains the additional arguments for connecting to the etcd server.
