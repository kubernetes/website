
# Kubernetes dökümantasyonu

  

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

  

Bu repo, [Kubernetes web sitesini ve dökümantasyonlarını](https://kubernetes.io/) oluşturmak için gereken varlıkları içerir. Katkıda bulunmak istemenize sevindik!
  

- [Dökümanlara katkıda bulunmak](#contributing-to-the-docs)

- [ReadMe'lerin lokalize edilmesi](#localization-readmemds)

  

## Bu repoyu kullanmak

  

Web sitesini Hugo (Genişletilmiş versiyonu) kullanarak lokal olarak veya bir konteyner içinde çalıştırabilirsiniz. Canlı web sitesiyle dağıtım tutarlılığı sağladığı için konteyner kullanmanızı şiddetle öneririz.
  

##   Önkoşullar

  

Bu repoyu kullanabilmek için aşağıdakilerin lokal olarak indirilmiş olması gerekiyor:

  

- [npm](https://www.npmjs.com/)

- [Go](https://golang.org/)

- [Hugo (Genişletilmiş versiyon)](https://gohugo.io/)

- [Docker](https://www.docker.com/) gibi bir konteyner çalışma zamanı.

  

Başlamadan önce, gereksinimleri indirin. Repo'yu klonlayın ve çalışma dosyasına gelin:
   

```bash

git clone https://github.com/kubernetes/website.git

cd website

```

  

Kubernetes websitesi [Docsy Hugo theme](https://github.com/google/docsy#readme) kullanıyor. Web sitesini bir konteyner ile çalıştırmayı planlıyor olsanız bile, aşağıdakileri çalıştırarak alt modülü ve diğer geliştirme gereksinimlerini çekmenizi şiddetle öneririz:



```bash

# Docsy submodule'ünü çekin

git submodule update --init --recursive --depth 1

```

  

## Websiteyi konteyner kullanarak çalıştırmak

  

Siteyi bir konteynerın oluşturmak için konteyner görüntüsünü oluşturmak için aşağıdakileri çalıştırın ve çalıştırın:  

```bash

make container-image

make container-serve

```

  

Eğer hatalar görüyorsanız, bunun nedeni büyük ihtimalle hugo konteynerı yeterince işlem gücüne sahip olamadığı içindir. Bunu çözmek için Docker'ın CPU ve bellek kullanımını arttırın  ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) ve [Windows](https://docs.docker.com/docker-for-windows/#resources)).


 Websiteyi görebilmek için tarayıcınızı açın ve <http://localhost:1313> linkine gidin. Dosyalarda değişiklikler yaptıkça, Hugo web sitesini güncelleyecek ve tarayıcınızı yenilemeye zorlayacaktır

## Websiteyi Hugo ile localde çalıştırmak

  
 [`netlify.toml`](netlify.toml#L10) dosyasında "HUGO_VERSION" ortam değişkeni tarafından belirtilen Hugo genişletilmiş sürümünü yüklediğinizden emin olun.
  
Siteyi lokalde hazır hale getirmek için şunu çalıştırın:

  

```bash

# gereksinimleri indir

npm ci

make serve

```

  
Bu 1313 bağlantı noktasında yerel Hugo sunucusunu başlatır. Web sitesini görüntülemek için tarayıcınızda <http://localhost:1313> ı açın. Kaynak dosyalarda değişiklik yaptığınızda, Hugo web sitesini günceller ve tarayıcı yenilemeye zorlar.
  

## API referans sayfalarını oluşturma

  
"content/en/docs/reference/kubernetes-api" içinde bulunan API referans sayfaları, <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> kullanılarak Swagger spesifikasyonundan oluşturulmuştur.
  

Yeni bir Kubernetes sürümünün referans sayfalarını güncellemek için (aşağıdaki örneklerde v1.20'yi güncellenecek sürümle değiştirin):

  

1. `kubernetes-resources-reference` submodülünü çekin:

  

```bash

git submodule update --init --recursive --depth 1

```

  

2. Swagger spesifikasyonunu güncelleyin:

  

```

curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json

```

  

3. `api-ref-assets/config/` içinde, `toc.yaml` ve `fields.yaml` dosyalarını yeni sürümdeki değişiklikleri yansıtacak şekilde uyarlayın.
  

4. Daha sonra da, sayfaları oluşturun:

  

```bash

make api-reference

```

  

Siteyi bir konteyner görüntüsünden oluşturup sunarak sonuçları yerel olarak test edebilirsiniz:

   

```bash

make container-image

make container-serve

```

  

Bir web tarayıcısında API referansını görüntülemek için <http://localhost:1313/docs/reference/kubernetes-api/> adresine gidin.

 
  

5.   Yeni sözleşmedeki tüm değişiklikler `toc.yaml` ve `fields.yaml` yapılandırma dosyalarına yansıtıldığında, yeni oluşturulan API referans sayfalarıyla bir Çekme Talebi oluşturun.


  

##   Sorun giderme
  

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

  

Hugo, teknik nedenlerden dolayı iki ikili dosya setinde yayımlanır. Mevcut web sitesi yalnızca **Hugo Genişletilmiş** sürümüne göre çalışır. [Sürüm sayfasında](https://github.com/gohugoio/hugo/releases) adında "genişletilmiş" olan arşivleri arayın. Onaylamak için `hugo version`u çalıştırın ve `extended` kelimesini arayın.
  

### MacOS çok fazla açık dosya problemi sorunlarını giderme

  

macOS de `make serve` komutunu çalıştırırsanız ve aşağıdaki hatayı alırsanız:
  

```bash

ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files

make: *** [serve] Error 1

```

  

Açık dosyalar için geçerli sınırını kontrol etmeyi deneyin;
  

`launchctl limit maxfiles`

  
Sonra da aşağıdaki komutları  çalıştırın
(<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c> dan uyarlandı):
  

```shell

#!/bin/sh

  

# Bunlar orjinal gist linkleri, kendi gist linklerimi paylaşıyorum

# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist

# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

  

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

  

sudo mv limit.maxfiles.plist /Library/LaunchDaemons

sudo mv limit.maxproc.plist /Library/LaunchDaemons

  

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist

sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

  

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist

```

  
Bu macOS Catalina'da da Mojave'de de çalışıyor.
  

## SIG dökümanlarına dahil olun

  

 [Topluluk sayfasında](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) SIG Docs Kubernetes topluluğu ve toplantılar hakkında daha fazla bilgi edinin.

Bu proje ile ilgilenenlere şu linkleri kullanarak da ulaşabilirsiniz:
  

- [Slack](https://kubernetes.slack.com/messages/sig-docs) [Bu Slack için davetiye alın](https://slack.k8s.io/)

- [Mail Listesi](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

  

## Dökümantasyonlara katkı sağlamak

  

GitHub hesabınızda bu deponun bir kopyasını oluşturmak için ekranın sağ üst kısmındaki **Fork** düğmesini tıklayabilirsiniz. Bu kopyaya _fork_ yani çatal adı verilir. Çatalınızda istediğiniz değişiklikleri yapın ve bu değişiklikleri bize göndermeye hazır olduğunuzda çatalınıza gidin ve bize bildirmek için yeni bir çekme isteği oluşturun.


Çekme isteğiniz oluşturulduktan sonra, bir Kubernetes gözden geçiricisi açık ve eyleme geçirilebilir geri bildirim sağlama sorumluluğunu üstlenir. Çekme isteğinin sahibi olarak, **Çekme isteğinizi, Kubernetes gözden geçiren tarafından size sağlanan geri bildirimi ele alacak şekilde değiştirmek sizin sorumluluğunuzdadır.**
  

Ayrıca, birden fazla Kubernetes incelemecisinin size geri bildirim sağlamasına veya bir Kubernetes incelemecisinden size geri bildirim sağlamak için başlangıçta atanandan farklı bir geri bildirim almanıza neden olabileceğini unutmayın.

  
Ayrıca, bazı durumlarda, gözden geçirenlerinizden biri gerektiğinde bir Kubernetes teknik inceleme uzmanından teknik inceleme isteyebilir. Gözden geçirenler, zamanında geri bildirim sağlamak için ellerinden gelenin en iyisini yapacaklardır, ancak yanıt süresi koşullara göre değişebilir.
  
 
Kubernetes dökümantasyonuna katkı sağlama hakkında daha fazla bilgi için aşağıdakileri inceleyebilirsiniz:
  

- [Kubernetes dökümanlarına katkıda bulunun](https://kubernetes.io/docs/contribute/)

- [Sayfa İçeriği Türleri](https://kubernetes.io/docs/contribute/style/page-content-types/)

- [Dokümantasyon Stili Kılavuzu](https://kubernetes.io/docs/contribute/style/style-guide/)

- [Kubernetes Dökümanlarını Yerelleştirme](https://kubernetes.io/docs/contribute/localization/)

  

## Lokalizasyon `README.md` leri

  

| Dil | Dil |

| -------------------------- | -------------------------- |

| [Çince](README-zh.md) | [Korece](README-ko.md) |

| [Fransızca](README-fr.md) | [Lehçe](README-pl.md) |

| [Almanca](README-de.md) | [Portekizce](README-pt.md) |

| [Hintçe](README-hi.md) | [Rusça](README-ru.md) |

| [Endonezyaca](README-id.md) | [İspanyolca](README-es.md) |

| [Italyanca](README-it.md) | [Ukraynaca](README-uk.md) |

| [Japonca](README-ja.md) | [Vietnamca](README-vi.md) |

| [Türkçe](README-tr.md) |

  

## Adap Kuralı
  

Kubernetes topluluğuna olan katılımlar [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) tarafından yönetiliyor. 

  

## Teşekkür Ederiz


Kubernetes, topluluk katılımı ile birlikte başarılı bir şekilde büyüyor. Web sitemize ve belgelerimize katkılarınız için teşekkür ederiz!