(function(){
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var menuOn = false;

	var btnMenu = document.querySelector("#btnMenu");
	
	btnMenu.addEventListener("click",btnMenuClickManager,false);
	
	var container = document.querySelector("#container");
	container.style.width = windowWidth + "px";
	container.style.height = windowHeight + "px";
	
	var menuContainer = document.querySelector("#menuContainer");
	menuContainer.style.width = windowWidth + "px";
	menuContainer.style.height = 0.95*windowHeight + "px";
	menuContainer.style.left = -(parseInt(menuContainer.style.width)) + "px";
	
	function btnMenuClickManager(){
		var width = parseInt(menuContainer.style.width);
		menuOn = !menuOn;
		menuContainer.style.left = menuOn ? 0 : - width + "px";
	}
}());
