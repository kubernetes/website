---
title: Kubernetes Paket Deposu Değiştirme
content_type: task
weight: 150
---

<!-- genel bakış -->

Bu sayfa, bir kümenin yükseltilmesi sırasında istenen Kubernetes küçük sürümü için bir paket deposunun nasıl etkinleştirileceğini açıklar. Bu yalnızca `pkgs.k8s.io` adresinde barındırılan topluluk tarafından sahip olunan paket depolarını kullanan kullanıcılar için gereklidir. Eski paket depolarının aksine, topluluk tarafından sahip olunan paket depoları, her Kubernetes küçük sürümü için özel bir paket deposu olacak şekilde yapılandırılmıştır.

{{< note >}}
Bu kılavuz yalnızca Kubernetes yükseltme sürecinin bir bölümünü kapsar. Kubernetes kümelerini yükseltme hakkında daha fazla bilgi için lütfen [yükseltme kılavuzuna](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) bakın.
{{</ note >}}

{{< note >}}
Bu adım yalnızca bir kümeyi başka bir **küçük** sürüme yükseltirken gereklidir. Aynı küçük sürüm içinde başka bir yama sürümüne yükseltiyorsanız (örneğin v{{< skew currentVersion >}}.5'ten v{{< skew currentVersion >}}.7'ye), bu kılavuzu takip etmeniz gerekmez. Ancak, hala eski paket depolarını kullanıyorsanız, yükseltmeden önce topluluk tarafından sahip olunan yeni paket depolarına geçmeniz gerekecektir (bunun nasıl yapılacağı hakkında daha fazla bilgi için bir sonraki bölüme bakın).
{{</ note >}}

## {{% heading "önkoşullar" %}}

Bu belge, topluluk tarafından sahip olunan paket depolarını (`pkgs.k8s.io`) zaten kullandığınızı varsayar. Durum böyle değilse, [resmi duyuruda](/blog/2023/08/15/pkgs-k8s-io-introduction/) açıklandığı gibi topluluk tarafından sahip olunan paket depolarına geçmeniz şiddetle tavsiye edilir.

{{% legacy-repos-deprecation %}}

### Kubernetes paket depolarının kullanılıp kullanılmadığını doğrulama

Topluluk tarafından sahip olunan paket depolarını mı yoksa eski paket depolarını mı kullandığınızdan emin değilseniz, doğrulamak için aşağıdaki adımları izleyin:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian veya HypriotOS" %}}

Kubernetes `apt` deposunu tanımlayan dosyanın içeriğini yazdırın:

```shell
# Sisteminizde, bu yapılandırma dosyasının farklı bir adı olabilir
pager /etc/apt/sources.list.d/kubernetes.list
```

Şuna benzer bir satır görürseniz:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

**Kubernetes paket depolarını kullanıyorsunuz ve bu kılavuz sizin için geçerlidir.**
Aksi takdirde, [resmi duyuruda](/blog/2023/08/15/pkgs-k8s-io-introduction/) açıklandığı gibi Kubernetes paket depolarına geçmeniz şiddetle tavsiye edilir.

{{% /tab %}}
{{% tab name="CentOS, RHEL veya Fedora" %}}

Kubernetes `yum` deposunu tanımlayan dosyanın içeriğini yazdırın:

```shell
# Sisteminizde, bu yapılandırma dosyasının farklı bir adı olabilir
cat /etc/yum.repos.d/kubernetes.repo
```

Çıktıdaki `baseurl`'e benzer bir `baseurl` görürseniz:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Kubernetes paket depolarını kullanıyorsunuz ve bu kılavuz sizin için geçerlidir.**
Aksi takdirde, [resmi duyuruda](/blog/2023/08/15/pkgs-k8s-io-introduction/) açıklandığı gibi Kubernetes paket depolarına geçmeniz şiddetle tavsiye edilir.

{{% /tab %}}

{{% tab name="openSUSE veya SLES" %}}

Kubernetes `zypper` deposunu tanımlayan dosyanın içeriğini yazdırın:

```shell
# Sisteminizde, bu yapılandırma dosyasının farklı bir adı olabilir
cat /etc/zypp/repos.d/kubernetes.repo
```

Çıktıdaki `baseurl`'e benzer bir `baseurl` görürseniz:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Kubernetes paket depolarını kullanıyorsunuz ve bu kılavuz sizin için geçerlidir.**
Aksi takdirde, [resmi duyuruda](/blog/2023/08/15/pkgs-k8s-io-introduction/) açıklandığı gibi Kubernetes paket depolarına geçmeniz şiddetle tavsiye edilir.

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
Kubernetes paket depoları için kullanılan URL `pkgs.k8s.io` ile sınırlı değildir, aynı zamanda şu adreslerden biri olabilir:

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

<!-- adımlar -->

## Başka bir Kubernetes paket deposuna geçiş

Bu adım, istenen Kubernetes küçük sürümünün paketlerine erişim sağlamak için bir Kubernetes küçük sürümünden diğerine yükseltme sırasında yapılmalıdır.

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu, Debian veya HypriotOS" %}}

1. Bir metin düzenleyici kullanarak Kubernetes `apt` deposunu tanımlayan dosyayı açın:

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   Mevcut Kubernetes küçük sürümünüzü içeren URL ile tek bir satır görmelisiniz. Örneğin, v{{< skew currentVersionAddMinor -1 "." >}} kullanıyorsanız, şunu görmelisiniz:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
   ```

1. URL'deki sürümü **bir sonraki mevcut küçük sürüm** olarak değiştirin, örneğin:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

1. Dosyayı kaydedin ve metin düzenleyicinizden çıkın. İlgili yükseltme talimatlarını izlemeye devam edin.

{{% /tab %}}
{{% tab name="CentOS, RHEL veya Fedora" %}}

1. Bir metin düzenleyici kullanarak Kubernetes `yum` deposunu tanımlayan dosyayı açın:

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   Mevcut Kubernetes küçük sürümünüzü içeren iki URL içeren bir dosya görmelisiniz. Örneğin, v{{< skew currentVersionAddMinor -1 "." >}} kullanıyorsanız, şunu görmelisiniz:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Bu URL'lerdeki sürümü **bir sonraki mevcut küçük sürüm** olarak değiştirin, örneğin:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Dosyayı kaydedin ve metin düzenleyicinizden çıkın. İlgili yükseltme talimatlarını izlemeye devam edin.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "sonraki adımlar" %}}

* [Linux düğümlerini yükseltme](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/) hakkında bilgi edinin.
* [Windows düğümlerini yükseltme](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/) hakkında bilgi edinin.
