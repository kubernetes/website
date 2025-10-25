---
title: kubeadm config
content_type: concept
weight: 50
---

<!-- overview -->

Під час виконання `kubeadm init`, kubeadm надсилає обʼєкт `ClusterConfiguration` у ваш кластер у ConfigMap з назвою `kubeadm-config` у просторі імен `kube-system`. Ця конфігурація зчитується під час виконання `kubeadm join`, `kubeadm reset` та `kubeadm upgrade`.

Ви можете використовувати `kubeadm config print` для виведення стандартної статичної конфігурації, яку використовує kubeadm для `kubeadm init` і `kubeadm join`.

{{< note >}}
Вивід цієї команди використовується як приклад. Ви повинні вручну редагувати вивід цієї команди, щоб адаптувати його до ваших налаштувань. Видаліть поля, щодо яких ви не впевнені, і kubeadm спробує заповнити їх стандартними значеннями під час виконання, аналізуючи хост.
{{< /note >}}

Для отримання додаткової інформації про `init` та `join` перейдіть до [Використання kubeadm init з конфігураційним файлом](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) або [Використання kubeadm join з конфігураційним файлом](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).

Для отримання додаткової інформації про використання API конфігурації kubeadm перейдіть до [Налаштування компонентів за допомогою API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags).

Ви можете використовувати `kubeadm config migrate` для перетворення старих конфігураційних файлів, що містять застарілу версію API, на новішу підтримувану версію API.

`kubeadm config validate` можна використовувати для перевірки конфігураційного файлу.

`kubeadm config images list` та `kubeadm config images pull` можна використовувати для виведення списку та завантаження зображень, необхідних kubeadm.

<!-- body -->
## kubeadm config print {#cmd-config-print}

{{< include "generated/kubeadm_config/kubeadm_config_print.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}

{{< include "generated/kubeadm_config/kubeadm_config_migrate.md" >}}

## kubeadm config validate {#cmd-config-validate}

{{< include "generated/kubeadm_config/kubeadm_config_validate.md" >}}

## kubeadm config images list {#cmd-config-images-list}

{{< include "generated/kubeadm_config/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}

{{< include "generated/kubeadm_config/kubeadm_config_images_pull.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) для оновлення кластера Kubernetes до новішої версії
