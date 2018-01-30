---
layout: blog
title: " Kubernetes Community Meeting Notes - 20160114 "
date:  Friday, January 28, 2016 

---
#### January 14 - RackN demo, testing woes, and KubeCon EU CFP.

- 
Note taker: Joe Beda
- 
Demonstration: Automated Deploy on Metal, AWS and others w/ Digital Rebar, Rob Hirschfeld &nbsp;and Greg Althaus from RackN

  - 
Greg Althaus. CTO. &nbsp;Digital Rebar is the product. &nbsp;Bare metal provisioning tool.
  - 
Detect hardware, bring it up, configure raid, OS and get workload deployed.
  - 
Been working on Kubernetes workload.
  - 
Seeing trend to start in cloud and then move back to bare metal.
  - 
New provider model to use provisioning system on both cloud and bare metal.
  - 
UI, REST API, CLI
  - 
Demo: Packet -- bare metal as a service

    - 
4 nodes running grouped into a “deployment”
    - 
Functional roles/operations selected per node.
    - 
Decomposed the kubernetes bring up into units that can be ordered and synchronized. &nbsp;Dependency tree -- things like wait for etcd to be up before starting k8s master.
    - 
Using the Ansible playbook under the covers.
    - 
Demo brings up 5 more nodes -- packet will build those nodes
    - 
Pulled out basic parameters from the ansible playbook. &nbsp;Things like the network config, dns set up, etc.

      - 
Flannel now with work on opencontrail
    - 
Hierarchy of roles pulls in other components -- making a node a master brings in a bunch of other roles that are necessary for that.
    - 
Has all of this combined into a command line tool with a simple config file.
  - 
Forward: extending across multiple clouds for test deployments. &nbsp;Also looking to create split/replicated across bare metal and cloud.
  - 
Q: secrets?   
A: using ansible playbooks. &nbsp;Builds own certs and then distributes them. &nbsp;Wants to abstract them out and push that stuff upstream.
  - 
Q: Do you support bringing up from real bare metal with PXE boot?   
A: yes -- will discover bare metal systems and install OS, install ssh keys, build networking, etc.
- 
[from SIG-scalability] Q: What is the status of moving to golang 1.5?  
A: At HEAD we are 1.5 but will support 1.4 also. Some issues with flakiness but looks like things are stable now. &nbsp;

  - 
Also looking to use the 1.5 vendor experiment. &nbsp;Move away from godep. &nbsp;But can’t do that until 1.5 is the baseline.
  - 
Sarah: one of the things we are working on is rewards for doing stuff like this. &nbsp;Cloud credits, tshirts, poker chips, ponies.
- 
[from SIG-scalability] Q: What is the status of cleaning up the jenkins based submit queue? What can the community do to help out?  
A: It has been rocky the last few days. &nbsp;There should be issues associated with each of these. There is a [flake label](https://github.com/kubernetes/kubernetes/labels/kind%2Fflake) on those issues. &nbsp;

  - 
Still working on test federation. &nbsp;More test resources now. &nbsp;Happening slowly but hopefully faster as new people come up to speed. &nbsp;Will be great to having lots of folks doing e2e tests on their environments.
  - 
Erick Fjeta is the new test lead
  - 
Brendan is happy to help share details on Jenkins set up but that shouldn’t be necessary.
  - 
Federation may use Jenkins API but doesn’t require Jenkins itself.
  - 
Joe bitches about the fact that running the e2e tests in the way Jenkins is tricky. &nbsp;Brendan says it should be runnable easily. &nbsp;Joe will take another look.
  - 
Conformance tests? etune did this but he isn’t here. &nbsp;- revisit 20150121
- 
Kubecon.io/EU CFP is open [https://kubecon.io/call-for-proposals/](https://kubecon.io/call-for-proposals/)

  - 
March 10-11 in London. &nbsp;Venue to be announced this week.
  - 
Please send talks! &nbsp;CFP deadline looks to be Feb 5.

    - 
Would love to see more talks from production users.
  - 
Lots of excitement. &nbsp;Looks to be 700-800 people. &nbsp;Bigger than SF version (560 ppl).
  - 
Buy tickets early -- early bird prices will end soon and price will go up 100 GBP.
  - 
Accommodations provided for speakers?

    - 
Potentially but not 100% certain. &nbsp;Need to figure it out.
  - 
Q from Bob @ Samsung: Can we get more warning/planning for stuff like this:

    - 
A: Sarah -- I don’t hear about this stuff much in advance but will try to pull together a list. &nbsp;Working to make the events page on kubernetes.io easier to use.
    - 
A: JJ -- we’ll make sure we give more info earlier for the next US conf.
- 
Scale tests [Rob Hirschfeld from RackN] -- if you want to help coordinate on scale tests we’d love to help.

  - 
Bob invited Rob to join the SIG-scale group.
  - 
There is also a big bare metal cluster through the CNCF (from Intel) that will be useful too. &nbsp;No hard dates yet on that.
- 
Notes/video going to be posted on k8s blog. (Video for 20150114 wasn’t recorded. &nbsp;Fail.)

To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation - January 27th, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat). &nbsp;&nbsp;

We missed recording this meeting, but you can check out the archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).
  
