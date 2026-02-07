---
title: Gateway API
content_type: concept
description: >-
  Gateway API є різновидом видів API, які забезпечують динамічне надання інфраструктури та розширений маршрутизації трафіку.
weight: 55
---

<!-- overview -->

Забезпечте доступ до мережевих служб за допомогою розширюваного, орієнтованого на ролі та протокол обізнаного механізму конфігурації. [Gateway API](https://gateway-api.sigs.k8s.io/) є {{<glossary_tooltip text="надбудовою" term_id="addons">}}, що містить [види API](https://gateway-api.sigs.k8s.io/references/spec/), які надають динамічну інфраструктуру надання та розширену маршрутизацію трафіку.

<!-- body -->

## Принципи дизайну {#design-principles}

Наведені нижче принципи визначили дизайн та архітектуру Gateway API:

- __Орієнтований на ролі:__ Види Gateway API моделюються за організаційними ролями, які відповідають за управління мережевою службою Kubernetes:
  - __Постачальник інфраструктури:__ Управляє інфраструктурою, яка дозволяє кільком ізольованим кластерам обслуговувати кілька орендарів, наприклад, хмарний постачальник.
  - __Оператор кластера:__ Управляє кластерами та зазвичай цікавиться політиками, мережевим доступом, дозволами застосунків тощо.
  - __Розробник застосунків:__ Управляє застосунком, який працює в кластері та, як правило, цікавиться конфігурацією рівня застосунку та складом [Service](/docs/concepts/services-networking/service/).

- __Переносний:__ Специфікації Gateway API визначаються як [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources) та підтримуються багатьма [реалізаціями](https://gateway-api.sigs.k8s.io/implementations/).

- __Експресивний:__ Види Gateway API підтримують функціональність для загальних випадків маршрутизації трафіку, таких як відповідність на основі заголовків, визначенні пріоритету трафіку та інших, які були можливі тільки в [Ingress](/docs/concepts/services-networking/ingress/) за допомогою власних анотацій.

- __Розширюваний:__ Gateway дозволяє повʼязувати власні ресурси на різних рівнях API. Це робить можливим докладне налаштування на відповідних рівнях структури API.

## Модель ресурсів {#resource-model}

Gateway API має чотири стабільні види API:

- __GatewayClass:__ Визначає набір шлюзів зі спільною конфігурацією та керується контролером, який реалізує цей клас.

- __Gateway:__ Визначає екземпляр інфраструктури обробки трафіку, такої як хмарний балансувальник.

- __HTTPRoute:__ Визначає правила, специфічні для HTTP, для передачі трафіку з Gateway listener на мережеві точки доступу бекенду. Ці точки доступу часто представлені як {{<glossary_tooltip text="Service" term_id="service">}}.

- __GRPCRoute:__ Визначає правила, специфічні для gRPC, для зіставлення трафіку від прослуховувача шлюзу з представленням точок доступу мережі бекенду. Ці точки доступу часто представлені як {{<glossary_tooltip text="Service" term_id="service">}}.

Gateway API організовано за різними видами API, які мають взаємозалежні відносини для підтримки організаційно орієнтованої природи організацій. Обʼєкт Gateway повʼязаний із саме одним GatewayClass; GatewayClass описує контролер шлюзу, відповідального за керування шлюзами цього класу. Один чи кілька видів маршрутів, таких як HTTPRoute, потім повʼязуються з Gateways. Gateway може фільтрувати маршрути, які можуть бути прикріплені до його `слухачів`, утворюючи двоспрямовану довірчу модель з маршрутами.

Наступна схема ілюструє звʼязок між трьома стабільними видами Gateway API:

{{< mermaid >}}
graph LR;
subgraph cluster["Кластер"]
direction LR
HTTPRoute --> Gateway;
Gateway --> GatewayClass;
end
classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class HTTPRoute,Gateway,GatewayClass k8s;
class cluster cluster;
{{</ mermaid >}}

<!-- {{< figure src="/docs/images/gateway-kind-relationships.svg" alt="A figure illustrating the relationships of the three stable Gateway API kinds" class="diagram-medium" >}} -->

### GatewayClass {#api-kind-gateway-class}

Шлюзи можуть бути реалізовані різними контролерами, часто з різними конфігураціями. Шлюз має посилатися на GatewayClass, який містить імʼя контролера, що реалізує цей клас.

Мінімальний приклад GatewayClass:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

У цьому прикладі контролер, який реалізував Gateway API, налаштований для управління GatewayClasses з іменем контролера `example.com/gateway-controller`. Шлюзи цього класу будуть керуватися контролером реалізації.

Дивіться [специфікацію GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass) для повного визначення цього виду API.

### Gateway {#api-kind-gateway}

Gateway описує екземпляр інфраструктури обробки трафіку. Він визначає мережеву точку доступу з використанням якої можна обробляти трафік, тобто фільтрувати, балансувати, розділяти тощо для таких бекендів як Service. Наприклад, шлюз може представляти хмарний балансувальник навантаження або внутрішній проксі-сервер, налаштований для отримання HTTP-трафіку.

Типовий приклад ресурсу Gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-namespace
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    hostname: "www.example.com"
    allowedRoutes:
      namespaces:
        from: Same
```

У цьому прикладі екземпляр інфраструктури обробки трафіку програмується на прослуховування HTTP-трафіку на порту 80. Оскільки поле `addresses` не вказано, адреса чи імʼя хосту надається Gateway контролером реалізації. Ця адреса використовується як мережева точка доступу для обробки трафіку бекенду, визначеного в маршрутах.

Дивіться [специфікацію Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway) для повного визначення цього виду API.

{{< note >}}
Стандартно Gateway приймає тільки маршрути з того самого простору імен. Для маршрутів між просторами імен потрібно налаштувати `allowedRoutes`.
{{< /note >}}

### HTTPRoute {#api-kind-httproute}

Вид HTTPRoute визначає поведінку маршрутизації HTTP-запитів від слухача Gateway до бекенду мережевих точок доступу. Для бекенду Service реалізація може представляти мережеву точку доступу як IP-адресу Service чи поточні EndpointSlice у Service. HTTPRoute представляє конфігурацію, яка застосовується до внутрішньої реалізації Gateway. Наприклад, визначення нового HTTPRoute може призвести до налаштування додаткових маршрутів трафіку в хмарному балансувальнику або внутрішньому проксі-сервері.

Типовий приклад HTTPRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

У цьому прикладі HTTP-трафік від Gateway `example-gateway` із заголовком Host: `www.example.com` та вказаним шляхом запиту `/login` буде направлений до Service `example-svc` на порт `8080`.

Дивіться [специфікацію HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute) для повного визначення цього виду API.

### GRPCRoute {#api-kind-grpcroute}

Тип GRPCRoute визначає поведінку маршрутизації запитів gRPC від прослуховувача шлюзу до точок доступу мережі бекенду. Для бекенду Service реалізація може представляти точку доступу мережі бекенду як IP-адресу Service або EndpointSlices, що підтримують Service. GRPCRoute представляє конфігурацію, яка застосовується до базової реалізації шлюзу. Наприклад, визначення нового GRPCRoute може призвести до конфігурації додаткових маршрутів трафіку в хмарному балансувальнику навантаження або проксі-сервері в кластері.

Шлюзи, що підтримують GRPCRoute, повинні підтримувати HTTP/2 без початкового оновлення з HTTP/1, щоб гарантувати належний потік трафіку gRPC.

Типовий приклад GRPCRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 50051
```

У цьому прикладі трафік gRPC від шлюзу `example-gateway` з хостом, встановленим на `svc.example.com`, буде спрямований до сервісу `example-svc` на порту `50051` з того самого простору імен.

GRPCRoute дозволяє зіставляти конкретні сервіси gRPC, як показано в наступному прикладі:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - matches:
    - method:
        service: com.example
        method: Login
    backendRefs:
    - name: foo-svc
      port: 50051
```

У цьому випадку GRPCRoute буде відповідати будь-якому трафіку для svc.example.com і застосовувати свої правила маршрутизації для переадресації трафіку до правильного бекенду. Оскільки вказано тільки одне співпадіння, будуть переадресовані тільки запити для методу com.example.User.Login до svc.example.com. RPC будь-якого іншого методу не будуть відповідати цьому маршруту.

Повне визначення цього типу API див. у довідці [GRPCRoute](https://gateway-api.sigs.k8s.io/reference/spec/#grpcroute).

## Потік запитів {#request-flow}

Ось простий приклад маршрутизації HTTP-трафіку до Service за допомогою Gateway та HTTPRoute:

{{< mermaid >}}
graph LR;
  client([клієнт])-. HTTP <br> запит .->Gateway;
  Gateway-->HTTPRoute;
  HTTPRoute-->|Правила <br> маршрутизації|Service;
  Service-->pod1[Pod];
  Service-->pod2[Pod];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class Gateway,HTTPRoute,Service,pod1,pod2 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}


<!-- {{< figure src="/docs/images/gateway-request-flow.svg" alt="A diagram that provides an example of HTTP traffic being routed to a Service by using a Gateway and an HTTPRoute" class="diagram-medium" >}} -->

У цьому прикладі потік запиту для Gateway, реалізованого як зворотний проксі, є таким:

1. Клієнт починає готувати HTTP-запит для URL `http://www.example.com`
2. DNS-resolver клієнта запитує імʼя призначення та дізнається про звʼязок між однією чи кількома IP-адресами, повʼязаними з Gateway.
3. Клієнт надсилає запит на IP-адресу Gateway; зворотній проксі отримує HTTP запит і використовує заголовок Host: заголовок має збігатись з налаштуваннями, які були отримані від Gateway та прикріпленого HTTPRoute. Опційно зворотній проксі може виконати порівняння заголовків або шляху запиту на основі правил відповідності HTTPRoute.
4. Опційно зворотній проксі може змінювати запит; наприклад, додавати чи видаляти заголовки, відповідно до правил фільтрації HTTPRoute.
5. Наприкінці зворотній проксі пересилає запит на один чи кілька бекендів.

## Відповідність {#conformance}

Gateway API охоплює широкий набір функцій та має широке впровадження. Ця комбінація вимагає чітких визначень відповідності та тестів, щоб гарантувати, що API забезпечує однаковий підхід, де б він не використовувався.

Дивіться документацію щодо [відповідності](https://gateway-api.sigs.k8s.io/concepts/conformance/) для розуміння деталей, таких як канали випусків, рівні підтримки та виконання тестів відповідності.

## Міграція з Ingress {#migrating-from-ingress}

Gateway API є наступником [Ingress](/docs/concepts/services-networking/ingress/) API. Однак він не включає вид Ingress. Внаслідок цього необхідно провести одноразове перетворення з наявних ресурсів Ingress на ресурси Gateway API.

Дивіться [посібник з міграції](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress) з Ingress для отримання деталей щодо міграції ресурсів Ingress на ресурси Gateway API.

## {{% heading "whatsnext" %}}

Замість того, щоб ресурси Gateway API були реалізовані нативно в Kubernetes, специфікації визначаються як [Власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) та підтримуються широким спектром [реалізацій](https://gateway-api.sigs.k8s.io/implementations/).
[Встановіть](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) CRD Gateway API або виконайте інструкції щодо встановлення обраної реалізації. Після встановлення реалізації скористайтесь розділом [Початок роботи](https://gateway-api.sigs.k8s.io/guides/) для швидкого початку роботи з Gateway API.

{{< note >}}
Обовʼязково ознайомтесь з документацією обраної вами реалізації, щоб розуміти можливі обмеження.
{{< /note >}}

Дивіться [специфікацію API](https://gateway-api.sigs.k8s.io/reference/spec/) для отримання додаткових деталей про всі види API Gateway API.
