const webpack = require('webpack')

// Mapping des imports core-js v2 vers v3
const coreJsMappings = [
    { from: /^core-js\/modules\/es6\.regexp\.split$/, to: 'core-js/es/regexp/split' },
    { from: /^core-js\/modules\/es6\.regexp\.match$/, to: 'core-js/es/regexp/match' },
    { from: /^core-js\/modules\/es6\.regexp\.replace$/, to: 'core-js/es/regexp/replace' },
    { from: /^core-js\/modules\/es6\.regexp\.to-string$/, to: 'core-js/es/regexp/to-string' },
    { from: /^core-js\/modules\/es6\.regexp\.constructor$/, to: 'core-js/es/regexp/constructor' },
    { from: /^core-js\/modules\/es6\.regexp\.search$/, to: 'core-js/es/regexp/search' },
    { from: /^core-js\/modules\/es7\.array\.includes$/, to: 'core-js/es/array/includes' },
    { from: /^core-js\/modules\/es6\.string\.includes$/, to: 'core-js/es/string/includes' },
    { from: /^core-js\/modules\/es6\.string\.starts-with$/, to: 'core-js/es/string/starts-with' },
    { from: /^core-js\/modules\/es6\.string\.ends-with$/, to: 'core-js/es/string/ends-with' },
    { from: /^core-js\/modules\/es6\.string\.iterator$/, to: 'core-js/es/string/iterator' },
    { from: /^core-js\/modules\/es6\.object\.keys$/, to: 'core-js/es/object/keys' },
    { from: /^core-js\/modules\/es6\.array\.find$/, to: 'core-js/es/array/find' },
    { from: /^core-js\/modules\/es6\.array\.find-index$/, to: 'core-js/es/array/find-index' },
    { from: /^core-js\/modules\/es6\.array\.from$/, to: 'core-js/es/array/from' },
    { from: /^core-js\/modules\/es6\.map$/, to: 'core-js/es/map' },
    { from: /^core-js\/modules\/es6\.set$/, to: 'core-js/es/set' },
    { from: /^core-js\/modules\/es6\.symbol$/, to: 'core-js/es/symbol' },
    { from: /^core-js\/modules\/es7\.symbol\.async-iterator$/, to: 'core-js/es/symbol/async-iterator' },
    { from: /^core-js\/modules\/web\.dom\.iterable$/, to: 'core-js/web/dom-collections/iterator' }
]

function getCoreJsPlugins() {
    return coreJsMappings.map(mapping => 
        new webpack.NormalModuleReplacementPlugin(mapping.from, mapping.to)
    )
}

module.exports = getCoreJsPlugins
