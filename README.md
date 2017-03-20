# Nearsightedness - Demo Experience
 
This small art-piece gives some perspective on human nature.  
Once you begin, select the words to reveal a surprise.

 -- **[Click To Play](https://pehrlich.github.io/nearsightedness-demo/)** --

 
 
## Technical Notes
 
This project is a bit more than your standard cursor demo.  In it, I wanted to experiment with
a few THREE.js tools I've never used before.  Notably, the Bokeh shader for a blur affect, and
Render To Texture to create a simple magnifying glass.
 
I have also drawn architectural inspiration from AngularJS, in breaking down all the JS
app in facets of "directives" for nouns, and "controllers" for verbs.  This has allowed a technically
complex experience to be managed without an overwhelming display of code.
  
There's a lot of code here, so I may point out a few places which are particularly interesting:
 - **directives/SphericalCursor.js** Besides the standard cursor raycasting behavior, this app called 
   for a bubbling event system, similar to the DOM, to allow clicking on any part of the
   magnifying glass.  That is handled inside SphericalCursor, but ideally would be moved to allow
   easy application on any THREE.js object group.
 - **directive/Magnifier.js** This manages a magnifying glass object which is connected to the app
   as a standard object.  It is accomplished with a second camera in the scene, attached to the cursor, 
   which carries a 2x zoom.  If continuing this project, it might be fun to explore advanced ray-tracing
   to create brilliant lens-effects as the magnifier rotates waiting to be used :-)
 - **controllers/TextCtrl.js**.  This handles the interactions with the text blocks.  This includes
   an animation framework for mesh and material properties.
 - **controllers/GrabCtrl.js**.  This simple controller handles the animation, hover, and picking up 
   of the magnifying glass.
 - **index.html** This holds the initial scene setup, and manages the renderer and affects composer
   for the bokeh shader.  The PointerLock has been moved out to directives, but more remains in this
   file to be modularized.
       


### Up Next

_Loose ends_ - there some pieces of polish which have been omitted due to time constraints:
 - There are no tests, sadly.  Ideally each controller and each directive would have its own.
 - The Pointer Lock management is not ideal.  It would be better if the cursor would't move outside
   of the edges of the camera FoV, and if when "clicking to begin", the 3d cursor appeared directly
   beneath the 2d one.
 - The pointer management should be improved when outside of the FoV.  For high cursor speeds, the cursor
   can get lost anyone on the sphere.  Instead, movement should be constrained to within the camera frustum,
   and when the cursor it outside of the frustum, the cursor object should find the closest possible point
   to the cursor hidden location.
 - After letters have been clicked on, it is still possible to click on them again and replay the animation. 
   This should be disabled.
 - When hovering over the final text with the magnifier, some of it will be self-shadowed by the magnifier camera.
 - Because we're casting a single ray from the cursor for the magnifying glass, it becomes a bit tricky to click on 
   objects.  It would be better if was cast a few different rays at very slight angles, or do some other cone-intersection-detection.

_Roadmap_:     
 - It would be nice to be able to put down the magnifying glass with a click, to make a less constrained feel
 - Other tools could be grabbed, such as a "look around" control
 - An exploration in Physically-based rendering could be really fun
 
 
Quote Attribution: http://quoteinvestigator.com/2011/02/09/darwinism-hope-pray/ 