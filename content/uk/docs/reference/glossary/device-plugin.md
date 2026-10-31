---
title: Втулок пристрою
id: device-plugin
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Програмні розширення для надання Podʼам доступу до пристроїв, які потребують вендор-специфічної ініціалізації чи налаштувань.
aka:
- device plugin
tags:
- fundamental
- extension
---

Втулки пристроїв працюють на вузлах кластера ({{< glossary_tooltip term_id="node" text="Nodes" >}}) та забезпечують {{< glossary_tooltip term_id="pod" text="Podʼам" >}} доступ до {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} інфраструктури, таких як локальне обладнання, яке вимагає вендор-специфічної ініціалізації чи налаштувань.

<!--more-->

Втулки пристроїв оголошують ресурси для {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, щоб робочі {{< glossary_tooltip term_id="pod" text="Podʼи" >}} мали доступ до апаратних можливостей, повʼязаних з вузлом, на якому запущений цей Pod. Ви можете розгортати втулок пристрою як {{< glossary_tooltip term_id="daemonset" >}}, або встановлювати програмне забезпечення втулка пристрою безпосередньо на кожний відповідний вузол.

Докладніше дивіться в розділі [Втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
