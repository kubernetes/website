---
reviewers:
# Should be added by an experienced contributor
title: "Troubleshooting kubectl Connectivity"
content_type: task
weight: 10
---

<!-- overview -->

This documentation is about investigating and diagnosing connectivity issues between
{{<glossary_tooltip text="kubectl" term_id="kubectl">}} and your Kubernetes cluster.
If you are unable to connect to your cluster using kubectl, this document describes
several common scenarios and potential solutions to identify and address the likely
cause.

<!-- body -->

## {{% heading "prerequisites" %}}

* Kubernetes cluster is installed.
* `kubectl` is installed and configured to communicate with the cluster.

## Verify kubectl Setup

Make sure you have installed and configured kubectl correctly on your local machine.
Check the kubectl version to ensure it is up-to-date and compatible with your cluster.

Check kubectl version:

```shell
kubectl version
```

You'll see a similar output:

```shell
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}

```

If you see `Unable to connect to the server: dial tcp <server-ip>:8443: i/o timeout`,
instead of `Server Version`, you need to troubleshoot kubectl connectivity with your cluster.

## Verify Contexts

Kubernetes supports [multiple clusters and contexts](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Ensure that you are using the correct context to interact with your cluster.

List available contexts:

```shell
kubectl config get-contexts
```

Switch to the appropriate context:

```shell
kubectl config use-context <context-name>
```

## Check VPN Connectivity

If you are using a Virtual Private Network (VPN) to access your Kubernetes cluster,
make sure that your VPN connection is active and stable. Sometimes, VPN disconnections
can lead to connection issues with the cluster. Reconnect to the VPN and try accessing
the cluster again.

## API Server and Load Balancer

The {{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} server is the
central component of a Kubernetes cluster. If the API server or the load balancer it uses
is not reachable or not responding, you won't be able to interact with the cluster.

Check the if the API server's host is reachable by using `ping` command. Or if your are
using a cloud provider for deploying the cluster, check your cloud provider's
`health check status` for the API server.

Verify the status of the load balancer (if used) to ensure it is healthy and forwarding
traffic to the API server.

## TLS Problems

Transport Layer Security (TLS) is used to secure communication with the Kubernetes
API server. TLS problems can occur due to various reasons, such as certificate expiry or
chain of trust validity.

You can find the directory of TLS certificate in the `~/.kube/config`. The
`certificate-authority` attribute contains the CA certificate and the `client-certificate`
attribute contains the client certificate.

Verify the expiry of these certificates:

```shell
openssl x509 -in /path/to/client-certificate.crt -noout -dates
```

```shell
openssl x509 -in /path/to/ca-certificate.crt -noout -dates

```

## Verify kubectl Helpers

Some kubectl authentication helpers provide easy access to Kubernetes clusters. If you
have used such helpers and are facing connectivity issues, ensure that the necessary
configurations are still present.

Check kubectl configuration for authentication details:

```shell
kubectl config view
```

If you previously used a helper tool (e.g., kubectl-oidc-login), ensure that it is still
installed and configured correctly.