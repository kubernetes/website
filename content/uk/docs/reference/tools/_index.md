---
title: Інші інструменти
content_type: concept
weight: 150
no_list: true
---

<!-- overview -->

Kubernetes містить кілька інструментів, які допоможуть вам працювати з системою Kubernetes.

<!-- body -->

## crictl {#crictl}

[`crictl`](https://github.com/kubernetes-sigs/cri-tools) — це інтерфейс командного рядка для перегляду та відлагодження середовищ виконання контейнерів, сумісних з {{<glossary_tooltip term_id="cri" text="CRI">}}.

## Dashboard {#dashboard}

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), вебінтерфейс Kubernetes, дозволяє розгортати контейнерні застосунки в кластері Kubernetes, розвʼязувати проблеми з ними та управляти самим кластером та його ресурсами.

## Headlamp {#headlamp}

[Headlamp](https://headlamp.dev/) — це розширюваний графічний інтерфейс користувача Kubernetes і необовʼязковий компонент кластера Kubernetes. Headlamp є частиною проєкту Kubernetes.

Headlamp пропонує:

* Сучасний, зручний графічний інтерфейс для управління кластером та усунення несправностей
* Підтримку як розгортання в кластері, так і режиму десктопного застосунку
* Розширюваність за допомогою системи втулків
* Контроль на основі RBAC, що адаптується до прав користувача

## Helm {#helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) — це інструмент для управління пакунками наперед сконфігурованих ресурсів Kubernetes. Ці пакунки відомі як _Helm charts_.

Використовуйте Helm для:

* Пошуку та використання популярного програмного забезпечення, упакованого як Helm charts для Kubernetes
* Поширення ваших власних застосунків у вигляді Helm charts для Kubernetes
* Створення відтворюваних збірок ваших застосунків Kubernetes
* Розумного управління файлами маніфестів Kubernetes
* Управління випусками пакунків Helm

## kind {#kind}

[`kind`](https://kind.sigs.k8s.io/) — це інструмент для запуску локальних кластерів Kubernetes, вузлами яких є контейнери Docker. kind в основному призначений для тестування самого Kubernetes, але також може використовуватися для локальної розробки або CI.

## Kompose {#kompose}

[`Kompose`](https://github.com/kubernetes/kompose) — це інструмент для допомоги користувачам Docker Compose в переході до Kubernetes.

Використовуйте Kompose для:

* Перетворення файлу Docker Compose в обʼєкти Kubernetes
* Переходу від локальної розробки Docker до управління вашим застосунком через Kubernetes
* Конвертації файлів Docker Compose `yaml` версій v1 або v2 або [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

## Kui {#kui}

[`Kui`](https://github.com/kubernetes-sigs/kui) — це графічний інструмент, який обробляє ваші звичайні запити командного рядка `kubectl` та показує вивід в графічному вигляді. Замість ASCII-таблиць, Kui надає графічний рендеринг з таблицями, які можна сортувати.

Kui дозволяє вам:

* Безпосередньо натискати на довгі, автоматично генеровані назви ресурсів, замість копіювання та вставляння
* Вводити команди `kubectl` і бачити їх виконання, іноді навіть швидше, ніж у самому `kubectl`
* Запитувати {{< glossary_tooltip text="Job" term_id="job">}} та бачити його виконання у вигляді діаграми водоспаду
* Переходити між ресурсами у вашому кластері за допомогою інтерфейсу з вкладками

## Minikube {#minikube}

[`minikube`](https://minikube.sigs.k8s.io/docs/) — це інструмент, який локально запускає одновузловий кластер Kubernetes на вашій робочій станції для розробки та тестування.
