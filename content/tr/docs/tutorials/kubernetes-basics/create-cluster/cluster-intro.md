---
title: Bir Küme Oluşturmak için Minikube Kullanma
weight: 10
---

## {{% heading "objectives" %}}

* Bir Kubernetes kümesinin ne olduğunu öğrenin.
* Minikube'un ne olduğunu öğrenin.
* Bilgisayarınızda bir Kubernetes kümesi başlatın.

## {{% heading "prerequisites" %}}

Bu eğitimdeki kabuk komutları POSIX kabuk söz dizimini kullanır; bu söz dizimi
çoğu Linux ve macOS sisteminde varsayılan kabuklar tarafından desteklenir (örneğin bash, zsh veya sh).
Windows kullanıcıları komutları yazıldığı gibi çalıştırmak için
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
veya [Git Bash](https://gitforwindows.org/) gibi POSIX uyumlu bir kabuk kullanmalıdır.
`export`, `$()` ve benzeri yapıları kullanan komutlar PowerShell veya Windows Komut İstemi ile
uyumlu **değildir**.


## Kubernetes Kümeleri

{{% alert %}}
_Kubernetes, uygulama konteynerlerinin bilgisayar kümeleri içinde ve arasında
yerleştirilmesini (zamanlama) ve yürütülmesini yöneten, üretim sınıfı, açık kaynaklı
bir platformdur._
{{% /alert %}}

**Kubernetes, tek bir birim olarak çalışacak şekilde bağlanmış, yüksek erişilebilirliğe sahip
bir bilgisayar kümesini koordine eder.** Kubernetes'teki soyutlamalar, konteyner haline getirilmiş
uygulamaları belirli makinelere bağlamadan bir kümeye dağıtmanıza olanak tanır. Bu yeni dağıtım
modelinden yararlanmak için, uygulamaların onları tek tek ana bilgisayarlardan ayıracak şekilde
paketlenmesi gerekir: konteynerleştirilmeleri gerekir. Konteyner haline getirilmiş uygulamalar,
geçmişte uygulamaların doğrudan belirli makinelere paket olarak ana bilgisayara derinlemesine
entegre edilerek kurulduğu dağıtım modellerinden daha esnek ve erişilebilirdir.
**Kubernetes, uygulama konteynerlerinin bir küme üzerinde dağıtımını ve zamanlamasını daha
verimli bir şekilde otomatikleştirir.** Kubernetes açık kaynaklı bir platformdur ve üretime hazırdır.

Bir Kubernetes kümesi iki tür kaynaktan oluşur:

* **Kontrol Düzlemi** kümeyi koordine eder
* **Düğümler** uygulamaları çalıştıran işçilerdir

### Küme Diyagramı

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**Kontrol Düzlemi kümeyi yönetmekten sorumludur.** Kontrol Düzlemi, uygulamaları zamanlama,
uygulamaların istenen durumunu koruma, uygulamaları ölçeklendirme ve yeni güncellemeleri
yayınlama gibi kümenizdeki tüm etkinlikleri koordine eder.

{{% alert %}}
_Kontrol Düzlemleri, kümeyi ve çalışan uygulamaları barındırmak için kullanılan düğümleri yönetir._
{{% /alert %}}

**Bir düğüm, bir Kubernetes kümesinde işçi makine olarak görev yapan bir sanal makine veya
fiziksel bir bilgisayardır.** Her düğümde, düğümü yönetmek ve Kubernetes kontrol düzlemiyle
iletişim kurmak için bir aracı olan bir Kubelet bulunur. Düğüm ayrıca
{{< glossary_tooltip text="containerd" term_id="containerd" >}} veya
{{< glossary_tooltip term_id="cri-o" >}} gibi konteyner işlemlerini yönetmek için araçlara da
sahip olmalıdır. Üretim trafiğini yöneten bir Kubernetes kümesi en az üç düğüme sahip olmalıdır;
çünkü bir düğüm devre dışı kaldığında hem bir [etcd](/docs/concepts/architecture/#etcd) üyesi hem de
bir kontrol düzlemi örneği kaybedilir ve fazlalık tehlikeye girer. Daha fazla kontrol düzlemi düğümü
ekleyerek bu riski azaltabilirsiniz.

Kubernetes üzerinde uygulamaları dağıttığınızda, kontrol düzlemine uygulama konteynerlerini
başlatmasını söylersiniz. Kontrol düzlemi, konteynerleri kümenin düğümlerinde çalışacak şekilde
zamanlar. **Kubelet gibi düğüm düzeyindeki bileşenler, kontrol düzleminin sunduğu
[Kubernetes API](/docs/concepts/overview/kubernetes-api/)'sini kullanarak kontrol düzlemiyle iletişim kurar.**
Son kullanıcılar da kümeyle etkileşim kurmak için doğrudan Kubernetes API'sini kullanabilir.

Bir Kubernetes kümesi fiziksel veya sanal makinelere dağıtılabilir. Kubernetes geliştirmesine
başlamak için Minikube'u kullanabilirsiniz. Minikube, yerel makinenizde bir sanal makine oluşturan
ve yalnızca bir düğüm içeren basit bir küme dağıtan hafif bir Kubernetes uygulamasıdır.
Minikube; Linux, macOS ve Windows sistemleri için kullanılabilir. Minikube CLI, kümenizle çalışmak
için başlatma, durdurma, durum ve silme dahil olmak üzere temel önyükleme işlemleri sağlar.

## {{% heading "whatsnext" %}}

* Eğitim: [Hello Minikube](/docs/tutorials/hello-minikube/).
* [Küme Mimarisi](/docs/concepts/architecture/) hakkında daha fazla bilgi edinin.
