---
title: Налаштування шару агрегації
content_type: task
weight: 10
---

<!-- overview -->

Налаштування [шару агрегації](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) дає змогу розширити API-сервер Kubernetes додатковими API, які не є частиною основних API Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Щоб шар агрегації працював у вашому середовищі й підтримував взаємну автентифікацію TLS між проксі та API-серверами розширення, потрібно виконати кілька вимог налаштування. Kubernetes і kube-apiserver мають кілька CA, тому переконайтеся, що проксі підписаний CA шару агрегації, а не чимось іншим, як-от загальним CA Kubernetes.
{{< /note >}}

{{< caution >}}
Повторне використання того самого CA для різних типів клієнтів може негативно вплинути на роботу кластера. Докладніше дивіться в розділі [Повторне використання CA та конфлікти](#ca-reusage-and-conflicts).
{{< /caution >}}

<!-- steps -->

## Потік автентифікації {#authentication-flow}

На відміну від Custom Resource Definitions (CRD), Aggregation API залучає ще один сервер — ваш API-сервер розширення — на додачу до стандартного API-сервера Kubernetes. API-серверу Kubernetes потрібно взаємодіяти з вашим API-сервером розширення, а вашому API-серверу розширення — з API-сервером Kubernetes. Щоб ця взаємодія була захищеною, API-сервер Kubernetes використовує сертифікати x509 для автентифікації перед API-сервером розширення.

У цьому розділі описано, як працюють потоки автентифікації та авторизації та як їх налаштувати.

Загальний потік такий:

1. API-сервер Kubernetes: автентифікація користувача, що надсилає запит, і авторизація його прав на запитаний шлях API.
2. API-сервер Kubernetes: проксіювання запиту до API-сервера розширення
3. API-сервер розширення: автентифікація запиту від API-сервера Kubernetes
4. API-сервер розширення: авторизація запиту від початкового користувача
5. API-сервер розширення: виконання

У решті цього розділу ці кроки описано докладно.

Потік показано на наведеній нижче схемі.

![aggregation auth flows](/images/docs/aggregation-api-auth-flow.png)

Джерело наведених вище swimlanes можна знайти у вихідному коді цього документа.

<!--
Потоки створено на https://swimlanes.io з таким джерелом:

-----BEGIN-----
title: Aggregation API request flow

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
8. Для змінних запитів агрегований apiserver виконує перевірки допуску. Типово втулок допуску життєвого циклу простору імен забезпечує створення ресурсів у просторі імен, який існує у kube-apiserver.
-----END-----
-->

### Автентифікація та авторизація в API-сервері Kubernetes {#kubernetes-apiserver-authentication-and-authorization}

Запит до шляху API, який обслуговує API-сервер розширення, починається так само, як і всі запити API: зі звернення до API-сервера Kubernetes. Цей шлях уже зареєстрований в API-сервері Kubernetes API-сервером розширення.

Користувач звертається до API-сервера Kubernetes, запитуючи доступ до шляху. API-сервер Kubernetes використовує стандартну автентифікацію та авторизацію, налаштовану в API-сервері Kubernetes, щоб автентифікувати користувача й авторизувати доступ до конкретного шляху.

Огляд автентифікації в кластері Kubernetes дивіться в розділі [«Автентифікація в кластері»](/docs/reference/access-authn-authz/authentication/). Огляд авторизації доступу до ресурсів кластера Kubernetes дивіться в розділі [«Огляд авторизації»](/docs/reference/access-authn-authz/authorization/).

До цього моменту все було стандартними запитами API Kubernetes, автентифікацією та авторизацією.

Тепер API-сервер Kubernetes готовий надіслати запит до API-сервера розширення.

### API-сервер Kubernetes проксіює запит {#kubernetes-apiserver-proxies-the-request}

Тепер API-сервер Kubernetes надішле, або проксіює, запит до API-сервера розширення, зареєстрованого для обробки цього запиту. Для цього йому потрібно знати кілька речей:

1. Як API-серверу Kubernetes автентифікуватися в API-сервері розширення, повідомляючи йому, що запит, який надходить мережею, походить від дійсного API-сервера Kubernetes?
2. Як API-серверу Kubernetes повідомити API-серверу розширення імʼя користувача та групу, для яких було автентифіковано початковий запит?

Щоб забезпечити ці дві речі, потрібно налаштувати API-сервер Kubernetes за допомогою кількох прапорців.

#### Автентифікація клієнта API-сервера Kubernetes {#kubernetes-apiserver-client-authentication}

API-сервер Kubernetes підʼєднується до API-сервера розширення через TLS, автентифікуючись за допомогою клієнтського сертифіката. Під час запуску потрібно надати API-серверу Kubernetes таке за допомогою вказаних прапорців:

* файл приватного ключа через `--proxy-client-key-file`
* підписаний файл клієнтського сертифіката через `--proxy-client-cert-file`
* сертифікат CA, який підписав файл клієнтського сертифіката через `--requestheader-client-ca-file`
* дійсні значення Common Name (CN) у підписаному клієнтському сертифікаті через `--requestheader-allowed-names`

API-сервер Kubernetes використовуватиме файли, вказані в `--proxy-client-*-file`, щоб автентифікуватися в API-сервері розширення. Щоб сумісний API-сервер розширення вважав запит дійсним, мають виконуватися такі умови:

1. Зʼєднання має бути встановлене за допомогою клієнтського сертифіката, підписаного CA, сертифікат якого міститься в `--requestheader-client-ca-file`.
2. Зʼєднання має бути встановлене за допомогою клієнтського сертифіката, CN якого є одним із перелічених у `--requestheader-allowed-names`.

{{< note >}}
Ви можете залишити цей параметр порожнім: `--requestheader-allowed-names=""`. Це вкаже API-серверу розширення, що _будь-який_ CN прийнятний.
{{< /note >}}

Після запуску з цими параметрами API-сервер Kubernetes:

1. Використовуватиме їх для автентифікації в API-сервері розширення.
2. Створить ConfigMap у просторі імен `kube-system` з назвою `extension-apiserver-authentication`, куди помістить сертифікат CA та дозволені CN. Їх, своєю чергою, можуть отримувати API-сервери розширення для перевірки запитів.

Зверніть увагу, що API-сервер Kubernetes використовує той самий клієнтський сертифікат для автентифікації в _усіх_ API-серверах розширення. Він не створює окремий клієнтський сертифікат для кожного API-сервера розширення, а використовує один, щоб автентифікуватися як API-сервер Kubernetes. Той самий сертифікат повторно використовується для всіх запитів до API-серверів розширення.

#### Імʼя користувача та група початкового запиту {#original-request-username-and-group}

Коли API-сервер Kubernetes проксіює запит до API-сервера розширення, він повідомляє API-серверу розширення імʼя користувача та групу, з якими початковий запит успішно автентифіковано. Він передає їх у заголовках http свого проксійованого запиту. Потрібно вказати API-серверу Kubernetes назви заголовків, які слід використовувати.

* заголовок, в якому зберігати імʼя користувача через `--requestheader-username-headers`
* заголовок, в якому зберігати групу через `--requestheader-group-headers`
* префікс, що додається до всіх додаткових заголовків, через `--requestheader-extra-headers-prefix`

Ці назви заголовків також поміщаються в ConfigMap `extension-apiserver-authentication`, тож API-сервери розширення можуть отримувати й використовувати їх.

### API-сервер розширення автентифікує запит {#extension-apiserver-authenticates-the-request}

API-сервер розширення, отримавши проксійований запит від API-сервера Kubernetes, має перевірити, що запит справді надійшов від дійсного проксі автентифікації, роль якого виконує API-сервер Kubernetes. API-сервер розширення перевіряє це так:

1. Отримує наведене нижче з ConfigMap у `kube-system`, як описано вище:
    * Сертифікат CA клієнта
    * Список дозволених імен (CN)
    * Назви заголовків для імені користувача, групи та додаткової інформації
2. Перевіряє, що зʼєднання TLS автентифіковано за допомогою клієнтського сертифіката, який:
    * Підписаний CA, сертифікат якого збігається з отриманим сертифікатом CA.
    * Має CN зі списку дозволених CN, якщо тільки список не порожній; у такому разі дозволено всі CN.
    * Витягує імʼя користувача та групу з відповідних заголовків

Якщо наведені вище перевірки пройдено, запит є дійсним проксійованим запитом від законного проксі автентифікації, у цьому випадку — API-сервера Kubernetes.

Зверніть увагу, що забезпечити наведене вище має реалізація API-сервера розширення. Багато хто робить це стандартно, використовуючи пакет `k8s.io/apiserver/`. Інші можуть надавати параметри для перевизначення цього за допомогою параметрів командного рядка.

Щоб мати дозвіл на отримання ConfigMap, API-серверу розширення потрібна відповідна роль. У просторі імен `kube-system` є стандартна роль `extension-apiserver-authentication-reader`, яку можна призначити.

### API-сервер розширення авторизує запит {#extension-apiserver-authorizes-the-request}

Тепер API-сервер розширення може перевірити, що користувач або група, отримані із заголовків, мають дозвіл на виконання цього запиту. Він робить це, надсилаючи стандартний запит [SubjectAccessReview](/docs/reference/access-authn-authz/authorization/) до API-сервера Kubernetes.

Щоб API-сервер розширення сам мав право надсилати запит `SubjectAccessReview` до API-сервера Kubernetes, йому потрібні відповідні дозволи. Kubernetes містить стандартну `ClusterRole` з назвою `system:auth-delegator`, що має потрібні дозволи. Її можна надати службовому обліковому запису API-сервера розширення.

### API-сервер розширення виконує запит {#extension-apiserver-executes}

Якщо `SubjectAccessReview` проходить, API-сервер розширення виконує запит.

## Увімкнення прапорців API-сервера Kubernetes {#enable-kubernetes-apiserver-flags}

Увімкніть шар агрегації за допомогою наведених нижче прапорців `kube-apiserver`. Можливо, про них уже подбав ваш провайдер.

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

### Повторне використання CA та конфлікти {#ca-reusage-and-conflicts}

API-сервер Kubernetes має два параметри клієнтського CA:

* `--client-ca-file`
* `--requestheader-client-ca-file`

Кожен із них працює незалежно, і вони можуть конфліктувати між собою, якщо їх використовувати неправильно.

* `--client-ca-file`: коли запит надходить до API-сервера Kubernetes і цей параметр увімкнено, API-сервер Kubernetes перевіряє сертифікат запиту. Якщо він підписаний одним із сертифікатів CA у файлі, на який вказує `--client-ca-file`, запит вважається законним, користувачем є значення Common Name `CN=`, а групою — організація `O=`. Дивіться [документацію з автентифікації TLS](/docs/reference/access-authn-authz/authentication/#x509-client-certificates).
* `--requestheader-client-ca-file`: коли запит надходить до API-сервера Kubernetes і цей параметр увімкнено, API-сервер Kubernetes перевіряє сертифікат запиту. Якщо він підписаний одним із сертифікатів CA у файлі, на який вказує `--requestheader-client-ca-file`, запит вважається потенційно законним. Потім API-сервер Kubernetes перевіряє, чи є Common Name `CN=` однією з назв у списку, заданому `--requestheader-allowed-names`. Якщо назву дозволено, запит схвалюється; якщо ні — запит не схвалюється.

Якщо задано _обидва_ параметри `--client-ca-file` і `--requestheader-client-ca-file`, запит спочатку перевіряється за CA `--requestheader-client-ca-file`, а потім за `--client-ca-file`. Зазвичай для кожного з цих параметрів використовуються різні CA, кореневі або проміжні; звичайні клієнтські запити відповідають `--client-ca-file`, а запити агрегації — `--requestheader-client-ca-file`. Однак якщо обидва використовують _той самий_ CA, клієнтські запити, які зазвичай пройшли б через `--client-ca-file`, завершаться збоєм, бо CA збігатиметься із CA в `--requestheader-client-ca-file`, але Common Name `CN=` **не** збігатиметься з жодним із прийнятних значень у `--requestheader-allowed-names`. Через це ваші kubelets та інші компоненти панелі управління, а також кінцеві користувачі можуть не змогти автентифікуватися в API-сервері Kubernetes.

Тому використовуйте різні сертифікати CA для параметра `--client-ca-file`, щоб авторизувати компоненти панелі управління та кінцевих користувачів, і для параметра `--requestheader-client-ca-file`, щоб авторизувати запити API-сервера агрегації.

{{< warning >}}
**Не** використовуйте повторно CA, який застосовується в іншому контексті, якщо ви не розумієте ризики та механізми захисту використання CA.
{{< /warning >}}

Якщо kube-proxy не працює на хості, де працює API-сервер, потрібно переконатися, що система увімкнена з таким прапорцем `kube-apiserver`:

    --enable-aggregator-routing=true

### Реєстрація обʼєктів APIService {#register-apiservice-objects}

Ви можете динамічно налаштовувати, які клієнтські запити проксіюються до API-сервера розширення. Нижче наведено приклад реєстрації:

```yaml

apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: <name of the registration object>
spec:
  group: <API group name this extension apiserver hosts>
  version: <API version this extension apiserver hosts>
  groupPriorityMinimum: <priority this APIService for this group, see API documentation>
  versionPriority: <prioritizes ordering of this version within a group, see API documentation>
  service:
    namespace: <namespace of the extension apiserver service>
    name: <name of the extension apiserver service>
  caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
```

Назва обʼєкта APIService має бути дійсною [назвою сегмента шляху](/docs/concepts/overview/working-with-objects/names#path-segment-names).

#### Звʼязок з API-сервером розширення {#contacting-the-extension-apiserver}

Коли API-сервер Kubernetes визначив, що запит потрібно надіслати до API-сервера розширення, йому потрібно знати, як із ним звʼязатися.

Блок `service` — це посилання на сервіс API-сервера розширення. Простір імен і назва сервісу обовʼязкові. Порт необовʼязковий, стандартно 443.

Ось приклад API-сервера розширення, налаштованого на виклики через порт "1234" і перевірку зʼєднання TLS за ServerName `my-service-name.my-service-namespace.svc` з використанням власного набору CA.

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
  caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Налаштуйте API-сервер розширення](/docs/tasks/extend-kubernetes/setup-extension-api-server/) для роботи із шаром агрегації.
* Загальний огляд дивіться в розділі [Розширення API Kubernetes за допомогою шару агрегації](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Дізнайтеся, як [розширити API Kubernetes за допомогою Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
