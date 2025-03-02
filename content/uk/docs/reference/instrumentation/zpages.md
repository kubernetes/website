---
title: Kubernetes z-pages
content_type: reference
weight: 60
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}

Компоненти ядра Kubernetes можуть надавати набір _z-endpoints_, щоб полегшити користувачам налагодження кластера та його компонентів. Ці точки доступу мають використовуватися виключно для перевірки людиною для отримання інформації про налагодження двійкового коду компонента у реальному часі. Уникайте автоматичного отримання даних, що повертаються цими точками доступу; у Kubernetes {{< skew currentVersion >}} це **альфа** функція, і формат відповіді може змінитися у майбутніх випусках.

<!-- body -->

## z-pages

Kubernetes v{{< skew currentVersion >}} дозволяє увімкнути _z-pages_, які допоможуть вам усунути проблеми з компонентами основної панелі управління. Ці спеціальні налагоджувальні точки доступу надають внутрішню інформацію про запущені компоненти. У Kubernetes {{< skew currentVersion >}} компоненти обслуговують такі точки доступу (якщо їх увімкнено):

- [z-pages](#z-pages)
  - [statusz](#statusz)
  - [flagz](#flagz)

### statusz

Увімкнена за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `ComponentStatusz`, точка доступу `/statusz` показує високорівневу інформацію про компонент, таку як версія Kubernetes, версія емуляції, час запуску тощо.

Відповідь `/statusz` від сервера API схожа на:

```console
kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.32.0-alpha.0.1484&#43;5eeac4f21a491b-dirty
Emulation version: 1.32.0-alpha.0.1484
```

### flagz

Увімкнена за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `ComponentFlagz`, точка доступу `/flagz` показує вам аргументи командного рядка, які було використано для запуску компонента.

Дані `/flagz` для сервера API виглядають приблизно так:

```console
kube-apiserver flags
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

advertise-address=192.168.8.2
contention-profiling=false
enable-priority-and-fairness=true
profiling=true
authorization-mode=[Node,RBAC]
authorization-webhook-cache-authorized-ttl=5m0s
authorization-webhook-cache-unauthorized-ttl=30s
authorization-webhook-version=v1beta1
default-watch-cache-size=100
```
