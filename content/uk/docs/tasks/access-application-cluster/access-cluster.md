---
title: Доступ до кластерів
weight: 20
content_type: concept
---

<!-- overview -->

У цій темі розглянуто кілька способів взаємодії з кластерами.

<!-- body -->

## Перший доступ за допомогою kubectl {#accessing-for-the-first-time-with-kubectl}

Під час першого доступу до Kubernetes API радимо використовувати Kubernetes CLI — `kubectl`.

Щоб отримати доступ до кластера, потрібно знати його розташування й мати облікові дані для доступу. Зазвичай це налаштовується автоматично, коли ви проходите [посібник «Початок роботи»](/docs/setup/), або хтось інший налаштував кластер і надав вам облікові дані та розташування.

Перевірте розташування та облікові дані, про які знає kubectl, за допомогою цієї команди:

```shell
kubectl config view
```

Багато [прикладів](/docs/reference/kubectl/quick-reference/) знайомлять із використанням `kubectl`, а повну документацію наведено в [довіднику kubectl](/docs/reference/kubectl/).

## Прямий доступ до REST API {#directly-accessing-the-rest-api}

`kubectl` сам знаходить API-сервер і автентифікується на ньому. Якщо ви хочете звертатися до REST API безпосередньо за допомогою http-клієнта, як-от curl або wget, чи браузера, є кілька способів знайти API-сервер і автентифікуватися:

- Запустіть kubectl у режимі проксі.
  - Рекомендований підхід.
  - Використовує збережене розташування API-сервера.
  - Перевіряє автентичність API-сервера за допомогою самопідписаного сертифіката. Атака MITM неможлива.
  - Автентифікується на API-сервері.
  - У майбутньому може виконувати інтелектуальне балансування навантаження та перемикання в разі відмови на стороні клієнта.
- Надайте розташування й облікові дані безпосередньо http-клієнту.
  - Альтернативний підхід.
  - Працює з деякими типами клієнтського коду, які збиваються через використання проксі.
  - Потрібно імпортувати кореневий сертифікат у браузер для захисту від MITM.

### Використання kubectl proxy {#using-kubectl-proxy}

Наведена нижче команда запускає kubectl у режимі, у якому він працює як зворотний проксі. Він сам знаходить API-сервер і автентифікується. Запустіть її так:

```shell
kubectl proxy --port=8080
```

Докладніше дивіться в описі [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy).

Після цього можна досліджувати API за допомогою curl, wget або браузера, замінивши localhost на [::1] для IPv6, ось так:

```shell
curl http://localhost:8080/api/
```

Вивід подібний до такого:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

### Без kubectl proxy {#without-kubectl-proxy}

Використайте `kubectl apply` і `kubectl describe secret...`, щоб створити токен для стандартного ServiceAccount за допомогою grep/cut:

Спочатку створіть Secret, запитавши токен для стандартного ServiceAccount:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
```

Далі зачекайте, поки контролер токенів заповнить Secret токеном:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

Отримайте й використайте згенерований токен:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Вивід подібний до такого:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

За допомогою `jsonpath`:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Вивід подібний до такого:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

У наведених вище прикладах використано прапорець `--insecure`. Через це запит вразливий до атак MITM. Коли kubectl звертається до кластера, він використовує збережений кореневий сертифікат і клієнтські сертифікати для доступу до сервера. (Вони встановлені в теці `~/.kube`.) Оскільки сертифікати кластера зазвичай самопідписані, щоб http-клієнт використовував кореневий сертифікат, може знадобитися спеціальне налаштування.

У деяких кластерах API-сервер не вимагає автентифікації: він може обслуговувати запити на localhost або бути захищеним фаєрволом. Стандарту для цього немає. У розділі [Контроль доступу до API](/docs/concepts/security/controlling-access) описано, як адміністратор кластера може це налаштувати.

## Програмний доступ до API {#programmatic-access-to-the-api}

Kubernetes офіційно підтримує клієнтські бібліотеки для [Go](#go-client) та [Python](#python-client).

### Клієнт Go {#go-client}

* Щоб отримати бібліотеку, виконайте таку команду: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, докладні інструкції зі встановлення дивіться в [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user). Підтримувані версії дивіться на [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix).
* Напишіть застосунок на основі клієнтів client-go. Зверніть увагу, що client-go визначає власні обʼєкти API, тому за потреби імпортуйте визначення API з client-go, а не з основного репозиторію, наприклад, правильним є `import "k8s.io/client-go/kubernetes"`.

Клієнт Go може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що й CLI kubectl, щоб знайти API-сервер і автентифікуватися на ньому. Дивіться цей [приклад](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Якщо застосунок розгорнуто як Pod у кластері, зверніться до [наступного розділу](#accessing-the-api-from-a-pod).

### Клієнт Python {#python-client}

Щоб використовувати [клієнт Python](https://github.com/kubernetes-client/python), виконайте таку команду: `pip install kubernetes`. Інші варіанти встановлення дивіться на [сторінці Python Client Library](https://github.com/kubernetes-client/python).

Клієнт Python може використовувати той самий [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що й CLI kubectl, щоб знайти API-сервер і автентифікуватися на ньому. Дивіться цей [приклад](https://github.com/kubernetes-client/python/tree/master/examples).

### Інші мови {#other-languages}

Для доступу до API з інших мов існують [клієнтські бібліотеки](/docs/reference/using-api/client-libraries/). Про те, як вони автентифікуються, дивіться документацію цих бібліотек.

## Доступ до API з Podʼа {#accessing-the-api-from-a-pod}

Під час доступу до API з Podʼа пошук API-сервера й автентифікація на ньому дещо відрізняються.

Докладніше дивіться в розділі [Доступ до API зсередини Podʼа](/docs/tasks/run-application/access-api-from-pod/).

## Доступ до сервісів, що працюють у кластері {#accessing-services-running-on-the-cluster}

У попередньому розділі описано, як підʼєднатися до API-сервера Kubernetes. Про підʼєднання до інших сервісів, що працюють у кластері Kubernetes, дивіться [Доступ до сервісів кластера](/docs/tasks/access-application-cluster/access-cluster-services/).

## Запит перенаправлення {#requesting-redirects}

Можливості перенаправлення визнано застарілими й вилучено. Натомість використовуйте проксі (дивіться нижче).

## Так багато проксі {#so-many-proxies}

Під час роботи з Kubernetes можна зустріти кілька різних проксі:

1. [kubectl proxy](#directly-accessing-the-rest-api):

   - працює на компʼютері користувача або в Podʼі
   - проксіює з адреси localhost до API-сервера Kubernetes
   - від клієнта до проксі використовується HTTP
   - від проксі до API-сервера використовується HTTPS
   - знаходить API-сервер
   - додає заголовки автентифікації

1. [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

   - є бастіоном, вбудованим в API-сервер
   - зʼєднує користувача поза кластером з IP-адресами кластера, які інакше можуть бути недосяжними
   - працює в процесах API-сервера
   - від клієнта до проксі використовується HTTPS (або http, якщо так налаштовано API-сервер)
   - від проксі до цілі може використовуватися HTTP або HTTPS на вибір проксі, на основі наявної інформації
   - може використовуватися для доступу до Node, Pod або Service
   - забезпечує балансування навантаження, коли використовується для доступу до Service

1. [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

   - працює на кожному вузлі
   - проксіює UDP і TCP
   - не розуміє HTTP
   - забезпечує балансування навантаження
   - використовується лише для доступу до сервісів

1. Проксі або балансувальник навантаження перед API-сервером (або кількома):

   - наявність і реалізація різняться від кластера до кластера (наприклад, nginx)
   - розташовується між усіма клієнтами та одним чи кількома API-серверами
   - працює як балансувальник навантаження, якщо є кілька API-серверів.

1. Хмарні балансувальники навантаження для зовнішніх сервісів:

   - надаються деякими хмарними провайдерами (наприклад, AWS ELB, Google Cloud Load Balancer)
   - створюються автоматично, коли сервіс Kubernetes має тип `LoadBalancer`
   - використовують лише UDP/TCP
   - реалізація залежить від хмарного провайдера.

Користувачам Kubernetes зазвичай не потрібно перейматися нічим, крім перших двох типів. За правильне налаштування решти типів зазвичай відповідає адміністратор кластера.
