---
title: Use a SOCKS5 Proxy to Access the Kubernetes API
content_type: task
weight: 42
min-kubernetes-server-version: v1.24.0
---

<!-- overview -->
This page shows how to use a SOCKS5 proxy to access the API of a remote Kubernetes cluster.
This is useful when the cluster you want to access does not expose its API directly on the public internet.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Overview

{{< note >}}
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy. 
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
{{</ note >}}

Figure 1 represents what we're going to achieve in this tutorial.

* We've got a _client machine_ from where we're going to create requests to talk to the Kubernetes API
* The Kubernetes server/API is hosted on a _remote server_.
* We leverage SSH to create a secure SOCKS5 tunnel between the _local_ and the _remote server_ on top of which the HTTPS traffic between the client and the Kubernetes API will flow.

{{< mermaid >}}
graph LR;

  subgraph local[Local client machine]
  client([client])-- local <br> traffic .->  local_ssh[Local SSH <br> SOCKS5 proxy];
  end
  local_ssh[SSH <br>SOCKS5 <br> proxy]-- SSH Tunnel -->sshd
  
  subgraph remote[Remote server]
  sshd[SSH <br> server]-- local traffic -->service1;
  end
  client([client])-. proxied HTTPs traffic <br> going through the proxy .->service1[Kubernetes API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
Figure 1. SOCKS5 tutorial components

## Using ssh to create a SOCKS5 proxy

This command starts a SOCKS5 proxy between your client machine and the remote server
where the Kubernetes API is listening:

```shell
ssh -D 8080 -q -N username@kubernetes-jump-box.example
```

* `-D 8080`: opens a SOCKS proxy on local port :8080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-jump-box.example`: the remote SSH server where the Kubernetes cluster is running.

## Client configuration

To explore the Kubernetes API you'll first need to instruct your clients to send their queries through the SOCKS5 proxy we created earlier.

For command-line tools, set the `https_proxy` environment variable and pass it to commands that you run.

```shell
export https_proxy=socks5://localhost:8080
```

When you set the `https_proxy` variable, tools such as `curl` route HTTPS traffic through the proxy
you configured. For this to work, the tool must support SOCKS5 proxying.

{{< note >}}
In this example localhost will not be the localhost of the _client machine_ but the localhost of the _remote server_. It could also be replaced by a hostname that is known by the _remote server_ and hosted further in the remote infrastructure.
{{</ note >}}

```shell
curl -k -v https://localhost/api
```

To use the official Kubernetes client `kubectl` with a proxy, set the `proxy-url` element for the relevant `cluster` entry within  your `~/.kube/config` file. For example:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # shortened for readability 
    server: https://localhost            # the "Kubernetes API" in the diagram above
    proxy-url: socks5://localhost:8080   # the "SSH SOCKS5 proxy" in the diagram above
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CR== # shortened for readability
    client-key-data: LS0tLS1CRUdJT=      # shortened for readability
```

If the tunnel is operating and you use `kubectl` with a context that uses this cluster, you can interact with your cluster through that proxy. For example:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```
