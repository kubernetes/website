---
# reviewers:
# - sig-cluster-lifecycle
title: إنشاء عنقود باستخدام كيوبئيديام (kubeadm)
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
باستخدام `kubeadm`، يمكنك إنشاء عنقود كوبيرنيتيس بأقل المتطلبات قابل للعمل ومتوافق مع أفضل الممارسات..
في الواقع، يمكنك استخدام `kubeadm` لإعداد عنقود من شأنها اجتياز
[اختبارات المطابقة](/blog/2017/10/software-conformance-certification/).
`kubeadm` كما يدعم وظائف دورة حياة العنقود الأخرى، مثل
[الرموز المميزة للافلاع التمهيدي](/docs/reference/access-authn-authz/bootstrap-tokens/) والترقيات العنقودية.

الـ `kubeadm` أداة جيدة إذا كنت في حاجة إلى:

- طريقة بسيطة يمكنك من خلالها تجربة كوبيرنيتيس وربما للمرة الأولى.
- طريقة للمستخدمين الموجودين لإعداد عنقود أتوماتيكيا واختبار تطبيقاتهم.
- وحدة بناء في النظام البيئي و/أو أدوات التثبيت أخرى ذات نطاق أوسع.

يمكنك تثبيت واستخدام كيوبئيديام على أجهزة مختلفة: جهازك المحمول، الخوادم السحابية و راسبيري باي وأكثر. سواء كنت تنشر في
السحابة أو أجهزة محلية، يمكنك دمج كيوبئيديام في أنظمة التزويد مثل
مثل أنسيبل أو ترافورم.



## {{% heading "prerequisites" %}}


لاتباع هذا الدليل، تحتاج إلى:

- جهاز واحد أو أكثر يعمل بنظام تشغيل لينكس متوافق مع صيغة حزم برمجيات ديب أو آربیام على سبيل المثال: أوبونتو أو سينت أو إس.
- 2 جيجا بايت أو أكثر من ذاكرة الوصول العشوائي لكل جهاز أقل من ذلك لا يترك مساحة كبيرة لتطبيقاتك.
- ما لا يقل عن وحدتي معالجة على الجهاز الذي تستخدمه كعقدة مستوى تحكم.
- شبكة اتصال كامل بين جميع الأجهزة في العنقود. يمكنك استخدام شبكة عامة أو خاصة.


تحتاج أيضًا إلى استخدام إصدار كيوبئيديام الذي يمكنه نشر إصدار
كوبيرنيتيس الذي تريد استخدامه في العنقود الجديد.

[نسخة إصدار كوبيرنيتيس و سياسة دعم النسخة](/docs/setup/release/version-skew-policy/#supported-versions)
ينطبق على كيوبئيديام وكذلك على كوبيرنيتيس بشكل عام.
تحقق من هذه السياسة للتعرف على إصدارات كوبيرنيتيس وكيوبئيديام.
المدعومة. هذه الصفحة مكتوبة لكوبيرنيتيس {{< param "version" >}}.

المرحلة العامة لأداة كيوبئيديام هي نسخة متاحة. بعض الميزات الفرعية
لا تزال قيد التطوير النشط. قد يتغير تنفيذ إنشاء عنقود
قليلاً مع تطور الأداة، ولكن التنفيذ الإجمالي مستقرًا إلى حد ما.

{{< note >}}
أي أوامر ضمن كيوبئيديام ألفا تكون، حسب التعريف، مدعومة على مستوى ألفا.
{{< /note >}}



<!-- steps -->

## الأهداف

* تثبيت عنقود كوبيرنيتيس أحادي مستوى تحكم
* قم بتثبيت شبكة الحجيرة على العنقود حتى تتمكن حجيرات الخاصة بك من القيام
   بالتحدث الى بعضهم البعض

## تعليمات

### إعداد الأجهزة المستضيفة

#### تثبيت المكونات

ثبت {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}} و كيوبئيديام على جميع المستضيفين.
للحصول على تعليمات مفصلة والمتطلبات الأساسية الأخرى, أنظر [تثبيت كيوبئيديام](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
إذا قمت بالفعل بتثبيت كيوبئيديام فراجع أول خطوتين من ملف كيوبئيديام
[ترقية عقد لينكس](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) مستند للحصول على إرشادات حول كيفية ترقية كيوبئيديام.

عند الترقية، تتم إعادة تشغيل كيوبلات كل بضع ثوانٍ أثناء انتظاره لكيوبئيديام في حلقة الانهيار
 ليقول لها ما يجب القيام به. هذا الانهيار متوقع وطبيعي.
بعد تهيئة مستوى التحكم الخاص بك، ستعمل كيوبلات بشكل طبيعي.
{{< /note >}}

#### إعداد الشبكة

يحاول كيوبئيديام على غرار مكونات كوبيرنيتيس الأخرى، العثور على عنوان آي بي صالح للاستخدام
واجهات الشبكة المرتبطة بالبوابة الافتراضية على المستضيف. هذه
يتم بعد ذلك استخدام عنوان آي بي للإعلان و/أو الاستماع الذي يقوم به أحد المكونات.

لمعرفة عنوان اﻵي بي على مستضيف لينكس يمكنك استخدام:

```shell
ip route show # ابحث عن السطر الذي يبدأ بـ "default via"
```

{{< note >}}
في حالة وجود بوابتين افتراضيتين أو أكثر على المستضيف، فسيقوم مكون كوبيرنيتيس بمحاولة استخدام أول عنوان آي بي عالمي مناسب للبث الأحادي.
أثناء إجراء هذا الاختيار، قد يختلف الترتيب الدقيق للبوابات بين مختلف
أنظمة التشغيل وإصدارات النواة.
{{< /note >}}

لا تقبل مكونات كوبيرنيتيس واجهة الشبكة المخصصة،
ولذلك يجب تمرير عنوان آي بي مخصص كعلامة إلى كافة وحدات المكونات
التي تحتاج إلى مثل هذا الاعداد المخصص.

{{< note >}}
إذا لم يكن لدى المستضيف بوابة افتراضية و لم يتم تمرير عنوان آي بي مخصص
إلى مكون كوبيرنيتيس قد يخرج المكون مع حدوث خطأ.
{{< /note >}}

لتكوين خادم واجهة برمجة التطبيقات (خادم و ب ت)، قم بالإعلان عن عنوان لعقدة مستوى التحكم التي تم إنشاؤها باستخدام كل من
`init` و `join`, يمكن استخدام العلامة `--apiserver-advertise-address`.
ويفضل, ضبط هذا الخيار في [واجهة برمجة التطبيقات كيوبئيديام ](/docs/reference/config-api/kubeadm-config.v1beta3)
ك `InitConfiguration.localAPIEndpoint` و `JoinConfiguration.controlPlane.localAPIEndpoint`.

كيوبلات على جميع العقد, `--node-ip` يمكن تمرير الخيار
`.nodeRegistration.kubeletExtraArgs` داخل ملف اعداد كيوبئيديام
(`InitConfiguration` أو `JoinConfiguration`).

للحصول على المكدس المزدوج، انظر
[دعم المكدس المزدوج في كيوبئيديام](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

تصبح عناوين آي بي التي تقوم بتعيينها في مكونات مستوى التحكم جزءًا من شهادات X.509 الخاصة بها
حقول الاسم البديل للموضوع. قد يتطلب تغيير عناوين آي بي
توقيع شهادات جديدة وإعادة تشغيل المكونات المتأثرة، حتى يتم التغيير
وتنعكس ملفات الشهادة. أنظر
[تجديد الشهادة يدوياً](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
لمزيد من التفاصيل حول هذا الموضوع.

{{< warning >}}
يوصي مشروع كوبيرنيتيس بعدم اتباع نهج (تكوين جميع وحدات المكونات
مع عناوين آي بي المخصصة). بدلاً من ذلك، يوصي مشرفو كوبيرنيتيس بإعداد شبكة المستضيف،
بحيث يكون عنوان آي بي للبوابة الافتراضية هو الذي تكتشفه مكونات كوبيرنيتيس وتستخدمه تلقائيًا.
في عقد لينكس يمكنك استخدام أوامر مثل `ip Route` لإعداد الشبكة؛ التشغيل الخاص بك
قد يوفر النظام أيضًا مستوى أعلى من الأدوات لإدارة الشبكة. إذا كانت البوابة الافتراضية للعقدة الخاصة بك
هو عنوان آي بي عام، فيجب عليك إعداد تصفية الحزم أو إجراءات الأمان الأخرى التي
تحمي العقد والعنقود.
{{< /warning >}}

### تحضير صور الحاويات المطلوبة

هذه الخطوة اختيارية وتطبق فقط اذا كنت ترغب في ذلك `kubeadm init` و `kubeadm join`
لعدم تنزيل صور الحاويات الافتراضية المستضافة في `registry.k8s.io`.

لدى كيوبئيديام أوامر يمكنها مساعدتك في سحب الصور المطلوبة مسبقًا
عند إنشاء عنقود دون أن تكون عقده متصلة بالإنترنت.
أنظر [تشغيل كيوبئيديام دون الإتصال بالإنترنت](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
لمزيد من التفاصيل.

يتيح لك كيوبئيديام استخدام مستودع صور مخصص للصور المطلوبة.
أنظر [استخدام الصور المخصصة](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
لمزيد من التفاصيل.

### تهيئة عقدة مستوى التحكم

عقدة مستوى التحكم هو الجهاز الذي يعمل فيه مكونات مستوى التحكم، بما في ذلك
{{< glossary_tooltip term_id="إتسيدي" >}} (قاعدة بيانات العنقود) و
{{< glossary_tooltip text="خادم و ب ت" term_id="kube-apiserver" >}}
(الذين تتواصل معهم أداة سطر الأوامر {{< glossary_tooltip text="كيوبكاتل" term_id="kubectl" >}}).

1. (ينصح ب) إذا كنت تخطط لترقية مستوى التحكم الأحادي في عنقود كيوبئيديام
إلى الإتاحة بشدة يجب عليك تحديد `--control-plane-endpoint` لوضع نقطة النهاية المشتركة 
لجميع عقد مستوى التحكم نقطة نهاية تكون إما إسم دي أن أس أو عنوان آي بي للموزع الأحمال 
1.  إختر مضاف عليه لشبكة حجيرات والتحقق إذا كان يحتاج إلى أي تعليمات تضاف إلى `kubeadm init`، إعتمادا على مزود الطرف الثالث الذي تختار، قد تحتاج إلى إضافة `--pod-network-cidr` إلى قيمة خاصة المزود, أنظر [تثبيت مضاف عليه لشبكة الحجيرات](#pod-network).
1. (Optional) `kubeadm` tries to detect the container runtime by using a list of well
known endpoints. To use different container runtime or if there are more than one installed
on the provisioned node, specify the `--cri-socket` argument to `kubeadm`. See
[تثبيت وقت التشغيل](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

1، (إختياري) يحاول `kubeadm` اكتشاف وقت تشغيل الحاوية باستخدام قائمة من
نقاط النهاية المعروفة جيدا. لاستخدام وقت تشغيل حاوية مختلف أو إذا كان هناك أكثر من حاوية مثبتة
في العقدة المتوفرة، حدد التعليمة `--cri-socket` إلى `kubeadm`. أنظر
[تثبيت وقت التشغيل](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

لتهيئة عقدة مستوى التحكم، قم بتشغيل:

```bash
kubeadm init <args>
```

### اعتبارات حول apiserver-advertise-address وControlPlaneEndpoint

While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.

`--control-plane-endpoint` allows both IP addresses and DNS names that can map to IP addresses.
Please contact your network administrator to evaluate possible solutions with respect to such mapping.

Here is an example mapping:

```
192.168.0.102 cluster-endpoint
```

Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in an
high availability scenario.

Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.

### More information

For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).

To configure `kubeadm init` with a configuration file see
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

To customize control plane components, including optional IPv6 assignment to liveness probe
for control plane components and etcd server, provide extra arguments to each component as documented in
[custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).

If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.

`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
After it finishes you should see:

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

To make kubectl work for your non-root user, run these commands, which are
also part of the `kubeadm init` output:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Alternatively, if you are the `root` user, you can run:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
The kubeconfig file `admin.conf` that `kubeadm init` generates contains a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. The group `kubeadm:cluster-admins`
is bound to the built-in `cluster-admin` ClusterRole.
Do not share the `admin.conf` file with anyone.

`kubeadm init` generates another kubeconfig file `super-admin.conf` that contains a certificate with
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a break-glass, super user group that bypasses the authorization layer (for example RBAC).
Do not share the `super-admin.conf` file with anyone. It is recommended to move the file to a safe location.

See
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
on how to use `kubeadm kubeconfig user` to generate kubeconfig files for additional users.
{{< /warning >}}

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).

The token is used for mutual authentication between the control-plane node and the joining
nodes. The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Installing a Pod network add-on {#pod-network}

{{< caution >}}
This section contains important information about networking setup and
deployment order.
Read all of this advice carefully before proceeding.

**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**

- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).

- By default, `kubeadm` sets up your cluster to use and enforce use of
  [RBAC](/docs/reference/access-authn-authz/rbac/) (role based access
  control).
  Make sure that your Pod network plugin supports RBAC, and so do any manifests
  that you use to deploy it.

- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm should be CNI agnostic and the validation of CNI providers is out of the scope of our current e2e testing.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
{{< /note >}}

Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).

See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:

```bash
kubectl apply -f <add-on.yaml>
```

You can install only one Pod network per cluster.

Once a Pod network has been installed, you can confirm that it is working by
checking that the CoreDNS Pod is `Running` in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS Pod is up and running, you can continue by joining your nodes.

If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.

### Managed node labels

By default, kubeadm enables the [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
admission controller that restricts what labels can be self-applied by kubelets on node registration.
The admission controller documentation covers what labels are permitted to be used with the kubelet `--node-labels` option.
The `node-role.kubernetes.io/control-plane` label is such a restricted label and kubeadm manually applies it using
a privileged client after a node has been created. To do that manually you can do the same by using `kubectl label`
and ensure it is using a privileged kubeconfig such as the kubeadm managed `/etc/kubernetes/admin.conf`.

### Control plane node isolation

By default, your cluster will not schedule Pods on the control plane nodes for security
reasons. If you want to be able to schedule Pods on the control plane nodes,
for example for a single machine Kubernetes cluster, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

The output will look something like:

```
node "test-01" untainted
...
```

This will remove the `node-role.kubernetes.io/control-plane:NoSchedule` taint
from any nodes that have it, including the control plane nodes, meaning that the
scheduler will then be able to schedule Pods everywhere.

### Joining your nodes {#join-nodes}

The nodes are where your workloads (containers and Pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* [Install a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)
  if needed
* Run the command that was output by `kubeadm init`. For example:

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

If you do not have the token, you can get it by running the following command on the control-plane node:

```bash
kubeadm token list
```

The output is similar to this:

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

By default, tokens expire after 24 hours. If you are joining a node to the cluster after the current token has expired,
you can create a new token by running the following command on the control-plane node:

```bash
kubeadm token create
```

The output is similar to this:

```console
5didvk.d09sbcov8ph2amjw
```

If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the
following command chain on the control-plane node:

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

The output is similar to:

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[2001:db8::101]:2073`.
{{< /note >}}

The output should look something like:

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the control-plane node.

{{< note >}}
As the cluster nodes are usually initialized sequentially, the CoreDNS Pods are likely to all run
on the first control-plane node. To provide higher availability, please rebalance the CoreDNS Pods
with `kubectl -n kube-system rollout restart deployment coredns` after at least one new node is joined.
{{< /note >}}

### (Optional) Controlling your cluster from machines other than the control-plane node

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
privileges by using `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Optional) Proxying API Server to localhost

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

You can now access the API Server locally at `http://localhost:8001/api/v1`

## Clean up {#tear-down}

If you used disposable servers for your cluster, for testing, you can
switch those off and do no further clean up. You can use
`kubectl config delete-cluster` to delete your local references to the
cluster.

However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.

### Remove the node

Talking to the control-plane node with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Before removing the node, reset the state installed by `kubeadm`:

```bash
kubeadm reset
```

The reset process does not reset or clean up iptables rules or IPVS tables. If you wish to reset iptables, you must do so manually:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

If you want to reset the IPVS tables, you must run the following command:

```bash
ipvsadm -C
```

Now remove the node:
```bash
kubectl delete node <node name>
```

If you wish to start over, run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

### Clean up the control plane

You can use `kubeadm reset` on the control plane host to trigger a best-effort
clean up.

See the [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
reference documentation for more information about this subcommand and its
options.



<!-- discussion -->

## What's next {#whats-next}

* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/).
* See the [Cluster Networking](/docs/concepts/cluster-administration/networking/) page for a bigger list
  of Pod network add-ons.
* <a id="other-addons" />See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to
  explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp;
  control of your Kubernetes cluster.
* Configure how your cluster handles logs for cluster events and from
  applications running in Pods.
  See [Logging Architecture](/docs/concepts/cluster-administration/logging/) for
  an overview of what is involved.

### Feedback {#feedback}

* For bugs, visit the [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit the
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack channel
* General SIG Cluster Lifecycle development Slack channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle mailing list:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

## Version skew policy {#version-skew-policy}

While kubeadm allows version skew against some components that it manages, it is recommended that you
match the kubeadm version with the versions of the control plane components, kube-proxy and kubelet.

### kubeadm's skew against the Kubernetes version

kubeadm can be used with Kubernetes components that are the same version as kubeadm
or one version older. The Kubernetes version can be specified to kubeadm by using the
`--kubernetes-version` flag of `kubeadm init` or the
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta3/)
field when using `--config`. This option will control the versions
of kube-apiserver, kube-controller-manager, kube-scheduler and kube-proxy.

Example:
* kubeadm is at {{< skew currentVersion >}}
* `kubernetesVersion` must be at {{< skew currentVersion >}} or {{< skew currentVersionAddMinor -1 >}}

### kubeadm's skew against the kubelet

Similarly to the Kubernetes version, kubeadm can be used with a kubelet version that is the same
version as kubeadm or one version older.

Example:
* kubeadm is at {{< skew currentVersion >}}
* kubelet on the host must be at {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}}, {{< skew currentVersionAddMinor -2 >}} or {{< skew currentVersionAddMinor -3 >}}

### kubeadm's skew against kubeadm

There are certain limitations on how kubeadm commands can operate on existing nodes or whole clusters
managed by kubeadm.

If new nodes are joined to the cluster, the kubeadm binary used for `kubeadm join` must match
the last version of kubeadm used to either create the cluster with `kubeadm init` or to upgrade
the same node with `kubeadm upgrade`. Similar rules apply to the rest of the kubeadm commands
with the exception of `kubeadm upgrade`.

Example for `kubeadm join`:
* kubeadm version {{< skew currentVersion >}} was used to create a cluster with `kubeadm init`
* Joining nodes must use a kubeadm binary that is at version {{< skew currentVersion >}}

Nodes that are being upgraded must use a version of kubeadm that is the same MINOR
version or one MINOR version newer than the version of kubeadm used for managing the
node.

Example for `kubeadm upgrade`:
* kubeadm version {{< skew currentVersionAddMinor -1 >}} was used to create or upgrade the node
* The version of kubeadm used for upgrading the node must be at {{< skew currentVersionAddMinor -1 >}}
or {{< skew currentVersion >}}

To learn more about the version skew between the different Kubernetes component see
the [Version Skew Policy](/releases/version-skew-policy/).

## Limitations {#limitations}

### Cluster resilience {#resilience}

The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.

Workarounds:

* Regularly [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.

* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Platform compatibility {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Multiplatform container images for the control plane and addons are also supported since v1.12.

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

## Troubleshooting {#troubleshooting}

If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

