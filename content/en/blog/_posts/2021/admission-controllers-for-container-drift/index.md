---
layout: blog
title: "Using Admission Controllers to Detect Container Drift at Runtime"
date: 2021-12-21
slug: admission-controllers-for-container-drift
author: >
   Saifuding Diliyaer (Box)
---

{{< figure src="intro-illustration.png" alt="Introductory illustration" attr="Illustration by Munire Aireti" >}}

At Box, we use Kubernetes (K8s) to manage hundreds of micro-services that enable Box to stream data at a petabyte scale. When it comes to the deployment process, we run [kube-applier](https://github.com/box/kube-applier) as part of the GitOps workflows with declarative configuration and automated deployment. Developers declare their K8s apps manifest into a Git repository that requires code reviews and automatic checks to pass, before any changes can get merged and applied inside our K8s clusters. With `kubectl exec` and other similar commands, however, developers are able to directly interact with running containers and alter them from their deployed state. This interaction could then subvert the change control and code review processes that are enforced in our CI/CD pipelines. Further, it allows such impacted containers to continue receiving traffic long-term in production.

To solve this problem, we developed our own K8s component called [kube-exec-controller](https://github.com/box/kube-exec-controller) along with its corresponding [kubectl plugin](https://github.com/box/kube-exec-controller#kubectl-pi). They function together in detecting and terminating potentially mutated containers (caused by interactive kubectl commands), as well as revealing the interaction events directly to the target Pods for better visibility.

## Admission control for interactive kubectl commands
Once a request is sent to K8s, it needs to be authenticated and authorized by the API server to proceed. Additionally, K8s has a separate layer of protection called [admission controllers](/docs/reference/access-authn-authz/admission-controllers/), which can intercept the request before an object is persisted in *etcd*. There are various predefined admission controls compiled into the API server binary (e.g. ResourceQuota to enforce hard resource usage limits per namespace). Besides, there are two dynamic admission controls named [MutatingAdmissionWebhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) and [ValidatingAdmissionWebhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook), used for mutating or validating K8s requests respectively. The latter is what we adopted to detect container drift at runtime caused by interactive kubectl commands. This whole process can be divided into three steps as explained in detail below.

### 1. Admit interactive kubectl command requests
First of all, we needed to enable a validating webhook that sends qualified requests to *kube-exec-controller*. To add the new validation mechanism applying to interactive kubectl commands specifically, we configured the webhook’s rules with resources as `[pods/exec, pods/attach]`, and operations as `CONNECT`. These rules tell the cluster's API server that all `exec` and `attach` requests should be subject to our admission control webhook. In the ValidatingAdmissionWebhook that we configured, we specified a `service` reference (could also be replaced with `url` that gives the location of the webhook) and `caBundle` to allow validating its X.509 certificate, both under the `clientConfig` stanza.

Here is a short example of what our ValidatingWebhookConfiguration object looks like:
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: example-validating-webhook-config
webhooks:
  - name: validate-pod-interaction.example.com
    sideEffects: None
    rules:
      - apiGroups: ["*"]
        apiVersions: ["*"]
        operations: ["CONNECT"]
        resources: ["pods/exec", "pods/attach"]
    failurePolicy: Fail
    clientConfig:
      service:
        # reference to kube-exec-controller service deployed inside the K8s cluster
        name: example-service
        namespace: kube-exec-controller
        path: "/admit-pod-interaction"
      caBundle: "{{VALUE}}" # PEM encoded CA bundle to validate kube-exec-controller's certificate
    admissionReviewVersions: ["v1", "v1beta1"]
```

### 2. Label the target Pod with potentially mutated containers
Once a request of `kubectl exec` comes in, *kube-exec-controller* makes an internal note to label the associated Pod. The added labels mean that we can not only query all the affected Pods, but also enable the security mechanism to retrieve previously identified Pods, in case the controller service itself gets restarted.

The admission control process cannot directly modify the targeted in its admission response. This is because the `pods/exec` request is against a subresource of the Pod API, and the API kind for that subresource is `PodExecOptions`. As a result, there is a separate process in *kube-exec-controller* that patches the labels asynchronously. The admission control always permits the `exec` request, then acts as a client of the K8s API to label the target Pod and to log related events. Developers can check whether their Pods are affected or not using `kubectl` or similar tools. For example:

```
$ kubectl get pod --show-labels
NAME      READY  STATUS   RESTARTS  AGE  LABELS
test-pod  1/1    Running  0         2s   box.com/podInitialInteractionTimestamp=1632524400,box.com/podInteractorUsername=username-1,box.com/podTTLDuration=1h0m0s

$ kubectl describe pod test-pod
...
Events:
Type       Reason            Age     From                            Message
----       ------            ----    ----                            -------
Warning    PodInteraction    5s      admission-controller-service    Pod was interacted with 'kubectl exec' command by user 'username-1' initially at time 2021-09-24 16:00:00 -0800 PST
Warning    PodInteraction    5s      admission-controller-service    Pod will be evicted at time 2021-09-24 17:00:00 -0800 PST (in about 1h0m0s).
```

### 3. Evict the target Pod after a predefined period
As you can see in the above event messages, the affected Pod is not evicted immediately. At times, developers might have to get into their running containers necessarily for debugging some live issues. Therefore, we define a time to live (TTL) of affected Pods based on the environment of clusters they are running. In particular, we allow a longer time in our dev clusters as it is more common to run `kubectl exec` or other interactive commands for active development.

For our production clusters, we specify a lower time limit so as to avoid the impacted Pods serving traffic abidingly. The *kube-exec-controller* internally sets and tracks a timer for each Pod that matches the associated TTL. Once the timer is up, the controller evicts that Pod using K8s API. The eviction (rather than deletion) is to ensure service availability, since the cluster respects any configured [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB). Let's say if a user has defined *x* number of Pods as critical in their PDB, the eviction (as requested by *kube-exec-controller*) does not continue when the target workload has fewer than *x* Pods running.

Here comes a sequence diagram of the entire workflow mentioned above:

 <!-- Mermaid Live Editor link - https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kjFPAzEMhf-KlalIbWd0QpUQdGJB3JrFTUyJmjhHzncFof53nGtpqYTYEuu958-Wv4zLnkxjenofiB09BtwWTJbRSS6QCLCHu01ZPdJIMXdUYNZTGYOjRd4zlRvLHRYJLnTIArvbtozV83TbAnZhUcVUrkXo04OU2I6uKu99Cn0fMsNDZik5Rm3SHntYTrRYrabUBl4GBmt2w4acRKAPcrBcLq0Bl1NC9pYnoRouHZopX9RX9aotddJeADaf4DDGwFuQN4IRY_Ao9bunzVvOO13COeYCcR9j3k-OCQDP9KfgC8TJsFbZIHSxnGljzp1lgKs2v9HXugMBwe2WPHTZ94CvottB6Ap5eg2s9cBaUnrLVEP_Yp5ynrOf3fxPV2V1lBOhmZtEJWHweiFfldQa1SWyptGnAuAQxRrLB5UOna6P1j7o4ZhGykBzg4Pk9pPdz_-oOR3ZsXj4BjrP5rU-->

![Sequence Diagram](/images/sequence_diagram.svg)

## A new kubectl plugin for better user experience
Our admission controller component works great for solving the container drift issue we had on the platform. It is also able to submit all related Events to the target Pod that has been affected. However, K8s clusters don't retain Events very long (the default retention period is one hour). We need to provide other ways for developers to get their Pod interaction activity. A [kubectl plugin](/docs/tasks/extend-kubectl/kubectl-plugins/) is a perfect choice for us to expose this information. We named our plugin `kubectl pi` (short for `pod-interaction`) and provide two subcommands: `get` and `extend`.

When the `get` subcommand is called, the plugin checks the metadata attached by our admission controller and transfers it to human-readable information. Here is an example output from running `kubectl pi get`:

```
$ kubectl pi get test-pod
POD-NAME  INTERACTOR  POD-TTL  EXTENSION  EXTENSION-REQUESTER  EVICTION-TIME
test-pod  username-1  1h0m0s   /          /                    2021-09-24 17:00:00 -0800 PST
```

The plugin can also be used to extend the TTL for a Pod that is marked for future eviction. This is useful in case developers need extra time to debug ongoing issues. To achieve this, a developer uses the `kubectl pi extend` subcommand, where the plugin patches the relevant *annotations* for the given Pod. These *annotations* include the duration and username who made the extension request for transparency (displayed in the table returned from the `kubectl pi get` command).

Correspondingly, there is another webhook defined in *kube-exec-controller* which admits valid annotation updates. Once admitted, those updates reset the eviction timer of the target Pod as requested. An example of requesting the extension from the developer side would be:

```
$ kubectl pi extend test-pod --duration=30m
Successfully extended the termination time of pod/test-pod with a duration=30m
 
$ kubectl pi get test-pod
POD-NAME  INTERACTOR  POD-TTL  EXTENSION  EXTENSION-REQUESTER  EVICTION-TIME
test-pod  username-1  1h0m0s   30m        username-2           2021-09-24 17:30:00 -0800 PST
```

## Future improvement
Although our admission controller service works great in handling interactive requests to a Pod, it could as well evict the Pod while the actual commands are no-op in these requests. For instance, developers sometimes run `kubectl exec` merely to check their service logs stored on hosts. Nevertheless, the target Pods would still get bounced despite the state of their containers not changing at all. One of the improvements here could be adding the ability to distinguish the commands that are passed to the interactive requests, so that no-op commands should not always force a Pod eviction. However, this becomes challenging when developers get a shell to a running container and execute commands inside the shell, since they will no longer be visible to our admission controller service.

Another item worth pointing out here is the choice of using K8s *labels* and *annotations*. In our design, we decided to have all immutable metadata attached as *labels* for better enforcing the immutability in our admission control. Yet some of these metadata could fit better as *annotations*. For instance, we had a label with the key `box.com/podInitialInteractionTimestamp` used to list all affected Pods in *kube-exec-controller* code, although its value would be unlikely to query for. As a more ideal design in the K8s world, a single *label* could be preferable in our case for identification with other metadata applied as *annotations* instead.

## Summary
With the power of admission controllers, we are able to secure our K8s clusters by detecting potentially mutated containers at runtime, and evicting their Pods without affecting service availability. We also utilize kubectl plugins to provide flexibility of the eviction time and hence, bringing a better and more self-independent experience to service owners. We are proud to announce that we have open-sourced the whole project for the community to leverage in their own K8s clusters. Any contribution is more than welcomed and appreciated. You can find this project hosted on GitHub at https://github.com/box/kube-exec-controller

*Special thanks to Ayush Sobti and Ethan Goldblum for their technical guidance on this project.*
