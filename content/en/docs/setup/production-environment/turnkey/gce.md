---
reviewers:
- brendandburns
- jbeda
- mikedanese
- thockin
title: Running Kubernetes on Google Compute Engine
content_template: templates/task
---

{{% capture overview %}}

The example below creates a Kubernetes cluster with 3 worker node Virtual Machines and a master Virtual Machine (i.e. 4 VMs in your cluster). This cluster is set up and controlled from your workstation (or wherever you find convenient).

{{% /capture %}}

{{% capture prerequisites %}}

If you want a simplified getting started experience and GUI for managing clusters, please consider trying [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) for hosted cluster installation and management.

For an easy way to experiment with the Kubernetes development environment, click the button below
to open a Google Cloud Shell with an auto-cloned copy of the Kubernetes source repo.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/kubernetes/kubernetes&page=editor&open_in_editor=README.md)

If you want to use custom binaries or pure open source Kubernetes, please continue with the instructions below.

### Prerequisites

1. You need a Google Cloud Platform account with billing enabled. Visit the [Google Developers Console](https://console.cloud.google.com) for more details.
1. Install `gcloud` as necessary. `gcloud` can be installed as a part of the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Enable the [Compute Engine Instance Group Manager API](https://console.developers.google.com/apis/api/replicapool.googleapis.com/overview) in the [Google Cloud developers console](https://console.developers.google.com/apis/library).
1. Make sure that gcloud is set to use the Google Cloud Platform project you want. You can check the current project using `gcloud config list project` and change it via `gcloud config set project <project-id>`.
1. Make sure you have credentials for GCloud by running `gcloud auth login`.
1. (Optional)  In order to make API calls against GCE, you must also run `gcloud auth application-default login`.
1. Make sure you can start up a GCE VM from the command line.  At least make sure you can do the [Create an instance](https://cloud.google.com/compute/docs/instances/#startinstancegcloud) part of the GCE Quickstart.
1. Make sure you can SSH into the VM without interactive prompts.  See the [Log in to the instance](https://cloud.google.com/compute/docs/instances/#sshing) part of the GCE Quickstart.

{{% /capture %}}

{{% capture steps %}}

## Starting a cluster

You can install a client and start a cluster with either one of these commands (we list both in case only one is installed on your machine):


```shell
curl -sS https://get.k8s.io | bash
```

or

```shell
wget -q -O - https://get.k8s.io | bash
```

Once this command completes, you will have a master VM and four worker VMs, running as a Kubernetes cluster.

By default, some containers will already be running on your cluster. Containers like `fluentd` provide [logging](/docs/concepts/cluster-administration/logging/), while `heapster` provides [monitoring](https://releases.k8s.io/master/cluster/addons/cluster-monitoring/README.md) services.

The script run by the commands above creates a cluster with the name/prefix "kubernetes". It defines one specific cluster config, so you can't run it more than once.

Alternately, you can download and install the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases), then run the `<kubernetes>/cluster/kube-up.sh` script to start the cluster:

```shell
cd kubernetes
cluster/kube-up.sh
```

If you want more than one cluster running in your project, want to use a different name, or want a different number of worker nodes, see the `<kubernetes>/cluster/gce/config-default.sh` file for more fine-grained configuration before you start up your cluster.

If you run into trouble, please see the section on [troubleshooting](/docs/setup/production-environment/turnkey/gce/#troubleshooting), post to the
[Kubernetes Forum](https://discuss.kubernetes.io), or come ask questions on [Slack](/docs/troubleshooting/#slack).

The next few steps will show you:

1. How to set up the command line client on your workstation to manage the cluster
1. Examples of how to use the cluster
1. How to delete the cluster
1. How to start clusters with non-default options (like larger clusters)

## Installing the Kubernetes command line tools on your workstation

The cluster startup script will leave you with a running cluster and a `kubernetes` directory on your workstation.

The [kubectl](/docs/user-guide/kubectl/) tool controls the Kubernetes cluster
manager.  It lets you inspect your cluster resources, create, delete, and update
components, and much more. You will use it to look at your new cluster and bring
up example apps.

You can use `gcloud` to install the `kubectl` command-line tool on your workstation:

```shell
gcloud components install kubectl
```

{{< note >}}
The kubectl version bundled with `gcloud` may be older than the one
downloaded by the get.k8s.io install script. See [Installing kubectl](/docs/tasks/kubectl/install/)
document to see how you can set up the latest `kubectl` on your workstation.
{{< /note >}}

## Getting started with your cluster

### Inspect your cluster

Once `kubectl` is in your path, you can use it to look at your cluster. E.g., running:

```shell
kubectl get --all-namespaces services
```

should show a set of [services](/docs/user-guide/services) that look something like this:

```shell
NAMESPACE     NAME          TYPE             CLUSTER_IP       EXTERNAL_IP       PORT(S)        AGE
default       kubernetes    ClusterIP        10.0.0.1         <none>            443/TCP        1d
kube-system   kube-dns      ClusterIP        10.0.0.2         <none>            53/TCP,53/UDP  1d
kube-system   kube-ui       ClusterIP        10.0.0.3         <none>            80/TCP         1d
...
```

Similarly, you can take a look at the set of [pods](/docs/user-guide/pods) that were created during cluster startup.
You can do this via the

```shell
kubectl get --all-namespaces pods
```

command.

You'll see a list of pods that looks something like this (the name specifics will be different):

```shell
NAMESPACE     NAME                                           READY     STATUS    RESTARTS   AGE
kube-system   coredns-5f4fbb68df-mc8z8                       1/1       Running   0          15m
kube-system   fluentd-cloud-logging-kubernetes-minion-63uo   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c1n9   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-c4og   1/1       Running   0          14m
kube-system   fluentd-cloud-logging-kubernetes-minion-ngua   1/1       Running   0          14m
kube-system   kube-ui-v1-curt1                               1/1       Running   0          15m
kube-system   monitoring-heapster-v5-ex4u3                   1/1       Running   1          15m
kube-system   monitoring-influx-grafana-v1-piled             2/2       Running   0          15m
```

Some of the pods may take a few seconds to start up (during this time they'll show `Pending`), but check that they all show as `Running` after a short period.

### Run some examples

Then, see [a simple nginx example](/docs/user-guide/simple-nginx) to try out your new cluster.

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/).  The [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/) is a good "getting started" walkthrough.

## Tearing down the cluster

To remove/delete/teardown the cluster, use the `kube-down.sh` script.

```shell
cd kubernetes
cluster/kube-down.sh
```

Likewise, the `kube-up.sh` in the same directory will bring it back up. You do not need to rerun the `curl` or `wget` command: everything needed to setup the Kubernetes cluster is now on your workstation.

## Customizing

The script above relies on Google Storage to stage the Kubernetes release. It
then will start (by default) a single master VM along with 3 worker VMs.  You
can tweak some of these parameters by editing `kubernetes/cluster/gce/config-default.sh`
You can view a transcript of a successful cluster creation
[here](https://gist.github.com/satnam6502/fc689d1b46db9772adea).

## Troubleshooting

### Project settings

You need to have the Google Cloud Storage API, and the Google Cloud Storage
JSON API enabled. It is activated by default for new projects. Otherwise, it
can be done in the Google Cloud Console.  See the [Google Cloud Storage JSON
API Overview](https://cloud.google.com/storage/docs/json_api/) for more
details.

Also ensure that-- as listed in the [Prerequisites section](#prerequisites)-- you've enabled the `Compute Engine Instance Group Manager API`, and can start up a GCE VM from the command line as in the [GCE Quickstart](https://cloud.google.com/compute/docs/quickstart) instructions.

### Cluster initialization hang

If the Kubernetes startup script hangs waiting for the API to be reachable, you can troubleshoot by SSHing into the master and node VMs and looking at logs such as `/var/log/startupscript.log`.

**Once you fix the issue, you should run `kube-down.sh` to cleanup** after the partial cluster creation, before running `kube-up.sh` to try again.

### SSH

If you're having trouble SSHing into your instances, ensure the GCE firewall
isn't blocking port 22 to your VMs.  By default, this should work but if you
have edited firewall rules or created a new non-default network, you'll need to
expose it: `gcloud compute firewall-rules create default-ssh --network=<network-name>
--description "SSH allowed from anywhere" --allow tcp:22`

Additionally, your GCE SSH key must either have no passcode or you need to be
using `ssh-agent`.

### Networking

The instances must be able to connect to each other using their private IP. The
script uses the "default" network which should have a firewall rule called
"default-allow-internal" which allows traffic on any port on the private IPs.
If this rule is missing from the default network or if you change the network
being used in `cluster/config-default.sh` create a new rule with the following
field values:

* Source Ranges: `10.0.0.0/8`
* Allowed Protocols and Port: `tcp:1-65535;udp:1-65535;icmp`

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/setup/production-environment/turnkey/gce/)                                    |   | Project


## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.

{{% /capture %}}
