# The Kubernetes belgeleri

[![Netlify Durum](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bu depo oluşturmak için gereken varlıkları içerir [Kubernetes website and documentation](https://kubernetes.io/). Katkıda bulunmak istediğinize sevindik!

- [Dokümanlara katkıda bulunmak](#contributing-to-the-docs)
- [Yerelleştirme](#localization-readmemds)

## Bu depoyu kullanma

Web sitesini Hugo (Genişletilmiş sürüm) kullanarak yerel olarak çalıştırabilir veya bir kapsayıcı çalışma zamanında çalıştırabilirsiniz. Canlı web sitesiyle dağıtım tutarlılığı sağladığı için kapsayıcı çalışma zamanını kullanmanızı şiddetle öneririz.

## Önkoşullar

Bu depoyu kullanmak için aşağıdakilerin yerel olarak yüklenmesi gerekir:

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (Extended version)](https://gohugo.io/)
- Kapsayıcı çalışma zamanı gibi [Docker](https://www.docker.com/).

Başlamadan önce bağımlılıkları yükleyin. Depoyu klonlayın ve dizine gidin:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes web sitesi aşağıdakileri kullanır [Docsy Hugo theme](https://github.com/google/docsy#readme). Web sitesini bir kapsayıcıda çalıştırmayı planlıyor olsanız bile, aşağıdakileri çalıştırarak alt modülü ve diğer geliştirme bağımlılıklarını çekmenizi önemle öneririz:

```bash
# pull in the Docsy submodule
git submodule update --init --recursive --depth 1
```

## Web sitesini bir kapsayıcı kullanarak çalıştırma

Siteyi bir kapsayıcıda oluşturmak için kapsayıcı görüntüsünü oluşturmak ve çalıştırmak için aşağıdakileri çalıştırın:

```bash
make container-image
make container-serve
```

Hata görürseniz, büyük olasılıkla hugo kapsayıcısının yeterli bilgi işlem kaynağına sahip olmadığı anlamına gelir. Bunu çözmek için, makinenizdeki Docker için izin verilen CPU ve bellek kullanımını artırın ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) ve [Windows](https://docs.docker.com/docker-for-windows/#resources)).

Tarayıcınızı <http://localhost:1313> web sitesini görüntülemek için. Kaynak dosyalarda değişiklik yaptığınızda, Hugo web sitesini günceller ve tarayıcıyı yenilemeye zorlar.

## Hugo'yu kullanarak web sitesini yerel olarak çalıştırma

`HUGO_VERSİON` ortam değişkeni tarafından belirtilen Hugo genişletilmiş sürümünü yüklediğinizden emin olun. [`netlify.toml`](netlify.toml#L10) dosya.

Siteyi yerel olarak oluşturmak ve test etmek için:

```bash
# install dependencies
npm ci
make serve
```

Bu, 1313 numaralı bağlantı noktasında yerel Hugo sunucusunu başlatır. Tarayıcınızı <http://localhost:1313> web sitesini görüntülemek için. Kaynak dosyalarda değişiklik yaptığınızda, Hugo web sitesini günceller ve tarayıcıyı yenilemeye zorlar.

## API referans sayfalarını oluşturma

`Content/en/docs/reference/kubernetes-apı` içinde bulunan API referans sayfaları, <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

Yeni bir Kubernetes sürümünün referans sayfalarını güncellemek için (aşağıdaki örneklerde v1.20'yi güncelleştirilecek sürümle değiştirin):

1. `Kubernetes-resources-reference` alt modülünü çekin:

   ```bash
   git submodule update --init --recursive --depth 1
   ```
   
   2. Swagger belirtimini güncelle:
```
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
```


3. `Apiref-assets/config / ' dosyasında, dosyaları `için uyarlayın.yaml ve fields.yaml ' yeni sürümdeki değişiklikleri yansıtacak.

4. Ardından, sayfaları oluşturun:

   ```bash
   make api-reference
   ```
   
   Siteyi bir kapsayıcı görüntüsünden oluşturup sunarak sonuçları yerel olarak test edebilirsiniz:
   
   ```bash
   make container-image
   make container-serve
   ```
   
   Bir web tarayıcısında <http://localhost:1313/docs/reference/kubernetes-api / > API referansını görüntülemek için.

5. Yeni sözleşmedeki tüm değişiklikler yapılandırma dosyalarına yansıtıldığında `toc.yaml` ve `fields.yaml`, yeni oluşturulan API referans sayfalarıyla bir Çekme İsteği oluşturun.

## Arıza

Hugo, teknik nedenlerden dolayı iki ikili set halinde gönderilir. Geçerli web sitesi aşağıdakilere dayanarak çalışır **Hugo Genişletilmiş** sadece versiyon. İçinde [yayın sayfası](https://github.com/gohugoio/hugo/releases) arşivleri arayın `extended` ismen. Onaylamak için çalıştırın `hugo sürüm` ve kelimeyi ara `extended`.


## Çok fazla açık dosya için mac OS sorunlarını giderme

Eğer kaçarsan `make server` macos'ta ve aşağıdaki hatayı alırsınız:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Açık dosyalar için geçerli sınırı kontrol etmeyi deneyin:

`launchctl limit maxfiles`

Ardından aşağıdaki komutları çalıştırın (<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# Bunlar orijinal gist bağlantıları, şimdi benim gistlerime bağlanıyor.
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

Bu, Catalina'nın yanı sıra Mojave mac OS için de çalışır.

## SIG Dokümanlarına dahil ol

SIG Dokümanlar Kubernetes topluluğu ve toplantılar hakkında daha fazla bilgi edinin

[topluluk sayfası](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)

Bu projenin bakıcılarına şu adresten de ulaşabilirsiniz:

- [Slack](https://kubernetes.slack.com/messages/sig-docs) [Bu Slack için bir davetiye alın](https://slack.k8s.io/)
- [Posta Listesi](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Dokümanlara katkıda bulunmak

Tıklayabilirsiniz **Fork** GitHub hesabınızda bu deponun bir kopyasını oluşturmak için ekranın sağ üst kısmındaki düğmeyi tıklayın. Bu kopyaya a denir. _fork_. fork istediğiniz değişiklikleri yapın ve bu değişiklikleri bize göndermeye hazır olduğunuzda fork gidin ve bize bildirmek için yeni bir çekme isteği oluşturun.

Çekme isteğiniz oluşturulduktan sonra, bir Kubernetes gözden geçiricisi açık ve eyleme geçirilebilir geri bildirim sağlama sorumluluğunu üstlenecektir. Çekme isteğinin sahibi olarak, ** Kubernetes gözden geçiricisi tarafından size sağlanan geri bildirimleri ele almak için çekme isteğinizi değiştirmek sizin sorumluluğunuzdadır.**

Ayrıca, size geri bildirim sağlamak için birden fazla Kubernetes gözden geçiricisine sahip olabileceğinizi veya başlangıçta size geri bildirim sağlamak üzere atanandan farklı bir Kubernetes gözden geçiricisinden geri bildirim alabileceğinizi unutmayın.

Ayrıca, bazı durumlarda, gözden geçirenlerinizden biri gerektiğinde bir Kubernetes teknoloji gözden geçiricisinden teknik inceleme isteyebilir. Gözden geçirenler zamanında geri bildirim sağlamak için ellerinden geleni yapacaktır, ancak yanıt süresi koşullara bağlı olarak değişebilir.

Kubernetes belgelerine katkıda bulunma hakkında daha fazla bilgi için bkz.:

- [Kubernetes dökümanlarına katkıda bulun](https://kubernetes.io/docs/contribute/)
- [Sayfa İçerik Türleri](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Dokümantasyon Stil Kılavuzu](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes Belgelerini Yerelleştirme](https://kubernetes.io/docs/contribute/localization/)

## Yerelleştirme `README.md`

| Dil                        | Dil                        |
| -------------------------- | -------------------------- |
| [Çince](README-zh.md)      | [Korean](README-ko.md)     |
| [Fransızca](README-fr.md)  | [Polish](README-pl.md)     |
| [Almanca](README-de.md)    | [Portekizce](README-pt.md) |
| [Hintçe](README-hi.md)     | [Rusça](README-ru.md)      |
| [Endonezya](README-id.md)  | [İspanyolca](README-es.md) |
| [İtalyanca](README-it.md)  | [Ukrayna](README-uk.md)    |
| [Japonca](README-ja.md)    | [Vietnam](README-vi.md)    |
| [Türkçe](README-tr.md)     |

## Davranış kuralları

Kubernetes topluluğuna katılım aşağıdaki kurallara tabidir: [CNCF Davranış Kuralları](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).

## Teşekkür

Kubernetes topluluk katılımı konusunda gelişiyor ve web sitemize ve belgelerimize yaptığınız katkılardan dolayı teşekkür ediyoruz!
