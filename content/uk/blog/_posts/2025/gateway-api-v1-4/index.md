---
layout: blog
title: "Gateway API 1.4: Нові можливості"
date: 2025-11-06T09:00:00-08:00
slug: gateway-api-v1-4
author: >
    [Beka Modebadze](https://github.com/bexxmodd) (Google),
    [Gateway API Contributors](https://github.com/kubernetes-sigs/gateway-api/blob/v1.4.0/CHANGELOG/1.4-TEAM.md)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

![Gateway API logo](gateway-api-logo.svg)

Готові до революції у сфері мережевих технологій Kubernetes? Спільнота Kubernetes SIG Network представила загальнодоступну версію Gateway API (v1.4.0)! Випущена 6 жовтня 2025 року версія 1.4.0 зміцнює позиції сучасних, динамічних і розширюваних мережевих технологій у Kubernetes.

Gateway API v1.4.0 приносить три нові можливості до _Стандартного каналу_ (GA-версія Gateway API):

- **BackendTLSPolicy для TLS між шлюзами та бекендами**
- **`supportedFeatures` у статусі GatewayClass**
- **Іменовані правила для маршрутів**

та вводить три нові експериментальні можливості:

- **Ресурс Mesh для конфігурації сервісної мережі**
- **Default gateways** для спрощення конфігурації
- **Фільтр `externalAuth` для HTTPRoute**

## Перехід до Стандартного каналу {#gradualtions-to-standard-channel}

### Backend TLS policy {#backend-tls-policy}

Під проводом: [Candace Holman](https://github.com/candita), [Norwin Schnyder](https://github.com/snorwin), [Katarzyna Łach](https://github.com/kl52752)

GEP-1897: [BackendTLSPolicy](https://github.com/kubernetes-sigs/gateway-api/issues/1897).

[BackendTLSPolicy](https://gateway-api.sigs.k8s.io/api-types/backendtlspolicy) — це новий тип Gateway API для визначення конфігурації TLS зʼєднання між шлюзом і подами бекенду. До впровадження BackendTLSPolicy не існувало API-специфікації, яка б дозволяла шифрувати трафік на шляху від шлюзу до бекенду.

Конфігурація `BackendTLSPolicy` `validation` вимагає імені хоста. Цей `hostname` має два призначення. Він використовується як заголовок SNI під час підключення до бекенду, а для автентифікації сертифікат, представлений бекендом, повинен відповідати цьому імені хоста, *якщо* `subjectAltNames` не вказано явно.

Якщо `subjectAltNames` (SAN) вказано, `hostname` використовується тільки для SNI, а автентифікація виконується на основі SAN. Якщо в цьому випадку все одно потрібно виконати автентифікацію на основі значення імені хоста, його НЕОБХІДНО додати до списку `subjectAltNames`.

Конфігурація BackendTLSPolicy `validation` також вимагає або `caCertificateRefs`, або `wellKnownCACertificates`. `caCertificateRefs` посилається на один або декілька (до 8) пакунків сертифікатів TLS, закодованих у форматі PEM. Якщо немає конкретних сертифікатів для використання, то залежно від вашої реалізації ви можете використовувати `wellKnownCACertificates`, встановлений у значення "System", щоб повідомити шлюз про необхідність використання набору довірених сертифікатів CA, характерних для конкретної реалізації.

У цьому прикладі BackendTLSPolicy налаштований на використання сертифікатів, визначених у ConfigMap auth-cert, для підключення до зашифрованого TLS-зʼєднання, де поди, що підтримують сервіс автентифікації, повинні надавати дійсний сертифікат для `auth.example.com`.  Він використовує `subjectAltNames` з типом Hostname, але ви також можете використовувати тип URI.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: BackendTLSPolicy
metadata:
  name: tls-upstream-auth
spec:
  targetRefs:
  - kind: Service
    name: auth
    group: ""
    sectionName: "https"
  validation:
    caCertificateRefs:
    - group: "" # основна група API
      kind: ConfigMap
      name: auth-cert
    subjectAltNames:
    - type: "Hostname"
      hostname: "auth.example.com"
```

У цьому прикладі BackendTLSPolicy налаштований на використання системних сертифікатів для підключення до зашифрованого TLS бекенду, де Pods, що обслуговують Service dev, повинні надавати дійсний сертифікат для `dev.example.com`.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: BackendTLSPolicy
metadata:
  name: tls-upstream-dev
spec:
  targetRefs:
  - kind: Service
    name: dev
    group: ""
    sectionName: "btls"
  validation:
    wellKnownCACertificates: "System"
    hostname: dev.example.com
```

Більш детальну інформацію про конфігурацію TLS в Gateway API можна знайти в статті [Gateway API - TLS Configuration](https://gateway-api.sigs.k8s.io/guides/tls/).

### Status information about the features that an implementation supports {#status-information-about-the-features-that-an-implementation-supports}

Під проводом: [Lior Lieberman](https://github.com/liorlieberman), [Beka Modebadze](https://github.com/bexxmodd)

GEP-2162: [Supported features in GatewayClass Status](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-2162/index.md).

Статус GatewayClass має нове поле, `supportedFeatures`. Це доповнення дозволяє реалізаціям оголошувати набір функцій, які вони підтримують. Це дає користувачам і інструментам чітке уявлення про можливості даного GatewayClass.

Назва цієї функції для тестів на відповідність (та звітування про статус GatewayClass) — **SupportedFeatures**. Реалізації повинні заповнити поле `supportedFeatures` у `.status` GatewayClass **до** прийняття GatewayClass або в рамках тієї ж операції.

Ось приклад `supportedFeatures`, опублікованого в `.status` GatewayClass:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
...
status:
  conditions:
  - lastTransitionTime: "2022-11-16T10:33:06Z"
    message: Handled by Foo controller
    observedGeneration: 1
    reason: Accepted
    status: "True"
    type: Accepted
  supportedFeatures:
    - HTTPRoute
    - HTTPRouteHostRewrite
    - HTTPRoutePortRedirect
    - HTTPRouteQueryParamMatching
```

Перехід SupportedFeatures до Standard допоміг поліпшити процес тестування відповідності для Gateway API. Набір тестів на відповідність тепер автоматично виконуватиме тести на основі функцій, визначених у статусі GatewayClass. Це створює міцний, перевірюваний звʼязок між заявленими можливостями реалізації та результатами тестування, що полегшує для розробників виконання правильних тестів на відповідність, а для користувачів — довіру до звітів про відповідність.

Це означає, що коли поле SupportedFeatures заповнюється в статусі GatewayClass, не буде потреби в додаткових прапорцях тестів на відповідність, таких як `–suported-features`, або `–exempt`, або `–all-features`. Важливо зазначити, що функції Mesh є винятком із цього правила і можуть бути перевірені на відповідність за допомогою _Conformance Profiles_ або шляхом ручного введення будь-якої комбінації прапорців, повʼязаних з функціями, доки спеціальний ресурс не вийде з експериментального каналу.

### Іменовані правила для Routes {#named-rules-for-routes}

GEP-995: [Adding a new name field to all xRouteRule types (HTTPRouteRule, GRPCRouteRule, etc.)](https://gateway-api.sigs.k8s.io/geps/gep-995).

Під проводом: [Guilherme Cassolato](https://github.com/guicassolato)

Це вдосконалення дозволяє чітко ідентифікувати правила маршрутизації та посилатися на них у всій екосистемі Gateway API. Ось деякі з основних випадків використання:

- **Статус:** можливість посилатися на конкретні правила безпосередньо за назвою.
- **Спостережуваність:** спрощення ідентифікації окремих правил у журналах, трейсах та метриках.
- **Політики:** Дозволяє політикам ([GEP-713](https://gateway-api.sigs.k8s.io/geps/gep-773)) орієнтуватися на конкретні правила маршрутизації через поле `sectionName` у їх `targetRef[s]`.
- **Інструменти:** спрощення фільтрування та посилання на правила маршрутизації в таких інструментах, як `gwctl`, `kubectl`, а також в універсальних утилітах, таких як `jq` та `yq`.
- **Внутрішнє зіставлення конфігурацій:** спрощення генерації внутрішніх конфігурацій, які посилаються на правила маршрутизації за іменем у реалізаціях шлюзів і мереж.

Це відповідає добре відпрацьованій схемі, яка вже застосовується для прослуховувачів шлюзів, портів Service, Pods (і контейнерів) та багатьох інших ресурсів Kubernetes.

Хоча нове поле імені є **необовʼязковим** (тож наявні ресурси залишаються дійсними), його використання **наполегливо рекомендується**. Впровадження не повинні призначати стандартне значення, але можуть застосовувати обмеження, такі як незмінність.

Нарешті, майте на увазі, що [формат імені](https://gateway-api.sigs.k8s.io/geps/gep-995/? h=995#format) перевіряється, а інші поля (такі як [`sectionName`](https://gateway-api.sigs.k8s.io/reference/spec/?h=sectionname#sectionname)) можуть накладати додаткові непрямі обмеження.

## Зміни в експериментальному каналі {#experimental-channel-changes}

### Увімкнення зовнішньої автентифікації для HTTPRoute {#enabling-external-auth-for-httproute}

Надання Gateway API можливості забезпечувати автентифікацію, а можливо, і авторизацію на рівні Gateway або HTTPRoute є дуже запитуваною функцією протягом тривалого часу. (Див. [проблему GEP-1494](https://github.com/kubernetes-sigs/gateway-api/issues/1494) для отримання додаткової інформації.)

Цей реліз Gateway API додає експериментальний фільтр у HTTPRoute, який вказує реалізації Gateway API викликати зовнішній сервіс для автентифікації (а за бажанням, і авторизації) запитів.

Цей фільтр базується на [Envoy ext_authz API](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter#config-http-filters-ext-authz) і дозволяє спілкуватися зі службою Auth, яка використовує протокол gRPC або HTTP.

Обидва методи дозволяють налаштувати, які заголовки пересилати до служби Auth, причому протокол HTTP дозволяє передавати додаткову інформацію, таку як префікс шляху.

Приклад HTTP може виглядати так (зверніть увагу, що для цього прикладу потрібно встановити експериментальний канал та реалізацію, яка підтримує зовнішню автентифікацію, щоб насправді зрозуміти конфігурацію):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: require-auth
  namespace: default
spec:
  parentRefs:
    - name: your-gateway-here
  rules:
    - matches:
      - path:
          type: Prefix
          value: /admin
      filters:
        - type: ExternalAuth
          externalAuth:
            protocol: HTTP
            backendRef:
              name: auth-service
            http:
              # Ці заголовки завжди надсилаються для протоколу HTTP,
              # але включені сюди для наочності.
              allowedHeaders:
                - Host
                - Method
                - Path
                - Content-Length
                - Authorization
      backendRefs:
        - name: admin-backend
          port: 8080
```

Це дозволяє сервісу Auth на сервері використовувати надані заголовки для прийняття рішення про автентифікацію запиту.

Коли запит дозволено, зовнішня служба Auth відповість кодом HTTP 200 і, за бажанням, додатковими заголовками, які будуть включені в запит, що пересилається на сервер. Коли запит відхилено, служба Auth відповість кодом HTTP 403.

Оскільки заголовок Authorization використовується в багатьох методах автентифікації, цей метод можна використовувати для Basic, Oauth, JWT та інших поширених методів автентифікації та авторизації.

### Ресурси Mesh {#mesh-resource}

Під проводом: [Flynn](https://github.com/kflynn)

GEP-3949: [Mesh-wide configuration and supported features](https://github.com/kubernetes-sigs/gateway-api/issues/3949)

Gateway API v1.4.0 представляє новий експериментальний ресурс Mesh, який надає можливість налаштовувати параметри для всієї мережі та виявляти функції, що підтримуються певною реалізацією мережі. Цей ресурс аналогічний ресурсу Gateway і спочатку буде використовуватися переважно для тестування відповідності, а в майбутньому планується розширити його використання на шлюзи поза кластером.

Ресурс Mesh є кластерним і, як експериментальна функція, має назву `XMesh` і знаходиться в групі API `gateway.networking.x-k8s.io`. Ключовим полем є controllerName, яке визначає реалізацію mesh, відповідальну за ресурс. Строка `status` ресурсу вказує, чи прийняла його реалізація mesh, і перелічує функції, які підтримує mesh.

Однією з цілей цього GEP є уникнення ускладнення для користувачів впровадження mesh. Для спрощення впровадження очікується, що реалізації mesh створюватимуть стандартний ресурс Mesh під час запуску, якщо такий з відповідним `controllerName` ще не існує. Це усуває необхідність ручного створення ресурсу для початку використання mesh.

Новий тип XMesh API в групі API gateway.networking.x-k8s.io/v1alpha1 забезпечує центральний пункт для конфігурації mesh і виявлення функцій (джерело).

Мінімальний обʼєкт XMesh вказує `controllerName`:

```yaml
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XMesh
metadata:
  name: one-mesh-to-mesh-them-all
spec:
  controllerName: one-mesh.example.com/one-mesh
```

Реалізація mesh заповнює поле статусу, щоб підтвердити, що вона прийняла ресурс, і показує список підтримуваних функцій (джерело):

```yaml
status:
  conditions:
    - type: Accepted
      status: "True"
      reason: Accepted
  supportedFeatures:
    - name: MeshHTTPRoute
    - name: OffClusterGateway
```

### Впровадження стандартних Gateways {#introducing-default-gateways}

Під проводом: [Flynn](https://github.com/kflynn)

GEP-3793: [Allowing Gateways to program some routes by default](https://github.com/kubernetes-sigs/gateway-api/issues/3793).

Розробники застосунків часто зазначали, що необхідно явно вказувати батьківський шлюз для кожного маршруту північ-південь. Хоча така явність запобігає двозначності, вона створює додаткові труднощі, особливо для розробників, які просто хочуть відкрити свій застосунок для зовнішнього світу, не турбуючись про схему іменування базової інфраструктури. Щоб вирішити цю проблему, ми запровадили поняття **Default Gateways**.

#### Для розробників застосунків: просто «використовуйте стандартні налаштування» {#for-application-developers-just-use-the-default}

Як розробник застосунків, ви часто не переймаєтеся тим, через який саме шлюз проходить ваш трафік, вам просто потрібно, щоб він працював. Завдяки цьому вдосконаленню ви тепер можете створити маршрут і просто попросити його використовувати стандартний шлюз.

Для цього потрібно встановити нове поле `useDefaultGateways` у `spec` вашого маршруту.

Ось простий `HTTPRoute`, який використовує стандартний шлюз:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-route
spec:
  useDefaultGateways: All
  rules:
  - backendRefs:
    - name: my-service
      port: 80
```

Ось і все! Більше не потрібно шукати правильну назву шлюзу для вашого середовища. Ваш маршрут тепер є «стандартним маршрутом».

#### Для операторів кластерів: ви все ще контролюєте ситуацію {#for-cluster-operators-youre-still-in-control}

Ця функція не забирає контроль у операторів кластерів ("Chihiro"[^1]). Насправді, вони мають явний контроль над тим, які шлюзи можуть діяти як стандартні. Шлюз прийме ці _стандартні маршрути_ лише в тому випадку, якщо він налаштований на це.

[^1]: Чіхіро — японське імʼя, яке має кілька значень залежно від використовуваного кандзі, найчастіше перекладається як «тисяча питань» або «тисяча ліктів».

Ви також можете використовувати ValidatingAdmissionPolicy, щоб вимагати або навіть забороняти маршрутам покладатися на стандартний Gateway.

Як оператор кластера, ви можете призначити шлюз як стандартний, встановивши (нове) поле `.spec.defaultScope`:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-default-gateway
  namespace: default
spec:
  defaultScope: All
  # ... інша конфігурація шлюзу
```

Оператори можуть обрати не використовувати стандартні шлюзи або навіть використовувати декілька.

#### Як це працює та основні деталі {#how-it-works-and-key-details}

- Щоб підтримувати чистий, дружній до GitOps робочий процес, стандартний шлюз *не* змінює `spec.parentRefs` вашого маршруту. Натомість, звʼязок відображається у полі `status` маршруту. Ви завжди можете перевірити розділ `status.parents` вашого маршруту, щоб точно побачити, який шлюз або шлюзи його прийняли. Це зберігає ваш початковий намір і уникає конфліктів з інструментами CD.

- Дизайн явно підтримує наявність кількох шлюзів, призначених як стандартні в межах кластера. Коли це відбувається, стандартний маршрут буде привʼязаний до *всіх* з них. Це дозволяє операторам кластерів виконувати міграції без простоїв і тестування нових стандартних шлюзів.

- Ви можете створити один маршрут, який обробляє як північ-південь (трафік, що входить або виходить з кластера, через стандартний шлюз), так і схід-захід/mesh-трафік (трафік між сервісами в межах кластера), явно посилаючись на сервіс в `parentRefs`.

Стандартні шлюзи представляють собою значний крок вперед у спрощенні та інтуїтивності Gateway API для повсякденних випадків використання, поєднуючи гнучкість, необхідну операторам, і простоту, бажану розробниками.

### Налаштування перевірки сертифіката клієнта {#configuring-client-certificate-validation}

Під проводом: [Arko Dasgupta](https://github.com/arkodg), [Katarzyna Łach](https://github.com/kl52752)

GEP-91: [Address connection coalescing security issue](https://github.com/kubernetes-sigs/gateway-api/pull/3942)

Цей випуск містить оновлення для налаштування перевірки клієнтських сертифікатів, що усуває критичну вразливість безпеки, повʼязану з повторним використанням зʼєднання. Обʼєднання HTTP-зʼєднань — це оптимізація веб-продуктивності, яка дозволяє клієнту повторно використовувати наявне TLS-зʼєднання для запитів до різних доменів. Хоча це зменшує накладні витрати на встановлення нових зʼєднань, воно створює ризик для безпеки в контексті шлюзів API. Можливість повторного використання одного TLS-зʼєднання для декількох прослуховувачів вимагає впровадження спільної конфігурації клієнтських сертифікатів, щоб уникнути несанкціонованого доступу.

#### Чому mTLS на основі SNI не є рішенням {#why-sni-based-mtls-is-not-the-answer}

Можна було б подумати, що використання Server Name Indication (SNI) для розрізнення між прослуховувачами вирішить цю проблему. Однак TLS SNI не є надійним механізмом для забезпечення політик безпеки в сценарії обʼєднання зʼєднань. Клієнт може використовувати одне TLS-зʼєднання для кількох зʼєднань з партнерами, якщо вони всі покриті одним і тим же сертифікатом. Це означає, що клієнт може встановити зʼєднання, вказавши одну ідентичність партнера (використовуючи SNI), а потім повторно використовувати це зʼєднання для доступу до іншого віртуального хоста, який прослуховує на тій же IP-адресі та порту. Це повторне використання, яке контролюється евристикою з боку клієнта, може обійти політики взаємного TLS, які були специфічні для конфігурації другого прослуховувача.

Ось приклад, щоб допомогти пояснити це:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: wildcard-tls-gateway
spec:
  gatewayClassName: example
  listeners:
  - name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
    tls:
      certificateRefs:
      - group: "" # основна група API
        kind: Secret
        name: foo-example-com-cert  # SAN: foo.example.com
  - name: wildcard-https
    protocol: HTTPS
    port: 443
    hostname: "*.example.com"
    tls:
      certificateRefs:
      - group: "" # основна група API
        kind: Secret
        name: wildcard-example-com-cert # SAN: *.example.com
```

Я налаштував шлюз із двома прослуховувачами, обидва з яких мають імена хостів, що перетинаються. Моя мета полягає в тому, щоб прослуховувач `foo-http` був доступний тільки для клієнтів, які мають сертифікат `foo-example-com-cert`. На відміну від цього, прослуховувач `wildcard-https` повинен дозволяти доступ ширшій аудиторії, яка використовує будь-який сертифікат, дійсний для домену `*.example.com`.

Розглянемо сценарій, в якому клієнт спочатку підключається до `foo.example.com`. Сервер запитує і успішно перевіряє сертифікат `foo-example-com-cert`, встановлюючи зʼєднання. Згодом той самий клієнт бажає отримати доступ до інших сайтів у цьому домені, таких як `bar.example.com`, який обробляється слухачем `wildcard-https`. Завдяки повторному використанню зʼєднання клієнти можуть отримати доступ до бекендів `wildcard-https` без додаткового TLS-рукостискання на наявному зʼєднанні. Цей процес працює як очікується.

Однак критична вразливість безпеки виникає, коли порядок доступу змінюється на протилежний. Якщо клієнт спочатку підключається до `bar.example.com` і надає дійсний сертифікат `bar.example.com`, зʼєднання встановлюється успішно. Якщо потім цей клієнт намагається отримати доступ до `foo.example.com`, сертифікат клієнта наявного зʼєднання не буде повторно перевірено. Це дозволяє клієнту обійти конкретну вимогу щодо сертифіката для бекенду `foo`, що призводить до серйозного порушення безпеки.

#### Рішення: конфігурація TLS для кожного порту {#the-solution-per-port-tls-configuration}

Оновлений API шлюзу отримує поле `tls` у `.spec` шлюзу, яке дозволяє визначити конфігурацію перевірки сертифіката клієнта за замовчуванням для всіх прослуховувачів, а потім, якщо потрібно, переоприділити її для кожного порту. Це забезпечує гнучкий і потужний спосіб управління вашими політиками TLS.

Ось погляд на оновлені визначення API (показані як вихідний код Go):

```go
// GatewaySpec визначає бажаний стан Gateway.
type GatewaySpec struct {
    ...
    // GatewayTLSConfig визначає конфігурацію TLS для шлюзу.
    TLS *GatewayTLSConfig `json:"tls,omitempty"`
}

// GatewayTLSConfig визначає конфігурацію TLS для шлюзу.
type GatewayTLSConfig struct {
    // Default визначає стандартну конфігурацію перевірки сертифіката клієнта
    Default TLSConfig `json:"default"`

    // PerPort визначає конфігурацію TLS, призначену для кожного порту.
    PerPort []TLSPortConfig `json:"perPort,omitempty"`
}

// TLSPortConfig описує конфігурацію TLS для конкретного порту.
type TLSPortConfig struct {
    // Port вказує номер порту, до якого буде застосовано конфігурацію TLS.
    Port PortNumber `json:"port"`

    // TLS зберігає конфігурацію, яка буде застосована до всіх прослуховувачів, що обробляють
    // HTTPS-трафік і відповідають заданому порту.
    TLS TLSConfig `json:"tls"`
}
```

## Істотні зміни {#breaking-changes}

### Standard GRPCRoute - поле `.spec` обовʼязкове (технічний аспект) {#breaking-grpcroute}

Переведення GRPCRoute до статусу Standard вносить незначну, але технічно важливу зміну щодо наявності поля верхнього рівня `.spec`. В рамках досягнення статусу Standard, Gateway API посилив перевірку схеми OpenAPI в GRPCRoute CustomResourceDefinition (CRD), щоб чітко забезпечити необхідність поля spec для всіх ресурсів GRPCRoute. Ця зміна забезпечує більш суворе дотримання стандартів обʼєктів Kubernetes та підвищує стабільність і передбачуваність ресурсу. Хоча дуже малоймовірно, що користувачі намагалися визначити GRPCRoute без будь-яких специфікацій, будь-які наявні автоматизації або маніфести, які могли покладатися на вільну інтерпретацію, що дозволяла повну відсутність поля `spec`, тепер не пройдуть перевірку і **повинні** бути оновлені, щоб включити поле `.spec`, навіть якщо воно порожнє.

### Експериментальна підтримка CORS в HTTPRoute — кардинальна зміна для поля `allowCredentials` {#breaking-httproute}

В рамках підпроєкту Gateway API було внесено істотні зміни до експериментальної підтримки CORS в HTTPRoute, що стосуються поля `allowCredentials` в політиці CORS. Визначення цього поля було приведене у повну відповідність до специфікації CORS, яка вимагає, щоб відповідний заголовок `Access-Control-Allow-Credentials` мав булеве значення. Раніше реалізація могла бути надто дозвільною, потенційно приймаючи нестандартні або рядкові представлення, такі як `true`, через послаблення перевірки схеми. Користувачі, які налаштовували правила CORS, тепер повинні переглянути свої маніфести та переконатися, що значення `allowCredentials` суворо відповідає новій, більш обмежувальній схемі. Будь-які наявні визначення HTTPRoute, які не відповідають цій більш суворій перевірці, тепер будуть відхилені сервером API, що вимагатиме оновлення конфігурації для збереження функціональності.

## Поліпшення досвіду розробки та використання {#improving-the-development-and-usage-experience}

В рамках цього випуску ми вдосконалили деякі робочі процеси для розробників:

- Додано [Kube API Linter](https://github.com/kubernetes-sigs/kube-api-linter) до конвеєрів CI/CD, що зменшує навантаження на рецензентів API, а також зменшує кількість типових помилок.
- Покращено час виконання тестів CRD за допомогою [`envtest`](https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/envtest).

Крім того, в рамках зусиль, спрямованих на поліпшення досвіду використання Gateway API, було зроблено деякі кроки для усунення неоднозначностей та старих технічних боргів з нашого вебсайту з документацією:

- Тепер у довідці API чітко вказано, коли поле є `experimental`.
- Навігаційна панель GEP (GatewayAPI Enhancement Proposal) генерується автоматично, показуючи реальний стан вдосконалень.

## Спробуйте {#try-it-out}

На відміну від інших API Kubernetes, вам не потрібно оновлюватися до останньої версії Kubernetes, щоб отримати останню версію Gateway API. Якщо ви використовуєте Kubernetes 1.26 або новішу версію, ви зможете швидко розпочати роботу з цією версією Gateway API.

Щоб спробувати API, дотримуйтесь [Посібника для початківців](https://gateway-api.sigs.k8s.io/guides/).

На момент написання цієї статті сім реалізацій вже відповідають Gateway API v1.4.0. В алфавітному порядку:

- [Agent Gateway (with kgateway)](https://github.com/kgateway-dev/kgateway/releases/tag/v2.2.0-alpha.1)
- [Airlock Microgateway](https://github.com/airlock/microgateway/releases/tag/4.8.0-alpha1)
- [Envoy Gateway](https://github.com/envoyproxy/gateway/releases/tag/v1.6.0-rc.1)
- [GKE Gateway](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gateway-api)
- [Istio](https://github.com/istio/istio/releases/tag/1.28.0-rc.1)
- [kgateway](https://github.com/kgateway-dev/kgateway/releases/tag/v2.1.0)
- [Traefik Proxy](https://github.com/traefik/traefik/releases/tag/v3.6.0-rc1)

## Долучайтеся {#get-involved}

Цікавитесь, коли буде додано нову функцію? Є багато можливостей долучитися та допомогти визначити майбутнє API маршрутизації Kubernetes як для вхідного трафіку, так і для сервісної мережі.

- Ознайомтеся з [посібниками для користувачів](https://gateway-api.sigs.k8s.io/guides), щоб дізнатися, які випадки використання можна вирішити.
- Спробуйте один з [наявних контролерів Gateway](https://gateway-api.sigs.k8s.io/implementations/).
- Або [долучайтеся до нашої спільноти](https://gateway-api.sigs.k8s.io/contributing/) та допоможіть нам разом створити майбутнє Gateway API!

Учасники проекту хотіли б подякувати _усім_, хто долучився до Gateway API, чи то через коміти в репозиторії, обговорення, ідеї чи загальну підтримку. Ми ніколи не змогли б досягти такого прогресу без підтримки цієї відданої та активної спільноти.

## Схожі статті блогу Kubernetes {#related-kubernetes-blog-articles}

- [Gateway API v1.3.0: Advancements in Request Mirroring, CORS, Gateway Merging, and Retry Budgets](/blog/2025/06/02/gateway-api-v1-3/) (червень 2025)
- [Gateway API v1.2: WebSockets, Timeouts, Retries, and More](/blog/2024/11/21/gateway-api-v1-2/) (листопад 2024)
- [Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more](/blog/2024/05/09/gateway-api-v1-1/) (травень 2024)
- [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/) (листопад 2023)
- [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/) (жовтень 2023)
