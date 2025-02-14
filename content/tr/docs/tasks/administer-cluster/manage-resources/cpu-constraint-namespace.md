---
title: Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma
content_type: task
weight: 40
description: >-
  Bir ad alanı için geçerli CPU kaynak sınırlarının bir aralığını tanımlayın, böylece bu ad alanındaki her yeni Pod
  yapılandırdığınız aralığa uyar.
---


<!-- overview -->

Bu sayfa, kapsayıcılar ve Pod'lar tarafından kullanılan CPU kaynakları için minimum ve maksimum değerlerin nasıl ayarlanacağını gösterir
ve {{< glossary_tooltip text="namespace" term_id="namespace" >}}. Minimum ve maksimum CPU değerlerini bir
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
nesnesinde belirtirsiniz. Bir Pod, LimitRange tarafından dayatılan kısıtlamalara uymuyorsa, ad alanında oluşturulamaz.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

Kümenizdeki her düğümde Pod'lar için en az 1.0 CPU bulunmalıdır.
Kubernetes'in “1 CPU” ile ne demek istediğini öğrenmek için [CPU'nun anlamı](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
sayfasına bakın.


<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace constraints-cpu-example
```

## Bir LimitRange ve bir Pod oluşturun

İşte bir örnek {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}} için bir manifest:

{{% code_sample file="admin/resource/cpu-constraints.yaml" %}}

LimitRange'i oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
```

LimitRange hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

Çıktı, beklenen minimum ve maksimum CPU kısıtlamalarını gösterir. Ancak
LimitRange yapılandırma dosyasında varsayılan değerleri belirtmediğiniz halde, bunların otomatik olarak oluşturulduğunu fark edin.

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```

Artık constraints-cpu-example ad alanında bir Pod oluşturduğunuzda (veya Kubernetes API'sinin başka bir istemcisi eşdeğer bir Pod oluşturduğunda), Kubernetes şu adımları gerçekleştirir:

* Bu Pod'daki herhangi bir kapsayıcı kendi CPU isteğini ve sınırını belirtmezse, kontrol düzlemi
  bu kapsayıcıya varsayılan CPU isteğini ve sınırını atar.

* Bu Pod'daki her kapsayıcının 200 millicpu veya daha büyük bir CPU isteği belirttiğini doğrulayın.

* Bu Pod'daki her kapsayıcının 800 millicpu veya daha küçük bir CPU sınırı belirttiğini doğrulayın.

{{< note >}}
Bir `LimitRange` nesnesi oluştururken, büyük sayfalar veya GPU'lar üzerinde de sınırlar belirtebilirsiniz.
Ancak, bu kaynaklarda `default` ve `defaultRequest` her ikisi de belirtildiğinde, iki değer aynı olmalıdır.
{{< /note >}}

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı manifesti
500 millicpu CPU isteği ve 800 millicpu CPU sınırı belirtir. Bunlar, bu ad alanı için LimitRange tarafından dayatılan
minimum ve maksimum CPU kısıtlamalarını karşılar.

{{% code_sample file="admin/resource/cpu-constraints-pod.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

Pod'un çalıştığını ve kapsayıcısının sağlıklı olduğunu doğrulayın:

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

Çıktı, Pod'un tek kapsayıcısının 500 millicpu CPU isteği ve 800 millicpu CPU sınırı olduğunu gösterir.
Bunlar, LimitRange tarafından dayatılan kısıtlamaları karşılar.

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```

## Pod'u silin

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

## Maksimum CPU kısıtlamasını aşan bir Pod oluşturmayı deneyin

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı
500 millicpu CPU isteği ve 1.5 CPU sınırı belirtir.

{{% code_sample file="admin/resource/cpu-constraints-pod-2.yaml" %}}

Pod'u oluşturmayı deneyin:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

Çıktı, Pod'un oluşturulmadığını gösterir, çünkü kabul edilemez bir kapsayıcı tanımlar.
Bu kapsayıcı kabul edilemezdir çünkü çok büyük bir CPU sınırı belirtir:

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

## Minimum CPU isteğini karşılamayan bir Pod oluşturmayı deneyin

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı
100 millicpu CPU isteği ve 800 millicpu CPU sınırı belirtir.

{{% code_sample file="admin/resource/cpu-constraints-pod-3.yaml" %}}

Pod'u oluşturmayı deneyin:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

Çıktı, Pod'un oluşturulmadığını gösterir, çünkü kabul edilemez bir kapsayıcı tanımlar.
Bu kapsayıcı kabul edilemezdir çünkü dayatılan minimumdan daha düşük bir CPU isteği belirtir:

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-3" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

## Herhangi bir CPU isteği veya sınırı belirtmeyen bir Pod oluşturun

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı
bir CPU isteği belirtmez, ayrıca bir CPU sınırı da belirtmez.

{{% code_sample file="admin/resource/cpu-constraints-pod-4.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

Çıktı, Pod'un tek kapsayıcısının 800 millicpu CPU isteği ve 800 millicpu CPU sınırı olduğunu gösterir.
Bu kapsayıcı bu değerleri nasıl aldı?

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

Bu kapsayıcı kendi CPU isteğini ve sınırını belirtmediği için, kontrol düzlemi
bu ad alanı için LimitRange'den
[varsayılan CPU isteği ve sınırını](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
uyguladı.

Bu noktada, Pod'unuz çalışıyor olabilir veya olmayabilir. Bu görevin bir ön koşulu, Düğümlerinizin
kullanım için en az 1 CPU'ya sahip olması gerektiğini hatırlayın. Düğümlerinizin her birinde yalnızca 1 CPU varsa,
o zaman 800 millicpu isteğini karşılayacak kadar tahsis edilebilir CPU olmayabilir.
2 CPU'ya sahip Düğümler kullanıyorsanız, muhtemelen 800 millicpu isteğini karşılayacak kadar CPU'ya sahipsinizdir.

Pod'unuzu silin:

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

## Minimum ve maksimum CPU kısıtlamalarının uygulanması

Bir LimitRange tarafından bir ad alanına dayatılan maksimum ve minimum CPU kısıtlamaları yalnızca
bir Pod oluşturulduğunda veya güncellendiğinde uygulanır. LimitRange'i değiştirirseniz,
önceden oluşturulmuş Pod'ları etkilemez.

## Minimum ve maksimum CPU kısıtlamalarının motivasyonu

Bir küme yöneticisi olarak, Pod'ların kullanabileceği CPU kaynakları üzerinde kısıtlamalar getirmek isteyebilirsiniz.
Örneğin:

* Bir kümedeki her Düğümde 2 CPU vardır. 2 CPU'dan fazla talep eden herhangi bir Pod'u kabul etmek istemezsiniz,
çünkü kümedeki hiçbir Düğüm bu talebi destekleyemez.

* Bir küme, üretim ve geliştirme departmanlarınız tarafından paylaşılmaktadır.
Üretim iş yüklerinin 3 CPU'ya kadar tüketmesine izin vermek istiyorsunuz, ancak geliştirme iş yüklerinin
1 CPU ile sınırlı olmasını istiyorsunuz. Üretim ve geliştirme için ayrı ad alanları oluşturur ve
her ad alanına CPU kısıtlamaları uygularsınız.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace constraints-cpu-example
```



## {{% heading "whatsnext" %}}


### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Bir Ad Alanı için Pod Kotasını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiriciler için

* [Kapsayıcılara ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Kapsayıcılara ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynakları atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)

