---
title: Virtual IPs and Service Proxies
content_type: reference
weight: 50
---

<!-- overview -->
Every {{< glossary_tooltip term_id="node" text="node" >}} in a Kubernetes
{{< glossary_tooltip term_id="cluster" text="cluster" >}} runs a
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
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
Some of the details in this reference refer to an example: the backend
{{< glossary_tooltip term_id="pod" text="Pods" >}} for a stateless
image-processing workloads, running with
three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use.  While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.

<!-- body -->

## Proxy modes

The kube-proxy starts up in different modes, which are determined by its configuration.

On Linux nodes, the available modes for kube-proxy are:

[`iptables`](#proxy-mode-iptables)
: A mode where the kube-proxy configures packet forwarding rules using iptables, on Linux.

[`ipvs`](#proxy-mode-ipvs)
: a mode where the kube-proxy configures packet forwarding rules using ipvs.

There is only one mode available for kube-proxy on Windows:

[`kernelspace`](#proxy-mode-kernelspace)
: a mode where the kube-proxy configures packet forwarding rules in the Windows kernel

### `iptables` proxy mode {#proxy-mode-iptables}

_This proxy mode is only available on Linux nodes._

In this mode, kube-proxy watches the Kubernetes
{{< glossary_tooltip term_id="control-plane" text="control plane" >}} for the addition and
removal of Service and EndpointSlice {{< glossary_tooltip term_id="object" text="objects." >}}
For each Service, it installs
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

{{< figure src="/images/docs/services-iptables-overview.svg" title="Virtual IP mechanism for Services, using iptables mode" class="diagram-medium" >}}

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

#### Optimizing iptables mode performance

In large clusters (with tens of thousands of Pods and Services), the
iptables mode of kube-proxy may take a long time to update the rules
in the kernel when Services (or their EndpointSlices) change. You can adjust the syncing
behavior of kube-proxy via options in the [`iptables` section](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)
of the
kube-proxy [configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
(which you specify via `kube-proxy --config <path>`):

```yaml
...
iptables:
  minSyncPeriod: 1s
  syncPeriod: 30s
...
```

##### Performance optimization for `iptables` mode {#minimize-iptables-restore}

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

In Kubernetes {{< skew currentVersion >}} the kube-proxy defaults to a minimal approach
to `iptables-restore` operations, only making updates where Services or EndpointSlices have
actually changed. This is a performance optimization.
The original implementation updated all the rules for all Services on every sync; this
sometimes led to performance issues (update lag) in large clusters.

If you are not running kube-proxy from Kubernetes {{< skew currentVersion >}}, check
the behavior and associated advice for the version that you are actually running.

If you were previously overriding `minSyncPeriod`, you should try
removing that override and letting kube-proxy use the default value
(`1s`) or at least a smaller value than you were using before upgrading.
You can select the legacy behavior by disabling the `MinimizeIPTablesRestore`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
(you should not need to).

##### `minSyncPeriod`

The `minSyncPeriod` parameter sets the minimum duration between
attempts to resynchronize iptables rules with the kernel. If it is
`0s`, then kube-proxy will always immediately synchronize the rules
every time any Service or Endpoint changes. This works fine in very
small clusters, but it results in a lot of redundant work when lots of
things change in a small time period. For example, if you have a
Service backed by a {{< glossary_tooltip term_id="deployment" text="Deployment" >}}
with 100 pods, and you delete the
Deployment, then with `minSyncPeriod: 0s`, kube-proxy would end up
removing the Service's endpoints from the iptables rules one by one,
for a total of 100 updates. With a larger `minSyncPeriod`, multiple
Pod deletion events would get aggregated
together, so kube-proxy might
instead end up making, say, 5 updates, each removing 20 endpoints,
which will be much more efficient in terms of CPU, and result in the
full set of changes being synchronized faster.

The larger the value of `minSyncPeriod`, the more work that can be
aggregated, but the downside is that each individual change may end up
waiting up to the full `minSyncPeriod` before being processed, meaning
that the iptables rules spend more time being out-of-sync with the
current API server state.

The default value of `1s` should work well in most clusters, but in very
large clusters it may be necessary to set it to a larger value.
Especially, if kube-proxy's `sync_proxy_rules_duration_seconds` metric
indicates an average time much larger than 1 second, then bumping up
`minSyncPeriod` may make updates more efficient.

##### `syncPeriod`

The `syncPeriod` parameter controls a handful of synchronization
operations that are not directly related to changes in individual
Services and EndpointSlices. In particular, it controls how quickly
kube-proxy notices if an external component has interfered with
kube-proxy's iptables rules. In large clusters, kube-proxy also only
performs certain cleanup operations once every `syncPeriod` to avoid
unnecessary work.

For the most part, increasing `syncPeriod` is not expected to have much
impact on performance, but in the past, it was sometimes useful to set
it to a very large value (eg, `1h`). This is no longer recommended,
and is likely to hurt functionality more than it improves performance.

### IPVS proxy mode {#proxy-mode-ipvs}

_This proxy mode is only available on Linux nodes._

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

{{< figure src="/images/docs/services-ipvs-overview.svg" title="Virtual IP address mechanism for Services, using IPVS mode" class="diagram-medium" >}}

### `kernelspace` proxy mode {#proxy-mode-kernelspace}

_This proxy mode is only available on Windows nodes._

The kube-proxy configures packet filtering rules in the Windows _Virtual Filtering Platform_ (VFP),
an extension to Windows vSwitch. These rules process encapsulated packets within the node-level
virtual networks, and rewrite packets so that the destination IP address (and layer 2 information)
is correct for getting the packet routed to the correct destination.
The Windows VFP is analogous to tools such as Linux `nftables` or `iptables`. The Windows VFP extends
the _Hyper-V Switch_, which was initially implemented to support virtual machine networking.

When a Pod on a node sends traffic to a virtual IP address, and the kube-proxy selects a Pod on
a different node as the load balancing target, the `kernelspace` proxy mode rewrites that packet
to be destined to the target backend Pod. The Windows _Host Networking Service_ (HNS) ensures that
packet rewriting rules are configured so that the return traffic appears to come from the virtual
IP address and not the specific backend Pod.

#### Direct server return for `kernelspace` mode {#windows-direct-server-return}

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

As an alternative to the basic operation, a node that hosts the backend Pod for a Service can
apply the packet rewriting directly, rather than placing this burden on the node where the client
Pod is running. This is called _direct server return_.

To use this, you must run kube-proxy with the `--enable-dsr` command line argument **and**
enable the `WinDSR` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Direct server return also optimizes the case for Pod return traffic even when both Pods
are running on the same node.

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
you choose your own IP address if that choice might collide with
someone else's choice.  That is an isolation failure.

In order to allow you to choose an IP address for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}}.

#### IP address allocation tracking

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

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}
If you enable the `MultiCIDRServiceAllocator`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
[`networking.k8s.io/v1alpha1` API group](/docs/tasks/administer-cluster/enable-disable-api/),
the control plane replaces the existing etcd allocator with a new one, using IPAddress
objects instead of an internal global allocation map.  The ClusterIP address
associated to each Service will have a referenced IPAddress object.

The background controller is also replaced by a new one to handle the new IPAddress
objects and the migration from the old allocator model.

One of the main benefits of the new allocator is that it removes the size limitations
for the `service-cluster-ip-range`, there is no limitations for IPv4 and for IPv6
users can use masks equal or larger than /64 (previously it was /108).

Users now will be able to inspect the IP addresses assigned to their Services, and
Kubernetes extensions such as the [Gateway](https://gateway-api.sigs.k8s.io/) API, can use this new
IPAddress object kind to enhance the Kubernetes networking capabilities, going beyond the limitations of
the built-in Service API.

```shell
kubectl get services
```
```
NAME         TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   2001:db8:1:2::1   <none>        443/TCP   3d1h
```
```shell
kubectl get ipaddresses
```
```
NAME              PARENTREF
2001:db8:1:2::1   services/default/kubernetes
2001:db8:1:2::a   services/kube-system/kube-dns
```

#### IP address ranges for Service virtual IP addresses {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

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

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

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
should have seen the node's health check failing and fully removed the node from the backend
pool.

## {{% heading "whatsnext" %}}

To learn more about Services,
read [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).

You can also:

* Read about [Services](/docs/concepts/services-networking/service/) as a concept
* Read about [Ingresses](/docs/concepts/services-networking/ingress/) as a concept
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API

