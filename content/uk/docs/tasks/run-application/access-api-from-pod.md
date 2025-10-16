---
title: Отримання доступу до API Kubernetes з Pod
content_type: task
weight: 120
---

<!-- overview -->

Цей посібник демонструє, як отримати доступ до API Kubernetes з середини Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Отримання доступу до API з середини Pod {#accessing-the-api-from-a-pod}

При доступі до API з середини Pod, пошук та автентифікація до сервера API відрізняються трохи від зовнішнього клієнта.

Найпростіший спосіб використовувати API Kubernetes з Pod — використовувати одну з офіційних [клієнтських бібліотек](/docs/reference/using-api/client-libraries/). Ці бібліотеки можуть автоматично визначати сервер API та автентифікувати.

### Використання офіційних клієнтських бібліотек {#using-official-client-libraries}

З середини Pod рекомендовані способи підключення до API Kubernetes:

- Для клієнта Go використовуйте офіційну [бібліотеку клієнтів Go](https://github.com/kubernetes/client-go/). Функція `rest.InClusterConfig()` автоматично обробляє визначення хосту API та автентифікацію.  Див. [приклад тут](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Для клієнта Python використовуйте офіційну [бібліотеку клієнтів Python](https://github.com/kubernetes-client/python/). Функція `config.load_incluster_config()` автоматично обробляє визначення хоста API та автентифікацію. Див. [приклад тут](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Існує кілька інших доступних бібліотек, зверніться до [Сторінки клієнтських бібліотек](/docs/reference/using-api/client-libraries/).

У кожному випадку облікові дані облікового службово запису Pod використовуються для забезпечення безпечного звʼязку з сервером API.

### Прямий доступ до REST API {#directly-accessing-the-rest-api}

Під час роботи в Pod ваш контейнер може створити HTTPS URL для сервера API Kubernetes, отримавши змінні середовища `KUBERNETES_SERVICE_HOST` та `KUBERNETES_SERVICE_PORT_HTTPS`. Внутрішня адреса сервера API також публікується для Service з іменем `kubernetes` в просторі імен `default`, щоб Pod можна було використовувати `kubernetes.default.svc` як DNS-імʼя для локального сервера API.

{{< note >}}
Kubernetes не гарантує, що сервер API має дійсний сертифікат для імені хосту `kubernetes.default.svc`; однак очікується, що панель управління **представить** дійсний сертифікат для імені хоста або IP-адреси, яку представляє `$KUBERNETES_SERVICE_HOST`.
{{< /note >}}

Рекомендований спосіб автентифікації на сервері API — за допомогою [службового облікового запису](/docs/tasks/configure-pod-container/configure-service-account/). Стандартно, Pod повʼязаний з службовим обліковим записом, і обліковий запис (токен) для цього службового облікового запису розміщується в дереві файлової системи кожного контейнера в цьому Pod, у `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Якщо доступно, пакет сертифікатів розміщується в дереві файлової системи кожного контейнера за адресою `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, і його слід використовувати для перевірки сертифіката сервера API.

Нарешті, простір імен default для операцій з просторовими іменами API розміщується в файлі у `/var/run/secrets/kubernetes.io/serviceaccount/namespace` в кожному контейнері.

### Використання kubectl proxy {#using-kubectl-proxy}

Якщо ви хочете запитувати API без офіційної клієнтської бібліотеки, ви можете запустити `kubectl proxy` як [команду](/docs/tasks/inject-data-application/define-command-argument-container/) нового контейнера sidecar в Pod. Таким чином, `kubectl proxy` буде автентифікуватися до API та викладати його на інтерфейс `localhost` Pod, щоб інші контейнери в Pod могли використовувати його безпосередньо.

### Без використання проксі {#without-using-a-proxy}

Можливо уникнути використання kubectl proxy, передаючи токен автентифікації прямо на сервер API. Внутрішній сертифікат забезпечує зʼєднання.

```shell
# Вказати імʼя хоста внутрішнього API-сервера
APISERVER=https://kubernetes.default.svc

# Шлях до токена ServiceAccount
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Прочитати простір імен цього Pod
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Прочитати токен облікового службового запису
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Звертатися до внутрішнього центру сертифікації (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Досліджувати API за допомогою TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

Вивід буде подібний до цього:

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
