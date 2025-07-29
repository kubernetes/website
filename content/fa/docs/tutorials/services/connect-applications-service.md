---
reviewers:
- xirehat
title: اتصال برنامه‌ها با سرویس‌ها
content_type: tutorial
weight: 20
---


<!-- overview -->

## مدل کوبرنتیز برای اتصال کانتینرها

حالا که یک برنامه مداوم و تکثیرشونده دارید، می‌توانید آن را روی یک شبکه در معرض دید قرار دهید.

کوبرنتیز فرض می‌کند پادها، فارغ از اینکه روی کدام میزبان قرار بگیرند، می‌توانند با یکدیگر ارتباط برقرار کنند.
کوبرنتیز به هر پاد یک نشانی IP اختصاصی درونِ خوشه می‌دهد؛ بنابراین نیازی نیست صراحتاً
بین پادها پیوند ایجاد کنید یا پورت‌های کانتینر را به پورت‌های میزبان نگاشت کنید. این یعنی کانتینرهای
درون یک پاد می‌توانند از طریق `localhost` به پورت‌های یکدیگر دسترسی داشته باشند و همه پادهای
خوشه بدون نیاز به NAT یکدیگر را ببینند. ادامه این سند توضیح می‌دهد چگونه می‌توانید سرویس‌های
قابل‌اعتماد را روی چنین مدل شبکه‌ای اجرا کنید.

این راهنما از یک وب‌سرور ساده **nginx** برای نمایش این مفهوم بهره می‌برد.

<!-- body -->

## در معرض قرار دادن پادها برای خوشه

این کار را در مثال قبلی انجام دادیم، اما بیایید دوباره آن را انجام دهیم و بر دیدگاه شبکه‌ای تمرکز کنیم.
یک پاد **nginx** ایجاد کنید و توجه کنید که یک مشخصه پورت کانتینر دارد:

{{% code_sample file="service/networking/run-my-nginx.yaml" %}}

این باعث می‌شود پاد از هر نودی در خوشه شما قابل‌دسترس باشد. نودهایی که پاد روی آن‌ها در حال اجراست را بررسی کنید:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

آی‌پی‌های پادهای خود را بررسی کنید:

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

شما باید بتوانید به هر نود در خوشه خود از طریق SSH متصل شوید و با ابزاری مثل `curl`
از هر دو نشانی IP درخواست بفرستید. توجه کنید که کانتینرها *پورت ۸۰* روی نود را استفاده نمی‌کنند
و هیچ قانون NAT‌ ویژه‌ای برای مسیریابی ترافیک به پاد وجود ندارد. این یعنی می‌توانید
چندین پاد nginx را روی یک نود به‌طور هم‌زمان و با همان `containerPort` اجرا کنید،
و از هر پاد یا نود دیگری در خوشه با استفاده از نشانی IP اختصاصی پاد به آن‌ها دسترسی
پیدا کنید. اگر بخواهید پورت مشخصی روی نود میزبان را به پادهای پشتیبان فوروارد کنید،
امکانش هست ــ اما مدل شبکه‌ای باید طوری باشد که معمولاً به این کار نیازی نداشته باشید.

اگر کنجکاو هستید، می‌توانید درباره
[مدل شبکه‌ای کوبرنتیز](/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)
بیشتر بخوانید.

## ایجاد یک سرویس (Service)

حال پادهایی داریم که nginx را در یک فضاى آدرس تخت و سراسری خوشه اجرا می‌کنند. در تئوری
می‌توانید مستقیماً با این پادها ارتباط بگیرید، اما وقتی یک نود از کار بیفتد چه می‌شود؟
پادها همراه با آن می‌میرند و ReplicaSet‌ داخل Deployment پادهای جدیدی با IPهای متفاوت
می‌سازد. این همان مشکلی است که یک Service حل می‌کند.

یک سرویس کوبرنتیز انتزاعی است که یک مجموعه منطقی از پادهایی را تعریف می‌کند
که در جایی از خوشه شما اجرا می‌شوند و همگی عملکرد یکسانی ارائه می‌دهند. هنگام ایجاد،
به هر سرویس یک نشانی IP یکتا (که clusterIP هم نامیده می‌شود) تخصیص داده می‌شود.
این نشانی تا زمانی که سرویس زنده است تغییر نخواهد کرد. پادها می‌توانند طوری پیکربندی شوند
که با سرویس صحبت کنند و مطمئن باشند ارتباط با سرویس به‌طور خودکار میان پادهای عضو سرویس
بارگذاری متعادل (load-balanced) می‌شود.

می‌توانید برای دو رپلیکای nginx خود با دستور `kubectl expose` یک سرویس بسازید:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

این معادل اجرای `kubectl apply -f` روی YAML زیر است:

{{% code_sample file="service/networking/nginx-svc.yaml" %}}

این مشخصات سرویسی می‌سازد که پورت 80/TCP روی هر پادی با برچسب `run: my-nginx`
را هدف قرار می‌دهد و آن را روی یک پورت انتزاعی سرویس در معرض دید قرار می‌دهد
(`targetPort`: پورتی است که کانتینر درخواست‌ها را روی آن می‌پذیرد، `port`: پورت
انتزاعی سرویس است که می‌تواند هر پورتی باشد که پادهای دیگر برای دسترسی به سرویس
به کار ببرند).
برای مشاهده فهرست فیلدهای پشتیبانی‌شده در تعریف سرویس، به شیٔ API
[Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
مراجعه کنید.
سرویس خود را بررسی کنید:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

همان‌طور که پیش‌تر اشاره شد، یک **Service** توسط مجموعه‌ای از *Pod*ها پشتیبانی می‌شود.  
این پادها از طریق {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}} در معرض دید قرار می‌گیرند.  
**selector** سرویس به‌طور پیوسته ارزیابی می‌شود و نتایج به یک EndpointSlice که با استفاده از {{< glossary_tooltip text="labels" term_id="label" >}} به سرویس متصل است، ‌POST می‌شود.  

وقتی یک پاد از بین برود، به‌طور خودکار از EndpointSliceهایی که آن را به‌عنوان *endpoint* دارند حذف می‌شود.  
پادهای جدیدی که با selector سرویس مطابقت داشته باشند، به‌طور خودکار به یک EndpointSlice مربوط به آن سرویس افزوده می‌شوند.  

اندپوینت‌ها را بررسی کنید و دقت کنید که IPها همان‌هایی هستند که در پادهای ایجادشده در گام نخست مشاهده کردید:

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get endpointslices -l kubernetes.io/service-name=my-nginx
```
```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

اکنون باید بتوانید از هر نود در خوشه خود فرمان `curl` را برای سرویس nginx روی
`<CLUSTER-IP>:<PORT>` اجرا کنید. توجه داشته باشید که IP سرویس کاملاً مجازی است و هرگز
بر روی سیم منتقل نمی‌شود. اگر کنجکاو هستید که این موضوع چگونه کار می‌کند،
می‌توانید درباره [پروکسی سرویس](/docs/reference/networking/virtual-ips/) بیشتر بخوانید.

## دسترسی به سرویس

کوبرنتیز دو روش اصلی برای یافتن یک سرویس پشتیبانی می‌کند: متغیرهای محیطی
و DNS. روش نخست به‌صورت پیش‌فرض فعال است، در حالی که دومی به افزونه
[CoreDNS cluster addon](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)
نیاز دارد.

{{< note >}}
اگر متغیرهای محیطی سرویس مطلوب نیستند (به دلیل احتمال تداخل با متغیرهای مورد انتظار
برنامه، تعداد زیاد متغیرها برای پردازش، استفاده صرف از DNS و غیره) می‌توانید این قابلیت
را با قرار دادن فلگ `enableServiceLinks` روی مقدار `false` در
[مشخصات پاد](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core)
غیرفعال کنید.
{{< /note >}}

### متغیرهای محیطی

وقتی یک پاد روی یک نود اجرا می‌شود، kubelet برای هر سرویس فعال مجموعه‌ای از
متغیرهای محیطی اضافه می‌کند. این کار باعث بروز مشکل ترتیب (ordering) می‌شود.
برای درک دلیل آن، محیط متغیرهای پادهای nginx در حال اجرا را بررسی کنید
(نام پاد شما متفاوت خواهد بود):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

توجه کنید که هیچ اشاره‌ای به سرویس شما نشده است. این به این دلیل است که رپلیکاها را پیش از سرویس ایجاد کرده‌اید.  
عیب دیگر این کار این است که زمان‌بند ممکن است هر دو پاد را روی یک ماشین قرار دهد؛ در نتیجه اگر آن ماشین از کار بیفتد، کل سرویس از دسترس خارج می‌شود.  
می‌توانیم این کار را به‌شیوه درست انجام دهیم: دو پاد را حذف کنیم و منتظر بمانیم تا Deployment آن‌ها را دوباره بسازد.  
این بار سرویس *پیش از* رپلیکاها وجود خواهد داشت.  
به این ترتیب، زمان‌بند پادهای شما را در سطح سرویس به‌طور پراکنده توزیع می‌کند (به‌شرط آنکه همه نودها ظرفیت برابر داشته باشند) و همچنین متغیرهای محیطی درست را فراهم می‌آورد:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

ممکن است متوجه شده باشید که غلاف‌ها نام‌های مختلفی دارند، زیرا کشته و دوباره ساخته می‌شوند.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

کوبرنتیز یک سرویس افزونه خوشه DNS ارائه می‌دهد که به طور خودکار نام‌های DNS را به سایر سرویس‌ها اختصاص می‌دهد. می‌توانید بررسی کنید که آیا این سرویس روی خوشه شما اجرا می‌شود یا خیر:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

باقیِ این بخش فرض می‌کند که یک سرویس با یک IP طولانی‌عمر (`my-nginx`) در اختیار دارید و یک سرور DNS نامی را به آن IP اختصاص داده است.  
در اینجا از افزونه خوشه **CoreDNS** (نام برنامه `kube-dns`) استفاده می‌کنیم؛ بنابراین می‌توانید از هر پادی در خوشه با روش‌های استاندارد (مثلاً `gethostbyname()`) با سرویس صحبت کنید.  
اگر CoreDNS در حال اجرا نیست، می‌توانید با مراجعه به [README ‏CoreDNS](https://github.com/coredns/deployment/tree/master/kubernetes) یا بخش
[Installing CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns) آن را فعال کنید.  

بیایید برای آزمایش، یک برنامه curl دیگر اجرا کنیم:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

سپس، اینتر را بزنید و دستور `nslookup my-nginx` را اجرا کنید:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## ایمن‌سازی سرویس

تا اینجا فقط از داخل خوشه به سرور nginx دسترسی داشته‌ایم. قبل از آنکه سرویس را به اینترنت در معرض دید قرار دهید، باید مطمئن شوید کانال ارتباطی امن است. برای این کار به موارد زیر نیاز دارید:

* گواهی‌های خودامضا برای HTTPS (مگر اینکه قبلاً یک گواهی هویت معتبر داشته باشید)
* یک سرور nginx که برای استفاده از این گواهی‌ها پیکربندی شده باشد
* یک [Secret](/docs/concepts/configuration/secret/) که گواهی‌ها را در اختیار پادها قرار دهد

می‌توانید همه این موارد را از
[نمونه nginx با HTTPS](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/)
تهیه کنید. این کار نیازمند نصب ابزارهای **go** و **make** است. اگر تمایلی به نصب آن‌ها ندارید،
می‌توانید مراحل دستی را که بعداً می‌آید دنبال کنید. به طور خلاصه:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```
و همچنین configmap:
```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

می‌توانید نمونه‌ای از فایل `default.conf` را در
[مخزن پروژه نمونه‌های Kubernetes](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/)
پیدا کنید.

```
configmap/nginxconfigmap created
```
```shell
kubectl get configmaps
```
```
NAME             DATA   AGE
nginxconfigmap   1      114s
```

شما می‌توانید جزئیات ConfigMap مربوط به `nginxconfigmap` را با استفاده از دستور زیر مشاهده کنید:

```shell
kubectl describe configmap  nginxconfigmap
```

خروجی مشابه زیر است:

```console
Name:         nginxconfigmap
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
default.conf:
----
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        listen 443 ssl;

        root /usr/share/nginx/html;
        index index.html;

        server_name localhost;
        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        location / {
                try_files $uri $uri/ =404;
        }
}

BinaryData
====

Events:  <none>
```

در صورت بروز مشکل در اجرای make (مثلاً در ویندوز)، مراحل دستی زیر را دنبال کنید:

```shell
# ایجاد یک جفت کلید عمومی-خصوصی
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# تبدیل کلیدها به کدگذاری base64
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
 
از خروجی دستورات قبلی برای ایجاد یک فایل yaml به صورت زیر استفاده کنید.
مقدار کدگذاری شده base64 باید همگی در یک خط باشند.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
  tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
حالا با استفاده از فایل، رمزها را ایجاد کنید:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

اکنون رپلیکای‌های nginx خود را طوری تغییر دهید که با استفاده از گواهی موجود در Secret
یک سرور HTTPS راه‌اندازی کنند و سرویس نیز هر دو پورت (80 و 443) را در معرض دید قرار دهد:

{{% code_sample file="service/networking/nginx-secure-app.yaml" %}}

نکات قابل توجه درباره مانیفست **nginx-secure-app**:

- هم مشخصات Deployment و هم Service در یک فایل قرار دارند.
- [سرور nginx](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)
  ترافیک HTTP را روی پورت 80 و ترافیک HTTPS را روی 443 سرو می‌کند و سرویس nginx
  هر دو پورت را اکسپوز می‌کند.
- هر کانتینر از طریق یک volume که در مسیر `/etc/nginx/ssl` مونت شده به کلیدها دسترسی دارد.
  این volume *پیش از* راه‌اندازی سرور nginx تنظیم می‌شود.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

در این مرحله می‌توانید از هر گره‌ای به سرور nginx دسترسی پیدا کنید.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

توجه کنید که در گام پیشین به فرمان `curl` گزینه `-k` را افزودیم؛
علت این است که هنگام ایجاد گواهی، هیچ اطلاعی از پادهای در حال اجرای nginx نداریم،
بنابراین باید به curl بگوییم ناسازگاری CName را نادیده بگیرد.
با ساختن یک Service، CName‌ موجود در گواهی را به نام DNS واقعی‌ای که پادها هنگام جستجوی سرویس استفاده می‌کنند، پیوند دادیم.
حالا بیایید این را از درون یک پاد آزمایش کنیم
(برای سادگی همان Secret دوباره استفاده می‌شود؛ پاد فقط به فایل `nginx.crt` برای دسترسی به سرویس نیاز دارد):

{{% code_sample file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## در معرض قرار دادن سرویس

برای برخی قسمت‌های برنامه‌تان ممکن است بخواهید یک سرویس را روی یک نشانی IP خارجی قرار دهید.  
کوبرنتیز دو شیوه برای این کار پشتیبانی می‌کند: **NodePort** و **LoadBalancer**.  
سرویسی که در بخش پیشین ساختید از قبل از نوع `NodePort` بود؛ بنابراین اگر نود شما یک IP عمومی داشته باشد، رپلیکای HTTPS nginx آماده است تا ترافیک اینترنتی را پاسخ دهد.

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

حالا بیایید سرویس را دوباره بسازیم تا از یک لود بالانسر ابری استفاده کند.  
نوع سرویس `my-nginx` را از `NodePort` به `LoadBalancer` تغییر دهید:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149     xx.xxx.xxx.xxx     8080:30163/TCP        21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

آدرس IP موجود در ستون `EXTERNAL-IP` همان آدرسی است که در اینترنت عمومی در دسترس قرار می‌گیرد.  
`CLUSTER-IP` تنها در داخل خوشه یا شبکه ابری خصوصی شما قابل استفاده است.

توجه کنید که در AWS، نوع `LoadBalancer` یک ELB ایجاد می‌کند که به‌جای IP از یک hostname (طولانی) استفاده می‌کند. این hostname آن‌قدر بلند است که در خروجی استاندارد `kubectl get svc` جا نمی‌شود؛ بنابراین باید از دستور `kubectl describe service my-nginx` استفاده کنید تا آن را ببینید. خروجی چیزی شبیه به این خواهد بود:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


* درباره [استفاده از یک Service برای دسترسی به یک برنامه در خوشه](/docs/tasks/access-application-cluster/service-access-application-cluster/) بیشتر بخوانید
* درباره [اتصال یک فرانت‌اند به یک بک‌اند با استفاده از Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/) بیشتر بخوانید
* درباره [ایجاد یک لود بالانسر خارجی](/docs/tasks/access-application-cluster/create-external-load-balancer/) بیشتر بخوانید
