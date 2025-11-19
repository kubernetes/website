---
title: 使用存儲版本遷移功能來遷移 Kubernetes 對象
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
Kubernetes 依賴主動重寫的 API 數據來支持與靜態存儲相關的一些維護活動。
兩個著名的例子是已存儲資源的版本化模式（即針對給定資源的首選存儲模式從 v1 更改爲 v2）
和靜態加密（即基於數據加密方式的變化來重寫過時的數據）。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/#kubectl).
-->
安裝 [`kubectl`](/zh-cn/docs/tasks/tools/#kubectl)。

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
確保你的叢集啓用了 `StorageVersionMigrator` 和 `InformerResourceVersion`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
你需要有控制平面管理員權限才能執行此項變更。

在 API 伺服器上將運行時設定 `storagemigration.k8s.io/v1alpha1` 設爲 `true`，啓用存儲版本遷移 REST API。
有關如何執行此操作的更多信息，請閱讀[啓用或禁用 Kubernetes API](/zh-cn/docs/tasks/administer-cluster/enable-disable-api/)。

<!-- steps -->

<!--
## Re-encrypt Kubernetes secrets using storage version migration

- To begin with, [configure KMS provider](/docs/tasks/administer-cluster/kms-provider/)
  to encrypt data at rest in etcd using following encryption configuration.
-->
## 使用存儲版本遷移來重新加密 Kubernetes Secret   {#reencrypt-kubernetes-secrets-using-storage-version-migration}

- 首先[設定 KMS 驅動](/zh-cn/docs/tasks/administer-cluster/kms-provider/)，
  以便使用如下加密設定來加密 etcd 中的靜態數據。

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
  確保通過將 `--encryption-provider-config-automatic-reload` 設置爲 true，允許自動重新加載加密設定文件。

<!--
- Create a Secret using kubectl.
-->
- 使用 kubectl 創建 Secret。

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

<!--
- [Verify](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  the serialized data for that Secret object is prefixed with `k8s:enc:aescbc:v1:key1`.

- Update the encryption configuration file as follows to rotate the encryption key.
-->
- [驗證](/zh-cn/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)該
  Secret 對象的序列化數據帶有前綴 `k8s:enc:aescbc:v1:key1`。

- 按照以下方式更新加密設定文件，以輪換加密密鑰。

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
- To ensure that previously created secret `my-secret` is re-encrypted
  with new key `key2`, you will use _Storage Version Migration_.

- Create a StorageVersionMigration manifest named `migrate-secret.yaml` as follows:
-->
- 要確保之前創建的 Secret `my-secret` 使用新密鑰 `key2` 進行重新加密，你將使用**存儲版本遷移**。

- 創建以下名爲 `migrate-secret.yaml` 的 StorageVersionMigration 清單：

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
  使用以下 _kubectl_ 命令創建對象：

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

<!--
- Monitor migration of Secrets by checking the `.status` of the StorageVersionMigration.
  A successful migration should have its
  `Succeeded` condition set to true. Get the StorageVersionMigration object as follows:
-->
- 通過檢查 StorageVersionMigration 的 `.status` 來監控 Secret 的遷移。
  成功的遷移應將其 `Succeeded` 狀況設置爲 true。
  獲取 StorageVersionMigration 對象的方式如下：

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/secrets-migration -o yaml
  ```

  <!--
  The output is similar to:
  -->
  輸出類似於：

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
- [驗證](/zh-cn/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)存儲的
  Secret 現在帶有前綴 `k8s:enc:aescbc:v1:key2`。

## 更新 CRD 的首選存儲模式   {#update-the-preferred-storage-schema-of-a-crd}

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
考慮這樣一種情況：
使用者創建了 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD)
來提供自定義資源 (CR)，並將其設置爲首選的存儲模式。
當需要引入 CRD 的 v2 版本時，只需提供轉換 Webhook 就可以爲 v2 版本提供服務。
基於轉換 Webhook 的方式能夠實現更平滑的過渡，使用者可以使用 v1 或 v2 模式創建 CR，並通過合適的 Webhook 執行必要的模式轉換。
在將 v2 設置爲首選的存儲模式版本之前，重要的是要確保將當前已存儲爲 v1 的所有 CR 已被遷移到 v2。
這種遷移可以通過使用**存儲版本遷移**將所有 CR 從 v1 遷移到 v2 來達成。

<!--
- Create a manifest for the CRD, named `test-crd.yaml`, as follows:
-->
- 如下針對名爲 `test-crd.yaml` 的 CRD 創建一個清單：

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
  使用 kubectl 創建 CRD：

  ```shell
  kubectl apply -f test-crd.yaml
  ```

<!--
- Create a manifest for an example testcrd. Name the manifest `cr1.yaml` and use these contents:
-->
- 爲 testcrd 示例創建一個清單。命名爲 `cr1.yaml` 並使用以下內容：

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
  使用 kubectl 創建 CR：

  ```shell
  kubectl apply -f cr1.yaml
  ```

<!--
- Verify that CR is written and stored as v1 by getting the object from etcd.
-->
- 通過從 etcd 獲取對象來驗證 CR 是否以 v1 格式被寫入和存儲。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含連接到 etcd 伺服器的額外參數。

<!--
- Update the CRD `test-crd.yaml` to include v2 version for serving and storage
  and v1 as serving only, as follows:
-->
- 如下更新 CRD `test-crd.yaml`，將 v2 版本設置爲 served 和 storage，並將 v1 設置爲僅 served：

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
- 如下創建名爲 `cr2.yaml` 的 CR 資源文件：

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
- 使用 kubectl 創建 CR：

  ```shell
  kubectl apply -f cr2.yaml
  ```

<!--
- Verify that CR is written and stored as v2 by getting the object from etcd.
-->
- 通過從 etcd 獲取對象來驗證 CR 是否以 v2 格式被寫入和存儲。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr2 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含連接到 etcd 伺服器的額外參數。

<!--
- Create a StorageVersionMigration manifest named `migrate-crd.yaml`, with the contents as follows:
-->
- 如下創建名爲 `migrate-crd.yaml` 的 StorageVersionMigration 清單：

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
  使用如下 _kubectl_ 命令創建此對象：

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

<!--
- Monitor migration of secrets using status. Successful migration should have
  `Succeeded` condition set to "True" in the status field. Get the migration resource
  as follows:
-->
- 使用 status 監控 Secret 的遷移。
  若遷移成功，應在 status 字段中將 `Succeeded` 狀況設置爲 "True"。
  獲取遷移資源的方式如下：

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  <!--
  The output is similar to:
  -->
  輸出類似於：

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
- 通過從 etcd 獲取對象來驗證之前創建的 cr1 是否現在以 v2 格式被寫入和存儲。

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/stable.example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  <!--
  where `[...]` contains the additional arguments for connecting to the etcd server.
  -->
  其中 `[...]` 包含連接到 etcd 伺服器的額外參數。
