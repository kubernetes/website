---
layout: docwithnav
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
    } else {
        $("#generalInstructions").show();
    	$("#continueEdit").hide();
    }
});
</script>
<div id="continueEdit">

<h2>Continue your edit</h2>

<p>Click the below link to edit the page you were just on. When you are done, press "Commit Changes" at the bottom of the screen. This will create a copy of our site on your GitHub account called a "fork." You can make other changes in your fork after it is created, if you want. When you are ready to send us all your changes, go to the index page for your fork and click "New Pull Request" to let us know about it.</p>

<p><a id="continueEditButton" class="button"></a></p>

</div>
<div id="generalInstructions">

<h2>Edit our site in the cloud</h2>

<p>Click the below button to visit the repo for our site. You can then click the "Fork" button in the upper-right area of the screen to create a copy of our site on your GitHub account called a "fork." Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click "New Pull Request" to let us know about it.</p>

<p><a class="button" href="https://github.com/kubernetes/kubernetes.github.io/">Browse this site's source code</a></p>

</div>
<!-- END: Dynamic section -->


{% include_relative README.md %}
