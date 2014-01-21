var controller = new BaseController();

controller.init({
  playpause: "",
  playnext: "",
  playprev: ""
});

controller.attach_listener(controller);