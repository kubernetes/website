---
title: Управление Secrets с помощью Kustomize
content_type: task
weight: 30
description: Создание Secret с использованием файла kustomization.yaml.
---

<!-- overview -->

`kubectl` поддерживает использование [инструмента управления объектами Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/) для управления Secrets
и ConfigMaps. С помощью Kustomize создаётся *генератор ресурсов*, который
формирует Secret, применяемый к API-серверу командой `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Создание Secret

Secret можно сгенерировать, определив `secretGenerator` в файле
`kustomization.yaml`, который ссылается на существующие файлы, файлы `.env`
или литеральные значения. Например, следующие инструкции создают файл
kustomization для имени пользователя `admin` и пароля `1f2d1e2e67df`.

{{< note >}}
Поле `stringData` у Secret плохо работает совместно с серверным применением (server-side apply).
{{< /note >}}

### Создание файла kustomization

{{< tabs name="Secret data" >}}
{{< tab name="Literals" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="Files" %}}
1.  Сохраните учётные данные в файлы. Имена файлов станут ключами Secret:

    ```shell
    echo -n 'admin' > ./username.txt
    echo -n '1f2d1e2e67df' > ./password.txt
    ```
    Флаг `-n` гарантирует отсутствие символа новой строки в конце файлов.

1.  Создайте файл `kustomization.yaml`:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```
{{% /tab %}}
{{% tab name=".env files" %}}
`secretGenerator` в файле `kustomization.yaml` можно также определить с помощью
файлов `.env`. Например, следующий файл `kustomization.yaml` считывает данные
из файла `.env.secret`:

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

Во всех случаях кодировать значения в base64 не нужно. Имя YAML-файла **должно**
быть `kustomization.yaml` или `kustomization.yml`.

### Применение файла kustomization

Чтобы создать Secret, примените директорию, содержащую файл kustomization:

```shell
kubectl apply -k <directory-path>
```

Вывод будет аналогичен следующему:

```
secret/database-creds-5hdh7hhgfk created
```

При генерации Secret его имя формируется путём хэширования данных Secret
и добавления значения хэша к имени. Это гарантирует, что при каждом изменении
данных будет сгенерирован новый Secret.

Чтобы убедиться, что Secret был создан, и декодировать его данные:

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}' 
```

Вывод будет аналогичен следующему:

```
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

Вывод будет аналогичен следующему:

```
1f2d1e2e67df
```

Дополнительную информацию см. в разделах
[Управление Secrets с помощью kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) и
[Декларативное управление объектами Kubernetes с помощью Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).

## Редактирование Secret {#edit-secret}

1.  Измените данные в файле `kustomization.yaml`, например значение `password`.
1.  Примените директорию, содержащую файл kustomization:

    ```shell
    kubectl apply -k <directory-path>
    ```

    Вывод будет аналогичен следующему:

    ```
    secret/db-user-pass-6f24b56cc8 created
    ```

Отредактированный Secret создаётся как новый Secret, а не обновляет
существующий. Возможно, потребуется обновить ссылки на Secret в ваших Pod'ах.

## Очистка

Чтобы удалить Secret, используйте `kubectl`:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- Подробнее о [концепции Secret](/docs/concepts/configuration/secret/)
- Как [управлять Secrets с помощью kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Как [управлять Secrets с помощью конфигурационного файла](/docs/tasks/configmap-secret/managing-secret-using-config-file/)