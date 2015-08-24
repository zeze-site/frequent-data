# frequent-data

用于在本地进行一些常用数据的记录和导出

## 记录

数据，是以数组形式（方便排序）进行记录的，数组内是一个个的对象(MUST)，用来描述`常用数据`。

`常用数据` 本身的结构，可以自定义，

本工具对`常用数据`的数据结构有以下依赖: 

+ 要求`常用数据`对象里面，没有`count`字段。这个字段会在存储的时候，由本工具自行生成和维护。在输出的数据里面也会存在。主要用于统计数据的使用频率和排序。
+ 要求`常用数据`对象里面，必须有`id`字段，作为该数据的唯一身份标识

使用的时候，需要手动的通过`log`方法来表明某个数据被使用了一次

使用方法：

``` javascript

var FrequentData = require('frequent-data'),
    frequentData = new FrequentData({
        maxShowNum: 10,
        maxCacheNum: 1000,
        localKey: 'the-key-to-store-and-get-data'
    });

frequentData.log({
    name: 'Jim',
    age: 18,
    gender: 0
});

```

## 输出

输出的时候，是以数组的形式输出已经排序好的数据。

使用方法：

``` javascript
var FrequentData = require('frequent-data'),
    frequentData = new FrequentData({
        maxShowNum: 10,
        maxCacheNum: 1000,
        localKey: 'the-key-to-store-and-get-data'
    });

frequentData.out(function(data){
    // data.data 是需要的数据  
});

// 可以自定义frequent._outMaker来自定义数据的数据的结构
```


## To Do

+ 使得`count`字段可以配置字段名，在输出的时候，不输出
+ 使得`id`字段可以配置字段名

