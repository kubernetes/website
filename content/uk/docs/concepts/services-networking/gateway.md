---
title: Gateway API
content_type: concept
description: >-
  Gateway API — це сімейство видів API, які забезпечують динамічне надання інфраструктури та розширену маршрутизацію трафіку.
weight: 55
---

<!-- overview -->

Зробіть мережеві сервіси доступними за допомогою розширюваного, орієнтованого на ролі механізму конфігурації з урахуванням протоколу. [Gateway API](https://gateway-api.sigs.k8s.io/) — це {{<glossary_tooltip text="надбудова" term_id="addons">}}, що містить [види API](https://gateway-api.sigs.k8s.io/references/spec/), які забезпечують динамічне надання інфраструктури та розширену маршрутизацію трафіку.

<!-- body -->

## Принципи дизайну {#design-principles}

Наведені нижче принципи визначили дизайн та архітектуру Gateway API:

- __Орієнтований на ролі:__ Види Gateway API побудовано за організаційними ролями, відповідальними за керування мережевою взаємодією сервісів Kubernetes:
  - __Провайдер інфраструктури:__ Керує інфраструктурою, яка дозволяє кільком ізольованим кластерам обслуговувати кількох орендарів, наприклад, хмарний провайдер.
  - __Оператор кластера:__ Керує кластерами та зазвичай займається політиками, мережевим доступом, дозволами застосунків тощо.
  - __Розробник застосунків:__ Керує застосунком, що працює в кластері, і зазвичай займається конфігурацією на рівні застосунку та композицією [Service](/docs/concepts/services-networking/service/).

- __Переносний:__ Специфікації Gateway API визначено як [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources), і їх підтримують багато [реалізацій](https://gateway-api.sigs.k8s.io/implementations/).

- __Виразний:__ Види Gateway API підтримують функціональність для поширених сценаріїв маршрутизації трафіку, як-от зіставлення за заголовками, розподіл трафіку за вагою та інші, які в [Ingress](/docs/concepts/services-networking/ingress/) були можливі лише за допомогою власних анотацій.

- __Розширюваний:__ Gateway дозволяє повʼязувати власні ресурси на різних рівнях API. Це робить можливим детальне налаштування у відповідних місцях структури API.

## Модель ресурсів {#resource-model}

Gateway API має чотири стабільні види API:

- __GatewayClass:__ Визначає набір шлюзів зі спільною конфігурацією, якими керує контролер, що реалізує цей клас.

- __Gateway:__ Визначає екземпляр інфраструктури обробки трафіку, наприклад, хмарний балансувальник навантаження.

- __HTTPRoute:__ Визначає специфічні для HTTP правила зіставлення трафіку від слухача (listener) Gateway із поданням мережевих точок доступу бекенду. Ці точки доступу часто подаються як {{<glossary_tooltip text="Service" term_id="service">}}.

- __GRPCRoute:__ Визначає специфічні для gRPC правила зіставлення трафіку від слухача (listener) Gateway із поданням мережевих точок доступу бекенду. Ці точки доступу часто подаються як {{<glossary_tooltip text="Service" term_id="service">}}.

Gateway API організовано у різні види API, повʼязані взаємозалежними відносинами, що відображає рольову природу організацій. Обʼєкт Gateway повʼязаний рівно з одним GatewayClass; GatewayClass описує контролер шлюзу, відповідальний за керування Gateways цього класу. Потім із Gateways повʼязуються один або кілька видів маршрутів, наприклад, HTTPRoute. Gateway може фільтрувати маршрути, які можна прикріпити до його `listeners`, утворюючи з маршрутами модель двосторонньої довіри.

Наведена нижче схема ілюструє звʼязки між трьома стабільними видами Gateway API:

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
{{< /mermaid >}}

### GatewayClass {#api-kind-gateway-class}

Gateways можуть бути реалізовані різними контролерами, часто з різними конфігураціями. Gateway має посилатися на GatewayClass, який містить назву контролера, що реалізує цей клас.

Мінімальний приклад GatewayClass:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

У цьому прикладі контролер, який реалізує Gateway API, налаштовано на керування GatewayClasses із назвою контролера `example.com/gateway-controller`. Gateways цього класу керуватиме контролер реалізації.

Повне визначення цього виду API дивіться в довіднику [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass).

### Gateway {#api-kind-gateway}

Gateway описує екземпляр інфраструктури обробки трафіку. Він визначає мережеву точку доступу, яку можна використовувати для обробки трафіку, тобто фільтрування, балансування, розділення тощо, для таких бекендів, як Service. Наприклад, Gateway може представляти хмарний балансувальник навантаження або проксі-сервер у кластері, налаштований на приймання HTTP-трафіку.

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

У цьому прикладі екземпляр інфраструктури обробки трафіку запрограмовано на прослуховування HTTP-трафіку на порту 80. Оскільки поле `addresses` не вказано, адресу або імʼя хоста для Gateway призначає контролер реалізації. Ця адреса використовується як мережева точка доступу для обробки трафіку мережевих точок доступу бекенду, визначених у маршрутах.

Повне визначення цього виду API дивіться в довіднику [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway). Вказівки щодо налаштування слухачів HTTPS/TLS дивіться в [посібнику Gateway API з TLS](https://gateway-api.sigs.k8s.io/guides/tls/).

{{< note >}}
Стандартно Gateway приймає маршрути лише з того самого простору імен. Для маршрутів з інших просторів імен потрібно налаштувати `allowedRoutes`.
{{< /note >}}

### HTTPRoute {#api-kind-httproute}

Вид HTTPRoute визначає поведінку маршрутизації HTTP-запитів від слухача Gateway до мережевих точок доступу бекенду. Для бекенду Service реалізація може подавати мережеву точку доступу бекенду як IP-адресу Service або як EndpointSlices, що стоять за цим Service. HTTPRoute подає конфігурацію, яка застосовується до базової реалізації Gateway. Наприклад, визначення нового HTTPRoute може призвести до налаштування додаткових маршрутів трафіку в хмарному балансувальнику навантаження або проксі-сервері в кластері.

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

У цьому прикладі HTTP-трафік від Gateway `example-gateway` із заголовком Host: зі значенням `www.example.com` і шляхом запиту `/login` буде спрямовано до Service `example-svc` на порт `8080`.

Повне визначення цього виду API дивіться в довіднику [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute).

### GRPCRoute {#api-kind-grpcroute}

Вид GRPCRoute визначає поведінку маршрутизації запитів gRPC від слухача Gateway до мережевих точок доступу бекенду. Для бекенду Service реалізація може подавати мережеву точку доступу бекенду як IP-адресу Service або як EndpointSlices, що стоять за цим Service. GRPCRoute подає конфігурацію, яка застосовується до базової реалізації Gateway. Наприклад, визначення нового GRPCRoute може призвести до налаштування додаткових маршрутів трафіку в хмарному балансувальнику навантаження або проксі-сервері в кластері.

Gateways, що підтримують GRPCRoute, повинні підтримувати HTTP/2 без початкового оновлення з HTTP/1, тому трафік gRPC гарантовано проходить належним чином.

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

У цьому прикладі трафік gRPC від Gateway `example-gateway` із хостом `svc.example.com` буде спрямовано до Service `example-svc` на порт `50051` з того самого простору імен.

GRPCRoute дозволяє зіставляти конкретні сервіси gRPC, як показано в наведеному нижче прикладі:

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

У цьому випадку GRPCRoute зіставлятиме будь-який трафік для svc.example.com і застосовуватиме свої правила маршрутизації, щоб переспрямувати трафік до правильного бекенду. Оскільки вказано лише одне зіставлення, переспрямовуватимуться тільки запити до методу com.example.User.Login на svc.example.com. RPC будь-якого іншого методу цей маршрут не зіставлятиме.

Повне визначення цього виду API дивіться в довіднику [GRPCRoute](https://gateway-api.sigs.k8s.io/references/spec/#grpcroute).

## Потік запитів {#request-flow}

Ось простий приклад маршрутизації HTTP-трафіку до Service за допомогою Gateway та HTTPRoute:

{{< mermaid >}}
graph LR;
  client([клієнт])-. HTTP <br> запит .->Gateway;
  Gateway-->HTTPRoute;
  HTTPRoute-->|Правило <br> маршрутизації|Service;
  Service-->pod1[Pod];
  Service-->pod2[Pod];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class Gateway,HTTPRoute,Service,pod1,pod2 k8s;
  class client plain;
{{< /mermaid >}}

У цьому прикладі потік запиту для Gateway, реалізованого як зворотний проксі, такий:

1. Клієнт починає готувати HTTP-запит для URL `http://www.example.com`
2. DNS-резолвер клієнта запитує імʼя призначення та дізнається про його відповідність одній або кільком IP-адресам, повʼязаним із Gateway.
3. Клієнт надсилає запит на IP-адресу Gateway; зворотний проксі отримує HTTP-запит і використовує заголовок Host:, щоб зіставити його з конфігурацією, отриманою з Gateway і прикріпленого HTTPRoute.
4. За потреби зворотний проксі може виконати зіставлення заголовків запиту та/або шляху на основі правил зіставлення HTTPRoute.
5. За потреби зворотний проксі може змінити запит, наприклад, додати або вилучити заголовки, на основі правил фільтрації HTTPRoute.
6. Насамкінець зворотний проксі пересилає запит до одного або кількох бекендів.

## Відповідність {#conformance}

Gateway API охоплює широкий набір можливостей і має багато реалізацій. Таке поєднання вимагає чітких визначень відповідності та тестів, щоб API забезпечував узгоджений досвід, де б він не використовувався.

Дивіться [документацію щодо відповідності](https://gateway-api.sigs.k8s.io/docs/concepts/conformance/), щоб дізнатися про такі деталі, як канали випусків, рівні підтримки та запуск тестів на відповідність.

## Міграція з Ingress {#migrating-from-ingress}

Gateway API є наступником API [Ingress](/docs/concepts/services-networking/ingress/). Однак він не містить виду Ingress. Тому потрібне одноразове перетворення наявних ресурсів Ingress на ресурси Gateway API.

Докладніше про міграцію ресурсів Ingress на ресурси Gateway API дивіться в [посібнику з міграції з Ingress](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress).

## {{% heading "whatsnext" %}} {#whats-next}

Ресурси Gateway API не реалізовані в Kubernetes нативно: специфікації визначено як [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/), що підтримуються широким спектром [реалізацій](https://gateway-api.sigs.k8s.io/implementations/).
[Встановіть](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) CRD Gateway API або виконайте інструкції зі встановлення обраної реалізації. Після встановлення реалізації скористайтеся посібником [Початок роботи](https://gateway-api.sigs.k8s.io/guides/), щоб швидко почати роботу з Gateway API.

{{< note >}}
Обовʼязково ознайомтеся з документацією обраної вами реалізації, щоб розуміти можливі застереження.
{{< /note >}}

Додаткові відомості про всі види Gateway API дивіться в [специфікації API](https://gateway-api.sigs.k8s.io/reference/api-spec/main/spec/).
