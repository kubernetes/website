---
title: Запуск Podʼів лише на деяких вузлах
content_type: task
weight: 30
---
<!-- overview -->

Ця сторінка демонструє, як можна запускати {{<glossary_tooltip term_id="pod" text="Podʼи">}} лише на деяких {{<glossary_tooltip term_id="node" text="вузлах">}} як частину {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## Запуск Pod лише на деяких вузлах {#running-pods-on-only-some-nodes}

Уявімо, що ви хочете запустити {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, але вам потрібно запускати ці Pod демонів
лише на вузлах, які мають локальне SSD-сховище. Наприклад, Pod може надавати кеш-сервіс для вузла, і кеш корисний тільки тоді, коли доступне локальне сховище з низькою затримкою.

### Крок 1: Додайте мітки до ваших вузлів {#step-1-add-labels-to-your-nodes}

Додайте мітку `ssd=true` до вузлів, які мають SSD.

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### Крок 2: Створіть маніфест {#step-2-create-the-manifest}

Створімо {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, який буде запускати Podʼи демонів тільки на вузлах з міткою SSD.

Використайте `nodeSelector`, щоб забезпечити, що DaemonSet буде запускати Pod лише на вузлах з міткою `ssd`, значення якої дорівнює `"true"`.

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

### Крок 3: Створіть DaemonSet {#step-3-create-the-daemonset}

Створіть DaemonSet з маніфесту, використовуючи `kubectl create` або `kubectl apply`.

Додамо мітку ще одному вузлу `ssd=true`.

```shell
kubectl label nodes example-node-3 ssd=true
```

Додавання мітки вузлу автоматично запускає панель управління (конкретно, контролер DaemonSet), щоб запустити новий Pod для демона на цьому вузлі.

```shell
kubectl get pods -o wide
```

Вивід буде схожим на:

```none
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
