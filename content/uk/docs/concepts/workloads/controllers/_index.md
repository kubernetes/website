---
title: "Керування навантаженням"
weight: 20
simple_list: true
---

Kubernetes надає кілька вбудованих API для декларативного керування вашими {{< glossary_tooltip text="робочими навантаженнями" term_id="workload" >}} та їх компонентами.

У кінцевому підсумку ваші застосунки працюють як контейнери всередині {{< glossary_tooltip term_id="Pod" text="Podʼів" >}}; однак керування окремими Podʼами вимагало б багато зусиль. Наприклад, якщо Pod зазнає збою, ви, ймовірно, захочете запустити новий Pod для його заміни. Kubernetes може зробити це за вас.

Ви використовуєте API Kubernetes для створення {{< glossary_tooltip text="обʼєкта" term_id="object" >}} робочого навантаження, який представляє вищий рівень абстракції, ніж Pod, а потім {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} Kubernetes автоматично керує обʼєктами Pod від вашого імені, відповідно до специфікації обʼєкта робочого навантаження, яку ви визначили.

Вбудовані API для керування робочими навантаженнями:

[Deployment](/docs/concepts/workloads/controllers/deployment/) (і, опосередковано, [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)), найпоширеніший спосіб запуску застосунку у вашому кластері. Deployment є хорошим вибором для керування робочим навантаженням, яке не зберігає стану, де будь-який Pod у Deployment є взаємозамінним і може бути замінений, якщо це потрібно. (Deployments є заміною застарілого API {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).

[StatefulSet](/docs/concepts/workloads/controllers/statefulset/) дозволяє вам керувати одним або кількома Podʼами, які виконують один і той самий код застосунку, де Podʼи покладаються на наявність окремої ідентичності. Це відрізняється від Deployment, де очікується, що Podʼи будуть взаємозамінними. Найпоширеніше використання StatefulSet полягає в тому, щоб забезпечити звʼязок між Podʼами та їх постійним сховищем. Наприклад, ви можете запустити StatefulSet, який повʼязує кожен Pod із [PersistentVolume](/docs/concepts/storage/persistent-volumes/). Якщо один з Podʼів у StatefulSet зазнає збою, Kubernetes створює Pod-замінник, підключений до того самого PersistentVolume.

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) визначає Podʼи, які надають можливості, що є локальними для конкретного {{< glossary_tooltip text="вузла" term_id="node" >}}; наприклад, драйвер, який дозволяє контейнерам на цьому вузлі отримувати доступ до системи зберігання. Ви використовуєте DaemonSet, коли драйвер або інший сервіс рівня вузла має працювати на вузлі, де він корисний. Кожен Pod в DaemonSet виконує роль, схожу на системний демон на класичному сервері Unix/POSIX. DaemonSet може бути фундаментальним для роботи вашого кластера, наприклад, як втулок, який надає цьому вузлу доступ до [мережі кластера](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model), він може допомогти вам керувати вузлом, або надати менш важливі можливості, які покращують платформу контейнерів, яку ви використовуєте. Ви можете запускати DaemonSets (та їхні Podʼи) на кожному вузлі вашого кластера або лише на підмножині (наприклад, встановити драйвер прискорювача GPU лише на вузлах, де встановлено GPU).

Ви можете використовувати [Job](/docs/concepts/workloads/controllers/job/) та/або [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) для визначення завдань, які виконуються до завершення та зупиняються. Job представляє одноразове завдання, тоді як кожен CronJob повторюється згідно з розкладом.

Інші теми в цьому розділі:

<!-- relies on simple_list: true in the front matter -->
