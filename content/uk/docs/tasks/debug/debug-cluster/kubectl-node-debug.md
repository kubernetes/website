---
title: Налагодження вузлів Kubernetes за допомогою kubectl
content_type: task
min-kubernetes-server-version: 1.20
weight: 40
---

<!-- overview -->

Ця сторінка показує, як налагоджувати [вузол](/docs/concepts/architecture/nodes/) на кластері Kubernetes за допомогою команди `kubectl debug`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Вам потрібно мати дозвіл на створення Podʼів та призначення їх новим Вузлам. Також вам потрібно мати дозвіл на створення Podʼів, які мають доступ до файлових систем з хосту.

<!-- steps -->

## Налагодження вузла за допомогою `kubectl debug node` {#debugging-a-node-using-kubectl-debug-node}

Використовуйте команду `kubectl debug node`, щоб розмістити Pod на Вузлі, який ви хочете налагодити. Ця команда корисна в сценаріях, коли ви не можете отримати доступ до свого Вузла за допомогою зʼєднання SSH. Після створення Podʼа, відкривається інтерактивний інтерфейс оболонки на Вузлі. Щоб створити інтерактивну оболонку на Вузлі з назвою “mynode”, виконайте:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```console
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@mynode:/#
```

Команда налагоджування допомагає збирати інформацію та розвʼязувати проблеми. Команди, які ви можете використовувати, включають `ip`, `ifconfig`, `nc`, `ping`, `ps` тощо. Ви також можете встановити інші інструменти, такі як `mtr`, `tcpdump` та `curl`, з відповідного менеджера пакунків.

{{< note >}}

Команди для налагодження можуть відрізнятися залежно від образу, який використовує Pod налагодження, і ці команди можуть потребувати встановлення.

{{< /note >}}

Pod налагодження може отримувати доступ до кореневої файлової системи Вузла, підключеної за адресою `/host` в Podʼі. Якщо ви використовуєте kubelet у просторі імен файлової системи, Pod налагодження бачить корінь для цього простору імен, а не всього Вузла. Для типового вузла Linux ви можете переглянути наступні шляхи для пошуку відповідних логів:

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

При створенні сеансу налагодження на Вузлі майте на увазі, що:

* `kubectl debug` автоматично генерує імʼя нового контейнера на основі імені вузла.
* Коренева файлова система Вузла буде змонтована за адресою `/host`.
* Хоча контейнер працює у просторі імен IPC, мережі та PID хосту, Pod не є привілейованим. Це означає, що читання деякої інформації про процес може бути неможливим, оскільки доступ до цієї інформації мають тільки суперкористувачі. Наприклад, `chroot /host` буде невдалим. Якщо вам потрібен привілейований контейнер, створіть його вручну або використовуйте прапорець `--profile=sysadmin`.
* Застосовуючи [профілі налагодження](/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles), ви можете встановити конкретні властивості, такі як [securityContext](/docs/tasks/configure-pod-container/security-context/) до Podʼу налагодження.

## {{% heading "cleanup" %}}

Коли ви закінчите використання Podʼа налагодження, видаліть його:

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```

```shell
# Змініть імʼя контейнера відповідно
kubectl delete pod node-debugger-mynode-pdx84 --now
```

```none
pod "node-debugger-mynode-pdx84" deleted
```

{{< note >}}

Команда `kubectl debug node` не працюватиме, якщо Вузол відключений (відʼєднаний від мережі, або kubelet вимкнено і він не перезапускається тощо). Перевірте [налагодження вимкненого/недоступного вузла](/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node) в цьому випадку.

{{< /note >}}
