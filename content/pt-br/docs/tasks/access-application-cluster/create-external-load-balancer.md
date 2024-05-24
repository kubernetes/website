---
title: Criando um Balanceador de Carga Externo
content_type: task
weight: 80
---

<!-- overview -->

Esta página mostra como criar um balanceador de carga externo para um serviço em execução em um cluster Kubernetes.

Ao criar um {{< glossary_tooltip text="Service" term_id="service" >}}, você tem a opção de criar automaticamente um balanceador de carga em nuvem. Isso fornece um endereço IP acessível externamente que envia tráfego para a porta correta nos nós do seu cluster, _desde que seu cluster seja executado em um ambiente suportado e esteja configurado com o pacote do provedor de balanceador de carga em nuvem correto_.

You can also use an {{< glossary_tooltip term_id="ingress" >}} in place of Service.

Para obter mais informações, verifique a documentação do [Ingress](/docs/concepts/services-networking/ingress/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Seu cluster deve estar em execução em uma nuvem ou em outro ambiente que já tenha suporte
para configurar balanceadores de carga externos.

<!-- steps -->

## Criando um serviço

### Criando um serviço com base em um manifesto

Para criar um balanceador de carga externo, adicione a seguinte linha ao
manifesto do serviço:

```yaml
    type: LoadBalancer
```

Seu manifesto pode se parecer com:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

### Criando um Serviço usando o kubectl

Como alternativa, você pode criar o serviço com o comando `kubectl expose` e a flag `--type=LoadBalancer`:

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

Esse comando cria um novo serviço usando os mesmos seletores do recurso referenciado (no caso do exemplo acima, um
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} chamado `example`).

Para obter mais informações, incluindo flags opcionais, consulte a [`kubectl expose` reference](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Encontrando seu endereço IP

Você pode encontrar o endereço IP criado para o seu serviço obtendo as informações do serviço por meio do `kubectl`:

```bash
kubectl describe services example-service
```

que devem produzir resultados semelhantes a:

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

O endereço IP do balanceador de carga é listado ao lado de `LoadBalancer Ingress`.

{{< note >}}
Se você estiver executando seu serviço no Minikube, poderá encontrar o endereço IP e a porta designados com:

```bash
minikube service example-service --url
```

{{< /note >}}

## Preservando o IP de origem do cliente

Por padrão, o IP de origem visto no contêiner de destino _não é o IP de origem original_ do cliente.  Para permitir a preservação do IP do cliente, os seguintes
campos podem ser configurados no `.spec` do Serviço::

* `.spec.externalTrafficPolicy` - indica se este Serviço deseja rotear o tráfego externo para endpoints locais do nó ou em todo o cluster. Existem duas opções disponíveis: `Cluster` (padrão) e `Local`. `Cluster` oculta o IP de origem do cliente e pode causar um segundo salto para outro nó, mas deve ter uma boa distribuição geral de carga. `Local` preserva o IP de origem do cliente e evita um segundo salto para Serviços do tipo LoadBalancer e NodePort, mas corre o risco de uma distribuição de tráfego potencialmente desequilibrada.

* `.spec.healthCheckNodePort` - especifica a porta de verificação de integridade
  (número de porta numérico) para o serviço. Se você não especificar
  `healthCheckNodePort`, o controlador de serviço alocará uma porta do intervalo NodePort do seu cluster.
  Você pode configurar esse intervalo definindo uma opção de linha de comando do servidor de API,
  `--service-node-port-range`. O Serviço usará o valor `healthCheckNodePort` especificado pelo usuário, se você o especificar, desde que o tipo do Serviço esteja definido como LoadBalancer e `externalTrafficPolicy` esteja definido como `Local`.

A definição `externalTrafficPolicy: Local` no manifesto do Serviço ativa esse recurso. Por exemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

### Ressalvas e limitações ao preservar IPs de origem

Os serviços de balanceamento de carga de alguns provedores de nuvem não permitem configurar pesos diferentes para cada destino.

Como cada destino recebe o mesmo peso no balanceamento de tráfego para os Nós, o tráfego externo não é distribuído igualmente entre os Pods. Isso ocorre porque o balanceador de carga externo não considera o número de Pods por Nó.

"Quando NumServicePods << NumNodes ou NumServicePods >> NumNodes, uma distribuição relativamente próxima da igualdade será observada, mesmo sem pesos."

O tráfego interno pod-a-pod deve apresentar um comportamento similar aos serviços ClusterIP, distribuindo-se igualmente entre todos os Pods.

## Limpeza de balanceadores de carga

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Em um cenário ideal, ao excluir um Serviço do tipo LoadBalancer, os recursos de balanceamento de carga no provedor de nuvem são automaticamente removidos. Porém, existem casos onde esses recursos permanecem ativos, mesmo após a exclusão do Serviço. Para resolver esse problema, foi introduzida a Proteção por Finalizadores para LoadBalancers de Serviço. Essa proteção utiliza finalizadores, que são mecanismos que impedem a exclusão de um Serviço até que os recursos de balanceamento de carga associados também sejam removidos.

Para Serviços do tipo LoadBalancer, o controlador de serviço utiliza um finalizador chamado `service.kubernetes.io/load-balancer-cleanup`. Esse finalizador funciona como um mecanismo de segurança, impedindo a exclusão do Serviço até que o recurso de balanceamento de carga associado seja removido. Essa medida evita a existência de recursos de balanceamento de carga órfãos, mesmo em situações inesperadas, como a falha do controlador de serviço.

## Provedores de balanceamento de carga externo

"É importante ressaltar que o roteamento e distribuição do tráfego para essa funcionalidade são realizados por um balanceador de carga que não faz parte do cluster Kubernetes.

Quando um Serviço é configurado como LoadBalancer, o Kubernetes garante o acesso interno aos pods do Serviço (como no tipo ClusterIP) e também integra o Serviço com um balanceador de carga externo. O plano de controle do Kubernetes é responsável por criar o balanceador de carga externo no provedor de nuvem, configurar as verificações de integridade e as regras de filtragem de pacotes. Assim que o provedor de nuvem atribui um endereço IP ao balanceador de carga, o plano de controle o adiciona ao objeto de Serviço, tornando-o acessível externamente.

## {{% heading "whatsnext" %}}

* Siga o tutorial [Conectando Aplicações com Serviços](/docs/tutorials/services/connect-applications-service/)
* Saiba mais sobre [Service](/docs/concepts/services-networking/service/)
* Saiba mais sobre [Ingress](/pt-br/docs/concepts/services-networking/ingress/)
