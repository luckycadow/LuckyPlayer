##LuckyPlayer is a super light jQuery slideshow and lightbox.


Implementation requires an unordered list of images (the thumbnails) inside an 
anchor tag that links to the full size image.
```html
<ul class="luckyplayer">
   <li>
      <a href="http://path.to/full/size.jpg">
         <img src="http://path.to/thumbnail.jpg"/>
      </a>
   </li>
</ul>
```

There are only a few options and they should be passed as an object. The option 
```auto``` sets the interval (in ms) at which images will be advanced when the player is 
active. The ```loop``` option sets whether or not to start over at the first image when 
the end of the list is reached. The final option is likely to be the one you need 
to use. The ```images``` option sets the path to the images rquired by Luckyplayer. It 
defaults to ```/assets/images/luckyplayer/``` but this should be changed to wherever 
you have placed the images on your server. Note that the trailing slash is required.

```javascript
$("ul.luckyplayer").luckyplayer({
    auto: 3000, // 3 second interval
    loop: false, // disable advancing once the end of the list is reached
    images: '/images/luckyplayer/' // path to wherever you put the images
});
```

That's it, just remember to load jQuery before this script.
