---
assignees:
- david-mcmahon
- jbeda

---

You can either build a release from sources or download a pre-built release.  If you do not plan on developing Kubernetes itself, we suggest a pre-built release. 

If you just want to run Kubernetes locally for development, we recommend using Minikube. You can download Minikube [here](https://github.com/kubernetes/minikube/releases/latest).
Minikube sets up a local VM that runs a Kubernetes cluster securely, and makes it easy to work with that cluster.

* TOC
{:toc}

### Prebuilt Binary Release

The list of binary releases is available for download from the [GitHub Kubernetes repo release page](https://github.com/kubernetes/kubernetes/releases).

Download the latest release and unpack this tar file on Linux or OS X, cd to the created `kubernetes/` directory, and then follow the getting started guide for your cloud.

On OS X you can also use the [homebrew](http://brew.sh/) package manager: `brew install kubernetes-cli`

### Building from source

Get the Kubernetes source.  If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.

Building a release is simple.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

For more details on the release process see the [`build/` directory](http://releases.k8s.io/{{page.githubbranch}}/build/)

### Download Kubernetes and automatically set up a default cluster

The bash script at `https://get.k8s.io`, which can be run with `wget` or `curl`, automatically downloads Kubernetes, and provisions a cluster based on your desired cloud provider.

```shell
# wget version
export KUBERNETES_PROVIDER=YOUR_PROVIDER; wget -q -O - https://get.k8s.io | bash

# curl version
export KUBERNETES_PROVIDER=YOUR_PROVIDER; curl -sS https://get.k8s.io | bash
```

Possible values for `YOUR_PROVIDER` include:

* `gce` - Google Compute Engine [default]
* `gke` - Google Container Engine
* `aws` - Amazon EC2
* `azure` - Microsoft Azure
* `vagrant` - Vagrant (on local virtual machines)
* `vsphere` - VMWare VSphere
* `rackspace` - Rackspace

For the complete, up-to-date list of providers supported by this script, see [the `/cluster` folder in the main Kubernetes repo](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/cluster), where each folder represents a possible value for `YOUR_PROVIDER`. If you don't see your desired provider, try looking at our [getting started guides](/docs/getting-started-guides); there's a good chance we have docs for them.
