---
reviewers:
- rickypai
- thockin
title: Adding entries to Pod /etc/hosts with HostAliases
content_template: templates/concept
weight: 60
---

{{< toc >}}

{{% capture overview %}}
Adding entries to a Pod's /etc/hosts file provides Pod-level override of hostname resolution when DNS and other options are not applicable. In 1.7, users can add these custom entries with the HostAliases field in PodSpec.

Modification not using HostAliases is not suggested because the file is managed by Kubelet and can be overwritten on during Pod creation/restart.
{{% /capture %}}

{{% capture body %}}

## Default Hosts File Content

Let's start an Nginx Pod which is assigned a Pod IP:

```shell
kubectl run nginx --image nginx --generator=run-pod/v1
```

```shell
pod/nginx created
```

Examine a Pod IP:

```shell
kubectl get pods --output=wide
```

```shell
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

The hosts file content would look like this:

```shell
kubectl exec nginx -- cat /etc/hosts
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

By default, the `hosts` file only includes IPv4 and IPv6 boilerplates like
`localhost` and its own hostname.

## Adding Additional Entries with HostAliases

In addition to the default boilerplate, we can add additional entries to the
`hosts` file to resolve `foo.local`, `bar.local` to `127.0.0.1` and `foo.remote`,
`bar.remote` to `10.1.2.3`, we can by adding HostAliases to the Pod under
`.spec.hostAliases`:

{{< codenew file="service/networking/hostaliases-pod.yaml" >}}

This Pod can be started with the following commands:

```shell
kubectl apply -f hostaliases-pod.yaml
```

```shell
pod/hostaliases-pod created
```

Examine a Pod IP and status:

```shell
kubectl get pod --output=wide
```

```shell
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

The `hosts` file content would look like this:

```shell
kubectl logs hostaliases-pod
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

With the additional entries specified at the bottom.

## Why Does Kubelet Manage the Hosts File?

Kubelet [manages](https://github.com/kubernetes/kubernetes/issues/14633) the
`hosts` file for each container of the Pod to prevent Docker from
[modifying](https://github.com/moby/moby/issues/17190) the file after the
containers have already been started.

Because of the managed-nature of the file, any user-written content will be
overwritten whenever the `hosts` file is remounted by Kubelet in the event of
a container restart or a Pod reschedule. Thus, it is not suggested to modify
the contents of the file.

{{% /capture %}}

