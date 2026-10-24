---
title: Інтерфейс зберігання контейнерів (CSI)
id: csi
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    Інтерфейс зберігання контейнерів (CSI) визначає стандартний інтерфейс для взаємодії з системами зберігання з контейнерами.

aka:
- Container Storage Interface
- CSI
tags:
- storage
---

Інтерфейс зберігання контейнерів (CSI) визначає стандартний інтерфейс для взаємодії з системами зберігання з контейнерами.

<!--more-->

CSI дозволяє вендорам створювати спеціальні втулки зберігання для Kubernetes, не включаючи їх до репозиторію Kubernetes (зовнішні втулки). Щоб використовувати драйвер CSI від постачальника зберігання, спочатку потрібно [розгорнути його у вашому кластері](https://kubernetes-csi.github.io/docs/deploying.html). Після цього ви зможете створити [клас зберігання](/docs/concepts/storage/storage-classes/) (Storage Class), який використовує цей драйвер CSI.

* [CSI в документації Kubernetes](/docs/concepts/storage/volumes/#csi)
* [Список доступних драйверів CSI](https://kubernetes-csi.github.io/docs/drivers.html)
