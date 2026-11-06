---
layout: blog
title: "Представляємо втулок Headlamp для Karpenter — масштабування та видимість"
date: 2025-10-06
slug: introducing-headlamp-plugin-for-karpenter
Author: >
  [René Dudfield](https://github.com/illume) (Microsoft),
  [Anirban Singha](https://github.com/SinghaAnirban005) (independent)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Headlamp — це відкритий, розширюваний проєкт Kubernetes SIG UI, призначений для огляду, керування та налагодження ресурсів кластера.

Karpenter — це проєкт Kubernetes Autoscaling SIG для виділення вузлів, який допомагає кластерам швидко та ефективно масштабуватися. Він запускає нові вузли за лічені секунди, добирає відповідні типи екземплярів для навантажень і керує повним життєвим циклом вузлів, включаючи зменшення масштабу.

Новий втулок Headlamp Karpenter додає можливість перегляду активності Karpenter у реальному часі безпосередньо з інтерфейсу Headlamp. Він показує, як ресурси Karpenter повʼязані з обʼєктами Kubernetes, виводить метрики в реальному часі та демонструє події масштабування в міру їх виникнення. Ви можете переглядати Podʼи в стані очікування під час надання вузлів, переглядати рішення щодо масштабування та редагувати ресурси, що керуються Karpenter, з вбудованою валідацією. Втулок Karpenter був створений у рамках проєкту менторської програми LFX.

Втулок Karpenter для Headlamp має на меті спростити для користувачів і операторів Kubernetes розуміння, налагодження та тонке налаштування поведінки автомасштабування в їхніх кластерах. Далі — короткий огляд втулка Headlamp.

## Мапа ресурсів Karpenter та їх звʼязки з ресурсами Kubernetes {#map-view-of-karpenter-resources-and-how-they-relate-to-kubernetes-resources}

Легко побачити, як ресурси Karpenter, такі як NodeClasses, NodePool і NodeClaims, повʼязані з основними ресурсами Kubernetes, такими як Podʼи, вузли тощо.

![Карта, що показує звʼязки між ресурсами](./mini-map-view.png)

## Візуалізація метрик Karpenter {#visualization-of-karpenter-metrics}

Отримайте миттєву інформацію про Resource Usage v/s Limits, Allowed disruptions, Pending Pods, Provisioning Latency та багато іншого.

![Типові метрики NodePool з елементами керування для вибору частоти](./chart-1.png)

![Типові метрики NodeClaim з елементами керування для вибору частоти](./chart-2.png)

## Рішення щодо масштабування {#scaling-decisions}

Показує, які екземпляри виділяються для ваших навантажень, і допомагає зрозуміти причину, чому Karpenter прийняв ці рішення. Корисно під час налагодження.

![Дані рішень щодо розміщення Podʼів: причина, джерело, Pod, повідомлення та вік](./pod-decisions.png)

![Дані рішень щодо вузлів: тип, причина, вузол, джерело, повідомлення](./node-decisions.png)

## Редактор конфігурацій з підтримкою валідації {#config-editor-with-validation-support}

Вносьте зміни в конфігурацію Karpenter наживо. Редактор включає попередній перегляд змін і валідацію ресурсів для безпечніших налаштувань.

![Редактор конфігурацій з підтримкою валідації](./config-editor.png)

## Перегляд ресурсів Karpenter у реальному часі {#real-time-view-of-karpenter-resources}

Переглядайте та відстежуйте специфічні ресурси Karpenter у реальному часі, такі як «NodeClaims», коли ваш кластер масштабується вгору та вниз.

![Дані NodeClaim: імʼя, стан, тип екземпляра, CPU, зона, вік і дії](./node-claims.png)

![Дані NodePool: імʼя, NodeClass, CPU, памʼять, вузли, стан, вік, дії](./nodepools.png)

![Дані EC2 NodeClass: імʼя, кластер, профіль екземпляра, стан, роль IAM, вік і дії](./nodeclass.png)

## Інфопанель для Podʼів в очікуванні {#dashboard-for-pending-pods}

Переглядайте всі Podʼи в очікуванні з невиконаними вимогами до планування або з подією Failed Scheduling, з поясненням, чому їх не вдалося запланувати.

![Дані Podʼів в очікуванні: імʼя, простір імен, тип, причина, джерело та повідомлення](./pending-pods.png)


### **Постачальники Karpenter** {#karpenter-providers}

Цей втулок повинен працювати з більшістю постачальників Karpenter, але наразі був протестований лише на тих, що наведені в таблиці. Крім того, кожен постачальник надає деяку додаткову інформацію, і ті, що наведені в таблиці нижче, відображаються втулком.

| Постачальник | Перевірено | Підтримується додаткова інформація<br/>про конкретного постачальника |
| ----- | ----- | ----- |
| [AWS](https://github.com/aws/karpenter-provider-aws) | ✅ | ✅ |
| [Azure](https://github.com/Azure/karpenter-provider-azure) | ✅ | ✅ |
| [AlibabaCloud](https://github.com/cloudpilot-ai/karpenter-provider-alibabacloud) | ❌ | ❌ |
| [Bizfly Cloud](https://github.com/bizflycloud/karpenter-provider-bizflycloud) | ❌ | ❌ |
| [Cluster API](https://github.com/kubernetes-sigs/karpenter-provider-cluster-api) | ❌ | ❌ |
| [GCP](https://github.com/cloudpilot-ai/karpenter-provider-gcp) | ❌ | ❌ |
| [Proxmox](https://github.com/sergelogvinov/karpenter-provider-proxmox) | ❌ | ❌ |
| [Oracle Cloud Infrastructure (OCI)](https://github.com/zoom/karpenter-oci) | ❌ | ❌ |

Будь ласка, [створіть тікет](https://github.com/headlamp-k8s/plugins/issues), якщо ви протестуєте одного з неперевірених постачальників або якщо ви хочете підтримку для цього постачальника (PR також охоче приймаємо).

## Як користуватися {#how-to-use}

Будь ласка, ознайомтеся з [plugins/karpenter/README.md](https://github.com/headlamp-k8s/plugins/tree/main/karpenter) для отримання інструкцій щодо використання.

## Відгуки та запитання {#feedback-and-questions}

Будь ласка, [створіть тікет](https://github.com/headlamp-k8s/plugins/issues), якщо ви використовуєте Karpenter і маєте будь-які інші ідеї або відгуки. Або приєднуйтесь до каналу [Kubernetes slack headlamp](https://kubernetes.slack.com/?redir=%2Fmessages%2Fheadlamp) для спілкування.
