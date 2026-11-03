---
title: Міграція агентів телеметрії та безпеки з dockershim
content_type: task
weight: 60
---

<!-- overview -->

{{% thirdparty-content %}}

Підтримку прямої інтеграції Kubernetes з Docker Engine визнано застарілою та видалено. Більшість застосунків не мають прямої залежності від середовища виконання, у якому працюють контейнери. Однак є ще багато агентів телеметрії та моніторингу, які залежать від Docker для збору метаданих, логів та метрик контейнерів. Цей документ збирає інформацію про те, як виявити ці залежності, а також посилання на те, як перевести ці агенти на загальні інструменти або альтернативні середовища виконання.

## Агенти телеметрії та безпеки {#telemetry-and-security-agents}

У кластері Kubernetes є кілька різних способів запуску агентів телеметрії чи безпеки. Деякі агенти мають пряму залежність від Docker Engine, коли вони працюють як DaemonSet або безпосередньо на вузлах.

### Чому деякі агенти телеметрії взаємодіють з Docker Engine? {#why-do-some-telemetry-agents-communicate-with-docker-engine}

Історично Kubernetes був спеціально створений для роботи з Docker Engine. Kubernetes займався мережею та плануванням, покладаючись на Docker Engine для запуску та виконання контейнерів (у Podʼах) на вузлі. Деяка інформація, яка стосується телеметрії, наприклад, імʼя Podʼа, доступна лише з компонентів Kubernetes. Інші дані, такі як метрики контейнерів, не є обовʼязком середовища виконання контейнерів. Ранні агенти телеметрії мали запитувати середовище виконання контейнерів *та* Kubernetes, щоб отримати точну картину. З часом Kubernetes набув можливості підтримки кількох середовищ виконання контейнерів, і зараз підтримує будь-яке середовище виконання, сумісне з [інтерфейсом середовища виконання контейнерів](/docs/concepts/architecture/cri/).

Деякі агенти телеметрії покладаються саме на інструменти Docker Engine. Наприклад, агент може виконувати команду, таку як [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/) чи [`docker top`](https://docs.docker.com/engine/reference/commandline/top/), для отримання переліку контейнерів та процесів або [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/) для отримання потокових логів. Якщо вузли у вашому поточному кластері використовують Docker Engine, і ви переходите на інше середовище виконання контейнерів, ці команди більше не працюватимуть.

### Виявлення DaemonSet, що залежать від Docker Engine {#identify-docker-dependency}

Якщо Pod хоче викликати `dockerd`, що працює на вузлі, він повинен або:

- змонтувати файлову систему, що містить привілейований сокет демона Docker, як {{< glossary_tooltip text="том" term_id="volume" >}}; або
- безпосередньо змонтувати конкретний шлях привілейованого сокета демона Docker, також як том.

Наприклад: на образах COS Docker відкриває свій сокет домену Unix у `/var/run/docker.sock`. Це означає, що специфікація Podʼа міститиме монтування тому `hostPath` з `/var/run/docker.sock`.

Нижче наведено приклад сценарію оболонки для пошуку Podʼів, які мають монтування, що безпосередньо відображає сокет Docker. Цей сценарій виводить простір імен та імʼя Podʼа. Ви можете видалити `grep '/var/run/docker.sock'`, щоб переглянути інші монтування.

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

{{< note >}}
Є альтернативні способи для Podʼа отримати доступ до Docker на хості. Наприклад, замість повного шляху може бути змонтована батьківська тека `/var/run` (як у [цьому прикладі](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)). Наведений вище сценарій виявляє лише найпоширеніші випадки.
{{< /note >}}

### Виявлення залежності агентів вузлів від Docker {#detecting-docker-dependency-from-node-agents}

Якщо вузли вашого кластера налаштовані на свій лад і на них встановлено додаткові агенти безпеки та телеметрії, перевірте у постачальника агента, чи має він будь-які залежності від Docker.

### Постачальники агентів телеметрії та безпеки {#telemetry-and-security-agent-vendors}

Цей розділ призначений для збирання інформації про різноманітних агентів телеметрії та безпеки, які можуть мати залежність від середовищ виконання контейнерів.

Ми зберігаємо робочу версію інструкцій щодо перенесення для різних постачальників агентів телеметрії та безпеки у [документі Google](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#). Звʼяжіться з постачальником, щоб отримати актуальні інструкції щодо міграції з dockershim.

## Міграція з dockershim {#migration-from-dockershim}

### [Aqua](https://www.aquasec.com) {#aqua}

Ніяких змін не потрібно: все має працювати без проблем після зміни середовища виконання.

### [Datadog](https://www.datadoghq.com/product/) {#datadog}

Як перенести: [Застарівання Docker у Kubernetes](https://docs.datadoghq.com/agent/guide/docker-deprecation/) Pod, який має доступ до Docker Engine, може мати назву, яка містить будь-що з:

- `datadog-agent`
- `datadog`
- `dd-agent`

### [Dynatrace](https://www.dynatrace.com/) {#dynatrace}

Як перенести: [Міграція з метрик лише для Docker на загальні метрики контейнерів у Dynatrace](https://community.dynatrace.com/t5/Best-practices/Migrating-from-Docker-only-to-generic-container-metrics-in/m-p/167030#M49)

Оголошення підтримки Containerd: [Автоматична повна видимість у стеку в середовищах Kubernetes на основі containerd](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-containerd-based-kubernetes-environments/)

Оголошення підтримки CRI-O: [Автоматична повна видимість у ваших контейнерах Kubernetes з CRI-O (бета)](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-your-cri-o-kubernetes-containers-beta/)

Pod, який має доступ до Docker, може мати назву, яка містить:

- `dynatrace-oneagent`

### [Falco](https://falco.org) {#falco}

Як перенести:

[Міграція Falco з dockershim](https://falco.org/docs/getting-started/deployment/#docker-deprecation-in-kubernetes). Falco підтримує будь-яке середовище виконання, сумісне з CRI (стандартна конфігурація використовує containerd); документація пояснює всі деталі. Pod, який має доступ до Docker, може мати назву, яка містить:

- `falco`

### [Prisma Cloud Compute](https://docs.paloaltonetworks.com/prisma/prisma-cloud.html) {#prisma-cloud-compute}

Перевірте [документацію для Prisma Cloud](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin-compute/install/install_kubernetes.html), в розділі "Встановлення Prisma Cloud в кластер CRI (не Docker)". Pod, який має доступ до Docker, може мати назву, подібну до:

- `twistlock-defender-ds`

### [SignalFx (Splunk)](https://www.splunk.com/en_us/investor-relations/acquisitions/signalfx.html) {#signalfx-splunk}

Смарт-агент SignalFx (застарілий) використовує кілька різних моніторів для Kubernetes, зокрема `kubernetes-cluster`, `kubelet-stats/kubelet-metrics` та `docker-container-stats`. Монітор `kubelet-stats` раніше було визнано постачальником застарілим на користь `kubelet-metrics`. Саме монітор `docker-container-stats` зачіпає видалення dockershim. Не використовуйте монітор `docker-container-stats` з середовищами виконання контейнерів, відмінними від Docker Engine.

Як перейти з агента, залежного від dockershim:

1. Видаліть `docker-container-stats` зі списку [налаштованих моніторів](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitor-config.md). Зверніть увагу, що залишений увімкненим монітор із середовищем виконання без dockershim надсилатиме неправильні метрики, коли docker встановлено на вузлі, і не надсилатиме метрик, коли docker не встановлено.
2. [Увімкніть та налаштуйте монітор `kubelet-metrics`](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitors/kubelet-metrics.md).

{{< note >}}
Набір зібраних метрик зміниться. Перегляньте ваші правила сповіщень та дашборди.
{{< /note >}}

Pod, який має доступ до Docker, може мати назву, подібну до:

- `signalfx-agent`

### Yahoo Kubectl Flame {#yahoo-kubectl-flame}

Flame не підтримує середовищ виконання контейнерів, відмінних від Docker. Див. [https://github.com/yahoo/kubectl-flame/issues/51](https://github.com/yahoo/kubectl-flame/issues/51)
