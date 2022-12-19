---
title: Virtual IPs and Service Proxies
content_type: reference
weight: 50
---

<!-- overview -->
Every {{< glossary_tooltip term_id="node" text="node" >}} in a Kubernetes
cluster runs a [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
(unless you have deployed your own alternative component in place of `kube-proxy`).

The `kube-proxy` component is responsible for implementing a _virtual IP_
mechanism for {{< glossary_tooltip term_id="service" text="Services">}}
of `type` other than
[`ExternalName`](/docs/concepts/services-networking/service/#externalname).


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
  on the DNS records could impose a high load on DNS that then becomes
  difficult to manage.

Later in this page you can read about how various kube-proxy implementations work.
Overall, you should note that, when running `kube-proxy`, kernel level rules may be modified
(for example, iptables rules might get created), which won't get cleaned up, in some
cases until you reboot.  Thus, running kube-proxy is something that should only be done
by an administrator which understands the consequences of having a low level, privileged
network proxying service on a computer.  Although the `kube-proxy` executable supports a
`cleanup` function, this function is not an official feature and thus is only available
to use as-is.


<a id="example"></a>
Some of the details in this reference refer to an example: the back end Pods for a stateless
image-processing workload, running with three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use.  While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.


<!-- body -->

## Proxy modes

Note that the kube-proxy starts up in different modes, which are determined by its configuration.

- The kube-proxy's configuration is done via a ConfigMap, and the ConfigMap for
  kube-proxy effectively deprecates the behavior for almost all of the flags for
  the kube-proxy.
- The ConfigMap for the kube-proxy does not support live reloading of configuration.
- The ConfigMap parameters for the kube-proxy cannot all be validated and verified on startup.
  For example, if your operating system doesn't allow you to run iptables commands,
  the standard kernel kube-proxy implementation will not work.

### `iptables` proxy mode {#proxy-mode-iptables}

In this mode, kube-proxy watches the Kubernetes control plane for the addition and
removal of Service and EndpointSlice objects. For each Service, it installs
iptables rules, which capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's
backend sets. For each endpoint, it installs iptables rules which
select a backend Pod.

By default, kube-proxy in iptables mode chooses a backend at random.

Using iptables to handle traffic has a lower system overhead, because traffic
is handled by Linux netfilter without the need to switch between userspace and the
kernel space. This approach is also likely to be more reliable.

If kube-proxy is running in iptables mode and the first Pod that's selected
does not respond, the connection fails. This is different from the old `userspace`
mode: in that scenario, kube-proxy would detect that the connection to the first
Pod had failed and would automatically retry with a different backend Pod.

You can use Pod [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
to verify that backend Pods are working OK, so that kube-proxy in iptables mode
only sees backends that test out as healthy. Doing this means you avoid
having traffic sent via kube-proxy to a Pod that's known to have failed.

{{< figure src="/images/docs/services-iptables-overview.svg" title="Services overview diagram for iptables proxy" class="diagram-medium" >}}

#### Example {#packet-processing-iptables}

As an example, consider the image processing application described [earlier](#example)
in the page.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  For this example, assume that the
Service port is 1234.
All of the kube-proxy instances in the cluster observe the creation of the new
Service.

When kube-proxy on a node sees a new Service, it installs a series of iptables rules
which redirect from the virtual IP address to more iptables rules, defined per Service.
The per-Service rules link to further rules for each backend endpoint, and the per-
endpoint rules redirect traffic (using destination NAT) to the backends.

When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are
redirected to the backend without rewriting the client IP address.

This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP address does get altered.

### IPVS proxy mode {#proxy-mode-ipvs}

In `ipvs` mode, kube-proxy watches Kubernetes Services and EndpointSlices,
calls `netlink` interface to create IPVS rules accordingly and synchronizes
IPVS rules with Kubernetes Services and EndpointSlices periodically.
This control loop ensures that IPVS status matches the desired
state.
When accessing a Service, IPVS directs traffic to one of the backend Pods.

The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
That means kube-proxy in IPVS mode redirects traffic with lower latency than
kube-proxy in iptables mode, with much better performance when synchronizing
proxy rules. Compared to the other proxy modes, IPVS mode also supports a
higher throughput of network traffic.

IPVS provides more options for balancing traffic to backend Pods;
these are:

* `rr`: round-robin
* `lc`: least connection (smallest number of open connections)
* `dh`: destination hashing
* `sh`: source hashing
* `sed`: shortest expected delay
* `nq`: never queue

{{< note >}}
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
falls back to running in iptables proxy mode.
{{< /note >}}

{{< figure src="/images/docs/services-ipvs-overview.svg" title="Services overview diagram for IPVS proxy" class="diagram-medium" >}}

## Session affinity

In these proxy models, the traffic bound for the Service's IP:Port is
proxied to an appropriate backend without the clients knowing anything
about Kubernetes or Services or Pods.

If you want to make sure that connections from a particular client
are passed to the same Pod each time, you can select the session affinity based
on the client's IP addresses by setting `.spec.sessionAffinity` to `ClientIP`
for a Service (the default is `None`).

### Session stickiness timeout

You can also set the maximum session sticky time by setting
`.spec.sessionAffinityConfig.clientIP.timeoutSeconds` appropriately for a Service.
(the default value is 10800, which works out to be 3 hours).

{{< note >}}
On Windows, setting the maximum session sticky time for Services is not supported.
{{< /note >}}

## IP address assignment to Services

Unlike Pod IP addresses, which actually route to a fixed destination,
Service IPs are not actually answered by a single host.  Instead, kube-proxy
uses packet processing logic (such as Linux iptables) to define _virtual_ IP
addresses which are transparently redirected as needed.

When clients connect to the VIP, their traffic is automatically transported to an
appropriate endpoint. The environment variables and DNS for Services are actually
populated in terms of the Service's virtual IP address (and port).

### Avoiding collisions

One of the primary philosophies of Kubernetes is that you should not be
exposed to situations that could cause your actions to fail through no fault
of your own. For the design of the Service resource, this means not making
you choose your own port number if that choice might collide with
someone else's choice.  That is an isolation failure.

In order to allow you to choose a port number for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the API server.

To ensure each Service receives a unique IP, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.

In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (e.g. due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.

#### IP address ranges for Service virtual IP addresses {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

Kubernetes divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`. That formula paraphrases as _never less than 16 or
more than 256, with a graduated step function between them_.

Kubernetes prefers to allocate dynamic IP addresses to Services by choosing from the upper band,
which means that if you want to assign a specific IP address to a `type: ClusterIP`
Service, you should manually assign an IP address from the **lower** band. That approach
reduces the risk of a conflict over allocation.

If you disable the `ServiceIPStaticSubrange`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) then Kubernetes
uses a single shared pool for both manually and dynamically assigned IP addresses,
that are used for `type: ClusterIP` Services.

## Traffic policies

You can set the `.spec.internalTrafficPolicy` and `.spec.externalTrafficPolicy` fields
to control how Kubernetes routes traffic to healthy (“ready”) backends.

### Internal traffic policy

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

You can set the `.spec.internalTrafficPolicy` field to control how traffic from
internal sources is routed. Valid values are `Cluster` and `Local`. Set the field to
`Cluster` to route internal traffic to all ready endpoints and `Local` to only route
to ready node-local endpoints. If the traffic policy is `Local` and there are no
node-local endpoints, traffic is dropped by kube-proxy.

### External traffic policy

You can set the `.spec.externalTrafficPolicy` field to control how traffic from
external sources is routed. Valid values are `Cluster` and `Local`. Set the field
to `Cluster` to route external traffic to all ready endpoints and `Local` to only
route to ready node-local endpoints. If the traffic policy is `Local` and there are
are no node-local endpoints, the kube-proxy does not forward any traffic for the
relevant Service.

### Traffic to terminating endpoints

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

If the `ProxyTerminatingEndpoints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in kube-proxy and the traffic policy is `Local`, that node's
kube-proxy uses a more complicated algorithm to select endpoints for a Service.
With the feature enabled, kube-proxy checks if the node
has local endpoints and whether or not all the local endpoints are marked as terminating.
If there are local endpoints and **all** of them are terminating, then kube-proxy
will forward traffic to those terminating endpoints. Otherwise, kube-proxy will always
prefer forwarding traffic to endpoints that are not terminating.

This forwarding behavior for terminating endpoints exist to allow `NodePort` and `LoadBalancer`
Services to gracefully drain connections when using `externalTrafficPolicy: Local`.

As a deployment goes through a rolling update, nodes backing a load balancer may transition from
N to 0 replicas of that deployment. In some cases, external load balancers can send traffic to
a node with 0 replicas in between health check probes. Routing traffic to terminating endpoints
ensures that Node's that are scaling down Pods can gracefully receive and drain traffic to
those terminating Pods. By the time the Pod completes termination, the external load balancer
should have seen the node's health check failing and fully removed the node from the backend pool.

## {{% heading "whatsnext" %}}

To learn more about Services,
read [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).

You can also:

* Read about [Services](/docs/concepts/services-networking/service/) as a concept
* Read about [Ingresses](/docs/concepts/services-networking/ingress/) as a concept
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API