---
title: Comunicação entre Nó e Control Plane
content_type: concept
weight: 20
---

<!-- overview -->

Este documento cataloga os caminhos de comunicação entre o control plane (o
apiserver) e o cluster Kubernetes. A intenção é permitir que os usuários
personalizem sua instalação para proteger a configuração de rede
então o cluster pode ser executado em uma rede não confiável (ou em IPs totalmente públicos em um
provedor de nuvem).




<!-- body -->

## Nó para o Control Plane

Todos os caminhos de comunicação do cluster para o control plane terminam no
apiserver (nenhum dos outros componentes do control plane são projetados para expor
Serviços remotos). Em uma implantação típica, o apiserver é configurado para escutar
conexões remotas em uma porta HTTPS segura (443) com uma ou mais clientes [autenticação](/docs/reference/access-authn-authz/authentication/) habilitado.
Uma ou mais formas de [autorização](/docs/reference/access-authn-authz/authorization/)
deve ser habilitado, especialmente se [requisições anônimas](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
ou [tokens da conta de serviço](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
são autorizados.

Os nós devem ser provisionados com o certificado root público para o cluster
de tal forma que eles podem se conectar de forma segura ao apiserver junto com o cliente válido
credenciais. Por exemplo, em uma implantação padrão do GKE, as credenciais do cliente
fornecidos para o kubelet estão na forma de um certificado de cliente. Vejo
[bootstrapping TLS do kubelet](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
para provisionamento automatizado de certificados de cliente kubelet.

Os pods que desejam se conectar ao apiserver podem fazê-lo com segurança, aproveitando
conta de serviço para que o Kubernetes injetará automaticamente o certificado raiz público
certificado e um token de portador válido no pod quando ele é instanciado.
O serviço `kubernetes` (no namespace `default`) é configurado com um IP virtual
endereço que é redirecionado (via kube-proxy) para o endpoint com HTTPS no
apiserver.

Os componentes do control plane também se comunicam com o apiserver do cluster através da porta segura.

Como resultado, o modo de operação padrão para conexões do cluster
(nodes e pods em execução nos Nodes) para o control plane é protegido por padrão
e pode passar por redes não confiáveis ​​e/ou públicas.

## Control Plane para o nó

Existem dois caminhos de comunicação primários do control plane (apiserver) para os nõs.
O primeiro é do apiserver para o processo do kubelet que é executado em
cada nó no cluster. O segundo é do apiserver para qualquer nó, pod,
ou serviço através da funcionalidade de proxy do apiserver.

### apiserver para o kubelet

As conexões do apiserver ao kubelet são usadas para:

  * Buscar logs para pods.
  * Anexar (através de kubectl) pods em execução.
  * Fornecer a funcionalidade de encaminhamento de porta do kubelet.

Essas conexões terminam no endpoint HTTPS do kubelet. Por padrão,
o apiserver não verifica o certificado de serviço do kubelet,
o que torna a conexão sujeita a ataques man-in-the-middle, o que o torna
**inseguro** para passar por redes não confiáveis ​​e / ou públicas.

Para verificar essa conexão, use a flag `--kubelet-certificate-authority` para
fornecer o apiserver com um pacote de certificado raiz para usar e verificar o
certificado de serviço da kubelet.

Se isso não for possível, use o [SSH túnel](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)
entre o apiserver e kubelet se necessário para evitar a conexão ao longo de um
rede não confiável ou pública.

Finalmente, [Autenticação e/ou autorização do Kubelet](/docs/admin/kubelet-authentication-authorization/)
deve ser ativado para proteger a API do kubelet.

### apiserver para nós, pods e serviços

As conexões a partir do apiserver para um nó, pod ou serviço padrão para simples
conexões HTTP não são autenticadas nem criptografadas. Eles
podem ser executados em uma conexão HTTPS segura prefixando `https:` no nó,
pod, ou nome do serviço no URL da API, mas eles não validarão o certificado
fornecido pelo ponto de extremidade HTTPS, nem fornece credenciais de cliente, enquanto
a conexão será criptografada, não fornecerá nenhuma garantia de integridade.
Estas conexões **não são atualmente seguras** para serem usados por redes não confiáveis ​​e/ou públicas.

### SSH Túnel

O Kubernetes suporta túneis SSH para proteger os caminhos de comunicação do control plane para os nós. Nesta configuração, o apiserver inicia um túnel SSH para cada nó
no cluster (conectando ao servidor ssh escutando na porta 22) e passa
todo o tráfego destinado a um kubelet, nó, pod ou serviço através do túnel.
Este túnel garante que o tráfego não seja exposto fora da rede aos quais
os nós estão sendo executados.

Atualmente, os túneis SSH estão obsoletos, portanto, você não deve optar por usá-los, a menos que saiba o que está fazendo. O serviço Konnectivity é um substituto para este canal de comunicação. 

### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Como uma substituição aos túneis SSH, o serviço Konnectivity fornece proxy de nível TCP para a comunicação do control plane para o cluster. O serviço Konnectivity consiste em duas partes: o servidor Konnectivity na rede control plane e os agentes Konnectivity na rede dos nós. Os agentes Konnectivity iniciam conexões com o servidor Konnectivity e mantêm as conexões de rede. Depois de habilitar o serviço Konnectivity, todo o tráfego do control plane para os nós passa por essas conexões.

Veja a [tarefa do Konnectivity](docs/tasks/extend-kubernetes/setup-konnectivity/) para configurar o serviço Konnectivity no seu cluster.
