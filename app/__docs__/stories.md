# OK, well, this sucks: Somehow lost a whole doc file?

- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit
- I shall always save
- I shall always git commit

OK, let's tryyyyy this again....


## Stories and Anthologies: Namespace

 Stories are the current development focus, but as we structure our data we should keep in mind that one of the ultimate goals of this project is to service the user story: the user wants to understand what happened in a story and how it connected to the next and previous stories. We need to shed light on how networked stories connect to each other. Therefore we need to separate our concerns appropriately.

 **Stories**

Stories are primarily composed of datums, rather than descriptions. This is both well-known good storytelling principle and important to explicitly state in a cultural context where most political narrative is rhetorically manufactured rather than communicated in the form of facts. The hope is that the benefits of collecting a cohesive record will include communication benefits that a more controlled, no-longer-tenable form of public relations would not yield.

The data, however, can itself be textual. In fact, the primary data for stories are social media atoms. For now, they are Tweets.

**Anthologies

The "anthology" scope comprises all of the stories collected within the database. The app itself is meant to help participants in inherently democratic events to richly and democratically anthologize, to help each other better understand the sprawl of such things and to help the world better appreciate its internal continuity. As such the primary data model can be elucidated:

{
  anthology: {
    stories: {
      [id]:  {
      				"id": Index,
      				"name": String,
      				"type": [type from list -> determines view],
      				"start_day_en": String: Month Day, Year,
      				"start_date": String: YYYY-MM-DD H:MMa/p,
      				"end_date": String: YYYY-MM-DD H:MMa/p,
      				"description": String,
      				"location": String,
              elements: [
                {Tweet}, {Tweet}, {Tweet}...
              ],
              chapters: [
                {
                  start_time: Moment,
                  end_time: Moment,
                  title: String
                 }
              ],

      }
    }
  }
}

**Sorting Primary Datums

Primary datums will often need to be sorted as part of parsing stories. This could include

* deliniating chronological periods or 'chapters' of a story
* delinating agenda items in a meeting

I think it makes sense for now to record such deliniations as an array of objects saved as 'chapters' in the story data.

## Additional datums

Additional datums derived from within stories will be used both to more usefully represent the datums that comprise each story and to connect the stories together. Datums could be organized in any number of ways.

Certain types of datums could be categorized as "highlights":
* Formal agreements, i.e. consensus is reached in a consensus process
* Success, as when a day of action meets one of its goals

Other types might be better viewed as "lowlights":
* Consensus is not reached in a process (though this isn't necessarily bad)
* Arrests
* A tactical goal is impeded
* An organizational failure occurs

Still others may be less about chronology and more about continuity. These may comprise a more meta form of story in and of themselves and may need a separate namespace. Such metastories could include:
* topics that recur and flow into each other (like race, class, what solidarity looks like)
* disputes that evolve over time
* ideas that form slowly or whose times come subsequent to their introduction

Though many of these data types can perhaps be algorithmically mapped, their interpretation requires human interaction. The question of who gets to interpret history is a fundamentally political one, and as such, the interaction between users and the data must be recognized as a matter not primarily of programmatic efficiency but of politics.

## Networked Democracy

The app assumes a simple and historically well-grounded principle: that people engaged in a decentralized and/or non-hierarchical activity are inalienably entitled to influence it, in proportion to their material investment in it. That applies both to the events this app seeks to catalogue, and to the app itself, which should remain squarely situated within that activity rather than above or outside of it. This app is an outward-facing node to which any participating member should ideally be able to connect on an internal basis in order to influence what it displays -- not by will, but by action.

Throughout the future development of Anthology, its capacity to provide democratic control to its participants should evolve until they are able to even directly -- and effectively -- influence its code.

In the meantime, the following goals should be achieved before any formal launch that includes user participation:
* The app should employ social network mapping to expand authorization based on existing users' parameters and specifications
* The app should provide a visual record of all changes made to either the primary or secondary datums and an option to facilitate disagreements about such changes
* The app should have a means for users to determine that another user is not acting in good faith and to temporarily or permanently disable some or all of their power to act
* The app should give users' actions as much immediate effect as possible while considering them all to be subject to revision based on other users' actions. (If acting provides stake, counter-acting does as well; participation in a process is needed to resolve conflict.)
* Some basic or default decision-negotiating process should be implemented that provides some level of both stability and democracy.

## The server

The server should essentially contain all of the datums.
Original primary datums should be stored in one collection.
When original datums are modified by user action, a version should be added to the document. They'll be placed in a 'versions' array under the original document.

On the server, stories' "elements" array will contain an array of IDs of elements; when the client requests them, the elements themselves will be placed in the array, with versions relevant to the story included. Each story view should only get the elements for its view.


-- note: using twitter and other third-party sources for datums confer certification of timing. should other types of submissions be blockchain-stamped?
