---
title: Створення базового DaemonSet
content_type: task
weight: 5
---
<!-- overview -->

Ця сторінка демонструє, як створити базовий {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, який запускає Pod на кожному вузлі в кластері Kubernetes. Вона охоплює простий випадок монтування файлу з хоста, запису його вмісту за допомогою [контейнера ініціалізації](/docs/concepts/workloads/pods/init-containers/) та використання контейнера паузи.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Кластер Kubernetes з принаймні двома вузлами (один вузол панелі управління та один робочий вузол), щоб продемонструвати поведінку DaemonSets.

## Визначення DaemonSet {#define-the-daemonset}

У цьому завданні створюється базовий DaemonSet, який забезпечує, що копія Pod запланована на кожному вузлі. Pod буде використовувати контейнер ініціалізації для читання та запису вмісту `/etc/machine-id` з хосту, у той час, як основний контейнер буде контейнером `pause`, який підтримує роботу Pod.

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. Створіть DaemonSet на основі (YAML) маніфесту:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

2. Після застосування ви можете перевірити, що DaemonSet запускає Pod на кожному вузлі в кластері:

   ```shell
   kubectl get pods -o wide
   ```

   Вивід покаже один Pod на кожному вузлі, подібно до:

   ```none
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

3. Ви можете перевірити вміст записаного файлу `/etc/machine-id`, перевіривши теку журналів, змонтований з хоста:

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```

   Де `<pod-name>` - це імʼя одного з ваших Pod.

## {{% heading "cleanup" %}}

Щоб видалити DaemonSet, виконайте цю команду:

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

Цей простий приклад DaemonSet вводить ключові компоненти, такі як контейнери ініціалізації та томи шляху хосту, які можна розширити для складніших випадків використання. Для отримання додаткової інформації зверніться до [DaemonSet](/docs/concepts/workloads/controllers/daemonset/).

## {{% heading "whatsnext" %}}

* Дивіться [Виконання поступового оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/)
* Дивіться [Створення DaemonSet для усиновлення наявних Pod DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
