---
title: آغاز کار با مینی کیوب (minikube)
content_type: tutorial
weight: 5
card:
  name: آموزش ها
  weight: 10
---

<!-- overview -->

این آموزش به شما نشان می دهد که چگونه یک برنامه را در کوبرنتیز توسط مینی کی یوب (Minikube) اجرا کنید.
این آموزش یک کانتینر NGINX را برای شما محیا می کند که به تمام درخواست هایتان پاسخ می دهد.

## {{% heading "objectives" %}}

* برنامه نمونه را در مینی کی یوب پیاده سازی کنید.
* برنامه را اجرا کنید.
* لاگ های برنامه را بررسی کنید.

## {{% heading "prerequisites" %}}


این آموزش با این باور شروع می شود که شما در حال حاضر `مینی کی یوب` را نصب کرده اید.
در صورت نیاز به راهنمای نصب مینی کی یوب به __Step1__ در [این سایت](https://minikube.sigs.k8s.io/docs/start/) مراجعه کنید.

{{< note >}}
در صورتی که مینی کی یوب را از لینک بالا نصب می کنید تنها __Step 1, Installation__ را دنبال کنید. قسمتهای بعدی در این صفحه موجوداند.
{{< /note >}}

ابزار `kubectl` را هم احتیاج دارید.

برای نصب از [قسمت ابزار](/docs/tasks/tools/#kubectl)  بازدید کنید.

<!-- lessoncontent -->

## پیکربندی کلاستر

```shell
minikube start
```

## باز کردن داشبورد

داشبورد کوبرنتیز در دو حالت قابل دسترسی می باشد.

{{< tabs name="dashboard" >}}
{{% tab name="نمایش در مرورگر" %}}
یک ترمینال جدید باز کرده و دستور زیر را اجرا کنید:
```shell
minikube dashboard
```

بدون پایان دادن به این دستور به ترمینال قبلی که دستور `minikube start` را در آن اجرا کردید بازگردید.

{{< note >}}
دستور `dashboard` افزونه داشبورد را فعال کرده و آن را در مرورگر اصلی شما باز می کند.
می‌توانید منابع کوبرنتیز مانند دیپلویمنت و سرویس را در داشبورد ایجاد کنید.

برای اینکه بدانید چگونه بدون باز کردن مرورگر مستقیماً از ترمینال، یک آدرس برای داشبورد وب دریافت کنید، به برگه "کپی آدرس" مراجعه کنید.

به‌طور پیش‌فرض، داشبورد فقط از شبکه مجازی داخلی کوبرنتیز قابل دسترسی است.
دستور `dashboard` یک پراکسی موقت ایجاد می‌کند تا داشبورد از خارج از شبکه مجازی کوبرنتیز نیز قابل دسترسی باشد.

To stop the proxy, run `Ctrl+C` to exit the process.
After the command exits, the dashboard remains running in the Kubernetes cluster.
You can run the `dashboard` command again to create another proxy to access the dashboard.
{{< /note >}}

{{% /tab %}}
{{% tab name="کپی آدرس" %}}

If you don't want minikube to open a web browser for you, run the `dashboard` subcommand with the
`--url` flag. `minikube` outputs a URL that you can open in the browser you prefer.

دستور زیر را در یک ترمینال جدید اجرا کنید و آن را نبندید.
```shell
minikube dashboard --url
```

اکنون می‌توانید از این آدرس استفاده کرده و به ترمینالی که در آن دستور `minikube start` را اجرا کرده‌اید بازگردید.

{{% /tab %}}
{{< /tabs >}}

## یک دیپلویمنت بسازید

هر [پاد](/docs/concepts/workloads/pods/) (Pod) در کوبرنتیز گروهی از یک یا چند کانتینر است که به دلیل مدیریت یا شبکه با هم گروه شده اند.
پاد استفاده شده در این آموزش تنها یک کانتینر دارد. هر [دیپلویمنت](/docs/concepts/workloads/controllers/deployment/) (Deployment) در کوبرنتیز پادهای خود را به صورت مداوم چک کرده و در صورت خاطمه یافنن کانتینر آن را دو باره راه اندازی می کنند
.دیپلویمنت ها روش پیشنهادی استقرار، مدیریت و مقیاس بندی پاد ها در کوبرنتیز هستندد

‍۱. با استففاده از دستور `kubectl create` یک دیپلویمنت بسازید که پاد این آموزش را مدیریت کند.
این پاد که یک کانتینر دارد بر پایه ایمیج (image) داکر مستقر می شود.

```shell
# Run a test container image that includes a webserver
kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
```

۲. دیپلویمنت را بررسی کنید:

```shell
kubectl get deployments
```

خروجی چیزی شبیه به این خواهد بود:

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
hello-node   1/1     1            1           1m
```

(امکان دارد که بالا آمدن پاد چند لحظه طول بکشد. اگر خروجی به شما "0/1" را نشان می دهد بعد از چند لحظه مکس دوباره تلاش کنید.)

۳. پاد را بررسی کنید:

```shell
kubectl get pods
```

خروجی چیزی شبیه به این خواهد بود:

```
NAME                          READY     STATUS    RESTARTS   AGE
hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
```

۴. ایونت های کلاستر را بررسی کنید:

```shell
kubectl get events
```

۵. تنظیمات `kubectl` را بررسی کنید:

```shell
kubectl config view
```

۶. بررسی لاگ های یک کانتینر در پاد .از دستور `kubectl get pods` استفاده کنید تا نام پاد خود را بدست آورید.


   
{{< note >}}
در دستور `kubectl logs` نام پاد خود را که از مرحله قبلی دارید با `hello-node-5f76cf6ccf-br9b5` جایگزین کنید.
{{< /note >}}


   
```shell
kubectl logs hello-node-5f76cf6ccf-br9b5
```

خروجی چیزی شبیه به این خواهد بود:

```
I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
```


{{< note >}}
برای دریافت اطلاعات بیشتر در مورد دستور `kubectl` به صفحه اختصاصی نگاه کلی [kubectl](/docs/reference/kubectl/) بروید.
{{< /note >}}

## ایجاد سرویس


به صورت پیش فرض پادها تنها در شبکه داخلی کوبرنتیز با ای پی (IP) های داخلی قابل دسترس هستند.
در این آموزش برای ایجاد دسترسی خارجی به کانتینر `hello-node` شما باید این پاد را از طریق یک [سرویس](/docs/concepts/services-networking/service/) منتشر کنید.

{{< warning >}}
The agnhost container has a `/shell` endpoint, which is useful for
debugging, but dangerous to expose to the public internet. Do not run this on an
internet-facing cluster, or a production cluster.
{{< /warning >}}

1. Expose the Pod to the public internet using the `kubectl expose` command:

```shell
kubectl expose deployment hello-node --type=LoadBalancer --port=8080
```

The `--type=LoadBalancer` flag indicates that you want to expose your Service
outside of the cluster.

The application code inside the test image only listens on TCP port 8080. If you used
`kubectl expose` to expose a different port, clients could not connect to that other port.

2. View the Service you created:

```shell
kubectl get services
```

خروجی چیزی شبیه به این خواهد بود:

```
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
```

On cloud providers that support load balancers,
an external IP address would be provisioned to access the Service. On minikube,
the `LoadBalancer` type makes the Service accessible through the `minikube service`
command.

3. Run the following command:

```shell
minikube service hello-node
```

This opens up a browser window that serves your app and shows the app's response.

## فعال کردن افزونه ها


The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:

```shell
minikube addons list
```

خروجی چیزی شبیه به این خواهد بود:

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

1. Enable an addon, for example, `metrics-server`:

```shell
minikube addons enable metrics-server
```

خروجی چیزی شبیه به این خواهد بود:

```
The 'metrics-server' addon is enabled
```

1. View the Pod and Service you created by installing that addon:

```shell
kubectl get pod,svc -n kube-system
```

خروجی چیزی شبیه به این خواهد بود:

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

1. Check the output from `metrics-server`:

```shell
kubectl top pods
```

خروجی چیزی شبیه به این خواهد بود:

```
NAME                         CPU(cores)   MEMORY(bytes)   
hello-node-ccf4b9788-4jn97   1m           6Mi             
```

If you see the following message, wait, and try again:

```
error: Metrics API not available
```

1. Disable `metrics-server`:

```shell
minikube addons disable metrics-server
```

خروجی چیزی شبیه به این خواهد بود:

```
metrics-server was successfully disabled
```

## پاکسازی

اکنون می‌توانید منابعی را که در کلاستر خود ایجاد کرده‌اید پاک‌سازی کنید:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

کلاستر را متوقف کنید.

```shell
minikube stop
```

به صورت دلخواه، می توانید ماشین مجازی مینی کیوب را حذف کنید:

```shell
minikube delete
```

اگر می خواهید دوباره از مینی کی یوب استفاده کنید تا بیشتر کوبرنتیز را یاد بگیرید نیازی به حذف ماشین مجازی ندارید ندارید

## جمع بندی

در این آموزش شما با نحوه راه اندازی یک کلاستر مینی کی یوب و بخش های ابتدایی یک کلاستر آشنا شدید. 

## {{% heading "whatsnext" %}}


* Tutorial to _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).

