---
title: kubeadm upgrade phase
weight: 40
content_type: concept
---

## kubeadm upgrade apply phase {#cmd-apply-phase}

За допомогою фаз `kubeadm upgrade apply` ви можете вибрати виконання окремих кроків початкового оновлення вузла панелі управління.

{{< tabs name="tab-apply-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_control-plane.md" />}}
{{< tab name="upload-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_upload-config.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_kubelet-config.md" />}}
{{< tab name="bootstrap-token" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_bootstrap-token.md" />}}
{{< tab name="addon" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_addon.md" />}}
{{< tab name="post-upgrade" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_post-upgrade.md" />}}
{{< /tabs >}}

## kubeadm upgrade node phase {#cmd-node-phase}

За допомогою фаз `kubeadm upgrade node` ви можете вибрати окремі кроки оновлення вторинної панелі управління або робочих вузлів.

{{< tabs name="tab-upgrade-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< tab name="addon" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_addon.md" />}}
{{< tab name="post-upgrade" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_post-upgrade.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для завантаження вузла керування Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, зроблених за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) для оновлення вузла kubeadm
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
