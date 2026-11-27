---
title: Налагодження вузлів Kubernetes за допомогою kubectl
content_type: task
min-kubernetes-server-version: 1.20
weight: 40
---

<!-- overview -->

На цій сторінці показано, як налагоджувати [вузол](/docs/concepts/architecture/nodes/), що працює в кластері Kubernetes, за допомогою команди `kubectl debug`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібен дозвіл на створення Podʼів і призначення цих нових Podʼів довільним вузлам. Також вам потрібен дозвіл на створення Podʼів, які мають доступ до файлових систем хоста.

<!-- steps -->

## Налагодження вузла за допомогою `kubectl debug node` {#debugging-a-node-using-kubectl-debug-node}

Використовуйте команду `kubectl debug node`, щоб розгорнути Pod на вузлі, який ви хочете налагодити. Ця команда корисна в сценаріях, коли ви не можете отримати доступ до вузла через зʼєднання SSH. Після створення Pod відкриває інтерактивну оболонку на вузлі. Щоб створити інтерактивну оболонку на вузлі з назвою «mynode», виконайте:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```console
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@mynode:/#
```

Команда debug допомагає збирати інформацію та усувати проблеми. Ви можете використовувати, зокрема, команди `ip`, `ifconfig`, `nc`, `ping` і `ps`. Також можна встановити інші інструменти, як-от `mtr`, `tcpdump` і `curl`, з відповідного менеджера пакунків.

{{< note >}}

Команди для налагодження можуть відрізнятися залежно від образу, який використовує Pod налагодження, і ці команди можуть потребувати встановлення.

{{< /note >}}

Pod налагодження має доступ до кореневої файлової системи вузла, змонтованої в `/host` у Podʼі. Якщо kubelet працює в просторі імен файлової системи, Pod налагодження бачить корінь цього простору імен, а не всього вузла. Для типового вузла Linux відповідні логи можна знайти за такими шляхами:

`/host/var/log/kubelet.log`
: Логи `kubelet`, який відповідає за запуск контейнерів на вузлі.

`/host/var/log/kube-proxy.log`
: Логи `kube-proxy`, який відповідає за направлення трафіку на точки доступу Service.

`/host/var/log/containerd.log`
: Логи процесу `containerd`, який працює на вузлі.

`/host/var/log/syslog`
: Показує загальні повідомлення та інформацію щодо системи.

`/host/var/log/kern.log`
: Показує логи ядра.

Створюючи сеанс налагодження на вузлі, майте на увазі, що:

* `kubectl debug` автоматично генерує назву нового Podʼа на основі назви вузла.
* Коренева файлова система вузла буде змонтована в `/host`.
* Хоча контейнер працює в просторах імен IPC, Network і PID хоста, Pod не є привілейованим. Це означає, що читання деякої інформації про процеси може завершитися невдачею, оскільки доступ до неї мають лише суперкористувачі. Наприклад, `chroot /host` не вдасться. Якщо вам потрібен привілейований Pod, створіть його вручну або використовуйте прапорець `--profile=sysadmin`.
* Застосовуючи [профілі налагодження](/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles), ви можете встановити для Podʼа налагодження певні властивості, як-от [securityContext](/docs/tasks/configure-pod-container/security-context/).

## {{% heading "cleanup" %}} {#cleaning-up}

Коли ви закінчите використання Podʼа налагодження, видаліть його:

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```

```shell
# Змініть назву Podʼа відповідно
kubectl delete pod node-debugger-mynode-pdx84 --now
```

```none
pod "node-debugger-mynode-pdx84" deleted
```

{{< note >}}

Команда `kubectl debug node` не працюватиме, якщо вузол не працює (відʼєднаний від мережі, або kubelet зупинився й не перезапускається тощо). У такому разі дивіться [налагодження вузла, що не працює або недоступний](/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node).

{{< /note >}}
