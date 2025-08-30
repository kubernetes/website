---
title: اجرای kubelet در حالت مستقل
content_type: tutorial
weight: 10
---

<!-- overview -->

این آموزش به شما نشان می‌دهد که چگونه یک نمونه مستقل از kubelet را اجرا کنید

شما ممکن است انگیزه‌های مختلفی برای اجرای یک kubelet مستقل داشته باشید
این آموزش با هدف آشنایی شما با کوبرنتیز تهیه شده است، حتی اگر تجربه زیادی با آن نداشته باشید. می‌توانید این آموزش را دنبال کنید و در مورد راه‌اندازی گره، پادهای پایه (استاتیک) و نحوه مدیریت کانتینرها توسط کوبرنتیزاطلاعات کسب کنید

پس از دنبال کردن این آموزش، می‌توانید از خوشه ای که دارای {{< glossary_tooltip text="control plane" term_id="control-plane" >}} برای مدیریت پادها و گره‌ها و انواع دیگر اشیاء است، استفاده کنید. به عنوان مثال،
[Hello, minikube](/docs/tutorials/hello-minikube/)

همچنین می‌توانید kubelet را در حالت مستقل اجرا کنید تا برای موارد استفاده در محیط عملیاتی مناسب باشد، مانند اجرای control plane برای یک خوشه (cluster) با قابلیت دسترسی بالا و استقرار انعطاف‌پذیر. این آموزش جزئیات مورد نیاز برای اجرای یک control plane انعطاف‌پذیر را پوشش نمی‌دهد
## {{% heading "objectives" %}}

* `cri-o` و `kubelet` را روی یک سیستم لینوکس نصب کنید و آنها را به عنوان سرویس‌های `systemd` اجرا کنید.
* یک پاد (Pod) با اجرای `nginx` راه‌اندازی کنید که به درخواست‌های روی پورت TCP 80 روی نشانی IP پاد گوش دهد.
* یاد بگیرید که چگونه اجزای مختلف راه‌حل با یکدیگر تعامل دارند.

{{< caution >}}
پیکربندی kubelet که برای این آموزش استفاده شده است، از نظر طراحی ناامن است و نباید در محیط عملیاتی استفاده شود
{{< /caution >}}

## {{% heading "prerequisites" %}}

* دسترسی ادمین (`root`) به یک سیستم لینوکس که از `systemd` و `iptables` (یا nftables با شبیه‌سازی `iptables`) استفاده می‌کند
* دسترسی به اینترنت برای دانلود اجزای مورد نیاز برای آموزش، مانند:
دسترسی به اینترنت برای دانلود اجزای مورد نیاز برای آموزش، مانند:
   * یک {{< glossary_tooltip text="مجری کانتینر" term_id="container-runtime" >}}که کوبرنتیز {{< glossary_tooltip term_id="cri" text="(CRI)">}} را پیاده‌سازی می‌کند
  * Network plugins (these are often known as
    {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
  * Required CLI tools: `curl`, `tar`, `jq`.

<!-- lessoncontent -->

## سیستم را آماده کنید

### پیکربندی Swap

به طور پیش‌فرض، اگر حافظه swap روی یک گره شناسایی شود، kubelet شروع به کار نمی‌کند. این بدان معناست که swap باید غیرفعال شود یا توسط kubelet تحمل شود.

{{< note >}}
اگر kubelet را طوری پیکربندی کنید که swap را تحمل کند، kubelet همچنان Podها (و کانتینرهای موجود در آن Podها) را طوری پیکربندی می‌کند که از فضای swap استفاده نکنند. برای اینکه بفهمید Podها چگونه می‌توانند از swap موجود استفاده کنند، می‌توانید درباره [مدیریت حافظه swap](/docs/concepts/architecture/nodes/#swap-memory) در گره‌های لینوکس بیشتر بخوانید
{{< /note >}}

اگر حافظه swap را فعال کرده‌اید، آن را غیرفعال کنید یا عبارت `failSwapOn: false` را به پرونده پیکربندی kubelet اضافه کنید
برای بررسی فعال بودن swap:

```shell
sudo swapon --show
```

اگر هیچ خروجی از دستور وجود نداشته باشد، حافظه swap از قبل غیرفعال شده است

برای غیرفعال کردن موقت swap:

```shell
sudo swapoff -a
```

برای اینکه این تغییر در طول راه‌اندازی‌های مجدد پایدار بماند:

مطمئن شوید که swap بسته به نحوه پیکربندی آن در سیستم شما، در `/etc/fstab` یا `systemd.swap` غیرفعال باشد

### فعال کردن ارسال بسته IPv4

برای بررسی اینکه آیا ارسال بسته IPv4 فعال است:

```shell
cat /proc/sys/net/ipv4/ip_forward
```

اگر خروجی «۱» باشد، از قبل فعال شده است. اگر خروجی «۰» باشد، مراحل بعدی را دنبال کنید

برای فعال کردن ارسال بسته IPv4، یک پرونده پیکربندی ایجاد کنید که پارامتر net.ipv4.ip_forward را روی `1` تنظیم کند:

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```

اعمال تغییرات در سیستم:

```shell
sudo sysctl --system
```

خروجی مشابه این است:

```
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

## دانلود، نصب و پیکربندی مولفه ها

{{% thirdparty-content %}}

### یک مجری کانتینر اجرا نصب کنید {#container-runtime}

آخرین نسخه‌های موجود از بسته‌های مورد نیاز را دانلود کنید (توصیه می‌شود).

این آموزش نصب [CRI-O container runtime](https://github.com/cri-o/cri-o) (لینک خارجی) را پیشنهاد می‌کند

بسته به توزیع لینوکس خاص شما، چندین [روش] برای نصب [https://github.com/cri o/cri o/blob/main/install.md] کانتینر CRI O در زمان اجرا وجود دارد. اگرچه CRI O استفاده از بسته‌های `deb` یا `rpm` را توصیه می‌کند، اما این آموزش از اسکریپت `_static binary bundle_` پروژه `CRI O Packaging` (https://github.com/crio/packaging/blob/main/README.md) استفاده می‌کند، که هم برای ساده‌سازی فرآیند کلی و هم برای عدم وابستگی به توزیع مورد نظر است


این اسکریپت نرم‌افزارهای مورد نیاز اضافی، مانند [`cni-plugins`](https://github.com/containernetworking/cni) برای شبکه‌سازی کانتینر، و [`crun`](https://github.com/containers/crun) و [`runc`](https://github.com/opencontainers/runc) برای اجرای کانتینرها را نصب و پیکربندی می‌کند

این اسکریپت به طور خودکار معماری پردازنده سیستم شما (`amd64` یا `arm64`) را تشخیص داده و آخرین نسخه‌های بسته‌های نرم‌افزاری را انتخاب و نصب می‌کند

### CRI-O  تنظیم {#cri-o-setup}

از صفحه [نسخه‌ها](https://github.com/cri-o/cri-o/releases) (پیوند خارجی) دیدن کنید

اسکریپت بسته دودویی استاتیک را دانلود کنید:

```shell
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

اسکریپت نصب را اجرا کنید:

```shell
sudo bash crio-install
```

فعال کردن و شروع سرویس `crio`:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

تست سریع:

```shell
sudo systemctl is-active crio.service
```

خروجی مشابه این است:

```
active
```

بررسی دقیق سرویس:

```shell
sudo journalctl -f -u crio.service
```

### نصب افزونه های شبکه

نصب‌کننده‌ی `cri-o` بسته‌ی `cni-plugins` را نصب و پیکربندی می‌کند. می‌توانید با اجرای دستور زیر، نصب را تأیید کنید:

```shell
/opt/cni/bin/bridge --version
```

خروجی مشابه این است:

```
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

برای بررسی پیکربندی پیش‌فرض: 

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

خروجی مشابه این است:

```json
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```

{{< note >}}
مطمئن شوید که محدوده پیش‌فرض «زیرشبکه» (۱۰.۸۵.۰.۰/۱۶) با هیچ یک از شبکه‌های فعال شما همپوشانی ندارد. در صورت وجود همپوشانی، می‌توانید پرونده را ویرایش کرده و آن را مطابق با آن تغییر دهید. پس از تغییر، سرویس را مجدداً راه‌اندازی کنید{{< /note >}}

### دانلود و نصب kubelet

آخرین نسخه پایدار [آخرین نسخه](/releases/download/) از kubelet را دریافت کنید

{{< tabs name="download_kubelet" >}}
{{< tab name="x86-64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubelet"
{{< /tab >}}
{{< tab name="ARM64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubelet"
{{< /tab >}}
{{< /tabs >}}

پیکربندی:

```shell
sudo mkdir -p /etc/kubernetes/manifests
```

```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # Do NOT use in production clusters!
authorization:
  mode: AlwaysAllow # Do NOT use in production clusters!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # Do NOT use in production clusters!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

{{< note >}}
از آنجا که شما در حال راه‌اندازی یک خوشه (cluster) عملیاتی نیستید، از HTTP ساده (`readOnlyPort: 10255`) برای کوئری‌های احراز هویت نشده به API kubelet استفاده می‌کنید

برای اهداف این آموزش، وب‌هوک احراز هویت غیرفعال است و حالت مجوز روی «همیشه مجاز» تنظیم شده است. می‌توانید برای پیکربندی صحیح kubelet در حالت مستقل در محیط خود، اطلاعات بیشتری در مورد [حالت‌های مجوز](/docs/reference/access-authn-authz/authorization/#authorization-modules) و [احراز هویت وب‌هوک](/docs/reference/access-authn-authz/webhook/) کسب کنید.

برای آشنایی با پورت‌هایی که اجزای کوبرنتیز از آنها استفاده می‌کنند، به [درگاه ها و پروتکل ها](/docs/reference/networking/ports-and-protocols/) مراجعه کنید.
{{< /note >}}

نصب:

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

یک پرونده واحد سرویس `systemd` ایجاد کنید:

```shell
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

پارامتر خط فرمان `--kubeconfig` عمداً در پرونده پیکربندی سرویس حذف شده است. این پارامتر مسیر پرونده `[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)` را تعیین می‌کند که نحوه اتصال به سرور API را مشخص می‌کند و حالت سرور API را فعال می‌کند. حذف آن، حالت مستقل را فعال می‌کند.

سرویس `kubelet` را فعال و شروع کنید:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

آزمایش سریع:

```shell
sudo systemctl is-active kubelet.service
```

خروجی مشابه زیر است:

```
active
```

بررسی دقیق سرویس:

```shell
sudo journalctl -u kubelet.service
```

نقطه پایانی API `/healthz` مربوط به kubelet را بررسی کنید:

```shell
curl http://localhost:10255/healthz?verbose
```

خروجی مشابه زیر است:

```
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

از نقطه پایانی API `/pods` مربوط به kubelet کوئری بگیرید:

```shell
curl http://localhost:10255/pods | jq '.'
```

خروجی مشابه زیر است:

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

## یک پاد را در kubelet اجرا کنید


در حالت مستقل، می‌توانید پادها را با استفاده از تنظیمات پاد اجرا کنید. تنظیمات می‌توانند یا در سیستم پرونده محلی باشند یا از طریق HTTP از یک منبع پیکربندی دریافت شوند.

ایجاد یک تنظیمات برای یک Pod:


```shell
cat <<EOF > static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

پرونده تنظیمات `static-web.yaml` را در پوشه `/etc/kubernetes/manifests` رونوشت کنید.

```shell
sudo cp static-web.yaml /etc/kubernetes/manifests/
```

### اطلاعاتی در مورد کوبلت و پاد پیدا کنید {#find-out-information}


افزونه شبکه Pod یک پل شبکه (`cni0`) و یک جفت رابط `veth` برای هر Pod ایجاد می‌کند (یکی از این جفت‌ها درون Pod تازه ساخته شده و دیگری در سطح میزبان است).

نقطه پایانی API مربوط به kubelet را در نشانی `http://localhost:10255/pods` جستجو کنید:

```shell
curl http://localhost:10255/pods | jq '.'
```

برای به دست آوردن نشانی IP مربوط به پاد `static-web`:

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

خروجی مشابه زیر است:

```
"10.85.0.4"
```

به پاد سرور `nginx` روی `http://<IP>:<Port>` (پورت پیش‌فرض ۸۰ است) متصل شوید، در این مورد:

```shell
curl http://10.85.0.4
```

خروجی مشابه زیر است:

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

## جزئیات بیشتر را کجا جستجو کنیم


اگر نیاز به تشخیص مشکلی در اجرای این آموزش دارید، می‌توانید برای نظارت و عیب‌یابی به پوشه‌های زیر مراجعه کنید:

```
/var/lib/cni
/var/lib/containers
/var/lib/kubelet

/var/log/containers
/var/log/pods
```

## پاک کردن

### kubelet

```shell
sudo systemctl disable --now kubelet.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/kubelet.service
sudo rm /usr/bin/kubelet
sudo rm -rf /etc/kubernetes
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/log/containers
sudo rm -rf /var/log/pods
```

### مجری کانتینر

```shell
sudo systemctl disable --now crio.service
sudo systemctl daemon-reload
sudo rm -rf /usr/local/bin
sudo rm -rf /usr/local/lib
sudo rm -rf /usr/local/share
sudo rm -rf /usr/libexec/crio
sudo rm -rf /etc/crio
sudo rm -rf /etc/containers
```

### افزونه های شبکه

```shell
sudo rm -rf /opt/cni
sudo rm -rf /etc/cni
sudo rm -rf /var/lib/cni
```

## نتیجه‌گیری

این صفحه جنبه‌های اساسی استقرار یک kubelet در حالت مستقل را پوشش داد. اکنون آماده استقرار پادها و آزمایش قابلیت‌های اضافی هستید.

توجه داشته باشید که در حالت مستقل، kubelet از دریافت پیکربندی‌های پاد از control plane پشتیبانی نمی‌کند (زیرا هیچ اتصالی به control plane وجود ندارد).

همچنین نمی‌توانید از {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} یا {{< glossary_tooltip text="Secret" term_id="secret" >}} برای پیکربندی کانتینرها در یک پاد استاتیک استفاده کنید.

## {{% heading "whatsnext" %}}

* برای یادگیری نحوه‌ی اجرای کوبرنتیز با یک control plane، [Hello, minikube](/docs/tutorials/hello-minikube/) را دنبال کنید. ابزار minikube به شما کمک می‌کند تا یک خوشه ی تمرینی روی رایانه‌ی خود راه‌اندازی کنید.
* درباره [افزونه‌های شبکه](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) بیشتر بدانید
* درباره [مجری های کانتینر](/docs/setup/production-environment/container-runtimes/) بیشتر بدانید
* درباره [kubelet](/docs/reference/command-line-tools-reference/kubelet/) بیشتر بدانید
* درباره [پاد های استاتیک](/docs/tasks/configure-pod-container/static-pod/) بیشتر بدانید
