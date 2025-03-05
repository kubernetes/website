---
title: "Міграція з dockershim"
weight: 20
content_type: task
no_list: true
---

<!-- overview -->

Цей розділ містить інформацію, яку вам потрібно знати при міграції з dockershim на інші оточення виконання контейнерів.

Після оголошення про [застарівання dockershim](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) в Kubernetes 1.20, виникли питання, як це вплине на різні робочі навантаження та розгортання самого Kubernetes. Наш [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) допоможе вам краще зрозуміти проблему.

Dockershim був видалений з Kubernetes з випуском v1.24. Якщо ви використовуєте Docker Engine через dockershim як своє оточення виконання контейнерів і хочете оновитись до v1.24, рекомендується або мігрувати на інше оточення виконання, або знайти альтернативний спосіб отримання підтримки Docker Engine. Ознайомтеся з розділом [оточення виконання контейнерів](/docs/setup/production-environment/container-runtimes/), щоб дізнатися про ваші варіанти.

Версія Kubernetes з dockershim (1.23) вийшла з стану підтримки, а v1.24 [скоро](/releases/#release-v1-24) вийде зі стану підтримки. Переконайтеся, що [повідомляєте про проблеми](https://github.com/kubernetes/kubernetes/issues) з міграцією, щоб проблеми могли бути вчасно виправлені, і ваш кластер був готовий до видалення dockershim. Після виходу v1.24 зі стану підтримки вам доведеться звертатися до вашого постачальника Kubernetes за підтримкою або оновлювати кілька версій одночасно, якщо є критичні проблеми, які впливають на ваш кластер.

Ваш кластер може мати більше одного типу вузлів, хоча це не є загальною конфігурацією.

Ці завдання допоможуть вам здійснити міграцію:

* [Перевірте, чи вас стосується видалення dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
* [Міграція телеметрії та агентів безпеки з dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)

## {{% heading "whatsnext" %}}

* Ознайомтеся з [оточеннями виконання контейнерів](/docs/setup/production-environment/container-runtimes/), щоб зрозуміти які з варіантів вам доступні.
* Якщо ви знайшли дефект або іншу технічну проблему, повʼязану з відмовою від dockershim, ви можете [повідомити про проблему](https://github.com/kubernetes/kubernetes/issues/new/choose) проєкту Kubernetes.
