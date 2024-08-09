---
title: Certificados PKI e requisitos
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

O Kubernetes requer certificados PKI para autenticação via TLS.
Se instalar o Kubernetes com [kubeadm](/docs/reference/setup-tools/kubeadm/), os certificados
que o seu cluster requer são gerados automaticamente.
Pode também gerar os seus próprios certificados -- por exemplo, para manter as suas chaves privadas mais seguras
não as armazenando no servidor API.
Esta página explica os certificados que o seu cluster requer.

<!-- body -->

## Como os certificados são usados pelo seu cluster

O Kubernetes requer PKI para as seguintes operações:

* Certificados de cliente para o kubelet autenticar-se ao servidor API
* [Certificados de servidor do kubelet](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  para o servidor API comunicar-se com os kubelets
* Certificado de servidor para o endpoint do servidor API
* Certificados de cliente para administradores do cluster autenticarem-se ao servidor API
* Certificados de cliente para o servidor API comunicar-se com os kubelets
* Certificado de cliente para o servidor API comunicar-se com o etcd
* Certificado de cliente/kubeconfig para o gerente de controle comunicar-se com o servidor API
* Certificado de cliente/kubeconfig para o agendador comunicar-se com o servidor API.
* Certificados de cliente e servidor para o [proxy frontal](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

{{< note >}}
Os certificados `proxy frontal` são necessários apenas se executar o kube-proxy para suportar
[um servidor de API de extensão](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

O etcd também implementa TLS mútuo para autenticar clientes e pares.

## Onde os certificados são armazenados

Se instalar o Kubernetes com o kubeadm, a maioria dos certificados são armazenados em `/etc/kubernetes/pki`.
Todos os caminhos nesta documentação são relativos a esse diretório, com exceção dos certificados de contas de utilizador
que o kubeadm coloca em `/etc/kubernetes`.

## Configurar certificados manualmente

Se não quiser que o kubeadm gere os certificados necessários,pode criá-los usando um
único CA raiz ou fornecendo todos os certificados. Veja [Certificados](/docs/tasks/administer-cluster/certificates/)
para detalhes sobre criar a sua própria autoridade de certificação. Veja
[Gestão de Certificados com kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
para mais sobre gerenciamento de certificados.

### Único CA raiz

Pode criar um único CA raiz, controlado por um administrador. Este CA raiz pode então criar
múltiplos CAs intermediários, e delegar toda a criação adicional ao próprio Kubernetes.

CAs necessários:

| caminho                   | CN Padrão                  | descrição                      |
|---------------------------|----------------------------|--------------------------------|
| ca.crt,key                | kubernetes-ca              | CA geral do Kubernetes         |
| etcd/ca.crt,key           | etcd-ca                    | Para todas as funções relacionadas ao etcd   |
| front-proxy-ca.crt,key    | kubernetes-front-proxy-ca  | Para o [proxy frontal](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Além dos CAs acima, também é necessário obter um par de chaves pública/privada para o gerenciamento de contas de serviço, `sa.key` e `sa.pub`.
O exemplo seguinte ilustra os arquivos de chave e certificado do CA mostrados na tabela anterior:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```
#Todos os certificados

Se  não desejar copiar as chaves privadas do CA para o seu cluster,  pode gerar todos os certificados  mesmo.

Certificados necessários:

| CN Padrão                     | CA Pai                      | O (no Assunto) | tipo             | hosts (SAN)                                         |
|-------------------------------|-----------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                     |                | servidor, cliente| `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                     |                | servidor, cliente| `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                     |                | cliente          |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                     |                | cliente          |                                                     |
| kube-apiserver                | kubernetes-ca               |                | servidor         | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca               | system:masters | cliente          |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca   |                | cliente          |                                                     |

{{< note >}}
Em vez de usar o grupo super-utilizador `system:masters` para `kube-apiserver-kubelet-client`
um grupo menos privilegiado pode ser usado. O kubeadm usa o grupo `kubeadm:cluster-admins` para
esse propósito.
{{< /note >}}

[1]: qualquer outro IP ou nome DNS que  contate o seu cluster (como usado pelo [kubeadm](/docs/reference/setup-tools/kubeadm/)
o IP estável do balanceador de carga e/ou nome DNS, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

onde `tipo` mapeia para um ou mais dos usos de chave x509, que também é documentado no
`.spec.usages` de um tipo [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| tipo   | Uso de chave                                                                      | 
|--------|-----------------------------------------------------------------------------------|
| servidor | assinatura digital, ciframento de chave, autenticação de servidor               |
| cliente | assinatura digital, ciframento de chave, autenticação de cliente                 | |

{{< note >}}
Hosts/SAN listados acima são os recomendados para obter um cluster funcional; se necessário por um
setup específico, é possível adicionar SANs adicionais em todos os certificados de servidor.
{{< /note >}}

{{< note >}}
Apenas para utilizadors do kubeadm:

* O cenário onde  está copiando para o seu cluster certificados CA sem chaves privadas é
  referido como CA externo na documentação do kubeadm.
* Se  está a comparar a lista acima com um PKI gerado pelo kubeadm, esteja ciente de que
  os certificados `kube-etcd`, `kube-etcd-peer` e `kube-etcd-healthcheck-client` não são gerados
  em caso de etcd externo.

{{< /note >}}

### Caminhos dos certificados

Os certificados devem ser colocados em um caminho recomendado (como usado pelo [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Os caminhos devem ser especificados usando o argumento dado independentemente da localização.

| CN Padrão                    | caminho recomendado da chave | caminho recomendado do certificado | comando                 | argumento da chave              | argumento do certificado                    |
|------------------------------|------------------------------|------------------------------------|-------------------------|---------------------------------|--------------------------------------------|
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                        | kube-apiserver          |                                 | --etcd-cafile                              |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt          | kube-apiserver          | --etcd-keyfile                  | --etcd-certfile                            |
| kubernetes-ca                | ca.key                       | ca.crt                             | kube-apiserver          |                                 | --client-ca-file                           |
| kubernetes-ca                | ca.key                       | ca.crt                             | kube-controller-manager | --cluster-signing-key-file      | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver               | apiserver.key                | apiserver.crt                      | kube-apiserver          | --tls-private-key-file          | --tls-cert-file                            |
| kube-apiserver-kubelet-client| apiserver-kubelet-client.key | apiserver-kubelet-client.crt       | kube-apiserver          | --kubelet-client-key            | --kubelet-client-certificate               |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt                 | kube-apiserver          |                                 | --requestheader-client-ca-file             |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt                 | kube-controller-manager |                                 | --requestheader-client-ca-file             |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt             | kube-apiserver          | --proxy-client-key-file         | --proxy-client-cert-file                   |
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                        | etcd                    |                                 | --trusted-ca-file, --peer-trusted-ca-file  |
| kube-etcd                    | etcd/server.key              | etcd/server.crt                    | etcd                    | --key-file                      | --cert-file                                |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt                      | etcd                    | --peer-key-file                 | --peer-cert-file                           |
| etcd-ca                      |                              | etcd/ca.crt                        | etcdctl                 |                                 | --cacert                                   |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt        | etcdctl                 | --key                           | --cert                                     |

As mesmas considerações aplicam-se para o par de chaves da conta de serviço:

| caminho da chave privada | caminho da chave pública | comando                 | argumento                           |
|--------------------------|--------------------------|-------------------------|-------------------------------------|
|  sa.key                  |                          | kube-controller-manager | --service-account-private-key-file  |
|                          | sa.pub                   | kube-apiserver          | --service-account-key-file          |

O exemplo seguinte ilustra os caminhos completos para os arquivos listados na tabela anterior:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```
## Configurar certificados para contas de utilizador

 deve configurar manualmente estas contas de administrador e contas de serviço:

| nome do arquivo             | nome da credencial           | CN Padrão                          | O (no Assunto)         |
|-----------------------------|------------------------------|------------------------------------|------------------------|
| admin.conf                  | default-admin                | kubernetes-admin                   | `<admin-group>`super-admin.conf            | default-super-admin          | kubernetes-super-admin             | system:masters         |
| kubelet.conf                | default-auth                 | system:node:`<nodeName>` (ver nota)| system:nodes           |
| controller-manager.conf     | default-controller-manager   | system:kube-controller-manager     |                        |
| scheduler.conf              | default-scheduler            | system:kube-scheduler              |                        |

{{< note >}}
O valor de `<nodeName>` para `kubelet.conf` **deve** corresponder exatamente ao valor do nome do nó
fornecido pelo kubelet conforme ele se registra no apiserver. Para mais detalhes, leia a
[Autorização do Nó](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
No exemplo acima `<admin-group>` é específico da implementação. Alguns ferramentas assinam o
certificado no `admin.conf` padrão para fazer parte do grupo `system:masters`.
`system:masters` é um grupo super-utilizador que pode contornar a camada de autorização
do Kubernetes, como o RBAC. Também algumas ferramentas não geram um separado
`super-admin.conf` com um certificado vinculado a este grupo super-utilizador.

O kubeadm gera dois certificados de administrador separados em arquivos kubeconfig.
Um está em `admin.conf` e tem `Assunto: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` é um grupo personalizado vinculado ao ClusterRole `cluster-admin`.
Este arquivo é gerado em todas as máquinas do plano de controle gerenciadas pelo kubeadm.

Outro está em `super-admin.conf` que tem `Assunto: O = system:masters, CN = kubernetes-super-admin`.
Este arquivo é gerado apenas no nó onde `kubeadm init` foi chamado.
{{< /note >}}

1. Para cada configuração, gere um par de cert/chave x509 com o CN e O dados.

1. Execute `kubectl` conforme segue para cada configuração:

KUBECONFIG= kubectl config set-cluster default-cluster --server=https://:6443 --certificate-authority --embed-certs
KUBECONFIG= kubectl config set-credentials --client-key .pem --client-certificate .pem --embed-certs
KUBECONFIG= kubectl config set-context default-system --cluster default-cluster --user
KUBECONFIG= kubectl config use-context default-system


Estes arquivos são usados conforme segue:

| nome do arquivo             | comando                   | comentário                                                         |
|-----------------------------|---------------------------|---------------------------------------------------------------------|
| admin.conf                  | kubectl                   | Configura o utilizador administrador para o cluster                    |
| super-admin.conf            | kubectl                   | Configura o utilizador super administrador para o cluster              |
| kubelet.conf                | kubelet                   | Necessário para cada nó no cluster.                                 |
| controller-manager.conf     | kube-controller-manager   | Deve ser adicionado ao manifesto em `manifests/kube-controller-manager.yaml` |
| scheduler.conf              | kube-scheduler            | Deve ser adicionado ao manifesto em `manifests/kube-scheduler.yaml`          |

Os seguintes arquivos ilustram os caminhos completos para os arquivos listados na tabela anterior:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
