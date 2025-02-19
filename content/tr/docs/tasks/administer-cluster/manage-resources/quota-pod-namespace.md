---
title: Bir Ad Alanı için Pod Kotası Yapılandırma
content_type: task
weight: 60
description: >-
  Bir ad alanı içinde oluşturabileceğiniz Pod sayısını sınırlayın.
---


<!-- overview -->

Bu sayfa, bir {{< glossary_tooltip text="Namespace" term_id="namespace" >}} içinde çalıştırılabilecek toplam Pod sayısı için nasıl kota ayarlanacağını gösterir. Kotaları bir
[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
nesnesinde belirtirsiniz.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace quota-pod-example
```

## Bir ResourceQuota oluşturun

İşte bir ResourceQuota için örnek bir manifest:

{{% code_sample file="admin/resource/quota-pod.yaml" %}}

ResourceQuota'yı oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

ResourceQuota hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

Çıktı, ad alanının iki Pod kotasına sahip olduğunu ve şu anda hiçbir Pod olmadığını, yani kotanın kullanılmadığını gösterir.

```yaml
spec:
  hard:
    pods: "2"
status:
  hard:
    pods: "2"
  used:
    pods: "0"
```

İşte bir {{< glossary_tooltip term_id="deployment" >}} için örnek bir manifest:

{{% code_sample file="admin/resource/quota-pod-deployment.yaml" %}}

Bu manifestte, `replicas: 3` Kubernetes'e aynı uygulamayı çalıştıran üç yeni Pod oluşturmayı denemesini söyler.

Deployment'ı oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

Deployment hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

Çıktı, Deployment üç replika belirtse bile, daha önce tanımladığınız kota nedeniyle yalnızca iki Pod oluşturulduğunu gösterir:

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2021-04-02T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

### Kaynak seçimi

Bu görevde toplam Pod sayısını sınırlayan bir ResourceQuota tanımladınız, ancak başka türdeki nesnelerin toplam sayısını da sınırlayabilirsiniz. Örneğin, tek bir ad alanında kaç tane {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}} bulunabileceğini sınırlamaya karar verebilirsiniz.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace quota-pod-example
```



## {{% heading "whatsnext" %}}


### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiricileri için

* [Kapsayıcılara ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Kapsayıcılara ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynakları atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)
