---
title: " Weekly Kubernetes Community Hangout Notes - May 15 2015 "
date: 2015-05-18
slug: weekly-kubernetes-community-hangout_18
url: /blog/2015/05/Weekly-Kubernetes-Community-Hangout_18
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  


* [v1 API][1] \- what's in, what's out
    * We're trying to fix critical issues we discover with v1beta3
    * Would like to make a number of minor cleanups that will be expensive to do later
        * defaulting replication controller spec default to 1
        * deduplicating security context
        * change id field to name
        * rename host
        * inconsistent times
        * typo in container states terminated (termination vs. terminated)
        * flatten structure (requested by heavy API user)
        * pod templates - could be added after V1, field is not implemented, remove template ref field
        * in general remove any fields not implemented (can be added later)
        * if we want to change any of the identifier validation rules, should do it now
        * recently changed label validation rules to be more precise
    * Bigger changes
        * generalized label selectors
        * service - change the fields in a way that we can add features in a forward compatible manner if possible
        * public IPs - what to do from a security perspective
        * Support aci format - there is an image field - add properties to signify the image, or include it in a string
        * inconsistent on object use / cross reference - needs design discussion
    * Things to do later
        * volume source cleanup
        * multiple API prefixes
        * watch changes - watch client is not notified of progress
* A few other proposals
    * swagger spec fixes - ongoing
    * additional field selectors - additive, backward compatible
    * additional status - additive, backward compatible
    * elimination of phase - won't make it for v1
* Service discussion - Public IPs
    * with public IPs as it exists we can't go to v1
    * Tim has been developing a mitigation if we can't get Justin's overhaul in (but hopefully we will)
    * Justin's fix will describe public IPs in a much better way
    * The general problem is it's too flexible and you can do things that are scary, the mitigation is to restrict public ip usage to specific use cases -- validated public IPs would be copied to status, which is what kube-proxy would use
    * public IPs used for -
        * binding to nodes / node
        * request a specific load balancer IP (GCE only)
        * emulate multi-port services -- now we support multi-port services, so no longer necessary
    * This is a large change, 70% code complete, Tim & Justin working together, parallel code review and updates, need to reconcile and test
    * Do we want to allow people to request host ports - is there any value in letting people ask for a public port? or should we assign you one?
        * Tim: we should assign one
    * discussion of what to do with status - if users set to empty then probably their intention
    * general answer to the pattern is binding
    * post v1: if we can make portal ip a non-user settable field, then we need to figure out the transition plan. need to have a fixed ip for dns.
    * we should be able to just randomly assign services a new port and everything should adjust, but this is not feasible for v1
    * next iteration of the proposal: PR is being iterated on, testing over the weekend, so PR hopefully ready early next week - gonna be a doozie!
* API transition
    * actively removing all dependencies on v1beta1 and v1beta2, announced their going away
    * working on a script that will touch everything in the system and will force everything to flip to v1beta3
    * a release with both APIs supported and with this script can make sure clusters are moved over and we can move the API
    * Should be gone by 0.19
    * Help is welcome, especially for trivial things and will try to get as much done as possible in next few weeks
    * Release candidate targeting mid june
    * The new kubectl will not work for old APIs, will be a problem for GKE for clusters pinned to old version. Will be a problem for k8s users as well if they update kubectl
    * Since there's no way to upgrade a GKE cluster, users are going to have to tear down and upgrade their cluster
    * we're going to stop testing v1beta1 very soon, trying to streamline the testing paths in our CI pipelines
* Did we decide we are not going to do namespace autoprovisioning?
    * Brian would like to turn it off - no objections
    * Documentation should include creating namepspaces
    * Would like to impose a default CPU for the default namespace
    * would cap the number of pods, would reduce the resource exhaustion issue
    * would eliminate need to explicitly cap the number of pods on a node due to IP exhaustion
    * could add resources as arguments to the porcelain commands
    * kubectl run is a simplified command, but it could include some common things (image, command, ports). but could add resources
* Kubernetes 1.0 Launch Event
    * Save the     * Blog posts, whitepapers, etc. welcome to be published
    * Event will be live streamed, mostly demos & customer talks, keynote
    * Big launch party in the evening
    * Kit to send more info in next couple weeks

[1]: https://github.com/GoogleCloudPlatform/kubernetes/issues/7018
