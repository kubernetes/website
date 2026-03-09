---
title: Автентифікація/авторизація kubelet
weight: 110
---

## Огляд {#overview}

HTTP-запити до HTTPS-точки доступу kubelet надають доступ до даних різного рівня чутливості та дозволяють виконувати операції з різними рівнями повноважень на вузлі та в контейнерах.

У цьому документі описано, як автентифікувати та авторизувати доступ до HTTPS-точки доступу kubelet.

## Автентифікація kubelet {#kubelet-authentication}

Стандартно запити до HTTPS-точки доступу kubelet, які не відхилені іншими налаштованими методами автентифікації, розглядаються як анонімні запити та отримують імʼя користувача `system:anonymous` та групу `system:unauthenticated`.

Щоб вимкнути анонімний доступ та надсилати відповіді `401 Unauthorized` на невідомі запити:

* запустіть kubelet з прапорцем `--anonymous-auth=false`

Щоб увімкнути автентифікацію за допомогою клієнтських сертифікатів X509 до HTTPS-точки доступу kubelet:

* запустіть kubelet з прапорцем `--client-ca-file`, надаючи набір кореневих сертифікатів для перевірки клієнтських сертифікатів
* запустіть apiserver з прапорцями `--kubelet-client-certificate` та `--kubelet-client-key`
* див. [документацію з автентифікації apiserver](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) для отримання додаткових відомостей

Щоб увімкнути використання API-токенів на предʼявника (включаючи токени службових облікових записів) для автентифікації до HTTPS-точки доступу kubelet:

* переконайтеся, що група API `authentication.k8s.io/v1` ввімкнена в apiserver
* запустіть kubelet з прапорцями `--authentication-token-webhook` та `--kubeconfig`
* kubelet викликає API `TokenReview` на налаштованому apiserver, щоб визначити інформацію про користувача з токенів на предʼявника

## Авторизація kubelet {#kubelet-authorization}

Будь-який запит, який успішно автентифікується (включаючи анонімний запит), потім авторизується. Стандартний режим авторизації — `AlwaysAllow`, який дозволяє всі запити.

Є багато можливих причин для розподілу доступу до API kubelet:

* ввімкнено анонімну автентифікацію, але потрібно обмежити можливості анонімних користувачів викликати API kubelet
* ввімкнено автентифікацію з використанням токенів на предʼявника, але потрібно обмежити можливості довільних користувачів API (наприклад, службові облікові записи) викликати API kubelet
* ввімкнено автентифікацію за допомогою клієнтських сертифікатів, але дозволено використовувати API kubelet тільки деяким сертифікатам клієнтів, які підписані налаштованим кореневим сертифікатом

Щоб розділити доступ до API kubelet, делегуйте авторизацію apiserver:

* переконайтеся, що група API `authorization.k8s.io/v1` ввімкнена в apiserver
* запустіть kubelet з прапорцями `--authorization-mode=Webhook` та `--kubeconfig`
* kubelet викликає API `SubjectAccessReview` на налаштованому apiserver, щоб визначити, чи авторизований кожний запит

Kubelet авторизує запити до API, використовуючи той самий підхід до [атрибутів запиту](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes), що й apiserver.

Дієслово визначається з HTTP-дії вхідного запиту:

HTTP-дія  | Дієслово запиту
----------|----------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

Ресурс та субресурс визначаються з шляху вхідного запиту:

Kubelet API    | Ресурс  | Субресурс
---------------|---------|------------
/stats/\*      | nodes   | stats
/metrics/\*    | nodes   | metrics
/logs/\*       | nodes   | log
/spec/\*       | nodes   | spec
/checkpoint/\* | nodes   | checkpoint
*всі інші*     | nodes   | proxy

<a name="get-nodes-proxy-warning"></a>
{{< warning >}}
Дозвіл `nodes/proxy` надає доступ до всіх інших API kubelet. Сюди входять API, які можна використовувати для виконання команд у будь-якому контейнері, що працює на вузлі.

Деякі з цих точок доступу підтримують протоколи Websocket через HTTP-запити `GET`, які авторизуються за допомогою дієслова **get**. Це означає, що дозвіл **get** на `nodes/proxy` не є дозволом тільки для читання і дозволяє виконувати команди в будь-якому контейнері, що працює на вузлі.
{{< /warning >}}

Атрибути простору імен та групи API завжди є порожніми рядками, а імʼя ресурсу завжди є імʼям обʼєкта `Node` kubelet.

При використанні цього режиму переконайтеся, що користувач, визначений прапорцями `--kubelet-client-certificate` та `--kubelet-client-key`, переданими до apiserver, має дозвіл наступних атрибутів:

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

### Детальна авторизація {#fine-grained-authorization}

{{< feature-state feature_gate_name="KubeletFineGrainedAuthz" >}}

Коли увімкнено функціональну можливість `KubeletFineGrainedAuthz`, kubelet виконує детальну перевірку перед поверненням до підресурсу `proxy` для кінцевих точок `/pods`, `/runningPods`, `/configz` та `/healthz`. Ресурс і підресурс визначаються за шляхом вхідного запиту:

Kubelet API   | ресурс   | підресурс
--------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/pods         | nodes    | pods, proxy
/runningPods/ | nodes    | pods, proxy
/healthz      | nodes    | healthz, proxy
/configz      | nodes    | configz, proxy
*all others*  | nodes    | proxy

Коли функціональну можливість `KubeletFineGrainedAuthz` увімкнено, переконайтеся, що користувач, ідентифікований прапорцями `--kubelet-client-certificate` та `--kubelet-client-key`, переданими серверу API, є авторизованим для наступних атрибутів:

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=metrics
* verb=\*, resource=nodes, subresource=configz
* verb=\*, resource=nodes, subresource=healthz
* verb=\*, resource=nodes, subresource=pods

Якщо використовується [RBAC авторизація](/docs/reference/access-authn-authz/rbac/), увімкнення цієї функціональної можливості також гарантує, що вбудована `system:kubelet-api-admin` ClusterRole буде оновлена з дозволами на доступ до всіх вищезгаданих підресурсів.
