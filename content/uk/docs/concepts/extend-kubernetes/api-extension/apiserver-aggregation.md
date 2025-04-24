---
title: Шар агрегації API Kubernetes
content_type: concept
weight: 20
---

<!-- overview -->

Шар агрегації дозволяє розширювати можливості Kubernetes за допомогою додаткових API, поза тим, що пропонується ядром основних API Kubernetes. Додаткові API можуть бути як готові рішення, такі як [сервер метрик](https://github.com/kubernetes-sigs/metrics-server), так і API, які ви розробляєте самостійно.

Шар агрегації відрізняється від [Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/), які є способом зробити так, щоб {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} визнавав нові види обʼєктів.

<!-- body -->

## Шар агрегації {#aggregation-layer}

Шар агрегації працює в процесі разом з kube-apiserver. До того, як розширений ресурс буде зареєстровано, шар агрегації не виконуватиме жодних дій. Для реєстрації API ви додаєте обʼєкт _APIService_, який "запитує" URL-шлях у Kubernetes API. На цьому етапі шар агрегації буде передавати будь-що, що надійде на цей API-шлях (наприклад, `/apis/myextension.mycompany.io/v1/…`), зареєстрованому _APIService_.

Найпоширеніший спосіб реалізації _APIService_ — це запуск _розширеного API-сервера_ в Podʼах, які працюють у вашому кластері. Якщо ви використовуєте розширений API-сервер для управління ресурсами у своєму кластері, розширений API-сервер (також пишеться як "extension-apiserver") зазвичай сполучається з одним або кількома {{< glossary_tooltip text="контролерами" term_id="controller" >}}. Бібліотека apiserver-builder надає кістяк як для розширених API-серверів, так і для відповідних контролерів.

### Затримки відповіді {#response-latency}

Розширені API-сервери повинні мати малі затримки мережевого звʼязку до та від kube-apiserver. Запити на виявлення повинні долати шлях до та від kube-apiserver до пʼяти секунд або менше.

Якщо ваш розширений API-сервер не може досягти цієї вимоги щодо затримки, розгляньте внесення змін, які дозволять вам відповідати їй.

## {{% heading "whatsnext" %}}

* Щоб отримати робочий агрегатор у вашому середовищі, [налаштуйте шар агрегації](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).
* Потім, [налаштуйте розширений API-сервер](/docs/tasks/extend-kubernetes/setup-extension-api-server/) для роботи з шаром агрегації.
* Прочитайте про [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) у довідці API.
* Дізнайтеся про [Концепції декларативної валідації](/docs/reference/using-api/declarative-validation/), внутрішній механізм визначення правил валідації, який в майбутньому допоможе підтримувати валідацію для розробки серверів API розширень.

Альтернативно: дізнайтеся, як [розширити API Kubernetes, використовуючи визначення власних ресурсів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
