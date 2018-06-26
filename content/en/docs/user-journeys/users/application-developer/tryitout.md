---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
content_template: templates/user-journey-content
---
{{% capture body %}}
## Learn to create a Containerized application

Click on the Launch Terminal button to open a Kubernetes Cluster environment running on Minikube.

Minikube is a lightweight Kubernetes implementation that creates a Virtual Machine on your local machine and deploys a simple cluster containing only one node.  
For the purposes of this tutorial, Minikube is installed and launched on the terminal by default. By completing this tutorial, you will learn to deploy, expose, scale and update an application.
You will use command line interface called kubectl to perform all these tasks. Kubectl uses the Kubernetes API to interact with the cluster.

<div id="my-panel" data-katacoda-ondemand="true" data-katacoda-env="minikube" data-katacoda-command="minikube version; minikube start" data-katacoda-ui="panel"></div>
<script src="https://katacoda.com/embed.js"></script>
<button style="color:#000000; border:2px solid #000000" onclick="window.katacoda.init(); this.disabled=true;">Launch Terminal</button>




#### Deploy an application


1. View the cluster details:

    ```
    kubectl cluster-info
    ```

2. View the nodes in the cluster:

    ```
    kubectl get nodes
    ```

This command displays all the nodes in the cluster that can host your application. The ready status of the node indicates that it is ready to accept an application for deployment. If the status of the node is displayed as not ready, run the kubectl get nodes command again.


3. Create a new deployment:

    ```
    kubectl run kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1 --port=8080
    ```

    where

    * kubernetes-bootcamp is deployment names
    * image=gcr.io/google-samples/kubernetes-bootcamp:v1 is app image location
    * 8080 is the specified port information

{{<note>}}Note: If app images are hosted outside Docker hub, then include the full URL for images.{{</note>}}

Your application is deployed and scheduled to run on a node in the cluster. Additionally, the cluster is configured to reschedule the instance to another node in case of node failure.

4. List your deployments:

    ```
    kubectl get deployments
    ```

You can view that your deployment is running inside a Docker container on a node.


#### Expose an application


1. Verify that your application is running by looking for existing Pods:

    ```
    kubectl get pods
    ```

2. List the current Services from your cluster:

    ```
    kubectl get services
    ```

A service called kubernetes is created by default when Minikube starts the cluster.

3. Create a new service and expose it to the external traffic: [what does this external traffic mean?]

    ```
    kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
    ```
    where

    * kubernetes-bootcamp is the name of the service
    * 8080 is the specified NodePort information [What is the difference between port and nodeport. do I need to explain it here, since the number example commands are using is the same and it might cause confusion]


Execute the kubectl get services command again to view if the new service is added to the list.

[Not sure if i need to add the information below at all for this tutorial.]




#### Scale an application

1. List your deployments:

    ```
    kubectl get deployments
    ```


    This command displays the number of pods.

    The DESIRED state is shows the configured number of replicas

    The CURRENT state show how many replicas are running now

    The UP-TO-DATE is the number of replicas that were updated to match the desired (configured) state

    The AVAILABLE state shows how many replicas are actually AVAILABLE to the users

2. Scale the deployment to 3 replicas:

    ```
    kubectl scale deployments/kubernetes-bootcamp --replicas=3
    ```

    where
    * kubernetes-bootcamp is the name of the deployment
    * 3 is the desired number of replicas or number of instances



3. To list your Deployments once again, use get deployments:

    ```
    kubectl get deployments
    ```

4. Verify if the number of Pods have changed:

  ```
  kubectl get pods
  ```

#### Update the version of the app


  1. View the current image version of the app:

      ```
      kubectl describe pods
      ```

  2. Update the image of the application to version 2. Use the set image command, followed by the deployment name and the new image version:

      ```
      kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2
      ```
      The command initiated a rolling update and informed the deployment to use a a different image.

  3. View the status of the newly created pods and terminating pods:

      ```
      kubectl get pods
      ```

4. Verify that the app is running:
  First, let’s check that the App is running. To find out the exposed IP and Port we can use describe service:

  kubectl describe services/kubernetes-bootcamp


  The update can be confirmed also by running a rollout status command:

  kubectl rollout status deployments/kubernetes-bootcamp

  To view the current image version of the app, run a describe command against the Pods:

  kubectl describe pods

  We run now version 2 of the app (look at the Image field)

[[Stuff for the quiz:

There are 4 Pods now, with different IP addresses. The change was registered in the Deployment events log. To check that, use the describe command:

kubectl describe deployments/kubernetes-bootcamp

You can also view in the output of this command that there are 4 replicas now.

To scale down the Service to 2 replicas, run again the scale command:

kubectl scale deployments/kubernetes-bootcamp --replicas=2

List the Deployments to check if the change was applied with the get deployments command:

kubectl get deployments

The number of replicas decreased to 2. List the number of Pods, with get pods:

kubectl get pods -o wide

This confirms that 2 Pods were terminated.]]

To list your deployments use the get deployments command: kubectl get deployments

To list the running Pods use the get pods command:

kubectl get pods
