---
layout: blog
title: "Не лише завантаження CPU: як PSI допомагає діагностувати конкуренцію за ресурси Kubernetes"
slug: using-psi-to-diagnose-kubernetes-resource-contention
draft: true
author: >
  [Nitin Ware](https://github.com/nitinware)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Я працюю із сервісами інференсу ШІ, чутливими до затримок, де важливо розуміти, чому запити сповільнюються. Під час дослідження проблем із продуктивністю я насамперед перевіряю використання CPU. Але цей показник не пояснює, чи доводиться робочим навантаженням чекати на процесорний час.

Ця різниця зацікавила мене в Linux Pressure Stall Information (PSI, інформація Linux про затримки через тиск на ресурси). Вузол може бути повністю завантажений, коли два завдання працюють на двох CPU, або коли шість завдань змагаються за ті самі CPU. Завантаження CPU в обох випадках може бути схожим, але очікування — зовсім різним.

PSI вимірює це очікування. Kubernetes надає метрики PSI через `kubelet`; у [Kubernetes v1.36 вони перейшли до стабільної версії](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/).

Я хотів побачити цю різницю на практиці, тож запустив те саме робоче навантаження у двох конфігураціях на вузлі Kubernetes, обмеженому двома CPU. В обох випадках `kubectl top` показував 2001m використання CPU вузлом, тобто обидва CPU були повністю зайняті. Але тиск CPU становив 0,33% у першому запуску й 99,63% у другому.

## Що означає тиск на CPU {#what-cpu-pressure-means}

CPU PSI вимірює частку часу, протягом якого принаймні одне завдання було готове до запуску, але чекало на CPU. Цей показник називається `some`. Значення `avg10` у 25% означає, що приблизно протягом останніх 10 секунд принаймні одне завдання чекало близько чверті часу.

Ядро повідомляє `some` як середні значення за останні 10, 60 і 300 секунд (`avg10`, `avg60`, `avg300`). Я використовую `avg10`, оскільки цей показник швидко реагує на зміну робочого навантаження. PSI також повідомляє `full` — частку часу, коли всі завдання одночасно чекали. У цій статті я цей показник не використовую.

API зведеної інформації `kubelet` показує використання CPU і PSI разом для вузла, а також кожного Podʼа й контейнера:

```shell
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" \
  | jq '{cores: (.node.cpu.usageNanoCores / 1e9), psi: .node.cpu.psi}'
```

Значення для кожного Podʼа містяться в `.pods[].cpu.psi`. Якщо ви використовуєте Prometheus, такий самий показник для кожного контейнера є в точці доступу `/metrics/cadvisor` `kubelet` з назвою `container_pressure_cpu_waiting_seconds_total`.

## Однакове завантаження, різний тиск {#same-utilization-different-pressure}

Для тесту я використав кластер [kind](https://kind.sigs.k8s.io/) на машині з чотирма CPU. Два CPU я виділив робочому вузлу, а два інші — панелі управління, щоб вона не змагалася з тестовим робочим навантаженням. Робоче навантаження — невеликий Pod із циклами активного очікування. Кожен цикл повністю завантажує один CPU, коли отримує до нього доступ. Повні налаштування наведено в [додатку](#appendix-reproducing-the-runs).

У кожному запуску я чекав 60 секунд, щоб показники стабілізувалися, а потім 12 разів з інтервалом у 10 секунд зчитував тиск CPU вузла. Наведені нижче значення — середнє цих 12 вимірювань.

**Запуск A: один Pod, два цикли.** Два цикли на двох CPU — кожен цикл має окремий CPU.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   53m          1%       593Mi           7%
psi-demo-worker          2001m        50%      166Mi           2%
```

Робочий вузол використовує 2001m, отже обидва його CPU повністю зайняті. Тиск CPU становив **0,33%**. Циклам майже ніколи не доводилося чекати.

**Запуск B: три Podʼи, шість циклів.** Тепер шість циклів змагаються за ті самі два CPU. Одночасно можуть працювати лише два цикли, решта чекають.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   43m          1%       602Mi           7%
psi-demo-worker          2001m        50%      183Mi           2%
```

Використання CPU не змінилося й становить 2001m. Але тиск CPU сягнув **99,63%**: майже весь час якийсь цикл чекав на CPU.

В обох запусках `CPU(%)` дорівнює 50%, оскільки Kubernetes рахує місткість вузла за всіма чотирма CPU машини й не знає про обмеження у два CPU.

{{< figure src="psi-utilization-vs-pressure.svg" caption="У запусках A і B робочий вузол використовує ті самі 2 CPU, але тиск CPU зростає з менш ніж 1% до 99,6%. У запуску C використовується чверть CPU вузла, проте тиск усе одно становить 75,2%." alt="Дві стовпчикові діаграми. Ліворуч — використання CPU в ядрах: запуск A — 2,00, B — 2,00, C — 0,51 за місткості вузла у 2 CPU. Праворуч — тиск CPU some avg10: запуск A — менше 1%, B — 99,6%, C — 75,2%." >}}

Перевірка використання CPU окремими Podʼами виявила ще один аспект проблеми:

```console
$ kubectl top pods
NAME                        CPU(cores)   MEMORY(bytes)
spinners-849c6d64c8-g2s9x   616m         0Mi
spinners-849c6d64c8-ggtqh   667m         0Mi
spinners-849c6d64c8-q9bvj   708m         0Mi
```

У запуску A один Pod використовував 1991m. У запуску B кожен Pod використовував лише від 616m до 708m, хоча в кожному й далі працювали два цикли активного очікування. Менші значення не означають, що Podʼам потрібно менше CPU: вони ділять між собою два CPU. `kubectl top` не показує очікування, але його видно в PSI на рівні Podʼів: під час останнього вимірювання тиск CPU для трьох Podʼів становив 69%, 99,73% і 99,79%.

## Низьке використання, високий тиск {#low-utilization-high-pressure}

Я також перевірив, що відбувається, коли робоче навантаження має обмеження CPU, а на вузлі є вільні ресурси. Для **запуску C** я повернувся до одного Podʼа з двома циклами й установив обмеження CPU на рівні 500m.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   55m          1%       608Mi           7%
psi-demo-worker          517m         12%      168Mi           2%
```

Робочий вузол використовував приблизно 0,51 із двох CPU, залишаючи вільними три чверті потужності. `kubectl top` показує 12%, оскільки Kubernetes рахує місткість за чотирма CPU. Попри це, середнє значення `some.avg10` вузла становило **75,23%**. Обмеження 500m зменшило використання CPU Podʼом, хоча на робочому вузлі були вільні ресурси. Два цикли вичерпували свою квоту CPU й обмежувалися нею. Лічильник обмеження контейнера показує, що від початку його роботи обмеження спрацьовувало протягом 1905 періодів CFS:

```text
container_cpu_cfs_throttled_periods_total{container="spin",...}  1905
```

У [документації PSI](/docs/reference/instrumentation/understand-psi-metrics/) прикладом є Pod з обмеженням CPU. Тут лічильник обмеження вказує на ліміт Podʼа, а не на конкуренцію з іншими робочими навантаженнями. Отже, додавання потужності вузлу не зменшить цей тиск, доки обмеження CPU Podʼа залишається на рівні 500m.

## Використання PSI під час дослідження проблем {#using-psi-during-an-investigation}

Ці три запуски показують, чому під час дослідження проблем із продуктивністю варто дивитися на тиск CPU разом із його використанням:

- Високе використання, низький тиск (запуск A): CPU зайняті, але роботи не забагато. Саме по собі високе використання не є проблемою.
- Високе використання, високий тиск (запуск B): готових до виконання завдань більше, ніж доступних CPU. Перевірте, які ще навантаження заплановано на вузлі, запити CPU та розміщення Podʼів.
- Тиск у Podʼі за наявності вільних CPU на вузлі (запуск C): імовірно, Pod обмежений власною межею CPU. Перевірте лічильники обмеження.

Я б не встановлював універсальне порогове значення PSI. Рівень, нормальний для пакетного завдання, може бути проблемою для API з чутливими до затримок запитами. Тож я порівнював би тиск із базовими показниками саме цього робочого навантаження та перевіряв, чи зростав він одночасно із затримкою або глибиною черги.

У сервісах інференсу, з якими я працюю, затримка може зростати з різних причин: через більший обсяг обробки в сервісі, очікування на CPU або повільний виклик іншого сервісу.

Ці експерименти допомогли мені зрозуміти, що додає PSI. Якщо затримка зростатиме без зрозумілого пояснення з боку використання CPU, я перевірю тиск CPU на рівні Podʼа, щоб зʼясувати, чи можуть впливати конкуренція або обмеження CPU. Перш ніж робити висновки, я зіставлю ці показники з метриками й трасуваннями застосунку.

## Додаток: відтворення запусків {#appendix-reproducing-the-runs}

Я проводив тест на kind v0.33.0 із Kubernetes v1.36.1 — випуском, у якому метрики PSI перейшли до стабільної версії.

**Потрібно:** хост Linux із cgroup v2, ядро з підтримкою PSI, Docker, kind, kubectl і jq, щонайменше 4 CPU. Перевірте підтримку cgroup v2 і PSI на хості:

```shell
stat -fc %T /sys/fs/cgroup     # очікувано: cgroup2fs
cat /proc/pressure/cpu         # очікувано: рядки some і full
```

У macOS я використовував [Colima](https://github.com/abiosoft/colima) — інструмент із відкритим кодом, який запускає Docker Engine у віртуальній машині Linux і встановлюється через Homebrew: `colima start --profile psi-demo --runtime docker --cpu 4 --memory 8`. Потім виконайте обидві перевірки всередині віртуальної машини за допомогою `colima ssh --profile psi-demo -- <command>`.

**Створіть двовузловий кластер** за допомогою `kind-config.yaml`:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
```

```shell
kind create cluster --name psi-demo --image kindest/node:v1.36.1 \
  --config kind-config.yaml --wait 180s
```

**Закріпіть вузли за окремими CPU.** Кожен вузол kind — це контейнер Docker, тому Docker може обмежити CPU, на яких він працює:

```shell
docker update --cpuset-cpus="0,1" psi-demo-control-plane
docker update --cpuset-cpus="2,3" psi-demo-worker
docker exec psi-demo-worker nproc     # очікувано: 2
```

Оскільки робочий вузол kind — це контейнер, його PSI на рівні вузла надходить із cgroup цього контейнера, а не з `/proc/pressure/cpu` хоста. Саме тому на рівні вузла значення CPU `full` може бути ненульовим: загальносистемний рядок CPU `full` у `/proc/pressure/cpu` завжди дорівнює нулю.

**Установіть metrics-server**, щоб використовувати `kubectl top`. Прапорець `--kubelet-insecure-tls` потрібен через самопідписані сертифікати kubelet у kind; не використовуйте його поза локальним тестовим кластером.

```shell
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.0/components.yaml
# Зверніть увагу на попередження щодо прапорця --kubelet-insecure-tls!
kubectl -n kube-system patch deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl -n kube-system rollout status deployment/metrics-server
```

**Робоче навантаження** у файлі `spinners.yaml`. Кожен Pod запускає на робочому вузлі `WORKERS` циклів активного очікування:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spinners
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spinners
  template:
    metadata:
      labels:
        app: spinners
    spec:
      nodeSelector:
        kubernetes.io/hostname: psi-demo-worker
      containers:
      - name: spin
        image: busybox:1.36
        env:
        - name: WORKERS
          value: "2"
        command: ["sh", "-c", "for i in $(seq $WORKERS); do (while :; do :; done) & done; wait"]
```

**Виконайте три сценарії.** Після кожної зміни дочекайтеся завершення розгортання, а потім зачекайте ще приблизно 60 секунд, перш ніж зчитувати `kubectl top` і дані з API зведеної інформації, наведеного вище. Як імʼя вузла вкажіть `psi-demo-worker`.

```shell
# Запуск A: 2 цикли на 2 CPU
kubectl apply -f spinners.yaml
kubectl rollout status deployment/spinners

# Запуск B: 6 циклів на 2 CPU
kubectl scale deployment spinners --replicas=3
kubectl rollout status deployment/spinners

# Запуск C: 2 цикли з обмеженням 500m. Спершу встановіть replicas у 0
# і зачекайте 5 хвилин, щоб avg10 та avg60 після запуску B знову наблизилися до нуля.
kubectl scale deployment spinners --replicas=0
sleep 300
kubectl set resources deployment spinners --limits=cpu=500m
kubectl scale deployment spinners --replicas=1
kubectl rollout status deployment/spinners
```

Щоб отримати середнє значення тиску для запуску:

```shell
for i in $(seq 12); do
  kubectl get --raw /api/v1/nodes/psi-demo-worker/proxy/stats/summary \
    | jq '.node.cpu.psi.some.avg10'
  sleep 10
done | jq -s 'add / length'
```

Команда обчислює середнє 12 значень `some.avg10`, зчитаних приблизно з інтервалом у 10 секунд; саме так було отримано результати вище.

Для запуску C перевірте лічильники обмеження:

```shell
kubectl get --raw /api/v1/nodes/psi-demo-worker/proxy/metrics/cadvisor \
  | grep -E 'container_cpu_cfs_throttled_(periods|seconds)_total' | grep 'container="spin"'
```

**Очищення:**

```shell
kind delete cluster --name psi-demo
colima stop --profile psi-demo     # лише для macOS
```
