---
title: Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma
content_type: task
weight: 30
description: >-
  Bir ad alanı için geçerli bellek kaynak sınırlarının bir aralığını tanımlayın, böylece bu ad alanındaki her yeni Pod
  yapılandırdığınız aralıkta kalır.
---


<!-- overview -->

Bu sayfa, bir {{< glossary_tooltip text="namespace" term_id="namespace" >}} içinde çalışan kapsayıcılar tarafından kullanılan bellek için minimum ve maksimum değerlerin nasıl ayarlanacağını gösterir.
Minimum ve maksimum bellek değerlerini bir
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
nesnesinde belirtirsiniz. Bir Pod, LimitRange tarafından dayatılan kısıtlamalara uymuyorsa,
ad alanında oluşturulamaz.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

Kümenizdeki her düğümde Pod'lar için en az 1 GiB bellek bulunmalıdır.

<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace constraints-mem-example
```

## Bir LimitRange ve bir Pod oluşturun

İşte bir LimitRange için örnek bir manifest:

{{% code_sample file="admin/resource/memory-constraints.yaml" %}}

LimitRange'i oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

LimitRange hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

Çıktı, minimum ve maksimum bellek kısıtlamalarını beklediğiniz gibi gösterir. Ancak
LimitRange yapılandırma dosyasında varsayılan değerleri belirtmediğiniz halde, bunların otomatik olarak oluşturulduğunu fark edin.

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

Artık constraints-mem-example ad alanı içinde bir Pod tanımladığınızda, Kubernetes şu adımları gerçekleştirir:

* Bu Pod'daki herhangi bir kapsayıcı kendi bellek isteğini ve sınırını belirtmezse,
kontrol düzlemi bu kapsayıcıya varsayılan bellek isteğini ve sınırını atar.

* Bu Pod'daki her kapsayıcının en az 500 MiB bellek talep ettiğini doğrulayın.

* Bu Pod'daki her kapsayıcının en fazla 1024 MiB (1 GiB) bellek talep ettiğini doğrulayın.

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Pod spesifikasyonunda, tek
kapsayıcı 600 MiB bellek isteği ve 800 MiB bellek sınırı belirtir. Bunlar, LimitRange tarafından dayatılan
minimum ve maksimum bellek kısıtlamalarını karşılar.

{{% code_sample file="admin/resource/memory-constraints-pod.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

Pod'un çalıştığını ve kapsayıcısının sağlıklı olduğunu doğrulayın:

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

Çıktı, bu Pod'daki kapsayıcının 600 MiB bellek isteği ve 800 MiB bellek sınırı olduğunu gösterir. Bunlar, bu ad alanı için LimitRange tarafından dayatılan kısıtlamaları karşılar:

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

Pod'unuzu silin:

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## Maksimum bellek kısıtlamasını aşan bir Pod oluşturmayı deneyin

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı,
800 MiB bellek isteği ve 1.5 GiB bellek sınırı belirtir.

{{% code_sample file="admin/resource/memory-constraints-pod-2.yaml" %}}

Pod'u oluşturmayı deneyin:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

Çıktı, Pod'un oluşturulmadığını gösterir, çünkü bu Pod, izin verilenden daha fazla bellek talep eden bir kapsayıcı tanımlar:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## Minimum bellek isteğini karşılamayan bir Pod oluşturmayı deneyin

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Bu kapsayıcı,
100 MiB bellek isteği ve 800 MiB bellek sınırı belirtir.

{{% code_sample file="admin/resource/memory-constraints-pod-3.yaml" %}}

Pod'u oluşturmayı deneyin:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

Çıktı, Pod'un oluşturulmadığını gösterir, çünkü bu Pod, dayatılan minimumdan daha az bellek talep eden bir kapsayıcı tanımlar:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## Herhangi bir bellek isteği veya sınırı belirtmeyen bir Pod oluşturun

İşte bir kapsayıcıya sahip bir Pod için bir manifest. Kapsayıcı,
bir bellek isteği belirtmez ve bir bellek sınırı belirtmez.

{{% code_sample file="admin/resource/memory-constraints-pod-4.yaml" %}}

Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

Pod hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

Çıktı, Pod'un tek kapsayıcısının 1 GiB bellek isteği ve 1 GiB bellek sınırı olduğunu gösterir.
Bu kapsayıcı bu değerleri nasıl aldı?

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

Pod'unuz bu kapsayıcı için herhangi bir bellek isteği ve sınırı tanımlamadığı için, küme bir
[varsayılan bellek isteği ve sınırı](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
LimitRange'den uyguladı.

Bu, o Pod'un tanımının bu değerleri gösterdiği anlamına gelir. Bunu
`kubectl describe` kullanarak kontrol edebilirsiniz:

```shell
# Çıktının "Requests:" bölümünü arayın
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

Bu noktada, Pod'unuz çalışıyor olabilir veya çalışmıyor olabilir. Bu görevin bir ön koşulu, Düğümlerinizin en az 1 GiB bellek olmasıdır. Her bir Düğümünüzde yalnızca 1 GiB bellek varsa, herhangi bir Düğümde 1 GiB bellek isteğini karşılayacak kadar tahsis edilebilir bellek yoktur. 2 GiB bellekli Düğümler kullanıyorsanız, muhtemelen 1 GiB isteğini karşılayacak kadar alanınız vardır.

Pod'unuzu silin:

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## Minimum ve maksimum bellek kısıtlamalarının uygulanması

Bir ad alanına bir LimitRange tarafından dayatılan maksimum ve minimum bellek kısıtlamaları yalnızca
bir Pod oluşturulduğunda veya güncellendiğinde uygulanır. LimitRange'i değiştirirseniz,
önceden oluşturulmuş Pod'ları etkilemez.

## Minimum ve maksimum bellek kısıtlamalarının motivasyonu

Bir küme yöneticisi olarak, Pod'ların kullanabileceği bellek miktarına kısıtlamalar getirmek isteyebilirsiniz.
Örneğin:

* Bir kümedeki her Düğümde 2 GiB bellek vardır. 2 GiB'den fazla bellek talep eden herhangi bir Pod'u kabul etmek istemezsiniz, çünkü kümedeki hiçbir Düğüm bu isteği destekleyemez.

* Bir küme, üretim ve geliştirme departmanlarınız tarafından paylaşılmaktadır.
Üretim iş yüklerinin 8 GiB'ye kadar bellek tüketmesine izin vermek istiyorsunuz, ancak
geliştirme iş yüklerinin 512 MiB ile sınırlı olmasını istiyorsunuz. Üretim ve geliştirme için ayrı ad alanları oluşturur ve her ad alanına bellek kısıtlamaları uygularsınız.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace constraints-mem-example
```


## {{% heading "whatsnext" %}}


### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Bir Ad Alanı için Pod Kotasını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiriciler için

* [Kapsayıcılara ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Kapsayıcılara ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynakları atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)
