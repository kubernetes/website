---
approvers:
- mikedanese
- luxas
- jbeda
title: Kubeadm init
notitle: true
---
{% capture overview %}
## Kubeadm init {#cmd-init}
{% endcapture %}

{% capture body %}
{% include_relative _kubeadm/kubeadm_init.md %}

### Init workflow {#init-workflow}
`kubeadm init` bootstraps a Kubernetes master node by executing the
following steps:

1. kubeadm runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.

1. kubeadm generates the token that additional nodes can use to register
   themselves with the master in the future.  Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](kubeadm-token.md) docs.

1. kubeadm generates a self-signed CA to provision identities for each component
   (including nodes) in the cluster.  It also generates client certificates to
   be used by various components.  If the user has provided their own CA by
   dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.

1. kubeadm writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each one with their respective identities, as well as an additional
   kubeconfig file for administration named `admin.conf`.

1. kubeadm generates static Pod manifests for the API server,
   controller manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest will be generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests` folder; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running kubeadm init sequence can continue.

1. kubeadm "labels" and "taints" the master node so that only control plane
   components will run there.

1. kubeadm makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/admin/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining and set up related RBAC access rules.

   - Ensure access to the CSR signing API for bootstrap tokens.

   - Configure auto approval for new CSR requests.

   See [kubeadm join](kubeadm-join.md) for additional info.

1. kubeadm installs add-on components via the API server.  Right now this is
   the internal DNS server and the kube-proxy DaemonSet.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

1. If `kubeadm init` is invoked with the alpha self-hosting feature enabled,
   (`--feature-gates=SelfHosting=true`), the static Pod based control plane will
   be transformed into a [self-hosted control plane](#self-hosting).


### Using kubeadm init with a configuration file {#config-file}

**Caution:** the config file is
still considered alpha and may change in future versions.
{: .caution}

It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in to the `--config` option.

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
extra arguments to kubeadm. When the component is deployed, it will use these additional arguments in 
the pod command itself. 

For example, to add additional feature-gate arguments to the apiserver, your [configuration file](#sample-master-configuration) 
will need to look like this:

```
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
apiServerExtraArgs:
   feature-gates: APIResponseCompression=true
```

To customise the scheduler or controller-manager, use `schedulerExtraArgs` and `controllerManagerExtraArgs` respectively.

More information on custom arguments can be found here:
- [kube-apiserver](https://kubernetes.io/docs/admin/kube-apiserver/)
- [kube-controller-manager](https://kubernetes.io/docs/admin/kube-controller-manager/)
- [kube-scheduler](https://kubernetes.io/docs/admin/kube-scheduler/)

### Using custom images {#custom-images}

By default, kubeadm will pull images from `gcr.io/google_containers`, unless
the requested Kubernetes version is a CI version. In this case,
`gcr.io/kubernetes-ci-image` will be used.

This behaviour can be overridden by [using kubeadm with a configuration file](#config-file).
Allowed customization are:

* provide an alternative `imageRepository` to be used instead of
  `gcr.io/google_containers`
* provide an `unifiedControlPlaneImage` to be used instead of different images for each control plane component
  for control plane components
* provide a specific `etcd.image` to be used instead of the image available at`gcr.io/google_containers`


### Using custom certificates {#custom-certificates}

By default kubeadm will generate all the certificates needed for a cluster to run.
You can override this behaviour by providing your own certificates.

To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.

If a given certificate and private key pair both exist, kubeadm will skip the
generation step and those files will be validated and used for the prescribed
use-case. This means you can, for example, copy an existing CA into `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key` and kubeadm will use this CA for signing the rest 
of the certs.

It is also possible to provide just the `ca.crt` file and not the 
`ca.key` file (this is only available for the root CA file, not other cert pairs). 
If all other certificates and kubeconfig files already are in place kubeadm
recognize this condition and activates the so called "ExternalCA" mode, which also
implies the csrsignercontroller in controller-manager won't be started.

### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The kubeadm deb package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command will never touch this drop-in file.
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
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

A breakdown of what/why:

* `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` path to a kubeconfig 
   file that will be used to get client certificate for kubelet during node join. 
   On success, a kubeconfig file is written to the path specified by `--kubeconfig`. 
* `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials.
* `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   Static Pod manifests used for spinning up the control plane
* `--allow-privileged=true` allows this kubelet to run privileged Pods
* `--network-plugin=cni` uses CNI networking
* `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md)
* `--cni-bin-dir=/opt/cni/bin` specifies where to look for the actual CNI binaries
* `--cluster-dns=10.96.0.10` use this cluster-internal DNS server for `nameserver`
   entries in Pods' `/etc/resolv.conf`
* `--cluster-domain=cluster.local` uses this cluster-internal DNS domain for
   `search` entries in Pods' `/etc/resolv.conf`
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` authenticates requests to the Kubelet
   API using this CA certificate.
* `--authorization-mode=Webhook` authorizes requests to the Kubelet API by `POST`-ing
   a `SubjectAccessReview` to the API Server
* `--cadvisor-port=0` disables cAdvisor from listening to `0.0.0.0:4194` by default.
   cAdvisor will still be run inside of the kubelet and its API can be accessed at
   `https://{node-ip}:10250/stats/`. If you want to enable cAdvisor to listen on a
   wide-open port, run:

   ```
   sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
   systemctl daemon-reload
   systemctl restart kubelet
   ```
* `--rotate-certificates` auto rotate the kubelet client certificates by requesting new 
   certificates from the kube-apiserver when the certificate expiration approaches.
* `--cert-dir`the directory where the TLS certs are located.

### Use kubeadm with other CRI runtimes

Since the [Kubernetes 1.6 release](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#node-components-1),
Kubernetes has started using CRI as the default container runtime..
the container runtime used by kubeadm is Docker, which is enabled through the built-in
`dockershim` in `kubelet` mechanisms.

Other CRI-based runtimes include::

- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

After you have successfully installed `kubeadm` and `kubelet`, please follow
these two steps:

1. Install runtime shim on every node. You will need to follow the installation
   document in the runtime shim project listing above.

1. Configure kubelet to use remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:

```shell
  $ cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT --feature-gates=AllAlpha=true"
EOF
  $ systemctl daemon-reload
```

Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.

### Using internal IPs in your cluster

In order to set up a cluster where the master and worker nodes communicate with internal IP addresses (instead of publicly addressable ones), you will need to follow these steps.

1. When running init, you must make sure you specify an internal IP for the apiserver's bind address, like so:

   `kubeadm init --apiserver-advertise-address=<private-master-ip>`

2. When a worker node has been provisioned, add a flag to `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` that specifes the private IP of the worker node:

   `--node-ip=<private-node-ip>`

3. Finally, when you run `kubeadm join` make sure you provide the private IP of the apiserver addressed as defined in step 1.

### Self-hosting the Kubernetes control plane  {#self-hosting}
As of 1.8, kubeadm can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.

**Caution:** Self-hosting is alpha in kubeadm 1.8 but is expected to become the default in
a future version. To create a self-hosted cluster, pass the `--feature-gates=SelfHosting=true`
flag to `kubeadm init`.
{: .caution}

**Warning:** Read carefully current caveats/limitations. 
{: .warning}

#### Caveats

Kubeadm self-hosting in 1.8 has some important limitations. In particular, a
self-hosted cluster cannot currently recover from a reboot of the master node
without manual intervention. This and other limitations are expected to be
resolved before self-hosting graduates from alpha.

By default, self-hosted control plane pods rely on credentials loaded from
[`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
volumes. Except for initial creation, these credentials are not managed by
kubeadm. You can use `--feature-gates=StoreCertsInSecrets=true` to enable an
experimental mode where control plane credentials are loaded from Secrets
instead. This requires very careful control over the authentication and
authorization configuration for your cluster, and may not be appropriate for
your environment.

In 1.8, the self-hosted portion of the control plane does not include etcd,
which still runs as a static pod.

#### Process
The self-hosting bootstrap process is documented in [the kubeadm 1.8 design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.8.md#optional-self-hosting).
In summary, `kubeadm init --feature-gates=SelfHosting=true` works as follows:

  1. As usual, kubeadm creates static pod YAML files in `/etc/kubernetes/manifests/`.

  1. Kubelet loads these files and launches the bootstrap static control plane.
    Kubeadm waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.

  1. Kubeadm uses the static control plane pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes 
    for secrets.

  1. Kubeadm creates DaemonSets in the `kube-system` namespace and waits for the
     resulting pods to be running.

  1. kubeadm then waits for a self-hosted pod to be running. Once it's operational, 
     it's associated static pod is deleted and kubeadm moves on to install the next 
     component. This triggers kubelet to stop those static pods.

  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.

This process (steps 3-6) can also be triggered with `kubeadm phase selfhosting convert-from-staticpods`.

### Running kubeadm without an internet connection

All of the control plane components run in Pods started by the kubelet and
the following images are required for the cluster works will be automatically
pulled by the kubelet if they don't exist locally while `kubeadm init` is initializing
your master:

| Image Name |  v1.7 release branch version | v1.8 release branch version
|---|---|---|
| gcr.io/google_containers/kube-apiserver-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-controller-manager-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-scheduler-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-proxy-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/etcd-${ARCH} | 3.0.17 | 3.0.17
| gcr.io/google_containers/pause-${ARCH} | 3.0 | 3.0
| gcr.io/google_containers/k8s-dns-sidecar-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-kube-dns-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-dnsmasq-nanny-${ARCH} | 1.14.4 | 1.14.4

Here `v1.7.x` means the "latest patch release of the v1.7 branch".

`${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.

### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/admin/kubeadm/), you can parallelize the
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
* [kubeadm join](kubeadm-join.md) to bootstraps a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
{% endcapture %}

{% include templates/concept.md %}