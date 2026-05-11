---
title: Pod ve Düğümleri Görüntüleme
weight: 10
---

## {{% heading "objectives" %}}

* Kubernetes Pod'ları hakkında bilgi edinin.
* Kubernetes Düğümleri hakkında bilgi edinin.
* Dağıtılan uygulamalarda hata ayıklayın.

## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.


## Kubernetes Pod'ları

{{% alert %}}
_Bir Pod, bir veya daha fazla uygulama konteynerinden (Docker gibi) oluşan bir gruptur ve
paylaşılan depolama (volume'ler), IP adresi ve bunların nasıl çalıştırılacağı hakkında bilgi içerir._
{{% /alert %}}

[Modül 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)'de bir Dağıtım oluşturduğunuzda,
Kubernetes uygulama örneğinizi barındırmak için bir **Pod** oluşturdu. Bir Pod, bir veya daha fazla
uygulama konteynerini (Docker gibi) ve bu konteynerler için bazı paylaşılan kaynakları temsil eden
bir Kubernetes soyutlamasıdır. Bu kaynaklar şunları içerir:

* Volume'ler olarak paylaşılan depolama
* Benzersiz bir küme IP adresi olarak ağ iletişimi
* Her konteynerin nasıl çalıştırılacağına ilişkin bilgi (konteyner imaj sürümü veya kullanılacak belirli portlar gibi)

Bir Pod, uygulamaya özgü bir "mantıksal ana bilgisayar"ı modeller ve göreceli olarak sıkı bir
şekilde birbirine bağlı farklı uygulama konteynerlerini içerebilir. Örneğin, bir Pod hem
Node.js uygulamanızın bulunduğu konteyneri hem de Node.js web sunucusu tarafından yayınlanacak
verileri besleyen farklı bir konteyneri içerebilir. Bir Pod'daki konteynerler bir IP adresini
ve port alanını paylaşır, her zaman birlikte konumlanır ve birlikte zamanlanır ve aynı Düğüm
üzerinde paylaşılan bir bağlamda çalışır.

Pod'lar, Kubernetes platformundaki atomik birimdir. Kubernetes üzerinde bir Dağıtım oluşturduğumuzda,
o Dağıtım içinde konteynerleri olan Pod'lar oluşturur (doğrudan konteynerler oluşturmak yerine).
Her Pod, zamanlandığı Düğüme bağlıdır ve sonlandırılana (yeniden başlatma politikasına göre) veya
silinene kadar orada kalır. Bir Düğüm arızası durumunda, kümedeki diğer kullanılabilir Düğümlerde
aynı Pod'lar zamanlanır.

### Pod'lara genel bakış

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg" class="diagram-medium" >}}

{{% alert %}}
_Konteynerler yalnızca sıkı bir şekilde birbirine bağlıysa ve disk gibi kaynakları paylaşmaları
gerekiyorsa tek bir Pod'da birlikte zamanlanmalıdır._
{{% /alert %}}

## Düğümler

Bir Pod her zaman bir **Düğüm (Node)** üzerinde çalışır. Düğüm, Kubernetes'teki bir işçi makinedir
ve kümeye bağlı olarak sanal veya fiziksel bir makine olabilir. Her Düğüm kontrol düzlemi tarafından
yönetilir. Bir Düğümde birden fazla pod olabilir ve Kubernetes kontrol düzlemi, pod'ları kümedeki
Düğümler arasında otomatik olarak zamanlar. Kontrol düzleminin otomatik zamanlaması, her Düğümde
mevcut kaynakları dikkate alır.

Her Kubernetes Düğümü en az şunları çalıştırır:

* Kubelet — Kubernetes kontrol düzlemi ile Düğüm arasındaki iletişimden sorumlu bir süreç;
bir makinede çalışan Pod'ları ve konteynerleri yönetir.

* Bir konteyner çalışma zamanı (Docker gibi) — konteyner imajını bir registry'den çekmekten,
konteyneri açmaktan ve uygulamayı çalıştırmaktan sorumludur.

### Düğümlere genel bakış

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg" class="diagram-medium" >}}

## kubectl ile hata ayıklama

[Modül 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)'de kubectl komut satırı
arayüzünü kullandınız. Dağıtılan uygulamalar ve ortamları hakkında bilgi almak için
Modül 3'te de bunu kullanmaya devam edeceksiniz. En yaygın işlemler aşağıdaki kubectl alt
komutlarıyla yapılabilir:

* `kubectl get` - kaynakları listeler
* `kubectl describe` - bir kaynak hakkında ayrıntılı bilgi gösterir
* `kubectl logs`  - bir Pod'daki konteynerden günlükleri yazdırır
* `kubectl exec` - bir Pod'daki konteynerde bir komut çalıştırır

Uygulamaların ne zaman dağıtıldığını, mevcut durumlarının ne olduğunu, nerede çalıştıklarını
ve yapılandırmalarının ne olduğunu görmek için bu komutları kullanabilirsiniz.

Artık küme bileşenleri ve komut satırı hakkında daha fazla bilgimiz olduğuna göre,
uygulamamızı keşfedelim.

### Uygulama yapılandırmasını kontrol etme

Önceki senaryoda dağıttığımız uygulamanın çalışıp çalışmadığını doğrulayalım. `kubectl get`
komutunu kullanıp mevcut Pod'ları arayacağız:

```shell
kubectl get pods
```

Herhangi bir pod çalışmıyorsa, lütfen birkaç saniye bekleyin ve Pod'ları yeniden listeleyin.
Bir Pod çalıştığını gördüğünüzde devam edebilirsiniz.

Ardından, o Pod içindeki konteynerleri ve bu konteynerleri oluşturmak için hangi imajların
kullanıldığını görmek için `kubectl describe pods` komutunu çalıştırırız:

```shell
kubectl describe pods
```

Pod'un konteyneri hakkında ayrıntıları burada görüyoruz: IP adresi, kullanılan portlar ve
Pod'un yaşam döngüsüyle ilgili bir olaylar listesi.

`describe` alt komutunun çıktısı kapsamlıdır ve henüz açıklamadığımız bazı kavramları kapsar;
ancak endişelenmeyin, bu eğitimin sonunda tanıdık hale gelecekler.

{{< note >}}
`describe` alt komutu, Düğümler, Pod'lar ve Dağıtımlar dahil olmak üzere Kubernetes
ilkelliklerinin çoğu hakkında ayrıntılı bilgi almak için kullanılabilir. describe çıktısı
betiklerle çalışmak için değil, insan okunabilir olması için tasarlanmıştır.
{{< /note >}}

### Uygulamayı terminalde gösterme

Pod'ların izole, özel bir ağda çalıştığını unutmayın — bu nedenle hata ayıklayabilmek ve
onlarla etkileşim kurabilmek için onlara erişimi proxy üzerinden yapmamız gerekir. Bunu yapmak için,
**ikinci bir terminalde** bir proxy çalıştırmak üzere `kubectl proxy` komutunu kullanacağız.
Yeni bir terminal penceresi açın ve bu yeni terminalde şunu çalıştırın:

```shell
kubectl proxy
```

Şimdi yine Pod adını alıp pod'u doğrudan proxy üzerinden sorgulayacağız. Pod adını almak ve
`POD_NAME` ortam değişkeninde saklamak için:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo Pod adı: $POD_NAME
```

Uygulamamızın çıktısını görmek için bir `curl` isteği çalıştırın:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

URL, Pod'un API'sine giden yoldur.

{{< note >}}
Pod içinde yalnızca bir konteyner olduğu için konteyner adını belirtmemiz gerekmiyor.
{{< /note >}}

### Konteyner üzerinde komut çalıştırma

Pod çalışır duruma geldikten sonra komutları doğrudan konteyner üzerinde çalıştırabiliriz.
Bunun için `exec` alt komutunu kullanırız ve Pod'un adını parametre olarak veririz.
Ortam değişkenlerini listeleyelim:

```shell
kubectl exec "$POD_NAME" -- env
```

Yine, Pod'da yalnızca tek bir konteynerimiz olduğu için konteynerin adının kendisinin
atlanabileceğini belirtmekte fayda var.

Şimdi Pod'un konteynerinde bir bash oturumu başlatalım:

```shell
kubectl exec -ti $POD_NAME -- bash
```

Artık NodeJS uygulamamızı çalıştırdığımız konteyner üzerinde açık bir konsolumuz var.
Uygulamanın kaynak kodu `server.js` dosyasındadır:

```shell
cat server.js
```

Uygulamanın çalışır durumda olduğunu bir curl komutuyla kontrol edebilirsiniz:

```shell
curl http://localhost:8080
```

{{< note >}}
Burada `localhost` kullandık çünkü komutu NodeJS Pod'unun içinde çalıştırdık.
`localhost:8080`'e bağlanamıyorsanız, `kubectl exec` komutunu çalıştırdığınızdan ve
komutu Pod içinden başlattığınızdan emin olun.
{{< /note >}}

Konteyner bağlantınızı kapatmak için `exit` yazın.

## {{% heading "whatsnext" %}}

* Eğitim:
[Uygulamanızı Yayınlamak için Bir Hizmet Kullanma](/docs/tutorials/kubernetes-basics/expose/expose-intro/).
* [Pod'lar](/docs/concepts/workloads/pods/) hakkında daha fazla bilgi edinin.
* [Düğümler](/docs/concepts/architecture/nodes/) hakkında daha fazla bilgi edinin.
