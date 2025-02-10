---
title: " Scaling neural network image classification using Kubernetes with TensorFlow Serving  "
date: 2016-03-23
slug: scaling-neural-network-image-classification-using-kubernetes-with-tensorflow-serving
url: /blog/2016/03/Scaling-Neural-Network-Image-Classification-Using-Kubernetes-With-Tensorflow-Serving
author: >
  Fangwei Li (Google)
---
In 2011, Google developed an internal deep learning infrastructure called [DistBelief](http://research.google.com/pubs/pub40565.html), which allowed Googlers to build ever larger [neural networks](https://en.wikipedia.org/wiki/Artificial_neural_network) and scale training to thousands of cores. Late last year, Google [introduced TensorFlow](http://googleresearch.blogspot.com/2015/11/tensorflow-googles-latest-machine_9.html), its second-generation machine learning system. TensorFlow is general, flexible, portable, easy-to-use and, most importantly, developed with the open source community.

[![](https://4.bp.blogspot.com/-PDRpnk823Ps/VvHJH3vIyKI/AAAAAAAAA4g/adIWZPfa2W4ObtIaWNbhpl8UyIwk9R7xg/s320/tensorflowserving-4.png)](https://4.bp.blogspot.com/-PDRpnk823Ps/VvHJH3vIyKI/AAAAAAAAA4g/adIWZPfa2W4ObtIaWNbhpl8UyIwk9R7xg/s1600/tensorflowserving-4.png)

The process of introducing machine learning into your product involves creating and training a model on your dataset, and then pushing the model to production to serve requests. In this blog post, we’ll show you how you can use [Kubernetes](http://kubernetes.io/) with [TensorFlow Serving](http://googleresearch.blogspot.com/2016/02/running-your-models-in-production-with.html), a high performance, open source serving system for machine learning models, to meet the scaling demands of your application.  

Let’s use image classification as an [example](https://tensorflow.github.io/serving/serving_inception). Suppose your application needs to be able to correctly identify an image across a set of categories. For example, given the cute puppy image below, your system should classify it as a retriever.  

| [![](https://3.bp.blogspot.com/-rUuOetJfoLc/VvHJHgDYusI/AAAAAAAAA4c/qO9xhVk4iH8EhrSqt3eZbqNGVQXH5fmCg/s320/tensorflowserving-2.png)](https://3.bp.blogspot.com/-rUuOetJfoLc/VvHJHgDYusI/AAAAAAAAA4c/qO9xhVk4iH8EhrSqt3eZbqNGVQXH5fmCg/s1600/tensorflowserving-2.png) |
| Image via [Wikipedia](https://commons.wikimedia.org/wiki/File:Golde33443.jpg) |

You can implement image classification with TensorFlow using the [Inception-v3 model](http://googleresearch.blogspot.com/2016/03/train-your-own-image-classifier-with.html) trained on the data from the [ImageNet dataset](http://www.image-net.org/). This dataset contains images and their labels, which allows the TensorFlow learner to train a model that can be used for by your application in production.  

[![](https://4.bp.blogspot.com/-oaJYNPqiqIc/VvHJH2Z19cI/AAAAAAAAA4k/xq8m0kqRIOUewTZLDvzjPh6YLHG4MxdSQ/s640/tensorflowserving-1.png)](https://4.bp.blogspot.com/-oaJYNPqiqIc/VvHJH2Z19cI/AAAAAAAAA4k/xq8m0kqRIOUewTZLDvzjPh6YLHG4MxdSQ/s1600/tensorflowserving-1.png)
Once the model is trained and [exported](https://github.com/tensorflow/serving/blob/master/tensorflow_serving/session_bundle/exporter.py), [TensorFlow Serving](https://tensorflow.github.io/serving/) uses the model to perform inference&nbsp;—&nbsp;predictions based on new data presented by its clients. In our example, clients submit image classification requests over [gRPC](http://www.grpc.io/), a high performance, open source RPC framework from Google.  

[![](https://4.bp.blogspot.com/-g2S3V47h7BY/VvHJIkBlTiI/AAAAAAAAA4o/wISpFzB6kvIZxJHlnmM7-XYzZYl1YFfDA/s320/tensorflowserving-5.png)](https://4.bp.blogspot.com/-g2S3V47h7BY/VvHJIkBlTiI/AAAAAAAAA4o/wISpFzB6kvIZxJHlnmM7-XYzZYl1YFfDA/s1600/tensorflowserving-5.png)

Inference can be very resource intensive. Our server executes the following TensorFlow graph to process every classification request it receives. The Inception-v3 model has over 27 million parameters and runs 5.7 billion floating point operations per inference.  

| [![](https://2.bp.blogspot.com/-Gcb6gxzqDkE/VvHJHE7yD3I/AAAAAAAAA4Y/4EZD83OV_8goqodV2pcaQKYeinokf9UuA/s640/tensorflowserving-3.png)](https://2.bp.blogspot.com/-Gcb6gxzqDkE/VvHJHE7yD3I/AAAAAAAAA4Y/4EZD83OV_8goqodV2pcaQKYeinokf9UuA/s1600/tensorflowserving-3.png) |
| Schematic diagram of Inception-v3 |

Fortunately, this is where Kubernetes can help us. Kubernetes distributes inference request processing across a cluster using its [External Load Balancer](/docs/user-guide/load-balancer/). Each [pod](/docs/user-guide/pods/) in the cluster contains a [TensorFlow Serving Docker image](https://tensorflow.github.io/serving/docker) with the TensorFlow Serving-based gRPC server and a trained Inception-v3 model. The model is represented as a [set of files](https://github.com/tensorflow/serving/blob/master/tensorflow_serving/session_bundle/README.md) describing the shape of the TensorFlow graph, model weights, assets, and so on. Since everything is neatly packaged together, we can dynamically scale the number of replicated pods using the [Kubernetes Replication Controller](/docs/user-guide/replication-controller/operations/) to keep up with the service demands.  

To help you try this out yourself, we’ve written a [step-by-step tutorial](https://tensorflow.github.io/serving/serving_inception), which shows you how to create the TensorFlow Serving Docker container to serve the Inception-v3 image classification model, configure a Kubernetes cluster and run classification requests against it. We hope this will make it easier for you to integrate machine learning into your own applications and scale it with Kubernetes! To learn more about TensorFlow Serving, check out [tensorflow.github.io/serving](http://tensorflow.github.io/serving).
