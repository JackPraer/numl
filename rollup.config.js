import minify from 'rollup-plugin-babel-minify';
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace';
import pkg from './package.json';
import cssnano from 'cssnano';

const ENV = process.env.ROLLUP_WATCH ? 'development' : 'production';

export default [
  {
    input: 'src/pack.js',
    external: ['ms'],
    output: [
      { name: 'Nude', file: pkg.module, format: 'iife', exports: 'default' }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': '"production"',
      }),
      minify({
        comments: false,
      }),
      postcss({
        plugins: [cssnano()],
        extensions: ['.css'],
      })
    ]
  },
  {
    input: 'src/pack.js',
    external: ['ms'],
    output: [
      {
        name: 'Nude',
        file: pkg.module.replace('.js', '.dev.js'),
        format: 'iife',
        exports: 'default'
      }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': '"development"',
      }),
      postcss({
        extensions: ['.css'],
      })
    ]
  },
  {
    input: 'src/index.js',
    external: ['ms'],
    output: [
      { name: 'Nude', file: pkg.module.replace('.js', '.module.js'), format: 'es' }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': '"production"',
      }),
      minify({
        comments: false,
      }),
      postcss({
        plugins: [cssnano()],
        extensions: ['.css'],
      })
    ]
  },
  {
    input: 'src/index.js',
    external: ['ms'],
    output: [
      {
        name: 'Nude',
        file: pkg.module.replace('.js', '.module.dev.js'),
        format: 'es'
      }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': '"development"',
      }),
      postcss({
        extensions: ['.css'],
      })
    ]
  },
  {
    input: 'src/colors.js',
    external: ['ms'],
    output: [
      { name: 'HTML Colors Module', file: pkg.module.replace('.js', '.colors.js'), format: 'es' }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': '"production"',
      }),
    ]
  },
];
