---
title: Recursos Declarados pelo Nó
content_type: concept
weight: 160
---

<!-- overview -->

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Os nós do Kubernetes usam _recursos declarados_ (declared features) para relatar a disponibilidade de
recursos (features) específicos que são novos ou controlados por feature gate. Os componentes do control plane
usam essa informação para tomar melhores decisões. O kube-scheduler, por meio do
plugin `NodeDeclaredFeatures`, garante que os Pods sejam posicionados apenas em nós que
suportam explicitamente os recursos exigidos pelo Pod. Adicionalmente, o
controlador de admissão `NodeDeclaredFeatureValidator` valida as atualizações de Pods
contra os recursos declarados por um nó.

Esse mecanismo ajuda a gerenciar a divergência de versões (version skew) e a melhorar a estabilidade do cluster,
especialmente durante atualizações do cluster ou em ambientes com versões mistas, onde os nós
podem não ter todos os mesmos recursos habilitados. Isso é destinado a desenvolvedores de features do Kubernetes
que introduzem novos recursos no nível do nó e funciona em segundo plano; desenvolvedores de aplicações que implantam
Pods não precisam interagir diretamente com este framework.

<!-- body -->

## Como funciona

Um recurso declarado é uma string que um nó lista no
campo `.status.declaredFeatures` do objeto Node. Cada recurso declarável
identifica um recurso no nível do nó que ainda está progredindo pelos
estágios de feature do Kubernetes.

1.  **Relato de features pelo Kubelet:** Na inicialização, o kubelet de cada nó detecta
    quais features gerenciadas do Kubernetes estão habilitadas no momento e as relata
    no campo `.status.declaredFeatures` do Node. Apenas os recursos
    em desenvolvimento ativo são incluídos neste campo.
2.  **Filtragem pelo Agendador:** O kube-scheduler padrão usa o
    plugin `NodeDeclaredFeatures`. Este plugin:
    * No estágio `PreFilter`, verifica o `PodSpec` para inferir o conjunto de
      recursos de nó exigidos pelo Pod.
    * No estágio `Filter`, verifica se os recursos listados no campo
      `.status.declaredFeatures` do nó satisfazem os requisitos inferidos para o Pod.
      Os Pods não são agendados em nós que não possuam os recursos exigidos.

    Agendadores personalizados também podem usar o
    campo `.status.declaredFeatures` para aplicar restrições semelhantes.
3.  **Controle de Admissão:** O controlador de admissão
    [`NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator)
    pode rejeitar Pods que exijam recursos não declarados pelo
    nó ao qual estão vinculados, evitando problemas durante as atualizações de Pods.
4.  **Admissão pelo Kubelet:** Como salvaguarda final, o kubelet verifica novamente os
    requisitos de features de um Pod contra os recursos disponíveis em seu nó antes
    de executar o Pod, e rejeita o Pod se um recurso exigido estiver ausente.
5.  **Limpeza pós-GA:** Uma vez que um recurso esteja disponível em todos os nós de um
    cluster (depois que a feature se gradua para GA e a divergência de versões suportada
    entre o control plane e os nós tenha passado), os nós param de declarar o
    recurso. Isso é alcançado definindo uma versão máxima (`MaxVersion`) para
    cada recurso declarado: kubelets mais novos que essa versão param de listar
    o recurso no campo `.status.declaredFeatures`, e o agendador e o
    controlador de admissão tratam o recurso como universalmente disponível e param
    de verificá-lo. O recurso é eventualmente removido do conjunto de recursos
    declarados como parte da limpeza padrão de features pós-GA.

## Exemplo de um recurso declarado

O recurso declarado `RestartAllContainersOnContainerExits` indica que um
nó suporta
[reinícios in place de todos os contêineres em um Pod](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers).
Quando o
feature gate [`RestartAllContainersOnContainerExits`](/docs/reference/command-line-tools-reference/feature-gates/#RestartAllContainersOnContainerExits)
está habilitado para o kubelet, o kubelet declara esse recurso no
status de seu Node:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: example-node
status:
  declaredFeatures:
  - RestartAllContainersOnContainerExits
```

Um Pod exige esse recurso se um de seus contêineres especificar uma regra de reinício
com a ação `RestartAllContainers`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: main
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Never     # A política de reinício do contêiner deve ser especificada se regras forem especificadas
    restartPolicyRules:      # Reinicia todo o Pod in place no código de saída 42
    - action: RestartAllContainers
      exitCodes:
        operator: In
        values: [42]
```

Ao agendar este Pod, o kube-scheduler considera apenas os nós que listam
`RestartAllContainersOnContainerExits` em seus `.status.declaredFeatures`.
Em um cluster onde apenas alguns nós têm esse feature gate habilitado (por
exemplo, no meio de uma atualização do cluster), isso impede que o Pod seja
atribuído a um nó cujo kubelet ignoraria a regra de reinício.

Os recursos declarados também controlam (gate) as atualizações de Pods em execução. Por exemplo, o
recurso declarado `InPlacePodVerticalScalingInitContainers` indica que um
nó suporta o redimensionamento dos recursos de init containers in place.
Se houver uma tentativa de redimensionar um init container em um Pod em execução, o
controlador de admissão `NodeDeclaredFeatureValidator` rejeita a atualização, a menos que
o nó que executa esse Pod declare esse recurso.

## {{% heading "whatsnext" %}}

* Leia sobre o [controlador de admissão `NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator).
* Leia o KEP para obter mais detalhes:
    [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
