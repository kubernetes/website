---
title: Налаштування шару агрегації
content_type: task
weight: 10
---

<!-- overview -->

Налаштування [шару агрегації](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) дозволяє розширити apiserver Kubernetes додатковими API, які не є частиною основних API Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Існує кілька вимог щодо налаштування для роботи шару агрегації у вашому середовищі, щоб підтримувати взаємну автентифікацію TLS між проксі-сервером та apiserverʼом розширення. Kubernetes та kube-apiserver мають декілька ЦС (центрів сертифікації), тому переконайтеся, що проксі підписаний ЦС шару агрегації, а не іншим ЦС, таким як загальний ЦС Kubernetes.
{{< /note >}}

{{< caution >}}
Повторне використання одного ЦС для різних типів клієнтів може негативно вплинути на здатність кластера функціонувати. Для отримання додаткової інформації див. [Повторне використання ЦС та конфлікти](#ca-reusage-and-conflicts).
{{< /caution >}}

<!-- steps -->

## Потоки автентифікації {#authentication-flow}

На відміну від Custom Resource Definitions (CRDs), API агрегації включає ще один сервер, ваш apiserver розширення, крім стандартного apiserver Kubernetes. Kubernetes apiserver повинен взаємодіяти з вашим apiserver розширення, а ваш apiserver розширення повинен взаємодіяти з Kubernetes apiserver. Щоб ця взаємодія була захищеною, Kubernetes apiserver використовує x509 сертифікати для автентифікації себе перед apiserver розширення.

У цьому розділі описано, як працюють потоки автентифікації та авторизації та як їх налаштувати.

Основний потік виглядає наступним чином:

1. Kubernetes apiserver: автентифікація користувача, що запитує, та авторизація його прав на запитаний API шлях.
2. Kubernetes apiserver: проксіювання запиту до apiserverʼа розширення.
3. apiserver розширення: автентифікація запиту від Kubernetes apiserver.
4. apiserver розширення: авторизація запиту від початкового користувача.
5. apiserver розширення: виконання.

У решті цього розділу описуються ці кроки детально.

Потік можна побачити на наступній діаграмі.

![aggregation auth flows](/images/docs/aggregation-api-auth-flow.png)

Джерело для вищезазначених потоків можна знайти у вихідному коді цього документа.

<!--
Потоки створено на https://swimlanes.io з таким джерелом:

-----BEGIN-----
title: Ласкаво просимо на swimlanes.io

Користувач -> kube-apiserver / агрегатор:

note:
1. Користувач робить запит до Kube API сервера, використовуючи будь-який визнаний обліковий запис (наприклад, OIDC або клієнтські сертифікати).

kube-apiserver / агрегатор -> kube-apiserver / агрегатор: автентифікація

note:
2. Kube API сервер автентифікує вхідний запит, використовуючи будь-які налаштовані методи автентифікації (наприклад, OIDC або клієнтські сертифікати).

kube-apiserver / агрегатор -> kube-apiserver / агрегатор: авторизація

note:
3. Kube API сервер авторизує запитану URL-адресу, використовуючи будь-який налаштований метод авторизації (наприклад, RBAC).

kube-apiserver / агрегатор -> агрегований apiserver:

note:
4. Агрегатор відкриває зʼєднання з агрегованим API сервером, використовуючи клієнтський сертифікат/ключ `--proxy-client-cert-file`/`--proxy-client-key-file` для захисту каналу.
5. Агрегатор відправляє інформацію про користувача зі кроку 1 до агрегованого API сервера як HTTP заголовки, як визначено наступними прапорами:
  * `--requestheader-username-headers`
  * `--requestheader-group-headers`
  * `--requestheader-extra-headers-prefix`

агрегований apiserver -> агрегований apiserver: автентифікація

note:
6. Агрегований apiserver автентифікує вхідний запит, використовуючи метод автентифікації проксі-сервера:
  * перевіряє, що запит має визнаний клієнтський сертифікат проксі-сервера.
  * витягує інформацію про користувача з HTTP заголовків вхідного запиту.

Типово він витягує інформацію про конфігурацію з configmap в просторі імен kube-system, яка публікується kube-apiserver, містить інформацію про прапорці `--requestheader-...`, надані kube-apiserver (пакет ЦС для використання, імена клієнтських сертифікатів проксі-сервера, заголовки HTTP для використання тощо).

агрегований apiserver -> kube-apiserver / агрегатор: авторизація

note:
7. Агрегований apiserver авторизує вхідний запит, роблячи виклик SubjectAccessReview до kube-apiserver.

агрегований apiserver -> агрегований apiserver: доступ

note:
1. Для змінних запитів, агрегований apiserver виконує перевірки доступ. Типово, втулок доступу життєвого циклу простору імен забезпечує створення ресурсів у просторі імен, який існує у kube-apiserver.
-----END-----
-->

### Автентифікація та авторизація Kubernetes Apiserver {#kubernetes-apiserver-authentication-and-authorization}

Запит до API шляху, який обслуговується apiserver розширення, починається так само, як і всі API запити: з комунікації з Kubernetes apiserver. Цей шлях вже був зареєстрований з Kubernetes apiserver apiserver розширення.

Користувач взаємодіє з Kubernetes apiserver, запитуючи доступ до шляху. Kubernetes apiserver використовує стандартну автентифікацію та авторизацію, налаштовану в Kubernetes apiserver, для автентифікації користувача та авторизації доступу до конкретного шляху.

Для загального огляду автентифікації в кластері Kubernetes див. ["Автентифікація в кластері"](/docs/reference/access-authn-authz/authentication/). Для загального огляду авторизації доступу до ресурсів кластера Kubernetes див. ["Огляд авторизації"](/docs/reference/access-authn-authz/authorization/).

Все до цього моменту було стандартними запитами API Kubernetes, автентифікацією та авторизацією.

Kubernetes apiserver тепер готовий відправити запит до apiserverʼа розширення.

### Проксіювання запиту Kubernetes Apiserver {#kubernetes-apiserver-proxies-the-request}

Kubernetes apiserver тепер відправить або проксує запит до apiserverʼа розширення, який зареєстрований для обробки цього запиту. Для цього потрібно знати кілька речей:

1. Як Kubernetes apiserver повинен автентифікуватися у apiserver розширення, інформуючи його, що запит, який надходить мережею, надходить від дійсного Kubernetes apiserver?
2. Як Kubernetes apiserver повинен інформувати apiserver розширення про імʼя користувача та групу, з якими оригінальний запит був автентифікований?

Щоб забезпечити ці два аспекти, ви повинні налаштувати Kubernetes apiserver, використовуючи кілька прапорців.

#### Автентифікація клієнта Kubernetes Apiserver {#kubernetes-apiserver-client-authentication}

Kubernetes apiserver підключається до apiserverʼа розширення через TLS, автентифікується за допомогою клієнтського сертифіката. Ви повинні надати наступне для Kubernetes apiserver при запуску, використовуючи вказані параметри:

* файл приватного ключа через `--proxy-client-key-file`
* підписаний файл клієнтського сертифіката через `--proxy-client-cert-file`
* сертифікат CA, який підписав файл клієнтського сертифіката через `--requestheader-client-ca-file`
* дійсні значення загального імені (CN) в підписаному клієнтському сертифікаті через `--requestheader-allowed-names`

Kubernetes apiserver використовуватиме файли, вказані `--proxy-client-*-file`, щоб автентифікуватися у apiserver розширення. Щоб запит був вважався дійсним відповідно до стандартів apiserverʼа розширення, мають виконуватися наступні умови:

1. Підключення має бути виконане за допомогою клієнтського сертифіката, який підписаний CA, сертифікат якого знаходиться в `--requestheader-client-ca-file`.
2. Підключення має бути виконане за допомогою клієнтського сертифіката, CN якого знаходиться в одному з тих, що перелічені в `--requestheader-allowed-names`.

{{< note >}}
Ви можете встановити цей параметр як порожній рядок: `--requestheader-allowed-names=""`. Це позначатиме для apiserverʼа розширення, що _будь-яке_ CN прийнятне.
{{< /note >}}

Після запуску з цими параметрами Kubernetes apiserver:

1. Використовуватиме їх для автентифікації у apiserver розширення.
2. Створить ConfigMap у просторі імен `kube-system` з назвою `extension-apiserver-authentication`, в який він помістить сертифікат CA та дозволені CN. Ці дані можна отримати apiserverʼа розширенняs для перевірки запитів.

Зверніть увагу, що той самий клієнтський сертифікат використовується Kubernetes apiserver для автентифікації для _усіх_ apiserverʼів розширень. Він не створює окремий клієнтський сертифікат для кожного apiserverʼа розширення, а лише один, щоб автентифікуватися як Kubernetes apiserver. Цей самий сертифікат використовується для всіх запитів apiserverʼа розширення.

#### Імʼя користувача та група оригінального запиту {#original-request-username-and-group}

Коли Kubernetes apiserver проксіює запит до apiserverʼа розширення, він повідомляє apiserver розширення імʼя користувача та групу, з якими успішно був автентифікований початковий запит. Він надає це у http заголовках свого проксі-запиту. Ви повинні повідомити Kubernetes apiserver назви заголовків, які слід використовувати.

* заголовок, в якому зберігати імʼя користувача через `--requestheader-username-headers`
* заголовок, в якому зберігати групу через `--requestheader-group-headers`
* префікс для всіх додаткових заголовків через `--requestheader-extra-headers-prefix`

Ці назви заголовків також поміщаються в ConfigMap `extension-apiserver-authentication`, так що їх можна отримати та використати apiserverʼа розширенняs.

### Apiserver розширення автентифікує запит {#extension-apiserver-authenticates-the-request}

apiserver розширення, отримавши проксі-запит від Kubernetes apiserver, повинен перевірити, що запит дійсно надійшов від дійсного автентифікуючого проксі, роль якого виконує Kubernetes apiserver. apiserver розширення перевіряє його за допомогою:

1. Отримання наступного з ConfigMap в `kube-system`, як описано вище:
    * Сертифікат CA клієнта
    * Список дозволених імен (CN)
    * Назви заголовків для імені користувача, групи та додаткової інформації
2. Перевірте, що TLS-зʼєднання було автентифіковано за допомогою сертифіката клієнта, який:
   * Був підписаний CA, чий сертифікат відповідає отриманому сертифікату CA.
   * Має CN у списку дозволених CN, якщо список не порожній, в іншому випадку дозволяються всі CN.
   * Витягу імені користувача та групи з відповідних заголовків.

Якщо вище зазначене пройшло, тоді запит є дійсним проксійним запитом від законного проксі автентифікації, у цьому випадку — apiserver Kubernetes.

Зверніть увагу, що відповідальність за надання вищезазначеного лежить на реалізації apiserverʼа розширення. Більшість роблять це стандартно, використовуючи пакет `k8s.io/apiserver/`. Інші можуть надати опції для зміни цього за допомогою параметрів командного рядка.

Для того, щоб мати дозвіл на отримання конфігураційного файлу, apiserver розширення потребує відповідної ролі. Існує стандартна роль з назвою `extension-apiserver-authentication-reader` в просторі імен `kube-system`, яка може бути призначена.

### Apiserver розширення авторизує запит

Тепер apiserver розширення може перевірити, що користувач/група, отримані з заголовків, мають дозвіл на виконання даного запиту. Він робить це, надсилаючи стандартний запит [SubjectAccessReview](/docs/reference/access-authn-authz/authorization/) до apiserver Kubernetes.

Для того, щоб apiserver розширення мав право на надсилання запиту `SubjectAccessReview` до apiserver Kubernetes, йому потрібні відповідні дозволи. Kubernetes включає стандартну `ClusterRole` з назвою `system:auth-delegator`, яка має необхідні дозволи. Її можна надати службовому обліковому запису apiserverʼа розширенняа.

### Виконання Apiserver розширення {#extension-apiserver-executes}

Якщо перевірка `SubjectAccessReview` пройде успішно, apiserver розширення виконує запит.

## Увімкнення прапорців Apiserver Kubernetes {#enabling-kubernetes-apiserver-flags}

Увімкніть агрегаційний шар за допомогою наступних прапорців `kube-apiserver`. Вони можуть вже бути налаштовані вашим постачальником.

    --requestheader-client-ca-file=<шлях до сертифікату CA агрегатора>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<шлях до сертифікату проксі-клієнта агрегатора>
    --proxy-client-key-file=<шлях до ключа проксі-клієнта агрегатора>

### Повторне використання та конфлікти сертифікатів CA {#ca-reusage-and-conflicts}

У Kubernetes apiserver є два параметри CA клієнта:

* `--client-ca-file`
* `--requestheader-client-ca-file`

Кожен з цих параметрів працює незалежно і може конфліктувати один з одним, якщо їх не використовувати належним чином.

* `--client-ca-file`: Коли запит надходить на Kubernetes apiserver, якщо цей параметр увімкнено, Kubernetes apiserver перевіряє сертифікат запиту. Якщо він підписаний одним з сертифікатів CA в файлі, на який вказує `--client-ca-file`, то запит вважається законним, а користувач — значенням загального імені `CN=`, а група — організацією `O=`. Див. [документацію з автентифікації TLS](/docs/reference/access-authn-authz/authentication/#x509-client-certificates).
* `--requestheader-client-ca-file`: Коли запит надходить на Kubernetes apiserver, якщо цей параметр увімкнено, Kubernetes apiserver перевіряє сертифікат запиту. Якщо він підписаний одним із сертифікатів CA у файлі, на який вказує `--requestheader-client-ca-file`, то запит вважається потенційно законним. Потім Kubernetes apiserver перевіряє, чи є загальне імʼя `CN=` одним з імен у списку, наданому параметром `--requestheader-allowed-names`. Якщо імʼя дозволене, запит схвалюється; якщо ні, запит відхиляється.

Якщо _обидва_ параметри `--client-ca-file` та `--requestheader-client-ca-file` надані, то спочатку запит перевіряє CA `--requestheader-client-ca-file`, а потім `--client-ca-file`. Зазвичай для кожного з цих параметрів використовуються різні сертифікати CA, або кореневі CA, або проміжні CA; звичайні клієнтські запити відповідають `--client-ca-file`, тоді як агрегаційні запити відповідають `--requestheader-client-ca-file`. Однак, якщо обидва використовують _той самий_ CA, то звичайні клієнтські запити, які зазвичай пройшли б через `--client-ca-file`, не пройдуть, оскільки CA буде відповідати CA в `--requestheader-client-ca-file`, але загальне імʼя `CN=` **не** буде відповідати одному з припустимих загальних імен в `--requestheader-allowed-names`. Це може призвести до того, що kublete та інші компоненти панелі управління, так само як і інші клієнти, не зможуть автентифікуватись на Kubernetes apiserver.

З цієї причини використовуйте різні сертифікати CA для опції `--client-ca-file`, щоб авторизувати компоненти панелі управління та кінцевих користувачів, і опції `--requestheader-client-ca-file`, щоб авторизувати запити apiserverʼа агрегації.

{{< warning >}}
**Не** використовуйте знову CA, який використовується в іншому контексті, якщо ви не розумієте ризики та механізми захисту використання CA.
{{< /warning >}}

Якщо ви не запускаєте kube-proxy на хості, на якому працює API-сервер, вам потрібно впевнитися, що система ввімкнена з наступним прапорцем `kube-apiserver`:

```shell
--enable-aggregator-routing=true
```

### Реєстрація обʼєктів APIService {#register-apiservice-objects}

Ви можете динамічно налаштувати, які клієнтські запити будуть проксійовані до apiserverʼа розширення. Нижче наведено приклад реєстрації:

```yaml

apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: <імʼя обʼєкта реєстрації>
spec:
  group: <назва групи API, яку обслуговує цей apiserver розширення>
  version: <версія API, яку обслуговує цей apiserver розширення>
  groupPriorityMinimum: <пріоритет цього APIService для цієї групи, див. документацію API>
  versionPriority: <пріоритет упорядкування цієї версії у межах групи, див. документацію API>
  service:
    namespace: <простір імен сервісу apiserverʼа розширення>
    name: <імʼя сервісу apiserverʼа розширення>
  caBundle: <pem-кодований ca-сертифікат, який підписує сертифікат сервера, який використовується вебзапитом>
```

Імʼя обʼєкта APIService повинно бути дійсним [імʼям сегмента шляху](/docs/concepts/overview/working-with-objects/names#path-segment-names).

#### Звертання до apiserverʼа розширення {#contacting-the-extendsion-apiserver}

Після того, як Kubernetes apiserver вирішив, що запит потрібно надіслати до apiserverʼа розширення, він повинен знати, як з ним звʼязатися.

Блок `service` — це посилання на сервіс для apiserverʼа розширення. Простір імен та імʼя сервісу обовʼязкові. Порт є необовʼязковим і типово дорівнює 443.

Ось приклад apiserverʼа розширення, який налаштований для виклику на порті "1234" та перевірки зʼєднання TLS проти ServerName `my-service-name.my-service-namespace.svc`, використовуючи власний пакет CA.

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
...
spec:
  ...
  service:
    namespace: my-service-namespace
    name: my-service-name
    port: 1234
  caBundle: "Ci0tLS0tQk...<base64-кодований PEM пакет>...tLS0K"
...
```

## {{% heading "whatsnext" %}}

* [Налаштуйте apiserver розширення](/docs/tasks/extend-kubernetes/setup-extension-api-server/)
для роботи з шаром агрегації.
* Для загального огляду див. [Розширення Kubernetes API за допомогою шару агрегації](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Дізнайтеся, як [Розширити API Kubernetes, використовуючи визначення власних ресурсів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
