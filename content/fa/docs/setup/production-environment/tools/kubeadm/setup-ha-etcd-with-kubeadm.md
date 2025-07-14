---
reviewers:
- sig-cluster-lifecycle
title: راه‌اندازی خوشه etcd با قابلیت دسترسی بالا  با kubeadm
content_type: task
weight: 70
---

<!-- overview -->


به طور پیش‌فرض، kubeadm یک نمونه etcd محلی را روی هر گره صفحه کنترل اجرا می‌کند.

همچنین می‌توان با خوشه etcd به عنوان خارجی رفتار کرد و نمونه‌های etcd را روی میزبان‌های جداگانه آماده‌سازی کرد. تفاوت‌های بین این دو رویکرد در صفحه [گزینه‌هایی برای توپولوژی با دسترسی بالا](/docs/setup/production-environment/tools/kubeadm/ha-topology) پوشش داده شده است.

این وظیفه، فرآیند ایجاد یک خوشه خارجی etcd با دسترسی بالا از سه عضو را بررسی می‌کند که می‌توانند توسط kubeadm در طول ایجاد خوشه مورد استفاده قرار گیرند.

## {{% heading "Prerequisites" %}}

- سه میزبان که می‌توانند از طریق پورت‌های TCP 2379 و 2380 با یکدیگر ارتباط برقرار کنند. این سند این پورت‌های پیش‌فرض را در نظر گرفته است. با این حال، آنها از طریق پرونده پیکربندی kubeadm قابل تنظیم هستند.
- هر میزبان باید systemd و یک پوسته سازگار با bash نصب شده داشته باشد.
- هر میزبان باید [یک مجری کانتینر، kubelet و kubeadm نصب شده داشته باشد](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- هر میزبان باید به رجیستری پرونده image کانتینر کوبرنتیز (`registry.k8s.io`) دسترسی داشته باشد یا پرونده image از etcd مورد نیاز را با استفاده از `kubeadm config images list/pull` فهرست/دریافت کند. این راهنما نمونه‌های etcd را به عنوان [static pods](/docs/tasks/configure-pod-container/static-pod/) که توسط یک kubelet مدیریت می‌شود، تنظیم می‌کند.
- برخی زیرساخت‌ها برای کپی کردن پرونده‌ها بین میزبان‌ها. به عنوان مثال `ssh` و `scp` می‌توانند این نیاز را برآورده کنند.

<!-- steps -->

## راه‌اندازی خوشه

رویکرد کلی این است که تمام گواهینامه‌ها روی یک گره تولید شوند و فقط پرونده‌های لازم بین گره‌های دیگر توزیع شوند.

{{< توجه >}}
kubeadm شامل تمام ابزارهای رمزنگاری لازم برای تولید گواهی‌های شرح داده شده در زیر است؛ برای این مثال به هیچ ابزار رمزنگاری دیگری نیاز نیست.
{{< /توجه >}}

{{< توجه >}}
مثال‌های زیر از نشانی‌های IPv4 استفاده می‌کنند، اما می‌توانید kubeadm، kubelet و etcd را نیز برای استفاده از نشانی‌های IPv6 پیکربندی کنید. Dual-stack توسط برخی از گزینه‌های Kubernetes پشتیبانی می‌شود، اما توسط etcd پشتیبانی نمی‌شود. برای جزئیات بیشتر در مورد پشتیبانی از Dual-stack در Kubernetes، به [پشتیبانی Dual-stack با kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/) مراجعه کنید.
{{< /توجه >}}

1. kubelet را طوری پیکربندی کنید که به عنوان مدیر سرویس برای etcd عمل کند.

   {{< توجه >}}شما باید این کار را روی هر میزبانی که etcd باید در آن اجرا شود، انجام دهید.{{< /توجه >}}
   از آنجایی که etcd ابتدا ایجاد شده است، شما باید با ایجاد یک پرونده واحد جدید که اولویت بالاتری نسبت به پرونده واحد kubelet ارائه شده توسط kubeadm دارد، اولویت سرویس را لغو کنید.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Replace "systemd" with the cgroup driver of your container runtime. The default value in the kubelet is "cgroupfs".
   # Replace the value of "containerRuntimeEndpoint" for a different container runtime if needed.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   وضعیت kubelet را بررسی کنید تا مطمئن شوید که در حال اجرا است.

   ```sh
   systemctl status kubelet
   ```

1. ایجاد پرونده‌های پیکربندی برای kubeadm.

   با استفاده از اسکریپت زیر، یک پرونده پیکربندی kubeadm برای هر میزبانی که قرار است یک عضو etcd روی آن اجرا شود، ایجاد کنید.

   ```sh
   # Update HOST0, HOST1 and HOST2 with the IPs of your hosts
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Update NAME0, NAME1 and NAME2 with the hostnames of your hosts
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Create temp directories to store files that will end up on other hosts
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. مرجع صدور گواهی را ایجاد کنید.

   اگر از قبل یک CA دارید، تنها کاری که باید انجام دهید کپی کردن پرونده‌های `crt` و `key` مربوط به CA در `/etc/kubernetes/pki/etcd/ca.crt` و `/etc/kubernetes/pki/etcd/ca.key` است. پس از کپی کردن این پرونده‌ها، به مرحله بعدی، "ایجاد گواهینامه برای هر عضو" بروید.

   اگر از قبل CA ندارید، این دستور را روی `$HOST0` (جایی که پرونده‌های پیکربندی kubeadm را ایجاد کرده‌اید) اجرا کنید.

   ```
   kubeadm init phase certs etcd-ca
   ```

   این دو پرونده را ایجاد می‌کند:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. ایجاد گواهی برای هر عضو

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # cleanup non-reusable certificates
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # No need to move the certs because they are for HOST0

   # clean up certs that should not be copied off this host
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. کپی گواهینامه‌ها و پیکربندی‌های kubeadm.

   گواهینامه‌ها ایجاد شده‌اند و اکنون باید به میزبان‌های مربوطه منتقل شوند.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. اطمینان حاصل کنید که همه پرونده‌های مورد انتظار وجود دارند.

   لیست کامل پرونده‌های مورد نیاز در `$HOST0` به شرح زیر است:

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   روی `$HOST1`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   روی `$HOST2`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. تنظیمات ثابت پاد را ایجاد کنید.

   حالا که گواهینامه‌ها و پیکربندی‌ها آماده شده‌اند، وقت آن رسیده که تنظیمات را ایجاد کنیم. روی هر میزبان، دستور `kubeadm` را اجرا کنید تا یک تنظیمات ثابت برای etcd ایجاد شود.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. اختیاری: سلامت خوشه را بررسی کنید.

    اگر `etcdctl` در دسترس نباشد، می‌توانید این ابزار را درون یک پرونده image  کانتینر اجرا کنید. شما می‌توانید این کار را مستقیماً با مجری کانتینر خود با استفاده از ابزاری مانند `crictl run` انجام دهید و نه از طریق کوبرنتیز.

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - مقدار `${HOST0}` را برابر با نشانی IP میزبانی که در حال آزمایش آن هستید، قرار دهید.


## {{% heading "What's next?" %}}

زمانی که یک خوشه etcd با ۳ عضو فعال داشتید، می‌توانید با استفاده از [روش etcd خارجی با kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) به راه‌اندازی یک صفحه کنترل با دسترسی‌پذیری بالا ادامه دهید.