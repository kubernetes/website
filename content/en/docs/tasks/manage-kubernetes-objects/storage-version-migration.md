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

Ensure that your cluster has the `StorageVersionMigrator` and `InformerResourceVersion`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
enabled. You will need control plane administrator access to make that change.

Enable storage version migration REST api by setting runtime config
`storagemigration.k8s.io/v1alpha1` to `true` for the API server. For more information on
how to do that,
read [enable or disable a Kubernetes API](/docs/tasks/administer-cluster/enable-disable-api/).

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

- To ensure that previously created secret `my-secret` is re-encrypted
  with new key `key2`, you will use _Storage Version Migration_.

- Create a StorageVersionMigration manifest named `migrate-secret.yaml` as follows:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1alpha1
  metadata:
    name: secrets-migration
  spec:
    resource:
      group: ""
      version: v1
      resource: secrets
  ```

  Create the object using _kubectl_ as follows:

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

- Monitor migration of Secrets by checking the `.status` of the StorageVersionMigration.
  A successful migration should have its
  `Succeeded` condition set to true. Get the StorageVersionMigration object as follows:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/secrets-migration -o yaml
  ```

  The output is similar to:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1alpha1
  metadata:
    name: secrets-migration
    uid: 628f6922-a9cb-4514-b076-12d3c178967c
    resourceVersion: "90"
    creationTimestamp: "2024-03-12T20:29:45Z"
  spec:
    resource:
      group: ""
      version: v1
      resource: secrets
  status:
    conditions:
    - type: Running
      status: "False"
      lastUpdateTime: "2024-03-12T20:29:46Z"
      reason: StorageVersionMigrationInProgress
    - type: Succeeded
      status: "True"
      lastUpdateTime: "2024-03-12T20:29:46Z"
      reason: StorageVersionMigrationSucceeded
    resourceVersion: "84"
  ```

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

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: selfierequests.stable.example.com
  spec:
    group: stable.example.com
    names:
      plural: SelfieRequests
      singular: SelfieRequest
      kind: SelfieRequest
      listKind: SelfieRequestList
    scope: Namespaced
    versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            hostPort:
              type: string
    conversion:
      strategy: Webhook
      webhook:
        clientConfig:
          url: "https://127.0.0.1:9443/crdconvert"
          caBundle: <CABundle info>
      conversionReviewVersions:
      - v1
      - v2
  ```

  Create CRD using kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Create a manifest for an example testcrd. Name the manifest `cr1.yaml` and use these contents:

  ```yaml
  apiVersion: stable.example.com/v1
  kind: SelfieRequest
  metadata:
    name: cr1
    namespace: default
  ```

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

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
  name: selfierequests.stable.example.com
  spec:
    group: stable.example.com
    names:
      plural: SelfieRequests
      singular: SelfieRequest
      kind: SelfieRequest
      listKind: SelfieRequestList
    scope: Namespaced
    versions:
      - name: v2
        served: true
        storage: true
        schema:
          openAPIV3Schema:
            type: object
            properties:
              host:
                type: string
              port:
                type: string
      - name: v1
        served: true
        storage: false
        schema:
          openAPIV3Schema:
            type: object
            properties:
              hostPort:
                type: string
    conversion:
      strategy: Webhook
      webhook:
        clientConfig:
          url: "https://127.0.0.1:9443/crdconvert"
          caBundle: <CABundle info>
        conversionReviewVersions:
          - v1
          - v2
  ```

  Update CRD using kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Create CR resource file with name `cr2.yaml` as follows:

  ```yaml
  apiVersion: stable.example.com/v2
  kind: SelfieRequest
  metadata:
    name: cr2
    namespace: default
  ```

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

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1alpha1
  metadata:
    name: crdsvm
  spec:
    resource:
      group: stable.example.com
      version: v1
      resource: SelfieRequest
  ```

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

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1alpha1
  metadata:
    name: crdsvm
    uid: 13062fe4-32d7-47cc-9528-5067fa0c6ac8
    resourceVersion: "111"
    creationTimestamp: "2024-03-12T22:40:01Z"
  spec:
    resource:
      group: stable.example.com
      version: v1
      resource: testcrds
  status:
    conditions:
      - type: Running
        status: "False"
        lastUpdateTime: "2024-03-12T22:40:03Z"
        reason: StorageVersionMigrationInProgress
      - type: Succeeded
        status: "True"
        lastUpdateTime: "2024-03-12T22:40:03Z"
        reason: StorageVersionMigrationSucceeded
    resourceVersion: "106"
  ```

- Verify that previously created cr1 is now written and stored as v2 by getting the object from etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  where `[...]` contains the additional arguments for connecting to the etcd server.
