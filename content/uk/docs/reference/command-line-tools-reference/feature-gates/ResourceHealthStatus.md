---
title: ResourceHealthStatus
content_type: feature_gate
build:
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

Вмикає поле `allocatedResourcesStatus` у файлі `.status` для Pod. У полі буде показано додаткові відомості для кожного контейнера у Pod, а також інформацію про стан кожного пристрою, призначеного для Pod.

Починаючи з v1.36 (beta), звіт про стан включає необовʼязкове поле `message`, яке надає додатковий контекст у зрозумілій для людини формі про стан справності, наприклад, деталі помилок або причини відмови.

Функціональна можливість застосовується до пристроїв, які керуються як [втулками пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices), так і [динамічним розподілом ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring). Див. [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) для отримання додаткової інформації.
