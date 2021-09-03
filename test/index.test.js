const { compile } = require( '../' )
const vm = require( 'vm' )

function buildFn( fnString ) {
  const context = {
    fn: null
  }

  const script = new vm.Script( `fn = ${ fnString }` )
  vm.createContext( context )
  script.runInContext( context )

  return context.fn
}

test( `run compiled function`, () => {
  const fnString = compile( `.a { color: #111; }.b { color: #222; }` )

  const getCritical = buildFn( fnString )

  expect( getCritical( [
    'a'
  ] ) ).toBe( `.a { color: #111; }` )

  expect( getCritical( [
    'b'
  ] ) ).toBe( `.b { color: #222; }` )

  expect( getCritical( [
    'a',
    'b'
  ] ) ).toBe( `.a { color: #111; }.b { color: #222; }` )
} )

test( `preserve id`, () => {
  expect(
    compile( `#id { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass #id { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass, #id { color: #111; }` )
  ).toMatchSnapshot()
} )

test( `preserve tag`, () => {
  expect(
    compile( `tag { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass tag { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass, tag { color: #111; }` )
  ).toMatchSnapshot()
} )

test( `preserve universal`, () => {
  expect(
    compile( `* { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `html * { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass * { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass, * { color: #111; }` )
  ).toMatchSnapshot()
} )

test( 'only class', () => {
  expect(
    compile( `.klass { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass::before { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass:hover { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass, .klass2 { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass > .klass2 { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass + .klass2 { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass ~ .klass2 { color: #111; }` )
  ).toMatchSnapshot()

  expect(
    compile( `.klass::before { color: #111; }` )
  ).toMatchSnapshot()
} )
