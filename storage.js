(function() { 
    //var storage = sessionStorage;
    var storage = localStorage; //cwkTODO use localStorage for now in case I don't have internet

    gmailytics.storage = {
        get: function(itemName) {
            var itemStr = storage.getItem(itemName);
            return itemStr ? JSON.parse(itemStr) : null;
        },
        set: function(itemName, itemValue) {
            storage.setItem(itemName, JSON.stringify(itemValue));
        }
    };
})();
