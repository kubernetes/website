---
title: Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma
content_type: task
weight: 10
description: >-
  Bir ad alanı için varsayılan bellek kaynak sınırını tanımlayın, böylece o ad alanındaki her yeni Pod
  için bir bellek kaynak sınırı yapılandırılmış olur.
---

<!-- overview -->

Bu sayfa, bir {{< glossary_tooltip text="ad alanı" term_id="namespace" >}} için varsayılan bellek isteklerini ve sınırlarını nasıl yapılandıracağınızı gösterir.

Bir Kubernetes kümesi ad alanlarına bölünebilir. Bir ad alanına varsayılan bir bellek
[sınırı](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) tanımladıktan sonra,
ve ardından bellek sınırını belirtmeyen bir kapsayıcı ile bir Pod oluşturmaya çalışırsanız,
{{< glossary_tooltip text="kontrol düzlemi" term_id="control-plane" >}} bu kapsayıcıya varsayılan bellek sınırını atar.

Kubernetes, bu konunun ilerleyen bölümlerinde açıklanan belirli koşullar altında varsayılan bir bellek isteği atar.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

Kümenizdeki her düğümde en az 2 GiB bellek bulunmalıdır.

<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace default-mem-example
```

## Bir LimitRange ve bir Pod oluşturun

İşte bir örnek {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} manifestosu.
Manifesto, varsayılan bir bellek isteği ve varsayılan bir bellek sınırı belirtir.

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

default-mem-example ad alanında LimitRange oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

Şimdi default-mem-example ad alanında bir Pod oluşturursanız ve bu Pod içindeki herhangi bir kapsayıcı
kendi bellek isteği ve bellek sınırı değerlerini belirtmezse,
{{< glossary_tooltip text="kontrol düzlemi" term_id="control-plane" >}}
varsayılan değerleri uygular: 256MiB bellek isteği ve 512MiB bellek sınırı.

İşte bir kapsayıcıya sahip bir Pod için örnek bir manifesto. Kapsayıcı
bellek isteği ve sınırını belirtmez.

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

Pod'u oluşturun.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

Çıktı, Pod'un kapsayıcısının 256 MiB bellek isteği ve
512 MiB bellek sınırına sahip olduğunu gösterir. Bunlar, LimitRange tarafından belirtilen varsayılan değerlerdir.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

Pod'unuzu silin:

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

## Bir kapsayıcının sınırını belirtirseniz, ancak isteğini belirtmezseniz ne olur?

İşte bir kapsayıcıya sahip bir Pod için bir manifesto.
Kapsayıcı bir bellek sınırı belirtir, ancak bir istek belirtmez:

{{% code_sample file="admin/resource/memory-defaults-pod-2.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

Çıktı, kapsayıcının bellek isteğinin bellek sınırına eşit olarak ayarlandığını gösterir.
Kapsayıcıya varsayılan bellek isteği değeri olan 256Mi atanmadığını fark edin.

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## Bir kapsayıcının isteğini belirtirseniz, ancak sınırını belirtmezseniz ne olur?

İşte bir kapsayıcıya sahip bir Pod için bir manifesto.
Kapsayıcı bir bellek isteği belirtir, ancak bir sınır belirtmez:

{{% code_sample file="admin/resource/memory-defaults-pod-3.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

Pod'un spesifikasyonunu görüntüleyin:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

Çıktı, kapsayıcının bellek isteğinin kapsayıcının manifestosunda belirtilen değere ayarlandığını gösterir.
Kapsayıcı, ad alanı için varsayılan bellek sınırına eşit olan 512MiB'den fazla bellek kullanamaz.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

Bir `LimitRange`, uyguladığı varsayılan değerlerin tutarlılığını **kontrol etmez**. Bu, `LimitRange` tarafından ayarlanan _sınır_ için bir varsayılan değerin, bir istemcinin API sunucusuna gönderdiği spesifikasyonda kapsayıcı için belirtilen _istek_ değerinden daha az olabileceği anlamına gelir. Bu durumda, nihai Pod planlanamaz olacaktır.
Daha fazla ayrıntı için [Kaynak sınırları ve istekleri üzerindeki kısıtlamalar](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests) bölümüne bakın.

{{< /note >}}

## Varsayılan bellek sınırları ve istekleri için motivasyon

Ad alanınızda bir bellek {{< glossary_tooltip text="kaynak kotası" term_id="resource-quota" >}} yapılandırılmışsa,
bellek sınırı için varsayılan bir değere sahip olmak faydalıdır.
Bir kaynak kotasının bir ad alanına getirdiği üç kısıtlama şunlardır:

* Ad alanında çalışan her Pod için, Pod ve her bir kapsayıcısı bir bellek sınırına sahip olmalıdır.
  (Her kapsayıcı için bir bellek sınırı belirtirseniz, Kubernetes Pod düzeyinde bellek
  sınırını kapsayıcılarının sınırlarını toplayarak çıkarabilir).
* Bellek sınırları, ilgili Pod'un planlandığı düğümde bir kaynak rezervasyonu uygular.
  Ad alanındaki tüm Pod'lar için ayrılan toplam bellek miktarı belirli bir sınırı aşmamalıdır.
* Ad alanındaki tüm Pod'lar tarafından fiilen kullanılan toplam bellek miktarı da belirli bir sınırı aşmamalıdır.

Bir LimitRange eklediğinizde:

Bu ad alanındaki herhangi bir Pod, kendi bellek sınırını belirtmeyen bir kapsayıcı içeriyorsa,
kontrol düzlemi bu kapsayıcıya varsayılan bellek sınırını uygular ve Pod,
bir bellek ResourceQuota ile sınırlı bir ad alanında çalışmasına izin verilebilir.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace default-mem-example
```

## {{% heading "whatsnext" %}}

### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Bir Ad Alanı için Pod Kotası Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiricileri için

* [Kapsayıcılara ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Kapsayıcılara ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynakları atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)
