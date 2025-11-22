---
title: مفاهیم API کوبرنتیز
content_type: مفهوم
weight: 20
---

<!-- overview -->
رابط برنامه‌نویسی Kubernetes یک رابط برنامه‌نویسی مبتنی بر منبع (RESTful) است که از طریق HTTP ارائه می‌شود. این رابط از بازیابی، ایجاد، به‌روزرسانی و حذف منابع اولیه از طریق افعال استاندارد HTTP (POST، PUT، PATCH، DELETE، GET) پشتیبانی می‌کند.


برای برخی منابع، API شامل زیرمنابع اضافی است که امکان مجوزدهی دقیق (مانند نماهای جداگانه برای جزئیات Pod و بازیابی لاگ) را فراهم می‌کند و می‌تواند آن منابع را در نمایش‌های مختلف برای راحتی یا کارایی بپذیرد و ارائه دهد.


Kubernetes از طریق _watches_ از اعلان‌های تغییر کارآمد در منابع پشتیبانی می‌کند:
{{< glossary_definition prepend="در API Kubernetes، watch is" term_id="watch" length="short" >}}

Kubernetes همچنین عملیات لیست ثابتی را ارائه می‌دهد تا کلاینت‌های API بتوانند وضعیت منابع را به طور مؤثر ذخیره، پیگیری و همگام‌سازی کنند.


می‌توانید  [API reference](/docs/reference/kubernetes-api/) را به صورت آنلاین مشاهده کنید، یا برای آشنایی کلی با API، ادامه مطلب را بخوانید.
<!-- body -->
## اصطلاحات API کوبرنتیز {#standard-api-terminology}

کوبرنتیز عموماً از اصطلاحات رایج RESTful برای توصیف مفاهیم API استفاده می‌کند:

* *resource type * نامی است که در URL استفاده می‌شود (`pods`، `namespaces`، `services`)
* همه انواع منابع یک نمایش ملموس (طرحواره شیء خود) دارند که *kind* نامیده می‌شود.
* فهرستی از نمونه‌های یک نوع منبع، به عنوان *collection* شناخته می‌شود.
* یک نمونه واحد از یک نوع منبع، *resource* نامیده می‌شود و معمولاً نشان‌دهنده یک *object* نیز هست.
* برای برخی از انواع منابع، API شامل یک یا چند *sub-resources* است که به صورت مسیرهای URI در زیر منبع نمایش داده می‌شوند.


اکثر انواع منابع API Kubernetes عبارتند از
{{< glossary_tooltip text="objects" term_id="object" >}} -
آنها نمونه‌ای عینی از یک مفهوم در خوشه، مانند یک پاد یا فضای نام، را نشان می‌دهند. تعداد کمتری از انواع منابع API *مجازی* هستند، به این معنی که اغلب عملیات روی اشیاء را نشان می‌دهند، نه اشیاء، مانند
بررسی مجوز
(از یک POST با بدنه کدگذاری شده JSON از `SubjectAccessReview` به منبع `subjectaccessreviews` استفاده کنید)، یا زیرمنبع `eviction` یک پاد
(برای فعال کردن `[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)) استفاده می‌شود.

### نام اشیاء

تمام اشیایی که می‌توانید از طریق API ایجاد کنید، یک شیء منحصر به فرد دارند. {{< glossary_tooltip text="name" term_id="name" >}} تا امکان ایجاد و بازیابی idempotent فراهم شود، به جز اینکه انواع منابع مجازی اگر قابل بازیابی نباشند یا به idempotency متکی نباشند، ممکن است نام‌های منحصر به فردی نداشته باشند.
در یک {{< glossary_tooltip text="namespace" term_id="namespace" >}}، فقط یک شیء از یک نوع معین می‌تواند در یک زمان نام مشخصی داشته باشد. با این حال، اگر شیء را حذف کنید، می‌توانید یک شیء جدید با همان نام ایجاد کنید. برخی از اشیاء فضای نام ندارند (به عنوان مثال: گره‌ها)، و بنابراین نام آنها باید در کل خوشه منحصر به فرد باشد.

### API verbs

تقریباً همه انواع منابع شیء از افعال استاندارد HTTP پشتیبانی می‌کنند - GET، POST، PUT، PATCH و DELETE. کوبرنتیز همچنین از افعال خاص خود استفاده می‌کند که اغلب با حروف کوچک نوشته می‌شوند تا آنها را از افعال HTTP متمایز کند.
کوبرنتیز از اصطلاح **list** برای توصیف عمل بازگرداندن یک [collection](#collections) از منابع استفاده می‌کند تا آن را از بازیابی یک منبع واحد که معمولاً **get** نامیده می‌شود، متمایز کند. اگر یک درخواست HTTP GET با پارامتر پرس و جو `?watch` ارسال کرده‌اید، کوبرنتیز آن را **watch** می‌نامد و نه **get**
(برای جزئیات بیشتر به [Efficient detection of changes](#efficient-detection-of-changes) مراجعه کنید).
برای درخواست‌های PUT، کوبرنتیز به صورت داخلی این درخواست‌ها را بر اساس وضعیت شیء موجود به **create** یا **update** طبقه‌بندی می‌کند. **update** با **patch** متفاوت است. فعل HTTP برای **پچ**، PATCH است.

## Resource URIs

همه انواع منابع یا توسط خوشه (`/apis/GROUP/VERSION/*`) یا در یک فضای نام (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`) محدود می‌شوند. یک نوع منبع با فضای نام، هنگام حذف فضای نام آن حذف می‌شود و دسترسی به آن نوع منبع توسط بررسی‌های مجوز در محدوده فضای نام کنترل می‌شود.
توجه: منابع اصلی به جای `/apis` از `/api` استفاده می‌کنند و بخش مسیر GROUP را حذف می‌کنند.

مثال ها:

* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`

همچنین می‌توانید به مجموعه‌ای از منابع دسترسی داشته باشید (برای مثال: فهرست کردن تمام گره‌ها). مسیرهای زیر برای بازیابی مجموعه‌ها و منابع استفاده می‌شوند:

* Cluster-scoped منابع:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` - مجموعه‌ای از منابع از نوع منبع را برمی‌گرداند
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` - منبع را با نام NAME تحت نوع منبع برگردانید

* Namespace-scoped منابع:
  بازگرداندنمجموعه‌ای از تمام نمونه‌های نوع منبع در NAMESPACE
  * `GET /apis/GROU /VERSION/RESOURCETYPE` - مجموعه تمام نمونه‌های نوع منبع را در تمام namespaces برمی‌گرداند

  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` - بازگرداندنمجموعه‌ای از تمام نمونه‌های نوع منبع در NAMESPACE
                
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` - نمونه‌ای از نوع منبع را به همراه نام در NAMESPACE (NAME) برمی‌گرداند.
 
از آنجایی که یک فضای نام یک نوع منبع با محدوده خوشه است، می‌توانید لیست ("مجموعه") تمام  namespaces را با `GET /api/v1/namespaces` و جزئیات مربوط به یک فضای نام خاص را با `GET /api/v1/namespaces/NAME` بازیابی کنید.



* Cluster-scoped منبع فرعی: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Namespace-scoped منبع فرعی: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

افعال پشتیبانی شده برای هر زیرمنبع بسته به شیء متفاوت خواهد بود. -
برای اطلاعات بیشتر به [API reference](/docs/reference/kubernetes-api/) مراجعه کنید.
دسترسی به زیرمنابع در چندین منبع امکان‌پذیر نیست - در صورت لزوم، معمولاً از یک نوع منبع مجازی جدید استفاده می‌شود.


## HTTP media انواع {#alternate-representations-of-resources}

Kubernetes از طریق HTTP از رمزگذاری‌های JSON و Protobuf wire پشتیبانی می‌کند.

به طور پیش‌فرض، Kubernetes اشیاء را در [JSON serialization](#json-encoding) با استفاده از نوع رسانه‌ی application/json برمی‌گرداند. اگرچه JSON پیش‌فرض است، کلاینت‌ها می‌توانند پاسخ را در YAML درخواست کنند، یا از باینری کارآمدتر [Protobuf representation](#protobuf-encoding) برای عملکرد بهتر در مقیاس بزرگ استفاده کنند.


رابط برنامه‌نویسی کاربردی Kubernetes، مذاکره‌ی نوع محتوای استاندارد HTTP را پیاده‌سازی می‌کند: ارسال یک هدر «پذیرش» به همراه یک فراخوانی `GET` از سرور درخواست می‌کند که پاسخی با نوع رسانه‌ی دلخواه شما برگرداند. اگر می‌خواهید یک شیء در Protobuf را برای درخواست `PUT` یا `POST` به سرور ارسال کنید، باید هدر درخواست `Content-Type` را به طور مناسب تنظیم کنید.
اگر یک نوع رسانه‌ی موجود را درخواست کنید، سرور API پاسخی با نوع محتوای مناسب برمی‌گرداند؛ اگر هیچ یک از `Content-Type` درخواستی شما پشتیبانی نشود، سرور API پیام خطای 406 Not accepted را برمی‌گرداند.
تمام انواع منابع داخلی از نوع رسانه‌ی `application/json` پشتیبانی می‌کنند.

### JSON رمزگذاری منابع {#json-encoding}

API کوبرنتیز به طور پیش‌فرض از [JSON](https://www.json.org/json-en.html) برای رمزگذاری بدنه پیام‌های HTTP استفاده می‌کند.


به عنوان مثال:

1. فهرست کردن تمام پادهای (pods) موجود در یک خوشه، بدون مشخص کردن قالب دلخواه

   ```
   GET /api/v1/pods
   ```

   ```
   200 OK
   Content-Type: application/json

   … JSON encoded collection of Pods (PodList object)
   ```

1. با ارسال JSON به سرور و درخواست پاسخ JSON، یک پاد ایجاد کنید.

   ```
   POST /api/v1/namespaces/test/pods
   Content-Type: application/json
   Accept: application/json
   … JSON encoded Pod object
   ```

   ```
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     …
   }
   ```

### YAML رمزگذاری منابع {#yaml-encoding}

کوبرنتیز همچنین از نوع رسانه [`application/yaml`](https://www.rfc-editor.org/rfc/rfc9512.html) برای درخواست‌ها و پاسخ‌ها پشتیبانی می‌کند. [`YAML`](https://yaml.org/) می‌تواند برای تعریف مانیفست‌های کوبرنتیز و تعاملات API استفاده شود.


به عنوان مثال:

1. لیست کردن تمام پادهای (pods) یک خوشه با فرمت YAML

   ```
   GET /api/v1/pods
   Accept: application/yaml
   ```
   
   ```
   200 OK
   Content-Type: application/yaml

   … YAML encoded collection of Pods (PodList object)
   ```

1. با ارسال داده‌های کدگذاری شده با YAML به سرور و درخواست پاسخ YAML، یک پاد ایجاد کنید:

   ```
   POST /api/v1/namespaces/test/pods
   Content-Type: application/yaml
   Accept: application/yaml
   … YAML encoded Pod object
   ```

   ```
   200 OK
   Content-Type: application/yaml

   apiVersion: v1
   kind: Pod
   metadata:
     name: my-pod
     …
   ```

### Kubernetes رمزگذاری پروتوباف {#protobuf-encoding}

این پوشش با یک عدد جادویی ۴ بایتی شروع می‌شود تا به شناسایی محتوای موجود در دیسک یا در etcd به عنوان Protobuf کمک کند (برخلاف JSON). داده‌های عدد جادویی ۴ بایتی با یک پیام پوشش رمزگذاری شده Protobuf دنبال می‌شوند که رمزگذاری و نوع شیء اصلی را توصیف می‌کند. در پیام پوشش Protobuf، داده‌های شیء داخلی با استفاده از فیلد `raw` از Unknown ثبت می‌شوند (برای جزئیات بیشتر به [IDL](#protobuf-encoding-idl) مراجعه کنید).


به عنوان مثال:


1. تمام پادهای (pods) موجود در یک خوشه را در قالب Protobuf فهرست کنید.

   ```
   GET /api/v1/pods
   Accept: application/vnd.kubernetes.protobuf
   ```

   ```
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   … JSON encoded collection of Pods (PodList object)
   ```

1. با ارسال داده‌های رمزگذاری شده Protobuf به سرور، یک پاد ایجاد کنید، اما پاسخ را در قالب JSON درخواست کنید.


   ```
   POST /api/v1/namespaces/test/pods
   Content-Type: application/vnd.kubernetes.protobuf
   Accept: application/json
   … binary encoded Pod object
   ```

   ```
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     ...
   }
   ```

شما می‌توانید هر دو تکنیک را با هم استفاده کنید و از کدگذاری Protobuf کوبرنتیز برای تعامل با هر API که از آن پشتیبانی می‌کند، چه برای خواندن و چه برای نوشتن، استفاده کنید. فقط برخی از انواع منابع API با Protobuf سازگار هستند (#protobuf-encoding-compatibility).

<a id="protobuf-encoding-idl" />

قالب بسته‌بندی به صورت زیر است:

```
یک پیشوند عدد جادویی چهار بایتی:
  Bytes 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

یک پیام Protobuf کدگذاری شده با IDL زیر:
  message Unknown {
    // typeMeta should have the string values for "kind" and "apiVersion" as set on the JSON object
    optional TypeMeta typeMeta = 1;

    // raw will hold the complete serialized object in protobuf. See the protobuf definitions in the client libraries for a given kind.
    optional bytes raw = 2;

    // contentEncoding is encoding used for the raw data. Unspecified means no encoding.
    optional string contentEncoding = 3;

    // contentType is the serialization method used to serialize 'raw'. Unspecified means application/vnd.kubernetes.protobuf and is usually
    // omitted.
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion is the group/version for this type
    optional string apiVersion = 1;
    // kind is the name of the object schema. A protobuf definition should exist for this object.
    optional string kind = 2;
  }
```

{{< note >}}
کلاینت‌هایی که پاسخی در `application/vnd.kubernetes.protobuf` دریافت می‌کنند که با پیشوند مورد انتظار مطابقت ندارد، باید پاسخ را رد کنند، زیرا نسخه‌های آینده ممکن است نیاز به تغییر قالب سریال‌سازی به روشی ناسازگار داشته باشند و این کار را با تغییر پیشوند انجام خواهند داد.
{{< /note >}}

#### سازگاری با Kubernetes Protobuf {#protobuf-encoding-compatibility}

همه انواع منابع API از کدگذاری Protobuf کوبرنتیز پشتیبانی نمی‌کنند؛ به طور خاص، Protobuf برای منابعی که به صورت {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} تعریف شده‌اند یا از طریق {{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}} ارائه می‌شوند، در دسترس نیست.

به عنوان یک کلاینت، اگر نیاز به کار با انواع افزونه‌ها دارید، باید چندین نوع محتوا را در هدر درخواست `accept` مشخص کنید تا از JSON پشتیبانی شود. برای مثال:

```
Accept: application/vnd.kubernetes.protobuf, application/json
```

### CBOR رمزگذاری منابع {#cbor-encoding}

{{< feature-state feature_gate_name="CBORServingAndStorage" >}}

با فعال بودن `CBORServingAndStorage` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)، بدنه‌های درخواست و پاسخ برای همه انواع منابع داخلی و همه منابع تعریف شده توسط یک {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} می‌توانند به فرمت داده دودویی [CBOR](https://www.rfc-editor.org/rfc/rfc8949)) کدگذاری شوند. CBOR همچنین در {{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}} پشتیبانی می‌شود، اگر در سرورهای API تجمیع شده جداگانه فعال باشد.

کلاینت‌ها باید نوع رسانه IANA `application/cbor` را در سربرگ درخواست HTTP `Content-Type` مشخص کنند، زمانی که بدنه درخواست شامل یک آیتم داده کدگذاری شده CBOR [encoded data item](https://www.rfc-editor.org/rfc/rfc8949.html#section-1.2-4.2) باشد، و در سربرگ درخواست HTTP `Accept`، زمانی که آماده پذیرش یک آیتم داده کدگذاری شده CBOR در پاسخ هستند. سرورهای API از `application/cbor` در سربرگ پاسخ HTTP `Content-Type` استفاده می‌کنند، زمانی که بدنه پاسخ شامل یک شیء کدگذاری شده CBOR باشد.

اگر یک سرور API پاسخ خود به یک [watch request](#efficient-detection-of-changes) را با استفاده از CBOR کدگذاری کند، `Content-Type` یک [CBOR Sequence](https://www.rfc-editor.org/rfc/rfc8742) خواهد بود و هدر پاسخ HTTP از نوع رسانه IANA `application/cbor-seq` استفاده خواهد کرد. هر ورودی از این توالی (در صورت وجود) یک رویداد watch کدگذاری شده توسط CBOR است.


علاوه بر نوع رسانه‌ی موجود `application/apply-patch+yaml` برای YAML-encoded
[server-side apply configurations](#patch-and-apply)، سرورهای API که CBOR را فعال می‌کنند، نوع رسانه‌ی `application/apply-patch+cbor` را برای پیکربندی‌های CBOR-encoded CBOR می‌پذیرند. هیچ معادل CBOR پشتیبانی‌شده‌ای برای `application/json-patch+json` یا `application/merge-patch+json` یا `application/strategic-merge-patch+json` وجود ندارد.

## تشخیص کارآمد تغییرات

رابط برنامه‌نویسی کاربردی Kubernetes به کلاینت‌ها اجازه می‌دهد تا یک درخواست اولیه برای یک شیء یا یک مجموعه ارسال کنند و سپس تغییرات را از زمان درخواست اولیه پیگیری کنند: یک **watch**. کلاینت‌ها می‌توانند یک **list** یا **get** ارسال کنند و سپس یک درخواست **watch** پیگیری ارسال کنند.

برای امکان‌پذیر کردن این ردیابی تغییرات، هر شیء Kubernetes یک فیلد `resourceVersion` دارد که نشان‌دهنده نسخه آن منبع ذخیره شده در لایه پایداری زیرین است. هنگام بازیابی مجموعه‌ای از منابع (اعم از فضای نام یا محدوده خوشه‌ای)، پاسخ از سرور API حاوی یک مقدار `resourceVersion` است. کلاینت می‌تواند از آن `resourceVersion` برای شروع یک **watch** در برابر سرور API استفاده کند.



وقتی یک درخواست **watch** ارسال می‌کنید، سرور API با جریانی از تغییرات پاسخ می‌دهد. این تغییرات، نتیجه عملیات‌هایی (مانند **create**، **delete** و **update**) را که پس از `resourceVersion` که به عنوان پارامتر به درخواست **watch** مشخص کرده‌اید، رخ داده‌اند، به صورت جزء به جزء مشخص می‌کنند. مکانیسم کلی **watch** به کلاینت اجازه می‌دهد تا وضعیت فعلی را دریافت کرده و سپس در تغییرات بعدی مشترک شود، بدون اینکه هیچ رویدادی را از دست بدهد.

اگر اتصال یک کلاینت **watch** قطع شود، آن کلاینت می‌تواند یک **watch** جدید را از آخرین `resourceVersion` برگردانده شده شروع کند؛ کلاینت همچنین می‌تواند یک درخواست **get** / **list** جدید انجام دهد و دوباره شروع کند. برای جزئیات بیشتر به [Resource Version Semantics](#resource-versions) مراجعه کنید.

به عنوان مثال:

1. تمام پادهای (pods) موجود در یک فضای نام مشخص را فهرست کنید.

   ```http
   GET /api/v1/namespaces/test/pods
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {"resourceVersion":"10245"},
     "items": [...]
   }
   ```

2. با شروع از نسخه منبع ۱۰۲۴۵، اعلان‌هایی از هرگونه عملیات API (مانند **create**، **delete**، **patch** یا **update**) که بر پادها در فضای نام _test_ تأثیر می‌گذارند، دریافت کنید. 
(به صورت `application/json` ارائه می‌شود) شامل مجموعه‌ای از اسناد JSON است.

   ```http
   GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245
   ---
   200 OK
   Transfer-Encoding: chunked
   Content-Type: application/json

   {
     "type": "ADDED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
   }
   {
     "type": "MODIFIED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "11020", ...}, ...}
   }
   ...
   ```

یک سرور Kubernetes مشخص فقط یک رکورد تاریخی از تغییرات را برای مدت زمان محدودی حفظ می‌کند. خوشهها  که از etcd 3 استفاده می‌کنند، به طور پیش‌فرض تغییرات 5 دقیقه گذشته را حفظ می‌کنند.
هنگامی که عملیات درخواستی **watch** به دلیل در دسترس نبودن نسخه تاریخی آن منبع با شکست مواجه می‌شود، کلاینت‌ها باید با شناسایی کد وضعیت `410 Gone`، پاک کردن حافظه پنهان محلی خود، انجام یک عملیات **get** یا **list** جدید، و شروع **watch** از `resourceVersion` که بازگردانده شده است، این مورد را مدیریت کنند.


برای عضویت در مجموعه‌ها، کتابخانه‌های کلاینت Kubernetes معمولاً نوعی ابزار استاندارد برای این منطق **list**-سپس-**watch** ارائه می‌دهند. (در کتابخانه کلاینت Go، این ابزار `Reflector` نامیده می‌شود و در بسته `k8s.io/client-go/tools/cache` قرار دارد.)


### تماشای نشانک ها {#watch-bookmarks}

برای کاهش تأثیر پنجره تاریخچه کوتاه، API کوبرنتیز یک رویداد watch به نام `BOOKMARK` ارائه می‌دهد. این نوع خاصی از رویداد است که نشان می‌دهد همه تغییرات تا `resourceVersion` داده شده که کلاینت درخواست می‌کند، قبلاً ارسال شده‌اند. سندی که رویداد `BOOKMARK` را نشان می‌دهد، از نوع درخواست شده توسط درخواست است، اما فقط شامل یک فیلد `.metadata.resourceVersion` است. به عنوان مثال:


```http
GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245&allowWatchBookmarks=true
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
}
...
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "12746"} }
}
```

به عنوان یک کلاینت، می‌توانید رویدادهای `BOOKMARK` را با تنظیم پارامتر کوئری `allowWatchBookmarks=true` به یک درخواست **watch** درخواست کنید، اما نباید فرض کنید که بوکمارک‌ها در هر بازه زمانی خاصی بازگردانده می‌شوند، و کلاینت‌ها نیز نمی‌توانند فرض کنند که سرور API حتی در صورت درخواست، هر رویداد `BOOKMARK` را ارسال خواهد کرد.


## لیست های جریانی

{{< feature-state feature_gate_name="WatchList" >}}

در خوشه های  بزرگ، بازیابی مجموعه‌ای از برخی از انواع منابع ممکن است منجر به افزایش قابل توجه استفاده از منابع (عمدتاً RAM) در control plane. شود.
برای کاهش تأثیر و ساده‌سازی تجربه کاربری الگوی **list** + **watch**، Kubernetes نسخه ۱.۳۲ ویژگی‌ای را که امکان درخواست وضعیت اولیه
(که قبلاً از طریق درخواست **list** درخواست می‌شد) را به عنوان بخشی از درخواست **watch** فراهم می‌کند، به نسخه بتا ارتقا می‌دهد.


در سمت کلاینت، می‌توان با تعیین `sendInitialEvents=true` به عنوان پارامتر رشته پرس‌وجو در یک درخواست **watch**، وضعیت اولیه را درخواست کرد. در صورت تنظیم، سرور API، جریان watch را با رویدادهای init مصنوعی (از نوع `ADDED`) برای ساخت کل وضعیت همه اشیاء موجود و به دنبال آن یک رویداد `[`BOOKMARK`](/docs/reference/using-api/api-concepts/#watch-bookmarks)` (در صورت درخواست از طریق گزینه `allowWatchBookmarks=true`) آغاز می‌کند. رویداد bookmark شامل نسخه منبعی است که با آن همگام‌سازی شده است. پس از ارسال رویداد bookmark، سرور API مانند هر درخواست **watch** دیگری ادامه می‌دهد.


وقتی در رشته پرس‌وجو مقدار `sendInitialEvents=true` را تنظیم می‌کنید، Kubernetes همچنین از شما می‌خواهد که مقدار `resourceVersionMatch` را روی `NotOlderThan` تنظیم کنید.
اگر `resourceVersion` را در رشته پرس‌وجو بدون ارائه مقداری ارائه دهید یا اصلاً آن را ارائه ندهید، این به عنوان درخواستی برای _consistent read_ تفسیر می‌شود.
رویداد bookmark زمانی ارسال می‌شود که state حداقل تا لحظه شروع خواندن مداوم از زمانی که درخواست شروع به پردازش می‌کند، همگام‌سازی شود. اگر `resourceVersion` را (در رشته پرس‌وجو) مشخص کنید،
رویداد bookmark زمانی ارسال می‌شود که state حداقل با نسخه منبع ارائه شده همگام‌سازی شود.

### مثال {#example-streaming-lists}

یک مثال: شما می‌خواهید مجموعه‌ای از پادها را زیر نظر بگیرید. برای آن مجموعه، نسخه فعلی منبع 10245 است و دو پاد وجود دارد: `foo` و `bar`. سپس ارسال درخواست زیر (که به صراحت درخواست _consistent read_ با تنظیم نسخه خالی منبع با استفاده از `resourceVersion=` را می‌دهد) می‌تواند منجر به توالی رویدادهای زیر شود:

در توالی رویدادهای زیر:

```http
GET /api/v1/namespaces/test/pods?watch=1&sendInitialEvents=true&allowWatchBookmarks=true&resourceVersion=&resourceVersionMatch=NotOlderThan
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "8467", "name": "foo"}, ...}
}
{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "5726", "name": "bar"}, ...}
}
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10245"} }
}
...
<followed by regular watch stream starting from resourceVersion="10245">
```

## فشرده سازی پاسخ 

{{< feature-state feature_gate_name="APIResponseCompression" >}}


`APIResponseCompression` گزینه‌ای است که به سرور API اجازه می‌دهد پاسخ‌ها را برای درخواست‌های **get** و **list** فشرده کند، پهنای باند شبکه را کاهش دهد و عملکرد خوشه های  بزرگ را بهبود بخشد
این قابلیت به طور پیش‌فرض از Kubernetes 1.16 فعال شده است و می‌توان آن را با قرار دادن `APIResponseCompression=false` در فلگ `--feature-gates` در سرور API غیرفعال کرد.



فشرده‌سازی پاسخ API می‌تواند به طور قابل توجهی اندازه پاسخ را کاهش دهد، به خصوص برای منابع بزرگ یا [collections](/docs/reference/using-api/api-concepts/#collections).
به عنوان مثال، یک درخواست **list** برای پادها می‌تواند صدها کیلوبایت یا حتی مگابایت داده را برگرداند، بسته به تعداد پادها و ویژگی‌های آنها. با فشرده‌سازی پاسخ، می‌توان پهنای باند شبکه را ذخیره کرد و تأخیر را کاهش داد.


برای تأیید اینکه آیا `APIResponseCompression` کار می‌کند، می‌توانید یک درخواست **get** یا **list** به سرور API با هدر `Accept-Encoding` ارسال کنید و اندازه و هدرهای پاسخ را بررسی کنید. برای مثال:

```http
GET /api/v1/pods
Accept-Encoding: gzip
---
200 OK
Content-Type: application/json
content-encoding: gzip
...
```

هدر `content-encoding` نشان می‌دهد که پاسخ با «gzip» فشرده شده است.

## بازیابی مجموعه نتایج بزرگ به صورت تکه تکه 

{{< feature-state feature_gate_name="APIListChunking" >}}

در خوشه‌های بزرگ، بازیابی مجموعه‌ای از برخی از انواع منابع ممکن است منجر به پاسخ‌های بسیار بزرگی شود که می‌تواند سرور و کلاینت را تحت تأثیر قرار دهد. به عنوان مثال، یک خوشه  ممکن است ده‌ها هزار Pod داشته باشد که هر کدام معادل تقریباً 2 کیلوبایت JSON کدگذاری شده هستند. بازیابی همه Podها در تمام فضاهای نام ممکن است منجر به پاسخ بسیار بزرگی (10-20 مگابایت) شود و مقدار زیادی از منابع سرور را مصرف کند.

سرور Kubernetes API از قابلیت تقسیم یک درخواست جمع‌آوری بزرگ به بخش‌های کوچک‌تر پشتیبانی می‌کند، در حالی که ثبات کل درخواست حفظ می‌شود. هر بخش می‌تواند به صورت متوالی برگردانده شود که هم اندازه کل درخواست را کاهش می‌دهد و هم به کلاینت‌های کاربرمحور اجازه می‌دهد تا نتایج را به صورت تدریجی نمایش دهند تا پاسخگویی بهبود یابد.

شما می‌توانید از سرور API بخواهید که با ارائه یک مجموعه واحد با استفاده از صفحات (که Kubernetes آن را _chunks_ می‌نامد) یک **list** را مدیریت کند. برای بازیابی یک مجموعه واحد در تکه‌ها، دو پارامتر پرس‌وجو `limit` و `continue` در درخواست‌های مربوط به مجموعه‌ها پشتیبانی می‌شوند و یک فیلد پاسخ `continue` از تمام عملیات **list** در فیلد `metadata` مجموعه بازگردانده می‌شود. یک کلاینت باید حداکثر نتایجی را که مایل به دریافت در هر تکه است با `limit` مشخص کند و سرور تا منابع `limit` را در نتیجه برمی‌گرداند و در صورت وجود منابع بیشتر در مجموعه، مقدار `continue` را نیز لحاظ می‌کند.


به عنوان یک کلاینت API، می‌توانید این مقدار `continue` را در درخواست بعدی به سرور API ارسال کنید تا به سرور دستور دهید صفحه بعدی (_chunk_) از نتایج را برگرداند. با ادامه دادن تا زمانی که سرور مقدار خالی `continue` را برگرداند، می‌توانید کل مجموعه را بازیابی کنید.

مانند یک عملیات **watch**، توکن `continue` پس از مدت زمان کوتاهی (به طور پیش‌فرض ۵ دقیقه) منقضی می‌شود و در صورت عدم امکان بازگشت نتایج بیشتر، خطای `۴۱۰ Gone` را برمی‌گرداند. در این حالت، کلاینت باید از ابتدا شروع کند یا پارامتر `limit` را حذف کند.


برای مثال، اگر ۱۲۵۳ پاد روی خوشه وجود دارد و شما می‌خواهید تکه‌هایی از ۵۰۰ پاد را همزمان دریافت کنید، آن تکه‌ها را به صورت زیر درخواست کنید:


1. تمام پادهای یک خوشه را فهرست کنید و هر بار تا ۵۰۰ پاد بازیابی کنید.


   ```http
   GET /api/v1/pods?limit=500
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN",
       "remainingItemCount": 753,
       ...
     },
     "items": [...] // returns pods 1-500
   }
   ```

1. تماس قبلی را ادامه دهید و مجموعه بعدی ۵۰۰ پاد را بازیابی کنید.

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN_2",
       "remainingItemCount": 253,
       ...
     },
     "items": [...] // returns pods 501-1000
   }
   ```

1. تماس قبلی را ادامه دهید و مجموعه بعدی 253 پاد را بازیابی کنید.

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN_2
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "", // continue token is empty because we have reached the end of the list
       ...
     },
     "items": [...] // returns pods 1001-1253
   }
   ```

توجه داشته باشید که `resourceVersion` (resourceVersion) مجموعه در هر درخواست ثابت می‌ماند، که نشان می‌دهد سرور یک تصویر لحظه‌ای ثابت از پادها (pods) به شما نشان می‌دهد. پادهایی که پس از نسخه `10245` ایجاد، به‌روزرسانی یا حذف می‌شوند، نمایش داده نمی‌شوند، مگر اینکه `یک درخواست **list** جداگانه بدون توکن `continue` ارسال کنید. این به شما امکان می‌دهد `درخواست‌های بزرگ را به بخش‌های کوچک‌تر تقسیم کنید و سپس عملیات **watch** را روی کل مجموعه انجام دهید، بدون اینکه هیچ به‌روزرسانی از دست برود.


«remainingItemCount» تعداد اقلام بعدی در مجموعه است که در این پاسخ لحاظ نشده‌اند. اگر درخواست **list** شامل برچسب یا فیلد {{< glossary_tooltip text="selectors" term_id="selector">}} باشد، تعداد اقلام باقی‌مانده ناشناخته است و سرور API فیلد `remainingItemCount` را در پاسخ خود لحاظ نمی‌کند. اگر **list** کامل باشد (یا به این دلیل که قطعه‌بندی نشده است، یا به این دلیل که این آخرین قطعه است)، دیگر اقلام باقی‌مانده وجود ندارد و سرور API فیلد `remainingItemCount` را در پاسخ خود لحاظ نمی‌کند. کاربرد مورد نظر `remainingItemCount` تخمین اندازه یک مجموعه است.


## مجموعه ها

در اصطلاحات کوبرنتیز، پاسخی که از یک **list** دریافت می‌کنید، یک _مجموعه_ است. با این حال، کوبرنتیز انواع مشخصی را برای مجموعه‌هایی از انواع مختلف منابع تعریف می‌کند. مجموعه‌ها دارای نوعی هستند که برای نوع منبع نامگذاری شده و `List` به آن اضافه شده است.
وقتی از API برای یک نوع خاص پرس و جو می‌کنید، تمام مواردی که توسط آن پرس و جو برگردانده می‌شوند، از آن نوع هستند. به عنوان مثال، وقتی خدمات را **list** می‌کنید، پاسخ مجموعه دارای `kind` است که روی [`ServiceList`](/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList); تنظیم شده است.
هر مورد در آن مجموعه نشان دهنده یک سرویس واحد است. به عنوان مثال:


```http
GET /api/v1/services
```

```yaml
{
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "2947301"
  },
  "items": [
    {
      "metadata": {
        "name": "kubernetes",
        "namespace": "default",
...
      "metadata": {
        "name": "kube-dns",
        "namespace": "kube-system",
...
```

ده‌ها نوع مجموعه (مانند `PodList`، `ServiceList` و `NodeList`) در API کوبرنتیز تعریف شده‌اند. می‌توانید اطلاعات بیشتری در مورد هر نوع مجموعه را از مستندات [Kubernetes API](/docs/reference/kubernetes-api/) دریافت کنید.


برخی ابزارها، مانند `kubectl`، مکانیسم جمع‌آوری Kubernetes را کمی متفاوت از خود API Kubernetes نشان می‌دهند. از آنجا که خروجی `kubectl` ممکن است شامل پاسخ چندین عملیات **list** در سطح API باشد، `kubectl` لیستی از اقلام را با استفاده از `kind: List` نشان می‌دهد. به عنوان مثال:


```shell
kubectl get services -A -o yaml
```
```yaml
apiVersion: v1
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
items:
- apiVersion: v1
  kind: Service
  metadata:
    creationTimestamp: "2021-06-03T14:54:12Z"
    labels:
      component: apiserver
      provider: kubernetes
    name: kubernetes
    namespace: default
...
- apiVersion: v1
  kind: Service
  metadata:
    annotations:
      prometheus.io/port: "9153"
      prometheus.io/scrape: "true"
    creationTimestamp: "2021-06-03T14:54:14Z"
    labels:
      k8s-app: kube-dns
      kubernetes.io/cluster-service: "true"
      kubernetes.io/name: CoreDNS
    name: kube-dns
    namespace: kube-system
```

{{< note >}}
ه خاطر داشته باشید که API کوبرنتیز `kind` به نام `List` ندارد.
 یک جزئیات پیاده‌سازی داخلی سمت کلاینت برای پردازش مجموعه‌هایی است که ممکن است از انواع `List:kind` مختلف شیء باشند. از وابستگی به `List:kind` در اتوماسیون یا سایر کدها خودداری کنید.
{{< /note >}}

## دریافت منابع به صورت جداول


وقتی `kubectl get` را اجرا می‌کنید، قالب خروجی پیش‌فرض، یک نمایش جدولی ساده از یک یا چند نمونه از یک نوع منبع خاص است. در گذشته، کلاینت‌ها برای انجام لیست‌های ساده از اشیاء، ملزم به بازتولید جدول و توصیف خروجی پیاده‌سازی شده در `kubectl` بودند. چند محدودیت این رویکرد شامل منطق غیر بدیهی هنگام برخورد با اشیاء خاص است. علاوه بر این، انواع ارائه شده توسط تجمیع API یا منابع شخص ثالث در زمان کامپایل شناخته شده نیستند. این بدان معناست که پیاده‌سازی‌های عمومی باید برای انواعی که توسط کلاینت شناخته نمی‌شوند، وجود داشته باشد.

برای جلوگیری از محدودیت‌های احتمالی که در بالا توضیح داده شد، کلاینت‌ها می‌توانند نمایش جدولی اشیاء را درخواست کنند و جزئیات خاص چاپ را به سرور واگذار کنند. API کوبرنتیز مذاکره نوع محتوای استاندارد HTTP را پیاده‌سازی می‌کند: ارسال یک هدر `Accept` حاوی مقدار `application/json;as=Table;g=meta.k8s.io;v=v1` با فراخوانی `GET` از سرور درخواست می‌کند که اشیاء را در نوع محتوای جدول برگرداند.


برای مثال، تمام پادهای (pods) موجود در یک خوشه را در قالب جدول فهرست کنید.

```http
GET /api/v1/pods
Accept: application/json;as=Table;g=meta.k8s.io;v=v1
---
200 OK
Content-Type: application/json

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        ...
    ]
}
```
برای انواع منابع API که تعریف جدول سفارشی شناخته‌شده‌ای برای صفحه کنترل ندارند، سرور API یک پاسخ جدول پیش‌فرض را برمی‌گرداند که شامل فیلدهای `name` و `creationTimestamp` منبع است.

```http
GET /apis/crd.example.com/v1alpha1/namespaces/default/resources
---
200 OK
Content-Type: application/json
...

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        {
            "name": "Name",
            "type": "string",
            ...
        },
        {
            "name": "Created At",
            "type": "date",
            ...
        }
    ]
}
```

همه انواع منابع API از پاسخ جدول پشتیبانی نمی‌کنند؛ برای مثال، یک {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
ممکن است نگاشت‌های فیلد به جدول را تعریف نکند، و یک APIService که [extends the core Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
ممکن است اصلاً پاسخ‌های جدول را ارائه ندهد. اگر در حال پیاده‌سازی کلاینتی هستید که از اطلاعات جدول استفاده می‌کند و باید با همه انواع منابع، از جمله افزونه‌ها، کار کند، باید درخواست‌هایی ارسال کنید که چندین نوع محتوا را در هدر `Accept` مشخص کنند. برای مثال:

```
Accept: application/json;as=Table;g=meta.k8s.io;v=v1, application/json
```

## حذف منابع

وقتی منبعی را **delete** می‌کنید، این کار در دو مرحله انجام می‌شود.


1. _finalization_
1. removal

```yaml
{
  "kind": "ConfigMap",
  "apiVersion": "v1",
  "metadata": {
    "finalizers": ["url.io/neat-finalization", "other-url.io/my-finalizer"],
    "deletionTimestamp": nil,
  }
}
```

وقتی یک کلاینت برای اولین بار یک **delete** برای درخواست حذف یک منبع ارسال می‌کند، `.metadata.deletionTimestamp` روی زمان فعلی تنظیم می‌شود.
پس از تنظیم `.metadata.deletionTimestamp`، کنترل‌کننده‌های خارجی که روی finalizerها عمل می‌کنند، می‌توانند کار پاکسازی خود را در هر زمان و به هر ترتیبی شروع کنند.

ترتیب بین نهایی‌کننده‌ها **not** نمی‌شود زیرا خطر قابل توجهی از گیر کردن `.metadata.finalizers` ایجاد می‌کند.

فیلد `.metadata.finalizers` مشترک است: هر عاملی که مجوز داشته باشد می‌تواند آن را دوباره مرتب کند.
اگر لیست نهایی‌ساز به ترتیب پردازش شود، این ممکن است منجر به وضعیتی شود که در آن مؤلفه مسئول اولین نهایی‌ساز در لیست
منتظر سیگنالی (مقدار فیلد، سیستم خارجی یا موارد دیگر) تولید شده توسط مؤلفه مسئول نهایی‌ساز در مراحل بعدی لیست باشد و در نتیجه بن‌بست ایجاد شود.

بدون ترتیب اجباری، نهایی‌سازها می‌توانند آزادانه بین خودشان مرتب شوند و در برابر تغییرات ترتیب در لیست آسیب‌پذیر نیستند.

پس از حذف آخرین نهایی‌ساز، منبع در واقع از etcd حذف می‌شود.

### حذف اجباری

{{< feature-state feature_gate_name="AllowUnsafeMalformedObjectDeletion" >}}

{{< caution >}}
این امر ممکن است حجم کاری مرتبط با حذف اجباری منبع را مختل کند، اگر به جریان حذف عادی متکی باشد، بنابراین ممکن است عواقبی از جمله خرابی خوشه  اعمال شود.
{{< /caution >}}


با فعال کردن گزینه حذف `ignoreStoreReadErrorWithClusterBreakingPotential`، کاربر می‌تواند عملیات **delete** ناامن یک منبع رمزگشایی نشده/خراب را انجام دهد. این گزینه پشت یک دروازه ویژگی ALPHA قرار دارد و به طور پیش‌فرض غیرفعال است. برای استفاده از این گزینه، اپراتور خوشه باید با تنظیم گزینه خط فرمان `--feature-gates=AllowUnsafeMalformedObjectDeletion=true`، این ویژگی را فعال کند.

{{< note >}}
کاربری که عملیات **delete** اجباری را انجام می‌دهد، باید مجوزهای لازم برای انجام هر دو فعل **delete** و خطاهای  **unsafe-delete-ignore-read-errors** را روی منبع داده شده داشته باشد.
{{< /note >}}

یک منبع در صورتی خراب تلقی می‌شود که به دلایل زیر نتوان آن را با موفقیت از حافظه بازیابی کرد:

- خطای تبدیل (برای مثال: خطای رمزگشایی)، یا
- شیء در رمزگشایی ناموفق بود.

سرور API ابتدا یک حذف معمولی را امتحان می‌کند و اگر با خطای _corrupt resource_ شکست بخورد، حذف اجباری را آغاز می‌کند. عملیات **delete** ناامن است زیرا محدودیت‌های finalizer را نادیده می‌گیرد و بررسی‌های پیش‌شرط را نادیده می‌گیرد.


مقدار پیش‌فرض برای این گزینه `false` است، این امر سازگاری با نسخه‌های قبلی را حفظ می‌کند.
برای درخواست **delete** با `ignoreStoreReadErrorWithClusterBreakingPotential` که روی `true` تنظیم شده باشد، فیلدهای `dryRun`، `gracePeriodSeconds`، `orphanDependents`، `preconditions` و `propagationPolicy` باید بدون تنظیم باقی بمانند.

{{< note >}}
اگر کاربر یک درخواست **delete** با مقدار `ignoreStoreReadErrorWithClusterBreakingPotential` روی `true` در یک منبع قابل خواندن دیگر ارسال کند، سرور API درخواست را با خطا لغو می‌کند.
{{< /note >}}

## API تک منبع

افعال API Kubernetes مانند **get**، **create**، **update**، **patch**، **delete** و **proxy** فقط از منابع تکی پشتیبانی می‌کنند. این افعال با پشتیبانی از یک منبع، از ارسال چندین منبع با هم در یک لیست یا تراکنش مرتب یا نامرتب پشتیبانی نمی‌کنند.


وقتی کلاینت‌ها (از جمله kubectl) روی مجموعه‌ای از منابع عمل می‌کنند، کلاینت مجموعه‌ای از درخواست‌های API تک‌منبعی را ارسال می‌کند و سپس در صورت نیاز، پاسخ‌ها را تجمیع می‌کند.


در مقابل، افعال **list** و **watch** در API کوبرنتیز امکان دریافت چندین منبع را فراهم می‌کنند و **deletecollection** امکان حذف چندین منبع را فراهم می‌کند.

## اعتبار سنجی میدانی


Kubernetes همیشه نوع فیلدها را اعتبارسنجی می‌کند. برای مثال، اگر فیلدی در API به عنوان عدد تعریف شده باشد، نمی‌توانید مقدار فیلد را به متن تغییر دهید. اگر فیلدی به عنوان آرایه‌ای از رشته‌ها تعریف شده باشد، فقط می‌توانید یک آرایه ارائه دهید. برخی از فیلدها به شما اجازه می‌دهند آنها را حذف کنید، برخی دیگر الزامی هستند. حذف یک فیلد الزامی از درخواست API یک خطا محسوب می‌شود.


اگر درخواستی با فیلد اضافی ارسال کنید، فیلدی که صفحه کنترل خوشه آن را تشخیص نمی‌دهد، رفتار سرور API پیچیده‌تر می‌شود.

به طور پیش‌فرض، سرور API فیلدهایی را که از ورودی دریافتی تشخیص نمی‌دهد (مثلاً بدنه JSON یک درخواست `PUT`) حذف می‌کند.

دو حالت وجود دارد که سرور API فیلدهایی را که شما در یک درخواست HTTP ارائه کرده‌اید، حذف می‌کند.

این موقعیت ها عبارتند از:


1. این فیلد به دلیل اینکه در طرح OpenAPI منبع نیست، شناسایی نشده است. (یک استثنا برای این مورد، {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}} است که صریحاً تصمیم می‌گیرند فیلدهای ناشناخته را از طریق `x-kubernetes-preserve-unknown-fields` حذف نکنند.)

1. فیلد در شیء کپی شده است.

### اعتبارسنجی برای فیلدهای ناشناخته یا تکراری {#setting-the-field-validation-level}

{{< feature-state feature_gate_name="ServerSideFieldValidation" >}}

از نسخه ۱.۲۵ به بعد، فیلدهای ناشناخته یا تکراری در یک شیء، از طریق اعتبارسنجی در سرور، هنگام استفاده از افعال HTTP که می‌توانند داده‌ها را ارسال کنند (`POST`، `PUT` و `PATCH`)، شناسایی می‌شوند. سطوح اعتبارسنجی ممکن عبارتند از `Ignore`، `Warn` (پیش‌فرض) و `Strict`.


  `Ignore`
: سرور API در مدیریت درخواست، همانطور که بدون تنظیم فیلدهای اشتباه انجام می‌داد، موفق می‌شود، تمام فیلدهای ناشناخته و تکراری را حذف می‌کند و هیچ نشانه‌ای از انجام این کار ارائه نمی‌دهد.

`Warn`
  : (پیش‌فرض) سرور API در مدیریت درخواست موفق می‌شود و یک هشدار به کلاینت گزارش می‌دهد. این هشدار با استفاده از هدر پاسخ `Warning:` ارسال می‌شود و برای هر فیلد ناشناخته یا تکراری، یک مورد هشدار اضافه می‌کند. برای اطلاعات بیشتر در مورد هشدارها و API Kubernetes، به مقاله وبلاگ مراجعه کنید.
  [Warning: Helpful Warnings Ahead](/blog/2020/09/03/warnings/).

`Strict`
سرور API در صورت تشخیص هرگونه فیلد ناشناخته یا تکراری، درخواست را با خطای 400 Bad Request رد می‌کند. پیام پاسخ از سرور API، تمام فیلدهای ناشناخته یا تکراری که سرور API شناسایی کرده است را مشخص می‌کند.

پارامتر پرس‌وجوی `fieldValidation` تنظیم می‌شود.

{{< note >}}
اگر درخواستی ارسال کنید که یک فیلد ناشناخته را مشخص می‌کند، و آن فیلد نیز به دلیل دیگری نامعتبر است (برای مثال، درخواست یک مقدار رشته‌ای ارائه می‌دهد در حالی که API برای یک فیلد شناخته شده انتظار یک عدد صحیح دارد)، سرور API با خطای 400 درخواست بد پاسخ می‌دهد، اما هیچ اطلاعاتی در مورد فیلدهای ناشناخته یا تکراری ارائه نمی‌دهد (فقط اینکه کدام خطای مهلک ابتدا با آن مواجه شده است).

در این حالت، صرف نظر از سطح اعتبارسنجی فیلدی که درخواست کرده‌اید، همیشه یک پاسخ خطا دریافت خواهید کرد.
{{< /note >}}

ابزارهایی که درخواست‌ها را به سرور ارسال می‌کنند (مانند `kubectl`)، ممکن است پیش‌فرض‌های خود را تنظیم کنند که با سطح اعتبارسنجی `Warn` که سرور API به طور پیش‌فرض از آن استفاده می‌کند، متفاوت است.

بزار `kubectl` از پرچم `--validate` برای تنظیم سطح اعتبارسنجی فیلد استفاده می‌کند. این ابزار مقادیر `ignore`، `warn` و `strict` را می‌پذیرد و در عین حال مقادیر `true` (معادل `strict`) و `false` (معادل `ignore`) را نیز می‌پذیرد. تنظیم اعتبارسنجی پیش‌فرض برای kubectl، `--validate=true` است که به معنای اعتبارسنجی دقیق فیلد در سمت سرور است.

وقتی kubectl نتواند با اعتبارسنجی فیلد به یک سرور API متصل شود (سرورهای API قبل از Kubernetes 1.27)، به استفاده از اعتبارسنجی سمت کلاینت روی می‌آورد. اعتبارسنجی سمت کلاینت در نسخه بعدی kubectl به طور کامل حذف خواهد شد.


{{< note >}}

قبل از Kubernetes 1.25، از `kubectl --validate` برای فعال یا غیرفعال کردن اعتبارسنجی سمت کلاینت به عنوان یک پرچم بولین استفاده می‌شد.


{{< /note >}}

## اجرا خشک 

{{< feature-state feature_gate_name="DryRun" >}}

وقتی از افعال HTTP که می‌توانند منابع را تغییر دهند (`POST`، `PUT`، `PATCH` و `DELETE`) استفاده می‌کنید، می‌توانید درخواست خود را در حالت _dry run_ ارسال کنید. حالت dry run به ارزیابی یک درخواست از طریق مراحل معمول درخواست (زنجیره پذیرش، اعتبارسنجی، ادغام تداخل‌ها) تا زمان ذخیره اشیاء در حافظه کمک می‌کند. بدنه پاسخ برای درخواست تا حد امکان شبیه به یک پاسخ غیر-dry run است. Kubernetes تضمین می‌کند که درخواست‌های-dry run در حافظه ذخیره نمی‌شوند یا عوارض جانبی دیگری ندارند.

### ساخت درخواست Dry-run

اجرای خشک (Dry-run) با تنظیم پارامتر پرس و جوی `dryRun` آغاز می‌شود. این پارامتر یک رشته است که به عنوان یک enum عمل می‌کند و تنها مقادیر پذیرفته شده عبارتند از:

[no value set]
: اجازه دادن به عوارض جانبی. شما این را با یک رشته پرس و جو مانند `?dryRun` یا `?dryRun&pretty=true` درخواست می‌کنید. پاسخ، شیء نهایی است که باید ذخیره می‌شد، یا اگر درخواست انجام نمی‌شد، یک خطا.

`All`
هر مرحله طبق روال عادی پیش می‌رود، به جز مرحله ذخیره‌سازی نهایی که از عوارض جانبی جلوگیری می‌شود

وقتی `?dryRun=All` را تنظیم می‌کنید، هرگونه {{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}
اجرا می‌شوند، کنترل‌کننده‌های اعتبارسنجی پذیرش، درخواست را پس از جهش بررسی می‌کنند، ادغام روی `PATCH` انجام می‌شود، فیلدها پیش‌فرض می‌شوند و اعتبارسنجی طرحواره رخ می‌دهد. تغییرات در حافظه اصلی ذخیره نمی‌شوند، اما شیء نهایی که باید ذخیره می‌شد، همچنان به همراه کد وضعیت عادی به کاربر بازگردانده می‌شود.

اگر نسخه غیر dry-run یک درخواست، یک کنترل‌کننده پذیرش را که دارای عوارض جانبی است، فعال کند، درخواست به جای ریسک یک عارضه جانبی ناخواسته، با شکست مواجه خواهد شد. همه افزونه‌های کنترل پذیرش داخلی از dry-run پشتیبانی می‌کنند. علاوه بر این، وب‌هوک‌های پذیرش می‌توانند در [configuration object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io) خود اعلام کنند که عوارض جانبی ندارند، با تنظیم فیلد `sideEffects` خود به `None`.


{{< note >}}
اگر یک وب‌هوک واقعاً عوارض جانبی داشته باشد، باید فیلد `sideEffects` روی "NoneOnDryRun" تنظیم شود. این تغییر مناسب است به شرطی که وب‌هوک نیز طوری اصلاح شود که فیلد `DryRun` در AdmissionReview را درک کند و از عوارض جانبی روی هر درخواستی که به عنوان dry run علامت‌گذاری شده است، جلوگیری کند.
{{< /note >}}

در اینجا یک مثال از درخواست dry-run که از `?dryRun=All` استفاده می‌کند، آورده شده است:

```http
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

پاسخ مشابه درخواست بدون اجرای خشک خواهد بود، اما مقادیر برخی از فیلدهای تولید شده ممکن است متفاوت باشد.


### ارزش های تولید شده

برخی از مقادیر یک شیء معمولاً قبل از ذخیره شدن شیء تولید می‌شوند. مهم است که به مقادیر این فیلدها که توسط یک درخواست اجرای آزمایشی تعیین می‌شوند، تکیه نکنید، زیرا این مقادیر احتمالاً در حالت اجرای آزمایشی با زمانی که درخواست واقعی ارائه می‌شود، متفاوت خواهند بود. برخی از این فیلدها عبارتند از:


* `name`: اگر `generateName` تنظیم شده باشد، `name` یک نام تصادفی منحصر به فرد خواهد داشت.
* `creationTimestamp` / `deletionTimestamp`: زمان ایجاد/حذف را ثبت می‌کند.
* `UID`:  [uniquely identifies](/docs/concepts/overview/working-with-objects/names/#uids)
شیء و به طور تصادفی تولید می‌شود (غیر قطعی)
* `resourceVersion`: نسخه پایدار شیء را ردیابی می‌کند.
* هر فیلدی که توسط یک کنترل‌کننده پذیرش جهش‌یافته تنظیم شده باشد.
* برای منبع `Service`: پورت‌ها یا آدرس‌های IP که kube-apiserver به اشیاء سرویس اختصاص می‌دهد.


### Dry-run مجوز

مجوز برای درخواست‌های dry-run و non-dry-run یکسان است. بنابراین، برای ارسال یک درخواست dry-run، باید مجاز به ارسال درخواست non-dry-run باشید.

به عنوان مثال، برای اجرای dry-run **patch** برای یک Deployment، باید مجاز به انجام آن **patch** باشید. در اینجا مثالی از یک قانون برای Kubernetes  {{< glossary_tooltip text="RBAC" term_id="rbac">}}آورده شده است که امکان patching را فراهم می‌کند.


```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

لینک ببینید  [Authorization Overview](/docs/reference/access-authn-authz/authorization/).

## به‌روزرسانی منابع موجود {#patch-and-apply}

Kubernetes روش‌های مختلفی برای به‌روزرسانی اشیاء موجود ارائه می‌دهد.
می‌توانید [choosing an update mechanism](#update-mechanism-choose) را مطالعه کنید تا بدانید کدام رویکرد ممکن است برای مورد استفاده شما بهترین باشد. 


شما می‌توانید یک منبع موجود - مثلاً یک ConfigMap - را با استفاده از HTTP PUT بازنویسی (**update**) کنید. برای یک درخواست PUT، وظیفه کلاینت است که «نسخه منبع» `resourceVersion` را مشخص کند (این را از شیء در حال به‌روزرسانی می‌گیرد). Kubernetes از اطلاعات `resourceVersion` استفاده می‌کند تا سرور API بتواند به‌روزرسانی‌های از دست رفته را تشخیص دهد و درخواست‌های ارسالی توسط کلاینتی که با خوشه قدیمی است را رد کند. در صورتی که منبع تغییر کرده باشد (نسخه منبعی که کلاینت ارائه می‌دهد قدیمی باشد)، سرور API پاسخ خطای `409 Conflict`  را برمی‌گرداند.

به جای ارسال درخواست PUT، کلاینت می‌تواند دستورالعملی را به سرور API ارسال کند تا یک منبع موجود را **patch** کند. یک **patch** معمولاً در صورتی مناسب است که تغییری که کلاینت می‌خواهد ایجاد کند، مشروط به داده‌های موجود نباشد.
کلاینت‌هایی که نیاز به تشخیص مؤثر به‌روزرسانی‌های از دست رفته دارند، باید در نظر داشته باشند که درخواست خود را مشروط به `resourceVersion` موجود (یا HTTP PUT یا HTTP PATCH) کنند،
و سپس هرگونه تلاش مجددی را که در صورت وجود تداخل لازم است، مدیریت کنند.

رابط برنامه‌نویسی کاربردی Kubernetes از چهار عملیات مختلف PATCH پشتیبانی می‌کند که توسط هدر HTTP `Content-Type` مربوط به آنها تعیین می‌شوند:


  `application/apply-patch+yaml`
: Server Side Apply YAML (یک افزونه مخصوص Kubernetes، مبتنی بر YAML).
تمام اسناد JSON، YAML معتبر هستند، بنابراین می‌توانید JSON را با استفاده از این نوع رسانه نیز ارسال کنید. برای جزئیات بیشتر به [Server Side Apply serialization](/docs/reference/using-api/server-side-apply/#serialization) مراجعه کنید.
برای Kubernetes، این یک عملیات **create** است اگر شیء وجود نداشته باشد، یا یک عملیات **patch** است اگر شیء از قبل وجود داشته باشد.

`application/json-patch+json`
: JSON Patch، همانطور که در [RFC6902](https://tools.ietf.org/html/rfc6902) تعریف شده است.
یک JSON patch دنباله ای از عملیات است که روی منبع اجرا می شوند؛ برای مثال `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`.
برای Kubernetes، این یک عملیات **patch** است.
  
یک **patch** با استفاده از `application/json-patch+json` می‌تواند شامل شرایطی برای اعتبارسنجی سازگاری باشد و در صورت عدم رعایت آن شرایط، عملیات با شکست مواجه شود (برای مثال، برای جلوگیری از از دست رفتن به‌روزرسانی).

`application/merge-patch+json`
: JSON Merge Patch، همانطور که در [RFC7386](https://tools.ietf.org/html/rfc7386) تعریف شده است.
یک JSON Merge Patch اساساً نمایش جزئی از منبع است.
JSON ارسالی با منبع فعلی ترکیب می‌شود تا یک منبع جدید ایجاد شود،
سپس منبع جدید ذخیره می‌شود.

برای Kubernetes، این یک عملیات **patch** است.

`application/strategic-merge-patch+json`
: Strategic Merge Patch (یک افزونه مخصوص Kubernetes مبتنی بر JSON).
Strategic Merge Patch یک پیاده‌سازی سفارشی از JSON Merge Patch است.
شما فقط می‌توانید از Strategic Merge Patch با APIهای داخلی یا با سرورهای API تجمیعی که پشتیبانی ویژه‌ای از آن دارند استفاده کنید. شما نمی‌توانید از
`application/strategic-merge-patch+json` با هر API
تعریف شده با استفاده از {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} استفاده کنید.
  
  {{< note >}}
  مکانیزم _server side apply_ در Kubernetes جایگزین Strategic Merge شده است.
  Patch.
  {{< /note >}}

ویژگی [Server Side Apply](/docs/reference/using-api/server-side-apply/) در Kubernetes به صفحه کنترل اجازه می‌دهد تا فیلدهای مدیریت‌شده برای اشیاء تازه ایجاد شده را ردیابی کند.
Server Side Apply الگوی روشنی برای مدیریت تداخل فیلدها ارائه می‌دهد، عملیات **apply** و **update** سمت سرور را ارائه می‌دهد و جایگزین عملکرد سمت کلاینت `kubectl apply` می‌شود.
For Server-Side Apply, Kubernetes treats the request as a **create** if the object
does not yet exist, and a **patch** otherwise. For other requests that use PATCH
at the HTTP level, the logical Kubernetes operation is always **patch**.


برای جزئیات بیشتر به [Server Side Apply](/docs/reference/using-api/server-side-apply/) مراجعه کنید.

### انتخاب یک مکانیزم به‌روزرسانی {#update-mechanism-choose}

#### HTTP PUT برای جایگزینی منبع موجود {#update-mechanism-update}

عملیات **update** (HTTP `PUT`) پیاده‌سازی ساده و انعطاف‌پذیری دارد، اما دارای معایبی است:

* شما باید تداخل‌هایی را که در آن‌ها `resourceVersion` شیء بین خواندن آن توسط کلاینت و تلاش برای نوشتن مجدد آن تغییر می‌کند، مدیریت کنید. کوبرنتیز همیشه تداخل را تشخیص می‌دهد، اما شما به عنوان نویسنده کلاینت باید تلاش‌های مجدد را پیاده‌سازی کنید.
* اگر یک شیء را به صورت محلی رمزگشایی کنید، ممکن است به طور تصادفی فیلدهایی را حذف کنید (برای مثال، با استفاده از client-go، می‌توانید فیلدهایی را دریافت کنید که کلاینت شما نمی‌داند چگونه با آنها برخورد کند - و سپس آنها را به عنوان بخشی از به‌روزرسانی خود حذف کنید).
* اگر اختلاف زیادی روی شیء وجود داشته باشد (حتی روی یک فیلد یا مجموعه‌ای از فیلدها که قصد ویرایش آنها را ندارید)، ممکن است در ارسال به‌روزرسانی با مشکل مواجه شوید. این مشکل برای اشیاء بزرگتر و اشیاء با فیلدهای زیاد، بدتر است.


#### وصله HTTP با استفاده از وصله JSON {#update-mechanism-json-patch}

به‌روزرسانی **patch** مفید است، زیرا:

* از آنجایی که فقط تفاوت‌ها را ارسال می‌کنید، داده‌های کمتری برای ارسال در درخواست `PATCH` دارید.
* شما می‌توانید تغییراتی ایجاد کنید که به مقادیر موجود متکی هستند، مانند کپی کردن مقدار یک فیلد خاص در یک حاشیه‌نویسی.


* برخلاف **update** (HTTP `PUT`)، اعمال تغییر می‌تواند بلافاصله انجام شود
حتی اگر تغییرات مکرری در فیلدهای نامرتبط وجود داشته باشد): معمولاً نیازی به تلاش مجدد نخواهید داشت.
* اگر می‌خواهید برای جلوگیری از گم شدن به‌روزرسانی‌ها، احتیاط بیشتری داشته باشید، ممکن است هنوز لازم باشد `resourceVersion` را مشخص کنید (برای مطابقت با یک شیء موجود).
* هنوز هم نوشتن منطق تلاش مجدد برای مواقع بروز خطا، تمرین خوبی است.
* شما می‌توانید از شرایط آزمایشی برای ایجاد دقیق شرایط به‌روزرسانی خاص استفاده کنید.
برای مثال، می‌توانید یک شمارنده را بدون خواندن آن افزایش دهید اگر مقدار موجود با آنچه انتظار دارید مطابقت داشته باشد. می‌توانید این کار را بدون خطر از دست دادن به‌روزرسانی انجام دهید،
حتی اگر شیء از آخرین باری که در آن نوشتید به روش‌های دیگری تغییر کرده باشد.
(اگر شرایط آزمایشی با شکست مواجه شد، می‌توانید به خواندن مقدار فعلی برگردید
و سپس عدد تغییر یافته را بنویسید).

با این حال:


* برای ساخت پچ به منطق محلی (کلاینت) بیشتری نیاز دارید؛ اگر پیاده‌سازی کتابخانه‌ای از JSON Patch داشته باشید، یا حتی برای ساخت یک JSON Patch مخصوصاً برای Kubernetes، خیلی مفید خواهد بود.

* به عنوان نویسنده نرم‌افزار کلاینت، هنگام ساخت پچ (بدنه درخواست HTTP) باید مراقب باشید که فیلدها را حذف نکنید (ترتیب عملیات مهم است).

#### وصله HTTP با استفاده از اعمال سمت سرور {#update-mechanism-server-side-apply}

Server-Side Apply مزایای واضحی دارد:


* یک رفت و برگشت: به ندرت پیش می‌آید که ابتدا نیاز به ارسال یک درخواست `GET` باشد.  * and you can still detect conflicts for unexpected changes
* در صورت لزوم، می‌توانید یک تداخل را به زور لغو کنید
* پیاده‌سازی‌های کلاینت به راحتی انجام می‌شوند.
* شما یک عملیات ایجاد یا به‌روزرسانی اتمی را بدون تلاش اضافی دریافت می‌کنید (شبیه به `UPSERT` در برخی از نسخه‌های SQL).


با این حال:

* تابع Server-Side Apply برای تغییرات فیلدهایی که به مقدار فعلی شیء وابسته هستند، به هیچ وجه کار نمی‌کند.
* شما فقط می‌توانید به‌روزرسانی‌ها را روی اشیاء اعمال کنید. برخی از منابع در Kubernetes HTTP API شیء نیستند (آنها فیلد `.metadata` ندارند) و Server-Side Apply فقط برای اشیاء Kubernetes مرتبط است.
## نسخه های منبع

نسخه‌های منابع رشته‌هایی هستند که نسخه داخلی یک شیء را در سرور مشخص می‌کنند. نسخه‌های منابع می‌توانند توسط کلاینت‌ها برای تعیین زمان تغییر اشیاء یا بیان الزامات سازگاری داده‌ها هنگام دریافت، فهرست‌بندی و مشاهده منابع استفاده شوند. نسخه‌های منابع باید توسط کلاینت‌ها به عنوان مبهم در نظر گرفته شوند و بدون تغییر به سرور بازگردانده شوند.


شما نباید فرض کنید که نسخه‌های منابع عددی یا قابل مقایسه هستند. کلاینت‌های API فقط می‌توانند دو نسخه منبع را برای برابری مقایسه کنند (این بدان معناست که شما نباید نسخه‌های منابع را برای روابط بزرگتر یا کوچکتر مقایسه کنید).

### `resourceVersion`فیلدها در فراداده {#resourceversion-in-metadata}

کلاینت‌ها نسخه‌های منبع را در منابع پیدا می‌کنند، از جمله منابع موجود در جریان پاسخ برای **watch**، یا هنگام استفاده از **list** برای شمارش منابع.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) - `metadata.resourceVersion` یک نمونه منبع، نسخه منبعی را که نمونه آخرین بار در آن تغییر یافته است، مشخص می‌کند.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) - `metadata.resourceVersion` یک مجموعه منبع (پاسخ به یک **list**) نسخه منبعی را که مجموعه در آن ساخته شده است، مشخص می‌کند.

### `resourceVersion` پارامترها در رشته‌های پرس‌وجو {#the-resourceversion-parameter}

عملیات‌های **get**، **list** و **watch** از پارامتر `resourceVersion` پشتیبانی می‌کنند.
از نسخه v1.19، سرورهای Kubernetes API همچنین از پارامتر `resourceVersionMatch` در درخواست‌های _list_ پشتیبانی می‌کنند.

سرور API بسته به عملیاتی که درخواست می‌کنید و مقدار `resourceVersion`، پارامتر `resourceVersion` را به طور متفاوتی تفسیر می‌کند. اگر `resourceVersionMatch` را تنظیم کنید، این امر بر نحوه‌ی تطبیق نیز تأثیر می‌گذارد.

### معناشناسی برای **get** and **list**

برای **get** و **list**، معانی `resourceVersion` به صورت زیر است:

**get:**

| نسخه منبع تنظیم نشده است | منبع نسخه="0" | منبع نسخه="{value other than 0}" |
|-----------------------|---------------------|----------------------------------------|
| به تازگی      | همگی                  | قدیمی تر نباشد از                         |

**لیست:**

از نسخه v1.19، سرورهای API Kubernetes از پارامتر `resourceVersionMatch` در درخواست‌های _list_ پشتیبانی می‌کنند. اگر هر دو `resourceVersion` و `resourceVersionMatch` را تنظیم کنید، پارامتر `resourceVersionMatch` نحوه تفسیر `resourceVersion` توسط سرور API را تعیین می‌کند.


شما همیشه باید هنگام تنظیم `resourceVersion` روی یک درخواست **list**، پارامتر `resourceVersionMatch` را تنظیم کنید. با این حال، آماده باشید تا مواردی را که سرور API که پاسخ می‌دهد از `resourceVersionMatch` بی‌اطلاع است و آن را نادیده می‌گیرد، مدیریت کنید.


مگر اینکه الزامات سازگاری قوی داشته باشید، استفاده از `resourceVersionMatch=NotOlderThan` و یک `resourceVersion` شناخته شده ترجیح داده می‌شود زیرا می‌تواند عملکرد و مقیاس‌پذیری بهتری را برای خوشه شما نسبت به عدم تنظیم `resourceVersion` و `resourceVersionMatch` که مستلزم ارائه حد نصاب خواندن است، به ارمغان بیاورد.


تنظیم پارامتر `resourceVersionMatch` بدون تنظیم `resourceVersion` معتبر نیست.

این جدول رفتار درخواست‌های **list** با ترکیب‌های مختلف `resourceVersion` و `resourceVersionMatch` را توضیح می‌دهد:


{{< table caption="resourceVersionMatch and paging parameters for list" >}}

| resourceVersionMatch param          | paging params                  | resourceVersion not set | resourceVersion="0" | resourceVersion="{value other than 0}" |
|-------------------------------------|--------------------------------|-------------------------|---------------------|----------------------------------------|
| _unset_                             | _limit unset_                  | Most Recent             | Any                 | Not older than                         |
| _unset_                             | limit=\<n\>, _continue unset_  | Most Recent             | Any                 | Exact                                  |
| _unset_                             | limit=\<n\>, continue=\<token\>| Continuation            | Continuation        | Invalid, HTTP `400 Bad Request`        |
| `resourceVersionMatch=Exact`        | _limit unset_                  | Invalid                 | Invalid             | Exact                                  |
| `resourceVersionMatch=Exact`        | limit=\<n\>, _continue unset_  | Invalid                 | Invalid             | Exact                                  |
| `resourceVersionMatch=NotOlderThan` | _limit unset_                  | Invalid                 | Any                 | Not older than                         |
| `resourceVersionMatch=NotOlderThan` | limit=\<n\>, _continue unset_  | Invalid                 | Any                 | Not older than                         |

{{< /table >}}

{{< note >}}
اگر سرور API خوشه شما پارامتر `resourceVersionMatch` را رعایت نکند، رفتار آن مشابه حالتی است که آن را تنظیم نکرده باشید.
{{< /note >}}

معنای معانی **get** و **list** به شرح زیر است:


Any
: داده‌ها را در هر نسخه منبعی برگردانید. جدیدترین نسخه منبع موجود ترجیح داده می‌شود، اما سازگاری قوی لازم نیست؛ داده‌ها در هر نسخه منبعی ممکن است ارائه شوند. این امکان وجود دارد که درخواست، داده‌ها را در نسخه منبعی بسیار قدیمی‌تر که کلاینت قبلاً مشاهده کرده است، به‌ویژه در پیکربندی‌های با دسترسی بالا، به دلیل پارتیشن‌ها یا حافظه‌های پنهان قدیمی، بازگرداند. کلاینت‌هایی که نمی‌توانند این را تحمل کنند، نباید از این مفهوم استفاده کنند.
همیشه از _watch cache_ ارائه می‌شود، که باعث بهبود عملکرد و کاهش بار etcd می‌شود.

جدیدترین
: داده‌ها را در جدیدترین نسخه منبع برگردانید. داده‌های برگشتی باید
سازگار باشند (به طور مفصل: از طریق یک خواندن حد نصاب از etcd ارائه می‌شوند).
برای etcd نسخه‌های ۳.۴.۳۱+ و ۳.۵.۱۳+، Kubernetes {{< skew currentVersion >}} "جدیدترین" خواندن‌ها را از _watch cache_ ارائه می‌دهد:
یک حافظه داخلی در حافظه در سرور API که وضعیت داده‌های
ذخیره شده در etcd را ذخیره و منعکس می‌کند. Kubernetes برای حفظ سازگاری حافظه پنهان در برابر
لایه ماندگاری etcd، درخواست اعلان پیشرفت می‌کند. Kubernetes نسخه‌های ۱.۲۸ تا ۱.۳۰ نیز از این ویژگی
پشتیبانی می‌کرد، اگرچه به عنوان آلفا برای تولید توصیه نمی‌شد و تا زمان انتشار v1.31 به طور پیش‌فرض فعال نبود.

قدیمی‌تر از
: داده‌هایی را برمی‌گرداند که حداقل به اندازه‌ی `resourceVersion` ارائه شده جدید باشند. جدیدترین داده‌های موجود ترجیح داده می‌شوند، اما هر داده‌ای که قدیمی‌تر از `resourceVersion` ارائه شده نباشد، می‌تواند ارائه شود. برای درخواست‌های **list** به سرورهایی که پارامتر `resourceVersionMatch` را رعایت می‌کنند، این پارامتر
تضمین می‌کند که `.metadata.resourceVersion` مجموعه قدیمی‌تر از `resourceVersion` درخواستی نباشد، اما هیچ تضمینی در مورد `.metadata.resourceVersion` هیچ یک از موارد موجود در آن مجموعه ارائه نمی‌دهد.
همیشه از _watch cache_ ارائه می‌شود و عملکرد را بهبود می‌بخشد و بار etcd را کاهش می‌دهد.

دقیق
: داده‌ها را دقیقاً مطابق با نسخه منبع ارائه شده برگردانید. اگر `resourceVersion` ارائه شده در دسترس نباشد، سرور با HTTP `410 Gone` پاسخ می‌دهد. برای درخواست‌های **list** به سرورهایی که پارامتر `resourceVersionMatch` را رعایت می‌کنند، این تضمین می‌کند که `.metadata.resourceVersion` مجموعه با `resourceVersion` درخواستی شما در رشته پرس و جو یکسان باشد. این تضمین برای `.metadata.resourceVersion` هیچ یک از موارد موجود در آن مجموعه اعمال نمی‌شود.
به طور پیش‌فرض از _etcd_ ارائه می‌شود، اما با فعال بودن دروازه ویژگی `ListFromCacheSnapshot`،
سرور API در صورت وجود، سعی می‌کند پاسخ را از snapshot ارائه دهد.
این کار عملکرد را بهبود می‌بخشد و بار etcd را کاهش می‌دهد. snapshotهای حافظه پنهان به طور پیش‌فرض به مدت 75 ثانیه نگهداری می‌شوند،
بنابراین اگر `resourceVersion` ارائه شده در دسترس نباشد، سرور به etcd مراجعه می‌کند.

ادامه
: صفحه بعدی داده‌ها را برای یک درخواست لیست صفحه‌بندی شده برگردانید، و از سازگاری با `resourceVersion` دقیق تعیین شده توسط درخواست اولیه در دنباله اطمینان حاصل کنید.
پاسخ به درخواست‌های **list** با محدودیت شامل _continue token_ است که `resourceVersion` و آخرین موقعیت مشاهده شده برای از سرگیری لیست را رمزگذاری می‌کند.
اگر `resourceVersion` در _continue token_ ارائه شده در دسترس نباشد، سرور با HTTP `410 Gone` پاسخ می‌دهد.
به طور پیش‌فرض از _etcd_ ارائه می‌شود، اما با فعال بودن دروازه ویژگی `ListFromCacheSnapshot`، سرور API در صورت وجود، سعی می‌کند پاسخ را از snapshot ارائه دهد.
این کار عملکرد را بهبود می‌بخشد و بار etcd را کاهش می‌دهد. snapshotهای حافظه پنهان به طور پیش‌فرض به مدت 75 ثانیه نگهداری می‌شوند،
بنابراین اگر `resourceVersion` در _continue token_ ارائه شده در دسترس نباشد، سرور به etcd مراجعه می‌کند.

{{< note >}}
وقتی منابع را **list** می‌کنید و یک پاسخ از مجموعه دریافت می‌کنید، پاسخ شامل
[list metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta)
آن مجموعه و همچنین
[object metadata](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta)
برای هر مورد در آن مجموعه می‌شود. برای اشیاء منفردی که در پاسخ یک مجموعه یافت می‌شوند،
`.metadata.resourceVersion` آخرین زمان به‌روزرسانی آن شیء را ردیابی می‌کند، و نه میزان به‌روز بودن شیء هنگام ارائه.
{{< /note >}}

هنگام استفاده از `resourceVersionMatch=NotOlderThan` و تنظیم محدودیت، کلاینت‌ها باید پاسخ‌های HTTP `410 Gone` را مدیریت کنند. برای مثال، کلاینت ممکن است با `resourceVersion` جدیدتر دوباره امتحان کند یا به `resourceVersion=""` برگردد.

هنگام استفاده از `resourceVersionMatch=Exact` و تنظیم نبودن `limit`، کلاینت‌ها باید تأیید کنند که `.metadata.resourceVersion` مجموعه با `resourceVersion` درخواستی مطابقت دارد و در صورت عدم تطابق، آن را مدیریت کنند. به عنوان مثال، کلاینت ممکن است به درخواستی با `limit` تنظیم شده، بازگردد.

### معناشناسی برای **watch**

برای **watch**، معانی نسخه منبع عبارتند از:

**watch:**

{{< table caption="resourceVersion for watch" >}}

| نسخه منبع تنظیم نشده است            | منبع نسخه="0"        | منبع نسخه="{value other than 0}" |
|-------------------------------------|----------------------------|----------------------------------------|
| دریافت وضعیت و شروع از جدیدترین  | دریافت وضعیت و شروع از هر نقطه | از دقیقاً شروع کنید
                         |

{{< /table >}}


معنی آن معانی **watch** عبارتند از:

دریافت وضعیت و شروع در هر
: شروع **watch** در هر نسخه منبع؛ جدیدترین نسخه منبع موجود ترجیح داده می‌شود، اما الزامی نیست. هر نسخه منبع شروع مجاز است. ممکن است **watch** از نسخه منبع بسیار قدیمی‌تری که کلاینت قبلاً مشاهده کرده است، به ویژه در پیکربندی‌های با دسترسی بالا، به دلیل پارتیشن‌ها یا حافظه‌های پنهان قدیمی، شروع شود. کلاینت‌هایی که نمی‌توانند این به عقب برگرداندن آشکار را تحمل کنند، نباید **watch** را با این معنا شروع کنند. برای ایجاد وضعیت اولیه، **watch** با رویدادهای مصنوعی "اضافه شده" برای تمام نمونه‌های منبعی که در نسخه منبع شروع وجود دارند، شروع می‌شود. تمام رویدادهای watch زیر برای تمام تغییراتی هستند که پس از نسخه منبعی که **watch** از آن شروع شده است، رخ داده‌اند.

  {{< caution >}}
**watches** که به این روش مقداردهی اولیه می‌شود، ممکن است داده‌های دلخواه و قدیمی را برگرداند. لطفاً قبل از استفاده از این روش معنایی، آن را بررسی کنید و در صورت امکان از روش‌های معنایی دیگر استفاده کنید.
  {{< /caution >}}

دریافت وضعیت و شروع از جدیدترین
: یک **watch** را در جدیدترین نسخه منبع شروع کنید، که باید سازگار باشد
(به طور مفصل: از طریق خواندن حد نصاب از etcd سرویس داده می‌شود). برای ایجاد وضعیت اولیه، **watch** با رویدادهای مصنوعی "Added" از تمام نمونه‌های منابعی که در نسخه منبع اولیه وجود دارند، آغاز می‌شود. تمام رویدادهای watch زیر برای تمام تغییراتی هستند که پس از نسخه منبعی که **watch** از آن شروع شده است، رخ داده‌اند.

شروع از دقیق
: یک **watch** را در یک resourceVersion دقیق شروع کنید. رویدادهای watch برای همه تغییرات
پس از resourceVersion  ارائه شده هستند. برخلاف «دریافت وضعیت و شروع در جدیدترین»
و «دریافت وضعیت و شروع در هر موردی»، **watch** با رویدادهای مصنوعی
«اضافه شده» برای resourceVersion ارائه شده شروع نمی‌شود. فرض بر این است که کلاینت از قبل
وضعیت اولیه را در نسخه منبع شروع دارد زیرا کلاینت

نسخه منبع را ارائه کرده است.

### "410 Gone" پاسخ 

سرورها ملزم به ارائه تمام نسخه‌های قدیمی‌تر منابع نیستند و ممکن است در صورت درخواست یک کلاینت برای `resourceVersion` قدیمی‌تر از نسخه‌ای که سرور نگه داشته است، کد وضعیت HTTP `410 (Gone)` را برگردانند. کلاینت‌ها باید بتوانند پاسخ‌های `410 (Gone)` را تحمل کنند. برای جزئیات بیشتر در مورد نحوه مدیریت پاسخ‌های  `410 (Gone)` هنگام مشاهده منابع، به [Efficient detection of changes](#efficient-detection-of-changes) مراجعه کنید.


اگر درخواست «نسخه منبع» `resourceVersion` را خارج از محدوده‌ی مجاز ارائه دهید، بسته به اینکه درخواست از حافظه‌ی پنهان (cache) ارائه شده باشد یا خیر، ممکن است سرور API با یک پاسخ HTTP با کد `410 Gone` پاسخ دهد.

###  در دسترس نبودن  resource versions

سرورها ملزم به ارائه نسخه‌های ناشناخته منابع نیستند. اگر شما **list** یا **get** نسخه‌ای از منابع را درخواست کنید که سرور API آن را نمی‌شناسد، سرور API ممکن است یکی از موارد زیر را انجام دهد:

* کمی صبر کنید تا نسخه منبع در دسترس قرار گیرد، سپس اگر نسخه‌های منبع ارائه شده در مدت زمان معقولی در دسترس قرار نگرفتند، با خطای `504 (Gateway Timeout)` تایم اوت کنید.

* با یک هدر پاسخ  `Retry-After` پاسخ دهید که نشان می‌دهد کلاینت چند ثانیه باید قبل از تلاش مجدد درخواست منتظر بماند.


اگر نسخه‌ای از منبع را درخواست کنید که یک سرور API آن را تشخیص ندهد، kube-apiserver علاوه بر این، پاسخ‌های خطای خود را با پیامی با عنوان `Too large resource version` مشخص می‌کند.

اگر درخواست **watch** برای یک نسخه منبع ناشناخته ارسال کنید، سرور API ممکن است به طور نامحدود (تا زمان انقضای درخواست) منتظر بماند تا نسخه منبع در دسترس قرار گیرد.
