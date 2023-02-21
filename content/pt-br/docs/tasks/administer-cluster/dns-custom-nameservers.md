---
title: Personalizando o Serviço DNS
content_type: task
min-kubernetes-server-version: v1.12
---

<!-- overview -->
Essa página explica como configurar os seus {{< glossary_tooltip text="Pod(s)" term_id="pod" >}} de DNS
e personalizar o processo de resolução de DNS no seu cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Seu cluster deve estar executando o complemento CoreDNS.

{{% version-check %}}

<!-- steps -->

## Introdução

DNS é um serviço integrado do Kubernetes que é iniciado automaticamente usando o _gerenciador de complementos_ [cluster add-on](http://releases.k8s.io/master/cluster/addons/README.md).

{{< note >}}
O Service CoreDNS é chamado de `kube-dns` no campo `metadata.name`.
O objetivo é garantir maior interoperabilidade com cargas de trabalho que dependiam do nome de serviço legado `kube-dns` para resolver endereços internos ao cluster.
Usando o service chamado `kube-dns` abstrai o detalhe de implementação de qual provedor de DNS está sendo executado por trás desse nome comum.
{{< /note >}}

Se você estiver executando o CoreDNS como um Deployment, ele geralmente será exposto como um service do Kubernetes com o endereço de IP estático.
O kubelet passa informações de resolução de DNS para cada contêiner com a flag `--cluster-dns=<dns-service-ip>`.

Os nomes DNS também precisam de domínios. Você configura o domínio local no kubelet com a flag `--cluster-domain=<default-local-domain>`.

O servidor DNS suporta pesquisas de encaminhamento (registros A e AAAA), pesquisas de porta (registros SRV), pesquisas de endereço de IP reverso (registros PTR) e muito mais. Para mais informações, veja [DNS para Serviços e Pods](/docs/concepts/services-networking/dns-pod-service/).

Se a `dnsPolicy` de um Pod estiver definida como `default`, ele herda a configuração de resolução de nome do nó em que o Pod é executado. A resolução de DNS do Pod deve se comportar da mesma forma que o nó.
Veja [Problemas conhecidos](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).

Se você não quiser isso, ou se quiser uma configuração de DNS diferente para os pods, pode usar a flag `--resolv-conf` do kubelet. Defina essa flag como "" para impedir que os Pods herdem a configuração do DNS. Defina-a como um caminho de arquivo válido para especificar um arquivo diferente de `/etc/resolv.conf` para a herança de DNS.

## CoreDNS

CoreDNS é um servidor oficial de DNS de propósito geral que pode atuar como DNS do cluster,
cumprindo com as [especificações DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

### Opções CoreDNS ConfigMap options

CoreDNS é um servidor DNS que é modular e plugável, com plugins que adicionam novas funcionalidades.
O servidor CoreDNS pode ser configurado por um [Corefile](https://coredns.io/2017/07/23/corefile-explained/),
que é o arquivo de configuração do CoreDNS. Como administrador de cluster, você pode modificar o
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} que contém o arquivo Corefile do CoreDNS para
mudar como o descoberta de serviços DNS se comporta para esse cluster.

No Kubernetes, o CoreDNS é instalado com a seguinte configuração padrão do Corefile:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

A configuração do Corefile inclui os seguintes [plugins](https://coredns.io/plugins/) do CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Erros são enviados para stdout.
* [health](https://coredns.io/plugins/health/): A integridade do CoreDNS é reportada para
`http://localhost:8080/health`. Nesta sintaxe estendida, `lameduck` marcará o processo como não-íntegro, esperando por 5 segundos antes que o processo seja encerrado.
* [ready](https://coredns.io/plugins/ready/): Um endpoint HTTP na porta 8181 retornará 200 OK, quando todos os plugins que são capazes de sinalizar prontidão tiverem feito isso.
* [kubernetes](https://coredns.io/plugins/kubernetes/): O CoreDNS responderá a consultas DNS
 baseado no IP dos Serviços e Pods. Você pode encontrar mais detalhes sobre este plugin no [site do CoreDNS](https://coredns.io/plugins/kubernetes/).
  * `ttl` permite que você defina um TTL personalizado para as respostas. O padrão é 5 segundos. O TTL mínimo permitido é de 0 segundos e o máximo é de 3600 segundos. Definir o TTL como 0 impedirá que os registros sejam armazenados em cache.
  * A opção `pods insecure` é fornecida para retrocompatibilidade  com o `kube-dns`.
  * Você pode usar a opção `pods verified`, que retorna um registro A somente se houver um Pod no mesmo namespace com um IP correspondente.
  * A opção `pods disabled` pode ser usada se você não usar registros de Pod.
* [prometheus](https://coredns.io/plugins/metrics/): As métricas do CoreDNS ficam disponíveis em `http://localhost:9153/metrics` seguindo o formato [Prometheus](https://prometheus.io/), também conhecido como OpenMetrics.
* [forward](https://coredns.io/plugins/forward/): Qualquer consulta que não esteja no domínio do cluster do Kubernetes é encaminhada para resolutores predefinidos (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): Habilita um cache de frontend.
* [loop](https://coredns.io/plugins/loop/): Detecta loops de encaminhamento simples e interrompe o processo do CoreDNS se um loop for encontrado.
* [reload](https://coredns.io/plugins/reload): Permite a recarga automática de um Corefile que foi alterado.
  Depois de editar a configuração do ConfigMap, é necessario dois minutos para que as alterações entrem em vigor.
* [loadbalance](https://coredns.io/plugins/loadbalance): Este é um balanceador de carga DNS round-robin que randomiza a ordem dos registros A, AAAA e MX na resposta.

Você pode modificar o comportamento padrão do CoreDNS modificando o ConfigMap.

### Configuração de domínio Stub e upstream nameserver usando o CoreDNS

O CoreDNS tem a capacidade de configurar domínios Stub e upstream nameservers usando o plugin [forward](https://coredns.io/plugins/forward/).

#### Exemplo

Se um operador de cluster possui um servidor de domínio [Consul](https://www.consul.io/) localizado em "10.150.0.1"
e todos os nomes Consul possuem o sufixo ".consul.local". Para configurá-lo no CoreDNS,
o administrador do cluster cria a seguinte entrada no ConfigMap do CoreDNS.

```config
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

Para forçar explicitamente que todas as pesquisas de DNS fora do cluster passem por um nameserver específico em 172.16.0.1, aponte o `forward` para o nameserver em vez de `/etc/resolv.conf`.

```config
forward .  172.16.0.1
```

O ConfigMap final, juntamente com a configuração padrão do `Corefile`, é:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

{{< note >}}
O CoreDNS não suporta FQDNs para domínios Stub e nameservers (por exemplo, "ns.foo.com"). Durante a tradução, todos os nameservers FQDN serão omitidos da configuração do CoreDNS.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Leia [Depurando a resolução DNS](/docs/tasks/administer-cluster/dns-debugging-resolution/)

