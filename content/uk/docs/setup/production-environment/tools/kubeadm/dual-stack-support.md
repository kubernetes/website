---
title: Підтримка подвійного стека за допомогою kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Ваш кластер Kubernetes має мережу з [підтримкою подвійного стека](/docs/concepts/services-networking/dual-stack/), що означає, що мережа кластера дає змогу використовувати будь-яке сімейство адрес. У кластері панель управління може призначити одному {{< glossary_tooltip text="Podʼу" term_id="pod" >}} чи {{< glossary_tooltip text="Service" term_id="service" >}} як IPv4-адресу, так і IPv6-адресу.

<!-- body -->

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібно встановити інструмент {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, дотримуючись кроків з [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Для кожного сервера, який ви хочете використовувати як {{< glossary_tooltip text="вузол" term_id="node" >}}, переконайтеся, що на ньому дозволено пересилання IPv6 (IPv6 forwarding).

### Увімкнення пересилання пакетів IPv6 {#prerequisite-ipv6-forwarding}

Щоб перевірити, чи ввімкнено пересилання пакетів IPv6:

```bash
sysctl net.ipv6.conf.all.forwarding
```

Якщо вивід — `net.ipv6.conf.all.forwarding = 1`, пересилання вже ввімкнено. Інакше його ще не ввімкнено.

Щоб вручну ввімкнути пересилання пакетів IPv6:

```bash
# параметри sysctl, необхідні для встановлення, параметри зберігаються при перезавантаженні
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Застосування параметрів sysctl без перезавантаження
sudo sysctl --system
```

Вам потрібні діапазони адрес IPv4 та IPv6. Оператори кластерів зазвичай використовують для IPv4 приватні діапазони адрес. Для IPv6 оператор кластера зазвичай вибирає блок глобальних унікаст-адрес (global unicast) з `2000::/3`, використовуючи діапазон, виділений оператору. Маршрутизувати IP-діапазони кластера в публічний інтернет не потрібно.

Розмір виділених IP-адрес має відповідати кількості Podʼів і Service, які ви плануєте запускати.

{{< note >}}
Якщо ви оновлюєте наявний кластер за допомогою команди `kubeadm upgrade`, `kubeadm` не підтримує змін діапазону IP-адрес Podʼів («cluster CIDR») або діапазону адрес Service кластера («Service CIDR»).
{{< /note >}}

### Створення кластера з подвійним стеком {#create-a-dual-stack-cluster}

Щоб створити кластер з подвійним стеком за допомогою `kubeadm init`, можна передати аргументи командного рядка, як у цьому прикладі:

```shell
# Це діапазони адрес для прикладу
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Для наочності ось приклад [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для основного вузла панелі управління з подвійним стеком.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

`advertiseAddress` в InitConfiguration задає IP-адресу, на якій API-сервер оголошуватиме, що слухає. Значення `advertiseAddress` дорівнює прапорцю `--apiserver-advertise-address` команди `kubeadm init`.

Запустіть kubeadm, щоб ініціалізувати вузол панелі управління з подвійним стеком:

```shell
kubeadm init --config=kubeadm-config.yaml
```

Прапорці kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` мають стандартні значення. Див. [налаштування подвійного стека IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Прапорець `--apiserver-advertise-address` не підтримує подвійний стек.
{{< /note >}}

### Приєднання вузла до кластера з подвійним стеком {#join-a-node-to-dual-stack-cluster}

Перш ніж приєднати вузол, переконайтеся, що вузол має мережевий інтерфейс з можливістю маршрутизації IPv6 та дозволяє пересилання IPv6.

Ось приклад [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для приєднання робочого вузла до кластера.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # змініть інформацію про автентифікацію вище, щоб відповідати фактичному токену та хешу сертифіката CA для вашого кластера
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Також ось приклад [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для приєднання ще одного вузла панелі управління до кластера.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # змініть інформацію про автентифікацію вище, щоб відповідати фактичному токену та хешу сертифіката CA для вашого кластера
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` в JoinConfiguration.controlPlane задає IP-адресу, на якій API-сервер оголошуватиме, що слухає. Значення `advertiseAddress` дорівнює прапорцю `--apiserver-advertise-address` команди `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Створення кластера з одним стеком {#create-a-single-stack-cluster}

{{< note >}}
Підтримка подвійного стека не означає, що вам потрібно використовувати адресацію з подвійним стеком. Ви можете розгорнути кластер з одним стеком, у якому ввімкнено можливість мережі з подвійним стеком.
{{< /note >}}

Для наочності ось приклад [файлу конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для вузла панелі управління з одним стеком.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Перевірте](/docs/tasks/network/validate-dual-stack) мережу з подвійним стеком IPv4/IPv6
* Прочитайте про мережу кластера з [подвійним стеком](/docs/concepts/services-networking/dual-stack/)
* Дізнайтеся більше про [формат конфігурації](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm
