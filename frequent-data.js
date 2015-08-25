/**
 * 常用表情/颜文字
 *
 * 需要实现以下功能：
 *
 * 按json格式存储到本地
 * 按使用次数降序排序
 * 保证常用表情的数量不超过最大限制
 */

define(function(require){
    var $ = require('jquery'),
        lcStorage = require('lcStorage');

    function FrequentData(conf){
        var me = this;
        var defaultConf = {



            /**
            * 默认的，会缓存maxCacheNum个表情记录
            * 但是展示的时候，会展示maxShowNum个
            *
            * 其中maxCacheNum 是一定大于 maxShowNum的
            * 这样的设定，是为了让原先用户使用的少，后面突然使用的多的表情能有展示的机会
            *
            * 因为 如果maxCacheNum等于maxShowNum的话
            * 那新表情的点击，因为次数为1，永远无法超过已有的记录
            * 也就无法被记录
            */
            maxShowNum : 66, // 最多能展示这么多表情

            /**
            * 最多能缓存这么多表情
            * 理论上应该缓存所有表情的记录，才能合理排序
            * 但是考虑客户端存储太多数据不好，所以还是设定一个极限值
            * 不过目前的表情数量是不会超过这个极限值的
            */
            maxCacheNum : 1000, 

            localKey : 'zeze-frequent-smile-log',
            localDomain : 'http://'+location.host,

            groupData : [], // 缓存本地数据
    
        };

        $.extend(me, defaultConf, conf);
    }

    function loadJson(cb){
        if (!$.isFunction(cb)) {
            return;
        }

        if (typeof window.JSON === 'undefined') {
            require(['json2'], function(_json_){
                if (!!(window.atob && windwo.btoa)) {
                    require(['base64'], function(__base64__){
                        cb();
                    });
                } else {
                    cb();
                }
            });
        } else {
            cb();
        }
    }
    
    /**
     * log 新增一个表情使用记录
     * sort 重新进行表情的排序
     * out 按CommonSmile需要的格式输出表情数据
     */

    /**
     * 获取本地存储的数据
     * @param {Function} cb 回调
     */
    FrequentData.prototype.getFrequentData = function (cb){
        var me = this;
        loadJson(function(){
            lcStorage.getItem(me.localKey, me.localDomain, function(data){
                if (data === null) {
                    me.groupData = []; 
                } else {
                    me.groupData = JSON.parse(window.atob(data));
                }

                if ($.isFunction(cb)) {
                    cb(data);
                }

            });
        });

    };

    /**
     * 设置本地存储的数据
     */
    FrequentData.prototype.setFrequentData = function (cb){
        var me = this;
        loadJson(function(){
            lcStorage.setItem(me.localKey, window.btoa(JSON.stringify(me.groupData.slice(0,me.maxCacheNum))), me.localDomain, function(){
                if ($.isFunction(cb)) {
                    cb();
                }
            });
        });
    };

    /**
     * 获取指定smileId在本地表情里面的数据
     * @param {String} smileId 表情的唯一id
     * @return {Object/Null} 如果有则返回改表情数据，如果没有则返回null
     */
    FrequentData.prototype.getSmileInFrequent = function(smileId){
        var me = this;
        var i,
            len,
            curr = null;

        for (i = 0, len = me.groupData.length; i <len; i++) {
            curr = me.groupData[i];
            if (smileId === curr.id) {
                return curr;
            }
        }

        return null;
    };

    /**
     * 新增一个表情的点击统计
     * @param {Object} data 改表情在CommonSmile中的数据
     */
    FrequentData.prototype.log = function(data){
        var me = this;
        if (data === null) {
            return;
        }

        // clone一份，避免污染已有的
        var insertData = $.extend({}, data);

        if (me.groupData.length === 0) {
            me.getFrequentData(function(){
                me._log(insertData);
            });
        } else {
            me._log(insertData);
        }
    };

    /**
     * 实际的新增，log只是做了本地数据的准备和插入数据的复制
     * @param {Object} insertData 改表情在CommonSmile中的数据
     */
    FrequentData.prototype._log = function(insertData) {
        var me = this;
        var localSmileData = null;

        localSmileData = me.getSmileInFrequent(insertData.id);

        if (localSmileData === null) {
            insertData.count = 1;
            
            me.groupData.push(insertData);
        } else {
            localSmileData.count++;
        }

        me.sort();

        me.setFrequentData();
    };

    /**
     * 对本地数据，按使用次数进行降序排序
     */
    FrequentData.prototype.sort = function() {
        var me = this;
        me.groupData.sort(function(a, b){
            return -(a.count - b.count);
        }); 
    };

    
    /**
     * 按CommonSmile需要的格式输出表情数据
     * @param {Function} cb 回调
     */
    FrequentData.prototype.out = function(cb) {
        var me = this;
        if (!$.isFunction(cb)) {
            return;
        }
        
        if (me.groupData.length === 0) {
            me.getFrequentData(function(){
                me._out(cb);
            });
        } else {
            me._out(cb);
        }
    };

    /**
     * 按CommonSmile需要的格式输出表情数据
     * @param {Function} cb 回调
     */
    FrequentData.prototype._out = function(cb) {
        var me = this;
        var res = {
            // 只展示maxShowNum数量的表情
            data: me.groupData.slice(0, me.maxShowNum)
        };

        if ($.isFunction(me._outMaker)) {
            res = me._outMaker(res);
        }

        cb(res);
    };

    /**
     * 用于根据需要处理最终返回的数据
     * @param {Object} outData _out中预定义的数据
     * @return {Object} 处理后会在out的回调中返回的数据
     */
    FrequentData.prototype._outMaker = function(outData){
        return outData;
    };

    return FrequentData;
});
