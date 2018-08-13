import test from 'ava';
import PostcssTester from 'ava-postcss-tester';

import postcss from 'postcss';
import postcssImport from 'postcss-import';

import postcssImportExtGlob from '.';

const tester = new PostcssTester({
  postcss,
  plugin: postcssImportExtGlob
});

test('simple test', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css";';
  const output = `
    @import "${__dirname}/fixtures/css/foo/bar.css";
    @import "${__dirname}/fixtures/css/foo/foo.css";
  `;
  await tester.test(input, output, t);
});

test('simple test postcss-import', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css";';
  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
  `;
  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport]
  });
});

test('sort option', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css";';
  const output = `
    .foo {
      display: block;
    }
    .bar {
      display: inline-block;
    }
  `;
  await tester.test(input, output, t, {
    pluginOptions: {
      sort: 'desc'
    },
    pluginsAfter: [postcssImport]
  });
});

test('multiple globs', async t => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css";
    @import-glob "fixtures/css/*.css";
  `;
  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
    div {
      margin: auto;
    }
  `;
  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport]
  });
});

test('multiple globs inline', async t => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css", "fixtures/css/*.css";
  `;
  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
    div {
      margin: auto;
    }
  `;
  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport]
  });
});

test('error empty param test', async t => {
  const input = '@import-glob';
  const output = new Error('No string found with rule @import-glob ');
  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport]
  });
});
