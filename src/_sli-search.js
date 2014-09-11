
// for SLI search



function sli_init(searchType) {

if(!searchType) { searchType = 'products'; }
  if( typeof window.sliAutocomplete == "undefined" || 
      typeof window.sliAutocomplete.input == "undefined" || 
      typeof window.sliAutocomplete.input.opts == "undefined" || 
      typeof window.sliAutocomplete.input.opts.base == "undefined" )
  {
    window.setTimeout( sli_init, 300 );
  } else {
    window.sliAutocomplete.input.opts.base = 'http://search.kingarthurflour.com/search?af=type:'+ searchType +'&ts=rac&w=';
  }
}