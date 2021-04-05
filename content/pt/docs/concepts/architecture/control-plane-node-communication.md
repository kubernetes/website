---
title: Comunicação entre Nó e Control Plane
content_type: concept
weight: 20
---

<!-- overview -->

Este documento cataloga os caminhos de comunicação entre o Control Plane (o
apiserver) e o cluster Kubernetes. A intenção é permitir que os usuários
personalizem sua instalação para proteger a configuração de rede
então o cluster pode ser executado em uma rede não confiável (ou em IPs totalmente públicos em um
provedor de nuvem).




<!-- body -->

## Cluster para o Master

Todos os caminhos de comunicação do cluster para o Control Plane terminam no
apiserver (nenhum dos outros componentes do Control Plane são projetados para expor
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
O serviço `kubernetes` (em todos os namespaces) é configurado com um IP virtual
endereço que é redirecionado (via kube-proxy) para o endpoint com HTTPS no
apiserver.

Os componentes principais também se comunicam com o apiserver do cluster através da porta segura.

Como resultado, o modo de operação padrão para conexões do cluster
(nodes e pods em execução nos Nodes) para o Master é protegido por padrão
e pode passar por redes não confiáveis ​​e / ou públicas.

## Control Plane para o Nó

Existem dois caminhos de comunicação primários do Control Plane (apiserver) para o
cluster. O primeiro é do apiserver para o processo do kubelet que é executado em
cada nó no cluster. O segundo é do apiserver para qualquer nó, Pod,
ou Service através da funcionalidade de proxy do apiserver.

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

### apiserver para nós, pods e services

As conexões a partir do apiserver para um nó, pod ou service padrão para simples
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

Atualmente, os túneis SSH estão obsoletos, portanto, você não deve optar por usá-los, a menos que saiba o que está fazendo. Um substituto para este canal de comunicação está sendo projetado.The Konnectivity service is a replacement for this communication channel.

### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the control plane to cluster communication. The Konnectivity service consists of two parts: the Konnectivity server in the control plane network and the Konnectivity agents in the nodes network. The Konnectivity agents initiate connections to the Konnectivity server and maintain the network connections. After enabling the Konnectivity service, all control plane to nodes traffic goes through these connections.

Follow the Konnectivity service task to set up the Konnectivity service in your cluster.




