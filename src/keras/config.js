const _ = require('lodash');

const utils = require('../utils/utils');


function configure(dst, src) {
  const mdst = _.clone(dst);
  const keys = Object.keys(mdst);
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] in src) {
      mdst[keys[i]] = src[keys[i]];
    }
  }
  return mdst;
}

/**
 * Object to store and compile python arguments.
 * @memberof mentality.keras
 */
class Config {
  /**
   * Constructor.
   * @param  {Object} defaultConfig Default configurations for the object.
   * @param  {Object} desiredConfig Desired configuration.
   */
  constructor(defaultConfig, desiredConfig) {
    const config = configure(defaultConfig, desiredConfig);

    /**
     * This function returns a deep clone of the default configuration. Therefore, modify return object would not affect the default configuration.
     * @return {Object} Default configuration.
     */
    this.getDefaultConfig = () => _.cloneDeep(defaultConfig);

    /**
     * Get stored configuration/
     * @param  {Object} opts            Options for returned configuration.
     * @param  {Bool}   opts.verbose    If this value in set to `true`, returned configuration will contain non-set properties. If this value is `false`, only returns properties that are set.
     * @return {Object}                 Set configuration.
     */
    this.getConfig = (opts = {}) => {
      const mdefaultConfig = this.getDefaultConfig();
      const {
        verbose,
      } = opts;

      let res = {};

      if (verbose) {
        res = _.clone(config);
      } else {
        const keys = Object.keys(config);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          if (config[key] !== mdefaultConfig[key]) {
            res[key] = config[key];
          }
        }
      }

      return res;
    };

    /**
     * Set property value to configuration by `key`. If `key` is not in `defaultConfiguration`, do nothing.
     * @param  {string} key   Name of property.
     * @param  {Any}    value Property value.
     */
    this.setConfigByKey = (key, value) => {
      if (!(key in defaultConfig)) {
        return;
      }

      config[key] = value;
    };

    /**
     * Get a configuration property by `key`.
     * @param  {string} key Name of property.
     * @return {Any}        Property value.
     */
    this.getConfigByKey = key => config[key];
  }

  /**
   * Export configuration as python argument strings.
   * 
   * @param  {Object}   opts Options.
   * @param  {Bool}     opts.verbose    If this value in set to `true`, returned configuration will contain non-set properties. If this value is `false`, only returns properties that are set.
   * @return {string[]}      Python argument string as array.
   */
  toParams(opts = {}) {
    const config = this.getConfig(opts);

    let params = Object.keys(config);
    params = params.map(param => `${param}=${utils.toString(config[param])}`);
    return params;
  }
}

module.exports = Config;
