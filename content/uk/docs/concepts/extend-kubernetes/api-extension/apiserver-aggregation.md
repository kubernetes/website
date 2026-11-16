---
title: Шар агрегації API Kubernetes
content_type: concept
weight: 20
---

<!-- overview -->

Шар агрегації дозволяє розширювати Kubernetes додатковими API, понад те, що пропонують основні API Kubernetes. Додатковими API можуть бути як готові рішення, такі як [сервер метрик](https://github.com/kubernetes-sigs/metrics-server), так і API, які ви розробляєте самостійно.

Шар агрегації відрізняється від [Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/), які є способом зробити так, щоб {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} розпізнавав нові види обʼєктів.

<!-- body -->

## Шар агрегації {#aggregation-layer}

Шар агрегації працює в одному процесі з kube-apiserver. Поки ресурс розширення не зареєстровано, шар агрегації нічого не робить. Щоб зареєструвати API, ви додаєте обʼєкт _APIService_, який «заявляє права» на шлях URL в API Kubernetes. Після цього шар агрегації проксіюватиме все, що надсилається на цей шлях API (наприклад, `/apis/myextension.mycompany.io/v1/…`), до зареєстрованого APIService.

Найпоширеніший спосіб реалізації APIService — запуск *API-сервера розширення* в Podʼах, які працюють у вашому кластері. Якщо ви використовуєте API-сервер розширення для керування ресурсами у своєму кластері, API-сервер розширення (також пишеться як "extension-apiserver") зазвичай працює в парі з одним або кількома {{< glossary_tooltip text="контролерами" term_id="controller" >}}. Бібліотека apiserver-builder надає кістяк як для API-серверів розширення, так і для відповідних контролерів.

### Затримки відповіді {#response-latency}

API-сервери розширення повинні мати мережевий звʼязок із малою затримкою до kube-apiserver і від нього. Запити виявлення мають проходити шлях туди й назад від kube-apiserver за пʼять секунд або менше.

Якщо ваш API-сервер розширення не може відповідати цій вимозі щодо затримки, розгляньте зміни, які дозволять їй відповідати.

## {{% heading "whatsnext" %}} {#whats-next}

* Щоб агрегатор запрацював у вашому середовищі, [налаштуйте шар агрегації](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).
* Потім [налаштуйте API-сервер розширення](/docs/tasks/extend-kubernetes/setup-extension-api-server/) для роботи із шаром агрегації.
* Прочитайте про [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) у довідці API.
* Дізнайтеся про [концепції декларативної валідації](/docs/reference/using-api/declarative-validation/), внутрішній механізм визначення правил валідації, який у майбутньому допоможе підтримувати валідацію під час розробки API-серверів розширення.

Або дізнайтеся, як розширити API Kubernetes за допомогою [Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
