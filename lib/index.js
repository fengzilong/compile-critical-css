const postcss = require( 'postcss' )
const parser = require( 'postcss-selector-parser' )
const { nanoid } = require( 'nanoid' )

const TYPES = {
  CLASS: 'class',
  ID: 'id',
  TAG: 'tag',
  UNIVERSAL: 'universal',
  PSEUDO: 'pseudo',
}

exports.compile = function ( input ) {
  const result = reset( {} )

  function reset( target ) {
    target[ TYPES.CLASS ] = []
    target[ TYPES.ID ] = []
    target[ TYPES.TAG ] = []
    target[ TYPES.UNIVERSAL ] = []
    target[ TYPES.PSEUDO ] = []

    return target
  }

  const processor = parser( selectors => {
    selectors.walk( selector => {
      const { type, value } = selector

      if (
        type === TYPES.CLASS ||
        type === TYPES.ID ||
        type === TYPES.TAG ||
        type === TYPES.UNIVERSAL ||
        type === TYPES.PSEUDO
      ) {
        result[ type ].push( value )
      }
    } )
  } )

  const root = postcss.parse( input )

  const document = postcss.document()
  document.append( root )

  const map = Object.create( null )
  const ruleMap = new Map()

  document.walkRules( rule => {
    if ( rule.parent.type === 'atrule' && rule.parent.name === 'keyframes' ) {
      return
    }

    reset( result )

    processor.processSync( rule.selector )

    // if current selector contains id / tag / * / :pseudo / ::pseudo
    // then preserve entire rule, skip processing
    // eslint-disable-next-line no-magic-numbers
    const ZERO = 0
    if (
      result[ TYPES.ID ].length > ZERO ||
      result[ TYPES.TAG ].length > ZERO ||
      result[ TYPES.UNIVERSAL ].length > ZERO ||
      result[ TYPES.PSEUDO ].length > ZERO
    ) {
      return
    }

    const id = nanoid()

    map[ id ] = result.class
    ruleMap.set( id, rule.toString() )

    const comment = postcss.comment( { text: id } )
    rule.replaceWith( comment )
  } )

  let fnString = `
function getCriticalCSS( classlist = [] ) {
  const $in = ( classlist, selectorClasslist ) => {
    return classlist.some( klass => selectorClasslist.includes( klass ) )
  }
  return \`${ document.toResult() }\`
}`.trim()

  ruleMap.forEach( ( ruleString, id ) => {
    fnString = fnString.replace(
      new RegExp( `\\/\\*\\s*${ id }\\s*\\*\\/`, 'g' ),
      `\${ $in( classlist, ${ JSON.stringify( map[ id ] ) } ) ? ${ JSON.stringify( ruleString ) } : "" }`
    )
  } )

  return fnString
}
