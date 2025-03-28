
## Kubernetes 1.33: Image Pull Policy the way you always thought it worked!

Authors:  `Stanislav Laznicka, Microsoft`, `Ben Petersen, Microsoft`

## Intro

Some things in Kubernetes are surprising, and ImagePullPolicy might be one of them.  Given Kubernetes is all about running pods, it may be surprising to learn that there has been a loophole in securely providing images to pods for over 10 years in the form of this [issue 18787](https://github.com/kubernetes/kubernetes/issues/18787)!  It is an exciting release when you can resolve a ten year old issue.

## IfNotPresent, Even If I'm Not Supposed to Have It

The gist of the problem is that `ImagePullPolicy: IfNotPresent` enforcement has done exactly its job.  If Pod A in a Namespace X is scheduled to a Node 1, and requires Image Foo, the Kubelet will utilize the credentials of Pod A and pull Image Foo from the registry.  This is exactly what you expect.

But, if a Pod B in Namespace Y happens to also be scheduled to Node 1, funny things can happen.  The Kubelet will honor `IfNotPresent`, see that the Image Foo is already in its local registry, and will provide Image Foo to Pod B.  After all, Pods on the same Node are surely authorized for the same resource, right?

Wrong.  While `IfNotPresent` should not pull Image Foo if it is already in the local registry, it is an incorrect security posture to allow all pods scheduled to a node to have access to that image, whether or not they have credentials to pull the image.

## IfNotPresent, But Only If I Am Supposed To Have It

In Kubernetes 1.33, we are finally addressing this (really old) problem and getting the auth right! As expected, if an image is not present, the Kubelet will attempt to pull the image.  The pods credentials will be utilized for this task.  If the image is present, this is where the behavior changes.  The kubelet will now verify the credential before allowing the pod to use the image.  

Fortunately, performance has been a consideration.  Pods utilizing the same credential will not be required to re-authenticate.


## Never Pull, But Still, Prove You Can Use It!

The `ImagePullPolicy: Never` option does not fetch images.  If the image is in the local registry, however, the pods credentials to use the image will still be validated.  Just like before, pods utilizing the same credential will not be required to re-authenticate.


## Always?

The `ImagePullPolicy: Always` has always worked as intended.  Each time an image is pulled there will be an authentication check.  This has historically been the most secure choice.  Fortunately, it is performant, and will not re-pull layers of images that already exist in the local registry.

## What's Next?

In Kubernetes 1.33 we ship the alpha version of this feature.  To give it a spin, enable the feature gate on a 1.33 cluster via`--feature-gates=KubeletEnsureSecretPulledImages=true`.

## How to Get Involved

[reading KEP-2535](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2535-ensure-secret-pulled-images) is a great way to understand these changes in depth. If you are interested in further involvement, reach out in Slack on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel.  You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings), held every-other Wednesday. 
