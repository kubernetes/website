---
title: Підтримка подвійного стека за допомогою kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Ваш кластер Kubernetes має мережу з [підтримкою подвійного стека](/docs/concepts/services-networking/dual-stack/), що означає, що у кластері мережева взаємодія може використовувати обидві адресні родини. У кластері панель управління може призначити як IPv4-адреси, так і IPv6-адреси {{< glossary_tooltip text="Podʼу" term_id="pod" >}} чи {{< glossary_tooltip text="Service" term_id="service" >}}.

<!-- body -->

## {{% heading "prerequisites" %}}

Вам потрібно встановити інструмент {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, дотримуючись кроків з [Встановлення kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Для кожного сервера, який ви хочете використовувати як {{< glossary_tooltip text="вузол" term_id="node" >}}, переконайтеся, що на ньому увімкнено переспрямовування IPv6 трафіку (IPv6 forwarding).

### Увімкнення переспрямовування пакетів IPv6 {#prerequisites-ipv6-forwarding}

Для перевірки чи увімкнено переспрямовування пакетів IPv6, виконайте наступну команду:

```shell
sysctl net.ipv6.conf.all.forwarding
```

Якщо ви бачите `net.ipv6.conf.all.forwarding = 1`, це означає, що переспрямовування пакетів IPv6 увімкнено. В іншому випадку переспрямовування пакетів ще не увімкнено.

Ввімкніть його вручну:

```bash
# параметри sysctl, необхідні для встановлення, параметри зберігаються при перезавантаженні
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Застосування параметрів sysctl без перезавантаження
sudo sysctl --system
```

Вам потрібні діапазони адрес IPv4 та IPv6. Оператори кластера, як правило,
використовують приватні діапазони адрес для IPv4. Щодо IPv6, оператор кластера, як правило, обирає глобальний унікальний блок адрес з області `2000::/3`, використовуючи діапазон, який виділений оператору. Вам не потрібно робити маршрутизацію IP-діапазонів кластера в Інтернет.

Розмір діапазону IP-адрес повинен бути достатнім для тієї кількості Podʼів та
Serviceʼів, які ви плануєте запускати.

{{< note >}}
Якщо ви оновлюєте наявний кластер за допомогою команди `kubeadm upgrade`, `kubeadm` не підтримує внесення змін до діапазону IP-адрес ("кластер CIDR") або діапазону адрес служби кластера ("Service CIDR").
{{< /note >}}

### Створення кластера з подвійним стеком {#create-a-dual-stack-cluster}

Для створення кластера з подвійним стеком за допомогою `kubeadm init` ви можете передати аргументи командного рядка аналогічно наступному прикладу:

```shell
# Це діапазони адрес для прикладу
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Щоб зробити це більш зрозумілим, ось приклад [конфігураційного файлу](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для основного вузла панелі управління з подвійним стеком.

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

`advertiseAddress` в InitConfiguration вказує IP-адресу, яку API Server оголошує як адресу, на якій він очікує трафік. Значення `advertiseAddress` дорівнює значенню
прапорця `--apiserver-advertise-address` команди `kubeadm init`.

Використовуйте kubeadm для ініціалізації панелі управління на вузлі з подвійним стеком:

```shell
kubeadm init --config=kubeadm-config.yaml
```

Прапори kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` встановлені у стандартні значення. Див. [налаштування подвійного стека IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Прапорець `--apiserver-advertise-address` не підтримує подвійний стек.
{{< /note >}}

### Приєднання вузла до кластера з подвійним стеком {#join-a-node-to-dual-stack-cluster}

Перш ніж приєднати вузол, переконайтеся, що вузол має мережевий інтерфейс з можливістю маршрутизації IPv6 та дозволяє пересилання IPv6.

Ось приклад [конфігураційного файлу](/docs/reference/config-api/kubeadm-config.v1beta3/) kubeadm `kubeadm-config.yaml` для приєднання робочого вузла до кластера.

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

Також ось приклад [конфігураційного файлу](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для приєднання іншого вузла панелі управління до кластера.

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

`advertiseAddress` в JoinConfiguration.controlPlane вказує IP-адресу, яку API Server оголошує як адресу, на якій він слухає. Значення `advertiseAddress` дорівнює прапорцю `--apiserver-advertise-address` команди `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Створення кластера з одним стеком {#create-a-single-stack-cluster}

{{< note >}}
Підтримка подвійного стека не означає, що вам потрібно використовувати подвійні адреси. Ви можете розгорнути кластер з одним стеком, в якому увімкнена функція роботи з мережею з подвійним стеком.
{{< /note >}}

Щоб зробити речі більш зрозумілими, [конфігураційного файлу](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm `kubeadm-config.yaml` для панелі управління з одним стеком.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [Перевірка мережевої взаємодії в подвійному стеку IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* Дізнайтеся більше про [підтримку подвійного стека](/docs/concepts/services-networking/dual-stack/)
* Дізнайтеся більше про [формат конфігурації kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
