---
assignees:
- ArtfulCoder
- davidopp
- lavalamp

---

## Introduction

As of Kubernetes 1.3, DNS is a built-in service launched automatically using the addon manager [cluster add-on](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md).

Kubernetes DNS schedules a DNS Pod and Service on the cluster, and configures
the kubelets to tell individual containers to use the DNS Service's IP to
resolve DNS names.

## What things get DNS names?

Every Service defined in the cluster (including the DNS server itself) is
assigned a DNS name.  By default, a client Pod's DNS search list will
include the Pod's own namespace and the cluster's default domain.  This is best
illustrated by example:

Assume a Service named `foo` in the Kubernetes namespace `bar`.  A Pod running
in namespace `bar` can look up this service by simply doing a DNS query for
`foo`.  A Pod running in namespace `quux` can look up this service by doing a
DNS query for `foo.bar`.

## Supported DNS schema

The following sections detail the supported record types and layout that is
supported.  Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.

### Services

#### A records

"Normal" (not headless) Services are assigned a DNS A record for a name of the
form `my-svc.my-namespace.svc.cluster.local`.  This resolves to the cluster IP
of the Service.

"Headless" (without a cluster IP) Services are also assigned a DNS A record for
a name of the form `my-svc.my-namespace.svc.cluster.local`.  Unlike normal
Services, this resolves to the set of IPs of the pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.

### SRV records

SRV Records are created for named ports that are part of normal or Headless
Services.
For each named port, the SRV record would have the form
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local`.
For a regular service, this resolves to the port number and the CNAME:
`my-svc.my-namespace.svc.cluster.local`.
For a headless service, this resolves to multiple answers, one for each pod
that is backing the service, and contains the port number and a CNAME of the pod
of the form `auto-generated-name.my-svc.my-namespace.svc.cluster.local`.

### Backwards compatibility

Previous versions of kube-dns made names of the for
`my-svc.my-namespace.cluster.local` (the 'svc' level was added later).  This
is no longer supported.

### Pods

#### A Records

When enabled, pods are assigned a DNS A record in the form of `pod-ip-address.my-namespace.pod.cluster.local`.

For example, a pod with ip `1.2.3.4` in the namespace `default` with a dns name of `cluster.local` would have an entry: `1-2-3-4.default.pod.cluster.local`.

#### A Records and hostname based on Pod's hostname and subdomain fields

Currently when a pod is created, its hostname is the Pod's `metadata.name` value.

With v1.2, users can specify a Pod annotation, `pod.beta.kubernetes.io/hostname`, to specify what the Pod's hostname should be.
The Pod annotation, if specified, takes precendence over the Pod's name, to be the hostname of the pod.
For example, given a Pod with annotation `pod.beta.kubernetes.io/hostname: my-pod-name`, the Pod will have its hostname set to "my-pod-name".

With v1.3, the PodSpec has a `hostname` field, which can be used to specify the Pod's hostname. This field value takes precedence over the
`pod.beta.kubernetes.io/hostname` annotation value.

v1.2 introduces a beta feature where the user can specify a Pod annotation, `pod.beta.kubernetes.io/subdomain`, to specify the Pod's subdomain.
The final domain will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>".
For example, a Pod with the hostname annotation set to "foo", and the subdomain annotation set to "bar", in namespace "my-namespace", will have the FQDN "foo.bar.my-namespace.svc.cluster.local"

With v1.3, the PodSpec has a `subdomain` field, which can be used to specify the Pod's subdomain. This field value takes precedence over the
`pod.beta.kubernetes.io/subdomain` annotation value.

Example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  hostname: busybox-1
  subdomain: default
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
```

If there exists a headless service in the same namespace as the pod and with the same name as the subdomain, the cluster's KubeDNS Server also returns an A record for the Pod's fully qualified hostname.
Given a Pod with the hostname set to "foo" and the subdomain set to "bar", and a headless Service named "bar" in the same namespace, the pod will see it's own FQDN as "foo.bar.my-namespace.svc.cluster.local". DNS serves an A record at that name, pointing to the Pod's IP.

With v1.2, the Endpoints object also has a new annotation `endpoints.beta.kubernetes.io/hostnames-map`. Its value is the json representation of map[string(IP)][endpoints.HostRecord], for example: '{"10.245.1.6":{HostName: "my-webserver"}}'.
If the Endpoints are for a headless service, an A record is created with the format <hostname>.<service name>.<pod namespace>.svc.<cluster domain>
For the example json, if endpoints are for a headless service named "bar", and one of the endpoints has IP "10.245.1.6", an A is created with the name "my-webserver.bar.my-namespace.svc.cluster.local" and the A record lookup would return "10.245.1.6".
This endpoints annotation generally does not need to be specified by end-users, but can used by the internal service controller to deliver the aforementioned feature.

With v1.3, The Endpoints object can specify the `hostname` for any endpoint, along with its IP. The hostname field takes precedence over the hostname value
that might have been specified via the  `endpoints.beta.kubernetes.io/hostnames-map` annotation.

With v1.3, the following annotations are deprecated: `pod.beta.kubernetes.io/hostname`, `pod.beta.kubernetes.io/subdomain`, `endpoints.beta.kubernetes.io/hostnames-map`

## How do I test if it is working?

### Create a simple Pod to use as a test environment.

Create a file named busybox.yaml with the
following contents:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
```

Then create a pod using this file:

```
kubectl create -f busybox.yaml
```

### Wait for this pod to go into the running state.

You can get its status with:
```
kubectl get pods busybox
```

You should see:
```
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

### Validate DNS works

Once that pod is running, you can exec nslookup in that environment:

```
kubectl exec busybox -- nslookup kubernetes.default
```

You should see something like:

```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

If you see that, DNS is working correctly.

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site
Kubernetes installations. This required some minor
(backward-compatible) changes to the way
the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/admin/federation) for more
details on Cluster Federation and multi-site support.

## How it Works

The running Kubernetes DNS pod holds 3 containers - kubedns, dnsmasq and a health check called healthz.
The kubedns process watches the Kubernetes master for changes in Services and Endpoints, and maintains
in-memory lookup structures to service DNS requests. The dnsmasq container adds DNS caching to improve
performance. The healthz container provides a single health check endpoint while performing dual healthchecks
(for dnsmasq and kubedns).

The DNS pod is exposed as a Kubernetes Service with a static IP. Once assigned the
kubelet passes DNS configured using the `--cluster-dns=10.0.0.10` flag to each
container.

DNS names also need domains. The local domain is configurable, in the kubelet using
the flag `--cluster-domain=<default local domain>`

The Kubernetes cluster DNS server (based off the [SkyDNS](https://github.com/skynetservices/skydns) library)
supports forward lookups (A records), service lookups (SRV records) and reverse IP address lookups (PTR records).


## References

- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md)

