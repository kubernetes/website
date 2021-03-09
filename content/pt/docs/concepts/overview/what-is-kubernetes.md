---
reviewers:
title: O que é Kubernetes?
description: >
  Kubernetes é um plataforma de código aberto, portável e extensiva para o gerenciamento de cargas de trabalho e serviços distribuídos em contêineres, que facilita tanto a configuração declarativa quanto a automação. Ele possui um ecossistema grande, e de rápido crescimento.  Serviços, suporte, e ferramentas para Kubernetes estão amplamente disponíveis.
content_type: concept
weight: 10
card:
  name: concepts
  weight: 10
sitemap:
  priority: 0.9
---

<!-- overview -->
Essa página é uma visão geral do Kubernetes.


<!-- body -->
Kubernetes é um plataforma de código aberto, portável e extensiva para o gerenciamento de cargas de trabalho e serviços distribuídos em contêineres, que facilita tanto a configuração declarativa quanto a automação. Ele possui um ecossistema grande, e de rápido crescimento.  Serviços, suporte, e ferramentas para Kubernetes estão amplamente disponíveis.

O Google tornou Kubernetes um projeto de código-aberto em 2014. O Kubernetes combina [mais de 15 anos de experiência do Google](/blog/2015/04/borg-predecessor-to-kubernetes/) executando cargas de trabalho produtivas em escala, com as melhores idéias e práticas da comunidade.

O nome **Kubernetes** tem origem no Grego, significando _timoneiro_ ou _piloto_. **K8s** é a abreviação derivada pela troca das oito letras "ubernete" por "8", se tornado _K"8"s_.

## Voltando no tempo

Vamos dar uma olhada no porque o Kubernetes é tão útil, voltando no tempo.

![Evolução das implantações](/images/docs/Container_Evolution.svg)

**Era da implantação tradicional:** No início, as organizações executavam aplicações em servidores físicos. Não havia como definir limites de recursos para aplicações em um mesmo servidor físico, e isso causava problemas de alocação de recursos. Por exemplo, se várias aplicações fossem executadas em um mesmo servidor físico, poderia haver situações em que uma aplicação ocupasse a maior parte dos recursos e, como resultado, o desempenho das outras aplicações seria inferior. Uma solução para isso seria executar cada aplicação em um servidor físico diferente. Mas isso não escalou porque os recursos foram subutilizados e se tornava custoso para as organizações manter muitos servidores físicos.

**Era da implantação virtualizada:**  Como solução, a virtualização foi introduzida. Esse modelo permite que você execute várias máquinas virtuais (VMs) em uma única CPU de um servidor físico. A virtualização permite que as aplicações sejam isoladas entre as VMs, e ainda fornece um nível de segurança, pois as informações de uma aplicação não podem ser acessadas livremente por outras aplicações.

A virtualização permite melhor utilização de recursos em um servidor físico, e permite melhor escalabilidade porque uma aplicação pode ser adicionada ou atualizada facilmente, reduz os custos de hardware e muito mais. Com a virtualização, você pode apresentar um conjunto de recursos físicos como um cluster de máquinas virtuais descartáveis.

Cada VM é uma máquina completa que executa todos os componentes, incluindo seu próprio sistema operacional, além do hardware virtualizado.

**Era da implantação em contêineres:** Contêineres são semelhantes às VMs, mas têm propriedades de isolamento flexibilizados para compartilhar o sistema operacional (SO) entre as aplicações. Portanto, os contêineres são considerados leves. Semelhante a uma VM, um contêiner tem seu próprio sistema de arquivos, compartilhamento de CPU, memória, espaço de processo e muito mais. Como eles estão separados da infraestrutura subjacente, eles são portáveis entre nuvens e distribuições de sistema operacional.

Contêineres se tornaram populares porque eles fornecem benefícios extra, tais como:

* Criação e implantação ágil de aplicações: aumento da facilidade e eficiência na criação de imagem de contêiner comparado ao uso de imagem de VM.
* Desenvolvimento, integração e implantação contínuos: fornece capacidade de criação e de implantação de imagens de contêiner de forma confiável e frequente, com a funcionalidade de efetuar reversões rápidas e eficientes (devido à imutabilidade da imagem).
* Separação de interesses entre Desenvolvimento e Operações: crie imagens de contêineres de aplicações no momento de construção/liberação em vez de no momento de implantação, desacoplando as aplicações da infraestrutura.
* A capacidade de observação (Observabilidade) não apenas apresenta informações e métricas no nível do sistema operacional, mas também a integridade da aplicação e outros sinais.
* Consistência ambiental entre desenvolvimento, teste e produção: funciona da mesma forma em um laptop e na nuvem.
* Portabilidade de distribuição de nuvem e sistema operacional: executa no Ubuntu, RHEL, CoreOS, localmente, nas principais nuvens públicas e em qualquer outro lugar.
* Gerenciamento centrado em aplicações: eleva o nível de abstração da execução em um sistema operacional em hardware virtualizado à execução de uma aplicação em um sistema operacional usando recursos lógicos.
* Microserviços fracamente acoplados, distribuídos, elásticos e livres: as aplicações são divididas em partes menores e independentes e podem ser implantados e gerenciados dinamicamente - não uma pilha monolítica em execução em uma grande máquina de propósito único.
* Isolamento de recursos: desempenho previsível de aplicações.
* Utilização de recursos: alta eficiência e densidade.

## Por que você precisa do Kubernetes e o que ele pode fazer{#why-you-need-kubernetes-and-what-can-it-do}

Os contêineres são uma boa maneira de agrupar e executar suas aplicações. Em um ambiente de produção, você precisa gerenciar os contêineres que executam as aplicações e garantir que não haja tempo de inatividade. Por exemplo, se um contêiner cair, outro contêiner precisa ser iniciado. Não seria mais fácil se esse comportamento fosse controlado por um sistema?

É assim que o Kubernetes vem ao resgate! O Kubernetes oferece uma estrutura para executar sistemas distribuídos de forma resiliente. Ele cuida do escalonamento e do recuperação à falha de sua aplicação, fornece padrões de implantação e muito mais. Por exemplo, o Kubernetes pode gerenciar facilmente uma implantação no método canário para seu sistema.

O Kubernetes oferece a você:

* **Descoberta de serviço e balanceamento de carga**
O Kubernetes pode expor um contêiner usando o nome DNS ou seu próprio endereço IP. Se o tráfego para um contêiner for alto, o Kubernetes pode balancear a carga e distribuir o tráfego de rede para que a implantação seja estável.
* **Orquestração de armazenamento**
O Kubernetes permite que você monte automaticamente um sistema de armazenamento de sua escolha, como armazenamentos locais, provedores de nuvem pública e muito mais.
* **Lançamentos e reversões automatizadas**
Você pode descrever o estado desejado para seus contêineres implantados usando o Kubernetes, e ele pode alterar o estado real para o estado desejado em um ritmo controlada. Por exemplo, você pode automatizar o Kubernetes para criar novos contêineres para sua implantação, remover os contêineres existentes e adotar todos os seus recursos para o novo contêiner.
* **Empacotamento binário automático**
Você fornece ao Kubernetes um cluster de nós que pode ser usado para executar tarefas nos contêineres. Você informa ao Kubernetes de quanta CPU e memória (RAM) cada contêiner precisa. O Kubernetes pode encaixar contêineres em seus nós para fazer o melhor uso de seus recursos.
* **utocorreção**
O Kubernetes reinicia os contêineres que falham, substitui os contêineres, elimina os contêineres que não respondem à verificação de integridade definida pelo usuário e não os anuncia aos clientes até que estejam prontos para servir.
* **Gerenciamento de configuração e de segredos**
O Kubernetes permite armazenar e gerenciar informações confidenciais, como senhas, tokens OAuth e chaves SSH. Você pode implantar e atualizar segredos e configuração de aplicações sem reconstruir suas imagens de contêiner e sem expor segredos em sua pilha de configuração.

## O que o Kubernetes não é

O Kubernetes não é um sistema PaaS (plataforma como serviço) tradicional e completo. Como o Kubernetes opera no nível do contêiner, e não no nível do hardware, ele fornece alguns recursos geralmente aplicáveis comuns às ofertas de PaaS, como implantação, escalonamento, balanceamento de carga, e permite que os usuários integrem suas soluções de _logging_, monitoramento e alerta. No entanto, o Kubernetes não é monolítico, e essas soluções padrão são opcionais e conectáveis. O Kubernetes fornece os blocos de construção para a construção de plataformas de desenvolvimento, mas preserva a escolha e flexibilidade do usuário onde é importante.

Kubernetes:

* Não limita os tipos de aplicações suportadas. O Kubernetes visa oferecer suporte a uma variedade extremamente diversa de cargas de trabalho, incluindo cargas de trabalho sem estado, com estado e de processamento de dados. Se uma aplicação puder ser executada em um contêiner, ele deve ser executado perfeitamente no Kubernetes.
* Não implanta código-fonte e não constrói sua aplicação. Os fluxos de trabalho de integração contínua, entrega e implantação (CI/CD) são determinados pelas culturas e preferências da organização, bem como pelos requisitos técnicos.
* Não fornece serviços em nível de aplicação, tais como middleware (por exemplo, barramentos de mensagem), estruturas de processamento de dados (por exemplo, Spark), bancos de dados (por exemplo, MySQL), caches, nem sistemas de armazenamento em cluster (por exemplo, Ceph), como serviços integrados. Esses componentes podem ser executados no Kubernetes e/ou podem ser acessados por aplicações executadas no Kubernetes por meio de mecanismos portáteis, como o [Open Service Broker](https://openservicebrokerapi.org/).
* Não dita soluções de _logging_, monitoramento ou alerta. Ele fornece algumas integrações como prova de conceito e mecanismos para coletar e exportar métricas.
* Não fornece nem exige um sistema/idioma de configuração (por exemplo, Jsonnet). Ele fornece uma API declarativa que pode ser direcionada por formas arbitrárias de especificações declarativas.
* Não fornece nem adota sistemas abrangentes de configuração de máquinas, manutenção, gerenciamento ou autocorreção.
* Adicionalmente, o Kubernetes não é um mero sistema de orquestração. Na verdade, ele elimina a necessidade de orquestração. A definição técnica de orquestração é a execução de um fluxo de trabalho definido: primeiro faça A, depois B e depois C. Em contraste, o Kubernetes compreende um conjunto de processos de controle independentes e combináveis que conduzem continuamente o estado atual em direção ao estado desejado fornecido. Não importa como você vai de A para C. O controle centralizado também não é necessário. Isso resulta em um sistema que é mais fácil de usar e mais poderoso, robusto, resiliente e extensível.


## {{% heading "whatsnext" %}}

*   Dê uma olhada em [Componentes do Kubernetes](/docs/concepts/overview/components/).
*   Pronto para [Iniciar](/docs/setup/)?
