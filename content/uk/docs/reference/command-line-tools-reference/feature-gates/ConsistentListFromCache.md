---
title: ConsistentListFromCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"

---
Покращує продуктивність API сервера Kubernetes, обслуговуючи узгоджені запити **list** безпосередньо з кешу спостереження, що підвищує масштабованість та скорочує час відгуку. Для узгодженого списку з кешу Kubernetes потрібна новіша версія etcd (v3.4.31+ або v3.5.13+), яка містить виправлення для функції запиту на прогрес спостереження. Якщо надана стара версія etcd, Kubernetes автоматично визначить це і повернеться до обслуговування узгоджених читань з etcd. Сповіщення про прогрес забезпечують узгодженість кешу спостереження з etcd, одночасно зменшуючи потребу у витратних читаннях кворуму з etcd.

Детальніше дивіться у документації Kubernetes про [Семантику для **get** і **list**](/docs/reference/using-api/api-concepts/#semantics-for-get-and-list).
