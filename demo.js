/*
 * @name 仿ios手机通讯录 - javascript实现
 * @anthor by wilson wang
 * @params { object } config: {
 *	                    id: 应用该插件的id
 *                      nav: 侧边栏id(可选的), 不填的话，不绑定侧边栏
 *                    }
 * @dom <div class="all-city-list" id="inlind-city">
 *        <div class="contacts-header"></div>
 *				<ul class="contacts-content">
 *					<li class="contacts-group">
 *						<div class="contacts-group-title"></div>
 *						<div class="contacts-group-item">
 *							<div class="city-item"></div>
 *						</div>
 *					</li>
 *				</ul>
 *      </div>
 */
function Contact (config) {
	if(!(this instanceof Contact)) return new Contact(config);

	this.id = config.id
	this.navId = config.nav
	this.data = []
	this.initDomData()
}

Contact.prototype.initDomData = function () {
	this.el = document.querySelector(this.id)
	this.staticHeader = this.el.querySelector('.contacts-header')
	this.group = this.el.querySelectorAll('.contacts-group') || []
	this.groupTitle = this.el.querySelectorAll('.contacts-group-title') || []
	this.nav = this.navId ? document.querySelector(this.navId) : ''

	for (var i = 0, len = this.group.length; i < len; i++) {
		this.data.push({
			'headerText': this.groupTitle[i].innerText,
			'headerHeight': this.groupTitle[i].offsetHeight,
			'list': this.group[i],
			'listHeight': this.group[i].offsetHeight,
			'listOffset': this.group[i].offsetTop,
			'listBottom': this.group[i].offsetHeight + this.group[i].offsetTop
		})
	}

	if (this.data[0]) {
		this.staticHeader.innerText = this.data[0].headerText
	}

	if (this.data.length) {
		// 给当前页面能监听滚动的dom监听事件
		if (!document.body.onscroll) {
			document.body.addEventListener('scroll', this.bindScroll.bind(this))
		}
	}

	if (this.nav) {
		this.slideBar()
	}
}

Contact.prototype.bindScroll = function (e) {
	e.stopPropagation()
	this.scroll(document.body.scrollTop)
}

Contact.prototype.scroll = function (currentTop) {
	var data = this.data
	var currentTop = currentTop + data[0].listOffset
	var currentElement 

	if (currentTop < 0) {
		return 
	}

	// 先找到当前滚动到哪个元素范围内
	for (var i = 0; i < data.length; i ++) {
		if (currentTop >= data[i].listOffset && currentTop <= data[i].listBottom) {
			// 当前滚动到的元素
			currentElement = data[i]
			break;
		}
	}

	// 拿到当前滚动到的元素，进行碰撞检测
	if (currentTop >= (currentElement.listBottom - currentElement.headerHeight)) {
		this.staticHeader.className = 'contacts-header isHidden'
		currentElement.list.className = 'contacts-group isAnimated'
	} else {
		this.staticHeader.className = 'contacts-header'
		if (currentElement) {
			currentElement.list.className = 'contacts-group'
		}
	}

	// 替换假冒的标题
	if (currentElement) {
		this.staticHeader.innerText = currentElement.headerText
	}
}

Contact.prototype.slideBar = function () {
	var navList = this.nav
	navList.addEventListener('click', goToContact.bind(this))

	function goToContact (event) {
		var clickText = event.target.getAttribute('alt')
		var target
		for (var i = 0; i < this.data.length; i++) {

			if (this.data[i].headerText == clickText) {
				target = this.data[i]
				break
			}
		}
		var currentScrollTop = document.body.scrollTop
		var initHeight = this.data[0].listOffset
		var targetTop = target.listOffset - initHeight
		var step = Math.abs(currentScrollTop - targetTop) / 30

		// 动画相关
		function animate () {
			if (currentScrollTop > (targetTop + 5)) {
				currentScrollTop -= step
				document.body.scrollTop = currentScrollTop
			} else if (currentScrollTop < (targetTop - 5)) {
				currentScrollTop += step
				document.body.scrollTop = currentScrollTop
			} else {
				return false
			}

			setTimeout(animate, 17)
		}
		animate()
	}
}
