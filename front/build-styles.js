import StyleDictionary from 'style-dictionary';

console.log('Build started...');
['light', 'dark'].map(function(theme) {
    console.log('\n======================================');
    console.log(`\nProcessing: [${theme}]`);
    const StyleDictionaryExtended = StyleDictionary.extend(getStyleDictionaryConfig(theme, "web"));
    StyleDictionaryExtended.buildPlatform('scss');
    console.log('\nEnd processing');
})

console.log('\n======================================');
console.log('\nBuild completed!');

function getStyleDictionaryConfig(theme, platform) {
  return {
      "source": [
          `src/styles/tokens/themes/${theme}/*.json`,
          "src/styles/tokens/globals/**/*.json"
      ],
      "platforms": {
        "scss": {
          "transformGroup": "scss",
          "buildPath": "static/themes/",
          "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables"
          }]
        }
      }
  };
}
