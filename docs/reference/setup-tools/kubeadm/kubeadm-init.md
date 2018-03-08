---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm init
---
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_init.md %}

### Init workflow {#init-workflow}
`kubeadm init` bootstraps a Kubernetes master node by executing the
following steps:

1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.

1. Generates a self-signed CA (or using an existing one if provided) to set up
   identities for each component in the cluster. If the user has provided their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.

1. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`.

1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it writes the kubelet init configuration into the `/var/lib/kubelet/config/init/kubelet` file.
   See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
   and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet/) 
   for more information about Dynamic Kubelet Configuration.
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions.

1. Generates static Pod manifests for the API server,
   controller manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest are generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.

1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it completes the kubelet dynamic configuration by creating a ConfigMap and some RBAC rules that enable
   kubelets to access to it, and updates the node by pointing `Node.spec.configSource` to the
   newly-created ConfigMap.
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions.

1. Apply labels and taints to the master node so that no additional workloads will
   run there.

1. Generates the token that additional nodes can use to register
   themselves with the master in the future.  Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](kubeadm-token.md) docs.

1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/admin/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](kubeadm-join.md) for additional info.

1. Installs the internal DNS server (kube-dns) and the kube-proxy addon components via the API server. If kubeadm is invoked with --feature-gates=CoreDNS=true, then [CoreDNS](https://coredns.io/) will be installed as the default internal DNS server instead of kube-dns.  
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

1. If `kubeadm init` is invoked with the alpha self-hosting feature enabled,
   (`--feature-gates=SelfHosting=true`), the static Pod based control plane is
   transformed into a [self-hosted control plane](#self-hosting).


### Using kubeadm init with a configuration file {#config-file}

**Caution:** The config file is
still considered alpha and may change in future versions.
{: .caution}

It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in the `--config` option.

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
api:
  advertiseAddress: <address|string>
  bindPort: <int>
etcd:
  endpoints:
  - <endpoint1|string>
  - <endpoint2|string>
  caFile: <path|string>
  certFile: <path|string>
  keyFile: <path|string>
  dataDir: <path|string>
  extraArgs:
    <argument>: <value|string>
    <argument>: <value|string>
  image: <string>
kubeProxy:
  config:
    mode: <value|string>
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
nodeName: <string>
authorizationModes:
- <authorizationMode1|string>
- <authorizationMode2|string>
token: <string>
tokenTTL: <time duration>
selfHosted: <bool>
apiServerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
controllerManagerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
schedulerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
apiServerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
controllerManagerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
schedulerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
apiServerCertSANs:
- <name1|string>
- <name2|string>
certificatesDir: <string>
imageRepository: <string>
unifiedControlPlaneImage: <string>
featureGates:
  <feature>: <bool>
  <feature>: <bool>
```

### Passing custom arguments to control plane components {#custom-args}

If you would like to override or extend the behaviour of a control plane component, you can provide
extra arguments to kubeadm. When the component is deployed, these additional arguments are added to
the Pod command itself.

For example, to add additional feature-gate arguments to the API server, your [configuration file](#config-file)
will need to look like this:

```
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
apiServerExtraArgs:
  feature-gates: APIResponseCompression=true
```

To customize the scheduler or controller-manager, use `schedulerExtraArgs` and `controllerManagerExtraArgs` respectively.

More information on custom arguments can be found here:
- [kube-apiserver](/docs/admin/kube-apiserver/)
- [kube-controller-manager](/docs/admin/kube-controller-manager/)
- [kube-scheduler](/docs/admin/kube-scheduler/)

### Using custom images {#custom-images}

By default, kubeadm pulls images from `k8s.gcr.io`, unless
the requested Kubernetes version is a CI version. In this case,
`gcr.io/kubernetes-ci-images` is used.

You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:

* To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To provide a `unifiedControlPlaneImage` to be used instead of different images for control plane components.
* To provide a specific `etcd.image` to be used instead of the image available at`k8s.gcr.io`.


### Using custom certificates {#custom-certificates}

By default, kubeadm generates all the certificates needed for a cluster to run.
You can override this behavior by providing your own certificates.

To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.

If a given certificate and private key pair exists, kubeadm skips the
generation step and existing files are used for the prescribed
use case. This means you can, for example, copy an existing CA into `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key`, and kubeadm will use this CA for signing the rest
of the certs.

#### External CA mode {#external-ca-mode}

It is also possible to provide just the `ca.crt` file and not the
`ca.key` file (this is only available for the root CA file, not other cert pairs).
If all other certificates and kubeconfig files are in place, kubeadm recognizes
this condition and activates the "External CA" mode. kubeadm will proceed without the
CA key on disk.

Instead, run the controller-manager standalone with `--controllers=csrsigner` and
point to the CA certificate and key.

### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The kubeadm package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command never touches this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package.

This is what it looks like:


```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
Environment="KUBELET_CERTIFICATE_ARGS=--rotate-certificates=true --cert-dir=/var/lib/kubelet/pki"
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

Here's a breakdown of what/why:

* `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` path to a kubeconfig
   file that is used to get client certificates for kubelet during node join.
   On success, a kubeconfig file is written to the path specified by `--kubeconfig`.
* `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials.
* `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   static Pod manifests used for starting the control plane.
* `--allow-privileged=true` allows this kubelet to run privileged Pods.
* `--network-plugin=cni` uses CNI networking.
* `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md).
* `--cni-bin-dir=/opt/cni/bin` specifies where to look for the actual CNI binaries.
* `--cluster-dns=10.96.0.10` use this cluster-internal DNS server for `nameserver`
   entries in Pods' `/etc/resolv.conf`.
* `--cluster-domain=cluster.local` uses this cluster-internal DNS domain for
   `search` entries in Pods' `/etc/resolv.conf`.
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` authenticates requests to the Kubelet
   API using this CA certificate.
* `--authorization-mode=Webhook` authorizes requests to the Kubelet API by `POST`-ing
   a `SubjectAccessReview` to the API server.
* `--cadvisor-port=0` disables cAdvisor from listening to `0.0.0.0:4194` by default.
   cAdvisor will still be run inside of the kubelet and its API can be accessed at
   `https://{node-ip}:10250/stats/`. If you want to enable cAdvisor to listen on a
   wide-open port, run:

   ```bash
   sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
   systemctl daemon-reload
   systemctl restart kubelet
   ```
* `--rotate-certificates` auto rotate the kubelet client certificates by requesting new
   certificates from the `kube-apiserver` when the certificate expiration approaches.
* `--cert-dir`the directory where the TLS certs are located.

### Use kubeadm with other CRI runtimes

Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
The container runtime used by default is Docker, which is enabled through the built-in
`dockershim` CRI implementation inside of the `kubelet`.

Other CRI-based runtimes include:

- [cri-containerd](https://github.com/containerd/cri-containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

After you have successfully installed `kubeadm` and `kubelet`, execute
these two additional steps:

1. Install the runtime shim on every node, following the installation
   document in the runtime shim project listing above.

1. Configure kubelet to use the remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:

```shell
cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT"
EOF
systemctl daemon-reload
```

Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with the `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.

You may also want to set `--cri-socket` to `kubeadm init` and `kubeadm reset` when
using an external CRI implementation.

### Using internal IPs in your cluster

In order to set up a cluster where the master and worker nodes communicate with internal IP addresses (instead of public ones), execute following steps.

1. When running init, you must make sure you specify an internal IP for the API server's bind address, like so:

   `kubeadm init --apiserver-advertise-address=<private-master-ip>`

2. When a worker node has been provisioned, add a flag to `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` that specifies the private IP of the worker node:

   `--node-ip=<private-node-ip>`

3. Finally, when you run `kubeadm join`, make sure you provide the private IP of the API server addressed as defined in step 1.

### Self-hosting the Kubernetes control plane {#self-hosting}

As of 1.8, you can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.

**Caution:** Self-hosting is alpha, but is expected to become the default in
a future version. To create a self-hosted cluster, pass the `--feature-gates=SelfHosting=true`
flag to `kubeadm init`.
{: .caution}

**Warning:** see self-hosted caveats and limitations.
{: .warning}

#### Caveats

Self-hosting in 1.8 has some important limitations. In particular, a
self-hosted cluster _cannot recover from a reboot of the master node_
without manual intervention. This and other limitations are expected to be
resolved before self-hosting graduates from alpha.

By default, self-hosted control plane Pods rely on credentials loaded from
[`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
volumes. Except for initial creation, these credentials are not managed by
kubeadm. You can use `--feature-gates=StoreCertsInSecrets=true` to enable an
experimental mode where control plane credentials are loaded from Secrets
instead. This requires very careful control over the authentication and
authorization configuration for your cluster, and may not be appropriate for
your environment.

In kubeadm 1.8, the self-hosted portion of the control plane does not include etcd,
which still runs as a static Pod.

#### Process

The self-hosting bootstrap process is documented in the [kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).

In summary, `kubeadm init --feature-gates=SelfHosting=true` works as follows:

  1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.

  1. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes
    for secrets.

  1. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running.

  1. Once self-hosted Pods are operational, their associated static Pods are deleted
     and kubeadm moves on to install the next component. This triggers kubelet to
     stop those static Pods.

  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.

This process (steps 3-6) can also be triggered with `kubeadm phase selfhosting convert-from-staticpods`.

### Running kubeadm without an internet connection

For running kubeadm without an internet connection you have to pre-pull the required master images for the version of choice:

| Image Name                                               | v1.8 release branch version | v1.9 release branch version |
|----------------------------------------------------------|-----------------------------|-----------------------------|
| k8s.gcr.io/kube-apiserver-${ARCH}          | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-controller-manager-${ARCH} | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-scheduler-${ARCH}          | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-proxy-${ARCH}              | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/etcd-${ARCH}                    | 3.0.17                      | 3.1.10                      |
| k8s.gcr.io/pause-${ARCH}                   | 3.0                         | 3.0                         |
| k8s.gcr.io/k8s-dns-sidecar-${ARCH}         | 1.14.5                      | 1.14.7                      |
| k8s.gcr.io/k8s-dns-kube-dns-${ARCH}        | 1.14.5                      | 1.14.7                      |
| k8s.gcr.io/k8s-dns-dnsmasq-nanny-${ARCH}   | 1.14.5                      | 1.14.7                      |

Here `v1.8.x` means the "latest patch release of the v1.8 branch".

`${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.

If using `--feature-gates=CoreDNS=true` image `coredns/coredns:1.0.2` is required (instead of the three `k8s-dns-*` images).

### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/independent/create-cluster-kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the master will have after it is started.

1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you:

    ```bash
    kubeadm token generate
    ```

1. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.

Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.

Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](kubeadm-join.md).

{% endcapture %}

{% capture whatsnext %}
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
{% endcapture %}

{% include templates/concept.md %}
