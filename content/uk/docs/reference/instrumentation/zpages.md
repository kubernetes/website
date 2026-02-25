---
title: Kubernetes z-pages
content_type: reference
weight: 60
description: >-
  Забезпечують діагностику під час роботи компонентів Kubernetes, надаючи інформацію про стан роботи компонентів та прапорці конфігурації.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}

Компоненти ядра Kubernetes можуть надавати набір _z-endpoints_, щоб полегшити користувачам налагодження кластера та його компонентів. Ці точки доступу мають використовуватися виключно для перевірки людиною для отримання інформації про налагодження двійкового коду компонента у реальному часі. Уникайте автоматичного отримання даних, що повертаються цими точками доступу; у Kubernetes {{< skew currentVersion >}} це **альфа** функція, і формат відповіді може змінитися у майбутніх випусках.

<!-- body -->

## z-pages

Kubernetes v{{< skew currentVersion >}} дозволяє увімкнути _z-pages_, які допоможуть вам усунути проблеми з компонентами основної панелі управління. Ці спеціальні налагоджувальні точки доступу надають внутрішню інформацію про запущені компоненти. У Kubernetes {{< skew currentVersion >}} компоненти обслуговують такі точки доступу (якщо їх увімкнено):

- [z-pages](#z-pages)
	- [statusz](#statusz)
		- [statusz (структуровано)](#statusz-structured)
	- [flagz](#flagz)
		- [flagz (структуровано)](#flagz-structured)

### statusz

Увімкнена за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates#ComponentStatusz) `ComponentStatusz`, точка доступу `/statusz` показує високорівневу інформацію про компонент, таку як версія Kubernetes, версія емуляції, час запуску тощо.

Відповідь у вигляді простого тексту `/statusz` від сервера API виглядає приблизно так:

```console
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

```html
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz
```

{{< note >}}
Якщо ви запитуєте `application/json` без вказання всіх необхідних параметрів (`g`, `v` та `as`), сервер відповість `406 Not Acceptable`.
{{< /note >}}

Приклад структурованої відповіді:

```json
{
  "kind": "Statusz",
  "apiVersion": "config.k8s.io/v1alpha1",
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

Схема `config.k8s.io/v1alpha1` для структурованої відповіді `/statusz` виглядає наступним чином:

```go
// Statusz — це схема config.k8s.io/v1alpha1 для точки доступу /statusz.
type Statusz struct {
	// Kind є "Statusz".
	Kind string `json:"kind"`
	// APIVersion — це версія обʼєкта, наприклад, "config.k8s.io/v1alpha1".
	APIVersion string `json:"apiVersion"`
	// Стандартні метадані обʼєкта.
	// +опціонально
	Metadata metav1.ObjectMeta `json:"metadata,omitempty"`
	// StartTime — час, коли було розпочато процес компонента.
	StartTime metav1.Time `json:"startTime"`
	// UptimeSeconds — це тривалість у секундах, протягом якої компонент працював безперервно.
	UptimeSeconds int64 `json:"uptimeSeconds"`
	// GoVersion — це версія мови програмування Go, яка використовується для створення бінарного файлу.
	// Не гарантується, що формат буде однаковим для різних збірок Go.
	// +опціонально
	GoVersion string `json:"goVersion,omitempty"`
	// BinaryVersion — це версія бінарного файлу компонента.
	// Формат не обовʼязково відповідає семантичному версіонуванню і може бути довільним рядком.
	BinaryVersion string `json:"binaryVersion"`
	// EmulationVersion — це версія API Kubernetes, яку емулює цей компонент.
	// якщо присутня, форматується як "<major>.<minor>"
	// +опціонально
	EmulationVersion string `json:"emulationVersion,omitempty"`
	// MinimumCompatibilityVersion — це мінімальна версія API Kubernetes, з якою компонент призначений для роботи.
	// якщо присутня, форматується як "<major>.<minor>"
	// +опціонально
	MinimumCompatibilityVersion string `json:"minimumCompatibilityVersion,omitempty"`
	// Шляхи містять відносні URL-адреси інших важливих точок доступу, доступних тільки для читання, для налагодження та усунення несправностей.
	// +опціонально
	Paths []string `json:"paths,omitempty"`
}
```

### flagz

Увімкнена за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/#ComponentFlagz) `ComponentFlagz`, точка доступу `/flagz` показує вам аргументи командного рядка, які було використано для запуску компонента.

Відповідь у вигляді простого тексту `/flagz` від сервера API виглядає приблизно так:

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

#### flagz (структуровано) {#flagz-structured}

{{< feature-state feature_gate_name="ComponentFlagz" >}}

Починаючи з Kubernetes v1.35, точка доступу `/flagz` підтримує структурований формат відповіді з версіями, якщо запит надсилається з відповідним заголовком `Accept`. Без заголовка `Accept` точка доступу типово повертає відповідь у форматі простого тексту.

Щоб отримати структуровану відповідь, використовуйте:

```http
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz
```

{{< note >}}
Якщо ви запитуєте `application/json` без вказання всіх необхідних параметрів (`g`, `v` та `as`), сервер відповість `406 Not Acceptable`.
{{< /note >}}

Example structured response:

```json
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1alpha1",
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

Схема `config.k8s.io/v1alpha1` для структурованої відповіді `/flagz` виглядає наступним чином:

```go
// Flagz — це схема config.k8s.io/v1alpha1 для точки доступу /flagz.
type Flagz struct {
	// Kind ' "Flagz".
	Kind string `json:"kind"`
	// APIVersion — це версія обʼєкта, наприклад, "config.k8s.io/v1alpha1".
	APIVersion string `json:"apiVersion"`
	// Стандартні метадані обʼєкта.
	// +опціонально
	Metadata metav1.ObjectMeta `json:"metadata,omitempty"`
	// Flags містить прапорці командного рядка та їхні значення.
	// Ключі — це імена прапорців, а значення — це значення прапорців,
	// можливо, з вилученими конфіденційними значеннями.
	// +опціонально
	Flags map[string]string `json:"flags,omitempty"`
}
```

{{< note >}}
Структуровані відповіді для `/statusz` та `/flagz` є альфа-функціями у версії 1.35 і можуть бути змінені в майбутніх версіях. Вони призначені для надання машиночитаного виводу для інструментів налагодження та інтроспекції.
{{< /note >}}
