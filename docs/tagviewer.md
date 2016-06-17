---
---
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

    dropDown.push("<select id='tagsMenu' onChange='updateSelectedTag()'>")
    Object.keys(tagEntries).forEach(function (key) {
      selectedString = (key==tag) ? " selected" : "";
      dropDown.push("<option" + selectedString + ">" + key + "</option>")
    });
    dropDown.push("<select id='tagsMenu'>")
    document.getElementById("tags").innerHTML = dropDown.join("");

    if (typeof tagEntries[tag] != 'undefined') {
      if (tagEntries[tag].topics.length > 0) {
        result.push("<table><thead><tr><th>Topic</th><th>Section</th></thead><tbody>")
        for (i=0;i<tagEntries[tag].topics.length;i++) {
          result.push("<tr><td><a href='" + tagEntries[tag].topics[i] + "'>" + topics[tagEntries[tag].topics[i]].title + "</a></td><td>" + topics[tagEntries[tag].topics[i]].section + "</td></tr>")
        }
        result.push("</tbody></table>")
      }
      $("#topicList").html(result.join(""));
      $("#currentTag").text(tag);
    }
}

function mainLogic()
{
  var tag=window.location.hash.replace("#","");
  if(tag) {
    populateTaggedTopicsTable(tag);
  }
}

$( document ).ready(function() {
  populateArrays();
});
</script>

## Browsing topics tagged: <span id="currentTag"/>

Select a tag to filter topic list: <span id="tags" />

<div id="topicList" />
