---
title: Розуміння метрик Pressure Stall Information (PSI)
content_type: reference
weight: 50
description: >-
  Детальне пояснення метрик Pressure Stall Information (PSI) та їх використання для виявлення тиску на ресурси в Kubernetes.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

У вигляді бета-функції Kubernetes дозволяє налаштувати kubelet для збору інформації про тиск на ресурси в Linux [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) про використання CPU, памʼяті та вводу-виводу. Інформація збирається на рівні вузлів, podʼів та контейнерів. Ця функція є стандартно увімкненою через [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletPSI`.

Метрики PSI надаються через два різні джерела:

- [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/) kubelet, який надає дані PSI на рівні вузлів, podʼів та контейнерів.
- Точка доступу `/metrics/cadvisor` на kubelet, яка надає метрики PSI у [форматі Prometheus](/docs/concepts/cluster-administration/system-metrics#psi-metrics).

### Вимоги {#requirements}

Pressure Stall Information вимагає наступного на ваших вузлах Linux:

- Ядро Linux має бути версії **4.20 чи новіше**.
- Ядро має бути скомпільоване з параметром `CONFIG_PSI=y`. Що у більшість сучасних дистрибутивів є стандартно увімкненим. Ви можете перевірити конфігурацію вашого ядра, виконавши команду `zgrep CONFIG_PSI /proc/config.gz`.
- Деякі дистрибутиви Linux можуть скомпілювати PSI в ядро, але мати його стандартно вимкненим. Якщо це так, вам потрібно увімкнути його під час завантаження, додавши параметр `psi=1` до командного рядка ядра.
- Вузол має використовувати [cgroup v2](/docs/concepts/architecture/cgroups).

<!-- body -->

## Розуміння метрик PSI {#understanding-psi-metrics}

Метрики Pressure Stall Information (PSI) надаються для трьох ресурсів: CPU, памʼяті та вводу-виводу. Вони поділяються на два основних типи тиску: `some` та `full`.

*   **`some`**: Це значення вказує на те, що деякі завдання (одне або кілька) заблоковані на ресурсі. Наприклад, якщо деякі завдання чекають на ввід-вивід, ця метрика зросте. Це може бути раннім показником конкуренції за ресурси.
*   **`full`**: Це значення вказує на те, що *всі* не-очікувальні завдання заблоковані на ресурсі одночасно. Це свідчить про більш серйозний дефіцит ресурсів, коли вся система не може рухатись далі.

Кожен тип тиску надає чотири метрики: `avg10`, `avg60`, `avg300` та `total`. Значення `avg` представляють відсоток часу, протягом якого завдання були заблоковані за 10-секундними, 60-секундними та 5-хвилинними ковзаючими середніми. Значення `total` є кумулятивним лічильником в мікросекундах, що показує загальний час, протягом якого завдання були заблоковані.

## Приклад сценаріїв {#example-scenarios}

Ви можете використовувати простий Pod з інструментом для стрес-тестування, щоб згенерувати тиск на ресурси та спостерігати за метриками PSI. У наступних прикладах використовується образ контейнера `agnhost`, який включає інструмент `stress`.

### Генерація тиску на CPU {#generating-cpu-pressure}

Створіть Pod, який генерує тиск на CPU за допомогою утиліти `stress`. Це навантаження створить сильне навантаження на один CPU-ядро.

Створіть файл з назвою `cpu-pressure-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cpu-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: cpu-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    args:
    - "stress"
    - "--cpus"
    - "1"
    resources:
      limits:
        cpu: "500m"
      requests:
        cpu: "500m"
```

Застосуйте його до вашого кластера: `kubectl apply -f cpu-pressure-pod.yaml`

#### Спостереження за тиском на CPU {#observing-cpu-pressure}

Після запуску Podʼа ви можете спостерігати за тиском на CPU через Summary API або через точку моніторингу метрик Prometheus.

**Використовуючи Summary API:**

Спостерігайте за підсумковими статистиками для вашого вузла. У окремому терміналі виконайте:

```shell
# Замініть <node-name> на імʼя вузла у вашому кластері
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("cpu-pressure-pod"))'
```

Ви побачите, що метрики PSI `some` для CPU зростають у виводі Summary API. Значення `avg10` для тиску `some` повинно перевищити нуль, що вказує на те, що завдання витрачають час на блокування на CPU.

**Використовуючи точку моніторингу метрик Prometheus:**

Надіщліть запит до точки `/metrics/cadvisor`, щоб побачити метрику `container_pressure_cpu_waiting_seconds_total`.

```shell
# Замініть <node-name> на імʼя вузла, на якому працює Pod
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_cpu_waiting_seconds_total{container="cpu-stress"}'
```

Вихідні дані повинні показувати зростаюче значення, що вказує на те, що контейнер витрачає час на блокування в очікуванні ресурсів CPU.

#### Очищення {#cleanup}

Вилучіть Pod, коли закінчите:

```shell
kubectl delete pod cpu-pressure-pod
```

### Генерація тиску на памʼять {#generating-memory-pressure}

Цей приклад створює Pod, який безперервно записує у файли в записуваному шарі контейнера, що призводить до зростання кешу сторінок ядра та примусового відновлення памʼяті, що генерує тиск.

Створіть файл з назвою `memory-pressure-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: memory-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: memory-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    command: ["/bin/sh", "-c"]
    args:
    - "i=0; while true; do dd if=/dev/zero of=testfile.$i bs=1M count=50 &>/dev/null; i=$(((i+1)%5)); sleep 0.1; done"
    resources:
      limits:
        memory: "200M"
      requests:
        memory: "200M"
```

Застосуйте його до кластера: `kubectl apply -f memory-pressure-pod.yaml`

#### Спостереження за тиском на памʼять {#observing-memory-pressure}

**Використовуючи Summary API:**

У виводі підсумків ви спостерігатимете зростання метрик PSI `full` для памʼяті, що вказує на те, що система зазнає значного тиску на памʼять.

```shell
# Замініть <node-name> на імʼя вузла у вашому кластері
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("memory-pressure-pod"))'
```

**Використовуючи точку моніторингу метрик Prometheus:**

Надіщліть запит до точки доступу `/metrics/cadvisor`, щоб побачити метрику `container_pressure_memory_waiting_seconds_total`.

```shell
# Замініть <node-name> на імʼя вузла, на якому працює Pod
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_memory_waiting_seconds_total{container="memory-stress"}'
```

У виводі ви спостерігатимете зростання значення метрики, що вказує на те, що система зазнає значного тиску на памʼять.

#### Очищення {#cleanup-1}

Вилучіть Pod, коли закінчите:

```shell
kubectl delete pod memory-pressure-pod
```

### Генерація тиску на I/O {#generating-io-pressure}

Цей Pod генерує тиск на I/O, безперервно записуючи файл на диск і використовуючи `sync` для скидання даних з памʼяті, що створює затримки I/O.

Створіть файл з назвою `io-pressure-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: io-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: io-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    command: ["/bin/sh", "-c"]
    args:
      - "while true; do dd if=/dev/zero of=testfile bs=1M count=128 &>/dev/null; sync; rm testfile &>/dev/null; done"
```

Застосуйте це до вашого кластера: `kubectl apply -f io-pressure-pod.yaml`

#### Спостереження за тиском на I/O {#observing-io-pressure}

**Використовуючи Summary API:**

Ви побачите, що деякі метрики PSI для I/O зростають, оскільки Pod безперервно записує на диск.

```shell
# Замініть <node-name> на імʼя вузла у вашому кластері
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("io-pressure-pod"))'
```

**Використовуючи точку моніторингу метрик Prometheus:**

Надіщліть запит до точки доступу `/metrics/cadvisor`, щоб побачити метрику `container_pressure_io_waiting_seconds_total`.

```shell
# Замініть <node-name> на імʼя вузла, на якому працює Pod
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_io_waiting_seconds_total{container="io-stress"}'
```

Ви побачите, що значення метрики зростає, оскільки Pod безперервно записує на диск.

#### Очищення {#cleanup-2}

Вилучіть Pod, коли закінчите:

```shell
kubectl delete pod io-pressure-pod
```

## {{% heading "whatsnext" %}}

Сторінки завдань для [Усунення несправностей кластерів](/docs/tasks/debug/debug-cluster/) містять опис того, як використовувати конвеєр метрик, який спирається на ці дані.
