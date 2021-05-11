---
title: Controladores
content_type: concept
weight: 30
---

<!-- overview -->

Em robótica e automação um _control loop_, ou em português _ciclo de controle_, é
um ciclo não terminado que regula o estado de um sistema.

Um exemplo de ciclo de controle é um termostato de uma sala.

Quando você define a temperatura, isso indica ao termostato
sobre o seu *estado desejado*. A temperatura ambiente real é o
*estado atual*. O termostato atua de forma a trazer o estado atual
mais perto do estado desejado, ligando ou desligando o equipamento.

{{< glossary_definition term_id="controller" length="short">}}




<!-- body -->

## Padrão Controlador (Controller pattern)

Um controlador rastreia pelo menos um tipo de recurso Kubernetes.
Estes [objetos](/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)
têm um campo *spec* que representa o *estado desejado*.
O(s) controlador(es) para aquele recurso são responsáveis por trazer o *estado atual*
mais perto do *estado desejado*.

O controlador pode executar uma ação ele próprio, ou,
o que é mais comum, no Kubernetes, o controlador envia uma mensagem para o
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} (servidor de API) que tem
efeitos colaterais úteis. Você vai ver exemplos disto abaixo.

### Controlador via API server

O controlador {{< glossary_tooltip term_id="job" >}} é um exemplo de um
controlador Kubernetes embutido. Controladores embutidos gerem estados através da
interação com o *cluster API server*.

*Job* é um recurso do Kubernetes que é executado em um
*{{< glossary_tooltip term_id="pod" >}}*, ou talvez vários *Pods*, com o objetivo de
executar uma tarefa e depois parar.

(Uma vez [agendado](/docs/concepts/scheduling/), objetos *Pod* passam a fazer parte
do *estado desejado* para um kubelet.

Quando o controlador *Job* observa uma nova tarefa ele garante que,
algures no seu *cluster*, os kubelets num conjunto de nós (*Nodes*) estão correndo o número
correto de *Pods* para completar o trabalho.
O controlador *Job* não corre *Pods* ou *containers* ele próprio.
Em vez disso, o controlador *Job* informa o *API server* para criar ou remover *Pods*.
Outros componentes do plano de controle
({{< glossary_tooltip text="control plane" term_id="control-plane" >}})
atuam na nova informação (existem novos *Pods* para serem agendados e executados),
e eventualmente o trabalho é feito.

Após ter criado um novo *Job*, o *estado desejado* é que esse Job seja completado.
O controlador *Job* faz com que o *estado atual* para esse *Job* esteja mais perto do seu
*estado desejado*: criando *Pods* que fazem o trabalho desejado para esse *Job* para que
o *Job* fique mais perto de ser completado.

Controladores também atualizam os objetos que os configuram.
Por exemplo: assim que o trabalho de um *Job* está completo,
o controlador *Job* atualiza esse objeto *Job* para o marcar como `Finished` (terminado).

(Isto é um pouco como alguns termostatos desligam uma luz para
indicar que a temperatura da sala está agora na temperatura que foi introduzida).

### Controle direto

Em contraste com *Job*, alguns controladores necessitam de efetuar
mudanças fora do *cluster*.

Por exemplo, se usar um ciclo de controle para garantir que existem
*{{< glossary_tooltip text="Nodes" term_id="node" >}}* suficientes
no seu *cluster*, então esse controlador necessita de algo exterior ao
*cluster* atual para configurar novos *Nodes* quando necessário.

Controladores que interagem com estados externos encontram o seu estado desejado
a partir do *API server*, e então comunicam diretamente com o sistema externo para
trazer o *estado atual* mais próximo do desejado.

(Existe um controlador que escala horizontalmente nós no seu *cluster*.
Veja [Escalamento automático do cluster](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling))

## Estado desejado versus atual {#desired-vs-current}

Kubernetes tem uma visão *cloud-native* de sistemas e é capaz de manipular
mudanças constantes.

O seu *cluster* pode mudar em qualquer momento à medida que as ações acontecem e
os ciclos de controle corrigem falhas automaticamente. Isto significa que,
potencialmente, o seu *cluster* nunca atinge um estado estável.

Enquanto os controladores no seu *cluster* estiverem rodando e forem capazes de
fazer alterações úteis, não importa se o estado é estável ou se é instável.

## Design

Como um princípio do seu desenho, o Kubernetes usa muitos controladores onde cada
um gerencia um aspecto particular do estado do *cluster*. Comumente, um particular
ciclo de controle (controlador) usa uma espécie de recurso como o seu *estado desejado*,
e tem uma espécie diferente de recurso que o mesmo gere para garantir que esse *estado desejado*
é cumprido.

É útil que haja controladores simples em vez de um conjunto monolítico de ciclos de controle
que estão interligados. Controladores podem falhar, então o Kubernetes foi desenhado para
permitir isso.

Por exemplo: um controlador de *Jobs* rastreia objetos *Job* (para
descobrir novos trabalhos) e objetos *Pod* (para correr o *Jobs*, e então
ver quando o trabalho termina). Neste caso outra coisa cria os *Jobs*,
enquanto o controlador *Job* cria *Pods*.

{{< note >}}
Podem existir vários controladores que criam ou atualizam a mesma espécie (kind) de objeto.
Atrás das cortinas, os controladores do Kubernetes garantem que eles apenas tomam
atenção aos recursos ligados aos seus recursos controladores.

Por exemplo, você pode ter *Deployments* e *Jobs*; ambos criam *Pods*.
O controlador de *Job* não apaga os *Pods* que o seu *Deployment* criou,
porque existe informação ({{< glossary_tooltip term_id="label" text="labels" >}})
que os controladores podem usar para diferenciar esses *Pods*.
{{< /note >}}

## Formas de rodar controladores {#running-controllers}

O Kubernetes vem com um conjunto de controladores embutidos que correm
dentro do {{< glossary_tooltip term_id="kube-controller-manager" >}}.
Estes controladores embutidos providenciam comportamentos centrais importantes.

O controlador *Deployment* e o controlador *Job* são exemplos de controladores
que veem como parte do próprio Kubernetes (controladores "embutidos").
O Kubernetes deixa você correr o plano de controle resiliente, para que se qualquer
um dos controladores embutidos falhar, outra parte do plano de controle assume
o trabalho.

Pode encontrar controladores fora do plano de controle, para extender o Kubernetes.
Ou, se quiser, pode escrever um novo controlador você mesmo.
Pode correr o seu próprio controlador como um conjunto de *Pods*,
ou externo ao Kubernetes. O que encaixa melhor vai depender no que esse
controlador faz em particular.



## {{% heading "whatsnext" %}}

* Leia mais sobre o [plano de controle do Kubernetes](/docs/concepts/#kubernetes-control-plane)
* Descubra alguns dos [objetos Kubernetes](/docs/concepts/#kubernetes-objects) básicos.
* Aprenda mais sobre [API do Kubernetes](/docs/concepts/overview/kubernetes-api/)
* Se pretender escrever o seu próprio controlador, veja [Padrões de Extensão](/docs/concepts/extend-kubernetes/extend-cluster/#extension-patterns)

