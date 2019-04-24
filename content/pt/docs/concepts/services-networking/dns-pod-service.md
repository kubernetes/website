---
reviewers:
- femrtnz
- jcjesus
title: DNS para serviços e pods
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
Esta página fornece uma visão geral do suporte DNS pelo Kubernetes.
{{% /capture %}}

{{% capture body %}}

## Introdução

O Kubernetes DNS agenda um Pod DNS e um serviço no cluster e configura
os kubelets para dizer recipientes individuais para usar o IP do Serviço DNS para
resolver nomes DNS.

### O que as coisas recebem nomes DNS?

Cada Serviço definido no cluster (incluindo o próprio servidor DNS) é
atribuído um nome DNS. Por padrão, a lista de pesquisa de DNS do cliente Pod
inclua o próprio namespace do Pod e o domínio padrão do cluster. Isso é melhor
ilustrado pelo exemplo:

Suponha um serviço chamado `foo` no namespace do Kubernetes`bar`. Um pod rodando
no namespace `bar` pode procurar este serviço simplesmente fazendo uma consulta DNS para
`foo`. Um Pod rodando no namespace `quux` pode procurar este serviço fazendo uma
Consulta DNS para `foo.bar`.

As seções a seguir detalham os tipos de registro e layout suportados que são
suportado. Qualquer outro layout ou nomes ou consultas que funcionem são
considerados detalhes de implementação e estão sujeitos a alterações sem aviso prévio.
Para especificações mais atualizadas, consulte
[Descoberta de serviço baseada em DNS do Kubernetes](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Serviços

### Um registro

Serviços "normais" (não sem cabeça) recebem um registro DNS A para um nome do
Formato `my-svc.my-namespace.svc.cluster.local`.  Isso resolve o IP do cluster
do Serviço.

"Sem cabeça" (sem um IP de cluster) Os serviços também recebem um registro de DNS A para
um nome do formulário `my-svc.my-namespace.svc.cluster.local`.  Ao contrário do normal
Serviços, isso resolve o conjunto de IPs dos pods selecionados pelo Serviço.
Espera-se que os clientes consumam o conjunto ou então usem round-robin padrão
seleção do conjunto.

### Registros SRV

Registros SRV são criados para portas nomeadas que fazem parte do normal ou [Serviços Headless](/docs/concepts/services-networking/service/#headless-services).
Para cada porta nomeada, o registro SRV teria o formato
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local`.
Para um serviço regular, isso resolve o número da porta e o nome do domínio:
`my-svc.my-namespace.svc.cluster.local`.
Para um serviço Headless, isso resolve várias respostas, uma para cada pod
que está fazendo backup do serviço e contém o número da porta e o nome do domínio do pod
da forma `auto-generated-name.my-svc.my-namespace.svc.cluster.local`.

## Pods

### Campos de nome de host e subdomínio do pod

Atualmente, quando um pod é criado, seu nome de host é o valor "metadata.name" do Pod.

A especificação Pod tem um campo opcional `hostname`, que pode ser usado para especificar o
Nome do host do pod. Quando especificado, tem precedência sobre o nome do Pod a ser
o nome do host do pod. Por exemplo, dado um Pod com `hostname` definido para
"` my-host`", o Pod terá seu nome de host configurado para" `my-host`".

A especificação Pod também tem um campo `subdomain` opcional que pode ser usado para especificar
seu subdomínio. Por exemplo, um Pod com `hostname` definido como" `foo`" e `subdomain`
definido como "`bar`", no namespace "`my-namespace`", terá o nome completo
nome de domínio (FQDN)" `foo.bar.my-namespace.svc.cluster.local`".

Exemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # Actually, no port is needed.
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

If there exists a headless service in the same namespace as the pod and with
the same name as the subdomain, the cluster's KubeDNS Server also returns an A
record for the Pod's fully qualified hostname.
For example, given a Pod with the hostname set to "`busybox-1`" e o subdomínio definido como
"`default-subdomain`", e um serviço Headless chamado "`default-subdomain`" em
o mesmo namespace, o pod verá seu próprio FQDN como
"`busybox-1.default-subdomain.my-namespace.svc.cluster.local`". DNS serve um
Um registro com esse nome, apontando para o IP do Pod. Os dois pods"`busybox1`" e
"`busybox2`" pode ter seus registros A distintos.

O objeto Endpoints pode especificar o `hostname` para qualquer endpoint,
junto com seu IP.

{{< note >}}
Como os registros A não são criados para nomes de pods, `hostname` é necessário para o Pod A
registro a ser criado. Um Pod sem `hostname` mas com `subdomain` só vai criar o
Um recorde para o serviço sem cabeça (`default-subdomain.my-namespace.svc.cluster.local`),
apontando para o endereço IP do Pod. Além disso, o Pod precisa estar pronto para ter um
gravar a menos `publishNotReadyAddresses=True` está definido no serviço.
{{< /note >}}

### Pod's DNS Policy

DNS policies can be set on a per-pod basis. Currently Kubernetes supports the
following pod-specific DNS policies. These policies are specified in the
`dnsPolicy` field of a Pod Spec.

- "`Default`": The Pod inherits the name resolution configuration from the node
  that the pods run on.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)
  for more details.
- "`ClusterFirst`": Any DNS query that does not match the configured cluster
  domain suffix, such as "`www.kubernetes.io`", is forwarded to the upstream
  nameserver inherited from the node. Cluster administrators may have extra
  stub-domain and upstream DNS servers configured.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods)
  for details on how DNS queries are handled in those cases.
- "`ClusterFirstWithHostNet`": For Pods running with hostNetwork, you should
  explicitly set its DNS policy "`ClusterFirstWithHostNet`".
- "`None`": It allows a Pod to ignore DNS settings from the Kubernetes
  environment. All DNS settings are supposed to be provided using the
  `dnsConfig` field in the Pod Spec.
  See [Pod's DNS config](#pod-s-dns-config) subsection below.

{{< note >}}
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then “ClusterFirst” is used.
{{< /note >}}


The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Pod's DNS Config

Pod's DNS Config allows users more control on the DNS settings for a Pod.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:

- `nameservers`: a list of IP addresses that will be used as DNS servers for the
  Pod. There can be at most 3 IP addresses specified. When the Pod's `dnsPolicy`
  is set to "`None`", the list must contain at least one IP address, otherwise
  this property is optional.
  The servers listed will be combined to the base nameservers generated from the
  specified DNS policy with duplicate addresses removed.
- `searches`: a list of DNS search domains for hostname lookup in the Pod.
  This property is optional. When specified, the provided list will be merged
  into the base search domain names generated from the chosen DNS policy.
  Duplicate domain names are removed.
  Kubernetes allows for at most 6 search domains.
- `options`: an optional list of objects where each object may have a `name`
  property (required) and a `value` property (optional). The contents in this
  property will be merged to the options generated from the specified DNS policy.
  Duplicate entries are removed.

The following is an example Pod with custom DNS settings:

{{< codenew file="service/networking/custom-dns.yaml" >}}

When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:

```
nameserver 1.2.3.4
search ns1.svc.cluster.local my.dns.search.suffix
options ndots:2 edns0
```

For IPv6 setup, search path and name server should be setup like this:

```
$ kubectl exec -it dns-example -- cat /etc/resolv.conf
nameserver fd00:79:30::a
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

### Feature availability

The availability of Pod DNS Config and DNS Policy "`None`"" is shown as below.

| k8s version | Feature support |
| :---------: |:-----------:|
| 1.14 | Stable |
| 1.10 | Beta (on by default)|
| 1.9 | Alpha |

{{% /capture %}}

{{% capture whatsnext %}}

For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)

{{% /capture %}}


