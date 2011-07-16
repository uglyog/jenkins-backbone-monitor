Build = Backbone.Model.extend({

});

Builds = Backbone.Collection.extend({
  model: Build,

  url: function()
  {
    return JenkinsMontorConfig.jenkinsUrl + '/api/json?depth=1';
  },

  parse: function(response)
  {
    return response.jobs;
  }
});

StatusView = Backbone.View.extend({

  initialize: function ()
  {
    _(this).bindAll('render');
  },

  render: function ()
  {
    $(this.el).html('<span>' + new Date() + '</span><span>Builds: ' + this.collection.length + '</span>');
  }

});

GraphView = Backbone.View.extend({

  initialize: function ()
  {
    _(this).bindAll('render');
    this.graph = new $jit.ST({
      'injectInto':'build-graph',
      height: $(this.el).height(),

      //set duration for the animation
      duration: 800,
      //set animation transition type
      transition: $jit.Trans.Quart.easeInOut,
      //set distance between node and its children
      levelDistance: 50,
      //enable panning
      Navigation: {
        enable:true,
        panning:true
      },

      Node: {
        height: 20,
        width: 60,
        type: 'rectangle',
        color: '#aaa',
        overridable: true
      },

      Edge: {
        type: 'bezier',
        overridable: true
      },

      //This method is called on DOM label creation.
      //Use this method to add event handlers and styles to
      //your node.
      onCreateLabel: function(label, node){
          label.id = node.id;
          label.innerHTML = node.name;
          //set label styles
          var style = label.style;
          style.width = 60 + 'px';
          style.height = 17 + 'px';
          style.cursor = 'pointer';
          style.color = '#333';
          style.fontSize = '0.8em';
          style.textAlign= 'center';
          style.paddingTop = '3px';
      },

    });
  },

  render: function ()
  {
    this.graph.loadJSON({
      id: "root",
      name: "Builds",
      data: {},
      children: []
    });
    this.graph.compute();
    this.graph.plot();
  }
});