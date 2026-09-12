---
layout: blog
title: "Kubernetes v1.37: Менеджери ресурсів на рівні Pod переходять у бета"
draft: true
slug: kubernetes-v1-37-pod-level-resource-managers-beta
author: Kevin Torres Martinez (Google)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

З випуском Kubernetes v1.37, функція **Pod-Level Resource Managers** перейшла в статус **Beta** (стандартно вимкнена)!

Вперше представлена як функція Alpha у [Kubernetes v1.36](/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/), ця функція розширює можливості [Pod-Level Resources](/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/), надаючи Topology Manager, CPU Manager і Memory Manager `kubelet` можливість використовувати декларації ресурсів на рівні Podʼа (`.spec.resources`) безпосередньо при прийнятті рішень щодо розміщення апаратного забезпечення.

## Використання ресурсів рівня пода менеджерами вузлів{#bringing-pod-level-resources-to-node-managers}

До впровадження цієї функції отримання ексклюзивних CPU-ядер, вирівняних за NUMA, або памʼяті для застосунків з критичною затримкою змушувало операторів кластерів робити вибір "все або нічого": призначати цілі запити ресурсів *кожному* контейнеру в Podʼі або повністю відмовитися від ексклюзивного вирівнювання за NUMA. Для сучасних робочих навантажень, що запускають легкі sidecars (такі як агенти журналювання або експортери телеметрії), виділення спеціальних фізичних ядер допоміжним контейнерам було марнотратним.

Функція Pod-Level Resource Managers вирішує цю проблему, дозволяючи гібридні моделі розподілу ресурсів. Kubelet може резервувати ексклюзивні ресурси, вирівняні за NUMA, для основних контейнерів застосунків, одночасно розміщуючи sidecars без гарантій у ізольованому пулі Podʼа. Це забезпечує основним робочим навантаженням необмежену продуктивність, локальну для NUMA, тоді як sidecars отримують користь від запуску в ізольованому пулі Podʼа, насолоджуючись локальним вирівнюванням за NUMA та захистом від зовнішніх втручань вузла без використання спеціальних фізичних ядер.

## Що нового у бета-версії {#what-s-new-in-beta}

Перехід у бета-версію приносить ключові операційні та API покращення:

* **Перехід у бета-версію:** Керується функціональною можливістю `PodLevelResourceManagers`, доступною для включення (стандартно вимкнено) у Kubernetes v1.37.
* **Звітування PodResources API:** gRPC-сервіс `v1` PodResources (`PodResourcesLister`) вводить поля верхнього рівня `cpu_ids` і `memory` у відповідях `PodResources`. Інструменти моніторингу та втулки пристроїв можуть безпосередньо запитувати ексклюзивні призначення на рівні Podʼа без подвійного підрахунку виділень контейнерів.

## Початок роботи та надання відгуків {#getting-started-and-providing-feedback}

Для детального ознайомлення з технічними деталями та налаштуванням цієї функції дивіться офіційну документацію:

* [Керування ресурсами рівня Pod](/docs/concepts/resource-management/pod-level-resource-managers/)
* [Довідник з керування ресурсами рівня Pod](/docs/reference/node/pod-level-resource-managers/)

Щоб ознайомитися з покроковим посібником з налаштування та розгортання робочих навантажень:

* [Використання ресурсів рівня Pod з менеджерами ресурсів Kubelet](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)

Щоб дізнатися більше про те, як призначати ресурси Podʼам:

* [Призначення ресурсів CPU і памʼяті рівня Pod](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

Оскільки ця функція проходить шлях від бета-версії до GA, ваш відгук є надзвичайно цінним. Будь ласка, повідомляйте про будь-які проблеми або діліться своїм досвідом через стандартні канали комунікації Kubernetes:

* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
