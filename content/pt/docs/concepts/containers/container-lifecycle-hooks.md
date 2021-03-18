---
title: Hooks de Ciclo de Vida do Contêiner
content_type: concept
weight: 30
---

<!-- overview -->

Essa página descreve como os contêineres gerenciados pelo _kubelet_ podem usar a estrutura de _hook_ de ciclo de vida do contêiner para executar código acionado por eventos durante seu ciclo de vida de gerenciamento. 


<!-- body -->

## Visão Geral

Análogo a muitas estruturas de linguagem de programação que tem  _hooks_ de ciclo de vida de componentes, como angular,
o Kubernetes fornece aos contêineres _hooks_ de ciclo de vida.
Os _hooks_ permitem que os contêineres estejam cientes dos eventos em seu ciclo de vida de gerenciamento
e executem código implementado em um manipulador quando o _hook_ de ciclo de vida correspondente é executado.

## Hooks do contêiner

Existem dois _hooks_ que são expostos para os contêiners:

`PostStart`

Este _hook_ é executado imediatamente após um contêiner ser criado.
Entretanto, não há garantia que o _hook_ será executado antes do ENTRYPOINT do contêiner.
Nenhum parâmetro é passado para o manipulador.

`PreStop`

Esse _hook_ é chamado imediatamente antes de um contêiner ser encerrado devido a uma solicitação de API ou um gerenciamento de evento como liveness/startup probe failure, preemption, resource contention e outros.
Uma chamada ao _hook_ `PreStop` falha se o contêiner já está em um estado finalizado ou concluído e o _hook_ deve ser concluído antes que o sinal TERM seja enviado para parar o contêiner. A contagem regressiva do período de tolerância de término do Pod começa antes que o _hook_ `PreStop` seja executado, portanto, independentemente do resultado do manipulador, o contêiner será encerrado dentro do período de tolerância de encerramento do Pod. Nenhum parâmetro é passado para o manispulador.

Uma descrição mais detalhada do comportamento de término pode ser encontrada em [Término de Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### Implementações de manipulador de hook

Os contêineres podem acessar um _hook_ implementando e registrando um manipulador para esse _hook_.
Existem dois tipos de manipuladores de _hooks_ que podem ser implementados para contêineres:

* Exec - Executa um comando específico, como `pre-stop.sh`, dentro do cgroups e Namespaces do contêiner.
* HTTP - Executa uma requisição HTTP em um endpoint específico do contêiner.

### Execução do manipulador de hook


Quando um _hook_ de gerenciamento de ciclo de vida do contêiner é chamado, o sistema de gerenciamento do Kubernetes executa o manipulador de acordo com a ação do _hook_, `httpGet` e `tcpSocker` são executados pelo processo kubelet e `exec` é executado pelo contêiner.

As chamadas do manipulador do _hook_ são síncronas no contexto do Pod que contém o contêiner.
Isso significa que para um _hook_ `PostStart`, o ENTRYPOINT do contêiner e o _hook_ disparam de forma assíncrona.
No entanto, se o _hook_ demorar muito para ser executado ou travar, o contêiner não consegue atingir o estado `running`.


Os _hooks_ `PreStop` não são executados de forma assíncrona a partir do sinal para parar o conêiner, o _hook_ precisa finalizar a sua execução antes que o sinal TERM possa ser enviado.
Se um _hook_ `PreStop` travar durante a execução, a fase do Pod será `Terminating` e permanecerá até que o Pod seja morto após seu `terminationGracePeriodSeconds` expirar. Esse período de tolerância se aplica ao tempo total necessário
para o _hook_ `PreStop`executar e para o contêiner parar normalmente.
Se por exemplo, o `terminationGracePeriodSeconds` é 60, e o _hook_ leva 55 segundos para ser concluído, e o contêiner leva 10 segundos para parar normalmente após receber o sinal, então o contêiner será morto antes que possa parar
normalmente, uma vez que o `terminationGracePeriodSeconds` é menor que o tempo total (55 + 10) que é necessário para que essas duas coisas aconteçam.

Se um _hook_ `PostStart` ou `PreStop` falhar, ele mata o contêiner. 

Os usuários devem tornar seus _hooks_ o mais leve possíveis.
Há casos, no entanto, em que comandos de longa duração fazem sentido, como ao salvar o estado
antes de parar um contêiner.

### Garantias de entrega de _hooks_

A entrega do _hook_ é destinada a acontecer *pelo menos uma vez*,
o que quer dizer que um _hook_ pode ser chamado várias vezes para qualquer evento, 
como para `PostStart` ou `PreStop`.
Depende da implementação do _hook_ lidar com isso corretamente.

Geralmente, apenas entregas únicas são feitas.
Se, por exemplo, um receptor de _hook_ HTTP estiver inativo e não puder receber tráfego,
não há tentativa de reenviar.
Em alguns casos raros, no entanto, pode ocorrer uma entrega dupla.
Por exemplo, se um kubelet reiniciar no meio do envio de um _hook_, o _hook_ pode ser 
reenviado depois que o kubelet voltar a funcionar.

### Depurando manipuladores de _hooks_

Os logs para um manipulador de _hook_ não expostos em eventos de Pod.
Se um manipulador falhar por algum motivo, ele transmitirá um evento.
Para `PostStart` é o evento `FailedPostStartHook` e para `PreStop` é o evento
`failedPreStopHook`.
Você pode ver esses eventos executando `kubectl describe pod <nome_do_pod>`.
Aqui está um exemplo de saída de eventos da execução deste comando:

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubObjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```



## {{% heading "whatsnext" %}}


* Saiba mais sobre o [Ambiente de contêiner](/docs/concepts/containers/container-environment/).
* Obtenha experiência prática
  [anexando manipuladores a eventos de ciclo de vida do contêiner](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

