---
title: Управление Secrets с помощью kubectl
content_type: task
weight: 10
description: Создание объекта Secret с использованием утилиты командной строки kubectl.
---

<!-- overview -->

На этой странице показано, как создавать, редактировать, управлять и удалять Kubernetes
{{<glossary_tooltip text="Secrets" term_id="secret">}} с помощью инструмента командной строки `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Создание Secret

Объект `Secret` хранит конфиденциальные данные, например учётные данные,
используемые Pod'ами для доступа к сервисам. К примеру, может потребоваться Secret
для хранения имени пользователя и пароля, необходимых для доступа к базе данных.

Secret можно создать, передав данные непосредственно в команде или сохранив
учётные данные в файлах и указав их в команде. Следующие команды создают Secret,
в котором хранятся имя пользователя `admin` и пароль `S!B\*d$zDsb=`.

### Использование исходных данных

Выполните следующую команду:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```
Для экранирования специальных символов (`$`, `\`, `*`, `=`, `!`) в строках
необходимо использовать одинарные кавычки `''`. В противном случае оболочка
интерпретирует эти символы самостоятельно.

{{< note >}}
Поле `stringData` у Secret плохо работает совместно с серверным применением (server-side apply).
{{< /note >}}

### Использование файлов в качестве источника

1. Сохраните учётные данные в файлы:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   Флаг `-n` гарантирует, что в конце текста в сгенерированных файлах не будет
   лишнего символа новой строки. Это важно, поскольку при чтении файла и кодировании
   содержимого в строку base64 утилита `kubectl` закодирует лишний символ новой строки
   тоже. Экранировать специальные символы в строках, содержащихся в файле, не нужно.

1. Передайте пути к файлам в команде `kubectl`:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   По умолчанию именем ключа становится имя файла. При желании можно указать имя ключа
   явно с помощью `--from-file=[key=]source`. Например:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

При использовании любого из этих методов вывод будет аналогичен следующему:

```
secret/db-user-pass created
```

### Проверка Secret {#verify-the-secret}

Убедитесь, что Secret был создан:

```shell
kubectl get secrets
```

Вывод будет аналогичен следующему:

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

Просмотрите подробную информацию о Secret:

```shell
kubectl describe secret db-user-pass
```

Вывод будет аналогичен следующему:

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

Команды `kubectl get` и `kubectl describe` по умолчанию не отображают содержимое `Secret`.
Это сделано для защиты от случайного раскрытия данных или их сохранения в логах терминала.

### Декодирование Secret {#decoding-secret}

1. Просмотрите содержимое созданного Secret:

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   Вывод будет аналогичен следующему:

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. Декодируйте данные поля `password`:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   Вывод будет аналогичен следующему:

   ```
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   Это пример, приведённый в целях документирования. На практике такой способ
   может привести к тому, что команда с закодированными данными сохранится в истории
   оболочки. Любой, кто имеет доступ к вашему компьютеру, сможет найти эту команду
   и декодировать секрет. Более предпочтительный подход — объединить команды
   просмотра и декодирования.
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## Редактирование Secret {#edit-secret}

Вы можете редактировать существующий объект `Secret`, если он не является
[неизменяемым](/docs/concepts/configuration/secret/#secret-immutable).
Для редактирования Secret выполните следующую команду:

```shell
kubectl edit secrets <secret-name>
```

Откроется редактор по умолчанию, позволяющий обновить закодированные в base64
значения Secret в поле `data`, как показано в следующем примере:

```yaml
# Пожалуйста, отредактируйте объект ниже. Строки, начинающиеся с '#', будут проигнорированы,
# а пустой файл отменит редактирование. При возникновении ошибки во время сохранения файл
# будет открыт повторно с указанием неполадок.
#
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## Очистка

Чтобы удалить Secret, выполните следующую команду:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- Подробнее о [концепции Secret](/docs/concepts/configuration/secret/)
- Как [управлять Secrets с помощью конфигурационного файла](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Как [управлять Secrets с помощью kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
