---
title: Розширена конфігурація Podʼів
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
---

<!-- overview -->

На цій сторінці розглядаються теми з розширеної конфігурації Podʼів, включаючи [PriorityClasses](#priorityclasses), [RuntimeClasses](#runtimeclasses), [security context](#security-context) в Podʼах, а також представлені аспекти [планування](/docs/concepts/scheduling-eviction/#scheduling).

<!-- body -->

## PriorityClasses

_PriorityClasses_ дозволяють вам встановити важливість Podʼів відносно інших Podʼів. Якщо ви призначаєте клас пріоритету Podʼу, Kubernetes встановлює поле `.spec.priority` для цього Podʼа на основі PriorityClass, який ви вказали (ви не можете встановити `.spec.priority` безпосередньо). Якщо або коли Pod не може бути запланований, і проблема повʼязана з нестачею ресурсів, {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}} намагається {{< glossary_tooltip text="випередити" term_id="preemption" >}} Pod з нижчим пріоритетом, щоб зробити можливим планування Podʼа з вищим пріоритетом.

PriorityClass — це обʼєкт API в межах кластера, який зіставляє імʼя класу пріоритету з цілочисельним значенням пріоритету. Більші числа вказують на вищий пріоритет.

### Визначення PriorityClass {#defining-a-priorityclass}

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 10000
globalDefault: false
description: "Клас пріоритетності для робочих навантажень з високим пріоритетом"
```

### Визначення пріоритету подів за допомогою PriorityClass {#specify-pod-priority-using-a-priorityclass}

{{< highlight yaml "hl_lines=9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  priorityClassName: high-priority
{{< /highlight >}}

### Вбудовані PriorityClasses {#built-in-priorityclasses}

Kubernetes надає два вбудовані PriorityClasses:

- `system-cluster-critical`: для системних компонентів, які є критичними для кластера
- `system-node-critical`: для системних компонентів, які є критичними для окремих вузлів. Це найвищий пріоритет, який можуть мати Podʼи в Kubernetes.

Для отримання додаткової інформації див. [Пріоритет і випередження Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

## RuntimeClasses

_RuntimeClass_ дозволяє вказати низькорівневе середовище виконання контейнера для Podʼа. Це корисно, коли потрібно вказати різні середовища виконання контейнерів для різних типів Podʼів, наприклад, коли потрібні різні рівні ізоляції або функції середовища виконання.

### Приклад Podʼа {#runtimeclass-pod-example}

{{< highlight yaml "hl_lines=6" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  containers:
  - name: mycontainer
    image: nginx
{{< /highlight >}}

[RuntimeClass](/docs/concepts/containers/runtime-class/) — це обʼєкт у межах кластера, який представляє середовище виконання контейнерів, доступне на деяких або всіх ваших вузлах.

Адміністратор кластера встановлює та налаштовує конкретні середовища виконання, що підтримують RuntimeClass.

Він може налаштувати спеціальну конфігурацію середовища виконання контейнера на всіх вузлах або лише на деяких з них.

Докладнішу інформацію див. у документації [RuntimeClass](/docs/concepts/containers/runtime-class/).

## Конфігурація контексту безпеки на рівні Podʼа та контейнера {#security-context}

Поле `Security context` у специфікації Podʼа забезпечує детальний контроль за налаштуваннями безпеки для Podʼів та контейнерів.

### `securityContext` на рівні Podʼа {#pod-level-security-context}

Деякі аспекти безпеки застосовуються до всього Podʼа; для інших аспектів ви можете встановити значення за замовчуванням без будь-яких перевизначень на рівні контейнера.

Ось приклад використання `securityContext` на рівні Podʼа:

#### Прикдаж Podʼа {#pod-level-security-context-example}

{{< highlight yaml "hl_lines=5-9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:  # Це стосується всього Podʼа
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: ["sh", "-c", "sleep 1h"]
{{< /highlight >}}

### Контекст безпеки на рівні контейнера {#container-level-security-context}

Ви можете вказати контекст безпеки тільки для конкретного контейнера. Ось приклад:

#### Приклад Podʼа {#container-level-security-context-example}

{{< highlight yaml "hl_lines=9-17" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo-2
spec:
  containers:
  - name: sec-ctx-demo-2
    image: gcr.io/google-samples/node-hello:1.0
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
        - ALL
      seccompProfile:
        type: RuntimeDefault
{{< /highlight >}}

### Параметри контексту безпеки {#security-context-options}

- **Ідентифікатори користувачів та груп**: контроль того, під яким користувачем/групою працює контейнер
- **Capabilities**: додавання або видалення можливостей Linux
- **Профілі Seccomp**: налаштування профілів обчислювальної безпеки
- **Параметри SELinux**: налаштування контексту SELinux
- **AppArmor**: налаштування профілів AppArmor для додаткового контролю доступу
- **Параметри Windows**: налаштування параметрів безпеки, специфічних для Windows

{{< caution >}}
Ви також можете використовувати `securityContext` Podʼа, щоб дозволити [_привілейований режим_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers) у контейнерах Linux. Привілейований режим замінює багато інших налаштувань безпеки в `securityContext`. Уникайте використання цього параметра, якщо ви не можете надати еквівалентні дозволи за допомогою інших полів у `securityContext`. Ви можете запускати контейнери Windows у подібному привілейованому режимі, встановивши прапорець `windowsOptions.hostProcess` у контексті безпеки на рівні Podʼа. Детальні відомості та інструкції див. у розділі [Створення Pod Windows HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
{{< /caution >}}

Для отримання додаткової інформації див. [Налаштування контексту безпеки для Podʼа або контейнера](/docs/tasks/configure-pod-container/security-context/).

## Вплив на рішення щодо планування Podʼів {#scheduling}

Kubernetes надає кілька механізмів для контролю над тим, на яких вузлах плануються ваші Podʼи.

### Селектори вузлів {#nodes-selectors}

Найпростіша форма обмеження вибору вузлів:

{{< highlight yaml "hl_lines=9-11" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    disktype: ssd
{{< /highlight >}}

### Спорідненість вузлів {#node-affinity}

Сполученість вузлів дозволяє вам вказати правила, які обмежують, на яких вузлах може бути запланований ваш Pod. Ось приклад Podʼа, який віддає перевагу роботі на вузлах, позначених як такі, що знаходяться на певному континенті, вибираючи на основі значення мітки [`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - antarctica-east1
            - antarctica-west1
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Спорідненість та антиспорідненість Podʼів {#pod-affinity-and-anti-affinity}

Окрім спорідненості вузлів, ви також можете обмежити, на яких вузлах може бути заплановано Pod, на основі міток інших Podʼів, які вже працюють на вузлах. Спорідненість Podʼів дозволяє вам вказати правила щодо розміщення Podʼів відносно інших Podʼів.

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Толерантності {#tolerations}

_Толерантності_ дозволяють планувати роботу Podів на вузлах із відповідними позначками taint:

{{< highlight yaml "hl_lines=9-13" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
{{< /highlight >}}

Для отримання додаткової інформації див. [Призначення подів до вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/).

## Накладні витрати на Pod {#pod-overhead}

Накладні витрати на Pod дозволяють враховувати ресурси, що споживаються інфраструктурою Podʼа, понад запити та обмеження контейнерів.

{{< highlight yaml "hl_lines=7-10" >}}
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kvisor-runtime
handler: kvisor-runtime
overhead:
  podFixed:
    memory: "2Gi"
    cpu: "500m"
---
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: kvisor-runtime
  containers:
  - name: myapp
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
{{< /highlight >}}

## {{% heading "whatsnext" %}}

* Прочитайте про [Пріоритет і випередження Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Прочитайте про [RuntimeClasses](/docs/concepts/containers/runtime-class/)
* Дізнайтеся про [Налаштування контексту безпеки для Podʼа або контейнера](/docs/tasks/configure-pod-container/security-context/)
* Дізнайтеся, як Kubernetes [призначає Podʼи до вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Накладні витрати на Pod](/docs/concepts/scheduling-eviction/pod-overhead/)
