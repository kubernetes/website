---
title: ResourceHealthStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Вмикає поле `allocatedResourcesStatus` у `.status` Podʼа. У полі буде показано додаткові відомості для кожного контейнера у Podʼі, а також інформацію про стан кожного пристрою, призначеного для Podʼа.

Починаючи з v1.36 (beta), звіт про стан включає необовʼязкове поле `message`, яке надає додатковий контекст у зрозумілій для людини формі про стан справності, наприклад, деталі помилок або причини відмови.

Ця функція застосовується до пристроїв, які керуються як [втулками пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices), так і [динамічним виділенням ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-health-monitoring). Див. [Втулок пристроїв і несправні пристрої](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) для отримання додаткової інформації.
