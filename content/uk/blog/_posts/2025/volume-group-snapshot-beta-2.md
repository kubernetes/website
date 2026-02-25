---
layout: blog
title: "Kubernetes v1.34: Volume Group Snapshots переходить в v1beta2"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Volume group snapshots було [представлено](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/) як функцію Alpha у випуску Kubernetes 1.27, зміна у [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) — у випуску Kubernetes 1.32. Останній випуск Kubernetes v1.34 переніс цю підтримку на другий бета-етап. Підтримка знімків групи томів спирається на набір [додаткових API для групових знімків](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis). Ці API дозволяють користувачам робити знімки, що відповідають аварійним ситуаціям, для набору томів. За лаштунками Kubernetes використовує селектор міток для групування кількох PersistentVolumeClaims для знімків. Основна мета полягає в тому, щоб дозволити вам відновити цей набір знімків на нові томи та відновити вашу роботу на основі точки відновлення, що відповідає аварійним ситуаціям.

Ця нова функція підтримується лише для [CSI](https://kubernetes-csi.github.io/docs/) драйверів томів.

## Що нового в Beta 2?

Під час тестування бета-версії ми зіткнулися з [проблемою](https://github.com/kubernetes-csi/external-snapshotter/issues/1271), коли поле `restoreSize` не встановлюється для окремих VolumeSnapshotContents і VolumeSnapshots, якщо драйвер CSI не реалізує виклик RPC ListSnapshots. Ми оцінили різні варіанти [тут](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0) і вирішили внести цю зміну, випустивши нову бета-версію для API.

Конкретно, у v1beta2 додано структуру VolumeSnapshotInfo, яка містить інформацію про окремий знімок тома, що є членом знімка групи томів. VolumeSnapshotInfoList, список VolumeSnapshotInfo, додано до VolumeGroupSnapshotContentStatus, замінюючи VolumeSnapshotHandlePairList. VolumeSnapshotInfoList — це список інформації про знімки, повернутий драйвером CSI для ідентифікації знімків у системі зберігання. VolumeSnapshotInfoList заповнюється бічним контейнером csi-snapshotter на основі відповіді CSI CreateVolumeGroupSnapshotResponse, поверненої викликом CreateVolumeGroupSnapshot драйвера CSI.

Наявні обʼєкти API v1beta1 будуть перетворені на нові обʼєкти API v1beta2 за допомогою вебхука перетворення.

## Що далі?

Залежно від відгуків та впровадження, проєкт Kubernetes планує перенести реалізацію знімків групи томів у загальну доступність (GA) у майбутньому випуску.

## Як дізнатися більше?

* [Дизайн-специфікація](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  для функції знімків групи томів.
* [Репозиторій коду](https://github.com/kubernetes-csi/external-snapshotter) для API знімків групи томів
  та контролера.
* CSI [документація](https://kubernetes-csi.github.io/docs/) про функцію знімків групи.

## Як взяти участь?

Цей проєкт, як і весь Kubernetes, є результатом наполегливої роботи багатьох учасників з різним досвідом, які працюють разом. Від імені SIG Storage я хотів би висловити величезну подяку всім учасникам, які допомогли проєкту досягти бета-версії за останні кілька кварталів:

* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

Якщо ви зацікавлені взяти участь у проєктуванні та розробці CSI або будь-якої частини системи зберігання Kubernetes, приєднуйтесь до [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). Ми завжди раді новим учасникам.

Ми також проводимо регулярні [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection). Нові учасники завжди можуть приєднатися до наших обговорень.
