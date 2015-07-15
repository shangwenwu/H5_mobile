jxjr-h5
====

## 技术方案：
* 纯前端方案，与pc端同步，使用fis-pure（注：如果以后加入模板，可使用jello，支持velocity和jsp）
  * 全部使用less，以提高开发效率（fis-pure自带less插件）（举例）
  * 直接使用underscore的tmpl模板，不用js进行转化（举例）
  * 可以使用require.async（举例）
  * 使用FIS进行css sprites整合

* H5方面
  * 多使用H5的标签（如article、section等）
  * 添加H5端的重置样式normalize.css

* 结构方面
  * 两个工程下面的index.html进行调整
  * 不要api.js和rewrite.js，分派到各个模块中进行管理即可
  * 一些带有命名空间的库放入asserts中

* 规范：
  * CSS的类使用下划线
  * 如果使用某一个类作为js挂钩，加入前缀j-
  * 全局样式使用g-开头
  * html和js的规范同pc端

* 测试机器：
  * 经测试同学分析，需要让测试同学进行统计，目前主要是这样6款
    * iphone
    * 三星
    * 小米
    * 华为
    * HTC
    * 魅族

## 接口调用说明：

#### dialog组件（ui-dialog文件夹），赋予J.Common命名空间下，具体用法如下——
类型一：一定需要让用户做出选择的，就提供选择的按钮，这样至少两个按钮

```javascript
J.Common.confirm({
    content: '确定支付吗？',
    onSureCallback: function(){},
    onCancelCallback: function(){},
    okValue: '确定'
});
```

类型二：强烈提示用户的，除了文案说明以外，提供一个按钮，一个关闭的叉子，不提供浮层其他区域取消浮层的功能。

```javascript
J.Common.confirmStrongly({
    content: '确定支付吗？',
    onSureCallback: function(){},
    okValue: '确定'
});
```

类型三：如果需要引导用户必须触发一个操作行为，那就提供一个按钮，不提供叉子关闭功能，但是提供点击浮层其他区域取消浮层的功能。

```javascript
J.Common.alert({
    content: '我是内容',
    onSureCallback: function(){},
    okValue: '支付成功'
});
```

#### 提示组件（ui-tip文件夹），赋予J.Common命名空间下，具体用法如下——

类型一：普通提示

```javascript
J.Common.tip({
    content: '普通提示',
    autoHide: true,
    onShow: function() {
        // 当提示显示的时候执行的方法
        console.log('xxxxxx');
    }
});
```

类型一：成功提示

```javascript
J.Common.tip({
    type: 'success',
    content: '充值成功',
    autoHide: true,
    onShow: function() {
        console.log('xxxxxx');
    }
});
```

类型一：失败提示

```javascript
J.Common.tip({
    type: 'fail',
    content: '充值失败',
    autoHide: true,
    onShow: function() {
        console.log('xxxxxx');
    }
});
```

### 成功页组件 （succeed 文件夹），赋予J.Common命名空间下，具体用法如下——

> J.Common.succeed 方法参数说明：

  字段 | 描述 | 选项 | 备注
  ----|----|----
  id | 插入到的Dom | 必填 | 无
  title | 主提示语 | 必填 | 无
  description | 文本描述 | 可选 | 无
  butOption | 操作按钮组 | 可选 | Array长度最长为2

> 用法：

```javascript
J.Common.succeed({
    id:'box2',
    title:'您的账号已注册成功',
    description:'在您进行投资前，需要开通第三方资金托管账户，以保证您的资金安全。',
    butOption:[
        {
          text:'去开通',
          event:function(){
            Router.navigate('trusteeship');
          }
        },{
          text:'稍候再说',
          event:function(){
             Router.navigate('home');
          }
        }
    ]
});
```