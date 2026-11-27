---
title: Запуск компонентів вузла Kubernetes користувачем без прав root
content_type: task
min-kubernetes-server-version: 1.22
weight: 300
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.37" state="beta" >}}

У цьому документі описано, як запустити компоненти вузла Kubernetes, такі як kubelet, CRI, OCI та CNI, без прав root, використовуючи {{< glossary_tooltip text="простір імен користувачів" term_id="userns" >}}.

Ця техніка також відома як _rootless mode_.

{{< note >}}
У цьому документі описано, як запускати компоненти вузла Kubernetes (а отже, і Podʼи) від імені користувача без прав root.

Якщо вам потрібно лише запустити Pod від імені користувача без прав root, див. [SecurityContext](/docs/tasks/configure-pod-container/security-context/).
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{% version-check %}}

* [Увімкніть Cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/)
* [Увімкніть systemd з сеансом користувача](https://rootlesscontaine.rs/getting-started/common/login/)
* [Налаштуйте кілька значень sysctl залежно від дистрибутива Linux на хості](https://rootlesscontaine.rs/getting-started/common/sysctl/)
* [Переконайтеся, що ваш непривілейований користувач вказаний у `/etc/subuid` та `/etc/subgid`](https://rootlesscontaine.rs/getting-started/common/subuid/)
* Увімкніть функціональну можливість [`KubeletInUserNamespace`](/docs/reference/command-line-tools-reference/feature-gates/#KubeletInUserNamespace)

<!-- steps -->

## Запуск Kubernetes у Rootless Docker/Podman/nerdctl {#running-kubernetes-inside-rootless-docker-podman-nerdctl}

### kind

[kind](https://kind.sigs.k8s.io/) підтримує запуск Kubernetes в середовищі Rootless Docker, Rootless Podman або Rootless nerdctl.

Див. [Запуск kind з Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) також підтримує запуск Kubernetes в середовищі Rootless Docker або Rootless Podman.

Див. документацію Minikube:

* [Rootless Docker](https://minikube.sigs.k8s.io/docs/drivers/docker/)
* [Rootless Podman](https://minikube.sigs.k8s.io/docs/drivers/podman/)

### Usernetes

{{% thirdparty-content single="true" %}}

[Usernetes](https://github.com/rootless-containers/usernetes) також підтримує запуск Kubernetes в середовищі Rootless Docker, Rootless Podman або Rootless nerdctl.

На відміну від kind і minikube, Usernetes підтримує створення кластера з кількох вузлів Docker/Podman/nerdctl з використанням VXLAN.

Інструкції з використання див. у [документації Usernetes](https://github.com/rootless-containers/usernetes/blob/master/README.md).

## Запуск Kubernetes всередині Kubernetes як Podʼів у просторах імен користувачів {#running-kubernetes-inside-kubernetes-as-user-namespace-pods}

{{% thirdparty-content single="true" %}}

### Usernetes

[Usernetes](https://github.com/rootless-containers/usernetes) підтримує режим Kubernetes-in-Kubernetes на додачу до режиму Kubernetes-in-Docker. Режим Kubernetes-in-Kubernetes створює вузли внутрішнього кластера як Podʼи, що працюють на зовнішньому кластері з увімкненими [просторами імен користувачів](/docs/concepts/workloads/pods/user-namespaces/) (`hostUsers: false`).

Інструкції з використання див. у [документації Usernetes](https://github.com/rootless-containers/usernetes/blob/master/README.md).

## Запуск Kubernetes всередині непривілейованих контейнерів {#running-kubernetes-inside-unprivileged-containers}

{{% thirdparty-content single="true" %}}

### sysbox

[Sysbox](https://github.com/nestybox/sysbox) — це середовище виконання контейнерів з відкритим кодом (подібне до "runc"), яке підтримує запуск системних робочих навантажень, таких як Docker та Kubernetes, всередині непривілейованих контейнерів, ізольованих за допомогою просторів імен користувачів Linux.

Дивіться [Sysbox Quick Start Guide: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md) для отримання додаткової інформації.

Sysbox підтримує запуск Kubernetes всередині непривілейованих контейнерів без потреби в Cgroup v2 і без функціональної можливості `KubeletInUserNamespace`. Він досягає цього, надаючи всередині контейнера спеціально підготовлені файлові системи `/proc` та `/sys`, а також використовуючи кілька інших передових технік віртуалізації ОС.

## Запуск Rootless Kubernetes безпосередньо на хості {#running-rootless-kubernetes-directly-on-a-host}

{{% thirdparty-content single="true" %}}

### K3s

[K3s](https://k3s.io/) експериментально підтримує режим без root-прав.

Інструкції з використання див. у [Запуск K3s у режимі Rootless](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental).

### Usernetes (до 2023 року) {#usernetes-until-2023}

Перше покоління [Usernetes](https://github.com/rootless-containers/usernetes) підтримувало запуск rootless Kubernetes безпосередньо на хості. Цей режим було заархівовано у 2023 році.

Дивіться [гілку `gen1` репозиторію Usernetes](https://github.com/rootless-containers/usernetes/tree/gen1) для архівної інформації.

## Ручне розгортання вузла, на якому kubelet працює в просторі імен користувачів {#userns-the-hard-way}

У цьому розділі наведено вказівки щодо ручного запуску Kubernetes у просторі імен користувачів.

{{< note >}}
Цей розділ призначений для розробників дистрибутивів Kubernetes, а не для кінцевих користувачів.
{{< /note >}}

### Створення простору імен користувачів {#creating-a-user-namespace}

Першим кроком є створення {{< glossary_tooltip text="простору імен користувачів" term_id="userns" >}}.

Якщо ви намагаєтеся запустити Kubernetes у контейнері з простором імен користувачів, такому як Rootless Docker/Podman або LXC/LXD, усе готово, і ви можете перейти до наступного підрозділу.

Інакше вам доведеться створити простір імен користувачів самостійно, викликавши `unshare(2)` з `CLONE_NEWUSER`.

Простір імен користувачів також можна відокремити за допомогою інструментів командного рядка, таких як:

* [`unshare(1)`](https://man7.org/linux/man-pages/man1/unshare.1.html)
* [RootlessKit](https://github.com/rootless-containers/rootlesskit)
* [become-root](https://github.com/giuseppe/become-root)

Після відокремлення простору імен користувачів вам також доведеться відокремити інші простори імен, такі як простір імен монтування.

Вам _не_ потрібно викликати `chroot()` або `pivot_root()` після відокремлення простору імен монтування, однак вам потрібно буде змонтувати записувані файлові системи в кількох теках _у_ просторі імен.

Принаймні такі теки повинні бути записуваними _у_ просторі імен (а не _поза_ ним):

* `/etc`
* `/run`
* `/var/logs`
* `/var/lib/kubelet`
* `/var/lib/cni`
* `/var/lib/containerd` (для containerd)
* `/var/lib/containers` (для CRI-O)

### Створення делегованого дерева cgroup {#creating-a-delegated-cgroup-tree}

Крім простору імен користувачів, вам також потрібно мати записуване дерево cgroup з cgroup v2.

{{< note >}}
Підтримка Kubernetes для запуску компонентів вузла у просторах імен користувачів вимагає cgroup v2. Cgroup v1 не підтримується.
{{< /note >}}

Якщо ви намагаєтеся запустити Kubernetes у Rootless Docker/Podman або LXC/LXD на хості на основі systemd, усе готово.

Інакше вам доведеться створити юніт systemd з властивістю `Delegate=yes`, щоб делегувати дерево cgroup з правами на запис.

На вашому вузлі systemd уже має бути налаштований на дозвіл делегування; докладніше див. [cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/) у документації Rootless Containers.

### Налаштування мережі {#configuring-network}

{{% thirdparty-content single="true" %}}

Мережевий простір імен компонентів вузла повинен мати інтерфейс, відмінний від loopback, який, наприклад, може бути налаштований за допомогою [slirp4netns](https://github.com/rootless-containers/slirp4netns), [VPNKit](https://github.com/moby/vpnkit) або [lxc-user-nic(1)](https://www.man7.org/linux/man-pages/man1/lxc-user-nic.1.html).

Мережеві простори імен Podʼів можна налаштувати за допомогою звичайних втулків CNI. Для мережі з кількома вузлами відомо, що працює Flannel (VXLAN, 8472/UDP).

Порти, такі як порт kubelet (10250/TCP) і порти Service `NodePort`, потрібно зробити доступними з мережевого простору імен вузла на хості за допомогою зовнішнього перенаправлювача портів, такого як RootlessKit, slirp4netns або [socat(1)](https://linux.die.net/man/1/socat).

Ви можете використовувати перенаправлювач портів від K3s. Див. [Запуск K3s в режимі без root-прав](https://rancher.com/docs/k3s/latest/en/advanced/#known-issues-with-rootless-mode) для отримання докладнішої інформації. Реалізацію можна знайти в [пакунку `pkg/rootlessports`](https://github.com/k3s-io/k3s/blob/v1.22.3+k3s1/pkg/rootlessports/controller.go) k3s.

### Налаштування CRI {#configuring-cri}

Kubelet покладається на середовище виконання контейнерів. Ви повинні розгорнути середовище виконання контейнерів, таке як
containerd або CRI-O, і переконатися, що воно працює у просторі імен користувачів до запуску kubelet.

{{< tabs name="cri" >}}
{{% tab name="containerd" %}}

Запуск CRI-втулка containerd у просторі імен користувачів підтримується, починаючи з containerd 1.4.

Запуск containerd у просторі імен користувачів вимагає таких налаштувань.

```toml
version = 2

[plugins."io.containerd.grpc.v1.cri"]
# Вимкнути AppArmor
  disable_apparmor = true
# Ігнорувати помилку під час встановлення oom_score_adj
  restrict_oom_score_adj = true
# Вимкнути контролер hugetlb cgroup v2 (тому що systemd не підтримує делегування контролера hugetlb)
  disable_hugetlb_controller = true

[plugins."io.containerd.grpc.v1.cri".containerd]
# Також можливе використання non-fuse overlayfs для ядра >= 5.11, але потребує вимкненого SELinux
  snapshotter = "fuse-overlayfs"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
# Ми використовуємо cgroupfs, який делегує systemd, тому ми не використовуємо драйвер SystemdCgroup
# (якщо ви не запускаєте інший екземпляр systemd у просторі імен)
  SystemdCgroup = false
```

Стандартний шлях файлу конфігурації — `/etc/containerd/config.toml`. Шлях можна вказати за допомогою `containerd -c /path/to/containerd/config.toml`.

{{% /tab %}}
{{% tab name="CRI-O" %}}

Запуск CRI-O у просторі імен користувачів підтримується з версії CRI-O 1.22.

CRI-O вимагає, щоб була встановлена змінна середовища `_CRIO_ROOTLESS=1`.

Також рекомендуються такі налаштування:

```toml
[crio]
  storage_driver = "overlay"
# Також можливе використання non-fuse overlayfs для ядра >= 5.11, але потребує вимкненого SELinux
  storage_option = ["overlay.mount_program=/usr/local/bin/fuse-overlayfs"]

[crio.runtime]
# Ми використовуємо cgroupfs, який делегує systemd, тому ми не використовуємо драйвер "systemd"
# (якщо ви не запускаєте інший екземпляр systemd у просторі імен)
  cgroup_manager = "cgroupfs"
```

Стандартний шлях файлу конфігурації — `/etc/crio/crio.conf`. Шлях можна вказати за допомогою `crio --config /path/to/crio/crio.conf`.
{{% /tab %}}
{{< /tabs >}}

### Налаштування kubelet {#configuring-kubelet}

Запуск kubelet у просторі імен користувачів вимагає такої конфігурації:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletInUserNamespace: true
# Ми використовуємо cgroupfs, який делегує systemd, тому ми не використовуємо драйвер "systemd"
# (якщо ви не запускаєте інший екземпляр systemd у просторі імен)
cgroupDriver: "cgroupfs"
```

Коли ввімкнено функціональну можливість `KubeletInUserNamespace`, kubelet ігнорує помилки, які можуть виникнути під час встановлення таких значень sysctl на вузлі.

* `vm.overcommit_memory`
* `vm.panic_on_oom`
* `kernel.panic`
* `kernel.panic_on_oops`
* `kernel.keys.root_maxkeys`
* `kernel.keys.root_maxbytes`.

У просторі імен користувачів kubelet також ігнорує будь-яку помилку, що виникає під час спроби відкрити `/dev/kmsg`. Ця функціональна можливість також дозволяє kube-proxy ігнорувати помилку під час встановлення `RLIMIT_NOFILE`.

Функціональну можливість `KubeletInUserNamespace` було представлено в Kubernetes v1.22 зі статусом "alpha".

Запуск kubelet у просторі імен користувачів без використання цієї функціональної можливості також можливий шляхом монтування спеціально підготовленої файлової системи proc (як це робить [Sysbox](https://github.com/nestybox/sysbox)), але офіційно це не підтримується.

### Налаштування kube-proxy {#configuring-kube-proxy}

Запуск kube-proxy у просторі імен користувачів вимагає такої конфігурації:

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "iptables" # або "userspace"
conntrack:
# Пропустити встановлення значення sysctl "net.netfilter.nf_conntrack_max"
  maxPerCore: 0
# Пропустити встановлення "net.netfilter.nf_conntrack_tcp_timeout_established"
  tcpEstablishedTimeout: 0s
# Пропустити встановлення "net.netfilter.nf_conntrack_tcp_timeout_close"
  tcpCloseWaitTimeout: 0s
```

## Застереження {#caveats}

* Більшість "нелокальних" драйверів томів, таких як `nfs` та `iscsi`, не працюють. Відомо, що працюють локальні томи, такі як `local`, `hostPath`, `emptyDir`, `configMap`, `secret` та `downwardAPI`.

* Деякі втулки CNI можуть не працювати. Відомо, що працює Flannel (VXLAN).

Докладніше про це див. сторінку [Застереження та майбутня робота](https://rootlesscontaine.rs/caveats/) на вебсайті rootlesscontaine.rs.

## {{% heading "seealso" %}} {#see-also}

* [rootlesscontaine.rs](https://rootlesscontaine.rs/)
* [Rootless Containers 2020 (KubeCon NA 2020)](https://www.slideshare.net/AkihiroSuda/kubecon-na-2020-containerd-rootless-containers-2020)
* [Запуск kind з Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/)
* [Usernetes](https://github.com/rootless-containers/usernetes)
* [Запуск K3s у режимі rootless](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
* [KEP-2033: Kubelet-in-UserNS (також відомий як Rootless mode)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless)
