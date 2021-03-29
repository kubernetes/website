---
title: Classes de execução 
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Essa página descreve o recurso _RuntimeClass_ e a seleção do mecanismo do agente de execução.

RuntimeClass é uma funcionalidade para selecionar as configurações do agente de execução do contêiner. 
A configuração do agente de execução de contêineres é usada para executar os contêineres de um Pod.


<!-- body -->

## Motivação

Você pode configurar um _RuntimeClass_ diferente entre os diferentes Pods para prover
um equilíbrio entre performance versus segurança. Por exemplo, se parte de sua carga de
trabalho necessita de um alto nível de garantia de segurança da informação, você pode 
optar em executar esses Pods em um agente de execução que usa virtualização de hardware. 
Você então terá o benefício do isolamento extra de um agente de execução alternativo, ao 
custo de uma latência adicional.

Você pode ainda usar um _RuntimeClass_ para executar diferentes Pods com o mesmo agente
de execução de contêineres mas com diferentes configurações.

## Configuração 

1. Configure a implementação do CRI nos nós (depende do agente de execução)
2. Crie o recurso RuntimeClass correspondente.

### 1. Configure a implementação do CRI nos nós.

As configurações disponíveis através do RuntimeClass sáo dependentes da implementação do 
_Container Runtime Interface_ ({{< glossary_tooltip term_id="cri" >}}). Veja a documentação correspondente [abaixo](#configuração-do-cri) para a
sua implementação CRI para verificar como configurar.

{{< note >}}
RuntimeClass assume uma configuração homogênea de nós entre todo o cluster por padrão 
(o que significa que todos os nós estão configurados do mesmo jeito referente aos agentes de 
execução). Para suportar configurações heterogêneas, veja [Associação](#associação) abaixo.
{{< /note >}}

As configurações possuem um nome `handler` correspondente, referenciado pelo RuntimeClass. 
Esse nome deve ser um valor DNS 1123 válido (letras, números e o carácter `-`).

### 2. Crie o recurso RuntimeClass correspondente.

As etapas de configuração no passo 1 devem todas estar associadas a um nome para o campo `handler` 
que identifica a configuração. Para cada um, crie o objeto RuntimeClass correspondente.

O recurso RuntimeClass atualmente possui apenas 2 campos significativos: o nome do RuntimeClass
(`metadata.name`) e o agente (`handler`). A definição do objeto se parece conforme a seguir:

```yaml
apiVersion: node.k8s.io/v1  # RuntimeClass é definido no grupo de API node.k8s.io
kind: RuntimeClass
metadata:
  name: myclass  # O nome que o RuntimeClass será chamado como
  # RuntimeClass é um recurso global, e não possui namespace.
handler: myconfiguration  # Nome da configuração CRI correspondente
```

O nome de um objeto RuntimeClass deve ser um 
[nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

{{< note >}}
É recomendado que operações de escrita no objeto RuntimeClass (criar/atualizar/patch/apagar)
sejam restritas a administradores do cluster. Isso geralmente é o padrão. Veja [Visão Geral
de autorizações](/docs/reference/access-authn-authz/authorization/) para maiores detalhes.
{{< /note >}}

## Uso

Uma vez que as classes de execução estão configuradas no cluster, usar elas é relativamente
simples. Especifique um `runtimeClassName` na especificação do Pod. Por exemplo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Isso irá instruir o kubelet a usar o RuntimeClass nomeado acima (myclass) para esse Pod. Se
o nome do RuntimeClass não exustir, ou o CRI não puder executar a solicitação, o Pod irá entrar na [fase
final](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `Failed`. Procure por um 
[evento](/docs/tasks/debug-application-cluster/debug-application-introspection/) correspondente 
para uma mensagem de erro.

Se nenhum `runtimeClassName` for especificado, o RuntimeHandler padrão será utilizado, que é equivalente 
ao comportamento quando a funcionalidade de RuntimeClass está desativada.

### Configuração do CRI

Para maiores detalhes de configuração dos agentes de execução CRI, veja [instalação do CRI](/docs/setup/production-environment/container-runtimes/).

#### dockershim

O CRI dockershim embutido no Kubernetes não suporta outros agentes de execução

#### {{< glossary_tooltip term_id="containerd" >}}

Agentes de execução são configurados através da configuração do containerd em 
`/etc/containerd/config.toml`. Agentes válidos são configurados sob a seção de `runtimes`:

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

Veja a documentação de configuração do containerd para maiores detalhes:
https://github.com/containerd/cri/blob/master/docs/config.md

#### {{< glossary_tooltip term_id="cri-o" >}}

Agentes de execução são configurados através da configuração do CRI-O em `/etc/crio/crio.conf`. 
Agentes válidos são configurados na seção [crio.runtime
table](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Veja a [documentação de configuração](https://raw.githubusercontent.com/cri-o/cri-o/9f11d1d/docs/crio.conf.5.md) do CRI-O para maiores detalhes.

## Associação

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Ao especificar o campo `scheduling` para um RuntimeClass, você pode colocar limites e
garantir que os Pods executando dentro de uma RuntimeClass sejam associados a nós que 
suportem eles. Se o `scheduling` não estiver configurado, assume-se que esse RuntimeClass
é suportado por todos os nós.

Para garantir que os Pods sejam executados em um nó que suporte um RuntimeClass específico, 
aquele conjunto de nós deve possuir uma marca/label padrão que é selecionado pelo campo 
`runtimeclass.scheduling.nodeSelector`. O nodeSelector do RuntimeClass é combinado com o 
nodeSelector do Pod em tempo de admissão, obtendo a intersecção do conjunto de nós selecionado 
por cada. Se existir um conflito, o pod será rejeitado.

Se os nós suportados possuírem marcação de restrição para previnir outros Pods com uma 
classe de execução diferente de executar no nó, você pode adicionar o campo `tolerations` 
ao objeto RuntimeClass. Assim como com o `nodeSelector`, o `tolerations` é combinado com 
o campo `tolerations` do Pod em tempo de admissão, efetivamente pegando a intersecção do
conjunto de nós aplicáveis para cada.

Para saber mais sobre a configuração de seleção de nós e tolerâncias, veja [Associando Pods a 
Nós](/docs/concepts/scheduling-eviction/assign-pod-node/).

### Sobrecarga de Pods

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Você pode especificar os recursos extra que estão associados à execução de um Pod. Declarar esses 
recursos extra permite ao cluster (incluindo o agendador/scheduler de pods) contabilizar por 
esses recursos quando estiver decidindo sobre Pods e recursos. Para usar a contabilização 
desses recursos extras, você deve estar com o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 
PodOverhead habilitado (ele já está habilitado por padrão).

Os recursos extras utilizados são especificados no objeto RuntimeClass através do campo `overhead`.
Ao usar esses campos, você especifica o uso extra de recursos necessários para executar 
Pods utilizando-se desse Runtimeclass e assim contabilizar esses recursos para o Kubernetes.


## {{% heading "whatsnext" %}}


- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- Leia mais sobre [Sobrecarga de Pods](/docs/concepts/scheduling-eviction/pod-overhead/)
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
