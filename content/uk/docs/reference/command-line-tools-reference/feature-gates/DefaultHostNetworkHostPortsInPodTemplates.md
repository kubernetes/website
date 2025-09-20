---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
Ця функціональна можливість керує моментом, коли стандартне значення для `.spec.containers[*].ports[*].hostPort` назначається для Podʼів, які використовують `hostNetwork: true`. Типовим з версії Kubernetes v1.28 є те, що стандартне значення встановлюється лише для Podʼів.

Вмикаючи цю функціональну можливість, стандартне значення буде назначено навіть для `.spec` вбудованого [PodTemplate](/docs/concepts/workloads/pods/#pod-templates) (наприклад, у Deployment), що є способом, яким працювали старі версії Kubernetes. Вам слід мігрувати свій код так, щоб він не залежав від старої поведінки.
