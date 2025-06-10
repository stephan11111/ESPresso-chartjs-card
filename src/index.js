
import pkg from '../package.json'

//import Chart from 'chart.js/auto'
import { Chart, ScatterController, Legend, LinearScale, PointElement, LineElement, Filler} from 'chart.js';
Chart.register(ScatterController, Legend, LinearScale, PointElement, LineElement, Filler);

import { LitElement, html } from 'lit'
import _ from 'lodash'

class Card extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    }
  }

  constructor() {
    super();
    this._initialized = false;
    this.chart = {};
    this._updateFromEntities = [];
    this.chartConfig = {};
  
    //ESPresso
    this._hass = null;
    this._timer_last = 1000.0;	// Set to a value to avoid any diagramm changes are made before loading
    this._last_graph = 0;
    this._shot_active = false;	// set to true if graph should be updated
    this._shot_was_active = false;
    this._update_interval = 0;

    //Entity names
    this._entities = {
      "last_graph": "input_datetime.espresso_last_graph",
      "shot_active": "input_boolean.espress_shot_active",
      "shot_timer": "sensor.shot_timer",
      "pressure": "sensor.pressure",
      "shot_control": "sensor.shot_control",
      "weight": "sensor.weight"
    }
    // Set chart defaults
    Chart.defaults.color = this._evaluateCssVariable('var(--primary-text-color)');
    Chart.defaults.title = {
      fontSize: 14,
      fontStyle: 'normal',
    };
  }

    shouldUpdate(changedProps) {
      if (changedProps.has('_config')) {
        return true
      }

      if (this._config) {
        const oldHass = changedProps.get('hass') || undefined;

        if (oldHass) {
          let changed = false;
          this._updateFromEntities.forEach((entity) => {
            changed = changed || Boolean(this.hass && oldHass.states[entity] !== this.hass.states[entity]);
          });

          return changed
        }
      }

      return false
    }

    firstUpdated() {
      this._initialize();
    }

    updated(changedProps) {
      super.updated();

      if (this._initialized && changedProps.has('_config')) {
        this._initialize();
        return
      }

      
      this._updateChart();
    }

    _initialize() {
	   //console.log("CHART.JS Initalize called");
      // Register zoom plugin
      if (Array.isArray(this._config.register_plugins)) {
        if (this._config.register_plugins.includes('zoom')) {
          Chart.register(plugin);
        }
        if (this._config.register_plugins.includes('annotation')) {
          Chart.register(annotation);
        }
      }

      if (this._initialized) this.chart.destroy();
      this.chartConfig = this._generateChartConfig(this._config);
      const ctx = this.renderRoot.querySelector('canvas').getContext('2d');
      this.chart = new Chart(ctx, this.chartConfig);
      this._initialized = true;	

    }

// ESPresso code
	set hass(hass) {
		if (!hass) {
		  // shouldn't happen, this is only to let typescript know hass != undefined
		  return;
		}
		if (!this._initialized) 
			return;
		
		if (this._hass == null) {
			this._hass = hass;

      //Check if all entities are available
      Object.entries(this._entities).forEach(([key, value]) => {
        if (!this._hass.states[value]) {
          throw new Error("The entity '" + key + "' is set to '" + value + "' but no such entity found. All required entities must be configured. Pls check manual.");
        }
      });

			this._last_graph = this._hass.states[this._entities["last_graph"] ].attributes.timestamp;

      if (this._last_graph == 0) {
        throw new Error("Last graph variable has no valid timestamp. Never made a shot or Home Assistant scripts not run. If all configured correctly, graph will display after first shot");
      }

			// Only request the last graph is no shot is active
			this._shot_active = (this._hass.states[this._entities["shot_active"]].state == "on");

      console.log("Requesting past shot data for timestamp:" + this._last_graph);
      this.ESP_request_history(this._last_graph);
      
			return;
		}
		
		this._hass = hass;
		
		this._shot_active = (this._hass.states[this._entities["shot_active"]].state == "on");
		if (!this._shot_active) {
			if (this._shot_was_active) {
				console.log("set hass -> found that shot is stopped. reloading the graph");
				this._shot_was_active = false;
				this.ESP_request_history(hass.states[this._entities["last_graph"]].attributes.timestamp);
			}
			return;
		}
		
		const time = parseFloat(hass.states[this._entities["shot_timer"]].state);
		//console.log("New time " + time + ". Saved time: " + this._timer_last);
		
		if (this._last_graph != hass.states[this._entities["last_graph"]].attributes.timestamp ) {
			console.log("Starting new graph")
			// a new graph should be created
			this._initialize();
			this._timer_last = time;
			this._last_graph = hass.states[this._entities["last_graph"]].attributes.timestamp;
			this._shot_was_active = true;
		} else if ((time - this._timer_last) > this._update_interval ) {
			//console.log("Adding new with timer_last " + this._timer_last + " and time: " + time);
			// Timer updated, add values to graph
			this.chart.config.data.datasets[0].data.push({x: time, y: hass.states[this._entities["pressure"]].state});
			this.chart.config.data.datasets[1].data.push({x: time, y: hass.states[this._entities["shot_control"]].state});
			this.chart.config.data.datasets[2].data.push({x: time, y: hass.states[this._entities["weight"]].state});
			
			let current_max = this.chart.options.scales["x-axis-1"].max;
			
			if (current_max < time) {
				this.chart.options.scales["x-axis-1"].max = time;
			}

			this.chart.update(0);
			
			this._timer_last = time;
		}
	}

	ESP_request_history(fromtime) {
		const max_graph_length = 120;
		
		let dateObj = new Date(fromtime * 1000);
		const start_date =  dateObj.toISOString();
		const end_date = new Date((fromtime + max_graph_length) * 1000).toISOString();

		const d = { 
			type: "history/history_during_period",
			start_time: start_date,
			end_time: end_date,
			minimal_response: true,
			no_attributes: true,
			entity_ids: [this._entities["shot_timer"], this._entities["pressure"], this._entities["shot_control"], this._entities["weight"]]
		};
		
		//console.log("Requesting history: ");
		//console.log(d);
		this._hass.callWS(d).then(this.loaderCallbackWS.bind(this), this.loaderFailed.bind(this));
	}

  loaderCallbackWS(result)
  {
      let r = [];
  
    console.log("loaderCallbackWS -> Callback from ESPChart received data:");
    //console.log(result);
    //console.log(this.chart);
    
    if (! this._entities["shot_timer"] in result || result[this._entities["shot_timer"]].length < 2) {
      console.log("loaderCallbackWS -> Error. Couldn't find shot timer in historical data or to short");
      return;
    }
  
    this._initialize();

    const a = result[this._entities["shot_timer"]];
    const start_time = parseFloat(a[1].lu) - 0.091;
    let last_known_time = 0.0;

    // First value could be from old timer. Therefore start comparing result 1 and 2. Otherwise for is ended too early
    for( let i = 2; i < a.length; i++ ) {
      if (parseFloat(a[i].s) <= parseFloat(a[i-1].s)) {
        // No more change in time or new Timer
        
        // Set the last added timestamp. If graph is still ongoing, it will be continued from there.
        this._timer_last = parseFloat(a[i].s);
        break;
      }
      last_known_time = parseFloat(a[i].lu);
    }
    
    //last_known_time = (last_known_time);
    const graph_time_span = last_known_time - start_time + 2;
    const end_time = start_time + graph_time_span;
    
    if (graph_time_span <= 0) {
      console.error("graph time span is set to " + graph_time_span + ". Graph start time set to wrong value or no shot data available.");
      return;
    }
    console.log("Time for graph is from " + start_time + " until "+ end_time + " Time span is " + graph_time_span);
    
    //Reset graph data to 0:0
    this.chart.data = this._evaluateConfig(this._config.data);
    this.chart.options.scales["x-axis-1"].max = Math.max(Math.ceil(graph_time_span,0), 15);
    //Add all data to graph
    
    const sensors = [this._entities["pressure"], this._entities["shot_control"], this._entities["weight"]]
    let dataset_count = 0;
    
    for (let s in sensors) {
      let datapoints_added = 0;
      // Check if entity could be loaded from history
      if (! s in result) {
        console.log("Could not find sensor " + s + " in history result. Skipping entity");
        continue;
      }
      let a = result[sensors[s]];
      //console.log("getting result for sensor " + sensors[s]);

      for( let i = 0; i < a.length; i++ ) {
        let t = parseFloat(a[i].lu);

        if (t >= end_time || ((i + 1) == a.length)) {
          // No more change in time or new Timer
          //console.log("loaderCallbackWS: Added " + datapoints_added + " for sensor " + sensors[s]);
      
          if ( sensors[s] == this._entities["shot_control"] && datapoints_added > 0) {
            this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i - 1].s)});
            this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: 0});
          }
          break;
        }				
        // If start time passed, add the value to graph
        if (t >= start_time) {
          if ( sensors[s] == this._entities["shot_control"] ) {
            // Make square
            if (datapoints_added > 0) {
              this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i - 1].s)});
            } else {
              this.chart.config.data.datasets[dataset_count].data.push({x: 0, y: parseFloat(a[i].s)});
            } 
          }
          this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i].s)});
          datapoints_added++;
        }
      }
      dataset_count++;
    }
		
		this.chart.update(1);

    if (this._hass.states[this._entities["shot_active"]].state == "on") {
      this._timer_last = parseFloat(this._hass.states[this._entities["shot_timer"]].state);
      console.log("Completed update with historical data. Found active shot, setting shot time to " + this._timer_last);
    }
  
  } // end loaderCallbackWS
	
    loaderFailed(error) 
    {
        console.error("Database request failure");
        console.error(error);

        if( this.databaseCallback ) 
            this.databaseCallback(false);
		
		// This way the timer_last will be reset to current shot_timer
        this._timer_last = parseFloat(hass.states[this._entities["shot_timer"]].state);
	}

    _updateChart() {
      if (!this._initialized) return
      const chartConfig = this._generateChartConfig(this._config);
      this.chart.data = chartConfig.data;
      this.chart.options = chartConfig.options;
      this.chart.plugins = chartConfig.plugins;
      this.chart.update('none');
	  
	  //console.log ("UPDATE CHART:");
	  //console.log(chartConfig.data);
	  //console.log(this.chart.data);
    }

    _generateChartConfig(config) {
      // Reset dependency entities
      this._updateFromEntities = [];

      let chartconfig = {
        type: config.chart,
        data: this._evaluateConfig(config.data),
        options: this._evaluateConfig(config.options),
        plugins: this._evaluateConfig(config.plugins),
      };

      if (typeof config.custom_options === 'object') {
        if (typeof config.custom_options.showLegend === 'boolean') {
          // chartconfig.options.legend.display = config.options.showLegend; // Defaults to True
          _.set(chartconfig, 'options.plugins.legend.display', config.custom_options.showLegend);
        }
      }

      return chartconfig
    }

    _evaluateConfig(config) {
      // Only allow Object as input
      if (typeof config === 'object') {
        let newObj = _.cloneDeepWith(config, (v) => {
          if (!_.isObject(v)) {
            if (this._evaluateTemplate(v) !== v) {
              // Search for entities inputs
              const regexEntity = /states\[["|'](.+?)["|']\]/g;
              const matches = v.trim().matchAll(regexEntity);
              for (const match of matches) {
                if (!this._updateFromEntities.includes(match[1])) {
                  this._updateFromEntities.push(match[1]);
                }
              }
              return this._evaluateTemplate(v)
            }
            if (this._evaluateCssVariable(v) !== v) {
              return this._evaluateCssVariable(v)
            }
            return v
          }
        });
        return newObj
      } else {
        return config
      }
    }

    _evaluateCssVariable(variable) {
      if (typeof variable !== 'string') return variable

      const regexCssVar = /var[(](--[^-].+)[)]/;
      var r = _.words(variable, regexCssVar)[1];

      if (!r) {
        return variable
      }

      return getComputedStyle(document.documentElement).getPropertyValue(r)
    }

    _evaluateTemplate(template) {
      if (typeof template === 'string') {
        const regexTemplate = /^\${(.+)}$/g;
        if (_.includes(template, '${') && template.match(regexTemplate)) {

          const user = this.hass?.user;
          const states = this.hass?.states;
          const hass = this.hass;

          // Workaround to avoid rollup to remove above variables
          if (!user || !states || !hass) console.log('this never executes');

          const evaluated = new Function(`return ${template.trim().substring(2, template.length - 1)}`)();
          //const evaluated = eval(template.trim().substring(2, template.length - 1));

          if (Array.isArray(evaluated)) {
            return evaluated.map((r) => this._evaluateCssVariable(r))
          }

          const regexArray = /^\[[^\]]+\]$/g;
          if (typeof evaluated === 'string' && evaluated.match(regexArray)) {
            try {
              const parsed = typeof evaluated === 'string' ? JSON.parse(evaluated) : evaluated;
              return parsed.map((r) => this._evaluateCssVariable(r));
              //return eval(evaluated).map((r) => this._evaluateCssVariable(r))
            } catch (e) {
              return evaluated
            }
          }
          return evaluated
        }
      }
      return template
    }

    setConfig(config) {  
      // Deep clone
      //console.log ("Config is");
      //console.log(config);
      this._config = JSON.parse(JSON.stringify(config));

      if (this._config.entities.constructor == Object) {
        Object.entries(this._config.entities).forEach(([key, value]) => {
          //console.log(key, value);
          if (this._entities[key]) {
            this._entities[key] = value;
            console.log("Setting _entities[" + key + "] to " + value);
          } else {
            throw new Error("Unkown entity name " + key + "is set. Please fix config.");
          }
        });
      }
      
      if (this._config.updateinterval) {
        this._update_interval = parseFloat(this._config.updateinterval);
        console.log("Setting update interval to " + this._update_interval);
      }

      //Must be scatter chart
      this._config.chart = "scatter";
    }

    getCardSize() {
      return 4
    }

    render() {
      return html`
      <ha-card style="padding: 16px">
        <canvas>Your browser does not support the canvas element.</canvas>
      </ha-card>
    `
    }
  }
  customElements.define(pkg.name, Card);
  console.info(
    `%c ${pkg.name} ${pkg.version} \n%c chart.js ${pkg.dependencies['chart.js']}`,
    'color: white; font-weight: bold; background: #ff6384',
    'color: #ff6384; font-weight: bold'
  );