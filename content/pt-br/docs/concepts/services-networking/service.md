---
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: Descoberta de serviços e balanceamento de carga
  description: >
    Não há necessidade de modificar sua aplicação para usar um mecanismo de descoberta de serviços desconhecido. O Kubernetes fornece aos Pods seus próprios endereços IP e um único nome DNS para um conjunto de Pods, e pode balancear a carga entre eles.
description: >-
  Exponha uma aplicação em execução no seu cluster por trás de um único
  endpoint voltado para o exterior, mesmo quando a carga de trabalho está dividida entre vários backends.
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="No Kubernetes, um Service é" >}}

Um objetivo fundamental dos Services no Kubernetes é que você não precise modificar sua aplicação
existente para usar um mecanismo de descoberta de serviços desconhecido.
Você pode executar código em Pods, seja um código projetado para um mundo nativo em nuvem, ou
uma aplicação mais antiga que você containerizou. Você usa um Service para tornar esse conjunto de Pods disponível
na rede para que os clientes possam interagir com ele.

Se você usa um {{< glossary_tooltip term_id="deployment" >}} para executar sua aplicação,
esse Deployment pode criar e destruir Pods dinamicamente. De um momento para o outro,
você não sabe quantos desses Pods estão funcionando e íntegros; você pode nem mesmo saber
como esses Pods íntegros são nomeados.
Os {{< glossary_tooltip term_id="pod" text="Pods" >}} do Kubernetes são criados e destruídos
para corresponder ao estado desejado do seu cluster. Pods são recursos efêmeros (você não deve
esperar que um Pod individual seja confiável e durável).

Cada Pod obtém seu próprio endereço IP (o Kubernetes espera que os plugins de rede garantam isso).
Para um determinado Deployment no seu cluster, o conjunto de Pods em execução em um momento no
tempo pode ser diferente do conjunto de Pods executando essa aplicação um momento depois.

Isso leva a um problema: se algum conjunto de Pods (chame-os de "backends") fornece
funcionalidade para outros Pods (chame-os de "frontends") dentro do seu cluster,
como os frontends descobrem e mantêm o controle de qual endereço IP conectar,
para que o frontend possa usar a parte backend da carga de trabalho?

Entram os _Services_.

<!-- body -->

## Services no Kubernetes

A API Service, parte do Kubernetes, é uma abstração para ajudá-lo a expor grupos de
Pods em uma rede. Cada objeto Service define um conjunto lógico de endpoints (geralmente
esses endpoints são Pods) junto com uma política sobre como tornar esses pods acessíveis.

Por exemplo, considere um backend de processamento de imagens sem estado que está em execução com
3 réplicas. Essas réplicas são fungíveis&mdash;os frontends não se importam com qual backend
eles usam. Embora os Pods reais que compõem o conjunto de backend possam mudar, os
clientes frontend não devem precisar estar cientes disso, nem devem precisar manter
o controle do conjunto de backends por conta própria.

A abstração Service permite esse desacoplamento.

O conjunto de Pods direcionado por um Service geralmente é determinado
por um {{< glossary_tooltip text="seletor" term_id="selector" >}} que você
define.
Para aprender sobre outras maneiras de definir endpoints de Service,
consulte [Services _sem_ seletores](#services-without-selectors).

Se sua carga de trabalho fala HTTP, você pode optar por usar um
[Ingress](/docs/concepts/services-networking/ingress/) para controlar como o tráfego web
alcança essa carga de trabalho.
Ingress não é um tipo de Service, mas atua como o ponto de entrada para o seu
cluster. Um Ingress permite que você consolide suas regras de roteamento em um único recurso, para
que você possa expor múltiplos componentes da sua carga de trabalho, executando separadamente no seu
cluster, atrás de um único ponto de entrada.

O [Gateway API](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) para Kubernetes
fornece capacidades extras além de Ingress e Service. Você pode adicionar Gateway ao seu cluster -
é uma família de APIs de extensão, implementadas usando
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} -
e então usá-las para configurar o acesso a serviços de rede que estão em execução no seu cluster.

### Descoberta de serviços nativos em nuvem

Se você puder usar as APIs do Kubernetes para descoberta de serviços na sua aplicação,
você pode consultar o {{< glossary_tooltip text="servidor de API" term_id="kube-apiserver" >}}
para EndpointSlices correspondentes. O Kubernetes atualiza os EndpointSlices para um Service
sempre que o conjunto de Pods em um Service muda.

Para aplicações não nativas, o Kubernetes oferece maneiras de colocar uma porta de rede ou balanceador de
carga entre sua aplicação e os Pods de backend.

De qualquer forma, sua carga de trabalho pode usar esses mecanismos de [descoberta de Services](#discovering-services)
para encontrar o destino ao qual deseja se conectar.

## Definindo um Service

Um Service é um {{< glossary_tooltip text="objeto" term_id="object" >}}
(da mesma forma que um Pod ou um ConfigMap é um objeto). Você pode criar,
visualizar ou modificar definições de Service usando a API do Kubernetes. Normalmente
você usa uma ferramenta como `kubectl` para fazer essas chamadas para a API.

Por exemplo, suponha que você tenha um conjunto de Pods que escutam na porta TCP 9376
e são rotulados como `app.kubernetes.io/name=MyApp`. Você pode definir um Service para
publicar esse ponto de entrada TCP:

{{% code_sample file="service/simple-service.yaml" %}}

Aplicar esse manifesto cria um novo Service chamado "my-service" com o
[tipo de Service](#publishing-services-service-types) ClusterIP padrão. O Service
direciona para a porta TCP 9376 em qualquer Pod com o rótulo `app.kubernetes.io/name: MyApp`.

O Kubernetes atribui a este Service um endereço IP (o _IP do cluster_),
que é usado pelo mecanismo de endereço IP virtual. Para mais detalhes sobre esse mecanismo,
leia [IPs Virtuais e Proxies de Service](/docs/reference/networking/virtual-ips/).

O controlador para esse Service verifica continuamente por Pods que
correspondam ao seu seletor, e então faz quaisquer atualizações necessárias ao conjunto de
EndpointSlices para o Service.

O nome de um objeto Service deve ser um
[nome de rótulo RFC 1035](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names) válido.


{{< note >}}
Um Service pode mapear _qualquer_ `port` de entrada para uma `targetPort`. Por padrão e
por conveniência, a `targetPort` é definida com o mesmo valor do campo `port`.
{{< /note >}}

### Requisitos de nomenclatura relaxados para objetos Service

{{< feature-state feature_gate_name="RelaxedServiceNameValidation" >}}

O feature gate `RelaxedServiceNameValidation` permite que nomes de objetos Service comecem com um dígito. Quando este feature gate está habilitado, os nomes de objetos Service devem ser [nomes de rótulo RFC 1123](/docs/concepts/overview/working-with-objects/names/#dns-label-names) válidos.

### Definições de porta {#field-spec-ports}

Definições de porta em Pods têm nomes, e você pode referenciar esses nomes no
atributo `targetPort` de um Service. Por exemplo, podemos vincular a `targetPort`
do Service à porta do Pod da seguinte maneira:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc
```

Isso funciona mesmo se houver uma mistura de Pods no Service usando um único
nome configurado, com o mesmo protocolo de rede disponível através de diferentes
números de porta. Isso oferece muita flexibilidade para implantar e evoluir
seus Services. Por exemplo, você pode alterar os números de porta que os Pods expõem
na próxima versão do seu software de backend, sem quebrar os clientes.

O protocolo padrão para Services é
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp); você também pode
usar qualquer outro [protocolo suportado](/docs/reference/networking/service-protocols/).

Como muitos Services precisam expor mais de uma porta, o Kubernetes suporta
[múltiplas definições de porta](#multi-port-services) para um único Service.
Cada definição de porta pode ter o mesmo `protocol`, ou um diferente.

### Services sem seletores {#services-without-selectors}

Services mais comumente abstraem o acesso a Pods do Kubernetes graças ao seletor,
mas quando usados com um conjunto correspondente de
objetos {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}
e sem um seletor, o Service pode abstrair outros tipos de backends,
incluindo aqueles que são executados fora do cluster.

Por exemplo:

* Você quer ter um cluster de banco de dados externo em produção, mas no seu
  ambiente de teste você usa seus próprios bancos de dados.
* Você quer apontar seu Service para um Service em um
  {{< glossary_tooltip term_id="namespace" >}} diferente ou em outro cluster.
* Você está migrando uma carga de trabalho para o Kubernetes. Ao avaliar a abordagem,
  você executa apenas uma parte dos seus backends no Kubernetes.

Em qualquer um desses cenários, você pode definir um Service _sem_ especificar um
seletor para corresponder aos Pods. Por exemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

Como este Service não tem seletor, os objetos EndpointSlice
correspondentes não são criados automaticamente. Você pode mapear o Service
para o endereço de rede e porta onde ele está sendo executado, adicionando um objeto EndpointSlice
manualmente. Por exemplo:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # por convenção, use o nome do Service
                     # como um prefixo para o nome do EndpointSlice
  labels:
    # Você deve definir o rótulo "kubernetes.io/service-name".
    # Defina seu valor para corresponder ao nome do Service
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # deve corresponder ao nome da porta do service definida acima
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### EndpointSlices personalizados

Quando você cria um objeto [EndpointSlice](#endpointslices) para um Service, você pode
usar qualquer nome para o EndpointSlice. Cada EndpointSlice em um namespace deve ter um
nome único. Você vincula um EndpointSlice a um Service definindo o
{{< glossary_tooltip text="rótulo" term_id="label" >}} `kubernetes.io/service-name`
nesse EndpointSlice.

{{< note >}}
Os IPs de endpoint _não devem_ ser: loopback (127.0.0.0/8 para IPv4, ::1/128 para IPv6), ou
link-local (169.254.0.0/16 e 224.0.0.0/24 para IPv4, fe80::/64 para IPv6).

Os endereços IP de endpoint não podem ser os IPs de cluster de outros Services do Kubernetes,
porque o {{< glossary_tooltip term_id="kube-proxy" >}} não suporta IPs virtuais
como destino.
{{< /note >}}

Para um EndpointSlice que você criar por conta própria, ou no seu próprio código,
você também deve escolher um valor para usar no rótulo
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by).
Se você criar seu próprio código de controlador para gerenciar EndpointSlices, considere usar um
valor similar a `"my-domain.example/name-of-controller"`. Se você estiver usando uma
ferramenta de terceiros, use o nome da ferramenta em letras minúsculas e altere espaços e outras
pontuações para traços (`-`).
Se as pessoas estiverem usando diretamente uma ferramenta como `kubectl` para gerenciar EndpointSlices,
use um nome que descreva esse gerenciamento manual, como `"staff"` ou
`"cluster-admins"`. Você deve
evitar usar o valor reservado `"controller"`, que identifica EndpointSlices
gerenciados pela própria camada de gerenciamento do Kubernetes.

#### Acessando um Service sem seletor {#service-no-selector-access}

Acessar um Service sem seletor funciona da mesma forma que se tivesse um seletor.
No [exemplo](#services-without-selectors) de um Service sem seletor,
o tráfego é roteado para um dos dois endpoints definidos no
manifesto EndpointSlice: uma conexão TCP para 10.1.2.3 ou 10.4.5.6, na porta 9376.

{{< note >}}
O servidor de API do Kubernetes não permite proxy para endpoints que não estão mapeados para
pods. Ações como `kubectl port-forward service/<service-name> forwardedPort:servicePort` onde o service não tem
seletor falharão devido a essa restrição. Isso impede que o servidor de API do Kubernetes
seja usado como um proxy para endpoints aos quais o solicitante pode não estar autorizado a acessar.
{{< /note >}}

Um Service `ExternalName` é um caso especial de Service que não possui
seletores e usa nomes DNS em vez disso. Para mais informações, consulte a
seção [ExternalName](#externalname).

### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) são objetos que
representam um subconjunto (uma _fatia_) dos endpoints de rede de suporte para um Service.

Seu cluster Kubernetes rastreia quantos endpoints cada EndpointSlice representa.
Se houver tantos endpoints para um Service que um limite seja atingido, então
o Kubernetes adiciona outro EndpointSlice vazio e armazena novas informações de endpoint
lá.
Por padrão, o Kubernetes cria um novo EndpointSlice assim que os EndpointSlices
existentes contêm pelo menos 100 endpoints. O Kubernetes não cria o novo EndpointSlice
até que um endpoint extra precise ser adicionado.

Consulte [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) para mais
informações sobre esta API.

### Endpoints (descontinuado) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

A API EndpointSlice é a evolução da antiga
API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/).
A API Endpoints descontinuada tem vários problemas em relação ao
EndpointSlice:

  - Ela não suporta clusters dual-stack.
  - Ela não contém informações necessárias para suportar funcionalidades mais recentes, como
    [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution).
  - Ela truncará a lista de endpoints se for muito longa para caber em um único objeto.

Devido a isso, é recomendado que todos os clientes usem a
API EndpointSlice em vez de Endpoints.

#### Endpoints com capacidade excedida

O Kubernetes limita o número de endpoints que podem caber em um único objeto Endpoints.
Quando há mais de 1000 endpoints de suporte para um Service, o Kubernetes
trunca os dados no objeto Endpoints. Como um Service pode ser vinculado
a mais de um EndpointSlice, o limite de 1000 endpoints de suporte afeta apenas
a API Endpoints legada.

Nesse caso, o Kubernetes seleciona no máximo 1000 endpoints de backend possíveis para armazenar
no objeto Endpoints, e define uma
{{< glossary_tooltip text="anotação" term_id="annotation" >}} no Endpoints:
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
A camada de gerenciamento também remove essa anotação se o número de Pods de backend cair abaixo de 1000.

O tráfego ainda é enviado para os backends, mas qualquer mecanismo de balanceamento de carga que dependa da
API Endpoints legada envia tráfego apenas para no máximo 1000 dos endpoints de suporte disponíveis.

O mesmo limite da API significa que você não pode atualizar manualmente um Endpoints para ter mais de 1000 endpoints.

### Protocolo de aplicação

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

O campo `appProtocol` fornece uma maneira de especificar um protocolo de aplicação para
cada porta do Service. Isso é usado como uma dica para implementações oferecerem
comportamento mais rico para protocolos que elas entendem.
O valor deste campo é espelhado pelos objetos
Endpoints e EndpointSlice correspondentes.

Este campo segue a sintaxe de rótulo padrão do Kubernetes. Valores válidos são um dos seguintes:

* [Nomes de serviço padrão IANA](https://www.iana.org/assignments/service-names).

* Nomes prefixados definidos pela implementação, como `mycompany.com/my-custom-protocol`.

* Nomes prefixados definidos pelo Kubernetes:

| Protocolo | Descrição |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 sobre cleartext conforme descrito na [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540) |
| `kubernetes.io/ws`  | WebSocket sobre cleartext conforme descrito na [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
| `kubernetes.io/wss` | WebSocket sobre TLS conforme descrito na [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |

### Services multi-porta {#multi-port-services}

Para alguns Services, você precisa expor mais de uma porta.
O Kubernetes permite que você configure múltiplas definições de porta em um objeto Service.
Ao usar múltiplas portas para um Service, você deve dar nomes a todas as suas portas
para que estas sejam inequívocas.
Por exemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
Assim como os {{< glossary_tooltip term_id="name" text="nomes">}} do Kubernetes em geral, os nomes de portas
devem conter apenas caracteres alfanuméricos em minúsculas e `-`. Os nomes de portas também devem
começar e terminar com um caractere alfanumérico.

Por exemplo, os nomes `123-abc` e `web` são válidos, mas `123_abc` e `-web` não são.
{{< /note >}}

## Tipo de Service  {#publishing-services-service-types}

Para algumas partes da sua aplicação (por exemplo, frontends) você pode querer expor um
Service em um endereço IP externo, acessível de fora do seu
cluster.

Os tipos de Service do Kubernetes permitem que você especifique que tipo de Service você deseja.

Os valores de `type` disponíveis e seus comportamentos são:

[`ClusterIP`](#type-clusterip)
: Expõe o Service em um IP interno do cluster. Escolher este valor
  torna o Service acessível apenas de dentro do cluster. Este é o
  padrão usado se você não especificar explicitamente um `type` para um Service.
  Você pode expor o Service para a internet pública usando um
  [Ingress](/docs/concepts/services-networking/ingress/) ou um
  [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Expõe o Service no IP de cada Node em uma porta estática (a `NodePort`).
  Para disponibilizar a porta do nó, o Kubernetes configura um endereço IP do cluster,
  o mesmo que se você tivesse solicitado um Service do `type: ClusterIP`.

[`LoadBalancer`](#loadbalancer)
: Expõe o Service externamente usando um balanceador de carga externo. O Kubernetes
  não oferece diretamente um componente de balanceamento de carga; você deve fornecer um, ou
  pode integrar seu cluster Kubernetes com um provedor de nuvem.

[`ExternalName`](#externalname)
: Mapeia o Service para o conteúdo do campo `externalName` (por exemplo,
  para o nome de host `api.foo.bar.example`). O mapeamento configura o servidor
  DNS do seu cluster para retornar um registro `CNAME` com esse valor de nome de host externo.
  Nenhum tipo de proxy é configurado.

O campo `type` na API Service é projetado como funcionalidade aninhada - cada nível
adiciona ao anterior. No entanto, há uma exceção a este design aninhado. Você pode
definir um Service `LoadBalancer`
[desabilitando a alocação de `NodePort` do balanceador de carga](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation).

### `type: ClusterIP` {#type-clusterip}

Este tipo de Service padrão atribui um endereço IP de um pool de endereços IP que
seu cluster reservou para esse propósito.

Vários dos outros tipos de Service são construídos sobre o tipo `ClusterIP` como
fundação.

Se você definir um Service que tenha o `.spec.clusterIP` definido como `"None"`, então
o Kubernetes não atribui um endereço IP. Consulte [headless Services](#headless-services)
para mais informações.

#### Escolhendo seu próprio endereço IP

Você pode especificar seu próprio endereço IP do cluster como parte de uma requisição de
criação de `Service`. Para fazer isso, defina o campo `.spec.clusterIP`. Por exemplo, se você
já tem uma entrada DNS existente que deseja reutilizar, ou sistemas legados
que estão configurados para um endereço IP específico e difíceis de reconfigurar.

O endereço IP que você escolher deve ser um endereço IPv4 ou IPv6 válido dentro do
intervalo CIDR `service-cluster-ip-range` que está configurado para o servidor de API.
Se você tentar criar um Service com um valor de `clusterIP` inválido, o servidor de API
retornará um código de status HTTP 422 para indicar que há um problema.

Leia [evitando conflitos](/docs/reference/networking/virtual-ips/#avoiding-collisions)
para aprender como o Kubernetes ajuda a reduzir o risco e o impacto de dois Services diferentes
tentando usar o mesmo endereço IP.

### `type: NodePort` {#type-nodeport}

Se você definir o campo `type` como `NodePort`, a camada de gerenciamento do Kubernetes
aloca uma porta de um intervalo especificado pela flag `--service-node-port-range` (padrão: 30000-32767).
Cada nó faz proxy dessa porta (o mesmo número de porta em cada Node) para o seu Service.
Seu Service reporta a porta alocada no campo `.spec.ports[*].nodePort`.

Usar um NodePort lhe dá a liberdade de configurar sua própria solução de balanceamento de carga,
configurar ambientes que não são totalmente suportados pelo Kubernetes, ou até mesmo
expor diretamente os endereços IP de um ou mais nós.

Para um Service do tipo node port, o Kubernetes aloca adicionalmente uma porta (TCP, UDP ou
SCTP para corresponder ao protocolo do Service). Cada nó no cluster se configura
para escutar nessa porta atribuída e encaminhar o tráfego para um dos endpoints prontos
associados a esse Service. Você poderá contatar o Service `type: NodePort`
de fora do cluster, conectando-se a qualquer nó usando o protocolo apropriado
(por exemplo: TCP), e a porta apropriada (conforme atribuída a esse Service).

#### Escolhendo sua própria porta {#nodeport-custom-port}

Se você deseja um número de porta específico, pode especificar um valor no campo `nodePort`.
A camada de gerenciamento alocará essa porta para você ou reportará que
a transação da API falhou.
Isso significa que você precisa cuidar de possíveis conflitos de porta por conta própria.
Você também precisa usar um número de porta válido, que esteja dentro do intervalo configurado
para uso de NodePort.

Aqui está um exemplo de manifesto para um Service do `type: NodePort` que especifica
um valor NodePort (30007, neste exemplo):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # Por padrão e por conveniência, a `targetPort` é definida com
      # o mesmo valor do campo `port`.
      targetPort: 80
      # Campo opcional
      # Por padrão e por conveniência, a camada de gerenciamento do Kubernetes
      # alocará uma porta de um intervalo (padrão: 30000-32767)
      nodePort: 30007
```

#### Reserve intervalos de Nodeport para evitar conflitos  {#avoid-nodeport-collisions}

A política para atribuir portas a services NodePort se aplica tanto aos cenários de atribuição automática quanto
de atribuição manual. Quando um usuário deseja criar um service NodePort que
usa uma porta específica, a porta de destino pode entrar em conflito com outra porta que já foi atribuída.

Para evitar este problema, o intervalo de portas para services NodePort é dividido em duas faixas.
A atribuição dinâmica de portas usa a faixa superior por padrão, e pode usar a faixa inferior uma vez que a
faixa superior tenha sido esgotada. Os usuários podem então alocar da faixa inferior com menor risco de conflito de porta.

#### Configuração de endereço IP personalizado para Services `type: NodePort` {#service-nodeport-custom-listen-address}

Você pode configurar nós no seu cluster para usar um endereço IP específico para servir services de
node port. Você pode querer fazer isso se cada nó estiver conectado a múltiplas redes (por exemplo:
uma rede para tráfego de aplicação, e outra rede para tráfego entre nós e a
camada de gerenciamento).

Se você deseja especificar endereço(s) IP particular(es) para fazer proxy da porta, você pode definir a
flag `--nodeport-addresses` para o kube-proxy ou o campo equivalente `nodePortAddresses`
do [arquivo de configuração do kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
para bloco(s) de IP particular(es).

Esta flag recebe uma lista delimitada por vírgulas de blocos de IP (por exemplo, `10.0.0.0/8`, `192.0.2.0/25`)
para especificar intervalos de endereços IP que o kube-proxy deve considerar como locais para este nó.

Por exemplo, se você iniciar o kube-proxy com a flag `--nodeport-addresses=127.0.0.0/8`,
o kube-proxy seleciona apenas a interface de loopback para Services NodePort.
O padrão para `--nodeport-addresses` é uma lista vazia.
Isso significa que o kube-proxy deve considerar todas as interfaces de rede disponíveis para NodePort.
(Isso também é compatível com versões anteriores do Kubernetes.)
{{< note >}}
Este Service é visível como `<NodeIP>:spec.ports[*].nodePort` e `.spec.clusterIP:spec.ports[*].port`.
Se a flag `--nodeport-addresses` para o kube-proxy ou o campo equivalente
no arquivo de configuração do kube-proxy estiver definida, `<NodeIP>` seria um
endereço IP de nó filtrado (ou possivelmente endereços IP).
{{< /note >}}

### `type: LoadBalancer` {#loadbalancer}

Em provedores de nuvem que suportam balanceadores de carga externos, definir o campo `type`
como `LoadBalancer` provisiona um balanceador de carga para o seu Service.
A criação real do balanceador de carga acontece de forma assíncrona, e
informações sobre o balanceador provisionado são publicadas no campo
`.status.loadBalancer` do Service.
Por exemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

O tráfego do balanceador de carga externo é direcionado aos Pods de backend. O provedor de
nuvem decide como é feito o balanceamento de carga.

Para implementar um Service do `type: LoadBalancer`, o Kubernetes normalmente começa
fazendo as alterações que são equivalentes a você solicitar um Service com
`type: NodePort`. O componente cloud-controller-manager então configura o balanceador de
carga externo para encaminhar o tráfego para essa porta de nó atribuída.

Você pode configurar um Service com balanceamento de carga para
[omitir](#load-balancer-nodeport-allocation) a atribuição de uma porta de nó, desde que a
implementação do provedor de nuvem suporte isso.

Alguns provedores de nuvem permitem que você especifique o `loadBalancerIP`. Nesses casos, o balanceador de carga é criado
com o `loadBalancerIP` especificado pelo usuário. Se o campo `loadBalancerIP` não for especificado,
o balanceador de carga é configurado com um endereço IP efêmero. Se você especificar um `loadBalancerIP`
mas seu provedor de nuvem não suportar a funcionalidade, o campo `loadbalancerIP` que você
definiu é ignorado.


{{< note >}}
O campo `.spec.loadBalancerIP` para um Service foi descontinuado no Kubernetes v1.24.

Este campo foi subespecificado e seu significado varia entre as implementações.
Ele também não pode suportar rede dual-stack. Este campo pode ser removido em uma versão futura da API.

Se você está integrando com um provedor que suporta especificar o(s) endereço(s) IP do balanceador de carga
para um Service via uma anotação (específica do provedor), você deve mudar para fazer isso.

Se você está escrevendo código para uma integração de balanceador de carga com o Kubernetes, evite usar este campo.
Você pode integrar com [Gateway](https://gateway-api.sigs.k8s.io/) em vez de Service, ou pode
definir suas próprias anotações (específicas do provedor) no Service que especificam o detalhe equivalente.
{{< /note >}}

#### Impacto da operacionalidade do nó no tráfego do balanceador de carga

As verificações de integridade do balanceador de carga são críticas para aplicações modernas. Elas são usadas para
determinar para qual servidor (máquina virtual ou endereço IP) o balanceador de carga deve
despachar o tráfego. As APIs do Kubernetes não definem como as verificações de integridade devem ser
implementadas para balanceadores de carga gerenciados pelo Kubernetes, em vez disso, são os provedores de nuvem
(e as pessoas implementando código de integração) que decidem sobre o comportamento. As
verificações de integridade do balanceador de carga são extensivamente usadas no contexto de suportar o
campo `externalTrafficPolicy` para Services.

#### Balanceadores de carga com tipos de protocolo mistos

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

Por padrão, para Services do tipo LoadBalancer, quando há mais de uma porta definida, todas
as portas devem ter o mesmo protocolo, e o protocolo deve ser um que seja suportado
pelo provedor de nuvem.

O feature gate `MixedProtocolLBService` (habilitado por padrão para o kube-apiserver a partir da v1.24) permite o uso de
protocolos diferentes para Services do tipo LoadBalancer, quando há mais de uma porta definida.

{{< note >}}
O conjunto de protocolos que podem ser usados para Services com balanceamento de carga é definido pelo seu
provedor de nuvem; eles podem impor restrições além do que a API do Kubernetes impõe.
{{< /note >}}

#### Desabilitando a alocação de NodePort do balanceador de carga {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Você pode opcionalmente desabilitar a alocação de node port para um Service do `type: LoadBalancer`, definindo
o campo `spec.allocateLoadBalancerNodePorts` como `false`. Isso deve ser usado apenas para implementações de balanceador de carga
que roteiam tráfego diretamente para Pods em vez de usar node ports. Por padrão, `spec.allocateLoadBalancerNodePorts`
é `true` e Services do tipo LoadBalancer continuarão a alocar node ports. Se `spec.allocateLoadBalancerNodePorts`
for definido como `false` em um Service existente com node ports alocados, esses node ports **não** serão desalocados automaticamente.
Você deve remover explicitamente a entrada `nodePorts` em cada porta do Service para desalocar esses node ports.

#### Especificando a classe de implementação do balanceador de carga {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Para um Service com `type` definido como `LoadBalancer`, o campo `.spec.loadBalancerClass`
permite que você use uma implementação de balanceador de carga diferente do padrão do provedor de nuvem.

Por padrão, `.spec.loadBalancerClass` não está definido e um Service do
tipo `LoadBalancer` usa a implementação de balanceador de carga padrão do provedor de nuvem se o
cluster estiver configurado com um provedor de nuvem usando a flag de componente
`--cloud-provider`.

Se você especificar `.spec.loadBalancerClass`, presume-se que uma implementação de balanceador de carga
que corresponda à classe especificada esteja observando os Services.
Qualquer implementação de balanceador de carga padrão (por exemplo, a fornecida pelo
provedor de nuvem) ignorará Services que tenham este campo definido.
`spec.loadBalancerClass` pode ser definido apenas em um Service do tipo `LoadBalancer`.
Uma vez definido, não pode ser alterado.
O valor de `spec.loadBalancerClass` deve ser um identificador no estilo de rótulo,
com um prefixo opcional como "`internal-vip`" ou "`example.com/internal-vip`".
Nomes sem prefixo são reservados para usuários finais.

#### Modo do endereço IP do balanceador de carga {#load-balancer-ip-mode}

{{< feature-state feature_gate_name="LoadBalancerIPMode" >}}

Para um Service do `type: LoadBalancer`, um controlador pode definir `.status.loadBalancer.ingress.ipMode`. 
O `.status.loadBalancer.ingress.ipMode` especifica como o IP do balanceador de carga se comporta. 
Ele pode ser especificado apenas quando o campo `.status.loadBalancer.ingress.ip` também estiver especificado.

Existem dois valores possíveis para `.status.loadBalancer.ingress.ipMode`: "VIP" e "Proxy". 
O valor padrão é "VIP", significando que o tráfego é entregue ao nó 
com o destino definido para o IP e porta do balanceador de carga. 
Existem dois casos ao definir isso como "Proxy", dependendo de como o balanceador de carga 
do provedor de nuvem entrega o tráfego:  

- Se o tráfego é entregue ao nó e então sofre DNAT para o Pod, o destino seria definido para o IP do nó e a node port;
- Se o tráfego é entregue diretamente ao Pod, o destino seria definido para o IP e porta do Pod.

Implementações de Service podem usar esta informação para ajustar o roteamento de tráfego.

#### Balanceador de carga interno

Em um ambiente misto, às vezes é necessário rotear o tráfego de Services dentro do mesmo
bloco de endereço de rede (virtual).

Em um ambiente DNS split-horizon, você precisaria de dois Services para poder rotear tanto o tráfego externo
quanto o interno para seus endpoints.

Para definir um balanceador de carga interno, adicione uma das seguintes anotações ao seu Service
dependendo do provedor de serviço de nuvem que você está usando:

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Select one of the tabs.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

Services do tipo ExternalName mapeiam um Service para um nome DNS, não para um seletor típico como
`my-service` ou `cassandra`. Você especifica esses Services com o parâmetro `spec.externalName`.

Esta definição de Service, por exemplo, mapeia
o Service `my-service` no namespace `prod` para `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
Um Service do `type: ExternalName` aceita uma string de endereço IPv4,
mas trata essa string como um nome DNS composto por dígitos,
não como um endereço IP (a internet, no entanto, não permite tais nomes em DNS).
Services com nomes externos que se assemelham a endereços IPv4
não são resolvidos por servidores DNS.

Se você deseja mapear um Service diretamente para um endereço IP específico, considere usar
[headless Services](#headless-services).
{{< /note >}}

Ao procurar o host `my-service.prod.svc.cluster.local`, o Service DNS do cluster
retorna um registro `CNAME` com o valor `my.database.example.com`. Acessar
`my-service` funciona da mesma forma que outros Services, mas com a
diferença crucial de que o redirecionamento acontece no nível DNS em vez de via proxy ou
encaminhamento. Se você decidir posteriormente mover seu banco de dados para dentro do seu cluster, você
pode iniciar seus Pods, adicionar seletores ou endpoints apropriados, e alterar o
`type` do Service.

{{< caution >}}
Você pode ter problemas ao usar ExternalName para alguns protocolos comuns, incluindo HTTP e HTTPS.
Se você usar ExternalName, então o nome do host usado pelos clientes dentro do seu cluster é diferente do
nome que o ExternalName referencia.

Para protocolos que usam nomes de host, essa diferença pode levar a erros ou respostas inesperadas.
Requisições HTTP terão um cabeçalho `Host:` que o servidor de origem não reconhece;
servidores TLS não serão capazes de fornecer um certificado correspondente ao nome do host ao qual o cliente se conectou.
{{< /caution >}}

## Headless Services

Às vezes você não precisa de balanceamento de carga e um único IP de Service. Neste
caso, você pode criar o que são chamados de _headless Services_, especificando explicitamente
`"None"` para o endereço IP do cluster (`.spec.clusterIP`).

Você pode usar um headless Service para fazer interface com outros mecanismos de descoberta de serviços,
sem estar vinculado à implementação do Kubernetes.

Para headless Services, um IP de cluster não é alocado, o kube-proxy não manipula
esses Services, e não há balanceamento de carga ou proxy feito pela plataforma para eles.

Um headless Service permite que um cliente se conecte a qualquer Pod que preferir, diretamente. Headless Services não
configuram rotas e encaminhamento de pacotes usando
[endereços IP virtuais e proxies](/docs/reference/networking/virtual-ips/); em vez disso, Headless Services reportam os
endereços IP de endpoint dos Pods individuais via registros DNS internos, servidos através do
[serviço DNS](/docs/concepts/services-networking/dns-pod-service/) do cluster.
Para definir um headless Service, você cria um Service com `.spec.type` definido como ClusterIP (que também é o padrão para `type`),
e você adicionalmente define `.spec.clusterIP` como None.

O valor de string None é um caso especial e não é o mesmo que deixar o campo `.spec.clusterIP` não definido.

Como o DNS é configurado automaticamente depende se o Service tem seletores definidos:

### Com seletores

Para headless Services que definem seletores, o controlador de endpoints cria
EndpointSlices na API do Kubernetes, e modifica a configuração DNS para retornar
registros A ou AAAA (endereços IPv4 ou IPv6) que apontam diretamente para os Pods que sustentam o Service.

### Sem seletores

Para headless Services que não definem seletores, a camada de gerenciamento não
cria objetos EndpointSlice. No entanto, o sistema DNS procura e configura
um dos seguintes:

* Registros DNS CNAME para Services [`type: ExternalName`](#externalname).
* Registros DNS A / AAAA para todos os endereços IP dos endpoints prontos do Service,
  para todos os tipos de Service diferentes de `ExternalName`.
  * Para endpoints IPv4, o sistema DNS cria registros A.
  * Para endpoints IPv6, o sistema DNS cria registros AAAA.

Quando você define um headless Service sem seletor, a `port` deve
corresponder à `targetPort`.

## Descobrindo Services {#discovering-services}

Para clientes em execução dentro do seu cluster, o Kubernetes suporta dois modos principais de
encontrar um Service: variáveis de ambiente e DNS.

### Variáveis de ambiente

Quando um Pod é executado em um Node, o kubelet adiciona um conjunto de variáveis de ambiente
para cada Service ativo. Ele adiciona as variáveis `{SVCNAME}_SERVICE_HOST` e `{SVCNAME}_SERVICE_PORT`,
onde o nome do Service está em maiúsculas e os traços são convertidos em sublinhados.


Por exemplo, o Service `redis-primary` que expõe a porta TCP 6379 e recebeu
o endereço IP de cluster 10.0.0.11, produz as seguintes variáveis de
ambiente:

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Quando você tem um Pod que precisa acessar um Service, e você está usando
o método de variável de ambiente para publicar a porta e o IP do cluster para os Pods
clientes, você deve criar o Service *antes* dos Pods clientes existirem.
Caso contrário, esses Pods clientes não terão suas variáveis de ambiente preenchidas.

Se você usar apenas DNS para descobrir o IP do cluster para um Service, você não precisa
se preocupar com esse problema de ordenação.
{{< /note >}}

O Kubernetes também suporta e fornece variáveis que são compatíveis com a funcionalidade
"_[legacy container links](https://docs.docker.com/network/links/)_" do Docker
Engine. Você pode ler [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
para ver como isso é implementado no Kubernetes.

### DNS

Você pode (e quase sempre deveria) configurar um serviço DNS para o seu cluster
Kubernetes usando um [complemento](/docs/concepts/cluster-administration/addons/).

Um servidor DNS com reconhecimento de cluster, como o CoreDNS, observa a API do Kubernetes em busca de novos
Services e cria um conjunto de registros DNS para cada um. Se o DNS foi habilitado
em todo o seu cluster, então todos os Pods devem ser capazes automaticamente de resolver
Services por seu nome DNS.

Por exemplo, se você tem um Service chamado `my-service` em um
namespace `my-ns` do Kubernetes, a camada de gerenciamento e o Service DNS atuando juntos
criam um registro DNS para `my-service.my-ns`. Os Pods no namespace `my-ns`
devem ser capazes de encontrar o service fazendo uma busca de nome por `my-service`
(`my-service.my-ns` também funcionaria).

Pods em outros namespaces devem qualificar o nome como `my-service.my-ns`. Esses nomes
resolverão para o IP do cluster atribuído ao Service.

O Kubernetes também suporta registros DNS SRV (Service) para portas nomeadas. Se o
Service `my-service.my-ns` tiver uma porta chamada `http` com o protocolo definido como
`TCP`, você pode fazer uma consulta DNS SRV para `_http._tcp.my-service.my-ns` para descobrir
o número da porta para `http`, bem como o endereço IP.

O servidor DNS do Kubernetes é a única maneira de acessar Services `ExternalName`.
Você pode encontrar mais informações sobre resolução `ExternalName` em
[DNS para Services e Pods](/docs/concepts/services-networking/dns-pod-service/).

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## Mecanismo de endereçamento de IP virtual

Leia [IPs Virtuais e Proxies de Service](/docs/reference/networking/virtual-ips/) que explica o
mecanismo que o Kubernetes fornece para expor um Service com um endereço IP virtual.

### Políticas de tráfego

Você pode definir os campos `.spec.internalTrafficPolicy` e `.spec.externalTrafficPolicy`
para controlar como o Kubernetes roteia o tráfego para backends íntegros ("prontos").

Consulte [Políticas de Tráfego](/docs/reference/networking/virtual-ips/#traffic-policies) para mais detalhes.

### Distribuição de tráfego {#traffic-distribution}

{{< feature-state feature_gate_name="ServiceTrafficDistribution" >}}

O campo `.spec.trafficDistribution` fornece outra maneira de influenciar o
roteamento de tráfego dentro de um Service do Kubernetes. Enquanto as políticas de tráfego focam em garantias
semânticas estritas, a distribuição de tráfego permite que você expresse _preferências_
(como rotear para endpoints topologicamente mais próximos). Isso pode ajudar a otimizar
desempenho, custo ou confiabilidade. No Kubernetes {{< skew currentVersion >}}, o
seguinte valor de campo é suportado: 

`PreferClose`
: Indica uma preferência por rotear o tráfego para endpoints que estão na mesma
  zona que o cliente.

{{< feature-state feature_gate_name="PreferSameTrafficDistribution" >}}

No Kubernetes {{< skew currentVersion >}}, dois valores adicionais estão
disponíveis (a menos que o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PreferSameTrafficDistribution` esteja
desabilitado):

`PreferSameZone`
: Este é um alias para `PreferClose` que é mais claro sobre a semântica pretendida.

`PreferSameNode`
: Indica uma preferência por rotear o tráfego para endpoints que estão no mesmo
  nó que o cliente.

Se o campo não for definido, a implementação aplicará sua estratégia de roteamento padrão.

Consulte [Distribuição de
Tráfego](/docs/reference/networking/virtual-ips/#traffic-distribution) para
mais detalhes.

### Persistência de sessão

Se você quiser garantir que as conexões de um cliente específico sejam passadas para
o mesmo Pod a cada vez, você pode configurar afinidade de sessão baseada no endereço
IP do cliente. Leia [afinidade de sessão](/docs/reference/networking/virtual-ips/#session-affinity)
para saber mais.

## IPs externos

Se houver IPs externos que roteiam para um ou mais nós do cluster, os Services do Kubernetes
podem ser expostos nesses `externalIPs`. Quando o tráfego de rede chega ao cluster, com
o IP externo (como IP de destino) e a porta correspondente a esse Service, regras e rotas
que o Kubernetes configurou garantem que o tráfego seja roteado para um dos endpoints
desse Service.

Quando você define um Service, você pode especificar `externalIPs` para qualquer
[tipo de Service](#publishing-services-service-types).
No exemplo abaixo, o Service chamado `"my-service"` pode ser acessado por clientes usando TCP,
em `"198.51.100.32:80"` (calculado a partir de `.spec.externalIPs[]` e `.spec.ports[].port`).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
O Kubernetes não gerencia a alocação de `externalIPs`; estes são de responsabilidade
do administrador do cluster.
{{< /note >}}

## Objeto da API

Service é um recurso de nível superior na API REST do Kubernetes. Você pode encontrar mais detalhes
sobre o [objeto da API Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## {{% heading "whatsnext" %}}

Saiba mais sobre Services e como eles se encaixam no Kubernetes:

* Siga o tutorial [Conectando Aplicações com Services](/docs/tutorials/services/connect-applications-service/).
* Leia sobre [Ingress](/docs/concepts/services-networking/ingress/), que
  expõe rotas HTTP e HTTPS de fora do cluster para Services dentro
  do seu cluster.
* Leia sobre [Gateway](/docs/concepts/services-networking/gateway/), uma extensão do
  Kubernetes que fornece mais flexibilidade do que o Ingress.

Para mais contexto, leia o seguinte:

* [IPs Virtuais e Proxies de Service](/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* [Referência da API Service](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [Referência da API EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Referência da API Endpoint (legado)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
