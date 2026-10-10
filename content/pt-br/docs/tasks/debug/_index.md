---
title: "Monitoramento, Registro de Logs e Depuração"
description: Configure o monitoramento e os logs para solucionar problemas em um cluster ou depurar uma aplicação conteinerizada.
weight: 40
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Obtendo ajuda
---

<!-- overview -->

Às vezes, as coisas dão errado. Este guia tem como objetivo ajudá-lo a corrigir esses problemas. Ele está dividido em duas seções:

* [Depurando sua aplicação](/docs/tasks/debug/debug-application/) - Útil para usuários que estão implantando código no Kubernetes e se perguntando por que não está funcionando.
* [Depurando seu cluster](/docs/tasks/debug/debug-cluster/) - Útil para administradores de clusters e para aqueles cujo cluster Kubernetes está apresentando problemas.

Você também deve verificar os problemas conhecidos da [versão](https://github.com/kubernetes/kubernetes/releases) que está utilizando.

<!-- body -->

## Obtendo ajuda

Se o seu problema não for resolvido por nenhum dos guias acima, há várias maneiras de obter ajuda da comunidade Kubernetes.

### Perguntas

A documentação neste site foi estruturada para fornecer respostas a uma ampla gama de perguntas. [Conceitos](/docs/concepts/) explicam a arquitetura do Kubernetes e como cada componente funciona, enquanto [Configuração](/docs/setup/) oferece instruções práticas para começar. [Tarefas](/docs/tasks/) mostram como realizar tarefas comumente utilizadas, e os [Tutoriais](/docs/tutorials/) são guias mais abrangentes de cenários reais, específicos da indústria ou de desenvolvimento completo de ponta a ponta.
A seção de [Referência](/docs/reference/) fornece documentação detalhada sobre a [API do Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}) e as interfaces de linha de comando (CLIs), como [`kubectl`](/docs/reference/kubectl/).

## Socorro! Minha pergunta não foi respondida! Preciso de ajuda agora!

### Stack Exchange, Stack Overflow ou Server Fault {#stack-exchange}

Se você tem dúvidas relacionadas ao *desenvolvimento de software* para sua aplicação conteinerizada, você pode perguntar no [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

Se você tem perguntas sobre Kubernetes relacionadas à *gestão do cluster* ou *configuração*, você pode perguntar no [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

Também existem vários sites mais específicos na rede Stack Exchange que podem ser o lugar certo para perguntar sobre Kubernetes em áreas como [DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), [Engenharia de Software](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes) ou [Segurança da Informação](https://security.stackexchange.com/questions/tagged/kubernetes).

Alguém da comunidade pode já ter feito uma pergunta semelhante ou pode ser capaz de ajudar com o seu problema.

A equipe do Kubernetes também monitora os [posts marcados como Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
Se não houver perguntas existentes que ajudem, **certifique-se de que sua pergunta está [no escopo do Stack Overflow](https://stackoverflow.com/help/on-topic), [Server Fault](https://serverfault.com/help/on-topic), ou do site da rede Stack Exchange que você escolheu,** e leia as orientações sobre [como fazer uma nova pergunta](https://stackoverflow.com/help/how-to-ask), antes de postar uma nova!

### Slack

Muitas pessoas da comunidade Kubernetes estão no Slack do Kubernetes no canal `#kubernetes-users`.
O Slack requer registro; você pode [solicitar um convite](https://slack.kubernetes.io), e o registro está aberto para todos.
Sinta-se à vontade para entrar e fazer qualquer tipo de pergunta.

Após se registrar, acesse a [organização Kubernetes no Slack](https://kubernetes.slack.com) via seu navegador ou pelo aplicativo dedicado do Slack.

Depois de registrado, explore a lista crescente de canais para vários assuntos de interesse.
Por exemplo, novos usuários do Kubernetes podem querer entrar no canal [`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice).
Desenvolvedores devem entrar no canal [`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors).

Também existem muitos canais específicos por país/idioma. Sinta-se à vontade para entrar nesses canais para suporte localizado e informações:

{{< table caption="Canais do Slack específicos por país/idioma" >}}
País | Canais
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finlândia | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
França | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Alemanha | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
Índia | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Itália | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japão | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Coreia | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Países Baixos | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Noruega | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Polônia | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Rússia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Espanha | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Suécia | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turquia | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Fórum

Você é bem-vindo para participar do fórum oficial do Kubernetes: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Relatórios de bugs e solicitações de recursos

Se você encontrou o que parece ser um bug ou deseja solicitar uma nova funcionalidade, use o [sistema de rastreamento de problemas no GitHub](https://github.com/kubernetes/kubernetes/issues).

Antes de registrar um problema, pesquise os problemas existentes para verificar se sua questão já foi abordada.

Se for relatar um bug, inclua informações detalhadas sobre como reproduzir o problema, como:

* Versão do Kubernetes: `kubectl version`
* Provedor de nuvem, distribuição do SO, configuração de rede e versão do agente de execução de contêiner
* Passos para reproduzir o problema


