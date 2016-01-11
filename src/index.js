import 'babel-polyfill';

import postcss from 'postcss';

const getAllSelectors = s => s.split( /\s{0,},\s{0,}/g );

const props = new Map();

const setProp = ( selector, prop, value ) => {
  getAllSelectors( selector ).forEach( s => {
    props.set( s, {
      ...props.get( s ),
      [ prop ]: value,
    });
  });
};

const getPropValue = ( selectors, prop ) => {
  for ( const selector of selectors ) {
    const selectorProps = props.get( selector );

    if ( selectorProps && selectorProps[ prop ]) {
      return selectorProps[ prop ];
    }
  }

  return 'undefined';
};

const customProps = postcss.plugin( 'postcss-custom-props', () => css => {
  css.walkRules( rule => {
    rule.walkDecls( decl => {
      const { prop, parent: { selector }} = decl;

      let { value } = decl;

      // Value includes variable function call
      if ( value.includes( 'var(' )) {
        // Match var(...)'s
        const matches = value.match( /var\([\w\- ]+\)/g );

        matches.forEach( match => {
          // Get var(...)'s prop
          const matchedProp = match.slice( 4, -1 ).trim();

          // Get stored value of prop
          const propValue = getPropValue([
            ...getAllSelectors( selector ),
            ':root',
          ], matchedProp );

          // Replace var(...) with prop value
          decl.value = value = value.replace( match, propValue ); // eslint-disable-line no-param-reassign,max-len
        });
      }

      // Prop includes custom property definition
      if ( prop.startsWith( '--' )) {
        // Add prop to map
        setProp( selector, prop, value );
        // Remove style declaration
        decl.remove();
      }
    });
  });
});

export default customProps;
