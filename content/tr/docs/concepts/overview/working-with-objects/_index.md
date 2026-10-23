---
title: Kubernetes Nesneleriyle Çalışmak
weight: 30
description: >-
  Kubernetes nesneleri Kubernetes sistemindeki kalıcı varlıklardır. Bu kavramları nasıl bildirimsel olarak tanımlayacağınızı öğrenin.
content_type: concept
card:
  name: concepts
  weight: 40
---

<!-- overview -->

Bu sayfa, Kubernetes nesnelerinin Kubernetes API'sinde nasıl temsil edildiğini ve bunları `.yaml` biçiminde nasıl tanımlayabileceğinizi açıklamaktadır.

<!-- body -->

## Kubernetes Nesnelerini Anlamak {#kubernetes-objects}

*Kubernetes nesneleri*, Kubernetes sistemindeki kalıcı (persistent) varlıklardır. Kubernetes, kümenizin durumunu temsil etmek için bu varlıkları kullanır. Özellikle şunları tanımlayabilirler:

* Hangi konteynerleştirilmiş uygulamaların çalıştığı (ve hangi düğümlerde olduğu)
* Bu uygulamaların kullanımına ayrılmış kaynaklar
* Yeniden başlatma ilkeleri, güncellemeler ve hata toleransı gibi bu uygulamaların nasıl davranacağına ilişkin politikalar

Bir Kubernetes nesnesi bir "niyet kaydıdır" (record of intent) -- nesneyi bir kez oluşturduğunuzda, Kubernetes sistemi nesnenin var olmasını sağlamak için sürekli çalışacaktır. Bir nesne oluşturarak, aslında Kubernetes sistemine kümenizin iş yükünün nasıl görünmesini istediğinizi bildirirsiniz; bu kümenizin *istenen durumudur* (desired state).

Kubernetes nesneleriyle çalışmak için—ister oluşturmak, ister değiştirmek, ister silmek olsun—[Kubernetes API](/docs/concepts/overview/kubernetes-api/)'sini kullanmanız gerekir. Örneğin `kubectl` komut satırı aracını kullandığınızda, CLI sizin adınıza gerekli Kubernetes API çağrılarını yapar.

### Nesne `spec` ve `status` Alanları

Neredeyse her Kubernetes nesnesi, nesnenin yapılandırmasını yöneten iki iç içe nesne alanı içerir: nesne *`spec`* ve nesne *`status`*.
`spec` alanı olan nesneler için, nesneyi oluştururken bu alanı ayarlamanız ve kaynağın sahip olmasını istediğiniz özellikleri tanımlamanız gerekir: bu kaynağın _istenen durumudur_.

`status` ise nesnenin _mevcut durumunu_ (current state) tanımlar ve Kubernetes sistemi ile bileşenleri tarafından sağlanıp sürekli güncellenir. Kubernetes kontrol düzlemi (control plane), her nesnenin gerçek durumunu sizin sağladığınız istenen durumla eşleştirmek için sürekli ve aktif olarak çalışır.

Örneğin: Kubernetes'te bir Deployment, kümenizde çalışan bir uygulamayı temsil edebilen bir nesnedir. Deployment oluşturduğunuzda, uygulamanın üç kopyasının (replicas) çalışmasını istediğinizi belirtmek için `spec` alanını ayarlayabilirsiniz. Kubernetes sistemi Deployment tanımını okur ve istenen uygulamanızın üç örneğini başlatır—durumu (`status`) sizin `spec` tanımınızla eşleşecek şekilde günceller.

### Bir Kubernetes Nesnesini Tanımlamak

Kubernetes'te bir nesne oluşturduğunuzda, nesnenin istenen durumunu açıklayan nesne belirtimini (`spec`) ve nesne hakkında bazı temel bilgileri (örneğin bir ad) sağlamanız gerekir.
Çoğu zaman bu bilgileri `kubectl` aracına _manifest_ olarak bilinen bir dosyada sağlarsınız. Kural olarak, manifest dosyaları YAML biçimindedir (JSON biçimi de kullanılabilir).

İşte bir Kubernetes Deployment nesnesi için gerekli alanları ve `spec` yapısını gösteren örnek bir bildirim:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Zorunlu Alanlar

Oluşturmak istediğiniz Kubernetes nesnesinin manifest dosyasında aşağıdaki alanlar için değerler belirlemeniz gerekir:

* `apiVersion` - Bu nesneyi oluşturmak için Kubernetes API'sinin hangi sürümünü kullandığınız
* `kind` - Ne tür bir nesne oluşturmak istediğiniz (örn. Pod, Service, Deployment)
* `metadata` - Nesneyi benzersiz şekilde tanımlamaya yardımcı olan veriler (bir `name` dizesi, `UID` ve isteğe bağlı `namespace`)
* `spec` - Nesne için arzuladığınız istenen durum

## {{% heading "whatsnext" %}}

Kubernetes konusunda yeniyseniz, aşağıdakiler hakkında daha fazla bilgi edinebilirsiniz:

* En temel Kubernetes nesneleri olan [Pod'lar](/docs/concepts/workloads/pods/).
* Uygulama dağıtımlarını yöneten [Deployment](/docs/concepts/workloads/controllers/deployment/) nesneleri.
* Kubernetes küme yönetim aracı olan [kubectl](/docs/reference/kubectl/).
