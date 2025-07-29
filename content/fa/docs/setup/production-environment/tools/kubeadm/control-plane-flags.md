---
reviewers:
- xirehat
title: سفارشی‌سازی اجزا با API مربوط به kubeadm
content_type: concept
weight: 40
---

<!-- overview -->

این صفحه نحوه **سفارشی‌سازی مؤلفه‌هایی** را توضیح می‌دهد که ‌kubeadm استقرار می‌دهد.  
برای مؤلفه‌های *کنترل پلِین* می‌توانید از فلگ‌ها در ساختار `ClusterConfiguration` یا از پچ‌های تک‌نودی استفاده کنید.  
برای **kubelet** و **kube-proxy** نیز به ترتیب از `KubeletConfiguration` و `KubeProxyConfiguration` بهره بگیرید.

همه این گزینه‌ها از طریق **API پیکربندی kubeadm** قابل اعمال است.  
برای جزئیات بیش‌تر درباره هر فیلد در این پیکربندی‌ها می‌توانید به صفحات مرجع
[API](/docs/reference/config-api/kubeadm-config.v1beta4/) مراجعه کنید.

{{< note >}}
در حال حاضر سفارشی‌سازی استقرار **CoreDNS** توسط kubeadm پشتیبانی نمی‌شود.  
باید به صورت دستی {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} مربوط به
`kube-system/coredns` را پچ کرده و سپس {{< glossary_tooltip text="Pods" term_id="pod" >}}
های CoreDNS را دوباره ایجاد کنید. به‌عنوان جایگزین، می‌توانید از استقرار پیش‌فرض CoreDNS صرف‌نظر کرده و
نسخه دلخواه خود را پیاده کنید. برای جزئیات بیش‌تر، به بخش
[استفاده از فازهای init در kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases) مراجعه کنید.
{{< /note >}}

{{< note >}}
برای **پیکربندی مجدد** یک خوشه‌ای که پیش‌تر ایجاد شده، به
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) مراجعه کنید.
{{< /note >}}

<!-- body -->

## سفارشی‌سازی Control Plane با پرچم‌ها در `ClusterConfiguration`

شیٔ `ClusterConfiguration` در **kubeadm** راهی در اختیار کاربر می‌گذارد تا فلگ‌های پیش‌فرض
ارسال‌شده به مؤلفه‌های کنترل پلِین مانند *APIServer*، *ControllerManager*، *Scheduler* و *Etcd* را
بازنویسی (override) کند. این مؤلفه‌ها با ساختارهای زیر تعریف می‌شوند:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

همۀ این ساختارها دارای فیلد مشترک `extraArgs` هستند که از جفت‌های `نام / مقدار` تشکیل می‌شود.
برای بازنویسی یک فلگ در مؤلفه کنترل پلِین:

1.  فیلد `extraArgs` مناسب را به پیکربندی خود بیفزایید.
2.  فلگ‌های موردنظر را در فیلد `extraArgs` قرار دهید.
3.  فرمان `kubeadm init` را با گزینه `--config <YOUR CONFIG YAML>` اجرا کنید.

{{< note >}}
می‌توانید با اجرای دستور `kubeadm config print init-defaults` و ذخیرۀ خروجی در فایلی دلخواه،
یک شیٔ `ClusterConfiguration` با مقادیر پیش‌فرض تولید کنید.
{{< /note >}}

{{< note >}}
شیٔ `ClusterConfiguration` در حال حاضر در خوشه‌های kubeadm *سراسری* است؛
یعنی هر فلگی که اضافه کنید برای تمام نمونه‌های همان مؤلفه روی نودهای مختلف اعمال می‌شود.
برای اعمال پیکربندی جداگانه بر مؤلفه‌های یکسان در نودهای متفاوت می‌توانید از
[وصله‌ها](#patches) استفاده کنید.
{{< /note >}}

{{< note >}}
فلگ‌های تکراری (کلیدهای مشابه) یا ارسال چندباره یک فلگ مانند `--foo` در حال حاضر
پشتیبانی نمی‌شود. برای دور زدن این محدودیت باید از
[وصله‌ها](#patches) بهره بگیرید.
{{< /note >}}


### پرچم‌های APIServer

برای جزئیات بیش‌تر، به [مستند مرجع kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) مراجعه کنید.

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

برای جزئیات بیش‌تر، به [مستند مرجع kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) مراجعه کنید.

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

برای جزئیات بیشتر، به [مستند مرجع kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) مراجعه کنید.

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

برای جزئیات بیشتر، به [مستندات سرور etcd](https://etcd.io/docs/) مراجعه کنید.

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

**kubeadm** به شما اجازه می‌دهد مسیری شامل فایل‌های وصله را به `InitConfiguration` و `JoinConfiguration`
روی هر نود بدهید. این پچ‌ها می‌توانند به‌عنوان آخرین گام سفارشی‌سازی، پیش از آنکه پیکربندی مؤلفه‌ها روی دیسک نوشته شود، به کار روند.

می‌توانید این فایل را با گزینه `--config <YOUR CONFIG YAML>` به دستور `kubeadm init` بدهید:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
برای `kubeadm init` می‌توانید فایلی ارائه کنید که هر دو بخش `ClusterConfiguration` و `InitConfiguration` را در خود داشته باشد و با `---` از هم جدا شده باشند.
{{< /note >}}

می‌توانید این فایل را با گزینه `--config <YOUR CONFIG YAML>` به `kubeadm join` بدهید:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

دایرکتوری باید فایل‌هایی با الگوی نام `target[suffix][+patchtype].extension` داشته باشد؛
برای مثال: `kube-apiserver0+merge.yaml` یا به‌سادگی `etcd.json`.

- **`target`** می‌تواند یکی از این موارد باشد: `kube-apiserver`، `kube-controller-manager`، `kube-scheduler`، `etcd`
  و `kubeletconfiguration`.
- **`suffix`** یک رشته اختیاری است که می‌توان از آن برای تعیین ترتیب اعمال پچ‌ها به‌صورت الفباـعددی استفاده کرد.
- **`patchtype`** می‌تواند یکی از `strategic`، `merge` یا `json` باشد و باید با قالب‌های پچی که
  [kubectl پشتیبانی می‌کند](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch)
  سازگار باشد. مقدار پیش‌فرض `strategic` است.
- **`extension`** باید `json` یا `yaml` باشد.

{{< note >}}
اگر برای ارتقای نودهای kubeadm از `kubeadm upgrade` استفاده می‌کنید، باید دوباره همان پچ‌ها را
ارائه دهید تا سفارشی‌سازی‌ها پس از ارتقا حفظ شوند. برای این کار می‌توانید از فلگ `--patches`
استفاده کنید که باید به همان دایرکتوری اشاره کند. در حال حاضر `kubeadm upgrade` ساختار API
پیکربندی جداگانه‌ای برای این منظور ندارد.
{{< /note >}}

## سفارشی سازی kubelet {#kubelet}

برای سفارشی‌سازی **kubelet** می‌توانید یک [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
را در همان فایل پیکربندی، کنار `ClusterConfiguration` یا `InitConfiguration` و جدا شده با `---` قرار دهید.
سپس این فایل را به `kubeadm init` بدهید؛ kubeadm همان پیکربندی پایه `KubeletConfiguration`
را روی تمام نودهای خوشه اعمال می‌کند.

برای اعمال پیکربندی ویژه هر نود بر روی `KubeletConfiguration` پایه می‌توانید از
هدف پچ [`kubeletconfiguration`](#patches) استفاده کنید.

روش دیگر این است که فلگ‌های kubelet را به‌عنوان جایگزین در فیلد
`nodeRegistration.kubeletExtraArgs` (که هم در `InitConfiguration` و هم در `JoinConfiguration` پشتیبانی می‌شود) قرار دهید.
برخی فلگ‌های kubelet منسوخ شده‌اند؛ بنابراین قبل از استفاده، وضعیت آن‌ها را در
[مستند مرجع kubelet](/docs/reference/command-line-tools-reference/kubelet) بررسی کنید.

برای جزئیات بیشتر به
[پیکربندی هر kubelet در خوشه با استفاده از kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)
مراجعه کنید.

## سفارشی سازی kube-proxy

برای سفارشی‌سازی **kube-proxy** می‌توانید یک `KubeProxyConfiguration` را کنار `ClusterConfiguration`
یا `InitConfiguration` (جداشده با `---`) در دستور `kubeadm init` بگنجانید.

برای جزئیات بیشتر به صفحات مرجع [API](/docs/reference/config-api/kubeadm-config.v1beta4/) مراجعه کنید.

{{< note >}}
kubeadm، ‌kube-proxy را به‌صورت یک {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} مستقر می‌کند؛
بنابراین `KubeProxyConfiguration` روی تمام نمونه‌های kube-proxy در خوشه اعمال خواهد شد.
{{< /note >}}
