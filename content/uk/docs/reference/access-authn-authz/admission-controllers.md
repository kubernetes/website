---

title: Контролери допуску в Kubernetes
linkTitle: Контролери допуску
content_type: concept
weight: 40
---

<!-- overview -->

Ця сторінка надає огляд _контролерів допуску_.

_Контролер допуску_ — це фрагмент коду, який перехоплює запити до сервера API Kubernetes перед збереженням обʼєкта, але після того, як запит був автентифікований та авторизований.

Кілька важливих функцій Kubernetes вимагають увімкнення контролера допуску, щоб належним чином підтримувати функцію.  Як наслідок, сервер API Kubernetes, який не налаштований належним чином з правильним набором контролерів допуску, є неповноцінним сервером, який не буде підтримувати всі функції, які ви очікуєте.

<!-- body -->

## Що це таке? {#what-are-they}

Контролери допуску є кодов в {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} Kubernetes, який перевіряє дані, що надходять на запит на зміну ресурсів.

Контролери допуску застосовуються до запитів на створення, видалення, зміну обʼєктів. Контролери допуску також можуть блокувати нестандартні дієслова, такі як запити на підключення до Podʼа через проксі сервера API. Контролери допуску _не_ блокують (і не можуть) запити на читання (**get**, **watch** або **list**) обʼєктів, оскільки читання оминає шар контролю допуску.

Механізми управління доступом можуть бути _валідаційними_, _модифікуючими_ або і тими, і іншими. Модифікуючі контролери можуть змінювати дані для ресурсу, який модифікується; валідаційні контролери не можуть.

Контролери допуску в Kubernetes {{< skew currentVersion >}} складаються зі [списку](#what-does-each-admission-controller-do) нижче, вбудовані у двійковий файл `kube-apiserver` і можуть бути налаштовані тільки адміністратором кластера.

### Точки розширення контролю допуску {#admission-control-extension-points}

У повному [списку](#what-does-each-admission-controller-do) є три спеціальні контролери: [MutatingAdmissionWebhook](#mutatingadmissionwebhook), [ValidatingAdmissionWebhook](#validatingadmissionwebhook) та [ValidatingAdmissionPolicy](#validatingadmissionpolicy). Обидва контролери веб-хуків виконують мутацію та валідацію (відповідно) [веб-хуки контролю доступу](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks), які налаштовуються в API. ValidatingAdmissionPolicy надає спосіб вбудувати декларативний код перевірки в API, не покладаючись на будь-які зовнішні HTTP-виклики.

Ви можете використовувати ці три контролери допуску, щоб налаштувати поведінку кластера під час допуску.

## Етапи контролю допуску {#admission-control-phases}

Процес контролю допуску проходить у два етапи. На першому етапі виконуються модифікуючі контролери допуску. На другому етапі виконуються валідаційні контролери допуску. Знову ж таки, деякі контролери є обома.

Якщо будь-який з контролерів на будь-якому етапі відхиляє запит, весь запит негайно відхиляється, і користувачу повертається помилка.

Нарешті, окрім іноді модифікації обʼєкта, про який йдеться, контролери допуску можуть іноді мати побічні ефекти, тобто змінювати повʼязані ресурси в процесі обробки запиту. Збільшення використання квоти є класичним прикладом того, чому це необхідно. Будь-який такий побічний ефект потребує відповідного процесу рекламації або узгодження, оскільки даний контролер допуску не знає напевно, що даний запит пройде через всі інші контролери допуску.

Порядок цих викликів можна побачити нижче.

{{< figure src="/uk/docs/reference/access-authn-authz/admission-control-phases.svg" alt="Діаграма послідовності обробки запитів kube-apiserver під час фази допуску, яка показує мутацію вебхуків, потім перевірку політик допуску і, нарешті, перевірку вебхуків. З діаграми видно, що процес продовжується до першої відмови або до того моменту, поки всі вони не будуть прийняті. Також показано, що мутації шляхом мутації вебхуків призводять до повторного виклику всіх раніше викликаних вебхуків." class="diagram-large" link="[https://mermaid.live/edit#pako:eNq1Vt9PG0cQ_ldWV6GCaox_gItPFRIlD42qSJFIU6nyy97d2t5wd3vd3QMcZClAafqASoUQkapK_RcciygOIfZ7n_b-o87u3dnGGNo-1A_23e7MNzPffLPeA8tlHrFsS5AfYxK65BHFLY6DRtgIFxbQN3iXIMmQIBI1WSi36UuCWj5zsO93EBZItqlAVISfS8SJiIgriYe82Di1pYyEvbLSorIdO0WXBSsB4QGm3vILkT-uUCFiIlaq9XpJhzygIZX2QcOSbRKQhmU3rJDEkmO_YRUaVp4EbKCGValE-7AMT3n6eh2cA8o545uuZFzAkuQx6RYaIYJPhvwcc4odn4jUw2yl21h7fb3TMrE_q1ZqLlnTsWdNnpF9ucV8xo3hXptKMmPmMxZNW6H78EImCUScsmtx0pkxmld6I-x2uwsLulupKfTsWdoSaA1B2JfLEjKA5nGEXZcIQR3qU9kpIBx6SLRZ7HvIISiOPKx7R3YJ7yBJA2IAvFQOgFdMAwDIIyJcPs3Zdkb-2FpH24kdsowjKggHSNSGcD4NWyATMBZSgEq4fjdpegHIgLIQRW0siE5rT-8FscRSL-8Rp83YjigAtO-zPUjU6aBd7FPIGizHABHzqUuJMNU1aWh0OrEbAxXRJP3H0gTUjGFp8nGBahqCimP49c1Sk3KhNf4CJA5xCghKdIiG1LRGMs0IwiHW1A7BTATsCzYdJi9NaLf0ZSo95OJYEAMXcbJLWSygDhfeIc7YCGYMOpet4hamYdakbi6HCHMJfEQ4lOg76IQeWfW7Giav1CA5TI6SY9VXveQ1umu--fSxtv4W2shDIoFSvbJtujnHOpZtA_6b6idH6p36BN-D5KfkUl1DgJ-Ty-QMfZFvm_jqfb4xlu4tRC_YktzXoJtjeWxBYzjzUweH7SPechYrq2sFlH8tIVOgjg9Bhuqjepe8QuoKHkfJcXKorpNj9JXDN9Q5pHAN-wOT4QXYnwIlZ8YWqZH2S36BVN8gyPkSVm8Ao68Gd4t_krXv-7Qxhoc_wPgqZwAC_5q8hkgfAAvIeZucAPPXi2qwdBft-VitT5kpX_0JlfR0aMi2l6UGKJAV_F6rwUx5D0FOp3gOoB9NZaYP6oP69ECKJPQmx4zR0vLGhtGEjdQbgBpBtUea2cVFAIJ302TNcE9dFZCWGyCn0gNtoIh5S5nuNIpBAxXZD2sIHu-oF0gBy17a1ll2eik773VsU27_Hoy8Nn1qI3UBtme684eAc4JM8-f0U29N0aXhJ2NvhkLXNSMQG82IT9NxX4Rb-BPsWc1N0TcjPVOfjqDxMi0nJ0ZMphGGtaF6-9dNcgH2R2hRT6aW2dDMEAS_LYL7SRpNhDpHplmvc1Ju6Xw-JaN_EH6KeHtgpog4ny0V_ec6YYrultmfNzhzlKCxe6YEOIXA4xTshvey8KA4-v9iVv9_NsZZw8DampfxXOWIPXAbzhEZ0ujpEZHPmRl6DaYPkzw_HT_zPjVnydyjRB90o7QXWUDtdmPCAWWQtlWwsgsm3G3NVWVyo4RHjzRx7EtzgQJTHEu23Qnd9KZYsDiLW23LbsKfNrylV6PsYjxehYP1B8aC3IV4FO6ET9LLtLlTGxPLPrD2Lbu8Xqyt1ivlL8ul2nqpVKsUrI5lV6qlYqVWXV-t1erV8lql1i1YLw1muVhKP-VyvVxfWy-vd_8GvxhqLw](https://mermaid.live/edit#pako:eNq1Vt9PG0cQ_ldWV6GCaox_gItPFRIlD42qSJFIU6nyy97d2t5wd3vd3QMcZClAafqASoUQkapK_RcciygOIfZ7n_b-o87u3dnGGNo-1A_23e7MNzPffLPeA8tlHrFsS5AfYxK65BHFLY6DRtgIFxbQN3iXIMmQIBI1WSi36UuCWj5zsO93EBZItqlAVISfS8SJiIgriYe82Di1pYyEvbLSorIdO0WXBSsB4QGm3vILkT-uUCFiIlaq9XpJhzygIZX2QcOSbRKQhmU3rJDEkmO_YRUaVp4EbKCGValE-7AMT3n6eh2cA8o545uuZFzAkuQx6RYaIYJPhvwcc4odn4jUw2yl21h7fb3TMrE_q1ZqLlnTsWdNnpF9ucV8xo3hXptKMmPmMxZNW6H78EImCUScsmtx0pkxmld6I-x2uwsLulupKfTsWdoSaA1B2JfLEjKA5nGEXZcIQR3qU9kpIBx6SLRZ7HvIISiOPKx7R3YJ7yBJA2IAvFQOgFdMAwDIIyJcPs3Zdkb-2FpH24kdsowjKggHSNSGcD4NWyATMBZSgEq4fjdpegHIgLIQRW0siE5rT-8FscRSL-8Rp83YjigAtO-zPUjU6aBd7FPIGizHABHzqUuJMNU1aWh0OrEbAxXRJP3H0gTUjGFp8nGBahqCimP49c1Sk3KhNf4CJA5xCghKdIiG1LRGMs0IwiHW1A7BTATsCzYdJi9NaLf0ZSo95OJYEAMXcbJLWSygDhfeIc7YCGYMOpet4hamYdakbi6HCHMJfEQ4lOg76IQeWfW7Giav1CA5TI6SY9VXveQ1umu--fSxtv4W2shDIoFSvbJtujnHOpZtA_6b6idH6p36BN-D5KfkUl1DgJ-Ty-QMfZFvm_jqfb4xlu4tRC_YktzXoJtjeWxBYzjzUweH7SPechYrq2sFlH8tIVOgjg9Bhuqjepe8QuoKHkfJcXKorpNj9JXDN9Q5pHAN-wOT4QXYnwIlZ8YWqZH2S36BVN8gyPkSVm8Ao68Gd4t_krXv-7Qxhoc_wPgqZwAC_5q8hkgfAAvIeZucAPPXi2qwdBft-VitT5kpX_0JlfR0aMi2l6UGKJAV_F6rwUx5D0FOp3gOoB9NZaYP6oP69ECKJPQmx4zR0vLGhtGEjdQbgBpBtUea2cVFAIJ302TNcE9dFZCWGyCn0gNtoIh5S5nuNIpBAxXZD2sIHu-oF0gBy17a1ll2eik773VsU27_Hoy8Nn1qI3UBtme684eAc4JM8-f0U29N0aXhJ2NvhkLXNSMQG82IT9NxX4Rb-BPsWc1N0TcjPVOfjqDxMi0nJ0ZMphGGtaF6-9dNcgH2R2hRT6aW2dDMEAS_LYL7SRpNhDpHplmvc1Ju6Xw-JaN_EH6KeHtgpog4ny0V_ec6YYrultmfNzhzlKCxe6YEOIXA4xTshvey8KA4-v9iVv9_NsZZw8DampfxXOWIPXAbzhEZ0ujpEZHPmRl6DaYPkzw_HT_zPjVnydyjRB90o7QXWUDtdmPCAWWQtlWwsgsm3G3NVWVyo4RHjzRx7EtzgQJTHEu23Qnd9KZYsDiLW23LbsKfNrylV6PsYjxehYP1B8aC3IV4FO6ET9LLtLlTGxPLPrD2Lbu8Xqyt1ivlL8ul2nqpVKsUrI5lV6qlYqVWXV-t1erV8lql1i1YLw1muVhKP-VyvVxfWy-vd_8GvxhqLw)" >}}

## Навіщо вони мені потрібні? {#why-do-i-need-them}

Кілька важливих функцій Kubernetes вимагають увімкнення контролера доступу, щоб належним чином підтримувати функцію. Як наслідок, сервер API Kubernetes, який не налаштований належним чином з правильним набором контролерів доступу, є неповним сервером і не буде підтримувати всі функції, які ви очікуєте.

## Як увімкнути контролер допуску? {#how-do-i-turn-on-an-admission-controller}

Прапорець сервера API Kubernetes `enable-admission-plugins` приймає через кому список втулків контролю допуску, які слід викликати перед зміною обʼєктів у кластері. Наприклад, наступна команда увімкне втулки контролю допуску `NamespaceLifecycle` та `LimitRanger`:

```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
Залежно від того, як ваш кластер Kubernetes розгорнутий і як запускається сервер API, вам може знадобитися застосувати налаштування різними способами. Наприклад, вам може знадобитися змінити файл системного блоку systemd, якщо сервер API розгорнуто як службу systemd ви можете змінити файл маніфесту для сервера API, якщо Kubernetes розгорнуто як самостійний хостинг.
{{< /note >}}

## Як вимкнути контролер допуску? {#how-do-i-turn-off-an-admission-controller}

Прапорець сервера API Kubernetes `disable-admission-plugins` приймає через кому список втулків контролю допуску, які слід вимкнути, навіть якщо вони є у списку втулків, що є стандартно увімкненими.

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

## Які втулки є стандартно увімкненими? {#which-plugins-are-enabled-by-default}

Щоб побачити, які втулки допуску увімкнені:

```shell
kube-apiserver -h | grep enable-admission-plugins
```

У Kubernetes {{< skew currentVersion >}} стандартно увімкнені такі втулки:

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook
```

## Що робить кожен контролер допуску? {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**Тип**: Валідаційний.

Цей контролер допуску дозволяє запуск всіх Podʼів в кластер. Він **застарілий**, оскільки його поведінка така ж, якби не було ніякого контролера допуску взагалі.

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**Тип**: Валідаційний.

Відхиляє всі запити. AlwaysDeny **застарілий**, оскільки не має реального значення.

### AlwaysPullImages {#alwayspullimages}

**Тип**: Модифікуючий та Валідаційний.

Цей контролер допуску модифікує кожен новий Pod, щоб примусити використовувати політику завантаження образів `Always`. Це корисно в багатокористувацькому кластері, щоб користувачі могли бути впевнені, що їхні приватні образи можуть використовувати лише ті, хто має відповідні облікові дані для їх завантаження. Без цього контролера допуску, після того, як образи було завантажено на вузол, будь-який Pod будь-якого користувача може використовувати його, знаючи імʼя образу (за умови, що Pod розміщений на правильному вузлі), без жодної перевірки  вторизації для образу. Коли цей контролер допуску увімкнений, образи завжди завантажуються перед запуском контейнерів, що означає, що потрібні дійсні облікові дані.

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

Цей контролер допуску спостерігає за створенням ресурсів CertificateSigningRequest, які мають `spec.signerName` значення `kubernetes.io/kube-apiserver-client`. Він відхиляє будь-який запит, який вказує групу (або атрибут організації) `system:masters`.

### DefaultIngressClass {#defaultingressclass}

**Тип**: Модифікуючий.

Цей контролер допуску спостерігає за створенням обʼєктів `Ingress`, які не запитують жодного конкретного класу ingress, і автоматично додає до них стандартний клас ingress. Таким чином, користувачі, які не запитують жодного спеціального класу ingress, не повинні про це турбуватися та отримають стандартний клас.

Цей контролер допуску нічого не робить, коли не налаштований жоден стандартний клас ingress. Коли більше одного класу ingress позначено як стандартний клас, він відхиляє будь-яке створення `Ingress` з помилкою, і адміністратор повинен переглянути свої обʼєкти `IngressClass` та позначити лише один як стандартний клас (з анотацією "ingressclass.kubernetes.io/is-default-class"). Цей контролер допуску ігнорує будь-які оновлення `Ingress`; він діє тільки при створенні.

Дивіться документацію [Ingress](/docs/concepts/services-networking/ingress/) для отримання додаткової інформації про класи ingress і як позначити один як стандартний клас.

### DefaultStorageClass {#defaultstorageclass}

**Тип**: Модифікуючий.

Цей контролер допуску спостерігає за створенням обʼєктів `PersistentVolumeClaim`, які не запитують жодного конкретного класу зберігання, і автоматично додає до них стандартний клас зберігання. Таким чином, користувачі, які не запитують жодного спеціального класу зберігання, не повинні про це турбуватися та отримають стандартний клас.

Цей контролер допуску нічого не робить, якщо не існує стандартного `StorageClass`. Коли більше ніж один клас сховища позначено як стандартний, а потім ви створюєте `PersistentVolumeClaim` без встановленого `storageClassName`, Kubernetes використовує останній створений стандартний `StorageClass`. Коли `PersistentVolumeClaim` створено із зазначеним `volumeName`, він залишається у стані очікування якщо `storageClassName` статичного тому не збігається з `storageClassName` у `PersistentVolumeClaim` після застосування до нього будь-якого стандартного класу сховища. Цей контролер доступу ігнорує будь-які оновлення `PersistentVolumeClaim`; він діє лише при створенні.

Дивіться документацію [постійних томів](/docs/concepts/storage/persistent-volumes/) про persistent volume claims та класи зберігання, а також як позначити клас зберігання як стандартний клас.

### DefaultTolerationSeconds {#defaulttolerationseconds}

**Тип**: Модифікуючий.

Цей контролер допуску встановлює стандартне значення толерантності для Podʼів, щоб терпіти taints `notready:NoExecute` та `unreachable:NoExecute` на основі параметрів введення k8s-apiserver `default-not-ready-toleration-seconds` та `default-unreachable-toleration-seconds`, якщо Podʼи ще не мають толерантності до taints `node.kubernetes.io/not-ready:NoExecute` або `node.kubernetes.io/unreachable:NoExecute`. Стандартне значення для `default-not-ready-toleration-seconds` та `default-unreachable-toleration-seconds` становить 5 хвилин.

### DenyServiceExternalIPs

**Тип**: Валідаційний.

Цей контролер допуску відхиляє всі нові використання поля `externalIPs` у `Service`. Ця функція дуже потужна (дозволяє перехоплення мережевого трафіку) і не контролюється належним чином політиками. Коли цей контролер увімкнено, користувачі кластера не можуть створювати нові Serviceʼи, які використовують `externalIPs`, і не можуть додавати нові значення до `externalIPs` в поточних обʼєктах `Service`. Поточні використання `externalIPs` не зачіпаються, і користувачі можуть видаляти значення з `externalIPs` в наявних обʼєктах `Service`.

Більшість користувачів взагалі не потребує цієї функції, і адміністратори кластера повинні розглянути можливість її вимкнення. Кластери, які потребують цієї функції, повинні розглянути можливість використання власних політик для керування її використанням.

Цей контролер допуску стандартно вимкнено.

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

**Тип**: Валідаційний.

Цей контролер допуску зменшує проблему, коли API-сервер переповнюється запитами на зберігання нових подій (Events). Адміністратор кластера може вказати обмеження швидкості подій, виконавши такі кроки:

* Увімкнути контролер допуску `EventRateLimit`;
* Посилатися на конфігураційний файл `EventRateLimit` з файлу, наданого у командному рядку API-сервера з прапорцем `--admission-control-config-file`:

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
* `User`: Кожен користувач отримує кошик.
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

Цей контролер допуску стандартно вимкнено.

### ExtendedResourceToleration {#extendedresourcetoleration}

**Тип**: Модифікуючий.

Цей втулок полегшує створення виділених вузлів з розширеними ресурсами. Якщо оператори хочуть створити виділені вузли з розширеними ресурсами (наприклад, GPU, FPGA тощо), вони повинні [накладати taint на вузол](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) з іменем розширеного ресурсу як ключем. Цей контролер допуску, якщо він увімкнений, автоматично додає толерантності до таких taint у Podʼи, які запитують розширені ресурси, тому користувачам не потрібно вручну додавати ці толерантності.

Цей контролер допуску стандартно вимкнено.

### ImagePolicyWebhook {#imagepolicywebhook}

**Тип**: Валідаційний.

Контролер допуску ImagePolicyWebhook дозволяє бекенд-вебхуку приймати рішення про допуск.

Цей контролер допуску стандартно вимкнено.

#### Формат конфігураційного файлу {#imagereview-config-file-format}

ImagePolicyWebhook використовує конфігураційний файл для налаштування поведінки бекенду. Цей файл може бути у форматі JSON або YAML і має наступний формат:

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

Посилання на конфігураційний файл ImagePolicyWebhook повинно бути зазначене у файлі, який передається прапорцю командного рядка API-сервера `--admission-control-config-file`:

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

Поле `cluster` у файлі kubeconfig має посилатися на віддалений сервіс, а поле `user` повинно містити дані авторизації.

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

#### Вміст запитів {#request-payload}

Під час прийняття рішення про допуск, API-сервер надсилає POST-запит з серіалізованим у форматі JSON обʼєктом `imagepolicy.k8s.io/v1alpha1` `ImageReview`, що описує дію. Цей обʼєкт містить поля, що описують контейнери, які підлягають допуску, а також будь-які анотації Podʼа, що відповідають `*.image-policy.k8s.io/*`.

{{< note >}}
Обʼєкти API вебхуків підлягають тим самим правилам сумісності версій, що й інші обʼєкти API Kubernetes. Імплементатори повинні знати про менш жорсткі обіцянки сумісності для альфа-обʼєктів і перевіряти поле `apiVersion` запиту для забезпечення правильної десеріалізації. Крім того, API-сервер повинен увімкнути групу розширень API `imagepolicy.k8s.io/v1alpha1` (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
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

Для додаткової документації дивіться [API `imagepolicy.v1alpha1`](/docs/reference/config-api/imagepolicy.v1alpha1/).

#### Розширення за допомогою анотацій {#extending-with-annotations}

Усі анотації на Podʼі, що відповідають `*.image-policy.k8s.io/*`, надсилаються до вебхука. Надсилання анотацій дозволяє користувачам, які знають про бекенд політики образів, надсилати додаткову інформацію до нього, а також дозволяє реалізаціям різних бекендів приймати різну інформацію.

Приклади інформації, яку ви можете тут розмістити:

* запит на "пробиття" для обходу політики у разі надзвичайної ситуації;
* номер квитка з системи квитків, що документує запит на "пробиття";
* підказка серверу політики щодо imageID наданого образу для економії часу на пошук.

У будь-якому випадку, анотації надаються користувачем і не перевіряються Kubernetes будь-яким чином.

### LimitPodHardAntiAffinityTopology {#limitpodhardantiaffinitytopology}

**Тип**: Валідаційний.

Цей контролер допуску забороняє будь-який Pod, який визначає ключ топології `AntiAffinity` відмінний від `kubernetes.io/hostname` у `requiredDuringSchedulingRequiredDuringExecution`.

Цей контролер допуску стандартно вимкнено.

### LimitRanger {#limitranger}

**Тип**: Модифікуючий та Валідаційний.

Цей контролер допуску спостерігає за вхідним запитом та забезпечує, щоб він не порушував жодних обмежень, перерахованих в обʼєкті `LimitRange` в `Namespace`. Якщо ви використовуєте обʼєкти `LimitRange` у своєму розгортанні Kubernetes, ви МАЄТЕ використовувати цей контролер допуску для забезпечення дотримання цих обмежень. LimitRanger також може використовуватися для застосування стандартних ресурсних запитів до Pod, які їх не вказують; наразі стандартний LimitRanger застосовує вимогу до 0.1 CPU до всіх Pod у `default` namespace.

Дивіться [довідник LimitRange API](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/) та [приклад LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) для отримання додаткової інформації.

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

**Тип**: Модифікуючий.

Цей контролер допуску викликає будь-які модифікуючі вебхуки, які відповідають запиту. Відповідні вебхуки викликаються послідовно; кожен з них може змінити обʼєкт, якщо це необхідно.

Цей контролер допуску (як випливає з назви) працює лише на етапі модифікації.

Якщо вебхук, викликаний цим контролером, має побічні ефекти (наприклад, зменшення квоти), він _повинен_ мати систему узгодження, оскільки не гарантується, що наступні вебхуки або контролери допуску дозволять завершити запит.

Якщо ви вимкнете MutatingAdmissionWebhook, ви також повинні вимкнути обʼєкт `MutatingWebhookConfiguration` у групі/версії `admissionregistration.k8s.io/v1` за допомогою прапорця `--runtime-config`, обидва стандартно увімкнені.

#### Будьте обережні при створенні та встановленні модифікуючих вебхуків {#use-caution-when-creating-and-installing-mutating-webhooks}

* Користувачі можуть бути спантеличені, коли обʼєкти, які вони намагаються створити, відрізняються від того, що вони отримують назад.
* Вбудовані контрольні цикли можуть зламатися, коли обʼєкти, які вони намагаються створити, відрізняються при зворотному читанні.
  * Встановлення спочатку незаданих полів менш ймовірно викличе проблеми, ніж переписування полів, встановлених у початковому запиті. Уникайте останнього.
* Майбутні зміни в контрольних циклах для вбудованих або сторонніх ресурсів можуть зламати вебхуки, які добре працюють сьогодні. Навіть коли API вебхука для установки буде фіналізовано, не всі можливі поведінки вебхука будуть гарантовано підтримуватися нескінченно.

### NamespaceAutoProvision {#namespaceautoprovision}

**Тип**: Модифікуючий.

Цей контролер допуску перевіряє всі вхідні запити на ресурси, що належать до namespace, і перевіряє чи існує зазначений namespace. Він створює namespace, якщо його не знайдено. Цей контролер допуску корисний у розгортаннях, які не хочуть обмежувати створення namespace до його використання.

### NamespaceExists {#namespaceexists}

**Тип**: Валідаційний.

Цей контролер допуску перевіряє всі запити на ресурси, що належать до namespace, крім самого `Namespace`. Якщо namespace, на який посилається запит, не існує, запит відхиляється.

### NamespaceLifecycle {#namespacelifecycle}

**Тип**: Валідаційний.

Цей контролер допуску забезпечує, що `Namespace`, який знаходиться в процесі завершення, не може мати нові обʼєкти, створені в ньому, і забезпечує відхилення запитів у неіснуючому `Namespace`. Цей контролер допуску також запобігає видаленню трьох системно зарезервованих namespaces: `default`, `kube-system`, `kube-public`.

Видалення `Namespace` запускає послідовність операцій, які видаляють усі обʼєкти (Pod, Service, тощо) у цьому namespace. Для забезпечення цілісності цього процесу, ми наполегливо рекомендуємо використовувати цей контролер допуску.

### NodeDeclaredFeatureValidator {#nodedeclaredfeaturevalidator}

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

**Тип**: Валідаційний.

Цей контролер допуску перехоплює записи до привʼязаних Podʼів, щоб забезпечити сумісність з функціями, оголошеними вузлом, де Pod зараз працює. Він використовує поле `.status.declaredFeatures` обʼєкта `Node`, щоб визначити набір увімкнених функцій. Якщо оновлення Podʼа вимагає функції, якої немає у функціях поточного вузла, контролер допуску відмовить у запиті на оновлення. Це запобігає помилкам під час виконання через несумісність функцій після того, як Pod був запланований.

Цей контролер допуску є стандартно увімкненим, якщо увімкнено функціональну можливість [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures).

### NodeRestriction {#noderestriction}

**Тип**: Валідаційний.

Цей контролер допуску обмежує обʼєкти `Node` і `Pod`, які kubelet може змінювати. Для того, щоб бути обмеженим цим контролером допуску, kubelets повинні використовувати облікові дані у групі `system:nodes`, з іменем користувача у формі `system:node:<nodeName>`. Такі kubelets будуть мати дозвіл лише змінювати свої власні обʼєкти API `Node`, і лише змінювати обʼєкти API `Pod`, які привʼязані до їх вузла. kubelets не мають права оновлювати або видаляти taint зі свого обʼєкта API `Node`.

Втулок допуску `NodeRestriction` перешкоджає kubelets видаляти їх обʼєкт API `Node`, і забезпечує оновлення kubeletʼом міток з префіксами `kubernetes.io/` або `k8s.io/` наступним чином:

* **Перешкоджає** kubelets додавання/видалення/оновлення міток з префіксом `node-restriction.kubernetes.io/`. Цей префікс міток зарезервовано для адміністраторів для позначення мітками своїх обʼєктів `Node` з метою ізоляції робочих навантажень, і kubelets не буде дозволено змінювати мітки з цим префіксом.
* **Дозволяє** kubelets додавати/видаляти/оновлювати ці мітки та префікси міток:
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

Використання будь-яких інших міток під префіксами `kubernetes.io` або `k8s.io` kubelets зарезервовано, і може бути заборонено або дозволено втулком допуску `NodeRestriction` у майбутньому.

Майбутні версії можуть додати додаткові обмеження для забезпечення того, щоб kubelets мали мінімальний набір дозволів, необхідних для правильної роботи.

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

**Тип**: Валідаційний.

Цей контролер допуску захищає доступ до `metadata.ownerReferences` обʼєкта, так що тільки користувачі з правами **delete** у обʼєкта можуть його змінювати. Цей контролер допуску також захищає доступ до `metadata.ownerReferences[x].blockOwnerDeletion` обʼєкта, так що тільки користувачі з правами **update** у субресурсу `finalizers` посилального _власника_ можуть його змінювати.

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

**Тип**: Валідаційний.

Цей контролер допуску реалізує додаткові перевірки для перевірки вхідних запитів на зміну розміру `PersistentVolumeClaim`.

Рекомендується увімкнути контролер допуску `PersistentVolumeClaimResize`. Цей контролер допуску запобігає зміні розміру всіх вимог за замовчуванням, якщо тільки `StorageClass` вимоги явно не дозволяє зміну розміру, встановлюючи `allowVolumeExpansion` на `true`.

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

Для отримання додаткової інформації про persistent volume claims, дивіться [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

**Тип**: Валідаційний.

Цей контролер допуску задає та обмежує, які селектори вузлів можуть використовуватися в межах namespace, шляхом читання анотації namespace та глобальної конфігурації.

Цей контролер допуску стандартно вимкнено.

#### Формат конфігураційного файлу {#configuration-file-format}

`PodNodeSelector` використовує конфігураційний файл для налаштування параметрів поведінки бекенду. Зверніть увагу, що формат конфігураційного файлу буде змінено на версійований файл у майбутньому випуску. Цей файл може бути у форматі json або yaml і має наступний формат:

```yaml
podNodeSelectorPluginConfig:
  clusterDefaultNodeSelector: name-of-node-selector
  namespace1: name-of-node-selector
  namespace2: name-of-node-selector
```

Зверніться до конфігураційного файлу `PodNodeSelector` з файлу, наданого прапорцем командного рядка API-сервера
`--admission-control-config-file`:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```

#### Формат анотації конфігурації {#configuration-annotation-format}

`PodNodeSelector` використовує ключ анотації `scheduler.alpha.kubernetes.io/node-selector` для призначення селекторів вузлів до namespace.

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

1. Якщо `Namespace` має анотацію з ключем `scheduler.alpha.kubernetes.io/node-selector`, використовуйте її значення як селектор вузлів.
2. Якщо namespace не має такої анотації, використовуйте `clusterDefaultNodeSelector`, визначений у конфігураційному файлі втулка `PodNodeSelector`, як селектор вузлів.
3. Оцініть селектор вузлів Podʼа щодо селектора вузлів namespace на предмет конфліктів. Конфлікти призводять до відхилення.
4. Оцініть селектор вузлів Podʼа щодо дозволеного селектора, визначеного у конфігураційному файлі плагіну для конкретного namespace. Конфлікти призводять до відхилення.

{{< note >}}
`PodNodeSelector` дозволяє змусити Podʼи працювати на вузлах зі спеціальними мітками. Дивіться також втулок допуску `PodTolerationRestriction`, який дозволяє запобігти запуску Podʼів на вузлах зі спеціальними taintʼами.
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

**Тип**: Валідаційний.

Контролер допуску `PodSecurity` перевіряє нові Podʼи перед їх допуском і визначає, чи варто їх допускати на основі запитуваного контексту безпеки та обмежень щодо дозволених [Стандартів безпеки для Podʼів](/docs/concepts/security/pod-security-standards/) для namespace, в якому буде знаходитися Pod.

Дивіться [Pod Security Admission](/docs/concepts/security/pod-security-admission/) для отримання додаткової інформації.

`PodSecurity` замінив старіший контролер допуску під назвою `PodSecurityPolicy`.

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

**Тип**: Модифікуючий та Валідаційний.

Контролер допуску `PodTolerationRestriction` перевіряє конфлікти між толерантностями Podʼа та толерантностями його namespace. Він відхиляє запит Podʼа у разі конфлікту. Потім він обʼєднує толерантності, анотовані на namespace, з толерантностями Podʼа. Отримані толерантності перевіряються щодо списку дозволених толерантностей, анотованих на namespace. Якщо перевірка пройде успішно, запит Podʼа допускається, інакше він відхиляється.

Якщо namespace Podʼа не має повʼязаних з ним стандартних толерантностей або дозволених толерантностей, анотованих, використовуються стандартні толерантності на рівні кластера або список дозволених толерантностей на рівні кластера, якщо вони зазначені.

Толерантності призначаються namespace за допомогою ключа анотації `scheduler.alpha.kubernetes.io/defaultTolerations`. Список дозволених толерантностей можна додати за допомогою ключа анотації `scheduler.alpha.kubernetes.io/tolerationsWhitelist`.

Приклад анотацій для namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

Цей контролер допуску стандатно вимкнено.

### PodTopologyLabels {#podtopologylabels}

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

**Тип**: Модифікуючий

Контролер допуску PodTopologyLabels змінює субресурси `pods/binding` для всіх podʼів, привʼязаних до вузла, додаючи мітки топології, що відповідають міткам привʼязаного вузла. Це дозволяє зробити мітки топології вузла доступними як мітки podʼів, які можуть бути відображені у запущених контейнерах за допомогою [Downward API](/docs/concepts/workloads/pods/downward-api/). Мітки, доступні за допомогою цього контролера, — це мітки [topology.kubernetes.io/region](/docs/reference/labels-annotations-taints/#topologykubernetesioregion) та [topology.kuberentes.io/zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

{{< note >}}
Якщо будь-який модифікуючий вебхук допуску додає або змінює мітки субресурсу `pods/binding`, ці зміни поширюватимуться на мітки podʼів в результаті роботи цього контролера, перезаписуючи мітки з конфліктуючими ключами.
{{</ note >}}

Цей контролер допуску увімкнено, коли увімкнено функціональну можливість `PodTopologyLabelsAdmission`.

### Priority {#priority}

**Тип**: Модифікуючий та Валідаційний.

Контролер допуску `Priority` використовує поле `priorityClassName` і заповнює ціле значення пріоритету. Якщо клас пріоритету не знайдено, Pod відхиляється.

### ResourceQuota {#resourcequota}

**Тип**: Валідаційний.

Цей контролер допуску спостерігає за вхідним запитом і гарантує, що він не порушує жодних обмежень, перерахованих у обʼєкті `ResourceQuota` у `Namespace`. Якщо ви використовуєте обʼєкти `ResourceQuota` у вашому розгортанні Kubernetes, ви МАЄТЕ використовувати цей контролер допуску для забезпечення дотримання квот.

Дивіться [довідник ResourceQuota API](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/) та [приклад Resource Quota](/docs/concepts/policy/resource-quotas/) для отримання додаткових деталей.

### RuntimeClass {#runtimeclass}

**Тип**: Модифікуючий та Валідаційний.

Якщо ви визначаєте RuntimeClass з налаштованими [накладними витратами, повʼязаними з роботою Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/), цей контролер допуску перевіряє вхідні Podʼи. При увімкненні, цей контролер допуску відхиляє будь-які запити на створення Podʼів, які вже мають встановлений overhead. Для Podʼів, які мають налаштований і обраний у своєму `.spec` RuntimeClass, цей контролер допуску встановлює `.spec.overhead` у Pod на основі значення, визначеного у відповідному RuntimeClass.

Дивіться також [Накладні витрати, повʼязані з роботою Podʼів](/docs/concepts/scheduling-eviction/pod-overhead/) для отримання додаткової інформації.

### ServiceAccount {#serviceaccount}

**Тип**: Модифікуючий та Валідаційний.

Цей контролер допуску реалізує автоматизацію для [службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/). Проєкт Kubernetes наполегливо рекомендує увімкнути цей контролер допуску. Вам слід увімкнути цей контролер допуску, якщо ви маєте намір використовувати обʼєкти `ServiceAccount` в Kubernetes.

Щоб посилити заходи безпеки навколо Secrets, використовуйте окремі простори імен для ізоляції доступу до змонтованих секретів.

### StorageObjectInUseProtection

**Тип**: Модифікуючий.

Втулок `StorageObjectInUseProtection` додає завершувачі `kubernetes.io/pvc-protection` або `kubernetes.io/pv-protection` до новостворених Persistent Volume Claims (PVC) або Persistent Volumes (PV). У випадку видалення користувача PVC або PV PVC або PV не видаляється, поки завершувач не буде видалений з PVC або PV за допомогою контролера захисту PVC або PV.
Дивіться [Захист обʼєктів зберігання які використовуються](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection) для отримання детальнішої інформації.

### TaintNodesByCondition {#taintnodesbycondition}

**Тип**: Модифікуючий.

Цей контролер допуску додає {{< glossary_tooltip text="taint" term_id="taint" >}} до новостворених вузлів таких як `NotReady` та `NoSchedule`. Це позначення доволє уникнути стану перегонів, який може призвести до того, що Podʼи будуть заплановані на нових вузлах до того, як їх taint будуть оновлені для точної відповідності їх звітніх умов.

### ValidatingAdmissionPolicy {#validatingadmissionpolicy}

**Тип**: Валідаційний.

[Цей контролер допуску](/docs/reference/access-authn-authz/validating-admission-policy/) реалізує перевірку CEL для вхідних запитів, що збігаються. Він увімкнений, коли увімкнені як функціональна можливість `validatingadmissionpolicy`, так і група/версія `admissionregistration.k8s.io/v1alpha1`. Якщо будь-яка з політик ValidatingAdmissionPolicy не вдасться, запит не вдасться.

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

**Тип**: Валідаційний.

Цей контролер допуску викликає будь-які валідуючі вебхуки, які відповідають запиту. Валідуючі вебхуки викликаються паралельно; якщо будь-який з них відхиляє запит, запит не вдається. Цей контролер допуску працює лише на етапі валідації; вебхуки, які він викликає, не можуть змінювати обʼєкт, на відміну від вебхуків, які викликаються контролером допуску `MutatingAdmissionWebhook`.

Якщо вебхук який викликається цим контролером, має побічні ефекти (наприклад, зменшення квоти), то _обовʼязково_ має бути система реконсіляції, оскільки не гарантується, що подальші вебхуки або інші валідаційні контролери допуску дозволять закінчити запит.

Якщо ви вимкнете ValidatingAdmissionWebhook, вам також слід вимкнути обʼєкт `ValidatingWebhookConfiguration` у групі/версії `admissionregistration.k8s.io/v1` за допомогою прапорця `--runtime-config`.

## Чи існує рекомендований набір контролерів допуску для використання? {#is-there-a-recommended-set-of-admission-controllers-to-use}

Так. Рекомендовані контролери допуску стандартно увімкнені (дивіться [тут](/docs/reference/command-line-tools-reference/kube-apiserver/#options)), тому вам не потрібно явно вказувати їх. Ви можете увімкнути додаткові контролери допуску поза стандартним набором за допомогою прапорця `--enable-admission-plugins` (**порядок не має значення**).
