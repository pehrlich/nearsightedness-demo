# Nearsightedness - Demo Experience
 
This small art-piece gives some perspective on human nature.  
Once you begin, select the words to reveal a surprise.
 
 
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
       
