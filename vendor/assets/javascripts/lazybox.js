(function($){
  var defaults = {overlay: true, esc: true, close: true, modal: true, opacity: 0.3, cancelText: 'Cancel', cancelClass: 'button', submitText: 'Ok', submitClass: 'button'}
  $.lazybox = function(html){ $.lazybox.show(html) }
  $.extend($.lazybox, {
    settings: $.extend({}, defaults),
    show: function(content, options){
            init(options)
            $('#lazybox_body').html(content)
            $.lazybox.center()
            $('#lazybox').fadeIn(300)
          },
    close: function(){
             $('#lazybox').fadeOut(300)
             $('#lazybox_overlay').fadeOut(500)
           },
    center: function(){
              var x = (($(window).height() - $('#lazybox').outerHeight()) / 2) + $(window).scrollTop()
              $('#lazybox').css({ top: ((x < 0) ? 20 : x), left:(($(window).width() - $('#lazybox').outerWidth()) / 2) + $(window).scrollLeft() })
            },
    confirm: function(element){
               var options = $.extend(defaults, $.lazybox.settings)
               var message = element.data('confirm')
               if (!message) { return true }
               $.lazybox.show('<p>'+message+'</p><div class="lazy_buttons"><div>', {klass: 'confirm'})
               element.clone().attr({class: options.submitClass}).removeAttr('data-confirm').text(options.submitText).appendTo('.lazy_buttons')
               $('.lazy_buttons').append(' ')
               $('<a>', {href: '', text: options.cancelText, class: options.cancelClass}).appendTo('.lazy_buttons')
             }
  });
  $.fn.lazybox = function(options){
    var imagesRegexp = new RegExp('\\.(png|jpg|jpeg|gif)(\\?.*)?$', 'i')
    this.live('click', function(e){
      var href = $(this).attr('href')
      e.preventDefault()
      if (href.match(imagesRegexp)){
        var img = new Image()
        img.onload = function(){ $.lazybox.show('<img src="' + img.src + '" />', options) }
        img.src = href
      } else{
        $.ajax({
          url: href,
          success: function(data){ $.lazybox.show(data, options) },
          error: function(){ $.lazybox.close() }
        })
      }
    });
  }

  function init(options){
    var options = $.extend($.extend({}, defaults), $.lazybox.settings, options)
    $('body:not(:has(#lazybox))').append("<div id='lazybox'><div id='lazybox_body'></div></div>")
    if (options.overlay) {
      $('body:not(:has(#lazybox_overlay))').append("<div id='lazybox_overlay'></div>")
      $('#lazybox_overlay').css({filter: 'alpha(opacity='+options.opacity*100+')', opacity: options.opacity})
      $('#lazybox_overlay').fadeIn(500)
    }
    if (options.klass) { $('#lazybox').removeClass().addClass(options.klass) } else { $('#lazybox').removeClass() }
    if (options.close) {
      $('#lazybox:not(:has(#lazybox_close))').prepend($("<a id='lazybox_close' title='close'>×</a>"))
      $('#lazybox_close').live('click', function(){ $.lazybox.close() })
      if ($.browser.msie) $('#lazybox_close').addClass('ie')
    } else $('#lazybox_close').remove()
    if (!options.modal) { $('#lazybox_overlay').bind('click', function(){ $.lazybox.close() }) } else { $('#lazybox_overlay').unbind() }
    if (!options.modal && options.overlay) { $('#lazybox_overlay').bind('click', function(){ $.lazybox.close() }) } else { $('#lazybox_overlay').unbind() }
    $(document).keyup(function(e) { if (e.keyCode == 27 && options.esc) $.lazybox.close() })
    $('#lazybox_body .lazy_buttons a').live('click', function(e){ $.lazybox.close(); e.preventDefault() })
  }

  $(document).bind('close.lazybox', function(){ $.lazybox.close() })
  $(document).bind('center.lazybox', function(){ $.lazybox.center() })
})(jQuery);
