---
title: " Kubernetes Community Meeting Notes - 20160114 "
date: 2016-01-28
slug: kubernetes-community-meeting-notes
url: /blog/2016/01/Kubernetes-Community-Meeting-Notes
---
#####  January 14 - RackN demo, testing woes, and KubeCon EU CFP.
---
 Note taker: Joe Beda
---
* Demonstration: Automated Deploy on Metal, AWS and others w/ Digital Rebar, Rob Hirschfeld  and Greg Althaus from RackN

    * Greg Althaus. CTO.  Digital Rebar is the product.  Bare metal provisioning tool.

    * Detect hardware, bring it up, configure raid, OS and get workload deployed.

    * Been working on Kubernetes workload.

    * Seeing trend to start in cloud and then move back to bare metal.

    * New provider model to use provisioning system on both cloud and bare metal.

    * UI, REST API, CLI

    * Demo: Packet -- bare metal as a service

        * 4 nodes running grouped into a "deployment"

        * Functional roles/operations selected per node.

        * Decomposed the kubernetes bring up into units that can be ordered and synchronized.  Dependency tree -- things like wait for etcd to be up before starting k8s master.

        * Using the Ansible playbook under the covers.

        * Demo brings up 5 more nodes -- packet will build those nodes

        * Pulled out basic parameters from the ansible playbook.  Things like the network config, dns set up, etc.

        * Hierarchy of roles pulls in other components -- making a node a master brings in a bunch of other roles that are necessary for that.

        * Has all of this combined into a command line tool with a simple config file.

    * Forward: extending across multiple clouds for test deployments.  Also looking to create split/replicated across bare metal and cloud.

    * Q: secrets?   
A: using ansible playbooks.  Builds own certs and then distributes them.  Wants to abstract them out and push that stuff upstream.

    * Q: Do you support bringing up from real bare metal with PXE boot?   
A: yes -- will discover bare metal systems and install OS, install ssh keys, build networking, etc.
* [from SIG-scalability] Q: What is the status of moving to golang 1.5?  
A: At HEAD we are 1.5 but will support 1.4 also. Some issues with flakiness but looks like things are stable now.  

    * Also looking to use the 1.5 vendor experiment.  Move away from godep.  But can't do that until 1.5 is the baseline.

    * Sarah: one of the things we are working on is rewards for doing stuff like this.  Cloud credits, tshirts, poker chips, ponies.
* [from SIG-scalability] Q: What is the status of cleaning up the jenkins based submit queue? What can the community do to help out?  
A: It has been rocky the last few days.  There should be issues associated with each of these. There is a [flake label][1] on those issues.  

    * Still working on test federation.  More test resources now.  Happening slowly but hopefully faster as new people come up to speed.  Will be great to having lots of folks doing e2e tests on their environments.

    * Erick Fjeta is the new test lead

    * Brendan is happy to help share details on Jenkins set up but that shouldn't be necessary.

    * Federation may use Jenkins API but doesn't require Jenkins itself.

    * Joe bitches about the fact that running the e2e tests in the way Jenkins is tricky.  Brendan says it should be runnable easily.  Joe will take another look.

    * Conformance tests? etune did this but he isn't here.  - revisit 20150121
*     * March 10-11 in London.  Venue to be announced this week.

    * Please send talks!  CFP deadline looks to be Feb 5.

    * Lots of excitement.  Looks to be 700-800 people.  Bigger than SF version (560 ppl).

    * Buy tickets early -- early bird prices will end soon and price will go up 100 GBP.

    * Accommodations provided for speakers?

    * Q from Bob @ Samsung: Can we get more warning/planning for stuff like this:

        * A: Sarah -- I don't hear about this stuff much in advance but will try to pull together a list.  Working to make the events page on kubernetes.io easier to use.

        * A: JJ -- we'll make sure we give more info earlier for the next US conf.
* Scale tests [Rob Hirschfeld from RackN] -- if you want to help coordinate on scale tests we'd love to help.

    * Bob invited Rob to join the SIG-scale group.

    * There is also a big bare metal cluster through the CNCF (from Intel) that will be useful too.  No hard dates yet on that.
* Notes/video going to be posted on k8s blog. (Video for 20150114 wasn't recorded.  Fail.)

To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation - January 27th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].    



[1]: https://github.com/kubernetes/kubernetes/labels/kind%2Fflake
[2]: http://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
