---
title: Políticas de rede
content_type: concept
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "NetworkPolicy"
weight: 70
description: >-
  Se você deseja controlar o fluxo de tráfego no nível do endereço IP ou de portas (camadas OSI 3 ou 4),
  as NetworkPolicies permitem especificar regras para o fluxo de tráfego dentro do seu cluster, e
  também entre Pods e o mundo externo.
  Seu cluster deve utilizar um plugin de redes que suporte a aplicação de NetworkPolicy.
---

<!-- overview -->

Se você deseja controlar o fluxo do tráfego de rede no nível do endereço IP ou de portas para os protocolos TCP, UDP e SCTP
(camadas OSI 3 e 4), então você deve considerar usar `NetworkPolicies` do Kubernetes para aplicações específicas
no seu cluster. `NetworkPolicies` são um construto centrado em aplicações que permite especificar como é permitido a um
{{< glossary_tooltip text="pod" term_id="pod">}} comunicar-se com várias "entidades" de rede (usamos a palavra "entidade" aqui
para evitar sobrecarregar termos mais comuns como "endpoints" e "services", que possuem conotações específicas no Kubernetes)
pela rede. NetworkPolicies aplicam-se a uma conexão com um pod em uma ou ambas as extremidades, e não são relevantes para
outras conexões.

As entidades que um Pod pode se comunicar são identificadas através de uma combinação dos 3
identificadores à seguir:

1. Outros pods que são permitidos (exceção: um pod não pode bloquear o acesso a si próprio)
1. Namespaces que são permitidos
1. Blocos de IP (exceção: o tráfego de e para o nó onde um Pod está executando sempre é permitido,
   independentemente do endereço IP do Pod ou do nó)

Quando definimos uma política de rede baseada em pod ou namespace, utiliza-se um {{< glossary_tooltip text="selector" term_id="selector">}}
para especificar qual tráfego é permitido de e para o(s) Pod(s) que correspondem ao seletor.

Quando uma política de redes baseada em IP é criada, nós definimos a política baseada em blocos de IP (faixas CIDR).

<!-- body -->
## Pré requisitos

As políticas de rede são implementadas pelo [plugin de redes](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
Para usar uma política de redes, você deve usar uma solução de redes que suporte `NetworkPolicy`.
A criação de um recurso `NetworkPolicy` sem um controlador que implemente essas regras não tem efeito.

## Os dois tipos de isolamento de Pods

Existem dois tipos de isolamento para um pod: isolamento para tráfego de saída (egress) e isolamento para tráfego de entrada (ingress).
Eles dizem respeito a quais conexões podem ser estabelecidas. "Isolamento" aqui não é absoluto, e sim
significa "algumas restrições se aplicam". A alternativa, "não isolado para $direção", significa que nenhuma
restrição se aplica na direção declarada. Os dois tipos de isolamento (ou não) são declarados
independentemente, e ambos são relevantes para uma conexão de um pod para outro.

Por padrão, um pod não é isolado para saída; todas as conexões de saída são permitidas.
Um pod é isolado para saída se houver qualquer `NetworkPolicy` que selecione o pod e tenha
"Egress" em seus `policyTypes`; dizemos que tal política se aplica ao pod para saída.
Quando um pod é isolado para saída, as únicas conexões permitidas a partir do pod são aquelas permitidas pela
lista `egress` de alguma `NetworkPolicy` que se aplica ao pod para saída. O tráfego de resposta para essas
conexões permitidas também será implicitamente permitido.
Os efeitos dessas listas `egress` combinam-se de forma aditiva.

Por padrão, um pod não é isolado para entrada; todas as conexões de entrada são permitidas.
Um pod é isolado para entrada se houver qualquer `NetworkPolicy` que selecione o pod e
tenha "Ingress" em seus `policyTypes`; dizemos que tal política se aplica ao pod para entrada.
Quando um pod é isolado para entrada, as únicas conexões permitidas para o pod são aquelas vindas
do nó do pod e aquelas permitidas pela lista `ingress` de alguma `NetworkPolicy` que se aplica ao
pod para entrada. O tráfego de resposta para essas conexões permitidas também será implicitamente permitido.
Os efeitos dessas listas `ingress` combinam-se de forma aditiva.

As políticas de rede não conflitam; elas são aditivas. Se qualquer política ou políticas se aplicarem a um determinado
pod para uma determinada direção, as conexões permitidas naquela direção a partir daquele pod serão a união
do que as políticas aplicáveis permitem. Assim, a ordem de avaliação não afeta o resultado da política.

Para que uma conexão de um pod de origem para um pod de destino seja permitida, tanto a política de saída no
pod de origem quanto a política de entrada no pod de destino precisam permitir a conexão. Se
qualquer um dos lados não permitir a conexão, ela não acontecerá.

## O recurso NetworkPolicy {#networkpolicy-resource}

Veja a referência [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
para uma definição completa do recurso.

Um exemplo de `NetworkPolicy` pode ser similar ao abaixo:

{{% code_sample file="service/networking/networkpolicy.yaml" %}}

{{< note >}}
Enviar esse objeto via POST para o servidor de API do seu cluster não terá efeito a não ser que sua
solução de redes escolhida suporte políticas de rede.
{{< /note >}}

**Campos obrigatórios**: Assim como todas as outras configurações do Kubernetes, uma `NetworkPolicy`
necessita dos campos `apiVersion`, `kind` e `metadata`. Para informações gerais sobre como
trabalhar com arquivos de configuração, veja
[Configurando um Pod para Usar um ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
e [Gerenciamento de objetos](/docs/concepts/overview/working-with-objects/object-management).

**spec**: A [spec](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
da `NetworkPolicy` contém todas as informações necessárias para definir uma política de rede específica no namespace especificado.

**podSelector**: Cada `NetworkPolicy` inclui um `podSelector` que seleciona o grupo de pods
ao qual a política se aplica. A política de exemplo seleciona pods com a _label_ "role=db". Um `podSelector`
vazio seleciona todos os pods no namespace.

**policyTypes**: Cada `NetworkPolicy` inclui uma lista de `policyTypes` que pode incluir `Ingress`,
`Egress` ou ambos. O campo `policyTypes` indica se a política se aplica ao tráfego de entrada
com destino aos pods selecionados, ao tráfego de saída com origem nos pods selecionados, ou ambos.
Se nenhum `policyType` for especificado em uma `NetworkPolicy`, então por padrão `Ingress` será sempre definido e
`Egress` será definido se a `NetworkPolicy` contiver alguma regra de saída.

**ingress**: Cada `NetworkPolicy` pode incluir uma lista de regras de entrada permitidas através do campo `ingress`.
Cada regra permite o tráfego que corresponde simultaneamente às seções `from` (de) e `ports` (portas).
A política de exemplo contém uma regra simples, que corresponde ao tráfego em uma única porta,
de uma das três origens, sendo a primeira especificada via `ipBlock`, a segunda via `namespaceSelector` e
a terceira via `podSelector`.

**egress**: Cada `NetworkPolicy` pode incluir uma lista de regras de saída permitidas através do campo `egress`.
Cada regra permite o tráfego que corresponde simultaneamente às seções `to` (para) e `ports` (portas).
A política de exemplo contém uma regra simples, que corresponde ao tráfego em uma única porta
para qualquer destino em `10.0.0.0/24`.

Então, a `NetworkPolicy` de exemplo:

1. isola os pods com `role=db` no namespace `default` para o tráfego de entrada e saída
   (se eles ainda não estavam isolados)
1. (Regras de entrada) permite conexões para todos os pods no namespace `default` com a _label_
   `role=db` na porta TCP 6379 de:

   * qualquer pod no namespace `default` com a _label_ `role=frontend`
   * qualquer pod em um namespace que tenha a _label_ `project=myproject`
   * endereços IP nas faixas `172.17.0.0`–`172.17.0.255` e `172.17.2.0`–`172.17.255.255`
     (ou seja, toda a faixa `172.17.0.0/16` exceto `172.17.1.0/24`)

1. (Regras de saída) permite conexões de qualquer pod no namespace `default` com a _label_
   `role=db` para o CIDR `10.0.0.0/24` na porta TCP 5978.

Veja o tutorial [Declarando uma política de redes](/docs/tasks/administer-cluster/declare-network-policy/) para mais exemplos.

## Comportamento dos seletores `to` e `from`

Existem quatro tipos de seletores que podem ser especificados em uma seção `ingress` `from` ou `egress`
`to`:

**podSelector**: Seleciona Pods específicos no mesmo namespace da `NetworkPolicy` que devem
ser permitidos como origens de entrada ou destinos de saída.

**namespaceSelector**: Seleciona namespaces específicos para os quais todos os Pods devem ser permitidos como
origens de entrada ou destinos de saída.

**namespaceSelector** *e* **podSelector**: Uma única entrada `to`/`from` que especifica
ambos `namespaceSelector` e `podSelector` seleciona Pods específicos dentro de namespaces específicos.
Tenha cuidado para utilizar a sintaxe YAML correta. Por exemplo:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

Essa política contém um único elemento `from` permitindo conexões de Pods com a _label_
`role=client` em namespaces com a _label_ `user=alice`. Mas a política a seguir é diferente:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

Ela contém dois elementos no array `from`, e permite conexões de Pods no Namespace local com
a _label_ `role=client`, *OU* de qualquer Pod em qualquer namespace com a _label_
`user=alice`.

Quando estiver em dúvida, utilize o comando `kubectl describe` para verificar como o
Kubernetes interpretou a política.

<a name="behavior-of-ipblock-selectors"></a>
**ipBlock**: Seleciona faixas CIDR de IP específicas a serem permitidas como origens de entrada
ou destinos de saída. Devem ser IPs externos ao cluster, uma vez que os IPs dos Pods são efêmeros e imprevisíveis.

Os mecanismos de entrada e saída do cluster geralmente requerem que os IPs de origem ou destino
dos pacotes sejam reescritos. Em casos em que isso aconteça, não é definido se isso acontece antes ou
depois do processamento da `NetworkPolicy`, e o comportamento pode ser diferente para diferentes
combinações de plugin de rede, provedor de nuvem, implementação de `Service`, etc.

No caso de tráfego de entrada, isso significa que em alguns casos você pode filtrar os pacotes
de entrada com base no IP de origem original real, enquanto que em outros casos, o "IP de origem" sobre o qual
a `NetworkPolicy` atua pode ser o IP de um `LoadBalancer` ou do nó do Pod, etc.

No caso de tráfego de saída, isso significa que conexões de pods para IPs de `Service` que são reescritos
para IPs externos ao cluster podem ou não estar sujeitas a políticas baseadas em `ipBlock`.

## Políticas padrão

Por padrão, se nenhuma política existir em um namespace, então todo o tráfego de entrada e saída é
permitido de e para os pods nesse namespace. Os exemplos a seguir permitem a você mudar o
comportamento padrão nesse namespace.

### Bloqueio padrão de todo tráfego de entrada

Você pode criar uma política de isolamento "padrão" de entrada para um namespace criando uma `NetworkPolicy`
que seleciona todos os pods mas não permite nenhum tráfego de entrada para esses pods.

{{% code_sample file="service/networking/network-policy-default-deny-ingress.yaml" %}}

Isso garante que mesmo pods que não são selecionados por nenhuma outra `NetworkPolicy` ainda
serão isolados para tráfego de entrada. Essa política não afeta o isolamento para tráfego de saída de nenhum pod.

### Permitir por padrão todo tráfego de entrada

Se você deseja permitir todas as conexões de entrada para todos os pods em um namespace, você pode criar
uma política que permita explicitamente isso.

{{% code_sample file="service/networking/network-policy-allow-all-ingress.yaml" %}}

Com essa política aplicada, nenhuma política adicional pode fazer com que qualquer conexão de entrada para
esses pods seja negada. Essa política não tem efeito no isolamento para tráfego de saída de nenhum pod.

### Bloqueio padrão de todo tráfego de saída

Você pode criar uma política de isolamento de saída "padrão" para um namespace criando uma `NetworkPolicy`
que selecione todos os pods, mas não permita nenhum tráfego de saída a partir desses pods.

{{% code_sample file="service/networking/network-policy-default-deny-egress.yaml" %}}

Isso garante que mesmo pods que não são selecionados por nenhuma outra `NetworkPolicy` não terão
tráfego de saída permitido. Essa política não altera o comportamento de isolamento de entrada de nenhum pod.

{{< caution >}}
Uma política padrão de negar todo tráfego de saída também bloqueia o tráfego DNS. Se suas cargas de trabalho
precisam de resolução DNS, você deve adicionar uma `NetworkPolicy` separada que permita
o tráfego de saída para o serviço DNS do seu cluster.
{{< /caution >}}

### Permitir por padrão todo tráfego de saída

Caso você queira permitir todas as conexões de todos os pods em um namespace, você pode criar uma
política que permita explicitamente todas as conexões de saída a partir dos pods nesse namespace.

{{% code_sample file="service/networking/network-policy-allow-all-egress.yaml" %}}

Com essa política aplicada, nenhuma política adicional pode fazer com que qualquer conexão de saída
desses pods seja negada. Essa política não tem efeito no isolamento para tráfego de entrada de nenhum pod.

### Bloqueio padrão de todo tráfego de entrada e saída

Você pode criar uma política "padrão" em um namespace que previne todo o tráfego de entrada E saída
criando a `NetworkPolicy` a seguir nesse namespace.

{{% code_sample file="service/networking/network-policy-default-deny-all.yaml" %}}

Isso garante que mesmo pods que não são selecionados por nenhuma outra `NetworkPolicy` não terão
tráfego de entrada ou saída permitido.

## Filtragem de tráfego de rede

`NetworkPolicy` é definida para conexões de [camada 4](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_layer)
(TCP, UDP e opcionalmente SCTP). Para todos os outros protocolos, o comportamento pode variar
entre plugins de rede.

{{< note >}}
Você deve usar um plugin {{< glossary_tooltip text="CNI" term_id="cni" >}} que suporte
`NetworkPolicies` com protocolo SCTP.
{{< /note >}}

Quando uma política de rede do tipo `deny all` é definida, há garantia apenas para negar
conexões TCP, UDP e SCTP. Para outros protocolos, como ARP ou ICMP, o comportamento é indefinido.
O mesmo se aplica às regras de permissão: quando um pod específico é permitido como origem de entrada
ou destino de saída, é indefinido o que acontece com (por exemplo) pacotes ICMP. Protocolos como ICMP podem
ser permitidos por alguns plugins de rede e negados por outros.

## Selecionando uma faixa de portas

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Ao escrever uma `NetworkPolicy`, você pode selecionar uma faixa de portas ao invés de uma porta única.

Isso é possível utilizando-se do campo `endPort`, conforme o exemplo a seguir:

{{% code_sample file="service/networking/networkpolicy-multiport-egress.yaml" %}}

A regra acima permite a qualquer Pod com a _label_ `role=db` no namespace `default` de se comunicar
com qualquer IP na faixa `10.0.0.0/24` através de protocolo TCP, desde que a porta de destino
esteja entre 32000 e 32768.

As seguintes restrições aplicam-se ao se utilizar esse campo:

* O valor do campo `endPort` deve ser igual ou maior ao valor do campo `port`.
* O campo `endPort` só pode ser definido se o campo `port` também for definido.
* Ambas as portas devem ser numéricas.

{{< note >}}
Seu cluster deve utilizar um plugin {{< glossary_tooltip text="CNI" term_id="cni" >}}
que suporte o campo `endPort` nas especificações de `NetworkPolicy`.
Se o seu [plugin de redes](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
não suportar o campo `endPort` e você especificar uma `NetworkPolicy` com ele,
a política será aplicada apenas para o campo `port` único.
{{< /note >}}

## Selecionando múltiplos Namespaces por _label_

Nesse cenário, sua `NetworkPolicy` do tipo `Egress` tem como alvo mais de um namespace utilizando
os nomes das _labels_ deles. Para que isso funcione, você precisa rotular os namespaces alvo. Por exemplo:

```shell
kubectl label namespace frontend namespace=frontend
kubectl label namespace backend namespace=backend
```

Adicione as _labels_ sob `namespaceSelector` no seu documento de `NetworkPolicy`. Por exemplo:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-namespaces
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchExpressions:
        - key: namespace
          operator: In
          values: ["frontend", "backend"]
```

{{< note >}}
Não é possível especificar diretamente o nome dos namespaces em uma `NetworkPolicy`.
Você deve usar um `namespaceSelector` com `matchLabels` ou `matchExpressions` para selecionar os
namespaces com base em suas _labels_.
{{< /note >}}

## Selecionando um Namespace pelo seu nome

A camada de gerenciamento do Kubernetes define uma _label_ imutável `kubernetes.io/metadata.name` em
todos os namespaces, o valor dessa _label_ é o nome do namespace.

Embora uma `NetworkPolicy` não possa selecionar um namespace pelo seu nome através de algum campo do objeto,
você pode utilizar essa _label_ padronizada para selecionar um namespace específico.

## Ciclo de vida do Pod

{{< note >}}
O que se segue aplica-se a clusters com um plugin de rede compatível e uma implementação compatível
de `NetworkPolicy`.
{{< /note >}}

Quando um novo objeto `NetworkPolicy` é criado, pode levar algum tempo para que um plugin de rede
processe o novo objeto. Se um pod afetado por uma `NetworkPolicy`
for criado antes que o plugin de rede tenha concluído o processamento da `NetworkPolicy`,
esse pod pode ser iniciado desprotegido, e as regras de isolamento serão aplicadas quando
o processamento da `NetworkPolicy` for concluído.

Uma vez que a `NetworkPolicy` é processada por um plugin de rede,

1. Todos os pods recém-criados afetados por uma determinada `NetworkPolicy` serão isolados antes de serem iniciados.
   Implementações de `NetworkPolicy` devem garantir que a filtragem seja efetiva durante
   todo o ciclo de vida do Pod, mesmo a partir do primeiro instante em que qualquer contêiner desse Pod for iniciado.
   Como são aplicadas a nível de Pod, `NetworkPolicies` aplicam-se igualmente a init containers,
   contêineres sidecar e contêineres regulares.

1. As regras de permissão serão aplicadas eventualmente após as regras de isolamento (ou podem ser aplicadas ao mesmo tempo).
   No pior caso, um pod recém-criado pode não ter conectividade de rede alguma quando for iniciado pela primeira vez, se
   as regras de isolamento já tiverem sido aplicadas, mas nenhuma regra de permissão tiver sido aplicada ainda.

Toda `NetworkPolicy` criada será eventualmente processada por um plugin de rede, mas não há
forma de saber pela API do Kubernetes exatamente quando isso acontece.

Portanto, os pods devem ser resilientes a serem iniciados com conectividade de rede diferente
da esperada. Se você precisa garantir que o pod possa alcançar determinados destinos
antes de ser iniciado, você pode usar um [init container](/docs/concepts/workloads/pods/init-containers/)
para esperar que esses destinos estejam acessíveis antes que o kubelet inicie os contêineres da aplicação.

Toda `NetworkPolicy` será eventualmente aplicada a todos os pods selecionados.
Como o plugin de rede pode implementar `NetworkPolicy` de forma distribuída,
é possível que os pods vejam uma visão ligeiramente inconsistente das políticas de rede
quando o pod é criado pela primeira vez, ou quando pods ou políticas mudam.
Por exemplo, um pod recém-criado que supostamente deve conseguir alcançar tanto o Pod A
no Nó 1 quanto o Pod B no Nó 2 pode descobrir que consegue alcançar o Pod A imediatamente,
mas não consegue alcançar o Pod B até alguns segundos depois.

## NetworkPolicy e Pods `hostNetwork`

O comportamento da `NetworkPolicy` para Pods `hostNetwork` é indefinido, mas deve estar limitado a 2 possibilidades:

- O plugin de rede consegue distinguir o tráfego de um Pod `hostNetwork` de todo o outro tráfego
  (incluindo a capacidade de distinguir o tráfego de diferentes Pods `hostNetwork` no
  mesmo nó), e aplicará a `NetworkPolicy` aos Pods `hostNetwork` da mesma forma que faz
  aos pods da rede de Pods.
- O plugin de rede não consegue distinguir corretamente o tráfego de um Pod `hostNetwork`,
  e por isso ignora os Pods `hostNetwork` ao corresponder `podSelector` e `namespaceSelector`.
  O tráfego de/para Pods `hostNetwork` é tratado da mesma forma que todo o outro tráfego de/para o IP do nó.
  (Esta é a implementação mais comum.)

Isto se aplica quando

1. um Pod `hostNetwork` é selecionado por `spec.podSelector`.

   ```yaml
     ...
     spec:
       podSelector:
         matchLabels:
           role: client
     ...
   ```

1. um Pod `hostNetwork` é selecionado por um `podSelector` ou `namespaceSelector` em uma regra `ingress` ou `egress`.

   ```yaml
     ...
     ingress:
       - from:
         - podSelector:
             matchLabels:
               role: client
     ...
   ```

Ao mesmo tempo, como Pods `hostNetwork` têm os mesmos endereços IP dos nós em que residem,
suas conexões serão tratadas como conexões do nó. Por exemplo, você pode permitir tráfego
a partir de um Pod `hostNetwork` usando uma regra `ipBlock`.

## O que você não pode fazer com `NetworkPolicies` (ao menos por enquanto!)

A partir do Kubernetes {{< skew currentVersion >}}, as funcionalidades a seguir não existem na
API `NetworkPolicy`, mas você pode conseguir implementar de forma alternativa utilizando componentes do
Sistema Operacional (como SELinux, OpenVSwitch, IPTables, etc) ou tecnologias da camada 7 OSI (ingress
controllers, implementações de service mesh) ou ainda admission controllers. No caso de você ser novo em
segurança de redes no Kubernetes, vale notar que as Histórias de Usuário a seguir ainda não podem
ser implementadas usando a API `NetworkPolicy`.

- Forçar o tráfego interno do cluster passar por um gateway comum (isso pode ser melhor atendido por
  um service mesh ou outro proxy).
- Qualquer coisa relacionada a TLS (use um service mesh ou ingress controller para isso).
- Políticas específicas a nível do nó (você pode utilizar notação CIDR para isso, mas não pode
  selecionar nós Kubernetes especificamente por suas identidades).
- Selecionar `Services` pelo seu nome (você pode, contudo, selecionar pods ou namespaces por seus
  {{< glossary_tooltip text="labels" term_id="label" >}}, o que muitas vezes é uma solução de contorno viável).
- Criação ou gerenciamento de "Policy requests" que sejam atendidas por terceiros.
- Políticas padrão que são aplicadas a todos os namespaces ou pods (existem algumas distribuições e
  projetos de terceiros do Kubernetes que podem fazer isso).
- Ferramental avançado de consulta de políticas e verificação de alcançabilidade.
- A capacidade de logar eventos de segurança de rede (por exemplo, conexões bloqueadas ou aceitas).
- A capacidade de explicitamente negar políticas (atualmente o modelo das `NetworkPolicies` é negar por
  padrão, com apenas a capacidade de adicionar regras de permissão).
- A capacidade de prevenir tráfego de loopback ou de entrada vindo do host (Pods atualmente não podem
  bloquear acesso ao localhost, nem têm a capacidade de bloquear acesso a partir do nó em que residem).

## Impacto da NetworkPolicy em conexões existentes

Quando o conjunto de `NetworkPolicies` que se aplica a uma conexão existente muda - isso pode acontecer
seja devido a uma alteração nas `NetworkPolicies` ou se as _labels_ relevantes dos namespaces/pods selecionados pela
política (tanto o alvo quanto os pares) forem alteradas no meio de uma conexão existente - é
definido pela implementação se a alteração terá efeito para aquela conexão existente ou não.
Exemplo: uma política é criada que leva a negar uma conexão previamente permitida; a implementação subjacente
do plugin de rede é responsável por definir se essa nova política fechará as conexões existentes ou não.
É recomendado não modificar políticas/pods/namespaces de formas que possam afetar conexões existentes.

## {{% heading "whatsnext" %}}

- Veja o tutorial [Declarando políticas de rede](/docs/tasks/administer-cluster/declare-network-policy/)
  para mais exemplos.
- Veja mais [receitas](https://github.com/ahmetb/kubernetes-network-policy-recipes) para cenários
  comuns habilitados pelo recurso `NetworkPolicy`.
