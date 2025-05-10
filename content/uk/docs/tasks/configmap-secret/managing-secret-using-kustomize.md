---
title: Керування Secret за допомогою Kustomize
content_type: task
weight: 30
description: Створення обʼєктів Secret за допомогою файлу kustomization.yaml.
---

<!-- overview -->

`kubectl` підтримує використання [інструменту керування обʼєктами Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/) для керування Secret та ConfigMap. Ви можете створити *генератор ресурсів* за допомогою Kustomize, який створює Secret, який ви можете застосувати до сервера API за допомогою `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення Secret {#create-a-secret}

Ви можете створити Secret, визначивши `secretGenerator` у файлі `kustomization.yaml`, який посилається на інші наявні файли, файли `.env` або літеральні значення. Наприклад, наведені нижче інструкції створюють файл конфігурації kustomization для імені користувача `admin` та пароля `1f2d1e2e67df`.

{{< note >}}
Поле `stringData` для Secret погано працює із застосуванням на стороні сервера.
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

1. Збережіть дані доступу у файлах. Назви файлів є ключами секрету:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n '1f2d1e2e67df' > ./password.txt
   ```

   Прапорець `-n` забезпечує відсутність символу нового рядка в кінці ваших
   файлів.

2. Створіть файл `kustomization.yaml`:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```

{{% /tab %}}
{{% tab name=".env файли" %}}
Ви також можете визначити `secretGenerator` у файлі `kustomization.yaml`, надаючи файли `.env`. Наприклад, наступний файл `kustomization.yaml` використовує дані з файлу `.env.secret`:

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```

{{% /tab %}}
{{< /tabs >}}

У всіх випадках вам не потрібно кодувати значення base64. Імʼя YAML файлу **має** бути `kustomization.yaml` або `kustomization.yml`.

### Застосування файлу kustomization {#apply-the-kustomization-file}

Для створення Secret застосуйте теку, який містить файл kustomization:

```shell
kubectl apply -k <directory-path>
```

Вивід буде подібний до:

```none
secret/database-creds-5hdh7hhgfk created
```

Коли Secret генерується, імʼя Secret створюється шляхом хешування даних Secret і додавання до нього значення хешу. Це забезпечує, що при зміні даних генерується новий Secret.

Щоб перевірити, що Secret був створений та розкодувати дані Secret,

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}'
```

Вивід буде подібний до:

```none
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

Вивід буде подібний до:

```none
1f2d1e2e67df
```

Для отримання додаткової інформації див. [Керування Secret за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#перевірка-секрету) та [Декларативне керування обʼєктами Kubernetes за допомогою Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).

## Редагування Secret {#edit-secret}

1. У вашому файлі `kustomization.yaml` змініть дані, наприклад, `password`.
1. Застосуйте теку, який містить файл kustomization:

    ```shell
    kubectl apply -k <directory-path>
    ```

    Вивід буде подібний до:

    ```none
    secret/db-user-pass-6f24b56cc8 created
    ```

Змінений Secret створюється як новий обʼєкт `Secret`, а не оновлюється наявний обʼєкт `Secret`. Можливо, вам знадобиться оновити посилання на Secret у ваших контейнерах.

## Прибирання {#clean-up}

Для видалення Secret використовуйте `kubectl`:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [концепцію Secret](/docs/concepts/configuration/secret/)
- Дізнайтесь, як [керувати Secret за допомогою kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтесь, як [керувати Secret за допомогою файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
