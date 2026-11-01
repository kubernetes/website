---
title: Secrets
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Керування Secrets та конфігурацією
  description: >
    Розгортайте та оновлюйте Secrets і конфігурацію застосунків без перезбирання образу та без розкриття Secrets у конфігурації вашого стеку.
weight: 30
---

<!-- overview -->

Secret — це обʼєкт, який містить невелику кількість конфіденційних даних, таких як пароль, токен або ключ. Інакше така інформація могла б потрапити до специфікації {{< glossary_tooltip term_id="pod" >}} або до {{< glossary_tooltip text="образу контейнера" term_id="image" >}}. Використання Secret означає, що вам не потрібно включати конфіденційні дані в код застосунку.

Оскільки Secrets можна створювати незалежно від Podʼів, які їх використовують, існує менше ризику того, що Secret (і його дані) буде розкрито під час створення, перегляду та редагування Podʼів. Kubernetes та застосунки, які працюють у вашому кластері, також можуть вживати додаткових заходів безпеки щодо Secrets, наприклад, уникати запису конфіденційних даних в енергонезалежне сховище.

Secrets схожі на {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}, але спеціально призначені для зберігання конфіденційних даних.

{{< caution >}}
Kubernetes Secrets стандартно зберігаються незашифрованими в базовому сховищі даних API-сервера (etcd). Будь-хто з доступом до API може отримати або змінити Secret, так само як будь-хто з доступом до etcd. Крім того, будь-хто, хто має дозвіл на створення Podʼа у просторі імен, може використовувати цей доступ для читання будь-якого Secret у цьому просторі імен; це включає і непрямий доступ, такий як можливість створення Deployment.

Щоб безпечно використовувати Secrets, виконайте принаймні такі кроки:

1. [Увімкніть шифрування у стані спокою](/docs/tasks/administer-cluster/encrypt-data/) для Secrets.
2. [Увімкніть або налаштуйте правила RBAC](/docs/reference/access-authn-authz/authorization/) з доступом до Secrets за принципом найменших привілеїв.
3. Обмежте доступ до Secrets конкретними контейнерами.
4. [Розгляньте використання зовнішніх постачальників сховища для Secrets](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).

Для отримання додаткових рекомендацій щодо керування та покращення безпеки ваших Secrets ознайомтесь із [Належними практиками для Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
{{< /caution >}}

Докладніше див. у розділі [Інформаційна безпека для Secrets](#information-security-for-secrets).

<!-- body -->

## Застосування Secrets {#uses-for-secrets}

Ви можете використовувати Secrets для таких цілей:

- [Встановлення змінних середовища для контейнера](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [Надання облікових даних, таких як SSH-ключі або паролі, Podʼам](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [Дозвіл kubelet завантажувати образи контейнерів із приватних реєстрів](/docs/tasks/configure-pod-container/pull-image-private-registry/).

Панель управління Kubernetes також використовує Secrets; наприклад, [Secrets bootstrap-токенів](#bootstrap-token-secrets) — це механізм, що допомагає автоматизувати реєстрацію вузлів.

### Сценарій використання: dotfiles у томі Secret {#use-case-dotfiles-in-a-secret-volume}

Ви можете зробити ваші дані "прихованими", визначивши ключ, який починається з крапки. Цей ключ являє собою dotfile або "прихований" файл. Наприклад, коли цей Secret монтується в том `secret-volume`, том міститиме один файл із назвою `.secret-file`, а контейнер `dotfile-test-container` матиме цей файл за шляхом `/etc/secret-volume/.secret-file`.

{{< note >}}
Файли, які починаються з крапок, приховані від виводу `ls -l`; щоб побачити їх під час перегляду вмісту теки, використовуйте `ls -la`.
{{< /note >}}

{{% code_sample language="yaml" file="secret/dotfile-secret.yaml" %}}

### Сценарій використання: Secret, видимий для одного контейнера в Podʼі {#use-case-secret-visible-to-one-container-in-a-pod}

Припустимо, що у вас є програма, яка потребує обробки HTTP-запитів, виконання складної бізнес-логіки та підписування деяких повідомлень за допомогою HMAC. Оскільки у неї складна логіка застосунку, на сервері може бути непомічена вразливість віддаленого читання файлів, яка може розкрити приватний ключ зловмиснику.

Це можна розділити на два процеси у двох контейнерах: фронтенд-контейнер, який обробляє взаємодію з користувачем та бізнес-логіку, але не може бачити приватний ключ; і контейнер-підписувач, який може бачити приватний ключ та відповідає на прості запити на підпис від фронтенду (наприклад, через мережу localhost).

З цим розділеним підходом зловмиснику тепер потрібно змусити сервер застосунку зробити щось досить довільне, що може бути складніше, ніж змусити його прочитати файл.

### Альтернативи Secrets {#alternatives-to-secrets}

Замість використання Secret для захисту конфіденційних даних ви можете скористатися альтернативами.

Ось деякі з варіантів:

- Якщо ваш компонент cloud native має автентифікуватися в іншому застосунку, який, як ви знаєте, працює в тому самому кластері Kubernetes, ви можете використовувати [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens) та його токени, щоб ідентифікувати вашого клієнта.
- Існують сторонні інструменти, які ви можете запускати, як в межах, так і поза вашим кластером, які керують чутливими даними. Наприклад, сервіс, до якого Podʼи звертаються через HTTPS і який розкриває Secret, якщо клієнт правильно автентифікується (наприклад, з токеном ServiceAccount).
- Для автентифікації ви можете реалізувати власний підписувач для сертифікатів X.509 і використовувати [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/), щоб дозволити цьому власному підписувачу видавати сертифікати Podʼам, які їх потребують.
- Ви можете використовувати [втулок пристрою](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/), щоб надати певному Podʼу доступ до локального для вузла апаратного забезпечення шифрування. Наприклад, ви можете планувати довірені Podʼи на вузли, які надають Trusted Platform Module, налаштований окремо (out-of-band).

Ви також можете комбінувати два або більше з цих варіантів, включаючи використання самих обʼєктів Secret.

Наприклад: реалізуйте (або розгорніть) {{< glossary_tooltip text="оператор" term_id="operator-pattern" >}}, що отримує короткострокові токени сеансів від зовнішнього сервісу, а потім створює Secrets на основі цих короткострокових токенів. Podʼи, що працюють у вашому кластері, можуть використовувати токени сеансів, а оператор забезпечує їхню дійсність. Такий розподіл означає, що ви можете запускати Podʼи, які не знають точних механізмів видачі та оновлення цих токенів сеансів.

## Типи Secret {#secret-types}

Під час створення Secret ви можете вказати його тип, використовуючи поле `type` ресурсу [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/), або певні еквівалентні прапорці командного рядка `kubectl` (якщо вони доступні). Тип Secret використовується для полегшення програмної обробки даних Secret.

Kubernetes надає кілька вбудованих типів для деяких типових сценаріїв використання. Ці типи відрізняються за умовами перевірки та обмеженнями, які Kubernetes накладає на них.

| Вбудований тип                        | Використання                            |
| ------------------------------------- |---------------------------------------- |
| `Opaque`                              | довільні користувацькі дані           |
| `kubernetes.io/service-account-token` | токен ServiceAccount        |
| `kubernetes.io/dockercfg`             | серіалізований файл `~/.dockercfg`     |
| `kubernetes.io/dockerconfigjson`      | серіалізований файл `~/.docker/config.json` |
| `kubernetes.io/basic-auth`            | облікові дані для базової автентифікації |
| `kubernetes.io/ssh-auth`              | облікові дані для SSH-автентифікації  |
| `kubernetes.io/tls`                   | дані для клієнта або сервера TLS       |
| `bootstrap.kubernetes.io/token`       | дані bootstrap-токена                   |

Ви можете визначити та використовувати власний тип Secret, присвоївши непорожній рядок як значення `type` обʼєкта Secret (порожній рядок розглядається як тип `Opaque`).

Kubernetes не накладає жодних обмежень на назву типу. Однак якщо ви використовуєте один з вбудованих типів, ви повинні задовольнити всі вимоги, визначені для цього типу.

Якщо ви визначаєте тип Secret, призначений для загального використання, дотримуйтесь домовленостей та структуруйте тип Secret так, щоб він мав назву вашого домену перед назвою типу, відокремлену символом `/`. Наприклад: `cloud-hosting.example.net/cloud-api-credentials`.

### Opaque Secrets

`Opaque` — це стандартний тип Secret, якщо ви не вказуєте явно тип у маніфесті Secret. Під час створення Secret за допомогою `kubectl` вам потрібно використовувати підкоманду `generic`, щоб вказати тип Secret `Opaque`. Наприклад, ця команда створює порожній Secret типу `Opaque`:

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

Вивід виглядає так:

```none
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

У стовпчику `DATA` показується кількість елементів даних, збережених у Secret. У цьому випадку `0` означає, що ви створили порожній Secret.

### Secrets токенів ServiceAccount {#serviceaccount-token-secrets}

Тип Secret `kubernetes.io/service-account-token` використовується для зберігання токена, який ідентифікує {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}. Це застарілий механізм, який забезпечує довгострокові облікові дані ServiceAccount для Podʼів.

У Kubernetes v1.22 та пізніших рекомендований підхід полягає в тому, щоб натомість отримувати короткостроковий токен ServiceAccount з автоматичною ротацією за допомогою API [`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/). Ви можете отримати ці короткострокові токени такими методами:

- Викликайте API `TokenRequest` безпосередньо або через клієнт API, такий як `kubectl`. Наприклад, ви можете використовувати команду [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-).
- Запитуйте змонтований токен у [спроєцьованому томі](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume) у вашому маніфесті Podʼа. Kubernetes створює токен і монтує його в Pod. Токен автоматично анулюється, коли Pod, в якому він монтується, видаляється. Докладні відомості див. в розділі [Запуск Podʼа з проєкцією токена ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection).

{{< note >}}
Ви повинні створювати Secret токена ServiceAccount лише в тому випадку, якщо ви не можете використовувати API `TokenRequest` для отримання токена, і вам прийнятно з погляду безпеки зберігання безстрокового токена доступу в доступному для читання обʼєкті API. Для інструкцій див. [Створення довгострокового API-токена для ServiceAccount вручну](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).
{{< /note >}}

Під час використання цього типу Secret вам потрібно переконатися, що анотація `kubernetes.io/service-account.name` містить назву наявного ServiceAccount. Якщо ви створюєте як Secret, так і обʼєкти ServiceAccount, ви повинні спочатку створити обʼєкт ServiceAccount.

Після створення Secret {{< glossary_tooltip text="контролер" term_id="controller" >}} Kubernetes заповнює деякі інші поля, такі як анотація `kubernetes.io/service-account.uid`, та ключ `token` в полі `data`, який заповнюється токеном автентифікації.

У цьому прикладі конфігурації оголошується Secret токена ServiceAccount:

{{% code_sample language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

Після створення Secret дочекайтеся, коли Kubernetes заповнить ключ `token` в полі `data`.

Для отримання додаткової інформації про роботу ServiceAccounts перегляньте документацію про [ServiceAccount](/docs/concepts/security/service-accounts/). Ви також можете перевірити поле `automountServiceAccountToken` та поле `serviceAccountName` у [`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) для отримання інформації про посилання на облікові дані ServiceAccount з Podʼів.

### Secrets конфігурації Docker {#docker-config-secrets}

Якщо ви створюєте Secret для зберігання облікових даних для доступу до реєстру образів контейнерів, ви повинні використовувати одне з таких значень `type` для цього Secret:

- `kubernetes.io/dockercfg`: зберігає серіалізований `~/.dockercfg`, який є застарілим форматом налаштування командного рядка Docker. У полі `data` Secret міститься ключ `.dockercfg`, значення якого — це вміст файлу `~/.dockercfg`, закодованого у форматі base64.
- `kubernetes.io/dockerconfigjson`: зберігає серіалізований JSON, який відповідає тим самим правилам формату, що й файл `~/.docker/config.json`, який є новим форматом для `~/.dockercfg`. У полі `data` Secret має міститися ключ `.dockerconfigjson`, значення якого — це вміст файлу `~/.docker/config.json`, закодованого у форматі base64.

Нижче наведено приклад для Secret типу `kubernetes.io/dockercfg`:

{{% code_sample language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
Якщо ви не хочете виконувати кодування у формат base64, ви можете натомість використати поле `stringData`.
{{< /note >}}

Під час створення Secrets конфігурації Docker за допомогою маніфесту API-сервер перевіряє, чи існує очікуваний ключ у полі `data`, і чи надане значення можна розібрати як дійсний JSON. API-сервер не перевіряє, чи є цей JSON фактично файлом конфігурації Docker.

Ви також можете використовувати `kubectl` для створення Secret для доступу до реєстру контейнерів, наприклад, коли у вас немає файлу конфігурації Docker:

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

Ця команда створює Secret типу `kubernetes.io/dockerconfigjson`.

Отримайте поле `.data.dockerconfigjson` з цього нового Secret та розкодуйте дані:

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

Вивід еквівалентний такому JSON-документу (який також є дійсним файлом конфігурації Docker):

```json
{
  "auths": {
    "my-registry.example:5000": {
      "username": "tiger",
      "password": "pass1234",
      "email": "tiger@acme.example",
      "auth": "dGlnZXI6cGFzczEyMzQ="
    }
  }
}
```

{{< caution >}}
Значення `auth` закодовано у формат base64; воно приховане, але не є секретним. Будь-хто, хто може прочитати цей Secret, може дізнатися токен доступу (bearer) до реєстру.

Рекомендується використовувати [постачальників облікових даних](/docs/tasks/administer-cluster/kubelet-credential-provider/) для динамічного й безпечного надання Secrets для завантаження образів на запит.
{{< /caution >}}

### Secret базової автентифікації {#basic-authentication-secret}

Тип `kubernetes.io/basic-auth` наданий для зберігання облікових даних, необхідних для базової автентифікації. Під час використання цього типу Secret поле `data` Secret повинно містити один із двох таких ключів:

- `username`: імʼя користувача для автентифікації
- `password`: пароль або токен для автентифікації

Обидва значення для цих ключів є рядками, закодованими в base64. Ви також можете надати відкритий текст, використовуючи поле `stringData` у маніфесті Secret.

Цей маніфест є прикладом Secret для базової автентифікації:

{{% code_sample language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
Поле `stringData` для Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

Тип Secret для базової автентифікації наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для базової автентифікації. Однак використання визначеного та публічного типу Secret (`kubernetes.io/basic-auth`) допомагає іншим людям зрозуміти призначення вашого Secret та встановлює домовленості для очікуваних назв ключів.

### Secret для автентифікації SSH {#ssh-authentication-secrets}

Вбудований тип `kubernetes.io/ssh-auth` наданий для зберігання даних, що використовуються в автентифікації SSH. Під час використання цього типу Secret вам потрібно вказати пару ключ-значення `ssh-privatekey` в полі `data` (або `stringData`) як SSH-автентифікаційні дані для використання.

Цей маніфест є прикладом Secret, який використовується для автентифікації SSH з використанням пари публічного/приватного ключів:

{{% code_sample language="yaml" file="secret/ssh-auth-secret.yaml" %}}

Тип Secret для автентифікації SSH наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для автентифікації SSH. Однак використання визначеного та публічного типу Secret (`kubernetes.io/ssh-auth`) допомагає іншим людям зрозуміти призначення вашого Secret та встановлює домовленості для очікуваних назв ключів. API Kubernetes перевіряє, чи встановлені необхідні ключі для Secret цього типу.

{{< caution >}}
Приватні ключі SSH не встановлюють довіру між клієнтом SSH та хост-сервером самі по собі. Для зменшення ризику атак "man-in-the-middle" потрібен додатковий спосіб встановлення довіри, наприклад, файл `known_hosts`, доданий до ConfigMap.
{{< /caution >}}

### TLS Secrets

Тип Secret `kubernetes.io/tls` призначений для зберігання сертифіката та повʼязаного з ним ключа, які зазвичай використовуються для TLS.

Одним з поширених використань TLS Secret є налаштування шифрування під час передачі для [Ingress](/docs/concepts/services-networking/ingress/), але ви також можете використовувати його з іншими ресурсами або безпосередньо у вашому навантаженні. Під час використання цього типу Secret ключі `tls.key` та `tls.crt` повинні бути надані в полі `data` (або `stringData`) конфігурації Secret, хоча API-сервер фактично не перевіряє значення кожного ключа.

Як альтернативу використанню `stringData`, ви можете використовувати поле `data` для надання сертифіката та приватного ключа у вигляді base64-кодованого тексту. Докладніше див. [Обмеження щодо назв і даних Secret](#restriction-names-data).

Цей YAML містить приклад конфігурації TLS Secret:

{{% code_sample language="yaml" file="secret/tls-auth-secret.yaml" %}}

Тип TLS Secret наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для TLS-автентифікації. Однак використання визначеного та публічного типу Secret (`kubernetes.io/tls`) допомагає забезпечити однорідність формату Secret у вашому проєкті. API-сервер перевіряє, чи встановлені необхідні ключі для Secret цього типу.

Для створення TLS Secret за допомогою `kubectl` використовуйте підкоманду `tls`:

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

Пара публічного та приватного ключів повинна існувати заздалегідь. Сертифікат публічного ключа для `--cert` повинен бути закодований у форматі .PEM і повинен відповідати наданому приватному ключу для `--key`.

### Secrets bootstrap-токенів {#bootstrap-token-secrets}

Тип Secret `bootstrap.kubernetes.io/token` призначений для токенів, що використовуються під час процесу ініціалізації вузла. Він зберігає токени, які використовуються для підпису відомих ConfigMaps.

Secret bootstrap-токена зазвичай створюється в просторі імен `kube-system` і називається у формі `bootstrap-token-<token-id>`, де `<token-id>` — це 6-символьний рядок ідентифікатора токена.

Як маніфест Kubernetes, Secret bootstrap-токена може виглядати так:

{{% code_sample language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

У Secret bootstrap-токена вказані такі ключі в `data`:

- `token-id`: Випадковий рядок з 6 символів як ідентифікатор токена. Обовʼязковий.
- `token-secret`: Випадковий рядок з 16 символів як власне секрет токена. Обовʼязковий.
- `description`: Зрозумілий людині рядок, що описує, для чого використовується токен. Необовʼязковий.
- `expiration`: Абсолютний час UTC, відповідно до [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339), що вказує, коли має закінчитися дія токена. Необовʼязковий.
- `usage-bootstrap-<usage>`: Логічний прапорець, який вказує додаткове використання bootstrap-токена.
- `auth-extra-groups`: Розділений комами список назв груп, від імені яких відбуватиметься автентифікація на додачу до групи `system:bootstrappers`.

Ви також можете надати значення в полі `stringData` Secret без кодування в base64:

{{% code_sample language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
Поле `stringData` для Secret погано працює із застосуванням на боці сервера (server-side apply).
{{< /note >}}

## Робота з Secrets {#working-with-secrets}

### Створення Secret {#creating-a-secret}

Є кілька способів створення Secret:

- [Використання `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [Використання файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [Використання інструменту Kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

#### Обмеження щодо назв і даних Secret {#restriction-names-data}

Назва обʼєкта Secret повинна бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Ви можете вказати поля `data` і/або `stringData` під час створення файлу конфігурації для Secret. Поля `data` і `stringData` є необовʼязковими. Значення для всіх ключів у полі `data` повинні бути base64-кодованими рядками. Якщо перетворення у рядок base64 не є бажаним, ви можете вибрати поле `stringData`, яке приймає довільні рядки як значення.

Ключі `data` і `stringData` повинні складатися з буквено-цифрових символів, `-`, `_` або `.`. Усі пари ключ-значення в полі `stringData` внутрішньо обʼєднуються в поле `data`. Якщо ключ зустрічається як у полі `data`, так і у полі `stringData`, значення, вказане у полі `stringData`, має пріоритет.

#### Обмеження розміру {#restriction-data-size}

Розмір окремих Secrets обмежено 1MiB. Це зроблено для того, щоб уникнути створення дуже великих Secrets, які можуть вичерпати памʼять API-сервера та kubelet. Однак створення багатьох менших Secrets також може вичерпати памʼять. Ви можете використовувати [квоту ресурсів](/docs/concepts/policy/resource-quotas/) для обмеження кількості Secrets (або інших ресурсів) у просторі імен.

### Редагування Secret {#editing-a-secret}

Ви можете редагувати наявний Secret, якщо він не є [незмінним](#secret-immutable). Для редагування Secret скористайтеся одним із таких методів:

- [Використання `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [Використання файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

Ви також можете редагувати дані у Secret за допомогою [інструменту Kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret). Проте цей метод створює новий обʼєкт `Secret` з відредагованими даними.

Залежно від того, як ви створили Secret, а також від того, як Secret використовується у ваших Podʼах, оновлення наявних обʼєктів `Secret` автоматично поширюються на Podʼи, які використовують ці дані. Для отримання додаткової інформації звертайтеся до розділу [Використання Secrets як файлів у Podʼі](#using-secrets-as-files-from-a-pod).

### Використання Secret {#using-a-secret}

Secrets можна монтувати як томи даних або надавати як {{< glossary_tooltip text="змінні середовища" term_id="container-env-variables" >}} для використання контейнером у Podʼі. Secrets також можуть використовуватися іншими частинами системи без безпосереднього надання Podʼу. Наприклад, Secrets можуть містити автентифікаційні дані, які інші частини системи повинні використовувати для взаємодії із зовнішніми системами від вашого імені.

Джерела томів Secret перевіряються, щоб переконатися, що вказане посилання на обʼєкт дійсно вказує на обʼєкт типу Secret. Тому Secret повинен бути створений перед будь-якими Podʼами, які залежать від нього.

Якщо Secret не може бути отриманий (можливо, через те, що він не існує, або через тимчасову відсутність зʼєднання з API-сервером), kubelet періодично повторює спробу запуску цього Podʼа. Kubelet також повідомляє про подію (Event) для цього Podʼа, включаючи деталі проблеми отримання Secret.

#### Необовʼязкові Secrets {#restriction-secret-must-exist}

Коли ви посилаєтеся на Secret у Podʼі, ви можете позначити Secret як _необовʼязковий_, як у цьому прикладі. Якщо необовʼязковий Secret не існує, Kubernetes ігнорує його.

{{% code_sample language="yaml" file="secret/optional-secret.yaml" %}}

Типово Secrets є обовʼязковими. Жоден з контейнерів Podʼа не розпочне роботу, доки всі обовʼязкові Secrets не будуть доступні.

Якщо Pod посилається на певний ключ у обовʼязковому Secret і цей Secret існує, але в ньому немає зазначеного ключа, Pod завершується невдачею під час запуску.

### Використання Secrets як файлів у Podʼі {#using-secrets-as-files-from-a-pod}

Якщо ви хочете отримати доступ до даних з Secret у Podʼі, один зі способів це зробити — щоб Kubernetes зробив значення цього Secret доступним як файл у файловій системі одного або декількох контейнерів Podʼа.

Щоб це зробити, дивіться [Створення Podʼа, який має доступ до секретних даних через том](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).

Коли том містить дані з Secret, а цей Secret оновлюється, Kubernetes відстежує це і оновлює дані в томі, використовуючи підхід кінцевої узгодженості (eventually consistent).

{{< note >}}
Контейнер, який використовує Secret як том з монтуванням [subPath](/docs/concepts/storage/volumes#using-subpath), не отримує автоматичних оновлень Secret.
{{< /note >}}

Kubelet зберігає кеш поточних ключів та значень для Secrets, які використовуються у томах для Podʼів на цьому вузлі. Ви можете налаштувати спосіб, яким kubelet виявляє зміни від кешованих значень. Поле `configMapAndSecretChangeDetectionStrategy` в [конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) контролює стратегію, яку використовує kubelet. Стандартною стратегією є `Watch`.

Оновлення Secrets можуть передаватися за допомогою механізму watch API (стандартно), на основі кешу з визначеним часом життя або шляхом опитування API-сервера кластера на кожному циклі синхронізації kubelet.

Як результат, загальна затримка від моменту оновлення Secret до моменту, коли нові ключі буде спроєцьовано в Pod, може дорівнювати періоду синхронізації kubelet + затримці поширення кешу, де затримка поширення кешу залежить від обраного типу кешу (у тому самому порядку, що й у попередньому абзаці: затримка поширення watch, налаштований TTL кешу або нуль для прямого опитування).

### Використання Secrets як змінних середовища {#using-secrets-as-environment-variables}

Для використання Secret в {{< glossary_tooltip text="змінних середовища" term_id="container-env-variables" >}} в Podʼі:

1. Для кожного контейнера у вашій специфікації Podʼа додайте змінну середовища для кожного ключа Secret, який ви хочете використовувати, у поле `env[].valueFrom.secretKeyRef`.
2. Змініть свій образ і/або командний рядок так, щоб програма шукала значення у вказаних змінних середовища.

Для отримання інструкцій дивіться [Визначення змінних середовища контейнера за допомогою даних Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).

Важливо зауважити, що діапазон символів, дозволених для назв змінних середовища в Podʼах, [обмежений](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config). Якщо будь-які ключі не відповідають правилам, ці ключі не будуть доступні вашому контейнеру, хоча Pod може бути запущений.

### Secrets для завантаження образів контейнерів {#using-imagepullsecrets}

Якщо ви хочете отримувати образи контейнерів з приватного репозиторію, вам потрібен спосіб автентифікації для kubelet на кожному вузлі для доступу до цього репозиторію. Ви можете налаштувати _Secrets для завантаження образів_ для досягнення цієї мети. Ці Secrets налаштовуються на рівні Podʼа.

#### Використання imagePullSecrets {#using-imagepullsecrets-1}

Поле `imagePullSecrets` є списком посилань на Secrets у тому самому просторі імен. Ви можете використовувати `imagePullSecrets`, щоб передати Secret, який містить пароль Docker (або іншого) репозиторію образів, в kubelet. Kubelet використовує цю інформацію для завантаження приватного образу від імені вашого Podʼа. Для отримання додаткової інформації про поле `imagePullSecrets` дивіться [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

##### Вказування imagePullSecret вручну {#manually-specifying-an-imagepullsecret}

Ви можете дізнатися, як вказати `imagePullSecrets`, переглянувши документацію про [образи контейнерів](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

##### Організація автоматичного приєднання imagePullSecrets {#arranging-for-imagepullsecrets-to-be-automatically-attached}

Ви можете вручну створити `imagePullSecrets` та посилатися на них з ServiceAccount. Будь-які Podʼи, створені з цим ServiceAccount або типово з ним, отримають поле `imagePullSecrets`, встановлене відповідно до цього ServiceAccount. Дивіться [Додавання ImagePullSecrets до ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) для детального пояснення цього процесу.

### Використання Secrets зі статичними Podʼами {#restriction-static-pod}

Ви не можете використовувати ConfigMaps або Secrets зі {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}.

## Незмінні Secrets {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes дозволяє вам позначати певні Secrets (і ConfigMaps) як _незмінні_. Запобігання змінам даних наявного Secret має такі переваги:

- захищає вас від випадкових (або небажаних) оновлень, які можуть призвести до відмов застосунків
- (для кластерів, що широко використовують Secrets, — щонайменше десятки тисяч унікальних монтувань Secret у Podʼи) перехід до незмінних Secrets покращує продуктивність вашого кластера завдяки значному зменшенню навантаження на kube-apiserver. Kubelet не потрібно підтримувати [watch] для будь-яких Secrets, позначених як незмінні.

### Позначення Secret як незмінного {#secret-immutable-create}

Ви можете створити незмінний Secret, встановивши поле `immutable` в `true`. Наприклад,

```yaml
apiVersion: v1
kind: Secret
metadata: ...
data: ...
immutable: true
```

Ви також можете оновити будь-який наявний змінний Secret, щоб зробити його незмінним.

{{< note >}}
Як тільки Secret або ConfigMap позначений як незмінний, цю зміну _неможливо_ скасувати чи змінити зміст поля `data`. Ви можете тільки видалити і знову створити Secret. Наявні Podʼи зберігають точку монтування для видаленого Secret — рекомендується створити ці Podʼи заново.
{{< /note >}}

## Інформаційна безпека для Secrets {#information-security-for-secrets}

Хоча ConfigMap і Secret працюють схоже, Kubernetes застосовує додаткові заходи захисту для обʼєктів Secret.

Secrets часто містять значення різного ступеня важливості, багато з яких можуть спричинити ескалацію привілеїв у Kubernetes (наприклад, токени ServiceAccount) та у зовнішніх системах. Навіть якщо окремий застосунок може оцінити можливості Secrets, з якими очікує взаємодіяти, інші застосунки в тому самому просторі імен можуть зробити ці припущення недійсними.

Налаштування авторизації впливає на те, як можна отримати доступ до даних Secret у межах простору імен. Наприклад, надання дозволів **list** або **watch** для Secrets дозволяє субʼєкту читати всі дані Secret у цьому просторі імен, а не лише ті Secrets, на які явно посилаються його Podʼи. Обмежте доступ до мінімального набору дозволів, необхідних для роботи навантаження, і уникайте надання широких ролей, таких як `cluster-admin`, якщо це не потрібно для адміністративних цілей.

Також дивіться [документацію з авторизації](/docs/reference/access-authn-authz/rbac/).

Secret буде відправлений на вузол тільки у випадку, якщо на цьому вузлі є Pod, якому він потрібен. Для монтування Secrets у Podʼи kubelet зберігає копію даних у `tmpfs`, щоб конфіденційні дані не записувалися на постійний носій. Коли Pod, який залежить від Secret, видаляється, kubelet видаляє свою локальну копію конфіденційних даних з Secret.

У Podʼі може бути кілька контейнерів. Типово контейнери, які ви визначаєте, мають доступ тільки до стандартного ServiceAccount та повʼязаного з ним Secret. Вам потрібно явно визначити змінні середовища або відобразити том у контейнері, щоб надати доступ до будь-якого іншого Secret.

На одному вузлі можуть бути Secrets для кількох Podʼів. Проте лише ті Secrets, які запитує Pod, потенційно видимі всередині його контейнерів. Таким чином, один Pod не має доступу до Secrets іншого Podʼа.

### Налаштування доступу до Secrets за принципом найменших привілеїв {#configure-least-privilege-access-to-secrets}

Щоб посилити заходи безпеки навколо Secrets, використовуйте окремі простори імен для ізоляції доступу до змонтованих Secrets.

{{< warning >}}
Будь-які контейнери, які працюють з параметром `privileged: true` на вузлі, можуть отримати доступ до всіх Secrets, що використовуються на цьому вузлі.
{{< /warning >}}

## {{% heading "whatsnext" %}} {#whats-next}

- Для настанов щодо керування та покращення безпеки ваших Secrets перегляньте [Належні практики для Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
- Дізнайтеся, як [керувати Secrets за допомогою `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтеся, як [керувати Secrets за допомогою конфігураційного файлу](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Дізнайтеся, як [керувати Secrets за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Прочитайте [довідник API](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) для `Secret`.
