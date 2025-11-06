---
title: افشای یک آدرس آیپی خارجی برای دسترسی به یک برنامه در کلاستر
content_type: tutorial
weight: 10
---

<!-- overview -->

این صفحه نشان می‌دهد چگونه یک شیء **Service** در کوبرنتیز بسازید که یک آدرس **آیپی خارجی** را برای دسترسی به برنامه درون کلاستر در معرض دید قرار دهد.

## {{% heading "پیش‌نیازها" %}}

* ابزار [kubectl](/docs/tasks/tools/) را نصب کنید.
* از یک ارائه‌دهنده‌ی ابری مانند **Google Kubernetes Engine** یا **Amazon Web Services** برای ایجاد یک کلاستر کوبرنتیز استفاده کنید.
  این آموزش یک [لودبالانسر خارجی](/docs/tasks/access-application-cluster/create-external-load-balancer/) ایجاد می‌کند که نیازمند ارائه‌دهنده‌ی ابری است.
* `kubectl` را طوری پیکربندی کنید که بتواند با سرور API کوبرنتیز شما ارتباط برقرار کند. برای دستورالعمل‌ها، به مستندات ارائه‌دهنده‌ی ابری خود مراجعه کنید.

## {{% heading "اهداف" %}}

* اجرای پنج نمونه از یک برنامه‌ی Hello World
* ایجاد یک شیء Service که یک آدرس آیپی خارجی را در معرض دید قرار دهد
* استفاده از شیء Service برای دسترسی به برنامه‌ی در حال اجرا

<!-- lessoncontent -->

## ایجاد سرویس برای برنامه‌ای که در پنج پاد اجرا می‌شود

1. برنامه‌ی Hello World را در کلاستر خود اجرا کنید:

   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```

   دستور بالا یک
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   و یک
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
   مرتبط ایجاد می‌کند.
   ReplicaSet شامل پنج
   {{< glossary_tooltip text="Pod" term_id="pod" >}}
   است که هرکدام برنامه‌ی Hello World را اجرا می‌کنند.

2. اطلاعات مربوط به Deployment را نمایش دهید:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

3. اطلاعات مربوط به اشیای ReplicaSet را نمایش دهید:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

4. یک شیء Service ایجاد کنید که Deployment را در معرض دید قرار دهد:

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

5. اطلاعات مربوط به Service را نمایش دهید:

   ```shell
   kubectl get services my-service
   ```

   خروجی مشابه زیر خواهد بود:

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}
   سرویس با نوع `type=LoadBalancer` توسط ارائه‌دهندگان ابری خارجی پشتیبانی می‌شود، که در این مثال پوشش داده نشده است.
   برای جزئیات بیشتر به بخش [تنظیم `type: LoadBalancer` برای Service](/docs/concepts/services-networking/service/#loadbalancer) مراجعه کنید.
   {{< /note >}}

   {{< note >}}
   اگر آدرس IP خارجی به‌صورت <pending> نمایش داده می‌شود، یک دقیقه صبر کنید و همان دستور را مجدداً وارد کنید.
   {{< /note >}}

6. اطلاعات جزئی‌تر درباره‌ی Service را نمایش دهید:

   ```shell
   kubectl describe services my-service
   ```

   خروجی مشابه زیر خواهد بود:
   ```
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

   آدرس آیپی خارجی (`LoadBalancer Ingress`) که توسط سرویس شما افشا شده را یادداشت کنید. در این مثال، آدرس آیپی خارجی برابر 104.198.205.71 است. همچنین مقدار `Port` و `NodePort` را نیز یادداشت کنید. در این مثال، `Port` برابر 8080 و `NodePort` برابر 32377 است.

   1. در خروجی قبلی، مشاهده می‌کنید که سرویس چندین **endpoint** دارد:
      10.0.0.6:8080, 10.0.1.6:8080, 10.0.1.7:8080 + 2 مورد دیگر.
      این‌ها آدرس‌های داخلی پادهایی هستند که برنامه Hello World را اجرا می‌کنند.
      برای تأیید اینکه این‌ها آدرس پادها هستند، دستور زیر را وارد کنید:

   ```shell
   kubectl get pods --output=wide
   ```

   خروجی مشابه زیر خواهد بود:

   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```

   2. از آدرس آیپی خارجی (`LoadBalancer Ingress`) برای دسترسی به برنامه Hello World استفاده کنید:

   ```shell
   curl http://<external-ip>:<port>
   ```

   که در آن `<external-ip>` آدرس آیپی خارجی سرویس (`LoadBalancer Ingress`) و `<port>` مقدار `Port` سرویس شما است.
   اگر از **minikube** استفاده می‌کنید، دستور `minikube service my-service` به‌صورت خودکار برنامه Hello World را در مرورگر باز می‌کند.

   پاسخ به یک درخواست موفقیت‌آمیز یک پیام hello خواهد بود:

   ```console
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

   ## {{% heading "پاک‌سازی" %}}

   برای حذف سرویس، دستور زیر را وارد کنید:

   ```shell
   kubectl delete services my-service
   ```

   برای حذف Deployment، ReplicaSet و پادهایی که برنامه Hello World را اجرا می‌کنند، دستور زیر را وارد کنید:

   ```shell
   kubectl delete deployment hello-world
   ```

   ## {{% heading "گام بعدی" %}}

   برای یادگیری بیشتر درباره:

   [اتصال برنامه‌ها با سرویس‌ها](/docs/tutorials/services/connect-applications-service/)

