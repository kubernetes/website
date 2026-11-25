---
title: Керування Secrets за допомогою Kustomize
content_type: task
weight: 30
description: Створення обʼєктів Secret за допомогою файлу kustomization.yaml.
---

<!-- overview -->

`kubectl` підтримує використання [інструмента керування обʼєктами Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/) для керування Secrets і ConfigMaps. За допомогою Kustomize ви створюєте *генератор ресурсів*, який генерує Secret, що його можна застосувати до API-сервера за допомогою `kubectl`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-a-secret}

Ви можете згенерувати Secret, визначивши `secretGenerator` у файлі `kustomization.yaml`, який посилається на інші наявні файли, файли `.env` або літеральні значення. Наприклад, наведені нижче інструкції створюють файл kustomization для імені користувача `admin` і пароля `1f2d1e2e67df`.

{{< note >}}
Поле `stringData` у Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

### Створення файлу kustomization {#create-the-kustomization-file}

{{< tabs name="Secret data" >}}
{{< tab name="Літерали" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="Файли" %}}

1. Збережіть облікові дані у файлах. Назви файлів є ключами Secret:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n '1f2d1e2e67df' > ./password.txt
   ```

   Прапорець `-n` гарантує, що в кінці ваших файлів немає символу нового рядка.

1. Створіть файл `kustomization.yaml`:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```

{{% /tab %}}
{{% tab name="Файли .env" %}}
Ви також можете визначити secretGenerator у файлі `kustomization.yaml`, надавши файли `.env`. Наприклад, наведений нижче файл `kustomization.yaml` отримує дані з файлу `.env.secret`:

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```

{{% /tab %}}
{{< /tabs >}}

У всіх випадках значення не потрібно кодувати в base64. Назва файлу YAML **має** бути `kustomization.yaml` або `kustomization.yml`.

### Застосування файлу kustomization {#apply-the-kustomization-file}

Щоб створити Secret, застосуйте теку, яка містить файл kustomization:

```shell
kubectl apply -k <directory-path>
```

Вивід подібний до такого:

```
secret/database-creds-5hdh7hhgfk created
```

Під час генерації Secret його назву створюють шляхом хешування даних Secret і додавання значення хешу до назви. Це гарантує, що під час кожної зміни даних генерується новий Secret.

Щоб перевірити, що Secret створено, і розкодувати дані Secret,

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}'
```

Вивід подібний до такого:

```
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

Вивід подібний до такого:

```
1f2d1e2e67df
```

Докладніше дивіться [Керування Secrets за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) і [Декларативне керування обʼєктами Kubernetes за допомогою Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).

## Редагування Secret {#edit-secret}

1. У файлі `kustomization.yaml` змініть дані, наприклад `password`.
1. Застосуйте теку, яка містить файл kustomization:

    ```shell
    kubectl apply -k <directory-path>
    ```

    Вивід подібний до такого:

    ```
    secret/db-user-pass-6f24b56cc8 created
    ```

Змінений Secret створюється як новий обʼєкт `Secret`, а не оновлює наявний обʼєкт `Secret`. Можливо, вам доведеться оновити посилання на Secret у ваших Podʼах.

## Очищення {#clean-up}

Щоб видалити Secret, використайте `kubectl`:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтеся, як [керувати Secrets за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтеся, як [керувати Secrets за допомогою файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
