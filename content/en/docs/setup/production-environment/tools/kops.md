---
title: Installing Kubernetes with kops
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

This quickstart shows you how to easily install a Kubernetes cluster on AWS.
It uses a tool called [`kops`](https://github.com/kubernetes/kops).

kops is an opinionated provisioning system:

* Fully automated installation
* Uses DNS to identify clusters
* Self-healing: everything runs in Auto-Scaling Groups
* Multiple OS support (Debian, Ubuntu 16.04 supported, CentOS & RHEL, Amazon Linux and CoreOS) - see the [images.md](https://github.com/kubernetes/kops/blob/master/docs/images.md)
* High-Availability support - see the [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* Can directly provision, or generate terraform manifests - see the [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)

If your opinions differ from these you may prefer to build your own cluster using [kubeadm](/docs/admin/kubeadm/) as
a building block.  kops builds on the kubeadm work.

{{% /capture %}}

{{% capture body %}}

## Creating a cluster

### (1/5) Install kops

#### Requirements

You must have [kubectl](/docs/tasks/tools/install-kubectl/) installed in order for kops to work.

#### Installation

Download kops from the [releases page](https://github.com/kubernetes/kops/releases) (it is also easy to build from source):

On macOS:

```shell
curl -OL https://github.com/kubernetes/kops/releases/download/1.10.0/kops-darwin-amd64
chmod +x kops-darwin-amd64
mv kops-darwin-amd64 /usr/local/bin/kops
# you can also install using Homebrew
brew update && brew install kops
```

On Linux:

```shell
wget https://github.com/kubernetes/kops/releases/download/1.10.0/kops-linux-amd64
chmod +x kops-linux-amd64
mv kops-linux-amd64 /usr/local/bin/kops
```

### (2/5) Create a route53 domain for your cluster

kops uses DNS for discovery, both inside the cluster and so that you can reach the kubernetes API server
from clients.

kops has a strong opinion on the cluster name: it should be a valid DNS name.  By doing so you will
no longer get your clusters confused, you can share clusters with your colleagues unambiguously,
and you can reach them without relying on remembering an IP address.

You can, and probably should, use subdomains to divide your clusters.  As our example we will use
`useast1.dev.example.com`.  The API server endpoint will then be `api.useast1.dev.example.com`.

A Route53 hosted zone can serve subdomains.  Your hosted zone could be `useast1.dev.example.com`,
but also `dev.example.com` or even `example.com`.  kops works with any of these, so typically
you choose for organization reasons (e.g. you are allowed to create records under `dev.example.com`,
but not under `example.com`).

Let's assume you're using `dev.example.com` as your hosted zone.  You create that hosted zone using
the [normal process](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), or
with a command such as `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.

You must then set up your NS records in the parent domain, so that records in the domain will resolve.  Here,
you would create NS records in `example.com` for `dev`.  If it is a root domain name you would configure the NS
records at your domain registrar (e.g. `example.com` would need to be configured where you bought `example.com`).

This step is easy to mess up (it is the #1 cause of problems!)  You can double-check that
your cluster is configured correctly if you have the dig tool by running:

`dig NS dev.example.com`

You should see the 4 NS records that Route53 assigned your hosted zone.

### (3/5) Create an S3 bucket to store your clusters state

kops lets you manage your clusters even after installation.  To do this, it must keep track of the clusters
that you have created, along with their configuration, the keys they are using etc.  This information is stored
in an S3 bucket.  S3 permissions are used to control access to the bucket.

Multiple clusters can use the same S3 bucket, and you can share an S3 bucket between your colleagues that
administer the same clusters - this is much easier than passing around kubecfg files.  But anyone with access
to the S3 bucket will have administrative access to all your clusters, so you don't want to share it beyond
the operations team.

So typically you have one S3 bucket for each ops team (and often the name will correspond
to the name of the hosted zone above!)

In our example, we chose `dev.example.com` as our hosted zone, so let's pick `clusters.dev.example.com` as
the S3 bucket name.

* Export `AWS_PROFILE` (if you need to select a profile for the AWS CLI to work)

* Create the S3 bucket using `aws s3 mb s3://clusters.dev.example.com`

* You can `export KOPS_STATE_STORE=s3://clusters.dev.example.com` and then kops will use this location by default.
   We suggest putting this in your bash profile or similar.


### (4/5) Build your cluster configuration

Run "kops create cluster" to create your cluster configuration:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops will create the configuration for your cluster.  Note that it _only_ creates the configuration, it does
not actually create the cloud resources - you'll do that in the next step with a `kops update cluster`.  This
give you an opportunity to review the configuration or change it.

It prints commands you can use to explore further:

* List your clusters with: `kops get cluster`
* Edit this cluster with: `kops edit cluster useast1.dev.example.com`
* Edit your node instance group: `kops edit ig --name=useast1.dev.example.com nodes`
* Edit your master instance group: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

If this is your first time using kops, do spend a few minutes to try those out!  An instance group is a
set of instances, which will be registered as kubernetes nodes.  On AWS this is implemented via auto-scaling-groups.
You can have several instance groups, for example if you wanted nodes that are a mix of spot and on-demand instances, or
GPU and non-GPU instances.


### (5/5) Create the cluster in AWS

Run "kops update cluster" to create your cluster in AWS:

`kops update cluster useast1.dev.example.com --yes`

That takes a few seconds to run, but then your cluster will likely take a few minutes to actually be ready.
`kops update cluster` will be the tool you'll use whenever you change the configuration of your cluster; it
applies the changes you have made to the configuration to your cluster - reconfiguring AWS or kubernetes as needed.

For example, after you `kops edit ig nodes`, then `kops update cluster --yes` to apply your configuration, and
sometimes you will also have to `kops rolling-update cluster` to roll out the configuration immediately.

Without `--yes`, `kops update cluster` will show you a preview of what it is going to do.  This is handy
for production clusters!

### Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.

## Cleanup

* To delete your cluster: `kops delete cluster useast1.dev.example.com --yes`

## Feedback

* Slack Channel: [#kops-users](https://kubernetes.slack.com/messages/kops-users/)
* [GitHub Issues](https://github.com/kubernetes/kops/issues)

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Learn about `kops` [advanced usage](https://github.com/kubernetes/kops)
* See the `kops` [docs](https://github.com/kubernetes/kops) section for tutorials, best practices and advanced configuration options.

{{% /capture %}}
