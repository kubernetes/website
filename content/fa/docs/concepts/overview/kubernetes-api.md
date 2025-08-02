---
reviewers:
- xirehat
title: رابط برنامه‌نویسی کاربردی کوبرنتیز
content_type: concept
weight: 40
description: >
  رابط برنامه‌نویسی کاربردی کوبرنتیز (Kubernetes API) به شما امکان می‌دهد وضعیت اشیاء را در کوبرنتیز پرس‌وجو و دستکاری کنید. هسته صفحه کنترل کوبرنتیز، سرور API و HTTP API ارائه شده توسط آن است. کاربران، بخش‌های مختلف خوشه شما و اجزای خارجی، همگی از طریق سرور API با یکدیگر ارتباط برقرار می‌کنند.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

هسته {{< glossary_tooltip text="control plane" term_id="control-plane" >}} کوبرنتیز، {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} است. سرور API یک رابط HTTP را در دسترس قرار می‌دهد که امکان می‌دهد کاربران نهایی، بخش‌های مختلف خوشه شما و اجزای خارجی با یکدیگر ارتباط برقرار کنند.

رابط API کوبرنتیز به شما اجازه می‌دهد وضعیت اشیای API در کوبرنتیز (برای نمونه: ‌Podها، ‌Namespaceها، ‌ConfigMapها و Eventها) را پرس‌وجو کرده و دست‌کاری نمایید.

بیشتر عملیات را می‌توان از طریق رابط خط فرمان [kubectl](/docs/reference/kubectl/) یا ابزارهای خط فرمان دیگری مانند [kubeadm](/docs/reference/setup-tools/kubeadm/) که خود از API استفاده می‌کنند انجام داد. با این حال، می‌توانید با فراخوان‌های REST نیز به API دسترسی مستقیم داشته باشید. کوبرنتیز برای کسانی که قصد دارند با API کوبرنتیز برنامه بنویسند، مجموعه‌ای از [کتابخانه‌های کاربری](/docs/reference/using-api/client-libraries/) فراهم ساخته است.

هر خوشه کوبرنتیز مشخصات APIهایی را که ارائه می‌کند منتشر می‌کند. دو سازوکار برای انتشار این مشخصات وجود دارد که هر دو در فراهم‌کردن تعامل‌پذیری خودکار سودمندند. به‌عنوان نمونه، ابزار `kubectl` این مشخصات را دریافت کرده و برای تکمیل خودکار خط فرمان و ویژگی‌های دیگر در کش نگه می‌دارد. دو سازوکار پشتیبانی‌شده عبارت‌اند از:

- [Discovery API](#discovery-api)  
  : اطلاعاتی درباره ‌APIهای کوبرنتیز شامل نام APIها، منابع، نسخه‌ها و عملیات پشتیبانی‌شده ارائه می‌دهد. این اصطلاح ویژه کوبرنتیز است زیرا API مجزایی از OpenAPI کوبرنتیز به‌شمار می‌رود. هدف آن ارائه خلاصه کوتاهی از منابع موجود است و جزئیات طرح‌واره هر منبع را شامل نمی‌شود. برای طرح‌واره منابع، به سند OpenAPI مراجعه کنید.

- [سند OpenAPI کوبرنتیز](#openapi-interface-definition)  
  : طرح‌واره‌های کامل [OpenAPI v2.0 و v3.0](https://www.openapis.org/) را برای همه پایانه‌های ‌API کوبرنتیز فراهم می‌کند. OpenAPI v3 روش ترجیحی برای دسترسی است زیرا نمایی جامع و دقیق از API ارائه می‌دهد. این سند همه مسیرهای API و منابع مصرف‌شده یا تولیدشده در هر عملیات، و نیز اجزای توسعه‌پذیری پشتیبانی‌شده توسط خوشه را در بر می‌گیرد. این داده یک مشخصات کامل است و به‌مراتب حجیم‌تر از داده Discovery API می‌باشد.

## API اکتشاف (Discovery API)

کوبرنتیز فهرستی از تمام نسخه‌ها و منابع هر گروه را که پشتیبانی می‌شوند از طریق Discovery API منتشر می‌کند. این فهرست برای هر منبع شامل موارد زیر است:

- نام  
- گستره خوشه‌ای یا namespaced  
- نشانی پایانه (Endpoint URL) و افعال پشتیبانی‌شده  
- نام‌های جایگزین  
- گروه، نسخه، kind  

این API در دو شکل تجمیعی و غیرتجمیعی در دسترس است. اکتشاف تجمیعی دو پایانه ارائه می‌دهد، در حالی‌ که اکتشاف غیرتجمیعی برای هر نسخه گروه یک پایانه جداگانه فراهم می‌کند.

### اکتشاف تجمیعی

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

کوبرنتیز به‌طور پایدار از _اکتشاف تجمیعی_ پشتیبانی می‌کند و همه منابعی را که یک خوشه پشتیبانی می‌کند از طریق دو پایانه `/api` و `/apis` منتشر می‌نماید. درخواست این پایانه‌ها تعداد درخواست‌های لازم برای دریافت داده اکتشاف از خوشه را به‌طور چشمگیری کاهش می‌دهد. برای دسترسی به داده می‌توانید پایانه مربوطه را با هدر `Accept` زیر فراخوانی کنید:  
`Accept: application/json;v=v2;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`

اگر نوع منبع را با هدر `Accept` مشخص نکنید، پاسخ پیش‌فرض پایانه‌های `/api` و `/apis` یک سند اکتشاف غیرتجمیعی خواهد بود.

[سند اکتشاف](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json)
برای منابع داخلی در مخزن GitHub کوبرنتیز موجود است. زمانی‌ که به یک خوشه کوبرنتیز دسترسی ندارید، این سند می‌تواند به‌عنوان مرجع مجموعه پایه منابع قابلِ دسترس به کار رود.

این پایانه همچنین از ETag و کدگذاری protobuf پشتیبانی می‌کند.

### اکتشاف غیرتجمیعی

بدون اکتشاف تجمیعی، اکتشاف به‌صورت لایه‌ای منتشر می‌شود؛ به این صورت که پایانه‌های ریشه اطلاعات اکتشاف برای اسناد پایین‌دستی را منتشر می‌کنند.

فهرست همه نسخه‌های گروهی که یک خوشه پشتیبانی می‌کند در پایانه‌های `/api` و `/apis` منتشر می‌شود. مثال:

```
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
}
```

برای دریافت سند اکتشاف برای هر نسخه گروه، باید درخواست‌های اضافی به نشانی
`/apis/<group>/<version>` ارسال شود (برای مثال:
`/apis/rbac.authorization.k8s.io/v1alpha1`). این سند فهرست منابعی را که زیر آن نسخه گروه ارائه می‌شوند اعلام می‌کند. این پایانه‌ها توسط
`kubectl` برای واکشی فهرست منابع پشتیبانی‌شده توسط یک خوشه استفاده می‌شوند.

<!-- body -->

<a id="#api-specification" />

## تعریف رابط OpenAPI

برای جزئیات بیشتر درباره مشخصات OpenAPI به [مستندات OpenAPI](https://www.openapis.org/) مراجعه کنید.

کوبرنتیز هر دو نسخه OpenAPI v2.0 و OpenAPI v3.0 را ارائه می‌دهد. OpenAPI v3 روش ترجیحی برای دسترسی به OpenAPI است، زیرا نمایی جامع و بدون اتلاف از منابع کوبرنتیز فراهم می‌کند. به‌دلیل محدودیت‌های نسخه ۲ OpenAPI، برخی فیلدها از سند منتشرشده حذف می‌شوند، از جمله ولی نه محدود به `default`، `nullable` و `oneOf`.

### OpenAPI V2

سرور API کوبرنتیز یک مشخصات تجمیعی OpenAPI v2 را از طریق پایانه
`/openapi/v2` ارائه می‌دهد. می‌توانید قالب پاسخ را با استفاده از
هدرهای درخواست به شکل زیر مشخص کنید:

<table>
  <caption style="display:none">Valid request header values for OpenAPI v2 queries</caption>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>not supplying this header is also acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>mainly for intra-cluster use</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>default</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>serves </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

{{< warning >}}
قوانین اعتبارسنجی که به‌عنوان بخشی از طرح‌واره‌های OpenAPI منتشر می‌شوند ممکن است کامل نباشند (و معمولاً هم نیستند).
اعتبارسنجی‌های اضافی در داخل سرور API انجام می‌شود. اگر به تأیید دقیق و کامل نیاز دارید،
دستور `kubectl apply --dry-run=server` تمام اعتبارسنجی‌های قابل اجرا را اجرا می‌کند (و همچنین بررسی‌های زمان پذیرش را فعال می‌نماید).
{{< /warning >}}

### OpenAPI V3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

کوبرنتیز از انتشار توصیف APIهای خود به‌صورت OpenAPI v3 پشتیبانی می‌کند.

یک پایانه اکتشاف به نشانی `/openapi/v3` برای مشاهده فهرست همه گروه/نسخه‌های موجود فراهم شده است. این پایانه تنها JSON بازمی‌گرداند. این گروه/نسخه‌ها در قالب زیر ارائه می‌شوند:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

نشانی‌های نسبی به توصیف‌های تغییرناپذیر OpenAPI اشاره می‌کنند تا
عملکرد کش سمت کاربر را بهبود دهند. هدرهای مناسب کش HTTP نیز برای این منظور
توسط سرور API تنظیم می‌شوند (`Expires` یک سال در آینده و `Cache-Control`
بر روی `immutable`). هنگامی که یک نشانی منسوخ استفاده شود، سرور API
کاربر را به جدیدترین نشانی هدایت (redirect) می‌کند.

سرور API کوبرنتیز برای هر نسخه گروه کوبرنتیز، مشخصات OpenAPI v3 را
در پایانه `/openapi/v3/apis/<group>/<version>?hash=<hash>` منتشر می‌کند.

برای مشاهده هدرهای درخواستی پذیرفته‌شده، به جدول زیر مراجعه کنید.

<table>
  <caption style="display:none">Valid request header values for OpenAPI v3 queries</caption>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>not supplying this header is also acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>mainly for intra-cluster use</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>default</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>serves </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

یک پیاده‌سازی Golang برای واکشی OpenAPI V3 در بسته
[`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3) در دسترس است.

کوبرنتیز {{< skew currentVersion >}} مشخصات
OpenAPI v2.0 و v3.0 را منتشر می‌کند؛ در حال حاضر برنامه‌ای برای پشتیبانی از نسخه 3.1 وجود ندارد.

### سریال‌سازی Protobuf

کوبرنتیز یک قالب سریال‌سازی جایگزین مبتنی بر Protobuf را پیاده‌سازی کرده است که
در درجه اول برای ارتباط درون‌خوشهی در نظر گرفته شده است. برای اطلاعات بیشتر
درباره این قالب، به طرح پیشنهادی
[سریال‌سازی Protobuf در کوبرنتیز](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)
و فایل‌های Interface Definition Language (IDL) برای هر طرح‌واره که در
بسته‌های Go تعریف‌کننده اشیای API قرار دارند مراجعه کنید.

## پایداری داده (Persistence)

کوبرنتیز وضعیت سریال‌شده اشیاء را با نوشتن آن‌ها در
{{< glossary_tooltip term_id="etcd" >}} ذخیره می‌کند.

## گروه‌های API و نسخه‌بندی

برای آسان‌تر کردن حذف فیلدها یا بازچینی نمایش منابع،
کوبرنتیز از چندین نسخه API پشتیبانی می‌کند که هر یک در مسیر API متفاوتی
مثل `/api/v1` یا `/apis/rbac.authorization.k8s.io/v1alpha1` قرار دارند.

نسخه‌بندی در سطح API انجام می‌شود، نه در سطح منبع یا فیلد، تا
نمایی شفاف و سازگار از منابع و رفتار سیستم ارائه شده و
کنترل دسترسی به APIهایی که به پایان عمر یا آزمایشی هستند امکان‌پذیر شود.

برای سهولت توسعه و گسترش API، کوبرنتیز
[گروه‌های API](/docs/reference/using-api/#api-groups) را پیاده‌سازی کرده که می‌توانند
[فعال یا غیرفعال](/docs/reference/using-api/#enabling-or-disabling) شوند.

منابع API به‌واسطه گروه API، نوع منبع، نام فضا (برای منابع namespaced) و نام متمایز می‌شوند.
سرور API تبدیل بین نسخه‌های API را به‌صورت شفاف مدیریت می‌کند:
تمام نسخه‌های مختلف در واقع نمایش‌هایی از همان داده ذخیره‌شده هستند، و سرور API
ممکن است همان داده زیرساختی را از طریق چند نسخه API ارائه دهد.

برای مثال، فرض کنید دو نسخه API، `v1` و `v1beta1`، برای یک منبع وجود دارد.
اگر در ابتدا شیئی را با نسخه `v1beta1` ایجاد کنید، تا زمانی که نسخه `v1beta1`
منقضی و حذف نشده است می‌توانید آن شیء را با هر یک از نسخه‌های `v1beta1` یا `v1`
بخوانید، به‌روزرسانی یا حذف کنید؛ پس از آن، دسترسی و تغییر شیء فقط از طریق نسخه `v1` ممکن است.

### تغییرات API

هر سامانه موفق باید با ظهور موارد استفاده جدید یا تغییر موارد موجود رشد کند و تغییر یابد؛
بنابراین کوبرنتیز API خود را به گونه‌ای طراحی کرده تا پیوسته تغییر و گسترش یابد.
هدف پروژه کوبرنتیز این است که سازگاری با کلاینت‌های موجود را نشکند و این
سازگاری را برای مدتی حفظ کند تا پروژه‌های دیگر فرصت تطبیق داشته باشند.

به‌طور کلی، افزودن منابع API یا فیلدهای جدید می‌تواند به دفعات و به‌سرعت انجام شود.
حذف منابع یا فیلدها نیازمند پیروی از
[سیاست منسوخ‌سازی API](/docs/reference/using-api/deprecation-policy/) است.

کوبرنتیز تعهد قوی دارد که پس از رسیدن APIهای رسمی به مرحله دسترسی عمومی (GA)
— معمولاً در نسخه `v1` — سازگاری آن‌ها را حفظ کند. همچنین کوبرنتیز
سازگاری با داده‌هایی که از طریق نسخه‌های _بتا_ APIهای رسمی ذخیره شده‌اند را تضمین می‌کند
و اطمینان می‌دهد که داده‌ها هنگام پایدار شدن ویژگی‌ها قابل تبدیل و دسترس‌پذیر از طریق
نسخه‌های GA باشند.

اگر نسخه بتای API را اتخاذ کنید، باید پس از فارغ‌التحصیل شدن API به نسخه بتا یا پایدار بعدی
مهاجرت نمایید. بهترین زمان برای این کار، دوره منسوخ‌سازی نسخه بتا است،
زیرا اشیاء به طور هم‌زمان از طریق هر دو نسخه API قابل دسترسی هستند. پس از پایان دوره
منسوخ‌سازی و توقف ارائه نسخه بتا، باید از نسخه جایگزین استفاده شود.

{{< note >}}
هرچند کوبرنتیز تلاش می‌کند برای نسخه‌های _آلفا_ نیز سازگاری را حفظ کند،
ولی در برخی شرایط این امر ممکن نیست. اگر از هر نسخه آلفا استفاده می‌کنید،
در زمان به‌روزرسانی خوشه، یادداشت‌های انتشار کوبرنتیز را بررسی کنید،
زیرا ممکن است تغییرات ناسازگاری رخ داده باشد که نیازمند حذف تمامی
اشیای آلفا پیش از ارتقا باشد.
{{< /note >}}

برای جزئیات بیشتر درباره تعاریف سطوح نسخه API، به
[مرجع نسخه‌های API](/docs/reference/using-api/#api-versioning) مراجعه کنید.

## گسترش API

API کوبرنتیز را می‌توان به یکی از دو روش زیر گسترش داد:

1. [منابع سفارشی](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   به شما امکان می‌دهد به‌صورت اعلان‌محور تعریف کنید که سرور API چگونه
   ‌API منبع انتخابی شما را فراهم کند.
2. همچنین می‌توانید با پیاده‌سازی
   [لایه تجمیع](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
   API کوبرنتیز را گسترش دهید.

## {{% heading "whatsnext" %}}

- بیاموزید چگونه با افزودن
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
  API کوبرنتیز را گسترش دهید.
- مستند
  [کنترل دسترسی به API کوبرنتیز](/docs/concepts/security/controlling-access/)
  توضیح می‌دهد خوشه چگونه احراز هویت و مجوزدهی برای دسترسی به API را مدیریت می‌کند.
- درباره پایانه‌های API، انواع منابع و نمونه‌ها در
  [مرجع API](/docs/reference/kubernetes-api/) بخوانید.
- درباره اینکه تغییر سازگار چیست و چگونه می‌توان API را تغییر داد، در
  [تغییرات API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)
  مطالعه کنید.
