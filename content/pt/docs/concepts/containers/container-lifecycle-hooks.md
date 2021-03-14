---
title: Ciclos de Vida do Contêiner
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

This hook is executed immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.

Este _hook_ é executado imediatamente após um contêiner ser criado.
Entretanto, não há garantia que o _hook_ será executado antes do ENTRYPOINT do contêiner.
Nenhum parâmetro é passado para o manipulador.

`PreStop`

The Pod's termination
grace period countdown begins before the `PreStop` hook is executed, so regardless of the outcome of
the handler, the container will eventually terminate within the Pod's termination grace period. No
parameters are passed to the handler.

A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

Esse _hook_ é chamado imediatamente antes de um contêiner ser encerrado devido a uma solicitação de API ou um gerenciamento de evento como liveness/startup probe failure, preemption, resource contention e outros.
Uma chamada ao _hook_ `PreStop` falha se o contêiner já está em um estado finalizado ou concluído e o _hook_ deve ser concluído antes que o sinal TERM seja enviado para parar o contêiner. 


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

This grace period applies to the total time it takes for
both the `PreStop` hook to execute and for the Container to stop normally. If, for example,
`terminationGracePeriodSeconds` is 60, and the hook takes 55 seconds to complete, and the Container
takes 10 seconds to stop normally after receiving the signal, then the Container will be killed
before it can stop normally, since `terminationGracePeriodSeconds` is less than the total time
(55+10) it takes for these two things to happen.

Os _hooks_ `PreStop` não são executados de forma assíncrona a partir do sinal para parar o conêiner, o _hook_ precisa finalizar a sua execução antes que o sinal TERM possa ser enviado.
Se um _hook_ `PreStop` travar durante a execução, a fase do Pod será `Terminating` e permanecerá até que o Pod seja morto após seu `terminationGracePeriodSeconds` expirar.


If either a `PostStart` or `PreStop` hook fails,
it kills the Container.

Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.

### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.

Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.

### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
You can see these events by running `kubectl describe pod <pod_name>`.
Here is some example output of events from running this command:

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


* Learn more about the [Container environment](/docs/concepts/containers/container-environment/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

