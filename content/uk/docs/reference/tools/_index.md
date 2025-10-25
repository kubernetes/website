---
title: Інші інструменти
content_type: concept
weight: 150
no_list: true
---

<!-- overview -->

Kubernetes містить кілька інструментів, які допоможуть вам працювати з системою Kubernetes.

<!-- body -->

## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools) — це інтерфейс командного рядка для перегляду та відлагодження оточення виконання контейнерів, сумісних з {{<glossary_tooltip term_id="cri" text="CRI">}}.

## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), вебінтерфейс Kubernetes, дозволяє розгортати контейнерні застосунки в кластері Kubernetes, розвʼязувати проблеми з ними та управляти кластером та його ресурсами.

## Helm

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) — це інструмент для управління пакунками наперед сконфігурованих ресурсів Kubernetes. Ці пакунки відомі як _Helm charts_.

Використовуйте Helm для:

* Пошуку та використання популярного програмного забезпечення, упакованого як Helm charts для Kubernetes
* Поширення ваших застосунків у вигляді Helm charts
* Створення відтворюваних збірок вашого застосунку Kubernetes
* Управління файлами маніфестів Kubernetes
* Управління випусками пакунків Helm

## Kompose

[`Kompose`](https://github.com/kubernetes/kompose) — це інструмент для допомоги користувачам Docker Compose в переході до Kubernetes.

Використовуйте Kompose для:

* Перетворення файлу Docker Compose в обʼєкти Kubernetes
* Переходу від локальної розробки Docker до управління вашим застосунком через Kubernetes
* Конвертації файлів Docker Compose `yaml` версій v1 або v2 або [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

## Kui

[`Kui`](https://github.com/kubernetes-sigs/kui) — це графічний інструмент, який обробляє ваші звичайні запити командного рядка `kubectl` та показує вивід в графічному вигляді.

Kui обробляє звичайні запити командного рядка `kubectl` та показує вивід в графічному вигляді. Замість ASCII-таблиць, Kui надає графічний рендеринг з таблицями, які можна сортувати.

Kui дозволяє вам:

* Натискати на довгі, автоматично генеровані назви ресурсів, замість копіювання та вставляння
* Вводити команди `kubectl` і бачити їх виконання, іноді навіть швидше, ніж в `kubectl`
* Запитувати {{< glossary_tooltip text="Job" term_id="job">}} та бачити його виконання у вигляді діаграми водоспаду
* Переходити за ресурсами в вашому кластері за допомогою графічного інтерфейсу користувача

## Minikube

[`minikube`](https://minikube.sigs.k8s.io/docs/) — це інструмент, який запускає локальний однокомпонентний кластер Kubernetes безпосередньо на вашому компʼютері для розробки та тестування.
