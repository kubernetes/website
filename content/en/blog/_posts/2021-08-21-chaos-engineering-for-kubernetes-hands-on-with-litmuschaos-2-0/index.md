---
layout: blog
title: 'Chaos Engineering for Kubernetes: Hands-on with LitmusChaos 2.0'
date: 2021-08-21
slug: chaos-engineering-for-kubernetes-hands-on-with-litmuschaos-2-0
---

**Author**: Neelanjan Manna (ChaosNative)

With LitmusChaos 2.0 now generally available (GA), chaos engineering has transformed into a scalable and collaborative discipline in achieving cloud-native reliability, for every organization. It introduces a host of productive features such as Chaos Center, Litmus Workflows, Multi-Tenancy, Observability & Steady State Hypothesis Validation, GitOps, Non-Kubernetes Chaos, and much more. Before we start exploring LitmusChaos 2.0 in greater depth, let’s have a brief introduction to LitmusChaos first.

LitmusChaos is a toolset to do cloud-native Chaos Engineering. Litmus provides tools to orchestrate chaos on Kubernetes to help developers and SREs find weaknesses in their application deployments. Litmus can run chaos experiments initially in the staging environment and eventually in production to find bugs and vulnerabilities. Fixing the weaknesses leads to increased resilience of the system. LitmusChaos adopts a “Kubernetes-native” approach to define chaos intent in a declarative manner via custom resources. It is 100% Open Source and a CNCF Sandbox project.

In this blog, we’d have a look at how to get started with LitmusChaos 2.0, starting with its installation, then executing a pre-defined chaos workflow using Chaos Center, and finally post-chaos analysis of the chaos workflow. Let’s get started.

## Step-1: Install LitmusChaos 2.0
For this step, we’d be referring to the commands given in the [Litmus Documentation](https://docs.litmuschaos.io/). The prerequisites for installing LitmusChaos 2.0 include Kubernetes 1.17 and a Persistent Volume of 20 GB. Litmus can be installed either using the Helm repository or directly from a Kubernetes manifest. It supports a namespace-scoped installation for enabling multi-tenancy as well as a cluster-scoped installation. For this demo, we’d be going with a namespace-scoped installation using Helm.

Firstly, we will download the Helm LitmusChaos 2.0 repository using the following command:
```
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
```

Then, we will create a `litmus` namespace where all the Litmus resources will get created using the following command:
```
kubectl create ns litmus
``` 

Lastly, we will install the Litmus Chaos Center using the following command:
```
helm install chaos litmuschaos/litmus --namespace=litmus
```

To verify if the frontend, server, and database pods are running, execute the following command:
```
kubectl get pods -n litmus
```

You should see the following pods:
{{< figure src="image18.png" alt="Litmus Pods" >}}

Once the pods are up and running, we can access the Chaos Center Web UI. To do that, fetch the services created under the litmus namespace using the following command:
```
kubectl get svc -n litmus 
```

You should see a similar output:
{{< figure src="image2.png" alt="Litmus Services" >}}

In this case, the `PORT` for `litmusportal-frontend-service` is 30385. Yours will be different. Once you have the `PORT` copied in your clipboard, simply use your node external IP and PORT in this manner `<NODEIP>:<PORT>` to access the Litmus Chaos Center. For example, `http://172.17.0.3:30385/`, where 172.17.0.3 is my NodeIP and 30385 is the frontend service `PORT`.

{{< figure src="image12.png" alt="Chaos Center" >}}

You should be able to see the Login Page of Litmus Chaos Center. The default credentials are “admin” for the username and “litmus” for the password. Upon the first login, you’d be asked to update the password. Once done, you’d be able to access the Dashboard.

## Step-2: Execute a Chaos Workflow
We will execute a pod-delete fault on a sample microservice application called [Podtato Head](https://github.com/cncf/podtato-head/) using one of the pre-defined chaos workflow templates called potato-head.

Click on **Schedule a Workflow** from the Chaos Center Homepage or from the top right button in the **Litmus Workflows** tab.

{{< figure src="image16.png" alt="Schedule a Workflow" >}}

{{< figure src="image3.png" alt="Schedule a Workflow" >}}

Select the Self Agent as the target ChaosAgent for chaos injection. This will allows us to target the resources belonging to the same cluster in which the Chaos Center is installed.

{{< figure src="image4.png" alt="Self Agent" >}}

Expand the first radio button (To create a new workflow from Predefined Workflow Templates) and select **podtato-head** from the list of Predefined Workflows.

{{< figure src="image6.png" alt="Podtato Head Workflow Template" >}}

View the workflow details in the Workflow Settings, you can modify the name and description of the workflow to suit your needs.

{{< figure src="image9.png" alt="Workflow Settings" >}}

View the visualization of the Litmus Workflow you are about to execute. This step also allows for you to edit or modify the YAML/tunable if required. We would just stick with the default configurations for now.

{{< figure src="image11.png" alt="Edit YAML" >}}

By default in the Podtato Head Workflow Template, the steps to install the Podtato Head application (install-application), install the chaos experiments from Chaos Hub (install-chaos-experiments), execute the pod-delete experiment (pod-delete), gracefully delete the Chaos Resources (revert-chaos) and the Podtato Head application (delete-application) are present in the same sequence. 

{{< figure src="image14.png" alt="Workflow Steps" >}}

Assign weights to the chaos experiments that are part of the workflow using the slider. This is typically used when there are multiple experiments as part of a workflow. These weights influence the **Resilience Score** calculation for the chaos workflow.

{{< figure src="image1.png" alt="Resilience Score" >}}

Schedule the Litmus Workflow for immediate and one-time execution by selecting the **Schedule Now** option

{{< figure src="image8.png" alt="Schedule Chaos" >}}

Verify and click on **Finish** to start the Chaos Injection

{{< figure src="image7.png" alt="Finish and Execute Chaos" >}}

And with that, you have successfully scheduled your first Chaos Workflow with Litmus. 

## Step-3: Visualize and Analyze Workflow
Now that our workflow is getting executed, we can leverage chaos observability to monitor the steps of chaos injection and its effects on the target resources using the Chaos Center. Later, we will also analyze the chaos result and the metrics generated during the chaos using the built-in Analytics Dashboard. It's worth noting that Litmus can also integrate with external observability tools such as Prometheus and Grafana.

To check the current progress of the Podtato-Head workflow, view the status of the Workflow from the Litmus Workflows Tab.

{{< figure src="image10.png" alt="Progress of the Podtato-Head Workflow" >}}

Litmus deploys a sample multi-replica hello-service application before pulling the pod-delete ChaosExperiment template. In the next step, it creates the ChaosEngine to launch the chaos injection via dedicated pods.

To see all these steps live in action, choose the workflow’s name or select **Show the workflow** from the three-dot menu.

{{< figure src="image5.png" alt="Show the Workflow" >}}

To see them in action on the terminal itself watch the pods in the namespace where Chaos Center is installed. Execute the following command:
```
kubectl get pods -n litmus
```

{{< figure src="image13.png" alt="Litmus Pods" >}}

Post Chaos Execution view the Experiment Results. Click on the **pod-delete** node on the graph to launch a results console. Click on the **Chaos Results** tab to view the details around the success/failure of the steady-state hypothesis constraints (podtato-head website availability through pod deletion period) and the experiment verdict.

{{< figure src="image15.png" alt="Chaos Result" >}}

We can also check the workflow analytics using the **Show the analytics** option for this workflow from the three-dot menu in the Workflows dashboard.

{{< figure src="image17.png" alt="Chaos Analytics" >}}

## Conclusion
In conclusion of this hands-on tutorial of LitmusChaos 2.0, we covered the most fundamental features of Litmus; starting from the Litmus installation, we saw how we can use LitmusChaos 2.0 to execute a chaos workflow using the Chaos Center Web UI, and how to view the workflow analytics using the built-in Analytics Dashboard. If you like LitmusChaos, check out the project [Github Repository](https://github.com/litmuschaos/litmus) to know more about it and contribute to its development. To explore and leverage the most out of Litmus read the [LitmusChaos Documentation](https://docs.litmuschaos.io/), and for many interesting use-cases and tutorials check out the [LitmusChaos Blogs](https://dev.to/t/litmuschaos/).