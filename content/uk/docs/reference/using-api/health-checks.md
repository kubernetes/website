---
title: Точки доступу для моніторингу стану API Kubernetes
content_type: concept
weight: 50
---

<!-- overview -->

{{< glossary_tooltip term_id="kube-apiserver" text="API сервер" >}} Kubernetes надає точки доступу API для індикації поточного стану API сервера. Ця сторінка описує ці точки доступу API та пояснює, як ви можете їх використовувати.

<!-- body -->

## Точки доступу API для моніторингу стану {#api-endpoints-for-health}

API сервер Kubernetes надає 3 точки доступу API (`healthz`, `livez` і `readyz`) для індикації поточного стану API сервера. Точка доступу `healthz` є застарілою (з Kubernetes v1.16), і ви повинні використовувати більш конкретні точки доступу `livez` та `readyz`. Точку доступу `livez` можна використовувати з [прапорцем](/docs/reference/command-line-tools-reference/kube-apiserver) `--livez-grace-period`, щоб вказати тривалість запуску. Для належного завершення роботи ви можете вказати [прапорець](/docs/reference/command-line-tools-reference/kube-apiserver) `--shutdown-delay-duration` з точкою доступу `/readyz`. Машини, що перевіряють `healthz`/`livez`/`readyz` API сервера, повинні покладатися на HTTP-код статусу. Код статусу `200` вказує, що API сервер є `healthy`/`live`/`ready`, залежно від викликаної точки доступу.

Ці точки доступу відповідають принципу роботи [HTTP-проб](/docs/concepts/configuration/liveness-readiness-startup-probes/) Kubernetes:

* **livez**: використовуйте цей параметр, щоб визначити, чи потрібно перезапустити API-сервер. Якщо `/livez` повертає код статусу помилки (наприклад, 500), API-сервер, ймовірно, перебуває в стані, який неможливо відновити, наприклад, у стані блокування, і потребує перезапуску.
* **readyz**: використовуйте це, щоб визначити, чи готовий API-сервер приймати трафік. Якщо `/readyz` повертає код статусу помилки, це означає, що сервер все ще ініціалізується або тимчасово не може обслуговувати запити (наприклад, чекає на доступність etcd), і трафік слід перенаправити від нього.

Більш докладні опції, показані нижче, призначені для використання людьми-операторами для налагодження їх кластера або розуміння стану API сервера.

Наступні приклади покажуть, як ви можете взаємодіяти з точками доступу моніторингу стану API.

Для всіх точок доступу ви можете використовувати параметр `verbose`, щоб вивести перевірки та їхній стан. Це може бути корисно для оператора-людини для налагодження поточного стану API сервера, це не призначено для використання машинами:

```shell
curl -k https://localhost:6443/livez?verbose
```

або з віддаленого хосту з автентифікацією:

```shell
kubectl get --raw='/readyz?verbose'
```

Вивід буде виглядати наступним чином:

```none
[+]ping ok
[+]log ok
[+]etcd ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
healthz check passed
```

API сервер Kubernetes також підтримує виключення конкретних перевірок. Параметри запиту також можна комбінувати, як у цьому прикладі:

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

Вивід показує, що перевірка `etcd` виключено:

```none
[+]ping ok
[+]log ok
[+]etcd excluded: ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
[+]shutdown ok
healthz check passed
```

## Індивідуальні перевірки стану {#individual-health-checks}

{{< feature-state state="alpha" >}}

Кожна індивідуальна перевірка стану надає HTTP точку доступу і може бути перевірена індивідуально. Схема для індивідуальних перевірок стану — `/livez/<healthcheck-name>` або `/readyz/<healthcheck-name>`, де `livez` і `readyz` можуть бути використані для індикації, чи ви хочете перевірити liveness або readiness API сервера відповідно. Шлях `<healthcheck-name>` можна знайти, використовуючи прапорець `verbose` вище та шлях між `[+]` та `ok`. Ці індивідуальні перевірки стану не повинні використовуватися машинами, але можуть бути корисні для оператора-людини для налагодження системи:

```shell
curl -k https://localhost:6443/livez/etcd
```
