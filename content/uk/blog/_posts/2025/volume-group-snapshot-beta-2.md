---
layout: blog
title: "Kubernetes v1.34: Перехід Volume Group Snapshots на v1beta2"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Volume group snapshots було [представлено](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/) як альфа-можливість у випуску Kubernetes 1.27, а у випуску Kubernetes 1.32 вони перейшли в [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/). Останній випуск Kubernetes v1.34 переніс цю підтримку на другий бета-етап. Підтримка знімків групи томів спирається на набір [додаткових API для групових знімків](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis). Ці API дозволяють користувачам робити знімки набору томів, узгоджені на момент збою. За лаштунками Kubernetes використовує селектор міток для групування кількох PersistentVolumeClaims для знімків. Основна мета полягає в тому, щоб дозволити вам відновити цей набір знімків на нові томи та відновити ваше робоче навантаження на основі точки відновлення, узгодженої на момент збою.

Ця нова можливість підтримується лише для [CSI](https://kubernetes-csi.github.io/docs/) драйверів томів.

## Що нового в Beta 2? {#what-s-new-in-beta-2}

Під час тестування бета-версії ми зіткнулися з [проблемою](https://github.com/kubernetes-csi/external-snapshotter/issues/1271), коли поле `restoreSize` не встановлюється для окремих VolumeSnapshotContents і VolumeSnapshots, якщо драйвер CSI не реалізує виклик RPC ListSnapshots. Ми оцінили різні варіанти [тут](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0) і вирішили внести цю зміну, випустивши нову бета-версію для API.

Конкретно, у v1beta2 додано структуру VolumeSnapshotInfo, яка містить інформацію про окремий знімок тома, що є членом знімка групи томів. VolumeSnapshotInfoList, список VolumeSnapshotInfo, додано до VolumeGroupSnapshotContentStatus, замінюючи VolumeSnapshotHandlePairList. VolumeSnapshotInfoList — це список інформації про знімки, повернутий драйвером CSI для ідентифікації знімків у системі зберігання. VolumeSnapshotInfoList заповнюється sidecar-контейнером csi-snapshotter на основі відповіді CSI CreateVolumeGroupSnapshotResponse, поверненої викликом CreateVolumeGroupSnapshot драйвера CSI.

Наявні обʼєкти API v1beta1 будуть перетворені на нові обʼєкти API v1beta2 за допомогою вебхука перетворення.

## Що далі? {#what-s-next}

Залежно від відгуків та впровадження, проєкт Kubernetes планує перенести реалізацію знімків групи томів у загальну доступність (GA) у майбутньому випуску.

## Як дізнатися більше? {#how-can-i-learn-more}

- [Дизайн-специфікація](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  для можливості знімків групи томів.
- [Репозиторій коду](https://github.com/kubernetes-csi/external-snapshotter) для API знімків групи томів
  та контролера.
- CSI [документація](https://kubernetes-csi.github.io/docs/) про можливість знімків групи.

## Як взяти участь? {#how-do-i-get-involved}

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

Ми також проводимо регулярні [зустрічі Data Protection Working Group](https://github.com/kubernetes/community/tree/master/wg-data-protection). Нові учасники завжди можуть приєднатися до наших обговорень.
