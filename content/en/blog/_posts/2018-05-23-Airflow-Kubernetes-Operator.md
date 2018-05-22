---
layout: blog
title:  The Kubernetes "Whatever-your-heart-desires" Operator
date:   Wednesday, May 23rd 2018
---

# The Kubernetes "Whatever-your-heart-desires" Operator

## Introduction

Today, we are excited to announce the Kubernetes Airflow Operator; a new mechanism for launching containers using the Kubernetes cloud deployment framework. 

Since its inception, Airflow's greatest strength has been its flexibility. Airflow offers a wide range of native operators for services ranging from Spark and HBase, to Google Cloud Platform (GCP) and Amazon Web Services (AWS) S3. Airflow also offers easy extensibility through its plug-in framework. However, one limitation of the project is that Airflow users are confined to the frameworks and clients that exist on the Airflow worker at the moment of execution. If a user wishes to use a different version of SciPy or test a new deep learning framework, they would need to either launch a new Airflow cluster or risk conflicting with the dependencies of other users' workflows. 

To address this issue, we've utilized Kubernetes to allow users to launch arbitrary Docker containers and configurations. Airflow users can now have full power over their run-time environments, resources, and secrets, basically turning Airflow into an "any job you want" scheduler.

## What Is Airflow?

Apache Airflow is one realization of the DevOps philosophy of "Code As Configuration." Airflow allows users to launch multi-step pipelines using a simple python object DAG (Directed Acyclic Graph). You can define dependencies, programmatically construct complex workflows, and monitor scheduled jobs in an easy to read UI.
 
  <img src="airflow_dags.png">

 <img src="airflow.png">
 
 Airflow comes with built-in operators for frameworks like Apache Spark, BigQuery, Hive, and EMR. It also offers a Plugins entrypoint that allows DevOps engineers to develop their own connectors.
 
## What is Kubernetes?

Before we go any further, let's take a moment for a quick overview of Kubernetes. [Kubernetes](https://kubernetes.io/) is an open-source container deployment engine released by Google and open sourced under the Apache 2.0 licence. Based on Google's [Borg](http://blog.kubernetes.io/2015/04/borg-predecessor-to-kubernetes.html), Kubernetes allows for easy deployment of images using a highly flexible API. Using Kubernetes, you can [deploy Spark jobs](https://github.com/apache-spark-on-k8s/spark), launch end-to-end applications, or create multi-framework ETL pipelines using YAML, JSON, Python, Golang, or Java bindings. The Kubernetes API's programatic launching of containers seemed a perfect marriage with Airflow's "code as configuration" philosophy.


## The Kubernetes Operator

As DevOps pioneers, Airflow users are always looking for ways to make deployments and ETL pipelines simpler to manage. Any opportunity to decouple our pipeline steps, while increasing monitoring, can reduce future outages and fire-fights. The following is a list of benefits the Kubernetes Airflow Operator has in reducing an engineer's footprint
* **Increased flexibility for deployments:**  
Airflow's plugin API has always offered a significant boon to engineers wishing to test new functionalities within their DAGs. On the downside, whenever a developer wanted to create a new operator, they had to develop an entirely new plugin. Now, any task that can be run within a Docker container is accessible through the exact same operator, with no extra Airflow code to maintain.

* **Flexibility of configurations and dependencies:** 
For operators that are run within static Airflow workers, dependency management can become quite difficult. If a developer wants to run one task that requires [SciPy](https://www.scipy.org) and another that requires [NumPy](http://www.numpy.org), the developer would have to either maintain both dependencies within all Airflow workers or offload the task to an external machine (which can cause bugs if that external machine changes in an untracked manner). Custom docker images allow users to ensure that the tasks environment, configuration, and dependencies are completely idempotent.  
* **Usage of kubernetes secrets for added security:** 
Handling sensitive data is a core responsibility of any DevOps engineer. At every opportunity, Airflow users want to isolate any API keys, database passwords, and login credentials on a strict need-to-know basis. With the Kubernetes operator, users can utilize the Kubernetes Vault technology to store all sensitive data. This means that the Airflow workers will never have access to this information, and can simply request that pods be built with only the secrets they need.


# Architecture

<img src="architecture.png">

The Kubernetes Operator uses the [Kubernetes Python Client](https://github.com/kubernetes-client/python) to generate a request that is processed by the APIServer (1). Kubernetes will then launch your pod with whatever specs you've defined (2). Images will be loaded with all the necessary environment variables, secrets and dependencies, enacting a single command. Once the job is launched, the operator only needs to monitor the health of track logs (3). Users will have the choice of gathering logs locally to the scheduler or to any distributed logging service currently in their Kubernetes cluster.

# Using the Kubernetes Operator

## A Basic Example

The following DAG is probably the simplest example we could write to show how the Kubernetes Operator works. This DAG creates two pods on Kubernetes: a Linux distro with Python and a base Ubuntu distro without it. The Python pod will run the Python request correctly, while the one without Python will report a failure to the user. If the Operator is working correctly, the `passing-task` pod should complete, while the `failing-task` pod returns a failure to the Airflow webserver.



```python
from airflow import DAG
from datetime import datetime, timedelta
from airflow.contrib.operators.kubernetes_pod_operator import KubernetesPodOperator
from airflow.operators.dummy_operator import DummyOperator


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime.utcnow(),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'kubernetes_sample', default_args=default_args, schedule_interval=timedelta(minutes=10))


start = DummyOperator(task_id='run_this_first', dag=dag)

passing = KubernetesPodOperator(namespace='default',
                          image="python:3.6",
                          cmds=["python","-c"],
                          arguments=["print('hello world')"],
                          labels={"foo": "bar"},
                          name="passing-test",
                          task_id="passing-task",
                          get_logs=True,
                          dag=dag
                          )

failing = KubernetesPodOperator(namespace='default',
                          image="ubuntu:1604",
                          cmds=["python","-c"],
                          arguments=["print('hello world')"],
                          labels={"foo": "bar"},
                          name="fail",
                          task_id="failing-task",
                          get_logs=True,
                          dag=dag
                          )

passing.set_upstream(start)
failing.set_upstream(start)
```

<img src="image.png">

## But how does this relate to my workflow?

While this example only uses basic images, the magic of Docker is that this same DAG will work for any image/command pairing you want. The following is a recommended CI/CD pipeline to run production-ready code on an Airflow DAG.

### 1: PR in github
Use Travis or Jenkins to run unit and integration tests, bribe your favorite team-mate into PR'ing your code, and merge to the master branch to trigger an automated CI build.

### 2: CI/CD via Jenkins -> Docker Image

There are a multitude on articles on [generating Docker files within a Jenkins build](https://getintodevops.com/blog/building-your-first-docker-image-with-jenkins-2-guide-for-developers). It's a good rule of thumb that you should never use a user-generated Docker image in a production build. By reserving release tags to the Jenkins user, you can ensure that malicious or untested code will never be run by your production Airflow instances.

### 3: Airflow launches task 

Finally, update your DAGs to reflect the new release version and you should be ready to go!

```python
production_task = KubernetesPodOperator(namespace='default',
                          # image="my-production-job:release-1.0.1", <-- old release
                          image="my-production-job:release-1.0.2",
                          cmds=["python","-c"],
                          arguments=["print('hello world')"],
                          name="fail",
                          task_id="failing-task",
                          get_logs=True,
                          dag=dag
                          )
```
                          
                          
# So when will I be able to use this?

The Kubernetes Operator and Kubernetes Executor (article to come) have both been merged into the [1.10 release branch of Airflow](https://github.com/apache/incubator-airflow/tree/v1-10-test) (the executor in experimental mode). While this branch is still in the early stages, we hope to see it released for wide release in the next few months.
