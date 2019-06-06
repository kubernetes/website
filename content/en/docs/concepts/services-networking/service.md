---
reviewers:
- bprashanth
title: Service
feature:
  title: Service discovery and load balancing
  description: >
    No need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives pods their own IP addresses and a single DNS name for a set of pods, and can load-balance across them.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< glossary_definition term_id="service" length="short" >}}

No need to modify your application to use an unfamiliar service discovery mechanism.
Kubernetes gives pods their own IP addresses and a single DNS name for a set of pods,
and can load-balance across them.

{{% /capture %}}

{{% capture body %}}

## Motivation

Kubernetes {{< glossary_tooltip term_id="pod" text="Pods" >}}  are mortal.
They are born and when they die, they are not resurrected.
If you use a {{< glossary_tooltip term_id="deployment" >}} to run your app,
it can create and destroy Pods dynamically (e.g. when scaling out or in).

Each Pod gets its own IP address, however the set of Pods
for a Deployment running in one moment in time could be different from
the set of Pods running that application a moment later.

This leads to a problem: if some set of Pods (call them “backends”) provides
functionality to other Pods (call them “frontends”) inside your cluster,
how do those frontends find out and keep track of which IP address to connect
to, so that the frontend can use the backend part of the workload?

Enter _Services_.

## Service resources {#service-resource}

In Kubernetes, a Service is an abstraction which defines a logical set of Pods
and a policy by which to access them (you'll sometimes see this pattern called
a micro-service). The set of Pods targeted by a Service is usually determined
by a {{< glossary_tooltip text="selector" term_id="selector" >}}
(see [below](#services-without-selectors) for why you might want a Service
_without_ a selector).

For example: consider a stateless image-processing backend which is running with
3 replicas.  Those replicas are fungible&mdash;frontends do not care which backend
they use.  While the actual Pods that compose the backend set may change, the
frontend clients should not need to be aware of that, nor should they need to keep
track of the set of backends themselves.

The Service abstraction enables this decoupling.

### Cloud-native service discovery

If you're able to use Kubernetes APIs for service discovery in your application,
you can query the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
for Endpoints, that will be updated whenever the set of Pods in a Service changes.

For non-native applications, Kubernetes offers ways to place a network port or load
balancer in between your application and the backend Pods.

## Defining a service

A Service in Kubernetes is a REST object, similar to a Pod.  Like all of the
REST objects, you can `POST` a Service definition to the API server to create
a new instance.

For example, suppose you have a set of Pods that each listen on TCP port 9376
and carry a label `"app=MyApp"`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

This specification will create a new Service object named “my-service” which
targets TCP port 9376 on any Pod with the `"app=MyApp"` label.

This Service will also be assigned an IP address (sometimes called the "cluster IP"),
which is used by the service proxies
(see [Virtual IPs and service proxies](#virtual-ips-and-service-proxies) below).

The controller for the Service selector will continuously scan for Pods that
match its selector, and will then POST any updates to an Endpoint object
also named “my-service”.

{{< note >}}
A Service can map _any_ incoming `port` to a `targetPort`.  By default, and
for convenience, the `targetPort` will be set to the same value as the `port`
field.
{{< /note >}}

Port definitions in Pods have names, and you can reference these names in the
targetPort attribute of a Service. This will work even if there are a mixture
of Pods in the Service, with the same network protocol available via different
port numbers but a single configured name.
This offers a lot of flexibility for deploying and evolving your Services.
For example, you can change the port number that pods expose in the next
version of your backend software, without breaking clients.

The default protocol for services is TCP; you can also use any other
[supported protocol](#protocol-support).

As many Services need to expose more than one port, Kubernetes supports multiple
port definitions on a Service object.
Each port definition can have the same `protocol`, or a different one.

### Services without selectors

Services most commonly abstract access to Kubernetes Pods, but they can also
abstract other kinds of backends.  For example:

  * You want to have an external database cluster in production, but in your
    test environment you use your own databases.
  * You want to point your service to a service in a different
    {{< glossary_tooltip term_id="namespace" >}} or on another cluster.
  * You are migrating a workload to Kubernetes. Whilst evaluating the approach,
    you run only a proportion of your backends in Kubernetes.

In any of these scenarios you can define a service _without_ a Pod selector.
For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

Because this service has no selector, the corresponding Endpoint object will *not* be
created automatically. You can manually map the service to the network address and port
where it's running, by adding an Endpoint object manually:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```

{{< note >}}
The endpoint IPs _must not_ be: loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), or
link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6).

Endpoint IP addresses also cannot be the cluster IPs of other Kubernetes services,
because {{< glossary_tooltip term_id="kube-proxy" >}} doesn't support virtual IPs
as a destination.
{{< /note >}}

Accessing a Service without a selector works the same as if it had a selector.
In the example above, traffic will be routed to the single endpoint defined in
the YAML: `192.0.2.42:9376` (TCP).

An ExternalName Service is a special case of service that does not have
selectors and uses DNS names instead. For more information, see the
[ExternalName](#externalname) section later in this document.

## Virtual IPs and service proxies

Every node in a Kubernetes cluster runs a `kube-proxy`. `kube-proxy` is
responsible for implementing a form of virtual IP for `Services` of type other
than [`ExternalName`](#externalname).

### Why not use round-robin DNS?

A question that pops up every now and then is why Kubernetes relies on
proxying to forward inbound traffic to backends. What about other
approaches? For example, would it be possible to configure DNS records that
have multiple A values (or AAAA for IPv6), and rely on round-robin name
resolution?

There are a few reasons for using proxying for Services:

 * There is a long history of DNS implementations not respecting record TTLs,
   and caching the results of name lookups after they should have expired.
 * Some apps do DNS lookups only once and cache the results indefinitely.
 * Even if apps and libraries did proper re-resolution, the low or zero TTLs
   on the DNS records involve could impose a high load on DNS, that then
   becomes difficult to manage.

### Version compatibility

Since Kubernetes v1.0 you have been able to use the
[userspace proxy mode](#proxy-mode-userspace).
Kubernetes v1.1 added iptables mode proxying, and in Kubernetes v1.2 the
iptables mode for kube-proxy became the default.
Kubernetes v1.8 added ipvs proxy mode.

### User space proxy mode {#proxy-mode-userspace}

In this mode, kube-proxy watches the Kubernetes master for the addition and
removal of Service and Endpoint objects. For each Service it opens a
port (randomly chosen) on the local node.  Any connections to this "proxy port"
will be proxied to one of the Service's backend Pods (as reported via
Endpoints). kube-proxy takes the `SessionAffinity` setting of the Service into
account when deciding which backend Pod to use.

Lastly, the user-space proxy installs iptables rules which capture traffic to
the Service's `clusterIP` (which is virtual) and `port`. The rules
redirect that traffic to the proxy port which proxies the backend Pod.

By default, kube-proxy in userspace mode chooses a backend via a round-robin algorithm.

![Services overview diagram for userspace proxy](/images/docs/services-userspace-overview.svg)

### `iptables` proxy mode {#proxy-mode-iptables}

In this mode, kube-proxy watches the Kubernetes control plane for the addition and
removal of Service and Endpoint objects. For each Service, it installs
iptables rules which capture traffic to the Service's `clusterIP` (which is
virtual) and `port` and redirects that traffic to one of the Service's
backend sets.  For each Endpoint object, it installs iptables rules which
select a backend Pod.

By default, kube-proxy in iptables mode chooses a backend at random.

Using iptables to handle traffic has a lower system overhead, because traffic
is handled by Linux netfilter without the need switch between userspace and the
kernel space. This approach is also likely to be more reliable.

If kube-proxy is running in iptables mode and the first Pod that's selected
does not respond, the connection will fail. This is different from userspace
mode: in that scenario, kube-proxy would detect that the connection to the first
Pod had failed and would automatically retry with a different backend Pod.

You can use Pod [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
to verify that backend Pods are working OK, so that kube-proxy in iptables mode
only sees backends that test out as healthy. Doing this means means you avoid
having traffic sent via kube-proxy to a Pod that's known to have failed.

![Services overview diagram for iptables proxy](/images/docs/services-iptables-overview.svg)

### IPVS proxy mode {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

In `ipvs` mode, kube-proxy watches Kubernetes Services and Endpoints,
calls `netlink` interface to create IPVS rules accordingly and synchronizes
IPVS rules with Kubernetes Services and Endpoints periodically.
This control loop ensures that IPVS status matches the desired
state.
When accessing a Service, IPVS will direct traffic to one of the backend Pods.

The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses hash table as the underlying data structure and works
in the kernel space.
That means kube-proxy in IPVS mode redirects traffic with a lower latency than
kube-proxy in iptables mode, with much better performance when synchronising
proxy rules. Compared to the other proxy modes, IPVS mode also supports a
higher throughput of network traffic.

IPVS provides more options for balancing traffic to backend Pods;
these are:

- `rr`: round-robin
- `lc`: least connection (smallest number of open connections)
- `dh`: destination hashing
- `sh`: source hashing
- `sed`: shortest expected delay
- `nq`: never queue

{{< note >}}
To run kube-proxy in IPVS mode, you must make the IPVS Linux available on
the node before you starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it will verify whether IPVS
kernel modules are available, and if those are not detected then kube-proxy
fall back to running in iptables proxy mode.
{{< /note >}}

![Services overview diagram for IPVS proxy](/images/docs/services-ipvs-overview.svg)

In any of these proxy models, any traffic bound for the Service’s IP:Port is
proxied to an appropriate backend without the clients knowing anything
about Kubernetes or Services or Pods.

If you want to make sure that connections from a particular client
are passed to the same Pod each time, you can select session affinity based
the on client's IP addresses by setting `service.spec.sessionAffinity` to "ClientIP"
(the default is "None").
You can then also set the maximum session sticky time by setting
`service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` appropriately.
(the default value is 10800, which works out to be 3 hours).

## Multi-Port Services

For some Services, you need to expose more than one port.
Kubernetes lets you configure multiple port definitions on a Service object.
When using multiple ports for a Service, you must give all of your ports names
so that these are unambiguous. For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  - name: https
    protocol: TCP
    port: 443
    targetPort: 9377
```

{{< note >}}
As with Kubernetes {{< glossary_tooltip term_id="name" text="names">}} in general, names for ports
must only contain lowercase alphanumeric characters and `-`. Port names must
also start and end with an alphanumeric character.

For example, the names `123-abc` and `web` are valid, but `123_abc` and `-web` are not.
{{< /note >}}

## Choosing your own IP address

You can specify your own cluster IP address as part of a `Service` creation
request.  To do this, set the `.spec.clusterIP` field. For example, if you
already have an existing DNS entry that you wish to reuse, or legacy systems
that are configured for a specific IP address and difficult to re-configure.

The IP address that you choose must be a valid IPv4 or IPv6 address from within the
`service-cluster-ip-range` CIDR range that is configured for the API server.
If you try to create a Service with an invalid clusterIP address value, the API
server will returns a 422 HTTP status code to indicate that there's a problem.

## Discovering services

Kubernetes supports 2 primary modes of finding a Service - environment
variables and DNS.

### Environment variables

When a Pod is run on a Node, the kubelet adds a set of environment variables
for each active Service.  It supports both [Docker links
compatible](https://docs.docker.com/userguide/dockerlinks/) variables (see
[makeLinkVariables](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L49))
and simpler `{SVCNAME}_SERVICE_HOST` and `{SVCNAME}_SERVICE_PORT` variables,
where the Service name is upper-cased and dashes are converted to underscores.

For example, the Service `"redis-master"` which exposes TCP port 6379 and has been
allocated cluster IP address 10.0.0.11 produces the following environment
variables:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
When you have a Pod that might need to acccess a Service, and you are using
the environment variable method to publish the port and cluster IP to the client
Pods, you must create the Service *before* the client Pods come into existence.
Otherwise, those client Pods won't have their environment variables populated.

If you only use DNS to discover the cluster IP for a Service, you don't need to
worry about this ordering issue.
{{< /note >}}

### DNS

You can (and almost always should) set up a DNS service for your Kubernetes
cluster using an [add-on](/docs/concepts/cluster-administration/addons/).

A cluster-aware DNS server, such as CoreDNS, watches the Kubernetes API for new
Services and creates a set of DNS records for each one.  If DNS has been enabled
throughout your cluster then all Pods should automatically be able to resolve
Services by their DNS name.

For example, if you have a Service called `"my-service"` in a Kubernetes
Namespace `"my-ns"`, the control plane and the DNS service acting together will
create a DNS record for `"my-service.my-ns"`. Pods in the `"my-ns"` Namespace
should be able to find it by simply doing a name lookup for `my-service`
(`"my-service.my-ns"` would also work).

Pods in other Namespaces must qualify the name as `my-service.my-ns`. These names
will resolve to the cluster IP assigned for the Service.

Kubernetes also supports DNS SRV (service) records for named ports.  If the
`"my-service.my-ns"` Service has a port named `"http"` with protocol set to
`TCP`, you can do a DNS SRV query for `_http._tcp.my-service.my-ns` to discover
the port number for `"http"`, as well as the IP address.

The Kubernetes DNS server is the only way to access `ExternalName` Services.
You can find more information about `ExternalName` resolution in
[DNS Pods and Services](/docs/concepts/services-networking/dns-pod-service/).

## Headless services

Sometimes you don't need or want load-balancing and a single service IP.  In
this case, you can create what are termed “headless” Services, by explicitly
specifying `"None"` for the cluster IP (`.spec.clusterIP`).

You can use a headless Service to interface with other service discovery mechanisms,
without being tied to Kubernetes' implementation. For example, you could implement
a custom [Operator](
be built upon this API.

For such `Services`, a cluster IP is not allocated, kube-proxy does not handle
these services, and there is no load balancing or proxying done by the platform
for them. How DNS is automatically configured depends on whether the service has
selectors defined.

### With selectors

For headless services that define selectors, the endpoints controller creates
`Endpoints` records in the API, and modifies the DNS configuration to return A
records (addresses) that point directly to the `Pods` backing the `Service`.

### Without selectors

For headless services that do not define selectors, the endpoints controller does
not create `Endpoints` records. However, the DNS system looks for and configures
either:

  * CNAME records for [`ExternalName`](#externalname)-type services.
  * A records for any `Endpoints` that share a name with the service, for all
    other types.

## Publishing services (ServiceTypes) {#publishing-services-service-types}

For some parts of your application (e.g. frontends) you may want to expose a
Service onto an external IP address, one that's outside of your cluster.

Kubernetes `ServiceTypes` allow you to specify what kind of service you want.
The default is `ClusterIP`.

`Type` values and their behaviors are:

   * `ClusterIP`: Exposes the service on a cluster-internal IP. Choosing this value
     makes the service only reachable from within the cluster. This is the
     default `ServiceType`.
   * [`NodePort`](#nodeport): Exposes the service on each Node's IP at a static port
     (the `NodePort`). A `ClusterIP` service, to which the `NodePort` service will
     route, is automatically created.  You'll be able to contact the `NodePort` service,
     from outside the cluster,
     by requesting `<NodeIP>:<NodePort>`.
   * [`LoadBalancer`](#loadbalancer): Exposes the service externally using a cloud
     provider's load balancer. `NodePort` and `ClusterIP` services, to which the external
     load balancer will route, are automatically created.
   * [`ExternalName`](#externalname): Maps the service to the contents of the
     `externalName` field (e.g. `foo.bar.example.com`), by returning a `CNAME` record
     with its value. No proxying of any kind is set up.

{{< note >}}

You need CoreDNS version 1.7 or higher to use the `ExternalName` type.

{{< /note >}}

### Type NodePort {#nodeport}

If you set the `type` field to `NodePort`, the Kubernetes control plane will
allocate a port from a range specified by `--service-node-port-range` flag (default: 30000-32767).
Each node will proxy that port each (the same port number on every Node) into your Service.
Your service will report that allocated port in its `.spec.ports[*].nodePort` field.


If you want to specify particular IP(s) to proxy the port, you can set the `--nodeport-addresses` flag in kube-proxy to particular IP block(s); this is supported since Kubernetes v1.10.
This flag takes a comma-delimited list of IP blocks (e.g. 10.0.0.0/8, 192.0.2.0/25) to specify IP address ranges that kube-proxy should consider as local to this node.

For example, if you start kube-proxy with flag `--nodeport-addresses=127.0.0.0/8`, kube-proxy will select only the loopback interface for NodePort Services. The default for `--nodeport-addresses` is an empty list, and means that kube-proxy  should consider all available network interfaces for NodePort. (That's also compatible with earlier Kubernetes releases).

If you want a specific port number, you can specify a value in the `nodePort`
field. The control plane will either allocate you that port or report that
the API transaction failed.
This means that you need to take care about possible port collisions yourself).
You also have to use a valid port number, one that's inside the range configured
for NodePort use.

Using a NodePort gives you the freedom to set up your own load balancing solution,
to configure environments that are not fully supported by Kubernetes, or even
to just expose one or more nodes' IPs directly.

Note that this Service will be visible as both `<NodeIP>:spec.ports[*].nodePort`
and `.spec.clusterIP:spec.ports[*].port`. (If the `--nodeport-addresses` flag in kube-proxy is set, <NodeIP> would be filtered NodeIP(s).)

### Type LoadBalancer {#loadbalancer}

On cloud providers which support external load balancers, setting the `type`
field to `LoadBalancer` will provision a load balancer for your Service.
The actual creation of the load balancer happens asynchronously, and
information about the provisioned balancer will be published in the Service's
`.status.loadBalancer` field.  For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  clusterIP: 10.0.171.239
  loadBalancerIP: 78.11.24.19
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 146.148.47.155
```

Traffic from the external load balancer will be directed at the backend Pods,
though exactly how that works depends on the cloud provider.

Some cloud providers allow you to specify the `loadBalancerIP`. In those cases, the load-balancer will be created
with the user-specified `loadBalancerIP`. If the `loadBalancerIP` field is not specified,
the loadBalancer will be set up with an ephemeral IP address. If you specify a `loadBalancerIP`
but your cloud provider does not support the feature, the `loadbalancerIP` field that you
set will be ignored.

{{< note >}}
If you're using SCTP, see the [caveat](#caveat-sctp-loadbalancer-service-type) below about the
`LoadBalancer` Service type.
{{< /note >}}

{{< note >}}

On **Azure**, if you want to use a user-specified public type `loadBalancerIP`, you first need
to create a static type public IP address resource. This public IP address resource should
be in the same resource group of the other automatically created resources of the cluster.
For example, `MC_myResourceGroup_myAKSCluster_eastus`.

Specify the assigned IP address as loadBalancerIP. Ensure that you have updated the securityGroupName in the cloud provider configuration file. For information about troubleshooting `CreatingLoadBalancerFailed` permission issues see, [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](https://docs.microsoft.com/en-us/azure/aks/static-ip) or [CreatingLoadBalancerFailed on AKS cluster with advanced networking](https://github.com/Azure/AKS/issues/357).

{{< /note >}}

#### Internal load balancer
In a mixed environment it is sometimes necessary to route traffic from services inside the same
(virtual) network address block.

In a split-horizon DNS environment you would need two services to be able to route both external and internal traffic to your endpoints.

You can achieve this by adding one the following annotations to a Service.
The annotation to add depends on the cloud service provider you're using.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Select one of the tabs.
{{% /tab %}}
{{% tab name="GCP" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```
Use `cloud.google.com/load-balancer-type: "internal"` for masters with version 1.7.0 to 1.7.3.
For more information, see the [docs](https://cloud.google.com/kubernetes-engine/docs/internal-load-balancing).
{{% /tab %}}
{{% tab name="AWS" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0
[...]
```
{{% /tab %}}
{{% tab name="Azure" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="OpenStack" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```
{{% /tab %}}
{{% tab name="Baidu Cloud" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```
{{% /tab %}}
{{< /tabs >}}


#### TLS support on AWS {#ssl-support-on-aws}

For partial TLS / SSL support on clusters running on AWS, you can add three
annotations to a `LoadBalancer` service:

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

The first specifies the ARN of the certificate to use. It can be either a
certificate from a third party issuer that was uploaded to IAM or one created
within AWS Certificate Manager.

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

The second annotation specifies which protocol a Pod speaks. For HTTPS and
SSL, the ELB will expect the Pod to authenticate itself over the encrypted
connection, using a certificate.

HTTP and HTTPS will select layer 7 proxying: the ELB will terminate
the connection with the user, parse headers and inject the `X-Forwarded-For`
header with the user's IP address (Pods will only see the IP address of the
ELB at the other end of its connection) when forwarding requests.

TCP and SSL will select layer 4 proxying: the ELB will forward traffic without
modifying the headers.

In a mixed-use environment where some ports are secured and others are left unencrypted,
you can use the following annotations:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

In the above example, if the service contained three ports, `80`, `443`, and
`8443`, then `443` and `8443` would use the SSL certificate, but `80` would just
be proxied HTTP.

From Kubernetes v1.9 onwrds you can use [predefined AWS SSL policies](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) with HTTPS or SSL listeners for your Services.
To see which policies are available for use, you can the `aws` command line tool:

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

You can then specify any one of those policies using the
"`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`"
annotation; for example:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### PROXY protocol support on AWS

To enable [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
support for clusters running on AWS, you can use the following service
annotation:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Since version 1.3.0, the use of this annotation applies to all ports proxied by the ELB
and cannot be configured otherwise.

#### ELB Access Logs on AWS

There are several annotations to manage access logs for ELB services on AWS.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`
controls whether access logs are enabled.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`
controls the interval in minutes for publishing the access logs. You can specify
an interval of either 5 or 60 minutes.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`
controls the name of the Amazon S3 bucket where load balancer access logs are
stored.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
specifies the logical hierarchy you created for your Amazon S3 bucket.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # Specifies whether access logs are enabled for the load balancer
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # The interval for publishing the access logs. You can specify an interval of either 5 or 60 (minutes).
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # The name of the Amazon S3 bucket where the access logs are stored
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod`
```

#### Connection Draining on AWS

Connection draining for Classic ELBs can be managed with the annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` set
to the value of `"true"`. The annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` can
also be used to set maximum time, in seconds, to keep the existing connections open before deregistering the instances.


```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### Other ELB annotations

There are other annotations to manage Classic Elastic Load Balancers that are described below.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
        # The time, in seconds, that the connection is allowed to be idle (no data has been sent over the connection) before it is closed by the load balancer

        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        # Specifies whether cross-zone load balancing is enabled for the load balancer

        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
        # A comma-separated list of key-value pairs which will be recorded as
        # additional tags in the ELB.

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
        # The number of successive successful health checks required for a backend to
        # be considered healthy for traffic. Defaults to 2, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
        # The number of unsuccessful health checks required for a backend to be
        # considered unhealthy for traffic. Defaults to 6, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
        # The approximate interval, in seconds, between health checks of an
        # individual instance. Defaults to 10, must be between 5 and 300
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
        # The amount of time, in seconds, during which no response means a failed
        # health check. This value must be less than the service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
        # value. Defaults to 5, must be between 2 and 60

        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
        # A list of additional security groups to be added to the ELB
```

#### Network Load Balancer support on AWS [alpha] {#aws-nlb-support}

{{< warning >}}
This is an alpha feature and is not yet recommended for production clusters.
{{< /warning >}}

Starting from Kubernetes v1.9.0, you can use AWS Network Load Balancer (NLB) with Services. To
use a Network Load Balancer on AWS, use the annotation `service.beta.kubernetes.io/aws-load-balancer-type`
with the value set to `nlb`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{< note >}}
NLB only works with certain instance classes; see the [AWS documentation](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)
on Elastic Load Balancing for a list of supported instance types.
{{< /note >}}

Unlike Classic Elastic Load Balancers, Network Load Balancers (NLBs) forward the
client's IP address through to the node. If a service's `.spec.externalTrafficPolicy`
is set to `Cluster`, the client's IP address will not be propagated to the end
pods.

By setting `.spec.externalTrafficPolicy` to `Local`, client IP addresses will be
propagated to the end pods, but this could result in uneven distribution of
traffic. Nodes without any pods for a particular LoadBalancer service will fail
the NLB Target Group's health check on the auto-assigned
`.spec.healthCheckNodePort` and not receive any traffic.

In order to achieve even traffic, either use a DaemonSet, or specify a
[pod anti-affinity](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)
to not locate on the same node.

You can also use NLB Services with the [internal load balancer](/docs/concepts/services-networking/service/#internal-load-balancer)
annotation.

In order for client traffic to reach instances behind an NLB, the Node security
groups are modified with the following IP rules:

| Rule | Protocol | Port(s) | IpRange(s) | IpRange Description |
|------|----------|---------|------------|---------------------|
| Health Check | TCP | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | VPC CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| Client Traffic | TCP | NodePort(s) | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTU Discovery | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

In order to limit which client IP's can access the Network Load Balancer,
specify `loadBalancerSourceRanges`.

```yaml
spec:
  loadBalancerSourceRanges:
  - "143.231.0.0/16"
```

{{< note >}}
If `.spec.loadBalancerSourceRanges` is not set, Kubernetes will
allow traffic from `0.0.0.0/0` to the Node Security Group(s). If nodes have
public IP addresses, be aware that non-NLB traffic can also reach all instances
in those modified security groups.

{{< /note >}}

### Type ExternalName {#externalname}

Services of type ExternalName map a service to a DNS name, not to a typical selector such as
`my-service` or `cassandra`. You specify these services with the `spec.externalName` parameter.

This Service definition, for example, maps
the `my-service` Service in the `prod` namespace to `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```
{{< note >}}
ExternalName accepts an IPv4 address string, but as a DNS names comprised of digits, not as an IP address. ExternalNames that resemble IPv4 addresses are not resolved by CoreDNS or ingress-nginx because ExternalName
is intended to specify a canonical DNS name. To hardcode an IP address, consider using
[headless services](#headless-services).
{{< /note >}}

When looking up the host `my-service.prod.svc.cluster.local`, the cluster DNS service
will return a `CNAME` record with the value `my.database.example.com`. Accessing
`my-service` works in the same way as other Services but with the crucial
difference that redirection happens at the DNS level rather than via proxying or
forwarding. Should you later decide to move your database into your cluster, you
can start its pods, add appropriate selectors or endpoints, and change the
Service's `type`.


{{< note >}}
This section is indebted to the [Kubernetes Tips - Part
1](https://akomljen.com/kubernetes-tips-part-1/) blog post from [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes services can be exposed on those
`externalIPs`. Traffic that ingresses into the cluster with the external IP (as destination IP), on the service port,
will be routed to one of the service endpoints. `externalIPs` are not managed by Kubernetes and are the responsibility
of the cluster administrator.

In the Service spec, `externalIPs` can be specified along with any of the `ServiceTypes`.
In the example below, "`my-service`" can be accessed by clients on "`80.11.12.10:80`" (`externalIP:port`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  externalIPs:
  - 80.11.12.10
```

## Shortcomings

Using the userspace proxy for VIPs will work at small to medium scale, but will
not scale to very large clusters with thousands of Services.  The [original
design proposal for portals](http://issue.k8s.io/1107) has more details on
this.

Using the userspace proxy obscures the source IP address of a packet accessing
a Service.
This makes some kinds of network filtering (firewalling) impossible.  The iptables
proxy mode does not
obscure in-cluster source IPs, but it does still impact clients coming through
a load balancer or node-port.

The `Type` field is designed as nested functionality - each level adds to the
previous.  This is not strictly required on all cloud providers (e.g. Google Compute Engine does
not need to allocate a `NodePort` to make `LoadBalancer` work, but AWS does)
but the current API requires it.

## Virtual IP implementation {#the-gory-details-of-virtual-ips}

The previous information should be sufficient for many people who just want to
use Services.  However, there is a lot going on behind the scenes that may be
worth understanding.

### Avoiding collisions

One of the primary philosophies of Kubernetes is that you should not be
exposed to situations that could cause your actions to fail through no fault
of your own. For the design of the Service resource, this means not making
you choose your own port number for a if that choice might collide with
someone else's choice.  That is an isolation failure.

In order to allow you to choose a port number for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address.

To ensure each service receives a unique IP, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.

In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to checking for invalid
assignments (eg due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.

### Service IP addresses {#ips-and-vips}

Unlike Pod IP addresses, which actually route to a fixed destination,
Service IPs are not actually answered by a single host.  Instead, kube-proxy
uses iptables (packet processing logic in Linux) to define _virtual_ IP addresses
which are transparently redirected as needed.  When clients connect to the
VIP, their traffic is automatically transported to an appropriate endpoint.
The environment variables and DNS for Services are actually populated in
terms of the Service's virtual IP address (and port).

kube-proxy supports three proxy modes&mdash;userspace, iptables and IPVS&mdash;which
each operate slightly differently.

#### Userspace

As an example, consider the image processing application described above.
When the backend Service is created, the Kubernetes master assigns a virtual
IP address, for example 10.0.0.1.  Assuming the Service port is 1234, the
Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it opens a new random port, establishes an
iptables redirect from the virtual IP address to this new port, and starts accepting
connections on it.

When a client connects to the Service's virtual IP address, the iptables
rule kicks in, and redirects the packets to the proxy's own port.
The “Service proxy” chooses a backend, and starts proxying traffic from the client to the backend.

This means that Service owners can choose any port they want without risk of
collision.  Clients can simply connect to an IP and port, without being aware
of which Pods they are actually accessing.

#### iptables

Again, consider the image processing application described above.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  Assuming the Service port is 1234, the
Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it installs a series of iptables rules which
redirect from the virtual IP address  to per-Service rules.  The per-Service
rules link to per-Endpoint rules which redirect traffic (using destination NAT)
to the backends.

When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are
redirected to the backend.  Unlike the userspace proxy, packets are never
copied to userspace, the kube-proxy does not have to be running for the virtual
IP address to work, and Nodes see traffic arriving from the unaltered client IP
address.

This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP does get altered.

#### IPVS

iptables operations slow down dramatically in large scale cluster e.g 10,000 Services.
IPVS is designed for load balancing and based on in-kernel hash tables. So you can achieve performance consistency in large number of services from IPVS-based kube-proxy. Meanwhile, IPVS-based kube-proxy has more sophisticated load balancing algorithms (least conns, locality, weighted, persistence).

## API Object

Service is a top-level resource in the Kubernetes REST API. You can find more details
about the API object at: [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Supported protocols {#protocol-support}

### TCP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

You can use TCP for any kind of service, and it's the default network protocol.

### UDP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

You can use UDP for most services. For type=LoadBalancer services, UDP support
depends on the cloud provider offering this facility.

### HTTP

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

If your cloud provider supports it, you can use a Service in LoadBalancer mode
to set up external HTTP / HTTPS reverse proxying, forwarded to the Endpoints
of the Service.

{{< note >}}
You can also use {{< glossary_tooltip term_id="ingress" >}} in place of Service
to expose HTTP / HTTPS services.
{{< /note >}}

### PROXY protocol

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

If your cloud provider supports it (eg, [AWS](/docs/concepts/cluster-administration/cloud-providers/#aws)),
you can use a Service in LoadBalancer mode to configure a load balancer outside
of Kubernetes itself, that will forward connections prefixed with
[PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

The load balancer will send an initial series of octets describing the
incoming connection, similar to this example

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
followed by the data from the client.

### SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kubernetes supports SCTP as a `protocol` value in Service, Endpoint, NetworkPolicy and Pod definitions as an alpha feature. To enable this feature, the cluster administrator needs to enable the `SCTPSupport` feature gate on the apiserver, for example, `--feature-gates=SCTPSupport=true,…`.

When the feature gate is enabled, you can set the `protocol` field of a Service, Endpoint, NetworkPolicy or Pod to `SCTP`. Kubernetes sets up the network accordingly for the SCTP associations, just like it does for TCP connections.

#### Warnings {#caveat-sctp-overview}

##### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

{{< warning >}}
The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.
{{< /warning >}}

##### Service with type=LoadBalancer {#caveat-sctp-loadbalancer-service-type}

{{< warning >}}
You can only create a Service with `type` LoadBalancer plus `protocol` SCTP if the cloud provider's load balancer implementation supports SCTP as a protocol. Otherwise, the Service creation request is rejected. The current set of cloud load balancer providers (Azure, AWS, CloudStack, GCE, OpenStack) all lack support for SCTP.
{{< /warning >}}

##### Windows {#caveat-sctp-windows-os}

{{< warning >}}
SCTP is not supported on Windows based nodes.
{{< /warning >}}

##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
The kube-proxy does not support the management of SCTP associations when it is in userspace mode.
{{< /warning >}}

## Future work

In the future, the proxy policy for Services can become more nuanced than
simple round-robin balancing, for example master-elected or sharded.  We also
envision that some Services will have "real" load balancers, in which case the
virtual IP address will simply transport the packets there.

The Kubernetes project intends to improve support for L7 (HTTP) Services.

The Kubernetes project intends to have more flexible ingress modes for Services
which encompass the current ClusterIP, NodePort, and LoadBalancer modes and more.


{{% /capture %}}

{{% capture whatsnext %}}

* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
* Read about [Ingress](/docs/concepts/services-networking/ingress/)

{{% /capture %}}
