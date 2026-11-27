---
title: kubeadm reset phase
weight: 90
content_type: concept
---

`kubeadm reset phase` дозволяє вам викликати атомарні кроки процесу скидання вузла. Таким чином, ви можете дозволити kubeadm виконати частину роботи, а ви заповните прогалини, якщо захочете застосувати налаштування.

`kubeadm reset phase` узгоджується з [процесом скидання kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow), і за лаштунками обидва використовують той самий код.

## kubeadm reset phase {#cmd-reset-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_reset/kubeadm_reset_phase.md" />}}
{{< /tabs >}}

## kubeadm reset phase preflight {#cmd-reset-phase-preflight}

За допомогою цієї фази ви можете виконати попередні перевірки на вузлі, який скидається.

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_reset/kubeadm_reset_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm reset phase remove-etcd-member {#cmd-reset-phase-remove-etcd-member}

За допомогою цієї фази ви можете вилучити члена etcd цього вузла панелі управління з кластера etcd.

{{< tabs name="tab-remove-etcd-member" >}}
{{< tab name="remove-etcd-member" include="generated/kubeadm_reset/kubeadm_reset_phase_remove-etcd-member.md" />}}
{{< /tabs >}}

## kubeadm reset phase cleanup-node {#cmd-reset-phase-cleanup-node}

За допомогою цієї фази ви можете виконати очищення на цьому вузлі.

{{< tabs name="tab-cleanup-node" >}}
{{< tab name="cleanup-node" include="generated/kubeadm_reset/kubeadm_reset_phase_cleanup-node.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для ініціалізації вузла панелі управління Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, внесених на цьому хості командами `kubeadm init` або `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
