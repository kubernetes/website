---
---
Welcome! We are very pleased you want to contribute to the docs for Kubernetes.

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

## Staging your changes in the cloud

If you want to see your changes staged without having to install anything locally,
change your fork of our repo to be named:

    YOUR_GITHUB_USERNAME.github.io

Then, visit: [http://YOUR_GITHUB_USERNAME.github.io](http://YOUR_GITHUB_USERNAME.github.io)

You should see a special-to-you version of the site. 

## Editing and staging the site locally

If you want to work offline, run the below commands to setup
your environment for running GitHub pages locally. Then, any edits you make will be viewable
on a lightweight webserver that runs on your local machine.

First install rvm

```text
\curl -sSL https://get.rvm.io | bash -s stable
```

Then load it into your environment

```shell
source /Users/(USERNAME)/.rvm/scripts/rvm (or whatever is prompted by the installer)
```

Then install Ruby 2.2 or higher

```shell
rvm install ruby-2.2.4
rvm use ruby-2.2.4 --default
```

Verify that this new version is running (optional)

```shell
which ruby
ruby -v
```

Install the GitHub Pages package, which includes Jekyll:

```shell
gem install github-pages
```

Clone our site

```shell
git clone https://github.com/kubernetes/kubernetes.github.io.git
```

Then, to see it run locally:

```shell
cd kubernetes.github.io
jekyll serve
```

Your copy of the site will then be viewable at: [http://0.0.0.0:4000](http://0.0.0.0:4000)
(or wherever Ruby tells you).

If you're a bit rusty with git/GitHub, you might wanna read
[this](http://readwrite.com/2013/10/02/github-for-beginners-part-2) for a refresher.

The above instructions work on Mac and Linux.
Windows users, follow [these instructions](https://martinbuberl.com/blog/setup-jekyll-on-windows-and-host-it-on-github-pages/). 

## Thank you!

Kubernetes thrives on community participation and we really appreciate your
contributions to our site and our documentation!
