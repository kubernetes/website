---
title: زبان عبارات مشترک در Kubernetes
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---

<!-- overview -->

زبان عبارت مشترک [ زبان عبارات مشترک در Kubernetes (CEL)](https://github.com/google/cel-go) در API کوبرنتیز برای اعلام قوانین اعتبارسنجی، قوانین سیاست و سایر محدودیت‌ها یا شرایط استفاده می‌شود.
عبارات CEL مستقیماً در {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} ارزیابی می‌شوند، که CEL را به جایگزینی مناسب برای مکانیسم‌های خارج از فرآیند، مانند webhooks، برای بسیاری از موارد استفاده از توسعه‌پذیری تبدیل می‌کند. عبارات CEL شما تا زمانی که مؤلفه سرور API صفحه کنترل در دسترس باشد، به اجرای خود ادامه می‌دهند.
<!-- body -->

## مروری بر زبان

زبان [CEL زبان](https://github.com/google/cel-spec/blob/master/doc/langdef.md) دارای سینتکس سرراستی است که مشابه عبارات موجود در C، C++، جاوا، جاوا اسکریپت و Go می‌باشد.


CEL برای جاسازی در برنامه‌ها طراحی شده است. هر "برنامه" CEL یک عبارت واحد است که به یک مقدار واحد ارزیابی می‌شود. عبارات CEL معمولاً "جمله‌های تک‌خطی" کوتاهی هستند که به خوبی در فیلدهای رشته‌ای منابع API Kubernetes قرار می‌گیرند.

ورودی‌های یک برنامه CEL «متغیرها» هستند. هر فیلد API Kubernetes که شامل CEL باشد، در مستندات API اعلام می‌کند که کدام متغیرها برای استفاده در آن فیلد در دسترس هستند. به عنوان مثال، در فیلد `x-kubernetes-validations[i].rules` از CustomResourceDefinitions، متغیرهای `self` و `oldSelf` در دسترس هستند و به وضعیت قبلی و فعلی داده‌های منبع سفارشی که باید توسط عبارت CEL اعتبارسنجی شوند، اشاره دارند. سایر فیلدهای API Kubernetes ممکن است متغیرهای متفاوتی را اعلام کنند. برای اطلاع از اینکه کدام متغیرها برای آن فیلد در دسترس هستند، به مستندات API مربوط به فیلدهای API مراجعه کنید.

مثال‌هایی از عبارات CEL:

<table>
<caption>Examples of CEL expressions and the purpose of each</caption>
<thead>
<tr>
  <th>Rule</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>self.minReplicas &lt;= self.replicas && self.replicas &lt;= self.maxReplicas</tt></td>
  <td>Validate that the three fields defining replicas are ordered appropriately</td>
</tr>
<tr>
  <td><tt>'Available' in self.stateCounts</tt></td>
  <td>Validate that an entry with the 'Available' key exists in a map</td>
</tr>
<tr>
  <td><tt>(self.list1.size() == 0) != (self.list2.size() == 0)</tt></td>
  <td>Validate that one of two lists is non-empty, but not both</td>
</tr>
<tr>
  <td><tt>self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'</td>
</tr>
<tr>
  <td><tt>has(self.expired) && self.created + self.ttl &lt; self.expired</tt></td>
  <td>Validate that 'expired' date is after a 'create' date plus a 'ttl' duration</td>
</tr>
<tr>
  <td><tt>self.health.startsWith('ok')</tt></td>
  <td>Validate a 'health' string field has the prefix 'ok'</td>
</tr>
<tr>
  <td><tt>self.widgets.exists(w, w.key == 'x' && w.foo &lt; 10)</tt></td>
  <td>Validate that the 'foo' property of a listMap item with a key 'x' is less than 10</td>
</tr>
<tr>
  <td><tt>type(self) == string ? self == '99%' : self == 42</tt></td>
  <td>Validate an int-or-string field for both the int and string cases</td>
</tr>
<tr>
  <td><tt>self.metadata.name == 'singleton'</tt></td>
  <td>Validate that an object's name matches a specific value (making it a singleton)</td>
</tr>
<tr>
  <td><tt>self.set1.all(e, !(e in self.set2))</tt></td>
  <td>Validate that two listSets are disjoint</td>
</tr>
<tr>
  <td><tt>self.names.size() == self.details.size() && self.names.all(n, n in self.details)</tt></td>
  <td>Validate the 'details' map is keyed by the items in the 'names' listSet</td>
</tr>
<tr>
  <td><tt>self.details.all(key, key.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the keys of the 'details' map</td>
</tr>
<tr>
  <td><tt>self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the values of the 'details' map</td>
</tr>
</tbody>
</table>

## گزینه‌های CEL، ویژگی‌های زبان و کتابخانه‌ها

CEL با گزینه‌ها، کتابخانه‌ها و ویژگی‌های زبانی زیر پیکربندی شده است که در نسخه‌های مشخص شده Kubernetes معرفی شده‌اند:

<table>
<thead>
<tr>
  <th>CEL option, library or language feature</th>
  <th>Included</th>
  <th>Availability</th>
</tr>
</thead>
<tbody>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros">Standard macros</a></td>
  <td><code>has</code>, <code>all</code>, <code>exists</code>, <code>exists_one</code>, <code>map</code>, <code>filter</code></td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">Standard functions</a></td>
  <td>See
    <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">
      official list of standard definitions
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals">
      Homogeneous Aggregate Literals
    </a>
  </td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone">Default UTC Time Zone</a></td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations">
      Eagerly Validate Declarations
    </a>
  </td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Extended strings library</a>, Version 1</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes list library</td>
  <td>See
    <a href="#kubernetes-list-library">
      Kubernetes list library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes regex library</td>
  <td>See
    <a href="#kubernetes-regex-library">
      Kubernetes regex library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes URL library</td>
  <td>See
    <a href="#kubernetes-url-library">
      Kubernetes URL library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes authorizer library</td>
  <td>See
    <a href="#kubernetes-authorizer-library">
      Kubernetes authorizer library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes quantity library</td>
  <td>See
    <a href="#kubernetes-quantity-library">
      Kubernetes quantity library
    </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
</tr>
<tr>
  <td>CEL optional types</td>
  <td>See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes">
      CEL optional types
    </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
</tr>
<tr>
  <td>CEL CrossTypeNumericComparisons</td>
  <td>See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons">
      CEL CrossTypeNumericComparisons
   </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
</tr>
</tbody>
</table>

توابع، ویژگی‌ها و تنظیمات زبان CEL از عقب‌گردهای صفحه کنترل Kubernetes پشتیبانی می‌کنند. به عنوان مثال، _CEL Optional Values_ در Kubernetes 1.29 معرفی شد و بنابراین فقط سرورهای API در آن نسخه یا جدیدتر درخواست‌های نوشتن به عبارات CEL را که از _CEL Optional Values_ استفاده می‌کنند، می‌پذیرند. با این حال، هنگامی که یک خوشه به Kubernetes 1.28 برگردانده می‌شود، عبارات CEL با استفاده از "CEL Optional Values" که از قبل در منابع API ذخیره شده‌اند، به ارزیابی صحیح ادامه خواهند داد.

## کتابخانه‌های Kubernetes CE

علاوه بر کتابخانه‌های جامعه CEL، کوبرنتیز شامل کتابخانه‌های CEL نیز می‌شود که در هر جایی که CEL در کوبرنتیز استفاده می‌شود، در دسترس هستند.

### کتابخانه فهرست Kubernetes

کتابخانه لیست شامل `indexOf` و `lastIndexOf` است که مشابه توابع رشته‌ای با همین نام‌ها عمل می‌کنند. این توابع یا اولین یا آخرین اندیس مکانی عنصر ارائه شده در لیست را تعیین می‌کنند.

کتابخانه لیست همچنین شامل `min`، `max` و `sum` است. Sum در همه نوع‌های عددی و همچنین نوع مدت زمان پشتیبانی می‌شود. Min و max در همه نوع‌های قابل مقایسه پشتیبانی می‌شوند.

تابع `isSorted` نیز به عنوان یک تابع کمکی ارائه شده و در تمام انواع داده قابل مقایسه پشتیبانی می‌شود.

نمونه ها:

<table>
<caption>Examples of CEL expressions using list library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>names.isSorted()</tt></td>
  <td>Verify that a list of names is kept in alphabetical order</td>
</tr>
<tr>
  <td><tt>items.map(x, x.weight).sum() == 1.0</tt></td>
  <td>Verify that the "weights" of a list of objects sum to 1.0</td>
</tr>
<tr>
  <td><tt>lowPriorities.map(x, x.priority).max() &lt; highPriorities.map(x, x.priority).min()</tt></td>
  <td>Verify that two sets of priorities do not overlap</td>
</tr>
<tr>
  <td><tt>names.indexOf('should-be-first') == 1</tt></td>
  <td>Require that the first name in a list if a specific value</td>
</tr>
</tbody>
</table>

برای اطلاعات بیشتر به [Kubernetes List Library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists) مراجعه کنید.
### کتابخانه regex در Kubernetes

علاوه بر تابع `matches` که توسط کتابخانه استاندارد CEL ارائه شده است، کتابخانه regex توابع `find` و `findAll` را نیز ارائه می‌دهد که طیف وسیع‌تری از عملیات regex را امکان‌پذیر می‌سازد.

نمونه ها:

<table>
<caption>Examples of CEL expressions using regex library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>"abc 123".find('[0-9]+')</tt></td>
  <td>Find the first number in a string</td>
</tr>
<tr>
  <td><tt>"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() &lt; 100</tt></td>
  <td>Verify that the numbers in a string sum to less than 100</td>
</tr>
</tbody>
</table>

برای اطلاعات بیشتر به [Kubernetes regex library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)
godoc مراجعه کنید.
### کتابخانه URL کوبرنتیز

برای آسان‌تر و ایمن‌تر کردن پردازش URLها، توابع زیر اضافه شده‌اند:
- `isURL(string)` بررسی می‌کند که آیا یک رشته، یک URL معتبر طبق بسته‌ی [Go's net/url](https://pkg.go.dev/net/url#URL) است یا خیر. رشته باید یک URL مطلق باشد.

- `url(string) URL` یک رشته را به URL تبدیل می‌کند یا اگر رشته یک URL معتبر نباشد، منجر به خطا می‌شود.

پس از تجزیه از طریق تابع `url`، شیء URL حاصل دارای دسترسی‌های `getScheme`، `getHost`، `getHostname`، `getPort`، `getEscapedPath` و `getQuery` است.

نمونه ها:

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
</tr>
<tr>
  <td><tt>url('https://example.com:80/').getHost()</tt></td>
  <td>Gets the 'example.com:80' host part of the URL</td>
</tr>
<tr>
  <td><tt>url('https://example.com/path with spaces/').getEscapedPath()</tt></td>
  <td>Returns '/path%20with%20spaces/'</td>
</tr>
</tbody>
</table>

برای اطلاعات بیشتر به [Kubernetes URL library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs) مراجعه کنید.


### کتابخانه مجوزدهی Kubernetes


برای عبارات CEL در API که در آن متغیری از نوع `Authorizer` موجود است، می‌توان از مجوزدهنده برای انجام بررسی‌های مجوز برای کاربر اصلی (کاربر احراز هویت شده) درخواست استفاده کرد.


بررسی منابع API به شرح زیر انجام می‌شود:

1. گروه و منبعی را که می‌خواهید بررسی کنید مشخص کنید: `Authorizer.group(string).resource(string) ResourceCheck`
1. به صورت اختیاری، هر ترکیبی از توابع سازنده زیر را برای محدود کردن بیشتر بررسی مجوز فراخوانی کنید.
توجه داشته باشید که این توابع نوع گیرنده را برمی‌گردانند و می‌توانند به صورت زنجیره‌ای باشند:
- `ResourceCheck.subresource(string) ResourceCheck`
- `ResourceCheck.namespace(string) ResourceCheck`
- `ResourceCheck.name(string) ResourceCheck`
1. برای انجام بررسی مجوز، `ResourceCheck.check(verb string) Decision` را فراخوانی کنید.
1. برای بررسی نتیجه بررسی مجوز، تابع `allowed() bool` یا `reason() string` را فراخوانی کنید.

مجوزهای غیر منبعی انجام شده به شرح زیر استفاده می‌شوند:

1. فقط یک مسیر مشخص کنید: `Authorizer.path(string) PathCheck`
1. برای انجام بررسی مجوز، تابع `PathCheck.check(httpVerb string) Decision` را فراخوانی کنید.
1. برای بررسی نتیجه بررسی مجوز، تابع `allowed() bool` یا `reason() string` را فراخوانی کنید.

برای انجام بررسی مجوز برای یک حساب سرویس:

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').namespace('default').check('create').allowed()</tt></td>
  <td>Returns true if the principal (user or service account) is allowed create pods in the 'default' namespace.</td>
</tr>
<tr>
  <td><tt>authorizer.path('/healthz').check('get').allowed()</tt></td>
  <td>Checks if the principal (user or service account) is authorized to make HTTP GET requests to the /healthz API path.</td>
</tr>
<tr>
  <td><tt>authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()<tt></td>
  <td>Checks if the service account is authorized to delete deployments.</td>
</tr>
</tbody>
</table>

{{< feature-state state="alpha" for_k8s_version="v1.31" >}}

با فعال بودن ویژگی آلفای `AuthorizeWithSelectors`، می‌توان انتخابگرهای فیلد و برچسب را به بررسی‌های مجوز اضافه کرد.

<table>
<caption>Examples of CEL expressions using selector authorization functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()</tt></td>
  <td>
    Returns true if the principal (user or service account) is allowed
    to list pods with the field selector <tt>spec.nodeName=mynode</tt>.
  </td>
</tr>
<tr>
  <td><tt>authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()</tt></td>
  <td>
    Returns true if the principal (user or service account) is allowed
    to list pods with the label selector <tt>example.com/mylabel=myvalue</tt>.
  </td>
</tr>
</tbody>
</table>

برای اطلاعات بیشتر به [Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) و 
[Kubernetes AuthzSelectors library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) مراجعه کنید.

### Kubernetes quantity library

Kubernetes 1.28 پشتیبانی از دستکاری رشته‌های مقداری (مثلاً 1.5G، 512k، 20Mi) را اضافه می‌کند.

- `isQuantity(string)` بررسی می‌کند که آیا یک رشته، مقدار معتبری بر اساس ... است یا خیر.
  [Kubernetes' resource.Quantity](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity).
-`quantity(string) Quantity` یک رشته را به Quantity تبدیل می‌کند یا اگر رشته یک مقدار معتبر نباشد، منجر به خطا می‌شود

پس از تجزیه از طریق تابع `quantity`، شیء Quantity حاصل دارای کتابخانه توابع عضو زیر است:

<table>
<caption>Available member functions of a Quantity</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isInteger()</tt></td>
  <td>bool</td>
  <td>Returns true if and only if asInteger is safe to call without an error</td>
</tr>
<tr>
  <td><tt>asInteger()</tt></td>
  <td>int</td>
  <td>
    Returns a representation of the current value as an <tt>int64</tt> if possible
    or results in an error if conversion would result in overflowor loss of precision.
  </td>
</tr>
<tr>
  <td><tt>asApproximateFloat()</tt></td>
  <td>float</td>
  <td>
    Returns a <tt>float64</tt> representation of the quantity which may lose precision.
    If the value of the quantity is outside the range of a <tt>float64</tt>,
    <tt>+Inf/-Inf</tt> will be returned.</td>
</tr>
<tr>
  <td><tt>sign()</tt></td>
  <td>int</td>
  <td>
    Returns <tt>1</tt> if the quantity is positive, <tt>-1</tt> if it is negative.
    <tt>0</tt> if it is zero.
  </td>
</tr>
<tr>
  <td><tt>add(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns sum of two quantities</td>
</tr>
<tr>
  <td><tt>add(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns sum of quantity and an integer</td>
  <td>
<tr>
  <td><tt>sub(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns difference between two quantities</td>
</tr>
<tr>
  <td><tt>sub(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns difference between a quantity and an integer</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is less than the operand</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is greater than the operand</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Quantity&gt;)</tt></td>
  <td>int</td>
  <td>
    Compares receiver to operand and returns 0 if they are equal,
    1 if the receiver is greater, or -1 if the receiver is less than the operand
  </td>
</tr>
</tbody>
</table>

مثال ها:

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>quantity("500000G").isInteger()</tt></td>
  <td>Test if conversion to integer would throw an error</td>
</tr>
<tr>
  <td><tt>quantity("50k").asInteger()</tt></td>
  <td>Precise conversion to integer</td>
</tr>
<tr>
  <td><tt>quantity("9999999999999999999999999999999999999G").asApproximateFloat()</tt></td>
  <td>Lossy conversion to float</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(quantity("20k"))</tt></td>
  <td>Add two quantities</td>
</tr>
<tr>
  <td><tt>quantity("50k").sub(20000)</tt></td>
  <td>Subtract an integer from a quantity</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(20).sub(quantity("100k")).sub(-50000)</tt></td>
  <td>Chain adding and subtracting integers and quantities</td>
</tr>
<tr>
  <td><tt>quantity("200M").compareTo(quantity("0.2G"))</tt></td>
  <td>Compare two quantities</td>
</tr>
<tr>
  <td><tt>quantity("150Mi").isGreaterThan(quantity("100Mi"))</tt></td>
  <td>Test if a quantity is greater than the receiver</td>
</tr>
<tr>
  <td><tt>quantity("50M").isLessThan(quantity("100M"))</tt></td>
  <td>Test if a quantity is less than the receiver</td>
</tr>
</tbody>
</table>

## بررسی تایپ

CEL یک زبان  است [gradually typed language](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

برخی از فیلدهای API Kubernetes حاوی عبارات CEL هستند که از نظر نوع کاملاً بررسی شده‌اند. برای مثال، [CustomResourceDefinitions Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
 کاملاً بررسی شده‌اند.

برخی از فیلدهای API Kubernetes حاوی عبارات CEL هستند که تا حدی از نظر نوع بررسی شده‌اند. یک عبارت CEL که تا حدی از نظر نوع بررسی شده است، عبارتی است که در آن برخی از متغیرها به صورت ایستا و برخی دیگر به صورت پویا تایپ می‌شوند. به عنوان مثال، در عبارات CEL از [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/) متغیر `request` تایپ شده است، اما متغیر `object` به صورت پویا تایپ شده است. در نتیجه، عبارتی که حاوی `request.namex` باشد، در بررسی نوع با شکست مواجه می‌شود، زیرا فیلد `namex` تعریف نشده است. با این حال، `object.namex` حتی زمانی که فیلد `namex` برای انواع منابعی که `object` به آنها اشاره می‌کند تعریف نشده باشد، در بررسی نوع با موفقیت عمل می‌کند، زیرا `object` به صورت پویا تایپ شده است.


ماکروی `has()` در زبان CEL می‌تواند در عبارات CEL برای بررسی دسترسی به فیلدی از یک متغیر با نوع پویا، قبل از تلاش برای دسترسی به مقدار آن فیلد، استفاده شود. برای مثال:

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

## یکپارچه سازی سیستم را تایپ کنید

<table>
<caption>Table showing the relationship between OpenAPIv3 types and CEL types</caption>
<thead>
<tr>
  <th>OpenAPIv3 type</th>
  <th>CEL type</th>
</tr>
</thead>
<tbody>
<tr>
  <td>'object' with Properties</td>
  <td>
    object / "message type"
    (<tt>type(&lt;object&gt;)</tt> evaluates to
     <tt>selfType&lt;uniqueNumber&gt;.path.to.object.from.self</tt>)
  </td>
</tr>
<tr>
  <td>'object' with <tt>additionalProperties</tt></td>
  <td>map</td>
</tr>
<tr>
  <td>'object' with <tt>x-kubernetes-embedded-type</tt></td>
  <td>
    object / "message type", 'apiVersion', 'kind', 'metadata.name'
    and 'metadata.generateName' are implicitly included in schema
  </td>
</tr>
<tr>
  <td>'object' with x-kubernetes-preserve-unknown-fields</td>
  <td>object / "message type", unknown fields are NOT accessible in CEL expression</td>
</tr>
<tr>
  <td><tt>x-kubernetes-int-or-string</tt></td>
  <td>
    Union of <tt>int</tt> or <tt>string</tt>,
    <tt>self.intOrString < 100 | self.intOrString == '50%'</tt>
    evaluates to true for both <tt>50</tt> and <tt>"50%"</tt>
  </td>
</tr>
<tr>
  <td>'array'</td>
  <td>list</td>
</tr>
<tr>
  <td>'array' with <tt>x-kubernetes-list-type=map</tt></td>
  <td>list with map based Equality & unique key guarantees</td>
</tr>
<tr>
  <td>'array' with <tt>x-kubernetes-list-type=set</tt></td>
  <td>list with set based Equality & unique entry guarantees</td>
</tr>
<tr>
  <td>'boolean'</td>
  <td>boolean</td>
</tr>
<tr>
  <td>'number' (all formats)</td>
  <td>double</td>
</tr>
<tr>
  <td>'integer' (all formats)</td>
  <td>int (64)</td>
</tr>
<tr>
  <td><i>no equivalent</i></td>
  <td>uint (64)</td>
</tr>
<tr>
  <td>'null'</td>
  <td>null_type</td>
</tr>
<tr>
  <td>'string'</td>
  <td>string</td>
</tr>
<tr>
  <td>'string' with format=byte (base64 encoded)</td>
  <td>bytes</td>
</tr>
<tr>
  <td>'string' with format=date</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' with format=datetime</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' with format=duration</td>
  <td>duration (<tt>google.protobuf.Duration</tt>)</td>
</tr>
</tbody>
</table>

همچنین ببینید: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Kubernetes Structural Schemas](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

مقایسه برابری برای آرایه‌هایی با `x-kubernetes-list-type` از `set` یا `map` ترتیب عناصر را نادیده می‌گیرد. برای مثال `[1, 2] == [2, 1]` اگر آرایه‌ها نشان‌دهنده مقادیر `set` Kubernetes باشند.

الحاق روی آرایه‌ها با `x-kubernetes-list-type` از معانی نوع لیست استفاده می‌کند:

`set`
: `X + Y` یک اتحاد انجام می‌دهد که در آن موقعیت آرایه تمام عناصر در `X` حفظ می‌شود و عناصر غیر متقاطع در `Y` با حفظ ترتیب جزئی خود، اضافه می‌شوند.

`map`
: `X + Y` ادغامی را انجام می‌دهد که در آن موقعیت‌های آرایه‌ای تمام کلیدها در `X` حفظ می‌شوند، اما مقادیر توسط مقادیر در `Y` رونویسی می‌شوند، زمانی که مجموعه کلیدهای `X` و `Y` با هم تلاقی می‌کنند. عناصر در `Y` با کلیدهای غیر متقاطع، با حفظ ترتیب جزئی خود، الحاق می‌شوند..

## Escaping

فقط نام‌های ویژگی منابع Kubernetes به شکل `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` از CEL قابل دسترسی هستند. نام‌های ویژگی قابل دسترسی طبق قوانین زیر هنگام دسترسی در عبارت escape می‌شوند:

<table>
<caption>Table of CEL identifier escaping rules</caption>
<thead>
<tr>
  <th>escape sequence</th>
  <th>property name equivalent</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>__underscores__</tt></td>
  <td><tt>__</tt></td>
</tr>
<tr>
  <td><tt>__dot__</tt></td>
  <td><tt>.</tt></td>
</tr>
<tr>
  <td><tt>__dash__</tt></td>
  <td><tt>-</tt></td>
</tr>
<tr>
  <td><tt>__slash__</tt></td>
  <td><tt>/</tt></td>
</tr>
<tr>
  <td><tt>__{keyword}__</tt></td>
  <td>
    <a href="https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax">
      CEL <b>RESERVED</b> keyword
    </a>
  </td>
</tr>
</tbody>
</table>

وقتی می‌خواهید هر یک از کلمات کلیدی **RESERVED** در CEL را escape کنید، باید دقیقاً با نام ویژگی مطابقت داشته باشید. از کاراکتر underscore برای escape کردن استفاده کنید. (برای مثال، `int` در کلمه `sprint` escape نمی‌شود و نیازی هم به escape کردن ندارد).

مثال‌هایی از escape کردن:

<table>
<caption>Examples escaped CEL identifiers</caption>
<thead>
<tr>
  <th>property name</th>
  <th>rule with escaped property name</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>namespace</tt></td>
  <td><tt>self.__namespace__ &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>x-prop</tt></td>
  <td><tt>self.x__dash__prop &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>redact_d</tt></td>
  <td><tt>self.redact__underscores__d &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>string</tt></td>
  <td><tt>self.startsWith('kube')</tt></td>
</tr>
</tbody>
</table>

## محدودیت های منابع


CEL کامل نیست و انواع کنترل‌های ایمنی تولید را برای محدود کردن زمان اجرا ارائه می‌دهد. ویژگی‌های محدودیت منابع CEL، بازخوردی را در مورد پیچیدگی عبارت به توسعه‌دهندگان ارائه می‌دهد و به محافظت از سرور API در برابر مصرف بیش از حد منابع در طول ارزیابی کمک می‌کند. ویژگی‌های محدودیت منابع CEL برای جلوگیری از مصرف بیش از حد منابع سرور API در ارزیابی CEL استفاده می‌شوند.
یکی از عناصر کلیدی ویژگی‌های محدودیت منابع، واحد هزینه است که CEL آن را به عنوان راهی برای ردیابی استفاده از CPU تعریف می‌کند. واحدهای هزینه مستقل از بار سیستم و سخت‌افزار هستند. واحدهای هزینه نیز قطعی هستند؛ برای هر عبارت CEL و داده‌های ورودی داده شده، ارزیابی عبارت توسط مفسر CEL همیشه منجر به هزینه یکسانی خواهد شد.
بسیاری از عملیات اصلی CEL هزینه‌های ثابتی دارند. ساده‌ترین عملیات، مانند مقایسه‌ها (به عنوان مثال `<`) هزینه‌ای برابر با ۱ دارند. برخی هزینه ثابت بالاتری دارند، به عنوان مثال، اعلان‌های تحت‌اللفظی لیست، هزینه پایه ثابتی برابر با ۴۰ واحد هزینه دارند.
فراخوانی توابع پیاده‌سازی‌شده در کد بومی، هزینه تقریبی را بر اساس پیچیدگی زمانی عملیات محاسبه می‌کند. برای مثال: عملیاتی که از عبارات منظم استفاده می‌کنند، مانند `match` و `find`، با استفاده از هزینه تقریبی `length(regexString)*length(inputString)` تخمین زده می‌شوند. هزینه تقریبی، بدترین حالت پیچیدگی زمانی پیاده‌سازی RE2 در Go را نشان می‌دهد.

### بودجه هزینه زمان اجرا


تمام عبارات CEL که توسط Kubernetes ارزیابی می‌شوند، توسط یک بودجه هزینه زمان اجرا محدود می‌شوند. بودجه هزینه زمان اجرا، تخمینی از میزان واقعی استفاده از CPU است که با افزایش یک شمارنده واحد هزینه هنگام تفسیر یک عبارت CEL محاسبه می‌شود. اگر مفسر CEL دستورالعمل‌های زیادی را اجرا کند، از بودجه هزینه زمان اجرا تجاوز می‌کند، اجرای عبارات متوقف می‌شود و خطایی رخ می‌دهد.
برخی از منابع Kubernetes یک بودجه هزینه زمان اجرا اضافی تعریف می‌کنند که اجرای چندین عبارت را محدود می‌کند. اگر مجموع هزینه عبارات از بودجه تجاوز کند، اجرای عبارات متوقف می‌شود و خطایی رخ می‌دهد. به عنوان مثال، اعتبارسنجی یک منبع سفارشی دارای یک بودجه هزینه زمان اجرا _به ازای هر اعتبارسنجی_ برای همه [Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) است که برای اعتبارسنجی منبع سفارشی ارزیابی شده‌اند.

### محدودیت‌های هزینه تخمینی

برای برخی از منابع Kubernetes، سرور API همچنین ممکن است بررسی کند که آیا زمان اجرای تخمینی بدترین حالت عبارات CEL برای اجرا بسیار گران خواهد بود یا خیر. در این صورت، سرور API با رد عملیات ایجاد یا به‌روزرسانی حاوی عبارت CEL در منابع API، از نوشتن عبارت CEL در منابع API جلوگیری می‌کند. این ویژگی تضمین قوی‌تری ارائه می‌دهد که عبارات CEL نوشته شده در منبع API در زمان اجرا بدون تجاوز از بودجه هزینه زمان اجرا ارزیابی شوند.
