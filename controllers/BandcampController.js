var controller = new BaseController();

controller.init({
  playpause: ".playbutton", 
  playnext: ".nextbutton", 
  playprev: ".prevbutton"
});

controller.attach_listener(controller);