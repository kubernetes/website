---
title: Оголошення розширених ресурсів для вузла
content_type: task
weight: 70
---

<!-- overview -->

Ця сторінка показує, як вказати розширені ресурси для вузла. Розширені ресурси дозволяють адміністраторам кластера оголошувати ресурси на рівні вузла, які інакше були б невідомі для Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Отримання імен ваших вузлів {#get-the-names-of-your-nodes}

```shell
kubectl get nodes
```

Виберіть один з ваших вузлів для цього завдання.

## Оголошення нового розширеного ресурсу на одному з ваших вузлів {#advertise-a-new-extended-resource-on-one-of-your-nodes}

Щоб оголосити новий розширений ресурс на вузлі, відправте HTTP PATCH запит до сервера API Kubernetes. Наприклад, припустимо, що один з ваших вузлів має чотири підключені dongle. Ось приклад запиту PATCH, який оголошує чотири ресурси dongle для вашого вузла.

```none
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/example.com~1dongle",
    "value": "4"
  }
]
```

Зверніть увагу, що Kubernetes не потрібно знати, що таке dongle або для чого він призначений. Попередній запит PATCH повідомляє Kubernetes, що ваш вузол має чотири речі, які ви називаєте dongle.

Запустіть проксі, щоб відправляти запити на сервер API Kubernetes:

```shell
kubectl proxy
```

У іншому вікні термінала відправте HTTP PATCH запит. Замініть `<your-node-name>` на імʼя вашого вузла:

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "add", "path": "/status/capacity/example.com~1dongle", "value": "4"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

{{< note >}}
У запиті `~1` — це кодування символу `/` у шляху патча. Значення шляху операцій в JSON-Patch трактується як JSON-вказівник. Докладніше дивіться
[IETF RFC 6901](https://tools.ietf.org/html/rfc6901), розділ 3.
{{< /note >}}

Вивід показує, що вузол має потужність 4 dongle:

```none
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

Опишіть свій вузол:

```shell
kubectl describe node <your-node-name>
```

Ще раз, вивід показує ресурс dongle:

```yaml
Capacity:
  cpu: 2
  memory: 2049008Ki
  example.com/dongle: 4
```

Тепер розробники застосунків можуть створювати Podʼи, які вимагають певну кількість dongle. Див. [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/).

## Обговорення {#discussion}

Розширені ресурси схожі на памʼять та ресурси CPU. Наприклад, так само як на вузлі є певна кількість памʼяті та CPU для спільного використання всіма компонентами, що працюють на вузлі, він може мати певну кількість dongle для спільного використання всіма компонентами, що працюють на вузлі. І так само як розробники застосунків можуть створювати Podʼи, які вимагають певної кількості памʼяті та CPU, вони можуть створювати Podʼи, які вимагають певну кількість dongle.

Розширені ресурси є непрозорими для Kubernetes; Kubernetes не знає нічого про їх призначення. Kubernetes знає лише, що у вузла є їх певна кількість. Розширені ресурси мають оголошуватись у цілих числах. Наприклад, вузол може оголошувати чотири dongle, але не 4,5 dongle.

### Приклад зберігання {#storage-example}

Припустимо, що вузол має 800 ГіБ особливого типу дискового простору. Ви можете створити назву для спеціального сховища, скажімо, example.com/special-storage. Потім ви можете оголошувати його в частинах певного розміру, скажімо, 100 ГіБ. У цьому випадку, ваш вузол буде повідомляти, що в ньому є вісім ресурсів типу example.com/special-storage.

```yaml
Capacity:
 ...
 example.com/special-storage: 8
```

Якщо ви хочете дозволити довільні запити на спеціальне зберігання, ви можете оголошувати спеціальне сховище частками розміром 1 байт. У цьому випадку ви оголошуєте 800Gi ресурсів типу example.com/special-storage.

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

Потім контейнер може запросити будь-яку кількість байтів спеціального сховища, до 800Gi.

## Очищення {#clean-up}

Ось запит PATCH, який видаляє оголошення dongle з вузла.

```none
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "remove",
    "path": "/status/capacity/example.com~1dongle",
  }
]
```

Запустіть проксі, щоб відправляти запити на сервер API Kubernetes:

```shell
kubectl proxy
```

У іншому вікні термінала відправте HTTP PATCH запит. Замініть `<your-node-name>` на імʼя вашого вузла:

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

Перевірте, що оголошення dongle було видалено:

```shell
kubectl describe node <your-node-name> | grep dongle
```

(ви не повинні бачити жодного виводу)

## {{% heading "whatsnext" %}}

### Для розробників застосунків {#for-application-developers}

- [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/)
- [Розширений розподіл ресурсів за допомогою DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)

### Для адміністраторів кластера {#for-cluster-administrators}

- [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
- [Розширений розподіл ресурсів за допомогою DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
