---
reviewers:
- derekwaynecarr
- mikedanese
- thockin
title: Ad Alanları (Namespaces)
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
---

<!-- overview -->

Kubernetes'te _ad alanları_ (namespaces), tek bir küme içinde kaynak gruplarını yalıtmak için bir mekanizma sağlar. Kaynak adlarının bir ad alanı içinde benzersiz olması gerekir, ancak farklı ad alanları arasında aynı adlar kullanılabilir. Ad alanı tabanlı kapsam belirleme, yalnızca ad alanına özgü nesneler _(örn. Deployment, Service vb.)_ için geçerlidir; küme genelindeki nesneler _(örn. StorageClass, Nodes, PersistentVolumes vb.)_ için geçerli değildir.

<!-- body -->

## Birden Çok Ad Alanı Ne Zaman Kullanılmalıdır?

Ad alanları, birden fazla ekibe veya projeye yayılmış birçok kullanıcının bulunduğu ortamlarda kullanılmak üzere tasarlanmıştır. Birkaç veya onlarca kullanıcısı olan kümelerde genellikle ad alanları oluşturmaya gerek duyulmaz. Sağladıkları özelliklere ihtiyaç duyduğunuzda ad alanlarını kullanmaya başlayabilirsiniz.

Ad alanlarının temel özellikleri:
* **Ad kapsamı sağlar:** Kaynak adlarının bir ad alanı içinde benzersiz olması gerekir.
* **İç içe geçemez:** Ad alanları birbirinin içine yerleştirilemez; her Kubernetes kaynağı yalnızca bir ad alanında bulunabilir.
* **Kaynak paylaşımı:** Ad alanları, küme kaynaklarını birden çok kullanıcı veya ekip arasında bölmenin bir yoludur ([kaynak kotaları](/docs/concepts/policy/resource-quotas/) aracılığıyla).

{{< note >}}
Üretim (production) ortamındaki bir küme için `default` ad alanını kullanmamayı tercih edebilirsiniz. Bunun yerine özel ad alanları oluşturup onları kullanınız.
{{< /note >}}

## Başlangıç Ad Alanları

Kubernetes dört başlangıç ad alanıyla başlar:

`default`
: Kubernetes, yeni kümenizi önce bir ad alanı oluşturmak zorunda kalmadan hemen kullanmaya başlayabilmeniz için bu ad alanını içerir.

`kube-node-lease`
: Bu ad alanı, her düğümle ilişkili kira (Lease) nesnelerini tutar. Düğüm kiraları, kontrol düzleminin düğüm arızalarını tespit edebilmesi için kubelet'in kalp atışları (heartbeats) göndermesine olanak tanır.

`kube-public`
: Bu ad alanı *tüm* istemciler tarafından okunabilir (kimliği doğrulanmamış olanlar dahil). Çoğunlukla tüm küme genelinde herkese açık olarak görünmesi gereken kaynaklar için ayrılmıştır.

`kube-system`
: Kubernetes sisteminin kendi oluşturduğu kontrol düzlemi bileşenleri ve nesneleri için ayrılmış ad alanıdır.

## Ad Alanları ile Çalışmak

### Ad alanlarını görüntüleme

Bir kümedeki mevcut ad alanlarını şu komutla listeleyebilirsiniz:

```shell
kubectl get namespace
```

Çıktı şuna benzer olacaktır:

```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

### Belirli bir ad alanında komut çalıştırma

Mevcut bir istek için ad alanını belirlemek üzere `--namespace` bayrağını kullanın:

```shell
kubectl run nginx --image=nginx --namespace=test-ortami
kubectl get pods --namespace=test-ortami
```

### Varsayılan ad alanı tercihini ayarlama

Geçerli bağlamdaki (context) sonraki tüm kubectl komutları için ad alanını kalıcı olarak kaydedebilirsiniz:

```shell
kubectl config set-context --current --namespace=test-ortami
```

## Ad Alanları ve DNS

Bir [Servis (Service)](/docs/concepts/services-networking/service/) oluşturduğunuzda, Kubernetes ilgili bir DNS kaydı oluşturur. Bu kayıt `<servis-adi>.<ad-alani-adi>.svc.cluster.local` biçimindedir; bu da bir konteyner yalnızca `<servis-adi>` kullandığında, yerel ad alanındaki servise yönlendirileceği anlamına gelir. Bu özellik Geliştirme (Development), Test (Staging) ve Üretim (Production) gibi birden fazla ad alanında aynı yapılandırmayı kullanmak için son derece kullanışlıdır.

## {{% heading "whatsnext" %}}

* [Yeni bir ad alanı oluşturma](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace) hakkında daha fazla bilgi edinin.
* [Bir ad alanını silme](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace) hakkında daha fazla bilgi edinin.
