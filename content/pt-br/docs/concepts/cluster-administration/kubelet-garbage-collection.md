---
title: Configurando o Garbage Collection do kubelet
content_type: concept
weight: 70
---

<!-- overview -->

O Garbage collection(Coleta de lixo) é uma função útil do kubelet que limpa imagens e contêineres não utilizados. O kubelet executará o garbage collection para contêineres a cada minuto e para imagens a cada cinco minutos.

Ferramentas externas de garbage collection não são recomendadas, pois podem potencialmente interromper o comportamento do kubelet removendo os contêineres que existem.



<!-- body -->

## Coleta de imagens

O Kubernetes gerencia o ciclo de vida de todas as imagens através do imageManager, com a cooperação do cadvisor.

A política para o garbage collection de imagens leva dois fatores em consideração:
`HighThresholdPercent` e `LowThresholdPercent`. Uso do disco acima do limite acionará o garbage collection. O garbage collection excluirá as imagens que foram menos usadas recentemente até que o nível fique abaixo do limite.

## Coleta de container

A política para o garbage collection de contêineres considera três variáveis definidas pelo usuário. `MinAge` é a idade mínima em que um contêiner pode ser coletado. `MaxPerPodContainer` é o número máximo de contêineres mortos que todo par de pod (UID, container name) pode ter. `MaxContainers` é o número máximo de contêineres mortos totais. Essas variáveis podem ser desabilitadas individualmente, definindo `MinAge` como zero e definindo `MaxPerPodContainer` e `MaxContainers` respectivamente para menor que zero.

O Kubelet atuará em contêineres não identificados, excluídos ou fora dos limites definidos pelos sinalizadores mencionados. Os contêineres mais antigos geralmente serão removidos primeiro. `MaxPerPodContainer` e `MaxContainer` podem potencialmente conflitar entre si em situações em que a retenção do número máximo de contêineres por pod (`MaxPerPodContainer`) estaria fora do intervalo permitido de contêineres globais mortos (`MaxContainers`). O `MaxPerPodContainer` seria ajustado nesta situação: O pior cenário seria fazer o downgrade do `MaxPerPodContainer` para 1 e remover os contêineres mais antigos. Além disso, os contêineres pertencentes a pods que foram excluídos são removidos assim que se tornem mais antigos que `MinAge`.

Os contêineres que não são gerenciados pelo kubelet não estão sujeitos ao garbage collection de contêiner.

## Configurações do usuário

Os usuários podem ajustar os seguintes limites para ajustar o garbage collection da imagem com os seguintes sinalizadores do kubelet:

1. `image-gh-high-threshold`, a porcentagem de uso de disco que aciona o garbage collection da imagem. O padrão é 85%.
2. `image-gc-low-threshold`, a porcentagem de uso de disco com o qual o garbage collection da imagem tenta liberar. O padrão é 80%.

Também permitimos que os usuários personalizem a política do garbagem collection através dos seguintes sinalizadores do kubelet:

1. `minimum-container-ttl-duration`, idade mínima para um contêiner finalizado antes de ser colectado. O padrão é 0 minuto, o que significa que todo contêiner finalizado será coletado como lixo.
2. `maximum-dead-containers-per-container`, número máximo de instâncias antigas a serem retidas por contêiner. O padrão é 1.
3. `maximum-dead-containers`, número máximo de instâncias antigas de contêineres para retenção global. O padrão é -1, o que significa que não há limite global.

Os contêineres podem ser potencialmente coletados como lixo antes que sua utilidade expire. Esses contêineres podem conter logs e outros dados que podem ser úteis para solucionar problemas. Um valor suficientemente grande para `maximum-dead-containers-per-container` é altamente recomendado para permitir que pelo menos 1 contêiner morto seja retido por contêiner esperado. Um valor maior para `maximum-dead-containers` também é recomendados por um motivo semelhante.
Consulte [esta issue](https://github.com/kubernetes/kubernetes/issues/13287) para obter mais detalhes.

## Descontinuado

Alguns recursos do Garbage Collection neste documento serão substituídos pelo kubelet eviction no futuro.

Incluindo:

| Flag Existente                            | Nova Flag                               | Fundamentação                                                                        |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| `--image-gc-high-threshold`               | `--eviction-hard` ou `--eviction-soft`  | os sinais existentes de despejo podem acionar o garbage collection da imagem         |
| `--image-gc-low-threshold`                | `--eviction-minimum-reclaim`            | recuperações de despejo atinge o mesmo comportamento                                 |
| `--maximum-dead-containers`               |                                         | descontinuado quando os logs antigos forem armazenados fora do contexto do contêiner |
| `--maximum-dead-containers-per-container` |                                         | descontinuado quando os logs antigos forem armazenados fora do contexto do contêiner |
| `--minimum-container-ttl-duration`        |                                         | descontinuado quando os logs antigos forem armazenados fora do contexto do contêiner |
| `--low-diskspace-threshold-mb`            | `--eviction-hard` ou `eviction-soft`    | O despejo generaliza os limites do disco para outros recursos                        |
| `--outofdisk-transition-frequency`        | `--eviction-pressure-transition-period` | O despejo generaliza a transição da pressão do disco para outros recursos            |



## {{% heading "whatsnext" %}}


Consulte [Configurando a Manipulação de Recursos Insuficientes](/docs/tasks/administer-cluster/out-of-resource/) para mais detalhes.


