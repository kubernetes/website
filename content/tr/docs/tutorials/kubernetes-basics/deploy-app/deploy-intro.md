---
title: Bir Dağıtım Oluşturmak için kubectl Kullanma
weight: 10
---

## {{% heading "objectives" %}}

* Uygulama Dağıtımları hakkında bilgi edinin.
* kubectl ile Kubernetes üzerinde ilk uygulamanızı dağıtın.


## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.


## Kubernetes Dağıtımları

{{% alert %}}
_Bir Dağıtım (Deployment), uygulamanızın örneklerini oluşturmak ve güncellemekten sorumludur._
{{% /alert %}}

{{< note >}}
Bu eğitim AMD64 mimarisi gerektiren bir konteyner kullanır. Farklı bir CPU mimarisine sahip
bir bilgisayarda minikube kullanıyorsanız, AMD64'ü taklit edebilen bir sürücüyle minikube'ı
denemeyi düşünebilirsiniz. Örneğin, Docker Desktop sürücüsü bunu yapabilir.
{{< /note >}}

[Çalışan bir Kubernetes kümesine](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/) sahip olduğunuzda,
konteyner haline getirilmiş uygulamalarınızı bunun üzerine dağıtabilirsiniz. Bunu yapmak için bir
Kubernetes **Dağıtımı** oluşturursunuz. Dağıtım, Kubernetes'e uygulamanızın örneklerinin
nasıl oluşturulacağını ve güncelleneceğini söyler. Bir Dağıtım oluşturduğunuzda, Kubernetes
kontrol düzlemi, bu Dağıtımda yer alan uygulama örneklerini kümedeki ayrı düğümlerde
çalıştırılmak üzere zamanlar.

Uygulama örnekleri oluşturulduğunda, bir Kubernetes Dağıtım denetleyicisi bu örnekleri
sürekli olarak izler. Bir örneğin barındırıldığı Düğüm devre dışı kalır veya silinirse,
Dağıtım denetleyicisi örneği kümedeki başka bir Düğümdeki bir örnekle değiştirir.
**Bu, makine arızası veya bakımı durumunu çözmek için kendi kendini iyileştiren bir mekanizma sağlar.**

Orkestrasyon öncesi dünyada, uygulamaları başlatmak için sıklıkla kurulum betikleri kullanılırdı;
ancak bu betikler makine arızasından kurtulmaya izin vermezdi. Hem uygulama örneklerinizi
oluşturarak hem de Düğümler arasında çalışır halde tutarak, Kubernetes Dağıtımları uygulama
yönetimine temel olarak farklı bir yaklaşım sağlar.

## Kubernetes üzerinde ilk uygulamanızı dağıtma

{{% alert %}}
_Uygulamaların Kubernetes üzerinde dağıtılabilmesi için, desteklenen konteyner formatlarından
biri içine paketlenmesi gerekir._
{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

Kubernetes komut satırı arayüzü olan [kubectl](/docs/reference/kubectl/)'i kullanarak bir
Dağıtım oluşturabilir ve yönetebilirsiniz. `kubectl`, kümeyle etkileşim kurmak için
Kubernetes API'sini kullanır. Bu modülde, uygulamalarınızı bir Kubernetes kümesinde çalıştıran
Dağıtımlar oluşturmak için gereken en yaygın `kubectl` komutlarını öğreneceksiniz.

Bir Dağıtım oluşturduğunuzda, uygulamanız için konteyner imajını ve çalıştırmak istediğiniz
kopya sayısını belirtmeniz gerekir. Bu bilgileri daha sonra Dağıtımınızı güncelleyerek
değiştirebilirsiniz. Bootcamp'in [Modül 5](/docs/tutorials/kubernetes-basics/scale/scale-intro/) ve
[Modül 6](/docs/tutorials/kubernetes-basics/update/update-intro/) bölümlerinde Dağıtımlarınızı
nasıl ölçeklendirebileceğiniz ve güncelleyebileceğiniz tartışılır.

İlk Dağıtımınız için, tüm istekleri yansıtmak amacıyla NGINX kullanan, Docker konteynerine
paketlenmiş bir hello-node uygulaması kullanacaksınız. (Daha önce bir hello-node uygulaması
oluşturup konteyner kullanarak dağıtmadıysanız, önce [Hello Minikube eğitimindeki](/docs/tutorials/hello-minikube/)
yönergeleri takip ederek bunu yapabilirsiniz.)

Ayrıca kubectl'i de yüklemiş olmanız gerekir. Yüklemeniz gerekiyorsa,
[araçları yükle](/docs/tasks/tools/#kubectl) sayfasını ziyaret edin.

Artık Dağıtımların ne olduğunu bildiğinize göre, ilk uygulamamızı dağıtalım!

### kubectl temelleri

Bir kubectl komutunun yaygın biçimi şudur: `kubectl eylem kaynak`.

Bu, belirtilen _kaynak_ üzerinde (örneğin `node` veya `deployment`) belirtilen _eylemi_
(örneğin `create`, `describe` veya `delete`) gerçekleştirir. Olası parametreler hakkında
ek bilgi almak için alt komuttan sonra `--help` kullanabilirsiniz (örneğin:
`kubectl get nodes --help`).

`kubectl version` komutunu çalıştırarak kubectl'in kümenizle konuşacak şekilde yapılandırıldığını kontrol edin.

kubectl'in yüklü olduğunu ve hem istemci hem de sunucu sürümlerini görebildiğinizi doğrulayın.

Kümedeki düğümleri görüntülemek için `kubectl get nodes` komutunu çalıştırın.

Mevcut düğümleri görürsünüz. Daha sonra Kubernetes, uygulamamızı nereye dağıtacağını
Düğümlerin mevcut kaynaklarına göre seçecektir.

### Bir uygulamayı dağıtma

İlk uygulamamızı Kubernetes üzerinde `kubectl create deployment` komutuyla dağıtalım.
Dağıtım adını ve uygulama imaj konumunu sağlamamız gerekir (Docker Hub dışında
barındırılan imajlar için tam depo URL'sini ekleyin).

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

Harika! Bir dağıtım oluşturarak ilk uygulamanızı dağıttınız. Bu sizin için birkaç şey yaptı:

* uygulamanın bir örneğinin çalıştırılabileceği uygun bir düğüm aradı (yalnızca 1 düğümümüz var)
* uygulamanın o Düğümde çalışmasını zamanladı
* gerektiğinde örneği yeni bir Düğümde yeniden zamanlamak için kümeyi yapılandırdı

Dağıtımlarınızı listelemek için `kubectl get deployments` komutunu kullanın:

```shell
kubectl get deployments
```

Uygulamanızın tek bir örneğini çalıştıran 1 dağıtım olduğunu görüyoruz. Örnek, düğümünüzdeki
bir konteyner içinde çalışıyor.

### Uygulamayı görüntüleme

Kubernetes içinde çalışan [Pod'lar](/docs/concepts/workloads/pods/), özel, izole bir ağda
çalışır. Varsayılan olarak aynı Kubernetes kümesi içindeki diğer pod'lar ve hizmetler
tarafından görülebilir, ancak bu ağın dışından değil. `kubectl` kullandığımızda,
uygulamamızla iletişim kurmak için bir API uç noktası aracılığıyla etkileşim kuruyoruz.

Uygulamanızı Kubernetes kümesinin dışına nasıl açacağınızla ilgili diğer seçenekleri daha sonra
[Modül 4](/docs/tutorials/kubernetes-basics/expose/)'te ele alacağız. Ayrıca temel bir eğitim olduğu için,
burada `Pod`'ların ne olduğunu ayrıntılı olarak açıklamıyoruz, sonraki konularda ele alınacaktır.

`kubectl proxy` komutu, küme çapında özel ağa iletişimi ileten bir proxy oluşturabilir.
Proxy, control-C tuşlarına basılarak sonlandırılabilir ve çalışırken herhangi bir çıktı göstermez.

**Proxy'yi çalıştırmak için ikinci bir terminal penceresi açmanız gerekir.**

```shell
kubectl proxy
```

Şimdi ana bilgisayarımız (terminal) ile Kubernetes kümesi arasında bir bağlantımız var.
Proxy, bu terminallerden API'ye doğrudan erişim sağlar.

Proxy uç noktasıyla barındırılan tüm bu API'leri görebilirsiniz. Örneğin, `curl` komutunu
kullanarak sürümü doğrudan API üzerinden sorgulayabiliriz:

```shell
curl http://localhost:8001/version
```

{{< note >}}
8001 portu erişilebilir değilse, yukarıda başlattığınız `kubectl proxy`'nin ikinci terminalde
çalıştığından emin olun.
{{< /note >}}

API sunucusu, pod adına göre her pod için otomatik olarak bir uç nokta oluşturur; bu uç nokta
da proxy üzerinden erişilebilirdir.

İlk olarak Pod adını almamız ve bunu `POD_NAME` ortam değişkeninde saklamamız gerekir.

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Pod adı: $POD_NAME
```

Şunu çalıştırarak Pod'a proxy üzerinden erişebilirsiniz:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

Yeni Dağıtımın proxy kullanmadan erişilebilir olması için bir Hizmet (Service) gerekir;
bu, [Modül 4](/docs/tutorials/kubernetes-basics/expose/)'te açıklanacaktır.

## {{% heading "whatsnext" %}}

* Eğitim: [Pod ve Düğümleri Görüntüleme](/docs/tutorials/kubernetes-basics/explore/explore-intro/).
* [Dağıtımlar (Deployments)](/docs/concepts/workloads/controllers/deployment/) hakkında daha fazla bilgi edinin.
