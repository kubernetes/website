---
layout: docwithnav
title: Contributing to the Kubernetes Documentation
---

<!-- BEGIN: Gotta keep this section JS/HTML because it swaps out content dynamically -->
<p>&nbsp;</p>
<script language="JavaScript">
var forwarding=window.location.hash.replace("#","");
$( document ).ready(function() {
    if(forwarding) {
        $("#generalInstructions").hide();
        $("#continueEdit").show();
        $("#continueEditButton").text("Edit " + forwarding);
        $("#continueEditButton").attr("href", "https://github.com/kubernetes/kubernetes.github.io/edit/master/" + forwarding)
        $("#viewOnGithubButton").text("View " + forwarding + " on GitHub");
        $("#viewOnGithubButton").attr("href", "https://git.k8s.io/kubernetes.github.io/" + forwarding)
    } else {
        $("#generalInstructions").show();
        $("#continueEdit").hide();
    }
});
</script>
<div id="continueEdit">

<h2>Continue your edit</h2>

<p><b>To make changes to the document, do the following:</b></p>

<ol>
<li>Click the button below to edit the page you were just on.</li>
<li>Click <b>Commit Changes</b> at the bottom of the screen to create a copy of our site in your GitHub account called a <i>fork</i>.</li>
<li>You can make other changes in your fork after it is created, if you want.</li>
<li>On the index page, click <b>New Pull Request</b> to let us know about it.</li>
</ol>

<p><a id="continueEditButton" class="button"></a></p>
<p><a id="viewOnGithubButton" class="button"></a></p>

</div>
<div id="generalInstructions">

<h2>Edit our site in the cloud</h2>

<p>Click the button below to visit the repo for our site. You can then click the <b>Fork</b> button in the upper-right area of the screen to create a copy of our site in your GitHub account called a <i>fork</i>. Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click <b>New Pull Request</b> to let us know about it.</p>

<p><a class="button" href="https://github.com/kubernetes/kubernetes.github.io/">Browse this site's source code</a></p>

</div>
<!-- END: Dynamic section -->

<br/>

For more information about contributing to the Kubernetes documentation, see:

* [Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/)
* [Writing a New Topic](/docs/home/contribute/write-new-topic/)
* [Staging Your Documentation Changes](/docs/home/contribute/stage-documentation-changes/)
* [Using Page Templates](/docs/home/contribute/page-templates/)
* [Documentation Style Guide](/docs/home/contribute/style-guide/)
