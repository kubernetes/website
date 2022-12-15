---
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_type: task
min-kubernetes-server-version: v1.12
---

<!-- overview -->
Essa pagina explica como configurar o seu DNS
{{< glossary_tooltip text="Pod(s)" term_id="pod" >}} e personalizar o processo de resolução de DNS no seu cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Seu cluster deve estar executando o complemento CoreDNS.

{{% version-check %}}

<!-- steps -->

## Introdução

DNS é um serviço integrado do Kubernetes que é integrado automaticamente usando o _gerenciador de complementos_ [cluster add-on](http://releases.k8s.io/master/cluster/addons/README.md).

{{< note >}}
O Serviço CoreDNS é chamado de `kube-dns` no campo `metadata.name`.
O objetivo é garantir maior interoperabilidade com cargas de trabalho que dependiam do nome de serviço legado `kube-dns` para resolver endereços internos ao cluster.
Usando o serviço chamado `kube-dns` abstrai o detalhe de implementação de qual provedor de DNS está sendo executado por trás desse nome comum.
{{< /note >}}

Se você estiver executando o CoreDNS como um Deployment, ele geralmente será exposto como um Serviço do Kubernetes com o endereço de IP estático.
O kubelet passa informações de resolução de DNS para cada contêiner com a flag `--cluster-dns=<dns-service-ip>`.

Os nomes DNS também precisam de domínios. Você configura o domínio local no kubelet com a flag `--cluster-domain=<default-local-domain>`.

O servidor DNS suporta pesquisas de encaminhamento (registros A e AAAA), pesquisas de porta (registros SRV), pesquisas de endereço de IP reverso (registros PTR) e muito mais. Para mais informações, veja [DNS para Serviços e Pods](/docs/concepts/services-networking/dns-pod-service/).

Se a `dnsPolicy` de um Pod estiver definida como `default`, ele herda a configuração de resolução de nome do nó em que o Pod é executado. A resolução de DNS do Pod deve se comportar da mesma forma que o nó.
Veja [Problemas conhecidos](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)..

Se você não quiser isso, ou se quiser uma configuração de DNS diferente para os pods, pode usar a flag `--resolv-conf` do kubelet. Defina essa flag como "" para impedir que os Pods herdem a configuração do DNS. Defina-a como um caminho de arquivo válido para especificar um arquivo diferente de `/etc/resolv.conf` para a herança de DNS.

## CoreDNS

CoreDNS é um servidor oficial de DNS de propósito geral que pode atuar como DNS do cluster,
cumprindo com as [especificações DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

### CoreDNS ConfigMap options

CoreDNS is a DNS server that is modular and pluggable, with plugins adding new functionalities.
The CoreDNS server can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/),
which is the CoreDNS configuration file. As a cluster administrator, you can modify the
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} for the CoreDNS Corefile to
change how DNS service discovery behaves for that cluster.

In Kubernetes, CoreDNS is installed with the following default Corefile configuration:

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

The Corefile configuration includes the following [plugins](https://coredns.io/plugins/) of CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Errors are logged to stdout.
* [health](https://coredns.io/plugins/health/): Health of CoreDNS is reported to
  `http://localhost:8080/health`. In this extended syntax `lameduck` will make theuprocess
  unhealthy then wait for 5 seconds before the process is shut down.
* [ready](https://coredns.io/plugins/ready/): An HTTP endpoint on port 8181 will return 200 OK,
  when all plugins that are able to signal readiness have done so.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS will reply to DNS queries
  based on IP of the Services and Pods. You can find [more details](https://coredns.io/plugins/kubernetes/)
  about this plugin on the CoreDNS website.
  - `ttl` allows you to set a custom TTL for responses. The default is 5 seconds.
    The minimum TTL allowed is 0 seconds, and the maximum is capped at 3600 seconds.
    Setting TTL to 0 will prevent records from being cached.  
  - The `pods insecure` option is provided for backward compatibility with `kube-dns`.
  - You can use the `pods verified` option, which returns an A record only if there exists a pod
    in the same namespace with a matching IP.
  - The `pods disabled` option can be used if you don't use pod records.
* [prometheus](https://coredns.io/plugins/metrics/): Metrics of CoreDNS are available at
  `http://localhost:9153/metrics` in the [Prometheus](https://prometheus.io/) format
  (also known as OpenMetrics).
* [forward](https://coredns.io/plugins/forward/): Any queries that are not within the Kubernetes
  cluster domain are forwarded to predefined resolvers (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): This enables a frontend cache.
* [loop](https://coredns.io/plugins/loop/): Detects simple forwarding loops and
  halts the CoreDNS process if a loop is found.
* [reload](https://coredns.io/plugins/reload): Allows automatic reload of a changed Corefile.
  After you edit the ConfigMap configuration, allow two minutes for your changes to take effect.
* [loadbalance](https://coredns.io/plugins/loadbalance): This is a round-robin DNS loadbalancer
  that randomizes the order of A, AAAA, and MX records in the answer.

You can modify the default CoreDNS behavior by modifying the ConfigMap.

### Configuration of Stub-domain and upstream nameserver using CoreDNS

CoreDNS has the ability to configure stub-domains and upstream nameservers
using the [forward plugin](https://coredns.io/plugins/forward/).

#### Example

If a cluster operator has a [Consul](https://www.consul.io/) domain server located at "10.150.0.1",
and all Consul names have the suffix ".consul.local". To configure it in CoreDNS,
the cluster administrator creates the following stanza in the CoreDNS ConfigMap.

```
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

To explicitly force all non-cluster DNS lookups to go through a specific nameserver at 172.16.0.1,
point the `forward` to the nameserver instead of `/etc/resolv.conf`

```
forward .  172.16.0.1
```

The final ConfigMap along with the default `Corefile` configuration looks like:

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
CoreDNS does not support FQDNs for stub-domains and nameservers (eg: "ns.foo.com").
During translation, all FQDN nameservers will be omitted from the CoreDNS config.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Read [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/)

