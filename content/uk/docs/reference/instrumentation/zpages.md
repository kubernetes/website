---
title: Kubernetes z-pages
content_type: reference
weight: 60
description: >-
  Забезпечують діагностику під час роботи компонентів Kubernetes, надаючи інформацію про стан роботи компонентів та прапорці конфігурації.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.36" state="beta" >}}

Компоненти ядра Kubernetes можуть надавати набір _z-endpoints_, щоб полегшити користувачам налагодження кластера та його компонентів. Ці точки доступу мають використовуватися виключно для перевірки людиною для отримання інформації про налагодження бінарного файлу компонента у реальному часі. У Kubernetes {{< skew currentVersion >}} це **бета** можливості.

<!-- body -->

## z-pages

Kubernetes v{{< skew currentVersion >}} дозволяє увімкнути _z-pages_, які допоможуть вам усунути проблеми з компонентами основної панелі управління. Ці спеціальні налагоджувальні точки доступу надають внутрішню інформацію про запущені компоненти. У Kubernetes {{< skew currentVersion >}} компоненти обслуговують такі точки доступу (якщо їх увімкнено):

- [z-pages](#z-pages)
  - [statusz](#statusz)
    - [statusz (структуровано)](#statusz-structured)
  - [flagz](#flagz)
    - [flagz (структуровано)](#flagz-structured)

### statusz

Увімкнена за допомогою функціональної можливості [`ComponentStatusz`](/docs/reference/command-line-tools-reference/feature-gates/#ComponentStatusz), точка доступу `/statusz` показує високорівневу інформацію про компонент, таку як версія Kubernetes, версія емуляції, час запуску тощо.

Відповідь у вигляді простого тексту `/statusz` від API-сервера виглядає приблизно так:

```
kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.32.0-alpha.0.1484&#43;5eeac4f21a491b-dirty
Emulation version: 1.32.0-alpha.0.1484
Paths: /healthz /livez /metrics /readyz /statusz /version
```

#### statusz (структуровано) {#statusz-structured}

{{< feature-state feature_gate_name="ComponentStatusz" >}}

Починаючи з Kubernetes v1.35, точка доступу `/statusz` підтримує структурований формат відповіді з версіями, якщо запит надсилається з відповідним заголовком `Accept`. Без заголовка `Accept` точка доступу типово повертає відповідь у форматі простого тексту.

Щоб отримати структуровану відповідь, використовуйте:

```
Accept: application/json;v=v1beta1;g=config.k8s.io;as=Statusz
```

{{< note >}}
Якщо ви запитуєте `application/json` без вказання всіх необхідних параметрів (`g`, `v` та `as`), сервер відповість `406 Not Acceptable`.
{{< /note >}}

Приклад структурованої відповіді:

```json
{
  "kind": "Statusz",
  "apiVersion": "config.k8s.io/v1beta1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "startTime": "2025-10-29T00:30:01Z",
  "uptimeSeconds": 856,
  "goVersion": "go1.23.2",
  "binaryVersion": "1.35.0",
  "emulationVersion": "1.35",
  "paths": [
    "/healthz",
    "/livez",
    "/metrics",
    "/readyz",
    "/statusz",
    "/version"
  ]
}
```

Схема `config.k8s.io/v1beta1` для структурованої відповіді `/statusz` така:

```go
// Statusz is the config.k8s.io/v1beta1 schema for the /statusz endpoint.
type Statusz struct {
	// Kind is "Statusz".
	Kind string `json:"kind"`
	// APIVersion is the version of the object, e.g., "config.k8s.io/v1beta1".
	APIVersion string `json:"apiVersion"`
	// Standard object's metadata.
	// +optional
	Metadata metav1.ObjectMeta `json:"metadata,omitempty"`
	// StartTime is the time the component process was initiated.
	StartTime metav1.Time `json:"startTime"`
	// UptimeSeconds is the duration in seconds for which the component has been running continuously.
	UptimeSeconds int64 `json:"uptimeSeconds"`
	// GoVersion is the version of the Go programming language used to build the binary.
	// The format is not guaranteed to be consistent across different Go builds.
	// +optional
	GoVersion string `json:"goVersion,omitempty"`
	// BinaryVersion is the version of the component's binary.
	// The format is not guaranteed to be semantic versioning and may be an arbitrary string.
	BinaryVersion string `json:"binaryVersion"`
	// EmulationVersion is the Kubernetes API version which this component is emulating.
	// if present, formatted as "<major>.<minor>"
	// +optional
	EmulationVersion string `json:"emulationVersion,omitempty"`
	// MinimumCompatibilityVersion is the minimum Kubernetes API version with which the component is designed to work.
	// if present, formatted as "<major>.<minor>"
	// +optional
	MinimumCompatibilityVersion string `json:"minimumCompatibilityVersion,omitempty"`
	// Paths contains relative URLs to other essential read-only endpoints for debugging and troubleshooting.
	// +optional
	Paths []string `json:"paths,omitempty"`
}
```

### flagz

Увімкнена за допомогою функціональної можливості [`ComponentFlagz`](/docs/reference/command-line-tools-reference/feature-gates/#ComponentFlagz), точка доступу `/flagz` показує вам аргументи командного рядка, які було використано для запуску компонента.

{{< note >}}
`/flagz` повідомляє прапорці командного рядка та типові значення. Для компонентів, які також завантажують файли конфігурації, такі як kubelet та kube-proxy, фактична робоча конфігурація може відрізнятися від `/flagz`; використовуйте `/configz`, де це доступно, щоб перевірити обʼєднану конфігурацію компонента.
{{< /note >}}

Відповідь у вигляді простого тексту `/flagz` від API-сервера виглядає приблизно так:

```
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

#### flagz (структуровано) {#flagz-structured}

{{< feature-state feature_gate_name="ComponentFlagz" >}}

Починаючи з Kubernetes v1.35, точка доступу `/flagz` підтримує структурований формат відповіді з версіями, якщо запит надсилається з відповідним заголовком `Accept`. Без заголовка `Accept` точка доступу типово повертає відповідь у форматі простого тексту.

Щоб отримати структуровану відповідь, використовуйте:

```
Accept: application/json;v=v1beta1;g=config.k8s.io;as=Flagz
```

{{< note >}}
Якщо ви запитуєте `application/json` без вказання всіх необхідних параметрів (`g`, `v` та `as`), сервер відповість `406 Not Acceptable`.
{{< /note >}}

Приклад структурованої відповіді:

```json
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1beta1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "flags": {
    "advertise-address": "192.168.8.4",
    "allow-privileged": "true",
    "anonymous-auth": "true",
    "authorization-mode": "[Node,RBAC]",
    "enable-priority-and-fairness": "true",
    "profiling": "true",
    "default-watch-cache-size": "100"
  }
}
```

Схема `config.k8s.io/v1beta1` для структурованої відповіді `/flagz` така:

```go
// Flagz is the config.k8s.io/v1beta1 schema for the /flagz endpoint.
type Flagz struct {
	// Kind is "Flagz".
	Kind string `json:"kind"`
	// APIVersion is the version of the object, e.g., "config.k8s.io/v1beta1".
	APIVersion string `json:"apiVersion"`
	// Standard object's metadata.
	// +optional
	Metadata metav1.ObjectMeta `json:"metadata,omitempty"`
	// Flags contains the command-line flags and their values.
	// The keys are the flag names and the values are the flag values,
	// possibly with confidential values redacted.
	// +optional
	Flags map[string]string `json:"flags,omitempty"`
}
```

{{< note >}}
Структуровані відповіді для `/statusz` та `/flagz` є бета-можливостями у версії 1.36. Вони призначені для надання машиночитаного виводу для інструментів налагодження та інтроспекції.
{{< /note >}}
