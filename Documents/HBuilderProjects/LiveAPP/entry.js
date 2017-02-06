require("./src/css/mui.css");
require("./src/css/live.less");
require("./src/css/liveList.less");
require("./src/css/liveInfo.less");
require("./src/css/commentPage.less");
require("./src/css/allPage.less");
require("./src/css/sortPage.less");
require("./src/css/createPage.less");
require("./src/css/myInfoPage.less");
require("./src/css/CanvansUtils.less");
require("./src/css/selectIconPage.less");
require("./src/css/subscriberLivePage.less");
require("./src/components/swiper/swiper.min.css");
require("./src/css/m-input.less");
require("./src/components/m-input")();
require("./src/js/main")();

require("./src/components/wilddog");
wilddog.initializeApp({
	syncURL:"https://zhlive.wilddogio.com"
});

document.write(require("./src/public/live.html"));