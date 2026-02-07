---
title: "Робочі навантаження"
weight: 55
description: >
  Отримайте розуміння про Podʼи, найменші обʼєкти виконання в Kubernetes, та вищі рівні абстракції, які допомагають вам їх запускати.
no_list: true
card:
  title: Робочі навантаження та Podʼи
  name: concepts
  weight: 60
---

{{< glossary_definition term_id="workload" length="short" >}}
Неважливо чи є ваше робоче навантаження одним компонентом, чи кількома, які працюють разом, в Kubernetes ви запускаєте його всередині набору [_Podʼів_](/docs/concepts/workloads/pods). В Kubernetes Pod представляє набір запущених {{< glossary_tooltip text="контейнерів" term_id="container" >}} у вашому кластері.

Podʼи Kubernetes мають [кінцевий життєвий цикл](/docs/concepts/workloads/pods/pod-lifecycle/). Наприклад, як тільки Pod запущено у вашому кластері, будь-яка критична помилка на {{< glossary_tooltip text="вузлі" term_id="node" >}}, де запущено цей Pod, означає, що всі Podʼи на цьому вузлі зазнають збою. Kubernetes розглядає цей рівень збою як кінцевий: вам потрібно створити новий Pod, щоб відновити роботу, навіть якщо вузол пізніше відновить свою роботу.

Однак, керувати кожним Pod окремо може бути складно. Замість цього, ви можете використовувати _ресурси робочого навантаження_, які керують набором Podʼів за вас. Ці ресурси налаштовують {{< glossary_tooltip term_id="controller" text="контролери" >}}, які переконуються, що правильна кількість Podʼів потрібного виду працює, щоб відповідати стану, який ви вказали.

Kubernetes надає кілька вбудованих ресурсів робочого навантаження:

* [Deployment](/docs/concepts/workloads/controllers/deployment/) та [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) (що є заміною застарілого типу ресурсу {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}). Deployment є хорошим вибором для керування робочим навантаженням, яке не зберігає стану, де будь-який Pod у Deployment може бути замінений, якщо це потрібно.
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) дозволяє вам запускати один або кілька повʼязаних Podʼів, які відстежують стан певним чином. Наприклад, якщо ваше робоче навантаження постійно записує дані, ви можете запустити StatefulSet, який поєднує кожен Pod з [PersistentVolume](/docs/concepts/storage/persistent-volumes/). Ваш код, який працює в Pod для цього StatefulSet, може реплікувати дані на інші Podʼи в цьому StatefulSet, щоб покращити загальну надійність.
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) визначає Podʼи які надають можливості, що є локальними для вузлів. Кожного разу, коли ви додаєте вузол до свого кластера, який відповідає специфікації в DaemonSet, панель управління планує Pod для цього DaemonSet на новому вузлі. Кожен Pod в DaemonSet виконує роботу, схожу на роботу системного демона у класичному Unix/POSIX сервері. DaemonSet може бути фундаментальним для роботи вашого кластера, як, наприклад, втулок [мережі кластера](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model), він може допомогти вам керувати вузлом, або надати додаткову поведінку, яка розширює платформу контейнерів, яку ви використовуєте.
* [Job](/docs/concepts/workloads/controllers/job/) та [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) надають різні способи визначення завдань, які виконуються до завершення та зупиняються. Ви можете використовувати [Job](/docs/concepts/workloads/controllers/job/) для визначення завдання, яке виконується до завершення, тільки один раз. Ви можете використовувати [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) для запуску того ж Job кілька разів згідно з розкладом.

В екосистемі Kubernetes ви можете знайти ресурси робочого навантаження від сторонніх розробників, які надають додаткові можливості. Використовуючи [визначення власних ресурсів](/docs/concepts/extend-kubernetes/api-extension/custom-resources/), ви можете додати ресурс робочого навантаження від стороннього розробника, якщо ви хочете використовувати конкретну функцію, яка не є частиною основної функціональності Kubernetes. Наприклад, якщо ви хочете запустити групу Podʼів для вашого застосунку, але зупинити роботу незалежно від того, чи доступні _всі_ Podʼи (можливо, для якогось розподіленого завдання великого обсягу), ви можете реалізувати або встановити розширення, яке надає цю функцію.

## Розміщення Workload {#workload-placement}

{{< feature-state feature_gate_name="GenericWorkload" >}}

В той час як звичайні ресурси робочого навантаження (наприклад, Deployments та Jobs) керують життєвим циклом Podʼів, ви можете мати складні вимоги до планування, де групи Podʼів мають бути розглянуті як єдиний об'єкт.

[API Workload](/docs/concepts/workloads/workload-api/) дозволяє вам визначити групу Podʼів і застосувати до них розширені політики планування, такі як [групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/). Це особливо корисно для пакетної обробки та робочих навантажень машинного навчання, де необхідне розміщення "все або нічого".

## {{% heading "whatsnext" %}}

 Так само як і дізнаючись про кожний різновид API для керування робочим навантаженням, ви можете дізнатись, як виконати конкретні завдання:

* [Запуск застосунку stateless використовуючи Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Запуск застосунку stateful як [одиничного екземпляру](/docs/tasks/run-application/run-single-instance-stateful-application/) чи як [реплікованого набору](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Викоання автоматизованих завдань з CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)

Щоб дізнатись про механізми Kubernetes для відокремлення коду від конфігурації, відвідайте сторінку [Конфігурація](/docs/concepts/configuration/).

Існують два концепти, які надають фонову інформацію про те, як Kubernetes керує Podʼами для застосунків:

* [Збір сміття](/docs/concepts/architecture/garbage-collection/) приводить до ладу обʼєкти у вашому кластері після того, як їх _власний ресурс_ був видалений.
* [Контролер _time-to-live after finished_](/docs/concepts/workloads/controllers/ttlafterfinished/) видаляє Jobʼи після того, як визначений час пройшов після їх завершення.

Як тільки ваш застосунок працює, ви, можливо, захочете зробити його доступними в Інтернеті як [Service](/docs/concepts/services-networking/service/) або, для вебзастосунків, використовуючи [Ingress](/docs/concepts/services-networking/ingress/).
