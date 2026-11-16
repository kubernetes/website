---
title: Міграція обʼєктів Kubernetes за допомогою міграції версій сховища
content_type: task
min-kubernetes-server-version: v1.30
weight: 60
---

<!-- overview -->

{{< feature-state feature_gate_name="StorageVersionMigrator" >}}

Kubernetes покладається на активне переписування даних API для підтримки деяких операцій обслуговування, повʼязаних зі зберіганням у стані спокою. Два помітні приклади — версійна схема збережених ресурсів (тобто зміна бажаної схеми зберігання з v1 на v2 для певного ресурсу) та шифрування у стані спокою (тобто перезапис застарілих даних через зміну способу шифрування даних).

Виконання міграції версій сховища гарантує, що всі обʼєкти ресурсу перенесено із застарілої версії сховища. Вимога до виконання міграції сховища — ресурс повинен мати цілочисельну версію ресурсу. Усі ресурси Kubernetes і CRD гарантовано мають цю властивість, але міграція завершиться збоєм, якщо це не так, наприклад для агрегованих API.

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть [`kubectl`](/docs/tasks/tools/#kubectl).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Функціональна можливість [`StorageVersionMigrator`](/docs/reference/command-line-tools-reference/feature-gates/#StorageVersionMigrator) та REST API `storagemigration.k8s.io/v1` стандартно увімкнені в усіх кластерах.

<!-- steps -->

## Повторне шифрування Secrets Kubernetes за допомогою міграції версій сховища {#re-encrypt-kubernetes-secrets-using-storage-version-migration}

- Спочатку [налаштуйте постачальника KMS](/docs/tasks/administer-cluster/kms-provider/) для шифрування даних у стані спокою в etcd за допомогою такої конфігурації шифрування.

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

  Обовʼязково увімкніть автоматичне перезавантаження файлу конфігурації шифрування, встановивши `--encryption-provider-config-automatic-reload` у true.

- Створіть Secret за допомогою kubectl.

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

- [Перевірте](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted), що серіалізовані дані цього обʼєкта Secret починаються з `k8s:enc:aescbc:v1:key1`.

- Оновіть файл конфігурації шифрування таким чином, щоб виконати ротацію ключа шифрування.

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

- Щоб забезпечити повторне шифрування раніше створеного Secret `my-secret` новим ключем `key2`, ви використаєте _Storage Version Migration_.

- Створіть маніфест StorageVersionMigration з назвою `migrate-secret.yaml` з таким вмістом:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1
  metadata:
    name: secrets-migration
  spec:
    resource:
      group: ""
      resource: secrets
  ```

  Створіть обʼєкт за допомогою `kubectl` таким чином:

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

- Стежте за міграцією Secrets, перевіряючи `.status` обʼєкта StorageVersionMigration. Успішна міграція повинна мати стан `Succeeded` зі значенням true. Отримайте обʼєкт StorageVersionMigration таким чином:

  ```shell
  kubectl wait --for=condition=Succeeded storageversionmigration.storagemigration.k8s.io/secrets-migration
  ```

  Вивід подібний до такого:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1
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

- [Перевірте](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted), що збережений Secret тепер починається з `k8s:enc:aescbc:v1:key2`.

## Оновлення бажаної схеми зберігання CRD {#update-the-preferred-storage-schema-of-a-crd}

Розгляньмо сценарій, у якому {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD) створено для обслуговування власних ресурсів (CR) і встановлено як бажану схему зберігання. Коли настане час ввести v2 CRD, її можна додати лише для обслуговування за допомогою вебхука конвертації. Це забезпечує плавніший перехід, за якого користувачі можуть створювати CR за схемою v1 або v2, а вебхук виконує потрібну конвертацію схеми між ними. Перш ніж встановити v2 як бажану версію схеми зберігання, важливо переконатися, що всі наявні CR, збережені як v1, мігровано на v2. Цю міграцію можна виконати за допомогою _Storage Version Migration_, щоб перенести всі CR з v1 на v2.

- Створіть маніфест для CRD з назвою `test-crd.yaml` з таким вмістом:

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
          caBundle: <CABundle info>
      conversionReviewVersions:
      - v1
      - v2
  ```

  Збережена версія на цей момент має бути `v1`, переконайтеся в цьому, виконавши:

  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Створіть CRD за допомогою kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Створіть маніфест для прикладу testcrd. Назвіть маніфест `cr1.yaml` і використайте такий вміст:

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

  де `[...]` містить додаткові аргументи для зʼєднання із сервером etcd.

- Оновіть CRD `test-crd.yaml`, щоб додати версію v2 для обслуговування й зберігання, а v1 залишити лише для обслуговування, таким чином:

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
          caBundle: <CABundle info>
        conversionReviewVersions:
          - v1
          - v2
  ```

  Збережена версія тепер має бути `v2`, переконайтеся в цьому:

  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Оновіть CRD за допомогою kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Створіть файл ресурсу CR з назвою `cr2.yaml` з таким вмістом:

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

  де `[...]` містить додаткові аргументи для зʼєднання із сервером etcd.

- Створіть маніфест StorageVersionMigration з назвою `migrate-crd.yaml` з таким вмістом:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1
  metadata:
    name: crdsvm
  spec:
    resource:
      group: example.com
      resource: selfierequests
  ```

  Створіть обʼєкт за допомогою _kubectl_ таким чином:

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

- Стежте за міграцією Secrets за допомогою статусу. Успішна міграція повинна мати стан `Succeeded` зі значенням "True" у полі статусу. Отримайте ресурс міграції таким чином:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  Вивід подібний до такого:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1
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

- Перевірте, що раніше створений cr1 тепер записано й збережено як v2, отримавши обʼєкт з etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  де `[...]` містить додаткові аргументи для зʼєднання із сервером etcd.

- Також перевірте, що статус збереженої версії CRD тепер лише v2:

  ```shell
  kubectl get crd testcrds.example.com -o yaml
  ```

  Вивід подібний до такого:

  ```yaml
  kind: CustomResourceDefinition
  apiVersion: apiextensions.k8s.io/v1
  metadata:
    name: testcrds.example.com
  spec:
    group: example.com
    names:
      kind: TestCRD
      plural: testcrds
    scope: Namespaced
    versions:
      - name: v1
        served: true
        storage: false
      - name: v2
        served: true
        storage: true
  status:
    acceptedNames:
      kind: TestCRD
      plural: testcrds
    conditions:
      - type: Established
        status: "True"
    storedVersions:
      - v2
  ```
