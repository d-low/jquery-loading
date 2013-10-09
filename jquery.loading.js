/**
 * @description Loading overlay plug-in used to place a loading graphic over 
 * over the specified elements.  This plug-in assumes there will be a file
 * named app/asseets/loading_large.gif available in the application.
 * @param options An optional object containing the following parameters:
 * @param options.z-index Use this z-index instead of our default z-index.
 */
(function( $ ) {

  var show = function(options) {
    return this.each(function() {
      var $el = $(this);

      // Don't reapply the plug-in to elements it has already been applied to.
      if ($el.data("loading")) {
        return;
      }

      var $loading = $('<div class="js-loading"></div>');

      var loadingHeight = 48;
      var elOffset = $el.offset();
      var elHeight = $el.outerHeight();
      var elWidth = $el.outerWidth();
      var windowHeight = $(window).height();
      var windowScrollTop = $(window).scrollTop();

      // Position the loading graphic in the center of the element we're hiding
      // with respect to the portion of the element show in the view port.  We 
      // can't just position the loading graphic in the center because our 
      // loading overlay may span below the fold of the view port, in which 
      // case we might accidentally display the loading graphic below the fold.

      var topPos = (windowScrollTop - elOffset.top + ((windowHeight - loadingHeight) / 2));

      // If the top position plus the height of our loading graphic is greater
      // than the height of the element, meaning out loading graphic would be 
      // displayed below the fold of the element; or the top position less than
      // zero then we just center our loading graphic.

      if (topPos + loadingHeight > elHeight || topPos < 0) {
        topPos = "center";
      }
      else { 
        topPos = topPos + "px";
      }
 
      $loading.css({
        // TODO: Use a data URL to make this portable and self contained!
        "background": "url(/assets/loading_large.gif) no-repeat scroll center " + topPos + " #ffffff",
        "display": "none",
        "height": elHeight + "px",
        "left": elOffset.left + "px",
        "top": elOffset.top + "px",
        "width": elWidth + "px",
        "opacity": "0.8",
        "padding": "0",
        "position": "absolute",
        "z-index": options && options["z-index"] ? options["z-index"] : 100000000
      })
      
      $("body").append($loading);
      $el.data("loading", $loading);
      $loading.fadeIn("fast");
    });
  };
  
  var hide = function(options) {
    return this.each(function() {
      var $el = $(this);
      var $loading = $el.data("loading");

      if ($loading && $loading.length) {
        $el.removeData("loading");

        $loading.fadeOut("fast", function() {
          $loading.remove();
        });
      }
    });
  };

  var methods = {
    "show": show,
    "hide": hide
  };

  $.fn.loading = function(method) {
    
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.show.apply(this, arguments);
    }
    else {
      $.error('Method ' + method + ' does not exist on jQuery.loading!');
    } 
  };

})( jQuery );
