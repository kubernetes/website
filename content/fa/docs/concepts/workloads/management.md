---
title: مدیریت بارکاری
content_type: concept
reviewers:
- xirehat
weight: 40
---

<!-- overview -->

شما برنامه خود را مستقر کرده و از طریق یک سرویس آن را در معرض نمایش قرار داده‌اید. حالا چه باید کرد؟ کوبرنتیز ابزارهای متعددی را برای کمک به شما در مدیریت استقرار برنامه، از جمله مقیاس‌بندی و به‌روزرسانی، ارائه می‌دهد.

<!-- body -->

## سازمان‌دهی پیکربندی منابع

بسیاری از برنامه‌ها نیاز به ایجاد چندین منبع دارند، مانند یک Deployment همراه با یک Service.  
مدیریت چندین منبع را می‌توان با گروه‌بندی آن‌ها در یک فایل واحد (جداشده با `---` در YAML) ساده کرد. برای مثال:

{{% code_sample file="application/nginx-app.yaml" %}}

می‌توان چندین منبع را به همان روشی که یک منبع واحد ایجاد می‌شود، ساخت:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

منابع به ترتیبی که در فایل manifest ظاهر می‌شوند ایجاد می‌شوند. بنابراین بهتر است ابتدا Service را مشخص کنید، زیرا این کار اطمینان می‌دهد که زمان‌بندی‌کننده بتواند پادهای مرتبط با آن Service را هنگام ایجاد توسط کنترلرها (مانند Deployment) پخش کند.

`kubectl apply` همچنین چندین آرگومان `-f` را می‌پذیرد:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```


توصیه می‌شود منابع مربوط به یک میکروسرویس یا لایه برنامه را در یک فایل قرار دهید و تمام فایل‌های مرتبط با برنامه خود را در یک دایرکتوری گروه‌بندی کنید. اگر لایه‌های برنامه شما با استفاده از DNS به یکدیگر متصل شوند، می‌توانید تمام اجزای پشته خود را با هم مستقر کنید.

همچنین می‌توان یک URL را به عنوان منبع پیکربندی مشخص کرد که برای استقرار مستقیم از مانیفست‌ها در سیستم کنترل منبع شما مفید است:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

اگر نیاز باشد تا مانیفست‌های بیشتری تعریف کنید، مانند افزودن یک ConfigMap، می‌توانید این کار را نیز انجام دهید.

### ابزارهای خارجی

در این بخش فقط رایج‌ترین ابزارهای مورد استفاده برای مدیریت بارکاری‌ها در کوبرنتیز فهرست شده‌اند. برای مشاهده فهرست کامل‌تر، قسمت [تعریف برنامه و ساخت تصویر](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build) در منظره {{< glossary_tooltip text="CNCF" term_id="cncf" >}} را ببینید.

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) ابزاری برای مدیریت بسته‌های منابع از پیش‌پیکربندی‌شده‌ی کوبرنتیز است. این بسته‌ها به عنوان _Helm charts_ شناخته می‌شوند.

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/) یک مانیفست کوبرنتیز را پیمایش می‌کند تا گزینه‌های پیکربندی را اضافه، حذف یا به‌روزرسانی کند. این ابزار هم به صورت یک باینری مستقل و هم به عنوان یک [ویژگی بومی](/docs/tasks/manage-kubernetes-objects/kustomization/) در kubectl در دسترس است.

## عملیات دسته جمعی در kubectl

ایجاد منابع تنها عملیاتی نیست که `kubectl` می‌تواند به صورت دسته جمعی انجام دهد. همچنین می‌تواند نام منابع را از فایل‌های پیکربندی استخراج کند تا عملیات دیگری را انجام دهد، به ویژه برای حذف همان منابعی که ایجاد کرده‌اید:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

در مورد دو منبع، می‌توانید هر دو منبع را در خط فرمان با استفاده از سینتکس resource/name مشخص کنید:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

برای تعداد بیشتری از منابع، مشخص کردن انتخابگر (پرس و جوی برچسب) که با استفاده از `-l` یا `--selector` مشخص می‌شود، برای فیلتر کردن منابع بر اساس برچسب‌هایشان، آسان‌تر خواهد بود:

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

### زنجیره‌سازی و فیلتر کردن

از آنجا که `kubectl` نام منابع را با همان سینتکس پذیرفته شده خود نمایش می‌دهد، می‌توانید عملیات را زنجیره‌ای کنید
با استفاده از `$()` یا `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

خروجی ممکن است مشابه زیر باشد:

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

با استفاده از دستورات بالا، ابتدا منابع را زیر مسیر `examples/application/nginx/` ایجاد می‌کنید و با قالب خروجی `-o name` (هر منبع به صورت resource/name) آن‌ها را نمایش می‌دهید. سپس فقط سرویس‌ها را با `grep` فیلتر کرده و با دستور [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/) نمایش می‌دهید.

### عملیات بازگشتی روی فایل‌های محلی

اگر فایل‌های منبع خود را در چند زیرشاخه درون یک پوشه سازمان‌دهی کرده باشید، می‌توانید عملیات را به‌صورت بازگشتی روی زیرشاخه‌ها نیز انجام دهید، با اضافه کردن گزینه‌ی `--recursive` یا `-R` همراه با آرگومان `--filename`/`-f`.

برای مثال، فرض کنید پوشه‌ای به نام `project/k8s/development` وجود دارد که تمام {{< glossary_tooltip text="manifست‌ها" term_id="manifest" >}} مورد نیاز برای محیط توسعه را بر اساس نوع منبع سازمان‌دهی کرده است:

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

به طور پیش‌فرض، انجام یک عملیات دسته‌ای در `project/k8s/development` در سطح اول دایرکتوری متوقف می‌شود و هیچ زیردایرکتوری را پردازش نمی‌کند. اگر سعی می‌کردید منابع را در این دایرکتوری با استفاده از دستور زیر ایجاد کنید، با خطا مواجه می‌شدیم:

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

در عوض، آرگومان خط فرمان `--recursive` یا `-R` را به همراه آرگومان `--filename`/`-f` مشخص کنید:

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

گزینه‌ی `--recursive` با هر عملیاتی که آرگومان `--filename`/`-f` را قبول می‌کند کار می‌کند، مانند: `kubectl create`، `kubectl get`، `kubectl delete`، `kubectl describe` یا حتی `kubectl rollout`.

گزینه‌ی `--recursive` زمانی که چندین آرگومان `-f` ارائه شود نیز کار می‌کند:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

اگر علاقه‌مندید درباره‌ی `kubectl` بیشتر بدانید، به سراغ مطالعه‌ی [ابزار خط فرمان (kubectl)](/docs/reference/kubectl/) بروید.

## به‌روزرسانی برنامه بدون قطعی

در مقطعی لازم است برنامه‌ی مستقر شما به‌روزرسانی شود، معمولاً با مشخص کردن  
یک ایمیج یا تگ جدید. `kubectl` چندین عملیات به‌روزرسانی را پشتیبانی می‌کند که  
هر کدام برای سناریوهای مختلف کاربرد دارد.

می‌توانید چند نسخه از برنامه‌ی خود را اجرا کنید و از _rollout_  
برای انتقال تدریجی ترافیک به پادهای سالم جدید استفاده کنید. در نهایت،  
همه‌ی پادهای اجراشده نرم‌افزار جدید را خواهند داشت.

این بخش از صفحه راهنمای شما برای ایجاد و به‌روزرسانی برنامه‌ها با استفاده از Deployment‌هاست.

فرض کنید شما در حال اجرای نسخه‌ی 1.14.2 از nginx بودید:

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

مطمئن شوید که ۱ کپی وجود دارد:

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

و با تنظیم حداکثر افزایش ناگهانی (surge maximum) روی ۱۰۰٪، به کوبرنتیز اجازه دهید در طول یک انتشار، کپی‌های موقت بیشتری اضافه کند:

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

برای به‌روزرسانی به نسخه 1.16.1، با استفاده از `kubectl edit`، `.spec.template.spec.containers[0].image` را از `nginx:1.14.2` به `nginx:1.16.1` تغییر دهید:

```shell
kubectl edit deployment/my-nginx
# مانیفست را تغییر دهید تا از تصویر کانتینر جدیدتر استفاده کند، سپس تغییرات خود را ذخیره کنید
```

همین بود! Deployment به‌صورت بیانی (declarative) برنامه‌ی nginx مستقر را به‌تدریج در پس‌زمینه به‌روزرسانی می‌کند. این کار تضمین می‌کند که در حین به‌روزرسانی تنها تعدادی مشخص از نسخه‌های قدیمی ممکن است از دسترس خارج شوند و تنها تعداد مشخصی از نسخه‌های جدید بالاتر از تعداد مطلوب پادها ایجاد شوند. برای آگاهی از جزئیات بیشتر درباره‌ی نحوه‌ی انجام این عملیات، به [Deployment](/docs/concepts/workloads/controllers/deployment/) مراجعه کنید.

می‌توانید از rollout با DaemonSetها، Deploymentها یا StatefulSetها استفاده کنید.

### مدیریت rolloutها

می‌توانید از دستور [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) برای مدیریت به‌روزرسانی تدریجی برنامه‌ی موجود بهره ببرید.

برای مثال:

```shell
kubectl apply -f my-deployment.yaml

# منتظر بمانید تا انتشار به پایان برسد
kubectl rollout status deployment/my-deployment --timeout 10m # تایم اوت ۱۰ دقیقه‌ای
```

or

```shell
kubectl apply -f backing-stateful-component.yaml

# منتظر پایان انتشار نباشید، فقط وضعیت را بررسی کنید
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

می‌توانید rollout را متوقف (`pause`)، ادامه (`resume`) یا لغو (`cancel`) کنید.  
برای کسب اطلاعات بیشتر به [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) مراجعه کنید.

## استقرارهای Canary

<!--TODO: make a task out of this for canary deployment, ref #42786-->

سناریوی دیگری که به چند برچسب نیاز دارد، تمایز بین استقرارهای نسخه‌ها یا پیکربندی‌های مختلف از یک مؤلفه مشابه است. معمولاً نسخه‌ای آزمایشی (*canary*) از انتشار جدید یک برنامه (مشخص‌شده از طریق تگ ایمیج در قالب پاد) کنار نسخه‌ی قبلی مستقر می‌شود تا انتشار جدید بتواند ترافیک تولید زنده را قبل از استقرار کامل دریافت کند.

برای مثال، می‌توانید از برچسب `track` برای تمایز انتشارهای مختلف استفاده کنید.

انتشار اصلی و پایدار دارای برچسب `track` با مقدار `stable` خواهد بود:

```none
name: frontend
replicas: 3
...
labels:
   app: guestbook
   tier: frontend
   track: stable
...
image: gb-frontend:v3
```

و سپس می‌توانید یک نسخه جدید از frontend guestbook ایجاد کنید که برچسب `track` را با مقدار متفاوت (مثلاً `canary`) داشته باشد، به طوری که دو مجموعه از podها با هم همپوشانی نداشته باشند:

```none
name: frontend-canary
replicas: 1
...
labels:
   app: guestbook
   tier: frontend
   track: canary
...
image: gb-frontend:v4
```

سرویس frontend با انتخاب زیرمجموعه مشترک برچسب‌های هر دو مجموعه کپی (replica) (یعنی حذف برچسب `track`) آنها، هر دو مجموعه را پوشش می‌دهد، به طوری که ترافیک به هر دو برنامه هدایت شود:

```yaml
selector:
   app: guestbook
   tier: frontend
```

شما می‌توانید تعداد کپی‌های نسخه‌های پایدار و قناری را تغییر دهید تا نسبت هر نسخه‌ای که ترافیک تولید زنده را دریافت می‌کند (در این مورد، ۳:۱) را تعیین کنید.

پس از اطمینان، می‌توانید مسیر پایدار را با نسخه جدید برنامه به‌روزرسانی کرده و مسیر قناری را حذف کنید.

## به‌روزرسانی حاشیه‌نویسی‌ها

گاهی اوقات می‌خواهید حاشیه‌نویسی‌ها را به منابع پیوست کنید. حاشیه‌نویسی‌ها، فراداده‌های دلخواه و غیرشناسایی هستند که برای بازیابی توسط کلاینت‌های API مانند ابزارها یا کتابخانه‌ها استفاده می‌شوند.

این کار را می‌توان با `kubectl annotate` انجام داد. به عنوان مثال:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

برای اطلاعات بیشتر، به [annotations](/docs/concepts/overview/working-with-objects/annotations/)  
و [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) مراجعه کنید.

## مقیاس‌دهی برنامه شما

وقتی بار روی برنامه شما افزایش یا کاهش می‌یابد، از `kubectl` برای مقیاس‌دهی برنامه خود استفاده کنید.  
برای مثال، برای کاهش تعداد replica‌های nginx از ۳ به ۱، دستور زیر را اجرا کنید:

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

حالا شما فقط یک پاد دارید که توسط استقرار مدیریت می‌شود.

```shell
kubectl get pods -l app=nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

برای اینکه سیستم به طور خودکار تعداد کپی‌های nginx مورد نیاز را از ۱ تا ۳ انتخاب کند، مراحل زیر را انجام دهید:

```shell
# این امر مستلزم وجود منبع موجود از معیارهای کانتینر و پاد است.
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

اکنون replica‌های nginx شما به‌طور خودکار بر اساس نیاز بالا و پایین مقیاس‌دهی خواهند شد.

برای اطلاعات بیشتر، لطفاً به مستندات  
[kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/)  
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/)  
و [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) مراجعه کنید.

## به‌روزرسانی منابع در محل

گاهی لازم است به‌روزرسانی‌های جزئی و غیرمخرب روی منابعی که ایجاد کرده‌اید انجام دهید.

### kubectl apply

پیشنهاد می‌شود مجموعه‌ای از فایل‌های پیکربندی را در کنترل نسخه نگه دارید  
(برای اطلاعات بیشتر نگاه کنید به [configuration as code](https://martinfowler.com/bliki/InfrastructureAsCode.html))  
تا بتوان آن‌ها را همراه با کد منابع‌شان نگهداری و نسخه‌بندی کرد.  
سپس می‌توانید از [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/)  
برای اعمال تغییرات پیکربندی خود به کلاستر استفاده کنید.

این دستور نسخه‌ی پیکربندی ارسالی شما را با نسخه‌ی قبلی مقایسه کرده و تغییراتی را که اعمال کرده‌اید به‌کار می‌گیرد،  
بدون آنکه تغییرات خودکار روی ویژگی‌هایی که مشخص نکرده‌اید را بازنویسی کند.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

برای آشنایی بیشتر با مکانیزم زیرساخت، [server-side apply](/docs/reference/using-api/server-side-apply/) را بخوانید.

### kubectl edit

به‌علاوه، می‌توانید منابع را با دستور [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/) نیز به‌روزرسانی کنید:

```shell
kubectl edit deployment/my-nginx
```

این معادل این است که ابتدا منبع را با `get` دریافت کنید، آن را در ویرایشگر متن ویرایش کنید و سپس با نسخه به‌روزرسانی‌شده، منبع را با `apply` اعمال نمایید:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# کمی ویرایش انجام دهید و سپس فایل را ذخیره کنید

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

این امکان را فراهم می‌کند تا تغییرات بزرگ‌تر را با سهولت بیشتری انجام دهید. توجه کنید که می‌توانید ویرایشگر را با متغیرهای محیطی `EDITOR` یا `KUBE_EDITOR` مشخص کنید.

برای اطلاعات بیشتر، لطفاً [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) را ببینید.

### kubectl patch

می‌توانید با استفاده از دستور [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) اشیاء API را در محل به‌روزرسانی کنید. این زیر‌دستور از JSON patch، JSON merge patch و strategic merge patch پشتیبانی می‌کند.

برای جزئیات بیشتر، به [به‌روزرسانی اشیاء API در محل با استفاده از kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) مراجعه کنید.

## به‌روزرسانی‌های مخرب

در برخی موارد، ممکن است نیاز باشد فیلدهای منبعی را که پس از مقداردهی اولیه قابل به‌روزرسانی نیستند، تغییر دهید، یا بخواهید بلافاصله تغییر بازگشتی انجام دهید، مثلاً برای اصلاح پادهای شکسته ایجادشده توسط یک Deployment. برای تغییر چنین فیلدهایی، از `replace --force` استفاده کنید که منبع را حذف کرده و مجدداً ایجاد می‌کند. در این حالت، می‌توانید فایل پیکربندی اصلی خود را ویرایش کنید:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```


## {{% heading "whatsnext" %}}

- درباره‌ی [نحوه استفاده از `kubectl` برای بازرسی و اشکال‌زدایی برنامه](/docs/tasks/debug/debug-application/debug-running-pod/) بیاموزید.
