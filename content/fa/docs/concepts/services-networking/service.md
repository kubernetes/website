---
reviewers:
- bprashanth
title: سرویس (Service)
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: کشف سرویس (Service discovery) و توازن بار (Load balancing)
  description: >
    نیازی نیست برنامه‌ی خود را برای استفاده از یک مکانیزم ناآشنای کشف سرویس تغییر دهید. Kubernetes به هر Pod یک آدرس IP اختصاصی و به مجموعه‌ای از Podها یک نام DNS یکتا می‌دهد و می‌تواند بار ترافیک را میان آن‌ها توزیع کند.
description: >-
  برنامه‌ای را که در کلاستر شما در حال اجراست، پشت یک نقطه‌ی دسترسی واحد و رو به بیرون
  در معرض دید قرار دهید؛ حتی زمانی که بار کاری بین چندین بک‌اند (backend) تقسیم شده باشد.
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="در Kubernetes، یک Service عبارت است از" >}}

یکی از اهداف کلیدی Serviceها در Kubernetes این است که لازم نباشد برنامه‌ی موجود خود را
برای استفاده از یک مکانیزم ناآشنای کشف سرویس (service discovery) تغییر دهید.
شما می‌توانید کدی را در Podها اجرا کنید، چه این کد برای دنیای cloud-native طراحی شده باشد
و چه یک برنامه‌ی قدیمی‌تر باشد که آن را کانتینری (containerize) کرده‌اید. از یک Service برای در دسترس
قرار دادن آن مجموعه از Podها روی شبکه استفاده می‌کنید تا کلاینت‌ها بتوانند با آن‌ها تعامل داشته باشند.

اگر برای اجرای برنامه‌ی خود از یک {{< glossary_tooltip term_id="deployment" >}} استفاده کنید،
آن Deployment می‌تواند به‌صورت پویا Podها را ایجاد و حذف کند. از یک لحظه به لحظه‌ی دیگر،
شما نمی‌دانید چه تعداد از آن Podها در حال کار و سالم هستند؛ حتی ممکن است ندانید
نام آن Podهای سالم چیست.
{{< glossary_tooltip term_id="pod" text="Podهای" >}} Kubernetes برای هماهنگی با وضعیت مطلوب کلاستر شما
ایجاد و حذف می‌شوند. Podها منابعی زودگذر (ephemeral) هستند (نباید انتظار داشته باشید
که یک Pod به‌تنهایی پایدار و قابل‌اتکا باشد).

هر Pod آدرس IP مخصوص به خود را دریافت می‌کند (Kubernetes انتظار دارد پلاگین‌های شبکه این موضوع را تضمین کنند).
برای یک Deployment مشخص در کلاستر شما، مجموعه‌ی Podهایی که در یک لحظه در حال اجرا هستند
می‌تواند با مجموعه‌ی Podهایی که لحظه‌ای بعد آن برنامه را اجرا می‌کنند متفاوت باشد.

این موضوع منجر به یک مسئله می‌شود: اگر مجموعه‌ای از Podها (که آن‌ها را «بک‌اند» می‌نامیم) عملکردی
را به Podهای دیگر (که آن‌ها را «فرانت‌اند» می‌نامیم) در داخل کلاستر شما ارائه دهند،
فرانت‌اندها چگونه متوجه می‌شوند و پیگیری می‌کنند که باید به کدام آدرس IP متصل شوند
تا بتوانند از بخش بک‌اند بار کاری استفاده کنند؟

اینجاست که _Serviceها_ وارد می‌شوند.

<!-- body -->

## Serviceها در Kubernetes

Service API که بخشی از Kubernetes است، یک انتزاع (abstraction) است که به شما کمک می‌کند گروه‌هایی از
Podها را روی شبکه در معرض دید قرار دهید. هر شیء Service مجموعه‌ای منطقی از endpointها (که معمولاً
این endpointها Pod هستند) را همراه با سیاستی درباره‌ی نحوه‌ی در دسترس قرار دادن آن Podها تعریف می‌کند.

برای مثال، یک بک‌اند stateless پردازش تصویر را در نظر بگیرید که با ۳ replica در حال اجراست.
آن replicaها قابل‌جایگزین (fungible) هستند؛ فرانت‌اندها اهمیتی نمی‌دهند که از کدام بک‌اند استفاده می‌کنند.
اگرچه Podهای واقعی که مجموعه‌ی بک‌اند را تشکیل می‌دهند ممکن است تغییر کنند، کلاینت‌های فرانت‌اند
نباید نیازی به آگاهی از این موضوع داشته باشند، و نه نیازی به پیگیری خودشان از مجموعه‌ی بک‌اندها دارند.

انتزاع Service این جداسازی (decoupling) را ممکن می‌سازد.

مجموعه‌ی Podهایی که یک Service هدف قرار می‌دهد معمولاً توسط یک
{{< glossary_tooltip text="selector" term_id="selector" >}} که خودتان تعریف می‌کنید مشخص می‌شود.
برای آشنایی با روش‌های دیگر تعریف endpointهای یک Service،
به [Serviceها _بدون_ selector](#services-without-selectors) مراجعه کنید.

اگر بار کاری شما با پروتکل HTTP کار می‌کند، می‌توانید از یک
[Ingress](/docs/concepts/services-networking/ingress/) برای کنترل نحوه‌ی رسیدن ترافیک وب
به آن بار کاری استفاده کنید.
Ingress یک نوع Service نیست، اما به‌عنوان نقطه‌ی ورودی برای کلاستر شما عمل می‌کند. یک Ingress به شما
اجازه می‌دهد قوانین مسیریابی (routing) خود را در یک منبع واحد یکپارچه کنید تا بتوانید چندین مؤلفه از
بار کاری خود را که به‌صورت جداگانه در کلاستر شما اجرا می‌شوند، پشت یک شنونده (listener) واحد در معرض دید قرار دهید.

[Gateway API](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) برای Kubernetes
قابلیت‌های بیشتری فراتر از Ingress و Service فراهم می‌کند. می‌توانید Gateway را به کلاستر خود اضافه کنید؛
این یک خانواده از API‌های توسعه‌یافته است که با استفاده از
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitionها" >}} پیاده‌سازی شده‌اند،
و سپس می‌توانید از آن‌ها برای پیکربندی دسترسی به سرویس‌های شبکه‌ای که در کلاستر شما در حال اجرا هستند استفاده کنید.

### کشف سرویس در فضای Cloud-native

اگر بتوانید از API‌های Kubernetes برای کشف سرویس در برنامه‌ی خود استفاده کنید،
می‌توانید از {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} برای دریافت
EndpointSliceهای مطابق پرس‌وجو کنید. Kubernetes هر زمان که مجموعه‌ی Podهای یک Service تغییر کند،
EndpointSliceهای آن Service را به‌روزرسانی می‌کند.

برای برنامه‌های غیر native، Kubernetes راه‌هایی برای قرار دادن یک پورت شبکه یا load balancer
میان برنامه‌ی شما و Podهای بک‌اند فراهم می‌کند.

در هر صورت، بار کاری شما می‌تواند از این مکانیزم‌های [کشف سرویس](#discovering-services)
برای یافتن هدفی که می‌خواهد به آن متصل شود استفاده کند.

## تعریف یک Service

یک Service یک {{< glossary_tooltip text="شیء (object)" term_id="object" >}} است
(دقیقاً همان‌طور که یک Pod یا یک ConfigMap یک شیء است). می‌توانید تعریف‌های Service را با استفاده از
API کوبرنتیز ایجاد، مشاهده یا تغییر دهید. معمولاً از ابزاری مانند `kubectl` برای انجام
آن فراخوانی‌های API استفاده می‌کنید.

برای مثال، فرض کنید مجموعه‌ای از Podها دارید که هرکدام روی پورت TCP شماره‌ی ۹۳۷۶ گوش می‌دهند
و با برچسب `app.kubernetes.io/name=MyApp` برچسب‌گذاری شده‌اند. می‌توانید یک Service تعریف کنید
تا آن شنونده‌ی TCP را منتشر کند:

{{% code_sample file="service/simple-service.yaml" %}}

اعمال این مانیفست یک Service جدید به نام «my-service» با نوع پیش‌فرض
ClusterIP ایجاد می‌کند ([نوع سرویس](#publishing-services-service-types)). این Service
پورت TCP شماره‌ی ۹۳۷۶ را روی هر Podای که برچسب `app.kubernetes.io/name: MyApp` را داشته باشد هدف قرار می‌دهد.

Kubernetes به این Service یک آدرس IP (به نام _cluster IP_) اختصاص می‌دهد که
توسط مکانیزم آدرس IP مجازی (virtual IP) استفاده می‌شود. برای جزئیات بیشتر درباره‌ی این مکانیزم،
[IPهای مجازی و پراکسی‌های سرویس (Virtual IPs and Service Proxies)](/docs/reference/networking/virtual-ips/) را بخوانید.

کنترلر آن Service به‌طور مداوم Podهای منطبق با selector آن را جست‌وجو می‌کند، و سپس
هر به‌روزرسانی لازم را روی مجموعه‌ی EndpointSliceهای آن Service اعمال می‌کند.

نام یک شیء Service باید یک
[نام برچسب معتبر بر اساس RFC 1123](/docs/concepts/overview/working-with-objects/names#rfc-1123-label-names) باشد.


{{< note >}}
یک Service می‌تواند _هر_ `port` ورودی را به یک `targetPort` نگاشت کند. به‌صورت پیش‌فرض و
برای راحتی، `targetPort` برابر با همان مقدار فیلد `port` تنظیم می‌شود.
{{< /note >}}

### تعریف پورت‌ها {#field-spec-ports}

تعریف‌های پورت در Podها نام دارند، و می‌توانید از این نام‌ها در ویژگی
`targetPort` یک Service استفاده کنید. برای مثال، می‌توانیم `targetPort` سرویس را
به این شکل به پورت Pod متصل کنیم:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc

---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
```

این حتی زمانی که در Service ترکیبی از Podها با استفاده از یک نام پیکربندی‌شده‌ی یکسان وجود دارد،
با پروتکل شبکه‌ای یکسان اما در دسترس از طریق شماره‌پورت‌های متفاوت، کار می‌کند. این موضوع
انعطاف‌پذیری زیادی برای استقرار (deploy) و تکامل Serviceهای شما فراهم می‌کند. برای مثال، می‌توانید
شماره‌پورت‌هایی را که Podها در نسخه‌ی بعدی نرم‌افزار بک‌اند خود منتشر می‌کنند تغییر دهید، بدون آن‌که کلاینت‌ها را دچار مشکل کنید.

پروتکل پیش‌فرض برای Serviceها
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp) است؛ می‌توانید از هر
[پروتکل پشتیبانی‌شده‌ی دیگری](/docs/reference/networking/service-protocols/) نیز استفاده کنید.

از آن‌جا که بسیاری از Serviceها نیاز دارند بیش از یک پورت را منتشر کنند، Kubernetes از
[تعریف چند پورت](#multi-port-services) برای یک Service پشتیبانی می‌کند.
هر تعریف پورت می‌تواند `protocol` یکسان یا متفاوتی داشته باشد.

### Serviceها بدون selector

Serviceها معمولاً به لطف selector، دسترسی به Podهای Kubernetes را انتزاع می‌کنند،
اما وقتی همراه با مجموعه‌ای متناظر از اشیاء
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
و بدون selector استفاده شوند، Service می‌تواند انواع دیگری از بک‌اندها را نیز انتزاع کند،
از جمله بک‌اندهایی که خارج از کلاستر اجرا می‌شوند.

برای مثال:

* می‌خواهید در محیط production یک کلاستر پایگاه‌داده‌ی خارجی داشته باشید، اما در محیط تست
  از پایگاه‌داده‌های خودتان استفاده می‌کنید.
* می‌خواهید Service خود را به یک Service در {{< glossary_tooltip term_id="namespace" >}} دیگر
  یا در کلاستر دیگری اشاره دهید.
* در حال مهاجرت یک بار کاری به Kubernetes هستید. در حین ارزیابی این رویکرد،
  فقط بخشی از بک‌اندهای خود را در Kubernetes اجرا می‌کنید.

در هر یک از این سناریوها می‌توانید یک Service را _بدون_ مشخص کردن یک selector برای تطبیق با Podها
تعریف کنید. برای مثال:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

از آن‌جا که این Service selector ندارد، اشیاء EndpointSlice متناظر به‌صورت خودکار ایجاد نمی‌شوند.
می‌توانید با افزودن دستی یک شیء EndpointSlice، این Service را به آدرس شبکه و پورتی که
روی آن در حال اجراست نگاشت کنید. برای مثال:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # طبق قرارداد، از نام Service
                     # به‌عنوان پیشوند برای نام EndpointSlice استفاده کنید
  labels:
    # باید برچسب "kubernetes.io/service-name" را تنظیم کنید.
    # مقدار آن را برابر با نام Service قرار دهید
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # باید با نام پورت سرویس تعریف‌شده در بالا مطابقت داشته باشد
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### EndpointSliceهای سفارشی

هنگام ایجاد یک شیء [EndpointSlice](#endpointslices) برای یک Service، می‌توانید
از هر نامی برای آن EndpointSlice استفاده کنید. هر EndpointSlice در یک namespace باید
نام یکتایی داشته باشد. یک EndpointSlice را با تنظیم
{{< glossary_tooltip text="برچسب (label)" term_id="label" >}} با نام `kubernetes.io/service-name`
روی آن EndpointSlice، به یک Service پیوند می‌دهید.

{{< note >}}
آدرس‌های IP endpoint _نباید_ از نوع loopback (برای IPv4: 127.0.0.0/8 و برای IPv6: ::1/128)
یا link-local (برای IPv4: 169.254.0.0/16 و 224.0.0.0/24 و برای IPv6: fe80::/64) باشند.

آدرس‌های IP endpoint نمی‌توانند برابر با cluster IP سایر Serviceهای کوبرنتیز باشند،
زیرا {{< glossary_tooltip term_id="kube-proxy" >}} از IPهای مجازی به‌عنوان مقصد پشتیبانی نمی‌کند.
{{< /note >}}

برای یک EndpointSlice که خودتان یا در کد خودتان ایجاد می‌کنید،
باید مقداری را نیز برای برچسب
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by)
انتخاب کنید. اگر کد کنترلر خود را برای مدیریت EndpointSliceها می‌نویسید، در نظر بگیرید از
مقداری شبیه به `"my-domain.example/name-of-controller"` استفاده کنید. اگر از یک ابزار
شخص ثالث استفاده می‌کنید، از نام آن ابزار به‌صورت کاملاً حروف کوچک استفاده کرده و فاصله‌ها
و علائم نگارشی دیگر را به خط تیره (`-`) تبدیل کنید.
اگر افراد به‌طور مستقیم از ابزاری مانند `kubectl` برای مدیریت EndpointSliceها استفاده می‌کنند،
از نامی استفاده کنید که این مدیریت دستی را توصیف کند، مانند `"staff"` یا
`"cluster-admins"`. باید
از استفاده‌ی مقدار رزرو‌شده‌ی `"controller"` که برای شناسایی EndpointSliceهای مدیریت‌شده توسط
control plane خود Kubernetes است، خودداری کنید.

#### دسترسی به یک Service بدون selector {#service-no-selector-access}

دسترسی به یک Service بدون selector همانند زمانی است که selector داشته باشد.
در [مثال](#services-without-selectors) مربوط به یک Service بدون selector،
ترافیک به یکی از دو endpoint تعریف‌شده در مانیفست EndpointSlice مسیریابی می‌شود: یک اتصال TCP
به 10.1.2.3 یا 10.4.5.6، روی پورت ۹۳۷۶.

{{< note >}}
API server کوبرنتیز اجازه‌ی پراکسی به endpointهایی را که به Podها نگاشت نشده‌اند نمی‌دهد.
اقداماتی مانند `kubectl port-forward service/<service-name> forwardedPort:servicePort`
در جایی که Service مورد نظر selector ندارد، به‌دلیل همین محدودیت با شکست مواجه می‌شوند.
این موضوع مانع از آن می‌شود که از API server کوبرنتیز به‌عنوان یک پراکسی برای endpointهایی
که فراخواننده ممکن است مجاز به دسترسی به آن‌ها نباشد، استفاده شود.
{{< /note >}}

یک Service از نوع `ExternalName` نوعی خاص از Service است که selector ندارد و
به‌جای آن از نام‌های DNS استفاده می‌کند. برای اطلاعات بیشتر، به بخش
[ExternalName](#externalname) مراجعه کنید.

### EndpointSliceها

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSliceها](/docs/concepts/services-networking/endpoint-slices/) اشیائی هستند که
زیرمجموعه‌ای (یک _slice_) از endpointهای شبکه‌ای پشتیبان یک Service را نمایش می‌دهند.

کلاستر کوبرنتیز شما تعداد endpointهایی را که هر EndpointSlice نمایش می‌دهد پیگیری می‌کند.
اگر تعداد endpointهای یک Service به‌قدری زیاد شود که به یک آستانه برسد، Kubernetes
یک EndpointSlice خالی دیگر اضافه کرده و اطلاعات endpoint جدید را در آن ذخیره می‌کند.
به‌صورت پیش‌فرض، Kubernetes زمانی یک EndpointSlice جدید ایجاد می‌کند که تمام EndpointSliceهای
موجود حداقل ۱۰۰ endpoint داشته باشند. Kubernetes تا زمانی که نیاز به افزودن یک endpoint اضافه‌تر نباشد،
EndpointSlice جدید را ایجاد نمی‌کند.

برای اطلاعات بیشتر درباره‌ی این API، به [EndpointSliceها](/docs/concepts/services-networking/endpoint-slices/)
مراجعه کنید.

### Endpointها (منسوخ‌شده) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

API مربوط به EndpointSlice، تکامل‌یافته‌ی API قدیمی‌تر
[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) است. API منسوخ‌شده‌ی
Endpoints نسبت به EndpointSlice چندین مشکل دارد:

  - از کلاسترهای dual-stack پشتیبانی نمی‌کند.
  - اطلاعات لازم برای پشتیبانی از قابلیت‌های جدیدتر، مانند
    [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution) را ندارد.
  - اگر فهرست endpointها بیش‌ازحد بزرگ باشد و در یک شیء واحد جا نشود، آن را کوتاه (truncate) می‌کند.

به همین دلیل، توصیه می‌شود همه‌ی کلاینت‌ها از API مربوط به EndpointSlice به‌جای Endpoints استفاده کنند.

#### Endpointهای بیش از ظرفیت

Kubernetes تعداد endpointهایی را که می‌توانند در یک شیء Endpoints جا شوند محدود می‌کند. زمانی که
بیش از ۱۰۰۰ endpoint پشتیبان برای یک Service وجود داشته باشد، Kubernetes داده‌های موجود در
شیء Endpoints را کوتاه می‌کند. از آن‌جا که یک Service می‌تواند با بیش از یک EndpointSlice پیوند داشته باشد،
محدودیت ۱۰۰۰ endpoint پشتیبان فقط روی API قدیمی‌تر Endpoints تأثیر می‌گذارد.

در آن حالت، Kubernetes حداکثر ۱۰۰۰ endpoint بک‌اند ممکن را برای ذخیره در شیء Endpoints انتخاب می‌کند،
و یک {{< glossary_tooltip text="annotation" term_id="annotation" >}} روی Endpoints تنظیم می‌کند:
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
control plane همچنین اگر تعداد Podهای بک‌اند به کمتر از ۱۰۰۰ برسد، آن annotation را حذف می‌کند.

ترافیک همچنان به بک‌اندها ارسال می‌شود، اما هر مکانیزم توازن باری که به API قدیمی‌تر Endpoints متکی باشد،
تنها ترافیک را به حداکثر ۱۰۰۰ endpoint پشتیبان موجود ارسال می‌کند.

همین محدودیت API به این معناست که نمی‌توانید به‌صورت دستی یک Endpoints را طوری به‌روزرسانی کنید
که بیش از ۱۰۰۰ endpoint داشته باشد.

### پروتکل برنامه (Application protocol)

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

فیلد `appProtocol` راهی برای مشخص کردن یک پروتکل برنامه برای هر پورت Service فراهم می‌کند.
این فیلد به‌عنوان یک راهنما (hint) برای پیاده‌سازی‌ها استفاده می‌شود تا رفتار غنی‌تری برای
پروتکل‌هایی که می‌شناسند ارائه دهند.
مقدار این فیلد در اشیاء Endpoints و EndpointSlice متناظر نیز بازتاب داده می‌شود.

این فیلد از قواعد استاندارد نام‌گذاری برچسب (label) در Kubernetes پیروی می‌کند. مقادیر معتبر عبارت‌اند از:

* [نام‌های استاندارد سرویس IANA](https://www.iana.org/assignments/service-names).

* نام‌های پیشونددار تعریف‌شده توسط پیاده‌سازی، مانند `mycompany.com/my-custom-protocol`.

* نام‌های پیشونددار تعریف‌شده توسط Kubernetes:

| پروتکل | توضیح |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 روی متن ساده (cleartext)، همان‌طور که در [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) توصیف شده است |
| `kubernetes.io/ws`  | WebSocket روی متن ساده (cleartext)، همان‌طور که در [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) توصیف شده است |
| `kubernetes.io/wss` | WebSocket روی TLS، همان‌طور که در [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) توصیف شده است |

### Serviceهای چندپورتی

برای برخی Serviceها، لازم است بیش از یک پورت را منتشر کنید.
Kubernetes به شما اجازه می‌دهد چندین تعریف پورت را روی یک شیء Service پیکربندی کنید.
هنگام استفاده از چند پورت برای یک Service، باید به همه‌ی پورت‌های خود نام بدهید
تا کاملاً مشخص و بدون ابهام باشند.
برای مثال:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
همانند {{< glossary_tooltip term_id="name" text="نام‌ها">}} در Kubernetes به‌طور کلی، نام پورت‌ها
باید فقط شامل حروف کوچک انگلیسی، اعداد و `-` باشند. نام پورت‌ها همچنین
باید با یک کاراکتر حرفی-عددی شروع و پایان یابند.

برای مثال، نام‌های `123-abc` و `web` معتبر هستند، اما `123_abc` و `-web` معتبر نیستند.
{{< /note >}}

## نوع Service {#publishing-services-service-types}

برای برخی بخش‌های برنامه‌ی شما (برای مثال، فرانت‌اندها) ممکن است بخواهید یک
Service را روی یک آدرس IP خارجی که از بیرون کلاستر شما در دسترس باشد، منتشر کنید.

انواع Service در Kubernetes به شما اجازه می‌دهند مشخص کنید چه نوع Serviceای می‌خواهید.

مقادیر ممکن برای `type` و رفتار هرکدام عبارت‌اند از:

[`ClusterIP`](#type-clusterip)
: Service را روی یک IP داخلی کلاستر منتشر می‌کند. انتخاب این مقدار باعث می‌شود
  Service فقط از داخل کلاستر قابل‌دسترسی باشد. این مقدار پیش‌فرضی است که در صورت عدم مشخص کردن
  صریح `type` برای یک Service استفاده می‌شود.
  می‌توانید Service را با استفاده از یک
  [Ingress](/docs/concepts/services-networking/ingress/) یا یک
  [Gateway](https://gateway-api.sigs.k8s.io/) در اینترنت عمومی منتشر کنید.

[`NodePort`](#type-nodeport)
: Service را روی IP هر Node، در یک پورت ثابت (`NodePort`) منتشر می‌کند.
  برای در دسترس قرار دادن آن node port، Kubernetes یک آدرس IP کلاستر تنظیم می‌کند،
  دقیقاً همانند زمانی که یک Service از `type: ClusterIP` درخواست کرده باشید.

[`LoadBalancer`](#loadbalancer)
: Service را به‌صورت خارجی با استفاده از یک load balancer خارجی منتشر می‌کند. Kubernetes
  به‌طور مستقیم یک مؤلفه‌ی توازن بار ارائه نمی‌دهد؛ شما باید یکی فراهم کنید، یا
  می‌توانید کلاستر Kubernetes خود را با یک ارائه‌دهنده‌ی cloud یکپارچه کنید.

[`ExternalName`](#externalname)
: Service را به محتوای فیلد `externalName` نگاشت می‌کند (برای مثال،
  به نام میزبان `api.foo.bar.example`). این نگاشت، سرور DNS کلاستر شما را طوری پیکربندی می‌کند
  که یک رکورد `CNAME` با آن مقدار نام میزبان خارجی برگرداند.
  هیچ‌گونه پراکسی (proxying) تنظیم نمی‌شود.

فیلد `type` در Service API به‌صورت قابلیت‌های تودرتو (nested) طراحی شده است - هر سطح
به سطح قبلی چیزی اضافه می‌کند. با این حال یک استثنا در این طراحی تودرتو وجود دارد. می‌توانید
یک Service از نوع `LoadBalancer` با
[غیرفعال کردن تخصیص `NodePort` مربوط به load balancer](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation)
تعریف کنید.

### `type: ClusterIP` {#type-clusterip}

این نوع پیش‌فرض Service، یک آدرس IP از استخری از آدرس‌های IP که کلاستر شما برای این منظور
رزرو کرده است اختصاص می‌دهد.

چندین نوع دیگر از Serviceها بر پایه‌ی نوع `ClusterIP` ساخته می‌شوند.

اگر یک Service تعریف کنید که `.spec.clusterIP` آن روی `"None"` تنظیم شده باشد، Kubernetes
هیچ آدرس IPای اختصاص نمی‌دهد. برای اطلاعات بیشتر به [Serviceهای headless](#headless-services)
مراجعه کنید.

#### انتخاب آدرس IP دلخواه خودتان

می‌توانید آدرس cluster IP دلخواه خود را به‌عنوان بخشی از درخواست ایجاد یک `Service` مشخص کنید.
برای انجام این کار، فیلد `.spec.clusterIP` را تنظیم کنید. برای مثال، اگر از قبل یک رکورد
DNS دارید که می‌خواهید دوباره از آن استفاده کنید، یا سیستم‌های قدیمی‌ای دارید که برای یک
آدرس IP خاص پیکربندی شده‌اند و پیکربندی مجدد آن‌ها دشوار است.

آدرس IPای که انتخاب می‌کنید باید یک آدرس معتبر IPv4 یا IPv6 و در محدوده‌ی CIDR
`service-cluster-ip-range` تنظیم‌شده برای API server باشد.
اگر بخواهید یک Service با مقدار نامعتبر برای `clusterIP` ایجاد کنید، API
server کد وضعیت HTTP شماره‌ی ۴۲۲ را برمی‌گرداند تا نشان دهد مشکلی وجود دارد.

برای یادگیری این‌که Kubernetes چگونه به کاهش ریسک و تأثیر تلاش دو Service مختلف برای
استفاده از یک IP یکسان کمک می‌کند، [جلوگیری از تداخل (avoiding collisions)](/docs/reference/networking/virtual-ips/#avoiding-collisions)
را بخوانید.

### `type: NodePort` {#type-nodeport}

اگر فیلد `type` را روی `NodePort` تنظیم کنید، control plane کوبرنتیز یک پورت را از
محدوده‌ای که با فلگ `--service-node-port-range` مشخص شده (پیش‌فرض: 30000-32767) اختصاص می‌دهد.
هر node آن پورت را (همان شماره‌پورت روی هر Node) به Service شما پراکسی می‌کند.
Service شما پورت اختصاص‌یافته را در فیلد `.spec.ports[*].nodePort` خود گزارش می‌دهد.

استفاده از NodePort به شما آزادی می‌دهد که راه‌حل توازن بار (load balancing) خودتان را راه‌اندازی کنید،
محیط‌هایی را که به‌طور کامل توسط Kubernetes پشتیبانی نمی‌شوند پیکربندی کنید، یا حتی
آدرس IP یک یا چند node را به‌طور مستقیم منتشر کنید.

برای یک Service از نوع node port، Kubernetes همچنین یک پورت (TCP، UDP یا SCTP، متناسب با
پروتکل آن Service) اختصاص می‌دهد. هر node در کلاستر خودش را طوری پیکربندی می‌کند که روی آن
پورت اختصاص‌یافته گوش دهد و ترافیک را به یکی از endpointهای آماده‌ی مرتبط با آن Service ارسال کند.
شما می‌توانید به Service از نوع `type: NodePort`، از بیرون کلاستر، با اتصال به هر node با استفاده از
پروتکل مناسب (برای مثال: TCP) و پورت مناسب (پورتی که به آن Service اختصاص یافته) دسترسی پیدا کنید.

#### انتخاب پورت دلخواه خودتان {#nodeport-custom-port}

اگر شماره‌پورت مشخصی می‌خواهید، می‌توانید مقداری را در فیلد `nodePort` مشخص کنید. control plane
یا آن پورت را به شما اختصاص می‌دهد یا گزارش می‌دهد که تراکنش API با شکست مواجه شده است.
این به این معناست که باید مراقب تداخل احتمالی پورت‌ها خودتان باشید.
همچنین باید از یک شماره‌پورت معتبر، یعنی پورتی که در محدوده‌ی پیکربندی‌شده برای استفاده‌ی
NodePort قرار دارد، استفاده کنید.

در این‌جا یک نمونه مانیفست برای یک Service از نوع `NodePort` آورده شده که مقدار NodePort را
مشخص کرده است (در این مثال، ۳۰۰۰۷):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # به‌صورت پیش‌فرض و برای راحتی، `targetPort` برابر با
      # همان مقدار فیلد `port` تنظیم می‌شود.
      targetPort: 80
      # فیلد اختیاری
      # به‌صورت پیش‌فرض و برای راحتی، control plane کوبرنتیز
      # یک پورت از یک محدوده (پیش‌فرض: 30000-32767) اختصاص می‌دهد
      nodePort: 30007
```

#### رزرو محدوده‌های NodePort برای جلوگیری از تداخل {#avoid-nodeport-collisions}

سیاست اختصاص پورت به Serviceهای NodePort، هم در حالت اختصاص خودکار و هم در حالت اختصاص دستی
اعمال می‌شود. زمانی که کاربری بخواهد یک Service از نوع NodePort با پورت مشخصی ایجاد کند، ممکن است
پورت هدف با پورت دیگری که از قبل اختصاص یافته تداخل داشته باشد.

برای جلوگیری از این مشکل، محدوده‌ی پورت برای Serviceهای NodePort به دو باند تقسیم شده است.
اختصاص پویا (dynamic) پورت به‌صورت پیش‌فرض از باند بالایی استفاده می‌کند، و در صورت اتمام
باند بالایی ممکن است از باند پایینی استفاده کند. کاربران سپس می‌توانند با ریسک کمتر تداخل پورت،
از باند پایینی اختصاص دهند.

هنگام استفاده از محدوده‌ی پیش‌فرض NodePort یعنی 30000-32767، باندها به این شکل تقسیم می‌شوند:

- باند ثابت (Static band): 30000-30085
- باند پویا (Dynamic band): 30086-32767

برای جزئیات بیشتر درباره‌ی نحوه‌ی محاسبه‌ی باندهای ثابت و پویا، به
[جلوگیری از تداخل در اختصاص پورت به Serviceهای NodePort](/blog/2023/05/11/nodeport-dynamic-and-static-allocation/)
مراجعه کنید.

#### پیکربندی آدرس IP سفارشی برای Serviceهای `type: NodePort` {#service-nodeport-custom-listen-address}

می‌توانید nodeهای کلاستر خود را طوری تنظیم کنید که از یک آدرس IP خاص برای ارائه‌ی
سرویس‌های node port استفاده کنند. ممکن است بخواهید این کار را در صورتی انجام دهید که هر node
به چندین شبکه متصل باشد (برای مثال: یک شبکه برای ترافیک برنامه، و شبکه‌ی دیگری برای ترافیک
میان nodeها و control plane).

اگر می‌خواهید آدرس(های) IP خاصی را برای پراکسی کردن پورت مشخص کنید، می‌توانید فلگ
`--nodeport-addresses` را برای kube-proxy، یا معادل آن یعنی فیلد `nodePortAddresses`
در [فایل پیکربندی kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
را روی بلوک(های) IP خاصی تنظیم کنید.

این فلگ یک فهرست از بلوک‌های IP جدا‌شده با کاما (مثلاً `10.0.0.0/8`، `192.0.2.0/25`) را می‌گیرد
تا محدوده‌های آدرس IPای که kube-proxy باید آن‌ها را محلی (local) برای این node در نظر بگیرد مشخص کند.

برای مثال، اگر kube-proxy را با فلگ `--nodeport-addresses=127.0.0.0/8` اجرا کنید،
kube-proxy فقط رابط loopback را برای Serviceهای NodePort انتخاب می‌کند.
مقدار پیش‌فرض `--nodeport-addresses` یک فهرست خالی است.
این به این معناست که kube-proxy باید همه‌ی رابط‌های شبکه‌ی موجود را برای NodePort در نظر بگیرد.
(این موضوع همچنین با نسخه‌های قدیمی‌تر Kubernetes سازگار است.)
{{< note >}}
این Service به‌صورت `<NodeIP>:spec.ports[*].nodePort` و `.spec.clusterIP:spec.ports[*].port`
قابل‌مشاهده است.
اگر فلگ `--nodeport-addresses` برای kube-proxy یا فیلد معادل آن در فایل پیکربندی kube-proxy
تنظیم شده باشد، `<NodeIP>` یک آدرس IP فیلترشده (یا احتمالاً چند آدرس IP) از node خواهد بود.
{{< /note >}}

### `type: LoadBalancer` {#loadbalancer}

روی ارائه‌دهندگان cloud که از load balancerهای خارجی پشتیبانی می‌کنند، تنظیم فیلد `type`
روی `LoadBalancer` یک load balancer برای Service شما تدارک می‌بیند.
ایجاد واقعی load balancer به‌صورت ناهم‌زمان (asynchronous) انجام می‌شود، و
اطلاعات مربوط به توازن‌کننده‌ی تدارک‌دیده‌شده در فیلد `.status.loadBalancer` آن Service منتشر می‌شود.
برای مثال:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

ترافیک از load balancer خارجی به سمت Podهای بک‌اند هدایت می‌شود. ارائه‌دهنده‌ی cloud تصمیم می‌گیرد
که این ترافیک چگونه توازن‌بندی شود.

برای پیاده‌سازی یک Service از نوع `LoadBalancer`، Kubernetes معمولاً کار را با اعمال تغییراتی
معادل با درخواست یک Service از نوع `NodePort` آغاز می‌کند. سپس مؤلفه‌ی cloud-controller-manager،
load balancer خارجی را طوری پیکربندی می‌کند که ترافیک را به آن node port اختصاص‌یافته هدایت کند.

می‌توانید یک Service با توازن بار را طوری پیکربندی کنید که، در صورتی که پیاده‌سازی
ارائه‌دهنده‌ی cloud از آن پشتیبانی کند، از اختصاص node port
[صرف‌نظر](#load-balancer-nodeport-allocation) کند.

برخی ارائه‌دهندگان cloud به شما اجازه می‌دهند `loadBalancerIP` را مشخص کنید. در آن موارد،
load balancer با `loadBalancerIP` مشخص‌شده توسط کاربر ایجاد می‌شود. اگر فیلد `loadBalancerIP`
مشخص نشده باشد، load balancer با یک آدرس IP موقت (ephemeral) راه‌اندازی می‌شود. اگر
`loadBalancerIP` را مشخص کنید اما ارائه‌دهنده‌ی cloud شما از این ویژگی پشتیبانی نکند، فیلد
`loadbalancerIP` که تنظیم کرده‌اید نادیده گرفته می‌شود.


{{< note >}}
فیلد `.spec.loadBalancerIP` برای یک Service در Kubernetes نسخه‌ی v1.24 منسوخ (deprecated) اعلام شد.

این فیلد به‌درستی مشخص نشده بود و معنای آن در پیاده‌سازی‌های مختلف متفاوت است.
همچنین نمی‌تواند از شبکه‌ی dual-stack پشتیبانی کند. این فیلد ممکن است در نسخه‌ی آینده‌ی API حذف شود.

اگر با ارائه‌دهنده‌ای یکپارچه می‌شوید که از مشخص کردن آدرس(های) IP توازن‌کننده برای یک Service
از طریق یک annotation (مخصوص آن ارائه‌دهنده) پشتیبانی می‌کند، باید به استفاده از آن روش تغییر دهید.

اگر در حال نوشتن کدی برای یکپارچه‌سازی load balancer با Kubernetes هستید، از استفاده‌ی این فیلد
خودداری کنید. می‌توانید به‌جای Service، با [Gateway](https://gateway-api.sigs.k8s.io/) یکپارچه شوید،
یا می‌توانید annotationهای (مخصوص ارائه‌دهنده‌ی) خودتان را روی Service تعریف کنید که همان جزئیات را مشخص کند.
{{< /note >}}

#### تأثیر زنده‌بودن (liveness) node بر ترافیک load balancer

سلامت‌سنجی‌های (health checks) load balancer برای برنامه‌های مدرن حیاتی هستند. از آن‌ها برای
تعیین این‌که load balancer باید ترافیک را به کدام سرور (ماشین مجازی، یا آدرس IP) ارسال کند استفاده می‌شود.
APIهای Kubernetes نحوه‌ی پیاده‌سازی سلامت‌سنجی‌ها برای load balancerهای مدیریت‌شده توسط Kubernetes را
تعریف نمی‌کنند؛ در عوض این ارائه‌دهندگان cloud (و افرادی که کد یکپارچه‌سازی را پیاده‌سازی می‌کنند) هستند
که رفتار را تعیین می‌کنند. سلامت‌سنجی‌های load balancer به‌طور گسترده در چارچوب پشتیبانی از
فیلد `externalTrafficPolicy` برای Serviceها استفاده می‌شوند.

#### Load balancerها با انواع پروتکل ترکیبی

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

به‌صورت پیش‌فرض، برای Serviceهای از نوع LoadBalancer، زمانی که بیش از یک پورت تعریف شده باشد،
همه‌ی پورت‌ها باید پروتکل یکسانی داشته باشند، و آن پروتکل باید یکی از پروتکل‌های پشتیبانی‌شده
توسط ارائه‌دهنده‌ی cloud باشد.

feature gate با نام `MixedProtocolLBService` (که از نسخه‌ی v1.24 به بعد به‌صورت پیش‌فرض برای
kube-apiserver فعال است) اجازه می‌دهد از پروتکل‌های متفاوت برای Serviceهای از نوع LoadBalancer،
در صورت وجود بیش از یک پورت تعریف‌شده، استفاده شود.

{{< note >}}
مجموعه‌ی پروتکل‌هایی که می‌توان برای Serviceهای توازن‌شده استفاده کرد توسط ارائه‌دهنده‌ی cloud شما
تعیین می‌شود؛ آن‌ها ممکن است محدودیت‌هایی فراتر از آن‌چه API کوبرنتیز اعمال می‌کند تحمیل کنند.
{{< /note >}}

#### غیرفعال کردن تخصیص NodePort مربوط به load balancer {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

می‌توانید به‌صورت اختیاری، تخصیص node port را برای یک Service از نوع `LoadBalancer` با تنظیم
فیلد `spec.allocateLoadBalancerNodePorts` روی `false` غیرفعال کنید. این باید تنها برای پیاده‌سازی‌های
load balancer استفاده شود که ترافیک را به‌طور مستقیم به Podها هدایت می‌کنند، نه از طریق node portها.
به‌صورت پیش‌فرض، `spec.allocateLoadBalancerNodePorts` برابر `true` است و Serviceهای از نوع
LoadBalancer به تخصیص node port ادامه می‌دهند. اگر `spec.allocateLoadBalancerNodePorts` روی یک
Service موجود که node portهای اختصاص‌یافته دارد روی `false` تنظیم شود، آن node portها به‌صورت
خودکار **آزاد (de-allocate)** نمی‌شوند. باید به‌طور صریح ورودی `nodePorts` را در هر پورت Service
حذف کنید تا آن node portها آزاد شوند.

#### مشخص کردن کلاس پیاده‌سازی load balancer {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

برای یک Service با `type` تنظیم‌شده روی `LoadBalancer`، فیلد `.spec.loadBalancerClass`
به شما اجازه می‌دهد از یک پیاده‌سازی load balancer غیر از پیاده‌سازی پیش‌فرض ارائه‌دهنده‌ی cloud
استفاده کنید.

به‌صورت پیش‌فرض، `.spec.loadBalancerClass` تنظیم نشده و یک Service از نوع `LoadBalancer`
از پیاده‌سازی load balancer پیش‌فرض ارائه‌دهنده‌ی cloud استفاده می‌کند، در صورتی که کلاستر
با استفاده از فلگ مؤلفه‌ی `--cloud-provider` با یک ارائه‌دهنده‌ی cloud پیکربندی شده باشد.

اگر `.spec.loadBalancerClass` را مشخص کنید، فرض بر این است که یک پیاده‌سازی load balancer
منطبق با کلاس مشخص‌شده در حال رصد Serviceها است.
هر پیاده‌سازی پیش‌فرض load balancer (برای مثال، پیاده‌سازی ارائه‌شده توسط ارائه‌دهنده‌ی cloud)
Serviceهایی را که این فیلد در آن‌ها تنظیم شده نادیده می‌گیرد.
فیلد `spec.loadBalancerClass` تنها می‌تواند روی یک Service از نوع `LoadBalancer` تنظیم شود.
پس از تنظیم، دیگر قابل‌تغییر نیست.
مقدار `spec.loadBalancerClass` باید یک شناسه به سبک برچسب (label-style) باشد،
با پیشوند اختیاری مانند «`internal-vip`» یا «`example.com/internal-vip`».
نام‌های بدون پیشوند برای کاربران نهایی رزرو شده‌اند.

#### حالت آدرس IP در load balancer {#load-balancer-ip-mode}

برای یک Service از نوع `LoadBalancer`، یک کنترلر می‌تواند `.status.loadBalancer.ingress.ipMode`
را تنظیم کند. فیلد `.status.loadBalancer.ingress.ipMode` مشخص می‌کند آدرس IP توازن‌کننده
چگونه رفتار کند. این فیلد فقط می‌تواند زمانی مشخص شود که فیلد `.status.loadBalancer.ingress.ip`
نیز مشخص شده باشد.

دو مقدار ممکن برای `.status.loadBalancer.ingress.ipMode` وجود دارد: «VIP» و «Proxy».
مقدار پیش‌فرض «VIP» است، به این معنی که ترافیک به node با مقصدی تنظیم‌شده روی IP و پورت
load balancer تحویل داده می‌شود. دو حالت برای تنظیم این مقدار روی «Proxy» وجود دارد،
بسته به این‌که load balancer ارائه‌دهنده‌ی cloud چگونه ترافیک را تحویل می‌دهد:

- اگر ترافیک به node تحویل داده شده و سپس با DNAT به Pod منتقل شود، مقصد روی IP node و
  node port آن تنظیم می‌شود؛
- اگر ترافیک مستقیماً به Pod تحویل داده شود، مقصد روی IP و پورت Pod تنظیم می‌شود.

پیاده‌سازی‌های Service می‌توانند از این اطلاعات برای تنظیم مسیریابی ترافیک استفاده کنند.

#### Load balancer داخلی

در یک محیط ترکیبی گاهی لازم است ترافیک را از Serviceهایی که در همان بلوک آدرس شبکه‌ی
(مجازی) قرار دارند مسیریابی کنید.

در یک محیط split-horizon DNS، برای این‌که بتوانید هم ترافیک خارجی و هم ترافیک داخلی را
به endpointهای خود مسیریابی کنید، به دو Service نیاز خواهید داشت.

برای تنظیم یک load balancer داخلی، بسته به ارائه‌دهنده‌ی سرویس cloud مورد استفاده‌ی خود،
یکی از annotationهای زیر را به Service خود اضافه کنید:

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
یکی از تب‌ها را انتخاب کنید.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

Serviceهای از نوع ExternalName یک Service را به یک نام DNS نگاشت می‌کنند، نه به یک
selector معمول مانند `my-service` یا `cassandra`. این Serviceها را با پارامتر `spec.externalName`
مشخص می‌کنید.

برای مثال، این تعریف Service، Service به نام `my-service` را در namespace به نام `prod`
به `my.database.example.com` نگاشت می‌کند:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
یک Service از نوع `type: ExternalName` می‌تواند یک رشته‌ی آدرس IPv4 را بپذیرد،
اما آن رشته را به‌عنوان یک نام DNS متشکل از ارقام در نظر می‌گیرد، نه به‌عنوان یک آدرس IP
(هرچند اینترنت اجازه‌ی چنین نام‌هایی را در DNS نمی‌دهد).
Serviceهایی با نام‌های خارجی شبیه به آدرس‌های IPv4، توسط سرورهای DNS resolve نمی‌شوند.

اگر می‌خواهید یک Service را به‌طور مستقیم به یک آدرس IP خاص نگاشت کنید، استفاده از
[Serviceهای headless](#headless-services) را در نظر بگیرید.
{{< /note >}}

هنگام جست‌وجوی میزبان `my-service.prod.svc.cluster.local`، Service مربوط به DNS کلاستر
یک رکورد `CNAME` با مقدار `my.database.example.com` برمی‌گرداند. دسترسی به
`my-service` مانند سایر Serviceها کار می‌کند، اما با این تفاوت مهم که مسیریابی مجدد
در سطح DNS انجام می‌شود، نه از طریق پراکسی یا فوروارد کردن. اگر بعداً تصمیم بگیرید پایگاه‌داده‌ی
خود را به داخل کلاستر منتقل کنید، می‌توانید Podهای آن را راه‌اندازی کرده، selector یا endpointهای
مناسب را اضافه کرده و `type` آن Service را تغییر دهید.

{{< caution >}}
ممکن است در استفاده از ExternalName برای برخی پروتکل‌های رایج، از جمله HTTP و HTTPS،
با مشکل مواجه شوید. اگر از ExternalName استفاده کنید، نام میزبانی که کلاینت‌های داخل کلاستر
شما استفاده می‌کنند با نامی که ExternalName به آن اشاره دارد متفاوت است.

برای پروتکل‌هایی که از نام میزبان استفاده می‌کنند، این تفاوت ممکن است منجر به خطا یا پاسخ‌های
غیرمنتظره شود. درخواست‌های HTTP دارای هدر `Host:` ای خواهند بود که سرور مبدأ آن را نمی‌شناسد؛
سرورهای TLS نیز نمی‌توانند گواهی‌ای منطبق با نام میزبانی که کلاینت به آن متصل شده ارائه دهند.
{{< /caution >}}

## Serviceهای Headless

گاهی به توازن بار و یک IP واحد برای Service نیاز ندارید. در این حالت،
می‌توانید چیزی را که _Serviceهای headless_ نامیده می‌شود، با مشخص کردن صریح `"None"`
برای آدرس cluster IP (یعنی `.spec.clusterIP`) ایجاد کنید.

می‌توانید از یک Service headless برای ارتباط با سایر مکانیزم‌های کشف سرویس، بدون وابستگی
به پیاده‌سازی خود Kubernetes استفاده کنید.

برای Serviceهای headless، هیچ cluster IPای اختصاص نمی‌یابد، kube-proxy این Serviceها را
مدیریت نمی‌کند، و هیچ توازن بار یا پراکسی‌ای توسط پلتفرم برای آن‌ها انجام نمی‌شود.

یک Service headless به یک کلاینت اجازه می‌دهد به هر Podای که ترجیح می‌دهد، به‌طور مستقیم متصل شود.
Serviceهای headless مسیرها و فوروارد کردن بسته‌ها را با استفاده از
[آدرس‌های IP مجازی و پراکسی‌ها](/docs/reference/networking/virtual-ips/) پیکربندی نمی‌کنند؛
در عوض، Serviceهای headless آدرس‌های IP endpointِ Podهای مجزا را از طریق رکوردهای داخلی DNS،
که توسط [DNS Service](/docs/concepts/services-networking/dns-pod-service/) کلاستر ارائه می‌شود، گزارش می‌دهند.
برای تعریف یک Service headless، یک Service با `.spec.type` تنظیم‌شده روی ClusterIP (که همچنین
مقدار پیش‌فرض `type` است) ایجاد می‌کنید، و به‌علاوه `.spec.clusterIP` را روی None تنظیم می‌کنید.

مقدار رشته‌ای None یک حالت خاص است و با رها کردن فیلد `.spec.clusterIP` بدون مقدار، یکسان نیست.

نحوه‌ی پیکربندی خودکار DNS به این بستگی دارد که آیا Service دارای selector تعریف‌شده است یا خیر:

### با selector

برای Serviceهای headless که selector تعریف کرده‌اند، کنترلر endpoints، اشیاء EndpointSlice
را در API کوبرنتیز ایجاد می‌کند، و پیکربندی DNS را طوری تغییر می‌دهد که رکوردهای A یا AAAA
(آدرس‌های IPv4 یا IPv6) را برگرداند که مستقیماً به Podهای پشتیبان آن Service اشاره می‌کنند.

### بدون selector

برای Serviceهای headless که selector تعریف نکرده‌اند، control plane اشیاء EndpointSlice
ایجاد نمی‌کند. با این حال، سیستم DNS به‌دنبال موارد زیر می‌گردد و آن‌ها را پیکربندی می‌کند:

* رکوردهای DNS CNAME برای Serviceهای از نوع [`ExternalName`](#externalname).
* رکوردهای DNS A / AAAA برای همه‌ی آدرس‌های IP endpointهای آماده‌ی آن Service،
  برای همه‌ی انواع Service به‌جز `ExternalName`.
  * برای endpointهای IPv4، سیستم DNS رکوردهای A ایجاد می‌کند.
  * برای endpointهای IPv6، سیستم DNS رکوردهای AAAA ایجاد می‌کند.

هنگام تعریف یک Service headless بدون selector، `port` باید با `targetPort` مطابقت داشته باشد.

## کشف سرویس‌ها

برای کلاینت‌هایی که در داخل کلاستر شما اجرا می‌شوند، Kubernetes از دو حالت اصلی برای
یافتن یک Service پشتیبانی می‌کند: متغیرهای محیطی (environment variables) و DNS.

### متغیرهای محیطی

زمانی که یک Pod روی یک Node اجرا می‌شود، kubelet مجموعه‌ای از متغیرهای محیطی برای هر
Service فعال اضافه می‌کند. متغیرهای `{SVCNAME}_SERVICE_HOST` و `{SVCNAME}_SERVICE_PORT`
را اضافه می‌کند، که در آن‌ها نام Service با حروف بزرگ نوشته شده و خط تیره‌ها به زیرخط
تبدیل می‌شوند.

برای مثال، Service به نام `redis-primary` که پورت TCP شماره‌ی ۶۳۷۹ را منتشر می‌کند و
آدرس cluster IP برابر با 10.0.0.11 به آن اختصاص یافته، متغیرهای محیطی زیر را تولید می‌کند:

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
اگر Podای دارید که نیاز به دسترسی به یک Service دارد، و از روش متغیر محیطی برای منتشر کردن
پورت و cluster IP به Podهای کلاینت استفاده می‌کنید، باید Service را *پیش از* به‌وجود آمدن
Podهای کلاینت ایجاد کنید. در غیر این صورت، آن Podهای کلاینت متغیرهای محیطی خود را پر‌شده
نخواهند داشت.

اگر فقط از DNS برای کشف cluster IP یک Service استفاده می‌کنید، نیازی نیست نگران این
مسئله‌ی ترتیب باشید.
{{< /note >}}

Kubernetes همچنین متغیرهایی را پشتیبانی و ارائه می‌کند که با ویژگی «_[پیوندهای کانتینر قدیمی
(legacy container links)](https://docs.docker.com/network/links/)_» موتور Docker سازگار هستند.
می‌توانید [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
را بخوانید تا ببینید این ویژگی چگونه در Kubernetes پیاده‌سازی شده است.

### DNS

می‌توانید (و تقریباً همیشه باید) یک DNS Service برای کلاستر Kubernetes خود با استفاده از یک
[افزونه (add-on)](/docs/concepts/cluster-administration/addons/) راه‌اندازی کنید.

یک سرور DNS آگاه از کلاستر (cluster-aware)، مانند CoreDNS، تغییرات مربوط به Serviceهای جدید را
در API کوبرنتیز رصد می‌کند و برای هرکدام مجموعه‌ای از رکوردهای DNS ایجاد می‌کند. اگر DNS در سراسر
کلاستر شما فعال شده باشد، همه‌ی Podها باید بتوانند به‌طور خودکار Serviceها را با نام DNS آن‌ها resolve کنند.

برای مثال، اگر یک Service به نام `my-service` در یک namespace کوبرنتیز به نام `my-ns` داشته باشید،
control plane و DNS Service با همکاری یکدیگر یک رکورد DNS برای `my-service.my-ns` ایجاد می‌کنند.
Podهای موجود در namespace با نام `my-ns` باید بتوانند با جست‌وجوی نام برای `my-service` آن
Service را پیدا کنند (`my-service.my-ns` نیز کار می‌کند).

Podهای موجود در namespaceهای دیگر باید نام را به‌صورت `my-service.my-ns` واجد شرایط کنند.
این نام‌ها به cluster IP اختصاص‌یافته برای آن Service resolve می‌شوند.

Kubernetes همچنین از رکوردهای DNS SRV (Service) برای پورت‌های نام‌گذاری‌شده پشتیبانی می‌کند.
اگر Service با نام `my-service.my-ns` پورتی به نام `http` با پروتکل تنظیم‌شده روی `TCP` داشته باشد،
می‌توانید یک پرس‌وجوی DNS SRV برای `_http._tcp.my-service.my-ns` انجام دهید تا شماره‌پورت `http`
را همراه با آدرس IP آن کشف کنید.

سرور DNS کوبرنتیز تنها راه دسترسی به Serviceهای `ExternalName` است.
می‌توانید اطلاعات بیشتری درباره‌ی resolve شدن `ExternalName` در
[DNS برای Serviceها و Podها](/docs/concepts/services-networking/dns-pod-service/) پیدا کنید.

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## مکانیزم آدرس‌دهی IP مجازی

[IPهای مجازی و پراکسی‌های سرویس (Virtual IPs and Service Proxies)](/docs/reference/networking/virtual-ips/)
مکانیزمی را که Kubernetes برای منتشر کردن یک Service با یک آدرس IP مجازی فراهم می‌کند توضیح می‌دهد.

### سیاست‌های ترافیک

می‌توانید فیلدهای `.spec.internalTrafficPolicy` و `.spec.externalTrafficPolicy` را تنظیم کنید
تا نحوه‌ی مسیریابی ترافیک توسط Kubernetes به بک‌اندهای سالم («آماده») را کنترل کنید.

برای جزئیات بیشتر به [سیاست‌های ترافیک (Traffic Policies)](/docs/reference/networking/virtual-ips/#traffic-policies)
مراجعه کنید.

### کنترل توزیع ترافیک {#traffic-distribution}

فیلد `.spec.trafficDistribution` روش دیگری برای تأثیرگذاری بر مسیریابی ترافیک در داخل یک
Service کوبرنتیز فراهم می‌کند. در حالی که سیاست‌های ترافیک بر تضمین‌های معنایی دقیق تمرکز دارند،
توزیع ترافیک به شما اجازه می‌دهد _ترجیحاتی_ (مانند مسیریابی به سمت endpointهای نزدیک‌تر از نظر
توپولوژیک) را بیان کنید. این موضوع می‌تواند به بهینه‌سازی عملکرد، هزینه یا قابلیت‌اطمینان کمک کند.
در Kubernetes {{< skew currentVersion >}}، مقادیر زیر پشتیبانی می‌شوند:

`PreferSameZone`
: نشان‌دهنده‌ی ترجیح مسیریابی ترافیک به سمت endpointهایی است که در همان zone کلاینت قرار دارند.

`PreferSameNode`
: نشان‌دهنده‌ی ترجیح مسیریابی ترافیک به سمت endpointهایی است که روی همان node کلاینت قرار دارند.

`PreferClose` (منسوخ‌شده)
: این نام مستعار قدیمی‌تری برای `PreferSameZone` است که معنای آن کم‌تر واضح است.

اگر این فیلد تنظیم نشده باشد، پیاده‌سازی از استراتژی مسیریابی پیش‌فرض خود استفاده می‌کند.

برای جزئیات بیشتر به [توزیع ترافیک (Traffic Distribution)](/docs/reference/networking/virtual-ips/#traffic-distribution)
مراجعه کنید.

### چسبندگی نشست (Session stickiness)

اگر می‌خواهید مطمئن شوید که اتصالات از یک کلاینت خاص هر بار به همان Pod ارسال می‌شوند،
می‌توانید تمایل نشست (session affinity) را بر اساس آدرس IP کلاینت پیکربندی کنید. برای اطلاعات
بیشتر [تمایل نشست (session affinity)](/docs/reference/networking/virtual-ips/#session-affinity)
را بخوانید.

## IPهای خارجی

{{< feature-state for_k8s_version="v1.36" state="deprecated" >}}

همه‌ی کاربران باید مهاجرت از `externalIPs` را آغاز کنند.
استفاده از یک کنترلر load balancer خارجی یا یک پیاده‌سازی Gateway API را در نظر بگیرید.

اگر آدرس‌های IP خارجی‌ای وجود داشته باشند که به یک یا چند node کلاستر مسیریابی می‌شوند،
Serviceهای کوبرنتیز می‌توانند روی آن `externalIPs` منتشر شوند. زمانی که ترافیک شبکه با
آدرس IP خارجی (به‌عنوان IP مقصد) و پورتی که با آن Service مطابقت دارد وارد کلاستر شود،
قوانین و مسیرهایی که Kubernetes پیکربندی کرده تضمین می‌کنند که آن ترافیک به یکی از
endpointهای آن Service مسیریابی می‌شود.

هنگام تعریف یک Service، می‌توانید `externalIPs` را برای هر
[نوع سرویسی](#publishing-services-service-types) مشخص کنید.
در مثال زیر، به Service به نام `"my-service"` می‌توان توسط کلاینت‌ها با استفاده از TCP، روی
`"198.51.100.32:80"` (محاسبه‌شده از `.spec.externalIPs[]` و `.spec.ports[].port`) دسترسی داشت.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
Kubernetes تخصیص `externalIPs` را مدیریت نمی‌کند؛ این کار بر عهده‌ی مدیر کلاستر است.
{{< /note >}}

## شیء API

Service یک منبع (resource) سطح‌بالا در API REST کوبرنتیز است. می‌توانید جزئیات بیشتری
درباره‌ی [شیء API مربوط به Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
پیدا کنید.

## {{% heading "whatsnext" %}}

برای یادگیری بیشتر درباره‌ی Serviceها و این‌که چگونه در Kubernetes جای می‌گیرند:

* آموزش [اتصال برنامه‌ها با استفاده از Serviceها (Connecting Applications with Services)](/docs/tutorials/services/connect-applications-service/)
  را دنبال کنید.
* درباره‌ی [Ingress](/docs/concepts/services-networking/ingress/) بخوانید که
  مسیرهای HTTP و HTTPS را از بیرون کلاستر به Serviceهای داخل
  کلاستر شما در معرض دید قرار می‌دهد.
* درباره‌ی [Gateway](/docs/concepts/services-networking/gateway/) بخوانید که یک توسعه‌ی
  Kubernetes است و انعطاف‌پذیری بیشتری نسبت به Ingress فراهم می‌کند.

برای اطلاعات بیشتر، موارد زیر را بخوانید:

* [IPهای مجازی و پراکسی‌های سرویس (Virtual IPs and Service Proxies)](/docs/reference/networking/virtual-ips/)
* [EndpointSliceها](/docs/concepts/services-networking/endpoint-slices/)
* [مرجع API مربوط به Service](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [مرجع API مربوط به EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [مرجع API مربوط به Endpoint (منسوخ‌شده)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
