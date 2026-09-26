---
title: Gateway API
content_type: concept
description: >-
  O Gateway API é uma família de tipos de API que fornecem provisionamento dinâmico de infraestrutura e roteamento avançado de tráfego.
weight: 55
---

<!-- overview -->

Disponibilize serviços de rede usando um mecanismo de configuração extensível, orientado
a funções e com reconhecimento de protocolo. O [Gateway API](https://gateway-api.sigs.k8s.io/)
é um {{<glossary_tooltip text="complemento" term_id="addons">}} contendo [tipos de objetos](https://gateway-api.sigs.k8s.io/references/spec/)
da API que fornecem provisionamento dinâmico de infraestrutura e roteamento avançado de tráfego.

<!-- body -->

## Princípios de design

Os seguintes princípios moldaram o design e a arquitetura do Gateway API:

* __Orientado a funções:__ Os tipos do Gateway API são modelados com base em funções organizacionais que são
  responsáveis por gerenciar a rede de serviços do Kubernetes:
  * __Provedor de Infraestrutura:__ Gerencia a infraestrutura que permite que múltiplos clusters isolados
    atendam múltiplos locatários, por exemplo, um provedor de nuvem.
  * __Operador de Cluster:__ Gerencia clusters e normalmente está preocupado com políticas, acesso à rede,
    permissões de aplicações, etc.
  * __Desenvolvedor de Aplicações:__ Gerencia uma aplicação em execução em um cluster e normalmente está
    preocupado com configurações no nível da aplicação e composição de [Service](/docs/concepts/services-networking/service/).
* __Portável:__ As especificações do Gateway API são definidas como [recursos personalizados](/docs/concepts/extend-kubernetes/api-extension/custom-resources)
  e são suportadas por muitas [implementações](https://gateway-api.sigs.k8s.io/implementations/).
* __Expressivo:__ Os tipos do Gateway API suportam funcionalidades para casos de uso comuns de roteamento de tráfego,
  como correspondência baseada em cabeçalhos, ponderação de tráfego, e outros que só eram possíveis no
  [Ingress](/docs/concepts/services-networking/ingress/) usando anotações personalizadas.
* __Extensível:__ O Gateway API permite que recursos personalizados sejam vinculados em várias camadas da API.
  Isso torna possível a personalização granular nos locais apropriados dentro da estrutura da API.

## Modelo de recursos

O Gateway API possui quatro tipos de API estáveis:

* __GatewayClass:__ Define um conjunto de gateways com configuração comum e gerenciados por um controlador
  que implementa a classe.

* __Gateway:__ Define uma instância de infraestrutura de manipulação de tráfego, como um balanceador de carga em nuvem.

* __HTTPRoute:__ Define regras específicas de HTTP para mapear o tráfego de um ponto de entrada do Gateway para uma
  representação de endpoints de rede de backend. Esses endpoints geralmente são representados como um
  {{<glossary_tooltip text="Service" term_id="service">}}.

* __GRPCRoute:__ Define regras específicas de gRPC para mapear o tráfego de um ponto de entrada do Gateway para uma
representação de endpoints de rede de backend. Esses endpoints geralmente são representados como um
  {{<glossary_tooltip text="Service" term_id="service">}}.

O Gateway API é organizado em diferentes tipos de API que possuem relacionamentos interdependentes para suportar
a natureza orientada a funções das organizações. Um objeto Gateway está associado a exatamente um GatewayClass;
o GatewayClass descreve o controlador de gateway responsável por gerenciar Gateways desta classe.
Um ou mais tipos de rota, como HTTPRoute, são então associados aos Gateways. Um Gateway pode filtrar as rotas
que podem ser anexadas aos seus `listeners`, formando um modelo de confiança bidirecional com as rotas.

A figura a seguir ilustra os relacionamentos dos três tipos estáveis do Gateway API:

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="Uma figura ilustrando os relacionamentos dos três tipos estáveis do Gateway API" class="diagram-medium" >}}

### GatewayClass {#api-kind-gateway-class}

Gateways podem ser implementados por diferentes controladores, frequentemente com diferentes configurações. Um Gateway
deve referenciar uma GatewayClass que contenha o nome do controlador que implementa a classe.

Um exemplo mínimo de GatewayClass:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

Neste exemplo, um controlador que implementou o Gateway API está configurado para gerenciar GatewayClasses
com o nome de controlador `example.com/gateway-controller`. Gateways desta classe serão gerenciados pelo
controlador da implementação.

Consulte a referência de [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)
para uma definição completa deste tipo de API.

### Gateway {#api-kind-gateway}

Um Gateway descreve uma instância de infraestrutura de manipulação de tráfego. Ele define um endpoint de rede
que pode ser usado para processar o tráfego, ou seja, filtragem, balanceamento, divisão, etc. para backends
como um Service. Por exemplo, um Gateway pode representar um balanceador de carga em nuvem ou um servidor proxy
dentro do cluster que está configurado para aceitar tráfego HTTP.

Um exemplo mínimo de Gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

Neste exemplo, uma instância de infraestrutura de manipulação de tráfego é programada para escutar o tráfego HTTP
na porta 80. Como o campo `addresses` não está especificado, um endereço ou nome de host é atribuído
ao Gateway pelo controlador da implementação. Este endereço é usado como um endpoint de rede para
processar o tráfego de endpoints de rede de backend definidos nas rotas.

Consulte a referência de [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)
para uma definição completa deste tipo de API.

### HTTPRoute {#api-kind-httproute}

O tipo HTTPRoute especifica o comportamento de roteamento de requisições HTTP de um ouvinte do Gateway para endpoints de rede
de backend. Para um backend do tipo Service, uma implementação pode representar o endpoint de rede de backend como um IP do Service
ou os EndpointSlices subjacentes do Service. Um HTTPRoute representa a configuração que é aplicada à
implementação subjacente do Gateway. Por exemplo, definir um novo HTTPRoute pode resultar na configuração de
rotas de tráfego adicionais em um balanceador de carga em nuvem ou servidor proxy dentro do cluster.

Um exemplo mínimo de HTTPRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

Neste exemplo, o tráfego HTTP do Gateway `example-gateway` com o cabeçalho Host: definido como `www.example.com`
e o caminho da requisição especificado como `/login` será roteado para o Service `example-svc` na porta `8080`.

Consulte a referência de [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)
para uma definição completa deste tipo de API.


### GRPCRoute {#api-kind-grpcroute}

O tipo GRPCRoute especifica o comportamento de roteamento de requisições gRPC de um ouvinte do Gateway para endpoints de rede
de backend. Para um backend do tipo Service, uma implementação pode representar o endpoint de rede de backend como um IP do Service
ou os EndpointSlices subjacentes do Service. Um GRPCRoute representa a configuração que é aplicada à
implementação subjacente do Gateway. Por exemplo, definir um novo GRPCRoute pode resultar na configuração de
rotas de tráfego adicionais em um balanceador de carga em nuvem ou servidor proxy dentro do cluster.

Gateways que suportam GRPCRoute são obrigados a suportar HTTP/2 sem uma atualização inicial do HTTP/1,
portanto, o tráfego gRPC tem o fluxo garantido adequadamente.

Um exemplo mínimo de GRPCRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 50051
```

Neste exemplo, o tráfego gRPC do Gateway `example-gateway` com o host definido como `svc.example.com`
será direcionado para o serviço `example-svc` na porta `50051` do mesmo namespace.

O GRPCRoute permite a correspondência de serviços gRPC específicos, conforme o seguinte exemplo:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - matches:
    - method:
        service: com.example
        method: Login
    backendRefs:
    - name: foo-svc
      port: 50051
```

Neste caso, o GRPCRoute corresponderá a qualquer tráfego para svc.example.com e aplicará suas regras de roteamento
para encaminhar o tráfego para o backend correto. Como há apenas uma correspondência especificada, somente requisições
para o método com.example.User.Login para svc.example.com serão encaminhadas.
RPCs de qualquer outro método não serão correspondidos por esta Rota.

Consulte a referência de [GRPCRoute](https://gateway-api.sigs.k8s.io/reference/spec/#grpcroute)
para uma definição completa deste tipo de API.

## Fluxo de requisição

Aqui está um exemplo simples de tráfego HTTP sendo roteado para um Service usando um Gateway e um HTTPRoute:

{{< figure src="/docs/images/gateway-request-flow.svg" alt="Um diagrama que fornece um exemplo de tráfego HTTP sendo roteado para um Service usando um Gateway e um HTTPRoute" class="diagram-medium" >}}

Neste exemplo, o fluxo de requisição para um Gateway implementado como um proxy reverso é:

1. O cliente começa a preparar uma requisição HTTP para a URL `http://www.example.com`
2. O resolvedor DNS do cliente consulta o nome de destino e aprende um mapeamento para
   um ou mais endereços IP associados ao Gateway.
3. O cliente envia uma requisição para o endereço IP do Gateway; o proxy reverso recebe a requisição
   HTTP e usa o cabeçalho Host: para corresponder a uma configuração que foi derivada do Gateway
   e do HTTPRoute anexado.
4. Opcionalmente, o proxy reverso pode realizar correspondência de cabeçalho de requisição e/ou caminho com base
   nas regras de correspondência do HTTPRoute.
5. Opcionalmente, o proxy reverso pode modificar a requisição; por exemplo, para adicionar ou remover cabeçalhos,
   com base nas regras de filtro do HTTPRoute.
6. Por fim, o proxy reverso encaminha a requisição para um ou mais backends.

## Conformidade

O Gateway API cobre um amplo conjunto de funcionalidades e é amplamente implementado. Esta combinação requer
definições e testes de conformidade claros para garantir que a API forneça uma experiência consistente
onde quer que seja usada.

Consulte a documentação de [conformidade](https://gateway-api.sigs.k8s.io/concepts/conformance/) para
entender detalhes como canais de lançamento, níveis de suporte e execução de testes de conformidade.

## Migrando do Ingress

O Gateway API é o sucessor da API [Ingress](/docs/concepts/services-networking/ingress/).
No entanto, ele não inclui o tipo Ingress. Como resultado, é necessária uma conversão única dos seus
recursos Ingress existentes para recursos do Gateway API.

Consulte o guia de [migração do ingress](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress)
para detalhes sobre como migrar recursos Ingress para recursos do Gateway API.

## {{% heading "whatsnext" %}}

Em vez de os recursos do Gateway API serem implementados nativamente pelo Kubernetes, as especificações
são definidas como [Recursos Personalizados](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
suportados por uma ampla variedade de [implementações](https://gateway-api.sigs.k8s.io/implementations/).
[Instale](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) os CRDs do Gateway API ou
siga as instruções de instalação da sua implementação selecionada. Após instalar uma
implementação, use o guia [Getting Started](https://gateway-api.sigs.k8s.io/guides/) para ajudá-lo
a começar rapidamente a trabalhar com o Gateway API.

{{< note >}}
Certifique-se de revisar a documentação da sua implementação selecionada para entender quaisquer ressalvas.
{{< /note >}}

Consulte a [especificação da API](https://gateway-api.sigs.k8s.io/reference/spec/) para detalhes
adicionais de todos os tipos do Gateway API.
