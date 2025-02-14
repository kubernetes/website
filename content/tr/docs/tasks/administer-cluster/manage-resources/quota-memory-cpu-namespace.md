---
title: Bir Ad Alanı için Bellek ve CPU Kotalarını Yapılandırma
content_type: task
weight: 50
description: >-
  Bir ad alanı için genel bellek ve CPU kaynak sınırlarını tanımlayın.
---


<!-- overview -->

Bu sayfa, bir {{< glossary_tooltip text="namespace" term_id="namespace" >}} içinde çalışan tüm Pod'lar tarafından kullanılabilecek toplam bellek ve CPU miktarı için kotaların nasıl ayarlanacağını gösterir.
Kotaları bir
[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
nesnesinde belirtirsiniz.




## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Kümenizde ad alanları oluşturma erişimine sahip olmalısınız.

Kümenizdeki her düğümde en az 1 GiB bellek bulunmalıdır.


<!-- steps -->

## Bir ad alanı oluşturun

Bu alıştırmada oluşturduğunuz kaynakların kümenizin geri kalanından izole edilmesi için bir ad alanı oluşturun.

```shell
kubectl create namespace quota-mem-cpu-example
```

## Bir ResourceQuota oluşturun

İşte bir örnek ResourceQuota için bir manifest:

{{% code_sample file="admin/resource/quota-mem-cpu.yaml" %}}

ResourceQuota'yı oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

ResourceQuota hakkında ayrıntılı bilgi görüntüleyin:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

ResourceQuota, quota-mem-cpu-example ad alanına şu gereksinimleri getirir:

* Ad alanındaki her Pod için, her konteynerin bir bellek isteği, bellek sınırı, cpu isteği ve cpu sınırı olmalıdır.
* O ad alanındaki tüm Pod'lar için bellek isteği toplamı 1 GiB'yi geçmemelidir.
* O ad alanındaki tüm Pod'lar için bellek sınırı toplamı 2 GiB'yi geçmemelidir.
* O ad alanındaki tüm Pod'lar için CPU isteği toplamı 1 cpu'yu geçmemelidir.
* O ad alanındaki tüm Pod'lar için CPU sınırı toplamı 2 cpu'yu geçmemelidir.

Kubernetes'in “1 CPU” ile ne demek istediğini öğrenmek için [CPU anlamı](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) sayfasına bakın.

## Bir Pod oluşturun

İşte bir örnek Pod için bir manifest:

{{% code_sample file="admin/resource/quota-mem-cpu-pod.yaml" %}}


Pod'u oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

Pod'un çalıştığını ve (tek) konteynerinin sağlıklı olduğunu doğrulayın:

```shell
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

ResourceQuota hakkında ayrıntılı bilgiye tekrar bakın:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

Çıktı, kotayı ve kotanın ne kadarının kullanıldığını gösterir.
Pod'unuzun bellek ve CPU isteklerinin ve sınırlarının kotayı aşmadığını görebilirsiniz.

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

`jq` aracına sahipseniz, ayrıca sadece `used` değerlerini sorgulayabilir (kullanarak [JSONPath](/docs/reference/kubectl/jsonpath/))
ve çıktının bu kısmını güzelce yazdırabilirsiniz. Örneğin:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example -o jsonpath='{ .status.used }' | jq .
```

## İkinci bir Pod oluşturmayı deneyin

İşte ikinci bir Pod için bir manifest:

{{% code_sample file="admin/resource/quota-mem-cpu-pod-2.yaml" %}}

Manifestte, Pod'un 700 MiB bellek isteği olduğunu görebilirsiniz.
Kullanılan bellek isteği toplamı ve bu yeni bellek isteğinin bellek isteği kotasını aştığını fark edin: 600 MiB + 700 MiB > 1 GiB.

Pod'u oluşturmayı deneyin:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

İkinci Pod oluşturulmaz. Çıktı, ikinci Pod'un oluşturulmasının bellek isteği toplamının bellek isteği kotasını aşmasına neden olacağını gösterir.

```
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

## Tartışma

Bu alıştırmada gördüğünüz gibi, bir ad alanında çalışan tüm Pod'lar için bellek isteği toplamını sınırlamak için bir ResourceQuota kullanabilirsiniz.
Ayrıca bellek sınırı, cpu isteği ve cpu sınırı toplamlarını da sınırlayabilirsiniz.

Bir ad alanı içindeki toplam kaynak kullanımını yönetmek yerine, bireysel Pod'ları veya bu Pod'lardaki konteynerleri sınırlamak isteyebilirsiniz. Bu tür bir sınırlamayı gerçekleştirmek için bir
[LimitRange](/docs/concepts/policy/limit-range/) kullanın.

## Temizlik

Ad alanınızı silin:

```shell
kubectl delete namespace quota-mem-cpu-example
```



## {{% heading "whatsnext" %}}


### Küme yöneticileri için

* [Bir Ad Alanı için Varsayılan Bellek İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Bir Ad Alanı için Varsayılan CPU İsteklerini ve Sınırlarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum Bellek Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Bir Ad Alanı için Minimum ve Maksimum CPU Kısıtlamalarını Yapılandırma](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Bir Ad Alanı için Pod Kotası Yapılandırma](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API Nesneleri için Kotaları Yapılandırma](/docs/tasks/administer-cluster/quota-api-object/)

### Uygulama geliştiriciler için

* [Konteynerlere ve Pod'lara Bellek Kaynakları Atama](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Konteynerlere ve Pod'lara CPU Kaynakları Atama](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Pod düzeyinde CPU ve bellek kaynakları atama](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Pod'lar için Hizmet Kalitesini Yapılandırma](/docs/tasks/configure-pod-container/quality-service-pod/)
