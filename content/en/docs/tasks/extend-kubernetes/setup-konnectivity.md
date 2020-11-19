---
title: Set up Konnectivity service
content_type: task
weight: 70
---

<!-- overview -->

The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Configure the Konnectivity service

The following steps require an egress configuration, for example:

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:

1. Make sure that
the `ServiceAccountTokenVolumeProjection` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled. You can enable
[service account token volume protection](/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection)
by providing the following flags to the kube-apiserver:
   ```
   --service-account-issuer=api
   --service-account-signing-key-file=/etc/kubernetes/pki/sa.key
   --api-audiences=system:konnectivity-server
   ```
1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.

Generate or obtain a certificate and kubeconfig for konnectivity-server.  
For example, you can use the OpenSSL command line tool to issue a X.509 certificate,
using the cluster CA certificate `/etc/kubernetes/pki/ca.crt` from a control-plane host.

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key -out konnectivity.csr
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your control plane node. The provided
`konnectivity-server.yaml` manifest assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

Then deploy the Konnectivity agents in your cluster:

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
