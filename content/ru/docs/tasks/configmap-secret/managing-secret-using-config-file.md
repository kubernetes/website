---
title: Управление Secrets с помощью конфигурационного файла
content_type: task
weight: 20
description: Создание объектов Secret с использованием файла конфигурации ресурса.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Создание Secret {#create-the-config-file}

Сначала можно описать `Secret` в манифесте в формате JSON или YAML,
а затем создать этот объект. Ресурс
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
содержит два отображения: `data` и `stringData`.
Поле `data` используется для хранения произвольных данных, закодированных в base64.
Поле `stringData` предоставлено для удобства и позволяет указывать те же данные
в виде незакодированных строк.
Ключи полей `data` и `stringData` должны состоять из буквенно-цифровых символов,
`-`, `_` или `.`.

В следующем примере в Secret с помощью поля `data` сохраняются две строки.

1. Закодируйте строки в base64:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   Сериализованные значения данных Secret в JSON и YAML кодируются как строки base64. Символы новой строки недопустимы внутри этих строк и должны быть опущены. При использовании утилиты `base64` в Darwin/macOS следует избегать опции `-b` для разбиения длинных строк. Пользователям Linux, напротив, *следует* добавлять опцию `-w 0` к командам `base64` или использовать конвейер `base64 | tr -d '\n'`, если опция `-w` недоступна.
   {{< /note >}}

   Вывод будет аналогичен следующему:

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. Создайте манифест:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```

   Обратите внимание, что имя Secret должно быть допустимым
   [именем DNS-поддомена](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Создайте Secret с помощью [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вывод будет аналогичен следующему:

   ```
   secret/mysecret created
   ```

Чтобы проверить, что Secret был создан, и декодировать его данные, обратитесь к разделу
[Управление Secrets с помощью kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

### Указание незакодированных данных при создании Secret

В ряде сценариев может потребоваться использовать поле `stringData`. Оно позволяет
помещать строки без кодирования base64 непосредственно в Secret; при создании или
обновлении Secret строка будет закодирована автоматически.

Практический пример такого подхода — развёртывание приложения, которое использует
Secret для хранения конфигурационного файла, когда часть значений этого файла
нужно задать в процессе развёртывания.

Например, если приложение использует следующий конфигурационный файл:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

Его можно сохранить в Secret с помощью следующего определения:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

{{< note >}}
Поле `stringData` у Secret плохо работает совместно с серверным применением (server-side apply).
{{< /note >}}

При получении данных Secret команда вернёт закодированные значения,
а не исходный открытый текст, переданный в поле `stringData`.

Например, при выполнении следующей команды:

```shell
kubectl get secret mysecret -o yaml
```

Вывод будет аналогичен следующему:

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

### Одновременное указание `data` и `stringData`

Если одно и то же поле указано одновременно в `data` и `stringData`, используется
значение из `stringData`.

Например, если определить следующий Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
Поле `stringData` у Secret плохо работает совместно с серверным применением (server-side apply).
{{< /note >}}

Объект `Secret` будет создан следующим образом:

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

`YWRtaW5pc3RyYXRvcg==` декодируется в `administrator`.

## Редактирование Secret {#edit-secret}

Чтобы изменить данные в Secret, созданном с помощью манифеста, отредактируйте
поле `data` или `stringData` в манифесте и примените файл к кластеру.
Вы можете редактировать существующий объект `Secret`, если он не является
[неизменяемым](/docs/concepts/configuration/secret/#secret-immutable).

Например, чтобы изменить пароль из предыдущего примера на `birdsarentreal`,
выполните следующие действия:

1. Закодируйте новую строку пароля:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   Вывод будет аналогичен следующему:

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

1. Обновите поле `data`, указав новую строку пароля:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. Примените манифест к кластеру:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   Вывод будет аналогичен следующему:

   ```
   secret/mysecret configured
   ```

Kubernetes обновит существующий `Secret`. Подробнее: инструмент `kubectl`
обнаруживает существующий `Secret` с тем же именем, получает его, планирует
изменения и отправляет обновлённый `Secret` на управляющий слой кластера.

Если вместо этого указать `kubectl apply --server-side`, утилита `kubectl` будет
использовать [Server Side Apply](/docs/reference/using-api/server-side-apply/).

## Очистка

Чтобы удалить созданный Secret:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- Подробнее о [концепции Secret](/docs/concepts/configuration/secret/)
- Как [управлять Secrets с помощью kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Как [управлять Secrets с помощью kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)