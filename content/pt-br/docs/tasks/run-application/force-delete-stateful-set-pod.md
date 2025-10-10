---
title: Forçar a Exclusão de Pods de um StatefulSet
content_type: task
weight: 70
---

<!-- overview -->
Esta página mostra como excluir Pods que fazem parte de um
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}} e
explica as considerações que devem ser levadas em conta ao fazer isso.

## {{% heading "prerequisites" %}}

- Esta é uma tarefa relativamente avançada e pode violar algumas das propriedades 
  inerentes ao StatefulSet.
- Antes de prosseguir, familiarize-se com as considerações listadas abaixo.

<!-- steps -->

## Considerações sobre StatefulSet

Na operação normal de um StatefulSet, **nunca** há necessidade de forçar a exclusão de um Pod.
O [controlador de StatefulSet](/docs/concepts/workloads/controllers/statefulset/) é responsável por criar,
escalar e excluir os membros do StatefulSet. Ele tenta garantir que o número especificado de Pods,
do ordinal 0 até N-1, estejam ativos e prontos. O StatefulSet garante que, a qualquer momento,
exista no máximo um Pod com uma determinada identidade em execução no cluster. Isso é chamado de semântica
*no máximo um* fornecida por um StatefulSet.

A exclusão forçada manual deve ser realizada com cautela, pois tem o potencial de violar a semântica de *no máximo um*
inerente ao StatefulSet. StatefulSets podem ser usados para executar aplicações distribuídas e em cluster que
necessitam de uma identidade de rede estável e armazenamento estável. Essas aplicações frequentemente possuem
configurações que dependem de um conjunto fixo de membros com identidades fixas. Ter múltiplos membros com a mesma
identidade pode ser desastroso e pode levar à perda de dados (por exemplo, cenário de _split brain_ em sistemas baseados em quórum).

## Excluir Pods

Você pode realizar uma exclusão graciosa de um Pod com o seguinte comando:

```shell
kubectl delete pods <pod>
```

Para que o procedimento acima resulte em uma finalização graciosa, o Pod **não deve** especificar um
`pod.Spec.TerminationGracePeriodSeconds` igual a 0. A prática de definir `pod.Spec.TerminationGracePeriodSeconds`
como 0 segundos é insegura e fortemente desaconselhada para Pods de StatefulSet.
A exclusão graciosa é segura e garantirá que o Pod
[seja finalizado de forma adequada](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) antes que o
kubelet remova o nome do Pod do servidor de API.

Um Pod não é excluído automaticamente quando um Nó (Node) se torna inacessível. Os Pods em execução em um Nó
inacessível entram no estado 'Terminating' ou 'Unknown' após um [timeout](/docs/concepts/architecture/nodes/#condition).
Os Pods também podem entrar nesses estados quando o usuário tenta realizar a exclusão graciosa de um Pod em um Nó inacessível.
As únicas formas de remover um Pod nesse estado do servidor de API são as seguintes:

- O objeto Nó é excluído (por você ou pelo [Node Controller](/docs/concepts/architecture/nodes/#node-controller)).
- O kubelet no Nó sem resposta volta a responder, encerra o Pod e remove a entrada do servidor de API.
- Exclusão forçada do Pod pelo usuário.

A prática recomendada é utilizar a primeira ou a segunda abordagem. Se um Nó for confirmado como morto
(por exemplo, desconectado permanentemente da rede, desligado, etc.), exclua o objeto Nó.
Se o Nó estiver sofrendo uma partição de rede, tente resolver o problema ou aguarde até que ele seja resolvido.
Quando a partição for sanada, o kubelet concluirá a exclusão do Pod e liberará seu nome no servidor de API.

Normalmente, o sistema conclui a exclusão assim que o Pod não está mais em execução
em um Nó ou quando o Nó é excluído por um administrador.
Você pode substituir esse comportamento forçando a exclusão do Pod.

### Exclusão Forçada

Exclusões forçadas **não** aguardam a confirmação do kubelet de que o Pod foi encerrado.
Independentemente de uma exclusão forçada ser bem-sucedida em encerrar um Pod, o nome será
imediatamente liberado no servidor de API. Isso permitirá que o controlador do StatefulSet crie
um Pod de substituição com a mesma identidade; isso pode levar à duplicação de um Pod ainda em execução e,
se esse Pod ainda puder se comunicar com os outros membros do StatefulSet, irá violar a semântica de
*no máximo um* que o StatefulSet foi projetado para garantir.

Ao forçar a exclusão de um Pod de um StatefulSet, você está afirmando que o Pod em questão nunca mais
fará contato com outros Pods do StatefulSet e que seu nome pode ser liberado com segurança para
que uma substituição seja criada.

Se você deseja excluir um Pod forçadamente usando o kubectl versão >= 1.5, faça o seguinte:

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

Se você estiver usando qualquer versão do kubectl <= 1.4, deve omitir a opção `--force` e usar:

```shell
kubectl delete pods <pod> --grace-period=0
```

Se mesmo após esses comandos o Pod permanecer no estado `Unknown`, utilize o seguinte comando
para remover o Pod do cluster:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

Sempre realize a exclusão forçada de Pods de StatefulSet com cautela e total conhecimento dos riscos envolvidos.

## {{% heading "whatsnext" %}}

Saiba mais sobre [depuração de um StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
