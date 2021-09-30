---
title: Extendendo a API do Kubernetes com a camada de agregação
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 20
---

<!-- overview -->

A camada de agregação permite ao Kubernetes ser estendido com APIs adicionais,
para além do que é oferecido pelas APIs centrais do Kubernetes.
As APIs adicionais podem ser soluções prontas tal como o
[catálogo de serviços](/docs/concepts/extend-kubernetes/service-catalog/),
ou APIs que você mesmo desenvolva.

A camada de agregação é diferente dos [Recursos Personalizados](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
que são uma forma de fazer o {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
reconhecer novas espécies de objetos.



<!-- body -->

## Camada de agregação

A camada de agregação executa em processo com o kube-apiserver.
Até que um recurso de extensão seja registado, a camada de agregação
não fará nada. Para registar uma API, terá de adicionar um objeto *APIService*
que irá "reclamar" o caminho URL na API do Kubernetes. Nesta altura, a camada
de agregação procurará qualquer coisa enviada para esse caminho da API
(e.g. `/apis/myextension.mycompany.io/v1/…`) para o *APIService* registado.

A maneira mais comum de implementar o *APIService* é executar uma
*extensão do servidor API* em *Pods* que executam no seu cluster.
Se estiver a usar o servidor de extensão da API para gerir recursos
no seu cluster, o servidor de extensão da API (também escrito como "extension-apiserver")
é tipicamente emparelhado com um ou mais {{< glossary_tooltip text="controladores" term_id="controller" >}}.
A biblioteca apiserver-builder providencia um esqueleto para ambos
os servidores de extensão da API e controladores associados.

### Latência da resposta

Servidores de extensão de APIs devem ter baixa latência de rede de e para o kube-apiserver.
Pedidos de descoberta são necessários que façam a ida e volta do kube-apiserver em 5
segundos ou menos.

Se o seu servidor de extensão da API não puder cumprir com o requisito de latência,
considere fazer alterações que permitam atingi-lo. Pode também definir
[portal de funcionalidade](/docs/reference/command-line-tools-reference/feature-gates/) `EnableAggregatedDiscoveryTimeout=false` no kube-apiserver para desativar
a restrição de intervalo. Esta portal de funcionalidade deprecado será removido
num lançamento futuro.



## {{% heading "whatsnext" %}}


* Para pôr o agregador a funcionar no seu ambiente, [configure a camada de agregação](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* De seguida, [configura um api-server de extensão](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) para funcionar com a camada de agregação.
* Também, aprenda como pode [estender a API do Kubernetes através do use de Definições de Recursos Personalizados](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
* Leia a especificação do [APIService](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apiservice-v1-apiregistration-k8s-io)


