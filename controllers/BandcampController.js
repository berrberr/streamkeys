var controller = new BaseController();

controller.init({
  playPause: ".playbutton", 
  playNext: ".nextbutton", 
  playPrev: ".prevbutton"
});

controller.attach_listener(controller);