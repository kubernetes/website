---
title: Set up Konnectivity service
content_type: task
weight: 70
---

<!-- overview -->

The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.

## {{% heading "prerequisites" %}}

You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. It is recommended to run this
tutorial on a cluster with at least two nodes that are not acting as control
plane hosts. If you do not already have a cluster, you can create one by using
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).

<!-- steps -->

## Configure the Konnectivity service

The following steps require an egress configuration, for example:

{{% code_sample file="admin/konnectivity/egress-selector-configuration.yaml" %}}

You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:

1. Make sure that
[Service Account Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
feature enabled in your cluster. It is enabled by default since Kubernetes v1.20.
1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.
1. If you use UDS connection, add volumes config to the kube-apiserver:
   ```yaml
   spec:
     containers:
       volumeMounts:
       - name: konnectivity-uds
         mountPath: /etc/kubernetes/konnectivity-server
         readOnly: false
     volumes:
     - name: konnectivity-uds
       hostPath:
         path: /etc/kubernetes/konnectivity-server
         type: DirectoryOrCreate
   ```

Generate or obtain a certificate and kubeconfig for konnectivity-server.
For example, you can use the OpenSSL command line tool to issue a X.509 certificate,
using the cluster CA certificate `/etc/kubernetes/pki/ca.crt` from a control-plane host.

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key
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

{{% code_sample file="admin/konnectivity/konnectivity-server.yaml" %}}

Then deploy the Konnectivity agents in your cluster:

{{% code_sample file="admin/konnectivity/konnectivity-agent.yaml" %}}

If RBAC is enabled in your cluster, create the relevant RBAC rules:

{{% code_sample file="admin/konnectivity/konnectivity-rbac.yaml" %}}

## How to use the Konnectivity service with a Highly Available control plane

If you are using the Konnectivity service with a Highly Available control plane, each Konnectivity agent needs to connect to each Konnectivity server.
If the hosts that make up your cluster's control plane are behind a load balancer, the Konnectivity agent may not be able to target each Konnectivity server explicitly.

In order to solve this, the Konnectivity agent need to know how many control-plane pods exist, and need a way to know on which ones it connected through the load balancer.

In the [reference implementation](https://github.com/kubernetes-sigs/apiserver-network-proxy), it works like this:

* Each `proxy-server` needs to advertise the number of existing control plane hosts, which you specify using the `--server-count` command line argument. For example, if you are using 3 control plane hosts, set `--server-count=3` on `proxy-server`.
* Each Konnectivity proxy server advertises its unique server ID. You can set the server ID using the `--server-id` command line option.
  If the option is not set, the server ID is the machine ID from `/var/lib/dbus/machine-id`.
* Each `proxy-agent` will initiate a first connection to the `proxy-server` through the load balancer. The `proxy-server` will tell to the `proxy-agent` how many `proxy-server` there are and its own server ID.
* If there is only one `proxy-server`, the `proxy-agent` will store the server ID and simply maintain this single connection.
* If there are several `proxy-server`, the `proxy-agent` will store the server ID and try to establish a new connection through the load balancer, hoping to contact a new `proxy-server` with a different server ID. The newly connected `proxy-server` will give its server ID. The `proxy-agent` will compare it to the already connected server IDs. If it's a new one, it will store the server ID and maintain the connection. If the load balancer redirected the query to an already connected one, the connection will be dropped.
* The `proxy-agent` will retry connecting through the load balancer until it has the correct number of different `proxy-server` server IDs connected. Depending on the load balancing method, it can take some time.
* Communications between the control plane and the nodes will work perfectly once each `proxy-agent` is connected to each `proxy-server`.
  In the meantime, some queries (such as `kubectl logs` or callouts to admission webhook calls) may fail. However a proportion of those requests will succeedd, so long as partial connections using Konnectivity are already established.
