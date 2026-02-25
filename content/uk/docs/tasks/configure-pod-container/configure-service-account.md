---
title: Налаштування службових облікових записів для Podʼів
content_type: task
weight: 120
---

Kubernetes пропонує два відмінні способи автентифікації для клієнтів, які працюють у межах вашого кластера або мають взаємозвʼязок з {{< glossary_tooltip text="панеллю управління" term_id="control-plane" >}} вашого кластера для автентифікації в {{< glossary_tooltip text="API-сервері" term_id="kube-apiserver" >}}.

_Службовий обліковий запис_ надає ідентичність процесам, які працюють у Podʼі, і відповідає обʼєкту ServiceAccount. Коли ви автентифікуєтеся в API-сервері, ви ідентифікуєте себе як певного _користувача_. Kubernetes визнає поняття користувача, але сам Kubernetes **не має** API User.

Це завдання стосується Службових облікових записів, які існують в API Kubernetes. Керівництво показує вам деякі способи налаштування Службових облікових записів для Podʼів.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Використання стандартного службового облікового запису для доступу до API-сервера {#use-the-default-service-account-to-access-the-api-server}

Коли Podʼи звертаються до API-сервера, вони автентифікуються як певний Службовий обліковий запис (наприклад, `default`). В кожному {{< glossary_tooltip text="просторі імен" term_id="namespace" >}} завжди є принаймні один Службовий обліковий запис.

У кожному просторі імен Kubernetes завжди міститься принаймні один Службовий обліковий запис: стандартний службовий обліковий запис для цього простору імен, з назвою `default`. Якщо ви не вказуєте Службовий обліковий запис при створенні Podʼа, Kubernetes автоматично призначає Службовий обліковий запис з назвою `default` у цьому просторі імен.

Ви можете отримати деталі для Podʼа, який ви створили. Наприклад:

```shell
kubectl get pods/<імʼя_пода> -o yaml
```

У виводі ви побачите поле `spec.serviceAccountName`. Kubernetes автоматично встановлює це значення, якщо ви не вказали його при створенні Podʼа.

Застосунок, який працює усередині Podʼа, може отримати доступ до API Kubernetes, використовуючи автоматично змонтовані облікові дані службового облікового запису. Для отримання додаткової інформації див. [доступ до кластера](/docs/tasks/access-application-cluster/access-cluster/).

Коли Pod автентифікується як Службовий обліковий запис, його рівень доступу залежить від [втулка авторизації та політики](/docs/reference/access-authn-authz/authorization/#authorization-modules), які використовуються.

Облікові дані API автоматично відкликаються, коли Pod видаляється, навіть якщо є завершувачі. Зокрема, облікові дані API відкликаються через 60 секунд після встановленого на Pod значення `.metadata.deletionTimestamp` (час видалення зазвичай дорівнює часу, коли запит на **видалення** був прийнятий плюс період належного завершення роботи Pod).

### Відмова від автоматичного монтування облікових даних API {#opt-out-of-api-credentials-automounting}

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

У кожному просторі імен є принаймні один ServiceAccount: типовий ServiceAccount, який називається `default`. Ви можете переглянути всі ресурси ServiceAccount у вашому [поточному просторі імен](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference) за допомогою:

```shell
kubectl get serviceaccounts
```

Вихідні дані схожі на наступні:

```none
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

Вихідні дані схожі на наступні:

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

Ви можете використовувати розширення дозволів для [встановлення дозволів на службові облікові записи](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Щоб використовувати не-стандартний обліковий запис, встановіть поле `spec.serviceAccountName` Podʼа на імʼя ServiceAccount, який ви хочете використовувати.

Ви можете встановити лише поле `serviceAccountName` при створенні Podʼа або в шаблоні для нового Podʼа. Ви не можете оновлювати поле `.spec.serviceAccountName` Podʼа, який вже існує.

{{< note >}}
Поле `.spec.serviceAccount` є застарілою альтернативою для `.spec.serviceAccountName`. Якщо ви хочете видалити поля з ресурсу робочого навантаження, встановіть обидва поля явно пустими у [шаблоні Pod](/docs/concepts/workloads/pods#pod-templates).
{{< /note >}}

### Очищення {#cleanup-use-multiple-service-accounts}

Якщо ви спробували створити ServiceAccount `build-robot` з прикладу вище, ви можете видалити його виконавши:

```shell
kubectl delete serviceaccount/build-robot
```

## Вручну створіть API-токен для ServiceAccount {#manually-create-an-api-token-for-a-serviceaccount}

Припустимо, у вас вже є службовий обліковий запис з назвою "build-robot", як зазначено вище.

Ви можете отримати тимчасовий API-токен для цього ServiceAccount за допомогою `kubectl`:

```shell
kubectl create token build-robot
```

Вихідні дані з цієї команди — це токен, який ви можете використовувати для автентифікації цього ServiceAccount. Ви можете запросити певний час дії токена, використовуючи аргумент командного рядка `--duration` для `kubectl create token` (фактичний час дії виданого токену може бути коротшим або навіть довшим).

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

Використовуючи `kubectl` v1.31 або новішу версію, можна створити токен службового облікового запису, який буде безпосередньо привʼязано до вузла:

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

Токен буде чинний до закінчення його терміну дії або до видалення відповідного вузла чи службового облікового запису.

{{< note >}}
У версіях Kubernetes до v1.22 автоматично створювалися довгострокові облікові дані для доступу до API Kubernetes. Цей старий механізм базувався на створенні Secret токенів, які потім можна було монтувати в запущені контейнери. У більш пізніх версіях, включаючи Kubernetes v{{< skew currentVersion >}}, облікові дані API отримуються безпосередньо за допомогою [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API, і вони монтуються в контейнери за допомогою [projected тому](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume). Токени, отримані за допомогою цього методу, мають обмежений термін дії та автоматично анулюються, коли контейнер, у який вони монтувалися, видаляється.

Ви все ще можете вручну створити Secret токен службового облікового запису; наприклад, якщо вам потрібен токен, який ніколи не закінчується. Однак рекомендується використовувати [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) для отримання токена для доступу до API.
{{< /note >}}

### Вручну створіть довговічний API-токен для ServiceAccount {#manually-create-a-long-lived-api-token-for-a-serviceaccount}

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

Через анотацію, яку ви встановили, панель управління автоматично генерує токен для цього службового облікового запису і зберігає їх у відповідному Secret. Крім того, панель управління також очищає токени для видалених службових облікових записів.

```shell
kubectl describe secrets/build-robot-secret
```

Вивід схожий на такий:

```none
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 байтів
namespace:      7 байтів
token:          ...
```

{{< note >}}
Зміст `token` тут пропущений.

При здійсненні перегляду вмісту Secret `kubernetes.io/service-account-token` уважно відносьтеся, щоб не відображати його будь-де, де його може побачити сторонній спостерігач.
{{< /note >}}

При видаленні ServiceAccount, який має відповідний Secret, панель управління Kubernetes автоматично очищає довговічний токен з цього Secret.

{{< note >}}
Якщо ви переглянете ServiceAccount використовуючи:

` kubectl get serviceaccount build-robot -o yaml`

Ви не побачите Secret `build-robot-secret` у полях API-обʼєктів службового облікового запису [`.secrets`](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/), оскільки це поле заповнюється лише автоматично згенерованими Secret.
{{< /note >}}

## Додайте ImagePullSecrets до ServiceAccount {#add-imagepullsecrets-to-a-serviceaccount}

Спочатку [створіть imagePullSecret](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod). Потім перевірте, чи він був створений. Наприклад:

- Створіть imagePullSecret, як описано в [Вказування ImagePullSecrets в контейнері](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=<імʼя реєстру> \
          --docker-username=ІМ'Я_КОРИСТУВАЧА --docker-password=ПАРОЛЬ_ДЛЯ_DOCKER \
          --docker-email=ЕЛЕКТРОННА_ПОШТА_ДЛЯ_DOCKER
  ```

- Перевірте, чи він був створений.

  ```shell
  kubectl get secrets myregistrykey
  ```

  Вивід схожий на такий:

  ```none
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1д
  ```

### Додайте imagePullSecret до ServiceAccount {#add-image-pull-secret-to-service-account}

Далі, змініть типовий службовий обліковий запис для цього простору імен так, щоб він використовував цей Secret як imagePullSecret.

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

Ви можете досягти того ж самого результату, відредагувавши обʼєкт вручну:

```shell
kubectl edit serviceaccount/default
```

Вивід файлу `sa.yaml` буде схожий на такий:

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

### Перевірте, що imagePullSecrets встановлені для нових Podʼів {#verify-that-imagepullsecrets-are-set-for-new-pods}

Тепер, коли створюється новий Pod у поточному просторі імен і використовується типовий ServiceAccount, у новому Podʼі автоматично встановлюється поле `spec.imagePullSecrets`:

```shell
kubectl run nginx --image=<імʼя реєстру>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

Вивід:

```none
myregistrykey
```

## Проєцювання токенів ServiceAccount {#serviceaccount-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
Для включення та використання проєкції запиту токена вам необхідно вказати кожен з наступних аргументів командного рядка для `kube-apiserver`:

`--service-account-issuer`
: визначає ідентифікатор емітента токена службового облікового запису. Ви можете вказати аргумент `--service-account-issuer` аргумент кілька разів, це може бути корисно, щоб увімкнути зміну емітента без переривання роботи. Коли цей прапорець вказано кілька разів, перший використовується для генерації токенів та всі використовуються для визначення прийнятних емітентів. Вам потрібно використовувати Kubernetes v1.22 або пізніше, щоб мати можливість вказати `--service-account-issuer` кілька разів.

`--service-account-key-file`
: вказує шлях до файлу, який містить PEM-кодований X.509 приватний або публічний ключі (RSA або ECDSA), які використовуються для перевірки токенів ServiceAccount. Вказаний файл може містити кілька ключів, а прапорець може бути вказаний кілька разів з різними файлами. Якщо вказано кілька разів, токени, підписані будь-яким із вказаних ключів, вважаються сервером Kubernetes API дійсними.

`--service-account-signing-key-file`
: вказує шлях до файлу, який містить поточний приватний ключ емітента токенів службового облікового запису. Емітент підписує видані ID токени з цим приватним ключем.

`--api-audiences` (може бути опущено)
: визначає аудиторії для токенів ServiceAccount. Автентифікатор токенів службових облікових записів перевіряє, що токени, використані в API, привʼязані принаймні до однієї з цих аудиторій. Якщо `api-audiences` вказано кілька разів, токени для будь-якої з вказаних аудиторій вважаються сервером Kubernetes API дійсними. Якщо ви вказали аргумент командного рядка `--service-account-issuer`, але не встановили `--api-audiences`, панель управління типово має одноелементний список аудиторій, що містить лише URL емітента.

{{< /note >}}

Kubelet також може проєцювати токен ServiceAccount в Pod. Ви можете вказати бажані властивості токена, такі як аудиторія та тривалість дії. Ці властивості _не_ конфігуруються для типового токена ServiceAccount. Токен також стане недійсним щодо API, коли будь-який з Podʼів або ServiceAccount буде видалено.

Ви можете налаштувати цю поведінку для `spec` Podʼа за допомогою типу [projected тому](/docs/concepts/storage/volumes/#projected), що називається `ServiceAccountToken`.

Токен з цього projected тому — {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}} (JWT). JSON-вміст цього токена слідує чітко визначеній схемі — приклад вмісту для токена, повʼязаного з Pod:

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

### Запуск Podʼа з використанням проєцювання токену службового облікового запису {#lunch-a-pod-using-service-account-token-projection}

Щоб надати Podʼу токен з аудиторією `vault` та терміном дії дві години, ви можете визначити маніфест Podʼа, схожий на цей:

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

Створіть Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

Kubelet буде: запитувати та зберігати токен від імені Podʼа; робити токен доступним для Podʼа за налаштованим шляхом до файлу; і оновлювати токен поблизу його закінчення. Kubelet активно запитує ротацію для токена, якщо він старший, ніж 80% від загального часу життя (TTL), або якщо токен старший, ніж 24 години.

Застосунок відповідає за перезавантаження токена при його ротації. Зазвичай для застосунку достатньо завантажувати токен за розкладом (наприклад: один раз кожні 5 хвилин), без відстеження фактичного часу закінчення.

### Виявлення емітента службового облікового запису {#service-account-issuer-discovery}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Якщо ви увімкнули [проєцювання токенів](#serviceaccount-token-volume-projection) для ServiceAccounts у вашому кластері, то ви також можете скористатися функцією виявлення. Kubernetes надає спосіб клієнтам обʼєднуватись як _постачальник ідентифікаційних даних_, щоб одна або кілька зовнішніх систем могли діяти як _сторона, що їм довіряє_.

{{< note >}}
URL емітента повинен відповідати [Специфікації виявлення OIDC](https://openid.net/specs/openid-connect-discovery-1_0.html). На практиці це означає, що він повинен використовувати схему `https`, і має обслуговувати конфігурацію постачальника OpenID за адресою `{емітент-облікового-запису}/.well-known/openid-configuration`.

Якщо URL не відповідає, точки доступу виявлення емітента ServiceAccount не зареєстровані або недоступні.
{{< /note >}}

Якщо увімкнено, Kubernetes API-сервер публікує документ конфігурації постачальника OpenID через HTTP. Документ конфігурації публікується за адресою `/.well-known/openid-configuration`. Документ конфігурації OpenID постачальника іноді називається _документом виявлення_. Kubernetes API-сервер також публікує повʼязаний набір ключів JSON Web (JWKS), також через HTTP, за адресою `/openid/v1/jwks`.

{{< note >}}
Відповіді, що обслуговуються за адресами `/.well-known/openid-configuration` та `/openid/v1/jwks`, призначені для сумісності з OIDC, але не є строго сумісними з OIDC. Ці документи містять лише параметри, необхідні для виконання перевірки токенів службових облікових записів Kubernetes.
{{< /note >}}

Кластери, які використовують {{< glossary_tooltip text="RBAC" term_id="rbac">}}, включають типову роль кластера з назвою `system:service-account-issuer-discovery`. Типовий ClusterRoleBinding надає цю роль групі `system:serviceaccounts`, до якої неявно належать всі ServiceAccounts. Це дозволяє Podʼам, які працюють у кластері, отримувати доступ до документа виявлення службового облікового запису через їх змонтований токен службового облікового запису. Адміністратори також можуть вибрати привʼязку ролі до `system:authenticated` або `system:unauthenticated` залежно від їх вимог до безпеки та зовнішніх систем, з якими вони мають намір обʼєднуватись.

Відповідь JWKS містить публічні ключі, які може використовувати залежна сторона для перевірки токенів службових облікових записів Kubernetes. Залежні сторони спочатку запитують конфігурацію постачальника OpenID, а потім використовують поле `jwks_uri` у відповіді, щоб знайти JWKS.

У багатьох випадках API-сервери Kubernetes не доступні через глобальну мережу, але публічні точки доступу, які обслуговують кешовані відповіді від API-сервера, можуть бути доступні для користувачів або постачальників послуг. У таких випадках можливо перевизначити `jwks_uri` в конфігурації постачальника OpenID, щоб вона вказувала на глобальну точку доступу, а не на адресу API-сервера, передаючи прапорець `--service-account-jwks-uri` до API-сервера. Як і URL емітента, URI JWKS повинен використовувати схему `https`.

## {{% heading "whatsnext" %}}

Дивіться також:

- Прочитайте [Посібник адміністратора кластера щодо службових облікових записів](/docs/reference/access-authn-authz/service-accounts-admin/)
- Дізнайтеся про [Авторизацію в Kubernetes](/docs/reference/access-authn-authz/authorization/)
- Дізнайтеся про [Secret](/docs/concepts/configuration/secret/)
  - або, як [розподіляти облікові дані безпечно за допомогою Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/)
  - але також майте на увазі, що використання Secret для автентифікації як службового облікового запису є застарілим. Рекомендований альтернативний метод — [проєціювання токенів службового облікового запису](#serviceaccount-token-volume-projection).
- Дізнайтеся про [projected томи](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
- Для ознайомлення з OIDC discovery, прочитайте [Попередній перегляд пропозиції щодо підпису токена службового облікового запису](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery) щодо покращення Kubernetes
- Прочитайте [Специфікацію виявлення OIDC](https://openid.net/specs/openid-connect-discovery-1_0.html)
