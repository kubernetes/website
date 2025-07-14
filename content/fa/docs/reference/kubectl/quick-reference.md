---
title: مرجع سریع kubectl
reviewers:
- moh0ps
content_type: concept
weight: 10 # highlight it
card:
  name: tasks
  weight: 10
---

<!-- overview -->

این صفحه شامل فهرستی از دستورات و پرچم‌های پرکاربرد `kubectl` است.

{{< توجه >}}
این دستورالعمل‌ها برای کوبرنتیز v{{< skew currentVersion >}} هستند. برای بررسی نسخه، از دستور `kubectl version` استفاده کنید.
{{< /توجه >}}
<!-- body -->

## تکمیل خودکار Kubectl

### BASH

```bash
source <(kubectl completion bash) # برای تنظیم تکمیل خودکار در bash در پوسته فعلی، ابتدا باید بسته bash-completion نصب شود.
echo "source <(kubectl completion bash)" >> ~/.bashrc # تکمیل خودکار را به طور دائم به پوسته bash خود اضافه کنید.
```

همچنین می‌توانید از یک نام مستعار مختصر برای `kubectl` استفاده کنید که با تکمیل نیز کار کند:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # تکمیل خودکار را در zsh در پوسته فعلی تنظیم کنید
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # قابلیت تکمیل خودکار را به طور دائم به پوسته zsh خود اضافه کنید
```

### ماهی

{{< توجه >}}
به kubectl نسخه ۱.۲۳ یا بالاتر نیاز دارد.
{{< /توجه >}}

```bash
echo 'kubectl completion fish | source' > ~/.config/fish/completions/kubectl.fish && source ~/.config/fish/completions/kubectl.fish
```

### نکته‌ای در مورد `--all-namespaces`

اضافه کردن `--all-namespaces` به اندازه کافی مکرر اتفاق می‌افتد که باید از اختصار `--all-namespaces` آگاه باشید:

```kubectl -A```

## زمینه و پیکربندی Kubectl

تنظیم کنید که «kubectl» با کدام خوشه کوبرنتیز ارتباط برقرار کند و اطلاعات پیکربندی را تغییر دهد. برای اطلاعات دقیق پرونده پیکربندی به مستندات [احراز هویت در سراسر خوشه‌ها با kubeconfig
](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) مراجعه کنید.

```bash
kubectl config view # نمایش تنظیمات ادغام‌شده‌ی kubeconfig.

# استفاده هم زمان از چندین پوشه kubeconfig و مشاهده پیکربندی ادغام شده
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# نمایش تنظیمات ادغام‌شده‌ی kubeconfig و داده‌های خام گواهی و اسرار افشا شده
kubectl config view --raw 

# دریافت رمز عبور برای کاربر e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

# گواهی‌نامه را برای کاربر e2e دریافت کنید
kubectl config view --raw -o jsonpath='{.users[?(.name == "e2e")].user.client-certificate-data}' | base64 -d

kubectl config view -o jsonpath='{.users[].name}'    # نمایش اولین کاربر
kubectl config view -o jsonpath='{.users[*].name}'   # دریافت لیست کاربران
kubectl config get-contexts                          # نمایش فهرست زمینه‌ها
kubectl config get-contexts -o name                  # دریافت همه نام‌های زمینه
kubectl config current-context                       # نمایش زمینه فعلی
kubectl config use-context my-cluster-name           # زمینه پیش‌فرض را روی my-cluster-name تنظیم می کند.

kubectl config set-cluster my-cluster-name           # یک ورودی خوشه را در kubeconfig تنظیم می کند

# URL را برای یک سرور پروکسی پیکربندی کنید تا برای درخواست‌های ارسال شده توسط این کلاینت در kubeconfig استفاده شود.
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# یک کاربر جدید به kubeconf خود اضافه کنید که از احراز هویت اولیه پشتیبانی کند
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# فضای نام را برای همه دستورات بعدی kubectl در آن زمینه به طور دائم ذخیره کنید.
kubectl config set-context --current --namespace=ggckad-s2

# با استفاده از یک نام کاربری و فضای نام خاص، یک زمینه تنظیم کنید.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # حذف کاربر foo

# نام مستعار کوتاه برای تنظیم/نمایش زمینه/فضای نام (فقط برای پوسته‌های سازگار با bash و bash کار می‌کند، زمینه فعلی باید قبل از استفاده از kn برای تنظیم فضای نام تنظیم شود)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## اعمال Kubectl

«apply» برنامه‌ها را از طریق پرونده‌هایی که منابع کوبرنتیز را تعریف می‌کنند، مدیریت می‌کند. این دستور از طریق اجرای «kubectl apply» منابع را در یک خوشه ایجاد و به‌روزرسانی می‌کند. این روش، روش پیشنهادی برای مدیریت برنامه‌های کوبرنتیز در محیط عملیاتی است. به [کتاب Kubectl] (https://kubectl.docs.kubernetes.io) مراجعه کنید.

## ایجاد اشیا

تنظیمات کوبرنتیز را می‌توان در YAML یا JSON تعریف کرد. پسوند پرونده های `.yaml`، `.yml` و `.json` قابل استفاده هستند.

```bash
kubectl apply -f ./my-manifest.yaml                 # ایجاد منبع(ها)
kubectl apply -f ./my1.yaml -f ./my2.yaml           # ایجاد از چندین پوشه
kubectl apply -f ./dir                              # ایجاد منبع(ها) در تمام پوشه های تنظیمات در پرونده
kubectl apply -f https://example.com/manifest.yaml  # ایجاد منبع(ها) از نشانی اینترنتی (توجه: این یک دامنه نمونه است و شامل تنظیمات معتبری نیست)
kubectl create deployment nginx --image=nginx       # یک نمونه واحد از nginx را شروع می کند

# یک شغل ایجاد می‌کند که عبارت "Hello World" را چاپ می‌کند.
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# یک CronJob ایجاد می کند که هر دقیقه "Hello World" را چاپ کند
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # مستندات مربوط به تنظیمات پاد را دریافت می کند

# ایجاد چندین شیء YAML از stdin
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# ایجاد یک secret با چندین کلید
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## مشاهده و یافتن منابع

```bash
# دریافت دستورات با خروجی پایه
kubectl get services                          # لیست کردن تمام سرویس‌ها در فضای نام
kubectl get pods --all-namespaces             # لیست کردن تمام پادها در تمام فضاهای نام
kubectl get pods -o wide                      # لیست کردن تمام پادهای موجود در فضای نام فعلی، به همراه جزئیات بیشتر
kubectl get deployment my-dep                 # یک استقرار خاص را فهرست کنید
kubectl get pods                              # لیست کردن تمام پادها در فضای نام
kubectl get pod my-pod -o yaml                # YAML یک پاد را دریافت کنید

# دستوراتی با خروجی طولانی را شرح می دهد
kubectl describe nodes my-node
kubectl describe pods my-pod

# فهرست خدمات مرتب شده بر اساس نام
kubectl get services --sort-by=.metadata.name

# فهرست پادها مرتب شده بر اساس تعداد راه‌اندازی مجدد
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# فهرست کردن درایوهای دائمی مرتب شده بر اساس ظرفیت
kubectl get pv --sort-by=.spec.capacity.storage

# برچسب نسخه همه پادها را با برچسب app=cassandra دریافت کنید
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# بازیابی مقدار یک کلید با نقطه، مثلاً 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# یک مقدار کدگذاری شده با base64 را با استفاده از خط تیره به جای زیرخط (_) بازیابی کنید.
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# دریافت تمام گره‌های کارگر (از یک انتخابگر برای حذف نتایجی که دارای برچسب هستند استفاده کنید)
# با نام 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# تمام پادهای در حال اجرا در فضای نام را دریافت کنید
kubectl get pods --field-selector=status.phase=Running

# دریافت ExternalIP های همه گره ها
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# نام پادهایی که متعلق به یک RC خاص هستند را فهرست کنید
# دستور "jq" برای تبدیل‌هایی که برای jsonpath بسیار پیچیده هستند مفید است، می‌توانید آن را در https://jqlang.github.io/jq/ پیدا کنید.
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# نمایش برچسب‌ها برای همه پادها (یا هر شی دیگر کوبرنتیز که از برچسب‌گذاری پشتیبانی می‌کند)
kubectl get pods --show-labels

# بررسی کنید کدام گره‌ها آماده هستند
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# بررسی کنید که کدام گره‌ها با ستون‌های سفارشی آماده هستند
kubectl get node -o custom-columns='NODE_NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].status'

# رمزهای رمزگشایی شده را بدون ابزار خارجی خروجی بگیرید
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# فهرست کردن تمام secret هایی که در حال حاضر توسط یک پاد استفاده می‌شوند
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# تمام شناسه‌های کانتینرِ از کانتینرِ اولیه‌ی تمام پادها را فهرست کنید.
# هنگام پاک کردن کانتینرهای متوقف شده مفید است، ضمن اینکه از حذف کانتینرهای اولیه جلوگیری می‌کند.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# رویدادهای فهرست‌شده بر اساس زمان
kubectl get events --sort-by=.metadata.creationTimestamp

# فهرست کردن تمام رویدادهای هشدار دهنده
kubectl events --types=Warning

# وضعیت فعلی خوشه را با حالتی که در صورت اعمال تنظیمات، خوشه در آن قرار می‌گرفت مقایسه می‌کند.
kubectl diff -f ./my-manifest.yaml

# یک درخت با دوره محدود از همه کلیدهای بازگشتی برای گره ها تولید می کند
# هنگام یافتن یک کلید در یک ساختار پیچیده JSON تو در تو مفید است
kubectl get nodes -o json | jq -c 'paths|join(".")'

# یک درخت با مرزبندی دوره‌ای از تمام کلیدهای برگردانده شده برای پادها و غیره تولید می کند
kubectl get pods -o json | jq -c 'paths|join(".")'

# ENV را برای همه پادها تولید می کند، با فرض اینکه یک محفظه پیش‌فرض برای پادها دارید، فضای نام پیش‌فرض و دستور «env» پشتیبانی می‌شود.
# هنگام اجرای هر دستور پشتیبانی شده در تمام پادها، نه فقط در `env`، مفید است
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# دریافت زیرمنبع وضعیت یک استقرار
kubectl get deployment nginx-deployment --subresource=status
```

## به‌روزرسانی منابع

```bash
kubectl set image deployment/frontend www=image:v2               # به‌روزرسانی مداوم کانتینرهای "www" از استقرار "frontend"، به‌روزرسانی image
kubectl rollout history deployment/frontend                      # تاریخچه استقرارها از جمله نسخه اصلاح‌شده را بررسی می کند
kubectl rollout undo deployment/frontend                         # بازگشت به استقرار قبلی
kubectl rollout undo deployment/frontend --to-revision=2         # بازگشت به یک ویرایش خاص
kubectl rollout status -w deployment/frontend                    # وضعیت به‌روزرسانی مداوم استقرار «frontend» را تا زمان تکمیل مشاهده می کنید
kubectl rollout restart deployment/frontend                      # راه‌اندازی مجدد تدریجیِ استقرار «frontend»


cat pod.json | kubectl replace -f -                              # جایگزینی یک پاد بر اساس JSON ارسال شده به stdin

# جایگزینی اجباری، حذف و سپس ایجاد مجدد منبع. باعث قطع سرویس خواهد شد.
kubectl replace --force -f ./pod.json

# یک سرویس برای nginx تکثیر شده ایجاد می کند که روی پورت ۸۰ سرویس‌دهی کند و به کانتینرها روی پورت ۸۰۰۰ متصل شود.
kubectl expose rc nginx --port=80 --target-port=8000

# نسخه image (tag) یک پاد تک کانتینری را به نسخه ۴ به‌روزرسانی می کند
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # اضافه کردن برچسب
kubectl label pods my-pod new-label-                             # حذف یک برچسب
kubectl label pods my-pod new-label=new-value --overwrite        # بازنویسی یک مقدار موجود
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # اضافه کردن حاشیه‌نویسی
kubectl annotate pods my-pod icon-url-                           # حذف حاشیه‌نویسی
kubectl autoscale deployment foo --min=2 --max=10                # مقیاس خودکار یک استقرار "foo"
```

## وصله کردن منابع

```bash
# به‌روزرسانی جزئی یک گره
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# به‌روزرسانی image یک کانتینر؛ spec.containers[*].name الزامی است زیرا یک کلید ادغام است.
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# image یک کانتینر را با استفاده از یک وصله json با آرایه‌های موقعیتی به‌روزرسانی می کند
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# غیرفعال کردن استقرار livenessProbe با استفاده از یک وصله json با آرایه‌های موقعیتی
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# یک عنصر جدید به یک آرایه موقعیتی اضافه می کند
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# با وصله کردن زیرمنبع مقیاس، تعداد رونوشت های یک استقرار را به‌روزرسانی می کند
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## ویرایش منابع

هر منبع API را در ویرایشگر دلخواه خود ویرایش کنید.

```bash
kubectl edit svc/docker-registry                      # سرویسی به نام docker-registry را ویرایش می کند
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # از یک ویرایشگر جایگزین استفاده کنید
```

## مقیاس‌بندی منابع

```bash
kubectl scale --replicas=3 rs/foo                                 # مقیاس یک مجموعه رونوشت به نام 'foo' را به 3 تغییر می دهد
kubectl scale --replicas=3 -f foo.yaml                            # مقیاس منبعی که در "foo.yaml" مشخص شده است را به 3 تغییر می دهد
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # اگر اندازه فعلی استقرار با نام mysql برابر با ۲ است، mysql را به ۳ تغییر می دهد
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # مقیاس‌بندی کنترل‌کننده‌های تکثیر چندگانه
```

## حذف منابع

```bash
kubectl delete -f ./pod.json                                      # حذف یک پاد با استفاده از نوع و نام مشخص شده در pod.json
kubectl delete pod unwanted --now                                 # حذف یک پاد بدون مهلت قانونی
kubectl delete pod,service baz foo                                # پادها و سرویس‌هایی با نام‌های مشابه "baz" و "foo" را حذف می کند
kubectl delete pods,services -l name=myLabel                      # پادها و سرویس‌هایی که برچسب name=myLabel دارند را حذف می کند
kubectl -n my-ns delete pod,svc --all                             # تمام پادها و سرویس‌ها را در فضای نام my-ns حذف می کند
# تمام پادهای منطبق با الگوی awk1 یا الگوی awk2 را حذف می کند
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## تعامل با پادهای در حال اجرا

```bash
kubectl logs my-pod                                 # تخلیه گزارش‌های پاد(stdout)
kubectl logs -l name=myLabel                        # گزارش‌های پاد را با برچسب name=myLabel (خروجی استاندارد) جمع‌آوری می کند
kubectl logs my-pod --previous                      # گزارش‌های مربوط به نمونه‌سازی قبلی یک کانتینر را از طریق dump pod (stdout) دریافت می کند
kubectl logs my-pod -c my-container                 # تخلیه گزارش های کانتینر پاد (stdout، نمونه چند کانتینری)
kubectl logs -l name=myLabel -c my-container        # تخلیه گزارش های کانتینر پاد ، با برچسب name=myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # تخلیه گزارش های کانتینر پاد (stdout، حالت چند کانتینری) برای نمونه‌سازی قبلی یک کانتینر
kubectl logs -f my-pod                              # گزارش‌های مربوط به پاد (stdout) نشان می دهد
kubectl logs -f my-pod -c my-container              # گزارش های کانتینر پاد (stdout، نمونه چند کانتینری) نشان می دهد
kubectl logs -f -l name=myLabel --all-containers    # تمام لاگ‌های پادها را با برچسب name=myLabel (خروجی استاندارد) نشان می دهد
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # اجرای پاد به عنوان پوسته تعاملی
kubectl run nginx --image=nginx -n mynamespace      # یک نمونه واحد از nginx پاد را در فضای نام mynamespace شروع می کند
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
                                                    # مشخصات لازم برای اجرای پاد nginx را ایجاد کرده و آن را در پرونده ای به نام pod.yaml می نویسد
kubectl attach my-pod -i                            # به کانتینر در حال اجرا متصل می کند
kubectl port-forward my-pod 5000:6000               # روی پورت ۵۰۰۰ روی دستگاه محلی گوش می دهد و به پورت ۶۰۰۰ روی my-pod باز ارسال میکند
kubectl exec my-pod -- ls /                         # اجرای دستور در پاد موجود (۱ مورد کانتینر)
kubectl exec --stdin --tty my-pod -- /bin/sh        # دسترسی تعاملی پوسته به یک پاد در حال اجرا (۱ مورد کانتینر)
kubectl exec my-pod -c my-container -- ls /         # اجرای دستور در پاد موجود (حالت چند کانتینری)
kubectl debug my-pod -it --image=busybox:1.28       # یک نشست اشکال‌زدایی تعاملی در داخل پاد موجود ایجاد می کند و بلافاصله به آن متصل می شود
kubectl debug node/my-node -it --image=busybox:1.28 # یک نشست اشکال‌زدایی تعاملی روی یک گره ایجاد می کند و بلافاصله به آن متصل می شود
kubectl top pod                                     # نمایش معیارهای مربوط به همه پادها در فضای نام پیش‌فرض
kubectl top pod POD_NAME --containers               # نمایش معیارهای مربوط به یک پاد مشخص و کانتینرهای آن
kubectl top pod POD_NAME --sort-by=cpu              # نمایش معیارهای مربوط به یک پاد مشخص و مرتب‌سازی آن بر اساس «پردازنده» یا «حافظه»
```
## رونوشت گرفتن پوشه ها و پرونده‌ها به و از کانتینرها

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # پرونده محلی ‎/tmp/foo_dir‎ را در ‎/tmp/bar_dir‎ در یک پادِ راه دور در فضای نام فعلی رونوشت می کند.
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # پوشه محلی /tmp/foo را در /tmp/bar در یک پاد راه دور در یک کانتینر خاص کپی می کند
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # پوشه محلی /tmp/foo را در /tmp/bar در یک پاد راه دور در فضای نام my-namespace رونوشت می کند
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # پوشه ‎/tmp/foo‎ از یک پاد راه دور به ‎/tmp/bar‎ به صورت محلی رونوشت می کند
```
{{< توجه >}}
اجرای دستور `kubectl cp` مستلزم وجود پوشه دودویی `tar` در image کانتینر شماست. اگر `tar` موجود نباشد، `kubectl cp` با شکست مواجه خواهد شد. برای موارد استفاده پیشرفته، مانند پیوندهای نمادین، بسط نویسه جانشین یا حفظ حالت پرونده، استفاده از `kubectl exec` را در نظر بگیرید.
{{< /توجه >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # پرونده محلی /tmp/foo را در /tmp/bar در یک پاد راه دور در فضای نام کپی کنید my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # پوشه ‎/tmp/foo‎ از یک پاد راه دور به ‎/tmp/bar‎ به صورت محلی رونوشت می کند
```


## تعامل با استقرارها و سرویس‌ها
```bash
kubectl logs deploy/my-deployment                         # استخراج گزارش های پاد برای یک استقرار (مورد تک کانتینری)
kubectl logs deploy/my-deployment -c my-container         # استخراج گزارش های پاد برای یک استقرار (مورد چند کانتینری)

kubectl port-forward svc/my-service 5000                  # روی پورت محلی ۵۰۰۰ گوش می دهد و به پورت ۵۰۰۰ در سرویس پس زمینه ارسال می کند
kubectl port-forward svc/my-service 5000:my-service-port  # روی پورت محلی ۵۰۰۰ گوش می دهد و به پورت هدف سرویس با نام <my-service-port> باز ارسال می کند

kubectl port-forward deploy/my-deployment 5000:6000       # روی پورت محلی ۵۰۰۰ گوش می دهد و روی یک پاد که توسط <my-deployment> ایجاد شده به پورت ۶۰۰۰ باز ارسال می کند
kubectl exec deploy/my-deployment -- ls                   # اجرای دستور در اولین پاد و اولین کانتینر در استقرار (موارد تک یا چند کانتینری)
```

## تعامل با گره‌ها و خوشه‌ها

```bash
kubectl cordon my-node                                                # گره من را به عنوان غیرقابل برنامه‌ریزی علامت‌گذاری کن
kubectl drain my-node                                                 # تخلیه my-node برای آماده‌سازی جهت تعمیر و نگهداری
kubectl uncordon my-node                                              # گره من را به عنوان قابل برنامه ریزی علامت‌گذاری کن
kubectl top node                                                      # نمایش معیارهای همه گره‌ها
kubectl top node my-node                                              # نمایش معیارهای مربوط به یک گره مشخص
kubectl cluster-info                                                  # نمایش نشانی های master و سرویس‌ها
kubectl cluster-info dump                                             # وضعیت فعلی خوشه را در خروجی استاندارد (stdout) نشان می دهد
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # وضعیت فعلی خوشه را در /path/to/cluster-state ذخیره می کند

# مشاهده‌ی taintهای موجود که روی گره‌های فعلی وجود دارند.
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# اگر یک taint با آن کلید و اثر از قبل وجود داشته باشد، مقدار آن مطابق با مقدار مشخص شده جایگزین می‌شود.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### انواع منابع

تمام انواع منابع پشتیبانی‌شده را به همراه نام‌های کوتاه آن‌ها، [گروه API](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)، اینکه آیا [namespaced](/docs/concepts/overview/working-with-objects/namespaces) هستند یا خیر، و [kind](/docs/concepts/overview/working-with-objects/) فهرست کنید:

```bash
kubectl api-resources
```

سایر عملیات برای کاوش منابع API:

```bash
kubectl api-resources --namespaced=true      # تمام منابع دارای فضای نام
kubectl api-resources --namespaced=false     # تمام منابع بدون فضای نام
kubectl api-resources -o name                # همه منابع با خروجی ساده (فقط نام منبع)
kubectl api-resources -o wide                # تمام منابع با خروجی گسترش‌یافته (معروف به "گسترده")
kubectl api-resources --verbs=list,get       # تمام منابعی که از افعال درخواست «list» و «get» پشتیبانی می‌کنند
kubectl api-resources --api-group=extensions # تمام منابع موجود در گروه API «افزونه‌ها»
```

### قالب‌بندی خروجی

برای نمایش جزئیات در پنجره خط فرمان خود با فرمتی خاص، علامت `-o` (یا `--output`) را به دستور `kubectl` پشتیبانی شده اضافه کنید.

قالب خروجی | توضیحات
--------------| -----------
`-o=custom-columns=<spec>` | چاپ جدول با استفاده از فهرستی از ستون‌های سفارشی که با ویرگول از هم جدا شده‌اند
`-o=custom-columns-file=<filename>` | چاپ یک جدول با استفاده از الگوی ستون‌های سفارشی در پوشه `<filename>`
`-o=go-template=<template>`     | بخش های تعریف شده در [قالب golang](https://pkg.go.dev/text/template) را چاپ کن.
`-o=go-template-file=<filename>` | بخش های تعریف شده توسط [قالب golang](https://pkg.go.dev/text/template) را در پوشه `<filename>` چاپ کن.
`-o=json`     | خروجی یک شیء API با قالب JSON
`-o=jsonpath=<template>` | بخش های تعریف شده در عبارت [jsonpath](/docs/reference/kubectl/jsonpath) را چاپ کن.
`-o=jsonpath-file=<filename>` | بخش های تعریف شده توسط عبارت [jsonpath](/docs/reference/kubectl/jsonpath) را در پوشه `<filename>` چاپ کن.
`-o=name`     | فقط نام منبع را چاپ کن و هیچ چیز دیگری چاپ نکن
`-o=wide`     | خروجی در قالب متن ساده با هرگونه اطلاعات اضافی، و برای پادها، نام گره نیز گنجانده شده است.
`-o=yaml`     | خروجی یک شیء API با قالب YAML

مثال‌هایی با استفاده از `-o=custom-columns`:

```bash
# همه image ها در یک خوشه اجرا می‌شوند
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# تمام image های در حال اجرا در فضای نام: پیش‌فرض، گروه‌بندی شده توسط پاد
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

 # همه image ها به جز "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# همه بخش های تحت فراداده صرف نظر از نام
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

مثال‌های بیشتر در kubectl [مستندات مرجع](/docs/reference/kubectl/#custom-columns).

### حجم خروجی Kubectl و اشکال‌زدایی

حجم اطلاعات Kubectl با استفاده از پرچم‌های `-v` یا `--v` و به دنبال آن یک عدد صحیح که نشان‌دهنده سطح لاگ است، کنترل می‌شود. قراردادهای عمومی ثبت لاگ کوبرنتیز و سطوح لاگ مرتبط با آن [اینجا] (https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md) شرح داده شده‌اند.

حجم اطلاعات | توضیحات
--------------| -----------
`--v=0` | معمولاً برای این مفید است که *همیشه* برای اپراتور خوشه قابل مشاهده باشد.
`--v=1` | اگر نمی‌خواهید اطلاعات زیادی وارد کنید، سطح گزارش پیش‌فرض معقولی است.
`--v=2` | اطلاعات مفید و پایدار در مورد سرویس و پیام‌های لاگ مهم که ممکن است با تغییرات قابل توجه در سیستم مرتبط باشند. این سطح لاگ پیش‌فرض توصیه شده برای اکثر سیستم‌ها است.
`--v=3` | اطلاعات تکمیلی در مورد تغییرات.
`--v=4` | حجم اطلاعات در سطح اشکال‌زدایی.
`--v=5` | حجم اطلاعات در سطح ردیابی.
`--v=6` | نمایش منابع درخواستی
`--v=7` | نمایش هدرهای درخواست HTTP.
`--v=8` | نمایش محتوای درخواست HTTP
`--v=9` | نمایش محتوای درخواست HTTP بدون کوتاه کردن محتوا.

## {{% heading "whatsnext" %}}

* [مروری بر kubectl](/docs/reference/kubectl/) را بخوانید و درباره [JsonPath](/docs/reference/kubectl/jsonpath) اطلاعات کسب کنید.

* گزینه‌های [kubectl](/docs/reference/kubectl/kubectl/) را ببینید.

* همچنین برای آشنایی با نحوه استفاده از kubectl در اسکریپت‌های قابل استفاده مجدد، [قوانین استفاده از kubectl](/docs/reference/kubectl/conventions/) را مطالعه کنید.

* برای اطلاعات بیشتر به انجمن [cheatsheets kubectl] (https://github.com/dennyzhang/cheatsheet-kubernetes-A4) مراجعه کنید.
