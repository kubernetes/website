---
title: Автентифікація за допомогою Bootstrap-токенів
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Bootstrap-токени — це простий токен на предʼявника, який призначений для використання під час створення нових кластерів або приєднання нових вузлів до наявного кластера. Він був створений для підтримки [kubeadm](/docs/reference/setup-tools/kubeadm/), але може використовуватися в інших контекстах для користувачів, які бажають створювати кластери без `kubeadm`. Також він призначений для роботи, через політику RBAC, з [kubelet TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).

<!-- body -->

## Огляд Bootstrap-токенів {#bootstrap-tokens-overview}

Bootstrap-токени визначені як певний тип secretʼів (`bootstrap.kubernetes.io/token`), що знаходяться в просторі імен `kube-system`. Ці secret читаються Bootstrap Authenticator з API Server. Протерміновані токени видаляються контролером TokenCleaner у Controller Manager. Токени також використовуються для створення підпису для конкретного ConfigMap, який використовується у процесі "виявлення" через контролер BootstrapSigner.

## Формат токена {#token-format}

Bootstrap-токени мають форму `abcdef.0123456789abcdef`. Більш формально, вони повинні відповідати регулярному виразу `[a-z0-9]{6}\.[a-z0-9]{16}`.

Перша частина токена — це "ID токена" і вважається публічною інформацією. Вона використовується, коли потрібно посилатися на токен без розкриття секретної частини, яка використовується для автентифікації. Друга частина — це "Секрет токена" і нею треба ділитися тільки з довіреними сторонами.

## Увімкнення автентифікації за допомогою Bootstrap-токенів {#enabling-bootstrap-token-authentication}

Автентифікатор Bootstrap Token можна увімкнути за допомогою наступного прапорця на API-сервері:

```none
--enable-bootstrap-token-auth
```

Після увімкнення, токени для завантаження можуть використовуватися як облікові дані токена на предʼявника для автентифікації запитів до API-сервера.

```http
Authorization: Bearer 07401b.f395accd246ae52d
```

Токени автентифікуються як імʼя користувача `system:bootstrap:<token id>` і є членами групи `system:bootstrappers`. Додаткові групи можуть бути вказані в секреті токена.

Протерміновані токени можуть бути автоматично видалені шляхом увімкнення контролера `tokencleaner` у Controller Manager.

```none
--controllers=*,tokencleaner
```

## Формат Secretʼу Bootstrap-токена {#bootstrap-token-secret-format}

Кожен дійсний токен підтримується секретом у просторі імен `kube-system`. Повний документ проєктування можна знайти [тут](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).

Ось як виглядає цей Secret.

```yaml
apiVersion: v1
kind: Secret
metadata:
  # Назва МАЄ бути у формі "bootstrap-token-<token id>"
  name: bootstrap-token-07401b
  namespace: kube-system

# Тип МАЄ бути 'bootstrap.kubernetes.io/token'
type: bootstrap.kubernetes.io/token
stringData:
  # Опис, зрозумілий людині. Необовʼязково.
  description: "Стандартний bootstrap-токен, згенерований 'kubeadm init'."

  # ID та секрет токена. Обовʼязково.
  token-id: 07401b
  token-secret: f395accd246ae52d

  # Термін дії. Необовʼязково.
  expiration: 2017-03-10T03:22:11Z

  # Дозволені використання.
  usage-bootstrap-authentication: "true"
  usage-bootstrap-signing: "true"

  # Додаткові групи для автентифікації токена. Мають починатися з "system:bootstrappers:"
  auth-extra-groups: system:bootstrappers:worker,system:bootstrappers:ingress
```

Тип секрету має бути `bootstrap.kubernetes.io/token`, а назва має бути `bootstrap-token-<token id>`. Він також повинен знаходитися в просторі імен `kube-system`.

Члени `usage-bootstrap-*` вказують, для чого цей секрет призначений. Значення має бути встановлено в `true`, щоб увімкнути відповідне використання.

* `usage-bootstrap-authentication` вказує, що токен може використовуватися для автентифікації до API-сервера як токен-носій.
* `usage-bootstrap-signing` вказує, що токен може використовуватися для підпису ConfigMap `cluster-info`, як описано нижче.

Поле `expiration` контролює термін дії токена. Протерміновані токени відхиляються при спробі автентифікації та ігноруються під час підпису ConfigMap. Значення терміну дії кодується як абсолютний UTC-час за стандартом [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339). Увімкніть контролер `tokencleaner`, щоб автоматично видаляти протерміновані токени.

## Управління токенами за допомогою kubeadm {#managing-tokens-with-kubeadm}

Ви можете використовувати інструмент `kubeadm` для управління токенами на запущеному кластері. Деталі дивіться в документації [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

## Підпис ConfigMap {#configmap-signing}

Окрім автентифікації, токени можуть використовуватися для підпису ConfigMap. Це використовується на ранніх етапах процесу завантаження кластера до того, як клієнт довіряє API-серверу. Підписаний ConfigMap може бути автентифікований спільним токеном.

Увімкніть підпис ConfigMap, увімкнувши контролер `bootstrapsigner` у Controller Manager.

```none
--controllers=*,bootstrapsigner
```

ConfigMap, який підписується, це `cluster-info` у просторі імен `kube-public`. Типовий процес полягає в тому, що клієнт читає цей ConfigMap без автентифікації та ігноруючи помилки TLS. Потім він перевіряє коректність ConfigMap, переглядаючи підпис, вбудований у ConfigMap.

ConfigMap може виглядати так:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-info
  namespace: kube-public
data:
  jws-kubeconfig-07401b: eyJhbGciOiJIUzI1NiIsImtpZCI6IjA3NDAxYiJ9..tYEfbo6zDNo40MQE07aZcQX2m3EB2rO3NuXtxVMYm9U
  kubeconfig: |
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: <дуже довгі дані сертифіката>
        server: https://10.138.0.2:6443
      name: ""
    contexts: []
    current-context: ""
    kind: Config
    preferences: {}
    users: []
```

Елемент `kubeconfig` у ConfigMap є конфігураційним файлом, який містить лише інформацію про кластер. Ключовим моментом, що передається, є `certificate-authority-data`. Це може бути розширено в майбутньому.

Підпис є підписом JWS, що використовує "відокремлений" режим. Щоб перевірити підпис, користувач має закодувати вміст `kubeconfig` відповідно до правил JWS (закодовано base64, відкидаючи будь-які кінцеві `=`). Цей закодований вміст потім використовується для формування повного JWS шляхом вставки його між 2 крапками. Ви можете перевірити JWS, використовуючи схему `HS256` (HMAC-SHA256) з повним токеном (наприклад, `07401b.f395accd246ae52d`) як спільний секрет. Користувачі _повинні_ перевірити, що використовується HS256.

{{< warning >}}
Будь-яка сторона з токеном завантаження може створити дійсний підпис для цього токена. Коли використовується підпис ConfigMap, не рекомендується ділитися одним токеном з багатьма клієнтами, оскільки скомпрометований клієнт може потенційно провести атаку "людина посередині" на іншого клієнта, який покладається на підпис для завантаження довіри TLS.
{{< /warning >}}

Додаткову інформацію можна знайти в розділі [докладні відомості про реалізацію kubeadm](/docs/reference/setup-tools/kubeadm/implementation-details/).
