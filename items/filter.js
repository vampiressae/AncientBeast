$(function() {

    var activeFilter = [];
    var stats = ['health', 'regrowth', 'fatigue', 'energy', 'meditation', 'delay', 'offense', 'defense', 'movement'];
    var masteries = ['pierce', 'slash', 'crush', 'shock', 'burn', 'frost', 'poison', 'mental', 'sonic'];
    
    $("table.itemFeatures td").click(function() {
        var feature = $(this).attr('itemFeature');
        var featureIndex = $.hasIndex(activeFilter, feature);
        if (featureIndex == 0) {
            activeFilter.push(feature);
        } else {
            activeFilter = activeFilter.splice(featureIndex, 1);
        }
        
        // apply filters
        $("item").each(function() {
            var item = this;
            var appliesToFilters = true;
            $.each(activeFilter, function() {
                if (!item.hasClass("has" + this)) {
                    appliesToFilters = false;
                    return; // break $.each
                }
            });
            
            // fade
            if (!appliesToFilters) {
                item.fadeTo(0.2, "slow");
            } else {
                item.fadeTo(1.0, "slow");
            }
        });
    });
}

