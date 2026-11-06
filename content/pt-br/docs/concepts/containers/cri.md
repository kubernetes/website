---
title: Interface de execução de contêiner (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

A CRI é uma interface de plugins que permite ao kubelet utilizar uma ampla variedade de agentes de execução de contêineres, sem a necessidade de recompilar os componentes do cluster.

Você precisa de um {{< glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime" >}} funcional em cada Node do seu cluster, para que o {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} possa iniciar {{< glossary_tooltip text="Pods" term_id="pod" >}} e seus contêineres.

{{< glossary_definition term_id="cri" length="all" >}}

<!-- body -->

## A API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

O kubelet atua como cliente ao se conectar ao agente de execução de contêineres por meio de gRPC. Os endpoints do agente de execução e do serviço de imagens precisam estar disponíveis no agente de execução de contêineres. Esses endpoints podem ser configurados separadamente no kubelet usando a opção de linha de comando [`--container-runtime-endpoint`](/docs/reference/command-line-tools-reference/kubelet/).

A partir do Kubernetes v1.26, o kubelet exige que o agente de execução de contêineres ofereça suporte à API CRI `v1`. Se o agente de execução de contêineres não oferecer suporte à API `v1`, o kubelet não registrará o Node.

## Atualização

Ao atualizar a versão do Kubernetes em um Node, o kubelet é reiniciado. Se o agente de execução de contêineres não oferecer suporte à API CRI `v1`, o kubelet não conseguirá registrar o Node e informará um erro. Se for necessário estabelecer novamente a conexão gRPC porque o agente de execução de contêineres foi atualizado, o agente deverá oferecer suporte à API CRI `v1` para que a conexão seja estabelecida com sucesso. Isso pode exigir a reinicialização do kubelet depois que o agente de execução de contêineres estiver configurado corretamente.

## Transmissão em fluxo de listas {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

As chamadas RPC padrão da CRI para listar recursos (`ListContainers`, `ListPodSandbox` e `ListImages`) retornam todos os resultados em uma única resposta unária. Em Nodes com um grande número de contêineres — por exemplo, mais de aproximadamente 10.000, incluindo os que estão em execução e os que foram parados —, essas respostas podem ultrapassar o limite padrão de tamanho de mensagem do gRPC, de 16 MiB. Isso pode fazer com que o kubelet falhe ao reconciliar o estado com o agente de execução de contêineres.

Com o feature gate `CRIListStreaming` habilitado, o kubelet utiliza chamadas RPC com transmissão em fluxo no lado do servidor, como `StreamContainers`, `StreamPodSandboxes` e `StreamImages`. Elas permitem que o agente de execução de contêineres divida os resultados em várias mensagens de resposta, evitando o limite de tamanho por mensagem. Esse recurso é particularmente útil em:

- Ambientes com alta rotatividade de contêineres, como sistemas de CI/CD.
- Cargas de trabalho de processamento em lote em grande escala.

Se o agente de execução de contêineres não oferecer suporte às chamadas RPC com transmissão em fluxo, o kubelet retornará automaticamente às chamadas RPC unárias padrão para manter a compatibilidade com versões anteriores.

## {{% heading "whatsnext" %}}

- Saiba mais sobre a [definição do protocolo CRI](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto).
