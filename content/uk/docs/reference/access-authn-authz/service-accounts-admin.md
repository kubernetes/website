---
title: Управління службовими обліковими записами
content_type: concept
weight: 50
---

<!-- overview -->

_Службовий обліковий запис (ServiceAccount)_ надає ідентифікацію для процесів, що виконуються в Pod.

Процес всередині Pod може використовувати ідентифікацію свого повʼязаного службового облікового запису для автентифікації у API сервері кластера.

Для ознайомлення зі службовими обліковими записами, прочитайте про [конфігурування службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/).

Цей посібник пояснює деякі концепції, повʼязані зі ServiceAccount. Також у посібнику розглядається, як отримати або відкликати токени, що представляють ServiceAccounts. ServiceAccounts, і як (за бажанням) привʼязати термін дії ServiceAccounts до часу життя обʼєкта API.

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Щоб точно виконати ці кроки, переконайтеся, що у вас є простір імен під назвою `examplens`. Якщо ні, створіть його, виконавши команду:

```shell
kubectl create namespace examplens
```

## Облікові записи користувачів та службові облікові записи {#user-accounts-versus-service-accounts}

Kubernetes розрізняє поняття облікового запису користувача та службового облікового запису з кількох причин:

- Облікові записи користувачів призначені для людей. Службові облікові записи призначені для процесів застосунків, які (для Kubernetes) виконуються в контейнерах, що є частиною Pod.
- Облікові записи користувачів мають бути глобальними: імена повинні бути унікальними у всіх просторах імен кластера. Незалежно від того, який простір імен ви розглядаєте, певний обліковий запис користувача представляє того самого користувача. У Kubernetes службові облікові записи є привʼязаними до простору імен: два різні простори імен можуть містити ServiceAccountʼи з однаковими іменами.
- Як правило, облікові записи користувачів кластера можуть синхронізуватися з корпоративною базою даних, де створення нового облікового запису користувача вимагає спеціальних привілеїв і повʼязане зі складними бізнес-процесами. Навпаки, створення службових облікових записів повинно бути легшим, дозволяючи користувачам кластера створювати службові облікові записи для конкретних завдань за запитом. Відділення створення ServiceAccount від кроків для реєстрації користувачів полегшує дотримання принципу найменших привілеїв для робочих навантажень.
- Вимоги до аудиту для облікових записів користувачів (людей) та службових облікових записів можуть відрізнятися; розділення полегшує досягнення цих вимог.
- Конфігураційний пакет для складної системи може містити визначення різних службових облікових записів для компонентів цієї системи. Оскільки службові облікові записи можуть створюватися без багатьох обмежень і мають імена, привʼязані до простору імен, така конфігурація зазвичай є переносимою.

## Привʼязані токени службових облікових записів {#bound-service-account-tokens}

Токени ServiceAccount можуть бути привʼязані до API обʼєктів, що існують у kube-apiserver. Їх можна використовувати для звʼязування дійсності токена з існуванням іншого API обʼєкта. Підтримувані типи обʼєктів наступні:

- Pod (використовується для projected томів, див. нижче)
- Secret (може використовуватися для відкликання токена шляхом видалення Secret)
- Node (може використовуватись для автоматичного відкликання токенів, коли Вузол видалено; створення нових токенів, привʼязаних до вузлів, є загально доступним)

Коли токен привʼязаний до обʼєкта, `metadata.name` і `metadata.uid` цього обʼєкта зберігаються як додаткові "приватні заявки" у виданому JWT.

Коли привʼязаний токен представляється kube-apiserver, автентифікатор службового облікового запису витягне і перевірить ці заявки. Якщо вказаний обʼєкт або ServiceAccount знаходяться в процесі видалення (наприклад, через завершувач), то протягом будь-якого моменту, через 60 секунд (або більше) після дати `.metadata.deletionTimestamp`, автентифікація з використанням цього токена буде неуспішною. Якщо обʼєкт, на який він посилається, більше не існує (або його `metadata.uid` не збігається), запит не буде автентифікований.

### Додаткові метадані в токенах, повʼязаних з Pod {#additional-metadata-in-pod-bound-tokens}

{{< feature-state feature_gate_name="ServiceAccountTokenPodNodeInfo" >}}

Коли токен службового облікового запису привʼязаний до обʼєкта Pod, додаткові метадані також вбудовуються в токен, що вказує на значення поля `spec.nodeName` повʼязаного Pod і uid цього вузла, якщо це можливо.

Ця інформація про вузол **не** перевіряється kube-apiserver, коли токен використовується для автентифікації. Вона включена, щоб інтегратори не повинні були отримувати обʼєкти API Pod або Node для перевірки повʼязаного імені вузла та uid при інспекції JWT.

### Перевірка та інспекція приватних заявок {#verifying-and-inspecting-private-claims}

API TokenReview може використовуватися для перевірки та вилучення приватних заявок з токена:

1. Спочатку припустимо, що у вас є Pod з назвою `test-pod` і службовий обліковий запис з назвою `my-sa`.
1. Створіть токен, привʼязаний до цього Pod:

   ```shell
   kubectl create token my-sa --bound-object-kind="Pod" --bound-object-name="test-pod"
   ```

1. Скопіюйте цей токен у новий файл з назвою `tokenreview.yaml`:

   ```yaml
   apiVersion: authentication.k8s.io/v1
   kind: TokenReview
   spec:
     token: <токен з кроку 2>
   ```

1. Надішліть цей ресурс до apiserver для перевірки:

   ```shell
   kubectl create -o yaml -f tokenreview.yaml # ми використовуємо '-o yaml', щоб можна було перевірити вихідні дані
   ```

   Ви повинні побачити вихідні дані, подібні до наведених нижче:

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
   Попри використання `kubectl create -f` для створення цього ресурсу, і визначення його схожим чином з іншими типами ресурсів у Kubernetes, TokenReview є спеціальним типом і kube-apiserver насправді не зберігає обʼєкт TokenReview в etcd. Тому `kubectl get tokenreview` не є допустимою командою.
   {{< /note >}}

#### Схема для приватних вимог службового запису {#schema-for-service-account-private-claims}

Схема для специфічних для Kubernetes вимог у токенах JWT наразі не задокументована, проте відповідну кодову область можна знайти у [serviceaccount package](https://github.com/kubernetes/kubernetes/blob/d8919343526597e0788a1efe133c70d9a0c07f69/pkg/serviceaccount/claims.go#L56-L68) у кодовій базі Kubernetes.

Ви можете перевірити JWT за допомогою стандартного інструменту декодування JWT. Нижче наведено приклад JWT для облікового запису ServiceAccount `my-serviceaccount`, привʼязаного до обʼєкта Pod з іменем `my-pod`, який заплановано до вузла `my-node`, у просторі імен `my-namespace`:

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

Наявність полів `pod` і `node` означає, що цей токен привʼязано до обʼєкта _Pod_. При перевірці токенів ServiceAccount, привʼязаних до Pod, сервер API **не** перевіряє існування обʼєкта Node, на який посилається.
{{< /note >}}

Сервіси, які працюють за межами Kubernetes і хочуть виконувати перевірку JWT в автономному режимі, можуть використовувати цю схему разом із сумісним валідатором JWT, налаштованим на інформацію OpenID Discovery з сервера API, для перевірки представлених JWT без необхідності використання API TokenReview.

Сервіси, які перевіряють JWT таким чином, **не перевіряють** твердження, вбудовані в токен JWT, на актуальність і дійсність. Це означає, що якщо токен привʼязаний до обʼєкта, а цей обʼєкт більше не існує, токен все одно буде вважатися дійсним (до закінчення терміну дії налаштованого токена).

Клієнти, які потребують впевненості в тому, що повʼязані з токеном твердження все ще дійсні, **ПОВИННІ** використовувати TokenReview API, щоб представити токен `kube-apiserver` для перевірки і розширення вбудованих тверджень, використовуючи кроки, подібні до тих, що описані в розділі [Перевірка та інспекція приватних тверджень](#verifying-and-inspecting-private-claims) вище, але з [підтримуваною клієнтською бібліотекою](/docs/reference/using-api/client-libraries/). Для отримання додаткової інформації про JWT та їх структуру див. [JSON Web Token RFC](https://datatracker.ietf.org/doc/html/rfc7519).

## Механізм томів привʼязаного токена службового облікового запису {#bound-service-account-token-volume}

{{< feature-state feature_gate_name="BoundServiceAccountTokenVolume" >}}

Стандартно, панель управління Kubernetes (зокрема, [ServiceAccount admission controller](#serviceaccount-admission-controller)) додає [projected том](/docs/concepts/storage/projected-volumes/) до Pod, і цей том містить токен для доступу до API Kubernetes.

Ось приклад, як це виглядає для запущеного Pod:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      sources:
        - serviceAccountToken:
            path: token # має збігатися з шляхом, який очікує застосунок
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

Цей фрагмент маніфесту визначає projected том, що складається з трьох джерел. У цьому випадку,
кожне джерело також представляє один шлях у цьому томі. Три джерела такі:

1. Джерело `serviceAccountToken`, яке містить токен, який kubelet отримує з kube-apiserver. Kubelet отримує токени з обмеженим терміном дії за допомогою API TokenRequest. Токен, наданий для TokenRequest, закінчується або при видаленні Pod, або після визначеного терміну дії (стандартно, це 1 година). Kubelet також оновлює цей токен перед тим, як термін його дії закінчиться. Токен привʼязаний до конкретного Pod і має kube-apiserver як свою аудиторію. Цей механізм замінив попередній механізм, який додавав том на основі Secret, де Secret представляв ServiceAccount для Pod, але не мав терміну дії.
2. Джерело `configMap`. ConfigMap містить набір даних центру сертифікації. Pod можуть використовувати ці сертифікати, щоб упевнитись, що вони підключаються до kube-apiserver вашого кластера (а не до проміжного блоку або випадково неправильно налаштованого колеги).
3. Джерело `downwardAPI`, яке шукає імʼя простору імен, що містить Pod, і надає цю інформацію про імʼя для коду застосунку, що виконується всередині Pod.

Будь-який контейнер у Pod, який монтує цей том, може отримати доступ до вищевказаної інформації.

{{< note >}}
Не існує якогось окремого механізму для анулювання токена, виданого через TokenRequest. Якщо ви більше не довіряєте привʼязаному токену службового облікового запису для Pod, ви можете видалити цей Pod. Видалення Pod анулює його привʼязані токени службових облікових записів.
{{< /note >}}

## Ручне управління Secret для ServiceAccounts {#manual-secret-management-for-serviceaccounts}

Версії Kubernetes до v1.22 автоматично створювали облікові дані для доступу до API Kubernetes. Цей старіший механізм був заснований на створенні токенів Secret, які потім могли бути змонтовані в запущені Podʼи.

У новіших версіях, включаючи Kubernetes v{{< skew currentVersion >}}, API облікові дані отримуються безпосередньо за допомогою [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/), і монтуються в Podʼи за допомогою projected тому. Токени, отримані за допомогою цього методу, мають обмежений термін дії та автоматично анулюються, коли Pod, в який вони змонтовані, видаляється.

Ви все ще можете [створити вручну](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) Secret для збереження токена службового облікового запису; наприклад, якщо вам потрібен токен, який ніколи не закінчується.

Після того, як ви вручну створите Secret і звʼяжете його зі службовим обліковим записом, панель управління Kubernetes автоматично заповнює токен у цьому Secret.

{{< note >}}
Хоча існує ручний механізм для створення токена службового облікового запису з тривалим терміном дії, рекомендується використовувати [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) для отримання токенів доступу до API з коротким терміном дії.
{{< /note >}}

## Автоматичне очищення застарілих токенів ServiceAccount {#auto-generated-legacy-serviceaccount-token-clean-up}

До версії 1.24 Kubernetes автоматично генерував токени на основі Secret для ServiceAccount. Щоб розрізнити автоматично згенеровані токени та створені вручну, Kubernetes перевіряє посилання з поля секретів ServiceAccount. Якщо Secret згадується в полі `secrets`, він вважається автоматично згенерованим застарілим токеном. В іншому випадку він вважається вручну створеним застарілим токеном. Наприклад:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
  namespace: default
secrets:
  - name: build-robot-secret # зазвичай НЕ присутній для вручну створеного токена
```

Починаючи з версії 1.29, застарілі токени службових облікових записів, які були згенеровані автоматично, будуть позначені як недійсні, якщо вони залишатимуться невикористаними протягом певного періоду часу (стандартно один рік). Токени, які продовжують залишатися невикористаними протягом цього визначеного періоду (знову ж таки, стандартно один рік), будуть згодом видалені панеллю управління.

Якщо користувачі використовують анульований автоматично згенерований токен, валідатор токенів:

1. додасть анотацію аудиту для пари ключ-значення `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`,
1. збільшить лічильник метрики `invalid_legacy_auto_token_uses_total`,
1. оновить мітку Secret `kubernetes.io/legacy-token-last-used` з новою датою,
1. поверне помилку, вказуючи, що токен був анульований.

При отриманні цієї помилки валідації користувачі можуть оновити Secret, щоб видалити мітку `kubernetes.io/legacy-token-invalid-since`, щоб тимчасово дозволити використання цього токена.

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

Контролер ServiceAccount керує ServiceAccount всередині просторів імен та забезпечує наявність ServiceAccount з іменем "default" у кожному активному просторі імен.

### Контролер токенів {#token-controller}

Контролер токенів службових облікових записів працює як частина `kube-controller-manager`. Цей контролер діє асинхронно. Він:

- відстежує видалення ServiceAccount та видаляє всі відповідні Secretʼи токенів ServiceAccount.
- відстежує додавання Secretʼу токенів ServiceAccount та забезпечує наявність відповідного ServiceAccount, додає токен до Secretʼу за потреби.
- відстежує видалення Secretʼу та видаляє посилання з відповідного ServiceAccount за потреби.

Необхідно передати файл приватного ключа службового облікового запису контролеру токенів у `kube-controller-manager`, використовуючи прапорець `--service-account-private-key-file`. Приватний ключ використовується для підпису згенерованих токенів службових облікових записів. Аналогічно, необхідно передати відповідний публічний ключ у `kube-apiserver`, використовуючи прапорець `--service-account-key-file`. Публічний ключ буде використовуватися для перевірки токенів під час автентифікації.

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

Альтернативою встановленню прапорців `--service-account-private-key-file` та `--service-account-key-file` є налаштування зовнішнього підписувача JWT для [зовнішнього підписувача токенів ServiceAccount та керування ключами](#external-serviceaccount-token-signing-and-key-management). Зверніть увагу, що ці налаштування є взаємовиключними і не можуть бути налаштовані разом.

### Контролер допуску ServiceAccount {#serviceaccount-admission-controller}

Зміна Podʼів здійснюється через втулок, що викликається [Контролером допуску](/docs/reference/access-authn-authz/admission-controllers/). Він є частиною сервера API. Цей контролер допуску діє синхронно для зміни Podʼів під час їх створення. Коли цей втулок активний (а він є стандартно активним у більшості дистрибутивів), то під час створення Pod він виконує наступні дії:

1. Якщо у Pod не встановлено значення `.spec.serviceAccountName`, контролер допуску встановлює імʼя ServiceAccount `default` для цього Pod.
2. Контролер допуску забезпечує наявність ServiceAccount, на який посилається Pod. Якщо не існує ServiceAccount з відповідним імʼям, контролер допуску відхиляє Pod. Ця перевірка застосовується навіть для `default` ServiceAccount.
3. Якщо поле `automountServiceAccountToken` у ServiceAccount або в Podʼі не встановлено в `false`:
   - контролер допуску змінює Pod, додаючи додатковий {{< glossary_tooltip text="том" term_id="volume" >}}, що містить токен для доступу до API.
   - контролер допуску додає `volumeMount` до кожного контейнера в Podʼі, пропускаючи контейнери, які вже мають визначений шлях для монтування тому `/var/run/secrets/kubernetes.io/serviceaccount`. Для Linux-контейнерів цей том монтується за адресою `/var/run/secrets/kubernetes.io/serviceaccount`; на Windows-вузлах монтування знаходиться ну еквівалентному шляху.
4. Якщо в специфікації Pod не містяться жодні `imagePullSecrets`, контролер допуску додає `imagePullSecrets`, копіюючи їх з `ServiceAccount`.

### Контролер відстеження токенів застарілих ServiceAccount {#legacy-serviceaccount-token-tracking-controller}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenTracking" >}}

Цей контролер створює ConfigMap з назвою `kube-system/kube-apiserver-legacy-service-account-token-tracking` у просторі імен `kube-system`. ConfigMap фіксує мітку часу, коли система почала відстежувати застарілі токени службових облікових записів.

### Очищувач токенів застарілих ServiceAccount {#legacy-serviceaccount-token-cleaner}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenCleanUp" >}}

Очищувач токенів застарілих ServiceAccount працює як частина `kube-controller-manager` і перевіряє кожні 24 години, чи не використовувався будь-який автоматично згенерований застарілий токен службового облікового запису протягом _визначеного часу_. Якщо так, очищувач позначає ці токени як недійсні.

Очищувач працює, спершу перевіряючи ConfigMap, створений панеллю управління (за умови, що `LegacyServiceAccountTokenTracking` увімкнено). Якщо поточний час перевищує _визначений час_ після дати в ConfigMap, очищувач переглядає список Secretʼів у кластері та оцінює кожен Secret, що має тип `kubernetes.io/service-account-token`.

Якщо Secret відповідає всім наступним умовам, очищувач позначає його як недійсний:

- Secret створено автоматично, що означає що він двонаправлено згадується ServiceAccount.
- Secret не змонтовано жодним Podʼом.
- Secret не використовувався протягом _визначеного часу_ з моменту створення або останнього використання.

Очищувач позначає Secret як недійсний, додаючи мітку `kubernetes.io/legacy-token-invalid-since` до Secret, з поточною датою. Якщо недійсний Secret не використовується протягом _визначеного часу_, очищувач видаляє його.

{{< note >}}
Усі _визначені часи_ стандартно становлять один рік. Адміністратор кластера може налаштувати це значення через аргумент командного рядка `--legacy-service-account-token-clean-up-period` для компонента `kube-controller-manager`.
{{< /note >}}

### API TokenRequest {#tokenrequest-api}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Ви використовуєте субресур [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) з ServiceAccount, щоб отримати токен з обмеженим часом дії для цього ServiceAccount. Вам не потрібно викликати його для отримання API-токена для використання в контейнері, оскільки kubelet налаштовує це для вас, використовуючи _projected том_.

Якщо ви хочете використовувати API TokenRequest через `kubectl`, див. [Ручне створення API-токена для ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).

Панель управління Kubernetes (зокрема, контролер допуску ServiceAccount) додає projected том до Podʼів, а kubelet забезпечує, що цей том містить токен, який дозволяє контейнерам автентифікуватися як відповідний ServiceAccount.

(Цей механізм замінив попередній механізм, який додавав том на основі Secret, де Secret представляв ServiceAccount для Pod, але не мав терміну дії.)

Ось приклад того, як це виглядає для запущеного Pod:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # десятичний еквівалент вісімкового 0644
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

Цей фрагмент маніфесту визначає projected том, який обʼєднує інформацію з трьох джерел:

1. Джерело `serviceAccountToken`, що містить токен, який kubelet отримує від kube-apiserver. Kubelet отримує токени з обмеженим часом дії, використовуючи API TokenRequest. Токен, виданий для TokenRequest, спливає або коли Pod видаляється, або через визначений термін життя (стандартно — 1 година). Токен привʼязаний до конкретного Podʼа та має kube-apiserver як свою аудиторію.
2. Джерело `configMap`. ConfigMap містить пакет даних сертифікаційного центру. Podʼи можуть використовувати ці сертифікати, щоб переконатися, що вони підключаються до kube-apiserver вашого кластера (а не до проміжного блоку або випадково неправильно налаштованого колеги).
3. Джерело `downwardAPI`. Цей том `downwardAPI` робить імʼя простору імен, що містить Pod, доступним для коду програми, що працює всередині Podʼа.

Будь-який контейнер у Podʼі, що монтує цей том, може отримати доступ до вищезазначеної інформації.

## Створення додаткових API токенів {#create-token}

{{< caution >}}
Створюйте довгострокові API токени тільки якщо механізм [запиту токенів](#tokenrequest-api) не підходить. Механізм запиту токенів надає токени з обмеженим часом дії; оскільки вони спливають, вони представляють менший ризик для інформаційної безпеки.
{{< /caution >}}

Для створення постійного API токена для ServiceAccount, створіть Secret типу `kubernetes.io/service-account-token` з анотацією, що посилається на ServiceAccount. Панель управління потім генерує довгостроковий токен і оновлює цей Secret з даними згенерованого токена.

Ось приклад маніфесту для такого Secret:

{{% code_sample file="secret/serviceaccount/mysecretname.yaml" %}}

Для створення Secret на основі цього прикладу, виконайте:

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

Для перегляду деталей цього Secret, виконайте:

```shell
kubectl -n examplens describe secret mysecretname
```

Результат буде подібним до:

```none
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

Якщо ви запустите новий Pod у просторі імен `examplens`, він може використовувати Secret токену службового облікового запису `myserviceaccount`, який ви щойно створили.

{{< caution >}}
Не посилайтеся на вручну створені Secretʼи в полі `secrets` ServiceAccount. Вручну створені Secret будуть очищені, якщо вони не використовуватимуться протягом тривалого часу. Будь ласка, зверніться до [очищення автоматично згенерованих токенів застарілих ServiceAccount](#auto-generated-legacy-serviceaccount-token-clean-up).
{{< /caution >}}

## Видалення/деактивація токена ServiceAccount {#delete-token}

### Видалення/деактивація довгострокового/застарілого токена ServiceAccount {#delete-legacy-token}

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

### Видалення/деактивація короткочасного токена ServiceAccount {#delete-short-lived}

Короткочасні токени ServiceAccount автоматично втрачають силу після закінчення терміну, вказаного під час їх створення. Немає центрального запису виданих токенів, тому немає способу відкликати окремі токени.

Якщо вам потрібно відкликати короткочасний токен до його закінчення, ви можете видалити та повторно створити ServiceAccount, до якого він привʼязаний. Це змінить його UID і, отже, анулює **всі** токени ServiceAccount, які були створені для нього.

## Підписування та керування токенами зовнішніх ServiceAccount{#external-serviceaccount-token-signing-and-key-management}

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

Kube-apiserver можна налаштувати на використання зовнішнього підписувача для підпису токенів та управління ключами для перевірки токенів. Ця можливість дозволяє дистрибутивам kubernetes інтегруватися з рішеннями керування ключами за власним вибором (наприклад, HSM, хмарні KMS) для підписання та перевірки облікових даних службових облікових записів. Щоб налаштувати kube-apiserver на використання external-jwt-signer, встановіть прапорець `--service-account-signing-endpoint` на розташування сокета домену Unix (UDS) у файловій системі, або додайте префікс @ і назвіть UDS в абстрактному просторі назв сокетів. На сконфігурованому UDS має бути RPC-сервер, який реалізує gRPC-сервіс `ExternalJWTSigner`.

External-jwt-signer має бути працездатним і готовим обслуговувати підтримувані ключі сервісних облікових записів для запуску kube-apiserver.

{{< note >}}
Прапорці kube-apiserver `--service-account-key-file` і `--service-account-signing-key-file` і надалі використовуватимуться для читання з файлів, якщо не встановлено `--service-account-signing-endpoint`; вони є взаємовиключними способами підтримки підпису та автентифікації JWT.
{{< /note >}}

Зовнішній підписувач надає gRPC-сервіс `v1.ExternalJWTSigner`, який реалізує 3 методи:

### Metadata

Metadata має викликатись один раз `kube-apiserver` під час запуску. Це дозволяє зовнішньому підписувачу ділитися метаданими з kube-apiserver, такими як максимальний термін дії токена, який підтримує підписувач.

```proto
rpc Metadata(MetadataRequest) returns (MetadataResponse) {}

message MetadataRequest {}

message MetadataResponse {
  // використовується kube-apiserver для встановлення стандартних значень/перевірки терміну дії JWT з урахуванням значень прапорців конфігурації:
  // 1. `--service-account-max-token-expiration`
  // 2. `--service-account-extend-token-expiration`
  //
  // * Якщо `--service-account-max-token-expiration` більше ніж `max_token_expiration_seconds`, kube-apiserver вважає це неправильним налаштуванням і завершує роботу.
  // * Якщо `--service-account-max-token-expiration` не встановлено явно, kube-apiserver стандартно використовує `max_token_expiration_seconds`.
  // * Якщо `--service-account-extend-token-expiration` істинне, розширений термін дії становить `min(1 year, max_token_expiration_seconds)`.
  //
  // `max_token_expiration_seconds` повинен бути не менше 600s.
  int64 max_token_expiration_seconds = 1;
}
```

### FetchKeys

FetchKeys повертає набір (set) публічних ключів, які мають відповідну довіру для підпису токенів службових облікових записів Kubernetes. Kube-apiserver буде викликати цей RPC:

- Кожного разу, коли він намагається перевірити JWT від видавця службового облікового запису з невідомим ідентифікатором ключа, і
- Періодично, щоб він міг надавати досить актуальні ключі з кінцевої точки OIDC JWKs.

```proto
rpc FetchKeys(FetchKeysRequest) returns (FetchKeysResponse) {}

message FetchKeysRequest {}

message FetchKeysResponse {
  repeated Key keys = 1;

  // Часовий відбиток, коли ці дані були отримані з авторитетного джерела
  // істини для ключів перевірки.
  // kube-apiserver може експортувати це з метрик, щоб уможливити наскрізні SLO.
  google.protobuf.Timestamp data_timestamp = 2;

  // інтервал оновлення для ключів перевірки, щоб виявити зміни, якщо такі є.
  // будь-яке значення <= 0 вважається неправильним налаштуванням.
  int64 refresh_hint_seconds = 3;
}

message Key {
  // Унікальний ідентифікатор для цього ключа.
  // Довжина повинна бути <=1024.
  string key_id = 1;

  // Публічний ключ, PKIX-серіалізований.
  // повинен бути публічним ключем, підтримуваним kube-apiserver (в даний час RSA 256 або ECDSA 256/384/521)
  bytes key = 2;

  // Встановлюється тільки для ключів, які не використовуються для підписання повʼязаних токенів.
  // Наприклад: підтримувані ключі для застарілих токенів.
  // Якщо встановлено, ключ використовується для перевірки, але виключається з документів OIDC discovery.
  // Якщо встановлено, зовнішній підписувач не повинен використовувати цей ключ для підписання JWT.
  bool exclude_from_oidc_discovery = 3;
}
```

### Sign

Sign бере серіалізоване навантаження JWT і повертає серіалізований заголовок і підпис.  `kube-apiserver` потім збирає JWT з заголовка, навантаження та підпису.

```proto
rpc Sign(SignJWTRequest) returns (SignJWTResponse) {}

message SignJWTRequest {
  // URL-безпечний base64-загорнутий корисне навантаження, що підлягає підписанню.
  // Так само, як він зʼявляється у другому сегменті JWT
  string claims = 1;
}

message SignJWTResponse {
  // заголовок має містити лише claims alg, kid, typ.
  // typ повинен бути “JWT”.
  // kid повинен бути непорожнім, <=1024 символів, і його відповідний публічний ключ не повинен бути виключений з OIDC discovery.
  // alg повинен бути одним з алгоритмів, підтримуваних kube-apiserver (в даний час RS256, ES256, ES384, ES512).
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

## {{% heading "whatsnext" %}}

- Прочитайте більше деталей про [projected томи](/docs/concepts/storage/projected-volumes/).
