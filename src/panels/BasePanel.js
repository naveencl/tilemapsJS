/**
 * @module Pixi States
 * @namespace springroll.pixi
 * @requires Core, States, UI, Sound, Pixi Display, Pixi UI
 */
(function() {
  //Import classes
  var Container = include("PIXI.Container"),
    Application;

  /**
	 * Panel with convenience properties to the config, background and app.
	 * @class BasePanel
	 * @extends PIXI.Container
	 * @constructor
	 */
  var BasePanel = function() {
    if (!Application) {
      Application = include("springroll.Application");
    }

    Container.call(this);

    /**
		 * Reference to the app
		 * @property {Application} app
		 */
    this.app = Application.instance;

    /**
		 * Reference to the app's config
		 * @property {object} config
		 */
    this.config = this.app.config;
  };

  //Extend the container
  var p = extend(BasePanel, Container);

  /**
	 * Should be called whenever a state enters this panel, Implementation-specific
	 * @method setup
	 */
  p.setup = function() {
    //Implementation specific
  };

  /**
	 * Should be called whenever a state exits this panel, the default
	 * behavior is to remove all children of the panel. It will stop
	 * any movieclip, destroy any objects, remove DwellTimers, etc.
	 * @method teardown
	 */
  p.teardown = function() {
    //TODO: This is default framework implementation for Easel panels. Need to check if we need it here at all since we use Pixi panels.
  };

  /**
	 * Removes a collection of objects from the stage and destroys them if we cant.
	 * @example this.removeChildren(this.skipButton, this.character);
	 * @method cleanupChildren
	 * @param {array|*} children Assets to clean can either be individual children or collections of children
	 */
  p.cleanupChildren = function(children) {
    var child,
      i,
      j,
      len = arguments.length;

    for (i = 0; i < len; i++) {
      child = arguments[i];

      // Check for null/undefined arguments
      if (!child) continue;

      // test the current argument to see if itself is
      // an array, if it is, run .cleanupChildren() recursively
      if (Array.isArray(child) && child.length > 0) {
        this.cleanupChildren.apply(this, child);
        continue;
      }

      // If there's an animation playing stop it
      if (this.app.animator) this.app.animator.stop(child, true);

      // Stop movie clips
      if (child.stop) child.stop();

      // Destroy anything with a destroy method
      if (child.destroy) child.destroy();

      // Recurisvely remove all children
      if (child.children) child.removeChildren();
    }
  };

  /**
	 * Destroy and don't use after this
	 * @method destroy
	 */
  p.destroy = function() {
    this.app = null;
    this.config = null;
    if (this.children) this.removeChildren();
  };

  //Assign to namespace
  namespace("springroll.pixi").BasePanel = BasePanel;
})();
