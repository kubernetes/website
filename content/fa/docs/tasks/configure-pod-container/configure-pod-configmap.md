---
title: پیکربندی یک Pod برای استفاده از ConfigMap
content_type: task
weight: 190
card:
  name: tasks
  weight: 50
---

<!-- overview -->
بسیاری از برنامه‌ها به پیکربندی‌ای متکی هستند که در زمان اولیه‌سازی یا زمان اجرا استفاده می‌شود.  
اغلب نیاز است مقادیر تخصیص‌یافته به پارامترهای پیکربندی را تنظیم کنید.  
ConfigMapها مکانیزمی در کوبرنتیز هستند که به شما اجازه می‌دهند داده‌های پیکربندی را به  
{{< glossary_tooltip text="پادها" term_id="pod" >}} برنامه تزریق کنید.

مفهوم ConfigMap به شما امکان می‌دهد مصنوعات پیکربندی را از محتوای ایمیج جدا نگه دارید تا  
برنامه‌های کانتینری‌شده قابل حمل باقی بمانند. برای مثال، می‌توانید یک  
{{< glossary_tooltip text="ایمیج کانتینر" term_id="image" >}} یکسان را برای راه‌اندازی کانتینرها  
برای اهداف توسعه محلی، تست سیستم یا اجرای بارکاری زنده کاربران نهایی دانلود و اجرا کنید.

این صفحه مجموعه‌ای از مثال‌های کاربردی را ارائه می‌دهد که نشان می‌دهد چگونه ConfigMap ایجاد کنید  
و پادها را با استفاده از داده‌های ذخیره‌شده در ConfigMap پیکربندی نمایید.

## {{% heading "پیش‌نیازها" %}}

{{< include "task-tutorial-prereqs.md" >}}

شما باید ابزار `wget` را نصب داشته باشید. اگر ابزاری مانند `curl` دارید و `wget` نصب نیست،  
باید مرحله‌ای را که داده‌های نمونه را دانلود می‌کند مطابق ابزار خود تنظیم کنید.

<!-- steps -->

## ایجاد یک ConfigMap

می‌توانید از `kubectl create configmap` یا از مولد ConfigMap در `kustomization.yaml` برای ایجاد یک ConfigMap استفاده کنید.

### ایجاد ConfigMap با استفاده از `kubectl create configmap`

برای ایجاد ConfigMapها از  
[دایرکتوری‌ها](#create-configmaps-from-directories)،  
[فایل‌ها](#create-configmaps-from-files)  
یا [مقادیر متنی](#create-configmaps-from-literal-values)  
از فرمان `kubectl create configmap` استفاده کنید:

```shell
kubectl create configmap <map-name> <data-source>
```

که در آن \<map-name> نامی است که می‌خواهید به ConfigMap اختصاص دهید و \<data-source> دایرکتوری، فایل یا مقدار متنی است که داده‌ها از آن استخراج می‌شوند.  
نام یک شیء ConfigMap باید یک  
[نام زیردامنه DNS معتبر](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)  
باشد.

وقتی ConfigMap را بر اساس یک فایل ایجاد می‌کنید، کلید در `<data-source>` به‌طور پیش‌فرض نام پایه‌ی فایل خواهد بود و مقدار به‌طور پیش‌فرض محتوای فایل است.

می‌توانید از [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) یا  
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)  
برای دریافت اطلاعات درباره‌ی یک ConfigMap استفاده کنید.

#### ایجاد ConfigMap از یک دایرکتوری {#create-configmaps-from-directories}

می‌توانید از `kubectl create configmap` برای ایجاد ConfigMap از چندین فایل در یک دایرکتوری استفاده کنید.  
وقتی ConfigMap را بر اساس یک دایرکتوری ایجاد می‌کنید، kubectl فایل‌هایی را که نام آن‌ها کلید معتبری است شناسایی می‌کند و هر یک از آن فایل‌ها را در ConfigMap جدید قرار می‌دهد.  
هر ورودی دایرکتوری به جز فایل‌های معمولی نادیده گرفته می‌شود (برای مثال: زیرشاخه‌ها، لینک‌های نمادین، دستگاه‌ها، پایپ‌ها و غیره).

{{< note >}}
نام هر فایلی که برای ایجاد ConfigMap استفاده می‌شود باید تنها شامل کاراکترهای مجاز باشد، که عبارت‌اند از: حروف (`A` تا `Z` و `a` تا `z`)، ارقام (`0` تا `9`)، `-`، `_` یا `.`.  
اگر از `kubectl create configmap` با دایرکتوری‌ای استفاده کنید که نام هر یک از فایل‌هایش شامل کاراکتر نامجاز باشد، ممکن است فرمان `kubectl` با خطا مواجه شود.

فرمان `kubectl` هنگام برخورد با نام فایل نامعتبر، خطایی چاپ نمی‌کند.  
{{< /note >}}

دایرکتوری محلی را ایجاد کنید:

```shell
mkdir -p configure-pod-container/configmap/
```

اکنون، پیکربندی نمونه را دانلود کنید و ConfigMap را ایجاد کنید:

```shell
# فایل‌های نمونه را در دایرکتوری `configure-pod-container/configmap/` دانلود کنید.
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# ایجاد ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

فرمان فوق هر فایل را، در این مثال `game.properties` و `ui.properties`،  
در دایرکتوری `configure-pod-container/configmap/` در ConfigMap با نام game-config بسته‌بندی می‌کند.  
می‌توانید جزئیات ConfigMap را با استفاده از فرمان زیر نمایش دهید:

```shell
kubectl describe configmaps game-config
```

خروجی مشابه این است:
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

فایل‌های `game.properties` و `ui.properties` در دایرکتوری `configure-pod-container/configmap/` در بخش `data` از ConfigMap نمایش داده می‌شوند.

```shell
kubectl get configmaps game-config -o yaml
```
خروجی مشابه این است:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### ایجاد ConfigMaps از فایل‌ها

شما می‌توانید از `kubectl create configmap` برای ایجاد یک ConfigMap از یک فایل منفرد یا از چندین فایل استفاده کنید.

به عنوان مثال،

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

ConfigMap زیر را تولید می‌کند:

```shell
kubectl describe configmaps game-config-2
```

که خروجی آن مشابه این است:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

شما می‌توانید چندین بار آرگومان `--from-file` را برای ایجاد یک ConfigMap از چندین منبع داده ارسال کنید.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

شما می‌توانید جزئیات ConfigMap مربوط به `game-config-2` را با استفاده از دستور زیر نمایش دهید:

```shell
kubectl describe configmaps game-config-2
```

خروجی مشابه این است:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

برای ایجاد یک ConfigMap از یک فایل env، از گزینه `--from-env-file` استفاده کنید، برای مثال:

```shell
# Env-files contain a list of environment variables.
# These syntax rules apply:
#   Each line in an env file has to be in VAR=VAL format.
#   Lines beginning with # (i.e. comments) are ignored.
#   Blank lines are ignored.
#   There is no special handling of quotation marks (i.e. they will be part of the ConfigMap value)).

# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# The env-file `game-env-file.properties` looks like below
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# This comment and the empty line above it are ignored
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

یک ConfigMap تولید می‌کند. مشاهده‌ی ConfigMap:

```shell
kubectl get configmap game-config-env-file -o yaml
```

the output is similar to:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

با شروع از Kubernetes نسخه 1.23 `kubectl` از آرگومان `--from-env-file` پشتیبانی می‌کند که باید چندین بار برای ایجاد یک ConfigMap از چندین منبع داده مشخص شود.

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

ConfigMap زیر را تولید می‌کند:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

که خروجی آن مشابه این است:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

#### کلید مورد استفاده هنگام ایجاد ConfigMap از یک فایل را تعریف کنید

شما می‌توانید هنگام استفاده از آرگومان `--from-file` در بخش `data` از ConfigMap خود، کلیدی غیر از نام فایل را تعریف کنید:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

که در آن `<my-key-name>` کلیدی است که می‌خواهید در ConfigMap استفاده کنید و `<path-to-file>` محل فایل منبع داده‌ای است که می‌خواهید کلید نشان دهد.

برای مثال:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

ConfigMap زیر را تولید می‌کند:
```
kubectl get configmaps game-config-3 -o yaml
```

که خروجی آن مشابه این است:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### ایجاد ConfigMaps از مقادیر تحت‌اللفظی

شما می‌توانید از دستور `kubectl create configmap` به همراه آرگومان `--from-literal` برای تعریف یک مقدار تحت‌اللفظی از خط فرمان استفاده کنید:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

شما می‌توانید چندین جفت کلید-مقدار ارسال کنید. هر جفتی که در خط فرمان ارائه می‌شود، به عنوان یک ورودی جداگانه در بخش `data` از ConfigMap نمایش داده می‌شود.

```shell
kubectl get configmaps special-config -o yaml
```

خروجی مشابه این است:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### ایجاد یک ConfigMap از generator

همچنین می‌توانید یک ConfigMap از generators ایجاد کنید و سپس آن را برای ایجاد شیء در سرور API خوشه اعمال کنید.

شما باید generators را در یک فایل `kustomization.yaml` در یک دایرکتوری مشخص کنید.

#### تولید ConfigMap از فایل‌ها

به عنوان مثال، برای تولید یک ConfigMap از فایل‌های `configure-pod-container/configmap/game.properties`

```shell
# یک فایل kustomization.yaml با ConfigMapGenerator ایجاد کنید
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  options:
    labels:
      game-config: config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

برای ایجاد شیء ConfigMap، دایرکتوری kustomization را اعمال کنید:

```shell
kubectl apply -k .
```
```
configmap/game-config-4-m9dm2f92bt created
```

می‌توانید بررسی کنید که ConfigMap به این صورت ایجاد شده است:

```shell
kubectl get configmap
```
```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s
```

و همچنین:

```shell
kubectl describe configmaps/game-config-4-m9dm2f92bt
```
```
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       game-config=config-4
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

توجه داشته باشید که نام ConfigMap تولیدشده با افزودن پسوندی که از هش محتوا به‌دست می‌آید تکمیل می‌شود. این کار تضمین می‌کند که هر بار که محتوا تغییر کند، یک ConfigMap جدید تولید شود.

#### تعریف کلید برای استفاده هنگام تولید ConfigMap از یک فایل

می‌توانید کلیدی غیر از نام فایل را برای استفاده در مولد ConfigMap تعریف کنید.  
برای مثال، برای تولید ConfigMap از فایل `configure-pod-container/configmap/game.properties`  
با کلید `game-special-key`  

```shell
# یک فایل kustomization.yaml با ConfigMapGenerator ایجاد کنید
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  options:
    labels:
      game-config: config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

برای ایجاد شیء ConfigMap، دایرکتوری kustomization را اعمال کنید.
```shell
kubectl apply -k .
```
```
configmap/game-config-5-m67dt67794 created
```

#### تولید ConfigMap از مقادیر متنی

این مثال نشان می‌دهد چگونه با استفاده از Kustomize و kubectl یک `ConfigMap` از دو جفت کلید/مقدار متنی ایجاد کنید:  
`special.type=charm` و `special.how=very`.  
برای این کار، می‌توانید مولد `ConfigMap` را مشخص کنید.  
فایل `kustomization.yaml` را ایجاد (یا جایگزین) کنید تا محتوای زیر را داشته باشد:

```yaml
---
# محتویات kustomization.yaml برای ایجاد یک ConfigMap از لیترال‌ها
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
```

برای ایجاد شیء ConfigMap، دایرکتوری kustomization را اعمال کنید:
```shell
kubectl apply -k .
```
```
configmap/special-config-2-c92b5mmcf2 created
```

## پاکسازی موقت

قبل از ادامه، برخی از ConfigMaps هایی که ایجاد کرده‌اید را پاک کنید:

```bash
kubectl delete configmap special-config
kubectl delete configmap env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

حال که یاد گرفتید چگونه ConfigMapها را تعریف کنید، می‌توانید به بخش بعدی بروید و بیاموزید چگونه از این اشیاء با Podها استفاده کنید.

---

## تعریف متغیرهای محیطی کانتینر با استفاده از داده‌های ConfigMap

### تعریف یک متغیر محیطی کانتینر با داده‌ای از یک ConfigMap واحد

1. یک متغیر محیطی را به صورت یک جفت کلید-مقدار در یک ConfigMap تعریف کنید:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

2. مقدار `special.how` تعریف‌شده در ConfigMap را به متغیر محیطی `SPECIAL_LEVEL_KEY` در مشخصات Pod اختصاص دهید.

   {{% code_sample file="pods/pod-single-configmap-env-variable.yaml" %}}

   Pod را ایجاد کنید:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   اکنون خروجی Pod شامل متغیر محیطی `SPECIAL_LEVEL_KEY=very` است.

### تعریف متغیرهای محیطی کانتینر با داده از چند ConfigMap

مانند مثال قبلی، ابتدا ConfigMapها را ایجاد کنید.  
در اینجا فایل مانیفستی که استفاده خواهید کرد آورده شده است:

{{% code_sample file="configmap/configmaps.yaml" %}}

* ConfigMap را ایجاد کنید:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

* متغیرهای محیطی را در مشخصات Pod تعریف کنید.

  {{% code_sample file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  Pod را ایجاد کنید:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  اکنون خروجی Pod شامل متغیرهای محیطی `SPECIAL_LEVEL_KEY=very` و `LOG_LEVEL=INFO` است.

  وقتی آماده ادامه هستید، آن Pod و ConfigMap را حذف کنید:
  ```shell
  kubectl delete pod dapi-test-pod --now
  kubectl delete configmap special-config
  kubectl delete configmap env-config
  ```

## پیکربندی تمام جفت‌های کلید-مقدار در یک ConfigMap به‌عنوان متغیرهای محیطی کانتینر

* یک ConfigMap شامل چندین جفت کلید-مقدار ایجاد کنید.

  {{% code_sample file="configmap/configmap-multikeys.yaml" %}}

  ConfigMap را ایجاد کنید:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

* با استفاده از `envFrom` تمام داده‌های ConfigMap را به‌عنوان متغیرهای محیطی کانتینر تعریف کنید. کلید ConfigMap به نام متغیر محیطی در Pod تبدیل می‌شود.

  {{% code_sample file="pods/pod-configmap-envFrom.yaml" %}}

  Pod را ایجاد کنید:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```
  اکنون خروجی Pod شامل متغیرهای محیطی `SPECIAL_LEVEL=very` و `SPECIAL_TYPE=charm` است.

  وقتی آماده ادامه هستید، آن Pod را حذف کنید:
  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

## استفاده از متغیرهای محیطی تعریف‌شده در ConfigMap در دستورات Pod

می‌توانید از متغیرهای محیطی تعریف‌شده در ConfigMap در فیلدهای `command` و `args` کانتینر با استفاده از نحو جایگزینی Kubernetes یعنی `$(VAR_NAME)` استفاده کنید.

برای مثال، مانیفست Pod زیر:

{{% code_sample file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

برای ایجاد آن Pod، فرمان زیر را اجرا کنید:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

آن غلاف خروجی زیر را از کانتینر `test-container` تولید می‌کند:
```shell
kubectl logs dapi-test-pod
```

```
very charm
```

وقتی از ادامه دادن راضی شدید، آن پاد را حذف کنید:
```shell
kubectl delete pod dapi-test-pod --now
```

## افزودن داده‌های ConfigMap به Volume

همان‌طور که در [ایجاد ConfigMap از فایل‌ها](#create-configmaps-from-files) توضیح داده شد، وقتی با استفاده از `--from-file` یک ConfigMap ایجاد می‌کنید، نام فایل به‌عنوان یک کلید در بخش `data` آن ConfigMap ذخیره می‌شود. محتوای فایل تبدیل به مقدار (value) آن کلید می‌شود.

مثال‌های این بخش به ConfigMap‌ای با نام `special-config` اشاره دارند:

{{% code_sample file="configmap/configmap-multikeys.yaml" %}}

ConfigMap را ایجاد کنید:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### پر کردن Volume با داده‌های ذخیره‌شده در یک ConfigMap

نام ConfigMap را در بخش `volumes` مشخصات Pod اضافه کنید.  
این کار داده‌های ConfigMap را به دایرکتوری تعیین‌شده در `volumeMounts.mountPath` (در این مثال، `/etc/config`) اضافه می‌کند. بخش `command` فایل‌های دایرکتوری را با نام‌هایی که با کلیدهای ConfigMap مطابقت دارند، لیست می‌کند.

{{% code_sample file="pods/pod-configmap-volume.yaml" %}}

Pod را ایجاد کنید:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

وقتی پاد اجرا می‌شود، دستور `ls /etc/config/` خروجی زیر را تولید می‌کند:

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

داده‌های متنی با استفاده از رمزگذاری UTF-8 به‌عنوان فایل‌ها نمایش داده می‌شوند. برای استفاده از رمزگذاری کاراکتری دیگر، از `binaryData` استفاده کنید (برای اطلاعات بیشتر به [شیء ConfigMap](/docs/concepts/configuration/configmap/#configmap-object) مراجعه کنید).

{{< note >}}
اگر هر فایلی در دایرکتوری `/etc/config` آن ایمیج کانتینر وجود داشته باشد، اتصال Volume باعث می‌شود آن فایل‌ها از ایمیج غیرقابل دسترس شوند.
{{< /note >}}

وقتی آماده ادامه هستید، آن Pod را حذف کنید:
```shell
kubectl delete pod dapi-test-pod --now
```

### افزودن داده‌های ConfigMap به مسیر خاصی در Volume

برای مشخص کردن مسیر فایل دلخواه برای آیتم‌های خاص ConfigMap، از فیلد `path` استفاده کنید.  
در این مثال، آیتم `SPECIAL_LEVEL` در Volume با نام `config-volume` در مسیر `/etc/config/keys` مونت می‌شود.

{{% code_sample file="pods/pod-configmap-volume-specific-key.yaml" %}}

Pod را ایجاد کنید:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

وقتی پاد اجرا می‌شود، دستور `cat /etc/config/keys` خروجی زیر را تولید می‌کند:

```
very
```

{{< caution >}}
مانند قبل، همه فایل‌های قبلی در دایرکتوری `/etc/config/` حذف خواهند شد.
{{< /caution >}}

آن Pod را حذف کنید:
```shell
kubectl delete pod dapi-test-pod --now
```

### نگاشت کلیدها به مسیرهای خاص و سطح دسترسی فایل

می‌توانید کلیدها را به مسیرهای خاص نگاشت کنید. برای نحو مناسب به بخش مربوطه در راهنمای [Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths) مراجعه کنید.  
می‌توانید مجوزهای POSIX را برای کلیدها تنظیم کنید. برای نحو مناسب به بخش مربوطه در راهنمای [Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys) مراجعه کنید.

### ارجاعات اختیاری

ارجاع به یک ConfigMap ممکن است _اختیاری_ باشد. اگر آن ConfigMap وجود نداشته باشد، حجم مونت‌شده خالی خواهد بود. اگر ConfigMap وجود داشته باشد ولی کلید مورد ارجاع وجود نداشته باشد، آن مسیر زیر نقطه مونت موجود نخواهد بود. برای جزئیات بیشتر به بخش [ConfigMap‌های اختیاری](#optional-configmaps) مراجعه کنید.

### ConfigMapهای مونت‌شده به‌طور خودکار به‌روزرسانی می‌شوند

وقتی یک ConfigMap مونت‌شده به‌روزرسانی می‌شود، محتوای ارائه‌شده نهایتاً به‌روز می‌شود. این موضوع در حالتی که یک ConfigMap با ارجاع اختیاری پس از شروع یک پاد موجود شود نیز صدق می‌کند.

کیوبلیت در هر هماهنگ‌سازی دوره‌ای بررسی می‌کند که آیا ConfigMap مونت‌شده تازه است یا خیر. با این حال، برای دریافت مقدار فعلی ConfigMap از کش محلی مبتنی بر TTL خود استفاده می‌کند. در نتیجه، تأخیر کلی از لحظه‌ای که ConfigMap به‌روزرسانی می‌شود تا لحظه‌ای که کلیدهای جدید به پاد ارائه می‌شوند می‌تواند تا دوره هماهنگ‌سازی کیوبلیت (به‌طور پیش‌فرض ۱ دقیقه) + TTL کش ConfigMapها (به‌طور پیش‌فرض ۱ دقیقه) در کیوبلیت طول بکشد. شما می‌توانید با به‌روزرسانی یکی از annotationهای پاد، یک تازه‌سازی فوری را تحریک کنید.

{{< note >}}
کانتینری که از ConfigMap به‌عنوان حجم [subPath](/docs/concepts/storage/volumes/#using-subpath) استفاده می‌کند، به‌روزرسانی‌های ConfigMap را دریافت نخواهد کرد.
{{< /note >}}

<!-- discussion -->

## درک ConfigMapها و Podها

منبع API نوع ConfigMap داده‌های پیکربندی را به‌صورت جفت‌های کلید-مقدار ذخیره می‌کند. این داده‌ها می‌توانند توسط Podها مصرف شوند یا پیکربندی لازم برای اجزای سیستمی مانند کنترلرها را فراهم کنند. ConfigMap شبیه به [Secrets](/docs/concepts/configuration/secret/) است، اما راهکاری برای کار با رشته‌هایی ارائه می‌دهد که حاوی اطلاعات حساس نیستند. هم کاربران و هم اجزای سیستمی می‌توانند داده‌های پیکربندی را در ConfigMap ذخیره کنند.

{{< note >}}
ConfigMapها باید به فایل‌های properties ارجاع دهند، نه اینکه آن‌ها را جایگزین کنند. به ConfigMap به‌عنوان چیزی مشابه دایرکتوری `/etc` در لینوکس و محتوای آن فکر کنید. برای مثال، اگر از یک ConfigMap یک [Volume در Kubernetes](/docs/concepts/storage/volumes/) ایجاد کنید، هر آیتم داده در ConfigMap به‌عنوان یک فایل مجزا در Volume نمایش داده می‌شود.
{{< /note >}}

فیلد `data` در ConfigMap شامل داده‌های پیکربندی است. همان‌طور که در مثال زیر نشان داده شده، این داده‌ها می‌توانند ساده باشند (مانند propertiesهای جداگانه تعریف‌شده با `--from-literal`) یا پیچیده (مانند فایل‌های پیکربندی یا تکه‌های JSON تعریف‌شده با `--from-file`).

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # مثالی از یک ویژگی ساده که با استفاده از --from-literal تعریف شده است
  example.property.1: hello
  example.property.2: world
  # مثالی از یک ویژگی پیچیده که با استفاده از --from-file تعریف شده است
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

وقتی `kubectl` یک ConfigMap را از ورودی‌هایی که ASCII یا UTF-8 نیستند ایجاد می‌کند، این داده‌ها را در فیلد `binaryData` ConfigMap قرار می‌دهد و نه در `data`. هر دو منبع داده متنی و دودویی می‌توانند در یک ConfigMap ترکیب شوند.

اگر می‌خواهید کلیدهای `binaryData` (و مقادیرشان) را در یک ConfigMap مشاهده کنید، می‌توانید فرمان زیر را اجرا کنید:  

`kubectl get configmap -o jsonpath='{.binaryData}' <name>`


Podها می‌توانند داده‌ها را از یک ConfigMap که از `data` یا `binaryData` استفاده می‌کند بارگذاری کنند.

## ConfigMapهای اختیاری

می‌توانید در مشخصات یک Pod ارجاع به ConfigMap را به‌طور _اختیاری_ علامت‌گذاری کنید.  
اگر آن ConfigMap وجود نداشته باشد، پیکربندی‌ای که داده‌هایش را برای Pod فراهم می‌کند (برای مثال: متغیر محیطی یا حجم مونت‌شده) خالی خواهد بود.  
اگر ConfigMap وجود داشته باشد اما کلید ارجاع‌شده وجود نداشته باشد، داده نیز خالی خواهد بود.

برای مثال، مشخصات Pod زیر یک متغیر محیطی از ConfigMap را به‌عنوان اختیاری علامت‌گذاری می‌کند:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "env"]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: a-config
              key: akey
              optional: true # متغیر را به عنوان اختیاری علامت گذاری کنید
  restartPolicy: Never
```

اگر این پاد را اجرا کنید و ConfigMap‌ای با نام `a-config` وجود نداشته باشد، خروجی خالی خواهد بود.  
اگر این پاد را اجرا کنید و ConfigMap‌ای با نام `a-config` وجود داشته باشد اما آن ConfigMap کلیدی با نام `akey` نداشته باشد، خروجی نیز خالی خواهد بود. اگر برای `akey` در ConfigMap با نام `a-config` مقدار تعیین کنید، این پاد آن مقدار را چاپ کرده و سپس خاتمه می‌یابد.

همچنین می‌توانید حجم‌ها و فایل‌های ارائه‌شده توسط یک ConfigMap را به‌صورت اختیاری علامت‌گذاری کنید. کوبرنتیز همیشه مسیرهای مونت را برای حجم ایجاد می‌کند، حتی اگر ConfigMap یا کلید ارجاع‌شده وجود نداشته باشد. برای مثال، مشخصات پاد زیر حجم ارجاع‌دهنده به یک ConfigMap را به‌صورت اختیاری علامت‌گذاری می‌کند:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "ls /etc/config"]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: no-config
        optional: true # منبع ConfigMap را به عنوان اختیاری علامت گذاری کنید
  restartPolicy: Never
```



## محدودیت‌ها

- شما باید شیء `ConfigMap` را قبل از ارجاع به آن در مشخصات یک Pod ایجاد کنید. به‌عنوان جایگزین، می‌توانید ارجاع به ConfigMap را در مشخصات Pod به‌صورت `optional` علامت‌گذاری کنید (به بخش [ConfigMap‌های اختیاری](#optional-configmaps) مراجعه کنید). اگر به یک ConfigMap که وجود ندارد ارجاع دهید و آن را `optional` علامت نزنید، Pod شروع به کار نخواهد کرد. به‌طور مشابه، ارجاعات به کلیدهایی که در ConfigMap وجود ندارند نیز مانع از راه‌اندازی Pod می‌شوند، مگر اینکه آن ارجاعات کلید را به‌صورت `optional` علامت‌گذاری کنید.

- اگر از `envFrom` برای تعریف متغیرهای محیطی از ConfigMapها استفاده کنید، کلیدهایی که نامعتبر محسوب شوند نادیده گرفته می‌شوند. در این صورت Pod اجازه راه‌اندازی خواهد داشت، اما نام‌های نامعتبر در لاگ وقایع به‌عنوان `InvalidVariableNames` ثبت می‌شوند. پیام لاگ هر کلید نادیده گرفته‌شده را فهرست می‌کند. برای مثال:

  ```shell
  kubectl get events
  ```

  خروجی مشابه این است:
  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

- ConfigMapها در یک {{< glossary_tooltip term_id="namespace" >}} مشخص قرار دارند.  
  Podها می‌توانند تنها به ConfigMapهایی ارجاع دهند که در همان namespace خود Pod قرار دارند.

- نمی‌توانید از ConfigMapها برای  
  {{< glossary_tooltip text="static pods" term_id="static-pod" >}}  
  استفاده کنید، زیرا kubelet این مورد را پشتیبانی نمی‌کند.

## {{% heading "پاک‌سازی" %}}

ConfigMapها و Podهایی که ایجاد کرده‌اید را حذف کنید:

```bash
kubectl delete configmaps/game-config configmaps/game-config-2 configmaps/game-config-3 \
               configmaps/game-config-env-file
kubectl delete pod dapi-test-pod --now

# ممکن است مجموعه بعدی را از قبل حذف کرده باشید
kubectl delete configmaps/special-config configmaps/env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

فایل `kustomization.yaml` که برای تولید ConfigMap استفاده کردید را حذف کنید.:

```bash
rm kustomization.yaml
```

اگر دایرکتوری `configure-pod-container` ایجاد کرده‌اید و دیگر به آن نیازی ندارید، باید آن را نیز حذف کنید، یا آن را به محل سطل زباله / فایل‌های حذف شده منتقل کنید.

```bash
rm -r configure-pod-container
```

## {{% heading "whatsnext" %}}

* یک مثال دنیای واقعی از  
  [پیکربندی Redis با استفاده از ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/) را دنبال کنید.  
* یک مثال از [به‌روزرسانی پیکربندی از طریق ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/) را دنبال کنید.  
