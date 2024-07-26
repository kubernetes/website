---
title: "Reporting Errors from Control Plane to Applications Using Kubernetes Events"
date: 2018-01-25
published: true
slug: reporting-errors-using-kubernetes-events
url: /blog/2018/01/Reporting-Errors-Using-Kubernetes-Events
author: >
  Hakan Baba (Box)
---

At [Box](https://www.box.com/), we manage several large scale Kubernetes clusters that serve as an internal platform as a service (PaaS) for hundreds of deployed microservices. The majority of those microservices are applications that power box.com for over 80,000 customers. The PaaS team also deploys several services affiliated with the platform infrastructure as the _control plane_.  

One use case of Box’s control plane is [public key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure) (_PKI_) processing. In our infrastructure, applications needing a new SSL certificate also need to trigger some processing in the control plane. The majority of our applications are not allowed to generate new SSL certificates due to security reasons. The control plane has a different security boundary and network access, and is therefore allowed to generate certificates.  


| ![](https://docs.google.com/a/linuxfoundation.org/drawings/d/snd-Vdn8h65V5wEBwU0KIqg/image?w=624&h=554&rev=303&ac=1)  |
| Figure1: Block Diagram of the PKI flow |


If an application needs a new certificate, the application owner explicitly adds a [Custom Resource Definition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/) (CRD) to the application’s Kubernetes config [1]. This CRD specifies parameters for the SSL certificate: _name, common name, and others_. A microservice in the control plane watches CRDs and triggers some processing for SSL certificate generation [2]. Once the certificate is ready, the same control plane service sends it to the API server in a Kubernetes [Secret](/docs/concepts/configuration/secret/) [3]. After that, the application containers access their certificates using Kubernetes [Secret VolumeMounts](/docs/concepts/storage/volumes/#secret) [4]. You can see a working demo of this system in our [example application](https://github.com/box/error-reporting-with-kubernetes-events) on GitHub.  

The rest of this post covers the error scenarios in this “triggered” processing in the control plane. In particular, we are especially concerned with user input errors. Because the SSL certificate parameters come from the application’s config file in a CRD format, what should happen if there is an error in that CRD specification? Even a typo results in a failure of the SSL certificate creation. The error information is available in the control plane even though the root cause is most probably inside the application’s config file. The application owner does not have access to the control plane’s state or logs.  

Providing the right diagnosis to the application owner so she can fix the mistake becomes a serious productivity problem at scale. Box’s rapid migration to microservices results in several new deployments every week. Numerous first time users, who do not know every detail of the infrastructure, need to succeed in deploying their services and troubleshooting problems easily. As the owners of the infrastructure, we do not want to be the bottleneck while reading the errors from the control plane logs and passing them on to application owners. If something in an owner’s configuration causes an error somewhere else, owners need a fully empowering diagnosis. This error data must flow automatically without any human involvement.  

After considerable thought and experimentation, we found that [Kubernetes Events](https://v1-7.docs.kubernetes.io/docs/api-reference/v1.7/#event-v1-core) work great to automatically communicate these kind of errors. If the error information is placed in a pod’s event stream, it shows up in kubectl describe output. Even beginner users can execute kubectl describe pod and obtain an error diagnosis.  


We experimented with a status web page for the control plane service as an alternative to Kubernetes Events. We determined that the status page could update every time after processing an SSL certificate, and that application owners could probe the status page and get the diagnosis from there. After experimenting with a status page initially, we have seen that this does not work as effectively as the Kubernetes Events solution. The status page becomes a new interface to learn for the application owner, a new web address to remember, and one more context switch to a distinct tool during troubleshooting efforts. On the other hand, Kubernetes Events show up cleanly at the kubectl describe output, which is easily recognized by the developers.  

Here is a simplified example showing how we used Kubernetes Events for error reporting across distinct services. We have open sourced a [sample golang application](https://github.com/box/error-reporting-with-kubernetes-events) representative of the previously mentioned control plane service. It watches changes on CRDs and does input parameter checking. If an error is discovered, a Kubernetes Event is generated and the relevant pod’s event stream is updated.  

The sample application executes this [code](https://github.com/box/error-reporting-with-kubernetes-events/blob/master/cmd/controlplane/main.go#L201) to setup the Kubernetes Event generation:  


```
// eventRecorder returns an EventRecorder type that can be  
// used to post Events to different object's lifecycles.  
func eventRecorder(  
   kubeClient \*kubernetes.Clientset) (record.EventRecorder, error) {  
   eventBroadcaster := record.NewBroadcaster()  
   eventBroadcaster.StartLogging(glog.Infof)  
   eventBroadcaster.StartRecordingToSink(  
      &typedcorev1.EventSinkImpl{  
         Interface: kubeClient.CoreV1().Events("")})  
   recorder := eventBroadcaster.NewRecorder(  
      scheme.Scheme,  
      v1.EventSource{Component: "controlplane"})  
   return recorder, nil  
}
 ```


After the one-time setup, the following [code](https://github.com/box/error-reporting-with-kubernetes-events/blob/master/cmd/controlplane/main.go#L163) generates events affiliated with pods:  


```
ref, err := reference.GetReference(scheme.Scheme, &pod)  
if err != nil {  
   glog.Fatalf("Could not get reference for pod %v: %v\n",  
      pod.Name, err)  
}  
recorder.Event(ref, v1.EventTypeWarning, "pki ServiceName error",  
   fmt.Sprintf("ServiceName: %s in pki: %s is not found in"+  
      " allowedNames: %s", pki.Spec.ServiceName, pki.Name,  
      allowedNames))
 ```


Further implementation details can be understood by running the sample application.  

As mentioned previously, here is the relevant kubectl describe output for the application owner.  


```
Events:  
  FirstSeen   LastSeen   Count   From         SubObjectPath   Type      Reason         Message  
  ---------   --------   -----   ----         -------------   --------   ------     
  ....  
  1d      1m      24   controlplane            Warning      pki ServiceName error   ServiceName: appp1 in pki: app1-pki is not found in allowedNames: [app1 app2]  
  ....  

 ```


We have demonstrated a practical use case with Kubernetes Events. The automated feedback to programmers in the case of configuration errors has significantly improved our troubleshooting efforts. In the future, we plan to use Kubernetes Events in various other applications under similar use cases. The recently created [sample-controller](https://github.com/kubernetes/sample-controller) example also utilizes Kubernetes Events in a similar scenario. It is great to see there are more sample applications to guide the community. We are excited to continue exploring other use cases for Events and the rest of the Kubernetes API to make development easier for our engineers.  

_If you have a Kubernetes experience you’d like to share, [submit your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform). If you use Kubernetes in your organization and want to voice your experience more directly, consider joining the [CNCF End User Community](https://www.cncf.io/people/end-user-community/) that Box and dozens of like-minded companies are part of._    

Special thanks for Greg Lyons and Mohit Soni for their contributions.  

