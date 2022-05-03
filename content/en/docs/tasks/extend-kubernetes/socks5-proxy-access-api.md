---
title: Use a SOCKS5 Proxy to Access the Kubernetes API
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

This page shows how to use a SOCKS5 proxy to access the API of a remote Kubernetes cluster.
This is useful when the cluster you want to access does not expose its API directly on the public internet.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

You need SSH client software (the `ssh` tool), and an SSH server running on the remote server.
You must be able to log in to the SSH server on the remote server.

<!-- steps -->

## Task context

{{< note >}}
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy.
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
{{</ note >}}

Figure 1 represents what you're going to achieve in this task.

* You have a client computer from where you're going to create requests to talk to the Kubernetes API
* The Kubernetes server/API is hosted on a remote server.
* You will use SSH client and server software to create a secure SOCKS5 tunnel between the local and
  the remote server. The HTTPS traffic between the client and the Kubernetes API will flow over the SOCKS5
  tunnel, which is itself tunnelled over SSH.

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

This command starts a SOCKS5 proxy between your client machine and the remote server.
The SOCKS5 proxy lets you connect to your cluster's API server.

```shell
# The SSH tunnel continues running in the foreground after you run this
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

* `-D 1080`: opens a SOCKS proxy on local port :1080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-remote-server.example`: the remote SSH server where the Kubernetes cluster is running.

## Client configuration

To explore the Kubernetes API you'll first need to instruct your clients to send their queries through
the SOCKS5 proxy we created earlier.

For command-line tools, set the `https_proxy` environment variable and pass it to commands that you run.

```shell
export https_proxy=socks5h://localhost:1080
```

When you set the `https_proxy` variable, tools such as `curl` route HTTPS traffic through the proxy
you configured. For this to work, the tool must support SOCKS5 proxying.

{{< note >}}
In the URL https://localhost/api, `localhost` does not refer to your local client computer.
Instead, it refers to the endpoint on the remote server knows as `localhost`.
The `curl` tool sends the hostname from the HTTPS URL over SOCKS, and the remote server
resolves that locally (to an address that belongs to its loopback interface).
{{</ note >}}

```shell
curl -k -v https://localhost/api
```

To use the official Kubernetes client `kubectl` with a proxy, set the `proxy-url` element
for the relevant `cluster` entry within  your `~/.kube/config` file. For example:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # shortened for readability 
    server: https://localhost            # the "Kubernetes API" in the diagram above
    proxy-url: socks5://localhost:1080   # the "SSH SOCKS5 proxy" in the diagram above (DNS resolution over socks is built-in)
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

## Clean up

Stop the ssh port-forwarding process by pressing `CTRL+C` on the terminal where it is running.

Type `unset https_proxy` in a terminal to stop forwarding http traffic through the proxy.

## Further reading

* [OpenSSH remote login client](https://man.openbsd.org/ssh)