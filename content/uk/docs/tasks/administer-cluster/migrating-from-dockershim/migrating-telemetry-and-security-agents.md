---
title: Міграція агентів телеметрії та безпеки з dockershim
content_type: task
weight: 60
---

<!-- overview -->

{{% thirdparty-content %}}

Підтримка Kubernetes прямої інтеграції з Docker Engine є застарілою та була видалена. Більшість застосунків не мають прямої залежності від середовища виконання контейнерів. Однак, є ще багато агентів телеметрії та моніторингу, які мають залежність від Docker для збору метаданих, логів та метрик контейнерів. Цей документ збирає інформацію про те, як виявити ці залежності, а також посилання на те, як перенести ці агенти для використання загальних інструментів або альтернативних середовищ виконання.

## Агенти телеметрії та безпеки {#telemetry-and-security-agents}

У кластері Kubernetes є кілька різних способів запуску агентів телеметрії чи безпеки. Деякі агенти мають пряму залежність від Docker Engine, коли вони працюють як DaemonSets або безпосередньо на вузлах.

### Чому деякі агенти телеметрії взаємодіють з Docker Engine? {#why-do-some-telemetry-agents-communicate-with-docker-engine}

Історично Kubernetes був спеціально створений для роботи з Docker Engine. Kubernetes займався мережею та плануванням, покладаючись на Docker Engine для запуску та виконання контейнерів (у Podʼах) на вузлі. Деяка інформація, яка стосується телеметрії, наприклад, імʼя Podʼа, доступна лише з компонентів Kubernetes. Інші дані, такі як метрики контейнерів, не є обовʼязком середовища виконання контейнера. Ранні агенти телеметрії мали потребу у запиті середовища виконання контейнера *та* Kubernetes для передачі точної картини. З часом Kubernetes набув можливості підтримки кількох середовищ виконання контейнерів, і зараз підтримує будь-яке середовище виконання, яке сумісне з [інтерфейсом середовища виконання контейнерів](/docs/concepts/architecture/cri/).

Деякі агенти телеметрії покладаються тільки на інструменти Docker Engine. Наприклад, агент може виконувати команду, таку як [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/) чи [`docker top`](https://docs.docker.com/engine/reference/commandline/top/) для отримання переліку контейнерів та процесів або [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/) для отримання поточних логів. Якщо вузли у вашому проточному кластері використовують Docker Engine, і ви переходите на інше середовище виконання контейнерів, ці команди більше не працюватимуть.

### Виявлення DaemonSets, що залежать від Docker Engine {#identify-docker-dependency}

Якщо Pod хоче викликати `dockerd`, що працює на вузлі, він повинен або:

- змонтувати файлову систему, що містить привілейований сокет Docker, як {{< glossary_tooltip text="том" term_id="volume" >}}; або
- безпосередньо змонтувати конкретний шлях привілейованого сокета Docker, також як том.

Наприклад: на образах COS Docker відкриває свій Unix сокет у `/var/run/docker.sock`. Це означає, що специфікація Pod буде містити монтування тому `hostPath` з `/var/run/docker.sock`.

Нижче наведено приклад сценарію оболонки для пошуку Podʼів, які мають монтування, які безпосередньо зіставляються з сокетом Docker. Цей сценарій виводить простір імен та імʼя Podʼа. Ви можете видалити `grep '/var/run/docker.sock'`, щоб переглянути інші монтування.

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

{{< note >}}
Є альтернативні способи для Pod мати доступ до Docker на вузлі. Наприклад, батьківська тека `/var/run` може бути змонтована замість повного шляху (як у [цьому прикладі](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)). Представлений вище сценарій виявляє лише найпоширеніші використання.
{{< /note >}}

### Виявлення залежності від Docker агентів вузлів {#detecting-docker-dependency-from-node-agents}

Якщо вузли кластера налаштовані та встановлюють додаткові заходи безпеки та агенти телеметрії на вузлі, перевірте у вендора агента, чи має він будь-які залежності від Docker.

### Вендори агентів телеметрії та безпеки {#telemetry-and-security-agents-vendors}

Цей розділ призначений для збирання інформації про різноманітних агентів телеметрії та безпеки, які можуть мати залежність від середовищ виконання контейнерів.

Ми зберігаємо робочу версію інструкцій щодо перенесення для різних вендорів агентів телеметрії та безпеки у [документі Google](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#). Будь ласка, звʼяжіться з вендором, щоб отримати актуальні інструкції щодо міграції з dockershim.

## Міграція з dockershim {#migration-from-dockershim}

### [Aqua](https://www.aquasec.com) {#aqua}

Ніяких змін не потрібно: все має працювати без перешкод при перемиканні середовища виконання.

### [Datadog](https://www.datadoghq.com/product/) {#datadog}

Як перенести: [Застарівання Docker у Kubernetes](https://docs.datadoghq.com/agent/guide/docker-deprecation/) Pod, який має доступ до Docker Engine, може мати назву, яка містить будь-що з:

- `datadog-agent`
- `datadog`
- `dd-agent`

### [Dynatrace](https://www.dynatrace.com/) {#dynatrace}

Як перенести: [Міграція з Docker до загальних метрик контейнера в Dynatrace](https://community.dynatrace.com/t5/Best-practices/Migrating-from-Docker-only-to-generic-container-metrics-in/m-p/167030#M49)

Оголошення підтримки Containerd: [Автоматична повна видимість у стеку в середовищах Kubernetes на основі containerd](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-containerd-based-kubernetes-environments/)

Оголошення підтримки CRI-O: [Автоматична повна видимість у ваших контейнерах Kubernetes з CRI-O (бета)](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-your-cri-o-kubernetes-containers-beta/)

Pod, який має доступ до Docker, може мати назву, яка містить:

- `dynatrace-oneagent`

### [Falco](https://falco.org) {#falco}

Як перенести: [Міграція Falco з dockershim](https://falco.org/docs/getting-started/deployment/#docker-deprecation-in-kubernetes). Falco підтримує будь-яке середовище виконання, сумісне з CRI (стандартно використовується containerd); документація пояснює всі деталі. Pod, який має доступ до Docker, може мати назву, яка містить:

- `falco`

### [Prisma Cloud Compute](https://docs.paloaltonetworks.com/prisma/prisma-cloud.html) {#prisma-cloud-compute}

Перевірте [документацію для Prisma Cloud](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin-compute/install/install_kubernetes.html), в розділі "Встановлення Prisma Cloud в кластер CRI (не Docker)". Pod, який має доступ до Docker, може мати назву, подібну до:

- `twistlock-defender-ds`

### [SignalFx (Splunk)](https://www.splunk.com/en_us/investor-relations/acquisitions/signalfx.html) {#signalfx-splunk}

Смарт-агент SignalFx (застарілий) використовує кілька різних моніторів для Kubernetes, включаючи `kubernetes-cluster`, `kubelet-stats/kubelet-metrics` та `docker-container-stats`. Монітор `kubelet-stats` раніше був застарілим вендором на користь `kubelet-metrics`. Монітор `docker-container-stats` є одним з тих, що стосуються видалення dockershim. Не використовуйте монітор `docker-container-stats` з середовищами виконання контейнерів, відмінними від Docker Engine.

Як перейти з агента, залежного від dockershim:

1. Видаліть `docker-container-stats` зі списку [налаштованих моніторів](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitor-config.md). Зверніть увагу, що залишення цього монітора увімкненим з не-dockershim середовищем виконання призведе до неправильних метрик при встановленні docker на вузлі та відсутності метрик, коли docker не встановлено.
2. [Увімкніть та налаштуйте монітор `kubelet-metrics`](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitors/kubelet-metrics.md).

{{< note >}}
Набір зібраних метрик зміниться. Перегляньте ваші правила сповіщень та інфопанелі.
{{< /note >}}

Pod, який має доступ до Docker, може мати назву, подібну до:

- `signalfx-agent`

### Yahoo Kubectl Flame {#yahoo-kubectl-flame}

Flame не підтримує середовищ виконання контейнера, відмінні від Docker. Див. [https://github.com/yahoo/kubectl-flame/issues/51](https://github.com/yahoo/kubectl-flame/issues/51)
