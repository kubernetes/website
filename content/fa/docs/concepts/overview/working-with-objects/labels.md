---
reviewers:
- xirehat
title: برچسب‌ها و انتخابگرها
content_type: concept
weight: 40
---

<!-- overview -->

_برچسب‌ها_ نگاشت‌های کلید/مقدار هستند که به {{< glossary_tooltip text="اشیاء" term_id="object" >}} مانند پادها متصل می‌شوند.  
برچسب‌ها برای مشخص‌کردن ویژگی‌های شناسایی‌کنندهٔ اشیاء طراحی شده‌اند که برای کاربران معنادار و مرتبط‌اند، اما مستقیماً معنایی به سیستم هسته‌ای اضافه نمی‌کنند.  
می‌توان از برچسب‌ها برای سازمان‌دهی و انتخاب زیرمجموعه‌ای از اشیاء استفاده کرد.  
برچسب‌ها را می‌توان هنگام ایجاد شیء افزود و در هر زمان بعدی تغییر داد یا برچسب جدید اضافه کرد.  
هر شیء می‌تواند مجموعه‌ای از برچسب‌های کلید/مقدار داشته باشد.  
هر کلید باید برای یک شیء مشخص یکتا باشد.  

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

برچسب‌ها امکان اجرای پرس‌وجوها و واچ‌های کارا را فراهم می‌کنند و برای استفاده در رابط‌های کاربری گرافیکی (UI) و خط فرمان (CLI) ایده‌آل هستند. اطلاعات غیرشناسه‌ای باید با استفاده از [حاشیه‌نویس‌ها](/docs/concepts/overview/working-with-objects/annotations/) ثبت شوند.

<!-- body -->

## انگیزه

برچسب‌ها به کاربران اجازه می‌دهند ساختارهای سازمانی خود را به‌صورت اتصال سست (loosely coupled) بر روی اشیاء سیستم نگاشت کنند، بدون آن‌که کلاینت‌ها نیاز به ذخیرهٔ این نگاشت‌ها داشته باشند.

استقرار سرویس‌ها و خطوط پردازش دسته‌ای (batch) اغلب موجودیت‌های چندبعدی هستند (مثلاً چند بخش یا استقرار، چند مسیر انتشار، چند لایه، چند میکروسرویس در هر لایه). در بسیاری موارد، مدیریت نیازمند انجام عملیات‌های عرضی (cross-cutting) است که انتزاع‌های صرفاً سلسله‌مراتبی—به‌ویژه سلسله‌مراتبی‌های صلبی که توسط زیرساخت تعیین شده‌اند و نه توسط کاربران—را می‌شکند.

برچسب‌های نمونه:

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

این‌ها مثال‌هایی از  
[برچسب‌های رایج](/docs/concepts/overview/working-with-objects/common-labels/) هستند؛ می‌توانید قراردادهای خود را تعریف کنید.  
به خاطر داشته باشید که کلید برچسب برای هر شیء باید یکتا باشد.

## نحو و مجموعهٔ نویسه

_برچسب‌ها_ نگاشت‌های کلید/مقدار هستند. کلیدهای معتبر برچسب دو بخش دارند: یک پیشوند اختیاری و یک نام که با اسلش (`/`) از هم جدا می‌شوند. بخش نام الزامی است و باید حداکثر ۶۳ نویسه باشد؛ نام باید با یک نویسهٔ الفانامریک (`[a-z0-9A-Z]`) شروع و پایان یابد و می‌تواند در میان شامل خط تیره (`-`)، زیرخط (`_`)، نقطه (`.`) و نویسه‌های الفانامریک باشد. پیشوند اختیاری است. اگر مشخص شود، باید یک زیر‌دامنهٔ DNS باشد: مجموعه‌ای از برچسب‌های DNS که با نقطه (`.`) از هم جدا شده‌اند، مجموعاً بیشتر از ۲۵۳ نویسه نباشند و در پایان با اسلش (`/`) دنبال شوند.

اگر پیشوند حذف شود، فرض بر این است که کلید برچسب خصوصیِ کاربر است. اجزای خودکار سامانه (مثلاً `kube-scheduler`، `kube-controller-manager`، `kube-apiserver`، `kubectl` یا سایر اتوماسیون‌های شخص ثالث) که برچسب به اشیاء کاربر نهایی اضافه می‌کنند، باید حتماً پیشوند مشخص کنند.

پیشوندهای `kubernetes.io/` و `k8s.io/` برای اجزای اصلی کوبرنتیز  
[رزرو شده‌اند](/docs/reference/labels-annotations-taints/).

مقدار معتبر برچسب:

* باید حداکثر ۶۳ نویسه باشد (می‌تواند خالی باشد)،  
* اگر خالی نباشد، باید با یک نویسهٔ الفانامریک (`[a-z0-9A-Z]`) شروع و پایان یابد،  
* می‌تواند شامل خط تیره (`-`)، زیرخط (`_`)، نقطه (`.`) و نویسه‌های الفانامریک بین آن‌ها باشد.

برای مثال، در اینجا مانیفستی برای یک Pod آمده است که دو برچسب  
`environment: production` و `app: nginx` دارد:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## انتخابگرهای برچسب

برخلاف [نام‌ها و UIDها](/docs/concepts/overview/working-with-objects/names/)، برچسب‌ها یکتایی را تضمین نمی‌کنند. در حالت کلی انتظار می‌رود اشیاء مختلف، برچسب(های) یکسانی داشته باشند.

از طریق _انتخابگر برچسب_، کلاینت/کاربر می‌تواند مجموعه‌ای از اشیاء را شناسایی کند. انتخابگر برچسب، اصلی‌ترین ساختار گروه‌بندی در کوبرنتیز است.

در حال حاضر API دو نوع انتخابگر را پشتیبانی می‌کند: _مبتنی بر برابری_ و _مبتنی بر مجموعه_. یک انتخابگر برچسب می‌تواند از چند _الزام_ تشکیل شده باشد که با ویرگول از هم جدا شده‌اند. در صورت وجود چند الزام، همهٔ آن‌ها باید برآورده شوند، بنابراین ویرگول نقش عملگر منطقی _AND_ (`&&`) را دارد.

معنای انتخابگرهای خالی یا مشخص‌نشده وابسته به زمینه است و انواع API که از انتخابگر استفاده می‌کنند باید در مستندات خود در مورد اعتبار و معنی این انتخابگرها توضیح دهند.

{{< note >}}
برای برخی انواع API، مانند ReplicaSetها، انتخابگرهای برچسب دو نمونه در یک namespace نباید با هم همپوشانی داشته باشند، زیرا کنترلر ممکن است این را دستور متضاد تلقی کرده و نتواند تعیین کند چه تعداد Replica باید وجود داشته باشد.
{{< /note >}}

{{< caution >}}
برای هر دو حالت مبتنی بر برابری و مبتنی بر مجموعه، عملگر منطقی _OR_ (`||`) وجود ندارد. مطمئن شوید شروط فیلتر شما متناسب با این محدودیت ساختاربندی شده باشند.
{{< /caution >}}

### الزام‌های مبتنی بر برابری

الزام‌های مبتنی بر _برابری_ یا _نابرابری_ امکان فیلتر کردن بر اساس کلید و مقدار برچسب را فراهم می‌کنند. اشیاء منطبق باید تمام محدودیت‌های برچسب مشخص‌شده را برآورده کنند، هرچند ممکن است برچسب‌های اضافی نیز داشته باشند. سه نوع عملگر مجاز هستند: `=`, `==`, `!=`. دو عملگر اول نمایانگر _برابری_ (و هم‌معنا) هستند، در حالی که عملگر سوم نمایانگر _نابرابری_ است. برای مثال:

```
environment = production
tier != frontend
```

کد اول تمام منابعی را انتخاب می‌کند که کلیدشان برابر `environment` و مقدارشان برابر `production` است. کد دوم تمام منابعی را انتخاب می‌کند که کلیدشان برابر `tier` و مقدارشان متفاوت از `frontend` است، و همچنین منابعی که اصلاً برچسبی با کلید `tier` ندارند. می‌توانید منابع در `production` به‌استثنای `frontend` را با عملگر ویرگول فیلتر کنید: `environment=production,tier!=frontend`

یکی از سناریوهای کاربردی برای الزام مبتنی بر برابری، مشخص کردن معیارهای انتخاب نود برای پادها است. برای مثال، پاد نمونهٔ زیر نودهایی را انتخاب می‌کند که برچسب `accelerator` در آن‌ها وجود دارد و مقدارش `nvidia-tesla-p100` است.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### الزام‌های مبتنی بر مجموعه

الزام‌های برچسب مبتنی بر _مجموعه_ امکان فیلتر کردن کلیدها بر اساس یک مجموعه از مقادیر را فراهم می‌کنند. سه نوع عملگر پشتیبانی می‌شوند: `in`، `notin` و `exists` (فقط شناسهٔ کلید). برای مثال:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

- مثال اول تمام منابعی را انتخاب می‌کند که کلیدشان برابر `environment` باشد و مقدارشان برابر `production` یا `qa`.  
- مثال دوم تمام منابعی را انتخاب می‌کند که کلیدشان برابر `tier` باشد و مقادیرشان غیر از `frontend` و `backend` باشد، و همچنین منابعی که اصلاً برچسبی با کلید `tier` ندارند.  
- مثال سوم تمام منابعی را انتخاب می‌کند که برچسبی با کلید `partition` دارند؛ هیچ مقداری بررسی نمی‌شود.  
- مثال چهارم تمام منابعی را انتخاب می‌کند که برچسبی با کلید `partition` ندارند؛ هیچ مقداری بررسی نمی‌شود.  

به‌نحوی مشابه، جداکنندهٔ ویرگول نقش عملگر _AND_ را دارد. بنابراین فیلتر کردن منابعی که کلید `partition` دارند (صرف‌نظر از مقدار) و مقادیر `environment` آن‌ها متفاوت از `qa` باشد، با عبارت زیر امکان‌پذیر است:  
``partition,environment notin (qa)``  

انتخابگر برچسب _مبتنی بر مجموعه_ یک شکل کلی از برابری است، زیرا  
``environment=production`` معادل  
``environment in (production)`` است؛  
که برای عملگرهای `!=` و `notin` نیز صادق است.

_الزام‌های مبتنی بر مجموعه_ می‌توانند با _الزام‌های مبتنی بر برابری_ ترکیب شوند.  
به‌عنوان مثال: `partition in (customerA, customerB),environment!=qa`.

## API

### فیلتر کردن LIST و WATCH

برای عملیات **لیست** و **واچ**، می‌توانید انتخابگرهای برچسب را برای فیلتر کردن مجموعهٔ اشیاء بازگردانده‌شده مشخص کنید؛ این فیلتر را با یک پارامتر پرس‌وجو تعیین می‌کنید.  
(برای آشنایی دقیق با واچ‌ها در کوبرنتیز، بخش  
[کشف مؤثر تغییرات](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)  
را مطالعه کنید).  
هر دو نوع الزام مجاز هستند  
(در اینجا همان‌طور که در رشتهٔ پرس‌وجوی URL ظاهر می‌شوند نشان داده شده‌اند):

* الزام‌های _مبتنی بر برابری_: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`  
* الزام‌های _مبتنی بر مجموعه_: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`  

هر دو سبک انتخابگر برچسب را می‌توان برای لیست‌کردن یا واچ منابع از طریق یک REST client به کار برد.  
برای مثال، با هدف قرار دادن `apiserver` با `kubectl` و استفاده از الزام _مبتنی بر برابری_ می‌توان نوشت:  

```shell
kubectl get pods -l environment=production,tier=frontend
```

یا با استفاده از الزام‌های مبتنی بر مجموعه:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

همانطور که قبلاً اشاره شد، الزامات مبتنی بر مجموعه، گویاتر هستند. برای مثال، می‌توانند عملگر _OR_ را روی مقادیر پیاده‌سازی کنند:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

یا محدود کردن تطبیق منفی از طریق عملگر _notin_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### تنظیم ارجاعات مجموعه‌ای در اشیای API

برخی از اشیای کوبرنتیز، مانند [`service`](/docs/concepts/services-networking/service/)  
و [`replicationcontroller`](/docs/concepts/workloads/controllers/replicationcontroller/)،  
از انتخابگرهای برچسب برای مشخص‌کردن مجموعه‌ای از منابع دیگر (مانند [پادها](/docs/concepts/workloads/pods/)) استفاده می‌کنند.

#### Service و ReplicationController

مجموعهٔ پادهایی که یک `service` به آن‌ها هدف‌گذاری می‌کند با یک انتخابگر برچسب تعریف می‌شود.  
به‌طور مشابه، مجموعهٔ پادهایی که یک `replicationcontroller` باید آن‌ها را مدیریت کند نیز با انتخابگر برچسب مشخص می‌شود.

انتخابگرهای برچسب برای هر دو شیء در فایل‌های `json` یا `yaml` با استفاده از نقشه‌ها (maps) تعریف می‌شوند  
و فقط انتخابگرهای مبتنی بر _برابری_ پشتیبانی می‌شوند:

```json
"selector": {
    "component" : "redis",
}
```

یا

```yaml
selector:
  component: redis
```

این انتخابگر (به‌ترتیب در قالب `json` یا `yaml`) معادل  
`component=redis` یا `component in (redis)` است.

#### منابعی که از الزام‌های مبتنی بر مجموعه پشتیبانی می‌کنند

منابع جدیدتر مانند [`Job`](/docs/concepts/workloads/controllers/job/)،  
[`Deployment`](/docs/concepts/workloads/controllers/deployment/)،  
[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/) و  
[`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/)  
از الزام‌های _مبتنی بر مجموعه_ نیز پشتیبانی می‌کنند.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

`matchLabels` یک نگاشت از زوج‌های `{کلید، مقدار}` است. یک `{کلید، مقدار}` تکی در نگاشت `matchLabels`  
معادل یک عنصر از `matchExpressions` است که در آن فیلد `key` برابر "key"،  
عملگر `operator` برابر "In" و آرایهٔ `values` فقط شامل "value" است.  
`matchExpressions` فهرستی از الزامات انتخاب پاد (pod selector) است.  
عملگرهای معتبر شامل In، NotIn، Exists و DoesNotExist هستند.  
در حالت استفاده از In و NotIn، مجموعهٔ مقادیر باید خالی نباشد.  
تمام الزامات، چه از `matchLabels` و چه از `matchExpressions`، به‌صورت AND با هم ترکیب می‌شوند—  
یعنی همگی باید برقرار باشند تا تطبیق انجام شود.

#### انتخاب مجموعه‌هایی از نودها

یکی از کاربردهای انتخاب بر اساس برچسب، محدود کردن مجموعهٔ نودهایی است  
که یک پاد می‌تواند روی آن‌ها زمان‌بندی شود.  
برای اطلاعات بیشتر، مستندات مربوط به  
[انتخاب نود](/docs/concepts/scheduling-eviction/assign-pod-node/) را مشاهده کنید.

## استفادهٔ مؤثر از برچسب‌ها

می‌توانید یک برچسب را روی هر منبعی اعمال کنید،  
اما این همیشه بهترین روش نیست.  
در بسیاری از سناریوها باید از چند برچسب برای تمایز مجموعه‌های منابع از یکدیگر استفاده کرد.

برای مثال، برنامه‌های مختلف ممکن است مقادیر متفاوتی برای برچسب `app` داشته باشند،  
اما یک برنامهٔ چندلایه مانند [مثال guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/)  
نیاز دارد که هر لایه را نیز از هم متمایز کند.  
لایهٔ frontend می‌تواند برچسب‌های زیر را داشته باشد:

```yaml
labels:
  app: guestbook
  tier: frontend
```

در حالی که Redis master و replica برچسب‌های `tier` متفاوتی خواهند داشت، و شاید حتی یک برچسب `role` اضافی:

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

و

```yaml
labels:
  app: guestbook
  tier: backend
  role: replica
```

برچسب‌ها امکان برش و تفکیک منابع را در امتداد هر بُعدی که توسط یک برچسب مشخص شده است، فراهم می‌کنند:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

## به‌روزرسانی برچسب‌ها

گاهی ممکن است بخواهید پادهای موجود و سایر منابع را پیش از ایجاد منابع جدید، مجدداً برچسب‌گذاری کنید.  
این کار را می‌توان با استفاده از دستور `kubectl label` انجام داد.  
برای مثال، اگر بخواهید همهٔ پادهای NGINX خود را به‌عنوان لایهٔ frontend برچسب‌گذاری کنید، این دستور را اجرا کنید:

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

این دستور ابتدا تمام پادها را با برچسب "app=nginx" فیلتر می‌کند و سپس آنها را با برچسب "tier=fe" مشخص می‌کند.
برای دیدن پادهایی که برچسب‌گذاری کرده‌اید، دستور زیر را اجرا کنید:

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

این دستور تمام پادهایی با برچسب "app=nginx" را نمایش می‌دهد، به‌همراه یک ستون برچسب اضافی برای tier پادها  
(که با گزینهٔ `-L` یا `--label-columns` مشخص می‌شود).

برای اطلاعات بیشتر، به [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label) مراجعه کنید.

## {{% heading "whatsnext" %}}

- یاد بگیرید چگونه [یک برچسب به نود اضافه کنید](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- [برچسب‌ها، حاشیه‌نویس‌ها و تِینت‌های شناخته‌شده](/docs/reference/labels-annotations-taints/) را پیدا کنید
- [برچسب‌های پیشنهادی](/docs/concepts/overview/working-with-objects/common-labels/) را ببینید
- [اجرای استانداردهای امنیتی پاد با برچسب‌های Namespace](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- مقاله‌ای دربارهٔ [نوشتن کنترلر برای برچسب‌های پاد](/blog/2021/06/21/writing-a-controller-for-pod-labels/) بخوانید
