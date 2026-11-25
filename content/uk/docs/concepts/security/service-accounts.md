---
title: ServiceAccount
description: >
  Дізнайтеся про обʼєкти ServiceAccount в Kubernetes.
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"
content_type: concept
weight: 25
---

<!-- overview -->

На цій сторінці описано обʼєкт ServiceAccount у Kubernetes: як працюють ServiceAccount, сценарії використання, обмеження, альтернативи та посилання на ресурси з додатковими настановами.

<!-- body -->

## Що таке ServiceAccount? {#what-are-service-accounts}

ServiceAccount — це тип облікового запису не для людей, який у Kubernetes надає окрему ідентичність у кластері. Podʼи застосунків, системні компоненти та сутності всередині й поза кластером можуть використовувати облікові дані певного ServiceAccount, щоб ідентифікуватися як цей ServiceAccount. Така ідентичність корисна в різних ситуаціях, зокрема для автентифікації на API-сервері або реалізації політик безпеки на основі ідентичності.

ServiceAccount існують як обʼєкти ServiceAccount на API-сервері. Вони мають такі властивості:

- **Привʼязані до простору імен:** Кожен ServiceAccount привʼязаний до {{<glossary_tooltip text="простору імен" term_id="namespace">}} Kubernetes. Кожен простір імен під час створення отримує [ServiceAccount `default`](#default-service-accounts).

- **Легкі:** ServiceAccount існують у кластері й визначені в API Kubernetes. Ви можете швидко створювати ServiceAccount для виконання певних завдань.

- **Переносні:** Набір конфігурацій для складного контейнеризованого робочого навантаження може містити визначення ServiceAccount для компонентів системи. Легкість ServiceAccount та ідентичності в межах простору імен роблять конфігурації переносними.

ServiceAccount відрізняються від облікових записів користувачів, які є автентифікованими людьми в кластері. Стандартно облікові записи користувачів не існують на API-сервері Kubernetes; натомість API-сервер розглядає ідентичності користувачів як непрозорі дані. Автентифікуватися як обліковий запис користувача можна кількома способами. Деякі дистрибутиви Kubernetes можуть додавати власні API розширення для представлення облікових записів користувачів на API-сервері.

{{< table caption="Порівняння ServiceAccount і користувачів" >}}

| Опис | ServiceAccount | Користувач або група |
| --- | --- | --- |
| Розташування | API Kubernetes (обʼєкт ServiceAccount) | Зовнішнє |
| Контроль доступу | RBAC Kubernetes або інші [механізми авторизації](/docs/reference/access-authn-authz/authorization/#authorization-modules) | RBAC Kubernetes або інші механізми керування ідентичністю та доступом |
| Призначення | Робочі навантаження, автоматизація | Люди |

{{< /table >}}

### Стандартні ServiceAccount {#default-service-accounts}

Під час створення кластера Kubernetes автоматично створює обʼєкт ServiceAccount з назвою `default` для кожного простору імен у вашому кластері. ServiceAccount `default` у кожному просторі імен стандартно не мають дозволів, окрім [стандартних дозволів на виявлення API](/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings), які Kubernetes надає всім автентифікованим субʼєктам, якщо ввімкнено контроль доступу на основі ролей (RBAC). Якщо ви видалите обʼєкт ServiceAccount `default` у просторі імен, {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} замінить його новим.

Якщо ви розгортаєте Pod у просторі імен і [вручну не призначаєте Podʼу ServiceAccount](#assign-to-pod), Kubernetes призначає Podʼу ServiceAccount `default` цього простору імен.

## Сценарії використання ServiceAccount у Kubernetes {#use-cases}

Загалом ви можете використовувати ServiceAccount для надання ідентичностей у таких сценаріях:

- Вашим Podʼам потрібно взаємодіяти з API-сервером Kubernetes, наприклад у таких ситуаціях:
  - Надання доступу лише для читання до конфіденційної інформації, що зберігається в Secrets.
  - Надання [доступу між просторами імен](#cross-namespace), наприклад дозвіл Podʼу в просторі імен `example` читати, перелічувати й відстежувати обʼєкти Lease у просторі імен `kube-node-lease`.
- Вашим Podʼам потрібно взаємодіяти із зовнішнім сервісом. Наприклад, Pod робочого навантаження потребує ідентичності для комерційного хмарного API, а комерційний постачальник дозволяє налаштувати відповідні довірчі стосунки.
- [Автентифікація в приватному реєстрі образів за допомогою `imagePullSecret`](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
- Зовнішньому сервісу потрібно взаємодіяти з API-сервером Kubernetes. Наприклад, автентифікація в кластері як частина конвеєра CI/CD.
- Ви використовуєте у своєму кластері стороннє програмне забезпечення безпеки, яке покладається на ідентичність ServiceAccount різних Podʼів, щоб групувати ці Podʼи в різні контексти.

## Як використовувати ServiceAccount {#how-to-use}

Щоб скористатися ServiceAccount у Kubernetes, виконайте такі дії:

1. Створіть обʼєкт ServiceAccount за допомогою клієнта Kubernetes, такого як `kubectl`, або за допомогою маніфесту, який визначає обʼєкт.
1. Надайте дозволи обʼєкту ServiceAccount за допомогою механізму авторизації, такого як [RBAC](/docs/reference/access-authn-authz/rbac/).
1. Призначте обʼєкт ServiceAccount Podʼам під час створення Podʼа.

   Якщо ви використовуєте ідентичність із зовнішнього сервісу, [отримайте токен ServiceAccount](#get-a-token) і використовуйте його з цього сервісу.

Інструкції дивіться в розділі [Налаштування ServiceAccount для Podʼів](/docs/tasks/configure-pod-container/configure-service-account/).

### Надання дозволів ServiceAccount {#grant-permissions}

Ви можете використовувати вбудований у Kubernetes механізм [контролю доступу на основі ролей (RBAC)](/docs/reference/access-authn-authz/rbac/), щоб надавати кожному ServiceAccount мінімально потрібні дозволи. Ви створюєте *роль*, яка надає доступ, а потім *привʼязуєте* її до свого ServiceAccount. RBAC дозволяє визначити мінімальний набір дозволів, щоб дозволи ServiceAccount відповідали принципу найменших привілеїв. Podʼи, що використовують цей ServiceAccount, не отримують більше дозволів, ніж потрібно для правильної роботи.

Інструкції дивіться в розділі [Дозволи ServiceAccount](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

#### Доступ між просторами імен за допомогою ServiceAccount {#cross-namespace}

За допомогою RBAC можна дозволити ServiceAccount в одному просторі імен виконувати дії з ресурсами в іншому просторі імен кластера. Наприклад, у вас є ServiceAccount і Pod у просторі імен `dev`, і ви хочете, щоб ваш Pod бачив Jobs, що виконуються в просторі імен `maintenance`. Ви можете створити обʼєкт Role, який надає дозволи на перелік обʼєктів Job. Потім створіть обʼєкт RoleBinding у просторі імен `maintenance`, щоб привʼязати Role до обʼєкта ServiceAccount. Тепер Podʼи у просторі імен `dev` можуть отримувати перелік обʼєктів Job у просторі імен `maintenance`, використовуючи цей ServiceAccount.

### Призначення ServiceAccount Podʼу {#assign-to-pod}

Щоб призначити ServiceAccount Podʼу, встановіть поле `spec.serviceAccountName` у специфікації Podʼа. Після цього Kubernetes автоматично надає Podʼу облікові дані цього ServiceAccount. У v1.22 і новіших Kubernetes отримує короткостроковий токен з **автоматичною ротацією** через API `TokenRequest` і монтує його як [проєкційний том](/docs/concepts/storage/projected-volumes/#serviceaccounttoken).

Стандартно Kubernetes надає Podʼу облікові дані призначеного ServiceAccount, будь то ServiceAccount `default` чи вказаний вами власний ServiceAccount.

Щоб Kubernetes не додавав автоматично облікові дані вказаного ServiceAccount або ServiceAccount `default`, встановіть поле `automountServiceAccountToken` у специфікації Podʼа в `false`.

<!-- OK to remove this historical detail after Kubernetes 1.31 is released -->

У версіях до 1.22 Kubernetes надає Podʼу довгостроковий статичний токен як Secret.

#### Отримання облікових даних ServiceAccount вручну {#get-a-token}

Якщо облікові дані ServiceAccount потрібно змонтувати в нестандартне місце або вони потрібні для аудиторії, відмінної від API-сервера, скористайтеся одним із таких методів:

- [TokenRequest API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) (рекомендовано): Запитуйте короткостроковий токен ServiceAccount безпосередньо з *коду вашого застосунку*. Строк дії токена спливає автоматично, і після цього токен можна ротувати. Якщо у вас є застарілий застосунок, який не знає про Kubernetes, ви можете використати sidecar-контейнер у тому самому Podʼі, щоб отримувати ці токени й надавати їх робочому навантаженню застосунку.
- [Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection) (також рекомендовано): У Kubernetes v1.20 і новіших вкажіть у специфікації Podʼа, щоб kubelet додав токен ServiceAccount до Podʼа як *проєкційний том*. Строк дії спроєцьованих токенів спливає автоматично, а kubelet ротує токен до завершення строку дії.
- [Service Account Token Secrets](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) (не рекомендовано): Ви можете монтувати токени ServiceAccount як Secrets Kubernetes у Podʼах. Ці токени не мають строку дії й не ротуються. У версіях до v1.24 для кожного ServiceAccount автоматично створювався постійний токен. Цей метод більше не рекомендується, особливо у великому масштабі, через ризики, повʼязані зі статичними довгостроковими обліковими даними. Функціональна можливість [`LegacyServiceAccountTokenNoAutoGeneration`](/docs/reference/command-line-tools-reference/feature-gates-removed/#LegacyServiceAccountTokenNoAutoGeneration) (стандартно ввімкнена в Kubernetes з v1.24 до v1.26) не давала Kubernetes автоматично створювати ці токени для ServiceAccount. Її вилучено у v1.27, оскільки вона перейшла на стадію GA; ви все ще можете вручну створювати безстрокові токени ServiceAccount, але маєте враховувати наслідки для безпеки.

#### Обмеження аудиторій вузлів для токенів ServiceAccount {#node-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

Коли ввімкнено функціональну можливість [`ServiceAccountNodeAudienceRestriction`](/docs/reference/command-line-tools-reference/feature-gates/#ServiceAccountNodeAudienceRestriction), втулок допуску [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction) обмежує аудиторії, які kubelet може запитувати під час створення токенів ServiceAccount через API `TokenRequest`. Стандартно kubelet може запитувати токени лише для аудиторій, на які вже посилаються Podʼи на цьому вузлі (через проєкційні томи токенів ServiceAccount або запити токенів драйвера CSI). Адміністратори можуть надати kubelet доступ до додаткових аудиторій за допомогою правил RBAC із дієсловом `request-serviceaccounts-token-audience`.

Це обмеження застосовується лише до kubelet (ідентичностей вузлів) і не впливає на інших клієнтів API `TokenRequest`. Подробиці та приклади RBAC дивіться в розділі [Обмеження аудиторії токенів ServiceAccount](/docs/reference/access-authn-authz/node/#service-account-token-audience-restriction).

{{< note >}}
Для застосунків, що працюють поза вашим кластером Kubernetes, ви можете розглядати створення довгострокового токена ServiceAccount, який зберігається в Secret. Це дозволяє автентифікацію, але проєкт Kubernetes рекомендує уникати такого підходу. Довгострокові токени-предʼявники є ризиком для безпеки, оскільки після розкриття токен можна використати зловмисно. Натомість розгляньте альтернативу. Наприклад, ваш зовнішній застосунок може автентифікуватися за допомогою добре захищеного приватного ключа `та` сертифіката або власного механізму, такого як [вебхук автентифікації](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication), який ви реалізуєте самостійно.

Ви також можете використовувати TokenRequest для отримання короткострокових токенів для вашого зовнішнього застосунку.
{{< /note >}}

### Обмеження доступу до Secrets (застаріло) {#enforce-mountable-secrets}

{{< feature-state for_k8s_version="v1.32" state="deprecated" >}}

{{< note >}}
`kubernetes.io/enforce-mountable-secrets` застаріло, починаючи з Kubernetes v1.32. Використовуйте окремі простори імен, щоб ізолювати доступ до змонтованих Secrets.
{{< /note >}}

Kubernetes надає анотацію `kubernetes.io/enforce-mountable-secrets`, яку можна додати до ваших ServiceAccounts. Коли цю анотацію застосовано, Secrets цього ServiceAccount можна монтувати лише на вказані типи ресурсів, що покращує безпеку кластера.

Ви можете додати анотацію до ServiceAccount за допомогою маніфесту:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubernetes.io/enforce-mountable-secrets: "true"
  name: my-serviceaccount
  namespace: my-namespace
```

Коли цю анотацію встановлено в "true", панель управління Kubernetes гарантує, що на Secrets цього ServiceAccount поширюються певні обмеження монтування.

1. Назва кожного Secret, змонтованого як том у Podʼі, має бути в полі `secrets` ServiceAccount цього Podʼа.
1. Назва кожного Secret, на який посилається `envFrom` у Podʼі, також має бути в полі `secrets` ServiceAccount цього Podʼа.
1. Назва кожного Secret, на який посилається `imagePullSecrets` у Podʼі, також має бути в полі `secrets` ServiceAccount цього Podʼа.

Розуміючи та застосовуючи ці обмеження, адміністратори кластера можуть посилити захист і забезпечити доступ до Secrets лише для відповідних ресурсів.

## Автентифікація облікових даних ServiceAccount {#authenticating-credentials}

ServiceAccounts використовують підписані {{<glossary_tooltip term_id="jwt" text="JSON Web Tokens">}} (JWT) для автентифікації на API-сервері Kubernetes та в будь-якій іншій системі, де є довірчі стосунки. Залежно від того, як видано токен (обмежений у часі через `TokenRequest` чи застарілим механізмом із Secret), токен ServiceAccount може також мати час завершення дії, аудиторію та час, з якого токен *починає* діяти. Коли клієнт, що діє як ServiceAccount, звертається до API-сервера Kubernetes, він додає до HTTP-запиту заголовок `Authorization: Bearer <token>`. API-сервер перевіряє чинність цього токена так:

1. Перевіряє підпис токена.
1. Перевіряє, чи не закінчився строк дії токена.
1. Перевіряє, чи чинні наразі посилання на обʼєкти в твердженнях токена.
1. Перевіряє, чи чинний наразі токен.
1. Перевіряє твердження про аудиторію.

TokenRequest API створює *привʼязані токени* для ServiceAccount. Ця привʼязка повʼязана з часом життя клієнта, такого як Pod, що діє як цей ServiceAccount. Приклад схеми JWT та вмісту привʼязаного токена ServiceAccount Podʼа дивіться в розділі [Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection).

Для токенів, виданих через API `TokenRequest`, API-сервер також перевіряє, що обʼєкт, який використовує ServiceAccount, все ще існує, зіставляючи його за {{< glossary_tooltip term_id="uid" text="унікальним ідентифікатором" >}}. Для застарілих токенів, змонтованих як Secrets у Podʼах, API-сервер звіряє токен із Secret.

Докладніше про процес автентифікації дивіться в розділі [Автентифікація](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

### Автентифікація облікових даних ServiceAccount у власному коді {#authenticating-in-code}

Якщо у вас є власні сервіси, яким потрібно перевіряти облікові дані ServiceAccount Kubernetes, можна скористатися такими методами:

- [TokenReview API](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/) (рекомендовано)
- Виявлення OIDC

Проєкт Kubernetes рекомендує використовувати TokenReview API, оскільки цей метод анулює токени, привʼязані до обʼєктів API, таких як Secrets, ServiceAccounts, Podʼи або вузли, коли ці обʼєкти видаляються. Наприклад, якщо ви видалите Pod, що містить спроєцьований токен ServiceAccount, кластер негайно анулює цей токен, і TokenReview одразу завершиться невдачею. Якщо натомість використовувати перевірку OIDC, ваші клієнти й надалі вважатимуть токен дійсним, доки не настане час завершення його дії.

Ваш застосунок завжди має визначати аудиторію, яку він приймає, і перевіряти, що аудиторії токена відповідають очікуваним. Це допомагає звузити область дії токена, щоб його можна було використовувати лише у вашому застосунку й ніде більше.

## Альтернативи {#alternatives}

- Видавайте власні токени за допомогою іншого механізму, а потім використовуйте [автентифікацію за токеном через вебхук](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication), щоб перевіряти токени-предʼявники власним сервісом перевірки.
- Надавайте власні ідентичності Podʼам.
  - [Використовуйте втулок драйвера SPIFFE CSI, щоб надавати Podʼам SPIFFE SVID як пари сертифікатів X.509](https://cert-manager.io/docs/projects/csi-driver-spiffe/).
    {{% thirdparty-content single="true" %}}
  - [Використовуйте service mesh, такий як Istio, щоб надавати сертифікати Podʼам](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/).
- Автентифікуйтеся ззовні кластера на API-сервері без токенів ServiceAccount:
  - [Налаштуйте API-сервер для прийняття токенів OpenID Connect (OIDC) від вашого постачальника ідентифікації](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
  - Використовуйте ServiceAccount або облікові записи користувачів, створені у зовнішньому сервісі керування ідентичністю та доступом (IAM), наприклад у хмарного провайдера, для автентифікації у вашому кластері.
  - [Використовуйте API CertificateSigningRequest із клієнтськими сертифікатами](/docs/tasks/tls/managing-tls-in-a-cluster/).
- [Налаштуйте kubelet для отримання облікових даних з реєстру образів](/docs/tasks/administer-cluster/kubelet-credential-provider/).
- Використовуйте втулок пристроїв, щоб отримати доступ до віртуального Trusted Platform Module (TPM), який дозволяє автентифікуватися за допомогою приватного ключа.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся, як [керувати ServiceAccounts як адміністратор кластера](/docs/reference/access-authn-authz/service-accounts-admin/).
- Дізнайтеся, як [призначити ServiceAccount Podʼу](/docs/tasks/configure-pod-container/configure-service-account/).
- Прочитайте [довідку API ServiceAccount](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/).
