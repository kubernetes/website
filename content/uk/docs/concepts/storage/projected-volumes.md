---
title: Проєкційні томи
content_type: concept
weight: 21 # одразу після постійних томів
---

<!-- overview -->

У цьому документі описано _проєкційні томи_ в Kubernetes. Рекомендується ознайомитися з [томами](/docs/concepts/storage/volumes/).

<!-- body -->

## Вступ {#introduction}

Том `projected` зіставляє кілька наявних джерел томів з однією текою.

Наразі можна проєцювати такі типи джерел томів:

* [`secret`](/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/docs/concepts/storage/volumes/#configmap)
* [`serviceAccountToken`](#serviceaccounttoken)
* [`clusterTrustBundle`](#clustertrustbundle)
* [`podCertificate`](#podcertificate)

Усі джерела мають бути в тому самому просторі імен, що й Pod. Докладніше дивіться в проєктному документі [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).

### Приклад конфігурації із secret, downwardAPI та configMap {#example-configuration-secret-downwardapi-configmap}

{{% code_sample file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

### Приклад конфігурації: secrets із нестандартним режимом дозволів {#example-configuration-secrets-nondefault-permission-mode}

{{% code_sample file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" %}}

Кожне джерело проєкційного тому перелічено в специфікації в розділі `sources`. Параметри майже такі самі, за двома винятками:

* Для secrets поле `secretName` змінено на `name`, щоб узгодити його з іменуванням ConfigMap.
* `defaultMode` можна вказати лише на рівні projected, а не для кожного джерела тому. Однак, як показано вище, ви можете явно встановити `mode` для кожної окремої проєкції.

## Проєкційні томи serviceAccountToken {#serviceaccounttoken}

Ви можете вставити токен поточного [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens) у Pod за вказаним шляхом. Наприклад:

{{% code_sample file="pods/storage/projected-service-account-token.yaml" %}}

Pod із прикладу має проєкційний том, що містить вставлений токен ServiceAccount. Контейнери в цьому Podʼі можуть використовувати цей токен для доступу до API-сервера Kubernetes, автентифікуючись від імені [ServiceAccount цього Podʼа](/docs/tasks/configure-pod-container/configure-service-account/). Поле `audience` містить цільову аудиторію токена. Отримувач токена повинен ідентифікувати себе ідентифікатором, вказаним в аудиторії токена, інакше він має відхилити токен. Це поле є необовʼязковим, і його стандартним значенням є ідентифікатор API-сервера.

Поле `expirationSeconds` містить очікуваний термін дії токена ServiceAccount. Стандартно він становить 1 годину і має бути не меншим за 10 хвилин (600 секунд). Адміністратор також може обмежити його максимальне значення, вказавши параметр `--service-account-max-token-expiration` для API-сервера. Поле `path` задає шлях відносно точки монтування проєкційного тому.

{{< note >}}
Контейнер, що використовує джерело проєкційного тому як монтування тому [`subPath`](/docs/concepts/storage/volumes/#using-subpath), не отримуватиме оновлень для цих джерел томів.
{{< /note >}}

## Проєкційні томи clusterTrustBundle {#clustertrustbundle}

{{< feature-state feature_gate_name="ClusterTrustBundleProjection" >}}

Джерело проєкційного тому `clusterTrustBundle` вставляє вміст одного або кількох обʼєктів [ClusterTrustBundle](/docs/reference/access-authn-authz/certificate-signing-requests#cluster-trust-bundles) як файл, що автоматично оновлюється, у файлову систему контейнера.

ClusterTrustBundles можна вибрати за [назвою](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked) або за [назвою підписувача](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked).

Щоб вибрати за назвою, використовуйте поле `name`, щоб вказати один обʼєкт ClusterTrustBundle.

Щоб вибрати за назвою підписувача, використовуйте поле `signerName` (і, за потреби, поле `labelSelector`), щоб вказати набір обʼєктів ClusterTrustBundle, які використовують задану назву підписувача. Якщо `labelSelector` відсутній, вибираються всі ClusterTrustBundles цього підписувача.

kubelet вилучає дублікати сертифікатів у вибраних обʼєктах ClusterTrustBundle, нормалізує подання PEM (відкидаючи коментарі та заголовки), змінює порядок сертифікатів і записує їх у файл, вказаний у `path`. Коли змінюється набір вибраних ClusterTrustBundles або їхній вміст, kubelet підтримує файл в актуальному стані.

Стандартно kubelet не дає Podʼу запуститися, якщо вказаний ClusterTrustBundle не знайдено або якщо `signerName` / `labelSelector` не відповідають жодному ClusterTrustBundle. Якщо така поведінка вам не підходить, встановіть поле `optional` у `true`, і Pod запуститься з порожнім файлом за шляхом `path`.

{{% code_sample file="pods/storage/projected-clustertrustbundle.yaml" %}}

## Проєкційні томи podCertificate {#podcertificate}

{{< feature-state feature_gate_name="PodCertificateRequest" >}}

Джерело проєкційного тому `podCertificate` безпечно надає приватний ключ і ланцюжок сертифікатів X.509, які Pod використовує як клієнтські або серверні облікові дані. Потім kubelet оновлює приватний ключ і ланцюжок сертифікатів, коли наближається завершення їхнього терміну дії. Застосунку потрібно лише своєчасно перезавантажувати файл, коли він змінюється, за допомогою механізму на кшталт `inotify` або опитування.

Кожна проєкція `podCertificate` підтримує такі конфігураційні поля:

* `signerName`: [підписувач](/docs/reference/access-authn-authz/certificate-signing-requests#signers), який має видати сертифікат. Зверніть увагу, що підписувачі можуть мати власні вимоги до доступу та можуть відмовитися видавати сертифікати вашому Podʼу.
* `keyType`: Тип приватного ключа, який повинен бути згенерований. Дійсні значення: `ED25519`, `ECDSAP256`, `ECDSAP384`, `ECDSAP521`, `RSA3072` і `RSA4096`.
* `maxExpirationSeconds`: Максимальний термін дії сертифіката, виданого Podʼу, який ви приймете. Якщо не вказано, стандартно використовується `86400` (24 години). Має бути не менше `3600` (1 година) і не більше `7862400` (91 день). Вбудовані підписувачі Kubernetes обмежені максимальним терміном дії `86400` (1 день). Підписувач може видати сертифікат із терміном дії, коротшим за вказаний вами.
* `credentialBundlePath`: Відносний шлях у межах проєкції, куди слід записати пакет облікових даних. Пакет облікових даних — це файл у форматі PEM, де перший блок — це блок "PRIVATE KEY", що містить приватний ключ, серіалізований у PKCS#8, а решта блоків — це блоки "CERTIFICATE", які утворюють ланцюжок сертифікатів (кінцевий сертифікат і всі проміжні).
* `keyPath` і `certificateChainPath`: Окремі шляхи, куди kubelet має записати *лише* приватний ключ або ланцюжок сертифікатів.
* `userAnnotations`: мапа, яка дозволяє передавати додаткову інформацію до реалізації підписувача. Вона дослівно копіюється в поле `spec.unverifiedUserAnnotations` обʼєктів [PodCertificateRequest](/docs/reference/access-authn-authz/certificate-signing-requests#pod-certificate-requests), які створює kubelet. Записи проходять ту саму перевірку, що й анотації метаданих обʼєкта, але додатково всі ключі повинні мати доменний префікс. На значення не накладаються жодні обмеження, крім загального обмеження розміру всього поля. Окрім цих базових перевірок, API-сервер не виконує жодних додаткових. Реалізації підписувача мають бути дуже обережними під час використання цих даних. Підписувачі не повинні довіряти цим даним без попереднього виконання відповідних кроків перевірки. Підписувачі мають документувати ключі та значення, які вони підтримують. Підписувачі мають відхиляти запити з ключами, які вони не розпізнають.

{{< note >}}

Більшість застосунків мають віддавати перевагу `credentialBundlePath`, якщо їм не потрібні ключ і сертифікати в окремих файлах з міркувань сумісності. kubelet використовує стратегію атомарного запису на основі символічних посилань, щоб під час відкриття файлів, які він проєцює, ви читали або старий, або новий вміст. Однак якщо ви читаєте ключ і ланцюжок сертифікатів з окремих файлів, kubelet може змінити облікові дані після першого читання й до другого, і ваш застосунок завантажить ключ і сертифікат, що не збігаються.

{{< /note >}}

{{% code_sample file="pods/storage/projected-podcertificate.yaml" %}}

## Взаємодія із SecurityContext {#securitycontext-interactions}

[Пропозиція](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal) щодо обробки дозволів файлів у вдосконаленні проєкційних томів ServiceAccount запровадила встановлення правильних дозволів власника для спроєцьованих файлів.

### Linux

У Podʼах Linux, які мають проєкційний том і `RunAsUser`, встановлений у Pod [`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context), спроєцьовані файли мають правильно встановленого власника, зокрема власника-користувача контейнера.

Коли всі контейнери в Podʼі мають однакове значення `runAsUser` у своєму [`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) або [`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1) контейнера, kubelet гарантує, що вміст тому `serviceAccountToken` належить цьому користувачеві, а файл токена має режим дозволів `0600`.

{{< note >}}
{{< glossary_tooltip text="Ефемерні контейнери" term_id="ephemeral-container" >}}, додані до Podʼа після його створення, *не* змінюють дозволи томів, встановлені під час створення Podʼа.

Якщо дозволи тому `serviceAccountToken` Podʼа було встановлено на `0600`, оскільки всі інші контейнери в Podʼі мають однакове значення `runAsUser`, ефемерні контейнери повинні використовувати той самий `runAsUser`, щоб мати змогу прочитати токен.
{{< /note >}}

### Windows

У Podʼах Windows, які мають проєкційний том і `RunAsUsername`, встановлений у Pod `SecurityContext`, власність не застосовується через те, як у Windows керуються облікові записи користувачів. Windows зберігає локальні облікові записи користувачів і груп у файлі бази даних Security Account Manager (SAM) і керує ними. Кожен контейнер має власний екземпляр бази даних SAM, який хост не бачить під час роботи контейнера. Контейнери Windows призначені для запуску частини ОС у режимі користувача ізольовано від хоста, тому вони підтримують віртуальну базу даних SAM. Як наслідок, kubelet, що працює на хості, не може динамічно налаштовувати власність файлів хоста для віртуалізованих облікових записів контейнерів. Якщо файли на хост-машині потрібно спільно використовувати з контейнером, рекомендується розмістити їх у власному монтуванні тому поза `C:\`.

Стандартно спроєцьовані файли матимуть такого власника, як показано для прикладу файлу проєкційного тому:

```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```

Це означає, що всі користувачі-адміністратори, такі як `ContainerAdministrator`, матимуть доступ на читання, запис і виконання, а користувачі, які не є адміністраторами, — на читання й виконання.

{{< note >}}
Загалом не рекомендується надавати контейнеру доступ до хоста, оскільки це може відкрити двері для потенційних експлойтів безпеки.

Створення Podʼа Windows із `RunAsUser` у його `SecurityContext` призведе до того, що Pod назавжди застрягне на `ContainerCreating`. Тому не рекомендується використовувати параметр `RunAsUser`, призначений лише для Linux, з Podʼами Windows.
{{< /note >}}
