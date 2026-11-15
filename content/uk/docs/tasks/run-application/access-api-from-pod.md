---
title: Отримання доступу до API Kubernetes з Podʼа
content_type: task
weight: 120
---

<!-- overview -->

У цьому посібнику показано, як отримати доступ до API Kubernetes зсередини Podʼа.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Отримання доступу до API зсередини Podʼа {#accessing-the-api-from-within-a-pod}

Під час доступу до API зсередини Podʼа пошук API-сервера й автентифікація на ньому дещо відрізняються від випадку зовнішнього клієнта.

Найпростіший спосіб використовувати API Kubernetes із Podʼа — застосувати одну з офіційних [клієнтських бібліотек](/docs/reference/using-api/client-libraries/). Ці бібліотеки можуть автоматично знаходити API-сервер і автентифікуватися.

### Використання офіційних клієнтських бібліотек {#using-official-client-libraries}

Зсередини Podʼа рекомендовано підʼєднуватися до API Kubernetes такими способами:

- Для клієнта Go використовуйте офіційну [клієнтську бібліотеку Go](https://github.com/kubernetes/client-go/). Функція `rest.InClusterConfig()` автоматично виконує виявлення хоста API й автентифікацію. Дивіться [приклад тут](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Для клієнта Python використовуйте офіційну [клієнтську бібліотеку Python](https://github.com/kubernetes-client/python/). Функція `config.load_incluster_config()` автоматично виконує виявлення хоста API й автентифікацію. Дивіться [приклад тут](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Доступно також багато інших бібліотек, дивіться сторінку [Клієнтські бібліотеки](/docs/reference/using-api/client-libraries/).

У кожному випадку для безпечного звʼязку з API-сервером використовуються облікові дані службового облікового запису Podʼа.

### Прямий доступ до REST API {#directly-accessing-the-rest-api}

Під час роботи в Podʼі ваш контейнер може сформувати HTTPS URL для API-сервера Kubernetes, отримавши змінні середовища `KUBERNETES_SERVICE_HOST` і `KUBERNETES_SERVICE_PORT_HTTPS`. Внутрішньокластерну адресу API-сервера також опубліковано в Service з назвою `kubernetes` у просторі імен `default`, тож Podʼи можуть використовувати `kubernetes.default.svc` як DNS-імʼя локального API-сервера.

{{< note >}}
Kubernetes не гарантує, що API-сервер має дійсний сертифікат для імені хоста `kubernetes.default.svc`; однак від панелі управління **очікується**, що вона надасть дійсний сертифікат для імені хоста або IP-адреси, які представляє `$KUBERNETES_SERVICE_HOST`.
{{< /note >}}

Рекомендований спосіб автентифікації на API-сервері — за допомогою облікових даних [службового облікового запису](/docs/tasks/configure-pod-container/configure-service-account/). Стандартно Pod повʼязаний зі службовим обліковим записом, а облікові дані (токен) цього запису розміщуються в дереві файлової системи кожного контейнера цього Podʼа, у `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Якщо доступний, набір сертифікатів розміщується в дереві файлової системи кожного контейнера у `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, і його слід використовувати для перевірки серверного сертифіката API-сервера.

Нарешті, стандартний простір імен для операцій API в межах простору імен розміщується у файлі `/var/run/secrets/kubernetes.io/serviceaccount/namespace` у кожному контейнері.

### Використання kubectl proxy {#using-kubectl-proxy}

Якщо ви хочете надсилати запити до API без офіційної клієнтської бібліотеки, можна запустити `kubectl proxy` як [команду](/docs/tasks/inject-data-application/define-command-argument-container/) нового sidecar-контейнера в Podʼі. Так `kubectl proxy` автентифікуватиметься в API й відкриє доступ до нього на інтерфейсі `localhost` Podʼа, щоб інші контейнери в Podʼі могли використовувати його безпосередньо.

### Без використання проксі {#without-using-a-proxy}

Можна обійтися без kubectl proxy, передаючи токен автентифікації безпосередньо API-серверу. Внутрішній сертифікат захищає зʼєднання.

```shell
# Вказати імʼя хоста внутрішнього API-сервера
APISERVER=https://kubernetes.default.svc

# Шлях до токена ServiceAccount
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Прочитати простір імен цього Podʼа
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Прочитати bearer-токен ServiceAccount
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Вказати внутрішній центр сертифікації (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Досліджувати API за допомогою TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

Вивід подібний до такого:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
