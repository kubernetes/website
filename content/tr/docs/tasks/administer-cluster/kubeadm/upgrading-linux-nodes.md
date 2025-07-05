---
title: Linux düğümlerini yükseltme
content_type: task
weight: 40
---

<!-- overview -->

Bu sayfa, kubeadm ile oluşturulan bir Linux İşçi Düğümünü nasıl yükselteceğinizi açıklar.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* [kubeadm kümenizin geri kalanını yükseltme süreci](docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade) ile tanışın. Linux İşçi düğümlerinizi yükseltmeden önce kontrol düzlemi düğümlerini yükseltmek isteyeceksiniz.

<!-- steps -->

## Paket deposunu değiştirme

Topluluk tarafından sahip olunan paket depolarını (`pkgs.k8s.io`) kullanıyorsanız, istenen Kubernetes küçük sürümü için paket deposunu etkinleştirmeniz gerekir. Bu, [Kubernetes paket deposunu değiştirme](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) belgesinde açıklanmıştır.

{{% legacy-repos-deprecation %}}

## İşçi düğümlerini yükseltme

### kubeadm'i yükseltme

kubeadm'i yükseltin:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian veya HypriotOS" %}}
```shell
# {{< skew currentVersion >}}.x-* içindeki x'i en son yama sürümü ile değiştirin
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS, RHEL veya Fedora" %}}
```shell
# {{< skew currentVersion >}}.x-* içindeki x'i en son yama sürümü ile değiştirin
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

### "kubeadm upgrade" çağırma

İşçi düğümleri için bu, yerel kubelet yapılandırmasını yükseltir:

```shell
sudo kubeadm upgrade node
```

### Düğümü boşaltma

Düğümü bakım için hazırlamak amacıyla planlanamaz olarak işaretleyin ve iş yüklerini tahliye edin:

```shell
# bu komutu bir kontrol düzlemi düğümünde çalıştırın
# <node-to-drain> yerine boşaltmakta olduğunuz düğümün adını yazın
kubectl drain <node-to-drain> --ignore-daemonsets
```

### kubelet ve kubectl'i yükseltme

1. kubelet ve kubectl'i yükseltin:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu, Debian veya HypriotOS" %}}
   ```shell
   # {{< skew currentVersion >}}.x-* içindeki x'i en son yama sürümü ile değiştirin
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS, RHEL veya Fedora" %}}
   ```shell
   # {{< skew currentVersion >}}.x-* içindeki x'i en son yama sürümü ile değiştirin
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. kubelet'i yeniden başlatın:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Düğümü yeniden çevrimiçi hale getirme

Düğümü planlanabilir olarak işaretleyerek yeniden çevrimiçi hale getirin:

```shell
# bu komutu bir kontrol düzlemi düğümünde çalıştırın
# <node-to-uncordon> yerine düğümünüzün adını yazın
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

* [Windows düğümlerini yükseltme](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/) konusuna bakın.
