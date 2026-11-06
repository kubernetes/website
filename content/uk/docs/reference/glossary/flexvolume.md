---
title: FlexVolume
id: flexvolume
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume — це застарілий інтерфейс для створення зовнішніх (out-of-tree) втулків томів. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} — це новіший інтерфейс, який вирішує кілька проблем з FlexVolume.

aka:
tags:
- storage
---

FlexVolume — це застарілий інтерфейс для створення зовнішніх (out-of-tree) втулків томів. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} — це новіший інтерфейс, який вирішує кілька проблем з FlexVolume.

<!--more-->

FlexVolumes дозволяють користувачам писати свої власні драйвери та додавати підтримку своїх томів в Kubernetes. Бінарні файли та залежності драйверів FlexVolume повинні бути встановлені на машинах-хостах. Для цього потрібні права root. SIG Storage рекомендує за можливості реалізувати драйвер {{< glossary_tooltip text="CSI" term_id="csi" >}}, оскільки він вирішує обмеження, повʼязані з FlexVolumes.

* [FlexVolume в документації Kubernetes](/docs/concepts/storage/volumes/#flexvolume)
* [Додаткова інформація про FlexVolumes](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-storage/flexvolume.md)
* [Часті запитання про втулки томів для постачальників сховищ](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md)
