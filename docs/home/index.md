---
approvers:
- chenopis
title: Kubernetes Documentation
layout: docsportal
cid: userJourneys
css: /css/style_user_journeys.css
js: /js/user-journeys.js, https://use.fontawesome.com/4bcc658a89.js
---

{% unless page.notitle %}
<h1>{{ page.title }}</h1>
{% endunless %}

<div class="bar1">
    <div class="navButton users">Users</div>
    <div class="navButton contributors">Contributors</div>
    <div class="navButton migrators">Migration&nbsp;Paths</div>
    <a href="#docs"> <div class="navButton users">Browse Docs</div></a>
</div>

<div id="cardWrapper">
  <div class="bar2">I AM...</div>
  <div class='cards'></div>
</div>

<div style='text-align: center;'>
    <div class="bar2" id="subTitle"></div>
    <div class="bar3">
        <div class="tab1 foundational">
            <i class="fa fa-cloud-download" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>
            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Foundational
            </div>
            </div>
        <div class="tab1 intermediate">
            <i class="fa fa-check-square" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>

            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Intermediate
            </div>
        </div>
        <div class="tab1 advanced">
            <i class="fa fa-exclamation-circle" aria-hidden="true" style="font-size:50pt !important;padding-top:7% !important;padding-bottom:15% !important"></i>
            <br>
            <div class="tabbottom" style="padding-top:5%;padding-bottom:5%">
                Advanced Topics
            </div>
        </div>
      </div>
</div>

<div class='infobarWrapper'>
    <div class="infobar">
        <span style="padding-bottom: 3% ">I want to...</span>
        <a id="infolink1" href="docs.html"><div class="whitebar" >
            <div class="infoicon">
                <i class="fa fa-folder-open-o" aria-hidden="true" style="padding:%;float:left;color:#3399ff"></i>
            </div>
            <div id="info1" class='data'></div>
        </div></a>
        <a id="infolink2" href="docs.html"><div class="whitebar">
            <div class="infoicon">
                <i class="fa fa-retweet" aria-hidden="true" style="padding-bottom:%;float:left;color:#3399ff"></i>
            </div>
            <div id="info2" class='data'></div>
        </div></a>
        <a id="infolink3" href="docs.html"> <div class="whitebar">
            <div class="infoicon">
                <i class="fa fa-hdd-o" aria-hidden="true" style="padding:%;float:left;color:#3399ff;margin-right:9px"></i>
            </div>
            <div id="info3" class='data'></div>
        </div></a>
    </div>
</div>


  <div class="browseheader" name="docs">
        Browse Docs
      </div>
<div class="browsedocs">

<div class="browsesection">

        <div class="docstitle">
          <a href="#">Setup</a>
        </div>

        <div class="pages">
            <div class="browsecolumn">

            <a href="/getting-started/what-is-npm" >01 - Picking the Right Solution</a><br>
            <a href="/getting-started/installing-node" >02 - Independent Solutions</a><br>
          </div>
          <div class="browsecolumn">
            <a href="/getting-started/fixing-npm-permissions" >03 - Hosted Solutions</a><br>
            <a href="/getting-started/installing-npm-packages-locally" >04 - Turn-key Cloud Solutions</a><br>
            </div>
            <div class="browsecolumn">
            <a href="/getting-started/using-a-package.json" >05 - Custom Solutions</a><br>
          </div>


        </div>

  </div>

  <div class="browsesection">

        <div class="docstitle">
          <a href="#">Concepts</a>
        </div>

        <div class="pages">
          <div class="browsecolumn">
            <a href="/how-npm-works/packages" >01 - Overview</a><br>
            <a href="/how-npm-works/npm2" >02 - Kubernetes Architecture</a><br>
            <a href="/how-npm-works/npm3" >03 - Extending the Kubernetes API</a><br>
          </div>
            <div class="browsecolumn">
            <a href="/how-npm-works/npm3-dupe" >04 - Containers</a><br>
            <a href="/how-npm-works/npm3-nondet" >05 - Workloads</a><br>

            <a href="/how-npm-works/npm3" >06 - Configuration</a><br>
          </div>
            <div class="browsecolumn">
            <a href="/how-npm-works/npm3-dupe" >07 - Services, Load Balancing, and Networking</a><br>
            <a href="/how-npm-works/npm3-nondet" >08 - Storage</a><br>
            <a href="/how-npm-works/npm3-nondet" >09 - Cluster Administration</a><br>
          </div>
        </div>
</div>

<div class="browsesection">
        <div class="docstitle">
          <a href="#">Tasks</a>
        </div>

        <div class="pages">
              <div class="browsecolumn">
            <a href="/private-modules/intro" >01 - Install Tools</a><br>
            <a href="/private-modules/ci-server-config" >02 - Configure Pods and Containers</a><br>
            <a href="/private-modules/docker-and-private-modules" >03 - Inject Data Into Applications</a><br>
            <a href="/private-modules/intro" >04 - Run Applications</a><br>
            <a href="/private-modules/ci-server-config" >05 - Run Jobs</a><br>
          </div>
              <div class="browsecolumn">
            <a href="/private-modules/docker-and-private-modules" >06 - Access Applications in a Cluster</a><br>
            <a href="/private-modules/intro" >07 - Monitor, Log, and Debug</a><br>
            <a href="/private-modules/ci-server-config" >08 - Access and Extend the Kubernetes API</a><br>
            <a href="/private-modules/docker-and-private-modules" >09 - TLS</a><br>
            <a href="/private-modules/intro" >10 - Administer a Cluster</a><br>
          </div>
              <div class="browsecolumn">
            <a href="/private-modules/ci-server-config" >11 - Federation - Run an App on Multiple Clusters</a><br>
            <a href="/private-modules/docker-and-private-modules" >12 - Manage Cluster Daemons</a><br>
            <a href="/private-modules/intro" >13 - Manage GPUs</a><br>
            <a href="/private-modules/ci-server-config" >14 - Manage HugePages</a><br>
            <a href="/private-modules/docker-and-private-modules" >15 - Extend kubectl with plugins</a><br>
          </div>
        </div>

</div>
<div class="browsesection">
        <div class="docstitle">
          <a href="#">Tutorials</a>
        </div>

        <div class="pages">
          <div class="browsecolumn">
            <a href="/troubleshooting/try-the-latest-stable-version-of-node" >01 - Kubernetes Basics</a><br>
            <a href="/troubleshooting/try-the-latest-stable-version-of-npm" >02 - Online Training Courses</a><br>
            <a href="/troubleshooting/if-your-npm-is-broken" >03 - Configuration</a><br>
          </div>
          <div class="browsecolumn">
            <a href="/troubleshooting/try-clearing-the-npm-cache" >04 - Object Management Using kubectl</a><br>

            <a href="/troubleshooting/common-errors" >05 - Stateless Applications</a><br>
            <a href="/troubleshooting/try-clearing-the-npm-cache" >06 - Stateful Applications</a><br>
          </div>
          <div class="browsecolumn">
            <a href="/troubleshooting/common-errors" >07 - Clusters</a><br>
            <a href="/troubleshooting/common-errors" >08 - Services</a><br>
          </div>
        </div>
</div>

<div class="browsesection">

        <div class="docstitle">
          <a href="#">Reference</a>
        </div>

        <div class="pages">
          <div class="browsecolumn">
            <a href="/misc/coding-style" >01 - Using the API</a><br>
            <a href="/misc/config" >02 - API Reference</a><br>
            <a href="/misc/developers" >03 - Federation API</a><br>
          </div>
              <div class="browsecolumn">
            <a href="/misc/disputes" >04 - kubectl CLI</a><br>
            <a href="/misc/orgs" >05 - Cloud Controller Manager</a><br>
            <a href="/misc/registry" >06 - Setup Tools</a><br>
          </div>
              <div class="browsecolumn">
            <a href="/misc/removing-npm" >07 - Config Reference</a><br>
            <a href="/misc/scope" >08 - Kubernetes Design Docs</a><br>
            <a href="/misc/scripts" >09 - Kubernetes Issues and Security</a><br>
          </div>
        </div>
    </div>
</div>
