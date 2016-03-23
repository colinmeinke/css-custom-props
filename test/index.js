import expect from 'expect';
import postcss from 'postcss';

import customProps from '../src';

const process = css => postcss([ customProps() ]).process( css );

describe( 'custom property definition', () => {
  it( 'should replace `var(--foo)` value with custom property', () => {
    const input = ':root { --foo: red; --bar: var(--foo) } h1 { color: var(--bar); }';
    const expectedOutput = 'h1 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should remove the definition from output', () => {
    const input = ':root { --foo: red; }';
    const expectedOutput = ':root { }';

    return process( input ).then(({ css }) => {
      expect( css ).toEqual( expectedOutput );
    });
  });
});

describe( 'rule', () => {
  it( 'should replace `var(--foo)` value with custom property', () => {
    const input = ':root { --foo: red; } h1 { color: var(--foo); }';
    const expectedOutput = 'h1 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var(--foo) var(--bar)` value with multiple custom properties', () => {
    const input = ':root { --foo: 20px; --bar: 10px; } h1 { padding: var(--foo) var(--bar); }';
    const expectedOutput = 'h1 { padding: 20px 10px; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should only replace `var(--foo)` from `color(var(--foo) l(25%))` value', () => {
    const input = ':root { --foo: red; } h1 { color: color(var(--foo) l(25%)); }';
    const expectedOutput = 'h1 { color: color(red l(25%)); }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var( --foo )` value that includes whitespace', () => {
    const input = ':root { --foo: red; } h1 { color: var( --foo ); }';
    const expectedOutput = 'h1 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var(--foo-bar)` value that is kebab-case', () => {
    const input = ':root { --foo-bar: red; } h1 { color: var( --foo-bar ); }';
    const expectedOutput = 'h1 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var(--foo_bar)` value that is snake-case', () => {
    const input = ':root { --foo_bar: red; } h1 { color: var( --foo_bar ); }';
    const expectedOutput = 'h1 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var(--foo)` value after definition on seperate multi-selector rule', () => {
    const input = 'h1, h2 { --foo: red; } h2 { color: var(--foo); }';
    const expectedOutput = 'h2 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });

  it( 'should replace `var(--foo)` value in multi-selector rule after seperate definition', () => {
    const input = 'h1 { --foo: red; } h1, h2 { color: var(--foo); }';
    const expectedOutput = 'h1, h2 { color: red; }';

    return process( input ).then(({ css }) => {
      expect( css ).toInclude( expectedOutput );
    });
  });
});
