---
title: "Solução de Problemas no kubectl"
content_type: task
weight: 10
---

<!-- overview -->

Esta documentação é sobre investigar e diagnosticar
problemas relacionados ao {{<glossary_tooltip text="kubectl" term_id="kubectl">}}.
Se você encontrar problemas ao acessar o `kubectl` ou ao conectar-se ao seu cluster, este
documento descreve vários cenários comuns e possíveis soluções para ajudar
a identificar e resolver a causa provável.

<!-- body -->

## {{% heading "prerequisites" %}}

* Você precisa ter um cluster Kubernetes.
* Você também precisa ter o `kubectl` instalado - veja [instale as ferramentas](/docs/tasks/tools/#kubectl)

## Verificar a configuração do kubectl

Certifique-se de que você instalou e configurou o `kubectl` corretamente em sua máquina local.
Verifique a versão do `kubectl` para garantir que esteja atualizada e compatível com seu cluster.

Verifique a versão do kubectl:

```shell
kubectl version
```

Você verá uma saída similar:

```console
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}

```

Se você vir `Unable to connect to the server: dial tcp <server-ip>:8443: i/o timeout`,
ao invés de `Server Version`, você precisa solucionar problemas de conectividade do kubectl com seu cluster.

Certifique-se de que você instalou o kubectl seguindo a
[documentação oficial para instalar o kubectl](/docs/tasks/tools/#kubectl), e que você
configurou adequadamente a variável de ambiente `$PATH`.

## Verificar kubeconfig

O `kubectl` requer um arquivo `kubeconfig` para conectar-se a um cluster Kubernetes. O
arquivo `kubeconfig` geralmente está localizado no diretório `~/.kube/config`. Certifique-se
de que você tem um arquivo `kubeconfig` válido. Se você não tiver um arquivo `kubeconfig`, você pode
obtê-lo do seu administrador do Kubernetes, ou pode copiá-lo do diretório `/etc/kubernetes/admin.conf`
da camada de gerenciamento do seu Kubernetes. Se você implantou seu
cluster Kubernetes em uma plataforma de nuvem e perdeu seu arquivo `kubeconfig`, você pode
recriá-lo usando as ferramentas do seu provedor de nuvem. Consulte a
documentação do provedor de nuvem para recriar um arquivo `kubeconfig`.

Verifique se a variável de ambiente `$KUBECONFIG` está configurada corretamente. Você pode definir
a variável de ambiente `$KUBECONFIG` ou usar o parâmetro `--kubeconfig` com o kubectl
para especificar o diretório de um arquivo `kubeconfig`.

## Verificar conectividade VPN

Se você está usando uma Rede Privada Virtual (VPN) para acessar seu cluster Kubernetes,
certifique-se de que sua conexão VPN está ativa e estável. Às vezes, desconexões
da VPN podem levar a problemas de conexão com o cluster. Reconecte-se à VPN e tente acessar
o cluster novamente.

## Autenticação e autorização

Se você está usando autenticação baseada em token e o kubectl está retornando um erro
relacionado ao token de autenticação ou endereço do servidor de autenticação, valide se
o token de autenticação do Kubernetes e o endereço do servidor de autenticação estão configurados
adequadamente.

Se o kubectl está retornando um erro relacionado à autorização, certifique-se de que você está
usando as credenciais de usuário válidas. E que você tem a permissão para acessar o recurso
que você solicitou.

## Verificar contextos

O Kubernetes suporta [múltiplos clusters e contextos](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Certifique-se de que você está usando o contexto correto para interagir com seu cluster.

Listar contextos disponíveis:

```shell
kubectl config get-contexts
```

Alternar para o contexto apropriado:

```shell
kubectl config use-context <context-name>
```

## Servidor de API e balanceador de carga

O servidor {{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} é o
componente central de um cluster Kubernetes. Se o servidor de API ou o balanceador de carga que
executa na frente dos seus servidores de API não estiver acessível ou não estiver respondendo, você não conseguirá
interagir com o cluster.

Verifique se o host do servidor de API está acessível usando o comando `ping`. Verifique a
conectividade de rede e firewall do cluster. Se você estiver usando um provedor de nuvem para implantar
o cluster, verifique o status de verificação de saúde do seu provedor de nuvem para o
servidor de API do cluster.

Verifique o status do balanceador de carga (se usado) para garantir que esteja íntegro e encaminhando
tráfego para o servidor de API.

## Problemas de TLS
* Ferramentas adicionais necessárias - `base64` e `openssl` versão 3.0 ou superior.

O servidor de API do Kubernetes serve apenas requisições HTTPS por padrão. Nesse caso, problemas de TLS
podem ocorrer por várias razões, como expiração de certificado ou validade da cadeia de confiança.

Você pode encontrar o certificado TLS no arquivo kubeconfig, localizado no diretório
`~/.kube/config`. O atributo `certificate-authority` contém o certificado CA e o
atributo `client-certificate` contém o certificado do cliente.

Verificar a expiração destes certificados:

```shell
kubectl config view --flatten --output 'jsonpath={.clusters[0].cluster.certificate-authority-data}' | base64 -d | openssl x509 -noout -dates
```

saída:
```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 10 06:02:47 2034 GMT
```

```shell
kubectl config view --flatten --output 'jsonpath={.users[0].user.client-certificate-data}'| base64 -d | openssl x509 -noout -dates
```

saída:
```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 12 06:02:50 2025 GMT
```

## Verificar ferramentas auxiliares do kubectl

Algumas ferramentas auxiliares de autenticação do kubectl fornecem acesso fácil aos clusters Kubernetes. Se você
usou tais ferramentas auxiliares e está enfrentando problemas de conectividade, certifique-se de que as configurações
necessárias ainda estão presentes.

Verificar configuração do kubectl para detalhes de autenticação:

```shell
kubectl config view
```

Se você usou anteriormente uma ferramenta auxiliar (por exemplo, `kubectl-oidc-login`), certifique-se de que ela ainda esteja
instalada e configurada corretamente.
