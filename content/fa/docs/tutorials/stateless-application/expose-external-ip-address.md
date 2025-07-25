---
title: افشای یک آدرس IP خارجی برای دسترسی به یک برنامه در یک خوشه
content_type: آموزش
weight: 10
---

<!-- overview -->

این صفحه نحوه ایجاد یک شیء سرویس Kubernetes را نشان می‌دهد که یک آدرس IP خارجی را در معرض نمایش قرار می‌دهد.


## {{% heading "prerequisites" %}}




*  نصب [kubectl](/docs/tasks/tools/).
* از یک ارائه‌دهنده ابری مانند Google Kubernetes Engine یا Amazon Web Services برای ایجاد یک خوشه Kubernetes استفاده کنید. این آموزش یک [external load balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/) ایجاد می‌کند که به یک ارائه‌دهنده ابری نیاز دارد.
* `kubectl` را برای ارتباط با سرور Kubernetes API خود پیکربندی کنید. برای دستورالعمل‌ها، به مستندات ارائه‌دهنده ابری خود مراجعه کنید.

## {{% heading "objectives" %}}

* پنج نمونه از برنامه Hello World را اجرا کنید.
* یک شیء سرویس ایجاد کنید که یک آدرس IP خارجی را در معرض نمایش قرار دهد.
* از شیء سرویس برای دسترسی به برنامه در حال اجرا استفاده کنید.

<!-- lessoncontent -->

## ایجاد یک سرویس برای اجرای یک برنامه در پنج پاد

1. یک برنامه Hello World را در خوشه خود اجرا کنید:


   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```
  دستور قبلی یک ایجاد می‌کند
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   و مرتبط
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   ReplicaSet پنج مورد دارد
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
   که هر کدام برنامه Hello World را اجرا می‌کنند.

1. نمایش اطلاعات مربوط به استقرار

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. نمایش اطلاعات مربوط به اشیاء ReplicaSet شما:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. یک شیء سرویس ایجاد کنید که استقرار را در معرض نمایش قرار دهد:

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

1. نمایش اطلاعات مربوط به سرویس:

   ```shell
   kubectl get services my-service
   ```

   خروجی مشابه زیر است:

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}

   سرویس `type=LoadBalancer` توسط ارائه دهندگان ابری خارجی پشتیبانی می‌شود که در این مثال پوشش داده نشده است، لطفاً برای جزئیات بیشتر به [this page](/docs/concepts/services-networking/service/#loadbalancer) مراجعه کنید.

   {{< /note >}}

   {{< note >}}

   اگر آدرس IP خارجی به صورت \<pending\> نشان داده شد، یک دقیقه صبر کنید و دوباره همان دستور را وارد کنید.



   {{< /note >}}

1. نمایش اطلاعات دقیق در مورد سرویس:

   ```shell
   kubectl describe services my-service
   ```

  خروجی مشابه زیر است:


   ```console
   Name:           my-service
   Namespace:      default
   Labels:         app.kubernetes.io/name=load-balancer-example
   Annotations:    <none>
   Selector:       app.kubernetes.io/name=load-balancer-example
   Type:           LoadBalancer
   IP:             10.3.245.137
   LoadBalancer Ingress:   104.198.205.71
   Port:           <unset> 8080/TCP
   NodePort:       <unset> 32377/TCP
   Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
   Session Affinity:   None
   Events:         <none>
   ```
   آدرس IP خارجی (`LoadBalancer Ingress`) که توسط سرویس شما در معرض نمایش قرار می‌گیرد را یادداشت کنید. در این مثال، آدرس IP خارجی 104.198.205.71 است.
همچنین مقدار `Port` و `NodePort` را یادداشت کنید. در این مثال، `Port` برابر با 8080 و `NodePort` برابر با 32377 است.

1. در خروجی قبلی، می‌توانید ببینید که سرویس چندین نقطه پایانی دارد:
10.0.0.6:8080،10.0.1.6:8080،10.0.1.7:8080 + ۲ مورد دیگر. اینها آدرس‌های داخلی پادهایی هستند که برنامه Hello World را اجرا می‌کنند. برای تأیید اینکه اینها آدرس‌های پاد هستند، این دستور را وارد کنید:

   ```shell
   kubectl get pods --output=wide
   ```

   خروجی مشابه زیر است:


   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```

1. از آدرس IP خارجی (`LoadBalancer Ingress`) برای دسترسی به برنامه Hello World استفاده کنید:

   ```shell
   curl http://<external-ip>:<port>
   ```

   که در آن `<external-ip>` آدرس IP خارجی (`LoadBalancer Ingress`) سرویس شما است و `<port>` مقدار `Port` در توضیحات سرویس شما است.
اگر از minikube استفاده می‌کنید، تایپ `minikube service my-service` به طور خودکار برنامه Hello World را در مرورگر باز می‌کند.

  پاسخ به یک درخواست موفق، یک پیام سلام است:

   ```shell
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

برای حذف سرویس، این دستور را وارد کنید:

```shell
kubectl delete services my-service
```

برای حذف Deployment، ReplicaSet و Podهایی که برنامه Hello World را اجرا می‌کنند، این دستور را وارد کنید

```shell
kubectl delete deployment hello-world
```

## {{% heading "بعدی چیست؟" %}}

بیشتر بدانید
[connecting applications with services](/docs/tutorials/services/connect-applications-service/).
