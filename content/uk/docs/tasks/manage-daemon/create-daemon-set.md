---
title: Створення базового DaemonSet
content_type: task
weight: 5
---
<!-- overview -->

На цій сторінці показано, як створити базовий {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, який запускає Pod на кожному вузлі кластера Kubernetes. Вона охоплює простий сценарій монтування файлу з хоста, логування його вмісту за допомогою [init-контейнера](/docs/concepts/workloads/pods/init-containers/) і використання контейнера pause.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Кластер Kubernetes щонайменше з двома вузлами (один вузол панелі управління та один робочий вузол), щоб продемонструвати поведінку DaemonSets.

## Визначення DaemonSet {#define-the-daemonset}

У цьому завданні створюється базовий DaemonSet, який гарантує, що копія Podʼа планується на кожен вузол. Pod використовуватиме init-контейнер для читання й логування вмісту `/etc/machine-id` з хоста, а основним контейнером буде контейнер `pause`, який підтримує роботу Podʼа.

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. Створіть DaemonSet на основі маніфесту (YAML):

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

1. Після застосування ви можете перевірити, що DaemonSet запускає Pod на кожному вузлі кластера:

   ```shell
   kubectl get pods -o wide
   ```

   Вивід міститиме по одному Podʼу на вузол, наприклад:

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

1. Ви можете переглянути вміст залогованого файлу `/etc/machine-id`, перевіривши теку логів, змонтовану з хоста:

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```

   Де `<pod-name>` — назва одного з ваших Podʼів.

## {{% heading "cleanup" %}} {#cleaning-up}

Щоб видалити DaemonSet, виконайте цю команду:

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

Цей простий приклад DaemonSet знайомить із ключовими компонентами, такими як init-контейнери й томи hostPath, які можна розширювати для складніших сценаріїв. Докладніше дивіться [DaemonSet](/docs/concepts/workloads/controllers/daemonset/).

## {{% heading "whatsnext" %}} {#what-s-next}

* Дивіться [Виконання поетапного оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/)
* Дивіться [Створення DaemonSet для прийняття наявних Podʼів DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
