// 定义一个函数,可以得到指定范围的随机整数
function getRandom(min,max){
    return Math.floor( Math.random()*(max-min+1) + min );
}

// 定义一个Game的构造函数
function Game( options ){
    // 调用初始化方法
    this.init( options );

    // 数据数组
    this.dataArr = [];

    // 比对数组  用于保存点击以后两个block对象
    this.judgeArr = [];

    // 延时器标识符
    this.timer = null;
}

// 初始化方法
Game.prototype.init = function( options ){
    this.initData( options );
    this.render();
    this.handler();
}

// 初始化数据方法,专用于给各个属性赋值
Game.prototype.initData = function( options ){
    // 游戏区域dom元素
    this.el = options.el;
    // 难度等级
    this.level = options.level;
    // 根据难度等级计算出总块数
    // 难度等级分为3个  我们可以根据难度等级生成对应的块数
    // 难度1: 2 X 2  =  4
    // 难度2: 4 X 4  = 16
    // 难度3: 6 X 6  = 36
    // Math.pow( level*2 , 2)
    this.blocks = Math.pow( this.level*2 , 2);

    // 通过this.getRandomArr得到随机数组
    this.dataArr = this.getRandomArr();
}

// 渲染页面方法
Game.prototype.render = function(){
    // 根据不同游戏难度级别,动态生成相应个数的块数添加到game游戏区域中

    // 每个块的宽度
    var oBlockWidth = this.el.offsetWidth / (this.level*2) - 4;
    // 每个块的高度
    var oBlockHeight = this.el.offsetHeight / (this.level*2) - 4;

    for(var i = 0 ; i < this.blocks; i++ ){
        // 创建一个oBlock对象
        var oBlock = document.createElement("div");
        oBlock.className = "block";
        // 设置宽度
        oBlock.style.width = oBlockWidth + "px";

        // 设置高度
        oBlock.style.height = oBlockHeight + "px";

        // 设置自定义属性
        oBlock.setAttribute("data-index" , this.dataArr[i] );

        // 创建一个oPic对象
        var oPic = document.createElement("img");
        oPic.className = "pic";
        oPic.src = "images/"+this.dataArr[i]+".png";

        // 把oPic追加到oBlock中
        oBlock.appendChild( oPic );
        
        // 把oBloc追加到game区域中
        this.el.appendChild( oBlock );
    }
}

// 生成随机数组的函数
Game.prototype.getRandomArr = function(){
    // 得到图片路径数组
    var arr = this.getPicsArr();

    // 求出多少对图片
    var halfBlocks = this.blocks/2;
    
    // 创建一个新数组
    var newArr = [];
    for(var i = 0; i < halfBlocks; i++ ){// 生成对应对数图片路径
        newArr.push( arr[i], arr[i] );
    }

    // 返回打乱后的数组
    return this.shuffle( newArr );
}

// 根据已有图片,生成对应的图片路径数组 也就是生成包含1~20之间数字的数组
Game.prototype.getPicsArr = function(){
    // 定义空数组
    var arr = [];

    // 把1~20数字放进数组中
    for( var i = 1 ; i <= 20; i++ ){
        arr.push( i );
    }

    // 打乱数组
    return this.shuffle( arr );
}

// 随机排序数组方法  打乱,洗牌
Game.prototype.shuffle = function( arr ){
    // sort的回调函数需要返回正数或者负数或者0其中一个数
    return arr.sort(function( ){
        return Math.random()-0.5;
    })
}

// 事件处理处理方法
Game.prototype.handler = function(){
    // 缓存this
    var self = this;

    // 使用事件委托给游戏区域绑定点击事件
    this.el.onclick = function( e ){
        // 防抖处理
        clearTimeout( self.timer );
        self.timer = setTimeout(function(){
            if( e.target.className == "block" ){
                // 添加on类名,有on类名以后,图片就可以显示出来
                e.target.classList.add("on");
    
                // 把点击以后的当前dom放进judgeArr数组中
                var judegArrLength = self.judgeArr.push( e.target );
    
                if( judegArrLength == 2 ){
                    // 当我们点了两次block块以后,我们就需要比对这两个是否相同
                    if( self.judegArrFun( self.judgeArr ) ){
                        // 如果相同,保留,不翻回去
                        self.judgeArr[0].classList.add("done");
                        self.judgeArr[1].classList.add("done");
    
                        // 清空比对数组
                        self.judgeArr = [];
                    }else{
                        // 延时器
                        setTimeout(function(){
                            // 如果不相同,两个都翻回去
                            self.judgeArr[0].classList.remove("on");
                            self.judgeArr[1].classList.remove("on");
                            
                            // 清空比对数组
                            self.judgeArr = [];
                        },500)
                    }
                }
            }
        }, 300 )

    }
}

// 比对函数
Game.prototype.judegArrFun = function( arr ){
    var dom1 = arr[0];
    var dom2 = arr[1];
    
    // 判断两个dom元素中的自定义数组是否相同
    var isSome = dom1.getAttribute("data-index") == dom2.getAttribute("data-index");
    
    // 返回结果
    return isSome;
}

// 实例化Game对象
var game = new Game({
    // 游戏区域的dom对象
    el : document.querySelector(".game"),
    level : 2,
});

console.log( game );