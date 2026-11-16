---
layout: blog
title: "Kubernetes v1.35: Job Managed By переходить у загальну доступність"
date: 2025-12-18T10:30:00-08:00
slug: kubernetes-v1-35-job-managedby-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research),
  [Michał Woźniak](https://github.com/mimowo) (Google)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

У Kubernetes v1.35 можливість вказати зовнішній контролер Job (через `.spec.managedBy`) переходить у загальну доступність.

Ця можливість дає змогу зовнішнім контролерам повністю брати на себе узгодження Job, відкриваючи потужні моделі планування, такі як багатокластерне диспетчеризування з [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).

## Навіщо делегувати узгодження Job? {#why-delegate-job-reconciliation}

Основною мотивацією для цієї можливості є підтримка архітектур багатокластерного пакетного планування, таких як MultiKueue.

Архітектура MultiKueue розрізняє кластер керування та пул робочих кластерів:

- Кластер управління відповідає за розподіл Job, але не за їх виконання. Він повинен приймати обʼєкти Job для відстеження статусу, але пропускає створення та виконання Podʼів.
- Робочі кластери отримують розподілені Job та виконують фактичні Podʼи.
- Користувачі зазвичай взаємодіють із кластером керування. Оскільки статус автоматично передається назад, вони можуть спостерігати за прогресом Job «наживо» без доступу до робочих кластерів.
- У робочих кластерах розподілені Job виконуються як звичайні Job, якими керує вбудований контролер Job, без налаштування `.spec.managedBy`.

Використовуючи `.spec.managedBy`, контролер MultiKueue в кластері керування може взяти на себе узгодження Job. Він копіює статус із «дзеркального» Job, що виконується в робочому кластері, назад до кластера керування.

Чому б просто не вимкнути контролер Job? Хоча теоретично це можна зробити, повністю вимкнувши вбудований контролер Job, часто це неможливо або недоцільно з двох причин:

1. Панелі управління, керовані постачальником: у багатьох хмарних середовищах панель управління Kubernetes заблокована, і користувачі не можуть змінювати прапорці менеджера контролерів.
2. Гібридна роль кластера: користувачам часто потрібен «гібридний» режим, в якому кластер керування надсилає деякі важкі робочі навантаження до віддалених кластерів, але все одно виконує менші Job або Job, повʼязані з панеллю управління, в кластері керування. `.spec.managedBy` дозволяє таку деталізацію для кожного Job окремо.

## Як працює `.spec.managedBy` {#how-spec-managedby-works}

Поле `.spec.managedBy` вказує, який контролер відповідає за Job. Існує два режими роботи:

- **Standard**: якщо не встановлено або встановлено на зарезервоване значення `kubernetes.io/job-controller`, вбудований контролер Job узгоджує Job як зазвичай (стандартна поведінка).
- **Delegation**: якщо встановлено на будь-яке інше значення, вбудований контролер Job повністю пропускає узгодження для цього Job.

Щоб запобігти появі осиротілих Podʼів або витоку ресурсів, це поле є незмінним. Ви не можете перенести запущений Job з одного контролера на інший.

Якщо ви плануєте впровадити зовнішній контролер, майте на увазі, що ваш контролер повинен відповідати визначенням [Job API](/docs/reference/kubernetes-api/workload-resources/job-v1/). Для забезпечення відповідності значну частину зусиль було спрямовано на впровадження розширених правил валідації статусу Job. Перейдіть до розділу [Як дізнатися більше?](#how-can-you-learn-more) для отримання додаткової інформації.

## Впровадження в екосистему {#ecosystem-adoption}

Поле `.spec.managedBy` швидко стає стандартним інтерфейсом для делегування контролю в екосистемі пакетної обробки Kubernetes.

Різні власні контролери робочого навантаження додають це поле (або його еквівалент), щоб MultiKueue міг перейняти їх узгодження та координувати їх між кластерами:

- [JobSet](https://github.com/kubernetes-sigs/jobset)
- [Kubeflow Trainer](https://www.kubeflow.org/docs/components/training/)
- [KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/)
- [AppWrapper](https://project-codeflare.github.io/appwrapper/)
- [Tekton Pipelines](https://tekton.dev/docs/)

Хоча можна використовувати `.spec.managedBy` для реалізації власного контролера Job з нуля, ми ще не спостерігали такого. Ця можливість спеціально розроблена для підтримки моделей делегування, таких як MultiKueue, без необхідності винаходити велосипед.

## Як дізнатися більше? {#how-can-you-learn-more}

Якщо ви хочете дізнатися більше:

Прочитайте документацію для користувачів щодо:

- [Job](/docs/concepts/workloads/controllers/job/),
- [Делегування керування обʼєктом Job зовнішньому контролеру](/docs/concepts/workloads/controllers/job/#delegation-of-managing-a-job-object-to-external-controller) та
- [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).

Детальний огляд історії розробки:

- Пропозиція щодо вдосконалення Kubernetes (KEP) [Механізм managed-by для Job](https://github.com/kubernetes/enhancements/issues/4368), включаючи впровадження розширених [правил валідації статусу Job](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/4368-support-managed-by-for-batch-jobs#job-status-validation).
- Kueue KEP для [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue).

Дізнайтеся, як MultiKueue використовує `.spec.managedBy` на практиці, у практичному посібнику про [виконання Job у кількох кластерах](https://kueue.sigs.k8s.io/docs/tasks/run/multikueue/job/).

## Подяки {#acknowledgments}

Як і у випадку з будь-якою функцією Kubernetes, багато людей допомогли сформувати цю можливість шляхом обговорень дизайну, оглядів, тестових запусків та повідомлень про помилки.

Ми хотіли б особливо подякувати:

* [Maciej Szulik](https://github.com/soltysh) — за настанови, наставництво та рецензії.
* [Filip Křepinský](https://github.com/atiratree) — за настанови, наставництво та рецензії.

## Приєднуйтесь {#get-involved}

Ця робота була спонсорована Kubernetes [Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch) у тісній співпраці з [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) та за активної підтримки спільноти [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Якщо ви зацікавлені в пакетному плануванні, рішеннях для декількох кластерів або подальшому вдосконаленні Job API:

- Приєднуйтесь до нас на засіданнях Batch WG та SIG Apps.
- Підпишіться на [каналу WG Batch у Slack](https://kubernetes.slack.com/messages/wg-batch).
