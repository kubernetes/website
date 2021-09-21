---
title: Plugins de rede
content_type: concept
weight: 10
---


<!-- overview -->
Plugins de redes no Kubernetes podem ser dos seguintes tipos:

* Plugins CNI: Aderentes à especificação [Container Network Interface](https://github.com/containernetworking/cni) (CNI), desenhados para interoperabilidade.
  * Kubernetes usa a versão [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) da especificação CNI.
* Plugin kubenet: Implementa o `cbr0` básico usando os plugins CNI `bridge` e `host-local`

<!-- body -->

## Instalação

O kubelet possui um plugin único padrão, e um plugin padrão comum para todo o cluster. 
Ele verifica o plugin quando inicia, se lembra o que encontrou, e executa o plugin selecionado
em momentos oportunos dentro do ciclo de vida de um Pod (isso é verdadeiro apenas com o Docker, 
uma vez que o CRI gerencia seus próprios plugins de CNI). Existem dois parâmetros de linha de comando
no Kubelet para se ter em mente quando usando plugins:

* `cni-bin-dir`: O Kubelet verifica esse diretório por plugins na inicialização
* `network-plugin`: O plugin de rede que deve ser utilizado do diretório configurado em
`cni-bin-dir`. Deve ser igual ao nome configurado por um plugin no diretório de plugins. 
Para plugins de CNI, isso equivale ao valor `cni`.

## Requisitos de plugins de Rede

Além de prover a [interface `NetworkPlugin`](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go)
para configuração da rede do pod, o plugin pode necessitar de suporte específico ao 
kube-proxy.
O proxy iptables obviamente depende do iptables, e o plugin deve garantir que o 
tráfego do contêiner esteja disponível para o iptables. Por exemplo, se o plugin 
conecta os contêineres à _Linux bridge_, o plugin deve configurar a diretiva de 
_sysctl_ `net/bridge/bridge-nf-call-iptables` com o valor `1` para garantir que o 
proxy iptables opere normalmente. Se o plugin não faz uso da _Linux Bridge_ (mas outro 
mecanismo, como Open vSwitch) ele deve garantir que o tráfego do contêiner é roteado
apropriadamente para o proxy.

Por padrão, se nenhum plugin de rede é configurado no kubelet, o plugin `noop` é utilizado,
que configura `net/bridge/bridge-nf-call-iptables=1` para garantir que configurações simples 
(como Docker com _bridge Linux_) operem corretamente com o proxy iptables.

### CNI

O plugin de CNI é selecionado utilizando-se da opção `--network-plugin=cni` no início do Kubeket.
O Kubelet lê um arquivo do diretório especificado em `--cni-conf-dir` (padrão `/etc/cni/net.d`) 
e usa a configuração de CNI desse arquivo para configurar a rede de cada Pod. O arquivo de 
configuração do CNI deve usar a [especificação de CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), 
e qualquer plugin referenciado nesse arquivo deve estar presente no diretório 
`--cni-bin-dir` (padrão `/opt/cni/bin`).

Se existirem múltiplos arquivos de configuração no diretório, o kubelet usa o arquivo de 
configuração que vier primeiro pelo nome, em ordem alfabética.

Adicionalmente ao plugin de CNI especificado no arquivo de configuração, o Kubernetes requer 
o plugin CNI padrão [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) ao menos na versão 0.2.0.

#### Suporte a hostPort

O plugin de redes CNI suporta `hostPort`. Você pode utilizar o plugin oficial
[portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
ou usar seu próprio plugin com a funcionalidade de _portMapping_.

Caso você deseje habilitar o suporte a `hostPort`, você deve especificar 
`portMappings capability` no seu `cni-conf-dir`.
Por exemplo:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true}
    }
  ]
}
```

#### Suporte a controle de banda

**Funcionalidade experimental**

O plugin de rede CNI também suporta o controle de banda de entrada e saída.
Você pode utilizar o plugin oficial [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth) 
desenvolvido ou usar seu próprio plugin de controle de banda.

Se você habilitar o suporte ao controle de banda, você deve adicionar o plugin `bandwidth`
no seu arquivo de configuração de CNI (padrão `/etc/cni/net.d`) e garantir que o programa
exista no diretório de binários do CNI (padrão `/opt/cni/bin`).

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

Agora você pode adicionar as anotações `kubernetes.io/ingress-bandwidth` e
`kubernetes.io/egress-bandwidth` em seu pod.
Por exemplo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

### kubenet

Kubenet é um plugin de rede muito simples, existente apenas no Linux. Ele não 
implementa funcionalidades mais avançadas, como rede entre nós ou políticas de rede.
Ele é geralmente utilizado junto a um provedor de nuvem que configura as regras de 
roteamento para comunicação entre os nós, ou em ambientes com apenas um nó.

O Kubenet cria uma _interface bridge_ no Linux chamada `cbr0` e cria um par _veth_ 
para cada um dos pods com o host como a outra ponta desse par, conectado à `cbr0`.
Na interface no lado do Pod um endereço IP é alocado de uma faixa associada ao nó, 
sendo parte de alguma configuração no nó ou pelo controller-manager. Na interface `cbr0`
é associado o MTU equivalente ao menor MTU de uma interface de rede do host.

Esse plugin possui alguns requisitos:

* Os plugins CNI padrão `bridge`, `lo` e `host-local` são obrigatórios, ao menos na 
versão 0.2.0. O Kubenet buscará inicialmente esses plugins no diretório `/opt/cni/bin`. 
Especifique a opção `cni-bin-dir` no kubelet para fornecer um diretório adicional 
de busca. O primeiro local equivalente será o utilizado.
* O kubelet deve ser executado com a opção `--network-plugin=kubenet` para habilitar esse plugin.
* O Kubelet deve ainda ser executado com a opção `--non-masquerade-cidr=<clusterCidr>` para
garantir que o tráfego de IPs para fora dessa faixa seja mascarado.
* O nó deve possuir uma subrede associada, através da opção `--pod-cidr` configurada 
na inicialização do kubelet, ou as opções `--allocate-node-cidrs=true --cluster-cidr=<cidr>`
utilizadas na inicialização do _controller-manager_.

### Customizando o MTU (com kubenet)

O MTU deve sempre ser configurado corretamente para obter-se a melhor performance de 
rede. Os plugins de rede geralmente tentam detectar uma configuração correta de MTU, 
porém algumas vezes a lógica não irá resultar em uma configuração adequada. Por exemplo,
se a _Docker bridge_ ou alguma outra interface possuir um MTU pequeno, o kubenet irá 
selecionar aquela MTU. Ou caso você esteja utilizando encapsulamento IPSEC, o MTU deve 
ser reduzido, e esse cálculo não faz parte do escopo da maioria dos plugins de rede.

Sempre que necessário, você pode configurar explicitamente o MTU com a opção `network-plugin-mtu`
no kubelet. Por exemplo, na AWS o MTU da `eth0` geralmente é 9001 então você deve 
especificar `--network-plugin-mtu=9001`. Se você estiver usando IPSEC você deve reduzir
o MTU para permitir o encapsulamento excedente; por exemplo: `--network-plugin-mtu=8773`.

Essa opção faz parte do plugin de rede. Atualmente **apenas o kubenet suporta a configuração
`network-plugin-mtu`**.

## Resumo de uso

* `--network-plugin=cni` especifica que devemos usar o plugin de redes `cni` com os 
binários do plugin localizados em `--cni-bin-dir` (padrão `/opt/cni/bin`) e as 
configurações do plugin localizadas em `--cni-conf-dir` (default `/etc/cni/net.d`).
* `--network-plugin=kubenet` especifica que iremos usar o plugin de rede `kubenet` 
com os plugins CNI `bridge`, `lo` e `host-local` localizados em `/opt/cni/bin` ou `cni-bin-dir`.
* `--network-plugin-mtu=9001` especifica o MTU a ser utilizado, atualmente apenas em uso 
pelo plugin de rede `kubenet`

## {{% heading "whatsnext" %}}
