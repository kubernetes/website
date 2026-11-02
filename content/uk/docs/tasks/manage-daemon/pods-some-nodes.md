---
title: Запуск Podʼів лише на деяких вузлах
content_type: task
weight: 30
---
<!-- overview -->

На цій сторінці показано, як запускати {{<glossary_tooltip term_id="pod" text="Podʼи">}} лише на деяких {{<glossary_tooltip term_id="node" text="вузлах">}} у складі {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

## Запуск Podʼів лише на деяких вузлах {#running-pods-on-only-some-nodes}

Уявімо, що ви хочете запустити {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, але ці Podʼи демонів потрібно запускати лише на вузлах із локальним твердотільним сховищем (SSD). Наприклад, Pod може надавати вузлу сервіс кешування, а кеш корисний лише тоді, коли доступне локальне сховище з низькою затримкою.

### Крок 1: Додайте мітки до вузлів {#step-1-add-labels-to-your-nodes}

Додайте мітку `ssd=true` до вузлів, які мають SSD.

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### Крок 2: Створіть маніфест {#step-2-create-the-manifest}

Створімо {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, який розгортатиме Podʼи демонів лише на {{<glossary_tooltip term_id="node" text="вузлах">}} з міткою SSD.

Далі використайте `nodeSelector`, щоб DaemonSet запускав Podʼи лише на вузлах, де мітка `ssd` має значення `"true"`.

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

### Крок 3: Створіть DaemonSet {#step-3-create-the-daemonset}

Створіть DaemonSet з маніфесту, використовуючи `kubectl create` або `kubectl apply`.

Додамо мітку `ssd=true` ще одному вузлу.

```shell
kubectl label nodes example-node-3 ssd=true
```

Додавання мітки вузлу автоматично спонукає панель управління (а саме контролер DaemonSet) запустити новий Pod демона на цьому вузлі.

```shell
kubectl get pods -o wide
```

Вивід подібний до такого:

```
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
