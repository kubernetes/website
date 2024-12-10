---
title: kubeadm upgrade phase
weight: 90
content_type: concept
---

У версії v1.15.0 kubeadm запровадив попередню підтримку фаз `kubeadm upgrade node`. Фази для інших підкоманд `kubeadm upgrade`, таких як `apply`, можуть бути додані в наступних випусках.

## kubeadm upgrade node phase {#cmd-node-phase}

Використовуючи цю фазу, ви можете вибрати виконання окремих кроків оновлення вторинних вузлів панелі управління або робочих вузлів. Зверніть увагу, що `kubeadm upgrade apply` все ще потрібно викликати на первинному вузлі панелі управління.

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/uk/docs/reference/setup-tools/kubeadm/kubeadm-init/) для завантаження вузла керування Kubernetes
* [kubeadm join](/uk/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/uk/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, зроблених за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm upgrade](/uk/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) для оновлення вузла kubeadm
* [kubeadm alpha](/uk/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
