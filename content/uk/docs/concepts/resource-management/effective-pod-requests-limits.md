---
title: Ефективні запити та обмеження Podʼа
content_type: concept
weight: 5
---

<!-- overview -->

На цій сторінці пояснюється, що таке _ефективний запит_ та _ефективне обмеження_ {{< glossary_tooltip text="Podʼа" term_id="pod" >}}, а також як Kubernetes обчислює їх на основі [запитів і обмежень ресурсів](/docs/concepts/configuration/manage-resources-containers/), які ви вказуєте для контейнерів Podʼа. Kubernetes використовує ці значення для Podʼа загалом, наприклад під час планування, застосування квот ресурсів або визначення розміру cgroup Podʼа в Linux.

{{< glossary_tooltip text="Kube-scheduler" term_id="kube-scheduler" >}} розміщує Pod лише на вузлі, де достатньо ресурсів для ефективного запиту, а вузол резервує це значення для Podʼа навіть після завершення ініціалізації. Ефективні значення не завжди дорівнюють простій сумі значень контейнерів: init-контейнери запускаються по одному, а sidecar-контейнери продовжують працювати під час і після ініціалізації. Розуміння цього обчислення допомагає налаштовувати запити для init- і sidecar-контейнерів без надмірного резервування ресурсів вузла.

<!-- body -->

## Обчислення ефективних запитів та обмежень {#calculating-effective-requests-and-limits}

Для кожного ресурсу Kubernetes обчислює запит або обмеження для двох етапів:

* Під час ініціалізації init-контейнери запускаються по одному разом із sidecar-контейнерами, які вже запущено. Запит або обмеження для цього етапу називається _ефективним запитом_ або _ефективним обмеженням ініціалізації_; це найбільше значення, потрібне в будь-який момент ініціалізації:
  * Для кожного init-контейнера візьміть його запит або обмеження ресурсу та додайте запити або обмеження всіх sidecar-контейнерів, розташованих перед ним у полі `initContainers`.
  * Найбільше з цих значень є ефективним запитом або обмеженням ініціалізації.

  Якщо для ресурсу не задано обмеження, воно вважається найбільшим можливим.

* Після ініціалізації всі sidecar-контейнери та контейнери застосунку працюють одночасно. Запит або обмеження для цього етапу дорівнює сумі запитів або обмежень усіх контейнерів, що не є init-контейнерами (контейнерів застосунку та sidecar-контейнерів).

_Ефективний запит або обмеження_ Podʼа для ресурсу дорівнює більшому з двох значень: значення під час ініціалізації (ефективний запит або обмеження ініціалізації) та значення після ініціалізації (сума для всіх інших контейнерів), плюс [накладні витрати Podʼа](/docs/concepts/scheduling-eviction/pod-overhead/). Приклади для конкретних Podʼів наведено в розділі [Приклади ефективних запитів](#examples-of-effective-requests).

Також діють такі правила:

* Планування виконується на основі ефективних запитів і обмежень. Тому init-контейнери можуть резервувати ресурси для ініціалізації, які не використовуватимуться протягом решти часу життя Podʼа.
* Рівень QoS (якості обслуговування) Podʼа визначається з урахуванням усіх init-контейнерів, sidecar-контейнерів і контейнерів застосунку.

Квоти й обмеження застосовуються на основі ефективного запиту та обмеження Podʼа.

## Приклади ефективних запитів {#examples-of-effective-requests}

У наведених прикладах показано, як обчислюється ефективний запит CPU для Podʼа. Жоден із цих Podʼів не має накладних витрат.

У цьому Podʼі sidecar-контейнер розташовано перед init-контейнером:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-before-init
spec:
  initContainers:
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # робить цей контейнер sidecar
    resources:
      requests:
        cpu: 100m
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 50m
```

* Під час ініціалізації sidecar-контейнер уже працює, коли запускається `init`, тому ефективний запит ініціалізації становить `100m + 200m = 300m`.
* Після ініціалізації sidecar-контейнер і контейнер `app` працюють одночасно, тому сума їхніх запитів дорівнює `100m + 50m = 150m`.
* Ефективний запит CPU Podʼа дорівнює більшому з цих значень (`300m` і `150m`), тобто `300m`.

У цього Podʼа ті самі контейнери, але init-контейнер розташовано перед sidecar-контейнером:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-before-sidecar
spec:
  initContainers:
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # робить цей контейнер sidecar
    resources:
      requests:
        cpu: 100m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 50m
```

* Під час запуску контейнера `init` жоден sidecar-контейнер ще не працює, тому ефективний запит ініціалізації становить `200m`.
* Після ініціалізації sidecar-контейнер і контейнер `app` працюють одночасно, тому сума їхніх запитів дорівнює `100m + 50m = 150m`.
* Ефективний запит CPU Podʼа дорівнює більшому з цих значень (`200m` і `150m`), тобто `200m`.

У наступному Podʼі sidecar-контейнер знову розташовано перед init-контейнером, але цього разу контейнер застосунку запитує більше CPU:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: large-app
spec:
  initContainers:
  - name: sidecar
    image: busybox:1.38
    command: ["sleep", "infinity"]
    restartPolicy: Always # робить цей контейнер sidecar
    resources:
      requests:
        cpu: 100m
  - name: init
    image: busybox:1.38
    command: ["sleep", "5"]
    resources:
      requests:
        cpu: 200m
  containers:
  - name: app
    image: busybox:1.38
    command: ["sleep", "infinity"]
    resources:
      requests:
        cpu: 400m
```

* Під час ініціалізації ефективний запит становить `100m + 200m = 300m`.
* Після ініціалізації sidecar-контейнер і контейнер `app` працюють одночасно, тому сума їхніх запитів дорівнює `100m + 400m = 500m`.
* Ефективний запит CPU Podʼа дорівнює більшому з цих значень (`300m` і `500m`), тобто `500m`.

## cgroups Linux {#cgroups}

У Linux розподіл ресурсів для контрольних груп (cgroups) рівня Podʼа ґрунтується на ефективному запиті та обмеженні Podʼа так само, як і планування.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [керування ресурсами для Podʼів і контейнерів](/docs/concepts/configuration/manage-resources-containers/).
* Дізнайтеся про [init-контейнери](/docs/concepts/workloads/pods/init-containers/).
* Дізнайтеся про [sidecar-контейнери](/docs/concepts/workloads/pods/sidecar-containers/).
* Дізнайтеся про [квоти ресурсів](/docs/concepts/policy/resource-quotas/).
* Дізнайтеся про [класи якості обслуговування Podʼів](/docs/concepts/workloads/pods/pod-qos/).
