function countUncoveredCells(){
  var uncoveredCellCount=0;
  var closedCellCount=0;
  console.log('testing mineindexx',mineIndex);
  for (var key in this.mineIndex){
    console.log('key',key);
    console.log($('#' + key).css("background-color"));
    if($('#' + key).css("background-color") == 'rgb(153,0,255)'){uncoveredCellCount+=1}
    else if($('#' + key).css("background-color") == "rgb(255,255,255)") {closedCellCount+=1}
  }
  return[closedCellCount,uncoveredCellCount];
  console.log(closedCellCount,uncoveredCellCount);
}
