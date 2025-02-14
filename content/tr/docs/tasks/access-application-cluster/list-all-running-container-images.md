---
title: Kümede Çalışan Tüm Konteyner Görüntülerini Listele
content_type: task
weight: 100
---

<!-- overview -->

Bu sayfa, bir kümede çalışan Pod'lar için tüm Konteyner görüntülerini listelemek üzere kubectl kullanmayı gösterir.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

Bu alıştırmada, bir kümede çalışan tüm Pod'ları fetch etmek ve her biri için Konteyner listesini çıkarmak üzere çıktıyı formatlamak için kubectl kullanacaksınız.

## Tüm ad alanlarındaki Konteyner görüntülerini listele

- `kubectl get pods --all-namespaces` kullanarak tüm ad alanlarındaki Pod'ları fetch edin
- Çıktıyı yalnızca Konteyner görüntü adlarının listesini içerecek şekilde formatlayın `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}` kullanarak. Bu, döndürülen json'dan `image` alanını özyinelemeli olarak ayrıştıracaktır.
  - jsonpath'i nasıl kullanacağınız hakkında daha fazla bilgi için [jsonpath referansı](/docs/reference/kubectl/jsonpath/) sayfasına bakın.
- Çıktıyı standart araçları kullanarak formatlayın: `tr`, `sort`, `uniq`
  - Boşlukları yeni satırlarla değiştirmek için `tr` kullanın
  - Sonuçları sıralamak için `sort` kullanın
  - Görüntü sayımlarını toplamak için `uniq` kullanın

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec['initContainers', 'containers'][*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```
Jsonpath şu şekilde yorumlanır:

- `.items[*]`: döndürülen her değer için
- `.spec`: spec'i al
- `['initContainers', 'containers'][*]`: her konteyner için
- `.image`: görüntüyü al

{{< note >}}
Bir Pod'u adıyla fetch ederken, örneğin `kubectl get pod nginx`,
tek bir Pod döndürüldüğü için yolun `.items[*]` kısmı çıkarılmalıdır.
{{< /note >}}

## Pod'a göre Konteyner görüntülerini listele

Formatlama, elemanlar üzerinde tek tek yineleme yapmak için `range` işlemi kullanılarak daha fazla kontrol edilebilir.

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Pod etiketiyle filtreleme yaparak Konteyner görüntülerini listele

Yalnızca belirli bir etikete uyan Pod'ları hedeflemek için -l bayrağını kullanın. Aşağıdaki, yalnızca `app=nginx` etiketine uyan Pod'ları eşleştirir.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Pod ad alanına göre filtreleme yaparak Konteyner görüntülerini listele

Yalnızca belirli bir ad alanındaki pod'ları hedeflemek için ad alanı bayrağını kullanın. Aşağıdaki, yalnızca `kube-system` ad alanındaki Pod'ları eşleştirir.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Jsonpath yerine go-template kullanarak Konteyner görüntülerini listele

Jsonpath'e alternatif olarak, Kubectl çıktıyı formatlamak için [go-templates](https://pkg.go.dev/text/template) kullanmayı destekler:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Referans

* [Jsonpath](/docs/reference/kubectl/jsonpath/) referans kılavuzu
* [Go template](https://pkg.go.dev/text/template) referans kılavuzu
