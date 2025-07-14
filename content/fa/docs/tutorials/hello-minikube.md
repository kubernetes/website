---
title: سلام Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

این آموزش به شما نشان می‌دهد که چگونه یک اپلیکیشن نمونه  را با استفاده از Minikube روی Kubernetes اجرا کنید.در این آموزش، یک ایمیج Nginx  استفاده شده است  و برای بازگرداندن تمام درخواست‌ها (Echo) استفاده می‌کند.

## {{% heading "objectives" %}}

* راه اندازی یک اپلیکیشن به صورت نمونه 
* اجرای برنامه
* مشاهده خطا های ایجاد شده در برنامه

## {{% heading "prerequisites" %}}


این آموزش فرض می‌کند که شما قبلاً Minikube را راه‌اندازی کرده‌اید.
.به مرحله مراجعه کنید   برای دستورالعمل‌های نصب __Step 1__ in [minikube start](https://minikube.sigs.k8s.io/docs/start/) 
{{< note >}}
فقط دستورالعمل‌های مربوط به مرحله ۱ (نصب) را انجام دهید __Step 1, Installation__.فقط دستورالعمل‌های مربوط به مرحله ۱ (نصب) را انجام دهید
{{< /note >}}

همچنین نیاز می باشد تا را نصب کنید `kubectl`.
 [Install tools](/docs/tasks/tools/#kubectl) لینک پیوست شده را برای نصب مشاهده کنید .


<!-- lessoncontent -->

## راه اندازی خوشه minikube

```shell
minikube start
```

## بازکردن داشبورد

برای باز کردن داشبورد minikube  می توانید از دو روش زیر استقاده نمایید :

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
ترمینال جدید باز کیند و دستور زیرا اجرا کنید:
```shell
# ترمینال جدید را باز کنید و دستور زیر را اجرا کنید .
minikube dashboard
```

حالا به ترمینال قبلی بروید که دستور minikube start  را اجرا کرده بودید. `minikube start`.

{{< note >}}
دستور `dashboard` افزونه‌ی داشبورد را فعال کرده و یک پراکسی (proxy) موقت را در مرورگر پیش‌فرض شما باز می‌کند. در این داشبورد می‌توانید منابع Kubernetes مانند `Deployment` و `Service` ایجاد کنید.

برای اینکه بدون باز شدن مستقیم مرورگر از طریق ترمینال، فقط آدرس URL داشبورد را دریافت کنید، به برگه‌ی «URL copy and paste» مراجعه کنید.

به‌صورت پیش‌فرض، داشبورد تنها از طریق شبکه داخلی مجازی Kubernetes قابل دسترسی است. دستور `dashboard` یک پراکسی موقتی ایجاد می‌کند تا داشبورد را از بیرون شبکه Kubernetes نیز قابل دسترس کند.

برای متوقف کردن پراکسی، کافیست کلیدهای `Ctrl+C` را بزنید تا از فرآیند خارج شوید. پس از خروج از دستور، داشبورد همچنان روی خوشه‌ی Kubernetes اجرا می‌ماند. شما می‌توانید مجدداً دستور `dashboard` را اجرا کنید تا یک پراکسی جدید برای دسترسی به داشبورد بسازید.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL copy and paste" %}}

اگر نمی‌خواهید Minikube به‌طور خودکار مرورگر را باز کند، دستور `dashboard` را با فلگ `--url` اجرا کنید

یک ترمینال **جدید** باز کنید و دستور زیر را اجرا کیند :
```shell
# ترمینال جدید بسازید و دستور زیرا اجرا نمایید 
minikube dashboard --url
```

حالا میتوانید به ترمینالی که دستور `minikube start` را زدید برگردید 
{{% /tab %}}
{{< /tabs >}}

## ساخت Deployment

[*Pod*](/docs/concepts/workloads/pods/)  در داخل کوبرنتیز ، به مجموعه ای از یک یا چند container  گویند ، یک پارچه شده اند برای اجرای دستوراتی از ادمین ها و نتورک به انها میرسد. POD  در این سناریو فقط یک عدد می باشد . deployment  های کوبرنتیز بررسی میکنند تا سلامت POD  برقرار است یا نه ، اگر نبود به صورت خودکار راه اندازی مجدد میکنند .
[*Deployment*](/docs/concepts/workloads/controllers/deployment/)  ها راه پیشنهادی کوبرنتیز می باشند برای مدیریت POD  ها.


1. از دستور `kubectl create`  استفاده کنید تا یک Deployment ایجاد کنید که مدیریت یک Pod را بر عهده دارد.

    ```shell
    # کانتینر webmaster  را جهت تست اجرا نمایید:
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. مشاهده deployment ها:

    ```shell
    kubectl get deployments
    ```

   نتیجه می بایست به شکل زیر باشد 

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (ممکن است مدتی طول بکشد تا Pod در دسترس قرار گیرد. اگر پیام "0/1" را مشاهده کردید، چند ثانیه بعد دوباره امتحان کنید.)

1. مشاهده پاد ها:

    ```shell
    kubectl get pods
    ```

   :نتیجه می بایست به شکل زیر باشد 

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. :مشاهده رخداد ها

    ```shell
    kubectl get events
    ```

1. مشاهده تنظیمات `kubectl` :

    ```shell
    kubectl config view
    ```

1. برای مشاهده‌ی لاگ‌های اپلیکیشن در یک کانتینر داخل یک Pod، از دستور زیر استفاده کنید (نام Pod را با نامی که از دستور `kubectl get pods` به دست آورده‌اید جایگزین کنید).
   
   {{< note >}}
   Replace `hello-node-5f76cf6ccf-br9b5` in the `kubectl logs` command with the name of the pod from the `kubectl get pods` command output.
  ارگومان `hello-node-5f76cf6ccf-br9b5` در مقابل دستور `kubectl logs` قرار دهید اسم POD  `kubectl get pods` برداشته شده است. قبلا از طریق دستور  
   {{< /note >}}
   
   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

  :نتیجه می بایست به شکل زیر باشد 

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< note >}}
برای اطلاعات بیشتر از دستور `kubectl `لینک پیوست شده را مشاهده کنید [kubectl overview](/docs/reference/kubectl/).
{{< /note >}}

## ساخت سرویس

به‌صورت پیش‌فرض، Pod فقط از طریق آدرس IP داخلی خود درون خوشه  Kubernetes قابل دسترسی است.
برای اینکه کانتینر   `hello-node` از بیرون شبکه‌ی مجازی Kubernetes قابل دسترسی باشد، باید Pod را به‌عنوان یک سرویس Kubernetes [*Service*](/docs/concepts/services-networking/service/).منتشر (Expose) کنید.

{{< warning >}}
کانتینر  agnhost دارای یک مسیر (endpoint) به نام `/shell` است که برای عیب‌یابی (debug) مفید است، اما در معرض خطر در صورت اتصال به اینترنت عمومی قرار دارد.
این کانتینر را روی خوشه هایی  که به اینترنت متصل هستند یا خوشه های تولیدی (production) اجرا نکنید.

{{< /warning >}}

1. 1.	برای در دسترس قرار دادن Pod از طریق اینترنت عمومی، از دستور `kubectl expose` استفاده کنید:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    دستور `-type=LoadBalancer`  به این معنی می باشد که میخواهید سرویس را به بیرون خوشه دسترسی بدید 
    
    کد اپلیکیشن داخل تصویر تست (test image) فقط روی پورت TCP شماره 8080 باز میشود.
اگر با استفاده از دستور  `kubectl expose` پورتی متفاوت را منتشر کرده باشید، کلاینت‌ها نمی‌توانند به آن پورت متصل شوند.


2. مشاهده service  ساخته شده:

    ```shell
    kubectl get services
    ```

   نتیجه می بایست به شکل زیر باشد:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    در ارائه‌دهندگان خدمات ابری (Cloud Providers) که از Load Balancer پشتیبانی می‌کنند,
    آدرس IP خارجی برای دسترسی به Service  اختصاص داده می‌شود.
   اما در Minikube، نوع سرویس `LoadBalancer` باعث می‌شود سرویس از طریق دستور زیر در دسترس باشد: `minikube service`

3. دستور زیر را اجرا کنید:

    ```shell
    minikube service hello-node
    ```

    با اجرای این دستور صفحه مرورگر باز میشود و جواب اپلیکشن را به شما نشان میدهد 

## فعال سازی اضافه ها(addons)

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.
ابزار{{< glossary_tooltip text="addons" term_id="addons" >}} که میتواند در محییط کوبرنتیز فعالیا غیر فعال شود minikube  شامل تعدادی ابزار داخلی می باشد که امکان 
1. لیست (addons) های در حال خاضر minikube  پشتیبانی میکند:

    ```shell
    minikube addons list
    ```

    نتیجه دستور به این شکل می باشد :

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

1. برای مثال فعال سازی addon  بر روی , `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

   نتیجه دستور به این شکل می باشد :

    ```
    The 'metrics-server' addon is enabled
    ```

1. مشاهده pod,services  که از طریق addons  نصب شده است:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

   نتیجه دستور به این شکل می باشد :

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

1. نیجه سرویس بررسی میکینیم `metrics-server`:

    ```shell
    kubectl top pods
    ```

    نتیجه دستور به این شکل می باشد :

    ```
    NAME                         CPU(cores)   MEMORY(bytes)   
    hello-node-ccf4b9788-4jn97   1m           6Mi             
    ```

    اگر پیام زیر را مشاهده کردید ، بعد از چند دقیقه مجدد بررسی کنید:

    ```
    error: Metrics API not available
    ```

1. غیرفال کردن `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    نتیجه به این شکل می باشد :

    ```
    metrics-server was successfully disabled
    ```

## پاک کردن پروژه

بعد از مشاهده نتیاج ، میتونید از با دستورات زیر منبعی که داخل خوشه ساختید را پاک کنید: 

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Stop the Minikube cluster

```shell
minikube stop
```

درصوت تمایل میتوانید خوشه minikube را غیر فعال نمایید :

```shell
# Optional
minikube delete
```

اکر میخواهید بیشتر با minikube  کار کنید ، نیازی به پاک کردن خوشه نمی باشد .

## نتیجه گیری:

این صفحه جنبه‌های اولیه برای راه‌اندازی یک خوشه  Minikube را پوشش داد.اکنون آماده‌اید تا اپلیکیشن‌های خود را مستقر (Deploy) کنید

## {{% heading "whatsnext" %}}


* منابع  _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* بیشتر راجبش یادبگیرید [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* بیشتر راجبش یادبگیرید  [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* بیشتر راجبش یادبگیرید [Service objects](/docs/concepts/services-networking/service/).


