---
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: Виявлення сервісів та балансування навантаження
  description: >
    Не потрібно змінювати свій застосунок, щоб використовувати незнайомий механізм виявлення сервісів. Kubernetes надає Podʼам власні IP-адреси та єдине DNS-імʼя для набору Podʼів, а також може балансувати навантаження між ними.
description: >-
  Відкрийте доступ до застосунку, що працює у вашому кластері, через єдину зовнішню точку доступу, навіть якщо робоче навантаження розподілене між кількома бекендами.
content_type: concept
weight: 10
---

<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="У Kubernetes Service — це" >}}

Ключова мета Services у Kubernetes полягає в тому, що вам не потрібно змінювати наявний застосунок, щоб використовувати незнайомий механізм виявлення сервісів. Ви можете запускати код у Podʼах, незалежно від того, чи розроблений він для світу cloud native, чи це старіший застосунок, який ви контейнеризували. Ви використовуєте Service, щоб зробити цей набір Podʼів доступним у мережі, щоб клієнти могли з ним взаємодіяти.

Якщо ви використовуєте {{< glossary_tooltip term_id="deployment" >}} для запуску застосунку, цей Deployment може динамічно створювати та знищувати Podʼи. У будь-який момент ви не знаєте, скільки з цих Podʼів працюють і є справними; ви навіть можете не знати, як називаються ці справні Podʼи. {{< glossary_tooltip term_id="pod" text="Podʼи" >}} Kubernetes створюються та знищуються відповідно до бажаного стану вашого кластера. Podʼи є ефемерними ресурсами (не варто очікувати, що окремий Pod буде надійним і довговічним).

Кожен Pod отримує власну IP-адресу (Kubernetes очікує, що це забезпечать мережеві втулки). Для певного Deployment у вашому кластері набір Podʼів, що працює в один момент часу, може відрізнятися від набору Podʼів, що виконує цей застосунок мить потому.

Це призводить до проблеми: якщо певний набір Podʼів (назвемо їх «бекендами») надає функціональність іншим Podʼам (назвемо їх «фронтендами») всередині вашого кластера, як фронтенди дізнаються та відстежують, до якої IP-адреси підключатися, щоб фронтенд міг використовувати бекенд-частину робочого навантаження?

Тут на допомогу приходять _Services_.

<!-- body -->

## Services у Kubernetes {#services-in-kubernetes}

API Service, що є частиною Kubernetes, — це абстракція, яка допомагає відкривати доступ до груп Podʼів через мережу. Кожен обʼєкт Service визначає логічний набір точок доступу (зазвичай ці точки доступу є Podʼами) разом із політикою того, як зробити ці Podʼи доступними.

Наприклад, розгляньмо stateless-бекенд для обробки зображень, який працює з 3 репліками. Ці репліки взаємозамінні: фронтендам не важливо, який бекенд вони використовують. Хоча конкретні Podʼи, що утворюють набір бекендів, можуть змінюватися, клієнтам-фронтендам не потрібно про це знати чи самостійно відстежувати набір бекендів.

Абстракція Service робить можливим таке відокремлення.

Канаркові розгортання є поширеним випадком використання Services. Щоб дізнатися, що це передбачає, скористайтеся навчальним матеріалом [Розгортання випуску за допомогою канаркового розгортання](/docs/tutorials/stateless-application/canary-deployment/).

Набір Podʼів, на які спрямований Service, зазвичай визначається {{< glossary_tooltip text="селектором" term_id="selector" >}}, який ви задаєте. Щоб дізнатися про інші способи визначення точок доступу Service, дивіться [Services _без_ селекторів](#services-without-selectors).

Якщо ваше робоче навантаження використовує HTTP, ви можете скористатися [Ingress](/docs/concepts/services-networking/ingress/), щоб контролювати, як вебтрафік досягає цього навантаження. Ingress не є типом Service, але він діє як точка входу до вашого кластера. Ingress дозволяє обʼєднати правила маршрутизації в одному ресурсі, щоб відкрити доступ до кількох компонентів вашого робочого навантаження, які працюють у кластері окремо, через одного слухача.

API [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) для Kubernetes надає додаткові можливості порівняно з Ingress і Service. Ви можете додати Gateway до свого кластера — це сімейство API розширення, реалізованих за допомогою {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}, — а потім використовувати їх для налаштування доступу до мережевих сервісів, що працюють у вашому кластері.

### Виявлення сервісів у стилі cloud native {#cloud-native-service-discovery}

Якщо ви можете використовувати API Kubernetes для виявлення сервісів у своєму застосунку, ви можете надсилати запити до {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}} щодо відповідних EndpointSlices. Kubernetes оновлює EndpointSlices для Service щоразу, коли змінюється набір Podʼів у цьому Service.

Для ненативних застосунків Kubernetes пропонує способи розмістити мережевий порт або балансувальник навантаження між вашим застосунком і бекенд-Podʼами.

У будь-якому разі ваше робоче навантаження може використовувати ці механізми [виявлення сервісів](#discovering-services), щоб знайти ціль, до якої воно хоче підʼєднатися.

## Визначення Service {#defining-a-service}

Service — це {{< glossary_tooltip text="обʼєкт" term_id="object" >}} (так само, як Pod чи ConfigMap). Ви можете створювати, переглядати або змінювати визначення Service за допомогою API Kubernetes. Зазвичай для цих викликів API ви використовуєте інструмент, такий як `kubectl`.

Наприклад, припустимо, що у вас є набір Podʼів, кожен з яких слухає TCP-порт 9376 і має мітку `app.kubernetes.io/name=MyApp`. Ви можете визначити Service, щоб опублікувати цього слухача TCP:

{{% code_sample file="service/simple-service.yaml" %}}

Застосування цього маніфесту створює новий Service з назвою "my-service" зі стандартним [типом Service](#publishing-services-service-types) ClusterIP. Service спрямовує трафік на TCP-порт 9376 будь-якого Podʼа з міткою `app.kubernetes.io/name: MyApp`.

Kubernetes призначає цьому Service IP-адресу (_кластерний IP_), яка використовується механізмом віртуальних IP-адрес. Докладніше про цей механізм читайте у [Віртуальні IP та проксі для Service](/docs/reference/networking/virtual-ips/).

Контролер цього Service постійно шукає Podʼи, що відповідають його селектору, а потім вносить необхідні оновлення до набору EndpointSlices цього Service.

Назва обʼєкта Service повинна бути дійсною [назвою мітки RFC 1123](/docs/concepts/overview/working-with-objects/names#rfc-1123-label-names).

{{< note >}}
Service може зіставляти _будь-який_ вхідний `port` із `targetPort`. Стандартно та для зручності `targetPort` має те саме значення, що й поле `port`.
{{< /note >}}

### Визначення портів {#field-spec-ports}

Визначення портів у Podʼах мають назви, і ви можете посилатися на ці назви в атрибуті `targetPort` Service. Наприклад, ми можемо привʼязати `targetPort` Service до порту Podʼа таким чином:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc

---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
```

Це працює, навіть якщо в Service є суміш Podʼів, що використовують одну налаштовану назву, а той самий мережевий протокол доступний на різних номерах портів. Це дає багато гнучкості для розгортання та розвитку ваших Services. Наприклад, ви можете змінити номери портів, які відкривають Podʼи, у наступній версії програмного забезпечення вашого бекенду, не порушуючи роботу клієнтів.

Стандартним протоколом для Services є [TCP](/docs/reference/networking/service-protocols/#protocol-tcp); ви також можете використовувати будь-який інший [підтримуваний протокол](/docs/reference/networking/service-protocols/).

Оскільки багатьом Services потрібно відкривати більше ніж один порт, Kubernetes підтримує [кілька визначень портів](#multi-port-services) для одного Service. Кожне визначення порту може мати той самий `protocol` або інший.

### Services без селекторів {#services-without-selectors}

Services найчастіше абстрагують доступ до Podʼів Kubernetes завдяки селектору, але коли вони використовуються з відповідним набором обʼєктів {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}} без селектора, Service може абстрагувати інші види бекендів, зокрема ті, що працюють поза кластером.

Наприклад:

* Ви хочете мати зовнішній кластер баз даних у промисловому середовищі, але в тестовому середовищі використовуєте власні бази даних.
* Ви хочете спрямувати свій Service на Service в іншому {{< glossary_tooltip text="просторі імен" term_id="namespace" >}} або в іншому кластері.
* Ви мігруєте робоче навантаження до Kubernetes. Під час оцінювання цього підходу ви запускаєте в Kubernetes лише частину своїх бекендів.

У будь-якому з цих сценаріїв ви можете визначити Service _без_ зазначення селектора для вибору Podʼів. Наприклад:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

Оскільки цей Service не має селектора, відповідні обʼєкти EndpointSlice не створюються автоматично. Ви можете зіставити Service з мережевою адресою та портом, де він працює, додавши обʼєкт EndpointSlice вручну. Наприклад:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # за домовленістю використовуйте назву Service
                     # як префікс для назви EndpointSlice
  labels:
    # Ви повинні встановити мітку "kubernetes.io/service-name".
    # Встановіть її значення відповідно до назви Service
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # має збігатися з назвою порту Service, визначеного вище
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### Власні EndpointSlices {#custom-endpointslices}

Коли ви створюєте обʼєкт [EndpointSlice](#endpointslices) для Service, ви можете використовувати будь-яку назву для EndpointSlice. Кожен EndpointSlice у просторі імен повинен мати унікальну назву. Ви повʼязуєте EndpointSlice із Service, встановлюючи на цьому EndpointSlice {{< glossary_tooltip text="мітку" term_id="label" >}} `kubernetes.io/service-name`.

{{< note >}}
IP-адреси точок доступу _не повинні бути_: loopback-адресами (127.0.0.0/8 для IPv4, ::1/128 для IPv6) або link-local-адресами (169.254.0.0/16 та 224.0.0.0/24 для IPv4, fe80::/64 для IPv6).

IP-адреси точок доступу не можуть бути кластерними IP-адресами інших Services Kubernetes, оскільки {{< glossary_tooltip term_id="kube-proxy" >}} не підтримує віртуальні IP-адреси як призначення.
{{< /note >}}

Для EndpointSlice, який ви створюєте самостійно або у власному коді, також слід вибрати значення для мітки [`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by). Якщо ви створюєте власний код контролера для керування EndpointSlices, розгляньте можливість використання значення на кшталт `"my-domain.example/name-of-controller"`. Якщо ви використовуєте сторонній інструмент, використовуйте назву інструмента в нижньому регістрі, замінивши пробіли та інші знаки пунктуації дефісами (`-`). Якщо люди безпосередньо використовують інструмент, такий як `kubectl`, для керування EndpointSlices, використовуйте назву, яка описує це ручне керування, наприклад, `"staff"` або `"cluster-admins"`. Уникайте використання зарезервованого значення `"controller"`, яке позначає EndpointSlices, керовані власною панеллю управління Kubernetes.

#### Доступ до Service без селектора {#service-no-selector-access}

Доступ до Service без селектора працює так само, як якби він мав селектор. У [прикладі](#services-without-selectors) Service без селектора трафік спрямовується до однієї з двох точок доступу, визначених у маніфесті EndpointSlice: TCP-зʼєднання до 10.1.2.3 або 10.4.5.6 на порт 9376.

{{< note >}}
API-сервер Kubernetes не дозволяє проксіювання до точок доступу, не повʼязаних із Podʼами. Дії на кшталт `kubectl port-forward service/<service-name> forwardedPort:servicePort`, де Service не має селектора, завершаться збоєм через це обмеження. Це запобігає використанню API-сервера Kubernetes як проксі до точок доступу, до яких викликач може не мати дозволу на доступ.
{{< /note >}}

Service `ExternalName` — це особливий випадок Service, який не має селекторів і натомість використовує DNS-імена. Докладнішу інформацію дивіться в розділі [ExternalName](#externalname).

### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) — це обʼєкти, які представляють підмножину (_зріз_) мережевих точок доступу, що стоять за Service.

Ваш кластер Kubernetes відстежує, скільки точок доступу представляє кожен EndpointSlice. Якщо для Service стільки точок доступу, що досягається поріг, Kubernetes додає ще один порожній EndpointSlice і зберігає там інформацію про нові точки доступу. Стандартно Kubernetes створює новий EndpointSlice, коли всі наявні EndpointSlices містять щонайменше 100 точок доступу. Kubernetes не створює новий EndpointSlice, доки не потрібно додати ще одну точку доступу.

Докладнішу інформацію про цей API дивіться в [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).

### Endpoints (застаріло) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

API EndpointSlice є розвитком старішого API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/). Застарілий API Endpoints має кілька проблем порівняно з EndpointSlice:

* Він не підтримує двостекові кластери.
* Він не містить інформації, потрібної для підтримки новіших можливостей, таких як [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution).
* Він обрізає список точок доступу, якщо той надто довгий, щоб уміститися в одному обʼєкті.

Через це рекомендується, щоб усі клієнти використовували API EndpointSlice, а не Endpoints.

#### Точки доступу понад місткість {#over-capacity-endpoints}

Kubernetes обмежує кількість точок доступу, які можуть уміститися в одному обʼєкті Endpoints. Коли в Service понад 1000 точок доступу, Kubernetes обрізає дані в обʼєкті Endpoints. Оскільки Service можна повʼязати з кількома EndpointSlices, обмеження в 1000 точок доступу стосується лише застарілого API Endpoints.

У цьому випадку Kubernetes вибирає не більше 1000 можливих точок доступу бекенда для збереження в обʼєкті Endpoints і встановлює на Endpoints {{< glossary_tooltip text="анотацію" term_id="annotation" >}} [`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity). Панель управління також вилучає цю анотацію, якщо кількість бекенд-Podʼів падає нижче 1000.

Трафік і далі надсилається на бекенди, але будь-який механізм балансування навантаження, який покладається на застарілий API Endpoints, надсилає трафік щонайбільше до 1000 доступних точок доступу.

Те саме обмеження API означає, що ви не можете вручну оновити Endpoints так, щоб він мав понад 1000 точок доступу.

### Протокол застосунку {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Поле `appProtocol` дає змогу вказати протокол застосунку для кожного порту Service. Воно використовується як підказка для реалізацій, щоб вони могли запропонувати розширену поведінку для протоколів, які розуміють. Значення цього поля дзеркально відтворюється у відповідних обʼєктах Endpoints та EndpointSlice.

Це поле відповідає стандартному синтаксису міток Kubernetes. Дійсні значення — одне з:

* [стандартні назви сервісів IANA](https://www.iana.org/assignments/service-names).

* Визначені реалізацією назви з префіксом, такі як `mycompany.com/my-custom-protocol`.

* Визначені Kubernetes назви з префіксом:

| Протокол | Опис        |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 без шифрування, як описано в [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) |
| `kubernetes.io/ws`  | WebSocket без шифрування, як описано в [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
| `kubernetes.io/wss` | WebSocket через TLS, як описано в [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |

### Services з кількома портами {#multi-port-services}

Для деяких Services вам потрібно відкрити більше одного порту. Kubernetes дозволяє налаштувати кілька визначень портів в обʼєкті Service. Під час використання кількох портів для Service ви повинні надати назви всім портам, щоб вони були однозначними. Наприклад:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
Як і {{< glossary_tooltip term_id="name" text="назви" >}} в Kubernetes загалом, назви портів мають містити лише буквено-цифрові символи в нижньому регістрі та `-`. Назви портів також мають починатися й закінчуватися буквено-цифровим символом.

Наприклад, назви `123-abc` та `web` є допустимими, а `123_abc` та `-web` — ні.
{{< /note >}}

## Тип Service {#publishing-services-service-types}

Для деяких частин вашого застосунку (наприклад, фронтендів) вам може знадобитися відкрити доступ до Service на зовнішній IP-адресі, яка доступна поза вашим кластером.

Типи Service у Kubernetes дозволяють вказати, який саме Service вам потрібен.

Доступні значення `type` та їхня поведінка:

[`ClusterIP`](#type-clusterip)
: Відкриває доступ до Service на внутрішній IP-адресі кластера. Вибір цього значення робить Service доступним лише зсередини кластера. Це стандартне значення, яке використовується, якщо ви явно не вказали `type` для Service. Ви можете відкрити доступ до Service із загальнодоступного інтернету за допомогою [Ingress](/docs/concepts/services-networking/ingress/) або [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Відкриває доступ до Service на IP-адресі кожного вузла на статичному порту (`NodePort`). Щоб зробити порт вузла доступним, Kubernetes налаштовує кластерну IP-адресу так само, як якби ви запросили Service з `type: ClusterIP`.

[`LoadBalancer`](#loadbalancer)
: Відкриває зовнішній доступ до Service за допомогою зовнішнього балансувальника навантаження. Kubernetes не надає компонент балансування навантаження безпосередньо; ви повинні надати його самі або інтегрувати свій кластер Kubernetes із хмарним провайдером.

[`ExternalName`](#externalname)
: Зіставляє Service із вмістом поля `externalName` (наприклад, з іменем хоста `api.foo.bar.example`). Це зіставлення налаштовує DNS-сервер вашого кластера на повернення запису `CNAME` із цим зовнішнім іменем хоста. Жодне проксіювання не налаштовується.

Поле `type` в API Service розроблено як вкладену функціональність: кожен рівень доповнює попередній. Однак із цього вкладеного дизайну є виняток. Ви можете визначити Service `LoadBalancer`, [вимкнувши виділення `NodePort` для балансувальника навантаження](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation).

### `type: ClusterIP` {#type-clusterip}

Цей стандартний тип Service призначає IP-адресу з пулу IP-адрес, який ваш кластер зарезервував для цієї мети.

Кілька інших типів Service базуються на типі `ClusterIP`.

Якщо ви визначаєте Service, у якому `.spec.clusterIP` має значення `"None"`, Kubernetes не призначає IP-адресу. Докладнішу інформацію дивіться в розділі [headless Services](#headless-services).

#### Вибір власної IP-адреси {#choosing-your-own-ip-address}

Ви можете вказати власну кластерну IP-адресу в запиті на створення `Service`. Для цього встановіть поле `.spec.clusterIP`. Наприклад, це корисно, якщо у вас уже є запис DNS, який ви хочете використовувати повторно, або застарілі системи, налаштовані на певну IP-адресу, які важко переналаштувати.

Вибрана вами IP-адреса має бути дійсною адресою IPv4 або IPv6 із діапазону CIDR `service-cluster-ip-range`, налаштованого для API-сервера. Якщо ви спробуєте створити Service з недійсним значенням `clusterIP`, API-сервер поверне код стану HTTP 422, щоб вказати на проблему.

Читайте [уникнення конфліктів](/docs/reference/networking/virtual-ips/#avoiding-collisions), щоб дізнатися, як Kubernetes допомагає зменшити ризик і наслідки спроб двох різних Services використовувати ту саму IP-адресу.

### `type: NodePort` {#type-nodeport}

Якщо ви встановлюєте поле `type` у `NodePort`, панель управління Kubernetes виділяє порт із діапазону, вказаного прапорцем `--service-node-port-range` (стандартно: 30000-32767). Кожен вузол проксіює цей порт (той самий номер порту на кожному вузлі) у ваш Service. Ваш Service повідомляє виділений порт у своєму полі `.spec.ports[*].nodePort`.

Використання NodePort дає вам свободу налаштувати власне рішення для балансування навантаження, конфігурувати середовища, які не повністю підтримуються Kubernetes, або навіть безпосередньо відкрити IP-адреси одного чи кількох вузлів.

Для Service з портом вузла Kubernetes додатково виділяє порт (TCP, UDP або SCTP відповідно до протоколу Service). Кожен вузол кластера налаштовується на прослуховування цього призначеного порту та пересилання трафіку до однієї з готових точок доступу, повʼязаних із цим Service. Ви зможете звернутися до Service `type: NodePort` ззовні кластера, підʼєднавшись до будь-якого вузла за відповідним протоколом (наприклад, TCP) та відповідним портом (призначеним цьому Service).

#### Вибір власного порту {#nodeport-custom-port}

Якщо вам потрібен певний номер порту, ви можете вказати значення в полі `nodePort`. Панель управління або виділить вам цей порт, або повідомить, що транзакція API не вдалася. Це означає, що вам потрібно самостійно подбати про можливі конфлікти портів. Ви також повинні використовувати дійсний номер порту, що входить до діапазону, налаштованого для використання NodePort.

Ось приклад маніфесту для Service з `type: NodePort`, який вказує значення NodePort (у цьому прикладі 30007):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # Стандартно та для зручності `targetPort` встановлено
      # у те саме значення, що й поле `port`.
      targetPort: 80
      # Необовʼязкове поле
      # Стандартно та для зручності панель управління Kubernetes
      # виділить порт із діапазону (стандартно: 30000-32767)
      nodePort: 30007
```

#### Резервування діапазонів NodePort для уникнення конфліктів {#avoid-nodeport-collisions}

Політика призначення портів Services NodePort застосовується як до автоматичного, так і до ручного призначення. Коли користувач хоче створити Service NodePort, який використовує певний порт, цей цільовий порт може конфліктувати з іншим, уже призначеним портом.

Щоб уникнути цієї проблеми, діапазон портів для Services NodePort поділено на дві смуги. Динамічне призначення портів стандартно використовує верхню смугу, а коли її вичерпано, може використовувати нижню. Користувачі можуть виділяти порти з нижньої смуги з меншим ризиком конфлікту портів.

Під час використання стандартного діапазону NodePort 30000-32767 смуги розподіляються так:

* Статична смуга: 30000-30085
* Динамічна смуга: 30086-32767

Докладніше про те, як обчислюються статична та динамічна смуги, читайте в статті [Уникнення конфліктів під час призначення портів Services NodePort](/blog/2023/05/11/nodeport-dynamic-and-static-allocation/).

#### Налаштування IP-адрес для Services `type: NodePort` {#service-nodeport-custom-listen-address}

Під час використання kube-proxy у [режимі `iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables) Services NodePort стандартно доступні на всіх IP-адресах вузла. Під час використання [режиму `nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables) вони стандартно доступні лише на основній IP-адресі вузла (або основних IP-адресах у разі подвійного стека).

Ви можете змінити набір IP-адрес вузла, на яких доступні Services NodePort, за допомогою прапорця kube-proxy `--nodeport-addresses` або еквівалентного поля `nodePortAddresses` у [файлі конфігурації kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/). Він приймає розділений комами список IP-блоків (наприклад, `10.0.0.0/8`, `192.0.2.0/25`) або одне чи кілька з таких ключових слів:

* `primary` — основна адреса IPv4 та/або IPv6 вузла згідно з обʼєктом Node. (Це стандартне значення для режиму `nftables`.)
* `localhost` — loopback-адреси вузла (`127.0.0.0/8`, `::1/128`).
* `all` — усі адреси. (Це стандартне значення для режимів `iptables` та `ipvs`.)

Наприклад, якщо ви запускаєте kube-proxy з прапорцем `--nodeport-addresses=192.168.0.0/24`, kube-proxy спробує знайти локальну IP-адресу в цій підмережі на кожному вузлі та обслуговуватиме Services NodePort лише через цю IP-адресу.

#### Services `type: NodePort` через localhost {#localhost-nodeports}

Механізми, які проксі сервісів використовують для реалізації Services NodePort, не завжди підтримують надання Services NodePort на localhost. Для kube-proxy:

* Під час використання режиму `iptables` зі значенням `--nodeport-addresses`, яке містить `127.0.0.1`, Services NodePort будуть доступні на `127.0.0.1`. Однак це вимагає ввімкнення sysctl ядра (`route_localnet`), який у деяких кластерах може мати небезпечні побічні ефекти. NodePort на localhost для IPTables можна вимкнути, передавши kube-proxy `--iptables-localhost-nodeports false` або встановивши для `--nodeport-addresses` діапазон, який не містить `127.0.0.1`.

* Під час використання режиму `ipvs` або режиму `iptables` в одностекових кластерах IPv6 Services NodePort недоступні на localhost.

{{< feature-state feature_gate_name="KubeProxyNFTablesLocalhostNodePorts" >}}

* Під час використання режиму `nftables` Services NodePort будуть доступні на localhost, коли ввімкнено функціональну можливість `KubeProxyNFTablesLocalhostNodePorts`, а `--nodeport-addresses` має значення, яке явно містить `localhost`. (Значення лише `all` _не_ ввімкне Services NodePort на localhost.) Це реалізовано перенаправленням зʼєднань NodePort на localhost через проксі в просторі користувача, тому це не так ефективно, як звичайне проксіювання сервісів.

Сторонні мережеві втулки, які мають власні реалізації проксі сервісів, можуть підтримувати NodePort на localhost, а можуть і не підтримувати; зверніться до документації цих втулків.

### `type: LoadBalancer` {#loadbalancer}

У хмарних провайдерів, які підтримують зовнішні балансувальники навантаження, встановлення поля `type` у `LoadBalancer` створює балансувальник навантаження для вашого Service. Фактичне створення балансувальника навантаження відбувається асинхронно, а інформація про створений балансувальник публікується в полі `.status.loadBalancer` Service. Наприклад:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

Трафік від зовнішнього балансувальника навантаження спрямовується на бекенд-Podʼи. Хмарний провайдер вирішує, як він балансується.

Щоб реалізувати Service з `type: LoadBalancer`, Kubernetes зазвичай починає зі змін, еквівалентних вашому запиту на Service з `type: NodePort`. Потім компонент cloud-controller-manager налаштовує зовнішній балансувальник навантаження на пересилання трафіку на цей призначений порт вузла.

Ви можете налаштувати Service із балансуванням навантаження так, щоб [не призначати](#load-balancer-nodeport-allocation) порт вузла, якщо реалізація хмарного провайдера це підтримує.

Деякі хмарні провайдери дозволяють вказати `loadBalancerIP`. У таких випадках балансувальник навантаження створюється із вказаною користувачем `loadBalancerIP`. Якщо поле `loadBalancerIP` не вказано, балансувальник навантаження налаштовується з ефемерною IP-адресою. Якщо ви вказали `loadBalancerIP`, але ваш хмарний провайдер не підтримує цю можливість, вказане вами поле `loadbalancerIP` ігнорується.

{{< note >}}
Поле `.spec.loadBalancerIP` для Service визнано застарілим у Kubernetes v1.24.

Це поле було недостатньо визначене, і його значення відрізняється в різних реалізаціях. Воно також не підтримує мережі з подвійним стеком. Це поле може бути вилучено в майбутній версії API.

Якщо ви інтегруєтеся з провайдером, який підтримує вказання IP-адрес балансувальника навантаження для Service через анотацію (специфічну для провайдера), вам слід перейти на цей спосіб.

Якщо ви пишете код для інтеграції балансувальника навантаження з Kubernetes, уникайте використання цього поля. Ви можете інтегруватися з [Gateway](https://gateway-api.sigs.k8s.io/) замість Service або визначити власні анотації (специфічні для провайдера) на Service, які задають еквівалентні дані.
{{< /note >}}

#### Вплив життєздатності вузла на трафік балансувальника навантаження {#node-liveness-impact-on-load-balancer-traffic}

Перевірки справності балансувальника навантаження є критично важливими для сучасних застосунків. Вони використовуються для визначення того, на який сервер (віртуальну машину або IP-адресу) балансувальник навантаження має спрямовувати трафік. API Kubernetes не визначають, як мають бути реалізовані перевірки справності для балансувальників навантаження, керованих Kubernetes; поведінку визначають хмарні провайдери (і ті, хто пише код інтеграції). Перевірки справності балансувальника навантаження широко використовуються для підтримки поля `externalTrafficPolicy` у Services.

#### Балансувальники навантаження зі змішаними типами протоколів {#load-balancers-with-mixed-protocol-types}

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

Стандартно для Services типу LoadBalancer, коли визначено більше одного порту, усі порти повинні мати той самий протокол, і цей протокол має підтримуватися хмарним провайдером.

Функціональна можливість `MixedProtocolLBService` (стандартно ввімкнена для kube-apiserver починаючи з v1.24) дозволяє використовувати різні протоколи для Services типу LoadBalancer, коли визначено більше одного порту.

{{< note >}}
Набір протоколів, які можна використовувати для Services із балансуванням навантаження, визначає ваш хмарний провайдер; він може накладати обмеження понад ті, що застосовує API Kubernetes.
{{< /note >}}

#### Вимкнення виділення NodePort для балансувальника навантаження {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

За бажанням ви можете вимкнути виділення портів вузла для Service з `type: LoadBalancer`, встановивши поле `spec.allocateLoadBalancerNodePorts` у `false`. Це слід використовувати лише для реалізацій балансувальників навантаження, які спрямовують трафік безпосередньо до Podʼів, а не через порти вузла. Стандартно `spec.allocateLoadBalancerNodePorts` має значення `true`, і Services типу LoadBalancer продовжуватимуть виділяти порти вузла. Якщо встановити `spec.allocateLoadBalancerNodePorts` у `false` для наявного Service з виділеними портами вузла, ці порти вузла **не** будуть звільнені автоматично. Щоб звільнити ці порти вузла, ви повинні явно вилучити запис `nodePorts` у кожному порту Service.

#### Вказання класу реалізації балансувальника навантаження {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Для Service із `type`, встановленим у `LoadBalancer`, поле `.spec.loadBalancerClass` дозволяє використовувати реалізацію балансувальника навантаження, відмінну від стандартної реалізації хмарного провайдера.

Стандартно `.spec.loadBalancerClass` не встановлено, і Service типу `LoadBalancer` використовує стандартну реалізацію балансувальника навантаження хмарного провайдера, якщо кластер налаштовано з хмарним провайдером за допомогою прапорця компонента `--cloud-provider`.

Якщо ви вказуєте `.spec.loadBalancerClass`, вважається, що за Services стежить реалізація балансувальника навантаження, яка відповідає вказаному класу. Будь-яка стандартна реалізація балансувальника навантаження (наприклад, та, яку надає хмарний провайдер) ігноруватиме Services, у яких встановлено це поле. `spec.loadBalancerClass` можна встановити лише для Service типу `LoadBalancer`. Після встановлення його не можна змінити. Значення `spec.loadBalancerClass` має бути ідентифікатором у стилі мітки з необовʼязковим префіксом, наприклад, "`internal-vip`" або "`example.com/internal-vip`". Назви без префікса зарезервовані для кінцевих користувачів.

#### Режим IP-адреси балансувальника навантаження {#load-balancer-ip-mode}

Для Service з `type: LoadBalancer` контролер може встановити `.status.loadBalancer.ingress.ipMode`. `.status.loadBalancer.ingress.ipMode` вказує, як поводиться IP-адреса балансувальника навантаження. Його можна вказати лише тоді, коли вказано також поле `.status.loadBalancer.ingress.ip`.

Є два можливі значення для `.status.loadBalancer.ingress.ipMode`: "VIP" та "Proxy". Стандартне значення — "VIP", що означає, що трафік доставляється на вузол із призначенням, встановленим на IP-адресу та порт балансувальника навантаження. Є два випадки, коли встановлюється значення "Proxy", залежно від того, як балансувальник навантаження хмарного провайдера доставляє трафік:

* Якщо трафік доставляється на вузол, а потім через DNAT до Podʼа, призначенням буде IP-адреса вузла та порт вузла;
* Якщо трафік доставляється безпосередньо до Podʼа, призначенням буде IP-адреса та порт Podʼа.

Реалізації Service можуть використовувати цю інформацію для коригування маршрутизації трафіку.

#### Внутрішній балансувальник навантаження {#internal-load-balancer}

У змішаному середовищі іноді необхідно маршрутизувати трафік від Services всередині того самого (віртуального) блоку мережевих адрес.

У середовищі DNS із розділеним горизонтом вам знадобляться два Services, щоб маршрутизувати і зовнішній, і внутрішній трафік до ваших точок доступу.

Щоб налаштувати внутрішній балансувальник навантаження, додайте до свого Service одну з наведених нижче анотацій залежно від хмарного провайдера, який ви використовуєте:

{{< tabs name="service_tabs" >}}
{{% tab name="Стандартно" %}}
Виберіть одну з вкладок.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```

{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

Services типу ExternalName зіставляють Service з DNS-іменем, а не зі звичайним селектором, таким як `my-service` або `cassandra`. Ви вказуєте такі Services за допомогою параметра `spec.externalName`.

Наприклад, це визначення Service зіставляє Service `my-service` у просторі імен `prod` з `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
Service з `type: ExternalName` приймає рядок з адресою IPv4, але трактує цей рядок як DNS-імʼя, що складається з цифр, а не як IP-адресу (однак інтернет не дозволяє таких імен у DNS). DNS-сервери не розвʼязують Services із зовнішніми іменами, схожими на адреси IPv4.

Якщо ви хочете зіставити Service безпосередньо з певною IP-адресою, розгляньте можливість використання [headless Services](#headless-services).
{{< /note >}}

Під час пошуку хоста `my-service.prod.svc.cluster.local` DNS Service кластера повертає запис `CNAME` зі значенням `my.database.example.com`. Доступ до `my-service` працює так само, як і для інших Services, але з важливою відмінністю: перенаправлення відбувається на рівні DNS, а не через проксіювання чи пересилання. Якщо пізніше ви вирішите перенести базу даних у кластер, ви зможете запустити її Podʼи, додати відповідні селектори чи точки доступу та змінити `type` цього Service.

{{< caution >}}
Під час використання ExternalName з деякими поширеними протоколами, зокрема HTTP та HTTPS, можуть виникати проблеми. Якщо ви використовуєте ExternalName, імʼя хоста, яке використовують клієнти всередині вашого кластера, відрізняється від імені, на яке посилається ExternalName.

Для протоколів, які використовують імена хостів, ця різниця може призвести до помилок або неочікуваних відповідей. HTTP-запити матимуть заголовок `Host:`, який вихідний сервер не розпізнає; сервери TLS не зможуть надати сертифікат, що відповідає імені хоста, до якого підʼєднався клієнт.
{{< /caution >}}

## Headless Services {#headless-services}

Іноді вам не потрібні балансування навантаження та одна IP-адреса Service. У цьому випадку ви можете створити так звані _headless Services_, явно вказавши `"None"` для кластерної IP-адреси (`.spec.clusterIP`).

Ви можете використовувати headless Service для взаємодії з іншими механізмами виявлення сервісів, не привʼязуючись до реалізації Kubernetes.

Для headless Services кластерна IP-адреса не виділяється, kube-proxy не обробляє ці Services, а платформа не виконує для них балансування навантаження чи проксіювання.

Headless Service дозволяє клієнту підʼєднуватися безпосередньо до будь-якого Podʼа, якому він віддає перевагу. Services, що є headless, не налаштовують маршрути та пересилання пакетів за допомогою [віртуальних IP-адрес і проксі](/docs/reference/networking/virtual-ips/); натомість headless Services повідомляють IP-адреси точок доступу окремих Podʼів через внутрішні записи DNS, які обслуговує [DNS-сервіс](/docs/concepts/services-networking/dns-pod-service/) кластера. Щоб визначити headless Service, ви створюєте Service із `.spec.type`, встановленим у ClusterIP (що також є стандартним значенням `type`), і додатково встановлюєте `.spec.clusterIP` у None.

Рядкове значення None є особливим випадком і не тотожне тому, що поле `.spec.clusterIP` не встановлено.

Те, як автоматично налаштовується DNS, залежить від того, чи визначено для Service селектори:

### З селекторами {#with-selectors}

Для headless Services, які визначають селектори, контролер точок доступу створює EndpointSlices в API Kubernetes і змінює конфігурацію DNS так, щоб повертати записи A або AAAA (адреси IPv4 або IPv6), які вказують безпосередньо на Podʼи, що стоять за Service.

### Без селекторів {#without-selectors}

Для headless Services, які не визначають селектори, панель управління не створює обʼєкти EndpointSlice. Однак система DNS шукає та налаштовує одне з такого:

* DNS-записи CNAME для Services з [`type: ExternalName`](#externalname).
* DNS-записи A / AAAA для всіх IP-адрес готових точок доступу Service, для всіх типів Service, крім `ExternalName`.
  * Для точок доступу IPv4 система DNS створює записи A.
  * Для точок доступу IPv6 система DNS створює записи AAAA.

Коли ви визначаєте headless Service без селектора, `port` має збігатися з `targetPort`.

## Виявлення сервісів {#discovering-services}

Для клієнтів, що працюють всередині вашого кластера, Kubernetes підтримує два основні способи виявлення Service: змінні середовища та DNS.

### Змінні середовища {#environment-variables}

Коли Pod запускається на вузлі, kubelet додає набір змінних середовища для кожного активного Service. Він додає змінні `{SVCNAME}_SERVICE_HOST` та `{SVCNAME}_SERVICE_PORT`, де назва Service записується у верхньому регістрі, а дефіси перетворюються на підкреслення.

Наприклад, Service `redis-primary`, який відкриває TCP-порт 6379 і якому виділено кластерну IP-адресу 10.0.0.11, створює такі змінні середовища:

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Коли у вас є Pod, якому потрібен доступ до Service, і ви використовуєте метод змінних середовища для публікації порту та кластерного IP для клієнтських Podʼів, ви повинні створити Service *до* появи клієнтських Podʼів. Інакше змінні середовища цих клієнтських Podʼів не будуть заповнені.

Якщо ви використовуєте лише DNS для виявлення кластерного IP для Service, вам не потрібно турбуватися про цю проблему порядку.
{{< /note >}}

Kubernetes також підтримує та надає змінні, сумісні з можливістю Docker Engine "_[legacy container links](https://docs.docker.com/network/links/)_". Ви можете переглянути [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72), щоб побачити, як це реалізовано в Kubernetes.

### DNS

Ви можете (і майже завжди повинні) налаштувати DNS-сервіс для свого кластера Kubernetes за допомогою [надбудови](/docs/concepts/cluster-administration/addons/).

DNS-сервер, обізнаний із кластером, такий як CoreDNS, стежить за появою нових Services в API Kubernetes і створює набір записів DNS для кожного з них. Якщо DNS увімкнено в усьому кластері, всі Podʼи повинні автоматично мати змогу розвʼязувати Services за їхніми DNS-іменами.

Наприклад, якщо у вас є Service з назвою `my-service` у просторі імен Kubernetes `my-ns`, панель управління та DNS Service разом створюють запис DNS для `my-service.my-ns`. Podʼи у просторі імен `my-ns` повинні мати змогу знайти цей Service, виконавши пошук за іменем `my-service` (`my-service.my-ns` також працюватиме).

Podʼи в інших просторах імен повинні вказувати імʼя як `my-service.my-ns`. Ці імена розвʼязуватимуться в кластерний IP, призначений для Service.

Kubernetes також підтримує записи DNS SRV (Service) для іменованих портів. Якщо Service `my-service.my-ns` має порт з назвою `http` із протоколом `TCP`, ви можете виконати запит DNS SRV для `_http._tcp.my-service.my-ns`, щоб дізнатися номер порту для `http`, а також IP-адресу.

DNS-сервер Kubernetes — єдиний спосіб доступу до Services `ExternalName`. Докладніше про розвʼязання `ExternalName` читайте в [DNS для Services та Podʼів](/docs/concepts/services-networking/dns-pod-service/).

<!-- Збережіть наявні гіперпосилання -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## Механізм віртуальних IP-адрес {#virtual-ip-addressing-mechanism}

Прочитайте [Віртуальні IP та проксі для Service](/docs/reference/networking/virtual-ips/), де пояснено механізм, який Kubernetes надає, щоб відкрити доступ до Service на віртуальній IP-адресі.

### Політики трафіку {#traffic-policies}

Ви можете встановити поля `.spec.internalTrafficPolicy` та `.spec.externalTrafficPolicy`, щоб контролювати, як Kubernetes маршрутизує трафік до справних («готових») бекендів.

Докладнішу інформацію дивіться в розділі [Політики трафіку](/docs/reference/networking/virtual-ips/#traffic-policies).

### Контроль розподілу трафіку {#traffic-distribution}

Поле `.spec.trafficDistribution` надає ще один спосіб впливати на маршрутизацію трафіку в межах Service Kubernetes. Якщо політики трафіку зосереджені на суворих семантичних гарантіях, то розподіл трафіку дозволяє виражати _уподобання_ (наприклад, маршрутизацію до топологічно ближчих точок доступу). Це може допомогти оптимізувати продуктивність, вартість або надійність. У Kubernetes {{< skew currentVersion >}} підтримуються такі значення:

`PreferSameZone`
: Вказує на перевагу маршрутизації трафіку до точок доступу, які перебувають у тій самій зоні, що й клієнт.

`PreferSameNode`
: Вказує на перевагу маршрутизації трафіку до точок доступу, які перебувають на тому самому вузлі, що й клієнт.

`PreferClose` (застаріло)
: Це старіший псевдонім для `PreferSameZone`, менш зрозумілий щодо семантики.

Якщо поле не встановлено, реалізація застосує свою стандартну стратегію маршрутизації.

Докладнішу інформацію дивіться в розділі [Розподіл трафіку](/docs/reference/networking/virtual-ips/#traffic-distribution).

### Збереження сесії {#session-stickiness}

Якщо ви хочете, щоб зʼєднання від певного клієнта щоразу передавалися до того самого Podʼа, ви можете налаштувати спорідненість сесії на основі IP-адреси клієнта. Докладніше читайте в розділі [спорідненість сесії](/docs/reference/networking/virtual-ips/#session-affinity).

## Зовнішні IP-адреси {#external-ips}

{{< feature-state for_k8s_version="v1.36" state="deprecated" >}}

Усі користувачі мають розпочати перехід від `externalIPs`. Натомість розгляньте можливість використання контролера зовнішнього балансувальника навантаження або реалізації Gateway API.

Якщо є зовнішні IP-адреси, які маршрутизуються до одного чи кількох вузлів кластера, до Services Kubernetes можна відкрити доступ на цих `externalIPs`. Коли мережевий трафік надходить до кластера із зовнішньою IP-адресою (як IP-адресою призначення) та портом, що відповідають цьому Service, правила й маршрути, налаштовані Kubernetes, забезпечують маршрутизацію трафіку до однієї з точок доступу цього Service.

Під час визначення Service ви можете вказати `externalIPs` для будь-якого [типу Service](#publishing-services-service-types). У наведеному нижче прикладі клієнти можуть отримати доступ до Service з назвою `"my-service"` через TCP за адресою `"198.51.100.32:80"` (обчисленою з `.spec.externalIPs[]` та `.spec.ports[].port`).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
Kubernetes не керує виділенням `externalIPs`; за це відповідає адміністратор кластера.
{{< /note >}}

## Обʼєкт API {#api-object}

Service — це ресурс верхнього рівня в REST API Kubernetes. Ви можете дізнатися більше про [обʼєкт API Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## {{% heading "whatsnext" %}} {#whats-next}

Дізнайтеся більше про Services і те, як вони вписуються в Kubernetes:

* Пройдіть навчальний матеріал [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).
* Прочитайте про [Ingress](/docs/concepts/services-networking/ingress/), який відкриває маршрути HTTP та HTTPS ззовні кластера до Services у вашому кластері.
* Прочитайте про [Gateway](/docs/concepts/services-networking/gateway/), розширення для Kubernetes, яке надає більше гнучкості, ніж Ingress.

Для ширшого контексту прочитайте таке:

* [Віртуальні IP та проксі для Service](/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* [Довідник API Service](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [Довідник API EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Довідник API Endpoints (застарілий)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
