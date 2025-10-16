---
title: Secrets
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Управління Secret та налаштуваннями
  description: >
    Розгортайте та оновлюйте Secrets та налаштування застосунків без перебудови образу контейнера та без розкриття Secrets в конфігурації.
weight: 30
---

<!-- overview -->

Secret — це обʼєкт, який містить невелику кількість конфіденційних даних, таких як пароль, токен або ключ. Така інформація також може бути включена до специфікації {{< glossary_tooltip term_id="pod" >}} або в {{< glossary_tooltip text="образ контейнера" term_id="image" >}}. Використання Secret означає, що вам не потрібно включати конфіденційні дані у ваш код.

Оскільки Secret можуть бути створені незалежно від Podʼів, які їх використовують, існує менше ризику того, що Secret (і його дані) буде викрито під час процесу створення, перегляду та редагування Podʼів. Kubernetes та програми, які працюють у вашому кластері, також можуть вживати додаткових заходів безпеки щодо Secretʼів, наприклад, уникання запису конфіденційних даних у енергонезалежне сховище.

Secretʼи схожі на {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, але призначені для зберігання конфіденційних даних.

{{< caution >}}
Керовані Kubernetes Secretʼи, стандартно, зберігаються незашифрованими у базі даних API-сервера (etcd). Будь-хто з доступом до API може отримати або змінити Secret, так само як будь-хто з доступом до etcd. Крім того, будь-хто, хто має дозвіл на створення Podʼа у просторі імен, може використовувати цей доступ для читання будь-якого Secretʼу у цьому просторі імен; це включає і непрямий доступ, такий як можливість створення Deployment.

Щоб безпечно використовувати Secretʼи, виконайте принаймні наступні кроки:

1. [Увімкніть шифрування у стані спокою](/docs/tasks/administer-cluster/encrypt-data/) для Secret.
2. [Увімкніть або налаштуйте правила RBAC](/docs/reference/access-authn-authz/authorization/) з найменшими правами доступу до Secret.
3. Обмежте доступ до Secret для конкретних контейнерів.
4. [Розгляньте використання зовнішніх постачальників сховища для Secret](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).

Для отримання додаткових рекомендацій щодо керування та покращення безпеки ваших Secret, ознайомтесь з [Належними практиками для Secret Kubernetes](/docs/concepts/security/secrets-good-practices).
{{< /caution >}}

Дивіться [Інформаційна безпека для Secret](#information-security-for-secrets) для отримання додаткових відомостей.

<!-- body -->

## Застосування Secretʼів {#uses-for-secrets}

Ви можете використовувати Secrets для таких цілей:

- [Встановлення змінних оточення для контейнера](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [Надання облікових даних, таких як SSH-ключі або паролі, Podʼам](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [Дозвіл kubelet отримувати образи контейнера з приватних реєстрів](/docs/tasks/configure-pod-container/pull-image-private-registry/).

Панель управління Kubernetes також використовує Secretʼи; наприклад, [Secret токену реєстрації вузлів](#bootstrap-token-secrets) — це механізм, що допомагає автоматизувати реєстрацію вузлів.

### Сценарій використання: dotfiles у томі Secret {#use-case-dotfiles-in-secret-volume}

Ви можете зробити ваші дані "прихованими", визначивши ключ, який починається з крапки. Цей ключ являє собою dotfile або "прихований" файл. Наприклад, коли наступний Secret підключається до тому `secret-volume`, том буде містити один файл, з назвою `.secret-file`, і контейнер `dotfile-test-container` матиме цей файл присутнім у шляху `/etc/secret-volume/.secret-file`.

{{< note >}}
Файли, які починаються з крапок, приховані від виводу `ls -l`; для того, щоб побачити їх під час перегляду вмісту теки використовуйте `ls -la`.
{{< /note >}}

{{% code language="yaml" file="secret/dotfile-secret.yaml" %}}

### Сценарій використання: Secret видимий для одного контейнера в Pod {#use-case-secret-visible-to-one-container-in-a-pod}

Припустимо, що у вас є програма, яка потребує обробки HTTP-запитів, виконання складної бізнес-логіки та підписування деяких повідомлень HMAC. Оскільки у неї складна логіка застосунків, може бути непоміченою вразливість на віддалене читання файлів з сервера, що може дати доступ до приватного ключа зловмиснику.

Це можна розділити на два процеси у двох контейнерах: контейнер інтерфейсу, який обробляє взаємодію з користувачем та бізнес-логіку, але не може бачити приватний ключ; і контейнер що перевіряє підписи, який може бачити приватний ключ, та відповідає на прості запити на підпис від фронтенду (наприклад, через мережу localhost).

З цим розділеним підходом зловмиснику зараз потрібно обманути сервер застосунків, щоб зробити щось досить довільне, що може бути складніше, ніж змусити його прочитати файл.

### Альтернативи Secretʼам {#alternatives-to-secrets}

Замість використання Secret для захисту конфіденційних даних, ви можете вибрати з альтернатив.

Ось деякі з варіантів:

- Якщо ваш хмарно-орієнтований компонент потребує автентифікації від іншого застосунку, який, ви знаєте, працює в межах того ж кластера Kubernetes, ви можете використовувати   [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens) та його токени, щоб ідентифікувати вашого клієнта.
- Існують сторонні інструменти, які ви можете запускати, як в межах, так і поза вашим кластером, які керують чутливими даними. Наприклад, Service, до якого Podʼи мають доступ через HTTPS, який використовує Secret, якщо клієнт правильно автентифікується (наприклад, з токеном ServiceAccount).
- Для автентифікації ви можете реалізувати спеціальний підписувач для сертифікатів X.509, і використовувати [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/), щоб дозволити цьому спеціальному підписувачу видавати сертифікати Podʼам, які їх потребують.
- Ви можете використовувати [втулок пристрою](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/), щоб використовувати апаратне забезпечення шифрування, яке локалізоване на вузлі, для певного Podʼа. Наприклад, ви можете розмістити довірені Podʼи на вузлах, які надають Trusted Platform Module.

Ви також можете комбінувати два або більше з цих варіантів, включаючи варіант використання Secret самостійно.

Наприклад: реалізуйте (або розгорніть) {{< glossary_tooltip text="оператор" term_id="operator-pattern" >}}, що отримує тимчасові токени сеансів від зовнішнього Service, а потім створює Secretʼи на основі цих тимчасових токенів. Podʼи, що працюють у вашому кластері, можуть використовувати токени сеансів, а оператор забезпечує їхню дійсність. Це розподілення означає, що ви можете запускати Podʼи, які не знають точних механізмів створення та оновлення цих токенів сеансів.

## Типи Secret {#secret-types}

При створенні Secret ви можете вказати його тип, використовуючи поле `type` ресурсу [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/), або певні еквівалентні прапорці командного рядка `kubectl` (якщо вони доступні). Тип Secret використовується для сприяння програмному обробленню даних Secret.

Kubernetes надає кілька вбудованих типів для деяких типових сценаріїв використання. Ці типи відрізняються за умовами перевірки та обмеженнями, які Kubernetes накладає на них.

| Вбудований Тип                        | Використання                            |
| ------------------------------------- |---------------------------------------- |
| `Opaque`                              | довільні користувацькі дані           |
| `kubernetes.io/service-account-token` | токен ServiceAccount        |
| `kubernetes.io/dockercfg`             | серіалізований файл `~/.dockercfg`     |
| `kubernetes.io/dockerconfigjson`      | серіалізований файл `~/.docker/config.json` |
| `kubernetes.io/basic-auth`            | облікові дані для базової автентифікації |
| `kubernetes.io/ssh-auth`              | облікові дані для SSH автентифікації  |
| `kubernetes.io/tls`                   | дані для TLS клієнта або сервера       |
| `bootstrap.kubernetes.io/token`       | дані bootstrap token                    |

Ви можете визначити та використовувати власний тип Secret, присвоївши непорожній рядок як значення `type` обʼєкту Secret (порожній рядок розглядається як тип `Opaque`).

Kubernetes не накладає жодних обмежень на назву типу. Однак, якщо ви використовуєте один з вбудованих типів, ви повинні задовольнити всі вимоги, визначені для цього типу.

Якщо ви визначаєте тип Secret, призначений для загального використання, дотримуйтесь домовленостей та структуруйте тип Secret так, щоб він мав ваш домен перед назвою, розділений знаком `/`. Наприклад: `cloud-hosting.example.net/cloud-api-credentials`.

### Opaque Secrets

`Opaque` — це стандартний тип Secret, якщо ви не вказуєте явно тип у маніфесті Secret. При створенні Secret за допомогою `kubectl` вам потрібно використовувати команду `generic`, щоб вказати тип Secret `Opaque`. Наприклад, наступна команда створює порожній Secret типу `Opaque`:

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

Вивід виглядає наступним чином:

```none
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

У стовпчику `DATA` показується кількість елементів даних, збережених у Secret. У цьому випадку `0` означає, що ви створили порожній Secret.

### Secret токенів ServiceAccount {#serviceaccount-token-secrets}

Тип Secret `kubernetes.io/service-account-token` використовується для зберігання
токену, який ідентифікує {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}. Це старий механізм, який забезпечує довгострокові облікові дані ServiceAccount для Podʼів.

У Kubernetes v1.22 та пізніших рекомендований підхід полягає в тому, щоб отримати короткостроковий, токен ServiceAccount який автоматично змінюється за допомогою API [`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/ token-request-v1/) замість цього. Ви можете отримати ці короткострокові токени, використовуючи наступні методи:

- Викликайте API `TokenRequest` або використовуйте клієнт API, такий як `kubectl`. Наприклад, ви можете використовувати команду [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-).
- Запитуйте монтований токен в [томі projected](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume) у вашому маніфесті Podʼа. Kubernetes створює токен і монтує його в Pod. Токен автоматично анулюється, коли Pod, в якому він монтується, видаляється. Докладні відомості див. в розділі [Запуск Podʼа за допомогою токена ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection).

{{< note >}}
Ви повинні створювати Secret токена ServiceAccount лише в тому випадку, якщо ви не можете використовувати API `TokenRequest` для отримання токена, і вам прийнятно з погляду безпеки зберігання постійного токена доступу у читабельному обʼєкті API. Для інструкцій див. [Створення довгострокового API-токена для ServiceAccount вручну](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).
{{< /note >}}

При використанні цього типу Secret вам потрібно переконатися, що анотація `kubernetes.io/service-account.name` встановлена на наявне імʼя ServiceAccount. Якщо ви створюєте як Secret, так і обʼєкти ServiceAccount, ви повинні спочатку створити обʼєкт ServiceAccount.

Після створення Secret {{< glossary_tooltip text="контролер" term_id="controller" >}} Kubernetes заповнює деякі інші поля, такі як анотація `kubernetes.io/service-account.uid`, та ключ `token` в полі `data`, який заповнюється токеном автентифікації.

У наступному прикладі конфігурації оголошується Secret токена ServiceAccount:

{{% code language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

Після створення Secret дочекайтеся, коли Kubernetes заповнить ключ `token` в полі `data`.

Для отримання додаткової інформації про роботу ServiceAccounts перегляньте документацію по [ServiceAccount](/docs/concepts/security/service-accounts/). Ви також можете перевірити поле `automountServiceAccountToken` та поле `serviceAccountName` у [`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) для отримання інформації про посилання на облікові дані ServiceAccount з Podʼів.

### Secret конфігурації Docker {#docker-config-secrets}

Якщо ви створюєте Secret для зберігання облікових даних для доступу до реєстру образів контейнерів, ви повинні використовувати одне з наступних значень `type` для цього Secret:

- `kubernetes.io/dockercfg`: збереже серіалізований `~/.dockercfg`, який є старим форматом налаштування командного рядка Docker. У полі `data` Secret міститься ключ `.dockercfg`, значення якого — це вміст файлу `~/.dockercfg`, закодованого у форматі base64.
- `kubernetes.io/dockerconfigjson`: збереже серіалізований JSON, який слідує тим же правилам формату, що й файл `~/.docker/config.json`, який є новим форматом для `~/.dockercfg`. У полі `data` Secret має міститися ключ `.dockerconfigjson`, значення якого – це вміст файлу `~/.docker/config.json`, закодованого у форматі base64.

Нижче наведено приклад для Secret типу `kubernetes.io/dockercfg`:

{{% code language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
Якщо ви не хочете виконувати кодування у формат base64, ви можете вибрати використання поля `stringData` замість цього.
{{< /note >}}

При створенні Secret конфігурації Docker за допомогою маніфесту, API сервер перевіряє, чи існує відповідний ключ у полі `data`, і перевіряє, чи надане значення можна розпізнати як дійсний JSON. API сервер не перевіряє, чи є цей JSON фактично файлом конфігурації Docker.

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

Вихід еквівалентний наступному JSON-документу (який також є дійсним файлом конфігурації Docker):

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
Значення `auth` закодовано у формат base64; воно зашифроване, але не є Secretним. Будь-хто, хто може прочитати цей Secret, може дізнатися токен доступу до реєстру.

Рекомендується використовувати [постачальників облікових записів](/docs/tasks/administer-cluster/kubelet-credential-provider/) для динамічного і безпечного надання Secretʼів на запит.
{{< /caution >}}

### Secret базової автентифікації {#basic-authentication-secret}

Тип `kubernetes.io/basic-auth` наданий для зберігання облікових даних, необхідних для базової автентифікації. При використанні цього типу Secret, поле `data` Secret повинно містити один з двох наступних ключів:

- `username`: імʼя користувача для автентифікації
- `password`: пароль або токен для автентифікації

Обидва значення для цих ключів закодовані у формат base64. Ви також можете надати чіткий текст, використовуючи поле `stringData` у маніфесті Secret.

Наступний маніфест є прикладом Secret для базової автентифікації:

{{% code language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
Поле `stringData` для Secret не дуже підходить для застосування на боці сервера.
{{< /note >}}

Тип Secret для базової автентифікації наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для базової автентифікації. Однак використання визначеного та публічного типу Secret (`kubernetes.io/basic-auth`) допомагає іншим людям зрозуміти призначення вашого Secret та встановлює домовленості для очікуваних назв ключів.

### Secret для автентифікації SSH {#ssh-authentication-secrets}

Вбудований тип `kubernetes.io/ssh-auth` наданий для зберігання даних, що використовуються в автентифікації SSH. При використанні цього типу Secret, вам потрібно вказати пару ключ-значення `ssh-privatekey` в полі `data` (або `stringData`) як SSH-автентифікаційні дані для використання.

Наступний маніфест є прикладом Secret, який використовується для автентифікації SSH з використанням пари публічного/приватного ключів:

{{% code language="yaml" file="secret/ssh-auth-secret.yaml" %}}

Тип Secret для автентифікації SSH наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для автентифікації SSH. Однак використання визначеного та публічного типу Secret (`kubernetes.io/ssh-auth`) допомагає іншим людям зрозуміти призначення вашого Secret та встановлює домовленості для очікуваних назв ключів. API Kubernetes перевіряє, чи встановлені необхідні ключі для Secret цього типу.

{{< caution >}}
Приватні ключі SSH не встановлюють довіру між клієнтом SSH та сервером хосту самі по собі. Для зменшення ризику атак "man-in-the-middle" потрібен додатковий спосіб встановлення довіри, наприклад, файл `known_hosts`, доданий до ConfigMap.
{{< /caution >}}

### TLS Secrets

Тип Secret `kubernetes.io/tls` призначений для зберігання сертифіката та його повʼязаного ключа, які зазвичай використовуються для TLS.

Одним з поширених використань TLS Secret є налаштування шифрування під час передачі для
[Ingress](/docs/concepts/services-networking/ingress/), але ви також можете використовувати його з іншими ресурсами або безпосередньо у вашій роботі. При використанні цього типу Secret ключі `tls.key` та `tls.crt` повинні бути надані в полі `data` (або `stringData`) конфігурації Secret, хоча сервер API фактично не перевіряє значення кожного ключа.

Як альтернативу використанню `stringData`, ви можете використовувати поле `data` для надання сертифіката та приватного ключа у вигляді base64-кодованого тексту. Докладніше див. [Обмеження для назв і даних Secret](#restriction-names-data).

Наступний YAML містить приклад конфігурації TLS Secret:

{{% code language="yaml" file="secret/tls-auth-secret.yaml" %}}

Тип TLS Secret наданий лише для зручності. Ви можете створити тип `Opaque` для облікових даних, які використовуються для TLS-автентифікації. Однак використання визначеного та публічного типу Secret (`kubernetes.io/tls`) допомагає забезпечити однорідність формату Secret у вашому проєкті. Сервер API перевіряє, чи встановлені необхідні ключі для Secret цього типу.

Для створення TLS Secret за допомогою `kubectl` використовуйте підкоманду `tls`:

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

Пара публічного/приватного ключа повинна бути створена заздалегідь. Публічний ключ сертифіката для `--cert` повинен бути закодований у .PEM форматі і повинен відповідати наданому приватному ключу для `--key`.

### Secret bootstrap-токенів {#bootstrap-token-secrets}

Тип Secret `bootstrap.kubernetes.io/token` призначений для токенів, що використовуються під час процесу ініціалізації вузла. Він зберігає токени, які використовуються для підпису відомих ConfigMaps.

Secret токена ініціалізації зазвичай створюється в просторі імен `kube-system` і називається у формі `bootstrap-token-<token-id>`, де `<token-id>` — це 6-символьний
рядок ідентифікатора токена.

Як Kubernetes маніфест, Secret токена ініціалізації може виглядати наступним чином:

{{% code language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

У Secret токена ініціалізації вказані наступні ключі в `data`:

- `token-id`: Випадковий рядок з 6 символів як ідентифікатор токена. Обовʼязковий.
- `token-secret`: Випадковий рядок з 16 символів як сам Secret токена. Обовʼязковий.
- `description`: Рядок, що призначений для користувачів, що описує, для чого використовується токен. Необовʼязковий.
- `expiration`: Абсолютний час UTC, відповідно до [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339), що вказує, коли дія токена має бути закінчена. Необовʼязковий.
- `usage-bootstrap-<usage>`: Логічний прапорець, який вказує додаткове використання для
  токена ініціалізації.
- `auth-extra-groups`: Список імен груп, розділених комами, які будуть автентифікуватися як додатково до групи `system:bootstrappers`.

Ви також можете надати значення в полі `stringData` Secret без їх base64 кодування:

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
Поле `stringData` для Secret погано працює на боці сервера.
{{< /note >}}

## Робота з Secret {#working-with-secrets}

### Створення Secret {#creating-a-secrets}

Є кілька способів створення Secret:

- [Використання `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [Використання файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [Використання інструменту Kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

#### Обмеження щодо імен і даних Secret {#restriction-names-data}

Імʼя обʼєкта Secret повинно бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Ви можете вказати поля `data` і/або `stringData` при створенні файлу конфігурації для Secret. Поля `data` і `stringData` є необовʼязковими. Значення для всіх ключів у полі `data` повинні бути base64-кодованими рядками. Якщо перетворення у рядок base64 не є бажаним, ви можете вибрати поле `stringData`, яке приймає довільні рядки як значення.

Ключі `data` і `stringData` повинні складатися з буквено-цифрових символів, `-`, `_` або `.`. Усі пари ключ-значення в полі `stringData` внутрішньо обʼєднуються в поле `data`. Якщо ключ зустрічається як у полі `data`, так і у полі `stringData`, значення, вказане у полі `stringData`, має пріоритет.

#### Обмеження розміру {#restriction-data-size}

Індивідуальні Secretʼи обмежені розміром 1 МБ. Це зроблено для того, щоб уникнути створення дуже великих Secret, які можуть вичерпати памʼять API-сервера та kubelet. Однак створення багатьох менших Secret також може вичерпати памʼять. Ви можете використовувати [квоту ресурсів](/docs/concepts/policy/resource-quotas/) для обмеження кількості Secret (або інших ресурсів) в просторі імен.

### Редагування Secret {#editing-a-secret}

Ви можете редагувати наявний Secret, якщо він не є [незмінним](#secret-immutable). Для редагування Secret скористайтеся одним із наступних методів:

- [Використання `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [Використання файлу конфігурації](/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

Ви також можете редагувати дані у Secret за допомогою [інструменту Kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret). Проте цей метод створює новий обʼєкт `Secret` з відредагованими даними.

Залежно від того, як ви створили Secret, а також від того, як Secret використовується в ваших Podʼах, оновлення існуючих обʼєктів `Secret` автоматично поширюються на Podʼи, які використовують дані. Для отримання додаткової інформації звертайтеся до розділу [Використання Secret як файлів у Podʼі](#using-secrets-as-files-from-a-pod).

### Використання Secret {#using-a-secret}

Secret можна монтувати як томи даних або використовувати як {{< glossary_tooltip text="змінні оточення" term_id="container-env-variables" >}} для використання контейнером в Podʼі. Secret також можна використовувати іншими частинами системи, не надаючи прямого доступу до Podʼа. Наприклад, Secret можуть містити автентифікаційні дані, які інші частини системи повинні використовувати для взаємодії зовнішніми системами від вашого імені.

Джерела томів Secret перевіряються на наявність для того, щоб переконатися, що вказано посилання на обʼєкт дійсно вказує на обʼєкт типу Secret. Тому Secret повинен бути створений перед будь-якими Podʼами, які залежать від нього.

Якщо Secret не може бути отриманий (можливо, через те, що він не існує, або через тимчасову відсутність зʼєднання з сервером API), kubelet періодично повторює спробу запуску цього Podʼа. Крім того, kubelet також реєструє подію для цього Podʼа, включаючи деталі проблеми отримання Secret.

#### Необовʼязкові Secret {#restriction-secret-must-exist}

Коли ви посилаєтеся на Secret у Podʼі, ви можете позначити Secret як _необовʼязковий_, як у наступному прикладі. Якщо необовʼязковий Secret не існує, Kubernetes ігнорує його.

{{% code language="yaml" file="secret/optional-secret.yaml" %}}

Типово Secret є обовʼязковими. Жоден з контейнерів Podʼа не розпочне роботу, доки всі обовʼязкові Secret не будуть доступні.

Якщо Pod посилається на певний ключ у необовʼязковому Secret і цей Secret існує, але відсутній зазначений ключ, Pod не запускається під час старту.

### Використання Secret у вигляді файлів у Pod {#using-secrets-as-files-from-a-pod}

Якщо ви хочете отримати доступ до даних з Secret у Podʼі, один із способів зробити це — це дозволити Kubernetes робити значення цього Secret доступним як файл у файловій системі одного або декількох контейнерів Podʼа.

Щоб це зробити, дивіться [Створення Podʼа, який має доступ до секретних даних через Volume](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).

Коли том містить дані з Secret, а цей Secret оновлюється, Kubernetes відстежує це і оновлює дані в томі, використовуючи підхід з подальшою згодою.

{{< note >}}
Контейнер, який використовує Secret як том [subPath](/docs/concepts/storage/volumes#using-subpath), не отримує автоматичних оновлень Secret.
{{< /note >}}

Kubelet зберігає кеш поточних ключів та значень для Secret, які використовуються у томах для Podʼів на цьому вузлі. Ви можете налаштувати спосіб, яким kubelet виявляє зміни від кешованих значень. Поле `configMapAndSecretChangeDetectionStrategy` в [конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) контролює стратегію, яку використовує kubelet. Стандартною стратегією є `Watch`.

Оновлення Secret можуть бути передані за допомогою механізму спостереження за API (стандартно), на основі кешу з визначеним часом життя або отримані зі API-сервера кластера в кожнному циклі синхронізації kubelet.

Як результат, загальна затримка від моменту оновлення Secret до моменту, коли нові ключі зʼявляються в Podʼі, може бути такою ж тривалою, як період синхронізації kubelet + затримка розповсюдження кешу, де затримка розповсюдження кешу залежить від обраного типу кешу (перший у списку це затримка розповсюдження спостереження, налаштований TTL кешу або нуль для прямого отримання).

### Використання Secret як змінних оточення {#using-secrets-as-environment-variables}

Для використання Secret в {{< glossary_tooltip text="змінних оточення" term_id="container-env-variables" >}} в Podʼі:

1. Для кожного контейнера у вашому описі Podʼа додайте змінну оточення для кожного ключа Secret, який ви хочете використовувати, у поле `env[].valueFrom.secretKeyRef`.
2. Змініть свій образ і/або командний рядок так, щоб програма шукала значення у вказаних змінних оточення.

Для отримання інструкцій дивіться [Визначення змінних оточення контейнера за допомогою даних Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).

Важливо зауважити, що діапазон символів, дозволених для назв змінних середовища в Podʼах, [обмежений](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config). Якщо будь-які ключі не відповідають правилам, ці ключі не будуть доступні вашому контейнеру, хоча Pod може бути запущений.

### Використання Secret для витягування образів контейнерів {#using-imagepullsecrets}

Якщо ви хочете отримувати образи контейнерів з приватного репозиторію, вам потрібен спосіб автентифікації для kubelet на кожному вузлі для доступу до цього репозиторію. Ви можете налаштувати _Secret для витягування образів_ для досягнення цієї мети. Ці Secret налаштовані на рівні Pod.

#### Використання imagePullSecrets {#using-imagepullsecrets}

Поле `imagePullSecrets` є списком посилань на Secret в тому ж просторі імен. Ви можете використовувати `imagePullSecrets`, щоб передати Secret, який містить пароль Docker (або іншого) репозиторію образів, в kubelet. Kubelet використовує цю інформацію для витягування приватного образу від імені вашого Podʼа. Для отримання додаткової інформації про поле `imagePullSecrets`, дивіться [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

##### Ручне вказання imagePullSecret {#manually-specifying-an-imagepullsecret}

Ви можете дізнатися, як вказати `imagePullSecrets`, переглянувши документацію про [образи контейнерів](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

##### Організація автоматичного приєднання imagePullSecrets {#arranging-for-imagepullsecrets-to-be-automaticaly-attached}

Ви можете вручну створити `imagePullSecrets` та посилатися на них з ServiceAccount. Будь-які Podʼи, створені з цим ServiceAccount або створені з цим ServiceAccount, отримають своє поле `imagePullSecrets`, встановлене на відповідне для сервісного облікового запису. Дивіться [Додавання ImagePullSecrets до Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) для детального пояснення цього процесу.

### Використання Secret зі статичними Podʼами {#restriction-static-pod}

Ви не можете використовувати ConfigMaps або Secrets зі {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}.

## Незмінні Secret {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes дозволяє вам позначати певні Secret (і ConfigMaps) як _незмінні_. Запобігання змінам даних існуючого Secret має наступні переваги:

- захищає вас від випадкових (або небажаних) оновлень, які можуть призвести до відмов застосунків
- (для кластерів, що широко використовують Secret — щонайменше десятки тисяч унікальних монтувань Secret у Podʼи), перехід до незмінних Secret покращує продуктивність вашого кластера шляхом значного зменшення навантаження на kube-apiserver. kubeletʼу не потрібно підтримувати [watch] за будь-якими Secret, які позначені як незмінні.

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
Як тільки Secret або ConfigMap позначений як незмінний, цю зміну _неможливо_ скасувати чи змінити зміст поля `data`. Ви можете тільки видалити і знову створити Secret. Наявні Podʼи зберігають точку монтування для видаленого Secret — рекомендується перестворити ці Podʼи.
{{< /note >}}

## Інформаційна безпека для Secret {#information-security-for-secrets}

Хоча ConfigMap і Secret працюють схоже, Kubernetes застосовує додаткові заходи захисту для обʼєктів Secret.

Secret часто містять значення, які охоплюють широкий спектр важливостей, багато з яких можуть викликати ескалації всередині Kubernetes (наприклад, токени службових облікових записів) та зовнішніх систем. Навіть якщо окремий застосунок може мати на меті використання Secret, з якими він очікує взаємодіяти, інші застосунки в тому ж просторі імен можуть зробити ці припущення недійсними.

Secret буде відправлений на вузол тільки у випадку, якщо на цьому вузлі є Pod, якому він потрібен. Для монтування Secret Podʼи kubelet зберігає копію даних у `tmpfs`, щоб конфіденційні дані не записувалися у носії з довгостроковим зберіганням. Коли Pod, який залежить від Secret, видаляється, kubelet видаляє свою локальну копію конфіденційних даних з Secret.

У Podʼі може бути кілька контейнерів. Типово контейнери, які ви визначаєте, мають доступ тільки до службового стандартного облікового запису та повʼязаного з ним Secret. Вам потрібно явно визначити змінні середовища або відобразити том у контейнері, щоб надати доступ до будь-якого іншого Secret.

Може бути Secret для кількох Podʼів на тому ж вузлі. Проте тільки Secretʼи, які запитує Pod, можливо бачити всередині його контейнерів. Таким чином, один Pod не має доступу до Secretʼів іншого Podʼа.

### Налаштування доступу за принципом найменшого дозволу до Secret {#configuring-least-privilege-access-to-secrets}

Щоб посилити заходи безпеки навколо Secrets, використовуйте окремі простори імен для ізоляції доступу до змонтованих секретів.

{{< warning >}}
Будь-які контейнери, які працюють з параметром `privileged: true` на вузлі, можуть отримати доступ до всіх Secret, що використовуються на цьому вузлі.
{{< /warning >}}

## {{% heading "whatsnext" %}}

- Для настанов щодо керування та покращення безпеки ваших Secret перегляньте [Рекомендаціх щодо Secret в Kubernetes](/docs/concepts/security/secrets-good-practices).
- Дізнайтеся, як [керувати Secret за допомогою `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Дізнайтеся, як [керувати Secret за допомогою конфігураційного файлу](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Дізнайтеся, як [керувати Secret за допомогою kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Прочитайте [довідник API](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) для `Secret`.
