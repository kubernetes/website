---
title: Контроль допуску на основі маніфестів
content_type: concept
---

<!-- overview -->

{{< feature-state feature_gate_name="ManifestBasedAdmissionControlConfig" >}}

Цей розділ надає огляд конфігурації контролю допуску на основі маніфестів. Контроль допуску на основі маніфестів дозволяє завантажувати [вебхуки допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/) та політики CEL з статичних файлів на диску, а не з API Kubernetes. Ці політики активні з моменту запуску API-сервера, працюють незалежно від {{< glossary_tooltip text="etcd" term_id="etcd" >}} і можуть захищати ресурси допуску на основі API від модифікацій.

Щоб використовувати цю функцію, увімкніть функціональну можливість [`ManifestBasedAdmissionControlConfig`](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig)  і налаштуйте поле `staticManifestsDir` у файлі [AdmissionConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-AdmissionConfiguration), переданому kube-apiserver через `--admission-control-config-file`.

<!-- body -->

## Для чого використовувати контроль допуску на основі маніфестів? {#why-use-manifest-based-admission-control}

Політики допуску та вебхуки, зареєстровані через API Kubernetes (такі як ValidatingAdmissionPolicy, MutatingAdmissionPolicy, ValidatingWebhookConfiguration та MutatingWebhookConfiguration), мають кілька вроджених обмежень:

- **Пробіл при завантаженні**: Застосування політик через REST вимагає створення та завантаження обʼєктів API динамічним контролером допуску. До цього моменту політики не застосовуються.
- **Пробіл самозахисту**: Ресурси конфігурації допуску (такі як ValidatingWebhookConfiguration) самі не підпадають під вебхук-допуск, щоб уникнути циклічних залежностей. Користувач з достатніми привілеями може видалити або змінити критичні політики допуску.
- **Залежність від etcd**: Конфігурації допуску через REST залежать від доступності etcd. Якщо etcd недоступний або пошкоджений, політики допуску можуть не завантажитися правильно.

Контроль допуску на основі маніфестів вирішує ці обмеження, завантажуючи конфігурації з файлів на диску. Ці конфігурації:

- Активні з моменту готовності API-сервера обслуговувати запити
- Не видимі та не змінювані через API Kubernetes
- Незалежні від доступності etcd
- Можуть перехоплювати операції над ресурсами допуску на основі API самі по собі

## Підтримувані типи ресурсів {#supported-resource-types}

Ви можете включати наступні типи ресурсів у файли маніфестів. Підтримується лише версія API `admissionregistration.k8s.io/v1`.

{{< table caption="Підтримувані типи ресурсів для контролю допуску на основі маніфестів" >}}
| Назва втулка | Підтримувані типи ресурсів |
|:------------|:------------------------|
| `ValidatingAdmissionWebhook` | ValidatingWebhookConfiguration |
| `MutatingAdmissionWebhook` | MutatingWebhookConfiguration |
| `ValidatingAdmissionPolicy` | ValidatingAdmissionPolicy, ValidatingAdmissionPolicyBinding |
| `MutatingAdmissionPolicy` | MutatingAdmissionPolicy, MutatingAdmissionPolicyBinding |
{{< /table >}}

Ви також можете використовувати `v1.List`, щоб обʼєднати кілька ресурсів одного типу втулка в одному документі.

Кожна тека, вказана у `staticManifestsDir` для певного втулка допуску, повинна містити лише типи ресурсів, дозволені для цього втулка. Наприклад, тека, налаштована для втулка `ValidatingAdmissionPolicy`, може містити лише ресурси ValidatingAdmissionPolicy та ValidatingAdmissionPolicyBinding.

## Налаштування контролю допуску на основі маніфестів {#configuration}

Щоб увімкнути контроль допуску на основі маніфестів, вам потрібно:

1. Увімкнути функціональну можливість `ManifestBasedAdmissionControlConfig` на kube-apiserver.
1. Файл `AdmissionConfiguration` з полями `staticManifestsDir`, що вказують на теки, які містять ваші файли маніфестів.
1. Самі файли маніфестів на диску, доступні для процесу kube-apiserver.

### AdmissionConfiguration

Додайте `staticManifestsDir` до конфігурації втулка для кожного втулка допуску, який повинен завантажувати маніфести з диска. Кожен втулок потребує власної теки.

{{% code_sample language="yaml" file="access/manifest-admission-control/admission-configuration.yaml" %}}

Поле `staticManifestsDir` приймає абсолютний шлях до теки. Всі файли безпосередніх нащадків з розширеннями `.yaml`, `.yml` або `.json` у теці завантажуються. Підтеки та файли з іншими розширеннями ігноруються. Шаблони glob та відносні шляхи не підтримуються.

Передайте цей файл kube-apiserver за допомогою прапорця `--admission-control-config-file`.

### Типи конфігурацій {#configuration-types}

Кожен втулок допуску використовує конкретний тип конфігурації:

{{< table caption="Типи конфігурацій для кожного втулка допуску" >}}
| Втулок | apiVersion | kind |
|:-------|:-----------|:-----|
| `ValidatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `MutatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `ValidatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `ValidatingAdmissionPolicyConfiguration` |
| `MutatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `MutatingAdmissionPolicyConfiguration` |
{{< /table >}}

## Створення файлів маніфестів {#manifest-files}

Файли маніфестів містять стандартні визначення ресурсів Kubernetes. Ви можете включати кілька ресурсів в один файл, використовуючи роздільники документів YAML (`---`).

### Правила найменування {#naming}

Всі обʼєкти у файлах маніфестів повинні мати імена, що закінчуються суфіксом `.static.k8s.io`. Наприклад: `deny-privileged.static.k8s.io`.

Коли функціональна можливість `ManifestBasedAdmissionControlConfig` увімкнена, створення обʼєктів допуску на основі API з іменами, що закінчуються на `.static.k8s.io`, блокується. Коли функціональна можливість вимкнена, повертається лише попередження.

{{< note >}}
Якщо два файли маніфестів визначають обʼєкти одного типу з однаковими іменами, API-сервер не запускається, показуючи відповідну помилку.
{{< /note >}}

### Обмеження {#restrictions}

Конфігурації допуску на основі маніфестів існують ізольовано і не можуть посилатися на ресурси API. Застосовуються наступні обмеження:

- **Webhooks**: Повинні використовувати `clientConfig.url`. Поле `clientConfig.service` не дозволяється, оскільки мережа сервісів може бути недоступною під час запуску API-сервера.
- **Policies**: Поле `spec.paramKind` не дозволяється. Політики не можуть посилатися на ConfigMaps або інші обʼєкти кластера для параметрів.
- **Bindings**: Поле `spec.paramRef` не дозволяється. Поле `spec.policyName` повинно посилатися на політику, визначену в тому ж наборі файлів маніфестів, і повинно закінчуватися на `.static.k8s.io`.

Файли маніфестів декодуються за допомогою строгого декодера, який відхиляє файли, що містять дубльовані або невідомі поля. Кожен обʼєкт проходить те саме автоматичне заповнення та перевірку, що й REST API.

## Приклади {#examples}

### Захист ресурсів допуску на основі API {#protecting-admission-resources}

Ключовою можливістю допуску на основі маніфестів є здатність перехоплювати операції над ресурсами конфігурації допуску (ValidatingAdmissionPolicy, MutatingAdmissionPolicy, ValidatingWebhookConfiguration, MutatingWebhookConfiguration та їхні привʼязки). REST-орієнтовані вебхуки та політики допуску не викликаються для цих типів ресурсів, щоб уникнути циклічних залежностей, але політики на основі маніфестів можуть застосовувати правила до них, оскільки вони не мають цієї циклічної залежності.

Наступний приклад дозволяє запобігати видаленню або модифікації ресурсів допуску, які мають мітку `platform.example.com/protected: "true"`:

{{% code_sample language="yaml" file="access/manifest-admission-control/protect-admission-resources.yaml" %}}

### Застосування ValidatingAdmissionPolicy з диска {#enforcing-a-validatingadmissionpolicy-from-disk}

Наступний приклад визначає політику, яка забороняє привілейовані контейнери у всіх просторах імен, крім `kube-system`:

{{% code_sample language="yaml" file="access/manifest-admission-control/deny-privileged-policy.yaml" %}}

Помістіть цей файл у теку, налаштовану як `staticManifestsDir` для втулка `ValidatingAdmissionPolicy`. Політика та її привʼязка завантажуються разом атомарно.

### Налаштування ValidatingWebhookConfiguration з диска {#configuring-a-validatingwebhookconfiguration-from-disk}

Наступний приклад налаштовує вебхук перевірки, який викликає зовнішню URL-адресу:

{{% code_sample language="yaml" file="access/manifest-admission-control/validating-webhook.yaml" %}}

{{< note >}}
URL-адреси вебхуків повинні бути доступними для kube-apiserver під час запуску. Підтримуються лише точки доступу на основі URL-адрес; посилання на сервіси не допускаються в конфігураціях вебхуків на основі маніфестів.
{{< /note >}}

### Використання формату List {#using-the-list-format}

Ви можете використовувати `v1.List`, щоб групувати повʼязані ресурси в одному документі:

{{% code_sample language="yaml" file="access/manifest-admission-control/list-format-policy.yaml" %}}

## Порядок оцінки {#evaluation-order}

Конфігурації на основі маніфестів оцінюються до конфігурацій на основі API. Це забезпечує пріоритет політик на рівні платформи, які застосовуються через статичну конфігурацію, над політиками на основі API.

Для самих ресурсів конфігурації допуску (ValidatingAdmissionPolicy, MutatingAdmissionPolicy, ValidatingAdmissionPolicyBinding, MutatingAdmissionPolicyBinding, ValidatingWebhookConfiguration, MutatingWebhookConfiguration) оцінюються лише втулки допуску на основі маніфестів. Втулки на основі API пропускаються для цих типів ресурсів, щоб уникнути циклічних залежностей.

## Спостереження за файлами та динамічне перезавантаження {#dynamic-reloading}

kube-apiserver спостерігає за налаштованими теками на наявність змін:

1. **Початкове завантаження**: Під час запуску всі налаштовані шляхи читаються та перевіряються. API-сервер не стає готовим, поки всі маніфести не будуть успішно завантажені. Неправильні маніфести призводять до помилки запуску.

1. **Динамічне перезавантаження**: Зміни у файлах маніфестів запускають цикл перезавантаження:
   - Зміни файлів виявляються за допомогою [fsnotify](https://github.com/fsnotify/fsnotify) з резервним опитуванням (стандартний інтервал 1 хвилина), подібно до іншого перезавантаження конфігураційних файлів у kube-apiserver.
   - Обчислюється хеш вмісту всіх файлів маніфестів при кожній перевірці. Якщо хеш не змінився, перезавантаження не відбувається.
   - Нові конфігурації перевіряються перед застосуванням.
   - Якщо перевірка не вдається, помилка реєструється, метрики оновлюються, а попередня дійсна конфігурація зберігається.
   - Успішні перезавантаження атомарно замінюють попередню конфігурацію.

<!-- -->

1. **Атомарне оновлення файлів**: Щоб уникнути часткових читань під час запису файлів, вносьте зміни атомарно (наприклад, записуйте у тимчасовий файл і перейменовуйте його). Це особливо важливо при оновленні змонтованих ConfigMaps або Secrets у контейнеризованих середовищах.

{{< caution >}}
Якщо під час запуску присутній неправильний файл маніфесту, API-сервер не запускається. Під час роботи, якщо перезавантаження не вдається через помилки перевірки, попередня дійсна конфігурація зберігається, а помилка реєструється.
{{< /caution >}}

## Спостережуваність {#observability}

### Метрики {#metrics}

Контроль допуску на основі маніфестів надає наступні метрики для моніторингу стану перезавантаження:

{{< table caption="Метрики для контролю допуску на основі маніфестів" >}}
| Тип | Опис | Метрика |
|:-----|:------------|:-------|
| Counter | Загальна кількість спроб перезавантаження, з мітками `status` (`success` або `failure`), `plugin` та `apiserver_id_hash`. | `apiserver_manifest_admission_config_controller_automatic_reloads_total` |
| Gauge | Час останньої спроби перезавантаження, з мітками `status`, `plugin` та `apiserver_id_hash`. | `apiserver_manifest_admission_config_controller_automatic_reload_last_timestamp_seconds` |
| Gauge | Поточна інформація про конфігурацію (значення завжди 1), з мітками `plugin`, `apiserver_id_hash` та `hash`. Використовуйте мітку `hash` для виявлення розбіжностей конфігурації між API-серверами. | `apiserver_manifest_admission_config_controller_last_config_info` |
{{< /table >}}

Мітка `plugin` визначає втулок допуску, до якого застосовується метрика: `ValidatingAdmissionWebhook`, `MutatingAdmissionWebhook`, `ValidatingAdmissionPolicy` або `MutatingAdmissionPolicy`.

Оскільки обʼєкти на основі маніфестів мають імена, що закінчуються на `.static.k8s.io`, наявні метрики допуску (такі як `apiserver_admission_webhook_rejection_count`) можуть визначати рішення на основі маніфестів, фільтруючи за міткою `name`.

### Анотації аудиту {#audit-annotations}

Наявні анотації аудиту (такі як `validation.policy.admission.k8s.io/validation_failure` та `mutation.webhook.admission.k8s.io/round_0_index_0`) включають імʼя обʼєкта. Ви можете визначити рішення на основі маніфестів, фільтруючи за іменами, що закінчуються на `.static.k8s.io`.

## Міркування стосовно високої доступності {#ha-considerations}

Кожен екземпляр kube-apiserver завантажує свої власні файли маніфестів незалежно. У налаштуваннях високої доступності з кількома екземплярами API-сервера:

- Кожен API-сервер повинен бути налаштований окремо. Немає синхронізації конфігурацій на основі маніфестів між API-серверами.
- Використовуйте зовнішні інструменти управління конфігурацією (такі як Ansible, Puppet або спільні точки монтування) для підтримки узгодженості файлів маніфестів між екземплярами.
- Метрика `apiserver_manifest_admission_config_controller_last_config_info` надає мітку `hash`, яку можна використовувати для виявлення розбіжностей конфігурації між екземплярами API-сервера.

Ця поведінка схожа на інші конфігурації kube-apiserver на основі файлів, такі як [шифрування даних у спокої](/docs/tasks/administer-cluster/encrypt-data/) та [автентифікація](/docs/reference/access-authn-authz/authentication/).

## Оновлення та пониження версії {#upgrade-downgrade}

**Оновлення**: Увімкнення функції та надання конфігурації маніфестів є опціональним. Наявні кластери без конфігурації маніфестів не зазнають змін у поведінці.

**Пониження версії**: Перед пониженням до версії без цієї функції:

1. Видаліть записи `staticManifestsDir` з файлу `AdmissionConfiguration`.
1. Якщо ви покладаєтесь на політики на основі маніфестів, відтворіть їх як обʼєкти API, де це можливо.
1. Перезапустіть kube-apiserver.

{{< warning >}} Пониження версії без видалення конфігурації `staticManifestsDir` призведе до того, що API-сервер не зможе запуститися через невідомі поля конфігурації.
{{< /warning >}}

## Усунення несправностей {#troubleshooting}

{{< table caption="Поширені проблеми та їх вирішення" >}}
| Симптом | Можлива причина | Рішення |
|:--------|:--------------|:-----------|
| API-сервер не запускається | Неправильний файл маніфесту при запуску | Перевірте журнали API-сервера на наявність помилок валідації. Виправте файл маніфесту та перезапустіть сервер. |
| API-сервер не запускається | Дублювання імен обʼєктів у файлах маніфестів | Переконайтеся, що всі імена обʼєктів у втулка `staticManifestsDir` унікальні. |
| Політики не застосовуються після оновлення файлу | Помилка перезавантаження валідації | Перевірте метрику `automatic_reloads_total{status="failure"}` та журнали API-сервера. Виправте маніфест і дочекайтеся наступного циклу перезавантаження. |
| Запити вебхуків не виконуються | URL вебхука недоступний | Перевірте, чи доступний URL, вказаний у `clientConfig.url`, з kube-apiserver. |
| Неможливо створити обʼєкти API з суфіксом `.static.k8s.io` | Суфікс імені зарезервований для функції | Суфікс `.static.k8s.io` зарезервований для конфігурацій на основі маніфестів, коли функція увімкнена. Використовуйте інше імʼя для обʼєктів на основі API. |
{{< /table >}}

## {{% heading "whatsnext" %}}

- Дізнайтеся про [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) для політик валідації на основі CEL.
- Дізнайтеся про [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) для політик мутації на основі CEL.
- Дізнайтеся про [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/) для контролю доступу на основі вебхуків.
- Прочитайте документ про дизайн [KEP-5793](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/5793-manifest-based-admission-control-config).
