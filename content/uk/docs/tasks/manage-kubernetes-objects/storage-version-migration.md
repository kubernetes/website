---
title: Міграція обʼєктів Kubernetes за допомогою міграції версій сховища
reviewers: task
min-kubernetes-server-version: v1.30
weight: 60
---

<!-- overview -->

{{< feature-state feature_gate_name="StorageVersionMigrator" >}}

Kubernetes покладається на активне переписування даних API, щоб підтримувати деякі дії обслуговування, повʼязані зі збереженням у спокої. Два видатні приклади цього — це версійна схема збережених ресурсів (тобто зміна перевіреної схеми збереження від v1 до v2 для певного ресурсу) та шифрування у спокої (тобто перезапис старих даних на основі зміни у способі шифрування даних).

Виконання міграції версій сховища дозволяє гарантувати, що всі обʼєкти для ресурсу були переміщені з застарілої версії сховища. Вимоги до виконання міграції сховища полягають у тому, щоб ресурс мав цілочисельну версію ресурсу. Всі ресурси Kubernetes і CRD гарантовано мають цю властивість, але міграція не відбудеться, якщо це не так, наприклад, у випадку агрегованих API.

## {{% heading "prerequisites" %}}

Встановіть [`kubectl`](/docs/tasks/tools/#kubectl).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Переконайтеся, що у вашому кластері увімкнено [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/#StorageVersionMigrator) `StorageVersionMigrator`. Для внесення цих змін вам знадобиться доступ адміністратора панелі управління.

Увімкніть REST API для міграції версій сховища, встановивши параметр конфігурації `storagemigration.k8s.io/v1beta1` на `true` для API-сервера. Для отримання додаткової інформації про те, як це зробити, прочитайте [увімкнення або вимкнення API Kubernetes](/docs/tasks/administer-cluster/enable-disable-api/).

<!-- steps -->

## Перешифрування Secret Kubernetes за допомогою міграції версій сховища {#re-encrypt-kubernetes-secrets-using-storage-version-migration}

- Для початку, [налаштуйте постачальника KMS](/docs/tasks/administer-cluster/kms-provider/) для шифрування даних у спокої в etcd, використовуючи наступну конфігурацію шифрування.

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

  Переконайтеся, що автоматичне перезавантаження конфігурації шифрування встановлено на значення true, встановивши `--encryption-provider-config-automatic-reload`.

- Створіть Secret за допомогою kubectl.

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

- [Перевірте](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted) серіалізовані дані для цього обʼєкта Secret, що починаються з `k8s:enc:aescbc:v1:key1`.

- Оновіть файл конфігурації шифрування наступним чином, щоб виконати ротацію ключа шифрування.

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

- Щоб переконатися, що раніше створений секрет `my-secret` зашифровано новим ключем `key2`, ви будете використовувати _Storage Version Migration_.

- Створіть маніфест StorageVersionMigration з назвою `migrate-secret.yaml`, наступного змісту:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: secrets-migration
  spec:
    resource:
      group: ""
      resource: secrets
  ```

  Створіть обʼєкт за допомогою `kubectl` наступним чином:

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

- Спостерігайте за міграцією Secret, перевіряючи `.status` обʼєкта StorageVersionMigration. Успішна міграція повинна мати умову `Succeeded` встановлену на true. Отримайте обʼєкт StorageVersionMigration наступним чином:

  ```shell
  kubectl wait --for=condition=Succeeded storageversionmigration.storagemigration.k8s.io/secrets-migration
  ```

  Вивід буде подібним до:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: secrets-migration
    uid: 628f6922-a9cb-4514-b076-12d3c178967c
    resourceVersion: "90"
    creationTimestamp: "2024-03-12T20:29:45Z"
  spec:
    resource:
      group: ""
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

- [Перевірте](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  збережений Secret тепер починається з `k8s:enc:aescbc:v1:key2`.

## Оновлення бажаної схеми зберігання CRD {#update-preferred-storage-schema-crd}

Розгляньте сценарій, де створено {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD), щоб обслуговувати власні ресурси (CR), і встановлено як бажана схема сховища. Коли настане час ввести v2 CRD, його можна додати для обслуговування лише з вебхуком. Це дозволяє плавний перехід, де користувачі можуть створювати CR за допомогою схеми v1 або v2, з вкбхуком, що виконує необхідну конвертацію схеми між ними. Перш ніж встановити v2 як бажану версію схеми сховища, важливо переконатися, що всі наявні CR, збережені як v1, мігрували на v2. Ця міграція може бути досягнута через _Storage Version Migration_ для міграції всіх CR від v1 до v2.

- Створіть маніфест для CRD з назвою `test-crd.yaml`, наступного змісту:

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: selfierequests.example.com
  spec:
    group: example.com
    names:
      plural: selfierequests
      singular: selfierequest
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
          caBundle: <Інформація про CA Bundle>
      conversionReviewVersions:
      - v1
      - v2
  ```

  Збережена версія на даний момент повинна бути `v1`, підтвердіть це, виконавши:

  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Створіть CRD за допомогою kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Створіть маніфест для прикладу testcrd. Назва маніфесту — `cr1.yaml`, з наступним змістом:

  ```yaml
  apiVersion: example.com/v1
  kind: SelfieRequest
  metadata:
    name: cr1
    namespace: default
  ```

  Створіть CR за допомогою kubectl:

  ```shell
  kubectl apply -f cr1.yaml
  ```

- Перевірте, що CR записано і збережено як v1, отримавши обʼєкт з etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  де `[...]` містить додаткові аргументи для підключення до сервера etcd.

- Оновіть CRD `test-crd.yaml`, щоб додати версію v2 для обслуговування і сховища, а також v1 як обслуговування тільки, наступним чином:

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: selfierequests.example.com
  spec:
    group: example.com
    names:
      plural: selfierequests
      singular: selfierequest
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
          caBundle: <Інформація про CA Bundle>
        conversionReviewVersions:
          - v1
          - v2
  ```

  Збережена версія тепер повинна бути `v2`, підтвердьте це:

  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Оновіть CRD за допомогою kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Створіть файл ресурсу CR з назвою `cr2.yaml` наступного змісту:

  ```yaml
  apiVersion: example.com/v2
  kind: SelfieRequest
  metadata:
    name: cr2
    namespace: default
  ```

- Створіть CR за допомогою kubectl:

  ```shell
  kubectl apply -f cr2.yaml
  ```

- Перевірте, що CR записано і збережено як v2, отримавши обʼєкт з etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr2 [...] | hexdump -C
  ```

  де `[...]` містить додаткові аргументи для підключення до сервера etcd.

- Створіть маніфест міграції версії сховища з назвою `migrate-crd.yaml`, з наступним

 змістом:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: crdsvm
  spec:
    resource:
      group: example.com
      resource: SelfieRequest
  ```

  Створіть обʼєкт за допомогою _kubectl_ наступним чином:

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

- Спостерігайте за міграцією Secretʼів, використовуючи статус. Успішна міграція повинна мати умову `Succeeded`, встановлену на "True" у полі статусу. Отримайте ресурс міграції наступним чином:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  Виведення буде подібним до:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: crdsvm
    uid: 13062fe4-32d7-47cc-9528-5067fa0c6ac8
    resourceVersion: "111"
    creationTimestamp: "2024-03-12T22:40:01Z"
  spec:
    resource:
      group: example.com
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

- Перевірте, що раніше створений cr1 тепер записано і збережено як v2, отримавши обʼєкт з etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  де `[...]` містить додаткові аргументи для підключення до сервера etcd.
