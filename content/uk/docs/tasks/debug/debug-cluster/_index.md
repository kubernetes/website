---
title: Налагодження кластера
description: Виправлення загальних проблем з кластером Kubernetes.
weight: 20
no_list: true
---

<!-- overview -->

Цей документ присвячений усуненню несправностей в кластері; ми передбачаємо, що ви вже виключили свій застосунок з переліку причин проблеми, з якою ви стикаєтеся. Дивіться [посібник Налагодження застосунку](/docs/tasks/debug/debug-application/) для порад з перевірки застосунків. Ви також можете звернутися до [загального документа з усунення несправностей](/docs/tasks/debug/) для отримання додаткової інформації.

Щодо усунення несправностей інструменту {{<glossary_tooltip text="kubectl" term_id="kubectl">}}, звертайтеся до [Посібника з усунення несправностей kubectl](/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/).

<!-- body -->

## Виведення інформації про кластер {#listing-your-cluster}

Перша річ, яку потрібно дослідити у кластері — це переконатися, що всі ваші вузли зареєстровані правильно.

Виконайте наступну команду:

```shell
kubectl get nodes
```

Перевірте, що всі вузли, які ви очікуєте бачити, присутні, і що всі вони перебувають у стані `Ready`.

Щоб отримати детальну інформацію про загальний стан вашого кластера, ви можете виконати:

```shell
kubectl cluster-info dump
```

### Приклад: налагодження вимкненого/недоступного вузла {#example-debugging-a-down-unreachable-node}

Іноді при налагодженні може бути корисно переглянути стан вузла, наприклад, через те, що ви помітили дивну поведінку Podʼа, який працює на вузлі, або щоб дізнатися, чому Pod не може розміститися на вузлі.  Так само як і з Podʼами, ви можете використовувати `kubectl describe node` та `kubectl get node -o yaml`, щоб отримати детальну інформацію про вузли. Наприклад, ось що ви побачите, якщо вузол вимкнено (відключено від мережі, або kubelet припинив роботу і не може перезапуститися і т. д.). Зверніть увагу на події, які показують, що вузол не готовий, і також зверніть увагу, що Podʼи більше не працюють (їх буде виселено після пʼяти хвилин стану NotReady).

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status. AppArmor enabled
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```

## Аналіз логів {#looking-at-logs}

Тепер для докладнішого вивчення кластера потрібно увійти на відповідні машини. Ось розташування відповідних файлів журналу. На системах, що використовують systemd, може знадобитися використання `journalctl` замість перегляду файлів журналу.

### Вузли панелі управління {#control-plane-nodes}

* `/var/log/kube-apiserver.log` — Сервер API, відповідальний за обслуговування API
* `/var/log/kube-scheduler.log` — Планувальник, відповідальний за прийняття рішень щодо планування
* `/var/log/kube-controller-manager.log` — Компонент, який виконує більшість вбудованих {{<glossary_tooltip text="контролерів" term_id="controller">}} Kubernetes, за винятком планування (за це відповідає планувальник kube-scheduler).

### Робочі вузли {#worker-nodes}

* `/var/log/kubelet.log` — логи kubelet, відповідального за запуск контейнерів на вузлі
* `/var/log/kube-proxy.log` — логи `kube-proxy`, відповідального за направлення трафіку на Service endpoints.

## Режими відмови кластера {#cluster-failure-modes}

Це неповний перелік того, що може піти не так, та як виправити вашу конфігурацію кластера для помʼякшення проблем.

### Причини відмов {#contributing-causes}

* Вимкнення віртуальних машин(и)
* Розділ мережі в межах кластера чи між кластером та користувачами
* Крах програмного забезпечення Kubernetes
* Втрата даних або недоступність постійного сховища (наприклад, GCE PD або томів AWS EBS)
* Помилка оператора, наприклад, неправильно налаштоване програмне забезпечення Kubernetes або застосунку

### Конкретні сценарії {#specific-scenarios}

* Вимкнення віртуальної машини або аварійне вимикання apiserver
  * Результати
    * не можна зупинити, оновити чи запустити нові Podʼи, Services, контролер реплікацій
    * наявні Podʼи та Services мають продовжувати нормальну роботу, якщо вони не залежать від API Kubernetes
* Втрата даних, на яких ґрунтується API сервер
  * Результати
    * компонент kube-apiserver не може успішно стартувати та стати спроможним обслуговувати запити
    * kubelet не зможе досягти його, але продовжить виконувати ті самі Podʼи та забезпечувати той самий сервіс проксі
    * необхідне ручне відновлення або відновлення стану apiserver перед його перезапуском
* Припинення роботи служб підтримки (контролер вузлів, менеджер контролера реплікацій, планувальник і т. д.) або їх крах
  * наразі вони розміщені разом з apiserver, і їхня недоступність має схожі наслідки, що й в apiserver
  * у майбутньому ці служби також будуть репліковані та не можуть бути розміщені в одному місці
  * вони не мають власного постійного стану
* Вимкнення окремого вузла (віртуальна машина або фізична машина)
  * Результати
    * Podʼи на цьому вузлі перестають працювати
* Розрив мережі
  * Результати
    * розділ A вважає, що вузли в розділі B вимкнені; розділ B вважає, що apiserver вимкнений.
      (Якщо майстер-вузол опиниться в розділі A.)
* Збій програмного забезпечення kubelet
  * Результати
    * аварійно вимкнений kubelet не може стартувати нові Podʼи на вузлі
    * kubelet може видаляти Podʼи або ні
    * вузол позначений як неспроможний
    * контролери реплікацій стартують нові Podʼи в іншому місці
* Помилка оператора кластера
  * Результати
    * втрата Podʼів, Services і т. ін.
    * втрата сховища даних для apiserver
    * користувачі не можуть читати API
    * і т.д.

### Помʼякшення {#mitigations}

* Дія: Використовуйте функцію автоматичного перезапуску віртуальних машин IaaS для віртуальних машин IaaS
  * Помʼякшує: Вимкнення віртуальної машини або аварійне вимикання apiserver
  * Помʼякшує: Вимкнення служб підтримки або їх краху

* Дія: Використовуйте надійне сховище IaaS (наприклад, GCE PD або том AWS EBS) для віртуальних машин з apiserver+etcd
  * Помʼякшує: Втрата даних, на яких ґрунтується API сервер

* Дія: Використовуйте [конфігурацію високої доступності](/docs/setup/production-environment/tools/kubeadm/high-availability/)
  * Помʼякшує: Вимкнення вузла керування або аварійне завершення роботи компонентів управління керуванням (планувальник, API сервер, менеджер контролера)
    * Витримає одне або кілька одночасних відмов вузлів або компонентів
  * Помʼякшує: Втрата сховища даних для API сервера (тобто тека даних etcd)
    * Передбачає конфігурацію HA (highly-available) etcd

* Дія: Регулярно створюйте знімки віртуальних машин або томів PD/EBS, які використовуються apiserver
  * Помʼякшує: Втрата сховища даних для API сервера
  * Помʼякшує: Деякі випадки помилок оператора
  * Помʼякшує: Деякі випадки несправності програмного забезпечення Kubernetes

* Дія: Використовуйте контролер реплікацій та служби перед Podʼами
  * Помʼякшує: Вимкнення вузла
  * Помʼякшує: Збій програмного забезпечення kubelet

* Дія: Застосунки (контейнери), призначені для того, щоб витримувати неочікувані перезапуски
  * Помʼякшує: Вимкнення вузла
  * Помʼякшує: Збій програмного забезпечення kubelet

## {{% heading "whatsnext" %}}

* Дізнайтеся про метрики, доступні в
  [Resource Metrics Pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
* Відкрийте додаткові інструменти для
  [моніторингу використання ресурсів](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* Використовуйте Node Problem Detector для
  [моніторингу стану вузла](/docs/tasks/debug/debug-cluster/monitor-node-health/)
* Використовуйте `kubectl debug node` для [налагодження вузлів Kubernetes](/docs/tasks/debug/debug-cluster/kubectl-node-debug)
* Використовуйте `crictl` для [налагодження вузлів Kubernetes](/docs/tasks/debug/debug-cluster/crictl/)
* Отримайте більше інформації про [аудит Kubernetes](/docs/tasks/debug/debug-cluster/audit/)
* Використовуйте `telepresence` для [розробки та налагодження служб локально](/docs/tasks/debug/debug-cluster/local-debugging/)
