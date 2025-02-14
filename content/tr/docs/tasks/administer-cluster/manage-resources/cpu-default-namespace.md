---
title: Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma
content_type: task
weight: 20
description: >-
  Bir ad alanı için varsayılan CPU kaynak sınırlarını tanımlayın, böylece o ad alanındaki her yeni Pod'un bir CPU kaynak sınırı yapılandırılmış olur.
---

<!-- overview -->

Bu sayfa, bir {{< glossary_tooltip text="ad alanı" term_id="namespace" >}} için varsayılan CPU isteklerini ve sınırlarını nasıl yapılandıracağınızı gösterir.

Bir Kubernetes kümesi ad alanlarına bölünebilir. Bir ad alanı içinde bir Pod oluşturursanız ve bu ad alanında varsayılan bir CPU [sınırı](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) varsa ve bu Pod'daki herhangi bir konteyner kendi CPU sınırını belirtmezse, {{< glossary_tooltip text="kontrol düzlemi" term_id="control-plane" >}} bu konteynere varsayılan CPU sınırını atar.

Kubernetes varsayılan bir CPU [isteği](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) atar, ancak yalnızca bu sayfada daha sonra açıklanan belirli koşullar altında.

## {{% heading "önkoşullar" %}}

{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

Kubernetes'in 1.0 CPU ile ne demek istediğini zaten bilmiyorsanız, [CPU'nun anlamı](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) konusunu okuyun.

<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace default-cpu-example
```

## Bir LimitRange ve bir Pod oluşturun

İşte bir örnek {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} için bir manifest. Manifest, varsayılan bir CPU isteği ve varsayılan bir CPU sınırı belirtir.

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

default-cpu-example ad alanında LimitRange oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

Şimdi default-cpu-example ad alanında bir Pod oluşturursanız ve bu Pod'daki herhangi bir konteyner kendi CPU isteği ve sınır değerlerini belirtmezse, kontrol düzlemi varsayılan değerleri uygular: 0.5 CPU isteği ve 1 CPU sınırı.

İşte bir konteyner içeren bir Pod için bir manifest. Konteyner bir CPU isteği ve sınırı belirtmez.

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

Pod'u oluşturun.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

Pod'un spesifikasyonunu görüntüleyin:

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

Çıktı, Pod'un tek konteynerinin 500m `cpu` (bu, “500 millicpu” olarak okunabilir) CPU isteğine ve 1 `cpu` CPU sınırına sahip olduğunu gösterir. Bunlar, LimitRange tarafından belirtilen varsayılan değerlerdir.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

## Bir konteynerin sınırını belirtirseniz, ancak isteğini belirtmezseniz ne olur?

İşte bir konteyner içeren bir Pod için bir manifest. Konteyner bir CPU sınırı belirtir, ancak bir istek belirtmez:

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

Oluşturduğunuz Pod'un [spesifikasyonunu](/docs/concepts/overview/working-with-objects/#object-spec-and-status) görüntüleyin:

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

Çıktı, konteynerin CPU isteğinin CPU sınırına eşit olarak ayarlandığını gösterir. Konteynere varsayılan CPU istek değeri olan 0.5 `cpu` atanmadığını fark edin:

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## Bir konteynerin isteğini belirtirseniz, ancak sınırını belirtmezseniz ne olur?

İşte bir konteyner içeren bir Pod için bir örnek manifest. Konteyner bir CPU isteği belirtir, ancak bir sınır belirtmez:

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

Oluşturduğunuz Pod'un spesifikasyonunu görüntüleyin:

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

Çıktı, konteynerin CPU isteğinin Pod'u oluşturduğunuz sırada belirttiğiniz değere ayarlandığını (başka bir deyişle: manifest ile eşleştiğini) gösterir. Ancak, aynı konteynerin CPU sınırı 1 `cpu` olarak ayarlanmıştır, bu da o ad alanı için varsayılan CPU sınırıdır.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## Varsayılan CPU sınırları ve istekleri için motivasyon

Ad alanınızda bir CPU {{< glossary_tooltip text="kaynak kotası" term_id="resource-quota" >}} yapılandırılmışsa, CPU sınırı için varsayılan bir değerin olması faydalıdır. Bir CPU kaynak kotasının bir ad alanına getirdiği iki kısıtlama şunlardır:

* Ad alanında çalışan her Pod için, her konteynerin bir CPU sınırı olmalıdır.
* CPU sınırları, ilgili Pod'un planlandığı düğümde bir kaynak rezervasyonu uygular. Ad alanındaki tüm Pod'lar için ayrılan toplam CPU miktarı belirli bir sınırı aşmamalıdır.

Bir LimitRange eklediğinizde:

O ad alanında herhangi bir Pod, kendi CPU sınırını belirtmeyen bir konteyner içeriyorsa, kontrol düzlemi bu konteynere varsayılan CPU sınırını uygular ve Pod, bir CPU ResourceQuota ile kısıtlanmış bir ad alanında çalışmasına izin verilebilir.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace default-cpu-example
```

## {{% heading "sonraki adımlar" %}}

### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Bir Ad Alanı için Pod Kotası Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiricileri için

* [Konteynerlere ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Konteynerlere ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynaklarını atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)
