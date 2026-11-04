---
title: Container Storage Interface (CSI)
id: csi
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    Container Storage Interface (CSI) визначає стандартний інтерфейс, через який системи зберігання стають доступними контейнерам.

aka:
- CSI
tags:
- storage
---

Container Storage Interface (CSI) визначає стандартний інтерфейс, через який системи зберігання стають доступними контейнерам.

<!--more-->

CSI дозволяє постачальникам створювати власні втулки зберігання для Kubernetes, не додаючи їх до репозиторію Kubernetes (зовнішні втулки, out-of-tree). Щоб використовувати драйвер CSI від постачальника сховища, спочатку потрібно [розгорнути його у вашому кластері](https://kubernetes-csi.github.io/docs/deploying.html). Після цього ви зможете створити {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}}, який використовує цей драйвер CSI.

* [CSI в документації Kubernetes](/docs/concepts/storage/volumes/#csi)
* [Список доступних драйверів CSI](https://kubernetes-csi.github.io/docs/drivers.html)
