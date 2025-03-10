---
title: Bir cgroup sürücüsünü yapılandırma
content_type: task
weight: 50
---

<!-- genel bakış -->

Bu sayfa, kubelet'in cgroup sürücüsünü kubeadm kümeleri için konteyner çalışma zamanı cgroup sürücüsüyle eşleştirmeyi açıklar.

## {{% heading "önkoşullar" %}}

Kubernetes [konteyner çalışma zamanı gereksinimlerine](/docs/setup/production-environment/container-runtimes) aşina olmalısınız.

<!-- adımlar -->

## Konteyner çalışma zamanı cgroup sürücüsünü yapılandırma

[Konteyner çalışma zamanları](/docs/setup/production-environment/container-runtimes) sayfası, kubeadm tabanlı kurulumlar için kubelet'in [varsayılan](/docs/reference/config-api/kubelet-config.v1beta1) `cgroupfs` sürücüsü yerine `systemd` sürücüsünün önerildiğini açıklar, çünkü kubeadm kubelet'i bir [systemd hizmeti](/docs/setup/production-environment/tools/kubeadm/kubelet-integration) olarak yönetir.

Sayfa ayrıca varsayılan olarak `systemd` sürücüsüyle bir dizi farklı konteyner çalışma zamanını nasıl kuracağınız hakkında ayrıntılar sağlar.

## Kubelet cgroup sürücüsünü yapılandırma

kubeadm, `kubeadm init` sırasında bir `KubeletConfiguration` yapısını geçirmenize izin verir. Bu `KubeletConfiguration`, kubelet'in cgroup sürücüsünü kontrol eden `cgroupDriver` alanını içerebilir.

{{< note >}}
v1.22 ve sonrasında, kullanıcı `KubeletConfiguration` altında `cgroupDriver` alanını ayarlamazsa, kubeadm bunu varsayılan olarak `systemd` yapar.

Kubernetes v1.28'de, cgroup sürücüsünün otomatik algılanmasını alfa özelliği olarak etkinleştirebilirsiniz.
Daha fazla ayrıntı için [systemd cgroup sürücüsü](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver) sayfasına bakın.
{{< /note >}}

Alanı açıkça yapılandırmanın minimal bir örneği:

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta4
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

Böyle bir yapılandırma dosyası daha sonra kubeadm komutuna geçirilebilir:

```shell
kubeadm init --config kubeadm-config.yaml
```

{{< note >}}
Kubeadm, kümedeki tüm düğümler için aynı `KubeletConfiguration` kullanır.
`KubeletConfiguration`, `kube-system` ad alanı altında bir [ConfigMap](/docs/concepts/configuration/configmap) nesnesinde saklanır.

`init`, `join` ve `upgrade` alt komutlarını çalıştırmak, kubeadm'nin `KubeletConfiguration` dosyasını `/var/lib/kubelet/config.yaml` altında bir dosya olarak yazmasına ve yerel düğüm kubelet'ine geçirmesine neden olur.
{{< /note >}}

## `cgroupfs` sürücüsünü kullanma

`cgroupfs` kullanmak ve mevcut kurulumlarda `KubeletConfiguration` cgroup sürücüsünü değiştirmemesi için `kubeadm upgrade`'i önlemek için, değerini açıkça belirtmelisiniz. Bu, gelecekteki kubeadm sürümlerinin varsayılan olarak `systemd` sürücüsünü uygulamasını istemediğiniz bir duruma uygulanır.

Değeri açıkça belirtmek için "[Kubelet ConfigMap'i değiştir](#modify-the-kubelet-configmap)" bölümüne bakın.

Bir konteyner çalışma zamanını `cgroupfs` sürücüsünü kullanacak şekilde yapılandırmak istiyorsanız, seçtiğiniz konteyner çalışma zamanının belgelerine başvurmalısınız.

## `systemd` sürücüsüne geçiş

Mevcut bir kubeadm kümesinin cgroup sürücüsünü `cgroupfs`'den `systemd`'ye yerinde değiştirmek için, bir kubelet yükseltmesine benzer bir prosedür gereklidir. Bu, aşağıda belirtilen her iki adımı da içermelidir.

{{< note >}}
Alternatif olarak, eski düğümleri `systemd` sürücüsünü kullanan yeni düğümlerle değiştirmek mümkündür. Bu, yalnızca yeni düğümleri katmadan önce aşağıdaki ilk adımı uygulamayı ve iş yüklerinin yeni düğümlere güvenli bir şekilde taşınmasını sağlamayı ve ardından eski düğümleri silmeyi gerektirir.
{{< /note >}}

### Kubelet ConfigMap'i değiştir

- `kubectl edit cm kubelet-config -n kube-system` komutunu çalıştırın.
- Mevcut `cgroupDriver` değerini değiştirin veya aşağıdaki gibi yeni bir alan ekleyin:

  ```yaml
  cgroupDriver: systemd
  ```
  Bu alan, ConfigMap'in `kubelet:` bölümünde bulunmalıdır.

### Tüm düğümlerde cgroup sürücüsünü güncelleyin

Kümedeki her düğüm için:

- `kubectl drain <node-name> --ignore-daemonsets` kullanarak [düğümü boşaltın](/docs/tasks/administer-cluster/safely-drain-node)
- `systemctl stop kubelet` kullanarak kubelet'i durdurun
- Konteyner çalışma zamanını durdurun
- Konteyner çalışma zamanı cgroup sürücüsünü `systemd` olarak değiştirin
- `/var/lib/kubelet/config.yaml` dosyasında `cgroupDriver: systemd` ayarlayın
- Konteyner çalışma zamanını başlatın
- `systemctl start kubelet` kullanarak kubelet'i başlatın
- `kubectl uncordon <node-name>` kullanarak [düğümün kilidini açın](/docs/tasks/administer-cluster/safely-drain-node)

Bu adımları düğümler üzerinde tek tek uygulayarak iş yüklerinin farklı düğümlerde zamanlanması için yeterli zaman tanıyın.

İşlem tamamlandıktan sonra tüm düğümlerin ve iş yüklerinin sağlıklı olduğundan emin olun.
