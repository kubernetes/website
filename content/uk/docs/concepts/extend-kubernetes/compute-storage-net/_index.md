---
title: Розширення обчислення, зберігання та мережі
weight: 30
no_list: true
---

Цей розділ охоплює розширення вашого кластера, які не входять до складу Kubernetes. Ви можете використовувати ці розширення для розширення функціональності вузлів у вашому кластері або для створення основи для мережі, яка зʼєднує Podʼи.

* Втулки зберігання [CSI](/docs/concepts/storage/volumes/#csi) та [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)
  
  Втулки {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) надають можливість розширити Kubernetes підтримкою нових типів томів. Томи можуть спиратись на надійні зовнішні сховища, або надавати тимчасові сховища, або можуть надавати доступ до інформації лише для читання використовуючи парадигму файлової системи.

  Kubernetes також включає підтримку втулків [FlexVolume](/docs/concepts/storage/volumes/#flexvolume), які є застарілими з моменту випуску Kubernetes v1.23 (використовуйте CSI замість них).

  Втулки FlexVolume дозволяють користувачам монтувати типи томів, які не підтримуються нативно Kubernetes. При запуску Pod, який залежить від сховища FlexVolume, kubelet викликає бінарний втулок для монтування тому. В заархівованій [пропозиції про дизайн FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md) є більше деталей щодо цього підходу.

  [Kubernetes Volume Plugin FAQ для постачальників зберігання](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors) містить загальну інформацію про втулки зберігання.

* [Втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Втулки пристроїв дозволяють вузлу виявляти нові можливості Node (на додаток до вбудованих ресурсів вузла, таких як `cpu` та `memory`) та надавати ці додаткові локальні можливості вузла для Podʼів, які їх запитують.

* [Втулки мережі](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  Втулки мережі дозволяють Kubernetes працювати з різними топологіями та технологіями мереж. Вашому кластеру Kubernetes потрібен _втулок мережі_ для того, щоб мати працюючу мережу для Podʼів та підтримувати інші аспекти мережевої моделі Kubernetes.

  Kubernetes {{< skew currentVersion >}} сумісний з втулками {{< glossary_tooltip text="CNI" term_id="cni" >}} мережі.
