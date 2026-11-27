---
title: kubeadm bilan dual-stack qoʻllab-quvvatlash
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubernetes klasteringiz [dual-stack](/docs/concepts/services-networking/dual-stack/)
tarmoqni oʻz ichiga oladi. Bu klaster tarmogʻi har ikkala manzil oilasidan foydalanish imkonini berishini anglatadi.
Klasterda boshqaruv tekisligi bitta
{{< glossary_tooltip text="Pod" term_id="pod" >}} yoki {{< glossary_tooltip text="Service" term_id="service" >}} ga ham IPv4 manzilini, ham IPv6 manzilini tayinlashi mumkin.

<!-- body -->

## {{% heading "prerequisites" %}}

[kubeadm ni oʻrnatish](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) qadamlariga amal qilib,
{{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} vositasini oʻrnatgan boʻlishingiz kerak.

{{< glossary_tooltip text="tugun" term_id="node" >}} sifatida ishlatmoqchi boʻlgan har bir server
IPv6 yoʻnaltirishga ruxsat berishiga ishonch hosil qiling.

### IPv6 paketlarini yoʻnaltirishni yoqish {#prerequisite-ipv6-forwarding}

IPv6 paketlarini yoʻnaltirish yoqilganini tekshirish uchun:

```bash
sysctl net.ipv6.conf.all.forwarding
```
Agar chiqish `net.ipv6.conf.all.forwarding = 1` boʻlsa, u allaqachon yoqilgan.
Aks holda hali yoqilmagan.

IPv6 paketlarini yoʻnaltirishni qoʻlda yoqish uchun:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```


Foydalanish uchun IPv4 va IPv6 manzil diapazonlaringiz boʻlishi kerak. Klaster operatorlari odatda
IPv4 uchun xususiy manzil diapazonlaridan foydalanadi. IPv6 uchun klaster operatori odatda operatorga ajratilgan diapazondan foydalanib, `2000::/3` ichidan global
unicast manzil blokini tanlaydi.
Klaster IP manzil diapazonlarini ommaviy internetga marshrutlashingiz shart emas.

IP manzil ajratmalarining hajmi ishga tushirishni rejalashtirayotgan Podlar va
Servicelar soniga mos boʻlishi kerak.

{{< note >}}
Agar mavjud klasterni `kubeadm upgrade` buyrugʻi bilan yangilayotgan boʻlsangiz,
`kubeadm` Pod IP manzil diapazoniga
(“cluster CIDR”) ham, klaster Service manzil diapazoniga (“Service CIDR”) ham oʻzgartirish kiritishni qoʻllab-quvvatlamaydi.
{{< /note >}}

### Dual-stack klaster yaratish {#create-a-dual-stack-cluster}

Dual-stack klasterini `kubeadm init` bilan yaratish uchun quyidagi misolga oʻxshash buyruq qatori argumentlarini
uzatishingiz mumkin:

```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Tushunarliroq boʻlishi uchun mana asosiy dual-stack boshqaruv tekisligi tuguni uchun kubeadm
[konfiguratsiya fayli](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` misoli.

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

InitConfiguration dagi `advertiseAddress` API Server tinglayotganini eʼlon qiladigan IP manzilni
koʻrsatadi. `advertiseAddress` qiymati
`kubeadm init` ning `--apiserver-advertise-address` flagiga teng.

Dual-stack boshqaruv tekisligi tugunini ishga tushirish uchun kubeadm ni ishga tushiring:

```shell
kubeadm init --config=kubeadm-config.yaml
```

`kube-controller-manager` flaglari `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
standart qiymatlar bilan belgilanadi. [IPv4/IPv6 dual stack ni sozlash](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack) sahifasiga qarang.

{{< note >}}
`--apiserver-advertise-address` flagi dual-stack ni qoʻllab-quvvatlamaydi.
{{< /note >}}

### Tugunni dual-stack klasterga qoʻshish {#join-a-node-to-dual-stack-cluster}

Tugunni qoʻshishdan oldin tugunda IPv6 marshrutlanadigan tarmoq interfeysi borligiga va u IPv6 yoʻnaltirishga ruxsat berishiga ishonch hosil qiling.

Ishchi tugunni klasterga qoʻshish uchun kubeadm [konfiguratsiya fayli](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` misoli.

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

Shuningdek, klasterga yana bir boshqaruv tekisligi tugunini qoʻshish uchun kubeadm [konfiguratsiya fayli](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` misoli.

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

JoinConfiguration.controlPlane dagi `advertiseAddress` API Server tinglayotganini eʼlon qiladigan IP manzilni
koʻrsatadi. `advertiseAddress` qiymati
`kubeadm join` ning `--apiserver-advertise-address` flagiga teng.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Bitta stekli klaster yaratish {#create-a-single-stack-cluster}

{{< note >}}
Dual-stack qoʻllab-quvvatlash dual-stack manzillashdan foydalanishingiz shartligini anglatmaydi.
Dual-stack tarmoq imkoniyati yoqilgan bitta stekli (single-stack) klasterni joylashtirishingiz mumkin.
{{< /note >}}

Yanada tushunarli boʻlishi uchun mana bitta stekli boshqaruv tekisligi tuguni uchun kubeadm
[konfiguratsiya fayli](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` misoli.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) tarmogʻini tekshirish
* [Dual-stack](/docs/concepts/services-networking/dual-stack/) klaster tarmogʻi haqida oʻqish
* kubeadm [konfiguratsiya formati](/docs/reference/config-api/kubeadm-config.v1beta4/) haqida koʻproq bilib olish
