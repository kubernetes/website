# Kubernetes Dokümantasyonu

[![Netlify Durumu](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub sürümü](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bu depo, [Kubernetes web sitesini ve dokümantasyonunu](https://kubernetes.io/) oluşturmak için gereken tüm varlıkları içerir. Katkıda bulunmak istemenizden çok memnuniyet duyuyoruz!

- [Dokümantasyona katkıda bulunma](#dok%C3%BCmantasyona-katk%C4%B1da-bulunma)
- [Çoklu dil READMEs](#%C3%A7oklu-dil-readme-dosyalar%C4%B1)

## Bu depoyu kullanma

Bu web sitesini yerel olarak [Hugo (Genişletilmiş sürüm)](https://gohugo.io/) kullanarak çalıştırabilir veya bir konteyner çalışma zamanında çalıştırabilirsiniz. Dağıtım tutarlılığı sağladığı için konteyner çalışma zamanı önerilir.

## Önkoşullar

Bu depoyu kullanmak için bilgisayarınıza aşağıdakileri yüklemeniz gerekir:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Genişletilmiş sürüm)](https://gohugo.io/)
- [Docker](https://www.docker.com/) gibi bir konteyner çalışma zamanı.

> [!NOT]
Yüklediğiniz Hugo Genişletilmiş sürümünün, [`netlify.toml`](netlify.toml#L11) dosyasında `HUGO_VERSION` ortam değişkeniyle belirtilen sürümle eşleştiğinden emin olun.

Başlamadan önce bağımlılıkları yükleyin. Depoyu klonlayın ve dizine geçin:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes web sitesi [Docsy Hugo temasını](https://github.com/google/docsy#readme) kullanır. Web sitesini bir konteynerde çalıştırmayı planlasanız bile, alt modül ve diğer geliştirme bağımlılıklarını şu şekilde çekmenizi şiddetle öneririz:

### Windows

```powershell
# alt modül bağımlılıklarını al
git submodule update --init --recursive --depth 1
```

### Linux / diğer Unix

```bash
# alt modül bağımlılıklarını al
make module-init
```

## Web sitesini konteyner kullanarak çalıştırma

Web sitesini bir konteyner içinde derlemek için aşağıdaki komutu çalıştırın:

```bash
# $CONTAINER_ENGINE değişkenini herhangi bir Docker benzeri konteyner aracının adına ayarlayabilirsiniz
make container-serve
```

Bir hata görürseniz, bu Hugo konteynerinin yeterli kaynağa sahip olmadığı anlamına gelebilir. Çözmek için, makinenizdeki Docker'a izin verilen CPU ve bellek miktarını artırın ([macOS](https://docs.docker.com/desktop/settings/mac/) ve [Windows](https://docs.docker.com/desktop/settings/windows/)).

Tarayıcınızı açın ve web sitesini görmek için <http://localhost:1313> adresine gidin. Kaynak dosyalarda değişiklik yaptığınızda, Hugo web sitesini günceller ve otomatik olarak yeniden yükler.

## Hugo kullanarak web sitesini doğrudan çalıştırma

[`netlify.toml`](netlify.toml#L11) dosyasında `HUGO_VERSION` ortam değişkeniyle belirtilen Hugo Genişletilmiş sürümünü yüklediğinizden emin olun.

Bağımlılıkları yüklemek, web sitesini yayınlamak ve yerel olarak test etmek için şunu çalıştırın:

- macOS ve Linux için

  ```bash
  npm ci
  make serve
  ```

- Windows için (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

Bu, Hugo yerel sunucusunu 1313 portunda başlatacaktır. Tarayıcınızı açın ve web sitesini görmek için <http://localhost:1313> adresine gidin.

## SIG Docs'a katılın

SIG Docs Kubernetes topluluğu ve toplantıları hakkında daha fazla bilgi için [topluluk sayfasını](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) ziyaret edin.

Bu projenin yöneticilerine şu yollarla da ulaşabilirsiniz:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Bu Slack'e davetiye al](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Dokümantasyona katkıda bulunma

Bu deponun GitHub hesabınızda bir kopyasını oluşturmak için ekranın sağ üst köşesindeki **Fork** düğmesine tıklayabilirsiniz. Bu kopyaya _fork_ denir. Fork'unuzda istediğiniz değişiklikleri yapın ve bize göndermeye hazır olduğunuzda fork'unuza gidin ve bize bildirmek için yeni bir pull request oluşturun.

Pull request'iniz oluşturulduktan sonra, bir Kubernetes incelemecisi açık, eyleme geçilebilir geri bildirim sağlamaktan sorumlu olacaktır. Pull request sahibi olarak, **size sağlanan geri bildirimi ele almak için pull request'inizi değiştirmek sizin sorumluluğunuzdadır.**

Kubernetes dokümantasyonuna katkıda bulunma hakkında daha fazla bilgi için bkz:

- [Kubernetes dokümantasyonuna katkıda bulunma](https://kubernetes.io/docs/contribute/)
- [Sayfa içerik türleri](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Dokümantasyon stil kılavuzu](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes dokümantasyonunu yerelleştirme](https://kubernetes.io/docs/contribute/localization/)

## Türkçe yerelleştirme

Türkçe yerelleştirme projesi yenidir. Katkıda bulunmak ister misiniz?

- GitHub: [@HFerrahoglu](https://github.com/HFerrahoglu), [@orcunakrcy](https://github.com/orcunakrcy)
- Slack: [#kubernetes-docs-tr](https://kubernetes.slack.com/) (Slack davet için [slack.k8s.io](https://slack.k8s.io/))

## Davranış Kuralları

Kubernetes topluluğuna katılım, [CNCF Davranış Kuralları](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) ile yönetilir.

## Teşekkürler

Kubernetes, topluluk katılımıyla gelişir ve web sitemize ve dokümantasyonumuza katkılarınızı takdir ediyoruz!
