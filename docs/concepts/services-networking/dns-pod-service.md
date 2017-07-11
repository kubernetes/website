---
assignees:
- davidopp
- thockin
title: DNS Pods and Services
redirect_from:
- "/docs/admin/dns/"
- "/docs/admin/dns.html"
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

#### SRV records

SRV Records are created for named ports that are part of normal or [Headless
Services](/docs/concepts/services-networking/service/#headless-services).
For each named port, the SRV record would have the form
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local`.
For a regular service, this resolves to the port number and the CNAME:
`my-svc.my-namespace.svc.cluster.local`.
For a headless service, this resolves to multiple answers, one for each pod
that is backing the service, and contains the port number and a CNAME of the pod
of the form `auto-generated-name.my-svc.my-namespace.svc.cluster.local`.

#### Backwards compatibility

Previous versions of kube-dns made names of the form
`my-svc.my-namespace.cluster.local` (the 'svc' level was added later).  This
is no longer supported.

### Pods

#### A Records

When enabled, pods are assigned a DNS A record in the form of `pod-ip-address.my-namespace.pod.cluster.local`.

For example, a pod with IP `1.2.3.4` in the namespace `default` with a DNS name of `cluster.local` would have an entry: `1-2-3-4.default.pod.cluster.local`.

#### A Records and hostname based on Pod's hostname and subdomain fields

Currently when a pod is created, its hostname is the Pod's `metadata.name` value.

With v1.2, users can specify a Pod annotation, `pod.beta.kubernetes.io/hostname`, to specify what the Pod's hostname should be.
The Pod annotation, if specified, takes precedence over the Pod's name, to be the hostname of the pod.
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
  - image: busybox
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
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
```

If there exists a headless service in the same namespace as the pod and with the same name as the subdomain, the cluster's KubeDNS Server also returns an A record for the Pod's fully qualified hostname.
Given a Pod with the hostname set to "busybox-1" and the subdomain set to "default-subdomain", and a headless Service named "default-subdomain" in the same namespace, the pod will see it's own FQDN as "busybox-1.default-subdomain.my-namespace.svc.cluster.local". DNS serves an A record at that name, pointing to the Pod's IP. Both pods "busybox1" and "busybox2" can have their distinct A records. 

As of Kubernetes v1.2, the Endpoints object also has the annotation `endpoints.beta.kubernetes.io/hostnames-map`. Its value is the json representation of map[string(IP)][endpoints.HostRecord], for example: '{"10.245.1.6":{HostName: "my-webserver"}}'.
If the Endpoints are for a headless service, an A record is created with the format <hostname>.<service name>.<pod namespace>.svc.<cluster domain>
For the example json, if endpoints are for a headless service named "bar", and one of the endpoints has IP "10.245.1.6", an A record is created with the name "my-webserver.bar.my-namespace.svc.cluster.local" and the A record lookup would return "10.245.1.6".
This endpoints annotation generally does not need to be specified by end-users, but can used by the internal service controller to deliver the aforementioned feature.

With v1.3, The Endpoints object can specify the `hostname` for any endpoint, along with its IP. The hostname field takes precedence over the hostname value
that might have been specified via the  `endpoints.beta.kubernetes.io/hostnames-map` annotation.

With v1.3, the following annotations are deprecated: `pod.beta.kubernetes.io/hostname`, `pod.beta.kubernetes.io/subdomain`, `endpoints.beta.kubernetes.io/hostnames-map`

## How do I test if it is working?

### Create a simple Pod to use as a test environment

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

### Wait for this pod to go into the running state

You can get its status with:
```
kubectl get pods busybox
```

You should see:

```
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

### Validate that DNS is working

Once that pod is running, you can exec nslookup in that environment:

```
kubectl exec -ti busybox -- nslookup kubernetes.default
```

You should see something like:

```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

If you see that, DNS is working correctly.

### Troubleshooting Tips

If the nslookup command fails, check the following:

#### Check the local DNS configuration first
Take a look inside the resolv.conf file. (See "Inheriting DNS from the node" and "Known issues" below for more information)

```
kubectl exec busybox cat /etc/resolv.conf
```

Verify that the search path and name server are set up like the following (note that search path may vary for different cloud providers):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

#### Quick diagnosis

Errors such as the following indicate a problem with the kube-dns add-on or associated Services:

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

or

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

#### Check if the DNS pod is running

Use the kubectl get pods command to verify that the DNS pod is running.

```
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

You should see something like:

```
NAME                                                       READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y                                         3/3       Running   0           1h
...
```

If you see that no pod is running or that the pod has failed/completed, the DNS add-on may not be deployed by default in your current environment and you will have to deploy it manually.

#### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS daemons.

```
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c kubedns
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c dnsmasq
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c healthz
```

See if there is any suspicious log. W, E, F letter at the beginning represent Warning, Error and Failure. Please search for entries that have these as the logging level and use [kubernetes issues](https://github.com/kubernetes/kubernetes/issues) to report unexpected errors.

#### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.

```
kubectl get svc --namespace=kube-system
```

You should see:

```
NAME                    CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns                10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

If you have created the service or in the case it should be created by default but it does not appear, see this [debugging services page](/docs/tasks/debug-application-cluster/debug-service/) for more information.

#### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints` command.

```
kubectl get ep kube-dns --namespace=kube-system
```

You should see something like:
```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

If you do not see the endpoints, see endpoints section in the [debugging services documentation](/docs/tasks/debug-application-cluster/debug-service/).

For additional Kubernetes DNS examples, see the [cluster-dns examples](https://git.k8s.io/kubernetes/examples/cluster-dns) in the Kubernetes GitHub repository.

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site
Kubernetes installations. This required some minor
(backward-compatible) changes to the way
the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/concepts/cluster-administration/federation/) for more
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

## Inheriting DNS from the node
When running a pod, kubelet will prepend the cluster DNS server and search
paths to the node's own DNS settings.  If the node is able to resolve DNS names
specific to the larger environment, pods should be able to, also.  See "Known
issues" below for a caveat.

If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Setting it to "" means that pods will
not inherit DNS.  Setting it to a valid file path means that kubelet will use
this file instead of `/etc/resolv.conf` for DNS inheritance.

## Known issues
Kubernetes installs do not configure the nodes' resolv.conf files to use the
cluster DNS by default, because that process is inherently distro-specific.
This should probably be implemented eventually.

Linux's libc is impossibly stuck ([see this bug from
2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253)) with limits of just
3 DNS `nameserver` records and 6 DNS `search` records.  Kubernetes needs to
consume 1 `nameserver` record and 3 `search` records.  This means that if a
local installation already uses 3 `nameserver`s or uses more than 3 `search`es,
some of those settings will be lost.  As a partial workaround, the node can run
`dnsmasq` which will provide more `nameserver` entries, but not more `search`
entries.  You can also use kubelet's `--resolv-conf` flag.

If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine. Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.

## References

- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)

## What's next
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
