---
title: Динамічне керування допуском
content_type: concept
weight: 45
---

<!-- overview -->

Окрім [вбудованих втулків допуску](/docs/reference/access-authn-authz/admission-controllers/), втулки допуску можуть бути розроблені як розширення і виконуватися як вебхуки, налаштовані під час роботи. Ця сторінка описує, як будувати, налаштовувати, використовувати та контролювати вебхуки допуску.

<!-- body -->

## Що таке вебхуки допуску? {#what-are-admission-webhooks}

Вебхуки допуску — це зворотні виклики HTTP, які отримують запити на допуск та роблять з ними щось. Ви можете визначити два типи вебхуків допуску, [валідаційний вебхук допуску](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook) та [модифікуючий вебхук допуску](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook). Модифікуючі вебхуки допуску викликаються першими та можуть змінювати обʼєкти, які надсилаються на сервер API, щоб застосовувати власні стандартні значення. Після завершення всіх модифікацій обʼєктів і після того, як вхідний обʼєкт перевірений сервером API, викликаються валідаційні вебхуки допуску та можуть відхиляти запити для застосування власних політик.

{{< note >}}
Вебхуки допуску, які потребують гарантії того, що вони бачать кінцевий стан обʼєкта, щоб застосувати політику, повинні використовувати валідаційний вебхук допуску, оскільки обʼєкти можуть бути змінені після того, як їх оглянули модифікуючі вебхуки.
{{< /note >}}

## Експерименти з вебхуками допуску {#experimenting-with-admission-webhooks}

Вебхуки допуску фактично є частиною панелі управління кластера. Ви повинні писати та розгортати їх з великою обережністю. Будь ласка, прочитайте [посібники користувача](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server) для інструкцій, якщо ви маєте намір писати/розгортати вебхуки допуску промислового рівня. Нижче ми описуємо, як швидко експериментувати з вебхуками допуску.

### Передумови {#prerequisites}

* Переконайтеся, що контролери допуску MutatingAdmissionWebhook та ValidatingAdmissionWebhook
  увімкнені. [Тут](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use) є рекомендований набір контролерів допуску для загального увімкнення.

* Переконайтеся, що API `admissionregistration.k8s.io/v1` увімкнено.

### Написання сервера вебхуків допуску {#write-an-admission-webhook-server}

Будь ласка, зверніться до реалізації [сервера вебхуків допуску](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go), який перевірено в е2е-тесті Kubernetes. Сервер вебхуків обробляє запити `AdmissionReview`, надіслані серверами API, і повертає своє рішення як обʼєкт `AdmissionReview` в тій же версії, що й отримав.

Дивіться розділ [запиту вебхуку](#request) для деталей щодо даних, надісланих до вебхуків.

Дивіться розділ [відповіді вебхуку](#response) для деталей щодо даних, які очікуються від вебхуків.

Приклад сервера вебхуків допуску залишає поле `ClientAuth` [порожнім](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39), що типово дорівнює `NoClientCert`. Це означає, що сервер вебхуків не автентифікує ідентичність клієнтів, які, припускається, є серверами API. Якщо вам потрібен взаємний TLS або інші способи автентифікації клієнтів, дивіться як [автентифікувати сервери API](#authenticate-apiservers).

### Розгортання служби вебхуків допуску {#deploy-an-admission-webhook-service}

Сервер вебхуків у е2е-тесті розгортається в кластері Kubernetes за допомогою [API deployment](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps). Тест також створює [сервіс](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) як фронтенд сервера вебхуків. Дивіться [код](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748).

Ви також можете розгортати свої вебхуки поза кластером. Вам потрібно буде оновити відповідно ваші конфігурації вебхуків.

### Налаштування вебхуків допуску на льоту {#configure-admission-webhooks-on-the-fly}

Ви можете динамічно налаштовувати, які ресурси підлягають обробки яким вебхукам допуску через
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io) або [MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).

Приклад `ValidatingWebhookConfiguration`, конфігурація модифікуючого вебхуку подібна. Дивіться розділ [конфігурації вебхуку](#webhook-configuration) для деталей про кожне поле конфігурації.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups:   [""]
    apiVersions: ["v1"]
    operations:  ["CREATE"]
    resources:   ["pods"]
    scope:       "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: <CA_BUNDLE>
  admissionReviewVersions: ["v1"]
  sideEffects: None
  timeoutSeconds: 5
```

{{< note >}}
Ви повинні замінити `<CA_BUNDLE>` у вищезазначеному прикладі на дійсний пакунок CA це PEM-кодований (значення поля закодовано у Base64) пакунок CA для перевірки вебсервера сертифіката.
{{< /note >}}

Поле `scope` вказує, чи тільки ресурси з області кластера ("Cluster") або з області простору імен ("Namespaced") будуть відповідати цьому правилу. "&lowast;" означає, що обмежень області немає.

{{< note >}}
При використанні `clientConfig.service`, сертифікат сервера повинен бути дійсним для
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

{{< note >}}
Стандартний тайм-авт вебхуку — 10 секунд, ви можете встановити `timeout`, і рекомендується використовувати короткий тайм-авт для вебхуків. Якщо виклик вебхуку перевищує тайм-авт, запит обробляється відповідно до політики відмови вебхуку.
{{< /note >}}

Коли сервер API отримує запит, що відповідає одному з `rules`, сервер API надсилає запит `admissionReview` до вебхуку, як зазначено в `clientConfig`.

Після створення конфігурації вебхуку, системі знадобиться кілька секунд, щоб визнати нову конфігурацію.

### Автентифікація серверів API {#authenticate-apiservers}

Якщо вашим вебхукам для допуску потрібна автентифікація, ви можете налаштувати сервери API для використання базової автентифікації, токенів на предʼявника (bearer token) або сертифікатів для автентифікації себе у вебхуках. Налаштування складається з трьох кроків.

* Під час запуску сервера API вкажіть розташування файлу конфігурації керування допуском за допомогою прапорця `--admission-control-config-file`.

* У файлі конфігурації керування допуском вкажіть, де контролери MutatingAdmissionWebhook та ValidatingAdmissionWebhook повинні читати облікові дані. Облікові дані зберігаються у файлах kubeConfig (так, це та сама схема, що використовується kubectl), тому назва поля — `kubeConfigFile`. Ось приклад файлу конфігурації керування допуском:

{{< tabs name="admissionconfiguration_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
```

{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}

```yaml
# Застаріло у v1.17 на користь apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    # Застаріло у v1.17 на користь apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    # Застаріло у v1.17 на користь apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
```

{{% /tab %}}
{{< /tabs >}}

Для отримання додаткової інформації про `AdmissionConfiguration`, дивіться [документацію по AdmissionConfiguration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/). Дивіться розділ [конфігурації вебхуку](#webhook-configuration) для деталей про кожне поле конфігурації.

У файлі kubeConfig вкажіть облікові дані:

```yaml
apiVersion: v1
kind: Config
users:
# name повинно бути встановлено на DNS-імʼя служби або хост (включаючи порт) URL-адреси, з якою налаштовано взаємодію вебхуку.
# Якщо для служб використовується порт, відмінний від 443, його необхідно включити до імені під час налаштування серверів API версії 1.16+.
#
# Для вебхуку, налаштованого для взаємодії зі службою настандартному порті (443), вкажіть DNS-імʼя служби:
# - name: webhook1.ns1.svc
#   user: ...
#
# Для вебхуку, налаштованого для взаємодії зі службою на нестандартному порту (наприклад, 8443), вкажіть DNS-імʼя та порт служби у версії 1.16+:
# - name: webhook1.ns1.svc:8443
#   user: ...
# і, за бажанням, створіть другу секцію, використовуючи лише DNS-імʼя служби для сумісності з серверами API версії 1.15:
# - name: webhook1.ns1.svc
#   user: ...
#
# Для вебхуків, налаштованих для взаємодії з URL-адресою, вкажіть хост (і порт), вказані в URL-адресі вебхуку. Приклади:
# Вебхук з `url: https://www.example.com`:
# - name: www.example.com
#   user: ...
#
# Вебхук з `url: https://www.example.com:443`:
# - name: www.example.com:443
#   user: ...
#
# Вебхук з `url: https://www.example.com:8443`:
# - name: www.example.com:8443
#   user: ...
#
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: "<pem encoded certificate>"
    client-key-data: "<pem encoded key>"
# Поле `name` підтримує використання * для підстановки сегментів префікса.
- name: '*.webhook-company.org'
  user:
    password: "<password>"
    username: "<name>"
# '*' є стандартним збігом.
- name: '*'
  user:
    token: "<token>"
```

Звичайно, вам потрібно налаштувати сервер вебхуків для обробки цих запитів на автентифікацію.

## Запит і відповідь вебхука {#webhook-request-and-response}

### Запит {#request}

Вебхуки надсилаються як POST-запити з `Content-Type: application/json`, з об’єктом API `AdmissionReview` в API-групі `admission.k8s.io`, серіалізованим у JSON як тіло запиту.

Вебхуки можуть вказувати, які версії об’єктів `AdmissionReview` вони приймають, використовуючи поле `admissionReviewVersions` у своїй конфігурації:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1", "v1beta1"]
```

`admissionReviewVersions` є обов’язковим полем при створенні конфігурацій вебхуків. Вебхуки повинні підтримувати принаймні одну версію `AdmissionReview`, яка зрозуміла поточному та попередньому API-серверу.

API-сервери надсилають першу версію `AdmissionReview` зі списку `admissionReviewVersions`, яку вони підтримують. Якщо жодна з версій у списку не підтримується API-сервером, створення конфігурації не буде дозволено. Якщо API-сервер виявляє конфігурацію вебхука, яка була створена раніше і не підтримує жодної з версій `AdmissionReview`, які API-сервер може надсилати, спроби виклику вебхука будуть невдалими та підлягатимуть [політиці відмови](#failure-policy).

Цей приклад показує дані, що містяться в об’єкті `AdmissionReview` для запиту на оновлення субресурсу `scale` для `Deployment` з групи `apps/v1`:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # Випадковий uid, що унікально ідентифікує цей виклик підтвердження
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # Повністю кваліфікована група/версія/тип вхідного об’єкта
    "kind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # Повністю кваліфікована група/версія/тип ресурсу, що змінюється
    "resource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # субресурс, якщо запит стосується субресурсу
    "subResource": "scale",

    # Повністю кваліфікована група/версія/тип вхідного об’єкта в початковому запиті до API-сервера.
    # Це відрізняється від `kind`, лише якщо вебхук вказав `matchPolicy: Equivalent` і початковий запит до API-сервера був конвертований у версію, для якої зареєстровано вебхук.
    "requestKind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # Повністю кваліфікована група/версія/тип ресурсу, що змінюється в початковому запиті до API-сервера.
    # Це відрізняється від `resource`, лише якщо вебхук вказав `matchPolicy: Equivalent` і початковий запит до API-сервера був конвертований у версію, для якої зареєстровано вебхук.
    "requestResource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # субресурс, якщо запит стосується субресурсу
    # Це відрізняється від `subResource`, лише якщо вебхук вказав `matchPolicy: Equivalent` і початковий запит до API-сервера був конвертований у версію, для якої зареєстровано вебхук.
    "requestSubResource": "scale",

    # Ім’я ресурсу, що змінюється
    "name": "my-deployment",

    # Простір імен ресурсу, що змінюється, якщо ресурс має простір імен (або є об’єктом Namespace)
    "namespace": "my-namespace",

    # операція може бути CREATE, UPDATE, DELETE або CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # Ім’я користувача автентифікованого користувача, що робить запит до API-сервера
      "username": "admin",

      # UID автентифікованого користувача, що робить запит до API-сервера
      "uid": "014fbff9a07c",

      # Групові членства автентифікованого користувача, що робить запит до API-сервера
      "groups": [
        "system:authenticated",
        "my-admin-group"
      ],
      # Додаткова довільна інформація, пов’язана з користувачем, що робить запит до API-сервера.
      # Це заповнюється шаром автентифікації API-сервера і повинно бути включено,
      # якщо будь-які перевірки SubjectAccessReview виконуються вебхуком.
      "extra": {
        "some-key": [
          "some-value1",
          "some-value2"
        ]
      }
    },

    # object є новим об’єктом, що підлягає допуску.
    # Це null для операцій DELETE.
    "object": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    }

    # oldObject є існуючим об’єктом.
    # Це null для операцій CREATE та CONNECT.
    "oldObject": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # options містить параметри операції, що підлягає допуску, як-от meta.k8s.io/v1 CreateOptions, UpdateOptions або DeleteOptions.
    # Це null для операцій CONNECT.
    "options": {
      "apiVersion": "meta.k8s.io/v1",
      "kind": "UpdateOptions"
    },

    # dryRun вказує, що API-запит виконується в режимі dry run і не буде збережений.
    # Вебхуки з побічними ефектами повинні уникати здійснення цих побічних ефектів, коли dryRun дорівнює true.
    # Див. http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request для додаткової інформації.
    "dryRun": "False"
  }
}
```

### Відповідь {#response}

Вебхуки відповідають зі статус-кодом HTTP 200, `Content-Type: application/json` та тілом, що містить об’єкт `AdmissionReview` (у тій же версії, що була надіслана), з заповненою секцією `response`, серіалізованою у JSON.

Мінімум, секція `response` повинна містити такі поля:

* `uid`, скопійований з `request.uid`, що був надісланий до вебхука
* `allowed`, встановлений або в `true`, або в `false`

Приклад мінімальної відповіді від вебхука для дозволу запиту:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "allowed": true
  }
}
```

Приклад мінімальної відповіді від вебхука для заборони запиту:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "allowed": false
  }
}
```

При відхиленні запиту вебхук може налаштувати HTTP-код та повідомлення, яке повертається користувачеві, використовуючи поле `status`. Вказаний об’єкт статусу повертається користувачеві. Див. [Довідник API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta) для деталей про тип `status`. Приклад відповіді для заборони запиту з налаштуванням HTTP-коду та повідомлення, яке буде представлено користувачеві:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "allowed": false,
    "status": {
      "code": 403,
      "message": "Ви не можете це зробити, тому що сьогодні вівторок і ваше ім’я починається з літери А"
    }
  }
}
```

При дозволі запиту, модифікуючий вебхук допуску може за бажанням модифікувати вхідний об’єкт. Це робиться за допомогою полів `patch` та `patchType` у відповіді. Єдиний підтримуваний тип `patchType` наразі — `JSONPatch`. Див. документацію [JSON patch](https://jsonpatch.com/) для додаткової інформації. Для `patchType: JSONPatch`, поле `patch` містить base64-кодований масив операцій JSON patch.

Як приклад, єдина операція patch, яка встановить `spec.replicas`, виглядає так: `[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-кодована, вона виглядатиме так: `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

Отже, відповідь вебхука для додавання цієї мітки буде такою:

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "allowed": true,
    "patchType": "JSONPatch",
    "patch": "W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0="
  }
}
```

Вебхуки допуску можуть за бажанням повертати попереджувальні повідомлення, які повертаються клієнту, що зробив запит, у HTTP-заголовках `Warning` з кодом попередження 299. Попередження можуть бути надіслані з дозволеними або відхиленими відповідями на допуск.

Якщо ви реалізуєте вебхук, що повертає попередження:

* Не включайте префікс "Warning:" у повідомлення
* Використовуйте попереджувальні повідомлення для опису проблем, які клієнт, що робить API-запит, має виправити або про які має знати
* За можливості, обмежуйте попередження до 120 символів

{{< caution >}}
Індивідуальні попереджувальні повідомлення довжиною понад 256 символів можуть бути скорочені API-сервером перед поверненням клієнтам. Якщо додано більше 4096 символів попереджувальних повідомлень (від усіх джерел), додаткові попередження ігноруються.
{{< /caution >}}

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<значення з request.uid>",
    "allowed": true,
    "warnings": [
      "зазначено дублюючі записи envvar з іменем MY_ENV",
      "запит на пам’ять менший за 4 МБ зазначено для контейнера mycontainer, який не запуститься успішно"
    ]
  }
}
```

## Конфігурація вебхука {#webhook-configuration}

Для реєстрації вебхуків допуску створіть об’єкти API `MutatingWebhookConfiguration` або `ValidatingWebhookConfiguration`. Назва об’єкта `MutatingWebhookConfiguration` або `ValidatingWebhookConfiguration` має бути дійсним [DNS-імʼям субдомену](/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Кожна конфігурація може містити один або кілька вебхуків. Якщо в одній конфігурації вказано кілька вебхуків, кожен з них повинен мати унікальну назву. Це необхідно для полегшення відповідності логів аудиту та метрик активних конфігурацій.

Кожен вебхук визначає наступні параметри.

### Відповідність запитам: правила {#matching-requests-rules}

Кожен вебхук має вказувати список правил, що використовуються для визначення, чи повинен запит до API-сервера бути надісланий до вебхука. Кожне правило вказує одну або кілька операцій, груп API, версій API та ресурсів, а також область ресурсу:

* `operations` отримує перелік з однієї або кількох операцій для порівняння. Можливі значення: `"CREATE"`, `"UPDATE"`, `"DELETE"`, `"CONNECT"` або `"*"` для збігу зі всіма операціям.
* `apiGroups` отримує перелік з однієї або кількох груп API для порівняння. `""` означає ядро групи API. `"*"` відповідає всім групам API.
* `apiVersions` отримує перелік з однієї або кількох версій API для порівняння. `"*"` відповідає всім версіям API.
* `resources` отримує перелік з одного або кількох ресурсів для порівняння.

  * `"*"` відповідає всім ресурсам, але не субресурсам.
  * `"*/*"` відповідає всім ресурсам і субресурсам.
  * `"pods/*"` відповідає всім субресурсам Podʼів.
  * `"*/status"` відповідає всім субресурсам статусу.

* `scope` вказує область для порівняння. Допустимі значення: `"Cluster"`, `"Namespaced"` та `"*"`. Субресурси відповідають області їх батьківського ресурсу. Стандартно `"*"`.

  * `"Cluster"` означає, що тільки ресурси з кластерною областю відповідатимуть цьому правилу (об’єкти Namespace мають кластерну область).
  * `"Namespaced"` означає, що тільки ресурси з простору імен відповідатимуть цьому правилу.
  * `"*"` означає, що немає обмежень щодо області.

Якщо вхідний запит відповідає одному з: `operations`, `apiGroups`, `apiVersions`, `resources` та `scope` для будь-якого з правил вебхука, запит надсилається до вебхука.

Ось інші приклади правил, які можуть бути використані для визначення, які ресурси слід перехоплювати.

Відповідність запитам `CREATE` або `UPDATE` до `apps/v1` та `apps/v1beta1` `deployments` і `replicasets`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: ["apps"]
    apiVersions: ["v1", "v1beta1"]
    resources: ["deployments", "replicasets"]
    scope: "Namespaced"
  ...
```

Відповідність запитам на створення для всіх ресурсів (але не субресурсів) у всіх групах і версіях API:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "*"
```

Відповідність запитам на оновлення для всіх субресурсів `status` у всіх групах і версіях API:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["UPDATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*/status"]
        scope: "*"
```

### Відповідність запитам: objectSelector {#matching-requests-objectselector}

Вебхуки можуть за бажанням обмежувати, які запити перехоплюються, на основі міток обʼєктів, до яких вони будуть надіслані, вказуючи `objectSelector`. Якщо вказано, `objectSelector` оцінюється як для обʼєкта, так і для старого обʼєкта, які будуть надіслані до вебхука, і вважається відповідним, якщо будь-який з обʼєктів відповідає селектору.

Обʼєкт, що дорівнює null (`oldObject` у випадку створення або `newObject` у випадку видалення), або обʼєкт, який не може мати міток (наприклад, обʼєкт `DeploymentRollback` або `PodProxyOptions`), не вважається відповідним.

Використовуйте селектор обʼєктів тільки якщо вебхук є опціональним, тому що кінцеві користувачі можуть обійти вебхук допуску, встановлюючи мітки.

Цей приклад показує модифікуючий вебхук, який відповідатиме `CREATE` для будь-якого ресурсу (але не субресурсів) з міткою `foo: bar`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  objectSelector:
    matchLabels:
      foo: bar
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
```

Див. [концепцію міток](/docs/concepts/overview/working-with-objects/labels) для більшої кількості прикладів селекторів міток.

### Відповідність запитам: namespaceSelector {#matching-requests-namespaceselector}

Вебхуки можуть за бажанням обмежувати, які запити на ресурси в межах простору імен перехоплюються, на основі міток простору імен, до якого вони належать, вказуючи `namespaceSelector`.

`namespaceSelector` вирішує, чи слід запускати вебхук для запиту на ресурс у межах простору імен (або обʼєкт Namespace), на основі того, чи відповідають мітки простору імен селектору. Якщо обʼєкт сам є простором імен, відповідність виконується за object.metadata.labels. Якщо обʼєкт є кластерним ресурсом, відмінним від Namespace, `namespaceSelector` не впливає.

Цей приклад показує модифікуючий вебхук, який відповідає `CREATE` для будь-якого ресурсу в межах простору імен, який не має мітки "runlevel" зі значенням "0" або "1":

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: runlevel
          operator: NotIn
          values: ["0","1"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

Цей приклад показує валідаційний вебхук, який відповідає `CREATE` для будь-якого ресурсу в межах простору імен, асоційованого з "environment" зі значенням "prod" або "staging":

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: environment
          operator: In
          values: ["prod","staging"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

Див. [концепцію міток](/docs/concepts/overview/working-with-objects/labels) для більшої кількості прикладів селекторів міток.

### Відповідність запитам: matchPolicy {#matching-requests-matchpolicy}

API сервери можуть робити обʼєкти доступними через кілька API груп або версій.

Наприклад, якщо вебхук визначає правило для певних API груп/версій (наприклад, `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`), і запит робиться для зміни ресурсу через іншу API групу/версію (наприклад, `extensions/v1beta1`), запит не буде надіслано до вебхука.

`matchPolicy` дозволяє вебхуку визначити, як його `rules` використовуються для відповідності вхідним запитам. Допустимі значення — `Exact` або `Equivalent`.

* `Exact` означає, що запит повинен бути перехоплений тільки в тому випадку, якщо він точно відповідає зазначеному правилу.
* `Equivalent` означає, що запит повинен бути перехоплений, якщо він модифікує ресурс, зазначений в `rules`, навіть через іншу API групу або версію.

У наведеному вище прикладі, вебхук, зареєстрований тільки для `apps/v1`, може використовувати `matchPolicy`:

* `matchPolicy: Exact` означає, що запит `extensions/v1beta1` не буде надіслано до вебхука.
* `matchPolicy: Equivalent` означає, що запит `extensions/v1beta1` буде надіслано до вебхука (з обʼєктами, конвертованими до версії, яку вебхук визначив: `apps/v1`).

Вказування `Equivalent` рекомендовано і забезпечує, що вебхуки продовжують перехоплювати очікувані ресурси, коли оновлення включають нові версії ресурсу в API сервері.

Коли ресурс перестає обслуговуватись API сервером, він більше не вважається еквівалентним іншим версіям цього ресурсу, які все ще обслуговуються. Наприклад, `extensions/v1beta1` розгортання були спочатку визнані застарілими, а потім видалені (у Kubernetes v1.16).

З моменту цього видалення, вебхук з правилом `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` не перехоплює розгортання, створені через API `apps/v1`. З цієї причини, вебхуки повинні віддавати перевагу реєстрації для стабільних версій ресурсів.

Цей приклад показує валідаційний вебхук, який перехоплює модифікації розгортань (незалежно від API групи або версії) і завжди отримує обʼєкт `Deployment` версії `apps/v1`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
```

`matchPolicy` для вебхуків допуску стандартно дорівнює `Equivalent`.

### Відповідність запитам: `matchConditions` {#matching-requests-matchconditions}

{{< feature-state feature_gate_name="AdmissionWebhookMatchConditions" >}}

Ви можете визначити _умови відповідності_ для вебхуків, якщо вам потрібна точніша фільтрація запитів. Ці умови корисні, якщо правила відповідності, `objectSelectors` та `namespaceSelectors` не надають необхідної фільтрації при викликах по HTTP. Умови відповідності є [CEL виразами](/docs/reference/using-api/cel/). Всі умови відповідності повинні оцінюватися як true для виклику вебхука.

Ось приклад, що ілюструє декілька різних способів використання умов відповідності:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['*']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Ignore' # Fail-open (опційно)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # Ви можете мати до 64 умов відповідності на вебхук
    matchConditions:
      - name: 'exclude-leases' # Кожна умова відповідності повинна мати унікальне імʼя
        expression: '!(request.resource.group == "coordination.k8s.io" && request.resource.resource == "leases")' # Відповідність ресурсам, які не є lease.
      - name: 'exclude-kubelet-requests'
        expression: '!("system:nodes" in request.userInfo.groups)' # Відповідність запитам, зробленим не користувачами вузлів.
      - name: 'rbac' # Пропуск запитів RBAC, які обробляються другим вебхуком.
        expression: 'request.resource.group != "rbac.authorization.k8s.io"'

  # Цей приклад ілюструє використання 'authorizer'. Перевірка авторизації дорожча за простий вираз, тому в цьому прикладі вона обмежена лише запитами RBAC, використовуючи другий вебхук. Обидва вебхуки можуть обслуговуватись одним кінцевим пунктом.
  - name: rbac.my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['rbac.authorization.k8s.io']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Fail' # Fail-closed (стандартно)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # Ви можете мати до 64 умов відповідності на вебхук
    matchConditions:
      - name: 'breakglass'
        # Пропуск запитів, зроблених користувачами, авторизованими для 'breakglass' на цьому вебхуку.
        # Дієслово API 'breakglass' не повинно існувати за межами цієї перевірки.
        expression: '!authorizer.group("admissionregistration.k8s.io").resource("validatingwebhookconfigurations").name("my-webhook.example.com").check("breakglass").allowed()'
```

{{< note >}}
Ви можете визначити до 64 елементів у полі `matchConditions` для кожного вебхука.
{{< /note >}}

Умови відповідності мають доступ до наступних CEL змінних:

* `object` — Обʼєкт з вхідного запиту. Значення є null для DELETE запитів. Версія обʼєкта може бути конвертована на основі [matchPolicy](#matching-requests-matchpolicy).
* `oldObject` — Наявний обʼєкт. Значення є null для CREATE запитів.
* `request` — Частина запиту [AdmissionReview](#request), виключаючи `object` та `oldObject`.
* `authorizer` — CEL Authorizer. Може використовуватись для виконання перевірок авторизації для головного облікового запису (автентифікованого користувача) запиту. Дивіться [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) у документації бібліотеки Kubernetes CEL для додаткової інформації.
* `authorizer.requestResource` — Скорочення для перевірки авторизації, налаштованої на ресурс запиту (група, ресурс, (субресурс), простір імен, імʼя).

Для отримання додаткової інформації про CEL вирази, зверніться до довідника [Загальна мова виразів у Kubernetes](/docs/reference/using-api/cel/).

У разі помилки оцінки умови відповідності вебхук ніколи не викликається. Чи відхилити запит визначається наступним чином:

1. Якщо **будь-яка** умова відповідності оцінилася як `false` (незалежно від інших помилок), API сервер пропускає вебхук.
2. Інакше:
    * для [`failurePolicy: Fail`](#failure-policy), запит відхиляється (без виклику вебхука).
    * для [`failurePolicy: Ignore`](#failure-policy), продовжити запит, але пропустити вебхук.

### Звернення до вебхука {#contacting-the-webhook}

Коли сервер API визначає, що запит повинен бути надісланий до вебхука, йому потрібно знати, як звʼязатися з вебхуком. Це визначається в розділі `clientConfig` конфігурації вебхука.

Вебхуки можуть викликатися через URL або посилання на сервіс, і можуть за бажанням включати власний набір CA для використання для перевірки TLS-зʼєднання.

#### URL

Поле `url` вказує місцезнаходження вебхука у стандартній формі URL (`scheme://host:port/path`).

Поле `host` не повинно вказувати на сервіс, що працює в кластері; використовуйте посилання на сервіс, вказуючи поле `service`. Хост може бути вирішений через зовнішній DNS на деяких серверах API (наприклад, `kube-apiserver` не може вирішувати DNS всередині кластера, оскільки це буде порушенням шарів). `host` також може бути IP-адресою.

Зверніть увагу, що використання `localhost` або `127.0.0.1` як `host` є ризикованим, якщо ви не забезпечите запуск цього вебхука на всіх хостах, які запускають сервер API, який може потребувати викликів до цього вебхука. Такі інсталяції, ймовірно, будуть непереносними або не будуть легко запускатися в новому кластері.

Схема повинна бути "https"; URL повинен починатися з "https://".

Спроба використання користувача або базової автентифікації (наприклад, `user:password@`) не дозволена. Фрагменти (`#...`) та параметри запиту (`?...`) також не дозволені.

Ось приклад конфігурації модифікуючого вебхука для виклику URL (і очікується, що TLS-сертифікат буде перевірено за допомогою системних коренів довіри, тому не вказується caBundle):

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
```

#### Посилання на сервіс {#service-reference}

Розділ `service` всередині `clientConfig` є посиланням на сервіс для цього вебхука. Якщо вебхук працює всередині кластера, вам слід використовувати `service` замість `url`. Необхідно вказати простір імен та імʼя сервісу. Порт є необовʼязковим і стандартно дорівнює 443. Шлях є необовʼязковим і стандартно дорівнює "/".

Ось приклад конфігурації модифікуючого вебхука для виклику сервісу на порту "1234" за підшляхом "/my-path", і для перевірки TLS-зʼєднання проти ServerName `my-service-name.my-service-namespace.svc` з використанням власного набору CA:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: <CA_BUNDLE>
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
```

{{< note >}}
Ви повинні замінити `<CA_BUNDLE>` у наведеному вище прикладі на дійсний набір CA, який є PEM-кодованим набором CA для перевірки сертифіката сервера вебхука.
{{< /note >}}

### Побічні ефекти {#side-effects}

Вебхуки зазвичай працюють тільки з вмістом `AdmissionReview`, надісланого їм. Однак деякі вебхуки здійснюють зміни поза межами під час обробки запитів на допуск.

Вебхуки, які здійснюють зміни поза межами ("побічні ефекти"), повинні також мати механізм узгодження (наприклад, контролер), який періодично визначає фактичний стан системи та коригує дані поза межами, змінені вебхуком допуску, щоб відобразити реальність. Це тому, що виклик до вебхука допуску не гарантує, що прийнятий обʼєкт буде збережений таким, яким він є, або взагалі. Пізніші вебхуки можуть змінити вміст обʼєкта, може виникнути конфлікт під час запису в сховище, або сервер може вимкнутися до збереження обʼєкта.

Крім того, вебхуки з побічними ефектами повинні пропускати ці побічні ефекти, коли обробляються запити допуску з `dryRun: true`. Вебхук повинен явно вказати, що він не матиме побічних ефектів при запуску з `dryRun`, інакше запит dry-run не буде надіслано до вебхука, і API-запит замість цього не вдасться.

Вебхуки вказують, чи мають вони побічні ефекти, за допомогою поля `sideEffects` у конфігурації вебхука:

* `None`: виклик вебхука не матиме побічних ефектів.
* `NoneOnDryRun`: виклик вебхука може мати побічні ефекти, але якщо до вебхука надіслано запит з `dryRun: true`, вебхук придушить побічні ефекти (вебхук враховує `dryRun`).

Ось приклад конфігурації вебхука перевірки, який вказує, що він не має побічних ефектів при запитах з `dryRun: true`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    sideEffects: NoneOnDryRun
```

### Тайм-аути {#timeouts}

Оскільки вебхуки додають затримку до запитів API, вони повинні оцінюватися якомога швидше. `timeoutSeconds` дозволяє налаштувати, скільки часу сервер API повинен чекати на відповідь вебхука, перш ніж розглядати виклик як невдалий.

Якщо тайм-аут закінчується до того, як вебхук відповість, виклик вебхука буде проігноровано або API-запит буде відхилено відповідно до [політики помилок](#failure-policy).

Значення тайм-ауту повинно бути між 1 і 30 секунд.

Ось приклад конфігурації вебхука перевірки з кастомним тайм-аутом у 2 секунди:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    timeoutSeconds: 2
```

Тайм-аут для вебхука допуску стандартно становить 10 секунд.

### Політика повторного виклику {#reinvocation-policy}

Одне впорядкування втулків модифікуючого допуску (включаючи вебхуки) не підходить для всіх випадків (див. приклад у https://issue.k8s.io/64333). Модифікуючий вебхук може додати нову підструктуру до обʼєкта (наприклад, додати `container` до `pod`), а інші модифікуючи втулки, які вже виконані, можуть мати вплив на ці нові структури (наприклад, встановити `imagePullPolicy` для всіх контейнерів).

Щоб дозволити втулкам модифікуючого допуску спостерігати за змінами, внесеними іншими втулками, вбудовані модифікуючи втулки допуску повторно запускаються, якщо модифікуючий вебхук змінює обʼєкт, і модифікуючи вебхуки можуть вказати `reinvocationPolicy` для контролю того, чи будуть вони повторно викликані.

`reinvocationPolicy` може бути встановлено на `Never` або `IfNeeded`. Стандартно встановлено у `Never`.

* `Never`: вебхук не повинен викликатися більше одного разу в рамках однієї оцінки допуску.
* `IfNeeded`: вебхук може бути викликаний знову в рамках оцінки допуску, якщо обʼєкт, що авторизується, змінюється іншими втулками допуску після початкового виклику вебхука.

Важливі моменти, на які слід звернути увагу:

* Кількість додаткових викликів не гарантується як точно одна.
* Якщо додаткові виклики призводять до подальших змін обʼєкта, не гарантується, що вебхуки будуть викликані знов.
* Вебхуки, які використовують цей параметр, можуть бути переупорядковані для мінімізації кількості додаткових викликів.
* Щоб перевірити обʼєкт після того, як всі модифікації гарантовано завершені, використовуйте вебхук допуску (рекомендується для вебхуків з побічними ефектами).

Ось приклад конфігурації модифікуючого вебхука, який вибирає повторний виклик, якщо пізніші втулки допуску змінюють обʼєкт:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
```

Модифікуючи вебхуки повинні бути [ідемпотентними](#idempotence), здатними успішно обробити обʼєкт, який вони вже авторизували і потенційно змінили. Це стосується всіх модифікуючих вебхуків допуску, оскільки будь-яка зміна, яку вони можуть внести в обʼєкт, вже могла існувати в обʼєкті, наданому користувачем, але це є особливо важливим для вебхуків, які вибирають повторний виклик.

### Політика обробки помилок {#failure-policy}

`failurePolicy` визначає, як обробляються невизнані помилки та помилки тайм-ауту від вебхука допуску. Допустимі значення: `Ignore` або `Fail`.

* `Ignore` означає, що помилка при виклику вебхука ігнорується, і запит API дозволяється продовжити.
* `Fail` означає, що помилка при виклику вебхука призводить до невдачі допуску та відхилення запиту API.

Ось приклад конфігурації модифікуючого вебхука, налаштованого на відхилення запиту API, якщо виникають помилки під час виклику вебхука допуску:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
```

Стандартна політика обробки помилок `failurePolicy` для вебхуків допуску `Fail`.

## Моніторинг вебхуків авторизації {#monitoring-admission-webhooks}

Сервер API надає способи моніторингу поведінки вебхуків допуску. Ці механізми моніторингу допомагають адміністраторам кластерів відповісти на запитання, як:

1. Який модифікуючий вебхук змінив обʼєкт у запиті API?

2. Яку зміну модифікуючий вебхук застосував до обʼєкта?

3. Які вебхуки часто відхиляють запити API? Яка причина відхилення?

### Анотації аудиту модифікуючих вебхуків {#mutating-webhook-auditing-annotations}

Іноді корисно знати, який модифікуючий вебхук змінив обʼєкт у запиті API, і яку зміну вебхук застосував.

Сервер API Kubernetes виконує [аудит](/docs/tasks/debug/debug-cluster/audit/) кожного виклику модифікуючого вебхука. Кожен виклик генерує анотацію аудиту, яка відображає, чи був обʼєкт запиту змінений викликом, і, за необхідності, генерує анотацію із застосованим патчем з відповіді вебхука допуску. Анотації встановлюються в подію аудиту для даного запиту на даній стадії його виконання, яка потім попередньо обробляється відповідно до певної політики та записується в бекенд.

Рівень аудиту події визначає, які анотації будуть записані:

* На рівні аудиту `Metadata` або вище записується анотація з ключем `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` з JSON-наватаженням, яке вказує, що вебхук був викликаний для даного запиту і чи змінив він обʼєкт чи ні.

  Наприклад, наступна анотація записується для вебхука, який повторно викликається. Вебхук є третім у ланцюгу модифікуючих вебхуків і не змінив обʼєкт запиту під час виклику.

  ```yaml
  # записана подія аудиту
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_1_index_2": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook.example.com\",\"mutated\": false}"
          # інші анотації
          ...
      }
      # інші поля
      ...
  }
  ```

  ```yaml
  # десеріалізоване значення анотації
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook.example.com",
      "mutated": false
  }
  ```

  Наступна анотація записується для вебхука, який викликається на першій стадії. Вебхук є першим у ланцюгу модифікуючих вебхуків і змінив обʼєкт запиту під час виклику.

  ```yaml
  # записана подія аудиту
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_0_index_0": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"mutated\": true}"
          # інші анотації
          ...
      }
      # інші поля
      ...
  }
  ```

  ```yaml
  # десеріалізоване значення анотації
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "mutated": true
  }
  ```

* На рівні аудиту `Request` або вище записується анотація з ключем `patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` з JSON-навантаженням, яке вказує, що вебхук був викликаний для даного запиту і який патч був застосований до обʼєкта запиту.

  Наприклад, наступна анотація записується для вебхука, який повторно викликається. Вебхук є четвертим у ланцюгу модифікуючих вебхуків і відповів JSON-патчем, який був застосований до обʼєкта запиту.

  ```yaml
  # записана подія аудиту
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "patch.webhook.admission.k8s.io/round_1_index_3": "{\"configuration\":\"my-other-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"patch\":[{\"op\":\"add\",\"path\":\"/data/mutation-stage\",\"value\":\"yes\"}],\"patchType\":\"JSONPatch\"}"
          # інші анотації
          ...
      }
      # інші поля
      ...
  }
  ```

  ```yaml
  # десеріалізоване значення анотації
  {
      "configuration": "my-other-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "patchType": "JSONPatch",
      "patch": [
          {
              "op": "add",
              "path": "/data/mutation-stage",
              "value": "yes"
          }
      ]
  }
  ```

### Метрики вебхуків допуску {#admission-webhook-metrics}

Сервер API надає метрики Prometheus з точки доступу `/metrics`, які можна використовувати для моніторингу та діагностики стану сервера API. Наведені нижче метрики фіксують стан, повʼязаний з вебхуками допуску.

#### Лічильник відхилення запитів вебхука допуску сервера API {#api-server-admission-webhook-rejection-count}

Іноді корисно знати, які вебхуки допуску часто відхиляють запити API, та причину відхилення.

Сервер API надає метрику лічильника Prometheus, яка фіксує відхилення вебхуків допуску. Метрики мають підписи, що ідентифікують причини відхилення запитів вебхуками:

* `name`: назва вебхука, який відхилив запит.
* `operation`: тип операції запиту, може бути одним із `CREATE`, `UPDATE`, `DELETE` та `CONNECT`.
* `type`: тип вебхука допуску, може бути одним із `admit` та `validating`.
* `error_type`: визначає, чи сталася помилка під час виклику вебхука, яка призвела до відхилення. Його значення може бути одним із:

  * `calling_webhook_error`: невизнані помилки або помилки тайм-ауту від вебхука допуску сталися, і політика [помилки](#failure-policy) вебхука встановлена на `Fail`.
  * `no_error`: помилка не сталася. Вебхук відхилив запит з `allowed: false` у відповіді допуску. Підписи метрики `rejection_code` записують значення `.status.code`, встановлене в відповіді допуску.
  * `apiserver_internal_error`: сталася внутрішня помилка сервера API.

* `rejection_code`: HTTP-код статусу, встановлений у відповіді допуску, коли вебхук відхилив запит.

Приклад метрик лічильника відхилення:

```none
# HELP apiserver_admission_webhook_rejection_count [ALPHA] Лічильник відхилення вебхуків авторизації, ідентифікований за назвою та розділений для кожного типу авторизації (валідація чи допуск) та операції. Додаткові підписи вказують тип помилки (calling_webhook_error або apiserver_internal_error, якщо виникла помилка; no_error інакше) та, за потреби, ненульовий код відхилення, якщо вебхук відхилив запит із HTTP-кодом статусу (врахований сервером API, якщо код більший або рівний 400). Коди, більші за 600, обрізаються до 600, щоб обмежити кардинальність метрик.
# TYPE apiserver_admission_webhook_rejection_count counter
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="always-timeout-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="invalid-admission-response-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="no_error",name="deny-unwanted-configmap-data.example.com",operation="CREATE",rejection_code="400",type="validating"} 13
```

## Рекомендації та попередження {#best-practices-and-warnings}

Рекомендації та попередження щодо створення модифікуючих вебхуків доступу дивіться у статті [Рекомендації щодо використання вебхуків допуску](/docs/concepts/cluster-administration/admission-webhooks-good-practices).
