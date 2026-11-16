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

[Headlamp](https://headlamp.dev/) — це відкритий, розширюваний проєкт Kubernetes SIG UI, призначений для огляду, керування та налагодження ресурсів кластера.

[Knative](https://knative.dev/) приносить безсерверні робочі навантаження до Kubernetes, обробляючи маршрутизацію трафіку, автомасштабування та керування ревізіями, щоб команди могли розгортати та ітеративно працювати без боротьби з інфраструктурою. Але щоденна експлуатація робочих навантажень Knative може бути складною, все ще потрібно часто перемикатися між `kn` CLI, `kubectl` та інтерфейсом Kubernetes, щоб отримати повну картину того, що працює.

Ми створили [втулок Headlamp для Knative](https://github.com/headlamp-k8s/plugins/tree/main/knative), щоб заповнити цю прогалину, дозволяючи операторам переглядати, розуміти свої робочі навантаження та діяти щодо них з одного місця. Цей втулок був створений в рамках програми наставництва LFX. Ось огляд того, що ми зробили.

Ось короткий огляд втулка Knative для Headlamp:

{{<youtube id="9HAcUsopSYE" title="Headlamp Knative plugin walkthrough">}}

## Інтеграція ресурсів Knative з картою Headlamp {#integrating-knative-resources-with-headlamp-s-map-view}

Зіставлення ресурсів в Headlamp працює і для CRD Knative. Ви можете побачити, як KServices, Revisions та DomainMappings повʼязані між собою, на одному графі.

![Ресурси Knative на карті Headlamp](knative-map-view.png)

## Керування KService: редагування розподілу трафіку, перезапуск Podʼів та перегляд логів {#kservice-management-edit-traffic-splits-restart-pods-and-view-logs}

KService є ресурсом верхнього рівня в Knative: він керує життєвим циклом маршрутів, конфігурацій, ревізій та всім необхідним для запуску вашого застосунку й надання доступу до нього.

Втулок надає KServices повний перегляд деталей з перемиканням в **Режим редагування** для внесення змін наживо у розподіл трафіку, анотації автомасштабування та інше. Поширені дії, такі як перегляд YAML, відкриття логів, запуск повторного розгортання або перезапуск підлеглих Podʼів, показуються в заголовку, обмежені вашими поточними правами RBAC.

![Детальний перегляд Knative Service](knative-kservice-view.png)

## Розділення трафіку: маршрутизація між ревізіями для поступових розгортань та тестування {#traffic-splitting-route-across-revisions-for-gradual-rollouts-and-testing}

Knative дозволяє маршрутизувати трафік між кількома ревізіями одного й того ж сервісу. Це корисно для канаркових релізів, поступових розгортань, URL попереднього перегляду з тегами та A/B-тестування.

Втулок показує трафік, призначений кожній ревізії, останню готову ревізію, стан готовності, вік та налаштовані теги. У режимі редагування ви можете змінювати відсотки та теги безпосередньо. Перед збереженням втулок перевіряє, що сума трафіку дорівнює 100% і що теги унікальні. Маршрути з тегами, для яких повідомлено URL, показуються як посилання.

![Розподіл трафіку між ревізіями](knative-traffic-view.png)

## Конфігурація автомасштабування: перегляд фактичних налаштувань і типових значень кластера {#autoscaling-configuration-view-effective-settings-and-cluster-defaults}

Автомасштабувальник Knative підтримує цілий ряд параметрів: цільові значення паралельності, цільовий рівень завантаження, цільові значення RPS, мінімальний/максимальний масштаб, початковий масштаб, вікно стабільності, затримка зменшення масштабу та інші. Фактичне значення для будь-якого робочого навантаження визначається поєднанням анотацій на рівні KService та ConfigMaps для всього кластера.

Втулок читає `config-autoscaler` та `config-defaults` і показує фактичну конфігурацію для кожного KService у контексті, щоб ви могли одразу побачити, чи налаштування явно задано, чи використовується типове значення кластера.

![Перегляд автомасштабування та паралельності](knative-autoscaling-view.png)

## Метрики Prometheus: моніторинг швидкості запитів, затримки та використання ресурсів {#prometheus-metrics-monitor-request-rates-latency-and-resource-utilization}

Разом з [втулком Prometheus для Headlamp](https://github.com/headlamp-k8s/plugins/tree/main/plugins/prometheus), втулок показує графіки швидкості запитів, затримки та використання ресурсів на сторінках деталей KService та Revision. Розподіл швидкості запитів по ревізіях особливо корисний під час перевірки розподілу трафіку, що ще триває.

![Метрики Knative з фільтром за ревізією](knative-revision-metrics-graph.png)

## Інфопанель для інших CRD {#dashboard-for-other-crds}

Втулок також містить списки та детальні огляди для Revisions, DomainMappings, ClusterDomainClaims, а також огляд мережевих параметрів на рівні кластера (читає `config-network` та `config-gateway`, щоб показати фактичний клас Ingress, налаштування шлюзу та сервіси, що їх забезпечують). Це дає операторам повне уявлення про стан Knative, не виходячи з Headlamp.

![Список ревізій Knative](knative-revisions-view.png)
![Список DomainMapping у Knative](knative-domain-mapping-view.png)
![Список ClusterDomainClaim у Knative](knative-cluster-domain-claim-view.png)

## Як встановити втулок Knative у Headlamp {#how-to-install-the-knative-plugin-in-headlamp}

1. Переконайтеся, що [Knative встановлено](https://knative.dev/docs/install/) у вашому кластері.
2. У Headlamp Desktop відкрийте **Каталог втулків**, знайдіть Knative і натисніть Встановити.
3. Перезавантажте Headlamp, у бічній панелі зʼявиться новий пункт Knative.

Для розробки або налаштування на рівні вихідного коду дивіться [README до втулка Knative](https://github.com/headlamp-k8s/plugins/tree/main/plugins/knative). Поточний випуск — [**0.3.0-beta**](https://github.com/headlamp-k8s/plugins/releases/tag/knative-0.3.0-beta).

## Поділіться своїм відгуком {#share-your-feedback}

Ми будемо раді отримати відгуки від операторів і користувачів Knative. Якщо ви натрапили на помилку або хочете підтримку для робочого процесу, який ми ще не охопили, [будь ласка, відкрийте тікет](https://github.com/headlamp-k8s/plugins/issues). Ви також можете знайти нас у каналі [Kubernetes Slack #headlamp](https://kubernetes.slack.com/archives/headlamp).
