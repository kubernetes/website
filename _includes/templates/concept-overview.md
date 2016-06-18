{% if concept %}<!-- check for this before going any further; if not present, skip to else at bottom -->

* TOC
{:toc}

{% if what_is %}

### {{ concept }} overview

{{ what_is }}

{% else %}

{% include templates/_errorthrower.md missing_block='what_is' heading='What is a (Concept)?' purpose='explains what this concept is and its purpose.' %}

{% endif %}


{% if when_to_use %}

### When to use {{ concept }}s

{{ when_to_use }}

{% else %}

{% include templates/_errorthrower.md missing_block='when_to_use' heading='When to use (Concept)' purpose='explains when to use this object.' %}

{% endif %}


{% if when_not_to_use %}

#### When not to use {{ concept }}s

{{ when_not_to_use }}

{% else %}

{% include templates/_errorthrower.md missing_block='when_not_to_use' heading='When not to use (Concept)' purpose='explains when not to use this object.' %}

{% endif %}


{% if usage %}

### Usage

{{ usage }}

{% else %}

{% include templates/_errorthrower.md missing_block='usage' heading='Usage' purpose='shows the most basic, common use case for this object, in the form of a code sample, command, etc, using tabs to show multiple approaches' %}

{% endif %}


<script language="JavaScript">

var tagEntries;
var topics;
var topicsReady = false;
var tagsReady = false;

function populateArrays()
{
  $.get("/tags.txt", function(data, status) {
    var lines = data.split("\n");
    var line;
    for(i=0;i<lines.length;i++) {
      if (lines[i].length > 0) {
        line = lines[i].split(",");
        if (typeof tagEntries == 'undefined') tagEntries = new Array();
        if (typeof tagEntries[line[0]] == 'undefined') tagEntries[line[0]] = new Array();
        if (typeof tagEntries[line[0]].topics == 'undefined') tagEntries[line[0]].topics = new Array();
        tagEntries[line[0]].topics.push(line[1]);
        //console.log(line[0] + " mapped to " + line[1]);
        // console.log(tagEntries[line[0]].topics)
      }
    }
    tagsReady = true;
    if (tagsReady && topicsReady) mainLogic()
  });

  $.get("/titles.txt", function(data, status) {
    var lines = data.split("\n");
    var line;
    for(i=0;i<lines.length;i++) {
      if (lines[i].length > 0) {
        line = lines[i].split(",");
        if (typeof topics == 'undefined') topics = new Array();
        if (typeof topics[line[0]] == 'undefined') topics[line[0]] = new Array();
        topics[line[0]].section = line[1];
        topics[line[0]].title = line[2];
        //console.log(line[0] + " mapped to " + line[1]);
      }
    }
    topicsReady = true;
    if (tagsReady && topicsReady) mainLogic()
  });
}

function updateSelectedTag() {
  window.location.href = "/docs/tagviewer/#" + $("#tags :selected").text();
  populateTaggedTopicsTable($("#tags :selected").text());
}

function populateTaggedTopicsTable(tag)
{
    var result = new Array();
    var dropDown = new Array();
    console.log("selected tag: " + tag);

    if (typeof tagEntries[tag] != 'undefined') {
      if (tagEntries[tag].topics.length > 0) {
        result.push("<ul>")
        for (i=0;i<tagEntries[tag].topics.length;i++) {
          if (topics[tagEntries[tag].topics[i]].section == "Tasks") {
              result.push("<li><a href='" + tagEntries[tag].topics[i] + "'>" + topics[tagEntries[tag].topics[i]].title + "</a></li>")
          }
        }
        result.push("</ul>")
      }
      $("#topicList").html(result.join(""));
      $("#currentTag").text(tag);
    }
}

function mainLogic()
{
  populateTaggedTopicsTable('{{ concept | downcase }}');
}

$( document ).ready(function() {
  populateArrays();
});
</script>

### Tasks

<div id="topicList" />


{% if status %}

### {{ concept }} status

{{ status }}

{% else %}

{% include templates/_errorthrower.md missing_block='status' heading='Retrieving status for a (Concept)' purpose='explains how to retrieve a status description for this object.' %}

{% endif %}

<!-- continuing the "if concept" if/then: -->

{% else %}

### ERROR: You must define a "concept" variable
{: style="color:red" }

This template requires a variable called `concept` that is simply the name of the
concept for which you are giving an overview. This will be displayed in the
headings for the document.

To get rid of this message and take advantage of this template, define `concept`:

```liquid
{% raw %}{% assign concept="Replication Controller" %}{% endraw %}
```

Complete this task, then we'll walk you through preparing the rest of the document.

{% endif %}

