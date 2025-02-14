---
title: Windows düğümlerini yükseltme
min-kubernetes-server-version: 1.17
content_type: task
weight: 41
---

<!-- genel bakış -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Bu sayfa, kubeadm ile oluşturulan bir Windows düğümünü nasıl yükselteceğinizi açıklar.

## {{% heading "önkoşullar" %}}
 
{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* [kubeadm kümenizin geri kalanını yükseltme süreci](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade) ile tanışın. Windows düğümlerinizi yükseltmeden önce kontrol düzlemi düğümlerini yükseltmek isteyeceksiniz.

<!-- adımlar -->

## Çalışan düğümleri yükseltme

### kubeadm'i yükseltme

1.  Windows düğümünden, kubeadm'i yükseltin:

    ```powershell
    # {{< skew currentPatchVersion >}} ile istediğiniz sürümü değiştirin
    curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```

### Düğümü boşaltma

1.  Kubernetes API'sine erişimi olan bir makineden,
    düğümü bakım için hazırlamak amacıyla planlanamaz olarak işaretleyin ve iş yüklerini tahliye edin:

    ```shell
    # <node-to-drain> ile boşaltmak istediğiniz düğümün adını değiştirin
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    Şuna benzer bir çıktı görmelisiniz:

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### kubelet yapılandırmasını yükseltme

1.  Windows düğümünden, yeni kubelet yapılandırmasını senkronize etmek için aşağıdaki komutu çağırın:

    ```powershell
    kubeadm upgrade node
    ```

### kubelet ve kube-proxy'yi yükseltme

1.  Windows düğümünden, kubelet'i yükseltin ve yeniden başlatın:

    ```powershell
    stop-service kubelet
    curl.exe -Lo <path-to-kubelet.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```

2. Windows düğümünden, kube-proxy'yi yükseltin ve yeniden başlatın.

    ```powershell
    stop-service kube-proxy
    curl.exe -Lo <path-to-kube-proxy.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```

{{< note >}}
Kube-proxy'yi bir Windows Hizmeti olarak değil de bir Pod içindeki bir HostProcess konteynerinde çalıştırıyorsanız,
kube-proxy'yi daha yeni bir kube-proxy manifesti uygulayarak yükseltebilirsiniz.
{{< /note >}}

### Düğümü yeniden çevrimiçi hale getirme

1.  Kubernetes API'sine erişimi olan bir makineden,
düğümü yeniden çevrimiçi hale getirmek için planlanabilir olarak işaretleyin:

    ```shell
    # <node-to-drain> ile düğümünüzün adını değiştirin
    kubectl uncordon <node-to-drain>
    ```
 ## {{% heading "sonraki adımlar" %}}

* [Linux düğümlerini yükseltme](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/) konusuna bakın.
