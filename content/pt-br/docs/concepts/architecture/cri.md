---
title: Container Runtime Interface (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

O CRI é uma interface de plug-in que permite ao kubelet usar uma ampla variedade
 de tempos de execução de contêiner, sem a necessidade de recompilar 
 os componentes do cluster.

Você precisa de um
{{<glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime">}} em cada nó em seu cluster, para que o
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} possa iniciar
{{< glossary_tooltip text="Pods" term_id="pod" >}} e seus contêineres.

{{< glossary_definition prepend="A interface do agente de execução de contêiner (CRI) é" term_id="container-runtime-interface" length="all" >}}

<!-- body -->

## A API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

O kubelet atua como um cliente ao se conectar ao agente de execução de contêiner via gRPC. Os endpoints de serviço de imagem e agente de execução devem estar disponíveis no agente de execução do contêiner, que pode ser configurado separadamente no kubelet usando as [opções de linha de comando](/docs/reference/command-line-tools-reference/kubelet)
`--image-service-endpoint` e `--container-runtime-endpoint`.


No Kubernetes v{{< skew currentVersion >}}, o kubelet prefere usar CRI `v1`.
Se um agente de execução de contêiner não oferecer suporte à versão `v1` do CRI, 
o kubelet tentará negociar qualquer versão compatível mais antiga.
O kubelet v{{< skew currentVersion >}}  também pode negociar a versão do CRI `v1alpha2`, 
mas esta versão é considerada obsoleta. 
Se o kubelet não puder negociar uma versão CRI suportada, 
o kubelet desiste e não se registra como um nó.


## Atualizando

Ao atualizar o Kubernetes, o kubelet tenta selecionar automaticamente a versão mais recente do CRI na reinicialização do componente. Se isso falhar, o fallback ocorrerá conforme mencionado acima. Se uma rediscagem gRPC foi necessária porque o agente de execução do contêiner foi atualizado, o agente de execução do contêiner também deve oferecer suporte à versão inicialmente selecionada ou a rediscagem deve falhar. Isso requer uma reinicialização do kubelet.


## {{% heading "whatsnext" %}}

- Leia mais sobre a [definição do protocolo](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto) do CRI