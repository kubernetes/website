---
title: "ساختار cluster"
weight: 30
description: >
  مفهوم‌های ساختاری پشت کوبرنتیز.
---
یک کلاستر کوبرنتیز از یک کنترل‌گر (control plane) به علاوه تعدادی سیستم کارگر (worker node) به نام نود تشکیل شده است که اپلیکیشن های کانیتری شده را اجرا می کنند. هر کلاستر دست کم به یک نود کارگر برای اجرای پاد ها نیاز دارد.

نود (های) کارگر پاد هایی را میزبانی می‌کنند که اجزای کارهای برنامه هستند. کنترل‌گر مدیریت کننده نود های کارگر و پاد های داخل کلاستر است.

در محیط های عملیاتی٬ کنترل‌گر عموما بین چند کامپیوتر اجرا می‌شود و یک کلاستر معمولا نود های زیادی را اجرا می‌کند تا تحمل خطا و دسترسی پذیری بالاتری داشته باشد.

این مستنداجزای مختلفی را که برای یک کلاستر کارآمد و کامل کوبرنتیز نیاز دارید را شرح می‌دهد.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy." caption="Figure 1. Kubernetes cluster components." class="diagram-large" >}}

{{< details summary="درباره این ساختار" >}}
دیاگرام در تصویر۱٬ یک مثال از ساختار کلاستر کوبرنتیز است.
توزیع واقعی اجزا ممکن است بسته به تنظیمات کلاستر و نیازمندی های آن٬ متفاوت باشد.

در دیاگرام٬ هر نود یک عنصر به نام [`kube-proxy`](#kubeproxy) اجرا می کند. شما به یک عنصر پروکسی شبکه روی هرنود نیاز دارید تا مطمئن شوید
{{< glossary_tooltip text="Service" term_id="سرویس">}} API و عملکرد های مرتبط روی شبکه کلاستر شما در دسترس هستند. اگرچه٬ برخی افزونه های شبکه٬ پروکسی های شخص ثالث خودرا ارائه می‌کنند. 
 وقتی از این افزونه ها استفاده کنید٬ به `kube-proxy` نیازی نیست.
{{< /details >}}

## عنصر Control plane

عنصر Control Plane تصمیمات اصلی کلاستر را می‌گیرد (برای مثال٬ زمان‌بندی)٬ همینطور یافتن و پاسخدهی به رویداد های کلاستر٬ (برای مثال٬ راه اندازی یک 
{{< glossary_tooltip text="پاد" term_id="pod">}} وقتی که قسمت
`{{< glossary_tooltip text="replicas" term_id="replica" >}}` در Deployment تعیین نشده است).

اجزای Control plane می‌تواند روی هر کامپیوتری در کلاستر اجرا شود. اگرچه٬ برای سادگی٬ اسکریپت راه اندازی معمولا تمام اجزا Control plane را در یک سیستم نصب می‌کند٬ و کانتینر های کاربر را روی آن اجرا نمی کند.
ببنید: [ساخت کلاستر با دسترسی پذیری بالا با Kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) به عنوان یک مثال از Contorl plane ای که روی کامپیوتر های متعددی نصب شده است.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

انواع زیادی از کنترل‌کننده ها وجود دارد. برخی نمونه ها:

- Node controller: مسئول باخبر سازی و پاسخدهی وقتی که یک نود پایین می‌آید.
- Job controller: منتظر نوعی از کار ها که نمایانگر وظایف تک دفعه ای هستند می‌ماند٬ سپس Pod هایی می‌سازد تا آن وظایف تا پایان٬ اجرا کنند.
- EndpointSlice controller: EndpointSlice ها را پر می کند. (برای ایجاد ارتباط بین سرویس ها و Pod ها)
Populates EndpointSlice objects (to provide a link between Services and Pods).
- ServiceAccount controller: برای یک namespace جدید٬ ServiceAccounts جدید می‌سازد.


فهرست بالا٬ نمونه جامعی نیست.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-manager فقط کنترل‌کننده هایی اجرا می‌کند که مختص سرویس‌دهنده ابری شما است.
اگر در فضای خودتان یا محیط آموزشی روی کامپیوتر شخصی خود از کوبرنتیز استفاده می کنید٬ کلاستر cloud controller manager ندارد.

به همراه <>٬ <> چند 
As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can scale
horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

- Node controller: For checking the cloud provider to determine if a node has been
  deleted in the cloud after it stops responding
- Route controller: For setting up routes in the underlying cloud infrastructure
- Service controller: For creating, updating and deleting cloud provider load balancers

---

## Node components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (optional) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
If you use a [network plugin](#network-plugins) that implements packet forwarding for Services
by itself, and providing equivalent behavior to kube-proxy, then you do not need to run
kube-proxy on the nodes in your cluster.

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc) to implement cluster features.
Because these are providing cluster-level features, namespaced resources for
addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons,
please see [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

While the other addons are not strictly required, all Kubernetes clusters should have
[cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment,
which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose,
web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications
running in the cluster, as well as the cluster itself.

### Container resource monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
records generic time-series metrics about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible
for saving container logs to a central log store with a search/browsing interface.

### Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
are software components that implement the container network interface (CNI) specification.
They are responsible for allocating IP addresses to pods and enabling them to communicate
with each other within the cluster.

## Architecture variations

While the core components of Kubernetes remain consistent, the way they are deployed and
managed can vary. Understanding these variations is crucial for designing and maintaining
Kubernetes clusters that meet specific operational needs.

### Control plane deployment options

The control plane components can be deployed in several ways:

Traditional deployment
: Control plane components run directly on dedicated machines or VMs, often managed as systemd services.

Static Pods
: Control plane components are deployed as static Pods, managed by the kubelet on specific nodes.
  This is a common approach used by tools like kubeadm.

Self-hosted
: The control plane runs as Pods within the Kubernetes cluster itself, managed by Deployments
  and StatefulSets or other Kubernetes primitives.

Managed Kubernetes services
: Cloud providers often abstract away the control plane, managing its components as part of their service offering.

### Workload placement considerations

The placement of workloads, including the control plane components, can vary based on cluster size,
performance requirements, and operational policies:

- In smaller or development clusters, control plane components and user workloads might run on the same nodes.
- Larger production clusters often dedicate specific nodes to control plane components,
  separating them from user workloads.
- Some organizations run critical add-ons or monitoring tools on control plane nodes.

### Cluster management tools

Tools like kubeadm, kops, and Kubespray offer different approaches to deploying and managing clusters,
each with its own method of component layout and management.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.

### Customization and extensibility

Kubernetes architecture allows for significant customization:

- Custom schedulers can be deployed to work alongside the default Kubernetes scheduler or to replace it entirely.
- API servers can be extended with CustomResourceDefinitions and API Aggregation.
- Cloud providers can integrate deeply with Kubernetes using the cloud-controller-manager.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.

## {{% heading "whatsnext" %}}

Learn more about the following:

- [Nodes](/docs/concepts/architecture/nodes/) and
  [their communication](/docs/concepts/architecture/control-plane-node-communication/)
  with the control plane.
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) which is the default scheduler for Kubernetes.
- Etcd's official [documentation](https://etcd.io/docs/).
- Several [container runtimes](/docs/setup/production-environment/container-runtimes/) in Kubernetes.
- Integrating with cloud providers using [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) commands.
