---
title: 'Announcing Kubeflow 0.1'
date: 2018-05-04
author: aronchick
slug: announcing-kubeflow-0.1
---

# Since Last We Met

Since the [initial announcement](https://kubernetes.io/blog/2017/12/introducing-kubeflow-composable) of Kubeflow at [the last KubeCon+CloudNativeCon](https://kccncna17.sched.com/event/CU5v/hot-dogs-or-not-at-scale-with-kubernetes-i-vish-kannan-david-aronchick-google), we have been both surprised and delighted by the excitement for building great ML stacks for Kubernetes. In just over five months, the [Kubeflow project](https://github.com/kubeflow) now has:

* 70+ contributors 
* 20+ contributing organizations
* 15 repositories
* 3100+ GitHub stars
* 700+ commits 

and already is among the top 2% of GitHub projects **_ever_**.

People are excited to chat about Kubeflow as well! The Kubeflow community has also held meetups, talks and public sessions all around the world with thousands of attendees. With all this help, we’ve started to make substantial in every step of ML, from building your first model all the way to building a production-ready, high-scale deployments. At the end of the day, our mission remains the same: we want to let data scientists and software engineers focus on the things they do well by giving them an easy-to-use, portable and scalable ML stack. 

# Introducing Kubeflow 0.1

Today, we’re proud to announce the availability of Kubeflow 0.1, which provides a minimal set of packages to begin developing, training and deploying ML. In just a few commands, you can get:

* **Jupyter Hub** - for collaborative & interactive training
* A **TensorFlow Training Controller** with native distributed training
* A **TensorFlow Serving** for hosting
* **Argo** for workflows
* **SeldonCore** for complex inference and non TF models
* **Ambassador** for Reverse Proxy 
* Wiring to make it work on any Kubernetes anywhere

To get started, it’s just as easy as it always has been:

```
# Create a namespace for kubeflow deployment
NAMESPACE=kubeflow
kubectl create namespace ${NAMESPACE}
VERSION=v0.1.3

# Initialize a ksonnet app. Set the namespace for it's default environment.
APP_NAME=my-kubeflow
ks init ${APP_NAME}
cd ${APP_NAME}
ks env set default --namespace ${NAMESPACE}

# Install Kubeflow components
ks registry add kubeflow github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow
ks pkg install kubeflow/core@${VERSION}
ks pkg install kubeflow/tf-serving@${VERSION}
ks pkg install kubeflow/tf-job@${VERSION}

# Create templates for core components
ks generate kubeflow-core kubeflow-core

# Deploy Kubeflow
ks apply default -c kubeflow-core
```

And thats it! JupyterHub is deployed so we can now use Jupyter to begin developing models. Once we have python code to build our model we can build a docker image and train our model using our TFJob operator by running commands like the following: 
```
ks generate tf-job my-tf-job --name=my-tf-job --image=gcr.io/my/image:latest
ks apply default -c my-tf-job

We could then deploy the model by doing

ks generate tf-serving ${MODEL_COMPONENT} --name=${MODEL_NAME}
ks param set ${MODEL_COMPONENT} modelPath ${MODEL_PATH}
ks apply ${ENV} -c ${MODEL_COMPONENT}
```

Within just a few commands, data scientists and software engineers can now create even complicated ML solutions and focus on what they do best: answering business critical questions.

# Community Contributions
It’d be impossible to have gotten where we are without enormous help from everyone in the community. Some specific contributions that we want to highlight include:

* [Argo](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/argo) for managing ML workflows
* [Caffe2 Operator](https://github.com/kubeflow/caffe2-operator) for running Caffe2 jobs
* [Horovod & OpenMPI](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/openmpi) for improved distributed training performance of TensorFlow
* [Identity Aware Proxy](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/iap.md), which enables using security your services with identities, rather than VPNs and Firewalls
* [Katib](https://github.com/kubeflow/katib) for hyperparameter tuning
* [Kubernetes volume controller](https://github.com/kubeflow/experimental-kvc) which provides basic volume and data management using volumes and volume sources in a Kubernetes cluster.
* [Kubebench](https://github.com/kubeflow/kubebench) for benchmarking of HW and ML stacks
* [Pachyderm](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/pachyderm) for managing complex data pipelines
* [PyTorch operator](https://github.com/kubeflow/pytorch-operator) for running PyTorch jobs
* [Seldon Core](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/seldon) for running complex model deployments and non-TensorFlow serving

It’s difficult to overstate how much the community has helped bring all these projects (and more) to fruition. Just a few of the contributing companies include: Alibaba Cloud, Ant Financial, Caicloud, Canonical, Cisco, Datawire, Dell, GitHub, Google, Heptio, Huawei, Intel, Microsoft, Momenta, One Convergence, Pachyderm, Project Jupyter, Red Hat, Seldon, Uber and Weaveworks.

# Learning More

If you’d like to try out Kubeflow, we have a number of options for you:

1. You can use sample walkthroughs hosted on [Katacoda](https://www.katacoda.com/kubeflow)
2. You can follow a guided tutorial with existing models from the [examples repository](https://github.com/kubeflow/examples). These include the [GitHub Issue Summarization](https://github.com/kubeflow/examples/tree/master/github_issue_summarization), [MNIST](https://github.com/kubeflow/examples/tree/master/mnist) and [Reinforcement Learning with Agents](https://github.com/kubeflow/examples/tree/master/agents).
3. You can start a cluster on your own and try your own model. Any Kubernetes conformant cluster will support Kubeflow including those from contributors [Caicloud](https://www.prnewswire.com/news-releases/caicloud-releases-its-kubernetes-based-cluster-as-a-service-product-claas-20-and-the-first-tensorflow-as-a-service-taas-11-while-closing-6m-series-a-funding-300418071.html), [Canonical](https://jujucharms.com/canonical-kubernetes/), [Google](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-container-cluster), [Heptio](https://heptio.com/products/kubernetes-subscription/), [Mesosphere](https://github.com/mesosphere/dcos-kubernetes-quickstart), [Microsoft](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough), [IBM](https://cloud.ibm.com/docs/containers?topic=containers-cs_cluster_tutorial#cs_cluster_tutorial), [Red Hat/Openshift ](https://docs.openshift.com/container-platform/3.3/install_config/install/quick_install.html#install-config-install-quick-install)and [Weaveworks](https://www.weave.works/product/cloud/).

There were also a number of sessions at KubeCon + CloudNativeCon  EU 2018 covering Kubeflow. The links to the talks are here; the associated videos will be posted in the coming days. 

* Wednesday, May 2:
    * [Kubeflow Intro - Michał Jastrzębski & Ala Raddaoui, Intel](http://sched.co/Drmt)

* Thursday, May 3:
    * [Kubeflow Deep Dive - Jeremy Lewi, Google](http://sched.co/Drnd)
    * [Write Once, Train & Predict Everywhere: Portable ML Stacks with Kubeflow - Jeremy Lewi, Google & Stephan Fabel, Canonical](http://sched.co/Dquu)
    * [Compliant Data Management and Machine Learning on Kubernetes - Daniel Whitenack, Pachyderm](http://sched.co/DqvC)
    * [Bringing Your Data Pipeline into The Machine Learning Era - Chris Gaun & Jörg Schad, Mesosphere](https://kccnceu18.sched.com/event/E46y/bringing-your-data-pipeline-into-the-machine-learning-era-chris-gaun-jorg-schad-mesosphere-intermediate-skill-level)

* Friday, May 4:
    * [Keynote: Kubeflow ML on Kubernetes - David Aronchick & Vishnu Kannan, Google](http://sched.co/Duoq)
    * [Conquering a Kubeflow Kubernetes Cluster with ksonnet, Ark, and Sonobuoy - Kris Nova, Heptio & David Aronchick, Google](http://sched.co/Dqv6)
    * [Serving ML Models at Scale with Seldon and Kubeflow - Clive Cox, Seldon.io](http://sched.co/Dqvw)

# What’s Next?

Our next major release will be 0.2 coming this summer. In it, we expect to land the following new features:

* Simplified setup via a bootstrap container
* Improved accelerator integration
* Support for more ML frameworks, e.g., Spark ML, XGBoost, sklearn
* Autoscaled TF Serving
* Programmatic data transforms, e.g., tf.transform

But the most important feature is the one we haven’t heard yet. Please tell us! Some options for making your voice heard include:

* The [Kubeflow Slack channel](https://join.slack.com/t/kubeflow/shared_invite/enQtMjgyMzMxNDgyMTQ5LWUwMTIxNmZlZTk2NGU0MmFiNDE4YWJiMzFiOGNkZGZjZmRlNTExNmUwMmQ2NzMwYzk5YzQxOWQyODBlZGY2OTg)
* The [Kubeflow-discuss](https://groups.google.com/forum/#!forum/kubeflow-discuss) email list
* The [Kubeflow twitter](http://twitter.com/kubeflow) account
* Our [weekly community meeting](https://github.com/kubeflow/community)
* Please download and run [kubeflow](https://github.com/kubeflow/kubeflow/pull/330/files), and submit bugs!

Thank you for all your support so far!
*Jeremy Lewi & David Aronchick* Google
