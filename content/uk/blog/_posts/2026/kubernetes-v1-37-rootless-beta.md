---
layout: blog
title: "Kubernetes v1.37: KubeletInUserNamespace (також відомий як Rootless mode) переходить в Beta"
slug: kubernetes-v1-37-rootless-beta
date: 2026-09-04T10:30:00-08:00
author: >
  [Akihiro Suda](https://github.com/AkihiroSuda) (NTT)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

Kubernetes v1.37 переводить функціональну можливість `KubeletInUserNamespace` в бета. Коли ця функціональна можливість увімкнена, всі компоненти вузла (kubelet, CRI та OCI середовища виконання контейнерів, CNI втулки та kube-proxy) можуть працювати як non-root користувач на хості, використовуючи [Linux user namespace](https://man7.org/linux/man-pages/man7/user_namespaces.7.html) (простір імен користувача). Цей підхід також відомий як _rootless mode_. Робота почалася як експеримент у 2018 році, і була обʼєднана в Kubernetes v1.22 (2021) як альфа-функція (Kubernetes Enhancement Proposal [KEP-2033](https://www.kubernetes.dev/resources/keps/2033/)).

Цю функцію не слід плутати з [user namespaces для Podʼів](/docs/concepts/workloads/pods/user-namespaces/) (`hostUsers: false` з функціональною можливістю `UserNamespacesSupport`, GA з v1.36), що розміщує Podʼи в user namespaces, але все ще запускає компоненти вузла як root. Ці дві функції не конфліктують. Крім того, їх можна поєднати для вкладення Kubernetes у Kubernetes без необхідності повного `privileged: true`.

## Для чого запускати компоненти вузла в user namespace? {#why-run-the-node-components-in-a-user-namespace}

Тому що компоненти вузла історично мали вразливості прориву контейнера (container-breakout vulnerabilities), які могли скомпрометувати повні root привілеї на хості.

Приклади таких вразливостей включають:

- [CVE-2022-0811](https://nvd.nist.gov/vuln/detail/CVE-2022-0811) («cr8escape»): CRI-O можна було спровокувати на встановлення довільних sysctl, таких як `kernel.core_pattern`, що призводило до довільного виконання коду як root на хості
- [CVE-2023-27561](https://nvd.nist.gov/vuln/detail/CVE-2023-27561): runc можна було спровокувати на обхід маскованих шляхів контейнера через гонитву під час монтування тому, що викривало файли procfs хосту (регресія CVE-2019-19921)
- [CVE-2024-10220](https://nvd.nist.gov/vuln/detail/CVE-2024-10220): kubelet можна було змусити виконувати довільні команди як root через томи `gitRepo` (`gitRepo` томи мали схожу вразливість, [CVE-2018-11235](https://nvd.nist.gov/vuln/detail/CVE-2018-11235), ще у 2018 році)
- [CVE-2025-31133](https://nvd.nist.gov/vuln/detail/CVE-2025-31133): runc можна було спровокувати на bind-монтування контрольованих атакуючим шляхів та запис у файли procfs хосту, такі як `/proc/sysrq-trigger` та `/proc/sys/kernel/core_pattern`
- [CVE-2026-53488](https://nvd.nist.gov/vuln/detail/CVE-2026-53488): containerd можна було спровокувати на виконання довільних команд на хості через підроблені мітки в образі контейнера

Запускаючи компоненти вузла в user namespace, потенційна шкода обмежується обліковим записом non-root користувача. Зокрема, атакуючий не може приховати своє втручання, модифікуючи ядро, завантажувач або прошивку.

Слід все ж зазначити, що user namespaces не ефективні для помʼякшення вразливостей у самому ядрі. User namespaces слід використовувати в поєднанні з традиційними заходами зміцнення безпеки, такими як [seccomp](/docs/tutorials/security/seccomp/) для запобігання виклику контейнерами непотрібних системних викликів.

### Випадки використання {#use-cases}

- **Production кластери**: помʼякшувати потенційні вразливості прориву контейнера.
- **Спільні машини (напр., HPC)**: користувачі можуть розгортати Kubernetes без запиту root-привілеїв у адміністратора машини і без ризику випадково пошкодити середовища інших користувачів.
- **Ноутбуки**: запобігати випадковому пошкодженню локальним кластером конфігурації хост-системи, напр., правил iptables хосту, використовуваних для VPN.
- **AI sandbox**: розробник Kubernetes-застосунків може створити спеціальний локальний обліковий запис користувача для запуску AI-агента для кодування та тестового Kubernetes-кластера. Ця установка корисна для запобігання пошкодженню хосту AI-агентом, коли його обдурюють шкідливою інформацією в Інтернеті.
- **Kubernetes-in-Kubernetes**: вкладений кластер може запускатися всередині батьківського кластера як Pod з user namespace (`hostUsers: false`), ізолюючи робочі навантаження суворіше, ніж Kubernetes API namespaces.
- **Bootstrapping**: тимчасовий непривілейований кластер може бути використаний для початкового розгортання реального кластера, напр., з Cluster API.

## Як це працює? {#how-does-it-work}

Ядро Linux — _user namespace_ відображає non-root користувача рівня хосту (напр., UID 1000) на користувача _fake root_ всередині простору імен. Привілеї UID 0 обмежені внутрішньою частиною простору імен. Fake root достатній для більшості задач компонентів вузла: монтування томів, створення cgroups та налаштування мережевих просторів імен Podʼів. Він все ще йде з деякими [застереженнями](https://www.kubernetes.dev/resources/keps/2033/#notesconstraintscaveats-optional), які можуть ламати сумісність з певними CNI та CSI драйверами.

User namespace має бути створений поза Kubernetes. Наприклад, [Rootless](https://docs.docker.com/engine/security/rootless/) Docker можна використати для підготовки user namespace, в якому запускається Kubernetes.

Сама функціональна можливість `KubeletInUserNamespace` досить проста: по суті, вона просто дозволяє kubelet ігнорувати помилки дозволів, що виникають при [встановленні деяких значень sysctl](https://github.com/kubernetes/kubernetes/blob/v1.37.0-beta.0/pkg/kubelet/cm/container_manager_linux.go#L499-L517) (напр., `vm.overcommit_memory` та `kernel.panic`) та при [спостереженні за повідомленнями ядра через `/dev/kmsg`](https://github.com/kubernetes/kubernetes/blob/v1.37.0-beta.0/pkg/kubelet/kubelet.go#L586-L601).

Дивіться [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/) для додаткової інформації.

## Що змінилося від Alpha до Beta? {#what-changed-from-alpha-to-beta}

- Функціональна можливість `KubeletInUserNamespace` тепер стандартно увімкнена. Її увімкнення автоматично не розміщує kubelet у user namespace, тому нічого не змінюється для наявних «rootful» кластерів.
- `kubectl get nodes -o yaml` тепер повідомляє, чи запущені вузли в user namespace через властивість [`runningInUserNamespace`](https://pkg.go.dev/k8s.io/api/core/v1#NodeSystemInfo). Адміністратор кластера може використати цю властивість для встановлення міток або taints на вузлах, щоб уникнути планування робочих навантажень, що потребують реальних root привілеїв (напр., деякі інсталятори CNI втулків) на rootless вузлах.
- Для власного CI/CD тестування Kubernetes, node conformance end-to-end тести тепер запускаються на rootless кластері ([ci-kubernetes-e2e-kind-rootless](https://prow.k8s.io/job-history/gs/kubernetes-ci-logs/logs/ci-kubernetes-e2e-kind-rootless)).

Деякі повʼязані покращення також відбулися поза просуванням цієї функціональної можливості:

- **Linux kernel v6.3 (2023)**: додано підтримку [idmapped tmpfs](https://kernelnewbies.org/Linux_6.3).
- **Kubernetes v1.33 (2025)**: функціональну можливість [`UserNamespacesSupport`](/docs/concepts/workloads/pods/user-namespaces/) стандартно увімкнено, дозволяючи створювати Podʼи з user namespace (`hostUsers: false`) без додаткової конфігурації.
- **containerd v2.1 (2025)**: додано підтримку [writable cgroups](https://github.com/containerd/containerd/releases/tag/v2.1.0).

Завдяки цим покращенням, Kubernetes-кластер з `KubeletInUserNamespace` тепер також може бути вкладеним усередині Kubernetes Podʼа з `hostUsers: false` (`UserNamespacesSupport`).

## Як це використовувати {#how-to-use-it}

### kind {#kind}

Найпростіший спосіб — використати [kind](https://kind.sigs.k8s.io/) (проєкт Kubernetes SIG Testing) для запуску Kubernetes-кластера в rootless Docker, rootless nerdctl або rootless Podman:

```bash
# Приклад з Docker
dockerd-rootless-setuptool.sh install
kind create cluster
```

Залежно від конфігурації хоста, вам може знадобитися додаткова конфігурація для systemd, модулів ядра, sysctl тощо.

Дивіться [документацію Docker](https://docs.docker.com/engine/security/rootless/) та [документацію kind](https://kind.sigs.k8s.io/docs/user/rootless/) для додаткової інформації.

### minikube {#minikube}

[minikube](https://minikube.sigs.k8s.io/docs/) (проєкт Kubernetes SIG Cluster Lifecycle) також підтримує запуск Kubernetes-кластера в rootless Docker або rootless Podman:

```bash
dockerd-rootless-setuptool.sh install
minikube start --driver=docker
```

Дивіться [документацію minikube](https://minikube.sigs.k8s.io/docs/drivers/docker/) для додаткової інформації.

### Usernetes {#usernetes}

[Usernetes](https://github.com/rootless-containers/usernetes) (сторонній проєкт) є дистрибутивом rootless Kubernetes, що підтримується автором цієї статті. Проєкт почався у 2018 році, і саме звідси початково прийшла функціональна можливість `KubeletInUserNamespace`.

На відміну від kind та minikube, Usernetes підтримує створення кластера з кількома rootless вузлами Docker / Podman / nerdctl, зʼєднаними через VXLAN за допомогою Flannel CNI плагіна.

Usernetes також експериментально підтримує режим [Kubernetes-in-Kubernetes](https://github.com/rootless-containers/usernetes/tree/master/kubernetes).

### k3s {#k3s}

[k3s](https://k3s.io) (проєкт CNCF Sandbox) також підтримує [rootless mode](https://docs.k3s.io/advanced#running-rootless-servers-experimental). На відміну від kind, minikube та поточного покоління Usernetes, rootless k3s не покладається на зовнішнє середовище виконання контейнерів, таке як rootless Docker.

## Що далі? {#whats-next}

Залежно від відгуків та впровадження, проєкт Kubernetes планує просунути цю функцію до General Availability (GA) у майбутньому релізі. Якщо у вас є відгук щодо цієї функції, будь ласка, створіть тікет в репозиторії [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

Проєкт також обговорює кілька Kubernetes Enhancement Proposals, які можуть сприяти спрощенню Kubernetes-in-Kubernetes з цією функцією:

- [KEP-5474: Enable Writable cgroups for unprivileged containers](https://www.kubernetes.dev/resources/keps/5474/)
- [KEP-5714: Allow specifying whether to unshare cgroup namespaces](https://www.kubernetes.dev/resources/keps/5714)

## Як долучитися {#getting-involved}

Ми завжди вітаємо нових учасників. Якщо ви хочете приєднатися, ви можете приєднатися до [Node Special Interest Group](https://www.kubernetes.dev/community/community-groups/sigs/node/)
(SIG Node).

Якщо ви хочете поділитися відгуком, ви можете це зробити на нашому [публічному Slack-каналі](https://kubernetes.slack.com/messages/sig-node) (відвідайте <https://slack.k8s.io/> для запрошення, якщо потрібне).

Щира подяка всім, хто допоміг спроєктувати та реалізувати цю функцію, включно з (в алфавітному порядку):

- Bing Hongtao ([HirazawaUi](https://github.com/HirazawaUi))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Sergey Kanzhelev ([SergeyKanzhelev](https://github.com/SergeyKanzhelev))
- Tim Hockin ([thockin](https://github.com/thockin))
