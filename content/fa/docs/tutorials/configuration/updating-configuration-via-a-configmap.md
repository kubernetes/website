---
title: به‌روزرسانی پیکربندی از طریق ConfigMap
content_type: tutorial
weight: 20
---

<!-- overview -->
این صفحه یک مثال گام‌به‌گام از به‌روزرسانی پیکربندی داخل یک پاد از طریق یک ConfigMap ارائه می‌دهد و بر پایه وظیفه [پیکربندی یک پاد برای استفاده از یک ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) بنا شده است.  
در پایان این آموزش، نحوه تغییر پیکربندی برای یک برنامه در حال اجرا را درک خواهید کرد.  
در این آموزش از image `alpine` و `nginx` به‌عنوان نمونه استفاده شده است.

## {{% heading "prerequisites" %}}
{{< include "task-tutorial-prereqs.md" >}}

برای ارسال درخواست‌های HTTP از ترمینال یا خط فرمان، به ابزار خط فرمان [curl](https://curl.se/) نیاز دارید.  
اگر `curl` روی سیستم شما در دسترس نیست، می‌توانید آن را نصب کنید. برای نصب، به مستندات سیستم‌عامل خود مراجعه کنید.  

## {{% heading "objectives" %}}
* به‌روزرسانی پیکربندی از طریق یک ConfigMap نصب‌شده به عنوان یک Volume
* به‌روزرسانی متغیرهای محیطی یک Pod از طریق یک ConfigMap
* به‌روزرسانی پیکربندی از طریق یک ConfigMap در یک Pod چندکانتینری
* به‌روزرسانی پیکربندی از طریق یک ConfigMap در یک Pod دارای یک کانتینر Sidecar

<!-- lessoncontent -->

## به‌روزرسانی پیکربندی از طریق یک ConfigMap که به عنوان یک Volume نصب شده است {#rollout-configmap-volume}

از دستور `kubectl create configmap` برای ایجاد یک ConfigMap از
[مقادیر صریح](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values) استفاده کنید:

```shell
kubectl create configmap sport --from-literal=sport=football
```

در زیر یک نمونه از مانیفست Deployment آورده شده است که ConfigMap با نام `sport` به عنوان یک
{{< glossary_tooltip text="volume" term_id="volume" >}} در تنها کانتینر پاد سوار (mount) شده است.
{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Deployment را ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

پادهای این Deployment را بررسی کنید تا مطمئن شوید آماده هستند (با تطبیق بر اساس
{{< glossary_tooltip text="selector" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

در هر نودی که یکی از این پادها اجرا می‌شود، kubelet داده‌های مربوط به آن ConfigMap را واکشی کرده و آن‌ها را به فایل‌هایی در یک volume محلی تبدیل می‌کند.
سپس kubelet آن volume را مطابق با الگوی پاد در کانتینر سوار (mount) می‌کند.
کدی که در کانتیر اجرا می‌شود، اطلاعات را از فایل بارگذاری کرده
و با استفاده از آن گزارشی را در stdout چاپ می‌کند.
می‌توانید این گزارش را با مشاهده لاگ‌های یکی از پادهای این Deployment بررسی کنید:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/configmap-volume
```

شما باید خروجی مشابه زیر را ببینید:

```
Found 3 pods, using pod/configmap-volume-76d9c5678f-x5rgj
Thu Jan  4 14:06:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:06:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:06 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:16 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:26 UTC 2024 My preferred sport is football
```

ویرایش ConfigMap:

```shell
kubectl edit configmap sport
```

در ویرایشگری که ظاهر می‌شود، مقدار کلید `sport` را از `football` به `cricket` تغییر دهید. تغییرات خود را ذخیره کنید.
ابزار kubectl، ConfigMap را بر این اساس به‌روزرسانی می‌کند (اگر خطایی مشاهده کردید، دوباره امتحان کنید).

در اینجا مثالی از نحوه‌ی عملکرد مانیفست پس از ویرایش آن آورده شده است:

```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

شما باید خروجی زیر را ببینید:

```
configmap/sport edited
```

لاگ‌های یکی از پادهای متعلق به این استقرار را دنبال کنید (آخرین مطالب را دنبال کنید):

```shell
kubectl logs deployments/configmap-volume --follow
```

پس از چند ثانیه، باید تغییر خروجی لاگ را به صورت زیر مشاهده کنید:

```
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

هنگامی که یک ConfigMap را با استفاده از یک ولوم `configMap` یا یک ولوم `projected` در یک پاد در حال اجرا نگاشت کرده باشید و آن ConfigMap را به‌روزرسانی کنید، پاد در حال اجرا تقریباً بلافاصله این تغییر را تشخیص می‌دهد.  
با این حال، برنامه شما تنها در صورتی متوجه این تغییر می‌شود که طوری نوشته شده باشد که یا به‌صورت دوره‌ای برای تغییرات، پرس‌و‌جو (poll) کند یا به‌روزرسانی فایل را پایش (watch) نماید.  
برنامه‌ای که پیکربندی خود را فقط در زمان راه‌اندازی بارگذاری می‌کند، متوجه این تغییر نخواهد شد.

{{< note >}}
کل تأخیر از لحظه به‌روزرسانی ConfigMap تا زمانی که کلیدهای جدید در پاد منعکس شوند، می‌تواند به‌اندازه دوره همگام‌سازی kubelet طول بکشد.  
همچنین [ConfigMapهای سوارشده به‌طور خودکار به‌روز می‌شوند](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically) را نیز بررسی کنید.
{{< /note >}}

## به‌روزرسانی متغیرهای محیطی یک Pod از طریق ConfigMap {#rollout-configmap-env}

از دستور `kubectl create configmap` برای ایجاد یک ConfigMap از
[مقادیر صریح](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values) استفاده کنید:

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

در زیر مثالی از مانیفست استقرار با متغیر محیطی پیکربندی شده از طریق ConfigMap `fruits` آورده شده است.

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

ایجاد استقرار:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

پادهای این Deployment را بررسی کنید تا مطمئن شوید آماده هستند (با تطبیق بر اساس
{{< glossary_tooltip text="selector" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

جفت کلید-مقدار در ConfigMap به عنوان یک متغیر محیطی در کانتینر Pod پیکربندی شده است.
این را با مشاهده گزارش‌های یک Pod که متعلق به Deployment است، بررسی کنید.

```shell
kubectl logs deployment/configmap-env-var
```

شما باید خروجی مشابه زیر را ببینید:

```
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

ویرایش ConfigMap:

```shell
kubectl edit configmap fruits
```

در ویرایشگری که ظاهر می‌شود، مقدار کلید `fruits` را از `apples` به `mangoes` تغییر دهید. تغییرات خود را ذخیره کنید.
ابزار kubectl، ConfigMap را بر این اساس به‌روزرسانی می‌کند (اگر خطایی مشاهده کردید، دوباره امتحان کنید).
در اینجا مثالی از نحوه‌ی عملکرد مانیفست پس از ویرایش آن آورده شده است:

```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

شما باید خروجی زیر را ببینید:

```
configmap/fruits edited
```

لاگ‌های Deployment را دنبال کنید و خروجی را برای چند ثانیه مشاهده کنید:

```shell
# As the text explains, the output does NOT change
kubectl logs deployments/configmap-env-var --follow
```

توجه داشته باشید که خروجی **بدون تغییر** باقی می‌ماند، حتی با اینکه ConfigMap را ویرایش کرده‌اید:

```
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< note >}}
گرچه مقدار کلید درون ConfigMap تغییر کرده است، متغیر محیطی در پاد هنوز مقدار قبلی را نمایش می‌دهد. دلیل این امر آن است که متغیرهای محیطی برای یک فرایند در حال اجرا داخل یک پاد هنگام تغییر داده منبع **به‌روزرسانی نمی‌شوند**؛ اگر بخواهید این به‌روزرسانی را وادار کنید، لازم است کوبرنتیز پادهای موجود شما را جایگزین کند.
پادهای جدید سپس با اطلاعات به‌روزشده اجرا خواهند شد.
{{< /note >}}

می‌توانید این جایگزینی را آغاز کنید. با استفاده از [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) یک rollout برای Deployment انجام دهید:

```shell
# Trigger the rollout
kubectl rollout restart deployment configmap-env-var

# Wait for the rollout to complete
kubectl rollout status deployment configmap-env-var --watch=true
```

در مرحله بعد، Deployment را بررسی کنید:

```shell
kubectl get deployment configmap-env-var
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

پادها را بررسی کنید:

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

اجرای رول‌اوت باعث می‌شود کوبرنتیز یک {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
جدید برای Deployment بسازد؛ یعنی پادهای موجود در نهایت خاتمه می‌یابند و پادهای جدید ایجاد می‌شوند.
پس از چند ثانیه باید خروجی‌ای مشابه زیر مشاهده کنید:

```
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< note >}}
لطفاً قبل از ادامه مراحل بعدی، منتظر بمانید تا پادهای قدیمی‌تر به‌طور کامل از کار بیفتند.
{{< /note >}}

مشاهده گزارش‌های مربوط به یک Pod در این استقرار:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/configmap-env-var
```

شما باید خروجی مشابه زیر را ببینید:

```
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

این سناریوی به‌روزرسانی متغیرهای محیطی در یک Pod که از یک ConfigMap مشتق شده‌اند را نشان می‌دهد. تغییرات در مقادیر ConfigMap در طول انتشار بعدی به Pod اعمال می‌شوند. اگر Podها به دلیل دیگری مانند افزایش مقیاس Deployment ایجاد شوند، Podهای جدید نیز از آخرین مقادیر پیکربندی استفاده می‌کنند. اگر انتشار را آغاز نکنید، ممکن است متوجه شوید که برنامه شما با ترکیبی از مقادیر متغیرهای محیطی قدیمی و جدید اجرا می‌شود.

## به‌روزرسانی پیکربندی از طریق ConfigMap در یک Pod چندکانتینری {#rollout-configmap-multiple-containers}

از دستور `kubectl create configmap` برای ایجاد یک ConfigMap از
[مقادیر ثابت](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values) استفاده کنید:

```shell
kubectl create configmap color --from-literal=color=red
```

در ادامه یک نمونه مانیفست برای یک Deployment آورده شده است که مجموعه‌ای از پادها را مدیریت می‌کند و هر پاد دو کانتینر دارد.  
این دو کانتینر یک حجم `emptyDir`‌ را به اشتراک می‌گذارند که برای برقراری ارتباط از آن استفاده می‌کنند.  
کانتینر نخست یک وب‌سرور (`nginx`) را اجرا می‌کند و مسیر مانت این حجمِ مشترک در آن،‌ `/usr/share/nginx/html` است.  
کانتینر کمکی دوم بر پایه `alpine` ساخته شده و در این کانتینر، حجم `emptyDir` در مسیر `/pod-data` مانت می‌شود.  
کانتینر کمکی فایلی HTML می‌نویسد که محتوای آن بر اساس یک ConfigMap است؛  
کانتینر وب‌سرور این فایل HTML را از طریق HTTP ارائه می‌دهد.

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

ایجاد Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

پادهای این Deployment را بررسی کنید تا مطمئن شوید آماده هستند (با تطبیق بر اساس
{{< glossary_tooltip text="selector" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

نمایش Deployment (ابزار `kubectl` یک {{<glossary_tooltip text="Service" term_id="service">}} برای شما ایجاد می‌کند):

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

برای ارسال پورت از `kubectl` استفاده کنید:

```shell
# this stays running in the background
kubectl port-forward service/configmap-service 8080:8080 &
```

به سرویس دسترسی پیدا کنید.

```shell
curl http://localhost:8080
```

شما باید خروجی مشابه زیر را ببینید:

```
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

ویرایش ConfigMap:

```shell
kubectl edit configmap color
```

در ویرایشگری که ظاهر می‌شود، مقدار کلید `color` را از `red` به `blue` تغییر دهید. تغییرات خود را ذخیره کنید.
ابزار kubectl، ConfigMap را بر این اساس به‌روزرسانی می‌کند (اگر خطایی مشاهده کردید، دوباره امتحان کنید).

در اینجا مثالی از نحوه‌ی نمایش مانیفست پس از ویرایش آن آورده شده است:

```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# می‌توانید فراداده‌های موجود را به همان صورت که هستند، رها کنید.
# مقادیری که خواهید دید دقیقاً با این مقادیر مطابقت نخواهند داشت.
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```

برای چند ثانیه روی URL سرویس بچرخید.

```shell
# وقتی از آن راضی بودید، آن را لغو کنید (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

باید ببینید که خروجی به شکل زیر تغییر می‌کند:

```
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

## به‌روزرسانی پیکربندی از طریق ConfigMap در یک Pod دارای کانتینر sidecar {#rollout-configmap-sidecar}

می‌توان سناریوی بالا را با استفاده از یک [کانتینر سایدکار](/docs/concepts/workloads/pods/sidecar-containers/)  
به‌عنوان کانتینر کمکی برای نوشتن فایل HTML بازآفرینی کرد.  
از آنجا که یک کانتینر سایدکار از نظر مفهومی همانند یک Init Container است، تضمین می‌شود که پیش از کانتینر اصلی وب‌سرور آغاز به کار کند.  
به این ترتیب، اطمینان حاصل می‌شود که فایل HTML همواره زمانی که وب‌سرور آماده ارائه آن است در دسترس باشد.  

اگر از سناریوی قبلی ادامه می‌دهید، می‌توانید ConfigMap‌ با نام `color` را برای این سناریو دوباره به‌ کار ببرید.  
اگر این سناریو را به‌طور مستقل اجرا می‌کنید، با دستور `kubectl create configmap`  
از [مقادیر ثابت](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values) یک ConfigMap ایجاد کنید:

```shell
kubectl create configmap color --from-literal=color=blue
```

در ادامه یک نمونه مانیفست برای یک Deployment آورده شده است که مجموعه‌ای از پادها را مدیریت می‌کند؛ هر پاد یک کانتینر اصلی و یک کانتینر سایدکار دارد.  
این دو کانتینر یک حجم `emptyDir` را برای برقراری ارتباط به‌اشتراک می‌گذارند.  
کانتینر اصلی یک وب‌سرور (NGINX) را اجرا می‌کند و مسیر مانت این حجم مشترک در آن `/usr/share/nginx/html` است.  
کانتینر دوم یک کانتینر سایدکار بر پایه Alpine Linux است که نقش کانتینر کمکی را دارد. در این کانتینر، حجم `emptyDir` در مسیر `/pod-data` مانت می‌شود.  
کانتینر سایدکار فایلی HTML ایجاد می‌کند که محتوای آن بر اساس یک ConfigMap است؛ کانتینر وب‌سرور این فایل HTML را از طریق HTTP ارائه می‌دهد.

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

ایجاد Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

پادهای این Deployment را بررسی کنید تا از آماده بودن آنها اطمینان حاصل کنید (مطابق با {{< glossary_tooltip text="selector" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

نمایش Deployment (ابزار `kubectl` یک {{<glossary_tooltip text="Service" term_id="service">}} برای شما ایجاد می‌کند):


```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

برای ارسال پورت از `kubectl` استفاده کنید:

```shell
# این در پس‌زمینه اجرا می‌شود
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

به سرویس دسترسی پیدا کنید.

```shell
curl http://localhost:8081
```

شما باید خروجی مشابه زیر را ببینید:

```
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

ویرایش ConfigMap:

```shell
kubectl edit configmap color
```

در ویرایشگری که ظاهر می‌شود، مقدار کلید `color` را از `blue` به `green` تغییر دهید. تغییرات خود را ذخیره کنید.
ابزار kubectl، ConfigMap را بر این اساس به‌روزرسانی می‌کند (اگر خطایی مشاهده کردید، دوباره امتحان کنید).

در اینجا مثالی از نحوه‌ی نمایش مانیفست پس از ویرایش آن آورده شده است:

```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# می‌توانید فراداده‌های موجود را به همان صورت که هستند، رها کنید.
# مقادیری که خواهید دید دقیقاً با این مقادیر مطابقت نخواهند داشت.
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

برای چند ثانیه روی URL سرویس بچرخید.

```shell
# وقتی از آن راضی بودید، آن را لغو کنید (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

باید ببینید که خروجی به شکل زیر تغییر می‌کند:

```
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

## پیکربندی را از طریق یک ConfigMap تغییرناپذیر که به عنوان یک volume نصب شده است، به‌روزرسانی کنید. {#rollout-configmap-immutable-volume}

{{< note >}}
ConfigMapهای تغییرناپذیر (Immutable) به‌طور ویژه برای پیکربندی‌هایی استفاده می‌شوند که ثابت هستند و انتظار **نمی‌رود** در گذر زمان تغییر کنند. علامت‌گذاری یک ConfigMap به‌عنوان «تغییرناپذیر» به گونه‌ای است که موجب بهبود عملکرد می‌شود؛ زیرا kubelet دیگر برای یافتن تغییرات آن را پایش نمی‌کند.

اگر نیاز داشتید تغییری اعمال کنید، باید یکی از کارهای زیر را در نظر بگیرید:

- نام ConfigMap را عوض کنید و سپس پادهایی را اجرا کنید که به نام جدید ارجاع می‌دهند
- تمام نودهای خوشه را که پیش‌تر پادی با مقدار قدیمی اجرا کرده‌اند، جایگزین کنید
- kubelet را در هر نودی که قبلاً ConfigMap قدیمی را بارگذاری کرده، بازراه‌اندازی (restart) کنید
{{< /note >}}

در ادامه مانیفست نمونه‌ای برای یک [ConfigMap تغییرناپذیر](/docs/concepts/configuration/configmap/#configmap-immutable) نمایش داده شده است.  
{{% code_sample file="configmap/immutable-configmap.yaml" %}}

ConfigMap تغییرناپذیر را ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

در زیر مثالی از یک مانیفست Deployment با ConfigMap تغییرناپذیر `company-name-20150801` که به عنوان یک {{< glossary_tooltip text="volume" term_id="volume" >}} در تنها کانتینر Pod نصب شده است، آورده شده است.

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

ایجاد Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

پادهای این Deployment را بررسی کنید تا از آماده بودن آنها اطمینان حاصل کنید (مطابق با {{< glossary_tooltip text="selector" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

شما باید خروجی مشابه زیر را ببینید:

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

کانتینر Pod به داده‌های تعریف‌شده در ConfigMap اشاره دارد و از آن برای چاپ گزارش در stdout استفاده می‌کند. می‌توانید این گزارش را با مشاهده گزارش‌های مربوط به یکی از Podها در آن Deployment بررسی کنید:

```shell
# یک Pod متعلق به Deployment را انتخاب کنید و گزارش‌های آن را مشاهده کنید
kubectl logs deployments/immutable-configmap-volume
```

شما باید خروجی مشابه زیر را ببینید:

```
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< note >}}
وقتی یک ConfigMap به‌عنوان «تغییرناپذیر» (immutable) علامت‌گذاری شود، دیگر نمی‌توان این تغییر را برگرداند  
و نه محتوای فیلدهای `data` یا `binaryData` را دست‌کاری کرد.  
برای تغییر رفتار پادهایی که از این پیکربندی استفاده می‌کنند،  
باید یک ConfigMap تغییرناپذیر جدید بسازید و Deployment را ویرایش کنید  
تا یک الگوی پاد کمی متفاوت تعریف کند که به ConfigMap جدید ارجاع می‌دهد.  
{{< /note >}}

یک ConfigMap تغییرناپذیر جدید با استفاده از مانیفست زیر ایجاد کنید:

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

شما باید خروجی مشابه زیر را ببینید:

```
configmap/company-name-20240312 created
```

ConfigMap تازه ایجاد شده را بررسی کنید:

```shell
kubectl get configmap
```

شما باید خروجی‌ای را ببینید که هر دو ConfigMaps قدیمی و جدید را نمایش می‌دهد:

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

Deployment را برای ارجاع به ConfigMap جدید تغییر دهید.

ویرایش Deployment:

```shell
kubectl edit deployment immutable-configmap-volume
```

در ویرایشگری که ظاهر می‌شود، تعریف حجم موجود را به‌روزرسانی کنید تا از ConfigMap جدید استفاده کند.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # Update this field
  name: config-volume
```

شما باید خروجی زیر را ببینید:

```
deployment.apps/immutable-configmap-volume edited
```

این باعث راه‌اندازی یک به‌روزرسانی می‌شود. منتظر بمانید تا تمام پادهای قبلی خاتمه یابند و پادهای جدید در حالت آماده قرار گیرند.

وضعیت پادها را زیر نظر داشته باشید:

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m
```

در نهایت باید خروجی مشابه زیر را مشاهده کنید:

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

مشاهده گزارش‌های مربوط به یک Pod در این استقرار:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/immutable-configmap-volume
```

شما باید خروجی مشابه زیر را ببینید:

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

پس از اینکه تمام پیاده‌سازی‌ها برای استفاده از ConfigMap تغییرناپذیر جدید مهاجرت کردند، توصیه می‌شود که نسخه قدیمی را حذف کنید.

```shell
kubectl delete configmap company-name-20150801
```

## خلاصه

تغییرات در یک ConfigMap که به عنوان یک Volume روی یک Pod نصب شده است، پس از همگام‌سازی بعدی kubelet به طور یکپارچه در دسترس هستند.

تغییرات در یک ConfigMap که متغیرهای محیطی را برای یک Pod پیکربندی می‌کند، پس از راه‌اندازی بعدی برای Pod در دسترس هستند.

هنگامی که یک ConfigMap به عنوان تغییرناپذیر علامت‌گذاری می‌شود، امکان بازگشت این تغییر وجود ندارد (شما نمی‌توانید یک ConfigMap تغییرناپذیر را تغییرپذیر کنید) و همچنین نمی‌توانید هیچ تغییری در محتوای `data` یا فیلد `binaryData` ایجاد کنید. می‌توانید ConfigMap را حذف و دوباره ایجاد کنید، یا می‌توانید یک ConfigMap متفاوت جدید ایجاد کنید. هنگامی که یک ConfigMap را حذف می‌کنید، کانتینرهای در حال اجرا و Podهای آنها یک نقطه اتصال به هر Volume که به آن ConfigMap موجود ارجاع داده است، حفظ می‌کنند.

## {{% heading "cleanup" %}}

در صورت اجرا، دستورات `kubectl port-forward` را خاتمه دهید.

منابع ایجاد شده در طول آموزش را حذف کنید:

```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # در صورتی که در حین اجرای وظیفه(Task) رسیدگی نشده باشد
```
