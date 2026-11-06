---
title: Усунення несправностей кластерів
description: Налагодження поширених проблем кластера.
weight: 20
no_list: true
---

<!-- overview -->

Цей документ присвячено усуненню несправностей кластера; ми припускаємо, що ви вже виключили свій застосунок як першопричину проблеми, з якою стикаєтеся. Поради щодо налагодження застосунків дивіться в [посібнику з усунення несправностей застосунків](/docs/tasks/debug/debug-application/). Докладніше також дивіться [загальний документ з усунення несправностей](/docs/tasks/debug/).

Про усунення несправностей {{<glossary_tooltip text="kubectl" term_id="kubectl">}} дивіться [Усунення несправностей kubectl](/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/).

<!-- body -->

## Виведення інформації про кластер {#listing-your-cluster}

Перше, що слід перевірити під час налагодження кластера, — чи всі ваші вузли зареєстровано правильно.

Виконайте таку команду:

```shell
kubectl get nodes
```

І переконайтеся, що всі очікувані вузли присутні й перебувають у стані `Ready`.

Щоб отримати детальну інформацію про загальний стан вашого кластера, ви можете виконати:

```shell
kubectl cluster-info dump
```

### Приклад: налагодження вимкненого/недоступного вузла {#example-debugging-a-down-unreachable-node}

Іноді під час налагодження корисно переглянути стан вузла — наприклад, тому що ви помітили дивну поведінку Podʼа, який працює на вузлі, або щоб зʼясувати, чому Pod не призначається на вузол. Як і для Podʼів, для отримання детальної інформації про вузли можна використовувати `kubectl describe node` і `kubectl get node -o yaml`. Наприклад, ось що ви побачите, якщо вузол не працює (відʼєднаний від мережі, або kubelet завершився й не перезапускається тощо). Зверніть увагу на події, які показують, що вузол у стані NotReady, а також на те, що Podʼи більше не працюють (їх буде виселено після пʼяти хвилин у стані NotReady).

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
    message: kubelet is posting ready status
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

Наразі для глибшого дослідження кластера потрібно входити на відповідні машини. Ось розташування відповідних файлів логів. У системах на основі systemd замість перегляду файлів логів може знадобитися `journalctl`.

### Вузли панелі управління {#control-plane-nodes}

* `/var/log/kube-apiserver.log` — API-сервер, відповідальний за обслуговування API
* `/var/log/kube-scheduler.log` — планувальник, відповідальний за ухвалення рішень щодо планування
* `/var/log/kube-controller-manager.log` — компонент, який запускає більшість вбудованих {{<glossary_tooltip text="контролерів" term_id="controller">}} Kubernetes, за помітним винятком планування (плануванням займається kube-scheduler).

### Робочі вузли {#worker-nodes}

* `/var/log/kubelet.log` — логи kubelet, відповідального за запуск контейнерів на вузлі
* `/var/log/kube-proxy.log` — логи `kube-proxy`, відповідального за спрямування трафіку до точок доступу Service

## Режими відмови кластера {#cluster-failure-modes}

Це неповний перелік того, що може піти не так, і того, як змінити налаштування кластера, щоб помʼякшити проблеми.

### Причини відмов {#contributing-causes}

- Вимкнення віртуальних машин
- Розділення мережі всередині кластера або між кластером і користувачами
- Збої програмного забезпечення Kubernetes
- Втрата даних або недоступність постійного сховища (наприклад, томів GCE PD або AWS EBS)
- Помилка оператора, наприклад, неправильно налаштоване програмне забезпечення Kubernetes або застосунків

### Конкретні сценарії {#specific-scenarios}

- Вимкнення віртуальної машини API-сервера або збій apiserver
  - Результати
    - не вдається зупинити, оновити чи запустити нові Podʼи, Service, ReplicationController
    - наявні Podʼи та Service мають і далі працювати нормально, якщо вони не залежать від API Kubernetes
- Втрата сховища, що лежить в основі API-сервера
  - Результати
    - компонент kube-apiserver не може успішно запуститися й стати справним
    - kubelet не зможуть звʼязатися з ним, але й далі запускатимуть ті самі Podʼи та забезпечуватимуть те саме проксіювання Service
    - перед перезапуском apiserver необхідно вручну відновити або відтворити його стан
- Вимкнення віртуальних машин або збої допоміжних сервісів (контролер вузлів, менеджер контролерів реплікації, планувальник тощо)
  - наразі вони розміщені разом з apiserver, і їхня недоступність має схожі наслідки, як і недоступність apiserver
  - у майбутньому вони також будуть репліковані й можуть розміщуватися окремо
  - вони не мають власного постійного стану
- Вимкнення окремого вузла (віртуальної або фізичної машини)
  - Результати
    - Podʼи на цьому вузлі припиняють роботу
- Розділення мережі
  - Результати
    - розділ A вважає, що вузли в розділі B не працюють; розділ B вважає, що не працює apiserver. (За умови, що master VM опиниться в розділі A.)
- Збій програмного забезпечення kubelet
  - Результати
    - kubelet, що аварійно завершився, не може запускати нові Podʼи на вузлі
    - kubelet може видаляти Podʼи або ні
    - вузол позначається як несправний
    - ReplicationController запускають нові Podʼи в інших місцях
- Помилка оператора кластера
  - Результати
    - втрата Podʼів, Service тощо
    - втрата сховища, що лежить в основі apiserver
    - користувачі не можуть читати API
    - тощо

### Помʼякшення {#mitigations}

- Дія: використовуйте можливість автоматичного перезапуску віртуальних машин IaaS-провайдера для віртуальних машин IaaS
  - Помʼякшує: вимкнення віртуальної машини apiserver або збій apiserver
  - Помʼякшує: вимкнення віртуальних машин або збої допоміжних сервісів

- Дія: використовуйте надійне сховище IaaS-провайдера (наприклад, томи GCE PD або AWS EBS) для віртуальних машин з apiserver+etcd
  - Помʼякшує: втрату сховища, що лежить в основі apiserver

- Дія: використовуйте [конфігурацію з високою доступністю](/docs/setup/production-environment/tools/kubeadm/high-availability/)
  - Помʼякшує: вимкнення вузла панелі управління або збої компонентів панелі управління (планувальник, API-сервер, controller-manager)
    - Витримує одну або кілька одночасних відмов вузлів чи компонентів
  - Помʼякшує: втрату сховища, що лежить в основі API-сервера (тобто теки даних etcd)
    - Передбачає конфігурацію etcd з високою доступністю (HA)

- Дія: регулярно створюйте знімки томів PD/EBS apiserver
  - Помʼякшує: втрату сховища, що лежить в основі apiserver
  - Помʼякшує: деякі випадки помилок оператора
  - Помʼякшує: деякі випадки збоїв програмного забезпечення Kubernetes

- Дія: використовуйте ReplicationController і Service перед Podʼами
  - Помʼякшує: вимкнення вузла
  - Помʼякшує: збій програмного забезпечення kubelet

- Дія: застосунки (контейнери), спроєктовані так, щоб витримувати неочікувані перезапуски
  - Помʼякшує: вимкнення вузла
  - Помʼякшує: збій програмного забезпечення kubelet

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся про метрики, доступні в [конвеєрі метрик ресурсів](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
* Ознайомтеся з додатковими інструментами для [моніторингу використання ресурсів](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* Використовуйте Node Problem Detector для
  [моніторингу стану вузла](/docs/tasks/debug/debug-cluster/monitor-node-health/)
* Використовуйте `kubectl debug node` для [налагодження вузлів Kubernetes](/docs/tasks/debug/debug-cluster/kubectl-node-debug)
* Використовуйте `crictl` для [налагодження вузлів Kubernetes](/docs/tasks/debug/debug-cluster/crictl/)
* Отримайте більше інформації про [аудит Kubernetes](/docs/tasks/debug/debug-cluster/audit/)
* Використовуйте `telepresence` для [локальної розробки та налагодження сервісів](/docs/tasks/debug/debug-cluster/local-debugging/)
