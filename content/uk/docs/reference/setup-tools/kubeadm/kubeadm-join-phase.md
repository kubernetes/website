---
title: kubeadm join phase
weight: 90
content_type: concept
---

`kubeadm join phase` дозволяє викликати атомарні кроки процесу приєднання. Таким чином, ви можете дозволити kubeadm виконати частину роботи, а ви заповните прогалини, якщо захочете застосувати налаштування.

`kubeadm join phase` узгоджується з [workflow приєднання kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-join/#join-workflow), і за лаштунками обидва використовують той самий код.

## kubeadm join phase {#cmd-join-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_join/kubeadm_join_phase.md" />}}
{{< /tabs >}}

## kubeadm join phase preflight {#cmd-join-phase-preflight}

Використовуючи цю фазу, ви можете виконати передпольотну перевірку вузла, що приєднується.

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_join/kubeadm_join_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-prepare {#cmd-join-phase-control-plane-prepare}

Використовуючи цю фазу, ви можете підготувати вузол до обслуговування панелі управління.

{{< tabs name="tab-control-plane-prepare" >}}
{{< tab name="control-plane-prepare" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare.md" />}}
{{< tab name="all" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare_all.md" />}}
{{< tab name="download-certs" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare_download-certs.md" />}}
{{< tab name="certs" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare_certs.md" />}}
{{< tab name="kubeconfig" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare_kubeconfig.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-prepare_control-plane.md" />}}
{{< /tabs >}}

## kubeadm join phase kubelet-start {#cmd-join-phase-kubelet-start}

На цьому етапі ви можете записати налаштування kubelet, сертифікати та (пере)запустити kubelet.

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_join/kubeadm_join_phase_kubelet-start.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-join {#cmd-join-phase-control-plane-join}

Використовуючи цю фазу, ви можете приєднати вузол як екземпляр панелі управління.

{{< tabs name="tab-control-plane-join" >}}
{{< tab name="control-plane-join" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-join.md" />}}
{{< tab name="all" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-join_all.md" />}}
{{< tab name="etcd" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-join_etcd.md" />}}
{{< tab name="mark-control-plane" include="generated/kubeadm_join/kubeadm_join_phase_control-plane-join_mark-control-plane.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для завантаження вузла керування Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, зроблених за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
