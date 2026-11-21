---
title: Контроль допуску в Kubernetes
linkTitle: Контроль допуску
content_type: concept
weight: 40
---

<!-- overview -->
Ця сторінка надає огляд _контролерів допуску_.

Контролер допуску — це фрагмент коду, який перехоплює запити до API-сервера Kubernetes перед збереженням ресурсу, але після того, як запит був автентифікований та авторизований.

Кілька важливих функцій Kubernetes вимагають увімкнення контролера допуску, щоб належним чином підтримувати функцію. Як наслідок, API-сервер Kubernetes, який не налаштований належним чином з правильним набором контролерів допуску, є неповноцінним сервером, який не буде підтримувати всі функції, які ви очікуєте.

<!-- body -->
## Що це таке? {#what-are-they}

Контролери допуску — це код в {{< glossary_tooltip term_id="kube-apiserver" text="API-сервері" >}} Kubernetes, який перевіряє дані, що надходять у запиті на зміну ресурсу.

Контролери допуску застосовуються до запитів на створення, видалення або зміну обʼєктів. Контролери допуску також можуть блокувати нестандартні дієслова, такі як запит на підключення до Podʼа через проксі API-сервера. Контролери допуску _не_ блокують (і не можуть блокувати) запити на читання (**get**, **watch** або **list**) обʼєктів, оскільки читання оминає шар контролю допуску.

Механізми контролю допуску можуть бути _валідаційними_, _змінювальними_ або і тими, і іншими. Змінювальні контролери можуть змінювати дані ресурсу, який змінюється; валідаційні контролери — ні.

Контролери допуску в Kubernetes {{< skew currentVersion >}} складаються зі [списку](#what-does-each-admission-controller-do) нижче, вбудовані у двійковий файл `kube-apiserver` і можуть бути налаштовані тільки адміністратором кластера.

### Точки розширення контролю допуску {#admission-control-extension-points}

У повному [списку](#what-does-each-admission-controller-do) є чотири спеціальні контролери: [MutatingAdmissionWebhook](#mutatingadmissionwebhook), [MutatingAdmissionPolicy](#mutatingadmissionpolicy), [ValidatingAdmissionWebhook](#validatingadmissionwebhook) та [ValidatingAdmissionPolicy](#validatingadmissionpolicy). Два контролери вебхуків виконують відповідно змінювальні та валідаційні [вебхуки контролю допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks), які налаштовуються в API. MutatingAdmissionPolicy та ValidatingAdmissionPolicy надають спосіб вбудувати декларативний код змін/валідації в API, не покладаючись на будь-які зовнішні HTTP-виклики.

Ви можете використовувати ці чотири контролери допуску, щоб налаштувати поведінку кластера під час допуску.

### Етапи контролю допуску {#admission-control-phases}

Процес контролю допуску проходить у два етапи. На першому етапі виконуються змінювальні контролери допуску. На другому етапі виконуються валідаційні контролери допуску. Знову ж таки, зауважте, що деякі контролери є і тими, і іншими.

Якщо будь-який з контролерів на будь-якому етапі відхиляє запит, весь запит негайно відхиляється, і кінцевому користувачу повертається помилка.

Нарешті, окрім того, що контролери допуску іноді змінюють обʼєкт, про який йдеться, вони можуть іноді мати побічні ефекти, тобто змінювати повʼязані ресурси в процесі обробки запиту. Збільшення використання квоти є класичним прикладом того, чому це необхідно. Будь-який такий побічний ефект потребує відповідного процесу вивільнення або узгодження, оскільки даний контролер допуску не знає напевно, що даний запит пройде через всі інші контролери допуску.

Порядок цих викликів можна побачити нижче.

{{< figure src="/docs/reference/access-authn-authz/admission-control-phases.svg" alt="Діаграма послідовності обробки запитів kube-apiserver під час фази допуску, яка показує змінювальні вебхуки, за ними validatingadmissionpolicies і, нарешті, валідаційні вебхуки. З діаграми видно, що процес триває до першої відмови або до прийняття запиту всіма з них. Також показано, що зміни, внесені змінювальними вебхуками, призводять до повторного виклику всіх раніше викликаних вебхуків." class="diagram-large" link="[https://mermaid.live/edit#pako:eNqtVm1v2zYQ_isHDcZazO-O34QhQJdiazAEKJquAwZ9oaSzxZoiNZJy4gT-7ztSL1bs5sPQ6otE8rm75-45inwOEpViEAa9HnxgewSrwKCFjZL2nj8hbIWKmRAHYAZsxg1wI3-2oNEUmFhMIS29UWZtYcLRaMttVsbDROWjHHXOeDr4aprPETemRDOardfjSPZ6z1xyGz5Hgc0wxygIo0BiaTUTUdCPgoYELUAUTKfFI03Tl8F_S5SJnyfjnGut9LvEKm1oyuoSj_1IAj215y9McxYLNJWFX6qWmbP6bbf1sX-aTRcJzl3sc8hnfLQ3SijtgQ8Zt3gGE0oVXRS85k8qixSxg9tqPJyBvpV6JI_HY68XyUg2FXjP2Vaz3E05OxLxc6URaYXAhB1YokRqamBJgsbwmAtuD31gMgWTqVKkECOURcqcmLhHfQDLc_QO0so9-RtWAcjJezSJ7hbxvubSol20XRnjgBXcoCaXkFE4weWW-obAxhpqG-3GnmaaU19wJaHImEFH68Gt5aVl1k0_YJwptTN9ci2EeiCi8QH2THBiTcjWQaEETzgan92GS9-4J1zraAgn-rfWB3QVY9bzSaj2XFJbl_QWfmrDtXFN_5V6nuL0gVKM0bl0ZS1sxYjCgdo4g_wsAhNGdcM0qRlnVg069CBhpUHvrtC456o0lEdCY4rTgmjTkXL1LNsyLmuRjk07FExbqkfBpIW_SAm3h_37cvndx1u3-ifJpiVaKqGbuffqfQNd2szB3RupSEml0y9-Qmn-5MdtT74wTfMbq4W3bnW_oYprJSqDWD3CH5SNiZVWlyD4NdbXN1XWlUBn4lzSvWsKTEHb79bxJf7LqWPIojM6s0GZulJXA1_YwfW1L1wIn6pGhzc43A77kGikDQYMCpW-revvgN6AihZ2a0md59WiJnbJJhkmu2qqoP9oxcA0cd1_B353G5zapc3uY70TTl3oNXPhGkwIt3KvdnhmdDiZtAsnlncq5ZuDa_-q3qBi_3rDNyARU0zfvqjN6wz_rvv4fzGsjX44RVK_ZdjRu6kicOkgrunEK7FPVi3rc0edynaWXib86XspN2X9bsqX-vwA0q3E1PvU8u5n3hGqPhxasNsfDuy2lotiCup7hGZPmdIfac4BuhsAhQv6dJjytLoE9IP62kHXG39ene4Z9JnihpXC-mOVzGjj_6NU3lhqVW6zINzQj5tG1fFYH7YNhJVW3R9k0owx5XRRuKuuU_5WRW4od9Q3in5UQTgZ-zBB-Bw8BuFgNpsOF_PF-mo-nkxmq-WsHxwINFkOr8aT5WoxW01Wy8l4fewHT57ZZDieL-fr8WI8W01XV7Px9PgfcW89xA](https://mermaid.live/edit#pako:eNqtVm1v2zYQ_isHDcZazO-O34QhQJdiazAEKJquAwZ9oaSzxZoiNZJy4gT-7ztSL1bs5sPQ6otE8rm75-45inwOEpViEAa9HnxgewSrwKCFjZL2nj8hbIWKmRAHYAZsxg1wI3-2oNEUmFhMIS29UWZtYcLRaMttVsbDROWjHHXOeDr4aprPETemRDOardfjSPZ6z1xyGz5Hgc0wxygIo0BiaTUTUdCPgoYELUAUTKfFI03Tl8F_S5SJnyfjnGut9LvEKm1oyuoSj_1IAj215y9McxYLNJWFX6qWmbP6bbf1sX-aTRcJzl3sc8hnfLQ3SijtgQ8Zt3gGE0oVXRS85k8qixSxg9tqPJyBvpV6JI_HY68XyUg2FXjP2Vaz3E05OxLxc6URaYXAhB1YokRqamBJgsbwmAtuD31gMgWTqVKkECOURcqcmLhHfQDLc_QO0so9-RtWAcjJezSJ7hbxvubSol20XRnjgBXcoCaXkFE4weWW-obAxhpqG-3GnmaaU19wJaHImEFH68Gt5aVl1k0_YJwptTN9ci2EeiCi8QH2THBiTcjWQaEETzgan92GS9-4J1zraAgn-rfWB3QVY9bzSaj2XFJbl_QWfmrDtXFN_5V6nuL0gVKM0bl0ZS1sxYjCgdo4g_wsAhNGdcM0qRlnVg069CBhpUHvrtC456o0lEdCY4rTgmjTkXL1LNsyLmuRjk07FExbqkfBpIW_SAm3h_37cvndx1u3-ifJpiVaKqGbuffqfQNd2szB3RupSEml0y9-Qmn-5MdtT74wTfMbq4W3bnW_oYprJSqDWD3CH5SNiZVWlyD4NdbXN1XWlUBn4lzSvWsKTEHb79bxJf7LqWPIojM6s0GZulJXA1_YwfW1L1wIn6pGhzc43A77kGikDQYMCpW-revvgN6AihZ2a0md59WiJnbJJhkmu2qqoP9oxcA0cd1_B353G5zapc3uY70TTl3oNXPhGkwIt3KvdnhmdDiZtAsnlncq5ZuDa_-q3qBi_3rDNyARU0zfvqjN6wz_rvv4fzGsjX44RVK_ZdjRu6kicOkgrunEK7FPVi3rc0edynaWXib86XspN2X9bsqX-vwA0q3E1PvU8u5n3hGqPhxasNsfDuy2lotiCup7hGZPmdIfac4BuhsAhQv6dJjytLoE9IP62kHXG39ene4Z9JnihpXC-mOVzGjj_6NU3lhqVW6zINzQj5tG1fFYH7YNhJVW3R9k0owx5XRRuKuuU_5WRW4od9Q3in5UQTgZ-zBB-Bw8BuFgNpsOF_PF-mo-nkxmq-WsHxwINFkOr8aT5WoxW01Wy8l4fewHT57ZZDieL-fr8WI8W01XV7Px9PgfcW89xA)" >}}

## Навіщо вони мені потрібні? {#why-do-i-need-them}

Кілька важливих функцій Kubernetes вимагають увімкнення контролера допуску, щоб належним чином підтримувати функцію. Як наслідок, API-сервер Kubernetes, який не налаштований належним чином з правильним набором контролерів допуску, є неповним сервером і не буде підтримувати всі функції, які ви очікуєте.

## Як увімкнути контролер допуску? {#how-do-i-turn-on-an-admission-controller}

Прапорець API-сервера Kubernetes `enable-admission-plugins` приймає розділений комами список втулків контролю допуску, які слід викликати перед зміною обʼєктів у кластері. Наприклад, наступна команда увімкне втулки контролю допуску `NamespaceLifecycle` та `LimitRanger`:

```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
Залежно від того, як ваш кластер Kubernetes розгорнутий і як запускається API-сервер, вам може знадобитися застосувати налаштування різними способами. Наприклад, вам може знадобитися змінити файл юніта systemd, якщо API-сервер розгорнуто як службу systemd, або ви можете змінити файл маніфесту для API-сервера, якщо Kubernetes розгорнуто у самостійно розміщений (self-hosted) спосіб.
{{< /note >}}

## Як вимкнути контролер допуску? {#how-do-i-turn-off-an-admission-controller}

Прапорець API-сервера Kubernetes `disable-admission-plugins` приймає розділений комами список втулків контролю допуску, які слід вимкнути, навіть якщо вони є у списку втулків, що типово увімкнені.

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

## Які втулки типово увімкнені? {#which-plugins-are-enabled-by-default}

Щоб побачити, які втулки допуску увімкнені:

```shell
kube-apiserver -h | grep enable-admission-plugins
```

У Kubernetes {{< skew currentVersion >}} типово увімкнені такі втулки:

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook
```

## Що робить кожен контролер допуску? {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**Тип**: Валідаційний.

Цей контролер допуску допускає до кластера всі Podʼи. Він **застарілий**, оскільки його поведінка така ж, як якби не було ніякого контролера допуску взагалі.

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**Тип**: Валідаційний.

Відхиляє всі запити. AlwaysDeny **застарілий**, оскільки не має реального значення.

### AlwaysPullImages {#alwayspullimages}

**Тип**: Змінювальний та валідаційний.

Цей контролер допуску змінює кожен новий Pod, щоб примусово встановити політику завантаження образів `Always`. Це корисно в багатокористувацькому кластері, щоб користувачі могли бути впевнені, що їхні приватні образи можуть використовувати лише ті, хто має відповідні облікові дані для їх завантаження. Без цього контролера допуску, після того, як образ було завантажено на вузол, будь-який Pod будь-якого користувача може використовувати його, знаючи імʼя образу (за умови, що Pod розміщений на правильному вузлі), без жодної перевірки авторизації для образу. Коли цей контролер допуску увімкнений, образи завжди завантажуються перед запуском контейнерів, що означає, що потрібні дійсні облікові дані.

### CertificateApproval {#certificateapproval}

**Тип**: Валідаційний.

Цей контролер допуску спостерігає за запитами на затвердження ресурсів CertificateSigningRequest і виконує додаткові перевірки авторизації, щоб переконатися, що користувач, який затверджує, має дозвіл на **затвердження** запитів сертифікатів із запитаним `spec.signerName` у ресурсі CertificateSigningRequest.

Дивіться [Запити на підписання сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/) для отримання додаткової інформації про дозволи, необхідні для виконання різних дій з ресурсами CertificateSigningRequest.

### CertificateSigning {#certificatesigning}

**Тип**: Валідаційний.

Цей контролер допуску спостерігає за оновленнями поля `status.certificate` ресурсів CertificateSigningRequest і виконує додаткові перевірки авторизації, щоб переконатися, що користувач, який підписує, має дозвіл на **підписання** запитів сертифікатів із запитаним `spec.signerName` у ресурсі CertificateSigningRequest.

Дивіться [Запити на підписання сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/) для отримання додаткової інформації про дозволи, необхідні для виконання різних дій з ресурсами CertificateSigningRequest.

### CertificateSubjectRestriction {#certificatesubjectrestriction}

**Тип**: Валідаційний.

Цей контролер допуску спостерігає за створенням ресурсів CertificateSigningRequest, які мають `spec.signerName` зі значенням `kubernetes.io/kube-apiserver-client`. Він відхиляє будь-який запит, який вказує «групу» (або «атрибут організації») `system:masters`.

### DefaultIngressClass {#defaultingressclass}

**Тип**: Змінювальний.

Цей контролер допуску спостерігає за створенням обʼєктів `Ingress`, які не запитують жодного конкретного класу ingress, і автоматично додає до них типовий клас ingress. Таким чином, користувачі, які не запитують жодного спеціального класу ingress, не повинні про це турбуватися та отримають типовий клас.

Цей контролер допуску нічого не робить, коли не налаштований жоден типовий клас ingress. Коли більше одного класу ingress позначено як типовий, він відхиляє будь-яке створення `Ingress` з помилкою, і адміністратор повинен переглянути свої обʼєкти `IngressClass` та позначити лише один як типовий (з анотацією "ingressclass.kubernetes.io/is-default-class"). Цей контролер допуску ігнорує будь-які оновлення `Ingress`; він діє тільки при створенні.

Дивіться документацію [Ingress](/docs/concepts/services-networking/ingress/) для отримання додаткової інформації про класи ingress і про те, як позначити один з них як типовий.

### DefaultStorageClass {#defaultstorageclass}

**Тип**: Змінювальний.

Цей контролер допуску спостерігає за створенням обʼєктів `PersistentVolumeClaim`, які не запитують жодного конкретного класу сховища, і автоматично додає до них типовий клас сховища. Таким чином, користувачі, які не запитують жодного спеціального класу сховища, не повинні про це турбуватися та отримають типовий клас.

Цей контролер допуску нічого не робить, якщо не існує типового `StorageClass`. Коли більше ніж один клас сховища позначено як типовий, а потім ви створюєте `PersistentVolumeClaim` без встановленого `storageClassName`, Kubernetes використовує останній створений типовий `StorageClass`. Коли `PersistentVolumeClaim` створено із зазначеним `volumeName`, він залишається у стані очікування, якщо `storageClassName` статичного тому не збігається з `storageClassName` у `PersistentVolumeClaim` після застосування до нього будь-якого типового StorageClass. Цей контролер допуску ігнорує будь-які оновлення `PersistentVolumeClaim`; він діє лише при створенні.

Дивіться документацію про [постійні томи](/docs/concepts/storage/persistent-volumes/), щоб дізнатися про заявки на постійні томи та класи сховища, а також про те, як позначити клас сховища як типовий.

### DefaultTolerationSeconds {#defaulttolerationseconds}

**Тип**: Змінювальний.

Цей контролер допуску встановлює для Podʼів типовий toleration (forgiveness toleration) до taints `notready:NoExecute` та `unreachable:NoExecute` на основі вхідних параметрів k8s-apiserver `default-not-ready-toleration-seconds` та `default-unreachable-toleration-seconds`, якщо Podʼи ще не мають toleration для taints `node.kubernetes.io/not-ready:NoExecute` або `node.kubernetes.io/unreachable:NoExecute`. Типове значення для `default-not-ready-toleration-seconds` та `default-unreachable-toleration-seconds` становить 5 хвилин.

### DenyServiceExternalIPs {#denyserviceexternalips}

**Тип**: Валідаційний.

Цей контролер допуску відхиляє всі нові використання поля `externalIPs` у `Service`. Ця функція дуже потужна (дозволяє перехоплення мережевого трафіку) і погано контролюється політиками. Коли цей контролер увімкнено, користувачі кластера не можуть створювати нові Serviceʼи, які використовують `externalIPs`, і не можуть додавати нові значення до `externalIPs` в наявних обʼєктах `Service`. Поточні використання `externalIPs` не зачіпаються, і користувачі можуть видаляти значення з `externalIPs` в наявних обʼєктах `Service`.

Більшість користувачів взагалі не потребує цієї функції, і адміністратори кластера повинні розглянути можливість її вимкнення. Кластери, які потребують цієї функції, повинні розглянути можливість використання власних політик для керування її використанням.

Цей контролер допуску типово вимкнено.

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

**Тип**: Валідаційний.

Цей контролер допуску зменшує проблему, коли API-сервер переповнюється запитами на зберігання нових подій (Events). Адміністратор кластера може вказати обмеження частоти подій, виконавши такі кроки:

* Увімкнути контролер допуску `EventRateLimit`;
* Послатися на конфігураційний файл `EventRateLimit` у файлі, який передається прапорцю командного рядка API-сервера `--admission-control-config-file`:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: EventRateLimit
    path: eventconfig.yaml
...
```

Є чотири типи обмежень, які можна вказати у конфігурації:

 * `Server`: Всі запити подій (створення або зміни), що отримує API-сервер, використовують один спільний кошик.
 * `Namespace`: Кожен простір імен має виділений кошик.
 * `User`: Кожному користувачу виділяється кошик.
 * `SourceAndObject`: Кошик призначається кожній комбінації джерела та обʼєкта події.

Нижче наведено приклад `eventconfig.yaml` для такої конфігурації:

```yaml
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
  - type: Namespace
    qps: 50
    burst: 100
    cacheSize: 2000
  - type: User
    qps: 10
    burst: 50
```

Дивіться [API конфігурації EventRateLimit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/) для отримання додаткових деталей.

Цей контролер допуску типово вимкнено.

### ExtendedResourceToleration {#extendedresourcetoleration}

**Тип**: Змінювальний.

Цей втулок полегшує створення виділених вузлів з розширеними ресурсами. Якщо оператори хочуть створити виділені вузли з розширеними ресурсами (наприклад, GPU, FPGA тощо), вони повинні [додати taint на вузол](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) з іменем розширеного ресурсу як ключем. Цей контролер допуску, якщо він увімкнений, автоматично додає tolerations для таких taints до Podʼів, які запитують розширені ресурси, тому користувачам не потрібно вручну додавати ці tolerations.

Цей контролер допуску типово вимкнено.

### ImagePolicyWebhook {#imagepolicywebhook}

**Тип**: Валідаційний.

Контролер допуску ImagePolicyWebhook дозволяє бекенд-вебхуку приймати рішення про допуск.

Цей контролер допуску типово вимкнено.

#### Формат конфігураційного файлу {#imagereview-config-file-format}

ImagePolicyWebhook використовує конфігураційний файл для налаштування поведінки бекенду. Цей файл може бути у форматі json або yaml і має наступний формат:

```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # час у секундах для кешування дозволу
  allowTTL: 50
  # час у секундах для кешування відмови
  denyTTL: 50
  # час у мілісекундах між спробами повтору
  retryBackoff: 500
  # визначає поведінку у разі відмови бекенда вебхука
  defaultAllow: true
```

Пошліться на конфігураційний файл ImagePolicyWebhook у файлі, який передається прапорцю командного рядка API-сервера `--admission-control-config-file`:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    path: imagepolicyconfig.yaml
...
```

Альтернативно, ви можете вбудувати конфігурацію безпосередньо у файл:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    configuration:
      imagePolicy:
        kubeConfigFile: <path-to-kubeconfig-file>
        allowTTL: 50
        denyTTL: 50
        retryBackoff: 500
        defaultAllow: true
```

Конфігураційний файл ImagePolicyWebhook повинен посилатися на файл у форматі [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), який налаштовує зʼєднання з бекендом. Бекенд повинен здійснювати комунікацію через TLS.

Поле `cluster` у файлі kubeconfig має вказувати на віддалений сервіс, а поле `user` повинно містити авторизатор, що повертається.

```yaml
# clusters посилається на віддалений сервіс.
clusters:
  - name: name-of-remote-imagepolicy-service
    cluster:
      certificate-authority: /path/to/ca.pem    # CA для верифікації віддаленого сервісу.
      server: https://images.example.com/policy # URL віддаленого сервісу для запитів. Повинен використовувати 'https'.

# users посилається на конфігурацію вебхука API-сервера.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # сертифікат для використання контролером допуску вебхука
      client-key: /path/to/key.pem          # ключ, що відповідає сертифікату
```

Для додаткової конфігурації HTTP дивіться документацію [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

#### Вміст запитів {#request-payloads}

Під час прийняття рішення про допуск API-сервер надсилає POST-запит з серіалізованим у форматі JSON обʼєктом `imagepolicy.k8s.io/v1alpha1` `ImageReview`, що описує дію. Цей обʼєкт містить поля, що описують контейнери, які підлягають допуску, а також будь-які анотації Podʼа, що відповідають `*.image-policy.k8s.io/*`.

{{< note >}}
Обʼєкти API вебхуків підлягають тим самим правилам сумісності версій, що й інші обʼєкти API Kubernetes. Розробники реалізацій повинні знати про менш суворі гарантії сумісності для альфа-обʼєктів і перевіряти поле `apiVersion` запиту для забезпечення правильної десеріалізації. Крім того, API-сервер повинен увімкнути групу розширень API `imagepolicy.k8s.io/v1alpha1` (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
{{< /note >}}

Приклад тіла запиту:

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "spec": {
    "containers": [
      {
        "image": "myrepo/myimage:v1"
      },
      {
        "image": "myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations": {
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace": "mynamespace"
  }
}
```

Віддалений сервіс повинен заповнити поле `status` запиту і відповісти з дозволом або відмовою доступу. Поле `spec` тіла відповіді ігнорується, і його можна не включати. Відповідь, яка дозволяє доступ, виглядатиме так:

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

Щоб відмовити у доступі, сервіс відповість так:

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

{{< note >}}
Обʼєкти `ImageReview` включатимуть всі образи в Podʼах, які призначені для виконання як контейнери. Це охоплює образи, зазначені як частина полів containers, initContainers або ephemeralContainers у специфікації Podʼа. Відповідно, образи, включені в томи образів (image volumes), не підпадають під дію ImagePolicyWebhook.
{{< /note >}}

Для додаткової документації дивіться [API `imagepolicy.v1alpha1`](/docs/reference/config-api/imagepolicy.v1alpha1/).

#### Розширення за допомогою анотацій {#extending-with-annotations}

Усі анотації Podʼа, що відповідають `*.image-policy.k8s.io/*`, надсилаються до вебхука. Надсилання анотацій дозволяє користувачам, які знають про бекенд політики образів, надсилати йому додаткову інформацію, а реалізаціям різних бекендів — приймати різну інформацію.

Приклади інформації, яку ви можете тут розмістити:

* запит на "розбиття скла" (break glass) для обходу політики у разі надзвичайної ситуації;
* номер заявки з системи обліку заявок, що документує запит на "розбиття скла";
* підказка серверу політики щодо imageID наданого образу, щоб заощадити йому пошук.

У будь-якому випадку анотації надаються користувачем і жодним чином не перевіряються Kubernetes.

### LimitPodHardAntiAffinityTopology {#limitpodhardantiaffinitytopology}

**Тип**: Валідаційний.

Цей контролер допуску відхиляє будь-який Pod, який визначає ключ топології `AntiAffinity`, відмінний від `kubernetes.io/hostname`, у `requiredDuringSchedulingIgnoredDuringExecution`.

Цей контролер допуску типово вимкнено.

### LimitRanger {#limitranger}

**Тип**: Змінювальний та валідаційний.

Цей контролер допуску спостерігає за вхідним запитом та забезпечує, щоб він не порушував жодних обмежень, перерахованих в обʼєкті `LimitRange` в `Namespace`. Якщо ви використовуєте обʼєкти `LimitRange` у своєму розгортанні Kubernetes, ви МАЄТЕ використовувати цей контролер допуску для забезпечення дотримання цих обмежень. LimitRanger також може використовуватися для застосування типових запитів ресурсів до Podʼів, які їх не вказують; наразі типовий LimitRanger застосовує вимогу 0.1 CPU до всіх Podʼів у просторі імен `default`.

Дивіться [довідник API LimitRange](/docs/reference/kubernetes-api/core/limit-range-v1/) та [приклад LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) для отримання додаткової інформації.

### MutatingAdmissionPolicy {#mutatingadmissionpolicy}

**Тип**: Змінювальний.

[Цей контролер допуску](/docs/reference/access-authn-authz/mutating-admission-policy/) використовує Common Expression Language (CEL) для оголошення змін ресурсів. Зміни можуть бути визначені або за допомогою конфігурації застосування, яка обʼєднується за допомогою стратегії злиття server side apply, або за допомогою JSON-патча. Він увімкнений, коли увімкнені і функціональна можливість `mutatingadmissionpolicy`, і група/версія `admissionregistration.k8s.io/v1alpha1`. Якщо будь-яка з MutatingAdmissionPolicy не спрацьовує, запит не виконується.

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

**Тип**: Змінювальний.

Цей контролер допуску викликає будь-які змінювальні вебхуки, які відповідають запиту. Відповідні вебхуки викликаються послідовно; кожен з них може змінити обʼєкт, якщо це необхідно.

Цей контролер допуску (як випливає з назви) працює лише на етапі змін.

Якщо вебхук, викликаний цим контролером, має побічні ефекти (наприклад, зменшення квоти), він _повинен_ мати систему узгодження, оскільки не гарантується, що наступні вебхуки або валідаційні контролери допуску дозволять завершити запит.

Якщо ви вимкнете MutatingAdmissionWebhook, ви також повинні вимкнути обʼєкт `MutatingWebhookConfiguration` у групі/версії `admissionregistration.k8s.io/v1` за допомогою прапорця `--runtime-config`, обидва типово увімкнені.

#### Будьте обережні під час створення та встановлення змінювальних вебхуків {#use-caution-when-authoring-and-installing-mutating-webhooks}

* Користувачі можуть бути спантеличені, коли обʼєкти, які вони намагаються створити, відрізняються від того, що вони отримують назад.
* Вбудовані контрольні цикли можуть зламатися, коли обʼєкти, які вони намагаються створити, відрізняються при зворотному читанні.
  * Встановлення спочатку незаданих полів менш ймовірно викличе проблеми, ніж переписування полів, встановлених у початковому запиті. Уникайте останнього.
* Майбутні зміни в контрольних циклах для вбудованих або сторонніх ресурсів можуть зламати вебхуки, які добре працюють сьогодні. Навіть коли API встановлення вебхуків буде остаточно затверджено, не всі можливі поведінки вебхуків будуть гарантовано підтримуватися необмежено довго.

### NamespaceAutoProvision {#namespaceautoprovision}

**Тип**: Змінювальний.

Цей контролер допуску перевіряє всі вхідні запити на ресурси, що належать до простору імен, і перевіряє, чи існує зазначений простір імен. Він створює простір імен, якщо його не знайдено. Цей контролер допуску корисний у розгортаннях, які не хочуть обмежувати створення простору імен до його використання.

### NamespaceExists {#namespaceexists}

**Тип**: Валідаційний.

Цей контролер допуску перевіряє всі запити на ресурси, що належать до простору імен, крім самого `Namespace`. Якщо простір імен, на який посилається запит, не існує, запит відхиляється.

### NamespaceLifecycle {#namespacelifecycle}

**Тип**: Валідаційний.

Цей контролер допуску забезпечує, що в `Namespace`, який знаходиться в процесі завершення, не можуть створюватися нові обʼєкти, і забезпечує відхилення запитів у неіснуючому `Namespace`. Цей контролер допуску також запобігає видаленню трьох системних зарезервованих просторів імен: `default`, `kube-system`, `kube-public`.

Видалення `Namespace` запускає послідовність операцій, які видаляють усі обʼєкти (Podʼи, Serviceʼи тощо) у цьому просторі імен. Для забезпечення цілісності цього процесу ми наполегливо рекомендуємо використовувати цей контролер допуску.

### NodeDeclaredFeatureValidator {#nodedeclaredfeaturevalidator}

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

**Тип**: Валідаційний.

Цей контролер допуску перехоплює записи до привʼязаних Podʼів, щоб забезпечити сумісність змін з функціями, оголошеними вузлом, де Pod зараз працює. Він використовує поле `.status.declaredFeatures` обʼєкта Node, щоб визначити набір увімкнених функцій. Якщо оновлення Podʼа вимагає функції, якої немає у функціях поточного вузла, контролер допуску відхилить запит на оновлення. Це запобігає збоям під час виконання через невідповідність функцій після того, як Pod був запланований.

Цей контролер допуску типово увімкнений, якщо увімкнено функціональну можливість [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures).

### NodeRestriction {#noderestriction}

**Тип**: Валідаційний.

Цей контролер допуску обмежує обʼєкти `Node` і `Pod`, які kubelet може змінювати. Для того, щоб бути обмеженими цим контролером допуску, kubeletʼи повинні використовувати облікові дані у групі `system:nodes`, з іменем користувача у формі `system:node:<nodeName>`. Такі kubeletʼи матимуть дозвіл змінювати лише свої власні обʼєкти API `Node` і лише ті обʼєкти API `Pod`, які привʼязані до їхнього вузла. kubeletʼи не мають права оновлювати або видаляти taints зі свого обʼєкта API `Node`.

Втулок допуску `NodeRestriction` не дозволяє kubeletʼам видаляти їхній обʼєкт API `Node` і контролює зміну kubeletʼом міток з префіксами `kubernetes.io/` або `k8s.io/` наступним чином:

* **Заборонено** (kubeletʼам заборонено змінювати ці мітки):
  * Мітки з префіксом `node-restriction.kubernetes.io/`. Цей префікс зарезервовано для адміністраторів, щоб вони могли позначати обʼєкти `Node` з метою ізоляції робочих навантажень.
  * Мітки з префіксом `node-role.kubernetes.io/` (наприклад: `node-role.kubernetes.io/control-plane`). Вони обмежені, щоб запобігти самопроголошенню ролей кластера вузлами без привілеїв.
* **Дозволено** (kubeletʼи можуть додавати/видаляти/оновлювати їх):
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region` (застаріло)
  * `failure-domain.beta.kubernetes.io/zone` (застаріло)
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * мітки з префіксом `kubelet.kubernetes.io/`
  * мітки з префіксом `node.kubernetes.io/`
* **Зарезервовано**:
  Використання kubeletʼами будь-яких інших міток з префіксами `kubernetes.io` або `k8s.io` зарезервовано. Втулок допуску `NodeRestriction` зазвичай забороняє їх, щоб запобігти несанкціонованому самопозначенню, але в майбутньому може дозволити додаткові мітки з цими префіксами як частину майбутніх функцій.

Коли функціональну можливість [`ServiceAccountNodeAudienceRestriction`](/docs/reference/command-line-tools-reference/feature-gates/#ServiceAccountNodeAudienceRestriction) увімкнено, цей втулок допуску також обмежує аудиторії, для яких kubelet може запитувати токени службових облікових записів через API `TokenRequest`. Kubelet може запитувати токени лише для аудиторій, які вже згадуються в Podʼах на цьому вузлі (через проєкційні томи токенів службових облікових записів або запити токенів драйвера CSI), або для аудиторій, явно наданих через RBAC за допомогою дієслова `request-serviceaccounts-token-audience`. Для отримання додаткової інформації див. [Обмеження аудиторії токена службового облікового запису](/docs/reference/access-authn-authz/node/#service-account-token-audience-restriction).

Майбутні версії можуть додати додаткові обмеження для забезпечення того, щоб kubeletʼи мали мінімальний набір дозволів, необхідних для правильної роботи.

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

**Тип**: Валідаційний.

Цей контролер допуску захищає доступ до `metadata.ownerReferences` обʼєкта, так що тільки користувачі з правами **delete** на обʼєкт можуть його змінювати. Цей контролер допуску також захищає доступ до `metadata.ownerReferences[x].blockOwnerDeletion` обʼєкта, так що тільки користувачі з правами **update** на субресурс `finalizers` _власника_, на якого посилаються, можуть його змінювати.

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

**Тип**: Валідаційний.

Цей контролер допуску реалізує додаткові перевірки для вхідних запитів на зміну розміру `PersistentVolumeClaim`.

Рекомендується увімкнути контролер допуску `PersistentVolumeClaimResize`. Цей контролер допуску типово запобігає зміні розміру всіх заявок, якщо тільки `StorageClass` заявки явно не дозволяє зміну розміру, встановлюючи `allowVolumeExpansion` у `true`.

Наприклад: всі `PersistentVolumeClaim`, створені з наступного `StorageClass`, підтримують розширення тому:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Для отримання додаткової інформації про заявки на постійні томи дивіться [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

**Тип**: Валідаційний.

Цей контролер допуску встановлює типові значення та обмежує, які селектори вузлів можуть використовуватися в межах простору імен, шляхом читання анотації простору імен та глобальної конфігурації.

Цей контролер допуску типово вимкнено.

#### Формат конфігураційного файлу {#configuration-file-format}

`PodNodeSelector` використовує конфігураційний файл для налаштування параметрів поведінки бекенду. Зверніть увагу, що формат конфігураційного файлу буде змінено на версійований файл у майбутньому випуску. Цей файл може бути у форматі json або yaml і має наступний формат:

```yaml
podNodeSelectorPluginConfig:
  clusterDefaultNodeSelector: name-of-node-selector
  namespace1: name-of-node-selector
  namespace2: name-of-node-selector
```

Пошліться на конфігураційний файл `PodNodeSelector` у файлі, який передається прапорцю командного рядка API-сервера `--admission-control-config-file`:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```

#### Формат анотації конфігурації {#configuration-annotation-format}

`PodNodeSelector` використовує ключ анотації `scheduler.alpha.kubernetes.io/node-selector` для призначення селекторів вузлів просторам імен.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: name-of-node-selector
  name: namespace3
```

#### Внутрішня поведінка {#internal-behavior}

Цей контролер допуску має наступну поведінку:

1. Якщо `Namespace` має анотацію з ключем `scheduler.alpha.kubernetes.io/node-selector`, її значення використовується як селектор вузлів.
2. Якщо простір імен не має такої анотації, як селектор вузлів використовується `clusterDefaultNodeSelector`, визначений у конфігураційному файлі втулка `PodNodeSelector`.
3. Селектор вузлів Podʼа перевіряється на конфлікти з селектором вузлів простору імен. Конфлікти призводять до відхилення.
4. Селектор вузлів Podʼа перевіряється на конфлікти з дозволеним селектором для конкретного простору імен, визначеним у конфігураційному файлі втулка. Конфлікти призводять до відхилення.

{{< note >}}
PodNodeSelector дозволяє примусово запускати Podʼи на вузлах з певними мітками. Дивіться також втулок допуску PodTolerationRestriction, який дозволяє запобігти запуску Podʼів на вузлах з певними taints.
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

**Тип**: Валідаційний.

Контролер допуску PodSecurity перевіряє нові Podʼи перед їх допуском і визначає, чи варто їх допускати, на основі запитуваного контексту безпеки та обмежень щодо дозволених [Стандартів безпеки для Podʼів](/docs/concepts/security/pod-security-standards/) для простору імен, в якому буде знаходитися Pod.

Дивіться документацію [Pod Security Admission](/docs/concepts/security/pod-security-admission/) для отримання додаткової інформації.

PodSecurity замінив старіший контролер допуску під назвою PodSecurityPolicy.

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

**Тип**: Змінювальний та валідаційний.

Контролер допуску PodTolerationRestriction перевіряє конфлікти між tolerations Podʼа та tolerations його простору імен. Він відхиляє запит Podʼа у разі конфлікту. Потім він обʼєднує tolerations, вказані в анотаціях простору імен, з tolerations Podʼа. Отримані tolerations перевіряються щодо списку дозволених tolerations, вказаного в анотаціях простору імен. Якщо перевірка пройде успішно, запит Podʼа допускається, інакше він відхиляється.

Якщо простір імен Podʼа не має повʼязаних з ним типових tolerations або дозволених tolerations, вказаних в анотаціях, використовуються типові tolerations на рівні кластера або список дозволених tolerations на рівні кластера, якщо вони зазначені.

Tolerations призначаються простору імен за допомогою ключа анотації `scheduler.alpha.kubernetes.io/defaultTolerations`. Список дозволених tolerations можна додати за допомогою ключа анотації `scheduler.alpha.kubernetes.io/tolerationsWhitelist`.

Приклад анотацій простору імен:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

Цей контролер допуску типово вимкнено.

### PodTopologyLabels {#podtopologylabels}

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

**Тип**: Змінювальний

Контролер допуску PodTopologyLabels змінює субресурси `pods/binding` для всіх Podʼів, привʼязаних до вузла, додаючи мітки топології, що відповідають міткам привʼязаного вузла. Це дозволяє зробити мітки топології вузла доступними як мітки Podʼів, які можна передати запущеним контейнерам за допомогою [Downward API](/docs/concepts/workloads/pods/downward-api/). Мітки, доступні завдяки цьому контролеру, — це мітки [topology.kubernetes.io/region](/docs/reference/labels-annotations-taints/#topologykubernetesioregion) та [topology.kubernetes.io/zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

{{<note>}}
Якщо будь-який змінювальний вебхук допуску додає або змінює мітки субресурсу `pods/binding`, ці зміни поширюватимуться на мітки Podʼів в результаті роботи цього контролера, перезаписуючи мітки з конфліктуючими ключами.
{{</note>}}

Цей контролер допуску увімкнено, коли увімкнено функціональну можливість `PodTopologyLabelsAdmission`.

### Priority {#priority}

**Тип**: Змінювальний та валідаційний.

Контролер допуску пріоритету використовує поле `priorityClassName` і заповнює цілочисельне значення пріоритету. Якщо клас пріоритету не знайдено, Pod відхиляється.

### ResourceQuota {#resourcequota}

**Тип**: Валідаційний.

Цей контролер допуску спостерігає за вхідним запитом і гарантує, що він не порушує жодних обмежень, перерахованих в обʼєкті `ResourceQuota` у `Namespace`. Якщо ви використовуєте обʼєкти `ResourceQuota` у вашому розгортанні Kubernetes, ви МАЄТЕ використовувати цей контролер допуску для забезпечення дотримання обмежень квот.

Дивіться [довідник API ResourceQuota](/docs/reference/kubernetes-api/core/resource-quota-v1/) та [приклад квоти ресурсів](/docs/concepts/policy/resource-quotas/) для отримання додаткових деталей.

### RuntimeClass {#runtimeclass}

**Тип**: Змінювальний та валідаційний.

Якщо ви визначаєте RuntimeClass з налаштованими [накладними витратами, повʼязаними з роботою Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/), цей контролер допуску перевіряє вхідні Podʼи. Коли його увімкнено, цей контролер допуску відхиляє будь-які запити на створення Podʼів, які вже мають встановлені накладні витрати (overhead). Для Podʼів, які мають налаштований і обраний у своєму `.spec` RuntimeClass, цей контролер допуску встановлює `.spec.overhead` у Pod на основі значення, визначеного у відповідному RuntimeClass.

Дивіться також [Накладні витрати, повʼязані з роботою Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/) для отримання додаткової інформації.

### ServiceAccount {#serviceaccount}

**Тип**: Змінювальний та валідаційний.

Цей контролер допуску реалізує автоматизацію для [службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/). Проєкт Kubernetes наполегливо рекомендує увімкнути цей контролер допуску. Вам слід увімкнути цей контролер допуску, якщо ви маєте намір використовувати обʼєкти `ServiceAccount` в Kubernetes.

Щоб посилити заходи безпеки щодо Secretʼів, використовуйте окремі простори імен для ізоляції доступу до змонтованих Secretʼів.

### StorageObjectInUseProtection {#storageobjectinuseprotection}

**Тип**: Змінювальний.

Втулок `StorageObjectInUseProtection` додає завершувачі `kubernetes.io/pvc-protection` або `kubernetes.io/pv-protection` до новостворених заявок на постійні томи (PVC) або постійних томів (PV). Якщо користувач видаляє PVC або PV, PVC або PV не видаляється, доки контролер захисту PVC або PV не прибере завершувач з PVC або PV.
Дивіться [Захист обʼєктів зберігання, які використовуються](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection) для отримання детальнішої інформації.

### TaintNodesByCondition {#taintnodesbycondition}

**Тип**: Змінювальний.

Цей контролер допуску додає до новостворених вузлів {{< glossary_tooltip text="taints" term_id="taint" >}} `NotReady` та `NoSchedule`. Таке додавання taints дозволяє уникнути стану гонитви, який може призвести до того, що Podʼи будуть заплановані на нові вузли до того, як їхні taints буде оновлено для точного відображення їхніх звітних станів.

### ValidatingAdmissionPolicy {#validatingadmissionpolicy}

**Тип**: Валідаційний.

[Цей контролер допуску](/docs/reference/access-authn-authz/validating-admission-policy/) реалізує перевірку CEL для вхідних запитів, що збігаються. Він увімкнений, коли увімкнені як функціональна можливість `validatingadmissionpolicy`, так і група/версія `admissionregistration.k8s.io/v1alpha1`. Якщо будь-яка з політик ValidatingAdmissionPolicy не спрацьовує, запит не виконується.

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

**Тип**: Валідаційний.

Цей контролер допуску викликає будь-які валідаційні вебхуки, які відповідають запиту. Відповідні вебхуки викликаються паралельно; якщо будь-який з них відхиляє запит, запит не виконується. Цей контролер допуску працює лише на етапі валідації; вебхуки, які він викликає, не можуть змінювати обʼєкт, на відміну від вебхуків, які викликаються контролером допуску `MutatingAdmissionWebhook`.

Якщо вебхук, який викликається цим контролером, має побічні ефекти (наприклад, зменшення квоти), він _обовʼязково_ повинен мати систему узгодження, оскільки не гарантується, що подальші вебхуки або інші валідаційні контролери допуску дозволять завершити запит.

Якщо ви вимкнете ValidatingAdmissionWebhook, вам також слід вимкнути обʼєкт `ValidatingWebhookConfiguration` у групі/версії `admissionregistration.k8s.io/v1` за допомогою прапорця `--runtime-config`.

## Чи існує рекомендований набір контролерів допуску для використання? {#is-there-a-recommended-set-of-admission-controllers-to-use}

Так. Рекомендовані контролери допуску типово увімкнені (дивіться [тут](/docs/reference/command-line-tools-reference/kube-apiserver/#options)), тому вам не потрібно явно вказувати їх. Ви можете увімкнути додаткові контролери допуску понад типовий набір за допомогою прапорця `--enable-admission-plugins` (**порядок не має значення**).
