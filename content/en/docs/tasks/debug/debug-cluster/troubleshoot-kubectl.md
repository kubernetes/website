---
reviewers:
# Should be added by an experienced contributor
title: "Troubleshooting kubectl"
content_type: task
weight: 10
---

<!-- overview -->

This documentation is about investigating and diagnosing
{{<glossary_tooltip text="kubectl" term_id="kubectl">}} related issues.
If you are unable to access `kubectl` or unable to connect to your cluster using
`kubectl`, this document describes several common scenarios and potential solutions
to identify and address the likely cause.

<!-- body -->

## {{% heading "prerequisites" %}}

* You need to have a Kubernetes cluster.
* You also need to have `kubcectl` installed.

## Verify kubectl setup

Make sure you've installed and configured `kubectl` correctly on your local machine.
Check the `kubectl` version to ensure it is up-to-date and compatible with your cluster.

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

If you've installed the `kubectl` but your shell gives the `command not found` error
make sure that the `$PATH` environment variable is correctly configured and you've
installed the kubectl by following the [official documentation for installing kubectl](/docs/tasks/tools/#kubectl).

## Check kubeconfig

The `kubectl` requires a `kubeconfig` file to connect with a Kubernetes cluster. The
`kubeconfig` file is located under the `~/.kube/config` directory. Make sure that you've
a valid `kubeconfig` file. If you don't have a `kubeconfig` file, you can create and
configure it via `kubectl config` command. If you've deployed your Kubernetes cluster on
a cloud platform and lost your `kubeconfig` file, you can re-generate it using your
cloud provider's tools. Refer the cloud provider's documentation for re-generating
the `kubeconfig` file.

Check if the `$KUBECONFIG` environment variable is configured correctly. You can set
`$KUBECONFIG`environment variable to specify the directory of a `kubeconfig` file.

If you're authenticating to a Kubernetes cluster via an authentication token,
validate the `$KUBERNETES_SERVER` and`$KUBERNETES_TOKEN` environment variables.

Make sure that you are using the valid user credentials. And you have the permission to
access the resource that you've requested.

## Verify contexts

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

## Check VPN connectivity

If you are using a Virtual Private Network (VPN) to access your Kubernetes cluster,
make sure that your VPN connection is active and stable. Sometimes, VPN disconnections
can lead to connection issues with the cluster. Reconnect to the VPN and try accessing
the cluster again.

## API server and load balancer

The {{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} server is the
central component of a Kubernetes cluster. If the API server or the load balancer it uses
is not reachable or not responding, you won't be able to interact with the cluster.

Check the if the API server's host is reachable by using `ping` command. Check cluster's
network connectivity and firewall. Or if your are using a cloud provider for deploying
the cluster, check your cloud provider's `health check status` for the API server.

Verify the status of the load balancer (if used) to ensure it is healthy and forwarding
traffic to the API server.

## TLS problems

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

## Verify kubectl helpers

Some kubectl authentication helpers provide easy access to Kubernetes clusters. If you
have used such helpers and are facing connectivity issues, ensure that the necessary
configurations are still present.

Check kubectl configuration for authentication details:

```shell
kubectl config view
```

If you previously used a helper tool (e.g., kubectl-oidc-login), ensure that it is still
installed and configured correctly.