---
title: Running Kubelet in Standalone Mode
content_type: tutorial
weight: 10
---

<!-- overview -->

This tutorial shows you how to run a standalone Kubelet instance.

You may have different motivations for running a standalone kubelet.
This tutorial is aimed at introducing you to Kubernetes, even if you don't have
much experience with it. You can follow this tutorial and learn about node setup,
basic (static) Pods, and how Kubernetes manages containers.

Once you have followed this tutorial, you could try using a cluster that has a
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} to manage pods
and nodes, and other types of objects. For example,
[Hello, minikube](/docs/tutorials/hello-minikube/).

You can also run the kubelet in standalone mode to suit production use cases, such as
to run the control plane for a highly available, resiliently deployed cluster. This
tutorial does not cover the details you need for running a resilient control plane.

## {{% heading "objectives" %}}

* Install `cri-o`, and `kubelet` on a Linux system and run them as `systemd` services.
* Launch a Pod running `nginx` that listens to requests on TCP port 80 on the Pod's IP address.
* Learn how the different components of the solution interact among themselves.

{{< caution >}}
The Kubelet configuration used for this tutorial is insecure by design and should
_not_ be used in a production environment.
{{< /caution >}}

## {{% heading "prerequisites" %}}

* Admin (`root`) access to a Linux system that uses `systemd` and `iptables`
  (or nftables with `iptables` emulation).
* Access to the Internet to download the components needed for the tutorial, such as:
* A {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
    that implements the Kubernetes {{< glossary_tooltip term_id="cri" text="(CRI)">}}.
* Network plugins (these are often known as
    {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
* Required CLI tools: `curl`, `tar`, `jq`.

<!-- lessoncontent -->

## Prepare the system

### Swap configuration

The default behavior of kubelet is to fail to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.

{{< note >}}
If you configure the kubelet to tolerate swap, the kubelet still configures Pods (and the
containers in those Pods) not to use swap space. To find out how Pods can actually
use the available swap, you can read more about
[swap memory management](/docs/concepts/architecture/nodes/#swap-memory) on Linux nodes.
{{< /note >}}

If you have swap memory enabled, either disable it or add `failSwapOn: false` to the
kubelet configuration file.

To check if swap is enabled:

```shell
sudo swapon --show
```

If there is no output from the command, then swap memory is already disabled.

To disable swap temporarily:

```shell
sudo swapoff -a
```

To make this change persistent across reboots:

Make sure swap is disabled in either `/etc/fstab` or `systemd.swap`, depending how it was
configured on your system.

### Enable IPv4 packet forwarding

To check if IPv4 packet forwarding is enabled:

```shell
cat /proc/sys/net/ipv4/ip_forward
```

If the output is `1`, it is already enabled. If the output is `0`, then follow next steps.

To enable IPv4 packet forwarding, create a configuration file that sets the
`net.ipv4.ip_forward` parameter to `1`:

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```
Apply the changes to the system:

```shell
sudo sysctl --system
```

The output is similar to:

```
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

## Download, install, and configure the components

{{% thirdparty-content %}}

### Install a container runtime {#container-runtime}

Download the latest available versions of the required packages (recommended).

This tutorial suggests installing the [CRI-O container runtime](https://github.com/cri-o/cri-o)
(external link).

There are several [ways to install](https://github.com/cri-o/cri-o/blob/main/install.md)
the CRI-O container runtime, depending on your particular Linux distribution. Although
CRI-O recommends using either `deb` or `rpm` packages, this tutorial uses the
_static binary bundle_ script of the
[CRI-O Packaging project](https://github.com/cri-o/packaging/blob/main/README.md),
both to streamline the overall process, and to remain distribution agnostic.

The script installs and configures additional required software, such as
[`cni-plugins`](https://github.com/containernetworking/cni), for container
networking, and [`crun`](https://github.com/containers/crun) and
[`runc`](https://github.com/opencontainers/runc), for running containers.

The script will automatically detect your system's processor architecture
(`amd64` or `arm64`) and select and install the latest versions of the software packages.

### Set up CRI-O {#cri-o-setup}

Visit the [releases](https://github.com/cri-o/cri-o/releases) page (external link).

Download the static binary bundle script:

```shell
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

Run the installer script:

```shell
sudo bash crio-install
```

Enable and start the `crio` service:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

Quick test:

```shell
sudo systemctl is-active crio.service
```

The output is similar to:

```
active
```

Detailed service check:

```shell
sudo journalctl -f -u crio.service
```

### Install  network plugins

The `cri-o` installer installs and configures the `cni-plugins` package. You can
verify the installation running the following command:


```shell
/opt/cni/bin/bridge --version
```

The output is similar to:

```
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

To check the default configuration:

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

The output is similar to:

```json
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```

{{< note >}}
Make sure that the default `subnet` range (`10.85.0.0/16`) does not overlap with
one of your active networks. If there is an overlap, you can edit the file and change it
accordingly. Restart the service after the change.
{{< /note >}}

### Download and set up the kubelet

Download the [latest stable release](/releases/download/) of the Kubelet.

{{< tabs name="download_kubelet" >}}
{{< tab name="x86-64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubelet"
{{< /tab >}}
{{< tab name="ARM64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubelet"
{{< /tab >}}
{{< /tabs >}}

Configure:

```shell
sudo mkdir -p /etc/kubernetes/manifests
```

```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # Do NOT use in production clusters!
authorization:
  mode: AlwaysAllow # Do NOT use in production clusters!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # Do NOT use in production clusters!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

{{< note >}}
Because you are not setting up a production cluster, you are using plain HTTP
(`readOnlyPort: 10255`) for unauthenticated queries to the kubelet's API.

The _authentication webhook_ is disabled and _authorization mode_ is set to `AlwaysAllow`
for the purpose of this tutorial. You can learn more about
[authorization modes](/docs/reference/access-authn-authz/authorization/#authorization-modules)
and [webhook authentication](/docs/reference/access-authn-authz/webhook/) to properly
configure kubelet in standalone mode in your environment.

See [Ports and Protocols](/docs/reference/networking/ports-and-protocols/) to
understand which ports Kubernetes components use.
{{< /note >}}


Install:

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

Create a `systemd` service unit file:

```shell
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

The command line argument `--kubeconfig` has been intentionally omitted in the
service configuration file. This argument sets the path to a
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file that specifies how to connect to the API server, enabling API server mode.
Omitting it, enables standalone mode.

Enable and start the `kubelet` service:

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

Quick test:

```shell
sudo systemctl is-active kubelet.service
```

The output is similar to:

```
active
```

Detailed service check:

```shell
sudo journalctl -u kubelet.service
```

Check the Kubelet's API `/healthz` endpoint:

```shell
curl http://localhost:10255/healthz?verbose
```

The output is similar to:

```
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

Query the Kubelet's API `/pods` endpoint:

```shell
curl http://localhost:10255/pods | jq '.'
```

The output is similar to:

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

## Run a Pod in the Kubelet

In standalone mode, you can run Pods using Pod manifests. The manifests can either
be on the local filesystem, or fetched via HTTP from a configuration source.

Create a manifest for a Pod:

```shell
cat <<EOF > static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

Copy the `static-web.yaml` manifest file to the `/etc/kubernetes/manifests` directory.

```shell
sudo cp static-web.yaml /etc/kubernetes/manifests/
```

### Find out information about the Kubelet and the Pod {#find-out-information}

The Pod networking plugin creates a network bridge (`cni0`) and a pair of `veth` interfaces
for each Pod (one of the pair is inside the newly made Pod, and the other is at the host level).

Query the Kubelet's API endpoint at `http://localhost:10255/pods`:

```shell
curl http://localhost:10255/pods | jq '.'
```

To obtain the IP address of the `static-web` Pod:

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

The output is similar to:

```
"10.85.0.4"
```

Connect to the `nginx` server Pod on `http://<IP>:<Port>` (port 80 is the default), in this case:

```shell
curl http://10.85.0.4
```

The output is similar to:

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

## Where to look for more details

If you need to diagnose a problem getting this tutorial to work, you can look
within the following directories for monitoring and troubleshooting:

```
/var/lib/cni
/var/lib/containers
/var/lib/kubelet

/var/log/containers
/var/log/pods
```

## Clean up

### Kubelet

```shell
sudo systemctl disable --now kubelet.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/kubelet.service
sudo rm /usr/bin/kubelet
sudo rm -rf /etc/kubernetes
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/log/containers
sudo rm -rf /var/log/pods
```

### Container Runtime

```shell
sudo systemctl disable --now crio.service
sudo systemctl daemon-reload
sudo rm -rf /usr/local/bin
sudo rm -rf /usr/local/lib
sudo rm -rf /usr/local/share
sudo rm -rf /usr/libexec/crio
sudo rm -rf /etc/crio
sudo rm -rf /etc/containers
```

### Network Plugins

```shell
sudo rm -rf /opt/cni
sudo rm -rf /etc/cni
sudo rm -rf /var/lib/cni
```

## Conclusion

This page covered the basic aspects of deploying a kubelet in standalone mode.
You are now ready to deploy Pods and test additional functionality.

Notice that in standalone mode the Kubelet does *not* support fetching Pod
configurations from the control plane (because there is no control plane connection).

You also cannot use a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} or a
{{< glossary_tooltip text="Secret" term_id="secret" >}} to configure the containers
in a static Pod.

## {{% heading "whatsnext" %}}

* Follow [Hello, minikube](/docs/tutorials/hello-minikube/) to learn about running Kubernetes
  _with_ a control plane. The minikube tool helps you set up a practice cluster on your own computer.
* Learn more about [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* Learn more about [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
* Learn more about [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* Learn more about [static Pods](/docs/tasks/configure-pod-container/static-pod/)
