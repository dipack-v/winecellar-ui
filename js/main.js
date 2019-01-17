var AppRouter = Backbone.Router.extend({

    routes: {
        "": "list",
        "wines/page/:page": "list",
        "wines/add": "addWine",
        "wines/:id": "wineDetails",
        "about": "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    list: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({
            success: function () {
                $("#content").html(new WineListView({ model: wineList, page: p }).el);
            }
        });
        this.headerView.selectMenuItem('home-menu');
    },

    wineDetails: function (id) {
        var wine = new Wine({ id: id });
        wine.fetch({
            success: function () {
                $("#content").html(new WineView({ model: wine }).el);
            }
        });
        this.headerView.selectMenuItem();
    },

    addWine: function () {
        var wine = new Wine();
        $('#content').html(new WineView({ model: wine }).el);
        this.headerView.selectMenuItem('add-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

$(document).ajaxSend(function (event, jqxhr, settings) {
    jqxhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
});

$(function () {
    var token = localStorage.getItem("token");
    if (token === null) {
        token = getUrlParameter('token');
        if (token !== '') {
            localStorage.setItem("token", token);
            initialize();
        } else {
            window.location.replace('http://localhost:9200/login.html?redirect_url=' + window.location.href);
        }
    } else {
        initialize();
    }
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

$.ajaxPrefilter(function (options) {
    //if ( options.crossDomain ) {
    options.url = "http://localhost:8762/" + options.url;
    // options.crossDomain = false;
    // }
});

function initialize() {
    utils.loadTemplate(['HeaderView', 'WineView', 'WineListItemView', 'AboutView'], function () {
        app = new AppRouter();
        window.history.replaceState({}, document.title, "/" + "");
        Backbone.history.start();
    });
}