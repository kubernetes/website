# Kubernetes dökümantasyonu

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bu depo,[Kubernetes web sitesini ve dökümantasyonunu](https://kubernetes.io/) oluşturmak için gerekli varlıkları içerir. Katkıda bulunmak istemenize sevindik!

+ [Dokümanlara katkıda bulunmak](#contributing-to-the-docs)
+ [Yerelleştirme BeniOku](#localization-readmemds)

# Bu depoyu kullanma

Web sitesini Hugo (Genişletilmiş sürüm) kullanarak yerel olarak çalıştırabilirsiniz, veya bir konteynır çalışma zamanında çalıştırabilirsiniz. Canlı web sitesiyle dağıtım tutarlılığı sağladığı için konteyner çalışma zamanını kullanmanızı şiddetle tavsiye ederiz.

## Önkoşullar

Bu depoyu kullanmak için, aşağıdakilerin yerel olarak yüklenmesi gerekir:

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (Genişletilmiş sürüm)](https://gohugo.io/)
- [Docker](https://www.docker.com/) gibi bir konteynır çalışma zamanı. 

Başlamadan önce bağımlılıkları kurun. Depoyu klonlayın ve dizine gidin:

```
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes web sitesi [Docsy Hugo temasını](https://github.com/google/docsy#readme)kullanır. Web sitesini bir konteynırda çalıştırmayı planlasanız bile, aşağıdakileri çalıştırarak alt modülü ve diğer geliştirme bağımlılıklarını çekmenizi şiddetle tavsiye ederiz:

```
# pull in the Docsy submodule
git submodule update --init --recursive --depth 1
```

## Web sitesini bir konteynır kullanarak çalıştırmak

Siteyi bir konteynırda oluşturmak için, konteynır görüntüsünü oluşturmak üzere aşağıdakileri çalıştırın:

```
make container-image
make container-serve
```

Web sitesini görüntülemek için tarayıcınızı http://localhost:1313 de açın. Kaynak dosyalarda değişiklik yaptıkça, Hugo web sitesini günceller ve bir tarayıcının yenilenmesini zorlar.

## Web sitesini Hugo kullanarak yerel olarak çalıştırmak

[`netlify.toml`](netlify.toml#L10) dosyasında `HUGO_VERSION` ortam değişkeni tarafından belirtilen Hugo genişletilmiş sürümünü kurduğunuzdan emin olun.

Siteyi yerel olarak oluşturmak ve test etmek için şunu çalıştırın:

```bash
# install dependencies
npm ci
make serve
```

Bu, yerel Hugo sunucusunu 1313 numaralı bağlantı noktasından başlatacak. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Building the API reference pages

The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, using https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs.

To update the reference pages for a new Kubernetes release (replace v1.20 in the following examples with the release to update to):

1. Pull the `kubernetes-resources-reference` submodule:

```
git submodule update --init --recursive --depth 1
```

2. Create a new API revision into the submodule, and add the Swagger specification:

```
mkdir api-ref-generator/gen-resourcesdocs/api/v1.20
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-generator/gen-resourcesdocs/api/v1.20/swagger.json
```

3. Copy the table of contents and fields configuration for the new release from a previous one:

```
mkdir api-ref-generator/gen-resourcesdocs/api/v1.20
cp api-ref-generator/gen-resourcesdocs/api/v1.19/* api-ref-generator/gen-resourcesdocs/api/v1.20/
```

4. Adapt the files `toc.yaml` and `fields.yaml` to reflect the changes between the two releases

5. Next, build the pages:

```
make api-reference
```

You can test the results locally by making and serving the site from a container image:

```
make container-image
make container-serve
```

In a web browser, go to http://localhost:1313/docs/reference/kubernetes-api/ to view the API reference.

6. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.

## Troubleshooting
### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name. To confirm, run `hugo version` and look for the word `extended`.

### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Try checking the current limit for open files:

`launchctl limit maxfiles`

Then run the following commands (adapted from https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
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

This works for Catalina as well as Mojave macOS.


# Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs) [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

# Dokümanlara katkıda bulunmak

GitHub hesabınızda bu deponun bir kopyasını oluşturmak için ekranın sağ üst kısmındaki **Fork(Çatal)** düğmesine tıklayabilirsiniz. Bu kopyaya *fork* adı verilir. Çatalınızda istediğiniz değişiklikleri yapın ve bu değişiklikleri bize göndermeye hazır olduğunuzda çatalınıza gidin ve bunu bize bildirmek için yeni bir çekme isteği oluşturun.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**

Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Kubernetes belgelerine katkıda bulunma](https://kubernetes.io/docs/contribute/)
* [Sayfa İçerik Türleri](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Dokümantasyon Stil Kılavuzu](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Kubernetes Dokümantasyonunu Yerelleştirme](https://kubernetes.io/docs/contribute/localization/)

# Localization `README.md`'s

| Dil  | Dil |
|---|---|
|[Çince](README-zh.md)|[Korece](README-ko.md)|
|[Fransızca](README-fr.md)|[Lehçe](README-pl.md)|
|[Almanca](README-de.md)|[Portekizce](README-pt.md)|
|[Hintçe](README-hi.md)|[Rusça](README-ru.md)|
|[Endonazca](README-id.md)|[İspanyolca](README-es.md)|
|[İtalyanca](README-it.md)|[Ukraynaca](README-uk.md)|
|[Japonca](README-ja.md)|[Vietnamca](README-vi.md)|


# Davranış kodu

Kubernetes topluluğuna katılım, [CNCF Davranış Kuralları'na](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) tabidir .

# Thank you!

Kubernetes, topluluk katılımıyla gelişir ve web sitemize ve dökümantasyonumuza yaptığınız katkılar için teşekkür ederiz!
