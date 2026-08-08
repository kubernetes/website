---
title: Uygulamanızı Yayınlamak için Bir Hizmet Kullanma
weight: 10
---

## {{% heading "objectives" %}}

* Kubernetes'te bir Hizmet (Service) hakkında bilgi edinin.
* Etiketlerin ve seçicilerin bir Hizmet ile nasıl ilişkili olduğunu anlayın.
* Bir uygulamayı Kubernetes kümesinin dışına açın.

## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.


## Kubernetes Hizmetlerine Genel Bakış

Kubernetes [Pod'ları](/docs/concepts/workloads/pods/) ölümlüdür. Pod'ların bir
[yaşam döngüsü](/docs/concepts/workloads/pods/pod-lifecycle/) vardır. Bir işçi düğüm öldüğünde,
o Düğümde çalışan Pod'lar da kaybedilir. Daha sonra bir
[Replicaset](/docs/concepts/workloads/controllers/replicaset/), uygulamanızı çalışır halde
tutmak için yeni Pod'lar oluşturarak kümeyi dinamik olarak istenen duruma geri getirebilir.
Başka bir örnek olarak, 3 kopyaya sahip bir görüntü işleme arka ucunu düşünün. Bu kopyalar
değiştirilebilir; ön uç sisteminin arka uç kopyalarını veya hatta bir Pod'un kaybolup yeniden
oluşturulmasını umursamaması gerekir. Bununla birlikte, bir Kubernetes kümesindeki her Pod'un,
aynı Düğümdeki Pod'lar dahil olmak üzere benzersiz bir IP adresi vardır; bu nedenle
uygulamalarınızın çalışmaya devam etmesi için Pod'lar arasındaki değişiklikleri otomatik olarak
uzlaştıracak bir yol gerekir.

{{% alert %}}
_Bir Kubernetes Hizmeti (Service), Pod'ların mantıksal bir kümesini tanımlayan ve bu Pod'lar için
dış trafik açığa çıkarma, yük dengeleme ve hizmet keşfi sağlayan bir soyutlama katmanıdır._
{{% /alert %}}

Kubernetes'te bir [Hizmet](/docs/concepts/services-networking/service/), Pod'ların mantıksal bir
kümesini ve bunlara erişmek için bir politikayı tanımlayan bir soyutlamadır. Hizmetler, bağımlı
Pod'lar arasında gevşek bir bağlantı sağlar. Bir Hizmet, tüm Kubernetes nesne manifestoları gibi
YAML veya JSON kullanılarak tanımlanır. Bir Hizmet tarafından hedeflenen Pod'lar kümesi genellikle
bir _etiket seçici_ ile belirlenir (spec'te bir `selector` içermeden neden bir Hizmet
isteyebileceğinizi öğrenmek için aşağıya bakın).

Her Pod'un benzersiz bir IP adresi olmasına rağmen, bu IP'ler bir Hizmet olmadan kümenin dışına
açığa çıkarılmaz. Hizmetler, uygulamalarınızın trafik almasını sağlar. Hizmetler, Hizmetin
`spec`'inde bir `type` belirtilerek farklı şekillerde açığa çıkarılabilir:

* _ClusterIP_ (varsayılan) — Hizmeti kümedeki dahili bir IP'de açığa çıkarır. Bu tür Hizmeti
yalnızca küme içinden erişilebilir kılar.

* _NodePort_ — NAT kullanarak kümedeki seçilen her Düğümün aynı portunda Hizmeti açığa çıkarır.
`NodeIP:NodePort` kullanılarak kümenin dışından bir Hizmete erişilebilir kılar. ClusterIP'in üst kümesidir.

* _LoadBalancer_ — Mevcut bulutta harici bir yük dengeleyici oluşturur (desteklenirse) ve
Hizmete sabit, harici bir IP atar. NodePort'un üst kümesidir.

* _ExternalName_ — Bir `CNAME` kaydı döndürerek Hizmeti `externalName` alanının içeriğine
(örn. `foo.bar.example.com`) eşler. Herhangi bir proxy kurulmaz. Bu tür `kube-dns`'in v1.7
veya daha yüksek bir sürümünü veya CoreDNS sürüm 0.0.8 veya daha yüksek bir sürümünü gerektirir.

Farklı Hizmet türleri hakkında daha fazla bilgi
[Kaynak IP Kullanma](/docs/tutorials/services/source-ip/) eğitiminde bulunabilir. Ayrıca
[Uygulamaları Hizmetlerle Bağlama](/docs/tutorials/services/connect-applications-service/)
sayfasına bakın.

Ayrıca, spec'te `selector` tanımlamamayı içeren Hizmetlerle ilgili bazı kullanım durumlarının
olduğunu unutmayın. `selector` olmadan oluşturulan bir Hizmet, karşılık gelen Endpoints nesnesini
de oluşturmaz. Bu, kullanıcıların bir Hizmeti belirli uç noktalara manuel olarak eşlemesine
olanak tanır. Seçici olmayabilmesinin başka bir olası nedeni, kesinlikle `type: ExternalName`
kullanıyor olmanızdır.

## Hizmetler ve Etiketler

Bir Hizmet, bir Pod kümesi üzerinde trafiği yönlendirir. Hizmetler, Pod'ların Kubernetes'te
uygulamanızı etkilemeden ölmesine ve çoğalmasına olanak tanıyan soyutlamadır. Bağımlı Pod'lar
(bir uygulamadaki ön uç ve arka uç bileşenleri gibi) arasındaki keşif ve yönlendirme,
Kubernetes Hizmetleri tarafından gerçekleştirilir.

Hizmetler, Kubernetes'teki nesneler üzerinde mantıksal işleme olanak tanıyan bir gruplama
ilkelliği olan [etiketler ve seçiciler](/docs/concepts/overview/working-with-objects/labels)
kullanarak bir Pod kümesini eşleştirir. Etiketler, nesnelere eklenen anahtar/değer çiftleridir
ve çeşitli şekillerde kullanılabilir:

* Geliştirme, test ve üretim için nesneleri belirleme
* Sürüm etiketlerini gömme
* Bir nesneyi etiketlerle sınıflandırma

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Etiketler, oluşturma sırasında veya daha sonra nesnelere eklenebilir. Herhangi bir zamanda
değiştirilebilirler. Şimdi bir Hizmet kullanarak uygulamamızı açığa çıkaralım ve bazı
etiketler uygulayalım.

### Adım 1: Yeni bir Hizmet oluşturma

Uygulamamızın çalıştığını doğrulayalım. `kubectl get` komutunu kullanıp mevcut Pod'ları arayacağız:

```shell
kubectl get pods
```

Çalışan Pod yoksa, önceki eğitimlerdeki nesnelerin temizlendiği anlamına gelir. Bu durumda,
geri dönüp [Bir Dağıtım oluşturmak için kubectl kullanma](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
eğitiminden dağıtımı yeniden oluşturun. Lütfen birkaç saniye bekleyin ve Pod'ları yeniden
listeleyin. Bir Pod'un çalıştığını gördüğünüzde devam edebilirsiniz.

Şimdi kümemizdeki mevcut Hizmetleri listeleyelim:

```shell
kubectl get services
```

Dağıtımı dış trafiğe açmak için `--type=NodePort` seçeneğiyle kubectl expose komutunu kullanacağız:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Şimdi kubernetes-bootcamp adlı çalışan bir Hizmetimiz var. Burada Hizmetin benzersiz bir
küme-IP'si, dahili bir port ve harici bir IP (Düğümün IP'si) aldığını görüyoruz.

Harici olarak hangi portun açıldığını öğrenmek için (`type: NodePort` Hizmeti için)
`describe service` alt komutunu çalıştırırız:

```shell
kubectl describe services/kubernetes-bootcamp
```

Atanan Düğüm portunun değerine sahip `NODE_PORT` adlı bir ortam değişkeni oluşturun:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Şimdi `curl`, Düğümün IP adresi ve harici olarak açılan port kullanılarak uygulamanın
kümenin dışına açıldığını test edebiliriz:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

{{< note >}}
Konteyner sürücüsü olarak Docker Desktop ile minikube çalıştırıyorsanız, bir minikube
tüneli gerekir. Bunun nedeni, Docker Desktop içindeki konteynerlerin ana bilgisayarınızdan
izole olmasıdır.

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

Ve sunucudan bir yanıt alırız. Hizmet açılmış durumda.

### Adım 2: Etiketleri kullanma

Dağıtım, Pod'umuz için otomatik olarak bir etiket oluşturdu. `describe deployment` alt komutuyla
o etiketin adını (_anahtar_'ını) görebilirsiniz:

```shell
kubectl describe deployment
```

Pod listemizi sorgulamak için bu etiketi kullanalım. `kubectl get pods` komutunu, parametre olarak
`-l` ve ardından etiket değerleriyle kullanacağız:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

Mevcut Hizmetleri listelemek için de aynısını yapabilirsiniz:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Pod'un adını alın ve POD_NAME ortam değişkeninde saklayın:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Pod adı: $POD_NAME"
```

Yeni bir etiket uygulamak için label alt komutunu kullanıp nesne türü, nesne adı ve yeni
etiket ile birlikte kullanırız:

```shell
kubectl label pods "$POD_NAME" version=v1
```

Bu, Pod'umuza yeni bir etiket uygulayacak (uygulama sürümünü Pod'a sabitledik) ve bunu
`describe pod` komutuyla kontrol edebiliriz:

```shell
kubectl describe pods "$POD_NAME"
```

Burada etiketin artık Pod'umuza eklendiğini görüyoruz. Ve şimdi yeni etiketi kullanarak
pod listesini sorgulayabiliriz:

```shell
kubectl get pods -l version=v1
```

Ve Pod'u görüyoruz.

### Adım 3: Bir Hizmeti silme

Hizmetleri silmek için `delete service` alt komutunu kullanabilirsiniz. Burada da etiketler
kullanılabilir:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Hizmetin gittiğini doğrulayın:

```shell
kubectl get services
```

Bu, Hizmetimizin kaldırıldığını doğrular. Yolun artık açık olmadığını doğrulamak için,
daha önce açılan IP ve portu `curl` ile sorgulayabilirsiniz:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Bu, uygulamanın artık kümenin dışından erişilebilir olmadığını kanıtlar. Uygulamanın hala
çalıştığını pod içinden bir `curl` ile doğrulayabilirsiniz:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Burada uygulamanın çalıştığını görüyoruz. Bunun nedeni, Dağıtımın uygulamayı yönetiyor olmasıdır.
Uygulamayı kapatmak için Dağıtımı da silmeniz gerekir.

## {{% heading "whatsnext" %}}

* Eğitim:
[Uygulamanızın Birden Fazla Örneğini Çalıştırma](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* [Hizmet (Service)](/docs/concepts/services-networking/service/) hakkında daha fazla bilgi edinin.
