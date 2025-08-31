---
title: عیب‌یابی kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

مانند هر برنامه دیگری، ممکن است در نصب یا اجرای kubeadm با خطایی مواجه شوید.
این صفحه برخی از سناریوهای رایج خرابی را فهرست کرده و مراحلی را ارائه داده است که می‌تواند به شما در درک و رفع مشکل کمک کند.

اگر مشکل شما در لیست زیر نیست، لطفاً مراحل زیر را دنبال کنید:

- اگر فکر می‌کنید مشکل شما یک باگ در kubeadm است:
  - به [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) بروید و مشکلات موجود را جستجو کنید.
  - اگر مشکلی وجود ندارد، لطفاً [یکی را باز کنید](https://github.com/kubernetes/kubeadm/issues/new) و الگوی مشکل را دنبال کنید.

- اگر در مورد نحوه‌ی کار kubeadm مطمئن نیستید، می‌توانید در [Slack](https://slack.k8s.io/) در `#kubeadm` سوال خود را بپرسید، یا در [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes) سوالی مطرح کنید. لطفاً برچسب‌های مرتبط مانند `#kubernetes` و `#kubeadm` را وارد کنید تا دیگران بتوانند به شما کمک کنند.

<!-- body -->

## به دلیل عدم وجود RBAC، امکان اتصال یک گره(node) نسخه ۱.۱۸ به یک خوشه(cluster) نسخه ۱.۱۷ وجود ندارد.

در نسخه ۱.۱۸ kubeadm، در صورتی که گره‌ای با نام مشابه از قبل وجود داشته باشد، امکان جلوگیری از پیوستن آن به یک گره(node) در خوشه(cluster) اضافه شد. این امر مستلزم اضافه کردن RBAC برای کاربر bootstrap-token بود تا بتواند یک شیء گره(node) را دریافت کند.

با این حال، این مسئله باعث می‌شود که `kubeadm join` از نسخه ۱.۱۸ نتواند به خوشه(cluster) که توسط kubeadm نسخه ۱.۱۷ ایجاد شده است، بپیوندد.

برای حل مشکل، دو گزینه دارید:

دستور `kubeadm init phase bootstrap-token` را روی یک گره(node) control-plane با استفاده از kubeadm نسخه ۱.۱۸ اجرا کنید.

توجه داشته باشید که این دستور بقیه مجوزهای bootstrap-token را نیز فعال می‌کند.

یا

RBAC زیر را به صورت دستی با استفاده از `kubectl apply -f ...` اعمال کنید:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## پرونده(فایل) اجرایی `ebtables` یا پرونده(فایل) اجرایی مشابه آن در حین نصب پیدا نشد.

اگر هنگام اجرای `kubeadm init` هشدارهای زیر را مشاهده کردید

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

پس ممکن است `ebtables`، `ethtool` یا یک پرونده(فایل) اجرایی مشابه را روی گره(node) خود نداشته باشید. می‌توانید آنها را با دستورات زیر نصب کنید:

- برای کاربران اوبونتو/دبیان، دستور `apt install ebtables ethtool` را اجرا کنید.
- برای کاربران CentOS/Fedora، دستور `yum install ebtables ethtool` را اجرا کنید.

## گروه های kubeadm در هنگام نصب در انتظار control plane هستند

اگر متوجه شدید که `kubeadm init` پس از چاپ خط زیر هنگ می‌کند:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

این ممکن است ناشی از تعدادی از مشکلات باشد. رایج‌ترین آنها عبارتند از:

- مشکلات اتصال شبکه. قبل از ادامه، بررسی کنید که دستگاه شما اتصال کامل به شبکه دارد.
- درایور cgroup مربوط به مجری کانتینر با درایور kubelet متفاوت است. برای درک نحوه پیکربندی صحیح آن، به [پیکربندی درایور cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) مراجعه کنید.
- کانتینرهای control plane دچار crash loop یا هنگ شده‌اند. می‌توانید این مورد را با اجرای `docker ps` و بررسی هر کانتینر با اجرای `docker logs` بررسی کنید. برای سایر کانتینرهای زمان اجرا، به [اشکال‌زدایی گره‌های Kubernetes با crictl](/docs/tasks/debug/debug-cluster/crictl/) مراجعه کنید.

## kubeadm هنگام حذف کانتینرهای مدیریت‌شده، مسدود می‌شود

اگر مجری کانتینر متوقف شود و هیچ کانتینری که توسط کوبرنتیز مدیریت می‌شود را حذف نکند، موارد زیر ممکن است رخ دهد:

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

یک راه حل ممکن، راه اندازی مجدد مجری کانتینر و سپس اجرای مجدد `kubeadm reset` است. همچنین می‌توانید از `crictl` برای اشکال زدایی وضعیت مجری کانتینر استفاده کنید. به [اشکال زدایی گره‌های کوبرنتیز با crictl](/docs/tasks/debug/debug-cluster/crictl/) مراجعه کنید.

## پادها در وضعیت‌های `RunContainerError`، `CrashLoopBackOff` یا `Error`

درست پس از `kubeadm init` نباید هیچ پادی در این حالت‌ها وجود داشته باشد.

- اگر پادها درست بعد از `kubeadm init` در یکی از این حالت‌ها هستند، لطفاً یک مشکل را در مخزن kubeadm باز کنید. `coredns` (یا `kube-dns`) باید تا زمانی که افزونه شبکه را مستقر نکرده‌اید، در حالت `Pending` باشد.
- اگر پس از نصب افزونه شبکه، Pods را در حالت‌های `RunContainerError`، `CrashLoopBackOff` یا `Error` مشاهده کردید و هیچ اتفاقی برای `coredns` (یا `kube-dns`) نیفتاد، به احتمال زیاد افزونه Pod Network که نصب کرده‌اید به نحوی خراب است. ممکن است مجبور شوید امتیازات RBAC بیشتری به آن اعطا کنید یا از نسخه جدیدتری استفاده کنید. لطفاً مشکل را در ردیاب مشکلات ارائه دهندگان Pod Network ثبت کنید و مشکل را در آنجا بررسی کنید.

## «coredns» در حالت «در انتظار» گیر کرده است

این **انتظار** می‌رود و بخشی از طراحی است. kubeadm مستقل از ارائه‌دهنده شبکه است، بنابراین مدیر باید افزونه شبکه pod را نصب کند (/docs/concepts/cluster-administration/addons/). شما باید قبل از اینکه CoreDNS به طور کامل مستقر شود، یک افزونه Pod Networ  نصب کنید. از این رو، قبل از راه‌اندازی شبکه، در حالت «در انتظار» قرار دارد.

## سرویس‌های HostPort کار نمی‌کنند

قابلیت‌های «HostPort» و «HostIP» بسته به ارائه‌دهنده‌ی شبکه‌ی پاد شما در دسترس هستند. لطفاً برای اطلاع از در دسترس بودن قابلیت‌های «HostPort» و «HostIP» با نویسنده‌ی افزونه‌ی Pod Network  تماس بگیرید.

ارائه دهندگان CNI مربوط به Calico، Canal و Flannel تأیید شده‌اند که از HostPort پشتیبانی می‌کنند.

برای اطلاعات بیشتر، به [مستندات نقشه پورت CNI] (https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md) مراجعه کنید.

اگر ارائه دهنده شبکه شما از افزونه portmap CNI پشتیبانی نمی‌کند، ممکن است لازم باشد از [ویژگی NodePort سرویس‌ها](/docs/concepts/services-networking/service/#type-nodeport) استفاده کنید یا از `HostNetwork=true` استفاده کنید.

## پادها از طریق سرویس IP خود قابل دسترسی نیستند

- بسیاری از افزونه‌های شبکه هنوز [hairpin mode](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip) را فعال نمی‌کنند که به پادها اجازه می‌دهد از طریق Service IP خود به خودشان دسترسی داشته باشند. این مشکلی مربوط به [CNI](https://github.com/containernetworking/cni/issues/476) است. لطفاً برای دریافت آخرین وضعیت پشتیبانی از حالت hairpin با ارائه‌دهنده افزونه شبکه تماس بگیرید.

- اگر از VirtualBox (مستقیماً یا از طریق Vagrant) استفاده می‌کنید، باید مطمئن شوید که `hostname -i` یک نشانی(آدرس) IP قابل مسیریابی را برمی‌گرداند. به طور پیش‌فرض، اولین رابط به یک شبکه فقط میزبان غیرقابل مسیریابی متصل است. یک راه حل، تغییر `/etc/hosts` است، برای مثال به این [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) مراجعه کنید.

## خطاهای گواهی TLS

خطای زیر نشان‌دهنده‌ی عدم تطابق احتمالی گواهی است.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- تأیید کنید که پرونده(فایل) `$HOME/.kube/config` حاوی یک گواهی معتبر است و در صورت لزوم یک گواهی را بازسازی کنید. گواهی‌های موجود در پرونده(فایل) kubeconfig با کد base64 کدگذاری شده‌اند. دستور `base64 --decode` می‌تواند برای رمزگشایی گواهی و دستور `openssl x509 -text -noout` می‌تواند برای مشاهده اطلاعات گواهی استفاده شود.

- متغیر محیطی `KUBECONFIG` را با استفاده از دستور زیر غیرفعال کنید:

  ```sh
  unset KUBECONFIG
  ```

 یا آن را روی مکان پیش‌فرض `KUBECONFIG` تنظیم کنید:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- یک راه حل دیگر، بازنویسی `kubeconfig` موجود برای کاربر "admin" است:

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## عدم موفقیت در چرخش گواهی کلاینت Kubelet {#-گواهی-مشتری kubelet}

به طور پیش‌فرض، kubeadm با استفاده از پیوند نمادین `/var/lib/kubelet/pki/kubelet-client-current.pem` که در `/etc/kubernetes/kubelet.conf` مشخص شده است، یک kubelet با چرخش خودکار گواهینامه‌های کلاینت پیکربندی می‌کند.
اگر این فرآیند چرخش با شکست مواجه شود، ممکن است خطاهایی مانند `x509: certificate has expired or is not yet valid` در لاگ‌های kube-apiserver مشاهده کنید. برای رفع مشکل، باید این مراحل را دنبال کنید:

1. از پرونده‌های `/etc/kubernetes/kubelet.conf` و `/var/lib/kubelet/pki/kubelet-client*` پشتیبان تهیه کرده و آنها را از گره‌ی خراب حذف کنید.
1. از یک گره control plane فعال در خوشه(cluster) ای که `/etc/kubernetes/pki/ca.key` دارد، دستور `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf` را اجرا کنید. `$NODE` باید روی نام گره(node) خراب موجود در خوشه(cluster) تنظیم شود. `kubelet.conf` حاصل را به صورت دستی تغییر دهید تا نام خوشه(cluster) و نقطه پایانی سرور تنظیم شود، یا `kubeconfig user --config` را به آن بدهید (به [ایجاد پرونده‌های kubeconfig برای کاربران اضافی](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users) مراجعه کنید). اگر خوشه(cluster) شما `ca.key` را ندارد، باید گواهی‌های تعبیه شده در `kubelet.conf` را به صورت خارجی امضا کنید.
1. پرونده(فایل) `kubelet.conf` حاصل را در `/etc/kubernetes/kubelet.conf` روی گره‌ی خراب‌شده کپی کنید.
1. Kubelet (`systemctl restart kubelet`) را روی گره(node) خراب‌شده مجدداً راه‌اندازی کنید و منتظر بمانید تا `/var/lib/kubelet/pki/kubelet-client-current.pem` دوباره ایجاد شود.
1. پرونده(فایل) `kubelet.conf` را به صورت دستی ویرایش کنید تا به گواهی‌های کلاینت kubelet چرخانده شده اشاره کند، برای این کار `client-certificate-data` و `client-key-data` را با موارد زیر جایگزین کنید:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. kubelet را مجدداً راه اندازی کنید.
1. مطمئن شوید که گره(node) به حالت «آماده» (Ready) درآمده است.

## کارت شبکه پیش‌فرض هنگام استفاده از flannel به عنوان شبکه پاد در Vagrant

خطای زیر ممکن است نشان دهد که مشکلی در شبکه پاد وجود دارد:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- اگر از flannel به عنوان شبکه pod در Vagrant استفاده می‌کنید، باید نام رابط پیش‌فرض flannel را مشخص کنید.

  Vagrant معمولاً دو رابط به همه ماشین‌های مجازی اختصاص می‌دهد. رابط اول که به همه میزبان‌ها نشانی IP `10.0.2.15` اختصاص داده شده است، برای ترافیک خارجی است که NAT می‌شود.

  این ممکن است منجر به مشکلاتی در flannel شود، که به طور پیش‌فرض روی اولین رابط روی یک میزبان قرار می‌گیرد.

  این امر باعث می‌شود همه میزبان‌ها فکر کنند که نشانی IP عمومی یکسانی دارند. برای جلوگیری از این،
  پرچم "--face eth1" را به flannel ارسال کنید تا رابط دوم انتخاب شود.

## IP غیر عمومی مورد استفاده برای کانتینرها

در برخی شرایط، دستورات `kubectl logs` و `kubectl run` ممکن است در یک خوشه(cluster) با عملکرد عادی، خطاهای زیر را نشان دهند:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- این ممکن است به دلیل استفاده کوبرنتیز از یک IP باشد که نمی‌تواند با IP های دیگر در زیرشبکه به ظاهر یکسان ارتباط برقرار کند، احتمالاً به دلیل سیاست ارائه دهنده دستگاه.
- DigitalOcean یک IP عمومی به `eth0` و همچنین یک IP خصوصی برای استفاده داخلی به عنوان لنگر برای ویژگی IP شناور خود اختصاص می‌دهد، اما `kubelet` دومی را به جای IP عمومی به عنوان `IP داخلی` گره(node) انتخاب می‌کند.

  برای بررسی این سناریو به جای `ifconfig` از `ip addr show` استفاده کنید زیرا `ifconfig` نشانی(آدرس) IP مستعار متخلف را نمایش نمی‌دهد. به عنوان یک جایگزین، یک نقطه پایانی API مخصوص `DigitalOcean` امکان جستجوی IP لنگر را از سرور مجازی فراهم می‌کند:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

 راه حل این است که با استفاده از `--node-ip` به `kubelet` بگویید از کدام IP استفاده کند. هنگام استفاده از DigitalOcean، در صورت تمایل به استفاده از شبکه خصوصی اختیاری، می‌تواند IP عمومی (اختصاص داده شده به `eth0`) یا IP خصوصی (اختصاص داده شده به `eth1`) باشد. برای این کار می‌توان از بخش `kubeletExtraArgs` از ساختار kubeadm[`NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions) استفاده کرد.

 سپس `kubelet` را مجدداً راه اندازی کنید:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## پادهای `coredns` دارای وضعیت `CrashLoopBackOff` یا `Error` هستند

اگر گره‌هایی دارید که SELinux را با نسخه قدیمی‌تر Docker اجرا می‌کنند، ممکن است با سناریویی مواجه شوید که در آن پادهای `coredns` شروع به کار نمی‌کنند. برای حل این مشکل، می‌توانید یکی از گزینه‌های زیر را امتحان کنید:

- به [نسخه جدیدتر Docker](/docs/setup/production-environment/container-runtimes/#docker) ارتقا دهید.

- [SELinux را غیرفعال کنید](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- پرونده استقرار `coredns` را تغییر دهید تا `allowPrivilegeEscalation` بر روی `true` تنظیم شود:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

یکی دیگر از دلایل بروز خطای «CrashLoopBackOff» در CoreDNS زمانی است که یک CoreDNS Pod مستقر در کوبرنتیز یک حلقه را تشخیص دهد. [چندین راه حل](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters) برای جلوگیری از تلاش کوبرنتیز برای راه‌اندازی مجدد CoreDNS Pod هر بار که CoreDNS حلقه را تشخیص داده و خارج می‌شود، در دسترس هستند.

{{< caution >}}
غیرفعال کردن SELinux یا تنظیم allowPrivilegeEscalation روی true می‌تواند امنیت خوشه(cluster) شما را به خطر بیندازد.
{{< /caution >}}

## پادهای etcd مرتباً مجدداً راه‌اندازی می‌شوند

اگر با خطای زیر مواجه شدید:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

این مشکل در صورتی ظاهر می‌شود که CentOS 7 را با Docker 1.13.1.84 اجرا کنید.
این نسخه از Docker می‌تواند از اجرای kubelet در کانتینر etcd جلوگیری کند.

برای حل مشکل، یکی از این گزینه‌ها را انتخاب کنید:

- بازگشت به نسخه قبلی داکر، مانند 1.13.1-75

  ```
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- یکی از نسخه‌های پیشنهادی جدیدتر، مانند ۱۸.۰۶ را نصب کنید:

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## ارسال لیستی از مقادیر جدا شده با ویرگول به مولفه های داخل پرچم `--component-extra-args` امکان‌پذیر نیست.

پرچم‌های `kubeadm init` مانند `--component-extra-args` به شما امکان می‌دهند مولفه‌های سفارشی را به یک جزء control plane مانند kube-apiserver ارسال کنید. با این حال، این مکانیسم به دلیل نوع داده‌ای که برای تجزیه مقادیر استفاده می‌شود (`mapStringString`) محدود است.

اگر تصمیم دارید مولفه ای را ارسال کنید که از چندین مقدار جدا شده با ویرگول مانند
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"` پشتیبانی می‌کند، این پرچم با
`flag: malformed pair, expect string=string` با شکست مواجه خواهد شد. این اتفاق می‌افتد زیرا لیست مولفه‌ها برای
`--apiserver-extra-args` انتظار جفت‌های `key=value` را دارد و در این حالت `NamespacesExists` به عنوان کلیدی در نظر گرفته می‌شود که مقداری از آن کم است.

به عنوان یک روش جایگزین، می‌توانید جفت‌های `key=value` را به این صورت از هم جدا کنید:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
اما این باعث می‌شود که کلید `enable-admission-plugins` فقط مقدار `NamespaceExists` را داشته باشد.

یک راه حل شناخته شده، استفاده از kubeadm [پرونده(فایل) پیکربندی](/docs/reference/config-api/kubeadm-config.v1beta4/) است.

## kube-proxy قبل از مقداردهی اولیه گره(node) توسط cloud-controller-manager برنامه‌ریزی شده است

در سناریوهای ارائه دهنده ابر، kube-proxy می‌تواند قبل از اینکه cloud-controller-manager نشانی‌های گره(node) را مقداردهی اولیه کند، روی گره‌های کارگر جدید برنامه‌ریزی شود. این باعث می‌شود kube-proxy نتواند نشانی(آدرس) IP گره(node) را به درستی دریافت کند و تأثیرات جانبی بر عملکرد پروکسی که متعادل‌کننده‌های بار را مدیریت می‌کند، داشته باشد.

خطای زیر در kube-proxy Pods قابل مشاهده است:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

یک راه حل شناخته شده، وصله کردن kube-proxy DaemonSet است تا امکان زمان‌بندی آن روی گره‌های control plane صرف نظر از شرایط آنها فراهم شود و تا زمانی که شرایط محافظت اولیه آنها کاهش یابد، از گره‌های دیگر دور نگه داشته شود:

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

موضوع ردیابی این مشکل [اینجا](https://github.com/kubernetes/kubeadm/issues/1027) است.

## `/usr` روی گره‌ها فقط خواندنی نصب شده است {#usr-mounted-read-only}

در توزیع‌های لینوکس مانند Fedora CoreOS یا Flatcar Container Linux، پوشه(folder) `/usr` به عنوان یک فایل سیستم فقط خواندنی نصب می‌شود. برای [پشتیبانی از flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md)، اجزای کوبرنتیز مانند kubelet و kube-controller-manager از مسیر پیش‌فرض `/usr/libexec/kubernetes/kubelet-plugins/volume/exec/` استفاده می‌کنند، با این حال پوشه(folder) flex-volume باید قابل نوشتن باشد تا این ویژگی کار کند.

{{< note >}}
FlexVolume در نسخه کوبرنتیز v1.23 منسوخ شد.
{{< /note >}}

برای حل این مشکل، می‌توانید پوشه(folder) flex-volume را با استفاده از kubeadm پیکربندی کنید. [پرونده(فایل) پیکربندی](/docs/reference/config-api/kubeadm-config.v1beta4/).

در گره(node) کنترل اصلی (که با استفاده از `kubeadm init` ایجاد شده است)، پرونده(فایل) زیر را با استفاده از `--config` ارسال کنید:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

در مورد اتصال گره‌ها:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

به عنوان یک روش جایگزین، می‌توانید `/etc/fstab` را تغییر دهید تا mount `/usr` قابل نوشتن شود، اما لطفاً توجه داشته باشید که این کار، یک اصل طراحی توزیع لینوکس را تغییر می‌دهد.

## برنامه ارتقاء kubeadm پیام خطای « context deadline exceeded» را چاپ می‌کند.

این پیام خطا هنگام ارتقاء یک خوشه(cluster) کوبرنتیز با `kubeadm` در صورت اجرای یک etcd خارجی نشان داده می‌شود. این یک اشکال بحرانی نیست و به این دلیل اتفاق می‌افتد که نسخه‌های قدیمی‌تر kubeadm بررسی نسخه را روی خوشه(cluster) etcd خارجی انجام می‌دهند. می‌توانید با `kubeadm upgrade apply ...` ادامه دهید.

این مشکل از نسخه ۱.۱۹ برطرف شده است.

## `kubeadm reset`  «/var/lib/kubelet» را از حالت وصل خارج می‌کند

اگر `/var/lib/kubelet` در حالت متصل باشد، انجام `kubeadm reset` عملاً آن را از حالت متصل خارج می‌کند.

برای حل این مشکل، پس از انجام عملیات `kubeadm reset`، پوشه(folder) `/var/lib/kubelet` را دوباره متصل کنید.

این یک پسرفت است که در kubeadm نسخه ۱.۱۵ معرفی شد. این مشکل در نسخه ۱.۲۰ برطرف شده است.

## نمی‌توان از سرور متریک به صورت امن در خوشه(cluster) kubeadm استفاده کرد.

در یک خوشه(cluster) kubeadm، می‌توان با ارسال `--kubelet-insecure-tls` به [metrics-server](https://github.com/kubernetes-sigs/metrics-server) به صورت ناامن از آن استفاده کرد. این روش برای خوشه(cluster) های عملیاتی توصیه نمی‌شود.

اگر می‌خواهید از TLS بین سرور metrics و kubelet استفاده کنید، مشکلی وجود دارد، زیرا kubeadm یک گواهی سرویس خودامضا برای kubelet مستقر می‌کند. این می‌تواند باعث خطاهای زیر در سمت سرور metrics شود:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

برای درک نحوه پیکربندی kubeletها در یک خوشه(cluster) kubeadm برای داشتن گواهی‌های سرویس‌دهی امضا شده، به [فعال‌سازی گواهی‌های سرویس‌دهی امضا شده kubelet](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs) مراجعه کنید.

همچنین به [نحوه اجرای امن سرور metrics] (https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely) مراجعه کنید.

## به دلیل تغییر نکردن هش etcd، ارتقا با شکست مواجه می‌شود

فقط برای ارتقاء یک گره control plane با پرونده(فایل) دودویی(باینری) kubeadm نسخه ۱.۲۸.۳ یا بالاتر، که در حال حاضر توسط نسخه‌های kubeadm نسخه‌های ۱.۲۸.۰، ۱.۲۸.۱ یا ۱.۲۸.۲ مدیریت می‌شود، قابل اجرا است.

در اینجا پیام خطایی که ممکن است با آن مواجه شوید آمده است:

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

پیام خطایی که ممکن است با آن مواجه شوید این است: دلیل این خطا این است که نسخه‌های آسیب‌دیده یک پرونده(فایل) تنظیمات etcd با پیش‌فرض‌های ناخواسته در PodSpec تولید می‌کنند. این منجر به ایجاد تفاوت در مقایسه تنظیمات می‌شود و kubeadm انتظار تغییر در هش Pod را دارد، اما kubelet هرگز هش را به‌روزرسانی نمی‌کند.

اگر این مشکل را در خوشه(cluster) خود مشاهده کردید، دو راه برای حل آن وجود دارد:

- ارتقاء etcd را می‌توان با استفاده از دستور زیر بین نسخه‌های آسیب‌دیده و نسخه ۱.۲۸.۳ (یا بالاتر) نادیده گرفت:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  این کار در صورتی که نسخه جدید etcd توسط نسخه بعدی وصله v1.28 معرفی شده باشد، توصیه نمی‌شود.

- قبل از ارتقا، تنظیمات مربوط به پاد ثابت  etcd را وصله کنید تا ویژگی‌های پیش‌فرض مشکل‌ساز حذف شوند:

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

اطلاعات بیشتر در مورد این اشکال را می‌توانید در [ردیابی مشکل](https://github.com/kubernetes/kubeadm/issues/2927) بیابید.