---
title: Накладні витрати, повʼязані з роботою Podʼів
content_type: concept
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Коли ви запускаєте Pod на вузлі, сам Pod потребує певної кількості системних ресурсів. Ці ресурси додаються до ресурсів, необхідних для запуску контейнерів всередині Pod. У Kubernetes _Pod Overhead_ — це спосіб обліку ресурсів, які використовуються інфраструктурою Pod, понад запити та обмеження контейнерів.

У Kubernetes накладні витрати Pod встановлюються під час [допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) з урахуванням перевищення, повʼязаного з RuntimeClass Pod.

Накладні витрати Pod вважаються додатковими до суми запитів ресурсів контейнера при плануванні Pod. Так само, kubelet включатиме накладні витрати Pod при визначенні розміру cgroup Podʼа і при виконанні ранжування виселення Podʼа.

## Налаштування накладних витрат Pod {#set-up}

Вам потрібно переконатися, що використовується `RuntimeClass`, який визначає поле `overhead`.

## Приклад використання {#usage-example}

Для роботи з накладними витратами Podʼів вам потрібен `RuntimeClass`, який визначає поле `overhead`. Наприклад, ви можете використати таке визначення `RuntimeClass` з контейнерним середовищем віртуалізації (в цьому прикладі використовується Kata Containers поєднане з монітором віртуальної машини Firecracker), яке використовує приблизно 120MiB на Pod для віртуальної машини та гостьової ОС:

```yaml
# Вам треба внести зміни в цей приклад, щоб назва відповідала вашому контейнерному середовищу
# та ресурси overhead були додани до вашого кластера.
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-fc
handler: kata-fc
overhead:
  podFixed:
    memory: "120Mi"
    cpu: "250m"
```

Робочі навантаження, які створюються з використанням обробника RuntimeClass з іменем `kata-fc`, беруть участь в обчисленнях квот ресурсів, плануванні вузла, а також розмірі групи контейнерів Pod для памʼяті та CPU.

Розгляньте виконання поданого прикладу робочого навантаження, `test-pod`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

{{< note >}}
Якщо в визначенні Podʼа вказані лише `limits`, kubelet виведе `requests` з цих обмежень і встановить їх такими ж, як і визначені `limits`.
{{< /note >}}

Під час обробки допуску (admission) контролер [admission controller](/docs/reference/access-authn-authz/admission-controllers/) RuntimeClass оновлює PodSpec робочого навантаження, щоб включити `overhead`, що є в RuntimeClass. Якщо PodSpec вже має це поле визначеним, Pod буде відхилено. У поданому прикладі, оскільки вказано лише імʼя RuntimeClass, контролер обробки допуску змінює Pod, щоб включити `overhead`.

Після того, як контролер обробки допуску RuntimeClass вніс зміни, ви можете перевірити оновлене значення `overhead` Pod:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

Вивід:

```none
map[cpu:250m memory:120Mi]
```

Якщо визначено [ResourceQuota](/docs/concepts/policy/resource-quotas/), то обчислюється сума запитів контейнера, а також поля `overhead`.

Коли kube-scheduler вирішує, на якому вузлі слід запускати новий Pod, він бере до уваги `overhead` цього Pod, а також суму запитів контейнера для цього Pod. Для цього прикладу планувальник додає запити та `overhead`, а потім шукає вузол, на якому є 2,25 CPU та 320 MiB вільної памʼяті.

Після того, як Pod запланований на вузол, kubelet на цьому вузлі створює нову {{< glossary_tooltip text="cgroup" term_id="cgroup" >}} для Pod. Це саме той Pod, в межах якого контейнерне середовище створює контейнери.

Якщо для кожного контейнера визначено ліміт ресурсу (Guaranteed QoS або Burstable QoS з визначеними лімітами), то kubelet встановлює верхній ліміт для групи контейнерів Pod, повʼязаних з цим ресурсом (`cpu.cfs_quota_us` для CPU та `memory.limit_in_bytes` для памʼяті). Цей верхній ліміт базується на сумі лімітів контейнера плюс поле `overhead`, визначене в PodSpec.

Для CPU, якщо Pod має Guaranteed або Burstable QoS, то kubelet встановлює `cpu.shares` на основі суми запитів контейнера плюс поле `overhead`, визначене в PodSpec.

Подивіться приклад, перевірте запити контейнера для робочого навантаження:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

Загальні запити контейнера становлять 2000m CPU та 200MiB памʼяті:

```none
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Перевірте це у порівнянні з тим, що спостерігається вузлом:

```bash
kubectl describe node | grep test-pod -B2
```

Вивід показує запити для 2250m CPU та 320MiB памʼяті. Запити включають перевищення Pod:

```none
  Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Перевірка обмежень cgroup для Pod {#verify-pod-cgroup-limits}

Перевірте cgroup памʼяті для Pod на вузлі, де запускається робоче навантаження. У наступному прикладі використовується [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md) на вузлі, який надає інтерфейс командного рядка для сумісних з CRI контейнерних середовищ. Це передбачається для демонстрації поведінки overhead Podʼа, і не очікується, що користувачі повинні безпосередньо перевіряти cgroups на вузлі.

Спочатку, на конкретному вузлі, визначте ідентифікатор Pod:

```bash
# Виконайте це на вузлі, де запущено Pod
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

З цього можна визначити шлях cgroup для Pod:

```bash
# Виконайте це на вузлі, де запущено Pod
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

Результати шляху cgroup включають контейнер `pause` для Pod. Рівень cgroup на рівні Pod знаходиться на одну теку вище.

```none
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

У цьому конкретному випадку, шлях cgroup для Pod — `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`. Перевірте налаштування рівня cgroup для памʼяті на рівні Pod:

```bash
# Виконайте це на вузлі, де запущено Pod.
# Також, змініть назву cgroup, щоб відповідати призначеному вашому pod cgroup.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

Це 320 МіБ, як і очікувалося:

```none
335544320
```

### Спостережуваність {#observability}

Деякі метрики `kube_pod_overhead_*` доступні у [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) для ідентифікації використання накладних витрат Pod та спостереження стабільності робочих навантажень, які працюють з визначеним overhead.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [RuntimeClass](/docs/concepts/containers/runtime-class/)
* Прочитайте [пропозицію щодо PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead) для додаткового контексту
