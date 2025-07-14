---
title: خودترمیمی کوبرنتیز  
content_type: concept  
weight: 50  
feature:
  title: خودترمیمی
  anchor: بازیابی خودکار از آسیب
  description: >
    کوبرنتیز کانتینرهایی که از کار می‌افتند را مجدداً راه‌اندازی می‌کند، در صورت نیاز کل Podها را جایگزین می‌کند، در پاسخ به خرابی‌های گسترده‌تر، فضای ذخیره‌سازی را دوباره متصل می‌کند و می‌تواند با مقیاس‌پذیرهای خودکار گره ادغام شود تا حتی در سطح گره نیز خود را ترمیم کند.
---
<!-- overview -->

کوبرنتیز با قابلیت‌های خودترمیمی طراحی شده است که به حفظ سلامت و در دسترس بودن بارهای کاری کمک می‌کند. این سیستم به طور خودکار کانتینرهای خراب را جایگزین می‌کند، بارهای کاری را در صورت از دسترس خارج شدن گره‌ها مجدداً برنامه‌ریزی می‌کند و تضمین می‌کند که وضعیت مطلوب سیستم حفظ شود.

<!-- body -->

## Self-Healing capabilities {#self-healing-capabilities} 

- **Container-level restarts:** If a container inside a Pod fails, Kubernetes restarts it based on the [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Replica replacement:** If a Pod in a [Deployment](/docs/concepts/workloads/controllers/deployment/) or [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) fails, Kubernetes creates a replacement Pod to maintain the specified number of replicas.
  If a Pod fails that is part of a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) fails, the control plane
  creates a replacement Pod to run on the same node.
  
- **Persistent storage recovery:** If a node is running a Pod with a PersistentVolume (PV) attached, and the node fails, Kubernetes can reattach the volume to a new Pod on a different node.

- **Load balancing for Services:** If a Pod behind a [Service](/docs/concepts/services-networking/service/) fails, Kubernetes automatically removes it from the Service's endpoints to route traffic only to healthy Pods.

Here are some of the key components that provide Kubernetes self-healing:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Ensures that containers are running, and restarts those that fail.

- **ReplicaSet, StatefulSet and DaemonSet controller:** Maintains the desired number of Pod replicas.

- **PersistentVolume controller:** Manages volume attachment and detachment for stateful workloads.

## Considerations {#considerations} 

- **Storage Failures:** If a persistent volume becomes unavailable, recovery steps may be required.

- **Application Errors:** Kubernetes can restart containers, but underlying application issues must be addressed separately.

## {{% heading "whatsnext" %}} 

- Read more about [Pods](/docs/concepts/workloads/pods/)
- Learn about [Kubernetes Controllers](/docs/concepts/architecture/controller/)
- Explore [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Read about [node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/). Node autoscaling
  also provides automatic healing if or when nodes fail in your cluster.