---
title: گواهینامه‌ها و الزامات PKI
content_type: concept
weight: 50
---

<!-- overview -->

کوبرنتیز برای احراز هویت از طریق TLS به گواهینامه‌های PKI نیاز دارد.
اگر کوبرنتیز را با [kubeadm](/docs/reference/setup-tools/kubeadm/) نصب کنید، گواهینامه‌هایی که کلاستر شما نیاز دارد به طور خودکار تولید می‌شوند.
همچنین می‌توانید گواهینامه‌های خودتان را تولید کنید -- به عنوان مثال، برای ایمن‌تر نگه داشتن کلیدهای خصوصی خود
با ذخیره نکردن آنها در سرور API.
این صفحه گواهینامه‌هایی را که کلاستر شما نیاز دارد توضیح می‌دهد.

<!-- body -->

## نحوه استفاده از گواهی‌ها توسط خوشه شما

کوبرنتیز برای عملیات‌های زیر به PKI نیاز دارد:

### گواهینامه‌های سرور

* گواهینامه سرور برای نقطه پایانی (endpoint) سرور API  
* گواهینامه سرور برای سرور etcd  
* [گواهینامه‌های سرور](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  برای هر kubelet (هر {{< glossary_tooltip text="گره" term_id="node" >}} یک kubelet اجرا می‌کند)  
* گواهینامه سرور اختیاری برای [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)  

### گواهینامه‌های Client

* گواهی‌های کلاینت برای هر kubelet، برای احراز هویت به سرور API به عنوان یک کلاینت از API کوبرنتیز  
* گواهی کلاینت برای هر سرور API، برای احراز هویت به etcd  
* گواهی کلاینت برای مدیر کنترل (controller manager) برای ارتباط امن با سرور API  
* گواهی کلاینت برای زمان‌بند (scheduler) برای ارتباط امن با سرور API  
* گواهی‌های کلاینت، یکی برای هر گره، برای kube-proxy جهت احراز هویت به سرور API  
* گواهی‌های کلاینت اختیاری برای مدیران خوشه جهت احراز هویت به سرور API  
* گواهی کلاینت اختیاری برای [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)  

### گواهینامه‌های سرور و کلاینت Kubelet

برای ایجاد یک اتصال امن و احراز هویت خود به kubelet، سرور API
به یک گواهی کلاینت و جفت کلید نیاز دارد.

در این سناریو، دو رویکرد برای استفاده از گواهی وجود دارد:

* گواهی‌های مشترک: kube-apiserver می‌تواند از همان گواهی و جفت کلید مورد استفاده خود برای احراز هویت کلاینت‌های خود استفاده کند. این بدان معناست که گواهی‌های موجود، مانند `apiserver.crt` و `apiserver.key`، می‌توانند برای ارتباط با سرورهای kubelet استفاده شوند.

* گواهی‌های جداگانه: به عنوان یک جایگزین، kube-apiserver می‌تواند یک گواهی کلاینت و جفت کلید جدید برای احراز هویت ارتباط خود با سرورهای kubelet ایجاد کند. در این حالت، یک گواهی مجزا به نام `kubelet-client.crt` و کلید خصوصی مربوطه آن، `kubelet-client.key` ایجاد می‌شوند.

{{< note >}}
گواهی‌های `front-proxy` فقط در صورتی لازم هستند که kube-proxy را برای پشتیبانی از  [افزونه سرور API](/docs/tasks/extend-kubernetes/setup-extension-api-server/) اجرا کنید.
{{< /note >}}

etcd همچنین TLS متقابل را برای احراز هویت کلاینت‌ها و نظیرها پیاده‌سازی می‌کند.

## محل نگهداری گواهینامه‌ها

اگر کوبرنتیز را با kubeadm نصب کنید، بیشتر گواهینامه‌ها در `/etc/kubernetes/pki` ذخیره می‌شوند.
تمام مسیرهای موجود در این مستندات به آن پوشه مربوط می‌شوند، به استثنای گواهینامه‌های حساب کاربری که kubeadm آنها را در `/etc/kubernetes` قرار می‌دهد.

## پیکربندی دستی گواهینامه‌ها

اگر نمی‌خواهید kubeadm گواهی‌های مورد نیاز را تولید کند، می‌توانید آنها را با استفاده از یک CA ریشه واحد یا با ارائه همه گواهی‌ها ایجاد کنید. برای جزئیات بیشتر در مورد ایجاد مرجع صدور گواهی خود، به [گواهینماه‌ها](/docs/tasks/administer-cluster/certificates/) مراجعه کنید. برای اطلاعات بیشتر در مورد مدیریت گواهی‌ها، به [مدیریت گواهینامه با kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/) مراجعه کنید.

### CA تک ریشه

شما می‌توانید یک root CA واحد ایجاد کنید که توسط یک مدیر کنترل می‌شود. این root CA می‌تواند چندین CA میانی ایجاد کند و تمام مراحل ایجاد بیشتر را به خود کوبرنتیز واگذار کند.

CA های مورد نیاز:

| Path                   | Default CN                | Description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

علاوه بر CA های فوق، دریافت یک جفت کلید عمومی/خصوصی برای مدیریت حساب سرویس، `sa.key` و `sa.pub` نیز ضروری است.

مثال زیر کلید CA و فایل‌های گواهی نشان داده شده در جدول قبلی را نشان می‌دهد:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### همه گواهینامه‌ها

اگر نمی‌خواهید کلیدهای خصوصی CA را در خوشه خود کپی کنید، می‌توانید خودتان تمام گواهینامه‌ها را تولید کنید.

گواهینامه‌های مورد نیاز:

| Default CN                    | Parent CA                 | O (in Subject) | kind             | hosts (SAN)                                         |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |

{{< note >}}
به جای استفاده از گروه کاربر ارشد `system:masters` برای `kube-apiserver-kubelet-client`، می‌توان از یک گروه با امتیاز کمتر استفاده کرد. kubeadm برای این منظور از گروه `kubeadm:cluster-admins` استفاده می‌کند.
{{< /note >}}

که در آن `kind` به یک یا چند مورد از کاربردهای کلید x509 نگاشت می‌شود، که در `.spec.usages` از یک [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest) نیز مستند شده است:

| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
هاست‌ها/SANهای ذکر شده در بالا، موارد توصیه شده برای ایجاد یک خوشه فعال هستند؛ در صورت نیاز به تنظیمات خاص، می‌توان SANهای اضافی را روی تمام گواهینامه‌های سرور اضافه کرد.
{{< /note >}}

{{< note >}}

فقط برای کاربران kubeadm:

* سناریویی که در آن شما گواهی‌های CA خوشه خود را بدون کلیدهای خصوصی رونوشت می‌گیرید، در مستندات kubeadm به عنوان CA خارجی شناخته می‌شود.

* اگر فهرست بالا را با PKI تولید شده توسط kubeadm مقایسه می‌کنید، لطفاً توجه داشته باشید که گواهی‌های `kube-etcd`، `kube-etcd-peer` و `kube-etcd-healthcheck-client` در صورت etcd خارجی تولید نمی‌شوند.

{{< /note >}}

### مسیرهای گواهینامه

گواهی‌ها باید در یک مسیر پیشنهادی قرار گیرند (مطابق با مسیری که [kubeadm](/docs/reference/setup-tools/kubeadm/) استفاده می‌کند). مسیرها باید با استفاده از آرگومان داده شده، صرف نظر از مکان، مشخص شوند.

| DefaultCN | recommendedkeypath | recommendedcertpath | command | keyargument | certargument |
| --------- | ------------------ | ------------------- | ------- | ----------- | ------------ |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

ملاحظات مشابهی برای جفت کلید service account اعمال می‌شود:

| private key path  | public key path  | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

مثال زیر مسیرهای فایل [از جداول قبلی](#certificate-paths) را نشان می‌دهد که در صورت تولید تمام کلیدها و گواهی‌های خودتان، باید ارائه دهید:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## پیکربندی گواهینامه‌ها برای حساب‌های کاربری

شما باید این حساب‌های کاربری مدیر و حساب‌های کاربری سرویس را به صورت دستی پیکربندی کنید:

| Filename                | Credential name            | Default CN                          | O (in Subject)         |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
مقدار `<nodeName>` برای `kubelet.conf` **باید** دقیقاً با مقدار نام گره ارائه شده توسط kubelet هنگام ثبت نام در apiserver مطابقت داشته باشد. برای جزئیات بیشتر، [مجوز گره](/docs/reference/access-authn-authz/node/) را مطالعه کنید.
{{< /note >}}

{{< note >}}
در مثال بالا، `<admin-group>` مختص پیاده‌سازی است. برخی ابزارها گواهی موجود در فایل پیش‌فرض `admin.conf` را امضا می‌کنند تا بخشی از گروه `system:masters` باشد. `system:masters` یک گروه کاربر ویژه (super user group) است که می‌تواند لایه مجوز کوبرنتیز مانند RBAC را دور بزند. همچنین برخی ابزارها یک `super-admin.conf` جداگانه با گواهی متصل به این گروه کاربر ویژه ایجاد نمی‌کنند.

kubeadm دو گواهی مدیر جداگانه در فایل‌های kubeconfig ایجاد می‌کند.
یکی در `admin.conf` است و دارای `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` است.
`kubeadm:cluster-admins` یک گروه سفارشی است که به ClusterRole `cluster-admin` متصل است.
این فایل در تمام ماشین‌های control plane مدیریت‌شده kubeadm ایجاد می‌شود.

یکی دیگر در `super-admin.conf` است که دارای `Subject: O = system:masters, CN = kubernetes-super-admin` است.
این فایل فقط در گره‌ای که `kubeadm init` در آن فراخوانی شده است، ایجاد می‌شود.
{{< /note >}}

1. برای هر پیکربندی، یک جفت گواهی/کلید x509 با نام مشترک (CN) و سازمان (O) داده شده ایجاد کنید.

1. برای هر پیکربندی، `kubectl` را به صورت زیر اجرا کنید:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

این فایل‌ها به صورت زیر استفاده می‌شوند:

| Filename                | Command                 | Comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| super-admin.conf        | kubectl                 | Configures super administrator user for the cluster                   |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |

فایل‌های زیر مسیرهای کامل فایل‌های فهرست‌شده در جدول قبلی را نشان می‌دهند:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
