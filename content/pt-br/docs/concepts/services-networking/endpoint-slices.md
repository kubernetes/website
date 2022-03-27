---
title: EndpointSlices
content_type: concept
weight: 45
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

_EndpointSlices_ entregam uma maneira simples de rastrear endpoints de rede através de um cluster Kubernetes. Eles oferecem uma alternativa mais escalável e extensa aos Endpoints.
<!-- body -->

## Motivação

A Endpoints API oferece uma maneira simples e direta de rastremento de endpoints de rede no Kubernetes. Infelizmente à medida que os clusters Kubernetes e os {{< glossary_tooltip text="Serviços" term_id="service" >}} vem crescido para lidar e mandar mais tráfego para mais Pods do backend, limitações da API original se tornaram mais visíveis.
Mais notavelmente, estas limitações incluíam desafios com escalar para um númerio maior de endpoints de rede.

Já que todos os endpoints de rede para um serviço são armazenadas em recursos singulares de Endpoints, esses recursos podem ficar um tanto longos. Isso afeta a performance dos componentes do Kubernetes (principalmente a camada de gerenciamento principal) e resultam em quantidades significantes de tráfico na rede e processamento quando os Endpoints são alterados. EndpointSlices ajudam você a mitigar esses problema, além de oferecerem um recurso extenso para adicionar novas funcionalidades como roteamento topológico.

## Recursos do EndpointSlice {#endpointslice-resource}

No Kubernetes, um EndpointSlice contêm referência para um conjunto de endpoints de rede. A camada de gerenciamento principal automaticamente cria EndepointSlices para qualquer serviço Kubernetes que possua um {{< glossary_tooltip text="seletor"
term_id="selector" >}} especificado. Esses EndpointSlices incluem referências para todos os Pods que correspondam ao seletor do serviço. Os EndpointSlices agrupam endpoints de rede conjuntamente através de combinações únicas de protocolo, número da porta e nome do serviço.
O nome de um objeto EndpointSlice tem que ser um [nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

Como um exemplo, aqui está uma amostra de um recurso EndpointSlice para o `exemplo`
Kubernetes Service.

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

Por padrão, a camada de rastreamento cria e administra EndpointSlices para não ter mais de 100 endpoints cada. Você pode configurar isso com a flag
`--max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
, com um máximo de 1000.

EndpointSlices podem agir como a fonte da verdade para
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} quando é para saber
como rotear um tráfego interno. Quando habilitado, eles devem fornecer uma melhoria de
perfomance para serviços com um grande número de endpoints.

### Tipos de endereço

EndpointSlices suportam três tipos de endereço:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)

### Condições

A EndpointSlice API armazena condições sobre endpoints que podem ser úteis para os consumidores.
As três condições são `ready`, `serving`, e `terminating`.

#### Ready

`ready` é uma condição que mapeia para a condição `Ready` de um Pod. Um Pod em execução com a condição `Ready`
definida como `True` deve ter esta condição também definida como `true` para o EndpointSlice. Por
razões de compatibilidade, `ready` NUNCA é `true` quando um Pod está terminating. Consumidores devem referenciar
para a condição `serving` para inspecionar a prontidão de Pods terminating. A única excessão a
esta regra é para com Services com `spec.publishNotReadyAddresses` definido como `true`. Endpoints para estes Services irão sempre ter a condição `ready` definida como `true`.

#### Serving

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}
`Serving` é igual à condição `ready`, exceto que não leva em conta os estados de `terminating`.
Os consumidores da EndpointSlice API devem checar essa condição se eles se importam com a prontidão do pod enquanto
o pod também está em estado de `terminating`.

{{< note >}}

Embora `serving` seja praticamente idêntico ao `ready`, ele foi adicionado para evitar a quebrar o propósito do `ready`. Seria inesperado para clients existentes se `ready` pudesse possuir o valor de `true` para endpoints terminating, já que historicamente os endpoints terminating nunca foram incluídos nos Endpoints ou na EndpointSlice API. Por essa razão, `ready` _sempre_ possuirá o valor `false` para endpoints terminating, e uma nova condição `serving` foi adicionada na v1.20 para que os clients possam acompanhar pods terminating independente da existência semântica para `ready`.

{{< /note >}}

#### Terminating

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`Terminating` é uma condição que indica se um endpoint está terminating.
Para pods, é qualquer pod que tenha um deletion timestamp definido.

### Informação topológica {#topology}

Cada endpoint em um EndpointSlice pode conter informações de topologia relevantes.
As informações de topologia incluem a localização do endpoint e da informação
sobre o Nó e a zone correspondentes. Estes estão disponíveis nos seguintes
campos por endpoint no EndpointSlices:

* `nodeName` - O nome do Nó em que este endpoint está.
* `zone` - A zone em que este endpoint está.

{{< note >}}
Na API v1, o por endpoint `topology` foi efetivamente removido em favor dos
campos dedicados `nodeName` e `zone`.

A configuração de campos arbitrários de topologia no campo `endpoint` de um recurso `EndpointSlice`
foi descontinuada e não é mais suportada na API v1.
Em vez disso, a API v1 suporta a configuração individual dos campos `nodeName` e `zone`.
Estes campos são automaticamente traduzidos entre versões da API. Por exemplo, o
valor da chave `"topology.kubernetes.io/zone"` no campo `topology` na
API v1beta1 é acessível como o campo `zone` na API v1.
{{< /note >}}

### Gestão

Na maioria das vezes, a camada de gerenciamento (especificadamente, a endpoint slice
{{< glossary_tooltip text="controlador" term_id="controller" >}}) cria e
gerencia objetos EndpointSlice. Existe uma variedade de outros casos de uso para os
EndpointSlices, como implementações de service mesh, que podem resultar em outras
entidades ou controladores gerenciando conjuntos adicionais de EndpointSlices.

Para assegurar que multiplas entidades possam gerenciar EndpointSlices sem interferir
entre si, o Kubernetes define a
{{< glossary_tooltip term_id="label" text="label" >}}
`endpointslice.kubernetes.io/managed-by`, que indica a entidade gestora
de um EndpointSlice.
O controlador endpoint slice define `endpointslice-controller.k8s.io` como o valor
para esta label em todos os EndpointSlices que ele gerencia. Outras entidades gestoras de
EndpointSlices também devem definir um valor exclusivo para esta label.

### Domínio

Na maioria dos casos de uso, os EndpointSlices tem como domínio o serviço com que o objeto de endpoint slice rastreia endpoints para. Esse domínio é indicado por um proprietário referência em cada EndpointSlice, assim como uma label `kubernetes.io/service-name` que permite a pesquisa simples de todos os EndpointSlices que pertencem a um serviço.

### Redirecionamento de EndpointSlice 

Em alguns casos, aplicações criam recursos de endpoints customizados. Para garantir que essas aplicações não produzam simultaneamente para ambos endpoints e recursos de EnpointSlice, a camada de gerenciamento do cluster direciona a maioria dos recursos para os respectivos EndpointSlices.

A camada de gerenciamento reflete os recursos de endpoints a não ser que:

* O recurso de endpoint possua o rótulo `endpointslice.kubernetes.io/skip-mirror` como `true`.
* O recurso de endpoint possua a anotação de `control-plane.alpha.kubernetes.io/leader`.
* O respectivo recurso de serviço não exista.
* O respectivo recurso de serviço possua um seletor não nulo.

Recursos individuais de endpoints podem ser traduzidos para multiplos EndpointSlices. Isso irá ocorrer se um recurso de endpoints possuir multiplos subconjuntos ou incluir endpoints com multiplas famílias de IP (IPv4 e IPv6). Um máximo de 1000 endereçõs por subconjunto será redirecionado ao EndpointSlices.

### Distribuição dos EndpointSlices

Cada EndpointSlice possui um conjunto de portas que se aplica a todos os endpoints dentro do recurso. Quando portas nomeadas são utilizadas para um serviço, Pods podem acabar com diferentes números de portas de destino para a mesma porta nomeada, exigindo diferentes EndpointSlices. Isso é similar à lógica por trás de como os subconjuntos são agrupados com Endpoints.

A camada de gerenciamento tenta preencher os EndpointSlices o máximo possível, mas não ativamente reequilibra eles. A lógica é bem simples:

1. Itera através dos EndpointSlices existentes, removendo endpoints que não são mais desejados e atualizando os endpoints correspondentes foram alterados.
2. Itera através dos EndpointSlices que foram modificados no primeiro passo e preenche eles com qualquer novos endpoints necessários.
3. Se ainda houver novos endpoints para adicionar, tente encaixá-los em algum slice anterior que não foi alterado e/ou criar novos.

É importante ressaltar que o terceiro passo apresentado prioriza limitar as atualizações dos EndpointSlices do que uma distribuição perfeitamente completate deles. Como exemplo, se há 10 novos endpoints para serem adicionados e 2 EndpointSlices com espaço para mais 5 endpoints cada, essa abordagem irá criar um novo EndpointSlice ao invés de prencher os 2 EndpointSlices existentes. Em outras palavras, a criação única de um EndpointSlice é preferível do que múltiplas atualizações de EndpointSlice.

Com o kube-proxy rodando em cada Nó e verificando os EndpointSlices, qualquer alteração em um EndpointSlice torna-se relativamente custosa já que isso será transmitido para todos os Nós presentes no cluster. Essa abordagem tem como objetivo limitar o número mudanças que necessitam ser mandadas para todos os Nós, mesmo que isso resulte em múltiplos EndpointSlices que não estão completamente preenchidos.

Na prática, essa distribuição abaixo da ideal deve ser rara. A maioria das mudanças processadas pelo controlador do EndpointSlice serão pequenas o suficiente para caberem em um EndpointSlice existente, e se não forem, um novo EndpointSlice provavelmente será necessário em breve de qualquer maneira. As atualizações contínuas de Deployments também fornecem um
reempacotamento natural de EndpointSlices com todos os Pods e seus respectivos endpoints sendo substituídos.

### Endpoints duplicados

Devido à natureza das mudanças do EndpointSlice, endpoints podem ser representados em mais de um EndpointSlice ao mesmo tempo. Isso ocorre naturalmente à medida que mudanças em diferentes objetos de EndpointSlices podem chegar ao watch/cache do client Kubernetes em tempos diferentes. Implementações que utilizam EndpointSlice devem ser capazes de ter a apresentação do endpoint em mais de um slice. Uma implementação de referência de como executar a desduplicação de endpoint pode ser encontrada na implementação do`EndpointSliceCache` no `kube-proxy`.

## {{% heading "whatsnext" %}}

* Leia [Conectando aplicações com serviços](/docs/concepts/services-networking/connect-applications-service/)