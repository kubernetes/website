---
content_type: "reference"
title: Обʼєднання конфігураційних тек Kubelet
weight: 50
---

Коли використовується прапорець kubelet `--config-dir` для вказівки теки для конфігурації, існує певна специфічна поведінка для обʼєднання різних типів.

Ось кілька прикладів того, як різні типи даних поводяться під час обʼєднання конфігурації:

### Поля структур {#structure-fields}

У YAML структурі є два типи полів структури: одиничні (або скалярні типи) та вбудовані (структури, що містять скалярні типи). Процес обʼєднання конфігурацій обробляє заміну одиничних та вбудованих полів структур для створення кінцевої конфігурації kubelet.

Наприклад, ви можете хотіти мати базову конфігурацію kubelet для всіх вузлів, але налаштувати поля `address` і `authorization`. Це можна зробити наступним чином:

Зміст основного файлу конфігурації kubelet:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: "5m"
    cacheUnauthorizedTTL: "30s"
serializeImagePulls: false
address: "192.168.0.1"
```

Зміст файлу у теці `--config-dir`:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authorization:
  mode: AlwaysAllow
  webhook:
    cacheAuthorizedTTL: "8m"
    cacheUnauthorizedTTL: "45s"
address: "192.168.0.8"
```

Кінцева конфігурація буде виглядати наступним чином:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
authorization:
  mode: AlwaysAllow
  webhook:
    cacheAuthorizedTTL: "8m"
    cacheUnauthorizedTTL: "45s"
address: "192.168.0.8"
```

### Списки {#lists}

Ви можете замінити значення списків конфігурації kubelet. Однак весь список буде замінений під час процесу обʼєднання. Наприклад, ви можете замінити список `clusterDNS` наступним чином:

Зміст основного файлу конфігурації kubelet:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
clusterDNS:
  - "192.168.0.9"
  - "192.168.0.8"
```

Зміст файлу у теці `--config-dir`:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
  - "192.168.0.2"
  - "192.168.0.3"
  - "192.168.0.5"
```

Кінцева конфігурація буде виглядати наступним чином:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
clusterDNS:
  - "192.168.0.2"
  - "192.168.0.3"
  - "192.168.0.5"
```

### Map, включаючи вкладені структури {#maps-including-nested-structures}

Індивідуальні поля в map, незалежно від їх типів значень (булеві, рядкові тощо), можуть бути вибірково замінені. Однак для `map[string][]string` весь список, повʼязаний з певним полем, буде замінений. Розглянемо це детальніше на прикладі, зокрема для таких полів, як `featureGates` і `staticPodURLHeader`:

Зміст основного файлу конфігурації kubelet:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
featureGates:
  AllAlpha: false
  MemoryQoS: true
staticPodURLHeader:
  kubelet-api-support:
  - "Authorization: 234APSDFA"
  - "X-Custom-Header: 123"
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 456"
```

Зміст файлу у теці `--config-dir`:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: false
  KubeletTracing: true
  DynamicResourceAllocation: true
staticPodURLHeader:
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 345"
```

Кінцева конфігурація буде виглядати наступним чином:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
featureGates:
  AllAlpha: false
  MemoryQoS: false
  KubeletTracing: true
  DynamicResourceAllocation: true
staticPodURLHeader:
  kubelet-api-support:
  - "Authorization: 234APSDFA"
  - "X-Custom-Header: 123"
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 345"
```
