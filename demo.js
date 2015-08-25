require.config({

    paths: {
        "jquery": "lib/jquery/js/jquery",
        "template": "lib/art-template/js/template",
        "lcStorage": "lib/localStorage/js/localStorage",
        "json2": "lib/json2/js/json2",
        "base64": "lib/base64/js/base64",
        "frequentData": "frequent-data"
    },
    waitSeconds: 90

});


require(["template", "frequentData", "jquery"], function(template, FrequentData, $ ){
    
    var frequentData = new FrequentData({
        localKey: 'frequent-data-demo'
    });
    $(function(){
        var $maxShow = $('#max-show'),
            $maxCache = $('#max-cache'),
            $maxShowNum = $maxShow.next().find('em'),
            $maxCacheNum = $maxCache.next().find('em'),

            $clickArea = $('#click-area'),
            $showArea = $('#show-area'),

            $btnAddMore = $('#add-more'),
            currNum = 4;

        $maxShowNum.text($maxShow.val());
        $maxCacheNum.text($maxCache.val());
        $maxShow.on('change input', function(){
            var v = $maxShow.val();

            $maxShowNum.text(v);
            frequentData.maxShowNum = parseInt(v, 10);
            update();
        });

        $maxCache.on('change input', function(){
            var v = $maxCache.val();

            $maxCacheNum.text(v);
            frequentData.maxCacheNum = parseInt(v, 10);
            update();
        });

        $clickArea.on('click', 'button', function(){
            frequentData.log({
                id: $(this).text(),
                isShow: true
            });            

            update();
        });

        $btnAddMore.click(function(){
            currNum++;
            $clickArea.append(template('template-button', { data: [
                                                {id: 'item'+currNum}
                                           ]}));
        });

        update();

        function update(){
            var htmlStr;
            frequentData.out(function(data){

                htmlStr = template('template-button', data);

                $showArea.html(htmlStr);
            });
        }
    });


});
