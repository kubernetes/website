---
reviewers:
  - dchen1107
  - liggitt
title: Comunicação entre Nós e a Camada de Gerenciamento
content_type: concept
weight: 20
aliases:
  - master-node-communication
---

<!-- overview -->

Este documento cataloga os caminhos de comunicação entre o {{< glossary_tooltip term_id="kube-apiserver" text="servidor de API" >}}
e o {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}} Kubernetes.
A intenção é permitir que os usuários personalizem sua instalação para endurecer a configuração de rede
de tal forma que o cluster pode ser executado em uma rede não confiável (ou em IPs totalmente públicos em um
provedor de nuvem).

<!-- body -->

## Nó para a Camada de Gerenciamento

O Kubernetes tem um padrão de API "hub-and-spoke". Todo uso da API dos nós (ou dos pods que eles executam)
termina no servidor de API. Nenhum dos outros componentes da camada de gerenciamento são projetados para expor
serviços remotos. O servidor de API é configurado para escutar conexões remotas em uma porta HTTPS segura
(tipicamente 443) com uma ou mais formas de [autenticação](/docs/reference/access-authn-authz/authentication/) de cliente habilitada.
Uma ou mais formas de [autorização](/docs/reference/access-authn-authz/authorization/) devem ser
habilitadas, especialmente se [requisições anônimas](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
ou [tokens da conta de serviço](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
são permitidos.

Os nós devem ser provisionados com o {{< glossary_tooltip text="certificado" term_id="certificate" >}} raiz público do cluster de tal forma que eles podem
se conectar de forma segura ao servidor de API junto com credenciais de cliente válidas. Uma boa abordagem é que as
credenciais de cliente fornecidas ao kubelet estejam na forma de um certificado de cliente. Veja
[inicialização TLS do kubelet](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
para provisionamento automatizado de certificados de cliente do kubelet.

{{< glossary_tooltip text="Pods" term_id="pod" >}} que desejam se conectar ao servidor de API podem fazê-lo com segurança, aproveitando uma conta de serviço para
que o Kubernetes injete automaticamente o certificado raiz público e um token de portador válido
no pod quando ele for instanciado.
O serviço `kubernetes` (no namespace `default`) é configurado com um endereço IP virtual que é
redirecionado (via `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) para o endpoint HTTPS no servidor de API.

Os componentes da camada de gerenciamento também se comunicam com o servidor de API através da porta segura.

Como resultado, o modo de operação padrão para conexões dos nós e dos pods em execução nos
nós para a camada de gerenciamento é seguro por padrão e pode operar em redes não confiáveis e/ou públicas.

## Camada de Gerenciamento para o Nó

Existem dois caminhos de comunicação primários da camada de gerenciamento (o servidor de API) para os nós.
O primeiro é do servidor de API para o processo {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} que executa em cada nó no cluster.
O segundo é do servidor de API para qualquer nó, pod, ou serviço através da funcionalidade de _proxy_ do servidor de API.

### Servidor de API para o kubelet

As conexões do servidor de API para o kubelet são usadas para:

- Buscar logs para pods.
- Conectar-se (geralmente através de `kubectl`) a pods em execução.
- Fornecer a funcionalidade de encaminhamento de porta do kubelet.

Essas conexões terminam no endpoint HTTPS do kubelet. Por padrão, o servidor de API não
verifica o certificado de serviço do kubelet, o que torna a conexão sujeita a ataques man-in-the-middle
e **insegura** para executar por redes não confiáveis e/ou públicas.

Para verificar essa conexão, use a flag `--kubelet-certificate-authority` para fornecer ao servidor de API
um pacote de certificado raiz para usar e verificar o certificado de serviço do kubelet.

Se isso não for possível, use [túneis SSH](#ssh-tunnels) entre o servidor de API e kubelet se
necessário para evitar conectar por uma rede não confiável ou pública.

Finalmente, [Autenticação e/ou autorização do Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)
deve ser habilitada para proteger a API do kubelet.

### Servidor de API para nós, pods e serviços

As conexões do servidor de API com um nó, pod, ou serviço são conexões HTTP simples por padrão
e, portanto, não são autenticadas nem criptografadas. Elas podem ser executadas por uma conexão HTTPS
segura prefixando `https:` ao nome do nó, pod, ou serviço na URL da API, mas elas não
validarão o certificado fornecido pelo endpoint HTTPS nem fornecerão credenciais de cliente. Então
enquanto a conexão será criptografada, ela não fornecerá nenhuma garantia de integridade. Essas
conexões **não são atualmente seguras** para executar por redes não confiáveis e/ou públicas.

### Túneis SSH

O Kubernetes suporta [túneis SSH](https://www.ssh.com/academy/ssh/tunneling) para proteger os caminhos de comunicação da camada de gerenciamento para os nós. Nesta
configuração, o servidor de API inicia um túnel SSH para cada nó no cluster (conectando ao
servidor SSH escutando na porta 22) e passa todo o tráfego destinado a um kubelet, nó, pod, ou
serviço através do túnel.
Este túnel garante que o tráfego não seja exposto fora da rede na qual os nós estão
executando.

{{< note >}}
Os túneis SSH estão atualmente descontinuados, então você não deve optar por usá-los a menos que saiba o que está
fazendo. O [serviço Konnectivity](#konnectivity-service) é um substituto para este
canal de comunicação.
{{< /note >}}

### Serviço Konnectivity {#konnectivity-service}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Como um substituto aos túneis SSH, o serviço Konnectivity fornece proxy de nível TCP para a
comunicação da camada de gerenciamento para o cluster. O serviço Konnectivity consiste em duas partes: o
servidor Konnectivity na rede da camada de gerenciamento e os agentes Konnectivity na rede dos nós.
Os agentes Konnectivity iniciam conexões com o servidor Konnectivity e mantêm as conexões de rede.
Após habilitar o serviço Konnectivity, todo o tráfego da camada de gerenciamento para os nós passa por essas
conexões.

Siga a [tarefa do serviço Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/) para configurar
o serviço Konnectivity no seu cluster.

## {{% heading "whatsnext" %}}

- Leia sobre os [componentes da camada de gerenciamento do Kubernetes](/docs/concepts/architecture/#control-plane-components)
- Saiba mais sobre o [modelo Hubs and Spoke](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
- Aprenda como [Proteger um Cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
- Saiba mais sobre a [API do Kubernetes](/docs/concepts/overview/kubernetes-api/)
- [Configurar o serviço Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/)
- [Usar Encaminhamento de Porta para Acessar Aplicações em um Cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
- Aprenda como [Buscar logs para Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [usar kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
