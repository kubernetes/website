---
title: DRAAdminAccess
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає підтримку запиту [доступу адміністратора](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access) у ResourceClaim або ResourceClaimTemplate. Доступ адміністратора надає доступ до використовуваних пристроїв і може включати додаткові дозволи, коли пристрій стає доступним у контейнері. Починаючи з Kubernetes v1.33, лише користувачі, яким дозволено створювати обʼєкти ResourceClaim або ResourceClaimTemplate у просторах імен, позначених `resource.kubernetes.io/admin-access: “true"` (з урахуванням регістру) можуть використовувати поле `adminAccess`. Це гарантує, що користувачі, які не мають прав адміністратора, не зможуть зловживати функцією. Починаючи з Kubernetes v1.34, цю мітку було оновлено на `resource.kubernetes.io/admin-access: "true"`.
