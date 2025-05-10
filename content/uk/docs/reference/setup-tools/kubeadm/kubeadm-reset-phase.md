---
title: kubeadm reset phase
weight: 90
content_type: concept
---

`kubeadm reset phase` дозволяє вам викликати атомарні кроки процесу reset. Таким чином, ви можете дозволити kubeadm виконати частину роботи, а ви можете заповнити прогалини
якщо ви бажаєте застосувати кастомізацію.

`kubeadm reset phase` узгоджується з [kubeadm reset workflow](/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow), і за лаштунками обидва використовують той самий код.

## kubeadm reset phase {#cmd-reset-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_reset/kubeadm_reset_phase.md" />}}
{{< /tabs >}}

## kubeadm reset phase preflight {#cmd-reset-phase-preflight}

За допомогою цієї фази ви можете виконати передпольотну перевірку вузла, який скидається.

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

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для завантаження вузла керування Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, зроблених за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
