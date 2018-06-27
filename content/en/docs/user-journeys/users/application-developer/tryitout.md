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
<button style="color:#000000; border:2px solid #169bd7" onclick="window.katacoda.init(); this.disabled=true;">Launch Terminal</button>


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


#### Challenge

Write the command to verify if the new service is added to the list. (Hint: list the current services)

Click to view the answer

    ```
    kubectl get services
    ```


#### Scale an application

1. List your deployments:

    ```
    kubectl get deployments
    ```

    (This command displays the number of pods

    The DESIRED state is shows the configured number of replicas

    The CURRENT state show how many replicas are running now

    The UP-TO-DATE is the number of replicas that were updated to match the desired (configured) state

    The AVAILABLE state shows how many replicas are actually AVAILABLE to the users)

2. Scale the deployment to 3 replicas:

    ```
    kubectl scale deployments/kubernetes-bootcamp --replicas=3
    ```

    where
    * deployments is the type
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

#### Challenge

  Now write the command to scale down the application to 2 replicas:

  Click to view the correct answer

    ```
    kubectl scale deployments/kubernetes-bootcamp --replicas=2
    ```

  Write the command to list the deployments to verify if the application is scaled down to 2 replicas.

  Click to view the correct answer

    ```
    kubectl get deployments
    ```

#### Update the version of the app


  1. View the current image version of the app:

      ```
      kubectl describe pods
      ```

  2. Update the image of the application to version 2.
      ```
      kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2
      ```
      where
      * deployments is the type
      * kubernetes-bootcamp is the deployment name
      * kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2 is the new image version [Is this correct]

      The command initiates a rolling update and informs the deployment to use a different image.

  3. View the status of the newly created pods and terminating pods:

      ```
      kubectl get pods
      ```

4. Verify that the application is updated:

      ```
      kubectl rollout status deployments/kubernetes-bootcamp
      ```

#### Challenge

Now write the command to view the current image version of the app:


Click to view the correct answer
    ```
    kubectl describe pods
    ```
