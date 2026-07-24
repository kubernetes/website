---
title: Моніторинг справності томів
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

Моніторинг справності томів {{< glossary_tooltip text="CSI" term_id="csi" >}} дозволяє драйверам CSI виявляти ненормальні умови тому у підлеглих систем збереження та повідомляти про них як події у {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} або {{< glossary_tooltip text="Podʼи" term_id="pod" >}}.

<!-- body -->

## Моніторинг справності томів {#volume-health-monitoring}

Моніторинг справності томів Kubernetes є частиною того, як Kubernetes реалізує Container Storage Interface (CSI). Функція моніторингу справності томів реалізована у двох компонентах: контролері зовнішнього монітора справності та {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}.

Якщо драйвер CSI підтримує функцію моніторингу справності томів зі сторони контролера, подія буде повідомлена у відповідний {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC) при виявленні ненормальної умови тому CSI.

Зовнішній {{< glossary_tooltip text="контролер" term_id="controller" >}} монітора справності також слідкує за подіями відмови вузла. Ви можете увімкнути моніторинг відмови вузла, встановивши прапорець `enable-node-watcher` в значення true. Коли зовнішній монітор справності виявляє подію відмови вузла, контролер повідомляє про подію PVC, щоб вказати, що Podʼи, які використовують цей PVC, розташовані на несправних вузлах.

Якщо драйвер CSI підтримує функцію моніторингу справності томів зі сторони вузла, подія буде повідомлена на кожному Pod, який використовує PVC, при виявленні ненормальної умови тому CSI. Крім того, інформація про справність томів викладена у вигляді метрик Kubelet VolumeStats. Додано нову метрику kubelet_volume_stats_health_status_abnormal. Ця метрика має дві мітки: `namespace` та `persistentvolumeclaim`. Лічильник приймає значення 1 або 0. 1 вказує на те, що том є несправним, 0 вказує на те, що том — справний. Докладніше див. у [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes).

{{< note >}}
Вам потрібно увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` для використання цієї функції зі сторони вузла.
{{< /note >}}

## {{% heading "whatsnext" %}}

Див. [документацію драйвера CSI](https://kubernetes-csi.github.io/docs/drivers.html), щоб дізнатися, які драйвери CSI реалізували цю функцію.
