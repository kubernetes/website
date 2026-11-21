---
title: Поддержка двух стеков с помощью kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Кластер Kubernetes поддерживает [двухстековую сеть](/docs/concepts/services-networking/dual-stack/),
позволяющую использовать оба семейства адресов. Управляющий слой кластера может назначить
одному [поду](/docs/concepts/workloads/pods/) или
[сервису](/docs/concepts/services-networking/service/) одновременно адреса IPv4 и IPv6.

<!-- body -->

## {{% heading "prerequisites" %}}

Необходимо установить инструмент [kubeadm](/docs/reference/setup-tools/kubeadm/)
по инструкции [Установка kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Убедитесь, что на каждом сервере, который будет использоваться как
{{< glossary_tooltip text="узел" term_id="node" >}}, разрешена пересылка IPv6.

### Включение пересылки пакетов IPv6 {#prerequisite-ipv6-forwarding}

Чтобы проверить, включена ли пересылка пакетов IPv6:

```bash
sysctl net.ipv6.conf.all.forwarding
```
Если вывод — `net.ipv6.conf.all.forwarding = 1`, она уже включена.
В противном случае она ещё не включена.

Чтобы вручную включить пересылку пакетов IPv6:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Вам нужны диапазоны адресов IPv4 и IPv6. Администраторы кластеров обычно используют
частные диапазоны IPv4. Для IPv6 обычно выбирают блок глобальных одноадресных адресов
из `2000::/3` в пределах диапазона, выделенного администратору.
Маршрутизировать диапазоны IP-адресов кластера в общедоступный интернет не обязательно.

Размер выделенных диапазонов должен соответствовать планируемому числу подов и сервисов.

{{< note >}}
При обновлении существующего кластера командой `kubeadm upgrade` инструмент `kubeadm`
не поддерживает изменение диапазона IP-адресов подов («cluster CIDR»)
или диапазона адресов сервисов кластера («Service CIDR»).
{{< /note >}}

### Создание двухстекового кластера {#create-a-dual-stack-cluster}

Для создания двухстекового кластера командой `kubeadm init` можно передать
аргументы командной строки, как в следующем примере:

```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Для наглядности ниже приведён пример
[файла конфигурации](/docs/reference/config-api/kubeadm-config.v1beta4/)
kubeadm `kubeadm-config.yaml` для первого узла управляющего слоя двухстекового кластера.

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

`advertiseAddress` в InitConfiguration задаёт IP-адрес, который сервер API объявляет
как свой адрес прослушивания. Значение `advertiseAddress` соответствует
флагу `--apiserver-advertise-address` команды `kubeadm init`.

Запустите kubeadm для инициализации узла управляющего слоя двухстекового кластера:

```shell
kubeadm init --config=kubeadm-config.yaml
```

Флаги kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
получают значения по умолчанию. См.
[Настройка двух стеков IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Флаг `--apiserver-advertise-address` не поддерживает два стека.
{{< /note >}}

### Присоединение узла к двухстековому кластеру {#join-a-node-to-dual-stack-cluster}

Перед присоединением узла убедитесь, что у него есть сетевой интерфейс с маршрутизируемым IPv6
и разрешена пересылка IPv6.

Пример [файла конфигурации](/docs/reference/config-api/kubeadm-config.v1beta4/)
kubeadm `kubeadm-config.yaml` для присоединения рабочего узла:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Пример [файла конфигурации](/docs/reference/config-api/kubeadm-config.v1beta4/)
kubeadm `kubeadm-config.yaml` для присоединения ещё одного узла управляющего слоя:

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
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` в JoinConfiguration.controlPlane задаёт IP-адрес,
который сервер API объявляет как свой адрес прослушивания.
Значение `advertiseAddress` соответствует флагу `--apiserver-advertise-address` команды `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Создание одностекового кластера {#create-a-single-stack-cluster}

{{< note >}}
Поддержка двух стеков не означает, что необходимо использовать адресацию обоих семейств.
Можно развернуть одностековый кластер с включённой возможностью двухстековой сети.
{{< /note >}}

Для наглядности ниже приведён пример
[файла конфигурации](/docs/reference/config-api/kubeadm-config.v1beta4/)
kubeadm `kubeadm-config.yaml` для узла управляющего слоя одностекового кластера.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [Проверьте двухстековую сеть IPv4/IPv6](/docs/tasks/network/validate-dual-stack).
* Прочитайте о [двухстековой](/docs/concepts/services-networking/dual-stack/) сети кластера.
* Узнайте больше о [формате конфигурации](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm.
