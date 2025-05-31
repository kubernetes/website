---
title: kubeadm init phase
weight: 90
content_type: concept
---

`kubeadm init phase` дозволяє вам викликати атомарні кроки процесу початкового завантаження. Таким чином, ви можете дозволити kubeadm виконати частину роботи, а ви можете заповнити прогалини якщо ви бажаєте застосувати кастомізацію.

`kubeadm init phase` узгоджується з [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow), і за лаштунками обидва використовують той самий код.

## kubeadm init phase preflight {#cmd-phase-preflight}

Використовуючи цю команду, ви можете виконати попередні перевірки на вузлі панелі управління.

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_init/kubeadm_init_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm init phase kubelet-start {#cmd-phase-kubelet-start}

Ця фаза створить файл конфігурації kubelet та файл оточення та запустить kubelet.

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_init/kubeadm_init_phase_kubelet-start.md" />}}
{{< /tabs >}}

## kubeadm init phase certs {#cmd-phase-certs}

Може використовуватися для створення всіх необхідних сертифікатів за допомогою kubeadm.

{{< tabs name="tab-certs" >}}
{{< tab name="certs" include="generated/kubeadm_init/kubeadm_init_phase_certs.md" />}}
{{< tab name="all" include="generated/kubeadm_init/kubeadm_init_phase_certs_all.md" />}}
{{< tab name="ca" include="generated/kubeadm_init/kubeadm_init_phase_certs_ca.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init/kubeadm_init_phase_certs_apiserver.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_init/kubeadm_init_phase_certs_apiserver-kubelet-client.md" />}}
{{< tab name="front-proxy-ca" include="generated/kubeadm_init/kubeadm_init_phase_certs_front-proxy-ca.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_init/kubeadm_init_phase_certs_front-proxy-client.md" />}}
{{< tab name="etcd-ca" include="generated/kubeadm_init/kubeadm_init_phase_certs_etcd-ca.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_init/kubeadm_init_phase_certs_etcd-server.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_init/kubeadm_init_phase_certs_etcd-peer.md" />}}
{{< tab name="healthcheck-client" include="generated/kubeadm_init/kubeadm_init_phase_certs_etcd-healthcheck-client.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_init/kubeadm_init_phase_certs_apiserver-etcd-client.md" />}}
{{< tab name="sa" include="generated/kubeadm_init/kubeadm_init_phase_certs_sa.md" />}}
{{< /tabs >}}

## kubeadm init phase kubeconfig {#cmd-phase-kubeconfig}

Ви можете створити всі необхідні файли kubeconfig за допомогою підкоманди `all` або викликати їх окремо.

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig.md" />}}
{{< tab name="all" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_all.md" />}}
{{< tab name="admin" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_admin.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_kubelet.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_scheduler.md" />}}
{{< tab name="super-admin" include="generated/kubeadm_init/kubeadm_init_phase_kubeconfig_super-admin.md" />}}
{{< /tabs >}}

## kubeadm init phase control-plane {#cmd-phase-control-plane}

Використовуючи цю фазу, ви можете створити всі необхідні файли статичних Podʼів для компонентів панелі управління.

{{< tabs name="tab-control-plane" >}}
{{< tab name="control-plane" include="generated/kubeadm_init/kubeadm_init_phase_control-plane.md" />}}
{{< tab name="all" include="generated/kubeadm_init/kubeadm_init_phase_control-plane_all.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init/kubeadm_init_phase_control-plane_apiserver.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init/kubeadm_init_phase_control-plane_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init/kubeadm_init_phase_control-plane_scheduler.md" />}}
{{< /tabs >}}

## kubeadm init phase etcd {#cmd-phase-etcd}

Використовуйте наступну фазу, щоб створити локальний екземпляр etcd на основі файлу статичного Pod.

{{< tabs name="tab-etcd" >}}
{{< tab name="etcd" include="generated/kubeadm_init/kubeadm_init_phase_etcd.md" />}}
{{< tab name="local" include="generated/kubeadm_init/kubeadm_init_phase_etcd_local.md" />}}
{{< /tabs >}}

## kubeadm init phase upload-config {#cmd-phase-upload-config}

За допомогою цієї команди ви можете завантажити конфігурацію kubeadm до вашого кластера. Також ви можете скористатися [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

{{< tabs name="upload-config" >}}
{{< tab name="upload-config" include="generated/kubeadm_init/kubeadm_init_phase_upload-config.md" />}}
{{< tab name="all" include="generated/kubeadm_init/kubeadm_init_phase_upload-config_all.md" />}}
{{< tab name="kubeadm" include="generated/kubeadm_init/kubeadm_init_phase_upload-config_kubeadm.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init/kubeadm_init_phase_upload-config_kubelet.md" />}}
{{< /tabs >}}

## kubeadm init phase upload-certs {#cmd-phase-upload-certs}

Використовуйте наступну фазу, щоб завантажити сертифікати панелі управління в кластер. Стандартно термін дії сертифікатів і ключа шифрування закінчується через дві години.

{{< tabs name="tab-upload-certs" >}}
{{< tab name="upload-certs" include="generated/kubeadm_init/kubeadm_init_phase_upload-certs.md" />}}
{{< /tabs >}}

## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}

Використовуйте наступну фазу для позначення вузла як вузла панелі управління.

{{< tabs name="tab-mark-control-plane" >}}
{{< tab name="mark-control-plane" include="generated/kubeadm_init/kubeadm_init_phase_mark-control-plane.md" />}}
{{< /tabs >}}

## kubeadm init phase bootstrap-token {#cmd-phase-bootstrap-token}

Використовуйте наступну фазу для створення або керування bootstrap токенів.

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="bootstrap-token" include="generated/kubeadm_init/kubeadm_init_phase_bootstrap-token.md" />}}
{{< /tabs >}}

## kubeadm init phase kubelet-finalize {#cmd-phase-kubelet-finalize-all}

Використовуйте наступну фазу для оновлення налаштувань, що стосуються kubelet після TLS bootstrap. Ви можете використовувати субкоманду `all`, щоб запустити всі фази `kubelet-finalize.

{{< tabs name="tab-kubelet-finalize" >}}
{{< tab name="kubelet-finalize" include="generated/kubeadm_init/kubeadm_init_phase_kubelet-finalize.md" />}}
{{< tab name="kubelet-finalize-all" include="generated/kubeadm_init/kubeadm_init_phase_kubelet-finalize_all.md" />}}
{{< tab name="kubelet-finalize-enable-client-cert-rotation" include="generated/kubeadm_init/kubeadm_init_phase_kubelet-finalize_enable-client-cert-rotation.md" />}}
{{< /tabs >}}

## kubeadm init phase addon {#cmd-phase-addon}

Ви можете встановити всі доступні надбудови за допомогою підкоманди `all`, або встановити їх вибірково.

{{< tabs name="tab-addon" >}}
{{< tab name="addon" include="generated/kubeadm_init/kubeadm_init_phase_addon.md" />}}
{{< tab name="all" include="generated/kubeadm_init/kubeadm_init_phase_addon_all.md" />}}
{{< tab name="coredns" include="generated/kubeadm_init/kubeadm_init_phase_addon_coredns.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_init/kubeadm_init_phase_addon_kube-proxy.md" />}}
{{< /tabs >}}

Для отримання більш детальної інформації про кожне поле в конфігурації `v1beta4` ви можете перейти на нашу [сторінки довідки API](/docs/reference/config-api/kubeadm-config.v1beta4/).

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для завантаження вузла керування Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, зроблених за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) для випробування експериментальних функцій
