---
title: استفاده از IP منبع
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---

<!-- overview -->

برنامه‌هایی که در یک خوشه کوبرنتیز اجرا می‌شوند از طریق انتزاع **Service** یکدیگر و همچنین دنیای بیرون را پیدا کرده و با هم ارتباط برقرار می‌کنند.  
این سند توضیح می‌دهد چه بلایی سر IP مبدأ بسته‌هایی که به انواع مختلف سرویس‌ها فرستاده می‌شوند می‌آید و چگونه می‌توانید این رفتار را بر اساس نیازهای خود تغییر دهید.



## {{% heading "prerequisites" %}}


### واژه‌نامه

این سند از اصطلاحات زیر استفاده می‌کند:

{{< comment >}}
اگر این بخش را بومی‌سازی می‌کنید، به صفحات ویکی‌پدیای معادل در زبان مقصد پیوند دهید.
{{< /comment >}}

[NAT](https://en.wikipedia.org/wiki/Network_address_translation)  
: **Network Address Translation** ـ ترجمه نشانی شبکه

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)  
: جایگزینی IP مبدأ در یک بسته؛ در این صفحه معمولاً به معنی جایگزینی با نشانی IP یک نود است.

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)  
: جایگزینی IP مقصد در یک بسته؛ در این صفحه معمولاً به معنی جایگزینی با نشانی IP یک {{< glossary_tooltip term_id="pod" >}} است.

[VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)  
: یک نشانی IP مجازی؛ برای مثال نشانی‌ای که به هر {{< glossary_tooltip text="Service" term_id="service" >}} در کوبرنتیز اختصاص داده می‌شود.

[kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)  
: یک دیمن شبکه‌ای که مدیریت VIP سرویس‌ها را روی هر نود هماهنگ می‌کند.

### پیش‌نیازها

{{< include "task-tutorial-prereqs.md" >}}

در مثال‌ها از یک وب‌سرور کوچک **nginx** استفاده می‌شود که IP مبدأ درخواست‌های دریافتی را در یک هدر HTTP بازتاب (echo) می‌کند. می‌توانید آن را به شکل زیر ایجاد کنید:

{{< note >}}
ایمیج مورد استفاده در فرمان زیر فقط روی معماری‌های *AMD64* اجرا می‌شود.
{{< /note >}}


```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.10
```
خروجی این است:
```
deployment.apps/source-ip-app created
```


## {{% heading "objectives" %}}


* یک برنامه ساده را از طریق انواع مختلف سرویس‌ها در معرض دید قرار دهید  
* درک کنید که هر نوع سرویس چگونه NAT نشانی IP مبدأ را مدیریت می‌کند  
* معامله‌های مربوط به حفظ نشانی IP مبدأ را درک کنید  



<!-- lessoncontent -->

## نشانی IP مبدأ برای سرویس‌های با `Type=ClusterIP`

اگر kube-proxy را در
[حالت iptables](/docs/reference/networking/virtual-ips/#proxy-mode-iptables)
(حالت پیش‌فرض) اجرا کنید، بسته‌هایی که از داخل خوشه به یک ClusterIP فرستاده می‌شوند هرگز دچار NAT مبدأ نمی‌شوند.  
می‌توانید حالت kube-proxy را با واکشی `http://localhost:10249/proxyMode` روی نودی که kube-proxy در آن اجرا می‌شود، بررسی کنید.

```console
kubectl get nodes
```
خروجی مشابه این است:
```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

حالت پروکسی را روی یکی از گره‌ها فعال کنید (kube-proxy روی پورت 10249 فعال است):
```shell
# Run this in a shell on the node you want to query.
curl http://localhost:10249/proxyMode
```
خروجی این است:
```
iptables
```

شما می‌توانید با ایجاد یک سرویس روی برنامه‌ی IP منبع، حفظ IP منبع را آزمایش کنید:

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```
خروجی این است:
```
service/clusterip exposed
```
```shell
kubectl get svc clusterip
```
خروجی مشابه این است:
```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

و ضربه زدن به `ClusterIP` از یک پاد در همان خوشه:

```shell
kubectl run busybox -it --image=busybox:1.28 --restart=Never --rm
```
خروجی مشابه این است:
```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```
سپس می‌توانید دستوری را درون آن پاد اجرا کنید:

```shell
# این دستور را در ترمینال با استفاده از دستور "kubectl run" اجرا کنید.
ip addr
```
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever
```

... سپس از `wget` برای پرس و جو از وب سرور محلی استفاده کنید
```shell
# به جای "10.0.170.92" آدرس IPv4 سرویس با نام "clusterip" را قرار دهید.
wget -qO - 10.0.170.92
```
```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```
نشانی `client_address` همیشه نشانی IP پاد کلاینت است، چه پاد کلاینت و پاد سرور روی یک نود باشند و چه روی نودهای متفاوت.

## نشانی IP مبدأ برای سرویس‌های با `Type=NodePort`

بسته‌هایی که به سرویس‌هایی با
[`Type=NodePort`](/docs/concepts/services-networking/service/#type-nodeport)
ارسال می‌شوند به‌صورت پیش‌فرض دچار NAT مبدأ می‌شوند. می‌توانید این موضوع را با ایجاد یک سرویس `NodePort` آزمایش کنید:

```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```
خروجی این است:
```
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

اگر خوشه خود را روی یک ارائه‌دهنده ابری اجرا می‌کنید، ممکن است لازم باشد قانون فایروالی برای
`nodes:nodeport` ذکرشده در بالا باز کنید.
اکنون می‌توانید از بیرون خوشه و از طریق همان پورت نودی که در بالا تخصیص داده شد،
به سرویس دسترسی پیدا کنید.

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```
خروجی مشابه زیر است:
```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

توجه داشته باشید که این‌ها آدرس‌های IP صحیح کلاینت نیستند؛ این‌ها IPهای داخلی خوشه هستند. روند به این صورت است:

* کلاینت یک بسته به `node2:nodePort` می‌فرستد
* `node2` آدرس IP مبدأ را در بسته با آدرس IP خودش جایگزین می‌کند (SNAT)
* `node2` آدرس IP مقصد در بسته را با IP پاد جایگزین می‌کند
* بسته به نود ۱ و سپس به اندپوینت هدایت می‌شود
* پاسخ پاد به `node2` برگردانده می‌شود
* پاسخ پاد به کلاینت ارسال می‌شود

به‌صورت تصویری:

{{< figure src="/docs/images/tutor-service-nodePort-fig01.svg" alt="source IP nodeport figure 01" class="diagram-large" caption="Figure. Source IP Type=NodePort using SNAT" link="https://mermaid.live/edit#pako:eNqNkV9rwyAUxb-K3LysYEqS_WFYKAzat9GHdW9zDxKvi9RoMIZtlH732ZjSbE970cu5v3s86hFqJxEYfHjRNeT5ZcUtIbXRaMNN2hZ5vrYRqt52cSXV-4iMSuwkZiYtyX739EqWaahMQ-V1qPxDVLNOvkYrO6fj2dupWMR2iiT6foOKdEZoS5Q2hmVSStoH7w7IMqXUVOefWoaG3XVftHbGeZYVRbH6ZXJ47CeL2-qhxvt_ucTe1SUlpuMN6CX12XeGpLdJiaMMFFr0rdAyvvfxjHEIDbbIgcVSohKDCRy4PUV06KQIuJU6OA9MCdMjBTEEt_-2NbDgB7xAGy3i97VJPP0ABRmcqg" >}}


برای جلوگیری از این مشکل، کوبرنتیز قابلیتی برای
[حفظ IP مبدأ کلاینت](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
دارد. اگر مقدار `service.spec.externalTrafficPolicy` را روی `Local` قرار دهید،
`kube-proxy` فقط درخواست‌ها را به اندپوینت‌های محلی (روی همان نود) پروکسی می‌کند
و ترافیک را به نودهای دیگر فوروارد نمی‌کند. این روش، نشانی IP مبدأ اصلی را حفظ
می‌کند. اگر هیچ اندپوینت محلی وجود نداشته باشد، بسته‌هایی که به نود فرستاده
می‌شوند حذف می‌شوند؛ بنابراین می‌توانید در هر قانونِ پردازش بسته به درستی به IP
مبدأ اصلی اعتماد کنید، چون تنها بسته‌هایی به اندپوینت می‌رسند که این شرط را دارند.

فیلد `service.spec.externalTrafficPolicy` را به‌این‌شکل تنظیم کنید:

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```
خروجی این است:
```
service/nodeport patched
```

حالا، تست را دوباره اجرا کنید:

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```
خروجی مشابه زیر است:
```
client_address=198.51.100.79
```

توجه کنید که تنها یک پاسخ دریافت کردید ــ آن هم با IP **صحیح** کلاینت ــ از همان نودی که پادِ اندپوینت روی آن اجرا می‌شود.

این‌گونه رخ می‌دهد:

* کلاینت بسته‌ای به `node2:nodePort` می‌فرستد؛ این نود هیچ اندپوینتی ندارد.  
* بسته حذف می‌شود.  
* کلاینت بسته‌ای به `node1:nodePort` می‌فرستد؛ این نود *دارای* اندپوینت است.  
* `node1` بسته را با IP مبدأ صحیح به اندپوینت هدایت می‌کند.  

به‌صورت تصویری:

{{< figure src="/docs/images/tutor-service-nodePort-fig02.svg" alt="source IP nodeport figure 02" class="diagram-large" caption="Figure. Source IP Type=NodePort preserves client source IP address" link="" >}}

## نشانی IP مبدأ برای سرویس‌های با `Type=LoadBalancer`

بسته‌هایی که به سرویس‌های  
[`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)  
ارسال می‌شوند، به‌طور پیش‌فرض دچار **NAT مبدأ** می‌شوند؛ زیرا تمام نودهای قابل زمان‌بندیِ کوبرنتیز در وضعیت `Ready` شایسته دریافت ترافیک لودبالانسر هستند. بنابراین اگر بسته‌ای به نودی بدون اندپوینت برسد، سیستم آن را به نودی *دارای* اندپوینت پروکسی می‌کند و IP مبدأ بسته را با IP همان نود جایگزین می‌نماید (مطابق آنچه در بخش پیش توضیح داده شد).

می‌توانید این موضوع را با در معرض قرار دادن **source-ip-app** از طریق یک لود بالانسر آزمایش کنید:

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```
خروجی این است:
```
service/loadbalancer exposed
```

آدرس‌های IP سرویس را چاپ کنید:
```console
kubectl get svc loadbalancer
```
خروجی مشابه این است:
```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

در مرحله بعد، یک درخواست به آدرس IP خارجی این سرویس ارسال کنید:

```shell
curl 203.0.113.140
```
خروجی مشابه این است:
```
CLIENT VALUES:
client_address=10.240.0.5
...
```

با این حال، اگر خوشه را روی **Google Kubernetes Engine/GCE** اجرا می‌کنید، تنظیم همان فیلد
`service.spec.externalTrafficPolicy` بر روی مقدار `Local`
باعث می‌شود نودهایی که *اندپوینت سرویس ندارند* عمداً آزمایش‌های سلامت را ناموفق پشت سر بگذارند
و خود را از فهرست نودهای واجد شرایط برای دریافت ترافیک لودبالانسر حذف کنند.

به‌صورت تصویری:

![IP مبدأ با externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

می‌توانید این موضوع را با افزودن انوتیشن زیر آزمایش کنید:

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

شما باید فوراً فیلد `service.spec.healthCheckNodePort` که توسط کوبرنتیز اختصاص داده شده است را مشاهده کنید:

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```
خروجی مشابه این است:
```yaml
  healthCheckNodePort: 32122
```

فیلد `service.spec.healthCheckNodePort` به یک پورت در هر گره‌ای که بررسی سلامت را در `/healthz` انجام می‌دهد، اشاره می‌کند. می‌توانید این را آزمایش کنید:

```shell
kubectl get pod -o wide -l app=source-ip-app
```
خروجی مشابه این است:
```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

از `curl` برای دریافت نقطه پایانی `/healthz` در گره‌های مختلف استفاده کنید:
```shell
# این را به صورت محلی روی گره‌ای که انتخاب می‌کنید اجرا کنید
curl localhost:32122/healthz
```
```
1 Service Endpoints found
```

در یک گره متفاوت، ممکن است نتیجه متفاوتی بگیرید:
```shell
# این را به صورت محلی روی گره‌ای که انتخاب می‌کنید اجرا کنید
curl localhost:32122/healthz
```
```
No Service Endpoints Found
```

یک کنترلری که روی
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
اجرا می‌شود مسئول تخصیص لود بالانسر ابری است. همان کنترلر همچنین بررسی‌های
سلامت HTTP را که به این پورت/مسیر روی هر نود اشاره می‌کنند، ایجاد می‌کند.
حدود ۱۰ ثانیه صبر کنید تا دو نودی که اندپوینت ندارند در آزمون‌های سلامت
مردود شوند، سپس با استفاده از `curl` نشانی IPv4 لود بالانسر را پرس‌وجو کنید:

```shell
curl 203.0.113.140
```
خروجی مشابه این است:
```
CLIENT VALUES:
client_address=198.51.100.79
...
```

## پشتیبانی در پلتفرم‌های گوناگون

فقط برخی ارائه‌دهندگان ابری از حفظ IP مبدأ در سرویس‌هایی با
`Type=LoadBalancer` پشتیبانی می‌کنند.  
ارائه‌دهنده ابری‌ای که روی آن کار می‌کنید ممکن است درخواست ایجاد یک
لود بالانسر را به یکی از روش‌های زیر برآورده کند:

1. با یک پراکسی که اتصال کلاینت را خاتمه می‌دهد و یک اتصال جدید به
   نودها / اندپوینت‌های شما باز می‌کند. در چنین حالتی، IP مبدأ همیشه
   آدرس لود بالانسر ابری خواهد بود، نه آدرس کلاینت.

2. با یک *packet forwarder*، به‌طوری‌که درخواست‌های کلاینت که به VIP
   لود بالانسر فرستاده می‌شوند، با IP مبدأ کلاینت (و نه یک پراکسی
   واسط) به نود برسند.

لود بالانسرهای دسته اول باید از یک پروتکل توافق‌شده میان لود بالانسر و
بک‌اند برای انتقال IP واقعی کلاینت استفاده کنند؛ مانند هدرهای HTTP
[Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2) یا
[X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For)،
یا [proxy protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).
لود بالانسرهای دسته دوم می‌توانند از قابلیت توضیح‌داده‌شده در بخش پیش
بهره بگیرند؛ بدین صورت که یک *health check*‌ HTTP ایجاد می‌کنند که به
پورتی اشاره دارد که در فیلد
`service.spec.healthCheckNodePort`
سرویس ذخیره شده است.



## {{% heading "cleanup" %}}


سرویس‌ها را حذف کنید:

```shell
kubectl delete svc -l app=source-ip-app
```

Deployment، ReplicaSet و Pod را حذف کنید:

```shell
kubectl delete deployment source-ip-app
```



## {{% heading "whatsnext" %}}

* درباره [اتصال برنامه‌ها از طریق سرویس‌ها](/docs/tutorials/services/connect-applications-service/) بیشتر بیاموزید
* بخوانید چگونه [یک لود بالانسر خارجی بسازید](/docs/tasks/access-application-cluster/create-external-load-balancer/)
