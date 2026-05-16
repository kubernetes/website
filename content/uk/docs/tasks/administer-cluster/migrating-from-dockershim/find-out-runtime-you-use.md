---
title: Перевірте, яке середовище виконання контейнерів використовується на вузлі
content_type: task
weight: 30
---

<!-- overview -->

На цій сторінці наведено кроки для визначення того, яке [середовище виконання контейнерів](/docs/setup/production-environment/container-runtimes/) використовують вузли у вашому кластері.

Залежно від того, як ви запускаєте свій кластер, середовище виконання контейнерів для вузлів може бути попередньо налаштованим або вам потрібно його налаштувати. Якщо ви використовуєте сервіс Kubernetes, що надається вам постачальником послуг, можуть існувати специфічні для нього способи перевірки того, яке середовище виконання контейнерів налаштоване для вузлів. Метод, описаний на цій сторінці, повинен працювати завжди, коли дозволяється виконання `kubectl`.

## {{% heading "prerequisites" %}}

Встановіть та налаштуйте `kubectl`. Див. розділ [Встановлення інструментів](/docs/tasks/tools/#kubectl) для отримання деталей.

## Визначте середовище виконання контейнерів, яке використовується на вузлі {#find-out-the-container-runtime-used-on-a-node}

Використовуйте `kubectl`, щоб отримати та показати інформацію про вузли:

```shell
kubectl get nodes -o wide
```

Вивід подібний до такого. Стовпець `CONTAINER-RUNTIME` виводить інформацію про середовище та його версію.

Для Docker Engine вивід схожий на цей:

```none
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```

Якщо ваше середовище показується як Docker Engine, це все одно не означає, що вас точно торкнеться видалення dockershim у Kubernetes v1.24. [Перевірте точку доступу середовища](#which-endpoint), щоб побачити, чи використовуєте ви dockershim. Якщо ви не використовуєте dockershim, вас це не стосується.

Для containerd вивід схожий на цей:

```none
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

Дізнайтеся більше інформації про середовища виконання контейнерів на сторінці [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/).

## Дізнайтеся, яку точку доступу середовища виконання контейнерів ви використовуєте {#which-endpoint}

Середовище виконання контейнерів спілкується з kubelet через Unix-сокет, використовуючи [протокол CRI](/docs/concepts/architecture/cri/), який базується на фреймворку gRPC. Kubelet діє як клієнт, а середовище — як сервер. У деяких випадках може бути корисно знати, який сокет використовується на ваших вузлах. Наприклад, з видаленням dockershim у Kubernetes v1.24 і пізніше ви, можливо, захочете знати, чи використовуєте ви Docker Engine з dockershim.

{{<note>}}
Якщо ви зараз використовуєте Docker Engine на своїх вузлах з `cri-dockerd`, вас не торкнетеся видалення dockershim.
{{</note>}}

Ви можете перевірити, який сокет ви використовуєте, перевіривши конфігурацію kubelet на своїх вузлах.

1. Прочитайте початкові команди для процесу kubelet:

   ```shell
   tr \\0 ' ' < /proc/"$(pgrep kubelet)"/cmdline
   ```

   Якщо у вас немає `tr` або `pgrep`, перевірте командний рядок для процесу kubelet вручну.

1. У виведенні шукайте прапорець `--container-runtime` та прапорець `--container-runtime-endpoint`.

   * Якщо ваші вузли використовують Kubernetes v1.23 та старіший, і ці прапори відсутні або прапорець `--container-runtime` не є `remote`, ви використовуєте сокет dockershim з Docker Engine. Параметр командного рядка `--container-runtime` не доступний у Kubernetes v1.27 та пізніше.
   * Якщо прапорець `--container-runtime-endpoint` присутній, перевірте імʼя сокета, щоб дізнатися, яке середовище ви використовуєте. Наприклад, `unix:///run/containerd/containerd.sock` — це точка доступу containerd.

Якщо ви хочете змінити середовище виконання контейнерів на вузлі з Docker Engine на containerd, ви можете дізнатися більше інформації про [міграцію з Docker Engine на containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/), або, якщо ви хочете продовжити використовувати Docker Engine у Kubernetes v1.24 та пізніше, мігруйте на сумісний з CRI адаптер, наприклад [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd).
