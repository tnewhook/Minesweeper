$(document).ready(function(){
  $('#result').hide();
  var mineSizeArray={
                sm: {size:9,mines:10},
                med: {size:16,mines:40},
                lg: {size:22,mines:99}
               }
  var mineIndex={}
  var surroundingCellsVar = {}
  var mineSizeVar=0;
  var mineCountVar = 0;
  var clickedCells = 0;
  $('#minesweeperLevel input[type=radio]').change(function(){
    console.log('new game');
    $('#msTable').html('');
    $('#msTable').css("display","block")
    $('#minesweeperLevel').css("display","none");
    mineSetup($(this).val());
  });
  $(document).on("click","td",function(){
    if(!$(this).hasClass('FLAG')){
      uncoverCells(this.id);
    }
    event.stopPropagation();
    event.stopImmediatePropagation();
  });

  $(document).on("contextmenu","td",function(event){
    event.preventDefault();
    console.log('markFlag(this.id);',this.id,'html',$(this).html());
    if($(this).html()==("FLAG")){
      $(this).html(this.id)
      $(this).removeClass("FLAG");
    }
    else{
      $("#"+this.id).html("FLAG");
      $(this).addClass("FLAG")
    }

    event.stopPropagation();
    event.stopImmediatePropagation();
  });

  $("#resetButton").click(function(){resetGame()});

  $("#resultResetButton").click(function(){resetGame()});

  function mineSetup(mineSize){
    //set up table
    mineSizeVar=mineSizeArray[mineSize].size;
    mineCountVar = mineSizeArray[mineSize].mines;
    console.log('mineSizeVar',mineSizeVar);
    console.log('setup mineIndex',mineIndex);
    let i,j;
    for(i=0;i<mineSizeVar;i++){
      $('#msTable').append('<tr id=row_'+ i +'></tr>');
      for(j=0;j<mineSizeVar;j++){
        $('#row_'+i).append('<td class="MStableCell" id=' + i +'_'+ j +'>'+ i +'_'+ j +'</td>');
      }
    }
    console.log("mineCountVar",mineCountVar)
    createBombs(mineCountVar,function(){
      console.log('fill mine index');
      fillMineIndex();
    });
  }


  function createBombs(mineCountVar, callback){
    //create number of bombs defined for level, place in random spots
    let i,mineLocationX,mineLocationY,xy;
    for(i=0;i<mineCountVar;i++){
      mineLocationX = Math.floor(Math.random() * (mineSizeVar));
      mineLocationY = Math.floor(Math.random() * (mineSizeVar));
      let xy=mineLocationX+'_'+mineLocationY;
      mineIndex[xy]={X:mineLocationX,Y:mineLocationY,STATUS:'bomb',DISCOVERY:'CLOSED'};
    }
   console.log('Bomb mineindex',mineIndex.toString);
    callback();
  }

  function fillMineIndex(){
    let xy, mineCellCount, surroundingCells;
    //for each cell in table that isn't a bomb, fill with number of bombs in 8 surrounding cells
    for(x=0;x<mineSizeVar;x++){
      for(y=0;y<mineSizeVar;y++){
        let mineCellCount=0
        let xy=x + '_' + y;
//        console.log('x',x,'y',y,"typeof",'mineIndexVar',mineIndexVar,typeof(mineIndex[mineIndexVar]));
        if (typeof(mineIndex[xy])!=="object"){
          let surroundingCells = getMineSurroundings(x,y);
          surroundingCellsVar[xy]=surroundingCells;

          surroundingCells.forEach(function (mineIndexVar, index) {
            if(typeof(mineIndex[mineIndexVar])==='object' && mineIndex[mineIndexVar].STATUS==='bomb'){
//              console.log('we have a bomb');
              mineCellCount++;
            }
          });
          mineIndex[xy]={X:x,Y:y,STATUS:mineCellCount,DISCOVERY:'CLOSED'}
        }
      }
    }
  //  console.log("surroundingCellsVar",surroundingCellsVar);
    return true;
    console.log('mineIndex after filling',mineIndex.toString);
  }

  function getMineSurroundings(x,y){
    //figure out how many bombs in each cell's 8 surrounding cells

    /* TODO: return 8 surrounding cells. Put the CellCount functionality in fillMineIndex()
    (https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements)*/
    let surroundingCells = []
    let mineCount=0,i,j,mineIndexVar;
    for(i=x-1;i<x+2;i++){
      for(j=y-1;j<y+2;j++){
        if(i>=0 && i<mineSizeVar && j>=0 && j<mineSizeVar){
          let mineIndexVar = i + '_' + j
          if(mineIndexVar !=x+'_'+ y){

    //        console.log('mineIndexVar',mineIndexVar);
    //        console.log('typeof(mineIndex[mineIndexVar]:',typeof(mineIndex[mineIndexVar]));

            surroundingCells.push(mineIndexVar);

          }
        }
//        console.log('x',x,'y',y,'i',i,'j',j);
      }
    }
    return surroundingCells;
  }

  function uncoverCells(mineIndexID){
    //show number of bombs in 8 surrounding cells, or if a cell has 0 cells in 8 surrounding cells,
    //clear out all empty spaces vertically and horizontally until either the edge of the table
    //is reached or the number of bombs in surrounding cells >0

    /*
    console.log('mineIndexID',mineIndexID);
    console.log('mineIndexID',mineIndex[mineIndexID]);
    */
    if(mineIndex[mineIndexID].DISCOVERY=='CLOSED'){
      clickedCells++;

      if(clickedCells == (Math.pow(mineSizeVar,2)-mineCountVar)){
        winningFunction();
      }

      if(mineIndex[mineIndexID].STATUS=='bomb'){
          losingFunction();
      }
    }

    mineIndex[mineIndexID].DISCOVERY='OPEN';
    $("#"+mineIndexID).css("background-color","#9900ff");
    $("#"+mineIndexID).html(mineIndex[mineIndexID].STATUS);
    console.log("clickedCells",clickedCells,"mineCountVar",mineCountVar,"cellsToClick",Math.pow(mineSizeVar,2)-mineCountVar);

    //testing cellClickCount
    coveredCellStatus = countUncoveredCells();
    if(coveredCellStatus[0]!=Math.pow(mineSizeVar,2)-mineCountVar ||coveredCellStatus[1]!=mineCountVar){
      console.log('testing covered cells:',coveredCellStatus[0],'math covered cells:',Math.pow(mineSizeVar,2)-mineCountVar);
      console.log('testing open cells:',coveredCellStatus[1],'openCell variable',mineCountVar);
    }
    //end of testing

    if(mineIndex[mineIndexID].STATUS==0){
      let x = mineIndex[mineIndexID].X,y=mineIndex[mineIndexID].Y,i,index,j;
      let surroundingCells = surroundingCellsVar[mineIndexID]
      console.log('x',x,'y',y,'surroundingCells',surroundingCells);

//        console.log(mineIndex[mineIndexID]);
      surroundingCells.forEach(function (mineIndexID,index){
//          console.log('mineIndexID',mineIndexID,'index',index);
        if(typeof(mineIndex[mineIndexID]) !=='undefined' && mineIndex[mineIndexID].DISCOVERY=='CLOSED'){
//          console.log('x',x,'y','do it again')
          uncoverCells(mineIndexID);
        }
      });
    }
  }

  function losingFunction(){
    $("#resetButton").css("display","none");
    $("#resultText").html("YOU LOSE");
    $("#result").fadeIn(2000,function(){
    });
  }

  function winningFunction(){
    $("#resetButton").css("display","none");
    $("#resultText").html("YOU WIN");
    $("#result").fadeIn(2000,function(){
    });
  }

  function resetGame(){
//    console.log('resetGame');
    $('#minesweeperLevel').css("display","block");
    $('#msTable').text("");
    $('input[name="MSLevelrad"]').prop('checked', false);
    let variableKey;
    for (variableKey in mineIndex){
      if (mineIndex.hasOwnProperty(variableKey)){
        delete mineIndex[variableKey];
      }
    }
    mineIndex={}
    mineSizeVar=0;
    mineCountVar = 0;
    clickedCells = 0;
    $("#result").css("display","none");
    $("#resetButton").css("display","block");
  }


})
