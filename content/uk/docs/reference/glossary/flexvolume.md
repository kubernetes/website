---
title: FlexVolume
id: flexvolume
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume — інтерфейс, зараз визнаний застарілим, для створення втулків зовнішніх томів. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} – це новіший інтерфейс, який вирішує кілька проблем з FlexVolume.

aka:
tags:
- storage
---

FlexVolume — інтерфейс, зараз визнаний застарілим, для створення втулків зовнішніх томів. {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} — це новіший інтерфейс, який вирішує кілька проблем з FlexVolume.

<!--more-->

FlexVolumes дозволяють користувачам писати свої власні драйвери та додавати підтримку своїх томів в Kubernetes. Бінарні файли та залежності драйверів FlexVolume повинні бути встановлені на машинах-хостах. Це вимагає прав адміністратора. Група Storage SIG рекомендує використовувати {{< glossary_tooltip text="CSI" term_id="csi" >}} драйвер, якщо це можливо, оскільки він вирішує обмеження, повʼязані з FlexVolumes.

* [FlexVolume в документації Kubernetes](/docs/concepts/storage/volumes/#flexvolume)
* [Додаткова інформація про FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [ЧаПи про втулки роботи з томами в Kubernetes для постачальників рішень](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
