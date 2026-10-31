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

Headlamp — це відкритий, розширюваний проєкт Kubernetes SIG UI, призначений для того, щоб ви могли досліджувати, керувати та налагоджувати ресурси кластера.

Karpenter — це проєкт Kubernetes Autoscaling SIG для виділення вузлів, який допомагає кластерам швидко та ефективно масштабуватися. Він запускає нові вузли за лічені секунди, добираючи відповідні типи екземплярів для навантажень і керує повним життєвим циклом вузлів, включаючи зменшення масштабу.

Новий втулок Headlamp Karpenter додає можливість перегляду активності Karpenter у реальному часі безпосередньо з інтерфейсу Headlamp. Він показує, які ресурси Karpenter відповідають обʼєктам Kubernetes, виводить метрики в реальному часі та демонструє події масштабування в міру їх виникнення. Ви можете здійснювати перевірку подів, що очікують на обробку, переглядати рішення щодо масштабування та редагувати ресурси, що керуються Karpenter, за допомогою вбудованої функції перевірки. Втулок Karpenter був створений у рамках проєкту за підтримки LFX.

Втулок Karpenter для Headlamp має на меті спростити розуміння, налагодження та тонке налаштування поведінки автоматичного масштабування в кластерах Kubernetes. Тепер ми проведемо короткий тур по втулку Headlamp.

## Мапа ресурсів Karpenter та їх звʼязки з ресурсами Kubernetes {#map-view-of-karpenter-resources-and-how-they-relate-to-kubernetes-resources}

Легко побачити, як ресурси Karpenter, такі як NodeClasses, NodePool і NodeClaims, повʼязані з основними ресурсами Kubernetes, такими як Pods, Nodes тощо.

![Map view showing relationships between resources](./mini-map-view.png)

## Візуалізація метрик Karpenter {#visualization-of-karpenter-metrics}

Отримайте миттєву інформацію про Resource Usage v/s Limits, Allowed disruptions, Pending Pods, Provisioning Latency та багато іншого.

![NodePool default metrics shown with controls to see different frequencies](./chart-1.png)

![NodeClaim default metrics shown with controls to see different frequencies](./chart-2.png)

## Рішення щодо масштабування {#scaling-decisions}

Показує, які екземпляри виділяються для ваших навантажень, і допомагає зрозуміти причину, чому Karpenter прийняв ці рішення. Корисно під час налагодження.

![Pod Placement Decisions data including reason, from, pod, message, and age](./pod-decisions.png)

![Node decision data including Type, Reason, Node, From, Message](./node-decisions.png)

## Редактор конфігурацій з підтримкою валідації {#config-editor-with-validation-support}

Робіть зміни в конфігурації Karpenter в реальному часі. Редактор включає попередній перегляд змін і валідацію ресурсів для безпечніших налаштувань.

![Config editor with validation support](./config-editor.png)

## Перегляд ресурсів Karpenter у реальному часі {#real-time-views-of-karpenter-resources}

Переглядайте та відстежуйте специфічні ресурси Karpenter у реальному часі, такі як "NodeClaims", коли ваш кластер масштабується вгору та вниз.

![Node claims data including Name, Status, Instance Type, CPU, Zone, Age, and Actions](./node-claims.png)

![Node Pools data including Name, NodeClass, CPU, Memory, Nodes, Status, Age, Actions](./nodepools.png)

![EC2 Node Classes data including Name, Cluster, Instance Profile, Status, IAM Role, Age, and Actions](./nodeclass.png)

## Панель інструментів для подів в очікуванні {#dashboard-for-pending-pods}

Переглядайте всі поди в очікуванні з невиконаними вимогами до планування/не вдалося запланувати, підкреслюючи причини, чому їх не вдалося запланувати.

![Pending Pods data including Name, Namespace, Type, Reason, From, and Message](./pending-pods.png)


### **Karpenter Providers**

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

Будь ласка, [стовріть тікет](https://github.com/headlamp-k8s/plugins/issues) якщо ви протестуєте одного з неперевірених постачальників або якщо ви хочете підтримку для цього постачальника (PRs також з радістю приймаються).

## Як користуватися {#how-to-use}

Будь ласка, ознайомтеся з [plugins/karpenter/README.md](https://github.com/headlamp-k8s/plugins/tree/main/karpenter) для отримання інструкцій щодо використання.

## Відгуки та запитання {#feedback-and-questions}

Будь ласка, [стовріть тікет](https://github.com/headlamp-k8s/plugins/issues) якщо ви використовуєте Karpenter і маєте будь-які інші ідеї або відгуки. Або приєднуйтесь до каналу [Kubernetes slack headlamp](https://kubernetes.slack.com/?redir=%2Fmessages%2Fheadlamp) для спілкування.
