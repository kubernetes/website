---
---

* TOC
{:toc}

## Prerequisites

1. You need an AWS account. Visit [http://aws.amazon.com](http://aws.amazon.com) to get started
2. Install and configure [AWS Command Line Interface](http://aws.amazon.com/cli)
3. You need an AWS [instance profile and role](http://docs.aws.amazon.com/IAM/latest/UserGuide/instance-profiles) with EC2 full access.

NOTE: This script use the 'default' AWS profile by default.
You may explicitly set AWS profile to use using the `AWS_DEFAULT_PROFILE` environment variable:

```shell
export AWS_DEFAULT_PROFILE=myawsprofile
```

## Cluster turnup

### Supported procedure: `get-kube`

```shell
#Using wget
export KUBERNETES_PROVIDER=aws; wget -q -O - https://get.k8s.io | bash
#Using cURL
export KUBERNETES_PROVIDER=aws; curl -sS https://get.k8s.io | bash
```

NOTE: This script calls [cluster/kube-up.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/kube-up.sh)
which in turn calls [cluster/aws/util.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/aws/util.sh)
using [cluster/aws/config-default.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/aws/config-default.sh).

This process takes about 5 to 10 minutes. Once the cluster is up, the IP addresses of your master and node(s) will be printed,
as well as information about the default services running in the cluster (monitoring, logging, dns). User credentials and security
tokens are written in `~/.kube/config`, they will be necessary to use the CLI or the HTTP Basic Auth.

By default, the script will provision a new VPC and a 4 node k8s cluster in us-west-2a (Oregon) with `t2.micro` instances running on Ubuntu.
You can override the variables defined in [config-default.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/aws/config-default.sh) to change this behavior as follows:

```shell
export KUBE_AWS_ZONE=eu-west-1c
export NUM_MINIONS=2
export MINION_SIZE=m3.medium
export AWS_S3_REGION=eu-west-1
export AWS_S3_BUCKET=mycompany-kubernetes-artifacts
export INSTANCE_PREFIX=k8s
...
```

It will also try to create or reuse a keypair called "kubernetes", and IAM profiles called "kubernetes-master" and "kubernetes-minion".
If these already exist, make sure you want them to be used here.

NOTE: If using an existing keypair named "kubernetes" then you must set the `AWS_SSH_KEY` key to point to your private key.

### Alternatives

A contributed [example](/docs/getting-started-guides/coreos/coreos_multinode_cluster) allows you to setup a Kubernetes cluster based on [CoreOS](http://www.coreos.com), using
EC2 with user data (cloud-config).

## Getting started with your cluster

### Command line administration tool: `kubectl`

The cluster startup script will leave you with a `kubernetes` directory on your workstation.
Alternately, you can download the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases).

Next, add the appropriate binary folder to your `PATH` to access kubectl:

```shell
# OS X
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH
# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

An up-to-date documentation page for this tool is available here: [kubectl manual](/docs/user-guide/kubectl/kubectl)

By default, `kubectl` will use the `kubeconfig` file generated during the cluster startup for authenticating against the API.
For more information, please read [kubeconfig files](/docs/user-guide/kubeconfig-file)

### Examples

See [a simple nginx example](/docs/user-guide/simple-nginx) to try out your new cluster.

The "Guestbook" application is another popular example to get started with Kubernetes: [guestbook example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/)

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/)

## Tearing down the cluster

Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:

```shell
cluster/kube-down.sh
```

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.