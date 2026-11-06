---
title: Налаштування службових облікових записів для Podʼів
content_type: task
weight: 120
---

Kubernetes пропонує два різні способи автентифікації в {{< glossary_tooltip text="API-сервері" term_id="kube-apiserver" >}} для клієнтів, які працюють у вашому кластері або іншим чином повʼязані з {{< glossary_tooltip text="панеллю управління" term_id="control-plane" >}} вашого кластера.

_Службовий обліковий запис_ надає ідентичність процесам, які працюють у Podʼі, і відповідає обʼєкту ServiceAccount. Коли ви автентифікуєтеся в API-сервері, ви ідентифікуєте себе як певного _користувача_. Kubernetes визнає поняття користувача, але сам Kubernetes **не має** API User.

Цей посібник стосується ServiceAccount, які існують в API Kubernetes. Посібник показує кілька способів налаштування ServiceAccount для Podʼів.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Використання стандартного службового облікового запису для доступу до API-сервера {#use-the-default-service-account-to-access-the-api-server}

Коли Podʼи звертаються до API-сервера, вони автентифікуються як певний ServiceAccount (наприклад, `default`). У кожному {{< glossary_tooltip text="просторі імен" term_id="namespace" >}} завжди є щонайменше один ServiceAccount.

Кожен простір імен Kubernetes містить щонайменше один ServiceAccount: стандартний ServiceAccount цього простору імен з назвою `default`. Якщо під час створення Podʼа не вказати ServiceAccount, Kubernetes автоматично призначає ServiceAccount з назвою `default` у цьому просторі імен.

Можна отримати подробиці про створений Pod. Наприклад:

```shell
kubectl get pods/<podname> -o yaml
```

У виводі ви побачите поле `spec.serviceAccountName`. Kubernetes автоматично встановлює це значення, якщо ви не вказали його під час створення Podʼа.

Застосунок, що працює в Podʼі, може отримати доступ до API Kubernetes за допомогою автоматично змонтованих облікових даних службового облікового запису. Докладніше дивіться [доступ до кластера](/docs/tasks/access-application-cluster/access-cluster/).

Коли Pod автентифікується як ServiceAccount, його рівень доступу залежить від [втулка й політики авторизації](/docs/reference/access-authn-authz/authorization/#authorization-modules), що використовуються.

Облікові дані API автоматично відкликаються, коли Pod видаляється, навіть якщо є завершувачі. Зокрема, облікові дані API відкликаються через 60 секунд після значення `.metadata.deletionTimestamp`, встановленого для Podʼа (час видалення зазвичай дорівнює часу, коли запит **delete** було прийнято, плюс пільговий період завершення роботи Podʼа).

### Відмова від автоматичного монтування облікових даних API {#opt-out-of-api-credential-automounting}

Якщо ви не бажаєте, щоб {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} автоматично монтував облікові дані API ServiceAccount, ви можете відмовитися від такої стандартної поведінки. Ви можете відмовитися від автоматичного монтування облікових даних API у `/var/run/secrets/kubernetes.io/serviceaccount/token` для службового облікового запису, встановивши значення `automountServiceAccountToken: false` у ServiceAccount:

Наприклад:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

Ви також можете відмовитися від автоматичного монтування облікових даних API для певного Podʼа:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

Якщо як ServiceAccount, так і `.spec` Podʼа вказують значення для `automountServiceAccountToken`, специфікація Podʼа має перевагу.

## Використання більше ніж одного ServiceAccount {#use-multiple-service-accounts}

У кожному просторі імен є щонайменше один ServiceAccount: стандартний ресурс ServiceAccount з назвою `default`. Перелік усіх ресурсів ServiceAccount у вашому [поточному просторі імен](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference) можна вивести так:

```shell
kubectl get serviceaccounts
```

Вивід подібний до такого:

```
NAME      SECRETS    AGE
default   1          1d
```

Ви можете створити додаткові обʼєкти ServiceAccount таким чином:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

Імʼя обʼєкта ServiceAccount повинно бути дійсним [DNS-піддоменним імʼям](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Якщо ви отримуєте повний дамп обʼєкта ServiceAccount, подібний до цього:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

Вивід подібний до такого:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-06-16T00:12:34Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
```

Ви можете використовувати втулки авторизації для [встановлення дозволів на службові облікові записи](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Щоб використовувати нестандартний службовий обліковий запис, встановіть у полі `spec.serviceAccountName` Podʼа імʼя ServiceAccount, який ви хочете використовувати.

Поле `serviceAccountName` можна встановити лише під час створення Podʼа або в шаблоні нового Podʼа. Оновити поле `.spec.serviceAccountName` наявного Podʼа не можна.

{{< note >}}
Поле `.spec.serviceAccount` є застарілою альтернативою для `.spec.serviceAccountName`. Якщо ви хочете видалити поля з ресурсу робочого навантаження, встановіть обидва поля явно пустими у [шаблоні Pod](/docs/concepts/workloads/pods#pod-templates).
{{< /note >}}

### Очищення {#cleanup-use-multiple-service-accounts}

Якщо ви пробували створити ServiceAccount `build-robot` з прикладу вище, його можна видалити, виконавши:

```shell
kubectl delete serviceaccount/build-robot
```

## Створення API-токена для ServiceAccount вручну {#manually-create-an-api-token-for-a-serviceaccount}

Припустимо, у вас вже є службовий обліковий запис з назвою "build-robot", як зазначено вище.

Ви можете отримати тимчасовий API-токен для цього ServiceAccount за допомогою `kubectl`:

```shell
kubectl create token build-robot
```

Вивід цієї команди — токен, який можна використовувати для автентифікації як цей ServiceAccount. Певний строк дії токена можна запросити за допомогою аргументу командного рядка `--duration` для `kubectl create token` (фактичний строк дії виданого токена може бути коротшим або навіть довшим).

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

Використовуючи `kubectl` v1.31 або новішу версію, можна створити токен службового облікового запису, який буде безпосередньо привʼязано до вузла:

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

Токен буде чинний до закінчення його терміну дії або до видалення відповідного вузла чи службового облікового запису.

{{< note >}}
У версіях Kubernetes до v1.22 автоматично створювалися довгострокові облікові дані для доступу до API Kubernetes. Цей старий механізм ґрунтувався на створенні Secret з токенами, які потім можна було монтувати в запущені Podʼи. У новіших версіях, зокрема в Kubernetes v{{< skew currentVersion >}}, облікові дані API отримуються безпосередньо за допомогою API [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) і монтуються в Podʼи за допомогою [проєкційного тому](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume). Токени, отримані цим методом, мають обмежений строк дії й автоматично стають недійсними, коли Pod, у який їх змонтовано, видаляється.

Ви й далі можете вручну створити Secret з токеном службового облікового запису; наприклад, якщо вам потрібен токен, строк дії якого ніколи не спливає. Однак для отримання токена доступу до API рекомендується натомість використовувати субресурс [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/).
{{< /note >}}

### Створення довгострокового API-токена для ServiceAccount вручну {#manually-create-a-long-lived-api-token-for-a-serviceaccount}

Якщо ви бажаєте отримати API-токен для службового облікового запису, ви створюєте новий Secret з особливою анотацією `kubernetes.io/service-account.name`.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

Якщо ви переглянете Secret використовуючи:

```shell
kubectl get secret/build-robot-secret -o yaml
```

ви побачите, що тепер Secret містить API-токен для ServiceAccount "build-robot".

Завдяки встановленій анотації панель управління автоматично генерує токен для цього ServiceAccount і зберігає його у відповідному Secret. Панель управління також очищає токени видалених ServiceAccount.

```shell
kubectl describe secrets/build-robot-secret
```

Вивід подібний до такого:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
Зміст `token` тут пропущений.

Стежте, щоб не показувати вміст Secret `kubernetes.io/service-account-token` там, де ваш термінал / екран компʼютера може побачити стороння людина.
{{< /note >}}

Коли ви видаляєте ServiceAccount, що має повʼязаний Secret, панель управління Kubernetes автоматично очищає довгостроковий токен із цього Secret.

{{< note >}}
Якщо ви переглянете ServiceAccount використовуючи:

` kubectl get serviceaccount build-robot -o yaml`

Ви не побачите Secret `build-robot-secret` у полі [`.secrets`](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/) обʼєкта API ServiceAccount, оскільки це поле заповнюється лише автоматично згенерованими Secret.
{{< /note >}}

## Додавання ImagePullSecrets до службового облікового запису {#add-imagepullsecrets-to-a-service-account}

Спочатку [створіть imagePullSecret](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod). Потім перевірте, чи він був створений. Наприклад:

- Створіть imagePullSecret, як описано в розділі [Вказування ImagePullSecrets для Podʼа](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=<registry name> \
          --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
          --docker-email=DUMMY_DOCKER_EMAIL
  ```

- Перевірте, чи він був створений.

  ```shell
  kubectl get secrets myregistrykey
  ```

  Вивід подібний до такого:

  ```
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

### Додавання Secret для завантаження образу до службового облікового запису {#add-image-pull-secret-to-service-account}

Далі змініть стандартний службовий обліковий запис простору імен, щоб він використовував цей Secret як imagePullSecret.

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

Ви можете досягти того ж самого результату, відредагувавши обʼєкт вручну:

```shell
kubectl edit serviceaccount/default
```

Вивід файлу `sa.yaml` подібний до такого:

Вибраний вами текстовий редактор відкриється з конфігурацією, що схожа на цю:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
```

За допомогою вашого редактора видаліть рядок з ключем `resourceVersion`, додайте рядки для `imagePullSecrets:` та збережіть це. Залиште значення `uid` таким же, як ви його знайшли.

Після внесення змін, відредагований ServiceAccount виглядатиме схоже на це:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
imagePullSecrets:
  - name: myregistrykey
```

### Перевірка, що imagePullSecrets встановлено для нових Podʼів {#verify-that-imagepullsecrets-are-set-for-new-pods}

Тепер, коли в поточному просторі імен створюється новий Pod, що використовує стандартний ServiceAccount, у новому Podʼі автоматично встановлюється поле `spec.imagePullSecrets`:

```shell
kubectl run nginx --image=<registry name>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

Вивід:

```
myregistrykey
```

## Проєцювання токенів ServiceAccount {#serviceaccount-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
Щоб увімкнути й використовувати проєкцію запиту токена, потрібно вказати кожен із таких аргументів командного рядка для `kube-apiserver`:

`--service-account-issuer`
: визначає ідентифікатор емітента токенів службових облікових записів. Аргумент `--service-account-issuer` можна вказати кілька разів, це може бути корисно для зміни емітента без порушення роботи. Коли цей прапорець вказано кілька разів, перше значення використовується для генерації токенів, а всі значення — для визначення прийнятних емітентів. Щоб мати змогу вказати `--service-account-issuer` кілька разів, потрібен Kubernetes v1.22 або новіший.

`--service-account-key-file`
: вказує шлях до файлу, який містить закодовані в PEM приватні або публічні ключі X.509 (RSA або ECDSA), що використовуються для перевірки токенів ServiceAccount. Вказаний файл може містити кілька ключів, а прапорець можна вказати кілька разів з різними файлами. Якщо його вказано кілька разів, API-сервер Kubernetes вважає дійсними токени, підписані будь-яким із вказаних ключів.

`--service-account-signing-key-file`
: вказує шлях до файлу, який містить поточний приватний ключ емітента токенів службових облікових записів. Емітент підписує видані ID-токени цим приватним ключем.

`--api-audiences` (можна не вказувати)
: визначає аудиторії для токенів ServiceAccount. Автентифікатор токенів службових облікових записів перевіряє, що токени, які використовуються з API, привʼязані щонайменше до однієї з цих аудиторій. Якщо `api-audiences` вказано кілька разів, API-сервер Kubernetes вважає дійсними токени для будь-якої з указаних аудиторій. Якщо ви вказали аргумент командного рядка `--service-account-issuer`, але не встановили `--api-audiences`, панель управління стандартно використовує список аудиторій з одного елемента, що містить лише URL емітента.

{{< /note >}}

kubelet також може проєцювати токен ServiceAccount у Pod. Можна вказати бажані властивості токена, такі як аудиторія та строк дії. Ці властивості _не_ налаштовуються для стандартного токена ServiceAccount. Токен також стане недійсним для API, коли буде видалено Pod або ServiceAccount.

Цю поведінку можна налаштувати в `spec` Podʼа за допомогою типу [проєкційного тому](/docs/concepts/storage/volumes/#projected) під назвою `ServiceAccountToken`.

Токен з цього проєкційного тому — це {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}} (JWT). JSON-вміст цього токена відповідає чітко визначеній схемі; ось приклад вмісту токена, привʼязаного до Podʼа:

```yaml
{
  "aud": [  # відповідає запитаним аудиторіям або стандартним аудиторіям API-сервера, якщо явно не запитано
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # відповідає першому значенню, переданому прапорцю --service-account-issuer
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a",
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {
      "name": "127.0.0.1",
      "uid": "58456cb0-dd00-45ed-b797-5578fdceaced"
    },
    "pod": {
      "name": "coredns-69cbfb9798-jv9gn",
      "uid": "778a530c-b3f4-47c0-9cd5-ab018fb64f33"
    },
    "serviceaccount": {
      "name": "coredns",
      "uid": "a087d5a0-e1dd-43ec-93ac-f13d89cd13af"
    },
    "warnafter": 1700081020
  },
  "nbf": 1700077413,
  "sub": "system:serviceaccount:kube-system:coredns"
}
```

### Запуск Podʼа з використанням проєкції токена службового облікового запису {#launch-a-pod-using-service-account-token-projection}

Щоб надати Podʼу токен з аудиторією `vault` та терміном дії дві години, ви можете визначити маніфест Podʼа, схожий на цей:

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

Створіть Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

kubelet: запитуватиме й зберігатиме токен від імені Podʼа; робитиме токен доступним для Podʼа за налаштовуваним шляхом до файлу; оновлюватиме токен, коли наближатиметься закінчення строку його дії. kubelet заздалегідь запитує ротацію токена, якщо він старший за 80% свого загального часу життя (TTL) або якщо токен старший за 24 години.

Застосунок відповідає за повторне завантаження токена під час його ротації. Часто застосунку достатньо завантажувати токен за розкладом (наприклад, раз на 5 хвилин), не відстежуючи фактичного часу закінчення строку дії.

### Виявлення емітента службового облікового запису {#service-account-issuer-discovery}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Якщо ви ввімкнули [проєкцію токенів](#serviceaccount-token-volume-projection) для ServiceAccount у вашому кластері, то можете також скористатися можливістю виявлення. Kubernetes надає клієнтам спосіб федерації як _постачальника ідентичності_ (identity provider), щоб одна або кілька зовнішніх систем могли діяти як _залежна сторона_ (relying party).

{{< note >}}
URL емітента має відповідати [специфікації виявлення OIDC](https://openid.net/specs/openid-connect-discovery-1_0.html). На практиці це означає, що він має використовувати схему `https` і обслуговувати конфігурацію постачальника OpenID за адресою `{service-account-issuer}/.well-known/openid-configuration`.

Якщо URL не відповідає, точки доступу виявлення емітента ServiceAccount не зареєстровані або недоступні.
{{< /note >}}

Коли це ввімкнено, API-сервер Kubernetes публікує документ конфігурації постачальника OpenID через HTTP. Документ конфігурації публікується за адресою `/.well-known/openid-configuration`. Конфігурацію постачальника OpenID іноді називають _документом виявлення_. API-сервер Kubernetes також публікує повʼязаний набір вебключів JSON (JWKS), теж через HTTP, за адресою `/openid/v1/jwks`.

{{< note >}}
Відповіді, що обслуговуються за адресами `/.well-known/openid-configuration` і `/openid/v1/jwks`, розроблено сумісними з OIDC, але вони не строго відповідають OIDC. Ці документи містять лише параметри, потрібні для перевірки токенів службових облікових записів Kubernetes.
{{< /note >}}

Кластери, що використовують {{< glossary_tooltip text="RBAC" term_id="rbac">}}, містять стандартну ClusterRole з назвою `system:service-account-issuer-discovery`. Стандартний ClusterRoleBinding призначає цю роль групі `system:serviceaccounts`, до якої неявно належать усі ServiceAccount. Це дає змогу Podʼам, що працюють у кластері, отримувати доступ до документа виявлення службових облікових записів через змонтований токен службового облікового запису. Адміністратори також можуть привʼязати цю роль до `system:authenticated` або `system:unauthenticated` залежно від своїх вимог до безпеки та від того, з якими зовнішніми системами вони мають намір здійснювати федерацію.

Відповідь JWKS містить публічні ключі, які може використовувати залежна сторона для перевірки токенів службових облікових записів Kubernetes. Залежні сторони спочатку запитують конфігурацію постачальника OpenID, а потім використовують поле `jwks_uri` у відповіді, щоб знайти JWKS.

У багатьох випадках API-сервери Kubernetes недоступні з публічного інтернету, але публічні точки доступу, що обслуговують кешовані відповіді API-сервера, можуть надавати користувачі або постачальники послуг. У таких випадках можна перевизначити `jwks_uri` у конфігурації постачальника OpenID, щоб він вказував на публічну точку доступу, а не на адресу API-сервера, передавши API-серверу прапорець `--service-account-jwks-uri`. Як і URL емітента, URI JWKS має використовувати схему `https`.

## {{% heading "whatsnext" %}} {#what-s-next}

Дивіться також:

- Прочитайте [Посібник адміністратора кластера щодо службових облікових записів](/docs/reference/access-authn-authz/service-accounts-admin/)
- Дізнайтеся про [Авторизацію в Kubernetes](/docs/reference/access-authn-authz/authorization/)
- Дізнайтеся про [Secret](/docs/concepts/configuration/secret/)
  - або дізнайтеся, як [безпечно розповсюджувати облікові дані за допомогою Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/)
  - але памʼятайте, що використання Secret для автентифікації як ServiceAccount застаріло. Рекомендована альтернатива — [проєкція токенів ServiceAccount у томи](#serviceaccount-token-volume-projection).
- Дізнайтеся про [проєкційні томи](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
- Щоб дізнатися передумови виявлення OIDC, прочитайте пропозицію щодо покращення Kubernetes [ServiceAccount signing key retrieval](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
- Прочитайте [Специфікацію виявлення OIDC](https://openid.net/specs/openid-connect-discovery-1_0.html)
