---
title: Накладні витрати, повʼязані з роботою Podʼів
content_type: concept
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Коли ви запускаєте Pod на вузлі, сам Pod потребує певної кількості системних ресурсів. Ці ресурси додаються до ресурсів, необхідних для запуску контейнерів всередині Podʼа. У Kubernetes _накладні витрати Podʼа_ (Pod Overhead) — це спосіб обліку ресурсів, які використовуються інфраструктурою Podʼа, понад запити та обмеження контейнерів.

У Kubernetes накладні витрати Podʼа встановлюються під час [допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) відповідно до накладних витрат, повʼязаних із [RuntimeClass](/docs/concepts/containers/runtime-class/) Podʼа.

Накладні витрати Podʼа враховуються на додачу до суми запитів ресурсів контейнерів під час планування Podʼа. Так само kubelet включатиме накладні витрати Podʼа під час визначення розміру cgroup Podʼа і під час ранжування Podʼів для виселення.

## Налаштування накладних витрат Podʼа {#set-up}

Вам потрібно переконатися, що використовується `RuntimeClass`, який визначає поле `overhead`.

## Приклад використання {#usage-example}

Для роботи з накладними витратами Podʼів вам потрібен `RuntimeClass`, який визначає поле `overhead`. Наприклад, ви можете використати таке визначення `RuntimeClass` із середовищем виконання контейнерів з віртуалізацією (у цьому прикладі Kata Containers у поєднанні з монітором віртуальної машини Firecracker), яке використовує приблизно 120MiB на Pod для віртуальної машини та гостьової ОС:

```yaml
# Вам потрібно змінити цей приклад, щоб назва та накладні витрати ресурсів на Pod
# відповідали тим, що додає середовище виконання контейнерів у вашому кластері.
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

Робочі навантаження, створені із зазначенням обробника RuntimeClass `kata-fc`, враховуватимуть накладні витрати памʼяті та CPU в обчисленнях квот ресурсів, під час планування на вузли, а також під час визначення розміру cgroup Podʼа.

Розгляньмо запуск наведеного прикладу робочого навантаження, `test-pod`:

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
Якщо у визначенні Podʼа вказані лише `limits`, kubelet виведе `requests` з цих обмежень і встановить їх такими ж, як і визначені `limits`.
{{< /note >}}

Під час допуску [контролер допуску](/docs/reference/access-authn-authz/admission-controllers/) RuntimeClass оновлює PodSpec робочого навантаження, щоб додати `overhead`, описаний у RuntimeClass. Якщо в PodSpec це поле вже визначено, Pod буде відхилено. У наведеному прикладі, оскільки вказано лише назву RuntimeClass, контролер допуску змінює Pod, додаючи `overhead`.

Після того, як контролер допуску RuntimeClass вніс зміни, ви можете перевірити оновлене значення накладних витрат Podʼа:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

Вивід:

```none
map[cpu:250m memory:120Mi]
```

Якщо визначено [ResourceQuota](/docs/concepts/policy/resource-quotas/), то враховується сума запитів контейнерів, а також поле `overhead`.

Коли kube-scheduler вирішує, на якому вузлі слід запускати новий Pod, він бере до уваги `overhead` цього Podʼа, а також суму запитів контейнерів для цього Podʼа. Для цього прикладу планувальник додає запити та `overhead`, а потім шукає вузол, на якому є 2,25 CPU та 320 MiB вільної памʼяті.

Після того, як Pod заплановано на вузол, kubelet на цьому вузлі створює нову {{< glossary_tooltip text="cgroup" term_id="cgroup" >}} для Podʼа. Саме в цьому Podʼі базове середовище виконання контейнерів створюватиме контейнери.

Якщо для кожного контейнера визначено обмеження ресурсу (Guaranteed QoS або Burstable QoS з визначеними обмеженнями), то kubelet встановлює верхнє обмеження для cgroup Podʼа, повʼязаної з цим ресурсом (`cpu.cfs_quota_us` для CPU та `memory.limit_in_bytes` для памʼяті). Це верхнє обмеження базується на сумі обмежень контейнерів плюс поле `overhead`, визначене в PodSpec.

Для CPU, якщо Pod має Guaranteed або Burstable QoS, то kubelet встановлює `cpu.shares` на основі суми запитів контейнерів плюс поле `overhead`, визначене в PodSpec.

Повертаючись до нашого прикладу, перевірте запити контейнерів для робочого навантаження:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

Загальні запити контейнерів становлять 2000m CPU та 200MiB памʼяті:

```none
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Порівняйте це з тим, що бачить вузол:

```bash
kubectl describe node | grep test-pod -B2
```

Вивід показує запити для 2250m CPU та 320MiB памʼяті. Запити включають накладні витрати Podʼа:

```none
  Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Перевірка обмежень cgroup Podʼа {#verify-pod-cgroup-limits}

Перевірте cgroup памʼяті Podʼа на вузлі, де працює робоче навантаження. У наступному прикладі використовується [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md) на вузлі, який надає інтерфейс командного рядка для сумісних із CRI середовищ виконання контейнерів. Це складний приклад, що демонструє поведінку накладних витрат Podʼа, і не очікується, що користувачам потрібно буде безпосередньо перевіряти cgroups на вузлі.

Спочатку на конкретному вузлі визначте ідентифікатор Podʼа:

```bash
# Виконайте це на вузлі, де заплановано Pod
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

З цього можна визначити шлях cgroup Podʼа:

```bash
# Виконайте це на вузлі, де заплановано Pod
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

Отриманий шлях cgroup включає контейнер `pause` Podʼа. Cgroup рівня Podʼа розташована на одну теку вище.

```none
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

У цьому конкретному випадку шлях cgroup Podʼа — `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`. Перевірте налаштування памʼяті cgroup рівня Podʼа:

```bash
# Виконайте це на вузлі, де заплановано Pod.
# Також змініть назву cgroup, щоб вона відповідала cgroup, виділеній для вашого Podʼа.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

Це 320 MiB, як і очікувалося:

```none
335544320
```

### Спостережуваність {#observability}

Деякі метрики `kube_pod_overhead_*` доступні у [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) для ідентифікації використання накладних витрат Podʼа та спостереження за стабільністю робочих навантажень, які працюють з визначеними накладними витратами.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся більше про [RuntimeClass](/docs/concepts/containers/runtime-class/)
* Прочитайте [пропозицію щодо PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead) для додаткового контексту
