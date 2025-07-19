---
title: "Керування навантаженням"
weight: 20
simple_list: true
---

Kubernetes надає кілька вбудованих API для декларативного керування вашими {{< glossary_tooltip text="робочими навантаженнями" term_id="workload" >}} та їх компонентами.

У кінцевому підсумку ваші застосунки працюють як контейнери всередині {{< glossary_tooltip term_id="Pod" text="Podʼів" >}}; однак керувати окремими Podʼами вимагало б багато зусиль. Наприклад, якщо Pod зазнає збою, ви, ймовірно, захочете запустити новий Pod для його заміни. Kubernetes може зробити це за вас.

Ви використовуєте API Kubernetes для створення робочого {{< glossary_tooltip text="обʼєкта" term_id="object" >}}, який представляє вищий рівень абстракції, ніж Pod, а потім Kubernetes {{< glossary_tooltip text="control plane" term_id="control-plane" >}} автоматично керує обʼєктами Pod від вашого імені, відповідно до специфікації обʼєкта робочого навантаження, яку ви визначили.

Вбудовані API для керування робочими навантаженнями:

[Deployment](/docs/concepts/workloads/controllers/deployment/) (і, опосередковано, [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)), найпоширеніший спосіб запуску застосунку у вашому кластері. Deployment є хорошим вибором для керування робочим навантаженням, яке не зберігає стану, де будь-який Pod у Deployment може бути замінений, якщо це потрібно. (Deployments є заміною застарілого API {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).

[StatefulSet](/docs/concepts/workloads/controllers/statefulset/) дозволяє вам керувати одним або кількома Pod, які виконують один і той же код застосунку, де Pod мають унікальну ідентичність. Це відрізняється від Deployment, де очікується, що Pod будуть взаємозамінними. Найпоширеніше використання StatefulSet полягає в тому, щоб забезпечити звʼязок між Pod та їх постійним сховищем. Наприклад, ви можете запустити StatefulSet, який асоціює кожен Pod з [PersistentVolume](/docs/concepts/storage/persistent-volumes/). Якщо один з Pod у StatefulSet зазнає збою, Kubernetes створює новий Pod, який підключений до того ж PersistentVolume.

[DemonSet](/docs/concepts/workloads/controllers/daemonset/) визначає Podʼи, які надають можливості, що є локальними для конкретного {{< glossary_tooltip text="вузла" term_id="node" >}}; наприклад, драйвер, який дозволяє контейнерам на цьому вузлі отримувати доступ до системи сховища. Ви використовуєте DemonSet, коли драйвер або інша служба рівня вузла має працювати на вузлі, де вона корисна. Кожен Pod в DemonSet виконує роль, схожу на системний демон на класичному сервері Unix/POSIX. DemonSet може бути фундаментальним для роботи вашого кластера, наприклад, як втулок [мережі кластера](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model), він може допомогти вам керувати вузлом, або надати додаткову поведінку, яка розширює платформу контейнерів, яку ви використовуєте. Ви можете запускати DemonSet (і їх Podʼи) на кожному вузлі вашого кластера, або лише на підмножині (наприклад, встановити драйвер прискорювача GPU лише на вузлах, де встановлено GPU).

Ви можете використовувати [Job](/docs/concepts/workloads/controllers/job/) та / або [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) для визначення завдань, які виконуються до завершення та зупиняються. Job представляє одноразове завдання, тоді як кожен CronJob повторюється згідно з розкладом.

Інші теми в цьому розділі:

<!-- relies on simple_list: true in the front matter -->
