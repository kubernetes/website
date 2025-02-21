---
title: Linux işçi düğümleri ekleme
content_type: task
weight: 10
---

<!-- overview -->

Bu sayfa, bir kubeadm kümesine Linux işçi düğümleri eklemeyi açıklar.

## {{% heading "prerequisites" %}}

* Her katılan işçi düğüm, kubeadm, kubelet ve bir {{< glossary_tooltip term_id="container-runtime" text="konteyner çalışma zamanı" >}} gibi gerekli bileşenleri [kubeadm yükleme](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) sayfasından yüklemiş olmalıdır.
* `kubeadm init` komutuyla oluşturulmuş ve [kubeadm ile küme oluşturma](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) belgesindeki adımları takip eden çalışan bir kubeadm kümesi.
* Düğüme süper kullanıcı erişimine sahip olmanız gerekmektedir.

<!-- steps -->

## Linux işçi düğümleri ekleme

Kümenize yeni Linux işçi düğümleri eklemek için her makine için aşağıdakileri yapın:

1. SSH veya başka bir yöntem kullanarak makineye bağlanın.
1. `kubeadm init` tarafından çıktılanan komutu çalıştırın. Örneğin:

  ```bash
  sudo kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

### kubeadm join için ek bilgiler

{{< note >}}
`<control-plane-host>:<control-plane-port>` için bir IPv6 çiftini belirtmek için, IPv6 adresi köşeli parantez içine alınmalıdır, örneğin: `[2001:db8::101]:2073`.
{{< /note >}}

Eğer token'a sahip değilseniz, kontrol düzlemi düğümünde aşağıdaki komutu çalıştırarak alabilirsiniz:

```bash
# Bunu bir kontrol düzlemi düğümünde çalıştırın
sudo kubeadm token list
```

Çıktı şu şekilde olacaktır:

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  Varsayılan bootstrap   system:
                                                   signing          'kubeadm init'         bootstrappers:
                                                                    tarafından oluşturulan kubeadm:
                                                                    token.                 default-node-token
```

Varsayılan olarak, düğüm katılım token'ları 24 saat sonra sona erer. Mevcut token süresi dolduktan sonra bir düğümü kümeye katıyorsanız, kontrol düzlemi düğümünde aşağıdaki komutu çalıştırarak yeni bir token oluşturabilirsiniz:

```bash
# Bunu bir kontrol düzlemi düğümünde çalıştırın
sudo kubeadm token create
```

Çıktı şu şekilde olacaktır:

```console
5didvk.d09sbcov8ph2amjw
```

`--discovery-token-ca-cert-hash` değerine sahip değilseniz, kontrol düzlemi düğümünde aşağıdaki komutları çalıştırarak alabilirsiniz:

```bash
# Bunu bir kontrol düzlemi düğümünde çalıştırın
sudo cat /etc/kubernetes/pki/ca.crt | openssl x509 -pubkey  | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

Çıktı şu şekilde olacaktır:

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

`kubeadm join` komutunun çıktısı şu şekilde olacaktır:

```
[preflight] Ön kontrol adımları çalıştırılıyor

... (katılım iş akışının günlük çıktısı) ...

Düğüm katılımı tamamlandı:
* Sertifika imzalama isteği kontrol düzlemine gönderildi ve yanıt alındı.
* Kubelet, yeni güvenli bağlantı detayları hakkında bilgilendirildi.

Bu makinenin katıldığını görmek için kontrol düzleminde 'kubectl get nodes' komutunu çalıştırın.
```

Birkaç saniye sonra, `kubectl get nodes` komutunun çıktısında bu düğümü fark etmelisiniz.
(örneğin, bir kontrol düzlemi düğümünde `kubectl` komutunu çalıştırın).

{{< note >}}
Küme düğümleri genellikle sırayla başlatıldığından, CoreDNS Pod'larının tümü genellikle ilk kontrol düzlemi düğümünde çalışır. Daha yüksek kullanılabilirlik sağlamak için, en az bir yeni düğüm katıldıktan sonra `kubectl -n kube-system rollout restart deployment coredns` komutuyla CoreDNS Pod'larını yeniden dengeleyin.
{{< /note >}}

## {{% heading "whatsnext" %}}

* [Windows işçi düğümleri ekleme](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/) konusuna bakın.
