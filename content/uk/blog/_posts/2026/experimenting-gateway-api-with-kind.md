---
layout: blog
title: "Експерименти з Gateway API за допомогою kind"
date: 2026-01-28
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
translator: >
  [Андрій Головін](https:/github.com/Andygol)
---

Цей документ проведе вас через налаштування локального експериментального середовища з [Gateway API](https://gateway-api.sigs.k8s.io/) з використанням [kind](https://kind.sigs.k8s.io/). Це середовище розроблено для навчання та тестування. Воно допомагає вам зрозуміти концепції Gateway API без складності промислового середовища.

{{< caution >}}
Це експериментальне навчальне середовище, яке не слід використовувати в повсякденній операційній діяльності. Компоненти, використані в цьому документі, не придатні для операційного використання. Коли ви будете готові розгорнути Gateway API в операційному середовищі, виберіть [реалізацію](https://gateway-api.sigs.k8s.io/implementations/), яка відповідає вашим потребам.
{{< /caution >}}

## Огляд {#overview}

У цьому посібнику ви:

- Налаштуєте локальний кластер Kubernetes за допомогою kind (Kubernetes in Docker)
- Розгорнете [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind), який надає як LoadBalancer Services, так і контролер Gateway API
- Створите Gateway і HTTPRoute для маршрутизації трафіку до демо-застосунку
- Протестуєте вашу конфігурацію Gateway API локально

Це середовище ідеально підходить для навчання, розробки та експериментування з концепціями Gateway API.

## Передумови {#prerequisites}

Перед початком переконайтеся, що у вас встановлено наступне на локальному компʼютері:

- **[Docker](https://docs.docker.com/get-docker/)** — Необхідний для запуску kind та cloud-provider-kind
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** — Інструмент командного рядка Kubernetes
- **[kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** — Kubernetes in Docker
- **[curl](https://curl.se/)** — Необхідний для тестування маршрутів

### Створення кластера kind {#creating-a-kind-cluster}

Створіть новий кластер kind, запустивши:

```shell
kind create cluster
```

Це створить одновузловий кластер Kubernetes, який працює в контейнері Docker.

### Встановлення cloud-provider-kind {#install-cloud-provider-kind}

Далі вам потрібен [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/), який надає два ключові компоненти для цього середовища:

- Контролер LoadBalancer, який призначає адреси сервісам типу LoadBalancer
- Контролер Gateway API, який реалізує специфікацію Gateway API

Він також автоматично встановлює Custom Resource Definitions (CRDs) Gateway API у вашому кластері.

Запустіть cloud-provider-kind як контейнер Docker на тому ж хості, де ви створили кластер kind:

```shell
VERSION="$(basename $(curl -s -L -o /dev/null -w '%{url_effective}' https://github.com/kubernetes-sigs/cloud-provider-kind/releases/latest))"
docker run -d --name cloud-provider-kind --rm --network host -v /var/run/docker.sock:/var/run/docker.sock registry.k8s.io/cloud-provider-kind/cloud-controller-manager:${VERSION}
```

**Примітка:** На деяких системах вам може знадобитися підвищені права доступу до сокета Docker.

Перевірте, що cloud-provider-kind запущений:

```shell
docker ps --filter name=cloud-provider-kind
```

Ви повинні побачити контейнер у списку та в стані виконання. Ви також можете перевірити журнали:

```shell
docker logs cloud-provider-kind
```

## Експериментування з Gateway API {#experimenting-with-gateway-api}

Тепер, коли ваш кластер налаштований, ви можете почати експериментування з ресурсами Gateway API.

cloud-provider-kind автоматично надає GatewayClass під назвою `cloud-provider-kind`. Ви будете використовувати цей клас для створення вашого Gateway.

Варто зауважити, що хоча kind не є хмарним провайдером, проєкт названий `cloud-provider-kind`, оскільки він надає функції, які імітують хмарне середовище.

### Розгортання Gateway {#deploying-a-gateway}

Наступний маніфест буде:

- Створювати новий простір імен `gateway-infra`
- Розгорнтати Gateway, який слухає на порту 80
- Приймати HTTPRoutes з іменами хостів, які відповідають шаблону `*.exampledomain.example`
- Дозволить маршрутам з будь-якого простору імен приєднуватися до Gateway. **Примітка**: У реальних кластерах використовуйте значення Same або Selector у полі [`allowedRoutes` namespace selector](https://gateway-api.sigs.k8s.io/reference/spec/#fromnamespaces), щоб обмежити приєднання.

Застосуйте наступний маніфест:

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: gateway-infra
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway
  namespace: gateway-infra
spec:
  gatewayClassName: cloud-provider-kind
  listeners:
  - name: default
    hostname: "*.exampledomain.example"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: All
```

Потім перевірте, що ваш Gateway правильно запрограмований і має призначену адресу:

```shell
kubectl get gateway -n gateway-infra gateway
```

Очікуваний результат:

```none
NAME      CLASS                 ADDRESS      PROGRAMMED   AGE
gateway   cloud-provider-kind   172.18.0.3   True         5m6s
```

Колона PROGRAMMED повинна показувати True, а поле ADDRESS повинно містити IP-адресу.

### Розгортання демо-застосунку {#deploying-a-demo-application}

Далі розгорніть простий echo-застосунок, який допоможе вам протестувати конфігурацію вашого Gateway. Цей застосунок:

- Слухає на порту 3000
- Повертає деталі запиту, включаючи шлях, заголовки та змінні середовища
- Запускається у просторі імен `demo`

Застосуйте наступний маніфест:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app.kubernetes.io/name: echo
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: echo
  template:
    metadata:
      labels:
        app.kubernetes.io/name: echo
    spec:
      containers:
      - env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
        image: registry.k8s.io/gateway-api/echo-basic:v20251204-v1.4.1
        name: echo-basic
```

### Створення HTTPRoute {#creating-an-httproute}

Тепер створіть HTTPRoute для маршрутизації трафіку з вашого Gateway до echo-застосунку. Цей HTTPRoute буде:

- Реагувати на запити для імені хоста `some.exampledomain.example`
- Маршрутизувати трафік до echo-застосунку
- Приєднуватися до Gateway у просторі імен `gateway-infra`

Застосуйте наступний маніфест:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: echo
  namespace: demo
spec:
  parentRefs:
  - name: gateway
    namespace: gateway-infra
  hostnames: ["some.exampledomain.example"]
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: echo
      port: 3000
```

### Тестування вашого маршруту {#test-your-route}

Завершальний крок — перевірка вашого маршруту за допомогою curl. Ви зробите запит на IP-адресу Gateway з іменем хоста `some.exampledomain.example`. Наступна команда підходить тільки для POSIX shell і може потребувати налаштування для вашого середовища:

```shell
GW_ADDR=$(kubectl get gateway -n gateway-infra gateway -o jsonpath='{.status.addresses[0].value}')
curl --resolve some.exampledomain.example:80:${GW_ADDR} http://some.exampledomain.example
```

Ви повинні отримати JSON-відповідь подібну до цієї:

```json
{
 "path": "/",
 "host": "some.exampledomain.example",
 "method": "GET",
 "proto": "HTTP/1.1",
 "headers": {
  "Accept": [
   "*/*"
  ],
  "User-Agent": [
   "curl/8.15.0"
  ]
 },
 "namespace": "demo",
 "ingress": "",
 "service": "",
 "pod": "echo-dc48d7cf8-vs2df"
}
```

Якщо ви бачите цю відповідь, вітаємо! Ваше середовище Gateway API працює правильно.

## Усунення несправностей {#troubleshooting}

Якщо щось працює не так, як очікується, ви можете усунути несправності, перевіривши стан ваших ресурсів.

### Перевірка стану Gateway {#check-the-gateway-status}

Спочатку перевірте ресурс Gateway:

```shell
kubectl get gateway -n gateway-infra gateway -o yaml
```

Подивіться на розділ `status` на стани. Ваш Gateway повинен мати:

- `Accepted: True` - Gateway був прийнятий контролером
- `Programmed: True` - Gateway був успішно налаштований
- `.status.addresses` заповнений IP-адресою

### Перевірка стану HTTPRoute {#check-the-httproute-status}

Далі перевірте ваш HTTPRoute:

```shell
kubectl get httproute -n demo echo -o yaml
```

Перевірте розділ `status.parents`. Поширені проблеми включають:

- ResolvedRefs встановлено False з причиною `BackendNotFound`; це означає, що сервіс бекенду не має або має неправильне імʼя
- Accepted встановлено False; це означає, що маршрут не міг приєднатися до Gateway (перевірте дозволи простору імен або відповідність імені хосту)

Приклад помилки, коли бекенд не знайдено:

```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2026-01-19T17:13:35Z"
      message: backend not found
      observedGeneration: 2
      reason: BackendNotFound
      status: "False"
      type: ResolvedRefs
    controllerName: kind.sigs.k8s.io/gateway-controller
```

### Перевірка журналів контролера {#check-controller-logs}

Якщо стани ресурсів не розкривають проблему, перевірте журнали cloud-provider-kind:

```shell
docker logs -f cloud-provider-kind
```

Це покаже детальні журнали як з контролерів LoadBalancer, так і Gateway API.

## Очищення {#cleanup}

Коли ви закінчите з експериментами, ви можете очистити ресурси:

### Видалення ресурсів Kubernetes {#remove-kubernetes-resources}

Видаліть простори імен (це видалить усі ресурси в них):

```shell
kubectl delete namespace gateway-infra
kubectl delete namespace demo
```

### Зупинка cloud-provider-kind {#stop-cloud-provider-kind}

Зупиніть та видаліть контейнер cloud-provider-kind:

```shell
docker stop cloud-provider-kind
```

Оскільки контейнер був запущений з прапорцем `--rm`, він буде автоматично видалений при зупинці.

### Видалення кластера kind {#delete-the-kind-cluster}

Нарешті, видаліть кластер kind:

```shell
kind delete cluster
```

## Наступні кроки {#next-steps}

Тепер, коли ви поекспериментували з Gateway API локально, ви готові дослідити готові до промислової експлуатації реалізації:

- **Розгортання в промисловій експлуатації**: Переглядайте [реалізації Gateway API](https://gateway-api.sigs.k8s.io/implementations/), щоб знайти контролер, який відповідає вашим вимогам до експлуатації
- **Дізнайтеся більше**: Ознайомтесь з [документацію Gateway API](https://gateway-api.sigs.k8s.io/), щоб дізнатися про передові функції, такі як TLS, розподіл трафіку та маніпуляція заголовками
- **Розширена маршрутизація**: Експериментуйте з маршрутизацією на основі шляху, узгодженням заголовків, дзеркальним відображенням запитів та іншими функціями, слідуючи [посібникам користувача Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/)

### Фінальне попередження {#a-final-word-of-caution}

Це середовище _kind_ призначене лише для розробки та навчання.
Завжди використовуйте реалізацію Gateway API промислового рівня для реальних робочих навантажень.
