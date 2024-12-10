---
title: Менеджери ресурсів вузлів
content_type: concept
weight: 50
---

<!-- overview -->

Для підтримки критичних до затримки та високопродуктивних робочих навантажень Kubernetes пропонує набір менеджерів ресурсів. Менеджери прагнуть координувати та оптимізувати вирівнювання ресурсів вузла для Podʼів, налаштованих з конкретною вимогою до ресурсів процесорів, пристроїв та памʼяті (величезних сторінок).

<!-- body -->

Основний менеджер, Менеджер топології, є складовою частиною Kubelet, який координує загальний процес управління ресурсами через свою [політику](/uk/docs/tasks/administer-cluster/topology-manager/).

Конфігурація окремих менеджерів розглянута у відповідних документах:

- [Менеджера політик CPU](/uk/docs/tasks/administer-cluster/cpu-management-policies/)
- [Менеджер пристроїв](/uk/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [Менеджера політик памʼяті](/uk/docs/tasks/administer-cluster/memory-manager/)
