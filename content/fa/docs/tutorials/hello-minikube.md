---
title: سلام مینی کیوب
content_type: tutorial
weight: 5
menu:
  main:
    title: "شروع کنید"
    weight: 10
    post: >
      <p>آماده هستید که دست به کار بشید؟ بیاید یک کلاستر ساده کوبرنتیز که یک برنامه ساده را اجرا می کند بسازیم</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

این آموزش به شما نشان می دهد که چگونه یک برنامه ساده رو در کوبرنتیز با استفاده از [مینی کیوب](/docs/setup/learning-environment/minikube) و کاتاکدا (Katacoda) اجرا کنید.
کاتاکدا یک محیط رایگان کوبرنتیز را در مرورگر فراهم می کند.

{{< note >}}
می توانید این آموزش را دنبال کنید اگر [مینی کیوب را محلی (در ماشین خود)](/docs/tasks/tools/install-minikube/) نصب کرده اید.
{{< /note >}}



## {{% heading "اهداف" %}}


* یک برنامه کاربردی نمونه را در مینی کیوب مستقر کنید.
* برنامه را اجرا کنید.
* لاگ های برنامه را مشاهده کنید.


## {{% heading "پیش نیازها" %}}


این آموزش یک کانتینر را ارائه می دهد که با استفاده از NGINX تمام درخواست ها را بازتاب می دهد.


<!-- lessoncontent -->

## ساخت خوشه مینی کیوب

1. کلیک کنید ** راه اندازی ترمینال **

    {{< kat-button >}}

{{< note >}}
    اگر مینی کیوب را به صورت محلی نصب کرده اید ، `minikube start` اجرا کنید.
{{< /note >}}

2. داشبورد کوبرنتیز را در یک مرورگر باز کنید:

    ```shell
    minikube dashboard
    ```

3. فقط برای محیط کاتاکودا: در بالای صفحه ترمینال ، روی علامت مثبت کلیک کنید و سپس  **Select port to view on Host 1** را انتخاب کنید.

4. فقط برای محیط کاتاکودا: ‍‍‍`30000` را وارد کنید و سپس بر روی **Display Port** کلیک کنید.

## ساختن دپلویمنت (Deployment)

یک [*Pod*](/docs/concepts/workloads/pods/pod/) کوبرنتیز گروهی از یک یا چند کانتینر است ، که برای اهداف مدیریتی (Administration) و شبکه به هم وصل هستند. Pod در این آموزش فقط یک کانتینر دارد. یک [*Deployment*](/docs/concepts/workloads/controllers/deployment/) کوبرنتیز سلامت Pod شما رو بررسی می کند و در صورت خاتمه آنرا دوباره راه اندازی می کند. Deployment ها روش پیشنهادی برای مدیریت و اسکیل (scale) کردن Pod هاست.

1. برای ایجاد یک Deployment که یک Pod را مدیریت می کند ، از دستور `kubectl create` استفاده کنید. Pod یک کانتینر را بر اساس ایمیج ارائه شده Docker اجرا می کند.

    ```shell
    kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
    ```

2. دیدن Deployment:

    ```shell
    kubectl get deployments
    ```

    خروجی (مثال):
    

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. دیدن Pod:

    ```shell
    kubectl get pods
    ```

    خروجی (مثال):

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. دیدن رویدادهای یک خوشه:

    ```shell
    kubectl get events
    ```

5. دیدن تنظیمات `kubectl` :

    ```shell
    kubectl config view
    ```

{{< note >}}
	برای کسب اطلاعات بیشتر در مورد دستورات `kubectl` ، به [نمای کلی kubectl](/docs/user-guide/kubectl-overview/) مراجعه کنید.
{{< /note >}}

## ساختن یک سرویس (Service)

به طور پیش فرض ، Pod فقط با آدرس IP داخلی خود در خوشه Kubernetes قابل دسترسی است. برای دسترسی `hello-node` کانتینر خارج از شبکه مجازی کوبرنتیز شما باید Pod را به عنوان یک [*Service*](/docs/concepts/services-networking/service/) در معرض دید قرار بدهید.

1. با استفاده از دستور `kubectl expose` پاد را در معرض دید اینترنت قرار دهید:  

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

	سوییچ `--type=LoadBalancer` نشان می دهد که شما می خواهید سرویس خود را در معرض دید خارج از خوشه قرار دهید.

2. دیدن سرویس ساخته شده:

    ```shell
    kubectl get services
    ```

    خروجی (مثال):

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

	در ارائه دهندگان ابری که از Load balancer پشتیبانی می کنند ،
	یک آدرس IP خارجی برای دسترسی به سرویس ارائه می شود. مینی کیوب ،
	نوع `LoadBalancer` سرویس را از طریق دستور` minikube service` قابل دسترسی می کند.

3. دستور زیر را اجرا کنید:

    ```shell
    minikube service hello-node
    ```

4. فقط برای محیط کاتاکودا: روی علامت بعلاوه کلیک کنید ، و سپس روی **Select port to view on Host 1** کلیک کنید.

5. فقط برای محیط کاتاکودا: به شماره پورت 5 رقمی که در مقابل `8080` در خروجی خدمات نمایش داده شده است توجه داشته باشید. این شماره پورت به طور تصادفی تولید می شود و می تواند برای شما متفاوت باشد. شماره خود را در کادر متن شماره پورت تایپ کنید ، سپس روی Display Port کلیک کنید. براساس خروجی مثال قبلی ، پورت `30369` می باشد.

    با این کار یک پنجره مرورگر باز می شود که به برنامه شما سرویس می دهد و پاسخ برنامه را نشان می دهد.

## فعال کردن افزونه ها

مینی کیوب دارای مجموعه ای از افزونه های {{< glossary_tooltip text="addons" term_id="addons" >}} داخلی است که می توانند در محیط محلی کوبرنتیز فعال ، غیرفعال و باز شوند.

1. افزونه های پشتیبانی شده فعلی را لیست کنید:

    ```shell
    minikube addons list
    ```

    خروجی (مثال):

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

2. فعال کردن یک افزونه ، به عنوان مثال ، `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    خروجی (مثال):

    ```
    metrics-server was successfully enabled
    ```

3. مشاهده Pod و سرویسی که به تازگی ایجاد کرده اید:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    خروجی (مثال):

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

4. غیر فعال کردن `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    خروجی (مثال):

    ```
    metrics-server was successfully disabled
    ```

## پاک کردن

اکنون می توانید منابعی را که در خوشه خود ایجاد کرده اید پاک کنید:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

به صورت اختیاری ، ماشین مجازی Minikube (VM) را متوقف کنید:

```shell
minikube stop
```

در صورت تمایل ، حذف Minikube VM:

```shell
minikube delete
```



## {{% heading "قدم بعدی" %}}


* درباره [Deployment objects](/docs/concepts/workloads/controllers/deployment/) بیشتر بدانید.
* درباره [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/) بیشتر بدانید.
* درباره [Service objects](/docs/concepts/services-networking/service/) بیشتر بدانید.


