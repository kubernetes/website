---
title: " Weekly Kubernetes Community Hangout Notes - July 10 2015 "
date: 2015-07-13
slug: weekly-kubernetes-community-hangout
url: /blog/2015/07/Weekly-Kubernetes-Community-Hangout
---

Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

Here are the notes from today's meeting:

* Eric Paris: replacing salt with ansible (if we want)
    * In contrib, there is a provisioning tool written in ansible
    * The goal in the rewrite was to eliminate as much of the cloud provider stuff as possible
    * The salt setup does a bunch of setup in scripts and then the environment is setup with salt
        * This means that things like generating certs is done differently on GCE/AWS/Vagrant
    * For ansible, everything must be done within ansible
    * Background on ansible
        * Does not have clients
        * Provisioner ssh into the machine and runs scripts on the machine
        * You define what you want your cluster to look like, run the script, and it sets up everything at once
        * If you make one change in a config file, ansible re-runs everything (which isn’t always desirable)
        * Uses a jinja2 template
	* Create machines with minimal software, then use ansible to get that machine into a runnable state
        * Sets up all of the add-ons
    * Eliminates the provisioner shell scripts
    * Full cluster setup currently takes about 6 minutes
        * CentOS with some packages
        * Redeploy to the cluster takes 25 seconds
    * Questions for Eric
        * Where does the provider-specific configuration go?
            * The only network setup that the ansible config does is flannel; you can turn it off
        * What about init vs. systemd?
            * Should be able to support in the code w/o any trouble (not yet implemented)
    * Discussion
        * Why not push the setup work into containers or kubernetes config?
            * To bootstrap a cluster drop a kubelet and a manifest
        * Running a kubelet and configuring the network should be the only things required. We can cut a machine image that is preconfigured minus the data package (certs, etc)
            * The ansible scripts install kubelet & docker if they aren’t already installed
        * Each OS (RedHat, Debian, Ubuntu) could have a different image. We could view this as part of the build process instead of the install process.
        * There needs to be solution for bare metal as well.
        * In favor of the overall goal -- reducing the special configuration in the salt configuration
        * Everything except the kubelet should run inside a container (eventually the kubelet should as well)
            * Running in a container doesn’t cut down on the complexity that we currently have
            * But it does more clearly define the interface about what the code expects
        * These tools (Chef, Puppet, Ansible) conflate binary distribution with configuration
            * Containers more clearly separate these problems
        * The mesos deployment is not completely automated yet, but the mesos deployment is completely different: kubelets get put on top on an existing mesos cluster
            * The bash scripts allow the mesos devs to see what each cloud provider is doing and re-use the relevant bits
            * There was a large reverse engineering curve, but the bash is at least readable as opposed to the salt
        * Openstack uses a different deployment as well
        * We need a well documented list of steps (e.g. create certs) that are necessary to stand up a cluster
            * This would allow us to compare across cloud providers
            * We should reduce the number of steps as much as possible
            * Ansible has 241 steps to launch a cluster
* 1.0 Code freeze
    * How are we getting out of code freeze?
    * This is a topic for next week, but the preview is that we will move slowly rather than totally opening the firehose
        * We want to clear the backlog as fast as possible while maintaining stability both on HEAD and on the 1.0 branch
        * The backlog of almost 300 PRs but there are also various parallel feature branches that have been developed during the freeze
    * Cutting a cherry pick release today (1.0.1) that fixes a few issues
    * Next week we will discuss the cadence for patch releases
