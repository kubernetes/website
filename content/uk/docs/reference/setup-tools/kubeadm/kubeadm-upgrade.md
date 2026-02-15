---
title: kubeadm upgrade
content_type: concept
weight: 40
---

<!-- overview -->

`kubeadm upgrade` — це зручна команда, яка обгортає складну логіку оновлення однією командою, з підтримкою як планування оновлення, так і його фактичного виконання.

<!-- body -->

## Інструкція kubeadm upgrade {#kubeadm-upgrade-guidance}

Кроки для виконання оновлення за допомогою kubeadm викладені в [цьому документі](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/). Для старіших версій kubeadm, будь ласка, зверніться до старих наборів документації на сайті Kubernetes.

Ви можете використовувати `kubeadm upgrade diff` для перегляду змін, які будуть застосовані до маніфестів статичних Pod.

У Kubernetes версії v1.15.0 і пізніше, `kubeadm upgrade apply` та `kubeadm upgrade node` також автоматично оновлять сертифікати, керовані kubeadm на цьому вузлі, включаючи ті, що зберігаються у файлах kubeconfig. Щоб відмовитися від цього, можна передати прапорець `--certificate-renewal=false`. Для отримання додаткової інформації про оновлення сертифікатів дивіться [документацію з управління сертифікатами](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).

{{< note >}}
Команди `kubeadm upgrade apply` та `kubeadm upgrade plan` мають застарілий прапорець `--config`, який дозволяє переналаштувати кластер під час планування або оновлення конкретного вузла панелі управління. Будь ласка, зверніть увагу, що робочий процес оновлення не був розроблений для цього сценарію, і можуть бути повідомлення про несподівані результати.
{{</ note >}}

## kubeadm upgrade plan {#cmd-upgrade-plan}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node {#cmd-upgrade-node}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_node.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) якщо ви ініціалізували свій кластер за допомогою kubeadm версії 1.7.x або нижче, щоб налаштувати ваш кластер для оновлення за допомогою `kubeadm upgrade`.
