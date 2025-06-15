---
title: " Introducing Kubeflow - A Composable, Portable, Scalable ML Stack Built for Kubernetes "
date: 2017-12-21
slug: introducing-kubeflow-composable
url: /blog/2017/12/Introducing-Kubeflow-Composable
author: >
  Jeremy Lewi (Google),
  David Aronchick (Google)
---

## Kubernetes and Machine Learning
Kubernetes has quickly become the hybrid solution for deploying complicated workloads anywhere. While it started with just stateless services, customers have begun to move complex workloads to the platform, taking advantage of rich APIs, reliability and performance provided by Kubernetes. One of the fastest growing use cases is to use Kubernetes as the deployment platform of choice for machine learning.  

Building any production-ready machine learning system involves various components, often mixing vendors and hand-rolled solutions. Connecting and managing these services for even moderately sophisticated setups introduces huge barriers of complexity in adopting machine learning. Infrastructure engineers will often spend a significant amount of time manually tweaking deployments and hand rolling solutions before a single model can be tested.  

Worse, these deployments are so tied to the clusters they have been deployed to that these stacks are immobile, meaning that moving a model from a laptop to a highly scalable cloud cluster is effectively impossible without significant re-architecture. All these differences add up to wasted effort and create opportunities to introduce bugs at each transition.



## Introducing Kubeflow
To address these concerns, we’re announcing the creation of the Kubeflow project, a new open source GitHub repo dedicated to making using ML stacks on Kubernetes easy, fast and extensible. This repository contains:  

- JupyterHub to create & manage interactive Jupyter notebooks
- A Tensorflow [Custom Resource](/docs/concepts/api-extension/custom-resources/) (CRD) that can be configured to use CPUs or GPUs, and adjusted to the size of a cluster with a single setting
- A TF Serving container
Because this solution relies on Kubernetes, it runs wherever Kubernetes runs. Just spin up a cluster and go!



## Using Kubeflow
Let's suppose you are working with two different Kubernetes clusters: a local [minikube](https://github.com/kubernetes/minikube) cluster; and a [GKE cluster with GPUs](https://docs.google.com/forms/d/1JNnoUe1_3xZvAogAi16DwH6AjF2eu08ggED24OGO7Xc/viewform?edit_requested=true); and that you have two [kubectl contexts](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#define-clusters-users-and-contexts) defined named minikube and gke.



First we need to initialize our [ksonnet](https://github.com/ksonnet) application and install the Kubeflow packages. (To use ksonnet, you must first install it on your operating system - the instructions for doing so are [here](https://github.com/ksonnet/ksonnet))


```
     ks init my-kubeflow  
     cd my-kubeflow  
     ks registry add kubeflow \  
     github.com/google/kubeflow/tree/master/kubeflow  
     ks pkg install kubeflow/core  
     ks pkg install kubeflow/tf-serving  
     ks pkg install kubeflow/tf-job  
     ks generate core kubeflow-core --name=kubeflow-core
```


We can now define [environments](https://ksonnet.io/docs/concepts#environment) corresponding to our two clusters.  

```  
     kubectl config use-context minikube  
     ks env add minikube  

     kubectl config use-context gke  
     ks env add gke  
```  

And we’re done! Now just create the environments on your cluster. First, on minikube:  

```  
     ks apply minikube -c kubeflow-core  
```  

And to create it on our multi-node GKE cluster for quicker training:  

```  
     ks apply gke -c kubeflow-core  
```  

By making it easy to deploy the same rich ML stack everywhere, the drift and rewriting between these environments is kept to a minimum.  

To access either deployments, you can execute the following command:  

```  
     kubectl port-forward tf-hub-0 8100:8000  
```  

and then open up http://127.0.0.1:8100 to access JupyterHub. To change the environment used by kubectl, use either of these commands:  

```  
     # To access minikube  
     kubectl config use-context minikube  

     # To access GKE  
     kubectl config use-context gke  
```  
When you execute apply you are launching on K8s  

- JupyterHub for launching and managing Jupyter notebooks on K8s
- A [TF CRD](https://github.com/tensorflow/k8s)



Let's suppose you want to submit a training job. Kubeflow provides ksonnet [prototypes](https://ksonnet.io/docs/concepts#prototype) that make it easy to define [components](https://ksonnet.io/docs/concepts#component). The tf-job prototype makes it easy to create a job for your code but for this example, we'll use the tf-cnn prototype which runs [TensorFlow's CNN benchmark](https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks).  

To submit a training job, you first generate a new job from a prototype:  
```  
     ks generate tf-cnn cnn --name=cnn  
```  
By default the tf-cnn prototype uses 1 worker and no GPUs which is perfect for our minikube cluster so we can just submit it.  
```  
     ks apply minikube -c cnn
```


On GKE, we’ll want to tweak the prototype to take advantage of the multiple nodes and GPUs. First, let’s list all the parameters available:  

```  
     # To see a list of parameters  
     ks prototype list tf-job  
```  

Now let’s adjust the parameters to take advantage of GPUs and access to multiple nodes.  

```  
     ks param set --env=gke cnn num\_gpus 1  
     ks param set --env=gke cnn num\_workers 1  

     ks apply gke -c cnn  
```  

Note how we set those parameters so they are used only when you deploy to GKE. Your minikube parameters are unchanged!


After training, you [export your model](https://www.tensorflow.org/serving/serving_basic) to a serving location.  

Kubeflow also includes a serving package as well.  

To deploy a the trained model for serving, execute the following:  

```  
     ks generate tf-serving inception --name=inception  
     ---namespace=default --model\_path=gs://$bucket_name/$model_loc
     ks apply gke -c inception  
```  

This highlights one more option in Kubeflow - the ability to pass in inputs based on your deployment. This command creates a tf-serving service on the GKE cluster, and makes it available to your application.  

For more information about of deploying and monitoring TensorFlow training jobs and TensorFlow models please refer to the [user guide](https://github.com/google/kubeflow/blob/master/user_guide.md).



## Kubeflow + ksonnet
One choice we want to call out is the use of the ksonnet project. We think working with multiple environments (dev, test, prod) will be the norm for most Kubeflow users. By making environments a first class concept, ksonnet makes it easy for Kubeflow users to easily move their workloads between their different environments.  

Particularly now that [Helm is integrating ksonnet](https://blog.heptio.com/ksonnet-intro-43f6183a97a6) with the next version of their platform, we felt like it was the perfect choice for us. More information about ksonnet can be found in the ksonnet [docs](https://ksonnet.io/).  

We also want to thank the team at [Heptio](https://heptio.com/) for expediting features critical to Kubeflow's use of ksonnet.



## What’s Next?
We are in the midst of building out a community effort right now, and we would love your help! We’ve already been collaborating with many teams - [CaiCloud](https://caicloud.io/article_detail/5a3b58fce928ca1c69e1aa70), [Red Hat & OpenShift](https://blog.openshift.com/machine-learning-openshift-kubernetes/), [Canonical](https://tutorials.ubuntu.com/tutorial/get-started-kubeflow), [Weaveworks](https://www.weave.works/blog/kubeflow-and-weave-cloud), [Container Solutions](http://container-solutions.com/tensorflow-on-kubernetes-kubeflow/) and many others. [CoreOS](https://coreos.com/), for example, is already seeing the promise of Kubeflow:  


“The Kubeflow project was a needed advancement to make it significantly easier to set up and productionize machine learning workloads on Kubernetes, and we anticipate that it will greatly expand the opportunity for even more enterprises to embrace the platform. We look forward to working with the project members in providing tight integration of Kubeflow with Tectonic, the enterprise Kubernetes platform.” -- Reza Shafii, VP of product, CoreOS

If you’d like to try out Kubeflow right now right in your browser, we’ve partnered with [Katacoda](https://www.katacoda.com/) to make it super easy. You can try it [here](https://www.katacoda.com/kubeflow)!  

And we’re just getting started! We would love for you to help. How you might ask? Well…  

- Please join the[slack channel](https://join.slack.com/t/kubeflow/shared_invite/enQtMjgyMzMxNDgyMTQ5LWUwMTIxNmZlZTk2NGU0MmFiNDE4YWJiMzFiOGNkZGZjZmRlNTExNmUwMmQ2NzMwYzk5YzQxOWQyODBlZGY2OTg)
- Please join the[kubeflow-discuss](https://groups.google.com/forum/#!forum/kubeflow-discuss) email list
- Please subscribe to the[Kubeflow twitter](http://twitter.com/kubeflow) account
- Please download and run kubeflow, and submit bugs!
Thank you for your support so far, we could not be more excited!  


Note:
* This article was amended in June 2023 to update the trained model bucket location.
