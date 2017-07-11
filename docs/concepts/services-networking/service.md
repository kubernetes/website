---
assignees:
- bprashanth
title: Services
redirect_from:
- "/docs/user-guide/services/"
- "/docs/user-guide/services/index.html"
---

Kubernetes [`Pods`](/docs/user-guide/pods) are mortal. They are born and when they die, they
are not resurrected.  [`ReplicationControllers`](/docs/user-guide/replication-controller) in
particular create and destroy `Pods` dynamically (e.g. when scaling up or down
or when doing [rolling updates](/docs/user-guide/kubectl/v1.7/#rolling-update)).  While each `Pod` gets its own IP address, even
those IP addresses cannot be relied upon to be stable over time. This leads to
a problem: if some set of `Pods` (let's call them backends) provides
functionality to other `Pods` (let's call them frontends) inside the Kubernetes
cluster, how do those frontends find out and keep track of which backends are
in that set?

Enter `Services`.

A Kubernetes `Service` is an abstraction which defines a logical set of `Pods`
and a policy by which to access them - sometimes called a micro-service.  The
set of `Pods` targeted by a `Service` is (usually) determined by a [`Label
Selector`](/docs/concepts/overview/working-with-objects/labels/#label-selectors) (see below for why you might want a
`Service` without a selector).

As an example, consider an image-processing backend which is running with 3
replicas.  Those replicas are fungible - frontends do not care which backend
they use.  While the actual `Pods` that compose the backend set may change, the
frontend clients should not need to be aware of that or keep track of the list
of backends themselves.  The `Service` abstraction enables this decoupling.

For Kubernetes-native applications, Kubernetes offers a simple `Endpoints` API
that is updated whenever the set of `Pods` in a `Service` changes.  For
non-native applications, Kubernetes offers a virtual-IP-based bridge to Services
which redirects to the backend `Pods`.

* TOC
{:toc}

## Defining a service

A `Service` in Kubernetes is a REST object, similar to a `Pod`.  Like all of the
REST objects, a `Service` definition can be POSTed to the apiserver to create a
new instance.  For example, suppose you have a set of `Pods` that each expose
port 9376 and carry a label `"app=MyApp"`.

```yaml
kind: Service
apiVersion: v1
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

This specification will create a new `Service` object named "my-service" which
targets TCP port 9376 on any `Pod` with the `"app=MyApp"` label.  This `Service`
will also be assigned an IP address (sometimes called the "cluster IP"), which
is used by the service proxies (see below).  The `Service`'s selector will be
evaluated continuously and the results will be POSTed to an `Endpoints` object
also named "my-service".

Note that a `Service` can map an incoming port to any `targetPort`.  By default
the `targetPort` will be set to the same value as the `port` field.  Perhaps
more interesting is that `targetPort` can be a string, referring to the name of
a port in the backend `Pods`.  The actual port number assigned to that name can
be different in each backend `Pod`. This offers a lot of flexibility for
deploying and evolving your `Services`.  For example, you can change the port
number that pods expose in the next version of your backend software, without
breaking clients.

Kubernetes `Services` support `TCP` and `UDP` for protocols.  The default
is `TCP`.

### Services without selectors

Services generally abstract access to Kubernetes `Pods`, but they can also
abstract other kinds of backends.  For example:

  * You want to have an external database cluster in production, but in test
    you use your own databases.
  * You want to point your service to a service in another
    [`Namespace`](/docs/user-guide/namespaces) or on another cluster.
  * You are migrating your workload to Kubernetes and some of your backends run
    outside of Kubernetes.

In any of these scenarios you can define a service without a selector:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Because this service has no selector, the corresponding `Endpoints` object will not be
created. You can manually map the service to your own specific endpoints:

```yaml
kind: Endpoints
apiVersion: v1
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 1.2.3.4
    ports:
      - port: 9376
```

NOTE: Endpoint IPs may not be loopback (127.0.0.0/8), link-local
(169.254.0.0/16), or link-local multicast (224.0.0.0/24).

Accessing a `Service` without a selector works the same as if it had selector.
The traffic will be routed to endpoints defined by the user (`1.2.3.4:9376` in
this example).

An ExternalName service is a special case of service that does not have
selectors. It does not define any ports or endpoints. Rather, it serves as a
way to return an alias to an external service residing outside the cluster.

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

When looking up the host `my-service.prod.svc.CLUSTER`, the cluster DNS service
will return a `CNAME` record with the value `my.database.example.com`. Accessing
such a service works in the same way as others, with the only difference that
the redirection happens at the DNS level and no proxying or forwarding occurs.
Should you later decide to move your database into your cluster, you can start
its pods, add appropriate selectors or endpoints and change the service `type`.

## Virtual IPs and service proxies

Every node in a Kubernetes cluster runs a `kube-proxy`.  `kube-proxy` is
responsible for implementing a form of virtual IP for `Services` of type other
than `ExternalName`.
In Kubernetes v1.0 the proxy was purely in userspace.  In Kubernetes v1.1 an
iptables proxy was added, but was not the default operating mode.  Since
Kubernetes v1.2, the iptables proxy is the default.

As of Kubernetes v1.0, `Services` are a "layer 4" (TCP/UDP over IP) construct.
In Kubernetes v1.1 the `Ingress` API was added (beta) to represent "layer 7"
(HTTP) services.

### Proxy-mode: userspace

In this mode, kube-proxy watches the Kubernetes master for the addition and
removal of `Service` and `Endpoints` objects. For each `Service` it opens a
port (randomly chosen) on the local node.  Any connections to this "proxy port"
will be proxied to one of the `Service`'s backend `Pods` (as reported in
`Endpoints`).  Which backend `Pod`  to use is decided based on the
`SessionAffinity` of the `Service`.  Lastly, it installs iptables rules which
capture traffic to the `Service`'s `clusterIP` (which is virtual) and `Port`
and redirects that traffic to the proxy port which proxies the backend `Pod`.

The net result is that any traffic bound for the `Service`'s IP:Port is proxied
to an appropriate backend without the clients knowing anything about Kubernetes
or `Services` or `Pods`.

By default, the choice of backend is round robin.  Client-IP based session affinity
can be selected by setting `service.spec.sessionAffinity` to `"ClientIP"` (the
default is `"None"`).

![Services overview diagram for userspace proxy](/images/docs/services-userspace-overview.svg)

### Proxy-mode: iptables

In this mode, kube-proxy watches the Kubernetes master for the addition and
removal of `Service` and `Endpoints` objects. For each `Service` it installs
iptables rules which capture traffic to the `Service`'s `clusterIP` (which is
virtual) and `Port` and redirects that traffic to one of the `Service`'s
backend sets.  For each `Endpoints` object it installs iptables rules which
select a backend `Pod`.

By default, the choice of backend is random.  Client-IP based session affinity
can be selected by setting `service.spec.sessionAffinity` to `"ClientIP"` (the
default is `"None"`).

As with the userspace proxy, the net result is that any traffic bound for the
`Service`'s IP:Port is proxied to an appropriate backend without the clients
knowing anything about Kubernetes or `Services` or `Pods`. This should be
faster and more reliable than the userspace proxy. However, unlike the
userspace proxier, the iptables proxier cannot automatically retry another
`Pod` if the one it initially selects does not respond, so it depends on
having working [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#defining-readiness-probes).

![Services overview diagram for iptables proxy](/images/docs/services-iptables-overview.svg)

## Multi-Port Services

Many `Services` need to expose more than one port.  For this case, Kubernetes
supports multiple port definitions on a `Service` object.  When using multiple
ports you must give all of your ports names, so that endpoints can be
disambiguated.  For example:

```yaml
kind: Service
apiVersion: v1
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

## Choosing your own IP address

You can specify your own cluster IP address as part of a `Service` creation
request.  To do this, set the `spec.clusterIP` field. For example, if you
already have an existing DNS entry that you wish to replace, or legacy systems
that are configured for a specific IP address and difficult to re-configure.
The IP address that a user chooses must be a valid IP address and within the
`service-cluster-ip-range` CIDR range that is specified by flag to the API
server.  If the IP address value is invalid, the apiserver returns a 422 HTTP
status code to indicate that the value is invalid.

### Why not use round-robin DNS?

A question that pops up every now and then is why we do all this stuff with
virtual IPs rather than just use standard round-robin DNS.  There are a few
reasons:

   * There is a long history of DNS libraries not respecting DNS TTLs and
     caching the results of name lookups.
   * Many apps do DNS lookups once and cache the results.
   * Even if apps and libraries did proper re-resolution, the load of every
     client re-resolving DNS over and over would be difficult to manage.

We try to discourage users from doing things that hurt themselves.  That said,
if enough people ask for this, we may implement it as an alternative.

## Discovering services

Kubernetes supports 2 primary modes of finding a `Service` - environment
variables and DNS.

### Environment variables

When a `Pod` is run on a `Node`, the kubelet adds a set of environment variables
for each active `Service`.  It supports both [Docker links
compatible](https://docs.docker.com/userguide/dockerlinks/) variables (see
[makeLinkVariables](http://releases.k8s.io/{{page.githubbranch}}/pkg/kubelet/envvars/envvars.go#L49))
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

*This does imply an ordering requirement* - any `Service` that a `Pod` wants to
access must be created before the `Pod` itself, or else the environment
variables will not be populated.  DNS does not have this restriction.

### DNS

An optional (though strongly recommended) [cluster
add-on](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md) is a DNS server.  The
DNS server watches the Kubernetes API for new `Services` and creates a set of
DNS records for each.  If DNS has been enabled throughout the cluster then all
`Pods` should be able to do name resolution of `Services` automatically.

For example, if you have a `Service` called `"my-service"` in Kubernetes
`Namespace` `"my-ns"` a DNS record for `"my-service.my-ns"` is created.  `Pods`
which exist in the `"my-ns"` `Namespace` should be able to find it by simply doing
a name lookup for `"my-service"`.  `Pods` which exist in other `Namespaces` must
qualify the name as `"my-service.my-ns"`.  The result of these name lookups is the
cluster IP.

Kubernetes also supports DNS SRV (service) records for named ports.  If the
`"my-service.my-ns"` `Service` has a port named `"http"` with protocol `TCP`, you
can do a DNS SRV query for `"_http._tcp.my-service.my-ns"` to discover the port
number for `"http"`.

The Kubernetes DNS server is the only way to access services of type
`ExternalName`.  More information is available in the [DNS Pods and Services](/docs/concepts/services-networking/dns-pod-service/).

## Headless services

Sometimes you don't need or want load-balancing and a single service IP.  In
this case, you can create "headless" services by specifying `"None"` for the
cluster IP (`spec.clusterIP`).

This option allows developers to reduce coupling to the Kubernetes system by 
allowing them freedom to do discovery their own way.  Applications can still use 
a self-registration pattern and adapters for other discovery systems could easily 
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

  * CNAME records for `ExternalName`-type services
  * A records for any `Endpoints` that share a name with the service, for all
    other types

## Publishing services - service types

For some parts of your application (e.g. frontends) you may want to expose a
Service onto an external (outside of your cluster) IP address.


Kubernetes `ServiceTypes` allow you to specify what kind of service you want.
The default is `ClusterIP`.

`Type` values and their behaviors are:

   * `ClusterIP`: Exposes the service on a cluster-internal IP. Choosing this value 
     makes the service only reachable from within the cluster. This is the 
     default `ServiceType`.
   * `NodePort`: Exposes the service on each Node's IP at a static port (the `NodePort`). 
     A `ClusterIP` service, to which the NodePort service will route, is automatically 
     created.  You'll be able to contact the `NodePort` service, from outside the cluster, 
     by requesting `<NodeIP>:<NodePort>`.
   * `LoadBalancer`: Exposes the service externally using a cloud provider's load balancer. 
     `NodePort` and `ClusterIP` services, to which the external load balancer will route, 
     are automatically created.
   * `ExternalName`: Maps the service to the contents of the `externalName` field
     (e.g. `foo.bar.example.com`), by returning a `CNAME` record with its value.
     No proxying of any kind is set up. This requires version 1.7 or higher of
     `kube-dns`.

### Type NodePort

If you set the `type` field to `"NodePort"`, the Kubernetes master will
allocate a port from a flag-configured range (default: 30000-32767), and each
Node will proxy that port (the same port number on every Node) into your `Service`.
That port will be reported in your `Service`'s `spec.ports[*].nodePort` field.

If you want a specific port number, you can specify a value in the `nodePort`
field, and the system will allocate you that port or else the API transaction
will fail (i.e. you need to take care about possible port collisions yourself).
The value you specify must be in the configured range for node ports.

This gives developers the freedom to set up their own load balancers, to
configure environments that are not fully supported by Kubernetes, or
even to just expose one or more nodes' IPs directly.

Note that this Service will be visible as both `<NodeIP>:spec.ports[*].nodePort`
and `spec.clusterIp:spec.ports[*].port`.

### Type LoadBalancer

On cloud providers which support external load balancers, setting the `type`
field to `"LoadBalancer"` will provision a load balancer for your `Service`.
The actual creation of the load balancer happens asynchronously, and
information about the provisioned balancer will be published in the `Service`'s
`status.loadBalancer` field.  For example:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
      nodePort: 30061
  clusterIP: 10.0.171.239
  loadBalancerIP: 78.11.24.19
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
      - ip: 146.148.47.155
```

Traffic from the external load balancer will be directed at the backend `Pods`,
though exactly how that works depends on the cloud provider. Some cloud providers allow
the `loadBalancerIP` to be specified. In those cases, the load-balancer will be created
with the user-specified `loadBalancerIP`. If the `loadBalancerIP` field is not specified,
an ephemeral IP will be assigned to the loadBalancer. If the `loadBalancerIP` is specified, but the
cloud provider does not support the feature, the field will be ignored.

#### Internal load balancer on AWS
In a mixed environment it is sometimes necessary to route traffic from services inside the same VPC.
This can be achieved by adding the following annotation to the service:

```yaml
[...]
metadata: 
    name: my-service
    annotations: 
        service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0
[...]
```
In a split-horizon DNS environment you would need two services to be able to route both external and internal traffic to your endpoints.


#### SSL support on AWS
For partial SSL support on clusters running on AWS, starting with 1.3 two
annotations can be added to a `LoadBalancer` service:

```
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

The first specifies which certificate to use. It can be either a
certificate from a third party issuer that was uploaded to IAM or one created
within AWS Certificate Manager.

```yaml
    metadata:
      name: my-service
      annotations:
         service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

The second annotation specifies which protocol a pod speaks. For HTTPS and
SSL, the ELB will expect the pod to authenticate itself over the encrypted
connection.

HTTP and HTTPS will select layer 7 proxying: the ELB will terminate
the connection with the user, parse headers and inject the `X-Forwarded-For`
header with the user's IP address (pods will only see the IP address of the
ELB at the other end of its connection) when forwarding requests.

TCP and SSL will select layer 4 proxying: the ELB will forward traffic without
modifying the headers.

### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes services can be exposed on those
`externalIPs`. Traffic that ingresses into the cluster with the external IP (as destination IP), on the service port,
will be routed to one of the service endpoints. `externalIPs` are not managed by Kubernetes and are the responsibility
of the cluster administrator.

In the ServiceSpec, `externalIPs` can be specified along with any of the `ServiceTypes`.
In the example below, my-service can be accessed by clients on 80.11.12.10:80 (externalIP:port)

```yaml
kind: Service
apiVersion: v1
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
not scale to very large clusters with thousands of Services.  See [the original
design proposal for portals](http://issue.k8s.io/1107) for more details.

Using the userspace proxy obscures the source-IP of a packet accessing a `Service`.
This makes some kinds of firewalling impossible.  The iptables proxier does not
obscure in-cluster source IPs, but it does still impact clients coming through
a load-balancer or node-port.

The `Type` field is designed as nested functionality - each level adds to the
previous.  This is not strictly required on all cloud providers (e.g. Google Compute Engine does
not need to allocate a `NodePort` to make `LoadBalancer` work, but AWS does)
but the current API requires it.

## Future work

In the future we envision that the proxy policy can become more nuanced than
simple round robin balancing, for example master-elected or sharded.  We also
envision that some `Services` will have "real" load balancers, in which case the
VIP will simply transport the packets there.

We intend to improve our support for L7 (HTTP) `Services`.

We intend to have more flexible ingress modes for `Services` which encompass
the current `ClusterIP`, `NodePort`, and `LoadBalancer` modes and more.

## The gory details of virtual IPs

The previous information should be sufficient for many people who just want to
use `Services`.  However, there is a lot going on behind the scenes that may be
worth understanding.

### Avoiding collisions

One of the primary philosophies of Kubernetes is that users should not be
exposed to situations that could cause their actions to fail through no fault
of their own.  In this situation, we are looking at network ports - users
should not have to choose a port number if that choice might collide with
another user.  That is an isolation failure.

In order to allow users to choose a port number for their `Services`, we must
ensure that no two `Services` can collide.  We do that by allocating each
`Service` its own IP address.

To ensure each service receives a unique IP, an internal allocator atomically
updates a global allocation map in etcd prior to creating each service. The map object
must exist in the registry for services to get IPs, otherwise creations will
fail with a message indicating an IP could not be allocated. A background
controller is responsible for creating that map (to migrate from older versions
of Kubernetes that used in memory locking) as well as checking for invalid
assignments due to administrator intervention and cleaning up any IPs
that were allocated but which no service currently uses.

### IPs and VIPs

Unlike `Pod` IP addresses, which actually route to a fixed destination,
`Service` IPs are not actually answered by a single host.  Instead, we use
`iptables` (packet processing logic in Linux) to define virtual IP addresses
which are transparently redirected as needed.  When clients connect to the
VIP, their traffic is automatically transported to an appropriate endpoint.
The environment variables and DNS for `Services` are actually populated in
terms of the `Service`'s VIP and port.

We support two proxy modes - userspace and iptables, which operate slightly
differently.

#### Userspace

As an example, consider the image processing application described above.
When the backend `Service` is created, the Kubernetes master assigns a virtual
IP address, for example 10.0.0.1.  Assuming the `Service` port is 1234, the
`Service` is observed by all of the `kube-proxy` instances in the cluster.
When a proxy sees a new `Service`, it opens a new random port, establishes an
iptables redirect from the VIP to this new port, and starts accepting
connections on it.

When a client connects to the VIP the iptables rule kicks in, and redirects
the packets to the `Service proxy`'s own port.  The `Service proxy` chooses a
backend, and starts proxying traffic from the client to the backend.

This means that `Service` owners can choose any port they want without risk of
collision.  Clients can simply connect to an IP and port, without being aware
of which `Pods` they are actually accessing.

#### Iptables

Again, consider the image processing application described above.
When the backend `Service` is created, the Kubernetes master assigns a virtual
IP address, for example 10.0.0.1.  Assuming the `Service` port is 1234, the
`Service` is observed by all of the `kube-proxy` instances in the cluster.
When a proxy sees a new `Service`, it installs a series of iptables rules which
redirect from the VIP to per-`Service` rules.  The per-`Service` rules link to
per-`Endpoint` rules which redirect (Destination NAT) to the backends.

When a client connects to the VIP the iptables rule kicks in.  A backend is
chosen (either based on session affinity or randomly) and packets are
redirected to the backend.  Unlike the userspace proxy, packets are never
copied to userspace, the kube-proxy does not have to be running for the VIP to
work, and the client IP is not altered.

This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP does get altered.

## API Object

Service is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at: [Service API
object](/docs/api-reference/{{page.version}}/#service-v1-core).

## For More Information

Read [Connecting a Front End to a Back End Using a Service](/docs/tutorials/connecting-apps/connecting-frontend-backend/).
