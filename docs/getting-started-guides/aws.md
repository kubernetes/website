---
assignees:
- justinsb
- clove
title: Running Kubernetes on AWS EC2
---

* TOC
{:toc}


## Supported Production Grade Tools with High Availability Options

* [Kubernetes Operations](https://github.com/kubernetes/kops) - Production Grade K8s Installation, Upgrades, and Management. Supports running Debian, Ubuntu, CentOS, and RHEL in AWS.

* CoreOS maintains [a CLI tool](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html), `kube-aws` that will create and manage a Kubernetes cluster based on [CoreOS](http://www.coreos.com), using AWS tools: EC2, CloudFormation and Autoscaling.

---

## kube-up bash script

> `kube-up.sh` is a legacy tool that is an easy way to spin up a cluster.  This tool is being deprecated, and does not create a production ready environment.


### Prerequisites

1. You need an AWS account. Visit [http://aws.amazon.com](http://aws.amazon.com) to get started
2. Install and configure the [AWS Command Line Interface](http://aws.amazon.com/cli)
3. We recommend installing using an account which has full access to the AWS APIs.

NOTE: This script use the 'default' AWS profile by default.
You may explicitly set the AWS profile to use using the `AWS_DEFAULT_PROFILE` environment variable:

```shell
export AWS_DEFAULT_PROFILE=myawsprofile
```

### Cluster turnup

#### Supported procedure: `get-kube`

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

By default, the script will provision a new VPC and a 4 node k8s cluster in us-west-2a (Oregon) with EC2 instances running on Debian.
You can override the variables defined in [config-default.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/aws/config-default.sh) to change this behavior as follows:

```shell
export KUBE_AWS_ZONE=eu-west-1c
export NUM_NODES=2
export MASTER_SIZE=m3.medium
export NODE_SIZE=m3.medium
export AWS_S3_REGION=eu-west-1
export AWS_S3_BUCKET=mycompany-kubernetes-artifacts
export KUBE_AWS_INSTANCE_PREFIX=k8s
...
```

If you don't specify master and minion sizes, the scripts will attempt to guess
the correct size of the master and worker nodes based on `${NUM_NODES}`. In
version 1.3 these default are:

* For the master, for clusters of less than 5 nodes it will use an
  `m3.medium`, for 6-10 nodes it will use an `m3.large`;
  for 11-100 nodes it will use an `m3.xlarge`.

* For worker nodes, for clusters less than 50 nodes it will use a `t2.micro`,
  for clusters between 50 and 150 nodes it will use a `t2.small` and for
  clusters with greater than 150 nodes it will use a `t2.medium`.

WARNING: beware that `t2` instances receive a limited number of CPU credits per hour and might not be suitable for clusters where the CPU is used
consistently. As a rough estimation, consider 15 pods/node the absolute limit a `t2.large` instance can handle before it starts exhausting its CPU credits
steadily, although this number depends heavily on the usage.

In prior versions of Kubernetes, we defaulted the master node to a t2-class
instance, but found that this sometimes gave hard-to-diagnose problems when the
master ran out of memory or CPU credits.  If you are running a test cluster
and want to save money, you can specify `export MASTER_SIZE=t2.micro` but if
your master pauses do check the CPU credits in the AWS console.

For production usage, we recommend at least `export MASTER_SIZE=m3.medium` and
`export NODE_SIZE=m3.medium`.  And once you get above a handful of nodes, be
aware that one m3.large instance has more storage than two m3.medium instances,
for the same price.

We generally recommend the m3 instances over the m4 instances, because the m3
instances include local instance storage.  Historically local instance storage
has been more reliable than AWS EBS, and performance should be more consistent.
The ephemeral nature of this storage is a match for ephemeral container
workloads also!

If you use an m4 instance, or another instance type which does not have local
instance storage, you may want to increase the `NODE_ROOT_DISK_SIZE` value,
although the default value of 32 is probably sufficient for the smaller
instance types in the m4 family.

The script will also try to create or reuse a keypair called "kubernetes", and IAM profiles called "kubernetes-master" and "kubernetes-minion".
If these already exist, make sure you want them to be used here.

NOTE: If using an existing keypair named "kubernetes" then you must set the `AWS_SSH_KEY` key to point to your private key.



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

## Scaling the cluster

Adding and removing nodes through `kubectl` is not supported. You can still scale the amount of nodes manually through adjustments of the 'Desired' and 'Max' properties within the [Auto Scaling Group](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html), which was created during the installation.

## Tearing down the cluster

Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:

```shell
cluster/kube-down.sh
```

## Support Level


IaaS Provider        | Config. Mgmt | OS            | Networking  | Docs                                          | Conforms | Support Level
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | Saltstack    | Debian/Ubuntu | k8s (VPC)   | [docs](/docs/getting-started-guides/aws)      |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | kops         | Debian        | k8s (VPC)   | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [docs](/docs/getting-started-guides/aws)      |          | Community

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.
