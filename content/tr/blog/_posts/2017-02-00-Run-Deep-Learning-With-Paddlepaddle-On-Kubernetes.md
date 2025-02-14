---
title: " Run Deep Learning with PaddlePaddle on Kubernetes "
date: 2017-02-08
slug: run-deep-learning-with-paddlepaddle-on-kubernetes
url: /blog/2017/02/Run-Deep-Learning-With-Paddlepaddle-On-Kubernetes
author: >
  Yi Wang ([Baidu Research](http://research.baidu.com/)),
  Xiang Li ([CoreOS](https://coreos.com/))
---

**[![](https://3.bp.blogspot.com/-Mwn3FU9hffI/WJk8QBxA6SI/AAAAAAAAA8w/AS5QoMdPTN8bL9jnixlsCXzj1IfYerhRQCLcB/s200/baidu_research_logo_rgb.png)](https://3.bp.blogspot.com/-Mwn3FU9hffI/WJk8QBxA6SI/AAAAAAAAA8w/AS5QoMdPTN8bL9jnixlsCXzj1IfYerhRQCLcB/s1600/baidu_research_logo_rgb.png)**




**What is PaddlePaddle**  

PaddlePaddle is an easy-to-use, efficient, flexible and scalable deep learning platform originally developed at Baidu for applying deep learning to Baidu products since 2014.   

There have been more than 50 innovations created using PaddlePaddle supporting 15 Baidu products ranging from the search engine, online advertising, to Q&A and system security.   

In September 2016, Baidu open sourced [PaddlePaddle](https://github.com/PaddlePaddle/Paddle), and it soon attracted many contributors from outside of Baidu.  

**Why Run PaddlePaddle on Kubernetes**  

PaddlePaddle is designed to be slim and independent of computing infrastructure. Users can run it on top of Hadoop, Spark, Mesos, Kubernetes and others.. We have a strong interest with Kubernetes because of its flexibility, efficiency and rich features.  

While we are applying PaddlePaddle in various Baidu products, we noticed two main kinds of PaddlePaddle usage -- research and product. Research data does not change often, and the focus is fast experiments to reach the expected scientific measurement. Products data changes often. It usually comes from log messages generated from the Web services.  

A successful deep learning project includes both the research and the data processing pipeline. There are many parameters to be tuned. A lot of engineers work on the different parts of the project simultaneously.  

To ensure the project is easy to manage and utilize hardware resource efficiently, we want to run all parts of the project on the same infrastructure platform.  

The platform should provide:  


- fault-tolerance. It should abstract each stage of the pipeline as a service, which consists of many processes that provide high throughput and robustness through redundancy.

- auto-scaling. In the daytime, there are usually many active users, the platform should scale out online services. While during nights, the platform should free some resources for deep learning experiments.

- job packing and isolation. It should be able to assign a PaddlePaddle trainer process requiring the GPU, a web backend service requiring large memory, and a CephFS process requiring disk IOs to the same node to fully utilize its hardware.

What we want is a platform which runs the deep learning system, the Web server (e.g., Nginx), the log collector (e.g., fluentd), the distributed queue service (e.g., Kafka), the log joiner and other data processors written using Storm, Spark, and Hadoop MapReduce on the same cluster. We want to run all jobs -- online and offline, production and experiments -- on the same cluster, so we could make full utilization of the cluster, as different kinds of jobs require different hardware resource.   

We chose container based solutions since the overhead introduced by VMs is contradictory to our goal of efficiency and utilization.   

Based on our research of different container based solutions, Kubernetes fits our requirement the best.  

**Distributed Training on Kubernetes**  

PaddlePaddle supports distributed training natively. There are two roles in a PaddlePaddle cluster: **parameter server** and **trainer**. Each parameter server process maintains a shard of the global model. Each trainer has its local copy of the model, and uses its local data to update the model. During the training process, trainers send model updates to parameter servers, parameter servers are responsible for aggregating these updates, so that trainers can synchronize their local copy with the global model.  



| ![](https://lh5.googleusercontent.com/e7udXH-Vv2SZ7YSo3YLtQEQI6VvWfPJMsYAkdad5ZJJ9mYBJ-Du3soR1pgwD80tD9ZMrUliuQU1UhnposxFsCJaKI4grRlFSTJFS0xi9HQXHsU-5-qkghOn0IRYy6cy-YzuHF6Eq) |
| Figure 1: Model is partitioned into two shards. Managed by two parameter servers respectively.  |



Some other approaches use a set of parameter servers to collectively hold a very large model in the CPU memory space on multiple hosts. But in practice, it is not often that we have such big models, because it would be very inefficient to handle very large model due to the limitation of GPU memory. In our configuration, multiple parameter servers are mostly for fast communications. Suppose there is only one parameter server process working with all trainers, the parameter server would have to aggregate gradients from all trainers and becomes a bottleneck. In our experience, an experimentally efficient configuration includes the same number of trainers and parameter servers. And we usually run a pair of trainer and parameter server on the same node. In the following Kubernetes job configuration, we start a job that runs N Pods, and in each Pod there are a parameter server and a trainer process.  



```
yaml

apiVersion: batch/v1

kind: Job

metadata:

  name: PaddlePaddle-cluster-job

spec:

  parallelism: 3

  completions: 3

  template:

    metadata:

      name: PaddlePaddle-cluster-job

    spec:

      volumes:

      - name: jobpath

        hostPath:

          path: /home/admin/efs

      containers:

      - name: trainer

        image: your\_repo/paddle:mypaddle

        command: ["bin/bash",  "-c", "/root/start.sh"]

        env:

        - name: JOB\_NAME

          value: paddle-cluster-job

        - name: JOB\_PATH

          value: /home/jobpath

        - name: JOB\_NAMESPACE

          value: default

        volumeMounts:

        - name: jobpath

          mountPath: /home/jobpath

      restartPolicy: Never
 ```


We can see from the config that parallelism, completions are both set to 3. So this job will simultaneously start up 3 PaddlePaddle pods, and this job will be finished when all 3 pods finishes.  


| [![](https://lh5.googleusercontent.com/cKVFdtLUnX7mtE76xRCAFaylVilAX6E0mBy17XTKOJwJQy6_rqF33v5lgeUjIpfN-2pT00OpD13mByawgOrjHpwGwJ8y99Vgoqridu1GklIkMnKysOE8jIUwvwfSySUgUDGkTkpz)](https://github.com/PaddlePaddle/Paddle/blob/develop/doc/howto/usage/k8s/src/start_paddle.py) |
|   

Figure 2: Job A of three pods and Job B of one pod running on two nodes.
 |


The entrypoint of each pod is [start.sh](https://github.com/PaddlePaddle/Paddle/blob/develop/doc/howto/usage/k8s/src/k8s_train/start.sh). It downloads data from a storage service, so that trainers can read quickly from the pod-local disk space. After downloading completes, it runs a Python script, [start\_paddle.py](https://github.com/PaddlePaddle/Paddle/blob/develop/doc/howto/usage/k8s/src/k8s_train/start_paddle.py), which starts a parameter server, waits until parameter servers of all pods are ready to serve, and then starts the trainer process in the pod.  

This waiting is necessary because each trainer needs to talk to all parameter servers, as shown in Figure. 1. Kubernetes [API](/docs/api-reference/v1/operations/#_list_or_watch_objects_of_kind_pod) enables trainers to check the status of pods, so the Python script could wait until all parameter servers’ status change to "running" before it triggers the training process.  

Currently, the mapping from data shards to pods/trainers is static. If we are going to run N trainers, we would need to partition the data into N shards, and statically assign each shard to a trainer. Again we rely on the Kubernetes API to enlist pods in a job so could we index pods / trainers from 1 to N. The i-th trainer would read the i-th data shard.  

Training data is usually served on a distributed filesystem. In practice we use CephFS on our on-premise clusters and Amazon Elastic File System on AWS. If you are interested in building a Kubernetes cluster to run distributed PaddlePaddle training jobs, please follow [this tutorial](https://github.com/PaddlePaddle/Paddle/blob/develop/doc/howto/usage/k8s/k8s_aws_en.md).  

**What’s Next**  

We are working on running PaddlePaddle with Kubernetes more smoothly.  

As you might notice the current trainer scheduling fully relies on Kubernetes based on a static partition map. This approach is simple to start, but might cause a few efficiency problems.  

First, slow or dead trainers block the entire job. There is no controlled preemption or rescheduling after the initial deployment. Second, the resource allocation is static. So if Kubernetes has more available resources than we anticipated, we have to manually change the resource requirements. This is tedious work, and is not aligned with our efficiency and utilization goal.  

To solve the problems mentioned above, we will add a PaddlePaddle master that understands Kubernetes API, can dynamically add/remove resource capacity, and dispatches shards to trainers in a more dynamic manner. The PaddlePaddle master uses etcd as a fault-tolerant storage of the dynamic mapping from shards to trainers. Thus, even if the master crashes, the mapping is not lost. Kubernetes can restart the master and the job will keep running.   

Another potential improvement is better PaddlePaddle job configuration. Our experience of having the same number of trainers and parameter servers was mostly collected from using special-purpose clusters. That strategy was observed performant on our clients' clusters that run only PaddlePaddle jobs. However, this strategy might not be optimal on general-purpose clusters that run many kinds of jobs.  

PaddlePaddle trainers can utilize multiple GPUs to accelerate computations. GPU is not a first class resource in Kubernetes yet. We have to manage GPUs semi-manually. We would love to work with Kubernetes community to improve GPU support to ensure PaddlePaddle runs the best on Kubernetes.   


- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
