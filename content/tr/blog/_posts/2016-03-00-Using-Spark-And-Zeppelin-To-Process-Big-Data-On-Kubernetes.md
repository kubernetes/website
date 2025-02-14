---
title: " Using Spark and Zeppelin to process big data on Kubernetes 1.2 "
date: 2016-03-30
slug: using-spark-and-zeppelin-to-process-big-data-on-kubernetes
url: /blog/2016/03/Using-Spark-And-Zeppelin-To-Process-Big-Data-On-Kubernetes
author: >
  Zach Loafman (Google)
---
_**Editor's note:** this is the fifth post in a [series of in-depth posts](/blog/2016/03/five-days-of-kubernetes-12) on what's new in Kubernetes 1.2_  

With big data usage growing exponentially, many Kubernetes customers have expressed interest in running [Apache Spark](http://spark.apache.org/) on their Kubernetes clusters to take advantage of the portability and flexibility of containers. Fortunately, with Kubernetes 1.2, you can now have a platform that runs Spark and Zeppelin, and your other applications side-by-side.  


### Why Zeppelin?&nbsp;
[Apache Zeppelin](https://zeppelin.incubator.apache.org/) is a web-based notebook that enables interactive data analytics. As one of its backends, Zeppelin connects to Spark. Zeppelin allows the user to interact with the Spark cluster in a simple way, without having to deal with a command-line interpreter or a Scala compiler.  


### Why Kubernetes?&nbsp;
There are many ways to run Spark outside of Kubernetes:  


- You can run it using dedicated resources, in Standalone mode&nbsp;
- You can run it on a [YARN](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) cluster, co-resident with Hadoop and HDFS&nbsp;
- You can run it on a [Mesos](http://mesos.apache.org/) cluster alongside other Mesos applications&nbsp;



So why would you run Spark on Kubernetes?  


- A single, unified interface to your cluster: Kubernetes can manage a broad range of workloads; no need to deal with YARN/HDFS for data processing and a separate container orchestrator for your other applications.&nbsp;
- Increased server utilization: share nodes between Spark and cloud-native applications. For example, you may have a streaming application running to feed a streaming Spark pipeline, or a nginx pod to serve web traffic — no need to statically partition nodes.&nbsp;
- Isolation between workloads: Kubernetes' [Quality of Service](https://github.com/kubernetes/kubernetes/blob/release-1.2/docs/proposals/resource-qos.md) mechanism allows you to safely co-schedule batch workloads like Spark on the same nodes as latency-sensitive servers.&nbsp;



### Launch Spark&nbsp;
For this demo, we’ll be using [Google Container Engine](https://cloud.google.com/container-engine/) (GKE), but this should work anywhere you have installed a Kubernetes cluster. First, create a Container Engine cluster with storage-full scopes. These Google Cloud Platform scopes will allow the cluster to write to a private Google Cloud Storage Bucket (we’ll get to why you need that later):&nbsp;  

```
$ gcloud container clusters create spark --scopes storage-full
--machine-type n1-standard-4
```
_Note_: We’re using n1-standard-4 (which are larger than the default node size) to demonstrate some features of Horizontal Pod Autoscaling. However, Spark works just fine on the default node size of n1-standard-1.  

After the cluster’s created, you’re ready to launch Spark on Kubernetes using the config files in the Kubernetes GitHub repo:  

```
$ git clone https://github.com/kubernetes/kubernetes.git
$ kubectl create -f kubernetes/examples/spark
```
`‘kubernetes/examples/spark’` is a directory, so this command tells kubectl to create all of the Kubernetes objects defined in all of the YAML files in that directory. You don’t have to clone the entire repository, but it makes the steps of this demo just a little easier.  

The pods (especially Apache Zeppelin) are somewhat large, so may take some time for Docker to pull the images. Once everything is running, you should see something similar to the following:  

```
$ kubectl get pods
NAME READY STATUS RESTARTS AGE
spark-master-controller-v4v4y 1/1 Running 0 21h
spark-worker-controller-7phix 1/1 Running 0 21h
spark-worker-controller-hq9l9 1/1 Running 0 21h
spark-worker-controller-vwei5 1/1 Running 0 21h
zeppelin-controller-t1njl 1/1 Running 0 21h
```
You can see that Kubernetes is running one instance of Zeppelin, one Spark master and three Spark workers.  


### Set up the Secure Proxy to Zeppelin&nbsp;
Next you’ll set up a secure proxy from your local machine to Zeppelin, so you can access the Zeppelin instance running in the cluster from your machine. (Note: You’ll need to change this command to the actual Zeppelin pod that was created on your cluster.)  

```
$ kubectl port-forward zeppelin-controller-t1njl 8080:8080
```
This establishes a secure link to the Kubernetes cluster and pod (`zeppelin-controller-t1njl`) and then forwards the port in question (8080) to local port 8080, which will allow you to use Zeppelin safely.  


### Now that I have Zeppelin up and running, what do I do with it?&nbsp;
For our example, we’re going to show you how to build a simple movie recommendation model. This is based on the code [on the Spark website](http://spark.apache.org/docs/1.5.2/mllib-collaborative-filtering.html), modified slightly to make it interesting for Kubernetes.&nbsp;  

Now that the secure proxy is up, visit [http://localhost:8080/](http://localhost:8080/). You should see an intro page like this:  


[![](https://1.bp.blogspot.com/-rk6iWAauxGM/VvwPoE25QFI/AAAAAAAAA6c/NOBZzIWfTYEqJin-tWY1zrePPOqr3TZWQ/s640/Spark2.png)](https://1.bp.blogspot.com/-rk6iWAauxGM/VvwPoE25QFI/AAAAAAAAA6c/NOBZzIWfTYEqJin-tWY1zrePPOqr3TZWQ/s1600/Spark2.png)


Click “Import note,” give it an arbitrary name (e.g. “Movies”), and click “Add from URL.” For a URL, enter:  

```
https://gist.githubusercontent.com/zmerlynn/875fed0f587d12b08ec9/raw/6
eac83e99caf712482a4937800b17bbd2e7b33c4/movies.json
```
Then click “Import Note.” This will give you a ready-made Zeppelin note for this demo. You should now have a “Movies” notebook (or whatever you named it). If you click that note, you should see a screen similar to this:  


[![](https://2.bp.blogspot.com/-qyjtrUpXisg/VvwPvSPnWNI/AAAAAAAAA6g/Son7C2yWolk28KLSy63acGPnuFGjJEoeg/s640/Spark1.png)](https://2.bp.blogspot.com/-qyjtrUpXisg/VvwPvSPnWNI/AAAAAAAAA6g/Son7C2yWolk28KLSy63acGPnuFGjJEoeg/s1600/Spark1.png)

You can now click the Play button, near the top-right of the PySpark code block, and you’ll create a new, in-memory movie recommendation model! In the Spark application model, Zeppelin acts as a [Spark Driver Program](https://spark.apache.org/docs/1.5.2/cluster-overview.html), interacting with the Spark cluster master to get its work done. In this case, the driver program that’s running in the Zeppelin pod fetches the data and sends it to the Spark master, which farms it out to the workers, which crunch out a movie recommendation model using the code from the driver. With a larger data set in Google Cloud Storage (GCS), it would be easy to pull the data from GCS as well. In the next section, we’ll talk about how to save your data to GCS.  


### Working with Google Cloud Storage (Optional)&nbsp;
For this demo, we’ll be using Google Cloud Storage, which will let us store our model data beyond the life of a single pod. Spark for Kubernetes is built with the [Google Cloud Storage](https://cloud.google.com/storage/) connector built-in. As long as you can access your data from a virtual machine in the Google Container Engine project where your Kubernetes nodes are running, you can access your data with the GCS connector on the Spark image.  

If you want, you can change the variables at the top of the note so that the example will actually save and restore a model for the movie recommendation engine — just point those variables at a GCS bucket that you have access to. If you want to create a GCS bucket, you can do something like this on the command line:  

```
$ gsutil mb gs://my-spark-models
```
You’ll need to change this URI to something that is unique for you. This will create a bucket that you can use in the example above.  

{{< note >}}
Computing the model and saving it is much slower than computing the model and throwing it away. This is expected. However, if you plan to reuse a model, it’s faster to compute the model and save it and then restore it each time you want to use it, rather than throw away and recompute the model each time.
{{< /note >}}

### Using Horizontal Pod Autoscaling with Spark (Optional)&nbsp;
Spark is somewhat elastic to workers coming and going, which means we have an opportunity: we can use use [Kubernetes Horizontal Pod Autoscaling](/docs/user-guide/horizontal-pod-autoscaling/) to scale-out the Spark worker pool automatically, setting a target CPU threshold for the workers and a minimum/maximum pool size. This obviates the need for having to configure the number of worker replicas manually.  

Create the Autoscaler like this (note: if you didn’t change the machine type for the cluster, you probably want to limit the --max to something smaller):&nbsp;  

```
$ kubectl autoscale --min=1 --cpu-percent=80 --max=10 \
  rc/spark-worker-controller
```
To see the full effect of autoscaling, wait for the replication controller to settle back to one replica. Use `‘kubectl get rc’` and wait for the “replicas” column on spark-worker-controller to fall back to 1.  

The workload we ran before ran too quickly to be terribly interesting for HPA. To change the workload to actually run long enough to see autoscaling become active, change the “rank = 100” line in the code to “rank = 200.” After you hit play, the Spark worker pool should rapidly increase to 20 pods. It will take up to 5 minutes after the job completes before the worker pool falls back down to one replica.  


### Conclusion
In this article, we showed you how to run Spark and Zeppelin on Kubernetes, as well as how to use Google Cloud Storage to store your Spark model and how to use Horizontal Pod Autoscaling to dynamically size your Spark worker pool.  

This is the first in a series of articles we’ll be publishing on how to run big data frameworks on Kubernetes — so stay tuned!  

Please join our community and help us build the future of Kubernetes! There are many ways to participate. If you’re particularly interested in Kubernetes and big data, you’ll be interested in:  

- Our [Big Data slack channel](https://kubernetes.slack.com/messages/sig-big-data/)
- Our [Kubernetes Big Data Special Interest Group email list](https://groups.google.com/forum/#!forum/kubernetes-sig-big-data)
- The Big Data “Special Interest Group,” which meets every Monday at 1pm (13h00) Pacific Time at [SIG-Big-Data hangout&nbsp;](https://plus.google.com/hangouts/_/google.com/big-data)
And of course for more information about the project in general, go to [www.kubernetes.io](http://www.kubernetes.io/).
