## Configuring the kubelets in your cluster with kubeadm and packaging

#### Introduction to the relation between kubeadm and kubelet

The `kubeadm` CLI tool has a lifecycle that is decoupled from the lifecycle of the `kubelet` daemon, the [Kubernetes Node Agent](#TODO). The `kubeadm ` CLI tool is executed by the user at initialization or upgrade time. The kubelet is always running on any given master or node that is running Kubernetes. As the `kubelet` is a daemon, it needs to be run by some kind of init system or process manager. In the deb and rpm packages that are shipped with Kubernetes releases, the `kubelet` is by default run as a `systemd` service. _Important to note_ though, is that _any type_ of init system or process manager can be used for running the `kubelet`, this default solution is a reference solution, but swappable. By default, the `kubeadm` deb/rpm package ships a `systemd` dropin file for the kubelet, so it becomes functional. The vanilla `kubelet` deb/rpm package does not ship with any CLI flags at all (in other words, is non-functional).

#### Problem 1: Cluster-level information might have to be propagated down to the kubelets

There is a need for configuration values of different kinds to flow down from `kubeadm` that is run at `kubeadm init` and/or `kubeadm join` time. Common scenarios e.g. include customizing the Service Subnet and using an other CRI runtime. Let's say you pass this parameter to kubeadm:

```
kubeadm init --service-cidr 10.95.0.0/12
```

The default service subnet is `10.96.0.0/12` for reference.

When in this example the subnet used for allocating Service Virtual IPs is modified, the `--cluster-dns` kubelet flag also needs to be customized, **for every kubelet in the cluster**. In this example, it should be set to `10.95.0.10`. This means we need some kind of way for global, cluster-specific configuration (e.g. Service Subnet) to "flow down" to the kubelets in the cluster.

Luckily, the kubelet has a versioned, structured API object that can be used for configuring most of the knobs in the kubelet, hereafter called **the kubelet's ComponentConfig**. The API types for the kubelet ComponentConfig can be found [here](#TODO). It lets the user specify e.g. the cluster DNS IP with the following configuration file:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

#### Problem 2: There should be a way to apply instance-specific configuration

There are lots of cases where due to e.g. heterogeneous operating systems, machine types, and surrounding environments, a kubelet needs to be configured individually. However, we probably want most of the base-level configuration described in _Problem 1_. There are lots of examples of instance-specific flags that need to be dynamically set depending on the environment:

- `--resolv-conf` the path to `/etc/resolv.conf` varies depending on what OS type you have. If you're using `systemd-resolved` the path should be `/run/systemd/resolve/resolv.conf` to illustrate the example. If this path is wrong, DNS resolution might not work on your node.
- By default the kubelet uses the hostname of the machine as the Node API object `.metadata.name` (unless using a cloud provider). The hostname might not cut it for you though as the Node's name, so then you want to specify `--hostname-override`.
- Currently there's no good way to detect the cgroup driver being used either by docker or any other CRI runtime. However, matching the kubelet flag `--cgroup-driver` with what the container runtime is using is vital to the health of the kubelet.
- Different kubelet parameters need to be passed depending on what CRI runtime is used. In the case of docker, you need to specify flags like `--network-plugin=cni` for it to work, but if you're using some other, external runtime you should set `--container-runtime=remote` and specify the CRI endpoint with `--container-runtime-endpoint=<path>`.

#### kubeadm's solution (available since v1.11)

In kubeadm v1.11, the kubeadm config API type `MasterConfiguration` embeds the kubelet's ComponentConfig under the `.kubeletConfiguration.baseConfig` key. This makes it possible for any user writing a `MasterConfiguration` file to also set all kubelets' base-level configuration.

When `kubeadm init` runs, this `.kubeletConfiguration.baseConfig`  struct is marshalled to disk, to the following path: `/var/lib/kubelet/config.yaml`. This marshalled content is also uploaded to a ConfigMap in the cluster named `kubelet-config-1.X`, where `X` is the minor version of the Kubernetes version initialized. `kubeadm init` also generates the `/etc/kubernetes/kubelet.conf` KubeConfig file with credentials (client certificates) for the kubelet to talk to the API server.

Further, in order to address _Problem 2_, `kubeadm init` writes an environment file looking like this, in the path `/var/lib/kubelet/kubeadm-flags.env`:

```
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

`kubeadm` takes different (dynamic) parameters into account, like what cgroup driver seems to be used, or whether a non-docker `--cri-socket` was passed or not, etc. and writes the file. `kubeadm` attempts a `systemctl daemon-reload && systemctl restart kubelet` in order to make the kubelet pick up the latest dynamic flags written. Then the rest of the normal init flow continues.

`kubeadm join` on the other hand, uses the Bootstrap Token credential to download the `kubelet-config-1.X` ConfigMap and write the data to `/var/lib/kubelet/config.yaml` just as for `kubeadm init`. Also, the dynamic environment file is generated in exactly the same way as for `kubeadm init`. After these files are written, `kubeadm` attempts a `systemctl daemon-reload && systemctl restart kubelet` in order to make the kubelet pick up the latest dynamic flags written. Then `kubeadm join` performs the discovery, which yields the `/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig file consisting of a CA certificate and Bootstrap Token that in turn is used by the kubelet to perform the TLS Bootstrap and get the unique credential which is stored in `/etc/kubernetes/kubelet.conf`.  As of `kubeadm` v1.11, `kubeadm join` waits for the kubelet to perform the TLS Bootstrap, that is, for the `/etc/kubernetes/kubelet.conf` to appear on disk.

##### The dropin for the kubelet that consequently is needed for this to work

```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably, the user should use
# the .NodeRegistration.KubeletExtraArgs object in the configuration files instead. KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

This is the dropin file the `kubeadm` _deb/rpm package_ ships for the _kubelet_, in the path `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`. What to note here:

- The KubeConfig file to use for the TLS Bootstrap `/etc/kubernetes/bootstrap-kubelet.conf` . Not used if `/etc/kubernetes/kubelet.conf` already exists.

- The KubeConfig file with the unique kubelet identity `/etc/kubernetes/kubelet.conf`

- The pointer to the file containing the kubelet's ComponentConfig: `/var/lib/kubelet/config.yaml`

- The sourcing of the dynamic environment file `/var/lib/kubelet/kubeadm-flags.env` which should contain `KUBELET_KUBEADM_ARGS`

- The sourcing of the `/etc/default/kubelet` (for debs), or `/etc/systconfig/kubelet` (for rpms) environment file that can contain the `KUBELET_EXTRA_ARGS` variable with flag overrides. As `KUBELET_EXTRA_ARGS` is last in the flag chain, it has the highest priority.

  ### Things to keep in mind when packaging kubeadm, kubelet, etc. for a non-systemd system

The deb/rpm packages shipped with the Kubernetes releases are the following:

- `kubeadm` . Ships the `/usr/bin/kubeadm` CLI tool and the systemd dropin for the kubelet described above (in `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`).
- `kubelet`. Ships the `/usr/bin/kubelet` binary.
- `kubectl`. Ships the `/usr/bin/kubectl` binary.
- `kubernetes-cni`. Ships the official CNI binaries under the `/opt/cni/bin` directory.
- `cri-tools`. Ships the `/usr/bin/crictl` binary from https://github.com/kubernetes-incubator/cri-tools
