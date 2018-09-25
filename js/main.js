// import '../css/reset.css'
// import '../css/main.scss';
// import '../css/nav.scss';
// import './flexible';
// import {shop} from '../../config/shop.config.js';
// import './nav.js';


(function () {
    popup();
    closePop();
    selectMode();
    openSwitchMode();
    closeSwitchMode();
    
})();

function popup() {
    let ele = document.querySelector('.wrapper');
    let popup = document.querySelector('.popup');
    //点击店铺
    ele.addEventListener('click', function (e) {
        let node = _getNode(e.target, 'shop', 'wrapper');
        popInner(node)
        // e.preventDefault()
        //显示弹窗
        popup.classList.remove('hide');
        // 弹窗居中位置位置
        let left = node.offsetLeft  - popup.offsetWidth / 2 + node.offsetWidth / 2;
        // 弹窗顶部位置位置
        let top = node.offsetTop + node.offsetHeight;
        // 窗口左侧极限位置
        if (left < 0) {
            left = 0;
        }
        // 窗口右侧极限位置
        if (left + popup.offsetWidth > document.body.clientWidth) {
            left = document.body.clientWidth - popup.offsetWidth;
        }
        // 设置弹窗位置
        _css(popup, {"top": `${top}px`, "left": `${left}px`});
    }, false);

}

//关闭弹窗
function closePop() {
    let close = document.querySelector('.popup__close');
    let popup = document.querySelector('.popup');
    let ctn = document.querySelector('.container');
    close.addEventListener('click', function (e) {
        popup.classList.add('hide');
    }, false);
    ctn.addEventListener('click', function (e) {
        if(e.target.className === 'container') {
            popup.classList.add('hide');
        }
    }, false);
}

//返回目标节点，用于事件代理，使目标节点不受子节点影响
function _getNode(node, target, parent) {
    if (node.classList[0].toLowerCase() === parent) {
        return;   
    }
    if(node.classList[0].toLowerCase() === target) {
        return node;
    } else {
        return _getNode(node.parentNode, target, parent);
    }
}

/**
 * 改变元素的style属性
 * 调用方式:_css($el, {"font-size": ..., "background": ...})；
 * @param {dom对象} element
 * @param {样式对象} styles 
 */
function _css(element, styles) {
    for (let i in styles) {
      element.style[i] = styles[i];
    }
}
/**
 * 
 * @param {店铺dom节点} node 
 */
function popInner(node) {
    let coupon = document.querySelector('.popup__coupon');
    let QR = document.querySelector('.popup__QR--bg .QR img');
    // let popTitle = document.querySelector('.popup__shop__title');
    let pic = document.querySelector('.popup__pic img');
    
    let details = document.querySelector('.popup__shop');
    //商店招牌
    let title = node.querySelector('.shop__title').innerHTML;
    
    // 返回的店铺数据
    let result = shop.filter(ele => ele.title === title)[0];
    // 店铺详情
    details.innerHTML = `
    <div class="popup__shop__title">${result.title}</div>
    <div class="popup__shop__price"><span>￥${result.price}</span>/人</div>
    <div class="popup__shop__call"><i></i>${result.call}</div>
    <div class="popup__shop__time"><i></i>${result.time}营业</div>
    <div class="popup__shop__address"><i></i>${result.address}</div>
    `;
    //店铺图片
    pic.setAttribute('src', result.shopImg);
    //二维码
    QR.setAttribute('src', result.QR);
    console.log(result)
    //优惠券
    coupon.innerHTML = `
    <div class="popup__coupon__price"><span>${result.coupon[0].price}</span>￥</div>
    <div class="popup__coupon__dec">
        <div class="popup__coupon__condition">满${result.coupon[0].condition}元可用</div>
        <div class="popup__coupon__term">有效期至${result.coupon[0].term}</div>
    </div>
    `;
    _showMore(result);
}
//查看更多
function _showMore(data) {
    let more = document.querySelector('.popup__more');
    let nav = document.querySelector('.nav');
    let lock = document.querySelector('.nav .nav__lock');

    more.addEventListener('click', function () {
        nav.classList.add('show-1');
        nav.classList.add('show-2');
        lock.classList.add('close');
        _renderDetails(data);
    }, false);
}

//商铺详情数据渲染
function _renderDetails(data) {
    let detail = document.querySelector('.nav__detail');
    let trade = document.querySelectorAll('.trade__list');
    // 店铺名称
    detail.querySelector('.open__name').innerHTML = data.title;
    // 店铺图片
    detail.querySelector('.detail__img').style.backgroundImage = `url(${data.shopImg})`;
    // 营业时间
    detail.querySelector('.intro__text').innerHTML = data.time;
    // 联系方式
    detail.querySelector('.phone__text').innerHTML = data.call;
    // 店铺地址
    detail.querySelector('.address__text').innerHTML = data.address;
    // 店铺地图
    detail.querySelector('.detail__map').style.backgroundImage = `url(${data.map})`;
    detail.querySelector('.code__img').style.backgroundImage = `url(${data.QR})`;

    _opneList(data)
    
}

// 展开列表
function _opneList(data) {
    let trade = document.querySelectorAll('.trade__list');
    let wrap = trade[data.type - 1].querySelector('.list__wrap');
    let group = trade[data.type - 1].querySelector('.list__group');
    let height = group.offsetHeight + wrap.offsetHeight;
    let child = document.querySelectorAll('.list__group__child');

    for (let i = 0; i < child.length; i++) {
        child[i].classList.remove('relevant');
    }

    for (let i = 0; i < trade.length; i++) {
        trade[i].querySelector('.list__wrap').classList.remove('selected');
        trade[i].querySelector('.list__icon').classList.remove('active');
        trade[i].style.height = ``;
        trade[i].classList.remove('selected');
    }
    wrap.classList.add('selected');
    wrap.querySelector('.list__icon').classList.add('active');

    group.querySelectorAll('.list__group__child')[data.subType - 1].classList.add('relevant');
    trade[data.type - 1].style.height = `${height}px`;
    trade[data.type - 1].classList.add('selected');
}

// 打开选择模式弹窗
function openSwitchMode() {
    let mode = document.querySelector('.switch-mode');
    let pop = document.querySelector('.switch-mode__pop');
    mode.addEventListener('click', function (e) {
        pop.classList.remove('hide');
    }, false);
}
// 关闭选择模式弹窗
function closeSwitchMode() {
    let pop = document.querySelector('.switch-mode__pop');

    let oldChengdu = document.querySelector('.switch-mode__pop__old-Chengdu');
    let product = document.querySelector('.switch-mode__pop__product');
    pop.addEventListener('click', function (e) {
        if(e.target.className === 'switch-mode__button--close' || e.target.className ==='switch-mode__pop') {
            oldChengdu.querySelector('.switch-mode__pop__old-Chengdu__button').classList.add('active');
            product.querySelector('.switch-mode__pop__product__button').classList.remove('active');
            pop.classList.add('hide');
        }
    }, false);
}
function selectMode() {
    let product = document.querySelector('.switch-mode__pop__product');
    let oldChengdu = document.querySelector('.switch-mode__pop__old-Chengdu');
    product.addEventListener('click', function (e) {
        oldChengdu.querySelector('.switch-mode__pop__old-Chengdu__button').classList.remove('active');
        product.querySelector('.switch-mode__pop__product__button').classList.add('active');
    }, false);
    oldChengdu.addEventListener('click', function (e) {
        product.querySelector('.switch-mode__pop__product__button').classList.remove('active');
        oldChengdu.querySelector('.switch-mode__pop__old-Chengdu__button').classList.add('active');
    }, false);
    _getMode();
}

function _getMode() {
    let get = document.querySelector('.switch-mode__button--get');
    let pop = document.querySelector('.switch-mode__pop');
    get.addEventListener('click', function (e) {
        pop.classList.add('hide');
    }, false);
}

