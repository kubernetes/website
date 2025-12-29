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
Each instance of kube-proxy watches the Kubernetes
{{< glossary_tooltip term_id="control-plane" text="control plane" >}}
for the addition and removal of Service and {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}
{{< glossary_tooltip term_id="object" text="objects" >}}. For each Service, kube-proxy
calls appropriate APIs (depending on the kube-proxy mode) to configure
the node to capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's endpoints
(usually a Pod, but possibly an arbitrary user-provided IP address). A control
loop ensures that the rules on each node are reliably synchronized with
the Service and EndpointSlice state as indicated by the API server.

{{< figure src="/images/docs/services-iptables-overview.svg" title="Virtual IP mechanism for Services, using iptables mode" class="diagram-medium" >}}

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
cases until you reboot. Thus, running kube-proxy is something that should only be done
by an administrator who understands the consequences of having a low level, privileged
network proxying service on a computer. Although the `kube-proxy` executable supports a
`cleanup` function, this function is not an official feature and thus is only available
to use as-is.

<a id="example"></a>
Some of the details in this reference refer to an example: the backend
{{< glossary_tooltip term_id="pod" text="Pods" >}} for a stateless
image-processing workloads, running with
three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use. While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.

<!-- body -->

## Proxy modes

The kube-proxy starts up in different modes, which are determined by its configuration.

On Linux nodes, the available modes for kube-proxy are:

[`iptables`](#proxy-mode-iptables)
: A mode where the kube-proxy configures packet forwarding rules using iptables.

[`ipvs`](#proxy-mode-ipvs)
: a mode where the kube-proxy configures packet forwarding rules using ipvs.

[`nftables`](#proxy-mode-nftables)
: a mode where the kube-proxy configures packet forwarding rules using nftables.

There is only one mode available for kube-proxy on Windows:

[`kernelspace`](#proxy-mode-kernelspace)
: a mode where the kube-proxy configures packet forwarding rules in the Windows kernel

### `iptables` proxy mode {#proxy-mode-iptables}

_This proxy mode is only available on Linux nodes._

In this mode, kube-proxy configures packet forwarding rules using the
iptables API of the kernel netfilter subsystem. For each endpoint, it
installs iptables rules which, by default, select a backend Pod at
random.

#### Example {#packet-processing-iptables}

As an example, consider the image processing application described [earlier](#example)
in the page.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1. For this example, assume that the
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

This same basic flow executes when traffic comes in through a `type: NodePort` Service, or
through a load-balancer, though in those cases the client IP address does get altered.

#### Optimizing iptables mode performance

In iptables mode, kube-proxy creates a few iptables rules for every
Service, and a few iptables rules for each endpoint IP address. In
clusters with tens of thousands of Pods and Services, this means tens
of thousands of iptables rules, and kube-proxy may take a long time to update the rules
in the kernel when Services (or their EndpointSlices) change. You can adjust the syncing
behavior of kube-proxy via options in the
[`iptables` section](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)
of the kube-proxy [configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
(which you specify via `kube-proxy --config <path>`):

```yaml
...
iptables:
  minSyncPeriod: 1s
  syncPeriod: 30s
...
```

##### `minSyncPeriod`

The `minSyncPeriod` parameter sets the minimum duration between
attempts to resynchronize iptables rules with the kernel. If it is
`0s`, then kube-proxy will always immediately synchronize the rules
every time any Service or EndpointSlice changes. This works fine in very
small clusters, but it results in a lot of redundant work when lots of
things change in a small time period. For example, if you have a
Service backed by a {{< glossary_tooltip term_id="deployment" text="Deployment" >}}
with 100 pods, and you delete the
Deployment, then with `minSyncPeriod: 0s`, kube-proxy would end up
removing the Service's endpoints from the iptables rules one by one,
resulting in a total of 100 updates. With a larger `minSyncPeriod`, multiple
Pod deletion events would get aggregated together, so kube-proxy might
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

##### Updating legacy `minSyncPeriod` configuration {#minimize-iptables-restore}

Older versions of kube-proxy updated all the rules for all Services on
every sync; this led to performance issues (update lag) in large
clusters, and the recommended solution was to set a larger
`minSyncPeriod`. Since Kubernetes v1.28, the iptables mode of
kube-proxy uses a more minimal approach, only making updates where
Services or EndpointSlices have actually changed.

If you were previously overriding `minSyncPeriod`, you should try
removing that override and letting kube-proxy use the default value
(`1s`) or at least a smaller value than you were using before upgrading.

If you are not running kube-proxy from Kubernetes {{< skew currentVersion >}}, check
the behavior and associated advice for the version that you are actually running.

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

{{< feature-state for_k8s_version="v1.35" state="deprecated" >}}

_This proxy mode is only available on Linux nodes._

In `ipvs` mode, kube-proxy uses the kernel IPVS and iptables APIs to
create rules to redirect traffic from Service IPs to endpoint IPs.

The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.

{{< note >}}
The `ipvs` proxy mode was an experiment in providing a Linux
kube-proxy backend with better rule-synchronizing performance and
higher network-traffic throughput than the `iptables` mode. While it
succeeded in those goals, the kernel IPVS API turned out to be a bad
match for the Kubernetes Services API, and the `ipvs` backend was
never able to implement all of the edge cases of Kubernetes Service
functionality correctly.

The `nftables` proxy mode (described below) is essentially a
replacement for both the `iptables` and `ipvs` modes, with better
performance than either of them, and is recommended as a replacement
for `ipvs`. If you are deploying onto Linux systems that are too old
to run the `nftables` proxy mode, you should also consider trying the
`iptables` mode rather than `ipvs`, since the performance of
`iptables` mode has improved greatly since the `ipvs` mode was first
introduced.
{{< /note >}}

IPVS provides more options for balancing traffic to backend Pods;
these are:

* `rr` (Round Robin): Traffic is equally distributed amongst the backing servers.

* `wrr` (Weighted Round Robin): Traffic is routed to the backing servers based on
  the weights of the servers. Servers with higher weights receive new connections
  and get more requests than servers with lower weights.

* `lc` (Least Connection): More traffic is assigned to servers with fewer active connections.

* `wlc` (Weighted Least Connection): More traffic is routed to servers with fewer connections
  relative to their weights, that is, connections divided by weight.

* `lblc` (Locality based Least Connection): Traffic for the same IP address is sent to the
  same backing server if the server is not overloaded and available; otherwise the traffic
  is sent to servers with fewer connections, and keep it for future assignment.

* `lblcr` (Locality Based Least Connection with Replication): Traffic for the same IP
  address is sent to the server with least connections. If all the backing servers are
  overloaded, it picks up one with fewer connections and adds it to the target set.
  If the target set has not changed for the specified time, the server with the highest load
  is removed from the set, in order to avoid a high degree of replication.

* `sh` (Source Hashing): Traffic is sent to a backing server by looking up a statically
  assigned hash table based on the source IP addresses.

* `dh` (Destination Hashing): Traffic is sent to a backing server by looking up a
  statically assigned hash table based on their destination addresses.

* `sed` (Shortest Expected Delay): Traffic forwarded to a backing server with the shortest
  expected delay. The expected delay is `(C + 1) / U` if sent to a server, where `C` is
  the number of connections on the server and `U` is the fixed service rate (weight) of
  the server.

* `nq` (Never Queue): Traffic is sent to an idle server if there is one, instead of
  waiting for a fast one; if all servers are busy, the algorithm falls back to the `sed`
  behavior.

* `mh` (Maglev Hashing): Assigns incoming jobs based on
  [Google's Maglev hashing algorithm](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf),
  This scheduler has two flags: `mh-fallback`, which enables fallback to a different
  server if the selected server is unavailable, and `mh-port`, which adds the source port number to
  the hash computation. When using `mh`, kube-proxy always sets the `mh-port` flag and does not
  enable the `mh-fallback` flag.
  In proxy-mode=ipvs `mh` will work as source-hashing (`sh`), but with ports.

These scheduling algorithms are configured through the
[`ipvs.scheduler`](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
field in the kube-proxy configuration.

{{< note >}}
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
exits with an error.
{{< /note >}}

{{< figure src="/images/docs/services-ipvs-overview.svg" title="Virtual IP address mechanism for Services, using IPVS mode" class="diagram-medium" >}}

### `nftables` proxy mode {#proxy-mode-nftables}

{{< feature-state feature_gate_name="NFTablesProxyMode" >}}

_This proxy mode is only available on Linux nodes, and requires kernel
5.13 or later._

In this mode, kube-proxy configures packet forwarding rules using the
nftables API of the kernel netfilter subsystem. For each endpoint, it
installs nftables rules which, by default, select a backend Pod at
random.

The nftables API is the successor to the iptables API and is designed
to provide better performance and scalability than iptables. The
`nftables` proxy mode is able to process changes to service endpoints
faster and more efficiently than the `iptables` mode, and is also able
to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).

As of Kubernetes {{< skew currentVersion >}}, the `nftables` mode is
still relatively new, and may not be compatible with all network
plugins; consult the documentation for your network plugin.

#### Migrating from `iptables` mode to `nftables`

Users who want to switch from the default `iptables` mode to the
`nftables` mode should be aware that some features work slightly
differently the `nftables` mode:

- **NodePort interfaces**: In `iptables` mode, by default,
  [NodePort services](/docs/concepts/services-networking/service/#type-nodeport)
  are reachable on all local IP addresses. This is usually not what
  users want, so the `nftables` mode defaults to
  `--nodeport-addresses primary`, meaning Services using `type: NodePort` are only
  reachable on the node's primary IPv4 and/or IPv6 addresses. You can
  override this by specifying an explicit value for that option:
  e.g., `--nodeport-addresses 0.0.0.0/0` to listen on all (local)
  IPv4 IPs.

- `type: NodePort` **Services on `127.0.0.1`**: In `iptables` mode, if the
  `--nodeport-addresses` range includes `127.0.0.1` (and the option
  `--iptables-localhost-nodeports false` option is not passed), then
  Services of `type: NodePort` are reachable even on "localhost" (`127.0.0.1`).
  In `nftables` mode (and `ipvs` mode), this will not work. If you
  are not sure if you are depending on this functionality, you can
  check kube-proxy's
  `iptables_localhost_nodeports_accepted_packets_total` metric; if it
  is non-0, that means that some client has connected to a `type: NodePort`
  Service via localhost/loopback.

- **NodePort interaction with firewalls**: The `iptables` mode of
  kube-proxy tries to be compatible with overly-aggressive firewalls;
  for each `type: NodePort` service, it will add rules to accept inbound
  traffic on that port, in case that traffic would otherwise be
  blocked by a firewall. This approach will not work with firewalls
  based on nftables, so kube-proxy's `nftables` mode does not do
  anything here; if you have a local firewall, you must ensure that
  it is properly configured to allow Kubernetes traffic through
  (e.g., by allowing inbound traffic on the entire NodePort range).

- **Conntrack bug workarounds**: Linux kernels prior to 6.1 have a
  bug that can result in long-lived TCP connections to service IPs
  being closed with the error "Connection reset by peer". The
  `iptables` mode of kube-proxy installs a workaround for this bug,
  but this workaround was later found to cause other problems in some
  clusters. The `nftables` mode does not install any workaround by
  default, but you can check kube-proxy's
  `iptables_ct_state_invalid_dropped_packets_total` metric to see if
  your cluster is depending on the workaround, and if so, you can run
  kube-proxy with the option `--conntrack-tcp-be-liberal` to work
  around the problem in `nftables` mode.

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

{{< feature-state feature_gate_name="WinDSR" >}}

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
Service IPs are not actually answered by a single host. Instead, kube-proxy
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
someone else's choice. That is an isolation failure.

In order to allow you to choose an IP address for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}}.

### IP address allocation tracking

To ensure each Service receives a unique IP address, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.

In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (for example: due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.

#### IP address allocation tracking using the Kubernetes API {#ip-address-objects}

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

The control plane replaces the existing etcd allocator with a revised implementation
that uses IPAddress and ServiceCIDR objects instead of an internal global allocation map.
Each cluster IP address associated to a Service then references an IPAddress object.

Enabling the feature gate also replaces a background controller with an alternative
that handles the IPAddress objects and supports migration from the old allocator model.
Kubernetes {{< skew currentVersion >}} does not support migrating from IPAddress
objects to the internal allocation map.

One of the main benefits of the revised allocator is that it removes the size limitations
for the IP address range that can be used for the cluster IP address of Services.
With `MultiCIDRServiceAllocator` enabled, there are no limitations for IPv4, and for IPv6
you can use IP address netmasks that are a /64 or smaller (as opposed to /108 with the
legacy implementation).

Making IP address allocations available via the API means that you as a cluster administrator
can allow users to inspect the IP addresses assigned to their Services.
Kubernetes extensions, such as the [Gateway API](/docs/concepts/services-networking/gateway/),
can use the IPAddress API to extend Kubernetes' inherent networking capabilities.

Here is a brief example of a user querying for IP addresses:

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

Kubernetes also allow users to dynamically define the available IP ranges for Services using
ServiceCIDR objects. During bootstrap, a default ServiceCIDR object named `kubernetes` is created
from the value of the `--service-cluster-ip-range` command line argument to kube-apiserver:

```shell
kubectl get servicecidrs
```

```
NAME         CIDRS         AGE
kubernetes   10.96.0.0/28  17m
```

Users can create or delete new ServiceCIDR objects to manage the available IP ranges for Services:

```shell
cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newservicecidr
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

```shell
kubectl get servicecidrs
```

```
NAME             CIDRS         AGE
kubernetes       10.96.0.0/28  17m
newservicecidr   10.96.0.0/24  7m
```

Distributions or administrators of Kubernetes clusters may want to control that
new Service CIDRs added to the cluster does not overlap with other networks on
the cluster, that only belong to a specific range of IPs or just simple retain
the existing behavior of only having one ServiceCIDR per cluster.  An example of
a Validation Admission Policy to achieve this is:

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs-default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1","v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(i , variables.allowed.exists(j , cidr(j).containsCIDR(i)))"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs-default"
  validationActions: [Deny,Audit]
---
```


### IP address ranges for Service virtual IP addresses {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`. That formula means the result is _never less than 16 or
more than 256, with a graduated step function between them_.

Kubernetes prefers to allocate dynamic IP addresses to Services by choosing from the upper band,
which means that if you want to assign a specific IP address to a `type: ClusterIP`
Service, you should manually assign an IP address from the **lower** band. That approach
reduces the risk of a conflict over allocation.

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
route to ready node-local endpoints. If the traffic policy is `Local` and there
are no node-local endpoints, the kube-proxy does not forward any traffic for the
relevant Service.

If `Cluster` is specified, all nodes are eligible load balancing targets _as long as_
the node is not being deleted and kube-proxy is healthy. In this mode: load balancer
health checks are configured to target the service proxy's readiness port and path.
In the case of kube-proxy this evaluates to: `${NODE_IP}:10256/healthz`. kube-proxy
will return either an HTTP code 200 or 503. kube-proxy's load balancer health check
endpoint returns 200 if:

1. kube-proxy is healthy, meaning:

   it's able to progress programming the network and isn't timing out while doing
   so (the timeout is defined to be: **2 × `iptables.syncPeriod`**); and

1. the node is not being deleted (there is no deletion timestamp set for the Node).

kube-proxy returns 503 and marks the node as not
eligible when it's being deleted because it supports connection
draining for terminating nodes. A couple of important things occur from the point
of view of a Kubernetes-managed load balancer when a node _is being_ / _is_ deleted.

While deleting:

* kube-proxy will start failing its readiness probe and essentially mark the
  node as not eligible for load balancer traffic. The load balancer health
  check failing causes load balancers which support connection draining to
  allow existing connections to terminate, and block new connections from
  establishing.

When deleted:

* The service controller in the Kubernetes cloud controller manager removes the
  node from the referenced set of eligible targets. Removing any instance from
  the load balancer's set of backend targets immediately terminates all
  connections. This is also the reason kube-proxy first fails the health check
  while the node is deleting.

It's important to note for Kubernetes vendors that if any vendor configures the
kube-proxy readiness probe as a liveness probe: that kube-proxy will start
restarting continuously when a node is deleting until it has been fully deleted.
kube-proxy exposes a `/livez` path which, as opposed to the `/healthz` one, does
**not** consider the Node's deleting state and only its progress programming the
network. `/livez` is therefore the recommended path for anyone looking to define
a livenessProbe for kube-proxy.

Users deploying kube-proxy can inspect both the readiness / liveness state by
evaluating the metrics: `proxy_livez_total` / `proxy_healthz_total`. Both
metrics publish two series, one with the 200 label and one with the 503 one.

For `Local` Services: kube-proxy will return 200 if

1. kube-proxy is healthy/ready, and
1. has a local endpoint on the node in question.

Node deletion does **not** have an impact on kube-proxy's return
code for what concerns load balancer health checks. The reason for this is:
deleting nodes could end up causing an ingress outage should all endpoints
simultaneously be running on said nodes.

The Kubernetes project recommends that cloud provider integration code
configures load balancer health checks that target the service proxy's healthz
port. If you are using or implementing your own virtual IP implementation,
that people can use instead of kube-proxy, you should set up a similar health
checking port with logic that matches the kube-proxy implementation.

### Traffic to terminating endpoints

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

If the `ProxyTerminatingEndpoints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in kube-proxy and the traffic policy is `Local`, that node's
kube-proxy uses a more complicated algorithm to select endpoints for a Service.
With the feature enabled, kube-proxy checks if the node
has local endpoints and whether or not all the local endpoints are marked as terminating.
If there are local endpoints and **all** of them are terminating, then kube-proxy
will forward traffic to those terminating endpoints. Otherwise, kube-proxy will always
prefer forwarding traffic to endpoints that are not terminating.

This forwarding behavior for terminating endpoints exists to allow `NodePort` and `LoadBalancer`
Services to gracefully drain connections when using `externalTrafficPolicy: Local`.

As a deployment goes through a rolling update, nodes backing a load balancer may transition from
N to 0 replicas of that deployment. In some cases, external load balancers can send traffic to
a node with 0 replicas in between health check probes. Routing traffic to terminating endpoints
ensures that Nodes that are scaling down Pods can gracefully receive and drain traffic to
those terminating Pods. By the time the Pod completes termination, the external load balancer
should have seen the node's health check failing and fully removed the node from the backend
pool.

## Traffic distribution control {#traffic-distribution}

The `spec.trafficDistribution` field within a Kubernetes Service allows you to
express preferences for how traffic should be routed to Service endpoints.

`PreferSameZone`
: This prioritizes sending traffic to endpoints in the same zone as the client.
  The EndpointSlice controller updates EndpointSlices with `hints` to
  communicate this preference, which kube-proxy then uses for routing decisions.
  If a client's zone does not have any available endpoints, traffic will be
  routed cluster-wide for that client.

`PreferSameNode`
: This prioritizes sending traffic to endpoints on the same node as the client.
  As with `PreferSameZone`, the EndpointSlice controller updates
  EndpointSlices with `hints` indicating that a slice should be used for a
  particular node. If a client's node does not have any available endpoints,
  then the service proxy will fall back to "same zone" behavior, or cluster-wide
  if there are no same-zone endpoints either.

`PreferClose` (deprecated)
: This is an older alias for `PreferSameZone` that is less clear about
  the semantics.

In the absence of any value for `trafficDistribution`, the default strategy is
to distribute traffic evenly to all endpoints in the cluster.

### Comparison with `service.kubernetes.io/topology-mode: Auto`

The `trafficDistribution` field with `PreferSameZone`, and the older "Topology-Aware
Routing" feature using the `service.kubernetes.io/topology-mode: Auto`
annotation both aim to prioritize same-zone traffic. However, there is a key
difference in their approaches:

* `service.kubernetes.io/topology-mode: Auto` attempts to distribute traffic
  proportionally across zones based on allocatable CPU resources. This heuristic
  includes safeguards (such as the [fallback
  behavior](/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)
  for small numbers of endpoints), sacrificing some predictability in favor of
  potentially better load balancing.

* `trafficDistribution: PreferSameZone` aims to be simpler and more predictable:
  "If there are endpoints in the zone, they will receive all traffic for that
  zone, if there are no endpoints in a zone, the traffic will be distributed to
  other zones". This approach offers more predictability, but it means that you
  are responsible for [avoiding endpoint
  overload](#considerations-for-using-traffic-distribution-control).

If the `service.kubernetes.io/topology-mode` annotation is set to `Auto`, it
will take precedence over `trafficDistribution`. The annotation may be deprecated
in the future in favor of the `trafficDistribution` field.

### Interaction with Traffic Policies

When compared to the `trafficDistribution` field, the traffic policy fields
(`externalTrafficPolicy` and `internalTrafficPolicy`) are meant to offer a
stricter traffic locality requirements. Here's how `trafficDistribution`
interacts with them:

* Precedence of Traffic Policies: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Local`, it
  takes precedence over `trafficDistribution` for the corresponding
  traffic type (external or internal, respectively).

* `trafficDistribution` Influence: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Cluster` (the
  default), or if the fields are not set, then `trafficDistribution`
  guides the routing behavior for the corresponding traffic type
  (external or internal, respectively). This means that an attempt will be made
  to route traffic to an endpoint that is in the same zone as the client.

### Considerations for using traffic distribution control  

A Service using `trafficDistribution` will attempt to route traffic to (healthy)
endpoints within the appropriate topology, even if this means that some
endpoints receive much more traffic than other endpoints. If you do not have a
sufficient number of endpoints within the same topology ("same zone", "same
node", etc.) as the clients, then endpoints may become overloaded. This is
especially likely if incoming traffic is not proportionally distributed across
the topology. To mitigate this, consider the following strategies:

* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/):
  Use Pod Topology Spread Constraints to distribute your pods evenly
  across zones or nodes.

* Zone-specific Deployments: If you are using "same zone" traffic
  distribution, but expect to see different traffic patterns in
  different zones, you can create a separate Deployment for each zone.
  This approach allows the separate workloads to scale independently.
  There are also workload management addons available from the
  ecosystem, outside the Kubernetes project itself, that can help
  here.

## {{% heading "whatsnext" %}}

To learn more about Services,
read [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).

You can also:

* Read about [Services](/docs/concepts/services-networking/service/) as a concept
* Read about [Ingresses](/docs/concepts/services-networking/ingress/) as a concept
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API
