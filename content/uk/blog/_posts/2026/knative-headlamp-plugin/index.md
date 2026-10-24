---
layout: blog
title: "Погляд на безсерверні обчислення: представляємо втулок Headlamp для Knative"
date: 2026-06-25T10:00:00-08:00
slug: headlamp-knative-plugin
author: >
  [Mudit Maheshwari](https://github.com/mudit06mah) (independent),
  [Kahiro Okina](https://github.com/kahirokunn) (Craftsman Software, Inc.)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

[Headlamp](https://headlamp.dev/) є відкритим, розширюваним проєктом інтерфейсу користувача від Kubernetes SIG, призначеним для спостереження, управління та налагодження ресурсів кластера.

[Knative](https://knative.dev/) приносить безсерверні робочі навантаження до Kubernetes, обробляючи маршрутизацію трафіку, автомасштабування та управління ревізіями, щоб команди могли розгортати та ітеративно працювати без боротьби з інфраструктурою. Але щоденна експлуатація робочих навантажень Knative може бути складною, все ще потрібно часто перемикатися між `kn` CLI, `kubectl` та інтерфейсом Kubernetes, щоб отримати повну картину того, що працює.

Ми створили [втулок Headlamp для Knative](https://github.com/headlamp-k8s/plugins/tree/main/knative), щоб заповнити цю прогалину, дозволяючи операторам переглядати, розуміти та взаємодіяти зі своїми робочими навантаженнями з одного місця. Цей втулок був створений в рамках програми наставництва LFX. Ось огляд того, що ми зробили.

Ось короткий огляд втулка Knative для Headlamp:

{{<youtube id="9HAcUsopSYE" title="Headlamp Knative plugin walkthrough">}}

## Інтеграція ресурсів Knative з картою Headlamp {#integrating-knative-resources-with-headlamp-s-map-view}

Зіставлення ресурсів в Headlamp працює і для CRD Knative. Ви можете побачити, як KServices, Revisions та DomainMappings взаємоповʼязані в одному графічному інтерфейсі.

![Knative resources in Headlamp Map View](knative-map-view.png)

## Управління KService: редагування розподілу трафіку, перезапуск подів та перегляд журналів {#kservice-management-edit-traffic-splits-restart-pods-and-view-logs}

KService є ресурсом верхнього рівня в Knative: він управляє життєвим циклом маршрутів, конфігурацій, ревізій та всім необхідним для запуску та експонування вашого застосунку.

Втулок надає KServices повний перегляд деталей з перемиканням в **Режим редагування** для внесення змін у розподіл трафіку, анотації автомасштабування та інше. Загальні дії, такі як перегляд YAML, відкриття журналів, запуск повторного розгортання або перезапуск підлеглих подів, показуються в заголовку, обмежені вашими поточними правами RBAC.

![Knative Service Detail View](knative-kservice-view.png)

## Розділення трафіку: маршрутизація між ревізіями для поступових розгортань та тестування {#traffic-splitting-route-across-revisions-for-gradual-rollouts-and-testing}

Knative дозволяє маршрутизувати трафік між кількома ревізіями одного й того ж сервісу. Це корисно для канаркових релізів, поступових розгортань, протегованих попередніх URL та A/B тестування.

Втулок показує трафік, призначений кожній ревізії, останню готову ревізію, стан готовності, вік та налаштовані теги. У режимі редагування ви можете змінювати відсотки та теги безпосередньо. Втулок перевіряє, що трафік сумується до 100% і що теги унікальні перед збереженням. Маршрути з тегами та звітом URL відображаються як клікабельні посилання.

![Traffic Splitting between Revisions](knative-traffic-view.png)

## Конфігурація автомасштабування: перегляд ефективних налаштувань та стандартних налаштувань кластера {#autoscaling-configuration-view-effective-settings-and-cluster-defaults}

Функція автоматичного масштабування Knative підтримує цілий ряд параметрів: цільові значення паралельності, цільовий рівень завантаження, цільові значення RPS, мінімальний/максимальний масштаб, початковий масштаб, вікно стабільності, затримка зменшення масштабу та інші. Фактичне значення для будь-якого робочого навантаження визначається поєднанням анотацій на рівні KService та ConfigMaps для всього кластера.

Втулок читає `config-autoscaler` та `config-defaults` і показує поточну конфігурацію для кожного KService у контексті, щоб ви могли одразу побачити, чи налаштування явно задано, чи використовується стандартне значення кластера.

![Autoscaling and Concurrency View](knative-autoscaling-view.png)

## Метрики Prometheus: моніторинг швидкості запитів, затримки та використання ресурсів {#prometheus-metrics-monitor-request-rates-latency-and-resource-utilization}

Разом з [втулком Prometheus для Headlamp](https://github.com/headlamp-k8s/plugins/tree/main/plugins/prometheus), втулок показує графіки швидкості запитів, затримки та використання ресурсів на сторінках деталей KService та Revision. Розподіл швидкості запитів по ревізіях особливо корисний при перевірці розподілу трафіку в процесі.

![Knative metrics filtered by revision](knative-revision-metrics-graph.png)

## Інфопанель для інших CRD {#dashboard-for-other-crds}

Втулок також містить списки та детальні огляди для Revisions, DomainMappings, ClusterDomainClaims, а також огляд мережевих параметрів на рівні кластера (зчитування файлів `config-network` та `config-gateway` для отримання інформації про фактичний клас вхідного трафіку, налаштування шлюзу та допоміжні сервіси) . Це дає операторам повне уявлення про стан Knative, не виходячи з Headlamp.

![Knative Revision List View](knative-revisions-view.png)
![Knative Domain Mapping List View](knative-domain-mapping-view.png)
![Knative Cluster Domain Claim List View](knative-cluster-domain-claim-view.png)

## Як встановити втулок Knative у Headlamp {#how-to-install-the-knative-plugin-in-headlamp}

1. Переконайтеся, що [Knative встановлено](https://knative.dev/docs/install/) у вашому кластері.
2. У Headlamp Desktop відкрийте **Каталог втулків**, знайдіть Knative і натисніть Встановити.
3. Перезавантажте Headlamp, у бічній панелі зʼявиться новий пункт Knative.

Для розробки або налаштування на рівні вихідного коду дивіться [README до втулка Knative](https://github.com/headlamp-k8s/plugins/tree/main/plugins/knative). Поточний випуск — [**0.3.0-beta**](https://github.com/headlamp-k8s/plugins/releases/tag/knative-0.3.0-beta).

## Поділіться своїм відгуком {#share-your-feedback}

Ми будемо раді отримати відгуки від користувачів Knative. Якщо ви натрапили на помилку або хочете підтримку для робочого процесу, який ми ще не охопили, [будь ласка, відкрийте тікет](https://github.com/headlamp-k8s/plugins/issues). Ви також можете знайти нас у каналі [Kubernetes Slack #headlamp](https://kubernetes.slack.com/archives/headlamp).
