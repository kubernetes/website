---
title: Автентифікація
content_type: concept
weight: 10
---

<!-- overview -->

Ця сторінка надає огляд автентифікації.

<!-- body -->

## Користувачі в Kubernetes {#users-in-kubernetes}

У всіх кластерах Kubernetes є дві категорії користувачів: службові облікові записи, які керуються Kubernetes, і звичайні користувачі.

Припускається, що незалежна від кластера служба керує звичайними користувачами наступними способами:

- адміністратор розповсюджує приватні ключі
- сховище користувачів, таке як Keystone або Google Accounts
- файл зі списком імен користувачів та паролів

У цьому відношенні _Kubernetes не має обʼєктів, які представляють звичайні облікові записи користувачів._ Звичайні користувачі не можуть бути додані до кластера через API виклик.

Хоча звичайного користувача не можна додати через API виклик, будь-який користувач, який предʼявляє дійсний сертифікат, підписаний центром сертифікації (CA) кластера, вважається автентифікованим. У цій конфігурації Kubernetes визначає імʼя користувача з поля загального імені (CN) у сертифікаті (наприклад, "/CN=bob"). Після цього підсистема контролю доступу на основі ролей (RBAC) визначає, чи авторизований користувач для виконання певної операції з ресурсом. Детальніше про це можна прочитати у темі про звичайних користувачів у [запиті сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user).

На відміну від цього, службові облікові записи є користувачами, якими керує Kubernetes API. Вони привʼязані до певних просторів імен і створюються автоматично API сервером або вручну через API виклики. Службові облікові записи привʼязані до набору облікових даних, збережених як `Secrets`, які монтуються в Podʼи, що дозволяє процесам всередині кластера взаємодіяти з Kubernetes API.

API запити привʼязані або до звичайного користувача, або до службово облікового запису, або обробляються як [анонімні запити](#anonymous-requests). Це означає, що кожен процес всередині або поза кластером, від користувача, який вводить `kubectl` на робочій станції, до `kubelets` на вузлах, до членів панелі управління, повинен автентифікуватися при виконанні запитів до API сервера, або бути обробленим як анонімний користувач.

## Стратегії автентифікації {#authentication-strategies}

Kubernetes використовує клієнтські сертифікати, токени на предʼявника (bearer tokens) або проксі для автентифікації (authenticating proxy) для автентифікації API запитів через втулки автентифікації. Під час виконання HTTP запитів до API сервера втулки намагаються асоціювати наступні атрибути із запитом:

- Імʼя користувача: рядок, який ідентифікує кінцевого користувача. Загальноприйняті значення можуть бути `kube-admin` або `jane@example.com`.
- UID: рядок, який ідентифікує кінцевого користувача та намагається бути більш стабільним і унікальним, ніж імʼя користувача.
- Групи: набір рядків, кожен з яких вказує на членство користувача в певній логічній групі користувачів. Загальноприйняті значення можуть бути `system:masters` або `devops-team`.
- Додаткові поля: елемент map рядків для отримання переліку рядків, що містить додаткову інформацію, яку авторизатори можуть вважати корисною.

Усі значення є непрозорими для системи автентифікації та мають значення лише при інтерпретації [авторизатором](/docs/reference/access-authn-authz/authorization/).

Ви можете одночасно ввімкнути кілька методів автентифікації. Зазвичай вам слід використовувати принаймні два методи:

- токени службових облікових записів
- принаймні один інший метод для автентифікації користувачів.

Коли увімкнено кілька модулів автентифікаторів, перший модуль, який успішно автентифікує запит, перериває подальшу оцінку. API сервер не гарантує порядок виконання автентифікаторів.

Група `system:authenticated` включена до списку груп для всіх автентифікованих користувачів.

Інтеграції з іншими протоколами автентифікації (LDAP, SAML, Kerberos, альтернативні схеми x509 тощо) можуть бути здійснені за допомогою [проксі автентифікації](#authenticating-proxy) або [вебхука автентифікації](#webhook-token-authentication).

### X509 клієнтські сертифікати {#x509-client-certificates}

Автентифікація за допомогою клієнтських сертифікатів увімкнена шляхом передачі опції `--client-ca-file=SOMEFILE` до API сервера. Вказаний файл повинен містити один або більше центрів сертифікації для використання у валідації клієнтських сертифікатів, представлених API серверу. Якщо представлено клієнтський сертифікат і він підтверджений, загальне імʼя субʼєкта використовується як імʼя користувача для запиту. Починаючи з Kubernetes 1.4, клієнтські сертифікати також можуть вказувати на членство користувача в групах, використовуючи поля організації сертифіката. Щоб включити кілька членств у групах для користувача, включіть кілька полів організації в сертифікат.

Наприклад, використовуючи командний рядок `openssl` для генерації запиту на підпис сертифіката:

```bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

Це створить CSR для імені користувача "jbeda", який належить до двох груп, "app1" і "app2".

Дивіться [Керування сертифікатами](/docs/tasks/administer-cluster/certificates/) для отримання інформації про те, як створити клієнтський сертифікат.

### Статичний файл токенів {#static-token-file}

API сервер читає токени на предʼявника (bearer tokens) з файлу при використанні опції `--token-auth-file=SOMEFILE` у командному рядку. Наразі токени діють безстроково, і список токенів не можна змінити без перезавантаження API сервера.

Файл токенів є csv-файлом з мінімум 3 стовпцями: токен, імʼя користувача, uid користувача, а також необовʼязкові імена груп.

{{< note >}}
Якщо у вас є більше однієї групи, стовпець має бути взятий у подвійні лапки, наприклад:

```conf
token,user,uid,"group1,group2,group3"
```

{{< /note >}}

#### Використання токена на предʼявника у запиті {#putting-a-bearer-token-in-a-request}

При використанні автентифікації за допомогою токенів з HTTP клієнта, API сервер очікує заголовок `Authorization` зі значенням `Bearer <token>`. Маркер має бути послідовністю символів, яку можна помістити в значення HTTP заголовка, використовуючи лише можливості кодування та цитування HTTP. Наприклад, якщо токен — `31ada4fd-adec-460c-809a-9e56ceb75269`, тоді він буде виглядати у заголовку HTTP, як показано нижче.

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

### Bootstrap токени {#bootstrap-tokens}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Для спрощення початкового налаштування нових кластерів, Kubernetes включає тип токена на предʼявника (bearer token), який керується динамічно, так званий _Bootstrap Token_. Ці токени зберігаються як Secrets у просторі імен `kube-system`, де ними можна динамічно керувати та створювати. Менеджер контролерів містить контролер TokenCleaner, який видаляє bootstrap токени в міру їх завершення.

Токени мають форму `[a-z0-9]{6}.[a-z0-9]{16}`. Перший компонент є ID токена, а другий компонент є Secret токена. Ви вказуєте токен у HTTP заголовку наступним чином:

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

Ви повинні увімкнути Bootstrap Token Authenticator з прапорцем `--enable-bootstrap-token-auth` на API сервері. Ви повинні увімкнути контролер TokenCleaner за допомогою прапорця `--controllers` у Controller Manager. Це робиться за допомогою чогось типу `--controllers=*,tokencleaner`. `kubeadm` зробить це за вас, якщо ви використовуєте його для початкового налаштування кластера.

Автентифікатор автентифікує як `system:bootstrap:<Token ID>`. Він включений у групу `system:bootstrappers`. Імена користувачів та групи навмисно обмежені, щоб перешкоджати користувачам використовувати ці токени після початкового налаштування. Імена користувачів та групи можна використовувати (і використовуються `kubeadm`) для створення відповідних політик авторизації для підтримки початкового налаштування кластера.

Детальнішу інформацію про автентифікатор Bootstrap Token та контролери, а також про керування цими токенами за допомогою `kubeadm`, дивіться у [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/).

### Токени службових облікових записів {#service-account-tokens}

Службовий обліковий запис є автоматично увімкненим автентифікатором, який використовує підписані токени на предʼявника (bearer tokens) для перевірки запитів. Втулок приймає два необовʼязкові прапорці:

- `--service-account-key-file` Файл, що містить PEM-кодовані x509 RSA або ECDSA приватні або публічні ключі, що використовуються для перевірки токенів службових облікових записів. Вказаний файл може містити кілька ключів, і прапорець може бути вказаний кілька разів з різними файлами. Якщо не вказано, використовується --tls-private-key-file.
- `--service-account-lookup` Якщо увімкнено, токени, які видаляються з API, будуть відкликані.

Службові облікові записи зазвичай створюються автоматично API сервером та асоціюються з Podʼами, які працюють у кластері через `ServiceAccount` [Контролер допуску](/docs/reference/access-authn-authz/admission-controllers/). Токени на предʼявника (bearer tokens) монтуються в Podʼи у відомих місцях, що дозволяє процесам всередині кластера взаємодіяти з API сервером. Облікові записи можуть бути явно асоційовані з Podʼами, використовуючи поле `serviceAccountName` у `PodSpec`.

{{< note >}}
`serviceAccountName` зазвичай опускається, оскільки це робиться автоматично.
{{< /note >}}

```yaml
apiVersion: apps/v1 # ця apiVersion актуальна станом з Kubernetes 1.9
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```

Токени на предʼявника службових облікових записів (bearer tokens) є цілком дійсними для використання за межами кластера і можуть бути використані для створення ідентичностей для тривалих завдань, які бажають взаємодіяти з API Kubernetes. Щоб вручну створити службовий обліковий запис, використовуйте команду `kubectl create serviceaccount (NAME)`. Це створює службовий обліковий запис у поточному просторі імен.

```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount/jenkins created
```

Створіть асоційований токен:

```bash
kubectl create token jenkins
```

```none
eyJhbGciOiJSUzI1NiIsImtp...
```

Створений токен є підписаним JSON Web Token (JWT).

Підписаний JWT може бути використаний як токен на предʼявника (bearer token) для автентифікації як вказаний службовий обліковий запис. Дивіться [вище](#putting-a-bearer-token-in-a-request) для інформації про те, як токен включається у запит. Зазвичай ці токени монтуються в Podʼи для доступу до API сервера всередині кластера, але можуть бути використані й ззовні кластера.

Службові облікові записи автентифікуються з імʼям користувача `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`, і належать групам `system:serviceaccounts` та `system:serviceaccounts:(NAMESPACE)`.

{{< warning >}}
Оскільки токени службових облікових записів також можуть зберігатися в обʼєктах Secret API, будь-який користувач з правами на запис до Secrets може запитати токен, і будь-який користувач з правами на читання до тих Secrets може автентифікуватися як службовий обліковий запис. Будьте обережні при наданні дозволів на службові облікові записи та можливості читання або запису для Secrets.
{{< /warning >}}

### Токени OpenID Connect {#openid-connect-tokens}

[OpenID Connect](https://openid.net/connect/) — це варіант OAuth2, підтримуваний деякими провайдерами OAuth2, зокрема Microsoft Entra ID, Salesforce та Google. Головне розширення протоколу OAuth2 полягає в додатковому полі, яке повертається разом із токеном доступу, називається [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken). Цей токен є JSON Web Token (JWT) з добре відомими полями, такими як електронна пошта користувача, підписаними сервером.

Для ідентифікації користувача автентифікатор використовує `id_token` (а не `access_token`) з [відповіді токена](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse) OAuth2 як токен носія. Дивіться [вище](#putting-a-bearer-token-in-a-request) для того, як токен включається у запит.

{{< mermaid >}}
sequenceDiagram
    participant user as Користувач
    participant idp as Провайдер ідентичності
    participant kube as kubectl
    participant api as Сервер API

    user ->> idp: 1. Вхід до Провайдера ідентичності
    activate idp
    idp -->> user: 2. Надання access_token,<br>id_token та refresh_token
    deactivate idp
    activate user
    user ->> kube: 3. Виклик kubectl<br>з --token, що є id_token<br>АБО додавання токенів до .kube/config
    deactivate user
    activate kube
    kube ->> api: 4. Authorization: Bearer...
    deactivate kube
    activate api
    api ->> api: 5. Чи є підпис JWT дійсним?
    api ->> api: 6. Чи не минув термін дії JWT? (iat+exp)
    api ->> api: 7. Чи авторизований користувач?
    api -->> kube: 8. Авторизовано: Виконання<br>дії та повернення результату
    deactivate api
    activate kube
    kube --x user: 9. Повернення результату
    deactivate kube
{{< /mermaid >}}

1. Увійдіть до свого провайдера ідентичності.
2. Ваш провайдер ідентичності надасть вам `access_token`, `id_token` та `refresh_token`.
3. Використовуючи `kubectl`, використовуйте свій `id_token` із прапорцем `--token` або додайте його безпосередньо до вашого `kubeconfig`.
4. `kubectl` надсилає ваш `id_token` у заголовку Authorization до сервера API.
5. Сервер API перевіряє, чи є підпис JWT дійсним.
6. Перевіряє, чи не минув термін дії `id_token`.

   Виконує перевірку вимог та/або користувача, якщо з `AuthenticationConfiguration` налаштовані вирази CEL.

7. Переконується, що користувач авторизований.
8. Після авторизації сервер API повертає відповідь `kubectl`.
9. `kubectl` надає зворотній звʼязок користувачу.

Оскільки всі дані, необхідні для верифікації вашої особи, містяться в `id_token`, Kubernetes не потрібно "дзвонити додому" до провайдера ідентичності. У моделі, де кожен запит є stateless, це забезпечує дуже масштабоване рішення для автентифікації. Це має кілька викликів:

1. Kubernetes не має "вебінтерфейсу" для ініціювання процесу автентифікації. Немає оглядача або інтерфейсу для збору облікових даних, тому вам потрібно спочатку автентифікуватися у свого провайдера ідентичності.
2. `id_token` не можна відкликати, він схожий на сертифікат, тому він повинен бути короткостроковим (лише кілька хвилин), що може бути дуже незручним, оскільки потрібно отримувати новий токен кожні кілька хвилин.
3. Для автентифікації в панелі управління Kubernetes, ви повинні використовувати команду `kubectl proxy` або зворотний проксі, який вставляє `id_token`.

#### Налаштування сервера API {#configuring-the-api-server}

##### Використання прапорців {#using-flags}

Щоб увімкнути втулок, налаштуйте наступні прапорці на сервері API:

| Параметр | Опис | Приклад | Обовʼязковий |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL провайдера, який дозволяє серверу API знаходити публічні ключі підпису. Приймаються лише URL-адреси, що використовують схему `https://`. Це зазвичай URL виявлення провайдера, змінений на порожній шлях | Якщо URL виявлення OIDC провайдера `https://accounts.provider.example/.well-known/openid-configuration`, значення повинно бути `https://accounts.provider.example` | Так |
| `--oidc-client-id` | Ідентифікатор клієнта, для якого мають бути видані всі токени. | kubernetes | Так |
| `--oidc-username-claim` | JWT вимога для використання як імені користувача. Стандартно `sub`, яке очікується що має бути унікальним ідентифікатором кінцевого користувача. Адміністратори можуть вибрати інші вимоги, такі як `email` або `name`, залежно від свого провайдера. Однак, вимоги, відмінні від `email`, будуть мати префікс URL провайдера, щоб уникнути зіткнень назв з іншими втулками. | sub | Ні |
| `--oidc-username-prefix` | Префікс, доданий до вимог імені користувача, щоб уникнути зіткнень з наявними іменами (наприклад, користувачами `system:`). Наприклад, значення `oidc:` створить імена користувачів, такі як `oidc:jane.doe`. Якщо цей прапорець не вказано, і значення `--oidc-username-claim` відрізняється від `email`, стандартний префікс `( Issuer URL )#`, де `( Issuer URL )` — це значення `--oidc-issuer-url`. Значення `-` можна використовувати для відключення всіх префіксів. | `oidc:` | Ні |
| `--oidc-groups-claim` | JWT вимога для використання як групи користувача. Якщо вимога присутня, вона повинна бути масивом рядків. | groups | Ні |
| `--oidc-groups-prefix` | Префікс, доданий до вимог груп, щоб уникнути зіткнень з наявними назвами (наприклад, групами `system:`). Наприклад, значення `oidc:` створить назви груп, такі як `oidc:engineering` та `oidc:infra`. | `oidc:` | Ні |
| `--oidc-required-claim` | Пара ключ=значення, яка описує обовʼязкову вимогу в ID Token. Якщо встановлено, вимога перевіряється на наявність в ID Token з відповідним значенням. Повторіть цей прапорець, щоб вказати кілька вимог. | `claim=value` | Ні |
| `--oidc-ca-file` | Шлях до сертифіката для ЦС, який підписав вебсертифікат вашого провайдера ідентичності. Стандартно використовується кореневий ЦС хосту. | `/etc/kubernetes/ssl/kc-ca.pem` | Ні |
| `--oidc-signing-algs` | Прийняті алгоритми підпису. Стандартно "RS256". | `RS512` | Ні |

##### Налаштування автентифікації з файлу {#using-authentication-configuration}

{{< feature-state feature_gate_name="StructuredAuthenticationConfiguration" >}}

JWT Автентифікатор є автентифікатором для автентифікації користувачів Kubernetes за допомогою токенів, що відповідають стандарту JWT. Автентифікатор спробує розібрати необроблений ID токен, перевірити, чи він підписаний налаштованим видавцем. Публічний ключ для перевірки підпису перевіряється на публічній точці доступу видавця за допомогою OIDC discovery.

Мінімальний допустимий JWT повинен містити наступні твердження:

```json
{
  "iss": "https://example.com",   // має збігатися з issuer.url
  "aud": ["my-app"],              // принаймні один з елементів в issuer.audiences повинен збігатися з твердженням "aud" в наданих JWT.
  "exp": 1234567890,              // закінчення терміну дії токена у вигляді часу Unix (кількість секунд, що минули з 1 січня 1970 року UTC)
  "<username-claim>": "user"      // це твердження для імені користувача, налаштоване в claimMappings.username.claim або claimMappings.username.expression
}
```

Підхід з використанням конфігураційного файлу дозволяє налаштовувати декілька JWT автентифікаторів, кожен з унікальними `issuer.url` та `issuer.discoveryURL`. Конфігураційний файл навіть дозволяє використовувати [CEL](/docs/reference/using-api/cel/) вирази для зіставлення тверджень на атрибути користувача, а також для перевірки тверджень та інформації про користувача. API сервер також автоматично перезавантажує автентифікатори при зміні конфігураційного файлу. Ви можете використовувати метрику `apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds` для моніторингу часу останнього перезавантаження конфігурації сервером API.

Необхідно вказати шлях до конфігураційного файлу автентифікації за допомогою прапорця `--authentication-config` на сервері API. Якщо ви хочете використовувати командні прапорці замість конфігураційного файлу, вони продовжать працювати як раніше. Щоб отримати нові можливості, такі як налаштування декількох автентифікаторів, встановлення декількох аудиторій для одного видавця, перейдіть на використання конфігураційного файлу.

Для Kubernetes версії v{{< skew currentVersion >}}, формат файлу структурованої конфігурації автентифікації є на рівні бета-версії, і механізм використання цієї конфігурації також є на рівні бета-версії. За умови, що ви не вимкнули спеціально [функційну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `StructuredAuthenticationConfiguration` для вашого кластера, ви можете увімкнути структуровану автентифікацію, вказавши аргумент командного рядка `--authentication-config` для kube-apiserver. Приклад файлу конфігурації структурованої автентифікації наведено нижче.

{{< note >}}
Якщо ви вкажете `--authentication-config` разом з будь-якими аргументами командного рядка `--oidc-*`, це є некоректною конфігурацією. У цій ситуації сервер API повідомить про помилку й одразу завершить роботу. Якщо ви хочете перейти на використання структурованої конфігурації автентифікації, вам потрібно видалити аргументи командного рядка `--oidc-*` і використовувати конфігураційний файл замість них.
{{< /note >}}

```yaml
---
#
# УВАГА: це приклад конфігурації.
#        Не використовуйте це для вашого кластера!
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# список автентифікаторів для автентифікації користувачів Kubernetes за допомогою токенів, що відповідають стандарту JWT.
# максимальна кількість дозволених автентифікаторів – 64.
jwt:
- issuer:
    # URL має бути унікальним для всіх автентифікаторів.
    # URL не повинен конфліктувати з видавцем, налаштованим у --service-account-issuer.
    url: https://example.com # Те ж саме, що і --oidc-issuer-url.
    # discoveryURL, якщо вказано, замінює URL, що використовується для отримання інформації про виявлення,
    # замість використання "{url}/.well-known/openid-configuration".
    # Точно вказане значення використовується, тому "/.well-known/openid-configuration"
    # має бути включено у discoveryURL, якщо це потрібно.
    #
    # Поле "issuer" у отриманій інформації про виявлення має збігатися з полем "issuer.url"
    # в AuthenticationConfiguration і буде використовуватися для перевірки твердження "iss" у наданих JWT.
    # Це для сценаріїв, коли точки доступу well-known та jwks розміщені в іншому
    # місці, ніж видавець (наприклад, локально в кластері).
    # discoveryURL має відрізнятися від URL, якщо вказано, і має бути унікальним для всіх автентифікаторів.
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM-кодовані сертифікати CA, які використовуються для перевірки підключення при отриманні
    # інформації про виявлення. Якщо не вказано, буде використовуватися системний перевіряючий.
    # Те саме значення, що і вміст файлу, на який посилається прапорець --oidc-ca-file.
    certificateAuthority: <PEM-кодовані сертифікати CA>
    # audiences – це набір прийнятних аудиторій, для яких повинен бути виданий JWT.
    # Принаймні один з елементів повинен збігатися з твердженням "aud" у наданих JWT.
    audiences:
    - my-app # Те ж саме, що і --oidc-client-id.
    - my-other-app
    # це повинно бути встановлено на "MatchAny", коли вказано кілька аудиторій.
    audienceMatchPolicy: MatchAny
  # правила, що застосовуються для перевірки тверджень токена для автентифікації користувачів.
  claimValidationRules:
    # Те ж саме, що і --oidc-required-claim key=value.
  - claim: hd
    requiredValue: example.com
    # Замість claim та requiredValue, ви можете використовувати expression для перевірки твердження.
    # expression – це вираз CEL, який оцінюється до булевого значення.
    # всі вирази повинні бути true для успішної перевірки.
  - expression: 'claims.hd == "example.com"'
    # Повідомлення налаштовує повідомлення про помилку, яке відображається в логах сервера API, коли перевірка не вдається.
    message: твердження hd повинно бути встановлено у example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: загальний час життя токена не повинен перевищувати 24 години
  claimMappings:
    # username представляє опцію для атрибута імені користувача.
    # Це єдиний обовʼязковий атрибут.
    username:
      # Те ж саме, що і --oidc-username-claim. Взаємовиключно з username.expression.
      claim: "sub"
      # Те ж саме, що і --oidc-username-prefix. Взаємовиключно з username.expression.
      # якщо username.claim встановлено, username.prefix обовʼязково має бути встановлено.
      # Встановіть значення "" явно, якщо префікс не потрібен.
      prefix: ""
      # Взаємовиключно з username.claim і username.prefix.
      # expression – це вираз CEL, який оцінюється як рядок.
      #
      # 1.  Якщо у виразі username.expression використовується 'claims.email', то 'claims.email_verified' має бути використано у
      # username.expression або extra[*].valueExpression або claimValidationRules[*].expression.
      # Приклад виразу правила валідації заявки, який автоматично збігається з валідацією
      # застосовується, коли username.claim має значення 'email' - 'claims.?email_verified.orValue(true)'.
      # 2.  Якщо імʼя користувача, що оцінюється на основі виразу username.expression, є порожнім рядком, запит на автентифікацію
      # запит не буде виконано.
      expression: 'claims.username + ":external-user"'
    # groups представляє опцію для атрибута групи.
    groups:
      # Те ж саме, що і --oidc-groups-claim. Взаємовиключно з groups.expression.
      claim: "sub"
      # Те ж саме, що і --oidc-groups-prefix. Взаємовиключно з groups.expression.
      # якщо groups.claim встановлено, groups.prefix обовʼязково має бути встановлено.
      # Встановіть значення "" явно, якщо префікс не потрібен.
      prefix: ""
      # Взаємовиключно з groups.claim і groups.prefix.
      # expression – це вираз CEL, який оцінюється як рядок або список рядків.
      expression: 'claims.roles.split(",")'
    # uid представляє опцію для атрибута унікального ідентифікатора.
    uid:
      # Взаємовиключно з uid.expression.
      claim: "sub"
      # Взаємовиключно з uid.claim.
      # expression – це вираз CEL, який оцінюється як рядок.
      expression: 'claims.uid'
    # екстра атрибути для додавання до обʼєктв UserInfo. Ключі мають бути у вигляді шляху з префіксом домену та бути унікальними.
    extra:
    - key: "example.com/tenant"
      # valueExpression – це вираз CEL, який оцінюється як рядок або список рядків.
      valueExpression: 'claims.tenant'
    # правила валідації, що застосовуються до фінального обʼєкта користувача.
    userValidationRules:
      #  expression – це вираз CEL, який оцінюється до булевого значення.
      # всі вирази повинні бути true для успішної перевірки.
    - expression: "!user.username.startsWith('system:')"
      # message налаштовує повідомлення про помилку, яке відображається в логах сервера API, коли перевірка не вдається.
      message: 'неможна використовувате це імʼя користувача, зарезервовано префіксом system:'
    - expression: "user.groups.all(group, !group.startsWith('system:'))"
      message: 'неможна використовувате цю назву групи, зарезервовано префіксом system:'
```

- Вираз правил валідації твердження (claim)

  `jwt.claimValidationRules[i].expression` представляє вираз, який буде оцінений CEL. Вирази CEL мають доступ до вмісту корисного навантаження токена, організованого у змінну CEL `claims`.
  `claims` - це карта імен тверджень (як рядків) до значень тверджень (будь-якого типу).

- Вираз правила валідації користувача

  `jwt.userValidationRules[i].expression` представляє вираз, який буде оцінений CEL. Вирази CEL мають доступ до вмісту `userInfo`, організованого у змінну CEL `user`. Зверніться до [UserInfo](/docs/reference/generated/kubernetes-api/{{< param "version" >}}//#userinfo-v1-authentication-k8s-io) API документації для отримання схеми `user`.

- Вираз зіставлення твердження

  `jwt.claimMappings.username.expression`, `jwt.claimMappings.groups.expression`, `jwt.claimMappings.uid.expression` `jwt.claimMappings.extra[i].valueExpression` представляє вираз, який буде оцінений CEL. Вирази CEL мають доступ до вмісту корисного навантаження токена, організованого у змінну CEL `claims`. `claims` — зіствлення імен тверджень (як рядків) до значень тверджень (будь-якого типу).

  Щоб дізнатися більше, дивіться [Документацію по CEL](/docs/reference/using-api/cel/).

  Ось приклади `AuthenticationConfiguration` з різними корисними навантаженнями токена.

  {{< tabs name="example_configuration" >}}
  {{% tab name="Валідний токен token" %}}

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1beta1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      # key - рядок, який буде використано як додатковий атрибут key.
      # key має бути шляхом з префіксом домену (наприклад, example.org/foo). Всі символи перед першим "/" повинні бути дійсними
      # субдомену, як визначено в RFC 1123. Всі символи після першого "/" повинні
      # бути дійсними символами HTTP-шляху, як визначено в RFC 3986.
      # k8s.io, kubernetes.io та їх субдомени зарезервовані для використання в Kubernetes і не можуть бути використані.
      # ключ має бути рядковим та унікальним для всіх додаткових атрибутів.
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # вибарз буде оцінений як true, тоож валідація пройде успішно.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  де корисне навантаження токена:

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  Токен із зазначеною вище `AuthenticationConfiguration` створить наступний об’єкт `UserInfo` і успішно автентифікує користувача.

  ```json
  {
      "username": "foo:external-user",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a"
      }
  }
  ```

  {{% /tab %}}
  {{% tab name="Твердження не проходить перевірку" %}}

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1beta1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"' # маркер нижче не має цього твердження, тому перевірка не вдасться.
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # tвибарз буде оцінений як true, тоож валідація пройде успішно.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  де корисне навантаження токена:

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  Токен із зазначеною вище `AuthenticationConfiguration` не зможе автентифікуватись, оскільки твердження `hd` не має значення `example.com`. Сервер API поверне помилку `401 Unauthorized`.
  {{% /tab %}}
  {{% tab name="Користувач не проходить перевірку" %}}

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1beta1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"'
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: '"system:" + claims.username' # це призведе до додавання префіксу "system:" до імені користувача і не пройде перевірку.
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # імʼя користувача буде system:foo, а вираз матиме значення false, тому перевірка не вдасться.
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJoZCI6ImV4YW1wbGUuY29tIiwiaWF0IjoxNzAxMTEzMTAxLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwianRpIjoiYjViMDY1MjM3MmNkMjBlMzQ1YjZmZGZmY2RjMjE4MWY0YWZkNmYyNTlhYWI0YjdlMzU4ODEyMzdkMjkyMjBiYyIsIm5iZiI6MTcwMTExMzEwMSwicm9sZXMiOiJ1c2VyLGFkbWluIiwic3ViIjoiYXV0aCIsInRlbmFudCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0YSIsInVzZXJuYW1lIjoiZm9vIn0.FgPJBYLobo9jnbHreooBlvpgEcSPWnKfX6dc0IvdlRB-F0dCcgy91oCJeK_aBk-8zH5AKUXoFTlInfLCkPivMOJqMECA1YTrMUwt_IVqwb116AqihfByUYIIqzMjvUbthtbpIeHQm2fF0HbrUqa_Q0uaYwgy8mD807h7sBcUMjNd215ff_nFIHss-9zegH8GI1d9fiBf-g6zjkR1j987EP748khpQh9IxPjMJbSgG_uH5x80YFuqgEWwq-aYJPQxXX6FatP96a2EAn7wfPpGlPRt0HcBOvq5pCnudgCgfVgiOJiLr_7robQu4T1bis0W75VPEvwWtgFcLnvcQx0JWg
  ```

  де корисне навантаження токена:

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "hd": "example.com",
      "iat": 1701113101,
      "iss": "https://example.com",
      "jti": "b5b0652372cd20e345b6fdffcdc2181f4afd6f259aab4b7e35881237d29220bc",
      "nbf": 1701113101,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  Токен із наведеною вище `AuthenticationConfiguration` створить такий обʼєкт `UserInfo`:

  ```json
  {
      "username": "system:foo",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a"
      }
  }
  ```

  який не пройде перевірку користувача, оскільки ім’я користувача починається з `system:`. Сервер API поверне помилку `401 Unauthorized`.
  {{% /tab %}}
  {{< /tabs >}}

###### Обмеження {#limitations}

1. Розподілені твердження не працюють через вирази [CEL](/docs/reference/using-api/cel/).
2. Конфігурація селектора вихідного трафіку не підтримується для викликів до `issuer.url` та `issuer.discoveryURL`.

Kubernetes не надає провайдера ідентифікації OpenID Connect. Ви можете використовувати наявного публічного провайдера ідентифікації OpenID Connect (наприклад, Google або [інші](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)). Або ж ви можете запустити власного провайдера ідентифікації, такого як [dex](https://dexidp.io/),
[Keycloak](https://github.com/keycloak/keycloak), CloudFoundry [UAA](https://github.com/cloudfoundry/uaa), або Tremolo Security's [OpenUnison](https://openunison.github.io/).

Для того, щоб провайдер ідентифікації працював з Kubernetes, він повинен:

1. Підтримувати [OpenID Connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)

   Публічний ключ для перевірки підпису отримується з публічної точки доступу видавця за допомогою OIDC discovery. Якщо ви використовуєте файл конфігурації автентифікації, провайдер ідентифікації не обовʼязково має публічно відкривати точку доступу discovery. Ви можете розмістити точку доступу discovery в іншому місці, ніж видавець (наприклад, локально в кластері) і вказати `issuer.discoveryURL` у файлі конфігурації.

1. Працювати через TLS з не застарілими шифрами
1. Мати сертифікат, підписаний ЦС (навіть якщо ЦС не комерційний або самопідписаний)

Примітка щодо вимоги №3 вище, що потреби в сертифікаті, підписаного ЦС. Якщо ви розгортаєте власного провайдера ідентифікації (на відміну від одного з хмарних провайдерів, таких як Google або Microsoft), ви ПОВИІННІ мати сертифікат вебсервера провайдера ідентифікації, підписаний сертифікатом з прапорцем `CA`, встановленим на `TRUE`, навіть якщо він самопідписаний. Це повʼязано з тим, що реалізація клієнта TLS в GoLang дуже сувора до стандартів перевірки сертифікатів. Якщо у вас немає під рукою ЦС, ви можете використовувати [скрипт gencert](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh) від команди Dex для створення простого ЦС і пари підписаного сертифіката та ключа. Або ви можете використовувати [цей подібний скрипт](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh), який генерує сертифікати SHA256 з довшим терміном дії та більшим розміром ключа.

Інструкції з налаштування для конкретних систем:

- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)

#### Використання kubectl {#using-kubectl}

##### Варіант 1 — Автентифікатор OIDC {#option-1-oidc-authenticator}

Перший варіант — використання автентифікатора kubectl `oidc`, який встановлює `id_token` як токен на предʼявника для всіх запитів і оновлює токен після закінчення його терміну дії. Після того, як ви увійшли до свого провайдера, використовуйте kubectl, щоб додати ваші `id_token`, `refresh_token`, `client_id` та `client_secret` для налаштування втулка.

Провайдери, які не повертають `id_token` як частину відповіді на оновлення токена, не підтримуються цим втулком і повинні використовувати "Варіант 2" нижче.

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token )
```

Як приклад, запустіть наведену нижче команду після автентифікації у постачальника ідентифікаційної інформації:

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

Що створить наведену нижче конфігурацію:

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```

Після закінчення терміну дії вашого `id_token` `kubectl` спробує оновити ваш `id_token` за допомогою ваших `refresh_token` і `client_secret`, зберігаючи нові значення для `refresh_token` і `id_token` у вашому `.kube/config`.

##### Варіант 2 — Використання опції `--token` {#option-2-using-the-token-option}

Команда `kubectl` дозволяє передати токен за допомогою параметра `--token`. Скопіюйте та вставте `id_token` у цей параметр:

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```

### Автентифікація за допомогою вебхука {#webhook-token-authentication}

Автентифікація за допомогою вебхука — це механізм перевірки маркерів носіїв.

- `--authentication-token-webhook-config-file` — файл конфігурації, який описує, як отримати доступ до віддаленого сервісу вебхука.
- `--authentication-token-webhook-cache-ttl` — як довго кешувати рішення щодо автентифікації. Стандартно дві хвилини.
- `--authentication-token-webhook-version` визначає, чи використовувати `authentication.k8s.io/v1beta1` або `authentication.k8s.io/v1`
  обʼєкти `TokenReview` для надсилання/отримання інформації від вебхука. Стандартно `v1beta1`.

Файл конфігурації використовує формат файлу [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).  У файлі `clusters` посилається на віддалений сервіс, а
`users` посилається на вебхук API-сервера. Приклад:

```yaml
# Версія API Kubernetes
apiVersion: v1
# Тип обʼєкта API
kind: Config
# clusters посилається на віддалений сервіс.
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # ЦС для перевірки віддаленого сервісу.
      server: https://authn.example.com/authenticate # URL віддаленого сервісу для запиту. 'https' рекомендовано для промислового застосування.

# users посилається на конфігурацію вебхука API-сервера.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # сертифікат для використання втулком вебхука
      client-key: /path/to/key.pem          # ключ, що відповідає сертифікату

# файли kubeconfig потребують контексту. Надати один для API-сервера.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```

Коли клієнт намагається автентифікуватись на API-сервері за допомогою токена на предʼявника, як розглядалось [вище](#putting-a-bearer-token-in-a-request), вебхук автентифікації надсилає POST-запит з JSON-серіалізованим обʼєктом `TokenReview`, що містить токен для віддаленого сервісу.

Зверніть увагу, що обʼєкти API вебхука підпадають під ті ж [правила сумісності версій](/docs/concepts/overview/kubernetes-api/), що й інші обʼєкти API Kubernetes. Виконавці повинні перевірити поле `apiVersion` запиту, щоб забезпечити правильну десеріалізацію, і **повинні** відповідати обʼєктом `TokenReview` тієї ж версії, що й запит.

{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
API-сервер Kubernetes типово надсилає запити `authentication.k8s.io/v1beta1` для зворотної сумісності. Щоб отримувати запити `authentication.k8s.io/v1`, API-сервер повинен бути запущений з параметром `--authentication-token-webhook-version=v1`.
{{< /note >}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
    # Непрозорий токен на прежʼявника носія, надісланий на API-сервер
    "token": "014fbff9a07c...",

    # Необовʼязковий список ідентифікаторів аудиторії для сервера, якому був представлений токен.
    # Автентифікатори токенів, що враховують аудиторію (наприклад, OIDC автентифікатори токенів)
    # повинні перевірити, що токен був призначений для принаймні однієї з аудиторій у цьому списку,
    # і повернути перетин цього списку та дійсних аудиторій для токена в статусі відповіді.
    # Це гарантує, що токен дійсний для автентифікації на сервері, якому він був представлений.
    # Якщо аудиторії не надані, токен повинен бути перевірений для автентифікації на API-сервері Kubernetes.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```

{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # Непрозорий токен на предʼявника, надісланий на API-сервер
    "token": "014fbff9a07c...",

    # Необовʼязковий список ідентифікаторів аудиторії для сервера, якому був представлений токен.
    # Автентифікатори токенів, що враховують аудиторію (наприклад, OIDC автентифікатори токенів)
    # повинні перевірити, що токен був призначений для принаймні однієї з аудиторій у цьому списку,
    # і повернути перетин цього списку та дійсних аудиторій для токена в статусі відповіді.
    # Це гарантує, що токен дійсний для автентифікації на сервері, якому він був представлений.
    # Якщо аудиторії не надані, токен повинен бути перевірений для автентифікації на API-сервері Kubernetes.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Віддалений сервіс повинен заповнити поле `status` запиту, щоб вказати на успішність входу. Поле `spec` тіла відповіді ігнорується та може бути опущене. Віддалений сервіс повинен повернути відповідь, використовуючи ту ж версію API `TokenReview`, яку він отримав. Успішна перевірка маркера носія буде виглядати так:

{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Обовʼязково
      "username": "janedoe@example.com",
      # Необовʼязково
      "uid": "42",
      # Необовʼязкові членства у групах
      "groups": ["developers", "qa"],
      # Необовʼязкова додаткова інформація, надана автентифікатором.
      # Це не повинно містити конфіденційних даних, оскільки це може бути записано в логах
      # або обʼєктах API та доступно для вебхуків допуску.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Необовʼязковий список, який можуть повернути автентифікатори токенів, що враховують аудиторію,
    # містить аудиторії зі списку `spec.audiences`, для яких токен був дійсним.
    # Якщо це опущено, токен вважається дійсним для автентифікації на API-сервері Kubernetes.
    "audiences": ["https://myserver.example.com"]
  }
}
```

{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Обовʼязково
      "username": "janedoe@example.com",
      # Необовʼязково
      "uid": "42",
      # Необовʼязкові членства у групах
      "groups": ["developers", "qa"],
      # Необовʼязкова додаткова інформація, надана автентифікатором.
      # Це не повинно містити конфіденційних даних, оскільки це може бути записано в логах
      # або обʼєктах API та доступно для вебхуків допуску.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Необовʼязковий список, який можуть повернути автентифікатори токенів, що враховують аудиторію,
    # містить аудиторії зі списку `spec.audiences`, для яких токен був дійсним.
    # Якщо це опущено, токен вважається дійсним для автентифікації на API-сервері Kubernetes.
    "audiences": ["https://myserver.example.com"]
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Невдала спроба запиту виглядатиме так:

{{< tabs name="TokenReview_response_error" >}}
{{% tab name="authentication.k8s.io/v1" %}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Необовʼязково включати деталі, чому автентифікація не вдалася.
    # Якщо помилка не вказана, API поверне загальне повідомлення Unauthorized.
    # Поле error ігнорується, коли authenticated=true.
    "error": "Credentials are expired"
  }
}
```

{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Необовʼязково включати деталі, чому автентифікація не вдалася.
    # Якщо помилка не вказана, API поверне загальне повідомлення Unauthorized.
    # Поле error ігнорується, коли authenticated=true.
    "error": "Credentials are expired"
  }
}
```

{{% /tab %}}
{{< /tabs >}}

### Проксі автентифікації {#authenticating-proxy}

API-сервер може бути налаштований для ідентифікації користувачів на основі значень заголовків запиту, таких як `X-Remote-User`. Цей механізм призначений для використання в комбінації з проксі-сервером автентифікації, який встановлює значення заголовка запиту.

- `--requestheader-username-headers` Обовʼязково, нечутливий до регістру. Імена заголовків для перевірки, у порядку, для ідентифікації користувача. Перший заголовок, який містить значення, використовується як імʼя користувача.
- `--requestheader-group-headers` Версія 1.6+. Необовʼязково, нечутливий до регістру. Пропонується використовувати "X-Remote-Group". Імена заголовків для перевірки, у порядку, для визначення груп користувача. Усі значення в усіх зазначених заголовках використовуються як імена груп.
- `--requestheader-extra-headers-prefix` Версія 1.6+. Необовʼязково, нечутливий до регістру. Пропонується використовувати "X-Remote-Extra-". Префікси заголовків для перевірки додаткової інформації про користувача (зазвичай використовується налаштованим втулком авторизації). У всіх заголовків, які починаються з будь-якого з зазначених префіксів, префікси  вилучаються. Решта імені заголовка перетворюється на нижній регістр і [декодується у відповідності з RFC 3986](https://tools.ietf.org/html/rfc3986#section-2.1), і стає додатковим ключем, а значення заголовка — додатковим значенням.

{{< note >}}
До версій 1.11.3 (та 1.10.7, 1.9.11), додатковий ключ міг містити лише символи, які
були [легальними у мітках заголовків HTTP](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}

Наприклад, з цією конфігурацією:

```none
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

цей запит:

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

призведе до такої інформації про користувача:

```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  acme.com/project:
  - some-project
  scopes:
  - openid
  - profile
```

Для запобігання підробці заголовків, проксі-сервер автентифікації повинен представити дійсний клієнтський сертифікат на API-сервер для перевірки за допомогою вказаного CA перед тим, як заголовки запиту будуть перевірені. ПОПЕРЕДЖЕННЯ: **не** використовуйте CA, який використовується в іншому контексті, якщо ви не розумієте ризики та механізми захисту використання CA.

- `--requestheader-client-ca-file` Обовʼязково. Файл з сертифікатами у форматі PEM. Дійсний клієнтський сертифікат повинен бути представлений і перевірений за допомогою сертифікатів у вказаному файлі перед перевіркою заголовків запиту для імен користувачів.
- `--requestheader-allowed-names` Необовʼязково. Список значень Common Name (CN). Якщо встановлено, дійсний клієнтський сертифікат з CN з вказаного списку повинен бути представлений перед перевіркою заголовків запиту для імен користувачів. Якщо порожній, дозволений будь-який CN.

## Анонімні запити {#anonymous-requests}

Коли увімкнено, запити, які не відхиляються іншими налаштованими методами автентифікації, розглядаються як анонімні запити та отримують імʼя користувача `system:anonymous` і групу `system:unauthenticated`.

Наприклад, на сервері з налаштованою автентифікацією за допомогою токенів та увімкненим анонімним доступом, запит із недійсним токеном автентифікації отримає помилку `401 Unauthorized`. Запит без токена автентифікації буде розглядатися як анонімний запит.

У версіях 1.5.1-1.5.x анонімний доступ типово вимкнено і може бути увімкнено шляхом додавання опції `--anonymous-auth=true` до API-сервера.

У версіях 1.6+ анонімний доступ типово увімкнено, якщо використовується режим авторизації, відмінний від `AlwaysAllow`, і може бути вимкнено шляхом додавання опції `--anonymous-auth=false` до API-сервера. Починаючи з версії 1.6, авторизатори ABAC і RBAC вимагають явної авторизації користувача `system:anonymous` або групи `system:unauthenticated`, тому застарілі правила політики, які надають доступ користувачеві `*` або групі `*`, не включають анонімних користувачів.

### Налаштування анонімної автентифікації {#anonymous-authentication-configuration}

{{< feature-state feature_gate_name="AnonymousAuthConfigurableEndpoints" >}}

`AuthenticationConfiguration` можна використовувати для налаштування анонімного автентифікатора. Якщо ви встановили поле anonymous у файлі `AuthenticationConfiguration`, ви не можете встановити прапорець `--anonymous-auth`.

Основна перевага налаштування анонімного автентифікатора за допомогою конфігураційного файлу автентифікації полягає в тому, що, крім увімкнення та вимкнення анонімної автентифікації, ви також можете налаштувати, які точки доступу що підтримують анонімну автентифікацію.

Ось приклад конфігураційного файлу автентифікації:

```yaml
---
#
# УВАГА: це приклад конфігурації.
#        Не використовуйте його для вашого власного кластера!
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
```

У наведеній конфігурації лише точки доступу `/livez`, `/readyz` і `/healthz` доступні для анонімних запитів. Будь-які інші точки доступу будуть недоступні, навіть якщо це дозволено конфігурацією RBAC.

## Імперсонізація користувачів {#user-impersonation}

Користувач може діяти від імені іншого користувача через заголовки імперсонізації. Це дозволяє вручну перевизначити інформацію про користувача, який виконує запит. Наприклад, адміністратор може використовувати цю функцію для налагодження політики авторизації, тимчасово імперсонуючи іншого користувача та перевіряючи, чи запит відхилено.

Запити з імперсонізацією спочатку автентифікуються як запити від імені запитувача, потім переключаються на імперсоновану інформацію про користувача.

- Користувач робить API-запит зі своїми обліковими даними _і_ заголовками імперсонізації.
- API-сервер автентифікує користувача.
- API-сервер переконується, що автентифіковані користувачі мають права імперсонізації.
- Інформація про користувача замінюється значеннями імперсонізації.
- Запит оцінюється, авторизація діє на основі імперсонованої інформації про користувача.

Для здійснення запиту на імперсонізацію можна використовувати такі заголовки HTTP:

- `Impersonate-User`: Імʼя користувача, від імені якого потрібно діяти.
- `Impersonate-Group`: Імʼя групи, від імені якої потрібно діяти. Може надаватися кілька разів для встановлення кількох груп. Опціонально. Потрібен `Impersonate-User`.
- `Impersonate-Extra-( extra name )`: Динамічний заголовок для звʼязування додаткових полів з користувачем. Опціонально. Потрібен `Impersonate-User`. Для збереження послідовності `( extra name )` повинно бути малими літерами, а будь-які символи, які не є [допустимими в HTTP-заголовках](https://tools.ietf.org/html/rfc7230#section-3.2.6), МАЮТЬ бути у форматі utf8 та [процентно-кодовані](https://tools.ietf.org/html/rfc3986#section-2.1).
- `Impersonate-Uid`: Унікальний ідентифікатор, який представляє імперсонованого користувача. Опціонально. Потрібен `Impersonate-User`. Kubernetes не накладає жодних вимог щодо формату цього рядка.

{{< note >}}
До версії 1.11.3 (та 1.10.7, 1.9.11), `( extra name )` міг містити лише символи, які були [допустимими в HTTP-заголовках](https://tools.ietf.org/html/rfc7230#section-3.2.6).
{{< /note >}}

{{< note >}}
`Impersonate-Uid` доступний лише у версіях 1.22.0 і вище.
{{< /note >}}

Приклад заголовків імперсонізації при імперсонуванні користувача з групами:

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

Приклад заголовків імперсонізації при імперсонуванні користувача з UID та додатковими полями:

```http
Impersonate-User: jane.doe@example.com
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
```

Для використання `kubectl` встановіть прапорець `--as` для налаштування заголовка `Impersonate-User`, встановіть прапорець `--as-group` для налаштування заголовка `Impersonate-Group`.

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

Встановіть прапорці `--as` і `--as-group`:

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

{{< note >}}
`kubectl` не може імперсонувати додаткові поля або UID.
{{< /note >}}

Для імперсонізації користувача, групи, ідентифікатора користувача (UID) або додаткових полів, користувач, який виконує імперсонізацію, повинен мати можливість виконувати дію "impersonate" з типом атрибута, який імперсонується ("user", "group", "uid" і т.д.). Для кластерів, що використовують втулок авторизації RBAC, наступна роль ClusterRole охоплює правила, необхідні для налаштування заголовків імперсонізації користувачів і груп:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

Для імперсонізації, додаткові поля та імперсоновані UID належать до групи `apiGroup` "authentication.k8s.io". Додаткові поля оцінюються як субресурси ресурсу "userextras". Щоб дозволити користувачеві використовувати заголовки імперсонізації для додаткового поля "scopes" та для UID, користувачеві слід надати таку роль:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# Може встановлювати заголовок "Impersonate-Extra-scopes" та заголовок "Impersonate-Uid".
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

Значення заголовків імперсонізації також можна обмежити, обмеживши набір `resourceNames`, які ресурс може приймати.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Може імперсонувати користувача "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Може імперсонувати групи "developers" та "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Може імперсонувати додаткове поле "scopes" зі значеннями "view" і "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# Може імперсонувати UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
Імперсонізація користувача або групи дозволяє вам виконувати будь-які дії, якби ви були цим користувачем або групою; з цієї причини імперсонізація не є обмеженою областю.
Якщо ви хочете дозволити імперсонізацію за допомогою Kubernetes RBAC, це вимагає використання `ClusterRole` та `ClusterRoleBinding`, а не `Role` та `RoleBinding`.
{{< /note >}}

## Втулки облікових даних client-go {#client-go-credential-plugins}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

`k8s.io/client-go` та інструменти, які використовують його, такі як `kubectl` та `kubelet`, можуть виконувати зовнішню команду для отримання облікових даних користувача.

Ця функція призначена для клієнтських інтеграцій з протоколами автентифікації, які не підтримуються на рівні `k8s.io/client-go` (LDAP, Kerberos, OAuth2, SAML та ін.). Вутулок реалізує логіку, специфічну для протоколу, а потім повертає непрозорі облікові дані для використання. Майже всі випадки використання втулків автентифікації потребують наявності компоненту на стороні сервера з підтримкою [автентифікації токенів webhook](#webhook-token-authentication), щоб інтерпретувати формат облікових даних, який генерується клієнтським втулком.

{{< note >}}
У попередніх версіях `kubectl` вбудовано підтримувалися автентифікація в AKS та GKE, але це більше не актуально.
{{< /note >}}

### Приклад використання {#example-use-case}

У гіпотетичному сценарії використання організація запускає зовнішню службу, яка обмінює облікові дані LDAP на підписані токени, специфічні для користувача. Служба також може відповідати на запити [автентифікатора токенів webhook](#webhook-token-authentication), щоб перевірити токени. Користувачам буде потрібно встановити втулок автентифікації на своїй робочій станції.

Для автентифікації в API:

- Користувач видає команду `kubectl`.
- Вутулок облікових даних запитує користувача облікові дані LDAP, обмінює облікові дані зовнішньою службою на токен.
- Вутулок облікових даних повертає токен client-go, який використовує його як токен власника на сервері API.
- Сервер API використовує [автентифікатор токенів webhook](#webhook-token-authentication), щоб надіслати `TokenReview` зовнішній службі.
- Зовнішня служба перевіряє підпис на токені та повертає імʼя користувача та групи.

### Налаштування

Втулки облікових даних налаштовуються через [файли конфігурації kubectl](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) як частина полів користувача.

{{< tabs name="exec_plugin_kubeconfig_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Команда для виконання. Обовʼязково.
      command: "example-client-go-exec-plugin"

      # Версія API, яку слід використовувати при декодуванні ресурсу ExecCredentials. Обовʼязково.
      #
      # Версія API, що повертається втулком, ПОВИННА відповідати версії, вказаній тут.
      #
      # Щоб інтегруватися з інструментами, які підтримують кілька версій (наприклад, client.authentication.k8s.io/v1beta1),
      # встановіть змінну середовища, передайте аргумент інструменту, що вказує, яку версію очікує втулка виконання,
      # або прочитайте версію з обʼєкта ExecCredential у змінній середовища KUBERNETES_EXEC_INFO.
      apiVersion: "client.authentication.k8s.io/v1"

      # Змінні середовища, що встановлюються під час виконання втулку. Необовʼязково.
      env:
      - name: "FOO"
        value: "bar"

      # Аргументи, які передаються під час виконання втулку. Необовʼязково.
      args:
      - "arg1"
      - "arg2"

      # Текст, який показуєтсья користувачу, коли виконуваний файл не знайдено. Необовʼязково.
      installHint: |
        example-client-go-exec-plugin потрібно для автентифікації
        в поточному кластері.  Його можна встановити:

        На macOS: brew install example-client-go-exec-plugin

        На Ubuntu: apt-get install example-client-go-exec-plugin

        На Fedora: dnf install example-client-go-exec-plugin

        ...

      # Чи надавати інформацію про кластер, яка може містити
      # дуже великі дані сертифікату CA, цьому втулка виконання як частину KUBERNETES_EXEC_INFO
      # змінної середовища.
      provideClusterInfo: true

      # Угода між втулком виконання та стандартним введенням/виведенням. Якщо
      # угода не може бути виконана, цей втулок виконання не буде запущено, та буде
      # повернено помилку. Допустимі значення: "Never" (цей втулок виконання ніколи не використовує стандартний ввід),
      # "IfAvailable" (цей втулок виконання хоче використовувати стандартний ввід, якщо він доступний),
      # або "Always" (цей втулок виконання вимагає стандартний ввід для роботи). Обовʼязково.
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # зарезервоване імʼя розширення для кожної конфігурації виконання кластера
      extension:
        arbitrary: config
        this: може бути надано через змінну середовища KUBERNETES_EXEC_INFO при встановленні provideClusterInfo
        you: ["можете", "покласти", "будь-що", "тут"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```

{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}

```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Команда для виконання. Обовʼязково.
      command: "example-client-go-exec-plugin"

      # Версія API, яку слід використовувати при декодуванні ресурсу ExecCredentials. Обовʼязково.
      #
      # Версія API, повернута втулком, ПОВИННА відповідати версії, вказаній тут.
      #
      # Щоб інтегруватися з інструментами, які підтримують кілька версій (наприклад, client.authentication.k8s.io/v1),
      # встановіть змінну середовища, перед ```yaml
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # Змінні середовища, що встановлюються під час виконання втулку. Необовʼязково.
      env:
      - name: "FOO"
        value: "bar"

      # Аргументи, які передаються під час виконання втулку. Необовʼязково.
      args:
      - "arg1"
      - "arg2"

      # Текст, який показується користувачу, коли виконуваний файл не знайдено. Необовʼязково.
      installHint: |
        example-client-go-exec-plugin потрібно для автентифікації
        в поточному кластері.  Його можна встановити:

        На macOS: brew install example-client-go-exec-plugin

        На Ubuntu: apt-get install example-client-go-exec-plugin

        На Fedora: dnf install example-client-go-exec-plugin

        ...

      # Чи надавати інформацію про кластер, яка може містити
      # дуже великі дані сертифікату CA, цьому втулку виконання як частину KUBERNETES_EXEC_INFO
      # змінної середовища.
      provideClusterInfo: true

      # Угода між втулком виконання та стандартним введенням/виведенням. Якщо
      # угода не може бути виконана, цей втулок виконання не буде запущено, а буде
      # повернено помилку. Допустимі значення: "Never" (цей втулок виконання ніколи не використовує стандартний ввід),
      # "IfAvailable" (цей втулок виконання хоче використовувати стандартний ввід, якщо він доступний),
      # або "Always" (цей втулок виконання вимагає стандартний ввід для роботи). Необовʼязково.
      # За замовчуванням - "IfAvailable".
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # зарезервоване імʼя розширення для кожної конфігурації виконання кластера
      extension:
        arbitrary: config
        this: може бути надано через змінну середовища KUBERNETES_EXEC_INFO при встановленні provideClusterInfo
        you: ["можете", "покласти", "будь-що", "тут"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```

{{% /tab %}}
{{< /tabs >}}

Відносні шляхи до команд інтерпретуються відносно теки файлу конфігурації. Якщо KUBECONFIG встановлено на `/home/jane/kubeconfig`, а команда виконання — `./bin/example-client-go-exec-plugin`, то виконується бінарний файл `/home/jane/bin/example-client-go-exec-plugin`.

```yaml
- name: my-user
  user:
    exec:
      # Шлях відносно теки kubeconfig
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```

### Формати вводу та виводу {#input-output-formats}

Виконана команда виводить обʼєкт `ExecCredential` у `stdout`. `k8s.io/client-go` автентифікується в Kubernetes API, використовуючи отримані облікові дані в `status`. Виконана команда отримує обʼєкт `ExecCredential` на вхід через змінну середовища `KUBERNETES_EXEC_INFO`. Цей вхід містить корисну інформацію, таку як очікувана версія API поверненого обʼєкта `ExecCredential` та чи може втулок використовувати `stdin` для взаємодії з користувачем.

Під час запуску з інтерактивної сесії (тобто термінал), `stdin` може бути наданий прямо втулку. Втулки повинні використовувати поле `spec.interactive` вхідного обʼєкта `ExecCredential` зі змінної середовища `KUBERNETES_EXEC_INFO` для визначення, чи був наданий `stdin`. Вимоги втулка до `stdin` (тобто чи `stdin` є необовʼязковим, строго обовʼязковим або ніколи не використовується для успішного запуску втулка) вказується за допомогою поля `user.exec.interactiveMode` у [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (див. таблицю нижче для дійсних значень). Поле `user.exec.interactiveMode` є необовʼязковим у `client.authentication.k8s.io/v1beta1` і обовʼязковим у `client.authentication.k8s.io/v1`.

{{< table caption="Значення interactiveMode" >}}
| Значення `interactiveMode` | Значення |
| ----------------------- | ------- |
| `Never` | Цей втулок виконання ніколи не потребує використання стандартного вводу, і тому втулок виконання буде запущений незалежно від того, чи доступний стандартний ввід для введення користувача. |
| `IfAvailable` | Цей втулок виконання хоче використовувати стандартний ввід, якщо він доступний, але може працювати, якщо стандартний ввід недоступний. Тому втулок виконання буде запущений незалежно від наявності введення з стандартного вводу. Якщо стандартний ввід доступний для введення користувача, він буде наданий цьому втулку виконання. |
| `Always` | Цей втулок виконання потребує стандартний ввід для роботи, і тому втулок виконання буде запущений лише тоді, коли стандартний ввід доступний для введення користувача. Якщо стандартний ввід недоступний для введення користувача, втулок виконання не буде запущений, і виконавець втулку поверне помилку. |
{{< /table >}}

Для використання облікових даних токена власника, втулок повертає токен у статусі [`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)

{{< tabs name="exec_plugin_ExecCredential_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```

{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Альтративно, можна повернути PEM-кодований сертифікат клієнта та ключ для використання TLS-автентифікації клієнта. Якщо втулок повертає різний сертифікат та ключ при наступному виклику, `k8s.io/client-go` закриє існуючі зʼєднання з сервером, щоб змусити новий TLS-обмін.

Якщо вказано, що `clientKeyData` та `clientCertificateData` повинні бути присутніми.

`clientCertificateData` може містити додаткові проміжні сертифікати для відправки на сервер.

{{< tabs name="exec_plugin_ExecCredential_example_2" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```

{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Додатково відповідь може включати термін дії облікового запису, форматований як
[RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) мітка часу.

Наявність або відсутність терміну дії має такий вплив:

- Якщо термін дії включений, токен власника та TLS-облікові дані кешуються до
  моменту закінчення строку дії, або якщо сервер відповідає з кодом стану HTTP 401,
  або при завершенні процесу.
- Якщо термін дії відсутній, токен власника та TLS-облікові дані кешуються до
  моменту, коли сервер відповідає з кодом стану HTTP 401 або до моменту завершення процесу.

{{< tabs name="exec_plugin_ExecCredential_example_3" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```

{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```

{{% /tab %}}
{{< /tabs >}}

Щоб дозволити втулку виконання отримувати інформацію, що специфічна для кластера, встановіть `provideClusterInfo` у поле `user.exec` в [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Втулок потім отримає цю інформацію, специфічну для кластера, у змінній середовища `KUBERNETES_EXEC_INFO`. Інформацію з цієї змінної середовища можна використовувати для виконання логіки отримання облікових даних, специфічних для кластера. Наступний маніфест `ExecCredential` описує зразок інформації для кластера.

{{< tabs name="exec_plugin_ExecCredential_example_4" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo",
        "you": ["can", "put", "anything here"]
    },
    "interactive": true
  }
}
```

{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```

{{% /tab %}}
{{< /tabs >}}

## Доступ API до інформації про автентифікацію для клієнта {#self-subject-review}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Якщо ваш кластер має включений API, ви можете використовувати API `SelfSubjectReview`, щоб дізнатися, як ваш кластер Kubernetes показує вашу інформацію про автентифікацію, щоб ідентифікувати вас як клієнта. Це працює незалежно від того, чи автентифікуєтеся ви як користувач (зазвичай представляючи реальну особу), чи як обліковий запис ServiceAccount.

Обʼєкти `SelfSubjectReview` не мають полів, які конфігуруються. При отриманні запиту API-сервер Kubernetes заповнює статус атрибутами користувача та повертає його користувачеві.

Приклад запиту (тіло буде `SelfSubjectReview`):

```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews
```

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}
```

Приклад відповіді:

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "name": "jane.doe",
      "uid": "b6c7cfd4-f166-11ec-8ea0-0242ac120002",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "extra": {
        "provider_id": ["token.company.example"]
      }
    }
  }
}
```

Для зручності доступний також запит `kubectl auth whoami`. Виконання цієї команди призведе до
наступного виводу (але різні атрибути користувача будуть показані):

- Простий приклад виводу

  ``` none
  ATTRIBUTE         VALUE
  Username          jane.doe
  Groups            [system:authenticated]
  ```

- Складний приклад, який включає додаткові атрибути

  ```none
  ATTRIBUTE         VALUE
  Username          jane.doe
  UID               b79dbf30-0c6a-11ed-861d-0242ac120002
  Groups            [students teachers system:authenticated]
  Extra: skills     [reading learning]
  Extra: subjects   [math sports]
  ```

За допомогою прапорця виводу також можна надрукувати JSON- або YAML-представлення результату:

{{< tabs name="self_subject_attributes_review_Example_1" >}}
{{% tab name="JSON" %}}

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "jane.doe",
      "uid": "b79dbf30-0c6a-11ed-861d-0242ac120002",
      "groups": [
        "students",
        "teachers",
        "system:authenticated"
      ],
      "extra": {
        "skills": [
          "reading",
          "learning"
        ],
        "subjects": [
          "math",
          "sports"
        ]
      }
    }
  }
}
```

{{% /tab %}}

{{% tab name="YAML" %}}

```yaml
apiVersion: authentication.k8s.io/v1
kind: SelfSubjectReview
status:
  userInfo:
    username: jane.doe
    uid: b79dbf30-0c6a-11ed-861d-0242ac120002
    groups:
    - students
    - teachers
    - system:authenticated
    extra:
      skills:
      - reading
      - learning
      subjects:
      - math
      - sports
```

{{% /tab %}}
{{< /tabs >}}

Ця функція є дуже корисною, коли використовується складний потік автентифікації в кластері Kubernetes, наприклад, якщо ви використовуєте [автентифікацію за допомогою токена через webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) або [автентифікацію через проксі](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).

{{< note >}}
API-сервер Kubernetes заповнює `userInfo` після застосування всіх механізмів автентифікації,
включаючи [імперсонізаацію](/docs/reference/access-authn-authz/authentication/#user-impersonation). Якщо ви, або автентифікаційний проксі, робите SelfSubjectReview за допомогою імперсонізації, ви побачите деталі та властивості користувача, який був імперсонований.
{{< /note >}}

Стандартно всі автентифіковані користувачі можуть створювати обʼєкти `SelfSubjectReview`, коли функція `APISelfSubjectReview` включена. Це дозволено за допомогою кластерної ролі `system:basic-user`.

{{< note >}}
Ви можете робити запити `SelfSubjectReview` тільки якщо:

- включено [функціонал](/docs/reference/command-line-tools-reference/feature-gates/) `APISelfSubjectReview` для вашого кластера (не потрібно для Kubernetes {{< skew currentVersion >}}, але більш старі версії Kubernetes можуть не надавати цю функцію або за стандартно вимикати її)
- (якщо ви запускаєте версію Kubernetes старішу за v1.28) API-сервер для вашого кластера має увімкнений API-групи `authentication.k8s.io/v1alpha1` або `authentication.k8s.io/v1beta1`.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Прочитайте [довідник з автентифікації клієнта (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
- Прочитайте [довідник з автентифікації клієнта (v1)](/docs/reference/config-api/client-authentication.v1/)
