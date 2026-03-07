---
title: 'Zero-downtime Deployment in Kubernetes with Jenkins'
date: 2018-04-30
slug: zero-downtime-deployment-kubernetes-jenkins
author: >
  [Kaitlyn Barnard](https://github.com/kbarnard10)
---

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
    rollingUp      maxSurge: 50%
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

As compared to Rolling Update, the blue/green up* The public service is either routed to the old applications, or new applications, but never both at the same time.
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
