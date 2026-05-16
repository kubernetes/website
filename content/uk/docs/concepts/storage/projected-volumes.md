---
title: Projected томи
content_type: concept
weight: 21 # одразу після постійних томів
---

<!-- overview -->

У цьому документі описано _спроєцьовані томи_ в Kubernetes. Рекомендується ознайомитися з [томами](/docs/concepts/storage/volumes/) для кращого розуміння.

<!-- body -->

## Вступ {#introduction}

Том `projected` відображає кілька наявних джерел томів в одну теку.

Зараз наступні типи джерел томів можуть бути спроєцьовані:

* [`secret`](/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/docs/concepts/storage/volumes/#configmap)
* [`serviceAccountToken`](#serviceaccounttoken)
* [`clusterTrustBundle`](#clustertrustbundle)
* [`podCertificate`](#podcertificate)

Всі джерела повинні бути в тому ж просторі імен, що й Pod. Для отримання додаткових відомостей дивіться документ з дизайну [все-в-одному томі](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).

### Приклад конфігурації з secret, downwardAPI та configMap {#example-configuration-secret-downwardapi-configmap}

{{% code_sample file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

### Приклад конфігурації: secret з встановленим нестандартним режимом дозволу {#example-configuration-secrets-nondefault-permission-mode}

{{% code_sample file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" %}}

Кожне спроєцьоване джерело тому перераховане в специфікації в розділі `sources`. Параметри майже такі ж, за винятком двох пунктів:

* Для секретів поле `secretName` було змінено на `name`, щоб бути послідовним з назвою ConfigMap.
* `defaultMode` можна вказати тільки на рівні спроєцьованого тому, а не для кожного джерела тому. Однак, як показано вище, ви можете явно встановити `mode` для кожної окремої проєкції.

## Спроєцьовані томи serviceAccountToken {#serviceaccounttoken}

Ви можете впровадити токен для поточного [service accountʼу](/docs/reference/access-authn-authz/authentication/#service-account-tokens) в Pod за вказаним шляхом. Наприклад:

{{% code_sample file="pods/storage/projected-service-account-token.yaml" %}}

Pod в прикладі має project том, що містить впроваджений токен service account. Контейнери в цьому Pod можуть використовувати цей токен для доступу до сервера API Kubernetes, автентифікуючись за відомостями [service accountʼу Pod](/docs/tasks/configure-pod-container/configure-service-account/). Поле `audience` містить призначену аудиторію токена. Отримувач токена повинен ідентифікувати себе за ідентифікатором, вказаним в аудиторії токена, інакше він повинен відхилити токен. Це поле є необовʼязковим, але стандартним для ідентифікації в API сервері.

Поле `expirationSeconds` містить час, через який токен стане недійсним. Типовим є час в одну годину, але він має бути принаймні 10 хвилин (600 секунд). Адміністратор може обмежити максимальне значення вказавши параметр `--service-account-max-token-expiration` в API сервері. Поле `path` містить відносний шлях до точки монтування тому.

{{< note >}}
Контейнер, що використовує джерела project томів як [`subPath`](/docs/concepts/storage/volumes/#using-subpath) для монтування тому не отримуватиме оновлення для цих джерел.
{{< /note >}}

## Спроєцьовані томи clusterTrustBundle {#clustertrustbundle}

{{< feature-state feature_gate_name="ClusterTrustBundleProjection" >}}

{{< note >}}
Для використання цієї функції в Kubernetes {{ skew currentVersion }} вам потрібно увімкнути підтримку обʼєктів ClusterTrustBundle з [функціональною можливістю](/docs/reference/command-line-tools-reference/feature-gates/) `ClusterTrustBundle` та прапорцем `--runtime-config=certificates.k8s.io/v1beta1/clustertrustbundles=true` в kube-apiserver, а потім увімкнути функцію `ClusterTrustBundleProjection`.
{{< /note >}}

Спроєцьований том `clusterTrustBundle` дозволяє впроваджувати контент одного чи більше обʼєктів [ClusterTrustBundle](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles) як автоматично оновлюваний файл у файловій системі контейнера.

ClusterTrustBundle може бути обраний за допомогою [name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked) або [signer name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked).

Для вибору за імʼям використовуйте поле `name`, щоб вказати один обʼєкт ClusterTrustBundle.

Для вибору за імʼям підписанта використовуйте поле `signerName` (і, за необхідності, поле `labelSelector`), щоб вказати набір обʼєктів ClusterTrustBundle, які використовують задане імʼя підписанта. Якщо `labelSelector` відсутнє, то вибираються всі ClusterTrustBundle для цього підписанта.

Kubelet виконує відсіювання дублікатів сертифікатів у вибраних обʼєктах ClusterTrustBundle, нормалізує представлення PEM (видаляючи коментарі та заголовки), перегруповує сертифікати та записує їх у файл, вказаний полем `path`. При зміні набору вибраних обʼєктів ClusterTrustBundle або їх вмісту kubelet підтримує актуальність файлу.

Типово kubelet запобігає запуску Podʼа, якщо заданий обʼєкт ClusterTrustBundle не знайдено, або якщо `signerName` / `labelSelector` не відповідає жодному обʼєкту ClusterTrustBundle. Якщо ця поведінка не відповідає вашим вимогам, встановіть поле `optional` в `true`, і Pod буде запущено з порожнім файлом за шляхом `path`.

{{% code_sample file="pods/storage/projected-clustertrustbundle.yaml" %}}

## Спроєцьовані томи podCertificate {#podcertificate}

{{< feature-state feature_gate_name="PodCertificateRequest" >}}

{{< note >}}
В Kubernetes {{< skew currentVersion >}}, ви повинні увімкнути підтримку Pod Certificates, використовуючи [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `PodCertificateRequest` та прапорець `--runtime-config=certificates.k8s.io/v1beta1/podcertificaterequests=true` kube-apiserver.
{{< /note >}}

Спроєцьовані томи `podCertificate` забезпечують безпечне надання приватного ключа та ланцюга сертифікатів X.509 для використання Podʼом як клієнтських, так і серверних облікових даних. Kubelet потім обробляє оновлення приватного ключа та ланцюга сертифікатів, коли вони наближаються до закінчення терміну дії. Застосунку просто потрібно переконатися, що він своєчасно перезавантажує файл, коли він змінюється, за допомогою механізму, такого як `inotify` або опитування.

Кожна проєкція `podCertificate` підтримує такі конфігураційні поля:

* `signerName`: [підписувач](/docs/reference/access-authn-authz/certificate-signing-requests#signers), який ви хочете використовувати для видачі сертифіката. Зверніть увагу, що підписувачі можуть мати свої власні вимоги до доступу і можуть відмовитися видавати сертифікати вашому Podʼу.
* `keyType`: Тип приватного ключа, який повинен бути згенерований. Дійсні значення: `ED25519`, `ECDSAP256`, `ECDSAP384`, `ECDSAP521`, `RSA3072` і `RSA4096`.
* `maxExpirationSeconds`: Максимальний термін дії, який ви приймете для сертифіката, виданого Podʼу. Якщо не вказано, стандартно це буде `86400` (24 години). Повинен бути не менше `3600` (1 година) і не більше `7862400` (91 день). Вбудовані підписувачі Kubernetes обмежені максимальним терміном дії `86400` (1 день). Підписувач має право видати сертифікат з терміном дії, коротшим за вказаний вами.
* `credentialBundlePath`: Відносний шлях у межах проєкції, куди має бути записаний пакет облікових даних. Пакет облікових даних — це файл у форматі PEM, де перший блок — це блок "PRIVATE KEY", що містить приватний ключ у форматі PKCS#8, а решта блоків — це блоки "CERTIFICATE", які складають ланцюг сертифікатів (сертифікат листа та будь-які проміжні сертифікати).
* `keyPath` і `certificateChainPath`: Окремі шляхи, куди Kubelet має записати _тільки_ приватний ключ або ланцюг сертифікатів.
* `userAnnotations`: мапа, яка дозволяє передавати додаткову інформацію до реалізації підписувача. Вона копіюється дослівно в поле `spec.unverifiedUserAnnotations` об'єктів [PodCertificateRequest](/docs/reference/access-authn-authz/certificate-signing-requests#pod-certificate-requests), яке створює Kubelet. Записи підлягають тій самій перевірці, що й анотації метаданих обʼєкта, з тим доповненням, що всі ключі повинні мати префікс домену. На значення не накладаються жодні обмеження, крім загального обмеження розміру всього поля. Окрім цих базових перевірок, сервер API не проводить жодних додаткових перевірок. Реалізації підписувача повинні бути дуже обережними при використанні цих даних. Підписувачі не повинні довіряти цим даним без попереднього виконання відповідних кроків перевірки. Підписувачі повинні документувати ключі та значення, які вони підтримують. Підписувачі повинні відхиляти запити, що містять ключі, які вони не розпізнають.

{{< note >}}

Більшість застосунків повинні віддавати перевагу використанню `credentialBundlePath`, якщо їм не потрібні ключ і сертифікати в окремих файлах з причин сумісності. Kubelet використовує атомарну стратегію запису на основі символічних посилань, щоб переконатися, що коли ви відкриваєте файли, які він проєцює, ви читаєте або старий вміст, або новий вміст. Однак, якщо ви читаєте ключ і ланцюг сертифікатів з окремих файлів, Kubelet може обернути облікові дані після вашого першого читання і до вашого другого читання, в результаті чого ваш застосунок завантажить невідповідний ключ і сертифікат.

{{< /note >}}

{{% code_sample file="pods/storage/projected-podcertificate.yaml" %}}

## Взаємодія SecurityContext {#securitycontext-interactions}

[Пропозиція](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal) щодо обробки дозволів файлів у розширенні projected service account volume представляє, що projected файли мають відповідні набори дозволів власника.

### Linux

У Podʼах Linux, які мають projected том та `RunAsUser` вказано у [`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context), projected файли мають правильно встановлені права власності, включаючи власника контейнера.

Коли у всіх контейнерах в Podʼі встановлено одне й те ж `runAsUser` у їх
[`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) або [`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1), то kubelet гарантує, що вміст тому `serviceAccountToken` належить цьому користувачеві, а файл токена має режим дозволів, встановлений в `0600`.

{{< note >}}
{{< glossary_tooltip text="ефемерні контейнери" term_id="ephemeral-container" >}} додані до Podʼа після його створення _не_ змінюють прав доступу до тому, які були встановлені при створенні Podʼа.

Якщо права доступу до тому `serviceAccountToken` Podʼа були встановлені на `0600`, тому що всі інші контейнери в Podʼі мають одне і те ж `runAsUser`, ефемерні контейнери повинні використовувати той самий `runAsUser`, щоб мати змогу читати токен.
{{< /note >}}

### Windows

У Windows Podʼах, які мають projected том та `RunAsUsername` вказано в `SecurityContext` Podʼа, права власності не забезпечуються через спосіб управління користувачами у Windows. Windows зберігає та управляє локальними обліковими записами користувачів і груп у файлі бази даних, який називається Security Account Manager (SAM). Кожен контейнер підтримує свій власний екземпляр бази даних SAM, до якого хост не має доступу під час роботи контейнера. Контейнери Windows призначені для запуску режиму користувача операційної системи в ізоляції від хосту, тому не зберігають динамічну конфігурацію власності файлів хосту для облікових записів віртуалізованих контейнерів. Рекомендується розміщувати файли, які слід спільно використовувати з контейнером на машині-хості, в окремому змісті поза `C:\`.

Типово у projected файлах буде встановлено наступні права, як показано для прикладу projected файлу тома:

```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administr

ators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```

Це означає, що всі адміністратори, такі як `ContainerAdministrator`, матимуть доступ на читання, запис та виконання, тоді як не-адміністратори матимуть доступ на читання та
виконання.

{{< note >}}
Загалом не рекомендується надавати контейнеру доступ до хосту, оскільки це може відкрити можливості для потенційних використань дірок безпеки.

Створення Windows Podʼа з `RunAsUser` в його `SecurityContext` призведе до того, що Pod буде застрягати на стадії `ContainerCreating` назавжди. Таким чином, рекомендується не використовувати опцію `RunAsUser`, яка призначена лише для Linux, з Windows Podʼами.
{{< /note >}}
