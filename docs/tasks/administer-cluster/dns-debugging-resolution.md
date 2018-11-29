---
approvers:
- bowei
- zihongz
title:  Debugging DNS Resolution
---

{% capture overview %}
This page provides hints on diagnosing DNS problems.
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
* Kubernetes version 1.6 and above.
* The cluster must be configured to use the `kube-dns` addon.
{% endcapture %}

{% capture steps %}

### Create a simple Pod to use as a test environment

Create a file named busybox.yaml with the following contents:

{% include code.html language="yaml" file="busybox.yaml" ghlink="/docs/tasks/administer-cluster/busybox.yaml" %}

Then create a pod using this file and verify its status:

```shell
$ kubectl create -f busybox.yaml
pod "busybox" created

$ kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.

```shell
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

If the `nslookup` command fails, check the following:

### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Inheriting DNS from the node](#inheriting-dns-from-the-node) and
[Known issues](#known-issues) below for more information)

```shell
$ kubectl exec busybox cat /etc/resolv.conf
```

Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

Errors such as the following indicate a problem with the kube-dns add-on or
associated Services:

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

### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.

```shell
$ kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                    READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y      3/3       Running   0           1h
...
```

If you see that no pod is running or that the pod has failed/completed, the DNS
add-on may not be deployed by default in your current environment and you will
have to deploy it manually.

### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS daemons.

```shell
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c kubedns
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c dnsmasq
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c sidecar
```

See if there is any suspicious log. Letter '`W`', '`E`', '`F`' at the beginning
represent Warning, Error and Failure. Please search for entries that have these
as the logging level and use
[kubernetes issues](https://github.com/kubernetes/kubernetes/issues)
to report unexpected errors.

### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.

```shell
$ kubectl get svc --namespace=kube-system
NAME          CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns      10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

If you have created the service or in the case it should be created by default
but it does not appear, see 
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) for
more information.

### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.

```shell
$ kubectl get ep kube-dns --namespace=kube-system
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.

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
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site Kubernetes
installations. This required some minor (backward-compatible) changes to the
way the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/concepts/cluster-administration/federation/)
for more details on Cluster Federation and multi-site support.

## References

- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)

## What's next
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).

{% endcapture %}

{% include templates/task.md %}