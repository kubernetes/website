---
title: پشتیبانی از Dual-stack با kubeadm
content_type: وظیفه
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

خوشه Kubernetes شما شامل شبکه‌بندی [dual-stack](/docs/concepts/services-networking/dual-stack/) است، به این معنی که شبکه‌بندی cluster به شما امکان می‌دهد از هر دو خانواده آدرس استفاده کنید.
در یک خوشه، صفحه کنترل می‌تواند هم یک آدرس IPv4 و هم یک آدرس IPv6 را به یک {{< glossary_tooltip text="Pod" term_id="pod" >}} یا یک {{< glossary_tooltip text="Service" term_id="service" >}} اختصاص دهد.

<!-- body -->

## {{% heading "پیش نیازها" %}}


شما باید ابزار {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} را نصب کرده باشید، مراحل Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) را دنبال کنید.

برای هر سروری که می‌خواهید به عنوان {{< glossary_tooltip text="node" term_id="node" >}} استفاده کنید، مطمئن شوید که امکان فورواردینگ IPv6 را فراهم می‌کند.


### فعال کردن ارسال بسته IPv6
{#prerequisite-ipv6-forwarding}

To check if IPv6 packet forwarding is enabled:


```bash
sysctl net.ipv6.conf.all.forwarding
```
اگر خروجی `net.ipv6.conf.all.forwarding = 1` باشد، از قبل فعال شده است. در غیر این صورت هنوز فعال نشده است.


برای فعال کردن دستی فورواردینگ بسته IPv6:


```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

برای استفاده از IPv4 و IPv6 به یک محدوده آدرس IPv4 و IPv6 نیاز دارید. اپراتورهای Cluster معمولاً از محدوده آدرس‌های خصوصی برای IPv4 استفاده می‌کنند. برای IPv6، یک اپراتور Cluster معمولاً یک بلوک آدرس یونی‌کست سراسری را از داخل `2000::/3` با استفاده از محدوده‌ای که به اپراتور اختصاص داده شده است، انتخاب می‌کند. لازم نیست محدوده آدرس‌های IP Cluster را به اینترنت عمومی مسیریابی کنید.


اندازه تخصیص آدرس IP باید برای تعداد پادها و سرویس‌هایی که قصد اجرای آنها را دارید، مناسب باشد.


{{< note >}}
اگر در حال ارتقاء یک کلاستر موجود با دستور `kubeadm upgrade` هستید، `kubeadm` از ایجاد تغییر در محدوده آدرس IP پاد ("cluster CIDR") و همچنین محدوده آدرس سرویس کلاستر ("Service CIDR") پشتیبانی نمی‌کند.
{{< /note >}}

### ایجاد یک کلاستر dual-stack 

برای ایجاد یک کلاستر dual-stack  با `kubeadm init` می‌توانید آرگومان‌های خط فرمان را مشابه مثال زیر ارسال کنید:


```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

برای روشن‌تر شدن موضوع، در اینجا یک مثال از kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` برای گره صفحه کنترل دو پشته‌ای اصلی آورده شده است.


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

`advertiseAddress` در InitConfiguration آدرس IP را مشخص می‌کند که سرور API اعلام می‌کند که به آن گوش می‌دهد. مقدار `advertiseAddress` برابر با پرچم `--apiserver-advertise-address` از `kubeadm init` است.


برای شروع گره صفحه کنترل دو پشته‌ای، kubeadm را اجرا کنید:


```shell
kubeadm init --config=kubeadm-config.yaml
```

پرچم‌های kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` با مقادیر پیش‌فرض تنظیم شده‌اند. به [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack) مراجعه کنید.


{{< note >}}
پرچم `--apiserver-advertise-address` از دو پشته پشتیبانی نمی‌کند.
{{< /note >}}

### اتصال یک node به dual-stack cluster

قبل از اتصال به یک گره، مطمئن شوید که گره دارای رابط شبکه قابل مسیریابی IPv6 است و امکان ارسال IPv6 را فراهم می‌کند.

در اینجا یک مثال از kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` برای اتصال یک گره کارگر به خوشه آمده است.


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

همچنین، در اینجا یک مثال از kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` برای اتصال یک گره صفحه کنترل دیگر به خوشه وجود دارد.


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

`advertiseAddress` در JoinConfiguration.controlPlane آدرس IP را مشخص می‌کند که سرور API اعلام می‌کند که به آن گوش می‌دهد. مقدار `advertiseAddress` برابر است با `--apiserver-advertise-address` پرچم `kubeadm join`.


```shell
kubeadm join --config=kubeadm-config.yaml
```

### Create a single-stack cluster

{{< note >}}
پشتیبانی از Dual-stack به این معنی نیست که شما نیاز به استفاده از آدرس‌دهی دو پشته دارید.
شما می‌توانید یک کلاستر تک پشته‌ای را که ویژگی شبکه دو پشته‌ای در آن فعال است، مستقر کنید.
{{< /note >}}

برای روشن‌تر شدن موضوع، در اینجا یک مثال از kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` برای گره صفحه کنترل تک پشته‌ای آورده شده است.



```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "بعدی چیست؟" %}}

* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack)
* درباره شبکه خوشه‌ای [Dual-stack](/docs/concepts/services-networking/dual-stack/) مطالعه کنید
* درباره kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta4/) بیشتر بدانید