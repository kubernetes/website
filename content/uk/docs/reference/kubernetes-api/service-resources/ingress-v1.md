---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "Ingress"
content_type: "api_reference"
description: "Ingress — це набір правил, які дозволяють вхідним зʼєднанням досягати точок доступу, визначених бекендом."
title: "Ingress"
weight: 4
auto_generated: false
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## Ingress {#Ingress}

Ingress — це набір правил, які дозволяють вхідним зʼєднанням досягати точок доступу, визначених бекендом. Ingress можна налаштувати так, щоб надавати Service зовнішні адреси, балансувати трафік, закінчувати SSL, пропонувати віртуальний хостинг на основі імен тощо.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: Ingress

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-v1#IngressSpec" >}}">IngressSpec</a>)

  spec — це бажаний стан Ingress. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../service-resources/ingress-v1#IngressStatus" >}}">IngressStatus</a>)

  status — це поточний стан Ingress. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IngressSpec {#IngressSpec}

IngressSpec описує Ingress, який користувач хоче, щоб існував.

---

- **defaultBackend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>)

  defaultBackend — це бекенд, який повинен обробляти запити, що не відповідають жодному правилу. Якщо правила не вказані, необхідно вказати DefaultBackend. Якщо DefaultBackend не встановлено, обробка запитів, що не відповідають жодному з правил, буде відбуватись на розсуд контролера Ingress.

- **ingressClassName** (string)

  ingressClassName — це імʼя ресурсу IngressClass у кластері. Реалізації контролера Ingress використовують це поле для визначення, чи повинні вони обслуговувати цей ресурс Ingress, через транзитивний звʼязок (controller -> IngressClass -> Ingress resource). Хоча анотація `kubernetes.io/ingress.class` (проста константна назва) ніколи не була формально визначена, вона була широко підтримана контролерами Ingress для створення прямого звʼязку між контролером Ingress і ресурсами Ingress. Новостворені ресурси Ingress повинні надавати перевагу використанню цього поля. Однак, попри те, що анотація офіційно застаріла, з міркувань зворотної сумісності контролери Ingress все ще повинні враховувати цю анотацію, якщо вона присутня.

- **rules** ([]IngressRule)

  *Atomic: буде замінено під час злиття*

  rules — це список правил для хостів, що використовуються для налаштування Ingress. Якщо не вказано або жодне правило не має збігів, весь трафік надсилається на стандартний бекенд.

  <a name="IngressRule"></a>
  *IngressRule представляє правила, що зіставляють шляхи для зазначеного хосту з відповідними бекенд-сервісами. Вхідні запити спочатку оцінюються на відповідність хосту, а потім перенаправляються до бекенда, асоційованого з відповідним IngressRuleValue.*

  - **rules.host** (string)

    host — це повне доменне імʼя мережевого хосту, як визначено в RFC 3986. Зверніть увагу на такі відхилення від частини "host" в URI, як визначено в RFC 3986:

    1. IP-адреси не допускаються. Зараз IngressRuleValue може застосовуватися лише до IP-адреси в Spec батьківського Ingress.
    2. Двокрапка (:) як роздільник не використовується, оскільки порти не допускаються. Зараз порт Ingress неявно визначений як :80 для http і :443 для https.

    Обидва ці моменти можуть змінитися в майбутньому. Вхідні запити зіставляються з хостом перед IngressRuleValue. Якщо хост не вказано, Ingress маршрутизує весь трафік на основі зазначеного IngressRuleValue.

    host може бути "точним" (precise), доменним імʼям без завершальної крапки мережевого хосту (наприклад, "foo.bar.com"), або "wildcard" (маска), що є доменним імʼям з префіксом у вигляді одного символу маски (наприклад, "\*.foo.com"). Символ маски '\*' повинен зʼявлятися сам по собі як перша мітка DNS і відповідає лише одній мітці. Ви не можете мати мітку маски саму по собі (наприклад, Host == "\*"). Запити будуть зіставлятися з полем Host наступним чином:

    1. Якщо host є точним, запит відповідає цьому правилу, якщо заголовок http host дорівнює Host.
    2. Якщо host є маскою, то запит відповідає цьому правилу, якщо заголовок http host дорівнює суфіксу (видаляючи першу мітку) правила маски.

  - **rules.http** (HTTPIngressRuleValue)

    <a name="HTTPIngressRuleValue"></a>
    *HTTPIngressRuleValue — це список http-селекторів, що вказують на бекенди. У прикладі: http://\<host\>/\<path\>?\<searchpart\> -> backend, де частини url відповідають RFC 3986, цей ресурс буде використовуватися для зіставлення з усім після останнього '/' і перед першим '?' або '#'.*

    - **rules.http.paths** ([]HTTPIngressPath), обовʼязкове

      *Atomic: буде замінено під час злиття*

      paths — це набір шляхів, що зіставляють запити з бекендами.

      <a name="HTTPIngressPath"></a>
      *HTTPIngressPath асоціює шлях з бекендом. Вхідні URL-адреси, що відповідають шляху, перенаправляються до бекенду.*

      - **rules.http.paths.backend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>), обовʼязкове

        backend визначає повʼязану точку доступу сервісу, до якого буде перенаправлено трафік.

      - **rules.http.paths.pathType** (string), обовʼязкове

        pathType визначає інтерпретацію зіставлення шляху. PathType може мати одне з таких значень:

        - Exact: Точно відповідає URL-шляху.
        - Prefix: Збіг базується на префіксі шляху URL, розділеному символом '/'. Збіг перевіряється поелементно за елементами шляху. Елемент шляху — це список міток у шляху, розділених роздільником '/'. Запит вважається відповідністю для шляху p, якщо кожен елемент p є попереднім елементом відповідного елемента в кінцевому шляху запиту. Якщо це не так, то це не збіг (наприклад, /foo/bar має збіг з /foo/bar/baz, але не має з /foo/barbaz).
        - ImplementationSpecific: Інтерпретація зіставлення шляху визначається IngressClass. Реалізації можуть трактувати це як окремий PathType або так само як і типи шляхів Prefix або Exact.

        Реалізації повинні підтримувати всі типи шляхів.

        Можливі значення переліку (enum):
        - `"Exact"` відповідає URL-адресі точно і з урахуванням регістру.
        - `"ImplementationSpecific"` відповідність визначається IngressClass. Реалізації можуть трактувати це як окремий PathType або так само як і типи шляхів Prefix або Exact.
        - `"Prefix"` відповідає на основі префікса шляху URL, розділеного символом '/'. Відповідність є чутливою до регістру і виконується поелементно за елементами шляху. Елемент шляху відноситься до списку міток у шляху, розділених роздільником '/'. Запит є відповідністю для шляху p, якщо кожен p є попереднім елементом відповідного елемента в кінцевому шляху запиту. Зверніть увагу, що якщо останній елемент шляху є підрядком останнього елемента в запиті, це не є відповідністю (наприклад, /foo/bar відповідає /foo/bar/baz, але не відповідає /foo/barbaz). Якщо в Ingress spec існує кілька відповідних шляхів, пріоритет надається найдовшому відповідному шляху. Приклади: - /foo/bar не відповідає запитам до /foo/barbaz - /foo/bar відповідає запиту до /foo/bar і /foo/bar/baz - /foo і /foo/ обидва відповідають запитам до /foo і /foo/. Якщо обидва шляхи присутні в Ingress spec, найдовшому відповідному шляху (/foo/) надається пріоритет.

      - **rules.http.paths.path** (string)

        path зіставляється зі шляхом вхідного запиту. Зараз він може містити символи, не дозволені в традиційній частині "path" URL, як визначено в RFC 3986. Шляхи повинні починатися з '/' і повинні бути присутніми при використанні PathType зі значенням "Exact" або "Prefix".

- **tls** ([]IngressTLS)

  *Atomic: буде замінено під час злиття*

  tls представляє конфігурацію TLS. Зараз Ingress підтримує лише один TLS-порт, 443. Якщо декілька елементів цього списку вказують різні хости, вони будуть мультиплексовані на одному і тому ж порту відповідно до імені хосту, зазначеного через розширення SNI TLS, якщо контролер Ingress, що виконує Ingress, підтримує SNI.

  <a name="IngressTLS"></a>
  *IngressTLS описує транспортний рівень безпеки, повʼязаний з ingress.*

  - **tls.hosts** ([]string)

    *Atomic: буде замінено під час злиття*

    hosts — це список хостів, включених у сертифікат TLS. Значення в цьому списку повинні відповідати іменам, використаним у tlsSecret. Типово відповідає стандартним налаштуванням хосту для контролера балансування навантаження, що виконує цей Ingress, якщо залишено незазначеним.

  - **tls.secretName** (string)

    secretName — це імʼя Secret, який використовується для завершення TLS-трафіку на порту 443. Поле залишено необовʼязковим, щоб дозволити маршрутизацію TLS на основі лише імені хосту SNI. Якщо хост SNI у слухачі конфліктує з полем "Host" у заголовку, використаному IngressRule, хост SNI використовується для завершення, а значення поля "Host" використовується для маршрутизації.

## IngressBackend {#IngressBackend}

IngressBackend описує всі точки доступу для вказаного Service і порту.

---

- **resource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  resource — є ObjectRef на інший ресурс Kubernetes у просторі імен обʼєкта Ingress. Якщо вказано resource, не можна вказувати service.Name та service.Port. Це взаємозаперечне налаштування з "Service".

- **service** (IngressServiceBackend)

  service — посилається на Service як на бекенд. Це взаємозаперечне налаштування з "Resource".

  <a name="IngressServiceBackend"></a>
  *IngressServiceBackend посилається на Kubernetes Service як на Backend.*

  - **service.name** (string), обовʼязкове

    name — це посилання на сервіс. Сервіс повинен існувати в тому ж просторі імен, що й обʼєкт Ingress.

  - **service.port** (ServiceBackendPort)

    port вказаного сервіс. Для IngressServiceBackend потрібно вказати імʼя порту або номер порту.

    <a name="ServiceBackendPort"></a>
    *ServiceBackendPort — це порт сервісу, на який посилаються.*

    - **service.port.name** (string)

      name — це імʼя порту на сервісі. Це взаємозаперечне налаштування з "Number".

    - **service.port.number** (int32)

      number — це числовий номер порту (наприклад, 80) на сервісі. Це взаємозаперечне налаштування з "Name".

## IngressStatus {#IngressStatus}

IngressStatus описує поточний стан Ingress.

---

- **loadBalancer** (IngressLoadBalancerStatus)

  loadBalancer містить поточний статус балансувальника навантаження.

  <a name="IngressLoadBalancerStatus"></a>
  *IngressLoadBalancerStatus представляє статус балансувальника навантаження.*

  - **loadBalancer.ingress** ([]IngressLoadBalancerIngress)

    *Atomic: буде замінено під час злиття*

    ingress — це список точок входу для балансувальника навантаження.

    <a name="IngressLoadBalancerIngress"></a>
    *IngressLoadBalancerIngress представляє статус точки входу балансувальника навантаження.*

    - **loadBalancer.ingress.hostname** (string)

      hostname встановлюється для точок входу балансувальника навантаження, які базуються на DNS.

    - **loadBalancer.ingress.ip** (string)

      ip встановлюється для точок входу балансувальника навантаження, які базуються на IP.

    - **loadBalancer.ingress.ports** ([]IngressPortStatus)

      *Atomic: буде замінено під час злиття*

      ports надає інформацію про порти, які відкриті цим балансувальником навантаження.

      <a name="IngressPortStatus"></a>
      *IngressPortStatus представляє стан помилки порту сервісу.*

      - **loadBalancer.ingress.ports.port** (int32), обовʼязкове

        port — це номер порту точки входу.

      - **loadBalancer.ingress.ports.protocol** (string), обовʼязкове

        protocol — це протокол порту точки входу. Підтримувані значення: "TCP", "UDP", "SCTP".

        Можливі значення переліку (enum):
        - `"SCTP"` — SCTP протокол
        - `"TCP"` — TCP протокол
        - `"UDP"` — UDP протокол

      - **loadBalancer.ingress.ports.error** (string)

        error використовується для запису проблеми з портом сервісу. Формат помилки має відповідати наступним правилам:

        - вбудовані значення помилок повинні бути зазначені в цьому файлі та повинні використовувати CamelCase імена;
        - значення помилок, специфічні для хмарного провайдера, повинні мати імена, які відповідають формату foo.example.com/CamelCase.

## IngressList {#IngressList}

IngressList — це колекція Ingress.

---

- **items** ([]<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>), обовʼязкове

  items — це список Ingress.

- **apiVersion** (string)

  APIVersion визначає версійну схему цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхилити нерозпізнані значення. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, що представляє REST-ресурс, який представляє цей обʼєкт. Сервери можуть визначити це з точки доступу, до якої клієнт подає запити. Не можна оновлювати. У CamelCase. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

## Операції {#operations}

---

### `get` отримати вказаний Ingress {#get-read-the-specified-ingress}

#### HTTP запит {#http-request}

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

401: Unauthorized

### `get` отримати статус вказаного Ingress {#get-read-the-status-of-the-specified-ingress}

#### HTTP запит {#http-request-1}

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Ingress {#list-list-or-watch-objects-of-kind-ingress}

#### HTTP запит {#http-request-2}

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Ingress {#list-list-or-watch-objects-of-kind-ingress-1}

#### HTTP запит {#http-request-3}

GET /apis/networking.k8s.io/v1/ingresses

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: Unauthorized

### `create` створення Ingress {#create-create-an-ingress}

#### HTTP запит {#http-request-4}

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Ingress {#update-replace-the-specified-ingress}

#### HTTP запит {#http-request-5}

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Ingress {#update-replace-the-status-of-the-specified-ingress}

#### HTTP запит {#http-request-6}

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Ingress {#patch-partially-update-the-specified-ingress}

#### HTTP запит {#http-request-7}

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Ingress {#patch-partially-update-the-status-of-the-specified-ingress}

#### HTTP запит {#http-request-8}

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized

### `delete` видалення Ingress {#delete-delete-an-ingress}

#### HTTP запит {#http-request-9}

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязковий

  назва Ingress

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Ingress {#deletecollection-delete-collection-of-ingress}

#### HTTP запит {#http-request-10}

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, обовʼязковий

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
