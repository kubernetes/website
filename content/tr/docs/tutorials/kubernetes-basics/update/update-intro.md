---
title: Bir Sıralı Güncelleme Gerçekleştirme
weight: 10
---

## {{% heading "objectives" %}}

kubectl kullanarak bir sıralı güncelleme (rolling update) gerçekleştirin.

## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.


## Bir uygulamayı güncelleme

{{% alert %}}
_Sıralı güncellemeler, Pod örneklerinin kademeli olarak yenileriyle değiştirilmesi suretiyle
Dağıtım güncellemelerinin sıfır kesinti süresiyle gerçekleştirilmesine olanak tanır._
{{% /alert %}}

Kullanıcılar uygulamaların her zaman erişilebilir olmasını bekler ve geliştiricilerin yeni sürümleri
günde birkaç kez dağıtması beklenir. Kubernetes'te bu, sıralı güncellemelerle yapılır.
Bir **sıralı güncelleme**, bir Dağıtım güncellemesinin sıfır kesinti süresiyle gerçekleştirilmesine
olanak tanır. Bunu, mevcut Pod'ları kademeli olarak yenileriyle değiştirerek yapar. Yeni Pod'lar
mevcut kaynaklara sahip Düğümlere zamanlanır ve Kubernetes, eski Pod'ları kaldırmadan önce
bu yeni Pod'ların başlamasını bekler.

Önceki modülde, uygulamamızı birden fazla örnek çalıştıracak şekilde ölçeklendirdik. Uygulamanın
erişilebilirliğini etkilemeden güncellemeler yapmak için bu bir gerekliliktir.
Varsayılan olarak, güncelleme sırasında kullanılamaz olabilecek maksimum Pod sayısı ve
oluşturulabilecek maksimum yeni Pod sayısı birdir. Her iki seçenek de sayılara veya
yüzdelere (Pod'ların) yapılandırılabilir. Kubernetes'te güncellemeler sürümlüdür ve
herhangi bir Dağıtım güncellemesi önceki (kararlı) bir sürüme geri alınabilir.

## Sıralı güncellemelere genel bakış

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
Bir Dağıtım herkese açıksa, Hizmet yalnızca istekleri işleyebilen Pod'lara trafik gönderir.
Bu, kullanıcıların güncelleme sırasında uygulamaya erişmeye devam etmesini sağlar.
{{% /alert %}}

Bir sıralı güncelleme sırasında, bu davranış trafiği yalnızca istekleri sunan Pod'lara yönlendirerek
uygulamayı kullanılabilir tutar. Sıralı güncellemeler aşağıdaki eylemlere olanak tanır:

* Bir uygulamayı bir ortamdan diğerine yükseltme (konteyner imaj güncellemeleri yoluyla)
* Önceki sürümlere geri dönme
* Uygulamaların sıfır kesinti süresiyle Sürekli Entegrasyon ve Sürekli Teslimi

Aşağıdaki etkileşimli eğitimde, uygulamamızı yeni bir sürüme güncelleyeceğiz ve aynı zamanda
bir geri alma işlemi de gerçekleştireceğiz.

### Uygulamanın sürümünü güncelleme

Dağıtımlarınızı listelemek için `get deployments` alt komutunu çalıştırın:

```shell
kubectl get deployments
```

Çalışan Pod'ları listelemek için `get pods` alt komutunu çalıştırın:

```shell
kubectl get pods
```

Uygulamanın mevcut imaj sürümünü görmek için `describe pods` alt komutunu çalıştırın ve
`Image` alanına bakın:

```shell
kubectl describe pods
```

Uygulamanın imajını sürüm 2'ye güncellemek için `set image` alt komutunu, ardından dağıtım adı
ve yeni imaj sürümünü kullanın:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

Komut, Dağıtıma uygulamanız için farklı bir imaj kullanmasını bildirdi ve bir sıralı güncelleme
başlattı. Yeni Pod'ların durumunu kontrol edin ve eski Pod'un `get pods` alt komutuyla
sonlandığını görüntüleyin:

```shell
kubectl get pods
```

### Bir güncellemeyi doğrulama

İlk olarak, önceki eğitim adımında silmiş olabileceğiniz için hizmetin çalıştığını kontrol edin:
`describe services/kubernetes-bootcamp` komutunu çalıştırın. Eksikse, şu komutla yeniden oluşturabilirsiniz:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Atanan Düğüm portunun değerine sahip `NODE_PORT` adlı bir ortam değişkeni oluşturun:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Ardından, açılan IP ve porta bir `curl` yapın:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

`curl` komutunu her çalıştırdığınızda farklı bir Pod'a vuracaksınız. Tüm Pod'ların artık
en son sürümü (`v2`) çalıştırdığına dikkat edin.

Güncellemeyi `rollout status` alt komutunu çalıştırarak da doğrulayabilirsiniz:

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

Uygulamanın mevcut imaj sürümünü görmek için describe pods alt komutunu çalıştırın:

```shell
kubectl describe pods
```

Çıktının `Image` alanında, en son imaj sürümünü (`v2`) çalıştırdığınızı doğrulayın.

### Bir güncellemeyi geri alma

Başka bir güncelleme gerçekleştirelim ve `v10` etiketli bir imajı dağıtmaya çalışalım:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

Dağıtımın durumunu görmek için `get deployments` kullanın:

```shell
kubectl get deployments
```

Çıktının istenen sayıda kullanılabilir Pod listelemediğine dikkat edin. Tüm Pod'ları listelemek
için `get pods` alt komutunu çalıştırın:

```shell
kubectl get pods
```

Pod'lardan bazılarının `ImagePullBackOff` durumunda olduğuna dikkat edin.

Soruna daha fazla içgörü kazanmak için `describe pods` alt komutunu çalıştırın:

```shell
kubectl describe pods
```

Etkilenen Pod'ların çıktısının `Events` bölümünde, `v10` imaj sürümünün depoda mevcut olmadığına
dikkat edin.

Dağıtımı son çalışan sürümünüze geri almak için `rollout undo` alt komutunu kullanın:

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

`rollout undo` komutu, dağıtımı önceki bilinen duruma (imajın `v2`'si) geri döndürür.
Güncellemeler sürümlüdür ve bir Dağıtımın daha önce bilinen herhangi bir durumuna geri dönebilirsiniz.

Pod'ları tekrar listelemek için `get pods` alt komutunu kullanın:

```shell
kubectl get pods
```

Çalışan Pod'larda dağıtılan imajı kontrol etmek için `describe pods` alt komutunu kullanın:

```shell
kubectl describe pods
```

Dağıtım bir kez daha uygulamanın kararlı bir sürümünü (`v2`) kullanıyor. Geri alma işlemi başarılı oldu.

Yerel kümenizi temizlemeyi unutmayın.

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

* [Dağıtımlar (Deployments)](/docs/concepts/workloads/controllers/deployment/) hakkında daha fazla bilgi edinin.
