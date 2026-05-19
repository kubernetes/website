---
title: Uygulamanızın Birden Fazla Örneğini Çalıştırma
weight: 10
---

## {{% heading "objectives" %}}

* kubectl kullanarak mevcut bir uygulamayı manuel olarak ölçeklendirin.

## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.



## Bir uygulamayı ölçeklendirme

{{% alert %}}
_kubectl create deployment komutuyla başlangıçta --replicas parametresini kullanarak birden fazla
örneğe sahip bir Dağıtım oluşturabilirsiniz._
{{% /alert %}}

Daha önce bir [Dağıtım](/docs/concepts/workloads/controllers/deployment/) oluşturduk ve ardından bunu
bir [Hizmet](/docs/concepts/services-networking/service/) aracılığıyla herkese açtık. Dağıtım,
uygulamamızı çalıştırmak için yalnızca bir Pod oluşturdu. Trafik arttığında, kullanıcı talebine
ayak uydurmak için uygulamayı ölçeklendirmemiz gerekecek.

Önceki bölümlerle çalışmadıysanız,
[Bir küme oluşturmak için minikube kullanma](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/) bölümünden başlayın.

_Ölçeklendirme_, bir Dağıtımdaki kopya sayısının değiştirilmesiyle gerçekleştirilir.

{{< note >}}
Bunu [önceki bölümden](/docs/tutorials/kubernetes-basics/expose/expose-intro/) sonra deniyorsanız,
oluşturduğunuz hizmeti silmiş veya `type: NodePort` türünde bir Hizmet oluşturmuş olabilirsiniz.
Bu bölümde, kubernetes-bootcamp Dağıtımı için `type: LoadBalancer` türünde bir hizmet oluşturulduğu varsayılır.

[Önceki bölümde](/docs/tutorials/kubernetes-basics/expose/expose-intro) oluşturulan Hizmeti _silmediyseniz_,
önce o Hizmeti silin ve ardından `type` değeri `LoadBalancer` olarak ayarlanmış yeni bir Hizmet
oluşturmak için aşağıdaki komutu çalıştırın:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /note >}}

## Ölçeklendirmeye genel bakış

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_Ölçeklendirme, bir Dağıtımdaki kopya sayısının değiştirilmesiyle gerçekleştirilir._
{{% /alert %}}

Bir Dağıtımı ölçeklendirmek, yeni Pod'ların oluşturulmasını ve mevcut kaynaklara sahip Düğümlere
zamanlanmasını sağlar. Ölçeklendirme, Pod sayısını yeni istenen duruma yükseltir. Kubernetes
ayrıca Pod'ların [otomatik ölçeklendirilmesini](/docs/concepts/workloads/autoscaling/) de destekler;
ancak bu, bu eğitimin kapsamı dışındadır. Sıfıra ölçeklendirme de mümkündür ve belirtilen
Dağıtımın tüm Pod'larını sonlandırır.

Bir uygulamanın birden fazla örneğini çalıştırmak, trafiği bunların hepsine dağıtmanın bir yolunu
gerektirir. Hizmetler, ağ trafiğini açılan bir Dağıtımın tüm Pod'larına dağıtacak entegre bir yük
dengeleyiciye sahiptir. Hizmetler, trafiğin yalnızca kullanılabilir Pod'lara gönderilmesini sağlamak
için uç noktaları kullanarak çalışan Pod'ları sürekli olarak izler.

Bir uygulamanın birden fazla örneği çalıştığında, kesinti süresi olmadan Rolling güncellemeleri
yapabilirsiniz. Bunu eğitimin bir sonraki bölümünde ele alacağız. Şimdi terminale geçip
uygulamamızı ölçeklendirelim.

### Bir Dağıtımı ölçeklendirme

Dağıtımlarınızı listelemek için `get deployments` alt komutunu kullanın:

```shell
kubectl get deployments
```

Çıktı şuna benzer olmalıdır:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

1 Pod'umuz olmalıdır. Yoksa, komutu tekrar çalıştırın. Bu şunları gösterir:

* _NAME_ kümedeki Dağıtımların adlarını listeler.
* _READY_ MEVCUT/İSTENEN kopya oranını gösterir.
* _UP-TO-DATE_ istenen durumu elde etmek için güncellenen kopya sayısını gösterir.
* _AVAILABLE_ uygulamanızın kaç kopyasının kullanıcılarınız tarafından kullanılabilir olduğunu gösterir.
* _AGE_ uygulamanın ne kadar süredir çalıştığını gösterir.

Dağıtım tarafından oluşturulan ReplicaSet'i görmek için şunu çalıştırın:

```shell
kubectl get rs
```

ReplicaSet'in adının her zaman <nobr>[DAĞITIM-ADI]-[RASTGELE-DİZE]</nobr> biçiminde
olduğuna dikkat edin. Rastgele dize rastgele oluşturulur ve pod-template-hash'i tohum olarak kullanır.

Bu çıktının iki önemli sütunu şunlardır:

* _DESIRED_ Dağıtımı oluşturduğunuzda tanımladığınız uygulamanın istenen kopya sayısını gösterir.
Bu istenen durumdur.
* _CURRENT_ şu anda kaç kopyanın çalıştığını gösterir.

Şimdi Dağıtımı 4 kopyaya ölçeklendirelim. `kubectl scale` komutunu, ardından Dağıtım türünü,
adını ve istenen örnek sayısını kullanacağız:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Dağıtımlarınızı tekrar listelemek için `get deployments` kullanın:

```shell
kubectl get deployments
```

Değişiklik uygulandı ve uygulamanın 4 örneği mevcut. Şimdi Pod sayısının değişip değişmediğini
kontrol edelim:

```shell
kubectl get pods -o wide
```

Şu anda 4 Pod var ve farklı IP adreslerine sahipler. Değişiklik Dağıtım olay günlüğüne kaydedildi.
Bunu kontrol etmek için `describe` alt komutunu kullanın:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Bu komutun çıktısında artık 4 kopya olduğunu da görebilirsiniz.

### Yük Dengeleme

Hizmetin trafiği yük-dengeleyip dengelemediğini kontrol edelim. Açılan IP ve Port'u bulmak için
eğitimin önceki bölümünde öğrendiğimiz gibi `describe service` kullanabiliriz:

```shell
kubectl describe services/kubernetes-bootcamp
```

Düğüm portu değerine sahip NODE_PORT adlı bir ortam değişkeni oluşturun:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Şimdi açılan IP adresine ve porta bir `curl` yapacağız. Komutu birden çok kez çalıştırın:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Her istekte farklı bir Pod'a vurmaktayız. Bu, yük dengelemenin çalıştığını gösterir.

Çıktı şuna benzer olmalıdır:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
Konteyner sürücüsü olarak Docker Desktop ile minikube çalıştırıyorsanız, bir minikube tüneli gerekir.
Bunun nedeni, Docker Desktop içindeki konteynerlerin ana bilgisayarınızdan izole olmasıdır.

Ayrı bir terminal penceresinde şunu çalıştırın:

```shell
minikube service kubernetes-bootcamp --url
```

Çıktı şuna benzer:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Ardından uygulamaya erişmek için verilen URL'yi kullanın:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

### Ölçeği Düşürme

Dağıtımı 2 kopyaya düşürmek için `scale` alt komutunu tekrar çalıştırın:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Değişikliğin uygulanıp uygulanmadığını kontrol etmek için `get deployments` alt komutuyla
Dağıtımları listeleyin:

```shell
kubectl get deployments
```

Kopya sayısı 2'ye düştü. Pod sayısını listeleyin, `get pods`:

```shell
kubectl get pods -o wide
```

Bu, 2 Pod'un sonlandırıldığını doğrular.

## {{% heading "whatsnext" %}}

* Eğitim:
[Bir Sıralı Güncelleme Gerçekleştirme](/docs/tutorials/kubernetes-basics/update/update-intro/).
* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) hakkında daha fazla bilgi edinin.
* [Otomatik Ölçeklendirme](/docs/concepts/workloads/autoscaling/) hakkında daha fazla bilgi edinin.
