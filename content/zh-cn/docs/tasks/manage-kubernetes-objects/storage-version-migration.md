---
title: 使用存储版本迁移功能来迁移 Kubernetes 对象
content_type: task
min-kubernetes-server-version: v1.30
weight: 60
---
<!--
title: Migrate Kubernetes Objects Using Storage Version Migration
reviewers:
- deads2k
- jpbetz
- enj
- nilekhc
content_type: task
min-kubernetes-server-version: v1.30
weight: 60
-->

<!-- overview -->

{{< feature-state feature_gate_name="StorageVersionMigrator" >}}

<!--
Kubernetes relies on API data being actively re-written, to support some
maintenance activities related to at rest storage. Two prominent examples are
the versioned schema of stored resources (that is, the preferred storage schema
changing from v1 to v2 for a given resource) and encryption at rest
(that is, rewriting stale data based on a change in how the data should be encrypted).
-->
Kubernetes 依赖主动重写的 API 数据来支持与静态存储相关的一些维护活动。
两个著名的例子是已存储资源的版本化模式（即针对给定资源的首选存储模式从 v1 更改为 v2）
和静态加密（即基于数据加密方式的变化来重写过时的数据）。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/#kubectl).
-->
安装 [`kubectl`](/zh-cn/docs/tasks/tools/#kubectl)。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Ensure that your cluster has the `StorageVersionMigrator` and `InformerResourceVersion`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
enabled. You will need control plane administrator access to make that change.

Enable storage version migration REST api by setting runtime config
`storagemigration.k8s.io/v1alpha1` to `true` for the API server. For more information on
how to do that,
read [enable or disable a Kubernetes API](/docs/tasks/administer-cluster/enable-disable-api/).
-->
确保你的集群启用了 `StorageVersionMigrator` 和 `InformerResourceVersion`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
你需要有控制平面管理员权限才能执行此项变更。

在 API 服务器上将运行时配置 `storagemigration.k8s.io/v1alpha1` 设为 `true`，启用存储版本迁移 REST API。
有关如何执行此操作的更多信息，请阅读[启用或禁用 Kubernetes API](/zh-cn/docs/tasks/administer-cluster/enable-disable-api/)。

<!-- steps -->

<!--
## Re-encrypt Kubernetes secrets using storage version migration

- To begin with, [configure KMS provider](/docs/tasks/administer-cluster/kms-provider/)
  to encrypt data at rest in etcd using following encryption configuration.
-->
## 使用存储版本迁移来重新加密 Kubernetes Secret   {#reencrypt-kubernetes-secrets-using-storage-version-migration}

- 首先[配置 KMS 驱动](/zh-cn/docs/tasks/administer-cluster/kms-provider/)，
  以便使用如下加密配置来加密 etcd 中的静态数据。

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

  <!--
  Make sure to enable automatic reload of encryption
  configuration file by setting `--encryption-provider-config-automatic-reload` to true.
  -->
  确保通过将 `--encryption-provider-config-automatic-reload` 设置为 true，允许自动重新加载加密配置文件。

<!--
- Create a Secret using kubectl.
-->
- 使用 kubectl 创建 Secret。

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

<!--
- [Verify](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  the serialized data for that Secret object is prefixed with `k8s:enc:aescbc:v1:key1`.

- Update the encryption configuration file as follows to rotate the encryption key.
-->
- [验证](/zh-cn/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)该
  Secret 对象的序列化数据带有前缀 `k8s:enc:aescbc:v1:key1`。

- 按照以下方式更新加密配置文件，以轮换加密密钥。

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

<!--
- To ensure that previously created secret `my-secert` is re-encrypted
  with new key `key2`, you will use _Storage Version Migration_.

- Create a StorageVersionMigration manifest named `migrate-secret.yaml` as follows:
-->
- 要确保之前创建的 Secret `my-secert` 使用新密钥 `key2` 进行重新加密，你将使用**存储版本迁移**。

- 创建以下名为 `migrate-secret.yaml` 的 StorageVersionMigration 清单：

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

  <!--
  Create the object using _kubectl_ as follows:
  -->
  使用以下 _kubectl_ 命令创建对象：

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

<!--
- Monitor migration of Secrets by checking the `.status` of the StorageVersionMigration.
  A successful migration should have its
  `Succeeded` condition set to true. Get the StorageVersionMigration object as follows:
-->
- 通过检查 StorageVersionMigration 的 `.status` 来监控 Secret 的迁移。
  成功的迁移应将其 `Succeeded` 状况设置为 true。
  获取 StorageVersionMigration 对象的方式如下：

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/secrets-migration -o yaml
  ```

  <!--
  The output is similar to:
  -->
  输出类似于：

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

<!--
- [Verify](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  the stored secret is now prefixed with `k8s:enc:aescbc:v1:key2`.

## Update the preferred storage schema of a CRD
-->
- [验证](/zh-cn/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)存储的
  Secret 现在带有前缀 `k8s:enc:aescbc:v1:key2`。

## 更新 CRD 的首选存储模式   {#update-the-preferred-storage-schema-of-a-crd}

<!--
Consider a scenario where a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
(CRD) is created to serve custom resources (CRs) and is set as the preferred storage schema. When it's time
to introduce v2 of the CRD, it can be added for serving only with a conversion
webhook. This enables a smoother transition where users can create CRs using
either the v1 or v2 schema, with the webhook in place to perform the necessary
schema conversion between them. Before setting v2 as the preferred storage schema
version, it's important to ensure that all existing CRs stored as v1 are migrated to v2.
This migration can be achieved through _Storage Version Migration_ to migrate all CRs from v1 to v2.
-->
考虑这样一种情况：
用户创建了 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD)
来提供自定义资源 (CR)，并将其设置为首选的存储模式。
当需要引入 CRD 的 v2 版本时，只需提供转换 Webhook 就可以为 v2 版本提供服务。
基于转换 Webhook 的方式能够实现更平滑的过渡，用户可以使用 v1 或 v2 模式创建 CR，并通过合适的 Webhook 执行必要的模式转换。
在将 v2 设置为首选的存储模式版本之前，重要的是要确保将当前已存储为 v1 的所有 CR 已被迁移到 v2。
这种迁移可以通过使用**存储版本迁移**将所有 CR 从 v1 迁移到 v2 来达成。

<!--
- Create a manifest for the CRD, named `test-crd.yaml`, as follows:
-->
- 如下针对名为 `test-crd.yaml` 的 CRD 创建一个清单：

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
          url: https://127.0.0.1:9443/crdconvert
          caBundle: <CABundle info>
      conversionReviewVersions:
        - v1
        - v2
  ```

  <!--
  Create CRD using kubectl:
  -->
  使用 kubectl 创建 CRD：

  ```shell
  kubectl apply -f test-crd.yaml
  ```

<!--
- Create a manifest for an example testcrd. Name the manifest `cr1.yaml` and use these contents:
-->
- 为 testcrd 示例创建一个清单。命名为 `cr1.yaml` 并使用以下内容：

  ```yaml
  apiVersion: stable.example.com/v1
  kind: SelfieRequest
  metadata:
    name: cr1
    namespace: default
  ```

  <!--
  Create CR using kubectl:
  -->
  使用 kubectl 创建 CR：

  ```shell
  kubectl apply -f cr1.yaml
  ```

<!--
- Verify that CR is written and stored as v1 by getting the object from etcd.
-->
- 通过从 etcd 获取对象来验证 CR 是否以 v1 格式被写入和存储。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含连接到 etcd 服务器的额外参数。

<!--
- Update the CRD `test-crd.yaml` to include v2 version for serving and storage
  and v1 as serving only, as follows:
-->
- 如下更新 CRD `test-crd.yaml`，将 v2 版本设置为 served 和 storage，并将 v1 设置为仅 served：

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

  <!--
  Update CRD using kubectl:
  -->
  使用 kubectl 更新 CRD：

  ```shell
  kubectl apply -f test-crd.yaml
  ```

<!--
- Create CR resource file with name `cr2.yaml` as follows:
-->
- 如下创建名为 `cr2.yaml` 的 CR 资源文件：

  ```yaml
  apiVersion: stable.example.com/v2
  kind: SelfieRequest
  metadata:
    name: cr2
    namespace: default
  ```

<!--
- Create CR using kubectl:
-->
- 使用 kubectl 创建 CR：

  ```shell
  kubectl apply -f cr2.yaml
  ```

<!--
- Verify that CR is written and stored as v2 by getting the object from etcd.
-->
- 通过从 etcd 获取对象来验证 CR 是否以 v2 格式被写入和存储。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr2 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含连接到 etcd 服务器的额外参数。

<!--
- Create a StorageVersionMigration manifest named `migrate-crd.yaml`, with the contents as follows:
-->
- 如下创建名为 `migrate-crd.yaml` 的 StorageVersionMigration 清单：

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

  <!--
  Create the object using _kubectl_ as follows:
  -->
  使用如下 _kubectl_ 命令创建此对象：

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

<!--
- Monitor migration of secrets using status. Successful migration should have
  `Succeeded` condition set to "True" in the status field. Get the migration resource
  as follows:
-->
- 使用 status 监控 Secret 的迁移。
  若迁移成功，应在 status 字段中将 `Succeeded` 状况设置为 "True"。
  获取迁移资源的方式如下：

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  <!--
  The output is similar to:
  -->
  输出类似于：

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

<!--
- Verify that previously created cr1 is now written and stored as v2 by getting the object from etcd.
-->
- 通过从 etcd 获取对象来验证之前创建的 cr1 是否现在以 v2 格式被写入和存储。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含连接到 etcd 服务器的额外参数。
