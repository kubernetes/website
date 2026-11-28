---
title: Управління службовими обліковими записами
content_type: concept
weight: 50
---

<!-- overview -->

_Службовий обліковий запис (ServiceAccount)_ надає ідентичність для процесів, що виконуються в Podʼі.

Процес всередині Podʼа може використовувати ідентичність свого повʼязаного службового облікового запису для автентифікації на API-сервері кластера.

Для ознайомлення зі службовими обліковими записами прочитайте про [конфігурування службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/).

Цей посібник пояснює деякі концепції, повʼязані з ServiceAccount. Також у посібнику розглядається, як отримати або відкликати токени, що представляють ServiceAccount, і як (за бажанням) привʼязати термін дії ServiceAccount до часу життя обʼєкта API.

<!-- body -->

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Щоб точно виконати ці кроки, переконайтеся, що у вас є простір імен під назвою `examplens`. Якщо ні, створіть його, виконавши команду:

```shell
kubectl create namespace examplens
```

## Облікові записи користувачів та службові облікові записи {#user-accounts-versus-service-accounts}

Kubernetes розрізняє поняття облікового запису користувача та службового облікового запису з кількох причин:

- Облікові записи користувачів призначені для людей. Службові облікові записи призначені для процесів застосунків, які (для Kubernetes) виконуються в контейнерах, що є частиною Podʼів.
- Облікові записи користувачів мають бути глобальними: імена повинні бути унікальними у всіх просторах імен кластера. Незалежно від того, який простір імен ви розглядаєте, певне імʼя користувача, що представляє користувача, представляє одного й того самого користувача. У Kubernetes службові облікові записи привʼязані до простору імен: два різні простори імен можуть містити ServiceAccountʼи з однаковими іменами.
- Як правило, облікові записи користувачів кластера можуть синхронізуватися з корпоративною базою даних, де створення нового облікового запису користувача вимагає спеціальних привілеїв і повʼязане зі складними бізнес-процесами. Навпаки, створення службових облікових записів має бути легшим, дозволяючи користувачам кластера створювати службові облікові записи для конкретних завдань за запитом. Відділення створення ServiceAccount від кроків реєстрації користувачів-людей полегшує дотримання принципу найменших привілеїв для робочих навантажень.
- Вимоги до аудиту для облікових записів користувачів (людей) та службових облікових записів можуть відрізнятися; розділення полегшує досягнення цих вимог.
- Конфігураційний пакет для складної системи може містити визначення різних службових облікових записів для компонентів цієї системи. Оскільки службові облікові записи можуть створюватися без багатьох обмежень і мають імена, привʼязані до простору імен, така конфігурація зазвичай є переносимою.

## Привʼязані токени службових облікових записів {#bound-service-account-tokens}

Токени ServiceAccount можуть бути привʼязані до обʼєктів API, що існують у kube-apiserver. Це можна використовувати, щоб повʼязати дійсність токена з існуванням іншого обʼєкта API. Підтримувані типи обʼєктів такі:

* Pod (використовується для монтування проєкційних томів, див. нижче)
* Secret (може використовуватися для відкликання токена шляхом видалення Secret)
* Node (може використовуватися для автоматичного відкликання токена, коли його Node видалено; створення нових токенів, привʼязаних до вузлів, є загальнодоступним (GA) у v1.33+)
* ValidatingWebhookConfiguration або MutatingWebhookConfiguration (використовується для [автентифікації у вебхуках допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticating-to-admission-webhooks); альфа у v1.37, вимагає функціональної можливості [`APIServerWebhookAuthenticationToken`](/docs/reference/command-line-tools-reference/feature-gates/#APIServerWebhookAuthenticationToken))

Коли токен привʼязаний до обʼєкта, `metadata.name` і `metadata.uid` цього обʼєкта зберігаються як додаткові "приватні твердження (claim)" у виданому JWT.

Коли привʼязаний токен представляється kube-apiserver, автентифікатор службових облікових записів витягне і перевірить ці твердження. Якщо обʼєкт, на який посилається токен, або ServiceAccount очікують на видалення (наприклад, через завершувачі), то в будь-який момент, що настає через 60 секунд (або більше) після дати `.metadata.deletionTimestamp`, автентифікація з використанням цього токена буде неуспішною. Якщо обʼєкт, на який посилається токен, більше не існує (або його `metadata.uid` не збігається), запит не буде автентифікований.

### Додаткові метадані в токенах, привʼязаних до Pod {#additional-metadata-in-pod-bound-tokens}

{{< feature-state feature_gate_name="ServiceAccountTokenPodNodeInfo" >}}

Коли токен службового облікового запису привʼязаний до обʼєкта Pod, у токен також вбудовуються додаткові метадані, що вказують значення поля `spec.nodeName` привʼязаного Podʼа і uid цього Node, якщо він доступний.

Ця інформація про вузол **не** перевіряється kube-apiserver, коли токен використовується для автентифікації. Вона включена, щоб інтеграторам не доводилося отримувати обʼєкти API Pod або Node для перевірки імені та uid повʼязаного вузла при інспекції JWT.

### Перевірка та інспекція приватних тверджень {#verifying-and-inspecting-private-claims}

API TokenReview може використовуватися для перевірки та вилучення приватних тверджень з токена:

1. Спочатку припустимо, що у вас є Pod з назвою `test-pod` і службовий обліковий запис з назвою `my-sa`.
1. Створіть токен, привʼязаний до цього Podʼа:

   ```shell
   kubectl create token my-sa --bound-object-kind="Pod" --bound-object-name="test-pod"
   ```

1. Скопіюйте цей токен у новий файл з назвою `tokenreview.yaml`:

   ```yaml
   apiVersion: authentication.k8s.io/v1
   kind: TokenReview
   spec:
     token: <token from step 2>
   ```

1. Надішліть цей ресурс до apiserver для перевірки:

   ```shell
   # використовуйте '-o yaml', щоб переглянути вивід
   kubectl create -o yaml -f tokenreview.yaml
   ```

   Ви повинні побачити вивід, подібний до наведеного нижче:

   ```yaml
   apiVersion: authentication.k8s.io/v1
   kind: TokenReview
   metadata:
     creationTimestamp: null
   spec:
     token: <token>
   status:
     audiences:
     - https://kubernetes.default.svc.cluster.local
     authenticated: true
     user:
       extra:
         authentication.kubernetes.io/credential-id:
         - JTI=7ee52be0-9045-4653-aa5e-0da57b8dccdc
         authentication.kubernetes.io/node-name:
         - kind-control-plane
         authentication.kubernetes.io/node-uid:
         - 497e9d9a-47aa-4930-b0f6-9f2fb574c8c6
         authentication.kubernetes.io/pod-name:
         - test-pod
         authentication.kubernetes.io/pod-uid:
         - e87dbbd6-3d7e-45db-aafb-72b24627dff5
       groups:
       - system:serviceaccounts
       - system:serviceaccounts:default
       - system:authenticated
       uid: f8b4161b-2e2b-11e9-86b7-2afc33b31a7e
       username: system:serviceaccount:default:my-sa
   ```

   {{< note >}}
   Попри використання `kubectl create -f` для створення цього ресурсу і його визначення подібно до інших типів ресурсів у Kubernetes, TokenReview є спеціальним типом, і kube-apiserver насправді не зберігає обʼєкт TokenReview в etcd. Тому `kubectl get tokenreview` не є допустимою командою.
   {{< /note >}}

#### Схема приватних тверджень службових облікових записів {#schema-for-service-account-private-claims}

Схема специфічних для Kubernetes тверджень у токенах JWT наразі не задокументована, проте відповідну ділянку коду можна знайти у [пакунку serviceaccount](https://github.com/kubernetes/kubernetes/blob/d8919343526597e0788a1efe133c70d9a0c07f69/pkg/serviceaccount/claims.go#L56-L68) у кодовій базі Kubernetes.

Ви можете перевірити JWT за допомогою стандартного інструменту декодування JWT. Нижче наведено приклад JWT для ServiceAccount `my-serviceaccount`, привʼязаного до обʼєкта Pod з іменем `my-pod`, який заплановано на вузол `my-node`, у просторі імен `my-namespace`:

```json
{
  "aud": [
    "https://my-audience.example.com"
  ],
  "exp": 1729605240,
  "iat": 1729601640,
  "iss": "https://my-cluster.example.com",
  "jti": "aed34954-b33a-4142-b1ec-389d6bbb4936",
  "kubernetes.io": {
    "namespace": "my-namespace",
    "node": {
      "name": "my-node",
      "uid": "646e7c5e-32d6-4d42-9dbd-e504e6cbe6b1"
    },
    "pod": {
      "name": "my-pod",
      "uid": "5e0bd49b-f040-43b0-99b7-22765a53f7f3"
    },
    "serviceaccount": {
      "name": "my-serviceaccount",
      "uid": "14ee3fa4-a7e2-420f-9f9a-dbc4507c3798"
    }
  },
  "nbf": 1729601640,
  "sub": "system:serviceaccount:my-namespace:my-serviceaccount"
}
```

{{< note >}}
Поля `aud` та `iss` у цьому JWT можуть відрізнятися між різними кластерами Kubernetes залежно від вашої конфігурації.

Наявність тверджень `pod` і `node` означає, що цей токен привʼязано до обʼєкта _Pod_. При перевірці токенів ServiceAccount, привʼязаних до Pod, API-сервер **не** перевіряє існування обʼєкта Node, на який посилається токен.
{{< /note >}}

Сервіси, які працюють за межами Kubernetes і хочуть виконувати перевірку JWT в автономному режимі, можуть використовувати цю схему разом із сумісним валідатором JWT, налаштованим за допомогою інформації OpenID Discovery з API-сервера, для перевірки представлених JWT без необхідності використання API TokenReview.

Сервіси, які перевіряють JWT таким чином, **не перевіряють**, чи є твердження, вбудовані в токен JWT, актуальними і досі дійсними. Це означає, що якщо токен привʼязаний до обʼєкта, а цей обʼєкт більше не існує, токен все одно вважатиметься дійсним (доки не спливе термін дії налаштованого токена).

Клієнти, яким потрібна впевненість у тому, що привʼязані твердження токена все ще дійсні, **ПОВИННІ** використовувати API TokenReview, щоб представити токен `kube-apiserver` для перевірки і розгортання вбудованих тверджень, використовуючи кроки, подібні до описаних у розділі [Перевірка та інспекція приватних тверджень](#verifying-and-inspecting-private-claims) вище, але з [підтримуваною клієнтською бібліотекою](/docs/reference/using-api/client-libraries/). Для отримання додаткової інформації про JWT та їх структуру див. [JSON Web Token RFC](https://datatracker.ietf.org/doc/html/rfc7519).

## Механізм томів привʼязаних токенів службових облікових записів {#bound-service-account-token-volume}

{{< feature-state feature_gate_name="BoundServiceAccountTokenVolume" >}}

Типово панель управління Kubernetes (зокрема, [контролер допуску ServiceAccount](#serviceaccount-admission-controller)) додає [проєкційний том](/docs/concepts/storage/projected-volumes/) до Podʼів, і цей том містить токен для доступу до API Kubernetes.

Ось приклад, як це виглядає для запущеного Podʼа:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      sources:
        - serviceAccountToken:
            path: token # має збігатися зі шляхом, який очікує застосунок
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

Цей фрагмент маніфесту визначає проєкційний том, що складається з трьох джерел. У цьому випадку кожне джерело також представляє один шлях у цьому томі. Три джерела такі:

1. Джерело `serviceAccountToken`, яке містить токен, що його kubelet отримує від kube-apiserver. Kubelet отримує токени з обмеженим терміном дії за допомогою API TokenRequest. Термін дії токена, виданого для TokenRequest, спливає або при видаленні Podʼа, або після визначеного терміну життя (типово це 1 година). Kubelet також оновлює цей токен до того, як спливе термін його дії. Токен привʼязаний до конкретного Podʼа і має kube-apiserver своєю аудиторією. Цей механізм замінив попередній механізм, який додавав том на основі Secret, де Secret представляв ServiceAccount для Podʼа, але не мав терміну дії.
1. Джерело `configMap`. ConfigMap містить набір даних центру сертифікації. Podʼи можуть використовувати ці сертифікати, щоб упевнитися, що вони підключаються до kube-apiserver вашого кластера (а не до проміжного вузла (middlebox) або випадково неправильно налаштованого рівноправного вузла (peer)).
1. Джерело `downwardAPI`, яке визначає імʼя простору імен, що містить Pod, і робить це імʼя доступним для коду застосунку, що виконується всередині Podʼа.

Будь-який контейнер у Podʼі, який монтує саме цей том, може отримати доступ до вищевказаної інформації.

{{< note >}}
Не існує окремого механізму для анулювання токена, виданого через TokenRequest. Якщо ви більше не довіряєте привʼязаному токену службового облікового запису для Podʼа, ви можете видалити цей Pod. Видалення Podʼа робить недійсними його привʼязані токени службових облікових записів.
{{< /note >}}

## Ручне управління Secret для ServiceAccount {#manual-secret-management-for-serviceaccounts}

Версії Kubernetes до v1.22 автоматично створювали облікові дані для доступу до API Kubernetes. Цей старіший механізм був заснований на створенні Secretʼів з токенами, які потім могли бути змонтовані в запущені Podʼи.

У новіших версіях, включно з Kubernetes v{{< skew currentVersion >}}, облікові дані API [отримуються безпосередньо](#bound-service-account-token-volume) за допомогою API [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) і монтуються в Podʼи за допомогою проєкційного тому. Токени, отримані за допомогою цього методу, мають обмежений термін дії та автоматично анулюються, коли Pod, в який вони змонтовані, видаляється.

Ви все ще можете [вручну створити](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) Secret для зберігання токена службового облікового запису; наприклад, якщо вам потрібен токен, термін дії якого ніколи не спливає.

Після того, як ви вручну створите Secret і звʼяжете його з ServiceAccount, панель управління Kubernetes автоматично заповнює токен у цьому Secret.

{{< note >}}
Хоча існує ручний механізм для створення довготривалого токена ServiceAccount, натомість рекомендується використовувати [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) для отримання короткочасних токенів доступу до API.
{{< /note >}}

## Очищення автоматично згенерованих застарілих токенів ServiceAccount {#auto-generated-legacy-serviceaccount-token-clean-up}

До версії 1.24 Kubernetes автоматично генерував токени на основі Secret для ServiceAccount. Щоб розрізнити автоматично згенеровані токени та створені вручну, Kubernetes перевіряє наявність посилання з поля secrets ServiceAccount. Якщо на Secret посилається поле `secrets`, він вважається автоматично згенерованим застарілим токеном. В іншому випадку він вважається вручну створеним застарілим токеном. Наприклад:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
  namespace: default
secrets:
  - name: build-robot-secret # зазвичай НЕ присутній для вручну створеного токена
```

Починаючи з версії 1.29, застарілі токени ServiceAccount, які були згенеровані автоматично, будуть позначені як недійсні, якщо вони залишатимуться невикористаними протягом певного періоду часу (типово один рік). Токени, які й надалі залишатимуться невикористаними протягом цього визначеного періоду (знову ж таки, типово один рік), згодом будуть видалені панеллю управління.

Якщо користувачі використовують анульований автоматично згенерований токен, валідатор токенів:

1. додасть анотацію аудиту для пари ключ-значення `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`,
1. збільшить лічильник метрики `invalid_legacy_auto_token_uses_total`,
1. оновить мітку Secret `kubernetes.io/legacy-token-last-used` новою датою,
1. поверне помилку, яка вказує, що токен було анульовано.

При отриманні цієї помилки валідації користувачі можуть оновити Secret, видаливши мітку `kubernetes.io/legacy-token-invalid-since`, щоб тимчасово дозволити використання цього токена.

Ось приклад автоматично згенерованого застарілого токена, який був позначений мітками `kubernetes.io/legacy-token-last-used` і `kubernetes.io/legacy-token-invalid-since`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  namespace: default
  labels:
    kubernetes.io/legacy-token-last-used: 2022-10-24
    kubernetes.io/legacy-token-invalid-since: 2023-10-25
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
```

## Деталі панелі управління {#control-plane-details}

### Контролер ServiceAccount {#serviceaccount-controller}

Контролер ServiceAccount керує ServiceAccountʼами всередині просторів імен та забезпечує наявність ServiceAccount з іменем "default" у кожному активному просторі імен.

### Контролер токенів {#token-controller}

Контролер токенів службових облікових записів працює як частина `kube-controller-manager`. Цей контролер діє асинхронно. Він:

- відстежує видалення ServiceAccount та видаляє всі відповідні Secretʼи токенів ServiceAccount.
- відстежує додавання Secretʼів токенів ServiceAccount, забезпечує наявність ServiceAccount, на який вони посилаються, і за потреби додає токен до Secretʼу.
- відстежує видалення Secretʼів і за потреби видаляє посилання з відповідного ServiceAccount.

Необхідно передати файл приватного ключа службового облікового запису контролеру токенів у `kube-controller-manager`, використовуючи прапорець `--service-account-private-key-file`. Приватний ключ використовується для підпису згенерованих токенів службових облікових записів. Аналогічно, необхідно передати відповідний публічний ключ у `kube-apiserver`, використовуючи прапорець `--service-account-key-file`. Публічний ключ буде використовуватися для перевірки токенів під час автентифікації.

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

Альтернативою встановленню прапорців `--service-account-private-key-file` та `--service-account-key-file` є налаштування зовнішнього підписувача JWT для [зовнішнього підписування токенів ServiceAccount та керування ключами](#external-serviceaccount-token-signing-and-key-management). Зверніть увагу, що ці налаштування є взаємовиключними і не можуть бути налаштовані разом.

### Контролер допуску ServiceAccount {#serviceaccount-admission-controller}

Зміна Podʼів здійснюється через втулок, який називається [контролером допуску](/docs/reference/access-authn-authz/admission-controllers/). Він є частиною API-сервера. Цей контролер допуску діє синхронно, змінюючи Podʼи під час їх створення. Коли цей втулок активний (а типово він активний у більшості дистрибутивів), то під час створення Podʼа він виконує такі дії:

1. Якщо у Podʼа не встановлено значення `.spec.serviceAccountName`, контролер допуску встановлює імʼя ServiceAccount для цього вхідного Podʼа як `default`.
1. Контролер допуску забезпечує наявність ServiceAccount, на який посилається вхідний Pod. Якщо не існує ServiceAccount з відповідним імʼям, контролер допуску відхиляє вхідний Pod. Ця перевірка застосовується навіть для ServiceAccount `default`.
1. За умови, що ні поле `automountServiceAccountToken` у ServiceAccount, ні поле `automountServiceAccountToken` у Podʼі не встановлено в `false`:
   - контролер допуску змінює вхідний Pod, додаючи додатковий {{< glossary_tooltip text="том" term_id="volume" >}}, що містить токен для доступу до API.
   - контролер допуску додає `volumeMount` до кожного контейнера в Podʼі, пропускаючи контейнери, які вже мають монтування тому, визначене для шляху `/var/run/secrets/kubernetes.io/serviceaccount`. Для Linux-контейнерів цей том монтується за шляхом `/var/run/secrets/kubernetes.io/serviceaccount`; на Windows-вузлах монтування знаходиться за еквівалентним шляхом.
1. Якщо специфікація вхідного Podʼа ще не містить жодних `imagePullSecrets`, контролер допуску додає `imagePullSecrets`, копіюючи їх з `ServiceAccount`.

### Контролер відстеження застарілих токенів ServiceAccount {#legacy-serviceaccount-token-tracking-controller}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenTracking" >}}

Цей контролер створює ConfigMap з назвою `kube-system/kube-apiserver-legacy-service-account-token-tracking` у просторі імен `kube-system`. ConfigMap фіксує мітку часу, коли система почала відстежувати застарілі токени службових облікових записів.

### Очищувач застарілих токенів ServiceAccount {#legacy-serviceaccount-token-cleaner}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenCleanUp" >}}

Очищувач застарілих токенів ServiceAccount працює як частина `kube-controller-manager` і кожні 24 години перевіряє, чи не залишався будь-який автоматично згенерований застарілий токен ServiceAccount невикористаним протягом _визначеного часу_. Якщо так, очищувач позначає ці токени як недійсні.

Очищувач працює, спершу перевіряючи ConfigMap, створений панеллю управління (за умови, що `LegacyServiceAccountTokenTracking` увімкнено). Якщо від дати в ConfigMap до поточного часу минув _визначений час_, очищувач переглядає список Secretʼів у кластері та оцінює кожен Secret, що має тип `kubernetes.io/service-account-token`.

Якщо Secret відповідає всім наступним умовам, очищувач позначає його як недійсний:

- Secret згенеровано автоматично, тобто на нього двонаправлено посилається ServiceAccount.
- Secret наразі не змонтовано жодним Podʼом.
- Secret не використовувався протягом _визначеного часу_ з моменту створення або останнього використання.

Очищувач позначає Secret як недійсний, додаючи до Secret мітку `kubernetes.io/legacy-token-invalid-since` з поточною датою як значенням. Якщо недійсний Secret не використовується протягом _визначеного часу_, очищувач видаляє його.

{{< note >}}
Усі згадані вище _визначені періоди часу_ типово становлять один рік. Адміністратор кластера може налаштувати це значення через аргумент командного рядка `--legacy-service-account-token-clean-up-period` для компонента `kube-controller-manager`.
{{< /note >}}

### API TokenRequest {#tokenrequest-api}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Ви використовуєте субресурс [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) ServiceAccount, щоб отримати токен з обмеженим терміном дії для цього ServiceAccount. Вам не потрібно викликати його для отримання API-токена для використання в контейнері, оскільки kubelet налаштовує це для вас, використовуючи _проєкційний том_.

Якщо ви хочете використовувати API TokenRequest через `kubectl`, див. [Ручне створення API-токена для ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).

Панель управління Kubernetes (зокрема, контролер допуску ServiceAccount) додає проєкційний том до Podʼів, а kubelet забезпечує, щоб цей том містив токен, який дозволяє контейнерам автентифікуватися як відповідний ServiceAccount.

(Цей механізм замінив попередній механізм, який додавав том на основі Secret, де Secret представляв ServiceAccount для Podʼа, але не мав терміну дії.)

Ось приклад того, як це виглядає для запущеного Podʼа:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # десятковий еквівалент вісімкового 0644
      sources:
        - serviceAccountToken:
            expirationSeconds: 3607
            path: token
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

Цей фрагмент маніфесту визначає проєкційний том, який обʼєднує інформацію з трьох джерел:

1. Джерело `serviceAccountToken`, що містить токен, який kubelet отримує від kube-apiserver. Kubelet отримує токени з обмеженим терміном дії, використовуючи API TokenRequest. Термін дії токена, виданого для TokenRequest, спливає або коли Pod видаляється, або після визначеного терміну життя (типово — 1 година). Токен привʼязаний до конкретного Podʼа та має kube-apiserver своєю аудиторією.
1. Джерело `configMap`. ConfigMap містить набір даних центру сертифікації. Podʼи можуть використовувати ці сертифікати, щоб переконатися, що вони підключаються до kube-apiserver вашого кластера (а не до проміжного вузла (middlebox) або випадково неправильно налаштованого рівноправного вузла (peer)).
1. Джерело `downwardAPI`. Цей том `downwardAPI` робить імʼя простору імен, що містить Pod, доступним для коду застосунку, що виконується всередині Podʼа.

Будь-який контейнер у Podʼі, що монтує цей том, може отримати доступ до вищезазначеної інформації.

## Створення додаткових API-токенів {#create-token}

{{< caution >}}
Створюйте довготривалі API-токени, тільки якщо механізм [запиту токенів](#tokenrequest-api) не підходить. Механізм запиту токенів надає токени з обмеженим терміном дії; оскільки термін їх дії спливає, вони становлять менший ризик для інформаційної безпеки.
{{< /caution >}}

Щоб створити безстроковий постійний API-токен для ServiceAccount, створіть Secret типу `kubernetes.io/service-account-token` з анотацією, що посилається на ServiceAccount. Панель управління потім генерує довготривалий токен і оновлює цей Secret даними згенерованого токена.

Ось приклад маніфесту для такого Secret:

{{% code_sample file="secret/serviceaccount/mysecretname.yaml" %}}

Щоб створити Secret на основі цього прикладу, виконайте:

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

Щоб переглянути деталі цього Secret, виконайте:

```shell
kubectl -n examplens describe secret mysecretname
```

Результат буде подібним до:

```
Name:           mysecretname
Namespace:      examplens
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=myserviceaccount
                kubernetes.io/service-account.uid=8a85c4c4-8483-11e9-bc42-526af7764f64

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1362 bytes
namespace:      9 bytes
token:          ...
```

Якщо ви запустите новий Pod у просторі імен `examplens`, він може використовувати Secret токена службового облікового запису `myserviceaccount`, який ви щойно створили.

{{< caution >}}
Не посилайтеся на вручну створені Secretʼи в полі `secrets` ServiceAccount. Інакше вручну створені Secretʼи будуть очищені, якщо вони не використовуватимуться протягом тривалого часу. Будь ласка, зверніться до розділу [очищення автоматично згенерованих застарілих токенів ServiceAccount](#auto-generated-legacy-serviceaccount-token-clean-up).
{{< /caution >}}

## Видалення/анулювання токена ServiceAccount {#delete-token}

### Видалення/анулювання довготривалого/застарілого токена ServiceAccount {#delete-legacy-token}

Якщо ви знаєте назву Secret, що містить токен, який ви хочете видалити:

```shell
kubectl delete secret name-of-secret
```

Інакше спочатку знайдіть Secret для ServiceAccount.

```shell
# Це передбачає, що у вас вже є простір імен 'examplens'
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

Результат буде подібним до:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "777"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-zyxwv
```

Потім видаліть Secret, назву якого ви тепер знаєте:

```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

### Видалення/анулювання короткочасного токена ServiceAccount {#delete-short-lived}

Термін дії короткочасних токенів ServiceAccount автоматично спливає після закінчення часу, вказаного під час їх створення. Центрального реєстру виданих токенів немає, тому немає способу відкликати окремі токени.

Якщо вам потрібно відкликати короткочасний токен до закінчення терміну його дії, ви можете видалити та повторно створити ServiceAccount, з яким він повʼязаний. Це змінить його UID і, отже, анулює **всі** токени ServiceAccount, які були створені для нього.

## Зовнішнє підписування токенів ServiceAccount та керування ключами {#external-serviceaccount-token-signing-and-key-management}

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

Kube-apiserver можна налаштувати на використання зовнішнього підписувача для підпису токенів та керування ключами перевірки токенів. Ця функція дозволяє дистрибутивам Kubernetes інтегруватися з рішеннями керування ключами на власний вибір (наприклад, HSM, хмарні KMS) для підпису та перевірки облікових даних службових облікових записів. Щоб налаштувати kube-apiserver на використання external-jwt-signer, встановіть у прапорці `--service-account-signing-endpoint` розташування сокета домену Unix (UDS) у файловій системі або значення з префіксом @, що вказує імʼя UDS в абстрактному просторі імен сокетів. На налаштованому UDS має працювати RPC-сервер, який реалізує gRPC-сервіс `ExternalJWTSigner`.

Для запуску kube-apiserver external-jwt-signer має бути справним і готовим обслуговувати підтримувані ключі службових облікових записів.

{{< note >}}
Прапорці kube-apiserver `--service-account-key-file` і `--service-account-signing-key-file` і надалі використовуватимуться для читання з файлів, якщо не встановлено `--service-account-signing-endpoint`; вони є взаємовиключними способами підтримки підпису та автентифікації JWT.
{{< /note >}}

Зовнішній підписувач надає gRPC-сервіс `v1.ExternalJWTSigner`, який реалізує 3 методи:

### Metadata {#metadata}

Metadata має викликатися `kube-apiserver` один раз під час запуску. Це дозволяє зовнішньому підписувачу ділитися з kube-apiserver метаданими, такими як максимальний термін дії токена, який підтримує підписувач.

```proto
rpc Metadata(MetadataRequest) returns (MetadataResponse) {}

message MetadataRequest {}

message MetadataResponse {
  // використовується kube-apiserver для встановлення типових значень/перевірки терміну дії JWT з урахуванням значень прапорців конфігурації:
  // 1. `--service-account-max-token-expiration`
  // 2. `--service-account-extend-token-expiration`
  //
  // * Якщо `--service-account-max-token-expiration` більше ніж `max_token_expiration_seconds`, kube-apiserver вважає це неправильним налаштуванням і завершує роботу.
  // * Якщо `--service-account-max-token-expiration` не встановлено явно, kube-apiserver типово використовує `max_token_expiration_seconds`.
  // * Якщо `--service-account-extend-token-expiration` має значення true, подовжений термін дії становить `min(1 year, max_token_expiration_seconds)`.
  //
  // `max_token_expiration_seconds` має бути не менше 600s.
  int64 max_token_expiration_seconds = 1;
}
```

### FetchKeys {#fetchkeys}

FetchKeys повертає набір публічних ключів, яким довіряють для підпису токенів службових облікових записів Kubernetes. Kube-apiserver викликатиме цей RPC:
* Кожного разу, коли він намагається перевірити JWT від видавця службових облікових записів з невідомим ідентифікатором ключа, і
* Періодично, щоб він міг надавати достатньо актуальні ключі з точки доступу OIDC JWKs.

```proto
rpc FetchKeys(FetchKeysRequest) returns (FetchKeysResponse) {}

message FetchKeysRequest {}

message FetchKeysResponse {
  repeated Key keys = 1;

  // Мітка часу, коли ці дані були отримані з авторитетного джерела
  // істини для ключів перевірки.
  // kube-apiserver може експортувати це в метриках, щоб уможливити наскрізні SLO.
  google.protobuf.Timestamp data_timestamp = 2;

  // інтервал оновлення ключів перевірки для підхоплення змін, якщо такі є.
  // будь-яке значення <= 0 вважається неправильним налаштуванням.
  int64 refresh_hint_seconds = 3;
}

message Key {
  // Унікальний ідентифікатор цього ключа.
  // Довжина має бути <=1024.
  string key_id = 1;

  // Публічний ключ, серіалізований у форматі PKIX.
  // має бути публічним ключем, який підтримує kube-apiserver (наразі RSA 256 або ECDSA 256/384/521)
  bytes key = 2;

  // Встановлюється тільки для ключів, які не використовуються для підпису привʼязаних токенів.
  // наприклад: підтримувані ключі для застарілих токенів.
  // Якщо встановлено, ключ використовується для перевірки, але виключається з документів OIDC discovery.
  // Якщо встановлено, зовнішній підписувач не повинен використовувати цей ключ для підпису JWT.
  bool exclude_from_oidc_discovery = 3;
}
```

### Sign {#sign}

Sign бере серіалізоване корисне навантаження JWT і повертає серіалізовані заголовок і підпис.  Потім `kube-apiserver` збирає JWT із заголовка, корисного навантаження та підпису.

```proto
rpc Sign(SignJWTRequest) returns (SignJWTResponse) {}

message SignJWTRequest {
  // Корисне навантаження для підпису, загорнуте в URL-безпечний base64.
  // Точно так, як воно зʼявляється у другому сегменті JWT
  string claims = 1;
}

message SignJWTResponse {
  // заголовок має містити лише твердження alg, kid, typ.
  // typ має бути “JWT”.
  // kid має бути непорожнім, <=1024 символів, і його відповідний публічний ключ не повинен бути виключений з OIDC discovery.
  // alg має бути одним з алгоритмів, які підтримує kube-apiserver (наразі RS256, ES256, ES384, ES512).
  // заголовок не може містити жодних додаткових даних, які kube-apiserver не розпізнає.
  // Вже загорнуто в URL-безпечний base64, точно так, як він зʼявляється в першому сегменті JWT.
  string header = 1;

  // Підпис для JWT.
  // Вже загорнуто в URL-безпечний base64, точно так, як він зʼявляється в останньому сегменті JWT.
  string signature = 2;
}
```

## Прибирання {#clean-up}

Якщо ви створили простір імен `examplens` для експериментів, ви можете його видалити:

```shell
kubectl delete namespace examplens
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [проєкційні томи](/docs/concepts/storage/projected-volumes/).
