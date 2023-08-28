---
title: Proxies no Kubernetes
content_type: concept
weight: 90
---

<!-- overview -->
Esta página descreve o uso de proxies com Kubernetes. 


<!-- body -->

## Proxies
Existem vários tipos diferentes de proxies que você pode encontrar usando Kubernetes:


1.  O [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

  Quando o kubectl proxy é utilizado ocorre o seguinte: 
    - executa na máquina do usuário ou em um pod
    - redireciona/encapsula conexões direcionadas ao localhost para o servidor de API
    - a comunicação entre o cliente e o o proxy usa HTTP 
    - a comunicação entre o proxy e o servidor de API usa HTTPS 
    - o proxy localiza o servidor de API do cluster
    - o proxy adiciona os cabeçalhos de comunicação.

1.  O [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - é um bastion server, construído no servidor de API
    - conecta um usuário fora do cluster com os IPs do cluster que não podem ser acessados de outra forma
    - executa dentro do processo do servidor de API
    - cliente para proxy usa HTTPS (ou HTTP se o servidor de API for configurado)
    - proxy para o destino pode usar HTTP ou HTTPS conforme escolhido pelo proxy usando as informações disponíveis
    - pode ser usado para acessar um Nó, Pod ou serviço
    - faz balanceamento de carga quando usado para acessar um Service.

1.  O [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - executa em todos os Nós 
    - atua como proxy para UDP, TCP e SCTP
    - não aceita HTTP
    - provém balanceamento de carga
    - apenas é usado para acessar serviços.

1.  Um Proxy/Balanceador de carga na frente de servidores de API(s):

    - a existência e a implementação de tal elemento varia de cluster para cluster, por exemplo nginx
    - fica entre todos os clientes e um ou mais serviços
    - atua como balanceador de carga se existe mais de um servidor de API. 


1.  Balanceadores de carga da nuvem em serviços externos: 
    - são fornecidos por algum provedor de nuvem (e.x AWS ELB, Google Cloud Load Balancer)
    - são criados automaticamente quando o serviço de Kubernetes tem o tipo `LoadBalancer`
    - geralmente suportam apenas UDP/TCP 
    - O suporte ao SCTP fica por conta da implementação do balanceador de carga da provedora de nuvem
    - a implementação varia de acordo com o provedor de cloud.

Os usuários de Kubernetes geralmente não precisam se preocupar com outras coisas além dos dois primeiros tipos. O 
administrador do cluster tipicamente garante que os últimos tipos serão configurados corretamente. 



## Redirecionamento de requisições

Os proxies substituíram as capacidades de redirecionamento. O redirecionamento foi depreciado.