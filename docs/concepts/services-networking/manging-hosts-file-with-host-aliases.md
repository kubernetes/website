---
assignees:
- rickypai
- thockin
title: Manging Hosts File with HostAliases
redirect_from:
- "/docs/user-guide/manging-hosts-file-with-hostaliases/"
- "/docs/user-guide/manging-hosts-file-with-hostaliases.html"
---

* TOC
{:toc}

kubelet [manages](https://github.com/kubernetes/kubernetes/issues/14633) the hosts file for each container of the Pod. This is to prevent Docker from [modifying](https://github.com/moby/moby/issues/17190) the file after the containers have already been started.

Because of the managed-nature of the file, any user-written content will be overwritten whenever the hosts file is remounted by Kubelet in the event of a container restart or a Pod reschedule. Thus, it is not suggested to modify the contents of the file.

As an alternative, Kubernetes 1.7 provides provides a `HostAliases` field for Pods to specify entries in the hosts file to provide Pod-level override of hostnames when DNS and other options are no applicable.

## Default Hosts File Content

Suppose we start an nginx Pod which is assigned an Pod IP:
```
$ kubectl get pods --output=wide
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

The hosts file content would look like this:
```
$ kubectl exec nginx -- cat /etc/hosts
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

by default, it only includes ipv4 and ipv6 boilerplates like localhost and its own hostname.

## Adding Additional Entries with HostAliases

Suppose we need to add additional entries to the hosts file to resolve `foo.local`, `bar.local` to `127.0.0.1` and `foo.remote`, `bar.remote` to `10.1.2.3`, we can by adding HostAliases to the Pod under `.spec.hostAliases`.

{% include code.html language="yaml" file="pod-nginx.yaml" ghlink="/docs/concepts/services-networking/hostaliases-pod.yaml" %}

The hosts file content would look like this:
```
$ kubectl exec nginx -- cat /etc/hosts
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	hostaliases-pod
127.0.0.1	foo.local
127.0.0.1	bar.local
10.1.2.3	foo.remote
10.1.2.3	bar.remote
```

With the additional entries specified at the bottom.

## Limitations

As of 1.7, Pods with hostNetwork enabled will not be able to use this feature. This is because kubelet only manages the hosts file for non-hostNetwork Pods.
