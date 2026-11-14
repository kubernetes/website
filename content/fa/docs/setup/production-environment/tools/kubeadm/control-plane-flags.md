---
# reviewers:
# - sig-cluster-lifecycle
title: سفارشی‌سازی مؤلفه‌ها با API مربوط به kubeadm
content_type: concept
weight: 40
---

<!-- overview -->

این صفحه نحوه سفارشی‌سازی مؤلفه‌هایی را که kubeadm مستقر می‌کند توضیح می‌دهد. برای مؤلفه‌های control plane
می‌توانید از پرچم‌ها (flag) در ساختار `ClusterConfiguration` یا از وصله‌های مختص هر گره(node) استفاده کنید. برای kubelet
و kube-proxy نیز می‌توانید به ترتیب از `KubeletConfiguration` و `KubeProxyConfiguration` استفاده کنید.

همه این گزینه‌ها از طریق API پیکربندی kubeadm در دسترس هستند.
برای جزئیات بیشتر درباره هر فیلد پیکربندی می‌توانید به
[صفحات مرجع API](/docs/reference/config-api/kubeadm-config.v1beta4/) مراجعه کنید.

{{< note >}}
برای پیکربندی مجدد کلاستری که از قبل ایجاد شده است،
[پیکربندی مجدد یک کلاستر kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) را ببینید.
{{< /note >}}

<!-- body -->

## سفارشی‌سازی control plane با پرچم‌ها در `ClusterConfiguration`

شیء `ClusterConfiguration` در kubeadm راهی در اختیار کاربران می‌گذارد تا پرچم‌های پیش‌فرضی را که به مؤلفه‌های control plane مانند APIServer، ControllerManager، Scheduler و Etcd داده می‌شود، بازنویسی کنند.
مؤلفه‌ها با ساختارهای زیر تعریف می‌شوند:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

این ساختارها فیلد مشترک `extraArgs` را دارند که از جفت‌های `name` / `value` تشکیل شده است.
برای بازنویسی یک پرچم در یک مؤلفه control plane:

1.  `extraArgs` مناسب را به پیکربندی خود اضافه کنید.
2.  پرچم‌ها را به فیلد `extraArgs` اضافه کنید.
3.  `kubeadm init` را با `--config <YOUR CONFIG YAML>` اجرا کنید.

{{< note >}}
می‌توانید با اجرای `kubeadm config print init-defaults` و ذخیره خروجی در فایلی به انتخاب خودتان، یک شیء `ClusterConfiguration` با مقادیر پیش‌فرض تولید کنید.
{{< /note >}}

{{< note >}}
شیء `ClusterConfiguration` در حال حاضر در کلاسترهای kubeadm سراسری است. یعنی هر پرچمی که اضافه کنید،
روی همه نمونه‌های همان مؤلفه در گره‌های مختلف اعمال می‌شود. برای اعمال پیکربندی جداگانه به هر مؤلفه
روی گره‌های مختلف می‌توانید از [وصله‌ها](#patches) استفاده کنید.
{{< /note >}}

{{< note >}}
پرچم‌های تکراری (کلیدها)، یا چند بار دادن یک پرچم مانند `--foo`، در حال حاضر پشتیبانی نمی‌شود.
برای دور زدن این محدودیت باید از [وصله‌ها](#patches) استفاده کنید.
{{< /note >}}

### پرچم‌های APIServer

برای جزئیات، [مستندات مرجع kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) را ببینید.

نمونه استفاده:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### پرچم‌های ControllerManager

برای جزئیات، [مستندات مرجع kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) را ببینید.

نمونه استفاده:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### پرچم‌های Scheduler

برای جزئیات، [مستندات مرجع kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) را ببینید.

نمونه استفاده:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### پرچم‌های Etcd

برای جزئیات، [مستندات سرور etcd](https://etcd.io/docs/) را ببینید.

نمونه استفاده:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## سفارشی‌سازی با وصله‌ها {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm به شما امکان می‌دهد پوشه‌ای حاوی فایل‌های وصله را، روی گره‌های جداگانه، به `InitConfiguration`،
`JoinConfiguration` و `UpgradeConfiguration` بدهید. از این وصله‌ها می‌توان به‌عنوان آخرین مرحله سفارشی‌سازی استفاده کرد، پیش از آن‌که پیکربندی مؤلفه
روی دیسک نوشته شود.

می‌توانید این فایل را با `--config <YOUR CONFIG YAML>` به `kubeadm init` بدهید:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
برای `kubeadm init` می‌توانید فایلی بدهید که هم `ClusterConfiguration` و هم `InitConfiguration` را داشته باشد
و این دو با `---` از هم جدا شده باشند.
{{< /note >}}

می‌توانید این فایل را با `--config <YOUR CONFIG YAML>` به `kubeadm join` بدهید:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

اگر برای ارتقای گره‌های kubeadm از `kubeadm upgrade apply` و `kubeadm upgrade node` استفاده می‌کنید،
باید همان وصله‌ها را دوباره ارائه دهید تا سفارشی‌سازی پس از ارتقا حفظ شود.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

پوشه باید شامل فایل‌هایی با نام `target[suffix][+patchtype].extension` باشد.
برای مثال، `kube-apiserver0+merge.yaml` یا فقط `etcd.json`.

- `target` می‌تواند یکی از `kube-apiserver`، `kube-controller-manager`، `kube-scheduler`، `etcd`،
`kubeletconfiguration` و `corednsdeployment` باشد.
- `suffix` رشته‌ای اختیاری است که با آن می‌توان، بر اساس مرتب‌سازی حروفی-عددی، تعیین کرد کدام وصله‌ها ابتدا اعمال شوند.
- `patchtype` می‌تواند یکی از `strategic`، `merge` یا `json` باشد و این مقادیر باید با قالب‌های وصله
[مورد پشتیبانی kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch) مطابقت داشته باشند.
مقدار پیش‌فرض `patchtype` برابر `strategic` است.
- `extension` باید `json` یا `yaml` باشد.

## سفارشی‌سازی kubelet {#kubelet}

برای سفارشی‌سازی kubelet می‌توانید یک [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
را در کنار `ClusterConfiguration` یا `InitConfiguration`، با جداکننده `---`، در همان فایل پیکربندی اضافه کنید.
سپس می‌توان این فایل را به `kubeadm init` داد و kubeadm همان `KubeletConfiguration` پایه را
روی همه گره‌های کلاستر اعمال می‌کند.

برای اعمال پیکربندی مختص هر نمونه روی `KubeletConfiguration` پایه می‌توانید از
[هدف وصله `kubeletconfiguration`](#patches) استفاده کنید.

همچنین می‌توانید پرچم‌های kubelet را برای بازنویسی تنظیمات به کار ببرید. این پرچم‌ها را در فیلد
`nodeRegistration.kubeletExtraArgs` قرار دهید که هم `InitConfiguration` و هم `JoinConfiguration` از آن پشتیبانی می‌کنند.
برخی پرچم‌های kubelet منسوخ شده‌اند، بنابراین پیش از استفاده، وضعیت آن‌ها را در
[مستندات مرجع kubelet](/docs/reference/command-line-tools-reference/kubelet) بررسی کنید.

برای جزئیات بیشتر، [پیکربندی هر kubelet در کلاستر شما با استفاده از kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration) را ببینید.

## سفارشی‌سازی kube-proxy

برای سفارشی‌سازی kube-proxy می‌توانید یک `KubeProxyConfiguration` را در کنار `ClusterConfiguration` یا
`InitConfiguration`، با جداکننده `---`، به `kubeadm init` بدهید.

برای جزئیات بیشتر می‌توانید به [صفحات مرجع API](/docs/reference/config-api/kubeadm-config.v1beta4/) مراجعه کنید.

{{< note >}}
kubeadm، kube-proxy را به‌صورت یک {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} مستقر می‌کند، یعنی
`KubeProxyConfiguration` روی همه نمونه‌های kube-proxy در کلاستر اعمال می‌شود.
{{< /note >}}

## سفارشی‌سازی CoreDNS

kubeadm به شما امکان می‌دهد Deployment مربوط به CoreDNS را با وصله روی
[هدف وصله `corednsdeployment`](#patches) سفارشی کنید.

وصله برای سایر اشیای API مرتبط با CoreDNS، مانند {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} با نام `kube-system/coredns`،
در حال حاضر پشتیبانی نمی‌شود.
باید هر یک از این اشیا را به‌صورت دستی با kubectl وصله کنید و پس از آن
{{< glossary_tooltip text="پادها" term_id="pod" >}}ی CoreDNS را دوباره ایجاد کنید.

همچنین می‌توانید استقرار CoreDNS توسط kubeadm را با قرار دادن گزینه زیر در `ClusterConfiguration` غیرفعال کنید:

```yaml
dns:
  disabled: true
```

همچنین، با اجرای دستور زیر:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml
```

می‌توانید فایل مانیفستی را که kubeadm برای CoreDNS در راه‌اندازی شما می‌سازد، به دست آورید.
