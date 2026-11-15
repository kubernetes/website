---
title: Розширення для обчислень, сховища та мережі
weight: 30
no_list: true
---

Цей розділ охоплює розширення вашого кластера, які не входять до складу самого Kubernetes. Ви можете використовувати ці розширення, щоб покращити вузли у вашому кластері або надати мережеву інфраструктуру, яка зʼєднує Podʼи між собою.

* Втулки сховища [CSI](/docs/concepts/storage/volumes/#csi) та [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)

  Втулки {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) дають змогу розширити Kubernetes підтримкою нових типів томів. Томи можуть спиратися на надійне зовнішнє сховище, надавати тимчасове сховище або пропонувати інтерфейс лише для читання до інформації, використовуючи парадигму файлової системи.

  Kubernetes також містить підтримку втулків [FlexVolume](/docs/concepts/storage/volumes/#flexvolume), які застаріли з Kubernetes v1.23 (на користь CSI).

  Втулки FlexVolume дозволяють користувачам монтувати типи томів, які Kubernetes не підтримує нативно. Коли ви запускаєте Pod, який залежить від сховища FlexVolume, kubelet викликає бінарний втулок для монтування тому. Більше подробиць про цей підхід є в архівній [проєктній пропозиції FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md).

  [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors) містить загальну інформацію про втулки сховища.

* [Втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Втулки пристроїв дозволяють вузлу виявляти нові можливості вузла (на додаток до вбудованих ресурсів вузла, таких як `cpu` та `memory`) і надавати ці власні локальні можливості вузла Podʼам, які їх запитують.

* [Мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  Мережеві втулки дозволяють Kubernetes працювати з різними мережевими топологіями та технологіями. Вашому кластеру Kubernetes потрібен _мережевий втулок_, щоб мати робочу мережу Podʼів і підтримувати інші аспекти мережевої моделі Kubernetes.

  Kubernetes {{< skew currentVersion >}} сумісний із мережевими втулками {{< glossary_tooltip text="CNI" term_id="cni" >}}.
