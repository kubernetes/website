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

You need SSH client software (the `ssh` tool), and an SSH service running on the remote server.
You must be able to log in to the SSH service on the remote server.

<!-- steps -->

## Task context

{{< note >}}
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy.
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
{{</ note >}}

Figure 1 represents what you're going to achieve in this task.

* You have a client computer, referred to as local in the steps ahead, from where you're going to create requests to talk to the Kubernetes API.
* The Kubernetes server/API is hosted on a remote server.
* You will use SSH client and server software to create a secure SOCKS5 tunnel between the local and
  the remote server. The HTTPS traffic between the client and the Kubernetes API will flow over the SOCKS5
  tunnel, which is itself tunnelled over SSH.

{{< mermaid >}}
graph LR;

  subgraph local[Local client machine]
  client([client])-. local <br> traffic .->  local_ssh[Local SSH <br> SOCKS5 proxy];
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

The following command starts a SOCKS5 proxy between your client machine and the remote SOCKS server:

```shell
# The SSH tunnel continues running in the foreground after you run this
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

The SOCKS5 proxy lets you connect to your cluster's API server based on the following configuration: 
* `-D 1080`: opens a SOCKS proxy on local port :1080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-remote-server.example`: the remote SSH server behind which the Kubernetes cluster 
  is running (eg: a bastion host).

## Client configuration

To access the Kubernetes API server through the proxy you must instruct `kubectl` to send queries through
the `SOCKS` proxy we created earlier. Do this by either setting the appropriate environment variable, 
or via the `proxy-url` attribute in the kubeconfig file. Using an environment variable: 

```shell
export HTTPS_PROXY=socks5://localhost:1080
```

To always use this setting on a specific `kubectl` context, specify the `proxy-url` attribute in the relevant 
`cluster` entry within the `~/.kube/config` file. For example:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # shortened for readability 
    server: https://<API_SERVER_IP_ADDRESS>:6443  # the "Kubernetes API" server, in other words the IP address of kubernetes-remote-server.example
    proxy-url: socks5://localhost:1080   # the "SSH SOCKS5 proxy" in the diagram above
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

Once you have created the tunnel via the ssh command mentioned earlier, and defined either the environment variable or 
the `proxy-url` attribute, you can interact with your cluster through that proxy. For example:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

{{< note >}}
- Before `kubectl` 1.24, most `kubectl` commands worked when using a socks proxy, except `kubectl exec`.
- `kubectl` supports both `HTTPS_PROXY` and `https_proxy` environment variables. These are used by other 
  programs that support SOCKS, such as `curl`. Therefore in some cases it 
  will be better to define the environment variable on the command line:
  ```shell
  HTTPS_PROXY=socks5://localhost:1080 kubectl get pods
  ```
- When using `proxy-url`, the proxy is used only for the relevant `kubectl` context, 
  whereas the environment variable will affect all contexts.
- The k8s API server hostname can be further protected from DNS leakage by using the `socks5h` protocol name
  instead of the more commonly known `socks5` protocol shown above. In this case, `kubectl` will ask the proxy server
  (such as an ssh bastion) to resolve the k8s API server domain name, instead of resolving it on the system running
  `kubectl`. Note also that with `socks5h`, a k8s API server URL like `https://localhost:6443/api` does not refer 
  to your local client computer. Instead, it refers to `localhost` as known on the proxy server (eg the ssh bastion).
{{</ note >}}


## Clean up

Stop the ssh port-forwarding process by pressing `CTRL+C` on the terminal where it is running.

Type `unset https_proxy` in a terminal to stop forwarding http traffic through the proxy.

## Further reading

* [OpenSSH remote login client](https://man.openbsd.org/ssh)
