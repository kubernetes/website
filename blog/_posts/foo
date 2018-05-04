---
layout: blog
title: 'Announcing Kubeflow 0.1'
date: Friday, May 4, 2018
author: aronchick
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
* A **TensorFlow Training Controller **with native distributed training
* A **TensorFlow Serving **for hosting
* **Argo **for workflows
* **SeldonCore **for complex inference and non TF models
* **Ambassador **for Reverse Proxy 
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

It’s difficult to overstate how much the community has helped bring all these projects (and more) to fruition. Just a few of the contributing companies include: Alibaba Cloud, Ant Financial, Caicloud, Canonical, Cisco, Datawire, Dell, Github, Google, Heptio, Huawei, Intel, Microsoft, Momenta, One Convergence, Pachyderm, Project Jupyter, Red Hat, Seldon, Uber and Weaveworks.

# Learning More

If you’d like to try out Kubeflow, we have a number of options for you:

1. You can use sample walkthroughs hosted on [Katacoda](https://www.katacoda.com/kubeflow)
2. You can follow a guided tutorial with existing models from the [examples repository](https://github.com/kubeflow/examples). These include the [Github Issue Summarization](https://github.com/kubeflow/examples/tree/master/github_issue_summarization), [MNIST](https://github.com/kubeflow/examples/tree/master/mnist) and [Reinforcement Learning with Agents](https://github.com/kubeflow/examples/tree/master/agents).
3. You can start a cluster on your own and try your own model. Any Kubernetes conformant cluster will support Kubeflow  including those from contributors [Caicloud](https://www.prnewswire.com/news-releases/caicloud-releases-its-kubernetes-based-cluster-as-a-service-product-claas-20-and-the-first-tensorflow-as-a-service-taas-11-while-closing-6m-series-a-funding-300418071.html), [Canonical](https://jujucharms.com/canonical-kubernetes/), [Google](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-container-cluster), [Heptio](https://heptio.com/products/kubernetes-subscription/), [Mesosphere](https://github.com/mesosphere/dcos-kubernetes-quickstart), [Microsoft](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough), [IBM](https://console.bluemix.net/docs/containers/cs_tutorials.html#cs_cluster_tutorial), [Red Hat/Openshift ](https://docs.openshift.com/container-platform/3.3/install_config/install/quick_install.html#install-config-install-quick-install)and [Weaveworks](https://www.weave.works/product/cloud/).

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



Ever since we added the [Kubernetes Continuous Deploy](https://aka.ms/azjenkinsk8s) and [Azure Container Service](https://aka.ms/azjenkinsacs) plugins to the Jenkins update center, "How do I create zero-downtime deployments" is one of our most frequently-asked questions. We created a quickstart template on Azure to demonstrate what zero-downtime deployments can look like. Although our example uses Azure, the concept easily applies to all Kubernetes installations.

## Rolling Update

Kubernetes supports the RollingUpdate strategy to replace old pods with new ones gradually, while continuing to serve clients without incurring downtime. To perform a RollingUpdate deployment:
* Set `.spec.strategy.type` to `RollingUpdate` (the default value).
* Set `.spec.strategy.rollingUpdate.maxUnavailable` and `.spec.strategy.rollingUpdate.maxSurge` to some reasonable value.
  * `maxUnavailable`: the maximum number of pods that can be unavailable during the update process. This can be an absolute number or percentage of the replicas count; the default is 25%.
  * `maxSurge`: the maximum number of pods that can be created over the desired number of pods. Again this can be an absolute number or a percentage of the replicas count; the default is 25%.
* Configure the `readinessProbe` for your service container to help Kubernetes determine the state of the pods. Kubernetes will only route the client traffic to the pods with a healthy liveness probe.

We'll use deployment of the official Tomcat image to demonstrate this:

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: tomcat-deployment-rolling-update
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: tomcat
        role: rolling-update
    spec:
      containers:
      - name: tomcat-container
        image: tomcat:${TOMCAT_VERSION}
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /
            port: 8080
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 50%
```

If the Tomcat running in the current deployments is version 7, we can replace `${TOMCAT_VERSION}` with 8 and apply this to the Kubernetes cluster. With the [Kubernetes Continuous Deploy](https://aka.ms/azjenkinsk8s) or the [Azure Container Service](https://aka.ms/azjenkinsacs) plugin, the value can be fetched from an environment variable which eases the deployment process.

Behind the scenes, Kubernetes manages the update like so:

![Deployment Process](/images/blog/2018-04-30-zero-downtime-deployment-kubernetes-jenkins/deployment-process.png)

- Initially, all pods are running Tomcat 7 and the frontend Service routes the traffic to these pods.
- During the rolling update, Kubernetes takes down some Tomcat 7 pods and creates corresponding new Tomcat 8 pods. It ensures:
  - at most `maxUnavailable` pods in the desired Pods can be unavailable, that is, at least (`replicas` - `maxUnavailable`) pods should be serving the client traffic, which is 2-1=1 in our case.
  - at most maxSurge more pods can be created during the update process, that is 2*50%=1 in our case.
- One Tomcat 7 pod is taken down, and one Tomcat 8 pod is created. Kubernetes will not route the traffic to any of them because their readiness probe is not yet successful.
- When the new Tomcat 8 pod is ready as determined by the readiness probe, Kubernetes will start routing the traffic to it. This means during the update process, users may see both the old service and the new service.
- The rolling update continues by taking down Tomcat 7 pods and creating Tomcat 8 pods, and then routing the traffic to the ready pods.
- Finally, all pods are on Tomcat 8.

The Rolling Update strategy ensures we always have some Ready backend pods serving client requests, so there's no service downtime. However, some extra care is required:
- During the update, both the old pods and new pods may serve the requests. Without well defined session affinity in the Service layer, a user may be routed to the new pods and later back to the old pods.
- This also requires you to maintain well-defined forward and backward compatibility for both data and the API, which can be challenging.
- It may take a long time before a pod is ready for traffic after it is started. There may be a long window of time where the traffic is served with less backend pods than usual. Generally, this should not be a problem as we tend to do production upgrades when the service is less busy. But this will also extend the time window for issue 1.
- We cannot do comprehensive tests for the new pods being created. Moving application changes from dev / QA environments to production can represent a persistent risk of breaking existing functionality. The readiness probe can do some work to check readiness, however, it should be a lightweight task that can be run periodically, and not suitable to be used as an entry point to start the complete tests.

## Blue/green Deployment

_Blue/green deployment quoted from TechTarget_

> A blue/green deployment is a change management strategy for releasing software code. Blue/green deployments, which may also be referred to as A/B deployments require two identical hardware environments that are configured exactly the same way. While one environment is active and serving end users, the other environment remains idle.

Container technology offers a stand-alone environment to run the desired service, which makes it super easy to create identical environments as required in the blue/green deployment. The loosely coupled Services - ReplicaSets, and the label/selector-based service routing in Kubernetes make it easy to switch between different backend environments. With these techniques, the blue/green deployments in Kubernetes can be done as follows:

- Before the deployment, the infrastructure is prepared like so:
  - Prepare the blue deployment and green deployment with `TOMCAT_VERSION=7` and `TARGET_ROLE` set to blue or green respectively.

```  
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: tomcat-deployment-${TARGET_ROLE}
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: tomcat
        role: ${TARGET_ROLE}
    spec:
      containers:
      - name: tomcat-container
        image: tomcat:${TOMCAT_VERSION}
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /
            port: 8080
```

* Prepare the public service endpoint, which initially routes to one of the backend environments, say `TARGET_ROLE=blue`.

```
kind: Service
apiVersion: v1
metadata:
  name: tomcat-service
  labels:
    app: tomcat
    role: ${TARGET_ROLE}
    env: prod
spec:
  type: LoadBalancer
  selector:
    app: tomcat
    role: ${TARGET_ROLE}
  ports:
    - port: 80
      targetPort: 8080
```

* Optionally, prepare a test endpoint so that we can visit the backend environments for testing. They are similar to the public service endpoint, but they are intended to be accessed internally by the dev/ops team only.

```
kind: Service
apiVersion: v1
metadata:
  name: tomcat-test-${TARGET_ROLE}
  labels:
    app: tomcat
    role: test-${TARGET_ROLE}
spec:
  type: LoadBalancer
  selector:
    app: tomcat
    role: ${TARGET_ROLE}
  ports:
    - port: 80
      targetPort: 8080
```

* Update the application in the inactive environment, say green environment. Set `TARGET_ROLE=green` and `TOMCAT_VERSION=8` in the deployment config to update the green environment.
* Test the deployment via the `tomcat-test-green` test endpoint to ensure the green environment is ready to serve client traffic.
* Switch the frontend Service routing to the green environment by updating the Service config with `TARGET_ROLE=green`.
* Run additional tests on the public endpoint to ensure it is working properly.
* Now the blue environment is idle and we can:
  * leave it with the old application so that we can roll back if there's issue with the new application
  * update it to make it a hot backup of the active environment
  * reduce its replica count to save the occupied resources

![Resources](/images/blog/2018-04-30-zero-downtime-deployment-kubernetes-jenkins/resources.png)

As compared to Rolling Update, the blue/green update:
* Does not rely on the update strategy of a specific backend environment, either `RollingUpdate` or `Recreate` will do.
* The public service is either routed to the old applications, or new applications, but never both at the same time.
* The time it takes for the new pods to be ready does not affect the public service quality, as the traffic will only be routed to the new pods when all of them are tested to be ready.
* We can do comprehensive tests on the new environment before it serves any public traffic. Just keep in mind this is in production, and the tests should not pollute live application data.

## Jenkins Automation

Jenkins provides easy-to-setup workflow to automate your deployments. With [Pipeline](https://jenkins.io/doc/book/pipeline/) support, it is flexible to build the zero-downtime deployment workflow, and visualize the deployment steps.
To facilitate the deployment process for Kubernetes resources, we published the [Kubernetes Continuous Deploy](https://aka.ms/azjenkinsk8s) and the [Azure Container Service](https://aka.ms/azjenkinsacs) plugins built based on the [kubernetes-client](https://github.com/fabric8io/kubernetes-client). You can deploy the resource to Azure Kubernetes Service (AKS) or the general Kubernetes clusters without the need of kubectl, and it supports variable substitution in the resource configuration so you can deploy environment-specific resources to the clusters without updating the resource config.
We created a Jenkins Pipeline to demonstrate the blue/green deployment to AKS. The flow is like the following:

![Jenkins Pipeline](/images/blog/2018-04-30-zero-downtime-deployment-kubernetes-jenkins/jenkins-pipeline.png)

- Pre-clean: clean workspace.
- SCM: pulling code from the source control management system.
- Prepare Image: prepare the application docker images and upload them to some Docker repository.
- Check Env: determine the active and inactive environment, which drives the following deployment.
- Deploy: deploy the new application resource configuration to the inactive environment. With the Azure Container Service plugin, this can be done with:
```
acsDeploy azureCredentialsId: 'stored-azure-credentials-id',
          configFilePaths: "glob/path/to/*/resource-config-*.yml",
          containerService: "aks-name | AKS",
          resourceGroupName: "resource-group-name",
          enableConfigSubstitution: true
```          
- Verify Staged: verify the deployment to the inactive environment to ensure it is working properly. Again, note this is in the production environment, so be careful not to pollute live application data during tests.
- Confirm: Optionally, send email notifications for manual user approval to proceed with the actual environment switch.
- Switch: Switch the frontend service endpoint routing to the inactive environment. This is just another service deployment to the AKS Kubernetes cluster.
- Verify Prod: verify the frontend service endpoint is working properly with the new environment.
- Post-clean: do some post clean on the temporary files.

For the Rolling Update strategy, simply deploy the deployment configuration to the Kubernetes cluster, which is a simple, single step.

## Put It All Together

We built a quickstart template on Azure to demonstrate how we can do the zero-downtime deployment to AKS (Kubernetes) with Jenkins. Go to [Jenkins Blue-Green Deployment on Kubernetes](https://aka.ms/azjenkinsk8sqs) and click the button Deploy to Azure to get the working demo. This template will provision:

* An AKS cluster, with the following resources:
  * Two similar deployments representing the environments "blue" and "green". Both are initially set up with the `tomcat`:7 image.
  * Two test endpoint services (`tomcat-test-blue` and `tomcat-test-green`), which are connected to the corresponding deployments, and can be used to test if the deployments are ready for production use.
  * A production service endpoint (`tomcat-service`) which represents the public endpoint that the users will access. Initially it is routing to the "blue" environment.
* A Jenkins master running on an Ubuntu 16.04 VM, with the Azure service principal credentials configured. The Jenkins instance has two sample jobs:
  * AKS Kubernetes Rolling Update Deployment pipeline to demonstrate the Rolling Update deployment to AKS.
  * AKS Kubernetes Blue/green Deployment pipeline to demonstrate the blue/green deployment to AKS.
  * We didn't include the email confirmation step in the quickstart template. To add that, you need to configure the email SMTP server details in the Jenkins system configuration, and then add a Pipeline stage before Switch:
```
stage('Confirm') {
    mail (to: 'to@example.com',
        subject: "Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) is waiting for input",
        body: "Please go to ${env.BUILD_URL}.")
    input 'Ready to go?'
}
```
Follow the [Steps](https://github.com/Azure/azure-quickstart-templates/tree/master/301-jenkins-aks-zero-downtime-deployment#steps) to setup the resources and you can try it out by start the Jenkins build jobs.
