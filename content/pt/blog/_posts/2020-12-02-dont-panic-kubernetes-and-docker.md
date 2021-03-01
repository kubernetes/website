---
layout: blog
title: "Não entre em pânico: Kubernetes e Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
---

**Autores / Autoras**: Jorge Castro, Duffie Cooley, Kat Cosgrove, Justin Garrison, Noah Kantrowitz, Bob Killen, Rey Lejano, Dan “POP” Papandrea, Jeffrey Sica, Davanum “Dims” Srinivas

**Localização:** João Brito (Getup)

Kubernetes está [deixando de usar Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation) como seu agente de execução após a versão v1.20.

**Não entre em pânico. Não é tão dramático quanto parece.**

TL;DR Docker como um agente de execução primário está sendo depreciado em favor de agentes de execução que utilizam a Interface de Agente de Execução de Containers (Container Runtime Interface "CRI") criada para o Kubernetes. As imagens criadas com o Docker continuarão a funcionar em seu cluster com todos os agentes de execução, como sempre estiveram.

Se você é um usuário final de Kubernetes, quase nada mudará para você. Isso não significa a morte do Docker, e isso não significa que você não pode, ou não deva, usar ferramentas Docker em desenvolvimento mais. Docker ainda é uma ferramenta útil para a construção de containers, e as imagens resultantes de executar `docker build` ainda rodarão em seu cluster Kubernetes.

Se você está usando um Kubernetes gerenciado como GKE, EKS, ou AKS (que usa como [padrão containerd](https://github.com/Azure/AKS/releases/tag/2020-11-16)) você precisará ter certeza que seus nós estão usando um agente de execução de container suportado antes que o suporte ao Docker seja removido nas versões futuras do Kubernetes. Se você tem mudanças em seus nós, talvez você precise atualizá-los baseado em seu ambiente e necessidades do agente de execução.

Se você está rodando seus próprios clusters, você também precisa fazer mudanças para evitar quebras em seu cluster. Na versão v1.20, você terá o aviso de alerta da depreciação do Docker. Quando o suporte ao agente de execução do Docker for removido em uma versão futura (atualmente planejado para a versão 1.22 no final de 2021) do Kubernetes ele não será mais suportado e você precisará trocar para um dos outros agentes de execução de container compatível, como o containerd ou CRI-O. Mas tenha certeza que esse agente de execução escolhido tenha suporte às configurações do daemon do docker usadas atualmente (Ex.: logs)

## Então porque a confusão e toda essa turma surtando? 

Estamos falando aqui de dois ambientes diferentes, e isso está criando essa confusão. Dentro do seu cluster Kubernetes, existe uma coisa chamada de agente de execução de container que é responsável por baixar e executar as imagens de seu container. Docker é a escolha popular para esse agente de execução (outras escolhas comuns incluem containerd e CRI-O), mas Docker não foi projetado para ser embutido no kubernetes, e isso causa problemas.

Se liga, o que chamamos de "Docker" não é exatamente uma coisa - é uma stack tecnológica inteira, é uma parte disso é chamado de "containerd", que é o agente de execução de container de alto-nível por si só. Docker é legal e útil porque ele possui muitas melhorias de experiência do usuário e isso o torna realmente fácil para humanos interagirem com ele enquanto estão desenvolvendo, mas essas melhorias para o usuário não são necessárias para o kubernetes, pois ele não é humano.

Como resultado dessa camada de abstração amigável aos humanos, seu cluster Kubernetes precisa usar outra ferramenta chamada Dockershim para ter o que ele realmente precisa, que é o containerd. Isso não é muito bom, porque adiciona outra coisa à ser mantida e que pode quebrar. O que está atualmente acontecendo aqui é que o Dockershim está sendo removido do Kubelet assim que que a versão v1.23 for lançada, que remove o suporte ao Docker como agente de execução de container como resultado. Você deve estar pensando, mas se o containerd está incluso na stack do Docker, porque o Kubernetes precisa do Dockershim?

Docker não é compatível com CRI, a [Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (interface do agente de execução de container). Se fosse, nós não precisaríamos do shim, e isso não seria nenhum problema. Mas isso não é o fim do mundo, e você não precisa entrar em pânico - você só precisa mudar seu agente de execução de container do Docker para um outro suportado.

Uma coisa a ser notada: Se você está contando com o socket do Docker (`/var/run/docker.sock`) como parte do seu fluxo de trabalho em seu cluster hoje, mover para um agente de execução diferente acaba com sua habilidade de usá-lo. Esse modelo é conhecido como Docker em Docker. Existem diversas opções por aí para esse caso específico como o [kaniko](https://github.com/GoogleContainerTools/kaniko), [img](https://github.com/genuinetools/img), e [buildah](https://github.com/containers/buildah). 

## O que essa mudança representa para os desenvolvedores?  Ainda escrevemos Dockerfiles? Ainda vamos fazer build com Docker?

Essa mudança aborda um ambiente diferente do que a maioria das pessoas usa para interagir com Docker. A instalação do Docker que você está usando em desenvolvimento não tem relação com o agente de execução de Docker dentro de seu cluster Kubernetes. É confuso, dá pra entender. 
Como desenvolvedor, Docker ainda é útil para você em todas as formas que era antes dessa mudança ser anunciada. A imagem que o Docker cria não é uma imagem específica para Docker e sim uma imagem que segue o padrão OCI ([Open Container Initiative](https://opencontainers.org/)).

Qualquer imagem compatível com OCI, independente da ferramenta usada para construí-la será vista da mesma forma pelo Kubernetes. Ambos [containerd](https://containerd.io/) e [CRI-O](https://cri-o.io/) sabem como baixar e executá-las. Esse é o porque temos um padrão para containers.

Então, essa mudança está chegando. Isso irá causar problemas para alguns, mas nada catastrófico, no geral é uma boa coisa. Dependendo de como você interage com o Kubernetes, isso tornará as coisas mais fáceis. Se isso ainda é confuso para você, tudo bem, tem muita coisa rolando aqui; Kubernetes tem um monte de partes móveis, e ninguém é 100% especialista nisso. Nós encorajamos toda e qualquer tipo de questão independente do nível de experiência ou de complexidade! Nosso objetivo é ter certeza que todos estão entendendo o máximo possível as mudanças que estão chegando. Esperamos que isso tenha respondido a maioria de suas questões e acalmado algumas ansiedades! ❤️

Procurando mais respostas? Dê uma olhada em nosso apanhado de [questões sobre a depreciação do Dockershim](/blog/2020/12/02/dockershim-faq/).
