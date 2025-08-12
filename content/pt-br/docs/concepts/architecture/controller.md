---
title: Controladores
content_type: concept
weight: 30
---

<!-- overview -->

Em robótica e automação um _control loop_, ou em português _ciclo de controle_, é
um ciclo não terminado que regula o estado de um sistema.

Aqui está um exemplo de um ciclo de controle: um termostato em uma sala.

Quando você define a temperatura, isso indica ao termostato
sobre o seu _estado desejado_. A temperatura ambiente real é o
_estado atual_. O termostato atua para trazer o estado atual
mais perto do estado desejado, ligando ou desligando o equipamento.

{{< glossary_definition term_id="controller" length="short">}}

<!-- body -->

## Padrão Controlador

Um controlador rastreia pelo menos um tipo de recurso Kubernetes.
Estes {{< glossary_tooltip text="objetos" term_id="object" >}}
têm um campo spec que representa o estado desejado. O(s)
controlador(es) para aquele recurso são responsáveis por fazer o estado atual
se aproximar daquele estado desejado.

O controlador pode executar a ação ele próprio; mais comumente, no Kubernetes,
um controlador enviará mensagens para o
{{< glossary_tooltip text="servidor de API" term_id="kube-apiserver" >}} que têm
efeitos colaterais úteis. Você verá exemplos disso abaixo.

{{< comment >}}
Alguns controladores embutidos, como o controlador de namespace, atuam em objetos
que não têm um spec. Para simplicidade, esta página omite explicar esse
detalhe.
{{< /comment >}}

### Controle via servidor de API

O controlador {{< glossary_tooltip term_id="job" >}} é um exemplo de um
controlador embutido do Kubernetes. Controladores embutidos gerenciam estado através da
interação com o servidor de API do cluster.

Job é um recurso do Kubernetes que executa um
{{< glossary_tooltip term_id="pod" >}}, ou talvez vários Pods, para realizar
uma tarefa e depois parar.

(Uma vez [agendado](/docs/concepts/scheduling-eviction/), objetos Pod se tornam parte do
estado desejado para um kubelet).

Quando o controlador Job vê uma nova tarefa, ele garante que, em algum lugar
no seu cluster, os kubelets em um conjunto de Nodes estão executando o número
correto de Pods para realizar o trabalho.
O controlador Job não executa nenhum Pod ou container
ele próprio. Em vez disso, o controlador Job informa o servidor de API para criar ou remover
Pods.
Outros componentes no
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
atuam na nova informação (existem novos Pods para serem agendados e executados),
e eventualmente o trabalho é feito.

Após criar um novo Job, o estado desejado é que esse Job seja completado.
O controlador Job faz com que o estado atual para esse Job esteja mais próximo do seu
estado desejado: criando Pods que fazem o trabalho que você queria para esse Job, para que
o Job esteja mais próximo da conclusão.

Controladores também atualizam os objetos que os configuram.
Por exemplo: uma vez que o trabalho de um Job está completo,
o controlador Job atualiza esse objeto Job para marcá-lo como `Finished`.

(Isso é um pouco como alguns termostatos desligam uma luz para
indicar que a sala está agora na temperatura que você definiu).

### Controle direto

Em contraste com Job, alguns controladores precisam fazer mudanças em
coisas fora do seu cluster.

Por exemplo, se você usar um ciclo de controle para garantir que existem
{{< glossary_tooltip text="Nodes" term_id="node" >}} suficientes
no seu cluster, então esse controlador precisa de algo fora do
cluster atual para configurar novos Nodes quando necessário.

Controladores que interagem com estado externo encontram seu estado desejado a partir do
servidor de API, então comunicam diretamente com um sistema externo para trazer
o estado atual mais próximo da linha.

(Existe na verdade um [controlador](https://github.com/kubernetes/autoscaler/)
que escala horizontalmente os nodes no seu cluster.)

O ponto importante aqui é que o controlador faz algumas mudanças para trazer
seu estado desejado, e então relata o estado atual de volta ao servidor de API do seu cluster.
Outros ciclos de controle podem observar esses dados relatados e tomar suas próprias ações.

No exemplo do termostato, se a sala estiver muito fria, então um controlador diferente
pode também ligar um aquecedor de proteção contra geada. Com clusters Kubernetes, o control plane
indiretamente trabalha com ferramentas de gerenciamento de endereços IP, serviços de armazenamento,
APIs de provedores de nuvem, e outros serviços através de
[estender o Kubernetes](/docs/concepts/extend-kubernetes/) para implementar isso.

## Estado desejado versus atual {#desired-vs-current}

O Kubernetes tem uma visão cloud-native de sistemas, e é capaz de lidar com
mudanças constantes.

Seu cluster pode estar mudando a qualquer momento conforme o trabalho acontece e
ciclos de controle corrigem falhas automaticamente. Isso significa que,
potencialmente, seu cluster nunca atinge um estado estável.

Enquanto os controladores do seu cluster estiverem executando e forem capazes de fazer
mudanças úteis, não importa se o estado geral é estável ou não.

## Design

Como um princípio do seu design, o Kubernetes usa muitos controladores que cada um gerencia
um aspecto particular do estado do cluster. Mais comumente, um ciclo de controle particular
(controlador) usa um tipo de recurso como seu estado desejado, e tem um tipo diferente
de recurso que ele gerencia para fazer esse estado desejado acontecer. Por exemplo,
um controlador para Jobs rastreia objetos Job (para descobrir novo trabalho) e objetos Pod
(para executar os Jobs, e então ver quando o trabalho termina). Neste caso
algo mais cria os Jobs, enquanto o controlador Job cria Pods.

É útil ter controladores simples em vez de um conjunto monolítico de ciclos de controle
que estão interligados. Controladores podem falhar, então o Kubernetes foi projetado para
permitir isso.

{{< note >}}
Pode haver vários controladores que criam ou atualizam o mesmo tipo de objeto.
Nos bastidores, os controladores do Kubernetes garantem que eles apenas prestam atenção
aos recursos ligados ao seu recurso controlador.

Por exemplo, você pode ter Deployments e Jobs; ambos criam Pods.
O controlador Job não exclui os Pods que seu Deployment criou,
porque existe informação ({{< glossary_tooltip term_id="label" text="labels" >}})
que os controladores podem usar para diferenciar esses Pods.
{{< /note >}}

## Formas de executar controladores {#running-controllers}

O Kubernetes vem com um conjunto de controladores embutidos que executam dentro do
{{< glossary_tooltip term_id="kube-controller-manager" >}}. Estes
controladores embutidos fornecem comportamentos centrais importantes.

O controlador Deployment e o controlador Job são exemplos de controladores que
vêm como parte do próprio Kubernetes (controladores "embutidos").
O Kubernetes permite que você execute um control plane resiliente, para que se qualquer
um dos controladores embutidos falhar, outra parte do control plane assumirá o trabalho.

Você pode encontrar controladores que executam fora do control plane, para estender o Kubernetes.
Ou, se quiser, pode escrever um novo controlador você mesmo.
Você pode executar seu próprio controlador como um conjunto de Pods,
ou externamente ao Kubernetes. O que se encaixa melhor dependerá do que esse
controlador particular faz.

## {{% heading "whatsnext" %}}

- Leia sobre o [control plane do Kubernetes](/docs/concepts/architecture/#control-plane-components)
- Descubra alguns dos [objetos Kubernetes](/docs/concepts/overview/working-with-objects/) básicos
- Saiba mais sobre a [API do Kubernetes](/docs/concepts/overview/kubernetes-api/)
- Se quiser escrever seu próprio controlador, veja
  [padrões de extensão do Kubernetes](/docs/concepts/extend-kubernetes/#extension-patterns)
  e o repositório [sample-controller](https://github.com/kubernetes/sample-controller)
