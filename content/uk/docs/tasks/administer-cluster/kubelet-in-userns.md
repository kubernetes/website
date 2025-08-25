---
title: Запуск компонентів вузла Kubernetes користувачем без прав root
content_type: task
min-kubernetes-server-version: 1.22
weight: 300
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

У цьому документі описано, як запустити компоненти вузла Kubernetes, такі як kubelet, CRI, OCI та CNI, без прав root, використовуючи {{< glossary_tooltip text="простір імен користувача" term_id="userns" >}}.

Ця техніка також відома як _rootless mode_.

{{< note >}}
У цьому документі описано, як запустити компоненти вузла Kubernetes (і відповідно Podʼи), як не-root користувач.

Якщо ви шукаєте лише як запустити Pod як не-root користувача, див. [SecurityContext](/docs/tasks/configure-pod-container/security-context/).
{{< /note >}}

## {{% heading "prerequisites" %}}

{{% version-check %}}

* [Увімкніть Cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/)
* [Увімкніть systemd з сеансом користувача](https://rootlesscontaine.rs/getting-started/common/login/)
* [Налаштуйте кілька значень sysctl, залежно від розподілу Linux хосту](https://rootlesscontaine.rs/getting-started/common/sysctl/)
* [Переконайтеся, що ваш не привілейований користувач вказаний у `/etc/subuid` та `/etc/subgid`](https://rootlesscontaine.rs/getting-started/common/subuid/)
* Увімкніть [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletInUserNamespace`

<!-- steps -->

## Запуск Kubernetes в Rootless Docker або Rootless Podman {#running-kubernetes-inside-rootless-docker-podman}

### kind

[kind](https://kind.sigs.k8s.io/) підтримує запуск Kubernetes в середовищі Rootless Docker або Rootless Podman.

Див. [Запуск kind з Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) також підтримує запуск Kubernetes в середовищі Rootless Docker або Rootless Podman.

Див. документацію Minikube:

* [Rootless Docker](https://minikube.sigs.k8s.io/docs/drivers/docker/)
* [Rootless Podman](https://minikube.sigs.k8s.io/docs/drivers/podman/)

## Запуск Kubernetes всередині непривілейованих контейнерів {#running-kubernetes-inside-unprivileged-containers}

{{% thirdparty-content %}}

### sysbox

[Sysbox](https://github.com/nestybox/sysbox) — це відкрите програмне забезпечення для виконання контейнерів (подібне до "runc"), яке підтримує запуск робочих навантажень на рівні системи, таких як Docker та Kubernetes, всередині непривілейованих контейнерів, ізольованих за допомогою просторів користувачів Linux.

Дивіться [Sysbox Quick Start Guide: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md) для отримання додаткової інформації.

Sysbox підтримує запуск Kubernetes всередині непривілейованих контейнерів без потреби в Cgroup v2 і без використання `KubeletInUserNamespace`. Він досягає цього за допомогою розкриття спеціально створених файлових систем `/proc` та `/sys` всередині контейнера, а також кількох інших передових технік віртуалізації операційної системи.

## Запуск Rootless Kubernetes безпосередньо на хості {#running-rootless-kubernetes-directly-on-a-host}

{{% thirdparty-content %}}

### K3s

[K3s](https://k3s.io/) експериментально підтримує режим без root-прав.

Дивіться [Запуск K3s у режимі Rootless](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental) для використання.

### Usernetes

[Usernetes](https://github.com/rootless-containers/usernetes) — це референсний дистрибутив Kubernetes, який може бути встановлений у теці `$HOME` без привілеїв root.

Usernetes підтримує як containerd, так і CRI-O як середовище виконання контейнерів CRI. Usernetes підтримує багатовузлові кластери з використанням Flannel (VXLAN).

Дивіться [репозиторій Usernetes](https://github.com/rootless-containers/usernetes) для використання.

## Ручне розгортання вузла, який використовує kubelet в просторі користувача {#userns-the-hard-way}

У цьому розділі надаються вказівки для запуску Kubernetes у просторі користувача вручну.

{{< note >}}
Цей розділ призначений для розробників дистрибутивів Kubernetes, а не кінцевими користувачами.
{{< /note >}}

### Створення простору користувача {#creating-a-user-namespace}

Першим кроком є створення {{< glossary_tooltip text="простору користувача" term_id="userns" >}}.

Якщо ви намагаєтеся запустити Kubernetes в контейнері з простором користувача, такому як Rootless Docker/Podman або LXC/LXD, ви готові та можете перейти до наступного підрозділу.

Інакше вам доведеться створити простір користувача самостійно, викликавши `unshare(2)` з `CLONE_NEWUSER`.

Простір користувача також можна відокремити за допомогою інструментів командного рядка, таких як:

* [`unshare(1)`](https://man7.org/linux/man-pages/man1/unshare.1.html)
* [RootlessKit](https://github.com/rootless-containers/rootlesskit)
* [become-root](https://github.com/giuseppe/become-root)

Після відокремлення простору користувача вам також доведеться відокремити інші простори імен, такі як простір імен монтування.

Вам _не_ потрібно викликати `chroot()` або `pivot_root()` після відокремлення простору імен монтування, однак вам потрібно буде монтувати записувані файлові системи у кількох теках _в_ просторі імен.

Принаймні, наступні теки повинні бути записуваними _в_ просторі імен (не *поза* простором імен):

* `/etc`
* `/run`
* `/var/logs`
* `/var/lib/kubelet`
* `/var/lib/cni`
* `/var/lib/containerd` (для containerd)
* `/var/lib/containers` (для CRI-O)

### Створення делегованого дерева cgroup {#creating-a-delegated-cgroup-tree}

Крім простору користувача, вам також потрібно мати записуване дерево cgroup з cgroup v2.

{{< note >}}
Підтримка Kubernetes для запуску компонентів вузла у просторах користувача передбачає використання cgroup v2. Cgroup v1 не підтримується.
{{< /note >}}

Якщо ви намагаєтеся запустити Kubernetes у Rootless Docker/Podman або LXC/LXD на хості на основі systemd, у вас все готове.

У противному вам доведеться створити службу systemd з властивістю `Delegate=yes`, щоб делегувати дерево cgroup з правами на запис.

На вашому вузлі система systemd вже повинна бути налаштована на дозвіл делегування; для отримання докладнішої інформації дивіться [cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/) в документації Rootless
Containers.

### Налаштування мережі {#configuring-networking}

{{% thirdparty-content %}}

Простір імен мережі компонентів вузла повинен мати не-loopback інтерфейс, який, наприклад, може бути налаштований з використанням [slirp4netns](https://github.com/rootless-containers/slirp4netns), [VPNKit](https://github.com/moby/vpnkit), або [lxc-user-nic(1)](https://www.man7.org/linux/man-pages/man1/lxc-user-nic.1.html).

Простори імен мережі Podʼів можна налаштувати за допомогою звичайних втулків CNI. Для мережі з багатьма вузлами відомо, що Flannel (VXLAN, 8472/UDP) працює.

Порти, такі як порт kubelet (10250/TCP) і порти служби `NodePort`, повинні бути викриті з простору імен мережі вузла на хост зовнішнім перенаправлювачем портів, таким як RootlessKit, slirp4netns, або [socat(1)](https://linux.die.net/man/1/socat).

Ви можете використовувати перенаправлювач портів від K3s. Див. [Запуск K3s в режимі без root-прав](https://rancher.com/docs/k3s/latest/en/advanced/#known-issues-with-rootless-mode) для отримання докладнішої інформації. Реалізацію можна знайти в [пакунку `pkg/rootlessports`](https://github.com/k3s-io/k3s/blob/v1.22.3+k3s1/pkg/rootlessports/controller.go) k3s.

### Налаштування CRI {#configuring-cri}

Kubelet покладається на середовище виконання контейнерів. Ви повинні розгорнути середовище виконання контейнерів, таке як
containerd або CRI-O, і переконатися, що воно працює у просторі користувача до запуску kubelet.

{{< tabs name="cri" >}}
{{% tab name="containerd" %}}

Запуск CRI втулка containerd в просторі користувача підтримується з версії containerd 1.4.

Запуск containerd у просторі користувача вимагає наступних налаштувань.

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
# Можливий також використання non-fuse overlayfs для ядра >= 5.11, але потребує вимкненого SELinux
  snapshotter = "fuse-overlayfs"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
# Ми використовуємо cgroupfs, який делегується системою systemd, тому ми не використовуємо драйвер SystemdCgroup
# (якщо ви не запускаєте іншу систему systemd у просторі імен)
  SystemdCgroup = false
```

Типовий шлях конфігураційного файлу — `/etc/containerd/config.toml`. Шлях можна вказати з `containerd -c /шлях/до/конфігураційного/файлу.toml`.

{{% /tab %}}
{{% tab name="CRI-O" %}}

Запуск CRI-O у просторі користувача підтримується з версії CRI-O 1.22.

CRI-O вимагає, щоб була встановлена змінна середовища `_CRIO_ROOTLESS=1`.

Також рекомендуються наступні налаштування:

```toml
[crio]
  storage_driver = "overlay"
# Можливий також використання non-fuse overlayfs для ядра >= 5.11, але потребує вимкненого SELinux
  storage_option = ["overlay.mount_program=/usr/local/bin/fuse-overlayfs"]

[crio.runtime]
# Ми використовуємо cgroupfs, який делегується системою systemd, тому ми не використовуємо драйвер "systemd"
# (якщо ви не запускаєте іншу систему systemd у просторі імен)
  cgroup_manager = "cgroupfs"
```

Типовий шлях конфігураційного файлу — `/etc/crio/crio.conf`.
Шлях можна вказати з `crio --config /шлях/до/конфігураційного/файлу/crio.conf`.
{{% /tab %}}
{{< /tabs >}}

### Налаштування kubelet {#configuring-kubelet}

Запуск kubelet у просторі користувача вимагає наступної конфігурації:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletInUserNamespace: true
# Ми використовуємо cgroupfs, який делегується системою systemd, тому ми не використовуємо драйвер "systemd"
# (якщо ви не запускаєте іншу систему systemd у просторі імен)
cgroupDriver: "cgroupfs"
```

Коли увімкнено `KubeletInUserNamespace`, kubelet ігнорує помилки, які можуть виникнути під час встановлення наступних значень sysctl на вузлі.

* `vm.overcommit_memory`
* `vm.panic_on_oom`
* `kernel.panic`
* `kernel.panic_on_oops`
* `kernel.keys.root_maxkeys`
* `kernel.keys.root_maxbytes`.

У просторі користувача kubelet також ігнорує будь-яку помилку, яка виникає при спробі відкрити `/dev/kmsg`. Цей feature gate також дозволяє kube-proxy ігнорувати помилку під час встановлення `RLIMIT_NOFILE`.

`KubeletInUserNamespace` був введений у Kubernetes v1.22 зі статусом "alpha".

Запуск kubelet у просторі користувача без використання цього feature gate також можливий, шляхом монтування спеціально створеного файлової системи proc (як це робить [Sysbox](https://github.com/nestybox/sysbox)), але це не є офіційно підтримуваним.

### Налаштування kube-proxy {#configuring-kube-proxy}

Запуск kube-proxy у просторі користувача вимагає наступної конфігурації:

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

Для отримання додаткової інформації з цього питання, див. сторінку [Застереження та майбутня робота](https://rootlesscontaine.rs/caveats/) на веб-айті rootlesscontaine.rs.

## {{% heading "seealso" %}}

* [rootlesscontaine.rs](https://rootlesscontaine.rs/)
* [Rootless Containers 2020 (KubeCon NA 2020)](https://www.slideshare.net/AkihiroSuda/kubecon-na-2020-containerd-rootless-containers-2020)
* [Запуск kind з Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/)
* [Usernetes](https://github.com/rootless-containers/usernetes)
* [Запуск K3s у режимі rootless](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
* [KEP-2033: Kubelet-in-UserNS (також відомий як Rootless mode)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless)
