---
title: kubeadm upgrade
content_type: concept
weight: 40
---
<!-- overview -->
`kubeadm upgrade` — це зручна команда, яка приховує складну логіку оновлення
за однією командою та підтримує як планування оновлення, так і його фактичне виконання.


<!-- body -->

## Настанови щодо kubeadm upgrade {#kubeadm-upgrade-guidance}

Кроки для виконання оновлення за допомогою kubeadm викладені в [цьому документі](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
Для старіших версій kubeadm зверніться до старіших наборів документації на сайті Kubernetes.

Ви можете використовувати `kubeadm upgrade diff`, щоб переглянути зміни, які буде застосовано до маніфестів статичних Podʼів.

У Kubernetes v1.15.0 і пізніших версіях `kubeadm upgrade apply` та `kubeadm upgrade node` також
автоматично поновлюють сертифікати, якими керує kubeadm, на цьому вузлі, включно з тими, що зберігаються у файлах kubeconfig.
Щоб відмовитися від цього, можна передати прапорець `--certificate-renewal=false`. Докладніше про поновлення
сертифікатів дивіться в [документації з керування сертифікатами](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).

{{< note >}}
Команди `kubeadm upgrade apply` та `kubeadm upgrade plan` мають застарілий прапорець `--config`,
який дає змогу переналаштувати кластер під час планування або оновлення конкретного
вузла панелі управління. Зверніть увагу, що процес оновлення не розроблявся для такого сценарію, і є
повідомлення про неочікувані результати.
{{</ note >}}

## kubeadm upgrade plan {#cmd-upgrade-plan}
{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}
{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node {#cmd-upgrade-node}
{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_node.md" >}}


## {{% heading "whatsnext" %}} {#what-s-next}

* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/), якщо ви ініціалізували свій кластер за допомогою kubeadm v1.7.x або старішої версії, щоб налаштувати кластер для `kubeadm upgrade`
