---
title: ServiceIPStaticSubrange
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"

removed: true
---
Вмикає стратегію розподілу службових кластерних IP-адрес, згідно з якою діапазон ClusterIP поділяється на частини. Динамічні адреси ClusterIP призначатимуться переважно з верхнього діапазону, що дасть змогу користувачам призначати статичні адреси ClusterIP з нижнього діапазону з низьким ризиком колізій. Докладніші відомості наведено у статті [Уникнення колізій](/docs/reference/networking/virtual-ips/#avoiding-collisions).
