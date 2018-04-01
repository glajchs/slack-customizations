var pluginsSectionLink = $("<li><button type=\"button\" class=\"btn_basic sidebar_menu_list_item\" data-section=\"plugins\">Plugins</button></li>");
pluginsSectionLink.unbind("click.slackplugins");
pluginsSectionLink.bind("click.slackplugins", function (event){
    console.log("activate!");
});
$(".prefs_modal .sidebar_menu_list").append(pluginsSectionLink);





// var n = TS.interop.channels.getImById(t.channel);
// if (!n) {
//     TS.error('unknown im: "' + t.channel + '"');
//     return
// }
// if (!n.is_open)
//     return;
// n.is_open = false;
// TS.model.active_im_id == t.channel && TS.client && TS.client.activeChannelDisplayGoneAway();
// TS.ims.closed_sig.dispatch(n)

var prefsAdvancedHTML = window.TS.templates.prefs_advanced();
prefsAdvancedHTML += "<hr>\n";
prefsAdvancedHTML += "<h2 id=\"prefs_plugins\" class=\"inline_block\">Plugins</h2>\n";
prefsAdvancedHTML += "<p>\n";
prefsAdvancedHTML += "<label class=\"checkbox bottom_margin\">\n";
prefsAdvancedHTML += "<input id=\"plugins_enabled\" type=\"checkbox\" data-inline-saver=\"#prefs_plugins\">\n";
prefsAdvancedHTML += "Plugins Enabled<br>\n";
prefsAdvancedHTML += "<span class=\"normal\">This will enable Slack plugins.</span>\n";
prefsAdvancedHTML += "</label>\n";
window.TS.templates.prefs_advanced = function () { return prefsAdvancedHTML; };




var originalPrefsStart = TS.ui.prefs_dialog.start;
TS.ui.prefs_dialog.start = function (a, b) {
    originalPrefsStart(a, b);

    $("#plugins_enabled").prop("checked", true === TS.prefs.getPref("plugins_enabled")).removeClass("hidden");
    $("#plugins_enabled").on("change", function() {
        var name = "plugins_enabled";
        var value = !!$(this).prop("checked");
        console.log("enabling!", name, value);
        TS.prefs.setPrefLocal(name, value);
    });
};











