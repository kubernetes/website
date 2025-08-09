---
title: استانداردهای امنیتی پاد را در سطح خوشه اعمال کنید
content_type: tutorial
weight: 10
---

{{% alert title="Note" %}}
این آموزش فقط برای خوشه‌های جدید کاربرد دارد.
{{% /alert %}}

Pod Security یک کنترل‌کننده admission است که هنگام ایجاد پادهای جدید، بررسی‌هایی را بر اساس
[استانداردهای امنیت پاد](/docs/concepts/security/pod-security-standards/) کوبرنتیز انجام می‌دهد.
این قابلیت در نسخه v1.25 به GA رسیده است.  
این راهنما به شما نشان می‌دهد چگونه استاندارد امنیت پاد `baseline` را در سطح خوشه اجرا کنید
تا یک پیکربندی یکسان به همه namespaceهای خوشه اعمال شود.

برای اعمال استانداردهای امنیت پاد روی namespaceهای مشخص، به
[اعمال استانداردهای امنیت پاد در سطح namespace](/docs/tutorials/security/ns-level-pss) مراجعه کنید.

اگر نسخه‌ای غیر از v{{< skew currentVersion >}} از Kubernetes را اجرا می‌کنید،
مستندات همان نسخه را بررسی کنید.

## {{% heading "prerequisites" %}}

روی ایستگاه کاری خود موارد زیر را نصب کنید:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

این راهنما پیکربندی‌هایی را نشان می‌دهد که برای خوشهی از Kubernetes که کنترل کامل آن را در دست دارید
می‌توانید انجام دهید. اگر قصد دارید Pod Security Admission را برای خوشه مدیریت‌شده‌ای پیکربندی کنید
که در آن امکان تغییر کنترل‌پلین را ندارید،
[اعمال استانداردهای امنیت پاد در سطح namespace](/docs/tutorials/security/ns-level-pss) را مطالعه کنید.

## انتخاب استاندارد مناسب امنیت پاد برای اعمال

[Pod Security Admission](/docs/concepts/security/pod-security-admission/)
به شما اجازه می‌دهد [استانداردهای امنیت پاد](/docs/concepts/security/pod-security-standards/)
داخلی را با حالت‌های `enforce`، `audit` و `warn` اعمال کنید.

برای جمع‌آوری اطلاعاتی که به انتخاب استاندارد امنیت پاد مناسب برای پیکربندی‌تان کمک می‌کند، این مراحل را طی کنید:

1. یک خوشه بدون اعمال هیچ استاندارد امنیت پاد ایجاد کنید:

   ```shell
   kind create cluster --name psa-wo-cluster-pss
   ```
   The output is similar to:
   ```
   Creating cluster "psa-wo-cluster-pss" ...
   ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
   ✓ Preparing nodes 📦
   ✓ Writing configuration 📜
   ✓ Starting control-plane 🕹️
   ✓ Installing CNI 🔌
   ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-wo-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-wo-cluster-pss

   Thanks for using kind! 😊
   ```

1. زمینه kubectl را روی خوشه جدید تنظیم کنید:

   ```shell
   kubectl cluster-info --context kind-psa-wo-cluster-pss
   ```
   The output is similar to this:

   ```
   Kubernetes control plane is running at https://127.0.0.1:61350

   CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. لیستی از فضاهای نام موجود در خوشه را دریافت کنید:

   ```shell
   kubectl get ns
   ```
   The output is similar to this:
   ```
   NAME                 STATUS   AGE
   default              Active   9m30s
   kube-node-lease      Active   9m32s
   kube-public          Active   9m32s
   kube-system          Active   9m32s
   local-path-storage   Active   9m26s
   ```

1. برای درک اینکه هنگام اعمال استانداردهای مختلف امنیتی پاد چه اتفاقی می‌افتد، از `--dry-run=server` استفاده کنید:

   1. Privileged
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

      The output is similar to:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```
   2. Baseline
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=baseline
      ```

      خروجی مشابه زیر است:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "baseline:latest"
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```

   3. Restricted
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=restricted
      ```

      The output is similar to:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "restricted:latest"
      Warning: coredns-7bb9c7b568-hsptc (and 1 other pod): unrestricted capabilities, runAsNonRoot != true, seccompProfile
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      namespace/kube-system labeled
      Warning: existing pods in namespace "local-path-storage" violate the new PodSecurity enforce level "restricted:latest"
      Warning: local-path-provisioner-d6d9f7ffc-lw9lh: allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
      namespace/local-path-storage labeled
      ```

از خروجی قبلی متوجه می‌شوید که اعمال استاندارد امنیت پاد `privileged` برای هیچ ‌namespaceای هشداری نشان نمی‌دهد.
اما استانداردهای `baseline` و `restricted` هر دو هشدارهایی دارند، به‌ویژه در namespace `kube-system`.

## تنظیم حالت‌ها، نسخه‌ها و استانداردها

در این بخش، استانداردهای امنیت پاد زیر را بر روی نسخه `latest` اعمال می‌کنید:

* استاندارد `baseline` در حالت `enforce`
* استاندارد `restricted` در حالت‌های `warn` و `audit`

استاندارد امنیت پاد `baseline` یک میانه مناسب فراهم می‌کند که
فهرست استثناها را کوتاه نگه می‌دارد و از افزایش امتیازهای شناخته‌شده جلوگیری می‌کند.

همچنین، برای جلوگیری از خطای پادها در `kube-system`، این namespace را
از اعمال استانداردهای امنیت پاد مستثنا خواهید کرد.

هنگام پیاده‌سازی Pod Security Admission در محیط خود، موارد زیر را در نظر بگیرید:

1. بر اساس وضعیت ریسک در یک خوشه، ممکن است استاندارد سخت‌گیرانه‌ترِ
   `restricted` انتخاب بهتری باشد.
1. مستثناکردن namespace‌ `kube-system` اجازه می‌دهد پادها در این فضا با
   حالت `privileged` اجرا شوند. در کاربردهای واقعی، پروژه Kubernetes
   به‌شدت توصیه می‌کند که با پیروی از اصل حداقل امتیاز،‌ سیاست‌های RBAC
   سخت‌گیرانه‌ای اعمال کنید که دسترسی به `kube-system` را محدود می‌کند.

برای پیاده‌سازی استانداردهای فوق، این مراحل را انجام دهید:

1. یک فایل پیکربندی ایجاد کنید که کنترلر Pod Security Admission بتواند از آن
   برای اعمال این استانداردهای امنیت پاد استفاده کند:

   ```
   mkdir -p /tmp/pss
   cat <<EOF > /tmp/pss/cluster-level-pss.yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: AdmissionConfiguration
   plugins:
   - name: PodSecurity
     configuration:
       apiVersion: pod-security.admission.config.k8s.io/v1
       kind: PodSecurityConfiguration
       defaults:
         enforce: "baseline"
         enforce-version: "latest"
         audit: "restricted"
         audit-version: "latest"
         warn: "restricted"
         warn-version: "latest"
       exemptions:
         usernames: []
         runtimeClasses: []
         namespaces: [kube-system]
   EOF
   ```

   {{< note >}}
پیکربندی `pod-security.admission.config.k8s.io/v1` نیازمند نسخه v1.25+ است.  
برای نسخه‌های v1.23 و v1.24 از [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/) استفاده کنید.  
برای v1.22 از [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/) استفاده کنید.
   {{< /note >}}


1. سرور API را طوری پیکربندی کنید که در طول ایجاد خوشه، از این فایل استفاده کند:

   ```
   cat <<EOF > /tmp/pss/cluster-config.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
     kubeadmConfigPatches:
     - |
       kind: ClusterConfiguration
       apiServer:
           extraArgs:
             admission-control-config-file: /etc/config/cluster-level-pss.yaml
           extraVolumes:
             - name: accf
               hostPath: /etc/config
               mountPath: /etc/config
               readOnly: false
               pathType: "DirectoryOrCreate"
     extraMounts:
     - hostPath: /tmp/pss
       containerPath: /etc/config
       # optional: if set, the mount is read-only.
       # default false
       readOnly: false
       # optional: if set, the mount needs SELinux relabeling.
       # default false
       selinuxRelabel: false
       # optional: set propagation mode (None, HostToContainer or Bidirectional)
       # see https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation
       # default None
       propagation: None
   EOF
   ```

   {{<note>}}
اگر از Docker Desktop با *kind* در macOS استفاده می‌کنید، می‌توانید `/tmp` را به عنوان یک دایرکتوری مشترک در زیر آیتم منو اضافه کنید.
   **Preferences > Resources > File Sharing**.
   {{</note>}}

1. خوشه‌ای ایجاد کنید که از Pod Security Admission برای اعمال این استانداردهای Pod Security استفاده کند:

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```
   خروجی مشابه این است:
   ```
   Creating cluster "psa-with-cluster-pss" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-with-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-with-cluster-pss

   Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
   ```

1. kubectl را به خوشه اشاره دهید:
   ```shell
   kubectl cluster-info --context kind-psa-with-cluster-pss
   ```
   خروجی مشابه این است:
   ```
   Kubernetes control plane is running at https://127.0.0.1:63855
   CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. یک Pod در فضای نام پیش‌فرض ایجاد کنید:

    {{% code_sample file="security/example-baseline-pod.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   پاد به طور عادی شروع به کار می‌کند، اما خروجی شامل یک هشدار است:
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## تمیز کردن

حالا با اجرای دستور زیر، خوشههایی که در بالا ایجاد کردید را حذف کنید:

```shell
kind delete cluster --name psa-with-cluster-pss
```
```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}}

- اجرای یک
  [اسکریپت شِل](/examples/security/kind-with-cluster-level-baseline-pod-security.sh)
  برای انجام همه مراحل فوق به‌صورت یک‌جا:
  1. ایجاد یک پیکربندی سطح خوشه بر پایه استانداردهای امنیت پاد
  2. ایجاد فایلی تا سرور API بتواند این پیکربندی را مصرف کند
  3. ایجاد خوشهی که یک سرور API با این پیکربندی راه‌اندازی می‌کند
  4. تنظیم context ابزار `kubectl` روی این خوشه جدید
  5. ایجاد یک فایل YAML حداقلی برای پاد
  6. اعمال این فایل برای ایجاد یک پاد در خوشه جدید
- [پذیرش امنیت پاد](/docs/concepts/security/pod-security-admission/)
- [استانداردهای امنیت پاد](/docs/concepts/security/pod-security-standards/)
- [اعمال استانداردهای امنیت پاد در سطح namespace](/docs/tutorials/security/ns-level-pss/)