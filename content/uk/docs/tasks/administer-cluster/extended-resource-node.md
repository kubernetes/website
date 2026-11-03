---
title: Оголошення розширених ресурсів для вузла
content_type: task
weight: 70
---

<!-- overview -->

Ця сторінка показує, як вказати розширені ресурси для вузла. Розширені ресурси дозволяють адміністраторам кластера оголошувати ресурси на рівні вузла, які інакше були б невідомі для Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Отримання імен ваших вузлів {#get-the-names-of-your-nodes}

```shell
kubectl get nodes
```

Виберіть один з ваших вузлів для цього завдання.

## Оголошення нового розширеного ресурсу на одному з ваших вузлів {#advertise-a-new-extended-resource-on-one-of-your-nodes}

Щоб оголосити новий розширений ресурс на вузлі, надішліть HTTP-запит PATCH до API-сервера Kubernetes. Наприклад, припустимо, що до одного з ваших вузлів підключено чотири dongle. Ось приклад запиту PATCH, який оголошує чотири ресурси dongle для вашого вузла.

```
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

Зверніть увагу, що Kubernetes не потрібно знати, що таке dongle або для чого він призначений. Наведений вище запит PATCH повідомляє Kubernetes, що ваш вузол має чотири речі, які ви називаєте dongle.

Запустіть проксі, щоб легко надсилати запити до API-сервера Kubernetes:

```shell
kubectl proxy
```

В іншому вікні термінала надішліть HTTP-запит PATCH. Замініть `<your-node-name>` на імʼя вашого вузла:

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "add", "path": "/status/capacity/example.com~1dongle", "value": "4"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

{{< note >}}
У наведеному вище запиті `~1` — це кодування символу `/` у шляху патча. Значення шляху операції в JSON-Patch тлумачиться як JSON-вказівник. Докладніше дивіться [IETF RFC 6901](https://tools.ietf.org/html/rfc6901), розділ 3.
{{< /note >}}

Вивід показує, що вузол має місткість 4 dongle:

```
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

Опишіть свій вузол:

```
kubectl describe node <your-node-name>
```

Знову ж таки, вивід показує ресурс dongle:

```yaml
Capacity:
  cpu: 2
  memory: 2049008Ki
  example.com/dongle: 4
```

Тепер розробники застосунків можуть створювати Podʼи, які вимагають певну кількість dongle. Див. [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/).

## Обговорення {#discussion}

Розширені ресурси схожі на ресурси памʼяті та CPU. Наприклад, так само як на вузлі є певна кількість памʼяті та CPU для спільного використання всіма компонентами, що працюють на вузлі, він може мати певну кількість dongle для спільного використання всіма компонентами, що працюють на вузлі. І так само як розробники застосунків можуть створювати Podʼи, які запитують певну кількість памʼяті та CPU, вони можуть створювати Podʼи, які запитують певну кількість dongle.

Розширені ресурси є непрозорими для Kubernetes; Kubernetes не знає нічого про їх призначення. Kubernetes знає лише, що у вузла є їх певна кількість. Розширені ресурси мають оголошуватись у цілих числах. Наприклад, вузол може оголошувати чотири dongle, але не 4,5 dongle.

### Приклад зі сховищем {#storage-example}

Припустимо, що вузол має 800 GiB дискового простору особливого типу. Ви можете створити назву для цього спеціального сховища, скажімо, example.com/special-storage. Потім ви можете оголошувати його частинами певного розміру, скажімо, по 100 GiB. У цьому випадку ваш вузол оголошуватиме, що в ньому є вісім ресурсів типу example.com/special-storage.

```yaml
Capacity:
 ...
 example.com/special-storage: 8
```

Якщо ви хочете дозволити довільні запити на спеціальне сховище, ви можете оголошувати спеціальне сховище частинами розміром 1 байт. У цьому випадку ви оголосите 800Gi ресурсів типу example.com/special-storage.

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

Тоді контейнер зможе запросити будь-яку кількість байтів спеціального сховища, до 800Gi.

## Очищення {#clean-up}

Ось запит PATCH, який видаляє оголошення dongle з вузла.

```
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

Запустіть проксі, щоб легко надсилати запити до API-сервера Kubernetes:

```shell
kubectl proxy
```

В іншому вікні термінала надішліть HTTP-запит PATCH. Замініть `<your-node-name>` на імʼя вашого вузла:

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

Перевірте, що оголошення dongle було видалено:

```
kubectl describe node <your-node-name> | grep dongle
```

(ви не повинні бачити жодного виводу)

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-application-developers}

- [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/)
- [Розподіл розширених ресурсів за допомогою DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#extended-resource)

### Для адміністраторів кластера {#for-cluster-administrators}

- [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [Налаштування мінімальних та максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
- [Розподіл розширених ресурсів за допомогою DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#extended-resource)
