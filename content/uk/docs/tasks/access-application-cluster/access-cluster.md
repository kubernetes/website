---
title: Доступ до кластерів
weight: 20
content_type: task
---

<!-- overview -->

В цій темі обговорюється кілька способів взаємодії з кластерами.

<!-- body -->

## Перший доступ з kubectl {#accessing-for-the-first-time-with-kubectl}

При першому доступі до Kubernetes API ми пропонуємо використовувати Kubernetes CLI, `kubectl`.

Щоб отримати доступ до кластера, вам потрібно знати розташування кластера та мати облікові дані для доступу до нього. Зазвичай це налаштовується автоматично, коли ви проходите [Посібник Початок роботи](/docs/setup/), або хтось інший налаштував кластер і надав вам облікові дані та його розташування.

Перевірте розташування та облікові дані, про які знає kubectl, за допомогою цієї команди:

```shell
kubectl config view
```

Багато з [прикладів](/docs/reference/kubectl/quick-reference/) надають введення до використання
`kubectl`, а повна документація знаходиться у [довіднику kubectl](/docs/reference/kubectl/).

## Прямий доступ до REST API {#directly-accessing-the-rest-api}

Kubectl опрацьовує розташування та автентифікацію до apiserver. Якщо ви хочете безпосередньо звертатися до REST API за допомогою http-клієнта, такого як curl або wget, або вебоглядача, існує кілька способів знайти розташування та автентифікуватись:

- Запустіть kubectl в режимі проксі.
  - Рекомендований підхід.
  - Використовує збережене розташування apiserver.
  - Перевіряє особу apiserver за допомогою самопідписного сертифікату. Немає можливості MITM.
  - Виконує автентифікацію на apiserver.
  - У майбутньому може здійснювати інтелектуальне балансування навантаження та відмовостійкість на стороні клієнта.
- Надайте розташування та облікові дані безпосередньо http-клієнту.
  - Альтернативний підхід.
  - Працює з деякими типами клієнтського коду, які не працюють з проксі.
  - Потрібно імпортувати кореневий сертифікат у ваш оглядач для захисту від MITM.

### Використання kubectl proxy

Наступна команда запускає kubectl в режимі, де він діє як зворотний проксі. Вона обробляє розташування apiserver та автентифікацію. Запустіть її так:

```shell
kubectl proxy --port=8080
```

Дивіться опис [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) для отримання додаткової інформації.

Після цього ви можете досліджувати API за допомогою curl, wget або оглядача, замінюючи localhost на [::1] для IPv6, ось так:

```shell
curl http://localhost:8080/api/
```

Вихід буде схожий на це:

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

### Без kubectl proxy

Використовуйте `kubectl apply` і `kubectl describe secret...` для створення токена для стандартного облікового запису за допомогою grep/cut:

Спочатку створіть Secret, запитуючи токен для облікового запису стандартного ServiceAccount:

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

Далі, зачекайте, поки контролер токенів не заповнить Secret токеном:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

Отримайте і використовуйте згенерований токен:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Вихід буде схожий на це:

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

Використовуючи `jsonpath`:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Вихід буде схожий на це:

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

Вищенаведені приклади використовують прапорець `--insecure`. Це залишає їх вразливими до атак MITM. Коли kubectl отримує доступ до кластера, він використовує збережений кореневий сертифікат та клієнтські сертифікати для доступу до сервера. (Вони встановлюються в теку `~/.kube`). Оскільки сертифікати кластера зазвичай самопідписні, це може вимагати спеціальної конфігурації, щоб змусити вашого http-клієнта використовувати кореневий сертифікат.

У деяких кластерах apiserver не вимагає автентифікації; він може працювати на localhost або бути захищеним файрволом. Для цього немає стандарту. [Контроль доступу до API](/docs/concepts/security/controlling-access) описує, як адміністратор кластера може це налаштувати.

## Програмний доступ до API {#programmatic-access-to-the-api}

Kubernetes офіційно підтримує клієнтські бібліотеки для [Go](#go-client) та [Python](#python-client).

### Клієнт Go {#go-client}

- Щоб отримати бібліотеку, виконайте наступну команду: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, дивіться [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user) для детальних інструкцій з встановлення. Дивіться [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) щоб дізнатися, які версії підтримуються.
- Напишіть додаток на основі клієнтів client-go. Зверніть увагу, що client-go визначає свої власні API обʼєкти, тому, якщо необхідно, будь ласка, імпортуйте визначення API з client-go, а не з основного репозиторію, наприклад, `import "k8s.io/client-go/kubernetes"` є правильним.

Go клієнт може використовувати той же [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що й CLI kubectl для знаходження та автентифікації до apiserver. Дивіться цей [приклад](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Якщо застосунок розгорнуто як Pod у кластері, будь ласка, зверніться до [наступного розділу](#accessing-the-api-from-a-pod).

### Клієнт Python {#python-client}

Щоб використовувати [клієнта Python](https://github.com/kubernetes-client/python), виконайте наступну команду: `pip install kubernetes`. Дивіться [сторінку Python Client Library](https://github.com/kubernetes-client/python) для інших варіантів встановлення.

Клієнт Python може використовувати той же [файл kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), що й CLI kubectl для знаходження та автентифікації до apiserver. Дивіться цей [приклад](https://github.com/kubernetes-client/python/tree/master/examples).

### Інші мови {#other-languages}

Існують [клієнтські бібліотеки](/docs/reference/using-api/client-libraries/) для доступу до API з інших мов. Дивіться документацію для інших бібліотек щодо того, як вони автентифікуються.

## Доступ до API з Pod {#accessing-the-api-from-a-pod}

При доступі до API з Pod, розташування та автентифікація на API сервері дещо відрізняються.

Будь ласка, перевірте [Доступ до API з Pod](/docs/tasks/run-application/access-api-from-pod/) для отримання додаткової інформації.

## Доступ до сервісів, що працюють на кластері {#accessing-services-running-on-the-cluster}

Попередній розділ описує, як підʼєднатися до API сервера Kubernetes. Для інформації про підключення до інших сервісів, що працюють на кластері Kubernetes, дивіться [Доступ до сервісів кластера](/docs/tasks/access-application-cluster/access-cluster-services/).

## Запит перенаправлення {#requesting-redirects}

Можливості перенаправлення були визнані застарілими та видалені. Будь ласка, використовуйте проксі (дивіться нижче) замість цього.

## Так багато проксі {#so-many-proxies}

Існує кілька різних проксі, які ви можете зустріти при використанні Kubernetes:

1. [kubectl proxy](#directly-accessing-the-rest-api):

   - працює на десктопі користувача або в Pod
   - проксі з локальної адреси до Kubernetes apiserver
   - клієнт проксі використовує HTTP
   - проксі apiserver використовує HTTPS
   - знаходить apiserver
   - додає заголовки автентифікації

2. [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

   - є бастіоном, вбудованим у apiserver
   - зʼєднує користувача ззовні кластера з IP-адресами кластера, які інакше можуть бути недосяжні
   - працює в процесах apiserver
   - клієнт проксі використовує HTTPS (або http, якщо apiserver налаштований відповідним чином)
   - проксі може використовувати HTTP або HTTPS, як обрано проксі, використовуючи доступну інформацію
   - може використовуватися для доступу до Node, Pod або Service
   - забезпечує балансування навантаження при використанні для доступу до Service

3. [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

   - працює на кожному вузлі
   - проксі UDP та TCP
   - не розуміє HTTP
   - забезпечує балансування навантаження
   - використовується лише для доступу до Service

4. Проксі/Балансувальник навантаження перед apiserver(ами):

   - існування та реалізація варіюється від кластера до кластера (наприклад, nginx)
   - знаходиться між усіма клієнтами та одним або декількома apiserver
   - діє як балансувальник навантаження, якщо є кілька apiserver.

5. Хмарні балансувальники навантаження на зовнішніх сервісах:

   - надаються деякими постачальниками хмарних послуг (наприклад, AWS ELB, Google Cloud Load Balancer)
   - створюються автоматично, коли сервіс Kubernetes має тип `LoadBalancer`
   - використовують лише UDP/TCP
   - реалізація варіюється серед постачальників хмарних послуг.

Користувачі Kubernetes зазвичай не повинні турбуватися про будь-що, крім перших двох типів. Адміністратор кластера зазвичай забезпечить правильне налаштування останніх типів.
