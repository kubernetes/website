---
title: Listar todas as imagens de contêiner em execução no cluster
content_type: task
weight: 100
---

<!-- overview -->

Esta página mostra como usar o kubectl para listar todas as imagens de 
contêineres dos Pods em execução no cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

Neste exercício, você usará o kubectl para buscar todos os Pods 
em execução no cluster e formatar a saída com uma lista dos contêineres 
por imagem.

## Listar todas as imagens de contêiner de todos os namespaces

- Busque todos os Pods em todos os namespaces usando `kubectl get pods --all-namespaces`
- Formate a saída incluindo apenas a lista de nomes das imagens de contêiner
  usando `-o jsonpath={.items[*].spec['initContainers', 'containers'][*].image}`.
  Isso irá analisar recursivamente o campo `image` do JSON retornado.
  - Consulte a [referência de jsonpath](/docs/reference/kubectl/jsonpath/)
    para obter mais informações sobre como usar o jsonpath.
- Formate a saída usando as ferramentas: `tr`, `sort`, `uniq`
  - Use `tr` para substituir espaços por quebras de linha
  - Use `sort` para ordenar os resultados
  - Use `uniq` para agregar a contagem de imagens

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec['initContainers', 'containers'][*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```
O jsonpath é interpretado da seguinte forma:

- `.items[*]`:  para cada valor retornado
- `.spec`: coleta a especificação do recurso informado
- `['initContainers', 'containers'][*]`: para cada contêiner
- `.image`: coleta o nome da imagem

{{< note >}}
Quando você busca um único Pod pelo nome, por exemplo `kubectl get pod nginx`,
a parte `.items[*]` do caminho deve ser omitida porque um único Pod é retornado
e não uma lista de itens.
{{< /note >}}

## Listar imagens de contêiner por Pod

O formato de saída pode ser controlado ainda mais usando a operação `range` para
iterar sobre os elementos individualmente.

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Listar imagens de contêiner filtrando pelo label do Pod

Para selecionar apenas os Pods que correspondem a um label específico, use a flag -l.
O comando a seguir seleciona apenas os Pods com o label `app=nginx`.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Listar imagens de contêiner filtrando pelo namespace do Pod

Para selecionar apenas os Pods de um namespace específico, use a flag namespace.
O comando a seguir seleciona apenas os Pods no namespace `kube-system`.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Listar imagens de contêiner usando go-template ao invés de jsonpath

Como alternativa ao jsonpath, o kubectl suporta o uso de [go-templates](https://pkg.go.dev/text/template)
para formatar a saída:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Referência

* Guia de referência de [Jsonpath](/docs/reference/kubectl/jsonpath/)
* Guia de referência de [Go template](https://pkg.go.dev/text/template)
