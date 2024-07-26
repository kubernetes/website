---
title: Ingress
content_type: concept
description: >-
  Disponibilize seu serviço de rede HTTP ou HTTPS usando um mecanismo de configuração com reconhecimento de protocolo, que entende conceitos da Web como URIs, nomes de host, caminhos e muito mais. 
  O conceito Ingress permite mapear o tráfego para diferentes backends com base nas regras definidas por meio da API do Kubernetes.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}


<!-- body -->

## Terminologia

Para fins de clareza, este guia define os seguintes termos:

* Nó: Uma máquina de trabalho no Kubernetes, parte de um cluster.
* Cluster: Um conjunto de nós que executam aplicações em contêiner gerenciado pelo Kubernetes. Para este exemplo, e nas instalações mais comuns do Kubernetes, os nós no cluster não fazem parte da Internet pública.
* Roteador de borda: Um roteador que impõe a política de firewall para o seu cluster. Isso pode ser um gateway gerenciado por um provedor de nuvem ou um hardware físico.
* Rede do cluster: Um conjunto de links, lógicos ou físicos, que facilitam a comunicação dentro de um cluster de acordo com o [modelo de rede](/pt-br/docs/concepts/cluster-administration/networking/) do Kubernetes.
* Serviço: Um objeto {{< glossary_tooltip text="serviço" term_id="service" >}} do Kubernetes que identifica um conjunto de Pods usando seletores de {{< glossary_tooltip text="label" term_id="label" >}}. Salvo indicação em contrário, assume-se que os Serviços tenham IPs virtuais apenas roteáveis dentro da rede de cluster.


## O que é o Ingress?

O [Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io) expõe rotas HTTP e HTTPS de fora do cluster para um {{< link text="serviço" url="/docs/concepts/services-networking/service/" >}} dentro do cluster.
O roteamento do tráfego é controlado por regras definidas no recurso Ingress.

Aqui está um exemplo simples em que o Ingress envia todo o seu tráfego para um serviço:

{{< figure src="/docs/images/ingress.svg" alt=" diagrama do Ingress" class="diagram-large" caption="Figura. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

Um Ingress pode ser configurado para fornecer URLs acessíveis externamente aos serviços, balanceamento de carga de tráfego, terminação SSL/TLS e oferecer hospedagem virtual baseada em nome.
Um [controlador Ingress](/docs/concepts/services-networking/ingress-controllers) é responsável por atender o Ingress, geralmente com um balanceador de carga, embora também possa configurar seu roteador de borda ou frontends adicionais para ajudar a lidar com o tráfego.

Um Ingress não expõe portas ou protocolos arbitrários. 
Normalmente se usa um serviço do tipo [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) ou [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) para expor serviços à Internet que não sejam HTTP e HTTPS.

## Pré-requisitos

Você deve ter um [controlador Ingress](/docs/concepts/services-networking/ingress-controllers) para satisfazer um Ingress. 
Apenas a criação de um recurso Ingress não tem efeito.

Você pode precisar instalar um controlador Ingress, como [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). 
Você pode escolher entre vários [controladores Ingress](/docs/concepts/services-networking/ingress-controllers).

Idealmente, todos os controladores Ingress devem se encaixar na especificação de referência. 
Na realidade, os vários controladores Ingress operam de forma ligeiramente diferente.

{{< note >}}
Certifique-se de revisar a documentação do seu controlador Ingress para entender as ressalvas de escolhê-lo.
{{< /note >}}

## O recurso Ingress

Um exemplo mínimo do recurso Ingress:

{{% codenew file="service/networking/minimal-ingress.yaml" %}}

Um Ingress precisa dos campos `apiVersion`, `kind`, `metadata` e `spec`. 
O nome de um objeto Ingress deve ser um nome de [subdomínio DNS válido](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). 
Para obter informações gerais sobre como trabalhar com arquivos de configuração, consulte como [instalar aplicações](/docs/tasks/run-application/run-stateless-application-deployment/), como [configurar contêineres](/docs/tasks/configure-pod-container/configure-pod-configmap/) e como [gerenciar recursos](/docs/concepts/cluster-administration/manage-deployment/). 
O Ingress frequentemente usa anotações para configurar opções dependendo do controlador Ingress. Um exemplo deste uso é a [anotação rewrite-target](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md). 
Diferentes [controladores Ingress](/docs/concepts/services-networking/ingress-controllers) suportam diferentes anotações. 
Revise a documentação do seu controlador Ingress escolhido para saber quais anotações são suportadas.

A [especificação](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) Ingress tem todas as informações necessárias para configurar um balanceador de carga ou servidor proxy. 
Mais importante ainda, ele contém uma lista de regras correspondentes a todas as solicitações recebidas. 
O recurso Ingress suporta apenas regras para direcionar o tráfego HTTP(S).

Se o `ingressClassName` for omitido, uma [classe Ingress padrão](#default-ingress-class) deve ser definida.

Existem alguns controladores Ingress que funcionam sem a definição de uma `IngressClass` padrão. 
Por exemplo, o controlador Ingress-NGINX pode ser configurado com uma [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class) `--watch-ingress-without-class`. 
No entanto, [recomenda-se](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do) especificar a `IngressClass` padrão, conforme mostrado [abaixo](#default-ingress-class).

### Regras do Ingress

Cada regra HTTP contém as seguintes informações:
* Um host opcional. Neste exemplo, nenhum host é especificado, portanto, a regra se aplica a todo o tráfego HTTP de entrada através do endereço IP especificado. 
Se um host for fornecido (por exemplo, foo.bar.com), as regras se aplicam a esse host.
* Uma lista de caminhos (por exemplo, `/testpath`), cada um com um backend associado definido com um `service.name` e um `service.port.name` ou `service.port.number`. 
Tanto o host quanto o caminho devem corresponder ao conteúdo de uma solicitação recebida antes que o balanceador de carga direcione o tráfego para o serviço referenciado.
* Um backend é uma combinação de nomes de serviço e porta, conforme descrito na [documentação de Services](/docs/concepts/services-networking/service/) ou um [backend de recursos personalizados](#resource-backend) por meio de um {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. 
As solicitações HTTP e HTTPS para o Ingress que correspondem ao host e ao caminho da regra são enviadas para o backend listado.

Um `defaultBackend` geralmente é configurado em um controlador Ingress para atender a quaisquer solicitações que não correspondam a um caminho na especificação.

### DefaultBackend {#default-backend}

Um Ingress sem regras envia todo o tráfego para um único backend padrão e `.spec.defaultBackend` é o backend que deve lidar com as solicitações nesse caso. 
O `defaultBackend` é convencionalmente uma opção de configuração do [controlador Ingress](/docs/concepts/services-networking/ingress-controllers) e não é especificado em seus recursos Ingress. 
Se nenhum `.spec.rules` for especificado, o `.spec.defaultBackend` deve ser especificado. 
Se o `defaultBackend` não for definido, o tratamento de solicitações que não correspondem a nenhuma das regras ficará a cargo do controlador de Ingress (consulte a documentação do seu controlador de Ingress para descobrir como ele lida com esse caso).

Se nenhum dos hosts ou caminhos corresponder à solicitação HTTP nos objetos Ingress, o tráfego será roteado para o seu backend padrão.

### Resource backends {#resource-backend}

Um `Resource` backend é um ObjectRef para outro recurso Kubernetes dentro do mesmo namespace que o objeto Ingress. 
Um `Resource` é uma configuração mutuamente exclusiva com o serviço, e a validação irá falhar se ambos forem especificados. 
Um uso comum para um `Resource` backend é inserir dados em um backend de armazenamento de objetos com ativos estáticos.

{{% codenew file="service/networking/ingress-resource-backend.yaml" %}}

Depois de criar o Ingress acima, você pode visualizá-lo com o seguinte comando:

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Tipos de path HTTP

Cada caminho no Ingress deve ter um tipo de caminho correspondente. 
Os caminhos que não incluem um `pathType` explícito falharão na validação. 
Existem três tipos de caminho suportados:

* `ImplementationSpecific`: Com esse tipo de caminho, a correspondência depende da IngressClass. As implementações podem tratar isso como um `pathType` separado ou tratá-lo de forma idêntica aos tipos de caminho `Prefix` ou `Exact`.
* `Exact`: Corresponde exatamente ao caminho da URL podendo ser _case-sensitive_.
* `Prefix`: Corresponde com base em um prefixo de caminho de URL dividido por `/`. A correspondência faz distinção entre maiúsculas e minúsculas e é feita em um caminho, elemento por elemento. Um elemento de caminho refere-se à lista de labels no caminho dividido pelo separador `/`. Uma solicitação é uma correspondência para o caminho _p_ se cada _p_ for um prefixo elementar de _p_ do caminho da solicitação.

{{< note >}} Se o último elemento do caminho for uma substring do último elemento no caminho da solicitação, não é uma correspondência (por exemplo: `/foo/bar` corresponde a `/foo/bar/baz`, mas não corresponde a `/foo/barbaz`). {{< /note >}}

### Exemplos

| Tipos   | Caminho(s)                         | Caminho(s) de solicitação               | Correspondências?                           |
|---------|----------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                              | (todos os caminhos)           | Sim                                |
| Exact   | `/foo`                           | `/foo`                        | Sim                                |
| Exact   | `/foo`                           | `/bar`                        | Não                                |
| Exact   | `/foo`                           | `/foo/`                       | Não                                |
| Exact   | `/foo/`                          | `/foo`                        | Não                                |
| Prefix | `/foo`                           | `/foo`, `/foo/`               | Sim                                |
| Prefix | `/foo/`                          | `/foo`, `/foo/`               | Sim                                |
| Prefix | `/aaa/bb`                        | `/aaa/bbb`                    | Não                                |
| Prefix | `/aaa/bbb`                       | `/aaa/bbb`                    | Sim                                |
| Prefix | `/aaa/bbb/`                      | `/aaa/bbb`                    | Sim, ignora a barra final          |
| Prefix | `/aaa/bbb`                       | `/aaa/bbb/`                   | Sim, combina com a barra final     |
| Prefix | `/aaa/bbb`                       | `/aaa/bbb/ccc`                | Sim, corresponde ao subcaminho     |
| Prefix | `/aaa/bbb`                       | `/aaa/bbbxyz`                 | Não, não corresponde ao prefixo da string   |
| Prefix | `/`, `/aaa`                      | `/aaa/ccc`                    | Sim, corresponde ao prefixo `/aaa` |
| Prefix | `/`, `/aaa`, `/aaa/bbb`          | `/aaa/bbb`                    | Sim, corresponde ao prefixo `/aaa/bbb` |
| Prefix | `/`, `/aaa`, `/aaa/bbb`          | `/ccc`                        | Sim, corresponde ao prefixo `/`    |
| Prefix | `/aaa`                           | `/ccc`                        | Não, usa o backend padrão          |
| Mixed   | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | Sim, prefere o `exact`              |

#### Várias correspondências

Em alguns casos, vários caminhos dentro de uma entrada corresponderão a uma solicitação. 
Nesses casos, a precedência será dada primeiro ao caminho correspondente mais longo. 
Se dois caminhos ainda estiverem iguais, a precedência será dada aos caminhos com um tipo de caminho exato sobre o tipo de caminho de prefixo.

## Hostname curingas

Os hosts podem ter correspondências precisas (por exemplo, “foo.bar.com”) ou um curinga (por exemplo, “`*.foo.com`”). 
Correspondências precisas exigem que o cabeçalho do `host` HTTP corresponda ao campo `host`. 
As correspondências curinga exigem que o cabeçalho do `host` HTTP seja igual ao sufixo da regra curinga.


| Host        | Host header       | Corresponde?                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Correspondências baseadas no sufixo compartilhado                    |
| `*.foo.com` | `baz.bar.foo.com` | Sem correspondência, o curinga cobre apenas um único rótulo DNS |
| `*.foo.com` | `foo.com`         | Sem correspondência, o curinga cobre apenas um único rótulo DNS |

{{% codenew file="service/networking/ingress-wildcard-host.yaml" %}}

## Classe Ingress

Os Ingress podem ser implementados por diferentes controladores, muitas vezes com diferentes configurações. 
Cada Ingress deve especificar uma classe, uma referência a um recurso IngressClass que contém uma configuração adicional, incluindo o nome do controlador que deve implementar a classe.

{{% codenew file="service/networking/external-lb.yaml" %}}

O campo `.spec.parameters` de uma classe Ingress permite que você faça referência a outro recurso que fornece a configuração relacionada a essa classe Ingress.

O tipo específico de parâmetros a serem usados depende do controlador Ingress que você especificar no campo `.spec.controller` da classe Ingress.

### Escopo da classe Ingress

Dependendo do seu controlador Ingress, os parâmetros definidos em todo o cluster ou apenas para um namespace poderão ser utilizados.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Cluster" %}}
O escopo padrão para os parâmetros da classe Ingress é em todo o cluster.

Se você definir o campo `.spec.parameters` e não definir `.spec.parameters.scope`, ou se você definir `.spec.parameters.scope` como Cluster, então a classe Ingress se refere a um recurso com escopo de cluster. 
O `kind` (em combinação com o `apiGroup`) dos parâmetros refere-se a uma API com escopo de cluster (possivelmente um recurso personalizado), e o `name` dos parâmetros identifica um recurso específico com escopo de cluster para essa API.

Por exemplo:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # Os parâmetros para esta classe Ingress são especificados em um
    # ClusterIngressParameter (grupo de API k8s.example.net) nomeado
    # "external-config-1". Esta definição diz ao Kubernetes para
    # procurar um recurso de parâmetro com escopo de cluster.    
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```
{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}
Se você definir o campo `.spec.parameters` e definir `.spec.parameters.scope` como `Namespace`, a classe Ingress terá como referência um recurso com escopo de `namespace`. 
Você também deve definir o campo namespace dentro de `.spec.parameters` para o namespace que contém os parâmetros que deseja usar.

O campo `kind` (em combinação com o campo `apiGroup`) dos parâmetros refere-se a uma API com namespace (por exemplo: `ConfigMap`), e o campo `name` dos parâmetros identifica um recurso específico no namespace que você especificou no campo `namespace`.

Os parâmetros com escopo de namespace ajudam o operador de cluster a delegar o controle sobre a configuração (por exemplo: configurações do balanceador de carga, definição de gateway API) que é usada para uma carga de trabalho. 
Se você usou um parâmetro com escopo de cluster, então:

- A equipe do operador do cluster precisa aprovar as alterações de uma equipe diferente toda vez que houver uma nova alteração de configuração sendo aplicada.
- O operador de cluster deve definir controles de acesso específicos, como funções e vínculos [RBAC](/docs/reference/access-authn-authz/rbac/), que permitem que a equipe do aplicativo faça alterações no recurso de parâmetros do escopo do cluster.

A própria API do IngressClass é sempre com escopo de cluster.

Aqui está um exemplo de uma classe Ingress que se refere a parâmetros com namespace:
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in an
    # IngressParameter (API group k8s.example.com) named "external-config",
    # that's in the "external-configuration" namespace.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Anotação obsoleta

Antes que o recurso IngressClass e o campo `ingressClassName` fossem adicionados no Kubernetes 1.18, as classes Ingress foram especificadas com uma anotação `kubernetes.io/ingress.class` no Ingress. 
Esta anotação nunca foi formalmente definida, mas foi amplamente apoiada pelos controladores Ingress.

O campo `ingressClassName` mais recente no Ingress é um substituto para essa anotação, mas não é um equivalente direto. 
Embora a anotação tenha sido geralmente usada para fazer referência ao nome do controlador Ingress que deve implementar o Ingress, o campo é uma referência a um recurso IngressClass que contém a configuração Ingress adicional, incluindo o nome do controlador Ingress.

### Classe Ingress Padrão {#default-ingress-class}

Você pode marcar uma classe Ingress específica como padrão para o seu cluster. 
Definir a anotação `ingressclass.kubernetes.io/is-default-class` como `true` em um recurso IngressClass garantirá que novos Ingress sem um campo ingressClassName especificado sejam atribuídos a esta `ingressClassName` padrão.

{{< caution >}}
Se você tiver mais de uma classe Ingress marcada como padrão para o seu cluster, o controlador de admissão impede a criação de novos objetos Ingress que não tenham um `ingressClassName` especificado. 
Você pode resolver isso garantindo que no máximo uma classe Ingress seja marcada como padrão no seu cluster.
{{< /caution >}}
Existem alguns controladores Ingress que funcionam sem a definição de uma `IngressClass` padrão. 
Por exemplo, o controlador Ingress-NGINX pode ser configurado com uma [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class) `--watch-ingress-without-class`. 
No entanto, é [recomendável](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do) especificar a `IngressClass` padrão:

{{% codenew file="service/networking/default-ingressclass.yaml" %}}

## Tipos de Ingress

### Ingress fornecidos por um único serviço {#single-service-ingress}

No Kubernetes existem conceitos que permitem expor um único serviço (veja [alternativas](#alternatives)). 
Você também pode fazer isso com um Ingress especificando um *backend padrão* sem regras.

{{% codenew file="service/networking/test-ingress.yaml" %}}

Se você criá-lo usando `kubectl apply -f`, você deve ser capaz de visualizar o estado do Ingress que você adicionou:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Onde `203.0.113.123` é o IP alocado pelo controlador Ingress para satisfazer o Ingress.

{{< note >}}
Controladores Ingress e balanceadores de carga podem levar um ou dois minutos para alocar um endereço IP. 
Até aquele momento, você costuma ver o endereço listado como `<pending>`.
{{< /note >}}

### Simples fanout

Uma configuração de fanout roteia o tráfego de um único endereço IP para mais de um serviço, com base na URI HTTP que está sendo solicitada. 
Um Ingress permite que você mantenha o número de balanceadores de carga no mínimo. 
Por exemplo, uma configuração como:

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Figura. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}

exigiria um Ingress como:

{{% codenew file="service/networking/simple-fanout-example.yaml" %}}

Quando você cria o Ingress com `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

O controlador Ingress fornece um balanceador de carga específico de implementação que satisfaz o Ingress, desde que os serviços (`service1`, `service2`) existam. 
Quando tiver feito isso, você pode ver o endereço do balanceador de carga no campo `Address`.

{{< note >}}
Dependendo do [controlador Ingress](/docs/concepts/services-networking/ingress-controllers/) que você está usando, talvez seja necessário criar um [serviço](/docs/concepts/services-networking/service/) de backend http padrão.
{{< /note >}}

### Hospedagem virtual baseada em nome

Os hosts virtuais baseados em nomes suportam o roteamento de tráfego HTTP para vários nomes de host no mesmo endereço IP.

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Figura. Hospedagem de host virtual baseado em nome" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

O Ingress a seguir diz ao balanceador de carga de apoio para rotear solicitações com base no [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% codenew file="service/networking/name-virtual-host-ingress.yaml" %}}

Se você criar um recurso de Ingress sem nenhum host definido nas regras, qualquer tráfego da web para o endereço IP do seu controlador de Ingress pode ser correspondido sem que seja necessário um host virtual baseado em nome.

Por exemplo, o Ingress a seguir roteia o tráfego solicitado para `first.bar.com` para `service1`, `second.bar.com` para `service2` e qualquer tráfego cujo cabeçalho de host de solicitação não corresponda a `first.bar.com` e `second.bar.com` para `service3`.

{{% codenew file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

Você pode configurar o uso de TLS no Ingress especificando um {{< glossary_tooltip term_id="secret" >}} que contém uma chave privada e um certificado TLS. 
O recurso Ingress suporta apenas uma única porta TLS, 443, e assume a terminação TLS no ponto de entrada (o tráfego para o Serviço e seus Pods não está criptografado o que é inseguro). 
Se a seção de configuração TLS em um Ingress especificar hosts diferentes, eles serão multiplexados na mesma porta de acordo com o nome do host especificado através da extensão SNI TLS (desde que o controlador Ingress suporte SNI). 
O objeto Secret do tipo TLS deve conter chaves chamadas `tls.crt` e `tls.key` que contêm o certificado e a chave privada a ser usada para TLS. 

Por exemplo:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Fazer referência a esse segredo em um Ingress diz ao controlador Ingress para proteger o canal do cliente para o balanceador de carga usando TLS. 
Você precisa ter certeza de que o objeto Secret do tipo TLS que você criou é originário de um certificado que contém um Nome Comum (Common
Name, CN), também conhecido como Nome de Domínio Totalmente Qualificado (Fully Qualified Domain Name, FQDN), tal como `https-example.foo.com`.

{{< note >}}
Tenha em mente que o TLS não funcionará na regra padrão porque os certificados teriam que ser emitidos para todos os subdomínios possíveis. 
Portanto, os hosts na seção `tls` precisam corresponder explicitamente ao `host` na seção `rules`.
{{< /note >}}

{{% codenew file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Há uma lacuna entre os recursos TLS suportados por vários controladores Ingress. 
Consulte a documentação sobre [nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/), [GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https) ou qualquer outro controlador Ingress específico da plataforma para entender como o TLS funciona em seu ambiente.
{{< /note >}}

### Balanceador de carga {#load-balancing}

Um controlador Ingress é inicializado com algumas configurações de política de balanceamento de carga que se aplicam a todos os Ingress, como o algoritmo de balanceamento de carga, esquema de peso de backend e outros. 
Conceitos mais avançados de balanceamento de carga (por exemplo, sessões persistentes, pesos dinâmicos) ainda não estão expostos através do Ingress. 
Em vez disso, você pode obter esses recursos através do balanceador de carga usado para um serviço.

Também vale a pena notar que, embora as verificações de integridade não sejam expostas diretamente através do Ingress, existem conceitos paralelos no Kubernetes, como [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/), que permitem alcançar o mesmo resultado final. 
Revise a documentação específica do controlador para ver como eles lidam com as verificações de integridade (por exemplo: [nginx](https://git.k8s.io/ingress-nginx/README.md) ou [GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Atualizando um Ingress

Para atualizar um Ingress existente para adicionar um novo Host, você pode atualizá-lo editando o recurso:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Isso abre um editor com a configuração existente no formato YAML. 
Para incluir o novo host modifique:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

Depois de salvar suas alterações, o kubectl atualizará o recurso no servidor API, que diz ao controlador Ingress para reconfigurar o balanceador de carga.

Verifique isso:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Você pode alcançar o mesmo resultado invocando `kubectl replace -f` em um arquivo Ingress YAML modificado.

## Falha nas zonas de disponibilidade

Técnicas para distribuir o tráfego entre domínios de falha diferem entre os provedores de nuvem. 
Verifique a documentação do [controlador Ingress](/docs/concepts/services-networking/ingress-controllers) para obter detalhes relevantes.

## Alternativas {#alternatives}

Você pode expor um serviço de várias maneiras que não envolve diretamente o recurso Ingress:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)


## {{% heading "whatsnext" %}}

* Aprenda sobre a API [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)
* Aprenda sobre [controladores Ingress](/docs/concepts/services-networking/ingress-controllers/)
* [Configure o Ingress no Minikube usando o NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube/)
